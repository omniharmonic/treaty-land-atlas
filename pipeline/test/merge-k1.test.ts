// scripts/merge_k1.py: research proposals + findings + verification rounds -> crosswalks.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..', '..');
const csv = (rows: string[][]) =>
  rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
const read = (dir: string, f: string) =>
  parse(readFileSync(join(dir, f), 'utf8'), { columns: true }) as Record<string, string>[];

const FINDING_COLS = [
  'finding_id',
  'source_doc',
  'pdf_pages',
  'nations',
  'date',
  'place',
  'category',
  'secondary_categories',
  'instrument',
  'instrument_cite',
  'royce_areas',
  'summary',
  'verbatim_quote',
  'sources_cited_by_source',
  'federal_account_contrast',
  'map_implication',
  'evidence_level',
  'confidence',
  'notes',
  'verification_status',
];
const VERDICT_COLS = [
  'finding_id',
  'verification_status',
  'verified_against',
  'source_title',
  'source_cite',
  'source_location',
  'source_quote',
  'corrected_summary',
  'corrected_instrument_cite',
  'corrected_royce_areas',
  'notes',
];
const finding = (o: Partial<Record<string, string>>) =>
  FINDING_COLS.map((c) => o[c] ?? (c === 'source_doc' ? 'PSL TREC 2024, part A' : ''));
const verdict = (o: Partial<Record<string, string>>) => VERDICT_COLS.map((c) => o[c] ?? '');

let out = '';
let log = '';
beforeAll(() => {
  const base = mkdtempSync(join(tmpdir(), 'k1-'));
  const k1 = join(base, 'k1');
  out = join(base, 'out');
  mkdirSync(join(k1, 'verification'), { recursive: true });
  const events = join(base, 'events.json');
  writeFileSync(
    events,
    JSON.stringify(['1', '444', '447', '426', '477'].map((cessnum) => ({ cessnum }))),
  );
  writeFileSync(
    join(k1, 'beyond-federal-record-findings.csv'),
    csv([
      FINDING_COLS,
      finding({
        finding_id: 'F-HOST',
        category: 'HOSTAGE',
        royce_areas: '1',
        evidence_level: 'PRIMARY_QUOTED',
        summary: 'six hostages',
      }),
      finding({
        finding_id: 'F-FRAUD',
        category: 'BRIBERY_FRAUD_FORGERY',
        royce_areas: '426',
        evidence_level: 'ASSERTED',
        summary: 'forged marks',
      }),
      finding({
        finding_id: 'F-NO',
        category: 'SIGNATORY_ILLEGITIMATE',
        royce_areas: '426',
        evidence_level: 'SCHOLARLY_CITED',
        summary: 'never ratified',
      }),
      finding({
        finding_id: 'F-DISP',
        category: 'EXCLUDED_PARTY',
        royce_areas: '477',
        evidence_level: 'CONTESTED',
      }),
      finding({
        finding_id: 'F-ORAL',
        category: 'HOSTAGE',
        royce_areas: '447',
        evidence_level: 'ORAL_HISTORY',
      }),
      finding({
        finding_id: 'F-MAS',
        category: 'MASSACRE',
        royce_areas: '444;447',
        evidence_level: 'SCHOLARLY_CITED',
        place: 'Boa Ogoi; approx 42.10,-111.91 (APPROXIMATE)',
      }),
    ]),
  );
  writeFileSync(
    join(k1, 'royce-status-proposals.csv'),
    csv([
      [
        'royce_area',
        'current_role_or_status',
        'current_legal_type',
        'proposed_primary_status',
        'proposed_flags',
        'instrument',
        'basis',
        'finding_ids',
        'verification_status',
        'confidence',
      ],
      [
        '1',
        '',
        '',
        'ceded_by_ratified_treaty',
        'hostages; rights_reserved',
        'Fort Stanwix',
        'b1',
        'F-HOST',
        'confirmed',
        'high',
      ],
      ['444', '', '', 'recognized_not_ceded', '', 'Ruby Valley', 'b2', '', '', 'high'],
      [
        '426',
        '',
        '',
        'ceded_by_ratified_treaty',
        'signatory_defect',
        'Fort Wise',
        'b3',
        'F-NO',
        '',
        'medium',
      ],
      [
        '426-N (proposed split: north of the South Platte)',
        '',
        '',
        'contested',
        'excluded_party',
        '',
        'b4',
        '',
        '',
        'low',
      ],
    ]),
  );
  writeFileSync(
    join(k1, 'massacre-sites.csv'),
    csv([
      [
        'site_id',
        'name',
        'other_names',
        'category',
        'finding_ids',
        'date',
        'nations',
        'perpetrators',
        'deaths_range',
        'deaths_source',
        'link_kind',
        'linked_instrument',
        'royce_areas',
        'link_note',
        'lat',
        'lon',
        'show_quote',
        'status',
        'note',
      ],
      [
        'mas-br',
        'Bear River Massacre',
        'Boa Ogoi',
        'massacre',
        'F-MAS',
        '1863-01-29',
        'Northwestern Band',
        'Connor',
        '250-500',
        'x',
        'preceded',
        'Box Elder',
        '',
        '',
        '',
        '',
        '',
        'map',
        '',
      ],
      [
        'mas-x',
        'Excluded',
        '',
        'excluded',
        'F-MAS',
        '',
        '',
        '',
        '',
        '',
        'caused',
        '',
        '',
        '',
        '',
        '',
        '',
        'exclude',
        '',
      ],
    ]),
  );
  writeFileSync(
    join(k1, 'verification', 'round2-a.csv'),
    csv([
      VERDICT_COLS,
      verdict({
        finding_id: 'F-HOST',
        verification_status: 'confirmed',
        verified_against: 'primary',
        source_title: 'Treaty',
        source_cite: '7 Stat. 15',
        source_quote: 'Six hostages shall be delivered',
      }),
      verdict({
        finding_id: 'F-NO',
        verification_status: 'confirmed',
        verified_against: 'primary',
      }),
      verdict({
        finding_id: 'F-MAS',
        verification_status: 'partly',
        verified_against: 'primary',
        corrected_royce_areas:
          'none for Northwestern Shoshone (Box Elder); 444;447 are other nations',
        notes: 'the site is about 4 miles north (about 42.17,-111.88).',
      }),
    ]),
  );
  // a later round overrides an earlier one
  writeFileSync(
    join(k1, 'verification', 'round3-a.csv'),
    csv([
      VERDICT_COLS,
      verdict({
        finding_id: 'F-NO',
        verification_status: 'contradicted',
        verified_against: 'primary',
        corrected_summary: 'It was ratified.',
      }),
    ]),
  );
  log = execFileSync(
    'python3',
    [join(ROOT, 'scripts', 'merge_k1.py'), '--k1-dir', k1, '--out-dir', out, '--events', events],
    { encoding: 'utf8' },
  );
});

describe('merge_k1.py', () => {
  it('writes the four crosswalks with their columns', () => {
    expect(Object.keys(read(out, 'land-status.csv')[0]!)).toEqual([
      'royce_area',
      'parent_area',
      'sub_area_label',
      'land_status',
      'evidence',
      'evidence_display',
      'instrument',
      'basis',
      'finding_ids',
      'confidence',
      'research_verification',
      'lost_year',
      'revision_note',
    ]);
    expect(Object.keys(read(out, 'land-status-flags.csv')[0]!)).toEqual([
      'royce_area',
      'flag',
      'evidence',
      'evidence_display',
      'hatch',
      'finding_ids',
      'citation',
      'quote',
      'summary',
    ]);
    const site = read(out, 'massacre-sites.csv')[0]!;
    for (const k of [
      'id',
      'name',
      'date',
      'lat_general',
      'lon_general',
      'nations',
      'deaths_range',
      'perpetrators',
      'royce_areas',
      'link_kind',
      'citation',
      'evidence_display',
      'finding_ids',
    ])
      expect(site).toHaveProperty(k);
    expect(read(out, 'k1-findings.csv')).toHaveLength(6);
    expect(log).toContain('4 land statuses');
  });
  it('renames recognized_not_ceded and keeps sub-areas under their parent', () => {
    const rows = read(out, 'land-status.csv');
    expect(rows.find((r) => r.royce_area === '444')!.land_status).toBe('described_not_ceded');
    const sub = rows.find((r) => r.royce_area === '426-N')!;
    expect(sub).toMatchObject({ parent_area: '426', land_status: 'contested' });
    expect(sub.sub_area_label).toContain('South Platte');
  });
  it('labels evidence and hatches by it; contradicted claims are never flags', () => {
    const flags = read(out, 'land-status-flags.csv');
    const host = flags.find((r) => r.royce_area === '1' && r.flag === 'hostages')!;
    expect(host).toMatchObject({
      evidence: 'primary',
      evidence_display: 'Primary source',
      hatch: 'solid',
    });
    expect(host.quote).toBe('Six hostages shall be delivered');
    // a proposal flag with no finding of that kind stays "reported"
    expect(flags.find((r) => r.royce_area === '1' && r.flag === 'rights_reserved')!).toMatchObject({
      evidence: 'reported',
      hatch: 'dotted',
    });
    expect(flags.find((r) => r.flag === 'bribery_fraud')!).toMatchObject({
      evidence_display: 'Reported by PSL TREC 2024',
      hatch: 'dotted',
    });
    expect(
      flags.find((r) => r.flag === 'excluded_party' && r.royce_area === '477')!.evidence_display,
    ).toBe('Disputed');
    expect(flags.find((r) => r.royce_area === '447')!).toMatchObject({
      evidence: 'oral_history',
      evidence_display: 'Oral history (published with permission)',
      hatch: 'dotted',
    });
    // round 3 contradicted F-NO: its flag is dropped and the claim is listed as not supported
    expect(flags.some((r) => r.royce_area === '426' && r.flag === 'signatory_defect')).toBe(false);
    const no = read(out, 'k1-findings.csv').find((r) => r.finding_id === 'F-NO')!;
    expect(no).toMatchObject({ shown: 'no', round: '3', reason_not_supported: 'It was ratified.' });
  });
  it('generalizes massacre locations, applies verdict corrections and drops excluded sites', () => {
    const sites = read(out, 'massacre-sites.csv');
    expect(sites).toHaveLength(1);
    expect(sites[0]).toMatchObject({
      id: 'mas-br',
      lat_general: '42.2',
      lon_general: '-111.9',
      royce_areas: '',
      link_kind: 'preceded',
    });
    expect(sites[0]!.location_basis).toContain('verification round 2');
  });
});
