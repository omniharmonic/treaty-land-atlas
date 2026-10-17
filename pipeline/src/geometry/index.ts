// Geometry pipeline (J5 P1-08 inventory, P1-09 cessions, P1-11 today layer; ADR-004, ADR-006).
// Reads raw downloads from data/sources/raw/ and writes committed, reproducible outputs to
// data/derived/ (the emit stage copies them into public/data/layers/ with hashed names).
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { BUILD_DIR, DATA_DIR } from '../paths.ts';
import { readManifest, RAW_DIR } from '../fetch/index.ts';
import { clean, parsePartialDate } from '../normalize/index.ts';

export const DERIVED_DIR = join(DATA_DIR, 'derived');

/** Cession ids the research reported as having no geometry (E2 [verified]). */
export const KNOWN_MISSING = ['47', '65', '128', '129', '130', '543', '690'];

/** Simplification and quantization parameters, recorded in PROVENANCE.md. */
export const CESSION_PARAMS = {
  simplify: 'visvalingam weighted percentage=60% keep-shapes',
  precision: 0.0001,
};
export const TODAY_PARAMS = {
  simplify: 'visvalingam weighted percentage=20% keep-shapes',
  precision: 0.0001,
};

type Attr = Record<string, string | number | null>;

export interface CessionDate {
  n: number;
  date: string;
  decimal: number;
  royce_schedule_url: string | null;
  kappler_url: string | null;
}

export interface CessionEvent {
  id: string;
  cessnum: string;
  sort: number;
  dates: CessionDate[];
  t_first: number | null;
  t_last: number | null;
  legal_type: 'treaty_or_agreement' | 'statute' | 'executive_order' | 'unknown';
  legal_type_basis: string;
  statute_url: string | null;
  executive_order_url: string | null;
  maps: { name: string; url: string | null }[];
  tribes_as_named_in_schedule: string[];
  present_day_tribes_per_usfs: string[];
  states: string[];
  counties: string[];
  citations: string[];
  geometry_quality: 'ok' | 'missing';
}

const str = (v: unknown) => (v === null || v === undefined ? '' : clean(String(v)));
const list = (v: unknown) =>
  str(v)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
const url = (v: unknown) => (str(v) ? str(v) : null);

/** ArcGIS date fields are epoch milliseconds at 12:00 UTC on the recorded day. */
export function arcgisDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function buildEvents(rows: Attr[]): { events: CessionEvent[]; skipped: Attr[] } {
  const events: CessionEvent[] = [];
  const skipped: Attr[] = [];
  for (const r of rows) {
    const cessnum = str(r['cessnum']);
    if (!cessnum) {
      skipped.push(r);
      continue;
    }
    const dates: CessionDate[] = [];
    for (let n = 1; n <= 5; n++) {
      const ms = r[`cessdate${n}`];
      if (typeof ms !== 'number') continue;
      const iso = arcgisDate(ms);
      dates.push({
        n,
        date: iso,
        decimal: parsePartialDate(iso)!.decimal,
        royce_schedule_url: url(r[`date${n}link_royce_schedule`]),
        kappler_url: url(r[`date${n}link_kappler_treaty`]),
      });
    }
    const kappler = dates.some((d) => d.kappler_url);
    const statute = url(r['link_federal_statute']);
    const eo = url(r['link_executive_order']);
    const [legal_type, legal_type_basis] = kappler
      ? ([
          'treaty_or_agreement',
          'date link to Kappler, Indian Affairs: Laws and Treaties',
        ] as const)
      : statute
        ? (['statute', 'link_federal_statute present, no Kappler link'] as const)
        : eo
          ? ([
              'executive_order',
              'link_executive_order present, no Kappler or statute link',
            ] as const)
          : (['unknown', 'no Kappler, statute or executive-order link in the USFS table'] as const);
    const maps: CessionEvent['maps'] = [];
    for (let n = 1; n <= 6; n++) {
      const name = str(r[`mapname${n}`]);
      if (name) maps.push({ name, url: url(r[`mapurl${n}`]) });
    }
    const decimals = dates.map((d) => d.decimal);
    events.push({
      id: `geo-royce-${cessnum.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      cessnum,
      sort: Number(r['cessnumsort'] ?? 0),
      dates,
      t_first: decimals.length ? Math.min(...decimals) : null,
      t_last: decimals.length ? Math.max(...decimals) : null,
      legal_type,
      legal_type_basis,
      statute_url: statute,
      executive_order_url: eo,
      maps,
      tribes_as_named_in_schedule: list(r['schdtrb']),
      present_day_tribes_per_usfs: list(r['presdaytrb']),
      states: list(r['state'])
        .flatMap((s) => s.split(/[,\s]+/))
        .filter(Boolean),
      counties: list(r['county']),
      citations: [...list(r['citation1']), ...list(r['citation2'])],
      geometry_quality: 'missing',
    });
  }
  events.sort((a, b) => a.sort - b.sort || a.cessnum.localeCompare(b.cessnum));
  return { events, skipped };
}

function mapshaper(args: string[]) {
  const bin = join(process.cwd(), 'node_modules', 'mapshaper', 'bin', 'mapshaper');
  execFileSync(process.execPath, [bin, ...args, '-quiet'], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
}

function mapshaperVersion(): string {
  return JSON.parse(
    readFileSync(join(process.cwd(), 'node_modules', 'mapshaper', 'package.json'), 'utf8'),
  ).version;
}

interface Feature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown } | null;
}

function processCessions(): string[] {
  const dir = join(RAW_DIR, 'usfs-royce');
  const polyFile = join(dir, 'polygons.geojson');
  const attrFile = join(dir, 'attributes.json');
  if (!existsSync(polyFile) || !existsSync(attrFile))
    throw new Error('raw USFS files missing: run npm run data:fetch -- usfs (or data:restore)');
  const polys = JSON.parse(readFileSync(polyFile, 'utf8')) as { features: Feature[] };
  const table = JSON.parse(readFileSync(attrFile, 'utf8')) as { rows: Attr[] };
  const { events, skipped } = buildEvents(table.rows);
  const byNum = new Map(events.map((e) => [e.cessnum, e]));

  const report: string[] = [];
  const withGeometry = new Set<string>();
  const unmatched: string[] = [];
  for (const f of polys.features) {
    const num = str(f.properties['cessnum']);
    const ev = byNum.get(num);
    if (!ev) {
      unmatched.push(num || `objectid ${String(f.properties['objectid'])} (no cessnum)`);
      continue;
    }
    withGeometry.add(num);
    ev.geometry_quality = 'ok';
  }

  // Slim, joined input for mapshaper: only the properties the map draws with.
  const input = {
    type: 'FeatureCollection',
    features: polys.features
      .filter((f) => byNum.has(str(f.properties['cessnum'])))
      .map((f) => {
        const ev = byNum.get(str(f.properties['cessnum']))!;
        return {
          type: 'Feature',
          properties: {
            id: ev.id,
            n: ev.cessnum,
            t0: ev.t_first,
            t1: ev.t_last,
            lt: ev.legal_type,
            tier: 'T3',
          },
          geometry: f.geometry,
        };
      })
      .sort((a, b) => String(a.properties.id).localeCompare(String(b.properties.id))),
  };
  const tmp = mkdtempSync(join(tmpdir(), 'tla-geo-'));
  const inFile = join(tmp, 'cessions-in.json');
  const outFile = join(tmp, 'cessions-out.json');
  writeFileSync(inFile, JSON.stringify(input));
  mapshaper([
    '-i',
    inFile,
    '-clean',
    'allow-overlaps',
    '-simplify',
    ...CESSION_PARAMS.simplify.split(' '),
    '-o',
    outFile,
    'format=geojson',
    `precision=${CESSION_PARAMS.precision}`,
  ]);
  const out = JSON.parse(readFileSync(outFile, 'utf8')) as { features: Feature[] };
  // Stable order and stable numeric ids for MapLibre feature-state.
  out.features.sort((a, b) => String(a.properties['id']).localeCompare(String(b.properties['id'])));
  const body = JSON.stringify({ type: 'FeatureCollection', features: out.features });
  mkdirSync(DERIVED_DIR, { recursive: true });
  writeFileSync(join(DERIVED_DIR, 'cessions.json'), body + '\n');
  const eventsBody = JSON.stringify(events, null, 1);
  writeFileSync(join(DERIVED_DIR, 'cession-events.json'), eventsBody + '\n');

  const gz = gzipSync(body).length;
  const missing = events.filter((e) => e.geometry_quality === 'missing').map((e) => e.cessnum);
  const pinned = readManifest().files.filter((f) => f.source === 'usfs-royce');
  provenanceRow(
    'data/derived/cessions.json',
    'USFS Tribal Lands Ceded (layer 1 polygons, layer 2 table)',
    pinned.map((p) => `${p.file} ${p.sha256.slice(0, 12)}`).join('; '),
    `mapshaper ${mapshaperVersion()}`,
    `-clean allow-overlaps; -simplify ${CESSION_PARAMS.simplify}; precision=${CESSION_PARAMS.precision}`,
  );
  report.push(
    `Cessions: ${polys.features.length} polygon features; ${events.length} cession records (${skipped.length} empty table row(s) skipped); ${withGeometry.size} with geometry; ${missing.length} without (${missing.join(', ')}).`,
    `Known-missing list from E2 ${sameSet(missing, KNOWN_MISSING) ? 'matches' : 'DIFFERS from'} the data (${KNOWN_MISSING.join(', ')}).`,
    `Polygons with no table row: ${unmatched.length ? unmatched.join(', ') : 'none'}.`,
    `cessions.json: ${(Buffer.byteLength(body) / 1024).toFixed(0)} KB, ${(gz / 1024).toFixed(0)} KB gzip (budget 2048 KB gzip).`,
  );
  writeInventory(polys.features, table.rows, events, report);
  return report;
}

function sameSet(a: string[], b: string[]) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

/** P1-08: build/usfs-field-inventory.md. */
function writeInventory(polys: Feature[], rows: Attr[], events: CessionEvent[], report: string[]) {
  const fields = Object.keys(rows[0] ?? {});
  const lines = [
    '# USFS cession layer: field inventory',
    '',
    'Generated by `npm run data:geometry`. Source: the raw files pinned in `data/sources/manifest.json`.',
    '',
    ...report.map((r) => `- ${r}`),
    `- Geometry types: ${countList(polys.map((f) => f.geometry?.type ?? 'null'))}.`,
    `- Legal type (derived): ${countList(events.map((e) => e.legal_type))}.`,
    `- Number of dates per cession: ${countList(events.map((e) => String(e.dates.length)))}.`,
    `- Date range of first dates: ${minMax(events.flatMap((e) => (e.dates[0] ? [e.dates[0].date] : [])))}.`,
    '- Date fields `cessdate1`-`cessdate5` are ArcGIS dates (epoch milliseconds at 12:00 UTC); each is one Royce Schedule date, read as a calendar day.',
    '- No field distinguishes a cession from a reservation; every feature is treated as `geometry_role: cession` with that caveat in its notes.',
    '',
    '| Field | Non-null | Example |',
    '|---|---|---|',
    ...fields.map((f) => {
      const vals = rows.map((r) => r[f]).filter((v) => v !== null && v !== '');
      return `| ${f} | ${vals.length} / ${rows.length} | ${String(vals[0] ?? '')
        .slice(0, 80)
        .replace(/\|/g, '/')} |`;
    }),
    '',
  ];
  mkdirSync(BUILD_DIR, { recursive: true });
  writeFileSync(join(BUILD_DIR, 'usfs-field-inventory.md'), lines.join('\n'));
}

function countList(xs: string[]) {
  const m = new Map<string, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}`)
    .join(', ');
}

function minMax(xs: string[]) {
  const s = [...xs].sort();
  return s.length ? `${s[0]} to ${s[s.length - 1]}` : 'none';
}

function processToday(): string[] {
  const dir = join(RAW_DIR, 'census-aiannh');
  if (!existsSync(dir))
    throw new Error('raw Census file missing: run npm run data:fetch -- census');
  const zip = readdirSync(dir).find((f) => f.endsWith('.zip'));
  if (!zip) throw new Error('no Census zip in data/sources/raw/census-aiannh');
  const tmp = mkdtempSync(join(tmpdir(), 'tla-census-'));
  execFileSync('unzip', ['-o', '-q', join(dir, zip), '-d', tmp]);
  const shp = readdirSync(tmp).find((f) => f.endsWith('.shp'));
  if (!shp) throw new Error('no .shp in the Census zip');
  const outFile = join(tmp, 'today.json');
  mapshaper([
    '-i',
    join(tmp, shp),
    '-proj',
    'wgs84',
    '-filter-fields',
    'GEOID,NAME,NAMELSAD,AIANNHCE,LSAD,MTFCC',
    '-simplify',
    ...TODAY_PARAMS.simplify.split(' '),
    '-o',
    outFile,
    'format=geojson',
    `precision=${TODAY_PARAMS.precision}`,
  ]);
  const out = JSON.parse(readFileSync(outFile, 'utf8')) as { features: Feature[] };
  out.features.sort((a, b) =>
    String(a.properties['GEOID']).localeCompare(String(b.properties['GEOID'])),
  );
  const body = JSON.stringify({ type: 'FeatureCollection', features: out.features });
  mkdirSync(DERIVED_DIR, { recursive: true });
  writeFileSync(join(DERIVED_DIR, 'today-aiannh.json'), body + '\n');
  const pinned = readManifest().files.find((f) => f.source === 'census-aiannh');
  provenanceRow(
    'data/derived/today-aiannh.json',
    `Census Cartographic Boundary AIANNH 1:500,000 (${zip})`,
    pinned ? pinned.sha256.slice(0, 12) : 'unpinned',
    `mapshaper ${mapshaperVersion()}`,
    `-proj wgs84; -simplify ${TODAY_PARAMS.simplify}; precision=${TODAY_PARAMS.precision}`,
  );
  const gz = gzipSync(body).length;
  return [
    `Today layer: ${out.features.length} features; ${(Buffer.byteLength(body) / 1024).toFixed(0)} KB, ${(gz / 1024).toFixed(0)} KB gzip.`,
  ];
}

/** Replace (or add) one row in data/PROVENANCE.md, keyed by output path. */
function provenanceRow(
  output: string,
  source: string,
  checksum: string,
  tool: string,
  params: string,
) {
  const file = join(DATA_DIR, 'PROVENANCE.md');
  const doc = readFileSync(file, 'utf8');
  const date = process.env.SOURCE_DATE_EPOCH
    ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const row = `| ${output} | ${source} | ${checksum} | ${tool} | ${params} | ${date} |`;
  const lines = doc
    .trimEnd()
    .split('\n')
    .filter((l) => !l.startsWith(`| ${output} |`));
  writeFileSync(file, [...lines, row].join('\n') + '\n');
}

export async function geometryCommand(args: string[]) {
  const which = args.find((a) => !a.startsWith('--')) ?? 'all';
  const out: string[] = [];
  try {
    if (which === 'all' || which === 'cessions') out.push(...processCessions());
    if (which === 'all' || which === 'today') out.push(...processToday());
  } catch (err) {
    console.error((err as Error).message);
    process.exitCode = 1;
  }
  for (const line of out) console.log(line);
}
