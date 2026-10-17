// MCP server for the Treaty Land Atlas: lets an AI assistant talk with someone about the land where
// they live, the treaties that took it, the promises broken, and the people restoring it.
// Read-only. It reads the atlas's published data (public, CC BY 4.0) and, for homelands, asks
// Native Land Digital live; nothing a user sends is stored or logged.

import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { placeReport, routeFor, supportFor } from './atlas.gen.js';
import { geocode } from './geocode.js';
import type { WhereData, WhereReport } from '../../src/lib/where';
import type { SupportIndex } from '../../src/lib/support';

export interface McpEnv {
  NLD_KEY?: string;
  NLD_ENABLED?: string;
  /** where the atlas's published data lives */
  ATLAS_DATA?: string;
}

const SITE = 'https://landback.land';
const HOUR = 3600_000;

type Lite = WhereData['lite'];
interface Atlas extends WhereData {
  search: [string, string, string, string[], number | null][];
  at: number;
}

let cache: Promise<Atlas> | null = null;
/** The atlas's own public data, kept in memory for an hour between requests. */
function atlas(env: McpEnv, fetchImpl: typeof fetch): Promise<Atlas> {
  const base = env.ATLAS_DATA ?? `${SITE}/data`;
  const fresh = async (): Promise<Atlas> => {
    const get = (p: string) =>
      fetchImpl(`${base}/${p}`).then((r) => {
        if (!r.ok) throw new Error(`${p}: ${r.status}`);
        return r.json();
      });
    const m = (await get('manifest.json')).layers as Record<string, string>;
    const [cessions, today, stories, headlines, lite, story, support, search] = await Promise.all([
      get(m['cessions']!),
      get(m['today-aiannh']!),
      get('tables/cession-stories.json'),
      get('tables/headlines.json'),
      get('graph-lite.json'),
      get('tables/story.json'),
      get('tables/support.json'),
      get('search-index.json'),
    ]);
    return { cessions, today, stories, headlines, lite, story, support, search, at: Date.now() };
  };
  cache = (cache ?? fresh()).then((a) => (Date.now() - a.at > HOUR ? fresh() : a));
  cache.catch(() => (cache = null));
  return cache;
}

const url = (p: string | null | undefined) => (p ? `${SITE}${p}` : null);
const text = (s: string, data?: unknown) => ({
  content: [{ type: 'text' as const, text: s }],
  ...(data ? { structuredContent: data as Record<string, unknown> } : {}),
});

async function homelands(env: McpEnv, lat: number, lng: number, fetchImpl: typeof fetch) {
  if (!env.NLD_KEY || env.NLD_ENABLED === 'false') return null;
  const u = new URL('https://native-land.ca/api/index.php');
  u.searchParams.set('maps', 'territories');
  u.searchParams.set('position', `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`);
  u.searchParams.set('key', env.NLD_KEY);
  try {
    const res = await fetchImpl(u, { headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    const list = (await res.json()) as { properties?: { Name?: string; description?: string } }[];
    return list
      .filter((x) => x?.properties?.Name)
      .map((x) => ({ name: x.properties!.Name!, url: x.properties!.description ?? null }));
  } catch {
    return null;
  }
}

function describe(
  r: WhereReport,
  place: string,
  lands: { name: string }[] | null,
  ix: SupportIndex,
) {
  const lines: string[] = [];
  lines.push(`Place: ${place || `${r.lat}, ${r.lng}`} (coordinates rounded to about 100 m).`);
  if (lands?.length)
    lines.push(
      `Homelands mapped here by Native Land Digital (live; community-drawn, not legal boundaries): ${lands.map((l) => l.name).join('; ')}.`,
    );
  if (!r.cessions.length)
    lines.push(
      "Royce's maps of cessions (1784-1894) do not cover this point; land here was likely taken earlier by colonies or states, or by other means.",
    );
  for (const c of r.cessions)
    lines.push(
      `${c.year}: ${c.label}, recorded as ceded by ${c.how}${c.nations.length ? ` from ${c.nations.map((n) => n.label).join(', ')}` : ''}.` +
        (c.instrument
          ? ` Instrument: ${c.instrument.label}${c.instrument.headline ? ` (${c.instrument.headline})` : ''} ${url(c.instrument.path) ?? ''}`
          : '') +
        ` Basis for "how": ${c.how_basis}`,
    );
  for (const b of r.broken)
    lines.push(`Broken promise: ${b.label}. ${b.headline ?? ''} ${url(b.path) ?? ''}`);
  for (const c of r.cases)
    lines.push(`Court case: ${c.label}. ${c.headline ?? ''} ${url(c.path) ?? ''}`);
  if (r.lands_here.length)
    lines.push(`Inside Native lands today (Census): ${r.lands_here.join('; ')}.`);
  if (r.lands_near.length)
    lines.push(
      `Nearby Native lands today: ${r.lands_near.map((l) => `${l.name} (~${l.km} km)`).join('; ')}.`,
    );
  if (r.chapter)
    lines.push(
      `Larger story (${r.chapter.start_year}-${r.chapter.end_year}): ${r.chapter.title}. ${r.chapter.lede}`,
    );
  if (r.support.today.length)
    lines.push(
      `Nations today that carry this history: ${r.support.today.map((t) => `${t.label} ${url(t.path) ?? ''}`).join('; ')}.`,
    );
  const orgs = [...r.support.direct, ...r.support.nearby, ...r.support.national].map(
    (id) => ix.orgs[id]!,
  );
  if (orgs.length)
    lines.push(
      `Organizations doing the work: ${orgs.map((o) => `${o.label} (${o.kind}${o.donate ? `; give: ${o.donate}` : ''}) ${url(o.path) ?? ''}`).join('; ')}.`,
    );
  lines.push(`Full page: ${SITE}/where/#at=${r.lat},${r.lng}`);
  lines.push(
    'Source: Treaty Land Atlas (landback.land), CC BY 4.0. Early release; not reviewed by nations or lawyers; not legal advice.',
  );
  return lines.join('\n');
}

export const INSTRUCTIONS = `The Treaty Land Atlas (landback.land) is a public, sourced record of United States treaties with Native nations, the land the United States recorded as ceded (C. C. Royce's 1899 maps), treaty violations, court cases, Native lands today, and the organizations restoring land and law.

When someone asks about where they live:
1. Call whose_land. Lead with learning: whose homelands these are, how and when the land was taken, the promises broken. Quote the atlas's wording and give its links; do not add facts the tools did not return.
2. Name living nations as they name themselves, and point to their own pages. Do not speak for any nation or claim to know its views. Homeland maps are community-drawn, not legal boundaries.
3. Then, second, offer ways to support the people doing the work (support_the_work), preferring the nations' own governments and Native-led groups. Gifts go directly to each organization's own site.
Use get_record and search_atlas to go deeper. Say plainly when the record is thin or a summary is AI-assisted. Nothing here is legal advice or a legal description of title.`;

export function mcpHandler(env: McpEnv, fetchImpl: typeof fetch = fetch) {
  return createMcpHandler(
    (server) => {
      server.registerTool(
        'whose_land',
        {
          title: 'Whose land is this?',
          description:
            'The treaty history of a place in the United States: homelands, the cessions that took the land (year, how, from whom, the treaty), broken promises, court cases, Native lands nearby today, and who is doing the work there. Give an address, town or ZIP code, or coordinates.',
          inputSchema: z.object({
            place: z
              .string()
              .min(3)
              .max(200)
              .optional()
              .describe('An address, "Town, ST", or ZIP code'),
            lat: z.number().min(-90).max(90).optional(),
            lng: z.number().min(-180).max(180).optional(),
          }),
          annotations: { readOnlyHint: true, openWorldHint: true },
        },
        async ({ place, lat, lng }) => {
          let at: { lat: number; lng: number; place: string; state: string | null } | null = null;
          if (lat != null && lng != null)
            at = {
              lat: Math.round(lat * 1000) / 1000,
              lng: Math.round(lng * 1000) / 1000,
              place: '',
              state: null,
            };
          else if (place) at = await geocode(place, fetchImpl);
          if (!at)
            return text(
              'No match for that place. Try "Town, ST" or a ZIP code, or give lat and lng.',
            );
          const a = await atlas(env, fetchImpl);
          const r = placeReport(a, at.lat, at.lng);
          if (at.state && !r.states.length)
            r.support = supportFor(a.support, {
              nations: r.nations.map((n) => n.id),
              states: [at.state],
            });
          const lands = await homelands(env, at.lat, at.lng, fetchImpl);
          return text(describe(r, at.place, lands, a.support), {
            ...r,
            place: at.place,
            homelands: lands,
          });
        },
      );

      server.registerTool(
        'get_record',
        {
          title: 'Read a record',
          description:
            'One atlas record by id (e.g. TLA-T-369, geo-royce-426, nat-pd-osage-nation, case-mcgirt-v-oklahoma): its facts, its sourced summary where one exists, its sources, and its connections.',
          inputSchema: z.object({ id: z.string().regex(/^[A-Za-z0-9-]{2,80}$/) }),
          annotations: { readOnlyHint: true },
        },
        async ({ id }) => {
          const a = await atlas(env, fetchImpl);
          const n = (a.lite as Lite).nodes.find(
            (x) => x[0] === id || x[0].toLowerCase() === id.toLowerCase(),
          );
          if (!n) return text(`No record with id ${id}. Use search_atlas to find one.`);
          const base = env.ATLAS_DATA ?? `${SITE}/data`;
          const res = await fetchImpl(`${base}/entities/${n[1]}/${n[0]}.json`);
          if (!res.ok) return text(`Record ${id} could not be read right now.`);
          const e = (await res.json()) as {
            node: Record<string, unknown> & { overlay?: Record<string, unknown> };
            neighbors: Record<string, { type: string; label: string; path: string | null }>;
          };
          const nationIds = (a.lite as Lite).nodes
            .filter((x) => x[1] === 'Nation')
            .map((x) => x[0]);
          const o = e.node.overlay;
          const keep = Object.fromEntries(
            Object.entries(e.node).filter(
              ([k, v]) => v != null && !['overlay', 'provenance', 'names'].includes(k),
            ),
          );
          const lines = [
            `${n[2]} (${n[1]}) ${url(routeFor(n[0], n[1], nationIds)) ?? ''}`,
            o?.['narrative']
              ? `Summary (AI-assisted from the sources, labeled on the site): ${o['headline'] ?? ''}\n${o['narrative']}`
              : '',
            `Connections: ${Object.values(e.neighbors)
              .slice(0, 40)
              .map((x) => `${x.label} [${x.type}]`)
              .join('; ')}`,
          ].filter(Boolean);
          return text(lines.join('\n\n'), {
            record: keep,
            overlay: o ?? null,
            neighbors: e.neighbors,
          });
        },
      );

      server.registerTool(
        'search_atlas',
        {
          title: 'Search the atlas',
          description:
            'Find nations, treaties, cessions, cases, violations, statutes, land returns and organizations by name (including other names and spellings).',
          inputSchema: z.object({
            query: z.string().min(2).max(100),
            type: z
              .enum([
                'Nation',
                'Instrument',
                'GeoFeature',
                'Case',
                'Violation',
                'Statute',
                'Campaign',
                'Organization',
                'Doctrine',
                'PolicyEra',
              ])
              .optional(),
          }),
          annotations: { readOnlyHint: true },
        },
        async ({ query, type }) => {
          const a = await atlas(env, fetchImpl);
          const fold = (s: string) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
          const q = fold(query);
          const nationIds = (a.lite as Lite).nodes
            .filter((x) => x[1] === 'Nation')
            .map((x) => x[0]);
          const hits = a.search
            .filter(([, t]) => !type || t === type)
            .map((row) => {
              const label = fold(row[2]);
              const score =
                label === q
                  ? 3
                  : label.startsWith(q)
                    ? 2
                    : label.includes(q)
                      ? 1.5
                      : row[3].some((x) => fold(x).includes(q))
                        ? 1
                        : 0;
              return { row, score };
            })
            .filter((x) => x.score > 0)
            .sort((x, y) => y.score - x.score)
            .slice(0, 15)
            .map(({ row: [id, t, label, , y] }) => ({
              id,
              type: t,
              label,
              year: y,
              url: url(routeFor(id, t, nationIds)),
            }));
          return text(
            hits.length
              ? hits
                  .map(
                    (h) =>
                      `${h.id} | ${h.type} | ${h.label}${h.year ? ` (${h.year})` : ''} | ${h.url ?? ''}`,
                  )
                  .join('\n')
              : 'No matches.',
            { results: hits },
          );
        },
      );

      server.registerTool(
        'support_the_work',
        {
          title: 'Who is doing the work',
          description:
            "Organizations and nations restoring land and law, for nations (ids from other tools) and/or states (two-letter codes): the nations' own governments, Native-led groups serving them, land-return work in those states, and national Native legal and land groups, with donation links on each organization's own site.",
          inputSchema: z.object({
            nations: z
              .array(z.string().regex(/^nat-[a-z0-9-]+$/))
              .max(20)
              .optional(),
            states: z
              .array(z.string().regex(/^[A-Z]{2}$/))
              .max(10)
              .optional(),
          }),
          annotations: { readOnlyHint: true },
        },
        async ({ nations, states }) => {
          const a = await atlas(env, fetchImpl);
          const r = supportFor(a.support, { nations, states });
          const org = (id: string) => ({
            id,
            ...a.support.orgs[id]!,
            path: url(a.support.orgs[id]!.path),
          });
          const out = {
            nations_today: r.today.map((t) => ({ ...t, path: url(t.path) })),
            working_with_these_nations: r.direct.map(org),
            nearby: r.nearby.map(org),
            national: r.national.map(org),
            note: 'Gifts go to each organization directly. Listing is not endorsement: https://landback.land/support/policy/',
          };
          const fmt = (o: ReturnType<typeof org>) =>
            `${o.label} (${o.kind}) ${o.donate ? `give: ${o.donate}` : (o.website ?? '')}`;
          return text(
            [
              out.nations_today.length &&
                `Nations today: ${out.nations_today.map((t) => t.label).join('; ')}`,
              out.working_with_these_nations.length &&
                `Working with these nations: ${out.working_with_these_nations.map(fmt).join('; ')}`,
              out.nearby.length && `Nearby: ${out.nearby.map(fmt).join('; ')}`,
              `National: ${out.national.map(fmt).join('; ')}`,
              out.note,
            ]
              .filter(Boolean)
              .join('\n'),
            out,
          );
        },
      );
    },
    { serverInfo: { name: 'treaty-land-atlas', version: '1.0.0' }, instructions: INSTRUCTIONS },
  );
}
