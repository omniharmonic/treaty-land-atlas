# Land promised by treaty, and what became of it

Benjamin Life (@omniharmonic). Research-assistant draft, 2026-10-20. Finding ids WEB-PRM-001 to 036 (see `web-promised.csv` beside this file).

Method note: repo counts and acreages were computed by me from `crosswalks/royce-entry-roles.csv` and `data/derived/cessions.json` (spherical polygon area; overlapping Royce polygons double-count). Web work used search only: most hosts (arcgis.com, loc.gov, usgs.gov, fs.usda.gov, wikipedia) were blocked from this sandbox, so dataset metadata comes from search-result abstracts and is marked to verify. Treaty boundary wording below is from widely reprinted Kappler texts, quoted from memory where marked; check against Kappler page images before publishing.

## 1. Summary (10 lines)

1. The repo already holds most "promised" land: 498 of 724 Royce areas carry a reserved, confirmed or described_or_recognized role; 491 of them have geometry. No new data is needed to draw a first "promised" layer.
2. Of those 498, 259 were ceded or taken by 1894, 227 were still "kept", 12 unclear. Only 7 Royce areas lack geometry (47, 65, 128, 129, 130, 543, 690).
3. "Kept" means kept as of Royce's last dates (to 1894). Allotment and surplus-land acts after that took about 90 million acres (138M in 1887 to 48M in 1934). The map's "kept" class therefore overstates 20th-century Native landholding.
4. The 19 California reserve polygons from the 18 unratified treaties (about 8.5 million acres in repo geometry) are coded "kept". They were never reserved in law. Their paired "ceded" areas were never ceded either.
5. Royce 516 is labelled the Great Sioux Reservation but measures about 4.3 million acres; the 1868 Art. 2 reservation is better rebuilt from 598 + 699 + 700-705 (about 27.7 million acres).
6. Crosswalk summaries repeat Royce's "Fort Laramie 1851 never ratified". The Senate ratified it with an amendment (1852); it was never proclaimed, and the Crow did not assent to the amendment.
7. Fort Laramie 1851 territories are only partly mapped (fragments 300, 398, 399, 426, 517, 529). Article 5 gives metes-and-bounds descriptions good enough to digitize all seven.
8. No open vector layer of the 1851 territories was found. The best open "recognized land" dataset is the 1978 ICC map "Indian Land Areas Judicially Established" (USGS, public domain), with two vector copies online, one carrying ICC DOCKET fields.
9. McGirt v. Oklahoma (2020) is the clearest proof that "promised" is not only history: the 1866 Creek reservation was never disestablished. The atlas's today layer still shows it as a Census "Creek OTSA (statistical)".
10. Diminishment is case by case (Solem, Parker: not diminished; Rosebud, Yankton, Hagen, Wind River 2017: diminished), so the map needs a per-reservation diminishment attribute after 1894.

## 2. What the atlas most likely gets wrong or flattens

- `src/lib/land.ts` ROLE_KIND maps reserved and described_or_recognized to "kept". That collapses "recognized as already Native" (1851), "reserved from a cession" (most), and "promised but never delivered" (California, Little Arkansas 1865, Medicine Lodge Cheyenne-Arapaho 1867, Bitterroot 1855) into one green.
- Status "kept" freezes at 1894 (WEB-PRM-003). Pine Ridge, Rosebud, Standing Rock, Cheyenne River (700-703), Crow (715), Flathead (374), Wind River (540), Kiowa-Comanche-Apache (478) were all opened to settlers after 1900.
- Takings by executive order coded "ceded": e.g. Fort Berthold 529 ("considered as ceded"), and the Black Hills 597/598 under an 1877 act without the Art. 12 three-fourths consent.
- Royce 516 identity (above). Royce 616/617 (Ute) ceded vs retained is unresolved in the repo's own notes.
- Fort Laramie 1851 "never ratified" wording in rows 398, 399, 426, 517.
- Greenville 1795: only the land the tribes gave up is drawn, not the land the United States promised they would "quietly enjoy" beyond the line.
- The today layer (Census AIANNH) labels the Five Tribes as OTSAs, not reservations.

## 3. Promised and reserved land, with boundaries

Royce numbers are from the repo crosswalk; acreages are repo-polygon areas (approximate).

**Fort Laramie, Sept. 17, 1851, Art. 5 (2 Kappler 594).** Territories recognized, not granted; nations kept claims to other lands. Descriptions (quoted from memory of Kappler; verify):
- Sioux: from the mouth of the White Earth River on the Missouri, southwest to the forks of the Platte, up the North Platte to Red Butte (where the road leaves the river), along the Black Hills to the head of Heart River, down Heart River to the Missouri, down the Missouri to the start.
- Gros Ventre (Hidatsa), Mandan, Arikara: mouth of Heart River, up the Missouri to the Yellowstone, up the Yellowstone to Powder River, southeast to the head of the Little Missouri, along the Black Hills to the head of Heart River, down Heart River to the start. (Repo 529, 620, 621.)
- Assiniboine: mouth of the Yellowstone, up the Missouri to the Musselshell, southeast to the head of Big Dry Creek, down it to the Yellowstone near Powder River, down the Yellowstone to the start.
- Blackfoot (non-signatory): mouth of the Musselshell, up the Missouri to its source, along the Rockies south to the head of the northern source of the Yellowstone, down it to Twenty-five Yard Creek, across to the head of the Musselshell, down it to the start. (398, 399.)
- Crow: mouth of Powder River, up it to its source, along the Black Hills and Wind River Mountains to the head of the Yellowstone, down it to Twenty-five Yard Creek, to the head of the Musselshell, down it to its mouth, to the head of Big Dry Creek, down it to its mouth. (517, 30.1M acres.)
- Cheyenne and Arapaho: Red Butte on the North Platte, up it to its source, along the Rockies to the head of the Arkansas, down the Arkansas to the Santa Fe road crossing, northwest to the forks of the Platte, up the Platte to the start. (426, 47.4M acres.)
- Later: Fort Wise 1861 (426 ceded, 477 reserve); Crow 1868 (517); Fort Berthold EO 1870 (529); Blackfeet 1855/1873/1874/1888 (565, 574, 692-695); Sioux 1868 (Great Sioux Reservation).

**Fort Laramie, Apr. 29, 1868 (15 Stat. 635).** Art. 2: east bank of the Missouri at 46N, down to the Nebraska north line, west along it to 104W, north to 46N, east to the start; "absolute and undisturbed use and occupation". Art. 16: country north of the North Platte and east of the Big Horn summits "unceded Indian territory". Art. 11: hunting on the Republican Fork. Art. 12: no cession valid without three-fourths of adult males. Reduced by: 1875 agreement (584), 1876 agreement / 1877 act (597, 598 Black Hills), 1889 act (699 restored; six reservations 700-705), then surplus acts 1904-1910. Sioux Nation (1980): taking, compensation, no land.

**Medicine Lodge, Oct. 21 and 28, 1867 (15 Stat. 581, 593).** Kiowa-Comanche-Apache reservation cut from the 1865 reserve (511) to the land between the Washita and Red rivers west of 98W (478); Art. 12 three-fourths rule; Jerome Agreement 1892, ratified 1900, about 2.99M acres opened 1901; Lone Wolf (1903). Cheyenne-Arapaho: reserve in the Cherokee Outlet between the Kansas line and the Cimarron, never occupied; replaced by EO Aug. 10, 1869 (525, 4.3M acres), ceded 1891.

**Fort Wise, Feb. 18, 1861 (12 Stat. 1163) and Little Arkansas, Oct. 14, 1865 (14 Stat. 703).** Fort Wise reserve on the Arkansas and Sand Creek (477, 3.7M acres); the Sand Creek massacre (Nov. 29, 1864) happened there; ceded 1865. Little Arkansas Art. 2 reserve (partly Kansas, partly Indian Territory) never established; relinquished 1867.

**Ute, Mar. 2, 1868 (15 Stat. 619).** Art. 2: from where 107W crosses Colorado's south line, north to 15 miles north of 40N, west to the Utah line, south to the New Mexico line, east to the start. Repo 566 + 616 + 617 (about 16M acres). Brunot 1873 (566); act of June 15, 1880 after the 1879 White River events, removal of White River and Uncompahgre bands 1881; Southern Ute strip retained (617).

**Fort Bridger, July 3, 1868 (15 Stat. 673).** Wind River reservation (539 + 540, 3.2M acres) from a recognized 1863 country of about 44M acres. 1872 cession of the southern part (539); 1905 act opening the north; Wyoming v. EPA (10th Cir. 2017) held it diminished.

**Indian Territory guarantees (1828-1838).** Removal Act 1830 sec. 3 (4 Stat. 411) guaranty; Jackson's 1829 talk, "as long as the grass grows or the water runs" (a talk, not a treaty). Cherokee 1828 and 1833, New Echota 1835 (7 Stat. 478) with patent Dec. 31, 1838 (492 nation; 489 Outlet; 490 Neutral Land). Choctaw-Chickasaw patent Mar. 23, 1842 (367; 485 Leased District). Creek 1832/1833 with patent Aug. 11, 1852 (486, 487, 698); Seminole 1856 and 1866 (480, 481). Taken by 1866 Reconstruction treaties, 1889-1893 sales, Curtis Act 1898, allotment and statehood 1907; Creek reservation affirmed in McGirt (2020).

**Greenville, Aug. 3, 1795 (7 Stat. 49).** Line from the mouth of the Cuyahoga up to the Tuscarawas portage, to Fort Laurens, west to Loramie's store, to Fort Recovery, then south to the Ohio opposite the Kentucky River. Art. 4-5: US relinquished claims beyond the line; tribes "quietly to enjoy them". Then cut repeatedly by Harrison-era and later treaties, 1803-1840s.

**Hellgate, July 16, 1855 (12 Stat. 975).** Jocko reserve (374, 1.46M acres); Art. 11 conditional Bitterroot reserve above Lolo Fork pending survey; EO 1871, Garfield agreement 1872 (Charlo's mark disputed), removal 1891; Flathead Allotment Act 1904, opened 1910. Other Stevens reserves in the repo: 348-372, 441 (Nez Perce 1855, 6.6M acres, cut 1863 to 442).

**Navajo, June 1, 1868 (15 Stat. 667).** 37N on the north; east-west line through old Fort Defiance on the south; meridian through Bear Spring (Ojo del Oso) on the east; about 109 30'W on the west (518, 3.3M acres). Later enlarged (608, 615 and 20th-century EOs and acts).

**California, 1851-1852.** 19 reserve polygons (Royce 273-309 odd and even as listed in CSV), about 8.5M acres; never ratified; secrecy to 1905.

**Kansas emigrant reservations.** Delaware (488), Shawnee, Potawatomi (433), Sauk and Fox (419, 494), Chippewa-Munsee (417, 418), Kickapoo, Ottawa, Miami, Wyandot, Iowa: promised as permanent homes after removal, reduced from 1854 and mostly emptied by second removals by 1873.

## 4. Datasets with geometry

| Dataset | Format / URL | License | Coverage | Caveats |
|---|---|---|---|---|
| Royce reserved areas (USFS layer, in repo) | GeoJSON (repo); USFS ArcGIS | public domain (repo GEO-001) | 1784-1894, 717 polygons with geometry | Georeferenced 1899 maps; overlaps; stops 1894 |
| Indian Land Areas Judicially Established (USGS/ICC 1978) | print 1:4,000,000; DOI 10.3133/70114965; USGS Store 101505; LOC item 80695449; UND Commons | US federal work, public domain | contiguous US, ICC/Court of Claims findings | Small scale; shows proven aboriginal title, not treaty reserves |
| Vector copies of the ICC map | Esri FeatureServer services1.arcgis.com/fBc8EJBxQRMcHlei/.../Indian_Land_Areas_Judicially_Established_1978 (layer 5); Coeur d'Alene Tribe gis.cdatribe-nsn.gov/.../Boundaries_JudiciallyEstablishedIndianLands | not stated; tribal service says not a legal boundary | as map; tribal copy has DOCKET, CITATIONS, TRIBE fields | Could not open (blocked); confirm owner and permission |
| Fort Laramie 1851 GIS | none open found; NLD treaty polygon; USFS text PDF; UM map PDF | NLD restricted (repo E1) | | Digitize from Art. 5 in-house |
| Invasion of America (Saunt) | ArcGIS web app, eHistory | none found | 1776-1887 | UX model only (matches repo A3/E2) |
| Univ. of Arizona historical reservations | Open Geoportal, 1870-1980 snapshots | not confirmed | Arizona only | Only time-series reservation GIS found |
| Census AIANNH, BIA LAR (in repo) | TIGER SHP; ArcGIS REST | public domain / reference only | today | OTSA labels lag McGirt |
| Land-Grab U (in repo) | SHP/CSV | CC0 vs ODbL/CC BY-SA conflict | Morrill parcels | Case-study layer only |

No national USGS/BIA historical reservation-boundary dataset was found in this pass.

## 5. Quotes worth preserving

- "as long as the grass grows or the water runs, in peace and plenty" (Jackson to the Creeks, Mar. 23, 1829; American Presidency Project).
- "the aforesaid Indian nations do not hereby abandon or prejudice any rights or claims they may have to other lands" (Fort Laramie 1851, Art. 5; verify).
- "set apart for the absolute and undisturbed use and occupation of the Indians herein named" (Fort Laramie 1868, Art. 2).
- "shall be held and considered to be unceded Indian territory" (Fort Laramie 1868, Art. 16).
- "signed by at least three-fourths of all the adult male Indians occupying the same" (Medicine Lodge Art. 12, quoted in Lone Wolf).
- "permanent home to the whole Creek Nation of Indians" (1833 Creek treaty, quoted in McGirt).
- "Because Congress has not said otherwise, we hold the government to its word." (McGirt, 2020).
- "the remainder of that tract being considered as ceded" (Royce p. 787, on Fort Berthold).

## 6. Open questions and claims to verify

- Royce 516 identity; Royce 616 vs 617; Royce number (if any) for the 1867 Cheyenne-Arapaho Medicine Lodge reserve.
- Senate ratification date for Fort Laramie 1851 (May 24, 1852 from one government source) and which nations assented.
- Exact Kappler wording for all treaty quotes marked "verify".
- Statute cites given from general knowledge: 19 Stat. 254 (1877), 33 Stat. 1016 (1905 Wind River), 33 Stat. 302 (1904 Flathead), 21 Stat. 199 (1880 Ute), 27 Stat. 640 (1893 Cherokee Outlet).
- Oklahoma Court of Criminal Appeals 2021 rulings (Hogner for Cherokee; Sizemore, Bosse for Choctaw and Chickasaw; Grayson for Seminole), from memory.
- Licenses and owners of the two ICC vector copies; whether the Coeur d'Alene Tribe permits reuse.
- California acreage: repo polygons give about 8.5M acres; most sources say 7.4-7.5M. Check whether Royce reserves overlap or include water.
