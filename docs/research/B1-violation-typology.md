---
title: Typology of Treaty Violations, Abrogations and Takings
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# B1. A Defensible Typology of Treaty Violations, with Timeline

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

**What this file is.** The Atlas's core feature is showing *which* treaties were broken *and how*. "Broken" is a lay word that hides several different legal events. This file defines the terms precisely, gives a controlled vocabulary (`violation_type`) that the data model can use, and ends with a sourced timeline. Worked examples refer to catalog entries (V001-V062) in `B2-violation-catalog.md`; remedies and acknowledgments are in `B3-land-returns-and-restitution.md`. Related files by other agents: `C1-case-law-survey.md`, `C2-statutes-and-policy-eras.md`, `D2-policy-eras-timeline.md`, `D4-glossary.md`, `F3-land-returns-and-campaigns.md`.

**Tag convention (from the brief).** `[verified]` = confirmed in a source I read this session (source tier is shown in the Sources list: P primary, A authoritative secondary, T tertiary/journalistic); `[from-memory]` = believed correct, not checked; `[disputed]`; `[unverified]`.

---

## 1. Why precision matters

A reviewer will test whether the site uses a legally loaded word without support. The same historical event can be described in several ways, and the choice changes the legal meaning:

- *The U.S. broke the 1868 Fort Laramie Treaty* is true in a lay sense. The legally exact description is: **Congress abrogated Article 16 and took the Black Hills by statute (Act of Feb. 28, 1877, 19 Stat. 254), and the Supreme Court later held that this was a taking requiring just compensation (*United States v. Sioux Nation*, 1980).** `[verified]` (statute and opinion read).
- *The U.S. broke its treaties with the Cherokee* is not precise. The exact sequence is: the Cherokee Nation (under Principal Chief John Ross) opposed a cession signed by a minority faction; the Senate ratified the **Treaty of New Echota** (1835, 7 Stat. 478) by a single vote in 1836; and the U.S. then enforced removal in 1838. The contested element is *authority to sign*, not statutory abrogation. `[verified]` (OSU Kappler text, NCpedia, Wikipedia; exact Senate tally 31-15 is `[from-memory]`).
- *The U.S. broke the treaty with the Seneca at Kinzua* is arguable from the Seneca's side, but the D.C. Circuit held in 1958 that Congress had clearly authorized the taking of the treaty-protected land by eminent domain, so there is no court-recognized "breach." `[verified]` (*Seneca Nation v. Brucker*, 262 F.2d 27).

The Atlas should therefore record **(a) the mechanism**, **(b) who acted** (Congress, the executive, a state, a court), **(c) whether the act was consensual**, and **(d) whether the United States has ever formally acknowledged it** (see B3). It should reserve the word *broken* for the plain-language headline and show the precise type next to it.

---

## 2. Core vocabulary

| Term | Who acts | What changes | Legal test or authority | Example |
|---|---|---|---|---|
| **Breach (non-performance)** | Executive or agents | A treaty promise is not performed; the treaty remains in force | Contract-like; remedy depends on a waiver of sovereign immunity (Tucker Act / Indian Tucker Act; ICC Act "fair and honorable dealings" ground) | Annuities not paid (V026, V043); settlers not removed (V002, V020) |
| **Abrogation** | Congress | A treaty (or provision) is ended or overridden by a later act | Plenary power: *Lone Wolf v. Hitchcock*, 187 U.S. 553 (1903) `[verified]`; clear-statement rule in *Menominee Tribe v. United States*, 391 U.S. 404 (1968) and *Minnesota v. Mille Lacs*, 526 U.S. 172 (1999) `[verified]` | 1863 Dakota Act (V026); 1877 Black Hills Act (V024) |
| **Taking** | Congress or its licensees | Property (land or an interest) is acquired against the owner's will | Fifth Amendment just compensation applies to *recognized* Indian title: *Sioux Nation* (1980) `[verified]`; unrecognized title is not compensable: *Tee-Hit-Ton Indians v. United States*, 348 U.S. 272 (1955) `[verified]` | Black Hills (V024); Kinzua (V017); Garrison/Oahe (V028, V029) |
| **Cession** | Tribe and U.S. by treaty or agreement | Land passes to the U.S. | Valid only if properly authorized and consented; may be challenged for fraud, duress, unconscionable consideration or mistake (ICC Act ground) `[verified]` | Ceded lands in the 1851 Dakota treaties (V026) |
| **Diminishment** | Congress | A reservation's *boundaries* are reduced; the reservation continues | *Solem v. Bartlett*, 465 U.S. 463 (1984): only Congress can diminish; look first to statutory text, then circumstances of passage, then subsequent events `[verified]` | Uintah (Hagen v. Utah, 1994, V039); Rosebud (V031) |
| **Disestablishment** | Congress | The reservation *ceases to exist* | Same test; requires clear intent such as explicit cession or total surrender; *McGirt v. Oklahoma* (2020) `[verified]` | Lake Traverse (*DeCoteau*, 1975, V032) |
| **Termination** | Congress | Federal trust relationship and recognition are ended for a tribe | HCR 108 (1953) and tribe-specific termination acts `[verified]`; *not* the same as abrogating a treaty or dissolving the tribe | Menominee (V016), Klamath (V056), Western Oregon (V055) |
| **Extinguishment of title** | Congress (or the courts by finding) | Aboriginal (Indian) title is ended | Congress alone may extinguish; treated as non-compensable unless title was recognized (*Tee-Hit-Ton*) `[verified]`; ANCSA sec. 4 `[verified]` | ANCSA (V060); Western Shoshone ICC payment (V035) |
| **Unratified treaty** | Senate (declines to act or rejects) | The text never became law | Treaties require Senate advice and consent (Const. art. II) `[from-memory]`; treaty-making with tribes ended by the Act of Mar. 3, 1871 (25 U.S.C. 71) `[verified]` | California's 18 treaties (V054) |
| **Agreement (post-1871)** | Both houses of Congress | A negotiated instrument ratified by statute rather than by treaty | 25 U.S.C. 71 savings clause for earlier treaties `[verified]`; agreements are statutes and so can be amended by later statutes (see *Lone Wolf*) | 1876 Black Hills agreement ratified by the 1877 Act (V024); 1889 Sioux Act (V025) |
| **Executive-order reservation** | President | Land set aside by order, not treaty | Revocable in principle by the executive or Congress; weaker legal footing than a treaty reservation `[from-memory]` | Siletz Coast Reservation (V055); Chiricahua (V042); Fort Reno (V023) |
| **Nonintercourse violation** | State or private party | A conveyance of Indian land without federal approval | 25 U.S.C. 177 voids such conveyances `[verified]`; remedy recognized in *County of Oneida v. Oneida Indian Nation*, 470 U.S. 226 (1985) `[verified]`, limited by *City of Sherrill*, 544 U.S. 197 (2005) `[verified]` | Oneida (V018), Catawba (V057), Maine (V058) |

**Rule of thumb for labels on the site.**
1. Use **abrogated** only if a statute (or court) says the obligation ended.
2. Use **taken** only for recognized title or where a court/agency used that word.
3. Use **diminished** or **disestablished** only for reservation *boundaries* as decided by courts applying *Solem*.
4. Use **terminated** only for the 1950s-1960s federal termination acts.
5. Use **unratified** for treaties the Senate did not approve; do not call an unratified treaty "broken" (the government never became bound).
6. Use **broke/failed to honor** for non-performance without a statute (annuities, protection from settlers, promised schools).

---

## 3. The legal framework in seven rules

1. **Treaty power and its end.** Treaties are made by the President with two-thirds of the Senate `[from-memory]`. The Act of March 3, 1871 provided that no tribe would be recognized as an independent power with which the U.S. may contract by treaty, saving earlier treaties (16 Stat. 566, now 25 U.S.C. 71) `[verified]`. After 1871 negotiated "agreements" were ratified by both houses, and reservations were often created by executive order.
2. **Canons of construction.** Treaties are read as the Indians would have understood them and ambiguities are resolved in their favor (*Winters v. United States*, 207 U.S. 564 (1908) `[verified]`). A treaty is "not a grant of rights *to* the Indians, but a grant of rights *from* them" (the *Winans* idea: the reserved-rights canon; *United States v. Winans*, 198 U.S. 371 (1905) `[verified]`).
3. **Congressional abrogation is legal but must be clear.** *Lone Wolf* held Congress may abrogate treaty provisions and courts cannot inquire into motives `[verified]`. Later cases require a clear expression of intent (*Menominee*, *Mille Lacs*, *Herrera v. Wyoming*, 587 U.S. ___ (2019) `[verified]`).
4. **Takings.** For land held with congressionally recognized title, the Fifth Amendment requires compensation, and the *Lone Wolf* presumption of good faith does not apply when Congress is exercising eminent domain (*Sioux Nation*) `[verified]`. For aboriginal (unrecognized) title there is no constitutional compensation right (*Tee-Hit-Ton*) `[verified]`. Congress may authorize takings of treaty land if its intent is clear (*Seneca Nation v. Brucker*) `[verified]`, even by a licensee (*FPC v. Tuscarora Indian Nation*, 362 U.S. 99 (1960)) `[verified]`.
5. **Reservation boundaries.** "Indian country" includes "all land within the limits of any Indian reservation ... notwithstanding the issuance of any patent" (18 U.S.C. 1151(a)) `[verified]`. Allotment and surplus-land sales do not by themselves diminish a reservation; clear cession language does (*Solem*; *Hagen v. Utah*, 510 U.S. 399 (1994); *Rosebud Sioux Tribe v. Kneip*, 430 U.S. 584 (1977); *DeCoteau v. District County Court*, 420 U.S. 425 (1975); *Nebraska v. Parker*, 577 U.S. 481 (2016); *McGirt*) `[verified]`.
6. **Fiduciary duty and remedies.** The government owes tribes a fiduciary duty judged by strict standards (*Seminole Nation v. United States*, 316 U.S. 286 (1942)) `[verified]`. Claims against the United States require a waiver of sovereign immunity: the Tucker Act (28 U.S.C. 1491) and the Indian Tucker Act (28 U.S.C. 1505, claims accruing after Aug. 13, 1946) `[verified]`; the Indian Claims Commission Act of 1946 (60 Stat. 1049) for earlier claims `[verified]`.
7. **Reserved rights survive statehood and cession unless clearly abrogated.** Fishing, hunting, gathering and water rights have been repeatedly upheld (*Winans* 1905, *Winters* 1908, *Washington v. Fishing Vessel Ass'n*, 443 U.S. 658 (1979), *Mille Lacs* 1999, *Herrera* 2019, *Cougar Den* 2019) `[verified]`, though the Court has also limited them (*Arizona v. Navajo Nation*, 599 U.S. ___ (2023): water reserved, no affirmative duty to secure it) `[verified]`.

---

## 4. The typology (controlled vocabulary for `violation_type`)

Each entry in the catalog has one **primary** code (first in the list) and optional secondary codes separated by semicolons. Codes in the third group are **context** codes: they describe a modern conflict or non-treaty event that the Atlas may show but must not label as an adjudicated treaty breach.

### 4.1 Acts of Congress

#### `UNILATERAL_ABROGATION_STATUTE`
- **Definition.** A later act of Congress ends or overrides treaty obligations without the valid consent of the treaty party. This includes statutes that "ratify" an agreement signed by far fewer than the treaty's consent threshold.
- **Distinguish from** breach (no statute) and from consensual cession (the treaty's consent clause was met).
- **Diagnostic.** Does the statute text itself abrogate or annul, or does it merely appropriate or authorize something? Is a treaty consent clause (e.g., three-fourths of adult males) mentioned and unmet?
- **Authority.** *Lone Wolf* (1903); *Sioux Nation* (1980); the Acts of Feb. 16, 1863 (12 Stat. 652) and Feb. 28, 1877 (19 Stat. 254) `[verified]`.
- **Examples.** V024 (Black Hills; Art. 16 abrogated and the Hills taken), V026 (Dakota treaties 'annulled' and annuities 'forfeited'), V022 (Lone Wolf), V044 (Curtis Act).
- **Remedy historically.** Money only, and only if a court or Congress opened a forum (Sioux Nation).
- **Display.** Say "abrogated by the Act of [date]" and link the statute.

#### `DIMINISHMENT_DISESTABLISHMENT`
- **Definition.** Congress reduces a reservation's boundaries (diminishment) or ends it (disestablishment), usually through allotment-era "surplus land" acts that ceded or opened unallotted land.
- **Distinguish from** allotment alone (not enough), from termination (status of the tribe), and from cession by treaty. Courts treat these as questions of jurisdiction (who may prosecute, tax and regulate).
- **Diagnostic.** *Solem* framework: (1) statutory language (explicit cession and sum-certain payment point to diminishment; "sell and dispose" as agent does not), (2) circumstances of passage, (3) subsequent events and demographics `[verified]`.
- **Examples.** Diminished: Uintah (V039), Rosebud (V031). Disestablished: Lake Traverse (V032). Not diminished: Cheyenne River (V033), Omaha (V033), Muscogee (Creek) (V047). Executive/legislative reductions: V055, V025.
- **Display.** Always say "for purposes of federal criminal jurisdiction" when citing the cases; the courts decided jurisdiction, not ownership of every acre.

#### `ALLOTMENT`
- **Definition.** Conversion of communal reservation land to individual parcels, with the remainder sold or opened to non-Indians. General Allotment (Dawes) Act of Feb. 8, 1887 (24 Stat. 388) `[verified]`; Curtis Act (1898) extended to the Five Tribes `[verified, tertiary]`.
- **Effect.** Indian-held land fell from about 138 million acres (1887) to about 48 million (1934) `[verified, tertiary; disputed]`. Fractionated heirship later created about 4 million owner interests in about 10 million acres `[verified, tertiary]`.
- **Examples.** V045, V044, V022, V025.

#### `TERMINATION`
- **Definition.** Congress ends the federal trust relationship and recognition for a named tribe, withdraws federal services and often liquidates tribal property. House Concurrent Resolution 108 (Aug. 1, 1953) declared the policy and named the Flathead, Klamath, Menominee, Potawatomi (Kansas/Nebraska) and Turtle Mountain Chippewa, plus all tribes in California, Florida, New York and Texas `[verified]`. The National Archives says Congress began 60 separate termination proceedings (1953-1970) and over three million acres were relinquished `[verified]`.
- **Distinguish from** treaty abrogation: *Menominee Tribe v. United States* (1968) held treaty hunting and fishing rights survived termination because Congress did not clearly end them `[verified]`.
- **Examples.** V016, V056, V055, V057, V046.
- **Remedy.** Restoration by statute (Menominee 1973, Siletz 1977, Klamath 1986, Ponca 1990, Catawba 1993) `[verified]`.

#### `JURISDICTIONAL_EROSION`
- **Definition.** State (or federal) jurisdiction displaces tribal or exclusive federal authority, by statute or by judicial interpretation. Includes Public Law 280 (Aug. 15, 1953), which granted five states criminal and civil jurisdiction while preserving treaty hunting/fishing rights (18 U.S.C. 1162(b)) `[verified]`, and *Oklahoma v. Castro-Huerta* (2022) `[verified]`.
- **Distinguish from** abrogation: no treaty is declared ended. Mark as "contested characterization" for judicial reinterpretations.
- **Examples.** V046, V048.

#### `STATUTORY_EXTINGUISHMENT_SETTLEMENT`
- **Definition.** A statute or an award extinguishes aboriginal title or claims in return for money and/or land, typically after negotiation or claims litigation. ANCSA sec. 4 extinguishes aboriginal title and hunting/fishing rights in Alaska `[verified]`; an ICC payment is treated as final when funds enter a Treasury trust account (*United States v. Dann*, 1985) `[verified]`.
- **Distinguish from** a taking (no recognized title, so no constitutional compensation) and from a treaty (consent contested).
- **Examples.** V060, V035. Also settlement acts that end claims (Maine V058; Puyallup V051; Catawba V057).

#### `UNRECOGNIZED_TITLE`
- **Definition.** Congress or a court has not recognized the tribe's land title, so taking it is not compensable under the Fifth Amendment (*Tee-Hit-Ton*, 1955; *Northwestern Bands of Shoshone*, 1945) `[verified]`.
- **Examples.** V036, V060, V035.
- **Display.** A real legal category but not a statement that the land was not theirs. Pair it with the tribe's account.

### 4.2 Treaty-making and treaty-performance failures

#### `FRAUD_COERCION_NEGOTIATION`
- **Definition.** A cession or treaty obtained through misrepresentation, bribery, intoxication, duress, unauthorized or non-representative signatories, or terms imposed as a condition of ending war. The ICC Act (sec. 2) made "fraud, duress, unconscionable consideration, mistake" a ground for revising treaties `[verified]`.
- **Diagnostic.** Is the dispute about *who had authority*, about *what was said*, or about *compulsion*? Courts rarely set aside ratified treaties on these grounds `[from-memory]`; the Atlas should mark the type "contested authority" or "documented duress".
- **Examples.** V003 (Stanwix), V005 (St. Louis 1804), V006 (New Echota), V009 (Fort Gibson), V010 (Creek 1866 punitive cession), V011 (Yellow River), V012 (Buffalo Creek), V021 (Fort Wise), V038 (Nez Perce 1863), V039 (Ute).

#### `NON_RATIFICATION`
- **Definition.** A treaty or agreement was negotiated and promises were made, but the Senate (or Congress) never approved it, or a state or private party made a conveyance without federal approval in violation of the Nonintercourse Act (25 U.S.C. 177) `[verified]`.
- **Distinguish from** breach: the government never became bound by an unratified treaty, but tribes often acted on the promises. Mark "promised, never ratified."
- **Examples.** V054 (California, 18 treaties), V057 (Catawba), V058 (Maine), V018 (Oneida), V042 (Chiricahua informal agreement).
- **Remedy.** Nonintercourse claims (*Oneida II*, 1985) `[verified]`; settlement acts.

#### `TREATY_PROMISE_UNFULFILLED`
- **Definition.** An affirmative treaty promise (reparations, a delegate in Congress, statehood representation, schools) that the U.S. never performed.
- **Examples.** V021 (Little Arkansas reparations), V001 (Fort Pitt statehood clause: conditional), V006 (Art. 7 delegate).

#### `ANNUITY_NONPAYMENT_OR_DIVERSION` (also used in the CSV as the shorter `ANNUITY_NONPAYMENT`)
- **Definition.** Payments due under a treaty were late, withheld, misapplied or paid to corrupt intermediaries.
- **Authority.** *Seminole Nation v. United States* (1942) `[verified]`.
- **Examples.** V026 (Dakota 1862: payments about two months late; trader claims), V013 (Sandy Lake), V043, V059.

#### `FAILURE_TO_PROTECT`
- **Definition.** The U.S. promised to keep non-Indians off treaty land or protect possession, and did not.
- **Authority and difficulty.** Rarely justiciable; recorded by historians. Fort Laramie 1851 Art. 3; Hopewell 1785 ("No citizen of the United States shall settle on Indian lands") `[verified]`.
- **Examples.** V002, V004, V007, V008, V020, V027.

#### `FORCED_REMOVAL`
- **Definition.** Relocation by force or duress from guaranteed homelands, usually under the Indian Removal Act of May 28, 1830 (4 Stat. 411), which authorized exchanges of land west of the Mississippi `[verified]`.
- **Examples.** V006, V008, V009, V011, V012, V013, V026, V027, V038, V039, V040, V042.

### 4.3 Takings of land or resources

#### `EMINENT_DOMAIN_INFRASTRUCTURE`
- **Definition.** Federal dams and power projects acquired tribal land by statute or licensing, against tribal objection.
- **Authority.** *Seneca v. Brucker* (1958); *FPC v. Tuscarora* (1960); Flood Control Act of 1944 (Pick-Sloan) `[verified]`; equitable compensation acts 1992-1997 `[verified, government report]`.
- **Examples.** V017, V019, V028, V029, V059.

#### `RESOURCE_RUSH_INVASION`
- **Definition.** A gold or mineral rush brought non-Indians onto treaty land and the government did not stop it, or the government itself opened the land.
- **Examples.** V020 (Pike's Peak, 1858), V024 (Black Hills, 1874-76), V054 (California 1849-). Georgia gold (Dahlonega, 1828) in V007.

#### `RAILROAD_GRANT_OR_SALE`
- **Definition.** Treaty lands sold or granted to railroads. *No catalog entry carries this as a primary code yet.* The Delaware treaty of 1866 (V001; 14 Stat. 793) shows the pattern: the treaty arranged the sale of the Kansas reserve to a railroad company (Missouri River Railroad Company) at a minimum price, and removal to Indian Territory `[verified]`. Northern Pacific, Union Pacific and Atlantic & Pacific grants are a known gap (see B2).

#### `FEDERAL_RESERVE_CARVE_OUT`
- **Definition.** Land taken out of a reservation (or never returned) for national forest, park, refuge or military use.
- **Examples.** V050 (Blue Lake, 1906, later returned), V037 (Glacier), V023 (Fort Reno). See also Havasupai (1975 return) and National Bison Range (1908 carve-out; 2020 return) in B3.

#### `WATER_RIGHTS`
- **Definition.** Denial of or failure to quantify reserved water rights.
- **Authority.** *Winters* (1908); *Arizona v. Navajo Nation* (2023) `[verified]`.
- **Examples.** V041.

#### `HUNTING_FISHING_RIGHTS`
- **Definition.** State or federal restriction of treaty-reserved off-reservation hunting, fishing and gathering rights. Often a **counterexample type**: the rights were upheld.
- **Examples.** V014, V015, V034, V051, V052, V053.

### 4.4 Context codes (do not label as adjudicated treaty breaches)

| Code | Meaning | Examples |
|---|---|---|
| `CONTEXT_INFRASTRUCTURE_SITING` | Modern projects near or affecting treaty territory where the main legal claims were environmental (NEPA), not treaty-based | V030 (Dakota Access) |
| `CONTEXT_FEDERAL_LAND_DISPOSAL` | Congressional or agency land transfers affecting sacred or culturally important places, where courts rejected tribal claims | V049 (Oak Flat) |
| `CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK` | Reduction or revocation of a protective designation, with tribal co-management; the claim is statutory (Antiquities Act), not treaty | V062 (Bears Ears) |
| `ANNEXATION_CONTEXT` | Annexation of a sovereign state (Hawaii), distinct from tribal treaty law | V061 |

---

## 5. A short classification workflow

1. **What was the instrument?** Ratified treaty (cite Stat. and Kappler), agreement ratified by statute, unratified treaty, executive order, state treaty, or none.
2. **Who acted?** Congress (statute), the President/agents (executive order, military), a state, a court, a private party.
3. **Was consent obtained?** Check the instrument's own consent clause (e.g., the three-fourths clauses in Fort Laramie 1868 art. 12 and Medicine Lodge art. 12 `[verified]`). If consent was formally met but contested, tag `[disputed]`.
4. **What exactly changed?** Land (cession, taking, diminishment), status (termination), right (hunting, water, jurisdiction), or people (removal).
5. **Has the U.S. acknowledged it?** Court holding, compensation statute, ICC/Court of Claims award, apology, or none (B3 ledger).
6. **Assign one primary type and up to two secondary types.** Prefer the narrowest legally accurate code.

---

## 6. Suggested data-model fields (for the design wave)

| Field | Notes |
|---|---|
| `violation_id` | e.g., `V024` |
| `instrument_id` | Link to treaty record (Stat. cite, Kappler) |
| `violation_type` (primary), `violation_type_secondary[]` | Codes in section 4 |
| `actor` | `congress`, `executive`, `state`, `court`, `private` |
| `consent_status` | `none`, `claimed_met_disputed`, `met`, `n/a` |
| `legal_status_of_instrument` | `ratified_treaty`, `agreement`, `unratified`, `executive_order`, `state_treaty` |
| `acknowledgment` | Code from B3 (court-recognized, congressional remedy, ICC/CoC money, apology, none) |
| `confidence`, `source_urls[]`, `tribal_review_status` | Required |

---

## 7. Timeline (selected, with sources)

Entries marked V### link to B2. Dates are as read in the sources listed; `[from-memory]` marks unconfirmed items.

| Year | Event | Type / entry |
|---|---|---|
| 1778 | Treaty of Fort Pitt with the Delawares, the first U.S.-Indian treaty `[verified]` | V001 |
| 1784 | Fort Stanwix: Haudenosaunee delegates cede claims; the Six Nations council refuses to ratify `[verified, tertiary]` | V003 |
| 1785 | Treaty of Hopewell with the Cherokee (7 Stat. 18); settler intrusion continues `[verified, tertiary]` | V002 |
| 1790 | Nonintercourse Act (current codification 25 U.S.C. 177) bars sales of Indian land without federal approval `[verified]` | NON_RATIFICATION |
| 1794 | Treaty of Canandaigua with the Six Nations, Nov. 11 (7 Stat. 44) `[verified]` | V017 |
| 1795 | Treaty of Greenville, Aug. 3 `[verified, tertiary]` | V004 |
| 1804 | Treaty of St. Louis (Sauk and Fox) `[verified, tertiary]` | V005 |
| 1809 | Treaty of Fort Wayne `[verified, tertiary]` | V004 |
| 1823 | *Johnson v. M'Intosh*, 21 U.S. (8 Wheat.) 543: discovery doctrine; Indian title as right of occupancy `[verified]` | doctrine |
| 1830 | Indian Removal Act, May 28 (4 Stat. 411) `[verified]`; Treaty of Dancing Rabbit Creek, Sept. 27 `[verified, tertiary]` | V008 |
| 1831 | *Cherokee Nation v. Georgia*, 30 U.S. (5 Pet.) 1: 'domestic dependent nations' `[verified]` | doctrine |
| 1832 | *Worcester v. Georgia* (Mar. 3) `[verified]`; Payne's Landing (May 9) `[verified, tertiary]` | V007, V009 |
| 1835-36 | Treaty of New Echota (Dec. 29, 1835), ratified May 1836 by one vote `[verified]` | V006 |
| 1838-39 | Cherokee removal; Potawatomi Trail of Death (Sept. 1838); Treaty of Buffalo Creek (Jan. 15, 1838) `[verified, tertiary]` | V006, V011, V012 |
| 1848 | Treaty of Guadalupe Hidalgo (Feb. 2) `[verified]` | context for V050 |
| 1850 | Sandy Lake removal order and annuity relocation `[verified, tertiary]` | V013 |
| 1851 | Treaty of Fort Laramie (Sept. 17) `[verified]`; Dakota treaties at Traverse des Sioux and Mendota `[verified, tertiary]` | V020, V026 |
| 1851-52 | California treaties negotiated; Senate rejects them in closed session (1852); sealed until Jan. 18, 1905 `[verified, tertiary]` | V054 |
| 1854 | Medicine Creek (Dec. 26); La Pointe treaty (Sept. 30) `[verified]` | V051, V013 |
| 1855 | Nez Perce treaty (June 11); Stevens treaties `[verified]` | V038, V052 |
| 1858 | Pike's Peak rush impacts Cheyenne/Arapaho country `[verified, tertiary]` (1858-59); Ponca treaty (Mar. 12) `[verified]`; Leschi hanged (Feb. 19) `[verified]` | V020, V027, V051 |
| 1861 | Treaty of Fort Wise (Feb. 18) `[verified]` | V021 |
| 1862-63 | Dakota War (Aug. 18, 1862); 38 hanged at Mankato (Dec. 26); Act of Feb. 16, 1863 annuls treaties `[verified]` | V026 |
| 1863 | Nez Perce 'thief treaty' (June 9) `[verified]`; Ruby Valley (Oct. 1) `[verified, tertiary]`; Box Elder (July 30) `[verified]` | V038, V035, V036 |
| 1864 | Sand Creek (Nov. 29) `[verified, tertiary]`; Long Walk to Bosque Redondo begins `[verified, tertiary]` | V021, V040 |
| 1865-66 | Little Arkansas treaty (Oct. 14, 1865) promises Sand Creek reparations `[verified]`; Creek, Delaware (July 4, 1866) treaties `[verified]` | V021, V010, V001 |
| 1867 | Medicine Lodge (Oct. 21) `[verified]` | V022 |
| 1868 | Fort Laramie (Apr. 29-Nov. 6; ratified Feb. 16, 1869) `[verified]`; Navajo (June 1) and Ute (Mar. 2) treaties `[verified]` | V024, V040, V039 |
| 1871 | End of treaty-making with tribes, Mar. 3 (16 Stat. 566) `[verified]` | doctrine |
| 1873-74 | Brunot Agreement, San Juan cession `[verified, tertiary]`; Custer's Black Hills expedition (1874) `[verified, tertiary]` | V039, V024 |
| 1877 | Act of Feb. 28, 1877 takes the Black Hills; Ponca removal; Nez Perce War (June 14-Oct. 5) `[verified]` | V024, V027, V038 |
| 1879 | *Standing Bear v. Crook* (May 12) `[verified, tertiary]` | V027 |
| 1880-81 | Ute Act (June 15, 1880) and removal to Utah (1881) `[verified]` | V039 |
| 1886 | Chiricahua exiled as prisoners of war `[verified, tertiary]` | V042 |
| 1887 | General Allotment (Dawes) Act, Feb. 8 `[verified]` | V045 |
| 1889 | Act of Mar. 2: Great Sioux Reservation divided `[verified]` | V025 |
| 1895 | Blackfeet cession for Glacier area `[verified, tertiary]` | V037 |
| 1898 | Curtis Act `[verified, tertiary]`; Newlands Resolution annexes Hawaii (July 7) `[verified, tertiary]` | V044, V061 |
| 1903 | *Lone Wolf v. Hitchcock* (Jan. 5) `[verified]` | V022 |
| 1905 | *United States v. Winans* (May 16) `[verified]` | V053 |
| 1906 | Blue Lake taken (per Taos Pueblo) `[verified]` | V050 |
| 1908 | *Winters v. United States* (Jan. 6) `[verified]` | V041 |
| 1910 | Glacier National Park created (May 11) `[verified, tertiary]` | V037 |
| 1934 | Indian Reorganization Act ends allotment `[verified, tertiary]` | V045 |
| 1944 | Flood Control Act, Dec. 22 (Pick-Sloan) `[verified]` | V028, V029 |
| 1946 | Indian Claims Commission Act, Aug. 13 `[verified]` | B3 |
| 1949-56 | Garrison Dam: P.L. 437 (1949); gates closed 1953 `[verified, secondary]` | V028 |
| 1953 | HCR 108 (Aug. 1) and P.L. 280 (Aug. 15) `[verified]` | V046 |
| 1954 | Menominee (June 17) and Klamath (Aug. 13) termination acts; Western Oregon termination (Aug. 13) `[verified]` | V016, V056, V055 |
| 1955 | *Tee-Hit-Ton* (Feb. 7) `[verified]` | UNRECOGNIZED_TITLE |
| 1958-65 | *Seneca v. Brucker* (Nov. 25, 1958); Kinzua Dam built 1960-65 `[verified]` | V017 |
| 1960 | *FPC v. Tuscarora* (Mar. 7) `[verified]` | V019 |
| 1968 | *Menominee Tribe v. United States* (May 27) `[verified]` | V016 |
| 1969-71 | Occupation of Alcatraz (Nov. 20, 1969-June 11, 1971) `[verified, tertiary]` | B3 |
| 1970 | Blue Lake returned, Dec. 15 (84 Stat. 1437) `[verified]` | V050 |
| 1971 | ANCSA, Dec. 18 (85 Stat. 688) `[verified]` | V060 |
| 1973 | Menominee Restoration Act, Dec. 22 `[verified]` | V016 |
| 1974 | *United States v. Washington* (Boldt) `[verified, tertiary]` | V052 |
| 1975 | Grand Canyon Enlargement Act returns 188,077 acres to the Havasupai (Jan. 4) `[verified, tertiary]` | B3 |
| 1977-78 | Siletz restored (Nov. 18, 1977) `[verified, tertiary]`; ICC closes Sept. 30, 1978 `[verified]` | V055, B3 |
| 1979 | *Fishing Vessel* (July 2) `[verified]` | V052 |
| 1980 | *Sioux Nation* (June 30) `[verified]`; Maine Indian Claims Settlement Act (Oct. 10) `[verified, tertiary]` | V024, V058 |
| 1985 | *County of Oneida II* (Mar. 4); *United States v. Dann* (Feb. 20) `[verified]` | V018, V035 |
| 1986 | Klamath Restoration `[verified, tertiary]` | V056 |
| 1989 | Puyallup Tribe of Indians Settlement Act (June 21) `[verified]` | V051 |
| 1993 | Apology Resolution (Hawaii), Nov. 23 `[verified]`; Catawba settlement `[verified, tertiary]` | V061, V057 |
| 1994 | *Hagen v. Utah* (Feb. 23) `[verified]` | V039 |
| 1999 | *Minnesota v. Mille Lacs* (Mar. 24) `[verified]` | V014 |
| 2005 | *City of Sherrill* (Mar. 29) `[verified]` | V018 |
| 2007 | Sand Creek Massacre National Historic Site dedicated (Apr. 28) `[verified, tertiary]` | V021 |
| 2009 | *Hawaii v. OHA* (Mar. 31); apology to Native Peoples signed Dec. 19 (Sec. 8113, Pub. L. 111-118) `[verified]` for date/section, `[from-memory]` for text | B3 |
| 2014 | Colorado Governor's apology for Sand Creek (Dec. 3) `[verified, tertiary]` | V021 |
| 2016-17 | Dakota Access: easement decisions (July 2016-Feb. 2017) `[verified]` | V030 |
| 2019 | *Herrera v. Wyoming* (May 20); *Cougar Den* (Mar. 19) `[verified]` | V034, V053 |
| 2020 | *McGirt* (July 9) `[verified]`; National Bison Range law (Dec. 27) `[verified, F3]` | V047, B3 |
| 2021 | Bears Ears restored (Proclamation 10285, Oct. 8) `[verified]` | V062 |
| 2022 | *Castro-Huerta* (June 29) `[verified]` | V048 |
| 2023 | *Arizona v. Navajo Nation* (June 22) `[verified]` | V041 |
| 2025 | Yurok Blue Creek final phase (May 30) `[verified, tertiary]` | B3 |
| 2026 | Oak Flat transferred (Mar. 16); Bears Ears action (July 13; Proclamation 11043, `[verified, primary]`); DAPL Record of Decision (May 21); Penobscot first-phase return (Sept. 17; `[unverified]`, V2 could not match it to F3) `[verified, news]` for the others | V049, V062, V030, B3 |

---

## Sources

Primary and authoritative (consulted this session):
- Justia (U.S. Supreme Court opinions): https://supreme.justia.com/cases/federal/us/448/371/ (Sioux Nation); /187/553/ (Lone Wolf); /31/515/ (Worcester); /30/1/ (Cherokee Nation v. Georgia); /21/543/ (Johnson v. M'Intosh); /348/272/ (Tee-Hit-Ton); /207/564/ (Winters); /198/371/ (Winans); /391/404/ (Menominee); /526/172/ (Mille Lacs); /443/658/ (Fishing Vessel); /470/226/ (Oneida II); /544/197/ (Sherrill); /465/463/ (Solem); /510/399/ (Hagen); /430/584/ (Rosebud); /420/425/ (DeCoteau); /577/481/ (Parker); /591/18-9526/ (McGirt); /597/21-429/ (Castro-Huerta); /587/17-532/ (Herrera); /586/16-1498/ (Cougar Den); /599/21-1484/ (Navajo Nation); /316/286/ (Seminole Nation); /362/99/ (Tuscarora); /470/39/ (Dann); /324/335/ (Northwestern Shoshone); /556/163/ (Hawaii v. OHA)
- Seneca Nation v. Brucker: https://law.resource.org/pub/us/case/reporter/F2/262/262.F2d.27.14488.html
- Statutes at Large via GovInfo (https://www.govinfo.gov/content/pkg/STATUTE-N/pdf/STATUTE-N-PgPPP.pdf): 4 Stat. 411; 12 Stat. 652; 19 Stat. 254; 24 Stat. 388; 25 Stat. 888; 60 Stat. 1049; 67 Stat. B132; 67 Stat. 588; 68 Stat. 250; 68 Stat. 718; 84 Stat. 1437; 85 Stat. 688; 87 Stat. 770; 103 Stat. 83; 107 Stat. 1510; 7 Stat. 13; 14 Stat. 793; 7 Stat. 536; 10 Stat. 1109; 12 Stat. 957, 997, 1163; 14 Stat. 703; 15 Stat. 539, 581, 619; 21 Stat. 199; 9 Stat. 922, 977; 58 Stat. 887
- OSU Tribal Treaties Database (Kappler): https://treaties.okstate.edu/treaties/treaty-with-the-cherokee-1835-0439 ; .../treaty-of-fort-laramie-with-sioux-etc-1851-0594 ; .../treaty-with-the-six-nations-1794-0034 ; .../treaty-with-the-nisqualli-puyallup-etc-1854-0661 ; .../treaty-with-the-nez-perces-1863-0843 ; .../treaty-with-the-navaho-1868-1015 ; .../treaty-with-the-creeks-1866-0931 ; .../treaty-with-the-kiowa-and-comanche-1867-0977 ; .../treaty-with-the-sioux-brule-oglala-miniconjou-yanktonai-hunkpapa-blackfeet-cuthead-two-kettle-sans-arcs-and-santee-and-arapaho-1868-0998
- Cornell LII: https://www.law.cornell.edu/uscode/text/25/71 ; /25/177 ; /28/1491 ; /28/1505 ; /18/1151
- National Archives: https://www.archives.gov/research/native-americans/termination ; https://www.archives.gov/research/native-americans/indian-claims-commission
- NPS (NY treaties): https://www.nps.gov/articles/000/state-of-new-york-treaties-and-land-transactions-with-the-oneida-onondaga-and-cayuga.htm
- Federal Register (Proclamation 10285): https://www.federalregister.gov/documents/2021/10/15/2021-22672/bears-ears-national-monument

Secondary and tertiary (pointers; corroborate before publication):
- Wikipedia pages as listed in B2 (Treaty of New Echota, Cherokee removal, Sand Creek, Dakota War of 1862, Fort Laramie 1851/1868, Great Sioux Reservation, Dawes Act, McGirt, Castro-Huerta, Kinzua Dam, Boldt Decision, Seminole Wars, Potawatomi Trail of Death, Sandy Lake Tragedy, and others)
- NCpedia (Trail of Tears): https://www.ncpedia.org/cherokee/trailoftears ; DocsTeach: https://docsteach.org/lesson/analyzing-the-petition-against-the-treaty-of-new-echota/
- HistoryLink (Leschi; Puyallup settlement): https://www.historylink.org/file/21193 ; https://www.historylink.org/file/20157
- Senate Report 106-217: https://www.govinfo.gov/content/pkg/CRPT-106srpt217/html/CRPT-106srpt217.htm
- Taos Pueblo: https://taospueblo.com/about-taos-pueblo/blue-lake/
- Harvard EELP DAPL tracker: https://eelp.law.harvard.edu/tracker/dakota-access-pipeline/

## Confidence & Gaps

**Overall: medium-high for the legal definitions and holdings (primary sources read); medium for historical detail (secondary/tertiary).**

- **Not verified:** the constitutional text (art. II treaty clause; art. VI supremacy) and the 'last-in-time' rule (cited from memory); the exact Senate tally on New Echota; the proposition that courts rarely set aside ratified treaties for fraud (from memory); the executive-order reservation point (from memory).
- **Terminology disputes:** the number of tribes terminated (NARA: 60 proceedings; other sources cite 100+ tribes and bands); whether Canandaigua was Senate-ratified (OSU footnote suggests it may not have been).
- **Not addressed:** treaty-based claims of non-federally-recognized tribes; Canadian Treaty context; the Indian Reorganization Act and Indian Civil Rights Act as policy shifts (see C2/D2); the Native Hawaiian legal category beyond the 1993 Apology.
- **Process limits:** web search quota was exhausted partway through this research; later checks used direct page fetches. Congress.gov and some news sites were blocked.
- **Tribal consultation required before publication:** terms such as 'unrecognized title', 'extinguished' and 'ceded' reflect U.S. legal categories, not tribal understandings; present them in quotation with a tribal-voice note. Oral histories (e.g., Lakota, Haudenosaunee, Dakota) may differ from the documentary record on treaty authority and consent.
