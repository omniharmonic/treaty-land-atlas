// Claim intake: a Native nation (or its office) asks to claim, correct or remove a page.
// The request becomes an issue in a PRIVATE repository, so contact details never become public.
// Needs CLAIMS_GITHUB_TOKEN (fine-grained, Issues: read and write, on the claims repo only).

export interface ClaimEnv {
  CLAIMS_GITHUB_TOKEN?: string;
  CLAIMS_REPO?: string;
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ORIGINS = [
  'https://landback.land',
  'https://www.landback.land',
  'http://localhost:4321',
];
const MAX = { field: 300, message: 5000 };
const KINDS = new Set(['claim', 'correction', 'removal']);

const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });

export interface Claim {
  kind: string;
  record_id: string;
  nation: string;
  role: string;
  contact: string;
  message: string;
}

export function parseClaim(body: unknown): Claim | string {
  if (!body || typeof body !== 'object') return 'send a JSON object';
  const b = body as Record<string, unknown>;
  const s = (k: string, max = MAX.field) =>
    String(b[k] ?? '')
      .trim()
      .slice(0, max);
  const claim = {
    kind: s('kind'),
    record_id: s('record_id'),
    nation: s('nation'),
    role: s('role'),
    contact: s('contact'),
    message: s('message', MAX.message),
  };
  if (String(b['website'] ?? '')) return 'rejected'; // honeypot field humans never see
  if (!KINDS.has(claim.kind)) return 'kind must be claim, correction or removal';
  if (!claim.nation) return 'say which nation or community you are writing for';
  if (!claim.contact) return 'give an email or phone number so we can reply';
  if (!/^[A-Za-z0-9-]{0,120}$/.test(claim.record_id)) return 'record id is not valid';
  return claim;
}

export async function handleClaim(
  request: Request,
  env: ClaimEnv,
  fetchImpl: typeof fetch = fetch,
) {
  const allowed = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map((x) => x.trim())
    : DEFAULT_ORIGINS;
  const origin = request.headers.get('origin');
  if (!origin || !allowed.includes(origin)) return json(403, { status: 'forbidden_origin' });
  const cors = {
    'access-control-allow-origin': origin,
    vary: 'origin',
    'access-control-allow-methods': 'POST',
    'access-control-allow-headers': 'content-type',
  };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json(405, { status: 'method_not_allowed' }, cors);
  if (!env.CLAIMS_GITHUB_TOKEN) return json(503, { status: 'not_configured' }, cors);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { status: 'bad_request', message: 'send JSON' }, cors);
  }
  const claim = parseClaim(body);
  if (typeof claim === 'string') return json(400, { status: 'bad_request', message: claim }, cors);
  const repo = env.CLAIMS_REPO ?? 'omniharmonic/treaty-land-atlas-claims';
  const title = `${claim.kind === 'removal' ? 'REMOVAL' : claim.kind === 'claim' ? 'Claim' : 'Correction'}: ${claim.nation}${claim.record_id ? ` (${claim.record_id})` : ''}`;
  const issue = {
    title: title.slice(0, 200),
    labels: [claim.kind === 'removal' ? 'removal' : 'claim'],
    body: [
      `**Kind:** ${claim.kind}`,
      `**Nation or community:** ${claim.nation}`,
      `**Record:** ${claim.record_id || '(none given)'}`,
      `**Role or office:** ${claim.role || '(not given)'}`,
      `**Contact:** ${claim.contact}`,
      '',
      claim.message || '(no message)',
      '',
      claim.kind === 'removal'
        ? '_Removal requests are honored first: add the record to data/suppress.yaml and rebuild, then talk._'
        : '_Reply within a few business days. Record the outcome in crosswalks/tribal-review-ledger.csv._',
    ].join('\n'),
  };
  const res = await fetchImpl(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.CLAIMS_GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      'user-agent': 'landback.land claims',
    },
    body: JSON.stringify(issue),
  });
  if (!res.ok) return json(502, { status: 'intake_failed' }, cors);
  return json(201, { status: 'received' }, cors);
}
