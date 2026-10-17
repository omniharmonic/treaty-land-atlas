// Upstream downloads (J5 P1-08, P1-11). Raw files go to data/sources/raw/<source>/ (git-ignored);
// data/sources/manifest.json (committed) pins each file's URL, size and SHA-256.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { DATA_DIR } from '../paths.ts';
import { sha256 } from '../emit/index.ts';

export const RAW_DIR = join(DATA_DIR, 'sources', 'raw');
const MANIFEST = join(DATA_DIR, 'sources', 'manifest.json');

export const USFS_SERVICE =
  'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer';

export interface ManifestEntry {
  source: string;
  file: string;
  url: string;
  bytes: number;
  sha256: string;
  retrieved: string;
  records?: number;
  notes?: string;
}

interface Manifest {
  description: string;
  files: ManifestEntry[];
}

export function readManifest(): Manifest {
  if (!existsSync(MANIFEST))
    return {
      description:
        'Pinned raw upstream files. Raw files are not committed; restore them with npm run data:restore or re-fetch with npm run data:fetch.',
      files: [],
    };
  return JSON.parse(readFileSync(MANIFEST, 'utf8'));
}

function writeManifest(m: Manifest) {
  m.files.sort((a, b) => (a.source + a.file).localeCompare(b.source + b.file));
  mkdirSync(join(DATA_DIR, 'sources'), { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n');
}

function record(entry: ManifestEntry) {
  const m = readManifest();
  m.files = m.files.filter((f) => !(f.source === entry.source && f.file === entry.file));
  m.files.push(entry);
  writeManifest(m);
}

async function getJson(url: string, attempt = 1): Promise<unknown> {
  const res = await fetch(url, {
    headers: { 'user-agent': 'treaty-land-atlas data pipeline (landback.land)' },
  });
  if (!res.ok) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return getJson(url, attempt + 1);
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const body = (await res.json()) as { error?: { message?: string } };
  if (body && typeof body === 'object' && 'error' in body && body.error)
    throw new Error(`ArcGIS error for ${url}: ${body.error.message}`);
  return body;
}

/** Page through an ArcGIS REST layer ordered by objectid, honoring exceededTransferLimit. */
async function queryAll(
  layerUrl: string,
  format: 'geojson' | 'json',
  extra: Record<string, string> = {},
) {
  const count = (await getJson(
    `${layerUrl}/query?${new URLSearchParams({ where: '1=1', returnCountOnly: 'true', f: 'json' })}`,
  )) as { count: number };
  const pageSize = 1000;
  const features: unknown[] = [];
  let offset = 0;
  let last: Record<string, unknown> | undefined;
  for (;;) {
    const params = new URLSearchParams({
      where: '1=1',
      outFields: '*',
      orderByFields: 'objectid ASC',
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
      f: format,
      ...extra,
    });
    const page = (await getJson(`${layerUrl}/query?${params}`)) as {
      features: unknown[];
      exceededTransferLimit?: boolean;
      properties?: { exceededTransferLimit?: boolean };
    };
    features.push(...page.features);
    last = page as unknown as Record<string, unknown>;
    offset += page.features.length;
    const more = page.exceededTransferLimit || page.properties?.exceededTransferLimit;
    if (!page.features.length || (!more && offset >= count.count)) break;
  }
  if (features.length !== count.count)
    throw new Error(`expected ${count.count} records from ${layerUrl}, got ${features.length}`);
  return { features, count: count.count, last: last ?? {} };
}

async function fetchUsfs(today: string) {
  const dir = join(RAW_DIR, 'usfs-royce');
  mkdirSync(dir, { recursive: true });

  console.log('Fetching USFS cession polygons (layer 1) as GeoJSON in WGS84...');
  const polys = await queryAll(`${USFS_SERVICE}/1`, 'geojson', { outSR: '4326' });
  const polyBody = JSON.stringify({ type: 'FeatureCollection', features: polys.features });
  writeFileSync(join(dir, 'polygons.geojson'), polyBody);
  record({
    source: 'usfs-royce',
    file: 'polygons.geojson',
    url: `${USFS_SERVICE}/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson`,
    bytes: Buffer.byteLength(polyBody),
    sha256: sha256(polyBody),
    retrieved: today,
    records: polys.count,
  });
  console.log(`  ${polys.count} polygon features`);

  console.log('Fetching USFS attribute table (layer 2)...');
  const table = await queryAll(`${USFS_SERVICE}/2`, 'json');
  const rows = (table.features as { attributes: Record<string, unknown> }[]).map(
    (f) => f.attributes,
  );
  const tableBody = JSON.stringify({ fields: (table.last['fields'] as unknown) ?? [], rows });
  writeFileSync(join(dir, 'attributes.json'), tableBody);
  record({
    source: 'usfs-royce',
    file: 'attributes.json',
    url: `${USFS_SERVICE}/2/query?where=1%3D1&outFields=*&f=json`,
    bytes: Buffer.byteLength(tableBody),
    sha256: sha256(tableBody),
    retrieved: today,
    records: table.count,
  });
  console.log(`  ${table.count} attribute rows`);

  const meta = await getJson(`${USFS_SERVICE}/1?f=json`);
  const metaBody = JSON.stringify(meta, null, 1);
  writeFileSync(join(dir, 'layer1-metadata.json'), metaBody);
  record({
    source: 'usfs-royce',
    file: 'layer1-metadata.json',
    url: `${USFS_SERVICE}/1?f=json`,
    bytes: Buffer.byteLength(metaBody),
    sha256: sha256(metaBody),
    retrieved: today,
  });
}

/** Census Cartographic Boundary AIANNH, 1:500,000. The zip URL is resolved by the census fetcher. */
export const CENSUS_AIANNH = {
  vintage: '2025',
  url: 'https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_aiannh_500k.zip',
};

async function fetchCensus(today: string) {
  const dir = join(RAW_DIR, 'census-aiannh');
  mkdirSync(dir, { recursive: true });
  const url = process.env.CENSUS_AIANNH_URL ?? CENSUS_AIANNH.url;
  console.log(`Fetching ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = basename(new URL(url).pathname);
  writeFileSync(join(dir, file), buf);
  record({
    source: 'census-aiannh',
    file,
    url,
    bytes: buf.length,
    sha256: sha256(buf),
    retrieved: today,
  });
  console.log(`  ${buf.length} bytes`);
}

/** Copy pinned files from a folder (e.g. downloaded by hand) and verify their checksums. */
function fromDir(dir: string, source: string) {
  const m = readManifest();
  const wanted = m.files.filter((f) => f.source === source);
  if (!wanted.length)
    throw new Error(`manifest has no files for ${source}; fetch once with network first`);
  const target = join(RAW_DIR, source);
  mkdirSync(target, { recursive: true });
  for (const f of wanted) {
    const src = join(dir, f.file);
    if (!existsSync(src)) throw new Error(`missing ${f.file} in ${dir}`);
    const sum = sha256(readFileSync(src));
    if (sum !== f.sha256) throw new Error(`checksum mismatch for ${f.file}: ${sum} != ${f.sha256}`);
    copyFileSync(src, join(target, f.file));
    console.log(`  restored ${source}/${f.file} (checksum ok)`);
  }
}

export async function fetchCommand(args: string[]) {
  const which = args.find((a) => !a.startsWith('--')) ?? 'all';
  const dirFlag = args.find((a) => a.startsWith('--from-dir='))?.split('=')[1];
  const today = process.env.SOURCE_DATE_EPOCH
    ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const sources = which === 'all' ? ['usfs', 'census'] : [which];
  for (const s of sources) {
    const id = s === 'usfs' ? 'usfs-royce' : s === 'census' ? 'census-aiannh' : s;
    try {
      if (dirFlag) fromDir(dirFlag, id);
      else if (id === 'usfs-royce') await fetchUsfs(today);
      else if (id === 'census-aiannh') await fetchCensus(today);
      else throw new Error(`unknown source ${s} (use usfs or census)`);
    } catch (err) {
      console.error(`\nCould not fetch ${id}: ${(err as Error).message}`);
      console.error(
        `If your network blocks the download, download the files listed in data/sources/manifest.json by hand into a folder and run:\n  npm run data:fetch -- ${s} --from-dir=/path/to/folder`,
      );
      process.exitCode = 1;
    }
  }
}

/**
 * Restore pinned raw files from this repository's GitHub Release (tag data-sources-YYYYMMDD),
 * verifying checksums. Releases are created by the owner; this only downloads.
 */
export async function restoreCommand(args: string[]) {
  const tag =
    args.find((a) => a.startsWith('--tag='))?.split('=')[1] ?? process.env.DATA_SOURCES_TAG;
  const repo = process.env.GITHUB_REPOSITORY ?? 'omniharmonic/treaty-land-atlas';
  const m = readManifest();
  if (!m.files.length) {
    console.log('Manifest is empty: nothing to restore. Run npm run data:fetch first.');
    return;
  }
  const missing = m.files.filter((f) => {
    const p = join(RAW_DIR, f.source, f.file);
    return !existsSync(p) || sha256(readFileSync(p)) !== f.sha256;
  });
  if (!missing.length) {
    console.log(`All ${m.files.length} pinned raw files present with matching checksums.`);
    return;
  }
  if (!tag) {
    console.error(
      `${missing.length} raw file(s) missing. Set --tag=data-sources-YYYYMMDD (a GitHub Release on ${repo}) or run npm run data:fetch.`,
    );
    process.exitCode = 1;
    return;
  }
  for (const f of missing) {
    const url = `https://github.com/${repo}/releases/download/${tag}/${f.source}__${f.file}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP ${res.status} for ${url}`);
      process.exitCode = 1;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (sha256(buf) !== f.sha256) {
      console.error(`checksum mismatch for ${f.file} from ${url}`);
      process.exitCode = 1;
      continue;
    }
    mkdirSync(join(RAW_DIR, f.source), { recursive: true });
    writeFileSync(join(RAW_DIR, f.source, f.file), buf);
    console.log(`restored ${f.source}/${f.file}`);
  }
}
