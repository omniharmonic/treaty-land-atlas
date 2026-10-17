---
title: Nations, names and links that need a person
author: Benjamin Life (@omniharmonic)
date: 2026-10-17
status: open
---

# Nations, names and links that need a person

Short list for the owner and, later, for each nation's reviewers. Nothing here has been reviewed by a Native nation. Every row in the graph that touches a nation is `proposed` and labeled as such on the site.

## 1. Successor claims marked disputed

`crosswalks/nation-successor-research.csv` rows with `disputed=true`. The research found each government's own statement; the claims conflict.

- **Cherokee:** the Cherokee Nation, the United Keetoowah Band (whose site calls itself "Successor in Interest") and the Eastern Band each carry Cherokee treaty history. The Cherokee Nation's objection to the UKB link is noted in the row.
- **Delaware (Lenape):** the Delaware Tribe of Indians and the Delaware Nation both claim the 1778 Fort Pitt treaty.

Default: show every claim with its source and the word "disputed"; never pick one.

## 2. Names the research flagged

| Nation id | Issue | Suggested action |
|---|---|---|
| nat-gros-ventre | Label uses "A'aninin"; the Fort Belknap Indian Community writes "Aaniiih" | Change the label to the community's spelling after a check |
| nat-crow (alias) | Alias "apsaalooke" has no accent; the Montana state page writes "Apsáalooke" | Add the accented form as preferred |
| nat-pd-mechoopda | The tribe's site spells its name "Mikćapdo" | Use the tribe's spelling |
| Flathead (alias) | The Confederated Salish and Kootenai Tribes say "Flathead" is "not a tribal name" | Keep only as a historical/treaty name, never as a label |
| nat-pd-spirit-lake, nat-pd-kiowa-tribe, nat-pd-crow-tribe, nat-pd-stockbridge-munsee, nat-pd-miccosukee | Labels differ from the 2026 Federal Register name | Labels kept; the official name is stored alongside |
| Walla Walla | The Oregon Blue Book says the Walla Walla at Warm Springs were "later called the Warm Springs": the name may mean two groups | Review successor links for both |
| Hidatsa alias "belantse-etoa" | No source found | Remove unless sourced |
| "Blackfeet" | Also the Lakota Siha Sapa band (not the Blackfeet Nation of Montana) | Existing overrides handle two cases; watch for more |

## 3. Nations not on the 2026 Federal Register list

Kept as present-day nodes; nothing is asserted about their status beyond what their own sources say.

- Southern Sierra Miwuk Nation (petitioning since 1982 per its own site; recognition value corrected, see `data/CHANGELOG-DATA.md`)
- Coastal Band of the Chumash Nation
- Esselen Tribe of Monterey County
- Chinook Indian Nation
- Duwamish Tribe and Winnemem Wintu Tribe appear in research or USFS data but have no node yet (two research rows dropped). Decide whether to add them.

Mille Lacs Band and White Earth are listed by the Federal Register as component reservations of the Minnesota Chippewa Tribe; the graph links them with `part_of`.

## 4. Links that could not be made

- **18 unratified California treaties (1851-52)** name dozens of bands ("Taches", "Yo-kol", "Ko-ya-te" ...) that match no nation node. A focused research pass could link them to present-day rancherias and tribes.
- **Predecessor names with no historical-party node:** Sicangu (Rosebud, Lower Brule), Hunkpati (Crow Creek), Mnicoujou / Siha Sapa / Oohenumpa / Itazipco (Cheyenne River), Mouache and Caputa (Southern Ute), Mescalero and Lipan, Cut-Head Yanktonai, Snohomish / Snoqualmie / Skykomish (Tulalip). Decide whether band-level historical nodes are wanted.
- **Royce cessions:** 510 of 724 cessions link to an instrument. Most of the rest are executive orders (180 dates) and statutes (103 dates), which name no treaty. 28 dates with a Kappler link found no instrument signed that day; they are listed by `npm run links:review -- --report`.
- 11 USFS present-day attributions read "Nonfederally Recognized Indian Groups" or name the Winnemem Wintu; they are not linked.

## 5. Websites that changed hands

The research found these tribal-looking domains serving unrelated or spam content on 2026-10-17. None is used as a source or link in the data.

indiancanyon.org (spam), the Tule River Tribe's site (injected spam text), sancarlosapache.com (jewelry), whiteearth-nsn.gov (casino page), lbst.org (unrelated), cheyenneriversiouxtribe.org (medical site). One Peoria Tribe page carried hidden text addressed to AI tools; it was ignored.


## 6. Nations beyond the federal list: held for a person to check

Imported (104 nations, `crosswalks/nations-beyond-federal-list.csv`): state-recognized tribes confirmed on a state source, and communities with a documented treaty, claims, court or termination record, or a documented acknowledgment petition. Held back, because the only support found was the community's own site, a news report, or a secondary list:

- Amah Mutsun Tribal Band (California (Santa Cruz / San Benito region)): petitioning federal acknowledgment. disputed: nat-pd-amah-mutsun-msjb (leadership dispute within Petitioner #120 led to a separate petition #412). Petition #120 status unclear: absent from the cur
- Amah Mutsun Tribal Band of the Mission San Juan Bautista (California (San Benito County)): petitioning federal acknowledgment. disputed: nat-pd-amah-mutsun. No community website found. Two governmental sources document only the petition, not a continuing community.
- The Ancient Boii Tribe-Clovis (NJ): state recognized. Not confirmed by New Jersey; New Jersey sources refer to three recognized tribes.
- Burt Lake Band of Ottawa and Chippewa Indians (MI): state recognized. Michigan House Resolution 193 (2025) commemorates the 'Burt Lake Burnout' and names the 'Cheboiganing Band of Ottawa and Chippewa Indians (Burt Lake Band)' but 
- Central Band of Cherokee (TN): state recognition withdrawn. Secondary (news) source only; the chancery order was not located on a state site. Commission ceased July 1, 2010.
- Chappaquiddick Wampanoag (MA): state recognized. Not confirmed by Massachusetts. EO 637 (2024) names only Mashpee, Gay Head, Hassanamisco Nipmuc and Herring Pond as recognized; the MA Commission on Indian Affa
- Chaubunnagungamaug Nipmucks (MA): state recognized. Not confirmed by Massachusetts. EO 637 (2024) names only Mashpee, Gay Head, Hassanamisco Nipmuc and Herring Pond as recognized; the MA Commission on Indian Affa
- Cherokee Wolf Clan (TN): state recognition withdrawn. Secondary (news) source only; the chancery order was not located on a state site. Commission ceased July 1, 2010.
- Chickamauga Band (TN): state recognition withdrawn. Secondary (news) source only; the chancery order was not located on a state site. Commission ceased July 1, 2010. Cherokee One Feather (June 2010) spells it 'Ch
- Nanticoke Indian Tribe (Nanticoke Indian Association) (Delaware (Millsboro)): not federally recognized. Treaty claim documented only by the tribe's own site; OFA list confirms petitioner status only. State recognition by Delaware not verified here (another researc
- Pocasset Wampanoag Tribe (MA): state recognized. Not confirmed by Massachusetts. EO 637 (2024) names only Mashpee, Gay Head, Hassanamisco Nipmuc and Herring Pond as recognized; the MA Commission on Indian Affa
- Remnant Yuchi Nation (TN): state recognition withdrawn. Secondary (news) source only; the chancery order was not located on a state site. Commission ceased July 1, 2010.
- Sand Hill Band of Indians (NJ): state recognized. Not confirmed by New Jersey. NJ AG settlement agreements and a Governor's-office letter quoted by the NJ courts refer to three recognized tribes.
- Schaghticoke Indian Tribe (Connecticut (Kent)): petitioning federal acknowledgment. disputed: nat-pd-schaghticoke-tribal-nation. schaghticokeindiantribe.com is a parked domain. Continuing community not independently documented in sources opened
- Seaconke Wampanoag Tribe (MA): state recognized. Not confirmed by Massachusetts. EO 637 (2024) names only Mashpee, Gay Head, Hassanamisco Nipmuc and Herring Pond as recognized; the MA Commission on Indian Affa
- Tanasi Council (TN): state recognition withdrawn. Secondary (news) source only; the chancery order was not located on a state site. Commission ceased July 1, 2010.
- Texas Band of Yaqui Indians (TX): state recognized. The resolution honors the band; the tribe describes it as state recognition, Wikipedia as a congratulatory resolution. Recorded here only as the tribe's claimed
- United Eastern Lenape Nation (TN): state recognition withdrawn. Secondary (news) source only; the chancery order was not located on a state site. Commission ceased July 1, 2010.
- United Remnant Band of the Shawnee Nation (OH): state recognized. Secondary sources only. Also named under 'Ohio (1)' in the undated AIAC multi-state list (https://aiac.alabama.gov/wp-content/uploads/2026/05/StateRecognizedTri

Default: add a held row only when a state source, court or claims record, or the nation itself confirms it. Communities the research excluded on purpose (no qualifying record found) are listed in the research summary in the commit message of this change.

Disputed pairs are shown as separate nations, each marked disputed: Amah Mutsun (two petitions), Schaghticoke (two organizations), Juaneño/Acjachemen, Gabrielino/Tongva.

## How to record a decision

- A link: `npm run links:review -- --decide=<edge id> --decision=accepted|rejected --role="<role>"`.
- A name or label: edit `crosswalks/nation-names.csv` or `nation-entities.csv` and log it in `data/CHANGELOG-DATA.md`.
- A nation's review: a row in `crosswalks/tribal-review-ledger.csv` (status, scope, date, reviewer role, record id).
