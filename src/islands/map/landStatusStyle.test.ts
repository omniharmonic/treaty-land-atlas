import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FLAGS, LAND_STATUS } from '../../../pipeline/src/emit/landStatus';
import {
  FLAG_LABEL,
  STATUS_DASH,
  STATUS_HELP,
  STATUS_LABEL,
  STATUS_ORDER,
  hatchImage,
} from './landStatusStyle';

describe('land status encoding', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'styles', 'global.css'), 'utf8');
  it('matches the pipeline vocabulary', () => {
    expect([...STATUS_ORDER]).toEqual([...LAND_STATUS]);
    for (const f of FLAGS) expect(FLAG_LABEL[f]).toBeTruthy();
  });
  it('gives every status a label, help text, line pattern and color token', () => {
    for (const s of STATUS_ORDER) {
      expect(STATUS_LABEL[s]).toBeTruthy();
      expect(STATUS_HELP[s]).toBeTruthy();
      expect(STATUS_DASH[s].length).toBeGreaterThan(0);
      expect(css).toMatch(new RegExp(`--ls-${s}:\\s*#[0-9a-f]{6}`));
    }
  });
  it('uses "ceded" only as "recorded as ceded"', () => {
    for (const s of STATUS_ORDER)
      expect(STATUS_LABEL[s].replace(/recorded as ceded|never ceded/gi, '')).not.toMatch(/ceded/i);
  });
  it('builds hatch images of the right size', () => {
    const img = hatchImage('solid', '#302f28');
    expect(img.data.length).toBe(img.width * img.height * 4);
    expect(img.data.some((x) => x > 0)).toBe(true);
  });
});
