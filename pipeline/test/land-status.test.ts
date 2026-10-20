// Precedence of the K1 land status (pipeline/src/emit/landStatus.ts).
import { describe, expect, it } from 'vitest';
import {
  LAND_STATUS,
  hatchLevel,
  landStatus,
  type FlagRecord,
  type StatusInput,
} from '../src/emit/landStatus.ts';

const base: StatusInput = {
  royceStatus: 'ceded',
  roles: ['ceded'],
  how: 'treaty',
  agreement: false,
};
const st = (o: Partial<StatusInput>) => landStatus({ ...base, ...o }).status;

describe('landStatus precedence', () => {
  it('a K1 research row wins over everything', () => {
    expect(st({ k1: 'taken_by_statute', royceStatus: 'kept', how: 'unratified' })).toBe(
      'taken_by_statute',
    );
  });
  it('kept land: unratified, described only, or promised and still held', () => {
    expect(st({ royceStatus: 'kept', roles: ['reserved'], how: 'unratified' })).toBe(
      'unratified_treaty_area',
    );
    expect(st({ royceStatus: 'kept', roles: ['described_or_recognized'] })).toBe(
      'described_not_ceded',
    );
    expect(st({ royceStatus: 'kept', roles: ['described_or_recognized', 'reserved'] })).toBe(
      'promised_reserved',
    );
  });
  it('then unratified, executive order, statute or agreement, no instrument', () => {
    expect(st({ how: 'unratified' })).toBe('unratified_treaty_area');
    expect(st({ how: 'executive' })).toBe('taken_by_executive_order');
    expect(st({ how: 'congress' })).toBe('taken_by_statute');
    expect(st({ how: 'congress', agreement: true })).toBe(
      'ceded_by_agreement_with_consent_process',
    );
    expect(st({ how: 'unknown', royceStatus: 'unchecked', roles: [] })).toBe('taken_no_instrument');
  });
  it('pressure and removal never change the status (they are flags and history)', () => {
    for (const how of ['treaty', 'pressure', 'removal'] as const)
      expect(st({ how })).toBe('ceded_by_ratified_treaty');
  });
  it('always returns one of the nine statuses, with a basis', () => {
    const r = landStatus(base);
    expect(LAND_STATUS).toContain(r.status);
    expect(r.basis.length).toBeGreaterThan(10);
  });
  it('hatch follows the best evidence', () => {
    const f = (hatch: 'solid' | 'dotted') =>
      ({
        flag: 'hostages',
        evidence: 'primary',
        evidence_display: '',
        hatch,
        finding_ids: [],
        citation: '',
        quote: '',
        summary: '',
      }) satisfies FlagRecord as FlagRecord;
    expect(hatchLevel([])).toBe(0);
    expect(hatchLevel([f('dotted')])).toBe(1);
    expect(hatchLevel([f('dotted'), f('solid')])).toBe(2);
  });
});
