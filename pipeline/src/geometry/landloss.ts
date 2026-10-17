// Approximate land recorded as ceded over time (G2: never sum polygon areas, because cessions
// overlap). A 0.1-degree grid over the lower 48 records, for every cell, the earliest Royce date
// that covers its center. Areas come from cells, so overlaps count once. Output is an estimate and
// is labeled as one wherever it is shown.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DERIVED_DIR } from './index.ts';

export const CELL = 0.1;
const BOUNDS = { west: -125, east: -66.5, south: 24.4, north: 49.5 };
const ACRES_PER_KM2 = 247.105;
const KM_PER_DEG = 111.32;

type Ring = [number, number][];
type Poly = Ring[];
interface Feature {
  properties: { id: string; t0: number | null };
  geometry: { type: string; coordinates: unknown };
}

function polys(g: Feature['geometry']): Poly[] {
  return g.type === 'Polygon'
    ? [g.coordinates as Poly]
    : g.type === 'MultiPolygon'
      ? (g.coordinates as Poly[])
      : [];
}

function inRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPoly(x: number, y: number, p: Poly): boolean {
  if (!p[0] || !inRing(x, y, p[0])) return false;
  for (let h = 1; h < p.length; h++) if (inRing(x, y, p[h]!)) return false;
  return true;
}

export function cellAcres(lat: number): number {
  return (KM_PER_DEG * CELL) ** 2 * Math.cos((lat * Math.PI) / 180) * ACRES_PER_KM2;
}

/** For each cession: the grid cells whose centers it covers. */
export function cessionCells(features: Feature[]): Map<string, number[]> {
  const cols = Math.round((BOUNDS.east - BOUNDS.west) / CELL);
  const out = new Map<string, number[]>();
  for (const f of features) {
    const ps = polys(f.geometry);
    let x0 = 180,
      y0 = 90,
      x1 = -180,
      y1 = -90;
    for (const p of ps)
      for (const [x, y] of p[0] ?? []) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    const cells: number[] = [];
    const c0 = Math.max(0, Math.floor((x0 - BOUNDS.west) / CELL));
    const c1 = Math.min(cols - 1, Math.floor((x1 - BOUNDS.west) / CELL));
    const r0 = Math.max(0, Math.floor((y0 - BOUNDS.south) / CELL));
    const r1 = Math.floor((y1 - BOUNDS.south) / CELL);
    for (let r = r0; r <= r1; r++) {
      const y = BOUNDS.south + (r + 0.5) * CELL;
      if (y > BOUNDS.north) break;
      for (let c = c0; c <= c1; c++) {
        const x = BOUNDS.west + (c + 0.5) * CELL;
        if (ps.some((p) => inPoly(x, y, p))) cells.push(r * cols + c);
      }
    }
    out.set(f.properties.id, cells);
  }
  return out;
}

export function cellLat(cell: number): number {
  const cols = Math.round((BOUNDS.east - BOUNDS.west) / CELL);
  return BOUNDS.south + (Math.floor(cell / cols) + 0.5) * CELL;
}

/** Cumulative acres (union) by year, for a set of cessions with first dates. */
export function cumulativeAcres(
  cessions: { id: string; t0: number | null }[],
  cells: Map<string, number[]>,
  years: number[],
): { cumulative: number[]; total: number } {
  const first = new Map<number, number>();
  for (const c of cessions) {
    if (c.t0 === null) continue;
    for (const cell of cells.get(c.id) ?? []) {
      const prev = first.get(cell);
      if (prev === undefined || c.t0 < prev) first.set(cell, c.t0);
    }
  }
  const perYear = new Map<number, number>();
  let total = 0;
  for (const [cell, t] of first) {
    const a = cellAcres(cellLat(cell));
    total += a;
    const y = Math.floor(t);
    perYear.set(y, (perYear.get(y) ?? 0) + a);
  }
  let run = 0;
  const cumulative = years.map((y) => {
    run += perYear.get(y) ?? 0;
    return Math.round(run / 1000) * 1000;
  });
  // anything before the first year counts from the start
  const before = [...perYear.entries()]
    .filter(([y]) => y < years[0]!)
    .reduce((s, [, a]) => s + a, 0);
  return {
    cumulative: cumulative.map((v) => v + Math.round(before / 1000) * 1000),
    total: Math.round(total / 1000) * 1000,
  };
}

/** Writes data/derived/cession-cells.json (cells per cession) for the emit stage. */
export function writeCessionCells() {
  const fc = JSON.parse(readFileSync(join(DERIVED_DIR, 'cessions.json'), 'utf8')) as {
    features: Feature[];
  };
  const cells = cessionCells(fc.features);
  const obj = Object.fromEntries([...cells.entries()].sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(
    join(DERIVED_DIR, 'cession-cells.json'),
    JSON.stringify({ cell_degrees: CELL, bounds: BOUNDS, cells: obj }) + '\n',
  );
  const n = [...cells.values()].reduce((s, c) => s + c.length, 0);
  return `cession-cells.json: ${cells.size} cessions, ${n} cell memberships at ${CELL} degrees`;
}
