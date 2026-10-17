// Link review (J5 P1-05): show proposed edges and record human decisions in
// crosswalks/edge-reviews.csv. Only humans accept or reject: this tool never decides on its own.
//
//   npm run links:review                         list the next 20 proposed links
//   npm run links:review -- --type=depicts       only one edge type
//   npm run links:review -- --report             counts by type, status and basis
//   npm run links:review -- --decide=e-abc123 --decision=accepted --role="legal reviewer" [--date=2026-10-20] [--notes="..."]
//   npm run links:review -- --interactive        step through links one at a time (a, r, s, q)
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { readCsv } from '../ingest/csv.ts';
import { CROSSWALK_DIR } from '../paths.ts';
import { readGraph, type Graph, type GraphEdge } from '../validate/graph.ts';

export const REVIEWS_FILE = join(CROSSWALK_DIR, 'edge-reviews.csv');
const HEADER = 'edge_id,decision,reviewer_role,date,notes\n';

export interface Review {
  edge_id: string;
  decision: 'accepted' | 'rejected';
  reviewer_role: string;
  date: string;
  notes: string;
}

export function readReviews(file = REVIEWS_FILE): Map<string, Review> {
  const out = new Map<string, Review>();
  if (!existsSync(file)) return out;
  for (const { record } of readCsv(file).rows)
    out.set(record['edge_id']!, record as unknown as Review);
  return out;
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** Record (or replace) one decision. The file stays sorted by edge id so diffs are small. */
export function writeReview(review: Review, file = REVIEWS_FILE) {
  if (!['accepted', 'rejected'].includes(review.decision))
    throw new Error('decision must be accepted or rejected');
  if (!review.reviewer_role.trim())
    throw new Error('reviewer role is required (an office or role, not a person)');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.date)) throw new Error('date must be YYYY-MM-DD');
  const all = readReviews(file);
  all.set(review.edge_id, review);
  const body = [...all.values()]
    .sort((a, b) => a.edge_id.localeCompare(b.edge_id))
    .map((r) =>
      [r.edge_id, r.decision, r.reviewer_role, r.date, r.notes ?? ''].map(csvCell).join(','),
    )
    .join('\n');
  writeFileSync(file, HEADER + (body ? body + '\n' : ''));
}

/** Proposed edges not yet decided, nation-touching links first (they matter most for review). */
export function pendingEdges(
  graph: Graph,
  reviews: Map<string, Review>,
  type?: string,
): GraphEdge[] {
  const nationFirst = (e: GraphEdge) =>
    e.source_type === 'Nation' || e.target_type === 'Nation' ? 0 : 1;
  return graph.edges
    .filter((e) => e.status === 'proposed' && !reviews.has(e.id) && (!type || e.type === type))
    .sort(
      (a, b) =>
        nationFirst(a) - nationFirst(b) || a.type.localeCompare(b.type) || a.id.localeCompare(b.id),
    );
}

function describe(graph: Graph, e: GraphEdge): string {
  const label = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id;
  const sources = graph.edges
    .filter((x) => x.type === 'evidenced_by' && (x.source === e.source || x.source === e.target))
    .slice(0, 3)
    .map((x) => graph.nodes.find((n) => n.id === x.target)?.['url'] ?? x.target);
  return [
    `${e.id}  ${e.type}  (${e.confidence})`,
    `  ${label(e.source)}  [${e.source}]`,
    `  -> ${label(e.target)}  [${e.target}]`,
    `  basis: ${e.basis ?? '(none)'}`,
    `  method: ${(e['derivation'] as { method?: string; rule?: string } | undefined)?.method ?? '?'}: ${
      (e['derivation'] as { rule?: string } | undefined)?.rule ?? ''
    }`,
    ...(sources.length ? [`  sources: ${sources.join(' | ')}`] : []),
  ].join('\n');
}

function report(graph: Graph, reviews: Map<string, Review>) {
  const counts = new Map<string, number>();
  for (const e of graph.edges) {
    const method = (e['derivation'] as { method?: string } | undefined)?.method ?? '?';
    const key = `${e.type}\t${e.status}\t${method}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  console.log('type\tstatus\tbasis\tcount');
  for (const [k, v] of [...counts.entries()].sort()) console.log(`${k}\t${v}`);
  const linked = (type: string, side: 'source' | 'target', nodeType: string) => {
    const ids = new Set(graph.edges.filter((e) => e.type === type).map((e) => e[side]));
    return graph.nodes.filter((n) => n.type === nodeType && !ids.has(n.id)).map((n) => n.id);
  };
  const noInstrumentV = graph.nodes
    .filter((n) => n.type === 'Violation')
    .filter((n) => !graph.edges.some((e) => e.type === 'violated_by' && e.target === n.id))
    .map((n) => n.id);
  const noInstrumentC = linked('concerns_instrument', 'source', 'Case');
  const noNation = graph.nodes
    .filter((n) => n.type === 'Instrument')
    .filter((n) => !graph.edges.some((e) => e.type === 'party_to' && e.target === n.id))
    .map((n) => n.id);
  console.log(
    `\nViolations with no instrument link (${noInstrumentV.length}): ${noInstrumentV.join(', ')}`,
  );
  console.log(
    `Cases with no instrument link (${noInstrumentC.length}): ${noInstrumentC.slice(0, 40).join(', ')}${noInstrumentC.length > 40 ? ', ...' : ''}`,
  );
  console.log(`Instruments with no nation edge (${noNation.length}): ${noNation.join(', ')}`);
  console.log(`\nDecisions recorded: ${reviews.size}`);
}

const today = () => new Date().toISOString().slice(0, 10);

export async function linksReview(args: string[]) {
  const flag = (name: string) =>
    args
      .find((a) => a.startsWith(`--${name}=`))
      ?.split('=')
      .slice(1)
      .join('=');
  const has = (name: string) => args.includes(`--${name}`);
  if (!existsSync(join(CROSSWALK_DIR, '..', 'build', 'nodes.json'))) {
    console.error('build/nodes.json is missing. Run `npm run graph:build` first.');
    process.exitCode = 1;
    return;
  }
  const graph = readGraph();
  const reviews = readReviews();

  if (has('report')) return report(graph, reviews);

  const decide = flag('decide');
  if (decide) {
    if (!graph.edges.some((e) => e.id === decide)) {
      console.error(`No edge ${decide} in build/edges.json.`);
      process.exitCode = 1;
      return;
    }
    writeReview({
      edge_id: decide,
      decision: (flag('decision') ?? '') as Review['decision'],
      reviewer_role: flag('role') ?? '',
      date: flag('date') ?? today(),
      notes: flag('notes') ?? '',
    });
    console.log(`Recorded ${flag('decision')} for ${decide}. Run npm run data:build to apply it.`);
    return;
  }

  const pending = pendingEdges(graph, reviews, flag('type'));
  if (has('interactive')) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const role = (
      await rl.question(
        'Your reviewer role (an office or role, e.g. "project owner", "legal reviewer"): ',
      )
    ).trim();
    for (const e of pending) {
      console.log('\n' + describe(graph, e));
      const a = (await rl.question('  [a]ccept, [r]eject, [s]kip, [q]uit: ')).trim().toLowerCase();
      if (a === 'q') break;
      if (a === 'a' || a === 'r') {
        const notes = (await rl.question('  notes (optional): ')).trim();
        writeReview({
          edge_id: e.id,
          decision: a === 'a' ? 'accepted' : 'rejected',
          reviewer_role: role,
          date: today(),
          notes,
        });
      }
    }
    rl.close();
    console.log('Saved to crosswalks/edge-reviews.csv. Run npm run data:build to apply.');
    return;
  }

  const limit = Number(flag('limit') ?? 20);
  console.log(
    `${pending.length} proposed link(s) waiting for review. Next ${Math.min(limit, pending.length)}:\n`,
  );
  for (const e of pending.slice(0, limit)) console.log(describe(graph, e) + '\n');
  console.log(
    'Record a decision: npm run links:review -- --decide=<edge id> --decision=accepted|rejected --role="<your role>"',
  );
}
