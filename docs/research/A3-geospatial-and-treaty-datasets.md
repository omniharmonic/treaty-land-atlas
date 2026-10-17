---
title: Geospatial and Treaty Datasets for a Time-Aware Treaty Map
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# A3. Geospatial and treaty datasets

Research Agent A, Treaty Land Atlas. This file evaluates the datasets that could supply (a) **treaty and agreement text and metadata** and (b) **cession and territory geometry over time**. It is the treaty-corpus companion to `docs/data/E2-geodata-source-inventory.md` and `docs/data/E1-native-land-api-integration.md`, which cover the geodata and the Native Land Digital API in more depth; where we overlap I have tried to agree with E2 and I point out the few places where my reading adds a detail or a discrepancy. The machine-readable inventory is `seed-data/geodata-sources.csv` (GEO-001 onward), which I did not edit.

Confidence tags: `[verified]` (read this session), `[from-memory]`, `[disputed]`, `[unverified]`. Several pages were blocked or failed to render (noted per source); nothing was bypassed.

## 1. Bottom line

1. **There is no single dataset that is both treaty-complete and geometry-complete.** The best geometry for 1784-1894 cessions is the **Royce maps and schedule** (1899), and the best open digital version is the **USFS "Tribal Lands Ceded to the United States"** layer (CC BY 4.0 on Data.gov, with a conflicting "informational only" use constraint in the agency metadata `[disputed]`). The best treaty text and metadata are in the **National Archives / IDA Treaties Explorer** (ratified treaties, NAIDs), the **OSU Tribal Treaties Database and Kappler** (texts, successor-in-interest data, wider scope), and the **UNL Treaties Portal** (375 treaties, downloadable).
2. **The join keys already exist.** The USFS attribute table links each Royce cession number (`cessnum`) to Kappler treaty text, statutes and executive orders (E2 counts 748 Kappler links `[verified in E2]`; I confirmed the field list and the link fields). OSU Tribal Treaties Database item records carry a **Kappler identifier, a NARA RIT number and a NAID** in the same record. The IDA record exposes the NAID and a "cessions with shared dates" field. So the atlas can crosswalk **Royce cession number <-> Kappler page <-> RIT number <-> NAID <-> Stat. cite** without fuzzy matching, for the treaties where the links are populated. My `seed-data/nara-ratified-treaties-index.csv` is the NAID spine.
3. **Unratified treaties, agreements and executive orders have thinner coverage.** Royce's Schedule includes treaties, unratified treaties and executive orders (E2), but I did not obtain a count of unratified-treaty entries in the USFS table. The 18 California treaties are mapped only in Royce's maps by reference (Heizer 1972, p. 5) and there is no digitized boundary for them `[from-memory]` beyond that.
4. **Geometry limits are real and must be shown to users.** Royce's maps are 1890s depictions of what the United States claimed was ceded, georeferenced against a 1:2,000,000 base. They are not Indigenous territory, not surveys, and not legal descriptions. Positional accuracy is stated only as "no visible gap at a viewable scale."
5. **Licensing needs a decision from the project owner** in two places: the USFS CC BY 4.0 vs. "informational only" language, and Native Land Digital's CC0 label vs. its Data Sovereignty Treaty terms (non-commercial, attribution, API key). See section 4.

## 2. Source-by-source evaluation

### 2.1 Royce, *Indian Land Cessions in the United States* (1899): the original

| Attribute | Finding | Tag |
|---|---|---|
| What it is | Part 2 of the Bureau of American Ethnology's *Eighteenth Annual Report* (1896-97), compiled by Charles C. Royce with an introduction by Cyrus Thomas. 67 maps (some folded) plus two schedules: the Schedule of Treaties and Acts of Congress Authorizing Allotments of Lands in Severalty, and the Schedule of Indian Land Cessions (through 1894). Also issued as H. Doc. 736, 56th Cong., 1st Sess. (Serial Set 4015). LCCN 13023487. | `[verified]` (LOC item and MODS record) |
| Formats | LOC: online text, images, PDF and an IIIF presentation manifest. Smithsonian Libraries and Archives repository: one PDF of about 101.57 MB. | `[verified]` |
| License / rights | LOC: contents in the public domain, free to use and reuse. Smithsonian repository: "No Copyright, United States (NoC-US 1.0)." | `[verified]` |
| Size | 67 maps; LOC pagination 521-997; the Smithsonian record gives pages 521-964 `[disputed]` (the discrepancy is likely page range of text vs. including the schedule and index). | `[verified]` both; reason `[unverified]` |
| Date | LOC: 1899. Smithsonian repository record: 1902. The 1899 date matches the Serial Set printing; the 1902 date is likely the later BAE annual-report volume `[unverified]` | `[disputed]` |
| Update status | Static historical work (stops at 1894). | `[verified]` |
| Limitations | Reflects the federal view of cessions; includes entries for treaties never ratified and for executive orders; some cessions "were not consensual." Map scales not stated in the LOC record. Not geocoded; requires georeferencing (done in 2.2). | `[verified]` (scale), `[from-memory]` (consent point; E2 labels it `[disputed]`) |
| URLs | https://www.loc.gov/resource/g3701em.gct00002/?sp=26 ; https://lccn.loc.gov/13023487/mods ; https://repository.si.edu/handle/10088/91692 | `[verified]` |

I tried the direct Smithsonian PDF bitstream and the `memory.loc.gov` Library of Congress page; both failed to fetch, so I did not inspect the PDF contents.

### 2.2 USFS "Tribal Lands Ceded to the United States": georeferenced Royce

| Attribute | Finding | Tag |
|---|---|---|
| Publisher | USDA Forest Service Geospatial Service and Technology Center. Collaborators named: Forest Service Office of Tribal Relations, National Park Service National NAGPRA Program, EPA Office of International and Tribal Affairs, and Dr. Claudio Saunt (University of Georgia). Saunt and the Forest Service "independently digitized and georeferenced" the maps. | `[verified]` (Data.gov and agency metadata) |
| Content | Polygon feature class from the 67 scanned Royce maps, georeferenced against USGS 1:2,000,000 National Atlas layers and digitized as polygons; each polygon carries a cession map number (`CESSNUM`, range 1-741 in the metadata). | `[verified]` |
| Attribute table | A separate non-spatial table (layer 2) with **1,172 entries** and 41 fields: present-day tribe, citations, up to five Royce Schedule dates (`cessdate1`-`cessdate5`), links to the Schedule, to Kappler treaty text (`date1link_kappler_treaty` ... `date5link_kappler_treaty`), a federal statute link, an executive-order link, other-treaty link, map names/URLs, state, county, and "tribe named in land cessions, 1784-1894" (`schdtrb`). | `[verified]` (REST service page for layer 2) |
| Polygon count | **752** polygon features per Data.gov and the REST layer description; the agency metadata also says **718** vectors, while its lineage text says 752 `[disputed]`. E2 and `geodata-sources.csv` (GEO-001) record 718. Do not treat either as authoritative until counted from the downloaded data. | `[verified]` (the discrepancy) |
| Missing geometry | Seven cession IDs (47, 65, 128, 129, 130, 543, 690) have no spatial representation. Another 89 rows edited by the Office of Tribal Relations (cession IDs 69, 134, 172, 661, 690) were not reviewed by the NAGPRA Program. | `[verified]` |
| Formats | ArcGIS REST service (MapServer layers 0/1 polygons, 2 table; max record count 2,000; query formats JSON, GeoJSON, PBF); downloads via ArcGIS Hub: CSV, GeoJSON, KML, Shapefile (ZIP); ISO-19139 XML metadata; a file geodatabase feature class; georeferenced Royce scans as JPEG2000. | `[verified]` |
| Projection | Digitized in NAD83 Lambert Conformal Conic, then reprojected to WGS 1984 Web Mercator (EPSG:3857). | `[verified]` |
| License | Data.gov lists **CC BY 4.0**. The agency metadata says: "for informational purposes only... not legal documents and must not be used to determine title, ownership, legal boundaries, jurisdiction, or restrictions"; access constraints "None." The REST layer's copyright text is blank. | `[verified]`; conflict `[disputed]` |
| Size | Not stated on the pages read. | `[unverified]` |
| Update status | First published 2017-04-12; the Data.gov record says last updated 2022-08-29; agency metadata currency date 2018-04-19, status complete, planned updates "None." A second Data.gov record is the 2018 revision of a 2015 dataset; it revises and expands the first. Catalog check date shown as 2026-10-09. | `[verified]` |
| Limitations | Depicts Royce's 1890s view; seven missing polygons; no formal positional-accuracy statement; stops at 1894; the service's minimum display scale is 1:10,000,000, so it is generalized; one polygon can carry up to five dates, so the time slider needs a rule for multi-date cessions. | `[verified]` |
| URLs | https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer ; https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer-cf3ca ; https://apps.fs.usda.gov/ArcX/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/1 ; https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/2 ; https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml ; https://data-usfs.hub.arcgis.com/datasets/usfs::tribal-lands-ceded-to-the-united-states-feature-layer | `[verified]` |

**Recommendation.** Use as the primary 1784-1894 cession geometry layer, but (a) ask the Forest Service contact for written confirmation of the CC BY 4.0 reading, (b) count polygons after download, and (c) display the agency's disclaimer next to the layer.

### 2.3 Saunt, "Invasion of America"

| Attribute | Finding | Tag |
|---|---|---|
| What it is | Interactive time-lapse map of US acquisition of Native land, 1776-1887, by Claudio Saunt (University of Georgia), supplementing *West of the Revolution* (2014). Claims "over 1.5 billion acres." Built on the 1899 BAE (Royce) maps. Hosted via eHistory.org (a digital history collective Saunt and Stephen Berry started at UGA in 2011). | `[verified]` (eHistory about page, Open Culture, HNN, Civil Rights Teaching) |
| Launch | eHistory.org says it launched in 2015; an HNN article refers to the "June debut" and 90,000 unique viewers; I did not confirm the exact date. | `[disputed]` |
| Format | ArcGIS web app viewer (`usg.maps.arcgis.com`); a Carto account (`usg.carto.com/u/dsl`) appears in related searches and failed to load. | `[verified]` for the web app URL via Open Culture |
| License / data | **No download or license found.** eHistory's about page does not mention data downloads and lists admin@ehistory.org. | `[unverified]` |
| Institutional note | The task framing mentioned the University of Richmond Digital Scholarship Lab. The HNN page shows "With support from the University of Richmond" in a site banner and does not say that Richmond funded this project; no page I read ties Richmond to this map. E2 reaches the same conclusion. | `[unverified]` |
| Limitations | Saunt and Onion say many boundaries are vague; one commenter disputes the depiction of New York in 1776. | `[verified]` |
| Recommendation | Treat as a reference and model, not a data source. The openly licensed version of the same Royce digitization is the USFS layer (Saunt is credited as a collaborator). Contact eHistory before reusing any Invasion of America files. | |

### 2.4 Native Land Digital (NLD)

Details of the API integration are in E1. What I verified here:

| Attribute | Finding | Tag |
|---|---|---|
| Content | Three categories: territories, languages, **treaties**. Request types: full GeoJSON dumps, GET by position or name, POST by intersecting polygon, embedded maps; Mapbox tilesets and ArcGIS imports offered; the Mapbox tileset covers territories and updates daily. | `[verified]` (api-docs llms-full) |
| Treaties layer | **Undocumented** in every NLD page I read (no description of coverage, sources, dates or update frequency). A Big Ten Academic Alliance (BTAA) geoportal record titled "Treaties (Native Land Map)" says it is a JSON API pointing to a treaties file hosted on native-land.ca; the page was a browser verification screen and showed no licence. | `[verified]` (absence); `[unverified]` (content) |
| License | Two statements that do not match: the API metadata and the "about-and-disclaimers" page say **CC0**, with attribution "not required" but suggested; the Data Sovereignty Treaty (required to obtain a key) limits use to educational, research and non-commercial applications and Indigenous-led initiatives, requires attribution to Native Land Digital and acknowledgment of Indigenous communities as stewards, bars charging for access, bars storing or distributing data without permission, and bars altering boundaries without community consent. The FAQ says commercial products are not allowed and gives the credit line "Used with permission for educational and non-commercial purposes." | `[verified]`; conflict `[disputed]` |
| Access | Every request needs a free API key; the key requires agreeing to the Data Sovereignty Treaty. No numeric rate limits published. | `[verified]` |
| Update status | The about page says "daily or weekly"; first published 2015-02-01. | `[verified]` |
| Limitations | Not official or legal boundaries; "not meant or reasonably suited for academic or legal purposes"; "should not be used for legal claims, land disputes, or governmental decision-making"; no time dimension (E2). Territory polygons are contemporary Indigenous-informed representations, not treaty geometry. | `[verified]` |
| URLs | https://native-land.ca/ ; https://api-docs.native-land.ca/llms-full.txt ; https://api-docs.native-land.ca/about-and-disclaimers ; https://native-land.ca/about/faq | `[verified]` |

**Implication.** Redistributing or caching NLD data in a static site conflicts with the "storing or distributing data without permission" clause. Seek written permission before use, as E1 recommends. NLD should not be the cession layer, since it has no dates and is not treaty-derived.

### 2.5 Census TIGER/Line and Cartographic Boundary: AIANNH

| Attribute | Finding | Tag |
|---|---|---|
| Content | Current American Indian / Alaska Native / Native Hawaiian (AIANNH) areas, as part of TIGER/Line Shapefiles (vintages from 1992 to 2026, "as of January 1" of the vintage year; the 2026 files were released 2026-10-14) and as simplified Cartographic Boundary files. | `[verified]` for years and release date (TIGER/Line page); AIANNH inclusion `[from-memory]` (the AIANNH page and the TIGER2025 AIANNH directory failed to fetch) |
| Formats | TIGER/Line: Shapefile (2007 to present), ASCII (2006 and earlier). Cartographic Boundary AIANNH (2025 tab): Shapefile (1.4 MB) and KML (1.1 MB), 1:500,000 only; geodatabase and geopackage appear only as whole-scale bundles. | `[verified]` |
| License | The pages I read state no license. E2 records Data.gov language "not copyrighted," with acknowledgement of the Census Bureau and the "TIGER/Line" trademark. | `[verified]` for silence; E2 for terms |
| Update status | Annual vintages. | `[verified]` |
| Limitations | A statistical and legal-area **today** layer; it is not a treaty or cession layer, and Census describes the cartographic files as simplified for small-scale thematic mapping. Census boundaries are not legal land descriptions (point to BIA/BLM/tribal sources) `[from-memory]`. | `[verified]` (simplified); the rest `[from-memory]` |
| URLs | https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html ; https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html ; https://www2.census.gov/geo/tiger/TIGER2026/ | `[verified]` for the first two; third from the TIGER/Line page |

### 2.6 BIA and BLM

| Attribute | Finding | Tag |
|---|---|---|
| BIA OneMap / BIA Open Data Portal | BIA's geospatial hub (`onemap-bia-geospatial.hub.arcgis.com`), with the older `biamaps.geoplatform.gov/BIA-Opendata/` redirecting to it. Meta keywords: Tribal Land Data, BIE Data, BIA Geospatial Data, Web Maps, StoryMaps; author BIA's Branch of Geospatial Support (BOGS). The pages as fetched did not describe individual datasets, formats or licenses. | `[verified]` for what is stated; dataset details `[unverified]` |
| BIA Land Area Representations (LAR) | The national LAR dataset of Indian lands. A Data.gov record for it failed to load. E2 reports LAR as the authoritative "today" layer with explicit non-legal disclaimers. I did not read the LAR metadata myself. | `[unverified]` here; see E2 |
| BLM General Land Office (GLO) | **Not researched in depth.** The GLO land patent and survey-plat records (glorecords.blm.gov) are the source for the Land-Grab Universities database (2.9) `[verified]` via HCN; the GLO site, formats, licence and any cession-related layers were not examined. | `[unverified]` |
| Limitations | Today's layers, not historical. | |

### 2.7 OSU Tribal Treaties Database (TTD) and Kappler

| Attribute | Finding | Tag |
|---|---|---|
| What it is | Oklahoma State University Libraries portal to treaties, agreements and other documents (the browse categories include Executive Orders), built on OSU's digital edition of Charles J. Kappler's *Indian Affairs: Laws and Treaties* (7 vols.) and extended beyond Kappler. Browse by all documents, document type, tribe, key provisions (tags) and indexes (including Kappler's index and a comprehensive index). Partners: USDA, Department of the Interior, DoD Legacy Program. | `[verified]` |
| History | OSU started scanning Kappler vol. II in the mid-1990s and completed vols. IV-VII digitization in 2001. The TTD began in 2021 (the shareok record says launched June 2021; the About page says August 2021) `[disputed]`; a 2023 poster reports a second year with annotated provisions and improved interoperability. | `[verified]` |
| Scope | The shareok record and 2023 poster say 1778-1886 (the browse table also lists earlier colonial items from 1646 onward, including Nanfan 1701, Lancaster 1744, and Fort Stanwix 1768). E2 reports "300+ treaties 1778-1883" for phase 1. | `[verified]` |
| Record contents | Item records (on an Omeka S site) carry: date original, date proclaimed, original signatory tribe, **successor-in-interest tribes** (marked "under review" in places), Kappler citation (vol., page), identifiers (Kappler id such as `oksd_kap_v2_192`, **RIT number**, **NAID**), links to the NARA catalog, OSU Digital Collections (CONTENTdm "kapplers") and IDA, and a review status ("Needs further review"). The New Echota record shows a Cherokee Nation Attorney General's concern about the United Keetoowah Band as a successor in interest. | `[verified]` (two items) |
| Format | HTML pages and PDFs of Kappler pages. No API or bulk export stated. | `[verified]` (absence) |
| License | Not stated on pages read; Kappler volumes are US government publications; OSU asks that material be credited `[verified]` for the credit request; terms of the Disclaimer page not read. | `[unverified]` |
| Size | Total count not stated on the pages I read. | `[unverified]` |
| Limitations | The Kappler record lists can differ from NARA (the TTD includes unratified, colonial and other documents); two Kappler page numbers I extracted from slug IDs; the successor-in-interest field is a tribal-sovereignty-sensitive field, still under review. | `[verified]` |
| URLs | https://treaties.okstate.edu/ ; https://treaties.okstate.edu/about ; https://treaties.okstate.edu/treaties/ ; https://treaties.okstate.edu/indexes/kapplers-index ; https://oms.library.okstate.edu/s/oklahoma-built/item/5084 ; https://shareok.org/handle/11244/335881 ; https://shareok.org/handle/11244/337194 ; https://cdm17279.contentdm.oclc.org/digital/collection/kapplers/id/29354/rec/1 | `[verified]` |

The OSU library's older Kappler landing page and its LibGuide could not be retrieved (no match or robots restriction). The full TTD list for treaties after 1818 and the OSU document counts were not captured.

### 2.8 National Archives (NARA) and the IDA Treaties Explorer

| Attribute | Finding | Tag |
|---|---|---|
| What it is | The National Archives holds the original ratified Indian treaties (Microfilm Publication M668; series 1722-1869, 374 numbered items plus 19A and 143A). The **IDA Treaties Explorer** (digitreaties.org) presents them, a partnership of the NARA Office of Innovation and the Indigenous Digital Archive (Museum of Indian Arts and Culture, Santa Fe), funded by an anonymous donation. | `[verified]` |
| Record contents | Treaty number (RIT), title, location, creation date, ratification date (the instrument of ratification), tribes (named nation and present-day nation), signatory, NAID, related items (treaty, instrument of ratification, Senate advice and consent), and a "cessions with shared dates" field. Kappler and Stat. citations and proclamation date were **not listed** on the record I read. | `[verified]` (one record: RIT 118) |
| Formats | Web viewer of document scans; NARA Catalog entries by NAID. No bulk download or API stated. | `[verified]` (absence) |
| License | Not stated; US government records. | `[unverified]` |
| Size | 374 ratified treaties. | `[verified]` |
| Update status | Launched around October 2020 (a Kottke post dated October 15 with a /20/10/ URL; the year is inferred) `[unverified]`. | |
| Limitations | Ratified only (unratified are on separate NARA microfilm T494). | `[verified]` |
| What I built from it | `seed-data/nara-ratified-treaties-index.csv`: 376 rows (RIT number, date, NARA title, NAID, digitreaties.org URL, seed flag) from the NARA "catalog links" table. One NAID conflict (Fort Laramie 1868). | `[verified]` |
| URLs | https://digitreaties.org/ ; https://digitreaties.org/treaties/treaty/100378072 ; https://www.archives.gov/research/native-americans/treaties ; https://www.archives.gov/research/native-americans/treaties/catalog-links | `[verified]` |

### 2.9 UNL American Indian Treaties Portal

| Attribute | Finding | Tag |
|---|---|---|
| What it is | University of Nebraska-Lincoln Center for Digital Research in the Humanities (CDRH) and UNL Libraries; Principal Investigator Charles Bernholz. Treaty texts and a Kappler map companion; originally published 2008-2014; a static version launched June 2025. Companion essay: 375 recognized treaties were made before 1871, and nine are not in the Statutes at Large volumes. | `[verified]` |
| Format | Data hosted on GitHub in the CDRH `data_earlytreaties` repository, downloadable as a zip; the file format is not stated (the repository page itself failed to load). | `[verified]` (statement); format `[unverified]` |
| License | Original content **CC BY-NC-SA 3.0**; the historic records are public domain. | `[verified]` |
| Size / count | 375; OSU hosts 366 of the final texts, per UNL. | `[verified]` |
| Limitations | The NC and SA terms on the original content could constrain reuse in a public site with donation links; check whether the atlas would copy UNL's own transcriptions or only link. The count methodology is not explained on the info page. | `[verified]` (terms); the implication is my analysis |
| URLs | https://treatiesportal.unl.edu/ ; https://treatiesportal.unl.edu/info.html ; https://treatiesportal.unl.edu/kapplermap/index.html ; https://github.com/unl-cdrh/data_earlytreaties (not retrieved) | |

### 2.10 Library of Congress: Statutes at Large; Avalon; OU Law Library

| Source | Contents | Format / license / status | Limitations | Tag |
|---|---|---|---|---|
| **LOC Statutes at Large** | Official source for Stat. cites, including treaties with Indian tribes and foreign nations (volumes 1-64, 1789-1951 in the volume table; separate volumes for Indian and foreign treaties 1789-1845). | Page images and text; the collection page states no rights terms and says the web collection "is in process." https://www.loc.gov/collections/united-states-statutes-at-large/about-this-collection/ | Incomplete web version; I used OCR volume indexes from dheller.org, which carry OCR errors. | `[verified]` |
| **Avalon Project (Yale Law Lillian Goldman Library)** | Index of 30 Native American treaty documents dated 1778-1868 over 22 years (Delawares, Six Nations, Wyandot, Cherokee, Chickasaw, Choctaw, Shawnee, Creeks, Oneida, Potawatomi, Apache, Comanche, Kiowa, Cheyenne, Arapaho, plus Chickasaw peace-treaty feeler and journal materials). | Text; "(c) 2008 Lillian Goldman Law Library," no license stated; Kappler not named as a source. https://avalon.law.yale.edu/subject_menus/ntreaty.asp | A selection, not a corpus; useful for readable texts and teaching. | `[verified]` |
| **OU Law Library, Native American Constitution and Law Digitization Project (Thorpe)** | Cooperative project of the OU College of Law Library and the Native American Rights Fund's National Indian Law Library (began 1996): tribal constitutions, codes, Cohen's Handbook (old edition chapters), Indian lands treatises, Solicitor's opinions, research guides. I read the Cohen-style chapter on Indian treaties (PDF). | PDF/HTML; "provided for scholarship and informational purposes only"; use sources for authority. https://thorpe.law.ou.edu/ | Treaties are **not** listed as a collection; its holdings of treaty texts were not found. | `[verified]` (site description), holdings `[unverified]` |

### 2.11 Land-Grab Universities (High Country News)

| Attribute | Finding | Tag |
|---|---|---|
| What it is | Database from the HCN investigation by Robert Lee and Tristan Ahtone (April 2020; follow-up August 2020) of how land taken from tribal nations funded land-grant universities under the Morrill Act of 1862. About 80,000 parcels; primary source is the BLM General Land Office database plus patents and congressional documents. | `[verified]` |
| Formats / license | CSV and shapefiles on GitHub; Open Database License (ODbL) and CC BY-SA 3.0 (share-alike). | `[verified]` |
| Limitations | Not a cession dataset; some data were transcribed by hand; share-alike terms may bind derivative products. E2 reports 162 cession polygons matched to about 79,461 parcels. | `[verified]`; E2 for the match |
| URL | https://landgrabu.org/ | `[verified]` |

### 2.12 Oklahoma Historical Society (OHS)

I looked for an OHS treaty or cession-map resource and **did not find one.** The OHS homepage and its Native American history page do not mention cession maps or treaty resources. They link to archival collections (American Indian Records, Maps) and PDF manuscript guides by tribal nation and by topic, which I did not open. No claim is made that OHS holds none. `[unverified]` Oklahoma materials more likely to matter are the Five Tribes records and the Indian Territory land-allotment records, which should be sought from OHS, the National Archives (Fort Worth) and tribal archives `[from-memory]`.

## 3. Crosswalk and data model recommendations

| Atlas object | Primary key | Secondary keys | Best source |
|---|---|---|---|
| Ratified treaty | NARA NAID (and RIT number) | Stat. cite; Kappler volume/page; OSU Kappler id; IDA URL | `nara-ratified-treaties-index.csv`; IDA; OSU |
| Cession geometry | USFS/Royce `cessnum` | Royce Schedule date(s) (up to five); Kappler link; statute link; executive-order link | USFS layer + attribute table |
| Unratified treaty | Heizer letter (California); otherwise NARA T494 file reference | Kappler vol. II unratified section; OSU record | Heizer 1972; OSU |
| Agreement (post-1871) | Stat. cite of the ratifying statute | Royce cession number if before 1895 | Statutes at Large; Royce Schedule |
| Current reservation | BIA LAR id / Census GEOID | Tribal name (endonym from tribe) | BIA LAR; TIGER AIANNH |
| Successor nation | Tribal government's own identification | OSU successor-in-interest field | Tribal sources first; OSU as pointer |

Tasks to complete the crosswalk: (1) download the USFS table and extract the Kappler links to build the `cessnum` <-> Kappler page map; (2) match Kappler pages to RIT numbers using the OSU identifiers; (3) extend `treaties-seed.csv` with a `royce_cession_number` column once (1) and (2) are done (E2 makes the same recommendation).

## 4. Licensing flags (for the project owner)

1. **USFS ceded lands.** CC BY 4.0 (Data.gov) vs. "informational only / not legal documents" (agency metadata). The two are compatible if "informational only" is read as a disclaimer, not a use restriction; the access constraint says "None." Confirm with the agency contact.
2. **Native Land Digital.** CC0 (metadata) vs. Data Sovereignty Treaty restrictions (non-commercial; attribution; API key; no storing or distributing without permission). The stricter terms govern anyone who obtains a key. Ask for written permission before bundling any NLD data into static files.
3. **UNL Treaties Portal.** CC BY-NC-SA 3.0 on original content; historic records public domain.
4. **Land-Grab Universities.** ODbL and CC BY-SA 3.0: share-alike.
5. **Everything else** (Royce, NARA, Kappler, Statutes at Large): US government or public-domain material, but OSU and UNL transcriptions, indexes and annotations may carry their own terms. Link rather than copy their added value unless permission is given.
6. **Indigenous data governance.** Datasets that carry tribal names, territory boundaries or successor-in-interest assignments (NLD, OSU) should be presented as pointers pending tribal review. See G3.

## 5. Recommended stack for the treaty layer

1. Cession geometry: USFS Royce layer (self-hosted vector tiles derived with attribution and the disclaimer).
2. Treaty records: NARA NAID spine plus OSU Kappler identifiers; link out to IDA, OSU and NARA for scans.
3. Unratified treaties: California 18 from Heizer, geometry only if Royce's maps are digitized for them (not yet).
4. Today layer: BIA LAR and Census AIANNH.
5. Territories and languages: NLD by API only, under its terms and with permission; never as a historical layer.
6. Do not present Royce polygons as "land that was legally ceded"; label them "land the US recorded as ceded in 1899."

## Sources

Consulted (fetched or surfaced in a search this session):
- LOC, Royce item: https://www.loc.gov/resource/g3701em.gct00002/?sp=26 ; LCCN record: https://lccn.loc.gov/13023487/mods
- Smithsonian Libraries and Archives repository record: https://repository.si.edu/handle/10088/91692 (PDF bitstream fetch failed)
- USFS ceded lands: https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer ; https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer-cf3ca ; https://apps.fs.usda.gov/ArcX/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/1 ; https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/2 ; https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml ; https://data-usfs.hub.arcgis.com/datasets/usfs::tribal-lands-ceded-to-the-united-states-feature-layer
- Invasion of America: https://ehistory.org/about ; https://historynewsnetwork.org/article/156879 ; https://www.openculture.com/2018/05/interactive-map-shows-the-seizure-of-over-1-5-billion-acres-of-native-american-land-between-1776-and-1887.html ; https://civilrightsteaching.org/resource/invasion-of-america
- Native Land Digital: https://native-land.ca/ ; https://api-docs.native-land.ca/llms-full.txt ; https://api-docs.native-land.ca/about-and-disclaimers ; https://native-land.ca/about/faq ; BTAA records https://geo.btaa.org/catalog/a4d43715-a2cf-4a1b-bbe8-6b9e7c461cd2 and https://geo.btaa.org/catalog/13bf5708-e27e-42aa-8bb5-93172d7c5f69
- Census: https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html ; https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html (TIGER2025 AIANNH directory blocked by robots rules; AIANNH guidance page failed to fetch)
- BIA: https://biamaps.geoplatform.gov/ ; https://biamaps.geoplatform.gov/BIA-Opendata/ ; https://onemap-bia-geospatial.hub.arcgis.com/ (LAR Data.gov record failed to fetch)
- OSU Tribal Treaties Database and Kappler: https://treaties.okstate.edu/ ; https://treaties.okstate.edu/about ; https://treaties.okstate.edu/treaties ; https://oms.library.okstate.edu/s/oklahoma-built/item/5084 ; https://oms.library.okstate.edu/s/oklahoma-built/item/4845 ; https://shareok.org/handle/11244/335881 ; https://shareok.org/handle/11244/337194 ; https://cdm17279.contentdm.oclc.org/digital/collection/kapplers/id/29354/rec/1 (FAQ page failed to fetch)
- IDA / NARA: https://digitreaties.org/ ; https://digitreaties.org/treaties/treaty/100378072 ; https://www.archives.gov/research/native-americans/treaties ; https://www.archives.gov/research/native-americans/treaties/catalog-links ; https://kottke.org/20/10/a-new-online-archive-of-374-treaties-between-indigenous-peoples-and-the-united-states
- UNL Treaties Portal: https://treatiesportal.unl.edu/info.html ; https://treatiesportal.unl.edu/kapplermap/index.html (GitHub repository fetch failed)
- LOC Statutes at Large: https://www.loc.gov/collections/united-states-statutes-at-large/about-this-collection/ ; OCR volume indexes at https://dheller.org/Timeline-files/US-Statutes/
- Avalon Project: https://avalon.law.yale.edu/subject_menus/ntreaty.asp
- OU Law Library project: https://thorpe.law.ou.edu/ ; https://thorpe.law.ou.edu/cohen/3cohen33.pdf
- Land-Grab Universities: https://landgrabu.org/
- Oklahoma Historical Society: https://www.okhistory.org/ ; https://www.okhistory.org/learn/native-history
- Other agents' files, same repository: `docs/data/E1-native-land-api-integration.md`, `docs/data/E2-geodata-source-inventory.md`, `seed-data/geodata-sources.csv`

## Confidence & Gaps

**Confidence: medium.** Royce, USFS, NLD and UNL details are verified from the pages read. BIA, Census AIANNH, BLM and OSU TTD details are partial.

**Not verified or not done:**
1. **BLM GLO** (records, formats, licenses, any cession-related layers) was not researched in depth.
2. **BIA LAR**: I could not retrieve its metadata (formats, license, update cadence, disclaimers); rely on E2.
3. **Census AIANNH**: the dedicated guidance page and the TIGER2025 AIANNH directory could not be fetched; license and layer contents are from E2 and memory.
4. **Invasion of America**: no data download or license found; the Richmond Digital Scholarship Lab attribution is unconfirmed; the Carto source failed to load; exact launch date unconfirmed.
5. **OSU TTD**: the total document count, the full list after 1818, the license and Disclaimer terms, and any bulk export were not captured. The relationship between the TTD, OSU's older Kappler site and the CONTENTdm collection was not fully mapped.
6. **UNL data**: the GitHub repository could not be read, so file formats, field names and coverage of the nine Statutes-absent treaties are unknown.
7. **NLD treaties layer**: undocumented (coverage, sources, dates, update cadence). Do not describe it in the product until NLD documents it or confirms in writing.
8. **OU Law Library** and **Avalon** holdings of treaty texts: Avalon's 30-entry index was read; OU's treaty holdings were not found.
9. **Oklahoma Historical Society**: no cession-map or treaty resource found on the pages read; archival collections not opened.
10. **Royce details**: the page-range discrepancy (521-997 at LOC vs. 521-964 at the Smithsonian), the 1899 vs. 1902 date, and the USFS polygon count (752 vs. 718) need checking against the files themselves.
11. **Positional accuracy** of the georeferenced polygons is not quantified anywhere I read.
12. WebSearch quota was exhausted partway through the session, which limited discovery of additional datasets (for example state-level cession maps, Indian Claims Commission maps, and the Library of Congress Royce georeferenced products).
