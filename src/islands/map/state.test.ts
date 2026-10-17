import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, inView, parseHash, toHash } from './state';

describe('map hash state', () => {
  it('round-trips', () => {
    const s = parseHash(
      '#y=1851&m=win&w=5&v=honored&cut=1830&l=cessions,today&c=44.50,-103.10,5.0&sel=geo-royce-89',
    );
    expect(parseHash(toHash(s))).toEqual(s);
    expect(s).toMatchObject({
      year: 1851,
      mode: 'win',
      win: 5,
      view: 'honored',
      cut: 1830,
      sel: 'geo-royce-89',
    });
  });
  it('ignores bad input without throwing', () => {
    const s = parseHash('#y=abc&m=evil&w=7&cut=1999&l=nld,cessions&c=999,0,3&sel=<script>');
    expect(s.year).toBe(DEFAULT_STATE.year);
    expect(s.mode).toBe('cum');
    expect(s.win).toBe(DEFAULT_STATE.win);
    expect(s.cut).toBe(DEFAULT_STATE.cut);
    expect([...s.layers]).toEqual(['cessions']);
    expect(s.center).toBeNull();
    expect(s.sel).toBeNull();
  });
  it('defaults produce a short hash', () => {
    expect(toHash(DEFAULT_STATE)).toBe('#y=1868');
  });
  it('selects cessions cumulatively or in a window', () => {
    expect(inView(1867.5, { year: 1868, mode: 'cum', win: 10 })).toBe(true);
    expect(inView(1868.9, { year: 1868, mode: 'cum', win: 10 })).toBe(true);
    expect(inView(1869.1, { year: 1868, mode: 'cum', win: 10 })).toBe(false);
    expect(inView(1850, { year: 1868, mode: 'win', win: 10 })).toBe(false);
    expect(inView(1860, { year: 1868, mode: 'win', win: 10 })).toBe(true);
  });
});
