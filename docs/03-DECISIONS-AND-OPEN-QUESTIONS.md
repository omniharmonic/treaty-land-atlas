---
title: Decisions and Open Questions
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Decisions and Open Questions

One list of everything the owner has to decide. It merges the roadmap's D-01 to D-25 (J5 s.9) with the open questions in the interaction, IA, visual, voice, graph and method files (H, I, G) and the issues found by the synthesis (doc 04). Items numbered D-30 and up are new numbers assigned here.

**How to read it.** Each item has a recommended default and a reason. "Default (file)" means a source file already recommends it. "Default (suggested)" means no file gave one and this synthesis proposes it; treat those as weaker. Tags: **BLOCKER** stops something named; **owner action** means a person must send, sign or engage, not just decide.

Record each decision with its date in `docs/governance/decision-log.md` (a file the repo will create in Phase 0).

Quick count: 72 items. Section A has 9 (this week), Section B has 42 (before building, by phase), Section C has 21 (before launch). All 25 roadmap decisions D-01 to D-25 are included.

---

## A. Decide this week

These start the work. Without them Phase 0 and Phase 1 stall or run on guesses.

**D-01 Project name and repo name. BLOCKER for repo creation (name only).**
Default (file, J5): keep the placeholder "Treaty Land Atlas" for the repo; decide the public name after the first tribal advisory conversations and before the domain is set. Why: the design files use a different working name, "What Was Promised" (I1), but I1 itself says no search, trademark or domain checks were run and the name is untested with the people most affected. Related open items: run the I1 s.4.4 checks; legal review of the "Treaties are law" tagline (I1 Q2); final name touches every sample string in I5 (I5 Q7); wordmark and favicon are undesigned (I4 Q6). Issue: doc 04 K-07. The graph schema `$id` already hard-codes `omniharmonic.github.io/treaty-land-atlas` (K-20), so choose the repo name knowing that.

**D-02 GitHub account, ownership and who may merge. BLOCKER for P0-02.**
Default (file, J5/J3): repo under the account the owner names; the agent opens pull requests only; the owner or a second maintainer merges; no direct pushes to `main`; fine-grained token limited to this one repo; two-factor on. The owner's convention may be the clawmniharmonic account for agent git operations: this is recorded as a question, not assumed. Public credit stays "Benjamin Life (@omniharmonic)" whichever account pushes. Why: it sets the Pages URL, who controls branch protection, and what appears publicly. Source: J3 s.6.

**D-03 Licenses for code and for the project's own data and text.**
Default (file, J4/J5): code MIT or Apache-2.0; original text and compiled data CC BY 4.0 with "Benjamin Life (@omniharmonic)". Tribal-contributed text under whatever each nation agrees in writing, never defaulting to CC. Why: matches the open posture of the Forest Service layer and dependencies. Needed for code at P1-01; for data by P7 (gate G-13). If the Land-Grab data (share-alike) is ever used, revisit. Lawyer to confirm CC BY-SA 3.0 compatibility.

**D-04 Accept the 14 architecture decisions (J1 ADR-001 to 014).**
Default (file): accept. Astro, Svelte islands, MapLibre, quantized GeoJSON, OpenFreeMap with fallback, Pagefind, build-time graph SVG, no analytics, budgets, WCAG 2.2 AA, i18n, privacy. Why: they are internally consistent. Caveat: version numbers were observed 2026-10-16 and the agent must re-check them against current docs (J6 says so). One ADR conflicts with a design file: fonts (see D-36).

**D-05 Repository visibility.**
Default (file, J3): private through Phases 0 to 6, preview from the downloadable CI artifact, make public and enable Pages at launch. Why: free GitHub Pages needs a public repo, and a public repo from day one would expose unreviewed nation content, contradicting G3 s.3.3. Alternative: public with `noindex` (simpler, but everything becomes visible at once).

**D-06 Analytics.**
Default (file, ADR-010): none at launch. Add a cookieless counter later only with a written decision, a privacy-page update and tribal advisory input. Why: G4 and G3 favor non-invasive measurement; success measures in doc 02 do not need it.

**D-07 Legal reviewer: who, what scope, what budget. Owner action. BLOCKER for G-08, G-16, G-17.**
Default (file, J5 P0-07): engage early a federal Indian law practitioner or legal historian; phase sign-offs. Scope: vocabulary, evidence categories E0-E7, legal-status taxonomy S1-S9 and panel language, quotation policy, site terms and privacy, charitable-solicitation question (F4), removal-right interaction with open licenses (G3 gap 10). Also set review cadence (G2 s.11 item 4, I3 Q6, I1 Q4). Why: the counterfactual and legal-status panels cannot publish without sign-off.

**D-09 Approve and send the Native Land Digital message. Owner action.**
Default (file, J2 s.7, E1): edit the draft and send by Discord and tech@native-land.ca. The agent never sends it. Why: Tier 1 or 2 (live lookup or snapshot) needs written permission; the draft asks 13 questions (including which instrument governs the GeoJSON, tileset and ArcGIS layer). Tier 0 (outbound link) needs no permission. Optional: run the CORS test with the owner's own key (J2 s.8).

**D-60 Send the Forest Service license question. Owner action. BLOCKER for gate G-01.**
Default (file, J5 Appendix A, J4): send the short note to the Office of Tribal Relations contact listed on Data.gov. Four questions: CC BY 4.0 for geometry and attributes; derivative redistribution; which polygon count; newer version. Why: the license conflict (K-03) and the count conflict (K-02) cannot be resolved from the files. Added here as D-60 because J5 treats it as a task (P0-04), not a decision, but it is on the critical path.

---

## B. Decide before building (by the phase named)

### B1. Before Phase 1

**D-15 Launch policy for `[from-memory]` items and verification scope. BLOCKER for P3-01.**
Default (file, J5): show a visible badge on every `[from-memory]` cite; require zero in legal-status panels and tours; verification wave covers all treaty and case rows displayed prominently. Why: 222 graph nodes carry from-memory text, 43 disputed, 20 unverified (H1). Three verification passes are running now (not incorporated; doc 06).

**D-64 Public wording for treaty counts (new).**
Default (file, A1 s.8): "368 ratified federal-era treaties in the National Archives series (375 including British-era items); about 370 in common usage", with a tooltip listing why counts differ. Why: no source gives one canonical number. Never print the graph's 369 as "treaties" (it includes Fort Laramie 1851, not in the NARA table). See K-01.

**D-51 Who may edit the seed CSVs, and when (new, from H1 s.6 and J6).**
Default (suggested): Phase 1 does not edit seeds. After verification, one controlled "seed v2" pass by the research owner fixes known errors (violations lack `instrument_id`; NANA typed as tribal government; the 23/25 code count; doctrine counts), logged in `data/CHANGELOG-DATA.md`. Why: J6 forbids silent fixes; H1 lists 20 mismatches and says some "should happen in the seed itself".

**D-53 Keep the Python graph builder or port it to TypeScript (new, from J1 ADR-007, R20).**
Default (file): keep Python; keep the `build/*.json` file contract stable; port only if CI or contributor friction appears. Why: it already works; two languages are an accepted cost.

**D-25 Edge display policy in production.**
Default (file, J1/J5): show only `asserted_by_seed` and `accepted` edges; show `proposed` edges only in preview, labeled "Suggested connection, not yet reviewed"; hide proposed edges that touch a Nation or a successor claim. Why: 2,346 of 3,542 edges are proposed and none is human-reviewed (H1, H3).

**D-48 Keep the `nat-sioux` node ("as named in treaty records")? (new, H2 Q1)**
Default (file, H2): keep for the audit trail, never display it as a heading; show the party text instead. Why: invites readers to treat "Sioux" as an entity.

**D-49 When to create present-day nation (`nat-pd-`) nodes (new, H2 Q2)**
Default (suggested): keep the 87 already built, all `record_only`; create new ones only on a reviewed request from the nation. Why: H2 says this is a product decision and consistent with G3 only if nodes stay record-only.

**D-50 Who names reviewers where several governments claim a history (new, H2 Q3)**
Default (suggested): do not name any; ask the tribal advisory structure (D-08). Cases: Cherokee, Ponca, Seminole, Ute, Chippewa/Ojibwe. Why: "who speaks" is not obvious and a wrong choice is itself harm.

**D-54 Parachute vault as a working surface (new, H4)**
Default (file, H4/H3): optional working surface only; flat files in git stay the source of truth; use `tla/` tag prefix to avoid colliding with the existing vault tags. Why: H4 is confidence low and no export was tested.

### B2. Before Phase 2 (map and slider)

**D-36 Fonts: Charis SIL and Atkinson Hyperlegible (I4, tokens) versus Noto only (J1 ADR-013, J5 P2-01, J6). BLOCKER for P2-01.**
Default (file, I4): adopt the I4 pair only if the coverage test passes on `tests/fixtures/unicode-names.txt` (modifier letter turned comma U+02BB, combining marks, Dakota and Cherokee characters); otherwise fall back to Noto. Why: the tokens file already carries the Noto fallback, but J5 and J6 tell the coding agent to self-host Noto subsets while importing tokens that name other fonts. Issue K-08. All font licenses are `[from-memory]`.

**D-21 "Today" layer source.**
Default (file): Census cartographic boundary file (1:500,000, current vintage). BIA Land Area Representation only with BIA's OK (it says "no legal inference"). Why: Census is not copyrighted and is small; both are statistical, not legal. Gate G-04.

**D-22 Self-host the fallback basemap now or only if needed.**
Default (file): only if needed; rehearse once. Why: OpenFreeMap has no SLA; Protomaps docs discourage hotlinking and suggest copying to own storage.

**D-31 URL hash key names (`lens`, `tour`, `tab`) (new, I2 Q5)**
Default (suggested): the coding agent proposes in P2-07; owner approves. Why: engineering detail.

**D-32 Treaty URL form (new, I2 Q1)**
Default (suggested): ID plus slug with a generated alias page, decided before P3-01. Why: ID-only paths are stable but unfriendly on a share card; I2 flags the choice without a default.

**D-33 Window and Event-snapshot modes at launch (new, I3 Q3)**
Default (suggested): Cumulative and Window in Phase 2 (J5 P2-04 already specifies both); Event snapshot with Phase 4. Why: I3 asks and gives no default.

**D-34 Persistent "Legal status today" bar on phones in Honored mode (new, I3 Q1)**
Default (file, I3): rule stays (never hidden); test the weight with real users before launch. Why: principle 1.

**D-35 Mobile performance (new, I3 Q8)**
Default: measure on real mid-range phones in P2-11; I3 used only headless Chromium. Why: budgets are proposals.

### B3. Before Phase 3 (pages, graph, search)

**D-11 Counterfactual cut-point years and default lens.**
Default (file, G2 s.11 / J5): 1783, 1830, 1851, 1868, 1871, 1887; federal-record lens as default with evidence flags one click away; every date verified against Kappler or Statutes at Large before the cut-point menu ships (I3 Q2: recommend no launch before dates are verified). Why: Fort Laramie 1851 numbering and several Stat. cites are unverified.

**D-12 Place lookup.**
Default (file): none, or county-level only; no addresses. Open sub-question (I2 Q2): wording for the `/near/` county page; suggested "records that touch this county", not "whose land this is". Why: Royce polygons are about 1:2,000,000 and overstating the relationship at county level is a risk.

**D-13 Alaska and Hawaii.**
Default (file): context-labeled entries only, after the legal reviewer advises; not on the treaty slider; separate inset maps with different legal-context labels (I3 Q7, not yet designed). Why: ANCSA and Hawaiian history are distinct legal regimes; the seed has no ratified treaty with either.

**D-23 Treaty text sources.**
Default (file): link-only to OSU, IDA and UNL; no scraping. Gate G-09.

**D-18 AI-assistance disclosure.**
Default (file): label in editorial notes (`ai_assisted`); no nation narrative from model output alone.

**D-30 Where tours live; whether the timeline has its own page (new, I2 Q3-Q4)**
Default (file, I2): tours under `/tours/` and also on nation pages; timeline gets its own page (accessibility). 

**D-37 Treaty-count and acreage display rules (new)**
Default (suggested): ranges with the source of each figure; "widely cited" label for 138 to 48 million acres; never sum polygon areas (G2). Why: brief principle 7; K-11.

**D-38 Legal-status staleness threshold for S9 and 2025-2026 items (new, I3 Q5)**
Default (suggested): every such item shows an "as of" date; set the re-check threshold with the legal reviewer; recheck all 2026 items immediately before launch (B2 and B3 gaps list them). Why: Bears Ears, Oak Flat, Fort Reno, DAPL, Pe' Sla, Penobscot, Mi'kmaq, Siletz rest on single news sources.

**D-44 Native-led content-warning resources to link (new, I5 Q3)**
Default (suggested): link none until a Native-led resource is vetted; the page carries its own warning. Why: I5 says none vetted.

**D-45 Nations that use "tribe" in their own name (I5 Q4)**
Default (file, I5): always use the nation's own name exactly; the default "nation" voice applies only to generic prose.

**D-46 "Land Back" as navigation label or only in context (new, I5 Q5)**
Default (suggested): in context with attribution ("described as"). Why: F1 says the term's origin and meaning are contested and the site should name who defined it.

**D-47 Voice for nation pages after review (new, I5 Q1)**
Default (suggested, from G3 s.5): any account of a nation's own view is nation-supplied text only; maintainers write Class P/D facts. Needs an explicit edit-rights policy in the governance set.

**D-55 ICC 1978 map as a vector layer (new, G2 s.11 item 5)**
Default (file): defer; at most an indicative image overlay. Why: large effort, no vector dataset found.

**D-56 Scope boundary for v1 (new, G2 s.11 item 6)**
Default (file): the 374 ratified treaties and Royce coverage 1784-1894; pre-1784 colonial agreements and post-1894 changes are separate workstreams.

**D-57 Seed fixes to the Black Hills figures, NANA, and others (new)**
See doc 04 K-12, K-14. Default (suggested): resolve in the verification wave, not by editing prose.

### B4. Before Phase 4 (counterfactual) and Phase 5 (support)

**D-14 Organization display threshold and donation-policy review.**
Default (file): publish only high and medium confidence; lawyer review before the Phase 5 release (G-17). 16 of 67 seeded organizations are not display-eligible (build report).

**D-39 Verify donation URLs and EINs before any listing (new, F2/F4)**
Default (file, F4): open every donation page in a browser, check IRS TEOS, charity-watchdog reports, domain age and lookalikes; assign Tier 1/2/3/Do-not-link. Several sites refused automated reading (CRYP, The Cultural Conservancy, Native American Land Conservancy, First Light); wsdp.org and indiancanyon.org served unrelated content; Esselen donation page not opened. Do not publish "Namaste" or "Pe'pe'ketoh" (F2 could not identify either).

**D-41 Uncertainty exaggeration factor (new, I4 Q7)**
Default: 2.5 is a placeholder; tune in P4-07 with the legal reviewer and tribal input.

**D-42 Share images from Honored mode (new, I3 Q9)**
Default (suggested): allow only with the "Legal status today" line and "not a legal boundary" embedded in the image (J5 P4-08 already requires lineage line and disclaimer).

**D-43 L7 land-status context (public/private) layer (new, I3 Q4)**
Default (file, I3): omit at launch until counsel and tribal advisors weigh in (G2 s.6).

**D-58 Hue for violation markers (new, I4 Q4)**
Default (suggested): keep, but test with color-vision-deficiency users; evidence flags make color secondary. Alternative: a blue-violet or neutral.

### B5. Before outreach (any phase)

**D-08 Tribal advisory approach. Owner action. BLOCKER for nation pages (G-15).**
Default (file, J5/G3): per-nation review plus a small paid advisory council for policy only; individual nations consent for their own content. Pilot with two nations the owner can reach through proper offices (G4 suggests Cherokee and Klamath; the owner decides). Decide compensation, a named steward, and whether a council exists before the first nation page and what authority it has over the whole site (I1 Q5). Why: silence is not consent; unreviewed nation pages ship record-only.

**D-61 Positionality statement (new, I1 Q6, G3 s.5)**
Default: the owner writes it; G3 requires it; no design agent supplied one. Must say plainly that the project is not Indigenous-led. Needed before any outreach (G-14).

**D-19 Corrections and tribal channels; response targets.**
Default (file): named steward; acknowledge within a few business days; hide-then-review for nation requests (target hours). Also set the review-comment turnaround maintainers can commit to (I1 Q3, I5 Q6). Needed by P0-10.

**D-10 Courtesy and clarification notes to HCN, OSU, IDA/MIAC, Newberry. Owner action.**
Default (file): send OSU and IDA courtesy notices; HCN only if the Land-Grab layer is planned. Why: gates G-06, G-07, G-09.

---

## C. Decide before launch

**D-16 Languages.** Default (file): English at launch, Spanish next; Indigenous-language UI or audio only with community authorization. Spanish needs a translator, a reviewer and a glossary decision for "cession" (I5 Q2, D-62).

**D-62 Spanish translation owner and review (new, I5 Q2).** Default (suggested): defer Spanish content until a reviewer is named; keep the `/es/` stub hidden (J5 P6-04).

**D-17 Data archive and DOI; hosting fallback triggers.** Default (file): archive with a DOI at `data-v1.0.0`; fallback triggers per J3 s.8.4 (site near 500 MB or a file over 25 MB: move heavy layers to Cloudflare R2; bandwidth near 100 GB/month: Cloudflare in front or Cloudflare Pages).

**D-20 Funding and conflict-of-interest disclosure.** Default (file): publish before launch (P5-08), including any Land Back organizations the site promotes.

**D-24 Launch scope.** Default (file): general layers and Class P/D pages at v1; counterfactual and nation narratives only where G-15 and G-16 are satisfied. Consequence: v1 may ship without the counterfactual explorer.

**D-63 Contact plan beyond NLD (new, G2 s.11 item 7, G1 s.19).** Default (suggested): NLD, Forest Service, MIAC/IDA, HCN, OSU in that order; log every send in `docs/release/outreach-log.md`.

**D-65 Removal right versus open licenses and public-record citations (new, G3 gap 10).** Default: legal reviewer decides before launch; Class P records may remain as primary-source citations (G3 s.7). Why: not yet reviewed.

**D-66 Photography (new, I4 Q5).** Default (suggested): none at launch until a consent and review process exists.

**D-67 Palette and accessibility testing with people (new, I4 Q3, G-19).** Default: test color-vision simulation results with real users on phones outdoors; run the manual audit protocol (screen reader users, zoom, forced colors, reduced motion).

**D-68 Wordmark and favicon (new, I4 Q6).** Default: design after D-01.

**D-69 Verification of the "Legal status today" content for each panel (new).** Default (file, J5 R9): zero unverified items in any displayed legal-status panel.

**D-70 Succession and wind-down statement (new, G3 s.7).** Default: publish; cite Mapping Indigenous LA as the cautionary precedent.

**D-71 Domain and DNS (new, J3 s.8.3).** Default: a subdomain of a domain the owner already holds, or a new dedicated one, chosen after D-01. Must not use or imply OpenCivics. Enforce HTTPS.

**D-72 Public repo switch and variables flip (new, J5 P7-04).** Default: owner sets `SITE_STAGE=production` then `PAGES_DEPLOY_ENABLED=true` only after the launch-gate table shows no pending gate.

**D-73 Native Land Digital tier at launch (new).** Default (file): Tier 0 (outbound link, acknowledgement, disclaimer). Tier 3 (user-supplied key) stays disabled. Revisit at the 30-day review (P7-09).

**D-74 HCN Land-Grab layer (Tour G).** Default (file, J4): do not ship until the repository LICENSE is read, HCN replies, and a lawyer confirms a separate-layer approach. May be dropped from v1.

**D-75 Which tours ship (new).** Default (file, J5): A, C, E authored first; others after tribal review; each tour shows its review status.

**D-76 Whether the "Treaties are law" tagline survives legal review (new, I1 Q2).** Default: legal reviewer decides; do not use before then.

**D-77 Evaluate whether `proposed` edges ever become `accepted` and who accepts (new).** Default (file, H1/J5): only humans, with `reviewer_role` and date; a CLI exists in P1-05. Legal reviewer for violation-to-treaty and case-to-treaty links.

**D-78 Moderation for harassment of landowners or Native contributors (new, G3 s.13).** Default (file): coarse maps, moderation and a response plan.

**D-79 State-level or other-jurisdiction content (new).** Default (suggested): out of scope for v1 (C1 notes the dataset is federal law only).

---

## Summary of blockers

| Blocker | Stops | Item |
|---|---|---|
| No repo name or account | Creating the repo | D-01, D-02 |
| No licenses chosen | First scaffold (code), launch (data) | D-03 |
| Font conflict | P2-01 | D-36 |
| No legal reviewer | G-08, G-16, G-17; counterfactual and legal-status panels in public | D-07 |
| No tribal advisory plan or positionality statement | Any outreach; all nation pages | D-08, D-61 |
| Unsent license questions | G-01, G-02 | D-09, D-60 |
| Verification policy | Any prominent cite | D-15 |

## Sources

`docs/design/J5-build-roadmap.md` s.9 (D-01 to D-25); `docs/design/I1` to `I5` (Open questions sections); `docs/design/H1`, `H2`, `H3`, `H4`; `docs/research/G2` s.11, `G3` s.3, s.5, s.7, s.13, `G4`, `F2`, `F4`, `A1`; `docs/data/E1`; `docs/design/J2`, `J3`, `J4`.

## Confidence & Gaps

Confidence: medium. Defaults marked "suggested" are this synthesis's proposals where no file offered one; they have not been reviewed. New numbers run D-30 to D-79 and are not contiguous: D-26 to D-29, D-40, D-52 and D-59 were not used (questions that merged into an older item are noted in that item's text). Items are grouped by when they are needed, so numbers are not in order within a section.
