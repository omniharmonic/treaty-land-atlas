#!/usr/bin/env node
// Derive the atlas basemap from OpenFreeMap's Positron style: land, water, rivers, woodland,
// state lines and a few place names; no roads, rail, buildings or shields. Muted lichen tones so
// the historical record and today's boundaries carry the color. Run: node scripts/build-map-style.mjs
import { writeFileSync } from 'node:fs';

const SRC = 'https://tiles.openfreemap.org/styles/positron';
const KEEP = new Set([
  'background',
  'park',
  'water',
  'landcover_wood',
  'waterway',
  'boundary_3',
  'boundary_2',
  'water_name_point_label',
  'water_name_line_label',
  'label_state',
  'label_city',
  'label_city_capital',
  'label_country_1',
  'label_country_2',
  'label_country_3',
]);
const THEMES = {
  light: {
    background: '#E7EBE1',
    park: '#DFE5D6',
    wood: '#DAE2D0',
    water: '#C7D3D2',
    waterway: '#B4C4C4',
    boundary: '#A3AE9C',
    label: '#56645A',
    water_label: '#557079',
    halo: '#E7EBE1',
  },
  dark: {
    background: '#18211B',
    park: '#1C271F',
    wood: '#1E2A21',
    water: '#22323A',
    waterway: '#2B3F47',
    boundary: '#46564A',
    label: '#A9B7AA',
    water_label: '#8FA9B2',
    halo: '#18211B',
  },
};

const base = await (await fetch(SRC)).json();
for (const [name, t] of Object.entries(THEMES)) {
  const style = structuredClone(base);
  style.name = `Treaty Land Atlas basemap (${name})`;
  delete style.sources.ne2_shaded;
  // Global state read by the atlas layers (year slider, window, honored-through cut, layer toggles).
  style.state = {
    year: { default: 1868 },
    win: { default: 999 },
    cut: { default: 1851 },
    honored: { default: false },
    cessions: { default: true },
    today: { default: false },
  };
  style.layers = style.layers
    .filter((l) => KEEP.has(l.id))
    .map((l) => {
      const p = (l.paint ??= {});
      if (l.id === 'background') p['background-color'] = t.background;
      if (l.id === 'park') p['fill-color'] = t.park;
      if (l.id === 'landcover_wood') p['fill-color'] = t.wood;
      if (l.id === 'water') p['fill-color'] = t.water;
      if (l.id === 'waterway') p['line-color'] = t.waterway;
      if (l.id.startsWith('boundary')) p['line-color'] = t.boundary;
      if (l.type === 'symbol') {
        p['text-color'] = l.id.startsWith('water') ? t.water_label : t.label;
        p['text-halo-color'] = t.halo;
        p['text-halo-width'] = 1.2;
        p['text-halo-blur'] = 0.4;
      }
      return l;
    });
  writeFileSync(`public/map/style-atlas-${name}.json`, JSON.stringify(style) + '\n');
  console.log(`public/map/style-atlas-${name}.json: ${style.layers.length} layers`);
}
