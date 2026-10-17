---
title: Native Land Digital API - Integration Feasibility, Terms, and Ethics
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Native Land Digital API: Integration Feasibility, Terms, and Ethics

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

Research Agent E, file 1 of 3. Companion files: `E2-geodata-source-inventory.md`, `E3-static-hosting-and-map-tech-feasibility.md`, `../../seed-data/geodata-sources.csv`.

Tags used: `[verified]` = read in a source this session; `[from-memory]`; `[disputed]`; `[unverified]`. Where I paraphrase, I paraphrase; quotation marks mark short exact phrases only.

## 0. Bottom line

1. The Native Land Digital (NLD) API is **free but gated**: it needs an account, a personal API key, and acceptance of NLD's **Indigenous Data Sovereignty Treaty**. [verified]
2. That treaty is **not a plain open license**. It permits educational, research, and non-commercial uses that generate no revenue. It bars commercial use, charging for access, altering Indigenous boundaries without community consultation and approval, misrepresenting territories, and **"storing or distributing API data without explicit permission"** from NLD. [verified]
3. The docs also call the dataset **CC0**. The treaty's restrictions and the CC0 label sit in tension; NLD's own docs do not reconcile them. A third source agrees with the stricter reading: the native-land.ca FAQ answers "No" on commercial use, suggests the credit "Used with permission for educational and non-commercial purposes", and the site footer reads "All rights reserved" (V3, 2026-10-16). No document is titled Terms of Use, and none says how to request permission. Until NLD says otherwise, the stricter treaty should govern anything that touches the API. [verified that both statements exist; the reconciliation is my reading]
4. Because the site is a static GitHub Pages site, **a key cannot be kept secret in the browser**, and any server-side relay or build-time snapshot is arguably "storing or distributing" API data. **The integration pattern should therefore be gated on written permission from NLD.** Section 7 gives a tiered plan that works with or without that permission.
5. The NLD layers carry **no documented time dimension**, and the treaties layer is not a substitute for Royce/Kappler geometry (Section 5). NLD is best used as a contemporary, self-described "whose land is this" context layer, clearly separated from the historical cession time slider.
6. **CORS behavior is unverified.** My sandbox could not reach native-land.ca, and I have no API key. Section 6 gives a 5-minute test to run from a real machine.

## 1. The organization, governance, and contact

- Native Land Digital describes itself as a **Canadian, Indigenous-led not-for-profit**. [verified: native-land.ca/about]
- Governance, per its About page: a Board of Directors that guides long-term strategy, an Executive Director for operations, and Indigenous and non-Indigenous advisors; decisions are said to follow Indigenous governance principles. The page describes the Board inconsistently (once as "Indigenous and non-Indigenous experts," once as Indigenous people), so do not characterize the Board's composition in site copy without confirming. [verified, with an internal inconsistency on the page]
- Method: entries draw on a mix of sources, with a stated preference for Indigenous knowledge (oral histories, written records, community maps), with a goal of at least two valid sources per entry. NLD says it does **not define territories**, that its maps are **not official sources**, and that it welcomes corrections. A nation can request direct control of its page through a form. [verified]
- A small team of Indigenous people updates and validates entries. The entry pages say NLD "can no longer keep entries fully up to date" and rely on lightly moderated user corrections. [verified, from an entry page (Cession 344)]
- **Contact:**
  - Contact page: native-land.ca/contact. It states a preference for **Discord** (https://discord.gg/8a6sJfDgD7) because email replies have been slow, and lists no email address. [verified]
  - API support: NLD's April 2025 announcement names **tech@native-land.ca** for documentation and support. [verified: relayed in the NLD Substack post; I did not independently confirm the address is monitored]
  - Blog: medium.com/@native-land. Social: Facebook, Instagram, LinkedIn (@nativelandnet). [verified]
  - The API docs invite users to "contact the team to share how they use the API." [verified]

## 2. The API: what exists

Base host: `https://native-land.ca`. All details below are from api-docs.native-land.ca pages I fetched; examples show `your_api_key` as a placeholder.

| Request type | Method and URL pattern | Parameters | Notes |
|---|---|---|---|
| Full GeoJSON dump | `GET /api/polygons/geojson/{category}?key=...` | category = `territories`, `languages`, or `treaties` | Returns one FeatureCollection with every shape. Docs: "Please avoid calling this endpoint continually." Prefer tighter queries. [verified] |
| By name and/or position | `GET /api/index.php?maps=...&position=lat,lng&name=slug,slug&key=...` | `maps` (required; comma-separated categories), `position` (lat,lng), `name` (slugs), `key` | Point-in-polygon lookup. One lat/lng per request. Slugs are found by logging in and searching in your account's API section. [verified] |
| By intersecting polygon | `POST /api/index.php` with JSON body | `key`, `maps`, `polygon_geojson` (a GeoJSON FeatureCollection) | All three fields required. Docs advise against very detailed polygons; backend uses PostgreSQL/PostGIS. [verified] |
| Embed | iframe to `/api/embed/embed.html?maps=...&name=...&key=...` | same as above | Renders a simple Leaflet + OpenStreetMap map of named nations. Shows only chosen nations, not the full map. The embed example includes `key`; the page does not say whether it is mandatory. [verified] |
| Mapbox tileset | Public tileset id `nativeland.4pgB_next_nld_terr_prod_layer` (territories only) | n/a | Updated daily "whenever new areas have been added." Properties: Name, description (link to the NLD page), color, Slug (FrenchName/FrenchDescription marked deprecated). Source: Mapbox data-exchange repo. No license stated; credit "appreciated but not required." [verified] |
| ArcGIS Online layer | `services.arcgis.com/DN2fPfpggEPlLhP6/ArcGIS/rest/services/Indigenous_Territories/FeatureServer` | n/a | Territories only, layer "Indigenous_Territories_select"; updated every Sunday from the NLD API; max 2,000 records per query; no license or copyright text; carries the NLD disclaimer. [verified] |

Response format: GeoJSON. The docs I fetched **do not document the response schema** for the index.php endpoint; only the Mapbox tileset page lists properties (Name, description, color, Slug). Whether treaties and languages responses carry additional fields (dates, parties) is **[unverified]**.

An older NLD blog post uses `type=` and a base path of `/api/` where the current docs use `maps=` and `/api/index.php`; the post does not explain the difference. Trust the current docs, and re-verify with a real key. [verified that the discrepancy exists]

### 2.1 Key, signup, rate limits, cost

- **Free.** Sign up at native-land.ca/auth/signup, open the **API** tab in your account, tick the agreement box (which links the Data Sovereignty Treaty), and the page shows your key. [verified]
- Key transport: GET requests use a `key` query parameter; POST requests use a `key` body field. The docs list **no header-based option**. [verified]
- **Rate limits: none published.** The docs say keys help NLD "keep a better handle on excessive requests" and ask people to avoid hammering the full-dump endpoint, but give no numbers. [verified]
- **Date confusion** `[disputed]`: the docs pages still say a key will be required "soon." NLD's Substack announcement (dated 30 April 2025) says keys are required, quotes a start of 20 November 2024 in one place and **1 May 2025** (access switched off until users log in and agree to the treaty) in another, and marks the treaty "Last Updated: [14/02/2025]." Treat the key and treaty as in force today. [verified: inconsistencies are in the sources]
- NLD says one purpose of the key is "good metrics on where our data is being used." [verified] This is relevant: they expect to know about integrations, and a polite heads-up is aligned with their stated expectation.

## 3. The terms: the Data Sovereignty Treaty

Source: api-docs.native-land.ca/data-sovereignty-treaty and the NLD Substack announcement. The page I fetched has no "last updated" date and no clause saying how to request permission or an exception.

| Area | What it says (paraphrased) | Does our project fit? |
|---|---|---|
| Permitted | Educational and research uses aligned with Indigenous Data Sovereignty; non-commercial applications that respect Indigenous governance and generate no revenue; Indigenous-led initiatives. | An educational, non-commercial advocacy site fits the first two. The project is not itself Indigenous-led; do not claim it is. |
| Prohibited: charging | No charging for access to, or integration of, NLD data, including subscriptions, memberships, bundles. | Fine if the whole site is free and has no paywall or membership tier. Keep it that way. |
| Prohibited: commercial | No commercial use: monetized platforms, data resale, proprietary applications. | Fine if the site generates no revenue. **Risk to clarify with NLD:** the site will link visitors to donation pages of third-party Land Back organizations. We receive nothing, but ask NLD whether outbound donation links near NLD data are acceptable. |
| Prohibited: altering boundaries | No modifying Indigenous land boundaries without direct consultation and approval from the communities involved. | **Critical for the counterfactual-map feature.** Never edit, clip, merge, or re-draw NLD polygons. Counterfactual maps must be built from treaty/cession geometry (Royce), never from altered NLD shapes. |
| Prohibited: governance and misrepresentation | No use that undermines Indigenous governance or misrepresents territories. | Do not place NLD polygons next to cession polygons in a way that implies legal equivalence or "who owns what." Use the disclaimer and visual separation (Section 8). |
| Prohibited: derivatives | Derivative works must acknowledge Indigenous ownership and governance of the data. | Include the acknowledgement wording in Section 4. |
| Prohibited: storing or distributing | No storing or distributing API data without "explicit permission" from NLD. The treaty has no separate caching language. | **This is the pivotal clause.** It plausibly covers a build-time snapshot committed to a repo, a cached proxy, and re-served GeoJSON. Whether a live pass-through proxy counts is not addressed. **Ask.** |
| Attribution | Credit NLD as the original source in all uses; acknowledge Indigenous communities as the rightful stewards of their data in publications, applications, or research. | Straightforward; see Section 4. |
| Enforcement | NLD may revoke access immediately; violations may lead to legal action; users who monetize, alter, or misuse data may be permanently barred. | A leaked key or an unapproved cache is the most likely way to trigger this. |
| Principles | Affirms Indigenous data sovereignty and OCAP(R) (Ownership, Control, Access, Possession); says territory mapping is Indigenous property; final authority over boundary changes rests with Indigenous communities and NLD. | Aligns with the brief's tribal-voice principle. |

### 3.1 CC0 versus the treaty `[disputed]`

- The API docs' "About and disclaimers" page says the dataset is CC0 with no proprietary license, while asking users to "consider the ethics" of their use. NLD's 2023 blog post also says CC0. [verified]
- The treaty then layers restrictions on use of the **API**. The Mapbox tileset page states no license. The ArcGIS layer states none. [verified]
- My reading (an interpretation, not legal advice): the CC0 statement describes the dataset's historical posture, but NLD now conditions API access on the treaty, and NLD says it follows OCAP(R). Relying on the CC0 label to justify copying data would be legally arguable and ethically contrary to what NLD says it wants. **Do not do it.** Ask NLD to state in writing which instrument governs the downloadable GeoJSON, the Mapbox tileset, and the ArcGIS layer.

## 4. Disclaimers and attribution wording

NLD's stated disclaimers and guidance, paraphrased with short quotes:

- The map "does not represent or intend to represent official or legal boundaries" of Indigenous nations; users are encouraged to add a similar disclaimer. [verified]
- It is not meant, and not suited, for academic or legal purposes; the data change constantly and can be inaccurate; local nations are the better source. [verified] ("Our map is NOT a legal resource" is NLD's own phrase on its API blog post.)
- On tribal consultation: I found **no NLD statement that the map is a substitute for, or source for, consultation**; I found the opposite emphasis: NLD directs people to the nations themselves for definitive boundaries. Do not put "NLD says it can be used for consultation" on the site. [verified for what NLD says; the absence of a consultation statement is "not found," not "does not exist"]

Suggested on-site text (draft, for NLD's review): "Indigenous territory, language, and treaty context on this page comes from Native Land Digital (native-land.ca), an Indigenous-led nonprofit. Their maps do not represent or intend to represent official or legal boundaries of any Indigenous nation, and are not a legal or academic source. We acknowledge Indigenous communities as the rightful stewards of this data. For definitive information, contact the nations directly."

## 5. The treaties layer, the languages layer, and time

### 5.1 What the treaties layer is

- NLD organizes its content in three categories: territories, languages, treaties. [verified]
- NLD's own treaty listing shows entries titled "Cession NNN" (for example Cession 5, 45, 91, 160, 344, 432), Canadian treaties ("Treaty 3," "Robinson-Huron (Treaty 61, 1850)," "James Bay Treaty No. 9 adhesions"), and a few US items named by treaty ("Fort Bridger Treaty, 1868," "Treaty 57, 1847," "Chahta (Choctaw)"). The first listing page showed 24 entries; the Fort Laramie and Medicine Lodge treaties did not appear on that first page, which does not mean they are absent from later pages. [verified for what appeared; completeness unverified]
- An NLD maps page mentions "832 treaties"; another listing page mentions 834 listings across all categories. I could not reconcile these. Count: roughly 830, scope not documented. [unverified]
- The "Cession NNN" naming matches the numbering convention of Royce's *Schedule of Indian Land Cessions* (the USFS dataset in E2 uses the same "cession map number"), but **NLD's pages I read do not say** their numbers are Royce's. Treat the match as an inference, not a fact. [unverified]
- The Cession 344 entry cites the Confederated Tribes of Grand Ronde's own treaty-history page and a USFS Tribal Connections viewer: that is, NLD mixes tribal-government sources with federal ones. Entries link to sources, related territories, and a changelog. [verified]
- The only date visible on that entry page was administrative (when the entry was added and updated), not the treaty date. **I found no documented treaty-date field.** [verified for that page]

### 5.2 How this compares with Royce and Kappler

| Dimension | NLD treaties layer | Royce cessions (USFS georeferenced) | Kappler / OSU Tribal Treaties Database |
|---|---|---|---|
| Geography | North America, with strong Canadian coverage; US coverage partial/unclear | US only, 1784-1894 | US only; text, no geometry |
| Geometry | Polygons from a mix of sources; community-edited | 718 polygon features digitized from 67 Royce maps | None |
| Date field | Not documented | Up to five Royce Schedule dates per cession (`cessdate1`-`cessdate5`) | Treaty date in text/index |
| Legal character | Self-described as not official | Not a legal document (USFS disclaimer), but follows the federal record | Primary-source text (Kappler is the standard compilation) |
| Tribal voice | Cites tribal sources; nations can claim pages | Federal compilation of a 1890s federal view | Federal compilation; OSU plans tribal listening sessions |
| Fit for a time slider | Poor (no dates) | Good (dates, tribe, treaty links) | Good for the *treaty events* layer, not geometry |

Conclusion: **the treaties layer cannot supply the historical cession geometry.** Royce/USFS is the right backbone for the time slider (see E2). The NLD treaties layer could be used on a per-place basis ("NLD also lists these treaty entries here") only if permission is granted.

### 5.3 Languages and time

- A languages layer exists and is served by the same API (`maps=languages`). [verified] Its response fields are unverified.
- None of the NLD documentation I read describes **temporal** attributes (no "valid from/to"), and the tileset properties list contains none. NLD maps are presented as a current, evolving snapshot. A Geneseo library review also notes no time dimension (it is silent rather than explicit). [verified for tileset properties; the rest is absence of evidence]
- Therefore: do **not** animate NLD polygons over time. Showing territories "at 1850" would imply a historical claim NLD does not make.

## 6. Technical feasibility from a static site

### 6.1 CORS `[unverified]`

I attempted to test `native-land.ca/api/index.php` from this sandbox. The agent proxy blocked connections to native-land.ca and api-docs.native-land.ca (HTTP 403 on CONNECT), I have no key, and no NLD page documents CORS headers. The web search for CORS evidence returned only generic CORS tutorials. So I cannot say whether browser `fetch` from `https://<user>.github.io` works.

Weak circumstantial signals: (a) NLD built the API for a Canadian Encyclopedia embed and still offers an iframe embed; (b) the POST example in the docs sends a stringified JSON body with no `Content-Type` header, which a browser sends as `text/plain` and so avoids a CORS preflight. Neither proves `Access-Control-Allow-Origin` is set. Note also that a key in a GET URL appears in browser history, referrers, and server logs.

**5-minute test to run from a normal machine** (use your own key; do not paste it into chat):

```
curl -i -H "Origin: https://omniharmonic.github.io" \
  "https://native-land.ca/api/index.php?maps=territories&position=40.015,-105.27&key=$NLD_KEY"
# look for: Access-Control-Allow-Origin
curl -i -X OPTIONS -H "Origin: https://omniharmonic.github.io" \
  -H "Access-Control-Request-Method: POST" \
  "https://native-land.ca/api/index.php"
```

(The coordinates are a Boulder test point; any point works.)

### 6.2 The key cannot be secret in a static site

Anything in client JavaScript is public. A leaked key lets anyone call the API as the account holder, and under the treaty NLD may revoke access. So the client must never contain the key. Options:

1. **Pass-through proxy (Cloudflare Worker).** The Worker holds the key as a secret, accepts only your origin, allows only `GET` with `maps` in an allowlist and a `position` or `name`, forwards the request, returns the response with `Cache-Control: no-store`, adds nothing persistent. Cloudflare Workers Free: 100,000 requests/day, 10 ms CPU per request, 50 subrequests per invocation. [verified] A pass-through uses little CPU. **Treaty risk:** the Worker is an intermediary that re-serves NLD data to the public, so get permission first. Do not enable the Cache API for NLD responses until permission covers it.
2. **Build-time snapshot** (GitHub Action fetches GeoJSON, commits or publishes it). Fast and CORS-free, but it is exactly "storing or distributing API data." **Only with explicit written permission.**
3. **User-supplied key.** A visitor pastes their own key into an "advanced" panel, kept in `sessionStorage`. Each user accepts the treaty themselves, so this respects the terms, but it is poor UX for the public and the CORS question still applies. Reasonable for educators or as a fallback.
4. **Outbound link only.** Deep-link to native-land.ca centered on the clicked location. No data stored, no key. (The exact URL parameters for centering the NLD map are `[from-memory]`; verify before shipping.)

## 7. Recommended integration pattern

**Default posture: treat NLD as a partner to ask, not a dataset to scrape.**

| Tier | What ships | Needs NLD permission? | Notes |
|---|---|---|---|
| 0 (launch) | A "Whose land is this?" panel: acknowledgement text, NLD attribution, and an outbound link to native-land.ca for the selected location. Historical cession geometry comes from USFS/Royce, **not** from NLD. | No | Zero stored data, zero key risk. Shippable immediately. |
| 1 | Live point lookup of territories and languages through a no-store Cloudflare Worker proxy, key held server-side, attribution and disclaimer shown beside results. | **Yes, in writing** (confirm the proxy is acceptable and the donation-link question) | Best live-data pattern if CORS allows direct calls or NLD approves the relay. |
| 2 | Periodic snapshot of the territories layer for a toggle-able context overlay. | **Yes, in writing**, including refresh cadence, how corrections flow back, and whether the repo may publish it | Only if NLD invites it. Alternatively NLD may prefer the Mapbox or ArcGIS endpoints. |
| 3 | User-supplied key panel for educators. | No | Optional extra. |

**Fallbacks if the API cannot be used as desired**
- Keep Tier 0 permanently. The map still works: Royce/USFS for history, Census TIGER and BIA LAR for current reservations (E2).
- Link out to each tribe's own website for endonyms and self-description (brief principle 4), which is often better than any aggregator.
- The Mapbox tileset and ArcGIS layer are public, but their terms are silent, and they may not be exempt from the treaty. Ask NLD before using either as a loophole. The Mapbox route also adds a Mapbox account and token requirement `[from-memory]`, which I did not verify.
- The embed iframe would put the key in page HTML. Not recommended for a public site.

**Draft message to NLD** (send via Discord or tech@native-land.ca; the sender is Benjamin Life (@omniharmonic), not an organization):

1. Who we are and what the site is: free, non-commercial, educational; time-aware atlas of US treaty law; links to Land Back organizations; no revenue; no ads.
2. Exactly what we want: a point-lookup of territories and languages when a visitor clicks the map (Tier 1), and optionally a territories overlay (Tier 2).
3. How we would protect the key and respect the treaty: server-side key, no storage, no alteration of boundaries, NLD attribution and disclaimer beside every result.
4. Questions: Is a no-store relay acceptable? Is a periodic snapshot permissible, and under what conditions? Does CC0 or the treaty govern the GeoJSON, tileset, and ArcGIS layer? Are outbound donation links near NLD data acceptable? Does NLD want a specific acknowledgement? Is there a preferred way to show NLD territories next to historical cession polygons without implying equivalence? Can the nations we feature review how their territory is presented?
5. Offer: share the site with NLD before launch.

## 8. Ethics and design guardrails specific to NLD data

- **Separation.** Show NLD data in its own layer group, visually distinct from cession polygons, with a standing note: "Territories are self-described and contemporary; cessions are the federal government's record. They are different kinds of claims."
- **No alteration.** Never edit NLD geometry; never compute "counterfactual" areas from it.
- **No legal inference.** Do not use NLD shapes to state who owned land at a treaty date.
- **Endonyms.** Where NLD offers a nation's own name, prefer it; link to the nation's own site where available.
- **Tribal consultation flag.** Before publishing any page that features a specific nation's territory prominently, flag it for review by that nation or an Indigenous reviewer. NLD's "request control of your page" feature suggests nations have a channel for this.
- **Sensitive content.** NLD territory polygons are broad; they do not show sacred sites. Do not add place-name layers that could expose culturally sensitive locations.

## Sources

Consulted this session (fetched or returned by search):

- Native Land Digital API docs: https://api-docs.native-land.ca/ (overview), https://api-docs.native-land.ca/llms.txt (index), https://api-docs.native-land.ca/llms-full.txt, https://api-docs.native-land.ca/get-and-use-your-api-key, https://api-docs.native-land.ca/about-and-disclaimers, https://api-docs.native-land.ca/data-sovereignty-treaty, https://api-docs.native-land.ca/request-types, https://api-docs.native-land.ca/full-geojsons, https://api-docs.native-land.ca/by-names-and-or-position, https://api-docs.native-land.ca/by-intersecting-polygon, https://api-docs.native-land.ca/embed-a-map, https://api-docs.native-land.ca/mapbox-tilesets, https://api-docs.native-land.ca/arcgis-online-living-atlas, https://api-docs.native-land.ca/readme
- NLD site: https://native-land.ca/ , https://native-land.ca/contact , https://native-land.ca/about/ , https://native-land.ca/how-to-contribute/fixes-and-adding-maps , https://native-land.ca/our-wonderful-wily-api/ , https://native-land.ca/maps/treaties/ , https://native-land.ca/maps/treaties/cession-344/ , https://native-land.ca/listings/treaties
- NLD Substack announcement of the API change: https://nativeland.substack.com/p/native-land-digital-api-indigenous
- NLD blog: https://medium.com/@native-land/how-to-add-native-land-digital-data-to-your-own-maps-2ddd6fd1294d
- Mapbox data-exchange: https://github.com/mapbox/data-exchange/blob/main/native-land.md , https://github.com/mapbox/data-exchange
- NLD ArcGIS service: https://services.arcgis.com/DN2fPfpggEPlLhP6/ArcGIS/rest/services/Indigenous_Territories/FeatureServer
- BTAA Geoportal record, Treaties (Native Land Map): https://geo.btaa.org/catalog/a4d43715-a2cf-4a1b-bbe8-6b9e7c461cd2
- Geneseo library review: https://library.geneseo.edu/blog/Resource-Review-Native-Land-Digital
- Felt map built from NLD data: https://felt.com/map/yjDGyak0RwywqfggW9CWLJA
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/

## Confidence & Gaps

Overall confidence: **medium** (high on the terms and endpoints as documented; low on runtime behavior).

Not verified or not found:
- **CORS behavior** of the API (sandbox could not reach native-land.ca; no key). [unverified]
- **Response schema** for the index.php and treaties/languages categories; whether any date, party, or source field exists on treaty features. [unverified]
- **Rate limits**: none published; actual enforcement unknown.
- **Which license governs** the downloadable GeoJSON, tileset, and ArcGIS layer (CC0 label versus treaty). [disputed]
- **Whether a no-store proxy, a snapshot, or a Mapbox/ArcGIS route is acceptable**: the treaty does not say how to request permission; the only route found is contacting NLD directly.
- **Date the key requirement started** (docs say "soon"; the announcement gives conflicting dates). [disputed]
- **Whether NLD "Cession NNN" numbers are Royce's numbers.** [unverified inference]
- **Count and US coverage of the treaties layer** (about 830 entries; only the first 24 listing entries seen). [unverified]
- The exact NLD map deep-link parameters for Tier 0. [from-memory]
- tech@native-land.ca is from NLD's own post but untested.
- NLD's pages were summarized by a fetch tool, not read raw; clause wording on the treaty should be re-read directly before any contract-like reliance.
- This document is not legal advice. Have a person with legal or Indigenous-data-governance expertise review the final permission arrangement.
