import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readGraph, validateGraph, type Graph } from '../src/validate/graph.ts';
import { checkEncoding, checkLinks, checkReviewLedger } from '../src/validate/rules.ts';
import { checkLicenses, gateTable, loadRegistry } from '../src/licenses/index.ts';

const clone = (g: Graph): Graph => JSON.parse(JSON.stringify(g));
const base = readGraph();

describe('graph validation', () => {
  it('the current build has no schema or reference errors', () => {
    expect(validateGraph(base).filter((f) => f.level === 'error')).toEqual([]);
  });
  it('catches a dangling edge and a schema violation', () => {
    const g = clone(base);
    g.edges[0]!.target = 'nat-does-not-exist';
    (g.nodes[0] as Record<string, unknown>)['confidence'] = 'certain';
    g.nodesDoc.nodes = g.nodes;
    g.edgesDoc.edges = g.edges;
    const msgs = validateGraph(g)
      .map((f) => f.message)
      .join('\n');
    expect(msgs).toMatch(/does not exist/);
    expect(msgs).toMatch(/schema/);
  });
});

describe('V4 encoding and V7 links', () => {
  it('flags non-NFC text', () => {
    const g = clone(base);
    g.nodes[0]!.label = 'Dakȟóta'.normalize('NFD');
    expect(checkEncoding(g).some((f) => f.message.includes('NFC'))).toBe(true);
  });
  it('flags shorteners and token query strings', () => {
    const g = clone(base);
    const src = g.nodes.find((n) => n.type === 'Source')!;
    src['url'] = 'https://bit.ly/abc';
    const org = g.nodes.find((n) => n.type === 'Organization')!;
    org['donation_url'] = 'https://example.org/give?token=abc';
    const msgs = checkLinks(g)
      .map((f) => f.message)
      .join('\n');
    expect(msgs).toMatch(/shortener/);
    expect(msgs).toMatch(/token/);
  });
});

describe('V14 review ledger', () => {
  const ledger = (rows: string) => {
    const f = join(mkdtempSync(join(tmpdir(), 'ledger-')), 'l.csv');
    writeFileSync(f, 'node_id,status,scope,date,reviewer_role,record_id,notes\n' + rows);
    return f;
  };
  it('accepts an empty ledger', () => {
    expect(checkReviewLedger(base, ledger(''))).toEqual([]);
  });
  it('rejects unknown ids, bad statuses and incomplete reviews', () => {
    const id = base.nodes.find((n) => n.type === 'Nation')!.id;
    const out = checkReviewLedger(
      base,
      ledger(
        `nat-nope,invited,,,,,\n${id},approved,,,,,\n${id},reviewed,nation_specific,2026-01-01,,,\n`,
      ),
    ).map((f) => f.message);
    expect(out.join('\n')).toMatch(/unknown node id/);
    expect(out.join('\n')).toMatch(/status must be one of/);
    expect(out.join('\n')).toMatch(/needs date, reviewer_role and record_id/);
  });
  it('flags a reviewed node with no ledger row (status is never inferred)', () => {
    const g = clone(base);
    (g.nodes[0] as Record<string, unknown>)['tribal_review'] = {
      status: 'reviewed',
      scope: 'nation_specific',
    };
    expect(
      checkReviewLedger(g, ledger('')).some((f) => f.message.includes('no ledger entry')),
    ).toBe(true);
  });
});

describe('V9 license gates', () => {
  const reg = loadRegistry();
  it('production fails while gates are pending; preview only warns', () => {
    const prod = checkLicenses(reg, 'production');
    const prev = checkLicenses(reg, 'preview');
    expect(prod.some((f) => f.level === 'error')).toBe(true);
    expect(prev.some((f) => f.level === 'error')).toBe(false);
    expect(prev.some((f) => f.level === 'warn')).toBe(true);
  });
  it('the USFS gate is cleared by owner decision with evidence', () => {
    expect(gateTable(reg).find((g) => g.id === 'G-01')!.status).toBe('cleared');
  });
  it('a layer in the build without a registry entry is an error', () => {
    expect(checkLicenses(reg, 'preview', ['layers/mystery']).some((f) => f.level === 'error')).toBe(
      true,
    );
  });
  it('unused sources never block', () => {
    expect(gateTable(reg).find((g) => g.id === 'G-06')!.status).toBe('not_used');
  });
});
