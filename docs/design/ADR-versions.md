---
title: Pinned versions and discrepancies with the J-docs
author: Benjamin Life (@omniharmonic)
date: 2026-10-17
status: living
---

# Pinned versions

Rule: prefer the newest release published at least 14 days before install (cutoff for this install: 2026-10-03), except when a security advisory requires a newer patch.

| Package | Version | Released | Note |
|---|---|---|---|
| Node.js | 22.22.3 (`.nvmrc`) | | Astro requires >= 22.22.0 |
| astro | 7.3.5 | 2026-09-24 | J1 assumed an earlier major; setup steps checked against docs.astro.build on 2026-10-17 |
| @astrojs/svelte | 9.0.1 | 2026-07-01 | |
| svelte | 5.57.1 | 2026-09-18 | |
| typescript | 6.0.3 | | **TypeScript 7.0.2 is "latest"** but `@astrojs/check`, `svelte-check` and `typescript-eslint` only support TS 5–6 |
| vite | 8.1.5 | 2026-07-16 | Pinned explicitly: 8.0.13 (Astro's floor) has two advisories (GHSA-v6wh-96g9-6wx3, GHSA-fx2h-pf6j-xcff) |
| vitest | 5.0.3 | 2026-09-30 | |
| zod | 4.6.5 | 2026-09-13 | |
| eslint | 10.12.0 | 2026-10-02 | |
| typescript-eslint | 8.71.0 | 2026-09-28 | |
| prettier | 3.9.9 | 2026-09-23 | |
| csv-parse | 7.0.3 | 2026-09-25 | |
| yaml | 2.9.1 | 2026-09-11 | |
| tsx | 4.23.15 | 2026-09-20 | |
| Python | 3.9+ (stdlib only) | | `scripts/build_graph.py` runs on 3.9.6 |

## Discrepancies and workarounds

1. **npm crash.** `npm install` (npm 10.9 and 11) fails with `Cannot read properties of null (reading 'edgesOut')` while resolving vitest 5's optional peer list. Workaround: `.npmrc` sets `legacy-peer-deps=true`, and required peers (`vite`, `@types/node`) are listed in `package.json` explicitly.
2. **Native Land Digital.** J2 says Tier 1 (live lookup) needs written permission and a relay so the key is not exposed. The owner decided (2026-10-17) to load NLD data live in the browser and never store it. A key in a static site's JavaScript is readable by anyone; Phase 2 will document this trade-off where the integration is configured.
