---
title: Counterfactual "Honored Treaty" Map and Cession Time-Slider Methodology
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# G2. Counterfactual Map and Time-Slider Methodology

**Research agent:** G. **Companions:** G1 (prior art), G3 (ethics and governance), G4 (pedagogy and tours).

**Why this file exists.** The Atlas's hardest feature is a map that shows what territory would look like "if treaties from a given period had been honored," plus a time-slider of cessions and violations. The brief (principles 1, 2, 4, 7) requires accuracy, correct legal vocabulary, tribal voice, and honesty about uncertainty. A counterfactual map is a *model*, not a record. If it is built naively it will (a) imply precision the sources do not have, (b) imply that one nation's claim erases another's, (c) read as a plan to evict private landowners, and (d) mislead users about what courts will actually do. This file proposes a method that avoids those failures.

**Tags:** `[verified]` = confirmed in a source read this session; `[from-memory]`; `[disputed]`; `[unverified]`. Case law verified this session is cited with the page consulted.

---

## 0. Executive summary and recommendation

**Recommended approach: the "ledger, not a verdict" model.**

1. **Build an instrument ledger first.** Every treaty, agreement, statute, and executive order is a record with its own legal category, signing/ratification/proclamation dates, parties, and a cited geometry (or an explicit "no geometry" flag). The ledger is the single source of truth; maps are *queries* over it.
2. **Make the counterfactual a "stop-the-clock" query, not a moral judgment.** "Honored through year X" = the union of areas that, as of year X, were recognized by a ratified instrument or statute as tribal title, reservation, or reserved right, with every *later* alteration shown as an event on a separate, toggleable layer. This is mechanical and defensible: it does not require the site to decide which cessions were "legitimate."
3. **Classify later alterations by documented circumstances, not by site verdict.** Use a small, cited set of *evidence categories* (see section 4) such as "ratified, with recorded tribal delegation," "signatory authority contested," "unratified," "unilateral act of Congress or executive," "taking found compensable by a court," "ICC found unconscionable consideration." The site reports the evidence; it does not stamp "voluntary" or "coerced."
4. **Keep four legal concepts visually distinct:** aboriginal (occupancy) title, treaty-recognized title, reservation, and reserved off-reservation rights (section 3). Never merge them into one "treaty territory" polygon.
5. **Never dissolve overlapping claims.** Store and render each nation's claim as its own feature, with overlap shown as overlap (section 5).
6. **Cap spatial precision at what the sources support**, and show uncertainty (section 8). No parcel-level overlay, no street-address lookup that outputs "stolen land" (section 6).
7. **Attach a "Legal status today" panel to every counterfactual view** that distinguishes what a treaty said from what is legally recoverable now (section 7), reviewed by a legal-history reader before publication.
8. **Per-polygon data lineage** (JSON schema in section 8.1) and a public corrections log (section 9).
9. **Gate nation-specific counterfactuals on tribal review status** (G3 section 3). Ship the general method and public-record layers first; publish nation-specific counterfactual narratives only with a visible review status.

---

## 1. Vocabulary the site must use correctly

The brief (principle 2) requires legally distinct terms to be used correctly. Short operational definitions for editors, with confidence:

| Term | Operational meaning for this site | Anchor |
|------|----------------------------------|--------|
| **Treaty** | Instrument negotiated with a tribal nation, ratified by the Senate and proclaimed (a "ratified treaty"). Distinct from **unratified treaty** (negotiated and signed, not ratified). | Brief; Kappler and National Archives hold 374 ratified treaties `[verified]` (NMAI Nation to Nation; IDA) |
| **Agreement** | Post-1871 instruments negotiated with tribes but enacted by statute rather than treaty ratification. Congress ended treaty-making with tribes by rider in 1871 (Act of Mar. 3, 1871, 16 Stat. 566; 25 U.S.C. 71). | `[from-memory]` |
| **Executive-order reservation** | Reservation created or changed by presidential order. In the USFS Royce digitization, 214 attribute rows link to executive orders. | `[verified]` (USFS metadata) |
| **Aboriginal (Indian) title / right of occupancy** | Occupancy-based right. *Johnson v. M'Intosh*, 21 U.S. (8 Wheat.) 543 (1823): Native nations were "the rightful occupants of the soil, with a legal as well as just claim to retain possession," but their right was limited to occupancy and did not include power to sell to anyone but the discovering government. | `[verified]` (Justia) |
| **Unrecognized-title extinguishment** | *Tee-Hit-Ton Indians v. United States*, 348 U.S. 272 (1955) (decided Feb. 7, 1955): unrecognized Indian occupancy "may be extinguished by the Government without compensation" and "creates no rights against taking or extinction by the United States." | `[verified]` (Justia) |
| **Recognized title** | Title recognized by treaty or Congress. The Court of Claims held in *Crow Tribe of Indians v. United States*, 284 F.2d 361 (Ct. Cl. 1960), that the 1851 Fort Laramie treaty recognized the Crow's title to the lands described, so the Tribe did not need to prove exclusive occupancy from time immemorial (one judge dissented). | `[verified]` (law.resource.org) |
| **Reservation** | Land set aside by treaty, statute, or executive order for a tribe. | `[from-memory]` general |
| **Diminishment** | Only Congress can diminish a reservation, and it must clearly indicate it: "only Congress can divest a reservation of its land and diminish its boundaries." *Solem v. Bartlett*, 465 U.S. 463 (1984) (decided Feb. 22, 1984). Statutory text is most probative; circumstances of passage next; subsequent events least. | `[verified]` (Justia) |
| **Disestablishment** | Wholesale termination of a reservation's existence by Congress; discussed alongside diminishment in later cases, e.g. *Nebraska v. Parker*, 577 U.S. 481 (2016) and *McGirt*. | `[from-memory]` for *Parker*; term-of-art detail `[from-memory]` |
| **Abrogation** | Congress's power to unilaterally end or override treaty provisions; *Lone Wolf v. Hitchcock*, 187 U.S. 553 (1903). | `[from-memory]` |
| **Taking (compensable)** | *United States v. Sioux Nation of Indians*, 448 U.S. 371 (1980) (decided June 30, 1980): the Act of Feb. 28, 1877 effected a taking of the Black Hills for which just compensation with interest was due ($17.1 million principal, 5% interest from 1877, per the Court's calculation). | `[verified]` (Justia) |
| **Termination** | Mid-20th-century federal policy of ending the federal relationship with particular tribes, later reversed in some cases by restoration statutes. | `[from-memory]` |
| **"Broken"** | A colloquial, moral/legal-claim term. The site should use it only with an evidence-linked claim, e.g. "unilaterally altered by the Act of Feb. 28, 1877; found a compensable taking in 1980." | Brief principle 2 |

**House rule:** prefer the specific term ("diminished by the Act of ___," "taken without the three-fourths consent the treaty required") over "broken." Where the 1868 Fort Laramie treaty's consent requirement is cited, note that a North Dakota education page states it "required the approval of three-fourths of the adult males of the tribes" `[verified]` (ndstudies.gov) and that the Supreme Court's 1980 holding concerned an 1877 taking `[verified]`.

---

## 2. What each map "lens" actually shows (options a-f)

### 2(a) "Treaty-as-signed" layers
- **Definition:** for each instrument, show the area described in the instrument at the date it was signed (or ratified/proclaimed; see date semantics, section 8.3).
- **Strength:** closest to primary sources; Kappler and NARA provide the text; the USFS/Royce digitization provides a geometry candidate for 1784-1894 instruments, each with links to the Kappler text, statute, or EO `[verified]`.
- **Weakness 1, semantics:** a treaty can describe *the ceded area* or *the reserved area*. Saunt notes officials "sometimes... described the reserved tract rather than the ceded land, because that was easier to define" `[verified]` (Aeon). The geometry for a record must carry a field saying which it is.
- **Weakness 2, geometry:** the shapes are Royce's interpretation, georeferenced at 1:2,000,000 `[verified]`.
- **Weakness 3, "treaty-as-signed" is not "treaty-as-understood."** The 1851 Fort Laramie treaty was written in English with too few interpreters, and the government's representative decision-making clashed with Plains consensus practice `[verified]` (ndstudies.gov). Tribal accounts of what was agreed may differ from the text; the site must be able to carry a "tribal account" field (G3 section 5).
- **Verdict:** essential as the *base layer*; not itself a counterfactual.

### 2(b) "Honored through year X" layers
- **Definition:** apply only the instruments valid at year X; exclude later cessions.
- **Mechanics (recommended "stop-the-clock"):**
  1. Select year X (e.g. 1830, 1868, 1887).
  2. Compute the set of *recognition events* in effect at X: ratified treaties and statutes that recognized title or set aside a reservation, and had not yet been altered.
  3. Display that set as the "retained" layer.
  4. Show every alteration after X as an event layer: each carries a category (section 4) and a citation.
- **Strength:** avoids deciding legitimacy. It simply answers: "what had the United States already promised by year X?"
- **Key design choice: which X?** Pre-set "cut-points" make the feature teachable and prevent endless cherry-picking: 1783 (Revolutionary War end), 1830 (Indian Removal Act era), 1851/1868 (Fort Laramie), 1871 (end of treaty-making), 1887 (General Allotment Act). Dates for the statutes are `[from-memory]`; the editors must verify each cut-point date and the instrument sets against Kappler before publishing.
- **Weakness:** many cessions were agreed to by the nation *after* the year X promise (see 2(b)-ii). Treating all later transfers as "excluded" collapses the difference between a negotiated sale and a coerced taking, and can read as denying tribal agency.

#### 2(b)-ii Voluntary vs. duress
The site should not decide "voluntary" or "coerced" as a universal label. What it can do, with sources:
- Carry **documented circumstances** as cited text: e.g. Saunt: treaties were "often negotiated under duress or facilitated with bribes" and frequently violated `[verified]` (Aeon, general statement, not per-treaty).
- Carry **procedural facts that can be verified instrument by instrument**: ratified or not; signatories and whether a national council had authorized them. *Example:* Treaty of New Echota (Dec. 29, 1835): the NPS page reproducing Chief John Ross's Sept. 28, 1836 protest says it was signed by Major Ridge and members "not authorized to sign on their behalf" and that it was not "the act of our Nation"; a DocsTeach lesson says the National Cherokee Council sent a 1836 petition signed by 3,352 Cherokee urging the Senate not to ratify and that the Senate ratified by one vote in May 1836 `[verified]` (NPS, DocsTeach).
- Carry **judicial findings** where they exist: e.g. the Indian Claims Commission could award money where consideration was "unconscionable" or dealings not "fair and honorable" `[verified]` (ICC final report).
- Carry the **tribe's own published account**, when the nation provides one (with permission).
- Then offer *lenses* (viewer's choice, default neutral): **Federal-record lens** (what US law treated as valid); **Evidence-flag lens** (adds the flags above); **Tribal-account lens** (only where a nation has contributed).

### 2(c) Reservation at peak vs. treaty territory vs. aboriginal title (ICC findings)

These are three different legal objects. The map must not show them as one fill.

| Object | Legal basis | Source for geometry | Positional quality | Visual encoding (proposed) |
|--------|------------|---------------------|-------------------|---------------------------|
| **Aboriginal title as judicially established** | Occupancy proven before the Indian Claims Commission or Court of Claims; ICC required "exclusive use and occupancy of a definable territory" and "if more than one tribe used an area, exclusivity was usually denied" `[verified]` (ICC final report) | 1978 USGS/ICC map at 1:4,000,000, "Indian land areas judicially established" `[verified]` (LOC; USGS) | Very coarse; no vector dataset found `[unverified]` | Broad hatch / low-opacity wash, labeled "indicative region" |
| **Treaty-recognized title / treaty territory** | Instrument recognizing title (e.g. 1851 Fort Laramie as to the Crow, per the Court of Claims) | Royce / USFS polygons where the instrument describes a cession or reservation; many "territory definition" treaties (1851 Fort Laramie "did not create a reservation" `[verified]`, ndstudies.gov) are not in Royce as cessions | Variable | Outline, dashed if described by landmarks |
| **Reservation (as set aside)** | Treaty, statute, or EO | Royce / USFS for 1784-1894; later changes need other sources | Variable | Solid fill |
| **Reserved off-reservation rights** | Treaty clauses reserving hunting/fishing/gathering | Textual; sometimes "usual and accustomed places" | Often non-polygon | Icon + text, not area |

**"At peak" is ill-defined.** There is no single moment at which all nations were at their maximum; maxima differ by nation and by definition. Do not offer a "peak reservation" button. Offer named, citable states instead: "Reservation as established by [instrument, date]," "Reservation as of [year]."

**Why separate aboriginal title?** Under *Tee-Hit-Ton* the sovereign could extinguish unrecognized title without compensation; the ICC remedy was money only, and the Commission could issue only money awards, terminating Sept. 30, 1978 `[verified]` (ICC final report). A map that blurs "area the tribe proved it occupied" with "area a treaty guaranteed" would overstate legal status.

**ICC finality caution.** *United States v. Dann*, 470 U.S. 39 (1985) (decided Feb. 20, 1985; unanimous): "payment" under section 22(a) of the ICC Act occurred when the award was placed in an interest-bearing Treasury trust account, which barred the Danns' tribal title defense; the Court left open the individual-rights question `[verified]` (Justia). That means an ICC award can be treated as a legal endpoint even where the tribe never took the money. The Sioux Nation's refusal of the Black Hills payment (the fund has grown past $1 billion; reported as $1.3 billion in a 2011 PBS NewsHour item) is the best-known example of a tribe contesting that finality in practice `[verified]` (PBS NewsHour).

### 2(d) Overlapping claims between nations

See section 5 (full treatment). Summary: store each claim as its own feature; never dissolve; render overlap as overlap; use ICC "exclusive use" findings as evidence, not as proof of absence of others' claims.

### 2(e) Private land, cities, current residents

See section 6.

### 2(f) What the treaty said vs. what is legally recoverable

See section 7.

---

## 3. Recommended layer model

| Layer | Content | Default visibility |
|-------|---------|--------------------|
| L0 Base | Modern basemap, minimal labels; no parcel lines | On |
| L1 Instruments as signed | Polygon (or "no geometry" card) per instrument, with type, status (ratified/unratified/EO/statute), and Royce/USFS lineage | Off until selected |
| L2 Recognized-at-year-X | Result of the stop-the-clock query | On in counterfactual mode |
| L3 Alteration events | Cessions, diminishments, EO changes, allotment openings, takings, with evidence category | On, color-keyed |
| L4 Judicially established aboriginal title | Indicative regions from the 1978 map | Off |
| L5 Reserved rights | Icons/text for off-reservation hunting/fishing/gathering | Off |
| L6 Today | Present-day reservations and trust lands (from federal boundary sources; the data-sources agent should specify) | On, always visible context |
| L7 Land-status context | Public vs private land (e.g. federal agencies' land layers) at coarse resolution only | Off; opt-in |
| L8 Returns and restorations | Verified land returns, co-management, restoration acts | On in time-slider |

L6 must always be one click from any historical view, so no historical view stands alone (G4).

---

## 4. Consent and duress: evidence categories

**Principle:** categories describe *documented procedure and findings*, each with citations. They are not the site's verdicts. They are edited with tribal input (G3).

| Category | Meaning | Example of evidence required |
|----------|---------|-----------------------------|
| E0 Ratified, no recorded procedural contest | Treaty ratified and proclaimed; no source on file contesting authority or process | Kappler + Stat. cite |
| E1 Ratified, signatory authority contested | Ratified, but credible sources record that signatories lacked tribal authorization | E.g. New Echota per NPS (Ross letter) and DocsTeach `[verified]` |
| E2 Unratified | Signed but not ratified; land nonetheless occupied/treated as ceded | Kappler/National Archives notes; HCN uses "unratified treaty" as a transfer-method value `[verified]` |
| E3 Consent requirement not met | Instrument required a supermajority or tribal consent and a later act bypassed it | E.g. 1868 Fort Laramie's three-fourths requirement vs. the 1877 Act (as litigated in *Sioux Nation*) `[verified]` |
| E4 Unilateral act | Statute or executive order altering boundaries without negotiation | E.g. EO changes (Saunt cites Chehalis reduced by Lincoln in 1864 and Cleveland in 1886 `[verified]`, Aeon) |
| E5 Compensation found inadequate or unfair by a court | ICC finding of unconscionable consideration; other judgments | ICC docket + final judgment |
| E6 Taking found compensable | Court holding of a compensable taking | *Sioux Nation* (1980) `[verified]` |
| E7 Tribe-asserted account | Nation's published account of the transaction | Tribal source, with permission |

**Rules**
1. A record may carry several flags. The default map popup shows the neutral label ("Treaty cession, ratified 18xx") and a count of flags; details are one click away.
2. The "violation" language on the time-slider is reserved for records with E3-E6 or E7; E0 is shown as "alteration" with no judgment.
3. Do not infer duress from a date alone (e.g. "post-war treaty = coerced"). Each flag needs a citation.
4. The editorial team publishes a short public explainer of the categories, reviewed by the tribal advisory body (G3).
5. Where a nation declines to have its records categorized, show the instrument and sources only.

---

## 5. Overlapping and contested boundaries (honest representation)

**The problem.** Multiple nations used, claimed, or were assigned the same areas. The ICC's own doctrine illustrates the difficulty: for aboriginal title it required exclusive use and occupancy, and "if more than one tribe used an area, exclusivity was usually denied" `[verified]` (ICC final report). In *Crow Tribe v. United States* (1960), the majority treated the 1851 treaty as recognizing Crow title; the dissent argued that several tribes, including the Sioux, roamed the same vast area so no exclusive occupancy was shown `[verified]` (law.resource.org). The 1851 Fort Laramie treaty itself set out boundaries for multiple nations and tied the recognition of territory to responsibility for order, preserved hunting, fishing, and travel rights across tracts, and recognizing title did not bar others from entering `[verified]` (Crow Tribe opinion summary; ndstudies.gov). So overlap exists in the sources.

**Design rules**
1. **One feature per claim, never dissolved.** The data model has no "owner" field on land; it has *claims* with a basis (treaty, ICC finding, tribal account) and a holder (nation).
2. **Render overlap visibly:** semi-transparent fills with distinct hatching; at overlap, show a combined pattern; popups list all claimants in a neutral order (alphabetical by endonym), not by size or date.
3. **Never label a place "the territory of X"** where multiple claims exist; label "areas associated with X, Y, Z in [source]."
4. **Attach a basis tag to each claim** (treaty-recognized, ICC-judicial, NLD-community-sourced, tribal account) so users see *why* each nation appears.
5. **"Counterfactual for one nation" must not shrink others.** The nation-specific counterfactual view shows that nation's claim *and* grays-in other claimants' overlaps with a persistent note: "Other nations' claims overlap this area. This map does not adjudicate between nations." No view should ever imply that restoring one claim extinguishes another.
6. **Defer to nations on inter-tribal matters.** Where nations have agreements among themselves, link to the nations' own statements. The site does not mediate.
7. **Contradictory accounts are first-class.** Follow Native Land Digital's practice of keeping contradictory accounts because "different families and tribes may hold different histories" `[verified]` (NLD FAQ).
8. **Use NLD only as context, never as the treaty basis** (NLD says its maps are not official or legal boundaries) `[verified]`.

---

## 6. Presenting private land, cities, and current residents

**Risks:** (a) a map that paints a city "stolen" can be read as a threat to residents; (b) a lookup tool can become a harassment or doxxing vector; (c) implying evictions would be inaccurate and would damage the cause; (d) it centers settler anxiety rather than Indigenous goals.

**Guardrails**
1. **No parcel or address-level overlay.** The source geometry is far too coarse (1:2,000,000 georeferencing; at that scale 1 mm on the source map equals 2 km on the ground, arithmetic). Minimum display scale should be capped (suggest not finer than county-scale context) so nobody can read a boundary as passing through a specific lot.
2. **If a place lookup exists**, it returns *place-level history* (county or named locality): which nations are associated with the area in cited sources, which instruments applied, and current reservations nearby. It never says "your home is on stolen land," never prints an address back, and never ranks "violations near you."
3. **Plain, non-inflammatory copy** (see sample below). Describe documents and legal outcomes; avoid the word "steal" unless quoting or attributing (e.g. Saunt's "dispossession").
4. **State what the project does and does not ask.** The Atlas does not propose evicting private landowners. This is a factual statement about the project's content; confirm wording with counsel and the advisory body before launch. Note that Land Back organizations are self-described and diverse (NDN Collective frames LANDBACK as a political, organizing, and narrative framework `[verified]`); do not attribute positions to them beyond their own words.
5. **Show examples of how land actually returns**, because they model realistic pathways: Taos Pueblo's Blue Lake returned by Public Law 91-550 (signed Dec. 15, 1970; 48,000 acres) `[verified]`; the Yurok Tribe's 47,097-acre Blue Creek/Klamath transfer, bought in pieces from a timber company by Western Rivers Conservancy at a total cost of $56 million, partly state-funded, with trust placement a future step `[verified]` (Grist); and the Great Sioux Nation leaders' proposal to seek unused federal land and co-management or rental arrangements while excluding Mount Rushmore, Ellsworth Air Force Base, and private property `[verified]` (PBS NewsHour). These show returns centered on public, willing-seller, and co-managed land.
6. **Land-status context at coarse resolution only:** e.g. "about X% of this county is federally managed public land" (via an agency dataset; the data agent should specify) so the conversation can focus on public-land co-stewardship. Do not claim percentages without a cited layer.
7. **Cities:** label as places. "Tulsa lies within the boundaries of the Muscogee (Creek) reservation recognized in *McGirt*" is accurate: the Court held that land reserved for the Creek Nation is still "Indian country" under the Major Crimes Act, in a reservation that includes most of Tulsa `[verified]` (Justia summary). Then explain what that did and did not change (criminal jurisdiction over certain crimes, not property title); the explainer wording needs legal review (the full opinion text beyond the first 100,000 characters was not read).

**Sample neutral copy (draft, for review)**
> "This area is described in the Treaty with the [Nation], signed [date] and ratified [date]. The treaty reserved [what] for [Nation]. In [year], [instrument] changed that. Today the area includes [cities/counties], and about [X%] is public land [source]. This map shows what the documents say. It is not a legal boundary and is not a proposal about any person's home."

---

## 7. "What the treaty said" vs. "what is legally recoverable today"

A "Legal status today" panel appears on every counterfactual view. It uses a fixed taxonomy, not a free-text verdict, and it is reviewed by a legal-history reader before publication.

| Status | Meaning | Verified anchors |
|--------|---------|-----------------|
| S1 Reservation boundaries intact | Congress never clearly diminished | *McGirt v. Oklahoma*, 591 U.S. ___ (2020) (decided July 9, 2020; No. 18-9526): Creek reservation remains Indian country for Major Crimes Act purposes; "only Congress can... diminish" `[verified]` |
| S2 Diminished | Congress clearly ceded part | *Solem* framework (statutory text > circumstances > later events) `[verified]` |
| S3 Disestablished / terminated | Reservation or federal relationship ended | `[from-memory]` examples; to research |
| S4 Aboriginal title extinguished with ICC payment | Money award ends claim | *Dann* (1985) `[verified]`; ICC money-only remedy `[verified]` |
| S5 Compensable taking recognized, land not returned | Court found a taking; remedy was money | *Sioux Nation* (1980) `[verified]`; tribe's refusal reported by PBS `[verified]` |
| S6 Equitable bars to regaining sovereignty over reacquired land | Doctrine barring unilateral revival of sovereignty over parcels bought on the open market | *City of Sherrill v. Oneida Indian Nation*, 544 U.S. 197 (2005): laches/acquiescence/impracticability; "disruptive remedy"; reacquisition on the open market does not restore sovereignty; the Court pointed to the federal trust-acquisition statute (then 25 U.S.C. 465) as "the proper avenue" `[verified]` (law.resource.org). The Court left *Oneida II* damages undisturbed. `[verified]` (section was later renumbered; current section `[from-memory]`: 25 U.S.C. 5108) |
| S7 Treaty rights currently enforceable | Off-reservation or reserved rights alive | *Herrera v. Wyoming* (May 20, 2019; 5-4): Wyoming statehood did not cancel the Crow Tribe's 1868 treaty hunting right on "unoccupied lands"; Bighorn National Forest lands did not automatically become "occupied" `[verified]` (SCOTUSblog). *Washington v. Washington State Commercial Passenger Fishing Vessel Ass'n*, 443 U.S. 658 (1979): treaty fishing right to a "fair share" of fish, up to half the harvest, not more than needed for a moderate living `[verified]` (DOJ page) |
| S8 Restored or returned by statute or purchase | Land returned | Blue Lake (1970) `[verified]`; Yurok (2025) `[verified]` |
| S9 Under litigation or negotiation | Active matters | Needs live research; do not publish without a date stamp |

**Sample panel language (draft for review)**
> "What the treaty said: [quote with cite]. What happened: [events]. What the courts have decided: [cases]. What this means today: [one plain sentence]. This panel summarizes legal history for education. It is not legal advice and is not a statement about any current legal claim."

**How to avoid misleading users**
1. **Always pair a counterfactual with its legal status panel**, even if collapsed.
2. **Use "would have" and "as described" language**, never "is rightfully."
3. **Name the doctrines:** *Johnson v. M'Intosh* (title vs. occupancy), *Tee-Hit-Ton* (uncompensated extinguishment of unrecognized title), *Lone Wolf* (`[from-memory]`) for plenary power, ICC (money only), *Sherrill* (equitable bars), so users understand why the legal answer differs from the moral one.
4. **Do not use the panel to argue that nothing can be done.** *McGirt*, *Herrera*, the fishing cases, and land returns show that treaties remain operative law and that land does return. Present both.
5. **Pre-publication review gate:** a lawyer or legal historian signs off on each panel and on the taxonomy; the sign-off date and reviewer role appear on the panel.
6. **Cite pin-cites**, not just case names, in the data layer.

---

## 8. Data lineage, uncertainty, and rendering

### 8.1 Per-polygon lineage schema (proposed)

```json
{
  "id": "geom:royce-cess-0123@v3",
  "instrument_id": "treaty:1868-fort-laramie",
  "instrument": {
    "type": "ratified_treaty | unratified_treaty | agreement | statute | executive_order | other",
    "kappler_cite": "vol. 2, p. ___",
    "stat_cite": "15 Stat. ___",
    "date_signed": "1868-04-29",
    "date_ratified": "YYYY-MM-DD",
    "date_proclaimed": "YYYY-MM-DD",
    "date_semantic_note": "USFS dates are signing dates, not proclamation dates"
  },
  "geometry_role": "cession | reservation | territory_definition | reserved_right_area | judicial_title_area",
  "parties": [
    {
      "historical_name_in_source": "as printed in Royce/Kappler",
      "endonym": "nation's own name, if known",
      "present_day_successor": "federally recognized nation(s)",
      "successor_basis": "USFS/NAGPRA attribute | tribal statement | other",
      "successor_review_status": "unreviewed | tribal_confirmed | tribal_corrected"
    }
  ],
  "boundary_description_text": "verbatim from treaty article",
  "boundary_type": "surveyed_line | existing_landmark | vanished_or_ambiguous_landmark | map_generalization",
  "geometry_source": {
    "dataset": "USFS Indian Land Cessions in the United States (CESSNUM ___)",
    "license": "CC BY 4.0",
    "original_source": "Royce, 18th Ann. Rept. BAE, Pt. 2 (1899), map ___",
    "georeferencing": "USGS 1:2,000,000 National Atlas; NAD83 LCC -> WebMercator",
    "digitization_notes": "USFS 2015; revised 2018 with Saunt",
    "reviewed_against_treaty_text": "yes | no | partial",
    "reviewer": "role and date"
  },
  "uncertainty": {
    "tier": "T1 | T2 | T3 | T4",
    "reason": "text",
    "min_display_scale": "1:2,000,000 (or coarser)",
    "render": "solid | dashed | fuzzy_buffer | schematic"
  },
  "evidence_flags": ["E1", "E3"],
  "evidence_citations": ["..."],
  "legal_status_today": ["S1", "S5"],
  "tribal_review": {"status": "none | invited | reviewed | co-authored | declined | edits_requested", "date": "", "contact_role": ""},
  "sensitivity": {"tier": "public | generalized | withheld", "notes": ""},
  "version": {"semver": "3.1.0", "changed": "YYYY-MM-DD", "change_note": "", "change_id": ""}
}
```

*Notes.* Field `date_semantic_note` reflects the USFS caveat that dates are signing dates `[verified]`. `geometry_source.georeferencing` reflects the USFS metadata `[verified]`. Tier definitions follow.

### 8.2 Uncertainty tiers (proposed; no numeric accuracy claims made)

The USFS metadata has no formal positional accuracy statement `[verified]`, so I do not assign meters. Use classes plus the scale arithmetic above.

| Tier | Boundary basis | Render |
|------|---------------|--------|
| T1 | Surveyed or statutory line that can be resolved to modern coordinates (e.g., a parallel or surveyed reservation line) | Solid outline |
| T2 | Described by existing, identifiable features (a river that still flows near its old course, a ridge) | Solid outline with thin buffer |
| T3 | Described by features that have moved, vanished, or are ambiguous; or Royce generalization; or Saunt's point that boundaries "followed watersheds, foothills, and mountaintops that surveyors couldn't locate precisely" `[verified]` | Dashed outline, soft/feathered edge |
| T4 | No usable geometry (e.g., the seven Royce IDs with no spatial representation `[verified]`; hunting-right or "usual and accustomed" areas) | Schematic icon + text only |

### 8.3 Date semantics
Use three dates (signed, ratified, proclaimed). The *effective date* for the stop-the-clock query is the proclamation date for treaties and the enactment date for statutes. USFS dates are signing dates `[verified]`, so the pipeline must re-derive effective dates from Kappler/Stat.

### 8.4 Rendering uncertainty honestly
- Use **edge treatment** (feather/hatch/dash) plus **text label** plus **legend**; never rely on color or blur alone (accessibility, G3 section 11).
- **Do not add false precision at zoom:** when the user zooms beyond the minimum display scale, hold the geometry's level of detail and show a notice instead of continuing to sharpen.
- **"Show me the uncertainty" toggle** that exaggerates buffers for teaching.
- **Academic basis:** there is a literature on visualizing geodata uncertainty (e.g., MacEachren and colleagues; Kinkeldey and colleagues) `[from-memory]`; the data/UX agents should locate and verify citations before relying on them.

---

## 9. Data-quality concerns and corrections

### 9.1 Known issues with the Royce base (what is verified)
- **Georeferencing scale:** Royce maps georeferenced against 1:2,000,000 data `[verified]`.
- **Missing geometry:** seven cession IDs (47, 65, 128, 129, 130, 543, 690) have no spatial representation `[verified]`.
- **Unreviewed edits:** 89 rows (IDs 69, 134, 172, 661, 690) edited by the USFS Office of Tribal Relations but not reviewed by the NAGPRA Program `[verified]`; dates changed for 15 IDs; map names for 39 `[verified]`.
- **Present-day tribe attribution** is under reevaluation by NAGPRA `[verified]`.
- **Boundaries not well-defined:** Saunt: "neither well-defined nor contiguous"; the 1899 maps present a tidy picture that is "a fantasy" `[verified]`.
- **Reserved vs ceded confusion** (see 2(a)).
- **Coverage:** through 1894 only; earliest cessions omitted in places `[verified]` (secondary); later allotment and EO changes need other sources `[from-memory]`.
- **Colonial framing:** the very word *cession* presents transfers as agreed conveyances; Royce uses period tribal names (USFS holds separate "Tribe Named in Land Cessions, 1784-1894" and "Present-Day Tribe" fields) `[verified]`; and Cyrus Thomas's introduction addresses the legal framework of "imperial entities" (Wikipedia description; the text itself not read) `[verified]` (secondary).
- **No peer-reviewed critique of Royce was reviewed this session** `[unverified]`; the data-quality section relies on USFS metadata and Saunt.

### 9.2 Natural landmarks that no longer exist
Treaties often describe boundaries by rivers, trees, hills, or "to the source of" features. Handling:
1. Record the *verbatim text* with the geometry (field `boundary_description_text`).
2. Mark T3 where a landmark is not resolvable.
3. Where historians or surveyors have published a reconstruction, cite it and record the method; prefer the nation's own account where offered.
4. Never "snap" a vague boundary to a modern feature (a road, a county line) to make it look cleaner.

### 9.3 Corrections and versioning
- **Semantic versioning of the dataset** and per-polygon `version`; immutable IDs.
- **Public corrections log:** every change records who/what/why/source; HCN's practice of appending corrections to the article is the model `[verified]`.
- **Upstream sync:** subscribe to USFS dataset updates and report issues to the named USFS contact `[verified]`.
- **Tribal-requested edits take priority** and are processed on a fast lane (G3 section 7).
- **Citation stability:** archive releases with persistent identifiers (e.g., a DOI service) `[from-memory]`.

---

## 10. Failure modes (red-team list)

| Failure | Mitigation |
|---------|-----------|
| Viewer reads a counterfactual as a legal claim | Legal status panel; "not a legal boundary" labels (as USFS and NLD do) `[verified]` |
| Overlaps resolved by drawing one nation's polygon on top | No dissolve rule; hatching; popup lists all claimants |
| Site implies a nation consented ("cession") or didn't | Evidence flags, neutral default label |
| Uncertainty ignored when screenshots circulate | Watermark/legend embedded in exports; export includes lineage line |
| Private homeowner targeted | No address-level output; coarse minimum scale |
| Nation-specific content published without review | Review-status gate (G3) |
| Misattributed successor nation | `successor_review_status`; ask nations |
| Sacred-site disclosure through geometry | Sensitivity tier; no site-level points (G3 s.4) |
| Graphic of "vanishing" nations | Always show L6 Today and L8 Returns (G4) |
| Legal error in the status panel | Legal-reviewer sign-off with date |

---

## 11. Open decisions for Benjamin and the design wave

1. **Which cut-point years** ship in v1? (Recommended: 1783, 1830, 1851, 1868, 1871, 1887, each verified against Kappler/Stat.)
2. **Lens defaults:** federal-record lens default with evidence flags one click away (recommended), versus evidence lens default.
3. **Whether to offer any place lookup** at all (recommended: county-level only).
4. **Who is the legal reviewer** and what is the review cadence?
5. **Whether to build a vector layer** from the 1978 ICC map (large effort; recommended to defer; render as indicative image overlay at most).
6. **Scope boundary:** the 374 ratified treaties and Royce coverage (1784-1894) are the v1 base; pre-1784 colonial-era agreements and post-1894 changes are separate workstreams.
7. **Contact plan with NLD, USFS, MIAC, HCN** (G1 section 19).

---

## Sources

Fetched or returned by search this session (accessed 2026-10-16):

- Johnson v. M'Intosh: https://supreme.justia.com/cases/federal/us/21/543/
- Tee-Hit-Ton Indians v. United States: https://supreme.justia.com/cases/federal/us/348/272/
- City of Sherrill v. Oneida Indian Nation: https://law.resource.org/pub/us/case/reporter/US/544/544.US.197.03-855.html
- Solem v. Bartlett: https://supreme.justia.com/cases/federal/us/465/463/
- McGirt v. Oklahoma: https://supreme.justia.com/cases/federal/us/591/18-9526/
- United States v. Sioux Nation of Indians: https://supreme.justia.com/cases/federal/us/448/371/
- United States v. Dann: https://supreme.justia.com/cases/federal/us/470/39/
- Crow Tribe of Indians v. United States, 284 F.2d 361: https://law.resource.org/pub/us/case/reporter/F2/284/284.F2d.361.1-59.html
- Indian Claims Commission final report: https://nill.narf.org/documents/icc_final_report.pdf
- Herrera v. Wyoming (SCOTUSblog): https://www.scotusblog.com/case-files/cases/herrera-v-wyoming/
- DOJ, US v. Washington / Fishing Vessel: https://www.justice.gov/enrd/us-v-washington
- NPS, Protest against the Treaty of New Echota: https://www.nps.gov/articles/000/protest-treaty-of-new-echota.htm
- DocsTeach, petition against New Echota: https://docsteach.org/lesson/analyzing-the-petition-against-the-treaty-of-new-echota/
- ND Studies, Fort Laramie treaties: https://www.ndstudies.gov/gr8/node/137
- LOC, Indian land areas judicially established: https://www.loc.gov/item/80695449/ ; USGS: https://pubs.usgs.gov/publication/70114965
- USFS cessions layer, catalog, and metadata: https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/0 ; https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer ; https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml
- Saunt, Aeon: https://aeon.co/essays/how-were-1-5-billion-acres-of-land-so-rapidly-stolen
- Open Culture on Invasion of America: https://www.openculture.com/2018/05/interactive-map-shows-the-seizure-of-over-1-5-billion-acres-of-native-american-land-between-1776-and-1887.html
- HCN Land-Grab Universities: https://www.hcn.org/issues/land-grab-universities/ ; data: https://github.com/HCNData/landgrabu-data
- Native Land Digital FAQ: https://native-land.ca/about/faq
- PBS NewsHour, Black Hills: https://www.pbs.org/newshour/updates/north_america-july-dec11-blackhills_08-23
- Taos Pueblo, Blue Lake: https://taospueblo.com/blue-lake/
- Grist, Yurok land return: https://grist.org/indigenous/in-californias-largest-landback-deal-the-yurok-tribe-reclaims-sacred-land-around-the-klamath-river/
- NDN Collective, LANDBACK: https://ndncollective.org/landback/
- NMAI Nation to Nation: https://americanindian.si.edu/nationtonation/
- Wikipedia, Indian Land Cessions in the United States: https://en.wikipedia.org/wiki/Indian_Land_Cessions_in_the_United_States

## Confidence & Gaps

**Overall: medium.** The framework is built on verified legal anchors and verified dataset metadata; the design proposals are my own recommendations and have not been reviewed by a lawyer or any tribal body.

**Verified this session:** *Johnson*, *Tee-Hit-Ton*, *Sherrill*, *Solem*, *McGirt*, *Sioux Nation*, *Dann*, *Crow Tribe* (summary), *Herrera*, *Fishing Vessel* (via DOJ page); ICC structure and remedies; USFS dataset lineage and caveats; 1978 ICC/USGS map metadata.

**Not verified (`[from-memory]` or `[unverified]`)**
1. Statutory cites: Act of Mar. 3, 1871 (16 Stat. 566; 25 U.S.C. 71); current numbering of former 25 U.S.C. 465 (now 5108); General Allotment Act details; termination and restoration statutes.
2. *Lone Wolf v. Hitchcock*, *Nebraska v. Parker*, *Oneida II*, *Cayuga v. Pataki*, *Hagen v. Utah*, *Castro-Huerta* were not opened; they are referenced or omitted accordingly. The legal reviewer should add pin-cites.
3. Full text of *McGirt* beyond the first 100,000 characters of the Justia page; the "what McGirt did and did not change" explainer needs legal review.
4. Pin-cites and holdings for *Fishing Vessel* are from a DOJ summary page, which also did not cover the 1974 *Boldt* decision.
5. Positional accuracy of Royce's maps: no formal statement exists in the USFS metadata; I assign classes, not meters. Royce's original map scales were not verified.
6. Academic literature on uncertainty visualization: not verified; citations left as `[from-memory]` placeholders.
7. The 1978 ICC map has no vector dataset that I could find; whether one exists elsewhere is unknown.
8. No published scholarly critique of Royce (beyond Saunt) was reviewed.
9. Fort Laramie 1851 overlap details come from a court-opinion summary and an education page, not the treaty text.
10. Land-status percentages (public vs private) require a cited dataset; none was reviewed here.
