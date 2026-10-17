// License registry, gate table (J4 s.4) and NOTICE.md generation (V9).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { DATA_DIR, ROOT } from '../paths.ts';
import type { Finding } from '../report/known-issues.ts';

const STATUS = z.enum(['pending', 'cleared', 'blocked', 'not_used']);

const sourceSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  used_in: z.array(z.string()),
  license_stated: z.string().min(1),
  conflict: z.boolean(),
  status: STATUS,
  evidence: z.string().nullable(),
  evidence_note: z.string().optional(),
  attribution_text: z.string().min(1),
  required_notices: z.array(z.string()),
  gate: z.string().regex(/^G-\d{2}$/),
});

const gateSchema = z.strictObject({
  id: z.string().regex(/^G-\d{2}$/),
  kind: z.enum(['license', 'content']),
  title: z.string().min(1),
  blocks: z.string().min(1),
  // Content gates carry their own status; license gates derive it from their sources.
  status: STATUS.optional(),
});

export const registrySchema = z.strictObject({
  sources: z.array(sourceSchema),
  gates: z.array(gateSchema),
});

export type Registry = z.infer<typeof registrySchema>;
export type GateStatus = z.infer<typeof STATUS>;

export function loadRegistry(file = join(DATA_DIR, 'licenses', 'registry.yaml')): Registry {
  return registrySchema.parse(parseYaml(readFileSync(file, 'utf8')));
}

export interface GateRow {
  id: string;
  title: string;
  kind: string;
  status: GateStatus;
  sources: string[];
  blocks: string;
}

/** A license gate is the worst status among its used sources; unused sources never block. */
export function gateTable(reg: Registry): GateRow[] {
  const order: GateStatus[] = ['blocked', 'pending', 'cleared', 'not_used'];
  return reg.gates.map((g) => {
    const srcs = reg.sources.filter((s) => s.gate === g.id);
    let status: GateStatus;
    if (g.kind === 'content') status = g.status ?? 'pending';
    else {
      const used = srcs.filter((s) => s.status !== 'not_used');
      status = used.length
        ? order.find((o) => used.some((s) => s.status === o))!
        : srcs.length
          ? 'not_used'
          : 'pending';
    }
    return {
      id: g.id,
      title: g.title,
      kind: g.kind,
      status,
      sources: srcs.map((s) => s.id),
      blocks: g.blocks,
    };
  });
}

/** V9: registry integrity, and production readiness of every gate. */
export function checkLicenses(
  reg: Registry,
  mode: 'preview' | 'production',
  layersInBuild: string[] = [],
): Finding[] {
  const findings: Finding[] = [];
  const gateIds = new Set(reg.gates.map((g) => g.id));
  for (const s of reg.sources) {
    if (!gateIds.has(s.gate))
      findings.push({
        level: 'error',
        where: `registry ${s.id}`,
        message: `unknown gate ${s.gate}`,
      });
    if (s.status === 'cleared' && !s.evidence)
      findings.push({
        level: 'error',
        where: `registry ${s.id}`,
        message: 'cleared without evidence',
      });
    if (s.status === 'not_used' && s.used_in.length)
      findings.push({
        level: 'error',
        where: `registry ${s.id}`,
        message: 'not_used but used_in is not empty',
      });
  }
  for (const layer of layersInBuild) {
    if (!reg.sources.some((s) => s.used_in.includes(layer)))
      findings.push({
        level: 'error',
        where: layer,
        message: 'layer in the build has no license registry entry',
      });
  }
  for (const g of gateTable(reg)) {
    if (g.status === 'pending' || g.status === 'blocked')
      findings.push({
        level: mode === 'production' ? 'error' : 'warn',
        where: g.id,
        message: `${g.title}: ${g.status} (blocks ${g.blocks})`,
      });
  }
  return findings;
}

export function renderGateTable(rows: GateRow[]): string {
  const head = '| Gate | Kind | Status | Title | Sources | Blocks |\n|---|---|---|---|---|---|';
  return [
    head,
    ...rows.map(
      (r) =>
        `| ${r.id} | ${r.kind} | ${r.status} | ${r.title} | ${r.sources.join(', ') || '-'} | ${r.blocks} |`,
    ),
  ].join('\n');
}

export function writeNotice(reg: Registry, file = join(ROOT, 'NOTICE.md')) {
  const used = reg.sources.filter((s) => s.status !== 'not_used');
  const body = [
    '# Notices and attributions',
    '',
    'Generated from `data/licenses/registry.yaml` by `npm run release:check`. Do not edit by hand.',
    '',
    'Created by Benjamin Life (@omniharmonic). Code: MIT (`LICENSE`). Text and data: CC BY 4.0 (`LICENSE-DATA.md`).',
    '',
    ...used.flatMap((s) => [
      `## ${s.name}`,
      '',
      s.attribution_text,
      '',
      `- Terms as stated: ${s.license_stated}`,
      `- Status: ${s.status}${s.conflict ? ' (terms conflict noted)' : ''}`,
      ...(s.required_notices.length
        ? [`- Required notices: ${s.required_notices.join('; ')}`]
        : []),
      '',
    ]),
  ].join('\n');
  writeFileSync(file, body.trimEnd() + '\n');
}
