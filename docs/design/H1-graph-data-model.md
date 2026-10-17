---
title: Graph data model (nodes, edges, IDs, normalization)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# H1. Graph data model

Treaty Land Atlas, Design Agent H. This document defines what the atlas knows as a graph: the kinds of things (nodes), the relationships between them (edges), the ID scheme, how confidence, tribal review and provenance travel with every fact, and exactly how the eleven seed CSVs are normalized into it. The machine-readable contract is `docs/design/schema/entities.schema.json` and `edges.schema.json`. The builder is `scripts/build_graph.py`. Its latest output is `build/nodes.json`, `build/edges.json` and `build/graph-build-report.md`.

**Status of everything below.** The model is a draft. The builder has been run, and its output validates against the two schemas (JSON Schema draft 2020-12) [verified by running the validator, including three negative tests that the rules do fire]. That shows the data is well formed. It does not show the links are right. Of 3,543 edges, 1,198 are `asserted_by_seed` (a seed field states them) and 2,345 are `proposed` (inferred by a crosswalk or a text match). None is `accepted`. No node has been reviewed by a tribal government, and the model says so on every record.

## 1. Design rules that shape the model

These come from `docs/00-RESEARCH-BRIEF.md` and the research notes (especially G2 and G3). Each one is enforced in the schema, not just stated.

1. **Legal categories stay separate.** A ratified treaty, an unratified treaty, a statute, an executive order and an agreement are different `instrument_type` values. Context rows (international treaties, colonial items RIT 1-7, the document set RIT 143A) must carry the flag `context_row_not_a_treaty` and are never counted as treaties.
2. **Violations are not verdicts.** The word "violation" is the atlas's editorial category (B1). A violation node whose type code starts with `CONTEXT_` (or is `ANNEXATION_CONTEXT`) has `adjudicated_breach_label_allowed = false`. A violation links to a case only when the case record says so, through `adjudicated_in`.
3. **Silence is not consent.** Every node starts at `tribal_review.status = not_yet_contacted` and `publication.narrative_allowed = false`. The schema refuses a narrative on any node whose review status is not `reviewed` or `co_authored`, refuses `published` on a nation-specific node before review, and forces `record_only` or `withheld` when a nation has declined or withdrawn.
4. **Proposed is not fact.** Successor links, party-to-nation links, violation-to-treaty links and campaign-to-violation links are `proposed` unless a seed foreign key states them. The schema forbids `asserted_by_seed` on `successor_of` and on `remedies`, and requires `reviewer_role` and a date on any `accepted` edge.
5. **Source tiers matter.** Every URL in a seed row becomes a `Source` node with a tier (primary record, legal-text mirror, authoritative secondary, news, self-described, pointer-only, unclassified). The tier comes from a short domain list in the builder and is a guess for a human to confirm.
6. **Hawaii and Alaska are distinct legal contexts.** Nodes touching them carry `distinct_legal_context`, and `Nation.legal_context` is `distinct_hawaii` or `distinct_alaska_ancsa`. No code path may call ANCSA corporations or the Hawaiian Kingdom "tribes".
7. **No sacred-site locations and no living people.** Data classes K (sensitive-by-tribe) and S (secret) are not representable in the open dataset. `Person` nodes exist in the schema only with `living = false`, and the builder emits none.
8. **Donation integrity.** `Organization.display_eligible` is false for low-confidence organizations (16 of 67), and those nodes are `draft`. A donation URL is an attribute, never evidence.

## 2. Node types

Counts are from the latest build (1,563 nodes).

| Type | Count | ID pattern | Built from | What it is |
|---|---|---|---|---|
| Instrument | 405 | `TLA-T-###[A]`, `TLA-T-FL1851`, `TLA-U-CA-A..R`, `TLA-U-*`, `TLA-X-*`, `TLA-A-####` | `nara-ratified-treaties-index.csv` (376 rows) plus `treaties-seed.csv` (135 rows) | Treaty, agreement, executive order or colonial document. 128 are seeded (full fields), 277 are NARA skeletons (RIT, date, title, NAID only). |
| Statute | 52 | `stat-<slug>-<year>` | `statutes-seed.csv` (51) plus one statute only found in `treaties-seed.csv` | Acts, resolutions, regulations. |
| Case | 104 | `case-<slug>-<year>` | `cases-seed.csv` | Court decisions. |
| Doctrine | 56 | `doctrine-<tag>` | C3 Part 4 vocabulary | A named legal rule (for example `discovery`, `plenary-power`). |
| PolicyEra | 9 | `era-01` ... `era-09` | `policy-eras-seed.csv` | Federal policy eras. |
| Violation | 62 | `V001` ... `V062` | `violations-seed.csv` plus `violations-seed-notes.csv` | An editorial record of a documented loss or breach, with a type code from B1. |
| Nation | 226 | `nat-<slug>` (historical parties and umbrella labels), `nat-pd-<slug>` (present-day governments as named in the seeds) | `crosswalks/nation-entities.csv` | See H2. |
| Organization | 67 | `org-<slug>` | `organizations-seed.csv` | Land-back and land-trust organizations. |
| Campaign | 42 | `camp-<slug>` | `campaigns-seed.csv` | Land return and recovery efforts. |
| Place | 44 | `plc-region-<slug>`, `plc-state-<xx>` | atlas regions in `treaties-seed.csv`, plus states found in text | Coarse places only. No geometry. |
| Source | 496 | `GEO-###`, `src-<10 hex>` | `geodata-sources.csv` (24) plus every URL in the seed rows (472) | A citation target. |
| Person | 0 | `per-*` | none | Reserved. Deceased persons only. |
| GeoFeature | 0 | `geo-*` | none yet | Reserved for geometry with the full G2 lineage record (parties, uncertainty tiers T1-T4, evidence flags E0-E7, legal status S1-S9). |

### 2.1 Fields common to every node

`id`, `type`, `label`, `summary`, `aliases`, `external_ids`, `confidence` (high, medium, low), `verification_status` (verified, from_memory, disputed, unverified, mixed, not_assessed), `flags`, `provenance`, `tribal_review`, `publication`, `data_class` (P, D, N, R), `sensitivity`, `notes`.

`provenance` records the origin (`seed_csv`, `nara_index`, `crosswalk`, `computed`), the source file and row ID, the research agent, the raw confidence value as the seed wrote it, the research documents to read, and the builder name. `tribal_review` records status, scope (`nation_specific` or `public_record_only`), date, reviewer role and notes. The status values mirror G3: not yet contacted, invited, reviewed, co-authored, edits requested, declined, withdrawn.

### 2.2 Type-specific fields

Only the load-bearing ones are listed. The full list is in the schema.

- **Instrument:** `instrument_type`, `ratification_status`, `completeness` (skeleton or seeded), `date_signed`, `date_ratified` with `date_ratified_basis`, `parties_text` (the NARA/Kappler wording, kept verbatim), `region`, `land_description` with `land_desc_basis`, `acreage_ceded` (ceded only, never retained), `stat_cite` (normalized "15 Stat. 635") with `stat_cite_raw`, `kappler_cite`, `treaty_era_label`, `nara{rit, naid, naid_alt}`, `signatory_authority_disputed` (empty until someone fills it, A1 gap 10), `royce_cession_numbers` (empty until the USFS table is joined).
- **Violation:** `violation_types` (B1 codes), `adjudicated_breach_label_allowed`, `year_text` plus parsed `year_start`, `year_end`, `year_precision`, `mechanism_summary`, `land_lost_description`, `legal_aftermath`, `treaty_name_text`, `nations_text`, `related_cases_text`, and `acknowledgment` and `consent_status` (empty, reserved from B1).
- **Case and Statute:** citation, year, holding or summary, effect label (`advanced`, `eroded`, `mixed`, `procedural`, an editorial label defined in C1), `doctrine_tags`.
- **Campaign:** `campaign_status` (a headline-only campaign is never `published`), `acres` with a basis, `start_year`.
- **Organization:** `indigenous_led` (eight seed values), `org_type`, `display_eligible`, `ein_or_registry`.
- **Nation:** `entity_kind`, `federal_recognition` (what the seeds say, not a determination), `legal_context`, `names[]` each with kind and review state, `endonym_status`.
- **Source:** `source_kind`, `url`, `domain`, `source_tier`, `tier_basis`.

## 3. ID scheme

Principles: IDs are stable, readable, never reused, and never carry meaning that could change (no current tribal names, no recognition status).

1. **Treaties use the NARA Ratified Indian Treaty (RIT) number as the key.** `TLA-T-` plus the RIT zero-padded to three digits, plus a letter if NARA has one: RIT 7 is `TLA-T-007`, RIT 19A is `TLA-T-019A`, RIT 369 is `TLA-T-369`. The NARA catalog ID (NAID) is stored in `external_ids.nara_naid` as a list, because RIT 336 and 338 each have two NAIDs (separated by ";" in the NARA index CSV) and RIT 55 has none ("Treaty unavailable"). The IDs of the seed file and the builder agree: every `TLA-T-###` row in `treaties-seed.csv` matched a NARA row.
2. **Things with no RIT keep their seed IDs:** `TLA-T-FL1851` (Fort Laramie 1851, absent from the extracted NARA table), `TLA-U-CA-A` to `-R` (the 18 unratified California treaties, Heizer lettering), `TLA-U-PIKE1805`, `TLA-U-CHER1835`, `TLA-U-FRANKLIN1830`, `TLA-X-*` (international and executive-order context rows), `TLA-A-1873`, `-1874`, `-1877`, `-1892`, `-1900` style agreements.
3. **Statutes use `stat-` IDs only.** Six `TLA-S-*` rows in `treaties-seed.csv` describe the same acts as rows in `statutes-seed.csv`. `crosswalks/statute-merge.csv` maps each to its `stat-` ID, and the old ID is kept in `aliases` and `external_ids.legacy_treaties_seed_ids`. One further statute (`TLA-S-HI1993`, the 1993 Apology Resolution) has no row in `statutes-seed.csv`. The builder created `stat-apology-resolution-1993` for it and logged a warning. Fix: add the row to `statutes-seed.csv`.
4. **Nations:** `nat-<slug>` for historical parties as the treaty records name them and for umbrella labels; `nat-pd-<slug>` for present-day governments as the seeds name them. Neither prefix is a claim of identity between the two (see H2).
5. **Sources:** `GEO-###` kept from the geodata inventory; every URL otherwise gets `src-` plus the first 10 hex characters of the SHA-1 of the normalized URL, so the same URL cited in 30 rows is one node.
6. **Edges:** `e-` plus 12 hex characters of the SHA-1 of `type|source|target|role`. Rebuilding gives the same edge IDs as long as the facts do not change, so a review decision recorded against an edge ID survives a rebuild.
7. **Changing an ID** is a breaking change. If a record is merged or split, the old ID stays as an alias and a `superseded` edge status records why.

## 4. Edge types

Every edge has: `id`, `type`, `source`, `target`, `source_type`, `target_type`, `status`, `confidence`, `basis` (one plain sentence), `derivation{method, rule, crosswalk_file, source_file}`, `provenance`, `evidence[]`, `qualifiers`, and `review{tribal_review_status, successor_status, legal_review_status, reviewer_role, date}`. Status is one of `asserted_by_seed`, `proposed`, `accepted`, `rejected`, `superseded`. Edges touching a Nation, Violation, Campaign or Organization may not use `not_applicable` as their tribal review status.

The 31 types, with the count in the latest build. A count of 0 means the type is in the vocabulary but no seed supports it yet.

| Edge type | From | To | Inverse | Count |
|---|---|---|---|---|
| `party_to` | Nation | Instrument | `has_party` | 631 |
| `violated_by` | Instrument | Violation | `violates` | 105 |
| `enabled_by` | Violation | Statute, Instrument | `enables` | 22 |
| `adjudicated_in` | Violation | Case | `adjudicates` | 52 |
| `concerns_instrument` | Case | Instrument | `at_issue_in` | 75 |
| `involves_nation` | Violation, Case, Campaign | Nation | `involved_in` | 370 |
| `enacted_during` | Instrument, Statute, Case | PolicyEra | `contains_enactment` | 555 |
| `occurred_during` | Violation, Campaign | PolicyEra | `contains_event` | 95 |
| `ratified_by` | Instrument | Statute | `ratifies` | 0 |
| `supersedes` | Instrument, Statute | Instrument | `superseded_by` | 0 |
| `abrogates` | Statute, Instrument | Instrument | `abrogated_by` | 0 |
| `cedes` | Instrument | Place, GeoFeature | `ceded_by` | 0 |
| `reserves` | Instrument | Place, GeoFeature | `reserved_by` | 0 |
| `located_in` | Place, Instrument, Violation, Campaign, GeoFeature | Place | `contains` | 263 |
| `depicts` | GeoFeature | Instrument, Place | `depicted_by` | 0 |
| `derived_from` | GeoFeature, Source | Source | `source_of` | 0 |
| `part_of` | Nation | Nation | `has_part` | 52 |
| `successor_of` | Nation | Nation | `has_successor` | 56 |
| `governing_body_of` | Organization | Nation | `governed_by` | 28 |
| `serves_nation` | Organization | Nation | `served_by` | 66 |
| `operates_in` | Organization | Place | `has_operator` | 69 |
| `supports_return_of` | Organization | Campaign | `supported_by` | 40 |
| `remedies` | Campaign | Violation | `remedied_by` | 15 |
| `applies_doctrine` | Case, Statute | Doctrine | `applied_in` | 445 |
| `establishes_doctrine` | Case, Statute | Doctrine | `established_by` | 0 |
| `applies_statute` | Case | Statute | `applied_by` | 4 |
| `limits` | Case, Statute | Case, Statute, Doctrine | `limited_by` | 7 |
| `overrules_in_effect` | Case, Statute | Case | `overruled_in_effect_by` | 2 |
| `responds_to` | Statute | Case | `triggered` | 6 |
| `cites` | Case, Statute | Case, Statute, Source | `cited_by` | 0 |
| `evidenced_by` | any node type | Source | `evidences` | 585 |

Notes on how some edges are used:

- **`violated_by` is directional from instrument to violation** ("this instrument was violated, per this record"). The `role` qualifier records `primary`, `secondary` or `context`. A `context` role (for example Fort Laramie 1851 to the Dakota Access Pipeline record V030) means the Tribe invoked the treaty, not that a court found a breach. The UI must show the role, and must not render a `context` edge as a finding.
- **`enabled_by`** links a violation to the Act or agreement that made it legally possible (for example V024 to the Act of February 28, 1877, `TLA-A-1877`).
- **`adjudicated_in`** is the only violation-to-case edge. The builder reads the free-text `related_cases` cell, splits on semicolons outside brackets and parentheses, and matches by reporter citation (confidence high) or by party names plus year (medium). 52 edges were made; 11 case fragments matched no case node (listed in the build report).
- **`responds_to`** always runs from Statute to Case. C3 wrote six of these edges the other way round. `crosswalks/case-doctrine-statute-edges.csv` marks them `flipped_from_c3 = yes` and the builder swaps source and target. One flipped row, Castro-Huerta limits McGirt, is a `limits` edge and is already in the right direction, so it is not swapped. The first run of the builder failed schema validation on these six edges (12 errors); that is how the swap was found and fixed.
- **`enacted_during` and `occurred_during`** use the era-start rule: the latest policy era whose `start_year` is on or before the year. Years in the gaps between eras (1945-1952, 1969) attach to the earlier era with `gap_year: true`. Years before 1763 (the six colonial rows and nothing else) get no era edge. This is a presentation convenience, not a historical claim. D2 and the seed disagree with the instrument's own `era` label in places (see section 6).

## 5. The ETL: seed CSVs to graph

The pipeline is deterministic and has no network access. In order:

1. **Load** the eleven seed CSVs and ten crosswalk CSVs. A row with the wrong number of cells is reported (this caught an unquoted comma in `statute-merge.csv` on the first run).
2. **Instruments.** One node per NARA row (376). Where `treaties-seed.csv` has a matching `TLA-T-###`, the seeded fields replace the skeleton and `completeness` becomes `seeded`. Where the NARA and seed disagree on NAID or signing date the builder logs a mismatch (none were found in this run). RIT 1-7 become `colonial_instrument` and RIT 143A becomes `document_set`, both flagged `context_row_not_a_treaty`. Seed rows with no NARA row are added with their own IDs (`TLA-U-*`, `TLA-X-*`, `TLA-A-*`, `TLA-T-FL1851`).
3. **Statutes.** `statutes-seed.csv`, with the six `TLA-S-*` merges applied.
4. **Doctrines** from the C3 Part 4 table. The builder compares C3's stated per-tag row counts to the CSVs and reports differences (see the build report), and fails loudly on any tag used in a CSV but missing from C3.
5. **Cases, Violations, PolicyEras, Organizations, Campaigns, geodata Sources, Nations, Places** as in section 2.
6. **Sources from URLs.** Every `http(s)` URL in the URL columns becomes a `Source` node and an `evidenced_by` edge. Organization websites are classed `self_described`. Donation URLs are not evidence.
7. **Nation links by alias matching** (H2 section 5): party text of each instrument, the `nations` text of violations and cases, and the `nation` text of campaigns, matched longest-alias-first so "Cheyenne River Sioux" is never also "Sioux". The match is recorded in `qualifiers`. Unmatched strings are reported, not dropped silently.
8. **Hand-made crosswalks** supply the links no seed column can: violation to instrument or statute, case to instrument, campaign to violation, nation structure and successor proposals, and the C3 case/doctrine/statute edges. Each row has a `basis` sentence. They are written by the design agent from reading the seed text and need a legal reviewer.
9. **Checks.** Orphans, unresolved references, edge endpoint types against the schema's `x-edge-types`, then full JSON Schema validation if the `jsonschema` package is installed.

Outputs: `nodes.json`, `edges.json`, `unresolved.json` (every issue, machine-readable), `graph-build-report.md`.

### Latest build, honestly

| Measure | Result |
|---|---|
| Nodes / edges | 1,563 / 3,543 |
| JSON Schema validation | 0 failures (first run: 12, all from the six reversed `responds_to` edges) |
| Orphan nodes | 29: 24 geodata `Source` nodes (no geometry joined yet, so nothing cites them), `TLA-T-004` and `TLA-T-005` (colonial "extracts" with no party named), `nat-pd-coastal-chumash` and `nat-pd-muckleshoot` (F found no verified organization), `plc-region-multi-region` |
| Violations linked to an instrument | 59 of 62. The three that are not: V048 (a line of cases, not an instrument), V057 (a South Carolina state treaty) and V058 (Massachusetts and Maine state treaties). These are not federal instruments and are correctly outside the instrument table. The first pass left eight unlinked; five of those (V011, V016, V027, V032, V059) had a matching NARA skeleton row that the crosswalk had missed, and were added after re-checking the unmatched list against the NARA spine. |
| Violations with related cases listed that link to at least one case node | 34 of 42 |
| Cases linked to an instrument | 48 of 104. Nine cases name a treaty, agreement or act that is not in the instrument seeds (Fort Belknap 1888, Atoka 1897, Act of 1889, Acts of 1902-1905 and similar). |
| Instruments with a `party_to` edge | 390 of 405 (115 of 128 seeded). The rest are the 15 California treaties with period band names, plus `TLA-T-004` and `TLA-T-005`. |
| Stat. cite cross-check | 27 citations printed in violation `treaty_name` cells were found on a linked instrument; 5 were not (V027, V039, V047 three times) |
| Successor proposals | 56, all `proposed` |
| Source tiers | primary record 41, legal-text mirror 103, authoritative secondary 125, news 5, self-described 58, pointer-only 93 (mostly Wikipedia), unclassified 69 |

Matching errors found by reading the output, not by the validator, and fixed through crosswalks rather than code:

- "Blackfeet" in V024 and in `TLA-T-345` ("Sioux (Blackfeet)") is a Lakota division, not the Blackfeet (Pikuni) Nation of Montana. Removed through `nation-link-overrides.csv`.
- "Menominee band" in V011 is a Potawatomi band name. Removed.
- "Creek" matched inside "Swan Creek" and "Cow Creek" in four treaty titles. Fixed with two blocker aliases.
- Cobell v. Salazar named "Blackfeet" only as the lead plaintiff's affiliation. Removed.

More of this kind will exist. Alias matching is a draft generator, not a source of truth.

## 6. Every ID and column mismatch across the seed CSVs, and the normalization applied

| # | Mismatch | Where | Normalization in the graph |
|---|---|---|---|
| 1 | Treaty `id` zero-pads the RIT (`TLA-T-007`) but `nara_rit_no` is unpadded (`7`) in 26 of the 99 seed rows that carry a RIT, and the NARA index uses `19A`, `143A` | `treaties-seed.csv` vs `nara-ratified-treaties-index.csv` | `rit_to_id()` pads to three digits and keeps the letter. The unpadded RIT is kept in `external_ids.nara_rit`. |
| 2 | RIT 55 has no NAID; RIT 336 and 338 have two NAIDs in one cell | NARA index | `nara_naid` becomes a list. Missing NAID is a logged warning, and no source link is built. |
| 3 | Two confidence vocabularies. Treaties, violations, organizations, campaigns, eras: `high/medium/low`. Cases and statutes: `verified/from-memory/disputed/unverified`. The treaty README defines `high` in terms of verification, the others do not. | all seeds | Two fields. `confidence` (high/medium/low) and `verification_status`. Tag vocabulary maps: verified to high+verified; from-memory, disputed and unverified to low plus the same status. Level vocabulary on treaties maps high to high+verified, medium and low to mixed. Other level files map to `not_assessed`, because those files do not say what their levels mean beyond reliability. The raw value is kept in `provenance.source_confidence_raw`. |
| 4 | The same idea has different column names: `nations` (treaties, violations, cases), `nations_served` (organizations), `nation` (campaigns, tribe-org-map), `nations_text` (this graph) | all seeds | All are kept as `*_text` fields for audit and turned into Nation edges by alias matching. |
| 5 | `source_url` (treaties, cases, statutes, campaigns), `source_urls` (violations, plural, multiple per cell), `sources` (eras, free text), `website` and `donation_url` (organizations) | all seeds | Every URL is extracted with a regex into `Source` nodes. |
| 6 | Year columns: `year` (cases, statutes), `date_signed` ISO (treaties), `treaty_year` and `violation_year` (violations, text with ranges like "1970s-1989"), `start_year` (campaigns, eras, many blank) | all seeds | `parse_violation_years()` gives `year_start`, `year_end`, `year_precision` (year or decade); the raw text is kept. 15 records have no year and get no era edge. |
| 7 | No shared Nation key. Nations are free text in treaties (period spelling), violations, cases, organizations, campaigns and in `tribe-org-map.csv` | all seeds | `nation-entities.csv` and `nation-aliases.csv` (H2). |
| 8 | `tribe-org-map.csv` `nation` is a free-text label, not an ID. 8 rows have `org_id = NONE_VERIFIED`. Its `relationship` is free text starting with a semicolon-separated vocabulary, with oddities ("UNVERIFIED", "advocacy", "campaign") | `tribe-org-map.csv` | Labels resolved by alias. `governing_body` yields `governing_body_of`; everything else yields `serves_nation`. The full relationship text is kept in `qualifiers`. The 8 `NONE_VERIFIED` rows are reported, not turned into edges. All 66 `serves_nation` and 28 `governing_body_of` edges are `proposed`, because the nation side was resolved by alias. |
| 9 | Violations have no `instrument_id`, only `treaty_name` text, and `related_cases` is citations, not case IDs | `violations-seed.csv` | `violation-instrument-links.csv` (matched by name and Stat. cite, with a cross-check) and citation parsing for `adjudicated_in`. B1 recommends adding `instrument_id` to the seed. This should happen in the seed itself. |
| 10 | Cases' `treaty_at_issue` is free text | `cases-seed.csv` | `case-instrument-links.csv`. Ambiguous ones are flagged in `basis` (Lone Wolf maps to RIT 364 and 365; Montana v. United States maps to FL1851 and 370). |
| 11 | Treaty `era` labels (eight, from A) differ from the nine policy eras (D) | `treaties-seed.csv` vs `policy-eras-seed.csv` | Both kept. `treaty_era_label` is stored as written. `enacted_during` is computed from the year. They are not forced to agree. |
| 12 | Statutes appear twice: six `TLA-S-*` in `treaties-seed.csv` and `stat-*` in `statutes-seed.csv`; one `TLA-S-HI1993` appears only in the treaty file | both | `statute-merge.csv`; the one orphan was created as a new statute with a warning. |
| 13 | `ANNUITY_NONPAYMENT` (seed, V013 and V026) vs `ANNUITY_NONPAYMENT_OR_DIVERSION` (B1 vocabulary) | `violations-seed.csv` | Normalized, logged. |
| 14 | Organizations' `indigenous_led` has eight values. "NANA Regional Corporation" is typed `tribal-government` although ANCSA corporations are not tribal governments. | `organizations-seed.csv` | Kept as written. The builder logs the NANA mismatch. The seed should be corrected by its owner. |
| 15 | Doctrine tag counts in C3 do not match the CSVs for some tags | C3 vs `cases-seed.csv`, `statutes-seed.csv` | Recomputed from the CSVs. Differences are listed in the build report (`doctrine_count_mismatch`, severity info). |
| 16 | Campaign `status` includes `headline-only`; 2 campaigns have no `org_id`; 15 have no start year | `campaigns-seed.csv` | `headline-only` forces `draft` publication. Missing values are reported. |
| 17 | Context rows share the treaty table with treaties (international, statute, agreement, executive order) | `treaties-seed.csv` | `instrument_type` mapped to a closed vocabulary. Context rows flagged. Statutes moved to Statute nodes. |
| 18 | Free-text confidence tags inside cells (`[from-memory]`, `[disputed]`, `[unverified]`) | many | Detected and copied to node `flags` (`text_has_from_memory_tag`, and so on): 222 nodes carry from-memory text, 43 disputed, 20 unverified. The cell text is untouched. |
| 19 | `violations-seed-notes.csv` has its own `id` and `title`, and `region` | `violations-seed-notes.csv` | Joined to `violations-seed.csv` on `id`. The notes file supplies `title`, `region_text` and `verification_notes`. |
| 20 | `geodata-sources.csv` IDs (`GEO-001`) are a different scheme from all others and the file has no link to any treaty | `geodata-sources.csv` | Kept as `Source` nodes with data class R. They stay orphans until a `GeoFeature` cites them. |

## 7. What this model cannot yet do

- **Geometry.** No `GeoFeature` nodes. `cedes` and `reserves` are empty until a Royce polygon is joined (E3 estimates the polygon file at about 0.5 to 2 MB). Treaty geometry must follow the G2 lineage record.
- **Tribal voice.** `tribal_review.status` is `not_yet_contacted` on all 1,563 nodes. Fields for a nation's own account and endonyms exist in the schema (`names[].kind`, `tribal_account` on narrative overlays) but nothing fills them. The review ledger is a planned crosswalk (`crosswalks/tribal-review-ledger.csv`, see J1 ADR-007).
- **Treaty text.** Instruments hold citations and NARA IDs, not the treaty text. Text should be linked, not copied, until rights and quality are checked.
- **Legal review.** Every `proposed` edge, especially violation-to-treaty and case-to-treaty links, needs a lawyer or a legal historian to say accept or reject.
- **Counting.** Do not count `Instrument` nodes as "treaties". Filter on `instrument_type = ratified_treaty`: 369 nodes, which is the 368 NARA rows left after removing RIT 1-7 and 143A (this equals A1's 368 federal-era treaties) plus `TLA-T-FL1851`, which is not in the NARA table. Read A1 section 4.2 before quoting any count publicly.

## Sources

`docs/00-RESEARCH-BRIEF.md`; `seed-data/README-treaties.md`, `README-case-law-and-statutes.md` and the other seed READMEs; `docs/research/A1`, `B1`, `C3`, `G2`, `G3`; `docs/design/schema/*.schema.json`; `build/graph-build-report.md`.

## Confidence & Gaps

Confidence: medium. The schema and build are verified by execution. The crosswalks are interpretive and unreviewed. Section 6 lists mismatches found by reading the CSV headers and by build warnings; I did not diff every cell of every file. The RIT padding count (26 of 99) was counted from `treaties-seed.csv` after the final build.
