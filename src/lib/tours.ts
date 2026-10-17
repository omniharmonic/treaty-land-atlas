import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface Beat {
  title: string;
  text: string;
  records?: string[];
  map?: { y?: number; v?: string; cut?: number; sel?: string | null };
}
export interface Tour {
  id: string;
  title: string;
  question: string;
  summary: string;
  content_warnings: string[];
  nations: string[];
  review: string;
  beats: Beat[];
}

export function tours(): Tour[] {
  const dir = join(process.cwd(), 'data', 'tours');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => parse(readFileSync(join(dir, f), 'utf8')) as Tour);
}

export function mapHash(m: Beat['map']): string {
  if (!m) return '';
  const p = new URLSearchParams();
  if (m.y) p.set('y', String(m.y));
  if (m.v) p.set('v', m.v);
  if (m.cut) p.set('cut', String(m.cut));
  if (m.sel) p.set('sel', m.sel);
  return `#${p.toString()}`;
}
