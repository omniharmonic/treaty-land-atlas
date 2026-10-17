import { describe, expect, it } from 'vitest';
import { handleClaim, parseClaim } from './lib/claim.ts';

const env = { CLAIMS_GITHUB_TOKEN: 'test-token', ALLOWED_ORIGINS: 'https://landback.land' };
const post = (body: unknown, origin = 'https://landback.land') =>
  new Request('https://relay.example/api/claim', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const good = {
  kind: 'claim',
  record_id: 'nat-pd-karuk',
  nation: 'Karuk Tribe',
  role: 'Cultural office',
  contact: 'office@example.org',
  message: 'We would like to review this page.',
};

describe('claim intake', () => {
  it('validates the form', () => {
    expect(parseClaim(good)).toMatchObject({ nation: 'Karuk Tribe' });
    expect(parseClaim({ ...good, contact: '' })).toMatch(/contact|email/);
    expect(parseClaim({ ...good, kind: 'spam' })).toMatch(/kind/);
    expect(parseClaim({ ...good, website: 'http://bot' })).toBe('rejected');
    expect(parseClaim({ ...good, record_id: '<script>' })).toMatch(/record id/);
  });
  it('files a private issue and never echoes contact details', async () => {
    let sent: { url: string; body: string } | null = null;
    const fake = (async (url: string, init: RequestInit) => {
      sent = { url, body: String(init.body) };
      return new Response('{}', { status: 201 });
    }) as unknown as typeof fetch;
    const res = await handleClaim(post(good), env, fake);
    expect(res.status).toBe(201);
    expect(sent!.url).toBe(
      'https://api.github.com/repos/omniharmonic/treaty-land-atlas-claims/issues',
    );
    expect(sent!.body).toContain('office@example.org');
    expect(await res.text()).not.toContain('office@example.org');
  });
  it('saves to private storage without a GitHub token', async () => {
    const saved: { path: string; body: string }[] = [];
    const res = await handleClaim(
      post(good),
      { ALLOWED_ORIGINS: 'https://landback.land' },
      fetch,
      async (path, body) => {
        saved.push({ path, body });
      },
    );
    expect(res.status).toBe(201);
    expect(saved[0]!.path).toMatch(/^claims\/\d{4}-\d{2}-\d{2}-claim-[0-9a-f]{8}\.json$/);
    expect(JSON.parse(saved[0]!.body)).toMatchObject({
      nation: 'Karuk Tribe',
      contact: 'office@example.org',
    });
  });
  it('refuses other origins and reports missing configuration', async () => {
    expect((await handleClaim(post(good, 'https://evil.example'), env)).status).toBe(403);
    expect(
      (await handleClaim(post(good), { ALLOWED_ORIGINS: 'https://landback.land' })).status,
    ).toBe(503);
  });
});
