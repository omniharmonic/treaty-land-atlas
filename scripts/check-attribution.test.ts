import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkAttribution } from './check-attribution.mjs';

function fixture(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'attr-'));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
}

const layout = '<footer>Created by Benjamin Life (@omniharmonic).</footer>';

describe('check-attribution', () => {
  it('passes the real repository', () => {
    expect(checkAttribution(process.cwd())).toEqual([]);
  });

  it('fails when the forbidden name is inserted into a page', () => {
    const name = ['Open', 'Civics'].join('');
    const root = fixture({
      'src/layouts/Base.astro': layout,
      'src/pages/index.astro': `<p>A ${name} Labs project</p>`,
    });
    expect(checkAttribution(root)).toHaveLength(1);
  });

  it('fails when the credit line is removed', () => {
    const root = fixture({ 'src/layouts/Base.astro': '<footer></footer>' });
    expect(checkAttribution(root)[0]).toMatch(/missing credit line/);
  });
});
