// D-36: the I4 pair (Charis from SIL, self-hosted subset; Atkinson Hyperlegible Next) is used only if it covers every
// character in real nation names (tests/fixtures/unicode-names.txt, built from the data).
// Cherokee syllabary is covered by Noto Sans Cherokee in the font stack.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

function glyphSet(dir: string, match: RegExp) {
  const set = new Set<number>();
  for (const f of readdirSync(dir).filter((f) => match.test(f))) {
    const font = fontkit.create(readFileSync(join(dir, f)));
    for (const cp of font.characterSet as number[]) set.add(cp);
  }
  return set;
}

const fs = 'node_modules/@fontsource';
const charis = glyphSet('public/fonts', /^charis-regular-(core|ext)\.woff2$/);
const osage = glyphSet(`${fs}/noto-sans-osage/files`, /-400-normal\.woff2$/);
const atkinson = glyphSet(`${fs}/atkinson-hyperlegible-next/files`, /-400-normal\.woff2$/);
const cherokee = glyphSet(`${fs}/noto-sans-cherokee/files`, /-400-normal\.woff2$/);
const text = readFileSync('tests/fixtures/unicode-names.txt', 'utf8');
const needed = [...new Set([...text.normalize('NFC')].map((c) => c.codePointAt(0)!))].filter(
  (cp) => cp > 32 && cp !== 10,
);
const isCherokee = (cp: number) => (cp >= 0x13a0 && cp <= 0x13ff) || (cp >= 0xab70 && cp <= 0xabbf);
const isOsage = (cp: number) => cp >= 0x104b0 && cp <= 0x104ff;
const covered = (cp: number) =>
  isCherokee(cp) ? cherokee.has(cp) : isOsage(cp) ? osage.has(cp) : charis.has(cp);
const hex = (cp: number) =>
  `U+${cp.toString(16).toUpperCase().padStart(4, '0')} ${String.fromCodePoint(cp)}`;

describe('font coverage of real nation names', () => {
  it('Charis (with Noto Sans Cherokee and Osage for those scripts) covers every character', () => {
    const missing = needed.filter((cp) => !covered(cp));
    expect(missing.map(hex)).toEqual([]);
  });
  it('Atkinson Hyperlegible Next covers every character used in interface labels, or falls back to Charis', () => {
    const missing = needed.filter((cp) => !atkinson.has(cp) && !covered(cp));
    expect(missing.map(hex)).toEqual([]);
  });
});
