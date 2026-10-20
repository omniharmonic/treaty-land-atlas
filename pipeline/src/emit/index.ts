// Emit (H3 s.3 step 3): project build/*.json into the public files under public/data/.
// The emit is a projection, not a copy: suppressed ids vanish everywhere, organization
// listings that fail donation-integrity rules lose their links, and no timestamps are written.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PUBLIC_DATA_DIR } from '../paths.ts';
import type { Graph, GraphEdge, GraphNode } from '../validate/graph.ts';
import type { Overlay } from '../overlays/index.ts';
import { routeFor } from '../../../src/lib/routes.ts';
import { cessionStories, landLoss, lostAt } from './story.ts';
import { hatchLevel, loadK1 } from './landStatus.ts';
import { supportIndex } from '../../../src/lib/support.ts';

export interface EmitOptions {
  outDir?: string;
  /** Derived layer files (data/derived/*.json) to publish under layers/ with content-hashed names. */
  layers?: Record<string, string>;
  suppressed?: Set<string>;
  overlays?: Map<string, Overlay>;
  dataVersion: string;
  /** Extra files (layers) already written into outDir, to list in the manifest. */
  extraFiles?: string[];
  licenses?: { id: string; name: string; status: string; attribution_text: string }[];
}

export interface EmitResult {
  files: Record<string, { bytes: number; sha256: string }>;
  counts: { nodes: number; edges: number; suppressed: number };
  excluded: { reason: string; id: string }[];
}

const STATUS_INITIAL: Record<string, string> = {
  asserted_by_seed: 's',
  proposed: 'p',
  accepted: 'a',
  rejected: 'r',
};

/** Which year a node sits at on the timeline, if any. */
export function nodeYear(n: GraphNode): number | null {
  const pick = (v: unknown) => {
    const m = /^(\d{4})/.exec(String(v ?? ''));
    return m ? Number(m[1]) : null;
  };
  switch (n.type) {
    case 'Instrument':
      return pick(n['date_signed']);
    case 'Case':
    case 'Statute':
      return pick(n['year']);
    case 'Violation':
      return pick(n['year_start']);
    case 'Campaign':
    case 'PolicyEra':
      return pick(n['start_year']);
    default:
      return null;
  }
}

/** Node types whose records are federal acts; a sourced interpretation of them is publishable. */
export const INTERPRETABLE = new Set([
  'Campaign',
  'Organization',
  'Instrument',
  'Case',
  'Statute',
  'Violation',
  'GeoFeature',
  'PolicyEra',
  'Doctrine',
]);

/** Public projection of one node. */
export function projectNode(n: GraphNode, overlay?: Overlay): Record<string, unknown> {
  const { provenance, ...rest } = n as GraphNode & { provenance?: Record<string, unknown> };
  const out: Record<string, unknown> = { ...rest };
  if (provenance) {
    const { built_by: _builtBy, ...p } = provenance;
    out['provenance'] = p;
  }
  // Donation integrity (F4): a low-confidence or not-display-eligible organization is kept as
  // a record (its edges stay) but never carries a website or donation link.
  if (n.type === 'Organization' && (n.confidence === 'low' || n['display_eligible'] === false)) {
    out['website'] = null;
    out['donation_url'] = null;
    out['listing_status'] = 'not_listed';
  } else if (n.type === 'Organization') {
    out['listing_status'] = 'listed';
  }
  if (overlay) {
    const publication = n['publication'] as { narrative_allowed?: boolean } | undefined;
    // Sourced interpretation of federal records is published, labeled; anything written about a
    // nation itself waits for that nation's review (G3 s.3.3; decision log 2026-10-17).
    const allowed = INTERPRETABLE.has(n.type) || publication?.narrative_allowed === true;
    out['overlay'] = {
      content_warnings: overlay.content_warnings,
      ai_assisted: overlay.ai_assisted,
      legal_review: overlay.legal_review ?? null,
      headline: allowed ? (overlay.headline ?? null) : null,
      narrative: allowed ? overlay.body : null,
      sources: allowed ? overlay.sources : [],
      cautions: allowed ? (overlay.cautions ?? null) : null,
      note: allowed ? (overlay.note ?? null) : null,
      confidence: allowed ? (overlay.confidence ?? null) : null,
      promises: allowed ? (overlay.promises ?? []) : [],
    };
  }
  return out;
}

function liteEdge(e: GraphEdge) {
  return {
    id: e.id,
    type: e.type,
    source: e.source,
    target: e.target,
    status: e.status,
    confidence: e.confidence,
    basis: e.basis ?? null,
    qualifiers: e.qualifiers ?? {},
  };
}

function stableJson(value: unknown): string {
  return JSON.stringify(value) + '\n';
}

export function emit(graph: Graph, opts: EmitOptions): EmitResult {
  const outDir = opts.outDir ?? PUBLIC_DATA_DIR;
  const suppressed = opts.suppressed ?? new Set<string>();
  const overlays = opts.overlays ?? new Map();
  const excluded: EmitResult['excluded'] = [];

  const nodes = graph.nodes
    .filter((n) => {
      if (suppressed.has(n.id)) {
        excluded.push({ reason: 'suppressed', id: n.id });
        return false;
      }
      return true;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const nationIds = nodes.filter((n) => n.type === 'Nation').map((n) => n.id);
  const edges = graph.edges
    // A human-rejected link is wrong, so it is not published (it stays in build/ for the record).
    .filter((e) => e.status !== 'rejected' && byId.has(e.source) && byId.has(e.target))
    .sort((a, b) => a.id.localeCompare(b.id));

  for (const sub of ['entities', 'tables', 'layers'])
    rmSync(join(outDir, sub), { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const files: EmitResult['files'] = {};
  const write = (rel: string, value: unknown) => {
    const path = join(outDir, rel);
    mkdirSync(dirname(path), { recursive: true });
    const body = stableJson(value);
    writeFileSync(path, body);
    files[rel] = { bytes: Buffer.byteLength(body), sha256: sha256(body) };
  };

  // graph-lite (H3 s.4.3). All edge statuses are included (owner decision 2026-10-17);
  // Source nodes and evidenced_by edges load with entity files instead.
  const liteNodes = nodes.filter((n) => n.type !== 'Source');
  const liteIds = new Set(liteNodes.map((n) => n.id));
  write('graph-lite.json', {
    fields: {
      nodes: ['id', 'type', 'label', 'confidence', 'review_status', 'year'],
      edges: ['type', 'source', 'target', 'status'],
      status: STATUS_INITIAL,
    },
    nodes: liteNodes.map((n) => [
      n.id,
      n.type,
      n.label,
      String(n.confidence ?? '').charAt(0),
      (n['tribal_review'] as { status?: string } | undefined)?.status ?? null,
      nodeYear(n),
    ]),
    edges: edges
      .filter((e) => e.type !== 'evidenced_by' && liteIds.has(e.source) && liteIds.has(e.target))
      .map((e) => [e.type, e.source, e.target, STATUS_INITIAL[e.status] ?? e.status]),
  });

  // Per-entity files: node + edges grouped by type and direction + lite neighbors.
  const outgoing = new Map<string, GraphEdge[]>();
  const incoming = new Map<string, GraphEdge[]>();
  for (const e of edges) {
    (outgoing.get(e.source) ?? outgoing.set(e.source, []).get(e.source)!).push(e);
    (incoming.get(e.target) ?? incoming.set(e.target, []).get(e.target)!).push(e);
  }
  const group = (list: GraphEdge[] = []) => {
    const g: Record<string, ReturnType<typeof liteEdge>[]> = {};
    for (const e of list) (g[e.type] ??= []).push(liteEdge(e));
    return g;
  };
  for (const n of nodes) {
    const out = outgoing.get(n.id) ?? [];
    const inc = incoming.get(n.id) ?? [];
    const neighborIds = [
      ...new Set([...out.map((e) => e.target), ...inc.map((e) => e.source)]),
    ].sort();
    write(`entities/${n.type}/${n.id}.json`, {
      node: projectNode(n, overlays.get(n.id)),
      edges: { out: group(out), in: group(inc) },
      neighbors: Object.fromEntries(
        neighborIds.map((id) => {
          const m = byId.get(id)!;
          return [
            id,
            {
              type: m.type,
              label: m.label,
              confidence: m.confidence,
              year: nodeYear(m),
              path: routeFor(id, m.type, nationIds),
            },
          ];
        }),
      ),
    });
  }

  // Story tables: how each cession happened, and approximate land recorded as ceded over time.
  const k1 = loadK1();
  const stories = cessionStories(graph, overlays, k1.areas);
  write(
    'tables/cession-stories.json',
    Object.fromEntries([...stories.entries()].sort(([a], [b]) => a.localeCompare(b))),
  );
  write('tables/land-loss.json', landLoss(graph, stories));
  // K1: the evidence behind each area's status and flags, and massacre sites at a general location
  const geoByNum = new Map(
    nodes
      .filter((n) => n.type === 'GeoFeature')
      .map((n) => [String(n['royce_cession_number'] ?? ''), n.id]),
  );
  write(
    'tables/land-status.json',
    Object.fromEntries(
      [...k1.areas.entries()]
        .filter(([num]) => geoByNum.has(num))
        .map(([num, a]) => [geoByNum.get(num)!, a] as const)
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  );
  write('tables/massacre-sites.json', {
    type: 'FeatureCollection',
    note: 'Locations are general (rounded to 0.1 degree), never burial or sacred-site precision. Names follow descendant nations where known. Any nation can ask for a change or removal.',
    features: k1.massacres
      .filter((m) => m.lat !== null && m.lon !== null)
      .map((m) => ({
        type: 'Feature',
        properties: {
          id: m.id,
          name: m.name,
          year: Number(m.date.slice(0, 4)) || null,
          link: m.link_kind,
          evidence: m.evidence,
          areas: m.areas.map((a) => geoByNum.get(a)).filter(Boolean),
        },
        geometry: { type: 'Point', coordinates: [m.lon, m.lat] },
      })),
    sites: k1.massacres.map((m) => ({
      ...m,
      areas: m.areas.map((a) => geoByNum.get(a)).filter(Boolean),
    })),
  });
  write(
    'tables/headlines.json',
    Object.fromEntries(
      [...overlays.entries()]
        .filter(([id, o]) => o.headline && byId.has(id) && INTERPRETABLE.has(byId.get(id)!.type))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, o]) => [id, o.headline]),
    ),
  );
  write('tables/story.json', storyTable(graph));
  // Who is doing the work, for every map panel (src/lib/support.ts).
  write('tables/support.json', supportIndex(nodes, edges));

  // Tables for the map, timeline and lists.
  write(
    'tables/instruments-lite.json',
    nodes
      .filter((n) => n.type === 'Instrument')
      .map((n) => ({
        id: n.id,
        label: n.label,
        instrument_type: n['instrument_type'],
        ratification_status: n['ratification_status'],
        date_signed: n['date_signed'],
        date_ratified: n['date_ratified'],
        year: nodeYear(n),
        region: n['region'],
        parties_text: n['parties_text'],
        stat_cite: n['stat_cite'],
        kappler_cite: n['kappler_cite'],
        nara: n['nara'],
        royce_cession_numbers: n['royce_cession_numbers'] ?? [],
        completeness: n['completeness'],
        confidence: n.confidence,
        flags: n.flags,
      })),
  );
  write(
    'tables/timeline-events.json',
    nodes
      .map((n) => ({ n, year: nodeYear(n) }))
      .filter((x) => x.year !== null)
      .sort((a, b) => a.year! - b.year! || a.n.id.localeCompare(b.n.id))
      .map(({ n, year }) => ({
        id: n.id,
        type: n.type,
        label: n.label,
        year,
        date: n.type === 'Instrument' ? n['date_signed'] : null,
        end_year:
          n.type === 'PolicyEra'
            ? Number(n['end_year']) || null
            : n.type === 'Violation'
              ? (n['year_end'] ?? null)
              : null,
        confidence: n.confidence,
      })),
  );

  // Search index (H3 s.4.5): names and aliases, so "Iroquois", "Haudenosaunee" and
  // "Six Nations" find the same entity.
  write(
    'search-index.json',
    nodes
      .filter((n) => n.type !== 'Source')
      .map((n) => [n.id, n.type, n.label, searchNames(n), nodeYear(n)]),
  );

  const reviewed = nodes.filter((n) =>
    ['reviewed', 'co_authored'].includes(
      (n['tribal_review'] as { status?: string } | undefined)?.status ?? '',
    ),
  ).length;

  // Geometry layers: copied byte-for-byte, named by content hash so browsers can cache forever.
  const layers: Record<string, string> = {};
  for (const [name, src] of Object.entries(opts.layers ?? {}).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    let body = readFileSync(src);
    if (name === 'cessions') {
      // add how each cession happened and the nations named, for color and the nation view
      const fc = JSON.parse(body.toString('utf8')) as {
        features: { properties: Record<string, unknown> }[];
      };
      for (const f of fc.features) {
        const id = String(f.properties['id']);
        const st = stories.get(id);
        const g = byId.get(id);
        f.properties['how'] = st?.how ?? 'unknown';
        f.properties['nations'] = st?.nations ?? [];
        // what the record says happened (K1 land status) and when the map shows the land lost:
        // the Schedule entry that did the ceding or taking; 9999 when the record never shows it lost
        f.properties['ls'] = st?.land_status ?? 'taken_no_instrument';
        const t = g ? lostAt(st, g) : null;
        f.properties['t0'] = t ?? 9999;
        if (st?.status === 'kept') f.properties['kept'] = true;
        // promised first (year), then lost; flags hatch: 2 solid evidence, 1 reported only
        f.properties['py'] = st?.promised_year ?? null;
        f.properties['bp'] = st?.broken_promise ? 1 : 0;
        const research = k1.areas.get(String(g?.['royce_cession_number'] ?? ''));
        f.properties['fh'] = hatchLevel(research?.flags ?? []);
      }
      body = Buffer.from(JSON.stringify(fc) + '\n');
    }
    if (name === 'cession-events') {
      const list = JSON.parse(body.toString('utf8')) as Record<string, unknown>[];
      for (const e of list) {
        const id = String(e['id']);
        const st = stories.get(id);
        const g = byId.get(id);
        e['t_first'] = g ? lostAt(st, g) : (e['t_first'] ?? null);
        if (st?.status === 'kept') e['kept'] = true;
        e['land_status'] = st?.land_status ?? 'taken_no_instrument';
      }
      body = Buffer.from(JSON.stringify(list) + '\n');
    }
    const hash = sha256(body).slice(0, 10);
    const rel = `layers/${name}.${hash}.json`;
    mkdirSync(join(outDir, 'layers'), { recursive: true });
    writeFileSync(join(outDir, rel), body);
    files[rel] = { bytes: body.length, sha256: sha256(body) };
    layers[name] = rel;
  }
  for (const rel of opts.extraFiles ?? []) files[rel] ??= { bytes: 0, sha256: '' };
  const manifest = {
    schema_version: graph.nodesDoc.schema_version,
    data_version: opts.dataVersion,
    counts: { nodes: nodes.length, edges: edges.length },
    edge_status: countBy(edges, (e) => e.status),
    review: { nodes_reviewed_by_nation: reviewed, nodes_total: nodes.length },
    layers,
    licenses: opts.licenses ?? [],
    files: Object.fromEntries(
      Object.entries(files)
        .filter(([rel]) => !rel.startsWith('entities/'))
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
    entity_files: Object.keys(files).filter((r) => r.startsWith('entities/')).length,
  };
  writeFileSync(join(outDir, 'manifest.json'), stableJson(manifest));

  return {
    files,
    counts: { nodes: nodes.length, edges: edges.length, suppressed: excluded.length },
    excluded,
  };
}

/** Chapters and moments for the map: data/story.json when present, else the policy eras. */
function storyTable(graph: Graph) {
  const file = join(PUBLIC_DATA_DIR, '..', '..', 'data', 'story.json');
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const eras = graph.nodes
    .filter((n) => n.type === 'PolicyEra')
    .sort((a, b) => Number(a['start_year']) - Number(b['start_year']));
  return {
    chapters: eras.map((e) => ({
      start_year: Number(e['start_year']),
      end_year: Number(e['end_year']) || 2026,
      title: e.label,
      lede: String(e.summary ?? '').split('. ')[0],
      narrative: e.summary ?? '',
      key_records: [],
      sources: [],
    })),
    moments: [],
  };
}

function searchNames(n: GraphNode): string[] {
  const names = new Set<string>();
  for (const a of (n['aliases'] as string[] | undefined) ?? []) names.add(a);
  for (const nm of (n['names'] as { name?: string }[] | undefined) ?? [])
    if (nm?.name) names.add(nm.name);
  for (const k of ['short_name', 'name', 'era_name', 'full_citation', 'citation', 'stat_cite']) {
    const v = n[k];
    if (typeof v === 'string' && v && v !== n.label) names.add(v);
  }
  // ASCII-folded forms so a reader without a diacritic keyboard still finds the name.
  for (const v of [n.label, ...names]) {
    const folded = v.normalize('NFKD').replace(/\p{M}/gu, '');
    if (folded !== v) names.add(folded);
  }
  names.delete(n.label);
  return [...names].sort();
}

function countBy<T>(list: T[], key: (t: T) => string) {
  const out: Record<string, number> = {};
  for (const x of list) out[key(x)] = (out[key(x)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

export function sha256(body: string | Buffer): string {
  return createHash('sha256').update(body).digest('hex');
}
