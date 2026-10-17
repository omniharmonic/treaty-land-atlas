---
title: Treaty Violation Catalog (Narrative, Sourced)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Treaty Violation Catalog (B2)

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

Companion files: `B1-violation-typology.md` (definitions and the controlled `violation_type` vocabulary), `B3-land-returns-and-restitution.md` (returns, acknowledgments, claims), `seed-data/violations-seed.csv` (same entries, machine-readable) and `seed-data/violations-seed-notes.csv` (verification notes per entry).

## 1. How to read this catalog

- **62 entries**, V001-V062, grouped by region and era. Each carries: the treaty or instrument, nations, the year or span of the violation, the **mechanism** (a type code from B1), what was lost, the legal aftermath, related cases, sources and a confidence rating.
- **Precision rule.** "Broken," "abrogated," "diminished," "disestablished," "terminated," "taken" and "unratified" are different legal events (see B1). Where a source does not support the stronger word, the entry uses the weaker one. Some entries are marked **context** (e.g., Dakota Access, Bears Ears, Oak Flat, Hawaii) because they are modern or non-treaty conflicts that the Atlas may want to show but should not label as adjudicated treaty breaches.
- **Counterexamples** are included where a court or Congress vindicated a right (Mille Lacs, Herrera, Boldt, Winans, Menominee restoration, Taos Blue Lake). See B3 for returns.
- **Tags.** `[verified]` means confirmed this session in a source I read; `[verified, tertiary]` means confirmed only in Wikipedia or a news article (a pointer, to be corroborated before publication); `[from-memory]` and `[unverified]` mean not confirmed; `[disputed]` means sources disagree. Source tiers in the lists below: **P** primary (treaty/statute/opinion), **A** authoritative secondary (agency, library, tribal, university), **T** tertiary or journalistic.
- **Tribal voice.** Names follow common federal usage. Where a tribe's own name is known to me but not verified this session it is flagged. Every entry that touches sacred sites, remains or ceremonial landscapes needs tribal consultation before publication (see the Confidence & Gaps section).
- **Confidence** (high / medium / low) is entry-level: high = key facts confirmed in a primary or authoritative source this session; medium = confirmed mainly in secondary or tertiary sources; low = mostly from memory or conflicting sources.


## 2. Summary table

| ID | Case | Nations | Violation | Type (primary) | Conf. |
|---|---|---|---|---|---|
| V001 | Fort Pitt 1778: first U.S.-Indian treaty and the Delaware (Lenape) statehood clause | Delaware (Lenape) | 1778-1866 (serial) | `TREATY_PROMISE_UNFULFILLED` | medium |
| V002 | Hopewell 1785 and Holston 1791: settler intrusion onto Cherokee land | Cherokee | 1785-1791 | `FAILURE_TO_PROTECT` | medium |
| V003 | Fort Stanwix 1784: cession by Haudenosaunee delegates who lacked authority | Haudenosaunee (Six Nations) | 1784-1789 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V004 | Greenville 1795 and Fort Wayne 1809: encroachment, then cession under pressure | Shawnee | 1795-1811 | `FAILURE_TO_PROTECT` | medium |
| V005 | Treaty of St. Louis 1804: cession signed by a delegation with no authority to sell | Sauk (Sac) and Meskwaki (Fox) | 1804-1832 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V006 | Treaty of New Echota (1835) and the Trail of Tears (1838-39) | Cherokee | 1835-1839 | `FRAUD_COERCION_NEGOTIATION` | high |
| V007 | Georgia ignores Worcester v. Georgia (1832): the federal government declines to enforce | Cherokee | 1832-1838 | `FAILURE_TO_PROTECT` | high |
| V008 | Dancing Rabbit Creek 1830: first removal treaty under the Indian Removal Act | Choctaw | 1831-1833 | `FORCED_REMOVAL` | medium |
| V009 | Seminole removal: Payne's Landing (1832), Fort Gibson (1833) and the Second Seminole War | Seminole | 1832-1858 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V010 | Creek (Muscogee) 1866: punitive cession of the western half of the Nation | Muscogee (Creek) Nation | 1866 | `FRAUD_COERCION_NEGOTIATION` | high |
| V011 | Potawatomi Trail of Death (1838) and the disputed Yellow River treaty (1836) | Potawatomi (Menominee band, Twin Lakes) | 1836-1838 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V012 | Treaty of Buffalo Creek (1838): sale of Seneca reservations and the 1842 and 1857 corrections | Seneca Nation (Seneca Nation of Indians) and Tonawanda Ba... | 1838-1842 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V013 | Sandy Lake (1850): removal order and annuity relocation in breach of Ojibwe treaties | Ojibwe (Anishinaabe), Lake Superior and Mississippi bands | 1850 | `FORCED_REMOVAL` | medium |
| V014 | Mille Lacs (1999): Minnesota's denial of 1837 hunting, fishing and gathering rights | Mille Lacs Band of Ojibwe (Chippewa) | 1850-1990s | `HUNTING_FISHING_RIGHTS` | high |
| V015 | Voigt decision (1983): Wisconsin's denial of 1837/1842 treaty rights | Lac Courte Oreilles, Bad River, Red Cliff, Lac du Flambea... | 1970s-1989 | `HUNTING_FISHING_RIGHTS` | low |
| V016 | Menominee termination (1954-1973) | Menominee Indian Tribe of Wisconsin | 1954-1961 | `TERMINATION` | high |
| V017 | Canandaigua 1794 and the Kinzua Dam (1958-1965) | Seneca Nation of Indians (Allegany Reservation) | 1958-1965 | `EMINENT_DOMAIN_INFRASTRUCTURE` | high |
| V018 | Oneida land (New York): 1795 sale without federal approval | Oneida Indian Nation | 1795-2005 | `NON_RATIFICATION` | high |
| V019 | Tuscarora and the Niagara Power Project (1960) | Tuscarora Nation (Haudenosaunee) | 1958-1960 | `EMINENT_DOMAIN_INFRASTRUCTURE` | high |
| V020 | Fort Laramie 1851: Pike's Peak gold rush invades treaty territory | Cheyenne, Arapaho, Lakota (Sioux), Crow, Assiniboine, Gro... | 1858-1861 | `RESOURCE_RUSH_INVASION` | medium |
| V021 | Fort Wise (1861), Sand Creek (1864) and the Little Arkansas reparations (1865) | Southern Cheyenne and Arapaho (Cheyenne and Arapaho Tribe... | 1864-1867 | `TREATY_PROMISE_UNFULFILLED` | high |
| V022 | Medicine Lodge (1867) and Lone Wolf v. Hitchcock (1903): allotment without the promised three-fourths consent | Kiowa, Comanche, Plains Apache (Kiowa-Comanche-Apache Res... | 1892-1903 | `UNILATERAL_ABROGATION_STATUTE` | high |
| V023 | Fort Reno: military reserve carved from the Cheyenne and Arapaho reservation (1883-2026) | Cheyenne and Arapaho Tribes | 1883-2026 | `FEDERAL_RESERVE_CARVE_OUT` | medium |
| V024 | Fort Laramie 1868 and the Black Hills: abrogation by the Act of Feb. 28, 1877 | Lakota (Oglala, Sicangu/Brule, Minneconjou, Hunkpapa, Bla... | 1874-1877 | `UNILATERAL_ABROGATION_STATUTE` | high |
| V025 | Act of March 2, 1889: the Great Sioux Reservation divided and about 9 million acres opened | Lakota and Dakota bands of the Great Sioux Reservation | 1889 | `DIMINISHMENT_DISESTABLISHMENT` | medium |
| V026 | Dakota 1851 treaties, 1862 war and the Act of Feb. 16, 1863 | Dakota (Mdewakanton, Wahpekute, Sisseton, Wahpeton) | 1862-1863 | `UNILATERAL_ABROGATION_STATUTE` | high |
| V027 | Ponca: 1858 treaty, the 1868 land error, 1877 removal and Standing Bear v. Crook (1879) | Ponca (Ponca Tribe of Nebraska | 1868-1881 | `FAILURE_TO_PROTECT` | medium |
| V028 | Garrison Dam (1946-1956): the Fort Berthold Reservation and the Mandan, Hidatsa and Arikara | Mandan, Hidatsa and Arikara (MHA Nation / Three Affiliate... | 1944-1956 | `EMINENT_DOMAIN_INFRASTRUCTURE` | medium |
| V029 | Oahe Dam and Pick-Sloan: Standing Rock, Cheyenne River, Lower Brule and Crow Creek | Standing Rock Sioux, Cheyenne River Sioux, Lower Brule Si... | 1944-1960s | `EMINENT_DOMAIN_INFRASTRUCTURE` | high |
| V030 | Dakota Access Pipeline and Lake Oahe (2016-2026): context, not an adjudicated treaty violation | Standing Rock Sioux Tribe (and allied Oceti Sakowin natio... | 2016-2026 | `CONTEXT_INFRASTRUCTURE_SITING` | medium |
| V031 | Rosebud Sioux Tribe v. Kneip (1977): the 1904 Act diminishes the Rosebud Reservation | Rosebud Sioux Tribe (Sicangu Lakota) | 1904-1910 | `DIMINISHMENT_DISESTABLISHMENT` | high |
| V032 | Lake Traverse Reservation (Sisseton-Wahpeton) and DeCoteau v. District County Court (1975) | Sisseton-Wahpeton Oyate (Dakota) | 1889-1891 | `DIMINISHMENT_DISESTABLISHMENT` | high |
| V033 | Claims that failed: Cheyenne River (Solem v. Bartlett, 1984) and Omaha (Nebraska v. Parker, 2016) were not diminished | Cheyenne River Sioux | 1882; 1908 | `DIMINISHMENT_DISESTABLISHMENT` | high |
| V034 | Crow Tribe and Herrera v. Wyoming (2019): treaty hunting right survives statehood | Crow Tribe (Apsaalooke) | 2014-2019 | `HUNTING_FISHING_RIGHTS` | high |
| V035 | Western Shoshone: Treaty of Ruby Valley (1863) and the ICC payment the Nation refuses | Western Shoshone (Newe) | 1951-2006 | `STATUTORY_EXTINGUISHMENT_SETTLEMENT` | medium |
| V036 | Box Elder (Fort Bridger) 1863: no recognized title, no compensation (Northwestern Shoshone) | Northwestern Bands of Shoshone | 1863-1945 | `UNRECOGNIZED_TITLE` | high |
| V037 | Blackfeet and Glacier National Park: the 1895 agreement and the 1910 park | Blackfeet (Pikuni) Nation | 1895-1935 | `FEDERAL_RESERVE_CARVE_OUT` | medium |
| V038 | Nez Perce: the 1855 reservation, the 1863 'thief treaty,' and 1877 | Nez Perce (Nimiipuu), including the Wallowa and other non... | 1863-1877 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V039 | Ute: the 1868 Colorado reservation, Brunot (1873), the 1880 Act, 1881 removal, and Hagen v. Utah (1994) | Ute (Northern Ute/Uintah and Ouray, Ute Mountain Ute, Sou... | 1873-1905 | `FRAUD_COERCION_NEGOTIATION` | medium |
| V040 | Navajo: the Long Walk and Bosque Redondo (1864-1868), ended by the 1868 treaty | Navajo Nation (Dine) and Mescalero Apache | 1864-1868 | `FORCED_REMOVAL` | medium |
| V041 | Navajo water: the 1868 treaty reserves water but creates no duty to secure it (Arizona v. Navajo Nation, 2023) | Navajo Nation | 2023 | `WATER_RIGHTS` | high |
| V042 | Chiricahua Apache: the 1872 reservation abolished (1876) and 27 years as prisoners of war (1886-1912/14) | Chiricahua Apache (Ndee/Ndé) | 1876-1912 | `FORCED_REMOVAL` | medium |
| V043 | Seminole Nation v. United States (1942): annuities paid to corrupt officials despite treaty duties | Seminole Nation of Oklahoma | 1870-1907 | `ANNUITY_NONPAYMENT_OR_DIVERSION` | high |
| V044 | Curtis Act (1898) and Oklahoma statehood (1907): Five Tribes governments dismantled and lands allotted | Cherokee, Chickasaw, Choctaw, Muscogee (Creek), Seminole ... | 1898-1907 | `UNILATERAL_ABROGATION_STATUTE` | medium |
| V045 | The General Allotment (Dawes) Act of 1887 and the loss of the communal land base | Most reservation tribes outside the Five Tribes at first | 1887-1934 | `ALLOTMENT` | high |
| V046 | Termination policy: House Concurrent Resolution 108 (1953) and Public Law 280 | More than 100 tribes and bands over the period (counts va... | 1953-1970 | `TERMINATION` | high |
| V047 | McGirt v. Oklahoma (2020): the Muscogee (Creek) Reservation was never disestablished | Muscogee (Creek) Nation | 1898-2020 | `DIMINISHMENT_DISESTABLISHMENT` | high |
| V048 | Oklahoma v. Castro-Huerta (2022): concurrent state jurisdiction over non-Indians in Indian country | All tribes with Indian country in states | 2022 | `JURISDICTIONAL_EROSION` | medium |
| V049 | Oak Flat (Chi'chil Bildagoteel): 2014 land exchange, Apache Stronghold litigation and the March 2026 transfer | San Carlos Apache, Tonto Apache and other Western Apache ... | 2014-2026 | `CONTEXT_FEDERAL_LAND_DISPOSAL` | medium |
| V050 | Taos Pueblo and Blue Lake: taken in 1906, returned in 1970 | Taos Pueblo (Red Willow People) | 1906-1970 | `FEDERAL_RESERVE_CARVE_OUT` | high |
| V051 | Treaty of Medicine Creek (1854): small reservations, the Nisqually War, Leschi, and the Puyallup claims | Nisqually, Puyallup, Steilacoom, Squaxin Island and other... | 1854-1990 | `FRAUD_COERCION_NEGOTIATION` | high |
| V052 | Stevens treaty fishing rights: Boldt (1974) and Washington v. Fishing Vessel Ass'n (1979) | Treaty tribes of western Washington, including Nisqually,... | 1900s-1974 | `HUNTING_FISHING_RIGHTS` | high |
| V053 | Yakama treaty rights: Winans (1905) and Cougar Den (2019) | Confederated Tribes and Bands of the Yakama Nation | 1900s-2019 | `HUNTING_FISHING_RIGHTS` | high |
| V054 | California: 18 unratified treaties (1851-52) and the secrecy until 1905 | More than 100 California tribes and bands (Pomo, Miwok, Y... | 1852-1905 | `NON_RATIFICATION` | medium |
| V055 | Siletz and Western Oregon: Coast Reservation reduced, tribes terminated (1954), restored (1977) | Confederated Tribes of Siletz Indians | 1865-1954 | `DIMINISHMENT_DISESTABLISHMENT` | medium |
| V056 | Klamath, Modoc and Yahooskin: the 1864 treaty and termination (1954-1961) | Klamath Tribes (Klamath, Modoc, Yahooskin Band of Snake) | 1954-1986 | `TERMINATION` | medium |
| V057 | Catawba: South Carolina's 1840 Nation Ford treaty, never approved by the United States | Catawba Indian Nation | 1840-1993 | `NON_RATIFICATION` | medium |
| V058 | Maine: state treaties violating the Nonintercourse Act and the 1980 settlement | Passamaquoddy, Penobscot, Houlton Band of Maliseet | 1790s-1980 | `NON_RATIFICATION` | medium |
| V059 | Kaw (Kanza): annuities delayed, sale and removal from Kansas (1873), and Kaw Lake | Kaw Nation (Kanza) | 1825-1960s | `ANNUITY_NONPAYMENT_OR_DIVERSION` | medium |
| V060 | Alaska Native Claims Settlement Act (1971): extinguishment of aboriginal title by statute | Alaska Native peoples (Iñupiat, Yup'ik, Aleut/Unangan, At... | 1971 | `STATUTORY_EXTINGUISHMENT_SETTLEMENT` | high |
| V061 | Hawaii (context): overthrow of the Kingdom (1893), annexation (1898) and the 1993 Apology | Kanaka Maoli (Native Hawaiians) | 1893-1898 | `ANNEXATION_CONTEXT` | medium |
| V062 | Bears Ears National Monument (2016-2026): designation, reductions, restoration and the July 2026 action (context, not a treaty claim) | Hopi Tribe, Navajo Nation, Ute Mountain Ute Tribe, Ute In... | 2017; 2026 | `CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK` | low |

## 3. Entries

### Part I. Early Republic, Southeast and Old Northwest (1778-1840)

#### V001. Fort Pitt 1778: first U.S.-Indian treaty and the Delaware (Lenape) statehood clause

- **Instrument:** Treaty with the Delawares (Fort Pitt) (1778)
- **Nations:** Delaware (Lenape)
- **Region:** Ohio Valley / Mid-Atlantic
- **Violation year/span:** 1778-1866 (serial)
- **Mechanism type(s):** `TREATY_PROMISE_UNFULFILLED; FORCED_REMOVAL`
- **What happened:** Article VI of the 1778 treaty guaranteed the Delawares their territorial rights within earlier boundaries while friendship held, and contemplated a Delaware-headed state with representation in Congress, but only if Congress approved. Congress never approved the state; the guaranteed boundaries were then given up through successive cessions and removals (Greenville 1795, later Ohio/Indiana cessions, and the 1866 Kansas treaty that arranged sale of the Delaware reserve to railroad interests and removal to Indian Territory). Read the statehood clause as a conditional proposal that lapsed, not as a binding promise that was 'broken'; the territorial guarantee is the stronger breach claim.
- **What was lost:** Delaware homelands in the Ohio country, then Indiana, then the Kansas reserve; ultimate relocation to Indian Territory.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** No general Delaware claim of record verified this session. Later Delaware cessions and the 1866 sale terms are documented in the treaty texts.
- **Verification notes:** [verified] Fort Pitt date/parties/Art. VI (7 Stat. 13). [verified] 1866 treaty terms (14 Stat. 793). [unverified] Gnadenhutten (1782) and 1789/1829 Delaware cessions not checked this session. Tribal consultation: Delaware Tribe of Indians and Delaware Nation (Oklahoma) hold the historical voice.
- **Confidence:** medium
- **Sources:**
  - [P] Treaty with the Delawares (Fort Pitt), 7 Stat. 13 (1778) — https://www.govinfo.gov/content/pkg/STATUTE-7/pdf/STATUTE-7-Pg13.pdf
  - [P] Treaty with the Delawares (1866), 14 Stat. 793 — https://www.govinfo.gov/content/pkg/STATUTE-14/pdf/STATUTE-14-Pg793.pdf
  - [T] Wikipedia: Treaty of Greenville — https://en.wikipedia.org/wiki/Treaty_of_Greenville

#### V002. Hopewell 1785 and Holston 1791: settler intrusion onto Cherokee land

- **Instrument:** Treaty of Hopewell (7 Stat. 18); Treaty of Holston (1785; 1791)
- **Nations:** Cherokee
- **Region:** Southeast
- **Violation year/span:** 1785-1791
- **Mechanism type(s):** `FAILURE_TO_PROTECT`
- **What happened:** The 1785 treaty stated 'No citizen of the United States shall settle on Indian lands.' Roughly 3,000 settlers of the unrecognized State of Franklin already occupied Cherokee land between the Holston and French Broad rivers; the Confederation government did not remove them. Franklin made its own treaties with the Cherokee (Dumplin Creek 1785, Coyatee 1786), which the United States did not recognize. The dispute continued until Holston (1791) set a new border.
- **What was lost:** Land between the Holston and French Broad rivers in present-day Tennessee, and a wedge near the Cumberland (Nashville).
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** No court remedy. The boundary was reset by a new treaty (Holston 1791), i.e., the loss was ratified rather than reversed.
- **Verification notes:** [verified, tertiary] Wikipedia summary. [unverified] Holston Stat. cite (believed 7 Stat. 39, from memory).
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of Hopewell — https://en.wikipedia.org/wiki/Treaty_of_Hopewell

#### V003. Fort Stanwix 1784: cession by Haudenosaunee delegates who lacked authority

- **Instrument:** Treaty of Fort Stanwix (1784)
- **Nations:** Haudenosaunee (Six Nations); Seneca, Cayuga, Onondaga, Mohawk, Oneida, Tuscarora
- **Region:** New York / Ohio country
- **Violation year/span:** 1784-1789
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION`
- **What happened:** Signed after the Revolutionary War by Haudenosaunee representatives (Brant left early; Cornerplanter and Aaron Hill signed). The Six Nations council at Buffalo Creek refused to ratify, arguing its delegates had no authority to give away such large tracts, and asked for the deeds back. The United States renewed its claims in the Treaty of Fort Harmar (1789). This is a contested-authority/duress problem, not a statute-based abrogation.
- **What was lost:** Claims to the Ohio country, a strip along the Niagara River, and land west of Buffalo Creek (Pennsylvania 'Last Purchase').
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Treated by the United States as valid; no court remedy. Later Haudenosaunee land claims in New York rest on the Nonintercourse Act rather than on Stanwix (see V018).
- **Verification notes:** [verified, tertiary] Wikipedia. [unverified] 7 Stat. 15 cite (from memory). Haudenosaunee Confederacy is the proper voice on authority and consent questions.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of Fort Stanwix (1784) — https://en.wikipedia.org/wiki/Treaty_of_Fort_Stanwix_(1784)

#### V004. Greenville 1795 and Fort Wayne 1809: encroachment, then cession under pressure

- **Instrument:** Treaty of Greenville (7 Stat. 49); Treaty of Fort Wayne (1795; 1809)
- **Nations:** Shawnee; Wyandot, Delaware, Ottawa, Chippewa, Potawatomi, Miami, Eel River, Wea, Kickapoo, Piankeshaw, Kaskaskia
- **Region:** Old Northwest (Ohio/Indiana)
- **Violation year/span:** 1795-1811
- **Mechanism type(s):** `FAILURE_TO_PROTECT; FRAUD_COERCION_NEGOTIATION`
- **What happened:** Greenville (Aug. 3, 1795; Senate ratified Dec. 22, 1795) ceded about two-thirds of the Ohio country in exchange for annuities. Settlers kept crossing the treaty line, especially in Indiana, and the Army did not enforce it. The 1809 Fort Wayne treaty (Delaware, Potawatomi, Miami, Eel River) pushed the line further; Tecumseh, who had not signed Greenville, rebuilt the confederacy at Prophetstown in response. Fort Wayne's acreage and the claim that Miami/Shawnee interests were bypassed are standard in the literature but were not confirmed in sources read.
- **What was lost:** Ohio (about two-thirds) in 1795; further Indiana land in 1809.
- **Acreage if known:** Fort Wayne 1809 commonly given as roughly 2.5-3 million acres [from-memory; unverified]
- **Legal aftermath:** No claim of record. Military outcome: Tippecanoe (1811), War of 1812.
- **Verification notes:** [verified, tertiary] Greenville facts. [from-memory] Fort Wayne acreage. Shawnee Tribe, Absentee Shawnee, Eastern Shawnee, Miami Nation, Delaware and Potawatomi governments are the voice for this region.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of Greenville — https://en.wikipedia.org/wiki/Treaty_of_Greenville
  - [T] Wikipedia: Treaty of Fort Wayne (1809) — https://en.wikipedia.org/wiki/Treaty_of_Fort_Wayne

#### V005. Treaty of St. Louis 1804: cession signed by a delegation with no authority to sell

- **Instrument:** Treaty of St. Louis (Sauk and Fox) (1804)
- **Nations:** Sauk (Sac) and Meskwaki (Fox)
- **Region:** Upper Mississippi (Illinois/Wisconsin/Missouri)
- **Violation year/span:** 1804-1832
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION`
- **What happened:** Sauk hunters killed four settlers in 1804; a delegation went to St. Louis to resolve the killings (not to sell land). Under William Henry Harrison they signed a cession of a large area between the Mississippi and Illinois rivers, including the Rock River villages, for goods worth $2,234.50 plus a $1,000 annuity. The delegation lacked authority under Sauk and Meskwaki custom; Black Hawk wrote the delegates were drunk much of the time. Portage des Sioux (1815) upheld the treaty; Black Hawk's resistance became the 1832 Black Hawk War.
- **What was lost:** Rock River valley and a large area of NW Illinois, S Wisconsin and NE Missouri.
- **Acreage if known:** 'about 51 million acres' appears in the literature [from-memory; not in source read]
- **Legal aftermath:** No remedy; Sauk and Fox later removed west. Tribal governments: Sac & Fox Nation, Sac & Fox Tribe of the Mississippi in Iowa (Meskwaki), Sac & Fox of Missouri.
- **Verification notes:** [verified, tertiary] signers' authority, payment, aftermath. [from-memory] 7 Stat. 84; acreage.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of St. Louis (1804) — https://en.wikipedia.org/wiki/Treaty_of_St._Louis_(1804)

#### V006. Treaty of New Echota (1835) and the Trail of Tears (1838-39)

- **Instrument:** Treaty with the Cherokee (New Echota) (1835)
- **Nations:** Cherokee
- **Region:** Southeast to Indian Territory
- **Violation year/span:** 1835-1839
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; FORCED_REMOVAL`
- **What happened:** Signed Dec. 29, 1835 by a minority 'Treaty Party' (Major Ridge, Elias Boudinot, John Ridge) without authorization from the Cherokee government under Principal Chief John Ross. Ross presented petitions against it with thousands of Cherokee names (sources give 13,000 to almost 16,000; one National Archives-linked item counts 3,352 signatures on one petition). The Senate ratified in May 1836 by a single vote; proclaimed May 23, 1836 (7 Stat. 478). General Winfield Scott began enforcing removal in May 1838 with about 7,000 troops and militia. Removal ran Oct. 1838-Mar. 1839. Article 7 promised a Cherokee delegate in the House 'once Congress makes provision'; no delegate has been seated.
- **What was lost:** All Cherokee lands east of the Mississippi for $5 million, in exchange for land in Indian Territory (the treaty also adds a tract estimated at 800,000 acres).
- **Acreage if known:** Cession had no stated acreage; Georgia/Tennessee/Alabama/North Carolina homeland. West: 7 million acres plus 800,000-acre tract (per treaty).
- **Legal aftermath:** Cherokee Nation v. Georgia (1831); Worcester v. Georgia (1832) held Georgia's laws void in Cherokee territory. Death toll estimates: about 4,000 (most cited; Elizur Butler), range 2,000-6,000 (secondary). Cherokee Nation (2019-) has pressed Article 7 delegate seat (Kimberly Teehee); outcome beyond 2022 not verified.
- **Related cases:** Cherokee Nation v. Georgia, 30 U.S. (5 Pet.) 1 (1831); Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832)
- **Verification notes:** [verified] treaty date/Stat cite/Art. 1, 2, 7 (OSU Kappler). [verified] Senate margin of one vote (several sources; exact tally 31-15 is [from-memory]). [disputed] petition signature counts and death tolls. [unverified] current status of the Art. 7 delegate. Cherokee Nation, United Keetoowah Band and Eastern Band of Cherokee Indians each hold distinct histories of removal.
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Cherokee, 1835 (New Echota), 7 Stat. 478 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-cherokee-1835-0439
  - [T] Wikipedia: Treaty of New Echota — https://en.wikipedia.org/wiki/Treaty_of_New_Echota
  - [T] Wikipedia: Cherokee removal — https://en.wikipedia.org/wiki/Cherokee_removal
  - [A] NCpedia: Trail of Tears — https://www.ncpedia.org/cherokee/trailoftears
  - [A] DocsTeach (National Archives Foundation): Petition against the Treaty of New Echota — https://docsteach.org/lesson/analyzing-the-petition-against-the-treaty-of-new-echota/
  - [P] Cherokee Nation v. Georgia, 30 U.S. (5 Pet.) 1 (1831) — https://supreme.justia.com/cases/federal/us/30/1/
  - [P] Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832) — https://supreme.justia.com/cases/federal/us/31/515/

#### V007. Georgia ignores Worcester v. Georgia (1832): the federal government declines to enforce

- **Instrument:** Treaties of Hopewell (1785) and Holston (1791) as read in Worcester (1785; 1791; 1832 ruling)
- **Nations:** Cherokee
- **Region:** Southeast
- **Violation year/span:** 1832-1838
- **Mechanism type(s):** `FAILURE_TO_PROTECT`
- **What happened:** After Georgia extended its laws over the Cherokee Nation (1828-30, following the discovery of gold near Dahlonega in 1828), the Supreme Court held in Worcester (Mar. 3, 1832) that Georgia's laws had no force in Cherokee territory and that missionary Samuel Worcester's conviction was void. The executive branch did not enforce the decision. The remark attributed to Andrew Jackson ('John Marshall has made his decision; now let him enforce it') is probably apocryphal.
- **What was lost:** Practical protection of the Cherokee Nation's territorial integrity; precondition for the New Echota minority treaty (V006) and removal.
- **Acreage if known:** n/a
- **Legal aftermath:** Worcester remains good law on the point that states lack authority in Indian country absent federal consent, but its force was narrowed in Oklahoma v. Castro-Huerta (2022); see V048.
- **Related cases:** Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832); Oklahoma v. Castro-Huerta, 597 U.S. ___ (2022)
- **Verification notes:** [verified] Worcester holding and date. [verified, tertiary] gold 1828, apocryphal quote note. [from-memory] timing of Georgia laws 1828-30.
- **Confidence:** high
- **Sources:**
  - [P] Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832) — https://supreme.justia.com/cases/federal/us/31/515/
  - [T] Wikipedia: Cherokee removal — https://en.wikipedia.org/wiki/Cherokee_removal
  - [P] Oklahoma v. Castro-Huerta, 597 U.S. ___ (2022) — https://supreme.justia.com/cases/federal/us/597/21-429/

#### V008. Dancing Rabbit Creek 1830: first removal treaty under the Indian Removal Act

- **Instrument:** Treaty of Dancing Rabbit Creek (1830)
- **Nations:** Choctaw
- **Region:** Southeast (Mississippi) to Indian Territory
- **Violation year/span:** 1831-1833
- **Mechanism type(s):** `FORCED_REMOVAL; FAILURE_TO_PROTECT`
- **What happened:** Concluded Sept. 27, 1830 (7 Stat. 333), proclaimed Feb. 24, 1831. The Choctaw ceded about 11 million acres of Mississippi for about 15 million acres in Indian Territory. Article 14 offered 640-acre allotments (and smaller amounts for children) to heads of family who stayed and accepted U.S. citizenship. About 15,000 Choctaw plus roughly 1,000 enslaved people were moved in three migrations (1831-33); about 2,500 died. Those who stayed (5,000-6,000) faced years of legal conflict, harassment and intimidation; the Article 14 promise did not protect their land in practice.
- **What was lost:** About 11 million acres in Mississippi.
- **Acreage if known:** about 11 million acres ceded; about 15 million received in the West
- **Legal aftermath:** Mississippi Band of Choctaw Indians reorganized and gained federal recognition in 1945. The Choctaw Nation in Oklahoma lost its government under the Curtis Act (1898); see V044.
- **Verification notes:** [verified, tertiary] Wikipedia facts. [from-memory] Choctaw claims litigation (Choctaw Nation v. United States) not checked. Choctaw Nation of Oklahoma and Mississippi Band of Choctaw Indians are the tribal voices.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of Dancing Rabbit Creek — https://en.wikipedia.org/wiki/Treaty_of_Dancing_Rabbit_Creek
  - [P] Indian Removal Act, 4 Stat. 411 (May 28, 1830) — https://www.govinfo.gov/content/pkg/STATUTE-4/pdf/STATUTE-4-Pg411.pdf

#### V009. Seminole removal: Payne's Landing (1832), Fort Gibson (1833) and the Second Seminole War

- **Instrument:** Treaty of Payne's Landing (7 Stat. 368); Moultrie Creek (1823) (1823; 1832; 1833)
- **Nations:** Seminole
- **Region:** Florida to Indian Territory
- **Violation year/span:** 1832-1858
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; FORCED_REMOVAL`
- **What happened:** Moultrie Creek (1823) gave the Seminole a central Florida reservation with guaranteed U.S. services for 20 years. Payne's Landing (May 9, 1832) said the Seminole would move west if the land proved suitable, within three years; the Senate ratified in April 1834. In March 1833 seven inspecting chiefs signed a statement at Fort Gibson accepting western land; most chiefs later repudiated it as unauthorized or coerced, and five leading chiefs including Micanopy had refused removal. The Second Seminole War (1835-42) followed; by 1842, 3,612 Seminole had relocated; 350-500 remained in Florida, and a Third Seminole War (1855-58) pressed most of the rest west. No peace treaty ended the Second War.
- **What was lost:** Florida reservation lands; population divided between Indian Territory and Florida.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Seminole Nation v. United States (1942) imposed strict fiduciary standards on payments to the Nation (see V043). Seminole Tribe of Florida regards the wars as one continuous conflict (secondary).
- **Related cases:** Seminole Nation v. United States, 316 U.S. 286 (1942)
- **Verification notes:** [verified, tertiary] dates, numbers. [unverified] ICC/Court of Claims land-claim awards to Seminole (believed 1976 settlement; not checked). Seminole Nation of Oklahoma, Seminole Tribe of Florida and Miccosukee Tribe have separate histories.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of Payne's Landing — https://en.wikipedia.org/wiki/Treaty_of_Payne%27s_Landing
  - [T] Wikipedia: Seminole Wars — https://en.wikipedia.org/wiki/Seminole_Wars
  - [P] Seminole Nation v. United States, 316 U.S. 286 (1942) — https://supreme.justia.com/cases/federal/us/316/286/

#### V010. Creek (Muscogee) 1866: punitive cession of the western half of the Nation

- **Instrument:** Treaty with the Creeks (14 Stat. 785) (1866)
- **Nations:** Muscogee (Creek) Nation
- **Region:** Indian Territory
- **Violation year/span:** 1866
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION`
- **What happened:** Concluded June 14, 1866; ratified July 19; proclaimed Aug. 11. The preamble recites that the Creek treaty with the Confederate States (1861) left the Nation liable to forfeit benefits under earlier U.S. treaties. Article 3 required the Creeks to cede 'the west half of their entire domain,' estimated at 3,250,560 acres priced at 30 cents per acre ($975,168), to settle other Indians as the U.S. chose. This is a coerced cession imposed as a condition of restored relations (similar terms were imposed on the Seminole, Cherokee, Choctaw and Chickasaw in 1866).
- **What was lost:** West half of the Creek domain.
- **Acreage if known:** 3,250,560 acres (per treaty)
- **Legal aftermath:** The remaining Creek land is the territory at issue in McGirt (2020), where the Court read the 1866 treaty as 'forever set apart' land and held the reservation never disestablished (see V047).
- **Related cases:** McGirt v. Oklahoma, 591 U.S. ___ (2020)
- **Verification notes:** [verified] treaty terms and cite. [from-memory] parallel 1866 treaties with the other Five Tribes were not individually read. Muscogee (Creek) Nation uses Mvskoke as its own name [from-memory].
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Creeks, 1866, 14 Stat. 785 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-creeks-1866-0931
  - [P] McGirt v. Oklahoma, 591 U.S. ___ (2020) — https://supreme.justia.com/cases/federal/us/591/18-9526/

#### V011. Potawatomi Trail of Death (1838) and the disputed Yellow River treaty (1836)

- **Instrument:** Treaty of Yellow River (1836); Treaty of Tippecanoe (1832) (1832; 1836)
- **Nations:** Potawatomi (Menominee band, Twin Lakes)
- **Region:** Indiana to Kansas
- **Violation year/span:** 1836-1838
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; FORCED_REMOVAL`
- **What happened:** The 1832 Tippecanoe treaty reserved 22 sections (14,080 acres) for Chief Menominee and associated bands. The Aug. 5, 1836 Yellow River treaty ceded the reserve and required removal within two years; Menominee and 17 band members refused to recognize it and protested forged signatures. On Aug. 30, 1838, Gen. John Tipton's volunteer militia surrounded the Twin Lakes village after a council call. The march began Sept. 4 with 859 people and ran about 660 miles in 61 days to near Osawatomie, Kansas; 42 died, 28 of them children.
- **What was lost:** Reserve of 14,080 acres in Indiana and the Twin Lakes village.
- **Acreage if known:** 14,080 acres (reserve)
- **Legal aftermath:** No remedy located. Potawatomi nations (Citizen Potawatomi, Prairie Band, Forest County, Pokagon, Hannahville, Match-e-be-nash-she-wish) hold the remembrance.
- **Verification notes:** [verified, tertiary] Wikipedia. [unverified] Treaty of Chicago (1833, 7 Stat. 431) background not checked.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Potawatomi Trail of Death — https://en.wikipedia.org/wiki/Potawatomi_Trail_of_Death

#### V012. Treaty of Buffalo Creek (1838): sale of Seneca reservations and the 1842 and 1857 corrections

- **Instrument:** Treaty of Buffalo Creek (1838); Treaty with the Seneca (1842); Treaty with the Tonawanda Band (1857) (1838; 1842; 1857)
- **Nations:** Seneca Nation (Seneca Nation of Indians) and Tonawanda Band of Seneca; other New York nations
- **Region:** New York
- **Violation year/span:** 1838-1842
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; FORCED_REMOVAL`
- **What happened:** The Jan. 15, 1838 treaty, signed by the U.S. and nine New York nations as part of the removal program, acknowledged that the Ogden Land Company would buy the four remaining Seneca reservations in New York, with proceeds to fund removal to Kansas Territory. The Tonawanda Seneca said they were not consulted and that their chiefs did not sign; they refused to leave. A 1842 treaty modified the 1838 agreement: the Ogden Company had bought only two reservations (including Tonawanda), and the Seneca kept Cattaraugus and Allegany. In 1857 the Tonawanda Band's separate treaty let it use its share of the earlier sale to repurchase most of its reservation.
- **What was lost:** Buffalo Creek reservation (and, until 1857, most of Tonawanda). Allegany and Cattaraugus retained.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Corrected only by new treaties (1842, 1857). Widely reported allegations of bribery and forged consent, and the Senate's narrow ratification margin, were not confirmed in sources read.
- **Verification notes:** [verified, tertiary] dates/sequence. [from-memory/unverified] bribery allegations, Quaker role, Senate margin, 7 Stat. 550 cite. Tonawanda Seneca Nation and Seneca Nation of Indians are the tribal voices.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Tonawanda Band of Seneca — https://en.wikipedia.org/wiki/Tonawanda_Band_of_Seneca
  - [T] Wikipedia: Treaties of Buffalo Creek — https://en.wikipedia.org/wiki/Treaty_of_Buffalo_Creek

### Part II. Great Lakes (Ojibwe and Menominee)

#### V013. Sandy Lake (1850): removal order and annuity relocation in breach of Ojibwe treaties

- **Instrument:** Treaty with the Chippewa (1837, 7 Stat. 536); 1842 treaty (1837; 1842)
- **Nations:** Ojibwe (Anishinaabe), Lake Superior and Mississippi bands
- **Region:** Minnesota / Wisconsin
- **Violation year/span:** 1850
- **Mechanism type(s):** `FORCED_REMOVAL; ANNUITY_NONPAYMENT`
- **What happened:** Taylor-administration and Minnesota Territory officials (Ewing, Brown, Ramsey, Watrous) sought to move several Ojibwe bands west of the Mississippi. The fall annuity payment was moved from La Pointe, Wisconsin, to Sandy Lake, Minnesota, to strand the bands through winter. Nearly 3,000 men waited weeks; only part of the payment arrived and much food had spoiled. About 150 died at Sandy Lake and 200 to 230 more on the way home; about 400 total (roughly 12% of the people per one source). Chief Buffalo of La Pointe lobbied President Fillmore to cancel the order, leading to the 1854 treaty and permanent reservations. Article 5 of the 1837 treaty protected hunting, fishing and wild-rice gathering 'during the pleasure of the President'.
- **What was lost:** Lives; security of residence in ceded territory; leverage that was converted into the 1854 reservation system.
- **Acreage if known:** n/a
- **Legal aftermath:** The 1850 order's treaty-rights revocation was held ineffective in Mille Lacs (1999), see V014. No compensation for the Sandy Lake deaths located.
- **Related cases:** Minnesota v. Mille Lacs Band, 526 U.S. 172 (1999)
- **Verification notes:** [verified] 1837 Art. 5 text, 1854 treaty terms (primary). [verified, tertiary] Sandy Lake facts. Ojibwe bands (Mille Lacs, Bad River, Red Cliff, Lac Courte Oreilles, Lac du Flambeau, Fond du Lac, others) hold the history.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Sandy Lake Tragedy — https://en.wikipedia.org/wiki/Sandy_Lake_Tragedy
  - [P] Treaty with the Chippewa (1837), 7 Stat. 536 — https://www.govinfo.gov/content/pkg/STATUTE-7/pdf/STATUTE-7-Pg536.pdf
  - [P] Treaty with the Chippewa (1854), 10 Stat. 1109 — https://www.govinfo.gov/content/pkg/STATUTE-10/pdf/STATUTE-10-Pg1109.pdf
  - [P] Minnesota v. Mille Lacs Band of Chippewa Indians, 526 U.S. 172 (1999) — https://supreme.justia.com/cases/federal/us/526/172/

#### V014. Mille Lacs (1999): Minnesota's denial of 1837 hunting, fishing and gathering rights

- **Instrument:** Treaty with the Chippewa (1837), 7 Stat. 536 (1837)
- **Nations:** Mille Lacs Band of Ojibwe (Chippewa)
- **Region:** Minnesota
- **Violation year/span:** 1850-1990s
- **Mechanism type(s):** `HUNTING_FISHING_RIGHTS`
- **What happened:** The 1837 treaty ceded land but kept the 'privilege of hunting, fishing, and gathering the wild rice' on ceded land 'during the pleasure of the President.' An 1850 executive order attempted to revoke the privilege and order removal; the 1855 treaty ceded more land but did not mention the rights; Minnesota became a state in 1858. Minnesota argued each ended the rights. The Supreme Court (5-4, O'Connor) held the 1850 order ineffective (the removal portion lacked legal authority and was not severable), the 1855 treaty did not abrogate the rights, and statehood did not extinguish them.
- **What was lost:** (Recovered, not lost) Rights had been denied in practice by state regulation until the ruling.
- **Acreage if known:** n/a
- **Legal aftermath:** Rights confirmed. Counterexample of treaty-rights vindication; shows that abrogation requires clear congressional intent.
- **Related cases:** Minnesota v. Mille Lacs Band of Chippewa Indians, 526 U.S. 172 (1999); Herrera v. Wyoming, 587 U.S. ___ (2019)
- **Verification notes:** [verified] holding, vote, date. [verified] 1837 Art. 5. 1842 treaty (7 Stat. 591) cited by GLIFWC page.
- **Confidence:** high
- **Sources:**
  - [P] Minnesota v. Mille Lacs Band of Chippewa Indians, 526 U.S. 172 (1999) — https://supreme.justia.com/cases/federal/us/526/172/
  - [P] Treaty with the Chippewa (1837), 7 Stat. 536 — https://www.govinfo.gov/content/pkg/STATUTE-7/pdf/STATUTE-7-Pg536.pdf
  - [T] Wikipedia: Great Lakes Indian Fish and Wildlife Commission — https://en.wikipedia.org/wiki/Great_Lakes_Indian_Fish_and_Wildlife_Commission

#### V015. Voigt decision (1983): Wisconsin's denial of 1837/1842 treaty rights

- **Instrument:** Treaties of 1837 (7 Stat. 536), 1842 (7 Stat. 591), 1854 (10 Stat. 1109) (1837; 1842; 1854)
- **Nations:** Lac Courte Oreilles, Bad River, Red Cliff, Lac du Flambeau, St. Croix, Sokaogon (Mole Lake) Ojibwe
- **Region:** Wisconsin
- **Violation year/span:** 1970s-1989
- **Mechanism type(s):** `HUNTING_FISHING_RIGHTS`
- **What happened:** Wisconsin prosecuted Ojibwe members for off-reservation fishing and hunting in ceded territory. Lac Courte Oreilles v. Voigt (7th Cir. 1983) is the leading decision that the 1837 and 1842 treaties preserved those rights; spearfishing disputes escalated through 1989. GLIFWC (created 1984) co-manages the treaty-ceded territories for 11 Ojibwe nations.
- **What was lost:** (Rights asserted and later confirmed.)
- **Acreage if known:** n/a
- **Legal aftermath:** Rights confirmed; GLIFWC established 1984.
- **Related cases:** Lac Courte Oreilles Band v. Voigt, 700 F.2d 341 (7th Cir. 1983) [from-memory citation]
- **Verification notes:** [from-memory] Voigt citation and holding; only GLIFWC's treaty list and 1984 founding were verified. Needs primary-source check (7th Cir. opinion).
- **Confidence:** low
- **Sources:**
  - [T] Wikipedia: Great Lakes Indian Fish and Wildlife Commission — https://en.wikipedia.org/wiki/Great_Lakes_Indian_Fish_and_Wildlife_Commission

#### V016. Menominee termination (1954-1973)

- **Instrument:** Treaty of Wolf River (1854) (1854)
- **Nations:** Menominee Indian Tribe of Wisconsin
- **Region:** Wisconsin
- **Violation year/span:** 1954-1961
- **Mechanism type(s):** `TERMINATION`
- **What happened:** The 1854 treaty assigned the Menominee a Wolf River reservation (432 sq mi per one source; about 235,000 acres per an 1870 assessment). The Menominee Termination Act (Pub. L. 399, 68 Stat. 250, 1954) provided for a per capita distribution of tribal funds and 'orderly termination of Federal supervision.' Termination took effect April 30, 1961; the reservation became Menominee County. A 1968 Supreme Court decision (Menominee Tribe v. United States) held that treaty hunting and fishing rights survived termination because Congress did not clearly abrogate them. After organizing by DRUMS (1970), the Menominee Restoration Act (Pub. L. 93-197, 87 Stat. 770, Dec. 22, 1973) restored federal recognition; the reservation was re-established in 1975.
- **What was lost:** Federal recognition and trust status (1961-1973); county-form governance; enterprise and land-sale pressures.
- **Acreage if known:** about 235,000 acres (1870 figure)
- **Legal aftermath:** Menominee Tribe v. United States (1968) preserved treaty hunting/fishing rights; Restoration Act 1973. One of the few full restorations of land and status.
- **Related cases:** Menominee Tribe of Indians v. United States, 391 U.S. 404 (1968)
- **Verification notes:** [verified] Acts, case, dates. [verified, tertiary] acreage figures. Treaty Stat. cite (believed 10 Stat. 1064) [from-memory].
- **Confidence:** high
- **Sources:**
  - [P] Menominee Termination Act, 68 Stat. 250 (1954) — https://www.govinfo.gov/content/pkg/STATUTE-68/pdf/STATUTE-68-Pg250.pdf
  - [P] Menominee Restoration Act, Pub. L. 93-197, 87 Stat. 770 (Dec. 22, 1973) — https://www.govinfo.gov/content/pkg/STATUTE-87/pdf/STATUTE-87-Pg770.pdf
  - [P] Menominee Tribe v. United States, 391 U.S. 404 (1968) — https://supreme.justia.com/cases/federal/us/391/404/
  - [T] Wikipedia: Menominee Indian Tribe of Wisconsin — https://en.wikipedia.org/wiki/Menominee_Indian_Tribe_of_Wisconsin
  - [A] National Archives: Termination (HCR 108, PL 280) — https://www.archives.gov/research/native-americans/termination

### Part III. Haudenosaunee and New York

#### V017. Canandaigua 1794 and the Kinzua Dam (1958-1965)

- **Instrument:** Treaty with the Six Nations (Canandaigua), 7 Stat. 44 (1794)
- **Nations:** Seneca Nation of Indians (Allegany Reservation); Haudenosaunee
- **Region:** New York / Pennsylvania
- **Violation year/span:** 1958-1965
- **Mechanism type(s):** `EMINENT_DOMAIN_INFRASTRUCTURE`
- **What happened:** Article 3 of the treaty (concluded Nov. 11, 1794; proclaimed Jan. 21, 1795) acknowledged Seneca land and says the United States 'will never claim the same,' for the Seneca's 'free use and enjoyment.' Congress authorized the Allegheny Reservoir/Kinzua Dam under Flood Control Acts of 1936 and 1938 and appropriated for it in 1957. The Seneca challenged it as a violation of the 1794 treaty; the D.C. Circuit (Nov. 25, 1958) held Congress may authorize a taking of treaty-protected land by eminent domain if it clearly shows that intent, and found it had. The Corps broke ground Oct. 22, 1960; the dam was completed in 1965, filling to 1967. About 10,000 acres (nearly a third of the Allegany Reservation) were flooded and about 600 Seneca were relocated; hundreds of graves were exhumed. An alternative design by engineer Arthur E. Morgan was rejected by the Corps. A 1964 act provided relocation and rehabilitation funds.
- **What was lost:** About 10,000 acres of the Allegany Reservation, nine communities.
- **Acreage if known:** about 10,000 acres; about 600 people (some sources say more than 600 families)
- **Legal aftermath:** No injunction. Compensation by a 1964 act (amount not confirmed this session; commonly reported as $15 million [from-memory]). In March 2026 the Seneca Nation and the Army Corps signed a consultation MOU as the Corps studies dam safety modifications.
- **Related cases:** Seneca Nation of Indians v. Brucker, 262 F.2d 27 (D.C. Cir. 1958), cert. denied (1959) [from-memory on cert]
- **Verification notes:** [verified] treaty text, appellate holding. [verified, tertiary] acres/people; [disputed] 'more than 600 families' vs about 600 people. [from-memory] 1964 act amount and Public Law number. [disputed] OSU footnote suggests the Senate may never have ratified Canandaigua; later practice has treated it as binding. Seneca Nation voice: SNI News 2026.
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Six Nations, 1794 (Canandaigua), 7 Stat. 44 -- OSU Tribal Treaties Database — https://treaties.okstate.edu/treaties/treaty-with-the-six-nations-1794-0034
  - [P] Seneca Nation of Indians v. Brucker, 262 F.2d 27 (D.C. Cir. 1958) — https://law.resource.org/pub/us/case/reporter/F2/262/262.F2d.27.14488.html
  - [T] Wikipedia: Kinzua Dam — https://en.wikipedia.org/wiki/Kinzua_Dam
  - [T] Environmental Health News: Kinzua Dam and the Seneca people — https://www.ehn.org/seneca-nation-kinzua-dam-2644943791.html
  - [A] Seneca Nation of Indians news (SNI News), Mar. 13, 2026: Beyond the Betrayal — http://sninews.org/2026/03/13/beyond-the-betrayal/

#### V018. Oneida land (New York): 1795 sale without federal approval

- **Instrument:** Treaty of Fort Stanwix (1784), Treaty of Canandaigua (1794), Nonintercourse Act (1790/1793/1834) (1784; 1794)
- **Nations:** Oneida Indian Nation; Haudenosaunee
- **Region:** New York
- **Violation year/span:** 1795-2005
- **Mechanism type(s):** `NON_RATIFICATION; FAILURE_TO_PROTECT`
- **What happened:** New York began its own treaties with the Oneida, Tuscarora, Onondaga and Cayuga less than a year after the 1784 Fort Stanwix treaty, arguing it could do so because they lived within the state. The Nonintercourse Act barred sales of Indian land to states or individuals without federal approval. The Court held in County of Oneida v. Oneida Indian Nation (1985) that the Oneida had a federal common-law right to sue over the 1795 conveyance and that no state statute of limitations applied. In City of Sherrill v. Oneida Indian Nation (2005), 8-1, the Court held that the Nation could not revive sovereignty over parcels it had repurchased on the open market, citing laches, acquiescence and impossibility, and pointed to the trust-acquisition process.
- **What was lost:** Most of the Oneida homeland in central New York; sovereignty over reacquired parcels (Sherrill).
- **Acreage if known:** not stated in sources read (reservation was once millions of acres; unverified)
- **Legal aftermath:** Liability for the 1795 sale confirmed (1985); remedies narrowed by Sherrill (2005). Land claims in New York are now largely settled or settlement-driven; details not verified this session.
- **Related cases:** County of Oneida v. Oneida Indian Nation, 470 U.S. 226 (1985); City of Sherrill v. Oneida Indian Nation, 544 U.S. 197 (2005)
- **Verification notes:** [verified] holdings and dates. [verified] NPS summary. Acreage and 2010-era settlements [unverified].
- **Confidence:** high
- **Sources:**
  - [P] County of Oneida v. Oneida Indian Nation, 470 U.S. 226 (1985) — https://supreme.justia.com/cases/federal/us/470/226/
  - [P] City of Sherrill v. Oneida Indian Nation, 544 U.S. 197 (2005) — https://supreme.justia.com/cases/federal/us/544/197/
  - [A] NPS: State of New York treaties and land transactions with the Oneida, Onondaga, and Cayuga — https://www.nps.gov/articles/000/state-of-new-york-treaties-and-land-transactions-with-the-oneida-onondaga-and-cayuga.htm
  - [P] 25 U.S.C. 177 (Nonintercourse Act) -- Cornell LII — https://www.law.cornell.edu/uscode/text/25/177

#### V019. Tuscarora and the Niagara Power Project (1960)

- **Instrument:** Treaty of Canandaigua (1794) invoked; Tuscarora title held in fee (1794)
- **Nations:** Tuscarora Nation (Haudenosaunee)
- **Region:** New York
- **Violation year/span:** 1958-1960
- **Mechanism type(s):** `EMINENT_DOMAIN_INFRASTRUCTURE`
- **What happened:** The Federal Power Commission licensed New York's Power Authority to build the Niagara reservoir, which required Tuscarora land. The Supreme Court (Mar. 7, 1960) held that land owned in fee simple by the Nation is not a 'reservation' under the Federal Power Act because the United States holds no interest in it, and that Section 21 of the Act lets licensees condemn Indian-owned land with just compensation; neither 25 U.S.C. 177 nor any treaty barred the taking. Three Justices dissented (Black, Warren, Douglas).
- **What was lost:** Tuscarora land taken for the reservoir.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Takings upheld with compensation. Shows how the form of title (fee vs. trust) and licensee condemnation authority can defeat treaty arguments.
- **Related cases:** Federal Power Commission v. Tuscarora Indian Nation, 362 U.S. 99 (1960)
- **Verification notes:** [verified] holding. Acreage taken [unverified; commonly reported as about 1,383 acres, from-memory].
- **Confidence:** high
- **Sources:**
  - [P] Federal Power Commission v. Tuscarora Indian Nation, 362 U.S. 99 (1960) — https://supreme.justia.com/cases/federal/us/362/99/

### Part IV. Plains and Northern Rockies

#### V020. Fort Laramie 1851: Pike's Peak gold rush invades treaty territory

- **Instrument:** Treaty of Fort Laramie (Horse Creek), 11 Stat. 749 (1851)
- **Nations:** Cheyenne, Arapaho, Lakota (Sioux), Crow, Assiniboine, Gros Ventre, Mandan, Hidatsa, Arikara
- **Region:** Central Plains (Colorado/Wyoming/Nebraska)
- **Violation year/span:** 1858-1861
- **Mechanism type(s):** `RESOURCE_RUSH_INVASION; FAILURE_TO_PROTECT`
- **What happened:** Signed Sept. 17, 1851 at Horse Creek, near Fort Laramie. In Article 3 the United States agreed to protect the nations against depredations by U.S. citizens; Article 5 set each nation's territory (the Cheyenne and Arapaho held a shared area south of the North Platte, mainly in present Wyoming and Colorado). The Senate ratified with an amendment cutting the annuity term (Article 7) from fifty years to ten. The 1858 Pike's Peak gold rush brought miners and settlers into Colorado over tribal protests, and the government did not enforce the treaty. Denver was founded in that territory. The Cheyenne and Arapaho were then pressed into the Fort Wise cession (V021).
- **What was lost:** Cheyenne-Arapaho treaty territory in Colorado.
- **Acreage if known:** not stated in sources read (an unverified secondary figure of nearly 12 million acres across five states exists for the whole treaty)
- **Legal aftermath:** No contemporaneous remedy. 1868 Fort Laramie (V024) later redrew boundaries for the Lakota.
- **Verification notes:** [verified] treaty articles, date, amendment (OSU Kappler). [verified, tertiary] gold rush non-enforcement. Crow did not assent to the Senate amendment per OSU note.
- **Confidence:** medium
- **Sources:**
  - [P] Treaty of Fort Laramie with Sioux, etc., 1851, 11 Stat. 749 -- OSU — https://treaties.okstate.edu/treaties/treaty-of-fort-laramie-with-sioux-etc-1851-0594
  - [T] Wikipedia: Fort Laramie Treaty of 1851 — https://en.wikipedia.org/wiki/Fort_Laramie_Treaty_of_1851

#### V021. Fort Wise (1861), Sand Creek (1864) and the Little Arkansas reparations (1865)

- **Instrument:** Treaty of Fort Wise, 12 Stat. 1163; Treaty of the Little Arkansas, 14 Stat. 703 (1861; 1865)
- **Nations:** Southern Cheyenne and Arapaho (Cheyenne and Arapaho Tribes of Oklahoma); Northern Cheyenne descendants
- **Region:** Colorado / Kansas / Oklahoma
- **Violation year/span:** 1864-1867
- **Mechanism type(s):** `TREATY_PROMISE_UNFULFILLED; FAILURE_TO_PROTECT; FRAUD_COERCION_NEGOTIATION`
- **What happened:** Fort Wise (signed Feb. 18, 1861; ratified with amendment; proclaimed Dec. 5, 1861) ceded most of the 1851 treaty lands except a reserve on the Arkansas, with $450,000 in annuities over 15 years; Wikipedia states the treaty never had the approval of the Council of 44 (disputed authority). On Nov. 29, 1864, Col. John Chivington's Colorado volunteers attacked a Cheyenne and Arapaho village at Sand Creek; estimates run 70 to over 600 killed, most commonly about 150, about two-thirds women and children. Two military inquiries and a congressional joint committee condemned Chivington; no one was prosecuted. In the Little Arkansas treaty (Oct. 14, 1865), Article VI condemned the attack and promised 320 acres each to four chiefs and 160 acres to each widowed or orphaned person from those bands, plus compensation for property destroyed. The Senate struck Chivington's name. Wikipedia reports the United States abrogated the treaty within two years and ignored its major provisions; the Medicine Lodge treaty (1867) cut reservation lands by about 90 percent.
- **What was lost:** Treaty territory in Colorado (Fort Wise), lives (Sand Creek), and promised reparation lands.
- **Acreage if known:** Reparation grants promised: 4 x 320 acres + 160 acres per eligible person (treaty text)
- **Legal aftermath:** Reparations: no verified payment in sources read (status [unverified]). Sand Creek Massacre National Historic Site dedicated Apr. 28, 2007; Colorado Gov. Hickenlooper apologized Dec. 3, 2014; about 3,478 acres added to the site in Oct. 2022 for tribal protection (per Wikipedia).
- **Verification notes:** [verified] Fort Wise and Little Arkansas treaty texts (primary). [verified, tertiary] casualty range, investigations, 2007/2014/2022 events. [disputed] death toll; Council of 44 consent claim. Cheyenne and Arapaho Tribes (Oklahoma) and Northern Cheyenne/Northern Arapaho voices needed; Sand Creek remains are a cultural-protocol concern.
- **Confidence:** high
- **Sources:**
  - [P] Treaty of Fort Wise (1861), 12 Stat. 1163 — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg1163.pdf
  - [P] Treaty with the Cheyenne and Arapaho (Little Arkansas, 1865), 14 Stat. 703 — https://www.govinfo.gov/content/pkg/STATUTE-14/pdf/STATUTE-14-Pg703.pdf
  - [T] Wikipedia: Sand Creek massacre — https://en.wikipedia.org/wiki/Sand_Creek_massacre

#### V022. Medicine Lodge (1867) and Lone Wolf v. Hitchcock (1903): allotment without the promised three-fourths consent

- **Instrument:** Treaty with the Kiowa and Comanche (Medicine Lodge), 15 Stat. 581 (1867)
- **Nations:** Kiowa, Comanche, Plains Apache (Kiowa-Comanche-Apache Reservation)
- **Region:** Southern Plains (Oklahoma)
- **Violation year/span:** 1892-1903
- **Mechanism type(s):** `UNILATERAL_ABROGATION_STATUTE; DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** Article 12 of the 1867 treaty (concluded Oct. 21, 1867; ratified July 25, 1868; proclaimed Aug. 25, 1868) said no cession of reservation land was valid unless signed by at least three-fourths of all adult male Indians occupying it. An 1892 allotment-and-cession agreement fell short of that threshold, was alleged fraudulent, and was altered by Congress; the Act of June 6, 1900 gave it effect. In Lone Wolf v. Hitchcock (Jan. 5, 1903) the Court held Congress has plenary authority over tribal relations, that this power is political and not subject to judicial control, that Congress may abrogate treaty provisions, and that courts cannot inquire into its motives.
- **What was lost:** Reservation land allotted and 'surplus' opened to settlement.
- **Acreage if known:** about 2 million acres opened in 1901 [from-memory; not in sources read]
- **Legal aftermath:** Lone Wolf is the foundational plenary-power case, still cited. Its presumption of congressional good faith was held inapplicable where Congress takes recognized-title property and must pay just compensation (Sioux Nation, 1980).
- **Related cases:** Lone Wolf v. Hitchcock, 187 U.S. 553 (1903); United States v. Sioux Nation of Indians, 448 U.S. 371 (1980)
- **Verification notes:** [verified] Article 12, holding, dates. [from-memory] acreage, 1892 agreement details. Kiowa Tribe, Comanche Nation and Apache Tribe of Oklahoma hold the history.
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Kiowa and Comanche (Medicine Lodge), 15 Stat. 581 (1867) — https://www.govinfo.gov/content/pkg/STATUTE-15/pdf/STATUTE-15-Pg581.pdf
  - [P] Treaty with the Kiowa and Comanche, 1867 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-kiowa-and-comanche-1867-0977
  - [P] Lone Wolf v. Hitchcock, 187 U.S. 553 (1903) — https://supreme.justia.com/cases/federal/us/187/553/
  - [P] United States v. Sioux Nation of Indians, 448 U.S. 371 (1980) — https://supreme.justia.com/cases/federal/us/448/371/

#### V023. Fort Reno: military reserve carved from the Cheyenne and Arapaho reservation (1883-2026)

- **Instrument:** Medicine Lodge Treaty (1867) and 1869 executive order reservation (1867; 1869)
- **Nations:** Cheyenne and Arapaho Tribes
- **Region:** Southern Plains (Oklahoma)
- **Violation year/span:** 1883-2026
- **Mechanism type(s):** `FEDERAL_RESERVE_CARVE_OUT`
- **What happened:** After the Medicine Lodge treaty, President Grant created the Cheyenne and Arapaho reservation by executive order (1869). About fourteen years later President Arthur set aside 9,493 acres as the Fort Reno military reservation. In 1948 the land passed to USDA. The tribes say they were never compensated for Fort Reno; federal officials argue prior settlements (a 1965 $15 million settlement based on an 1891 cession) resolved it. A 1949 bill returning about 6,900 acres passed the House in 1952 and stalled in the Senate. In 2026 a House farm bill draft (H.R. 7567) would make permanent a 2008 bar on USDA declaring the El Reno research facility excess; the House Agriculture Committee approved it 34-17 in early March 2026.
- **What was lost:** About 6,700 acres west of Oklahoma City still held by USDA.
- **Acreage if known:** about 6,700 acres disputed (tribal accounting points to a discrepancy of about 10,000 acres)
- **Legal aftermath:** Return still sought. Status of the farm-bill provision after committee approval was not verified (March 2026 source).
- **Verification notes:** [verified, news] single source (NonDoc, Mar. 20, 2026). Treat as developing; needs primary check of H.R. 7567 and the 2008 statute.
- **Confidence:** medium
- **Sources:**
  - [T] NonDoc (Mar. 20, 2026): farm bill draft would block return of Fort Reno — https://nondoc.com/2026/03/20/farm-bill-draft-would-permanently-block-return-of-fort-reno-to-cheyenne-and-arapaho-tribes/

#### V024. Fort Laramie 1868 and the Black Hills: abrogation by the Act of Feb. 28, 1877

- **Instrument:** Treaty with the Sioux ... and Arapaho (Fort Laramie), 15 Stat. 635 (1868)
- **Nations:** Lakota (Oglala, Sicangu/Brule, Minneconjou, Hunkpapa, Blackfeet, Sans Arc, Two Kettle), Yanktonai, Santee, and Arapaho; Oceti Sakowin
- **Region:** Northern Plains (South Dakota/Wyoming/Montana)
- **Violation year/span:** 1874-1877
- **Mechanism type(s):** `UNILATERAL_ABROGATION_STATUTE; RESOURCE_RUSH_INVASION; FRAUD_COERCION_NEGOTIATION`
- **What happened:** Concluded April 29, 1868 (ratified Feb. 16, 1869; proclaimed Feb. 24, 1869). Article 2 set aside the Great Sioux Reservation, including the Black Hills, for 'absolute and undisturbed use and occupation.' Article 12 made any cession of reservation land invalid unless signed by at least three-fourths of all adult male Indians. Article 16 created 'unceded Indian territory' north of the North Platte and east of the Big Horn Mountains. Custer's 1874 expedition and the resulting gold rush brought thousands of non-Indians into the Hills, which the Army did not stop. In 1876 a commission obtained signatures from only about 10% of adult males; Congress enacted that 'agreement' as the Act of Feb. 28, 1877 (19 Stat. 254), which abrogated Article 16, took the Black Hills and the unceded territory, and substituted rations for the Hills and off-reservation hunting rights. In the Court's words, the 1877 Act was a taking of tribal property requiring just compensation.
- **What was lost:** The Black Hills (Paha Sapa) and the unceded Powder River country; later the lands west of the Missouri redrawn in 1889 (V025).
- **Acreage if known:** Unceded territory about 33,000,000 acres from 1851 plus about 25,000,000 added (per a secondary summary of Art. 16)
- **Legal aftermath:** 1923 suit under a jurisdictional act; Court of Claims dismissed 1942; Indian Claims Commission (1974, 4-1) held a taking; Court of Claims barred by res judicata 1975; Congress waived the bar 1978; Court of Claims affirmed 1979; Supreme Court (June 30, 1980) affirmed: $17.1 million principal (1877 value; $17.5 million with gold) plus 5% interest from 1877, about $105 million in total in 1980 (roughly $88 million of that interest; the opinion itself states no total, so the total rests on PBS and Wikipedia). The award was never accepted. Fund reported over $1 billion by 2011 and about $2 billion by 2022 (journalistic figures; exact current balance not verified). The Lakota position is that the land was never for sale. In June 2026 resolutions from nine South Dakota tribes urged Congress to return federal public lands in the Black Hills. Pe' Sla: a 2026 exploratory drilling permit (Pete Lien & Sons; permit Feb. 27) near Pe' Sla was met by suits, a temporary restraining order, a week-long occupation (Apr. 30) and company withdrawal on about May 8, 2026.
- **Related cases:** United States v. Sioux Nation of Indians, 448 U.S. 371 (1980); Lone Wolf v. Hitchcock, 187 U.S. 553 (1903) (distinguished)
- **Verification notes:** [verified] treaty text, Act, Supreme Court holding, award structure. [disputed] size of the fund (range $1B-$2B, journalistic). [verified, news] 2026 events. Mount Rushmore (carved 1927-41 in the Hills; Lakota name Tunkasila Sakpe Paha, Six Grandfathers) is a related grievance. Sacred-site sensitivity: describe Pe' Sla only as covered in public reporting; do not map ceremonial locations. Oglala, Rosebud, Cheyenne River, Standing Rock, Lower Brule, Crow Creek and others should be consulted.
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Sioux ... and Arapaho, 1868 (Fort Laramie), 15 Stat. 635 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-sioux-brule-oglala-miniconjou-yanktonai-hunkpapa-blackfeet-cuthead-two-kettle-sans-arcs-and-santee-and-arapaho-1868-0998
  - [P] Act of Feb. 28, 1877, 19 Stat. 254 (Black Hills) — https://www.govinfo.gov/content/pkg/STATUTE-19/pdf/STATUTE-19-Pg254.pdf
  - [P] United States v. Sioux Nation of Indians, 448 U.S. 371 (1980) — https://supreme.justia.com/cases/federal/us/448/371/
  - [T] Wikipedia: Treaty of Fort Laramie (1868) — https://en.wikipedia.org/wiki/Treaty_of_Fort_Laramie_(1868)
  - [T] PBS NewsHour: Why the Sioux are refusing $1.3 billion — https://www.pbs.org/newshour/show/why-the-sioux-are-refusing-1-3-billion
  - [T] SDPB (2022): US v. Sioux Nation, the case to buy the Black Hills — https://www.sdpb.org/arts-life/2022-05-12/united-states-v-sioux-nation-of-indians-the-supreme-court-case-to-buy-the-black-hills
  - [T] SDPB (June 10, 2026): South Dakota tribes re-voice claim to Black Hills — https://www.sdpb.org/politics/2026-06-10/south-dakota-tribes-revoice-claim-to-black-hills-through-joint-resolution
  - [T] ICT (May 8, 2026): mining company pulls out of Pe' Sla drilling project — https://ictnews.org/news/mining-company-pulls-out-of-controversial-pe-sla-drilling-project/
  - [T] Wikipedia: Mount Rushmore — https://en.wikipedia.org/wiki/Mount_Rushmore

#### V025. Act of March 2, 1889: the Great Sioux Reservation divided and about 9 million acres opened

- **Instrument:** Treaty of Fort Laramie (1868), Art. 12 (1868)
- **Nations:** Lakota and Dakota bands of the Great Sioux Reservation
- **Region:** Northern Plains
- **Violation year/span:** 1889
- **Mechanism type(s):** `DIMINISHMENT_DISESTABLISHMENT; ALLOTMENT`
- **What happened:** The Act of Mar. 2, 1889 (25 Stat. 888) divided the remaining Great Sioux Reservation into five smaller reservations (Standing Rock, Cheyenne River, Lower Brule, Rosebud, Pine Ridge), released Indian title to land outside them (Sec. 16), returned the remainder to the public domain for settlers at $1.25, $0.75 and $0.50 per acre (Sec. 21), and made the Act effective only upon acceptance and consent by the Sioux bands 'as prescribed by the twelfth article' of the 1868 treaty (Sec. 28). Whether the Article 12 three-fourths threshold was genuinely met is contested in the historical record; not resolved in sources read.
- **What was lost:** About half of what remained of the Great Sioux Reservation.
- **Acreage if known:** about 9 million acres (secondary)
- **Legal aftermath:** The Sioux Nation case (1980) addressed the 1877 taking, not the 1889 cession. Diminishment of individual reservations was later litigated (V031, V033).
- **Related cases:** Rosebud Sioux Tribe v. Kneip, 430 U.S. 584 (1977); Solem v. Bartlett, 465 U.S. 463 (1984)
- **Verification notes:** [verified] text of the Act (sections 16, 21, 28). [verified, tertiary] acreage. [disputed/unverified] adequacy of the consent obtained in 1889.
- **Confidence:** medium
- **Sources:**
  - [P] Act of Mar. 2, 1889, 25 Stat. 888 (division of Great Sioux Reservation) — https://www.govinfo.gov/content/pkg/STATUTE-25/pdf/STATUTE-25-Pg888.pdf
  - [T] Wikipedia: Great Sioux Reservation — https://en.wikipedia.org/wiki/Great_Sioux_Reservation

#### V026. Dakota 1851 treaties, 1862 war and the Act of Feb. 16, 1863

- **Instrument:** Treaties of Traverse des Sioux and Mendota (1851)
- **Nations:** Dakota (Mdewakanton, Wahpekute, Sisseton, Wahpeton)
- **Region:** Minnesota
- **Violation year/span:** 1862-1863
- **Mechanism type(s):** `UNILATERAL_ABROGATION_STATUTE; ANNUITY_NONPAYMENT; FORCED_REMOVAL`
- **What happened:** The 1851 treaties (Traverse des Sioux, July 23; Mendota, Aug. 5) ceded large tracts of Minnesota Territory; the Senate struck the article that defined the reservation. Annuities were about two months late in summer 1862 and much compensation went to traders for disputed debts. The war began Aug. 18, 1862. Military commissions sentenced 303 men to death; Lincoln approved 38; they were hanged at Mankato on Dec. 26, 1862, the largest one-day mass execution in U.S. history. About 1,658 non-combatants were held at Fort Snelling, where an estimated 102 to 300 died. The Act of Feb. 16, 1863 (12 Stat. 652) declared the Dakota treaties annulled 'so far as said treaties or any of them purport to impose any future obligation on the United States' and forfeited all annuities to the United States. The Dakota were expelled from Minnesota; about 1,300 survivors were moved to Crow Creek in May 1863 and more than 200 died within six months; others went to the Santee Sioux Reservation in Nebraska. Minnesota offered a $25 scalp bounty.
- **What was lost:** The Minnesota reservations and annuity entitlements; removal from the state.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Treaty obligations annulled by statute without individual findings of guilt (the Act applied to bands including non-participants; the details of individual exemptions, e.g., 208 Mdewakanton, are noted in secondary sources). Later land bases for survivors included Crow Creek and the Santee reservation in Nebraska.
- **Verification notes:** [verified] Act text and date (primary). [verified, tertiary] death-toll and removal facts. [from-memory] Stat. cites for the 1851 treaties (10 Stat. 949, 954). Dakota Oyate communities (Upper Sioux, Lower Sioux, Prairie Island, Shakopee Mdewakanton, Santee, Flandreau, Sisseton-Wahpeton, Spirit Lake, Crow Creek) should be consulted; Mankato is a site of mourning.
- **Confidence:** high
- **Sources:**
  - [P] Act of Feb. 16, 1863, 12 Stat. 652 (Dakota treaties annulled) — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg652.pdf
  - [T] Wikipedia: Dakota War of 1862 — https://en.wikipedia.org/wiki/Dakota_War_of_1862

#### V027. Ponca: 1858 treaty, the 1868 land error, 1877 removal and Standing Bear v. Crook (1879)

- **Instrument:** Treaty with the Ponca, 12 Stat. 997 (1858; 1865; 1868)
- **Nations:** Ponca (Ponca Tribe of Nebraska; Ponca Tribe of Indians of Oklahoma)
- **Region:** Nebraska / Indian Territory
- **Violation year/span:** 1868-1881
- **Mechanism type(s):** `FAILURE_TO_PROTECT; FORCED_REMOVAL`
- **What happened:** The Ponca ceded land in the Mar. 12, 1858 treaty but kept a tract along the Niobrara and Ponca rivers, with the U.S. promising to protect them in possession 'during good behavior.' Through an error, the 1868 Fort Laramie treaty with the Sioux placed the Ponca reservation inside the Great Sioux Reservation (Wikipedia's Standing Bear article attributes the transfer to the Santee Dakota; sources vary). The Ponca were forced to Indian Territory in 1877; by spring 1878 nearly a third of the tribe had died of starvation and disease, including Standing Bear's son Bear Shield. Standing Bear and others walked home; the habeas corpus case United States ex rel. Standing Bear v. Crook was decided May 12, 1879 by Judge Elmer S. Dundy (D. Neb.), who held that 'an Indian is a person' within the meaning of habeas corpus and that the government had no legal basis to hold the Ponca. The Hayes administration allowed Standing Bear's group to return; an 1881 act returned about 26,236 acres in Knox County, Nebraska, and about half the tribe moved north.
- **What was lost:** The Niobrara reservation (temporarily); about a third of the tribe in 1877-78.
- **Acreage if known:** about 26,236 acres restored in 1881
- **Legal aftermath:** Standing Bear v. Crook is a landmark on personhood, not a land judgment. The Northern Ponca were later terminated (effective 1966 per Wikipedia; the termination act itself believed 1962 [from-memory]) and restored as the Ponca Tribe of Nebraska on Oct. 31, 1990.
- **Related cases:** United States ex rel. Standing Bear v. Crook, 25 F. Cas. 695 (C.C.D. Neb. 1879) [reporter citation from memory; not confirmed this session]
- **Verification notes:** [verified] 1858 treaty provisions (primary); case date and holding. [from-memory] F. Cas. citation. [disputed] who received the Ponca land in 1868 and termination year.
- **Confidence:** medium
- **Sources:**
  - [P] Treaty with the Ponca (1858), 12 Stat. 997 — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg997.pdf
  - [T] Wikipedia: Standing Bear — https://en.wikipedia.org/wiki/Standing_Bear
  - [T] Wikipedia: Standing Bear v. Crook — https://en.wikipedia.org/wiki/Standing_Bear_v._Crook
  - [T] Wikipedia: Ponca — https://en.wikipedia.org/wiki/Ponca

#### V028. Garrison Dam (1946-1956): the Fort Berthold Reservation and the Mandan, Hidatsa and Arikara

- **Instrument:** Treaty of Fort Laramie (1851); Fort Berthold agreements (1866 and later) (1851; 1866)
- **Nations:** Mandan, Hidatsa and Arikara (MHA Nation / Three Affiliated Tribes)
- **Region:** North Dakota
- **Violation year/span:** 1944-1956
- **Mechanism type(s):** `EMINENT_DOMAIN_INFRASTRUCTURE`
- **What happened:** The Flood Control Act of 1944 (Pub. L. 78-534, Dec. 22, 1944) authorized the Missouri River Basin program including Garrison Dam. Despite repeated tribal refusals to sell, Public Law 437 (1949, the 'Taking Act') provided for acquisition of about 155,000 acres of Fort Berthold land; tribal leaders cited the 1851 treaty and a 1945 tribal resolution declaring the land their 'inherent property from time immemorial.' About 349 families were relocated. The gates closed in June 1953; the Lake Sakakawea reservoir was completed in 1956 and covers about 263.8 sq mi, about one-sixth of the reservation's surface. One source states the tribes lost roughly 95% of their land (reservation 9 million acres in 1851 to about 600,000 before the dam, per the 1949 tribal chairman), the highest share among Missouri River tribes.
- **What was lost:** Most of the tribes' bottomland, towns and agricultural base.
- **Acreage if known:** about 155,000 acres acquired (1949 hearing figure)
- **Legal aftermath:** The 1992 Equitable Compensation Act (Pub. L. 102-575) created a trust fund of $149.2 million for Fort Berthold (and $90.6 million for Standing Rock). MHA Nation's own accounts should be foregrounded.
- **Verification notes:** [verified, secondary] Flood Control Act number/date; Pub. L. 437 name; acreage and families; compensation amounts (Senate Report 106-217). [disputed] '95% of land' phrasing. [unverified] 63 Stat. cite for Pub. L. 81-437.
- **Confidence:** medium
- **Sources:**
  - [P] Flood Control Act of 1944, Pub. L. 78-534 (Dec. 22, 1944) — https://www.govinfo.gov/content/pkg/STATUTE-58/pdf/STATUTE-58-Pg887.pdf
  - [A] Buffalo Bill Center of the West: Mandan, Hidatsa, Arikara and the Flood Control Act of 1944 — https://centerofthewest.org/2014/06/15/points-west-online-mandan-hidatsa-arikara-people-flood-control-act-1944/
  - [P] Senate Report 106-217 (Cheyenne River Sioux Tribe Equitable Compensation Act) — https://www.govinfo.gov/content/pkg/CRPT-106srpt217/html/CRPT-106srpt217.htm
  - [T] Wikipedia: Fort Berthold Indian Reservation — https://en.wikipedia.org/wiki/Fort_Berthold_Indian_Reservation

#### V029. Oahe Dam and Pick-Sloan: Standing Rock, Cheyenne River, Lower Brule and Crow Creek

- **Instrument:** Treaty of Fort Laramie (1868) and Great Sioux Reservation (1868)
- **Nations:** Standing Rock Sioux, Cheyenne River Sioux, Lower Brule Sioux, Crow Creek Sioux
- **Region:** South Dakota / North Dakota
- **Violation year/span:** 1944-1960s
- **Mechanism type(s):** `EMINENT_DOMAIN_INFRASTRUCTURE`
- **What happened:** Under the Pick-Sloan program, Oahe Dam flooded more than 200,000 acres on the Standing Rock and Cheyenne River reservations (Wikipedia). For the Cheyenne River Sioux Tribe alone, Senate Report 106-217 states 104,492 acres of tribal land were acquired, four communities were flooded, 181 families (about 30% of the tribal population) were relocated and about 90% of the tribe's timber was lost. In 1954 the tribe asked for about $23.5 million; Congress authorized $10.6 million, and the report states non-Indian owners received $49.22 per acre against $21.49 for the tribe.
- **What was lost:** Riverbottom forests, towns, agricultural land and the Missouri riparian corridor.
- **Acreage if known:** 104,492 acres (Cheyenne River Sioux Tribe); more than 200,000 acres across Standing Rock and Cheyenne River per Wikipedia
- **Legal aftermath:** Later equitable compensation trust funds: Standing Rock $90.6M (Pub. L. 102-575, 1992); Fort Berthold $149.2M (same act); Crow Creek $27.5M (Pub. L. 104-223, 1996); Lower Brule $39.3M (Pub. L. 105-132, 1997); Cheyenne River bill S. 964 recommended in 1999 with $290.7M principal (enactment not confirmed in sources read).
- **Verification notes:** [verified, government report] acreage, compensation. [unverified] enactment of the Cheyenne River Act (believed Pub. L. 106-511 [from-memory]).
- **Confidence:** high
- **Sources:**
  - [P] Senate Report 106-217 (Cheyenne River Sioux Tribe Equitable Compensation Act) — https://www.govinfo.gov/content/pkg/CRPT-106srpt217/html/CRPT-106srpt217.htm
  - [T] Wikipedia: Standing Rock Sioux Tribe — https://en.wikipedia.org/wiki/Standing_Rock_Sioux_Tribe
  - [P] Flood Control Act of 1944, Pub. L. 78-534 (Dec. 22, 1944) — https://www.govinfo.gov/content/pkg/STATUTE-58/pdf/STATUTE-58-Pg887.pdf

#### V030. Dakota Access Pipeline and Lake Oahe (2016-2026): context, not an adjudicated treaty violation

- **Instrument:** Treaties of Fort Laramie (1851, 1868) invoked by the Tribe (1851; 1868)
- **Nations:** Standing Rock Sioux Tribe (and allied Oceti Sakowin nations)
- **Region:** North Dakota
- **Violation year/span:** 2016-2026
- **Mechanism type(s):** `CONTEXT_INFRASTRUCTURE_SITING`
- **What happened:** The Army Corps approved easements for the Lake Oahe crossing on July 26, 2016; construction near Oahe was halted Sept. 9 and the easement denied Dec. 4, 2016; a Jan. 24, 2017 presidential memorandum led to approval Feb. 8, 2017. Courts decided the matter on NEPA grounds: D.D.C. ordered a full EIS (Mar. 25, 2020) and vacated the easement (July 6, 2020); the D.C. Circuit affirmed that the Corps violated NEPA but reversed the shutdown order (Jan. 26, 2021); certiorari denied Feb. 22, 2022. The Corps issued a final EIS Dec. 19, 2025 and a Record of Decision May 21, 2026 selecting Alternative 4 (easement with added conditions). The Tribe voluntarily dismissed a related challenge; dismissal June 23, 2026. Treaty-based claims were part of the Tribe's public case, but the controlling rulings summarized in the tracker concern NEPA.
- **What was lost:** (No land taking; the dispute is about the pipeline crossing near the reservation, the 1958 Oahe taking context, and consultation.)
- **Acreage if known:** n/a
- **Legal aftermath:** Pipeline operating; easement authorized in 2026 on conditions. Include in the atlas as 'modern conflict', not as a catalogued treaty breach.
- **Related cases:** Standing Rock Sioux Tribe v. U.S. Army Corps of Engineers (D.D.C./D.C. Cir.) [docket numbers not confirmed this session]
- **Verification notes:** [verified] timeline from the Harvard EELP tracker. [from-memory] Judge Boasberg authored the 2020 rulings (not named in the source). Treaty claims not adjudicated: label carefully.
- **Confidence:** medium
- **Sources:**
  - [A] Harvard EELP Regulatory Tracker: Dakota Access Pipeline — https://eelp.law.harvard.edu/tracker/dakota-access-pipeline/
  - [T] Wikipedia: Standing Rock Sioux Tribe — https://en.wikipedia.org/wiki/Standing_Rock_Sioux_Tribe

#### V031. Rosebud Sioux Tribe v. Kneip (1977): the 1904 Act diminishes the Rosebud Reservation

- **Instrument:** Treaty of Fort Laramie (1868); Act of 1889 (1868; 1889)
- **Nations:** Rosebud Sioux Tribe (Sicangu Lakota)
- **Region:** South Dakota
- **Violation year/span:** 1904-1910
- **Mechanism type(s):** `DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** Congress ratified a 1901 agreement and passed acts in 1904, 1907 and 1910 ceding and opening unallotted lands in Gregory, Tripp, Lyman and Mellette counties. The Supreme Court (Apr. 4, 1977, Rehnquist) held the 1904 Act 'clearly evidence[d] a congressional intent to diminish the boundaries' for Gregory County and that the 1907 and 1910 Acts continued that intent, even though the three-fourths tribal consent was not obtained and payment shifted from a lump sum. Marshall, Brennan and Stewart dissented.
- **What was lost:** Reservation boundaries (jurisdiction) in the opened counties.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Boundaries diminished as a matter of federal law (jurisdiction); the Tribe continues to hold trust land within the opened area.
- **Related cases:** Rosebud Sioux Tribe v. Kneip, 430 U.S. 584 (1977)
- **Verification notes:** [verified] holding. Illustrates the Lone Wolf logic applied to treaty consent requirements.
- **Confidence:** high
- **Sources:**
  - [P] Rosebud Sioux Tribe v. Kneip, 430 U.S. 584 (1977) — https://supreme.justia.com/cases/federal/us/430/584/

#### V032. Lake Traverse Reservation (Sisseton-Wahpeton) and DeCoteau v. District County Court (1975)

- **Instrument:** Treaty with the Sisseton and Wahpeton Sioux (1867); Agreement of 1889 (1867; 1889; 1891)
- **Nations:** Sisseton-Wahpeton Oyate (Dakota)
- **Region:** South Dakota / North Dakota
- **Violation year/span:** 1889-1891
- **Mechanism type(s):** `DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** Under an 1889 agreement the Tribe ceded all unallotted lands within the 1867 reservation boundaries to the United States for a sum certain; the Act of Mar. 3, 1891 implemented it. In DeCoteau (Mar. 3, 1975, 6-3) the Court held the 1891 Act 'terminated' the Lake Traverse Reservation, so South Dakota courts have civil and criminal jurisdiction over tribal members on non-Indian, unallotted lands within the old boundaries.
- **What was lost:** Reservation status over ceded and opened lands.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Jurisdictional disestablishment affirmed by Supreme Court; contrasts with Solem/McGirt where Congress's cession language was absent.
- **Related cases:** DeCoteau v. District County Court, 420 U.S. 425 (1975)
- **Verification notes:** [verified] holding. [from-memory] 15 Stat. 505 cite for the 1867 treaty.
- **Confidence:** high
- **Sources:**
  - [P] DeCoteau v. District County Court, 420 U.S. 425 (1975) — https://supreme.justia.com/cases/federal/us/420/425/

#### V033. Claims that failed: Cheyenne River (Solem v. Bartlett, 1984) and Omaha (Nebraska v. Parker, 2016) were not diminished

- **Instrument:** Treaty of Fort Laramie (1868); Omaha treaties (1868; 1854)
- **Nations:** Cheyenne River Sioux; Omaha Tribe of Nebraska
- **Region:** South Dakota; Nebraska
- **Violation year/span:** 1882; 1908
- **Mechanism type(s):** `DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** Surplus-land acts do not automatically shrink a reservation. In Solem (Feb. 22, 1984, unanimous), the Cheyenne River Act of 1908 authorized the Secretary to 'sell and dispose' of about 1.6 million acres for homesteading with proceeds credited to the Tribe; the Court read the Secretary as the Tribe's sales agent, not as a cession, and applied a framework weighing (1) statutory language, (2) circumstances of passage and (3) subsequent events. In Nebraska v. Parker (Mar. 22, 2016, unanimous, Thomas) the 1882 Act 'merely opened reservation land to settlement' and did not diminish the Omaha Reservation; later demographics and settler expectations could not override the text.
- **What was lost:** (Reservation boundaries survived.)
- **Acreage if known:** Solem: about 1.6 million acres opened but still reservation
- **Legal aftermath:** These cases, with McGirt (V047), define the modern rule: only Congress can diminish, and intent must be clear.
- **Related cases:** Solem v. Bartlett, 465 U.S. 463 (1984); Nebraska v. Parker, 577 U.S. 481 (2016)
- **Verification notes:** [verified] holdings and dates. Entry kept to show 'not every surplus act diminished'.
- **Confidence:** high
- **Sources:**
  - [P] Solem v. Bartlett, 465 U.S. 463 (1984) — https://supreme.justia.com/cases/federal/us/465/463/
  - [P] Nebraska v. Parker, 577 U.S. 481 (2016) — https://supreme.justia.com/cases/federal/us/577/481/

#### V034. Crow Tribe and Herrera v. Wyoming (2019): treaty hunting right survives statehood

- **Instrument:** Crow Treaty of 1868 (15 Stat. 649) (1868)
- **Nations:** Crow Tribe (Apsaalooke)
- **Region:** Wyoming / Montana
- **Violation year/span:** 2014-2019
- **Mechanism type(s):** `HUNTING_FISHING_RIGHTS`
- **What happened:** The 1868 treaty reserved the right to hunt on 'unoccupied lands of the United States' so long as game may be found. Wyoming prosecuted a tribal member for elk hunting in the Bighorn National Forest, arguing the right expired at statehood and that the forest was 'occupied.' The Supreme Court (May 20, 2019, 5-4, Sotomayor) held the right survived the Wyoming Statehood Act and that Bighorn National Forest was not categorically 'occupied'; it left open whether particular areas were occupied and whether Wyoming could regulate for conservation.
- **What was lost:** (Rights upheld; state prosecution reversed.)
- **Acreage if known:** n/a
- **Legal aftermath:** Counterexample in the hunting/fishing line (Winans 1905, Fishing Vessel 1979, Mille Lacs 1999, Cougar Den 2019).
- **Related cases:** Herrera v. Wyoming, 587 U.S. ___ (2019); Ward v. Race Horse, 163 U.S. 504 (1896) [from-memory, overruled in effect by Mille Lacs]
- **Verification notes:** [verified] holding and date. [from-memory] 15 Stat. 649 cite.
- **Confidence:** high
- **Sources:**
  - [P] Herrera v. Wyoming, 587 U.S. ___ (2019) — https://supreme.justia.com/cases/federal/us/587/17-532/
  - [P] Minnesota v. Mille Lacs Band of Chippewa Indians, 526 U.S. 172 (1999) — https://supreme.justia.com/cases/federal/us/526/172/

#### V035. Western Shoshone: Treaty of Ruby Valley (1863) and the ICC payment the Nation refuses

- **Instrument:** Treaty of Ruby Valley, 18 Stat. 689 (1863)
- **Nations:** Western Shoshone (Newe)
- **Region:** Nevada / Utah / Idaho / California
- **Violation year/span:** 1951-2006
- **Mechanism type(s):** `STATUTORY_EXTINGUISHMENT_SETTLEMENT; UNRECOGNIZED_TITLE`
- **What happened:** Signed Oct. 1, 1863 by Governors Nye and Doty and twelve chiefs, the treaty (18 Stat. 689-692) granted access, passage and resource rights; it did not cede land. A 1951 claim (ICC Docket 326-K) alleged loss of aboriginal title; the Commission treated the land as extinguished by encroachment and awarded money; Congress appropriated $26 million for 24 million acres in 1979. Tribes refused the payment. In United States v. Dann (Feb. 20, 1985, unanimous) the Court held 'payment' under the ICC Act occurred when funds were placed in a Treasury trust account for the Tribe, so the claim was final; it did not decide whether title was actually extinguished. A Western Shoshone National Council quiet-title suit was dismissed Jan. 17, 2006. On Mar. 10, 2006 the U.N. Committee on the Elimination of Racial Discrimination cited credible information that Western Shoshone land rights were being denied.
- **What was lost:** Aboriginal-title claim to about 24-26 million acres (the treaty territory is about 40,000 sq mi per Wikipedia).
- **Acreage if known:** about 24 million acres (ICC award basis); about 40,000 sq mi claimed territory
- **Legal aftermath:** The payment fund remains unaccepted by many; a 2004 distribution act was opposed by seven of nine tribal councils (figures vary between $145M and $160M in sources).
- **Related cases:** United States v. Dann, 470 U.S. 39 (1985); United States v. Western Shoshone National Council, 415 F. Supp. 2d 1201 (D. Nev. 2006) [from Wikipedia]
- **Verification notes:** [verified] Dann holding; [verified, tertiary] treaty facts and award. [disputed] settlement amount and acreage. Western Shoshone governments and the Western Shoshone National Council are the voice; the Dann sisters' family claim is individual.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Treaty of Ruby Valley — https://en.wikipedia.org/wiki/Treaty_of_Ruby_Valley
  - [P] United States v. Dann, 470 U.S. 39 (1985) — https://supreme.justia.com/cases/federal/us/470/39/
  - [A] National Archives: Indian Claims Commission — https://www.archives.gov/research/native-americans/indian-claims-commission

#### V036. Box Elder (Fort Bridger) 1863: no recognized title, no compensation (Northwestern Shoshone)

- **Instrument:** Treaty of Box Elder (Treaty with the Northwestern Bands of Shoshone) (1863)
- **Nations:** Northwestern Bands of Shoshone
- **Region:** Utah / Idaho
- **Violation year/span:** 1863-1945
- **Mechanism type(s):** `UNRECOGNIZED_TITLE`
- **What happened:** The July 30, 1863 treaty promised peace, travel routes and increased annuities, and Article IV described the 'country claimed' by Chief Pokatello. The Senate later added an amendment saying the treaty admitted no greater title than existed under Mexican law. When the Bands sought about $15 million for roughly 15 million acres under a 1929 jurisdictional act, the Supreme Court (Mar. 12, 1945) held the treaty did not recognize or acknowledge Indian title, so the claim did not arise under the treaty; they recovered nothing. Roberts, Douglas, Frankfurter and Murphy dissented.
- **What was lost:** Claim to about 15 million acres.
- **Acreage if known:** about 15 million acres claimed
- **Legal aftermath:** No recovery under this case; later ICC claims for Shoshone bands exist but were not verified. Sets the pre-Tee-Hit-Ton pattern: no recognition by Congress, no compensation.
- **Related cases:** Northwestern Bands of Shoshone Indians v. United States, 324 U.S. 335 (1945); Tee-Hit-Ton Indians v. United States, 348 U.S. 272 (1955)
- **Verification notes:** [verified] holding. Descendant governments: Northwestern Band of the Shoshone Nation; Shoshone-Bannock Tribes (Fort Hall) [from-memory].
- **Confidence:** high
- **Sources:**
  - [P] Northwestern Bands of Shoshone Indians v. United States, 324 U.S. 335 (1945) — https://supreme.justia.com/cases/federal/us/324/335/
  - [P] Tee-Hit-Ton Indians v. United States, 348 U.S. 272 (1955) — https://supreme.justia.com/cases/federal/us/348/272/

#### V037. Blackfeet and Glacier National Park: the 1895 agreement and the 1910 park

- **Instrument:** Lame Bull Treaty (1855); 1895 Agreement ceding mountain land (1855; 1895)
- **Nations:** Blackfeet (Pikuni) Nation
- **Region:** Montana
- **Violation year/span:** 1895-1935
- **Mechanism type(s):** `FEDERAL_RESERVE_CARVE_OUT`
- **What happened:** The Lame Bull Treaty (1855) included the eastern part of today's park within the Blackfeet reservation up to the Continental Divide. Under an 1895 agreement, Chief White Calf authorized sale of about 800,000 acres of mountain land to the United States for $1.5 million; the Blackfeet understood they would keep hunting rights as long as the land remained 'public land of the United States.' Glacier became a national park on May 11, 1910; the enabling legislation does not mention the guarantees. The United States holds the park designation ended those rights, which the Court of Claims confirmed in 1935. Park rules prohibit hunting; some Blackfeet maintain the usage rights persist.
- **What was lost:** About 800,000 acres of mountain land and associated hunting/gathering access.
- **Acreage if known:** about 800,000 acres
- **Legal aftermath:** Court of Claims (1935) sided with the United States; Blackfeet claims that rights persist de jure remain.
- **Related cases:** Court of Claims (1935) decision [citation not confirmed]
- **Verification notes:** [verified, tertiary] Wikipedia only. [from-memory] 28 Stat. 222 for the 1895 agreement. Needs Blackfeet Nation sources.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Glacier National Park (U.S.) — https://en.wikipedia.org/wiki/Glacier_National_Park_(U.S.)

### Part V. Plateau, Rocky Mountains and Southwest

#### V038. Nez Perce: the 1855 reservation, the 1863 'thief treaty,' and 1877

- **Instrument:** Treaty with the Nez Perce (1855), 12 Stat. 957; Treaty with the Nez Perces (1863), 14 Stat. 647 (1855; 1863)
- **Nations:** Nez Perce (Nimiipuu), including the Wallowa and other non-treaty bands
- **Region:** Idaho / Oregon / Washington / Montana
- **Violation year/span:** 1863-1877
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; FORCED_REMOVAL`
- **What happened:** The 1855 treaty (June 11, 1855; ratified Mar. 8, 1859) set a large reservation (about 7.5 million acres per a secondary source). The June 9, 1863 treaty (ratified Apr. 17, 1867; 14 Stat. 647) was signed at Lapwai by about 51 chiefs, headmen and delegates [unverified: V2 found no signer count for the 1863 treaty] with Lawyer as head chief, and reduced the reservation by about 90% to roughly 750,000 acres. Many Nez Perce, including Chief Joseph's Wallowa band in northeastern Oregon, rejected it: the bands whose homelands were ceded had not agreed. The name 'thief treaty' is used in the literature [from-memory] for a treaty signed by a faction. In May 1877 Gen. O. O. Howard gave the non-treaty bands 30 days to move; the Nez Perce War ran June 14-Oct. 5, 1877 (a fighting retreat of about 1,170 miles). After the surrender at Bear Paw, 418 surrendered and 150-200 escaped to Canada; prisoners were sent to Fort Leavenworth and Indian Territory; 268 survivors returned to the Northwest in 1885, and Joseph was not allowed to return to Idaho.
- **What was lost:** About 90% of the 1855 reservation; the Wallowa homeland.
- **Acreage if known:** 7.5 million -> about 750,000 acres (secondary)
- **Legal aftermath:** No general restoration; the Nez Perce Tribe of Idaho and the Colville Confederated Tribes hold the history. Specific later land recoveries (Wallowa) not verified.
- **Verification notes:** [verified] treaty dates/Stat cites, signers (primary). [verified, tertiary] acreage, war facts. [from-memory] 'thief treaty' nickname. [unverified] absence of Wallowa signatories in the text (OSU page does not list it). Nimiipuu is the Tribe's own name [from-memory].
- **Confidence:** medium
- **Sources:**
  - [P] Treaty with the Nez Perce (1855), 12 Stat. 957 — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg957.pdf
  - [P] Treaty with the Nez Perces, 1863, 14 Stat. 647 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-nez-perces-1863-0843
  - [T] Wikipedia: Nez Perce War — https://en.wikipedia.org/wiki/Nez_Perce_War
  - [A] NPS: Nez Perce National Historical Park overview — https://home.nps.gov/articles/nezperce.htm/index.htm

#### V039. Ute: the 1868 Colorado reservation, Brunot (1873), the 1880 Act, 1881 removal, and Hagen v. Utah (1994)

- **Instrument:** Treaty with the Ute (1868), 15 Stat. 619; Brunot Agreement (1873-74); Act of June 15, 1880, 21 Stat. 199 (1868; 1873; 1880)
- **Nations:** Ute (Northern Ute/Uintah and Ouray, Ute Mountain Ute, Southern Ute)
- **Region:** Colorado / Utah
- **Violation year/span:** 1873-1905
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; FORCED_REMOVAL; DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** The treaty of Mar. 2, 1868 (proclaimed Nov. 6, 1868) set aside the western portion of Colorado for the Ute's 'absolute and undisturbed use and occupation.' After silver was found in the San Juan Mountains (1872), the Brunot Agreement (ratified 1873) gave the United States the mineral-rich land. After the 1879 White River (Meeker) conflict, the Act of June 15, 1880 (ch. 223) accepted an agreement with the confederated Ute bands to sell their Colorado reservation and settle members in severalty, withheld the White River Utes' share until the 'guilty parties' were surrendered, and required consent of three-fourths of adult males. In 1881 the Uncompahgre and White River Ute were forced west to reservations in Utah. In Hagen v. Utah (Feb. 23, 1994) the Court held Congress diminished the Uintah Valley Reservation when it opened unallotted lands, so Myton is not Indian country.
- **What was lost:** Nearly all of the western Colorado reservation; Uintah Valley reservation diminished.
- **Acreage if known:** San Juan cession about 3.7 million acres [from-memory]
- **Legal aftermath:** Hagen (1994) treated the opened Uintah lands as no longer reservation for jurisdiction. Subsequent Ute/Utah jurisdiction litigation not verified this session. In 2026 press reports describe Utah legislative moves complicating Ute land-return hopes (headline only).
- **Related cases:** Hagen v. Utah, 510 U.S. 399 (1994)
- **Verification notes:** [verified] treaty and 1880 Act text; Hagen holding. [from-memory] 1873 Brunot acreage, 18 Stat. 36 cite (fetch failed), Ute Indian Tribe v. Utah, 114 F.3d 1513 (10th Cir. 1997).
- **Confidence:** medium
- **Sources:**
  - [P] Treaty with the Ute (1868), 15 Stat. 619 — https://www.govinfo.gov/content/pkg/STATUTE-15/pdf/STATUTE-15-Pg619.pdf
  - [P] Ute Act of June 15, 1880, 21 Stat. 199 (ch. 223) — https://www.govinfo.gov/content/pkg/STATUTE-21/pdf/STATUTE-21-Pg199.pdf
  - [P] Hagen v. Utah, 510 U.S. 399 (1994) — https://supreme.justia.com/cases/federal/us/510/399/
  - [T] Wikipedia: Ouray (Ute leader) page returned for Brunot Agreement query — https://en.wikipedia.org/wiki/Brunot_Agreement
  - [A] NARF/NILL: 2026 Native Lands & Sacred Places news index — https://www.narf.org/nill/bulletins/news/2026/land.html

#### V040. Navajo: the Long Walk and Bosque Redondo (1864-1868), ended by the 1868 treaty

- **Instrument:** Treaty with the Navaho, 15 Stat. 667 (1868)
- **Nations:** Navajo Nation (Dine) and Mescalero Apache
- **Region:** Arizona / New Mexico
- **Violation year/span:** 1864-1868
- **Mechanism type(s):** `FORCED_REMOVAL`
- **What happened:** Beginning in early 1864 the Army forced the Navajo to Fort Sumner (Bosque Redondo), New Mexico; more than 300 died on the Long Walk (one source), and over 9,000 Navajo and Mescalero were interned there, about 8,500 Navajo and 500 Mescalero in April 1865 against a plan for 5,000. Bosque Redondo was not a violation of a ratified treaty in force; it was a coerced removal and confinement during war. The June 1, 1868 treaty (ratified July 25; proclaimed Aug. 12) ended the war, set apart a reservation for the Navajo's 'use and occupation' and let them return after it was signed (the treaty is dated June 1, 1868; the return march is commonly dated June 18, 1868, not verified this pass). Article 13 made the reservation their 'permanent home.' The reservation later grew to about 17.5 million acres (17,544,500 acres per Wikipedia, Navajo Nation).
- **What was lost:** Four years of confinement, deaths, and homeland access.
- **Acreage if known:** Return to homeland; later reservation about 17.5 million acres (17,544,500 acres per Wikipedia, Navajo Nation)
- **Legal aftermath:** The 1868 treaty is the rare case where a treaty restored people to their homeland. Modern shortfalls concern water (V041).
- **Verification notes:** [verified] treaty dates/articles (primary). [verified, tertiary] internment numbers; [disputed] death toll estimates vary widely (higher estimates for the whole internment are commonly cited [from-memory]). Dine Bizaad / Navajo Nation Museum sources should be centered.
- **Confidence:** medium
- **Sources:**
  - [P] Treaty with the Navaho, 1868, 15 Stat. 667 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-navaho-1868-1015
  - [T] Wikipedia: Bosque Redondo — https://en.wikipedia.org/wiki/Bosque_Redondo

#### V041. Navajo water: the 1868 treaty reserves water but creates no duty to secure it (Arizona v. Navajo Nation, 2023)

- **Instrument:** Treaty with the Navaho, 15 Stat. 667 (1868)
- **Nations:** Navajo Nation
- **Region:** Arizona / New Mexico / Utah
- **Violation year/span:** 2023
- **Mechanism type(s):** `WATER_RIGHTS`
- **What happened:** The Navajo Nation asked the courts to order the United States to assess its water needs and develop a plan to secure Colorado River water. The Supreme Court (June 22, 2023, 5-4, Kavanaugh; Gorsuch, Sotomayor, Kagan and Jackson dissenting) held that the 1868 treaty reserved the water needed to serve the reservation's purpose, but did not require the United States to take affirmative steps to secure it, stating 'Indian treaties cannot be rewritten or expanded beyond their clear terms.' The baseline doctrine is Winters v. United States (1908): the 1888 agreement creating Fort Belknap impliedly reserved enough Milk River water, statehood did not cancel it, and ambiguities are resolved from the Indians' standpoint.
- **What was lost:** Unquantified Colorado River water rights.
- **Acreage if known:** n/a
- **Legal aftermath:** Right acknowledged in principle; duty to secure denied. Negotiated settlements remain the route.
- **Related cases:** Arizona v. Navajo Nation, 599 U.S. ___ (2023); Winters v. United States, 207 U.S. 564 (1908)
- **Verification notes:** [verified] holdings.
- **Confidence:** high
- **Sources:**
  - [P] Arizona v. Navajo Nation, 599 U.S. ___ (2023) — https://supreme.justia.com/cases/federal/us/599/21-1484/
  - [P] Winters v. United States, 207 U.S. 564 (1908) — https://supreme.justia.com/cases/federal/us/207/564/

#### V042. Chiricahua Apache: the 1872 reservation abolished (1876) and 27 years as prisoners of war (1886-1912/14)

- **Instrument:** Cochise-Howard agreement (1872), executive order reservation; Treaty of Santa Fe (1852) with the Apache (1852; 1872)
- **Nations:** Chiricahua Apache (Ndee/Ndé); Fort Sill Apache Tribe; Mescalero Apache Tribe
- **Region:** Arizona / New Mexico / Florida / Alabama / Oklahoma
- **Violation year/span:** 1876-1912
- **Mechanism type(s):** `FORCED_REMOVAL; NON_RATIFICATION`
- **What happened:** Gen. Oliver O. Howard, with Thomas Jeffords, negotiated peace with Cochise; an executive order of Dec. 14, 1872 created the Chiricahua Reservation in southeastern Arizona. This was an executive-order reservation based on an informal agreement, not a ratified treaty. In 1876 it was restored to the public domain and the Chiricahua and other bands were moved to San Carlos. After Geronimo, Naiche and 34 holdouts surrendered in September 1886, most remaining Chiricahua, including Army scouts who had served the U.S., were exiled as prisoners to Fort Marion, Florida, then Alabama, then Fort Sill, Oklahoma. Congress released the prisoners in August 1912 (per Wikipedia); 183 people (about two-thirds) moved to the Mescalero reservation and 78 stayed in Oklahoma. Other sources place the relocation in 1913-14.
- **What was lost:** The Chiricahua homeland reservation; family separation; 26-28 years of captivity.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** No land return; the Fort Sill Apache Tribe in Oklahoma and Mescalero Apache Tribe in New Mexico are the descendant governments.
- **Verification notes:** [verified, tertiary] dates and counts. [disputed] release/relocation dates (1912 vs 1913-14). [from-memory] Treaty of Santa Fe (1852), 10 Stat. 979.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Chiricahua — https://en.wikipedia.org/wiki/Chiricahua

### Part VI. Annuities, national statutes and the modern courts

#### V043. Seminole Nation v. United States (1942): annuities paid to corrupt officials despite treaty duties

- **Instrument:** Seminole treaties (1856, 1866); Curtis Act sec. 19 (1856; 1866)
- **Nations:** Seminole Nation of Oklahoma
- **Region:** Indian Territory (Oklahoma)
- **Violation year/span:** 1870-1907
- **Mechanism type(s):** `ANNUITY_NONPAYMENT_OR_DIVERSION`
- **What happened:** The Nation sued for treaty payments allegedly misdirected to tribal officers who defrauded members, with U.S. officials knowing. The Supreme Court (May 11, 1942, Murphy) held the Government owes Indian tribes a fiduciary duty judged by 'strict standards'; payments made at a council's request do not discharge the obligation if officials knew the council was defrauding members; it remanded for findings on 1870-74 and 1899-1907. This is the doctrinal root of the trust-based breach claim, later used to cabin the Indian Claims Commission and Tucker Act litigation.
- **What was lost:** Money (annuities), not land.
- **Acreage if known:** n/a
- **Legal aftermath:** Remanded for findings; the case is the leading authority on payment to fiduciaries and government knowledge.
- **Related cases:** Seminole Nation v. United States, 316 U.S. 286 (1942); United States v. Dann, 470 U.S. 39 (1985) (applies Seminole common-law payment rule)
- **Verification notes:** [verified] holding. Treaty Stat. cites (14 Stat. 755 for 1866) [from-memory].
- **Confidence:** high
- **Sources:**
  - [P] Seminole Nation v. United States, 316 U.S. 286 (1942) — https://supreme.justia.com/cases/federal/us/316/286/
  - [P] United States v. Dann, 470 U.S. 39 (1985) — https://supreme.justia.com/cases/federal/us/470/39/

#### V044. Curtis Act (1898) and Oklahoma statehood (1907): Five Tribes governments dismantled and lands allotted

- **Instrument:** Treaties of 1830s removal; 1866 reconstruction treaties (1830s; 1866)
- **Nations:** Cherokee, Chickasaw, Choctaw, Muscogee (Creek), Seminole (the Five Tribes)
- **Region:** Indian Territory (Oklahoma)
- **Violation year/span:** 1898-1907
- **Mechanism type(s):** `UNILATERAL_ABROGATION_STATUTE; ALLOTMENT`
- **What happened:** The Curtis Act (1898) extended allotment to the Five Tribes, ended their self-government and tribal courts, and provided for sale of 'surplus' lands. Oklahoma statehood followed in 1907. This overrode treaty guarantees such as the Creeks' 1856 promise of no annexation to a State and the 1866 promise that remaining land be 'forever set apart.' Congress did not use language of cession or disestablishment for the Creek (McGirt), but practice under Curtis erased tribal government and moved most land out of Indian hands for decades.
- **What was lost:** Tribal governments (until reorganization) and most communal land.
- **Acreage if known:** not stated in sources read
- **Legal aftermath:** Reservations were held never disestablished in McGirt (2020), V047.
- **Related cases:** McGirt v. Oklahoma, 591 U.S. ___ (2020)
- **Verification notes:** [verified, tertiary] Curtis Act description. [verified] treaty provisions listed in McGirt. Section 19 (annuity payments) referenced in V043.
- **Confidence:** medium
- **Sources:**
  - [P] McGirt v. Oklahoma, 591 U.S. ___ (2020) — https://supreme.justia.com/cases/federal/us/591/18-9526/
  - [T] Wikipedia: Dawes Act — https://en.wikipedia.org/wiki/Dawes_Act
  - [T] Wikipedia: Muscogee (Creek) Nation — https://en.wikipedia.org/wiki/Muscogee_(Creek)_Nation

#### V045. The General Allotment (Dawes) Act of 1887 and the loss of the communal land base

- **Instrument:** Many treaties with communal-title reservations (e.g., Fort Laramie 1868, Medicine Lodge 1867) (1887 (statute))
- **Nations:** Most reservation tribes outside the Five Tribes at first; extended to the Five Tribes by the Curtis Act (1898)
- **Region:** National
- **Violation year/span:** 1887-1934
- **Mechanism type(s):** `ALLOTMENT; DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** The Act of Feb. 8, 1887 (24 Stat. 388) authorized allotment of reservation land in severalty: 160 acres to a head of family, 80 acres to a single person over 18 or an orphan, 40 acres to other single persons under 18. Allotments were held in trust for 25 years (Sec. 5). After allotments were made, the Secretary could negotiate with the tribe to buy 'surplus' reservation land, with Congress to ratify; the land was reserved for actual settlers, limited to 160 acres per person. Later statutes (Burke Act 1906, which allowed fee patents to 'competent' allottees, and individual 'surplus land' acts) accelerated land loss. The Indian Reorganization Act (1934) ended further allotment. A common summary: Indian-held land fell from about 138 million acres (1887) to about 48 million acres (1934). Fractionated heirship later left about 4 million owner interests in about 10 million acres of trust allotments (2004 House figures).
- **What was lost:** About 90 million acres, roughly two-thirds of the 1887 base (secondary summary).
- **Acreage if known:** 138 million -> 48 million acres (1887-1934)
- **Legal aftermath:** Federal courts treat allotment alone as insufficient to diminish a reservation (McGirt 2020; Solem 1984), but surplus-land acts with cession language can (Hagen 1994; Rosebud 1977; DeCoteau 1975). Land buy-back efforts (Cobell settlement, 2010s) and trust-land restoration continue; see B3.
- **Related cases:** Lone Wolf v. Hitchcock, 187 U.S. 553 (1903); McGirt v. Oklahoma, 591 U.S. ___ (2020)
- **Verification notes:** [verified] statutory text of Secs. 1 and 5. [verified, tertiary] 138/48 million acres and 4 million interests (from Wikipedia citing Gunn and a 2004 House hearing). [disputed] exact acreage figures vary by source. Cobell settlement details [from-memory].
- **Confidence:** high
- **Sources:**
  - [P] General Allotment (Dawes) Act, 24 Stat. 388 (Feb. 8, 1887) — https://www.govinfo.gov/content/pkg/STATUTE-24/pdf/STATUTE-24-Pg388.pdf
  - [T] Wikipedia: Dawes Act — https://en.wikipedia.org/wiki/Dawes_Act
  - [P] Lone Wolf v. Hitchcock, 187 U.S. 553 (1903) — https://supreme.justia.com/cases/federal/us/187/553/
  - [P] McGirt v. Oklahoma, 591 U.S. ___ (2020) — https://supreme.justia.com/cases/federal/us/591/18-9526/

#### V046. Termination policy: House Concurrent Resolution 108 (1953) and Public Law 280

- **Instrument:** Treaties and trust relationships of the named tribes (e.g., Klamath 1864, Menominee 1854) (1953 (policy))
- **Nations:** More than 100 tribes and bands over the period (counts vary); named in HCR 108: Flathead, Klamath, Menominee, Potawatomi (KS/NE), Turtle Mountain Chippewa, and all tribes in California, Florida, New York and Texas
- **Region:** National (esp. Oregon, Wisconsin, California)
- **Violation year/span:** 1953-1970
- **Mechanism type(s):** `TERMINATION; JURISDICTIONAL_EROSION`
- **What happened:** HCR 108 (Aug. 1, 1953) declared the sense of Congress that Indians should be 'freed from Federal supervision and control and from all disabilities and limitations specially applicable to Indians,' and named the tribes above. Public Law 280 (Aug. 15, 1953, 67 Stat. 588) gave California, Minnesota (except Red Lake), Nebraska, Oregon (except Warm Springs) and Wisconsin (except Menominee) criminal and civil jurisdiction in Indian country and let other states assume it. Its codification (18 U.S.C. 1162(b)) preserves hunting, trapping and fishing rights secured by federal treaty, agreement or statute. The National Archives states that Congress began 60 separate termination proceedings between 1953 and 1970, and that over three million acres of tribal land were relinquished; the Nixon administration repudiated termination in 1970.
- **What was lost:** Federal recognition and trust status; reservation land; treaty-based services.
- **Acreage if known:** over 3 million acres (National Archives)
- **Legal aftermath:** Many terminated tribes were restored by statute from 1973 on (Menominee 1973, Siletz 1977, Klamath 1986, Ponca 1990, Catawba 1993). Menominee Tribe v. United States (1968) read PL 280 with the Termination Act to preserve treaty hunting and fishing rights.
- **Related cases:** Menominee Tribe v. United States, 391 U.S. 404 (1968)
- **Verification notes:** [verified] HCR 108 text, PL 280 text, NARA counts. [disputed] total number of terminated tribes (NARA: 60 proceedings; other widely cited counts such as 109 tribes and bands [from-memory]).
- **Confidence:** high
- **Sources:**
  - [P] House Concurrent Resolution 108, 67 Stat. B132 (Aug. 1, 1953) — https://www.govinfo.gov/content/pkg/STATUTE-67/pdf/STATUTE-67-PgB132.pdf
  - [P] Public Law 280, 67 Stat. 588 (Aug. 15, 1953) — https://www.govinfo.gov/content/pkg/STATUTE-67/pdf/STATUTE-67-Pg588.pdf
  - [A] National Archives: Termination (HCR 108, PL 280) — https://www.archives.gov/research/native-americans/termination
  - [P] Menominee Tribe v. United States, 391 U.S. 404 (1968) — https://supreme.justia.com/cases/federal/us/391/404/

#### V047. McGirt v. Oklahoma (2020): the Muscogee (Creek) Reservation was never disestablished

- **Instrument:** Treaties of 1832 (7 Stat. 366), 1833 (7 Stat. 418), 1856 (11 Stat. 700), 1866 (14 Stat. 786) (1832-1866)
- **Nations:** Muscogee (Creek) Nation; by extension the Cherokee, Chickasaw, Choctaw and Seminole Nations
- **Region:** Oklahoma
- **Violation year/span:** 1898-2020
- **Mechanism type(s):** `DIMINISHMENT_DISESTABLISHMENT`
- **What happened:** Oklahoma had long exercised criminal jurisdiction over most of eastern Oklahoma on the premise that allotment and statehood ended the Creek reservation. In McGirt (July 9, 2020, 5-4, Gorsuch) the Court held that, for purposes of the Major Crimes Act, land reserved for the Creek Nation in the 19th century remains Indian country: only Congress can disestablish a reservation, it must clearly express that intent (typically explicit cession or total-surrender language), and no allotment-era statute did so. Allotment alone is 'a first step rather than a final one.' Extratextual evidence (demographics, historical practice) cannot override text. The Court said Congress remains free to change the framework. Aftermath: the Oklahoma Court of Criminal Appeals ruled in Sept. 2021 that McGirt is not retroactive; the Court declined challenges in Feb. 2022. The Cherokee Nation refiled over 500 dismissed cases. Roughly 1,900 prisoners were affected, about 10% qualifying for rehearings (Wikipedia).
- **What was lost:** (Reversal of presumed loss: jurisdiction recognized.)
- **Acreage if known:** The Creek reservation area (about 3 million acres by the 1866 cession terms is [from-memory])
- **Legal aftermath:** Judicially recognized: Muscogee (Creek) Reservation intact for MCA purposes; extended in practice to the other four tribes' reservations by Oklahoma appellate courts. Castro-Huerta (2022) then expanded state jurisdiction over non-Indian offenders (V048).
- **Related cases:** McGirt v. Oklahoma, 591 U.S. ___ (2020); Sharp v. Murphy (2020); Oklahoma v. Castro-Huerta, 597 U.S. ___ (2022)
- **Verification notes:** [verified] opinion summary and treaty list. [verified, tertiary] aftermath numbers. [from-memory] acreage.
- **Confidence:** high
- **Sources:**
  - [P] McGirt v. Oklahoma, 591 U.S. ___ (2020) — https://supreme.justia.com/cases/federal/us/591/18-9526/
  - [T] Wikipedia: McGirt v. Oklahoma — https://en.wikipedia.org/wiki/McGirt_v._Oklahoma
  - [T] Wikipedia: Muscogee (Creek) Nation — https://en.wikipedia.org/wiki/Muscogee_(Creek)_Nation

#### V048. Oklahoma v. Castro-Huerta (2022): concurrent state jurisdiction over non-Indians in Indian country

- **Instrument:** Worcester v. Georgia line; treaties promising self-government and exclusion of state authority (1832-1866)
- **Nations:** All tribes with Indian country in states; the case arose in the Cherokee Nation Reservation
- **Region:** Oklahoma (national significance)
- **Violation year/span:** 2022
- **Mechanism type(s):** `JURISDICTIONAL_EROSION`
- **What happened:** The Court held (June 29, 2022, 5-4, Kavanaugh) that the federal government and the State have concurrent jurisdiction to prosecute crimes by non-Indians against Indians in Indian country. The majority reasoned that the Worcester-era presumption that states lack jurisdiction had weakened and that the General Crimes Act, as codified in 1948, no longer treated tribal lands as distinct from state territory; state prosecution does not strip tribal authority because tribes cannot prosecute non-Indians. Gorsuch (joined by Breyer, Sotomayor, Kagan) dissented: 'Where this Court once stood firm, today it wilts.' This is a judicial reinterpretation of federal-state allocation, not a congressional abrogation; whether it 'violates' treaties is contested.
- **What was lost:** Exclusivity of federal jurisdiction (and so tribal-federal relationship) over non-Indian offenders against Native victims.
- **Acreage if known:** n/a
- **Legal aftermath:** Tribes and amici call for legislation; Gorsuch's dissent invites Congress to act. After the decision, FBI jurisdiction expanded, per one secondary account, to almost 45% of Oklahoma's land.
- **Related cases:** Oklahoma v. Castro-Huerta, 597 U.S. ___ (2022); Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832)
- **Verification notes:** [verified] holding and vote. [disputed] characterization as treaty-related harm; flagged as contested legal characterization.
- **Confidence:** medium
- **Sources:**
  - [P] Oklahoma v. Castro-Huerta, 597 U.S. ___ (2022) — https://supreme.justia.com/cases/federal/us/597/21-429/
  - [T] Wikipedia: Oklahoma v. Castro-Huerta — https://en.wikipedia.org/wiki/Oklahoma_v._Castro-Huerta
  - [P] Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832) — https://supreme.justia.com/cases/federal/us/31/515/

### Part VII. Southwest sacred sites and the Pueblos

#### V049. Oak Flat (Chi'chil Bildagoteel): 2014 land exchange, Apache Stronghold litigation and the March 2026 transfer

- **Instrument:** Treaty of Santa Fe (1852) invoked by Apache Stronghold; Public Land Order 1229 (1955) (1852; 1955)
- **Nations:** San Carlos Apache, Tonto Apache and other Western Apache communities; Apache Stronghold (nonprofit)
- **Region:** Arizona
- **Violation year/span:** 2014-2026
- **Mechanism type(s):** `CONTEXT_FEDERAL_LAND_DISPOSAL`
- **What happened:** A 2014 provision added to a defense bill (Sen. John McCain) authorized swapping 2,422 acres of the Tonto National Forest, including Oak Flat, to Resolution Copper. The land had been shielded from mining for nearly 60 years under a 1955 Eisenhower order. The U.S. Supreme Court rejected Apache Stronghold's appeal in May 2025; on Mar. 13, 2026 the Ninth Circuit denied an injunction; the Forest Service transferred Oak Flat to Resolution Copper on Mar. 16, 2026. Opponents continue to litigate; estimates cited are a copper deposit worth about $150 billion and a crater more than 1,000 feet deep. The 1852 treaty argument and religious-freedom claims are the Apache Stronghold legal theories; courts have not accepted them (treaty theory status [from-memory]).
- **What was lost:** Sacred and recreational lands; ceremonial access.
- **Acreage if known:** 2,422 acres (Tonto National Forest)
- **Legal aftermath:** Transferred; litigation continuing as of March 2026. Needs updating after Oct. 2026 (NARF index lists further 9th Circuit and Supreme Court filings in Sept. 2026, headlines only).
- **Related cases:** Apache Stronghold v. United States (9th Cir. en banc 2024) [from-memory]; cert. denied (May 2025) per Cronkite News
- **Verification notes:** [verified, news] March 2026 events. [from-memory] Treaty of Santa Fe, 10 Stat. 979; court theories. Developing story: verify before publication. Sacred-site sensitivity: Oak Flat is publicly known; map only at public-record level.
- **Confidence:** medium
- **Sources:**
  - [T] Cronkite News (Mar. 16, 2026): Oak Flat transferred to Resolution Copper — https://cronkitenews.azpbs.org/2026/03/16/resolution-copper-oak-flat-land-transfer/
  - [A] NARF/NILL: 2026 Native Lands & Sacred Places news index — https://www.narf.org/nill/bulletins/news/2026/land.html

#### V050. Taos Pueblo and Blue Lake: taken in 1906, returned in 1970

- **Instrument:** Treaty of Guadalupe Hidalgo (1848), Arts. VIII-IX (context) (1848)
- **Nations:** Taos Pueblo (Red Willow People)
- **Region:** New Mexico
- **Violation year/span:** 1906-1970
- **Mechanism type(s):** `FEDERAL_RESERVE_CARVE_OUT`
- **What happened:** About 48,000 acres of Taos Pueblo's sacred mountain watershed were taken in 1906 and included in what became the Carson National Forest (the Taos Pueblo website gives 1906; Wikipedia says 'early 20th century'). The Pueblo sought return of the land, not compensation. Congress returned it in Public Law 91-550 (84 Stat. 1437), approved Dec. 15, 1970: the land is 'held by the United States in trust for the Pueblo de Taos'; the statute recites that the Taos Indians depend on the lands for water, forage, wood and timber and for religious ceremonials. An additional 764 acres followed in 1996 (Wikipedia). It is widely regarded as the first major modern U.S. return of land to a tribe.
- **What was lost:** 48,000 acres, 1906-1970; Blue Lake and watershed.
- **Acreage if known:** about 48,000 acres (+764 acres in 1996)
- **Legal aftermath:** Land RETURNED (see B3). Whether the Treaty of Guadalupe Hidalgo's property protections apply to Pueblo lands is a legal-history question not resolved here; list as context.
- **Verification notes:** [verified] Pub. L. 91-550 text (trust, purposes); Taos Pueblo 1906 and Dec. 15, 1970. [verified, tertiary] 764 acres (1996). [from-memory] Indian Claims Commission monetary offer in 1960s that Taos refused. Tribal voice: Taos Pueblo (taospueblo.com).
- **Confidence:** high
- **Sources:**
  - [P] Pub. L. 91-550, 84 Stat. 1437 (Dec. 15, 1970; Blue Lake) — https://www.govinfo.gov/content/pkg/STATUTE-84/pdf/STATUTE-84-Pg1437.pdf
  - [A] Taos Pueblo: Blue Lake — https://taospueblo.com/about-taos-pueblo/blue-lake/
  - [T] Wikipedia: Blue Lake (New Mexico) — https://en.wikipedia.org/wiki/Blue_Lake_(New_Mexico)
  - [P] Treaty of Guadalupe Hidalgo, 9 Stat. 922 (1848) — https://www.govinfo.gov/content/pkg/STATUTE-9/pdf/STATUTE-9-Pg922.pdf

### Part VIII. Pacific Coast and Northwest

#### V051. Treaty of Medicine Creek (1854): small reservations, the Nisqually War, Leschi, and the Puyallup claims

- **Instrument:** Treaty of Medicine Creek, 10 Stat. 1132 (1854)
- **Nations:** Nisqually, Puyallup, Steilacoom, Squaxin Island and other Puget Sound bands
- **Region:** Puget Sound
- **Violation year/span:** 1854-1990
- **Mechanism type(s):** `FRAUD_COERCION_NEGOTIATION; HUNTING_FISHING_RIGHTS`
- **What happened:** Gov. Isaac Stevens and 62 leaders signed on Dec. 26, 1854 (ratified Mar. 3, 1855; proclaimed Apr. 10, 1855); the tribes ceded about 2.24 million acres for reservations of about two sections each (e.g., two 1,280-acre tracts plus Klah-che-min Island), $32,500 over 20 years (the Art. 4 schedule runs 20 years; the itemized installments sum to $32,250, which is $250 below the stated total), and the Article 3 right of taking fish at 'all usual and accustomed grounds and stations' in common with citizens. Nisqually leader Leschi protested that the reservation was forested, rocky, unsuited to farming and had no access to the Nisqually River; he led resistance in the 1855-56 war, was arrested on a murder charge, hanged at Steilacoom on Feb. 19, 1858, and exonerated by a historical court in 2004. Reservations were enlarged in January 1857. The Puyallup lost most of their allotted reservation land through questionable transactions; the Puyallup Tribe of Indians Settlement Act of 1989 (Pub. L. 101-41) ratified a settlement worth about $162 million in total, including trust lands in the Tacoma tideflats (a few hundred acres, per the act's listing), a $22 million trust fund and $10 million for economic development and land, in return for the Tribe relinquishing claims to roughly 20,000 acres in the Tacoma area.
- **What was lost:** About 2.24 million acres; riverine access; allotments.
- **Acreage if known:** 2.24 million acres ceded (Wikipedia, 'Treaty of Medicine Creek'; HistoryLink essay 21193 instead says about 3,960 square miles); Puyallup claim of more than 20,000 acres relinquished in 1989-90
- **Legal aftermath:** Settlement (1989-90) rather than restoration. Fishing right litigated in V052.
- **Related cases:** Puyallup Tribe v. Department of Game, 391 U.S. 392 (1968) (decided May 27, 1968) [verified]
- **Verification notes:** [verified] treaty text and dates (primary); Leschi, settlement facts (HistoryLink, Pub. L. 101-41). [disputed] HistoryLink says 'about 900 acres'; the act itself lists roughly 300 acres of named parcels plus roughly 600 acres to be acquired. Whether Leschi marked the treaty is disputed (HistoryLink).
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Nisqualli, Puyallup, etc., 1854 (Medicine Creek), 10 Stat. 1132 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-nisqualli-puyallup-etc-1854-0661
  - [A] HistoryLink: Leschi (1808-1858), Part 1 — https://www.historylink.org/file/21193
  - [A] HistoryLink: Puyallup Land Claims Settlement (1990) — https://www.historylink.org/file/20157
  - [P] Puyallup Tribe of Indians Settlement Act of 1989, Pub. L. 101-41, 103 Stat. 83 — https://www.govinfo.gov/content/pkg/STATUTE-103/pdf/STATUTE-103-Pg83.pdf

#### V052. Stevens treaty fishing rights: Boldt (1974) and Washington v. Fishing Vessel Ass'n (1979)

- **Instrument:** Stevens Treaties (Medicine Creek, Point Elliott, Point No Point, Neah Bay, Quinault, Yakama) (1854-1856)
- **Nations:** Treaty tribes of western Washington, including Nisqually, Puyallup, Lummi, Suquamish and others
- **Region:** Washington
- **Violation year/span:** 1900s-1974
- **Mechanism type(s):** `HUNTING_FISHING_RIGHTS`
- **What happened:** The treaties secured 'the right of taking fish, at all usual and accustomed grounds and stations ... in common with all citizens of the Territory.' For decades Washington regulated and arrested treaty fishers. Judge George Boldt (W.D. Wash.) in United States v. Washington, 384 F. Supp. 312 (1974), read 'in common with' as equal sharing, giving treaty and non-treaty fishers each up to 50% of the harvestable fish; the formula gave tribes about 43% of the Puget Sound harvest (about 18% statewide). The Ninth Circuit affirmed in 1975. When the state would not enforce the order, Boldt directed the Coast Guard and National Marine Fisheries Service to do so. The Supreme Court (July 2, 1979, Stevens) largely upheld the ruling: the treaties guarantee a share of each run, an equitable division begins with roughly equal shares, and the 50% figure is a ceiling that can fall if tribal needs can be met with less. Tribal share of the harvest rose from under 5% before the ruling to 49% by 1984 (Wikipedia), and tribes became co-managers.
- **What was lost:** (Decades of denied fishing access; later recovered.)
- **Acreage if known:** n/a
- **Legal aftermath:** Rights confirmed and implemented; ongoing disputes include the culvert case (2007 ruling affirmed by the Ninth Circuit in 2016, per Wikipedia).
- **Related cases:** United States v. Washington, 384 F. Supp. 312 (W.D. Wash. 1974); Washington v. Fishing Vessel Ass'n, 443 U.S. 658 (1979)
- **Verification notes:** [verified] Fishing Vessel holding and date; treaty Article 3 text. [verified, tertiary] Boldt facts (the Feb. 12, 1974 date is [from-memory]). Counterexample: rights vindicated.
- **Confidence:** high
- **Sources:**
  - [P] Treaty with the Nisqualli, Puyallup, etc., 1854 (Medicine Creek), 10 Stat. 1132 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-nisqualli-puyallup-etc-1854-0661
  - [P] Washington v. Washington State Commercial Passenger Fishing Vessel Ass'n, 443 U.S. 658 (1979) — https://supreme.justia.com/cases/federal/us/443/658/
  - [T] Wikipedia: Boldt Decision (United States v. Washington, 1974) — https://en.wikipedia.org/wiki/Boldt_Decision

#### V053. Yakama treaty rights: Winans (1905) and Cougar Den (2019)

- **Instrument:** Treaty with the Yakama (June 9, 1855; proclaimed 1859), 12 Stat. 951 (1855)
- **Nations:** Confederated Tribes and Bands of the Yakama Nation
- **Region:** Washington
- **Violation year/span:** 1900s-2019
- **Mechanism type(s):** `HUNTING_FISHING_RIGHTS`
- **What happened:** In Winans (May 16, 1905) the Court held the Yakama fishing right at usual and accustomed places was 'a reservation by the Indians of rights already possessed and not granted away by them,' a continuing servitude binding the United States, its grantees, the State and its grantees; statehood did not defeat it. In Cougar Den (Mar. 19, 2019, 5-4, Breyer plurality) the 1855 treaty's right 'to travel upon all public highways' preempted Washington's fuel tax as applied to importing fuel for sale on the reservation. The Yakama Nation continues to contest state action burdening these rights.
- **What was lost:** (Rights asserted and upheld.)
- **Acreage if known:** n/a
- **Legal aftermath:** Upheld. Winans introduced the 'reserved rights' canon: treaties are a grant of rights from the Indians, not to them.
- **Related cases:** United States v. Winans, 198 U.S. 371 (1905); Washington State Dep't of Licensing v. Cougar Den, Inc., 586 U.S. ___ (2019)
- **Verification notes:** [verified] holdings and dates. [from-memory] 12 Stat. 951 cite.
- **Confidence:** high
- **Sources:**
  - [P] United States v. Winans, 198 U.S. 371 (1905) — https://supreme.justia.com/cases/federal/us/198/371/
  - [P] Washington State Dep't of Licensing v. Cougar Den, Inc., 586 U.S. ___ (2019) — https://supreme.justia.com/cases/federal/us/586/16-1498/

#### V054. California: 18 unratified treaties (1851-52) and the secrecy until 1905

- **Instrument:** Eighteen treaties negotiated by Redick McKee, George W. Barbour and Oliver M. Wozencraft (1851-1852)
- **Nations:** More than 100 California tribes and bands (Pomo, Miwok, Yokuts, Maidu, Wintun, Yurok and others)
- **Region:** California
- **Violation year/span:** 1852-1905
- **Mechanism type(s):** `NON_RATIFICATION`
- **What happened:** Between Mar. 19, 1851 and Jan. 7, 1852 three federal commissioners negotiated 18 treaties reserving land for tribes. They were submitted to the Senate on June 1, 1852 and rejected in closed session (a citation dates the action July 8, 1852) after California's state government lobbied against them; Historian William Ellison suggests the large land reservations and costs made them unpopular. The treaties were sealed from the public until Jan. 18, 1905. The tribes had given up claims on the strength of promises that were never ratified. The reservations totaled about 11,700 square miles, roughly 7% of California (about 7.5 million acres). Historian Benjamin Madley estimates that at least 9,400 to 16,000 California Indians were killed by non-Indians between 1846 and 1873.
- **What was lost:** Everything that was to be reserved, plus aboriginal lands ceded in the course of the negotiations.
- **Acreage if known:** about 7.5 million acres (about 7% of California; one Wikipedia page's 'one-seventh' is inconsistent)
- **Legal aftermath:** Compensation came only through later claims: the often-cited 1964 Indian Claims Commission award of about $29 million at about 47 cents per acre [from-memory; not verified here]; a different Wikipedia passage lists $17.5 million (1944) and $46 million (1946). No land was returned.
- **Related cases:** Indians of California v. United States, 98 Ct. Cl. 583 (1942) [from-memory]
- **Verification notes:** [verified, tertiary] counts, dates, killings estimate. [disputed] settlement dollar figures and per-acre value. Needs a primary check (Senate Executive Journal 1852; NARA RG 46). Cultural-protocol: treaty maps show tribal places; consult tribes.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Redick McKee — https://en.wikipedia.org/wiki/Redick_McKee
  - [T] Wikipedia: Oliver M. Wozencraft — https://en.wikipedia.org/wiki/Oliver_M._Wozencraft
  - [T] Wikipedia: California genocide — https://en.wikipedia.org/wiki/California_Genocide
  - [T] Wikipedia: California Gold Rush (Native Americans section) — https://en.wikipedia.org/wiki/Gold_Rush_(California)
  - [T] Wikipedia: Indigenous peoples of California — https://en.wikipedia.org/wiki/Indigenous_peoples_of_California

#### V055. Siletz and Western Oregon: Coast Reservation reduced, tribes terminated (1954), restored (1977)

- **Instrument:** Rogue River treaties (1853-55); Coast Reservation by executive order (1855) (1853-1855)
- **Nations:** Confederated Tribes of Siletz Indians; Western Oregon tribes
- **Region:** Oregon
- **Violation year/span:** 1865-1954
- **Mechanism type(s):** `DIMINISHMENT_DISESTABLISHMENT; TERMINATION`
- **What happened:** An executive order of Nov. 9, 1855 created the Coast Indian Reservation (about 1.1 million acres), weeks into the final phase of the Rogue River Wars; most affected peoples were moved onto it. The reservation was reduced by roughly three-quarters (about 900,000 acres) in 1865 and 1875, which Wikipedia says violated treaties; a Siletz official said another 700,000 acres were removed in 1875. The Western Oregon Indian Termination Act (Pub. L. 588, Aug. 13, 1954) ended federal supervision; the remaining lands were sold except for Government Hill. The Siletz Restoration Act (Nov. 18, 1977) restored recognition and the Siletz Reservation Act (1980) returned about 3,660 acres. In 2026 the Tribe acquired about 6.82 acres at Rocky Shores near Yachats for $120,000 through partners (McKenzie River Trust, View the Future and The Nature Conservancy), with a tribal official saying 'those promises were broken.' (Closing was pending at the time of the source.)
- **What was lost:** About 900,000 acres of the Coast Reservation plus termination-era losses.
- **Acreage if known:** about 900,000 acres removed (1865/1875); 3,660 acres restored (1980)
- **Legal aftermath:** Restoration 1977/1980; small purchases continue (2026).
- **Verification notes:** [verified, tertiary] Wikipedia and 2026 news. [unverified] whether the 1855 Coast Treaty was unratified (not stated in sources read); [from-memory] Rogue River treaty cites. Consult CTSI.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Confederated Tribes of Siletz Indians — https://en.wikipedia.org/wiki/Confederated_Tribes_of_Siletz_Indians
  - [T] KLCC (Oct. 5, 2026): Siletz Tribe land back, Rocky Shores — https://www.klcc.org/environment/2026-10-05/siletz-tribe-land-back-rocky-shores-yachats
  - [T] Underscore News (Oct. 1, 2026): Siletz Tribe to reclaim ceded land — https://www.underscore.news/land/land-back/after-more-than-170-years-siletz-tribe-to-reclaim-ceded-land/

#### V056. Klamath, Modoc and Yahooskin: the 1864 treaty and termination (1954-1961)

- **Instrument:** Treaty with the Klamath, Modoc and Yahooskin Band of Snake Indians, 16 Stat. 707 (1864)
- **Nations:** Klamath Tribes (Klamath, Modoc, Yahooskin Band of Snake)
- **Region:** Oregon
- **Violation year/span:** 1954-1986
- **Mechanism type(s):** `TERMINATION`
- **What happened:** The 1864 treaty ceded land but kept hunting, fishing, trapping and gathering rights on reserved lands and waters (cession figures conflict: 'more than 6 million' vs 20 million acres; about 2 million acres retained). The tribes held about 862,622 acres after allotment and the largest remaining stand of ponderosa pine in the West. The Klamath Termination Act (Pub. L. 587, 68 Stat. 718, Aug. 13, 1954) let each adult member withdraw and receive the cash value of tribal property, with sales at appraised value; termination took effect in 1961. Of 2,133 members, 1,660 (78%) withdrew and received about $43,000 each. The Klamath Restoration Act (1986) re-established the Tribes but did not return the land base; the reservation today is 308 acres in twelve non-contiguous parcels. In 2002 a federal judge held (in United States v. Adair, filed 1975) that the Tribes' water rights predate those of non-tribal irrigators.
- **What was lost:** Reservation and forest land base (to the forest sold or transferred); federal recognition 1961-1986.
- **Acreage if known:** 862,622 acres (post-allotment tribal holdings, Wikipedia); 308 acres today
- **Legal aftermath:** Restored status (1986), land not restored; treaty hunting/fishing rights survived termination in practice (Kimball v. Callahan, 9th Cir. 1974 [from-memory]).
- **Related cases:** United States v. Adair (D. Or. 2002; 9th Cir. 1983 [from-memory])
- **Verification notes:** [verified] Termination Act text. [verified, tertiary] membership and payment numbers, 308 acres. [disputed] cession acreage. [unverified] fate of the forest (Winema National Forest) not confirmed.
- **Confidence:** medium
- **Sources:**
  - [P] Klamath Termination Act, 68 Stat. 718 (Aug. 13, 1954) — https://www.govinfo.gov/content/pkg/STATUTE-68/pdf/STATUTE-68-Pg718.pdf
  - [T] Wikipedia: Klamath Tribes — https://en.wikipedia.org/wiki/Klamath_Tribes
  - [A] National Archives: Termination (HCR 108, PL 280) — https://www.archives.gov/research/native-americans/termination

### Part IX. East and Southeast: state-level violations and later settlements

#### V057. Catawba: South Carolina's 1840 Nation Ford treaty, never approved by the United States

- **Instrument:** Treaty of Nation Ford (state treaty with South Carolina) (1840)
- **Nations:** Catawba Indian Nation
- **Region:** South Carolina
- **Violation year/span:** 1840-1993
- **Mechanism type(s):** `NON_RATIFICATION`
- **What happened:** The Catawba sold all but one square mile of their 144,000-acre reserve to South Carolina under the 1840 treaty. The treaty never gained Senate ratification or federal approval, and the state lacked authority to make it (a power the Constitution gives the federal government; the Nonintercourse Act is the statutory bar). The federal government terminated the Catawba in 1959. The 1993 Settlement Act reversed termination, recognized the Catawba Indian Nation, and resolved land claims for $50 million with the state (3,000 acres [from-memory]).
- **What was lost:** About 143,000 acres.
- **Acreage if known:** 144,000 acres (reserve) minus 1 square mile
- **Legal aftermath:** Claim resolved by settlement (1993) rather than by title recovery. South Carolina v. Catawba Indian Tribe, 476 U.S. 498 (1986) [from-memory] applied state limitations periods after termination.
- **Related cases:** South Carolina v. Catawba Indian Tribe, Inc., 476 U.S. 498 (1986) [from-memory]
- **Verification notes:** [verified, tertiary] Wikipedia. [from-memory] case holding and 3,000 acres.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Catawba Indian Nation — https://en.wikipedia.org/wiki/Catawba_Indian_Nation
  - [P] 25 U.S.C. 177 (Nonintercourse Act) -- Cornell LII — https://www.law.cornell.edu/uscode/text/25/177

#### V058. Maine: state treaties violating the Nonintercourse Act and the 1980 settlement

- **Instrument:** State of Massachusetts/Maine treaties with the Passamaquoddy, Penobscot and Maliseet (1794-1833) (1794-1833)
- **Nations:** Passamaquoddy, Penobscot, Houlton Band of Maliseet
- **Region:** Maine
- **Violation year/span:** 1790s-1980
- **Mechanism type(s):** `NON_RATIFICATION`
- **What happened:** The tribes' claim, litigated beginning in the 1970s, was that their land transfers to Massachusetts and Maine violated the Nonintercourse Act because Congress never approved them. The First Circuit's Passamaquoddy v. Morton (1975) recognized that the Act applied. The claim covered about 60% of Maine (Wikipedia's lead; other sources vary). The Maine Indian Claims Settlement Act (Pub. L. 96-420, signed Oct. 10, 1980) allocated $81.5 million and funds to buy up to 300,000 acres. In 2026 TPL-led and other transfers (e.g., about 11,000 acres to the Penobscot Nation in the first phase of a nearly 30,000-acre project, Sept. 17, 2026; about 3,400 acres to the Mi'kmaq Nation, June 2026) continue the process.
- **What was lost:** Most of the aboriginal territory of the Wabanaki nations in Maine.
- **Acreage if known:** claim covered about 60% of Maine; settlement funded up to 300,000 acres
- **Legal aftermath:** Settlement 1980 (claims extinguished); the settlement's effect on tribal sovereignty remains contested [from-memory].
- **Related cases:** Joint Tribal Council of Passamaquoddy Tribe v. Morton, 528 F.2d 370 (1st Cir. 1975)
- **Verification notes:** [verified, tertiary] statute, amount, case cite. [disputed] percentage of Maine. Note: the instruments at issue were state treaties; the legal violation is of a federal statute.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Maine Indian Claims Settlement Act — https://en.wikipedia.org/wiki/Maine_Indian_Claims_Settlement_Act
  - [P] 25 U.S.C. 177 (Nonintercourse Act) -- Cornell LII — https://www.law.cornell.edu/uscode/text/25/177
  - [T] NHPR/Maine Public (Sep. 17, 2026): 11,000 acres returned to the Penobscot Nation — https://www.nhpr.org/new-england-news/2026-09-17/11-000-acres-of-ancestral-homeland-returned-to-the-penobscot-nation
  - [T] Portland Press Herald (June 22, 2026): land returned to Mi'kmaq Nation — https://www.pressherald.com/2026/06/22/land-returned-to-mikmaq-nation-will-double-tribes-territory/

#### V059. Kaw (Kanza): annuities delayed, sale and removal from Kansas (1873), and Kaw Lake

- **Instrument:** 1825 and 1846 land agreements (1825; 1846)
- **Nations:** Kaw Nation (Kanza)
- **Region:** Kansas / Oklahoma
- **Violation year/span:** 1825-1960s
- **Mechanism type(s):** `ANNUITY_NONPAYMENT_OR_DIVERSION; FORCED_REMOVAL; EMINENT_DOMAIN_INFRASTRUCTURE`
- **What happened:** In 1825 the Kaw ceded a large area of Missouri and Kansas for an annuity of $3,500 a year for twenty years, which was often delayed or diverted. In 1846 they sold most of their roughly 2,000,000 acres for $202,000, keeping a 256,000-acre reservation centered on Council Grove; it was cut to 80,000 acres in 1860. On June 4, 1873 the Kaw left Kansas for Indian Territory (533 people reached Kay County, Oklahoma). In 1902 Congress ended tribal government and the reservation and allotted 405 acres to each of 247 members; by 1945 members owned only about 13% of the former reservation. Kaw Lake (1960s) flooded the Washunga Council House and cemetery.
- **What was lost:** Kansas homeland, then the Oklahoma land base; sacred sites at Washunga.
- **Acreage if known:** 2,000,000 -> 256,000 -> 80,000 acres in Kansas (Wikipedia)
- **Legal aftermath:** In 2000 the Nation bought land near Council Grove for the Allegawaho Memorial Heritage Park, dedicated June 19, 2005, a small return of presence to Kansas.
- **Verification notes:** [verified, tertiary] Wikipedia only; sources describe agreements, not necessarily ratified treaties. Needs Kaw Nation sources.
- **Confidence:** medium
- **Sources:**
  - [T] Wikipedia: Kaw Nation — https://en.wikipedia.org/wiki/Kaw_Nation

### Part X. Alaska, Hawaii and recent context

#### V060. Alaska Native Claims Settlement Act (1971): extinguishment of aboriginal title by statute

- **Instrument:** Treaty of Cession of Russian Possessions (1867), Art. III; no U.S.-Native treaties in Alaska (1867; 1971)
- **Nations:** Alaska Native peoples (Iñupiat, Yup'ik, Aleut/Unangan, Athabascan, Tlingit, Haida, Tsimshian, and others)
- **Region:** Alaska
- **Violation year/span:** 1971
- **Mechanism type(s):** `STATUTORY_EXTINGUISHMENT_SETTLEMENT; UNRECOGNIZED_TITLE`
- **What happened:** Article III of the 1867 cession treaty stated that 'the uncivilized tribes will be subject to such laws and regulations as the United States may, from time to time, adopt' and did not recognize their title. In Tee-Hit-Ton Indians v. United States (Feb. 7, 1955) the Court held that taking unrecognized Indian title is not compensable under the Fifth Amendment. ANCSA (Pub. L. 92-203, Dec. 18, 1971) was a negotiated settlement: Sec. 4(b) extinguished all aboriginal titles and claims based on use and occupancy in Alaska, including submerged lands and 'any aboriginal hunting or fishing rights'; Sec. 4(c) extinguished claims against the United States, the State and others. In return: $462.5 million from the Treasury plus $500 million from mineral revenue sharing ($962.5 million), and about 40 million acres (38 million in Secs. 12(b)-(c) plus 2 million in Sec. 14(h); Wikipedia says up to 44 million), delivered to 12 regional corporations plus a 13th and over 200 village corporations. Congress declared the settlement should be 'without establishing any permanent racially defined institutions, rights, privileges, or obligations' and without a reservation system.
- **What was lost:** Aboriginal-title and use-and-occupancy claims across the rest of Alaska (statewide land area is about 365 million acres [from-memory]) and aboriginal hunting and fishing rights as such.
- **Acreage if known:** 40-44 million acres conveyed; $962.5 million
- **Legal aftermath:** ANCSA lands continue to be transferred (e.g., nearly 28,000 acres to NANA Regional Corporation in 2025-26); a new law removed a requirement that some land be held in state trust for a future village corporation (HCN 2026). Subsistence protection later came through ANILCA (1980) [from-memory].
- **Related cases:** Tee-Hit-Ton Indians v. United States, 348 U.S. 272 (1955); Alaska v. Native Village of Venetie Tribal Government, 522 U.S. 520 (1998) (decided Feb. 25, 1998) [verified]
- **Verification notes:** [verified] ANCSA text (Secs. 2, 4, 6, 9, 12, 14) and the Tee-Hit-Ton holding. [disputed] 40 vs 44 million acres. Label: statutory extinguishment by negotiated settlement, not a breach of a treaty with Alaska Natives.
- **Confidence:** high
- **Sources:**
  - [P] Alaska Native Claims Settlement Act, Pub. L. 92-203, 85 Stat. 688 (Dec. 18, 1971) — https://www.govinfo.gov/content/pkg/STATUTE-85/pdf/STATUTE-85-Pg688.pdf
  - [P] Treaty of Cession of Alaska, 15 Stat. 539 (1867) — https://www.govinfo.gov/content/pkg/STATUTE-15/pdf/STATUTE-15-Pg539.pdf
  - [P] Tee-Hit-Ton Indians v. United States, 348 U.S. 272 (1955) — https://supreme.justia.com/cases/federal/us/348/272/
  - [T] Wikipedia: Alaska Native Claims Settlement Act — https://en.wikipedia.org/wiki/Alaska_Native_Claims_Settlement_Act
  - [T] High Country News (Feb. 16, 2026): LandBack advances across the West — https://www.hcn.org/issues/58-2/landback-advances-across-the-west/

#### V061. Hawaii (context): overthrow of the Kingdom (1893), annexation (1898) and the 1993 Apology

- **Instrument:** Treaty of Friendship, Commerce and Navigation (1849), 9 Stat. 977 (U.S.-Kingdom of Hawaii); not a treaty with a Native nation within the U.S. (1849)
- **Nations:** Kanaka Maoli (Native Hawaiians); Kingdom of Hawaii (sovereign state)
- **Region:** Hawaii
- **Violation year/span:** 1893-1898
- **Mechanism type(s):** `ANNEXATION_CONTEXT`
- **What happened:** LEGAL CATEGORY NOTE: the Kingdom of Hawaii was an internationally recognized state that signed treaties with the United States, e.g., the Dec. 20, 1849 treaty of friendship, commerce and navigation. The 1993 Apology Resolution (Pub. L. 103-150, Nov. 23, 1993) 'apologizes to Native Hawaiians on behalf of the people of the United States for the overthrow of the Kingdom of Hawaii on January 17, 1893 with the participation of agents and citizens of the United States.' A treaty of annexation signed in 1897 lacked the two-thirds Senate support; Congress instead annexed Hawaii by joint resolution (the Newlands Resolution, 30 Stat. 750): House 209-91 (June 15, 1898), Senate 42-21 (July 6, 1898), signed July 7, 1898. A 1897 petition against annexation gathered 21,269 signatures, more than half of the roughly 39,000 Native Hawaiians. The Territory was created in 1900. The resolution disclaims: 'Nothing in this Joint Resolution is intended to serve as a settlement of any claims against the United States.'
- **What was lost:** Sovereignty and the Crown/government lands (acreage not verified).
- **Acreage if known:** not verified
- **Legal aftermath:** Hawaii v. Office of Hawaiian Affairs (Mar. 31, 2009, unanimous, Alito): the Apology Resolution's apology and acknowledgment clauses are non-binding, do not create enforceable rights, and do not strip Hawaii's power to sell or transfer the ceded lands granted to the State at statehood.
- **Related cases:** Hawaii v. Office of Hawaiian Affairs, 556 U.S. 163 (2009)
- **Verification notes:** [verified] treaty title/date, Apology text and disclaimer, OHA holding. [verified, tertiary] Newlands vote counts and petition numbers. Requires Native Hawaiian (Kanaka Maoli) consultation; do not present as a 'tribal treaty' case.
- **Confidence:** medium
- **Sources:**
  - [P] U.S.-Hawaii Treaty of Friendship, Commerce and Navigation, 9 Stat. 977 (1849) — https://www.govinfo.gov/content/pkg/STATUTE-9/pdf/STATUTE-9-Pg977.pdf
  - [P] Apology Resolution, Pub. L. 103-150, 107 Stat. 1510 (Nov. 23, 1993) — https://www.govinfo.gov/content/pkg/STATUTE-107/pdf/STATUTE-107-Pg1510.pdf
  - [P] Hawaii v. Office of Hawaiian Affairs, 556 U.S. 163 (2009) — https://supreme.justia.com/cases/federal/us/556/163/
  - [T] Wikipedia: Annexation of Hawaii — https://en.wikipedia.org/wiki/Annexation_of_Hawaii

#### V062. Bears Ears National Monument (2016-2026): designation, reductions, restoration and the July 2026 action (context, not a treaty claim)

- **Instrument:** No treaty claim; Antiquities Act proclamations; Navajo (1868) and Ute (1868) treaties are historical context (1868 (context); 2016-2026)
- **Nations:** Hopi Tribe, Navajo Nation, Ute Mountain Ute Tribe, Ute Indian Tribe of the Uintah and Ouray Reservation, Pueblo of Zuni (Bears Ears Inter-Tribal Coalition)
- **Region:** Utah
- **Violation year/span:** 2017; 2026
- **Mechanism type(s):** `CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK`
- **What happened:** Proclamation 9558 (Dec. 28, 2016) designated 1,351,849 acres; Proclamation 9681 (Dec. 4, 2017) reduced it to about 201,000 acres (removing more than 1.1 million acres); Proclamation 10285 (Oct. 8, 2021; 86 FR 57321) restored about 1.36 million acres and re-established the Bears Ears Commission to reflect 'expertise and traditional and historical knowledge of Tribal Nations.' On July 13, 2026 President Trump signed Proclamation 11043 (91 FR 45169, published July 17), which modified the monument's boundaries to 121,096 acres and excluded 1,238,904 acres, and disbanded the Bears Ears Commission; Proclamation 11044 (91 FR 45179) did the same for Grand Staircase-Escalante (181,541 acres). The earlier conflict among news reports (full revocation versus a 91% cut; Wikipedia's use of the number 9558, which is the 2016 proclamation) is resolved by the Federal Register text.  Legal challenge: NARF (for the Hopi, Zuni, Ute Mountain Ute) argues the Antiquities Act authorizes designation but not revocation; a suit by Patagonia, Hopi, Navajo, Ute Indian Tribe, Zuni and NRDC-led groups was reopened Sept. 2, 2026 before Judge Tanya Chutkan in D.D.C.; the Tenth Circuit in June 2026 affirmed in part, vacated in part and remanded challenges to the 2021 boundaries (per Wikipedia).
- **What was lost:** Federal protection for cultural landscapes; the first tribal co-management commission.
- **Acreage if known:** 1.36 million acres (2021 boundary); post-July 2026 reserved acreage 121,096 (Proclamation 11043); 1,238,904 acres excluded
- **Legal aftermath:** Pending litigation as of Oct. 2026.
- **Related cases:** Hopi Tribe v. Trump (D.D.C.) [2017 filing; docket not confirmed]
- **Verification notes:** [verified] 2016/2017/2021 numbers and dates (Federal Register). [verified, primary] July 2026 action: Proclamation 11043 (91 FR 45169), 121,096 acres reserved, 1,238,904 excluded. Litigation claims (Tenth Circuit June 2026; reopened D.D.C. suit) remain single-source. Treat as a developing event; not a catalogued treaty breach. Sensitive: no site-level coordinates.
- **Confidence:** low
- **Sources:**
  - [P] Proclamation 10285, Bears Ears National Monument, 86 FR 57321 -- Federal Register — https://www.federalregister.gov/documents/2021/10/15/2021-22672/bears-ears-national-monument
  - [T] Wikipedia: Bears Ears National Monument — https://en.wikipedia.org/wiki/Bears_Ears_National_Monument
  - [T] Native News Online (July 15, 2026): Trump revokes Bears Ears protections — https://nativenewsonline.net/sovereignty/trump-revokes-bears-ears-national-monument-protections-tribal-leaders-prepare-legal-fight/
  - [T] High Country News (July 17, 2026): Bears Ears cuts also end tribal land commission — https://www.hcn.org/articles/bears-ears-cuts-also-end-first-of-its-kind-tribal-land-commission/
  - [T] Courthouse News (Sep. 2, 2026): suit reopened against Utah monument reductions — https://courthousenews.com/patagonia-tribes-and-conservationists-reopen-suit-to-block-utah-national-monuments-reduction/

## 4. Coverage check against the brief

| Required item | Where |
|---|---|
| Cherokee, New Echota and Trail of Tears | V006, V007 |
| Fort Laramie 1868 and Black Hills; *U.S. v. Sioux Nation*; unclaimed settlement fund | V024, V025 |
| Canandaigua and Kinzua | V017 (also V019 Tuscarora) |
| Medicine Creek and the Stevens treaties | V051, V052, V053 |
| California 18 unratified treaties | V054 |
| Apache / Chiricahua | V042 (Oak Flat context V049) |
| Ponca removal and Standing Bear | V027 |
| Nez Perce 1863 'thief treaty' | V038 |
| Dakota 1862 | V026 |
| Sand Creek | V021 |
| Utes | V039 |
| Klamath and Menominee termination | V056, V016, V046 |
| McGirt and Castro-Huerta | V047, V048 (Five Tribes background V010, V044) |
| Standing Rock / Dakota Access | V030 (with Oahe taking V029) |
| Bears Ears | V062 |
| Alaska Native context (ANCSA) | V060 |
| Great Lakes (Ojibwe 1837/1854/1855, Mille Lacs) | V013, V014, V015 (1855 treaty discussed in V014) |
| Pueblo (Taos Blue Lake counterexample) | V050 |
| Navajo (Bosque Redondo, 1868) | V040, V041 |
| Seminole | V009, V043 |
| Shawnee | V004 |
| Lenape (Delaware) | V001 |
| Haudenosaunee beyond Canandaigua | V003, V012, V018, V019 |
| Hawaii (labeled context) | V061 |

## 5. Patterns in the catalog

Counts are by tag occurrence (an entry can carry several types):

| Type code | Entries |
|---|---|
| `FORCED_REMOVAL` | 14 |
| `FRAUD_COERCION_NEGOTIATION` | 13 |
| `DIMINISHMENT_DISESTABLISHMENT` | 9 |
| `FAILURE_TO_PROTECT` | 8 |
| `HUNTING_FISHING_RIGHTS` | 6 |
| `EMINENT_DOMAIN_INFRASTRUCTURE` | 5 |
| `NON_RATIFICATION` | 5 |
| `TERMINATION` | 4 |
| `UNILATERAL_ABROGATION_STATUTE` | 4 |
| `ALLOTMENT` | 3 |
| `FEDERAL_RESERVE_CARVE_OUT` | 3 |
| `UNRECOGNIZED_TITLE` | 3 |
| `ANNUITY_NONPAYMENT` | 2 |
| `ANNUITY_NONPAYMENT_OR_DIVERSION` | 2 |
| `JURISDICTIONAL_EROSION` | 2 |
| `RESOURCE_RUSH_INVASION` | 2 |
| `STATUTORY_EXTINGUISHMENT_SETTLEMENT` | 2 |
| `TREATY_PROMISE_UNFULFILLED` | 2 |
| `ANNEXATION_CONTEXT` | 1 |
| `CONTEXT_FEDERAL_LAND_DISPOSAL` | 1 |
| `CONTEXT_INFRASTRUCTURE_SITING` | 1 |
| `CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK` | 1 |
| `WATER_RIGHTS` | 1 |

Confidence distribution: high 28, medium 32, low 2.

Observations a reviewer may want to test:

1. **Statute beats treaty.** The 1863 Dakota Act (V026), the 1877 Black Hills Act (V024), the 1889 Sioux Act (V025), Lone Wolf (V022), Dawes (V045) and the Curtis Act (V044) show Congress overriding treaty terms by later statute. The legal route that made this possible is the plenary-power line from *Lone Wolf* (1903); the route that mitigates it is the Fifth Amendment takings analysis in *Sioux Nation* (1980) and the clear-statement rules in *Menominee* (1968), *Mille Lacs* (1999) and *McGirt* (2020).
2. **Unauthorized or non-representative signatories** recur (New Echota, St. Louis 1804, Stanwix 1784, Nez Perce 1863, Seminole Fort Gibson, Buffalo Creek). The historical dispute is usually about *who had authority*, which the Atlas should present as a documented contest rather than a settled fact.
3. **Failure to enforce** (Hopewell, Greenville, Fort Laramie 1851, Georgia after *Worcester*, Black Hills 1874) is distinct from statutory abrogation, and has almost no judicial remedy.
4. **Infrastructure takings** (Kinzua, Tuscarora, Garrison, Oahe, Kaw Lake) were authorized by statute, so the courts treated them as lawful takings with compensation; the tribal accounts treat them as treaty breaches.
5. **Money, not land.** Remedies were overwhelmingly monetary (Indian Claims Commission, Court of Claims, equitable-compensation acts, settlement acts). Land returns are rare (B3).

## Sources

All URLs below were fetched or returned by search this session (2026-10-16) unless noted. Tier: P primary, A authoritative secondary, T tertiary/journalistic.

### Primary (treaties, statutes, court opinions)

- Treaty with the Delawares (Fort Pitt), 7 Stat. 13 (1778) — https://www.govinfo.gov/content/pkg/STATUTE-7/pdf/STATUTE-7-Pg13.pdf
- Treaty with the Delawares (1866), 14 Stat. 793 — https://www.govinfo.gov/content/pkg/STATUTE-14/pdf/STATUTE-14-Pg793.pdf
- Treaty with the Cherokee, 1835 (New Echota), 7 Stat. 478 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-cherokee-1835-0439
- Cherokee Nation v. Georgia, 30 U.S. (5 Pet.) 1 (1831) — https://supreme.justia.com/cases/federal/us/30/1/
- Worcester v. Georgia, 31 U.S. (6 Pet.) 515 (1832) — https://supreme.justia.com/cases/federal/us/31/515/
- Oklahoma v. Castro-Huerta, 597 U.S. ___ (2022) — https://supreme.justia.com/cases/federal/us/597/21-429/
- Indian Removal Act, 4 Stat. 411 (May 28, 1830) — https://www.govinfo.gov/content/pkg/STATUTE-4/pdf/STATUTE-4-Pg411.pdf
- Seminole Nation v. United States, 316 U.S. 286 (1942) — https://supreme.justia.com/cases/federal/us/316/286/
- Treaty with the Creeks, 1866, 14 Stat. 785 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-creeks-1866-0931
- McGirt v. Oklahoma, 591 U.S. ___ (2020) — https://supreme.justia.com/cases/federal/us/591/18-9526/
- Treaty with the Chippewa (1837), 7 Stat. 536 — https://www.govinfo.gov/content/pkg/STATUTE-7/pdf/STATUTE-7-Pg536.pdf
- Treaty with the Chippewa (1854), 10 Stat. 1109 — https://www.govinfo.gov/content/pkg/STATUTE-10/pdf/STATUTE-10-Pg1109.pdf
- Minnesota v. Mille Lacs Band of Chippewa Indians, 526 U.S. 172 (1999) — https://supreme.justia.com/cases/federal/us/526/172/
- Menominee Termination Act, 68 Stat. 250 (1954) — https://www.govinfo.gov/content/pkg/STATUTE-68/pdf/STATUTE-68-Pg250.pdf
- Menominee Restoration Act, Pub. L. 93-197, 87 Stat. 770 (Dec. 22, 1973) — https://www.govinfo.gov/content/pkg/STATUTE-87/pdf/STATUTE-87-Pg770.pdf
- Menominee Tribe v. United States, 391 U.S. 404 (1968) — https://supreme.justia.com/cases/federal/us/391/404/
- Treaty with the Six Nations, 1794 (Canandaigua), 7 Stat. 44 -- OSU Tribal Treaties Database — https://treaties.okstate.edu/treaties/treaty-with-the-six-nations-1794-0034
- Seneca Nation of Indians v. Brucker, 262 F.2d 27 (D.C. Cir. 1958) — https://law.resource.org/pub/us/case/reporter/F2/262/262.F2d.27.14488.html
- County of Oneida v. Oneida Indian Nation, 470 U.S. 226 (1985) — https://supreme.justia.com/cases/federal/us/470/226/
- City of Sherrill v. Oneida Indian Nation, 544 U.S. 197 (2005) — https://supreme.justia.com/cases/federal/us/544/197/
- 25 U.S.C. 177 (Nonintercourse Act) -- Cornell LII — https://www.law.cornell.edu/uscode/text/25/177
- Federal Power Commission v. Tuscarora Indian Nation, 362 U.S. 99 (1960) — https://supreme.justia.com/cases/federal/us/362/99/
- Treaty of Fort Laramie with Sioux, etc., 1851, 11 Stat. 749 -- OSU — https://treaties.okstate.edu/treaties/treaty-of-fort-laramie-with-sioux-etc-1851-0594
- Treaty of Fort Wise (1861), 12 Stat. 1163 — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg1163.pdf
- Treaty with the Cheyenne and Arapaho (Little Arkansas, 1865), 14 Stat. 703 — https://www.govinfo.gov/content/pkg/STATUTE-14/pdf/STATUTE-14-Pg703.pdf
- Treaty with the Kiowa and Comanche (Medicine Lodge), 15 Stat. 581 (1867) — https://www.govinfo.gov/content/pkg/STATUTE-15/pdf/STATUTE-15-Pg581.pdf
- Treaty with the Kiowa and Comanche, 1867 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-kiowa-and-comanche-1867-0977
- Lone Wolf v. Hitchcock, 187 U.S. 553 (1903) — https://supreme.justia.com/cases/federal/us/187/553/
- United States v. Sioux Nation of Indians, 448 U.S. 371 (1980) — https://supreme.justia.com/cases/federal/us/448/371/
- Treaty with the Sioux ... and Arapaho, 1868 (Fort Laramie), 15 Stat. 635 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-sioux-brule-oglala-miniconjou-yanktonai-hunkpapa-blackfeet-cuthead-two-kettle-sans-arcs-and-santee-and-arapaho-1868-0998
- Act of Feb. 28, 1877, 19 Stat. 254 (Black Hills) — https://www.govinfo.gov/content/pkg/STATUTE-19/pdf/STATUTE-19-Pg254.pdf
- Act of Mar. 2, 1889, 25 Stat. 888 (division of Great Sioux Reservation) — https://www.govinfo.gov/content/pkg/STATUTE-25/pdf/STATUTE-25-Pg888.pdf
- Act of Feb. 16, 1863, 12 Stat. 652 (Dakota treaties annulled) — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg652.pdf
- Treaty with the Ponca (1858), 12 Stat. 997 — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg997.pdf
- Flood Control Act of 1944, Pub. L. 78-534 (Dec. 22, 1944) — https://www.govinfo.gov/content/pkg/STATUTE-58/pdf/STATUTE-58-Pg887.pdf
- Senate Report 106-217 (Cheyenne River Sioux Tribe Equitable Compensation Act) — https://www.govinfo.gov/content/pkg/CRPT-106srpt217/html/CRPT-106srpt217.htm
- Rosebud Sioux Tribe v. Kneip, 430 U.S. 584 (1977) — https://supreme.justia.com/cases/federal/us/430/584/
- DeCoteau v. District County Court, 420 U.S. 425 (1975) — https://supreme.justia.com/cases/federal/us/420/425/
- Solem v. Bartlett, 465 U.S. 463 (1984) — https://supreme.justia.com/cases/federal/us/465/463/
- Nebraska v. Parker, 577 U.S. 481 (2016) — https://supreme.justia.com/cases/federal/us/577/481/
- Herrera v. Wyoming, 587 U.S. ___ (2019) — https://supreme.justia.com/cases/federal/us/587/17-532/
- United States v. Dann, 470 U.S. 39 (1985) — https://supreme.justia.com/cases/federal/us/470/39/
- Northwestern Bands of Shoshone Indians v. United States, 324 U.S. 335 (1945) — https://supreme.justia.com/cases/federal/us/324/335/
- Tee-Hit-Ton Indians v. United States, 348 U.S. 272 (1955) — https://supreme.justia.com/cases/federal/us/348/272/
- Treaty with the Nez Perce (1855), 12 Stat. 957 — https://www.govinfo.gov/content/pkg/STATUTE-12/pdf/STATUTE-12-Pg957.pdf
- Treaty with the Nez Perces, 1863, 14 Stat. 647 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-nez-perces-1863-0843
- Treaty with the Ute (1868), 15 Stat. 619 — https://www.govinfo.gov/content/pkg/STATUTE-15/pdf/STATUTE-15-Pg619.pdf
- Ute Act of June 15, 1880, 21 Stat. 199 (ch. 223) — https://www.govinfo.gov/content/pkg/STATUTE-21/pdf/STATUTE-21-Pg199.pdf
- Hagen v. Utah, 510 U.S. 399 (1994) — https://supreme.justia.com/cases/federal/us/510/399/
- Treaty with the Navaho, 1868, 15 Stat. 667 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-navaho-1868-1015
- Arizona v. Navajo Nation, 599 U.S. ___ (2023) — https://supreme.justia.com/cases/federal/us/599/21-1484/
- Winters v. United States, 207 U.S. 564 (1908) — https://supreme.justia.com/cases/federal/us/207/564/
- General Allotment (Dawes) Act, 24 Stat. 388 (Feb. 8, 1887) — https://www.govinfo.gov/content/pkg/STATUTE-24/pdf/STATUTE-24-Pg388.pdf
- House Concurrent Resolution 108, 67 Stat. B132 (Aug. 1, 1953) — https://www.govinfo.gov/content/pkg/STATUTE-67/pdf/STATUTE-67-PgB132.pdf
- Public Law 280, 67 Stat. 588 (Aug. 15, 1953) — https://www.govinfo.gov/content/pkg/STATUTE-67/pdf/STATUTE-67-Pg588.pdf
- Pub. L. 91-550, 84 Stat. 1437 (Dec. 15, 1970; Blue Lake) — https://www.govinfo.gov/content/pkg/STATUTE-84/pdf/STATUTE-84-Pg1437.pdf
- Treaty of Guadalupe Hidalgo, 9 Stat. 922 (1848) — https://www.govinfo.gov/content/pkg/STATUTE-9/pdf/STATUTE-9-Pg922.pdf
- Treaty with the Nisqualli, Puyallup, etc., 1854 (Medicine Creek), 10 Stat. 1132 -- OSU — https://treaties.okstate.edu/treaties/treaty-with-the-nisqualli-puyallup-etc-1854-0661
- Puyallup Tribe of Indians Settlement Act of 1989, Pub. L. 101-41, 103 Stat. 83 — https://www.govinfo.gov/content/pkg/STATUTE-103/pdf/STATUTE-103-Pg83.pdf
- Washington v. Washington State Commercial Passenger Fishing Vessel Ass'n, 443 U.S. 658 (1979) — https://supreme.justia.com/cases/federal/us/443/658/
- United States v. Winans, 198 U.S. 371 (1905) — https://supreme.justia.com/cases/federal/us/198/371/
- Washington State Dep't of Licensing v. Cougar Den, Inc., 586 U.S. ___ (2019) — https://supreme.justia.com/cases/federal/us/586/16-1498/
- Klamath Termination Act, 68 Stat. 718 (Aug. 13, 1954) — https://www.govinfo.gov/content/pkg/STATUTE-68/pdf/STATUTE-68-Pg718.pdf
- Alaska Native Claims Settlement Act, Pub. L. 92-203, 85 Stat. 688 (Dec. 18, 1971) — https://www.govinfo.gov/content/pkg/STATUTE-85/pdf/STATUTE-85-Pg688.pdf
- Treaty of Cession of Alaska, 15 Stat. 539 (1867) — https://www.govinfo.gov/content/pkg/STATUTE-15/pdf/STATUTE-15-Pg539.pdf
- U.S.-Hawaii Treaty of Friendship, Commerce and Navigation, 9 Stat. 977 (1849) — https://www.govinfo.gov/content/pkg/STATUTE-9/pdf/STATUTE-9-Pg977.pdf
- Apology Resolution, Pub. L. 103-150, 107 Stat. 1510 (Nov. 23, 1993) — https://www.govinfo.gov/content/pkg/STATUTE-107/pdf/STATUTE-107-Pg1510.pdf
- Hawaii v. Office of Hawaiian Affairs, 556 U.S. 163 (2009) — https://supreme.justia.com/cases/federal/us/556/163/
- Proclamation 10285, Bears Ears National Monument, 86 FR 57321 -- Federal Register — https://www.federalregister.gov/documents/2021/10/15/2021-22672/bears-ears-national-monument

### Authoritative secondary (agencies, libraries, tribal, university)

- NCpedia: Trail of Tears — https://www.ncpedia.org/cherokee/trailoftears
- DocsTeach (National Archives Foundation): Petition against the Treaty of New Echota — https://docsteach.org/lesson/analyzing-the-petition-against-the-treaty-of-new-echota/
- National Archives: Termination (HCR 108, PL 280) — https://www.archives.gov/research/native-americans/termination
- Seneca Nation of Indians news (SNI News), Mar. 13, 2026: Beyond the Betrayal — http://sninews.org/2026/03/13/beyond-the-betrayal/
- NPS: State of New York treaties and land transactions with the Oneida, Onondaga, and Cayuga — https://www.nps.gov/articles/000/state-of-new-york-treaties-and-land-transactions-with-the-oneida-onondaga-and-cayuga.htm
- Buffalo Bill Center of the West: Mandan, Hidatsa, Arikara and the Flood Control Act of 1944 — https://centerofthewest.org/2014/06/15/points-west-online-mandan-hidatsa-arikara-people-flood-control-act-1944/
- Harvard EELP Regulatory Tracker: Dakota Access Pipeline — https://eelp.law.harvard.edu/tracker/dakota-access-pipeline/
- National Archives: Indian Claims Commission — https://www.archives.gov/research/native-americans/indian-claims-commission
- NPS: Nez Perce National Historical Park overview — https://home.nps.gov/articles/nezperce.htm/index.htm
- NARF/NILL: 2026 Native Lands & Sacred Places news index — https://www.narf.org/nill/bulletins/news/2026/land.html
- Taos Pueblo: Blue Lake — https://taospueblo.com/about-taos-pueblo/blue-lake/
- HistoryLink: Leschi (1808-1858), Part 1 — https://www.historylink.org/file/21193
- HistoryLink: Puyallup Land Claims Settlement (1990) — https://www.historylink.org/file/20157

### Tertiary and journalistic (Wikipedia, news)

- Wikipedia: Treaty of Greenville — https://en.wikipedia.org/wiki/Treaty_of_Greenville
- Wikipedia: Treaty of Hopewell — https://en.wikipedia.org/wiki/Treaty_of_Hopewell
- Wikipedia: Treaty of Fort Stanwix (1784) — https://en.wikipedia.org/wiki/Treaty_of_Fort_Stanwix_(1784)
- Wikipedia: Treaty of Fort Wayne (1809) — https://en.wikipedia.org/wiki/Treaty_of_Fort_Wayne
- Wikipedia: Treaty of St. Louis (1804) — https://en.wikipedia.org/wiki/Treaty_of_St._Louis_(1804)
- Wikipedia: Treaty of New Echota — https://en.wikipedia.org/wiki/Treaty_of_New_Echota
- Wikipedia: Cherokee removal — https://en.wikipedia.org/wiki/Cherokee_removal
- Wikipedia: Treaty of Dancing Rabbit Creek — https://en.wikipedia.org/wiki/Treaty_of_Dancing_Rabbit_Creek
- Wikipedia: Treaty of Payne's Landing — https://en.wikipedia.org/wiki/Treaty_of_Payne%27s_Landing
- Wikipedia: Seminole Wars — https://en.wikipedia.org/wiki/Seminole_Wars
- Wikipedia: Potawatomi Trail of Death — https://en.wikipedia.org/wiki/Potawatomi_Trail_of_Death
- Wikipedia: Tonawanda Band of Seneca — https://en.wikipedia.org/wiki/Tonawanda_Band_of_Seneca
- Wikipedia: Treaties of Buffalo Creek — https://en.wikipedia.org/wiki/Treaty_of_Buffalo_Creek
- Wikipedia: Sandy Lake Tragedy — https://en.wikipedia.org/wiki/Sandy_Lake_Tragedy
- Wikipedia: Great Lakes Indian Fish and Wildlife Commission — https://en.wikipedia.org/wiki/Great_Lakes_Indian_Fish_and_Wildlife_Commission
- Wikipedia: Menominee Indian Tribe of Wisconsin — https://en.wikipedia.org/wiki/Menominee_Indian_Tribe_of_Wisconsin
- Wikipedia: Kinzua Dam — https://en.wikipedia.org/wiki/Kinzua_Dam
- Environmental Health News: Kinzua Dam and the Seneca people — https://www.ehn.org/seneca-nation-kinzua-dam-2644943791.html
- Wikipedia: Fort Laramie Treaty of 1851 — https://en.wikipedia.org/wiki/Fort_Laramie_Treaty_of_1851
- Wikipedia: Sand Creek massacre — https://en.wikipedia.org/wiki/Sand_Creek_massacre
- NonDoc (Mar. 20, 2026): farm bill draft would block return of Fort Reno — https://nondoc.com/2026/03/20/farm-bill-draft-would-permanently-block-return-of-fort-reno-to-cheyenne-and-arapaho-tribes/
- Wikipedia: Treaty of Fort Laramie (1868) — https://en.wikipedia.org/wiki/Treaty_of_Fort_Laramie_(1868)
- PBS NewsHour: Why the Sioux are refusing $1.3 billion — https://www.pbs.org/newshour/show/why-the-sioux-are-refusing-1-3-billion
- SDPB (2022): US v. Sioux Nation, the case to buy the Black Hills — https://www.sdpb.org/arts-life/2022-05-12/united-states-v-sioux-nation-of-indians-the-supreme-court-case-to-buy-the-black-hills
- SDPB (June 10, 2026): South Dakota tribes re-voice claim to Black Hills — https://www.sdpb.org/politics/2026-06-10/south-dakota-tribes-revoice-claim-to-black-hills-through-joint-resolution
- ICT (May 8, 2026): mining company pulls out of Pe' Sla drilling project — https://ictnews.org/news/mining-company-pulls-out-of-controversial-pe-sla-drilling-project/
- Wikipedia: Mount Rushmore — https://en.wikipedia.org/wiki/Mount_Rushmore
- Wikipedia: Great Sioux Reservation — https://en.wikipedia.org/wiki/Great_Sioux_Reservation
- Wikipedia: Dakota War of 1862 — https://en.wikipedia.org/wiki/Dakota_War_of_1862
- Wikipedia: Standing Bear — https://en.wikipedia.org/wiki/Standing_Bear
- Wikipedia: Standing Bear v. Crook — https://en.wikipedia.org/wiki/Standing_Bear_v._Crook
- Wikipedia: Ponca — https://en.wikipedia.org/wiki/Ponca
- Wikipedia: Fort Berthold Indian Reservation — https://en.wikipedia.org/wiki/Fort_Berthold_Indian_Reservation
- Wikipedia: Standing Rock Sioux Tribe — https://en.wikipedia.org/wiki/Standing_Rock_Sioux_Tribe
- Wikipedia: Treaty of Ruby Valley — https://en.wikipedia.org/wiki/Treaty_of_Ruby_Valley
- Wikipedia: Glacier National Park (U.S.) — https://en.wikipedia.org/wiki/Glacier_National_Park_(U.S.)
- Wikipedia: Nez Perce War — https://en.wikipedia.org/wiki/Nez_Perce_War
- Wikipedia: Ouray (Ute leader) page returned for Brunot Agreement query — https://en.wikipedia.org/wiki/Brunot_Agreement
- Wikipedia: Bosque Redondo — https://en.wikipedia.org/wiki/Bosque_Redondo
- Wikipedia: Chiricahua — https://en.wikipedia.org/wiki/Chiricahua
- Wikipedia: Dawes Act — https://en.wikipedia.org/wiki/Dawes_Act
- Wikipedia: Muscogee (Creek) Nation — https://en.wikipedia.org/wiki/Muscogee_(Creek)_Nation
- Wikipedia: McGirt v. Oklahoma — https://en.wikipedia.org/wiki/McGirt_v._Oklahoma
- Wikipedia: Oklahoma v. Castro-Huerta — https://en.wikipedia.org/wiki/Oklahoma_v._Castro-Huerta
- Cronkite News (Mar. 16, 2026): Oak Flat transferred to Resolution Copper — https://cronkitenews.azpbs.org/2026/03/16/resolution-copper-oak-flat-land-transfer/
- Wikipedia: Blue Lake (New Mexico) — https://en.wikipedia.org/wiki/Blue_Lake_(New_Mexico)
- Wikipedia: Boldt Decision (United States v. Washington, 1974) — https://en.wikipedia.org/wiki/Boldt_Decision
- Wikipedia: Redick McKee — https://en.wikipedia.org/wiki/Redick_McKee
- Wikipedia: Oliver M. Wozencraft — https://en.wikipedia.org/wiki/Oliver_M._Wozencraft
- Wikipedia: California genocide — https://en.wikipedia.org/wiki/California_Genocide
- Wikipedia: California Gold Rush (Native Americans section) — https://en.wikipedia.org/wiki/Gold_Rush_(California)
- Wikipedia: Indigenous peoples of California — https://en.wikipedia.org/wiki/Indigenous_peoples_of_California
- Wikipedia: Confederated Tribes of Siletz Indians — https://en.wikipedia.org/wiki/Confederated_Tribes_of_Siletz_Indians
- KLCC (Oct. 5, 2026): Siletz Tribe land back, Rocky Shores — https://www.klcc.org/environment/2026-10-05/siletz-tribe-land-back-rocky-shores-yachats
- Underscore News (Oct. 1, 2026): Siletz Tribe to reclaim ceded land — https://www.underscore.news/land/land-back/after-more-than-170-years-siletz-tribe-to-reclaim-ceded-land/
- Wikipedia: Klamath Tribes — https://en.wikipedia.org/wiki/Klamath_Tribes
- Wikipedia: Catawba Indian Nation — https://en.wikipedia.org/wiki/Catawba_Indian_Nation
- Wikipedia: Maine Indian Claims Settlement Act — https://en.wikipedia.org/wiki/Maine_Indian_Claims_Settlement_Act
- NHPR/Maine Public (Sep. 17, 2026): 11,000 acres returned to the Penobscot Nation — https://www.nhpr.org/new-england-news/2026-09-17/11-000-acres-of-ancestral-homeland-returned-to-the-penobscot-nation
- Portland Press Herald (June 22, 2026): land returned to Mi'kmaq Nation — https://www.pressherald.com/2026/06/22/land-returned-to-mikmaq-nation-will-double-tribes-territory/
- Wikipedia: Kaw Nation — https://en.wikipedia.org/wiki/Kaw_Nation
- Wikipedia: Alaska Native Claims Settlement Act — https://en.wikipedia.org/wiki/Alaska_Native_Claims_Settlement_Act
- High Country News (Feb. 16, 2026): LandBack advances across the West — https://www.hcn.org/issues/58-2/landback-advances-across-the-west/
- Wikipedia: Annexation of Hawaii — https://en.wikipedia.org/wiki/Annexation_of_Hawaii
- Wikipedia: Bears Ears National Monument — https://en.wikipedia.org/wiki/Bears_Ears_National_Monument
- Native News Online (July 15, 2026): Trump revokes Bears Ears protections — https://nativenewsonline.net/sovereignty/trump-revokes-bears-ears-national-monument-protections-tribal-leaders-prepare-legal-fight/
- High Country News (July 17, 2026): Bears Ears cuts also end tribal land commission — https://www.hcn.org/articles/bears-ears-cuts-also-end-first-of-its-kind-tribal-land-commission/
- Courthouse News (Sep. 2, 2026): suit reopened against Utah monument reductions — https://courthousenews.com/patagonia-tribes-and-conservationists-reopen-suit-to-block-utah-national-monuments-reduction/

## Confidence & Gaps

**Overall: medium.** The legal anchors (Supreme Court holdings, statutes, treaty texts) are high confidence; narrative detail, acreage and death-toll figures rely on secondary sources and are medium or low.

**Not verified (spot-check list for the verification agent):**
- Stat. cites flagged `[from-memory]`: 7 Stat. 84 (St. Louis 1804), 7 Stat. 15 (Stanwix), 7 Stat. 39 (Holston), 7 Stat. 550 (Buffalo Creek 1838), 10 Stat. 949 and 954 (Dakota 1851), 10 Stat. 979 (Santa Fe 1852), 10 Stat. 1064 (Wolf River), 12 Stat. 951 (Yakama), 15 Stat. 505 and 649 (Sisseton-Wahpeton 1867; Crow 1868), 18 Stat. 36 (Brunot; the GovInfo fetch failed), 14 Stat. 755 (Seminole 1866), 28 Stat. 222 (Blackfeet 1895).
- Cases cited from memory: *Lac Courte Oreilles v. Voigt* (7th Cir. 1983), *Standing Bear v. Crook* reporter cite, *South Carolina v. Catawba* (1986), *Kimball v. Callahan*, *Puyallup Tribe v. Department of Game* (1968), *Indians of California v. United States* (Ct. Cl. 1942), *Ward v. Race Horse*, *Alaska v. Venetie*, *Apache Stronghold* en banc.
- Dollar and acreage figures that vary or are unverified: Black Hills fund balance ($1B in 2011 vs about $2B in 2022, journalistic); California treaty-claims award; Kinzua 1964 compensation; Western Shoshone settlement ($145M vs $160M); Fort Wayne 1809 and St. Louis 1804 acreage; Oneida historic acreage; Puyallup trust-land acres (about 900 per HistoryLink vs the act's own parcel list).
- Death-toll figures are ranges from secondary sources (Trail of Tears, Sand Creek, Bosque Redondo, Choctaw removal).
- **Fast-moving 2026 items** rest on single news sources and should be re-checked immediately before launch: Bears Ears July 2026 action (V062; the proclamation text is now verified, the litigation status is not), Oak Flat (V049), Fort Reno farm bill (V023), DAPL record of decision (V030), Pe' Sla (V024), Penobscot / Mi'kmaq / Siletz land returns (V055, V058).

**Research limits this session:** the shared web-search quota was exhausted partway through the work, so later checks relied on direct page fetches (Justia, GovInfo, OSU Kappler, Cornell LII, Wikipedia and news pages) rather than new searches. Some pages (Congress.gov, LA Times, Washington Post, Telegraph/Illinois) were blocked or unavailable. No tribal-government primary accounts were fetched except the Taos Pueblo and Seneca Nation (SNI News) pages; most entries therefore lack a tribal-voice source.

**Consultation flags (principle 4 and 5):** Sand Creek and Wounded Knee-type sites (remains), Mankato (mourning), Oak Flat and Pe' Sla (sacred places), Bears Ears (cultural landscape), Blue Lake, Hawaii (Native Hawaiian sovereignty framing), and any use of tribal names or endonyms. Do not publish site-level coordinates for ceremonial places.

**Known omissions** (worth adding if time allows): Yellowstone and other national parks; railroad land-grant detail (Northern Pacific, Union Pacific; only the Delaware 1866 railroad sale is covered); Cayuga land claim; Shinnecock; Mashpee; Osage mineral estate; Pit River; Lumbee; Winnebago/Ho-Chunk; Comanche/Kiowa beyond Lone Wolf; Texas and Florida state-recognition cases; Mexican-era Pueblo land grants; the Treaty of Guadalupe Hidalgo as it applied to Native peoples of the Southwest.
