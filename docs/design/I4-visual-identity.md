---
title: "Visual Identity: Palette, Type, Map Styling, Icons, Motion, Tokens"
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# I4. Visual Identity

**Design Agent I, Treaty Land Atlas.** Working title "What Was Promised" (I1). Files delivered with this document:

| File | What it is |
|---|---|
| `/home/claude/treaty-land-atlas/docs/design/tokens.css` | CSS custom properties: light defaults, dark via `prefers-color-scheme` and `data-theme`, reduced motion, forced colors |
| `/home/claude/treaty-land-atlas/docs/design/tokens.json` | Same values for JavaScript and the map style, plus a `vocab` block (slider stops, violation types, evidence flags, legal status codes, uncertainty tiers, review statuses, organization types, layers) |
| `/home/claude/treaty-land-atlas/docs/design/icons/violation-icons.svg` | Sprite: 23 violation-type symbols (`vt-...`) and 7 review-status glyphs (`rv-...`), 24 by 24, `currentColor` |
| `/home/claude/treaty-land-atlas/docs/design/prototype/index.html` | The wireframe that uses all of the above (inlined) |

**Tags.** `[verified]` = measured or stated in this session; `[from-memory]`, `[unverified]` as usual. **Recommendation** = decision made here.

---

## 1. Identity brief

The product is a public record that has to be trusted by three groups at once: teachers and journalists who will cite it, donors who will act on it, and Native nations who will check it against what they know. The visual identity has one job: **make the record legible and the uncertainty honest, without speaking in a borrowed cultural voice.**

Design stance, **Recommendation**:

1. **The chrome is ink and paper; hue is reserved for data.** Interface surfaces are cool neutral. Color appears only where it carries a meaning on the map or in a label. A reader who sees color knows it is data.
2. **The signature is the year and the hatch.** The memorable element is the large tabular year in the dock, which changes when the reader moves through time, and the hatching language that distinguishes recognized territory from reservations and from approximate edges. Everything else stays quiet. (Spending boldness in one place.)
3. **Today is a visual constant.** The present-day outline is the only line weight heavier than defaults and always has a light/dark casing, so no frame reads as "gone".
4. **Documents look like documents.** Quoted source text is set in a book face with a quote bar; the project's own voice is set plainly in a sans; a nation's statement is framed and attributed. Typography carries the voice policy (G3).
5. **Nothing says "Native."** The identity does not borrow imagery, patterns, typefaces, colors or words from Native cultures. See s.2.

---

## 2. What the identity deliberately avoids

Each rejected move is listed with the reason, so a reviewer can challenge a reason rather than a taste.

| Avoided | Why |
|---|---|
| Feathers, arrowheads, dreamcatchers, tipis, headdresses, medicine wheels, four-direction color wheels | Stereotyped or sacred imagery used as decoration by outsiders is the single most common harm in this genre; it also freezes Native people in the past |
| "Native-style", "tribal", "western" or brush fonts | Costume typography. Also illegible for many readers |
| Earth-tone palettes (terracotta, ochre, sand, turquoise plus red as a "Southwest" set) | A stereotype of Native aesthetics; also the default palette of many tourism brands |
| Parchment, sepia, aged-paper, torn-edge or "old map" textures | Signals the past, which works against the present-first principle (I1 principle 1), and implies the record is quaint |
| Sunset or dawn gradients, silhouettes, eagles, wolves, buffalo, landscapes with figures | Romanticizing and "vanishing" imagery |
| Red as the brand color or as the "loss" color on large fills | Red-and-Native associations are fraught `[from-memory]`; red also suggests blood and violence in a way that flattens the evidence flag system. The violation hue is a small-area orange-vermilion used for icons and lines |
| Black-and-white photographs of Native people | Archival portraits used as mood imagery reproduce the "past tense" frame and raise consent questions (G3). Photography, if used at all, is current, credited and consent-reviewed |
| Poverty or distress imagery in the Support flow | Prohibited by F4 |
| Nation seals, flags or logos | Prohibited by F4 and implies endorsement |
| Gradient washes, glow, glassmorphism | Decoration that fights legibility; not needed |

What the identity does use: a neutral cool ink-and-paper system, an accessible colorblind-safe data set (Okabe and Ito, a published palette designed for color-vision deficiency `[from-memory]`), patterns for categories, and plain geometric icon frames.

---

## 3. Color

### 3.1 Chrome (UI surfaces and text)

| Role | Light | Dark | Notes |
|---|---|---|---|
| Page background | `#F4F6F8` | `#0D1822` | Cool, slightly blue-grey; not white, not cream |
| Surface (cards, sheets) | `#FFFFFF` | `#14232F` | |
| Ink (primary text) | `#13222E` | `#E6EDF3` | Blue-black, not pure black |
| Ink 2 (secondary) | `#44566A` | `#A9B8C6` | |
| Ink 3 (tertiary, captions) | `#5B6B7C` | `#8DA0B2` | |
| Rule (decorative) | tint of ink | tint of ink | |
| Rule strong (control borders) | `#74869A` | `#667C90` | Meets the 3:1 non-text contrast rule |

**Contrast (WCAG 2.x relative luminance), measured with a script this session `[verified]`:**

| Pair | Light | Dark |
|---|---|---|
| Ink on page background | 15.0 : 1 | 15.2 : 1 |
| Ink 2 on page background | 7.0 : 1 | 8.8 : 1 |
| Ink 3 on page background | 5.0 : 1 | 6.7 : 1 |
| Rule strong on page background | 3.4 : 1 | 4.1 : 1 |

Body text is therefore AAA (7:1) at ink and ink 2 in both modes; ink 3 is AA (4.5:1) and is used only for captions and non-essential metadata.

### 3.2 Data hues

Six classes, one hue each, from the Okabe and Ito set (blue, reddish-purple, orange, vermilion, bluish-green, plus a slate for the indicative class). No class relies on hue alone: each has a pattern or line style in s.5.

| Class | Light fill | Light line | Dark fill and line | Pattern and edge |
|---|---|---|---|---|
| Reservation as set aside | `#0072B2` | `#00598C` | `#4BA6E0` | Solid wash, solid edge |
| Treaty-recognized territory | `#CC79A7` | `#A24B7E` | `#F2A9CF` | Diagonal hatch; dashed if T3 |
| Cession or other alteration | `#E69F00` | `#8F6100` | `#F8D24F` | Wash plus line; icon for the event |
| Violation event (icons, lines) | `#D55E00` | `#B04A00` | fill `#F0602F`, line `#FF9A66` | Family-framed icon |
| Return or restoration | `#009E73` | `#00785A` | `#3FDB9D` | Dotted wash, solid edge |
| Aboriginal title (ICC, indicative) | `#5F6F7F` | `#4A5866` | `#8496A8` | Dotted edge, no fill |
| Today (present-day boundary) | ink `#13222E` | | `#E6EDF3` | Heavier outline with casing (white in light, near-black in dark) |

**Contrast against the map land color** (`#ECEFF2` light, `#1A2935` dark) `[verified]`:

| Class | Light fill vs land | Light line vs land | Dark fill vs land |
|---|---|---|---|
| Reservation | 4.49 | (line darker, higher) | 5.54 |
| Recognized | 2.65 | 4.73 | 8.04 |
| Cession | 1.95 | 4.69 | 10.14 |
| Violation | 3.35 | 4.76 | 4.54 (line `#FF9A66`: 7.13) |
| Return | 2.96 | 4.75 | 8.38 |
| ICC | 4.47 | (line darker) | 4.89 |

Where a light-mode fill is under 3:1 (recognized, cession, return), that is deliberate: fills are low-opacity washes and carry no information alone. **The 3:1 non-text requirement is met by the line variants and patterns, not by the fills.** That is why every class has a darker "line" token.

**Color-vision separation.** Minimum pairwise color difference (CIEDE2000, after simulating protanopia, deuteranopia and tritanopia with standard matrices) among the six classes, computed this session `[verified]`:

| Condition | Light, smallest pair | Dark, smallest pair |
|---|---|---|
| Normal vision | 12.9 (reservation / ICC) | 13.2 (reservation / ICC) |
| Protanopia | 11.7 (recognized / ICC) | 10.0 (recognized / ICC) |
| Deuteranopia | 12.5 (cession / violation) | 12.7 (reservation / ICC) |
| Tritanopia | 10.9 (recognized / cession) | 10.4 (recognized / cession) |

All pairs are above 10 under every simulation; values near 10 or more are generally clearly distinguishable, but this threshold is a rule of thumb `[from-memory]`, and patterns back every pair regardless.

**History of the choice.** The first draft used a purple for "recognized"; under deuteranopia it was only about 5.9 away from the reservation blue, so it was replaced with the reddish-purple from the same published set. The dark palette was retuned on its own (it is not an inversion). Dark mode treats data hues as lighter variants to hold contrast on the dark land color.

**Caveats.**
- Color-vision simulation is a model, not a person; test with real users with CVD.
- Vermilion (violation) is an orange-red used in small areas only. Do not extend it to large fills (s.2).
- Print and grayscale: patterns, line styles and icon frames carry the classes; the palette is not required.

### 3.3 Status colors

Not used. The product avoids red/amber/green status coding because it would signal verdicts. Review status, evidence flags and tiers are shown by glyph and text.

---

## 4. Typography

### 4.1 Choices

| Role | Family | Fallbacks (token `--font-*`) | Why |
|---|---|---|---|
| Reading and the record (treaty text quotations, long-form pages, tribal statements) | **Charis SIL** | Charter, Bitstream Charter, Sitka Text, Iowan Old Style, Georgia, Noto Serif, serif | A book face with a wide Latin and diacritic range, designed for extended reading and for linguistic orthographies `[from-memory]`. Indigenous names with modifier letters and combining marks (J1 ADR-013 fixtures) are first-class, not an afterthought. Reads as "document" without a historical costume |
| Interface, data, project voice | **Atkinson Hyperlegible Next** (with Atkinson Hyperlegible) | system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif | Designed by the Braille Institute for low-vision readers; letterforms are built to be told apart (I/l/1, O/0, b/d) `[from-memory]`. That serves accessibility directly and is easy to defend |

Two families, clearly different, used by role, not by taste. Both are open-licensed (SIL OFL) `[from-memory; confirm the exact licence files before bundling]`.

### 4.2 What is not settled: hosting and coverage

1. **J1 ADR-013 says "Noto Sans/Noto Serif via Fontsource, self-hosted."** This identity proposes Charis SIL and Atkinson Hyperlegible as primary, with Noto as the script fallback. That is a change to an accepted decision; the engineering owner should approve it. Cost: two extra font families (about 4 weights each at subset sizes); the J1 budget is about 3 MB total.
2. **Coverage test (required before adoption):** render `tests/fixtures/unicode-names.txt` (J1 ADR-013) in both faces: the modifier letter turned comma U+02BB, combining marks U+0313, U+0301, U+0328, Dakota and Lakota letter variants, colons and glottals. Neither face covers the Cherokee syllabary or Canadian Aboriginal Syllabics `[from-memory]`; those fall back to Noto Sans Cherokee and Noto Sans Canadian Aboriginal, loaded only when the characters appear.
3. **No third-party font requests** (J1 ADR-014): self-host with `unicode-range` subsets.
4. If either face fails the coverage test, fall back to Noto in that role. The tokens already carry that fallback.

### 4.3 Scale and settings

| Token | Size | Use |
|---|---|---|
| `--step-n2` | 0.75rem (12px) | Legal footers only; never for essential content |
| `--step-n1` | 0.875rem (14px) | Captions, labels, chips |
| `--step-0` | 1.0625rem (17px) | Body (larger than the usual 16 for legibility on phones) |
| `--step-1` | 1.25rem | Lead paragraph, drawer title |
| `--step-2` | 1.5rem | Section heads |
| `--step-3` | 1.875rem | Page titles |
| `--step-4` | 2.375rem | Home headline |
| `--step-5` | 3rem | Rare |
| `--step-year` | `clamp(3.25rem, 14vw, 6.5rem)` | The year in the dock: the signature |

Line height: serif body 1.6, sans body 1.5, UI 1.4, headings 1.2, year 1.12. Measure: 62ch for text, 44ch for narrow panels (so line length stays under 80 characters; serif body gets more leading than sans). Weights: 400, 650 (strong), 700. Tracking: display slightly negative (-0.012em), UI slightly positive (0.005em). Tabular (lining) figures for the year, tables and counts.

Typographic rules:
- Sentence case everywhere. No all-caps labels, no tracked-out small-caps eyebrows.
- No single-word accenting in headlines.
- Underline links; do not rely on color.
- Never justify text.
- The year numerals are the only display-size element on the map screen.

### 4.4 Voice-coded blocks

Typography carries the four voices (G3). **Recommendation.**

| Voice | Face | Treatment | Required label |
|---|---|---|---|
| Project summary | Sans | Plain, no frame | "Summary by the project" at the start of a page section |
| Quoted primary source | Serif | Quote bar on the left, indent; citation below | "From the document: [citation]" |
| Tribal statement | Serif | Framed block with title in the nation's name, spelling and date; no seal | "Statement by [Nation or office], [date]" |
| Contributed narrative | Serif | Dashed frame | "Contributed by [name or role], [date]" |

The tribal statement frame is more prominent than the project summary on purpose: where a nation has spoken, its words should be the first thing the eye reaches.

---

## 5. Map styling

### 5.1 Basemap

- **Neutral, low-detail, light and dark.** J1 ADR-005 chooses OpenFreeMap with a Positron-like style and reduced labels at launch, with a Protomaps PMTiles extract as the fallback. This identity restyles whichever basemap is used to the tokens `--map-land`, `--map-water`, `--map-line`, `--map-label`.
- **Land** `#ECEFF2` and **water** `#CFDCE6` in light; `#1A2935` and `#0F1B25` in dark. Grey-blue, so every data hue reads against it.
- **No parcels, no street detail, no buildings, no points of interest.** The minimum zoom ceiling (s.5.6) keeps roads out in any case.
- **Modern labels reduced to context:** state names, major rivers and a handful of cities at low density, in a light weight. Modern state lines drawn faint with a legend note, "modern state lines for orientation." They are not treaty boundaries.
- **Indigenous place names** appear only where a nation supplied them, with attribution. No names are generated or machine-translated (G3).
- **Terrain/hillshade:** none at launch. Terrain adds "wilderness" connotations and hides the hatch.
- **Attribution** for the basemap and the geometry sources is mandatory and sits in the map footer; the accessibility statement lists it.

### 5.2 Fill and line language

Drawing parameters live in `tokens.css` under `--mapstyle-*` and in `tokens.json`.

| Parameter | Value | Use |
|---|---|---|
| Line width, hairline | 0.75 | State lines, ghost outlines |
| Line width, default | 1.5 | Feature edges |
| Line width, Today | 2.25 plus casing (extra 2) | Present-day boundary, always readable on any fill |
| Fill opacity, default | 0.30 | Washes |
| Fill opacity, selected | 0.50 | Selected shape |
| Fill opacity, ghost | 0.10 | "Later change" outlines in Honored mode |
| Dash, T3 | `4 3` | Approximate boundary |
| Dash, ghost | `2 3` | Later changes after year X |
| Pattern size | 8 px | Hatch and dot spacing |

Selection never changes color; it raises opacity and adds a two-ring outline, so selection is visible in grayscale.

### 5.3 Uncertainty (G2 tiers)

Boundaries are shown as less precise than they look. Four tiers `[verified in G2 s.8; renderings are the design]`:

| Tier | Meaning (G2) | Rendering |
|---|---|---|
| T1 | Surveyed or statutory line resolvable to modern coordinates | Solid outline |
| T2 | Described by identifiable features | Solid outline plus a thin buffer (6 px at 14% opacity) |
| T3 | Landmarks moved, vanished or ambiguous; Royce generalization | Dashed outline (`4 3`) plus a soft halo (10 px blur at 20%) |
| T4 | No usable geometry | Icon and text only; no area |

The **exaggeration factor** (2.5) widens buffers and halos as the reader zooms in, so greater zoom never suggests greater precision. `[It is a starting value to be tuned against real data; it is not derived from a measurement.]` The legend line: "Edges are soft where boundaries rest on landmarks."

The zoom ceiling for historical layers is `--mapstyle-historical-max-zoom: 8`, about the scale of the source maps (1:2,000,000 in G2). At the ceiling, the notice replaces sharpening (I3 s.7). The same rule applies to any exported image.

### 5.4 Overlapping claims (G2 s.5)

- One feature per claim. Never dissolve, clip or choose.
- Overlap is shown as overlap: each claimant gets a hatch direction (first claimant forward diagonal, second back diagonal, third crosshatch; beyond three, dotted plus an inline list). Where hatches cross, the eye reads "more than one."
- Claimants are listed alphabetically by endonym in the drawer, never ranked by size or "strength."
- Legend line: "Hatching means more than one nation's documented claim. Darker means more overlapping records, not more land ceded. This map does not adjudicate between nations."
- ICC aboriginal-title regions (dotted edge) never "win" against treaty territory: the legend states the four legal concepts are different questions.

### 5.5 Today and Returns

- Today: ink outline, 2.25 px, with a casing in the opposite value so it reads over any fill in light and dark. It stays on top of every layer.
- Returns: dotted wash with a solid edge in the return hue; a return marker where the geometry is a point or unavailable. Returns are first-class; their legend entry is as large as the cession entry.

### 5.6 What the map will not draw

No parcels, no addresses, no sacred sites, no resolution finer than the source, no automatically computed acreage totals (sums of polygon areas are never shown; acreage comes only from cited sources as ranges; E3 4.3).

### 5.7 Marker rules

Markers are 28 px visible with a 44 px hit target. Clusters get a count badge and a text list; markers that would overlap on screen are fanned out around their true position `[verified in the prototype]`. A marker is never the only way to reach a feature (table view, I3).

---

## 6. Iconography for the B1 violation vocabulary

### 6.1 System

- **Grid:** 24 by 24, 1.75 stroke, round joins and caps, `currentColor`, no fills except a few small solid marks. Single-weight line icons are legible at 16 px, work in grayscale and scale with text.
- **Family is encoded in the frame, not the color:**

| Family (B1) | Frame | Meaning of the frame |
|---|---|---|
| Acts of Congress | Page with a folded corner | A statute |
| Treaty-making and treaty performance | Circle | A relationship between parties |
| Takings of land, water and rights | Hexagon | A boundary or parcel |
| Context codes (not adjudicated breaches) | Dashed square | "Context only"; the dash says it is not a finding |

- **Inside the frame** is a simple glyph for the specific act. The glyph is a diagram, not a pictograph of people.
- **Every icon has a text label** next to it or as a tooltip and `aria-label`; the icon is never the only carrier.
- **Color:** icons use the violation line color (`#B04A00` light, `#FF9A66` dark) except context codes, which use ink 2, to keep "not a finding" visually quieter.
- **Naming:** sprite ids are `vt-` plus the lower-case, dash-separated B1 code; `tokens.json` lists the mapping so code can look it up.

### 6.2 The 23 codes

The task statement refers to a "25-code" vocabulary. **B1 defines 23 distinct codes**, plus one alias used in the CSV (`ANNUITY_NONPAYMENT` for `ANNUITY_NONPAYMENT_OR_DIVERSION`). The sprite and tokens carry the 23 distinct codes; the alias maps to the same symbol. If the final vocabulary is 25, two symbols must be added; a build test should fail if any `violation_type` used in the data lacks a symbol `[Recommendation; add to J4]`.

| Code | Family | Glyph (inside the frame) | Plain label (I5) |
|---|---|---|---|
| UNILATERAL_ABROGATION_STATUTE | Congress | Lines of text struck through | Treaty obligation ended by an Act of Congress |
| DIMINISHMENT_DISESTABLISHMENT | Congress | A shape with a corner removed | Reservation boundaries reduced or ended by statute |
| ALLOTMENT | Congress | Grid of four squares, one filled | Communal land divided into individual parcels |
| TERMINATION | Congress | Two circles, a diagonal break between them | Federal relationship ended by statute |
| JURISDICTIONAL_EROSION | Congress | An open arc with a short bar | Government authority narrowed |
| STATUTORY_EXTINGUISHMENT_SETTLEMENT | Congress | Two bars (an equals sign) | Claim settled or extinguished by statute |
| UNRECOGNIZED_TITLE | Congress | Dotted square with a point | Title not recognized, so not compensable |
| FRAUD_COERCION_NEGOTIATION | Treaty | Two points joined by a slanted bar over a balance base | Treaty obtained by fraud or coercion |
| NON_RATIFICATION | Treaty | Dotted circle | Signed but never ratified |
| TREATY_PROMISE_UNFULFILLED | Treaty | Square with a dashed check | Promised terms not carried out |
| ANNUITY_NONPAYMENT_OR_DIVERSION | Treaty | Coin and an arrow away | Promised payments withheld or diverted |
| FAILURE_TO_PROTECT | Treaty | Shield with a break | Failure to protect against intrusion |
| FORCED_REMOVAL | Treaty | Dashed path and an arrow to the corner | Forced removal from the homeland |
| EMINENT_DOMAIN_INFRASTRUCTURE | Taking | Dam over a wave | Land taken for infrastructure |
| RESOURCE_RUSH_INVASION | Taking | Center mark with four arrows inward | Invasion during a resource rush |
| RAILROAD_GRANT_OR_SALE | Taking | Track ties | Land granted or sold for a railroad |
| FEDERAL_RESERVE_CARVE_OUT | Taking | Rectangle with a notch | Land carved out for federal use |
| WATER_RIGHTS | Taking | Drop | Water rights lost or contested |
| HUNTING_FISHING_RIGHTS | Taking | Fish | Hunting, fishing or gathering rights infringed |
| CONTEXT_INFRASTRUCTURE_SITING | Context | Line with two end points | Infrastructure sited near (context) |
| CONTEXT_FEDERAL_LAND_DISPOSAL | Context | Two opposed arrows | Federal land sold or transferred (context) |
| CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK | Context | Down arrow over a bar | Protection reduced (context) |
| ANNEXATION_CONTEXT | Context | Three dots on a diagonal | Annexation (context) |

Plain labels follow the B1 label rules (I3 s.5.5) and are drafts for I5; the B1 codes themselves are `[verified]` against B1.

Glyphs for "forced removal" and "failure to protect" use abstract marks, never people or weapons. Do not add figures or faces to any icon.

### 6.3 Review-status glyphs

Seven ring glyphs (`rv-...`), one per tribal-review status (G3): empty ring (not yet contacted), dotted (invited), half (edits requested), full (reviewed), double (co-authored), slash (declined), bar (withdrawn). They read as progress of a conversation, not as grades. No color is needed.

### 6.4 Other glyphs

Evidence-flag chips are text ("E3 Consent requirement not met") with the flag code as small type. Uncertainty tiers have a swatch that draws the actual line style. Legal status codes S1 to S9 are text with the code, no icon.

---

## 7. Motion

Principles, **Recommendation**:

1. **Motion answers a gesture.** Things move when a person did something: a sheet slides when opened, the year changes when the slider moves. Nothing animates on page load for decoration.
2. **Show what changed, not that something happened.** When the year changes, features that appeared or disappeared are briefly emphasized by an outline pulse of 400 ms (`--motion-year-fade`), not by a movement of the whole map.
3. **No drama around loss.** Do not animate a shape "shrinking" or "being taken." Alterations appear as outlines at the date; they do not erase the nation.
4. **Play is optional, slow and pausable.** 3 seconds per stop (`--motion-play-interval`), user-initiated, ends on Today, no loop (WCAG 2.2.2).
5. **Reduced motion is a first-class mode.** `prefers-reduced-motion` collapses durations to zero via tokens, Play steps instantly, there is no auto-pan, and a site toggle repeats the option.
6. **Durations:** 90 ms (fast), 180 ms (base), 320 ms (slow); easing curves `cubic-bezier(0.2, 0, 0, 1)` and a settle curve. Sheets use base; year changes use year-fade.
7. **No parallax, no scroll-jacking, no autoplay video, no sound.**

---

## 8. Light and dark

- Light is the default token set on `:root`. Dark applies when `prefers-color-scheme: dark` unless `data-theme="light"` is set, and always when `data-theme="dark"` is set. A site toggle writes `data-theme` and remembers it in `localStorage` inside a try/catch (storage can be blocked); the page works without it.
- Dark mode is a separate palette, not an inversion: the land color is a dark slate, data hues are lighter variants, and the Today outline flips (light ink with a dark casing).
- Both modes meet the contrast numbers in s.3. Both are tested in the prototype at mobile and desktop widths with no console errors `[verified]`.
- Forced-colors (Windows high contrast): tokens include a block that maps interface elements to system colors and keeps patterns; data classes are separated by pattern and line style.
- Print: a print stylesheet drops chrome and prints the legend and the disclaimer with the map; patterns, not color, carry classes.

---

## 9. Shape, space and components

| Token | Value | Use |
|---|---|---|
| Radius sm / md / sheet / pill | 3 / 6 / 16 / 999 px | Small controls / buttons and chips / bottom sheets / badges |
| Space | 0, 2, 4, 8, 12, 16, 24, 32, 48, 64 px | Scale |
| Tap target | 44 px (min 24) | Controls |
| Dock height | 176 px | Mobile |
| Rail / drawer widths | 280 / 384 px | Desktop |
| Z-order | map 0, map UI 10, dock 20, sheet 30, modal 40, toast 50 | |
| Breakpoints | sm 600, md 900, lg 1200 | Documentation tokens (media queries use literal values) |

Components stay few: segmented control, chips, sheet, tab bar, native range input, checkbox switch, buttons (primary is ink on surface, not a brand color), notices (neutral boxes with a plain icon). No cards in grids with identical shadows; lists with rules instead.

---

## 10. Logo and wordmark

None designed. The wordmark is the product name set in the serif at `--step-2` with no symbol. A symbol would invite the imagery rejected in s.2. If a mark is later needed, it should be typographic or a simple abstract of the hatch and the year (a neutral square divided by a diagonal), not a pictorial mark, and reviewed with the tribal advisory conversations (J5 D-01).

---

## Open questions

1. Font decision against J1 ADR-013 (Charis SIL and Atkinson Hyperlegible vs Noto only) and the coverage test.
2. Confirm the vocabulary count: 23 distinct codes in B1 (plus the CSV alias) vs the "25" in the task statement; add symbols if the vocabulary grows.
3. Test the data palette with people who have color-vision deficiency, on actual phones, outdoors.
4. Whether the violation hue should avoid the red-orange family entirely given the s.2 concern; the evidence-flag system makes color secondary, so a blue-violet or neutral variant for violations is possible at the cost of semantics.
5. Whether any photography appears on the site, and under what consent and review process.
6. Wordmark and favicon (not designed).
7. Exact value of the uncertainty exaggeration factor (2.5 is a placeholder).

---

## Sources

- `/home/claude/treaty-land-atlas/docs/research/G2-counterfactual-map-methodology.md` (tiers, overlap, scale limits, no acreage sums)
- `/home/claude/treaty-land-atlas/docs/research/G3-ethics-and-indigenous-data-governance.md` (voice policy, review statuses, accessibility, consent)
- `/home/claude/treaty-land-atlas/docs/research/B1-violation-typology.md` (vocabulary and label rules)
- `/home/claude/treaty-land-atlas/docs/research/F4-donation-integrity-policy.md` (prohibitions on imagery and seals)
- `/home/claude/treaty-land-atlas/docs/design/J1-architecture-decision-records.md` (ADR-005 basemap, ADR-011 budget, ADR-012 accessibility, ADR-013 fonts, ADR-014 privacy)
- The Okabe and Ito colorblind-safe palette: cited from memory; not re-checked this session.
- Contrast and color-vision numbers: computed in this session by a script over the final token values (not an external source).

## Confidence & Gaps

**Confidence: medium.** The contrast and color-vision figures are measured on the final values. The identity choices are reasoned recommendations, not tested with users or with tribal reviewers.

**Gaps.**
- No external verification (web search budget exhausted): font licences, font coverage, the Okabe and Ito attribution and the typeface design claims are `[from-memory]`.
- The color-vision simulation uses standard linear models; real perception varies.
- Print and grayscale rendering not tested.
- The sprite was reviewed visually in a rendered preview and in the prototype; it has not been tested by people with low vision or for recognition.
- No logo, favicon or social card design.
