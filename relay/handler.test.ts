import { describe, expect, it } from 'vitest';
import { handle, parseQuery } from './lib/handler.ts';

const env = { NLD_KEY: 'test-key-not-real', ALLOWED_ORIGINS: 'https://landback.land' };
const req = (path: string, origin = 'https://landback.land', method = 'GET') =>
  new Request(`https://relay.example${path}`, { method, headers: { origin } });

describe('NLD relay', () => {
  it('refuses other origins and missing configuration', async () => {
    expect(
      (await handle(req('/api/lookup?lat=40&lng=-105', 'https://evil.example'), env)).status,
    ).toBe(403);
    expect(
      (
        await handle(req('/api/lookup?lat=40&lng=-105'), {
          ALLOWED_ORIGINS: 'https://landback.land',
        })
      ).status,
    ).toBe(503);
    expect(
      (await handle(req('/api/lookup?lat=40&lng=-105'), { ...env, NLD_ENABLED: 'false' })).status,
    ).toBe(503);
  });
  it('validates and rounds coordinates; rejects the treaties layer', () => {
    expect(parseQuery(new URL('https://x/api/lookup?lat=40.01579&lng=-105.2705'))).toEqual({
      lat: 40.02,
      lng: -105.27,
      maps: 'territories',
    });
    expect(parseQuery(new URL('https://x/api/lookup?lat=91&lng=0'))).toMatch(/lat/);
    expect(parseQuery(new URL('https://x/api/lookup?lat=1&lng=1&maps=treaties'))).toMatch(/maps/);
  });
  it('adds the key upstream, never echoes it, and passes the body through verbatim', async () => {
    let called = '';
    const body = '{"type":"FeatureCollection","features":[]}';
    const fake = (async (u: URL) => {
      called = String(u);
      return new Response(body, { headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const res = await handle(
      req('/api/lookup?lat=40.015&lng=-105.27&maps=territories,languages'),
      env,
      fake,
    );
    expect(called).toContain('key=test-key-not-real');
    expect(called).toContain('position=40.02%2C-105.27');
    expect(await res.text()).toBe(body);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect([...res.headers.values()].join(' ')).not.toContain('test-key-not-real');
  });
  it('reports a revoked key as 410', async () => {
    const fake = (async () => new Response('', { status: 401 })) as unknown as typeof fetch;
    expect((await handle(req('/api/lookup?lat=1&lng=1'), env, fake)).status).toBe(410);
  });
});
