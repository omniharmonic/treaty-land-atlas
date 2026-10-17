// Story data for the map (emit stage): how each cession happened, and approximate land recorded
// as ceded over time, overall, by cause and by nation. Reads build/ (graph), data/derived/ and
// data/overlays/ (research interpretations, which may refine "how").
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Graph, GraphNode } from '../validate/graph.ts';
import type { Overlay } from '../overlays/index.ts';
import { DATA_DIR } from '../paths.ts';
import { cellAcres, cellLat } from '../geometry/landloss.ts';
import { routeFor } from '../../../src/lib/routes.ts';

export const HOW = ['treaty', 'pressure', 'removal', 'congress', 'executive', 'unknown'] as const;
export type How = (typeof HOW)[number];

const FROM_RESEARCH: Record<string, How> = {
  treaty_negotiated: 'treaty',
  treaty_under_pressure: 'pressure',
  removal: 'removal',
  act_of_congress: 'congress',
  agreement_ratified_by_statute: 'congress',
  executive_order: 'executive',
  unratified: 'treaty',
  other: 'unknown',
};

/** How an instrument took land: sourced research first, then the record's own type and linked violations. */
export function instrumentHow(
  n: GraphNode,
  graph: Graph,
  overlays: Map<string, Overlay>,
): { how: How; basis: string } {
  const o = overlays.get(n.id);
  if (o?.how && FROM_RESEARCH[o.how])
    return { how: FROM_RESEARCH[o.how]!, basis: o.how_basis ?? 'research interpretation' };
  const type = String(n['instrument_type'] ?? '');
  if (type === 'executive_order')
    return { how: 'executive', basis: 'instrument is an executive order' };
  if (type === 'agreement_statutory')
    return { how: 'congress', basis: 'agreement ratified by act of Congress' };
  const violations = graph.edges
    .filter((e) => e.type === 'violated_by' && e.source === n.id)
    .map((e) => graph.nodes.find((x) => x.id === e.target))
    .flatMap((v) => (v?.['violation_types'] as string[] | undefined) ?? []);
  if (violations.includes('FORCED_REMOVAL'))
    return { how: 'removal', basis: 'linked violation record: forced removal' };
  if (violations.includes('FRAUD_COERCION_NEGOTIATION'))
    return { how: 'pressure', basis: 'linked violation record: fraud or coercion in negotiation' };
  return { how: 'treaty', basis: 'ratified treaty or agreement' };
}

export interface CessionStory {
  how: How;
  how_basis: string;
  instrument: string | null;
  nations: string[];
}

export function cessionStories(
  graph: Graph,
  overlays: Map<string, Overlay>,
): Map<string, CessionStory> {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const out = new Map<string, CessionStory>();
  for (const g of graph.nodes.filter((n) => n.type === 'GeoFeature')) {
    const depicts = graph.edges
      .filter((e) => e.type === 'depicts' && e.source === g.id && e.status !== 'rejected')
      .sort((a, b) =>
        String(a.qualifiers?.['role'] ?? '').localeCompare(String(b.qualifiers?.['role'] ?? '')),
      );
    const inst = depicts.map((e) => byId.get(e.target)).find(Boolean) ?? null;
    let how: How = 'unknown';
    let basis = 'no instrument or legal type recorded';
    if (inst) ({ how, basis } = instrumentHow(inst, graph, overlays));
    else if (g['legal_type'] === 'statute')
      [how, basis] = ['congress', 'USFS link to a federal statute'];
    else if (g['legal_type'] === 'executive_order')
      [how, basis] = ['executive', 'USFS link to an executive order'];
    else if (g['legal_type'] === 'treaty_or_agreement')
      [how, basis] = ['treaty', 'USFS link to Kappler treaty text'];
    const nations = graph.edges
      .filter(
        (e) =>
          e.type === 'attributed_to_nation' &&
          e.source === g.id &&
          e.qualifiers?.['role'] === 'named_in_royce_schedule',
      )
      .map((e) => e.target);
    out.set(g.id, {
      how,
      how_basis: basis,
      instrument: inst?.id ?? null,
      nations: [...new Set(nations)].sort(),
    });
  }
  return out;
}

export const YEARS = Array.from({ length: 1894 - 1784 + 1 }, (_, i) => 1784 + i);

interface Cells {
  cells: Record<string, number[]>;
}

/** Cumulative union acres by year, total and by cause, for a set of cessions. */
function series(ids: string[], t0: Map<string, number>, how: Map<string, How>, cells: Cells) {
  const first = new Map<number, { t: number; how: How }>();
  for (const id of ids) {
    const t = t0.get(id);
    if (t === undefined) continue;
    for (const c of cells.cells[id] ?? []) {
      const prev = first.get(c);
      if (!prev || t < prev.t) first.set(c, { t, how: how.get(id) ?? 'unknown' });
    }
  }
  const perYear = new Map<number, Record<How, number>>();
  for (const [cell, { t, how: h }] of first) {
    const y = Math.max(YEARS[0]!, Math.floor(t));
    const row =
      perYear.get(y) ?? (Object.fromEntries(HOW.map((k) => [k, 0])) as Record<How, number>);
    row[h] += cellAcres(cellLat(cell));
    perYear.set(y, row);
  }
  const run = Object.fromEntries(HOW.map((k) => [k, 0])) as Record<How, number>;
  const byHow = Object.fromEntries(HOW.map((k) => [k, [] as number[]])) as Record<How, number[]>;
  const total: number[] = [];
  for (const y of YEARS) {
    const row = perYear.get(y);
    for (const k of HOW) {
      if (row) run[k] += row[k];
      byHow[k].push(Math.round(run[k] / 10000) * 10000);
    }
    total.push(HOW.reduce((s, k) => s + byHow[k][byHow[k].length - 1]!, 0));
  }
  return { total, by_how: byHow };
}

export function landLoss(graph: Graph, stories: Map<string, CessionStory>) {
  const cells = JSON.parse(
    readFileSync(join(DATA_DIR, 'derived', 'cession-cells.json'), 'utf8'),
  ) as Cells;
  const t0 = new Map<string, number>();
  for (const g of graph.nodes.filter((n) => n.type === 'GeoFeature'))
    if (typeof g['t_first'] === 'number') t0.set(g.id, g['t_first'] as number);
  const how = new Map([...stories.entries()].map(([k, v]) => [k, v.how]));
  const all = series([...t0.keys()], t0, how, cells);
  const byNation: Record<
    string,
    ReturnType<typeof series> & { cessions: string[]; label: string; path: string | null }
  > = {};
  const nationIds = graph.nodes.filter((n) => n.type === 'Nation').map((n) => n.id);
  const labelOf = new Map(graph.nodes.map((n) => [n.id, n.label]));
  const nationCessions = new Map<string, string[]>();
  for (const [gid, s] of stories)
    for (const nid of s.nations)
      (nationCessions.get(nid) ?? nationCessions.set(nid, []).get(nid)!).push(gid);
  for (const [nid, ids] of [...nationCessions.entries()].sort(([a], [b]) => a.localeCompare(b)))
    byNation[nid] = {
      ...series(ids, t0, how, cells),
      cessions: ids.sort(),
      label: (labelOf.get(nid) ?? nid).replace(/ - /g, ', '),
      path: routeFor(nid, 'Nation', nationIds),
    };
  return {
    note: 'Approximate acres of land the United States recorded as ceded, from Royce cession shapes on a 0.1-degree grid; overlapping cessions are counted once. Not a legal or survey measurement.',
    years: YEARS,
    how: HOW,
    all,
    by_nation: byNation,
  };
}
