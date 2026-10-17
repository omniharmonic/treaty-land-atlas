// Calls to our relay (geocoding, Native Land Digital, claims). Tries api.landback.land first and
// falls back to the relay's vercel.app address when that name does not resolve, which happens
// for a while on resolvers that cached "no such name" before the subdomain existed.

const FALLBACK = 'https://landback-nld-relay.vercel.app';
let working: string | null = null;

export async function relayFetch(
  relay: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const bases = [...new Set([working, relay, FALLBACK].filter(Boolean) as string[])];
  let lastError: unknown = null;
  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, init);
      working = base;
      return res;
    } catch (err) {
      lastError = err; // network or DNS failure: try the next address
    }
  }
  throw lastError ?? new Error('relay unreachable');
}
