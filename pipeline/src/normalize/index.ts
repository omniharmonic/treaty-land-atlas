// Normalization helpers shared by every loader (J5 P1-03).
// Rule: never fold or strip diacritics; only NFC-normalize and trim.

export function nfc(value: string): string {
  return value.normalize('NFC');
}

/** NFC + trim + collapse internal runs of whitespace (newlines kept as spaces). */
export function clean(value: string | null | undefined): string {
  if (value == null) return '';
  return nfc(value).replace(/\s+/g, ' ').trim();
}

/** Split a "; "-separated list cell. Semicolons inside brackets or parentheses are kept. */
export function splitList(value: string | null | undefined): string[] {
  const text = clean(value);
  if (!text) return [];
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(' || ch === '[') depth++;
    else if ((ch === ')' || ch === ']') && depth > 0) depth--;
    if (ch === ';' && depth === 0) {
      if (current.trim()) out.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

export type DatePrecision = 'year' | 'month' | 'day';
export interface PartialDate {
  iso: string;
  year: number;
  month?: number;
  day?: number;
  precision: DatePrecision;
  /** Decimal year at the start of the period, for the time slider. */
  decimal: number;
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const daysInMonth = (y: number, m: number) => (m === 2 && isLeap(y) ? 29 : DAYS_IN_MONTH[m - 1]!);

/** Parse YYYY, YYYY-MM or YYYY-MM-DD. Returns null for anything else or impossible dates. */
export function parsePartialDate(value: string | null | undefined): PartialDate | null {
  const text = clean(value);
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(text);
  if (!m) return null;
  const year = Number(m[1]);
  const month = m[2] ? Number(m[2]) : undefined;
  const day = m[3] ? Number(m[3]) : undefined;
  if (month !== undefined && (month < 1 || month > 12)) return null;
  if (day !== undefined && (day < 1 || day > daysInMonth(year, month!))) return null;
  const yearDays = isLeap(year) ? 366 : 365;
  let dayOfYear = 0;
  if (month !== undefined) {
    for (let i = 1; i < month; i++) dayOfYear += daysInMonth(year, i);
    if (day !== undefined) dayOfYear += day - 1;
  }
  return {
    iso: text,
    year,
    month,
    day,
    precision: day !== undefined ? 'day' : month !== undefined ? 'month' : 'year',
    decimal: Number((year + dayOfYear / yearDays).toFixed(4)),
  };
}

export const CONFIDENCE_TAGS = ['verified', 'from-memory', 'disputed', 'unverified'] as const;
export type ConfidenceTag = (typeof CONFIDENCE_TAGS)[number];

export interface TaggedText {
  text: string;
  flags: ConfidenceTag[];
}

const BRACKET_RE = /\[([^\]]*)\]/g;
const TAG_TOKEN_RE = /^(verified|from-memory|disputed|unverified)\b\s*:?\s*(.*)$/i;

/**
 * Pull inline confidence tags out of a cell: "[from-memory]", "[unverified: reason]",
 * "[from-memory; unverified]", "[from-memory; not in source read]".
 * Any explanation is kept as plain prose in parentheses, so nothing a researcher wrote is lost.
 * Brackets that do not start with a tag are left untouched.
 */
export function parseTags(value: string | null | undefined): TaggedText {
  const flags = new Set<ConfidenceTag>();
  const text = clean(value)
    .replace(BRACKET_RE, (whole, inner: string) => {
      if (!TAG_TOKEN_RE.test(inner.trim())) return whole;
      const reasons: string[] = [];
      for (const token of inner.split(';')) {
        const m = TAG_TOKEN_RE.exec(token.trim());
        if (m) {
          flags.add(m[1]!.toLowerCase() as ConfidenceTag);
          if (m[2]) reasons.push(m[2].trim());
        } else if (token.trim()) {
          reasons.push(token.trim());
        }
      }
      return reasons.length ? `(${reasons.join('; ')})` : '';
    })
    .replace(/\s+([.,;:)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { text, flags: CONFIDENCE_TAGS.filter((t) => flags.has(t)) };
}

export const ID_PATTERNS: Record<string, RegExp> = {
  instrument: /^TLA-(T-\d{3}[A-Z]?|T-FL1851|U-CA-[A-R]|U-[A-Z0-9]+|X-[A-Z0-9]+|A-\d{4})$/,
  nation: /^nat-[a-z0-9-]+$/,
  violation: /^V\d{3}$/,
  case: /^case-[a-z0-9-]+$/,
  statute: /^stat-[a-z0-9-]+$/,
  era: /^era-\d{2}$/,
  organization: /^org-[a-z0-9-]+$/,
  campaign: /^camp-[a-z0-9-]+$/,
  source: /^(GEO-\d{3}|src-[0-9a-f]{10})$/,
  geo: /^geo-[a-z0-9-]+(@v\d+\.\d+\.\d+)?$/,
};

export function isId(kind: keyof typeof ID_PATTERNS, value: string): boolean {
  return ID_PATTERNS[kind]!.test(value);
}

/** True if the string is a parseable absolute http(s) URL. */
export function isUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Pull every http(s) URL out of free text (source_urls cells mix prose and links). */
export function extractUrls(value: string | null | undefined): string[] {
  const found = clean(value).match(/https?:\/\/[^\s;,<>"')\]]+/g) ?? [];
  return found.map((u) => u.replace(/[.]+$/, ''));
}

/** URL-safe slug that keeps the meaning of non-ASCII letters (used only for file names, not data). */
export function slugify(value: string): string {
  return clean(value)
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
