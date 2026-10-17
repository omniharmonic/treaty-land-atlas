---
title: Confidence Ledger
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Confidence Ledger

A prioritized verification worklist built from every `[from-memory]`, `[unverified]`, `[disputed]`, `[estimate]` and "not verified" item in the research, data and seed files. For verification agents and a human reviewer. **Tags changed only where a verification pass opened the named source (2026-10-16).** The V1-V3 correction pass upgraded 13 statute rows and 2 case rows to `verified` and removed about 50 inline tags where a primary source was read; nothing was upgraded on a single secondary source. A tag changes only when a person or agent opens the named source and records what they saw. See `verification/CORRECTIONS-APPLIED.md`.

## How to use this

1. Work top to bottom. Priority = consequence if wrong: license and permission gates, then legal citations, then acreage and dollar figures, then dates and treaty details, then donation URLs and EINs, then 2025-2026 events, then quotations and pin cites, then the rest.
2. For each item: open the primary source named in "Check against", record the result in the seed CSV note or `data/PROVENANCE.md`, and only then change the tag.
3. Three independent verification passes have written reports to `verification/` (see the section "Verification passes" below). Their corrections were applied on 2026-10-16 where a source URL was given (see `verification/CORRECTIONS-APPLIED.md`); nothing has been reviewed by a person. The tables below were written before that pass: where a row below says `from-memory` or `[unverified]` for an item the pass resolved, the resolution is listed in the "Verification passes" section, and the seeds and research files are authoritative.

## Scale of the problem

| Measure | Value | Source |
|---|---|---|
| Graph nodes whose text carries a `[from-memory]` tag | 222 | H1 (build flags `text_has_from_memory_tag`) |
| ... `[disputed]` | 43 | H1 |
| ... `[unverified]` | 20 | H1 |
| Cases: verified / from-memory / unverified | 99 / 4 / 1 | `cases-seed.csv` |
| Statutes: verified / from-memory | 37 / 14 | `statutes-seed.csv` |
| Treaties: high / medium / low | 31 / 84 / 20 | `treaties-seed.csv` |
| Violations: high / medium / low | 28 / 32 / 2 | `violations-seed.csv` |
| Violation notes carrying a from-memory, unverified or disputed tag | 52 of 62 records (29 carry disputed or unverified) | `violations-seed-notes.csv` |
| Organizations: high / medium / low | 15 / 36 / 16 | `organizations-seed.csv` |
| Campaigns: high / medium / low | 14 / 21 / 7 | `campaigns-seed.csv` |
| Graph issues logged by the builder | 106 (69 info, 37 warn) | `build/unresolved.json` |

What "verified" means: the files that say `verified` mean case name, citation, date and core holding were matched to a page (C1). It does **not** cover pin cites, quotations, Statutes at Large pages, tribe identifications or dollar figures.

---

## Verification passes (V1-V3): status and what they report

Reports in `verification/`, each with a corrections CSV. Reported counts are the reports' own. **Corrections were applied on 2026-10-16 (see `verification/CORRECTIONS-APPLIED.md` and `00-VERIFICATION-SUMMARY.md`). None of this has been reviewed by a person, a lawyer or a tribal government.** The agents used WebFetch (model-written summaries of pages), had WebSearch quota exhausted, and were blocked from several sources (OSU Kappler site, congress.gov, supremecourt.gov bound volumes, CourtListener, ProPublica search, some tribal and nonprofit sites). Each report says so.

| Report | Scope | Reported result |
|---|---|---|
| V1 legal citations (`V1-legal-citations-report.md`, `V1-corrections.csv`) | 104 cases, 51 statutes; all 5 non-verified cases, all 14 from-memory statutes, inline-tagged sub-claims in verified rows, a seeded random sample of 30 verified rows | 142 items: 119 confirmed, 10 corrected, 13 could-not-verify, 0 wrong |
| V2 facts and figures (`V2-facts-and-figures-report.md`, `V2-corrections.csv`) | 61 treaty rows (31 high plus 30 sampled), 20 violation entries, 15 D3 statistics, 11 2025-2026 events | 203 items: 139 confirmed, 11 corrected, 6 wrong, 32 single-source, 15 could-not-verify |
| V3 donations and licensing (`V3-donations-and-licensing-report.md`, `V3-corrections.csv`) | 21 donation URLs, 39 EIN checks, 6 red-flag items, 11 campaign figures, 8 licensing statements | 85 items: 60 confirmed, 10 corrected, 9 could-not-verify, 6 red-flag |

Items from this ledger that a report closed or changed, and what the correction pass did with them (RESOLVED = applied to the seed or text; OPEN = not applied):

- **Legal (V1). RESOLVED:** statute Stat. pages (13 rows upgraded), Sherrill, culverts, Dann, Carpenter v. Shaw, TLOA and VAWA 2022 pins, Lumbee Pub. L. 119-60, Seneca caption. **OPEN:** Cooley reporter page, Murphy v. Royal cite, Dawes "Pub. L. 49-105", McGirt Stat. pages, the V022 acreage. Reported by V1: All 14 `from-memory` statute rows reported to have correct Stat. start pages. Non-statute fixes proposed: Sherrill `treaty_at_issue`; culverts Ninth Circuit citation; Dann `treaty_at_issue`; Carpenter v. Shaw petitioners; TLOA and VAWA 2022 pins; Lumbee row gets Pub. L. 119-60 (secondary sources), "H.R. 474" unsupported; Black Hills wording (opinion gives $17.1M, $450,000 for gold, 5% interest, no total). Reporter page numbers for 2018-2023 cases rest on Wikipedia infoboxes (Justia and Cornell show "U.S. ___"); V1 recommends checking bound volumes.
- **Facts (V2). RESOLVED:** Bears Ears (Proclamation 11043/11044), Medicine Creek 20 years, Bosque Redondo return date, Navajo reservation size, Hodel v. Irving figures, T-170 and T-189 labels, nine Senate-consent dates. **OPEN (flagged, not changed):** Penobscot item, Franklin 1830, T-023, T-160, V047 Stat. pages (conflict with V1), Kappler pages. Reported by V2: Bears Ears primary text found (Proclamation 11043); Medicine Creek payment term 10 vs 20 years; V047 Stat. pages; Bosque Redondo return date; Hodel v. Irving figures in D3; Penobscot item not in F3; ratification-date labels on T-170 and T-189; headline D3 numbers (575 entities, 56M and 60M trust acres, 370 ratified and at least 45 unratified, 417 schools and 973 deaths, Cobell $3.4B, Wilson Table VII) reported as checking out. Kappler pages not verified (OSU blocked).
- **Donations and licensing (V3). RESOLVED:** the ILTF and Seeding Sovereignty donation URLs are blank with hold notes; wsdp.org, indiancanyon.org and kaipoma.org carry do-not-link notes and kaipoma.org has no URL node; the Friends of CRYP identifier is not recorded anywhere; Conservation Fund EIN 52-1388917 added; campaign summaries and GEO-001, GEO-004 and GEO-017 license text updated. **OPEN:** every donation page must still be opened in a browser by a person. Reported by V3: Red flags: ILTF pages carry an injected link; Seeding Sovereignty page not accepting donations; wsdp.org, indiancanyon.org, kaipoma.org unusable; Friends of CRYP look-alike (identifier not recorded here). Conservation Fund EIN 52-1388917 found. HCN repo URLs reported to resolve to one repository; its LICENSE file is CC0 while README and landgrabu.org say ODbL plus CC BY-SA. NLD terms and USFS license conflicts confirmed as conflicts, not resolved.
- **Still open after the correction pass** (the reports themselves list them): NLD and USFS written permissions; 13 V1 could-not-verify items; 15 V2 could-not-verify and 32 single-source items; 9 V3 could-not-verify items. A human must open every donation page in a browser before launch (V3).

---

## P0. Gating licenses and permissions

Not facts, but nothing may ship until these are answered in writing. Full text in `04` K-03, K-04, K-15.

| # | Item | Status tag | Check against | Where |
|---|---|---|---|---|
| L-1 | Forest Service cession layer: CC BY 4.0 (Data.gov) vs "None" in metadata | `[disputed]` | Written reply from Forest Service EDW contact (draft: J5 Appendix A) | E2 s.1; A3 s.2.1; J4 G-01 |
| L-2 | NLD: "CC0" label vs Data Sovereignty Treaty vs FAQ credit line; permission needed to store or redistribute | `[disputed]` | Re-read live treaty page directly; written reply from NLD (draft: J2 s.7) | E1; G1; G3 gap 4; J4 G-02 |
| L-3 | Land-Grab Universities data: ODbL / CC BY-SA 3.0 / CC0 sidebar / article CC BY-NC-ND 4.0; two repo URLs | `[disputed]` | LICENSE file in the repo; HCN written reply | E2; G1; J4 G-06 |
| L-4 | Invasion of America: no license found; Richmond link unconfirmed | `[unverified]` | eHistory / Saunt reply; link-out only meanwhile | A3; E2; G1 |
| L-5 | IDA Treaties Explorer: no license stated | `[unverified]` | Ask MIAC (G1 gap 10) | G1 |
| L-6 | OSU Tribal Treaties Database: license and disclaimer terms not captured | `[unverified]` | Open OSU disclaimer page | A3 gap 5 |
| L-7 | LOC Royce credit-line wording | `[unverified]` | LOC item page (J4 G-03) | A3; J4 |
| L-8 | Font licenses (Charis SIL, Atkinson Hyperlegible Next, Noto) | `[from-memory]` | Each font's license file | I4; J1 ADR-013 |
| L-9 | Basemap, tile and host terms (OpenFreeMap, OSM policy, Pages, Cloudflare) read once on 2026-10-16 | observed | Re-read before launch | E3; J1 |

---

## P1. Legal citations

### 1A. Cases

| Item | Tag | Issue | Check against | Where |
|---|---|---|---|---|
| `case-seneca-nation-kinzua-1958` | `from-memory` (seed) | Caption "v. Brucker" vs "v. United States"; cert. history from memory. B1/B2 call it `[P]`/`[verified]` from a law.resource.org page; C1 and seed disagree | Open law.resource.org page; check caption in F.2d | C1; B1; B2; `04` K-16 |
| `case-arizona-v-california-1963` (373 U.S. 546) | `from-memory` | Whole row | Justia/LOC U.S. Reports | C1 |
| `case-murphy-v-royal-2017` (875 F.3d 896, 10th Cir.) | `from-memory` | Whole row; Ninth Circuit cite for related matters also not verified | Court listener/Justia | C1 |
| `case-us-v-cooley-2021` (593 U.S. 345) | `from-memory` | Justia fetch failed | Justia / supremecourt.gov | C1 |
| `case-oak-flat-9th-circuit-2026` | `unverified` | Caption and F.4th cite not located; only news (KJZZ); no opinion read | Ninth Circuit docket | C1; C3 gap 2 |
| *Sioux Nation* (448 U.S. 371) | verified in C1/F1/G2/F3; `from-memory` in H5 | Tag conflict only; Justia and Cornell pages were read | Re-check H5 text against C1 | H5; `04` K-16 |
| U.S. Reports page cites for recent cases: McGirt 591 U.S. 894; Castro-Huerta 597 U.S. 629; Brackeen 599 U.S. 255; Arizona v. Navajo 599 U.S. 555; Coughlin 599 U.S. 382; Herrera 587 U.S. 329; Cougar Den 586 U.S. 347; Cooley 593 U.S. 345; Chehalis 594 U.S. 338; Ysleta 596 U.S. 685 | "believed correct, not confirmed" | Justia shows "U.S. ___" | supremecourt.gov slip/bound volumes | C1 gap 2; D2 gap 3 |
| Cases cited from memory in B2 | `from-memory` | *Lac Courte Oreilles v. Voigt* (7th Cir. 1983); *Standing Bear v. Crook* reporter cite; *South Carolina v. Catawba* (1986); *Kimball v. Callahan*; *Puyallup Tribe v. Dept. of Game* (1968); *Indians of California v. United States* (Ct. Cl. 1942); *Ward v. Race Horse*; *Alaska v. Venetie*; *Apache Stronghold* en banc | Court records | B2 gaps |
| Not verified in C1 | `from-memory` | Ninth Circuit cites for *Washington v. United States* (827 F.3d 836) and *Murphy v. Royal*; *Littlefield v. Dept. of Interior*; Boldt decision date; Standing Bear decision date; *Kimball v. Callahan* 493 F.2d 564; *United States v. Dion* 476 U.S. 734; *Rice v. Cayetano* | Reporters | C1 gap 4; C3 gap 1 |
| Not verified in C3 | `from-memory` | *United States v. Mitchell* 445 U.S. 535 and 463 U.S. 206; *Dion*; Winters and Worcester quotations and pins; RFRA Pub. L. 103-141; Vatican March 2023 statement; *Sherrill* discovery footnote; *Arizona v. California* PIA standard | Primary sources | C3 gap 1 |
| Not opened in G2 | not opened | *Lone Wolf*, *Nebraska v. Parker*, *Oneida II*, *Cayuga v. Pataki*, *Hagen*, *Castro-Huerta* (B2 later listed Justia links for most) | Opinions | G2 gap 2 |
| *Lac du Flambeau v. Coughlin* vote tally | inconsistent in Justia summary | Count | Opinion | C1 gap 3 |
| *Cherokee Nation v. Georgia* and *Dion* | not retrieved by D2 | Cherokee was later read by B1/B2 (Justia link) | Confirm | D2 gap 3 |
| D4 from-memory entries: *Venetie*, *Solem*, *Hagen*, *Sandoval*, Pueblo Lands Act, Major Crimes Act section number, restricted-fee examples, 25 CFR 151.2 definitions | `from-memory` | Glossary precision | Cornell LII, eCFR | D4 gap 2 |
| 18 U.S.C. 1151 wording quoted in D4 | summarized | Read via a summarizing tool that paraphrased | Cornell LII text | D4 gap 1 |
| Not reached at all | n/a | *Pyramid Lake Paiute*, *Adair*, *Nevada v. United States*, *Colville v. Walton*, Alaska cases (*Metlakatla*, *Alaska v. Babbitt*), *Hooper v. City of Tulsa*, DAPL D.C. Cir. 2021, Bears Ears litigation, most ICC decisions | Add or scope out | C1 gap 5 |

### 1B. Statutes and Statutes at Large (the 14 `from-memory` seed rows)

Check each against govinfo.gov or the Library of Congress scan.

| Seed ID | Cite as seeded | Note |
|---|---|---|
| `stat-northwest-ordinance-1787` | 1 Stat. 50 (Aug. 7, 1789) | all `[from-memory]` |
| `stat-trade-intercourse-acts-1790-1802` | 1 Stat. 137, 329, 469, 743; 2 Stat. 139 | all cites from memory (C2 gap 1) |
| `stat-civilization-fund-act-1819` | 3 Stat. 516 | |
| `stat-indian-appropriations-act-1851` | 9 Stat. 574 | |
| `stat-burke-act-1906` | 34 Stat. 182 | row-level from-memory, no inline tag |
| `stat-flood-control-act-1944-pick-sloan` | 58 Stat. 887 | B2 lists a govinfo link as primary; tag conflict (`04` K-16) |
| `stat-house-concurrent-resolution-108-1953` | 67 Stat. B132 | B2 lists a govinfo link; conflict |
| `stat-menominee-termination-act-1954` | 68 Stat. 250, Pub. L. 83-399; effective 1961 | B2 lists a govinfo link; conflict |
| `stat-national-historic-preservation-act-1966` | Pub. L. 89-665, 80 Stat. 915; 54 U.S.C. 300101 | all from memory |
| `stat-menominee-restoration-act-1973` | Pub. L. 93-197, 87 Stat. 770 | B2 lists a govinfo link; F1 says from memory |
| `stat-rhode-island-settlement-act-1978` | Pub. L. 95-395, 92 Stat. 813 | all from memory |
| `stat-indian-land-consolidation-act-1983` | Pub. L. 97-459, 96 Stat. 2517 | |
| `stat-catawba-settlement-act-1993` | Pub. L. 103-116, 107 Stat. 1118 | |
| `stat-american-indian-probate-reform-act-2004` | Pub. L. 108-374, 118 Stat. 1773 | |

Also check:
- Klamath Termination Act, 68 Stat. 718: `[from-memory]` in C2, `[P]` in B2 (conflict).
- Other statute items C2 and D2 flag: Curtis Act, Burke Act, Dead Indian Act, Citizenship Act, 1834 Trade and Intercourse Act, ILCA, AIPRA, NAGPRA Stat. cite, IGRA (D2 gap 2); Act of Mar. 3, 1871 (16 Stat. 566; 25 U.S.C. 71) and former 25 U.S.C. 465 now 5108 (G2 gap 1); Board of Indian Commissioners 16 Stat. 40 not opened (D1 gap 2).
- Statute boxes taken from Wikipedia may contain errors (C2 overall note).
- Statutes not yet in the dataset: Indian Mineral Leasing Act (1938), Indian Long-Term Leasing Act (1955), Indian Mineral Development Act (1982), Tribal Forest Protection Act (2004), Native American Languages Act (1990), IHCIA, Savanna's Act and Not Invisible Act (2020), Self-Governance Act amendments (1994), many settlement acts (C2 gap 6).
- Graph has 52 Statute nodes vs 51 statute rows (`TLA-S-HI1993` from the treaty seed only). Resolve whether a statute row is needed.
- 2025-2026: Alaska M-37087 confirmed only through a law-firm article; Lumbee recognition vehicle (see P5).

### 1C. Treaty citations (Statutes at Large and Kappler pages)

- Stat. cites flagged `[from-memory]` in B2: 7 Stat. 84 (St. Louis 1804); 7 Stat. 15 (Stanwix); 7 Stat. 39 (Holston); 7 Stat. 550 (Buffalo Creek 1838); 10 Stat. 949 and 954 (Dakota 1851); 10 Stat. 979 (Santa Fe 1852); 10 Stat. 1064 (Wolf River); 12 Stat. 951 (Yakama); 15 Stat. 505 and 649 (Sisseton-Wahpeton 1867; Crow 1868); 18 Stat. 36 (Brunot; GovInfo fetch failed); 14 Stat. 755 (Seminole 1866); 28 Stat. 222 (Blackfeet 1895). Check against govinfo.
- Yakama 12 Stat. 951: seed confidence medium, B2 `[from-memory]`, README-treaties `[disputed]` (`04` K-16).
- Page numbers for most medium and low treaty rows are not verified (A2). OCR-index pages are known to be corrupted in volumes 11-12 (A1 gap 7: Point No Point printed as 988, correct 933 per Wikipedia pointer). Rows marked `OCR` in `treaties-seed.csv` need scan checks.
- Disputed treaty rows: seed notes carry `[disputed]` on TLA-T-043, 160, 255, 290, 315, 369 and all 18 unratified California treaties TLA-U-CA-A to R.
- Low-confidence treaty rows (20): TLA-T-027, 255, 286, 291, 293, 305, 307, 315, 324, 325, 332, 352, 355, 356, 358; TLA-U-PIKE1805; TLA-U-FRANKLIN1830; TLA-A-1874; TLA-X-HOPI1882; TLA-S-MAINE1980.
- Specific conflicts: Navajo 1849 Stat. page and NAID; Fort Wise 12 Stat. 1163; Fort Laramie 1868 Stat. page and NAID; Dancing Rabbit Creek 02-24 vs 02-25; California B 1851-05-13 vs 05-30; K 1851-09-18 vs 1852-01-05; rejection 1852-07-08 vs 07-02; Canandaigua ratification (OSU footnote). See `04` K-19.
- Fort Laramie 1851 (TLA-T-FL1851): not in the NARA table as extracted; confirm numbering (A1 gap 3).

---

## P2. Acreage, dollar and count figures

| # | Figure | Values / issue | Tag | Check against | Where |
|---|---|---|---|---|---|
| F-1 | Treaty counts (368/369/370/374/375/376/377/389/418) | No canonical count | disputed | NARA table; UNL breakdown | A1 s.4; `04` K-01 |
| F-2 | Unratified treaties | BIA at least 45; seed 21 | unverified | Senate/BIA/Heizer | A1 gap 1 |
| F-3 | Post-1871 agreements | no count; seed 3 | unverified | OSU/Kappler vol. 1 | A1 gap 2 |
| F-4 | Royce polygon count | 718 vs 752; 1,172 attribute rows | disputed | Download and count (P1-08) | `04` K-02 |
| F-5 | Allotment 138M to 48M acres | no primary source | disputed / verified-secondary | Commissioner of Indian Affairs reports; Collier 1934 testimony; Wilson Table VII | D2 gap 1; B1; D3; `04` K-11 |
| F-6 | Black Hills: $17.1M vs $17.5M principal; interest; $105M; $1.3B; fund $1B vs $2B | conflicting | disputed | Opinion text; Treasury/BIA | B2 V024; B3; D1; `04` K-12 |
| F-7 | ICC: 617 vs 546 dockets; $818M vs $800M+; 370 petitions | no primary award table read | disputed | ICC Final Report (NARF copy) | B3; D1 gap 3 |
| F-8 | Termination: 60 proceedings vs 100+ tribes and bands | | disputed | NARA; Wilkinson | B1; D2 gap 4 |
| F-9 | Land Buy-Back acreage: 3.0 / 2.3 / 2.6 / 2.9 million | final report not opened | disputed | DOI final report | D3 gap 5 |
| F-10 | Tribal-vs-individual split of 56 million trust acres; fee land; restricted fee | not found | unverified | BIA Real Estate Services; GAO | D3 gap 1 |
| F-11 | Total cession acreage (1B to nearly 2B) | no computed total | unverified | Compute from polygons with method | D3 gap 2 |
| F-12 | "Over a million acres into trust since 1934" | quoted, may be narrow | unverified | BIA reports | D3 gap 4 |
| F-13 | Percent of US land | author arithmetic, denominator unverified | estimate | USGS/PAD-US | D3 gap 9 |
| F-14 | State-recognized counts; Alaska 229 entries | Wikipedia only | unverified | NCSL; Federal Register list | D3 gaps 6-7 |
| F-15 | Western Shoshone settlement $145M vs $160M; Western Shoshone ICC amounts | | disputed | ICC/Treasury | B2 gaps; B3 |
| F-16 | California treaty-claims awards (about $29M at about 47 cents/acre; $17.5M 1944; $46M 1946) | from memory / other claim | from-memory | Ct. Cl. / ICC | B2; B3 |
| F-17 | Puyallup trust acres (about 900 vs act's parcel list); settlement value | | disputed | Pub. L. 101-41 | B2; B3 |
| F-18 | Kinzua 1964 compensation | | unverified | Primary compensation record (not identified in the files) | B2 gaps |
| F-19 | Fort Wayne 1809 and St. Louis 1804 acreage; Oneida historic acreage; A2 acreages (Fort Jackson, Black Hawk Purchase, Chicago 1833, Washington 1836) | single source or memory | from-memory | Royce / treaty text | B2 gaps; A2 |
| F-20 | ANCSA acreage (45M) and dollar totals; IRA acres restored; Klamath acreage; Maine settlement amounts; Dawes Act acreage | secondary | disputed / secondary | CRS R46997; agency reports | C2 gap 2; B3 |
| F-21 | Death-toll ranges (Trail of Tears, Sand Creek, Bosque Redondo, Choctaw removal) | secondary ranges | secondary | Scholarly sources | B2 gaps |
| F-22 | Boarding schools: Volume II treaty count 127 vs 171; school and burial counts | read via summary tool | unverified | Open the PDF | D1 gap 6 |
| F-23 | Land-Grab Universities: about 79,461 vs 79,000 Morrill parcels; 162 cession polygons | | unverified | HCN data | E2; E3 |
| F-24 | NLD treaties layer about 830 entries | only 24 seen | unverified | NLD docs | E1 |
| F-25 | File size estimates (Royce 1-10 MB etc.) | extrapolated | estimate | Measure | E3 gap |
| F-26 | Positional accuracy of Royce polygons | none stated | unverified | USFS; scholarly literature | A3 gap 11; G2 |
| F-27 | Bears Ears 2026 scope, Yurok phase dates, Bison Range trust date, Washoe Nov. 2025 approval, Penobscot 735 vs 11,000 acres | tool-summarized or conflicting | disputed / unverified | Primary releases | B2; F3; `04` K-18 |

---

## P3. Dates and treaty details

- Gover apology date (Sept. 8, 2000) and wording: D1 `[verified]` (BIA release) vs B3 `[from-memory]`. Check the BIA original (D1 gap 7).
- 2009 apology disclaimer text and Biden boarding school apology location and wording (B3 gap).
- Senate archives "Delaware 1788" (probably 1778) (A1 gap 5).
- Royce date 1899 vs 1902; page range 521-997 vs 521-964 (A3 gap 10).
- `cessdate1-5` semantics (signed, ratified, proclaimed) unconfirmed (E2).
- Invasion of America launch date 2014 vs 2015 (A3, G1).
- Pe' Sla purchase year not stated (G3, G4).
- NLD API key requirement start date, conflicting (E1).
- Boldt decision date; Standing Bear decision date (C1 gap 4).
- Menominee termination effective date 1961 (seed note `[date from-memory]`).
- Constitution clause text, Northwest Ordinance, 1855 start of executive-order reservations, 1871 House-Senate dispute: not checked (A1 gap 9); last-in-time rule and fraud-doctrine statements from memory (B1).
- Violation notes with `[from-memory]` or `[disputed]` tags: V006, V017, V021, V024, V025, V027, V028, V029, V035, V038, V040, V042, V045, V046, V048, V051, V054, V055, V056, V058, V060, V062. Tags `[unverified]` also on V001, V002, V003, V009, V011, V018, V019. See `violations-seed-notes.csv`.
- Graph checks in `build/graph-build-report.md` section 4: 5 Stat. cites in violation `treaty_name` fields not matching any linked instrument (V027, V039, V047); 3 violations with no instrument (V048, V057, V058); 11 related-case strings with no case node.
- Statutes at Large: Menominee/Klamath page numbers, Restoration Act, Catawba, Rhode Island, ILCA 1983, AIPRA, Pick-Sloan (C2 gap 1).
- Movement history: South Africa hashtag lineage and NDN Collective launch date each rest on one article (F1); Alaska 700,000-acre claim unexplained (F1).
- Hawaii: Kamehameha Schools, ceded lands, Mauna Kea from memory (F1).

---

## P4. Donation URLs, EINs and organization facts

Consequence: a wrong link or EIN could send a donor's money to the wrong place. **No organization listing should display until each item below is checked.** The site collects no money (F4).

| Item | Issue | Check against | Where |
|---|---|---|---|
| All EINs (67 org rows) | IRS TEOS never queried; no revocation check; no Candid/GuideStar seals; no state registrations | IRS TEOS; state charity registries | F2; F4 |
| `org-esselen-tribe` | marked high / `yes-verified`, but the donation page (esselentribe.org/donate) was not opened; EIN 82-5246660 stated on the tribe site and ProPublica; recognition `[from-memory]` | Open the page; Federal Register list | organizations-seed; K-14 |
| `org-nana` | typed tribal government but is an ANCSA corporation; "not a donation channel" | Reclassify | `04` K-14 |
| `org-native-american-land-conservancy` (EIN 33-0832220), `org-cultural-conservancy` (94-3003900), `org-seeding-sovereignty` (fiscal sponsor 45-4968344), `org-apache-stronghold` (47-4032813), `org-dine-care` (86-0670809) | low confidence; ProPublica listing only; sites unreadable (cryp.org, cultural-conservancy.org, nativeamericanlandconservancy.org) | Human opens each site | organizations-seed; F2 |
| `org-shared-spaces-foundation` | "Probable EIN 86-1742244" (inferred) | IRS TEOS | organizations-seed |
| Rematriation | EIN inferred; leadership claims unverified | | F2 |
| `org-wsdp` | EIN none found; wsdp.org served unrelated content; Anthropocene Alliance listing is the only source; do not publish a donate link | WHOIS/DNS; browser check | F2; F4 |
| `org-indian-canyon` | no EIN; site returned unrelated content; identity unverifiable | | F2; F4 |
| `org-conservation-fund`, `org-first-light-maine`, `org-wabanaki-commission` | no EIN found or not verified | | organizations-seed |
| `org-ien` | Tax ID stated on IEN site, ProPublica listing differs in detail | | organizations-seed |
| ILTF home page | injected spam link seen in F4 fetch; recheck whether site is compromised | Human browser | F4 |
| Kai Poma | no donation channel found | | F4 |
| LPLP payee | changed Dec. 1, 2024 (program of Sacred Defense Fund) | Re-check | F4 |
| Tribal-government rows without EIN: `org-rosebud-sioux-tribe`, `org-spirit-lake-nation`, `org-pamunkey`, `org-santa-ynez-chumash`, `org-pawnee-nation`, `org-mashpee-wampanoag` | "Sovereign government (no EIN needed)"; status per Federal Register list; Mashpee trust status contested | Federal Register; each nation | organizations-seed; F2 |
| "Indigenous-led" claims | not verified from governance pages for Native American Land Conservancy, The Cultural Conservancy, FNDI, IEN, Save California Salmon, Seeding Sovereignty, Rematriation, Six Nations Iroquois Cultural Center, Hawaii nonprofits | Governance pages | F2 |
| Charity Navigator ratings | SDF and Save California Salmon ratings not displayed; profiles read for 14 EINs | | F2 |
| Tax statements (26 U.S.C. 7871; deductibility of gifts to tribal governments; fiscal-sponsor fees) | `[from-memory]` | Legal review | F4 |
| "Most tribal governments do not run public donation programs" | `[unverified generalization]` | Nation by nation | F4 |
| Consent | none sought from any named nation or organization | | F2; F4; brief principle 4 |
| Organizations never researched | Tulalip, Muckleshoot, Karuk, Coastal Band of the Chumash, Navajo/Diné and Pueblo groups, Pawnee Seed Preservation Project, Oglala initiatives; "Namaste" and "Pe'pe'ketoh" unidentifiable (do not publish) | | F2; `04` K-25 |
| 16 of 67 organizations not display-eligible; 8 nations with no verified organization | build report | | `build/graph-build-report.md` |

Campaigns (`campaigns-seed.csv`, 42 rows): seven low-confidence rows must not display: `camp-pamunkey-13-acres-2026`, `camp-miccosukee-2026`, `camp-ute-utah-trust-lands-2026`, `camp-ca-7pct-pledge-2026` (status headline-only); `camp-puyallup-1989`, `camp-santa-ynez-camp4`, `camp-spirit-lake-white-horse-hill` (completed, low confidence). Oak Flat, Mashpee, Alaska Native Village Municipal Lands Restoration Act and the Mohican beyond Monument Mountain were not researched (F3).

---

## P5. 2025-2026 current events

Single-source or conflicting; re-check immediately before launch and show "as reported by [source], [date]".

| Item | Issue | Where |
|---|---|---|
| Bears Ears (July 2026 action, scope, acreage; fate of 2022 cooperative agreement and Commission; lawsuit filed or only announced; Sept. 2, 2026 Courthouse News item on a reopened suit) | sources conflict; no filing read | B2 V062; B3; C2 gap 5; C1 gap 6 |
| Oak Flat (Resolution Copper transfer Mar. 2026; Ninth Circuit; en banc denial late Sept./early Oct. 2026; Supreme Court action unknown) | news only; no opinion read | B2 V049; C1; C3 gap 2 |
| Fort Reno farm-bill draft (Mar. 20, 2026) | single source (NonDoc) | B2 V023 |
| DAPL record of decision | single source | B2 V030 |
| Pe' Sla mining company pulls out (May 2026); SD tribes' joint resolution (June 10, 2026) | single sources | B2 V024; B3 |
| Penobscot (11,000 acres vs 735 acres), Mi'kmaq, Siletz, Wabanaki 50,000-acre restoration | single sources; 735 vs 11,000 may be different transactions | B2 V055, V058; F3; `04` K-18 |
| Yurok Blue Creek (47,097 acres; final phase May 30, 2025) | one news source plus Grist | F1; F3 |
| Washoe 10,274 acres (Nov. 2025), Tule River 17,000 acres (Oct. 2025), Mechoopda 450 acres, Stockbridge-Munsee 372 acres, Adirondacks 600 acres | single sources | F3 |
| Blues Beach (Mendocino) transfer: ActiveNorCal plus an opinion piece (Legal Insurrection, labeled opinion) | | F3 |
| Lumbee recognition: NDAA signed Dec. 18, 2025 (Tribe, Spectrum News) vs "H.R. 474" (SCOTUSblog); public law number, fiscal year, section | `[unverified]` | C2 gap 4 |
| Alaska M-37087 fee-to-trust policy | law-firm article only | C2; D1 |
| 2026 recognition count (Federal Register Jan. 30, 2026) | solid per D1; Alaska 229 entries from Wikipedia | D1; D3 |
| Boarding school web-page status; FY2026 and FY2027 BIA budget impacts; 2025 executive orders on tribal consultation or land; 25 CFR part 83 revisions; Interior policy changes after Jan. 2025 | not searched | C2 gap 3; D1 gap 8; D3 gap 8 |
| Mashpee trust status in 2026 | not verified | F2 |
| Supreme Court OT2024 and OT2025: no merits cases per NARF | | C3 |
| Pamunkey 13 acres, Miccosukee, Ute Utah trust lands, California 7% pledge (2026) | headline only; do not display | campaigns-seed |

---

## P6. Quotations, pin cites and interpretive claims

- Short quotations from memory: Marshall "domestic dependent nations"; *Kagama* "weakness and helplessness"; Winters and Worcester quotations (C1 gap 1; C3). Quotations marked `[verified]` are limited to *Jones v. Meehan*, *Carpenter v. Shaw* and 25 U.S.C. 71/177 text.
- Gover and Biden quotations: attribute, check wording (D1).
- New Echota Senate tally (B1).
- Shear et al. percentages: not available; do not quote numbers (G4).
- Academic literature on uncertainty visualization: `[from-memory]` placeholders (G2). Pedagogy literature (Vizenor, Dunbar-Ortiz, Reese, C3 Framework, Learning for Justice) `[from-memory]` (G4). Doctrine critique (Williams, Frickey, Deloria and Lytle) `[from-memory titles; not verified]` (C3).
- Tour beats flagged `[from-memory]` or "to research": Worcester details, Hopewell 1785, Trail of Tears, Klamath history and dam removal, Boldt, ICC-Taos refusal, California unratified treaties (G4). Content-warning examples (G3).
- Younging usage rules partly `[from-memory]` (G3). "7,000 miles" unit ambiguous (G4).
- "Treaty-recognized" is a site term; legal team decides (D4).
- Interpretive judgments (layer labels, effect labels, edge types) in C3 are the agent's own, not source claims.
- G2 design proposals (uncertainty tiers, evidence flags, S1-S9) are recommendations, not reviewed by a lawyer or tribal body.

---

## P7. Everything else

**Data and method**
- CORS, response schema and rate limits of the NLD API untested; deep-link parameters for Tier 0 `[from-memory]`; tech@native-land.ca untested (E1).
- Whether NLD "Cession NNN" equal Royce numbers (unverified inference) (E1).
- Overlap and duplicate coverage in Royce polygons untested (E2, E3).
- GitHub Pages range-request support and per-file limits from a third-party tutorial (E3).
- tippecanoe, Leaflet/deck.gl licenses and versions, Mapbox terms from memory (E3). Basemap sizes, object-storage pricing unresearched.
- Package versions "observed 2026-10-16" (J1).
- Tribal GIS portals not identified (E2). Smithsonian BAE and NAA not searched (E2). ICC maps and data, allotment-era and termination spatial data not located (E2).
- BLM GLO not researched in depth; BIA LAR metadata, Census AIANNH guidance not retrieved (A3).
- The 1978 ICC/USGS map has no vector dataset found (G2).
- Land-status percentages (public vs private) need a dataset (G2).

**Seed and graph**
- 20 documented seed mismatches (H1 s.6). Nation node creation from seed names (87 `nat-pd-`) is a product decision (H2).
- 106 builder issues (69 info, 37 warn): see `build/unresolved.json`.
- 29 orphan nodes; 0 accepted edges of 3,543; 2,345 proposed edges need human review (H1).
- Successor and alias crosswalks need tribal review (`crosswalks/`).

**Tribal voice and review (required before publication)**
- Every nation name, endonym, summary and framing. Terms like "unrecognized title", "extinguished" and "ceded" are U.S. legal categories (B1). Sacred sites: no site-level coordinates (B2). Consultation flags: Sand Creek, Wounded Knee-type sites, Mankato, Oak Flat, Pe' Sla, Bears Ears, Blue Lake, Hawaii.
- No tribal government's primary account was fetched except Taos Pueblo and Seneca Nation (B2). No tour has input from any nation (G4). Tribal-government interactive maps not verified (G1).
- Legal review of the "no evictions" statement and removal-right policy (G3) has not occurred.

**Not covered / known omissions** (scope decisions, not errors)
- Railroad land grants (only Delaware 1866), Yellowstone and other parks, Cayuga, Shinnecock, Mashpee, Osage mineral estate, Pit River, Winnebago/Ho-Chunk, Mexican-era Pueblo grants, Guadalupe Hidalgo as applied to Southwestern peoples (B2).
- Non-federally-recognized nations' claims (B1, B3). Canadian and international comparisons (B1, C1, C3). State-level returns and apologies other than Colorado (B3). ICC awards by tribe (B3: "the largest gap"). Pick-Sloan return-of-surplus-lands acts, reburial and NAGPRA as a remedy (B3).
- Prior-art gaps: "Treaties Still Matter" title; Decolonial Atlas license and consent; USDAC guide contents; "Return the Land" project; scholarly critiques of Royce (G1).

---

## Suggested order of work for verification agents

1. L-1 to L-4 (people send the messages; nothing to verify online).
2. Section 1A and 1B: the 5 non-verified case rows and 14 statute rows, then the B2 `[from-memory]` Stat. cite list (1C).
3. F-1 through F-9 (counts and dollars that appear on public pages).
4. Resolve the tag conflicts listed in `04` K-16 by opening the strongest source.
5. P4 for every organization planned for the first launch set; drop the rest.
6. P5 immediately before launch, not before.
7. P6 when tours and plain-language pages are written.

## Sources

Built from the Confidence & Gaps sections of A1-A3, B1-B3, C1-C3, D1-D4, E1-E3, F1-F4, G1-G4; the `[from-memory]`, `[unverified]` and `[disputed]` tags in seed CSV cells; `seed-data/README-*.md`; H1 s.6-7; `build/graph-build-report.md`; `build/unresolved.json`. Seed row IDs were read from the CSVs on 2026-10-16.

## Confidence & Gaps

Confidence: medium. The list reproduces what the files say is unverified; it does not claim to be exhaustive. Inline tags inside long text cells (treaty notes, violation notes) were counted programmatically for violation notes and listed by ID; treaty and campaign inline tags were checked only for `[disputed]` and confidence level. Inline tags in design files (H-series, I-series, J-series) were not individually enumerated beyond the items cited. The V1-V3 verification reports are summarized above and are not merged into the tables; no tag was upgraded on their basis.
