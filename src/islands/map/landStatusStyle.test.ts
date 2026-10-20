import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FLAGS, LAND_STATUS } from '../../../pipeline/src/emit/landStatus';
import {
  CLASS_ORDER,
  EDGE,
  FAMILY,
  FILL,
  FLAG_LABEL,
  INK,
  LABEL,
  LS_TO_CLASS,
  PRESETS,
  SHORT,
  STATUS_HELP,
  STATUS_LABEL,
  STATUS_ORDER,
  contrast,
  displayClass,
  drawPatterns,
  hatchInk,
} from './landStatusStyle';

describe('land status encoding (docs/design/K1-map-visual-encoding.md)', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'styles', 'global.css'), 'utf8');
  it('matches the pipeline vocabulary', () => {
    expect([...STATUS_ORDER]).toEqual([...LAND_STATUS]);
    for (const s of LAND_STATUS) expect(CLASS_ORDER).toContain(LS_TO_CLASS[s]);
    for (const f of FLAGS) expect(FLAG_LABEL[f]).toBeTruthy();
  });
  it('gives every class a fill in both themes, family ink, labels, edge and a CSS token', () => {
    for (const c of CLASS_ORDER) {
      expect(FILL.light[c]).toMatch(/^#[0-9A-F]{6}$/i);
      expect(FILL.dark[c]).toMatch(/^#[0-9A-F]{6}$/i);
      expect(INK.light[FAMILY[c]]).toBeTruthy();
      expect(LABEL[c]).toBeTruthy();
      expect(SHORT[c]).toBeTruthy();
      expect(EDGE[c].width).toBeGreaterThan(0);
      expect(css).toMatch(new RegExp(`--ls-${c}:\\s*#[0-9a-f]{6}`));
    }
    for (const s of STATUS_ORDER) expect(STATUS_HELP[s]).toBeTruthy();
  });
  it('hatch ink contrasts at least 3:1 with every fill', () => {
    for (const theme of ['light', 'dark'] as const)
      for (const c of CLASS_ORDER)
        expect(contrast(hatchInk(theme, c), FILL[theme][c])).toBeGreaterThanOrEqual(3);
  });
  it('uses "ceded" only as recorded or never ceded, and the agreed wording', () => {
    for (const s of STATUS_ORDER)
      expect(STATUS_LABEL[s].replace(/recorded as ceded|never ceded/gi, '')).not.toMatch(/ceded/i);
    expect(LABEL.desc).toBe('Described in a treaty, never ceded');
    expect(JSON.stringify(PRESETS)).not.toMatch(/lawful/i);
  });
  it('displayClass follows promise, loss and the honored rules', () => {
    const f = { ls: 'ceded_by_ratified_treaty', t0: 1861.5, py: 1851 };
    expect(displayClass(f, 1840)).toBe('prior');
    expect(displayClass(f, 1855)).toBe('reserved');
    expect(displayClass(f, 1862)).toBe('ceded');
    expect(displayClass({ ls: 'promised_reserved', t0: 9999, py: 1868 }, 1860)).toBe('prior');
    expect(displayClass({ ls: 'promised_reserved', t0: 9999, py: 1868 }, 1890)).toBe('reserved');
    expect(displayClass({ ls: 'described_not_ceded', t0: 9999, py: null }, 1800)).toBe('desc');
    // honored through 1868: a recorded cession before the cut greys; a statute taking never does
    expect(displayClass(f, 1890, 1868)).toBe('gone');
    expect(displayClass({ ls: 'taken_by_statute', t0: 1863.5, py: 1851 }, 1890, 1868)).toBe(
      'statute',
    );
    expect(displayClass(f, 1890, 1851)).toBe('reserved');
  });
  it('presets list only known classes', () => {
    for (const p of Object.values(PRESETS))
      for (const c of p.color) expect(CLASS_ORDER).toContain(c);
  });
  it('draws patterns of the right size', () => {
    const imgs = drawPatterns('light', 1);
    for (const name of [
      'hatch-solid-dk',
      'hatch-dot-lt',
      'gap-dots',
      'mas-solid',
      'mas-dotted-sel',
    ]) {
      const img = imgs[name]!;
      expect(img.data.length).toBe(img.width * img.height * 4);
      expect(img.data.some((x) => x > 0)).toBe(true);
    }
  });
});
