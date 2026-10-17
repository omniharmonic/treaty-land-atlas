---
title: US Treaty Framework and Defensible Counts (Treaties, Unratified Treaties, Agreements)
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# A1. Treaty framework and defensible counts

Research Agent A, Treaty Land Atlas. This file covers (1) the legal and historical framework for US-Native nation instruments, (2) the legal categories the site must keep distinct, and (3) a source-by-source comparison of how many ratified treaties, unratified treaties, and agreements exist, with the reasons the numbers differ.

Confidence tags used throughout: `[verified]` (confirmed in a source read this session), `[from-memory]`, `[disputed]`, `[unverified]`. A `[derived]` tag marks a number I computed from a verified table. Wikipedia was used only as a pointer to primary or secondary sources and is marked "(Wikipedia, pointer)".

## 1. Bottom line for the data model

- There is **no single canonical count**. The defensible statement is a range with a reason: roughly **368 federal-era ratified treaties (1778-1868)** in the National Archives numbering, **375** if the seven pre-1778 colonial/British-era items that the National Archives and the University of Nebraska-Lincoln (UNL) portal count are included, and "approximately 370" in BIA and Senate-archives prose. See section 4.
- **Unratified treaties:** BIA says "at least 45"; the Senate archives say "several dozen." The California set alone is 18. No source read this session gives a firm total. See section 5.
- **Agreements (1872-1911/1913):** no source read this session gives a count. This is the biggest numeric gap in this file. See section 6.
- The data model should therefore store `instrument_type`, `ratification_status`, and the **source and count-basis** for every figure, not one global total.

## 2. Legal and historical framework

### 2.1 Chronology of the legal regime

| Date | Instrument or event | Why it matters for the atlas | Tag |
|---|---|---|---|
| 1768-11-05 | Treaty of Fort Stanwix (Six Nations and the Crown) | British-era boundary line; carried as NARA series item 7 | `[verified]` (NARA table) |
| 1777-1781 | Articles of Confederation, Art. IX: Congress to have power of "regulating the trade and managing all affairs with the Indians, not members of any of the States" | Federal (not state) authority over Indian affairs begins here, with a state-lawmaking caveat | `[verified]` quote (Avalon Project); dates `[from-memory]` |
| 1778-09-17 | Treaty with the Delawares (Fort Pitt), 7 Stat. 13; Kappler II:3 | First treaty between the United States and a Native nation; included a clause inviting other Ohio-Country tribes to join a Delaware-led state with congressional representation, which Wikipedia (pointer) says was never fulfilled | `[verified]` date/cites; clause per Wikipedia pointer |
| 1784-1789 | Fort Stanwix (1784), Fort McIntosh (1785), Hopewell (Cherokee 1785, Choctaw and Chickasaw 1786), Fort Finney (1786), Fort Harmar (1789) | Confederation-era treaties negotiated before the Constitution took effect | `[verified]` dates/cites (see seed CSV) |
| 1787 | Northwest Ordinance, "utmost good faith" language toward Indians | Frequently cited statutory promise | `[from-memory]` |
| 1788-1789 | Constitution in force. Art. II, sec. 2, cl. 2: President makes treaties "by and with the Advice and Consent of the Senate" with two-thirds concurrence; Art. I, sec. 8, cl. 3 (Indian Commerce Clause); Art. VI (Supremacy Clause) | Treaties become supreme law; Senate advice and consent applies from this point | `[from-memory]` |
| 1790-07-22 | Trade and Intercourse (Nonintercourse) Act, 1 Stat. 137: Indian land sale valid only if "at some public treaty, held under the authority of the United States"; re-enacted 1793-1834, final form 4 Stat. 729 (1834), 25 U.S.C. 177 | Legal basis for the Oneida and Passamaquoddy land claims; creates the "treaty or nothing" rule for land transfer | `[verified]` cites (Wikipedia, pointer); 1790 exact date `[from-memory]` |
| 1790-08-07 | Treaty of New York (Creeks), 7 Stat. 35 | Commonly described as the first Indian treaty advised and consented to by the Senate | `[from-memory]` on "first" |
| 1795-08-03 | Treaty of Greenville, 7 Stat. 49 | Ohio cession; created the annuity system; Senate ratified 1795-12-22 | `[verified]` (Wikipedia, pointer; stat. page from Stat. vol. 7 index) |
| 1830-05-28 | Indian Removal Act, 4 Stat. 411 (Senate 28-19, House 101-97, one footnote gives 102-97) | Authorizes removal exchanges; Dancing Rabbit Creek (1830-09-27) is the first removal treaty under it | `[verified]` (Wikipedia, pointer) |
| 1831-1832 | Cherokee Nation v. Georgia; Worcester v. Georgia (5-1 per Wikipedia pointer) | Case-law lane belongs to Agent C; cited only for context | `[verified]` as to Worcester vote via pointer |
| 1849-1868 | "Expansion and reservation" treaties: Stevens treaties (1854-1856), Fort Laramie (1851 and 1868), Medicine Lodge (1867), Reconstruction treaties (1866) | Largest cluster of ratified treaties (see seed CSV, and A2) | `[verified]` (NARA table) |
| 1861 | Nine Confederate States treaties with Indian Territory tribes (UNL portal carries Statutes page images) | **Not US treaties**; must be excluded from the US count but kept as context, because the 1866 Reconstruction treaties respond to them | `[verified]` (UNL Treaties Portal) |
| 1871-03-03 | Indian Appropriation Act, 16 Stat. 544, 566 (ch. 120, sec. 1), codified at 25 U.S.C. 71: no Indian nation or tribe "shall be acknowledged or recognized as an independent nation, tribe, or power with whom the United States may contract by treaty"; pre-1871 treaty obligations are not "invalidated or impaired" | End of treaty-making | `[verified]` (Cornell LII source credit; teachinglegalhistory.unl.edu excerpt) |
| 1872-1911 | Agreement era: agreements negotiated by commissions and approved by statute of both houses | Land continues to move by instrument, but the Senate no longer ratifies | Date range `[verified]` (Prucha, Appendix C description at UC Press); count `[unverified]` |
| 1855-1919+ | Executive-order reservations | Hopi reservation created by executive order of Pres. Arthur in 1882 (Wikipedia, pointer). Congress restricted the practice: Act of May 25, 1918, 40 Stat. 570 (25 U.S.C. 211) bars new or enlarged reservations in Arizona and New Mexico except by Act of Congress | 25 U.S.C. 211 `[verified]` (Cornell LII); 1855 start date `[from-memory]` |
| 1887-02-08 | General Allotment (Dawes) Act, 24 Stat. 388 | Allotment; Indian-held land fell from about 138 million acres (1887) to about 48 million (1934) per Wikipedia (pointer); Lone Wolf v. Hitchcock, 187 U.S. 553 (1903) held Congress has plenary power to abrogate treaty provisions | `[verified]` (Wikipedia, pointer) |
| 1971-12-18 | Alaska Native Claims Settlement Act, 85 Stat. 688 (Pub. L. 92-203) | Settlement by statute (about 44 million acres retained, about $962.5 million), not a treaty | `[verified]` (Wikipedia, pointer; amounts vary $962.5M/$963M) |
| 1993-11-23 | Apology Resolution, Pub. L. 103-150, 107 Stat. 1510 | Hawaii context; no legal claims settled | `[verified]` (Wikipedia, pointer) |

### 2.2 The two statements that matter most about 1871

1. Treaty-making with tribes **stopped**; treaty **obligations did not**. The 1871 statute preserves "the obligation of any treaty heretofore lawfully made and ratified" (25 U.S.C. 71 text, as summarized by Cornell LII). A 1940s-era chapter on Indian treaties in the Cohen-style handbook on the OU Law site says the same: "Although treaty making itself is a thing of the past, treaty enforcement continues." `[verified]` (thorpe.law.ou.edu/cohen/3cohen33.pdf; the edition year is not stated on the page, probably early 1940s).
2. The National Archives gives the proximate cause as institutional: "when the House of Representatives stopped recognizing tribes as independent nations that could contract by treaty" `[verified]` (archives.gov/research/native-americans/treaties). The usual shorthand, "the House wanted a say over Indian affairs and treaty-making," is a fair reading but the page only states the House dimension; I did not verify a fuller legislative history. `[from-memory]` on the Senate-House dispute.

### 2.3 The US Treaty Clause and why the Senate role defines "ratified"

Under Art. II, sec. 2, the Senate gives advice and consent and the President then ratifies and proclaims. For Indian treaties the National Archives holds a "Ratified Treaty File, 1801-1868" and an "Unratified Treaty File, 1821-1869" (microfilm T494; NARA catalog NAIDs 300292 and 300293) `[verified]`. Pre-1789 treaties (RIT 8-14: Fort Pitt through Fort Finney) were approved by the Continental or Confederation Congress, not the Senate. `[from-memory]` on the Congress approval mechanics; the dating is verified.

## 3. Legal categories the site must keep distinct

| Category | Definition used by the atlas | Example | Where it sits in sources |
|---|---|---|---|
| **Ratified treaty** | Negotiated by US commissioners, approved by Senate advice and consent (or, before 1789, by Congress), ratified and proclaimed. Supreme law of the land. | Treaty of Canandaigua, 7 Stat. 44 | Statutes at Large vols. 7-15; Kappler vol. II; NARA M668/RIT numbering |
| **Ratified with amendments** (partial) | Senate struck or changed provisions; tribes sometimes never assented to the amendment | Treaty of Traverse des Sioux 1851 (Senate struck sec. 3, Wikipedia pointer); Fort Laramie 1851 (annuity period cut from 50 to 10 years) | Seed CSV `ratified = partial` |
| **Unratified treaty** | Signed by commissioners and tribal representatives but not approved by the Senate; no legal force as a treaty. Often still shaped events (surveys, occupation, "squatting") | 18 California treaties 1851-52; Cherokee 1835-03-14 | Kappler II unratified section (about p. 1027 onward) `[from-memory]` on range; NARA unratified file |
| **Supplementary article / convention** | Amends or clarifies an earlier treaty. Sometimes counted separately, sometimes folded in. | Holston 1791 plus additional article of 1792 | NARA treats them as part of one file in some cases (e.g., RIT 18) |
| **Agreement (post-1871)** | Negotiated with tribes (often by commissions) and then ratified by an Act of Congress (both houses). Interpreted under treaty-like canons but not "treaties" in the Treaty Clause sense | Black Hills Agreement 1877 (19 Stat. 254 `[from-memory]`); Jerome Agreement (Act 1900) | Statutes at Large; Kappler vol. I; Prucha App. C; Deloria and DeMallie |
| **Executive order reservation** | Reservation set apart by presidential order, with no Senate or House vote. Weaker protection than treaty land; Congress has terminated or reduced several | Hopi 1882 | Kappler vol. I `[from-memory]` |
| **Statute** | Congress acting unilaterally | Dawes Act 1887; ANCSA 1971 | Statutes at Large; U.S. Code |
| **Non-US instruments** | Colonial (pre-1776), Confederate (1861), Republic of Texas, tribe-to-tribe | Treaty of Lancaster 1744; 1861 Confederate treaties | OSU Tribal Treaties Database "Other documents"; UNL portal |

**Terms for what happened to a treaty** (the brief asks that "broken", "abrogated", "diminished", "disestablished" not be conflated):

- **Abrogated** (by Congress): Congress unilaterally overrides a treaty provision. Lone Wolf v. Hitchcock, 187 U.S. 553 (1903) is the classic authority (Wikipedia, pointer for the holding) `[verified]`. By treaty: the 1826 Treaty of Washington (Creeks) annulled the 1825 Treaty of Indian Springs `[from-memory]`; 1853's Treaty of Mesilla annulled Article XI of Guadalupe Hidalgo (Wikipedia pointer) `[verified]`.
- **Broken** (colloquial): a promise was not kept. The site should use this only when a specific unmet obligation is cited, e.g., Black Hills taking without the Art. 12 three-fourths consent; United States v. Sioux Nation of Indians, 448 U.S. 371 (1980) (Wikipedia, pointer for date and award) `[verified]`.
- **Diminished / disestablished** (reservation boundaries): terms of art for reservation boundary cases (Solem v. Bartlett, 465 U.S. 463 (1984); McGirt v. Oklahoma, 591 U.S. ___ (2020)) `[from-memory]`; defer to Agent C/D glossary for definitions.
- **Superseded:** replaced by a later treaty or statute (e.g., 1868 Fort Laramie replaced 1851's territorial scheme, per Wikipedia pointer).

## 4. Ratified-treaty count: source comparison

### 4.1 The numbers

| Source | Figure | Scope stated | What it probably counts | Tag |
|---|---|---|---|---|
| **BIA** "Does the United States still make treaties with Indian tribes?" | "The Senate ratified 370 treaties between 1778 and 1871. At least 45 others were negotiated with tribes but were never ratified." | 1778-1871 | Rounded Senate-ratified figure | `[verified]` (bia.gov/faqs/does-united-states-still-make-treaties-indian-tribes) |
| **National Archives Center for Legislative Archives** (Senate records) | "approximately 370 treaties were made and approved by the Senate"; "several dozen" considered but not approved; "first ratified treaty was with the Delaware in 1788, and the last was with the Nez Perce in 1868" | 1789-1871 | Rounded figure. The page's "Delaware in 1788" is almost certainly an error for Delaware 1778 (Fort Pitt); I flag it `[disputed]` | `[verified]` quote (archives.gov/legislative/research/getting-started/american-indian-treaties) |
| **National Archives**, "American Indian Treaties" | "The U.S. government negotiated 377 treaties with American Indian nations between 1774 and 1871" (no ratified/unratified split). Original treaties on Microfilm Publication M668. | 1774-1871 | Unclear basis; does not equal ratified plus unratified (370 plus at least 45) | `[verified]` quote; basis `[unverified]` |
| **National Archives** conservation blog (2021) | "374 Ratified Indian Treaties", dates **1722 to 1869**, transferred to NARA in the late 1930s | 1722-1869 | Includes colonial/British-era items | `[verified]` |
| **National Archives** series table (catalog-links page) | Numbered series **1 to 374**, plus items numbered **19A** and **143A** | 1722-1868 | See reconciliation below | `[verified]` (extracted this session; see `seed-data/nara-ratified-treaties-index.csv`) |
| **NMAI** "Nation to Nation" | Exhibited treaties "representative of the approximately 374 that were ratified between the United States and Native Nations" | 1778-1868 (exhibit) | NARA series count | `[verified]` (americanindian.si.edu/nationtonation) |
| **IDA Treaties Explorer** (Museum of Indian Arts and Culture, Santa Fe, with NARA Office of Innovation) | 374 "Ratified Indian Treaties" | NARA holdings | Same as NARA | `[verified]` |
| **UNL American Indian Treaties Portal** | **375** "federally recognized" treaties; OSU hosts 366 final texts, the portal supplies the remaining nine that are absent from the Statutes at Large; its treaty-lexicon work analyzes "368 federal and 7 British-era treaties" | Through 1871 | 368 federal + 7 British-era = 375 | `[verified]` (treatiesportal.unl.edu) |
| **ASU law library guide** | Kappler Revisited indexes "375 Indian treaties recognized by the U.S. Department of State" | n/a | State Department recognition list | `[verified]` (libguides.law.asu.edu/indianlaw/treaties) |
| **HeinOnline** American Indian Law Collection | "418 Native American treaties," 416 with full text, "mostly drawn from the Kappler index"; also "nine additional agreements not identified by Kappler, seven of them with Great Britain" | Colonial to 1880s | Broadest: ratified, unratified, colonial, other-nation documents | `[verified]` marketing text (fdlp.gov file 16797) |
| **Cohen's Statutory Compilation (Indian Law Survey)** as described by HeinOnline | "389 treaties" | n/a | Cohen's own compilation; basis `[unverified]` | `[verified]` as to the claim in Hein text only |
| **Prucha**, *American Indian Treaties: The History of a Political Anomaly* (1994) | Appendix B lists ratified treaties, Appendix C ratified agreements **1872-1911**, Appendix D unratified treaties | n/a | Counts not retrievable this session | Structure `[verified]` (UC Press page); counts `[unverified]` |
| **Wikipedia** | Not used. The list pages I tried (`List_of_Indian_treaties...`) were not found; individual treaty articles were used as pointers only | | | |

### 4.2 Reconciliation (derived from the NARA table)

I extracted all 376 rows of the NARA "Ratified Indian Treaties, 1722-1869" catalog-links table. The structure:

- **Numbers 1-7** are 1722-1768 colonial/British-era items (Five Nations at Fort George 1722; Albany 1726; Lancaster 1744; Logstown 1752; Albany 1754; Fort Pitt 1760; Fort Stanwix 1768). `[verified]`
- **Numbers 8-374** (1778-09-17 Delaware at Fort Pitt through 1868-08-13 Nez Perce) are 367 numbered federal-era items. `[derived]`
- **19A** (Six Nations at New York, 1793-04-11) is a lettered federal-era treaty. Adding it gives **368** federal-era treaties. `[derived]`
- **143A** (1825, "Documents Accompanying the Message Transmitting the Osage, Kansa, and Shawnee Treaties") is a document set, not a treaty, so it is not counted. `[derived]`
- Total treaty items: 374 numbered + 19A = **375**, which matches the UNL "375 = 368 federal + 7 British-era" breakdown exactly. `[derived]`
- Number 55 (Osage, 1808) is flagged "Treaty unavailable" with no NAID; it is counted in the series but the document is missing from the digitized set. `[verified]`

So the cleanest reconciliation is:

> **368 federal-era ratified treaties** (RIT 8-374 plus 19A); **375** if the 7 pre-1778 British-era items are included; **374** is NARA's own "numbered series" figure (1-374) before the 19A addition; and "about 370" is a rounded prose figure used by BIA and the Senate archives.

### 4.3 Why the figures differ

1. **Colonial/British-era items.** NARA, NMAI and IDA count 374 starting in 1722; BIA and Senate counts start in 1778 or 1789. (7 items.)
2. **Lettered and supplementary documents.** NARA's 19A and 143A, and "additional articles" folded into one file (e.g., RIT 18 includes the 1792-02-17 article), change the totals by one or two. UNL counts 19A; the NARA headline number does not.
3. **State Department / Kappler recognition vs. archival existence.** UNL notes nine of the 375 are not printed in the Statutes at Large volumes; OSU therefore hosts only 366 final texts. A review of the Deloria and DeMallie collection mentions "four that Kappler and the State Department both omitted" `[verified]` via digitalcommons.unl.edu/greatplainsquarterly/2215 (a book review; the four are not named there).
4. **Counting basis.** "Treaties" vs. "treaty instruments" (multiple treaties signed with different bands the same day, as at Fort Sully 1865, count separately in NARA's numbering).
5. **Broader compilations.** HeinOnline's 418 and Cohen's 389 include unratified treaties, colonial items and non-US-tribe documents, so they are not comparable to a ratified count.
6. **Rounded prose.** "Approximately 370" and "370" are rounded.
7. **Date range of the shelf.** NARA's "Ratified Treaty File, 1801-1868" vs. its numbered series from 1722 means the two do not describe the same set.

### 4.4 Fort Laramie 1851: an apparent gap

The 1851 Treaty of Fort Laramie (Horse Creek), 11 Stat. 749, Kappler II:594 `[verified]` (Stat. via Stat. vol. 11 index; Kappler via Wikipedia pointer), **does not appear in the NARA numbered table as I extracted it**: there is no row dated 1851-09-17 between RIT 258 (1851-07-23, Traverse des Sioux) and RIT 259 (1851-08-05, Mendota). Candidate explanations: (a) a table-extraction omission; (b) the Senate-amended treaty was never proclaimed in the usual way (UNL's portal carries "a proposed corrected text reflecting Senate changes that were never published"); (c) it is carried in NARA's separate unratified or amended files. This must be resolved before the atlas states a count. `[unverified]`

## 5. Unratified treaties

| Source | Figure | Tag |
|---|---|---|
| BIA | "At least 45 others were negotiated with tribes but were never ratified by the Senate." | `[verified]` |
| Senate archives | "several dozen" | `[verified]` |
| California alone | **18** treaties negotiated 1851-1852 by three commissioners (Redick McKee, George W. Barbour, Oliver M. Wozencraft; Heizer 1972 names them as commissioners A-R schedule) | `[verified]` (Heizer 1972 PDF at digicoll.lib.berkeley.edu; Prologue article for the 18) |
| NARA unratified file | Unratified Treaty File, 1821-1869 on microfilm T494 (NAID 300293); count not retrieved | `[verified]` existence; count `[unverified]` |

**California details (important for the atlas):**
- 18 treaties, lettered A-R in Heizer's schedule; negotiated 1851-03-19 through 1852-01-07; signed by "134 bands" per Kelsey as quoted in the Prologue article (initial report said 90). `[verified]`
- Referred to the Senate Committee on Indian Affairs 1852-06-27, reported without amendment 1852-06-28; rejected in secret session. **Rejection date conflict:** Heizer (via Mechoopda page) 1852-07-08; Prologue/NARA article says 1852-07-02. `[disputed]`
- Injunction of secrecy lifted 1905-01-18; printing ordered 1905-01-19. `[verified]`
- Proposed reservations: "more than eight million acres" in total per the Mechoopda Indian Tribe's history page (self-described tribal source). Heizer does not give a total. `[verified]` as a claim by that source, `[unverified]` as an acreage.
- In 1928 California Indians were permitted to sue the federal government for compensation (Mechoopda page). `[verified]` as reported; statute cite not retrieved.

**Other individually identified unratified treaties:** Pike's Sioux treaty of 1805 (Kappler II:1031 via OSU slug), Cherokee treaty of 1835-03-14 (Kappler II:1041, "unratified" in Kappler's index), and the 1830 Franklin Treaty with the Chickasaw (Wikipedia pointer). All three are in the seed CSV.

**Total unratified:** The defensible statement is "BIA: at least 45; Senate archives: several dozen; the California 18 are a subset." A precise number requires counting NARA's unratified file (T494) and Kappler's unratified section. `[unverified]`

## 6. Agreements (1871-1913): the count is a gap

What is established:
- Congress ended treaty-making in 1871, but "continued bilateral negotiation under the names 'conventions' or 'agreements'", ratified "by statute" by both houses (book review of Deloria and DeMallie's *Documents of American Indian Diplomacy*, digitalcommons.unl.edu/greatplainsquarterly/2215). `[verified]`
- Prucha's Appendix C covers "ratified agreements with Indian tribes from 1872 to 1911" `[verified]` (UC Press), and Deloria and DeMallie's collection runs "1775-1979" and includes unratified treaties, Texas and Confederate treaties, and treaties between Indian nations `[verified]` (NARF NILL guide).
- Senate and NARA prose: after 1871 "treaties were made through Acts of Congress, Executive Orders, and Executive Agreements" `[verified]`.

What is not established this session: a count of agreements. I did not locate a source stating one, and I did not count Kappler vol. I or the Statutes. The seed CSV carries only illustrative agreement rows (Black Hills 1877, Jerome 1892/1900, Brunot 1873-74). `[unverified]` I deliberately do not offer an estimate here.

**Recommended method for the next pass:** build the agreements table from Prucha Appendix C (print) cross-checked against Kappler vol. I and the relevant Statutes at Large Indian-appropriation acts, and record each agreement's ratifying statute.

## 7. Executive-order reservations

- Existence and mechanism: reservations "were generally established by executive order" under the Grant-era policy (Wikipedia, pointer); Hopi 1882 is an example. `[verified]`
- Congressional limits: 25 U.S.C. 211 (Act of May 25, 1918, 40 Stat. 570), Arizona and New Mexico. `[verified]` A broader 1927 statute on boundary changes to executive-order reservations (44 Stat. 1347, 25 U.S.C. 398d) is `[from-memory]`.
- Counts: Wikipedia (pointer) reports 326 Indian reservations today totaling about 56.2 million acres, citing BIA; I did not obtain a count of executive-order reservations or the compilation "Executive Orders Relating to Indian Reservations" (`[from-memory]`, published 1912 and covering 1855 onward).

## 8. Recommendations for the atlas

1. Use **NARA's RIT number and NAID** as the primary key for ratified treaties (`seed-data/nara-ratified-treaties-index.csv`), with Statutes at Large and Kappler citations as secondary keys. NAIDs and RIT numbers are stable and public; the IDA Treaties Explorer URL pattern `https://digitreaties.org/treaties/treaty/{NAID}` was confirmed for one record.
2. Display counts as **"368 ratified federal-era treaties in the National Archives series (375 including British-era items); about 370 in common usage"** with a tooltip that lists the reasons in section 4.3.
3. Show **unratified** treaties with a distinct visual treatment and the "Senate action: rejected / never acted on" label; the California 18 should be a named set.
4. Never present agreements or executive-order reservations as "treaties." Use the `instrument_type` column.
5. Carry **successor-in-interest** data from the OSU Tribal Treaties Database only with tribal review. The OSU record for New Echota shows the project's own process: "Responses have been received from some, but not all, tribes," including a Cherokee Nation Attorney General concern about the United Keetoowah Band as a successor.

## Sources

Consulted this session (URLs fetched or returned by search):
- BIA FAQ: https://www.bia.gov/faqs/does-united-states-still-make-treaties-indian-tribes
- National Archives, American Indian Treaties: https://www.archives.gov/research/native-americans/treaties
- National Archives, treaty supporting documentation (Special List No. 6; T494): https://www.archives.gov/research/native-americans/treaties/supporting-documentation
- National Archives, Ratified Indian Treaties catalog links (RIT numbering and NAIDs): https://www.archives.gov/research/native-americans/treaties/catalog-links
- National Archives, Center for Legislative Archives, American Indian treaties: https://www.archives.gov/legislative/research/getting-started/american-indian-treaties
- National Archives blog, "Conserving Ratified Indian Treaties, 1722-1869": https://text-message.blogs.archives.gov/2021/07/20/back-to-the-future-conserving-ratified-indian-treaties-1722-1869/
- National Archives Prologue, California treaties (fall/winter 2013): https://Www.archives.gov/publications/prologue/2013/fall-winter/treaties.pdf
- NMAI Nation to Nation: https://americanindian.si.edu/nationtonation/
- IDA Treaties Explorer: https://digitreaties.org/ and https://digitreaties.org/treaties/treaty/100378072
- OSU Tribal Treaties Database: https://treaties.okstate.edu/ , https://treaties.okstate.edu/treaties/ , https://treaties.okstate.edu/indexes/kapplers-index , https://treaties.okstate.edu/indexes/comprehensive-index , https://treaties.okstate.edu/treaties/treaty-with-the-six-nations-1784-0005 , https://treaties.okstate.edu/treaties/treaty-with-the-choctaw-1830-0310
- OSU Library Tribal Treaties Database poster: https://shareok.org/handle/11244/337194
- OSU Oklahoma Built (Kappler records): https://oms.library.okstate.edu/s/oklahoma-built/item/5084 , https://oms.library.okstate.edu/s/oklahoma-built/item/4845
- UNL American Indian Treaties Portal: https://treatiesportal.unl.edu/ , https://treatiesportal.unl.edu/info.html , https://treatiesportal.unl.edu/kapplermap/index.html
- Statutes at Large vol. index lists (OCR): https://dheller.org/Timeline-files/US-Statutes/v7/Treaties-v7-List.pdf and equivalents for v9, v10, v11, v12, v13, v14, v15, v16
- Cornell LII, 25 U.S.C. 71: https://www.law.cornell.edu/uscode/text/25/71 ; 25 U.S.C. 211: https://www.law.cornell.edu/uscode/text/25/211
- Teaching Legal History (UNL), Indian Appropriations Act 1871: https://teachinglegalhistory.unl.edu/s/oer/item/956
- Avalon Project, Articles of Confederation: https://avalon.law.yale.edu/18th_century/artconf.asp ; Avalon Native American treaty index: https://avalon.law.yale.edu/subject_menus/ntreaty.asp
- OU Law, Cohen-style chapter on Indian treaties: https://thorpe.law.ou.edu/cohen/3cohen33.pdf
- Heizer (1972), Eighteen Unratified Treaties (UC Berkeley Archaeological Research Facility): https://digicoll.lib.berkeley.edu/record/83366/files/arfs003-001.pdf
- Mechoopda Indian Tribe, treaties page: https://mechoopda-nsn.gov/history/treaties ; Pechanga Band, California treaties: https://www.pechanga-nsn.gov/index.php/history/facts-or-myths/pechanga-history-fact-or-myth/california-treaties
- ASU Law library guide: https://libguides.law.asu.edu/indianlaw/treaties ; NARF NILL guide: https://narf.org/nill/triballaw/treaties.html
- HeinOnline American Indian Law Collection (marketing text): https://fdlp.gov/file-download/download/public/16797
- Review of Deloria and DeMallie (Great Plains Quarterly): https://digitalcommons.unl.edu/greatplainsquarterly/2215 ; Indiana Univ. AISRI unratified treaties page: https://indigenousknowledge.indiana.edu/research-and-educational-activity/editorial/unratified-treaties.html
- UC Press, Prucha *American Indian Treaties*: https://www.ucpress.edu/books/american-indian-treaties/paper
- Wikipedia (pointer only): Treaty of Fort Pitt, Indian Removal Act, Nonintercourse Act, Dawes Act, Lone Wolf v. Hitchcock, Alaska Native Claims Settlement Act, Apology Resolution, Indian reservation, Treaty of Guadalupe Hidalgo, and individual treaty articles cited in `seed-data/treaties-seed.csv`

## Confidence & Gaps

**Confidence: medium.** The treaty-count reconciliation (368/375/374/about 370) is high confidence because it rests on the NARA table and the UNL breakdown agreeing exactly. The legal-chronology rows are high confidence where marked `[verified]`; several statutory dates and Statutes at Large pages are `[from-memory]`.

**Not verified or open:**
1. Total number of unratified treaties (BIA says at least 45; no firm figure).
2. Number of post-1871 agreements; no source located.
3. Whether Fort Laramie 1851 belongs in the NARA ratified numbering; its absence from the extracted table needs a check.
4. The "377 negotiated, 1774-1871" NARA figure has no stated basis and does not equal ratified plus unratified.
5. The Senate-archives page's "first ratified treaty... Delaware in 1788" is likely a typo for 1778 `[disputed]`.
6. California rejection date: 1852-07-08 (Heizer, Mechoopda) vs. 1852-07-02 (Prologue).
7. Statutes at Large pages are drawn from OCR'd volume indexes; several (esp. vols. 11-12) are visibly corrupted (e.g., Point No Point printed as p. 988 versus the correct 933 from the Wikipedia pointer). Treat Stat. pages marked `[from-memory]` or "OCR" in the CSV as needing a check against LOC or govinfo scans.
8. Prucha's and Cohen's actual counts (books not accessed); the 389 and 418 figures are from vendor text.
9. Constitutional clause text, Northwest Ordinance, 1855 start of executive-order reservations, and the Senate-House dispute over 1871 were not checked this session.
10. Wikipedia list pages could not be retrieved; no Wikipedia count is recorded.
