import { describe, expect, it } from 'vitest';
import {
  clean,
  extractUrls,
  isId,
  parsePartialDate,
  parseTags,
  slugify,
  splitList,
} from '../src/normalize/index.ts';

describe('clean', () => {
  it('normalizes to NFC without stripping diacritics', () => {
    const decomposed = 'Ho-Chunk Hoocąk'.normalize('NFD');
    const out = clean(decomposed);
    expect(out).toBe('Ho-Chunk Hoocąk'.normalize('NFC'));
    expect(out).toContain('ą');
  });

  it('keeps the modifier letter turned comma (ʻokina) and combining marks', () => {
    expect(clean('  Kanaka ʻŌiwi ')).toBe('Kanaka ʻŌiwi');
    expect(clean('Dakȟóta')).toBe('Dakȟóta');
    expect(clean('ᏣᎳᎩ')).toBe('ᏣᎳᎩ');
  });

  it('collapses whitespace and handles null', () => {
    expect(clean('a\n  b\tc')).toBe('a b c');
    expect(clean(null)).toBe('');
  });
});

describe('splitList', () => {
  it('splits on semicolons', () => {
    expect(splitList('FORCED_REMOVAL; FAILURE_TO_PROTECT')).toEqual([
      'FORCED_REMOVAL',
      'FAILURE_TO_PROTECT',
    ]);
  });
  it('keeps semicolons inside parentheses and brackets', () => {
    expect(splitList('Sioux (Oglala; Brulé); Arapaho [note; aside]')).toEqual([
      'Sioux (Oglala; Brulé)',
      'Arapaho [note; aside]',
    ]);
  });
  it('drops empty items', () => {
    expect(splitList(' ; a;; ')).toEqual(['a']);
  });
});

describe('parsePartialDate', () => {
  it('parses year, month and day precision', () => {
    expect(parsePartialDate('1868')).toMatchObject({
      year: 1868,
      precision: 'year',
      decimal: 1868,
    });
    expect(parsePartialDate('1868-04')).toMatchObject({ month: 4, precision: 'month' });
    expect(parsePartialDate('1868-04-29')).toMatchObject({ day: 29, precision: 'day' });
  });
  it('computes decimal years', () => {
    expect(parsePartialDate('1851-07-02')!.decimal).toBeCloseTo(1851 + 182 / 365, 3);
    expect(parsePartialDate('1800-12-31')!.decimal).toBeLessThan(1801);
  });
  it('rejects impossible or malformed dates', () => {
    expect(parsePartialDate('1867-02-29')).toBeNull();
    expect(parsePartialDate('1868-13')).toBeNull();
    expect(parsePartialDate('circa 1868')).toBeNull();
    expect(parsePartialDate('')).toBeNull();
  });
  it('accepts Feb 29 in a leap year', () => {
    expect(parsePartialDate('1868-02-29')).not.toBeNull();
  });
});

describe('parseTags', () => {
  it('extracts flags and cleans text', () => {
    const r = parseTags('Ceded 1,000 acres [from-memory].');
    expect(r.flags).toEqual(['from-memory']);
    expect(r.text).toBe('Ceded 1,000 acres.');
  });
  it('keeps the reason after the colon', () => {
    const r = parseTags('Creek lands [unverified: V1 found no reference]');
    expect(r.flags).toEqual(['unverified']);
    expect(r.text).toBe('Creek lands (V1 found no reference)');
  });
  it('handles combined tags and mixed reasons in one bracket', () => {
    expect(parseTags('2.5 million acres [from-memory; unverified]')).toEqual({
      text: '2.5 million acres',
      flags: ['from-memory', 'unverified'],
    });
    expect(parseTags("'51 million' [from-memory; not in source read]")).toEqual({
      text: "'51 million' (not in source read)",
      flags: ['from-memory'],
    });
  });
  it('leaves non-tag brackets alone', () => {
    expect(parseTags('Art. VI [sic] text').text).toBe('Art. VI [sic] text');
  });
  it('handles several tags in canonical order', () => {
    const r = parseTags('[disputed] a [verified] b [from-memory] c');
    expect(r.flags).toEqual(['verified', 'from-memory', 'disputed']);
  });
});

describe('ids, urls, slugs', () => {
  it('checks id patterns', () => {
    expect(isId('instrument', 'TLA-T-007')).toBe(true);
    expect(isId('instrument', 'TLA-T-FL1851')).toBe(true);
    expect(isId('violation', 'V01')).toBe(false);
    expect(isId('case', 'case-fletcher-v-peck-1810')).toBe(true);
  });
  it('extracts urls from prose', () => {
    expect(extractUrls('See https://a.gov/x; and https://b.org/y.')).toEqual([
      'https://a.gov/x',
      'https://b.org/y',
    ]);
  });
  it('slugifies for file names only', () => {
    expect(slugify('Dakȟóta Oyáte')).toBe('dakhota-oyate');
  });
});
