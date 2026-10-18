import { describe, expect, it } from 'vitest';
import { focusLine } from './support';

describe('focusLine', () => {
  it('keeps a semicolon inside parentheses', () => {
    expect(
      focusLine(
        'LANDBACK campaign (launched 2020; Mount Rushmore closure), organizing; regranting',
      ),
    ).toBe('LANDBACK campaign (launched 2020; Mount Rushmore closure), organizing');
  });
  it('drops an aside the length cut leaves open', () => {
    expect(focusLine('Land work (a very long aside that goes on and on)', 30)).toBe('Land work');
  });
});
