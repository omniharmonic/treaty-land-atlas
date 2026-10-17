import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { TABLES, type TableName, type TableSpec } from '../schema/tables.ts';
import { nfc } from '../normalize/index.ts';
import { ROOT } from '../paths.ts';

export interface RowError {
  table: string;
  file: string;
  /** 1-based line of the row's first line in the file (header is line 1). */
  line: number;
  rowId: string | null;
  column: string;
  message: string;
}

export interface LoadedTable {
  name: string;
  spec: TableSpec;
  header: string[];
  rows: Record<string, string>[];
  errors: RowError[];
}

/** Read a CSV into objects keyed by header. Handles quotes, commas and newlines inside fields. */
export function readCsv(path: string): {
  header: string[];
  rows: { line: number; record: Record<string, string> }[];
} {
  const text = readFileSync(path, 'utf8');
  const raw = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text; // strip a byte-order mark
  // With `info: true` csv-parse returns { info, record } per row; its typings do not model that.
  const records = parse(raw, {
    relax_column_count: true,
    info: true,
    skip_empty_lines: true,
  }) as unknown as { info: { lines: number }; record: string[] }[];
  const [head, ...body] = records;
  if (!head) return { header: [], rows: [] };
  const header = head.record.map((h) => h.trim());
  return {
    header,
    rows: body.map(({ info, record }) => {
      const obj: Record<string, string> = {};
      header.forEach((col, i) => (obj[col] = nfc(record[i] ?? '').trim()));
      if (record.length > header.length) obj['__extra__'] = record.slice(header.length).join(',');
      // csv-parse reports the line where the record ends; store that for messages.
      return { line: info.lines, record: obj };
    }),
  };
}

export function loadTable(name: TableName, seedDir = join(ROOT, 'seed-data')): LoadedTable {
  const spec: TableSpec = TABLES[name];
  const file = join(seedDir, spec.file);
  const { header, rows } = readCsv(file);
  const errors: RowError[] = [];
  const seen = new Map<string, number>();
  const out: Record<string, string>[] = [];
  for (const { line, record } of rows) {
    const rowId = spec.idColumn ? (record[spec.idColumn] ?? null) : null;
    const result = spec.schema.safeParse(record);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          table: name,
          file: spec.file,
          line,
          rowId,
          column:
            issue.path.join('.') ||
            (issue.code === 'unrecognized_keys' ? issue.keys.join(',') : '(row)'),
          message: issue.message,
        });
      }
    }
    if (rowId) {
      if (seen.has(rowId)) {
        errors.push({
          table: name,
          file: spec.file,
          line,
          rowId,
          column: spec.idColumn!,
          message: `duplicate id (first seen on line ${seen.get(rowId)})`,
        });
      } else seen.set(rowId, line);
    }
    out.push(record);
  }
  return { name, spec, header, rows: out, errors };
}

export function loadAllTables(seedDir?: string): LoadedTable[] {
  return (Object.keys(TABLES) as TableName[]).map((n) => loadTable(n, seedDir));
}
