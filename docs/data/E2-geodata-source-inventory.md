---
title: Geodata and Source Inventory for the Treaty Land Atlas
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Geodata and Source Inventory

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

Research Agent E, file 2 of 3. Machine-readable version: `../../seed-data/geodata-sources.csv`. Companion files: `E1-native-land-api-integration.md`, `E3-static-hosting-and-map-tech-feasibility.md`.

Tags: `[verified]` read in a source this session; `[from-memory]`; `[disputed]`; `[unverified]`. Sizes marked "estimate" are my own arithmetic, not published figures.

## 0. Summary and recommended roles

| Role in the atlas | Recommended source | Why |
|---|---|---|
| Historical cession geometry and the time slider | **USFS "Tribal Lands Ceded to the United States"** (georeferenced Royce maps, 1784-1894) | Polygons plus up to five dates per cession, tribe names, links to Kappler texts, statutes, executive orders. CC BY 4.0 per Data.gov. |
| Treaty text and the treaty-event graph | **Kappler via OSU Tribal Treaties Database**, **NARA/DigiTreaties**, Library of Congress | Primary and near-primary text; no geometry. Link them to Royce cession numbers. |
| Current reservation and trust land | **BIA Land Area Representation (LAR)** and **Census TIGER AIANNH** | Authoritative for "what is today," with explicit non-legal disclaimers. |
| Historical state and county context | **Newberry Atlas of Historical County Boundaries** | Free shapefiles back to the 1600s; useful for "what jurisdiction was this in when." |
| Post-1894 loss and specialized cases | ANCSA data (Alaska), allotment-era material | Royce stops in 1894; other datasets fill the gap but need work. |
| Contemporary self-described territory | **Native Land Digital** (gated; see E1) | Not a time-slider layer. |

**A premise correction.** The task brief names the "University of Richmond Digital Scholarship Lab 'Invasion of America' dataset." I could not confirm that. "Invasion of America" is an interactive map by **Claudio Saunt of the University of Georgia** (accompanying his book *West of the Revolution*) hosted at invasionofamerica.ehistory.org, and I found no Richmond involvement in the pages I read. The Richmond Digital Scholarship Lab publishes *American Panorama*, whose page I could not render. [verified for Saunt/UGA; the Richmond link is unconfirmed] Saunt is credited as a collaborator on the USFS dataset below, so the **downloadable, openly licensed version of the same Royce digitization is the USFS dataset**. I did not find a separate Invasion of America download or license. [unverified]

## 1. Royce cessions and their georeferenced versions

### 1.1 Royce's original maps (Library of Congress / Smithsonian BAE)

- *Indian Land Cessions in the United States*, compiled by Charles C. Royce, with an introduction by Cyrus Thomas, 1899; part 2 of the Bureau of American Ethnology's Eighteenth Annual Report (1896-97), pp. 521-997. Contains **67 maps and two tables** (the Schedule of Treaties and Acts of Congress Authorizing Allotments of Lands in Severalty, and the Schedule of Indian Land Cessions). Also printed as H.R. Doc. No. 736, 56th Cong., 1st Sess. [verified: LOC item page]
- Library of Congress states the contents are **public domain**, free to use and reuse (credit line "Law Library of Congress"). Formats: online text, image, PDF, IIIF manifest. [verified]
- Fit for the time slider: as scans, none; as the *source of record* for the georeferenced data, essential for citation.
- Scholarly caution `[disputed]`: Royce's maps and schedule reflect an 1890s federal view of what was ceded. They are a record of US claims of cession, not of Indigenous territory, and not all cessions were consensual or ratified. The Schedule classifies entries by legal type (treaty, unratified treaty, executive order), which the atlas must keep distinct. [verified for the classification, via HCN's description of the schedule]

### 1.2 USFS "Tribal Lands Ceded to the United States" (the key dataset)

| Item | Detail |
|---|---|
| Publisher | USDA Forest Service (Geospatial Service and Technology Center; Office of Tribal Relations) [verified] |
| Content | Polygon feature class from 67 scanned, georeferenced, digitized Royce maps; entries match Royce's Schedule through 1894. Georeferenced against USGS 1:2,000,000 National Atlas layers. [verified] |
| Collaborators | 2018 revision with the NPS National NAGPRA Program, the EPA American Indian Environmental Office, and Dr. Claudio Saunt (University of Georgia). [verified] |
| Feature count | **718** polygons (REST count query returned 718). Metadata elsewhere cites 752 polygons and 1,172 attribute rows; the sources disagree. [verified count; discrepancy `[disputed]`] |
| Gaps | Seven cession IDs (47, 65, 128, 129, 130, 543, 690) have no spatial data. [verified] |
| Attributes | A separate table (41 fields) with `cessnum`, up to **five dates** (`cessdate1`-`cessdate5`), links to the Royce Schedule entries, links to **Kappler treaty text** (748 linked), federal statutes (140), executive orders (214), other treaty text, map names/URLs, present-day tribes, state, county, and "tribe named in land cessions, 1784-1894." [verified] |
| Formats | ArcGIS REST service (query as JSON, GeoJSON, PBF), CSV, GeoJSON, KML, Shapefile ZIP, Hub page, ISO 19139 XML. [verified] |
| License | Data.gov record: **CC BY 4.0**. Both Data.gov listings say CC BY 4.0 (issued 2017-04-12, modified 2022-08-29). The agency's own metadata XML (metadata date 2018-05-29) states use constraints "This data is for informational purposes only.", access constraints "None", and **no explicit open license**; the credit line is "USDA Forest Service Office of Tribal Relations", and no Forest Service Research Data Archive record was found. [disputed] Treat as CC BY 4.0 with attribution to USFS, and confirm with the contact before launch. |
| Disclaimer | Not legal documents; not for determining title, ownership, boundaries, jurisdiction. [verified] |
| Caveats | Changes by the Office of Tribal Relations "have not been reviewed or approved by the National NAGPRA Program" (89 rows edited); positional accuracy not stated. [verified] |
| Update status | First published 12 April 2017; last updated 29 August 2022; metadata says updates "None planned." [verified] |
| Size | Not published. Estimate in E3: on the order of 1 to 10 MB raw GeoJSON. [estimate] |
| Contact | Rebecca Hill, USFS Office of Tribal Relations (listed on Data.gov for data questions and error reports). [verified] |
| URLs | REST: apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer ; Hub: data-usfs.hub.arcgis.com/datasets/usfs::tribal-lands-ceded-to-the-united-states-feature-layer ; metadata: data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml [verified] |
| **Fit for time slider** | **High.** Dates per cession, polygons, and treaty/statute/EO crosswalk. Limits: ends in 1894; overlapping polygons for the same area are possible (do not sum acreage); date semantics (signing vs ratification) need verification against the Schedule. |

**Why it matters for the graph:** the `cessnum` key plus Kappler, statute, and executive-order links give a ready crosswalk from geometry to treaty records. Other agents' treaty lists should carry `royce_cession_number` where known.

### 1.3 High Country News "Morrill Act of 1862 Indigenous Land Parcels Database" (Land-Grab U)

- Built on Royce's 67 maps (718 land areas) and the UGA/USFS georeferenced versions; **162 cession polygons** matched to about 79,461 Morrill Act parcels; supplementary maps for ND, SD, MS, CA, LA (including a 1978 Indian Claims Commission map georeferenced by Robert Lee). [verified]
- Format: shapefiles and CSVs on GitHub (`Cessions_Polygons.shp`, `Parcels_Polygons.shp`, `Universities_Points.shp`, plus CSVs and an Excel summary). [verified]
- License: landgrabu.org and the repo README say ODbL + CC BY-SA 3.0; the hcn.org article page states no data license (its article text is CC BY-NC-ND 4.0); the repo LICENSE file text is CC0 1.0 Universal, and the sidebar says CC0-1.0. **Still inconsistent;** ask landgrabu@hcn.org which governs before any reuse. [disputed]
- HCN states the data have caveats (about 7,100 acres unlocated; payments are per-acre averages; no tribal-consultation process described; present-day tribe linking not done). [verified]
- Contact in README: landgrabu@hcn.org. [verified]
- Fit: good as a *case study layer* ("land-grab universities"), not as the base cession layer. Share-alike terms would apply to derivatives.
- The Big Ten Academic Alliance Geoportal hosts a "Cession Polygons" record (162 polygons, shapefile, rights not stated). Its page was gated when I fetched it. [verified for what loaded]

### 1.4 Saunt "Invasion of America"

- Interactive time-lapse (1776-1887) at invasionofamerica.ehistory.org; fetching it was blocked by robots rules, so I relied on secondary descriptions. No download or license found. [unverified]
- Fit: excellent *model* for the UX of a cession time slider; not a data source we can assume we may reuse.

## 2. Treaty text and documentary sources (no geometry)

| Source | What it is | Terms | Fit |
|---|---|---|---|
| **Tribal Treaties Database (Oklahoma State University Libraries)**, treaties.okstate.edu | A browsing portal built on OSU's digital edition of Kappler's *Indian Affairs: Laws and Treaties*. Categories: Treaties, Agreements, Executive Orders ("Other Documents"); browse by tribe, key provisions, indexes. Launched June 2021; phase 1 covered 300+ treaties 1778-1883; fourth phase underway as of November 2023. Partners USDA, DOI, DoD Legacy. [verified] | No license or API stated; "free public resource"; a disclaimer page exists but was not read. Contact: lib-dls@okstate.edu. [verified] | Good as a *link target and citation aid* for treaty entries. Ask OSU before bulk-scraping. |
| **Kappler, *Indian Affairs: Laws and Treaties*** | The standard compilation of US-tribal treaty texts (vol. 2, 1904, is the treaties volume). [from-memory for volume details] | Public domain as a US government publication `[from-memory]` | The citation standard the brief requires. |
| **NARA, Indian Treaties 1722-1869** (National Archives Identifier 299798; microfilm M668) and unratified treaties (identifier 300293) | Original ratified treaties, digitized in the National Archives Catalog. [verified] | NARA's page does not state reuse terms; check each catalog record. [verified] | Best for linking to images of originals. |
| **DigiTreaties / IDA Treaties Explorer** (digitreaties.org), Indigenous Digital Archive (Museum of Indian Arts and Culture, Santa Fe) with the National Archives | Scans of the NARA ratified treaties, with Treaties, Cessions, Nations, Places sections; "374 treaties" in its trading cards. NARA says it provides "historical and contemporary maps of land cessions." [verified] | No license or API stated. Contact: info@native-docs.org. [verified] | Good partner and link target; a possible source of cession maps. Ask about reuse. |
| **Smithsonian NMAI, "Nation to Nation: Treaties Between the United States and American Indian Nations"** | Exhibition (opened September 2014, through fall 2018; guest curator Suzan Shown Harjo; 125+ objects; 37 tribes) and a 272-page companion book. [verified] | No dataset or online resource mentioned on the fact sheet. [verified] | Use for narrative and citation; not a data source. Treaties-in-force framing: the fact sheet says nothing either way. |
| **Library of Congress** | Royce volume (above); also Kappler and the Statutes at Large in various collections `[from-memory]` | Public domain items marked as such | Source of record; stable links for citations. |

Counts differ by source `[disputed]`, so record the range: OSU phase 1 "300+" (1778-1883); DigiTreaties "374" (NARA ratified); Royce Schedule entries 1,172; USFS polygons 718. These count different things (treaties vs cessions vs map polygons). Do not equate them.

## 3. Current boundaries and land status

### 3.1 Census TIGER/Line AIANNH

- Content: American Indian, Alaska Native, and Native Hawaiian areas: federal reservations, off-reservation trust lands, state-recognized reservations, Hawaiian home lands, and statistical areas. [verified]
- Format: shapefile (EPSG:4269 per the 2023 metadata). Census lists annual vintages (2006-2026 shown, plus 1992 and 2000), shapefiles from 2007 on; the 2026 files were released 14 October 2026 with legal boundaries as of 1 January 2026. [verified]
- License: no formal terms; "not copyrighted," free to use; Census Bureau must be acknowledged; "TIGER/Line" is a registered trademark. [verified, Data.gov record]
- Caveat to display: boundaries are for statistical purposes, "are not legal land descriptions," and do not determine jurisdiction or entitlement; BIA supplies legal boundary information only in limited circumstances. [verified]
- File size: not published on the pages I read. Cartographic-boundary (generalized) versions exist and would be smaller `[from-memory]`; I could not confirm sizes (the Census FTP listings were blocked by robots rules). [unverified]
- Fit for time slider: **low as a time series, high as a "today" layer.** Annual vintages could show change over decades but are statistical, not legal.

### 3.2 BIA Land Area Representation (LAR)

- Content: external extent of federal Indian reservations and associated trust, restricted-fee, or mixed-ownership land, plus Public Domain Allotments, Dependent Indian Communities, Homesteads. Fields include LARID, LARNAME, CLASSIFICATION, GISACRES, REGION. [verified]
- Access: ArcGIS REST (MapServer/FeatureServer) at biamaps.geoplatform.gov; the data-download page lists the national LAR as **REST only** (other BIA datasets offer SHP/GDB/KMZ/JSON). Max 2,000 records per query. [verified]
- Terms: public information, "restrictions on appropriate use"; **illustrative and reference use only, not for legal, survey, engineering or navigation use; "No legal inference can or should be made."** Reservation boundaries are authoritative only where Congress defined them or a court finally interpreted them; otherwise consult the Tribe and then BIA. BIA recommends obtaining data directly from BIA because copies may be altered. [verified]
- Provenance: created 2015-2019 under a memorandum of agreement with the Census Bureau; "continuously being updated." Contact: geospatial@bia.gov, 1-877-293-9494. [verified]
- Note: the BIA is running a tribal-consultation process on data governance; the LAR has no stated distribution terms there. [verified]
- Fit: high for a "current" layer; **pull via query at build time with attribution and keep the disclaimer**, or link to BIA. Confirm with BIA that republishing a derived snapshot is acceptable (their guidance favors direct retrieval).

### 3.3 PAD-US (USGS Protected Areas Database)

- Version 4.1 is current on the USGS page; formats: ArcGIS geodatabase (national and state), KMZ, analysis files; no shapefile or GeoPackage mentioned; sizes and license not stated on that page (citation: USGS GAP, 2024, doi.org/10.5066/P96WBCHS). Tribal areas appear only in the "Proclamation" feature class and spatial-analysis files on that page. USGS "strongly discourage[s]" comparing versions to infer changes over time, and "Date of Establishment" is not fully attributed. [verified]
- Fit: **low.** It is a land-management inventory, not a treaty dataset, and it explicitly cannot support change-over-time analysis. Useful at most for showing present-day federal and state ownership on lands that were once ceded.

### 3.4 BLM and Alaska (ANCSA)

- **BLM Alaska conveyed lands** (State Office, REST): lands conveyed to the State, to ANCSA regions and villages, Native allotment parcels, individuals. Provided "as is"; cite BLM; modifications must be described; no endorsement may be implied; not a legal document. Update schedule unstated. [verified]
- **ANCSA regional corporation boundaries** (Alaska Department of Natural Resources, edition 95, published 1995): 12 corporations; derived in 1992 from 1990 TIGER data and the 1987 BLM Alaska Land Status Map; not recommended at scales larger than 1:1,000,000; must cite source; no open license named; status complete, updates "as needed." [verified]
- Fit: **medium-low.** Alaska is mostly outside the treaty regime (the 1867 purchase from Russia, then ANCSA 1971). Include as a clearly labeled "different legal regime" overlay, not on the treaty slider. The ANCSA boundaries are dated (1992 derivation) and coarse.
- Other BLM national data (General Land Office records, PLSS) were not investigated beyond the Land-Grab-U note that its parcels came from the BLM GLO database. [verified for that note]

### 3.5 Esri / ArcGIS tribal layers

- "USA Federal Lands" in the Living Atlas covers six agencies (FWS, NPS, USFS, BLM, Reclamation, DoD) and, per the 2018 Esri blog I read, **does not mention tribal lands**; terms not stated there. [verified]
- A USFS service `EDW_TribalIndianLands_01` appeared in search results. I did not read it. [unverified]
- Tribal and reservation layers on Esri's platform are typically republished Census or BIA data; prefer the original publisher so provenance and disclaimers stay intact. [from-memory]
- Fit: **low** (use originals).

## 4. Time-aware context

- **Newberry Library, Atlas of Historical County Boundaries (AHCB):** all 50 states, DC, and Dakota Territory; daily-resolution boundary changes "starting in the early 1600s and extending through the end of the year 2000"; shapefiles and KMZ, with FGDC metadata and a change database; the Newberry makes its collections available for any lawful purpose without license or permission fees, subject to its rights-and-reproductions page; the project page states no citation requirement (cite anyway). [verified]
- Fit: **high as a backdrop** for the question "which colony, territory, state, or county claimed this area in year X," and for rendering the slider's jurisdictional context. It does not map Indigenous nations.

## 5. Tribal and Indigenous-controlled sources

- **Tribal nations' own GIS portals and websites.** Some nations publish maps; many do not release GIS data openly, which is consistent with tribal data sovereignty. I did not find or verify any specific tribal open-data portal in this pass (search results returned third-party hosting of Navajo Nation chapter boundaries, not tribe-controlled portals). Do not assume tribal boundary data is available; ask each nation. [unverified]
- Example of a tribal source inside another dataset: NLD's Cession 344 entry cites the Confederated Tribes of Grand Ronde's treaty history page. [verified]
- **Indian Land Tenure Foundation (ILTF):** its home page states a mission of helping Indian nations and people recover and control their homelands, with publications and resources; I found **no map or dataset** on the pages I read and no licensing statement. It is better treated as a Land Back **organization** (for the organizations research) and a possible partner than as a geodata source. Phone listed on the site: 651-766-8999. [verified for page contents; datasets unverified]
- **Cultural-protocol flag.** None of the sources above map sacred sites, but any future tribal-supplied layer must go through that nation's consent process (brief principle 5).

## 6. Master comparison

| Source | Format | License / terms | Update | Time-slider fit |
|---|---|---|---|---|
| USFS Royce cessions | GeoJSON, SHP, CSV, REST | CC BY 4.0 (Data.gov) / none stated (metadata) `[disputed]` | Last 2022; none planned | High (1784-1894) |
| LOC Royce scans | Image, PDF, IIIF | Public domain per LOC | Static | Reference only |
| HCN Land-Grab U | SHP, CSV | ODbL / CC BY-SA (README) vs CC0 (LICENSE file) `[disputed]` | 2020 | Medium (case study) |
| Saunt Invasion of America | Web map | Not found | Not stated | Model, not data |
| OSU Tribal Treaties DB | Web portal | Not stated | Ongoing phases | Treaty events (no geometry) |
| NARA / DigiTreaties | Images, catalog | Not stated | Not stated | Treaty events (no geometry) |
| NMAI Nation to Nation | Exhibition | n/a | Closed 2018 | Narrative only |
| Census TIGER AIANNH | Shapefile | Free, acknowledge Census | Annual vintages | Low (today layer) |
| BIA LAR | REST | Public, illustrative, no legal use | Continuous | Low (today layer) |
| PAD-US 4.1 | GDB, KMZ | Not stated on page | Versioned | Low |
| BLM AK conveyed lands | REST | As is; cite BLM | Not stated | Low (Alaska) |
| ADNR ANCSA corporations | REST/metadata | No open license named | 1995 edition | Low (Alaska) |
| Newberry AHCB | SHP, KMZ | No fee; see Newberry rights page | Complete through 2000 | High (backdrop) |
| Native Land Digital | API, GeoJSON, tiles | Treaty with restrictions; CC0 label `[disputed]` | Daily/weekly | None (no dates) |
| ILTF | n/a | n/a | n/a | n/a |

## Sources

- USFS cession dataset: https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer ; https://apps.fs.usda.gov/ArcX/rest/services/EDW/EDW_TribalCessionLands_01/MapServer ; .../MapServer/1 ; .../MapServer/2 ; https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml ; REST count query (returned 718)
- LOC Royce item: https://www.loc.gov/resource/g3701em.gct00002/?sp=26
- Saunt / Invasion of America: https://geographyeducation.org/2014/06/20/the-invasion-of-america/ ; https://civilrightsteaching.org/resource/invasion-of-america ; Richmond American Panorama landing: https://dsl.richmond.edu/panorama (did not render)
- HCN Land-Grab U: https://www.hcn.org/articles/indigenous-affairs-education-how-we-investigated-the-land-grant-university-system ; https://github.com/HCN-Digital-Projects/landgrabu-data ; https://geo.btaa.org/catalog/Treaties_Morrill_Overlaps
- OSU Tribal Treaties Database: https://treaties.okstate.edu/ ; https://library.okstate.edu/news/latest-news/tribal-treaties-database-continues-to-expand-and-improve ; https://shareok.org/handle/11244/335881
- NARA and DigiTreaties: https://www.archives.gov/research/native-americans/treaties/viewing-treaties ; https://digitreaties.org/treaties/resources/
- NMAI: https://si.edu/newsdesk/factsheets/nation-nation-exhibition
- Census: https://catalog.data.gov/dataset/tiger-line-shapefile-2023-nation-u-s-american-indian-alaska-native-native-hawaiian-areas-aiannh ; https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
- BIA: https://biamaps.geoplatform.gov/datadownload.html ; https://biamaps.geoplatform.gov/server/rest/services/DivLTR/BIA_AIAN_National_LAR/MapServer/0 ; https://www.bia.gov/service/tribal-consultations/bia-data-governance-bia-open-data-and-bia-tract-viewer
- PAD-US: https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-download
- BLM and ANCSA: https://gis.blm.gov/akarcgis/rest/services/Land_Status/BLM_AK_Land_Status_Conveyed_Lands/MapServer/0/iteminfo ; https://maps.commerce.alaska.gov/server/rest/services/ANCSA/ANCSA_Corporations/MapServer/0/metadata
- Esri: https://www.esri.com/arcgis-blog/products/defense/defense/whats-new-with-usa-federal-lands-in-the-living-atlas
- Newberry AHCB: https://publications.newberry.org/ahcb/project.html
- ILTF: https://www.iltf.org/
- NLD: see E1 Sources.

## Confidence & Gaps

Overall confidence: **medium**. Strong on the USFS/Royce dataset, BIA, Census, Newberry; weaker on sizes, tribal portals, and several licenses.

- **File sizes** for TIGER, BIA LAR, PAD-US, USFS GeoJSON are unpublished in what I read; E3 gives estimates only. [unverified]
- **USFS license conflict** (CC BY 4.0 on Data.gov versus none in the metadata XML). Confirm with the agency contact. [disputed]
- **HCN license conflict** (README and landgrabu.org say ODbL/CC BY-SA; the LICENSE file is CC0 1.0; the article page states none). [disputed; confirmed as a conflict by V3]
- **Invasion of America**: no download, license, or Richmond link found. [unverified]
- **Date semantics** of Royce `cessdate1-5` (signed, ratified, proclaimed) not confirmed. [unverified]
- **Polygon overlap and duplicate coverage** in the USFS data not tested (cannot download in this sandbox). [unverified]
- **Tribal GIS portals** not identified; likely must be requested nation by nation. [unverified]
- **Smithsonian**: only the NMAI exhibition was checked; other Smithsonian archives (BAE, NAA) were not searched.
- **Indian Claims Commission maps/data**, the **Indian Land Tenure Foundation** data holdings, **allotment-era** (Dawes Act and after) spatial data, and **termination/restoration** data were not located as downloadable geodata. These matter for post-1894 coverage.
- Census FTP listings, the Saunt site, and the OSU disclaimer page were blocked or not read.
- Pages were read through a summarizing fetch tool, not as raw files; verify license text in the original before reuse.
