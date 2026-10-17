import { describe, expect, it } from 'vitest';
import { handleGeocode } from './lib/geocode.ts';

const env = { ALLOWED_ORIGINS: 'https://landback.land' };
const req = (q: string, origin = 'https://landback.land') =>
  new Request(`https://relay.example/api/geocode?q=${encodeURIComponent(q)}`, {
    headers: { origin },
  });
const reply = (body: unknown, ok = true) =>
  (async () => new Response(JSON.stringify(body), { status: ok ? 200 : 500 })) as typeof fetch;

describe('geocode relay', () => {
  it('refuses other origins and empty queries', async () => {
    expect((await handleGeocode(req('Denver', 'https://evil.example'), env)).status).toBe(403);
    expect((await handleGeocode(req('x'), env)).status).toBe(400);
  });
  it('returns rounded coordinates and drops the street line', async () => {
    const census = {
      result: {
        addressMatches: [
          {
            matchedAddress: '1600 PENNSYLVANIA AVE NW, WASHINGTON, DC, 20500',
            coordinates: { x: -77.036543, y: 38.897674 },
          },
        ],
      },
    };
    const res = await handleGeocode(req('1600 Pennsylvania Ave'), env, reply(census));
    const body = await res.json();
    expect(body).toEqual({
      status: 'ok',
      lat: 38.898,
      lng: -77.037,
      place: 'WASHINGTON, DC, 20500',
      state: 'DC',
      source: 'census',
    });
    expect(JSON.stringify(body)).not.toMatch(/PENNSYLVANIA/);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
  it('falls back to OpenStreetMap for towns', async () => {
    let n = 0;
    const f = (async () => {
      n++;
      return new Response(
        JSON.stringify(
          n === 1
            ? { result: { addressMatches: [] } }
            : [
                {
                  lat: '39.7392',
                  lon: '-104.9903',
                  address: { city: 'Denver', state: 'Colorado', 'ISO3166-2-lvl4': 'US-CO' },
                },
              ],
        ),
      );
    }) as typeof fetch;
    const body = await (await handleGeocode(req('Denver, CO'), env, f)).json();
    expect(body).toMatchObject({
      lat: 39.739,
      lng: -104.99,
      place: 'Denver, Colorado',
      state: 'CO',
      source: 'openstreetmap',
    });
  });
});
