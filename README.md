---
title: Treaty Land Atlas (working title)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Treaty Land Atlas (working title)

A planned, free, educational website: an interactive, time-aware map and knowledge graph of United States treaty law with Native nations. Its purpose is to point attention and resources toward Land Back, with factual claims that can be checked.

Created by Benjamin Life (@omniharmonic).

## Status in one paragraph

**Live (early release) at [landback.land](https://landback.land).** The data pipeline, knowledge graph (about 3,400 records: every treaty in the National Archives series, all 724 Royce cessions, every nation on the 2026 federal list plus 104 state-recognized, terminated, petitioning and other documented nations), the map with its time slider and "honored through" view, record pages, search, and four guided stories are built and deployed. No Native nation has reviewed anything yet, and every nation's page can be claimed by that nation. No lawyer has reviewed anything. Links inferred by matching names or dates are shown and labeled "suggested". Owner decisions are in [docs/governance/decision-log.md](docs/governance/decision-log.md); open questions for people are in [docs/review/nations-and-links-for-human-review.md](docs/review/nations-and-links-for-human-review.md).

## What the site does

1. Time slider over Royce cession polygons (1784 to 1894), with every polygon tied to its source.
2. Counterfactual view: "what if treaties had been honored through year X", always paired with a "Legal status today" panel.
3. Treaty, case, statute and violation pages with citations and visible confidence badges.
4. Graph view of how treaties, violations, cases, statutes and nations connect.
5. A directory of Land Back organizations and returns, with donation-integrity rules. The site takes no money.
6. Guided tours, in plain language, always ending at "today".

## Start here (phone-friendly, in this order)

| Read | What it gives you |
|---|---|
| [docs/01-EXECUTIVE-SUMMARY.md](docs/01-EXECUTIVE-SUMMARY.md) | One page: the idea, the findings, the next 10 actions |
| [docs/03-DECISIONS-AND-OPEN-QUESTIONS.md](docs/03-DECISIONS-AND-OPEN-QUESTIONS.md) | Every decision you owe, grouped by deadline, with a recommended default |
| [docs/04-KNOWN-ISSUES-AND-INCONSISTENCIES.md](docs/04-KNOWN-ISSUES-AND-INCONSISTENCIES.md) | Where the research and design files disagree, and what to do |
| [docs/02-PRD.md](docs/02-PRD.md) | What gets built, in what phase, and what must be true before launch |

## Map of the folder

| Path | Contents |
|---|---|
| `docs/00-RESEARCH-BRIEF.md` | The original brief and rules |
| `docs/01` to `docs/06`, `docs/INDEX.md` | Synthesis documents (this layer) |
| `docs/research/` | A1-A3 treaties and datasets, B1-B3 violations and returns, C1-C3 law, D1-D4 institutions and glossary, F1-F4 Land Back and donations, G1-G4 prior art, method, ethics, teaching |
| `docs/data/` | E1-E3 Native Land Digital, geodata sources, hosting and map tech |
| `docs/design/` | H1-H5 graph model; I1-I5 product, IA, interaction, visual, voice; J1-J6 architecture, NLD spec, CI, licensing gates, roadmap, kickoff prompts; `schema/`, `tokens.*`, `icons/`, `prototype/` |
| `seed-data/` | Research tables (CSV) and their READMEs. Treat as canonical until a human legal and tribal review is done |
| `crosswalks/` | Link tables the graph builder reads (nation aliases, successor proposals, case and violation links) |
| `scripts/build_graph.py` | Graph builder (Python standard library) |
| `build/` | Generated graph files and `graph-build-report.md` (authoritative current counts) |
| `verification/` | V1-V3 verification reports and corrections CSVs, the applied-corrections log (`CORRECTIONS-APPLIED.md`), the one-page `00-VERIFICATION-SUMMARY.md` and `originals/` backups (nothing here is reviewed by a lawyer or a tribe) |

Full list with one-line descriptions: [docs/INDEX.md](docs/INDEX.md).

## How to start building

1. Make the "decide this week" decisions in [docs/03](docs/03-DECISIONS-AND-OPEN-QUESTIONS.md).
2. Open a terminal in this folder with Claude Code and paste the Phase 1 prompt from [docs/design/J6-claude-code-kickoff-prompts.md](docs/design/J6-claude-code-kickoff-prompts.md) (section 1). Run one prompt per session, read its report, then start the next.
3. Do not start Phase 2 until Phase 1 passes its checks. The Phase 2 prompt is section 2 of the same file.
4. In parallel, run the owner-led work in Phase 0 of [docs/design/J5-build-roadmap.md](docs/design/J5-build-roadmap.md): permissions, legal reviewer, governance documents, tribal advisory outreach. These gate launch, not coding.

## Confidence and limits, stated plainly

- **Confidence is medium overall.** Federal statutes, Supreme Court holdings and treaty identities were mostly read in primary or authoritative sources. Many page cites, acreages, dollar figures, and 2025-2026 events were not, and are tagged `[from-memory]`, `[unverified]` or `[disputed]` in the files. [docs/06-CONFIDENCE-LEDGER.md](docs/06-CONFIDENCE-LEDGER.md) lists them in priority order.
- **The files disagree in places.** We did not smooth that over. See [docs/04](docs/04-KNOWN-ISSUES-AND-INCONSISTENCIES.md).
- **Verification corrections are applied but unreviewed.** Three independent verification passes (V1 legal citations, V2 facts and figures, V3 donations and licensing) wrote reports to [verification/](verification/). On 2026-10-16 their sourced corrections were applied to the seed CSVs and research files; the unsourced, single-source and conflicting items were left unchanged and are listed. See [verification/00-VERIFICATION-SUMMARY.md](verification/00-VERIFICATION-SUMMARY.md) for the one-page summary and [verification/CORRECTIONS-APPLIED.md](verification/CORRECTIONS-APPLIED.md) for every change; the original seeds are in `verification/originals/`. **No lawyer or tribal government has reviewed any of it.** Also: [docs/06-CONFIDENCE-LEDGER.md](docs/06-CONFIDENCE-LEDGER.md), section "Verification passes".
- **No tribal voice yet.** Descriptions of nations come from federal and secondary sources. Nothing speaks for any nation. Silence is never treated as consent.
- **Not legal advice.** Nothing here is a legal description of land, title, or jurisdiction.
- **Licenses are unresolved.** The Forest Service layer (CC BY 4.0 vs none in its metadata) and Native Land Digital terms need written answers before launch. Nothing ships until each license question is resolved.

## Run the code

You need Node.js 22.22 or newer and Python 3.9 or newer.

```sh
npm ci                     # install (first time, or after package changes)
npm run data:build         # seed CSVs -> graph -> site data
npm run data:validate      # checks; writes build/report.md
npm run dev                # local site at http://localhost:4321
npm run lint && npm run typecheck && npm run test:unit
```

Pipeline details: `pipeline/README.md`. Code is MIT (`LICENSE`); the project's own text and data are CC BY 4.0 (`LICENSE-DATA.md`).
