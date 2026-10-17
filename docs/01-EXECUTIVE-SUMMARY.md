---
title: Executive Summary
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Executive Summary

## The idea

A free, static website that lets anyone slide through time (1784 to 1894 for the map; to today for the law) and see what the United States promised Native nations, what happened, what courts said, and what is being returned. Its counterfactual view asks "what if treaties had been honored through year X", and never appears without a "Legal status today" panel. It is an advocacy project with a rigorous ledger, not a neutral encyclopedia.

## What exists now

- 40 research, data and design documents (21 research, 3 data, 16 design) plus the brief, 11 seed tables (about 1,000 rows), 10 crosswalks, a graph builder, two JSON schemas, design tokens, an icon sprite, a clickable prototype.
- A built graph: 1,563 nodes and 3,543 edges (`build/graph-build-report.md`). Zero schema errors, 29 orphans, 106 logged issues. 1,198 edges are asserted by seed data, 2,345 are proposed, **0 are accepted by a human**.
- **Not built:** the website, geometry, search, tours. **Not done:** tribal review, legal review, any outreach, license confirmations.

## Headline findings

| Topic | Finding | Caution |
|---|---|---|
| Treaty counts | No single count. 368 federal-era ratified treaties in the National Archives series (RIT 8-374 plus 19A); 375 with 7 British-era items; 374 is NARA's own numbered series; "about 370" in BIA and Senate prose. Other figures: 377 (NARA "negotiated"), 389 (Cohen via vendor text), 418 (HeinOnline). The graph holds 369 `ratified_treaty` nodes (368 plus Fort Laramie 1851, missing from the NARA table as extracted). | Show a range with reasons, never one number. Unratified count unknown (BIA: at least 45; seed has 21). |
| Violations | 23 distinct violation-type codes (4 are context codes, not adjudicated breaches) plus one alias; 62 violation records. Precise terms matter: breach, abrogation, diminishment, disestablishment, termination are legally different. | 52 of 62 verification notes still carry `[from-memory]`, `[unverified]` or `[disputed]` tags. |
| Case law | 10-layer doctrine arc from Johnson v. M'Intosh (1823) to 2026 executive swings. 104 cases (99 marked verified in the CSV) and 51 statutes (37 verified, 14 from-memory). | Verified means name, cite, date and holding; pin cites, quotations and several Statutes at Large pages are not. |
| Land returns | Blue Lake (1970), Menominee (1973), Tuluwat (2019, about 200 acres), Bison Range (2020 law), Esselen Adler Ranch (1,199 acres, 2020), Yurok Blue Creek (47,097 acres, final phase May 30, 2025) are well supported. 42 campaigns seeded, 7 low-confidence. | Most 2026 items rest on one news source. Black Hills award figures disagree across files. "Headline-only" items must not be shown as facts. |
| Allotment acreage | "138 million to 48 million acres" is repeated everywhere and has no primary source in the files. | Show as "widely cited". |
| Native Land Digital | API is free but key-gated. Its Data Sovereignty Treaty bars commercial use, charging, altering boundaries, and storing or distributing API data without written permission; its "CC0" label conflicts with that. | Only an outbound link ships until NLD answers in writing. CORS and deep-link format are untested. |
| Cession geometry | Forest Service Royce layer: CC BY 4.0 on Data.gov, no license in its metadata. Polygon count 718 or 752 (files disagree about which source says which). Seven cession IDs have no geometry. Last updated 2022, no updates planned. | Ask the Forest Service in writing; count after download. |
| Counterfactual method | "A ledger, not a verdict": stop-the-clock query, evidence flags E0-E7, uncertainty tiers T1-T4, legal-status codes S1-S9, overlapping claims never merged, no parcel or address output, geometry ends 1894. | Needs a federal Indian law reviewer before any public release. |

## Recommended stack (J1, J3)

Astro static site with TypeScript; Svelte 5 islands; MapLibre GL JS; quantized GeoJSON; OpenFreeMap basemap with a PMTiles fallback; Pagefind search; build-time graph drawings; no analytics; flat files in git as source of truth; GitHub Pages (private repo until launch, because free Pages needs a public repo). Hosting cost about $0. Real costs: legal review, paid tribal advisory time, accessibility audit. Version numbers were "observed" on 2026-10-16 and must be re-checked.

## The next 10 actions, in order

1. **Decide this week:** working name (keep "Treaty Land Atlas"), GitHub account and who may merge, code and data licenses, private repo, no analytics (see doc 03).
2. **Create the private repository** with a protected `main` and deploy switched off (J5 P0-02).
3. **Send the Forest Service license question** (draft in J5 Appendix A). Log the date.
4. **Review and send the Native Land Digital message** (draft in J2 section 7). Log the date.
5. **Engage a federal Indian law reviewer**, even for a few hours at first.
6. **Start Phase 1 in Claude Code** by pasting the prompt in J6 section 1.
7. **Review the verification reports** in `verification/` (V1 legal citations, V2 facts and figures, V3 donations and licensing). Their sourced corrections were applied on 2026-10-16 (`verification/CORRECTIONS-APPLIED.md`; one-page summary in `verification/00-VERIFICATION-SUMMARY.md`), and a person must still check them. Two to know now: the ILTF donation link is held (an injected spam link was seen on its pages) and wsdp.org, indiancanyon.org, kaipoma.org and the look-alike "Friends of the Cheyenne River Youth Project" are never linked; the Sherrill row's treaty field was corrected to Fort Schuyler (1788) and Canandaigua (1794).
8. **Draft and publish the governance set** (charter and positionality, data policy, removal policy, AI policy, donation policy) before any outreach.
9. **Plan tribal advisory outreach** through proper tribal offices: choose pilot nations, a named steward, and compensation.
10. **Review the nation name and successor crosswalks yourself or with a reviewer** before any nation page exists.

## Biggest risks

Publishing nation-specific content without review; misleading maps (precision, legality, landowner fear); unverified citations; unresolved licenses; donation listings that harm donors; maintainer capacity for corrections and removals.

Details: [02-PRD](02-PRD.md), [03-DECISIONS](03-DECISIONS-AND-OPEN-QUESTIONS.md), [04-KNOWN-ISSUES](04-KNOWN-ISSUES-AND-INCONSISTENCIES.md), [06-CONFIDENCE-LEDGER](06-CONFIDENCE-LEDGER.md).
