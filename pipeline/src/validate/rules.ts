// Data rules V4-V8 and V13-V14 (J3 s.4) over the built graph.
import type { Finding } from '../report/known-issues.ts';
import type { Graph, GraphNode } from './graph.ts';
import { isUrl } from '../normalize/index.ts';
import { readCsv } from '../ingest/csv.ts';

// Control characters other than tab/newline, and the Unicode replacement character.
// eslint-disable-next-line no-control-regex
const BAD_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F�]/;

function* strings(value: unknown, path = ''): Generator<[string, string]> {
  if (typeof value === 'string') yield [path, value];
  else if (Array.isArray(value))
    for (const [i, v] of value.entries()) yield* strings(v, `${path}[${i}]`);
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

/** V4: every string is NFC and free of control characters and U+FFFD. */
export function checkEncoding(graph: Graph): Finding[] {
  const out: Finding[] = [];
  for (const n of graph.nodes)
    for (const [path, s] of strings(n)) {
      if (s !== s.normalize('NFC'))
        out.push({ level: 'error', where: `${n.id}.${path}`, message: 'text is not Unicode NFC' });
      if (BAD_CHARS.test(s))
        out.push({
          level: 'error',
          where: `${n.id}.${path}`,
          message: 'control character or U+FFFD',
        });
    }
  return out;
}

const blank = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length);

/** V5: citation completeness, per J3 s.4.1. Missing citations are warnings so the gaps are listed, not hidden. */
export function checkCitations(graph: Graph): Finding[] {
  const out: Finding[] = [];
  const evidenced = new Set(
    graph.edges.filter((e) => e.type === 'evidenced_by').map((e) => e.source),
  );
  const warn = (n: GraphNode, message: string) => out.push({ level: 'warn', where: n.id, message });
  for (const n of graph.nodes) {
    switch (n.type) {
      case 'Instrument': {
        const nara = n['nara'] as { naid?: string | null } | null | undefined;
        if (!evidenced.has(n.id) && !nara?.naid)
          warn(n, 'instrument has no source URL and no NARA NAID');
        if (n['ratification_status'] === 'ratified' && blank(n['stat_cite']))
          warn(n, 'ratified instrument has no Statutes at Large citation');
        if (blank(n['date_signed'])) warn(n, 'instrument has no date signed');
        break;
      }
      case 'Case':
        if (blank(n['full_citation'])) warn(n, 'case has no full citation');
        if (n['verification_status'] === 'verified' && !evidenced.has(n.id))
          warn(n, 'verified case has no source URL');
        break;
      case 'Statute':
        if (blank(n['citation'])) warn(n, 'statute has no citation');
        if (n['verification_status'] === 'verified' && !evidenced.has(n.id))
          warn(n, 'verified statute has no source URL');
        break;
      case 'Violation':
        if (!evidenced.has(n.id)) warn(n, 'violation has no source URL');
        break;
      case 'Campaign':
        if (!evidenced.has(n.id)) warn(n, 'campaign has no source URL');
        break;
      case 'Organization':
        if (n.confidence !== 'low' && blank(n['website']))
          warn(n, 'listed organization has no website');
        if (n.confidence !== 'low' && blank(n['vetting_notes']))
          warn(n, 'listed organization has no vetting notes');
        break;
    }
  }
  return out;
}

/** V6: count confidence flags by node type (the site shows a badge for each). */
export function confidenceCounts(graph: Graph): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const n of graph.nodes)
    for (const f of (n.flags as string[] | undefined) ?? []) {
      if (!/from_memory|unverified|disputed/.test(f)) continue;
      (out[n.type] ??= {})[f] = (out[n.type]![f] ?? 0) + 1;
    }
  return out;
}

const SHORTENERS = /^(bit\.ly|t\.co|tinyurl\.com|goo\.gl|ow\.ly|buff\.ly|is\.gd)$/i;
const TOKEN_PARAMS = /[?&](token|key|api_key|apikey|access_token|sig|signature)=/i;

/** V7: URL syntax and policy on Source nodes and organization links. */
export function checkLinks(graph: Graph): Finding[] {
  const out: Finding[] = [];
  const check = (where: string, url: string) => {
    if (!isUrl(url)) return out.push({ level: 'error', where, message: `not a URL: ${url}` });
    const u = new URL(url);
    if (SHORTENERS.test(u.hostname))
      out.push({ level: 'error', where, message: `URL shortener: ${url}` });
    if (TOKEN_PARAMS.test(u.search))
      out.push({ level: 'error', where, message: `URL carries a token: ${url}` });
    if (u.protocol === 'http:')
      out.push({ level: 'info', where, message: `plain http link: ${url}` });
    if (u.hostname.endsWith('native-land.ca') && where.startsWith('src-'))
      out.push({
        level: 'info',
        where,
        message: 'links to native-land.ca (link only, never data)',
      });
  };
  for (const n of graph.nodes) {
    if (n.type === 'Source' && typeof n['url'] === 'string' && n['url']) check(n.id, n['url']);
    if (n.type === 'Organization')
      for (const k of ['website', 'donation_url']) {
        const v = n[k];
        if (typeof v === 'string' && v) check(`${n.id}.${k}`, v);
      }
  }
  return out;
}

/** V8: what the publishability rules keep out of public files. */
export function publishability(graph: Graph, suppressed: Set<string>): Finding[] {
  const out: Finding[] = [];
  const orgs = graph.nodes.filter(
    (n) => n.type === 'Organization' && (n.confidence === 'low' || n['display_eligible'] === false),
  );
  out.push({
    level: 'info',
    where: 'organizations',
    message: `${orgs.length} organization(s) published as records without website or donation links: ${orgs.map((o) => o.id).join(', ')}`,
  });
  const nationSpecific = graph.nodes.filter(
    (n) => (n['tribal_review'] as { scope?: string } | undefined)?.scope === 'nation_specific',
  );
  const narrativeAllowed = nationSpecific.filter(
    (n) => (n['publication'] as { narrative_allowed?: boolean } | undefined)?.narrative_allowed,
  );
  out.push({
    level: 'info',
    where: 'nation-specific nodes',
    message: `${nationSpecific.length} nation-specific node(s); ${narrativeAllowed.length} may carry narrative (the rest are record-only until the nation reviews them)`,
  });
  if (suppressed.size)
    out.push({
      level: 'info',
      where: 'suppress.yaml',
      message: `${suppressed.size} id(s) suppressed`,
    });
  return out;
}

const SENSITIVE_TERMS =
  /\b(burial|burials|sacred site|ceremonial|petroglyphs?|caves?|grave|graves)\b/i;

/** V13: sensitive terms in displayed text are flagged for human review. */
export function checkSensitivity(graph: Graph): Finding[] {
  const out: Finding[] = [];
  const fields = [
    'summary',
    'land_description',
    'mechanism_summary',
    'land_lost_description',
    'holding_summary',
  ];
  for (const n of graph.nodes)
    for (const f of fields) {
      const v = n[f];
      if (typeof v === 'string' && SENSITIVE_TERMS.test(v))
        out.push({
          level: 'warn',
          where: `${n.id}.${f}`,
          message: `mentions "${SENSITIVE_TERMS.exec(v)![0]}": check that no location detail is given`,
        });
    }
  return out;
}

const REVIEW_STATUSES = [
  'not_yet_contacted',
  'invited',
  'reviewed',
  'co_authored',
  'edits_requested',
  'declined',
  'withdrawn',
];

/** V14: review status integrity against crosswalks/tribal-review-ledger.csv. */
export function checkReviewLedger(graph: Graph, ledgerFile: string): Finding[] {
  const out: Finding[] = [];
  const ids = new Set(graph.nodes.map((n) => n.id));
  const { rows } = readCsv(ledgerFile);
  const ledger = new Map<string, Record<string, string>>();
  for (const { line, record: r } of rows) {
    const where = `tribal-review-ledger.csv:${line}`;
    if (!ids.has(r['node_id'] ?? ''))
      out.push({ level: 'error', where, message: `unknown node id ${r['node_id']}` });
    if (!REVIEW_STATUSES.includes(r['status'] ?? ''))
      out.push({
        level: 'error',
        where,
        message: `status must be one of ${REVIEW_STATUSES.join(', ')}`,
      });
    if (
      ['reviewed', 'co_authored'].includes(r['status'] ?? '') &&
      !(r['date'] && r['reviewer_role'] && r['record_id'])
    )
      out.push({
        level: 'error',
        where,
        message: 'reviewed/co_authored needs date, reviewer_role and record_id',
      });
    ledger.set(r['node_id'] ?? '', r);
  }
  for (const n of graph.nodes) {
    const review = n['tribal_review'] as { status?: string } | undefined;
    const publication = n['publication'] as { state?: string } | undefined;
    if (['reviewed', 'co_authored'].includes(review?.status ?? '') && !ledger.has(n.id))
      out.push({
        level: 'error',
        where: n.id,
        message: `status ${review?.status} with no ledger entry`,
      });
    if (
      ['declined', 'withdrawn'].includes(review?.status ?? '') &&
      !['record_only', 'withheld'].includes(publication?.state ?? '')
    )
      out.push({
        level: 'error',
        where: n.id,
        message: 'declined/withdrawn must be record_only or withheld',
      });
  }
  return out;
}
