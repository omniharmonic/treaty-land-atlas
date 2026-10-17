import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pendingEdges, readReviews, writeReview } from '../src/link/review.ts';
import { readGraph } from '../src/validate/graph.ts';
import { ROOT } from '../src/paths.ts';

const fixture = () => {
  const f = join(mkdtempSync(join(tmpdir(), 'reviews-')), 'edge-reviews.csv');
  writeFileSync(f, 'edge_id,decision,reviewer_role,date,notes\n');
  return f;
};

describe('links:review decisions file', () => {
  it('round-trips decisions, replaces a repeat and keeps quoting safe', () => {
    const f = fixture();
    writeReview(
      {
        edge_id: 'e-000000000002',
        decision: 'rejected',
        reviewer_role: 'legal reviewer',
        date: '2026-10-20',
        notes: 'wrong treaty, "same day"',
      },
      f,
    );
    writeReview(
      {
        edge_id: 'e-000000000001',
        decision: 'accepted',
        reviewer_role: 'project owner',
        date: '2026-10-20',
        notes: '',
      },
      f,
    );
    writeReview(
      {
        edge_id: 'e-000000000002',
        decision: 'accepted',
        reviewer_role: 'legal reviewer',
        date: '2026-10-21',
        notes: 'rechecked, ok',
      },
      f,
    );
    const r = readReviews(f);
    expect([...r.keys()]).toEqual(['e-000000000001', 'e-000000000002']);
    expect(r.get('e-000000000002')).toMatchObject({
      decision: 'accepted',
      date: '2026-10-21',
      notes: 'rechecked, ok',
    });
    expect(readFileSync(f, 'utf8').split('\n')[1]).toMatch(/^e-000000000001,accepted/);
  });

  it('refuses a decision without a role or with a bad date', () => {
    const f = fixture();
    expect(() =>
      writeReview(
        { edge_id: 'e-1', decision: 'accepted', reviewer_role: ' ', date: '2026-10-20', notes: '' },
        f,
      ),
    ).toThrow(/role/);
    expect(() =>
      writeReview(
        { edge_id: 'e-1', decision: 'accepted', reviewer_role: 'x', date: 'today', notes: '' },
        f,
      ),
    ).toThrow(/date/);
  });

  it('lists only undecided proposed edges, nation links first', () => {
    const g = readGraph();
    const pending = pendingEdges(g, new Map());
    expect(pending.every((e) => e.status === 'proposed')).toBe(true);
    expect(pending[0]!.source_type === 'Nation' || pending[0]!.target_type === 'Nation').toBe(true);
  });
});

describe('build_graph.py applies decisions and they persist across rebuilds', () => {
  it('accepts and rejects edges by id', () => {
    const g = readGraph();
    const [a, b] = pendingEdges(g, new Map(), 'depicts');
    const dir = mkdtempSync(join(tmpdir(), 'tla-review-'));
    for (const p of [
      'scripts',
      'seed-data',
      'crosswalks',
      'data/derived',
      'docs/design/schema',
      'docs/research/C3-doctrine-map.md',
    ])
      cpSync(join(ROOT, p), join(dir, p), { recursive: true });
    mkdirSync(join(dir, 'build'), { recursive: true });
    writeFileSync(
      join(dir, 'crosswalks', 'edge-reviews.csv'),
      `edge_id,decision,reviewer_role,date,notes\n${a!.id},accepted,project owner,2026-10-20,\n${b!.id},rejected,project owner,2026-10-20,wrong\n`,
    );
    const build = () => {
      execFileSync('python3', [join(dir, 'scripts', 'build_graph.py')], {
        env: { ...process.env, SOURCE_DATE_EPOCH: '1792195200' },
        stdio: 'ignore',
      });
      const edges = JSON.parse(readFileSync(join(dir, 'build', 'edges.json'), 'utf8')).edges as {
        id: string;
        status: string;
        review: { reviewer_role?: string; date?: string };
      }[];
      return new Map(edges.map((e) => [e.id, e]));
    };
    for (const run of [1, 2]) {
      const edges = build();
      expect(edges.get(a!.id), `run ${run}`).toMatchObject({
        status: 'accepted',
        review: { reviewer_role: 'project owner', date: '2026-10-20' },
      });
      expect(edges.get(b!.id)!.status).toBe('rejected');
    }
  }, 120_000);
});
