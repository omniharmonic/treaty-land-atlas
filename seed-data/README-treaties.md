---
title: README for the Treaty Seed Data (treaties-seed.csv and NARA index)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# README: treaty seed data

Research Agent A, Treaty Land Atlas. This README describes two files in this folder:

| File | Rows | What it is |
|---|---|---|
| `treaties-seed.csv` | 135 | Representative instruments across regions and eras: 109 ratified, 21 unratified (the 18 California treaties and three others), 3 partial, 2 not applicable. Includes labeled context rows (international treaties, statutes, agreements, an executive order). |
| `nara-ratified-treaties-index.csv` | 376 | The full National Archives (NARA) "Ratified Indian Treaties" table: RIT number, date, NARA title, NAID, IDA URL. This is the key spine for expanding the seed to every ratified treaty. |

Narrative and sources: `docs/research/A1-treaty-framework-and-counts.md` (framework and counts), `A2-treaty-eras-and-clusters.md` (clusters), and `A3-geospatial-and-treaty-datasets.md` (datasets). The data is a draft for verification, not a finished legal reference.

## treaties-seed.csv: fields

The first 14 columns are the schema requested in the task. Columns 15-21 are additions that record provenance and make verification possible.

| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | string | Stable atlas ID (see ID schemes). |
| 2 | `name` | string | Commonly used name, with year. Period names are used where the treaty has no common name. |
| 3 | `date_signed` | ISO date | `YYYY-MM-DD`, or `YYYY-MM` / `YYYY` when only the month or year is known. |
| 4 | `date_ratified` | ISO date | The ratification event named in `date_ratified_basis` (Senate consent, ratification, or proclamation). Blank when not confirmed. |
| 5 | `ratified` | enum | `yes`, `no`, `partial` (Senate amended it, or part of it was not ratified), or `n/a` (not a treaty, or pre-US). |
| 6 | `nations` | string | Nations as named in NARA or Kappler (period spellings). These are not endonyms and not present-day names. |
| 7 | `region` | string | Atlas region: Southeast, Great Lakes / Old Northwest, Plains, Pacific Northwest, Northeast, Southwest, Great Basin, California, Alaska, Hawaii, Multi-region. |
| 8 | `land_description` | string | Short summary of the land or provisions. Not a legal description. |
| 9 | `acreage_ceded_if_known` | integer | Acres as stated by a source. Blank when none was confirmed. Retained or reserved acreage is never entered here. |
| 10 | `stat_cite` | string | *United States Statutes at Large* citation (volume, "Stat.", page). `none` for unratified instruments. |
| 11 | `kappler_cite` | string | Kappler, *Indian Affairs: Laws and Treaties*, volume and page. |
| 12 | `era` | string | One of the eight era labels (see Eras). |
| 13 | `source_url` | URL | One URL per row: a page I consulted for it (digitreaties.org record, OSU Tribal Treaties Database, Wikipedia pointer, Heizer 1972, etc.). Other sources are named in the basis columns and notes. |
| 14 | `confidence` | enum | `high`, `medium`, `low` (see Confidence). |
| 15 | `instrument_type` | string | `treaty`, `treaty (unratified)`, `treaty (international)`, `agreement (statutory)`, `statute`, `executive order`. |
| 16 | `date_signed_basis` | string | Where the signing date came from. |
| 17 | `date_ratified_basis` | string | Which ratification event the date refers to, and where it came from. |
| 18 | `land_desc_basis` | string | Source of the land description. |
| 19 | `nara_rit_no` | string | NARA Ratified Indian Treaty number (RIT). Blank for non-NARA rows. |
| 20 | `nara_naid` | string | NARA catalog identifier. Blank when not applicable. |
| 21 | `notes` | string | Disputes, conflicts between sources, items to verify. Includes `[verified]`, `[from-memory]`, `[disputed]`, `[unverified]` tags. |

Note: the header has 21 columns. The task listed 14 required columns (1-14); columns 15-21 are extras.

### ID schemes

| Pattern | Meaning |
|---|---|
| `TLA-T-###` | Ratified treaty. `###` is the NARA RIT number (so `TLA-T-199` is RIT 199, New Echota). |
| `TLA-T-FL1851` | Fort Laramie (Horse Creek) 1851. It does not appear in the NARA table as extracted, so it has no RIT number. See A1 section 4.4. |
| `TLA-U-CA-A` ... `TLA-U-CA-R` | The 18 unratified California treaties, lettered as in Heizer (1972). |
| `TLA-U-*` | Other unratified treaties (Pike 1805, Cherokee 1835-03-14, Franklin 1830). |
| `TLA-X-*` | International treaties and an executive order, included as context. |
| `TLA-S-*` | Statutes (Trade and Intercourse Act, Removal Act, Act of March 3, 1871, Dawes Act, ANCSA, Maine Settlement Act, Apology Resolution). |
| `TLA-A-*` | Agreements ratified by statute after 1871 (Brunot 1873-74, Black Hills 1877, Jerome 1892/1900). |

### Eras

| `era` value (prefix) | Years |
|---|---|
| colonial-context | before 1778 |
| confederation | 1778-1788 (Fort Harmar, signed 1789-01-09, carries this label) |
| early-republic | 1789-1814 |
| cession-and-pre-removal | 1815-1829 |
| removal | 1830-1848 |
| expansion-and-reservation | 1849-1871 |
| agreement-era | 1871-1913 |
| modern-statutory | 1914-present (context only) |

The `era` strings in the CSV include the year range in parentheses.

### Confidence

| Value | Meaning |
|---|---|
| `high` | Date, Stat. cite and Kappler cite were each confirmed in a source I read this session (31 rows). |
| `medium` | Date confirmed; at least one cite, ratification detail or land summary is `[from-memory]` or comes from a pointer source (84 rows). |
| `low` | The instrument and its NARA date are confirmed, but the Stat. page, Kappler page or land description is `[from-memory]`, or a source conflict is unresolved (20 rows). |

`high` does not mean tribal consultation has occurred. No row has been reviewed by a tribal government.

### Basis columns

The three basis columns record provenance, e.g., "NARA catalog-links table," "OSU Tribal Treaties Database," "Wikipedia (pointer)," "Heizer 1972," or "[from-memory]." Wikipedia is used only as a pointer to locate a Stat. or Kappler cite, never as the sole basis for a legal fact. Wherever a basis says `[from-memory]`, the verification agent should check the value.

## nara-ratified-treaties-index.csv: fields

| Column | Description |
|---|---|
| `nara_rit_no` | NARA RIT number. Values include `19A` and `143A` (lettered items) and numbers 1-374. |
| `date_signed` | ISO date derived from the NARA table. |
| `nations_and_place_per_nara` | NARA's title text (nation and place). |
| `nara_naid` | NARA catalog identifier. One row (RIT 55, Osage 1808) is marked "Treaty unavailable" with no NAID. |
| `source_url` | IDA Treaties Explorer URL, `https://digitreaties.org/treaties/treaty/<NAID>`. The pattern was confirmed for one record (RIT 118). |
| `in_treaties_seed` | `yes` for the 99 NARA rows that have a matching row in `treaties-seed.csv`. |

Reconciliation of the counts is in A1 section 4.2: items 8-374 plus 19A give 368 federal-era treaties; items 1-7 are British-era; 143A is a document set, not a treaty.

## Known gaps and cautions

1. **This is a sample, not the corpus.** 99 of the 376 NARA rows are in the seed. The rest should be added from the NARA index and Kappler.
2. **Stat. and Kappler page numbers.** Verified for the 31 `high` rows only. Many others come from OCR'd Statutes at Large volume indexes (some visibly corrupt), the OSU slug identifiers, or memory. The ones flagged `[disputed]` in notes: Navajo 1849, Yakama 1855, Fort Wise 1861, Fort Laramie 1868 (Stat. page and NAID).
3. **Date conflicts recorded in notes:** Dancing Rabbit Creek (proclamation 1831-02-24 vs. Senate consent 1831-02-25); California treaty B (1851-05-13 vs. 1851-05-30) and K (Temecula, 1851-09-18 vs. 1852-01-05); the Senate rejection of the California treaties (1852-07-08 vs. 1852-07-02).
4. **Fort Laramie 1851** is not in the NARA table as extracted. Check NARA numbering and whether the Senate-amended version was formally proclaimed.
5. **Acreage.** Most rows are blank. The ones present come from a single source or from memory and should not be used for calculations without checking Royce's schedule or Indian Claims Commission findings. Figures for ANCSA and Medicine Lodge (Cheyenne and Arapaho) that were retained acreage were removed from the acreage column.
6. **Unratified treaties.** Only 21 are included. The total number is unknown (BIA: at least 45; Senate archives: several dozen).
7. **Agreements 1871-1913.** Only three examples; no source with a count was found.
8. **Executive-order reservations.** One example (Hopi 1882). No inventory.
9. **Tribal names and successor nations.** The CSV uses NARA and Kappler names. Current nation names, endonyms and successor-in-interest assignments must come from tribal governments. The OSU database lists successor nations but marks several as under review.
10. **Contested signatory authority.** Several treaties were signed by a faction or by people whose authority was disputed. The CSV notes it as `[disputed]` or `[from-memory]` but has no dedicated field; add `signatory_authority_disputed` with sources before publishing.
11. **No geometry.** The CSV has no coordinates or Royce cession numbers. Add `royce_cession_number` after the USFS attribute table is joined (see A3 section 3).
12. **Context rows** (international, statutes, agreements, executive order) share the table for convenience. Filter by `instrument_type` and never count them as treaties.
13. **Alaska and Hawaii** rows are context only. No ratified US treaty with Alaska Native peoples or the Native Hawaiian people exists in the seed. The Hawaiian Kingdom treaty is a foreign-relations treaty with an independent state.
14. **Sensitive content.** The CSV carries no sacred-site locations. Land descriptions are general.

## Sources

See the Sources sections of `A1-treaty-framework-and-counts.md`, `A2-treaty-eras-and-clusters.md` and `A3-geospatial-and-treaty-datasets.md`. The row-level `source_url` column lists the pages used for each row. Key shared sources: the NARA catalog-links table (https://www.archives.gov/research/native-americans/treaties/catalog-links), the OSU Tribal Treaties Database (https://treaties.okstate.edu/), Heizer (1972) (https://digicoll.lib.berkeley.edu/record/83366/files/arfs003-001.pdf), the Statutes at Large volume index PDFs (https://dheller.org/Timeline-files/US-Statutes/), and Wikipedia treaty articles as pointers.

## Confidence & Gaps

**Confidence: medium.** Identity, NARA number and signing date of each ratified row are well supported. Cites, acreage and land summaries are the weak fields (see Known gaps). The verification agent should first spot-check the `[from-memory]` Stat. and Kappler pages, the disputed items in gap 2 and 3, and the Fort Laramie 1851 numbering.
