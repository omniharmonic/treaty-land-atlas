# Land never ceded, or taken without consent

Benjamin Life (@omniharmonic), Living Law, Living Land. Research-assistant draft, 2026-10-20.

Companion data: `findings/web-never-ceded.csv` (WEB-NC-001 to WEB-NC-032).

How this was made: repo data (read only) was combined with web searches. Direct page fetches were blocked by the sandbox proxy, and the web-search budget ran out before the Gadsden/O'odham and *Hawaii v. OHA* checks. Anything marked "from memory" or "unverified" needs checking before publication. Acreages are this project's calculations from the repo's polygons. They are not Royce's own acreage figures.

## 1. Summary (10 lines)

1. Using the dataset's own `legal_type` field, 26.5% of mapped Royce polygon area has no treaty link: 76 statute polygons (224M acres), 113 executive-order polygons (198M) and 54 "unknown" (108M). Treaty-linked polygons cover 1,472M acres across 474 polygons. Polygons overlap, so these figures are shares of polygon area, not of land.
2. In Royce's own remarks, 16 areas covering about 330M polygon-acres were taken with **no instrument at all**: "taken possession of", "assumed title", "no treaty of purchase". The largest are 688 eastern Apache (86M), 444 Western Shoshone (76M), 689 western Apache (56M), 432 Uintah Ute (25M), 558 and 562 Paiute (24M and 23M), and 687 Pima/Maricopa/O'odham (10M).
3. The `legal_type` field is misleading for these areas. The Southwest "no purchase" areas 682 to 689 are typed `statute` and dated 1886-10-01. Western Shoshone 444 is typed `treaty_or_agreement` only because it links to Kappler (Ruby Valley).
4. California is mapped almost entirely through the 18 **unratified** 1851-52 treaties: 35 polygons, about 88M acres, all typed `unknown`. Federal law treats the land as taken (ICC: "land taken by the United States March 3, 1853") and paid for at about 47 cents an acre ($29.1M, 1964).
5. Western Shoshone: the Ruby Valley treaty (18 Stat. 689) contains no cession. The ICC found title lost by "gradual encroachment by whites", using a stipulated date of July 1, 1872. *Dann* (1985) held that depositing $26M in the Treasury counted as payment. CERD Decision 1(68) (2006) objected.
6. Black Hills (597/598, about 28M acres): the crosswalk says "ceded". The Supreme Court in 1980 affirmed that the 1877 Act was a **taking**. The Sioux refuse the award, now reported at over $1B.
7. Royce leaves about 300M acres of the lower 48 (about 16%) without any polygon. On the repo grid, New England, NJ/DE/MD and the Virginia Piedmont show 0% coverage. Texas is only partly covered, and most of that coverage is a no-instrument Apache area. Alaska and Hawaii are absent.
8. Eastern Nonintercourse Act claims (Oneida, Cayuga, Passamaquoddy/Penobscot, Mashpee, Narragansett) are takings by states that never had federal approval. Courts accepted they were unlawful, then denied relief on equity (*Sherrill* 2005, *Cayuga* 2005) or tribal-status grounds (Mashpee 1978-79). Some were settled by statute (Maine 1980, Rhode Island 1978).
9. In Oregon, the Donation Land Claim Act (1850) handed out land before any ratified cession. The 1851 Willamette Valley and Tansey Point treaties were never ratified.
10. A vector version of the ICC's 1978 "Indian Land Areas Judicially Established" map appears to exist as a public ArcGIS FeatureServer. The repo's G2 note says no vector version was found. This is the best candidate dataset for an "aboriginal title proven, then taken" layer.

## 2. What the atlas most likely gets wrong or flattens

- **One color for all polygons** suggests every area passed by cession. Royce himself records about 330M polygon-acres as taken with no instrument.
- **`legal_type` is a guess based on which links exist**, not a legal finding. Examples: 682-689 "statute 1886", 444 "treaty", 458 and 532 "executive_order" or "unknown", while Royce says "No treaty was ever made".
- **Crosswalk `status=ceded` on Black Hills 598 and 597** conflicts with *Sioux Nation*. The 1876 "agreement" did not get the three-fourths adult-male signatures that Article 12 of the 1868 treaty required (from memory; verify in the opinion text).
- **California dates.** The timeline shows 1851-52 "cessions" that never happened. The taking date federal law actually uses is 1853-03-03, and title was also forfeited under the 1851 Land Claims Act filing deadline (*Barker v. Harvey*, 1901).
- **Blank space reads as "no claim".** The gaps are colonial and state takings, Texas state lands, Pueblo grants, Alaska and Hawaii.
- **"Recognized" 1851 Fort Laramie territories** (398, 399, 426, 517; about 101M acres) come from a treaty Royce calls "never ratified", although the Senate amended it. These should be a separate layer from cessions.
- **Overlap.** Polygons add up to 2,002M acres against about 1,597M acres of union coverage. Any "acres ceded" total that sums polygons overstates the land by about 25%.

## 3. Land promised or reserved, with mappable boundaries

- **California 1851-52 treaty reserves.** Royce already provides polygons: 273, 275, 276, 277, 278, 280, 282, 283, 285, 287, 290, 293, 295, 298, 301, 303, 305, 307, 309. These were promised and never set apart (sources give 7.4M to 8.5M acres).
- **Ruby Valley (1863) Western Shoshone boundaries.** Royce 444, "Boundaries claimed defined on the E. and W." Goshute boundaries are 447.
- **1868 Fort Laramie art. 16 unceded territory.** Royce 597: "Country N. of North Platte river and E. of summit of Big Horn mountains to be considered unceded Indian territory."
- **1851 Willamette Valley and Tansey Point reserves.** Not in Royce. Boundaries are in the treaty journals (ndnhistoryresearch.com transcriptions). These need digitizing.
- **Executive-order reserves under unratified agreements.** 557 Judith Basin (Crow), 563 Jicarilla, 609 San Juan (Southern Ute), 540a Wichita.
- **Texas Brazos and Clear Fork reserves (1854).** 12 leagues (53,136 acres) total; Royce 511 to 513 overlap these.

## 4. Quotes worth preserving

Page numbers are from the Royce 1899 Schedule as quoted in `crosswalks/royce-entry-roles.csv`.

- Royce p. 828 (444): "No formal purchase of the territorial claim of these tribes or bands was made, but the U. S. took possession of the same".
- Royce p. 922 (683, 685): "No treaty of purchase was ever made with this tribe. The U. S. assumed title to their country".
- Royce p. 856 (532): "No treaty was ever made with these Indians for the extinguishment of their territorial rights. The U. S. simply took possession of their country".
- Royce p. 812 (397): "The treaties were not ratified, but the U. S. authorities assumed that the cession was binding".
- Royce p. 824 (432): "Remainder of country claimed by them taken possession of by U. S. without formal purchase."
- Apology Resolution, 107 Stat. 1510: "never directly relinquished their claims to their inherent sovereignty as a people or over their national lands to the United States".
- *Dann*, 470 U.S. 39, syllabus: "this certification automatically appropriated the amount of the award and deposited it for the Tribe in an interest-bearing trust account".
- BIA 1965 release on the California award: "land taken by the United States March 3, 1853".

## 5. Proposed land-status classification for the map

Classify each polygon, or each segment of its history, by the **legal basis of the transfer**, with the basis cited. The categories are listed from most to least consensual on paper. A polygon can carry one primary class plus flags.

| Code | Class | Rule | Examples | Approx. scope (repo) |
|---|---|---|---|---|
| C1 | Ceded by ratified treaty | Ratified treaty or agreement with a cession clause and a recorded tribal delegation; no documented defect | Most of the 474 treaty polygons | up to about 1,470M polygon-acres, before C2 flags |
| C2 | Ceded under documented duress or defect | As C1, plus a cited flag: duress, signatory illegitimacy, Senate amendment without consent, ICC "unconscionable consideration" or "not fair and honorable dealings" | 1851 Fort Laramie territories (398, 399, 426, 517); Treaty of New Echota (Royce 203, from other findings) | to be populated from other WEB- and PSL- findings |
| T1 | Taken by statute or executive order | Act of Congress or EO without the nation's consent, including "restored to public domain" and statutes judicially found to be takings | 597/598 Black Hills (1877 Act; *Sioux Nation*); 699; 717 Colville; White Mountain Apache restorations; ANCSA (Alaska) | status=taken (12M) plus Black Hills (28M) plus the EO and statute polygons under review |
| T2 | Taken with no instrument | Royce or the ICC records possession taken without treaty, purchase or relinquishment. Show the ICC "date of taking" where known | 444, 447, 432, 458, 473, 532, 558, 562, 682-689 | about 330M polygon-acres |
| T3 | Taken by state or colonial action | Pre-1789 colonial takings; state purchases in breach of the Nonintercourse Act; Texas state lands | Royce gaps in the original states; Oneida, Cayuga, Maine, Mashpee, Narragansett claim areas; Texas | about 300M acres of lower-48 gap, plus partial Texas |
| U1 | Unratified-treaty area | Royce maps a cession whose instrument was never ratified. Secondary class T1, T2 or T3 shows how the land was actually taken | California 273-310; 397 Oregon coast; Willamette and Tansey Point 1851 (to add) | about 92M polygon-acres |
| N1 | Never ceded, still contested | No cession; the nation actively disputes extinguishment (refused payment, live litigation or international complaint) | Western Shoshone 444; Black Hills 597/598 (also T1); Hawaii ceded lands (about 1.8M acres); Pueblo grants | flag on top of T1 or T2 |

Flags for any class: `icc_paid` (with docket, taking date and award), `payment_refused`, `promised_reserve_never_delivered`, `claim_barred_by_laches`, `settled_by_statute`.

Rendering: use solid fill only for C1. Use hatching for C2. Use outline or texture for T1 and T2 so they never read as "ceded". Add a distinct fill for the T3 gaps instead of leaving them blank. Use an always-visible badge for N1. The legend should say "Royce shows what the United States claimed was acquired, not what nations agreed to."

Data steps:

- Add `royce-area-overrides` rows that set `legal_basis` for the 16 T2 areas and the 35 California areas.
- Override `legal_type` for 682 to 689.
- Change Black Hills 597/598 to T1 plus N1.
- Evaluate the ICC 1978 FeatureServer as layer L4.

## 6. Open questions and claims needing verification

- Why does the USFS data give 682-689 the date 1886-10-01 and a statute link? Check the USFS attribute documentation.
- The ICC 1978 FeatureServer: licensing, the full field list, and whether CATNUM maps to docket numbers. It could not be fetched from the sandbox.
- California ICC docket numbers (believed 31/37 consolidated), the 1853-03-03 basis, and the K-344 gross and offset figures.
- Western Shoshone acreage: 24.4M (CA and NV) or 24,396,403 acres (NV)? Also whether the 1962 ruling or the 1979 award is the operative date.
- "Ripe and rank case of dishonorable dealings" (*Sioux Nation*), the three-fourths signature shortfall, and the current fund balance.
- Gadsden and Tohono O'odham ICC docket and award (search budget ran out). *Hawaii v. OHA* (2009). Narragansett 1,800 acres and the 1880 detribalization. Maine Pub. L. 96-420. Mashpee 2007 recognition.
- The exact 1848 Oregon Organic Act wording (9 Stat. 323).
- The 1851 Fort Laramie ratification status. Royce says "never ratified"; courts and the atlas treat it as in force with Senate amendment. Present both views.
- The lower-48 gap estimate uses 0.1-degree cells that may include water, and a Census land figure taken from memory. Treat about 300M acres as an order of magnitude.
