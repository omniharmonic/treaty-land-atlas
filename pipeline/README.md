# Data pipeline

How the tables in this repository become the files the website reads. Plain-language guide; the design is in `docs/design/H3-storage-and-build-pipeline.md` and `docs/design/J3-repo-ci-and-contribution.md`.

## The short version

```sh
npm run data:build                    # seed CSVs + crosswalks -> graph -> public/data/
npm run data:validate                 # every check; writes build/report.md
npm run data:validate -- --mode=production   # same, but license and review gates become errors
```

`data:build` takes about ten seconds and needs no network: everything it reads is committed.

## What runs, in order

| Step | Command | Reads | Writes |
|---|---|---|---|
| 0. Fold in K1 research | `npm run k1:merge` | `docs/research/K1/data/` (proposals, findings, massacre sites, `verification/round*-*.csv`) | `crosswalks/land-status.csv`, `land-status-flags.csv`, `massacre-sites.csv`, `k1-findings.csv` |
| 1. Check the tables | `npm run data:ingest` | `seed-data/*.csv` | row errors on screen and in `data/KNOWN-ISSUES.md` |
| 2. Build the graph | `npm run graph:build` | `seed-data/`, `crosswalks/`, `data/derived/` | `build/nodes.json`, `edges.json`, `unresolved.json`, `graph-build-report.md` |
| 3. Publish | `npm run data:emit` | `build/`, `data/derived/`, `data/suppress.yaml`, `data/overlays/` | `public/data/` (git-ignored) |
| 4. Check everything | `npm run data:validate` | all of the above | `build/report.md` |

`data:build` runs steps 0 to 3. A new verification round needs no code change: add `docs/research/K1/data/verification/round<N>-<batch>.csv` (same columns; later rounds override earlier ones per finding) and rebuild.

These steps are run only when their inputs change:

| When | Command | What it does |
|---|---|---|
| Re-download upstream data | `npm run data:fetch -- usfs` / `-- census` | Downloads the Forest Service cession layer or the Census boundaries into `data/sources/raw/` (git-ignored) and pins each file's SHA-256 in `data/sources/manifest.json` |
| No network | `npm run data:fetch -- usfs --from-dir=/path` | Copies files you downloaded by hand and checks their checksums |
| No-federal-record mask | `npm run data:fetch -- nation`, then `npm run data:geometry -- no-cession` | Census nation outline minus the Royce areas, written to `data/derived/no-cession.json` |
| Rebuild geometry | `npm run data:geometry` | Joins, repairs, simplifies and quantizes the raw files into `data/derived/` (committed) and writes `build/usfs-field-inventory.md` |
| Relink cessions to treaties | `python3 scripts/link_royce.py` | Rewrites `crosswalks/instrument-royce.csv`, keeping human decisions. CI fails if this file is stale |
| Fold in new name research | `python3 scripts/merge_name_research.py <folder>` (run it twice) | Rewrites `crosswalks/nation-names.csv` and `crosswalks/nation-successor-research.csv` |
| Review links | `npm run links:review` | See "Reviewing links" below |
| Release check | `npm run release:check` | Prints the license and review gate table and regenerates `NOTICE.md` |

## Where the data lives

| Folder | What | Edit by hand? |
|---|---|---|
| `seed-data/` | The research tables: treaties, NARA index, cases, statutes, violations, organizations, campaigns, eras, geodata sources | Yes. Log every change in `data/CHANGELOG-DATA.md` |
| `crosswalks/` | Link tables: nation names, aliases, successors, Federal Register list, Royce links, review decisions | Yes, except the files a script rewrites (see above) |
| `data/derived/` | Cession geometry, cession events, today layer | No. Regenerate with `npm run data:geometry` |
| `data/sources/` | `manifest.json` (checksums) and the Federal Register list as parsed | No |
| `data/overlays/` | Narrative and content warnings per node, Markdown with front matter (see the README there) | Yes |
| `data/suppress.yaml` | Removal fast lane | Yes |
| `data/licenses/registry.yaml` | Every outside dataset, its terms, status and attribution text | Yes |

## How to add or fix a row

1. Open the CSV in `seed-data/` (a spreadsheet app is fine; save as UTF-8 CSV).
2. Change the row. Keep the id. Put a source URL in the source column. Mark anything you are not sure of with `[unverified]` or `[from-memory]` in the text; the site shows a badge for each.
3. Add a line to `data/CHANGELOG-DATA.md`: date, file, row id, field, old value, new value, source.
4. Run `npm run data:build && npm run data:validate`. Fix anything listed as an error.

A row with a bad date, an unknown code or a missing required field stops the build with a message like:

```
cases-seed.csv:2 case-fletcher-v-peck-1810 [year] expected a four-digit year
```

## Reviewing links

Most links in the graph were inferred (a matching name, a matching date) and are marked `proposed`. Every link is shown on the site with its status. Only a person can accept or reject one.

```sh
npm run links:review                      # the next 20 proposed links, nation links first
npm run links:review -- --type=depicts    # one kind of link
npm run links:review -- --interactive     # step through: a = accept, r = reject, s = skip, q = quit
npm run links:review -- --report          # counts, plus records with no links
npm run links:review -- --decide=e-0022e3790255 --decision=accepted --role="project owner"
```

Decisions go into `crosswalks/edge-reviews.csv` with your role and the date. Link ids are stable, so a decision keeps applying after every rebuild. A rejected link stays in `build/` for the record but is not published.

## How to read the reports

- `build/report.md`: one section per check (V1 to V14). Errors stop CI; warnings are listed so gaps are visible, not hidden.
- `build/graph-build-report.md`: counts by node and edge type, orphans, unresolved names.
- `build/usfs-field-inventory.md`: every field of the Forest Service table, with null counts and what the pipeline derived.
- `data/KNOWN-ISSUES.md`: generated findings plus hand notes.

## Rules the pipeline enforces

- Text stays Unicode NFC; diacritics and the ʻokina are never stripped.
- Silence is never consent: a nation's review status changes only through `crosswalks/tribal-review-ledger.csv`.
- Low-confidence organizations are published as records without website or donation links.
- Native Land Digital data is never stored in the repository or the build (`scripts/check-no-nld.mjs`).
- Two runs with the same inputs give byte-identical outputs (`SOURCE_DATE_EPOCH` pins the date).
- Production builds fail while any license or review gate is open.
