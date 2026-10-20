# Unratified treaties, Senate amendments without consent, and post-1871 consent failures

Benjamin Life (@omniharmonic), Living Law, Living Land. Research-assistant draft, web pass WEB-UR, 2026-10-20.

Companion data: `findings/web-unratified.csv` (56 rows, WEB-UR-001 to WEB-UR-056).

**Method and limits.** WebFetch could not reach any host this session (DNS failure), and direct downloads from archives.gov were blocked. All web evidence came from WebSearch result summaries and catalog titles. I did not read full texts. The search budget ran out before I could check the Little Arkansas 1865 amendment, the Pike 1805 status, the 1853 Lane compact, or the 1866 Ute, Crow and Sioux details. Items resting on my own background knowledge are tagged `[from-memory, not verified this session]` in the CSV and rated low or medium confidence. The best single enumerating source turned out to be the UW-Madison digitized copy of NARA microfilm T494: each unratified treaty has a catalog title of the form "Documents relating to the negotiation of an unratified treaty of [date], with the [nation] Indians." Those titles confirm that each instrument exists. They do not give its content.

## 1. Summary: the ten most important points

1. The atlas has 21 unratified treaties: the California 18, Pike 1805, Cherokee 1835-03-14, and Franklin 1830. This pass found **at least 40 more** with dated, sourced identification. That is consistent with the BIA's "at least 45" being an undercount.
2. **Western Oregon is the biggest gap.** The six Champoeg treaties (1851), the Clackamas treaty (1851), the roughly ten Tansy Point treaties (1851), the Port Orford treaty (1851) and Palmer's Coast Treaty (1855) were all signed and never ratified. On much of the central Oregon coast, no ratified cession instrument exists at all (WEB-UR-011).
3. **New Mexico, 1855.** Governor Meriwether made six treaties (Mescalero, Mimbres/Gila Apache, Navajo at Laguna Negra, Capote Ute, Moache Ute, Jicarilla). Pierce sent them to the Senate on 1856-01-21 and none was ratified. Each promised a defined reserve that never came into being.
4. The **Navajo unratified series** runs 1846 (Bear Springs), 1855 (Laguna Negra), 1858-12-25 (Fort Defiance) and 1861-02-15 (Fort Fauntleroy). All were made under military pressure, and none was ratified before the Long Walk.
5. **The Fort Berthold agreement of 1866-07-27** is marked "Unratified" in Kappler. Congress still appropriated money under it and later settled claims arising from it. This is a clear case of the US treating an unratified instrument as binding when doing so suited it.
6. **Senate amendments.** Fort Laramie 1851 (annuities cut from 50 years to 10 or 15; Crow assent disputed). Fort Atkinson 1853: the 1854 assent to the amendments carries Comanche and Kiowa signatures but **no Plains Apache signatures**. Traverse des Sioux and Mendota 1851: the reservation article was struck, and assent was extracted by withholding goods. Buffalo Creek 1838: only 42 of 81 Seneca chiefs assented, and the Senate ratified anyway.
7. **The Soda Springs Shoshone-Bannock treaty (1863-10-14)** was approved with amendments. There is no record of tribal assent, and it was never proclaimed.
8. **Post-1871 consent failures.** Jerome 1892 broke the Medicine Lodge Art. 12 three-fourths rule (alleged 23 signatures short, with counterfeit signatures) and led to *Lone Wolf v. Hitchcock*. Manypenny 1876 drew about 10% of adult men against the Fort Laramie 1868 Art. 12 three-fourths requirement, and was enforced through the "sell or starve" rider. Crook 1889 reached three-fourths only through promises and threats.
9. **Non-US instruments with US land effects.** The Republic of Texas Bowles Village treaty (1836) granted the Cherokee fee-simple title in East Texas. It was rejected in 1837, and the Cherokee were driven out at the Neches in 1839. The Confederate Pike treaties (1861) were later used to justify the 1866 Reconstruction cessions.
10. The **Osage Sturges/Drum Creek treaty (1868)** would have sold about 8 million acres to a railroad at roughly 20 cents an acre. It was withdrawn in 1869.

## 2. What the atlas most likely gets wrong or flattens

- **The count of unratified treaties.** The atlas README says "Only 21 are included." The real list is far longer (table below).
- **Western Oregon coast.** The atlas probably shows this land as ceded. The only cession instrument was the unratified 1855 Coast Treaty, and the 1851 Dart treaties were also never ratified. The land should be labeled "no ratified cession", not "ceded" (WEB-UR-008 to 011). Atlas note V055 left this `[unverified]`; this pass finds the treaty unratified.
- **Mendota 1851 (TLA-T-259)** is not marked `partial`. The Senate struck Art. 3 of Mendota as well as Traverse des Sioux.
- **Fort Atkinson 1853 (TLA-T-262).** The atlas has no amendment flag. The Senate amended the treaty (vote of 38-3 on 1854-04-12), and the Apache did not sign the acceptance.
- **Fort Laramie 1851 (TLA-T-FL1851).** The atlas mentions the 50-to-10-year cut but not the piecemeal, disputed assent or the decades of doubt over whether the treaty was in force.
- **Franklin 1830.** The full date is 1830-08-31 (Avalon text).
- **Pike 1805** may be wrongly labeled unratified. My recollection, unverified, is that the Senate consented in 1808 but the treaty was never proclaimed.
- **Little Arkansas 1865 (TLA-T-341)** may show a reservation that the Senate amendment nullified. This is unverified and rated low confidence.
- The Fort Berthold 1866 agreement appears only inside violation V028. It should be its own instrument row.
- Royce's schedule lists the California and other unratified cessions as cessions. Any polygon taken from Royce that cites an unratified treaty should get its own legend class.

## 3. Land promised or reserved, with boundaries usable for mapping

- **Bowles Village, 1836 (Texas):** the San Antonio road on the south, the Angelina River, a due-north line from the Angelina to the Sabine, then the Sabine. The road-to-Neches segment ran up the east side of the Neches toward the northwest. The historian quoted calls the description vague. Roughly present Cherokee and Smith counties plus parts of Rusk, Van Zandt and Gregg. Sources disagree on the acreage: about 150 sq mi vs 1.5 million acres.
- **Mendota, 1851 (struck by the Senate):** a reservation 20 miles wide centered on about 150 miles of the upper Minnesota River.
- **Moache Ute, 1855:** the reserve included part of the San Luis Valley where settlers already farmed. The full metes and bounds are on Avalon (uta1855), which I did not read.
- **California 18:** about 7.4 to 7.5 million acres, already mapped through the atlas crosswalk of Royce areas 273 to 298.
- **Tansy Point (Lower Chinook, 1851-08-09):** the bands kept village sites plus fishing, grazing and cranberry rights within the ceded area. Boundaries need the text (accessgenealogy has a transcription).
- **Osage Diminished Reserve, 1868:** about 8 million acres, the whole reserve (in the failed railroad sale).

## 4. Quotes worth preserving

- Kappler, as reprinted: "AGREEMENT AT FORT BERTHOLD, 1866. July 27, 1866. | Unratified." (WEB-UR-023)
- Van Buren to the Senate, January 1839, on Buffalo Creek: "the assent of forty-two out of eighty-one chiefs has been obtained" (WEB-UR-051)
- Indian Office file note on the October 1863 Doty treaties: "there is not in our files any acknowledgment by him of their receipt" (WEB-UR-043)
- No page cites are given: these are web sources, and the quotes come from search snippets. Check each against the primary text before publishing.

## 5. Unratified treaties the atlas lacks

Status key: **C** = confirmed as unratified by a catalog or primary-text source; **S** = secondary sources only; **V** = needs verification.

| CSV id | Date | Nations | Instrument | Place | Status |
|---|---|---|---|---|---|
| WEB-UR-037 | 1821-08-18 | Menominee, Winnebago, New York Indians | Unratified treaty (Green Bay) | Green Bay | C |
| WEB-UR-038 | 1830-07-10 | Sauk and Fox, Sioux, Winnebago, Menominee (+Omaha, Iowa, Oto) | Unratified treaty | Prairie du Chien | C (date vs 07-15 ratified) |
| WEB-UR-041 | 1831-06-30 | Sauk (British Band) | Gaines-Reynolds capitulation | Rock Island | S |
| WEB-UR-040 | 1832-10-03 | Chickasaw | Unratified instrument | Chickasaw Nation | V |
| WEB-UR-039 | 1833-11-12 | Delaware, Pawnee, Shawnee, others | Unratified treaty | n/a | C |
| WEB-UR-044 | 1836-02-23 | Texas Cherokee and associated bands | Bowles Village (Republic of Texas) | East Texas | S |
| WEB-UR-018 | 1846-11-22 | Navajo | Bear Springs (Doniphan) | Ojo del Oso | S |
| WEB-UR-036 | 1849-10-09 | Sioux (Dakota) | Unratified treaty | Minnesota | C |
| WEB-UR-002 to 007 | 1851-04/05 | Santiam, Tualatin, Yamhill, Luckiamute Kalapuya; Molala (two) | Willamette Valley Treaty Commission | Champoeg | S |
| WEB-UR-009 | 1851-08 | Clatsop, Lower Chinook, Wahkiakum, Kathlamet, Willapa, others | Tansy Point treaties (about 10) | Tansy Point | S |
| WEB-UR-010 | 1851-09-19/20 | Coquille, Euchre Creek, Tututni | Port Orford treaty | Port Orford | S |
| WEB-UR-008 | 1851-11-06 | Clackamas | Dart treaty | Oregon City | S |
| WEB-UR-021 | 1853-04-07 | Mimbres/Gila Apache | Lane provisional compact | Fort Webster | V |
| WEB-UR-035 | 1853-08-06 | Winnebago | Unratified treaty | Minnesota | C |
| WEB-UR-011 | 1855-08/09 | Alsea, Siuslaw, Coos, Lower Umpqua, Tillamook (list not verified) | Oregon Coast Treaty (Palmer) | Oregon coast | S |
| WEB-UR-012 | 1855-06-14 | Mescalero Apache | Meriwether | Fort Thorn | C (OSU "Not Ratified") |
| WEB-UR-013 | 1855-06 | Mimbres/Gila Apache | Meriwether | Fort Thorn | S |
| WEB-UR-014 | 1855-07-18 | Navajo | Laguna Negra (Meriwether) | Black Lake | S |
| WEB-UR-017 | 1855 | Jicarilla Apache | Meriwether | Chama / Abiquiu | S |
| WEB-UR-015 | 1855-08-08 | Capote Ute | Meriwether | Abiquiu | S (date V) |
| WEB-UR-016 | 1855-09-11 | Moache Ute | Meriwether | Abiquiu | C (Avalon text) |
| WEB-UR-034 | 1856-12-16 (and 1858) | Christian (Moravian) Indians | Unratified treaties | n/a | C |
| WEB-UR-019 | 1858-12-25 | Navajo | Bonneville treaty | Fort Defiance | C |
| WEB-UR-020 | 1861-02-15 | Navajo | Canby treaty | Fort Fauntleroy | C |
| WEB-UR-045 | 1861-07/10 | Five Tribes and others | Confederate (Pike) treaties (non-US) | Indian Territory | S |
| WEB-UR-022 | 1863-04-06 | Kiowa, Comanche, Apache | Washington treaty | Washington DC | C (OSU; D&D p. 867) |
| WEB-UR-043 | 1863-10-14 | Mixed Shoshone and Bannock | Soda Springs (Doty), amendments never assented | Soda Springs | S/V |
| WEB-UR-033 | 1865-09-13 | Cherokee, Creek, Choctaw, Chickasaw, Osage, Seminole, Seneca, Shawnee, Quapaw | Fort Smith Council treaty | Fort Smith | C |
| WEB-UR-025 | 1866-06-27 | Cheyenne, Brule and Oglala Lakota | Fort Laramie council treaty | Fort Laramie | C |
| WEB-UR-024 | 1866-07-16 | Crow | Unratified treaty | n/a | C |
| WEB-UR-023 | 1866-07-27 | Arikara, Hidatsa, Mandan | Fort Berthold agreement | Fort Berthold | C (Kappler) |
| WEB-UR-026 | 1866 | Uinta and Yampa Ute | Unratified agreement | n/a | C |
| WEB-UR-027 | 1867-08-26 | Bannock | Ballard treaty | Idaho | C (OSU) |
| WEB-UR-042 | 1868-05-27 | Great and Little Osage | Sturges / Drum Creek | Drum Creek, Kansas | S |
| WEB-UR-030 | 1868-06-01 | Christian Munsee, Swan Creek and Black River Chippewa | Unratified treaty | Kansas | C |
| WEB-UR-028 | 1868-07/09 | Gros Ventre, Blackfeet, Shoshone, Bannock | Montana treaties | Montana | C |
| WEB-UR-029 | 1868-12-10 | Shoshone | Unratified treaty | n/a | C |
| WEB-UR-032 | 1869-02-11 | Iowa, Sauk and Fox of Missouri | Unratified treaty | n/a | C |
| WEB-UR-031 | 1869-02-13 | Oto and Missouria | Unratified treaty | n/a | C |

The atlas already has: the California 18 (WEB-UR-001 adds acreage, the 1905 lifting of secrecy, and the conflicting rejection dates), Franklin 1830 (WEB-UR-046 corrects the date), Cherokee 1835, and Pike 1805 (WEB-UR-047 questions its status).

Senate-amended and post-1871 rows (WEB-UR-048 to 056) refine existing atlas rows and violations (TLA-T-FL1851, TLA-T-262, TLA-T-258/259, V012, V022, V024, V025). They are not new instruments, except that the Little Arkansas 1865 amendment needs checking.

## 6. Open questions and claims needing verification

1. **A full enumeration.** NARA Special List No. 6 and the T494 roll list (rolls 8 to 10) would give the authoritative unratified list. Deloria and DeMallie (1999), vol. 2, prints the texts. Neither was readable this session.
2. The Champoeg treaties: whether there were five or six, and their exact dates. Tansy Point: the exact number (10 or 13) and dates.
3. The Meriwether 1855 dates for the Capote, Jicarilla and Mimbres treaties, and whether the Senate rejected them or simply never acted.
4. California: the rejection date (1852-06-28, 07-02 or 07-08). The K-344 judgment and offsets are not verified here.
5. Fort Laramie 1851: whether the Crow assented (1854-09-18 per the government record) or never did (Wikipedia).
6. Jerome: the 639-adult-men figure and the "23 short" claim are single-source. The page of 31 Stat. needs checking.
7. Sioux Act 1889: 25 Stat. 888 vs 25 Stat. 1002, and the 9-million-acre figure.
8. Pike 1805 (Senate 1808?), Little Arkansas 1865 amendment, Lane 1853 compact, and the Ruby Valley 1863 amendment assent: all unverified.
9. Chinook 1912 payment ($26,308 for 762,000 acres): confirm against the 1912 act.
10. The 1830-07-10 Prairie du Chien unratified item vs the ratified 1830-07-15 treaty: they may be related drafts.

## Sources (as surfaced by web search this session)

- UWDC T494 items: https://search.library.wisc.edu/digital/ARHHOTF3STHSFF8U ; Crow 1866 https://search.library.wisc.edu/digital/AUBYB7TKU4OET79E ; Oto-Missouri 1869 https://search.library.wisc.edu/digital/AITZGBRH5L7NDE82 ; Navajo 1858 https://search.library.wisc.edu/digital/AY3J2CBPTCBUTJ8C ; Cheyenne/Sioux 1866 https://asset.library.wisc.edu/1711.dl/66OSEBH6CSJN28P/E/file-3acc7.pdf ; index https://digicoll.library.wisc.edu/cgi-bin/History/History-idx?type=browse&scope=History.IndianTreatiesMicro
- Oregon Encyclopedia: https://oregonencyclopedia.org/articles/willamette_valley_treaties ; https://oregonencyclopedia.org/articles/anson_dart/ ; https://www.oregonencyclopedia.org/articles/coast_indian_reservation/
- D. G. Lewis, ndnhistoryresearch.com: https://ndnhistoryresearch.com/2020/11/01/1851-treaty-with-the-tualatin-band-of-kalapuyas/ ; https://ndnhistoryresearch.com/2017/11/16/the-1851-treaty-commission-coquille-euchre-and-tototan-at-port-orford/ ; https://ndnhistoryresearch.com/2017/11/20/the-1851-tansy-point-treaty-journal-the-clatsop-treaty/
- Chinook: https://chinooknation.org/?p=484 ; https://chinookstory.org/tansey-point-treaties/
- Meriwether: https://avalon.law.yale.edu/19th_century/uta1855.asp ; https://www.presidency.ucsb.edu/documents/special-message-3048 ; https://oms.library.okstate.edu/s/oklahoma-built/item/22559 ; NPS El Malpais https://www.nps.gov/parkhistory/online_books/elma/hist/hist5.htm
- KCA 1863: https://oms.library.okstate.edu/s/oklahoma-built/item/22789 ; Bannock 1867: https://oms.library.okstate.edu/s/oklahoma-built/item/22657
- Fort Berthold 1866: https://indianlaw.mt.gov/_docs/fortbelknap/treaties/fort_berthold_agreement_1866.pdf ; https://commons.und.edu/indigenous-gov-docs/159
- Fort Laramie 1851: https://en.wikipedia.org/wiki/Treaty_of_Fort_Laramie_(1851) ; https://indianlaw.mt.gov/_docs/fortpeck/treaties/laramie-treaty-1851.pdf
- Fort Atkinson: https://avalon.law.yale.edu/19th_century/cokiap53.asp ; https://voteview.com/rollcall/RS0330090
- Traverse des Sioux / Mendota: https://www.mnhs.org/usdakotawar/stories/history/treaties/whats-treaty ; https://www.govinfo.gov/content/pkg/STATUTE-10/pdf/STATUTE-10-Pg949.pdf
- Buffalo Creek: https://en.wikipedia.org/wiki/Second_Treaty_of_Buffalo_Creek ; https://www.law.cornell.edu/supremecourt/text/173/464
- Fort Bridger / Box Elder 1863: https://www.govinfo.gov/link/statute/13/663 ; https://en.wikipedia.org/wiki/Box_Elder_Treaty
- Bowles Village: https://www.legendsofamerica.com/cherokee-war-battle-neches/ ; https://texashistory.unt.edu/ark:/67531/metapth38048/m1/4
- Confederate treaties: https://treatiesportal.unl.edu/csaindiantreaties/ ; https://encyclopediaofarkansas.net/entries/fort-smith-conference-6394
- Drum Creek: https://en.wikipedia.org/wiki/Drum_Creek_Treaty ; https://oms.library.okstate.edu/s/oklahoma-built/item/22827
- Franklin 1830: https://avalon.law.yale.edu/19th_century/nt008.asp
- Jerome / Lone Wolf: https://en.wikipedia.org/wiki/Lone_Wolf_the_Younger ; https://www.kansashistory.gov/kansapedia/kiowa-lone-wolf-v-hitchcock/19287
- Manypenny: https://en.wikipedia.org/wiki/Manypenny_Agreement ; https://abajournal.com/magazine/article/congress-passes-the-sell-or-starve-act
- Sioux Act 1889: https://www.presidency.ucsb.edu/documents/message-congress-reporting-the-great-sioux-reservation ; https://www.minotstateu.edu/library/_documents/digital_collections/ecoll_history_sioux.pdf
- California: https://digicoll.lib.berkeley.edu/record/83366/files/arfs003-001.pdf ; https://mechoopda-nsn.gov/history/treaties
