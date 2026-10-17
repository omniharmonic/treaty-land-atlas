// Overlays (J3 s.1): Markdown files with YAML front matter under data/overlays/<kind>/<id>.md,
// one per node id, carrying narrative, content warnings and review metadata.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { DATA_DIR } from '../paths.ts';
import type { Finding } from '../report/known-issues.ts';

export const overlaySchema = z.strictObject({
  id: z.string().min(1),
  ai_assisted: z.boolean(),
  content_warnings: z.array(z.string()).default([]),
  sensitivity: z.enum(['public', 'public_landmark_from_treaty_text', 'restricted']).optional(),
  legal_review: z
    .strictObject({
      signed_off_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      reviewer_role: z.string().min(1),
    })
    .optional(),
  sources: z
    .array(
      z.union([
        z.string(),
        z.strictObject({
          url: z.string(),
          title: z.string().optional(),
          quote: z.string().optional(),
        }),
      ]),
    )
    .default([]),
  // research interpretation fields (2026-10-17 narrative wave)
  headline: z.string().optional(),
  how: z.string().optional(),
  how_basis: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  cautions: z.string().optional(),
  written_by: z.string().optional(),
});

export type Overlay = z.infer<typeof overlaySchema> & { body: string; file: string };

export function loadOverlays(dir = join(DATA_DIR, 'overlays')): {
  overlays: Map<string, Overlay>;
  findings: Finding[];
} {
  const overlays = new Map<string, Overlay>();
  const findings: Finding[] = [];
  if (!existsSync(dir)) return { overlays, findings };
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory()
        ? walk(p)
        : p.endsWith('.md') && f !== 'README.md'
          ? [p]
          : [];
    });
  for (const file of walk(dir)) {
    const rel = relative(DATA_DIR, file);
    const text = readFileSync(file, 'utf8').normalize('NFC');
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
    if (!m) {
      findings.push({ level: 'error', where: rel, message: 'missing YAML front matter' });
      continue;
    }
    let front: unknown;
    try {
      front = parseYaml(m[1]!);
    } catch (err) {
      findings.push({
        level: 'error',
        where: rel,
        message: `front matter is not valid YAML: ${err}`,
      });
      continue;
    }
    const parsed = overlaySchema.safeParse(front);
    if (!parsed.success) {
      for (const issue of parsed.error.issues)
        findings.push({
          level: 'error',
          where: rel,
          message: `${issue.path.join('.')}: ${issue.message}`,
        });
      continue;
    }
    if (overlays.has(parsed.data.id)) {
      findings.push({
        level: 'error',
        where: rel,
        message: `second overlay for ${parsed.data.id}`,
      });
      continue;
    }
    overlays.set(parsed.data.id, { ...parsed.data, body: m[2]!.trim(), file: rel });
  }
  return { overlays, findings };
}
