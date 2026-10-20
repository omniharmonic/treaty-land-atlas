---
title: Nation Review Protocol for Living Law, Living Land
author: Benjamin Life (@omniharmonic)
date: 2026-10-20
status: draft
confidence: medium
applies_to: landback.land (repo treaty-land-atlas)
companions: review-packet-template.md, site-display-rules.md, outreach-tracker.csv (private repo only)
---

# Nation Review Protocol

**Status: draft.** No Native nation has reviewed this protocol, the atlas, or the K2 research. Everything below is a proposal from the project owner, Benjamin Life (@omniharmonic), and would itself be open to change if a nation, a tribal advisory body (D-08) or the legal reviewer (D-07) asks.

This protocol covers one job: inviting each Native nation to review what the atlas says about it, and doing exactly what the nation decides. It builds on G3 (ethics and data governance), the decision log, the existing claim intake (`/claim/`, `relay/lib/claim.ts`), the review ledger logic in `scripts/build_graph.py`, and the removal fast lane in `data/suppress.yaml`.

---

## 1. Commitments that do not change

1. **Silence is never consent.** No reply, a partial reply, or a reply from an individual who is not speaking for the nation's government never counts as review or approval.
2. **Unreviewed nation-sourced drafts are not published.** The K2 research ("what the nation says," built from the nation's own public pages, testimony and citizen scholarship) stays private until the nation reviews it and agrees, in writing, to publication and to the wording.
3. **Federal-record content stays, labeled unreviewed.** Treaties, statutes, Royce areas, court cases and other public federal records (G3 class P and D) remain on the site with a visible "not reviewed by [Nation]" label, unless the nation asks for the atlas's interpretation, mapping or attribution to be removed (section 7).
4. **The nation decides how it is named and described.** The atlas never "corrects" a nation's names, spellings or terms.
5. **The project never rules between nations.** Where nations' accounts differ, each is shown under its own name, side by side (section 8).
6. **Removal first, discussion second.** A nation's request to remove or restrict is honored at the next build, before any conversation about it.
7. **No agent sends anything.** Every invitation, follow-up and reply is sent by the owner personally, from his own account. Agents may draft, never send, never contact a nation, and never look up or store personal contact details.
8. **Contact details live only in the private claims repo** (`omniharmonic/treaty-land-atlas-claims`) and the private Blob store. Nothing personal is ever committed to the public repo.
9. **Review is not endorsement.** A reviewed page says only that the nation reviewed it, on the date and through the office it names.

These follow the CARE Principles for Indigenous Data Governance (Collective Benefit, Authority to Control, Responsibility, Ethics; GIDA, Carroll et al. 2020) and the NCAI resolution KAN-18-011 (2018), which states that "governance of data and research is within the purview of tribal governments" and defines Indigenous data sovereignty as "the right of each tribe to govern the collection, ownership, and application of data, information, and knowledge about its peoples, lands, and resources."

---

## 2. Who to contact

### 2.1 Rules

- **Contact the government, through its designated office.** In order of preference: (a) an office the nation names on its own site for research, consultation or outside requests; (b) the Tribal Historic Preservation Office (THPO) or Cultural Preservation / Cultural Resources / Culture and Heritage department; (c) a language and culture department; (d) the government's general administration or the office of the chair, president, governor or council, asking which office should receive it.
- **Never use personal contacts.** Not friends, acquaintances, social media, individual citizens, scholars, or staff found through third-party directories. An individual can advise; only the nation's authorized body can consent for the nation (G3 s.3.1).
- **Use only official public pages.** The nation's own website first. State historic preservation office lists (for example the South Dakota SHPO list of tribal chairs and THPOs, or the New Mexico HPD tribal contacts) are cross-checks only, because they are compiled by states and go out of date.
- **Beware lookalike sites.** In the 2026-10-20 check, `oglalalakotanation.info` turned out to be an outside site that says it "does not represent the Oglala Lakota Nation," and `oglalalakotanation.net` serves unrelated gambling content. The SD SHPO list gives `oglala.gov` for the Oglala Sioux Tribe. Every URL in the tracker must be re-checked by the owner before use.
- **Follow the nation's own process where one exists.** Examples found: the Northern Cheyenne Tribe's homepage links a "THPO - Request for Consultations" system; the Eastern Band of Cherokee Indians has a Cultural Institutional Review Board "protecting the cultural, intellectual, and human rights" of the EBCI; the Navajo Nation's Heritage and Historic Preservation Department issues permits for collecting ethnographic information, and the Navajo Nation Human Research Review Board reviews human-subject research. The atlas is not human-subject research and collects no ethnographic data, but the cover letter asks whether any such process applies, and the owner follows the answer.
- **Several governments, one history.** Where more than one government claims a history (for example Cherokee Nation, Eastern Band of Cherokee Indians and United Keetoowah Band; the Oceti Sakowin nations; the Ute nations; Northern Cheyenne, Northern Arapaho and Cheyenne and Arapaho Tribes), each government gets its own packet and its own review. The project does not pick which one speaks for the shared history (D-50).
- **Nations beyond the federal list** (state-recognized, terminated, petitioning, documented communities) are contacted through the community's own published governing body, on the same terms.

### 2.2 The outreach tracker

`outreach-tracker.csv` lists, per nation, the office to contact, its public page, any stated channel, and any published consultation or research policy. It uses office names only. It **lives in the private claims repo**, not the public repo, because it will grow into a working log. Personal names, emails and phone numbers are never added to it; when a nation replies, the reply and the reviewer's contact details stay in the claims repo issue or Blob record, and the public ledger records only the reviewer's role.

---

## 3. When to reach out, and in what order

1. **Before any outreach** (G3 s.3.2 step 1; D-61): publish the positionality statement (the project is not Indigenous-led; who maintains it; funding; how to reach a person), the data policy, the corrections and removal policy, and this protocol. The `/for-tribal-reviewers/` page already states the core commitments.
2. **Pilot first.** Start with two or three nations (D-08). A Colorado pilot fits the K1 and K2 work: the ten nations named in the Colorado tribal history research (PSL TREC 2024): Southern Ute Indian Tribe, Ute Mountain Ute Tribe, Ute Indian Tribe of the Uintah and Ouray Reservation, Kiowa Tribe, Comanche Nation, Apache Tribe of Oklahoma, Eastern Shoshone Tribe, Northern Cheyenne Tribe, Northern Arapaho Tribe, Cheyenne and Arapaho Tribes. The owner chooses which nations and how many.
3. **Learn and adjust** the packet and this protocol after the pilot, logging changes in the decision log.
4. **Expand by region**, prioritizing nations whose pages carry the most content (massacre-linked areas, K1 defect flags, land returns, campaigns).
5. **Respect the nation's calendar.** Avoid known ceremonial seasons, elections and council transitions where the nation publishes them, and do not send many packets to one office at once.

---

## 4. What to send: the review packet

One packet per nation (see `review-packet-template.md`). It is short, plain-language, and complete enough that the office can respond without needing to explore the site:

1. A cover letter, written and sent by the owner personally.
2. "What the atlas says now": every record that names the nation, as a list with links (treaties, Royce areas, cases, statutes, K1 findings and flags, massacre sites, land returns, campaigns, organizations, names and endonyms).
3. The draft "What the nation says" section built from K2 research, clearly marked "DRAFT FOR [NATION] REVIEW - NOT FOR PUBLICATION," with every source linked.
4. Specific review questions.
5. How to respond, including all the options in section 5 and the commitment that no reply means nothing new is published.

Format: a PDF or plain document attached to email, or a printed letter if the office prefers mail. A private review link is optional and only if the office asks; no public preview of unreviewed drafts is ever created.

---

## 5. A nation's options, and what the site does

| Option | What the nation tells us | Ledger status | What the site does |
|---|---|---|---|
| **Approve** | The pages and the draft are acceptable, as is or with small changes | `reviewed` | Publishes the approved "What the nation says" text exactly as approved, credited as the nation chooses, with the review date and office. Badge "Reviewed by [office], [date]." |
| **Correct** | Specific changes to records, names, links, or the draft | `edits_requested`, then `reviewed` | Marks the page "Changes requested by [Nation], in progress." Makes record corrections via `crosswalks/record-corrections.csv` and `nation-corrections.csv`. Sends the revised text back for confirmation. Nothing new is published until confirmed. |
| **Add its own account** | The nation supplies its own text, map, names or statement | `co_authored` | Publishes the nation's text in its own words, under the nation's chosen license (D-03: never defaulting to CC BY), credited to the office the nation names. The project does not edit it except to fix formatting the nation approves. Badge "Written with [office]." |
| **Restrict** | Some content may stay but with limits (no mapping at fine scale, no quotes, no place names, not in the open data download, only certain sections) | `restricted` (proposed new status) | Applies the restriction at the next build, record by record (section 7). Shows a short note only if the nation agrees to one. |
| **Ask to remove** | Remove a page, a record's interpretation, a map layer, a name, or everything about the nation | `withdrawn` | Adds the ids to `data/suppress.yaml` at once and rebuilds. Shows a tombstone only if the nation wants one. See section 7 for federal-record citations. |
| **Decline to engage** | The nation does not want to take part | `declined` | Nothing nation-sourced is ever published. Federal-record content stays, labeled unreviewed. The project does not contact the nation again unless the nation reaches out, or content about it changes substantially (then one short notice, no request). Whether the site says "declined" publicly is the nation's choice; the default public wording is the same as unreviewed. |
| **No response** | Nothing, or only an acknowledgment | `invited`, then `no_response` (proposed) | Nothing nation-sourced is published. Federal-record content stays, labeled unreviewed. The invitation stays open indefinitely. |

Notes:
- A nation can combine options (approve some records, correct others, restrict one, remove one).
- A nation can change its decision at any time, including withdrawing an earlier approval.
- A nation can ask that its review status itself not be shown.
- Approval of one page never implies approval of the project, of other pages, or of other nations' pages.

---

## 6. Timelines

All are targets for the project, never deadlines for the nation.

| Step | Target |
|---|---|
| Acknowledge any reply from a nation | Within 3 business days |
| Removal or restriction request | Applied at the next build, within 48 hours; owner confirms when done |
| Corrections to federal-record content | Within 14 days, or sooner if the nation asks |
| Revised draft back to the nation after edits requested | Within 30 days |
| Nation's review window | The nation sets it. If asked for a default: 90 days, extendable on request, no penalty for missing it |
| Follow-up if no reply | One short, courteous follow-up after about 60 days; one more after about 180 days if the owner judges it appropriate; then mark `no_response` and send nothing further unless the nation writes |
| Re-confirmation after review | When content about the nation changes substantially, and otherwise offered every two years; silence on re-confirmation keeps the earlier review in place but the page shows its review date |

---

## 7. Restriction and removal

1. **Honor first.** The owner adds the ids to `data/suppress.yaml` (removal) or to a proposed `data/restrict.yaml` (restriction, see below) and rebuilds. No justification is asked. The claim intake already marks removal issues "Removal requests are honored first."
2. **What can be removed.** Any nation-sourced content; any of the project's interpretation, summaries, AI-assisted narrative, mapping, successor attribution, links, name associations and K1 flags concerning the nation; massacre-site points; return and campaign entries.
3. **Federal-record citations.** For class P records (a treaty text in Kappler, a statute), G3 s.7.2 and D-65 propose the site may keep the bare primary-source citation while removing the interpretation, mapping and attribution the nation objects to. This is the one point where the project might not do everything a nation asks, so: the owner says so plainly to the nation, offers the bare-citation option, and if the nation still asks for full removal, the owner decides with the legal reviewer and records the decision. Default proposal: remove the record from the nation's page and from search, keep it only in the treaty list itself as a bare citation.
4. **Restrictions** (proposed `data/restrict.yaml`, one row per id): `no_map` (drop geometry or generalize it), `no_quote`, `no_place_names`, `no_open_data` (exclude from downloads and the API), `page_only` (not in search or tours), `no_ai_summary`, and `labels_required` (show only with the nation's TK or BC Labels).
5. **Sensitive locations.** Burials, sacred sites, ceremonial and gathering places are never published at all (G3 class S), with or without a request.
6. **Archives and caches.** The project asks web archives and search engines to drop removed pages where it can, and tells the nation the limits of that promise (G3 s.7.2 item 3).
7. **Record.** A ledger row records the request's date, scope and the reviewer's role. The request text and contact stay in the claims repo.

---

## 8. Intertribal disagreement

1. **Each nation's own position, side by side.** Under a heading such as "Nations differ on this," each reviewed nation's account appears under its own name, its own words, its own date and its own source. Order: alphabetical by the nation's own name, never by size, recognition status or who replied first.
2. **No ruling.** The project adds no verdict, no "most historians say," and no weighting. A neutral one-line note says what the accounts differ on, and the nations may review that note.
3. **Unreviewed accounts are not shown.** If one nation has reviewed and another has not, the reviewed nation's account appears with a note "[Other nation] has not reviewed this. Its own account is not shown here." The unreviewed nation's K2 draft stays private.
4. **The federal record is shown as the federal record**, labeled as such, beside the nations' accounts, never as the tiebreaker.
5. **One nation cannot remove another nation's own account of itself.** If Nation A asks to remove Nation B's statement, the owner tells A that B's account belongs to B and offers A space for its own account and any restriction on the project's interpretation. If a statement names or characterizes another nation, both are invited to review that passage before it is published.
6. **Disputes about who governs a history** (D-50) are not settled by the project. Each government reviews separately.
7. **Map display** of overlapping territories follows the Native Land Digital practice: overlaps are shown, not resolved, and readers are told to contact the nations for boundaries.

---

## 9. Traditional Knowledge and Biocultural Labels and Notices (Local Contexts)

How this works, from the Local Contexts site and Hub guide (fetched 2026-10-20):

- **Labels are the nation's; Notices are the project's.** Communities customize and apply Traditional Knowledge (TK) and Biocultural (BC) Labels through their own community account on the Local Contexts Hub, which can be held by "a cultural department, library, archive, museum, community center, Tribal Historic Preservation Office." Institutions and researchers can only generate Notices.
- **Project steps (proposal).**
  1. The owner registers a researcher or institution account on the Local Contexts Hub (check current terms and any fee before registering; the site takes no money, and any cost is the owner's own).
  2. Create one Hub Project per nation page ("Living Law, Living Land: [Nation] pages"), plus one site-wide Project. Per-nation Projects let a nation's Labels apply only to its own pages.
  3. Apply the **Open to Collaborate** Engagement Notice site-wide. Its standard text: "Our institution is committed to the development of new modes of collaboration, engagement, and partnership with Indigenous Peoples for the care and stewardship of past and future heritage collections."
  4. On each nation's pages, apply the **Attribution Incomplete** Disclosure Notice where the federal record's names, attributions or successor links may be wrong, and the **TK Notice** where federal records contain Indigenous knowledge (for example, treaty-council speeches recorded by federal interpreters). Disclosure Notices "function as place-holders ... until a TK or a BC Label is added by a community."
  5. If the nation has a Hub community account, use "Notify Communities" on its Project, and mention the Project in the packet. Never notify without also writing to the nation's office.
  6. When a nation applies Labels, the Hub replaces the Notices on that Project with the Labels.
- **Display.** Use the Hub's download or API (the Hub API fetches a Project's Labels and Notices by Project ID) at build time, and show the unaltered icon, the Label title (for example "TK Attribution (TK A)") and the community's own Label text, with a link to the live Hub Project. Icons "may not be altered." Never apply, invent or imitate a Label for a nation. Labels a nation states on its own site (recorded in K2's `tk_bc_labels` column) are shown only once the nation confirms it wants them shown here. See `site-display-rules.md` s.6.
- **Labels change behavior, not just display.** TK Secret / Sacred, Culturally Sensitive, Seasonal, Men or Women Restricted, and Community Use Only mean the material is not published here at all, whatever else the record says. TK Non-Commercial and TK Outreach are honored in the open-data license notes.

---

## 10. Compensation and the "no money" tension

The project takes no money: it accepts no donations, sells nothing, and the `/for-tribal-reviewers/` page promises it will not "take money, or ask for it on your behalf." G3 s.3.1 also says review work should be compensated, and CARE's Collective Benefit principle asks that value flow back to the nation. These pull in different directions, and the honest position is:

- **Nothing is promised.** Neither the packet nor the cover letter promises payment. The cover letter says plainly that the project has no funding, and asks what the nation's office normally expects.
- **Reviewing is real work.** Many THPOs are funded for federal Section 106 consultation, not for outside projects, and some charge review or consultation fees. If a nation has a published fee or asks for one, the owner either pays it from his own funds or says honestly that he cannot, and the nation decides whether to proceed. Inability to pay never reduces what the nation may ask for (removal, restriction, correction).
- **Options the owner may consider**, all optional, all disclosed publicly (D-20) and none conditioned on the outcome of a review:
  1. An honorarium paid by the owner personally, at the nation's usual rate, to the nation's government or office (not to an individual unless the nation directs it).
  2. A grant applied for specifically to fund nation review, with the funder disclosed and with the nation's review rights written into the grant terms. A funder never sees or shapes a nation's content.
  3. In-kind support the nation asks for: its data in usable formats, GIS work, removal of misattributions elsewhere, linking to the nation's own programs, Local Contexts setup help.
- **Payment never buys approval.** An honorarium is for the time spent, owed whether the nation approves, corrects, restricts, removes or declines after reading.
- Record any payment's existence (not the amount, unless the nation agrees) in the ledger notes and the funding disclosure.

---

## 11. Record-keeping: `crosswalks/tribal-review-ledger.csv`

The ledger is public. It records what was decided, never who personally said it or how to reach them.

### 11.1 Current header (kept, in this order, so `scripts/build_graph.py` keeps working)

`node_id,status,scope,date,reviewer_role,record_id,notes`

`build_graph.py` reads these by name, applies the latest row per node, and requires `date`, `reviewer_role` and `record_id` for `reviewed` and `co_authored`.

### 11.2 Proposed added columns (appended after the existing ones)

| Column | Meaning | Example |
|---|---|---|
| `event_id` | Unique row id | `TRL-0001` |
| `nation_id` | The nation whose decision this is (may differ from `node_id` when the row concerns a treaty, area or return) | `nat-pd-southern-ute` |
| `event` | `invited`, `follow_up`, `acknowledged`, `response`, `revised_sent`, `confirmed`, `request_removal`, `request_restriction`, `reconfirm` | `response` |
| `response_option` | `approve`, `correct`, `own_account`, `restrict`, `remove`, `decline`, `no_response` | `correct` |
| `office` | Office name only, as the nation names it | `Cultural Preservation Department` |
| `display_review_status` | `yes` / `no`: may the site show this nation's review status | `yes` |
| `credit_as` | Credit line the nation chose | `Southern Ute Indian Tribe, Cultural Preservation Department` |
| `license` | License the nation set for its own contributed text | `nation-terms-2027-01` |
| `restrictions` | Semicolon list from section 7 item 4 | `no_map;no_open_data` |
| `tk_bc_labels` | Labels the nation applied, by code | `TK A;TK NC` |
| `local_contexts_project_id` | Hub Project id, if any | |
| `packet_version` | Which packet the nation reviewed | `K2-2026-11` |
| `next_action_date` | Owner's next step date, if any | `2027-03-01` |
| `private_ref` | Pointer to the claims repo issue or Blob file, no contact details | `claims#12` |
| `recorded_by` | Always the owner's handle | `@omniharmonic` |

### 11.3 Status values

Existing (in `REVIEW_PUBLICATION`): `not_yet_contacted`, `invited`, `edits_requested`, `reviewed`, `co_authored`, `declined`, `withdrawn`.

Proposed additions (each needs a code change in `scripts/build_graph.py` before use, because the build currently rejects unknown statuses):
- `no_response`: maps to `record_only`, narrative not allowed (same as `invited`).
- `restricted`: maps to `published` or `record_only` depending on the nation's agreement, with the restriction list applied per id.

### 11.4 What stays private

| Public ledger (this repo) | Private claims repo / Blob only |
|---|---|
| Status, scope, date, office name, reviewer role (e.g. `THPO`, `cultural_department`, `tribal_council`), credit line, license, restrictions, Label codes | Names, emails, phone numbers, mailing addresses, letters and emails, meeting notes, drafts the nation has not released, payment details, and the outreach tracker |

Agents never read the private claims repo unless the owner asks for a specific task, and never copy anything from it into the public repo.

---

## 12. Roles

- **Owner (Benjamin Life, @omniharmonic):** the named steward for data governance (G3 s.3.5). Sends every packet and reply personally; reads claims (`npm run claims`); records ledger rows; applies removals.
- **Coding and research agents:** draft packets, check sources, build the site rules. Never send, contact, look up personal details, or publish nation-sourced drafts.
- **Legal reviewer (D-07):** advises on removal versus public-record citations (D-65) and license terms.
- **Tribal advisory council (D-08), if formed:** advises on this protocol and site-wide policy; never consents for any one nation.

---

## 13. Models this draws on (and how)

- **CARE Principles** (GIDA; Carroll et al. 2020): authority to control, collective benefit, responsibility, ethics.
- **NCAI resolution KAN-18-011** (2018 Midyear, Kansas City): supports tribes' "efforts ... to exercise Indigenous data sovereignty and governance." No USET resolution specifically on data sovereignty was found in this pass; check USET's own archive before citing one.
- **Local Contexts** TK and BC Labels and Notices: community-applied Labels, institution Notices as placeholders, Hub Projects, embed and API display.
- **Mukurtu**: access by cultural protocol rather than a public/private switch, and multiple "Community Records" on one item so there is rarely just one story. The atlas's side-by-side display (section 8) follows this idea. Comanche Nation THPO is building a Mukurtu portal (IMLS record); a nation's own archive is always a better home for its knowledge than this site.
- **Native Land Digital**: shows overlapping territories without resolving them, says it is not a legal or academic resource, sends readers to nations for boundaries, and has a correction link on every page.
- **Tribal research review**: Navajo Nation Human Research Review Board (letter of intent first; approval required for research involving Navajo citizens); EBCI Cultural IRB. These show nations' own review authority; the atlas asks whether any applies.
- **Sand Creek Massacre National Historic Site**: Congress required the National Park Service to consult the Cheyenne and Arapaho Tribes, the Northern Cheyenne Tribe and the Northern Arapaho Tribe (1998 study act), and NPS says Cheyenne and Arapaho family stories helped locate the site. The lesson for the atlas: descendant nations' oral history is evidence, each named nation is consulted in its own right, and consultation continues after designation. An earlier Denver museum exhibit on Sand Creek was closed after descendants of survivors said they had not been consulted (Tulalip News report), and History Colorado's 2022 exhibit was built with Cheyenne and Arapaho representatives and descendants' oral histories (Denver Gazette).
- **Smithsonian Shared Stewardship and Ethical Returns policy (2022)**: continued sole stewardship "may cause harm"; work "in consultation with descendants, communities." The atlas applies the same logic to data: shared stewardship, return (removal) on request.

---

## 14. Open items for the owner

1. Approve this protocol, or edit it, and log the decision (D-08, D-19).
2. Choose the pilot nations.
3. Decide the compensation position (section 10) before the first packet goes out.
4. Approve the proposed `no_response` and `restricted` statuses, `data/restrict.yaml`, and the extra ledger columns, so the coding agent can implement them.
5. Publish the positionality statement (D-61).
6. Decide with the legal reviewer what happens to bare federal-record citations on full removal (D-65).
7. Register on the Local Contexts Hub, or decide not to.
8. Re-check every URL in `outreach-tracker.csv` and move it to the private repo.

## Sources (fetched or found 2026-10-20)

- NCAI resolution KAN-18-011: https://archive.ncai.org/resources/resolutions/support-of-us-indigenous-data-sovereignty-and-inclusion-of-tribes-in-the-development-of-tribal-data
- Local Contexts Labels: https://localcontexts.org/labels/about-the-labels/ ; TK Labels: https://localcontexts.org/labels/traditional-knowledge-labels/ ; BC Labels: https://localcontexts.org/labels/biocultural-labels/ ; Disclosure Notices: https://localcontexts.org/notices/disclosure-notices/ ; Open to Collaborate: https://localcontexts.org/notice/open-to-collaborate/ ; Hub guide: https://localcontexts.org/hub/getting-started-on-the-hub/
- Mukurtu: https://dlib.org/dlib/may17/christen/05christen.html ; https://cimcc.org/wp-content/uploads/2018/07/CIMCC-Mukurtu-Community-Guide-2018.pdf
- Native Land Digital FAQ: https://native-land.ca/about/faq
- Navajo Nation HRRB: https://nnhrrb.navajo-nsn.gov/ ; Navajo HHPD CRCS: https://hpd.navajo-nsn.gov/Programs-Services/CRCS
- EBCI Cultural IRB: https://www.ebci.gov/cultural-institutional-review-board/
- Sand Creek NHS stories: https://www.nps.gov/sand/learn/historyculture/stories.htm ; NARA Prologue: https://www.archives.gov/publications/prologue/2001/summer/sand-creek-massacre-1
- Smithsonian Shared Stewardship and Ethical Returns: https://ncp.si.edu/sites/default/files/files/Ethical%20Return%20Docs/shared-stewardship-ethical-returns-policy_4.29.2022.pdf
- South Dakota SHPO tribal chairs and THPOs list (July 2026): https://history.sd.gov/preservation/docs/TribalChairsTHPOs-July2026.pdf
- CARE and G3 sources: see docs/research/G3-ethics-and-indigenous-data-governance.md

**Gaps.** No USET data sovereignty resolution was found. The History Colorado tribal contact list could not be fetched (HTTP 403). Several tribal sites (cherokee.gov, navajo-nsn.gov) refused connections from this environment, so those URLs come from search results and need a manual check. The web search budget ran out before Cherokee Nation's research review rules could be checked.
