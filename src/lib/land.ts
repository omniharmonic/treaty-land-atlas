// What the record says happened to the land, in plain words: for each Royce area, what each
// treaty, act or order did to it (from Royce's Schedule, read for every area), and for a treaty,
// the land it touched and everything that later happened to that land. Build time only.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { incoming, node, pathFor, type Node } from './graph';

export interface AreaStory {
  how: string;
  how_basis: string;
  instrument: string | null;
  nations: string[];
  acres: number;
  instruments: { id: string; date: string | null }[];
  ceded_year: number | null;
  status?: 'ceded' | 'taken' | 'kept' | 'unchecked';
  entries?: { date: string; role: string; instrument: string | null; quote: string }[];
  royce_summary?: string;
  plain?: string;
}

let cache: Record<string, AreaStory> | null = null;
export function areaStories(): Record<string, AreaStory> {
  cache ??= JSON.parse(
    readFileSync(join(process.cwd(), 'public', 'data', 'tables', 'cession-stories.json'), 'utf8'),
  ) as Record<string, AreaStory>;
  return cache;
}

// The land-loss grid (pipeline/src/geometry/landloss.ts): 0.1-degree cells over the lower 48.
const CELL = 0.1;
const GRID = { west: -125, east: -66.5, south: 24.4 };
const COLS = Math.round((GRID.east - GRID.west) / CELL);
const cellAcres = (cell: number) =>
  (111.32 * CELL) ** 2 *
  Math.cos(((GRID.south + (Math.floor(cell / COLS) + 0.5) * CELL) * Math.PI) / 180) *
  247.105;

let cells: Record<string, number[]> | null = null;
/** Acres covered by a set of areas, counting overlaps once (areas often nest). */
export function unionAcres(ids: Iterable<string>): number {
  cells ??= (
    JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'derived', 'cession-cells.json'), 'utf8'),
    ) as { cells: Record<string, number[]> }
  ).cells;
  const seen = new Set<number>();
  for (const id of ids) for (const c of cells[id] ?? []) seen.add(c);
  let sum = 0;
  for (const c of seen) sum += cellAcres(c);
  return Math.round(sum / 1000) * 1000;
}

export const areaNumber = (id: string) => id.replace('geo-royce-', '');

export function acresText(a: number): string {
  if (!a) return '';
  if (a >= 1e6) return `about ${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)} million acres`;
  if (a >= 1e4) return `about ${Math.round(a / 1000).toLocaleString('en-US')},000 acres`;
  return `about ${Math.round(a / 100) * 100 || a} acres`;
}

/** What an entry did to the land, as a verb phrase with the land as its subject. */
export const ROLE_PHRASE: Record<string, string> = {
  described_or_recognized: 'recognized as Native land',
  reserved: 'set aside as a reservation',
  confirmed: 'earlier terms confirmed',
  ceded: 'recorded as ceded to the United States',
  ceded_part: 'partly recorded as ceded to the United States',
  retroceded: 'taken back by the United States',
  us_reserved: 'kept by the United States for itself',
  other: 'named in the record',
};
/** The kind of change, for color and grouping: did the land stay with the nation or leave it? */
export const ROLE_KIND: Record<string, 'kept' | 'lost' | 'other'> = {
  described_or_recognized: 'kept',
  reserved: 'kept',
  confirmed: 'other',
  ceded: 'lost',
  ceded_part: 'lost',
  retroceded: 'lost',
  us_reserved: 'lost',
  other: 'other',
};

export interface Ref {
  id: string;
  label: string;
  href: string | null;
}
const ref = (id: string | null): Ref | null => {
  const n = id ? node(id) : null;
  return n ? { id: n.id, label: n.label, href: pathFor(n) } : null;
};

export interface Area {
  id: string;
  number: string;
  label: string;
  href: string | null;
  acres: number;
  how: string;
  status: string;
  /** what this treaty did to the area, when the record says */
  role: string | null;
  summary: string | null;
  peoples: string[];
}

/** One step in the life of a treaty's land: a date, what happened, to which areas. */
export interface LandStep {
  date: string;
  year: number;
  role: string;
  kind: 'kept' | 'lost' | 'other';
  by: Ref | null;
  /** Royce's words for the entry when no instrument record is linked */
  quote: string;
  areas: string[];
  acres: number;
  thisTreaty: boolean;
}

/** The land a treaty touched, and every recorded step in that land's history. */
export function treatyLand(n: Node): { areas: Area[]; steps: LandStep[] } {
  const stories = areaStories();
  const ids = new Set(
    incoming(n.id)
      .filter((e) => e.type === 'depicts' && e.source.startsWith('geo-'))
      .map((e) => e.source),
  );
  for (const [id, s] of Object.entries(stories))
    if (s.entries?.some((e) => e.instrument === n.id)) ids.add(id);
  const signed = String(n['date_signed'] ?? '');
  const areas: Area[] = [...ids]
    .map((id): Area | null => {
      const g = node(id);
      const s = stories[id];
      if (!g || !s) return null;
      const mine =
        s.entries?.find((e) => e.instrument === n.id) ??
        (signed ? s.entries?.find((e) => e.date === signed) : undefined);
      return {
        id,
        number: areaNumber(id),
        label: g.label,
        href: pathFor(g),
        acres: s.acres,
        how: s.how,
        status: s.status ?? 'unchecked',
        role: mine?.role ?? null,
        summary: s.plain ?? s.royce_summary ?? null,
        peoples: (g['tribes_as_named_in_schedule'] as string[]) ?? [],
      };
    })
    .filter((a): a is Area => !!a)
    .sort((a, b) => b.acres - a.acres);

  const steps = new Map<string, LandStep>();
  for (const a of areas)
    for (const e of stories[a.id]?.entries ?? []) {
      const key = `${e.date}|${e.role}|${e.instrument ?? e.quote.slice(0, 40)}`;
      const step = steps.get(key) ?? {
        date: e.date,
        year: Number(e.date.slice(0, 4)),
        role: e.role,
        kind: ROLE_KIND[e.role] ?? 'other',
        by: ref(e.instrument),
        quote: e.quote,
        areas: [],
        acres: 0,
        thisTreaty: e.instrument === n.id || (!e.instrument && e.date === signed),
      };
      if (!step.areas.includes(a.id)) step.areas.push(a.id);
      steps.set(key, step);
    }
  for (const s of steps.values()) s.acres = unionAcres(s.areas);
  return {
    areas,
    steps: [...steps.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/** Acre totals of a treaty's areas by what the treaty itself did to them. */
export function landTotals(areas: Area[]) {
  const sum = (f: (a: Area) => boolean) => unionAcres(areas.filter(f).map((a) => a.id));
  return {
    lost: sum((a) => !!a.role && ROLE_KIND[a.role] === 'lost'),
    kept: sum((a) => !!a.role && ROLE_KIND[a.role] === 'kept'),
    all: sum(() => true),
  };
}

export interface ReturnLocation {
  id: string;
  lat: number | null;
  lng: number | null;
  /** site, locality, county, region or none: sacred places are placed only at county level */
  precision: string;
  place: string;
  basis_url: string;
  note: string;
}

/** Where each land return is (crosswalks/return-locations.csv, one sourced row per return). */
export function returnLocations(): Map<string, ReturnLocation> {
  const g = globalThis as { __returnLocations?: Map<string, ReturnLocation> };
  if (g.__returnLocations) return g.__returnLocations;
  const csv = readFileSync(join(process.cwd(), 'crosswalks', 'return-locations.csv'), 'utf8');
  const parse = (line: string) =>
    [...line.matchAll(/("([^"]|"")*"|[^,]*)(,|$)/g)]
      .map((m) => m[1]!.replace(/^"|"$/g, '').replace(/""/g, '"'))
      .slice(0, 7);
  const [head, ...rows] = csv.trim().split('\n');
  const keys = parse(head!);
  const num = (v: string) => (v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
  const out = new Map<string, ReturnLocation>();
  for (const r of rows) {
    const o = Object.fromEntries(parse(r).map((v, i) => [keys[i], v])) as Record<string, string>;
    out.set(o['id']!, {
      id: o['id']!,
      lat: num(o['lat'] ?? ''),
      lng: num(o['lng'] ?? ''),
      precision: o['precision'] ?? 'none',
      place: o['place'] ?? '',
      basis_url: o['basis_url'] ?? '',
      note: o['note'] ?? '',
    });
  }
  return (g.__returnLocations = out);
}

/** Plain status of a land return or campaign, and whether land has actually changed hands. */
export const RETURN_STATUS: Record<string, { word: string; done: boolean }> = {
  completed: { word: 'Returned', done: true },
  'completed-pending-deed': { word: 'Returned, deed pending', done: true },
  'program-concluded': { word: 'Program ended', done: true },
  'in-progress': { word: 'Under way', done: false },
  pending: { word: 'Under way', done: false },
  'program-ongoing': { word: 'Ongoing program', done: false },
  'ongoing-claim': { word: 'Claim, not returned', done: false },
  contested: { word: 'Contested', done: false },
  blocked: { word: 'Blocked', done: false },
  'headline-only': { word: 'Reported, not yet confirmed', done: false },
};
