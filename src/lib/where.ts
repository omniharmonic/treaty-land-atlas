// "Where you live": everything the atlas knows about one point. Pure; used by the /where/ page in
// the browser and by the MCP server, both reading the published data in /data/.
//
// A point sits inside zero or more Royce cessions (land the United States recorded as ceded, with
// the year, the instrument and how it was taken), near or inside reservations and other Native
// lands today (Census), and within the history of nations that the graph links to present-day
// nations and to the organizations doing the work. Territory maps from Native Land Digital are
// added separately, live, because they may not be stored.

import { routeFor } from './routes';
import { supportFor, type SupportIndex, type SupportResult } from './support';

type Ring = number[][];
interface Feature {
  properties: Record<string, unknown>;
  geometry:
    { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Ring[][] };
}
export interface Collection {
  features: Feature[];
}
type LiteNode = [string, string, string, string, string | null, number | null];
type LiteEdge = [string, string, string, string];

export interface WhereData {
  cessions: Collection;
  today: Collection;
  stories: Record<
    string,
    { how: string; how_basis: string; instrument: string | null; nations: string[] }
  >;
  headlines: Record<string, string>;
  lite: { nodes: LiteNode[]; edges: LiteEdge[] };
  story: { chapters: { start_year: number; end_year: number; title: string; lede: string }[] };
  support: SupportIndex;
}

export interface Ref {
  id: string;
  label: string;
  path: string | null;
  year?: number | null;
  headline?: string | null;
}

export interface WhereReport {
  lat: number;
  lng: number;
  cessions: (Ref & { how: string; how_basis: string; instrument: Ref | null; nations: Ref[] })[];
  /** violations of the treaties that took this land: the broken promises */
  broken: Ref[];
  cases: Ref[];
  /** reservations and Native lands today containing the point, then the nearest */
  lands_here: string[];
  lands_near: { name: string; km: number }[];
  chapter: { title: string; lede: string; start_year: number; end_year: number } | null;
  nations: Ref[];
  states: string[];
  support: SupportResult;
}

function inRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i] as [number, number];
    const [xj, yj] = ring[j] as [number, number];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const inPolygon = (x: number, y: number, rings: Ring[]) =>
  inRing(x, y, rings[0]!) && !rings.slice(1).some((h) => inRing(x, y, h));

export function contains(f: Feature, lng: number, lat: number): boolean {
  const g = f.geometry;
  if (!g) return false;
  return g.type === 'Polygon'
    ? inPolygon(lng, lat, g.coordinates)
    : g.coordinates.some((p) => inPolygon(lng, lat, p));
}

/** Rough distance in km from a point to the nearest vertex of a feature (good enough for "near"). */
function nearestKm(f: Feature, lng: number, lat: number): number {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const k = Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  for (const p of polys)
    for (const v of p[0]!) {
      const dx = (v[0]! - lng) * k;
      const dy = v[1]! - lat;
      best = Math.min(best, dx * dx + dy * dy);
    }
  return Math.sqrt(best) * 111.2;
}

export function placeReport(d: WhereData, lat: number, lng: number): WhereReport {
  const nodes = new Map(d.lite.nodes.map((n) => [n[0], n]));
  const nationIds = d.lite.nodes.filter((n) => n[1] === 'Nation').map((n) => n[0]);
  const ref = (id: string): Ref => {
    const n = nodes.get(id);
    return {
      id,
      label: n?.[2] ?? id,
      path: n ? routeFor(id, n[1], nationIds) : null,
      year: n?.[5] ?? null,
      headline: d.headlines[id] ?? null,
    };
  };
  const out = new Map<string, LiteEdge[]>();
  for (const e of d.lite.edges) (out.get(e[1]) ?? out.set(e[1], []).get(e[1])!).push(e);
  const inc = new Map<string, LiteEdge[]>();
  for (const e of d.lite.edges) (inc.get(e[2]) ?? inc.set(e[2], []).get(e[2])!).push(e);

  const hits = d.cessions.features
    .filter((f) => contains(f, lng, lat))
    .map((f) => f.properties as { id: string; t0: number; how: string; nations?: string[] })
    .sort((a, b) => a.t0 - b.t0);
  const cessions = hits.map((p) => {
    const st = d.stories[p.id];
    const nations = (st?.nations ?? p.nations ?? []).map(ref);
    return {
      ...ref(p.id),
      year: Math.floor(p.t0),
      how: st?.how ?? p.how ?? 'unknown',
      how_basis: st?.how_basis ?? '',
      instrument: st?.instrument ? ref(st.instrument) : null,
      nations,
    };
  });
  const instruments = [
    ...new Set(cessions.map((c) => c.instrument?.id).filter(Boolean) as string[]),
  ];
  const broken = new Map<string, Ref>();
  const cases = new Map<string, Ref>();
  for (const i of instruments) {
    for (const e of out.get(i) ?? []) if (e[0] === 'violated_by') broken.set(e[2], ref(e[2]));
    for (const e of inc.get(i) ?? [])
      if (e[0] === 'concerns_instrument') cases.set(e[1], ref(e[1]));
  }
  const states = new Set<string>();
  for (const c of cessions)
    for (const e of out.get(c.id) ?? [])
      if (e[0] === 'located_in' && e[2].startsWith('plc-state-'))
        states.add(e[2].slice(10).toUpperCase());
  const nationList = [...new Set(cessions.flatMap((c) => c.nations.map((n) => n.id)))];

  const landName = (f: Feature) => String(f.properties['NAMELSAD'] ?? f.properties['NAME']);
  const here = d.today.features.filter((f) => contains(f, lng, lat));
  const near = d.today.features
    .filter((f) => !here.includes(f) && f.properties['k'] !== 'statistical')
    .map((f) => ({ name: landName(f), km: Math.round(nearestKm(f, lng, lat)) }))
    .filter((x) => x.km <= 120)
    .sort((a, b) => a.km - b.km)
    .slice(0, 5);
  const first = cessions[0]?.year;
  const chapter =
    first != null
      ? (d.story.chapters.find((c) => first >= c.start_year && first <= c.end_year) ?? null)
      : null;
  return {
    lat,
    lng,
    cessions,
    broken: [...broken.values()].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    cases: [...cases.values()].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    lands_here: here.map(landName),
    lands_near: near,
    chapter: chapter && {
      title: chapter.title,
      lede: chapter.lede,
      start_year: chapter.start_year,
      end_year: chapter.end_year,
    },
    nations: nationList.map(ref),
    states: [...states].sort(),
    support: supportFor(d.support, { nations: nationList, states: [...states] }),
  };
}
