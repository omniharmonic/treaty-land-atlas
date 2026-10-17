// V2 (id integrity) and V3 (graph schema + referential integrity) over build/*.json.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { BUILD_DIR, SCHEMA_DIR } from '../paths.ts';
import type { Finding } from '../report/known-issues.ts';

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  [key: string]: unknown;
}
export interface GraphEdge {
  id: string;
  type: string;
  source: string;
  target: string;
  source_type: string;
  target_type: string;
  status: string;
  confidence: string;
  basis?: string | null;
  qualifiers?: Record<string, unknown>;
  [key: string]: unknown;
}
export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodesDoc: { schema_version: string; generated: string; nodes: GraphNode[] };
  edgesDoc: { schema_version: string; generated: string; edges: GraphEdge[] };
}

export function readGraph(dir = BUILD_DIR): Graph {
  const nodesDoc = JSON.parse(readFileSync(join(dir, 'nodes.json'), 'utf8'));
  const edgesDoc = JSON.parse(readFileSync(join(dir, 'edges.json'), 'utf8'));
  return { nodes: nodesDoc.nodes, edges: edgesDoc.edges, nodesDoc, edgesDoc };
}

function loadSchema(name: string) {
  return JSON.parse(readFileSync(join(SCHEMA_DIR, name), 'utf8'));
}

type Validate = ReturnType<Ajv2020['compile']>;
interface Validators {
  nodes: Validate;
  edges: Validate;
  byType: (type: string) => ReturnType<Ajv2020['getSchema']>;
}
let validators: Validators | null = null;

function getValidators(): Validators {
  if (validators) return validators;
  // strict: false because the schemas carry x-* annotation keywords (x-edge-types).
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats.default(ajv);
  const entities = loadSchema('entities.schema.json');
  validators = {
    nodes: ajv.compile(entities),
    edges: ajv.compile(loadSchema('edges.schema.json')),
    byType: (type: string) => ajv.getSchema(`${entities.$id}#/$defs/${type}`),
  };
  return validators;
}

const MAX_SCHEMA_FINDINGS = 50;

export function validateGraph(graph: Graph): Finding[] {
  const findings: Finding[] = [];
  const v = getValidators();

  for (const [label, validate, doc, items] of [
    ['nodes.json', v.nodes, graph.nodesDoc, graph.nodes],
    ['edges.json', v.edges, graph.edgesDoc, graph.edges],
  ] as const) {
    if (!validate(doc)) {
      // A node failing the Node oneOf reports errors for every type; re-check failing nodes
      // against their own type definition so the message names the real problem.
      const raw = validate.errors ?? [];
      const failing = new Set<number>();
      for (const e of raw) {
        const m = /^\/nodes\/(\d+)/.exec(e.instancePath);
        if (label === 'nodes.json' && m) failing.add(Number(m[1]));
      }
      const errors: typeof raw = raw.filter(
        (e) => !(label === 'nodes.json' && /^\/nodes\/\d+/.test(e.instancePath)),
      );
      for (const i of failing) {
        const node = graph.nodes[i]!;
        const own = v.byType(node.type);
        if (own && !own(node))
          for (const e of own.errors ?? [])
            errors.push({ ...e, instancePath: `/nodes/${i}${e.instancePath}` });
      }
      for (const e of errors.slice(0, MAX_SCHEMA_FINDINGS)) {
        const idx = /^\/(?:nodes|edges)\/(\d+)/.exec(e.instancePath)?.[1];
        const item = idx ? (items as { id: string }[])[Number(idx)] : undefined;
        findings.push({
          level: 'error',
          where: `${label}${item ? ` ${item.id}` : ''} ${e.instancePath}`,
          message: `schema: ${e.message ?? e.keyword}${e.params ? ' ' + JSON.stringify(e.params) : ''}`,
        });
      }
      if (errors.length > MAX_SCHEMA_FINDINGS)
        findings.push({
          level: 'error',
          where: label,
          message: `${errors.length - MAX_SCHEMA_FINDINGS} more schema errors not shown`,
        });
    }
  }

  // V2: ids unique across the whole graph.
  const ids = new Map<string, string>();
  for (const n of graph.nodes) {
    if (ids.has(n.id))
      findings.push({
        level: 'error',
        where: n.id,
        message: `duplicate node id (also a ${ids.get(n.id)})`,
      });
    ids.set(n.id, n.type);
  }
  const edgeIds = new Set<string>();
  for (const e of graph.edges) {
    if (edgeIds.has(e.id))
      findings.push({ level: 'error', where: e.id, message: 'duplicate edge id' });
    edgeIds.add(e.id);
    // V3: every endpoint resolves and has the declared type.
    for (const [end, type] of [
      [e.source, e.source_type],
      [e.target, e.target_type],
    ] as const) {
      const actual = ids.get(end);
      if (!actual)
        findings.push({
          level: 'error',
          where: e.id,
          message: `${e.type} endpoint ${end} does not exist`,
        });
      else if (actual !== type)
        findings.push({
          level: 'error',
          where: e.id,
          message: `${e.type} endpoint ${end} is a ${actual}, edge says ${type}`,
        });
    }
  }
  return findings;
}
