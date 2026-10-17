// Address lookup for "Where you live". Turns an address, town or ZIP code into rounded
// coordinates. Tries the US Census Bureau geocoder (free, public domain), then OpenStreetMap
// Nominatim for towns and places Census cannot match. Nothing is stored or logged; the response
// carries only rounded coordinates and the town-level part of the match, never the street.

import { corsHeaders, type RelayEnv } from './handler.js';

const CENSUS =
  'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json&address=';
const NOMINATIM =
  'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&addressdetails=1&q=';
const UA = 'landback.land Treaty Land Atlas (https://landback.land/privacy/)';

const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });

/** 3 decimals is about 100 m: enough to find the cessions and territories a place sits in. */
const round = (v: number) => Math.round(v * 1000) / 1000;

export interface Place {
  lat: number;
  lng: number;
  /** town, state and ZIP; never the street line */
  place: string;
  /** two-letter state code when known */
  state: string | null;
  source: 'census' | 'openstreetmap';
}

export function parseAddress(url: URL): string {
  const q = (url.searchParams.get('q') ?? '').trim().replace(/\s+/g, ' ');
  if (q.length < 3 || q.length > 200) return '';
  return q;
}

async function census(q: string, fetchImpl: typeof fetch): Promise<Place | null> {
  const res = await fetchImpl(CENSUS + encodeURIComponent(q), { headers: { 'user-agent': UA } });
  if (!res.ok) return null;
  const m = (await res.json())?.result?.addressMatches?.[0];
  if (!m?.coordinates) return null;
  const parts = String(m.matchedAddress ?? '')
    .split(',')
    .map((s: string) => s.trim());
  return {
    lat: round(Number(m.coordinates.y)),
    lng: round(Number(m.coordinates.x)),
    place: parts.slice(1).join(', '),
    state: parts.find((p: string) => /^[A-Z]{2}$/.test(p)) ?? null,
    source: 'census',
  };
}

async function nominatim(q: string, fetchImpl: typeof fetch): Promise<Place | null> {
  const res = await fetchImpl(NOMINATIM + encodeURIComponent(q), { headers: { 'user-agent': UA } });
  if (!res.ok) return null;
  const m = (await res.json())?.[0];
  if (!m?.lat) return null;
  const a = m.address ?? {};
  const town = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? '';
  return {
    lat: round(Number(m.lat)),
    lng: round(Number(m.lon)),
    place: [town, a.state, a.postcode].filter(Boolean).join(', '),
    state: /^US-[A-Z]{2}$/.test(String(a['ISO3166-2-lvl4'] ?? ''))
      ? String(a['ISO3166-2-lvl4']).slice(3)
      : null,
    source: 'openstreetmap',
  };
}

export async function handleGeocode(
  request: Request,
  env: RelayEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  const cors = corsHeaders(request.headers.get('origin'), env);
  if (!cors) return json(403, { status: 'forbidden_origin' });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'GET') return json(405, { status: 'method_not_allowed' }, cors);
  const q = parseAddress(new URL(request.url));
  if (!q)
    return json(400, { status: 'bad_request', message: 'type an address, town or ZIP code' }, cors);
  try {
    const hit = (await census(q, fetchImpl).catch(() => null)) ?? (await nominatim(q, fetchImpl));
    if (!hit || !Number.isFinite(hit.lat) || !Number.isFinite(hit.lng))
      return json(404, { status: 'not_found' }, cors);
    return json(200, { status: 'ok', ...hit }, cors);
  } catch {
    return json(502, { status: 'upstream_error' }, cors);
  }
}
