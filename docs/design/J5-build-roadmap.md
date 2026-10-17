---
title: Executable Build Roadmap, Risks, and Owner Decision Log (Phases 0-7)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# J5. Build Roadmap

*Numbers corrected by the Synthesis Agent on 2026-10-16 and updated after the verification correction pass to match `build/graph-build-report.md` (current build: 1,563 nodes, 3,543 edges, Nation 226, proposed 2,345, 29 orphans, 0 schema errors, 106 logged issues). The earlier scratch-run figures (1,529 / 3,476 / 194 / 31 / 12 / 164 / 2,280) are superseded.*

Design Agent J, file 5 of 6. Read J1 (architecture), J2 (NLD), J3 (repo/CI), J4 (licensing gates) first. Paste-ready prompts to start Phases 1 and 2 are in J6.

Tags: `[estimate]` for session counts; `[proposal]` for design choices.

## 0. How to use this roadmap

- **Task sizes.** `S` = one Claude Code session (roughly 1-3 hours of agent work, one concern, up to about 10 files changed). `M` = one long session or two short ones. `L` = split it; the notes say how. Session counts are estimates only.
- **Every task** has acceptance criteria that a person can check by running a command or looking at a page. Tasks are numbered `P<phase>-<nn>` and referenced in commit messages.
- **Order.** Do tasks in numeric order unless "Depends" says otherwise. One task per session is the rule of thumb; commit at the end of each task; open one PR per task.
- **Parallel track.** Phase 0 (permissions, licensing, tribal advisory, legal review) is mostly the owner's work and runs **in parallel with Phases 1-6**; its results gate Phase 7 (J4). Code can proceed in a private repo while Phase 0 runs.
- **Content versus code.** Code tasks never invent facts. Content tasks (tours, narratives, nation pages) use only sourced data from the seed tables and research files, and nothing nation-specific is published without the review status rules (G3 s.3.3).
- **What the owner sees** is listed per milestone ("Owner demo").

```
Phase 0 (owner, parallel, long-running) ----------------------------------------> gates for Phase 7
        |
Phase 1 data pipeline & graph --> Phase 2 map + slider MVP --> Phase 3 violations/cases/detail pages
                                                                  |             |
                                                    Phase 4 counterfactual   Phase 5 orgs & Support
                                                                  \             /
                                                                Phase 6 tours, polish, a11y audit
                                                                           |
                                                                    Phase 7 launch
```

Milestones: M0 decisions made; M1 data builds; M2 map MVP; M3 content pages; M4 counterfactual (preview); M5 Support flows (preview); M6 release candidate; M7 live.

---

## Phase 0. Permissions, licensing, tribal advisory outreach, legal review (owner-led)

Goal: start every slow, human-dependent process on day one. No code is required, but a coding agent can draft documents (docs only; it never sends anything).

| ID | Task | Who | Depends | Size | Acceptance |
|---|---|---|---|---|---|
| P0-01 | Make the minimum decisions: D-01 to D-08 in section 9 (name, GitHub account/ownership, license, stack acceptance, repo visibility, analytics, legal reviewer, advisory approach). Record them in `docs/governance/decision-log.md` | Owner | - | S | Decision log has an answer or "defer to Phase N" for each of D-01..D-08 |
| P0-02 | Create the GitHub repository (private, per J3 s.3.2 recommendation), add collaborators, enable branch protection on `main`, set Pages source to "GitHub Actions", create variables `PAGES_DEPLOY_ENABLED=false` and `SITE_STAGE=preview`, turn on 2FA, secret scanning, Dependabot alerts. Decide the account question (J3 s.6) first | Owner (or agent via `gh` if the owner authorizes a scoped token) | P0-01 | S | Settings page screenshots or `gh api` output saved in `docs/release/github-setup.md`; pushing to `main` directly is rejected |
| P0-03 | **NLD permission request**: owner reviews J2 s.7 text, edits, and sends via Discord and `tech@native-land.ca`; optionally runs the CORS test (J2 s.8) with the owner's own key | Owner | P0-01 | S | Message sent date logged in `docs/release/outreach-log.md`; replies stored; `PermissionRecord` updated only when a written grant exists |
| P0-04 | **USFS license confirmation**: send the short request in Appendix A to the Forest Service contact listed on Data.gov (Office of Tribal Relations) | Owner | P0-01 | S | Sent date logged; reply stored in `docs/release/usfs-license-reply.md`; registry entry `usfs-royce` updated |
| P0-05 | Governance documents: agent drafts, owner and advisors edit: project charter and "who we are" statement (state plainly that the project is not Indigenous-led, G3 s.5), data policy (G3 s.2 classes P/D/S/K), corrections and removal policy (G3 s.7), AI use policy (G3 s.12), donation policy (F4 s.6), vocabulary and style guide reference (G2 s.1, G3 s.6) | Agent drafts, owner approves | P0-01 | M | Files in `docs/governance/`; each carries status `draft` until owner approves; published pages later render them |
| P0-06 | **Tribal advisory outreach plan**: identify the right offices for the first set of nations (official tribal sites; THPO or cultural resources offices), choose pilot nations (G4 suggests Cherokee and Klamath pilots; the owner decides), decide compensation and the named steward (G3 s.3), then send invitations using the G3 s.3.4 template **after P0-05 is published**. The agent may prepare a contact log template and letter drafts but must not contact anyone | Owner | P0-05 | L (ongoing) | Contact log (private store) created; first invitations sent; each nation's `tribal_review.status` set to `invited` (in the review ledger) only when actually invited |
| P0-07 | **Legal reviewer** engaged (federal Indian law practitioner or legal historian) with scope: vocabulary, evidence categories, legal-status panels, site terms/privacy, quotation policy, and charitable-solicitation question (F4 s.6.4) | Owner | P0-01 | M | Engagement terms recorded; reviewer role named for sign-off metadata; schedule agreed for G-08, G-16, G-17 |
| P0-08 | Verification wave plan: decide which seed items must be verified before launch (D-15), and run/schedule the verification agent over `[from-memory]` cites, Fort Laramie 1851 numbering, EIN checks (IRS TEOS), and donation URLs | Owner + verification agent | P0-01 | M | `verification/` reports exist and are linked from `docs/release/gates.md` |
| P0-09 | Courtesy and clarification notes (optional, owner decides): HCN (only if Land-Grab layer is planned), OSU Libraries and IDA/MIAC (link-only notice; partnership interest), Newberry (rights page). Use Appendix A style | Owner | P0-01 | S | Logged in outreach log; gates G-06, G-07, G-09 updated |
| P0-10 | Contact channels: public corrections email/form and a separate tribal-government channel with a named steward; decide where private correspondence is stored | Owner | P0-05 | S | Addresses live and tested; named in `CONTRIBUTING.md` and `.github/ISSUE_TEMPLATE/config.yml` |
| P0-11 | Funding and conflict-of-interest disclosure draft (G3 s.3.5) including any Land Back organizations the site promotes | Owner | P0-05 | S | Disclosure text approved |

**Milestone M0 (exit):** D-01..D-08 recorded; repo exists; outreach items P0-03, P0-04, P0-06, P0-07 started with dates logged. Phase 1 may start when P0-01 and P0-02 are done. **Phase 7 may not start until the J4 gates are cleared.**

---

## Phase 1. Data pipeline and graph (Milestone M1)

Goal: from the seed CSVs, the existing graph builder and crosswalks, and the USFS download, produce a validated, deterministic set of static JSON/GeoJSON files, with CI. No map yet. **Reuse, do not rebuild:** the design wave already delivered the graph schema (`docs/design/schema/`), `scripts/build_graph.py`, and `crosswalks/`.

Depends on: P0-01, P0-02. Network-dependent tasks (P1-08, P1-11) may need the owner to run a command locally if the agent sandbox blocks the hosts (the research sandbox did).

### P1-01. Scaffold the repository [S]
- Create the layout in J3 s.1 (only the folders needed now; empty ones with `.gitkeep`).
- Scaffold Astro (static) + TypeScript strict + Svelte integration using the **current official docs** (do not trust remembered APIs); lint (ESLint, Prettier), `vitest`, `.nvmrc` (Node 22 line, >= the version Astro requires), `.editorconfig`, `.gitignore` (generated dirs, `.env*`, `data/sources/**` except manifest).
- Add stub npm scripts (`lint`, `typecheck`, `test:unit`, `data:*`, `build`, `preview`) that run something real or print "not implemented yet" and exit 0.
- Copy nothing from `docs/design/tokens.css` yet (P2-01 uses it). Confirm `python3` is available for `scripts/build_graph.py` and document it in the README.
- Add `README.md` (attribution: Benjamin Life (@omniharmonic); no mention of OpenCivics), `CONTRIBUTING.md` stub, `seed-data/CANONICAL.md`, `docs/design/ADR-versions.md` (record exact installed versions), copy the decision log.
- Minimal `ci.yml` (lint, typecheck, unit, build). Home page placeholder with the footer credit.
- **Acceptance:** on a clean clone, `npm ci && npm run lint && npm run typecheck && npm run test:unit && npm run build` succeeds; CI green; `scripts/check-attribution.mjs` passes and fails when the string "OpenCivics" is inserted into `src/` (add a test).

### P1-02. Schemas and CSV loaders for all tables [S]
- Zod schemas in `pipeline/src/schema/` for: treaties (21 columns), NARA index, cases, statutes, violations (+ notes), organizations, campaigns, tribe-org-map, policy eras, geodata-sources.
- Robust CSV parsing (quoted fields, embedded newlines and commas, UTF-8 BOM tolerant). `npm run data:ingest` prints per-table row counts and errors.
- Expected counts (data rows): treaties 135, NARA 376, cases 104, statutes 51, violations 62, violation notes 62, organizations 67, campaigns 42, tribe-org-map 86, policy eras 9, geodata sources 24.
- Do not "fix" source data in code. Problems go to `data/KNOWN-ISSUES.md` as a generated section.
- **Acceptance:** counts above asserted in a unit test; invalid-row fixtures produce readable errors with file/row/column; zero crashes on the real files.

### P1-03. Normalization utilities [S]
- NFC normalization; trim; multi-value splitting on `;` for `violation_type`, `doctrines`, etc.; partial ISO date parsing (`YYYY`, `YYYY-MM`, `YYYY-MM-DD`) into a structured `{value, precision}`; inline confidence tag parser (`[verified]`, `[from-memory]`, `[disputed]`, `[unverified]`) that outputs flags and a cleaned display string; ID pattern checks.
- **Acceptance:** unit tests for every function including diacritic, combining-mark, and partial-date cases; no function mutates input.

### P1-04. Adopt and triage the existing graph builder and nation crosswalks [M]
Starting point (do not rebuild): `scripts/build_graph.py`, `crosswalks/*.csv`, and `docs/design/schema/*.schema.json` (see ADR-007). On a scratch run the builder produced 1,563 nodes, 3,543 edges, 29 orphans, 0 schema errors, and 106 logged issues (current `build/graph-build-report.md`); every edge is `asserted_by_seed` or `proposed`.
- Add `npm run graph:build` (runs the builder with Python 3), and a `--check` mode in the pipeline that fails on any `error`-level issue not listed in `data/KNOWN-ISSUES.md`.
- Triage `build/graph-build-report.md` and `build/unresolved.json`: for each schema error (the current build reports 0; an earlier scratch run reported 12), decide whether the fix belongs in a seed row (log to KNOWN-ISSUES; do not edit seeds), a crosswalk (edit the crosswalk), the builder (small tested patch), or the schema (version bump). Do not weaken `NodeCommonRules`.
- Review `crosswalks/nation-entities.csv`, `nation-aliases.csv`, and `nation-link-overrides.csv` for obvious errors only (for example a band name matched to a different nation, as in the Menominee override). **Never invent endonyms, recognition status, or successor relationships**; entries stay `unreviewed`/`proposed`. Items needing a human go to a short review list for the owner.
- **Acceptance:** `npm run graph:build` is reproducible; schema errors are zero or each is documented with a decision; the report summary (counts by node and edge type, orphans, unresolved nation strings) is copied to `build/report.md`; no seed CSV is modified.

### P1-05. Link coverage: review and extend crosswalks [M]
- Inspect the proposed links in `crosswalks/violation-instrument-links.csv`, `case-instrument-links.csv`, `violation-statute-links.csv`, `campaign-violation-links.csv`, `case-doctrine-statute-edges.csv`, `statute-merge.csv`. Report: counts by `status`, links with weak `basis`, violations or cases with no instrument link, instruments with no nation (party_to) edge.
- Do not promote any edge to `accepted` (only humans do that). Provide a small CLI, `npm run links:review`, that prints the next 20 proposed links for a reviewer with their basis and sources, and writes decisions to the crosswalk with `status=accepted|rejected` and `reviewer_role`/`date` (builder patch as needed).
- **Acceptance:** report committed to `build/` (generated); the CLI round-trips a decision for one link in a test fixture; reviewed decisions persist across reruns.

### P1-06. Validation harness and lite emit [S/M]
- Validate `build/nodes.json` and `build/edges.json` with Ajv (2020-12) against `docs/design/schema/`; implement V2, V3, V12 (determinism) from J3.
- Emit stage (ADR-007): strip timestamps; apply publishability (P1-07); write `public/data/graph-lite.json`, `public/data/entities/<type>/<id>.json` (node plus 1-hop neighbors), `public/data/tables/instruments-lite.json`, `timeline-events.json`, and `manifest.json`. Raw `nodes.json`/`edges.json` are never copied to `public/`.
- **Acceptance:** node counts equal builder output; two consecutive emits are byte-identical; `graph-lite.json` <= 400 KB gzip (report options if not); no dangling edges in emitted files.

### P1-07. Review ledger, suppression, publishability [S]
- Add `crosswalks/tribal-review-ledger.csv` (columns in ADR-007 item 7) and a small tested patch to `build_graph.py` so it sets `tribal_review` and `publication` from the ledger (default stays `not_yet_contacted`, `narrative_allowed=false`). Add `data/suppress.yaml` handling in the emit stage. Add the overlay loader (`data/overlays/**/*.md`) and overlay schemas (narrative, `content_warnings`, `ai_assisted`, `legal_review`).
- Implement the publishability filter (organizations with `confidence=low` never published; nation-specific nodes restricted to record-only content unless the ledger says otherwise; suppressed ids tombstoned everywhere) and the citation/confidence rules V5/V6/V8.
- **Acceptance:** fixture tests prove each rule, including that a node with `declined` status cannot become `published`, and that a suppressed id is absent from graph-lite, entity JSON, and search metadata.

### P1-08. USFS fetch, restore, and field inventory [M] (network)
- `data:fetch usfs`: paginate the ArcGIS REST MapServer for polygon layer 1 as GeoJSON (max 2,000 per request, handle `exceededTransferLimit`) and the attribute table (layer 2) as JSON; save to `data/sources/usfs/<date>/`; write SHA-256 manifest `data/sources/manifest.json`. Support `--from-dir` for a manually downloaded Hub GeoJSON/CSV. Layer URLs are in E2/A3; confirm they still respond.
- `data:restore`: download pinned files from the repo's own Release asset and verify checksums (create the Release by hand or with `gh` after the first fetch).
- Generate `build/usfs-field-inventory.md`: every attribute name and type, null counts, **actual polygon count (718 or 752), IDs without geometry (expect 47, 65, 128, 129, 130, 543, 690), whether a field distinguishes cession from reservation, and the format of `cessdate1-5`**. Append findings to `PROVENANCE.md`.
- **Acceptance:** manifest committed; inventory generated from real data; counts recorded and compared with E2/A3; if the sandbox cannot reach the host, the task is marked blocked and the owner runs the command locally.

### P1-09. Geometry pipeline for cessions [M]
- Reproject to WGS84 if not already; repair invalid geometry; derive per ADR-006 properties (`t_first`, `t_last`, `dates`, `legal_type` from the Kappler/statute/EO link fields with `legal_type_basis`, `tier` default T3 per G2 s.8.2, `flags`); join events from the attribute table into `cession-events.<hash>.json`; simplify with Mapshaper at a configured tolerance; quantize coordinates; remove unused properties; write `PROVENANCE.md` row (tool, version, parameters, source checksum).
- Express each cession as a `GeoFeature` record valid against `docs/design/schema/entities.schema.json` (read its GeoFeature definition: `geometry_role`, `boundary_type`, `geometry_file`, `geometry_source`, `uncertainty`, `version`; id pattern `geo-royce-<cessnum>`), linked to instruments by `depicts` edges once `crosswalks/instrument-royce.csv` has entries.
- Publish seven "missing geometry" ids as events-only records with `geometry_quality: missing`.
- Verify gzip behavior locally by compressing; document the Pages gzip check (ADR-004) as a Phase 2 task.
- **Acceptance:** V10 passes; geometry file <= 2 MB gzip (if not, report options: tolerance, TopoJSON); golden tests on three hand-checked polygons; unsimplified GeoJSON saved as Release asset; `t_first` for a sample of 10 cessions matches the Schedule dates they were derived from.

### P1-10. Royce <-> instrument crosswalk [M]
- Parse Kappler links in the USFS attribute table to Kappler volume/page citations; match to `treaties-seed.csv` (`kappler_cite`, `date_signed`) and the NARA index; write candidates to `crosswalks/instrument-royce.csv` with `basis` and `status` (`candidate` or `proposed`; only a human sets `accepted`); add `royce_cession_number` to published instrument entities.
- Mark a match `proposed` only when two independent keys agree (e.g., Kappler page and date); everything weaker is `candidate`. The agent never sets `accepted`. Report how many of the 135 seed instruments matched and which USFS rows have no seed instrument (those become the "to add" backlog).
- **Acceptance:** match report; no `proposed` match conflicts with another; human decisions persist across reruns.

### P1-11. Census AIANNH "today" layer [S] (network)
- Fetch the Cartographic Boundary AIANNH file at 1:500,000 (current vintage), convert to GeoJSON, keep only needed attributes (GEOID, name, class), simplify lightly, emit `today-aiannh.<hash>.json`; registry entry with the Census disclaimer; add to manifest.
- **Acceptance:** size within budget (target < 1.5 MB gzip); feature count recorded; provenance row; layer flagged as statistical, not legal.

### P1-12. License registry and gate tooling [S]
- Create `data/licenses/registry.yaml` with every entry in J4 s.2 (`status: pending` except `not_used` items); implement V9 and `npm run release:check` printing the J4 gate table; generate `NOTICE.md`.
- **Acceptance:** `data:validate --mode=production` fails with a clear table of pending gates; `--mode=preview` passes with warnings.

### P1-13. CI for data [S]
- Extend `ci.yml` per J3 s.3.1: restore, validate, determinism, size budget, attribution, no-NLD scripts, gitleaks (`security.yml`), `dependabot.yml`, data-diff job summary.
- **Acceptance:** a deliberately broken CSV row fails CI with a readable message; green on `main`.

### P1-14. Pipeline documentation [S]
- `pipeline/README.md` in plain language ("how to run", "how to add a row", "what each report means"), `docs/design/data-model.md` (graph as built), `CONTRIBUTING.md` first draft.
- **Acceptance:** the owner can follow the README to run `data:validate` without help.

**Milestone M1 (exit).** `npm run data:build` (graph:build, geometry, emit) produces `cessions`, `cession-events`, `today-aiannh`, `graph-lite`, `entities`, `manifest.json` deterministically; `data:validate --mode=preview` passes; production mode lists the pending gates; CI green. **Owner demo:** a terminal report plus `build/report.md` showing counts, unresolved items, and layer sizes. Estimated 14-17 sessions [estimate].

---

## Phase 2. Map and time-slider MVP with Royce cessions (Milestone M2)

Goal: a keyboard-operable, accessible map where the owner drags or keys a year slider from 1784 to 1894 and watches cession records accumulate, with sources one click away. Depends on: M1.

### P2-01. Layout shell and design tokens [S]
Base layout, header/footer (credit line), skip links, focus ring, **design tokens imported from `docs/design/tokens.css` and `tokens.json` (the visual-identity work; do not invent a second palette; the prototype in `docs/design/prototype/index.html` shows intended layout)**, light/dark and forced-colors support, self-hosted Noto subsets with `font-display: swap`, the `href()` helper, stage banner and `noindex` in preview, stub pages: About, Credits, Privacy, Accessibility. **Acceptance:** axe clean on these pages; works at 320 px width; no external requests (network assertion).

### P2-02. Map island scaffold [S]
`/map/` page; dynamic `import('maplibre-gl')`; local `style-atlas.json` derived from OpenFreeMap Positron (muted, minimal labels); attribution control; `MapController` interface in `src/lib/map/`; WebGL-unavailable fallback panel; reserved container height (no layout shift); CSP meta with `worker-src blob:` as needed. **Acceptance:** Playwright: map canvas present with attribution text; with WebGL disabled, the fallback and table link appear; the only third-party host contacted is the basemap host.

### P2-03. Cession layer, legend, patterns [M]
Load `cessions.json`; fill (constant low opacity) and outline layers; legal-type encoding by pattern plus outline style (patterns via `map.addImage`); T3 dashed edges; hover/selection via `feature-state`; legend component with text; standing disclaimer ("Boundaries are approximate, from Royce's 1899 maps georeferenced by the US Forest Service; not legal descriptions"; E3 s.7). **Acceptance:** legend lists every legal type present; selected feature outline visible at 3:1 contrast; unit test that the legend is generated from data, not hard-coded.

### P2-04. Time slider [M]
Svelte `TimeSlider` using native range input; domain 1784-1894; `aria-valuetext`; decade tick labels; previous/next-event buttons; cut-point chips from config; modes Cumulative and Window (1/5/10/25 years); play/pause (default paused; disabled under reduced motion); post-1894 notice; debounced polite live region; map binding per ADR-006 (global-state expression with `setFilter` fallback); current count display. **Acceptance:** Playwright keyboard test (focus slider; arrow, PageUp/PageDown, Home/End change the year; chips jump); count at 1868 equals the independent pipeline count; p95 tick cost <= 16 ms under 4x CPU throttle; no autoplay; axe clean.

### P2-05. Events table and text summary [S/M]
"Events in view" table (cession number, dates per Royce's Schedule, tribes named, legal type, tier) bound to current year, mode, and map bounds; sortable column headers; row selection highlights the feature and opens the panel; one-sentence summary above the table. **Acceptance:** with the map hidden by CSS, a keyboard user can find and open any cession's detail via the table; table rows equal the filtered feature count.

### P2-06. Detail panel [S]
Side panel (not a popup) with: cession number, tribes as named in Royce, present-day tribes as provided by USFS (labeled "per USFS/NAGPRA, under review"), dates per Royce's Schedule, links to Kappler text/statute/EO, data-quality flags (e.g., "geometry unavailable"), uncertainty note, link to the Royce original at LOC, credit line. Focus moves to the panel heading on open; Escape returns focus. **Acceptance:** Playwright focus-management test; no unlabelled links.

### P2-07. URL state and sharing [S]
Hash encoding (`#y=1868&m=cum&l=cessions,today&c=lat,lng,z&sel=<id>`), restore on load, copy-link button, safe parsing (invalid values ignored). **Acceptance:** round-trip tests; opening a shared URL reproduces the view.

### P2-08. Today layer and "return to today" [S]
Census layer with toggle; default on after 1894 or when play ends; one-click "Show today" button always visible; disclaimer; endonym placeholder note. **Acceptance:** at year 1894 the Today toggle is reachable in <= 2 keystrokes from the slider; disclaimer text present.

### P2-09. Territory context provider, Tier 0 (J2) [M]
Implement `types.ts`, `config.ts`, `registry.ts`, `NoneProvider`, `OutlinkProvider`, `TerritoryContextPanel`, `integrations.config.json` (default mode `outlink`, `permission.granted=false`, `templateVerified=false`). Add the enforcement tests and scripts from J2 s.9 that apply now (`permission-gate`, `disabled-mode`, `no-nld-data`, ESLint restriction). **Acceptance:** panel shows acknowledgement, disclaimer, and a link to native-land.ca; no request to `native-land.ca` occurs from the site (network assertion); attempting to build with `mode: relay` and no permission degrades to Tier 0 and the test passes.

### P2-10. Instruments track under the slider [S]
Render an HTML list of treaty/instrument events by year from the instruments table (signing dates), as the first of the four tracks (G4 s.3.1); other tracks come in Phase 3. **Acceptance:** each event links to its entity record (page stubs or JSON until Phase 3); keyboard reachable.

### P2-11. Budgets and automated checks [S]
`scripts/size-budget.mjs`, Playwright perf test, axe on `/map/`, record Lighthouse mobile results in `docs/release/perf-<date>.md`. Verify on a deployed preview (or a local static server with gzip) that `.json` files are gzip-compressed; record the answer in `docs/design/ADR-versions.md`. **Acceptance:** budgets in ADR-011 met or deviations recorded with a plan.

### P2-12. Private preview delivery [S]
`ci.yml` uploads `dist/` as a short-retention artifact; `npm run preview` documented in README; stage banner and `noindex` verified. **Acceptance:** the owner can open the preview from a downloaded artifact or `npm run preview` without developer help.

**Milestone M2 (exit).** Owner demo: open `/map/`, key through 1784-1894, select a cession, read its sources, open the table, toggle Today, use the NLD outbound link, copy a shared URL. All CI checks green; budgets met. Estimated 12-15 sessions [estimate].

---

## Phase 3. Violations, cases, detail pages (Milestone M3)

Depends on: M2, P1-05 and P1-07 (links and overlays).

| ID | Task | Size | Depends | Acceptance |
|---|---|---|---|---|
| P3-01 | Entity routing and page templates: instruments, cases, statutes, violations, eras, glossary (port D4), nations (restricted class). Components: CitationBlock, ConfidenceBadge, ReviewStatusBanner, HowWeKnow | M | M2 | One HTML page per published entity; each shows citations with confidence badges; pages readable with JS disabled; page count matches publishability report |
| P3-02 | Static SVG locator maps (d3-geo at build time) on instrument and nation pages; also used for share images | M | P3-01 | Every page with geometry has an inline SVG with title/desc; no network; passes axe |
| P3-03 | Vocabulary and evidence-flag model: overlay fields for E0-E7 (G2 s.4); vocabulary page (treaty vs agreement vs EO; broken/abrogated/diminished/disestablished); UI uses neutral labels by default and reserves "violation" for E3-E6/E7 | M | P3-01 | Unit tests on label rules; each flag requires a citation; page copy marked `legal_review: pending` until G-16 |
| P3-04 | Violations layer: place-level markers (centroid of linked cession geometry or nation region; coordinates rounded to 2 decimals; never address-level), clustering, filters by `violation_type` and era, side-panel details | M | P3-03, P1-05 | Every marker has a text equivalent in the table; marker coordinates pass V13; violation without linked geometry appears in the table only |
| P3-05 | Multi-track timeline (Instruments; Alterations and violations; Law and resistance; Returns and restoration) bound to the slider | M | P3-04 | Four tracks as keyboard-navigable lists; clicking an event sets the year and selection; "Today" frame includes returns |
| P3-06 | Case and doctrine lineage view (swimlane SVG + table) from cases/statutes `doctrines` | M | P3-01 | Chronological view and table equal content; keyboard navigable |
| P3-07 | Neighborhood graph component (ADR-009): headless d3-force at build, accessible SVG, related-items list first | M | P3-01, P1-06 | Passes axe at 360 px; list in DOM before SVG; deterministic layout |
| P3-08 | Search with Pagefind (ADR-008), filters, alias/diacritic tests | M | P3-01 | Query -> keyboard-selectable results; ASCII-folded query finds fixture names; result count announced politely |
| P3-09 | Content-warning and trauma-informed patterns (G3 s.10): per-page `content_warnings`, collapsible sensitive passages, "see today" link on every historical view | S | P3-01 | Component tests; pages with warnings show them before content |
| P3-10 | Corrections log page generated from `CHANGELOG-DATA.md`; "Report an error" links prefilled with entity ID; issue forms from J3 | S | P3-01 | Link opens form with the page URL; corrections page lists entries newest first |
| P3-11 | Nation pages in the restricted class: review-status badge, record-only content for `not_yet_contacted`/`invited`, tombstones from `suppress.yaml`, endonym-first display with "named in the treaty as" | M | P3-01, P1-04 | Tests show no narrative text renders for unreviewed nations; suppressed nation appears nowhere (search, graph, SVG, tours) |
| P3-12 | Share cards and print stylesheet with lineage line and "not a legal boundary" | S | P3-02 | Printed page includes citations and disclaimer |

**Milestone M3 (exit).** About 1,000 pages build; search works; violations and cases visible on the map and timeline; unreviewed nations restricted. Owner demo: walk from a map selection to an instrument page, its sources, related cases, and the neighborhood graph. Estimated 14-16 sessions [estimate].

---

## Phase 4. Counterfactual explorer (Milestone M4)

Method: G2 "ledger, not a verdict": stop-the-clock query, evidence categories, no dissolve of overlaps, legal-status panel. Depends on: M3. **Public release also depends on G-15 and G-16** (tribal advisory input and legal sign-off); the code can be built in preview now.

| ID | Task | Size | Depends | Acceptance |
|---|---|---|---|---|
| P4-01 | Effective-date derivation: add `date_signed`, `date_ratified`, `date_proclaimed`, `date_effective`, `date_effective_basis` to instrument records (effective = proclamation for treaties, enactment for statutes, per G2 s.8.3); pipeline flags instruments lacking dates | M | M3 | Report of instruments with complete/incomplete dates; no counterfactual uses an instrument with missing effective date (it is listed as excluded) |
| P4-02 | Stop-the-clock engine: pure TypeScript `recognizedAt(ledger, year)` and `alterationsAfter(ledger, year)`; golden tests for hand-checked cut-points; property tests (monotonic, deterministic) | M | P4-01 | Test suite passes; every output record cites its instrument ids; engine has no map dependency |
| P4-03 | Claims model and overlap rendering: one feature per claim, hatch patterns, popups list claimants alphabetically by display name, "areas associated with X, Y, Z in [source]" labels; acreage unions computed only in the pipeline with ranges and sources | M | P4-02 | Test: overlapping fixtures stay separate; no function dissolves claims; acreage shown as range with labels |
| P4-04 | Counterfactual explorer UI: cut-point chips (D-11), before/after control ("as signed" vs "what happened"), layer toggles L1-L8 (G2 s.3), lens switch (Federal-record default; Evidence flags; Tribal account only where provided) | L (2 sessions) | P4-02, P4-03 | Keyboard-operable end to end; default lens is Federal-record; every view shows the legal-status panel (collapsed) and Today link |
| P4-05 | Alteration events layer with evidence categories and neutral default labels ("Treaty cession, ratified 18xx" plus flag count) | S | P3-03 | Label rules tested; flags link to citations |
| P4-06 | Legal-status panel (S1-S9) component and data overlay with `legal_review.signed_off_on` and reviewer role; hidden in production unless signed | M | P4-04 | Production build excludes unsigned panels and therefore the counterfactual view for those records |
| P4-07 | Uncertainty rendering T1-T4 (solid/solid+buffer/dashed+feather/schematic), minimum display scale cap, "show uncertainty" toggle, zoom notice | M | P4-04 | At zoom beyond the cap, geometry detail does not sharpen and a notice appears; not color-only |
| P4-08 | Exports: image with legend, lineage line, and "not a legal boundary" | S | P4-04 | Exported image includes all three elements |
| P4-09 | Nation-specific gating and guardrails: nation counterfactual hidden unless `tribal_review.status` and `publication` allow; copy rules ("would have", "as described"); no address-level lookup; place lookup (if D-12 = yes) returns county-level history only | S | P4-04, P3-11 | Tests prove unreviewed nation has no counterfactual narrative; copy lint rejects "stolen" without attribution |
| P4-10 | Red-team checks from G2 s.10 as automated tests (no parcel overlay; minimum scale; overlap not dissolved; successor attribution flagged; unreviewed content gated) | S | P4-09 | Each failure mode in G2 s.10 has at least one test |

**Milestone M4 (exit, preview).** Owner demo at cut-points (e.g., 1868): choose a lens, see recognized areas, alterations after that year with evidence flags, the legal-status panel (marked "pending legal review"), uncertainty toggle. Estimated 11-13 sessions [estimate].

---

## Phase 5. Organizations and Support flows (Milestone M5)

Principles: F4 donation integrity; prefer Indigenous-led; no payments on the site; self-described labels. Depends on: M3; **public release depends on G-17**.

| ID | Task | Size | Depends | Acceptance |
|---|---|---|---|---|
| P5-01 | Organization and campaign pages: published subset only (high/medium confidence), per-listing label template (F4 s.6.3), badges from `indigenous_led`, vetting notes, `last_verified` | M | M3, P1-07 | Low-confidence rows absent from all outputs; each page shows how the organization is described ("self-described") and source links |
| P5-02 | Nation "Support" section: organizations linked through tribe-org-map; "Donate / Volunteer / Learn / Advocate" grouping from an overlay `support_actions` field; `NONE_VERIFIED` nations show a respectful "no verified organization yet" note linking to the nation's own site | M | P5-01, P3-11 | Nations with unreviewed status show only Class P/D support facts; no organization shown as endorsed by a nation unless the overlay says so |
| P5-03 | Outbound donation pattern: pre-click notice ("you are leaving this site; we receive nothing; verify before giving"), `rel="noopener noreferrer"`, donation policy page (F4 s.6.2, legal reviewed) | S | P5-01 | Every donation link passes through the same component; Playwright asserts the notice and attributes |
| P5-04 | Land returns layer (L8): campaigns by status (`completed`, `pending`, `contested`...), place-level markers when a location is given, reported acreage with source and range note when sources disagree (F3 s.8) | M | P3-04 | Status shown as text and shape, not color only; "headline-only" items never shown as facts |
| P5-05 | Donation URL liveness workflow and auto-delist PR (J3 s.3.3) | S | P5-01 | Scheduled run opens an issue on failure; test uses a fixture failing URL |
| P5-06 | Organization suggestion workflow: issue form, PR template, EIN format validator, F4 checklist | S | P5-01 | Template renders; validator rejects malformed EIN; no EIN is auto-verified |
| P5-07 | "Learn" resources: reading lists sourced from research files (F1/F2/F3) with citations | S | P5-01 | Every resource has a source URL and a one-line "why" |
| P5-08 | Funding and conflict-of-interest disclosure page (from P0-11) | S | P0-11 | Page published in preview; linked from footer |

**Milestone M5 (exit, preview).** Owner demo: from a nation page, find verified organizations, understand how each is described and vetted, and reach the organization's own donation page through the notice. Estimated 8-10 sessions [estimate].

---

## Phase 6. Guided tours, polish, accessibility audit (Milestone M6)

| ID | Task | Size | Depends | Acceptance |
|---|---|---|---|---|
| P6-01 | Tour engine: YAML tours (G4 s.5 data model), `TourPlayer` island with step list, keyboard controls, focus management per beat, no auto-advance, text-only version of every tour, deep-linkable beats synced to map state | L (2 sessions) | M4 | Tour completes with keyboard only; every beat's claim has evidence resolving to an entity or URL (V5); text-only version is complete |
| P6-02 | Author first tours from G4 outlines: A (Fort Laramie and the Black Hills), C (Johnson v. M'Intosh to McGirt), E (Blue Lake). Content only from sourced records; unreviewed nations' voices are not written | M each | P6-01 | Each tour shows its tribal/legal review status (`pending` allowed in preview); content warnings present |
| P6-03 | Entry points and home page: by nation (endonym-first), by place (county-level only if D-12), by theme, by tour; last frame is always Today | M | P6-02 | Usability pass by owner; keyboard path to each entry point |
| P6-04 | i18n scaffolding: Astro i18n routing, `src/i18n/en.json`, Spanish stub with language switcher hidden until reviewed | S | M5 | Switching default config builds `/es/` stub without breaking English |
| P6-05 | Performance pass: bundle analysis, image optimization, font subsetting check, third-party request audit | S | M5 | ADR-011 budgets met; only basemap host contacted (network assertion) |
| P6-06 | Security hygiene: final CSP meta, dependency audit, `SECURITY.md`, removal-request drill using a test entity | S | M5 | Drill: suppression PR merged and live preview updated in < 1 hour; audit clean or exceptions documented |
| P6-07 | Accessibility: expand automated coverage; write manual audit protocol (screen readers, zoom, forced colors, reduced motion); run it; fix findings | L (2 sessions) | M5 | `docs/release/a11y-audit-<date>.md` with pass/fail per WCAG 2.2 AA criterion for key flows; zero open blockers |
| P6-08 | External testing: sessions with screen-reader users, educators, and Indigenous reviewers (owner-run); agent prepares scripts and a feedback form | Owner | P6-07 | Findings triaged into issues with severity |
| P6-09 | Editorial pass: plain-language review, Elements of Indigenous Style conventions (G3 s.6), glossary completeness | M | M5 | Style checklist applied to all published templates; glossary covers every legal term used in labels |
| P6-10 | Production plumbing: sitemap, `robots.txt` generated from `SITE_STAGE`, RSS for corrections log, social cards | S | M5 | In `production` stage robots allows indexing; in `preview` it disallows |
| P6-11 | Maintainer runbook for a non-developer: how to review a PR, flip deployment variables, handle a removal request, run a data refresh, rollback; wind-down/succession statement (G3 s.7.2) | M | M5 | Owner dry-runs each procedure once |
| P6-12 | Beta review with advisors using a preview artifact | Owner | P6-09 | Written feedback logged; changes triaged |

**Milestone M6 (exit): release candidate.** Estimated 11-14 sessions plus owner-run testing [estimate].

---

## Phase 7. Launch (Milestone M7)

| ID | Task | Who | Depends | Acceptance |
|---|---|---|---|---|
| P7-01 | Gate review: run `npm run release:check`; resolve or remove features for every non-cleared gate (J4 s.4); save `docs/release/launch-gate-table-<date>.md` | Agent + owner | M6 | Table shows all included features' gates `cleared` |
| P7-02 | Data release `data-v1.0.0`: tag, release notes, unsimplified geometry and raw-source archive as assets; optional archival DOI (D-17) | Agent + owner | P7-01 | Release exists with checksums |
| P7-03 | Domain, DNS, HTTPS: add custom domain in Pages settings, verify the domain (GitHub recommends verification [verified]), enforce HTTPS, `www`/apex setup | Owner | P7-01 | Site resolves over HTTPS on the chosen domain; domain verified |
| P7-04 | Flip: set `SITE_STAGE=production`, run the production build (must pass), set `PAGES_DEPLOY_ENABLED=true`; change repo visibility if required for Pages | Owner | P7-01 | Live URL serves the build; `robots` allows indexing; stage banner gone |
| P7-05 | Live smoke tests (scripted): HTTP 200 on key pages; gzip on JSON; response time; axe on live URL; network assertion shows only the basemap host; privacy page matches reality | Agent | P7-04 | Report saved in `docs/release/live-smoke-<date>.md` |
| P7-06 | Monitoring and operations: free uptime check, weekly link job active, corrections inbox rota, response targets (G3 s.7.1) | Owner | P7-04 | First week's checks logged |
| P7-07 | Courtesy and launch communications (owner): notify NLD, USFS, partners as agreed; publish the limitations and ethics statement | Owner | P7-04 | Messages logged |
| P7-08 | Rollback plan rehearsed: redeploy previous tag; disable deployment variable; emergency suppression | Owner + agent | P7-04 | Rehearsal logged |
| P7-09 | 30-day review: errors reported, bandwidth versus 100 GB soft limit [verified limit], performance, requests from nations, NLD decision for Tier 1 | Owner | P7-04 + 30 days | Decision log updated |

**Milestone M7 (exit).** Live site, gates cleared, runbooks tested.

---

## 8. Risks

| # | Risk | Likelihood / impact | Mitigation | Owner |
|---|---|---|---|---|
| R1 | NLD declines, is slow, or terms prove unworkable | Medium / Low (design tolerates it) | Tier 0 permanent; integration removable; keep asking via Discord and email | Owner |
| R2 | USFS license reading not confirmed in time | Medium / High (blocks the base layer) | Ask early (P0-04); worst-case fallback is re-georeferencing the public-domain LOC maps, which is heavy (E3 s.6) | Owner |
| R3 | USFS data differ from assumptions (718 vs 752 polygons, date semantics, no cession/reservation field) | High / Medium | P1-08 field inventory first; keep `geometry_role` unverified; label dates "per Royce's Schedule" | Agent |
| R4 | Geometry too heavy or Pages does not gzip `.json` | Low-Medium / Medium | Measure in P1-09/P2-11; TopoJSON, tolerance, or Cloudflare (J3 s.8.4) | Agent |
| R5 | Misleading maps (precision, legality, private landowner fear) | Medium / High | G2 guardrails, legal panel, county-level cap, red-team tests (P4-10), legal sign-off (G-16) | Owner + legal reviewer |
| R6 | Nation-specific content published without review or against a nation's wishes | Medium / High | Review-status gating in the build (V14), suppression fast lane, silence is not consent | Owner |
| R7 | Misattributed successor nations or wrong endonyms | High / Medium | Endonyms only from nations; successor links stay `proposed` (`crosswalks/nation-successor-proposals.csv`) until a nation confirms; alias overrides reviewed by a human | Agent + owner |
| R8 | Donation listing harms donors or nations (fraud, defunct org, lookalike domain) | Low-Medium / High | F4 checklist, `last_verified`, link/domain-change checks, auto-delist PR, legal review (G-17) | Owner |
| R9 | Seed data contains unverified citations | High / High | Verification wave (G-12); visible badges; legal panels require zero unverified | Verification agent |
| R10 | Accessibility regressions (map, slider) | Medium / High | CI axe, keyboard e2e, manual audit, table equivalents | Agent |
| R11 | Fast-moving frameworks break the build (Astro, MapLibre, TypeScript majors) | Medium / Medium | Exact pins, 14-day cooldown, e2e gate, separate PRs for majors | Agent |
| R12 | Traffic spike exceeds Pages soft bandwidth limit | Low / Medium | Cloudflare in front or Cloudflare Pages migration (J3 s.8.4); keep files < 25 MiB | Owner |
| R13 | Basemap provider outage or policy change | Low / Medium | Local style copy; PMTiles fallback rehearsal | Agent |
| R14 | Sandbox cannot reach upstream data hosts | High / Low | `--from-dir` manual drop, owner runs fetch locally, Release-asset restore | Owner |
| R15 | Agent invents facts or citations while writing content | Medium / High | Rules in kickoff prompts, V5 checks, human citation check, AI policy (G3 s.12) | Owner |
| R16 | Credentials leak (NLD key, GitHub token) | Low / High | Secrets only in local env or Worker secrets; gitleaks; never in prompts | Owner |
| R17 | Maintainer capacity (corrections, removal requests) | Medium / High | Named steward, rota, response targets, wind-down statement | Owner |
| R18 | Mission drift to "commercial" use risks Pages and NLD terms | Low / High | No sales, no paywall, no sponsored placements; disclosure page | Owner |
| R19 | Project attribution error (OpenCivics named instead of Benjamin Life) | Low / Medium | CI check V15 | Agent |
| R20 | Two-language pipeline (Python graph stage, TypeScript everything else) causes CI or contributor friction | Medium / Low | Keep the file contract (`build/*.json`) stable and validated; port the builder to TypeScript only if friction appears (ADR-007 revisit trigger) | Agent |

---

## 9. Decision log (owner must decide)

"Needed by" means the first task that cannot proceed without it. Recommended defaults are proposals; the owner may choose differently. Record each decision with date in `docs/governance/decision-log.md`.

| ID | Decision | Recommended default | Needed by |
|---|---|---|---|
| D-01 | Project name, repo name, domain approach (the brief uses "Treaty Land Atlas" as a placeholder; the visual-identity tokens file uses the working name "What Was Promised"); avoid names that imply endorsement by nations or organizations | Keep placeholder until after first tribal advisory conversations; decide before P7-03 | P0-02 (repo name only), P7-03 |
| D-02 | GitHub account and ownership: which account owns the repo; whether agent git operations use the **clawmniharmonic** account per the owner's convention; commit-author identity; token scope; who may merge (J3 s.6) | Repo under the owner's chosen account; agent opens PRs only; fine-grained token scoped to one repo | P0-02 |
| D-03 | License for code and for the project's own data/text (J4 s.2.4) | Code MIT or Apache-2.0; data and text CC BY 4.0 with "Benjamin Life (@omniharmonic)" attribution | P1-01 (code), P7-01 (data) |
| D-04 | Accept ADR-001 to ADR-014 (Astro, Svelte islands, MapLibre, GeoJSON, OpenFreeMap, Pagefind, no analytics) | Accept | P1-01 |
| D-05 | Repository visibility and preview method: private until launch (recommended) vs public from the start with `noindex` (J3 s.3.2) | Private; enable Pages at launch | P0-02 |
| D-06 | Analytics: none at launch (ADR-010) | None | P6-10 |
| D-07 | Legal reviewer and budget; scope per P0-07 | Engage early; phase sign-offs (G-08, G-16, G-17) | P4 public release |
| D-08 | Tribal advisory approach: council vs per-nation review, compensation, named steward, pilot nations (G3 s.3, G4) | Per-nation review plus a small paid advisory council for policy; pilot with two nations the owner has a relationship with or can reach through proper offices | P0-06 |
| D-09 | Approve and send the NLD message (J2 s.7); choose contact route | Edit, send via Discord and email | P0-03 |
| D-10 | Courtesy/clarification notes to HCN, OSU, IDA/MIAC, Newberry (Appendix A) | Send OSU/IDA courtesy; HCN only if the Land-Grab layer is planned | P0-09 |
| D-11 | Counterfactual cut-point years and default lens (G2 s.11) | 1783, 1830, 1851, 1868, 1871, 1887; Federal-record lens default with flags one click away; each date verified against Kappler/Stat. | P4-04 |
| D-12 | Offer any place lookup? (G2 s.11) | County-level only; no addresses | P3-04 / P6-03 |
| D-13 | Scope for Alaska and Hawaii (distinct legal contexts, G3 s.6) | Include as context-labeled entries only after legal-reviewer advice; not on the treaty slider | P3-01 |
| D-14 | Organization display threshold and donation-policy review | Publish high/medium only; lawyer review before Phase 5 release | P5-01 |
| D-15 | Launch policy for `[from-memory]` items | Show visible badge for `[from-memory]` cites; require zero in legal-status panels and tours; verification wave covers all treaty/case rows displayed prominently | P3-01 |
| D-16 | Languages: English at launch, Spanish next; Indigenous-language UI/audio only with community authorization | As stated | P6-04 |
| D-17 | Data archive/DOI for releases; hosting fallback triggers (J3 s.8.4) | Archive with DOI at `data-v1.0.0`; fallback triggers as in J3 | P7-02 |
| D-18 | AI-assistance disclosure on pages (G3 s.12) | Label in editorial notes; no nation narrative from model output alone | P3-01 |
| D-19 | Public corrections channel and tribal channel; who monitors; response targets | Named steward; acknowledge in a few business days; hide-then-review for nation requests | P0-10 |
| D-20 | Funding and conflict-of-interest disclosure | Publish before launch | P5-08 |
| D-21 | "Today" layer source: Census cartographic boundaries (recommended v1) vs BIA LAR (needs BIA OK) | Census | P1-11 |
| D-22 | Self-host fallback basemap now or only if needed | Only if needed; rehearse once | P6-05 |
| D-23 | Treaty text sources: link-only to OSU/IDA/UNL vs asking for ingest permission | Link-only | P3-01 |
| D-24 | Launch scope: which nations' pages (if any) at launch; whether the counterfactual explorer ships at v1 or after sign-offs | Ship general layers + Class P/D pages at v1; counterfactual and nation narratives only where G-15/G-16 are satisfied | P7-01 |
| D-25 | Edge display policy: show only `asserted_by_seed` and `accepted` edges in production; show `proposed` edges only with a "suggested connection, not yet reviewed" label in preview; hide proposed edges that touch a Nation or successor claim | As stated | P3-07 |

---

## Appendix A. Short draft clarification note (owner to review; not sent)

For USFS (adapt for HCN, OSU, IDA/MIAC):

> Subject: Question about reuse of "Tribal Lands Ceded to the United States" in a free educational website
>
> Hello, I'm Benjamin Life (@omniharmonic), building a free, non-commercial educational website about U.S. treaties with Native nations. I'd like to use the Forest Service's "Tribal Lands Ceded to the United States" polygons and attribute table as the basis for a historical cession map. Data.gov lists the dataset under CC BY 4.0, while the metadata XML lists access constraints as "None" with no explicit license and describes the data as informational only. Could you confirm: (1) that CC BY 4.0 applies to both the geometry and the attribute table; (2) that a simplified, re-projected derivative may be redistributed on a public website with attribution and a note that we modified it; (3) which polygon count is authoritative (718 or 752) and whether a newer version exists; and (4) the best way to report errors. I will show the Forest Service disclaimer next to the layer and will not present the data as legal boundaries. Thank you.
>
> Benjamin Life (@omniharmonic) [contact]

## Sources

Inputs: all files listed in J1 plus G1 s.19 (outreach list), G3 s.3 (consultation process), G4 s.3-5 (timeline tracks, tours, data model), F3 s.8 (acreage disagreement), F4 s.6 (donation policy). Verified limits and versions: see J1 Appendix A and J3 s.8.

## Confidence & Gaps

Confidence: medium. Sequencing and acceptance criteria are proposals; session counts are rough estimates and will change after the first measurements. Dependencies on tribal and legal review are the main schedule risk and are outside the coding agent's control.
