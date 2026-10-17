import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadAllTables, loadTable, readCsv } from '../src/ingest/csv.ts';
import { TABLES, type TableName } from '../src/schema/tables.ts';
import { SEED_DIR } from '../src/paths.ts';

describe('seed tables', () => {
  const tables = loadAllTables();

  it.each(Object.entries(TABLES))('%s has the expected row count', (name, spec) => {
    const t = tables.find((x) => x.name === name)!;
    expect(t.rows.length).toBe(spec.expectedRows);
  });

  it('every table parses with no row errors', () => {
    expect(tables.flatMap((t) => t.errors)).toEqual([]);
  });

  it('headers exactly match the schema columns', () => {
    for (const t of tables) {
      const shape = Object.keys(
        (TABLES[t.name as TableName].schema as unknown as { shape: object }).shape,
      );
      expect(t.header).toEqual(shape);
    }
  });
});

describe('CSV parsing', () => {
  it('handles quotes, commas and newlines inside fields', () => {
    const dir = mkdtempSync(join(tmpdir(), 'csv-'));
    const file = join(dir, 'x.csv');
    writeFileSync(file, 'a,b\n"one, two","line1\nline2 ""quoted"""\nplain,Dakȟóta\n');
    const { rows } = readCsv(file);
    expect(rows.map((r) => r.record)).toEqual([
      { a: 'one, two', b: 'line1\nline2 "quoted"' },
      { a: 'plain', b: 'Dakȟóta' },
    ]);
  });
});

describe('row errors', () => {
  it('reports a broken row with file, line, id, column and message', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seed-'));
    cpSync(SEED_DIR, dir, { recursive: true });
    const file = join(dir, 'cases-seed.csv');
    const lines = readFileSync(file, 'utf8').split(/(?<=\n)/);
    lines[1] = lines[1]!.replace(/,U\.S\. Supreme Court,1810,/, ',U.S. Supreme Court,18x0,');
    writeFileSync(file, lines.join(''));
    const t = loadTable('cases', dir);
    expect(t.errors).toHaveLength(1);
    expect(t.errors[0]).toMatchObject({
      file: 'cases-seed.csv',
      line: 2,
      rowId: 'case-fletcher-v-peck-1810',
      column: 'year',
      message: 'expected a four-digit year',
    });
  });

  it('flags duplicate ids', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seed-'));
    cpSync(SEED_DIR, dir, { recursive: true });
    const file = join(dir, 'nara-ratified-treaties-index.csv');
    const text = readFileSync(file, 'utf8');
    const second = text.split(/\r?\n/)[1]!;
    writeFileSync(file, text.trimEnd() + '\r\n' + second + '\r\n');
    expect(loadTable('nara', dir).errors.map((e) => e.message)).toEqual([
      'duplicate id (first seen on line 2)',
    ]);
  });
});
