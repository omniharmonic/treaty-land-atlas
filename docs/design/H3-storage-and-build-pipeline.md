---
title: Storage options and build pipeline
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# H3. Storage and build pipeline

**Question.** Where should the atlas's knowledge graph live, and how does it get from the researchers' files to a fast static site on GitHub Pages?

**Short answer.** One source of truth: plain files in git (the seed CSVs, the `crosswalks/` CSVs, and Markdown overlays). One build that turns them into a validated graph. One emit step that writes small static JSON files for the browser. No database server anywhere in production. A Parachute vault can be a note-taking workspace beside this, but should not be the source of truth. The reasons follow, including where I am unsure.

This agrees with J1 ADR-007 ("seed CSVs stay canonical") and adds the comparison it did not need to spell out. Where J1 chose a tool (Pagefind for search), this document defines the data it needs and does not reopen the choice.

## 1. What the storage has to do

| Requirement | Why | Source |
|---|---|---|
| Reviewable by non-developers, with history | Researchers and, later, tribal reviewers must see what changed, who changed it and why. | Brief; G3 |
| Every fact keeps its source, confidence and review state | The ethics rules are data rules. | Brief; G3 |
| Static hosting only | GitHub Pages has no server code, and a soft site limit of about 1 GB with 100 MB per file. | E3 |
| Small client payloads | Mobile users on slow connections. | J1 ADR-011 |
| Private fields can be withheld | Data classes K and S must never be in the public build. | G3 |
| Removal on request, fast | A nation can ask to withdraw. The change must reach the site in one release. | G3 |
| A single person can run it | The project has one maintainer and volunteers. | Brief |
| Reproducible | The same inputs must give the same files. | J1 ADR-007 item 11 |

Scale today (build of 2026-10-16): 1,563 nodes and 3,543 edges. Raw `nodes.json` is 2.59 MB (about 203 KB gzipped at level 9) and raw `edges.json` is 3.00 MB (about 115 KB gzipped at level 9); re-measured after the correction pass. The full geometry, when it arrives, is a separate and larger problem (E3 estimates a Royce polygon file at roughly 0.5 to 2 MB after simplification). This is a small graph. That fact decides most of the comparison.

## 2. The four options

### 2.1 Parachute vault as the source of truth

**What it is.** The user's own note system, reachable through `mcp__parachute__*` tools. From the tool descriptions in this session: notes with paths, tags that can carry schemas (typed fields, with enums, required and indexed fields, and parent tags), `[[wikilinks]]`, links with a relationship string, typed `reference` fields that write links, a graph-neighbourhood query (`near`, `depth`), full-text `search`, metadata filters, and attachments. The vault in this session has 16,294 notes and 952 tags.

**For.** It is native to how the maintainer already works. Links and typed fields map well onto nodes and edges. A graph query is built in. It is pleasant for writing narrative notes (see H4).

**Against, and unverified.**
- I could not verify from the tool descriptions that a vault serializes to plain files in a form a GitHub Action can read. Without a documented export, a public site would depend on one person's running service.
- I did not verify that a tag's `relationships` configuration is enforced as a rule rather than stored as a hint. If it is a hint, the vault cannot reject an edge between the wrong types, which the JSON Schema does.
- The vault in this session is a personal vault with thousands of unrelated notes. Publishing from it risks exposing private material, and a separate vault for this project would be needed.
- Contributors and tribal reviewers cannot be asked to use it, and its history is not a public, reviewable change log like git.
- Review and withdrawal records need an audit trail that outlives any tool.

**Verdict.** Good as a working surface for research notes and drafts. Not a source of truth for a public, reviewed dataset. Use it for writing, and export from it (H4).

### 2.2 SQLite or DuckDB

**For.** Real queries (SQL joins and graph-like recursive queries), indexes, one file, and it is the natural format for analysis. DuckDB reads CSV and JSON directly. A browser can load SQLite compiled to WebAssembly, so even a static site could query it.

**Against.** A binary file does not diff in git, so review is poor and merge conflicts are unreadable. The graph is too small to need it: 3,543 edges are traversed in microseconds by plain JavaScript. SQLite in the browser adds a WebAssembly download of a few hundred KB and a worker, plus a database file in addition to the data, which is not worth it at this scale [from-memory on the size; measure before deciding]. Foreign keys do not carry the review and provenance logic that the schema's conditional rules do.

**Verdict.** Not the source of truth. A good *derived* artifact: if analysts or a future search page need SQL, build a `.duckdb` file from the JSON in CI and keep it out of the site.

### 2.3 Flat files: CSV tables, JSON, JSON-LD, GeoJSON

**For.** Diffable in git, so each change has an author, a date and a message, and a pull request is a review. Readable in a spreadsheet by non-developers. No service to run. Directly publishable on GitHub Pages. Already the form of all the research output. A JSON Schema can enforce the rules, and has (zero validation failures at the latest build, with negative tests proving the rules fire). Geometry fits GeoJSON or a tiled format (J1 ADR-004).

**Against.** No query engine of its own. Referential integrity is only what the build checks. A big CSV with long text cells is awkward in a pull request diff, so changes to prose are best in Markdown overlays. JSON-LD is possible but adds a vocabulary decision for little gain now (see 2.5).

**Verdict.** The source of truth.

### 2.4 Neo4j (or any graph database)

**For.** The graph is the natural shape, and Cypher is expressive for path queries ("every treaty with nation X and its violations, and the cases that interpreted them").

**Against.** It needs a running server, which cannot be hosted on GitHub Pages, so it would force a second hosting system, a paid or maintained instance and an API surface that must be secured and kept alive for years. For a heritage dataset that should outlive a company, that is the wrong dependency. The path queries H5 needs are 2 to 4 hops over 3,543 edges. Plain JavaScript on a static adjacency file handles them. If the project later has a large live research graph, Neo4j can ingest the same `nodes.json` and `edges.json` with a small loader.

**Verdict.** Not now. Keep the JSON a clean import format in case it is ever wanted.

### 2.5 Comparison

| | Parachute vault | SQLite / DuckDB | Flat files in git | Neo4j |
|---|---|---|---|---|
| Diffable, public history | No (service history) | No (binary) | Yes | No |
| Works on GitHub Pages | Needs an export (unverified) | Only as a WASM download | Yes | No |
| Non-developer can edit | Yes, in the app | No | Yes (spreadsheet or Markdown) | No |
| Enforces the ethics rules | Maybe (unverified) | Partly | Yes, via JSON Schema plus build checks | Partly |
| Handles 3.5k edges | Yes | Yes | Yes | Yes |
| Handles bigger graphs | Yes | Yes | Needs sharding past roughly tens of MB | Yes |
| Long-term survivability | Tool-dependent | Good | Best | Poor (server) |
| Running cost | Existing | None | None | Ongoing |

## 3. Recommendation

```
 seed-data/*.csv            (canonical authored tables, from the research wave)
 crosswalks/*.csv           (hand-made links, with a basis sentence per row)
 data/overlays/**/*.md      (narrative, tribal accounts, content warnings; planned in J1)
 crosswalks/tribal-review-ledger.csv   (review state; planned in J1)
 data/suppress.yaml         (emergency removal; planned in J1)
          |
          v   1. build_graph.py     (exists; stdlib Python; this wave)
 build/nodes.json, edges.json, unresolved.json, graph-build-report.md   (full, private to CI; never deployed)
          |
          v   2. validate           (JSON Schema, orphans, size budgets)
          |
          v   3. emit               (applies publishability + suppression; drops private fields)
 public/data/
     manifest.json
     graph-lite.json
     search-index.json   (or Pagefind input)
     entities/<type>/<id>.json
     tables/*.json
     layers/*.json       (geometry, when it exists)
          |
          v   4. Astro/Pagefind build -> dist/ -> GitHub Pages
```

Key properties:

1. **One writer for each fact.** Edit the CSV, never the JSON. The JSON is regenerated on every build and is not committed.
2. **The build refuses to publish what the rules forbid.** Narrative text on an unreviewed nation-specific node, a `published` nation-specific record before review, a low-confidence organization on a donation page, and an `accepted` edge without a reviewer fail validation.
3. **The emit step is a projection, not a copy.** It chooses which fields leave the building: no internal `provenance.source_file`, no `notes` flagged private, no `K`/`S` data, no timestamps (determinism), no suppressed ID anywhere (graph, entity file, search, tour).
4. **Removal is one commit.** Add the ID to `suppress.yaml` or set `declined`/`withdrawn` in the ledger. The next build removes the record from every public file.
5. **Every release carries its numbers.** The build report states node and edge counts, orphans, unresolved items and validation failures, and the release page says how many records have been reviewed by a nation (today, none).

## 4. Public file formats

### 4.1 Full build files (CI only)

`build/nodes.json`: `{schema_version, generated, counts, nodes[]}`. A node is as in H1, with every field. `build/edges.json`: `{schema_version, generated, counts, edges[]}`. An edge is as in H1. `build/unresolved.json`: `{issues[], orphans[], schema_errors[]}`. `generated` is a date, and must be dropped at emit for deterministic output.

### 4.2 `public/data/manifest.json`

```json
{
  "schema_version": "0.1.0",
  "data_version": "2026-10-16+<git-sha>",
  "counts": {"nodes": 1067, "edges": 2958},
  "review": {"nodes_reviewed_by_nation": 0, "nodes_total": 1563},
  "files": {"graph-lite.json": {"bytes": 0, "sha256": ""}},
  "licenses": ["..."]
}
```

The "nodes_reviewed_by_nation" counter is on the site's About page. It is the honest headline number, and it is zero today.

### 4.3 `public/data/graph-lite.json`

A compact projection for the exploration view and filters, using arrays instead of objects and ID lookups instead of repeated strings:

```json
{
  "nodes": [["TLA-T-369","Instrument","Treaty of Fort Laramie (1868) ...","m","not_yet_contacted"], ...],
  "edges": [["party_to","nat-sioux","TLA-T-369","p"], ...]
}
```

Field order: `[id, type, label, confidence initial, review status]` and `[type, source, target, status initial]`. `evidenced_by` and `Source` nodes are left out (they are loaded with an entity page). I measured this projection on the current build without writing it into the repository: 1,067 nodes, 2,958 edges, 276 KB uncompressed, about 41 KB gzipped (22 KB nodes, 20 KB edges). That is far inside the 400 KB gzip budget in J1 ADR-011, so the whole relationship graph can be loaded by the browser in one request, and path queries run on it client-side with no server.

If proposed edges are hidden in production (J1 ADR-007 item 9), graph-lite contains only `asserted_by_seed` and `accepted` edges, which is a much smaller and more conservative graph. That is a product decision; both variants use the same format.

### 4.4 Per-entity pages: `public/data/entities/<type>/<id>.json`

One file per node. Content: the public projection of the node, its edges grouped by edge type with direction, a lite record of each neighbour (id, type, label, status), its `Source` nodes with tier, and the review status. File names use the node ID as it is, URL-encoded. IDs contain only letters, digits and hyphens, so no escaping is needed. Roughly 1,000 entity files (every non-Source node) at an estimated 2 to 30 KB each [estimate; the biggest are the Sioux, Haudenosaunee and Cherokee nodes and the doctrines]. A very high-degree node (for example a popular doctrine with 40 cases) is paginated by edge type if its file exceeds 50 KB.

Static pages for the site (one HTML page per entity) are generated from these files by Astro. The JSON is for the interactive layers (graph view, side panels) and for people who want the data.

### 4.5 Search

Search needs two things, whatever the engine: the **names** (label, aliases, historical spellings) and **filters** (type, era, nation, confidence, review status). Alias lists are the valuable part: "Iroquois", "Haudenosaunee" and "Six Nations" must find the same entity; "Lakota" must find the Fort Laramie records; an ASCII-folded form of a name with diacritics must work.

- J1 ADR-008 chose **Pagefind**, which indexes the built HTML. The build must therefore render each entity's `aliases` and historical spellings into a visually hidden element inside the page body, as that ADR says.
- For a data-driven fallback or a type-ahead box, `public/data/search-index.json` is an array of `[id, type, label, aliases[], year, flags]` for the nine searchable types. On the current build that is 1,023 entries and about 21 KB gzipped (measured without writing the file). It can be queried by a 30-line scorer or by a small library.
- Search must not include suppressed or unreviewed narrative text, and must never log queries. There is no server to log them.

### 4.6 Geometry (when it exists)

Geometry is not in the graph files. A `GeoFeature` node carries only the lineage record (G2) and a `geometry_ref` pointing to a file in `public/data/layers/`. Layers follow J1 ADR-004. The graph says what the geometry *is* and how uncertain it is. The file is the shape.

## 5. Build pipeline details

### 5.1 Today (this wave)

`python3 scripts/build_graph.py` runs end to end in a few seconds on a laptop, needs only the standard library, and optionally validates if the `jsonschema` package is present. It writes the four files in `build/`. Latest results: 1,563 nodes, 3,543 edges, 0 schema failures, 29 orphan nodes, 106 logged issues (8 of them level `warn` apart from the orphans), no edge `accepted`. See `build/graph-build-report.md`.

Since the scratch run quoted in J1 ADR-007, J3 and J5 (1,529 nodes, 3,476 edges, 12 schema errors, 31 orphans, 164 issues), four things changed: the six reversed `responds_to` edges are swapped (that was the 12 schema errors); an unquoted comma in `statute-merge.csv` was fixed; 32 nation entities and a batch of aliases were added, which cut unresolved nation strings from 55 to 19; and bracket-aware splitting of the `related_cases` text removed 3 false "unmatched case" fragments (14 to 11). Also found by reading the output: three false nation links ("Blackfeet" inside Lakota records) and one class of false links ("Creek" inside "Swan Creek"), fixed in crosswalks. J1, J3 and J5 should be updated to the new baseline.

### 5.2 CI (planned in J3 and J5)

On each pull request: run the builder; fail on any schema error, any new unresolved reference (an error-level issue), any edge endpoint of the wrong type, any ethics-rule violation; post the report's counts and a diff against the main branch as a job summary. On merge: emit, validate again, build the site, deploy.

### 5.3 Rules for the human who edits

1. Change `seed-data/*.csv` only for research facts, and only when the research owner agrees (J6 says do not silently fix seed data). Log suspected errors in a known-issues file instead.
2. A new link between two records is a row in a crosswalk with a basis sentence. Never edit the JSON.
3. A new name for a nation is a row in `nation-aliases.csv` (and an `only_in` if the word is ambiguous).
4. A wrong automatic match is a row in `nation-link-overrides.csv` with a reason.
5. A review outcome is a ledger row. It is never inferred.

### 5.4 Failure modes to watch

- **Alias drift.** A new alias can silently create dozens of edges. The diff of edge counts per PR must be visible.
- **Crosswalk rot.** Crosswalks refer to IDs. The builder errors on a missing ID, which catches renames.
- **Seed rows renumbered.** Treaty IDs derive from the RIT number, which NARA fixes, but statute and case IDs derive from slugs and years. Keep the old ID as an alias on any change.
- **Two languages.** Python builds the graph; a TypeScript pipeline emits files (J1). The file contract (`nodes.json`, `edges.json`, the two schemas) is the seam. Validate it on both sides.

## 6. Optional: Parachute as a working surface

If the maintainer wants to write research notes in a vault, treat the vault as an *editor*, not a database. A one-way export (vault to overlay Markdown and ledger rows) must be written and tested before anyone depends on it, and the details are in H4. Do not publish directly from a personal vault.

## Sources

`docs/design/J1-architecture-decision-records.md` (ADR-004, 007, 008, 011), `J3-repo-ci-and-contribution.md`, `docs/research/E3` (GitHub Pages limits, polygon sizes), `docs/research/G2` and `G3`, `build/graph-build-report.md`, and the tool descriptions of the Parachute MCP tools in this session. Sizes in sections 1 and 4 were measured on the current build on 2026-10-16 [verified by measurement].

## Confidence & Gaps

Confidence: medium. The comparison of options is reasoned, not benchmarked, except for payload sizes. Parachute's export and rule-enforcement behaviour are not verified. WebAssembly SQLite sizes are from memory. I did not build the `emit` step; its file formats are specified here and the sizes of two of them are measured on a quick projection.
