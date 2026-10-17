// Runs scripts/build_graph.py on a temporary copy of the repo with one ledger row.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROOT } from '../src/paths.ts';

function buildWithLedger(rows: string) {
  const dir = mkdtempSync(join(tmpdir(), 'tla-build-'));
  for (const p of [
    'scripts',
    'seed-data',
    'crosswalks',
    'docs/design/schema',
    'docs/research/C3-doctrine-map.md',
  ])
    cpSync(join(ROOT, p), join(dir, p), { recursive: true });
  mkdirSync(join(dir, 'build'), { recursive: true });
  writeFileSync(
    join(dir, 'crosswalks', 'tribal-review-ledger.csv'),
    'node_id,status,scope,date,reviewer_role,record_id,notes\n' + rows,
  );
  execFileSync('python3', [join(dir, 'scripts', 'build_graph.py')], {
    env: { ...process.env, SOURCE_DATE_EPOCH: '1792195200' },
    stdio: 'ignore',
  });
  const nodes = JSON.parse(readFileSync(join(dir, 'build', 'nodes.json'), 'utf8')).nodes as {
    id: string;
    tribal_review: { status: string; reviewer_role: string | null };
    publication: { state: string; narrative_allowed: boolean };
  }[];
  return new Map(nodes.map((n) => [n.id, n]));
}

describe('build_graph.py review ledger', () => {
  const nodes = buildWithLedger(
    [
      'nat-pd-cherokee-nation,reviewed,nation_specific,2026-11-01,cultural office,REC-1,',
      'nat-oceti-sakowin,declined,nation_specific,2026-11-02,council,REC-2,',
      'nat-haudenosaunee,reviewed,nation_specific,2026-11-03,,,',
    ].join('\n') + '\n',
  );

  it('a reviewed row with full evidence opens narrative', () => {
    const n = nodes.get('nat-pd-cherokee-nation')!;
    expect(n.tribal_review).toMatchObject({ status: 'reviewed', reviewer_role: 'cultural office' });
    expect(n.publication).toEqual({ state: 'published', narrative_allowed: true });
  });
  it('declined keeps the node record-only', () => {
    expect(nodes.get('nat-oceti-sakowin')!.publication).toEqual({
      state: 'record_only',
      narrative_allowed: false,
    });
  });
  it('an incomplete review row is ignored, so silence is never consent', () => {
    const n = nodes.get('nat-haudenosaunee')!;
    expect(n.tribal_review.status).toBe('not_yet_contacted');
    expect(n.publication.narrative_allowed).toBe(false);
  });
  it('nodes without a ledger row stay not_yet_contacted', () => {
    expect(nodes.get('nat-anishinaabe')!.tribal_review.status).toBe('not_yet_contacted');
  });
});
