// Story data for the map (emit stage): how each cession happened, and approximate land recorded
// as ceded over time, overall, by cause and by nation. Reads build/ (graph), data/derived/ and
// data/overlays/ (research interpretations, which may refine "how").
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Graph, GraphNode } from '../validate/graph.ts';
import type { Overlay } from '../overlays/index.ts';
import { DATA_DIR } from '../paths.ts';
import { cellAcres, cellLat } from '../geometry/landloss.ts';
import { routeFor } from '../../../src/lib/routes.ts';
import { readCsv } from '../ingest/csv.ts';
import {
  LAND_STATUS,
  NOT_LOST,
  landStatus,
  loadK1,
  type AreaK1,
  type LandStatus,
} from './landStatus.ts';

export const HOW = [
  'treaty',
  'pressure',
  'removal',
  'unratified',
  'congress',
  'executive',
  'unknown',
] as const;
export type How = (typeof HOW)[number];

const FROM_RESEARCH: Record<string, How> = {
  treaty_negotiated: 'treaty',
  treaty_under_pressure: 'pressure',
  removal: 'removal',
  act_of_congress: 'congress',
  agreement_ratified_by_statute: 'congress',
  executive_order: 'executive',
  unratified: 'unratified',
  other: 'unknown',
};

/** How an instrument took land: sourced research first, then the record's own type and linked violations. */
export function instrumentHow(
  n: GraphNode,
  graph: Graph,
  overlays: Map<string, Overlay>,
): { how: How; basis: string } {
  const o = overlays.get(n.id);
  // a treaty the Senate never ratified is its own cause, whatever research says about its making
  if (n['ratification_status'] === 'unratified')
    return {
      how: 'unratified',
      basis:
        o?.how_basis ?? 'the Senate never ratified this treaty, yet the land was treated as ceded',
    };
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
  /** the instrument that ceded the land: the researched one when known, else the first linked */
  instrument: string | null;
  nations: string[];
  /** approximate acres of this cession's shape (0.1-degree grid) */
  acres: number;
  /** every instrument Royce ties to this area, in date order */
  instruments: { id: string; date: string | null }[];
  /** ceded / taken / kept per Royce's Schedule; unchecked until researched */
  status: 'ceded' | 'taken' | 'kept' | 'unchecked';
  /** year the land left Native hands per Royce's Schedule; the first date when unchecked; null if kept */
  ceded_year: number | null;
  /** what each of Royce's entries did, from the Schedule (crosswalks/royce-entry-roles.csv) */
  entries?: { date: string; role: string; instrument: string | null; quote: string }[];
  royce_summary?: string;
  /** the same summary in plain words for readers (crosswalks/royce-area-plain.csv) */
  plain?: string;
  /** what the record says happened to the land (K1 model; landStatus.ts) */
  land_status: LandStatus;
  land_status_basis: string;
  /** 'k1' when a K1 research row decided it, 'record' when derived from the federal record */
  land_status_source: 'k1' | 'record';
  /** first year an entry reserved, confirmed or described the land for the nation */
  promised_year: number | null;
  /** promised or reserved first, then lost; or a K1 promise_broken flag */
  broken_promise: boolean;
  /** the year the research shows the land lost, where it corrects Royce's dates (K1 lost_year) */
  lost_year?: number;
}

const PROMISE_ROLES = new Set(['reserved', 'confirmed', 'described_or_recognized']);

interface RoyceRole {
  id: string;
  date: string;
  role: string;
  instrument_id: string;
  quote: string;
  ceded_by: string;
  taken_by: string;
  status: 'ceded' | 'taken' | 'kept' | 'unclear';
  summary: string;
  confidence: string;
}

/** Researched roles of each Royce Schedule entry (which instrument ceded, which only described). */
export function royceRoles(): Map<string, RoyceRole[]> {
  const file = join(DATA_DIR, '..', 'crosswalks', 'royce-entry-roles.csv');
  const out = new Map<string, RoyceRole[]>();
  if (!existsSync(file)) return out;
  for (const r of readCsv(file).rows.map((x) => x.record) as unknown as RoyceRole[])
    if (r.confidence !== 'low') (out.get(r.id) ?? out.set(r.id, []).get(r.id)!).push(r);
  return out;
}

export function cessionStories(
  graph: Graph,
  overlays: Map<string, Overlay>,
  k1: Map<string, AreaK1> = loadK1().areas,
): Map<string, CessionStory> {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const out = new Map<string, CessionStory>();
  const roles = royceRoles();
  const plainFile = join(DATA_DIR, '..', 'crosswalks', 'royce-area-plain.csv');
  const plain = new Map(
    existsSync(plainFile)
      ? readCsv(plainFile).rows.map((x) => [String(x.record['id']), String(x.record['plain'])])
      : [],
  );
  const cells = JSON.parse(
    readFileSync(join(DATA_DIR, 'derived', 'cession-cells.json'), 'utf8'),
  ) as Cells;
  for (const g of graph.nodes.filter((n) => n.type === 'GeoFeature')) {
    const depicts = graph.edges
      .filter((e) => e.type === 'depicts' && e.source === g.id && e.status !== 'rejected')
      .sort((a, b) =>
        String(a.qualifiers?.['role'] ?? '').localeCompare(String(b.qualifiers?.['role'] ?? '')),
      );
    const linked = depicts
      .map((e) => byId.get(e.target))
      .filter((n): n is GraphNode => !!n)
      .sort((a, b) => String(a['date_signed'] ?? '').localeCompare(String(b['date_signed'] ?? '')));
    const roleRows = roles.get(g.id) ?? [];
    const status =
      roleRows[0]?.status === 'unclear' ? 'unchecked' : (roleRows[0]?.status ?? 'unchecked');
    // the date the land left Native hands: the ceding entry, or the act that took reservation land
    const cededBy = roleRows[0]?.ceded_by || roleRows[0]?.taken_by || null;
    const cededInst =
      roleRows.find((r) => r.date === cededBy && r.instrument_id && byId.has(r.instrument_id))
        ?.instrument_id ??
      (cededBy ? linked.find((n) => n['date_signed'] === cededBy)?.id : undefined);
    const inst = (cededInst ? byId.get(cededInst) : null) ?? linked[0] ?? null;
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
    const t = typeof g['t_first'] === 'number' ? Math.floor(g['t_first'] as number) : null;
    const research = k1.get(String(g['royce_cession_number'] ?? ''));
    const ls = landStatus({
      k1: research?.land_status ?? null,
      royceStatus: status,
      roles: roleRows.map((r) => r.role),
      how,
      agreement:
        inst?.['instrument_type'] === 'agreement_statutory' ||
        (inst ? overlays.get(inst.id)?.how === 'agreement_ratified_by_statute' : false),
    });
    const promised = roleRows.find((r) => PROMISE_ROLES.has(r.role));
    const promisedYear = promised ? Number(promised.date.slice(0, 4)) : null;
    // the plain text and summary on the node carry any sourced corrections (record-corrections.csv)
    const plainText = (g['plain'] as string | null | undefined) ?? plain.get(g.id);
    const summaryText = (g['royce_summary'] as string | null | undefined) ?? roleRows[0]?.summary;
    out.set(g.id, {
      how,
      how_basis: basis,
      instrument: inst?.id ?? null,
      nations: [...new Set(nations)].sort(),
      acres:
        Math.round(
          (cells.cells[g.id] ?? []).reduce((sum, c) => sum + cellAcres(cellLat(c)), 0) / 1000,
        ) * 1000,
      instruments: linked.map((n) => ({ id: n.id, date: (n['date_signed'] as string) ?? null })),
      status,
      ceded_year: status === 'kept' ? null : cededBy ? Number(cededBy.slice(0, 4)) : t,
      ...(roleRows.length
        ? {
            entries: roleRows.map((r) => ({
              date: r.date,
              role: r.role,
              instrument: r.instrument_id && byId.has(r.instrument_id) ? r.instrument_id : null,
              quote: r.quote,
            })),
            royce_summary: summaryText ?? '',
            ...(plainText ? { plain: plainText } : {}),
          }
        : {}),
      land_status: ls.status,
      // the research row's own basis is a working note (shown collapsed on the record); readers
      // get the instrument the research ties the status to
      land_status_basis: research?.land_status
        ? research.instrument
          ? `Classified by the K1 research review from ${research.instrument}.`
          : 'Classified by the K1 research review.'
        : ls.basis,
      land_status_source: research?.land_status ? 'k1' : 'record',
      promised_year: promisedYear,
      broken_promise:
        (!!promised && status !== 'kept' && !!cededBy && promised.date < cededBy) ||
        !!research?.flags.some((f) => f.flag === 'promise_broken'),
      ...(research?.lost_year ? { lost_year: research.lost_year } : {}),
    });
    // a promise the record shows lost later is a broken promise, however Royce dated it
    const story = out.get(g.id)!;
    const lost = lostAt(story, g);
    if (promisedYear !== null && lost !== null && promisedYear < Math.floor(lost))
      story.broken_promise = true;
  }
  return out;
}

export const YEARS = Array.from({ length: 1894 - 1784 + 1 }, (_, i) => 1784 + i);

interface Cells {
  cells: Record<string, number[]>;
}

/** Cumulative union acres by year, total and by category (cause or land status), for a set of cessions. */
function seriesBy<K extends string>(
  ids: string[],
  t0: Map<string, number>,
  keyOf: Map<string, K>,
  keys: readonly K[],
  fallback: K,
  cells: Cells,
) {
  const first = new Map<number, { t: number; k: K }>();
  for (const id of ids) {
    const t = t0.get(id);
    if (t === undefined) continue;
    for (const c of cells.cells[id] ?? []) {
      const prev = first.get(c);
      if (!prev || t < prev.t) first.set(c, { t, k: keyOf.get(id) ?? fallback });
    }
  }
  const zero = () => Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
  const perYear = new Map<number, Record<K, number>>();
  for (const [cell, { t, k }] of first) {
    const y = Math.max(YEARS[0]!, Math.floor(t));
    const row = perYear.get(y) ?? zero();
    row[k] += cellAcres(cellLat(cell));
    perYear.set(y, row);
  }
  const run = zero();
  const by = Object.fromEntries(keys.map((k) => [k, [] as number[]])) as Record<K, number[]>;
  const total: number[] = [];
  for (const y of YEARS) {
    const row = perYear.get(y);
    for (const k of keys) {
      if (row) run[k] += row[k];
      by[k].push(Math.round(run[k] / 10000) * 10000);
    }
    total.push(keys.reduce((s, k) => s + by[k][by[k].length - 1]!, 0));
  }
  return { total, by };
}

function series(
  ids: string[],
  t0: Map<string, number>,
  how: Map<string, How>,
  status: Map<string, LandStatus>,
  cells: Cells,
) {
  const h = seriesBy(ids, t0, how, HOW, 'unknown', cells);
  const st = seriesBy(ids, t0, status, LAND_STATUS, 'taken_no_instrument', cells);
  return { total: h.total, by_how: h.by, by_status: st.by };
}

/** When the map shows the land as lost (decimal year), or null if the record never shows it lost. */
export function lostAt(st: CessionStory | undefined, g: GraphNode): number | null {
  const tFirst = typeof g['t_first'] === 'number' ? (g['t_first'] as number) : null;
  if (!st) return tFirst;
  if (NOT_LOST.has(st.land_status)) return null;
  if (st.lost_year) return st.lost_year + 0.5;
  // Royce lists it as kept, but the land status says it was lost (an unratified treaty's reserve,
  // never set apart in law): dated by its first entry
  if (st.status === 'kept') {
    const y = st.entries?.[0]?.date ? Number(st.entries[0].date.slice(0, 4)) : null;
    return y !== null ? y + 0.5 : tFirst;
  }
  if (st.entries && st.ceded_year) return st.ceded_year + 0.5;
  return tFirst;
}

export function landLoss(graph: Graph, stories: Map<string, CessionStory>) {
  const cells = JSON.parse(
    readFileSync(join(DATA_DIR, 'derived', 'cession-cells.json'), 'utf8'),
  ) as Cells;
  const t0 = new Map<string, number>();
  for (const g of graph.nodes.filter((n) => n.type === 'GeoFeature')) {
    const t = lostAt(stories.get(g.id), g);
    if (t !== null) t0.set(g.id, t);
  }
  const how = new Map([...stories.entries()].map(([k, v]) => [k, v.how]));
  const status = new Map([...stories.entries()].map(([k, v]) => [k, v.land_status]));
  const all = series([...t0.keys()], t0, how, status, cells);
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
      ...series(ids, t0, how, status, cells),
      cessions: ids.sort(),
      label: (labelOf.get(nid) ?? nid).replace(/ - /g, ', '),
      path: routeFor(nid, 'Nation', nationIds),
    };
  return {
    note: 'Approximate acres of land the federal record shows leaving Native hands, by how the record says it happened, from Royce shapes on a 0.1-degree grid; overlapping areas are counted once. Not a legal or survey measurement.',
    years: YEARS,
    how: HOW,
    statuses: LAND_STATUS,
    all,
    by_nation: byNation,
  };
}
