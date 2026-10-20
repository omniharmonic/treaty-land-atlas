// What the record says happened to each Royce area (K1 land-status model, decision log 2026-10-20).
// One primary status per area, chosen by the precedence in landStatus(); defect flags are separate and
// never change the status. K1 research rows (crosswalks/land-status.csv, written by
// scripts/merge_k1.py) come first; every other area is classified from the federal record itself.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from '../ingest/csv.ts';
import { DATA_DIR } from '../paths.ts';
import type { How } from './story.ts';

export const LAND_STATUS = [
  'ceded_by_ratified_treaty',
  'ceded_by_agreement_with_consent_process',
  'taken_by_statute',
  'taken_by_executive_order',
  'taken_no_instrument',
  'unratified_treaty_area',
  'promised_reserved',
  'described_not_ceded',
  'contested',
] as const;
export type LandStatus = (typeof LAND_STATUS)[number];

export const FLAGS = [
  'duress_military',
  'duress_starvation',
  'hostages',
  'signatory_defect',
  'excluded_party',
  'intertribal_dispute',
  'bribery_fraud',
  'senate_amended_no_consent',
  'consent_threshold_not_met',
  'massacre_linked',
  'promise_broken',
  'icc_money_not_land',
  'judicially_found_taking',
  'trespass_before_cession',
  'rights_reserved',
  'payment_refused',
  'annuities_conditioned_on_assent',
] as const;
export type Flag = (typeof FLAGS)[number];

/** Statuses under which the land never left the nation within the record (ends 1894). */
export const NOT_LOST: ReadonlySet<LandStatus> = new Set([
  'promised_reserved',
  'described_not_ceded',
]);
/** Land lost with no cession on the record: never shown as ceded, in any view. */
export const NO_LAWFUL_CESSION: ReadonlySet<LandStatus> = new Set([
  'unratified_treaty_area',
  'taken_no_instrument',
]);

export interface StatusInput {
  /** a K1 research status for this area, if any */
  k1?: LandStatus | null;
  /** Royce's Schedule, per crosswalks/royce-entry-roles.csv */
  royceStatus: 'ceded' | 'taken' | 'kept' | 'unchecked';
  /** roles of the area's Schedule entries, in date order */
  roles: string[];
  /** how the ceding (or reserving) instrument worked; 'unknown' when there is none */
  how: How;
  /** the instrument is an agreement given effect by an Act of Congress */
  agreement: boolean;
}

/**
 * Primary land status, in this precedence (first match wins):
 * 1. K1 research row.
 * 2. Royce records the area as kept: under an unratified treaty -> unratified_treaty_area; only
 *    described, never reserved -> described_not_ceded; otherwise promised_reserved.
 * 3. Unratified instrument -> unratified_treaty_area.
 * 4. Executive order -> taken_by_executive_order.
 * 5. Act of Congress: an agreement it ratified -> ceded_by_agreement_with_consent_process; else taken_by_statute.
 * 6. No instrument and no legal type -> taken_no_instrument.
 * 7. Otherwise (a ratified treaty, including one under documented pressure or a removal treaty)
 *    -> ceded_by_ratified_treaty. Pressure is carried as flags and as `how`, never as the status.
 */
export function landStatus(i: StatusInput): { status: LandStatus; basis: string } {
  if (i.k1) return { status: i.k1, basis: 'K1 research (sources on the record)' };
  if (i.royceStatus === 'kept') {
    if (i.how === 'unratified')
      return {
        status: 'unratified_treaty_area',
        basis: 'set apart under a treaty the Senate never ratified',
      };
    if (i.roles.length && i.roles.every((r) => r === 'described_or_recognized'))
      return {
        status: 'described_not_ceded',
        basis: 'Royce records the territory as described, and no cession of it',
      };
    return {
      status: 'promised_reserved',
      basis: 'Royce records it as reserved for the nation and still held in 1894',
    };
  }
  if (i.how === 'unratified')
    return {
      status: 'unratified_treaty_area',
      basis: 'claimed under a treaty the Senate never ratified',
    };
  if (i.how === 'executive')
    return { status: 'taken_by_executive_order', basis: 'the instrument is an executive order' };
  if (i.how === 'congress')
    return i.agreement
      ? {
          status: 'ceded_by_agreement_with_consent_process',
          basis:
            'an agreement signed with the nation and ratified by Act of Congress; whether its own consent rule was met has not yet been checked',
        }
      : { status: 'taken_by_statute', basis: 'the instrument is an Act of Congress' };
  if (i.how === 'unknown')
    return {
      status: 'taken_no_instrument',
      basis: 'the record names no treaty, statute or order for this area',
    };
  return {
    status: 'ceded_by_ratified_treaty',
    basis: 'a ratified treaty records the cession; consent has not been assessed',
  };
}

export type Evidence = 'primary' | 'scholarly' | 'oral_history' | 'reported' | 'disputed';

export interface FlagRecord {
  flag: Flag;
  evidence: Evidence;
  evidence_display: string;
  hatch: 'solid' | 'dotted';
  finding_ids: string[];
  citation: string;
  quote: string;
  summary: string;
}

export interface SubArea {
  area: string;
  label: string;
  land_status: LandStatus;
  basis: string;
  evidence_display: string;
  flags: FlagRecord[];
}

export interface AreaK1 {
  land_status: LandStatus | null;
  instrument: string | null;
  basis: string | null;
  evidence: Evidence | null;
  /** year the research shows the land lost, where it corrects Royce's dates */
  lost_year: number | null;
  evidence_display: string | null;
  finding_ids: string[];
  flags: FlagRecord[];
  sub_areas: SubArea[];
  /** for a sub-area: its parent's Royce number and its own label */
  parent: string | null;
  label: string | null;
  massacres: string[];
  not_supported: { finding_id: string; summary: string; reason: string }[];
}

export interface MassacreSite {
  id: string;
  name: string;
  other_names: string[];
  category: string;
  date: string;
  lat: number | null;
  lon: number | null;
  nations: string;
  deaths_range: string;
  deaths_source: string;
  perpetrators: string;
  areas: string[];
  link_kind: 'preceded' | 'enforced' | 'followed' | 'none';
  linked_instrument: string;
  link_note: string;
  citation: string;
  quote: string;
  summary: string;
  evidence: Evidence;
  evidence_display: string;
  finding_ids: string[];
}

const list = (s: string | undefined) =>
  (s ?? '')
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean);

function rows(file: string): Record<string, string>[] {
  const path = join(DATA_DIR, '..', 'crosswalks', file);
  return existsSync(path) ? readCsv(path).rows.map((x) => x.record) : [];
}

/** K1 research per Royce area number (crosswalks written by scripts/merge_k1.py). */
export function loadK1(): { areas: Map<string, AreaK1>; massacres: MassacreSite[] } {
  const areas = new Map<string, AreaK1>();
  const get = (a: string) => {
    let x = areas.get(a);
    if (!x) {
      x = {
        land_status: null,
        instrument: null,
        basis: null,
        evidence: null,
        lost_year: null,
        evidence_display: null,
        finding_ids: [],
        flags: [],
        sub_areas: [],
        parent: null,
        label: null,
        massacres: [],
        not_supported: [],
      };
      areas.set(a, x);
    }
    return x;
  };
  const flagsBy = new Map<string, FlagRecord[]>();
  for (const r of rows('land-status-flags.csv')) {
    if (!(FLAGS as readonly string[]).includes(r['flag']!)) continue;
    const f: FlagRecord = {
      flag: r['flag'] as Flag,
      evidence: r['evidence'] as Evidence,
      evidence_display: r['evidence_display'] ?? '',
      hatch: r['hatch'] === 'solid' ? 'solid' : 'dotted',
      finding_ids: list(r['finding_ids']),
      citation: r['citation'] ?? '',
      quote: r['quote'] ?? '',
      summary: r['summary'] ?? '',
    };
    const key = r['royce_area']!;
    (flagsBy.get(key) ?? flagsBy.set(key, []).get(key)!).push(f);
  }
  for (const r of rows('land-status.csv')) {
    const status = r['land_status'] as LandStatus;
    if (!(LAND_STATUS as readonly string[]).includes(status)) continue;
    const a = get(r['royce_area']!);
    // a sub-area (426-N, 566-UP) is drawn as its own land area; its parent lists it as a part
    if (r['parent_area']) {
      a.parent = r['parent_area'];
      a.label = r['sub_area_label'] || null;
      get(r['parent_area']).sub_areas.push({
        area: r['royce_area']!,
        label: r['sub_area_label'] ?? '',
        land_status: status,
        basis: r['basis'] ?? '',
        evidence_display: r['evidence_display'] ?? '',
        flags: [],
      });
    }
    a.land_status = status;
    a.instrument = r['instrument'] || null;
    a.basis = r['basis'] || null;
    a.evidence = (r['evidence'] as Evidence) || null;
    a.evidence_display = r['evidence_display'] || null;
    a.finding_ids = list(r['finding_ids']);
    a.lost_year = /^\d{4}$/.test(r['lost_year'] ?? '') ? Number(r['lost_year']) : null;
  }
  for (const [area, fl] of flagsBy) get(area).flags = fl;
  for (const r of rows('k1-findings.csv'))
    if (r['shown'] === 'no')
      for (const area of list(r['royce_areas']))
        get(area).not_supported.push({
          finding_id: r['finding_id']!,
          summary: r['summary'] ?? '',
          reason: r['reason_not_supported'] ?? '',
        });
  const massacres: MassacreSite[] = rows('massacre-sites.csv').map((r) => ({
    id: r['id']!,
    name: r['name']!,
    other_names: list(r['other_names']),
    category: r['category'] ?? 'massacre',
    date: r['date'] ?? '',
    lat: r['lat_general'] ? Number(r['lat_general']) : null,
    lon: r['lon_general'] ? Number(r['lon_general']) : null,
    nations: r['nations'] ?? '',
    deaths_range: r['deaths_range'] ?? '',
    deaths_source: r['deaths_source'] ?? '',
    perpetrators: r['perpetrators'] ?? '',
    areas: list(r['royce_areas']),
    link_kind: (['preceded', 'enforced', 'followed'].includes(r['link_kind'] ?? '')
      ? r['link_kind']
      : 'none') as MassacreSite['link_kind'],
    linked_instrument: r['linked_instrument'] ?? '',
    link_note: r['link_note'] ?? '',
    citation: r['citation'] ?? '',
    quote: r['quote'] ?? '',
    summary: r['summary'] ?? '',
    evidence: (r['evidence'] as Evidence) ?? 'reported',
    evidence_display: r['evidence_display'] ?? '',
    finding_ids: list(r['finding_ids']),
  }));
  for (const m of massacres) for (const a of m.areas) get(a).massacres.push(m.id);
  return { areas, massacres };
}

/** Map hatch for an area's flags: 2 solid (primary or scholarly evidence), 1 dotted (reported only), 0 none. */
export function hatchLevel(flags: FlagRecord[]): 0 | 1 | 2 {
  if (flags.some((f) => f.hatch === 'solid')) return 2;
  return flags.length ? 1 : 0;
}
