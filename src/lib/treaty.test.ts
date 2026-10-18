import { describe, expect, it } from 'vitest';
import { treatyExperience } from './treaty';
import type { Node, Edge } from './graph';
const treaty: Node = {
  id: 'TLA-T-TEST',
  type: 'Instrument',
  label: 'Test treaty',
  date_signed: '1868-04-29',
};
const node = (id: string, type: string, fields = {}): Node => ({ id, type, label: id, ...fields });
const edge = (source: string, target: string, type: string, fields = {}): Edge => ({
  id: `${source}-${target}-${type}`,
  source,
  target,
  type,
  status: 'proposed',
  confidence: 'medium',
  ...fields,
});

describe('treaty experience: preserve what the research actually establishes', () => {
  it('keeps contextual history distinct from a finding of breach and preserves a date range', () => {
    const v = node('V030', 'Violation', {
      year_start: 2016,
      year_end: 2026,
      year_text: '2016–2026',
      adjudicated_breach_label_allowed: false,
    });
    const result = treatyExperience(
      treaty,
      [treaty, v],
      [edge(treaty.id, v.id, 'violated_by', { qualifiers: { role: 'context' } })],
    );
    const event = result.events.find((e) => e.id === v.id)!;
    expect(event.context).toBe(true);
    expect(event.suggested).toBe(true);
    expect(event.date).toBe('2016–2026');
    expect(event.year).toBe(2016);
    expect(event.kind).toBe('Related history');
  });
  it('excludes rejected edges and does not invent dates or promises for sparse instruments', () => {
    const sparse = node('TLA-U-TEST', 'Instrument', { ratification_status: 'unratified' });
    const v = node('V001', 'Violation');
    const result = treatyExperience(
      sparse,
      [sparse, v],
      [edge(sparse.id, v.id, 'violated_by', { status: 'rejected' })],
    );
    expect(result.events).toHaveLength(1);
    expect(result.events[0]!.year).toBeNull();
    expect(result.events[0]!.date).toBe('Date not recorded');
    expect(result.geometryIds).toEqual([]);
    expect(result.events.some((e) => e.id === 'ratified')).toBe(false);
  });
  it('keeps successful defenses and warnings in the event details instead of declaring all entries breaches', () => {
    const v = node('V033', 'Violation', {
      year_text: '1882–2016',
      year_start: 1882,
      mechanism_summary: '[disputed] A boundary was not diminished.',
      adjudicated_breach_label_allowed: false,
      flags: ['text_has_disputed_tag'],
    });
    const result = treatyExperience(treaty, [treaty, v], [edge(treaty.id, v.id, 'violated_by')]);
    const event = result.events.find((e) => e.id === v.id)!;
    expect(event.kind).toBe('Related history');
    expect(event.context).toBe(true);
    expect(event.details.find((f) => f.label === 'What happened')?.flags).toContain('disputed');
  });
  it('does not assign treaty geometry to a later event without an explicit connection', () => {
    const geo = node('geo-royce-516', 'GeoFeature', { dates: [{ date: '1868-04-29' }] });
    const v = node('V024', 'Violation', { year_start: 1874 });
    const result = treatyExperience(
      treaty,
      [treaty, geo, v],
      [edge(geo.id, treaty.id, 'depicts'), edge(treaty.id, v.id, 'violated_by')],
    );
    expect(result.geometryIds).toEqual([geo.id]);
    expect(result.events.find((e) => e.id === v.id)!.geometryIds).toEqual([]);
    expect(result.events.find((e) => e.id === v.id)!.date).toBe('1874');
    expect(result.events.find((e) => e.id === geo.id)!.geometryIds).toEqual([geo.id]);
  });
  it('finds court decisions through a linked event and carries the suggested relationship', () => {
    const v = node('V024', 'Violation', { year_start: 1874 });
    const c = node('case-test', 'Case', { year: 1980 });
    const es = [
      edge(treaty.id, v.id, 'violated_by'),
      edge(v.id, c.id, 'adjudicated_in', { status: 'accepted' }),
    ];
    const result = treatyExperience(treaty, [treaty, v, c], es);
    expect(result.events.find((e) => e.id === c.id)).toMatchObject({
      kind: 'Court decision',
      year: 1980,
      suggested: true,
    });
  });
});
