#!/usr/bin/env node
// Entry point for every `npm run data:*` command. Run: tsx pipeline/src/cli.ts <command> [--flags]
import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadAllTables } from './ingest/csv.ts';
import { writeKnownIssues, type Finding } from './report/known-issues.ts';
import { readGraph, validateGraph } from './validate/graph.ts';
import {
  checkCitations,
  checkEncoding,
  checkLinks,
  checkReviewLedger,
  checkSensitivity,
  confidenceCounts,
  publishability,
} from './validate/rules.ts';
import { loadOverlays } from './overlays/index.ts';
import { loadSuppressions } from './overlays/suppress.ts';
import {
  checkLicenses,
  gateTable,
  loadRegistry,
  renderGateTable,
  writeNotice,
} from './licenses/index.ts';
import { emit } from './emit/index.ts';
import { BUILD_DIR, CROSSWALK_DIR, PUBLIC_DATA_DIR, ROOT } from './paths.ts';
import { linksReview } from './link/review.ts';
import { fetchCommand, restoreCommand } from './fetch/index.ts';
import { geometryCommand } from './geometry/index.ts';

const [command, ...args] = process.argv.slice(2);
const flag = (name: string, fallback?: string) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  return hit.includes('=') ? hit.split('=').slice(1).join('=') : 'true';
};

function dataVersion(): string {
  const epoch = process.env.SOURCE_DATE_EPOCH;
  let sha = 'nogit';
  try {
    sha = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    /* not a git checkout */
  }
  const date = epoch
    ? new Date(Number(epoch) * 1000).toISOString().slice(0, 10)
    : readGraph().nodesDoc.generated;
  return `${date}+${sha}`;
}

const DERIVED = join(ROOT, 'data', 'derived');

/** Derived geometry and event files that the emit publishes under layers/. */
function derivedLayers(): Record<string, string> {
  if (!existsSync(DERIVED)) return {};
  return Object.fromEntries(
    readdirSync(DERIVED)
      .filter((f) => ['cessions.json', 'cession-events.json', 'today-aiannh.json'].includes(f))
      .sort()
      .map((f) => [f.replace(/\.json$/, ''), join(DERIVED, f)]),
  );
}

function layerIds(): string[] {
  return Object.keys(derivedLayers()).map((n) => `layers/${n}`);
}

async function ingest() {
  const tables = loadAllTables();
  let errorCount = 0;
  console.log('Table'.padEnd(16), 'Rows'.padStart(5), 'Expected'.padStart(9), 'Errors'.padStart(7));
  for (const t of tables) {
    const ok = t.rows.length === t.spec.expectedRows ? '' : '  <- count changed';
    console.log(
      t.name.padEnd(16),
      String(t.rows.length).padStart(5),
      String(t.spec.expectedRows).padStart(9),
      String(t.errors.length).padStart(7),
      ok,
    );
    errorCount += t.errors.length;
  }
  for (const t of tables)
    for (const e of t.errors)
      console.log(`  ${e.file}:${e.line} ${e.rowId ?? ''} [${e.column}] ${e.message}`);
  writeKnownIssues(
    'ingest',
    tables
      .flatMap((t) => t.errors)
      .map((e) => ({
        level: 'error' as const,
        where: `${e.file}:${e.line}${e.rowId ? ` (${e.rowId})` : ''}`,
        message: `${e.column}: ${e.message}`,
      })),
  );
  if (errorCount) {
    console.error(`\n${errorCount} row error(s). Fix the CSV rows listed above.`);
    process.exitCode = 1;
  } else console.log('\nAll tables parsed with no row errors.');
}

function runEmit(outDir = PUBLIC_DATA_DIR) {
  const graph = readGraph();
  const suppressed = new Set(loadSuppressions().map((s) => s.id));
  const { overlays } = loadOverlays();
  const reg = loadRegistry();
  return emit(graph, {
    outDir,
    suppressed,
    overlays,
    dataVersion: dataVersion(),
    layers: derivedLayers(),
    licenses: reg.sources
      .filter((s) => s.status !== 'not_used')
      .map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        attribution_text: s.attribution_text,
      })),
  });
}

async function emitCommand() {
  if (!existsSync(join(BUILD_DIR, 'nodes.json'))) {
    console.error('build/nodes.json is missing. Run `npm run graph:build` first.');
    process.exitCode = 1;
    return;
  }
  const r = runEmit();
  console.log(
    `Wrote public/data/: ${r.counts.nodes} nodes, ${r.counts.edges} edges, ${Object.keys(r.files).length} files` +
      (r.counts.suppressed ? `, ${r.counts.suppressed} suppressed` : ''),
  );
}

/** V12: two emits of the same graph are byte-identical. */
function checkDeterminism(): Finding[] {
  const a = mkdtempSync(join(tmpdir(), 'tla-emit-a-'));
  const b = mkdtempSync(join(tmpdir(), 'tla-emit-b-'));
  try {
    const ra = runEmit(a);
    const rb = runEmit(b);
    const diffs = Object.keys(ra.files).filter((k) => ra.files[k]!.sha256 !== rb.files[k]?.sha256);
    const ma = readFileSync(join(a, 'manifest.json'), 'utf8');
    const mb = readFileSync(join(b, 'manifest.json'), 'utf8');
    if (ma !== mb) diffs.push('manifest.json');
    return diffs.map((d) => ({
      level: 'error',
      where: d,
      message: 'two emits differ (non-deterministic output)',
    }));
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
}

const GZIP_BUDGET_GRAPH_LITE = 400 * 1024;

function checkSizes(): Finding[] {
  const out: Finding[] = [];
  const lite = join(PUBLIC_DATA_DIR, 'graph-lite.json');
  if (existsSync(lite)) {
    const gz = Number(execSync(`gzip -9c "${lite}" | wc -c`).toString().trim());
    out.push({
      level: gz > GZIP_BUDGET_GRAPH_LITE ? 'error' : 'info',
      where: 'graph-lite.json',
      message: `${(gz / 1024).toFixed(1)} KB gzip (budget ${GZIP_BUDGET_GRAPH_LITE / 1024} KB)`,
    });
  }
  return out;
}

async function validate() {
  const mode = (flag('mode', 'preview') as 'preview' | 'production') ?? 'preview';
  const sections: { title: string; findings: Finding[] }[] = [];

  const tables = loadAllTables();
  sections.push({
    title: 'V1 Seed tables',
    findings: tables.flatMap((t) =>
      t.errors.map((e) => ({
        level: 'error' as const,
        where: `${e.file}:${e.line}${e.rowId ? ` (${e.rowId})` : ''}`,
        message: `${e.column}: ${e.message}`,
      })),
    ),
  });

  if (!existsSync(join(BUILD_DIR, 'nodes.json'))) {
    console.error('build/nodes.json is missing. Run `npm run graph:build` first.');
    process.exitCode = 1;
    return;
  }
  const graph = readGraph();
  const suppressions = loadSuppressions();
  const suppressed = new Set(suppressions.map((s) => s.id));
  const { findings: overlayFindings, overlays } = loadOverlays();
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  for (const id of overlays.keys())
    if (!nodeIds.has(id))
      overlayFindings.push({
        level: 'error',
        where: id,
        message: 'overlay for a node that does not exist',
      });
  for (const s of suppressions)
    if (!nodeIds.has(s.id))
      overlayFindings.push({
        level: 'warn',
        where: s.id,
        message: 'suppressed id is not in the graph',
      });

  const unresolved = JSON.parse(readFileSync(join(BUILD_DIR, 'unresolved.json'), 'utf8')) as {
    issues: { level: string; kind: string; where: string; ref: string; message: string }[];
  };

  sections.push({ title: 'V2-V3 Graph schema and references', findings: validateGraph(graph) });
  sections.push({
    title: 'Graph builder issues (build/unresolved.json)',
    findings: unresolved.issues.map((i) => ({
      level: (i.level === 'error'
        ? 'error'
        : i.level === 'warn'
          ? 'warn'
          : 'info') as Finding['level'],
      where: `${i.where} ${i.ref}`,
      message: `${i.kind}: ${i.message}`,
    })),
  });
  sections.push({ title: 'V4 Encoding', findings: checkEncoding(graph) });
  sections.push({ title: 'V5 Citations', findings: checkCitations(graph) });
  sections.push({ title: 'V7 Links', findings: checkLinks(graph) });
  sections.push({ title: 'V8 Publishability', findings: publishability(graph, suppressed) });
  sections.push({
    title: 'V9 Licenses',
    findings: checkLicenses(loadRegistry(), mode, layerIds()),
  });
  sections.push({ title: 'V12 Determinism', findings: checkDeterminism() });
  sections.push({ title: 'V11 Size budgets', findings: checkSizes() });
  sections.push({ title: 'V13 Sensitivity', findings: checkSensitivity(graph) });
  sections.push({
    title: 'V14 Review ledger',
    findings: checkReviewLedger(graph, join(CROSSWALK_DIR, 'tribal-review-ledger.csv')),
  });
  sections.push({ title: 'Overlays and suppressions', findings: overlayFindings });

  const all = sections.flatMap((s) => s.findings);
  const count = (lvl: Finding['level']) => all.filter((f) => f.level === lvl).length;
  const conf = confidenceCounts(graph);
  const report = [
    '# Data validation report',
    '',
    `Mode: **${mode}**. Data version: ${dataVersion()}. Generated by \`npm run data:validate\`; do not edit by hand.`,
    '',
    `**${count('error')} errors, ${count('warn')} warnings, ${count('info')} notes.**`,
    '',
    `Graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges. Edge status: ${Object.entries(
      graph.edges.reduce<Record<string, number>>(
        (m, e) => ((m[e.status] = (m[e.status] ?? 0) + 1), m),
        {},
      ),
    )
      .map(([k, v]) => `${k} ${v}`)
      .join(', ')}.`,
    '',
    '## V6 Confidence flags (each shows a badge on the site)',
    '',
    '| Node type | Flag | Count |',
    '|---|---|---|',
    ...Object.entries(conf).flatMap(([t, m]) =>
      Object.entries(m).map(([f, c]) => `| ${t} | ${f} | ${c} |`),
    ),
    '',
    '## License gates',
    '',
    renderGateTable(gateTable(loadRegistry())),
    '',
    ...sections.flatMap((s) => {
      const e = s.findings.filter((f) => f.level === 'error').length;
      const w = s.findings.filter((f) => f.level === 'warn').length;
      return [
        `## ${s.title}: ${e} error(s), ${w} warning(s), ${s.findings.length - e - w} note(s)`,
        '',
        ...(s.findings.length
          ? s.findings.slice(0, 200).map((f) => `- **${f.level}** \`${f.where}\`: ${f.message}`)
          : ['- none']),
        ...(s.findings.length > 200 ? [`- ... ${s.findings.length - 200} more`] : []),
        '',
      ];
    }),
  ].join('\n');
  mkdirSync(BUILD_DIR, { recursive: true });
  writeFileSync(join(BUILD_DIR, 'report.md'), report);
  writeKnownIssues(
    'validate',
    all.filter((f) => f.level !== 'info'),
  );

  for (const s of sections) {
    const e = s.findings.filter((f) => f.level === 'error');
    const w = s.findings.filter((f) => f.level === 'warn');
    console.log(
      `${e.length ? 'FAIL' : 'ok  '} ${s.title}: ${e.length} error(s), ${w.length} warning(s)`,
    );
    for (const f of e.slice(0, 15)) console.log(`       ${f.where}: ${f.message}`);
  }
  console.log(
    `\nFull report: build/report.md (${count('error')} errors, ${count('warn')} warnings).`,
  );
  if (count('error')) process.exitCode = 1;
}

async function build() {
  await ingest();
  if (process.exitCode) return;
  await emitCommand();
}

async function releaseCheck() {
  const reg = loadRegistry();
  writeNotice(reg);
  const rows = gateTable(reg);
  console.log(renderGateTable(rows));
  const open = rows.filter((r) => r.status === 'pending' || r.status === 'blocked');
  console.log(`\nNOTICE.md regenerated. ${open.length} gate(s) not cleared.`);
  if (open.length) {
    console.error(
      'Production release is blocked until every gate above is cleared or its feature is removed.',
    );
    process.exitCode = 1;
  }
}

const commands: Record<string, (args: string[]) => Promise<void>> = {
  ingest,
  emit: emitCommand,
  validate,
  build,
  'release-check': releaseCheck,
  'links-review': (a) => linksReview(a),
  fetch: (a) => fetchCommand(a),
  restore: (a) => restoreCommand(a),
  geometry: (a) => geometryCommand(a),
};

const run = command ? commands[command] : undefined;
if (!run) {
  console.log(`not implemented yet: ${command ?? '(no command)'}`);
  console.log(`Available: ${Object.keys(commands).join(', ')}`);
} else {
  await run(args);
}
