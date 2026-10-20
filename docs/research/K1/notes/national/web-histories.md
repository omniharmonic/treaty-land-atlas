# What Native-authored and "people's" histories add to the federal record

Living Law, Living Land (landback.land). Benjamin Life (@omniharmonic). Research-assistant draft, October 20, 2026.

Companion data: `findings/web-histories.csv` (39 rows, WEB-HIS-001 to WEB-HIS-039).

**Method and limits.** Page-fetching failed for this whole session (DNS errors on every site). All of this comes from web search results: publisher copy, catalog tables of contents, reviews, news coverage, and primary texts quoted in search excerpts. I did not read the books themselves, so this file has **no page numbers**. A quote is marked verified only when a search excerpt reproduced it. Anything I wrote from memory is flagged in the CSV `notes` column and needs checking before it appears on the site.

---

## 1. Summary of the most important findings

1. **"Extinguishment by payment" is a real legal mechanism, and the map hides it.** The Western Shoshone treaty (Ruby Valley, 1863, 18 Stat. 689) contains no cession. The nation refused the Indian Claims Commission (ICC) award of about $26 million. The US deposited the money for them anyway, as their "trustee," and in *US v. Dann* (1985) the Supreme Court held that the deposit counted as payment. (WEB-HIS-012)
2. **The ICC paid money and never returned land.** It valued land at the date of taking, generally paid no interest, subtracted "gratuitous offsets," and took attorney fees out of the awards. An award extinguished the claim. The one big exception is *Sioux Nation* (1980): interest was paid there only because the Court found the taking unconstitutional, and the Lakota still refuse the money. (WEB-HIS-035, -036)
3. **The legal case for the Doctrine of Discovery is weaker than the map assumes.** Lindsay Robertson found evidence that *Johnson v. M'Intosh* was a collusive suit arranged by land companies, and no Native nation was a party to it. The Vatican's 2023 note says the doctrine is "not part of the teaching of the Catholic Church," but it did not rescind the papal bulls and it changes nothing in US law. (WEB-HIS-017, -037)
4. **Walter Echo-Hawk's "ten worst cases" include two that the atlas does not have:** *Conners v. US & Cheyenne Indians* (1898) and *US v. Sandoval* (1913). The other eight should be tagged. (WEB-HIS-013)
5. **The removal-era "cessions" in the Southeast were often promises of land to individuals that fraud then destroyed.** The 1832 Creek treaty reserved 6,696 sections and half-sections to Creek families. Speculators took most of them, and the violence that followed (called the "Creek War of 1836") became the reason for forced removal. (WEB-HIS-001, -023)
6. **Congress itself recorded the Sand Creek massacre**, calling it a "foul and dastardly massacre" (Joint Committee on the Conduct of the War, 1865). The US admitted guilt in Article VI of the Little Arkansas treaty (14 Stat. 703), and the reparations promised there were never paid, as Congress acknowledged in 1998. (WEB-HIS-030)
7. **California was taken by killing, not by treaty.** The Senate rejected the 18 treaties of 1851-52. Benjamin Madley counts 9,492 to 16,094 people killed (a contested figure), and Governor Newsom's 2019 Executive Order N-15-19 calls it genocide. (WEB-HIS-024, -028)
8. **Large takings happened after Royce's schedule ends (1894)**: allotment, the Pick-Sloan dams (about 356,254 acres flooded), boarding schools, and termination. Nick Estes and David Treuer both argue that a story ending in 1890 is itself an act of erasure. (WEB-HIS-009, -021, -029)
9. **Official apologies are written to close off remedies.** The 2009 apology (Sec. 8113 of a defense appropriations act) says it "authorizes or supports" no claim and settles none. The 1993 Hawaii resolution says Native Hawaiians "never directly relinquished" their claims, yet the Court held in 2009 that it creates no rights. (WEB-HIS-031, -032)
10. **Authorship needs care.** Roxanne Dunbar-Ortiz is not a citizen of any Native nation and has withdrawn her earlier claims of Cherokee descent. The "Wyandot/Chickasaw" label in the brief has no support in anything I found. (WEB-HIS-005)

## 2. What the atlas most likely gets wrong or flattens

- **"Ceded" is used for every way land was lost.** Royce's title, *Indian Land Cessions*, makes cession the default. The sources here describe at least six different mechanisms that the map currently colors the same way:
  1. Real purchase, in the early years when settlers were weak (Banner).
  2. Purchase made under military or starvation duress (Ostler; the 1876 "sell or starve" rider).
  3. A guarantee of land to individuals, later lost to fraud (Creek 1832).
  4. Forfeiture by statute with no consent (Dakota, 1863).
  5. Killing with no treaty at all (California).
  6. Extinguishment by a money judgment the nation refused (Western Shoshone, Lakota).
- **New England is blank or treated as "pre-federal."** Jean O'Brien shows that this blankness repeats the "last of the Indians" story that settlers used to defeat Native land claims. Colonial and state deeds (Lisa Brooks) and present-day nations should be visible.
- **The Great Basin is described as sparse or "unoccupied."** Ned Blackhawk shows that the emptiness was produced by three centuries of colonial violence and slave raiding.
- **The time slider stops at 1894.** That is exactly when allotment losses were speeding up, and decades before the dams and termination.
- **Case records are written in a neutral voice.** That is fine for holdings, but Robert A. Williams Jr. and Echo-Hawk show that these precedents are still cited and still use the language of "savagery." The atlas should say plainly that they remain in force.
- **The 1871 end of treaty-making is shown as an endpoint.** Vine Deloria Jr. treats it as a unilateral US change: the nations never agreed to it. Post-1871 "agreements," such as the Black Hills agreement of 1876, are treaties in substance and should face the same consent test.
- **ICC dockets look like compensation.** In practice they finalized the taking at 19th-century prices. Each award should show its valuation date, whether interest was paid, any offsets, and that no land was returned.

## 3. Land promised or reserved (mappable boundaries)

Search results did not give me boundary descriptions precise enough to draw. These are the records to build from the treaty texts:

- **Creek 1832 individual reserves** (7 Stat. 366): the treaty schedules list 6,696 sections and half-sections assigned to heads of family in east Alabama. Draw them as promised, then lost.
- **Dakota Minnesota River reservation** (10 Stat. 949, 954, 1851): a ten-mile strip on each side of the Minnesota River, from the treaty text. It was forfeited by the Act of Feb. 16, 1863 without consent. (Strip width is from memory; verify.)
- **Western Shoshone, Ruby Valley 1863**: the boundaries in Art. 5 define Western Shoshone country. The treaty contains no cession. Draw the area as NEVER_CEDED, with the ICC overlay.
- **Indian Territory patents to the Five Tribes (1830s)**: these carried Jackson's promise that the land would be theirs "as long as grass grows or water runs" (Papers of Andrew Jackson, Oct. 15, 1829 draft). The land was later taken by the Curtis Act (1898). McGirt (2020) held that the Creek Reservation was never disestablished.
- **Hawaii Crown and Government lands**: shown as "ceded lands" in state law. Congress found in 1993 that they were never relinquished.

## 4. Quotes worth preserving

There are no page numbers because I could not read the books. Each quote is checked as far as noted.

- Jackson, 1829: "They can live upon it, they and all their children, as long as grass grows or water runs, in peace and plenty." (Papers of Andrew Jackson, UTK; verified via search excerpt.)
- Zinn, ch. 7: "Treaties made under pressure and by deception broke up Creek, Choctaw, and Chickasaw tribal lands into individual holdings, making each person a prey to contractors, speculators, and politicians." (Search excerpt of the chapter; verify the page.)
- Gen. Thomas S. Jesup, 1836, as quoted by Dunbar-Ortiz: "The country can be rid of them only by exterminating them." (Jacket copy; find the original letter.)
- Joint Committee on the Conduct of the War, 1865, on Sand Creek: "foul and dastardly massacre." (Verified via catalog annotation.)
- Apology Resolution, 1993: Native Hawaiians "never directly relinquished their claims to their inherent sovereignty as a people or over their national lands to the United States." (Verify the exact wording at govinfo.)
- Sec. 8113 (2009): "Nothing in this section (1) authorizes or supports any claim against the United States; or (2) serves as a settlement of any claim against the United States." (Verified via two reproductions of the statute.)
- *Johnson v. M'Intosh* (1823): "discovery gave an exclusive right to extinguish the Indian title of occupancy, either by purchase or by conquest." (Already in the atlas case record.)
- Vatican, 2023: the doctrine is "not part of the teaching of the Catholic Church."
- Blackhawk, 2023: "How can a nation founded on the homelands of dispossessed Indigenous peoples be the world's most exemplary democracy?"
- Lakota position: "The Black Hills are not for sale."

## 5. Vocabulary the atlas should change

| Before (federal term) | After (atlas term) | Reason and source |
|---|---|---|
| ceded / cession (as the default fill) | "transferred by treaty (called a 'cession' in US records)"; otherwise name the means: *taken by statute*, *taken by executive order*, *forfeited by Act of Congress*, *taken without any instrument*, *title declared extinguished by ICC payment* | Royce's "cession" assumes consent. Banner shows the same legal form meant different things in different eras; Deloria and Echo-Hawk show many transfers lacked consent. G3 item 10 already points this way, and the data should now carry the means as a field. |
| Indian title of occupancy / right of occupancy | "Native title (US courts call it 'occupancy')" | The phrase comes from the Doctrine of Discovery (*Johnson*). Williams traces its religious and racial roots. Use it only in quotation. |
| extinguished / extinguishment | "declared extinguished by [court / ICC / Act]" | Extinguishment is a legal claim made by one party. *Dann* shows it could be declared over the nation's refusal. |
| compensated / paid for (ICC) | "money award at [year] value, [no] interest, [offsets], land not returned; [accepted / refused]" | The ICC's own terms (UNL and EBSCO summaries). The Sioux and Western Shoshone refused payment. |
| unceded / never ceded (with no explanation) | "never transferred by any agreement; in US law, takeable without compensation (*Tee-Hit-Ton*, 1955)" | Echo-Hawk and Williams: "unceded" land has the weakest protection in US law. Users should know that. |
| surplus lands | "lands opened to non-Native settlement (called 'surplus' in the Act)" | "Surplus" assumes the land was more than the nation needed. Treuer: 1890-1934 was the period of the most "creative" assaults. |
| removal / emigration | "forced removal" | Saunt and Ostler: removal was compelled by military force and its costs were charged to the nations. "Emigration" was the official euphemism. |
| Indian depredations | "property-loss claims filed against Native nations (called 'depredations')" | Echo-Hawk's *Conners* chapter asks whether the Indian wars were legal at all. |
| uprising / outbreak (e.g., "Sioux Uprising" 1862) | "US-Dakota War of 1862" | This is the usage of the Minnesota Historical Society and Dakota communities. The war followed diverted annuities (the Traders' Paper; Anderson). |
| battle (for Sand Creek, Wounded Knee, Bear River) | "massacre" | Congress itself used "massacre" for Sand Creek in 1865. |
| Creek War of 1836 | "1836 Creek resistance to land fraud (called the 'Creek War of 1836')" | Saunt and Haveman: the violence was a response to fraud against Creek allotments. |
| "ceded lands" (Hawaii) | "Crown and Government lands of the Hawaiian Kingdom (called 'ceded lands' in state law)" | Apology Resolution 1993. |
| last of the [tribe]; vanished; extinct | (do not use) name the present-day nation | O'Brien: "lasting" was a tool for defeating land claims. |
| "end of the treaty era" (1871) | "Congress stopped making treaties by statute (1871); nations did not agree" | Deloria, *Behind the Trail of Broken Treaties*. |
| discovery / Doctrine of Discovery (stated as law with no comment) | "the Doctrine of Discovery, still the basis of US title (*Johnson*, 1823); the Catholic Church repudiated it in 2023, but US courts have not" | Williams; Robertson; Vatican note. |
| Arawaks (Zinn) | Taino | Current usage. |

## 6. Assessment of each work

- **Zinn** (not Native). A synthesis built on Van Every, Rogin, Foreman and Las Casas. It has almost no Native-authored sources and casts Native people mainly as victims. Good for framing; never use it as the sole source for a data claim.
- **Dunbar-Ortiz** (not Native; earlier Cherokee claims withdrawn). A strong settler-colonial framing, with a quote from Jesup on the Seminole. Attribute her as a historian and activist. Native critics (for example, Jacqueline Keeler) object to her being presented as an Indigenous voice.
- **Deloria Jr.** (Standing Rock Sioux). The 1871 critique and the call to restore treaty-making. Deloria and DeMallie's collection is the key source for an UNRATIFIED layer.
- **Estes** (Lower Brule Sioux Tribe). Pick-Sloan as a continuation of the 1851 and 1868 treaty breaches, through to the Dakota Access Pipeline (DAPL). Extends V028 and V029 to Lower Brule, Crow Creek and Yankton.
- **Blackhawk** (Te-Moak Western Shoshone). The emptiness of the Great Basin was produced by violence. Native history runs through every century, not only the years before cession.
- **Echo-Hawk** (Pawnee). The ten-case list. Adds *Conners* and *Sandoval*.
- **Williams Jr.** (Lumbee). The genealogy of discovery, and racist precedent that is still in force (*Tee-Hit-Ton*, *Oliphant*).
- **Treuer** (Leech Lake Ojibwe). Against stopping the story in 1890.
- **O'Brien** (White Earth Ojibwe). How settlers wrote Native people out of New England. Do not leave New England blank.
- **Brooks** (Abenaki). Colonial deeds, Weetamoo, Indigenous mapping.
- **Saunt, Madley, Ostler, Robertson, Banner, Anderson** (none Native). Specialist evidence on finance and fraud, the California killings, genocide, the collusion behind *Johnson*, the shifting meaning of consent, and diverted Dakota payments. Anderson rejects the genocide label and gives lower death counts. Treat that as a contested point, not a settled one.

## 7. Open questions and claims to verify

- Page numbers for every book quote. These need library access; WebFetch failed all session.
- Dunbar-Ortiz: the Cherokee Nation's reported request that she stop claiming descent. I found only a 2019 tweet; there is no official statement.
- The ICC Act's 10% cap on attorney fees (Sec. 15), and the commonly cited total of about $1.3 billion in awards.
- The valuation date in the *Dann* ICC case (July 1, 1872 is commonly cited).
- Anderson's figures on diverted Dakota payments ($540,000 promised against $50,000 received). They come from a newspaper report of a talk and look inconsistent with the treaty totals.
- The amount in the Traders' Paper ($210,000, or "about a third" of the cash payment).
- Whether the California Truth and Healing Council's final report has been published.
- The People of the Sacred Land TREC figures ($1.7 trillion vs. $1.9 trillion). Defer to the PSL-* findings taken from the report itself.
- Statutes at Large page numbers for Sec. 8113 (2009) and for the 1863 Dakota acts (12 Stat. 652, 819). Both are from memory.
- The Boarding School Initiative's count of treaties with education provisions (127 vs. 171), already flagged in the bibliography.
- The Canadian TRC Call to Action numbers on the Doctrine of Discovery. That row is from memory and is comparison only.
