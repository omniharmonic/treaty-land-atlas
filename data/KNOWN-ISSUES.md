# Known data issues

Generated findings from the pipeline (ingest, graph build, validation) plus hand-logged problems. Research-level conflicts are in `docs/04-KNOWN-ISSUES-AND-INCONSISTENCIES.md`.

## Hand notes (2026-10-17)

- **Federal Register count:** 91 FR 4102 says 575 entities in its summary; the list as printed has 573 (348 + 225) plus 4 cross-references. The govinfo and federalregister.gov editions agree.
- **USFS layer:** 718 polygons; one (objectid 437) has no cession number and is left out. 725 table rows; one (objectid 361) is empty. The seven cessions without geometry are exactly the ones E2 listed (47, 65, 128, 129, 130, 543, 690).
- **USFS present-day names** use older Federal Register names in places; `crosswalks/usfs-tribe-name-overrides.csv` maps ten of them, each with a reason.
- **Citations:** a research pass (OSU Tribal Treaties Database pages, checked against Kappler scans) added Stat. and Kappler citations for 268 instruments (`crosswalks/instrument-citations.csv`). Still without a Stat. cite: TLA-T-019 (Kappler appendix, American State Papers), TLA-T-019A, TLA-T-028.
- **Date mismatches found by that pass (not changed):** TLA-T-166: source dates it 1832-01-19, our data 1832-01-29. TLA-T-055: our date is only "1808"; OSU gives 1808-11-10. OSU lists RIT 45 as RIT 44. OSU catalog ids differ from ours for about 24 treaties (034, 045, 049, 077, 083, 108, 158, 172, 177 and others); these look like OSU errors and need a check against catalog.archives.gov. RIT 216 binds two 1836 Sauk and Fox treaties (7 Stat. 517 and 520); RIT 235 includes the 1854 Creek supplement (11 Stat. 599).
- **Human review list:** `docs/review/nations-and-links-for-human-review.md`.

<!-- generated:start -->
### stage: ingest
0 finding(s).

- none

### stage: validate
84 finding(s).

- **warn** `nara-ratified-treaties-index.csv RIT 55`: missing_naid: NARA row has no NAID (marked 'Treaty unavailable'); no source link can be built for it.
- **warn** `treaties-seed.csv TLA-S-HI1993`: statute_only_in_treaties_seed: 'Apology Resolution (Pub. L. 103-150), 1993' is a statute row in treaties-seed.csv with no matching row in statutes-seed.csv; created as stat-apology-resolution-1993. Add it to statutes-seed.csv.
- **warn** `organizations-seed.csv org-nana`: data_mismatch: 'NANA Regional Corporation' is typed 'tribal-government' but the name says Corporation (ANCSA corporations are not tribal governments). Check indigenous_led.
- **warn** `violation-instrument-links.csv V039`: stat_cite_crosscheck: 21 Stat. 199 is printed in treaty_name but no linked instrument has that stat_cite.
- **warn** `violation-instrument-links.csv V047`: stat_cite_crosscheck: 7 Stat. 418 is printed in treaty_name but no linked instrument has that stat_cite.
- **warn** `violation-instrument-links.csv V047`: stat_cite_crosscheck: 11 Stat. 700 is printed in treaty_name but no linked instrument has that stat_cite.
- **warn** `violation-instrument-links.csv V047`: stat_cite_crosscheck: 14 Stat. 786 is printed in treaty_name but no linked instrument has that stat_cite.
- **warn** `graph GEO-002`: orphan_node: Source node has no edges.
- **warn** `graph GEO-003`: orphan_node: Source node has no edges.
- **warn** `graph GEO-004`: orphan_node: Source node has no edges.
- **warn** `graph GEO-005`: orphan_node: Source node has no edges.
- **warn** `graph GEO-006`: orphan_node: Source node has no edges.
- **warn** `graph GEO-007`: orphan_node: Source node has no edges.
- **warn** `graph GEO-008`: orphan_node: Source node has no edges.
- **warn** `graph GEO-009`: orphan_node: Source node has no edges.
- **warn** `graph GEO-010`: orphan_node: Source node has no edges.
- **warn** `graph GEO-011`: orphan_node: Source node has no edges.
- **warn** `graph GEO-012`: orphan_node: Source node has no edges.
- **warn** `graph GEO-013`: orphan_node: Source node has no edges.
- **warn** `graph GEO-014`: orphan_node: Source node has no edges.
- **warn** `graph GEO-015`: orphan_node: Source node has no edges.
- **warn** `graph GEO-016`: orphan_node: Source node has no edges.
- **warn** `graph GEO-017`: orphan_node: Source node has no edges.
- **warn** `graph GEO-018`: orphan_node: Source node has no edges.
- **warn** `graph GEO-019`: orphan_node: Source node has no edges.
- **warn** `graph GEO-020`: orphan_node: Source node has no edges.
- **warn** `graph GEO-021`: orphan_node: Source node has no edges.
- **warn** `graph GEO-022`: orphan_node: Source node has no edges.
- **warn** `graph GEO-023`: orphan_node: Source node has no edges.
- **warn** `graph GEO-024`: orphan_node: Source node has no edges.
- **warn** `graph TLA-T-004`: orphan_node: Instrument node has no edges.
- **warn** `graph TLA-T-005`: orphan_node: Instrument node has no edges.
- **warn** `graph plc-region-multi-region`: orphan_node: Place node has no edges.
- **warn** `TLA-A-1874`: instrument has no source URL and no NARA NAID
- **warn** `TLA-T-019`: ratified instrument has no Statutes at Large citation
- **warn** `TLA-T-019A`: ratified instrument has no Statutes at Large citation
- **warn** `TLA-T-028`: ratified instrument has no Statutes at Large citation
- **warn** `stat-catawba-settlement-act-1993`: verified statute has no source URL
- **warn** `stat-civilization-fund-act-1819`: verified statute has no source URL
- **warn** `stat-flood-control-act-1944-pick-sloan`: verified statute has no source URL
- **warn** `stat-house-concurrent-resolution-108-1953`: verified statute has no source URL
- **warn** `stat-menominee-restoration-act-1973`: verified statute has no source URL
- **warn** `stat-menominee-termination-act-1954`: verified statute has no source URL
- **warn** `stat-national-historic-preservation-act-1966`: verified statute has no source URL
- **warn** `stat-northwest-ordinance-1787`: verified statute has no source URL
- **warn** `stat-rhode-island-settlement-act-1978`: verified statute has no source URL
- **warn** `org-cheyenne-arapaho-tribes`: listed organization has no website
- **warn** `org-houlton-maliseet`: listed organization has no website
- **warn** `org-kai-poma`: listed organization has no website
- **warn** `org-mckenzie-river-trust`: listed organization has no website
- **warn** `org-mechoopda`: listed organization has no website
- **warn** `org-menominee-tribe`: listed organization has no website
- **warn** `org-mikmaq-nation`: listed organization has no website
- **warn** `org-nana`: listed organization has no website
- **warn** `org-oneida-indian-nation`: listed organization has no website
- **warn** `org-penobscot-nation`: listed organization has no website
- **warn** `org-puyallup-tribe`: listed organization has no website
- **warn** `org-rosebud-sioux-tribe`: listed organization has no website
- **warn** `org-save-the-redwoods-league`: listed organization has no website
- **warn** `org-siletz-ctsi`: listed organization has no website
- **warn** `org-southern-sierra-miwuk`: listed organization has no website
- **warn** `org-stockbridge-munsee`: listed organization has no website
- **warn** `org-tule-river-tribe`: listed organization has no website
- **warn** `org-washoe-tribe`: listed organization has no website
- **warn** `G-02`: Native Land Digital: pending (blocks public launch; live lookup)
- **warn** `G-03`: LOC Royce credit line: pending (blocks public launch)
- **warn** `G-04`: Census today layer: pending (blocks public launch)
- **warn** `G-08`: Treaty, case and statute text and quotations: pending (blocks public launch)
- **warn** `G-09`: Third-party scholarly portals: link only: pending (blocks public launch)
- **warn** `G-10`: Basemap: pending (blocks public launch)
- **warn** `G-11`: Software and fonts: pending (blocks public launch)
- **warn** `G-12`: Verification wave: pending (blocks public launch)
- **warn** `G-14`: Governance documents: pending (blocks tribal outreach; public launch)
- **warn** `G-15`: Tribal advisory: pending (blocks nation pages; counterfactuals)
- **warn** `G-16`: Legal review: pending (blocks Phase 4 release; public launch)
- **warn** `G-17`: Charitable-solicitation review: pending (blocks Phase 5 release)
- **warn** `G-18`: Sensitive-content review: pending (blocks public launch)
- **warn** `G-19`: Accessibility audit: pending (blocks public launch)
- **warn** `G-20`: Corrections and takedown readiness: pending (blocks public launch)
- **warn** `G-21`: Privacy: pending (blocks public launch)
- **warn** `V017.mechanism_summary`: mentions "graves": check that no location detail is given
- **warn** `V049.land_lost_description`: mentions "ceremonial": check that no location detail is given
- **warn** `org-apache-stronghold.summary`: mentions "sacred site": check that no location detail is given
- **warn** `org-nhlc.summary`: mentions "burial": check that no location detail is given
<!-- generated:end -->
