# Treaty Land Atlas: codebase survey for the "land status" rework

Repo: `/home/user/treaty-land-atlas` (not modified; all builds ran in a scratch copy at
`/tmp/claude-0/-home-user/d66bb275-6adb-522a-9fbd-8e5b55892ae3/scratchpad/psl/repo-copy`).

Goal: stop the map from implying that every acre was lawfully ceded by treaty, and show at a glance
(a) land promised or reserved by treaty, (b) land never ceded or taken with no instrument, (c) land taken
by statute or executive order, (d) unratified-treaty areas, (e) instruments made under duress or with
contested signers, excluded parties or hostages, (f) massacre sites linked to cessions, (g) broken
promises (promised, then taken).

---

## 1. How the map works now

### 1.1 Data flow (end to end)

```
USFS raw (data/sources/raw, git-ignored)
  └─ npm run data:geometry  → pipeline/src/geometry/index.ts  processCessions()/buildEvents()
       data/derived/cessions.json        (717 polygon features; props: id, n, t0, t1, lt, tier)
       data/derived/cession-events.json  (724 records; legal_type etc.)
       data/derived/cession-cells.json   (landloss.ts writeCessionCells(): 0.1° grid cells per area)
       data/derived/today-aiannh.json    (Census AIANNH, prop k = land|statistical|hawaiian_home_land)
  └─ npm run graph:build → scripts/build_graph.py  build_geofeatures() → GeoFeature nodes + depicts / attributed_to_nation edges
       (reads crosswalks/instrument-royce.csv, crosswalks/royce-entry-roles.csv, royce-area-overrides.csv)
  └─ tsx pipeline/src/cli.ts build → emit (pipeline/src/emit/index.ts emit())
       tables/cession-stories.json   ← story.ts cessionStories()   (how, status, ceded_year, entries…)
       tables/land-loss.json         ← story.ts landLoss()/series() (acres by year × how, by nation)
       layers/cessions.<hash>.json   ← emit/index.ts:313 adds how, nations, kept; rewrites t0
       layers/cession-events.<hash>.json ← emit/index.ts:332 rewrites t_first, kept
       manifest.json (layers map)
  └─ browser: src/islands/MapApp.svelte onMount() fetches manifest → layers + tables
```

`public/data/` does not exist in the checkout (git-ignored; `public/data/layers/*` only exists after
`data:build`). `public/map/style-atlas-{light,dark}.json` are committed, produced by
`scripts/build-map-style.mjs` (fetches OpenFreeMap Positron at run time — network needed; only the basemap,
plus `style.state` defaults `year, win, cut, honored, cessions, today`).

### 1.2 Properties on each cession feature

| Stage | Keys |
|---|---|
| `data/derived/cessions.json` (geometry/index.ts ~L180) | `id` (geo-royce-N), `n` (cessnum), `t0` (first Royce date, decimal year), `t1` (last), `lt` (legal_type: treaty_or_agreement / statute / executive_order / unknown), `tier` ("T3") |
| Published `layers/cessions.*.json` (emit/index.ts L313-330) | above + `how` (treaty, pressure, removal, unratified, congress, executive, unknown), `nations` (nation ids named in Royce schedule), `kept: true` (204 features) ; `t0` overwritten with `ceded_year + 0.5` when researched, and `t0 = 9999` when Royce status is `kept` |

Counts in the current build: `how` treaty 286, executive 113, pressure 100, congress 77, removal 75,
unratified 35, unknown 31; `lt` treaty_or_agreement 474, executive_order 113, statute 76, unknown 54.

`lt` is emitted but **never read by the map**. `t1` and `tier` are also unused by the client.

### 1.3 Map layers (MapApp.svelte L561-745)

Sources: `cessions` (promoteId id), `today`, `nld` (Native Land Digital, live through relay, never stored).
Global state from `applyState()` L192-199: `year`, `recent` (=5), `cut`, `honored`, `today`, `follow`.

| Layer id | Type | Filter | Paint |
|---|---|---|---|
| `held` | fill | record view, `t0 >= year+1` | `--held` (#9aa888) 0.42 — "Still held" (includes every `kept` reservation, t0=9999) |
| `ceded` | fill | record view, `t0 < year+1` | `howColor` = match `how` → `--how-*`; opacity bright for last 5 years |
| `ceded-line` | line | same | `--ink`, dash per `HOW_DASH` |
| `honored-ceded` | fill | honored, `t0 < cut+1` | `--ink-3` 0.16 (grey: treated as gone) |
| `honored-retained` | fill | honored, `t0 >= cut+1` | `--held` 0.45 |
| `honored-altered` | line | honored, after cut and ceded by slider year | `howColor`, dashed |
| `today-fill/line/statistical` | | `today` toggle | moss / river |
| `nld-fill/line/label` | | live lookups | NLD colors |

Click handlers on `ceded, held, honored-retained, honored-ceded` (L734).

### 1.4 Color choice

- `src/islands/map/how.ts`: `HOW_ORDER`, `HOW_LABEL`, `HOW_HELP`, `HOW_DASH` (7 categories).
- `src/styles/global.css` L36-43: `--how-treaty #e69f00, --how-pressure #d55e00, --how-removal #cc79a7,
  --how-unratified #f0e442, --how-congress #0072b2, --how-executive #56b4e9, --how-unknown #8a8f86,
  --held #9aa888` (dark-mode overrides further down the same file).
- `how` is decided in `pipeline/src/emit/story.ts`:
  - `instrumentHow()` L36: unratified (ratification_status) → overlay `how` (data/overlays/instruments/*.md:
    treaty_negotiated 257, treaty_under_pressure 52, removal 49, unratified 20, other 23, statute 3, EO 1) →
    instrument_type (executive_order / agreement_statutory) → linked Violation codes FORCED_REMOVAL / FRAUD_COERCION_NEGOTIATION → default `treaty`.
  - `cessionStories()` L111: picks the ceding instrument from royce-entry-roles (`ceded_by`/`taken_by` date),
    else first `depicts` instrument; with no instrument falls back to GeoFeature `legal_type`
    (statute→congress, executive_order→executive, treaty_or_agreement→treaty), else `unknown`.
- Note: I4 visual identity (docs/design/I4-visual-identity.md §3.2) reserves `#0072B2` for "Reservation as set aside",
  but the code uses it for `congress`. Any new "reserved" class needs a recolor of one of them.

### 1.5 Time slider

`src/islands/map/state.ts`: `YEAR_MIN 1784`, `YEAR_MAX 1894`, `WINDOWS`, `CUT_POINTS [1783,1830,1851,1868,1871,1887]`,
`LAYERS ['cessions','today']`, `parseHash/toHash` (`y m w v cut l c sel`), `inView(t0, s)`.
MapApp: `slider` (L125), `step`, `togglePlay` (700 ms/yr), visible list (L148) uses `inView` cumulatively.
A feature flips from `held` to `ceded` when `t0 < year+1`; "bright" for `RECENT=5` years.

### 1.6 "Honored through" counterfactual (G2)

- Radio "If the treaties had been honored" (L1011-1032) sets `s.view='honored'`, cut chips from `CUT_POINTS`.
- Logic is purely date-based: anything with `t0 <= cut` is grey "ceded"; anything later is green "retained";
  later losses get a colored outline. **Unratified, no-instrument and duress cessions before the cut are
  shown as legitimately gone**, which is exactly the overstatement the owner wants removed.
- `summary()` L171-176 text: "green is land Royce records as ceded only after X, which the agreements in force that year left with the nations".
- Method page: `src/pages/methods/honored-through.astro`.

### 1.7 LegalStatus panel

`src/islands/map/LegalStatus.svelte`: static `<dl>` of 8 plain-language categories (S1-S9 collapsed:
intact, diminished/disestablished, ICC money award, taking recognized, Sherrill bar, treaty rights enforceable,
returned, in litigation). Shown only in honored view. **Not data-driven**: GeoFeature `legal_status_today` (S1-S9)
exists in the schema but is never filled by build_graph.py.

### 1.8 Legend text

- Compact key (L984-989): "Still held" + `HOW_LABEL` for all but unknown: "Treaty or agreement", "Treaty under documented pressure",
  "Removal treaty", "Unratified treaty", "Act of Congress", "Executive order".
- "How to read the map" (L1050-1077): "Still held in that year: land the 1899 record shows as ceded only later. Watch it shrink." +
  `HOW_HELP` lines + "Bright shapes: ceded in the last 5 years. Older losses fade." + Royce caveat paragraph.
- `HOW_HELP.treaty` = "A ratified treaty or agreement. Many were signed under unequal terms; the record of each says what is known."
- LandMeter (`src/islands/map/LandMeter.svelte`) caption: "About N acres recorded as ceded by the end of YYYY" (L64-68), aria L73, note L94.

### 1.9 Other consumers of `how` / cession data (must move together)

`src/lib/land.ts` (`AreaStory`, `ROLE_PHRASE`, `ROLE_KIND`, `treatyLand()`, `landTotals()`),
`src/lib/svgmap.ts` (`homeMap()`, `storyMap()` group by `how`; `cededYears()`),
`src/lib/recordStory.ts` (HOW_PHRASE / HOW_ONE prose), `src/islands/WhereApp.svelte`,
`src/components/{LocatorMap,Narrative,NationLand,NationTimeline,TreatyTimeline,TreatyRecord,AreaStory,ReturnLand}.astro`,
`src/pages/story.astro`, `src/pages/index.astro`.

---

## 2. Data model

### 2.1 Schemas (`docs/design/schema/`)

- `entities.schema.json` (schema_version 0.2.0; `SCHEMA_VERSION` in build_graph.py L54). Node `$defs` do not set
  `additionalProperties:false`, so new fields will not fail validation, but should be declared.
  - **GeoFeature**: `royce_status` (ceded|taken|kept|unchecked), `geometry_role` (cession|reservation|territory_definition|reserved_right_area|judicial_title_area),
    `evidence_flags` E0-E7, `legal_status_today` S1-S9, `legal_type`, `legal_type_basis`, `statute_url`, `executive_order_url`, `dates`, `t_first`, `t_last`…
    build_graph sets `geometry_role = reservation` only when royce status is kept; `evidence_flags` and `legal_status_today` are never set.
  - **Instrument**: `instrument_type` (ratified_treaty, unratified_treaty, agreement_statutory, executive_order, …), `ratification_status`,
    `signatory_authority_disputed` (always `null`: "README gap 10"), `acreage_ceded`, `royce_cession_numbers`.
  - **Violation**: `violation_types` (B1 codes incl. FRAUD_COERCION_NEGOTIATION, NON_RATIFICATION, TREATY_PROMISE_UNFULFILLED, FORCED_REMOVAL,
    UNRECOGNIZED_TITLE, UNILATERAL_ABROGATION_STATUTE, DIMINISHMENT_DISESTABLISHMENT…; **no massacre/violence code**), `consent_status` (always null),
    `evidence_flags` (always []), `adjudicated_breach_label_allowed`.
- `edges.schema.json` `x-edge-types`: `cedes` and `reserves` (Instrument → GeoFeature) are defined but **never emitted**; `abrogates` defined, unused.
  Used: `depicts` (GeoFeature→Instrument, from instrument-royce.csv), `attributed_to_nation`, `violated_by` (Instrument→Violation),
  `enabled_by` (Violation→Statute/Instrument), `adjudicated_in`, `remedies`, ….
- Vocabulary rules already designed: I5 §2.4 maps E0-E7 to allowed words (E1 "Alteration (authority contested)", E2 "Unratified instrument",
  E3-E5 "Violation", E6 "Taking"); I3 §4.4 asks for a consent line on every alteration; I1 principle "Evidence flag decides the word".

### 2.2 scripts/build_graph.py

- `build_instruments()` L406, `build_violations()` L596 (sets `consent_status: None`, `evidence_flags: []`),
  `area_label()` L916 (labels like "Land of the X in Y, ceded 1874 (area 574)" / "taken" / "Reservation of the X"),
  `build_geofeatures()` L943 (royce roles first-row only, confidence high/medium, status != unclear),
  `add_crosswalk_edges()` L1316 (violated_by/enabled_by from violation-instrument-links.csv).
- Runtime in this container: ~88 s (README says ~10 s).

### 2.3 crosswalks/royce-entry-roles.csv → site

Columns: `id,date,role,instrument_id,quote,page,status,ceded_by,taken_by,summary,confidence,note` (1,172 rows, 724 areas).
- roles: reserved 514, ceded 408, confirmed 67, other 67, retroceded 57, described_or_recognized 36, ceded_part 19, us_reserved 4.
- per-area status (first row): ceded 452, kept 227, unclear 29, taken 16. Low-confidence rows are dropped in `royceRoles()`.
- Flow: `story.ts royceRoles()` → `cessionStories()` → `entries[]`, `status`, `ceded_year`, `royce_summary`, `plain`
  → `tables/cession-stories.json` → `emit/index.ts` sets `kept`, `t0` → map. `src/lib/land.ts ROLE_PHRASE/ROLE_KIND` render them on treaty pages.
- Flow into graph: `build_graph.py build_geofeatures()` → `royce_status`, `geometry_role`, label.

### 2.4 Are reserved areas drawn?

Partly. 205 areas whose Royce status is `kept` get `t0=9999` and render forever in the generic `held` green
("Still held"), **indistinguishable from land not yet taken**. Their `how` (e.g. 55 executive-order reservations,
19 from unratified treaties) is ignored. Reserved areas that were later ceded or retroceded (~243 areas
with a `reserved`/`described_or_recognized` entry and later loss) show only the loss; the promise is invisible on
the map (it is visible on treaty pages through `treatyLand()` steps).

### 2.5 Legal types

`legal_type` (geometry/index.ts `buildEvents()`: Kappler link → treaty_or_agreement; statute link → statute; EO link → executive_order; else unknown)
is used only as a **fallback** in `cessionStories()` when no instrument is linked. Instrument `instrument_type` / `ratification_status` drive `how`.

### 2.6 Existing evidence that can feed (e), (f), (g)

- (e) overlay `how: treaty_under_pressure` (52 instruments) with `how_basis`/`cautions`; 13 Violations FRAUD_COERCION_NEGOTIATION; treaties-seed `notes`
  ("legitimacy contested by Cheyenne chiefs not present", "[disputed]"); story.json mentions hostages (Fort Stanwix 1784, story.json L8, L575). No structured field.
- (f) Massacres appear only in prose: V020/V021 (Sand Creek, Fort Wise TLA-T-315), V036 (Bear River → Box Elder 1863), TLA-T-261, doctrine-reservation-system. No coordinates, no type.
- (g) overlay `promises[]` (`kept: broken 16, partly 22, unknown 43, kept 2`; 15 instruments with a broken promise) + royce roles reserved→ceded/retroceded.
- (b) Grid: Royce polygons cover ~1,597 million acres of the lower 48 (~1,900 million total), so ~300 million acres (e.g. much of Texas, pre-1784 colonies) have **no recorded cession at all** and are currently drawn as plain basemap.

---

## 3. Implementation map

### 3.1 Proposed classification

Two orthogonal fields, computed once in the pipeline (not in the browser):

**`land_status`** (feature prop `ls`), one per area, priority order top-down:

| value | meaning | source rule (story.ts) | approx. count now |
|---|---|---|---|
| `reserved_held` | (a) Promised/reserved by an instrument and still held in 1894 | royce status `kept` | 205 |
| `unratified` | (d) Claimed under a treaty the Senate never ratified | `how === 'unratified'` | 16 lost (+19 kept) |
| `statute` | (c) Taken by Act of Congress | `how === 'congress'` | 40 |
| `executive_order` | (c) Taken by executive order | `how === 'executive'` | 58 |
| `no_instrument` | (b) Taken with no instrument in the record | `how === 'unknown'` or researched entries with no instrument | 25 |
| `treaty_contested` | (e) Ratified treaty with documented duress, contested signers, excluded parties, hostages, fraud, removal | `how in (pressure, removal)` or any consent flag | 150 |
| `treaty_ratified` | Ratified treaty, consent not assessed | otherwise | 230 |
| `unchecked` (modifier) | Royce entry not yet researched | `status === 'unchecked'` (73) — keep as a separate boolean `uc` so it can be styled with a dotted edge |

Plus a separate polygon layer **`no_cession_recorded`** for (b): lower-48 land outside every Royce area.

**Flags** (feature props, short keys to keep the layer small):

| prop | type | meaning |
|---|---|---|
| `py` | number or null | year first promised/reserved/recognized (first `reserved` or `described_or_recognized` entry) |
| `bp` | 0/1 | (g) broken promise: `py` set and the area was later ceded/retroceded/taken (≈243) **or** a linked instrument overlay has `promises[].kept == 'broken'` naming this land |
| `ct` | string[] | (e) consent flags: `duress`, `military_presence`, `hostages`, `illegitimate_signers`, `excluded_parties`, `fraud`, `bribery_liquor_debt`, `removal` |
| `ef` | string | strongest G2 evidence flag for the ceding instrument (E0-E7); decides the word per I5 §2.4 |
| `ms` | string[] | (f) ids of massacre records linked to this area's taking |
| `by` | string or null | ceding instrument id (already in stories as `instrument`) |

### 3.2 Changes per goal

**Shared plumbing (do first)**
- `pipeline/src/emit/story.ts`: add `landStatus(story, inst, flags)`; extend `CessionStory` with `land_status, promised_year, broken, consent, evidence_flag, massacres`;
  in `series()`/`landLoss()` add `by_status` alongside `by_how` (keep `by_how` until all consumers move).
- `pipeline/src/emit/index.ts` L313-330: write `ls, py, bp, ct, ef, ms, uc` onto each feature; L332-341 mirror on cession-events.
  Keep `t0 = 9999` for kept areas but stop relying on it to mean "reserved" (use `ls`).
- `src/islands/map/how.ts` → add `src/islands/map/status.ts` (`STATUS_ORDER`, `STATUS_LABEL`, `STATUS_HELP`, `STATUS_DASH`, `CONSENT_LABEL`); keep how.ts exports until consumers migrate.
- `src/styles/global.css` L36-43 (+ dark block): add `--ls-reserved_held`, `--ls-unratified`, `--ls-statute`, `--ls-executive_order`, `--ls-no_instrument`,
  `--ls-treaty_contested`, `--ls-treaty_ratified`, `--ls-no_cession`. Resolve the `#0072B2` clash (I4 says blue = reservation).
- `docs/design/schema/entities.schema.json`: declare GeoFeature `land_status`, `promised_year`, `broken_promise`, `consent_flags`; Instrument `consent_flags`; bump `SCHEMA_VERSION` 0.2.0→0.3.0 in build_graph.py L54 and the schema description.
- `src/islands/map/state.ts`: `LAYERS = ['cessions','today','promises','massacres','unceded']`; optional `colorBy: 'status'|'how'` param. Keep default `layers` = `{'cessions'}` so `toHash(DEFAULT_STATE) === '#y=1868'` stays true.

**(a) Promised/reserved land**
- MapApp.svelte: split `held` (L603-609) into `held` (`ls != 'reserved_held'`, still-to-be-taken) and new `reserved` fill (`ls == 'reserved_held'`, or `py <= year` and not yet lost) with a solid edge; add to click list (L734).
- Optionally emit `reserves` edges (schema already has them) from royce roles `reserved` with `instrument_id` in `build_geofeatures()`; set `geometry_role: reservation` there.
- Legend: "Reserved by treaty or order, still held in 1894".

**(b) Never ceded / no instrument**
- story.ts: `no_instrument` rule above. area_label() in build_graph.py L940: say "taken {year}, no instrument recorded" instead of "ceded".
- New derived layer `data/derived/no-cession.json`: lower-48 land minus the union of Royce polygons. Needs a land mask (e.g. Census cartographic states, add to `pipeline/src/fetch/index.ts` + `data/sources/manifest.json` + `data/licenses/registry.yaml`), then `mapshaper -erase` in `pipeline/src/geometry/index.ts` (new `processNoCession()`), register it in `pipeline/src/cli.ts derivedLayers()` L68-76. Rule V9 errors on a layer without a registry entry (`pipeline/test/rules.test.ts` L95).
- MapApp: `unceded` fill with dotted edge. Legend: "No cession recorded: Royce lists no treaty, act or order for this land".

**(c) Statute / executive order**
- Already distinct (`congress`, `executive`). Rename labels: "Taken by Act of Congress", "Taken by executive order". `HOW_HELP.congress` already says "Taken by statute". Make the line style heavier/solid to read as unilateral.

**(d) Unratified**
- Already a `how`. Changes: honored view must not grey these out (see below); 19 *kept* areas from unratified treaties should be labeled "Reserved by a treaty the Senate never ratified".
- Legend: "Claimed under a treaty the Senate never ratified".

**(e) Duress / illegitimate signers / excluded parties / hostages**
- New crosswalk `crosswalks/instrument-consent.csv`: `instrument_id,flag,evidence_url,evidence_quote,confidence,reviewer_role,note` (flag ∈ list in §3.1).
- build_graph.py `build_instruments()` / new `apply_instrument_consent(cross)`: set Instrument `consent_flags[]`, `signatory_authority_disputed` (true when `illegitimate_signers`/`excluded_parties`), `evidence_flags` (E1 for signers, E3 for consent).
  Add `validate_crosswalk_rows()` coverage and an `evidenced_by` edge per row.
- Optionally extend `pipeline/src/overlays/index.ts` zod schema with `consent: [{flag, evidence_url, evidence_quote}]` so narrative-wave authors can add them in overlays.
- story.ts `instrumentHow()` L36: treat any consent flag as `pressure` (basis = the flag text); carry `ct` to the feature.
- MapApp detail panel (L819-827): add a consent line ("Signed under documented duress: …; signers' authority contested") per I3 §4.4.
- Legend: "Treaty signed under documented duress or by contested signers (open the shape for the evidence)".

**(f) Massacre sites**
- No model today. Add Violation code `MASSACRE_OR_MILITARY_VIOLENCE` to the schema enum and `VIOLATION_CODE_ALIASES` in build_graph.py, or a new `crosswalks/massacre-sites.csv`: `id,name,date,lat,lng,precision,instrument_ids,area_ids,violation_id,source_url,quote,content_warning`.
  Use county-level precision like `crosswalks/return-locations.csv` / `land.ts returnLocations()`.
- Emit `layers/massacres.<hash>.json` (points) from emit/index.ts; add a license registry row; link area ids into `ms`.
- MapApp: `massacres` circle/symbol layer, off by default, behind a content warning toggle; `overlay.content_warnings: [violence]` already exists.
- Legend: "Massacre linked to the taking of this land (content warning)".

**(g) Broken promises**
- story.ts: `bp` from royce entries (reserved/described_or_recognized then ceded/retroceded/taken) plus overlay `promises[].kept === 'broken'` for the ceding or reserving instrument.
- MapApp: `promised-line` layer: hatched/double outline on `bp == 1` once `t0 < year+1`; in the slider, show the promise from `py` (reserved fill) then switch to the loss color at `t0` so the reader sees promised → taken.
- LandMeter: add a second line "of which promised first: N acres".
- Legend: "Promised to the nation, then taken".

**Honored-through view (fix the overstatement)**
- MapApp L600 `afterCut`: retain for the counterfactual anything lost after the cut **or** whose `ls` is in `unratified, no_instrument` (and optionally `treaty_contested` behind a toggle "Count coerced treaties as not binding").
- Update `summary()` L171-176 and `src/pages/methods/honored-through.astro` copy accordingly.
- LegalStatus.svelte: keep static copy; later read GeoFeature `legal_status_today` once populated (P4-06).

### 3.3 Legend wording (proposed, replaces L984-989 and L1050-1077)

Heading: "What the record says happened to the land" (not "ceded").

- Reserved by treaty or order, still held in 1894
- Not yet taken in this year
- Ratified treaty (consent not assessed)
- Treaty under documented duress, contested signers, excluded parties or hostages
- Removal treaty
- Claimed under a treaty the Senate never ratified
- Taken by Act of Congress
- Taken by executive order
- Taken with no instrument in the record
- No cession recorded (outside Royce's record)
- Hatched edge: promised to the nation, then taken
- Point: massacre linked to the taking of this land
- Bright shapes: taken in the last 5 years.
- Footer: "A recorded cession is what the United States wrote down. It does not mean the land was given freely or lawfully; open a shape for the evidence."

### 3.4 Tests that touch this

| Test | What to watch |
|---|---|
| `src/islands/map/state.test.ts` | round-trip of `l=` layers; default hash `#y=1868`; bad layer names dropped. Add new LAYERS to the round-trip case. |
| `pipeline/test/emit.test.ts` | determinism (byte-identical), graph-lite budget; new props must be sorted/stable. |
| `pipeline/test/rules.test.ts` | "current build has no schema errors" (declare new fields); V9 "layer without registry entry is an error" (new layers). |
| `pipeline/test/geometry.test.ts` | `buildEvents()` legal_type derivation; V10 derived geometry checks (new derived file). |
| `src/lib/treaty.test.ts` | treaty page land/promises logic (land.ts). |
| `pipeline/test/build-graph-ledger.test.ts`, `links-review.test.ts` | run build_graph.py; slow here. |
| `tests/e2e/map.spec.ts` | L21 expects summary to contain `"${count} cession"`; L30 heading "Legal status today"; detail h2 contains "(area ". |
| `tests/e2e/treaties.spec.ts` | L126 expects `"ceded no land"`; `.promises` text. |
| `scripts/check-no-nld.test.ts` | never store NLD data (don't add NLD to any new layer). |

Add: `pipeline/test/story.test.ts` (landStatus priority rules, broken-promise detection, consent flags) and `src/islands/map/status.test.ts` (every status has label, help, dash, CSS var).

### 3.5 Build commands and results in this container

Scripts (package.json): `graph:build` = `python3 scripts/build_graph.py`; `data:build` = `graph:build` + `tsx pipeline/src/cli.ts build`
(ingest + emit to `public/data/`); `data:geometry` needs raw USFS/Census files (`data:fetch` → network); `data:validate`; `test:unit` = `vitest run`
(globalSetup builds `build/nodes.json` if missing); `check` = lint + typecheck + test:unit; `test:e2e` = Playwright.
`scripts/build-map-style.mjs` fetches the OpenFreeMap style (network).

Results (run in a scratch copy; repo untouched, `diff -rq` on tracked files showed no changes):
- `node_modules` missing in repo. `npm ci` (network OK via proxy): 729 packages, 32 s; engines warning only.
- `npm run data:build`: OK offline in ~90 s (graph: 3,656 nodes, 12,829 edges, 0 schema errors, 112 issues; 11 tables 0 row errors; 3,668 public files).
- `npm run test:unit`: 98/99 pass. 1 failure: `pipeline/test/links-review.test.ts` "accepts and rejects edges by id" **timed out at 120 s** because it runs build_graph.py twice and each run takes ~88 s here. It's an environment speed problem, not a logic failure (still fails when run alone). Raising that test's timeout or speeding up build_graph.py would fix it.

---

## 4. User-facing copy that overstates legitimacy (file:line)

Priority A: map chrome and shared components (rewrite):
- `src/islands/MapApp.svelte:173` honored summary "land Royce records as ceded only after…which the agreements in force that year left with the nations"
- `src/islands/MapApp.svelte:175` "N cession(s) recorded by the end of…" (e2e map.spec.ts:21 depends on "cession")
- `src/islands/MapApp.svelte:775` aria "Map of land recorded as ceded, by year and by how it was taken"
- `src/islands/MapApp.svelte:784` "Every cession is in the list beside it"
- `src/islands/MapApp.svelte:841` "The agreement that took it" (fine) / `:842` "Agreement in its record" (implies agreement for EO/statute)
- `src/islands/MapApp.svelte:985,1055` "Still held … land the 1899 record shows as ceded only later"
- `src/islands/MapApp.svelte:1068` "Bright shapes: ceded in the last 5 years"
- `src/islands/map/how.ts` `HOW_LABEL.treaty` "Treaty or agreement"; `HOW_HELP.unratified` "treated the land as taken anyway" (good); `HOW_HELP.unknown`
- `src/islands/map/LandMeter.svelte:2,67,73,94` "recorded as ceded"
- `src/lib/land.ts:68-69` ROLE_PHRASE "ceded to the United States", "partly ceded to the United States"
- `src/components/TreatyTimeline.astro:40,42` "ceded to the United States by the X", "Part of the land ceded by the X"
- `src/components/AreaStory.astro:3`, `src/components/NationLand.astro:30` heading "Land recorded as ceded"
- `src/components/NationTimeline.astro:133` "Circles are land the United States recorded as ceded"
- `src/components/ReturnLand.astro:89,97,126,139` "treated as ceded under", "recorded as ceded by", "ceded in {year}"
- `src/lib/recordStory.ts:121` "records N cession(s) of land from", `:136` ", ceded under ", `:231` "This area was not ceded…", `:239` "Which one ceded it…"
- `src/islands/WhereApp.svelte:196` "The United States recorded this land as ceded in {year}", `:212`, `:263` "Which one ceded it…"
- `scripts/build_graph.py:940` `area_label()` → node labels "…, ceded 1874 (area 574)" (shown as record titles everywhere)
- `src/lib/graph.ts:126` edge label "Land the US recorded as ceded"
- `src/lib/facts.ts:78` "Acres ceded"
- `src/pages/map.astro:13`, `src/pages/where.astro:18`, `src/pages/cessions/index.astro:14`, `src/pages/cessions/[id].astro:20,25`,
  `src/pages/index.astro:91,102,111,335`, `src/pages/story.astro:89,93`, `src/pages/places/index.astro:14,19`, `src/pages/places/[id].astro:16`
- `src/pages/methods/honored-through.astro:11-14,40` ("Land that Royce records as ceded… grey"; "Many later cessions were negotiated by the nations themselves")
- `src/pages/methods/uncertainty.astro:22` "Royce recorded what the government treated as ceded" (good framing; keep)
- `src/pages/treaties/index.astro:53` "Each page shows what was agreed"

Priority B: narrative in `data/story.json` (authored text; reword or attribute; leave `"quote"` fields alone):
- Narrative/title lines: 8 ("The Six Nations ceded interests…" right after hostages), 52 title "Cessions in the Ohio country", 53 ("right to sell"), 54 ("the nations ceded about two-thirds of present Ohio"),
  93 ("As more cessions were forced", "would no longer cede land"), 97 title, 133 ("agreed to negotiate… they gave up the remaining ten million acres"),
  204 ("The Choctaw had agreed in 1820… to sell five million acres"), 243 ("tribes ceded most of their lands for $32,500"), 288 ("Many Lakota bands agreed to the treaty"),
  381, 428 ("relinquished"), 575, 639 ("the nations ceded about two-thirds"), 662, 684-685, 762 ("agreed to negotiate. The Choctaw gave up"), 913 ("tribes ceded most of their lands"),
  1005, 1051, 1074 ("Land left over could be sold"), 1238 ("relinquished"), 1425, 1448 ("required it to relinquish 20,000 acres").
- Direct-quote lines (do not edit, they are sources): 64, 84, 104, 119, 219, 234, 645, 673, 691, 696, 709, 919, 1249, 1441, 1464.
- `data/tours/fort-laramie-and-the-black-hills.yaml:24` "no further cession would be valid…" (accurate treaty paraphrase; fine).

Full grep output: `/tmp/claude-0/-home-user/d66bb275-6adb-522a-9fbd-8e5b55892ae3/scratchpad/psl/grep-copy.txt`.

---

## 5. Recommended approach (order)

1. Pipeline first: add `landStatus()` + flags in `pipeline/src/emit/story.ts`, write `ls/py/bp/ct/ms` in `emit/index.ts`, add `by_status` to land-loss; unit-test it. No UI change yet, so the build stays green.
2. Data: `crosswalks/instrument-consent.csv` (+ build_graph.py `apply_instrument_consent`), schema fields, `crosswalks/massacre-sites.csv`; seed from existing overlays (52 under-pressure, 15 broken-promise instruments, V020/V021/V036).
3. UI: `src/islands/map/status.ts` + CSS tokens; MapApp `howColor` → `statusColor` (match on `ls`), split `held`/`reserved`, add `promised-line`, `massacres`, `unceded` layers; new legend; fix honored `afterCut` so unratified and no-instrument land is not greyed out.
4. Copy pass (section 4, priority A), including `area_label()` in build_graph.py; update e2e expectations (map.spec.ts:21, treaties.spec.ts:126).
5. Later: `no-cession` geometry layer (needs one fetch of a land mask + registry entry) and data-driven LegalStatus (S1-S9).
