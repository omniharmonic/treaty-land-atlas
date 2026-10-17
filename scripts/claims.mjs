#!/usr/bin/env node
// Read claim and correction requests from the private Vercel Blob store.
// First time:  (cd relay && vercel env pull)   then:  npm run claims
import { readFileSync, existsSync } from 'node:fs';
import { list, get } from '@vercel/blob';

const envFile = 'relay/.env.local';
if (existsSync(envFile))
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^([A-Z_]+)="?(.*?)"?$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('No Blob credentials. Run: (cd relay && vercel env pull) and try again.');
  process.exit(1);
}
const { blobs } = await list({ prefix: 'claims/' });
if (!blobs.length) console.log('No claims yet.');
for (const b of blobs.sort((a, z) => String(z.uploadedAt).localeCompare(String(a.uploadedAt)))) {
  const r = await get(b.pathname, { access: 'private' });
  const text = await new Response(r.stream).text();
  const c = JSON.parse(text);
  console.log(
    `\n${c.received}  ${c.kind.toUpperCase()}  ${c.nation}${c.record_id ? `  (${c.record_id})` : ''}`,
  );
  console.log(`  role: ${c.role || '-'}   contact: ${c.contact}`);
  if (c.message) console.log(`  ${c.message.replace(/\n/g, '\n  ')}`);
}
