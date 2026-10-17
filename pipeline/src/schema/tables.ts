// Row schemas for every table in seed-data/ (J3 check V1).
// Schemas validate the raw CSV strings; they do not transform data. The graph stage
// (scripts/build_graph.py) owns the meaning of each field.
import { z } from 'zod';
import { ID_PATTERNS, isUrl, parsePartialDate, splitList } from '../normalize/index.ts';

const required = z.string().min(1, 'required');
const optional = z.string();

const partialDate = (opts: { optional?: boolean } = {}) =>
  z.string().refine((v) => (opts.optional && v === '') || parsePartialDate(v) !== null, {
    message: 'expected YYYY, YYYY-MM or YYYY-MM-DD',
  });

const year = z.string().regex(/^\d{4}$/, 'expected a four-digit year');
const optionalYear = z.string().regex(/^(\d{4})?$/, 'expected a four-digit year or blank');
const optionalNumber = z.string().regex(/^(\d+(\.\d+)?)?$/, 'expected a number or blank');

const id = (kind: keyof typeof ID_PATTERNS) =>
  z.string().regex(ID_PATTERNS[kind]!, `expected a ${kind} id`);

/** One URL, or blank. */
const url = z.string().refine((v) => v === '' || isUrl(v), { message: 'expected an http(s) URL' });

const oneOf = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values);

/** "; "-separated list where every item must be one of the given values. */
const listOf = (values: readonly string[]) =>
  z.string().refine((v) => splitList(v).every((item) => values.includes(item)), {
    message: `every item must be one of: ${values.join(', ')}`,
  });

export const CONFIDENCE_HML = ['high', 'medium', 'low'] as const;
export const CONFIDENCE_VERIFIED = ['verified', 'from-memory', 'unverified'] as const;

export const INSTRUMENT_TYPES = [
  'treaty',
  'treaty (unratified)',
  'treaty (international)',
  'statute',
  'agreement (statutory)',
  'executive order',
] as const;

export const TREATY_ERAS = [
  'colonial-context (pre-1778)',
  'confederation (1778-1788)',
  'early-republic (1789-1814)',
  'cession-and-pre-removal (1815-1829)',
  'removal (1830-1848)',
  'expansion-and-reservation (1849-1871)',
  'agreement-era (1871-1913)',
  'modern-statutory (1914-present)',
] as const;

export const REGIONS = [
  'Northeast',
  'Great Lakes / Old Northwest',
  'Southeast',
  'Plains',
  'Southwest',
  'Pacific Northwest',
  'Great Basin',
  'California',
  'Alaska',
  'Hawaii',
  'Multi-region',
] as const;

/** B1 controlled vocabulary (22 codes; ANNUITY_NONPAYMENT is an accepted alias). */
export const VIOLATION_CODES = [
  'ALLOTMENT',
  'ANNEXATION_CONTEXT',
  'ANNUITY_NONPAYMENT_OR_DIVERSION',
  'CONTEXT_FEDERAL_LAND_DISPOSAL',
  'CONTEXT_INFRASTRUCTURE_SITING',
  'CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK',
  'DIMINISHMENT_DISESTABLISHMENT',
  'EMINENT_DOMAIN_INFRASTRUCTURE',
  'FAILURE_TO_PROTECT',
  'FEDERAL_RESERVE_CARVE_OUT',
  'FORCED_REMOVAL',
  'FRAUD_COERCION_NEGOTIATION',
  'HUNTING_FISHING_RIGHTS',
  'JURISDICTIONAL_EROSION',
  'NON_RATIFICATION',
  'RESOURCE_RUSH_INVASION',
  'STATUTORY_EXTINGUISHMENT_SETTLEMENT',
  'TERMINATION',
  'TREATY_PROMISE_UNFULFILLED',
  'UNILATERAL_ABROGATION_STATUTE',
  'UNRECOGNIZED_TITLE',
  'WATER_RIGHTS',
] as const;
export const VIOLATION_CODE_ALIASES: Record<string, string> = {
  ANNUITY_NONPAYMENT: 'ANNUITY_NONPAYMENT_OR_DIVERSION',
};

export const CAMPAIGN_STATUSES = [
  'completed',
  'completed-pending-deed',
  'in-progress',
  'pending',
  'headline-only',
  'program-concluded',
  'program-ongoing',
  'blocked',
  'contested',
  'ongoing-claim',
] as const;

export const INDIGENOUS_LED = [
  'yes-verified',
  'yes-self-described',
  'tribal-government',
  'mixed',
  'no',
  'unverified',
  'state-agency',
  'federal-program',
] as const;

const LAND_EFFECT = ['advanced', 'eroded', 'mixed', 'procedural'] as const;

/** Legacy statute ids kept in treaties-seed; crosswalks/statute-merge.csv maps them to stat-* nodes. */
const LEGACY_STATUTE_ID = /^TLA-S-[A-Z0-9]+$/;

export const treatyRow = z.strictObject({
  id: z.string().refine((v) => ID_PATTERNS.instrument!.test(v) || LEGACY_STATUTE_ID.test(v), {
    message: 'expected an instrument id (TLA-T-..., TLA-U-..., TLA-X-..., TLA-A-...) or TLA-S-...',
  }),
  name: required,
  date_signed: partialDate(),
  date_ratified: partialDate({ optional: true }),
  ratified: oneOf(['yes', 'no', 'partial', 'n/a']),
  nations: required,
  region: oneOf(REGIONS),
  land_description: optional,
  acreage_ceded_if_known: optionalNumber,
  stat_cite: optional,
  kappler_cite: optional,
  era: oneOf(TREATY_ERAS),
  source_url: url,
  confidence: oneOf(CONFIDENCE_HML),
  instrument_type: oneOf(INSTRUMENT_TYPES),
  date_signed_basis: oneOf(['source-stated', 'from-memory']),
  date_ratified_basis: oneOf(['', 'senate-consent', 'proclaimed', 'source-stated', 'from-memory']),
  land_desc_basis: oneOf(['source', 'from-memory', 'mixed (see notes)']),
  nara_rit_no: optional,
  nara_naid: optional,
  notes: optional,
});

export const naraRow = z.strictObject({
  nara_rit_no: z.string().regex(/^\d+A?$/, 'expected a RIT number such as 19 or 19A'),
  date_signed: partialDate(),
  nations_and_place_per_nara: required,
  // Blank when NARA lists the treaty as unavailable (RIT 55); two ids separated by ";" when
  // NARA catalogs the treaty in two parts.
  nara_naid: z
    .string()
    .regex(/^(\d+(;\d+)*)?$/, 'expected a numeric NAID, ";"-separated, or blank'),
  source_url: url,
  in_treaties_seed: oneOf(['yes', 'no']),
});

export const caseRow = z.strictObject({
  id: id('case'),
  short_name: required,
  full_citation: required,
  court: required,
  year,
  nations: optional,
  treaty_at_issue: optional,
  holding_summary: required,
  land_rights_effect: oneOf(LAND_EFFECT),
  doctrines: optional,
  source_url: url,
  confidence: oneOf(CONFIDENCE_VERIFIED),
});

export const statuteRow = z.strictObject({
  id: id('statute'),
  name: required,
  year,
  citation: required,
  summary: required,
  effect_on_land_rights: oneOf(['advanced', 'eroded', 'mixed']),
  doctrines: optional,
  source_url: url,
  confidence: oneOf(CONFIDENCE_VERIFIED),
});

export const violationRow = z.strictObject({
  id: id('violation'),
  treaty_name: required,
  treaty_year: required,
  nations: required,
  violation_year: required,
  violation_type: listOf([...VIOLATION_CODES, ...Object.keys(VIOLATION_CODE_ALIASES)]),
  mechanism_summary: required,
  land_lost_description: optional,
  acreage_if_known: optional,
  legal_aftermath: optional,
  related_cases: optional,
  source_urls: required,
  confidence: oneOf(CONFIDENCE_HML),
});

export const violationNoteRow = z.strictObject({
  id: id('violation'),
  title: required,
  region: optional,
  verification_notes: required,
});

export const organizationRow = z.strictObject({
  id: id('organization'),
  name: required,
  org_type: required,
  indigenous_led: oneOf(INDIGENOUS_LED),
  nations_served: optional,
  region: optional,
  focus: optional,
  donation_url: url,
  ein_or_registry: optional,
  vetting_notes: optional,
  website: url,
  confidence: oneOf(CONFIDENCE_HML),
});

export const campaignRow = z.strictObject({
  id: id('campaign'),
  name: required,
  org_id: optional,
  nation: optional,
  location: optional,
  acres: optionalNumber,
  start_year: optionalYear,
  status: oneOf(CAMPAIGN_STATUSES),
  summary: required,
  source_url: url,
  confidence: oneOf(CONFIDENCE_HML),
});

export const tribeOrgRow = z.strictObject({
  nation: required,
  // NONE_VERIFIED records that no organization was vetted for this nation (the reason is in relationship).
  org_id: z
    .string()
    .regex(/^(org-[a-z0-9-]+|NONE_VERIFIED)$/, 'expected an organization id or NONE_VERIFIED'),
  relationship: required,
  region: optional,
});

export const policyEraRow = z.strictObject({
  id: id('era'),
  era_name: required,
  start_year: year,
  end_year: optionalYear,
  summary: required,
  key_acts: optional,
  land_effect: optional,
  sources: required,
  confidence: oneOf(['high', 'medium', 'medium-low', 'low']),
});

export const geodataSourceRow = z.strictObject({
  id: id('source'),
  source: required,
  publisher: required,
  content: optional,
  format: optional,
  license_or_terms: optional,
  url: required,
  update_status: optional,
  fit_for_timeslider: optional,
  notes: optional,
  confidence: oneOf(CONFIDENCE_HML),
});

export interface TableSpec {
  file: string;
  schema: z.ZodType<Record<string, string>>;
  /** Column that holds the row id, or null for link tables. */
  idColumn: string | null;
  /** Data rows expected as of 2026-10-16 (P1-02 acceptance). */
  expectedRows: number;
}

export const TABLES = {
  treaties: { file: 'treaties-seed.csv', schema: treatyRow, idColumn: 'id', expectedRows: 135 },
  nara: {
    file: 'nara-ratified-treaties-index.csv',
    schema: naraRow,
    idColumn: 'nara_rit_no',
    expectedRows: 376,
  },
  cases: { file: 'cases-seed.csv', schema: caseRow, idColumn: 'id', expectedRows: 104 },
  statutes: { file: 'statutes-seed.csv', schema: statuteRow, idColumn: 'id', expectedRows: 51 },
  violations: {
    file: 'violations-seed.csv',
    schema: violationRow,
    idColumn: 'id',
    expectedRows: 62,
  },
  violationNotes: {
    file: 'violations-seed-notes.csv',
    schema: violationNoteRow,
    idColumn: 'id',
    expectedRows: 62,
  },
  organizations: {
    file: 'organizations-seed.csv',
    schema: organizationRow,
    idColumn: 'id',
    expectedRows: 67,
  },
  campaigns: { file: 'campaigns-seed.csv', schema: campaignRow, idColumn: 'id', expectedRows: 42 },
  tribeOrgMap: { file: 'tribe-org-map.csv', schema: tribeOrgRow, idColumn: null, expectedRows: 86 },
  policyEras: {
    file: 'policy-eras-seed.csv',
    schema: policyEraRow,
    idColumn: 'id',
    expectedRows: 9,
  },
  geodataSources: {
    file: 'geodata-sources.csv',
    schema: geodataSourceRow,
    idColumn: 'id',
    expectedRows: 24,
  },
} satisfies Record<string, TableSpec>;

export type TableName = keyof typeof TABLES;
