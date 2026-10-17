---
title: Seed data README - cases-seed.csv and statutes-seed.csv
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Seed data: case law and statutes (Research Agent C)

Files: `cases-seed.csv` (104 rows) and `statutes-seed.csv` (51 rows). Narrative research is in `docs/research/C1-case-law-survey.md`, `C2-statutes-and-policy-eras.md` and `C3-doctrine-map.md`. UTF-8, comma-separated, quoted per RFC 4180. Lists inside a cell are separated by semicolons.

## cases-seed.csv

| Column | Meaning |
|---|---|
| `id` | Stable ID, `case-<slug>-<year>`. |
| `short_name` | Common short name. |
| `full_citation` | Bluebook-style citation. Inline brackets such as `[reporter page from-memory]` flag unverified parts. |
| `court` | Deciding court. |
| `year` | Year of decision (integer). |
| `nations` | Nation(s) involved, with endonyms only where known; inline `[from-memory]` flags unverified identifications. Confirm names with the nations before publication. |
| `treaty_at_issue` | Treaty or agreement at issue; `none` where there was none. |
| `holding_summary` | One to three sentences, plain language. |
| `land_rights_effect` | `advanced`, `eroded`, `mixed`, or `procedural` (an editorial label, defined in C1). |
| `doctrines` | Semicolon-separated tags from the controlled vocabulary in C3, Part 4. |
| `source_url` | A page actually read in this session; blank if none. |
| `confidence` | `verified` (citation, date and core holding confirmed in a source read this session), `from-memory`, `disputed`, or `unverified`. Sub-facts that are not confirmed carry inline tags in the cell. |

## statutes-seed.csv

| Column | Meaning |
|---|---|
| `id` | `stat-<slug>-<year>`. |
| `name` | Statute, resolution, regulation, proclamation or opinion name. |
| `year` | Year of enactment or issuance. |
| `citation` | Statutes at Large, Public Law, Federal Register or other citation. |
| `summary` | What it did. Figures quoted from secondary sources are labeled as such. |
| `effect_on_land_rights` | Same four values as above. |
| `doctrines` | Same controlled vocabulary. |
| `source_url` | Page actually read, blank if none. |
| `confidence` | Same scale. |

## Known data limits

- Reporter page numbers for several 2017-2023 Supreme Court decisions are flagged `[from-memory]`; the verification agent should check them against supremecourt.gov.
- The `land_rights_effect` label is an interpretation. Document it on any page that shows it.
- Treaty-count and acreage figures are not asserted in these files except where attributed to a secondary source in the row.
