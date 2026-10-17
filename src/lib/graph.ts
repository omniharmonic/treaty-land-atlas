// Build-time access to the graph (build/nodes.json, build/edges.json). Pages are generated
// from it; nothing here runs in the browser. Run `npm run data:build` before `astro build`.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { nationSlug as slugFor, routeFor } from './routes';

export interface Node {
  id: string;
  type: string;
  label: string;
  summary?: string | null;
  confidence?: string;
  verification_status?: string;
  flags?: string[];
  notes?: string | null;
  provenance?: { source_file?: string; source_row_id?: string | null; research_docs?: string[] };
  tribal_review?: {
    status: string;
    scope: string;
    date: string | null;
    reviewer_role: string | null;
  };
  publication?: { state: string; narrative_allowed: boolean };
  [key: string]: unknown;
}

export interface Edge {
  id: string;
  type: string;
  source: string;
  target: string;
  status: string;
  confidence: string;
  basis?: string | null;
  qualifiers?: Record<string, unknown>;
  review?: { successor_status?: string; reviewer_role?: string | null; date?: string | null };
}

const ROOT = process.cwd();
let cache: {
  nodes: Map<string, Node>;
  edges: Edge[];
  out: Map<string, Edge[]>;
  in: Map<string, Edge[]>;
} | null = null;

export function graph() {
  if (cache) return cache;
  const nodes = JSON.parse(readFileSync(join(ROOT, 'build', 'nodes.json'), 'utf8')).nodes as Node[];
  const edges = (
    JSON.parse(readFileSync(join(ROOT, 'build', 'edges.json'), 'utf8')).edges as Edge[]
  ).filter((e) => e.status !== 'rejected');
  const suppressed = suppressedIds();
  const map = new Map(nodes.filter((n) => !suppressed.has(n.id)).map((n) => [n.id, n]));
  const out = new Map<string, Edge[]>();
  const inc = new Map<string, Edge[]>();
  const kept = edges.filter((e) => map.has(e.source) && map.has(e.target));
  for (const e of kept) {
    (out.get(e.source) ?? out.set(e.source, []).get(e.source)!).push(e);
    (inc.get(e.target) ?? inc.set(e.target, []).get(e.target)!).push(e);
  }
  // Display labels: a spaced hyphen used as a dash in seed labels reads as a comma.
  for (const n of map.values()) n.label = n.label.replace(/ - /g, ', ');
  cache = { nodes: map, edges: kept, out, in: inc };
  return cache;
}

function suppressedIds(): Set<string> {
  try {
    const text = readFileSync(join(ROOT, 'data', 'suppress.yaml'), 'utf8');
    return new Set([...text.matchAll(/^\s*-\s*id:\s*(\S+)/gm)].map((m) => m[1]!));
  } catch {
    return new Set();
  }
}

export const byType = (type: string) => [...graph().nodes.values()].filter((n) => n.type === type);
export const node = (id: string) => graph().nodes.get(id);
export const outgoing = (id: string) => graph().out.get(id) ?? [];
export const incoming = (id: string) => graph().in.get(id) ?? [];

/* ---------- routes ---------- */

let nationIds: Set<string> | null = null;
const nations = () =>
  (nationIds ??= new Set(
    [...graph().nodes.values()].filter((n) => n.type === 'Nation').map((n) => n.id),
  ));

/** URL path (without base) for a node, or null when the type has no page. */
export function pathFor(n: Pick<Node, 'id' | 'type'>): string | null {
  return routeFor(n.id, n.type, nations());
}

export function nationSlug(id: string): string {
  return slugFor(id, nations());
}

/* ---------- words ---------- */

export const TYPE_NAME: Record<string, [string, string]> = {
  Instrument: ['Treaty or agreement', 'Treaties and agreements'],
  Nation: ['Nation', 'Nations'],
  GeoFeature: ['Royce cession', 'Royce cessions'],
  Violation: ['Violation', 'Violations'],
  Case: ['Court case', 'Court cases'],
  Statute: ['Statute', 'Statutes'],
  Doctrine: ['Doctrine', 'Doctrines'],
  Organization: ['Organization', 'Organizations'],
  Campaign: ['Land return', 'Land returns'],
  PolicyEra: ['Policy era', 'Policy eras'],
  Place: ['Place', 'Places'],
  Source: ['Source', 'Sources'],
};

/** How a relation reads from each end: [from source, from target]. */
const PHRASE: Record<string, [string, string]> = {
  party_to: ['Party to', 'Parties named'],
  violated_by: ['Broken or altered by', 'Concerns the instrument'],
  enabled_by: ['Carried out through', 'Used to carry out'],
  adjudicated_in: ['Taken to court in', 'Decided a dispute over'],
  concerns_instrument: ['Concerns the instrument', 'At issue in court'],
  involves_nation: ['Nations named', 'Named in'],
  enacted_during: ['Policy era', 'Enacted in this era'],
  occurred_during: ['Policy era', 'Happened in this era'],
  cedes: ['Land the US recorded as ceded', 'Recorded as ceded by'],
  reserves: ['Land reserved', 'Reserved by'],
  located_in: ['Located in', 'Contains'],
  depicts: ['The instrument this cession comes from', 'Royce cessions drawn from this instrument'],
  derived_from: ['Drawn from', 'Source of'],
  part_of: ['Part of', 'Includes'],
  successor_of: [
    'Carries the treaty history of',
    'Present-day governments that carry this history',
  ],
  governing_body_of: ['Governing body of', 'Governed by'],
  serves_nation: ['Works with', 'Organizations that work with this nation'],
  operates_in: ['Works in', 'Organizations working here'],
  supports_return_of: ['Supports the return of', 'Supported by'],
  remedies: ['Responds to', 'Land returns that respond to this'],
  applies_doctrine: ['Doctrine applied', 'Applied in'],
  establishes_doctrine: ['Established the doctrine', 'Established by'],
  applies_statute: ['Statute applied', 'Applied by'],
  limits: ['Limited', 'Limited by'],
  overrules_in_effect: ['Overruled in effect', 'Overruled in effect by'],
  responds_to: ['Responds to', 'Answered by'],
  cites: ['Cites', 'Cited by'],
  attributed_to_nation: [
    'Nations associated with this cession',
    'Royce cessions associated with this nation',
  ],
};

export function phrase(type: string, direction: 'out' | 'in'): string {
  const p = PHRASE[type];
  return p ? p[direction === 'out' ? 0 : 1] : type.replace(/_/g, ' ');
}

export const STATUS_WORD: Record<string, string> = {
  asserted_by_seed: 'from the record',
  proposed: 'suggested link, not yet reviewed',
  accepted: 'reviewed',
};

export const REVIEW_WORD: Record<string, string> = {
  not_yet_contacted: 'Not yet reviewed by this nation',
  invited: 'This nation has been invited to review',
  edits_requested: 'This nation has asked for changes; under revision',
  reviewed: 'Reviewed by this nation',
  co_authored: 'Written with this nation',
  declined: 'This nation declined to take part',
  withdrawn: 'Withdrawn at this nation’s request',
};

export function year(n: Node): number | null {
  const v = n['date_signed'] ?? n['year'] ?? n['year_start'] ?? n['start_year'] ?? n['t_first'];
  const m = /^(\d{4})/.exec(String(v ?? ''));
  return m ? Number(m[1]) : null;
}

/** Source nodes (with URL) attached to a node by evidenced_by. */
export function sourcesOf(id: string) {
  return outgoing(id)
    .filter((e) => e.type === 'evidenced_by')
    .map((e) => ({ edge: e, source: node(e.target)! }))
    .filter((s) => s.source);
}

/** Readable text for an inline-tagged string: keeps the words, marks the flags. */
export function cleanTags(text: unknown): { text: string; flags: string[] } {
  const s = String(text ?? '');
  const flags = new Set<string>();
  const out = s
    .replace(/\[([^\]]*)\]/g, (whole, inner: string) => {
      const m = /^(verified|from-memory|disputed|unverified)\b\s*[:;]?\s*(.*)$/i.exec(inner.trim());
      if (!m) return whole;
      flags.add(m[1]!.toLowerCase());
      const rest = m[2]!.replace(/^(from-memory|unverified|disputed|verified)\s*;?\s*/i, '').trim();
      return rest ? `(${rest})` : '';
    })
    .replace(/\s+([.,;:)])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { text: out, flags: [...flags] };
}
