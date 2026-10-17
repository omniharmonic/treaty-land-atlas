---
title: Native Land Digital Integration Specification (tiered, permission-gated, removable)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# J2. Native Land Digital (NLD) Integration Specification

Design Agent J, file 2 of 6. Implements the recommendations in `docs/data/E1-native-land-api-integration.md` (read it first; this file does not repeat its evidence). Companions: J1 (architecture), J3 (repo/CI), J4 (licensing gates), J5 (roadmap).

Tags: `[verified]` (stated in E1 or checked this session), `[from-memory]`, `[unverified]`, `[proposal]`.

This is a design, not legal advice. Nothing in this file sends anything to NLD. The email in section 7 is a **draft for the owner to review**.

---

## 1. Principles (carried from E1)

1. NLD is a **partner to ask**, not a dataset to scrape. The API is free but gated by a key and by acceptance of the NLD Data Sovereignty Treaty; the treaty bars commercial use, charging, altering boundaries without community approval, misrepresentation, and "storing or distributing API data without explicit permission" [verified, E1 s.3].
2. The treaty and the "CC0" label conflict, and NLD does not reconcile them [disputed, E1 s.3.1]. Until NLD says otherwise in writing, the stricter terms govern anything that touches the API, the downloadable GeoJSON, the Mapbox tileset, and the ArcGIS layer.
3. **The site must work completely with the integration disabled.** NLD is an optional, removable layer. Historical geometry comes from USFS/Royce, never from NLD (NLD has no documented time dimension and its "Cession NNN" treaty entries are not documented as Royce numbers [E1 s.5]).
4. **Never alter NLD polygons**: no clipping, merging, simplification, buffering, re-projection beyond what a map renderer does to display, no derived areas, no counterfactuals computed from them.
5. **Never put the API key in the repository, the build output, or client JavaScript.**
6. NLD data is shown in its own layer group, visually and verbally separate from cession polygons, with the standing note: "Territories are self-described and contemporary; cessions are the federal government's record. They are different kinds of claims." [E1 s.8]
7. No legal inference, no "who owned this land at date X" statements from NLD shapes.
8. Attribution and the NLD disclaimer appear beside every NLD-derived result, every time.

---

## 2. Tier plan

| Tier | What ships | Permission needed from NLD | Code state at launch |
|---|---|---|---|
| **0** | "Whose land is this?" panel: acknowledgement text, NLD attribution and disclaimer, and an **outbound link** to native-land.ca for the selected place. No NLD data fetched, stored, or displayed | No | **Implemented and enabled** |
| **1** | Live point lookup (territories, optionally languages) when a visitor selects a place, via a no-store relay (Cloudflare Worker) that holds the key | **Yes, written**, covering the relay pattern and donation-link adjacency | Implemented behind flag, **disabled**; relay code present but not deployed |
| **2** | Snapshot of the territories layer for a toggle-able context overlay | **Yes, written**, covering storage, refresh cadence, redistribution in the repo and on Pages, corrections flow | Interface stub only; no data pipeline for NLD |
| **3** | Visitor pastes their own key (educator panel); calls go browser -> NLD directly; key in `sessionStorage` | No (each visitor accepts the treaty themselves) but CORS unverified | Implemented behind flag, **disabled**; enable only after the CORS test in section 8 passes |

**Rule:** the production build enables a tier only if `integrations.config.json` records a matching permission entry (section 5). A test and a CI check enforce this (section 9).

---

## 3. Code interface (provider abstraction)

Location: `src/integrations/territory/`. Everything outside this folder talks to the interface only; no other file imports NLD URLs, types, or fetch code.

```ts
// src/integrations/territory/types.ts

export type TierId = 0 | 1 | 2 | 3;

export type ProviderId =
  | 'none'          // integration off: renders nothing about NLD, only a generic note
  | 'nld-outlink'   // Tier 0
  | 'nld-relay'     // Tier 1
  | 'nld-snapshot'  // Tier 2
  | 'nld-user-key'; // Tier 3

export interface LatLng { lat: number; lng: number; }

/** What the caller wants to know. Coordinates are place-level (county or treaty-area centroid),
 *  rounded to 2 decimals before leaving the browser (about 1 km). Never a street address,
 *  never a device location. */
export interface PlaceQuery {
  point: LatLng;
  placeLabel: string;              // e.g. "Boulder County, Colorado" (display only, never sent)
  want: Array<'territories' | 'languages'>;
  zoomHint?: number;
}

export interface Attribution {
  creditLine: string;              // e.g. "Territory and language context: Native Land Digital (native-land.ca)"
  disclaimer: string;              // NLD-approved wording once known; E1 s.4 draft until then
  acknowledgement: string;         // "Indigenous communities are the rightful stewards of this data."
  sourceUrl: string;               // https://native-land.ca/
  separationNote: string;          // the standing note in principle 6
}

export interface TerritoryRef {
  /** Passed through exactly as returned. We do not rename, merge, or normalize. */
  name: string;
  slug?: string;
  category: 'territories' | 'languages';
  descriptionUrl?: string;         // NLD page for this entry, if the response provides it
  raw: Readonly<unknown>;          // untouched provider payload for this entry; never mutated
}

export type UnavailableReason =
  | 'disabled'            // provider is 'none' or tier not permitted
  | 'permission_missing'  // config has no matching permission record
  | 'revoked'             // relay returned 401/403/410 or kill switch set
  | 'key_missing'         // Tier 3 and visitor has not provided a key
  | 'cors_blocked'
  | 'rate_limited'
  | 'network'
  | 'bad_response';

export type LookupResult =
  | { kind: 'ok'; refs: TerritoryRef[]; retrievedAt: string; attribution: Attribution }
  | { kind: 'link_only'; url: string; attribution: Attribution }   // Tier 0
  | { kind: 'unavailable'; reason: UnavailableReason; fallbackUrl?: string; attribution: Attribution };

export interface OverlayHandle {
  /** Tier 2 only. A MapLibre-ready source description. Geometry is byte-for-byte what NLD permitted. */
  sourceId: string;
  attribution: Attribution;
  asOf: string;                    // snapshot date, shown in UI
}

export type ProviderStatus =
  | { state: 'off' }
  | { state: 'ready' }
  | { state: 'degraded'; reason: UnavailableReason };

export interface TerritoryProvider {
  readonly id: ProviderId;
  readonly tier: TierId;
  readonly capabilities: { pointLookup: boolean; overlay: boolean; languages: boolean; outlink: boolean };
  status(): ProviderStatus;
  attribution(): Attribution;
  /** Always safe to call. Never throws; returns kind:'unavailable' instead. */
  lookup(query: PlaceQuery, signal?: AbortSignal): Promise<LookupResult>;
  /** Tier 2 only. Absent on other providers. */
  overlay?(): Promise<OverlayHandle | null>;
  /** URL to open native-land.ca for this place; Tier 0 and a fallback for all tiers. */
  outlink(query: PlaceQuery): string;
}
```

```ts
// src/integrations/territory/config.ts
export interface PermissionRecord {
  granted: boolean;
  grantedOn: string | null;        // ISO date
  referenceId: string | null;      // id of the stored written reply, e.g. "NLD-2026-11-14-reply"
  scope: Array<'relay' | 'snapshot' | 'languages' | 'donation_links_adjacent' | 'browser_cache'>;
  notes: string;
}

export interface TerritoryIntegrationConfig {
  mode: 'off' | 'outlink' | 'relay' | 'snapshot' | 'user-key';   // default 'outlink'
  permission: PermissionRecord;                                  // default granted:false
  relayBaseUrl: string | null;                                   // only used when mode === 'relay'
  outlink: {
    urlTemplate: string;           // see section 4.1
    templateVerified: boolean;     // false until a human confirms the deep link works
    fallbackUrl: 'https://native-land.ca/';
  };
  attribution: Attribution;        // copy reviewed by NLD once they reply
}
```

```ts
// src/integrations/territory/registry.ts
export function createTerritoryProvider(cfg: TerritoryIntegrationConfig): TerritoryProvider {
  switch (cfg.mode) {
    case 'off':      return new NoneProvider(cfg);
    case 'outlink':  return new OutlinkProvider(cfg);                 // no permission needed
    case 'relay':    return requirePermission(cfg, ['relay']) ? new RelayProvider(cfg) : new NoneProvider(cfg, 'permission_missing');
    case 'snapshot': return requirePermission(cfg, ['snapshot']) ? new SnapshotProvider(cfg) : new NoneProvider(cfg, 'permission_missing');
    case 'user-key': return new UserKeyProvider(cfg);                 // flag-gated; see section 8
  }
}
```

Behavior rules for implementers:
- `requirePermission` returns true only if `cfg.permission.granted === true`, `referenceId` is non-empty, and every required scope is in `scope`. Otherwise the factory degrades to a provider whose `lookup` returns `{kind:'unavailable', reason:'permission_missing'}` and whose UI shows the Tier 0 panel.
- Providers other than `none` and `nld-outlink` are loaded with dynamic `import()` so they are absent from the bundle when the mode is off (tree-shaken). Add a build assertion: if `mode` is `off` or `outlink`, the string `native-land.ca/api` must not appear in `dist/` (see section 9).
- All provider code is wrapped so exceptions become `kind:'unavailable'`. The map and every page must render normally with `NoneProvider`.
- `lookup` rounds coordinates to 2 decimals before any network call and never logs coordinates.
- A single Svelte component, `TerritoryContextPanel.svelte`, is the only UI consumer. It renders by `LookupResult.kind`:
  - `link_only` and `unavailable`: the Tier 0 content (acknowledgement, disclaimer, outbound link button "Open this area on Native Land Digital (new tab)").
  - `ok`: list of `TerritoryRef` names exactly as returned, each linking to its NLD page when provided, the attribution block, the separation note, "Contemporary and self-described; not legal boundaries."
- A `territory-context` map layer group exists only for Tier 2 and is always drawn **below** cession layers, with its own legend entry, hatch-free flat style, and a toggle that is **off by default** (G2 s.5: NLD is context, not basis).

---

## 4. Tier details

### 4.1 Tier 0: acknowledgement and outbound link (ships now)

- Panel title: "Whose land is this?" Body: acknowledgement text (E1 s.4 draft, to be replaced with NLD-reviewed wording): "Indigenous territory, language, and treaty context on this page comes from Native Land Digital (native-land.ca), an Indigenous-led nonprofit. Their maps do not represent or intend to represent official or legal boundaries of any Indigenous nation, and are not a legal or academic source. We acknowledge Indigenous communities as the rightful stewards of this data. For definitive information, contact the nations directly." Add, in the same panel, links to the nations' own websites from `crosswalks/nations.csv` where present (brief principle 4).
- Outbound link construction: `outlink()` fills `cfg.outlink.urlTemplate`. E1 notes the exact deep-link parameters for centering the NLD map are `[from-memory]`. **Therefore** default `templateVerified: false` and `urlTemplate: "https://native-land.ca/?maps=territories&position={lat},{lng}&zoom={zoom}"` is a *candidate to verify by hand*; while unverified, `outlink()` returns `fallbackUrl` (the plain home page) and the UI says "Opens the Native Land Digital map; search for this place there." The owner or a reviewer tests the candidate in a browser and flips the flag in config.
- Place-level only: the `point` passed is a county or treaty-area centroid (G2 s.6 guardrail), never a visitor-entered address.
- No NLD data is fetched, so no key and no storage question arises.

### 4.2 Tier 1: live lookup through a no-store relay (needs written permission)

Browser -> relay -> NLD. The browser cannot call NLD directly with a secret; CORS behavior is unverified (E1 s.6.1); GET requests carry the key in the URL (`key=` query parameter; no header option documented) [verified, E1 s.2.1].

Relay (`workers/nld-relay/`, Cloudflare Worker; Free plan limits: 100,000 requests/day, 10 ms CPU per request, 50 subrequests [verified, E1/E3]):

| Requirement | Detail |
|---|---|
| Secret | `NLD_KEY` stored with `wrangler secret put`; never in `wrangler.toml`, git, CI logs, or responses |
| Origin allowlist | Only the production site origin (and `localhost` in dev builds); other origins get 403 |
| Method / path | `GET /v1/lookup?lat=..&lng=..&maps=..` only |
| Parameter validation | `lat` in [-90, 90], `lng` in [-180, 180], rounded to 2 decimals; `maps` subset of `territories,languages` (the `treaties` category is excluded: undocumented, E1 s.5 / A3 s.2.4); reject anything else |
| Upstream call | `GET https://native-land.ca/api/index.php?maps=...&position=lat,lng&key=...` [verified endpoint form, E1 s.2] |
| Passthrough | Response body returned **verbatim** (no field edits, no geometry processing). Add headers only: `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `X-Atlas-Source: native-land.ca` |
| No storage | No Cache API, KV, D1, R2, or logs of coordinates or responses. Disable request logging for the Worker |
| Abuse control | Per-IP rate limit (Workers rate-limiting binding `[from-memory]`), global daily cap below the Free plan limit, and a **kill switch**: env var `NLD_ENABLED=false` returns `503 {"status":"disabled"}` |
| Revocation handling | If NLD answers 401/403 (key revoked), the relay returns `410 {"status":"revoked"}` and the client switches to Tier 0 for the session |
| Client | `RelayProvider` calls `relayBaseUrl`; maps statuses to `UnavailableReason` |

CSP: add the relay origin to `connect-src` only in builds where `mode === 'relay'`.

### 4.3 Tier 2: snapshot overlay (needs written permission, likely not granted)

Do **not** build the pipeline stage until NLD invites it. The interface stub exists (`SnapshotProvider` returns `unavailable/disabled`). If permission arrives, the written terms define: refresh cadence, whether the repo may contain the file, hosting location, correction flow, and whether the Mapbox/ArcGIS products are the preferred route (E1 s.7). Until then: no NLD GeoJSON in the repo, in Release assets, in `public/`, or in any cache. If built later, the stage copies the permitted file **byte-for-byte** (checksum recorded), with no simplification; a test verifies the shipped file hash equals the fetched hash.

### 4.4 Tier 3: visitor-supplied key (optional, off by default)

- A collapsed "Advanced: use your own Native Land Digital API key" panel for educators. The visitor signs up with NLD and accepts the treaty themselves [verified, E1 s.2.1].
- Key held in JavaScript memory and `sessionStorage` only, never `localStorage`, never sent to any origin except `native-land.ca`, never logged.
- The call is direct browser -> NLD, so it works only if NLD sends CORS headers (unverified). If the request fails with a CORS error the panel says so plainly and links to NLD.
- Because the key travels in a URL query string, the panel warns that it can appear in browser history.
- Ship disabled (`mode: 'user-key'` only reachable through a build flag `ATLAS_ENABLE_USER_KEY=1`) until the CORS test in section 8 is done and the owner opts in.

---

## 5. Permission record and storage of written replies

- `integrations.config.json` (committed) holds the `PermissionRecord`. Default: `granted: false`.
- The actual written reply from NLD is stored **privately** by the owner and referenced by id only; if NLD agrees to publish their wording, copy it to `docs/release/nld-permission.md`.
- `data/licenses/registry.yaml` has an `nld` entry with `status: pending` until the permission is recorded (J4 gate G-02). The release check fails if `mode` is above Tier 0 while `status != cleared`.

---

## 6. What must be asked of NLD in writing

Ask these, and record the answers verbatim in the permission file. Prioritized: 1-6 are required to proceed beyond Tier 0.

1. **Instrument.** Which instrument governs the downloadable GeoJSON, the Mapbox tileset, and the ArcGIS layer: the Data Sovereignty Treaty or CC0? (E1 s.3.1)
2. **Relay.** Is a no-store pass-through relay (server-side key; visitor coordinates rounded to about 1 km; no logging; response returned unmodified) acceptable for a free, non-commercial educational site?
3. **Snapshot.** Is a periodic snapshot of the territories layer permissible? If yes: conditions, cadence, hosting location, whether it may live in a public repository, and how corrections flow back.
4. **Browser caching.** May visitors' browsers cache responses (HTTP cache, in-memory), or must responses be `no-store`?
5. **Donation links.** The site links to third-party Land Back organizations' own donation pages; the project receives no revenue, runs no ads, and has no paywall. Are outbound donation links on the same page or site as NLD-derived results acceptable?
6. **Attribution wording.** Is there required credit-line and disclaimer wording? Our draft is in section 7 for review. NLD's FAQ gives a credit line, "Used with permission for educational and non-commercial purposes" [verified, A3 s.2.4]; confirm whether that applies.
7. **Adjacency to cession data.** Is there a preferred way to show NLD territories near federal cession polygons without implying equivalence? Do they want the separation note we propose?
8. **Names and slugs.** May we keep a crosswalk of NLD slugs to our nation records (our own table; no NLD geometry) and use NLD entry names as link text?
9. **Key handling on static sites.** Is there a header-based key option or a browser-safe, origin-restricted key? Do you send CORS headers? What request volume would you consider excessive? (rate limits are unpublished [verified, E1 s.2.1])
10. **Treaties layer.** Is the treaties layer documented anywhere (coverage, sources, dates, update cadence)? We will not use it until it is.
11. **Nations' control.** If nations that claim their NLD page request changes, how will we learn of it? Can nations featured on our site be notified?
12. **Revocation.** What notice, if any, will you give before revoking a key, and what should we do with any data on revocation?
13. **Listing.** Would you like to list the integration, and may we see how our site presents NLD before launch?

Contact route (E1 s.1): Discord is NLD's stated preference because email replies are slow; API support email `tech@native-land.ca` appears in NLD's April 2025 announcement but was not tested [verified source, untested address]. Use both: post a short message on Discord linking to the email, and send the email.

---

## 7. Draft permission-request message (for the owner to review; do not send automatically)

**Subject:** Request: permission and guidance for using Native Land Digital in a free educational treaty atlas

> Hello Native Land Digital team,
>
> I'm Benjamin Life (@omniharmonic). I'm building a free, non-commercial, educational website, currently called the Treaty Land Atlas: a time-aware map and reference of United States treaty law with Native nations, with plain-language explanations of how and when treaties were altered or broken, and links to Land Back organizations that people can learn from and support. The site has no ads, no paywall, no sales, and does not process donations; it only links to each organization's own page. I am not Indigenous-led, and I won't present the project that way. The project is being designed with a plan for tribal review and advisory input.
>
> Historical boundaries on the site come from the US Forest Service's digitization of Royce's 1899 cession maps. I would like to give visitors present-day context for a place, and I'd much rather ask you than assume. Today the site only links out to native-land.ca with your attribution and disclaimer, and stores no Native Land data.
>
> I would like to know whether you would be open to:
> 1. a live lookup of territories (and possibly languages) when a visitor selects a county-level place, through a small server-side relay that holds the API key, rounds coordinates to about 1 km, stores and logs nothing, and returns your response unmodified; and, if you prefer, 2. a periodic snapshot of the territories layer.
>
> We would never alter your boundaries, never use them to make legal or ownership claims, show them in a separate layer from federal cession data with a note that they are different kinds of claims, and show your credit line and disclaimer next to every result. I also have a few questions about the terms (which license governs the downloads, whether browser caching and donation links near your data are acceptable, and what wording you want for attribution) that I've listed below.
>
> [Paste the questions from J2 section 6 here, trimmed to the ones the owner wants to ask.]
>
> I'd be glad to share the site with you before launch and to follow whatever process you prefer. If email is the wrong channel, please point me to the right one.
>
> Thank you for the work you do.
>
> Benjamin Life (@omniharmonic)
> [owner's preferred public contact]

Shorter Discord version (for the owner to adapt): "Hi, I'm Benjamin Life (@omniharmonic). I'm building a free, non-commercial educational treaty atlas and would like to ask about permitted use of the NLD API and attribution wording. I've sent details to tech@native-land.ca. Who is the best person to talk to?"

Do not mention or attribute the project to any organization; per the brief the attribution is Benjamin Life (@omniharmonic).

---

## 8. Owner / reviewer test: CORS and deep links (run on a normal machine, using your own key)

Do not paste the key into chat or commit it. Put it in a local, git-ignored `.env.local` as `NLD_KEY`. Source: E1 s.6.1.

```bash
# 1. Does the API send CORS headers for our origin? (look for Access-Control-Allow-Origin)
curl -i -H "Origin: https://example-atlas-domain.org" \
  "https://native-land.ca/api/index.php?maps=territories&position=40.015,-105.27&key=$NLD_KEY"

# 2. Preflight for POST
curl -i -X OPTIONS -H "Origin: https://example-atlas-domain.org" \
  -H "Access-Control-Request-Method: POST" \
  "https://native-land.ca/api/index.php"
```

Replace the origin with the real site origin once chosen. Record results (headers only; no key) in `docs/release/nld-cors-test.md`. Separately open the candidate deep link from section 4.1 in a browser and record whether it centers the map; set `templateVerified` accordingly.

Running these tests does not store NLD data. The key remains personal to the account holder; do not give it to a coding agent unless the owner decides to, and never in a prompt.

---

## 9. Enforcement: tests and CI checks

| Check | Where | Fails when |
|---|---|---|
| `permission-gate.test.ts` | Vitest | A provider with tier >= 1 is constructed while `permission.granted` is false or scope is missing |
| `disabled-mode.e2e.ts` | Playwright | With `mode: 'off'` or `'outlink'`, any request to `native-land.ca` or the relay origin occurs, or any page errors |
| `passthrough.test.ts` | Vitest | A relay/snapshot response is modified (deep-equal of input vs output fails; geometry hash differs) |
| `no-geometry-ops.lint` | ESLint `no-restricted-imports` | Any file under `src/integrations/territory/` imports `@turf/*`, `mapshaper`, `d3-geo`, or `topojson-*` |
| `no-nld-data-in-repo` | CI script | Any tracked file or `dist/` file matches `nld*.geojson`, `*native-land*.json`, or contains the string `native-land.ca/api` while mode is `off`/`outlink` |
| `no-secrets` | gitleaks + custom regex | A string resembling the NLD key, `NLD_KEY=` with a value, or `key=` followed by a long token in tracked files |
| `registry-gate` | `data:validate` | `mode` is above Tier 0 while `licenses/registry.yaml` `nld.status != cleared` (production builds only) |
| `csp-check` | build script | `connect-src` includes the relay origin while mode is not `relay` |
| `attribution-present` | Playwright | Any state showing NLD results lacks the credit line, disclaimer, and separation note |

---

## 10. Other fallback notes (from E1)

- Keep Tier 0 permanently if NLD declines or does not answer: Royce/USFS for history, Census/BIA for present-day reservations, and each nation's own site for self-description.
- The public Mapbox tileset and ArcGIS layer are not a loophole: their terms are silent and may not be exempt from the treaty (E1 s.7). Do not use either without NLD's written OK. Mapbox use would also bring Mapbox account/terms questions (ADR-003 avoids Mapbox).
- The embed iframe puts the key in page HTML: not acceptable for a public site.
- If NLD later documents a time dimension or a treaties layer with dates and sources, re-evaluate; until then, no NLD data appears on the time slider.

## Sources

E1 (primary evidence; its Sources section lists the NLD pages consulted), E3 (Worker limits; hosting), A3 s.2.4 (NLD FAQ credit line; "should not be used for legal claims"), G2 s.5 and s.6 (separation and place-level guardrails), G3 (consultation and data sovereignty). No NLD page was fetched in this session; the research sandbox could not reach native-land.ca (E1 s.6.1).

## Confidence & Gaps

Confidence: medium. The interface and enforcement plan are design proposals, not prototyped. Unverified: NLD CORS behavior, response schema, deep-link URL parameters, whether `tech@native-land.ca` is monitored, Workers rate-limiting binding details, and every term NLD has not yet clarified in writing. The relay should not be built until permission exists; building the interface and the disabled stubs now costs little and keeps the architecture ready.
