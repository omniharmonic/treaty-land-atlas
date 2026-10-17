---
title: Product Requirements Document
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Product Requirements Document (PRD)

Working title: Treaty Land Atlas. The design files use the working name "What Was Promised" (see doc 04, issue K-07). This PRD summarizes and points. It does not duplicate: where a requirement lives in detail, the path is given.

Requirement IDs (R-nn) are new in this document so that later files can cite them. Every one traces to an existing file.

---

## 1. Goals

| ID | Goal | Source |
|---|---|---|
| G1 | Show treaty law with Native nations over time on a map that a reader can operate by keyboard and phone | `docs/research/G4`, `docs/design/I3` |
| G2 | Tie every claim to a source, with its confidence visible on the page | `docs/00-RESEARCH-BRIEF.md` s.2-3 |
| G3 | Connect treaties, violations, cases, statutes, nations and organizations in a graph a person can explore in plain language | `docs/design/H1`, `H5` |
| G4 | Make a counterfactual ("honored through year X") that teaches without implying a legal claim | `docs/research/G2` |
| G5 | Direct attention and resources to vetted Land Back organizations without handling money | `docs/research/F4`, `F2` |
| G6 | Treat Native nations as present and sovereign: every historical view reaches "today" in one tap | `docs/design/I1` principle 1 |
| G7 | Be honest about what is unknown, disputed or unreviewed | brief principle 7 |

## 2. Non-goals

- Not legal advice, not a title, boundary or jurisdiction tool. No parcel, address or property-level output. Place lookup at most county-level (decision D-12).
- Not a payment processor. The site collects no money and no payment details (`docs/research/F4`).
- Not a voice for any nation. No nation-specific narrative from model output alone (`docs/research/G3` s.12).
- Not a copy of Native Land Digital, Invasion of America, OSU, IDA or UNL data. Link out only unless written permission exists (`docs/design/J2`, `J4`).
- No analytics, cookies, third-party scripts or user accounts at launch (`docs/design/J1` ADR-010, ADR-014).
- No sacred-site, burial or withheld locations (`docs/research/G3` s.4).
- Alaska and Hawaii are not on the treaty slider by default; context-labeled entries only after legal advice (D-13).
- No map geometry after 1894 from Royce. After 1894 the site uses event mode (`docs/research/G2`).
- No Indigenous-language UI, audio or imagery without community authorization (`docs/design/I1` s.4.1, D-16).

## 3. Audiences

| Audience | Needs | Detail |
|---|---|---|
| General reader | One accurate new idea and one action | `docs/design/I1` s.3.6 |
| Educator | Printable, no-login tours that do not misrepresent a nation | `docs/research/G4` |
| Ally or donor | A vetted destination, or a prompt to ask the nation first | `docs/research/F4` |
| Journalist, researcher | Permalinks, sources, data, corrections route | `docs/design/I2` |
| Tribal reviewer | A review mode where nothing surprises them | `docs/research/G3` s.3 |
| Maintainer (the owner) | Plain-language runbooks and gates that fail closed | `docs/design/J3`, `J5` P6-11 |

## 4. Features by phase

Phase numbers follow `docs/design/J5-build-roadmap.md`. "Needs" lists what must exist for the public version, not for private preview.

| Phase | Feature | Requirement | Detail | Public release needs |
|---|---|---|---|---|
| 0 | Permissions, licensing, governance documents, tribal advisory plan, legal reviewer, verification wave | R-01 Run in parallel with coding; results gate Phase 7 | J5 Phase 0; J4 | Gates G-01 to G-21 |
| 1 | Data pipeline and graph: validated, deterministic JSON; license registry; review ledger; suppression | R-02 Build fails on missing citation, bad ID, uncleared license, unreviewed nation narrative | J5 Phase 1; J3 s.4; H3 | None (internal) |
| 2 | **Time slider and map** over Royce cessions 1784-1894; events table; detail panel; URL state; Today layer; Native Land Digital outbound link only | R-03 Slider usable by keyboard, with table equivalent; R-04 Every polygon links to Royce schedule and Kappler/statute where present; R-05 Standing disclaimer "approximate, not legal descriptions" | J5 Phase 2; J1 ADR-006; I3 | G-01, G-02, G-03, G-04, G-10, G-11, G-19, G-21 |
| 3 | **Layers:** violations (place-level only), cases, statutes, doctrine lineage; **case and treaty pages**; four-track timeline; neighborhood **graph view**; Pagefind search; corrections log | R-06 Confidence badge on every flagged field; R-07 Reserve "violation" for evidence flags E3-E7; R-08 Unreviewed nation pages carry Class P/D facts only | J5 Phase 3; G2 s.4; G3 s.3.3; H1; H5 | G-08, G-12, G-14, G-16, G-18 |
| 4 | **Counterfactual explorer** with cut-points, lenses, layers L1-L8, uncertainty tiers T1-T4, **Legal Status Today panel** (S1-S9), exports | R-09 Panel never hidden; R-10 Overlapping claims never dissolved; R-11 No acreage totals; R-12 Hidden in production unless signed off by the legal reviewer | J5 Phase 4; G2; I3 | G-15, G-16 |
| 5 | **Organization directory** and **Support flows**: per-listing label block, recipient types, outbound-notice pattern, link-liveness job, land-returns layer | R-13 Low-confidence organizations never published; R-14 Donation link must be on the organization's own domain or a named fiscal sponsor; R-15 Pre-click notice "we receive nothing" | J5 Phase 5; F4; F2; F3 | G-17 |
| 6 | **Guided tours** (A to I, first three authored: Fort Laramie and the Black Hills; Johnson to McGirt; Blue Lake), home page entry points, i18n scaffold, accessibility audit, maintainer runbooks | R-16 Every tour beat has evidence; R-17 Text-only version of every tour; R-18 Tours end at "today" | J5 Phase 6; G4 s.4-5 | G-19, G-20, tribal review status shown per tour |
| 7 | Launch: gate review, data release, domain, flip two variables, live smoke test, rollback rehearsal | R-19 Production build refuses to render while any used gate is not `cleared` | J5 Phase 7; J4 s.4 | All gates |

Guided tours listed in G4: A Fort Laramie/Black Hills; B Klamath/Blue Creek; C Johnson to McGirt; D Cherokee; E Blue Lake; F a treaty right that still works; G Morrill Act; H the word "cession"; I Start where you are.

## 5. Content model summary

Full model: `docs/design/H1-graph-data-model.md`; schemas in `docs/design/schema/`.

- **13 node types:** Instrument, Statute, Case, Doctrine, PolicyEra, Violation, Nation, Organization, Campaign, Place, Source, Person, GeoFeature. Current build: 1,563 nodes (Person and GeoFeature are reserved, none yet).
- **31 edge types** in the schema (22 used in the current build), each with status `asserted_by_seed`, `proposed` or `accepted`. Only humans set `accepted`.
- **Counting rule:** do not count Instrument nodes as treaties. Filter on `instrument_type = ratified_treaty` (369 today; see doc 04 K-01).
- **Every node carries:** `confidence` (high/medium/low) and `verification_status`; `provenance`; `tribal_review`; `publication`; `data_class` (P, D, N, R, with K and S never published).
- **Two voices, kept apart:** federal-record and evidence on one side; "tribal account" only where a nation supplies it.
- **IDs:** `TLA-T-###` from the NARA RIT number; others per H1. Released IDs are never reused or removed without a tombstone.

## 6. Ethics and governance requirements

Source: `docs/research/G3-ethics-and-indigenous-data-governance.md`, enforced in builds by `docs/design/J3` checks V13, V14, V15, V16.

| ID | Requirement |
|---|---|
| E-01 | Review statuses are exactly: not contacted, invited, reviewed, co-authored, edits requested, declined, withdrawn. **Silence is never consent.** |
| E-02 | Content that speaks for a nation cannot publish while its status is not contacted or invited. Class P and D facts may, with a visible "not reviewed by [nation]" notice. |
| E-03 | A nation's authorized body can require removal or editing without justifying it. Hide first, review afterward, target hours. A tombstone appears unless the nation asks for none. |
| E-04 | Endonyms only from nations. Successor-in-interest links stay `proposed` until a nation confirms. |
| E-05 | Governance documents (charter with a plain statement that the project is not Indigenous-led, data policy, corrections and removal policy, AI policy, donation policy) are published before any outreach. |
| E-06 | Advisory time is compensated. A named steward owns removal requests. A wind-down statement is published. |
| E-07 | Inform-by language only: "informed by CARE and OCAP principles". Never claim OCAP compliance (OCAP is a registered trademark of the First Nations Information Governance Centre). |
| E-08 | AI assistance is labeled in editorial notes (`ai_assisted`). No nation-specific narrative from model output alone. |
| E-09 | Content-warning patterns and "see today" on every historical view. |
| E-10 | Funding and conflict-of-interest disclosure published before launch. |

## 7. Accessibility

Target WCAG 2.2 AA (`docs/research/G3` s.11, `docs/design/J1` ADR-012).

- Native range input for the slider, `aria-valuetext`, arrows/PageUp/PageDown/Home/End, previous/next-event buttons, cut-point chips (no dragging required).
- Targets at least 24 by 24 CSS px; focus never hidden behind sticky bars.
- Play/pause off by default, never autoplays, disabled under reduced motion.
- Never color alone: legal type uses pattern plus outline plus legend text; Okabe-Ito hues; 23-symbol violation icon sprite.
- Every map state has a table equivalent; details open in a side panel with managed focus; map has a no-WebGL fallback.
- Works at 320 px; light, dark and forced-colors themes (`docs/design/tokens.css`).
- Manual audit with screen-reader users and disabled testers is a launch gate (G-19). Nothing has been tested yet.

## 8. Success measures that are not vanity metrics

No analytics at launch (ADR-010). Measures are therefore qualitative or privately reported:

| Measure | How | Source |
|---|---|---|
| Nation pages reviewed or co-authored (count and status mix) | Review ledger | G4 s.6 |
| What changed because of tribal reviewer feedback | Corrections log, ledger notes | G4 s.6 |
| Verified-recipient referrals | Reported privately by organizations, not tracked by the site | G4 s.6, J1 ADR-010 |
| Educator adoption and misconception change (before/after probes, anonymous) | Pilot classrooms | G4 s.6 |
| Corrections: time to acknowledge, time to fix, share accepted | Issue tracker | G3 s.7, I1 open question 3 |
| Unverified items remaining in displayed rows | Build report | J3 V6 |
| Share of legal-status panels signed off by reviewer | Build report | J3 s.5 |
| Accessibility blockers open at launch (target zero) | Audit report | J5 P6-07 |
| Performance budgets met on a mid-range phone | CI plus manual | J1 ADR-011 |

Page views, time on site and social shares are not goals.

## 9. Explicit release gates

Source: `docs/design/J4-licensing-and-release-gates.md` s.4. Nothing ships until each gate used by a shipped feature is `cleared` with evidence in `docs/release/`, or the feature is removed from the launch build. The production build fails on any uncleared license gate (J3 s.4.2).

| Gate | Condition | Blocks |
|---|---|---|
| G-01 | Forest Service Royce license confirmed in writing; polygon count authority recorded | Public launch (not private work) |
| G-02 | Native Land Digital: Tier 0 only with approved attribution, or written permission for a higher tier | Launch; any Tier 1+ feature |
| G-03 | Library of Congress Royce credit line confirmed | Launch |
| G-04 | Census "today" layer vintage, disclaimer, trademark rule | Launch |
| G-05, G-06, G-07 | BIA LAR, HCN Land-Grab, Newberry: only if those features are built | That feature |
| G-08 | Quotation policy; legal reviewer confirms | Launch |
| G-09 | Third-party portals (OSU, IDA, UNL, Avalon, NMAI) are link-only | Launch |
| G-10 | OpenFreeMap terms rechecked; attribution; privacy disclosure | Launch |
| G-11 | Software and font licenses audited; `NOTICE.md` generated | Launch |
| G-12 | Verification wave done or unverified items visibly badged | Launch |
| G-13 | Project's own license decided; credit "Benjamin Life (@omniharmonic)" | Launch |
| G-14 | Governance documents published | Any outreach; launch |
| G-15 | Tribal advisory approach, invitations, status badges | Nation pages and counterfactuals |
| G-16 | Federal Indian law reviewer signs off on vocabulary, E0-E7, S1-S9, panel language, terms and privacy | Phase 4 public release; launch |
| G-17 | Charitable-solicitation review by a lawyer in the owner's state | Phase 5 public release |
| G-18 | Sensitive-content review | Launch |
| G-19 | Accessibility audit and statement | Launch |
| G-20 | Corrections and takedown readiness, rehearsed | Launch |
| G-21 | Privacy page matches actual requests | Launch |

Note: J4 lists G-13 in its license table and G-12 in its content table, so numeric order does not match table order. This is cosmetic.

## 10. Launch scope recommendation

Per D-24 (`docs/03`): ship general layers and Class P/D pages first. Counterfactual explorer and nation narratives ship only where G-15 and G-16 are satisfied. This means v1 may launch without the counterfactual explorer.

## 11. Dependencies and risks

See `docs/design/J5` section 8 (risks R1-R20). The three most schedule-critical: legal reviewer availability, tribal review capacity, and written answers from the Forest Service and Native Land Digital.

## Sources

Project files only, as cited inline. No external sources were consulted for this document.

## Confidence & Gaps

Confidence: medium. Requirement IDs and the success-measure table are this document's synthesis of existing proposals; none has been reviewed by the owner, a lawyer, a tribal body or an accessibility specialist. Phase feature lists inherit J5's session estimates, which are rough.
