// data/suppress.yaml: the removal fast lane (J3 s.7.4). Listed ids disappear from every public file.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { DATA_DIR } from '../paths.ts';

const suppressSchema = z.array(
  z.strictObject({
    id: z.string().min(1),
    reason: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    requested_by_role: z.string().optional(),
  }),
);

export type Suppression = z.infer<typeof suppressSchema>[number];

export function loadSuppressions(file = join(DATA_DIR, 'suppress.yaml')): Suppression[] {
  if (!existsSync(file)) return [];
  const raw = parseYaml(readFileSync(file, 'utf8')) ?? [];
  return suppressSchema.parse(raw);
}
