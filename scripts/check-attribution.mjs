#!/usr/bin/env node
// Attribution check (J3 V15). Fails if a forbidden organization name appears in
// site-facing files, or if the required credit line is missing from the layout.
// Usage: node scripts/check-attribution.mjs [rootDir]
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const FORBIDDEN = /open\s*civics/i;
const CREDIT = 'Benjamin Life (@omniharmonic)';
const SCAN = ['src', 'public', 'data/overlays', 'README.md'];
const SKIP_DIRS = new Set(['node_modules', 'data']); // public/data is generated
const TEXT_EXT = /\.(astro|svelte|ts|js|mjs|json|md|html|css|txt|yaml|yml|svg)$/i;

function* walk(path, root) {
  if (!existsSync(path)) return;
  const st = statSync(path);
  if (st.isFile()) {
    if (TEXT_EXT.test(path)) yield path;
    return;
  }
  for (const name of readdirSync(path)) {
    const child = join(path, name);
    if (statSync(child).isDirectory() && SKIP_DIRS.has(name) && relative(root, path) === 'public')
      continue;
    yield* walk(child, root);
  }
}

export function checkAttribution(root = process.cwd()) {
  const problems = [];
  for (const target of SCAN) {
    for (const file of walk(join(root, target), root)) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (FORBIDDEN.test(line))
          problems.push(`${relative(root, file)}:${i + 1}: forbidden attribution text`);
      });
    }
  }
  const layout = join(root, 'src/layouts/Base.astro');
  if (existsSync(layout) && !readFileSync(layout, 'utf8').includes(CREDIT)) {
    problems.push(`src/layouts/Base.astro: missing credit line "${CREDIT}"`);
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = checkAttribution(process.argv[2] ?? process.cwd());
  if (problems.length) {
    console.error('Attribution check failed:\n' + problems.map((p) => '  ' + p).join('\n'));
    process.exit(1);
  }
  console.log('Attribution check passed.');
}
