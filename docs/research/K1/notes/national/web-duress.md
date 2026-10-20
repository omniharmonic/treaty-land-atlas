# Treaty-making defects the federal record presents as consent

**Benjamin Life (@omniharmonic). Research-assistant draft for Living Law, Living Land.**
Companion data: `findings/web-duress.csv` (64 rows, WEB-DUR-001 to WEB-DUR-064).

**Method note.** This pass used web search result snippets. Direct page fetches were blocked for most hosts (Wikipedia, Justia, Cornell LII, Avalon, OSU treaties), and the shared web search budget ran out partway through. Rows are therefore graded honestly:
- 29 rows are rated high confidence (treaty text or multiple consistent sources).
- 29 rows are medium.
- 6 rows are low.

About 15 rows (marked "Not re-verified in this session" in `notes`) rest on the researcher's knowledge of the standard literature and need checking before publication. Where the People of the Sacred Land TREC report corroborates a row, PDF pages are cited.

## 1. Ten-line summary

1. Hostage clauses are written into the treaty texts themselves. Fort Stanwix 1784 (six hostages), Fort McIntosh 1785 (three chiefs), Fort Finney 1786 (three), Fort Harmar 1789 (two Wyandot) and Greenville 1795 (ten chiefs) all made peace or cession conditional on people held by the US.
2. In 1868-69 the Army used hostage-taking to "implement" Medicine Lodge. Custer seized Satanta and Lone Wolf under a hanging threat, held 53 Washita women and children at Fort Hays, and took three Cheyenne chiefs at Sweetwater Creek.
3. The Black Hills "agreement" followed a statute that cut off all Sioux subsistence until they ceded (19 Stat. 176, 192). It was signed by about 10 percent of adult men against a 75 percent requirement.
4. The Navajo Treaty of 1868 was signed by an interned population after mass death at Bosque Redondo.
5. The Dakota were held in a stockade at Fort Snelling while Congress annulled their treaties outright (12 Stat. 652, 819).
6. Minority or unauthorized signers are documented for many treaties: New Echota, Indian Springs (conceded by the US itself and annulled in 1826), Nez Perce 1863, Fort Wise, St. Louis 1804, Payne's Landing / Fort Gibson, Winnebago 1837, Osage 1808 and Fort Finney.
7. Bribery and side deals are documented by Quaker, Native and government sources:
   - Tellico 1805 secret articles, left out of the copy sent to the Senate
   - Buffalo Creek 1838
   - the Traverse des Sioux traders' paper
   - Otto Mears's $2-per-signature Ute payments in 1880
8. Signature counts were disputed, and Congress amended the agreements, at Jerome (KCA) 1892-1900. Lone Wolf (1903) held that the Article 12 consent rule did not bind Congress.
9. Excluded nations and non-occupant cessions sit under large areas of the map. Examples are the Six Nations ceding Shawnee, Delaware and Cherokee-used Kentucky in 1768 and the Ohio Country in 1784, Shoshone left out of Fort Laramie 1851, and the Northern Cheyenne and Arapaho absent at Fort Wise.
10. The US "made" chiefs to sign for whole nations: Conquering Bear and Big Robber in 1851, White Hair in 1808, Kamiakin in 1855 and Keokuk in 1832.

## 2. What the atlas most likely gets wrong or flattens

- **The single-color "ceded" fill hides the conditions of signing.** Royce and Kappler record that a treaty exists. They do not record that a treaty text could require hostages, or that delegates were held far from home (Winnebago 1837, Fort Gibson 1833, Dakota 1858).
- **"Implementation" events are not linked to treaties.** Hostage-taking and massacres that forced people onto reservations (Washita, Sweetwater, Satanta and Lone Wolf, Bosque Redondo, Fort Snelling) appear, if at all, as separate events. They are not shown as how a treaty's "consent" was put into practice.
- **Signatory lists are shown as national consent.** The data should carry a signer-legitimacy field: authorized, minority faction, US-designated chief, or delegation without cession authority.
- **Overlapping or non-occupant cessions are drawn as clean, single-owner polygons.** This affects Stanwix 1768 and 1784, Fort Laramie 1851 and the Osage cessions used for removal.
- **"Annulled" and "corrected" treaties look like ordinary cessions.** Indian Springs 1825 and Buffalo Creek 1838 were followed by replacement cessions that kept most of the result of the fraud.
- **Agreements enacted as statutes are shown as consented cessions.** The 1877 Black Hills Act, the 1889 Sioux Act, the 1880 Ute Act and the 1900 KCA Act need flags for duress (rations), signature counts and congressional amendment.

Suggested schema additions:
- a `consent_defects` multi-value field on each treaty and cession, using the CSV categories
- `hostage_clause` (true/false, with article number)
- `signers_vs_required` (count, plus the rule that applied)
- a link table from events to instruments, so a massacre or hostage event can be shown on the polygon it enabled

## 3. Land promised or reserved (mappable descriptions)

- **Fort Wise 1861 reserve, Art. 1** (PSL p. 178, quoting the treaty): "Beginning at the mouth of the Sandy Fork of the Arkansas River and extending westwardly along the said river to the mouth of Purgatory River; thence along up the west bank of the Purgatory River to the northern boundary of the Territory of New Mexico; thence west along said boundary to a point where a line drawn due south from a point on the Arkansas River, five miles east of the mouth of the Huerfano River, would intersect said northern boundary of New Mexico; thence due north from that point on said boundary of the Sandy Fork to the place of the beginning." (PSL transcription; check against Kappler II 807)
- **Ute 1880 promise of Uncompahgre allotments** on the Grand River near the Gunnison if enough agricultural land existed. Officials then declared there was none and the bands were removed to Utah. Map this as LAND_PROMISED_THEN_TAKEN. No precise boundary was given.
- **Nez Perce 1855 reservation versus 1863 reservation.** The roughly 90 percent reduction (to about 700,000 acres) should be drawn as the difference between the two. The Wallowa and Salmon River band lands are the "never consented" area.
- **Seneca: Buffalo Creek and Tonawanda.** These reservations were lost in 1838/1842. Allegany and Cattaraugus were restored in 1842.

## 4. Quotes worth preserving

- Fort Stanwix 1784, Art. I: "Six hostages shall be immediately delivered to the commissioners by the said nations." (7 Stat. 15)
- Fort McIntosh 1785, Art. I: "Three chiefs, one from among the Wiandot, and two from among the Delaware nations, shall be delivered up to the Commissioners of the United States." (7 Stat. 16)
- Custer on the Kiowa chiefs, Dec. 1868: "I then arrested both him and Lone Wolf and held them as hostages." (My Life on the Plains)
- PSL p. 218: "Custer took Cheyenne chiefs Big Head, Dull Knife (Lean Face), and Fat Bear hostage, using the threat of hanging them..."
- PSL p. 175, on Harney in 1855: "He killed eighty-six men women, and children and took seventy hostages."
- Barboncito, 1868: "bringing us here has made many of us die, also a great number of our animals."
- MNHS on the Traders' Paper: "No one read the paper aloud or translated it for the Dakota, many of whom believed it to be another copy of the treaty."
- Unrau via PSL p. 178: "Only a few tribal leaders with questionable authority made verbal promises to exchange their princely domain..."
- PSL p. 438 (citing Conetah): Mears "began to bribe the Ute men for their signatures at two dollars apiece."
- Mooney on Tellico 1805: "recorded as a part of the treaty, but not embodied in the copy sent to the Senate for confirmation."
- Seminole delegates in 1833 were "only deputed to examine the country, and should have reported the result of their inquiries to a council of the nation."
- Lone Wolf v. Hitchcock (1903): Article 12 "cannot be adjudged to materially limit and qualify the controlling authority of Congress."
- Chief Joseph (1879): "General Miles had promised that we might return to our own country with what stock we had left."
- Black Hawk (1833), quoted from memory and needing verification: "I touched the goose quill to the treaty, not knowing, however, that, by that act, I consented to give away my village."

## 5. Open questions and claims needing verification

- **Royce area numbers.** These are left blank. Join on instrument cite in the atlas data rather than guessing.
- **Sioux Nation (448 U.S. 371) wording.** Confirm the exact opinion language on the 1876 signatures, and the Court of Claims phrase "ripe and rank case of dishonorable dealings."
- **Fort Hays captives.** Was there a documented demand linking the captives to a surrender? Current sources call them hostages but give no explicit terms. Check the Sheridan and Custer correspondence and Jerome Greene, *Washita* (2004).
- **Leschi's X at Medicine Creek.** Still contested between forgery and signing under protest. Check the Nisqually Tribe's account and Richard Kluger, *The Bitter Waters of Medicine Creek* (2011).
- **Stevens opening ceded lands before ratification (1855).** Widely reported, but not confirmed here.
- **Dancing Rabbit Creek.** Bribery characterization and the council walkout are not confirmed. Only grants to named individuals were confirmed.
- **Treaty of Chicago 1833.** Liquor and trader-claims details (Latrobe's account) are not verified.
- **Edmunds Commission 1882-83.** The claim that children's signatures were collected (Dawes committee, Senate Ex. Doc. 70, 48th Cong.) is not verified.
- **Jerome Agreement.** Competing adult-male counts (562 per the agent vs 639 per the 1900 census) and the forged-signature allegations. See Blue Clark (1994).
- **Osage 1808.** Did Meriwether Lewis threaten to withdraw protection or invite attacks? Not confirmed.
- **Low-confidence rows needing primary checks:**
  - Fort Armstrong 1832
  - Prairie du Chien 1829
  - Blackfeet 1888
  - Kickapoo 1891 (read Chapman, *Chronicles of Oklahoma* 17:1, 1939)
  - Cherokee and Chickasaw overlap
  - Osage cessions used for removal
- **Overlap with existing atlas rows.** Several rows overlap V003, V005, V006, V008, V009, V012, V021, V024/V025, V026, V031, V038, V039, V051 and V053. They add a specific defect mechanism and sources; they are not new violations.
