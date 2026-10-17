---
title: Architecture Decision Records - Treaty Land Atlas (static site, map, data, search, graph, accessibility)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# J1. Architecture Decision Records

*Numbers corrected by the Synthesis Agent on 2026-10-16 and updated after the verification correction pass to match `build/graph-build-report.md` (current build: 1,563 nodes, 3,543 edges, Nation 226, proposed 2,345, 29 orphans, 0 schema errors, 106 logged issues). The earlier scratch-run figures (1,529 / 3,476 / 194 / 31 / 12 / 164 / 2,280) are superseded.*

Design Agent J, file 1 of 6. Companions: `J2-native-land-integration-spec.md`, `J3-repo-ci-and-contribution.md`, `J4-licensing-and-release-gates.md`, `J5-build-roadmap.md`, `J6-claude-code-kickoff-prompts.md`.

Inputs read: `00-RESEARCH-BRIEF.md`, the design-wave graph schema (`docs/design/schema/`), `scripts/build_graph.py`, `crosswalks/`, `docs/design/tokens.css`, `docs/data/E1-E3`, `docs/research/A3`, `G2`, `G3`, `G4`, `F4`, `G1` (licensing matrix), and the seed-data READMEs and CSV headers.

Tags: `[verified]` = checked this session (fetched docs or ran a command); `[from-memory]`; `[estimate]`; `[proposal]` = a design choice, not a fact. Version numbers marked "observed" were returned by `npm view` on 2026-10-16 and must be re-checked at install time.

How to read this file: each ADR has Context, Options, Decision, Consequences, and a Revisit trigger. A coding agent should treat the **Decision** lines as instructions and the **Acceptance** lines as tests. The owner (a technical non-developer) only needs the "Plain-language summary" at the top of each ADR and the decision list in section 0.

---

## 0. Summary of decisions

| ADR | Topic | Decision |
|---|---|---|
| 001 | Static site generator | **Astro** (static output) with TypeScript |
| 002 | Interactive UI inside Astro | **Svelte 5 islands** for the map app, slider, filters, tours; plain Astro components for everything else; map engine written as framework-neutral TypeScript |
| 003 | Map library | **MapLibre GL JS** |
| 004 | Geometry format | **Quantized GeoJSON** (served with a `.json` extension) for cessions and the "today" layer. **PMTiles** only for large optional layers and a fallback basemap. **TopoJSON** only if measured size exceeds budget |
| 005 | Basemap | **OpenFreeMap** (Positron-style, labels reduced) at launch; **Protomaps PMTiles US extract on object storage** as the documented fallback |
| 006 | Time-slider rendering | One GeoJSON source, one "current year" value pushed to the style (global-state expression, with `setFilter` as fallback); pipeline precomputes `t_first`, `t_last`, event arrays |
| 007 | Data pipeline | Seed CSVs stay canonical tables. The design-wave graph contract (`docs/design/schema/*.schema.json`), the existing Python graph builder (`scripts/build_graph.py`) and the root `crosswalks/` folder are **adopted, not rebuilt**. A TypeScript pipeline adds table validation, geometry, lite JSON emit, and release gates. Raw upstream downloads live in GitHub Release assets, not in git |
| 008 | Search | **Pagefind** |
| 009 | Graph visualization | **Build-time layout, rendered as accessible SVG** (d3-force run headless in Node) for per-page neighborhood graphs; always paired with a plain related-items list. No whole-graph hairball in v1 |
| 010 | Analytics | **None at launch.** Optional cookieless counter later, only by explicit owner decision |
| 011 | Performance budgets | See table in ADR-011 |
| 012 | Accessibility | WCAG 2.2 AA; map is never the only way to reach content; native `<input type="range">` slider |
| 013 | i18n and Unicode | English at launch, Spanish next; UTF-8/NFC everywhere; self-hosted Noto fonts; `lang` attributes on Indigenous-language text |
| 014 | Privacy and third-party requests | Only the basemap host is contacted at runtime; no third-party fonts, scripts, analytics, or embeds |

---

## ADR-001. Static site generator

**Plain-language summary.** We need roughly 1,000 pages generated from data (one per treaty, nation, case, statute, violation, organization), plus a heavy interactive map page. Astro builds the pages as plain HTML (fast, readable without JavaScript, good for screen readers and search) and lets us add JavaScript only where we need it.

**Context.**
- Content is data-driven: the graph builder currently produces 405 instrument nodes (277 of them NARA-only skeletons), 52 statutes, 104 cases, 62 violations, 226 nations, 67 organizations, 42 campaigns, and 44 places [verified by running the builder on a scratch copy]. With glossary, eras, and tours the site is on the order of 1,000 pages [estimate].
- One page (the map) is a heavy single-page app. All other pages should work with no JavaScript (E3 section 7 asks for a no-JS fallback; G3 section 11 asks for non-map equivalents).
- GitHub Pages serves static files only [verified: docs list size, bandwidth, build limits; no server code].
- The builder is a coding agent directed by a non-developer. Conventions, good docs, and few moving parts matter.

**Options compared**

| Criterion | Plain Vite + TypeScript | **Astro** | SvelteKit (static adapter) | Eleventy (11ty) |
|---|---|---|---|---|
| Generates ~1,000 pages from data | Not built in; hand-rolled prerender script | Yes: dynamic routes with `getStaticPaths`, content collections | Yes: prerendering, `entries()` | Yes: data files + pagination, very simple |
| Ships zero JS by default | No (SPA) | **Yes** (islands) | No (hydrates whole app unless configured) | Yes |
| Works with JS disabled | Only with extra work | **Yes** | Yes if prerendered, but hydration is the default mental model | **Yes** |
| Interactive islands (map, slider) | Everything is interactive | **Yes**, any framework or none | Native, one framework | Needs a separate bundler step |
| Type-safe content and data | Manual | Content collections with schemas; `astro check` | Strong via TypeScript | Weak by default |
| Search integration | Manual | Pagefind runs on `dist/` after build (any generator) | Same | Same |
| GitHub Pages `base` path handling | Config | Config (`site`, `base`) | Config (`paths.base`), easy to get wrong | Config (`pathPrefix`) |
| Learning surface for an agent | Low for SPA; high for SSG hand-roll | Moderate | Moderate (framework conventions) | Low, but interactivity story is weak |
| Risk | We would rebuild an SSG | Fast-moving major versions (observed: 7.4.0; requires Node >= 22.22.0 [verified via `npm view astro engines`]) | Fast-moving too (kit observed 3.1.0) | Smaller ecosystem for typed map islands (observed 3.1.7) |

**Decision.** Astro, `output: 'static'`, TypeScript strict mode, Node 22 LTS line pinned in `.nvmrc`. Rationale: the content-heavy, mostly-static, one-heavy-island shape is exactly what Astro is for; HTML-first output meets the accessibility and no-JS requirements by default.

**Consequences.**
- All internal links must go through one helper (`href()` using `import.meta.env.BASE_URL`) so the site works both at `user.github.io/repo/` and on a custom domain.
- Astro and integration majors move quickly. **Do not rely on remembered APIs**: the first task of the scaffold session is to read the current Astro docs (llms.txt or docs site), scaffold with the official `create-astro` flow, and record exact versions in `docs/design/ADR-versions.md`.
- Pin policy: exact versions in `package-lock.json`; only adopt releases at least 14 days old; Dependabot groups updates weekly (see J3).

**Revisit trigger.** If Astro's static pipeline cannot render the page count within the CI time budget (build > 15 minutes), or a breaking major lands mid-project, evaluate Eleventy for the content pages with the map as a separate Vite bundle.

**Acceptance.** `npm run build` produces `dist/` with HTML for every published entity; opening any non-map page with JavaScript disabled shows its full text, citations, and a static locator map.

---

## ADR-002. Interactive UI layer inside Astro

**Context.** The map page needs shared state (year, layers, selection, filters, tour step) across a slider, layer panel, list/table view, popup, and URL hash.

**Options.** (a) Vanilla TypeScript with custom elements; (b) React islands; (c) Svelte 5 islands (observed: svelte 5.57.2, `@astrojs/svelte` 9.1.0); (d) Preact/Solid.

**Decision.** Svelte 5 islands for `MapApp`, `TimeSlider`, `LayerPanel`, `EventList`, `TourPlayer`, `SearchBox`. Reasons: small compiled output, built-in reactive stores for the shared state, plain-HTML-like templates that coding agents write reliably, first-class Astro integration. **The map engine itself (`src/lib/map/`) is framework-neutral TypeScript** with an explicit `MapController` interface so the UI layer can be swapped.

**Consequences.** Two dependencies (Svelte plus the Astro integration). Components must follow the accessibility rules in ADR-012; each interactive island has a server-rendered, no-JS equivalent described there.

**Revisit trigger.** If Svelte/Astro integration breaks on an Astro major, fall back to vanilla custom elements for the three simplest islands.

---

## ADR-003. Map library

**Context (E3 section 3).** 718 to 752 cession polygons [disputed count], coarse (1:2,000,000) geometry; optional later layers of tens of thousands of polygons (Land-Grab parcels, about 79,461 [verified in E2]).

**Options**

| Option | Fit | Notes |
|---|---|---|
| **MapLibre GL JS** (BSD-3-Clause, observed 6.14.0 [verified via npm]) | Best | WebGL; data-driven styling; vector tiles; PMTiles protocol; official time-slider and filter examples [verified in E3]; handles tens of thousands of polygons |
| Leaflet | Acceptable now, weak later | Simple; SVG/canvas gets sluggish with many complex polygons; time filtering re-renders layers |
| deck.gl | Overkill | GPU layers, arcs, animation; larger bundle; consider only for later flow/route animation |
| OpenLayers | Not needed | Projection power we do not need |
| Mapbox GL JS | Avoid | Token and license terms; no benefit here |

**Decision.** MapLibre GL JS, loaded only on map pages via dynamic `import()`. Do not use Mapbox-hosted anything.

**Consequences.**
- Requires WebGL. The no-WebGL path is the static SVG locator map plus the table/list view (ADR-012). A feature test (`maplibregl.supported`-style check or try/catch on map creation) shows the fallback with an explanation, never a blank box.
- Pin an exact MapLibre version; read release notes before upgrading (a major change occurred between the versions I remember and the one observed).

**Acceptance.** Map page loads, renders cessions, and shows the fallback when WebGL is disabled (Playwright test with `--disable-gpu --disable-webgl` flags).

---

## ADR-004. Geometry formats: GeoJSON vs TopoJSON vs PMTiles

**Context.** E3 estimates the whole Royce layer at roughly 0.5-2 MB after simplification and gzip [estimate; unmeasured because the research sandbox could not download the data]. PMTiles needs HTTP range requests; the Protomaps docs list GitHub Pages among hosts but explicitly confirm range support only for some others [verified]; E3 notes range requests on Pages are reported to work, unverified.

**Decision.**

| Layer | Format | Why |
|---|---|---|
| Royce cessions (primary) | **GeoJSON**, coordinates quantized to 4-5 decimals, unused properties removed, served as `.json` | One file, loads once, filter in the browser, no tile server. TopoJSON saves bytes only where polygons share edges; Royce polygons mostly overlap rather than tile, so expected savings are small |
| Cession events and attributes | JSON arrays, separate file, joined by `cessnum` | Keeps geometry file small; load lazily for panels |
| "Today" layer (Census AIANNH cartographic 1:500k) | GeoJSON | A3 reports a 1.4 MB shapefile [verified]; GeoJSON after simplification should be of similar order |
| Large optional layers (Land-Grab parcels, any future county-level layer) | **PMTiles** on object storage (R2) | Only when built; keeps Pages small |
| Basemap fallback | **PMTiles** US extract, low max zoom | Only if OpenFreeMap is unavailable or policy changes |
| TopoJSON | Only if the measured GeoJSON gzip size exceeds 2 MB | Then add `topojson-client` |

**Gotcha to test in Phase 1 (important).** Do not assume Pages compresses `.geojson`. Use the `.json` extension and verify with `curl -sI -H 'Accept-Encoding: gzip' <url>` that `Content-Encoding: gzip` is returned `[from-memory: Pages compresses common text types]`. If not compressed, pre-compress is not possible on Pages; reduce precision further or move the file to Cloudflare (ADR in J3 section on hosting).

**Tooling.** Mapshaper (observed 0.7.87, MPL-2.0, build-time only) for simplification; Turf (build-time) for validity checks; keep the **unsimplified** geometry as a Release asset for audit (E3 section 2).

**Acceptance.** `public/data/layers/cessions.<hash>.json` <= 2 MB gzip; geometry validity report has zero invalid polygons or lists them in `data/KNOWN-ISSUES.md`; feature count matches the downloaded source (718 or 752; record which).

---

## ADR-005. Basemap and attribution

**Context.** E3 section 3: OpenStreetMap standard tiles are unsuitable for a site that may see traffic spikes and has donation links [verified policy summary]. OpenFreeMap: no key, no registration, no stated limit on map views, commercial use allowed, MIT license, attribution required (MapLibre adds it automatically), no SLA, self-hosting possible [verified, openfreemap.org]. Protomaps basemap: ODbL Produced Work, OSM attribution, planet file about 120 GB, extract by region [verified in E3].

**Decision.**
1. Launch on **OpenFreeMap** with a **local copy of the style JSON** (stored at `public/map/style-atlas.json`) derived from the Positron style, edited to: mute colors, hide modern boundary labels below state level where possible, and keep place labels minimal. Editing the style (not the data) is permitted; keep the attribution control visible with text "OpenFreeMap (c) OpenMapTiles, Data from OpenStreetMap".
2. Document and rehearse the **fallback**: `pmtiles extract` a contiguous-US plus Alaska/Hawaii extract at max zoom about 9 to 10, host on Cloudflare R2 (CORS rule: allow origin, methods GET/HEAD, headers `range` and `if-match`, expose `etag` [verified, Protomaps docs]); switch by changing one config value `basemap.provider`.
3. The privacy page discloses that map tiles are fetched from OpenFreeMap, which therefore sees the visitor's IP address and referrer.
4. Basemap sits below all atlas layers; atlas layers never inherit basemap labels as authority ("modern borders are context, not historical claims" - E3).

**Acceptance.** Attribution visible at every map state; one-line config switch to the self-hosted basemap works in a test build.

---

## ADR-006. Time-slider rendering strategy

**Context.** E3 section 4 and G2/G4: modes cumulative, window, and treaty-event snapshot; multi-track timeline; stop-the-clock; the last frame is the present; Royce data ends 1894.

**Data model (pipeline output, per cession polygon).**

```json
{ "type": "Feature",
  "id": 123,
  "properties": {
    "cessnum": 123,
    "t_first": 1830.7,
    "t_last": 1830.7,
    "dates": [1830.7],
    "legal_type": "treaty",
    "legal_type_basis": "derived_from_links",
    "geometry_role": "cession_or_reservation_unverified",
    "tier": "T3",
    "nation_ids": ["nat-example"],
    "instrument_ids": ["TLA-T-199"],
    "geo_id": "geo-royce-123",
    "flags": ["dates_are_royce_schedule_dates"]
  },
  "geometry": { "type": "MultiPolygon", "coordinates": [] } }
```

Notes: `t_first` and `dates` come from `cessdate1-5` (verified field names in A3); date semantics are unconfirmed (signing vs ratification vs proclamation), so the UI labels them "date per Royce's Schedule" and the stop-the-clock engine re-derives effective dates from the instrument table (G2 section 8.3). `geometry_role` stays "unverified" until a reviewer decides cession vs reservation (E3 section 4.1 notes the distinguishing attribute is unverified).

**Rendering.**
- One GeoJSON source `cessions` with `promoteId: "cessnum"`.
- Slider holds integer year `Y` (domain 1784-1894 for Royce mode; extends to the present in statute/case mode, where the map shows the Today layer plus event markers and a visible notice: "Cession geometry ends in 1894. Later changes are shown as events, not areas.").
- **Primary mechanism:** push `Y` into the style as global state and drive `filter` and `fill-opacity` with a `["global-state", "year"]` expression, so a slider tick does not rebuild filters `[from-memory: MapLibre global-state / setGlobalState exists in recent versions; verify in the pinned version's docs]`. **Fallback:** `map.setFilter('cessions-fill', ["<=", ["get","t_first"], Y])` throttled to one call per animation frame (the pattern in MapLibre's official time-slider example [verified exists in E3]).
- Modes: **Cumulative** (`t_first <= Y`), **Window** (any entry of `dates` within `[Y-N, Y]`, N in {1, 5, 10, 25}), **Event snapshot** (treaty markers from the instrument table, not from Royce geometry).
- Highlight "just changed" polygons (within N years of Y) with a thicker outline via an expression; do not animate fills (motion).
- Overlap: fills at constant low opacity with outlines; legend explains that darker areas mean overlapping records, not "more ceded". Acreage is never computed by summing polygon areas (E3 4.3); acreage numbers come only from cited sources, shown as ranges.
- Encoding of legal type: pattern fills plus outline style (solid, dashed, dotted), never color alone. Patterns are generated at runtime with a small canvas helper and registered with `map.addImage`.
- URL state: `#y=1868&m=cum&l=cessions,today&c=44.5,-103.1,5&sel=TLA-T-300`. Parsed on load; updated with `history.replaceState` (debounced). No tracking.
- Tracks: below the slider, four parallel tracks (G4 section 3.1) - Instruments; Alterations and violations; Law and resistance; Returns and restoration - rendered from `timeline-events.json` as an HTML list per track (not canvas), each event a link.

**Acceptance.** A scripted Playwright run drags/keys the slider across 110 years while measuring frame time: p95 main-thread task per tick <= 16 ms on a 4x CPU-throttled profile [proposal]; the cumulative feature count at 1868 equals an independent count from the CSV-derived dates.

---

## ADR-007. Data pipeline: seed CSVs to normalized graph to static artifacts

**Plain-language summary.** Other design work already produced a graph schema, a graph-building script, and hand-made link tables. We keep all of that and add the missing pieces: geometry processing, a small public data export, validation, and the release gates.

**Context.**
- Seeds (UTF-8 CSV, in `seed-data/`): treaties (135 rows, 21 columns), NARA index (376), cases (104), statutes (51), violations (62, multi-valued `violation_type`, free-text `treaty_name`/`related_cases`), organizations (67), campaigns (42), tribe-org-map (86 edges keyed by a free-text nation string), policy eras (9), geodata sources (24). Only six non-ASCII characters appear in the seeds (checked by script), so **endonyms are not yet in the data**.
- The design wave already delivered, in this repository: `docs/design/schema/entities.schema.json` and `edges.schema.json` (JSON Schema draft 2020-12, `schema_version` 0.1.0, 13 node types and 31 edge types in `x-edge-types`); `scripts/build_graph.py` (Python 3 standard library, 1,331 lines); and `crosswalks/*.csv` (`nation-entities.csv`, `nation-aliases.csv`, `nation-link-overrides.csv`, `nation-successor-proposals.csv`, `case-instrument-links.csv`, `violation-instrument-links.csv`, `violation-statute-links.csv`, `campaign-violation-links.csv`, `case-doctrine-statute-edges.csv`, `statute-merge.csv`). The builder's report refers to a companion `docs/design/H1-graph-data-model.md`, which was not present when this ADR was written; read it when it exists.
- I ran the builder on a scratch copy on 2026-10-16 (not in the repo) [verified]: **1,563 nodes and 3,543 edges** (Instrument 405, Statute 52, Case 104, Doctrine 56, PolicyEra 9, Violation 62, Nation 226, Organization 67, Campaign 42, Place 44, Source 496), **29 orphans, 0 schema errors, 106 logged issues**. Edge status was `asserted_by_seed` 1,198 and `proposed` 2,345; **none `accepted`**. 277 of the 405 Instrument nodes are NARA-only skeletons. The raw output is large (`nodes.json` about 2.5 MB, `edges.json` about 2.9 MB), so it must never be shipped to browsers as is.
- Contributors may be researchers and educators, not developers.

**Decision.**

1. **Canonical authored tables stay in `seed-data/*.csv`.** Renaming is rejected because the research documents link to those paths. Add `seed-data/CANONICAL.md`.
2. **The graph contract is the design-wave schema.** Node types: Instrument, Nation, Place, Violation, Case, Statute, PolicyEra, Organization, Campaign, Source, Doctrine, Person, GeoFeature. IDs follow the schema patterns (Instruments keep `TLA-*`; Nations are `nat-*`; GeoFeatures are `geo-*`; legacy `TLA-S-*` ids live in `aliases` of the merged `stat-*` node). Every node carries `confidence`, `verification_status`, `flags`, `provenance`, `tribal_review`, `publication`, `data_class` (P, D, N, R), and `sensitivity`. The schema's `NodeCommonRules` turn the G2/G3 ethics requirements into validation failures (for example: no narrative while `tribal_review.status` is `not_yet_contacted`, `invited`, `edits_requested`, `declined`, or `withdrawn`; a nation-specific node can be `published` only after `reviewed` or `co_authored`). **The pipeline must not weaken these rules.** Schema changes are made by pull request with a `schema_version` bump.
3. **Graph stage = `scripts/build_graph.py`, kept in Python.** Do not rewrite a working 1,331-line builder in Phase 1. The TypeScript pipeline calls it as a stage and treats `build/nodes.json` and `build/edges.json` as a file contract validated with Ajv (2020-12 build of Ajv). CI needs Python 3 (`actions/setup-python`). Port to TypeScript only if cross-language friction shows up in practice (revisit trigger).
4. **TypeScript pipeline** (`pipeline/`, run with `tsx`) owns: table validation (Zod) for contributor-edited CSVs, USFS/Census fetch and restore, geometry processing, emit of public files, validation V1-V16, license/release gates.
5. **Crosswalks live in the existing root `crosswalks/` folder** (not `data/crosswalks/`). New crosswalks this project adds: `instrument-royce.csv` (instrument id to Royce `cessnum`, basis, status), `tribal-review-ledger.csv` (see item 7). The builder is small-patched (in task P1-07) to read the ledger and the suppression list.
6. **Overlays** in `data/overlays/<type>/<id>.md` (Markdown + YAML front matter) hold what a CSV cell cannot: plain-language narrative, content warnings, tribal-account text, tour-linked notes. Joined by node id. Overlays never carry review state.
7. **Review state is recorded once**, in `crosswalks/tribal-review-ledger.csv` (`node_id, status, scope, date, reviewer_role, record_id, notes`; statuses exactly the schema enum: `not_yet_contacted`, `invited`, `reviewed`, `co_authored`, `edits_requested`, `declined`, `withdrawn`). The builder reads it to set `tribal_review` and the derived `publication` object. `record_id` points to a private record, never to correspondence. Silence is never consent: the default for any node absent from the ledger is `not_yet_contacted`.
8. **Suppression** (`data/suppress.yaml`) overrides everything at emit time, including search, graph, tours, and static maps (J3 s.7.4).
9. **Edge status policy.** Public production shows edges whose status is `asserted_by_seed` or `accepted`. `proposed` edges are shown only with the label "Suggested connection, not yet reviewed" in preview builds, and are hidden in production when they touch a Nation or a successor relationship (decision D-25).
10. **Generated artifacts are not committed**: `build/`, `public/data/`, `dist/`. The PR check posts a data-diff summary (row counts, node/edge counts by type, size per layer, new unresolved items, schema errors) as a job summary.
11. **Determinism.** Hashed public files contain no timestamps (the builder's `generated` field is stripped at emit); sorted keys; CI runs the emit twice and compares hashes.

Stages:

| Stage | Command | Language | Does | Output |
|---|---|---|---|---|
| fetch | `npm run data:fetch` | TS | Downloads upstream (USFS REST in pages of 2,000 with `exceededTransferLimit` handling [verified in E3]; Census file) to `data/sources/<src>/<date>/`; writes SHA-256 manifest. Network; run manually or by the refresh workflow | Release asset + `data/sources/manifest.json` |
| restore | `npm run data:restore` | TS | Downloads the pinned raw files from the repo's own GitHub Release and verifies checksums. Used by CI and fresh clones | `data/sources/**` (git-ignored) |
| ingest | `npm run data:ingest` | TS | Parse seed CSVs with Zod, report row-level errors | report |
| graph | `npm run graph:build` | Python | Runs `scripts/build_graph.py`: nodes, edges, unresolved issues, report | `build/nodes.json`, `edges.json`, `unresolved.json`, `graph-build-report.md` |
| geometry | `npm run data:geometry` | TS | Reproject to WGS84, repair, derive `t_first`/`legal_type`/`tier`, simplify and quantize with Mapshaper, join events; create `GeoFeature` records | `public/data/layers/*.json` + `build/geometry-report.md` |
| emit | `npm run data:emit` | TS | Apply publishability and suppression; write `graph-lite`, per-entity JSON (with 1-hop edges), timeline events, search metadata, `manifest.json` | `public/data/**` |
| validate | `npm run data:validate` | TS | Schema (Ajv on nodes/edges; Zod on tables), referential integrity, citation rules, license gate, size budgets, determinism | exit code + `build/report.md` |

Public file shapes (client never loads the raw graph): `graph-lite.json` (id, type, label, years, status; target <= 400 KB gzip), `entities/<type>/<id>.json` (node plus 1-hop neighbors), `tables/timeline-events.json`, `tables/instruments-lite.json`.

**Consequences.** Phase 1 begins by running the existing builder and triaging its 29 orphans and 106 logged issues (0 schema errors in the current build) instead of rebuilding the graph. Two languages (Python 3 standard library plus TypeScript) are an accepted cost.

**Revisit trigger.** If contributors prefer spreadsheets, add an export/import round-trip script. If the Python stage becomes a CI burden or needs libraries beyond the standard library, port it to TypeScript behind the same file contract.

---

## ADR-008. Search

**Options.** Pagefind; Lunr/MiniSearch with a prebuilt JSON index; Fuse.js; a hosted service (Algolia etc.).

**Decision.** **Pagefind** (observed 1.5.2, MIT) [verified: it builds a static index from generated HTML, no server, runs after the build with `--site dist`, supports multilingual search and recommends `lang` on `<html>`]. Hosted search is rejected (third-party tracking; data-sovereignty posture).

**Design.**
- Pages carry `data-pagefind-body` on the main content; `data-pagefind-filter` attributes for `type`, `era`, `nation`, `confidence`; `data-pagefind-meta` for title, year, citation.
- Exclude nav, footers, disclaimers via `data-pagefind-ignore`.
- Search UI is a Svelte island that lazy-loads the Pagefind JS API only when the box is focused; results render as an ordinary list with `aria-live="polite"` count announcements.
- **Diacritics and alternate spellings:** index each entity's `search_aliases` (historical names from treaties, endonyms, ASCII-folded forms) in a visually hidden element inside `data-pagefind-body`. Acceptance test: searching "Haudenosaunee", "Iroquois", "Lakota", and an ASCII-folded form of a fixture name with diacritics all find the expected page `[from-memory: Pagefind's handling of diacritics must be tested, not assumed]`.
- No query logging (there is no server).

**Acceptance.** Playwright test: type a query, results appear, keyboard selects a result, focus moves to the target page heading.

---

## ADR-009. Relationship graph visualization

**Context.** The knowledge graph is the project's conceptual core, but a whole-graph force-directed view of about 1,000 nodes is unreadable and inaccessible. G4 asks for entry points by nation, place, theme, and tour rather than "explore the hairball".

**Options**

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **d3-force run at build time, rendered as static SVG** (d3-force 3.0.0 observed, ISC) | Zero runtime physics; deterministic; SVG nodes are focusable links; works without JS; tiny | Layout is fixed (no dragging) | **Chosen for per-page neighborhood graphs** |
| Cytoscape.js (observed 3.34.4, MIT) | Full graph toolkit, layouts, canvas | About 100+ KB gz [from-memory]; canvas accessibility is weak | Keep as the option for a later "explore" page |
| Sigma.js + graphology (WebGL) | Handles very large graphs | Overkill; poor a11y | No |
| vis-network | Easy | Unmaintained concerns; canvas | No |
| Chronological swimlane (x = year, lane = type), computed at build time | Reads like a timeline, no hairball; ideal for case/doctrine lineage | Needs layout code | **Chosen for the case-law lineage view** |

**Decision.**
1. **Neighborhood graph** on each entity page: the entity plus nodes within 1 hop (cap 25 nodes; "show all N related items" opens the list), laid out by headless d3-force in the pipeline, emitted as inline SVG by an Astro component. Nodes are `<a>` elements with visible text labels and `aria-label` including relation ("party to: Treaty with the Cherokee, 1835"). Edge types are distinguished by line style and labeled in a legend; never color alone.
2. **Accessibility fallback is the primary content**: a grouped list "Related items" (by relation type) rendered before the SVG; the SVG is `role="img"` with `aria-labelledby` pointing at the short description, or marked `aria-hidden` when the list carries identical information. Decide per component, do not duplicate announcements.
3. **Lineage view** for cases/statutes/doctrines: swimlanes by year (x) and category (y), static SVG plus an HTML table (year, name, holding, link).
4. **Optional interactive explorer** (Phase 6 stretch): Cytoscape island on `/explore/`, reduced to a chosen nation, doctrine, or tour, keyboard-operable via a side list; not in v1 scope.
5. Reduced motion: nothing animates by default.

**Acceptance.** A treaty page with 12 related nodes shows a legible SVG at 360 px width, passes axe, and has an equivalent related-items list in the DOM before the SVG.

---

## ADR-010. Analytics

**Context.** The site concerns Indigenous nations and data sovereignty (G3); visitors may include people with safety concerns; donation links go to third parties. GitHub Pages provides no server logs to the owner [from-memory].

**Options.** None; GoatCounter (cookieless, hosted or self-hosted); Plausible/Umami (self-host cost); Cloudflare Web Analytics (requires Cloudflare); Google Analytics (rejected).

**Decision.** **No analytics at launch.** Measure outcomes by (a) GitHub traffic insights for the repository [from-memory: shows clones/views of the repo, not the site], (b) organizations reporting referrals, (c) qualitative feedback via the corrections channel. If the owner later needs usage numbers for funders, adopt a cookieless, no-IP-storage counter (GoatCounter is the lowest-effort candidate [from-memory]) only after: a written decision-log entry, a privacy-page update, and tribal advisory input. Never add third-party tracking pixels, session replay, or fingerprinting.

**Consequences.** We cannot see what pages are popular; use CI-measured performance budgets and a periodic manual review instead.

---

## ADR-011. Performance budgets

Proposed budgets (enforced by `scripts/size-budget.mjs` and Playwright; values are proposals to be tuned after first measurement):

| Budget | Limit |
|---|---|
| Content page (HTML + CSS + JS, gzip) | HTML <= 60 KB, CSS <= 25 KB, JS <= 30 KB (search island lazy) |
| Map page JS, gzip | <= 450 KB (MapLibre plus app) |
| Cession geometry + events, gzip | <= 2 MB |
| Map page first-interactive transfer (excluding basemap tiles) | <= 3 MB gzip (E3 proposal) |
| Basemap tiles on first view | measured and reported, no hard budget |
| LCP / INP / CLS (Lighthouse mobile, throttled) | <= 2.5 s / <= 200 ms / <= 0.1 `[from-memory: standard Core Web Vitals thresholds]` |
| Slider tick | p95 main-thread work <= 16 ms at 4x CPU throttle |
| `graph-lite.json` (only if loaded in a browser) | <= 400 KB gzip; the raw `nodes.json`/`edges.json` (about 2.5 MB and 2.9 MB uncompressed) are never deployed |
| Total deployed site | <= 150 MB (Pages limit is 1 GB [verified]) |
| Any single file | <= 25 MB (keeps the Cloudflare Pages option open: its limit is 25 MiB per asset [verified]) |
| Build time | <= 15 min in CI (Pages deployment timeout is 10 min [verified], which covers deployment, not building) |

Techniques: dynamic import of MapLibre; hashed immutable filenames; no web-font blocking (`font-display: swap`, subsets); images as AVIF/WebP with explicit dimensions; no layout shift for the map container (reserve height); `<link rel="preconnect">` to the basemap host only on map pages.

---

## ADR-012. Accessibility (WCAG 2.2 AA)

**Standard.** WCAG 2.2 is a W3C Recommendation dated 12 December 2024 [verified]. New AA criteria that matter here: 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum) [verified: all three are AA]. Also: 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 1.4.1 Use of Color, 2.2.2 Pause/Stop/Hide (G3 section 11).

**Time slider.**
- Use a native `<input type="range" min max step="1">` with a visible label and `aria-valuetext` ("1868, 14 instruments by this year"). Arrow keys +/-1, PageUp/PageDown +/-10, Home/End to the ends (native behavior).
- Buttons beside it: previous/next **event** (jump to the next year with an event), and **cut-point chips** (1783, 1830, 1851, 1868, 1871, 1887 - pending owner decision D-11). These satisfy 2.5.7 (no drag required).
- Target size >= 24x24 CSS px (2.5.8), and sticky control bars must not cover the focused element (2.4.11): use `scroll-padding-top` equal to the bar height and test with keyboard-only tabbing.
- Debounced polite live region (`aria-live="polite"`, update at most once per 800 ms, only when the slider is idle): "1868. 14 instruments in effect. 3 events this year." No announcement per tick.
- Play/pause button with `aria-pressed`; **never autoplay**; default paused; honors `prefers-reduced-motion` by disabling play and showing step buttons only; time-lapse ends on the Today frame (G4 3.2).

**Map.**
- The map container is `role="region"` with an accessible name and an instruction ("Interactive map. Press Tab to reach controls; use the list view for all information"). Do not use `role="application"`.
- MapLibre canvas keyboard handlers (arrow pan, +/- zoom) stay enabled; a visible skip link jumps past the map.
- **Every map state has a non-map equivalent** (G3 s.11, E3 s.7): (1) a text summary generated from state; (2) an "Events in this view" table (instrument, date, nations, type, uncertainty tier, link) with sortable headers, bound to the same filters; (3) per-entity pages with a static SVG locator map and full text.
- Popups are replaced by a side panel with focus management (opens on Enter/click, focus moves to panel heading, Escape returns focus to the triggering feature/list item).
- Selecting features: the table rows and the map stay in sync; selecting a row highlights the feature; this is the keyboard path to feature details.
- Colors and spacing come from the design tokens in `docs/design/tokens.css` / `tokens.json` (visual identity work; Okabe-Ito based data hues, light/dark themes); do not invent a second palette.
- Encodings: legal type = pattern + outline style + legend text; uncertainty tier = dash/feather + label; contrast of UI text >= 4.5:1 and graphical objects >= 3:1.

**Testing.**
- CI: `@axe-core/playwright` (observed 4.14.0) on home, map, treaty, nation, case, search, tour pages with WCAG 2.0/2.1/2.2 A and AA tags; Playwright keyboard script for the slider.
- Manual audit in Phase 6: NVDA + Firefox/Chrome, VoiceOver + Safari (macOS and iOS), TalkBack, keyboard-only, 400% zoom/320 px reflow, forced-colors mode, reduced motion; plus a human review of tours with screen-reader users (G3 s.11).
- Publish an accessibility statement with known gaps and a contact route.

**Acceptance.** Zero axe violations at AA on the listed pages; the slider can be operated end-to-end with keyboard alone; each map page state has a table equivalent; manual audit report stored in `docs/release/a11y-audit-<date>.md`.

---

## ADR-013. Internationalization, Indigenous-language names, Unicode, fonts

**Context.** G3 section 6: endonym first, nation's preferred spelling with Unicode support, no synthesized audio or translation of Indigenous languages without community authorization (section 12). Seeds currently use period spellings from NARA/Kappler (not endonyms).

**Decisions.**
1. **UTF-8 everywhere; NFC normalization** of all strings at ingest (pipeline test fails on non-NFC output). Never fold diacritics in stored data; folding happens only in search aliases and URL slugs.
2. **Name fields** come from the Nation (and Place) definitions in `docs/design/schema/entities.schema.json` (`label`, `names[]` with kind and review, `entity_kind`, `federal_recognition`, `legal_context`, `endonym_status`). Do not invent parallel fields; if something is missing (for example `endonym_source` or `endonym_lang` as a BCP 47/ISO 639-3 code), add it through a schema change with a version bump. Endonyms are filled only from nations' own sources or nation-provided text, never from model memory. While `endonym_status` is `none_recorded` or `per_seed_unreviewed`, the page shows the best available name with "endonym not yet confirmed" and the historical name "as named in the treaty". Slugs are ASCII-folded; display names are never folded.
3. **`lang` attribute** on every inline span of Indigenous-language text (e.g., `<span lang="chr">`); the page language stays `en`. Add `dir` handling only if a right-to-left script is ever included (not expected).
4. **Fonts:** self-host (no Google Fonts requests, see ADR-014). Use Noto Sans/Noto Serif via Fontsource (OFL) with `unicode-range` subsets (Latin, Latin Extended, plus Cherokee loaded only when the characters appear). Add Canadian Aboriginal Syllabics only if a record needs it. Fallback stack ends in `system-ui`. Rendering fixture file `tests/fixtures/unicode-names.txt` includes strings with: modifier letter turned comma/okina (U+02BB), combining marks (U+0313, U+0301, U+0328), `h` with caron or stroke variants used in Dakota/Lakota orthographies, Cherokee syllabary (U+13A0 block), colons and glottal marks. These are **rendering fixtures only, not authoritative spellings**.
5. **Sorting and collation:** `Intl.Collator` with locale-appropriate settings; sort nation lists by display name, never by slug.
6. **Search folding:** apostrophe-like characters (U+0027, U+2019, U+02BB, U+02BC) are *different letters in some languages*; fold them together only inside the search index.
7. **Site translation:** Astro i18n routing configured with `defaultLocale: 'en'` and no prefix for English; Spanish (first, per G3 section 11) lives under `/es/`. UI strings in `src/i18n/en.json`. Not translated at launch; structure only. Indigenous-language UI or audio only with community authorization, per G3.
8. **Dates:** ISO dates in data; display with `Intl.DateTimeFormat`. Pre-1752 dates in the data are in the Gregorian calendar as given by the sources; add a glossary note rather than converting.

**Acceptance.** `tests/unicode.spec.ts` renders the fixture page and checks that no glyph falls back to tofu (via a canvas measurement or visual regression), Pagefind finds folded forms, and sorting does not break on combining marks.

---

## ADR-014. Privacy and third-party requests

**Decision.** At runtime the site contacts **only**: its own origin and the basemap host (OpenFreeMap, or R2 if switched). No Google Fonts, no analytics, no social embeds (videos are link-outs), no CDN-hosted scripts (all JS bundled). Cookies: none. `localStorage`: only for user-chosen display preferences (reduced-motion override, text size), and the site must work with it blocked.

Because GitHub Pages cannot set response headers, add a `<meta http-equiv="Content-Security-Policy">` that restricts `script-src` to `'self'`, `connect-src` to self and the basemap host (and the NLD relay only when enabled, see J2), `img-src`/`font-src` to self and `data:`; add `<meta name="referrer" content="strict-origin-when-cross-origin">`. Outbound links to organizations use `rel="noopener noreferrer"`. Donation links open the organization's own page; the site never processes payments (E3 section 1: Pages prohibits sensitive transactions [verified]).

A plain-language privacy page lists these facts and the OpenFreeMap disclosure.

---

## Appendix A. Version and tooling snapshot (observed on 2026-10-16)

Observed with `npm view <pkg> version` from the project sandbox [verified]. Re-check at install time and prefer releases at least 14 days old.

| Package | Observed | License (observed) | Use |
|---|---|---|---|
| astro | 7.4.0 (Node >= 22.22.0) | MIT | SSG |
| svelte / @astrojs/svelte | 5.57.2 / 9.1.0 | MIT | islands |
| maplibre-gl | 6.14.0 | BSD-3-Clause | map |
| pmtiles | 4.5.0 | BSD-3-Clause | PMTiles protocol (only when used) |
| pagefind | 1.5.2 | MIT | search |
| mapshaper | 0.7.87 | MPL-2.0 | build-time simplification |
| d3-force / d3-geo | 3.0.0 / 3.1.1 | ISC | build-time layout and static maps |
| zod | 4.6.7 | MIT | schemas |
| vitest / playwright / @axe-core/playwright | 5.0.5 / 1.64.1 / 4.14.0 | MIT / Apache-2.0 / MPL-2.0 | tests |
| typescript | 7.0.2 | Apache-2.0 | language (confirm `astro check` compatibility before adopting a TypeScript major) |
| ajv, cytoscape, sigma | 8.20.0, 3.34.4, 4.0.3 | MIT | optional |

Tools not installed in the sandbox: `tippecanoe`, `ogr2ogr`, `pmtiles` CLI. They are **not needed in v1** (data is small); `pmtiles` CLI is needed only for the fallback basemap or parcel layers.

## Sources

Fetched this session: GitHub Pages limits (docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits); custom workflows for Pages (docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages); custom domains (docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages); Pagefind docs (pagefind.app/docs/); OpenFreeMap (openfreemap.org); WCAG 2.2 (w3.org/TR/WCAG22/); Protomaps cloud storage (docs.protomaps.com/pmtiles/cloud-storage); Cloudflare R2 pricing and Pages limits (developers.cloudflare.com/r2/pricing/, developers.cloudflare.com/pages/platform/limits/); `npm view` queries listed in Appendix A. Project inputs: E1, E2, E3, A3, G1-G4, F4, seed-data READMEs and CSVs.

## Confidence & Gaps

Confidence: medium. Verified: platform limits, tool versions, WCAG 2.2 status, OpenFreeMap terms. Not verified: real payload sizes (data not yet downloaded), whether Pages gzips `.json` as expected and serves range requests for PMTiles, MapLibre global-state API in the pinned version, Pagefind diacritic behavior, Astro 7 APIs (the agent must read current docs), CSP meta-tag behavior with MapLibre workers (needs `worker-src blob:` and `child-src blob:` - test early). None of these designs has been prototyped.
