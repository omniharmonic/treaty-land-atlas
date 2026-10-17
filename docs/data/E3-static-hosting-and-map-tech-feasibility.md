---
title: Static Hosting and Map Technology Feasibility
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Static Hosting and Map Technology Feasibility

Research Agent E, file 3 of 3. Companion files: `E1-native-land-api-integration.md`, `E2-geodata-source-inventory.md`, `../../seed-data/geodata-sources.csv`.

Tags: `[verified]` read in a source this session; `[from-memory]`; `[unverified]`; `[estimate]` = my own arithmetic from a small sample, to be replaced by measurement once the data can be downloaded on a normal machine.

## 0. Bottom line

1. **A fully static architecture on GitHub Pages is feasible** for the core product: a time-aware cession map, a treaty/case graph, and Land Back organization pages.
2. The cession geometry is **small**. The USFS Royce dataset has 718 polygons [verified]; from a three-feature sample I estimate roughly **1-10 MB** as raw GeoJSON and **under about 2 MB** after simplification and gzip. [estimate] That fits one file; **vector tiles are not required for the cessions.** They are useful for the basemap and for any big optional layer (for example the Land-Grab-U parcels, about 79,000 polygons [verified count]).
3. **Recommended stack:** MapLibre GL JS + a GeoJSON/TopoJSON cession file + client-side time filtering + a PMTiles or free hosted vector basemap. Leaflet is an acceptable simpler alternative at this data size. deck.gl is overkill unless we later add animated flows or millions of features.
4. **Native Land API:** it cannot run from a static site without either a proxy or a user key, and its terms gate caching and redistribution (E1). Design the map so NLD is an *optional, removable* layer.
5. **CORS to NLD is unverified** (E1 section 6.1).
6. GitHub Pages is fine for a non-commercial educational site, but it has a soft **100 GB/month** bandwidth limit and a **1 GB** published-site limit [verified]; keep large files out of the repo or on object storage if traffic grows.

## 1. GitHub Pages: constraints that shape the design

From GitHub's documentation [verified]:

| Limit | Value |
|---|---|
| Published site size | 1 GB maximum |
| Source repo size | 1 GB recommended |
| Bandwidth | Soft limit of 100 GB per month |
| Builds | Soft limit of 10 per hour (not applied to custom GitHub Actions workflows) |
| Deployment timeout | 10 minutes |
| Rate limiting | HTTP 429 when needed |
| Prohibited | Free hosting for commercial sites (online businesses, e-commerce, commercial SaaS); sensitive transactions such as passwords or credit-card numbers |

Implications:
- **Do not process donations on the site.** Link out to each organization's own donation page (also consistent with the brief's donation-integrity principle and with NLD's no-revenue term in E1).
- No server-side code. Anything dynamic (NLD relay, search over a large graph) needs a separate service such as a Cloudflare Worker, or must be precomputed.
- Per-file size: GitHub's page does not state a per-file limit; community guidance says files over 100 MB are not recommended on Pages and 25-100 MB need command-line pushes. [from a third-party tutorial; the 100 MB figure is a recommendation there, not a verified hard limit]
- HTTP range requests, which PMTiles needs, are reported to work on GitHub Pages. [from a third-party tutorial, verified only as a claim there; test with `curl -I -H "Range: bytes=0-100" <url>` and look for `206 Partial Content`]

## 2. Payload sizes: what the geometry actually costs

Sizes are estimates unless marked. I could not download the datasets in this sandbox (the proxy blocked the hosts), so the Royce figure is extrapolated from three features returned by a REST query: roughly 250, 280, and 25 coordinate pairs.

| Layer | Feature count | Raw size (estimate) | After simplify + 4-5 decimal precision + gzip | Strategy |
|---|---|---|---|---|
| USFS Royce cessions | 718 polygons [verified]; 7 cession IDs lack geometry [verified] | ~130,000 vertices if the sample is representative, so about 3 MB raw GeoJSON (range 1-10 MB) [estimate] | ~0.5-2 MB [estimate] | Single TopoJSON/GeoJSON; load once; filter by year in the browser |
| Cession attribute table | 1,172 rows [verified], 41 fields [verified] | <1 MB as JSON | Under 200 KB [estimate] | Split out and join by `cessnum`; load lazily for popups |
| BIA LAR / Census AIANNH (today) | Several hundred to ~1,000 areas [unverified] | Unknown | Use Census generalized cartographic files or simplify LAR | Build-time pull, simplify to ~1 km tolerance, one file |
| Newberry AHCB (historical states/counties) | Many thousands of county-version polygons [unverified] | Large (tens of MB or more) [unverified] | Use **state/territory** files only for the slider; counties only on demand | Pre-extract states/territories; leave counties as a PMTiles layer if used |
| HCN Land-Grab U parcels | ~79,461 parcels [verified] | Tens of MB [estimate] | PMTiles | Only if the university case-study feature is built |
| NLD territories | ~2,045 features in a third-party copy [verified via Felt map] | Likely many MB [unverified] | n/a (subject to E1 permission) | Do not snapshot without permission |
| Basemap | n/a | Planet PMTiles is about 120 GB (z0-15) [verified]; each extra zoom level roughly doubles size [verified] | A US extract at low max zoom (for example z0-9) is far smaller; size not published [unverified] | Prefer a hosted free style (below) rather than self-hosting |

Takeaway: **all cession geometry for the whole country over 1784-1894 fits comfortably in one small file.** The expensive part is not the cession polygons; it is the basemap and any optional parcel-level layers.

Simplification caveats:
- The source maps were georeferenced to **1:2,000,000** National Atlas layers [verified]. Their positional accuracy is coarse already, so aggressive simplification (for example Mapshaper's Visvalingam at ~10-20% retained) is visually harmless at national zoom. But at county zoom, show an accuracy note; do not imply survey-grade boundaries.
- Keep the **unsimplified** file in the repo's data pipeline for audit; ship the simplified one. Record the tool and tolerance in a `data/PROVENANCE.md`.
- MapLibre's large-data guide recommends: remove unused properties, reduce precision to about 6 decimals, simplify, minify, compress, split into chunks, load from a URL rather than inline, and move to vector tiles when needed; it gives no numeric threshold for switching. [verified]

## 3. Map library comparison

| Option | Strengths | Weaknesses | Fit |
|---|---|---|---|
| **MapLibre GL JS** (open-source fork of Mapbox GL JS) | WebGL rendering; vector-tile support; `setFilter` and data-driven styling for time sliders; official "Create a time slider" and "Filter within a layer" examples; official PMTiles example; handles tens of thousands of polygons | Needs WebGL; slightly heavier than Leaflet | **Recommended** |
| **Leaflet** | Small, simple, huge plugin ecosystem; PMTiles has a Leaflet integration [verified] | Canvas/SVG rendering becomes sluggish with many complex polygons; time filtering means re-rendering layers | Fine for 718 simplified polygons; weaker for later parcel layers |
| **deck.gl** | GPU layers for very large data, arcs, animations; can sit on MapLibre | Larger bundle, more complexity, framework-leaning | Defer; consider if we add flows (for example removal routes) or very large point sets |
| **OpenLayers** | Strong GIS support, projections | Larger API surface | Not needed |
| **Mapbox GL JS** | Same API family | Account/token and Mapbox terms; the NLD tileset is a `mapbox://` source [verified]; terms of Mapbox are outside this review | Avoid unless NLD explicitly directs us to the Mapbox tileset |

MapLibre/PMTiles specifics [verified]:
- PMTiles is a single-file tile archive read via **HTTP range requests**, so it can sit on static or object storage.
- Registering the protocol in MapLibre: `import { Protocol } from "pmtiles"; maplibregl.addProtocol("pmtiles", new Protocol().tile);` then source `url: "pmtiles://https://example.com/file.pmtiles"`; the prefix sets min/max zoom automatically.
- Pin exact library versions when building; I have not pinned any here.

Basemap options:
- **OpenFreeMap**: free public instance, no API key, no registration; commercial use allowed; no stated limits on views; attribution required (MapLibre adds it automatically); no SLA. [verified] Good default for a launch.
- **Protomaps PMTiles basemap**: ODbL "Produced Work," OSM attribution required; planet file about 120 GB; use `pmtiles extract` with `--maxzoom` for a region; the docs discourage hotlinking daily builds and recommend copying to your own storage. [verified] Good for self-hosted control and offline-friendly pages.
- **OpenStreetMap standard tiles** (`tile.openstreetmap.org`): policy prohibits heavy use, bulk downloading, pre-seeding, and offline "save area"; commercial or donation-seeking services face the highest risk of being blocked; best effort, no guarantee. [verified] **Do not rely on it** for an advocacy site that may see spikes.
- Basemap styling note: keep the basemap neutral and low-contrast so the cession layer reads clearly, and avoid basemap labels that assert modern borders as if they were historical.

## 4. Time slider architecture

### 4.1 Data model

Precompute, in the build pipeline, a flat feature property set per cession polygon:
- `cessnum` (Royce cession number, string key [verified field])
- `t_first` (decimal year of the earliest `cessdate`), `t_last`, and an array of all dates [dates verified as `cessdate1-5`]
- `legal_type`: treaty / agreement / statute / executive order / unratified, derived from the linked Kappler, statute, and executive-order URL fields (`link_federal_statute`, `link_executive_order`, Kappler links are verified fields) and checked by hand
- `kind`: cession vs reservation (the Royce set includes both "cessions and reservations" [verified]; the attribute that distinguishes them is unverified and may need derivation)
- `tribes`, `present_day_tribes`, `states`, `kappler_url`, `royce_schedule_url` (fields verified)
- `geometry_quality`: flag the seven IDs without geometry, and any hand-reviewed fixes

Join the many-to-one table by `cessnum`; keep the lightweight geometry file separate from the heavy attribute JSON.

### 4.2 Client behavior (MapLibre)

- One GeoJSON/TopoJSON source with `promoteId: "cessnum"` where appropriate.
- Slider value `T` (year). Filter expression: `["<=", ["get","t_first"], T]` for cumulative "ceded by year T"; use `feature-state` to highlight cessions in a ±N-year window; use `setFilter` on slider `input` events throttled with `requestAnimationFrame`. MapLibre's own "Create a time slider" example uses the same filter-by-range pattern. [verified: example exists; the code sketch is mine]
- Modes: **cumulative** (everything ceded by T), **window** (events within a span), **snapshot of treaties** (point/centroid markers for treaty signings, which come from the treaty list, not Royce geometry).
- Play/pause with `prefers-reduced-motion` respected; keyboard-operable slider (native `<input type="range">` plus `aria-valuetext` such as "1868"); a text alternative listing the events for the selected year.
- Shareable state in the URL hash (`#t=1868&z=5&lat=..&lng=..&layers=cessions,bia`); no tracking required.

### 4.3 Hazards specific to the data

- **Overlapping polygons.** Several tribes may be recorded as ceding the same area (and one cession polygon may reflect multiple dates). Summing polygon areas will overcount. Compute acreage through a **union** step in the pipeline, and report both figures with a clear label. [flag; not tested]
- **Date ambiguity.** `cessdate1-5` are "Royce Schedule Date" fields [verified]; whether they are signing, ratification, or proclamation dates varies and is unconfirmed. Display "date per Royce's Schedule" and link to the Kappler record for the treaty's own dates.
- **End of coverage in 1894.** Royce ends there [verified]. After 1894 the slider must visibly change mode (for example "cession data ends 1894; later periods shown through statutes and cases") rather than show a misleading empty map.
- **Cessions are the federal view.** The layer shows what the US recorded as ceded, not Indigenous territory, and not what tribes would say. Pair with tribal sources, and keep NLD separate (E1).
- **Counterfactual layers.** Honored-treaty maps must be generated from treaty-text boundaries and Royce reservations, never by editing NLD polygons (E1 section 3). Store them as a separate, plainly labeled layer with provenance and an uncertainty note. Keep a flag for consultation before publishing a counterfactual for any specific nation.

### 4.4 Build pipeline (GitHub Actions)

1. Pull USFS data (REST query with `f=geojson`; mind the 2,000-record page limit and `exceededTransferLimit` [verified]) or the Hub's Shapefile/GeoJSON download.
2. Normalize: reproject to WGS84, drop unused fields, derive `t_first`, `legal_type`, join attributes.
3. Simplify and quantize with Mapshaper or equivalent (the MapLibre guide names Turf, Reduce GeoJSON, and Mapshaper [verified]); export TopoJSON or GeoJSON.
4. Optional: tile heavier layers with tippecanoe into PMTiles `[from-memory]` (tippecanoe is not described on the PMTiles page I read).
5. Validate (geometry validity, bounds, counts: 718 features, seven known gaps) and commit with a checksum and `PROVENANCE.md`.
6. Deploy the static site via a GitHub Actions workflow (which also avoids the 10-builds-per-hour soft limit [verified]).

## 5. Dynamic pieces and the Native Land question

- **Proxy for NLD** (only after permission; see E1): Cloudflare Worker on the Free plan: 100,000 requests/day, 10 ms CPU per request, 50 subrequests per invocation. [verified] A pass-through lookup fits within these limits. Worker secrets hold the NLD key; the Worker restricts origins, methods, and parameters, and sends `Cache-Control: no-store`.
- **Cache API caveat:** Workers' Cache API (512 MB object max on Free [verified]) would count as storing NLD data; do not enable it for NLD without permission.
- **Search over the graph:** precompute a small client-side index (for example a JSON of names and slugs) rather than adding a server.
- **Contact/feedback forms and corrections:** use a third-party form endpoint or a GitHub issue template; avoid collecting personal data on Pages.
- **If traffic exceeds Pages limits:** move static assets (the PMTiles and GeoJSON) to an object store behind a CDN while keeping the HTML on Pages. Cost and egress terms for specific vendors were not researched here. [unverified]

## 6. Fallbacks if parts are infeasible

| Problem | Fallback |
|---|---|
| NLD refuses or does not answer | Tier 0 in E1: acknowledgement + outbound link; use BIA/Census for current reservations and tribal sites for self-description |
| NLD CORS blocked and no relay allowed | User-supplied key panel for educators, or drop the live lookup |
| USFS license ambiguity | Contact the USFS data steward; the underlying Royce maps are public domain at LOC, so worst case, re-georeference, which is heavy work |
| USFS dataset has gaps or errors | Document the seven missing IDs; contribute corrections upstream to the agency contact; show "geometry unavailable" in the UI |
| Basemap provider outage | Switch the style URL; keep a self-hosted low-zoom PMTiles extract as backup |
| Mobile performance | Reduce vertices further at low zoom; avoid redrawing all polygons on each slider tick; disable shadows/labels while dragging |
| Pages bandwidth cap | CDN or object storage for large files |

## 7. Accessibility, ethics, and performance checklist

- Contrast and non-color encoding for legal types (patterns or labels, not color alone).
- Always show a standing note: "Boundaries are approximate, from Royce's 1899 maps georeferenced by the US Forest Service; not legal descriptions."
- Offer a no-JS fallback: static pages per treaty (generated at build time) with the text, citations, and a small static map image, so content remains readable without WebGL.
- No sacred-site layers; no precise coordinates for culturally sensitive places.
- Respect `prefers-reduced-motion`; do not auto-play.
- Performance budget (a proposal, not a standard): initial map payload under about 3 MB gzipped, interactive on a mid-range phone.

## Sources

- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- PMTiles overview: https://docs.protomaps.com/pmtiles/ ; MapLibre integration: https://docs.protomaps.com/pmtiles/maplibre ; basemap downloads: https://docs.protomaps.com/basemaps/downloads
- Third-party PMTiles-on-GitHub-Pages tutorial: https://dev.to/ronitjadhav/how-to-host-and-test-pmtiles-on-github-pages-the-easiest-way-to-serve-maps-without-a-server-2ei8
- MapLibre examples index: https://maplibre.org/maplibre-gl-js/docs/examples/ (time slider: https://maplibre.org/maplibre-gl-js/docs/examples/create-a-time-slider/ ; PMTiles: https://maplibre.org/maplibre-gl-js/docs/examples/pmtiles-source-and-protocol/) ; large-data guide: https://maplibre.org/maplibre-gl-js/docs/guides/large-data/
- OpenFreeMap: https://openfreemap.org/
- OSM tile usage policy: https://operations.osmfoundation.org/policies/tiles/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- USFS cession service and REST queries (count 718; sample features): https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/1
- Felt map built from NLD data (feature count): https://felt.com/map/yjDGyak0RwywqfggW9CWLJA
- Land-Grab U (parcel count): https://www.hcn.org/articles/indigenous-affairs-education-how-we-investigated-the-land-grant-university-system
- See E1 and E2 for data-source and NLD citations.

## Confidence & Gaps

Overall confidence: **medium** (high on hosting limits and library capabilities; low on measured payload sizes and live API behavior).

- **No measured file sizes.** The sandbox blocked downloads; the 1-10 MB Royce figure is extrapolated from three sample features and may be off by a factor of several. Measure with `curl -sI` and Mapshaper on a normal machine. [estimate]
- **NLD CORS and response schema** untested. [unverified]
- **GitHub Pages range-request support and per-file limits** come from a third-party tutorial, not GitHub documentation. [unverified]
- **tippecanoe, Leaflet/deck.gl license and version details, Mapbox terms** are from memory or not researched. [from-memory]
- **Basemap sizes** for a US extract are unpublished in what I read. [unverified]
- **Object-storage/CDN pricing and egress** not researched.
- **Overlap and duplicate-coverage behavior** of the Royce polygons untested.
- The time-slider design is a proposal; it has not been prototyped.
- Fetched pages were summarized by a tool, not read as raw files.
