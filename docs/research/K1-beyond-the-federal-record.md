---
title: Beyond the Federal Record - Land Status, Consent Defects and Promised Land
author: Benjamin Life (@omniharmonic)
date: 2026-10-20
status: draft
confidence: medium
---

# K1. Beyond the Federal Record

*Research-assistant draft for Living Law, Living Land (landback.land). No tribal government, tribal historic preservation office or lawyer has reviewed this file. Companion data: `K1/data/beyond-federal-record-findings.csv` (682 rows) and `K1/data/royce-status-proposals.csv` (100 rows). Per-chapter notes on the PSL TREC report, the national research notes and the two verification reports are in `K1/notes/`. The map implementation survey is `docs/design/K1-map-implementation-survey.md`.*

---

## 1. What this pass is and why

### 1.1 The legitimacy problem of a Royce-only map

The atlas draws almost all of its land geometry from Charles Royce's 1899 *Indian Land Cessions in the United States* (the USFS polygon layer) and its legal context from Kappler, the Statutes at Large and the NARA ratified-treaty series. Those are the right sources for what the United States *recorded*. They are the wrong sources for what Native nations *agreed to*.

Royce's title assumes the answer. Every polygon is a "cession", and the map paints them all in one fill. A reader sees a continent that passed, acre by acre, through lawful and consensual treaties. The record itself says otherwise:

- Royce records about 330 million polygon-acres that the United States "took possession of" with no instrument at all (Royce pp. 824, 828, 856, 922, as quoted in `crosswalks/royce-entry-roles.csv`).
- California is mapped through 18 treaties the Senate rejected.
- The Black Hills, shown as "ceded", were held by the Supreme Court to have been taken (*United States v. Sioux Nation*, 448 U.S. 371 (1980)).
- Treaty texts themselves required hostages (Fort Stanwix 1784, Art. I; Greenville 1795, Art. II).

A map that shows only the federal record therefore risks legitimizing dispossession. This pass asks what the record leaves out, and what changes when Native-authored and people's histories are read beside it.

### 1.2 What was read

| Source | Coverage | Finding ids |
|---|---|---|
| People of the Sacred Land, Truth, Restoration and Education Commission (TREC), *The Legal and Political History of Colorado Tribes* (2024) | All 519 PDF pages, read in 12 chapter chunks: introduction and executive summary; Kiowa, Comanche and Apache; Eastern Shoshone; Arapaho; Southern Cheyenne and Arapaho; Cheyenne (two parts); Ute (two parts); Fraud Report | PSL-INT, -KCA-A, -KCA-B, -SHO-A, -SHO-B, -ARA, -SCA, -CHY-A, -CHY-B, -UTE-A, -UTE-B, -FRD (466 rows) |
| Web pass: land never ceded | Royce polygon analysis from repo data, ICC, Nonintercourse Act cases, Alaska, Hawaii | WEB-NC (32) |
| Web pass: unratified treaties and Senate amendments | NARA T494 catalog titles, OSU, Avalon, Oregon Encyclopedia | WEB-UR (56) |
| Web pass: duress and signatory defects | Treaty texts, MNHS, Mooney, Quaker reports, case law | WEB-DUR (64) |
| Web pass: massacres | NPS, state and tribal sources, Madley | WEB-MAS (34) |
| Web pass: promised land | Repo crosswalk analysis, Kappler texts, McGirt line of cases | WEB-PRM (36) |
| Web pass: Indigenous and people's histories | Deloria, Echo-Hawk, Williams, Blackhawk, Estes, Treuer, O'Brien, Brooks, Zinn, Dunbar-Ortiz, Saunt, Madley, Ostler, Robertson, Banner, Anderson | WEB-HIS (39) |
| Verification: Plains claims | `verify-plains.md` (Fort Laramie 1851 through Fort Robinson 1879) | overrides noted |
| Verification: Ute and Shoshone claims | `verify-ute-shoshone.md` | overrides noted |
| Atlas repo (read only) | `B1-violation-typology.md`, `violations-seed.csv`, `treaties-seed.csv`, `crosswalks/royce-entry-roles.csv`, `crosswalks/royce-area-plain.csv`, `data/derived/cession-events.json`, instrument overlays | used for current values |

### 1.3 Limits

1. **No tribal review.** TREC is Native-led (PSL TREC p. 10), but this file is not. Nothing here should go live as a nation's position without that nation's review (record it in `tribal-review-ledger.csv`).
2. **No lawyer.** The classification in section 4 uses legal vocabulary carefully, but no attorney has checked it.
3. **Primary-source websites were blocked.** During this pass the sandbox could not fetch govinfo, OSU Kappler, LOC, Justia, CourtListener, archive.org or tribal sites. Much web verification rests on search-result excerpts and catalog titles. Each CSV row carries its evidence level and a `verification_status`. Treat `not_checked` as exactly that.
4. **TREC is uneven.** Its executive summary is almost entirely uncited (PSL TREC pp. 1-26). Pages 29-45 were copied from Kansapedia (PSL TREC p. 45). The Fraud Report has unedited remnants and long "Ibid." chains to one dissertation (PSL TREC pp. 467-519). TREC is strongest where it quotes treaty texts, Army records and federal reports.
5. **Verification overrides.** Where `verify-plains.md` or `verify-ute-shoshone.md` reached a verdict that differs from a book or web finding, the verify verdict wins. Each override is named in the text and in the CSV `notes`.

---

## 2. Headline findings

1. **About a quarter of the mapped Royce area has no treaty link, and about 330 million polygon-acres have no instrument at all.** By the dataset's own `legal_type`, 26.5% of polygon area is statute (224M acres), executive order (198M) or unknown (108M). In Royce's own remarks, 16 areas were simply taken. Largest: 688 eastern Apache (86M), 444 Western Shoshone (76M), 689 western Apache (56M), 432 Uintah Ute (25M). Royce p. 922: "No treaty of purchase was ever made with this tribe. The U. S. assumed title to their country" (WEB-NC-001, -002).

2. **Fort Laramie 1851 was ratified with an amendment and never proclaimed. Both the atlas and TREC get this wrong, in opposite directions.**
   - *VERIFY OVERRIDE (verify-plains s.1).* The Senate ratified on May 24, 1852, cutting the Art. 7 annuity from fifty years to ten, "subject to acceptance by the tribes" (Kappler II 594 footnote).
   - The atlas repeats Royce's "never ratified" for areas 300, 398, 399, 426, 477, 517 and 529.
   - TREC calls it "never legally ratified" (PSL TREC p. 174) and "unratified" (PSL TREC pp. 236, 337).
   - Correct framing: ratified with amendment, never proclaimed, text never printed in the Statutes at Large (11 Stat. 749 is a stub). Kappler says every nation but the Crow assented; another version says the Crow assented in 1854. Courts and the ICC treated the treaty as in force.

3. **Land north of the South Platte (Denver, Boulder, Fort Collins, Greeley) is a contested cession, not "never ceded".**
   - *VERIFY OVERRIDE (verify-plains s.3).* It was ceded on paper three times: Fort Wise 1861, Little Arkansas 1865 and the 1868 Northern treaty.
   - It is contested by the Northern Cheyenne and Northern Arapaho, and by federal officials at the time. The Commissioner of Indian Affairs' 1862 report called the cession "imperfect and indefinite as to the extent of cession" (PSL TREC p. 263; exact words unresolved). U.S. Attorney S. E. Browne opined in 1863 that settlement there had no legal basis (PSL TREC pp. 184-185, 271).
   - The atlas has no Royce area tied to the May 10, 1868 Northern treaty (15 Stat. 655).

4. **Fort Wise (1861) was signed by ten Southern chiefs after the Cheyenne Council of 44 refused.**
   - Commissioner Greenwood said he would "make this Treaty over the Heads of the Cheyenne" (PSL TREC p. 260). No Northern Arapaho were present (PSL TREC p. 182).
   - The Senate struck Art. 11, which would have sold the Denver townsite at $1.25 an acre. TREC and Unrau read that article as an admission that Indian title there was not extinguished (PSL TREC pp. 181, 264).
   - *VERIFY OVERRIDE (verify-plains s.2).* A paper assent to the amendment dated October 29, 1861 exists in NARA RIT 315. TREC's forgery reading of its marks is an untested inference (PSL TREC pp. 266-268, 477). Art. 6 is an invitation with a cutoff for benefits, not a condition on the cession. TREC's "only one signature was ever secured, and that person was drunk" is contradicted by the August 19, 1863 Upper Platte agreement. That agreement was itself signed in exchange for annuities (PSL TREC p. 482).

5. **The Sand Creek massacre took place on the 1861 reserve (Royce 477), and the reserve was "ceded" ten and a half months later by a small minority.**
   - Powell: "Only eight lodges followed them, eight lodges out of more than two hundred eighty lodges of the Southern People alone" (PSL TREC p. 211).
   - Article 6 of the Little Arkansas treaty repudiated Sand Creek and promised reparations: 320 acres to each named chief and 160 acres to each widow or orphan. NPS: "these promised reparations are never paid" (verify-plains s.5; PSL TREC p. 212).

6. **The Black Hills were taken by statute after a "sell or starve" rider.** The rider (19 Stat. 176, 192) cut off subsistence. About 10 percent of adult men signed, against the three-fourths that Art. 12 of the 1868 treaty required. The Supreme Court affirmed a taking, and the Sioux refuse the award. The crosswalk still says "ceded" for 597 and 598 (WEB-UR-055, WEB-NC-013).

7. **The Kiowa, Comanche and Apache reservation went through a consent rule the government itself admitted was not met.**
   - Medicine Lodge Art. 12 required three-fourths of adult men to sign any cession.
   - The Jerome agent certified 456 of 562. The Secretary of the Interior's 1899 report, quoted in *Lone Wolf*, says "less than three fourths of the male adults appear to have so signed."
   - Congress amended the agreement without returning it to the tribes, and *Lone Wolf v. Hitchcock*, 187 U.S. 553 (1903) upheld it (verify-plains s.6; PSL TREC pp. 64-68).

8. **Ute cessions were obtained with a captive child, a chief's salary and $2 signatures.**
   - Brunot promised to recover Ouray's captive son and never did. The agreement paid Ouray $1,000 a year, while Brunot reported "No presents were given" (PSL TREC pp. 361, 414-418; confirmed in substance).
   - In 1880 commissioner Otto Mears paid Ute men $2 each for signatures to reach three-fourths. This is confirmed by several secondary sources. The claim that he was later reimbursed is single-source (PSL TREC p. 437; verify-ute-shoshone s.5).
   - Uncompahgre Park was expressly reserved in 1873 and later taken by statute. It was never ceded (PSL TREC pp. 420, 455-456).

9. **The 1863 Fort Bridger treaty recognized Shoshone country in Colorado and ceded nothing.** Its Art. 4 records "the Shoshonee country, as defined and described by them", south to the Yampa and east to North Park. The cession is 1868 (Royce 520). The Shoshone came to the 1851 council but "were consequently not parties to the treaty" (PSL TREC p. 98). In 1878 the Army placed the Northern Arapaho on the 1868 Shoshone reservation. The Supreme Court held this a taking of a half interest and paid money, not land (299 U.S. 476; 304 U.S. 111) (verify-ute-shoshone s.7, s.10).

10. **Hostage clauses are written into the treaty texts.** Fort Stanwix 1784, Art. I: "Six hostages shall be immediately delivered to the commissioners" (7 Stat. 15). Others: Fort McIntosh 1785 (three chiefs), Fort Finney 1786 (three), Fort Harmar 1789 (two) and Greenville 1795, Art. II (ten chiefs) (WEB-DUR-001 to -006). Later the Army took hostages to put treaties into effect: Satanta and Lone Wolf in December 1868, held "with expectation that they will be hung" (Sheridan; verify-plains s.7).

11. **ICC awards paid money at 19th-century prices and returned no land.**
    - The Cheyenne-Arapaho 1851 territory (51,210,000 acres) was valued at $23.5M as of October 14, 1865, about 46 cents an acre (verify-plains s.8).
    - That valuation date is the Little Arkansas treaty, which the Northern Cheyenne never signed (PSL TREC pp. 333-334, 338).
    - In *United States v. Dann*, 470 U.S. 39 (1985), depositing a refused award in a Treasury account counted as "payment" of Western Shoshone title, under a treaty with no cession clause (WEB-NC-011).
    - TREC: "not a single acre was returned to the possession of Tribal Nations" (PSL TREC p. 9).

12. **Massacres repeatedly preceded or enforced cessions.** Bear River (Jan. 29, 1863) preceded the 1863 Shoshone treaties. Sand Creek preceded Little Arkansas. Bad Axe preceded the Black Hawk Purchase. Horseshoe Bend preceded Fort Jackson. The Washita enforced Medicine Lodge. Fort Robinson (January 1879) followed the withholding of food, fuel and water from Northern Cheyenne prisoners to force a second removal. That last account rests on Army testimony (PSL TREC pp. 308-312; verify-plains s.9).

13. **The Dakota reserve was confiscated by statute, not ceded.** The crosswalk marks Royce 440 "ceded 1863-03-03". Congress annulled the treaties and ordered the land sold by the Acts of Feb. 16 and Mar. 3, 1863 (12 Stat. 652, 819). At the time about 1,600 non-combatants were interned at Fort Snelling, where 130-300 died (WEB-MAS-017).

---

## 3. The land-status problem in numbers

Acreages here are this project's calculations from the repo's polygons (WEB-NC, WEB-PRM). They are not Royce's own acreage figures. Royce polygons overlap: they sum to about 2,002M acres against about 1,597M acres of union coverage. Any "acres ceded" total that adds polygons therefore overstates the land by about 25%.

### 3.1 Polygon area by the dataset's `legal_type`

| legal_type | Polygons | Polygon-acres | Share |
|---|---|---|---|
| treaty_or_agreement | 474 | 1,472M | 73.5% |
| statute | 76 | 224M | 11.2% |
| executive_order | 113 | 198M | 9.9% |
| unknown | 54 | 108M | 5.4% |

`legal_type` is a guess based on which links exist in the USFS data. It is not a legal finding (WEB-NC-001, -003):

- Areas 682-689 are typed `statute` and dated 1886-10-01 only because a statute URL is attached. Royce describes no statutory cession there.
- Western Shoshone 444 is typed `treaty_or_agreement` only because it links to Kappler. The Ruby Valley treaty has no cession clause.

### 3.2 Royce's own "no formal purchase" areas

Sixteen areas, about 330M polygon-acres, are recorded by Royce as taken with no treaty, purchase or relinquishment: 444, 447, 432, 458, 473, 532, 558, 562, 682-689 (WEB-NC-002). The crosswalk gives most of them role `other` and status `unclear`. Royce's words:

- 444 (p. 828): "No formal purchase of the territorial claim of these tribes or bands was made, but the U. S. took possession of the same."
- 532 (p. 856): "No treaty was ever made with these Indians for the extinguishment of their territorial rights. The U. S. simply took possession of their country."
- 432 (p. 824): "Remainder of country claimed by them taken possession of by U. S. without formal purchase."

### 3.3 California

- 35 polygons (Royce 273-310), about 88M polygon-acres, all `legal_type` unknown, come from the 18 treaties of 1851-52 that the Senate rejected and sealed until January 18, 1905 (WEB-NC-004, -005).
- The 19 reserve polygons (about 8.5M acres in repo geometry; sources give 7.4M-8.5M) carry crosswalk status `kept`. They were never reserved in law.
- Federal law treats California land as "taken by the United States March 3, 1853" (BIA 1965 release on the ICC award of about $29.1M, about 47 cents an acre) (WEB-NC-007). Mission Indian occupancy was also held forfeited for failure to file under the 1851 Land Claims Act (*Barker v. Harvey*, 1901) (WEB-NC-006).

### 3.4 Black Hills and Article 16 territory

- Royce 598 (Black Hills, about 7.2M polygon-acres) and 597 (Art. 16 unceded territory, about 21.2M) are shown as cessions.
- 598 carries `legal_type` statute and crosswalk role `ceded`.
- The Supreme Court in 1980 affirmed a taking (WEB-NC-013).

### 3.5 Gaps in coverage

- Royce covers federal-era cessions only. About 300M acres of the lower 48 (about 16%) have no polygon. That is an order of magnitude, computed on 0.1-degree cells (WEB-NC-029).
- Test boxes over New England, Maryland-Delaware-New Jersey and the Virginia Piedmont show 0% coverage.
- Texas is only partly covered, mostly by the no-instrument Apache area 688. Texas kept its public lands at annexation, so there was no federal public domain to acquire (WEB-NC-024).
- Alaska and Hawaii are absent.
- Blank space reads as "no claim". It is actually colonial, state and Texas takings.

### 3.6 Promised land already in the repo

- 498 of 724 Royce areas carry a `reserved`, `confirmed` or `described_or_recognized` role, and 491 of them have geometry (WEB-PRM-001).
- By Royce's last date (about 1894), 259 had been ceded or taken (about 370M summed acres), 227 were "kept" (about 359M) and 12 were unclear (WEB-PRM-002).
- "Kept" freezes in 1894. Allotment and surplus-land acts then cut Native landholding from about 138M acres (1887) to about 48M (1934) (WEB-PRM-003).

### 3.7 Errors found in the repo (detail in section 11)

- "Never ratified" for Fort Laramie 1851 on seven areas.
- California reserves coded `kept`.
- 597/598, 440, 529 and 620 coded `ceded` though no cession occurred.
- 682-689 and 444 mis-typed.
- Royce 516 is labelled the Great Sioux Reservation but is only about 4.3M acres. The Art. 2 reservation rebuilds to about 27.7M from 598 + 699 + 700-705 (WEB-PRM-010).
- The repo itself says Royce 616/617 (Ute) may be reversed.

---

## 4. Proposed land-status classification

### 4.1 Design rules

1. **One primary status per polygon (or per proposed sub-area), mutually exclusive.** It records the legal mechanism the United States relies on for its present title. Where a chain of instruments exists, the primary status follows the *last* transfer the U.S. relies on. Earlier promises and defects are carried as flags and as history rows.
2. **Any number of independent defect flags.** A flag records a documented problem with how consent was obtained or how the land was handled. Flags never upgrade or downgrade the primary status. A flagged ratified cession is still, in federal law, a ratified cession; the flag tells the reader what that cession was worth as consent.
3. **Every status and flag cites an instrument or source, and an evidence level.** The evidence levels are PRIMARY_QUOTED, SCHOLARLY_CITED, ASSERTED, ORAL_HISTORY and CONTESTED, the same as in the findings CSV. A flag supported only by an ASSERTED or single-source claim is shown as "alleged" and is never the basis of a fill color.
4. **Status words follow `B1-violation-typology.md` section 2 rules.** "Taken" is used only where a statute, executive order or court supports it. "Unratified" is never "broken". "Ceded" always means "recorded as ceded in the federal record".
5. **The default legend line:** "Royce shows what the United States recorded as acquired, not what nations agreed to."

### 4.2 Primary statuses

| Code | Definition | Evidence standard to apply it | Examples (Royce) |
|---|---|---|---|
| `ceded_by_ratified_treaty` | A treaty ratified by the Senate (with any amendments assented to on paper) contains a cession or relinquishment clause covering this area. | Stat. or Kappler cite of the cession article, and a Royce schedule entry or equivalent. If the Senate amended the treaty, record of tribal assent to the amendment (else use flag `senate_amended_no_consent`). | 75 Fort Jackson; 203 New Echota; 426 and 477 Fort Wise / Little Arkansas; 510, 511 Medicine Lodge; 515 Ute 1868; 519 Navajo; 520 Fort Bridger 1868 |
| `ceded_by_agreement_or_statute_with_consent_process` | A post-1871 agreement, or an agreement given effect by an Act of Congress, where the instrument or statute set a consent process and the federal record states it was met. | Statute cite plus the instrument's own consent clause and the official count. If the official count is disputed, add `consent_threshold_not_met` (alleged or documented). | 566 Brunot 1873/74; 539 Lander 1872/74; 616 Ute 1880; 525 Cheyenne-Arapaho 1891 |
| `taken_by_statute` | Congress took the land or ordered it sold without a valid cession: annulment, forfeiture, "restored to public domain" by act, or an act that ratified an agreement so short of consent that a court or the ICC treated it as a taking. | Statute cite; for the last case, a court or ICC holding or a documented failure of the instrument's own consent clause. | 440 Dakota 1863; 439 Ho-Chunk 1863; 597, 598 Black Hills 1877; 699 Sioux 1889; 566-UP Uncompahgre Park 1884 |
| `taken_by_executive_order` | A presidential order created and then revoked a reserve, restored land to the public domain, or declared land "considered as ceded", without a tribal instrument. | EO date and Kappler I cite or Royce entry. | 529, 620 Fort Berthold; 541 Camp Grant; 557 Judith Basin; 563 Jicarilla; 586 Ute 1875 addition; 609 San Juan |
| `taken_no_instrument` | No treaty, agreement, statute or order transferred the land. The U.S. "took possession", "assumed title", or a court or ICC found title lost by encroachment. | Royce remark or ICC finding stating no purchase or relinquishment. | 432, 458, 473, 532, 558, 562, 682-689 |
| `unratified_treaty_area` | Royce maps a cession or reserve from a treaty the Senate never ratified. The secondary note says how the land was actually taken (usually `taken_no_instrument` plus an ICC taking date). | NARA T494 listing, Senate journal or Royce remark that the treaty was not ratified. | 273-310 California; 397 Oregon coast |
| `promised_reserved` | Land set apart for the nation by treaty, agreement, statute or order and still reserved at the data's end date (Royce: about 1894). Later losses (allotment, surplus acts, diminishment) go in post-1894 overlays. | The reserving instrument. | 478 Kiowa-Comanche-Apache; 540 Wind River; 617 Southern Ute strip; 540a Wichita (unratified agreement) |
| `recognized_not_ceded` | A ratified instrument recognized the nation's territory and contains no cession, and no later instrument ceded it. U.S. possession rests on encroachment, an ICC finding, or nothing. | Treaty article recognizing territory, plus absence of any cession entry. | 444 Western Shoshone (Ruby Valley); 447 Goshute; 300, 398 (1851 recognition fragments) |
| `contested` | A recorded cession instrument exists, but its reach over this specific area is doubted *within the federal record itself* (by federal officials, courts or the ICC), not only by the nation. Use sparingly. | At least one federal-voice source questioning the reach of the instrument, plus the nation's documented position. | 426-N, the proposed split of 426 north and west of the South Platte |

Two notes on the precedence rule:

- A reserve later ceded (477) takes the status of the cession (`ceded_by_ratified_treaty`), with `promise_broken` and the reserve kept as a history row in the "promised" layer.
- A reserve later taken by statute after 1894 (617) is `promised_reserved` in the Royce snapshot, with a dated post-1894 overlay (`taken_by_statute`, Hunter Act 1895).

### 4.3 Defect flags

| Flag | Definition | Evidence standard | Examples (Royce) |
|---|---|---|---|
| `duress_military` | Signing took place under armed force, a recent or threatened attack, troops at the council, or a standing order to make war if talks failed. | Treaty text, official report or two independent scholarly sources placing force at or just before the signing. Context alone ("after a war") is not enough. | 75; 11; 510 (Peace Commission act providing 4,000 volunteers, PSL TREC p. 214) |
| `duress_starvation` | Food, annuities or rations were withheld or conditioned on signing, or signers were starving because of U.S. action. | Statute (e.g., 19 Stat. 176), agent report, or treaty clause, or two scholarly sources. Oral history alone is shown as "alleged". | 289 (goods withheld 1852); 597, 598 (rider); 519 (Bosque Redondo); 525 (rations halved) |
| `hostages` | People were held by the U.S. as leverage, by treaty clause or by military action tied to signing or settlement. | Treaty clause, or an official's own account (Custer, Sheridan). | 1, 2, 11 (treaty clauses); 478 (Satanta and Lone Wolf, 1868) |
| `signatory_defect` | Signers lacked authority under the nation's own law, were a minority faction, were picked by U.S. agents, or signed without competent interpretation. | Nation's governance rule (e.g., Council of 44) plus evidence of the signers' status; or a federal admission. | 203; 426; 441; 477 |
| `excluded_party` | A nation or band with rights to the land was absent, uninvited or ruled out, yet its land was described or ceded. | Treaty preamble or signature list, plus evidence of the excluded party's use of the land. | 426 (Northern bands); 398 (Blackfeet 1851); 515 (bands other than Tabeguache in 1863) |
| `intertribal_dispute` | Two instruments assigned the same land to different nations, or a nation ceded land others held. | The two instruments' boundary texts. | 517 (Crow 1851 vs Shoshone 1863 at Wind River); 566 (southern bands) |
| `bribery_fraud` | Payments, salaries, gifts, liquor, side papers or forged or duplicated marks used to obtain signatures; or misrepresentation of the text. | The payment written into the instrument, an official investigation, or two scholarly sources. Forgery claims stay "alleged" unless a court or document examination found them. | 39, 40 (Buffalo Creek); 289 (Traders' Paper); 566 (Ouray salary); 616 (Mears $2) |
| `senate_amended_no_consent` | The Senate (or Congress, for agreements) changed the text and no tribal assent to the change is recorded. | The amendment plus absence of an assent document. Not applied where an assent paper exists, even if its validity is disputed: the dispute goes in `bribery_fraud` (alleged). | 517 (Crow assent to 1852 amendment unresolved); 478 (1900 Act, Jerome agreement changed without resubmission) |
| `consent_threshold_not_met` | The instrument's own consent rule (three-fourths, majority, assent in council) was not met, or the official count is credibly disputed. | The rule's text plus a count from an official source or a court. | 39 (42 of 81 Seneca chiefs); 597, 598 (about 10%); 478 (Secretary's 1899 admission); 525 |
| `massacre_linked` | A massacre by U.S. forces, militia or settlers occurred on the land, or within about a year before a cession of it, or was part of enforcing the instrument. | Dated event with a source; the link is labelled "sequence" unless a source states causation. | 75; 175; 441; 477; 541; 440 (mass execution and internment) |
| `promise_broken` | A promise attached to this land was not performed: a reserve never furnished, an exclusion clause not enforced, reparations not paid, a reservation not delivered. | The promise's text plus evidence of non-performance (agency report, NPS, court). | 477; 539; 566; 616; California reserves |
| `icc_money_not_land` | The ICC or Court of Claims extinguished the claim by money, at a historical valuation date, usually without interest. | Docket number, award and valuation date. | 426, 477 (Dockets 329/348); 510, 511 (257/259-A); 444 (326-K); California (31/37) |
| `judicially_found_taking` | A court held that the U.S. took this land or interest, as a Fifth Amendment taking or as a compensable taking under a jurisdictional act. | Case cite and holding. Not applied where a court held the opposite (586: *Confederated Bands*, "tenants at will"). | 598 (*Sioux Nation*); 540 (*Shoshone Tribe*, 1937-38) |

Three supplementary flags were needed for honest coding. They are not in the original list:

| Flag | Definition | Examples |
|---|---|---|
| `trespass_before_cession` | Non-Native occupation, mining or towns existed on the land before any cession, in breach of the 1834 Trade and Intercourse Act or a treaty exclusion clause. | 426 (Denver, Boulder 1858-61); 566 (San Juans 1870-73); 539 (South Pass) |
| `rights_reserved` | The cession text or courts preserve hunting, fishing or other rights on the ceded land. | 520; 566 |
| `payment_refused` | The nation refused the money award. | 444; 598 |

### 4.4 Rendering

- Solid fill only for `ceded_by_ratified_treaty` and `ceded_by_agreement_or_statute_with_consent_process` with no flags.
- Hatching for any ceded area with one or more documented flags. Alleged-only flags appear in the panel, not as hatching.
- Outline or texture for the three `taken_*` classes, so they never read as ceded.
- A distinct fill for `unratified_treaty_area`, for `recognized_not_ceded`, and for the Royce gaps (pre-federal and state takings), instead of blank.
- An always-visible badge for `payment_refused` and for `contested`. The badge links to the nation's own statement, once reviewed.

---

## 5. Case files by instrument

Each entry gives: (a) the federal record; (b) what Native and other sources add; (c) verification status; (d) recommended map status and flags; (e) Royce areas.

### 5.1 Fort Laramie (Horse Creek), Sept. 17, 1851 (Kappler II 594; 11 Stat. 749 stub)

- **(a) Federal record.** Eight nations agreed to peace and roads and posts, and Art. 5 recognized each nation's territory. The nations did "not hereby abandon or prejudice any rights or claims they may have to other lands." The U.S. promised protection against its own citizens (Art. 3) and $50,000 a year for fifty years (Art. 7). The Senate cut the annuity to ten years plus up to five.
- **(b) What other sources add.**
  - Commissioner Mitchell told the council the U.S. did "not want your land" (PSL TREC p. 246).
  - Art. 6 forced head chiefs on nations that had none (PSL TREC pp. 173, 248).
  - The Cheyenne signers were Southern and represented four of ten bands (PSL TREC p. 252).
  - The Shoshone attended but were "not parties to the treaty" (PSL TREC p. 98). The Blackfeet were assigned a territory without attending (WEB-PRM-006).
  - Commissioner Luke Lea in 1852 called amending treaties without Indian consent "anything but a mockery of the highest and most solemn form of contract" (PSL TREC pp. 240, 250).
  - An Indian Office endorsement says the amendment "was to be submitted to the Indians, but they never got together for the purpose" (PSL TREC p. 250).
  - The Arapaho and Cheyenne treated the spoken council as the treaty (PSL TREC p. 171).
- **(c) Verification.** PARTLY: Senate amendment and the assent question; ratified with amendment and never proclaimed (verify-plains s.1). TREC's "never ratified" is CONTRADICTED. The Kappler footnote and the littlebighorn.info transcription conflict on Crow assent: UNRESOLVED. The Moore cite (32 Ct. Cl. 503 or 593) is unresolved.
- **(d) Recommendation.**
  - Keep the 1851 territories as `recognized_not_ceded` history rows.
  - Correct the wording on every area (see section 11).
  - Flag `excluded_party` on 398 and 399 (Blackfeet) and note the Shoshone exclusion in the Wind River basin.
  - Flag 517 `senate_amended_no_consent` only while the Crow assent is unresolved.
- **(e) Royce:** 300, 398, 399, 426, 477, 517, 529, 619-621, 635.

### 5.2 Fort Wise, Feb. 18, 1861 (12 Stat. 1163; RIT 315)

- **(a) Federal record.** Ten chiefs ceded all lands "owned, possessed, or claimed by them, wherever situated", except a reserve on the Arkansas. The Senate struck Art. 11 on August 6, 1861. The assent is dated October 29, 1861 and the treaty was proclaimed December 5, 1861.
- **(b) What other sources add.**
  - The Council of 44 refused to attend or give up land (PSL TREC p. 260).
  - Boone "randomly appointed six Indians" (PSL TREC p. 261). The interpreter could not speak Arapaho (PSL TREC p. 261).
  - About 3,000 hungry people waited while annuities were withheld (PSL TREC pp. 266-268).
  - Agent Boone had a ranch on usurped land, and the interpreters' families received 640-acre grants in a postscript (PSL TREC pp. 182-183).
  - The Commissioner's 1862 report admitted the cession was "imperfect and indefinite" (PSL TREC p. 263).
  - Seward to Dole, Aug. 12, 1861: "it does not [appear] from the face of the paper that the amendment referred to has been agreed to" (PSL TREC p. 339).
  - Black Kettle believed the treaty bound only the bands that signed (Roberts, via PSL TREC p. 265).
- **(c) Verification.**
  - CONFIRMED: Art. 11 struck; ten signers. The Cheyenne Left Hand signed, not the Arapaho Niwot.
  - PARTLY: assent paper exists; TREC's forgery inference is untested.
  - CONTRADICTED: TREC's claims that the treaty had to go back to the Senate, that Art. 6 suspended it, and that only one drunk signer was obtained.
  - UNRESOLVED: the exact words of the 1862 report (verify-plains s.2).
- **(d) Recommendation.**
  - 426: `ceded_by_ratified_treaty` with `signatory_defect`, `excluded_party`, `duress_starvation`, `trespass_before_cession`, `massacre_linked` (via 1865) and `icc_money_not_land`.
  - Propose sub-area 426-N (Colorado north and west of the South Platte) as `contested` (section 5.3).
  - Do not apply `senate_amended_no_consent`.
- **(e) Royce:** 426, 477.

### 5.3 The South Platte question (Denver, Boulder, Fort Collins, Greeley)

- **(a) Federal record.** Paper cessions:
  - 1861: Southern signers.
  - Oct. 14, 1865: Little Arkansas Art. 2 relinquished the country from the forks of the Platte up the North Fork to the mountains, south to the Arkansas. The treaty records that the tribes "claim to have originally owned, and never to have relinquished the title".
  - May 10, 1868: Northern Cheyenne and Northern Arapaho, 15 Stat. 655, Art. 2, relinquished "all right, claim, and interest" outside the offered reservations.
  - The ICC paid for all 51.21M acres in 1963-65.
- **(b) What other sources add.**
  - Browne's 1863 opinion and Dole's brief agreement and reversal (PSL TREC pp. 184-185, 271, 483-484).
  - Unrau: "the cession clauses of the Fort Wise agreement were of little value as a means of nullifying tribal claims to the upper South Platte basin" (PSL TREC p. 181).
  - The 1868 Northern treaty was signed by four Council of 44 chiefs and rejected by most Northern people (PSL TREC p. 290). Its reservations were never provided (PSL TREC pp. 285-286, 300-301).
  - Northern Cheyenne Rec. 2 and Northern Arapaho Rec. 1-3 assert the Front Range was "legally titled" to them and never ceded (PSL TREC pp. 199-201, 353-355).
- **(c) Verification.** VERIFY OVERRIDE (verify-plains s.3). "Never ceded" is NOT SUPPORTED as a statement of the legal record. The correct framing is "ceded on paper (Fort Wise 1861, Little Arkansas 1865, 1868 Northern treaty), contested by the Northern Cheyenne and Northern Arapaho and by 1862-63 federal officials." The Browne letter is confirmed by search only.
- **(d) Recommendation.**
  - Split 426 at the South Platte. North part: `contested`, flags `excluded_party`, `signatory_defect`, `trespass_before_cession`.
  - Label: "Ceded on paper, but contested. The Northern nations and the 2024 TREC report hold that this land was never validly ceded."
  - Add TLA-T-371 (15 Stat. 655) as an instrument linked to 426.
- **(e) Royce:** 426.

### 5.4 Denver townsite, Act of May 28, 1864 (ch. 99, 13 Stat. 94)

- **(a)** The act let the probate judge of Arapahoe County enter the townsite in trust for its occupants. *Cofield v. McClelland*, 83 U.S. (16 Wall.) 331 (1872), describes Denver as laid out "on the public domain of the United States".
- **(b)** The town companies had been squatters since 1858 (Smiley 1901, quoted at PSL TREC p. 269). The act passed months before Sand Creek and the 1865 relinquishment (PSL TREC p. 194). TREC says the curative process was "tainted" by "suspected illegal actions" (PSL TREC p. 21; uncited).
- **(c)** CONFIRMED with a date correction: TREC's "May 24, 1864" (PSL TREC p. 194) is wrong. The fraud claim is UNRESOLVED.
- **(d)** Add the 1864 act as an instrument event on 426, with the flag `trespass_before_cession`: "title by statute on land then claimed by the Cheyenne and Arapaho".

### 5.5 Little Arkansas, Oct. 14, 1865 (Cheyenne and Arapaho, 14 Stat. 703) and Oct. 18, 1865 (Kiowa and Comanche, 14 Stat. 717)

- **(a) Federal record.** Ratification advised with amendments May 22, 1866; amendments accepted Nov. 10 and 19, 1866; proclaimed Feb. 2, 1867. Art. 2 barred any reservation land inside Kansas. Art. 6 repudiated Sand Creek and promised land grants.
  - The Kiowa-Comanche treaty set apart over 39M acres "for the absolute and undisturbed use and occupation" of the tribes, "or such portion of the same as may hereafter from time to time be designated by the President" (PSL TREC pp. 51-52).
- **(b) What other sources add.**
  - Signed by chiefs behind about 8 of 280+ lodges, told it bound only their bands (PSL TREC pp. 210-211).
  - A "confederated tribes" clause was added three days after signing (PSL TREC p. 210).
  - Only Black Kettle and Little Robe signed the amended text (PSL TREC p. 212).
  - Some Comanche bands were absent, and Art. 6 bound absentees once they "participated in the beneficial provisions" (PSL TREC p. 54).
  - Kit Carson, who burned a Kiowa village in November 1864, was a commissioner (PSL TREC p. 40).
- **(c) Verification.** CONFIRMED: ratification and non-payment of reparations. PARTLY: the Senate's authorship of the Kansas proviso. VERIFY OVERRIDE: TREC's "never ratified" (PSL TREC pp. 84, 496) is wrong.
- **(d) Recommendation.** Royce 477 and the 1865 part of 426: flags `massacre_linked`, `signatory_defect`, `duress_military`, `promise_broken`. Royce 511: `promise_broken`, `excluded_party`. Draw the Art. 2 reserves as "promised 1865, never established".
- **(e) Royce:** 426, 477, 478, 510, 511.

### 5.6 Medicine Lodge, Oct. 21 and 28, 1867 (15 Stat. 581, 589, 593)

- **(a) Federal record.** Kiowa-Comanche (and Apache by adhesion) reservation between the Washita and Red rivers. Cheyenne-Arapaho reservation bounded by the Kansas line, the Cimarron and the Arkansas. Art. 11 hunting south of the Arkansas "so long as the buffalo may range thereon". Art. 12 three-fourths rule.
- **(b) What other sources add.**
  - N. G. Taylor's July 1867 report had already recommended a removal territory (ICC Docket 257 record, PSL TREC pp. 54-56).
  - The Peace Commission act provided 4,000 volunteers to force the tribes onto reservations if peace failed (PSL TREC p. 214).
  - Hancock had burned villages that spring (PSL TREC p. 213).
  - Ten Bear: "that which you now say we must live on is too small"; Satanta: "I don't want to settle there" (PSL TREC pp. 56-57).
  - Pencil insertions in Art. 2, including "with the consent of the United States" (PSL TREC pp. 58-59; timing unknown).
  - The Apache had no Apache-language interpreter (PSL TREC p. 85).
  - The Cheyenne-Arapaho reserve overlapped the Cherokee Outlet and was never occupied; the people lived on an 1869 executive-order reserve instead (PSL TREC pp. 218-219, 225).
  - Henderson's oral hunting promises between the Arkansas and South Platte were left out of the text (PSL TREC pp. 500-501).
  - Sand Creek captive children were still held during the council (PSL TREC p. 499; single personal communication).
- **(c) Verification.** CONFIRMED: Art. 12 text (verify-plains s.6). The duress narrative is not checked.
- **(d) Recommendation.**
  - 510, 511: `ceded_by_ratified_treaty`, flags `duress_military` (documented by the statute's force clause), `excluded_party`, `icc_money_not_land`.
  - Change overlays TLA-T-364, -365 and -366 from `treaty_negotiated` to `treaty_under_pressure`.
  - Digitize the 1867 Cheyenne-Arapaho reserve as "promised, never occupied".
- **(e) Royce:** 478, 510, 511, 525.

### 5.7 Jerome Agreement, Oct. 6/21, 1892; Act of June 6, 1900 (31 Stat. 672, 676-677)

- **(a)** The agreement was ratified "as herein amended" eight years after signing. The surplus land opened in 1901.
- **(b)**
  - A'piatan alleged fraud. Clark: "did not contain sufficient signatures, even with forgeries" (PSL TREC p. 67).
  - Almost every article was changed, and "The changes were never taken back to the Tribes for approval" (PSL TREC p. 66).
  - Thousands of settlers rushed onto the land during the eight years before ratification (PSL TREC p. 67).
  - ICC Docket 32: 2,033,583 acres worth $4,067,166 ($2.00 an acre) as of 1900, less $2,000,000 paid, for a net of $2,067,166 (PSL TREC pp. 71-73).
- **(c)** CONFIRMED: the counts as given, the Secretary's admission, the congressional amendment, *Lone Wolf*. PARTLY: forgery (secondary only; no court finding) (verify-plains s.6).
- **(d)** 478 stays `promised_reserved` in the Royce snapshot. Add a 1901 post-Royce overlay `taken_by_statute` with `consent_threshold_not_met`, `senate_amended_no_consent`, `bribery_fraud` (alleged) and `icc_money_not_land`. Show both counts.
- **(e) Royce:** 478 (later surplus opening, not in Royce).

### 5.8 Cheyenne-Arapaho 1890-91 (Jerome), Act of Mar. 3, 1891

- **(b)**
  - Secretary Noble to Jerome: "close with a majority if you cannot get more" (PSL TREC p. 226).
  - Jerome: "If you don't do what the President wants you to do, the law of Congress will be put in force" (PSL TREC p. 226).
  - Beef rations were halved. The agent's 464-signature threshold is not credible per Berthrong, who puts the need at about 680.
  - Attorneys holding a 10% contract received $67,000, and bribery is judged "highly likely" (Hagan) (PSL TREC pp. 225-227).
  - The tribes kept 529,692 of 4,294,415 acres (PSL TREC pp. 227-228).
- **(c)** Not checked (scholarly-cited in PSL).
- **(d)** 525: `ceded_by_agreement_or_statute_with_consent_process` with `consent_threshold_not_met`, `duress_starvation`, `bribery_fraud`, `icc_money_not_land`. Confidence medium.

### 5.9 Fort Bridger, July 2, 1863 (18 Stat. 685) and July 3, 1868 (15 Stat. 673)

- **(a) Federal record.** 1863 Art. 4 records Shoshone country "as defined and described by them". Art. 3 accepted telegraph and stage lines already built. A Senate amendment limited title to what existed under Mexican law. The treaty was ratified Mar. 7, 1864 and proclaimed June 7, 1869. In 1868 Art. 2 relinquished all other territory for the Wind River reservation "for the absolute and undisturbed use and occupation" of the Shoshone.
- **(b) What other sources add.**
  - The 1862 commission was told the treaty should "not... extinguish Indian title" (*Shoshone Indians v. U.S.*, quoted at PSL TREC p. 103).
  - Surveys, the 1861 telegraph and the stage lines crossed Shoshone land before any treaty (PSL TREC pp. 99-108).
  - Darren Parry (Northwestern Band) says the 1863 signing was forced (PSL TREC p. 107).
  - Robertson's 2023 overlay finds Royce 520 diverges from the 1859 Doty map by 40-50 miles in Colorado (PSL TREC p. 143; single source).
- **(c) Verification.** CONFIRMED: no cession in 1863; cession in 1868; Royce 520. PARTLY: boundary extent in Colorado. The Parry causal link is labelled an Indigenous account (verify-ute-shoshone s.7, s.8). Cite collision: 13 Stat. 673 is Conejos, 15 Stat. 673 is Fort Bridger 1868.
- **(d) Recommendation.** 520: `ceded_by_ratified_treaty`, flag `rights_reserved`. Draw 1863 Shoshone country as `recognized_not_ceded` history, 1863-1868. Add a boundary-uncertainty band in Colorado.
- **(e) Royce:** 520, 539, 540.

### 5.10 Lander/Brunot (Shoshone), Sept. 26, 1872; Act of Dec. 15, 1874 (18 Stat. 291)

- **(a)** The agreement ceded 700,642 acres in the south of the 1868 reservation (299 U.S. 476).
- **(b)** The preamble itself admits that "mines have been discovered, and citizens of the United States have made improvements within the limits of said reservation" (PSL TREC p. 126). ICC Docket 63 (1954) found the $27,500 paid against a value of $560,513.60 "unconscionable" (PSL TREC pp. 126-127).
- **(c)** CONFIRMED: miners present, acreage. PARTLY: Docket 63 (PSL only; arithmetic consistent).
- **(d)** 539: `ceded_by_agreement_or_statute_with_consent_process`, flags `trespass_before_cession`, `promise_broken`, `icc_money_not_land`.

### 5.11 Wind River after 1868: Arapaho placement 1878, Hot Springs 1896, McLaughlin 1904-05

- **(a)**
  - March 1878: Arapaho "under military escort" settled on the reservation. *Shoshone Tribe v. U.S.*, 299 U.S. 476 (1937) held this a taking of a half interest; 304 U.S. 111 (1938) included timber and minerals.
  - 1896 Hot Springs cession, ratified "as amended" by the Act of June 7, 1897, which gave one square mile to Wyoming.
  - 1904 McLaughlin agreement, Act of Mar. 3, 1905 (33 Stat. 1016). *Wyoming v. EPA*, 875 F.3d 505 (10th Cir. 2017) held the reservation diminished.
- **(b)**
  - TREC contradicts itself on 1878 consent: Stamm says "only with the consent of the Shoshones" (PSL TREC p. 132); Tunison says "without Shoshone approval" (PSL TREC p. 135).
  - In 1904, 202 of 247 Shoshone men but only 80 of 237 Arapaho men signed, counted as one pool (PSL TREC p. 134).
  - Lone Bear, 1905: "We think treaty ratified by Congress not agree with original treaty signed by tribe" (PSL TREC p. 134).
  - The 1905 act promised no price, only brokered sales (PSL TREC p. 141).
  - About 75% of the opened land is still in trust (Lucero, dissenting, PSL TREC p. 134).
- **(c)** CONFIRMED: 1878 taking and the cases; 10th Cir. holding (verify-ute-shoshone s.10). The 1896/1905 details are not checked.
- **(d)** 540: `promised_reserved`, flags `judicially_found_taking`, `promise_broken`. Add post-1894 overlays: 1896 `ceded_by_agreement_or_statute_with_consent_process` with `senate_amended_no_consent` (1897 amendment) and `consent_threshold_not_met` (pooled count); and 1905 as a contested diminishment showing both boundaries.

### 5.12 Abiquiu, Dec. 30, 1849 (9 Stat. 984)

- **(a)** The Utes "unconditionally submit" to U.S. jurisdiction. The treaty contains no cession.
- **(b)** Months earlier, Kaniache was jailed without evidence, told he would be executed, and escaped (PSL TREC p. 400). Omer Stewart identified the principal signer "Quixiachigiate" as Kaniache. The Southern Ute chronology names a Capote (PSL TREC pp. 360, 400).
- **(c)** CONFIRMED: no cession. PARTLY/CONTESTED: signer identity and detention (verify-ute-shoshone s.2).
- **(d)** Do not shade Ute country as ceded or as public domain by the Mexican Cession on the basis of 1849. Note the jailing as contested.

### 5.13 Conejos (Tabeguache), Oct. 7, 1863 (13 Stat. 673; TLA-T-328)

- **(a)** Made with the "chiefs and warriors of the Tabeguache band". Art. 2 relinquished all lands outside a reserve. Art. 3 let any citizen mine "in any part of the country hereby reserved". The Senate amended it so the U.S. admitted no greater title than under Mexico. Ratified Mar. 25, 1864, assented Oct. 8, 1864, proclaimed Dec. 14, 1864.
- **(b)**
  - "Only Ouray and nine other Tabeguache leaders ultimately signed the treaty" (PSL TREC p. 408). The Weeminuche walked out, the Mouache refused, and the northern bands sent no one (PSL TREC pp. 406-408).
  - About 500 Colorado soldiers under Chivington were present (PSL TREC p. 408).
  - "Even Agent Head corroborated the fact that the treaty had been altered without the Utes' consent" (PSL TREC p. 408).
- **(c)** CONFIRMED: Tabeguache-only party; Senate amendments; cession text covering other bands' country. PARTLY: signer count; troops (Chivington is listed as a witness). UNRESOLVED: the Head alteration claim (PSL only, no document).
- **(d)** The atlas has no Royce polygon for 1863. Royce dates Ute relinquishment to 1868 (515). Annotate 515: "Mouache, Capote, Weeminuche, Grand River and Yampa country was not relinquished until 1868; do not color it ceded 1863." Change overlay TLA-T-328 `how` to `treaty_under_pressure` and confidence to medium.

### 5.14 Ute treaty, Mar. 2, 1868 (15 Stat. 619)

- **(a)** Art. 2 reservation: from where the 107th meridian crosses Colorado's south line, north to a point fifteen miles north of the 40th parallel, west to the territorial line, south and east. The text adds: "no persons, except those herein authorized... shall ever be permitted to pass over, settle upon, or reside in" it. Art. 16 requires three-fourths consent. Assents to the amendment were taken band by band, Aug. 15-Sept. 25, 1868.
- **(b)**
  - Officials imposed Ouray as head chief (PSL TREC pp. 407, 410).
  - Miners entered at "an alarming pace". The territorial governor objected to their removal and "government protection of Ute treaty lands never materialized" (Rust 2017, PSL TREC p. 370).
  - Commissioner Hayt, 1879: the Utes "have a good and sufficient title to 12,000,000 acres... these treaties have been made and must be lived up to, whether convenient or otherwise" (PSL TREC p. 436).
- **(c)** CONFIRMED, with a correction: PSL p. 410's "south of the 40th parallel" is wrong (verify-ute-shoshone s.3).
- **(d)** Draw the Art. 2 rectangle as one promised polygon (566 + 616 + 617). Flag 515 `excluded_party` (1863 carry-over) and `trespass_before_cession`.

### 5.15 Brunot Agreement, Sept. 13, 1873; Act of Apr. 29, 1874 (18 Stat. 36)

- **(a)** Ceded the San Juan strip (about 3.7M acres) and kept Uncompahgre Park. Art. II: the Utes may "hunt upon said lands so long as the game lasts". Art. III: a $25,000-a-year fund. Ouray's salary.
- **(b)**
  - Commissioners in 1872 admitted the trespass breached the treaty and proposed cession as the cure. Ouray refused (PSL TREC p. 413).
  - Brunot used Ouray's captive son as leverage (PSL TREC pp. 414-418).
  - Ouray, Sept. 13, 1873: "We are perfectly willing to sell our mountainland... We do not want they should go down into our valleys" (PSL TREC p. 416).
  - The southern bands, whose land formed most of the cession, said they had been tricked (PSL TREC p. 419).
  - The $25,000 was spent at agents' discretion (PSL TREC p. 417).
- **(c)** CONFIRMED in substance: trespass, the son (captor details contested), the salary (article number unverified) and the hunting right. PARTLY: the mines-only understanding (Ute testimony, consistent with an 1881 delegation). UNRESOLVED: Docket 327 figures (verify-ute-shoshone s.4, s.6).
- **(d)**
  - 566: `ceded_by_agreement_or_statute_with_consent_process`, flags `bribery_fraud`, `trespass_before_cession`, `promise_broken`, `intertribal_dispute`, `rights_reserved`, `icc_money_not_land`. `hostages` is not applied: the son was held by others, not by the U.S.
  - New sub-area 566-UP (Uncompahgre Park, 10,240 acres): `taken_by_statute` (Act of May 14, 1884; text not seen), `promise_broken`.

### 5.16 Ute Agreement, Mar. 6, 1880; Act of June 15, 1880 (21 Stat. 199)

- **(a)** Effective on ratification by three-fourths of adult Ute men. Royce: "Sufficient signatures obtained to complete ratification" (p. 902).
- **(b)**
  - Mears paid $2 per signature (PSL TREC p. 437).
  - Ouray died before the ratification was complete.
  - The act punished the Uncompahgre, who took no part at Milk Creek, despite Art. 17 of the 1868 treaty (PSL TREC p. 435).
  - Mears falsely reported the promised Grand River land unsuitable (PSL TREC pp. 437-438).
  - In 1881, about 1,400 people were marched 350 miles under Mackenzie's 24-hour ultimatum (PSL TREC p. 439).
  - In ICC Docket 349 the U.S. argued "it had no obligation to furnish such a reservation"; the award was $300,000 (PSL TREC p. 455).
  - Colorado HB 178 (1881) proposed $25 "for each Indian or skunk scalp" (PSL TREC p. 439; outcome unknown).
- **(c)** CONFIRMED: three-fourths rule, $2 payments, 1881 removal, Docket 349. NOT SUPPORTED beyond one source: Kirkwood's reimbursement. PARTLY: Royce 616/617 assignment (verify-ute-shoshone s.5, s.6).
- **(d)** 616: `ceded_by_agreement_or_statute_with_consent_process`, flags `bribery_fraud`, `duress_military`, `promise_broken`, `icc_money_not_land`. Fix the 616/617 identity before publishing either.

### 5.17 Hunter Act, Feb. 20, 1895 (28 Stat. 677) and the Southern Ute strip

- **(b)**
  - The Mouache and Capote took allotments. The Weeminuche refused and moved west to Towaoc (PSL TREC p. 450).
  - 230,547.44 acres were disposed of as free homesteads.
  - The ICC found compensation due. The claim was barred as res judicata by *U.S. v. Southern Ute Tribe*, 402 U.S. 159 (1971), on a 1950 consent judgment the ICC had found was never meant to cover it (PSL TREC pp. 456-458).
- **(c)** CONFIRMED (402 U.S. 159; 423 F.2d 346).
- **(d)** 617: `promised_reserved` in the 1894 snapshot, `promise_broken`. Add a 1895 `taken_by_statute` overlay.

### 5.18 Executive orders of 1875 and 1882 (Ute) and *Confederated Bands*, 330 U.S. 169 (1947)

- **(b)** Surveyor Miller, under instructions, staked the 1868 north line 15-18 miles too far south. That would have cut out the White River agency (PSL TREC p. 379).
- **(c)** CONFIRMED: the Court held the Utes were "no more than tenants at the will of the Government" on the 1875 strip, so no compensation was owed.
- **(d)** 586: `taken_by_executive_order`. Do not apply `judicially_found_taking`; the Court held the reverse.

### 5.19 Agreement of 1876 and Act of Feb. 28, 1877 (19 Stat. 254)

- **(a)** Art. 1 redrew the Sioux reservation boundary along the 103rd meridian, the forks of the Cheyenne and the Cannon Ball. Everything outside was ceded, including hunting rights and the Art. 16 territory. Preceded by the Aug. 15, 1876 rider (19 Stat. 176, 192). *Sioux Nation* (1980): a taking.
- **(b)**
  - Northern Cheyenne marks were appended at Spotted Tail Agency on Sept. 28, 1877, a year after the commissioners signed (PSL TREC pp. 298-299).
  - Bear Bow's sworn 1918 statement: his father understood a gold-mining arrangement for half the gold, and "They did not give the friendly band at the agency authority" (PSL TREC pp. 328-329).
  - The agreement promised houses for chiefs who removed (Art. 6; PSL TREC pp. 297-299).
- **(c)** Not checked in the verify reports. Sources are high quality but come from search excerpts. The exact signature count wording in *Sioux Nation* needs checking.
- **(d)** 598: `taken_by_statute`, flags `judicially_found_taking`, `consent_threshold_not_met`, `duress_starvation`, `payment_refused`, `icc_money_not_land`. 597: `taken_by_statute`, flags `consent_threshold_not_met`, `duress_starvation`, `excluded_party`.

### 5.20 Fort Jackson, Aug. 9, 1814 (7 Stat. 120)

- **(a)** Royce records: "The U. S. demand an equivalent for all expenses incurred in prosecuting the war... by a cession of all the territory".
- **(b)** The treaty was made with the Creek National Council, a U.S. ally, while the Red Sticks who fought were dead or in Florida. Jackson took about 21-23M acres from both factions (WEB-DUR-016). It followed Tallushatchee (Nov. 3, 1813) and Horseshoe Bend (Mar. 27, 1814; about 800-900 killed, a figure from memory).
- **(c)** Not checked.
- **(d)** 75: flags `duress_military`, `excluded_party`, `massacre_linked`. Confidence high on duress (Royce's own wording).

### 5.21 New Echota, Dec. 29, 1835 (7 Stat. 478)

- **(a)** Ratified by one vote in May 1836.
- **(b)** Signed by a Treaty Party of about 20 men without National Council authority. Ross delivered a petition of about 15,665 names (WEB-DUR-040; figures vary, V006).
- **(d)** 203: `signatory_defect`. The removal itself is a separate event (`FORCED_REMOVAL` in the B1 typology).

### 5.22 Buffalo Creek, Jan. 15, 1838 (7 Stat. 550) and 1842 compromise (7 Stat. 586)

- **(b)**
  - The Senate required assent in council. Van Buren reported "the assent of forty-two out of eighty-one chiefs has been obtained", and the Senate ratified anyway (WEB-UR-051).
  - The Quaker Joint Committee found bribery by Ogden Land Company agents (WEB-DUR-037).
  - Tonawanda never consented and had to buy back land under the 1857 treaty (WEB-DUR-038).
- **(d)** 39, 40: `bribery_fraud`, `consent_threshold_not_met`; 40 also `excluded_party`. Areas 38 and 45 (Allegany, Cattaraugus) were restored in 1842.

### 5.23 Indian Springs, Feb. 12, 1825 (7 Stat. 237) and Washington, Jan. 24, 1826 (7 Stat. 286)

- **(b)** Indian Springs was signed by a McIntosh minority in breach of a Creek law making unauthorized cession a capital offense. It is the only ratified Indian treaty ever annulled. The replacement still ceded the Georgia land, under Georgia's threat to survey it anyway (WEB-DUR-035, -036; the Georgia detail is not re-verified).
- **(d)** 127, 131: flags `signatory_defect`, `duress_military`, confidence low. Royce has no separate 1825 polygon.

### 5.24 Traverse des Sioux and Mendota, 1851 (10 Stat. 949, 954)

- **(a)** The Senate struck Art. 3 (the reservations) of both treaties.
- **(b)**
  - Assent was obtained by withholding cash and goods (WEB-UR-050).
  - The Traders' Paper diverted about a third of the cash. MNHS: "No one read the paper aloud or translated it for the Dakota" (WEB-HIS-034).
  - In 1863 the reserve was confiscated by statute (section 2, finding 13).
- **(d)** 289: `duress_starvation`, `bribery_fraud`. 440: `taken_by_statute`, `promise_broken`, `massacre_linked`. Mark Mendota (TLA-T-259) `partial` like Traverse des Sioux.

### 5.25 Ruby Valley, Oct. 1, 1863 (18 Stat. 689)

- **(a)** The treaty grants passage, telegraph, stage, railroad and mining rights, and contains no cession.
- **(b)** The ICC found title lost by "gradual encroachment by whites" (stipulated date July 1, 1872). Congress appropriated $26M in 1979, and the Western Shoshone refused it. *Dann* (1985) held that the Treasury deposit was payment. CERD Decision 1(68) (2006) objected (WEB-NC-009 to -012).
- **(d)** 444: `recognized_not_ceded`, flags `icc_money_not_land`, `payment_refused`. Override `legal_type`.

### 5.26 California 18 treaties, 1851-52

- **(b)**
  - Rejected by the Senate in secret session (June 28, July 2 or July 8, 1852; sources disagree), under pressure from the California legislature and governor.
  - Kept secret until 1905.
  - The 1928 Jurisdictional Act compensated unfulfilled treaty benefits, expressly not a cession (WEB-NC-008).
  - The state financed about 24 militia campaigns (1850-61) and Congress reimbursed most of the cost (WEB-MAS-016; figures not reconciled).
- **(d)** All 35 areas: `unratified_treaty_area`. The 19 reserves get `promise_broken`. All get `icc_money_not_land` with taking date 1853-03-03. Area 295 (Clear Lake) also gets `massacre_linked` (Bloody Island, 1850).

### 5.27 Oregon, 1851 and 1855

- **(b)**
  - Six Willamette Valley (Champoeg) treaties, the Clackamas treaty, about ten Tansy Point treaties and the Port Orford treaty, all of 1851, were never ratified.
  - The Donation Land Claim Act (1850, 9 Stat. 496) had already handed out land, although the 1848 Organic Act protected unextinguished Indian title (WEB-NC-019, -020; WEB-UR-002 to -010).
  - Palmer's 1855 Coast Treaty was never ratified. Royce: "The treaties were not ratified, but the U. S. authorities assumed that the cession was binding" (p. 812) (WEB-NC-022).
- **(d)** 397: `unratified_treaty_area`, `promise_broken`. 458: `taken_no_instrument`. Add the 1851 instruments to the unratified layer (section 8).

### 5.28 Medicine Creek, Dec. 26, 1854 (10 Stat. 1132)

- **(b)** Leschi's and Quiemuth's X marks are contested: forged, or signed under protest. The treaty was explained in Chinook Jargon (WEB-DUR-020, -021).
- **(d)** 345: `signatory_defect` (alleged), confidence low.

### 5.29 Nez Perce, June 9, 1863 (14 Stat. 647)

- **(b)** Signed by Lawyer's faction after the non-treaty bands left. It cut the 1855 reserve by about 90%. Big Hole (Aug. 9-10, 1877) killed 60-90 people, about two-thirds of them non-combatants, during enforcement (WEB-DUR-017, WEB-MAS-026).
- **(d)** 441: `signatory_defect`, `excluded_party`, `massacre_linked`.

### 5.30 Fort Stanwix, Oct. 22, 1784 (7 Stat. 15), and the other hostage-clause treaties

- **(a)** Art. I: "Six hostages shall be immediately delivered to the commissioners by the said nations."
- **(b)** The Six Nations council refused to ratify its delegates' cession (V003). Art. III also yielded the Ohio Country claims of nations not present: Shawnee, Delaware, Wyandot and Miami (WEB-DUR-051).
- **(d)** 1, 2: `hostages`, `signatory_defect`. 11 (Greenville): `hostages`, `duress_military`. Fort McIntosh, Fort Finney and Fort Harmar have no linked Royce areas yet. Add the hostage clause to their instrument records.

---

## 6. Massacres linked to land

Death counts are ranges with their sources (see the CSV). "Link" means a dated sequence unless a source states causation. Locations are given to place-name level only (see the ethics note).

| Date | Place | Nations | Perpetrators | Linked instrument / Royce | Sources |
|---|---|---|---|---|---|
| 1637-05-26 | Mistick Fort (Mystic, CT) | Pequot | Connecticut and Massachusetts Bay forces | Treaty of Hartford 1638 (colonial); Royce gap | WEB-MAS-001 |
| 1763-12-14, -27 | Conestoga Town and Lancaster workhouse, PA | Susquehannock (Conestoga) | Paxton Boys | Conestoga Manor (proprietary); Royce gap | WEB-MAS-002 |
| 1782-03-08 | Gnadenhutten, OH | Lenape and Mohican Moravian converts | Pennsylvania militia | Fort McIntosh 1785; Greenville 1795 (Royce 11) | WEB-MAS-003 |
| 1813-11-03 | Tallushatchee, AL | Muscogee (Red Stick) | Tennessee militia (Coffee) | Fort Jackson 1814 (Royce 75) | WEB-MAS-004 |
| 1814-03-27 | Horseshoe Bend (Tohopeka), AL | Muscogee (Red Stick) | Jackson's army with allies | Fort Jackson 1814 (Royce 75) | WEB-MAS-005 |
| 1832-08-01/02 | Mouth of the Bad Axe, WI | Sauk, Meskwaki | U.S. regulars, militia, steamboat Warrior | Fort Armstrong 1832 (Royce 175, 226) | WEB-MAS-006 |
| 1846-04-05 | Sacramento River near Reading's Bar, CA | Wintu | Fremont's expedition, settlers | None ratified | WEB-MAS-007 |
| 1846-05 | Dokdokwas, Williamson River, OR | Klamath | Carson and Fremont party | Klamath treaty 1864 | WEB-MAS-008 |
| 1850-02-08/09 | Fort Utah, Provo River, UT | Timpanogos Ute | Nauvoo Legion | Utah reserves 1856-59, vacated 1864 (Royce 449-452) | WEB-MAS-009 |
| 1850-05-15 | Bo-no-po-ti (Bloody Island), Clear Lake, CA | Pomo | U.S. Army (Lyon, Davidson) | Unratified 1851 treaty O (Royce 295, 296) | WEB-MAS-010 |
| 1853 | Yontocket (Yan'-daa-k'vt), Smith River, CA | Tolowa Dee-ni' | Settlers | None ratified | WEB-MAS-011 |
| 1855-04-28 | Near Poncha Pass, CO | Ute (Mouache, Capote) | Fauntleroy's troops | Unratified Meriwether treaties Aug. 1855 | PSL-UTE-A-018 (PSL TREC p. 404) |
| 1855-09-03 | Blue Water Creek (Ash Hollow), NE | Sicangu Lakota | Harney's troops (about 70 hostages taken) | Unratified Fort Pierre terms 1856 | WEB-DUR-010 |
| 1855-10-08 | Little Butte Creek, OR | Takelma | Volunteers (Lupton) | Table Rock 1853 (Royce 312) | WEB-MAS-012 |
| 1859-60 | Round Valley and Eel River, CA | Yuki | Eel River Rangers (Jarboe), state-authorized | Nome Cult / Round Valley | WEB-MAS-014 |
| 1860-02-26 | Tuluwat, Indian Island, CA | Wiyot | Local settlers | None; land returned by Eureka 2019 | WEB-MAS-015 |
| 1862-12-26; 1862-63 | Mankato; Fort Snelling internment, MN | Dakota | U.S. military commission; Army | Acts of Feb. 16 and Mar. 3, 1863 (Royce 440, 439) | WEB-MAS-017, -018 |
| 1862-63 | Owens Valley, CA | Owens Valley Paiute | Settlers, California Volunteers | None | WEB-MAS-021 |
| 1863-01-29 | Boa Ogoi (Bear River), ID | Northwestern Shoshone | California Volunteers (Connor) | Box Elder, Fort Bridger, Ruby Valley, Tooele Valley 1863 | WEB-MAS-020; PSL TREC pp. 105-106 |
| 1863-09-03/05 | Whitestone Hill, ND | Yanktonai, Hunkpapa | Sully's troops | Sully expedition | WEB-MAS-019 |
| 1864-05 | Spotted Horse's village (place not given; verify) | Cheyenne | Maj. Downing | Fort Wise 1861 adherent | PSL-FRD-030 (PSL TREC p. 487) |
| 1864-11 | Kiowa-Comanche village (likely First Adobe Walls) | Kiowa, Comanche, Kiowa Apache | Carson's troops | Little Arkansas 1865 (Royce 511) | PSL-KCA-A-016; PSL-KCA-B-019 |
| 1864-11-29 | Sand Creek, Kiowa Co., CO | Cheyenne, Arapaho | 1st and 3rd Colorado Cavalry (Chivington) | Fort Wise reserve (Royce 477); Little Arkansas 1865 (426, 477) | WEB-MAS-022; PSL TREC pp. 193-194, 272, 279-281 |
| 1868-11-27 | Washita River, OK | Southern Cheyenne | 7th Cavalry (Custer) | Medicine Lodge 1867 enforcement | WEB-MAS-023 |
| 1869-07-11 | Summit Springs, CO | Cheyenne (Dog Soldiers) | Carr's troops | Ended Cheyenne occupation of the Platte-Arkansas country (Berthrong, PSL TREC p. 218) | PSL-SCA-021 |
| 1870-01-23 | Big Bend of the Marias, MT | Piikani (Heavy Runner's band) | 2nd Cavalry (Baker) | 1873-74 Blackfeet reductions (Royce 565; sequence only) | WEB-MAS-024 |
| 1871-04-30 | Aravaipa Creek near Camp Grant, AZ | Aravaipa, Pinal Apache | Tucson civilians with Tohono O'odham | Camp Grant reserve 1871, revoked 1872 (Royce 541) | WEB-MAS-025 |
| 1875-04 | Sappa Creek, KS | Northern Cheyenne | U.S. Army | Context for 1877 surrender | PSL-CHY-B-011 |
| 1876-11-25 | Red Fork of the Powder River, WY | Northern Cheyenne | U.S. troops (village of 173 lodges burned) | 1876-77 agreement (Royce 597) | PSL-CHY-A-054 |
| 1877-08-09/10 | Big Hole, MT | Nimiipuu non-treaty bands | 7th Infantry (Gibbon), volunteers | Nez Perce 1863 (Royce 441, 442) | WEB-MAS-026 |
| 1879-01-09/22 | Fort Robinson, NE | Northern Cheyenne | 3rd Cavalry; civilians | Forced second removal; prisoners denied food, fuel and water | PSL TREC pp. 308-312, 337; verify-plains s.9 |
| 1887-08 | Near Meeker, CO (posse and Guard attack) | Ute | Garfield County posse, Colorado National Guard | 1880 Act (Royce 616) | PSL-UTE-B-031 (PSL TREC pp. 446-447) |
| 1890-12-29 | Wounded Knee, SD | Mniconjou and Hunkpapa Lakota | 7th Cavalry | Act of Mar. 2, 1889 (Royce 699-705; sequence only) | WEB-MAS-027 |

Excluded and pending:

- Spirit Lake (1857) killed settlers, and does not belong in a Native-victim layer (WEB-MAS-028).
- A Skull Valley Goshute massacre and an "Owens Lake massacre, March 1863" could not be confirmed (WEB-MAS-029, -021).
- The 1854 smallpox account (PSL TREC p. 402) is speculative in the source itself.
- The strychnine poisonings are oral and second-hand (PSL TREC pp. 273, 281).

**Ethics note.**

- **Consent first.** Contact each descendant nation before publishing a site, and record its preference in `tribal-review-ledger.csv`. Several sites are burial or ceremonial grounds (Tuluwat, Yontocket, Boa Ogoi, Wounded Knee), and some are now owned by the nation.
- **Locations.** Generalize to about 0.1 degree unless the site is a public NPS unit or the nation asks for precision. Never publish burial or reburial locations (NAGPRA, ARPA).
- **Presentation.**
  - Use the nation's names first (Boa Ogoi, Tuluwat, Bo-no-po-ti, Tohopeka). Use Army names ("Battle of...") only as alternates.
  - Show counts as ranges, with descendant counts beside Army counts.
  - Name the perpetrators. Give context for intertribal participation (Camp Grant, Horseshoe Bend, Mystic).
  - Put a content warning on the layer, keep it off by default, and never color the map by death count.
  - Pair each site with its present: survival, memorials, land returned.
- **Category.** Mankato was a mass execution after military trials. A separate code (for example `MASS_EXECUTION`) is more accurate than MASSACRE (WEB-MAS-018).
- **Model to follow.** The University of Newcastle Colonial Frontier Massacres project sets the method: a threshold of six or more undefended people, evidence scoring and blurred locations (WEB-MAS-033).

---

## 7. Promised land

### 7.1 What the repo already holds

| Promise | Royce areas in repo | Problem |
|---|---|---|
| Fort Laramie 1851 Art. 5 territories | 300, 398, 399, 426, 517, 529 (fragments; 426 is about 47.4M polygon-acres against the ICC's 51.21M) | No single polygon per nation; Sioux, Assiniboine and Gros Ventre-Mandan-Arikara territories only partly drawn |
| Fort Wise 1861 reserve | 477 (about 3.7M acres) | Shown as a reserve later ceded; never furnished; site of Sand Creek |
| Little Arkansas 1865 KC reserve | 511 (about 43M acres in repo polygon; ICC 39.68M) | Fine; add "promised, cut 1867" |
| Little Arkansas 1865 C&A reserve | none | Must be digitized |
| Medicine Lodge 1867 KCA reservation | 478 | Coded kept; post-1894 opening missing |
| Medicine Lodge 1867 C&A reservation | none (1869 EO reserve is 525) | Must be digitized; overlaps Cherokee Outlet (489) |
| Fort Bridger 1863 Shoshone country | 520 (as the 1868 cession) | No 1863 recognized-territory layer; Colorado boundary uncertain |
| Fort Bridger 1868 Wind River | 539 + 540 (3.2M acres) | 540 status unclear; 1878 half-interest taking not shown |
| Ute 1868 Art. 2 | 566 + 616 + 617 (about 16M acres) | 616/617 identity uncertain; Uncompahgre Park not separated |
| Conejos 1863 Tabeguache reserve | none | Must be digitized |
| Fort Laramie 1868 Art. 2 Great Sioux Reservation | 516 mislabelled; rebuild from 598 + 699 + 700-705 (about 27.7M) | Identity error |
| California 1851-52 reserves | 19 polygons, about 8.5M acres | Coded kept; never reserved in law |

### 7.2 What must be digitized, with boundary text

Treaty wording below is quoted in the cited finding. Wording marked "from memory" in WEB-PRM must be checked against Kappler page images before drawing.

1. **Fort Laramie 1851, Cheyenne and Arapaho (Art. 5)** (PSL TREC pp. 171-172, quoting Kappler II):

   > "commencing at the Red Bute, or the place where the road leaves the north fork of the Platte River; thence up the north fork of the Platte River to its source; thence along the main range of the Rocky Mountains to the head-waters of the Arkansas River; thence down the Arkansas River to the crossing of the Santa Fe road; thence in a northwesterly direction to the forks of the Platte River, and thence up the Platte River to the place of beginning."

   The six other 1851 territories (Sioux, Gros Ventre-Mandan-Arikara, Assiniboine, Blackfoot, Crow) are paraphrased in `web-promised.md` section 3 from memory of Kappler. Verify before drawing.

2. **Fort Wise 1861 reserve** (PSL TREC p. 178, quoting RIT 315):

   > "Beginning at the mouth of the Sandy Fork of the Arkansas River and extending westwardly along the said river to the mouth of Purgatory River; thence along up the west bank of the Purgatory River to the northern boundary of the Territory of New Mexico; thence west along said boundary to a point where a line drawn due south from a point on the Arkansas River, five miles east of the mouth of the Huerfano River, would intersect said northern boundary of New Mexico; thence due north from that point on said boundary of the Sandy Fork to the place of the beginning."

   Postscript grants: 640 acres to Robert Bent at the Sulphur Spring, and 640 acres to Jack Smith seven miles above Bent's Old Fort (PSL TREC p. 182).

3. **Little Arkansas 1865, Kiowa and Comanche reserve (Art. 2)** (PSL TREC pp. 51-52):
   - Start at the NE corner of New Mexico; go south to its SE corner.
   - Go northeast to the Red River opposite the North Fork mouth; down the Red River to the 98th meridian.
   - North on the 98th meridian to the Cimarron; up the Cimarron to the Kansas line; west to the SW corner of Kansas; west to the start.
   - Interim right (Art. 3) "to reside upon and range at pleasure" south of the Arkansas.

4. **Little Arkansas 1865, Cheyenne and Arapaho reserve.** A district along the Arkansas and Cimarron, partly in Kansas until the Senate proviso (overlay TLA-T-341). PSL gives no metes and bounds. Take them from Kappler II 887.

5. **Medicine Lodge 1867 KCA reservation (Art. 2)** (PSL TREC p. 59):
   - From where the Washita crosses the 98th meridian, up the Washita to a point 30 river-miles west of Fort Cobb.
   - Due west to the North Fork of the Red River if east of the 100th meridian; otherwise to the 100th meridian and south to the North Fork.
   - Down the North Fork to the Red River; down the Red River to the 98th meridian; north to the start.

6. **Medicine Lodge 1867 C&A reservation (Art. 2).** North line on the 37th parallel, "the said line being the southern boundary of the State of Kansas". Other sides follow the Cimarron (Red Fork of the Arkansas) and the Arkansas (overlay TLA-T-366). Never occupied.

7. **Fort Bridger 1863, Art. 4 Shoshone country** (PSL TREC p. 109):

   > "on the north, by the mountains on the north side of the valley of Shoshonee or Snake River; on the east, by the Wind River mountains, Peenahpah river, the north fork of Platte or Koo-chin-agah, and the north Park or Buffalo House; and on the south, by Yampah river and the Uintah mountains. The western boundary is left undefined".

   "Peenahpah river" needs identifying. Draw as recognized, 1863-1868, with an uncertainty band (Doty 1859 vs Stewart 1957 vs Robertson 2023). Second sketch, Lander 1859: north to Wind River waters (lat. 43 30'), east from South Pass to the North Platte headwaters, west to Bear River near Smith's Fork, south to Brown's Hole (PSL TREC p. 97).

8. **Fort Bridger 1868 Wind River reservation (Art. II)** (PSL TREC p. 116):
   - From the mouth of Owl Creek due south to the crest of the Sweetwater/Popo Agie divide.
   - Along that divide and the Wind River summit to the longitude of the North Fork of Wind River; due north to its mouth.
   - Up its channel 20 miles; straight to the headwaters of Owl Creek; down Owl Creek to the start.
   - Reductions: 1872 Lander (p. 126); 1896 Hot Springs 10 x 10 miles at the NE corner (p. 128); one square mile to Wyoming, described in the 1897 act (p. 131); 1905 north of the Wind River (p. 132).

9. **Conejos 1863, Tabeguache country (preamble) and reserve (Art. 2)** (PSL TREC pp. 363-364).
   - Claimed country runs from the 37th parallel at the eastern base of the Sierra Madre north to the 41st parallel, west to the Snowy Range, then via the Rabbit Ears, the Grand, the Gunnison and the Uncompahgre to the La Plata summit and back.
   - The reserve runs from the Uncompahgre mouth down the Gunnison to the "Bunkara", up the Roaring Fork, along the Arkansas/Gunnison divide to Sandy Creek, to the Rio Grande at 106 W, up to 107 W, south to the San Juan divide, and back. Identify the "Bunkara".

10. **Ute 1868 Art. 2 reservation.** From where the 107th meridian crosses Colorado's south line, north to 15 miles north of the 40th parallel, west to the Utah line, then south and east (verify-ute-shoshone s.3). 1875 EO addition: from the 1868 NE corner north on 107 W to the first standard parallel north, west to the Utah line, south to the 1868 NW corner, east to the start (PSL TREC pp. 395-396).

11. **Brunot 1873 reserved areas.** "The Uncompagre Park, the Gunnison and San Miguel Rivers, and the agricultural and grazing lands on the south end of the present reservation are reserved to the Indians" (Brunot report, PSL TREC p. 454). Uncompahgre Park is 10,240 acres; the 1876 EO describes a four-mile square.

12. **1880 promises never delivered.** Uncompahgre: "agricultural lands on Grand River, near the mouth of the Gunnison River, in Colorado, if a sufficient quantity" (PSL TREC p. 455). Southern Ute: "unoccupied agricultural lands on the La Plata River" (PSL TREC pp. 437-438). Draw these as labelled areas, not survey lines.

13. **Fort Laramie 1868 Art. 2 and 16.**
    - Art. 2: the east bank of the Missouri at 46 N, down to the Nebraska line, west to 104 W, north to 46 N, east to the start.
    - Art. 16: the country north of the North Platte and east of the Big Horn summits as "unceded Indian territory" (WEB-PRM-009, -011).
    - Northern Cheyenne oral promise, 1868 (Powell, PSL TREC p. 290): North Platte to the Yellowstone, Big Horns to the Missouri. Label it "oral, contested".

14. **Requested but never created.** The Northern Arapaho reserve on the Cache la Poudre, 1862-64 (PSL TREC pp. 185, 486). Map it as a labelled point near Camp Collins.

Further promises in the WEB-PRM and WEB-UR findings:

- Navajo 1868 (Royce 518).
- Greenville 1795 line, with the land beyond it to be "quietly" enjoyed.
- Mendota strip, 20 miles wide (struck by the Senate).
- Bowles Village 1836 (Republic of Texas).
- Tansy Point reserved village sites.
- Hellgate 1855, Art. 11 (Bitterroot).

---

## 8. Unratified treaties the atlas lacks

The atlas has 21 unratified treaties: the California 18, Pike 1805, Cherokee 1835-03-14 and Franklin 1830. Status key: C = confirmed by a catalog or primary-text source; S = secondary only; V = verify.

| Id | Date | Nations | Instrument | Status |
|---|---|---|---|---|
| WEB-UR-037 | 1821-08-18 | Menominee, Winnebago, New York Indians | Green Bay treaty | C |
| WEB-UR-038 | 1830-07-10 | Sauk and Fox, Sioux, Winnebago, Menominee | Prairie du Chien (may be a draft of 07-15) | C |
| WEB-UR-041 | 1831-06-30 | Sauk (British Band) | Gaines-Reynolds capitulation | S |
| WEB-UR-040 | 1832-10-03 | Chickasaw | Unratified instrument (possibly Pontotoc draft) | V |
| WEB-UR-039 | 1833-11-12 | Delaware, Pawnee, Shawnee, others | Unratified treaty | C |
| WEB-UR-044 | 1836-02-23 | Texas Cherokee and associated bands | Bowles Village (Republic of Texas) | S |
| WEB-UR-018 | 1846-11-22 | Navajo | Bear Springs (Doniphan) | S |
| WEB-UR-036 | 1849-10-09 | Dakota | Unratified treaty | C |
| WEB-UR-002 to -007 | 1851-04/05 | Santiam, Tualatin, Yamhill, Luckiamute Kalapuya; two Molala bands | Champoeg (Willamette Valley Commission) | S |
| WEB-UR-009 | 1851-08 | Clatsop, Lower Chinook and others | Tansy Point treaties (about 10) | S |
| WEB-UR-010 | 1851-09-19/20 | Coquille, Euchre Creek, Tututni | Port Orford | S |
| WEB-UR-008 | 1851-11-06 | Clackamas | Dart treaty | S |
| WEB-UR-021 | 1853-04-07 | Mimbres/Gila Apache | Lane provisional compact | V |
| WEB-UR-035 | 1853-08-06 | Winnebago | Unratified treaty | C |
| WEB-NC-022, WEB-UR-011 | 1855-08-11 | Alsea, Siuslaw, Coos, Lower Umpqua, Tillamook (list unverified) | Oregon Coast Treaty (Palmer) | S (Royce 397 calls it unratified) |
| WEB-UR-012 to -017 | 1855-06 to 09 | Mescalero, Mimbres/Gila Apache, Navajo (Laguna Negra), Capote Ute, Moache Ute, Jicarilla | Six Meriwether treaties, sent to the Senate 1856-01-21 | C/S; the Ute pair also PSL TREC p. 405 |
| WEB-DUR-010 | 1856-03 | Lakota bands | Harney council at Fort Pierre | S |
| WEB-UR-034 | 1856-12-16 (and 1858) | Christian (Moravian) Indians | Unratified treaties | C |
| WEB-UR-019 | 1858-12-25 | Navajo | Bonneville treaty | C |
| WEB-UR-020 | 1861-02-15 | Navajo | Canby treaty | C |
| WEB-UR-045 | 1861-07 to 10 | Five Tribes and others | Confederate (Pike) treaties (non-U.S.) | S |
| WEB-UR-022 | 1863-04-06 | Kiowa, Comanche, Apache | Washington treaty | C |
| WEB-UR-043 | 1863-10-14 | Mixed Shoshone and Bannock | Soda Springs (amended; no assent; never proclaimed) | S/V |
| PSL-UTE-A-035 | 1865-06 | Ute (Utah) | Spanish Fork treaty (enforced anyway) | S (PSL TREC p. 369) |
| WEB-UR-033 | 1865-09-13 | Cherokee, Creek, Choctaw, Chickasaw, Osage, Seminole and others | Fort Smith Council | C |
| WEB-UR-025 | 1866-06-27 | Cheyenne, Brule and Oglala Lakota | Fort Laramie council treaty | C |
| WEB-UR-024 | 1866-07-16 | Crow | Unratified treaty | C |
| WEB-UR-023 | 1866-07-27 | Arikara, Hidatsa, Mandan | Fort Berthold agreement (Congress paid under it anyway) | C (Kappler) |
| WEB-UR-026 | 1866 | Uinta and Yampa Ute | Unratified agreement | C |
| WEB-UR-027 | 1867-08-26 | Bannock | Ballard treaty | C |
| WEB-UR-042 | 1868-05-27 | Great and Little Osage | Sturges / Drum Creek (8M acres to a railroad) | S |
| WEB-UR-030 | 1868-06-01 | Christian Munsee; Swan Creek and Black River Chippewa | Unratified treaty | C |
| WEB-UR-028 | 1868-07 to 09 | Gros Ventre, Blackfeet, Shoshone, Bannock | Montana treaties | C |
| WEB-UR-029 | 1868-12-10 | Shoshone | Unratified treaty | C |
| WEB-UR-032 | 1869-02-11 | Iowa; Sauk and Fox of Missouri | Unratified treaty | C |
| WEB-UR-031 | 1869-02-13 | Oto and Missouria | Unratified treaty | C |
| WEB-NC-032 | 1872-10-19 | Wichita and affiliated bands | Wichita agreement (Royce 540a) | S |
| WEB-NC-032 | 1873 | Crow | Judith Basin agreement (Royce 557) | S |
| WEB-NC-032 | 1873 | Jicarilla Apache | San Juan agreement (Royce 563) | S |
| WEB-NC-032 | 1878 | Southern Ute bands | San Juan River agreement (Royce 609) | S |
| WEB-DUR-032 | 1882-10-17 | Great Sioux bands | Edmunds Commission agreement | S |

The atlas also needs status corrections on existing instruments: Pike 1805 (possibly Senate-consented 1808, never proclaimed: WEB-UR-047, low) and the Franklin 1830 date (see section 11).

---

## 9. Indigenous and people's histories

### 9.1 What they add

- **Who could consent.**
  - Cheyenne national decisions belonged to the Council of 44, "the standard against which" federal signatures must be judged (PSL TREC pp. 241-244).
  - "The Arapaho system of governance did not have a 'head chief'" (PSL TREC p. 173).
  - "No single chief held absolute power or made decisions for the entire tribe" (Ute, PSL TREC p. 407).
  - The federal record's "duly authorized" is a claim, not a fact.
- **What was agreed.** "To Arapahos and Cheyennes, speeches of the council after a smoke were viewed as the actual 'treaty'" (Fowler, PSL TREC p. 171). Oral terms left out of the text include Henderson's 1867 hunting promises (PSL TREC pp. 500-501) and the 1868 northern territory told to Little Wolf (PSL TREC p. 290).
- **When the taking happened.** Towns, mines, telegraphs and surveys preceded cession (PSL TREC pp. 99-108, 175, 259, 405). The legal cession date often ratified a taking that had already occurred.
- **The emptiness was produced.** Blackhawk: the Great Basin's "terrible stillness" was the product of three centuries of violence and slave raiding (WEB-HIS-010). O'Brien: blank New England repeats the "last of the Indians" story used to defeat land claims (WEB-HIS-019).
- **The story does not end in 1894.** Treuer and Estes treat allotment, the Pick-Sloan dams (about 356,254 acres flooded) and termination as continuations (WEB-HIS-009, -021).
- **The legal foundations are weaker than they look.** Robertson shows *Johnson v. M'Intosh* was an arranged suit with no Native party (WEB-HIS-017). Echo-Hawk adds *Conners v. U.S.* (1898) and *U.S. v. Sandoval* (1913) to the cases the atlas should carry (WEB-HIS-013). Deloria: the 1871 end of treaty-making was unilateral (WEB-HIS-006).
- **Authorship matters.** Dunbar-Ortiz is not a citizen of any Native nation and should not be presented as an Indigenous voice (WEB-HIS-005). Anderson rejects the genocide label for Minnesota. Treat that as contested (WEB-HIS-026).

### 9.2 Extinguishment by payment: the ICC critique

The ICC Act (60 Stat. 1049) paid money only. Value was fixed at the date of taking, usually with no interest, and reduced by "gratuitous offsets". Under Sec. 22, payment is "full discharge" (WEB-HIS-035; PSL TREC pp. 73, 91-92). The records read here show how that worked in practice:

- The Cheyenne-Arapaho valuation date was stipulated as October 14, 1865. That date came when "mining was in a slump and railroads had not yet crossed the land" (PSL TREC pp. 333-334).
- The government expert valued grazing land at $0.02 an acre, against a $1.25 federal sale price; the tribal appraiser found $1.81 net from 8,645 Colorado transfers (PSL TREC pp. 509-510).
- "The Commission's records do not document how a value of only 45 cents per acre was arrived at" (PSL TREC p. 229).
- Offsets were taken from four treaties, so the government "bought" the tract four times (PSL TREC p. 334).
- The 1963 Northern Cheyenne compromise also released claims for wrongful attacks and wrongful removal (PSL TREC pp. 339-340).
- In 1946 Secretary Krug said Indian claims were "in nearly all cases grossly exaggerated" (PSL TREC p. 332).
- *Dann*: a refused award deposited in the Treasury counts as payment (WEB-NC-011).
- Luebben: the ICC "could never return land" and may have foreclosed quiet-title actions (PSL TREC pp. 454-455).
- *Sioux Nation* is the exception that proves the rule. Interest was paid only because the taking was unconstitutional, and the money is refused (WEB-HIS-036).

Map consequence: an ICC award is never shown as a cession, as consent, or as "compensated". It is shown as "title declared extinguished by money award (docket, valuation date, interest, offsets); land not returned; accepted or refused".

### 9.3 Vocabulary changes

| Before (federal term) | After (atlas term) | Reason |
|---|---|---|
| ceded / cession (default fill) | "recorded as ceded" or "transferred by treaty (called a 'cession' in U.S. records)"; otherwise name the means: taken by statute, taken by executive order, taken with no instrument, unratified, title declared extinguished by ICC payment | Royce's title assumes consent (WEB-HIS-038); section 4 |
| never ceded / unceded (bare) | "no cession instrument on record" or "ceded on paper, contested by [nation]", attributed | VERIFY OVERRIDE (verify-plains s.3); unrecognized title is also the weakest in U.S. law (*Tee-Hit-Ton*) |
| never ratified (Fort Laramie 1851) | "ratified with amendment, 1852; never proclaimed" | verify-plains s.1 |
| Indian title of occupancy | "Native title (U.S. courts call it 'occupancy')" | Doctrine of Discovery origin (Williams) |
| extinguished | "declared extinguished by [court / ICC / Act]" | *Dann* shows it can be declared over refusal |
| compensated / paid for (ICC) | "money award at [year] value, [no] interest, [offsets], land not returned; [accepted / refused]" | ICC practice; PSL TREC p. 9 |
| head chief | "chief designated by U.S. commissioners as head chief" | PSL TREC pp. 173, 248, 407 |
| duly authorized (signers) | "signed by [names, bands]; authority [documented / contested]" | Council of 44; PSL TREC p. 260 |
| confederated tribes (Cheyenne and Arapaho) | "Cheyenne and Arapaho" (two nations) | PSL TREC pp. 210, 261 |
| surplus lands | "lands opened to non-Native settlement (called 'surplus' in the Act)" | WEB-HIS-038 |
| removal / emigration | "forced removal" | Saunt, Ostler |
| depredations | "property-loss claims (called 'depredations')" | Echo-Hawk on *Conners* |
| uprising / outbreak (1862) | "U.S.-Dakota War of 1862" | MNHS usage |
| battle (Sand Creek, Bear River, Washita, Wounded Knee) | "massacre", with the Army name as an alternate | Joint Committee 1865: "foul and dastardly massacre" |
| Meeker Massacre | "Milk Creek fight and White River agency killings, 1879" | PSL TREC pp. 428-430: troops crossed onto the reservation first |
| Creek War of 1836 | "1836 Creek resistance to land fraud" | Haveman, Saunt |
| "ceded lands" (Hawaii) | "Crown and Government lands of the Hawaiian Kingdom (called 'ceded lands' in state law)" | 1993 Apology Resolution |
| end of the treaty era (1871) | "Congress stopped making treaties by statute (1871); nations did not agree" | Deloria |
| last of the [nation] | do not use; name the present-day nation | O'Brien |

---

## 10. PSL TREC recommendations to Colorado (summarized, as TREC's)

These are TREC's and each nation's recommendations, summarized faithfully. They are not the atlas's positions. Several rest on contested legal theories, such as retained mineral and water rights and Colorado title defects; TREC itself flags some as theories.

**Executive summary, all ten nations (PSL TREC pp. 23-26).**

- *Restoration*:
  - Rescind the 1871 rider and restore treaty-making.
  - Legislate a right for removed nations to reoccupy homelands in Colorado.
  - Return unused railroad land unless compensation is proven.
  - Resolve the Fort Wise Art. 6 transfer by restoring land to the Northern Cheyenne or Northern Arapaho.
  - CSU to return its remaining 19,000 acres of Morrill grant land.
  - Restore treaty hunting and fishing rights.
  - Recognize tribal citizenship regardless of location.
- *Reparations*:
  - Compensation for invasion in violation of the 1834 Act.
  - Restitution to Sand Creek descendants.
  - An inquiry into the children abducted and enslaved by Indian Agent Lafayette Head.
  - Compensation for the buffalo, for lives and property lost, and for minerals not specifically released.
  - Free tuition at Morrill institutions.
  - State compensation for the Evans proclamations, and for Denver's occupation without title.
  - A real-estate transaction fee, "not a tax".
  - A CSU Morrill commission and a veterinary program.
  - School Fund and Land Board identification of illegally taken land.
- *Reconciliation*:
  - Calculate water rights taken.
  - Correct the ICC.
  - Protect about 200 sacred sites.
  - Audit the Public School Fund and State Land Board.
  - Teach accurate history and train teachers in it.
  - Orient legislators.
  - Build an American Indian Cultural History Center and a restorative justice center with NARF.
  - Widen the boarding school inquiry.

**Kiowa, Comanche and Apache (PSL TREC pp. 89-90).** Eleven recommendations to Colorado:

- Compensation for trespass, for water rights, and for the state's role in removal.
- Unrestricted cultural use, hunting, fishing and gathering on public lands.
- Payment for railway land and return of abandoned rail lands.
- GOCO access and sacred-site protection.
- No property tax for enrolled members living in Colorado.
- Support for reopening the ICC settlement on appeal.
- Tuition waivers; a real-estate fee fund; buffalo restoration.

**Eastern Shoshone (PSL TREC pp. 148, 161-163).**

- Place Vermillion Canyon and Browns Park in Eastern Shoshone trust, with co-management under EO 13007 and SO 3403.
- Compensate trespass, 1834-1868.
- Acknowledge illegal mapping, 1824-1863, and return abandoned railroad land.
- Recognize hunting, fishing, water and surface and subsurface mineral rights in ceded Colorado land.
- Amend GOCO.
- TREC's text says "northeastern Colorado" for the Shoshone land, which is northwestern.

**Northern Arapaho (PSL TREC pp. 199-202).**

- Support reopening the ICC settlement as "biased".
- Compensation for gold taken since 1858 "on the land that they never signed a treaty and ceded", and for inherent water rights in the North Platte-South Platte watershed.
- Compensation for removal, which the tribe calls genocide.
- Restored hunting and gathering on public lands; abandoned railroad land.
- GOCO access, tax relief and tuition.

**Cheyenne and Arapaho Tribes of Oklahoma (PSL TREC pp. 233-236).**

- Reopen Dockets 329/348 (329-A, 329-B; 16 Ind. Cl. Comm. 612). Their petition to reserve appeal rights was "automatically barred" while the government could appeal.
- They allege the Fort Wise amendment document has "erasures, possible date changes, and outright misrepresentation of signatures" (unverified, section 12), bearing on Denver and about 20 towns.
- Compensation for minerals and water; recognition that railroad, School Fund (4 million acres) and CSU (19,000 acres) lands came from their territory.

**Northern Cheyenne (PSL TREC pp. 353-356).** Twelve recommendations:

- Compensation for 1834 Act trespass and for minerals taken before any cession. Endnote: the Front Range to the Divide was "legally titled" to them.
- Compensation for water rights, for removal (called genocide) and for Sand Creek deaths.
- Unrestricted cultural use of public lands; railroad land returned.
- GOCO and sacred sites; no state property tax.
- Support reopening the ICC settlement.
- Tuition; a 0.01% real-estate fee.

**Ute nations (PSL TREC pp. 463-466).** Eleven recommendations:

- Compensation for trespass and pre-cession mining.
- Federal restoration of *Winters* water rights.
- Compensation to the Uncompahgre for forced removal.
- Unrestricted hunting, fishing and gathering.
- Railroad easements compensated or restored.
- Restitution for descendants of Utes enslaved through Lafayette Head.
- GOCO access; no state property tax.
- Support reopening ICC Dockets 44, 45, 327 and 328.
- Tuition waivers.

---

## 11. Corrections to the atlas's existing data

Each row gives the record, its current value, the correct value and the source. "Verify" means the correction rests on a search excerpt or a single source and needs one look at a scan before publishing.

| # | Record | Current value | Correct value | Source |
|---|---|---|---|---|
| 1 | `royce-entry-roles.csv` geo-royce-300, 398, 399, 426, 477, 517, 529 (and plain text 426, 517 in `royce-area-plain.csv`) | "Fort Laramie treaty (which Royce's Schedule notes was never ratified)" | "Ratified by the Senate with amendment May 24, 1852 (annuity 50 to 10 years); never proclaimed; text not printed in the Statutes at Large (11 Stat. 749 is a stub). Kappler: assent of all nations but the Crow procured; Crow assent disputed. Royce's 'never ratified' is inaccurate." | verify-plains s.1 |
| 2 | `treaties-seed.csv` TLA-T-FL1851 notes | "Senate reduced annuity period from 50 to 10 years (Art. 5)"; date_ratified "1852-05" | Art. 7, not Art. 5; date_ratified 1852-05-24 (ratified with amendment; never proclaimed) | verify-plains s.1 |
| 3 | Instrument links for Royce 426 | Only TLA-T-FL1851, -315, -341 | Add TLA-T-371 (Fort Laramie with Northern Cheyenne and Northern Arapaho, May 10, 1868, 15 Stat. 655, Art. 2) as the Northern-band relinquishment | verify-plains s.3 |
| 4 | Royce 426 display | Single "ceded" polygon | Split at the South Platte; north and west part `contested` with attributed wording; never "never ceded" | verify-plains s.3 |
| 5 | `treaties-seed.csv` TLA-T-341; overlay TLA-T-341 | date_ratified blank; `how: treaty_negotiated`, confidence high | Ratification advised with amendments 1866-05-22; amendments accepted Nov. 10 and 19, 1866; proclaimed 1867-02-02; Art. 2 Kansas proviso. `how: treaty_under_pressure` (10.5 months after Sand Creek; minority signers, PSL TREC pp. 210-212); confidence medium | verify-plains s.5 |
| 6 | `treaties-seed.csv` TLA-T-366 notes | "Reservation of ~4.3 million acres retained" | The ~4.3M-acre reserve is the Aug. 10, 1869 executive-order reservation (Royce 525). The 1867 Art. 2 reserve (Kansas line, Cimarron, Arkansas) was never occupied | PSL TREC pp. 218-219; WEB-PRM-014 |
| 7 | Overlays TLA-T-364, -365, -366 | `how: treaty_negotiated` | `treaty_under_pressure` (Act of July 20, 1867 provided 4,000 volunteers if peace failed; Hancock burnings; predetermined removal plan per ICC Docket 257 record) | PSL TREC pp. 54-56, 213-214 |
| 8 | `treaties-seed.csv` TLA-A-1900 notes | "Signed by 456 of 639 members (Wikipedia) - the Medicine Lodge three-fourths requirement was not met" | "456 signatures; agent certified 562 adult males (above three-fourths); plaintiffs cited 639; the Secretary of the Interior's 1899 report says fewer than three-fourths signed (87 short at 18, 23 short at 21). No court ruled on forgery." Stat. cite 31 Stat. 672, 676-677 (sec. 6) | verify-plains s.6 |
| 9 | `treaties-seed.csv` TLA-T-364 notes | "tribes never ratified by the required three-fourths adult male vote" | Art. 12 governs later cessions; the 1867 treaty had no three-fourths ratification rule. The shortfall concerns the 1892 Jerome agreement | verify-plains s.6 |
| 10 | Royce 597, 598 (`royce-entry-roles.csv` role `ceded`) | ceded | 598: taken by statute (Act of Feb. 28, 1877, 19 Stat. 254), judicially found taking (*Sioux Nation*, 1980), payment refused. 597: taken by statute; Art. 12 consent not obtained | WEB-NC-013; WEB-UR-055 |
| 11 | Royce 440 (role `ceded`, 1863-03-03) | ceded | Taken by statute: Acts of Feb. 16, 1863 (12 Stat. 652) and Mar. 3, 1863 (12 Stat. 819). No Dakota cession | WEB-MAS-017; B1 V026 |
| 12 | Royce 529, 620 | ceded | Taken by executive order (EO Apr. 12, 1870; EO July 13, 1880). Royce p. 787: "considered as ceded" | WEB-PRM-008 |
| 13 | Royce 273-310 (California) | Reserves `kept`; cessions `ceded`; legal_type unknown | Reserves: unratified, promised, never set apart. Cessions: unratified; taking date 1853-03-03 per ICC/BIA; ICC award about $29.1M (1964) | WEB-NC-004 to -007; WEB-PRM-026 |
| 14 | Royce 682-689 (`cession-events.json`) | legal_type `statute`, date 1886-10-01 | legal_type `no_instrument`; drop 1886 from the timeline | WEB-NC-003 |
| 15 | Royce 444 (`cession-events.json`) | legal_type `treaty_or_agreement`; crosswalk `kept` | recognized_not_ceded; taken without instrument; ICC Docket 326-K; *Dann* payment refused | WEB-NC-009 to -011 |
| 16 | Royce 516 | Labelled the Great Sioux Reservation, status kept | Polygon is about 4.3M acres and is not the 1868 Art. 2 reservation (about 27.7M; rebuild from 598 + 699 + 700-705 or digitize Art. 2) | WEB-PRM-010 |
| 17 | Royce 540 | status `unclear` | Reserved (1868), still held in 1894; half interest taken 1878 (299 U.S. 476; 304 U.S. 111); post-1894 1896 and 1905 overlays | verify-ute-shoshone s.10 |
| 18 | Royce 566 plain text | "a 4-mile-square tract in the Uncompahgre Valley was kept in 1876" | Add: Uncompahgre Park was reserved in Art. I (1873), restored by EO Aug. 17, 1876, returned to public domain by the Act of May 14, 1884 (verify 23 Stat. 22); excluded from ICC Docket 327 | verify-ute-shoshone s.4 |
| 19 | Royce 616/617 | 616 ceded, 617 kept (repo note says possibly reversed) | Resolve from Royce's Colorado plate before tagging either; Royce p. 849: "Nos. 566, 616, and 617 compose this reservation" | verify-ute-shoshone s.5 |
| 20 | `violations-seed.csv` V039 | "the Brunot Agreement (ratified 1873)" | Agreement Sept. 13, 1873; ratified by Act of Apr. 29, 1874 (18 Stat. 36) | verify-ute-shoshone s.4; overlay TLA-A-1874 |
| 21 | `violations-seed.csv` V021 | Reparations: "no verified payment in sources read (status [unverified])" | NPS Sand Creek timeline: "these promised reparations are never paid"; no patents found | verify-plains s.5 |
| 22 | `treaties-seed.csv` TLA-T-324 | ratified "1869 [from-memory]" | Ratified Mar. 7, 1864; proclaimed June 7, 1869; printed in 18 Stat. Add Art. 7 Senate amendment (Mexican-law title limit) | verify-ute-shoshone s.7; WEB-UR-052 |
| 23 | Overlay TLA-T-328 (Conejos 1863) | `how: treaty_negotiated`, confidence high | `treaty_under_pressure` (Tabeguache only; Chivington a witness; PSL reports 500 troops); confidence medium. Note that other bands' relinquishment is 1868 (Royce 515) | verify-ute-shoshone s.1 |
| 24 | `treaties-seed.csv` TLA-T-259 (Mendota) | ratified `yes` | `partial`, like TLA-T-258: the Senate struck Art. 3 of both treaties | WEB-UR-050 (verify) |
| 25 | `treaties-seed.csv` TLA-T-262 (Fort Atkinson 1853) | ratified `yes`, no amendment note | Ratified with amendments (Senate 38-3, 1854-04-12); the 1854-07-21 acceptance has no Plains Apache signers | WEB-UR-049 (verify) |
| 26 | Any atlas text citing "Stat. 673" | Volume ambiguity | 13 Stat. 673 = Conejos (Tabeguache) 1863; 15 Stat. 673 = Fort Bridger 1868. Check every row | verify-ute-shoshone (cite collision) |
| 27 | Any atlas use of TREC's Denver act date | "May 24, 1864" (PSL TREC p. 194) | Act of May 28, 1864, ch. 99, 13 Stat. 94 | verify-plains s.4 |
| 28 | Any atlas use of ICC Cheyenne-Arapaho figures | "$15M for the 1851 lands"; "45 cents" | $23.5M for 51.21M acres as of Oct. 14, 1865 (about 46 cents an acre); $15M (1965) is the Southern tribes' global settlement of Dockets 329-A and 329-B; Northern Cheyenne share $5,950,200 (12 Ind. Cl. Comm. 212) | verify-plains s.8 |
| 29 | `treaties-seed.csv` TLA-U-FRANKLIN1830 | date 1830-08 (Wikipedia gives Aug. 27) | Avalon text gives 1830-08-31 (WEB-UR-046); sources disagree, so record both until a scan is read | WEB-UR-046 |
| 30 | `treaties-seed.csv` TLA-A-1877 notes | "$15.5 million plus interest" | Web sources give about $17.1-17.5M (1877 value) plus interest (about $105M in 1980). Check the opinion | WEB-PRM-012; WEB-HIS-036 (verify) |

---

## 12. Disagreements and claims needing verification

### 12.1 Where the PSL book contradicts the primary record (verify verdicts win)

- **Fort Laramie 1851 "never ratified"** (PSL TREC pp. 174, 236, 337). The record shows it was ratified with amendment and never proclaimed (verify-plains s.1). TREC also gives September 17, 1851, the signing date, as the Senate "ratification" (PSL TREC pp. 249-252).
- **Fort Wise Art. 6 "put the entire treaty in abeyance"** (Coel, via PSL TREC p. 262). The text is an invitation with a benefit cutoff (verify-plains s.2).
- **"Only one signature was ever secured, and that person was drunk"** (PSL TREC p. 263). This is contradicted by the August 19, 1863 Upper Platte agreement, which TREC itself describes as annuity-conditioned (PSL TREC p. 482).
- **"The proper procedure would have been to return the document... back to the Senate"** (PSL TREC p. 268). This contradicts the practice of the time (verify-plains s.2).
- **Little Arkansas "never ratified"** (PSL TREC pp. 84, 496). It was proclaimed Feb. 2, 1867 (verify-plains s.5).
- **Denver act "May 24, 1864"** (PSL TREC p. 194). The correct date is May 28 (verify-plains s.4).
- **1868 Ute boundary "south of the 40th parallel"** (PSL TREC p. 410). The north line is 15 miles north of it (verify-ute-shoshone s.3).
- **Dole quote** "cedes... all lands not owned, possessed or claimed" (PSL TREC pp. 184-185). The "not" looks like a transcription slip; check Unrau 1964.

### 12.2 Where the PSL book contradicts itself

- 1878 Arapaho placement: Stamm "only with the consent of the Shoshones" (PSL TREC p. 132) vs Tunison and Fowler "without Shoshone approval" (PSL TREC p. 135). The Supreme Court's account supports Tunison (299 U.S. 476).
- Uncompahgre Park included by a surveyor's "error" (PSL TREC p. 420) vs "deliberately" (PSL TREC p. 455).
- ICC price "45 cents" (PSL TREC p. 229) vs "46 cents" (PSL TREC pp. 333-334, 509-510).
- KCA ICC "$2.00 an acre" (PSL TREC p. 72) vs "$1.00 an acre" (PSL TREC p. 74). Buffalo value $48B (PSL TREC p. 74) vs $46B (PSL TREC p. 92).
- Little Raven: left the 1860 talks (PSL TREC p. 177), marked the 1861 treaty (PSL TREC p. 182), repudiated it (PSL TREC p. 184).
- Fort Atkinson placed in Kansas (PSL TREC p. 31) and "near present-day Davis, Oklahoma" (PSL TREC p. 39). The first is right.
- Medicine Lodge "about 60 miles" (PSL TREC pp. 31, 41) vs the treaty's "seventy miles" (PSL TREC p. 58).
- Little Arkansas: "all the leading chiefs eventually signed" (PSL TREC p. 41) vs "Many of the two Nations' leaders did not sign" (PSL TREC p. 54).
- 1851 Cheyenne signers: four "may have signed" (PSL TREC p. 252) vs six original signatures (PSL TREC p. 250).
- Arapahoe County: created by the Kansas legislature in 1855 (PSL TREC p. 175) vs organized under Gov. James Denver in 1858 (PSL TREC pp. 472-473). Both may be true (creation vs organization). Check.
- 1877 agreement dated "September 1877" (PSL TREC part A) vs signed Sept.-Oct. 1876 and ratified Feb. 28, 1877. The Cheyenne marks are dated Sept. 28, 1877 (PSL TREC pp. 298-299).
- Northern Cheyenne held at "Fort Sill" (PSL TREC part B) vs the Darlington / Fort Reno agency. Tongue River EO dated Nov. 16 (quote, PSL TREC p. 322) vs Nov. 26, 1884 (narrative).
- Southern Ute 1888 removal: 274 of 242 required signatures (PSL TREC p. 449) beside a report that the commission failed.

### 12.3 Single-source or unresolved claims (do not map as fact)

- The October 29, 1861 Fort Wise assent marks as forged (PSL TREC pp. 266-268, 477, 235). Roberts found a document saying the chiefs approved "in full council" (PSL TREC p. 265). Needs a NARA RIT 315 examination.
- The exact words of the 1862 Commissioner's report, and the Browne (Mar. 16, 1863) and Dole letters: need H. Exec. Doc. 1, 37th Cong., 3d sess., and OIA Letters Received.
- "Federal courts" finding no cession north of the South Platte (PSL TREC p. 484): no case named.
- Agent Head's admission that the 1863 Ute treaty was altered (PSL TREC p. 408): no document.
- Kirkwood's reimbursement of Mears (PSL TREC p. 437, citing Conetah): single source.
- ICC Docket 327 figures ($8.5M; $507,662.84; Ute appraisal $40,773,533) and Docket 63 ($27,500 vs $560,513.60): PSL only.
- Docket 349 cite: 12 or 14 Ind. Cl. Comm. 707. Moore v. U.S.: 32 Ct. Cl. 503 or 593. 13 Ind. Cl. Comm. 1 (Northern Cheyenne compromise): not surfaced.
- Crow assent to the 1851 amendment: 1853 Upper Platte file needed.
- Medicine Lodge Art. 2 pencil insertions: who wrote them, and when (PSL TREC pp. 58-59).
- Sand Creek captive children held during Medicine Lodge: up to 30, from one personal communication (PSL TREC p. 499). The Senate striking a back-annuity article from Medicine Lodge rests on Brill, uncited, and TREC says so (PSL TREC pp. 501-502).
- 1865 Costilla and Conejos census of over 100 children sold into slavery, tied to Lafayette Head (PSL TREC pp. 20, 465). It names an individual; locate the census.
- Water and subsurface mineral rights "never ceded" in Colorado (PSL TREC pp. 21, 162-163): legal theories, not settled law.
- TREC's $1.7 trillion (or $1.9 trillion) loss figure: reported in AP coverage (WEB-HIS-033). Use the report's own figure and method.
- 1878 smallpox, strychnine poisoning, the Little Annie mine sale and Colorado HB 178's outcome: speculative, oral or single newspaper.
- Robertson's 40-50 mile Royce 520 divergence: obtain the map before changing geometry.

### 12.4 Disagreements among other sources

- Jerome adult-male count: 562 (agent) vs 639 (plaintiffs, 1900 census). Fort Robinson dead: 64 (Army) vs 39 men and 22 women and children (Cummings) vs higher Cheyenne accounts. Bear River: 224 (Connor) to 493 (Jasperson).
- Sand Creek: "more than 230" (NPS) vs about 150 commonly cited (V021).
- Washita: 13 to 150 killed.
- California: rejection date (June 28, July 2 or July 8, 1852); reserve acreage (7.4M-8.5M); militia reimbursement figures ($1.29M vs $1.5M vs $924,259 by 1854).
- Madley's 9,492-16,094 California dead vs Anderson's much lower count.
- Pike 1805: unratified (atlas) vs Senate-consented 1808 and never proclaimed (WEB-UR-047, from memory).
- The Abiquiu principal signer: Capote (Southern Ute chronology) or Mouache Kaniache (Stewart).
- Ouray's son: taken by Lakota and traded to Arapaho, by an Arapaho band, or in a Sioux attack.

### 12.5 What would change the recommendations

- If the Crow assent of September 18, 1854 is confirmed, drop `senate_amended_no_consent` from 517.
- If the 1862 report's words and the Browne letter are confirmed from primary text, raise 426-N confidence to high. The status stays `contested`, not "never ceded", because of the 1865 and 1868 instruments.
- If NARA examination supports the Fort Wise forgery claim, add `bribery_fraud` (documented) and reconsider `senate_amended_no_consent` for 426 and 477.
- If 616/617 are reversed, swap their rows in `royce-status-proposals.csv`.
- Any nation's review overrides the wording of its own entries.
