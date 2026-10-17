// Tests read build/nodes.json; build it once if a fresh checkout has none.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../src/paths.ts';

export default function setup() {
  if (!existsSync(join(ROOT, 'build', 'nodes.json')))
    execFileSync('python3', [join(ROOT, 'scripts', 'build_graph.py')], {
      env: { ...process.env, SOURCE_DATE_EPOCH: process.env.SOURCE_DATE_EPOCH ?? '1792195200' },
      stdio: 'ignore',
    });
}
