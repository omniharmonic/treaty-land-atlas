---
title: K1 map visual encoding (land status, flags, promises, massacres, time)
author: Benjamin Life (@omniharmonic)
status: draft
date: 2026-10-20
relates_to:
  - docs/research/K1-beyond-the-federal-record.md (s.4, s.6, s.7)
  - docs/design/K1-map-implementation-survey.md
  - docs/governance/decision-log.md (2026-10-17 royce, unratified, public identity; 2026-10-18; 2026-10-20 land status, massacres, evidence display, sequence)
  - docs/design/I3-interaction-design.md, I4-visual-identity.md, I5-content-design-and-voice.md
  - docs/research/G2-counterfactual-map-methodology.md
prototype: kept outside the repository (scratch build); screenshots of the implementation are listed in the build report
---

# K1 map visual encoding

> **Implementation notes (2026-10-20, applied on top of this spec).** Royce 478 is the 1865 Little
> Arkansas reserve, superseded by Medicine Lodge (1867): it now reads promised, then taken, with a
> broken-promise outline (`lost_year` 1867 in `royce-status-proposals.csv`); 565 had the same
> superseded-reserve problem (replaced in 1888). The contested status belongs to the 426 split north
> and west of the South Platte (426-N, no geometry yet), not to 399, which is now described in a
> treaty and never ceded; 426 carries the "Contested" badge for its contested part. Evidence has a
> fifth level, "Oral history (published with permission)", drawn as dotted hatch like reported
> findings. Owner-adjustable defaults (s.13) are single values in `CONFIG` in
> `src/islands/map/landStatusStyle.ts`. Not yet built: the oral or contested promise outline (`pe`),
> hover tooltips, the phone bottom sheet, and Alaska and Hawaii insets for the no-record dots.

## 0. The recommendation in one paragraph

**Hue says which of four families the land is in. Lightness and edge say which kind within the family. Texture says what was wrong with consent. A green outline says a promise stood there. Dots say there is no federal record at all.** The four families are *Recorded as ceded* (ochre), *Taken without a cession* (plum), *No cession on the record* (blue), and *Held by nations* (green). They are the only colors that must be told apart at a glance, and they pass the colorblind and normal-vision gates on the all-pairs test in both themes. Everything finer (statute versus executive order, treaty versus agreement) is carried twice, by a lightness step and by an edge treatment, and is always named in the tap panel and the table view. Six presets reconfigure the same single map by deciding which families keep their color and which drop to thin outlines, so no view asks the reader to separate more than about six fills at once.

Tested on the real data: 717 Royce polygons from the engineer's current build (`public/data/layers/cessions.b7f90b580e.json`, with `ls`, `t0`, `py`, `bp`, `fh`), the K1 tables (`tables/land-status.json`, `tables/massacre-sites.json`) and Census AIANNH, simplified and projected for the prototype.

---

## 1. Alternatives compared

Screenshot: `shots/alternatives-compared.png` (same data, 1894, light). Left to right: A, B, C.

| | A. Four families + texture + outline (recommended) | B. One hue per mechanism (today's `how` palette extended) | C. One ordinal ramp of "legal cover" |
|---|---|---|---|
| Idea | 4 hues for families; lightness + edge for subtypes; hatch for defects; green outline for promises; dots for no record | 9 or more Okabe-Ito hues, one per `how` / status | One brown ramp from light (treaty) to dark (no instrument), green for held |
| CVD, all pairs (validator, `--pairs all`) | Family bases PASS both themes: light worst CVD 8.9, normal 17.5; dark worst CVD 14.9, normal 16.8 | FAIL: worst CVD 2.8 (bluish-green vs grey), normal 7.6; yellow outside the band | Passes as an ordinal ramp, but a ramp is not identity |
| Honesty | Never ranks injustices. "Ceded" never shares a hue with "taken". Defects shown on top of the legal status, as K1 s.4.1 requires (a flag never changes the status) | Encodes duress as a status (vermilion "pressure"), which K1 forbids; "no instrument" becomes grey, which reads as "unknown, nothing happened" | Makes the site rank how bad each taking was; ceded land fades toward the basemap and reads as benign; unratified and no-instrument collapse |
| At a glance | 4 families readable; defects pop as texture | Loud, many hues fight; the eye cannot learn 9 colors | Calm but says one thing only |
| Verdict | Recommended | Rejected | Rejected |

---

## 2. Status families and display classes

The engineer's `land_status` (feature prop `ls`, `pipeline/src/emit/landStatus.ts`) maps to **display classes**. Time decides the class in a given year (s.6).

| Family (hue) | Display class | `ls` value(s) | Subtype channel | Legend line |
|---|---|---|---|---|
| Recorded as ceded (ochre) | `ceded` | `ceded_by_ratified_treaty` | base step, hairline edge | Ceded by a ratified treaty |
| | `agree` | `ceded_by_agreement_with_consent_process` | lighter step, **dashed** edge `4 2` | Ceded by an agreement Congress ratified |
| | `contested` | `contested` | `ceded` fill + always-visible **"Contested" badge** | Contested: federal sources doubt the cession reached here |
| Taken without a cession (plum) | `statute` | `taken_by_statute` | middle step, hairline | Taken by an Act of Congress |
| | `eo` | `taken_by_executive_order` | lightest step (light theme), **dashed** edge | Taken by executive order |
| | `none` | `taken_no_instrument` | strongest step, **heavy** edge 1.5 px | Taken with no treaty, act or order |
| No cession on the record (blue) | `unrat` | `unratified_treaty_area` | base step, hairline | Treaty never ratified; the land was taken anyway |
| | `desc` | `described_not_ceded` | lighter step, **heavy** edge | Described in a treaty, never ceded |
| Held by nations (green) | `reserved` | `promised_reserved`, or any area with `py <= year` not yet lost | full step | Promised or reserved to the nation, held in this year |
| | `prior` | any area not yet lost and not yet promised | pale wash, faint edge | Not yet taken in this year |
| Context | `gone` | honored mode only: recorded cession before the cut | neutral, family edge | Recorded as ceded before [cut] |
| No Royce cession record | `gap` | land outside every Royce polygon, Alaska, Hawaii | dot texture on the basemap | Dots: no Royce cession record (colonial and state takings, Texas; Alaska and Hawaii each with its own note) |

Rule of thumb printed nowhere but kept everywhere: **contrast with the land increases with salience**. In light theme "no instrument" is the darkest plum; in dark theme it is the brightest. Dark mode is selected, not inverted.

### 2.1 Fill tokens (precomposited, opaque)

Fills are opaque tints, not translucent washes, so overlapping Royce polygons (sum about 25% above union) never darken where they stack. Lightness L and chroma C are OKLCH. Contrast is WCAG against the map land color (`#F2EFE4` light, `#18211B` dark, from `public/map/style-atlas-*.json`).

| Token | Light | L / C | vs land | Dark | L / C | vs land |
|---|---|---|---|---|---|---|
| `--ls-ceded` | `#CEAC6C` | .76 / .091 | 1.87 | `#D1A556` | .75 / .110 | 7.25 |
| `--ls-agree` | `#E8CC8E` | .85 / .085 | 1.36 | `#AC8B4C` | .65 / .091 | 5.15 |
| `--ls-statute` | `#985F8C` | .56 / .096 | 4.19 | `#CD8EBF` | .72 / .100 | 6.46 |
| `--ls-eo` | `#B377A6` | .65 / .098 | 2.99 | `#8D6183` | .55 / .074 | 3.28 |
| `--ls-none` | `#6C3662` | .42 / .098 | 7.79 | `#E7B3DC` | .83 / .080 | 9.34 |
| `--ls-unrat` | `#7DAFDB` | .74 / .083 | 2.02 | `#164D7E` | .41 / .099 | 1.88 |
| `--ls-desc` | `#9DC3E2` | .80 / .060 | 1.61 | `#1A3C54` | .34 / .058 | 1.43 |
| `--ls-reserved` | `#48804A` | .55 / .101 | 4.09 | `#2F6C3B` | .48 / .100 | 2.62 |
| `--ls-prior` | `#DAE5D0` | .91 / .030 | 1.13 | `#1F2C1C` | .28 / .034 | 1.13 |
| `--ls-gone` | `#E3DED0` | .90 / .020 | 1.17 | `#41463F` | .39 / .013 | 1.71 |

Fills under 3:1 are deliberate washes; the 3:1 non-text requirement is met by the family ink (edges, legend keys, hatch), as I4 s.3.2 already does.

### 2.2 Family ink (edges, legend key strokes)

| Token | Light | vs land | Dark | vs land |
|---|---|---|---|---|
| `--fam-ceded-ink` | `#7D5600` | 5.70 | `#E9C47C` | 9.94 |
| `--fam-taken-ink` | `#4F2246` | 11.06 | `#F0C6E6` | 10.95 |
| `--fam-never-ink` | `#2B6492` | 5.46 | `#8FC0EA` | 8.56 |
| `--fam-held-ink` | `#2F5E33` | 6.59 | `#9ACF9E` | 9.27 |
| `--fam-gap-ink` (dots) | `#686A5B` | 4.80 | `#A3A893` | 6.74 |
| `--promise` | `#1F6B35` | 5.68 | `#7FD08C` | 8.88 |
| `--casing` (around promise line, massacre ring) | `#FDFBF6` (6.32 vs promise) | | `#121915` (9.62 vs promise) | |
| `--today-line` | `#302F28` | 11.67 | `#ECE9DE` | 13.58 |
| `--today-fill` | `#9DBB8C` | | `#4F7D55` | |

### 2.3 Validation (computed with the dataviz skill's `validate_palette.js`, Machado 2009 at severity 1.0, OKLab Delta E x100)

- **Family bases, all pairs** (`#CEAC6C,#985F8C,#7DAFDB,#48804A` light; `#D1A556,#CD8EBF,#164D7E,#2F6C3B` dark): CVD PASS (light worst 8.9 deutan, reserved vs statute; dark worst 14.9), normal-vision PASS (light 17.5, dark 16.8). The validator's lightness-band and chroma-floor checks flag these as too light or too grey: those checks are for small marks, and these are area washes whose identity is backed by ink edges, so that is expected.
- **All ten fills, all pairs** (`build/report.txt`): cross-family pairs worst light CVD 8.0 (agree vs prior), dark 8.0 (desc vs prior, tritan); within-family steps 6.3 to 9.8. Within-family steps are below the normal-vision floor of 15 by construction (they are steps of one hue), so they never carry identity alone: each has the edge treatment in s.2, the panel names it, and the table view lists it.
- `prior` vs `gap` (4.0): the two never touch (gap is the complement of Royce coverage) and gap is carried by its dot texture, not its color.
- **Hatch ink against every fill** is at least 3.9:1 (light, `eo`) and 4.1:1 (dark, `eo`); ink side is picked per fill by contrast (s.3).
- Text tokens (site `--ink`, `--ink-2`, `--ink-3` on `--sheet`): 13.0 / 6.8 / 5.3 light. Dark proposal (`--ink #ECE9DE`, `--ink-2 #C2C5B3`, `--ink-3 #A3A893` on `--sheet #1E2822`): 12.5 / 8.6 / 6.2. The existing `--rule-strong #9D9F8E` is only 2.61:1 on the light sheet; control borders need `#74776A` or darker to meet 3:1 (outside this spec, noted for the engineer).

---

## 3. Patterns

All patterns are 45 degrees only (dataviz rule: never horizontal or vertical), drawn once per theme at load into `ImageData` and registered with `map.addImage(name, img, { pixelRatio })`, so they swap with the theme without a sprite rebuild. Tile sizes are CSS pixels; draw at `devicePixelRatio`.

| Image name | Tile | Mark | Use |
|---|---|---|---|
| `hatch-solid-dk` / `-lt` | 8 x 8 | one 1.3 px line at 45 degrees, ink at 62% | `fh == 2`: at least one flag with primary or scholarly evidence |
| `hatch-dot-dk` / `-lt` | 8 x 8 | dots r 0.85 px every 3.2 px along the same 45 degree line, ink at 75% | `fh == 1`: reported or disputed only |
| `gap-dots` | 9 x 9 | two dots r 0.85 px at (2,2) and (6.5,6.5), `--fam-gap-ink` at 75% | no federal record |

Ink colors: `dk` = `#302F28` light / `#121915` dark; `lt` = `#FDFBF6` light / `#ECE9DE` dark. Which side a fill gets:

| | ceded | agree | statute | eo | none | unrat | desc | reserved | prior | gone |
|---|---|---|---|---|---|---|---|---|---|---|
| light | dk | dk | lt | dk | lt | dk | dk | lt | dk | dk |
| dark | dk | dk | dk | lt | dk | lt | lt | lt | lt | lt |

The same rule runs across all marks: **solid = primary or scholarly source; dotted = reported or disputed** (hatch, massacre ring, oral promise outline). The 2026-10-20 decision to show every finding is kept: reported findings are on the map, but visibly weaker, and every one carries its label in the panel.

Hatch is on by default (it is semantic, not decorative), but users with `prefers-reduced-motion` or a "Reduce texture" setting get the hatch at 35% opacity; forced-colors mode draws hatch in `CanvasText`.

## 4. Outlines

| Line | Spec (screen px) | When |
|---|---|---|
| Family edge | 0.6, family ink at 55% | every colored area |
| Muted edge | 0.5, `--rule-strong` at 35% | areas not part of the current preset |
| Subtype edge: dashed | 0.6, dasharray `[4,2]`, 90% | `agree`, `eo` |
| Subtype edge: heavy | 1.5, 95% | `none`, `desc` |
| Promise outline | 2.2 `--promise` over a 4.6 `--casing`, round join; MapLibre `line-offset: -1.2` (inside the ring) | preset rules in s.7 |
| Oral or contested promise | same, dasharray `[1.5,2.5]` (dotted) | promise row with evidence `reported`/`disputed` (for example the Northern Cheyenne 1868 oral promise) |
| Later change (honored mode) | 1.2, family ink of how it was taken, `[3,2]` | lost after the cut |
| Selection | 2.2 `--ink` over 5 `--casing` | selected area; selection never changes fill (I4 s.5.2) |
| Today | 1.1 `--today-line`, fill `--today-fill` | Today preset, and the Today toggle in any preset |

## 5. Points and badges

**Massacre site.** A hollow ring: r 4.2 px, stroke 1.8 px `--ink`, fill `--casing`, with a 6.5 px `--casing` halo. Dashed ring (`1.6 1.4`) when the record's evidence is reported or disputed. 44 px hit target. No red, no icon of violence, no size or color by death count, no label on the map (name in the panel only). Selected: stroke 3 px, halo 8 px. Location is the general point in `massacre-sites.json` (0.1 degree); the panel says so. Off by default; turning it on shows the content note once (I5 s.3); shown cumulatively: a site appears when the slider reaches its year.

**Badges** (pill, 10 px semibold text, `--sheet` fill, 1 px `--ink`): "Contested" for `ls == contested`; "Payment refused" for a `payment_refused` flag. Always visible at zoom 4 and above, at the polygon's label point. In the current build these are areas 399 (contested), 444 and 598 (payment refused).

---

## 6. Time, overlap and the counterfactual

### 6.1 What a polygon shows in year Y (`displayClass`)

```
lost      = t0 < Y + 1                       (t0 = 9999 never lost in the record)
promised  = py != null && py <= Y
if ls in {promised_reserved, described_not_ceded}:  class = (py != null && py > Y) ? 'prior' : base(ls)
else if lost:                                      class = base(ls)
else:                                              class = promised ? 'reserved' : 'prior'
broken    = bp == 1 && lost && py != null && py < t0
```

So the slider plays each promise as green from `py`, then switches to the color of how it was taken at `t0`, and in the presets that show promises the green outline stays. After 1894 the polygons freeze at their 1894 state, the banner "Cession geometry ends in 1894. Later changes are shown as events, not areas." appears (I5 s.6.2), and the slider track is hatched past 1894 (I3 s.2.3).

### 6.2 Overlap

Draw order is `t0` ascending, then area descending for equal `t0` (in the source, not in the style: sort features in `emit/index.ts` and rely on GeoJSON order). The latest record, the one the United States relies on now (K1 s.4.1 rule 1), is on top; reservations (`t0 = 9999`) sit above the cessions around them; small later areas sit above larger earlier ones. Fills are opaque, so stacking never darkens. Every edge is drawn, so nested records stay visible. A tap lists **every** record under the point ("2 other records cover this spot") using `queryRenderedFeatures` on the fill layer with `fill-opacity` 0 for muted areas still hit-testable.

### 6.3 Honored through year X (G2 s.2(b))

Available in "What the US recorded", "How it was taken" and "Broken promises"; disabled in Today.

| Area | Shown as |
|---|---|
| Lost after X and promised by X (`py <= X`) | `reserved` green, no hatch, plus the later-change outline in the color of how it was taken |
| Lost after X, never promised by X | `prior` wash, plus the later-change outline |
| Recorded **cession** before X (`ceded`, `agree`, `contested`) | `gone` neutral **with its hatch still on**: even the cessions the model counts as given are shown with their consent problems |
| **Taking without cession** before X (`statute`, `eo`, `none`, `unrat`) | keeps its family color: never counted as given, in any view (extends the engineer's `NO_LAWFUL_CESSION`, which today holds only `unratified_treaty_area` and `taken_no_instrument`; add `taken_by_statute` and `taken_by_executive_order` for display purposes, or keep a separate `NEVER_GIVEN` set) |

Question line: "If the treaties had been honored through 1851: what the United States had promised or not yet acquired by 1851, with every later taking as a dashed outline. A model, not a claim about today." The Legal status today bar (I3 s.4.5) stays mandatory.

---

## 7. Presets (one tap, same map)

URL: `v=` keeps record/honored; new `p=` holds the preset (`recorded` default, omitted from the hash so `#y=1868` stays the default hash). Each preset sets MapLibre `global-state` `preset`, and layer paint/filter expressions read it.

| Preset (chip label) | Question line | Colored classes | Hatch | Promise outline | Gap dots | Badges | Today | Massacres | Year |
|---|---|---|---|---|---|---|---|---|---|
| **What the US recorded** (default) | What the United States recorded for each area by this year, and how it got it. | all | on | off | on (75%) | on | off | toggle | slider |
| **How it was taken** | How the land was taken: by treaty, by Act of Congress, by executive order, or with no instrument at all. | ceded, agree, contested, statute, eo, none, unrat (+ prior wash) | on | off | on | on | off | toggle (offered as a chip here) | slider |
| **What was promised** | What was promised: land a treaty, act or order set apart for a nation by this year. | reserved | off | on every promised area already lost | off | off | off | toggle | slider |
| **Broken promises** | Promised, then taken: a green outline stays where a promise stood. | reserved, plus every `broken` area in its loss color | on (broken areas only) | on `broken` | off | off | off | toggle | slider |
| **Never ceded** | No cession on the record: never-ratified treaties, land described in a treaty and never ceded, land taken with no instrument, and land with no federal record at all. | unrat, desc, none, contested | on | off | on (100%) | on | off | toggle | slider |
| **Today** | Land held today: reservations and trust land (Census 2020), over what was reserved in 1894. | none (all history as muted outlines) | off | 1894 `promised_reserved` as a dotted green outline | off | off | on | toggle (all years) | fixed "Today" |

Non-colored areas in every preset are muted: no fill, 0.5 px edge, still tappable. Presets never change geometry, colors of the families that remain, or the year (except Today), so a reader who learned "plum is taken" keeps it across views.

### 7.1 MapLibre layers (bottom to top)

| Layer id | Type | Source | Filter / paint (summary) |
|---|---|---|---|
| `gap-fill` | fill | `no-cession` (new derived layer, survey s.3.2 b) plus AK/HI | `fill-pattern: gap-dots`; opacity by preset (0, .75, 1) |
| `status-fill` | fill | `cessions` | `fill-color` = `statusFillExpr(theme)` on display class; `fill-opacity` 0 when muted (keeps hit testing) |
| `status-hatch` | fill | `cessions` | filter `fh > 0` and colored and not prior; `fill-pattern` = match on class to `hatch-{solid|dot}-{dk|lt}` |
| `status-edge` | line | `cessions` | color by family ink, width/dash by subtype (s.4) |
| `today-fill`, `today-line` | fill, line | `today` | Today preset or Today toggle |
| `promise-casing`, `promise-line` | line | `cessions` | filter by preset rule (s.7); `line-offset -1.2` |
| `later-line` | line | `cessions` | honored: lost after cut |
| `select-casing`, `select-line` | line | `cessions` | `feature-state selected` |
| `badge` | symbol | `cessions` label points (new `lp` or a points layer) | `bd` prop: `contested` / `payment_refused`; minzoom 4 |
| `massacre-halo`, `massacre-ring` | circle | `massacres` (`tables/massacre-sites.json` features) | `year <= Y`; dashed ring is not supported by circle layers, so use a symbol layer with two ring icons (`mas-solid`, `mas-dotted`) drawn at load like the patterns |
| `nld-*` | | | unchanged |

The display class is computed in the style with expressions (so the slider stays a `global-state` change, no data rewrite):

```js
// class expression, Y = ['global-state','year']
['case',
  ['in', ['get','ls'], ['literal',['promised_reserved','described_not_ceded']]],
    ['case', ['all',['!=',['get','py'],null], ['>',['get','py'],Y]], 'prior', ['match',['get','ls'],'promised_reserved','reserved','desc']],
  ['<', ['get','t0'], ['+',Y,1]], ['match',['get','ls'], 'ceded_by_ratified_treaty','ceded', 'ceded_by_agreement_with_consent_process','agree',
       'contested','contested','taken_by_statute','statute','taken_by_executive_order','eo','unratified_treaty_area','unrat','none'],
  ['all',['!=',['get','py'],null], ['<=',['get','py'],Y]], 'reserved',
  'prior']
```

Generate these expressions in one place (s.10), not inline in `MapApp.svelte`.

---

## 8. Legend copy (plain language; shown in this order)

Lede, always first: **"Royce shows what the United States recorded as acquired, not what nations agreed to."** (K1 s.4.1 rule 5)

Recorded as ceded
- Ceded by a ratified treaty
- Ceded by an agreement Congress ratified
- Contested: federal sources doubt the cession reached here

Taken without a cession
- Taken by an Act of Congress
- Taken by executive order
- Taken with no treaty, act or order

No cession on the record
- Treaty never ratified; the land was taken anyway
- Described in a treaty, never ceded

Held by nations
- Promised or reserved to the nation, held in this year
- Not yet taken in this year
- (Today) Reservation or trust land today (Census)

Marks on top (only those the preset shows)
- Hatched: a documented problem with consent (duress, hostages, bribery, signers, a missing nation)
- Dotted hatch: a problem reported but not yet confirmed
- Green outline around taken land: promised to the nation, then taken
- (What was promised) Green outline: promised to the nation, gone by this year
- (Today) Reserved in 1894 (green dots): compare what is held now
- Dots: no Royce cession record (colonial and state takings, Texas; Alaska and Hawaii each with its own note)
- Ring: massacre site, general location (primary or scholarly source)
- Broken ring: massacre reported, source not yet confirmed
- Thin outline: other records, not part of this view
- (Honored) Dashed outline: taken after [X], in the color of how it was taken

Footer: "Where records overlap, the most recent is drawn on top, and every edge is shown. Tap a spot to list every record there. Each finding carries its evidence:" followed by the four evidence chips.

Families not colored in a preset stay in the legend, greyed, with "outlines only in this view", so the key never changes shape under the reader. Swatches are drawn with the real pattern, edge and dash. Text is in ink tokens, never in data colors.

**Evidence chips** (text always present; glyph backs it): Primary source (filled dot), Scholarly source (half dot), Reported (ring) followed by "by [source]" when the CSV gives one, Disputed (dashed ring). Use the CSV's `evidence_display` as the text.

---

## 9. Panel (tap or hover; desktop rail 340 px, phone bottom sheet)

1. Title: plain-word name (decision 2026-10-18), for example "Land of the Arapaho and Cheyenne in Colorado (area 477)". Close button 32 px.
2. **What the record says**: swatch + status label + year + evidence chip; then the one-line plain story (`plain`).
3. **Promised** (if `py`): promise swatch + "Promised or recognized as the nation's land in 1851; later taken. Promise not kept." (or "still held in 1894").
4. **Problems with consent (n)**: one line per flag in plain words (s.11 table in the prototype source, `FLAG`), each with its evidence chip. Alleged and disputed items are listed, never hidden.
5. **Massacres linked to this land**: name as the nation names it, date "Nov. 29, 1864", link kind ("preceded the cession", "sequence only"), evidence chip, content note.
6. **Other records cover this spot**: buttons to switch to each.
7. Nation today line (I3 s.2.5), support links (decision 2026-10-17 support).
8. Source line: "Source geometry: USDA Forest Service after C. C. Royce (1899), generalized. Status: K1 research and the federal record. Not legal advice."

Massacre panel: content warning box first (I5 s.3.2 Warning level, neutral style), then date, nations, evidence chip, linked land, and "General location only, rounded to about 10 km. Named as descendant nations name it where known. A nation can ask for a change or removal."

Hover (desktop) shows a one-line tooltip (status + year + "n consent problems"); everything in it is also in the panel on click and on keyboard focus.

## 10. Phone

- Preset chips are one horizontal-scroll row under the header (snap, trailing fade), 36 px tall, thumb reachable when the dock is pinned at the bottom.
- Under the map, a **key strip** lists only what the current preset colors (short labels: "Ceded, treaty", "Act of Congress", "No instrument", "Consent problem", "No Royce record"); the full legend is a collapsed sheet ("Legend: How it was taken").
- Tapping a shape opens a bottom sheet at 55% height and fits the selection into the visible map above it (`fitBounds` with bottom padding equal to the sheet). Verified in the prototype (`shots/panel-area477-dark-phone.png`).
- Badges and region labels hide below zoom 4; massacre hit targets stay 44 px; slider ticks drop to 1784, 1894, Today.
- Pattern tiles stay 8 px in CSS pixels at any zoom (patterns are screen-space in MapLibre, which is right: texture should not scale with land).

## 11. Implementation mapping

### 11.1 Props the style reads (engineer's names)

| Prop | Source | Used for |
|---|---|---|
| `ls` | `land_status` | family and subtype |
| `t0` | `lostAt()`; 9999 never lost | time |
| `py` | `promised_year` | promise timing |
| `bp` | `broken_promise` | broken outline |
| `fh` | `hatchLevel()` 0/1/2 | hatch solid/dotted |
| **add** `bd` | `contested` status or `payment_refused` flag | badge |
| **add** `pe` | evidence of the promise row (`primary`...`disputed`) | dotted promise outline for oral or contested promises |
| **add** label point | polylabel per feature, or a small points layer | badges, keyboard focus order |

Panel text reads `tables/land-status.json` (`flags[].evidence_display`, `basis`, `instrument`) and `tables/massacre-sites.json` (`sites[]`), keyed by feature id. Keep flag lists out of the vector layer.

### 11.2 `src/islands/map/landStatusStyle.ts` (single style module)

One module owns every value in this spec; `MapApp.svelte`, the legend, the key strip, `LandMeter`, the table view and tests import from it. It replaces `HOW_*` from `how.ts` for map coloring (keep `how.ts` for prose until consumers migrate).

```ts
export type Theme = 'light' | 'dark';
export type DisplayClass = 'ceded'|'agree'|'contested'|'statute'|'eo'|'none'|'unrat'|'desc'|'reserved'|'prior'|'gone';
export type Family = 'ceded'|'taken'|'never'|'held';
export const LS_TO_CLASS: Record<LandStatus, DisplayClass>;           // s.2
export const FAMILY: Record<DisplayClass, Family>;
export const FILL: Record<Theme, Record<DisplayClass, string>>;        // s.2.1
export const INK: Record<Theme, Record<Family|'gap', string>>;          // s.2.2
export const PROMISE, CASING, TODAY_LINE, TODAY_FILL: Record<Theme, string>;
export const EDGE: Record<DisplayClass, { width: number; dash?: number[] }>; // s.4
export const HATCH_SIDE: Record<Theme, Record<DisplayClass, 'dk'|'lt'>>;     // s.3
export const LABEL: Record<DisplayClass, string>;  export const SHORT: Record<DisplayClass, string>;
export const FLAG_LABEL: Record<Flag, string>;     export const EVIDENCE_LABEL: Record<Evidence, string>;
export const PRESETS: Record<PresetId, PresetSpec>;                    // s.7 table, as data
export function displayClassExpr(): ExpressionSpecification;          // s.7.1
export function fillColorExpr(theme: Theme): ExpressionSpecification;
export function hatchPatternExpr(theme: Theme): ExpressionSpecification;
export function drawPatterns(theme: Theme, dpr: number): Record<string, ImageData>; // s.3, s.5 ring icons
export function displayClass(f: {ls,t0,py}, year: number, honored?: {cut:number}): DisplayClass; // same logic in TS for table view and tests
```

CSS: mirror `FILL`/`INK` as `--ls-*` and `--fam-*` custom properties in `src/styles/global.css` (light on `:root`; dark under `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`) for legend swatches; the map reads the TS constants, never `getComputedStyle`, so both stay in one file. The I4 clash (blue `#0072B2` for reservations versus `congress`) disappears: reservations are green, and blue now means "no cession on the record".

### 11.3 Tests to add

`landStatusStyle.test.ts`: every `LandStatus` maps to a class; every class has fill (both themes), ink, label, short label, edge; `displayClass()` cases (promise before loss, broken, 9999, honored rules: a statute taking before the cut keeps its class); hatch ink contrast at least 3:1 on every fill (compute in the test); preset table lists only known classes. Update `tests/e2e/map.spec.ts` legend expectations.

---

## 12. Data observations from the prototype (for the engineer, not design)

- **Area 478** (`promised_reserved`, `bp = 1`) draws as reserved across most of central Texas in 1894. K1 s.7.1 places the Medicine Lodge KCA reservation in Oklahoma; the Texas extent looks like the 1865 Little Arkansas reserve (511). Check the geometry or the status before launch: it is the largest green shape on the map.
- `contested` is on area **399**, not on a split of 426 (`426-N`), which K1 s.4.2 names as the case. The sub-area rows exist in `land-status.csv` but have no geometry yet.
- `bp = 1` on 319 of 717 areas: the broken-promises view is dense in the Plains and Great Lakes; that is the record, but confirm that `retroceded` roles are meant to count.
- The engineer's `Evidence` type has four levels; the decision log names five (with oral history). Oral history should get its own chip ("Oral history", glyph: ring with a center dot) rather than fall into "reported".
- Today layer in the prototype omits Alaska Native and Hawaiian home lands (projection only); production should draw them in the insets.

## 13. Open choices for the owner

1. **Massacres on by default in "How it was taken"?** Recommended: off everywhere, offered as a chip with the one-time content note (K1 s.6 ethics note says off by default).
2. **Hatch on by default.** Recommended yes (it is the finding); alternative: hatch only in "How it was taken" and "Broken promises", with a hatch count in the panel elsewhere.
3. **Dotted (reported) findings on the map.** Recommended as specified (shown, visibly weaker). Alternative: panel only, as K1 s.4.4 originally proposed.
4. **Honored mode and statute or executive-order takings before the cut.** Recommended: never greyed (they were never given). Alternative: grey them like cessions and rely on the panel.
5. **Dark-mode salience flip** ("no instrument" brightest in dark). Recommended; the alternative (keep it darkest) makes it nearly vanish on the dark land.
6. **Name of the default preset**: "What the US recorded" (proposed) or "Everything".

## 14. Files

- `prototype.html`: self-contained, no external scripts. URL params: `preset`, `theme`, `year`, `honored=<cut>`, `mas=1`, `region=us|plains|west`, `tap=<area>`, `alt=how7|ramp` (alternatives B and C).
- `shots/`: every preset in light and dark, desktop (1360 px) and phone (390 px); honored 1851; area and massacre panels; open legend on phone; `alternatives-compared.png`.
- `build/`: `tokens.mjs` (values in this spec), `report.mjs` and `report.txt` (contrast and Delta E), `opt2.mjs` (the lightness search used to pick the steps), `build_svg.py` (geometry extraction from the snapshot), `shoot.mjs` (Playwright).
