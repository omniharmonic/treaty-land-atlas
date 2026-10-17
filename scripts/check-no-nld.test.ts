import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkNoNld } from './check-no-nld.mjs';

const nldFeatures = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { description: 'https://native-land.ca/maps/territories/x/' } },
  ],
});

describe('check-no-nld', () => {
  it('passes the repository and its build output', () => {
    expect(checkNoNld(process.cwd(), ['public/data'])).toEqual([]);
  });
  it('fails on NLD-named files and NLD features, not on code, credits or similar names', () => {
    const root = mkdtempSync(join(tmpdir(), 'nld-'));
    mkdirSync(join(root, 'dist', 'data'), { recursive: true });
    writeFileSync(join(root, 'dist', 'data', 'nld-territories.geojson'), '{}');
    writeFileSync(join(root, 'dist', 'data', 'cache.json'), nldFeatures);
    writeFileSync(
      join(root, 'dist', 'data', 'credits.json'),
      '{"attribution":"Native Land Digital (native-land.ca)"}',
    );
    writeFileSync(join(root, 'dist', 'data', 'org-native-land-conservancy.json'), '{}');
    writeFileSync(join(root, 'dist', 'app.js'), 'fetch("https://native-land.ca/api/index.php")');
    expect(checkNoNld(root, ['dist']).map((p) => p.split(':')[0])).toEqual([
      'dist/data/cache.json',
      'dist/data/nld-territories.geojson',
    ]);
  });
});
