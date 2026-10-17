// Who is doing the work: organizations connected to any part of the graph. Shared by the data emit
// (tables/support.json, read by the map) and the site build (the support box on record pages). Pure.
//
// From a set of nations (and optionally states) it walks: each nation, the peoples it is part of,
// and the present-day nations that carry its history (successor_of); then the organizations that
// serve or govern those nations; then land-return work in the same states; then national Native
// legal and land groups. Only listed organizations are linked (confidence medium or high, and not
// a government agency): the donation-integrity policy (docs/research/F4) applies to every link.

import { routeFor } from './routes';

export interface SupportOrg {
  label: string;
  path: string | null;
  website: string | null;
  donate: string | null;
  /** nation: a nation's own government; native: Native-led; ally: a non-Native group that has returned land */
  kind: 'nation' | 'native' | 'ally';
  focus: string;
}

export interface SupportIndex {
  orgs: Record<string, SupportOrg>;
  /** nation id -> organizations serving or governing it */
  by_nation: Record<string, string[]>;
  /** nation id -> present-day nations that carry its history, and peoples it is part of */
  successors: Record<string, string[]>;
  /** two-letter state code -> organizations working there */
  by_state: Record<string, string[]>;
  /** nation id -> two-letter state codes of its recorded cessions */
  nation_states: Record<string, string[]>;
  /** nation id -> [label, path] for every nation named above */
  nations: Record<string, [string, string | null]>;
  national: string[];
}

interface MiniNode {
  id: string;
  type: string;
  label: string;
  confidence?: unknown;
  [k: string]: unknown;
}
interface MiniEdge {
  type: string;
  source: string;
  target: string;
}

const KIND: Record<string, SupportOrg['kind']> = {
  'tribal-government': 'nation',
  'yes-verified': 'native',
  'yes-self-described': 'native',
  mixed: 'native',
  no: 'ally',
};
const firstUrl = (v: unknown) => {
  const m = String(v ?? '').match(/https?:\/\/\S+/);
  return m ? m[0].replace(/[;,]$/, '') : null;
};
const push = (m: Record<string, string[]>, k: string, v: string) => {
  const list = (m[k] ??= []);
  if (!list.includes(v)) list.push(v);
};

export function supportIndex(nodes: MiniNode[], edges: MiniEdge[]): SupportIndex {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const nationIds = nodes.filter((n) => n.type === 'Nation').map((n) => n.id);
  const orgs: Record<string, SupportOrg> = {};
  const national: string[] = [];
  for (const n of nodes) {
    if (n.type !== 'Organization' || n.confidence === 'low') continue;
    const kind = KIND[String(n['indigenous_led'] ?? '')];
    if (!kind) continue; // agencies, programs and unverified leadership are records, not support links
    orgs[n.id] = {
      label: n.label,
      path: routeFor(n.id, n.type, nationIds),
      website: firstUrl(n['website']),
      donate: firstUrl(n['donation_url']),
      kind,
      focus: String(n['focus'] ?? n['summary'] ?? ''),
    };
    if (kind === 'native' && /\bnational\b/i.test(String(n['region_text'] ?? '')))
      national.push(n.id);
  }
  const by_nation: Record<string, string[]> = {};
  const successors: Record<string, string[]> = {};
  const by_state: Record<string, string[]> = {};
  const nation_states: Record<string, string[]> = {};
  const geoStates: Record<string, string[]> = {};
  for (const e of edges) {
    if ((e.type === 'serves_nation' || e.type === 'governing_body_of') && orgs[e.source])
      push(by_nation, e.target, e.source);
    else if (e.type === 'successor_of') push(successors, e.target, e.source);
    else if (e.type === 'part_of') push(successors, e.source, e.target);
    else if (e.type === 'operates_in' && orgs[e.source] && e.target.startsWith('plc-state-'))
      push(by_state, e.target.slice(10).toUpperCase(), e.source);
    else if (
      e.type === 'located_in' &&
      e.target.startsWith('plc-state-') &&
      e.source.startsWith('geo-')
    )
      push(geoStates, e.source, e.target.slice(10).toUpperCase());
  }
  for (const e of edges)
    if (e.type === 'attributed_to_nation')
      for (const s of geoStates[e.source] ?? []) push(nation_states, e.target, s);
  // national groups also show up in by_state through "national" region text; keep them separate
  for (const s of Object.keys(by_state))
    by_state[s] = by_state[s]!.filter((o) => !national.includes(o));

  const named = new Set([
    ...Object.keys(by_nation),
    ...Object.keys(successors),
    ...Object.values(successors).flat(),
  ]);
  const nations: SupportIndex['nations'] = {};
  for (const id of [...named].sort()) {
    const n = byId.get(id);
    if (n?.type === 'Nation') nations[id] = [n.label, routeFor(id, 'Nation', nationIds)];
  }
  // legal defense and land return first; broader movement groups after
  const lead = ['org-narf', 'org-ndn-collective', 'org-iltf'];
  national.sort((a, b) => (lead.indexOf(a) + 1 || 99) - (lead.indexOf(b) + 1 || 99));
  const sortObj = <T>(o: Record<string, T>) =>
    Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
  return {
    orgs: sortObj(orgs),
    by_nation: sortObj(by_nation),
    successors: sortObj(successors),
    by_state: sortObj(by_state),
    nation_states: sortObj(nation_states),
    nations,
    national,
  };
}

export interface SupportResult {
  /** the nations themselves, today: present-day nations carrying this history */
  today: { id: string; label: string; path: string | null }[];
  /** organizations serving those nations (their own governments first) */
  direct: string[];
  /** land-return and Native-led work in the same states */
  nearby: string[];
  national: string[];
}

/** Organizations for a part of the graph, nearest first. Each organization appears once. */
export function supportFor(
  ix: SupportIndex,
  input: { nations?: string[]; states?: string[] },
  limits = { today: 8, direct: 6, nearby: 4 },
): SupportResult {
  // nations, then (two steps) the peoples they belong to and the nations that carry their history
  const seen = new Set<string>();
  let frontier = [...new Set(input.nations ?? [])];
  for (let depth = 0; depth < 3 && frontier.length; depth++) {
    frontier.forEach((id) => seen.add(id));
    frontier = frontier.flatMap((id) => ix.successors[id] ?? []).filter((id) => !seen.has(id));
  }
  const all = [...seen];
  const used = new Set<string>();
  const take = (ids: string[], max: number) => {
    const out: string[] = [];
    for (const id of ids)
      if (!used.has(id) && ix.orgs[id] && out.length < max) {
        used.add(id);
        out.push(id);
      }
    return out;
  };
  const rank = (ids: string[]) =>
    [...ids].sort(
      (a, b) =>
        ['nation', 'native', 'ally'].indexOf(ix.orgs[a]!.kind) -
        ['nation', 'native', 'ally'].indexOf(ix.orgs[b]!.kind),
    );
  const direct = take(
    rank(all.flatMap((id) => ix.by_nation[id] ?? []).filter((o) => ix.orgs[o])),
    limits.direct,
  );
  const states = new Set([
    ...(input.states ?? []),
    ...(input.nations ?? []).flatMap((id) => ix.nation_states[id] ?? []),
  ]);
  const nearby = take(
    rank([...states].flatMap((s) => ix.by_state[s] ?? []).filter((o) => ix.orgs[o])),
    limits.nearby,
  );
  const national = take(ix.national, 4);
  // present-day nations first (nat-pd-), then the historic peoples named
  const today = all
    .filter((id) => ix.nations[id] && !(input.nations ?? []).includes(id))
    .sort((a, b) => Number(!a.startsWith('nat-pd-')) - Number(!b.startsWith('nat-pd-')))
    .slice(0, limits.today)
    .map((id) => ({ id, label: ix.nations[id]![0], path: ix.nations[id]![1] }));
  return { today, direct, nearby, national };
}

/** The nations and states a record concerns, from its edges (one hop, two through treaties). */
export function concerns(
  id: string,
  type: string,
  out: (id: string) => MiniEdge[],
  inc: (id: string) => MiniEdge[],
): { nations: string[]; states: string[] } {
  const nations = new Set<string>();
  const states = new Set<string>();
  const parties = (instrument: string) =>
    inc(instrument)
      .filter((e) => e.type === 'party_to')
      .forEach((e) => nations.add(e.source));
  if (type === 'Nation') nations.add(id);
  if (type === 'Place' && id.startsWith('plc-state-')) states.add(id.slice(10).toUpperCase());
  if (type === 'Organization') return { nations: [], states: [] };
  for (const e of out(id)) {
    if (e.type === 'attributed_to_nation' || e.type === 'involves_nation') nations.add(e.target);
    if (e.type === 'located_in' && e.target.startsWith('plc-state-'))
      states.add(e.target.slice(10).toUpperCase());
    if (e.type === 'concerns_instrument' || e.type === 'depicts' || e.type === 'enabled_by')
      parties(e.target);
  }
  if (type === 'Instrument') parties(id);
  for (const e of inc(id)) if (e.type === 'violated_by') parties(e.source);
  return { nations: [...nations], states: [...states] };
}
