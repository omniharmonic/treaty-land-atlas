import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/** Repository root (two levels above pipeline/src). */
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SEED_DIR = join(ROOT, 'seed-data');
export const CROSSWALK_DIR = join(ROOT, 'crosswalks');
export const BUILD_DIR = join(ROOT, 'build');
export const DATA_DIR = join(ROOT, 'data');
export const PUBLIC_DATA_DIR = join(ROOT, 'public', 'data');
export const SCHEMA_DIR = join(ROOT, 'docs', 'design', 'schema');
