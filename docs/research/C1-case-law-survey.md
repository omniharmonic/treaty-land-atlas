---
title: Case Law Survey - Indigenous Land Rights and Tribal Sovereignty in the United States (C1)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Case Law Survey: Indigenous Land Rights and Tribal Sovereignty (C1)

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

Treaty Land Atlas, Research Agent C. This file holds the **deep entries** for the most important cases. The full machine-readable list is `seed-data/cases-seed.csv` (104 rows); the quick index is reproduced at the end of this file. Statutes and policy acts are in `C2-statutes-and-policy-eras.md`; how the doctrines connect is in `C3-doctrine-map.md`.

## How to read this file

**Confidence tags** follow the research brief: `[verified]` (confirmed in a source I read this session), `[from-memory]`, `[disputed]`, `[unverified]`. Unless an entry says otherwise, the case name, reporter citation, decision date, author/vote, and holding were confirmed against the Justia opinion page (supreme.justia.com) or another source listed under Sources. Where a single element (a U.S. Reports page number, a treaty Statutes at Large cite, a historical background fact) comes from memory, it is flagged inline. Justia lists the most recent Supreme Court decisions as "U.S. ___" without page numbers, so page numbers for 2017-2023 cases are flagged `[reporter page from-memory]` in the CSV.

**Land-rights effect** (CSV column `land_rights_effect`):

- `advanced`: the holding favored Native land, treaty, or sovereign rights as they stood.
- `eroded`: the holding reduced or narrowed them.
- `mixed`: it did both, or its effect depends on the audience (for example, a compensation holding that refused land return).
- `procedural`: mainly about immunity, jurisdiction, or process rather than the substance of land or treaty rights.

This is an interpretive label made for the Atlas. Reasonable scholars would assign some cases differently; the label is not a legal term.

**Terminology the site must keep straight** (research brief, principle 2):

- **Treaty abrogation**: Congress, by a later statute, overriding a treaty term (for example *The Cherokee Tobacco*, *Lone Wolf*). Courts require clear intent to abrogate (*Menominee*, *Mille Lacs*, *Herrera*).
- **Diminishment**: Congress reducing the boundaries of a reservation while leaving a reservation in place (*Rosebud*, *Hagen*, *Yankton*).
- **Disestablishment**: Congress eliminating a reservation entirely (the question in *McGirt*, *Murphy*, and *Mille Lacs v. Madore*). Older cases and opinions sometimes say "termination" for this; do not confuse it with the Termination Era below.
- **Termination (the 1950s policy)**: ending the federal government-to-government relationship with a tribe (Menominee, Klamath, and others; see C2). It is a political-status concept, separate from reservation boundaries.
- **Extinguishment**: ending Indian title (aboriginal occupancy rights). Only the United States may do so (*Johnson v. M'Intosh*; *Oneida I*).
- **Broken vs. abrogated**: "broken" is the Atlas's plain-language label for U.S. non-performance of a treaty; "abrogated" is the legal act of ending a treaty term. Use the legal term only where a court or statute actually did that.

**Names.** Court opinions use colonial or government names. The Atlas should lead with each nation's own name where it is known and the nation approves of it, for example Diné (Navajo Nation), Mvskoke / Muscogee (Creek) Nation, Haudenosaunee (Six Nations, including Oneida, Cayuga, Seneca, Tuscarora), Anishinaabe (Ojibwe / Chippewa), Apsáalooke (Crow), Očhéthi Šakówiŋ (Great Sioux Nation), Ihanktonwan (Yankton Sioux), Umonhon (Omaha), Schitsu'umsh (Coeur d'Alene). These endonyms are `[from-memory]`; confirm spellings and diacritics with each nation before publication.

**Sensitive-content flags.** Several cases concern sacred places (Black Hills / Paha Sapa, Bears Ears, Oak Flat / Chi'chil Biłdagoteel, the San Francisco Peaks, Blue Lake). The cases are public and the places are named in the opinions, but the Atlas should not map ceremonial use areas, gathering locations, or burial sites beyond what the tribe or the public record already designates, and should seek tribal consultation before featuring any of them.

---

## Part 1. Foundations: discovery, domestic dependent nations, and the Marshall Trilogy (1810-1832)

### Johnson v. M'Intosh (1823) `case-johnson-v-mintosh-1823`

- **Citation:** *Johnson & Graham's Lessee v. M'Intosh*, 21 U.S. (8 Wheat.) 543 (1823). U.S. Supreme Court, Chief Justice Marshall. Justia gives decision dates of Feb. 28 and Mar. 10, 1823. `[verified]` https://supreme.justia.com/cases/federal/us/21/543/
- **Nations / treaty:** Illinois and Piankeshaw peoples, from whom the plaintiffs' predecessors bought land by private deeds in the 1770s `[from-memory]`. No treaty at issue.
- **Holding:** Private citizens cannot acquire title to Indian land directly from a tribe. Discovery gave the European sovereign, and then the United States, ultimate title and the sole power to extinguish the tribe's "right of occupancy." Courts of the United States will not recognize titles that do not trace to the federal government.
- **What it means for land rights:** This is the root of U.S. real-property law and of the "Doctrine of Discovery." Tribes were treated as holding a possessory right, not full ownership, and only the federal government could buy or take it. The same rule later protected tribes: states and private parties cannot acquire Indian land without federal consent (see *Oneida I* and *II*, and the Nonintercourse Act in C2).
- **Effect:** eroded (long-term), with a protective side. **Doctrines:** discovery, indian-title, plenary-power.
- **Notes:** The opinion's description of Native peoples is demeaning and should be quoted only with context. Justice Ginsburg's *Sherrill* opinion (2005) cites discovery in footnote 1 as the basis of the rule that fee title lies in the sovereign (it does not cite *Johnson v. M'Intosh* there) `[verified]`. The Vatican publicly repudiated the Doctrine of Discovery in March 2023 `[from-memory; not verified this session]`.

### Cherokee Nation v. Georgia (1831) `case-cherokee-nation-v-georgia-1831`

- **Citation:** 30 U.S. (5 Pet.) 1 (1831). Marshall, C.J., for the Court; Justice Johnson wrote separately. Justia does not state the decision date; the case is cited as 1831. `[verified]` https://supreme.justia.com/cases/federal/us/30/1/
- **Nation / treaty:** Cherokee Nation; Treaty of Hopewell (1785) and later treaties `[from-memory]`.
- **Holding:** The Cherokee Nation is not a "foreign state" within Article III, so the Court could not hear its original-jurisdiction suit against Georgia. The injunction was denied because the relief sought would require the Court to control Georgia's legislature, a political matter.
- **Meaning:** Marshall described tribes as "domestic dependent nations" in a relation to the United States "resembling that of a ward to his guardian" `[quotation from-memory]`. That sentence became a source of both the trust doctrine and the later plenary-power doctrine. Dissenting Justices Thompson and Story would have found jurisdiction `[from-memory]`.
- **Effect:** mixed. **Doctrines:** domestic-dependent-nations, guardianship, trust-doctrine.

### Worcester v. Georgia (1832) `case-worcester-v-georgia-1832`

- **Citation:** 31 U.S. (6 Pet.) 515 (1832). Decided March 3, 1832. The opinion is generally attributed to Marshall (Justia's page text did not name the author). `[verified]` https://supreme.justia.com/cases/federal/us/31/515/
- **Nation / treaty:** Cherokee Nation; Treaties of Hopewell (1785) and Holston (1791) `[from-memory]`.
- **Holding:** Georgia's law requiring non-Indians to hold a state license to live in Cherokee territory was void. The Cherokee Nation is a distinct political community with its own territory, in which Georgia's laws have no force, and relations with it belong exclusively to the federal government under the Constitution and treaties.
- **Meaning:** The foundational statement of inherent tribal sovereignty and federal preemption of state law in Indian country (Marshall called tribes "distinct, independent political communities"; SCOTUSblog's 2026 essay quotes this language). The judgment was not enforced by Georgia or the Jackson administration `[enforcement history from-memory]`. Removal followed under the Treaty of New Echota (1835), signed by a minority faction and opposed by most Cherokee, and the forced march of 1838-39 `[from-memory; the treaty's legitimacy remains contested, tag [disputed]]`.
- **Effect:** advanced (in law); not honored in practice. **Doctrines:** inherent-sovereignty, preemption, state-jurisdiction, canons-of-construction.

---

## Part 2. Plenary power and the late nineteenth century (1871-1903)

### Standing Bear v. Crook (1879) `case-standing-bear-v-crook-1879`

- **Citation:** *United States ex rel. Standing Bear v. Crook*, 25 F. Cas. 695 (C.C.D. Neb. 1879) (No. 14,891), 5 Dill. 453. Circuit Court, District of Nebraska, Judge Elmer Dundy. The source gives the year 1879 only. `[verified]` https://law.resource.org/pub/us/case/reporter/F.Cas/0025.f.cas/0025.f.cas.0695.pdf
- **Nation:** Ponca. Background: the Ponca were forced from their Nebraska homeland to Indian Territory in 1877 after their land was assigned to the Sioux by the 1868 Fort Laramie Treaty `[from-memory]`.
- **Holding:** An Indian is a "person" who may petition for habeas corpus, and no treaty or statute authorized forcibly moving peaceable Ponca to Indian Territory against their will; the relators were discharged.
- **Meaning:** An early recognition of Native legal personhood. It did not restore the Ponca homeland, but Standing Bear's party was allowed to return to the Niobrara area `[from-memory]`.
- **Effect:** advanced. **Doctrines:** citizenship, political-status, indian-country.
- **Tribal-voice note:** The Ponca Tribe of Nebraska and the Ponca Tribe of Indians of Oklahoma tell this history; defer to their accounts `[from-memory]`.

### Ex parte Crow Dog (1883) `case-ex-parte-crow-dog-1883`

- **Citation:** 109 U.S. 556 (1883). Decided Dec. 17, 1883. Justice Matthews. `[verified]` https://supreme.justia.com/cases/federal/us/109/556/
- **Nation / treaty:** Sicangu (Brule) Lakota; Fort Laramie Treaty of 1868 and the 1877 Agreement.
- **Holding:** A territorial federal court lacked jurisdiction to try one Indian for killing another on the Great Sioux Reservation; the statutory exception for intra-Indian crimes was not repealed by the treaty or the agreement.
- **Meaning:** The Court respected tribal self-government, but Congress answered with the Major Crimes Act (1885) and the Court upheld it in *Kagama*. The case is the origin of federal criminal jurisdiction over serious crimes in Indian country, central to *McGirt* in 2020.
- **Effect:** mixed. **Doctrines:** criminal-jurisdiction, inherent-sovereignty.

### United States v. Kagama (1886) `case-kagama-1886`

- **Citation:** 118 U.S. 375 (1886). Decided May 10, 1886. Justice Miller. `[verified]` https://supreme.justia.com/cases/federal/us/118/375/
- **Nation:** Indians of the Hoopa Valley Reservation, California `[from-memory]`.
- **Holding:** Congress may punish crimes by Indians against Indians on reservations in a state. The Court rested this on Congress's authority over dependent tribes, not on the Indian Commerce Clause.
- **Meaning:** The origin of the "plenary power" doctrine as an extra-constitutional authority justified by guardianship. The oft-quoted passage ties the federal power to the tribes' "weakness and helplessness" `[quotation from-memory]`.
- **Effect:** eroded. **Doctrines:** plenary-power, guardianship, trust-doctrine, criminal-jurisdiction.

### Lone Wolf v. Hitchcock (1903) `case-lone-wolf-v-hitchcock-1903`

- **Citation:** 187 U.S. 553 (1903). Decided Jan. 5, 1903. Justice White. `[verified]` https://supreme.justia.com/cases/federal/us/187/553/
- **Nations / treaty:** Kiowa, Comanche, and (Plains) Apache; Medicine Lodge Treaty of 1867, which required consent of three-fourths of adult males for cessions.
- **Holding:** Congress has plenary power over tribal relations; a treaty consent requirement did not prevent Congress from opening the reservation to allotment by statute. The Court treated the matter as political and beyond judicial review, and presumed Congress acted in good faith.
- **Meaning:** The leading case for unilateral congressional abrogation of Indian treaties. It is the "last word" for the Atlas's "broken vs. abrogated" distinction: a legally sanctioned breach. It paved the way for allotment-era land loss.
- **Effect:** eroded. **Doctrines:** plenary-power, abrogation, allotment, trust-doctrine.
- **Related:** *The Cherokee Tobacco*, 78 U.S. (11 Wall.) 616 (1871) `case-cherokee-tobacco-1871` (a later statute overrides an earlier treaty; Justia dates it to the December Term 1870; `[verified]`).

---

## Part 3. Reserved rights and the canons of construction (1896-1930)

### United States v. Winans (1905) `case-us-v-winans-1905`

- **Citation:** 198 U.S. 371 (1905). Decided May 16, 1905. Justice McKenna. `[verified]` https://supreme.justia.com/cases/federal/us/198/371/
- **Nation / treaty:** Yakama Nation; Treaty of 1855 (12 Stat. 951 `[Stat. cite from-memory]`).
- **Holding:** The treaty right to fish at "usual and accustomed places" was a right the Yakama reserved from the land they ceded, not a grant to them. It burdened the ceded land against the United States' later grantees and the state, and statehood did not end it; private patents and state licensing must yield to reasonable regulation securing it.
- **Meaning:** The origin of the **reserved-rights doctrine**: tribes keep every right they did not give up. It is the root of modern treaty fishing, hunting, and gathering law (*Boldt*, *Fishing Vessel*, *Mille Lacs*, *Herrera*, *Cougar Den*).
- **Effect:** advanced. **Doctrines:** reserved-rights, canons-of-construction, treaty-fishing-rights.

### Winters v. United States (1908) `case-winters-v-us-1908`

- **Citation:** 207 U.S. 564 (1908). Decided Jan. 6, 1908. Justice McKenna; Brewer dissenting. `[verified]` https://supreme.justia.com/cases/federal/us/207/564/
- **Nations / agreement:** A'aninin (Gros Ventre) and Nakoda (Assiniboine), Fort Belknap Reservation; Agreement of 1888 `[endonyms from-memory]`.
- **Holding:** The 1888 agreement creating Fort Belknap impliedly reserved enough Milk River water for the reservation's purposes, and Montana's later statehood did not defeat that reserved right.
- **Meaning:** The "Winters doctrine": federal reservations carry implied water rights with a priority date no later than the reservation's creation. This is among the strongest land-linked rights in federal Indian law, and the basis of later water settlements (see *Arizona v. California*, *Arizona v. Navajo Nation*). The opinion states that ambiguities are resolved from the Indians' standpoint `[pin cite 207 U.S. at 576-77 from-memory]`.
- **Effect:** advanced. **Doctrines:** reserved-rights, reserved-water-rights, canons-of-construction.

**The canons of construction themselves** are collected in C3, Part 3. In brief: *Jones v. Meehan*, 175 U.S. 1 (1899) `[verified]` held a treaty "must therefore be construed not according to the technical meaning of its words to learned lawyers" `[partial quotation verified]`; *Carpenter v. Shaw*, 280 U.S. 363 (1930) `[verified]` held "Doubtful expressions are to be resolved in favor of the weak and defenseless people who are the wards of the nation" `[quotation verified]`.

---

## Part 4. Trust, takings, and compensation (1935-1955)

### Seminole Nation v. United States (1942) `case-seminole-nation-v-us-1942`

- **Citation:** 316 U.S. 286 (1942). Decided May 11, 1942. Justice Murphy. `[verified]` https://supreme.justia.com/cases/federal/us/316/286/
- **Nation / treaty:** Seminole Nation; Treaty of 1866.
- **Holding:** The government owes tribes a strict fiduciary duty, and the Court of Claims had to decide whether officials knew tribal leaders were defrauding members when payments were made.
- **Meaning:** The foundation of the modern **trust doctrine**, later narrowed by *Navajo I* (2003), *Jicarilla* (2011), and *Arizona v. Navajo Nation* (2023): the strict duty applies only where a statute, treaty, or regulation creates a specific fiduciary obligation.
- **Effect:** advanced. **Doctrines:** trust-doctrine, claims.

### Tee-Hit-Ton Indians v. United States (1955) `case-tee-hit-ton-v-us-1955`

- **Citation:** 348 U.S. 272 (1955). Decided Feb. 7, 1955. Justice Reed; Douglas dissenting (with Warren and Frankfurter). `[verified]` https://supreme.justia.com/cases/federal/us/348/272/
- **Nation:** Tlingit (Tee-Hit-Ton clan), Alaska. No treaty.
- **Holding:** Unrecognized aboriginal occupancy is not property protected by the Fifth Amendment; Congress can extinguish it without compensation.
- **Meaning:** The sharpest contrast with recognized title (*Shoshone Tribe*, 299 U.S. 476 (1937) `[verified]`; *Creek Nation*, 295 U.S. 103 (1935) `[verified]`; *Sioux Nation*, 1980). Tribes whose rights were never recognized by treaty or statute received no compensation for taking. It shaped the Alaska Native claims settlement (ANCSA, 1971), which exchanged aboriginal title for land and money.
- **Effect:** eroded. **Doctrines:** aboriginal-title, takings, discovery.
- **Related:** *Northwestern Bands of Shoshone v. United States*, 324 U.S. 335 (1945) `[verified]` (no recognized title under the 1863 Box Elder treaty).

### Seneca Nation (Kinzua Dam) (1958) `case-seneca-nation-kinzua-1958` `[verified: caption and citation; certiorari history unverified]`

- **Citation:** *Seneca Nation of Indians v. Brucker*, 262 F.2d 27 (D.C. Cir. 1958) (per curiam) `[verified]` (Justia: https://law.justia.com/cases/federal/appellate-courts/F2/262/27/55095/). The dam facts (about 10,000 acres of the Allegany Reservation flooded; over 600 people displaced; dam completed 1965) are from the Wikipedia article on Kinzua Dam `[secondary source read]`; the certiorari history is `[unverified]`.
- **Nation / treaty:** Seneca Nation of Indians (Haudenosaunee); Treaty of Canandaigua (1794).
- **Holding (as understood):** Courts declined to block the taking for Kinzua Dam, treating later congressional authorization as controlling over the 1794 treaty.
- **Meaning:** A modern example of lawful abrogation of a ratified treaty in a land taking. The Atlas should present it with the Seneca Nation's own account.
- **Effect:** eroded. **Doctrines:** abrogation, plenary-power, takings.

---

## Part 5. Termination to self-determination (1959-1980)

### Menominee Tribe of Indians v. United States (1968) `case-menominee-tribe-v-us-1968`

- **Citation:** 391 U.S. 404 (1968). Decided May 27, 1968. Justice Douglas. `[verified]` https://supreme.justia.com/cases/federal/us/391/404/
- **Nation / treaty:** Menominee Nation; Treaty of Wolf River (1854).
- **Holding:** "To be held as Indian lands are held" in the 1854 treaty included hunting and fishing rights, and the Menominee Termination Act of 1954 (read with Public Law 280) did not extinguish them; courts do not lightly infer abrogation.
- **Meaning:** Treaty rights can survive termination of federal status. It established the "clear intent to abrogate" canon applied in *Mille Lacs* and *Herrera*. The Menominee were restored to federal recognition in 1973 (C2).
- **Effect:** advanced. **Doctrines:** abrogation, termination, canons-of-construction, reserved-rights.

### Morton v. Mancari (1974) `case-morton-v-mancari-1974`

- **Citation:** 417 U.S. 535 (1974). Decided June 17, 1974. Justice Blackmun, unanimous. `[verified]` https://supreme.justia.com/cases/federal/us/417/535/
- **Holding:** The BIA Indian hiring preference is not racial discrimination; it is a political classification tied to Indian self-government, subject to rational-basis review.
- **Meaning:** The basis for treating tribal citizenship as a political status. It underpins the defense of ICWA in *Brackeen* and of other Indian-specific laws.
- **Effect:** advanced. **Doctrines:** political-status, self-determination, trust-doctrine.

### United States v. Washington ("Boldt decision") (1974) and Fishing Vessel (1979) `case-us-v-washington-boldt-1974`, `case-wa-fishing-vessel-1979`

- **Citation:** 384 F. Supp. 312 (W.D. Wash. 1974) (Judge George Boldt), aff'd, 520 F.2d 676 (9th Cir. 1975) (decided June 4, 1975), cert. denied, 423 U.S. 1086 (1976) `[verified, Wikipedia secondary]`; *Washington v. Washington State Commercial Passenger Fishing Vessel Ass'n*, 443 U.S. 658 (1979) (Justice Stevens) `[verified, Justia]`.
- **Nations / treaties:** The Stevens treaties of 1854-55 (Medicine Creek, Point Elliott, Neah Bay, Point No Point, Olympia) and the tribes that descend from their signatories.
- **Holding:** "In common with" gives the tribes up to half the harvestable fish at their usual and accustomed places; the state may regulate treaty fishing only as necessary for conservation. The Supreme Court affirmed the principle that a fair share (up to 50 percent) is guaranteed.
- **Meaning:** The largest restoration of treaty-reserved resource rights in U.S. history, enforced against state resistance. The case remains open (Phase II on habitat; a culvert phase), producing *Washington v. United States*, 584 U.S. ___ (2018) (No. 17-269), affirmed by an equally divided Court (Kennedy recused) `[verified, Justia]` (the judgment reviewed was the Ninth Circuit's amended opinion of Mar. 2, 2017, No. 13-35474, which superseded the original opinion at 827 F.3d 836 (2016) `[verified, Justia]`), so the Ninth Circuit's holding that the treaties require the State to avoid blocking salmon runs with state-owned culverts stands, with replacement due by 2030 `[verified, Wikipedia]`.
- **Effect:** advanced. **Doctrines:** treaty-fishing-rights, reserved-rights, canons-of-construction.
- **Date note:** Judge Boldt's decision date (Feb. 12, 1974) is `[from-memory]`.

### Joint Tribal Council of the Passamaquoddy Tribe v. Morton (1975) `case-passamaquoddy-v-morton-1975`

- **Citation:** 528 F.2d 370 (1st Cir. 1975), aff'g 388 F. Supp. 649 (D. Me. 1975). Judge Levin Campbell. Wikipedia gives Dec. 23, 1975. `[verified, secondary]`
- **Nations:** Passamaquoddy Tribe, Penobscot Nation. No treaty; the claim was that Massachusetts' and Maine's conveyances without federal consent violated the Nonintercourse Act.
- **Holding:** The Nonintercourse Act protects any "tribe," including one not federally recognized, and creates a federal trust relationship that Maine could not end.
- **Meaning:** Opened the eastern land-claims era. Settled by the Maine Indian Claims Settlement Act (1980), which extinguished the claims for about $81.5 million, part of it to buy up to 300,000 acres `[secondary, Wikipedia]` (see C2).
- **Effect:** advanced (then compromised by settlement). **Doctrines:** nonintercourse, trust-doctrine, federal-recognition.

### Oneida I and II (1974, 1985), City of Sherrill (2005), and Cayuga (2005) `case-oneida-i-1974`, `case-oneida-ii-1985`, `case-city-of-sherrill-v-oneida-2005`, `case-cayuga-nation-v-pataki-2005`

- **Citations:** *Oneida Indian Nation v. County of Oneida*, 414 U.S. 661 (1974) (Jan. 21, 1974; Justice White; unanimous); *County of Oneida v. Oneida Indian Nation*, 470 U.S. 226 (1985) (Mar. 4, 1985; Justice Powell); *City of Sherrill v. Oneida Indian Nation of New York*, 544 U.S. 197 (2005) (Mar. 29, 2005; Justice Ginsburg; Stevens dissenting); *Cayuga Indian Nation of New York v. Pataki*, 413 F.3d 266 (2d Cir. 2005), cert. denied, 547 U.S. 1128 (2006). `[verified]`
- **Nations / treaties:** Oneida and Cayuga (Haudenosaunee); Treaty of Fort Schuyler (1788) and Treaty of Canandaigua (1794), as discussed in *Sherrill* `[verified]` (the Fort Stanwix (1784) reference in earlier drafts is not supported by the opinion; the Canandaigua link for *Cayuga* is `[unverified]`); claims rooted in an 1795 New York purchase and the Nonintercourse Act of 1793; Cayuga conveyances of 1795 and 1807 (64,015 acres, verified).
- **Holdings:** *Oneida I*: a possessory claim based on the Nonintercourse Act arises under federal law, and Indian title can be extinguished only with federal consent. *Oneida II*: tribes may sue under federal common law to enforce those rights, and limitations and other defenses fail. *Sherrill*: a nation that repurchased parcels on the open market after about two centuries could not revive tribal sovereignty over them; laches, acquiescence, and impossibility bar that, and the route is trust acquisition under 25 U.S.C. 5108 (formerly 465). *Cayuga*: laches also bars possessory land claims in the nature of ejectment, vacating a roughly $247.9 million judgment.
- **Meaning:** The Oneida cases made the strongest affirmative case for treaty and Nonintercourse protection of tribal land; *Sherrill* and *Cayuga* then closed most remedies through equitable defenses. For the Atlas this is the clearest example of "a right without a remedy."
- **Effect:** advanced (I, II); eroded (Sherrill, Cayuga). **Doctrines:** nonintercourse, indian-title, laches, land-into-trust.

### Tribal criminal and civil jurisdiction: Oliphant, Wheeler, Santa Clara (1978) `case-oliphant-v-suquamish-1978`, `case-us-v-wheeler-1978`, `case-santa-clara-pueblo-v-martinez-1978`

- **Oliphant v. Suquamish Indian Tribe**, 435 U.S. 191 (1978) (Mar. 6, 1978; Rehnquist; Marshall and Burger dissenting) `[verified]`. Tribes have no inherent criminal jurisdiction over non-Indians absent congressional authorization ("implicit divestiture"). Congress began to reverse this for domestic-violence crimes in VAWA 2013 and expanded it in VAWA 2022 (C2). Suquamish Tribe; Treaty of Point Elliott (1855) `[from-memory]`. Effect: eroded.
- **United States v. Wheeler**, 435 U.S. 313 (1978) (Mar. 22, 1978; Stewart) `[verified]`. A tribe prosecuting its own members acts as a separate sovereign; Double Jeopardy does not bar a later federal prosecution. Tribal criminal power is inherent, not delegated. Navajo Nation. Effect: advanced.
- **Santa Clara Pueblo v. Martinez**, 436 U.S. 49 (1978) (May 15, 1978; Marshall; White dissenting) `[verified]`. Tribal sovereign immunity bars federal suits to enforce the Indian Civil Rights Act; habeas under 25 U.S.C. 1303 is the sole federal remedy. Effect: procedural (protects self-government, limits individual remedies).

### Montana v. United States (1981) and its progeny `case-montana-v-us-1981`

- **Citation:** 450 U.S. 544 (1981). Decided Mar. 24, 1981. Justice Stewart. `[verified]` https://supreme.justia.com/cases/federal/us/450/544/
- **Nation / treaties:** Crow Tribe (Apsáalooke); Fort Laramie Treaties of 1851 and 1868.
- **Holding:** Title to the Big Horn riverbed passed to Montana at statehood. The Tribe may regulate non-members on tribal land and trust land, but generally not on non-Indian fee land within the reservation, except (1) consensual relationships and (2) conduct threatening the tribe's political integrity, economic security, or health or welfare.
- **Progeny** (all `[verified]` via Justia): *Strate v. A-1 Contractors*, 520 U.S. 438 (1997); *Atkinson Trading Co. v. Shirley*, 532 U.S. 645 (2001) (Navajo hotel-occupancy tax on non-members on fee land; not in the CSV); *Nevada v. Hicks*, 533 U.S. 353 (2001) (Scalia; the rule reaches tribal-member land when the claim is against state officers); *Plains Commerce Bank v. Long Family Land & Cattle Co.*, 554 U.S. 316 (2008) (5-4). *United States v. Cooley*, 593 U.S. 345 (2021) `[reporter page from-memory, unconfirmed; No. 19-1414, date and holding verified at Justia]` applied the second exception to uphold a tribal officer's temporary detention of a non-Indian on a public highway through the Crow Reservation.
- **Effect:** eroded. **Doctrines:** montana-rule, civil-jurisdiction, inherent-sovereignty, implicit-divestiture.

### United States v. Sioux Nation of Indians (1980) `case-us-v-sioux-nation-1980`

- **Citation:** 448 U.S. 371 (1980). Decided June 30, 1980. Justice Blackmun. `[verified]` https://supreme.justia.com/cases/federal/us/448/371/
- **Nation / treaty:** Great Sioux Nation (Očhéthi Šakówiŋ); Fort Laramie Treaty of 1868 (15 Stat. 635 `[verified]`) and the Act of Feb. 28, 1877.
- **Holding:** Congress did not violate separation of powers by waiving res judicata, and the 1877 Act took tribal property that the 1868 treaty reserved (including the Black Hills, Paha Sapa), so the United States owed just compensation with interest.
- **Meaning:** The Court's own language about the taking was severe `[specific quotation from-memory]`. The remedy was money only. The Sioux have not accepted the payment, which has accrued interest; the fund was reported at over $1 billion in 2011 (PBS) and described as $2 billion in 2022 (SDPB); Wikipedia says over $1 billion as of 2018 `[journalistic; no Treasury figure located]`. The Atlas should present "Land Back" as the Sioux Nation's stated position (the Black Hills are not for sale) and verify current figures with the Sioux nations.
- **Effect:** mixed. **Doctrines:** takings, recognized-title, claims, plenary-power.

---

## Part 6. Reservation boundaries: diminishment and disestablishment

The Supreme Court has decided whether Congress shrank or eliminated a reservation in a line of cases. The inquiry asks for **clear congressional intent**, looking first to the text of the surplus-land act, then to contemporary history, and (more weakly) to later events (the *Solem* framework).

| Case | Reservation / nation | Result |
|---|---|---|
| *Seymour v. Superintendent*, 368 U.S. 351 (1962) | Colville Reservation | Not diminished as to the site at issue `[verified]` |
| *Mattz v. Arnett*, 412 U.S. 481 (1973) | Klamath River Reservation (Yurok) | Not terminated `[verified]` |
| *DeCoteau v. District County Court*, 420 U.S. 425 (1975) | Lake Traverse (Sisseton-Wahpeton) | Terminated (1891 Act) `[verified]` |
| *Rosebud Sioux Tribe v. Kneip*, 430 U.S. 584 (1977) | Rosebud | Diminished `[verified]` |
| *Solem v. Bartlett*, 465 U.S. 463 (1984) | Cheyenne River | Not diminished (1908 Act); announced the test `[verified]` |
| *Hagen v. Utah*, 510 U.S. 399 (1994) | Uintah Valley (Ute) | Diminished `[verified]` |
| *South Dakota v. Yankton Sioux Tribe*, 522 U.S. 329 (1998) | Yankton | Diminished (1894 Act) `[verified]` |
| *Nebraska v. Parker*, 577 U.S. 481 (2016) | Omaha | Not diminished (1882 Act) `[verified]` |
| *McGirt v. Oklahoma*, 591 U.S. ___ (2020) | Muscogee (Creek) | Not disestablished `[verified]` |

### McGirt v. Oklahoma (2020) with Sharp v. Murphy `case-mcgirt-v-oklahoma-2020`, `case-sharp-v-murphy-2020`

- **Citation:** *McGirt v. Oklahoma*, No. 18-9526 (July 9, 2020) (591 U.S. 894 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume), 5-4, Justice Gorsuch for Ginsburg, Breyer, Sotomayor, and Kagan; Roberts dissenting with Alito, Kavanaugh, and (mostly) Thomas. `[verified]` https://supreme.justia.com/cases/federal/us/591/18-9526/ *Sharp v. Murphy*, 591 U.S. 977 (2020) (per curiam, same day, applying *McGirt*) `[verified]`; Tenth Circuit: *Murphy v. Royal*, 875 F.3d 896 (2017) `[from-memory]` (V1 found this cite only in Wikipedia's *Sharp v. Murphy* article, a secondary source; the original panel opinion is 866 F.3d 1164).
- **Nation / treaties:** Muscogee (Creek) Nation (Mvskoke); treaties of 1832, 1833, 1856, and 1866 `[from-memory]`. McGirt himself is a Seminole Nation citizen `[from-memory]`. The Court's reasoning has since been applied to the Cherokee, Chickasaw, Choctaw, and Seminole reservations by Oklahoma courts `[from-memory; not verified this session]`.
- **Holding:** Land reserved for the Creek Nation remains "Indian country" for Major Crimes Act purposes. Only Congress can disestablish a reservation, and no statute did so despite allotment, the Curtis Act, and Oklahoma statehood.
- **Meaning:** The Court's strongest recent statement that promises in treaties are enforced unless Congress clearly says otherwise. It is a criminal-jurisdiction holding, but its reasoning protects the territorial integrity of the reservation, which the Atlas can treat as "honored treaty territory." It was sharply limited in *Castro-Huerta* (2022).
- **Effect:** advanced. **Doctrines:** disestablishment, diminishment, indian-country, criminal-jurisdiction, canons-of-construction.

### Oklahoma v. Castro-Huerta (2022) `case-oklahoma-v-castro-huerta-2022`

- **Citation:** No. 21-429 (June 29, 2022) (597 U.S. 629 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume), 5-4, Justice Kavanaugh; Gorsuch dissenting with Breyer, Sotomayor, and Kagan. `[verified]` https://supreme.justia.com/cases/federal/us/597/21-429/
- **Holding:** The federal government and the state share jurisdiction to prosecute non-Indians who commit crimes against Indians in Indian country. Neither the General Crimes Act, Public Law 280, nor principles of tribal self-government preempts state authority.
- **Meaning:** Reopened state criminal authority over non-Indians inside reservations, undercutting the *Worcester* baseline. It does not change reservation boundaries or tribal jurisdiction over Indians, but it narrowed *McGirt*'s practical effect. Related litigation over municipal prosecution of Native defendants in Tulsa reached the Supreme Court as *Stitt v. City of Tulsa*, No. 25-30, listed in the Tribal Supreme Court Project's October Term 2024 index among denied or dismissed petitions `[status for this case unverified]`.
- **Effect:** eroded. **Doctrines:** criminal-jurisdiction, state-jurisdiction, indian-country, preemption.

---

## Part 7. Religion, sacred places, and the land

### Lyng v. Northwest Indian Cemetery Protective Ass'n (1988); Employment Division v. Smith (1990); Navajo Nation v. U.S. Forest Service (2008); Apache Stronghold (2024-2025) `case-lyng-v-nw-indian-cemetery-1988`, `case-employment-div-v-smith-1990`, `case-navajo-nation-v-us-forest-service-2008`, `case-apache-stronghold-v-us-2024`

- **Lyng**, 485 U.S. 439 (1988) (Apr. 19, 1988; O'Connor, 5-3): the Free Exercise Clause did not bar a Forest Service road through the Chimney Rock area used for Yurok, Karuk, and Tolowa ceremonies, even if it would severely burden religious practice; AIRFA created no enforceable rights. `[verified]`
- **Smith**, 494 U.S. 872 (1990) (Apr. 17, 1990; Scalia): neutral laws of general applicability do not violate the Free Exercise Clause, so Oregon could deny benefits for sacramental peyote use. Congress responded with RFRA (1993, Pub. L. 103-141 `[from-memory]`) and the 1994 AIRFA amendments (Pub. L. 103-344, verified at Wikipedia). `[verified]`
- **Navajo Nation v. U.S. Forest Service**, 535 F.3d 1058 (9th Cir. 2008) (en banc) (Aug. 8, 2008): using reclaimed wastewater for snowmaking on the San Francisco Peaks was not a "substantial burden" under RFRA. `[verified, Wikipedia]`
- **Apache Stronghold v. United States**, 101 F.4th 1036 (9th Cir. 2024) (en banc), cert. denied, No. 24-291 (U.S. May 27, 2025): the en banc court rejected RFRA and treaty-trust claims against the congressionally mandated Oak Flat (Chi'chil Biłdagoteel) land exchange to Resolution Copper `[merits holding from-memory]`. The Supreme Court denied certiorari on May 27, 2025; Justice Gorsuch dissented, joined by Justice Thomas, and Justice Alito took no part. `[denial, vote, and citation verified at Cornell LII]` https://www.law.cornell.edu/supremecourt/text/24-291
- **2026 developments:** The Supreme Court denied an application to block the land transfer on Mar. 19, 2026 (*Lopez v. United States*, No. 25A1008) `[verified, NARF memo]`; the Forest Service transferred more than 2,400 acres `[KJZZ]`; a 2-1 Ninth Circuit panel ruled for the government in March 2026 and, in late September or early October 2026, the Ninth Circuit declined rehearing en banc, with eleven judges urging the Supreme Court to intervene (KJZZ, Oct. 2, 2026) `[unverified: news report only; caption and cite not located]`.
- **Meaning:** Together these cases show that sacred places on federal land receive little constitutional protection; the main protections are statutory and procedural (NHPA Section 106 consultation, NAGPRA, the Antiquities Act, and negotiated co-management).
- **Effect:** eroded. **Doctrines:** sacred-sites, religious-freedom, land-exchange, consultation.
- **Sensitivity flag:** Oak Flat and the San Francisco Peaks are sacred places of the Western Apache and of several nations respectively. Present only the public legal record and defer to the nations' statements.

---

## Part 8. Land into trust, recognition, and trust accounting

### Carcieri v. Salazar (2009) `case-carcieri-v-salazar-2009`

- **Citation:** 555 U.S. 379 (2009). Decided Feb. 24, 2009. Justice Thomas, 6-3 (Stevens dissenting; Souter dissenting in part with Ginsburg). `[verified]` https://supreme.justia.com/cases/federal/us/555/07-526/
- **Nation:** Narragansett Indian Tribe (Rhode Island).
- **Holding:** "Now under Federal jurisdiction" in the Indian Reorganization Act means under federal jurisdiction in 1934, so the Secretary could not take land into trust for a tribe not then under federal jurisdiction.
- **Meaning:** Placed a cloud over trust acquisitions for tribes recognized after 1934. Interior's later two-part approach to "under federal jurisdiction" (an M-Opinion of 2014 `[from-memory]`) has been applied, for example to the Mashpee Wampanoag, whose trust land survived litigation through the First Circuit with certiorari denied in early April 2024 (`case-mashpee-wampanoag-carcieri-litigation-2016-2024` `[verified, DOJ blog]`). Whether Congress has enacted a legislative "Carcieri fix" as of October 2026 is `[unverified]`.
- **Related:** *Match-E-Be-Nash-She-Wish Band v. Patchak*, 567 U.S. 209 (2012) (APA suits may challenge trust acquisitions) `[verified]` and *Patchak v. Zinke*, 583 U.S. ___ (2018) (plurality upheld Congress's jurisdiction-stripping law) `[verified]`. Neither *Patchak* decision is in the CSV.
- **Effect:** eroded. **Doctrines:** land-into-trust, federal-recognition.

### Cobell v. Salazar (2009) and the Land Buy-Back Program `case-cobell-v-salazar-2009`

- **Citation:** 573 F.3d 808 (D.C. Cir. 2009) (July 29, 2009), vacating a $455.6 million award. The class action *Cobell v. Babbitt* was filed June 10, 1996; Congress funded the $3.4 billion settlement in the Claims Resolution Act of 2010; the district court approved it Aug. 4, 2011; it became final Nov. 24, 2012. `[verified, DOI press release and Wikipedia]`
- **Parties:** Individual Indian trust beneficiaries; lead plaintiff Elouise Cobell (Blackfeet).
- **Settlement:** $1.5 billion for class members and a $1.9 billion Land Consolidation Fund (up to $60 million for scholarships) `[verified, DOI]`. Secondary reporting says that by 2016 about $900 million had bought fractionated interests equal to about 1.7 million acres `[secondary, Wikipedia]`. The program's end date and final totals are `[unverified]`.
- **Meaning:** The largest trust-mismanagement accounting in U.S. history; it addresses the allotment-era problem of fractionation (see *Hodel v. Irving*, 481 U.S. 704 (1987) `[verified]`).
- **Effect:** mixed. **Doctrines:** trust-doctrine, fractionation, claims.

---

## Part 9. Treaty rights in the modern Court

### Minnesota v. Mille Lacs Band of Chippewa Indians (1999) `case-minnesota-v-mille-lacs-1999`

- **Citation:** 526 U.S. 172 (1999). Decided Mar. 24, 1999. Justice O'Connor, 5-4. `[verified]` https://supreme.justia.com/cases/federal/us/526/172/
- **Nation / treaties:** Mille Lacs Band and other Anishinaabe (Chippewa) bands; Treaty of 1837 (7 Stat. 536 `[Stat. cite from-memory]`); the 1855 Treaty.
- **Holding:** The 1837 treaty rights to hunt, fish, and gather on ceded lands survived: the 1850 removal order was invalid, the 1855 treaty did not abrogate them, and Minnesota's statehood did not extinguish them.
- **Meaning:** Repudiated the *Race Horse* rule (*Ward v. Race Horse*, 163 U.S. 504 (1896) `[verified]`) that statehood ends treaty rights. Established that abrogation requires clear evidence.
- **Effect:** advanced. **Doctrines:** reserved-rights, abrogation, canons-of-construction.

### Herrera v. Wyoming (2019) `case-herrera-v-wyoming-2019`

- **Citation:** No. 17-532 (May 20, 2019) (587 U.S. 329 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume). Justice Sotomayor, 5-4 (Gorsuch joined the majority; Alito dissenting with Roberts, Thomas, Kavanaugh). `[verified]` https://supreme.justia.com/cases/federal/us/587/17-532/
- **Nation / treaty:** Crow Tribe; Fort Laramie Treaty of 1868 (Crow).
- **Holding:** The Crow treaty hunting right did not expire when Wyoming became a state (*Mille Lacs* undercut *Race Horse*), and Bighorn National Forest did not become categorically "occupied" land under the treaty; vacated and remanded.
- **Effect:** advanced. **Doctrines:** reserved-rights, abrogation, canons-of-construction, statehood.

### Washington State Dept. of Licensing v. Cougar Den, Inc. (2019) `case-wa-dept-licensing-v-cougar-den-2019`

- **Citation:** No. 16-1498 (Mar. 19, 2019) (586 U.S. 347 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume). Breyer's lead opinion (joined by Sotomayor and Kagan), with Gorsuch and Ginsburg concurring in the judgment; 5-4. `[verified]` https://supreme.justia.com/cases/federal/us/586/16-1498/
- **Nation / treaty:** Yakama Nation; Treaty of 1855.
- **Holding:** The treaty right to travel on public highways bars Washington from applying its fuel-import tax to Yakama-owned fuel hauled to the reservation.
- **Effect:** advanced. **Doctrines:** reserved-rights, canons-of-construction, taxation.

### Arizona v. Navajo Nation (2023) `case-arizona-v-navajo-nation-2023`

- **Citation:** Nos. 21-1484 and 22-51 (June 22, 2023) (599 U.S. 555 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume). Justice Kavanaugh, 5-4; Gorsuch dissenting with Sotomayor, Kagan, and Jackson. `[verified]` https://supreme.justia.com/cases/federal/us/599/21-1484/
- **Nation / treaty:** Navajo Nation (Diné); Treaty of 1868.
- **Holding:** The 1868 treaty implicitly reserved water for the reservation but did not require the United States to take affirmative steps to secure water; the Ninth Circuit's contrary holding was reversed.
- **Meaning:** Confirms the Winters right on paper while limiting enforceable trust duties; a clear instance of the trust doctrine's narrowing since *Navajo I* (2003, 537 U.S. 488 `[verified]`) and *Jicarilla* (2011, 564 U.S. 162 `[verified]`).
- **Effect:** eroded. **Doctrines:** reserved-water-rights, trust-doctrine, claims.

### Mille Lacs Band of Ojibwe v. Madore (8th Cir. Feb. 12, 2025) `case-mille-lacs-band-v-madore-2025`

- **Citation:** No. 23-1257 (8th Cir. Feb. 12, 2025), consolidated with Nos. 23-1261 and 23-1265 (Judge Loken for the majority; Judge Erickson concurring specially). `[verified]` https://cases.justia.com/federal/appellate-courts/ca8/23-1257/23-1257-2025-02-12.pdf
- **Nation / treaties:** Mille Lacs Band of Ojibwe; treaties of 1855, 1863, and 1864 and the Nelson Act of 1889.
- **Holding:** The court dismissed the appeals as moot after Minnesota amended Minn. Stat. 626.90 (effective July 1, 2023) and vacated the district court's March 4, 2022 and January 10, 2023 orders (which had held the reservation was never disestablished). In Part IV the majority wrote that the 1863 and 1864 treaties and the Nelson Act appear to meet the "almost insurmountable presumption" of diminishment, while acknowledging that "ambiguities abound"; Erickson did not join Part IV and would leave the question open. The Band's own timeline records that the reservation's status "will have to be resolved in a future case." In February 2026, Mille Lacs County asked Interior to revisit Solicitor's Opinion M-37032 `[verified, Band's Inaajimowin timeline]`.
- **Meaning:** The Atlas's best live example of an unresolved disestablishment question. Whether the full-reservation boundary is intact is therefore open as of October 2026.
- **Effect:** mixed. **Doctrines:** diminishment, disestablishment, indian-country, criminal-jurisdiction.

---

## Part 10. Self-determination, family, and sovereignty in the 2020s

### Haaland v. Brackeen (2023) `case-haaland-v-brackeen-2023`

- **Citation:** Nos. 21-376 et al. (June 15, 2023) (599 U.S. 255 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume). Justice Barrett, 7-2 (Thomas and Alito dissenting; Gorsuch and Kavanaugh concurring). `[verified]` https://supreme.justia.com/cases/federal/us/599/21-376/
- **Holding:** The Court upheld Congress's Article I power to enact the Indian Child Welfare Act (1978) and rejected anticommandeering challenges to its active-efforts, placement-preference, and record-keeping provisions; the equal protection and nondelegation claims failed for lack of standing.
- **Meaning:** Reaffirmed congressional authority over Indian affairs. Justice Gorsuch's concurrence grounded it in the Indian Commerce Clause, the treaty power, and the history of removal `[contents from-memory beyond the verified fact of the concurrence]`.
- **Effect:** advanced. **Doctrines:** icwa, plenary-power, political-status, self-determination.

### Immunity and self-determination funding: Kiowa (1998), Bay Mills (2014), Lac du Flambeau v. Coughlin (2023), Becerra (2024) `case-kiowa-tribe-v-manufacturing-tech-1998`, `case-michigan-v-bay-mills-2014`, `case-lac-du-flambeau-v-coughlin-2023`, `case-becerra-v-san-carlos-apache-2024`

- *Kiowa Tribe v. Manufacturing Technologies*, 523 U.S. 751 (1998): tribes are immune from contract suits, commercial or governmental, on or off the reservation, unless Congress or the tribe waives. `[verified]`
- *Michigan v. Bay Mills Indian Community*, 572 U.S. 782 (2014) (Kagan): immunity bars Michigan's suit over an off-reservation casino; the Court declined to overrule *Kiowa*. `[verified]`
- *Lac du Flambeau Band v. Coughlin*, No. 22-227 (June 15, 2023) (599 U.S. 382 `[verified-secondary]`: matches the Wikipedia infobox; confirm against the bound volume) (Jackson): the Bankruptcy Code abrogates sovereign immunity for all governmental units, tribes included; Thomas concurred in the judgment and Gorsuch dissented (the Justia page header says 7-2 while its list of joiners totals eight; the tally is flagged). `[verified, tally flagged]`
- *Becerra v. San Carlos Apache Tribe*, 602 U.S. 222 (2024) (June 6, 2024; Roberts, 5-4; Kavanaugh dissenting with Thomas, Alito, Barrett): the Indian Self-Determination and Education Assistance Act requires the Indian Health Service to pay contract support costs for tribes' spending of third-party income on programs they took over. `[verified, with NARF bulletin for the U.S. citation]`
- **Meaning:** The Court is simultaneously broadening some self-determination funding (*Becerra*) and narrowing immunity and jurisdiction (*Coughlin*, *Castro-Huerta*). These are not land cases but they define the capacity of tribes to hold and use land.

---

## Part 11. Federal recognition and what the Court declined to hear (2025-2026)

The Court took **no Indian-law merits cases in October Term 2024 and none in October Term 2025** (NARF Tribal Supreme Court Project; `[verified]`), so there is no Supreme Court merits decision on Indian land rights between *Becerra* (June 2024) and the date of this survey. Items of note:

- **Chinook Indian Nation v. Burgum**, No. 25-313: certiorari denied Mar. 23, 2026, leaving in place a ruling that the Chinook's federal recognition claim presents a non-justiciable political question `[verified, NARF memo]`. The unratified Treaty of Tansy Point (1851) is the Chinook's historical treaty `[from-memory]`.
- **Turtle Mountain Band of Chippewa Indians v. Howe**, No. 25-253: on May 18, 2026 the Court granted certiorari, vacated the Eighth Circuit's judgment (no private right of action under Voting Rights Act Section 2) and remanded `[verified, NARF bulletin]`. Voting rights, not land, but it affects tribal political power. Not in the CSV.
- **Denied petitions** in OT2025 included *Alaska v. United States* (Kuskokwim River, Jan. 12, 2026), *Sault Ste. Marie Tribe v. Michigan* (treaty fishing consent decree, Jan. 12, 2026), and *Stroble v. Oklahoma Tax Commission* (Apr. 6, 2026) `[verified, NARF memo]`. OT2024 denials included *Sault Ste. Marie Tribe v. Haaland* (land into trust, Apr. 28, 2025) `[verified]`.
- **Executive branch** (not litigation): see C2 for the July 13, 2026 Bears Ears and Grand Staircase proclamations, the Feb. 24, 2026 Alaska trust-land opinion (M-37087), and the Dec. 18, 2025 Lumbee recognition.

---

## Index of all cases in `cases-seed.csv`

Sorted by year. `Effect` follows the key above.

| ID | Case | Citation | Year | Effect | Doctrines | Confidence |
|---|---|---|---|---|---|---|
| case-fletcher-v-peck-1810 | Fletcher v. Peck | 10 U.S. (6 Cranch) 87 (1810) | 1810 | mixed | discovery; indian-title | verified |
| case-johnson-v-mintosh-1823 | Johnson v. M'Intosh | 21 U.S. (8 Wheat.) 543 (1823) | 1823 | eroded | discovery; indian-title; plenary-power | verified |
| case-cherokee-nation-v-georgia-1831 | Cherokee Nation v. Georgia | 30 U.S. (5 Pet.) 1 (1831) | 1831 | mixed | domestic-dependent-nations; guardianship; trust-doctrine | verified |
| case-worcester-v-georgia-1832 | Worcester v. Georgia | 31 U.S. (6 Pet.) 515 (1832) | 1832 | advanced | inherent-sovereignty; state-jurisdiction; preemption; canons-of-construction | verified |
| case-cherokee-tobacco-1871 | The Cherokee Tobacco | 78 U.S. (11 Wall.) 616 (1871) [Justia prints (1870); December Term 1870] | 1871 | eroded | abrogation; last-in-time; plenary-power | verified |
| case-standing-bear-v-crook-1879 | Standing Bear v. Crook | United States ex rel. Standing Bear v. Crook, 25 F. Cas. 695 (C.C.D. Neb. 1879) (No. 14,891) | 1879 | advanced | citizenship; indian-country; political-status | verified |
| case-ex-parte-crow-dog-1883 | Ex parte Crow Dog | 109 U.S. 556 (1883) | 1883 | mixed | criminal-jurisdiction; inherent-sovereignty | verified |
| case-elk-v-wilkins-1884 | Elk v. Wilkins | 112 U.S. 94 (1884) | 1884 | eroded | citizenship; political-status | verified |
| case-choctaw-nation-v-us-1886 | Choctaw Nation v. United States | 119 U.S. 1 (1886) | 1886 | advanced | canons-of-construction; claims | verified |
| case-kagama-1886 | United States v. Kagama | 118 U.S. 375 (1886) | 1886 | eroded | plenary-power; guardianship; trust-doctrine; criminal-jurisdiction | verified |
| case-talton-v-mayes-1896 | Talton v. Mayes | 163 U.S. 376 (1896) | 1896 | mixed | inherent-sovereignty; criminal-jurisdiction | verified |
| case-ward-v-race-horse-1896 | Ward v. Race Horse | 163 U.S. 504 (1896) | 1896 | eroded | reserved-rights; abrogation; statehood | verified |
| case-jones-v-meehan-1899 | Jones v. Meehan | 175 U.S. 1 (1899) | 1899 | advanced | canons-of-construction; indian-title | verified |
| case-lone-wolf-v-hitchcock-1903 | Lone Wolf v. Hitchcock | 187 U.S. 553 (1903) | 1903 | eroded | plenary-power; abrogation; allotment; trust-doctrine | verified |
| case-us-v-winans-1905 | United States v. Winans | 198 U.S. 371 (1905) | 1905 | advanced | reserved-rights; canons-of-construction; treaty-fishing-rights | verified |
| case-winters-v-us-1908 | Winters v. United States | 207 U.S. 564 (1908) | 1908 | advanced | reserved-rights; reserved-water-rights; canons-of-construction | verified |
| case-carpenter-v-shaw-1930 | Carpenter v. Shaw | 280 U.S. 363 (1930) | 1930 | advanced | canons-of-construction; taxation | verified |
| case-us-v-creek-nation-1935 | United States v. Creek Nation | 295 U.S. 103 (1935) | 1935 | advanced | takings; recognized-title; claims | verified |
| case-shoshone-tribe-v-us-1937 | Shoshone Tribe v. United States | 299 U.S. 476 (1937) | 1937 | advanced | takings; recognized-title; claims | verified |
| case-us-v-santa-fe-pacific-1941 | United States v. Santa Fe Pacific R. Co. | 314 U.S. 339 (1941) | 1941 | mixed | aboriginal-title; indian-title; abrogation | verified |
| case-seminole-nation-v-us-1942 | Seminole Nation v. United States | 316 U.S. 286 (1942) | 1942 | advanced | trust-doctrine; claims | verified |
| case-tulee-v-washington-1942 | Tulee v. Washington | 315 U.S. 681 (1942) | 1942 | advanced | reserved-rights; treaty-fishing-rights; preemption | verified |
| case-northwestern-bands-v-us-1945 | Northwestern Bands of Shoshone Indians v. United States | 324 U.S. 335 (1945) | 1945 | eroded | aboriginal-title; recognized-title; claims | verified |
| case-tee-hit-ton-v-us-1955 | Tee-Hit-Ton Indians v. United States | 348 U.S. 272 (1955) | 1955 | eroded | aboriginal-title; takings; discovery; plenary-power | verified |
| case-seneca-nation-kinzua-1958 | Seneca Nation (Kinzua Dam litigation) | Seneca Nation of Indians v. Brucker, 262 F.2d 27 (D.C. Cir. 1958) (per curiam) [cert. history unverified] | 1958 | eroded | abrogation; plenary-power; takings | verified |
| case-williams-v-lee-1959 | Williams v. Lee | 358 U.S. 217 (1959) | 1959 | advanced | civil-jurisdiction; inherent-sovereignty; state-jurisdiction | verified |
| case-fpc-v-tuscarora-1960 | Federal Power Commission v. Tuscarora Indian Nation | 362 U.S. 99 (1960) | 1960 | eroded | takings; nonintercourse; indian-title | verified |
| case-seymour-v-superintendent-1962 | Seymour v. Superintendent of Washington State Penitentiary | 368 U.S. 351 (1962) | 1962 | advanced | diminishment; indian-country; criminal-jurisdiction | verified |
| case-arizona-v-california-1963 | Arizona v. California | 373 U.S. 546 (1963) | 1963 | advanced | reserved-water-rights; reserved-rights | verified |
| case-menominee-tribe-v-us-1968 | Menominee Tribe of Indians v. United States | 391 U.S. 404 (1968) | 1968 | advanced | abrogation; termination; canons-of-construction; reserved-rights | verified |
| case-puyallup-tribe-v-dept-of-game-1968 | Puyallup Tribe v. Department of Game (Puyallup I) | 391 U.S. 392 (1968) | 1968 | mixed | treaty-fishing-rights; preemption; state-jurisdiction | verified |
| case-sohappy-v-smith-1969 | Sohappy v. Smith (Belloni decision) | 302 F. Supp. 899 (D. Or. 1969) | 1969 | advanced | treaty-fishing-rights; reserved-rights | verified |
| case-mattz-v-arnett-1973 | Mattz v. Arnett | 412 U.S. 481 (1973) | 1973 | advanced | diminishment; indian-country; allotment | verified |
| case-mcclanahan-v-arizona-tax-1973 | McClanahan v. Arizona State Tax Commission | 411 U.S. 164 (1973) | 1973 | advanced | preemption; taxation; state-jurisdiction; canons-of-construction | verified |
| case-morton-v-mancari-1974 | Morton v. Mancari | 417 U.S. 535 (1974) | 1974 | advanced | political-status; self-determination; trust-doctrine | verified |
| case-oneida-i-1974 | Oneida Indian Nation v. County of Oneida (Oneida I) | 414 U.S. 661 (1974) | 1974 | advanced | nonintercourse; indian-title; aboriginal-title | verified |
| case-us-v-washington-boldt-1974 | United States v. Washington (Boldt decision) | 384 F. Supp. 312 (W.D. Wash. 1974), aff'd, 520 F.2d 676 (9th Cir. 1975), cert. denied, 423 U.S. 1086 (1976) | 1974 | advanced | treaty-fishing-rights; reserved-rights; canons-of-construction | verified |
| case-decoteau-v-district-county-court-1975 | DeCoteau v. District County Court | 420 U.S. 425 (1975) | 1975 | eroded | diminishment; disestablishment; allotment | verified |
| case-passamaquoddy-v-morton-1975 | Joint Tribal Council of the Passamaquoddy Tribe v. Morton | 528 F.2d 370 (1st Cir. 1975), aff'g 388 F. Supp. 649 (D. Me. 1975) | 1975 | advanced | nonintercourse; trust-doctrine; federal-recognition; indian-title | verified |
| case-bryan-v-itasca-county-1976 | Bryan v. Itasca County | 426 U.S. 373 (1976) | 1976 | advanced | state-jurisdiction; taxation; civil-jurisdiction; canons-of-construction | verified |
| case-rosebud-sioux-v-kneip-1977 | Rosebud Sioux Tribe v. Kneip | 430 U.S. 584 (1977) | 1977 | eroded | diminishment; disestablishment; allotment | verified |
| case-oliphant-v-suquamish-1978 | Oliphant v. Suquamish Indian Tribe | 435 U.S. 191 (1978) | 1978 | eroded | criminal-jurisdiction; implicit-divestiture; inherent-sovereignty | verified |
| case-santa-clara-pueblo-v-martinez-1978 | Santa Clara Pueblo v. Martinez | 436 U.S. 49 (1978) | 1978 | procedural | sovereign-immunity; inherent-sovereignty; self-determination | verified |
| case-us-v-wheeler-1978 | United States v. Wheeler | 435 U.S. 313 (1978) | 1978 | advanced | inherent-sovereignty; criminal-jurisdiction; dual-sovereignty | verified |
| case-mashpee-v-new-seabury-1979 | Mashpee Tribe v. New Seabury Corp. | 592 F.2d 575 (1st Cir. 1979) | 1979 | eroded | nonintercourse; federal-recognition; aboriginal-title | verified |
| case-wa-fishing-vessel-1979 | Washington v. Washington State Commercial Passenger Fishing Vessel Ass'n | 443 U.S. 658 (1979) | 1979 | advanced | treaty-fishing-rights; reserved-rights; canons-of-construction | verified |
| case-us-v-sioux-nation-1980 | United States v. Sioux Nation of Indians | 448 U.S. 371 (1980) | 1980 | mixed | takings; recognized-title; claims; plenary-power | verified |
| case-white-mountain-apache-v-bracker-1980 | White Mountain Apache Tribe v. Bracker | 448 U.S. 136 (1980) | 1980 | advanced | preemption; taxation; state-jurisdiction | verified |
| case-montana-v-us-1981 | Montana v. United States | 450 U.S. 544 (1981) | 1981 | eroded | montana-rule; civil-jurisdiction; inherent-sovereignty; implicit-divestiture | verified |
| case-merrion-v-jicarilla-1982 | Merrion v. Jicarilla Apache Tribe | 455 U.S. 130 (1982) | 1982 | advanced | inherent-sovereignty; taxation | verified |
| case-new-mexico-v-mescalero-1983 | New Mexico v. Mescalero Apache Tribe | 462 U.S. 324 (1983) | 1983 | advanced | preemption; state-jurisdiction; inherent-sovereignty | verified |
| case-solem-v-bartlett-1984 | Solem v. Bartlett | 465 U.S. 463 (1984) | 1984 | advanced | diminishment; indian-country; disestablishment | verified |
| case-montana-v-blackfeet-1985 | Montana v. Blackfeet Tribe | 471 U.S. 759 (1985) | 1985 | advanced | taxation; canons-of-construction; state-jurisdiction | verified |
| case-oneida-ii-1985 | Oneida County v. Oneida Indian Nation (Oneida II) | 470 U.S. 226 (1985) | 1985 | advanced | nonintercourse; indian-title; canons-of-construction | verified |
| case-or-dept-fish-wildlife-v-klamath-1985 | Oregon Dept. of Fish & Wildlife v. Klamath Indian Tribe | 473 U.S. 753 (1985) | 1985 | eroded | reserved-rights; abrogation; termination | verified |
| case-us-v-dann-1985 | United States v. Dann | 470 U.S. 39 (1985) | 1985 | eroded | aboriginal-title; claims; federal-recognition | verified |
| case-california-v-cabazon-1987 | California v. Cabazon Band of Mission Indians | 480 U.S. 202 (1987) | 1987 | advanced | gaming; state-jurisdiction; preemption | verified |
| case-hodel-v-irving-1987 | Hodel v. Irving | 481 U.S. 704 (1987) | 1987 | advanced | fractionation; takings; allotment | verified |
| case-lyng-v-nw-indian-cemetery-1988 | Lyng v. Northwest Indian Cemetery Protective Ass'n | 485 U.S. 439 (1988) | 1988 | eroded | sacred-sites; religious-freedom | verified |
| case-brendale-v-yakima-1989 | Brendale v. Confederated Tribes and Bands of the Yakama Indian Nation | 492 U.S. 408 (1989) | 1989 | eroded | civil-jurisdiction; montana-rule; allotment | verified |
| case-employment-div-v-smith-1990 | Employment Division v. Smith | 494 U.S. 872 (1990) | 1990 | eroded | religious-freedom; sacred-sites | verified |
| case-hagen-v-utah-1994 | Hagen v. Utah | 510 U.S. 399 (1994) | 1994 | eroded | diminishment; disestablishment; criminal-jurisdiction | verified |
| case-seminole-tribe-v-florida-1996 | Seminole Tribe of Florida v. Florida | 517 U.S. 44 (1996) | 1996 | eroded | gaming; sovereign-immunity; plenary-power | verified |
| case-strate-v-a-1-contractors-1997 | Strate v. A-1 Contractors | 520 U.S. 438 (1997) | 1997 | eroded | civil-jurisdiction; montana-rule | verified |
| case-alaska-v-native-village-of-venetie-1998 | Alaska v. Native Village of Venetie Tribal Government | 522 U.S. 520 (1998) | 1998 | eroded | indian-country; taxation; inherent-sovereignty | verified |
| case-kiowa-tribe-v-manufacturing-tech-1998 | Kiowa Tribe of Oklahoma v. Manufacturing Technologies, Inc. | 523 U.S. 751 (1998) | 1998 | procedural | sovereign-immunity | verified |
| case-south-dakota-v-yankton-sioux-1998 | South Dakota v. Yankton Sioux Tribe | 522 U.S. 329 (1998) | 1998 | eroded | diminishment; disestablishment; indian-country | verified |
| case-minnesota-v-mille-lacs-1999 | Minnesota v. Mille Lacs Band of Chippewa Indians | 526 U.S. 172 (1999) | 1999 | advanced | reserved-rights; abrogation; canons-of-construction; treaty-fishing-rights | verified |
| case-idaho-v-us-2001 | Idaho v. United States | 533 U.S. 262 (2001) | 2001 | advanced | indian-title; trust-doctrine; reserved-rights | verified |
| case-nevada-v-hicks-2001 | Nevada v. Hicks | 533 U.S. 353 (2001) | 2001 | eroded | civil-jurisdiction; montana-rule; state-jurisdiction | verified |
| case-us-v-navajo-nation-2003 | United States v. Navajo Nation (Navajo I) | 537 U.S. 488 (2003) | 2003 | eroded | trust-doctrine; claims | verified |
| case-us-v-lara-2004 | United States v. Lara | 541 U.S. 193 (2004) | 2004 | advanced | inherent-sovereignty; plenary-power; criminal-jurisdiction; dual-sovereignty | verified |
| case-cayuga-nation-v-pataki-2005 | Cayuga Indian Nation of New York v. Pataki | 413 F.3d 266 (2d Cir. 2005), cert. denied, 547 U.S. 1128 (2006) | 2005 | eroded | laches; nonintercourse; indian-title | verified |
| case-city-of-sherrill-v-oneida-2005 | City of Sherrill v. Oneida Indian Nation of New York | 544 U.S. 197 (2005) | 2005 | eroded | land-into-trust; indian-country; laches; indian-title | verified |
| case-navajo-nation-v-us-forest-service-2008 | Navajo Nation v. U.S. Forest Service | 535 F.3d 1058 (9th Cir. 2008) (en banc), cert. denied (2009) | 2008 | eroded | sacred-sites; religious-freedom | verified |
| case-plains-commerce-bank-v-long-family-2008 | Plains Commerce Bank v. Long Family Land & Cattle Co. | 554 U.S. 316 (2008) | 2008 | eroded | civil-jurisdiction; montana-rule | verified |
| case-carcieri-v-salazar-2009 | Carcieri v. Salazar | 555 U.S. 379 (2009) | 2009 | eroded | land-into-trust; federal-recognition; indian-country | verified |
| case-cobell-v-salazar-2009 | Cobell v. Salazar (individual Indian trust litigation) | 573 F.3d 808 (D.C. Cir. 2009) | 2009 | mixed | trust-doctrine; fractionation; claims; allotment | verified |
| case-us-v-jicarilla-apache-nation-2011 | United States v. Jicarilla Apache Nation | 564 U.S. 162 (2011) | 2011 | eroded | trust-doctrine; claims | verified |
| case-adoptive-couple-v-baby-girl-2013 | Adoptive Couple v. Baby Girl | 570 U.S. 637 (2013) | 2013 | eroded | icwa; political-status | verified |
| case-michigan-v-bay-mills-2014 | Michigan v. Bay Mills Indian Community | 572 U.S. 782 (2014) | 2014 | procedural | sovereign-immunity; gaming; land-into-trust | verified |
| case-dollar-general-v-miss-choctaw-2016 | Dollar General Corp. v. Mississippi Band of Choctaw Indians | 579 U.S. ___ (2016) (per curiam, equally divided) | 2016 | procedural | civil-jurisdiction; montana-rule | verified |
| case-mashpee-wampanoag-carcieri-litigation-2016-2024 | Mashpee Wampanoag trust-land litigation (Littlefield v. Dept. of the Interior line) | Littlefield v. U.S. Dep't of the Interior, 199 F. Supp. 3d 391 (D. Mass. 2016) [from-memory]; D.D.C. 2020; D. Mass. and 1st Cir. affirmances; cert. denied Apr. 2024 | 2016 | mixed | land-into-trust; federal-recognition; indian-country | verified |
| case-menominee-indian-tribe-v-us-2016 | Menominee Indian Tribe of Wisconsin v. United States | 577 U.S. 250 (2016) | 2016 | procedural | claims; self-determination | verified |
| case-nebraska-v-parker-2016 | Nebraska v. Parker | 577 U.S. 481 (2016) | 2016 | advanced | diminishment; indian-country; disestablishment | verified |
| case-murphy-v-royal-2017 | Murphy v. Royal | 875 F.3d 896 (10th Cir. 2017) [from-memory; V1 found 875 F.3d 896 in Wikipedia (Sharp v. Murphy) only, secondary source; original panel opinion is 866 F.3d 1164] | 2017 | advanced | disestablishment; diminishment; criminal-jurisdiction | from-memory |
| case-washington-v-us-culverts-2018 | Washington v. United States (culverts case) | 584 U.S. ___ (2018) (per curiam, equally divided), No. 17-269, aff'g United States v. Washington, No. 13-35474 (9th Cir. Mar. 2, 2017) (amended opinion; superseded original at 827 F.3d 836 (9th Cir. 2016); reporter cite of the amended opinion believed 853 F.3d 946 [unconfirmed]) | 2018 | advanced | treaty-fishing-rights; reserved-rights | verified |
| case-herrera-v-wyoming-2019 | Herrera v. Wyoming | 587 U.S. ___ (2019), No. 17-532 [reporter page 587 U.S. 329 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2019 | advanced | reserved-rights; abrogation; canons-of-construction; statehood | verified |
| case-wa-dept-licensing-v-cougar-den-2019 | Washington State Dept. of Licensing v. Cougar Den, Inc. | 586 U.S. ___ (2019), No. 16-1498 [reporter page 586 U.S. 347 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2019 | advanced | reserved-rights; canons-of-construction; taxation | verified |
| case-mcgirt-v-oklahoma-2020 | McGirt v. Oklahoma | 591 U.S. ___ (2020), No. 18-9526 [reporter page 591 U.S. 894 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2020 | advanced | disestablishment; diminishment; indian-country; criminal-jurisdiction; canons-of-construction | verified |
| case-sharp-v-murphy-2020 | Sharp v. Murphy | 591 U.S. 977 (2020) (per curiam), No. 17-1107 | 2020 | advanced | disestablishment; indian-country; criminal-jurisdiction | verified |
| case-us-v-cooley-2021 | United States v. Cooley | 593 U.S. 345 (2021) [reporter page 345 from-memory, unconfirmed: no source V1 read prints it; No. 19-1414, date, holding verified at Justia] | 2021 | advanced | civil-jurisdiction; montana-rule; criminal-jurisdiction | from-memory |
| case-yellen-v-chehalis-2021 | Yellen v. Confederated Tribes of the Chehalis Reservation | 594 U.S. ___ (2021), No. 20-543 [reporter page 594 U.S. 338 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2021 | procedural | federal-recognition; self-determination | verified |
| case-oklahoma-v-castro-huerta-2022 | Oklahoma v. Castro-Huerta | 597 U.S. ___ (2022), No. 21-429 [reporter page 597 U.S. 629 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2022 | eroded | criminal-jurisdiction; state-jurisdiction; indian-country; preemption | verified |
| case-ysleta-del-sur-pueblo-v-texas-2022 | Ysleta del Sur Pueblo v. Texas | 596 U.S. ___ (2022), No. 20-493 [reporter page 596 U.S. 685 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2022 | advanced | gaming; federal-recognition; termination | verified |
| case-arizona-v-navajo-nation-2023 | Arizona v. Navajo Nation | 599 U.S. ___ (2023), Nos. 21-1484 and 22-51 [reporter page 599 U.S. 555 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2023 | eroded | reserved-water-rights; trust-doctrine; claims | verified |
| case-haaland-v-brackeen-2023 | Haaland v. Brackeen | 599 U.S. ___ (2023), Nos. 21-376 et al. [reporter page 599 U.S. 255 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2023 | advanced | icwa; plenary-power; political-status; self-determination | verified |
| case-lac-du-flambeau-v-coughlin-2023 | Lac du Flambeau Band v. Coughlin | 599 U.S. ___ (2023), No. 22-227 [reporter page 599 U.S. 382 from-memory; matches Wikipedia infobox, secondary only; check bound volume] | 2023 | procedural | sovereign-immunity; abrogation | verified |
| case-apache-stronghold-v-us-2024 | Apache Stronghold v. United States (Oak Flat; Chi'chil Bildagoteel) | 101 F.4th 1036 (9th Cir. 2024) (en banc), cert. denied, No. 24-291 (U.S. May 27, 2025) | 2024 | eroded | sacred-sites; religious-freedom; treaty-trust-claim; land-exchange | verified |
| case-becerra-v-san-carlos-apache-2024 | Becerra v. San Carlos Apache Tribe | 602 U.S. 222 (2024) (consolidated with Becerra v. Northern Arapaho Tribe) | 2024 | advanced | self-determination; trust-doctrine; claims | verified |
| case-mille-lacs-band-v-madore-2025 | Mille Lacs Band of Ojibwe v. Madore (Mille Lacs County) | No. 23-1257 (8th Cir. Feb. 12, 2025) (consolidated with Nos. 23-1261, 23-1265) | 2025 | mixed | diminishment; disestablishment; indian-country; criminal-jurisdiction | verified |
| case-chinook-indian-nation-v-burgum-2026 | Chinook Indian Nation v. Burgum | No. 25-313 (U.S. Mar. 23, 2026) (cert. denied) | 2026 | eroded | federal-recognition; claims | verified |
| case-lopez-v-us-oak-flat-2026 | Lopez v. United States (Oak Flat application) | No. 25A1008 (U.S. Mar. 19, 2026) (application denied) | 2026 | eroded | sacred-sites; land-exchange; religious-freedom | verified |
| case-oak-flat-9th-circuit-2026 | Oak Flat land-exchange litigation, Ninth Circuit (2026) | Ninth Circuit panel decision (Mar. 2026) and denial of rehearing en banc (late Sept./early Oct. 2026); caption and F.4th cite not located | 2026 | eroded | sacred-sites; land-exchange; consultation | unverified |

---

## Sources

All URLs below were actually fetched in this research session (2026-10-16) unless marked otherwise.

**Supreme Court opinions (Justia, `https://supreme.justia.com/cases/federal/us/{volume}/{page-or-docket}/`)**
- 10/87; 21/543; 30/1; 31/515; 34/711 (read, not used in CSV); 45/567 (read, not used in CSV); 78/616; 112/94; 109/556; 118/375; 119/1; 135/641 (read, not used in CSV); 163/376; 163/504; 175/1; 185/373 (read); 187/553; 198/371; 207/564; 224/665 (read); 231/28 (read); 280/363
- 295/103; 299/476; 314/339; 315/681; 316/286; 324/335; 337/86 (read); 348/272; 358/217; 362/99; 368/351; 373/546; 391/392; 391/404; 397/620 (read); 411/145 (read); 411/164; 412/481; 414/661; 417/535
- 420/425; 426/128 (read); 426/373; 430/584; 435/191; 435/313; 436/49; 443/658; 448/136; 448/371; 450/544; 455/130; 462/324; 465/463; 470/39; 470/226; 471/759; 473/753; 476/498 (read); 480/202; 481/704; 485/439; 490/163 (read); 492/408; 494/872; 495/676 (read)
- 510/399; 517/44; 519/234 (read); 520/438; 522/329; 522/520; 523/696 (read); 523/751; 526/172; 532/645 (read); 533/262; 533/353; 537/488; 538/701 (read); 541/193; 544/197; 546/95 (read); 554/316; 555/07-526; 556/287 (read); 564/162; 567/182 (read); 567/209; 570/637; 572/782; 577/481; 577/14-510; 579/13-1496; 579/15-420 (read); 581/15-1500 (read); 583/16-498 (read); 584/17-269; 584/17-387 (read); 586/16-1498; 587/17-532; 591/17-1107; 591/18-9526; 594/20-543; 596/20-7622 (read); 596/20-493; 597/21-429; 599/21-376; 599/21-1484; 599/22-227; 602/23-250
- *Cooley* (No. 19-1414; earlier drafts said No. 20-1009, which was wrong): V1 read the Justia page and verified the docket, date and holding; the reporter page 593 U.S. 345 is still `[from-memory]` and unconfirmed. The Ninth Circuit citation for the culverts case was superseded: the judgment reviewed was the amended opinion of Mar. 2, 2017 (V1); its reporter cite, believed to be 853 F.3d 946, is unconfirmed.

**Lower courts and special sources**
- Standing Bear v. Crook, Federal Cases: https://law.resource.org/pub/us/case/reporter/F.Cas/0025.f.cas/0025.f.cas.0695.pdf
- United States v. Washington (Boldt): https://en.wikipedia.org/wiki/United_States_v._Washington
- Sohappy v. Smith: https://en.wikipedia.org/wiki/Sohappy_v._Smith
- Passamaquoddy v. Morton: https://en.wikipedia.org/wiki/Joint_Tribal_Council_of_the_Passamaquoddy_Tribe_v._Morton
- Mashpee Tribe v. New Seabury: https://en.wikipedia.org/wiki/Mashpee_Tribe_v._New_Seabury_Corp.
- Mashpee trust litigation (DOJ): https://www.justice.gov/opa/blog/justice-departments-successful-defense-lands-trust-case-will-preserve-land-massachusetts
- Cayuga v. Pataki: https://en.wikipedia.org/wiki/Cayuga_Indian_Nation_of_New_York_v._Pataki
- Navajo Nation v. U.S. Forest Service: https://en.wikipedia.org/wiki/Navajo_Nation_v._U.S._Forest_Service
- Sharp v. Murphy: https://en.wikipedia.org/wiki/Sharp_v._Murphy
- Kinzua Dam: https://en.wikipedia.org/wiki/Kinzua_Dam
- Cobell: https://en.wikipedia.org/wiki/Cobell_v._Salazar ; DOI press release: https://www.doi.gov/news/pressreleases/salazar-announces-final-steps-on-cobell-litigation-and-implementation-of-settlement
- Apache Stronghold, cert. denial: https://www.law.cornell.edu/supremecourt/text/24-291
- Mille Lacs v. Madore (8th Cir.): https://cases.justia.com/federal/appellate-courts/ca8/23-1257/23-1257-2025-02-12.pdf ; timeline: https://www.inaajimowin.com/news-blog/timeline-key-moments-in-mille-lacs-reservation-dispute
- Oak Flat 2026: https://www.kjzz.org/tribal-natural-resources/2026-10-02/11-judges-from-9th-circuit-ask-u-s-supreme-court-to-correct-tragic-error-over-apache-holy-site

**Supreme Court docket tracking (Native American Rights Fund / Tribal Supreme Court Project)**
- https://narf.org/nill/bulletins/sct/2025-2026update.html
- https://narf.org/nill/bulletins/sct/2024-2025update.html
- https://narf.org/nill/bulletins/sct/2023-2024update.html
- https://sct.narf.org/updatememos/2026/04-23-2026.pdf
- https://sct.narf.org/updatememos/2025/07-21-2025.pdf
- https://sct.narf.org/termindexes/october2025.html
- https://sct.narf.org/termindexes/october2024.html
- Federal Court Decisions (Tribal Institute list, used only to cross-check names): https://www.tribal-institute.org/lists/supreme.htm
- SCOTUSblog, "The Supreme Court and the Indian nations" (Aug. 2026): https://www.scotusblog.com/2026/08/the-supreme-court-and-the-indian-nations/

## Confidence & Gaps

**Overall confidence: medium.** High for the Supreme Court citations, dates, authors, and holdings listed as `[verified]`; medium for lower-court and special cases; low for 2026 events known only from news reports.

**What `verified` means in the CSV.** For each row marked `verified`, the case name, reporter citation, decision date, and the core holding were confirmed against the cited page. Individual sub-facts that I could not confirm are flagged inline in the same cell with `[from-memory]` (for example, reporter page numbers for 2017-2023 decisions that Justia lists as "U.S. ___", treaty Statutes at Large cites, tribe identifications, and quotations). After the V1 pass (2026-10-16) the rows still tagged `from-memory` are *Cooley* (reporter page unconfirmed) and *Murphy v. Royal* (cite from Wikipedia only); *Arizona v. California* and the Kinzua case were upgraded to `verified`; the row tagged `unverified` is the March-October 2026 Ninth Circuit Oak Flat litigation.

**Known gaps and cautions**
1. **Pin cites and quotations.** Short quotations (for example Marshall's "domestic dependent nations" and the *Kagama* "weakness and helplessness" passage) are from memory. Quotations marked `[verified]` are limited to *Jones v. Meehan*, *Carpenter v. Shaw*, and 25 U.S.C. 71/177 text. The verification agent should confirm others before they are displayed.
2. **U.S. Reports page numbers for 2017-2023.** McGirt 591 U.S. 894; Castro-Huerta 597 U.S. 629; Brackeen 599 U.S. 255; Arizona v. Navajo 599 U.S. 555; Coughlin 599 U.S. 382; Herrera 587 U.S. 329; Cougar Den 586 U.S. 347; Cooley 593 U.S. 345; Chehalis 594 U.S. 338; Ysleta 596 U.S. 685 are believed correct but were not confirmed (Sharp v. Murphy, 591 U.S. 977, and Becerra, 602 U.S. 222, were confirmed).
3. **Vote tallies.** Lac du Flambeau v. Coughlin's tally is flagged as inconsistent in the Justia summary.
4. **Not verified this session:** the reporter cite of the amended Ninth Circuit opinion in *Washington v. United States* (believed 853 F.3d 946) and the Tenth Circuit cite for *Murphy v. Royal*; *Littlefield v. Dept. of Interior*; Judge Boldt's decision date; Standing Bear's decision date; *Kimball v. Callahan*, 493 F.2d 564 (9th Cir. 1974); *United States v. Dion*, 476 U.S. 734 (1986); *Rice v. Cayetano* and similar peripheral cases.
5. **Not reached:** *Pyramid Lake Paiute v. Morton*, *United States v. Adair*, *Nevada v. United States* (water), *Colville v. Walton*, the Alaska cases *Metlakatla Indian Community v. Egan* and *Alaska v. Babbitt*, Hawaiian cases (*Rice v. Cayetano*), *Hooper v. City of Tulsa* and the other post-*McGirt* Oklahoma cases, *Standing Rock Sioux Tribe v. U.S. Army Corps of Engineers* (D.C. Cir. 2021), the Bears Ears litigation (*Hopi Tribe v. Trump* and the Utah cases), *Chilkat*, and most Indian Claims Commission decisions. Indian Claims Commission cases other than the statute itself are not in the dataset.
6. **2026 events.** The Oak Flat Ninth Circuit developments (Mar.-Oct. 2026) rest on news reports (KJZZ, Bloomberg Government headline). No opinion was read. The Bears Ears 2026 proclamations are covered in C2 from news reports; no litigation filing was found, only NARF's announced intent to sue.
7. **Search limit.** The shared WebSearch budget for this turn was exhausted partway through the survey, so a few planned searches were not run (see C2 gaps).
8. **Tribal consultation.** Before publication, consult the nations named here on spelling of their names, on how their cases are summarized (especially the Muscogee (Creek) Nation, Mille Lacs Band, Sioux nations, Haudenosaunee nations, and Western Apache), and on any sacred-place references.
9. **Scope.** The dataset is U.S. federal law. It does not cover state-court or tribal-court decisions, Canadian or international instruments (for example the UN Declaration on the Rights of Indigenous Peoples, 2007), or Hawaiian and Pacific territories' Native claims.
