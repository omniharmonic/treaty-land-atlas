# Verification pass: Plains claims (Fort Laramie 1851 to Fort Robinson 1879)

Benjamin Life (@omniharmonic). Research-assistant draft, 2026-10-20.

## How this was checked, and its limits

I checked each claim against the atlas repo (Royce quotes in `crosswalks/royce-entry-roles.csv`, `data/derived/cession-events.json`, and the instrument, case and violation overlays), the PSL/TREC book text in `psl/chunks/`, and web search. In this session the page-fetch tool could not reach any host, and shell egress was blocked. That covered govinfo, OSU, LOC, justia and archive.org. So I could not open the Kappler, Statutes at Large or ICC PDFs. Web search returned short excerpts from those sources (govinfo Statutes pages, OSU database records, NARA DigiTreaties folder titles, court opinions). Where I relied on an excerpt rather than a full page, I say so. Each item still needs one last look at a page scan before it goes live.

Verdict scale: CONFIRMED / PARTLY / NOT SUPPORTED / CONTRADICTED / UNRESOLVED.

---

## 1. Fort Laramie (Horse Creek) treaty, September 17, 1851

**Verdict: PARTLY.** The Senate did amend the treaty, and the amendment needed tribal assent. But the claim that it was amended "without full tribal consent" rests on one point: whether the Crow assented. Kappler's own footnote and a later transcription disagree on that.

- **Senate amendment.** The Senate ratified on May 24, 1852, cutting the Article 7 annuity from fifty years to ten, with up to five more at the President's discretion. That change was subject to the tribes' acceptance. Source: Kappler vol. 2, p. 594, footnote: "This treaty as signed was ratified by the Senate with an amendment changing the annuity in Article 7 from fifty to ten years, subject to acceptance by the tribes." The May 24, 1852 date comes from a Serial Set Crow claims document found by search, not seen in full.
- **Who assented.** The two versions of the footnote conflict:
  - The Kappler footnote as quoted by OSU, the Montana Indian law site and the USFS: "Assent of all tribes except the Crows was procured (see Upper Platte C., 570, 1853, Indian Office) and in subsequent agreements this treaty has been recognized as in force."
  - The littlebighorn.info transcription: assent of all tribes was procured, "the last acceptance being by the Crows, September 18, 1854." It also says that through "inadvertance on the part of the Interior Department, ratification by the tribes was not certified to the State Department and therefore the treaty was not promulgated by the President."
  - The atlas note already flags this conflict, which is correct. It is unresolved until someone checks the 1853 Upper Platte file (Indian Office letters received) or the 1904 Kappler scan.
- **Ratification, proclamation and Statutes at Large.** The treaty was ratified with an amendment and never proclaimed. Its text was never printed in the Statutes at Large. 11 Stat. 749 is only a stub: "This treaty was concluded September 17, 1851." That is reported by the UNL Treaties Portal and the Wisconsin library list, and matches the "11 Stats., p. 749" headnote on the Montana copy.
- **Royce is wrong on this point.** The atlas Royce rows for 426, 477 and 517 repeat Royce's remark that the 1851 treaty was "never ratified." That is inaccurate. It was ratified with an amendment but never proclaimed, and Congress later paid annuities under it.
- **How courts and the ICC treated it:**
  - In Moore v. United States (Ct. Cl. 1897; cited as 32 Ct. Cl. 593 in some sources and 32 Ct. Cl. 503 in the Kappler footnote, so check before using), the Court of Claims held the treaty in force. It reasoned that Congress had acted on it and later agreements referred to it, so proclamation was not needed. This is per Cohen's Handbook (1942) as quoted in search results.
  - In Crow Tribe of Indians v. United States, 284 F.2d 361 (Ct. Cl. 1960), the court affirmed the ICC's holding that the treaty recognized Crow title to the lands it described.
  - In Montana v. United States, 450 U.S. 544 (1981), the Supreme Court said the treaty "did not by its terms formally convey any land to the Indians at all."
  - The ICC used the 1851 Cheyenne-Arapaho boundaries (51,210,000 acres) as recognized title in Dockets 329 and 348 (see item 8).

**Suggested atlas wording:** "The Senate ratified the treaty on May 24, 1852 with an amendment cutting annuities from fifty years to ten, subject to the nations' acceptance. Kappler's footnote says every nation but the Crow assented; another version says the Crow assented in 1854. The treaty was never proclaimed, and its text was never printed in the Statutes at Large (11 Stat. 749 is a one-line stub). Federal courts and the Indian Claims Commission later treated it as in force and as recognizing title. Royce's 'never ratified' is inaccurate."

---

## 2. Fort Wise treaty, February 18, 1861 (12 Stat. 1163; RIT 315)

**Verdict: PARTLY.** The Senate did strike Article 11, and a paper assent to the amendment dated October 29, 1861 exists in the NARA file. But Article 6 did not make Northern assent a condition of the cession. TREC's claim that the October assent was fabricated is an argument from inference, not proven. TREC's procedural claim that the treaty had to go back to the Senate is contradicted by normal practice.

- **Article 11 was struck.** The 12 Stat. 1163 text (govinfo, via search excerpt) records that the Senate "did, on the sixth day of August, one thousand eight hundred and sixty-one, advise and consent to ratification with the following amendment," striking the eleventh article. Kappler prints Article 11 as "[Stricken out.]" The struck article would have let Denver City and nearby towns enter land at "the minimum price of one dollar and twenty-five cents per acre" (TREC p. 264, quoting the article). **CONFIRMED.**
- **Assent to the amendment, October 29, 1861.**
  - The NARA RIT 315 folder (DigiTreaties) includes "Senate's Advice and Consent to Treaty Ratification, with Amendment, and Consent to Amendment Signed by Arapaho and Cheyenne Indians on October 29, 1861."
  - The Statutes text recites that the signers, "having had fully explained to us the amendment made on the 6th day of August, 1861," assented.
  - President Lincoln proclaimed the treaty on December 5, 1861.
  - TREC (pp. 265-267) argues the assent marks look like "plus (+) marks ... all ... made by the same person." That is an inference the authors draw. It has not been tested by any handwriting examination.
  - Under the practice of the time, a nation's assent to a Senate amendment did not go back to the Senate before proclamation. So TREC's claim (p. 268) that "the proper procedure would have been to return the document ... back to the Senate" does not match how amended treaties were handled. **CONTRADICTED** on that point only.
- **Article 6.** The text says the Commissioner "shall cause the necessary proceedings to be adopted to have them notified of this agreement and its advantages, and to induce them to come in." It adds: "those who do not rejoin ... within one year from the date of the ratification of this treaty shall not be entitled to the benefit of any of its stipulations" (TREC p. 180-181, quoting the treaty).
  - Article 6 is an invitation with a cutoff for benefits. It is not a clause making the cession depend on absent bands signing.
  - Article 1 cedes all lands "owned, possessed, or claimed by them, wherever situated." Here "them" means the signatory "Arapahoe and Cheyenne Indians of the Upper Arkansas River."
  - Unrau's reading, quoted by TREC (p. 181), is that the treaty did not bind bands that never signed. That reading is a reasonable argument. It is not what the text plainly says.
- **Were Northern bands ever brought in?**
  - TREC p. 263 says "only one signature was ever secured, and that person was drunk." **CONTRADICTED** by the OSU Tribal Treaties Database entry "Agreement with the Arapaho and Cheyenne, 1863." Dated August 19, 1863 at the Upper Platte Agency, it records Northern leaders (Arapaho: Black Bear, Roman Nose, Friday; Cheyenne: Spotted Horse, Shield) pledging, according to agent John Loree's certificate, to uphold the Fort Wise treaty and any amendments or new treaty at a September 1, 1863 council. They pledged this upon receiving their annuity goods.
  - That document was never submitted to the Senate, and it was signed in exchange for annuities. So it is evidence of pressure, not clear consent. But it shows the government did collect some Northern marks.
- **Signers.** Ten chiefs signed on February 18, 1861:
  - Cheyenne: Black Kettle, White Antelope, Lean Bear, Little Wolf, Tall Bear, Left Hand (the Cheyenne Left Hand, not the Arapaho Niwot).
  - Arapaho: Little Raven, Storm, Shave-Head, Big Mouth.
  - **CONFIRMED.** I could not see the count of marks on the October 29 assent.
- **Admission by the Commissioner of Indian Affairs.** The 1862 report quoted by TREC (p. 263) calls the treaty "imperfect and indefinite as to the extent of cession, unless these bands are induced to accept." It urges talks "with the disaffected tribes who frequent the Platte River country, that the title to the unperfected portion of a Colorado territory may be perfected." TREC cites a 1961 ICC record for this. I could not confirm the exact words online. If they hold up, this is the strongest federal-voice evidence for item 3. **UNRESOLVED.** It needs the 1862 Annual Report (H. Exec. Doc. 1, 37th Cong., 3d sess.).

**Suggested atlas wording:** "Ten Southern Cheyenne and Arapaho chiefs signed. The Senate struck Article 11 (the Denver land-sale clause) on August 6, 1861. A paper assent to the amendment dated October 29, 1861 is in the National Archives file, and the treaty was proclaimed December 5, 1861. Article 6 admitted that many bands were 'now separated' and not present. It invited them to join within a year, and the Commissioner's 1862 report called the cession 'imperfect and indefinite' without them. TREC questions whether the October assent marks are genuine."

---

## 3. Land north of the South Platte (Denver, Boulder, Fort Collins, Greeley)

**Verdict: "Never ceded" is NOT SUPPORTED as a statement of the legal record. It is defensible only as the Northern nations' and TREC's position.** The more accurate wording is "ceded on paper by instruments whose reach and legitimacy the Northern bands contest."

- **Royce.** Royce area 426 is the whole 1851 Cheyenne-Arapaho territory, and it covers this land. Royce dates it to:
  - 1851-09-17 (described), p. 786;
  - 1861-02-18, "Cede all land claimed by them except one reserved tract," p. 824;
  - 1865-10-14, "Cede claim to lands therein described as follows: Beginning at the junction of the N. and S. forks of Platte river," p. 838.

  Royce area 477 is only the 1861 Arkansas River reserve, ceded in 1865. No Royce area in the atlas is tied to the May 10, 1868 treaty.
- **Browne and Dole.** TREC (pp. 184-185 and 271) cites Unrau, "Prelude to War," Colorado Magazine (Fall 1964). TREC says U.S. Attorney Samuel E. Browne concluded that white settlement "north and west of the South Platte" had no legal basis. It says Commissioner Dole first endorsed that view, then reversed himself, writing that "the Treaty of 1861 cedes by its express terms all lands not owned, possessed or claimed by the Cheyennes and Arapahoes, wherever situated." The "not" in that quote looks like a transcription slip. Check it against Unrau.

  Search results confirm that Browne wrote to Interior Secretary J. P. Usher on March 16, 1863, and that Evans blamed Browne's opinion. I could not read the letter itself. **PARTLY** (scholarly-cited, not seen in primary form).
- **Later instruments that reach this land:**
  1. **Little Arkansas, October 14, 1865 (14 Stat. 703), Article 2.** Signed by Southern bands ten months after Sand Creek. It relinquishes claim to the country from the forks of the Platte up the North Fork to the mountains, south to the Arkansas, and back. That area includes the land between the North and South Platte in Colorado. The treaty records that they "claim to have originally owned, and never to have relinquished the title thereto." Royce assigns this to area 426.
  2. **Fort Laramie, May 10, 1868, with the Northern Cheyenne and Northern Arapaho (15 Stat. 655; RIT 371).** Ratified July 25 and proclaimed August 25, 1868. In Article 2 the Northern bands "relinquish, release, and surrender to the United States, all right, claim, and interest in and to all territory outside" the two reservations offered, keeping a right to roam and hunt. This is the first Northern-band instrument that plainly reaches the Platte country. TREC (p. 263) says the ICC treated 1868 as where the Northern title passed, while calling that "ambiguous."
  3. **The 1876 agreement, confirmed by the Act of February 28, 1877 (19 Stat. 254), Royce 597/598.** This covers the 1868 Sioux treaty's Article 16 unceded territory (north of the North Platte, east of the Big Horns) and the Black Hills. It does not reach Colorado.
- **Bottom line.** The legal record shows paper cessions in 1861 (Southern signers), 1865 (Southern signers, after Sand Creek) and 1868 (Northern signers). The ICC then paid for the whole 51.21 million acres in 1963-65.

**Suggested atlas wording:** "Ceded on paper, but contested. The 1861 Fort Wise treaty was signed by ten Southern chiefs only, and federal officials admitted in 1862-63 that it did not clearly reach the Platte country. Southern bands relinquished the claim again in 1865, ten months after Sand Creek. The Northern Cheyenne and Northern Arapaho relinquished territory outside their reservations in the May 10, 1868 treaty. The Northern nations and the 2024 TREC report hold that the land north of the South Platte was never validly ceded."

Do not label it "never ceded" on the map without that attribution.

---

## 4. Denver townsite act and the 1872 case

**Verdict: CONFIRMED with a date correction.**

- **The act.** The Act of May 28, 1864, ch. 99, 13 Stat. 94, "for the relief of the citizens of Denver, in the Territory of Colorado." Chever v. Horner, 142 U.S. 122 (1891) cites it as "Act of May 28, 1864, 13 Stat. 94, c. 99," and Wilson v. Chicago Lumber & Timber Co. agrees.
  - It extended the 1844 townsite act (5 Stat. 657) and let the probate judge of Arapahoe County enter the townsite in trust for its occupants.
  - The land is section 33 and the west half of section 34, T. 3 S., R. 68 W., 6th P.M.
  - TREC (PDF p. 194) dates the act "May 24, 1864." That date is wrong. Use May 28.
- **The case.** Cofield v. McClelland, 83 U.S. (16 Wall.) 331, decided at the December Term 1872 and reported in 1873. The statement of the case: "The City of Denver ... was originally laid out by a company or association of persons on the public domain of the United States before the same had been surveyed and became subject to entry."
  - This is the Court's statement of facts. The case was a lot-title dispute and did not decide Indian title.

**Suggested atlas wording:** "Act of May 28, 1864, ch. 99, 13 Stat. 94; Cofield v. McClelland, 83 U.S. (16 Wall.) 331 (1872), which described Denver as laid out 'on the public domain of the United States.'"

---

## 5. Little Arkansas treaty with the Cheyenne and Arapaho, October 14, 1865 (14 Stat. 703; RIT 341)

**Verdict: CONFIRMED on ratification and non-payment. PARTLY on "the Senate struck the Kansas lands."**

- **Ratification.** The Statutes heading reads: "Concluded October 14, 1865; Ratification advised, with Amendments, May 22, 1866; Amendments accepted November 10 and 19, 1866; Proclaimed February 2, 1867."
- **Kansas.** The ratified Article 2 includes a proviso that the reservation be one "no part of which shall be within the State of Kansas." The proposed reservation straddled the Kansas and Indian Territory border. Smithsonian NMAI (2023) says Kansas refused to allow the reservation.
  - I could not see the Senate amendment text itself to confirm that the Senate added this proviso, though that is the usual account. Check Kappler vol. 2, p. 887 footnotes.
- **Reservation never established.** The treaty let the tribes range between the Arkansas and the Platte until the United States cleared other nations' claims to the reserve. The Medicine Lodge treaty of October 28, 1867 (15 Stat. 593) replaced it with a reservation between the Arkansas and the Cimarron.
- **Article 6 reparations.** Article 6 offered 320 acres to each named chief, 160 acres to each widow or orphan of the Sand Creek bands, and payment for property destroyed or taken. The NPS Sand Creek timeline says "these promised reparations are never paid." That is a federal agency's statement. I found no record of the land grants being patented.

---

## 6. Medicine Lodge Article 12, the Jerome Agreement, the 1900 Act, and Lone Wolf

**Verdict: CONFIRMED, with care on the signature counts. The forgery claim is PARTLY (secondary sources only).**

- **Article 12.** The Treaty with the Kiowa and Comanche, October 21, 1867, 15 Stat. 581 (ratified July 25, 1868; proclaimed August 25, 1868). Article 12: no cession is valid "unless executed and signed by at least three-fourths of all the adult male Indians occupying the same." The Apache joined by the companion treaty at 15 Stat. 589.
- **Jerome Agreement count.** Lone Wolf v. Hitchcock, 187 U.S. 553 (1903), statement of the case:
  - 456 adult males signed on October 6, 1892. The agreement text is dated October 21, 1892.
  - The agent's certificate gave "562 male adults" (citing Sen. Ex. Doc. 27, 52d Cong., 2d sess., p. 17). On that count, 456 is above three-fourths (421.5).
  - The Secretary of the Interior's 1899 report to the Senate, quoted in the case, says "less than three fourths of the male adults appear to have so signed." The vLex excerpt of the same passage gives the shortfall: 87 short if the age line is eighteen, 23 short if it is twenty-one.
  - The plaintiffs cited 639 adult males.
  - So "456 of 562" is the government's own framing. The record also contains the government's own admission that three-fourths was not reached.
- **Forgery.** The Supreme Court Historical Society says the final agreement had "mostly counterfeit signatures." Kansapedia says A'piatan alleged fraud. TREC (p. 72) says "even with forgeries." No court found forgery.
  - Suggested wording: "Kiowa leaders and later historians alleged misrepresentation and forged or improper signatures; no court ruled on it."
- **1900 Act.** The Act of June 6, 1900, ch. 813, 31 Stat. 672, at 676-677 (§6 ratifies the agreement "as herein amended"). TREC cites 31 Stat. 677. Congress changed the agreement without sending the changes back to the tribes. That was one of Lone Wolf's charges, and the Court did not deny the amendments were made. I did not verify the specific amendments.
- **Lone Wolf v. Hitchcock**, 187 U.S. 553 (decided January 5, 1903). Congress has "plenary authority over the tribal relations of the Indians"; "the power exists to abrogate the provisions of an Indian treaty"; the Court would "presume that Congress acted in perfect good faith."

---

## 7. Satanta and Lone Wolf taken hostage, December 1868

**Verdict: CONFIRMED.**

- On December 17, 1868, Custer, acting under Sheridan's orders, seized Satanta and Lone Wolf. They had come in under a white flag while the column marched toward Fort Cobb.
- Custer wrote that the chiefs were told they were "prisoners, and hostages." Sheridan's December 24, 1868 report (listed in a Secretary of War Senate document) says he was holding them "with expectation that they will be hung."
- Sheridan had Custer warn that if their bands were not in camp by sunset the next day, the chiefs would suffer for it. Sheridan's Personal Memoirs give the hanging threat.
- The Kiowa came in to Fort Cobb, and the chiefs were released in February 1869.
- TREC (PDF p. 42) says the tribe "quickly complied, and the chiefs were not executed." That matches.
- Context: General Hazen's affidavits put Satanta and Lone Wolf at Fort Cobb on November 27, 1868, the day of the Washita attack. So the pretext for seizing them was itself disputed.

**Suggested atlas wording:** "Hostage-taking used to force the Kiowa onto the Medicine Lodge reservation."

---

## 8. ICC figures

**Cheyenne-Arapaho, Dockets 329 and 348 (329-A, 329-B, 329-C). Verdict: PARTLY. The figures are right, but the $15M is often misattributed.**

- **Acreage and value.** The 1851 territory is 51,210,000 acres. The ICC found it worth $23,500,000 as of October 14, 1865, the Little Arkansas date. Per TREC, counsel for both sides stipulated that date. That works out to about $0.459 an acre ("about 46 cents"). TREC p. 229 says "45 cents"; pp. 333-334 and the Fraud Report say 46. Use "about 46 cents."
  - The HathiTrust record for Homer Hoyt's appraisal ("Appraisal of Cheyenne and Arapaho Indian lands ... October 14, 1865," "Cases 329 and 348 before the Indian Claims Commission") confirms the valuation date.
- **The $15,000,000 settlement (1965).** This was the Southern Cheyenne and Arapaho Tribes of Oklahoma settling all their claims, including the 1891 cession, in Dockets 329-A and 329-B. It is not the price of the 51.2 million acres as a whole. The Southern share of the 1851 claim had been set at 50.61 percent (TREC p. 229).
  - Funds were appropriated October 31, 1965 (Pub. L. 89-309), and distribution was set by Pub. L. 90-117 (1967), which refers to "dockets numbered 329A and 329B."
  - The ICC Final Report lists "$15 million (1965) ... for lands in northeastern Colorado and adjacent Wyoming, Nebraska, and Kansas."
- **Northern share.** An OSU-hosted ICC decision, 12 Ind. Cl. Comm. 212 (June 27, 1963, Dockets 329 and 348), sets the Northern Cheyenne 25.32 percent interest at $5,950,200.00 and the Northern Arapaho share at $5,656,450.00.
  - TREC's "13 Ind. Cl. Comm. 1" (November 27, 1963, Northern Cheyenne compromise, net $4,360,886.19 after a $1,000,000 deduction) fits that sequence. Search did not surface it. **UNRESOLVED.** Check the OSU ICC collection, vol. 13. S. Rep. 88-1349 (August 8, 1964) covers the Tongue River judgment funds.

**Kiowa, Comanche and Apache. Verdict: CONFIRMED.**

- Docket 32: 1 Ind. Cl. Comm. 505 (1951); amended final award March 29, 1957; a net judgment of $2,067,166 per a 1959 Interior release.
- Dockets 257 and 259-A: final judgment of $35,060,000, approved in 1974 (WVU/Carl Albert congressional correspondence). It was for lands ceded under the 1865 and 1867 treaties (Royce 510 and 511), and distributed under a plan Congress approved June 6, 1975.
- Plains Humanities calls it the largest ICC award for land "primarily in West Texas." TREC calls it "the largest award ever provided in an ICC settlement." Attribute that phrase rather than stating it as fact.

---

## 9. Fort Robinson, January 1879

**Verdict: CONFIRMED in substance (Army testimony as reported by historians). The exact dates vary.**

- After the Northern Cheyenne refused on January 3, 1879 to go south, Capt. Henry W. Wessells Jr., Third Cavalry, ordered food and heating fuel withheld from the prisoners in the barracks. That was on January 5 according to the Nebraska State Historical Society and Buecker, and about the same per TREC. He cut off water two days later, on January 7 (TREC says January 8).
- The prisoners scraped frost from the windows for water. They broke out on the night of January 9.
- Nebraska History reports that by January 23, 39 men and 25 women and children had been killed.
- Primary sources: Wessells' testimony before the Army board of officers convened in January 1879, and S. Rep. No. 708, 46th Cong., 2d sess. (June 8, 1880; Serial 1899). I could not open either.

**Suggested atlas wording:** "Army officers withheld food, fuel and then water from Northern Cheyenne prisoners in subzero weather to force them to return to Indian Territory (S. Rep. 708, 46th Cong., 2d sess.)."

---

## Corrections to carry into the atlas

1. Replace Royce's "never ratified" for the 1851 treaty (rows 426, 477, 517) with "ratified with amendment May 24, 1852; never proclaimed; text not printed in Statutes at Large (11 Stat. 749 is a stub)."
2. Do not map land north of the South Platte as "never ceded" without attribution. Map it as "contested cession," citing the 1862 Commissioner's report, Browne (1863), and the Northern-band position. Add the May 10, 1868 treaty (15 Stat. 655) as the Northern-band instrument. It has no Royce number in the atlas.
3. Fix TREC's dates where the atlas uses them: the Denver act is May 28, 1864 (not May 24), 13 Stat. 94.
4. Present the $15M as the Southern tribes' 1965 global settlement, not the price of the 1851 lands. The 1851 lands were valued at $23.5M for 51.21M acres (about 46 cents an acre) as of October 14, 1865.
5. For Jerome, show both counts: 456 of 562 per the agent, and short of three-fourths per the Secretary of the Interior in 1899.

## Still open

- The Crow assent to the 1851 amendment (1853 Upper Platte file).
- The exact Moore v. United States reporter page (32 Ct. Cl. 503 or 593).
- The October 29, 1861 assent: number and names of signers.
- The exact text of the 1862 Commissioner's report quote.
- The Browne letter of March 16, 1863, and Dole's reversal letter (primary text).
- The Senate amendment text for the 1865 Little Arkansas Article 2.
- 13 Ind. Cl. Comm. 1 (1963).
- The specific congressional amendments in the 1900 Act.
