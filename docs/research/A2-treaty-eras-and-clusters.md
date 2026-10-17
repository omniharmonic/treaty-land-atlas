---
title: US Treaty Eras and Clusters, with 135 Representative Instruments
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# A2. Treaty eras and clusters

Research Agent A, Treaty Land Atlas. This file groups the representative instruments in `seed-data/treaties-seed.csv` (135 rows) into eras and regional clusters, explains what each cluster did to land, and flags what is disputed. The CSV is the data of record; the tables below are generated from it, so IDs, dates and cites match exactly. The framework and counts are in `A1-treaty-framework-and-counts.md`; datasets that could supply geometry are in `A3-geospatial-and-treaty-datasets.md`.

## How to read the tables

- **ID scheme.** `T-###` is the National Archives (NARA) Ratified Indian Treaties (RIT) number from series M668, which also carries the NAID in the CSV (`nara_naid`). `T-FL1851` is Fort Laramie 1851, which is missing from the NARA table as extracted (see A1 section 4.4). `U-CA-A` to `U-CA-R` are the 18 unratified California treaties in Heizer's (1972) lettering. `U-*` other unratified; `X-*` international or executive-order context; `S-*` statutes; `A-*` agreements.
- **Ratified.** `yes` (Senate advice and consent, or Congress before 1789), `partial` (ratified with amendments, or part not ratified), `no` (unratified), `n/a`.
- **Conf.** is the row-level confidence from the CSV: `high` means date, Stat. and Kappler cites were each confirmed in a source read this session; `medium` means date confirmed and at least one cite or detail `[from-memory]`; `low` means the instrument is real and dated per NARA, but the Stat. page, Kappler page or land description is `[from-memory]` or the OCR index conflicts. The per-field basis columns (`date_signed_basis`, `date_ratified_basis`, `land_desc_basis`) and the `notes` column in the CSV say which.
- **Kappler** means Charles J. Kappler, *Indian Affairs: Laws and Treaties*, vol. II (Treaties), 1904. **Stat.** means *United States Statutes at Large*, vol. 7 (1778-1845), 9-16 and 18 for the later treaties. Several Stat. pages are from OCR'd volume indexes and are visibly corrupted in places; they are flagged in the notes.
- **Names.** Treaty and nation names follow NARA and Kappler (period spellings). Present-day endonyms, successor nations and consent for publication need tribal review before public release. Where a nation has a different current name (for example Yakama for "Yakima", Quinault for "Quinaielt", Kootenai/Ktunaxa) the site should use the tribe's own usage.
- **Acreage.** The `acreage_ceded_if_known` column is filled only when a source read this session gives a figure, and it is blank when I could not confirm one. Figures are as stated by the cited source, not computed; Royce's maps and the later Indian Claims Commission findings often differ.

## Era overview

| Era label (CSV) | Years | What defines it | Rows in seed |
|---|---|---|---|
| colonial-context | pre-1778 | British/Crown and colonial instruments, carried by NARA as items 1-7; context only | 1 |
| confederation | 1778-1788 | Treaties made by the Continental/Confederation Congress, before the Constitution | 8 |
| early-republic | 1789-1814 | Senate-ratified treaties; Washington to Madison; Northwest Indian War and its aftermath; Creek War | 14 |
| cession-and-pre-removal | 1815-1829 | Rapid cession treaties in the Old Northwest and the Southeast; the first removal-by-exchange treaties | 18 |
| removal | 1830-1848 | Indian Removal Act (1830) and the removal treaties; Trail of Tears; Second Seminole War | 19 |
| expansion-and-reservation | 1849-1871 | Treaties of the western expansion: Plains, Pacific Northwest, Great Basin, Southwest; reservation system; Reconstruction treaties | 66 |
| agreement-era | 1871-1913 | After the Act of March 3, 1871; agreements ratified by statute; executive-order reservations; allotment | 6 |
| modern-statutory | 1914-present | Settlement statutes and resolutions (context only) | 3 |

The `era` strings in the CSV carry a year range in parentheses; the counts above group by the prefix.

## Cluster tables

### 1. Colonial context and the Confederation era (1768-1789)

NARA carries seven pre-1778 colonial or British-era items in its numbered series (RIT 1-7) and the University of Nebraska-Lincoln (UNL) portal counts them separately as "British-era." Only Fort Stanwix 1768 is included here, as context for the boundary line that later treaties revisit. The first treaty between the United States and a Native nation is Fort Pitt (Delaware), 1778-09-17 (7 Stat. 13), which `[verified]` in the NARA table as RIT 8. Wikipedia (pointer) reports that the treaty invited other Ohio-Country nations to join the Delaware in forming a state with representation in Congress; I did not verify the text against the treaty itself. The Confederation-era treaties (Fort Stanwix 1784, Fort McIntosh 1785, Hopewell 1785-86, Fort Finney 1786, Fort Harmar 1789) were negotiated by commissioners of the Confederation Congress, often asserting a right of conquest after the Revolutionary War. Many nations rejected that assertion; both the conquest framing and the nations' rejection are `[from-memory]` here.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-007 | 1768-11-05 | Treaty of Fort Stanwix (1768) - Crown boundary line | n/a | n/a (pre-US; British Crown) | n/a (listed in OSU Tribal... | medium |
| T-008 | 1778-09-17 | Treaty with the Delawares (Treaty of Fort Pitt), 1778 | yes | 7 Stat. 13 | Vol. II, p. 3 | high |
| T-009 | 1784-10-22 | Treaty of Fort Stanwix (1784) - Six Nations | yes | 7 Stat. 15 | Vol. II, p. 5 | high |
| T-010 | 1785-01-21 | Treaty of Fort McIntosh, 1785 | yes | 7 Stat. 16 | Vol. II, p. 6 | medium |
| T-011 | 1785-11-28 | Treaty of Hopewell with the Cherokee, 1785 | yes | 7 Stat. 18 | Vol. II, p. 8 | high |
| T-012 | 1786-01-03 | Treaty of Hopewell with the Choctaw, 1786 | yes | 7 Stat. 21 | Vol. II, p. 11 | high |
| T-013 | 1786-01-10 | Treaty of Hopewell with the Chickasaw, 1786 | yes | 7 Stat. 24 | Vol. II, p. 14 | high |
| T-014 | 1786-01-31 | Treaty of Fort Finney (Mouth of the Great Miami) with the Shawnee, 1786 | yes | 7 Stat. 26 | Vol. II, p. 16 | medium |
| T-015 | 1789-01-09 | Treaty of Fort Harmar with the Wyandot and allied nations, 1789 | yes | 7 Stat. 28 | Vol. II, p. 18 | medium |

### 2. Early republic: Senate-ratified treaties, boundary lines and the Ohio Country (1790-1814)

From 1789 the Senate gives advice and consent. The Treaty of New York with the Creeks (1790, 7 Stat. 35) is commonly described as the first Indian treaty ratified by the Senate `[from-memory]`. The Trade and Intercourse Act (1790) makes a federal treaty the only lawful way to transfer Indian land. The two best-known clusters are (a) the Haudenosaunee treaties in New York, where the Treaty of Canandaigua (Pickering Treaty, 1794) acknowledged the Oneida, Onondaga and Cayuga reservations and Seneca boundaries and promised $4,500 in annual goods (Art. 6, as recorded in the seed notes, `[verified]` via the OSU Tribal Treaties Database), and (b) the Northwest Indian War settlement at Greenville (1795), which ceded most of present Ohio and part of Indiana and created the annuity system. The Fort Wayne (1803, 1809), Fort Industry (1805), Detroit (1807) and St. Louis (1804, Sauk and Fox) treaties begin the cession-by-cession treatment of the Old Northwest. The 1804 St. Louis treaty is `[disputed]`: its signatories are reported (Wikipedia, pointer) to have lacked authority to cede, and Black Hawk never accepted it; it was reaffirmed in 1815 and 1816 (RIT 72, 73, 78).

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-017 | 1790-08-07 | Treaty of New York with the Creeks, 1790 | yes | 7 Stat. 35 | Vol. II, p. 25 | high |
| T-018 | 1791-07-02 | Treaty of Holston with the Cherokee, 1791 | yes | 7 Stat. 39 | Vol. II, p. 29 | high |
| T-021 | 1794-11-11 | Treaty of Canandaigua (Pickering Treaty), 1794 - Six Nations | yes | 7 Stat. 44 | Vol. II, p. 34 | high |
| T-022 | 1794-12-02 | Treaty with the Oneida, Tuscarora, and Stockbridge, 1794 | yes | 7 Stat. 47 | Vol. II, p. 37 | medium |
| T-023 | 1795-08-03 | Treaty of Greenville, 1795 | yes | 7 Stat. 49 | Vol. II, p. 39 | high |
| T-025 | 1796-06-29 | Treaty of Colerain with the Creeks, 1796 | yes | 7 Stat. 56 | Vol. II, p. 46 | medium |
| T-027 | 1797-09-15 | Agreement (Treaty of Big Tree) with the Seneca, 1797 | yes | 7 Stat. 601 (Appendix: contract between... | Vol. II (Appendix/agreement; page... | low |
| T-036 | 1803-06-07 | Treaty of Fort Wayne with the Delaware, Shawnee, Potawatomi, Miami, Eel River, Wea,... | yes | 7 Stat. 74 | Vol. II, p. 64 | medium |
| T-043 | 1804-11-03 | Treaty of St. Louis with the Sauk and Fox, 1804 | yes | 7 Stat. 84 | Vol. II, p. 74 | high |
| T-044 | 1805-07-04 | Treaty of Fort Industry, 1805 | yes | 7 Stat. 87 | Vol. II, p. 77 | medium |
| T-054 | 1807-11-17 | Treaty of Detroit, 1807 | yes | 7 Stat. 105 | Vol. II, p. 92 | medium |
| T-057 | 1809-09-30 | Treaty of Fort Wayne (1809) - Delaware, Potawatomi, Miami, Eel River | yes | 7 Stat. 113 | Vol. II, p. 101 | medium |

### 3. Cession and pre-removal treaties (1815-1829)

After the War of 1812 the pattern shifts to repeated large cessions with the Great Lakes nations and to land exchanges with the Southeast nations. Notable: the Creek cession after the Creek War (Fort Jackson, 1814, with the figure of about 23 million acres in the CSV `[from-memory]` and not independently checked); the first Cherokee exchange treaty (1817); the Choctaw Doak's Stand treaty (1820), which exchanged about 5 million acres in Mississippi for about 13 million acres west of the Mississippi; the two Treaties of Indian Springs (1821 and 1825) and the 1826 Treaty of Washington, which annulled the 1825 treaty after the McIntosh faction signed it (the CSV records a minority-faction signing; the claim that the signers lacked the National Council's authority is `[from-memory]`); and the Prairie du Chien (1825) boundary treaty among the Dakota, Anishinaabe, Sauk and Fox and other nations. The Arikara 1825 treaty belongs to the Upper Missouri series (RIT 126-142). Moultrie Creek (1823) confined the Florida tribes to a central-peninsula reservation of about 4 million acres.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-061 | 1814-08-09 | Treaty of Fort Jackson (Capitulation of the Creeks), 1814 | yes | 7 Stat. 120 | Vol. II, p. 107 | high |
| T-070 | 1815-09-08 | Treaty of Spring Wells, 1815 | yes | 7 Stat. 131 | Vol. II, p. 117 | medium |
| T-078 | 1816-05-13 | Treaty of St. Louis with the Sauk of Rock River, 1816 | yes | 7 Stat. 141 | Vol. II, p. 126 | high |
| T-089 | 1817-07-08 | Treaty with the Cherokee (Cherokee Agency), 1817 | yes | 7 Stat. 156 | Vol. II, p. 140 | medium |
| T-090 | 1817-09-29 | Treaty of the Maumee Rapids (Rapids of the Miami of Lake Erie), 1817 | yes | 7 Stat. 160 | Vol. II, p. 145 | medium |
| T-104 | 1818-10-06 | Treaty of St. Mary's with the Miami, 1818 | yes | 7 Stat. 189 | Vol. II, p. 171 | medium |
| T-105 | 1818-10-19 | Treaty with the Chickasaw (Jackson Purchase), 1818 | yes | 7 Stat. 192 | Vol. II, p. 174 | medium |
| T-109 | 1819-09-24 | Treaty of Saginaw with the Chippewa, 1819 | yes | 7 Stat. 203 | Vol. II, p. 185 | medium |
| T-115 | 1820-10-18 | Treaty of Doak's Stand with the Choctaw, 1820 | yes | 7 Stat. 210 | Vol. II, p. 191 | high |
| T-116 | 1821-01-08 | Treaty of Indian Springs (1821) with the Creeks | yes | 7 Stat. 215 | Vol. II, p. 195 | medium |
| T-117 | 1821-08-29 | Treaty of Chicago, 1821 | yes | 7 Stat. 218 | Vol. II, p. 198 | medium |
| T-120 | 1823-09-18 | Treaty of Moultrie Creek (Florida tribes), 1823 | yes | 7 Stat. 224 | Vol. II, p. 203 | high |
| T-125 | 1825-02-12 | Treaty of Indian Springs (1825) with the Creeks (McIntosh treaty) | yes | 7 Stat. 237 | Vol. II, p. 214 | medium |
| T-133 | 1825-07-18 | Treaty with the Arikara, 1825 (Atkinson-O'Fallon treaties) | yes | 7 Stat. 259 | Vol. II, p. 237 | medium |
| T-139 | 1825-08-19 | Treaty of Prairie du Chien (1825) | yes | 7 Stat. 272 | Vol. II, p. 250 | medium |
| T-144 | 1826-01-24 | Treaty of Washington (1826) with the Creeks | yes | 7 Stat. 286 | Vol. II, p. 264 | high |
| T-145 | 1826-08-05 | Treaty of Fond du Lac with the Chippewa, 1826 | yes | 7 Stat. 290 | Vol. II, p. 268 | medium |
| T-148 | 1827-08-11 | Treaty of Butte des Morts, 1827 | yes | 7 Stat. 303 | Vol. II, p. 281 | medium |

### 4. Removal era: Southeast (1830-1848)

The Indian Removal Act (1830) authorized exchange of lands. Dancing Rabbit Creek (Choctaw, 1830-09-27) was the first removal treaty under the Act; its Art. 14 allowed families to remain with allotments. The ratification dates conflict between sources (proclamation 1831-02-24; Senate consent given as 1831-02-25 by Wikipedia) `[disputed]`. Cusseta (Creeks, 1832), Pontotoc Creek (Chickasaw, 1832) and Payne's Landing / Fort Gibson (Seminole, 1832-33) are the Southeast removal treaties; the Seminole leaders later disputed that the delegation had authority to bind the nation `[from-memory]`. New Echota (Cherokee, 1835-12-29) was signed by the Treaty Party, not by the Cherokee National Council or Principal Chief John Ross, and was ratified by one vote in the Senate (1836-05, as recorded in the CSV, `[verified]` via the OSU Tribal Treaties Database and Wikipedia pointer); it is the legal basis for the Trail of Tears. The OSU record carries a Cherokee Nation Attorney General note about successor-in-interest status of the United Keetoowah Band, which the site must treat as tribal-sovereignty-sensitive. Doaksville (1837) placed the Chickasaw within the Choctaw Nation. The 1846 Treaty of Washington reconciled the Cherokee factions in Indian Territory.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-160 | 1830-09-27 | Treaty of Dancing Rabbit Creek with the Choctaw, 1830 | partial | 7 Stat. 333 (supplementary articles 7... | Vol. II, p. 310 | high |
| T-167 | 1832-03-24 | Treaty of Cusseta (Treaty of Washington) with the Creeks, 1832 | yes | 7 Stat. 366 | Vol. II, p. 341 | high |
| T-168 | 1832-05-09 | Treaty of Payne's Landing with the Seminole, 1832 | yes | 7 Stat. 368 | Vol. II, p. 344 | high |
| T-173 | 1832-10-20 | Treaty of Pontotoc Creek with the Chickasaw, 1832 | yes | 7 Stat. 381 | Vol. II, p. 356 | high |
| T-185 | 1833-03-28 | Treaty of Fort Gibson with the Seminole, 1833 | yes | 7 Stat. 423 | Vol. II, p. 394 | high |
| T-199 | 1835-12-29 | Treaty of New Echota with the Cherokee, 1835 | yes | 7 Stat. 478 (supplementary articles of... | Vol. II, p. 439 | high |
| T-220 | 1837-01-17 | Treaty of Doaksville with the Choctaw and Chickasaw, 1837 | yes | 11 Stat. 573 | Vol. II, p. 486 | high |
| T-248 | 1846-08-06 | Treaty of Washington (1846) with the Cherokee | yes | 9 Stat. 871 | Vol. II, p. 561 | medium |

### 5. Removal era: Great Lakes, Upper Midwest and New York (1830-1848)

In the Old Northwest and Upper Midwest the removal-period treaties are mostly large land cessions rather than exchanges: the Black Hawk Purchase (1832, Sauk and Fox strip of eastern Iowa, about 6 million acres in the CSV `[from-memory]`), the Treaty of Chicago (1833, about 5 million acres, with removal by 1838), the Treaty of Washington (1836, Ottawa and Chippewa, about 13.8 million acres in the CSV, `[from-memory]`), St. Peters (1837) and La Pointe (1842). St. Peters (1837) and La Pointe (1842) reserved hunting, fishing and gathering rights, which are the rights litigated in *Minnesota v. Mille Lacs Band of Chippewa Indians*, 526 U.S. 172 (1999) `[from-memory]` (case-law lane belongs to Agent C). The Treaty of Buffalo Creek (1838) is a contested New York removal treaty, later compromised by the 1842 and 1857 (Tonawanda) treaties, whose 1857 version allowed the Tonawanda Band to repurchase its reservation.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-159 | 1830-07-15 | Treaty of Prairie du Chien (1830) - Sauk, Fox, Sioux, Omaha, Iowa, Oto, Missouri | yes | 7 Stat. 328 | Vol. II, p. 305 | medium |
| T-170 | 1832-09-21 | Black Hawk Purchase (Treaty of Fort Armstrong), 1832 | yes | 7 Stat. 374 | Vol. II, p. 349 | high |
| T-189 | 1833-09-26 | Treaty of Chicago with the Chippewa, Ottawa, Potawatomi, 1833 | yes | 7 Stat. 431 | Vol. II, p. 402 | high |
| T-201 | 1836-03-28 | Treaty of Washington (1836) with the Ottawa and Chippewa | yes | 7 Stat. 491 | Vol. II, p. 450 | medium |
| T-223 | 1837-07-29 | Treaty of St. Peters (1837) with the Chippewa | yes | 7 Stat. 536 | Vol. II, p. 491 | high |
| T-242 | 1842-10-04 | Treaty of La Pointe (1842) with the Chippewa of the Mississippi and Lake Superior | yes | 7 Stat. 591 | Vol. II, p. 542 | medium |
| T-230 | 1838-01-15 | Treaty of Buffalo Creek with the New York Indians, 1838 | yes | 7 Stat. 550 | Vol. II, p. 502 | high |
| T-305 | 1857-11-05 | Treaty of Tonawanda Band of Seneca, 1857 | yes | 12 Stat. 991 | Vol. II (page not verified) | low |

### 6. Plains and Southwest: peace, trails and boundaries (1835-1865)

Before 1861 many Plains and Southwest treaties are peace-and-passage treaties, not land cessions: Camp Holmes (1835, the first treaty with the Comanche and Wichita), the Navajo and Ute treaties of 1849, the Apache treaty of 1852, Fort Atkinson (1853), and the Fort Laramie (Horse Creek) treaty of 1851, which defined tribal territories on the northern Plains and recognized US rights of passage and forts, but was not a land cession by the Lakota. The Senate amended Fort Laramie 1851 by reducing the annuity period from 50 to 10 years, which is why it is entered as `partial`; the UNL portal holds a "proposed corrected text" reflecting Senate changes that were never published. The Navajo 1849 treaty row is low confidence because the Stat. page conflicts between sources. The Fort Wise treaty (1861) ceded most of the 1851 Fort Laramie territory of the Arapaho and Cheyenne for a small reservation at Sand Creek and was signed by a minority of chiefs (CSV; legitimacy contested, `[from-memory]`); it precedes the 1864 Sand Creek Massacre. The 1865 Little Arkansas treaty followed the massacre and included reparations for Sand Creek survivors (CSV). The Minnesota Dakota treaties of 1851 (Traverse des Sioux and Mendota) together ceded roughly 24 million acres per Wikipedia (pointer), with the Senate striking Section 3 of Traverse des Sioux.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-198 | 1835-08-24 | Treaty of Camp Holmes with the Comanche, Wichita and others, 1835 | yes | 7 Stat. 474 | Vol. II, p. 435 | medium |
| T-255 | 1849-09-09 | Treaty with the Navajo (Canyon de Chelly / Chuska Valley), 1849 | yes | 9 Stat. 974 | Vol. II, p. 583 | low |
| T-256 | 1849-12-30 | Treaty with the Utah (Abiquiu), 1849 | yes | 9 Stat. 984 | Vol. II, p. 585 | high |
| T-258 | 1851-07-23 | Treaty of Traverse des Sioux (Sisseton and Wahpeton), 1851 | partial | 10 Stat. 949 | Vol. II, p. 588 | medium |
| T-259 | 1851-08-05 | Treaty of Mendota (Mdewakanton and Wahpekute), 1851 | yes | 10 Stat. 954 | Vol. II, p. 591 | medium |
| T-FL1851 | 1851-09-17 | Treaty of Fort Laramie (Horse Creek), 1851 | partial | 11 Stat. 749 | Vol. II, p. 594 | medium |
| T-261 | 1852-07-01 | Treaty with the Apache (Santa Fe), 1852 | yes | 10 Stat. 979 | Vol. II, p. 598 | medium |
| T-262 | 1853-07-27 | Treaty of Fort Atkinson with the Comanche, Kiowa, Apache, 1853 | yes | 10 Stat. 1013 | Vol. II, p. 600 | medium |
| T-304 | 1857-09-24 | Treaty with the Pawnee (Table Creek), 1857 | yes | 11 Stat. 729 | Vol. II, p. 764 | medium |
| T-307 | 1858-04-19 | Treaty with the Yankton Sioux, 1858 | yes | 11 Stat. 743 | Vol. II, p. 776 | low |
| T-315 | 1861-02-18 | Treaty of Fort Wise (Arapaho and Cheyenne of the Upper Arkansas), 1861 | yes | 12 Stat. 1163 | Vol. II, p. 807 | low |
| T-341 | 1865-10-14 | Treaty of Little Arkansas (Cheyenne and Arapaho), 1865 | yes | 14 Stat. 703 | Vol. II, p. 887 | medium |

### 7. Pacific Northwest: the Stevens treaties and Oregon treaties (1853-1855)

Isaac Stevens, as Washington Territory governor and Superintendent of Indian Affairs, negotiated a dense run of treaties in 1854-55: Medicine Creek, Point Elliott, Point No Point, Neah Bay, the Walla Walla Council treaties (Walla Walla, Yakama, Nez Perce), Hellgate, Olympia/Quinault and Lame Bull. They created reservations and reserved, in the Puget Sound and Columbia River treaties, rights to fish at "usual and accustomed" places (for example Yakama Treaty Art. 3). This reserved-rights language underlies *United States v. Washington*, 384 F. Supp. 312 (W.D. Wash. 1974) (the Boldt decision) and *Washington v. Washington State Commercial Passenger Fishing Vessel Ass'n*, 443 U.S. 658 (1979) `[from-memory]`, to be verified by the case-law agent. Rogue River (Table Rock, 1853), Warm Springs (1855) and the Klamath-Modoc-Yahooskin treaty (1864) are the Oregon cluster; Klamath reservation status was terminated in 1954 `[from-memory]`. The Nez Perce 1855 treaty reserved about 7.7 million acres; the 1863 treaty (the "Steal Treaty"), signed by the Lapwai faction without Joseph's band, reduced it by about 90 percent (CSV figure; the 1868 treaty amended it). The 1863 and 1868 Nez Perce Stat. page numbers are `[from-memory]`.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-263 | 1853-09-10 | Treaty with the Rogue River Indians (Table Rock), 1853 | yes | 10 Stat. 1018 | Vol. II, p. 603 | medium |
| T-281 | 1854-12-26 | Treaty of Medicine Creek, 1854 | yes | 10 Stat. 1132 | Vol. II, p. 661 | medium |
| T-283 | 1855-01-22 | Treaty of Point Elliott, 1855 | yes | 12 Stat. 927 | Vol. II, p. 669 | medium |
| T-284 | 1855-01-26 | Treaty of Point No Point, 1855 | yes | 12 Stat. 933 | Vol. II, p. 674 | medium |
| T-286 | 1855-01-31 | Treaty of Neah Bay (Makah), 1855 | yes | 12 Stat. 939 | Vol. II, p. 682 | low |
| T-289 | 1855-06-09 | Treaty of Walla Walla (Cayuse, Umatilla, Walla Walla), 1855 | yes | 12 Stat. 945 | Vol. II, p. 694 | medium |
| T-290 | 1855-06-09 | Yakama Treaty, 1855 | yes | 12 Stat. 951 | Vol. II, p. 698 | medium |
| T-291 | 1855-06-11 | Nez Perce Treaty of 1855 | yes | 12 Stat. 957 | Vol. II, p. 702 | low |
| T-293 | 1855-06-25 | Treaty with the Tribes of Middle Oregon (Warm Springs), 1855 | yes | 12 Stat. 963 | Vol. II, p. 714 | low |
| T-294 | 1855-07-01 | Treaty of Olympia / Quinault River (Quinault, Quileute), 1855-56 | yes | 12 Stat. 971 | Vol. II, p. 719 | medium |
| T-295 | 1855-07-16 | Hellgate Treaty (Bitterroot Salish, Pend d'Oreille, Kootenai), 1855 | yes | 12 Stat. 975 | Vol. II, p. 722 | medium |
| T-299 | 1855-10-17 | Lame Bull Treaty (Blackfeet), 1855 | yes | 11 Stat. 657 | Vol. II, p. 736 | medium |
| T-323 | 1863-06-09 | Nez Perce Treaty of 1863 ('Steal Treaty') | yes | 14 Stat. 647 | Vol. II, p. 843 | medium |
| T-332 | 1864-10-14 | Treaty with the Klamath, Modoc and Yahooskin Band of Snake, 1864 | yes | 16 Stat. 707 | Vol. II, p. 865 | low |
| T-374 | 1868-08-13 | Nez Perce Treaty (1868 amendatory) - last ratified treaty | yes | 15 Stat. 693 | Vol. II, p. 1024 | medium |

### 8. Great Basin and the Upper Great Lakes (1854-1863)

The 1863 Great Basin treaties (Fort Bridger, Box Elder, Ruby Valley) are peace-and-passage treaties, and the Western Shoshone position is that Ruby Valley did not cede land title (CSV note, `[from-memory]` for the position; it is the subject of long-running litigation in the Indian Claims Commission and the Supreme Court, *United States v. Dann*, 470 U.S. 39 (1985) `[from-memory]`). Several of these treaties show odd Stat. cites (18 Stat. 685, 689; 16 Stat. 707) because the Senate ratified them years before their publication; I record the cite as found in the Stat. index and flag the lag as `[from-memory]`. The Treaty of La Pointe (1854) created Bad River, Red Cliff, Lac Courte Oreilles, Lac du Flambeau, Fond du Lac, Grand Portage and other reservations, and the Treaty of Detroit (1855) set aside tracts for the Ottawa and Chippewa bands of Michigan.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-275 | 1854-09-30 | Treaty of La Pointe (1854) with the Chippewa of Lake Superior and the Mississippi | yes | 10 Stat. 1109 | Vol. II, p. 648 | medium |
| T-296 | 1855-07-31 | Treaty of Detroit (1855) with the Ottawa and Chippewa of Michigan | yes | 11 Stat. 621 | Vol. II, p. 725 | medium |
| T-324 | 1863-07-02 | Treaty of Fort Bridger (1863) with the Eastern Shoshone | yes | 18 Stat. 685 | Vol. II, p. 849 | low |
| T-325 | 1863-07-30 | Treaty of Box Elder (Northwestern Shoshone), 1863 | yes | 13 Stat. 663 | Vol. II, p. 850 | low |
| T-326 | 1863-10-01 | Treaty of Ruby Valley (Western Shoshone), 1863 | yes | 18 Stat. 689 | Vol. II, p. 851 | medium |

### 9. Reconstruction treaties of 1866 (Indian Territory)

The Five Tribes had signed treaties with the Confederate States in 1861; after the war the United States required new treaties in 1866 that required freedmen provisions (emancipation and citizenship terms, `[from-memory]` in detail), took the Leased District or western lands, and allowed railroad rights-of-way. The 1861 Confederate treaties are not US treaties and are excluded from the counts. The four 1866 treaties in the seed are low confidence on the Stat. and Kappler page numbers (the Stat. vol. 14 OCR index was used).

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-352 | 1866-03-21 | Reconstruction Treaty with the Seminole, 1866 | yes | 14 Stat. 755 | Vol. II, p. 910 | low |
| T-355 | 1866-04-28 | Reconstruction Treaty with the Choctaw and Chickasaw, 1866 | yes | 14 Stat. 769 | Vol. II, p. 918 | low |
| T-356 | 1866-06-14 | Reconstruction Treaty with the Creeks, 1866 | yes | 14 Stat. 785 | Vol. II, p. 931 | low |
| T-358 | 1866-07-19 | Reconstruction Treaty with the Cherokee, 1866 | yes | 14 Stat. 799 | Vol. II, p. 942 | low |

### 10. The 1867-68 Peace Commission treaties

The Medicine Lodge treaties (1867) with the Kiowa, Comanche, Apache, Cheyenne and Arapaho and the Fort Laramie treaties of 1868 closed the treaty era on the Plains. Fort Laramie 1868 established the Great Sioux Reservation (including the Black Hills) and "unceded Indian territory" and promised that no further cession would be valid without the signatures of three-fourths of adult male Lakota (Art. 12); the Black Hills were later taken by statute without that consent (see section 14). The Stat. page for the 1868 treaty is `[disputed]`: my OCR index reads p. 685 and the Wikipedia pointer reads 635; the CSV uses 635 and flags it. The NAID for the treaty is also in conflict (299803 on archives.gov vs. 183517089 in the catalog table); the CSV records both. The Navajo Treaty of 1868 (Bosque Redondo) ended the Long Walk captivity and created a reservation of about 3.5 million acres in the CSV, with the right to return home. The Fort Bridger Treaty of 1868 created the Wind River and Fort Hall reservations. The Nez Perce 1868 treaty (RIT 374) is the last item in NARA's ratified series.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| T-364 | 1867-10-21 | Treaty of Medicine Lodge (Kiowa and Comanche), 1867 | yes | 15 Stat. 581 | Vol. II, pp. 977-982 | high |
| T-365 | 1867-10-21 | Treaty of Medicine Lodge (Kiowa, Comanche and Apache), 1867 | yes | 15 Stat. 589 | Vol. II, pp. 982-984 | high |
| T-366 | 1867-10-28 | Treaty of Medicine Lodge (Cheyenne and Arapaho), 1867 | yes | 15 Stat. 593 | Vol. II, pp. 984-989 | high |
| T-367 | 1868-03-02 | Treaty with the Ute (Kit Carson Treaty), 1868 | yes | 15 Stat. 619 | Vol. II, p. 990 | medium |
| T-369 | 1868-04-29 | Treaty of Fort Laramie (1868) - Lakota (Sioux) and Arapaho | yes | 15 Stat. 635 | Vol. II, p. 998 | medium |
| T-370 | 1868-05-07 | Treaty with the Crow, 1868 | yes | 15 Stat. 649 | Vol. II, p. 1008 | medium |
| T-371 | 1868-05-10 | Treaty with the Northern Cheyenne and Northern Arapaho (Fort Laramie), 1868 | yes | 15 Stat. 655 | Vol. II, p. 1002 | medium |
| T-372 | 1868-06-01 | Treaty of Bosque Redondo (Fort Sumner) with the Navajo, 1868 | yes | 15 Stat. 667 | Vol. II, p. 1015 | medium |
| T-373 | 1868-07-03 | Fort Bridger Treaty of 1868 (Eastern Shoshone and Bannock) | yes | 15 Stat. 673 | Vol. II, p. 1020 | medium |

### 11. The 18 unratified California treaties (1851-1852)

Three federal commissioners (Redick McKee, George W. Barbour and Oliver M. Wozencraft) negotiated 18 treaties with California Indian bands between March 1851 and January 1852. The Senate rejected them in secret session in July 1852 (the date is `[disputed]`: 1852-07-08 per Heizer and the Mechoopda page, 1852-07-02 per the NARA Prologue article), and the injunction of secrecy was lifted on 1905-01-18. The treaties were then not published until 1905. The letters A-R follow Heizer (1972); the tribe names are as printed in the 1850s and the present-day nation identification requires tribal consultation. The Mechoopda Indian Tribe's history page (a tribal self-description) says the proposed reservations totalled "more than eight million acres"; Heizer does not give a total. The dates for Treaty B (13 May vs 30 May 1851) and Treaty K (Temecula, 1851-09-18 vs 1852-01-05) conflict inside the sources; the CSV uses Heizer's schedule date and notes the conflict. Heizer (p. 5) directs readers to Royce's map for the 18 cession areas; no boundaries are digitized in this seed. California is also the region where unratified treaties had the largest practical effect: the Indians relinquished claims, and the state and settlers behaved as though no obligation existed. That reading is the interpretation of the Prologue article and the tribal pages and is not tested against a legal source here.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| U-CA-A | 1851-05-13 | California Treaty A: Camp Belt, King's River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-B | 1851-05-30 | California Treaty B: Camp Keyes, Cah-wai River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-C | 1851-06-03 | California Treaty C: Camp Burton, Paint Creek, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-D | 1851-06-10 | California Treaty D: Camp Persifer F. Smith, Texan Pass, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-E | 1851-05-28 | California Treaty E: Dent's and Vantine's Crossings (Stanislaus River), 1851... | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-F | 1851-07-18 | California Treaty F: Camp Union, near Yuba River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-G | 1851-08-01 | California Treaty G: Bidwell's Ranch, Chico Creek, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-H | 1851-08-16 | California Treaty H: Reading's Ranch, Cotton Wood Creek, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-I | 1851-09-09 | California Treaty I: Camp Colus, Sacramento River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-J | 1851-09-18 | California Treaty J: Fork of Cosumnes River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-K | 1852-01-05 | California Treaty K: Village of Temecula, 1852 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-L | 1852-01-07 | California Treaty L: Village of Santa Isabel, 1852 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-M | 1851-03-19 | California Treaty M: Camp Fremont, near Little Mariposa River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-N | 1851-04-29 | California Treaty N: Camp Barbour, San Joaquin River, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-O | 1851-08-20 | California Treaty O: Camp Lu-pi-yu-ma, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-P | 1851-08-22 | California Treaty P: Camp Fernando Feliz, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-Q | 1851-10-06 | California Treaty Q: Camp Klamath, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |
| U-CA-R | 1851-11-04 | California Treaty R: Camp in Scott's Valley, 1851 (unratified) | no | none (unratified; text printed Senate Ex.... | none (not in Kappler Vol. II... | medium |

### 12. Other unratified treaties (examples)

These three are included because each is cited in the secondary literature as a significant unratified instrument. The total number of unratified treaties is not established (A1 section 5).

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| U-PIKE1805 | 1805-09-23 | Treaty with the Sioux (Pike), 1805 | no | none (not in Statutes at Large) | Vol. II, p. 1031 | low |
| U-CHER1835 | 1835-03-14 | Treaty with the Cherokee, 1835-03-14 (unratified) | no | none | Vol. II, p. 1041 | medium |
| U-FRANKLIN1830 | 1830-08 | Franklin Treaty with the Chickasaw, 1830 (unratified) | no | none | n/v | low |

### 13. International instruments that affected Native lands (context, not US-Native treaties)

These are labeled as context. Native nations were not parties. Guadalupe Hidalgo (1848) transferred the Mexican Cession; Art. XI (restraining raids) was annulled by the Treaty of Mesilla (1853, Wikipedia pointer). The Alaska cession (1867) transferred Russian claims, leaving Alaska Native land title to be dealt with by later statute (ANCSA 1971). The 1849 US-Hawaiian Kingdom treaty is a foreign-relations treaty with an independent state. Hawai'i is outside the US-Native nation treaty corpus; its inclusion is for context and for the Apology Resolution (1993), whose text acknowledges the 1893 overthrow.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| X-GH1848 | 1848-02-02 | Treaty of Guadalupe Hidalgo (US-Mexico), 1848 | yes | 9 Stat. 922 | n/a (not in Kappler Vol. II) | medium |
| X-AK1867 | 1867-03-30 | Treaty of Cession of Alaska (US-Russia), 1867 | yes | 15 Stat. 539 | n/a | medium |
| X-HI1849 | 1849-12-20 | Treaty of Friendship, Commerce and Navigation (US-Kingdom of Hawai'i), 1849 | yes | 9 Stat. 977 | n/a | medium |

### 14. Statutes, agreements and executive orders (1790-1993)

This cluster separates instruments that are not treaties. The Trade and Intercourse Act (1790) and the Indian Removal Act (1830) set the legal frame. The Act of March 3, 1871 ended treaty-making but preserved prior obligations. The Brunot Agreement (1873-74) with the Ute is an agreement ratified by statute. The Black Hills Agreement of 1877 (Act of Feb. 28, 1877) took the Black Hills and the unceded territory by statute after the 1876 war, without the three-fourths consent required by Fort Laramie 1868 Art. 12; *United States v. Sioux Nation of Indians*, 448 U.S. 371 (1980) held that a taking requiring just compensation had occurred, and the Lakota have refused the monetary award (as reported by the Wikipedia pointer; the amount grew with interest). The Jerome Agreement (negotiated 1892, enacted 1900) opened the Kiowa-Comanche-Apache reservation to allotment, and *Lone Wolf v. Hitchcock*, 187 U.S. 553 (1903), held that Congress has plenary power to override treaty terms. The Dawes Act (1887) is the allotment statute. The Hopi reservation (1882) is an executive-order reservation. ANCSA (1971), the Maine Indian Claims Settlement Act (1980) and the Apology Resolution (1993) are modern statutory context.

| ID | Signed | Instrument | Ratified | Stat. cite | Kappler cite | Conf. |
|---|---|---|---|---|---|---|
| S-1790 | 1790-07-22 | Trade and Intercourse Act (Nonintercourse Act), 1790 | yes | 1 Stat. 137 | n/a | medium |
| S-1830 | 1830-05-28 | Indian Removal Act, 1830 | yes | 4 Stat. 411 | n/a | medium |
| S-1871 | 1871-03-03 | Indian Appropriation Act of March 3, 1871 (end of treaty-making) | yes | 16 Stat. 544, 566 (ch. 120, sec. 1);... | n/a | high |
| A-1874 | 1873-09-13 | Brunot Agreement with the Ute, 1873-74 | yes | 18 Stat. 36 [from-memory] | Kappler Vol. I (laws)... | low |
| A-1877 | 1876-09 | Black Hills Agreement (Act of February 28, 1877) - Lakota | yes | 19 Stat. 254 [from-memory] | Kappler Vol. I, p. 166... | medium |
| S-1887 | 1887-02-08 | General Allotment (Dawes) Act, 1887 | yes | 24 Stat. 388 | n/a | medium |
| A-1900 | 1892-10 | Jerome Agreement (Kiowa, Comanche, Apache), 1892 / Act of 1900 | yes | 31 Stat. 672 [from-memory] | n/a | medium |
| X-HOPI1882 | 1882-12-16 | Executive Order creating the Hopi Reservation, 1882 | n/a | n/a (executive order; Kappler Vol. I,... | Kappler Vol. I [from-memory] | low |
| S-ANCSA1971 | 1971-12-18 | Alaska Native Claims Settlement Act (ANCSA), 1971 | yes | 85 Stat. 688 (Pub. L. 92-203) | n/a | medium |
| S-MAINE1980 | 1980-10-10 | Maine Indian Claims Settlement Act, 1980 | yes | 94 Stat. 1785 [from-memory] | n/a | low |
| S-HI1993 | 1993-11-23 | Apology Resolution (Pub. L. 103-150), 1993 | yes | 107 Stat. 1510 | n/a | medium |

## Rows not placed in a cluster

None: every row in the seed appears in one cluster above.

## Coverage of the seed

| Region (CSV `region`) | Rows | Note |
|---|---|---|
| Southeast | 28 | Cherokee, Creek, Choctaw, Chickasaw, Seminole; removal cluster is well covered |
| Great Lakes / Old Northwest | 26 | Ohio Country through Michigan, Wisconsin and Minnesota |
| Plains | 21 | Includes the Minnesota Dakota, Fort Laramie, Medicine Lodge |
| California | 18 | All 18 unratified treaties (Heizer A-R); no ratified California treaty exists in this seed |
| Pacific Northwest | 14 | Stevens treaties, Oregon treaties, Nez Perce |
| Northeast | 8 | Haudenosaunee and New England under-represented relative to the corpus |
| Southwest | 8 | Navajo, Ute, Apache; Pueblo and Tohono O'odham history is not treaty-based and is not represented |
| Great Basin | 4 | Eastern, Northwestern and Western Shoshone |
| Multi-region | 4 | Statutes and Act of 1871 |
| Alaska, Hawaii | 2 each | Context only (ANCSA, Alaska cession; Hawaiian Kingdom treaty, Apology Resolution) |

**Selection method.** The seed is representative, not exhaustive. Rows were chosen to (1) span every region and era, (2) include the treaties that litigation and public memory most often cite, and (3) include every unratified California treaty. The 376-row NARA index (`seed-data/nara-ratified-treaties-index.csv`) is the complete ratified list for the atlas to expand into; 99 of its rows are flagged as already in the seed. Seed rows are not a sample designed for statistical inference.

**Known omissions worth adding next:** the Haudenosaunee and Wabanaki treaties beyond Canandaigua (and the 1794 Oneida group); Treaty of Greenville's later Fort Wayne and Vincennes cluster beyond the rows above; the Osage, Quapaw, Kansa, Pawnee and Omaha cession treaties; the Pueblo-related Spanish and Mexican land grant context; and the post-1871 agreements, for which no count is established (A1 section 6).

## Cross-cutting findings

1. **Treaty cites are the weakest field.** The NARA RIT number, date, and NAID are `[verified]` for every numbered row because they come from the NARA table. The Stat. page and Kappler page are `[verified]` only for the rows tagged `high`, which are a minority (31 of 135 by the CSV's own tags). Page numbers drawn from OCR'd Stat. volume indexes (especially vols. 11 and 12) contain visible errors. The verification agent should check every Stat. and Kappler page against the LOC Statutes at Large scans or the OSU Kappler pages before publication.
2. **Ratification dates differ by event.** A treaty has a signing date, a Senate consent date, a ratification-by-president date and a proclamation date. The seed's `date_ratified` uses the event named in `date_ratified_basis`; Dancing Rabbit Creek and New Echota show the problem. The atlas should store all four dates when it can.
3. **Signing authority is a recurring legal and moral issue.** Several treaties in the seed were signed by a faction or by individuals whose authority was disputed (Sauk 1804, Indian Springs 1825, Payne's Landing 1832, New Echota 1835, Fort Wise 1861, Nez Perce 1863). The atlas needs a "signatory authority disputed" flag with sources, not a verdict.
4. **Reserved rights survive cessions.** The Stevens treaties (fishing), the Chippewa treaties of 1837, 1842 and 1854 (hunting, fishing, gathering), and others reserve rights on ceded land. A cession polygon is therefore not a "territory lost" polygon in the legal sense, and the atlas should distinguish ceded-land rights from reservation boundaries.
5. **Acreage figures are rounded or missing.** Where the CSV carries an acreage figure it is as stated by one source and is tagged in the basis column. Royce's (1899) cession areas, the Indian Claims Commission findings and tribal accounts can produce materially different acreages for the same treaty.
6. **Names.** The seed uses NARA and Kappler spellings. Replace with tribal endonyms (with tribal approval) for public display.

## Sources

Consulted this session:
- National Archives, Ratified Indian Treaties catalog links (RIT numbers, dates, names, NAIDs): https://www.archives.gov/research/native-americans/treaties/catalog-links
- National Archives, American Indian Treaties: https://www.archives.gov/research/native-americans/treaties
- National Archives Prologue, California treaties: https://Www.archives.gov/publications/prologue/2013/fall-winter/treaties.pdf
- IDA Treaties Explorer: https://digitreaties.org/
- OSU Tribal Treaties Database (treaty texts, notes on ratification, tribal responses): https://treaties.okstate.edu/ , https://treaties.okstate.edu/treaties/ , https://treaties.okstate.edu/indexes/kapplers-index
- UNL American Indian Treaties Portal: https://treatiesportal.unl.edu/
- Statutes at Large volume index PDFs (OCR): https://dheller.org/Timeline-files/US-Statutes/v7/Treaties-v7-List.pdf and the v9, v10, v11, v12, v13, v14, v15, v16 equivalents
- Heizer (1972), Eighteen Unratified Treaties of 1851-1852: https://digicoll.lib.berkeley.edu/record/83366/files/arfs003-001.pdf
- Mechoopda Indian Tribe, treaties: https://mechoopda-nsn.gov/history/treaties
- Pechanga Band, California treaties: https://www.pechanga-nsn.gov/index.php/history/facts-or-myths/pechanga-history-fact-or-myth/california-treaties
- Wikipedia (pointer only): individual articles on the treaties and statutes named above, used to locate Stat. and Kappler cites and context. Specific article URLs are recorded per row in the `source_url` column of `seed-data/treaties-seed.csv`.
- A1 sources, same folder: `A1-treaty-framework-and-counts.md`

## Confidence & Gaps

**Confidence: medium.** The identification, date and NARA number of each ratified treaty are high confidence. The land descriptions, acreage and many Stat. and Kappler page numbers are not.

**Not verified:**
- Stat. and Kappler page numbers for most `medium` and `low` rows; the CSV notes flag which are `[from-memory]` and which conflict with OCR indexes.
- Acreage figures; most are blank, and the ones present (for example Fort Jackson, Black Hawk Purchase, Chicago 1833, Treaty of Washington 1836) are from a single source or `[from-memory]`.
- Treaty texts. I did not read the full text of most treaties; land descriptions are summaries from the OSU Tribal Treaties Database, Wikipedia (pointer) and NARA titles.
- The legal holdings and citations of the cases named in the narrative (Boldt, Passenger Fishing Vessel, Mille Lacs, Dann, Lone Wolf, Sioux Nation); they are context only and belong to the case-law agent.
- The Fort Laramie 1851 NARA numbering (A1 section 4.4).
- The OSU Tribal Treaties Database full list for treaties after 1818 and the OU Law Library holdings were not retrieved.
- The WebSearch quota was exhausted during the session, so some leads (for example the post-1871 agreement count and the Navajo 1849 Stat. page) were not run to ground.
- No tribal-source review has taken place. Every tribal-nation name, successor identification and treaty summary needs tribal consultation before public display.
