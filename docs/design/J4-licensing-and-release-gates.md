---
title: Data Licensing and Attribution Matrix, with Release-Gating Checklist
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# J4. Licensing, Attribution, and Release Gates

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

Design Agent J, file 4 of 6. Companions: J1, J2 (NLD detail), J3 (CI that enforces the gates), J5 (roadmap), J6.

**This is a project-planning document, not legal advice.** License readings below restate what the research files found; where sources conflict, the conflict is the finding. A person with legal expertise should review the final attribution and the site's own license terms (decision D-07).

Tags: `[verified]` = confirmed in a source read by a research agent (E1, E2, A3, G1, G2) or fetched this session; `[from-memory]`; `[disputed]`; `[unverified]`.

**Release rule (owner's instruction):** *nothing ships until each license question is resolved.* "Resolved" means: a gate below is `cleared` with evidence stored under `docs/release/`, or the dependent layer is removed from the release. The build enforces this in production mode (J3 section 4.2).

---

## 1. Two kinds of gates

| Level | Meaning | Where it applies |
|---|---|---|
| **Preview gate (P)** | Allowed in a private repo, local builds, and `SITE_STAGE=preview` builds with `noindex`. Prevents bad habits (key leakage, hot-linking) and keeps the architecture ready | Phases 1-6 |
| **Public gate (L)** | Required before `SITE_STAGE=production` and `PAGES_DEPLOY_ENABLED=true` | Phase 7 |

Some gates are about licenses; the last group (content gates) are about consultation, legal review, and safety. They are listed together because the owner said nothing ships until the questions are resolved.

---

## 2. Matrix: every data source, font, and component

Columns: what we use it for, stated terms, conflict or risk, required action, exact attribution to display, gate id.

### 2.1 Geometry and boundary data

| Source | Use in the atlas | Stated terms | Conflict / risk | Required action | Attribution text (draft) | Gate |
|---|---|---|---|---|---|---|
| **USFS "Tribal Lands Ceded to the United States"** (georeferenced Royce maps, 1784-1894) | Primary cession geometry and time slider | Data.gov (both listings): **CC BY 4.0**. Agency metadata XML: use constraints "informational purposes only", access constraints "None", no explicit open license, "informational purposes only... not legal documents and must not be used to determine title, ownership, legal boundaries, jurisdiction" [verified, E2/A3] | **License conflict** (E2 [disputed]; A3 reads the "informational only" text as a disclaimer, not a restriction). Also: polygon count 718 vs 752 [disputed]; 7 cession IDs lack geometry; 89 attribute rows edited by the Office of Tribal Relations not reviewed by the NAGPRA Program; no positional accuracy statement; last updated 2022, no updates planned | **Ask the USFS data contact in writing** (Data.gov lists Rebecca Hill, Office of Tribal Relations [verified, E2]): (1) confirm CC BY 4.0 applies to the geometry and the attribute table; (2) confirm that derived, simplified, re-projected redistribution in a public website is permitted; (3) which polygon count is authoritative; (4) is there a newer version. Store reply in `docs/release/usfs-license-reply.md`. Count polygons after download | "Boundary data: Tribal Lands Ceded to the United States, USDA Forest Service (Geospatial Service and Technology Center; Office of Tribal Relations), based on C. C. Royce, Indian Land Cessions in the United States (1899). Modified by Benjamin Life (@omniharmonic): re-projected, simplified, dates and legal types derived. Licensed CC BY 4.0 [as confirmed]. Not a legal document; do not use to determine title, ownership, boundaries, or jurisdiction." (CC BY 4.0 requires indicating changes `[from-memory]`) | **G-01** (L) |
| **Library of Congress / BAE: Royce, *Indian Land Cessions in the United States* (1899)** | Citation of record; link-outs to scans; maybe thumbnails | LOC: public domain, free to use and reuse, credit "Law Library of Congress" [verified, E2/A3]. Smithsonian repository: "No Copyright, United States (NoC-US 1.0)" [verified, A3] | Page range/date discrepancies between LOC and Smithsonian records (cosmetic) | Link, do not rehost 100 MB PDF. If any scan image is shown, include LOC credit line | "Source: Royce (1899), Library of Congress, Law Library of Congress." | G-03 (L): confirm credit line wording |
| **Census TIGER/Line / Cartographic Boundary AIANNH** ("today" layer) | Present-day reservations context layer | "Not copyrighted", free, acknowledge Census Bureau; "TIGER/Line" is a registered trademark [verified, E2]; Cartographic Boundary AIANNH 2025 shapefile 1.4 MB, 1:500,000 only [verified, A3] | Boundaries are **statistical**, not legal land descriptions; do not determine jurisdiction or entitlement [verified]. Not legal. Trademark use | Choose the cartographic (generalized) file for v1 (decision D-21); display the Census disclaimer; do not use the TIGER/Line trademark as a product name | "Present-day boundaries: U.S. Census Bureau, Cartographic Boundary Files (American Indian/Alaska Native/Native Hawaiian Areas), [vintage]. Statistical boundaries; not legal land descriptions." | **G-04** (L) |
| **BIA Land Area Representation (LAR)** | Optional later "today" layer (closer to legal extent than Census) | Public information with "restrictions on appropriate use"; illustrative/reference only; "No legal inference can or should be made"; BIA recommends obtaining data directly from BIA because copies may be altered; national LAR is REST-only [verified, E2] | Republishing a derived snapshot may conflict with BIA's guidance | **Do not ship in v1.** If wanted later, ask `geospatial@bia.gov` (listed contact [verified, E2]) whether a derived snapshot is acceptable, or query BIA live | "Source: Bureau of Indian Affairs, Land Area Representation" + BIA disclaimer | **G-05** (optional; not needed for launch) |
| **Native Land Digital** (territories, languages, treaties) | Tier 0 outbound link and acknowledgement (v1). Live lookup/snapshot only with permission | Data Sovereignty Treaty (non-commercial; no charging; no altering boundaries without community approval; no misrepresentation; derivatives must acknowledge; "no storing or distributing API data without explicit permission"; revocation and legal action possible) vs "CC0" label [verified, E1]. FAQ credit line "Used with permission for educational and non-commercial purposes" [verified, A3] | **License conflict** [disputed]; CORS unknown; treaties layer undocumented; no time dimension | Tier 0 needs no permission. Anything above Tier 0 needs written permission per J2 s.6-7 (draft email in J2 s.7). Keep NLD out of repo, build output, and cache | Per J2: credit line + disclaimer + acknowledgement + separation note beside every NLD-derived result. Tier 0: "Native Land Digital (native-land.ca) is an Indigenous-led nonprofit; its maps do not represent official or legal boundaries." | **G-02** (L for any tier >= 1; Tier 0 passes with attribution text approved) |
| **HCN "Land-Grab Universities" data** | Optional case-study layer (Tour G: Morrill Act) | ODbL/CC BY-SA wording appears on landgrabu.org and in the repo README, not on the hcn.org article page (which states no data license; its article text is CC BY-NC-ND 4.0); the repo LICENSE file and sidebar are CC0 1.0 [disputed across E2, A3, G1; conflict confirmed by V3] | **Share-alike** terms could bind derivative databases and content; unclear which instrument applies | **Do not ship until** (1) the repository LICENSE file is read directly, (2) HCN is asked (landgrabu@hcn.org, listed in README [verified, E2]) which terms apply to the shapefiles and CSVs, (3) a lawyer confirms whether showing it as a separate layer (a "Produced Work") avoids merging it into the atlas database. Keep in a separate file and layer; never merge into the atlas graph | Per HCN's instruction once clarified; at minimum credit "High Country News, Land-Grab Universities" with license name and link | **G-06** (L if the feature is built; else n/a) |
| **Invasion of America (Saunt)** | None. Reference/UX model only | No download or license found [verified, E2/A3] | Copying visuals or data is not cleared | Link out only; do not copy visuals; ask eHistory/Saunt if a dataset is ever wanted | none | n/a (documented as not used) |
| **Newberry Atlas of Historical County Boundaries** | Optional backdrop for state/territory context in later phases | Collections available for any lawful purpose without license or permission fees, subject to the Newberry's rights-and-reproductions page; no citation requirement stated [verified, E2] | Rights page not read; large data | Read the Newberry rights page before use; cite anyway. Extract state/territory polygons only (E3) | "Boundary data: Atlas of Historical County Boundaries, The Newberry Library." | **G-07** (L if used) |
| **PAD-US, BLM Alaska, ANCSA boundaries, Esri layers** | Not used in v1 | PAD-US terms not stated on page; BLM: as is, cite BLM; ADNR: cite source, no open license named [verified, E2] | Different legal regime (Alaska), explicit non-change-over-time limits (PAD-US) | Not in v1 | none | n/a |

### 2.2 Treaty text, records, and citations (no geometry)

| Source | Use | Stated terms | Risk | Action | Attribution | Gate |
|---|---|---|---|---|---|---|
| **Kappler, *Indian Affairs: Laws and Treaties*; Statutes at Large; NARA treaty originals** | Citations; links; short factual extracts as needed | US government publications; public domain `[from-memory; G1 says public domain under 17 USC 105]`; NARA page states no reuse terms and says to check each catalog record [verified, E2] | Added value (OSU transcription/annotation, IDA interface) may carry terms | Cite and link; do not copy long text blocks. If the site displays treaty text, take it from a public-domain source with clear provenance and have the legal reviewer confirm | "Citation: Kappler vol./page; 7 Stat. ___; NARA NAID ___." | **G-08** (L) |
| **OSU Tribal Treaties Database** | Link target; successor-in-interest pointers (flagged "under review") | No license or API stated; OSU asks for credit; disclaimer page not read [verified, E2/A3] | Scraping is not authorized; successor-in-interest is sovereignty-sensitive | **Link only.** Ask lib-dls@okstate.edu (listed [verified, E2]) before any bulk reuse; never copy successor determinations as fact | "Treaty text and indexes: Tribal Treaties Database, Oklahoma State University Libraries." | **G-09** (L) |
| **DigiTreaties / IDA Treaties Explorer** (MIAC with NARA) | Link target to scans; possible partner | No license/API stated; contact info@native-docs.org [verified, E2] | Hot-linking scan images is not authorized | Link only; ask before embedding images or reusing metadata; G1 lists it as a collaboration invitation | "Scans and records: Indigenous Digital Archive, Museum of Indian Arts and Culture, with the U.S. National Archives." | G-09 |
| **UNL American Indian Treaties Portal** | Link target | Original content **CC BY-NC-SA 3.0**; historic records public domain [verified, A3] | NC and SA terms could constrain use on a site with donation links; we would not copy UNL transcriptions | **Link only.** Do not copy UNL transcriptions or annotations | "Treaties Portal, University of Nebraska-Lincoln (CDRH)." | G-09 |
| **Avalon Project, OU Thorpe, Smithsonian NMAI "Nation to Nation"** | Link-outs and teaching references | Avalon: (c) Lillian Goldman Law Library, no license stated; OU: scholarship and information only; NMAI: no data/online resource [verified, A3/E2] | Copying text | Link only | Credit as source of the link | G-09 |
| **Case law (Justia, Oyez, LII, LOC), Cohen's Handbook, scholarly works** | Citations and links; our own plain-language summaries | Court opinions are public domain; hosting sites' compilations may have terms; Cohen/scholarly works copyrighted [from-memory] | Quoting length | Short quotes with citations only (fair use is a legal question: legal reviewer); link rather than copy | Full Bluebook citation + link | G-08 |
| **Research seed CSVs (this project)** | Core tables | Authored by research agents for this project; contents summarize public sources; contain `[from-memory]` items | Unverified cites; no tribal review | Verification wave must run first (D-15); badges for unverified items | n/a (project-owned) | **G-12** content gate |

### 2.3 Basemap, fonts, software

| Component | Terms | Action | Attribution | Gate |
|---|---|---|---|---|
| **OpenFreeMap** (basemap) | Software MIT; map data OpenStreetMap (ODbL); attribution required (MapLibre adds it automatically); no registration or limits stated; commercial use allowed; no SLA [verified, openfreemap.org] | Keep attribution control visible; disclose that tile requests reveal visitor IP to the provider (privacy page). Recheck terms before launch | "OpenFreeMap (c) OpenMapTiles. Data from OpenStreetMap." (required text if not using MapLibre's control) | **G-10** (L) |
| **OpenStreetMap data** | ODbL; attribution "(c) OpenStreetMap contributors" | Covered by the basemap control; Produced-Work notice in `NOTICE.md` | as above | G-10 |
| **Protomaps basemap (fallback)** | ODbL Produced Work; OSM attribution; docs discourage hotlinking daily builds and recommend copying to own storage [verified, E3] | Only if switched; copy an extract to own R2 bucket | "Protomaps (c) OpenStreetMap contributors" | G-10 (if used) |
| **OpenStreetMap standard tiles** | Policy discourages heavy use, bulk, and donation-seeking services [verified, E3] | **Not used** | n/a | n/a |
| **Fonts** (Noto Sans/Serif via Fontsource) | SIL Open Font License 1.1 `[from-memory]` | Self-host; include license files in `public/fonts/LICENSES/`; verify each font's actual license in its package | "Fonts: Noto, SIL OFL 1.1" in `NOTICE.md` | **G-11** (L) |
| **npm dependencies** (MapLibre BSD-3, Astro MIT, Svelte MIT, Pagefind MIT, d3 ISC, Mapshaper MPL-2.0 build-time, Zod MIT, Playwright Apache-2.0 [observed licenses via npm, 2026-10-16]) | Permissive; MPL-2.0 only in build tooling | CI license audit (J3 s.3.5); generate `NOTICE.md` from lockfile | `NOTICE.md` and `/about/credits` page | G-11 |
| **Cloudflare Worker / R2** (only if used) | Cloudflare terms; free-tier limits [verified] | Only after need arises | n/a | n/a |

### 2.4 The project's own outputs (owner decision D-03)

| Item | Recommended default | Why |
|---|---|---|
| Code | MIT or Apache-2.0 (owner choice) | Permissive, compatible with dependencies |
| Original text and the project's compiled data | CC BY 4.0 with the attribution line "Benjamin Life (@omniharmonic)" | Matches the open posture of USFS (CC BY 4.0) and invites reuse with credit. If HCN data (share-alike) is ever included, revisit compatibility |
| Derived geometry from USFS | CC BY 4.0 inherited; credit USFS as above | CC BY allows adaptation with attribution and change notice |
| Anything from NLD | Not licensed by the project; never redistributed | J2 |
| Tribal-contributed text and data | Under the terms the nation agrees in writing (CARE/OCAP-informed; do not claim "OCAP compliance", G3 s.1.2); never defaults to CC | G3 |
| Trademarks | Do not use "TIGER/Line" or "OCAP" as product names or imply endorsement | E2, G3 |

Footer credit pattern: "Created by Benjamin Life (@omniharmonic). Data credits and licenses: see Credits." Per the brief, never attribute to OpenCivics or OpenCivics Labs (V15 in J3 checks for this).

---

## 3. Registry file

Each row above becomes an entry in `data/licenses/registry.yaml` (schema in J3 s.4.2) with: `id`, `status` (`pending` at project start for G-01, G-02, G-04, G-06, G-07, G-08, G-09, G-10, G-11), `evidence` path, `attribution_text`, `used_in`, `gate`. `NOTICE.md` and the `/about/credits` page are generated from this file so the attribution text on the site is always the cleared text.

---

## 4. Release-gating checklist

Check each box only with evidence stored in `docs/release/`. "Owner" is who acts; "Blocks" is the earliest phase that cannot complete without it.

### 4.1 License and terms gates

| ID | Gate | Resolved when | Owner | Evidence | Blocks |
|---|---|---|---|---|---|
| **G-01** | USFS Royce layer license | Written confirmation (or documented independent reading accepted by the legal reviewer) that CC BY 4.0 applies and derived redistribution is allowed; polygon count authority recorded | Owner (sends); legal reviewer (confirms) | `docs/release/usfs-license-reply.md`, Data.gov record snapshot (date, URL, license field) | Public launch (P-gate: not blocking private work) |
| **G-02** | Native Land Digital | Either (a) Tier 0 only, with attribution text approved by the owner and checked against NLD's published guidance; or (b) written NLD permission recorded for the chosen higher tier, `PermissionRecord` set in config | Owner | `docs/release/nld-permission.md` or `nld-tier0-decision.md` | Public launch; Tier 1+ features |
| **G-03** | LOC Royce credit line | Credit line and rights statement confirmed at the LOC item page | Agent drafts; owner confirms | Page snapshot | Public launch |
| **G-04** | Census "today" layer | Vintage chosen; disclaimer and acknowledgement text added; trademark rule observed | Agent + owner | `PROVENANCE.md` row | Public launch |
| **G-05** | BIA LAR (only if used) | BIA written OK for derived snapshot, or live-query design | Owner | reply | Only the BIA feature |
| **G-06** | HCN Land-Grab data (only if used) | LICENSE file read; HCN reply; lawyer confirms separate-layer approach | Owner + legal reviewer | reply + note | Only the Land-Grab feature (Tour G, optional) |
| **G-07** | Newberry data (only if used) | Rights page read; attribution set | Agent | note | Only that feature |
| **G-08** | Treaty/case/statute text and quotations | Policy that only short quoted extracts with citations are used; legal reviewer confirms; any displayed full text sourced from a public-domain original | Legal reviewer | policy doc `docs/governance/quotation-policy.md` | Public launch |
| **G-09** | Third-party scholarly portals (OSU, IDA, UNL, Avalon, NMAI) | Decision recorded: link-only; no scraped text or images; optional courtesy notices sent | Owner | decision log entry | Public launch |
| **G-10** | Basemap | OpenFreeMap terms rechecked on the day; attribution visible in production build; privacy disclosure published; fallback rehearsed | Agent + owner | screenshot, config test | Public launch |
| **G-11** | Software and fonts | CI license audit passes; `NOTICE.md` generated; font license files included | Agent | CI report | Public launch |
| **G-13** | The project's own license | D-03 decided; LICENSE, LICENSE-DATA, CITATION.cff present with Benjamin Life attribution | Owner | files | Public launch |

### 4.2 Content and governance gates (consultation, legal, safety)

| ID | Gate | Resolved when | Owner | Evidence | Blocks |
|---|---|---|---|---|---|
| **G-12** | Verification wave | All `[from-memory]` Stat./Kappler cites in displayed rows verified or visibly badged (decision D-15); NARA spine reconciled; Fort Laramie 1851 numbering checked | Verification agent / owner | `verification/` reports | Public launch |
| **G-14** | Governance documents | Charter, data policy, corrections/removal policy, AI policy, and donation policy published before any outreach (G3 s.3.2 step 1) | Owner | `docs/governance/` + live pages | Tribal outreach; public launch |
| **G-15** | Tribal advisory | Advisory approach decided; invitation letters sent through proper offices; compensation terms agreed; each featured nation's `review_status` shown; nation-specific narrative and counterfactual content only where status allows (G3 s.3.3) | Owner | contact log (private), MOUs (private), public status badges | Public launch of nation pages and counterfactuals |
| **G-16** | Legal review | Federal Indian law reviewer has signed off on: vocabulary page, evidence categories E0-E7, legal-status taxonomy S1-S9 and panel language, "not legal advice" copy, and site terms/privacy | Legal reviewer | sign-off note with date and reviewer role | Phase 4 public release; Public launch |
| **G-17** | Charitable-solicitation review | Lawyer licensed in the owner's state confirms the donation-link framing and that no payments are processed (F4 s.6.4) | Legal reviewer | note | Phase 5 public release |
| **G-18** | Sensitive-content review | V13 report reviewed: no sacred-site, burial, or withheld locations; sensitivity tiers assigned | Owner + tribal advisors | report | Public launch |
| **G-19** | Accessibility | Phase 6 audit complete; blocking issues fixed; accessibility statement published | Agent + external testers | `docs/release/a11y-audit-<date>.md` | Public launch |
| **G-20** | Corrections and takedown readiness | Steward named; public email/form live; tribal channel live; `suppress.yaml` flow rehearsed with a test removal | Owner | rehearsal log | Public launch |
| **G-21** | Privacy | Privacy page matches actual third-party requests (OpenFreeMap only); no cookies; analytics decision recorded | Agent | Playwright network assertion | Public launch |

### 4.3 How gates are used by phase

- **Phases 1-6 (private):** work proceeds with P-level rules: no NLD data or keys in the repo, `SITE_STAGE=preview`, `noindex`, repository private.
- **Phase 7 (launch):** every L gate above must be `cleared`, or the dependent layer/feature must be removed from the launch build. `npm run release:check` (a script wrapping `data:validate --mode=production`) prints a table of gates and statuses; launch is allowed only when it prints no `pending` or `blocked` rows for features present in the build. A copy of the final table is saved to `docs/release/launch-gate-table-<date>.md`.

---

## 5. Attribution blocks to render (single source: the registry)

1. **Footer (every page):** "Created by Benjamin Life (@omniharmonic). Not a legal resource; see Credits for data sources and licenses."
2. **Map attribution control:** USFS/Royce, Census, OpenFreeMap/OSM strings from the registry.
3. **Layer panel:** each layer lists source, date/vintage, license, and the disclaimer text.
4. **Entity pages:** "How we know" block with the citation chain and confidence flags.
5. **Share cards / exports:** lineage line plus "not a legal boundary" (G2 s.10).
6. **Credits page:** generated table from the registry, including MapLibre and other required notices, and a "What we did not use and why" list (Invasion of America, UNL transcriptions, NLD data above Tier 0).

## Sources

E1, E2, A3 (licensing flags s.4), G1 s.18 (licensing matrix) and s.19 (collaboration invitations), G2 s.9 (corrections), G3 s.1-3 and s.12, F4 s.6.4; fetched this session: OpenFreeMap terms, GitHub Pages limits, Cloudflare R2/Pages pages, WCAG 2.2 (see J1 Sources); npm license fields via `npm view`.

## Confidence & Gaps

Confidence: medium. The matrix inherits the research files' findings; the site-wide license recommendations (code, data) are proposals. Not verified in this session: the USFS metadata and Data.gov pages themselves (relied on E2/A3), NLD pages (sandbox could not reach them), HCN repository LICENSE file, Newberry rights page, font package licenses, CC BY 4.0 change-notice wording (from memory), public-domain status of Kappler under 17 USC 105 (from memory), and the compatibility of CC BY-SA 3.0 content with a CC BY 4.0 project license (from memory; lawyer to confirm).
