import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  arcgisDate,
  buildEvents,
  DERIVED_DIR,
  KNOWN_MISSING,
  type CessionEvent,
} from '../src/geometry/index.ts';

const row = (over: Record<string, string | number | null>) => ({
  cessnum: '89',
  cessnumsort: 89,
  cessdate1: Date.UTC(1817, 8, 29, 12),
  date1link_royce_schedule: 'https://archive.org/x',
  date1link_kappler_treaty: null,
  link_federal_statute: null,
  link_executive_order: null,
  schdtrb: 'Chippewa; Delaware; Seneka',
  presdaytrb: 'Delaware Nation, Oklahoma; Seneca Nation of New York',
  state: 'MI',
  mapname1: 'Michigan 1',
  mapurl1: 'https://www.loc.gov/resource/g3701em.gct00002/?sp=29',
  ...over,
});

describe('buildEvents', () => {
  it('reads ArcGIS noon-UTC dates as calendar days', () => {
    expect(arcgisDate(Date.UTC(1784, 9, 22, 12))).toBe('1784-10-22');
  });
  it('derives legal type from link fields, Kappler first', () => {
    const [kappler] = buildEvents([
      row({ date1link_kappler_treaty: 'https://babel.hathitrust.org/x' }),
    ]).events;
    const [statute] = buildEvents([
      row({ link_federal_statute: 'https://www.loc.gov/s.pdf' }),
    ]).events;
    const [eo] = buildEvents([
      row({ link_executive_order: 'http://ops.libs.uga.edu/eo.pdf' }),
    ]).events;
    const [none] = buildEvents([row({})]).events;
    expect([kappler!.legal_type, statute!.legal_type, eo!.legal_type, none!.legal_type]).toEqual([
      'treaty_or_agreement',
      'statute',
      'executive_order',
      'unknown',
    ]);
  });
  it('splits tribe lists and keeps schedule spellings as written', () => {
    const [ev] = buildEvents([row({})]).events;
    expect(ev!.tribes_as_named_in_schedule).toEqual(['Chippewa', 'Delaware', 'Seneka']);
    expect(ev!.present_day_tribes_per_usfs).toHaveLength(2);
    expect(ev!.id).toBe('geo-royce-89');
  });
  it('skips rows with no cession number', () => {
    expect(buildEvents([row({ cessnum: null })]).skipped).toHaveLength(1);
  });
});

describe('V10 derived geometry', () => {
  const eventsFile = join(DERIVED_DIR, 'cession-events.json');
  const cessionsFile = join(DERIVED_DIR, 'cessions.json');
  it.skipIf(!existsSync(eventsFile))('the seven known-missing cessions are events-only', () => {
    const events: CessionEvent[] = JSON.parse(readFileSync(eventsFile, 'utf8'));
    const missing = events.filter((e) => e.geometry_quality === 'missing').map((e) => e.cessnum);
    expect(missing.sort()).toEqual([...KNOWN_MISSING].sort());
  });
  it.skipIf(!existsSync(cessionsFile))(
    'every feature has an id, a first date and coordinates inside US bounds',
    () => {
      const fc = JSON.parse(readFileSync(cessionsFile, 'utf8')) as {
        features: { properties: { id: string; t0: number }; geometry: { coordinates: unknown } }[];
      };
      expect(fc.features.length).toBe(717);
      const ids = new Set(fc.features.map((f) => f.properties.id));
      expect(ids.size).toBe(fc.features.length);
      for (const f of fc.features) {
        expect(f.properties.t0).toBeGreaterThanOrEqual(1784);
        const flat = JSON.stringify(f.geometry.coordinates)
          .match(/-?\d+(\.\d+)?/g)!
          .map(Number);
        for (let i = 0; i < flat.length; i += 2) {
          expect(flat[i]).toBeGreaterThan(-180);
          expect(flat[i]).toBeLessThan(-60);
          expect(flat[i + 1]).toBeGreaterThan(15);
          expect(flat[i + 1]).toBeLessThan(72);
        }
      }
    },
  );
});
