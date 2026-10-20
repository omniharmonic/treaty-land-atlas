# Massacres and mass killings linked to land takings (web pass)

Benjamin Life (@omniharmonic), Living Law, Living Land. Research-assistant draft, October 2026.
Structured data: `findings/web-massacres.csv` (34 rows, WEB-MAS-001 to WEB-MAS-034).

**Method and limits.** This pass worked from web search result summaries only. Direct page fetches (Wikipedia, nps.gov, nahc.ca.gov, gis.cnra.ca.gov) were blocked by the session's network proxy, and the web-search budget ran out before the last checks. Every number in the CSV is a range with its source. Items marked "from memory" or "NOT verified" in the CSV must be checked before they go on the map. Royce area numbers come from the atlas's own `crosswalks/royce-entry-roles.csv` (read-only) and are labeled that way. The current seed data mentions massacres only for Sand Creek (V021, Fort Wise notes), Mankato/Fort Snelling, Gnadenhutten (a note) and Tuluwat (as a land-back campaign). Bear River, Washita, Wounded Knee, Bad Axe, Horseshoe Bend, Marias, Camp Grant, Big Hole and the California massacres are all missing.

## 1. Summary of the most important findings

1. Many major cessions were signed within months of a massacre carried out by the other party to the treaty. Sand Creek (Nov 1864) was followed by the Little Arkansas cession (Oct 1865, Royce 426, 477). Bear River (Jan 1863) was followed by all four 1863 Shoshone and Goshute treaties (Box Elder, Fort Bridger, Ruby Valley, Tooele Valley). Bad Axe (Aug 1832) was followed seven weeks later by the Black Hawk Purchase (Royce 175). Horseshoe Bend (Mar 1814) was followed by Fort Jackson (Royce 75).
2. Royce's own wording sometimes admits the conquest. For Fort Jackson it records that "The U. S. demand an equivalent for all expenses incurred in prosecuting the war... by a cession of all the territory". For Ruby Valley it records: "No formal purchase... was made, but the U. S. took possession."
3. Dakota 1862-63: Royce 440 (the Minnesota River reserve) appears as "ceded 1863-03-03", but it was confiscated by statute (12 Stat. 652 and 12 Stat. 819) after the Mankato hanging of 38 men and an internment at Fort Snelling where 130 to 300 died. The Ho-Chunk reserve (Royce 439) was taken in the same wave, although the Ho-Chunk were not party to the war.
4. In California, the land around most massacre sites was never ceded: Sacramento River 1846, Bloody Island 1850, Yontocket 1853, Mendocino 1859-60, Tuluwat 1860 and Owens Valley 1862-63. The 1851-52 treaties were never ratified.
5. California paid for its killing campaigns, and Congress paid California back. About 24 militia campaigns ran from 1850 to 1861, at a cost of roughly $1.29 to $1.5 million, and Congress reimbursed all but about $200,000 (Madley, via Newsweek). The state had spent $924,259 by January 1854 (Lindsay, quoting Gov. Bigler). A later act provided up to $400,000 for nine campaigns of 1854-59 that killed at least 766 people (Madley, via Wikiquote). These figures have not been reconciled and the statute citations still need checking.
6. Washita (1868) was a raid to enforce the Medicine Lodge treaty. The 53 women and children captured there were held as leverage to force the bands to surrender. Death counts run from 13 to 150.
7. Camp Grant (1871): civilians from Tucson killed about 85 to 144 Apache people who were living under Army protection, and took 27 to 30 or more children. The Camp Grant reserve created afterwards (Royce 541) was abolished by executive order in 1872.
8. Big Hole (1877) killed 60 to 90 Nimiipuu, about two-thirds of them noncombatants. The bands were fleeing enforcement of the 1863 "Thief Treaty" (Royce 441), which they never signed.
9. Marias (1870): the Army counted 173 dead and later accounts give 217 or more. Executive orders and statutes then cut the Blackfeet reservation in 1873-74 (Royce 565). The CSV records this as a sequence in time, not a proven cause.
10. Wounded Knee (1890): 153 to 375 killed, 21 months after the 1889 act broke up the Great Sioux Reservation (Royce 699-705).

## 2. What the atlas most likely gets wrong or flattens

- **The "ceded" fill color.** Polygons for Royce 75, 175, 426, 477, 440, 439, 441, 444, 447, 541 and 565 are colored as consensual cessions. Each one followed killings by the US or by settlers, or rests on confiscation or "possession" with no purchase. Suggested fix: add a `preceded_by_massacre` edge between massacre points and these polygons, and a DURESS_MILITARY flag.
- **California.** In California, everything outside the later reservations should be shown as NEVER_CEDED. A state-funded-campaigns layer is needed so the violence that took the land is visible.
- **Naming.** Use "Bear River Massacre" (and the Shoshone name Boa Ogoi or Wuda Ogwa, after asking the Northwestern Band which it prefers), Tuluwat, Yontocket (Yan'-daa-k'vt), Bo-no-po-ti (Bloody Island), Dokdokwas and Tohopeka. Army names such as "Battle of Bear River", "Battle of the Washita" and "Battle of Ash Hollow" should be shown only as alternate names.
- **Spirit Lake (1857).** The victims were settlers, not Native people, so this event does not belong in a Native-victim massacre layer. It was preceded by the 1854 Lott killings of Inkpaduta's family.
- **Mankato.** This was a mass execution after military trials. A distinct category (for example MASS_EXECUTION) would describe it more accurately than MASSACRE.

## 3. Land promised or reserved and then taken (mappable)

The boundaries are those already transcribed in the atlas Royce crosswalk.

- Royce 477: Fort Wise reserve (1861), ceded at the Little Arkansas in 1865 after Sand Creek.
- Royce 226: the Keokuk reserve of 400 square miles, set aside in the 1832 Black Hawk Purchase and taken in 1836.
- Royce 440: the Minnesota River Sioux reserve south of the river, kept in the 1858 treaties and confiscated by the act of March 3, 1863.
- Royce 439: the eastern Blue Earth Winnebago reserve, sold under the act of February 21, 1863.
- Royce 442: the 1863 Nez Perce reserve, reduced again in 1893-94.
- Royce 541: the Camp Grant Apache reserve, created in 1871 and revoked in 1872.
- Royce 449-452: four Utah reserves created 1856-59 (Spanish Fork, Corn Creek, San Pete, Deep Creek), vacated by the act of 1864 and ceded in 1878. Utah Valley itself was never ceded, even after the 1849-50 Fort Utah and Battle Creek killings.
- Article VI of the Little Arkansas treaty promised land grants to Sand Creek survivors: 320 acres to each of four chiefs and 160 acres to each widow or orphan (from atlas V021). These grants were never delivered.

## 4. Quotes worth preserving

- Royce Schedule, Fort Jackson (Royce 75): "The U. S. demand an equivalent for all expenses incurred in prosecuting the war to its termination by a cession of all the territory" (atlas crosswalk transcription).
- Royce Schedule, Ruby Valley (Royce 444): "No formal purchase of the territorial claim of these tribes or bands was made, but the U. S. took possession of the same."
- NPS, Sand Creek: troops "killed more than 230 Cheyenne and Arapaho over the course of seven hours."

## 5. Existing datasets and maps

| Dataset | What it is | License / access |
|---|---|---|
| California NAHC Digital Atlas, "Genocide" layer (gis.cnra.ca.gov ArcGIS) | Incident points for 1846-1873, sourced from Madley; location precision varies | Not determined. State service, but the underlying Madley data is copyrighted. Ask NAHC. |
| NAHC regional genocide timelines (nahc.ca.gov/cp/timelines) | Text timelines by region | Not checked |
| Euro-Invasion Conflict Database 1513-1901 (Bales and Annerfalk, WHQ 2024, doi:10.1093/whq/whae002; Rights Lab, Nottingham) | 1,375 conflicts with coordinates and casualties; flags "genocidal massacres" | No public download or license found. Contact the Rights Lab. |
| Northwestern California Genocide Project (nwgenocide.omeka.net) | Archive of documents and exhibits; no geometry | Not checked |
| Battlefields of the Pequot War (Mashantucket Pequot Museum, ABPP-funded) | Archaeological and GIS mapping of the Mystic Fort battlefield | Tribal museum. Ask before use. |
| Digital Paxton (digitalpaxton.org) | Primary-source archive on the Conestoga massacre | Not checked |
| NPS units: Sand Creek NHS, Washita Battlefield NHS, Big Hole NB, Horseshoe Bend NMP; NHLs for Bear River (1990) and Wounded Knee | Boundaries and NRHP/NHL nominations | NPS GIS is generally public domain (not checked for each dataset) |
| Colonial Frontier Massacres in Australia (University of Newcastle) | The model to follow for method: a massacre defined as 6 or more undefended people killed, with evidence scoring | CC BY-NC 4.0 plus a data-use agreement that asks for respectful reuse. Australia only. |
| Invasion of America (Saunt) | Maps dispossession, not massacres | Not checked |

No national, open-licensed US equivalent of the Newcastle map was found. That is a real gap.

## 6. Ethics note on displaying massacre sites

- **Consent first.** Before publishing a massacre point, contact the descendant nation (for example the Northwestern Band of the Shoshone, the Wiyot Tribe, Tolowa Dee-ni', Cheyenne and Arapaho, Oglala Sioux, Nimiipuu, Mashantucket Pequot and San Carlos Apache). Record its preference in the atlas's `tribal-review-ledger.csv`. Several sites, including Tuluwat, Yontocket, Boa Ogoi and Wounded Knee, are burial grounds or ceremonial grounds, and some are now owned by the nation.
- **Make locations less precise.** Follow the Newcastle practice: give coordinates only to about 0.1 degree or show a regional marker, unless the site is already a public NPS unit or the nation asks for a precise location. Never publish burial, reburial or artifact locations. Burial and grave-goods protections under NAGPRA and ARPA apply.
- **Do not sensationalize.** Use plain factual text and no graphic imagery. Show death counts as ranges with sources, and put descendant accounts beside Army counts rather than below them. Use the nation's names for places and events. Pair each site with its present: survival, land return, and memorials.
- **Name the perpetrators.** Name who did the killing (Army unit, state militia, volunteers, civilians), and do not present intertribal participation (for example at Camp Grant, Horseshoe Bend and Mystic) without context and consultation.
- **Protect the people reading.** Put a content warning on the layer and turn it off by default. Do not use killing counts as the main way of coloring the map.

## 7. Open questions and claims needing verification

- The California appropriation and reimbursement statutes: exact acts, dates and Stat. cites (1854, 1856, 1857, 1860, 1861 all appear in different sources). Also whether the $1.29 million (California Gov. Code sec. 54260) and $1.5 million (Madley) figures measure the same thing.
- Bloody Island: the treaty name and date of the 1851 McKee treaty with Clear Lake bands (Camp Lu-pi-yu-ma), which could not be checked.
- Tallushatchee (186 killed) and Horseshoe Bend (about 800-900 killed): counts from memory.
- Blue Water / Ash Hollow 1855 (86 killed): not verified in this pass.
- Marias: exact site coordinates. Stat. cites for the 1874 and 1888 Blackfeet acts.
- Wounded Knee: the 25 Stat. 888 cite and the number of Medals of Honor.
- An "Owens Lake massacre, March 1863" was not confirmed. A Skull Valley Goshute massacre was not documented. Neither should be mapped yet.
- Conestoga Manor: how the land was disposed of after 1763. Gnadenhutten: the Moravian tract grants went to the Moravian society, not to the Lenape. Both need checking.
- Not yet covered: Killdeer Mountain (1864), Bear River's Goshute counterpart campaigns of 1863, Keyesville (1863), Kern River, Mariposa War, Mill Creek / Yana killings (1864-68), and Trail of Tears mortality. These are candidates for a follow-up pass.
