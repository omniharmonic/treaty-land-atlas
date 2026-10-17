import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { emit } from '../src/emit/index.ts';
import { readGraph } from '../src/validate/graph.ts';

const graph = readGraph();
const run = (opts: Partial<Parameters<typeof emit>[1]> = {}) => {
  const outDir = mkdtempSync(join(tmpdir(), 'emit-'));
  const result = emit(graph, { outDir, dataVersion: 'test', ...opts });
  const read = (rel: string) => JSON.parse(readFileSync(join(outDir, rel), 'utf8'));
  return { outDir, result, read };
};

describe('emit', () => {
  it('is deterministic', () => {
    const a = run().result.files;
    const b = run().result.files;
    expect(a).toEqual(b);
  });

  it('includes every edge status in graph-lite (owner decision: show all edges)', () => {
    const { read } = run();
    const lite = read('graph-lite.json');
    const statuses = new Set(lite.edges.map((e: string[]) => e[3]));
    expect(statuses).toContain('p');
    expect(statuses).toContain('s');
  });

  it('keeps graph-lite under the 400 KB gzip budget', () => {
    const { outDir } = run();
    const gz = gzipSync(readFileSync(join(outDir, 'graph-lite.json'))).length;
    expect(gz).toBeLessThan(400 * 1024);
  });

  it('removes a suppressed id from every public file, including edges', () => {
    const target =
      graph.nodes.find((n) => n.type === 'Instrument' && n.id === 'TLA-T-369') ?? graph.nodes[0]!;
    const { outDir, read } = run({ suppressed: new Set([target.id]) });
    const lite = read('graph-lite.json');
    expect(lite.nodes.some((n: string[]) => n[0] === target.id)).toBe(false);
    expect(lite.edges.some((e: string[]) => e[1] === target.id || e[2] === target.id)).toBe(false);
    expect(existsSync(join(outDir, 'entities', target.type, `${target.id}.json`))).toBe(false);
    expect(JSON.stringify(read('search-index.json'))).not.toContain(`"${target.id}"`);
    expect(JSON.stringify(read('tables/instruments-lite.json'))).not.toContain(`"${target.id}"`);
  });

  it('never publishes website or donation links for low-confidence organizations', () => {
    const { read } = run();
    const low = graph.nodes.filter((n) => n.type === 'Organization' && n.confidence === 'low');
    expect(low.length).toBeGreaterThan(0);
    for (const o of low) {
      const node = read(`entities/Organization/${o.id}.json`).node;
      expect(node.website).toBeNull();
      expect(node.donation_url).toBeNull();
      expect(node.listing_status).toBe('not_listed');
    }
  });

  it('publishes sourced summaries of federal records but holds nation narrative for review', () => {
    const inst = graph.nodes.find((x) => x.type === 'Instrument')!;
    const nation = graph.nodes.find(
      (x) =>
        x.type === 'Nation' &&
        !(x['publication'] as { narrative_allowed?: boolean })?.narrative_allowed,
    )!;
    const ov = (id: string) => ({
      id,
      ai_assisted: true,
      content_warnings: [],
      sources: [],
      body: 'Narrative',
      file: 'x.md',
    });
    const { read } = run({
      overlays: new Map([
        [inst.id, ov(inst.id)],
        [nation.id, ov(nation.id)],
      ]),
    });
    expect(read(`entities/Instrument/${inst.id}.json`).node.overlay.narrative).toBe('Narrative');
    expect(read(`entities/Nation/${nation.id}.json`).node.overlay.narrative).toBeNull();
  });

  it('writes no build timestamp and never copies the raw graph', () => {
    const { outDir, read } = run();
    expect(JSON.stringify(read('manifest.json'))).not.toContain(graph.nodesDoc.generated);
    expect(existsSync(join(outDir, 'nodes.json'))).toBe(false);
    expect(existsSync(join(outDir, 'edges.json'))).toBe(false);
  });

  it('indexes alias and ASCII-folded names for search', () => {
    const { read } = run();
    const idx: [string, string, string, string[]][] = read('search-index.json');
    const withFolded = idx.find(
      ([, , label]) => label !== label.normalize('NFKD').replace(/\p{M}/gu, ''),
    );
    if (withFolded)
      expect(withFolded[3]).toContain(withFolded[2].normalize('NFKD').replace(/\p{M}/gu, ''));
  });
});
