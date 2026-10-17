// Native Land Digital relay (docs/design/J2 s.4.2). The browser never sees the API key:
// it calls this function, which adds the key server-side and returns NLD's response verbatim.
// Nothing is stored: no cache, no logs of coordinates or responses.

export interface RelayEnv {
  NLD_KEY?: string;
  NLD_ENABLED?: string;
  /** Comma-separated origins allowed to call the relay. */
  ALLOWED_ORIGINS?: string;
}

const UPSTREAM = 'https://native-land.ca/api/index.php';
const MAPS = new Set(['territories', 'languages']);
const DEFAULT_ORIGINS = [
  'https://landback.land',
  'https://www.landback.land',
  'http://localhost:4321',
];

const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });

export function corsHeaders(origin: string | null, env: RelayEnv): Record<string, string> | null {
  const allowed = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
    : DEFAULT_ORIGINS;
  if (!origin || !allowed.includes(origin)) return null;
  return {
    'access-control-allow-origin': origin,
    vary: 'origin',
    'access-control-allow-methods': 'GET',
  };
}

/** Validate and round coordinates to 2 decimals (about 1 km): enough for a territory lookup. */
export function parseQuery(url: URL): { lat: number; lng: number; maps: string } | string {
  const lat = Number(url.searchParams.get('lat'));
  const lng = Number(url.searchParams.get('lng'));
  if (!Number.isFinite(lat) || lat < -90 || lat > 90)
    return 'lat must be a number between -90 and 90';
  if (!Number.isFinite(lng) || lng < -180 || lng > 180)
    return 'lng must be a number between -180 and 180';
  const maps = (url.searchParams.get('maps') ?? 'territories').split(',').filter(Boolean);
  if (!maps.length || maps.some((m) => !MAPS.has(m)))
    return 'maps must be territories and/or languages';
  return {
    lat: Math.round(lat * 100) / 100,
    lng: Math.round(lng * 100) / 100,
    maps: [...new Set(maps)].join(','),
  };
}

export async function handle(
  request: Request,
  env: RelayEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  const cors = corsHeaders(request.headers.get('origin'), env);
  if (!cors) return json(403, { status: 'forbidden_origin' });
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: { ...cors, 'cache-control': 'no-store' } });
  if (request.method !== 'GET') return json(405, { status: 'method_not_allowed' }, cors);
  if (env.NLD_ENABLED === 'false') return json(503, { status: 'disabled' }, cors);
  if (!env.NLD_KEY) return json(503, { status: 'not_configured' }, cors);
  const url = new URL(request.url);
  if (url.pathname.replace(/\/+$/, '') !== '/api/lookup')
    return json(404, { status: 'not_found' }, cors);
  const q = parseQuery(url);
  if (typeof q === 'string') return json(400, { status: 'bad_request', message: q }, cors);
  const upstream = new URL(UPSTREAM);
  upstream.searchParams.set('maps', q.maps);
  upstream.searchParams.set('position', `${q.lat},${q.lng}`);
  upstream.searchParams.set('key', env.NLD_KEY);
  let res: Response;
  try {
    res = await fetchImpl(upstream, {
      headers: { accept: 'application/json' },
      signal: request.signal,
    });
  } catch {
    return json(502, { status: 'upstream_unreachable' }, cors);
  }
  if (res.status === 401 || res.status === 403) return json(410, { status: 'revoked' }, cors);
  if (!res.ok) return json(502, { status: 'upstream_error', upstream_status: res.status }, cors);
  // Verbatim passthrough: the body is never parsed, edited or stored.
  return new Response(res.body, {
    status: 200,
    headers: {
      ...cors,
      'content-type': res.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'x-atlas-source': 'native-land.ca',
    },
  });
}
