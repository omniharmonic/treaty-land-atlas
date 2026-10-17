#!/usr/bin/env node
// No Native Land Digital data is ever stored or redistributed (J2 s.9, owner decision 2026-10-17:
// NLD data is fetched live in the reader's browser and never saved). Code may name the API;
// data files may not contain NLD content.
// Usage: node scripts/check-no-nld.mjs [extraDir ...]   (scans git-tracked files plus each extraDir)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const NAME =
  /(^|\/)(nld[-_.][^/]*|native-land-(digital|territor|language|treat)[^/]*)\.(geo)?json$/i;
const DATA = /\.(geo)?json$/i;
// NLD features link to their own map pages (native-land.ca/maps/...); a feature collection that
// mentions native-land.ca is treated as NLD data. Attribution text and source records are fine.
const NLD_FEATURE_LINK = /native-land\.ca\/maps\//i;
const FEATURE = /"type"\s*:\s*"Feature"/;
const NLD_HOST = /native-land\.ca/i;
const isNldData = (text) =>
  NLD_FEATURE_LINK.test(text) || (FEATURE.test(text) && NLD_HOST.test(text));
// Files that legitimately mention native-land.ca as a link or a policy, not as data.
const ALLOW = [
  /^docs\//,
  /^data\/licenses\//,
  /^seed-data\//,
  /^verification\//,
  /^build\//,
  /^src\/integrations\/territory\/integrations\.config\.json$/,
];

export function checkNoNld(root = process.cwd(), extraDirs = []) {
  const files = new Set();
  try {
    for (const f of execFileSync('git', ['ls-files'], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .split('\n'))
      if (f) files.add(f);
  } catch {
    /* not a git checkout: only extra dirs are scanned */
  }
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else files.add(relative(root, p));
    }
  };
  for (const d of extraDirs) if (existsSync(join(root, d))) walk(join(root, d));
  const problems = [];
  for (const f of [...files].sort()) {
    if (ALLOW.some((a) => a.test(f))) continue;
    if (NAME.test(f)) problems.push(`${f}: file name looks like Native Land Digital data`);
    else if (
      DATA.test(f) &&
      existsSync(join(root, f)) &&
      isNldData(readFileSync(join(root, f), 'utf8'))
    )
      problems.push(`${f}: data file contains Native Land Digital content`);
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = checkNoNld(process.cwd(), process.argv.slice(2));
  if (problems.length) {
    console.error(
      'Native Land Digital data must never be stored:\n' + problems.map((p) => '  ' + p).join('\n'),
    );
    process.exit(1);
  }
  console.log('No Native Land Digital data found.');
}
