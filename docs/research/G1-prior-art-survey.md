---
title: Prior Art Survey for the Treaty Land Atlas (counterfactual maps, cession time-lapse, and treaty education)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# G1. Prior Art Survey

**Research agent:** G (methodology, ethics, comparable projects). **Companion files:** G2 (counterfactual methodology), G3 (ethics and Indigenous data governance), G4 (pedagogy and narrative arcs).

**Scope.** This file surveys comparable and adjacent projects so the Treaty Land Atlas learns from them. For each project it records what it is, who stewards it, what it does well, what it does poorly or leaves unaddressed, licensing/reuse terms as stated, and whether it invites collaboration. Every URL listed under **Sources** was actually fetched or returned by a search in this session. Where I could only see a search-result title (not the page), I say so.

**Confidence tags** follow the research brief: `[verified]` = confirmed in a page read this session; `[from-memory]` = believed correct, not checked; `[disputed]`; `[unverified]`.

**Important limitation.** My web-search budget ran out partway through this task, so several items I intended to check (Yakama and other tribal-government interactive maps, critiques of Native Land Digital, the HCN methodology essay, the Kappler OSU landing page) are marked as gaps rather than filled from memory.

---

## 0. Summary table

| # | Project | Steward | What it is | Reuse terms as stated | Invites collaboration? |
|---|---------|---------|-----------|----------------------|------------------------|
| 1 | Native Land Digital (NLD) | Indigenous-led nonprofit (Canada) | Map + API of territories, languages, treaties | **Conflicting statements** (see 1.3): API page says no proprietary license / "can be considered CC0"; FAQ says non-commercial with attribution | Yes: corrections via Discord, volunteers, asks API users to say how they use it |
| 2 | Invasion of America | Claudio Saunt (UGA), Center for Virtual History | Time-lapse map of US acquisition of Indian land 1776-1887 | Not stated; one credit line reads "Website use only" | Not stated |
| 3 | Royce maps and Schedule (Library of Congress) | Bureau of American Ethnology (1899); LOC holds | 67 maps + Schedule of cessions through 1894 | Public domain / "free to use and reuse" (LOC) | n/a (historical source) |
| 3b | USFS "Tribal Lands Ceded to the United States" (digitized Royce) | USDA Forest Service Office of Tribal Relations with NPS NAGPRA, EPA, Saunt | 752 polygons, 1,172 attribute rows | **CC BY 4.0** | Yes: asks users to report errors to named contact |
| 4 | IDA Treaties Explorer (DigiTreaties.org) | Museum of Indian Arts and Culture (Santa Fe) with National Archives | 374 ratified treaties, scans + context | Not stated | General contact email listed |
| 5 | Kappler, *Indian Affairs: Laws and Treaties* (OSU / GovInfo) | US GPO; digitized by Oklahoma State Univ. | Treaty and law texts | Public domain (17 USC 105); OSU asks for acknowledgement | Contact listed for questions |
| 6 | NMAI *Nation to Nation* + Native Knowledge 360 | Smithsonian NMAI | Exhibition + K-12 teaching framework | Smithsonian terms (not itemized) | Webinars / education network; no open-data invitation seen |
| 7 | Mapping Indigenous LA | UCLA American Indian Studies Center | Community story maps of Indigenous LA | Attribute to map authors + project | Offers story-map making; **project status note (archiving)** |
| 8 | Land-Grab Universities | High Country News | Investigative parcel-level dataset and maps | **Conflicting**: README says ODbL 1.0 / CC BY-SA 3.0; GitHub sidebar lists CC0-1.0; article CC BY-NC-ND 4.0 | Yes: error reports to landgrabu@hcn.org |
| 9 | Decolonial Atlas | Volunteer collective (Jordan Engel) | Restored Indigenous-language maps | Not stated in article read | Described as virtual collaboration with Indigenous nations |
| 10 | Whose Land | Canadian Roots Exchange, TakingITGlobal, Bold Realities | App/site of territories, treaties (Canada) | Not stated | Accepts correction emails |
| 11 | Honor Native Land guide | US Department of Arts and Culture (USDAC) | Land-acknowledgment guide | Not stated | Pledge / partner campaign |
| 12 | Indigenous Mapping Workshop | Firelight (Vancouver, BC) | Annual GIS training; 2026 theme: data sovereignty | n/a | Public event |
| 13 | LANDBACK / NDN Collective | NDN Collective | Campaign framework and media | n/a | Donation and action links |
| 14 | Tribal-led boundary visibility (Cherokee Nation et al. on Google Maps) | Google, in response to *McGirt*, with tribal officials commenting | Reservation boundaries shown in consumer maps | n/a | n/a |
| 15 | Treaty Relations Commission of Manitoba (TRCM) story map | TRCM (Canada) | K-12 treaty education story map with Elders | Not stated | Education programs |
| 16 | *Indian Land Areas Judicially Established* (1978) | USGS for the Indian Claims Commission | 1:4,000,000 map of ICC/Court of Claims title findings | LOC: free to use | n/a |

---

## 1. Native Land Digital (native-land.ca)

**What it is.** An Indigenous-led, not-for-profit organization based in Canada that maintains a map and API of Indigenous territories, languages, and treaties. `[verified]` (About page, FAQ).

**Governance and method (as stated on its About page).** A Board of Directors made up of Indigenous people; non-Indigenous and Indigenous advisors; an Executive Director for operations. NLD says nations define themselves and it does "not act as a gatekeeper of identity or land." It treats borders as a colonial concept, takes "an expansive approach," avoids imposing rigid boundaries when sources conflict, and aims to cite "at least two valid sources" per entry while prioritizing Indigenous voices. It says it is redesigning its mapping with Indigenous knowledge systems. `[verified]`

**Method statement in the FAQ differs slightly.** The FAQ says Elder knowledge is the primary source, then NLD "seeks at least three more confirmations" from communities, scholars, or historical records, and that contradictory accounts are kept because different families and tribes may hold different histories. `[verified]` Note the two documents give different source-count language ("at least two" vs. "three more"); treat the exact threshold as unsettled and ask NLD.

### 1.1 Does well
- **Holds contradiction instead of resolving it.** Keeping contradictory accounts is the right model for overlapping claims (see G2 section 5).
- **Disclaimers are blunt and consistent:** the map "does not represent, and is not intended to represent, official or legal boundaries"; "not meant or reasonably intended for academic or legal purposes"; an "empty" area does not mean no Indigenous people live there, only that NLD has not yet connected with them. `[verified]`
- **Replaces harmful terminology over time** and says outdated terms remain in places. `[verified]`
- **Explicit data-sovereignty stance:** FAQ says NLD respects Indigenous data sovereignty and links to an Indigenous Data Sovereignty Treaty. (I could not fetch the treaty page itself; its contents are `[unverified]`.)

### 1.2 Does poorly or leaves open
- **Not a legal or treaty-geometry source.** It explicitly disclaims this, so it cannot be the geometry base for a treaty-law atlas. Its treaty entries are "one type of entry," and I could not verify a dedicated US treaty-boundary layer. `[verified]` for the disclaimer; layer details `[unverified]`.
- **Slow response to corrections.** FAQ says email replies are delayed by staffing and directs people to Discord. `[verified]`
- **Gaps by design.** Coverage depends on which communities NLD has connected with.
- **I did not find a published critique of NLD in this session** (search budget ended before I could look). Do not infer that none exists. `[unverified]`

### 1.3 License and terms: a discrepancy that must be resolved before launch
- **API docs "about and disclaimers" page:** dataset is "publicly available with no proprietary license" and "can be considered under CC0"; asks users to "use the data respectfully, and consider the morality of how you use it"; asks for credit to "Native Land Digital" with a link, framed as a request; encourages API users to tell NLD how they are using it; encourages adding a similar disclaimer. `[verified]`
- **API docs home page:** "You are free to use the dataset for your own maps and applications"; API currently open access but **"soon you'll need to sign up for an account"** (free, gives an API key). No rate limits stated. `[verified]`
- **FAQ:** maps "may be used for educational, research, or non-commercial purposes" with attribution and a link, "and don't seek monetary gain"; "commercial use, including books, apps, merchandise, or paid services, is not permitted"; contact NLD to discuss collaboration. `[verified]`

**Reading:** the API pages are permissive; the FAQ is more restrictive. The Atlas should (a) assume the stricter FAQ terms apply, (b) avoid monetizing NLD-derived layers (a donate button that links out to third-party Land Back organizations is probably fine, but ask), (c) write to NLD to get a written statement of terms, and (d) plan for an API-key requirement.

### 1.4 Invites collaboration?
Yes, in a limited way: contact them to discuss collaboration; Discord #volunteer channel; Patreon donations; asks API users to report how they use the API. `[verified]`

**Lesson for the Atlas:** use NLD for *context* (nation names, language, "whose territory is this place in a living-nation sense") rather than as treaty geometry, and always show its disclaimer next to its layers. Never present NLD polygons as "treaty territory."

---

## 2. Invasion of America (Claudio Saunt)

**What it is.** An interactive ArcGIS web map and time-lapse by historian Claudio Saunt (University of Georgia), released in 2014 alongside *West of the Revolution*. It visualizes more than 1.5 billion acres taken from Native peoples by the United States between 1776 and 1887, with a layer of present-day reservations. Blue marks Indigenous homelands and red marks reservations; users can search by place or nation and click through to documentation. `[verified]` (Open Culture; Yale news item; Civil Rights Teaching; Aeon).

- Map URL (as listed by Civil Rights Teaching): `https://usg.maps.arcgis.com/apps/webappviewer/index.html?id=eb6ca76e008543a89349ff2517db47e6` `[verified]` (URL as printed on the resource page; I did not open the map itself).
- Data source: the 1899 Bureau of American Ethnology maps (Royce). `[verified]` (Open Culture). Saunt's Aeon essay says nearly 500 cessions. `[verified]`

### 2.1 Does well
- **Made the scale of dispossession visible and shareable.** The Yale item reports tens of thousands of unique visitors and wide press coverage. `[verified]`
- **Links shapes to documents.** Users can reach historical documentation of each transfer.
- **Saunt is candid about the source's limits.** In *Aeon* he calls the 1899 maps' seamless tidiness "a fantasy": cession boundaries "were neither well-defined nor contiguous," followed watersheds, foothills, and mountaintops that surveyors could not locate precisely, and sometimes described the reserved tract rather than the ceded land. He also notes that treaties were often "negotiated under duress or facilitated with bribes." `[verified]`
- **Fed a reusable public dataset:** Saunt collaborated on the 2018 revision of the US Forest Service digitization (see item 3b). `[verified]`

### 2.2 Does poorly or leaves open
- **Cession framing and visual finality.** A time-lapse that paints land red or blue can read as a story of disappearance if the viewer never sees present-day nations, resistance, or returns. (This is a design critique of the genre, drawn from G4's reading of the *Vanishing Indian* literature; it is my judgment, not a published critique of this specific map.)
- **Vague boundaries are shown as crisp polygons.** Saunt and Slate's Rebecca Onion describe the source's vagueness as "a broad approach that left a lot of room for creative implementation." `[verified]` (Open Culture).
- **An unverified reader dispute** about upstate New York (a commenter says Haudenosaunee control lasted to about 1779). This is one comment, not a verified correction. `[unverified]`
- **No visible tribal review process** in the pages I read. (Absence of evidence in the pages fetched, not proof of absence.)
- **Start year 1776** leaves out colonial-era transactions; the 1899 maps themselves omit earliest cessions (see 3).
- **Reuse terms not stated.** A Facing History credit line reads "Website use only" for the video. `[verified]`

### 2.3 Invites collaboration?
Not stated on the pages read.

**Lesson:** the time-lapse is the proven hook; the Atlas should keep the hook but add (a) a living-nations layer, (b) uncertainty rendering, (c) a restoration/resistance track, and (d) per-polygon lineage.

---

## 3. Royce's *Indian Land Cessions in the United States* (1899) and its digitizations

**The source.** Charles C. Royce compiled 67 maps and two tables (Schedule of Treaties and Acts of Congress Authorizing Allotments of Lands in Severalty; Schedule of Indian Land Cessions); Cyrus Thomas wrote the introductory essay. It is Part 2 of the Eighteenth Annual Report of the Bureau of American Ethnology (1896-97 report year), published by GPO in 1899, also printed as House Document No. 736, 56th Cong., 1st Sess. The Schedule covers cessions and reservations from the founding of the federal government through 1894. Library of Congress states the contents are public domain, free to use and reuse, with credit line "Law Library of Congress" (text page) or "Library of Congress, Geography and Map Division." `[verified]`

**Coverage gap.** A Native Heritage Project blog summary says the maps begin after the Revolutionary War and omit the earliest cessions, so Virginia and most of North Carolina do not appear. `[verified]` as what the secondary source says; primary check `[unverified]`. DigiTreaties makes the same kind of statement (compilation does not cover much of the Eastern Seaboard, West Virginia, or Kentucky). `[verified]`

**Reputation.** Wikipedia relays a description of Royce's maps as "the foundation of cartographic testimony in Indian land claims litigation." I did not trace the original quotation. `[unverified]`

### 3b. USDA Forest Service digitization: "Tribal Lands Ceded to the United States" / "Indian Land Cessions in the United States"
`[verified]` (Data.gov catalog, FS layer page, FS metadata XML).

- 67 Royce maps scanned, georeferenced, digitized into **752 polygons** linked to **1,172 attribute entries**. Of the entries, 748 link to Kappler treaty texts, 140 to federal statutes, 214 to executive orders.
- **Lineage:** georeferenced against USGS 1:2,000,000 National Atlas feature classes; digitized in NAD83 Lambert Conformal Conic; reprojected to Web Mercator. The Forest Service and Saunt digitized the maps independently in 2018 and reconciled. Attribute data revised 2017-2018; NAGPRA tribal and county data replaced.
- **Creators:** USDA Forest Service Office of Tribal Relations, NPS National NAGPRA Program, EPA American Indian Environmental Office (the layer page lists EPA Office of International and Tribal Affairs), and Claudio Saunt.
- **License:** **CC BY 4.0.** Contact: Rebecca Hill, Policy Analyst, Office of Tribal Relations.
- **Known gaps:** seven cession IDs (47, 65, 128, 129, 130, 543, 690) lack spatial representation; the Office of Tribal Relations edited 89 rows (IDs 69, 134, 172, 661, 690) that the NAGPRA Program has not reviewed; dates changed for 15 IDs and map names for 39; present-day tribal determinations are being reevaluated by NAGPRA; treaty dates are *signing* dates, not proclamation dates.
- **No formal positional accuracy statement.** Closest information: digitized so no visible gap appears at a viewable scale; reference data at 1:2,000,000 (small scale).
- **Use limitation:** "not legal documents"; may not be used to determine title, ownership, jurisdiction, or land restrictions.

**Why this matters for the Atlas.** This is the best open, citable geometry base for cession and reservation shapes through 1894, with a license that permits reuse. It is also a *federal-agency* product whose tribal names are Royce's, so naming must be layered (see G2 section 7 and G3 section 6).

### 3c. Other consumers of Royce
- **Library of Congress item pages** let users browse state maps; e.g. `loc.gov/resource/g3701em.gct00002/` `[verified]`.
- **Northwestern Pritzker Law Library guide** lists Royce map images, the LOC Schedule (archived), the FS ArcGIS item, a Schedule PDF, a worksheet, DigiTreaties places, and a University of Arizona Land-Grant Project ArcGIS StoryMap appendix on Royce maps and treaties for Arizona tribes. `[verified]` (list as printed on the page; the linked items were not individually opened).

---

## 4. IDA Treaties Explorer (digitreaties.org)

**What it is.** A project of the Museum of Indian Arts and Culture (MIAC) in Santa Fe, built with the National Archives Office of Innovation and the National Archives Foundation; it provides context and access to the 374 Ratified Indian Treaties in the National Archives (scans from NAID 299798, covering 1722 to 1869, with accompanying documents). Browsable sections: Treaties, Cessions, Nations, Places, Trading Cards. `[verified]` Announced about October 20, 2020 per Hyperallergic. `[verified]`

**Credits indicate Indigenous leadership of the project team** (e.g. Della Warrior, Otoe-Missouria, museum director; Donovan Pete, Diné, technical/research fellow and art direction; Lee Francis IV, Laguna Pueblo, trading cards; Sherri Thomas, Taos Pueblo, workshops). `[verified]`

### Does well
- **Indigenous-led institution** presenting treaties as living relationships; teaching tools (Trading Cards, how-to workshops).
- **Honest about geometry lineage:** states that boundaries come from cession maps compiled by government clerks in the 1890s-1900s, transferred by Saunt to GIS and updated by the Forest Service. Treaties for areas without Royce coverage can be searched by nation name or title; colonial-era treaties summarized from David H. DeJong's guide. `[verified]`
- **Treaty images show features of the originals** (drawings, maps, wampum), and originals are not available in the National Archives research room, so the site is the main public access. `[verified]`

### Does poorly or leaves open
- **No license or reuse terms stated** on pages read. `[verified]` (absence).
- **No named corrections process**, only a general contact (info@native-docs.org, subject "Treaties Explorer Contact") and social links. `[verified]`

### Invites collaboration?
General contact only. Strong candidate for an *outreach* partner and a model of Indigenous-led treaty presentation. The Atlas should link to its treaty pages rather than re-host scans.

---

## 5. Kappler's *Indian Affairs: Laws and Treaties* (treaty texts)

- Seven volumes compiled and edited by Charles J. Kappler. Volume II (Treaties) covers 1778 to 1883; other volumes cover laws and executive orders 1871 to 1970. Oklahoma State University Libraries digitized the set with the US Government Publishing Office. `[verified]` (OSU item page; GovInfo item for Vol. 5).
- **Rights:** a work of the US Government, not subject to copyright under 17 USC 105; OSU asks users to acknowledge the institution's name and website URL. `[verified]`
- **Citation format example (from OSU item):** Charles Joseph Kappler, *Indian Affairs: Laws and Treaties*, vol. 2, Treaties (Washington, D.C.: U.S. G.P.O., 1904), 481. `[verified]`
- Individual treaty item pages on OSU also link to National Archives versions, the OSU Treaties Database, and the IDA Treaties Explorer. `[verified]`

**Lesson:** Kappler is the standard textual authority; the Atlas's treaty records should carry both Kappler and Stat. cites (brief requirement) and link to OSU/NARA/IDA copies.

---

## 6. NMAI: *Nation to Nation* and Native Knowledge 360 (NK360)

**Nation to Nation: Treaties Between the United States and American Indian Nations** (NMAI, Washington, DC). Describes treaties as "solemn agreements between sovereign nations," notes Native nations made treaties with one another before Europeans arrived, and features treaties on loan from NARA drawn from roughly 374 ratified treaties. The site has 22 individual treaty pages (Delawares 1778 to Nez Perce 1868), including Canandaigua (1794), New Echota (1835), Fort Laramie (1868), and the Navajo Treaty (1868). The page I read does not give exhibition dates or curators. `[verified]` A Smithsonian Magazine blog post (search result title and snippet only) indicates NMAI later acquired a Dakota Access Pipeline protest mile-marker with the framing "U.S. treaty history is still being written." `[unverified]` (snippet only).

**"Treaties Still Matter."** I could not verify a distinct NMAI/NK360 resource by this exact title in this session. The idea (treaties as live law, citing contemporary disputes) is consistent with the Nation to Nation framing, but treat the title as `[unverified]`; do not cite it until checked.

**Native Knowledge 360° (NK360).** NMAI's national education initiative: lessons and resources searchable by grade, subject, and type; webinars and teach-ins; *Essential Understandings* (ten) developed with Native communities, educators, and agencies. `[verified]` (NK360 home; understandings page). The Essential Understandings are summarized in G4.

### Does well
- Frames treaties as *sovereign-to-sovereign* and *still operative*. EU #6 says tribes "remain sovereign and maintain government-to-government relationships with the United States." `[verified]`
- Inquiry-based lesson design (Inquiry Design Model cited for one lesson). `[verified]`
- Terminology guidance (present tense, ask what terms people prefer, use nation-specific names). `[verified]` (Arizona State Museum/NMAI "Impact of Words" PDF).

### Does poorly or leaves open
- Not a mapping or data resource; no open geometry. Reuse governed by general Smithsonian terms (not itemized here). `[verified]` (absence of specific terms on the NK360 page).

### Invites collaboration?
Education network, webinars, and email updates; no explicit invitation to contribute data seen.

---

## 7. Mapping Indigenous LA (UCLA)

**What it is.** A story-mapping project launched in 2015, hosted at UCLA's American Indian Studies Center, using ArcGIS and TimeMap, built with youth, elders, and community leaders; content includes Gabrielino/Tongva and Fernandeno Tataviam places, relocation and termination-era communities, and Indigenous diasporas. Named contributors include cartographer David Deis, essayist Cindi Alvitre, and community consultant Pamela Peters; original PIs listed by the University at Buffalo project page are Mishuana Goeman (Tonawanda Band of Seneca), Wendy Teeter, and Maylei Blackwell. `[verified]`

### Does well
- **Community-authored maps and oral-history grounding**: site language says community voices and wishes guide the mapping. `[verified]`
- **Attribution of individual maps to their authors**, plus a pathway for others to make their own story maps and a Spanish-language section. `[verified]`
- **Insists on present-tense Indigenous presence in a city**, not only a distant past. `[verified]`

### A cautionary governance lesson (important)
The site now carries a status note stating that the Indigenous co-PIs and Wendy Teeter agreed to archive the project "given the recent admission of Maylei Blackwell that she is not Cherokee and willfully did not follow up on family stories," that they "regret any harm that came to the communities we have worked with," and that the site stays up "until we consult with our community collaborators about their wishes." `[verified]` (quoted from the page; I make no further claim about the individuals).

**Lesson for the Atlas:** (1) project credibility and community trust depend on transparency about who is leading and speaking; (2) build in a documented, community-controlled path to archive, edit, or remove content; (3) never lean on a single person's claimed identity or authority as the project's legitimacy. See G3 sections 3 and 5.

---

## 8. Land-Grab Universities (High Country News, 2020)

**What it is.** A 2020 HCN investigation by Robert Lee and Tristan Ahtone (published March 30, 2020) tracing the Morrill Act of 1862 land-grant system to land taken from Indigenous nations. Maps by Margaret Pearce; editing, fact-checking, research and web credits listed. `[verified]`

### Method (strong model of investigative land-data journalism)
- Over about two years the team located more than 99% of Morrill Act acres, identified Indigenous caretakers, researched sale proceeds, and overlaid grants on cession areas in GIS. Each parcel was catalogued with location, caretakers, transfer method (treaty, seizure, unratified treaty, etc.), recipient state and university, payment for Indigenous title, and amount raised. `[verified]`
- Scale: about 10.7 million acres from nearly 250 tribes, bands, and communities; more than 160 cessions; roughly 80,000 parcels (GitHub README). `[verified]`
- Data extracted programmatically largely from the BLM General Land Office database, with some manual transcription; the README warns of transcription errors and invites reports to landgrabu@hcn.org. `[verified]`
- Publishes shapefiles (parcels, cessions, university points), CSVs, an Excel summary, a user guide, and joins designed on the IPUMS-NHGIS model. `[verified]`
- Corrections appended to the article (e.g. Missouri unsold acres; a clarification of tribal nations that ceded land in Missoula, Montana). `[verified]`

### Does poorly or leaves open
- **Tribal consultation is not described** in the article. `[verified]` (absence in article text; HCN may have done more).
- **License ambiguity:** README states ODbL 1.0 for the database and CC BY-SA 3.0 for contents; GitHub sidebar shows CC0-1.0; the article is CC BY-NC-ND 4.0. Check the LICENSE file before reuse. `[verified]`
- Repo has moved between GitHub orgs (HCNData vs HCN-Digital-Projects), so some README links may be stale. `[verified]`

### Invites collaboration?
Error reports welcomed (email above). Data is open to build on, subject to license check.

**Lessons:** (1) per-parcel lineage fields and a transfer-method field are exactly what the Atlas needs per polygon; (2) a public corrections note builds trust; (3) pair data with commentary from scholars and Native voices; (4) wealth-transfer framing (acres and dollars) is persuasive but should be accompanied by a note about what the data cannot show (e.g., duress, intertribal claims).

---

## 9. Decolonial Atlas

Founded by Jordan Engel in 2014; described by Hyperallergic as a volunteer effort to decolonize cartography, restoring Indigenous place names and maps (e.g. Mohawk maps annotated in Kanien'keha with English colonial names in a key, made with Karonhi:io Delaronde of the Mohawk Nation, Turtle Clan), plus borderless maps and thematic maps. Engel says he consulted elders and language keepers from "almost every tribe on the continent." `[verified]` (Hyperallergic). License and funding terms are not stated in that article and I did not find them in this session. `[unverified]`

**Does well:** centers Indigenous language and naming; credits collaborators by name.
**Leaves open:** the article does not describe formal consent or review procedures or limits on reuse.
**Lesson:** endonym-first labeling is feasible and valued; documented consent per map is the missing piece. See G3 section 6.

---

## 10. Whose Land

An app and website launched in March 2018 by Canadian Roots Exchange, TakingITGlobal, and Bold Realities (developer Mitch Holmes is Haudenosaunee); shows traditional territories across **Canada**, treaties and agreements as outlined by the government, Indigenous communities, and videos of Indigenous people giving their own territorial acknowledgements. It does not show provincial borders, is incomplete, and takes corrections by email. `[verified]` (CBC Radio *Unreserved*). It is a Canadian project; I did not find a US equivalent under this name. `[verified]` (the CBC piece and app-store results concern Canada).

**Lesson:** pairing a map with *Indigenous voices speaking their own acknowledgments* is a strong pattern (permission required, G3).

---

## 11. Honor Native Land: A Guide and Call to Acknowledgment (USDAC)

Published by the U.S. Department of Arts and Culture, "created in partnership with Native allies and organizations," with a resource pack of backgrounds, social images, and printable posters; the page says acknowledgment alone is "a small gesture" that becomes meaningful only with authentic relationships and informed action, and points to a "Phase 2" focused on action. `[verified]` (secondary pages: The Avarna Group summary and USDAC landing; I did not read the guide PDF; authors and license are not stated on those pages.)

**Lesson:** acknowledgment is a starting point; the Atlas's calls to action should move from learning to concrete support for Indigenous-led work (G3 section 8). The guide's specific do/don't list is `[unverified]` (not read).

---

## 12. Indigenous Mapping Workshop (Firelight Group et al.)

The 2026 edition is a three-day event run by **Firelight** in Vancouver, BC (September 21-23, 2026), offering entry-level to advanced GIS training; strategic partners include Google, Esri Canada, the Canadian Space Agency, and NASA. This year's focus is "the role of mapping in Indigenous Data Sovereignty and what that means in the age of artificial intelligence." `[verified]` (firelight.ca). The 2014 and 2015 editions are mentioned as earlier news posts; further history is `[unverified]`. A search-result title also referenced "Indigenous mapping across borders" on firelight.ca (not read).

**Lesson:** a field-recognized venue for Indigenous GIS practitioners and a source of potential reviewers/advisors; the explicit AI-and-sovereignty theme is directly relevant to this project's use of automated tooling (G3 section 12). No explicit invitation to collaborate on the page read.

---

## 13. "Land Back" resources

- **NDN Collective's LANDBACK** page defines LANDBACK as "the meta political, organizing, and narrative framework" for NDN Collective's work, lists principles drawn from the LANDBACK manifesto (stewardship, self-determined sovereignty, honoring leaders, centering youth, solidarity including Black reparations alongside land return, the health of earth and people as linked) and points to **landback.org**. The page lists no map or database tool. `[verified]` These are self-described.
- **"Return the Land" as a named resource:** I could not identify a single canonical project by that name. Search results surfaced the following titles only (content not read): "Land Reparations and Indigenous Solidarity Toolkit" (North Sound ACH / Community Commons), "Seeds of Land Return" (Chisholm Legacy Project), and California's Tribal Stewardship Policy and Toolkit "Ancestral Land Return of School Lands." `[unverified]` Treat as leads for the organizations research agent.
- Land-return outcomes already documented for the Atlas's "returns" track (read this session): Blue Lake (Taos Pueblo, 1970, 48,000 acres, Public Law 91-550) and the Yurok Tribe's 47,097-acre Blue Creek/Klamath transfer (completed 2025; Western Rivers Conservancy; $56 million). See G4.

---

## 14. Tribal-led and tribally commented boundary visibility

- **Cherokee Nation and four other nations on Google Maps (September 2020).** Google Maps added borders and labels for the Muscogee (Creek), Cherokee, Chickasaw, Choctaw, and Seminole reservations after the Supreme Court's July 2020 *McGirt v. Oklahoma* ruling; Google's Raleigh Seamster said the team evaluated authoritative data; Cherokee Principal Chief Chuck Hoskin Jr. said the ruling prompted questions and the map makes boundaries easier to see. The article does not say who requested the change. `[verified]` (KOKH Fox 25).
- **City- and county-hosted layers** of tribal boundaries exist (e.g. a Yakima County ArcGIS server hosting a "Yakama Nation" boundaries layer; a City of Broken Arrow ArcGIS server hosting a "Muscogee Creek Nation Boundary" layer). These URLs appeared in search results; I did not open them. They are not tribal-government products. `[unverified]`
- **Tribal-government interactive treaty maps (Yakama, Cherokee, Muscogee, Navajo, etc.):** **I could not verify any** in this session. This is a real gap, and the likely right approach is to ask nations directly what they publish and want linked. NMAI hosts a *Navajo Treaty* page in Nation to Nation. `[verified]`

**Lesson:** where a nation or tribal leader has publicly framed boundaries (as Chief Hoskin did), quote and link them; do not substitute the Atlas's own interpretation.

---

## 15. Canadian parallels (brief)

- **Treaty Relations Commission of Manitoba (TRCM):** promotes "the significance of Treaties to all Manitobans today"; services include K-12 treaty education, training, a resource library of more than 2,000 items, and a Speakers Bureau connecting the public with scholars and Knowledge Keepers. `[verified]` Its **"What's your Treaty Story?"** ArcGIS StoryMap is a K-12 teaching tool with videos of Elders, reviewed by an Elders Council and an education advisor, built around user-driven navigation, primary sources and timeline, and place-based learning ("locate themselves on the land"). `[verified]` (Esri Canada case study).
- **Whose Land** (item 10).

**Lesson:** the TRCM design pattern (Elders' voice in the map, user-controlled pacing, place-based entry, formal review by an Elders Council) is the best documented model I found for a *treaty-education* map. It is a government-affiliated commission, not a tribal government, and the Canadian treaty context differs legally, so copy the *process*, not the content.

---

## 16. *Indian Land Areas Judicially Established* (1978)

A one-sheet map (89 x 123 cm; scale 1:4,000,000; Albers equal area) prepared by the U.S. Geological Survey under direction of the Indian Claims Commission and published at Reston, Va., in 1978; it shows "the results of cases before the U.S. Indian Claims Commission or U.S. Court of Claims," marking where a tribe proved its original tribal occupancy. LCCN 80695449; call number G3701.E1 1978 .U5. LOC: free to use and reuse; credit "Library of Congress, Geography and Map Division." USGS lists DOI 10.3133/70114965. `[verified]`

**Relevance:** the only compact, citable source I found for "aboriginal title as judicially established." Its scale (1:4,000,000) means polygons must be rendered as indicative regions only. It is not a georeferenced vector dataset (I did not find one); building one would be a project in itself. See G2 section 3(c).

---

## 17. Cross-cutting lessons

| Lesson | Evidence in prior art | How the Atlas should respond |
|--------|----------------------|------------------------------|
| Hook + honesty about source limits | Saunt calls Royce's tidy maps "a fantasy" yet the map went viral | Keep a compelling time-lapse, but render uncertainty and link every polygon to lineage (G2 s.8) |
| Per-record lineage and a transfer-method field | HCN parcel database; USFS links to Kappler/statute/EO | Adopt equivalent fields; add consent-evidence field (G2 s.4) |
| Keep contradictory accounts | NLD FAQ | Never dissolve overlapping claims (G2 s.5) |
| Disclaimers that disclaim legal use | NLD, USFS ("not legal documents") | Pair each layer with a plain-language "what this map is not" and a legal-status panel (G2 s.7) |
| Indigenous-led presentation of treaties | IDA Treaties Explorer; TRCM StoryMap | Seek an Indigenous advisory body and link out to IDA rather than duplicating (G3 s.3) |
| Present-tense presence | Mapping Indigenous LA; NMAI EUs | Every historical view shows the nation today (G4) |
| Community-controlled withdrawal | Mapping Indigenous LA status note | Publish a takedown/archive policy and a public corrections log (G3 s.7) |
| License hygiene | NLD and HCN have conflicting statements | Record license per layer in the data catalog; get written confirmation where ambiguous |
| Corrections in public | HCN article corrections; USFS asks for error reports | Public change log (G2 s.9) |

## 18. Licensing matrix (for the architecture and data agents)

| Layer / source | License or rights statement | Condition to watch |
|----------------|---------------------------|--------------------|
| USFS Royce digitization | CC BY 4.0 | Attribution; modifications noted; upstream edits not all NAGPRA-reviewed |
| LOC Royce images and 1978 map | LOC: free to use and reuse | Credit line as specified |
| Kappler (OSU/GovInfo) | Public domain (17 USC 105) | OSU asks for acknowledgement |
| IDA Treaties Explorer | None stated | Link rather than copy; ask MIAC |
| Native Land Digital | Conflicting (CC0-like vs non-commercial) | Get written terms; assume non-commercial + attribution; API key likely required |
| HCN Land-Grab data | Conflicting (ODbL/CC BY-SA vs CC0 vs article CC BY-NC-ND) | Read LICENSE file; ask HCN |
| Invasion of America | Not stated | Do not copy visuals; link out; ask Saunt for dataset permission if needed |
| NMAI/NK360 | Smithsonian terms | Link out; do not rehost |

## 19. Collaboration invitations (outreach list for the design wave)

1. **Native Land Digital:** terms clarification, and discussion of how the Atlas links to nation pages (Discord/email).
2. **Museum of Indian Arts and Culture (IDA Treaties Explorer):** linkage, corrections feed, potential advisors.
3. **USDA Forest Service Office of Tribal Relations:** error-report channel for Royce digitization; ask whether a newer version exists.
4. **High Country News (landgrabu@hcn.org):** data reuse terms; invite cross-linking.
5. **Claudio Saunt:** methodology conversation on Royce limitations and the 2018 reconciliation.
6. **Firelight / Indigenous Mapping Workshop network:** reviewers and training on Indigenous data sovereignty.
7. **Local nations:** see G3 section 3 for the tribal-advisor process. Nothing here substitutes for it.

---

## Sources

Fetched or returned by search in this session (all accessed 2026-10-16):

- Native Land Digital API docs, About and disclaimers: https://api-docs.native-land.ca/about-and-disclaimers
- Native Land Digital API docs home: https://api-docs.native-land.ca/
- Native Land Digital FAQ: https://native-land.ca/about/faq
- Native Land Digital About: https://native-land.ca/about/
- Invasion of America resource page (Civil Rights Teaching): https://civilrightsteaching.org/resource/invasion-of-america
- Yale item on Invasion of America: https://ygsna.sites.yale.edu/news/mapping-indigenous-dispossession-united-states?page=4
- Facing History, The Invasion of America: https://www.facinghistory.org/resource-library/invasion-america
- Open Culture on Invasion of America: https://www.openculture.com/2018/05/interactive-map-shows-the-seizure-of-over-1-5-billion-acres-of-native-american-land-between-1776-and-1887.html
- Saunt, Aeon essay: https://aeon.co/essays/how-were-1-5-billion-acres-of-land-so-rapidly-stolen
- LOC, *Indian land cessions in the United States* (Royce, 1899): https://www.loc.gov/resource/g3701em.gct00002/?sp=26
- Native Heritage Project, Indian Land Cessions Maps: https://nativeheritageproject.com/2014/08/03/indian-land-cessions-maps/
- Wikipedia, Indian Land Cessions in the United States: https://en.wikipedia.org/wiki/Indian_Land_Cessions_in_the_United_States
- USFS Indian Land Cessions layer: https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/0
- Data.gov catalog record: https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer
- USFS metadata XML: https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml
- Northwestern Pritzker Law Library historical maps guide: https://library.law.northwestern.edu/american_indian_law/historicalmaps
- IDA Treaties Explorer about page: https://digitreaties.org/treaties/about/
- IDA Treaties Explorer resources: https://digitreaties.org/treaties/resources/
- Hyperallergic on Treaties Explorer: https://hyperallergic.com/374-native-american-treaties-have-been-digitized-and-made-available-online
- OSU Kappler treaty item (Sioux 1836): https://oms.library.okstate.edu/s/oklahoma-built/item/4921
- GovInfo Kappler Vol. 5: https://www.govinfo.gov/app/details/GOVPUB-Y4_IN2_11-7975132ed47d4f19a69f6d958afe5635
- NMAI Nation to Nation: https://americanindian.si.edu/nationtonation/
- NK360 home: https://americanindian.si.edu/nk360
- NK360 Essential Understandings: https://americanindian.si.edu/nk360/about/understandings
- Arizona State Museum / NMAI "Impact of Words": https://statemuseum.arizona.edu/sites/default/files/Impact-of-Words-Tips-for-Using-Appropriate-Terminology.pdf
- Mapping Indigenous LA: https://mila.ss.ucla.edu/ and status page https://mila.ss.ucla.edu/636-2
- Univ. at Buffalo project listing: https://buffalo.edu/digital-scholarship-studio-network/projects/faculty-projects/mapping-indigenous-la.html
- HCN Land-Grab Universities: https://www.hcn.org/issues/land-grab-universities/
- HCN data repo: https://github.com/HCNData/landgrabu-data
- Hyperallergic on Decolonial Atlas: https://hyperallergic.com/decolonial-atlas-jordan-engel and https://hyperallergic.com/580642/decolonial-atlas-jordan-engel/
- CBC on Whose Land: https://www.cbc.ca/radio/unreserved/redrawing-the-lines-1.4973363/want-to-learn-whose-indigenous-land-you-re-on-there-s-an-app-for-that-1.4973367
- Honor Native Land (Avarna Group summary): https://theavarnagroup.com/resources/a-guide-and-call-to-honor-native-land/ ; USDAC: https://usdac.us/nativeland/
- Firelight, 2026 Indigenous Mapping Workshop: https://firelight.ca/news/2026-indigenous-mapping-workshop
- NDN Collective LANDBACK: https://ndncollective.org/landback/
- KOKH, Cherokee Nation reservation on Google Maps: https://okcfox.com/news/local/cherokee-nation-reservation-now-visible-on-google-maps
- TRCM What We Do: https://trcm.ca/our-story/what-we-do/
- Esri Canada, TRCM StoryMap: https://resources.esri.ca/arcgis/learning-about-treaty-in-manitoba-through-arcgis-storymaps
- LOC, *Indian land areas judicially established*: https://www.loc.gov/item/80695449/ ; USGS: https://pubs.usgs.gov/publication/70114965
- Taos Pueblo, Return of Blue Lake: https://taospueblo.com/blue-lake/
- Grist on Yurok land return: https://grist.org/indigenous/in-californias-largest-landback-deal-the-yurok-tribe-reclaims-sacred-land-around-the-klamath-river/

## Confidence & Gaps

**Overall: medium.** Descriptions of the projects above come from pages I read; but several pages are summaries produced by the fetch tool, and I could not always see the full original text (flagged where it matters).

**Not verified / gaps**
1. **Tribal-government interactive treaty maps** (Yakama, Cherokee Nation, Muscogee, Navajo and others): none verified. Search budget ended. The right next step is direct outreach to tribal GIS/cultural resource departments.
2. **"Treaties Still Matter"** (NMAI): title not verified. Related NMAI content on the Dakota Access mile-marker seen only as a search snippet.
3. **Native Land Digital:** licensing is internally inconsistent (API docs vs FAQ); the Indigenous Data Sovereignty Treaty page could not be fetched; no published critique reviewed; US treaty-layer details not verified. Needs written confirmation from NLD.
4. **Invasion of America:** map not opened; license/terms not found; the New York dispute is an unverified reader comment.
5. **HCN methodology essay** ("Methodology: Land-Grab Universities") not read; license conflict unresolved.
6. **Decolonial Atlas** license, funding and consent procedures not verified.
7. **USDAC guide** contents read only via summaries.
8. **"Return the Land"** as a named project not identified; three adjacent toolkits are leads only.
9. **Royce criticism in the scholarly literature:** apart from Saunt's own remarks, I did not find peer-reviewed critiques in the time available. G2 section 3 relies on the USFS metadata and Saunt.
10. **IDA licensing:** none stated; ask MIAC.
11. The University of Arizona Land-Grant Project StoryMap and other Northwestern-guide links were not opened.
