// Build-time SVG drawings of the cessions and today's Native lands (lower 48), for the home page and
// the small locator maps on record pages. Albers equal-area conic (USGS standard parallels). The
// frame comes from the geometry itself, so nothing is clipped. Coordinates are thinned to keep
// pages light.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rad = Math.PI / 180;
const [phi1, phi2, phi0, lam0] = [29.5 * rad, 45.5 * rad, 23 * rad, -96 * rad];
const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
const C = Math.cos(phi1) ** 2 + 2 * n * Math.sin(phi1);
const rho0 = Math.sqrt(C - 2 * n * Math.sin(phi0)) / n;

export function albers(lon: number, lat: number): [number, number] {
  const rho = Math.sqrt(C - 2 * n * Math.sin(lat * rad)) / n;
  const theta = n * (lon * rad - lam0);
  return [rho * Math.sin(theta), -(rho0 - rho * Math.cos(theta))];
}

type Geometry = { type: string; coordinates: unknown };
interface Feature {
  properties: Record<string, unknown>;
  geometry: Geometry;
}
interface FC {
  features: Feature[];
}

const W = 1000;
const PAD = 8;

const rings = (g: Geometry): [number, number][][] => {
  const polys =
    g.type === 'Polygon'
      ? [g.coordinates]
      : g.type === 'MultiPolygon'
        ? (g.coordinates as unknown[])
        : [];
  return (polys as [number, number][][][]).flat();
};
const inLower48 = (g: Geometry) => {
  const first = rings(g)[0]?.[0];
  return !!first && first[0] > -125 && first[0] < -66 && first[1] > 24 && first[1] < 50;
};

let cache: {
  cessions: Feature[];
  lands: Feature[];
  frame: { minX: number; minY: number; scale: number; height: number };
} | null = null;

function load() {
  if (cache) return cache;
  const root = process.cwd();
  const read = (p: string) => JSON.parse(readFileSync(join(root, p), 'utf8')) as FC;
  const cessions = read('data/derived/cessions.json').features.filter((f) => inLower48(f.geometry));
  const lands = read('data/derived/today-aiannh.json').features.filter(
    (f) => f.properties['k'] === 'land' && inLower48(f.geometry),
  );
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const f of [...cessions, ...lands])
    for (const r of rings(f.geometry))
      for (const [lon, lat] of r) {
        const [x, y] = albers(lon, lat);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
  const scale = (W - 2 * PAD) / (maxX - minX);
  const height = Math.round((maxY - minY) * scale + 2 * PAD);
  cache = { cessions, lands, frame: { minX, minY, scale, height } };
  return cache;
}

function path(g: Geometry, minStep: number): string {
  const { minX, minY, scale } = load().frame;
  let out = '';
  for (const ring of rings(g)) {
    let d = '';
    let count = 0;
    let last: [number, number] | null = null;
    for (const [lon, lat] of ring) {
      const [x, y] = albers(lon, lat);
      const px = (x - minX) * scale + PAD;
      const py = (y - minY) * scale + PAD;
      if (last && Math.hypot(px - last[0], py - last[1]) < minStep) continue;
      d += `${last ? 'L' : 'M'}${Math.round(px)} ${Math.round(py)}`;
      last = [px, py];
      count++;
    }
    if (count >= 3) out += d + 'Z';
  }
  return out;
}

/** Year each cession was recorded as ceded: the researched Royce date when there is one. */
function cededYears(): Map<string, number> {
  const file = join(process.cwd(), 'public', 'data', 'tables', 'cession-stories.json');
  const out = new Map<string, number>();
  if (!existsSync(file)) return out;
  const t = JSON.parse(readFileSync(file, 'utf8')) as Record<string, { ceded_year?: number }>;
  for (const [id, s] of Object.entries(t)) if (s.ceded_year) out.set(id, s.ceded_year);
  return out;
}

/** Home page: one path per year of cession, plus today's lands. */
export function homeMap() {
  const { cessions, lands, frame } = load();
  const ceded = cededYears();
  const byYear = new Map<number, string>();
  for (const f of cessions) {
    const id = String(f.properties['id']);
    const y = ceded.get(id) ?? Math.floor(Number(f.properties['t0']));
    byYear.set(y, (byYear.get(y) ?? '') + path(f.geometry, 3));
  }
  return {
    width: W,
    height: frame.height,
    years: [...byYear.entries()].sort(([a], [b]) => a - b).map(([y, d]) => ({ y, d })),
    lands: lands.map((f) => path(f.geometry, 1.6)).join(''),
  };
}

let base: string | null = null;
/** A record's land on a quiet map of all cessions: { highlighted: [{ id, d }] }. */
export function locatorMap(ids: Iterable<string>) {
  const { cessions, frame } = load();
  base ??= cessions.map((f) => path(f.geometry, 6)).join('');
  const want = new Set(ids);
  const hi = cessions
    .filter((f) => want.has(String(f.properties['id'])))
    .map((f) => ({ id: String(f.properties['id']), d: path(f.geometry, 1.5) }));
  return { width: W, height: frame.height, base, hi };
}

/** The story page: cessions grouped by year and cause, plus today's lands. */
export function storyMap() {
  const { cessions, lands, frame } = load();
  const file = join(process.cwd(), 'public', 'data', 'tables', 'cession-stories.json');
  const stories = existsSync(file)
    ? (JSON.parse(readFileSync(file, 'utf8')) as Record<
        string,
        { how: string; ceded_year?: number | null }
      >)
    : {};
  const groups = new Map<string, { y: number; how: string; d: string }>();
  for (const f of cessions) {
    const id = String(f.properties['id']);
    const y = stories[id]?.ceded_year ?? Math.floor(Number(f.properties['t0']));
    const how = stories[id]?.how ?? 'unknown';
    const key = `${y}-${how}`;
    const g = groups.get(key) ?? { y, how, d: '' };
    g.d += path(f.geometry, 3);
    groups.set(key, g);
  }
  return {
    width: W,
    height: frame.height,
    groups: [...groups.values()].sort((a, b) => a.y - b.y),
    lands: lands.map((f) => path(f.geometry, 1.6)).join(''),
  };
}
