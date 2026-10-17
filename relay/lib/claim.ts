// Claim intake: a Native nation (or its office) asks to claim, correct or remove a page.
// Each request is saved as a JSON file in a PRIVATE Vercel Blob store (claims/<date>-<id>.json), so
// contact details never become public. If CLAIMS_GITHUB_TOKEN is set (fine-grained, Issues: write,
// on the private claims repo only), an issue is also opened there as a notification.

export interface ClaimEnv {
  CLAIMS_GITHUB_TOKEN?: string;
  BLOB_READ_WRITE_TOKEN?: string;
  BLOB_STORE_ID?: string;
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

/** Saves one claim; injected so tests never touch storage. */
export type SaveClaim = (path: string, body: string) => Promise<void>;

export async function handleClaim(
  request: Request,
  env: ClaimEnv,
  fetchImpl: typeof fetch = fetch,
  save?: SaveClaim,
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
  if (!save && !env.BLOB_READ_WRITE_TOKEN && !env.BLOB_STORE_ID && !env.CLAIMS_GITHUB_TOKEN)
    return json(503, { status: 'not_configured' }, cors);
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
  const received = new Date().toISOString();
  const record = JSON.stringify({ received, ...claim }, null, 2);
  const path = `claims/${received.slice(0, 10)}-${claim.kind}-${crypto.randomUUID().slice(0, 8)}.json`;
  let stored = false;
  if (save || env.BLOB_READ_WRITE_TOKEN || env.BLOB_STORE_ID) {
    try {
      await (save ?? blobSave)(path, record);
      stored = true;
    } catch {
      stored = false;
    }
  }
  if (!env.CLAIMS_GITHUB_TOKEN)
    return stored
      ? json(201, { status: 'received' }, cors)
      : json(502, { status: 'intake_failed' }, cors);
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
  if (!res.ok && !stored) return json(502, { status: 'intake_failed' }, cors);
  return json(201, { status: 'received' }, cors);
}

async function blobSave(path: string, body: string) {
  const { put } = await import('@vercel/blob');
  await put(path, body, {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}
