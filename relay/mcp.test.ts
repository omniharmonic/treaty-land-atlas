import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { mcpHandler } from './lib/mcp.ts';

// Serves the atlas's published data from public/data/ and a fake geocoder, so nothing leaves the machine.
const fake = (async (input: RequestInfo | URL) => {
  const u = String(input);
  if (u.startsWith('https://atlas.test/data/'))
    return new Response(readFileSync(`public/data/${u.slice('https://atlas.test/data/'.length)}`));
  if (u.includes('geocoding.geo.census.gov'))
    return new Response(
      JSON.stringify({
        result: {
          addressMatches: [
            {
              matchedAddress: '1 MAIN ST, BOULDER, CO, 80302',
              coordinates: { x: -105.27, y: 40.015 },
            },
          ],
        },
      }),
    );
  return new Response('not found', { status: 404 });
}) as typeof fetch;

const handler = mcpHandler({ ATLAS_DATA: 'https://atlas.test/data' }, fake);
let id = 0;
async function rpc(method: string, params: unknown) {
  const res = await handler(
    new Request('https://api.example/api/mcp', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        'mcp-protocol-version': '2025-06-18',
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
    }),
  );
  const body = await res.text();
  const json = body.startsWith('{')
    ? body
    : body
        .split('\n')
        .find((l) => l.startsWith('data:'))!
        .slice(5);
  return JSON.parse(json);
}
const call = async (name: string, args: unknown) =>
  (await rpc('tools/call', { name, arguments: args })).result as {
    content: { text: string }[];
    structuredContent?: Record<string, unknown>;
  };

describe('MCP server', () => {
  it('lists its four read-only tools', async () => {
    const r = await rpc('tools/list', {});
    expect(r.result.tools.map((t: { name: string }) => t.name).sort()).toEqual([
      'get_record',
      'search_atlas',
      'support_the_work',
      'whose_land',
    ]);
  });
  it('tells the history of a place from an address', async () => {
    const r = await call('whose_land', { place: '1 Main St, Boulder, CO' });
    const t = r.content[0]!.text;
    expect(t).toMatch(/1851/);
    expect(t).toMatch(/Fort Laramie/);
    expect(t).toMatch(/Cheyenne/);
    expect(t).not.toMatch(/MAIN ST/);
  }, 20000);
  it('searches, reads a record and lists support', async () => {
    const s = await call('search_atlas', { query: 'Fort Laramie', type: 'Instrument' });
    expect(s.content[0]!.text).toMatch(/TLA-T-/);
    const rec = await call('get_record', { id: 'TLA-T-161' });
    expect(rec.content[0]!.text).toMatch(/Menominee/);
    const sup = await call('support_the_work', { states: ['CO'] });
    expect(sup.content[0]!.text).toMatch(/Native American Rights Fund/);
  }, 20000);
});
