// The key facts shown at the top of each record page, per node type. Values come straight from
// the graph; inline confidence tags are turned into visible marks, never dropped.
import { cleanTags, type Node } from './graph';

export interface Fact {
  label: string;
  value: string;
  flags?: string[];
  href?: string;
}

const f = (label: string, raw: unknown, extra: Partial<Fact> = {}): Fact | null => {
  if (raw === null || raw === undefined || raw === '' || (Array.isArray(raw) && !raw.length))
    return null;
  const { text, flags } = cleanTags(Array.isArray(raw) ? raw.join('; ') : raw);
  return text ? { label, value: text, flags, ...extra } : null;
};

const CAMPAIGN_STATUS: Record<string, string> = {
  completed: 'Returned',
  'completed-pending-deed': 'Returned; deed pending',
  'in-progress': 'In progress',
  pending: 'Pending',
  blocked: 'Blocked',
  contested: 'Contested',
  'ongoing-claim': 'Claim ongoing',
  'program-ongoing': 'Ongoing program',
  'program-concluded': 'Program ended',
  'headline-only': 'Reported; details thin',
};

const RATIFIED: Record<string, string> = {
  ratified: 'Ratified',
  unratified: 'Not ratified',
  partial: 'Partly ratified',
  not_applicable: 'Not applicable',
};
const INSTRUMENT_TYPE: Record<string, string> = {
  ratified_treaty: 'Ratified treaty',
  unratified_treaty: 'Unratified treaty',
  international_treaty: 'International treaty',
  agreement_statutory: 'Agreement ratified by statute',
  executive_order: 'Executive order',
  colonial_instrument: 'Colonial-era instrument',
  document_set: 'Set of documents',
};
const RECOGNITION: Record<string, string> = {
  listed_federal_register_2026:
    'Listed by the Bureau of Indian Affairs (91 FR 4102, January 30, 2026)',
  per_seed_tribal_government: 'Tribal government (per our research)',
  per_seed_not_federally_recognized: 'Not on the federal list',
  state_recognized: 'Recognized by a state',
  not_federally_recognized: 'Not on the federal list',
  terminated_not_restored: 'Federal relationship terminated and not restored',
  petitioning_federal_acknowledgment: 'Petitioning for federal acknowledgment',
  state_recognition_withdrawn: 'State recognition withdrawn',
  not_applicable: 'Not applicable',
  unknown: 'Not recorded',
};
const LEGAL_TYPE: Record<string, string> = {
  treaty_or_agreement: 'Treaty or agreement',
  statute: 'Act of Congress',
  executive_order: 'Executive order',
  unknown: 'Not stated in the source',
};

export function factsFor(n: Node): Fact[] {
  const nara = n['nara'] as { rit?: string; naid?: string } | null | undefined;
  switch (n.type) {
    case 'Instrument':
      return [
        f('Kind', INSTRUMENT_TYPE[String(n['instrument_type'])] ?? n['instrument_type']),
        f('Signed', n['date_signed']),
        f('Ratified', n['date_ratified']),
        f('Status', RATIFIED[String(n['ratification_status'])] ?? n['ratification_status']),
        f('Parties as named', n['parties_text']),
        f('Land described', n['land_description']),
        f('Acres ceded', n['acreage_ceded']),
        f('Statutes at Large', n['stat_cite']),
        f('Kappler', n['kappler_cite']),
        f('National Archives', nara?.rit ? `Ratified Indian Treaty ${nara.rit}` : null, {
          href: nara?.naid
            ? `https://catalog.archives.gov/id/${nara.naid.split(';')[0]}`
            : undefined,
        }),
        f('Region', n['region']),
      ].filter(Boolean) as Fact[];
    case 'Nation':
      return [
        f('Official name', n['official_name']),
        ['unknown', 'not_applicable'].includes(String(n['federal_recognition']))
          ? null
          : f(
              'Recorded status',
              RECOGNITION[String(n['federal_recognition'])] ?? n['federal_recognition'],
            ),
        f('Part of', n['component_of']),
        f('Website', n['website'], {
          href: typeof n['website'] === 'string' ? (n['website'] as string) : undefined,
        }),
        f('Region', n['region']),
      ].filter(Boolean) as Fact[];
    case 'GeoFeature':
      return [
        f('Area number in the 1899 record', n['royce_cession_number']),
        f(
          'Dates in the 1899 record',
          ((n['dates'] as { date: string }[]) ?? []).map((d) => d.date),
        ),
        f('Kind of instrument', LEGAL_TYPE[String(n['legal_type'])]),
        f('Peoples as named in the 1899 record', n['tribes_as_named_in_schedule']),
        f('States', n['states']),
        f('Counties', n['counties']),
        f(
          'Map sheets in the 1899 record',
          ((n['maps'] as { name: string }[]) ?? []).map((m) => m.name),
        ),
        f(
          'Geometry',
          n['geometry_quality'] === 'missing'
            ? 'No shape in the Forest Service layer'
            : 'Approximate shape from Royce’s 1899 maps',
        ),
      ].filter(Boolean) as Fact[];
    case 'Violation':
      return [
        f('Treaty', n['treaty_name_text']),
        f('Nations', n['nations_text']),
        f('When', n['year_text']),
        f('What happened', n['mechanism_summary']),
        f('Land affected', n['land_lost_description']),
        f('Acreage', n['acreage_text']),
        f('Legal aftermath', n['legal_aftermath']),
      ].filter(Boolean) as Fact[];
    case 'Case':
      return [
        f('Citation', n['full_citation']),
        f('Court', n['court']),
        f('Year', n['year']),
        f('Nations', n['nations_text']),
        f('Treaty at issue', n['treaty_at_issue_text']),
        f('Holding', n['holding_summary']),
        f('Effect on land rights', n['land_rights_effect']),
      ].filter(Boolean) as Fact[];
    case 'Statute':
      return [
        f('Citation', n['citation']),
        f('Year', n['year']),
        f('Effect on land rights', n['effect_on_land_rights']),
      ].filter(Boolean) as Fact[];
    case 'Organization':
      return [
        f('Kind', n['org_type']),
        f('Native-led', n['indigenous_led']),
        f('Works with', n['nations_served_text']),
        f('Region', n['region_text']),
        f('Focus', n['focus']),
        f('Registry', n['ein_or_registry']),
        f('Vetting notes', n['vetting_notes']),
      ].filter(Boolean) as Fact[];
    case 'Campaign':
      return [
        f('Nation', n['nation_text']),
        f('Where', n['location_text']),
        f(
          'Acres',
          typeof n['acres'] === 'number'
            ? Math.round(n['acres']).toLocaleString('en-US')
            : n['acres'],
        ),
        f('Began', n['start_year']),
        f(
          'Status',
          CAMPAIGN_STATUS[String(n['campaign_status'])] ??
            String(n['campaign_status'] ?? '').replace(/-/g, ' '),
        ),
      ].filter(Boolean) as Fact[];
    case 'PolicyEra':
      return [
        f('Years', `${n['start_year']}${n['end_year'] ? `–${n['end_year']}` : '–present'}`),
        f('Key acts', n['key_acts_text']),
        f('Effect on land', n['land_effect_text']),
      ].filter(Boolean) as Fact[];
    case 'Doctrine':
      return [f('Definition', n['definition'])].filter(Boolean) as Fact[];
    default:
      return [];
  }
}

export const STATUS_WORD = RECOGNITION;

export const CONFIDENCE_WORD: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
