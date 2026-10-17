---
title: Claude Code Kickoff Prompts (Phase 1 and Phase 2) and Session Template
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# J6. Claude Code Kickoff Prompts

*Numbers corrected by the Synthesis Agent on 2026-10-16 and updated after the verification correction pass to match `build/graph-build-report.md` (current build: 1,563 nodes, 3,543 edges, Nation 226, proposed 2,345, 29 orphans, 0 schema errors, 106 logged issues). The earlier scratch-run figures (1,529 / 3,476 / 194 / 31 / 12 / 164 / 2,280) are superseded.*

Design Agent J, file 6 of 6. Companions: J1 (architecture), J2 (NLD), J3 (repo/CI), J4 (licensing gates), J5 (roadmap).

**How to use this file (for the owner).** Each prompt below is written to be pasted whole into a fresh Claude Code session started in the project folder. Run one prompt per session. When a session ends, read its report, run the commands it lists, and only then start the next session. If the agent asks you a question, answer it rather than letting it guess. The prompts tell the agent never to send messages to anyone, never to push or change GitHub settings unless you say so, and never to invent facts or citations.

## 0. Before you paste anything (owner checklist, about 30 minutes)

1. Open a terminal in the project folder (`treaty-land-atlas`). The folder is not yet a git repository; the Phase 1 prompt asks the agent to run `git init`, or you can create the GitHub repository first (J5 task P0-02).
2. Decide the GitHub account question (J3 section 6, decision D-02). The prompts say "ask me which account to use before any push", so you can answer in the session. If you use the clawmniharmonic account for agent git operations, authenticate that account on your machine yourself (for example with the GitHub CLI), using a token limited to this one repository. Do not paste tokens into the chat.
3. Make sure Node.js 22 or newer is installed (`node -v`). The Astro version observed on 2026-10-16 requires Node 22.22.0 or newer [verified via npm]. Ask the agent to fix the Node version in the session if yours is older.
4. Confirm that the research files are in place: `docs/00-RESEARCH-BRIEF.md`, `docs/data/`, `docs/research/`, `docs/design/J1` to `J6`, and `seed-data/`.
5. Decide whether you want the agent to commit. The prompts say "commit locally after each task; do not push unless I say so".
6. Keep the Native Land Digital key (if you have one) out of the session. The agent does not need it for Phases 1-2.

---

## 1. Phase 1 kickoff prompt: data pipeline and graph

Paste everything between the lines.

````text
You are the lead engineer for the Treaty Land Atlas, a free educational static website (GitHub Pages) that maps United States treaty law with Native nations over time. You are starting Phase 1: the data pipeline and graph. The project owner is Benjamin Life (@omniharmonic). He is technical but not a developer, so explain what you did in plain language, give him exact commands to run, and ask him when something is ambiguous instead of guessing.

ATTRIBUTION RULE (non-negotiable): the project is attributed to "Benjamin Life (@omniharmonic)". Never write "OpenCivics" or "OpenCivics Labs" anywhere in code, data, page text, comments, or commit messages.

READ FIRST, IN THIS ORDER, before writing code (summarize what you learned in 10 short bullet points, then proceed without waiting):
1. docs/00-RESEARCH-BRIEF.md (principles: accuracy over drama, correct legal vocabulary, source hierarchy, tribal voice, donation integrity, honesty about uncertainty)
2. docs/design/J1-architecture-decision-records.md (stack and data decisions: Astro static + TypeScript, Svelte islands, MapLibre, GeoJSON, Pagefind; ADR-007 is the data pipeline spec)
3. docs/design/J3-repo-ci-and-contribution.md (repository layout, CI, data validation rules V1-V16, licenses registry)
4. docs/design/J4-licensing-and-release-gates.md (license gates; production builds must fail while gates are pending)
5. docs/design/J5-build-roadmap.md, section "Phase 1" (tasks P1-01 to P1-14 with acceptance criteria)
6. docs/design/J2-native-land-integration-spec.md (skim: Phase 1 only needs to know that NLD data must never be fetched, stored, or committed)
6b. EXISTING DESIGN-WAVE WORK YOU MUST REUSE, NOT REBUILD: docs/design/schema/entities.schema.json and edges.schema.json (the graph contract), scripts/build_graph.py (Python 3 standard library; builds build/nodes.json, edges.json, unresolved.json, graph-build-report.md), and the crosswalks/ folder (nation-entities.csv, nation-aliases.csv, nation-link-overrides.csv, nation-successor-proposals.csv, case-instrument-links.csv, violation-instrument-links.csv, violation-statute-links.csv, campaign-violation-links.csv, case-doctrine-statute-edges.csv, statute-merge.csv). Also read docs/design/H1-graph-data-model.md if it exists. A scratch run of the builder on 2026-10-16 gave 1,563 nodes, 3,543 edges, 29 orphans, 0 schema errors, 106 logged issues, and no edge with status accepted.
7. seed-data/README-treaties.md, seed-data/README-land-back-seed.md, seed-data/README-case-law-and-statutes.md, and the header row plus 5 sample rows of each CSV in seed-data/
8. docs/data/E2-geodata-source-inventory.md and docs/research/A3-geospatial-and-treaty-datasets.md (USFS Royce layer facts: 718 vs 752 polygons disputed; seven cession IDs without geometry: 47, 65, 128, 129, 130, 543, 690; fields cessnum and cessdate1 to cessdate5)

HARD CONSTRAINTS
- Do not invent facts. Do not invent case names, citations, dates, treaty details, organization names, URLs, endonyms (nations' own names), federal recognition status, or successor-nation relationships. If data is missing, leave it blank and record it in data/KNOWN-ISSUES.md.
- Do not "fix" seed data silently. The CSVs in seed-data/ are canonical research output; the graph schema, build_graph.py, and crosswalks/ are existing design-wave work that you extend carefully with tests. If you believe a row is wrong, write it to data/KNOWN-ISSUES.md with the row id and reason; do not edit the CSV unless the owner asks.
- Do not contact anyone, send email, post messages, or call the Native Land Digital API. Do not download anything from native-land.ca. Do not use or request any API keys. Never put secrets in the repo.
- Do not push to any remote, create GitHub repositories, change GitHub settings, or open pull requests unless the owner tells you to. Commit locally after each task with a Conventional Commit message (feat:, fix:, data:, docs:, chore:). At the start, ask the owner which GitHub account and git identity to use for commits (the owner's convention may be the clawmniharmonic account, but ask; do not assume). End commit messages with the attribution trailer(s) your environment specifies for commits.
- Do not rely on remembered framework APIs. For Astro, Svelte, Zod, Mapshaper, and Playwright, read the CURRENT official documentation (use web fetch or the package README) before using them, and record the exact installed versions in docs/design/ADR-versions.md. Prefer package versions released at least 14 days ago. If something in the J-docs conflicts with current documentation, follow current documentation and note the discrepancy in docs/design/ADR-versions.md.
- Generated outputs (build/, public/data/, dist/) are git-ignored. Raw upstream downloads are not committed (only data/sources/manifest.json is).
- Use TypeScript strict mode. Keep every task small, tested, and reviewable. No placeholder code that pretends to work: stubs must print "not implemented yet".
- Text must be UTF-8 and Unicode NFC. Never fold or strip diacritics in stored data.
- Plain language in README and error messages. The owner must be able to run the commands you document.

NETWORK NOTE: some hosts may be unreachable from your sandbox (the earlier research sandbox could not reach native-land.ca or some federal hosts). If a download fails, do not work around it with unofficial mirrors. Implement the --from-dir fallback, mark the task "blocked on network", tell the owner the exact command to run on his machine, and continue with the tasks that do not need the download.

WORK PLAN: do these tasks in order, one at a time. After each task: run lint, typecheck, and tests; commit; print a 5-line status (what changed, how to verify, what is next). Stop and ask the owner only when a decision is needed (list the decision and your recommended default).

P1-01 Scaffold the repository per J3 section 1 (only needed folders; keep the existing crosswalks/, scripts/build_graph.py, and docs/design/ as they are; confirm python3 is available), Astro static + TypeScript strict + Svelte integration using the current official setup, ESLint/Prettier, vitest, .nvmrc, .editorconfig, .gitignore, npm scripts (lint, typecheck, test:unit, data:ingest, data:validate, data:build, build, preview, release:check; unimplemented ones print "not implemented yet"). Add README.md (credit Benjamin Life (@omniharmonic)), CONTRIBUTING.md stub, seed-data/CANONICAL.md (says these CSVs are the editable source until the verification wave closes; do not rename the folder), docs/design/ADR-versions.md, a minimal .github/workflows/ci.yml (lint, typecheck, unit tests, build), and scripts/check-attribution.mjs (fails if the string OpenCivics appears in src/, public/, data/overlays/, README.md; include a test that proves it fails when inserted). Home page placeholder with footer "Created by Benjamin Life (@omniharmonic)". Acceptance: on a clean clone, npm ci && npm run lint && npm run typecheck && npm run test:unit && npm run build all pass.

P1-02 Zod schemas and CSV loaders in pipeline/src/ for all tables in seed-data/ (treaties-seed 21 columns, nara-ratified-treaties-index, cases-seed, statutes-seed, violations-seed, violations-seed-notes, organizations-seed, campaigns-seed, tribe-org-map, policy-eras-seed, geodata-sources). Robust CSV parsing (quotes, commas, newlines inside fields). npm run data:ingest prints per-table counts and row-level errors. Expected data-row counts: treaties 135, NARA 376, cases 104, statutes 51, violations 62, violation notes 62, organizations 67, campaigns 42, tribe-org-map 86, policy eras 9, geodata sources 24. Assert these in a unit test. Do not modify source data. Write generated findings to data/KNOWN-ISSUES.md.

P1-03 Normalization utilities (NFC, trim, ; splitting, partial ISO dates YYYY / YYYY-MM / YYYY-MM-DD with precision, inline tag parser for [verified] [from-memory] [disputed] [unverified] returning flags plus a cleaned string, ID pattern checks) with thorough unit tests including diacritics, combining marks, and partial dates.

P1-04 Adopt and triage the existing graph builder and nation crosswalks (do NOT rebuild them). Add npm run graph:build (runs python3 scripts/build_graph.py). Read build/graph-build-report.md and build/unresolved.json. For each schema error (the current build reports 0; an earlier scratch run reported 12) decide where the fix belongs: a seed row (log in data/KNOWN-ISSUES.md; do not edit seeds), a crosswalk (edit the crosswalk), the builder (small tested patch), or the schema (version bump; never weaken NodeCommonRules). Review nation-entities.csv, nation-aliases.csv, and nation-link-overrides.csv for obvious mistakes only; everything about endonyms, recognition status, and successors stays unreviewed/proposed; list items needing a human in a short review file for the owner. Acceptance: reproducible graph build; schema errors zero or each documented; no seed CSV modified.

P1-05 Link coverage: report proposed links by status and basis, violations/cases with no instrument link, instruments with no nation edge. Do not promote any edge to accepted by yourself (only humans accept). Build a small CLI (npm run links:review) that shows the next 20 proposed links with basis and sources and writes human decisions (accepted/rejected, reviewer_role, date) into the crosswalk; test the round trip on a fixture; reviewed decisions must persist across reruns.

P1-06 Validation harness and lite emit: validate build/nodes.json and edges.json with Ajv (2020-12) against docs/design/schema/; implement V2, V3, V12 (determinism). Emit public/data/graph-lite.json (target <= 400 KB gzip), public/data/entities/<type>/<id>.json (node plus 1-hop neighbors), tables/instruments-lite.json, tables/timeline-events.json, and manifest.json. Never copy the raw nodes.json/edges.json to public/. Strip timestamps so two emits are byte-identical.

P1-07 Review ledger, suppression, overlays, publishability: add crosswalks/tribal-review-ledger.csv (node_id, status, scope, date, reviewer_role, record_id, notes; statuses exactly the schema enum) and a small tested patch to build_graph.py so it sets tribal_review and publication from the ledger (default remains not_yet_contacted and narrative_allowed=false; silence is never consent). Add data/suppress.yaml handling at emit, the overlay loader for data/overlays/**/*.md with schemas (narrative, content_warnings, ai_assisted, legal_review), the publishability filter (organizations with confidence=low never published; nation-specific nodes record-only unless the ledger says otherwise; suppressed ids absent from graph-lite, entity JSON, and search metadata), and citation/confidence rules V5/V6/V8. Fixture tests for each rule.

P1-08 USFS fetch/restore/inventory (network). Implement data:fetch usfs (paginate the ArcGIS REST service named in docs/data/E2 and docs/research/A3, handle exceededTransferLimit, polygons as GeoJSON from layer 1 and the attribute table from layer 2), --from-dir fallback, SHA-256 manifest at data/sources/manifest.json, and data:restore (downloads pinned files from this repo's own GitHub Release asset; implement the logic but do not create releases). Generate build/usfs-field-inventory.md listing every attribute and null counts, the ACTUAL polygon count, which cession IDs lack geometry, whether any field distinguishes cession from reservation, and the format of cessdate1-5. Append findings to data/PROVENANCE.md and compare with E2/A3. If the network blocks you, mark blocked and give the owner the exact command.

P1-09 Geometry pipeline per ADR-004 and ADR-006: reproject to WGS84 if needed, repair invalid geometry, derive t_first/t_last/dates (decimal years) and legal_type (from Kappler, statute, and executive-order link fields; record legal_type_basis), default tier T3, keep geometry_role as "unverified" unless the data says otherwise, join events into cession-events.<hash>.json, simplify with Mapshaper at a configured tolerance, quantize to 4-5 decimals, drop unused properties, write PROVENANCE row (tool, version, parameters, source checksum). Express each cession as a GeoFeature record valid against docs/design/schema/entities.schema.json (read its GeoFeature definition; id pattern geo-royce-<cessnum>). The seven IDs without geometry become events-only records with geometry_quality "missing". Files use the .json extension (not .geojson). Report gzip size against the 2 MB budget; if over, report the options (tolerance, TopoJSON) rather than silently degrading quality. Keep the unsimplified file as a local artifact for the owner to upload as a Release asset.

P1-10 Royce-to-instrument crosswalk: parse Kappler links from the USFS attribute table into volume/page citations and match to treaties-seed (kappler_cite, date_signed) and the NARA index. Mark a match "proposed" only when two independent keys agree, otherwise "candidate"; never set "accepted" (only humans do). Write crosswalks/instrument-royce.csv with basis and status, add royce_cession_number to published instrument entities, and report matched/unmatched counts and USFS rows with no seed instrument.

P1-11 Census AIANNH "today" layer (network): fetch the current-vintage Cartographic Boundary AIANNH file at 1:500,000, convert to GeoJSON, keep GEOID/name/class, light simplification, emit today-aiannh.<hash>.json, add provenance and a registry entry that includes the Census statistical-boundary disclaimer. Same network fallback as P1-08.

P1-12 License registry and gates: create data/licenses/registry.yaml containing every item in J4 section 2 (status pending, except items marked not used), implement validation V9, npm run release:check printing the gate table from J4 section 4, generate NOTICE.md from the registry. Acceptance: data:validate --mode=production fails with a readable table of pending gates; --mode=preview passes with warnings.

P1-13 CI for data: extend ci.yml per J3 section 3.1 (restore, validate, determinism, size budget, attribution check, no-NLD check script, gitleaks workflow, dependabot config, data-diff summary in the job summary). A deliberately broken CSV row must fail CI with a readable message. Do not create or modify GitHub settings.

P1-14 Documentation: pipeline/README.md in plain language (how to run, how to add a row, how to read reports), docs/design/data-model.md (the graph as built), first full CONTRIBUTING.md.

DEFINITION OF DONE FOR THIS SESSION: P1-01 through P1-07 and P1-12 complete with passing tests are required. P1-08 through P1-11 should be completed or clearly marked blocked-on-network with exact owner commands. P1-13 and P1-14 if time allows; otherwise list them as next.

FINAL REPORT (print at the end, plain language, under 400 words): what was built; the commands the owner should run to verify (exact); counts (rows per table, nodes, edges, unresolved links, polygons, geometry size gzip); data problems found (point to data/KNOWN-ISSUES.md); every decision you made that the owner should review (with your recommended default); what is blocked and why; what Phase 2 needs from Phase 1; and any place where the J-docs and reality disagreed.
````

---

## 2. Phase 2 kickoff prompt: map and time-slider MVP

Run this only after Phase 1's milestone (M1) is met: `npm run data:build` emits the cession, events, today, and graph files, and `npm run data:validate -- --mode=preview` passes.

````text
You are the lead engineer for the Treaty Land Atlas (free educational static site on GitHub Pages; attribution always "Benjamin Life (@omniharmonic)"; never write "OpenCivics" anywhere). Phase 1 (data pipeline and graph) is complete. You are starting Phase 2: the map and time-slider MVP with Royce cession polygons. The owner is technical but not a developer: explain in plain language and give exact commands.

READ FIRST: docs/00-RESEARCH-BRIEF.md; docs/design/J1-architecture-decision-records.md (ADR-002 Svelte islands, ADR-003 MapLibre, ADR-004 geometry, ADR-005 basemap, ADR-006 time slider, ADR-011 budgets, ADR-012 accessibility, ADR-014 privacy); docs/design/J2-native-land-integration-spec.md (Tier 0 only, sections 1-5 and 9); docs/design/J5-build-roadmap.md "Phase 2" (tasks P2-01 to P2-12); docs/research/G2-counterfactual-map-methodology.md sections 1, 3, 8 (vocabulary, layer model, uncertainty tiers); docs/research/G4-pedagogy-and-narrative-arcs.md sections 3 (time slider designed against the "vanishing" effect); docs/data/E3-static-hosting-and-map-tech-feasibility.md sections 3-4 and 7; docs/design/tokens.css, tokens.json and prototype/index.html (visual identity); pipeline/README.md and docs/design/data-model.md (what Phase 1 built); build/report.md and data/KNOWN-ISSUES.md (current data caveats).

HARD CONSTRAINTS
- No invented facts, citations, names, or dates. All displayed facts come from public/data/*. Where the data has caveats (dates are Royce Schedule dates; seven cessions have no geometry; present-day tribe attribution is under review; polygon count disputed), show the caveat in the UI, do not hide it.
- Use correct legal vocabulary. The slider shows "instrument signed" and "alteration" language, never "stolen" or "land lost". Cessions are labeled as "land the United States recorded as ceded" and the standing note says boundaries are approximate, from Royce's 1899 maps georeferenced by the US Forest Service, not legal descriptions. Never claim Royce polygons show Indigenous territory.
- Native Land Digital: implement only Tier 0 (acknowledgement, attribution, disclaimer, outbound link) and the provider abstraction in J2 section 3. Do NOT fetch any NLD data, call the NLD API, add keys, add a relay, or add any NLD geometry. The production behavior with mode "outlink" must make zero requests to native-land.ca.
- The only third-party host the site may contact at runtime is the basemap provider (OpenFreeMap). No Google Fonts, no analytics, no CDN scripts, no cookies. Fonts are self-hosted (Noto subsets, OFL). Bundle all JavaScript.
- Accessibility is a requirement, not polish (WCAG 2.2 AA): native input type=range for the slider with aria-valuetext; keyboard operation (arrows, PageUp/PageDown, Home/End); previous/next-event buttons and cut-point chips so no dragging is needed; target size at least 24x24 CSS px; focus not hidden behind sticky bars; debounced polite live region (at most one announcement per 800 ms and only when the slider is idle); play/pause is OFF by default, never autoplays, and is disabled when prefers-reduced-motion is set; legal type is encoded with pattern plus outline style plus legend text, never color alone; every map state has a table equivalent; details open in a side panel with focus management (not a map popup).
- Do not rely on remembered APIs: read the CURRENT docs for MapLibre GL JS (check whether global-state expressions and map.setGlobalState exist in the pinned version; if not, use setFilter throttled with requestAnimationFrame), Astro, and Svelte 5 before coding. Record versions and any discrepancy in docs/design/ADR-versions.md.
- Performance budgets (ADR-011): map JS <= 450 KB gzip, cession data <= 2 MB gzip, tick cost p95 <= 16 ms at 4x CPU throttle. Report measurements; if a budget fails, report options instead of silently cutting data quality.
- Do not push, open PRs, create GitHub resources, send messages, or contact anyone unless the owner tells you to. Commit locally after each task (Conventional Commits; end with the attribution trailer(s) your environment specifies). Ask which git identity to use if it has not been set.
- Stage banner: builds with SITE_STAGE=preview (default) must show a "work in progress, not for citation" banner and emit noindex. Do not enable indexing.

WORK PLAN (one task at a time; after each: lint, typecheck, unit tests, relevant Playwright test; commit; 5-line status):

P2-01 Layout shell and design tokens: base layout, header/footer with credit line, skip links, visible focus ring; import the existing tokens from docs/design/tokens.css and tokens.json (do not invent a second palette; use docs/design/prototype/index.html as the layout reference); light/dark/forced-colors support, self-hosted Noto subsets with font-display swap, the href() helper using BASE_URL, stage banner and noindex, stub pages (About, Credits, Privacy, Accessibility). Axe clean; works at 320 px; network assertion shows no external requests on non-map pages.

P2-02 Map island scaffold: /map/ page, dynamic import of maplibre-gl, local public/map/style-atlas.json derived from the OpenFreeMap Positron style (read openfreemap.org/quick_start for the style URL; mute colors and reduce labels; keep their required attribution visible), MapController interface in src/lib/map/, WebGL-unavailable fallback panel with a link to the table view, reserved container height, CSP meta tag with worker-src blob: if needed. Playwright: canvas present and attribution visible; with WebGL disabled the fallback appears.

P2-03 Cession layer, legend, patterns: load the hashed cessions JSON via the manifest (public/data/manifest.json), fill (constant low opacity) and outline layers, pattern fills for legal types registered with map.addImage, dashed T3 edges, hover and selection with feature-state, legend generated from data, standing disclaimer panel.

P2-04 Time slider: Svelte TimeSlider per ADR-006 and ADR-012; domain 1784-1894; decade ticks; modes Cumulative and Window (1/5/10/25 years); cut-point chips from a config file (default 1783 excluded from the Royce domain but listed; 1830, 1851, 1868, 1871, 1887); post-1894 notice; "Show today" button; map binding (global-state expression or throttled setFilter). Playwright keyboard tests; test that the cumulative feature count at 1868 equals an independent count computed from the pipeline's cession-events data; perf test.

P2-05 Events table and text summary: sortable "Events in view" table bound to year, mode, and map bounds, row selection syncs with the map, one-sentence summary above the table. With the map visually hidden a keyboard user can still reach every cession's details.

P2-06 Detail panel: cession number, tribes as named in Royce, present-day tribes per USFS labeled "under review", dates per Royce's Schedule, links to Kappler text/statute/EO (only links present in the data), data-quality flags, uncertainty note, link to Royce original at the Library of Congress (use the URL recorded in docs/data/E2 and verify it resolves), credit line. Focus management test.

P2-07 URL state: hash encoding (y, m, l, c, sel), restore on load, copy-link button, safe parsing of bad input. Round-trip tests.

P2-08 Today layer: Census AIANNH layer with toggle; default on after 1894; one-click "Show today"; disclaimer text; note that endonyms are not yet confirmed.

P2-09 Territory context provider, Tier 0, per J2 sections 3-5 and 9: types.ts, config.ts, registry.ts, NoneProvider, OutlinkProvider, TerritoryContextPanel.svelte, integrations.config.json (mode outlink, permission.granted false, outlink.templateVerified false so the link falls back to https://native-land.ca/), ESLint no-restricted-imports for geometry libraries inside src/integrations/territory/, and tests: permission gate, disabled-mode network assertion (zero requests to native-land.ca), no-NLD-data script.

P2-10 Instruments track under the slider (first of the four tracks in G4 section 3.1): HTML list of instruments by year from the instruments data, each linking to its entity JSON/page stub, keyboard reachable.

P2-11 Budgets and checks: scripts/size-budget.mjs, Playwright performance test, axe on /map/, Lighthouse mobile notes in docs/release/perf-<date>.md. Test whether the built .json files are served compressed (local gzip check now; the owner will confirm on GitHub Pages later) and record the result.

P2-12 Private preview delivery: ci.yml uploads dist/ as a short-retention artifact; document npm run preview in README for the owner.

DEFINITION OF DONE FOR THIS SESSION: P2-01 to P2-07 complete and passing. Continue to P2-08 to P2-12 if time allows and list the rest as next.

FINAL REPORT (plain language, under 400 words): what the owner can now do on /map/ (step-by-step demo script with exact commands: npm run build && npm run preview); measured sizes and timings versus budgets; accessibility test results; data caveats surfaced in the UI; decisions made for the owner to review (with recommended defaults); anything blocked; discrepancies between the J-docs and reality; next tasks.
````

---

## 3. Reusable session template (Phases 3-7)

For later phases, paste this template and fill the brackets. It keeps every session small and consistent.

````text
You are continuing work on the Treaty Land Atlas (attribution: Benjamin Life (@omniharmonic); never "OpenCivics"). Current phase: [PHASE]. Task ids for this session: [e.g., P3-01 and P3-02].

READ: docs/00-RESEARCH-BRIEF.md; docs/design/J1 (ADRs relevant to these tasks: [list]); docs/design/J5 section for [PHASE] (copy the acceptance criteria into your plan); [other docs: G2 / G3 / G4 / F4 sections that apply]; pipeline/README.md; docs/design/data-model.md; data/KNOWN-ISSUES.md; docs/release/gates.md.

RULES: no invented facts or citations; correct legal vocabulary; defer to nations' own names and accounts; no nation-specific narrative unless its review_status allows it (G3 s.3.3) and never from model output alone; respect data/suppress.yaml; WCAG 2.2 AA; budgets in ADR-011; do not call Native Land Digital; no pushes, PRs, GitHub settings changes, or outreach unless the owner says so; read current docs for any framework API before using it; commit locally per task with Conventional Commits and the attribution trailer(s) your environment specifies.

DELIVER: the tasks above with tests; update docs/design/ADR-versions.md if versions changed; update data/KNOWN-ISSUES.md if you find data problems; then print a plain-language report under 300 words: what changed, exact verification commands, decisions for the owner (with recommended defaults), blockers, and next tasks.
````

---

## 4. Owner's quick reference: what each session should leave you with

| Session | You should be able to |
|---|---|
| Phase 1, part 1 (P1-01 to P1-07, P1-12) | Run `npm run data:ingest`, `npm run data:validate`, and `npm run release:check` and read plain-language reports; see the list of unresolved links and ambiguous nation names to review |
| Phase 1, part 2 (P1-08 to P1-14) | See real USFS counts (718 vs 752), geometry size, and the Royce-to-treaty match report; CI shows green or readable failures |
| Phase 2, part 1 (P2-01 to P2-07) | Run `npm run build && npm run preview`, open `/map/`, move the year slider by keyboard, read a cession's sources, share a URL |
| Phase 2, part 2 (P2-08 to P2-12) | Toggle Today, see the NLD outbound panel, read the performance and accessibility report |

If a session fails to meet its acceptance criteria, do not start the next one. Paste the agent's final report back into a new session and say: "Fix the failing acceptance criteria listed in the report; do not start new tasks."

## 5. Cautions for the owner

- Do not paste API keys, tokens, or private correspondence into any prompt.
- If an agent proposes adding analytics, third-party scripts, copying NLD data, or scraping OSU/IDA/UNL sites, the answer is no without a decision-log entry (J4, J2).
- If an agent writes narrative about a specific nation, check that the nation's `review_status` allows it and that every sentence has a source.
- Review the nation crosswalks (`crosswalks/nation-aliases.csv`, `nation-link-overrides.csv`, `nation-successor-proposals.csv`) yourself or with a reviewer: they decide which names are treated as the same nation and which present-day nations are proposed as successors. Nothing there is confirmed by any nation.
- Keep `PAGES_DEPLOY_ENABLED` unset or `false` until Phase 7.

## Sources

J1-J5 in this folder; docs/00-RESEARCH-BRIEF.md; Node and Astro version requirement from `npm view astro engines` (2026-10-16).

## Confidence & Gaps

Confidence: medium. The prompts reflect the design docs and have not been executed. The Phase 1 prompt is intentionally long; if a session runs out of room, the owner can split it at the boundary between P1-07 and P1-08 without loss.
