import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from '../paths.ts';

export interface Finding {
  level: 'error' | 'warn' | 'info';
  where: string;
  message: string;
}

const FILE = join(DATA_DIR, 'KNOWN-ISSUES.md');

/**
 * Replace one stage's section inside the generated block of data/KNOWN-ISSUES.md.
 * Hand-written text outside the markers is never touched.
 */
export function writeKnownIssues(stage: string, findings: Finding[]) {
  const doc = readFileSync(FILE, 'utf8');
  const start = '<!-- generated:start -->';
  const end = '<!-- generated:end -->';
  const [before, rest = ''] = doc.split(start);
  const [block = '', after = ''] = rest.split(end);
  const sections = new Map<string, string>();
  for (const m of block.matchAll(/^### stage: (\S+)\n([\s\S]*?)(?=^### stage: |$(?![\s\S]))/gm))
    sections.set(m[1]!, m[2]!.trimEnd());
  const body = findings.length
    ? findings.map((f) => `- **${f.level}** \`${f.where}\`: ${f.message}`).join('\n')
    : '- none';
  sections.set(stage, `${findings.length} finding(s).\n\n${body}`);
  const rendered = [...sections.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([s, b]) => `### stage: ${s}\n${b}`)
    .join('\n\n');
  writeFileSync(FILE, `${before}${start}\n${rendered}\n${end}${after}`);
}
