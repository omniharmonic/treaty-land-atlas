---
title: Known Issues and Inconsistencies
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Known Issues and Inconsistencies

Where the research and design files disagree with each other, with the build, or with themselves. Nothing here is smoothed over. Where the right answer can be determined from the files it is stated; where it cannot, the item says so and names who should resolve it.

Severity: **High** = could mislead the public or block launch. **Medium** = needs a decision or a fix before the affected feature ships. **Low** = cosmetic or housekeeping.

References like "A3 s.2" mean section 2 of `docs/research/A3-geospatial-and-treaty-datasets.md`. Line numbers are approximate and from 2026-10-16.

## Index

| ID | Issue | Severity |
|---|---|---|
| K-01 | Treaty counts: 368 / 369 / 370 / 374 / 375 / 377 / 389 / 418 | High |
| K-02 | Royce polygon count: 718 vs 752, and A3 and E2 contradict each other on which source says what | High |
| K-03 | Forest Service layer license: CC BY 4.0 vs none in metadata | High |
| K-04 | Native Land Digital terms: CC0 vs treaty vs FAQ; and E1 vs G1/G3 on whether the treaty page was read | High |
| K-05 | Stale graph build numbers in J1, J3, J5, J6 (fixed) | Medium |
| K-06 | Violation code count: 23 vs 25 (and what the CSV really uses) | Medium |
| K-07 | Project name: "Treaty Land Atlas" vs "What Was Promised" | Medium |
| K-08 | Fonts: I4 and tokens vs J1 ADR-013, J5, J6 | Medium |
| K-09 | "Invasion of America" attribution and launch date | Medium |
| K-10 | "Office of Indian Trust Assets" not found | Low |
| K-11 | "138 million to 48 million acres" has no primary source | High |
| K-12 | Black Hills award and fund figures disagree | High |
| K-13 | Counts that do not reconcile across seeds, README and graph | Medium |
| K-14 | NANA typed as a tribal government; Esselen confidence | Medium |
| K-15 | Land-Grab Universities: license conflict and two different repo URLs | Medium |
| K-16 | Same fact, different confidence tag in different files | Medium |
| K-17 | Two confidence vocabularies; "verified" has several meanings | Medium |
| K-18 | Other figures that disagree (ICC, buy-back, termination, settlements) | Medium |
| K-19 | Treaty detail conflicts (dates, page numbers, NAID, ratification) | Medium |
| K-20 | Schema `$id` presumes the repo owner and name | Low |
| K-21 | Stat. cite cross-check failures and corrupted OCR page numbers | Medium |
| K-22 | 2026 events with conflicting or single sources | High |
| K-23 | Royce source details (page range, date) | Low |
| K-24 | Gate numbering, estimates, and other housekeeping | Low |
| K-25 | Content flagged as "do not publish" or unidentifiable | Medium |
| K-26 | Checked and found consistent | Info |
| K-27 | Edits made by the synthesis | Info |
| K-28 | Verification reports (V1-V3): corrections applied 2026-10-16; the unresolved and unverified remainder is listed | High |

---

## K-01. Treaty counts

**Where.** A1 s.4.1-4.3 (table of 11 sources); A3 s.3-4; E2 s.2; G2 s.11 (uses "374 ratified"); H1 s.7 (369); `build/graph-build-report.md`; `seed-data/README-treaties.md`; J5 P1-02 (NARA 376 rows).

**The numbers and their meaning.**

| Figure | Who says it | What it counts |
|---|---|---|
| 368 | A1 derived from the NARA table | Federal-era ratified treaties: RIT 8-374 plus 19A |
| 375 | UNL portal; A1 derived | 368 federal plus 7 British-era items (RIT 1-7). Also the State Department list per ASU guide |
| 374 | NARA, NMAI, IDA | NARA's numbered series 1-374 (includes the 7 British-era items; excludes 19A) |
| 376 | NARA catalog-links table rows | 374 numbered + 19A + 143A (143A is a document set, not a treaty) |
| about 370 / 370 | BIA FAQ ("1778 to 1871"); Senate archives | Rounded prose |
| 377 | NARA "negotiated, 1774-1871" | Basis unstated; not equal to ratified plus unratified |
| 389 | Cohen, as described by HeinOnline | Basis unverified |
| 418 | HeinOnline | Broadest compilation |
| 366 | OSU hosts this many final texts | Nine of the 375 are absent from the Statutes at Large |
| **369** | **The graph** (`instrument_type = ratified_treaty`) | 368 NARA federal-era rows plus `TLA-T-FL1851` (Fort Laramie 1851), which is not in the NARA table as extracted |

**What is right.** There is no single canonical count (A1 s.4, brief principle 7). The cleanest reconciliation is A1's: 368 federal-era ratified treaties in the NARA series, 375 with British-era items, about 370 in common usage. The graph's 369 is defensible but is not a published figure; it mixes a NARA-derived number with one record the NARA table lacks. G2 s.11 calls the v1 base "the 374 ratified treaties", which is NARA's number and includes the British-era items that predate Royce coverage and the federal era.

**Unknowns.** Unratified count (BIA: at least 45; the seed has 21; Senate archives: "several dozen"). Post-1871 agreements (no source with a count; seed has 3). Whether Fort Laramie 1851 belongs in NARA numbering (A1 gap 3; also A2, README-treaties gap 4). The Senate archives page says the first ratified treaty was "Delaware in 1788", which A1 says is probably a typo for 1778 `[disputed]`. Whether Canandaigua (1794) was Senate-ratified is questioned by an OSU footnote (B1 gaps), yet it is treated as a ratified treaty in B2 and the seed.

**Do.** Adopt A1's public wording (decision D-64). Do not print "369 treaties". Change G2's wording to "the ratified treaties in the NARA series" or specify which count. Owner: verification agent checks Fort Laramie 1851 and Canandaigua; legal reviewer approves public wording.

---

## K-02. Royce polygon count: 718 vs 752

**Where.** A3 s.2.1 (line ~47); G1 s.3b and s.4 (752 polygons, 1,172 attribute rows, 67 maps); E2 s.1 (line ~44); E1 (718); E3 s.1, s.2, s.7 (718 `[verified]`); J1 ADR-004 ("718 to 752 `[disputed]`"); J3 s.3.4; J5 P1-08, R3; J6 P1-08.

**The contradiction inside the research.**

- A3 says **752** polygon features "per Data.gov and the REST layer description" and says the agency **metadata** says **718** vectors.
- E2 says the **REST count query returned 718** and that "metadata elsewhere cites 752 polygons and 1,172 attribute rows".
- E3 calls 718 `[verified]` from a REST query.
- G1 gives 752 and 1,172 attribute entries (748 link to Kappler texts).

So A3 and E2 assign the two numbers to opposite sources. One reading that fits everything: the live feature count is 718 and descriptive text elsewhere says 752 (or vice versa). The files do not show the evidence.

**What is right.** Not determinable from the files. Nobody downloaded the data (the sandbox blocked it).

**Do.** P1-08 counts polygons after download and records the answer in `data/PROVENANCE.md`. Until then, show no polygon count in the UI and keep `[disputed]`. Ask the Forest Service which is authoritative (decision D-60). Also expect seven cession IDs without geometry: 47, 65, 128, 129, 130, 543, 690.

---

## K-03. Forest Service layer license

**Status after the 2026-10-16 correction pass: still open (documented, not resolved).** V3 confirmed the conflict (Data.gov lists CC BY 4.0 on both listings; the agency metadata XML has no license text and says "informational purposes only"). The GEO-001 `license_or_terms` field, E2 and J4 now record both readings. Written confirmation from the Forest Service (gate G-01) is still required.

**Where.** A3 s.2.1; E2 s.1; G1 s.3b; J4 s.2.1 and G-01; J3 s.4.2 (registry example); J5 P0-04 and Appendix A.

**Conflict.** Data.gov lists CC BY 4.0. The agency metadata XML lists access constraints "None" with no explicit license, and says the data are informational only and "not legal documents and must not be used to determine title, ownership, legal boundaries, jurisdiction". A3 reads the "informational only" language as a disclaimer, not a restriction. E2 marks the whole thing `[disputed]`. Other caveats: last updated 29 Aug 2022 with updates "None planned"; no positional-accuracy statement; 89 attribute rows were edited by the Office of Tribal Relations but not reviewed by the NAGPRA Program.

**What is right.** Not determinable. Both statements exist.

**Do.** Written confirmation (gate G-01). Meanwhile the attribution text in J4 assumes CC BY 4.0 and must not ship until confirmed. Do not rely on CC BY 4.0 for any public release before the reply.

---

## K-04. Native Land Digital terms, and whether the treaty page was read

**Status after the 2026-10-16 correction pass: partly resolved.** V3 read the Data Sovereignty Treaty page directly, so the question of whether the page was read is closed in E1's favour. V3 also found a third source (the native-land.ca FAQ: commercial use "No"; footer "All rights reserved"). GEO-017 and E1 now record all three. Which instrument governs is still open and needs NLD's written answer.

**Where.** A3 s.2.4 (line ~79); G1 s.1.3; E1 s.3.1; J2 s.1; J4 s.2.1 and G-02.

**Conflicts.**

1. The API docs "about and disclaimers" page and a 2023 blog post say the dataset is **CC0** ("no proprietary license"). The **Data Sovereignty Treaty** (required to get a key) limits use to educational and non-commercial, forbids charging, altering boundaries or misrepresenting, requires acknowledgement, and says no storing or distributing API data without explicit permission. The FAQ credit line says "Used with permission for educational and non-commercial purposes". NLD does not reconcile these. E1 and J2 conclude the stricter terms govern anything touching the API.
2. **Whether the treaty page was read.** E1 quotes the treaty (fetched through a summarizing tool). G1 (s.1 and gaps item 3) and G3 (gaps item 4) say the treaty page **could not be fetched** and its contents are `[unverified]`. E1 also says the sandbox proxy blocked native-land.ca and api-docs.native-land.ca (HTTP 403) for its connection tests, while its Sources list those pages as consulted. E1 itself warns that its pages were summarized by a tool, not read raw.
3. NLD key-requirement start date: E1 `[disputed]`. Treaties layer (about 830 entries) undocumented. CORS and response schema untested. The Tier 0 deep-link template is `[from-memory]`.

**What is right.** Not determinable. J2 and J4 treat E1's reading as `[verified]`, which is stronger than G1/G3's position.

**Do.** Tier 0 only (outbound link, acknowledgement, disclaimer) until written permission. A person should read the live treaty page directly before any reliance and before the message to NLD is finalized. Do not describe the treaties layer in the product until NLD documents it (A3 gap 7).

---

## K-05. Stale graph build numbers in J1, J3, J5, J6 (fixed)

**Where and what changed.** The four files quoted a scratch run of the builder. The authoritative current numbers are in `build/graph-build-report.md` (and H1, H3).

| Item | Old (J1, J3, J5, J6) | Current build |
|---|---|---|
| Nodes | 1,529 | 1,563 (1,561 before the 2026-10-16 correction pass) |
| Edges | 3,476 | 3,543 (3,542 before the correction pass) |
| Nation nodes | 194 | 226 |
| Edge status proposed | 2,280 | 2,345 (asserted_by_seed 1,198; before the correction pass 2,346 and 1,196) |
| Orphans | 31 | 29 |
| Schema errors | 12 | 0 |
| Logged issues | 164 | 106 (69 info, 37 warn) |

**Status.** Edited on 2026-10-16: numbers corrected and a one-line italic note added under the title of each file. The sentence in J5 P1-04 and J6 P1-04 that told the agent to triage "12 schema errors" now says the current build reports 0 and an earlier run reported 12. Per-section prose was not otherwise rewritten.

**Still to watch.** H1 s.7 and H3 s.3 already carry the current numbers. Any file quoting counts should link to the build report, not copy numbers. Counts will change on the next builder run.

---

## K-06. Violation code count: 23 vs 25

**Where.** I4 s.6.2 and open question 2 (quotes a "25-code" vocabulary from the task statement); B1 s.4; B2 s.5; H1 s.6 item 13; violation seed.

**Facts.** B1 defines **23** distinct codes: 19 typed codes in s.4.1-4.3 plus 4 context codes in s.4.4. The CSV uses 23 distinct strings, but not the same 23: it uses 22 of B1's codes plus the alias `ANNUITY_NONPAYMENT` (B2's pattern table counts the alias and the full code separately, 2 entries each), and **no record uses `RAILROAD_GRANT_OR_SALE`**. The 23-symbol icon sprite (30 symbols with 7 review glyphs) follows B1. The figure "25" appears only in the task statement quoted in I4 and has no source in the files.

**What is right.** 23 defined codes, one alias (normalized by the builder), one defined code unused.

**Do.** Use 23. The owner should say where "25" came from (two codes may have been planned). Normalize the alias in the seed pass (D-51). Keep the unused code; it may be needed for the Delaware 1866 railroad sale (B2 notes only that one case).

---

## K-07. Project name

**Where.** Brief (placeholder "Treaty Land Atlas"); I1 s.4.3 (recommends "What Was Promised"); I2-I5, tokens, prototype (use "What Was Promised"); J-series and README (use "Treaty Land Atlas"); J5 D-01.

**Facts.** I1 says no search was run for existing projects, books, films, organizations, trademarks or domains using "What Was Promised", and the name has not been tested with tribal advisors. All sample strings in I5 and the prototype carry the working name.

**Do.** Decision D-01. Until decided: repo and docs say "Treaty Land Atlas"; design files say "What Was Promised" as a working name. Do a name search and trademark and domain check (I1 s.4.4) before announcing. Do not use Native-coded words as a name.

---

## K-08. Fonts

**Where.** I4 s.5 (Charis SIL for reading, Atkinson Hyperlegible Next for interface, Noto as script fallback); `docs/design/tokens.css` and `tokens.json` (same); J1 ADR-013 and s.356 (Noto Sans and Noto Serif via Fontsource); J5 P2-01 and J6 Phase 2 (self-host Noto subsets, while importing the tokens that name different fonts).

**Facts.** I4 itself says this changes an accepted ADR and requires a coverage test on `tests/fixtures/unicode-names.txt` before adoption. Font licenses are `[from-memory]` in both.

**Do.** Decision D-36. Run the coverage test. If either face fails, use Noto for that role (tokens already carry it). Update J5 P2-01 and J6 Phase 2 to say which fonts to self-host after the decision.

---

## K-09. Invasion of America: attribution and launch date

**Where.** A3 s.2.3; E2 s.3; G1 s.2; G2.

**Facts.** The task framing associated the project with the University of Richmond Digital Scholarship Lab. A3 found only "With support from the University of Richmond" on a news-site banner and no page tying Richmond to this map; E2 agrees. Sources read credit Claudio Saunt (University of Georgia) with eHistory.org. E2 `[unverified]` also says Richmond's "American Panorama" landing page did not render. Launch date: eHistory.org says 2015; other material says a "June debut" and the book is 2014 (A3 `[disputed]`; G1 says 2014 alongside *West of the Revolution*). No download or license was found; the site was blocked by robots rules; the Carto source failed to load.

**What is right.** Attribute to Saunt (University of Georgia), hosted via eHistory, per the pages read. Do not attribute to Richmond. Launch year unresolved.

**Do.** Link out only; do not copy visuals or data (J4). Ask eHistory or Saunt before any dataset use.

---

## K-10. "Office of Indian Trust Assets" not found

**Where.** D1 s.4 and gaps item 1.

**Facts.** The commissioning request listed an "Office of Indian Trust Assets". D1 found no Interior office with exactly that name `[unverified]`. It documents the trust offices that do exist (e.g., the Bureau of Trust Funds Administration created by Secretary's Order 3384, 2020; the Office of the Special Trustee for American Indians), and warns the site must not conflate them.

**What is right.** Treat as a non-finding. Do not invent the office. Use the offices D1 lists.

**Do.** Verification agent checks D1 s.4 against Interior sources; glossary D4 should not define the name.

---

## K-11. "138 million to 48 million acres"

**Where.** A1 (tagged `[verified]`, "per Wikipedia (pointer)"); B1 s.4 (`[verified, tertiary; disputed]`); B2 V045 (`[verified, tertiary]` and `[disputed]`); C2 (secondary figures, Steven Gunn via Wikipedia); D2 s.5.3 (`[verified-secondary]`, then "`[unverified at primary level]`"); D3 (`[verified-secondary]`, "primary not found"); D2 s.5.3 also cites Wilson 1935 Table VII as a differently defined primary-adjacent source (130,730,190 original plus 9,106,312 added = 139,836,502 acres through 1934; ceded 38,299,109).

**Facts.** The figures are repeated by UNL, ILTF, Native Governance Center and Wikipedia. D2 and D3 found **no primary source** stating both numbers for exactly 1887 and 1934. Arithmetic in the ILTF figures does not match exactly (60 + 27 is 87, not 90). The same figure carries four different tags across files.

**What is right.** Treat as "widely cited, not primary-sourced" (D3 recommendation). The A1 tag `[verified]` overstates it.

**Do.** Show with the label "widely cited" and the Wilson table as a cross-check (D2). Verification agent pursues Commissioner of Indian Affairs reports and Collier's 1934 testimony. Never show 138 and 48 as a measured loss on a map (G2 forbids totals).

---

## K-12. Black Hills award and fund figures

**Status after the 2026-10-16 correction pass: partly resolved.** V1 read the opinion: $17.1 million (1877 value) plus $450,000 for gold, a Court of Claims award of at least $17.5 million without interest, and 5% interest from 1877, with no total stated. B2 V024 now says the "about $105 million" total is not in the opinion and rests on PBS and Wikipedia. B3 s.3-4 still says $17.5 million as the Supreme Court award and was not rewritten; that wording remains an error for a person to fix.

**Where.** B2 V024 (principal $17.1 million, 1877 value, plus 5% interest, "about $105 million then"); B3 s.3-4 ($17.5 million as the 1877 value, with interest; fund "over $1 billion by 2018, about $1 billion vs about $2 billion `[disputed]`"); D1 and D2 ($17.1 million affirmed; an earlier ICC figure of $17.5 million without interest); F3 and G4 ($17.1 million principal; AP "about $105 million"); B2 sources and G4 (PBS "$1.3 billion" in 2011); B2 gaps ("$1B in 2011 vs about $2B in 2022, journalistic").

**Facts.** Three different "principal" numbers appear for the 1980 holding: $17.1 million (B2, D1, D2, F3, G4, J-files), $17.5 million (B3), and $105 million (interest-inclusive, AP). The fund balance ranges $1 billion to $2 billion in the files. D1 reconciles $17.1 million and $17.5 million as the Court's figure versus an earlier ICC finding without interest; B3 collapses them.

**What is right.** Consistent with D1/D2 and the opinion as read in F3 (Cornell LII) and C1: the Court affirmed the 1877 value with 5% interest from 1877. B3's "$17.5 million" for the Supreme Court award is the likely error. Fund balance: not determinable.

**Do.** Verification agent opens the opinion. In the UI show the principal and the interest rate; avoid a total or label any total as "reported by [source], [year]". The holding itself is solid; the numbers around it are not.

---

## K-13. Counts that do not reconcile across files

- **Seed rows vs graph.** `treaties-seed.csv` has 135 rows; 99 match a NARA RIT row (README-treaties); the graph reports 128 seeded Instrument nodes (277 skeletons + 128 = 405). That is 29 non-NARA seeded instruments (including Fort Laramie 1851, 21 unratified treaties) and 7 seed rows that did not become Instrument nodes (statutes moved to Statute nodes, H1 s.6 item 12/17). The arithmetic is plausible but no file states 135 - 128 = 7 explicitly. Confirm.
- **Statutes.** Seed has 51 rows; graph has 52 Statute nodes (one, `TLA-S-HI1993`, exists only in the treaty seed; `statute_only_in_treaties_seed` warning). C3 says "51-52". J5 P1-02 expects 51 rows.
- **NARA rows.** 376 table rows vs 374 numbered series (A1 s.4.2). Consistent once 19A and 143A are included.
- **Doctrine counts.** C3 doctrine tag counts do not match the CSVs for some tags; the builder recomputes (H1 s.6 item 15; build report `doctrine_count_mismatch`, info).
- **Targets.** C1 notes 104 cases plus 51 statutes slightly exceeds the 150 target. Not an error.
- **Nations.** 226 nodes include 87 present-day `nat-pd-` nodes created from seed names (H2). The earlier 194 figure is superseded (K-05).

**Do.** Link to the build report for numbers; confirm the 135/128/7 split in P1-04.

---

## K-14. NANA typed as a tribal government; Esselen confidence

**Where.** `seed-data/organizations-seed.csv` row `org-nana`: `org_type` "Tribal government", `indigenous_led` "tribal-government", `ein_or_registry` "Sovereign government (no EIN needed)". Its own vetting note says it is a shareholder-owned ANCSA regional corporation, that ANCSA conveyed land to for-profit corporations "not tribal governments", and "Not a donation channel". H1 s.6 item 14 already notes the mismatch and says the owner should correct the seed.

**Related.** J3 check V5 allows an organization with empty EIN if `org_type` is tribal government, so NANA would pass the rule it should not. `org-esselen-tribe` has confidence `high` and `indigenous_led` "yes-verified", but its own notes say the donation page was not opened and federal recognition is `[from-memory: not verified]`. 16 of 67 organizations are not display-eligible (build report); 8 nations have no verified organization.

**Do.** Seed pass (D-51): retype NANA as an ANCSA corporation; change V5 so the tribal-government exemption requires a verified type; downgrade Esselen until the donation page is opened (D-39).

---

## K-15. Land-Grab Universities: license conflict and two repo URLs

**Status after the 2026-10-16 correction pass: partly resolved.** V3 found that both repository URLs resolve to the same repository, that its LICENSE file text is CC0 1.0, that the README and landgrabu.org say ODbL plus CC BY-SA, and that the hcn.org article page states no data license (the ODbL wording was misattributed to the article in E2 and J4). GEO-004, E2 and J4 now say so. Which terms govern is still open (ask landgrabu@hcn.org); the other files (G1-G4) still cite the second URL.

**Where.** E2 s.3; G1 s.8 and s.13; A3; J4 G-06.

**Facts.** HCN's article says the database is ODbL 1.0 with contents CC BY-SA; the repo README says ODbL 1.0 and CC BY-SA 3.0; the repo sidebar links CC0; G1 also notes the article is CC BY-NC-ND 4.0 `[disputed]`. The repository is cited at **two different URLs**: `github.com/HCN-Digital-Projects/landgrabu-data` (E2) and `github.com/HCNData/landgrabu-data` (G1, G2, G3, G4). The article is cited at two URLs too (`hcn.org/articles/indigenous-affairs-education-how-we-investigated-the-land-grant-university-system` and `hcn.org/issues/land-grab-universities/`). A background verification pass was fetching the HCN repository when these documents were written; its result is not incorporated.

**Do.** Read the LICENSE file directly, find the canonical repo URL, ask HCN (gate G-06). Do not ship until resolved; keep it a separate layer.

---

## K-16. Same fact, different confidence tag in different files

**Status after the 2026-10-16 correction pass: partly resolved.** V1 checked every non-verified case and statute row. Thirteen statute rows and two case rows (*Arizona v. California*, *Seneca*) moved from `from-memory` to `verified`, and about 50 inline tags were removed where V1 read the primary source. *Cooley* and *Murphy v. Royal* stay `from-memory`. The exact list is in `verification/CORRECTIONS-APPLIED.md`.

The tags were set by different agents with different access. Examples found:

| Fact | Tagged strongly in | Tagged weakly in |
|---|---|---|
| *Sioux Nation* (1980) holding is a taking requiring compensation | C1, F1, F3, G2 (`[verified]`, Justia/Cornell read) | H5 (from general knowledge, `[from-memory]`) |
| Menominee Termination Act, 68 Stat. 250; Klamath Termination Act, 68 Stat. 718 | B2 (govinfo links listed as primary sources) | C2 (`[from-memory]`) |
| Pub. L. 93-197 (Menominee Restoration), 87 Stat. 770 | B2 (govinfo link) | F1 (`[from-memory]`) |
| *Standing Bear v. Crook*, 25 F. Cas. 695 | C1 (`[verified]` via law.resource.org) | B2 gaps (reporter cite `[from-memory]`); C1 gap 4 (decision date not verified) |
| *Seneca Nation v. Brucker*, 262 F.2d 27 (D.C. Cir. 1958) | B1, B2 (`[P]`, `[verified]`, caption "v. Brucker" from the URL) | C1 and the cases seed ("v. United States, cited in some sources as v. Brucker"; caption and cert. history `[from-memory]`) |
| Gover apology, September 8, 2000 | D1 (`[verified]`, BIA release) | B3 gaps (date and quotation from memory) |
| Fort Wise 12 Stat. 1163 | B2 (govinfo scan listed) | README-treaties gap 2 (`[disputed]`) |
| Treaty Stat. and Kappler cites generally | A2 and seed (`high`/`medium` confidence) | B2 gaps list 13 cites `[from-memory]` |

**What is right.** Do not average. The safest rule: a fact is `[verified]` only if the strongest-access file actually read a primary page for it; otherwise keep the weaker tag until a human or verification agent resolves it. Do not upgrade tags (brief). If B2's govinfo links were opened, C2/F1/B3 tags can be upgraded after a person confirms.

**Do.** Verification wave resolves these specifically (doc 06, P1 and P2 sections).

---

## K-17. Two confidence vocabularies; "verified" has several meanings

H1 s.6 item 3: treaties, violations, organizations, campaigns and eras use `high/medium/low`; cases and statutes use `verified/from-memory/disputed/unverified`. The treaty README defines `high` in terms of verification; the others do not. Inline tags add variants: `[verified-secondary]` (D1-D3), `[verified, tertiary]` (B1, B2, B3), `[verified, secondary]`, `[derived]`, `[calc]`, `[estimate]`, `[site term]`, `[proposal]`, `[observed]` in J-files. In A1, `[verified]` is attached to facts sourced from Wikipedia "pointer" pages.

The graph keeps two fields (`confidence`, `verification_status`) and flags `text_has_*_tag`: 222 nodes carry from-memory text, 43 disputed, 20 unverified. Whether the 99 `verified` case rows are verified for pin cites and quotations: no (C1 explicitly says only name, cite, date and core holding).

**Do.** Show the original tag text on the page, not just a mapped badge. Do not use "verified" for Wikipedia-derived or secondary-only facts. Define the vocabulary on the Methods page.

---

## K-18. Other figures that disagree

| Figure | Values | Files |
|---|---|---|
| ICC dockets and awards | 617 dockets from 370 petitions `[verified]` vs 546 dockets completed with $818,172,606.64 (Wikipedia, EBSCO); "$800M+ vs $818M" | B3, D1 (no primary award table read) |
| Termination | NARA 60 proceedings (1953-1970) vs "more than 100 tribes and bands terminated" | B1, D2 |
| Land Buy-Back acreage | "nearly 3 million" (closing release), 2.3 million (program page), nearly 2.6 million (CRS), 2.9 million (final report via OBJ) | D3 |
| Western Shoshone settlement | $145M vs $160M | B2 gaps |
| Puyallup trust-land acres | about 900 (HistoryLink) vs the act's own parcel list | B2 gaps |
| California treaty claims award | about $29 million at about 47 cents per acre `[from-memory]` vs $17.5 million (1944) and $46 million (1946) | B2 V-record notes |
| Bears Ears scope, 2026 | Differs by news source | B2, B3, C2 |
| Cession totals | about 1 billion to nearly 2 billion acres; no computed total from polygons | D3 |
| Tribal-vs-individual split of 56 million trust acres | Not found | D3 |
| Lac du Flambeau v. Coughlin vote tally | Inconsistent in the Justia summary | C1 |
| Volume II boarding-school treaty count | 127 vs 171, read through a summary tool | D1 |

**Do.** Show ranges with sources (brief principle 7). Verification wave targets the dollar and acreage items (doc 06 P2).

---

## K-19. Treaty detail conflicts

**Status after the 2026-10-16 correction pass: partly resolved.** The ratification-date basis of T-170 and T-189 is now `proclaimed`; T-369 (Fort Laramie 1868) has its Stat. page verified (15 Stat. 635) and the `[disputed]` tag removed; nine Senate-consent dates were filled from the Statutes at Large margins. Kappler pages remain unverified (the OSU site was blocked).

From README-treaties gaps 2 and 3 and A1/A2: Navajo 1849 (Stat. page and NAID), Yakama 1855 (12 Stat. 951), Fort Wise 1861, Fort Laramie 1868 (Stat. page and NAID conflict: A3 reports one NAID conflict) are `[disputed]`. Dancing Rabbit Creek: proclamation 1831-02-24 vs Senate consent 1831-02-25. California treaty B (1851-05-13 vs 1851-05-30) and K (Temecula 1851-09-18 vs 1852-01-05). Senate rejection of the California treaties: 1852-07-08 (Heizer, Mechoopda) vs 1852-07-02 (Prologue). Statutes at Large pages taken from OCR indexes are corrupted for several volumes (A1 gap 7: Point No Point printed as p. 988; correct is 933 per a Wikipedia pointer). RIT 55 (Osage 1808) has no NAID; RIT 336 and 338 have two NAIDs each (H1 s.6 item 2). 26 of 99 seed rows have an unpadded RIT (H1 item 1). The Nez Perce 1868 amendatory treaty is "the last ratified treaty" (A2 T-374) while the Senate's page names 1868 too.

**Do.** Keep the notes visible; verify against govinfo and LOC scans in the verification wave.

---

## K-20. Schema `$id` presumes the repo owner and name

`docs/design/schema/entities.schema.json` and `edges.schema.json` set `$id` to `https://omniharmonic.github.io/treaty-land-atlas/schema/...`. That assumes the GitHub owner is `omniharmonic` and the repo is `treaty-land-atlas`, which are open decisions D-01 and D-02 (J3 s.6). **Do.** Treat `$id` as a placeholder; update when the repo exists.

---

## K-21. Stat. cite cross-check failures and OCR corruption

**Status after the 2026-10-16 correction pass: open for V047.** V1 and V2 disagree on the V047 Stat. start pages (V1 reads 418, 700 and 786 in the *McGirt* opinion; V2 reads 417, 699 and 785 in the Statutes at Large). Neither was applied; see "Not applied" in `verification/CORRECTIONS-APPLIED.md`. V027 and V039 were not touched.

The build report (section 4) lists five Stat. cites printed in violation `treaty_name` fields that no linked instrument carries: V027 (12 Stat. 997), V039 (21 Stat. 199), V047 (7 Stat. 418, 11 Stat. 700, 14 Stat. 786). It also lists 9 cases whose treaty is not in the seeds, 11 related-case strings with no case node (e.g., V015, V030, V035, V037, V049, V053, V054, V056, V057, V061, V062), 3 violations with no instrument (V048, V057, V058), and 8 nations with no verified organization. These are logged for P1-04 and P1-05.

**Do.** Do not "fix" in code (J6). Verification pass decides whether the cite or the link is wrong.

---

## K-22. 2026 events: conflicting or single sources

**Status after the 2026-10-16 correction pass: partly resolved.** Bears Ears scope and acreage are now taken from Proclamations 11043 and 11044 (Federal Register 2026-14548); the litigation claims remain single-source. The Lumbee vehicle is Pub. L. 119-60 (NDAA FY2026, S. 1071), section 8803, and "H.R. 474" is unsupported. The Penobscot "11,000 acres" item is flagged `[unverified]` in B3 and B1 (not in F3). Mi'kmaq, Washoe, Monument Mountain and Tributary wording was tightened to the sources; the Mi'kmaq campaign confidence is now medium.

Bears Ears (July 2026 action, sources conflict; no lawsuit filing found; status of the 2022 cooperative agreement unverified); Oak Flat (Ninth Circuit rehearing denied about late September or early October 2026; Supreme Court action unknown; news reports only); Fort Reno farm-bill draft; DAPL record of decision; Pe' Sla (company withdrawal, May 2026); Penobscot (11,000 acres vs 735 acres in different items), Mi'kmaq, Siletz returns; Lumbee recognition (Tribe and Spectrum News say NDAA signed December 18, 2025; SCOTUSblog names "H.R. 474"; C2 could not reconcile); Washington Post and LA Times items were blocked. Files: B2, B3, C1, C2, F1, F3, D1.

**Do.** Show with "as reported by [source], [date]" and re-check immediately before launch (D-38). Do not present as settled.

---

## K-23. Royce source details

LOC page range 521-997 vs Smithsonian 521-964; date 1899 vs 1902; Library of Congress credit line wording unconfirmed (G-03). A3 s.2.1. **Do.** Cosmetic; check on the item page.

---

## K-24. Housekeeping

- Gate IDs: J4 lists G-13 in the license table and G-12 in the content table; numeric order differs from table order.
- J3 V3 and the builder: the build report has its own `unresolved.json` counts; J3 expects every error-level issue to appear in `data/KNOWN-ISSUES.md`, which does not exist yet.
- J3 s.1 lists `docs/design/ADR-versions.md` as a task output; no such file exists.
- J6 says "Also read docs/design/H1-graph-data-model.md if it exists"; it exists.
- Dates: every file is dated 2026-10-16 but several describe events through October 2026; treat "as of" dates in text, not the header date.
- H3 numbers for graph-lite (1,067 nodes, 2,958 edges) are 1,563 minus 496 Source nodes and 3,543 minus 585 `evidenced_by` edges. Checked, consistent after the 2026-10-16 correction pass.

---

## K-25. Content flagged as "do not publish" or unidentifiable

- F2: "Namaste" and "Pe'pe'ketoh" could not be identified; do not publish (possibly a misspelling of Pe' Sla).
- F2/F4: wsdp.org and indiancanyon.org served unrelated content; Indian Canyon Mutsun Band identity unverifiable; Kai Poma has no donation channel; ILTF page had an injected spam link; LPLP payee changed on December 1, 2024 (now a program of Sacred Defense Fund).
- F3: headline-only campaigns (status `headline-only`, low confidence) are not to be displayed; the 2018 Great Marpole Midden return is Canadian and out of scope.
- G3: content-warning examples (Sand Creek, Bear River, the Long Walk, boarding-school investigation) are from memory and need sourcing when tours are written.
- Sacred or sensitive: Sand Creek and Wounded Knee-type sites, Mankato, Oak Flat, Pe' Sla, Bears Ears, Blue Lake, Hawaii: no site-level coordinates for ceremonial places (B2 consultation flags).

---

## K-26. Checked and found consistent

- **Attribution.** No occurrence of "OpenCivics" or "OpenCivics Labs" in any file except instructions that forbid it (brief, J3, J4, J5, J6, H4). Every document header names Benjamin Life (@omniharmonic).
- **Graph counts.** Build report, H1 and H3 agree (1,563 nodes; 3,543 edges; ratified_treaty 369; 277 skeletons; 128 seeded).
- **Row counts.** J5 P1-02 row counts (treaties 135, NARA 376, cases 104, statutes 51, violations 62, notes 62, organizations 67, campaigns 42, tribe-org-map 86, eras 9, geodata 24) match the CSVs as read.
- **Icon sprite.** 30 symbols = 23 violation + 7 review glyphs (I4).
- **ADR numbers.** PRD and decisions cite ADR-010 (analytics), 011 (budgets), 012 (accessibility), 013 (i18n), 014 (privacy) correctly per J1 s.0.

---

## K-27. Edits made by the synthesis

(Superseded numbers: the K-05 figures were updated again on 2026-10-16 after the correction pass; see the K-05 table.)

On 2026-10-16 the stale numbers in K-05 were corrected in `docs/design/J1-architecture-decision-records.md` (3 places), `J3-repo-ci-and-contribution.md` (V3 row), `J5-build-roadmap.md` (P1-04, 2 places) and `J6-claude-code-kickoff-prompts.md` (Phase 1 prompt, 2 places), each with an italic note under the H1 title. No other file was altered.

## K-28. Verification reports (V1-V3): corrections applied 2026-10-16

Three independent verification passes wrote reports to `verification/` while this document was being finished: `V1-legal-citations-report.md` (142 items), `V2-facts-and-figures-report.md` (203 items), `V3-donations-and-licensing-report.md` (85 items), each with a `*-corrections.csv`. The reports edited no file. On 2026-10-16 a Corrections Agent applied the corrections whose source URL the report gives, to the seed CSVs and to the affected research Markdown; every change is listed in `verification/CORRECTIONS-APPLIED.md`, with the originals in `verification/originals/`. Items that were could-not-verify or single-source were not changed (their tags were flagged, never upgraded), and items where the verifiers conflict were not applied. **None of this has had tribal or legal review.** The reports themselves say that WebFetch returned model-written summaries, that WebSearch quota ran out, and that several sources were blocked (OSU Kappler, congress.gov, npr.org).

Where a report bears on an issue above, what the report said (the status column of the correction pass is in the K-item notes above and in `CORRECTIONS-APPLIED.md`):

| Issue here | What the report says | Report |
|---|---|---|
| K-04 NLD terms | Read the Data Sovereignty Treaty at api-docs.native-land.ca and lists its permitted and prohibited uses, consistent with E1. Also read the NLD FAQ ("All rights reserved" footer; commercial use "No"; "Used with permission for educational and non-commercial purposes") and a Mapbox page saying credit is "not required". Could not fetch a terms page on the main domain. The treaty page gives no permission-request process. | V3 s.3.1 |
| K-03 USFS license | Confirms the Data.gov / metadata conflict as described; found no Research Data Archive record. | V3 s.3.2 |
| K-15 Land-Grab Universities | Says both repo URLs resolve to the same repository; the raw LICENSE file is CC0 1.0 while the README and landgrabu.org say ODbL plus CC BY-SA; the article is CC BY-NC-ND 4.0 with no data license; says J4 and E2 misattribute the ODbL wording to the article. Recommends asking landgrabu@hcn.org which governs. | V3 s.3.3 |
| K-12 Black Hills | Opinion states $17.1 million (1877 value) plus $450,000 for gold, a Court of Claims award of "at least $17.5 million, without interest", and 5% interest from 1877 with no total stated. B2's "about $105 million then" is not in the opinion. | V1 s.2 |
| K-07/K-22 Lumbee | Secondary sources give Pub. L. 119-60 (NDAA FY2026, S. 1071); "H.R. 474" is unsupported. | V1 s.2 |
| K-22 Bears Ears | Primary text now available: Proclamation 11043 (91 FR 45169), signed July 13, 2026, monument modified to about 121,096 acres, about 1,238,904 acres excluded; does not revoke the monument; Grand Staircase is Proclamation 11044. Says "sources conflict" can be closed. | V2 s.1 |
| K-22 Penobscot | The "about 11,000 acres, Sept. 17, 2026" item tagged verified in B1/B3 is not in F3; the Atowi page cited is a 2020 return of 735 acres. | V2 s.1 |
| K-19 Treaty details | Of 61 treaty rows checked, 52 confirmed, 5 corrected, 4 single-source. Ratification-date labels for T-170 and T-189 are proclamation dates, not Senate consent. Kappler pages were not checked (OSU blocked). | V2 s.1, s.2 |
| K-21 Stat. cites | V047 treaty cites off by one page (7 Stat. 417, 11 Stat. 699, 14 Stat. 785 proposed). | V2 s.1 |
| K-16 tag conflicts | All 14 `from-memory` statute rows have correct Stat. start pages (1851 act only as to start page and subject). *Seneca* caption confirmed as v. Brucker. 5 cases and 14 statutes with non-verified tags were all checked. | V1 s.2 |
| K-14 / donations | Hold ILTF donation link (injected gambling link on ILTF pages); remove Seeding Sovereignty URL ("not currently accepting donations"); never link wsdp.org, indiancanyon.org; kaipoma.org is a placeholder (and `build/nodes.json` has a URL node for it); never list "Friends of the Cheyenne River Youth Project" (look-alike). Found Conservation Fund EIN 52-1388917; keeps Rematriation and Shared Spaces "probable". | V3 s.0, s.4 |

New errors the reports found, not previously known to this document (all corrected in the seed on 2026-10-16 except where noted; none reviewed by a person):
- `case-city-of-sherrill-v-oneida-2005`: treaty field names Fort Stanwix (1784); the opinion discusses Fort Schuyler (1788) and Canandaigua (1794) (V1).
- `case-washington-v-us-culverts-2018`: cites a superseded Ninth Circuit opinion (827 F.3d 836); the judgment reviewed was the amended opinion of Mar. 2, 2017 (V1).
- *Dann*: Treaty of Ruby Valley is not in the opinion text (V1). *Carpenter v. Shaw*: petitioners are Choctaw, not Chickasaw (V1). Tribal Law and Order Act and VAWA 2022 Stat. pins (V1).
- V051 Medicine Creek: "$32,500 over 10 years" should be 20 years (V2). V040: Navajo return "May 1868" predates the June 1, 1868 treaty (V2). D3 s.7.1 *Hodel v. Irving* misquoted (V2).
- Mi'kmaq acreage restated as "about 3,400"; Washoe superlative narrowed; Stockbridge-Munsee 351-acre figure dated to 2023 (V3).

**Do.** A human reviewer (legal for citations and licenses, tribal for anything about a nation) must still check the applied changes; start with the priorities in `verification/00-VERIFICATION-SUMMARY.md`. The three `*-corrections.csv` files remain as the audit trail. The three unresolved verifier conflicts (the V047 and McGirt Stat. pages, the V022 acreage, the *Cooley* reporter page) are decided by a person, not by the agent.

---

## Sources

Project files as cited; `build/graph-build-report.md`; `build/unresolved.json` (counts only); `seed-data/organizations-seed.csv` and `violations-seed.csv` read directly.

## Confidence & Gaps

Confidence: medium. Items are reported from the files as written; line references are approximate. Not independently verified: any external fact (NLD pages, Data.gov, USFS metadata, the opinions). The V1-V3 verification reports are summarized in K-28 and are not merged.
