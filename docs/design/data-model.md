---
title: Data model as built (Phase 1)
author: Benjamin Life (@omniharmonic)
date: 2026-10-17
status: living
---

# Data model as built

What the graph contains after Phase 1, and where each part comes from. The design is `H1-graph-data-model.md`; this file records what was built and where it differs. Schemas: `docs/design/schema/entities.schema.json` and `edges.schema.json`, now version **0.2.0** (all changes additive).

Counts below are from the 2026-10-17 build; `build/graph-build-report.md` always has the current numbers.

## Nodes (3,018)

| Type | Count | Comes from |
|---|---|---|
| Instrument | 405 | `seed-data/treaties-seed.csv` (128 seeded) and the NARA index (277 skeletons with NARA fields only) |
| Nation | 718 | `crosswalks/nation-entities.csv` (226) plus every entity printed in the 2026 Federal Register list (`crosswalks/federally-recognized-tribes.csv`, 573; 81 already existed) |
| GeoFeature | 724 | One per Royce cession in the USFS layer (`data/derived/cession-events.json`); 717 with geometry, 7 events-only |
| Source | 726 | Every URL in a seed or crosswalk row, plus the GEO-### geodata inventory |
| Case | 104 | `cases-seed.csv` |
| Violation | 62 | `violations-seed.csv` |
| Doctrine | 56 | Doctrine tags in cases and statutes, defined in `C3-doctrine-map.md` |
| Place | 53 | Atlas regions and US states |
| Statute | 52 | `statutes-seed.csv` plus one statute row only in the treaty seed |
| Organization | 67 | `organizations-seed.csv` |
| Campaign | 42 | `campaigns-seed.csv` |
| PolicyEra | 9 | `policy-eras-seed.csv` |

## Edges (11,895)

All edge types are listed in `edges.schema.json` (`x-edge-types`). Status: 3,969 `asserted_by_seed` (a seed field states the link), 7,926 `proposed` (inferred), 0 `accepted`. **Every status is published** (owner decision 2026-10-17), labeled on the site; only `rejected` links are left out.

The largest groups:

| Edge | Count | Meaning |
|---|---|---|
| attributed_to_nation | 4,495 | A cession and a nation the USFS lists as present-day (`role: present_day_per_usfs`) or Royce's Schedule names (`role: named_in_royce_schedule`). New in 0.2.0 |
| evidenced_by | 1,791 | A record and a source that supports it |
| located_in | 1,103 | Coarse location (state, region) |
| depicts | 777 | A cession polygon and the instrument it represents (`crosswalks/instrument-royce.csv`) |
| derived_from | 724 | Each cession and the USFS dataset |
| party_to | 634 | A nation as named in an instrument |
| enacted_during / occurred_during | 650 | Records and policy eras |
| applies_doctrine | 445 | Cases and statutes and doctrines |
| involves_nation | 376 | Violations, cases, campaigns and the nations they name |
| successor_of | 309 | Present-day government and the historical treaty party it carries the history of. Always `proposed` |

## Nations and names

Each Nation node carries a `names` list. Kinds:

| Kind | Meaning | Source |
|---|---|---|
| preferred_label | The label used on the site | nation-entities.csv or the Federal Register |
| official_name | Name as printed in 91 FR 4102 (Jan. 30, 2026) | Federal Register |
| endonym | Self-name in the people's language, as the nation writes it | Mostly the nation's own website (`crosswalks/nation-names.csv`) |
| exonym | Outside or colonial name, including names printed in treaties | Research rows |
| historical_spelling | Period spellings ("Seneka", "Pottawatomie") and "previously listed as" names | Aliases, Federal Register, research |
| common_english | Common English names | Research rows |
| related_people | A constituent people of an umbrella label ("Sioux" -> Lakota, Dakota, Nakota) | Research rows; also creates `part_of` links |
| source_label | A name as a seed printed it | nation-aliases.csv |

Every research name has a `source_url`, a `confidence`, and an evidence quote (in the crosswalk). `endonym_status` is `sourced_unreviewed` for 108 nations: a cited self-name that the nation has not yet confirmed. No name is invented; a nation's own spelling is never "corrected".

The alias index that links free text to nations uses the curated `nation-aliases.csv` first, then sourced research names and Federal Register names (5 or more letters, curated rows always win). That is how a treaty record's "Seneka" or Royce's "Quinaielt" reaches the right nation.

`federal_recognition` is `listed_federal_register_2026` for the 573 listed entities: a statement about a federal document, not a determination by this project.

## Cessions (GeoFeature)

Each cession node holds the Royce number, up to five Royce Schedule dates (with links to the Schedule page and Kappler text), the derived legal type (treaty or agreement 479, executive order 113, statute 78, unknown 54, from which link fields are filled), map sheets, tribes as named in the Schedule, present-day tribes per USFS, states and counties, and the full lineage record (G2 s.8.1): tier T3 (dashed) or T4 (no geometry), not reviewed against treaty text.

The geometry itself is in `public/data/layers/cessions.<hash>.json`, not in the graph.

## Differences from the design files

- **Edge display:** H1, H3 and J1 proposed publishing only seed-asserted and accepted edges. The owner chose to publish all, labeled.
- **Present-day nations:** H2 proposed creating `nat-pd-` nodes only on a nation's request (D-49). The build creates one for every entity in the 2026 Federal Register list so that cession and successor links resolve. They are record-only like every other nation node.
- **Seed edits:** J6 forbade editing seeds; the owner allowed it. Every edit is in `data/CHANGELOG-DATA.md`.
- **Polygon count:** 718 polygons in the USFS layer as fetched on 2026-10-17 (resolves K-02 for this download); one polygon (objectid 437) has no cession number and is left out.
- **Federal Register count:** the notice summary says 575 entities; the list as printed has 573 (348 + 225) plus 4 cross-references. Both official editions agree.
