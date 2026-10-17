// Checks every source URL in the graph (build/nodes.json) and every overlay source, and writes
// build/link-report.json and a summary. Read-only; polite: 6 at a time, one retry, 20 s timeout.
// Run: node scripts/check-links.mjs
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const nodes = JSON.parse(readFileSync('build/nodes.json', 'utf8')).nodes;
const urls = new Map(); // url -> ids
const add = (u, id) => {
  if (!/^https?:\/\//.test(u ?? '')) return;
  (urls.get(u) ?? urls.set(u, []).get(u)).push(id);
};
for (const n of nodes) if (n.type === 'Source') add(n.url, n.id);
const walk = (d) =>
  readdirSync(d).flatMap((f) =>
    statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)],
  );
for (const f of walk('data/overlays').filter(
  (f) => f.endsWith('.md') && !f.endsWith('README.md'),
)) {
  const id = f.split('/').pop().replace(/\.md$/, '');
  for (const m of readFileSync(f, 'utf8').matchAll(/"url": ?"([^"]+)"/g)) add(m[1], id);
}
const UA = 'Mozilla/5.0 (compatible; landback.land link check; +https://landback.land/methods/)';
async function check(u) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(u, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'user-agent': UA },
        signal: AbortSignal.timeout(20000),
      });
      res.body?.cancel();
      if (res.ok || attempt === 1)
        return { status: res.status, final: res.url !== u ? res.url : undefined };
    } catch (e) {
      if (attempt === 1) return { status: 0, error: String(e.cause?.code ?? e.name) };
    }
  }
}
const list = [...urls.keys()];
const out = {};
let i = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (i < list.length) {
      const u = list[i++];
      out[u] = { ...(await check(u)), ids: urls.get(u) };
    }
  }),
);
writeFileSync('build/link-report.json', JSON.stringify(out, null, 1));
const bad = Object.entries(out).filter(([, r]) => !(r.status >= 200 && r.status < 400));
const by = {};
for (const [, r] of bad) by[r.status || r.error] = (by[r.status || r.error] ?? 0) + 1;
console.log(`${list.length} URLs; ${bad.length} not OK:`, by);
