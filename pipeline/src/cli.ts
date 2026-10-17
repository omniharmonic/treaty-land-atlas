#!/usr/bin/env node
// Entry point for every `npm run data:*` command. Run: tsx pipeline/src/cli.ts <command>
import { loadAllTables } from './ingest/csv.ts';
import { writeKnownIssues } from './report/known-issues.ts';

const [command, ...args] = process.argv.slice(2);

async function ingest() {
  const tables = loadAllTables();
  let errorCount = 0;
  console.log('Table'.padEnd(16), 'Rows'.padStart(5), 'Expected'.padStart(9), 'Errors'.padStart(7));
  for (const t of tables) {
    const ok = t.rows.length === t.spec.expectedRows ? '' : '  <- count changed';
    console.log(
      t.name.padEnd(16),
      String(t.rows.length).padStart(5),
      String(t.spec.expectedRows).padStart(9),
      String(t.errors.length).padStart(7),
      ok,
    );
    errorCount += t.errors.length;
  }
  for (const t of tables)
    for (const e of t.errors)
      console.log(`  ${e.file}:${e.line} ${e.rowId ?? ''} [${e.column}] ${e.message}`);
  writeKnownIssues(
    'ingest',
    tables
      .flatMap((t) => t.errors)
      .map((e) => ({
        level: 'error',
        where: `${e.file}:${e.line}${e.rowId ? ` (${e.rowId})` : ''}`,
        message: `${e.column}: ${e.message}`,
      })),
  );
  if (errorCount) {
    console.error(`\n${errorCount} row error(s). Fix the CSV rows listed above.`);
    process.exitCode = 1;
  } else console.log('\nAll tables parsed with no row errors.');
}

const commands: Record<string, (args: string[]) => Promise<void>> = { ingest };

const run = command ? commands[command] : undefined;
if (!run) {
  console.log(`not implemented yet: ${command ?? '(no command)'}`);
  console.log(`Available: ${Object.keys(commands).join(', ')}`);
} else {
  await run(args);
}
