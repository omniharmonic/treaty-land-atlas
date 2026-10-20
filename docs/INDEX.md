---
title: Project Index
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: high
---

# Project Index

Every file in the Treaty Land Atlas project, with a one-line description. Paths are relative to the project root. Start with the README, then docs 01, 03, 04.

Status of everything: research and design drafts only. Nothing is built. No tribal or legal review has happened. The `verification/` reports were applied as corrections on 2026-10-16 (see `verification/CORRECTIONS-APPLIED.md`); a person has not reviewed any of it.

## Start here

| File | What it is |
|---|---|
| `README.md` | What the project is, status, how to start, limits stated plainly |
| `docs/01-EXECUTIVE-SUMMARY.md` | One page: findings, stack, the next 10 actions, biggest risks |
| `docs/03-DECISIONS-AND-OPEN-QUESTIONS.md` | 72 decisions the owner owes, grouped by deadline, each with a recommended default |
| `docs/04-KNOWN-ISSUES-AND-INCONSISTENCIES.md` | Every conflict between agents' outputs (K-01 to K-28), with what is right and what to do |
| `docs/02-PRD.md` | Product requirements: goals, non-goals, audiences, requirements by phase, ethics, accessibility, launch gates |
| `docs/05-MASTER-BIBLIOGRAPHY.md` | Deduplicated sources by type, with tiers as labeled and a list of blocked or snippet-only sources |
| `docs/06-CONFIDENCE-LEDGER.md` | Prioritized verification worklist of every from-memory, unverified and disputed item; summary of the V1-V3 reports and of the correction pass |
| `docs/INDEX.md` | This file |
| `docs/00-RESEARCH-BRIEF.md` | The original brief: purpose, rules, confidence tags, working principles |

## Research (`docs/research/`)

Treaties and datasets
| File | What it is |
|---|---|
| `A1-treaty-framework-and-counts.md` | Legal framework for treaty-making and why treaty counts differ (368, 375, 374, about 370 and others) |
| `A2-treaty-eras-and-clusters.md` | Treaty eras, regional clusters and the treaty seed's method |
| `A3-geospatial-and-treaty-datasets.md` | Survey of cession maps and treaty datasets (Royce, USFS layer, NLD, OSU, UNL, IDA, Census, BIA) |

Violations and returns
| File | What it is |
|---|---|
| `B1-violation-typology.md` | The 23-code vocabulary for how treaties were broken, with legal definitions |
| `B2-violation-catalog.md` | 62 documented violations with legal anchors, sources and confidence |
| `B3-land-returns-and-restitution.md` | Remedies and restitution: Indian Claims Commission, settlements, apologies, returns |

Law
| File | What it is |
|---|---|
| `C1-case-law-survey.md` | 104 federal Indian law cases with holdings and confidence |
| `C2-statutes-and-policy-eras.md` | 51 statutes and policy eras, 1790 to 2026 |
| `C3-doctrine-map.md` | Doctrine arc (ten layers) linking cases and statutes |

Institutions and context
| File | What it is |
|---|---|
| `D1-federal-institutions.md` | Federal agencies, trust offices, boarding school reports, and the "Office of Indian Trust Assets" non-finding |
| `D2-policy-eras-timeline.md` | Policy-era timeline with land consequences |
| `D3-land-statistics.md` | Acreage, trust land, recognition and Buy-Back statistics with source disagreements |
| `D4-glossary.md` | Plain-language and legal glossary |

Beyond the federal record
| File | What it is |
|---|---|
| `K1-beyond-the-federal-record.md` | Where the federal record (Royce, Kappler, NARA) misleads: land never ceded or taken with no instrument, unratified treaties, duress, hostages, signatory defects, massacres, promised land, ICC payment-for-land; a proposed land-status classification; 30 instrument case files; corrections to atlas data. Built on a full reading of the People of the Sacred Land TREC report (2024) |
| `K1/data/` | `beyond-federal-record-findings.csv` (682 sourced findings with verification status) and `royce-status-proposals.csv` (100 Royce areas with a proposed status and flags) |
| `K1/notes/` | Per-chapter notes on the PSL TREC report (with page cites), national research notes, two verification reports, and the research brief |

Land Back and giving
| File | What it is |
|---|---|
| `F1-land-back-landscape.md` | What "Land Back" means, its history, and the landscape of returns |
| `F2-organization-directory.md` | Land Back organizations with tiers, EINs and vetting notes |
| `F3-land-returns-and-campaigns.md` | Documented land returns and campaigns, including 2025-2026 items |
| `F4-donation-integrity-policy.md` | Donation integrity rules, red-flag case studies, draft policy language |

Prior art, method, ethics, teaching
| File | What it is |
|---|---|
| `G1-prior-art-survey.md` | Existing maps and projects (NLD, Invasion of America, Land-Grab Universities, others) and gaps |
| `G2-counterfactual-map-methodology.md` | "Ledger, not a verdict" method: stop-the-clock, layers, evidence flags, uncertainty tiers, legal-status codes |
| `G3-ethics-and-indigenous-data-governance.md` | CARE, OCAP, US Indigenous data sovereignty, UNDRIP, review statuses, removal right, AI policy |
| `G4-pedagogy-and-narrative-arcs.md` | Teaching principles and nine guided tours |

## Data (`docs/data/`)

| File | What it is |
|---|---|
| `E1-native-land-api-integration.md` | Native Land Digital API terms, tiers 0-3, permission requirements |
| `E2-geodata-source-inventory.md` | Inventory of geospatial sources with licenses and formats |
| `E3-static-hosting-and-map-tech-feasibility.md` | Hosting limits and map-technology feasibility (GitHub Pages, PMTiles, MapLibre) |

## Design (`docs/design/`)

Graph
| File | What it is |
|---|---|
| `H1-graph-data-model.md` | Node and edge types, statuses, 20 documented seed mismatches, current build counts |
| `H2-nation-identity-resolution.md` | How nation names and successors are resolved; present-day nation nodes |
| `H3-storage-and-build-pipeline.md` | Flat files in git, builder, validation, emitted graph and graph-lite |
| `H4-parachute-templates.md` | Note templates for the owner's Parachute vault |
| `H5-graph-exploration-paths.md` | Example paths through the graph for readers and tours |
| `K1-map-implementation-survey.md` | How the map, pipeline and schema would carry the K1 land-status classification: files, functions, property names, legend wording, tests, and every overstating phrase by file and line |

Product
| File | What it is |
|---|---|
| `I1-product-principles-and-naming.md` | Principles and the working-name recommendation ("What Was Promised") |
| `I2-information-architecture.md` | Site structure and page types |
| `I3-interaction-design.md` | Map, slider, counterfactual and panel interactions |
| `I4-visual-identity.md` | Color, type, icons and the violation sprite |
| `I5-content-design-and-voice.md` | Voice, plain-language rules and sample strings |

Engineering and release
| File | What it is |
|---|---|
| `J1-architecture-decision-records.md` | ADRs: stack, hosting, budgets, i18n, privacy (build numbers corrected 2026-10-16) |
| `J2-native-land-integration-spec.md` | Tiered NLD integration spec and the draft message to NLD |
| `J3-repo-ci-and-contribution.md` | Repo layout, CI/CD, checks V1-V16, contribution and removal workflow |
| `J4-licensing-and-release-gates.md` | Licensing matrix and release gates G-01 to G-21 |
| `J5-build-roadmap.md` | Phases 0-7, milestones, risks, decisions, draft note to the Forest Service |
| `J6-claude-code-kickoff-prompts.md` | Paste-ready prompts for Phase 1 and 2 and a reusable template |

Assets
| File | What it is |
|---|---|
| `schema/entities.schema.json` | JSON Schema for graph nodes (its `$id` presumes the repo owner and name; see K-20) |
| `schema/edges.schema.json` | JSON Schema for graph edges |
| `tokens.css` | Design tokens as CSS variables |
| `tokens.json` | The same tokens as JSON |
| `icons/violation-icons.svg` | Icon sprite: 23 violation symbols plus 7 review glyphs |
| `prototype/index.html` | Clickable prototype of the interface |

## Seed data (`seed-data/`)

Treat as canonical until verification is reviewed. Row counts as read on 2026-10-16.

| File | What it is |
|---|---|
| `README-treaties.md` | Method, columns and known gaps for the treaty tables |
| `README-case-law-and-statutes.md` | Method and gaps for cases and statutes |
| `README-land-back-seed.md` | Method and gaps for organizations and campaigns |
| `treaties-seed.csv` | 135 treaties, agreements and unratified instruments |
| `nara-ratified-treaties-index.csv` | 376 National Archives catalog rows (374 numbered plus 19A and 143A) |
| `cases-seed.csv` | 104 cases |
| `statutes-seed.csv` | 51 statutes |
| `violations-seed.csv` | 62 violation records |
| `violations-seed-notes.csv` | 62 verification notes for the violation records |
| `policy-eras-seed.csv` | 9 policy eras |
| `organizations-seed.csv` | 67 organizations |
| `campaigns-seed.csv` | 42 land-return campaigns |
| `tribe-org-map.csv` | 86 nation-to-organization links |
| `geodata-sources.csv` | 24 geospatial data sources |

## Crosswalks (`crosswalks/`)

Link tables the graph builder reads. Successor and alias rows need tribal review.

| File | What it is |
|---|---|
| `nation-entities.csv` | 226 nation entities with kind, recognition and legal context |
| `nation-aliases.csv` | 286 alternate names and spellings mapped to nation IDs |
| `nation-link-overrides.csv` | 5 manual fixes for nation matching (the fifth, for TLA-T-369, was added in the correction pass) |
| `nation-successor-proposals.csv` | 56 proposed historical-to-present nation links (unreviewed) |
| `case-instrument-links.csv` | 75 links from cases to the treaties they concern |
| `case-doctrine-statute-edges.csv` | 19 edges among cases, doctrines and statutes |
| `statute-merge.csv` | 5 mappings from treaty-seed statute IDs to statute-seed IDs |
| `violation-instrument-links.csv` | 106 links from violations to treaties |
| `violation-statute-links.csv` | 19 links from violations to statutes |
| `campaign-violation-links.csv` | 14 links from campaigns to violations |

## Code and build output

| File | What it is |
|---|---|
| `scripts/build_graph.py` | Graph builder (Python standard library): seeds and crosswalks to nodes and edges |
| `build/nodes.json` | Generated nodes (1,563) |
| `build/edges.json` | Generated edges (3,543; none accepted by a human) |
| `build/unresolved.json` | 106 logged build issues (69 info, 37 warn) |
| `build/graph-build-report.md` | Authoritative current graph counts and issue summary |

## Verification (`verification/`)

Independent reports plus the record of what was done with them. On 2026-10-16 a Corrections Agent applied the corrections that had a source URL, backed up the original seeds, rebuilt the graph and wrote the change log. A person has not reviewed any of it. See docs/06 and docs/04 K-28.

| File | What it is |
|---|---|
| `V1-legal-citations-report.md` | Check of case and statute citations (142 items reported) |
| `V1-corrections.csv` | Field-level corrections proposed by V1 (118 rows); applied where sourced, see `CORRECTIONS-APPLIED.md` |
| `V2-facts-and-figures-report.md` | Check of treaty rows, violation entries, land statistics and 2025-2026 events (203 items reported) |
| `V2-corrections.csv` | Corrections proposed by V2 (40 rows); applied where sourced |
| `V3-donations-and-licensing-report.md` | Check of donation URLs, EINs, campaign figures and licenses (85 items reported) |
| `V3-corrections.csv` | Corrections proposed by V3 (33 rows); applied where sourced |
| `CORRECTIONS-APPLIED.md` | Every change made in the correction pass (file, row or section, field, old, new, source, verifier), the corrections not applied and why, backups, and the build deltas |
| `00-VERIFICATION-SUMMARY.md` | One-page summary: what was verified, corrected, left unverified and unreachable, and what legal and tribal reviewers must still check |
| `originals/` | Backups taken before the pass: the 11 original seed CSVs, the original `build/` output and `docs-snapshot/` (the docs, README and crosswalks as they were) |

## Sources

Directory listing of `/home/claude/treaty-land-atlas` on 2026-10-16; one-line descriptions come from each file's title and opening section.

## Confidence & Gaps

Confidence: high that the list is complete as of 2026-10-16. Descriptions of files not re-read in full for this index (H4, H5, I2, I3, I5) are from my notes taken when they were read earlier. Files added after this date are not listed. CSV row counts were read directly; the corrections CSV row counts are line counts minus the header.
