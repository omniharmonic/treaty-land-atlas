---
title: Ethics, Consultation, and Indigenous Data Governance Framework for the Treaty Land Atlas
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# G3. Ethics and Indigenous Data Governance

**Research agent:** G. **Companions:** G1 (prior art), G2 (methodology), G4 (pedagogy).

**Purpose.** The Atlas is an educational and advocacy project about the land and legal relationships of sovereign Native nations. It will publish geometry, names, narratives, and calls to action that concern those nations. This file proposes the ethical and governance framework that should be in place *before* nation-specific content is published: the frameworks to follow, how to apply them to this project's data, a consultation and review process, content rules, and a corrections/removal policy.

**Positioning note.** I do not know, from the materials I was given, the cultural or tribal affiliation of the maintainers, and this file does not assume one. Whatever the answer is, the project should state it plainly (section 5).

**Tags:** `[verified]` = confirmed in a source read this session; `[from-memory]`; `[disputed]`; `[unverified]`. Items I proposed myself are labeled **Recommendation**.

---

## 1. Frameworks to anchor on

### 1.1 CARE Principles for Indigenous Data Governance
- Developed at the "Indigenous Data Sovereignty Principles for the Governance of Indigenous Data Workshop," 8 November 2018, Gaborone, Botswana, co-hosted by International Data Week and the Research Data Alliance Plenary; co-leads Stephanie Russo Carroll (University of Arizona) and Maui Hudson (University of Waikato). `[verified]` (GIDA page)
- Published as Carroll et al., "The CARE Principles for Indigenous Data Governance," *Data Science Journal* 19(1), Article 43 (4 Nov 2020). Authors: Stephanie Russo Carroll, Ibrahim Garba, Oscar L. Figueroa-Rodriguez, Jarita Holbrook, Raymond Lovett, Simeon Materechera, Mark Parsons, Kay Raseroka, Desi Rodriguez-Lonebear, Robyn Rowe, Rodrigo Sara, Jennifer D. Walker, Jane Anderson, and Maui Hudson. They are designed to **complement FAIR** and to be implemented in tandem. `[verified]` (DSJ)
- The four principles (primary statements verified in the article; sub-principles from the Global Indigenous Data Alliance one-pager) `[verified]`:

| Principle | Statement | Sub-principles |
|-----------|-----------|----------------|
| **C**ollective Benefit | Indigenous data must facilitate collective benefit for Indigenous Peoples | C1 Inclusive development and innovation; C2 Improved governance and citizen engagement; C3 Equitable outcomes ("Any value created from Indigenous data should benefit Indigenous communities in an equitable manner") |
| **A**uthority to Control | Indigenous Peoples must be the ones to determine data governance protocols | A1 Recognizing rights and interests (free, prior, and informed consent); A2 Data for governance; A3 Governance of data (right to develop cultural governance protocols) |
| **R**esponsibility | A responsibility to nurture respectful relationships | R1 Positive relationships; R2 Expanding capability and capacity (reciprocal responsibility to enhance data literacy within Indigenous communities); R3 Indigenous languages and worldviews |
| **E**thics | Representation and participation of Indigenous Peoples is paramount | E1 Minimizing harm and maximizing benefit ("Ethical data are data that do not stigmatize or portray Indigenous Peoples"); E2 Justice; E3 Future use ("Data governance should take into account the potential future use and future harm"; metadata should record provenance, purpose, and limits on secondary use) |

- **Global Indigenous Data Alliance (GIDA)** describes itself as an international network "Promoting Indigenous Control of Indigenous Data." `[verified]` (https://www.gida-global.org/)

### 1.2 OCAP(R)
- OCAP(R) (Ownership, Control, Access, Possession) is a registered trademark of the **First Nations Information Governance Centre (FNIGC)**, a Canadian incorporated non-profit that holds the trademark and handles OCAP inquiries. Definitions: **Ownership** (community collectively owns its information); **Control** (First Nations and their representative bodies direct all aspects of research and information management affecting them); **Access** (communities can reach information about themselves wherever held and decide who else may access it); **Possession** (physical control of data, the mechanism for asserting ownership). Required citation: "OCAP(R) is a registered trademark of the First Nations Information Governance Centre (FNIGC)." `[verified]` (https://fnigc.ca/ocap-training/)
- **Applicability caveat (Recommendation):** OCAP was developed by and for First Nations in Canada. For US tribes, the site should say it is *informed by* OCAP and CARE and should not claim "OCAP compliance." Use the trademark citation wherever OCAP is named.

### 1.3 US Indigenous data sovereignty
- **Native Nations Institute (NNI), University of Arizona** policy brief (Rainie, Rodriguez-Lonebear, and Martinez, 2017): Indigenous data sovereignty is "the right of Native nations to govern the collection, ownership, and application of its own data"; the right derives from inherent authority over peoples, lands, and resources, which treaties and nation-to-nation agreements acknowledge, and connects to self-determination under UNDRIP; Indigenous data covers information about a Native nation, its citizens, lands, programs, and communities; there is a "paradox of scarcity and abundance" (much data collected about tribes, rarely by or for them). `[verified]` (NNI policy brief PDF)
- **US Indigenous Data Sovereignty Network (USIDSN):** states a mission to ensure data for and about Indigenous Peoples in the US are used to advance Indigenous goals for collective and individual well-being; offers courses, an "Indigenous Peoples' Data Collective," a resources library, and a principles brief; contact info@usindigenousdatanetwork.org. `[verified]` (https://usindigenousdatanetwork.org/) The page does not name its host organization.

### 1.4 UN Declaration on the Rights of Indigenous Peoples (UNDRIP)
Adopted by the UN General Assembly on 13 September 2007 (Resolution 61/295). Key articles for this project, quoted from the UN text `[verified]`:
- **Art. 3:** "Indigenous peoples have the right to self-determination."
- **Art. 13:** the right to "revitalize, use, develop and transmit to future generations their histories."
- **Art. 19:** states shall consult in good faith "through their own representative institutions in order to obtain their free, prior and informed consent" before measures that may affect them.
- **Art. 31:** the right to "maintain, control, protect and develop their cultural heritage, traditional knowledge and traditional cultural expressions."
- **Art. 40:** access to just and fair procedures for resolving disputes and effective remedies.

UNDRIP directs states, not private websites, but it is the shared reference standard for FPIC (free, prior and informed consent). The US position over time is `[from-memory]` (the US initially voted against and later announced support in December 2010); verify before stating.

### 1.5 Tools for flagging cultural protocols
- **Local Contexts Traditional Knowledge (TK) Labels:** let Indigenous communities state conditions for sharing cultural material. Provenance Labels (e.g. TK Attribution), Protocol Labels (e.g. TK Seasonal, TK Secret/Sacred), and Permission Labels (e.g. TK Non-Commercial, TK Outreach). A website can display Label icons next to material and link to explanation pages. `[verified]` (localcontexts.org) The label set is community-applied, not site-applied; the Atlas should only display a Label if the relevant community applied it.
- **Protocols for Native American Archival Materials** (First Archivist Circle, 2006; page dated 4/9/07): produced by nineteen Native and non-Native archivists, librarians, curators, historians, and anthropologists meeting at Northern Arizona University's Cline Library, with representatives of fifteen Native American, First Nation, and Aboriginal communities; themes include sovereignty, consultation, culturally responsive care, restricted materials (sacred images, recordings, remains), revising outdated or offensive descriptive language, and adding community perspectives to records; "work in progress." `[verified]` (NAU)

### 1.6 US federal analogues (useful models, not obligations on this site)
- **Executive Order 13175** (signed Nov. 6, 2000; 65 FR 67249): agencies must have a process for "meaningful and timely input" from tribal officials on policies with tribal implications. `[verified]` (Federal Register)
- **54 U.S.C. 307103** (National Historic Preservation Act): federal agencies must withhold information about a historic property's "location, character, or ownership" where disclosure may cause significant privacy invasion, harm the property, or impede use of a traditional religious site by practitioners. The text I read does not mention tribes by name. `[verified]` (Cornell LII)
- **ARPA section 9** (16 U.S.C. 470hh) confidentiality of archaeological resource location information. `[from-memory]`
- **Tribal research codes and review boards** (many nations require research permits or IRB review) `[from-memory]`; specific examples to be verified when contacting nations.

---

## 2. Applying the frameworks: a data classification for this project

Not all Atlas data are "Indigenous data" in the same sense. Classifying them clarifies what needs consent.

| Class | Examples | Handling rule |
|-------|----------|---------------|
| **P: Public federal/state records** | Treaty texts (Kappler, Stat.), statutes, court opinions, agency datasets (USFS Royce) | Publish with citation and license. Still apply CARE E1 (do not stigmatize) in how it is framed and E3 (future harm). |
| **D: Derived geometry and models** | Polygons from Royce; counterfactual layers; legal-status panels | Publish with lineage and uncertainty. Nation-specific derived products carry a tribal review status (section 3). |
| **N: Names and identifications** | Endonyms; mapping historical names to present-day nations; language names | Prefer the nation's own usage; record source; mark unreviewed. Successor attribution is contested in the USFS data (NAGPRA is reevaluating) `[verified]`. |
| **K: Indigenous knowledge and accounts** | Oral histories, tribal narratives, community maps, recordings, place names with cultural significance | Publish **only** with documented permission from the relevant community's authorized body, with attribution and agreed conditions. Held under agreement, not under an open license. |
| **S: Sensitive** | Locations of sacred sites, burials, ceremonial places, gathering grounds, culturally restricted plants, anything the nation designates | **Never publish.** Do not geocode at fine scale; do not include in images or alt text. |
| **R: Reuse of third-party datasets** | Native Land Digital, HCN Land-Grab data | Follow license; keep their disclaimers; note provenance. |

**E3 (Future use) guidance:** metadata for every layer records provenance, purpose, and limits on secondary use. Where the site publishes open data (CC BY 4.0 for site-authored data is a common choice `[from-memory]`; confirm with the architecture agent), keep K and S classes out of the open dataset by design. An open license is incompatible with a later takedown right unless classes K and S are never released openly.

---

## 3. Consultation, consent, and the advisory structure

### 3.1 Principles (Recommendation)
1. **Government-to-government respect.** Nations are sovereign governments. Approach the tribal government (or its designated office: cultural resources/historic preservation, language and culture department, GIS, attorney general's office, or council) rather than relying on individual community members as proxies. Individuals can advise; only the nation's authorized body can consent for the nation.
2. **Silence is not consent.** The absence of a reply never counts as review or approval. The site shows "not reviewed" explicitly.
3. **Right to decline, right to change.** A nation may decline to be mapped, ask for edits, ask for removal, or ask that its content be held back.
4. **Compensate the work.** Advisory time and expertise are paid, with terms agreed in writing. Capacity-building is part of the exchange (CARE R2).
5. **Benefits flow back** (CARE C3): ask each nation what would benefit it (access to data in usable form, linking to its programs, translation or training support). Do not assume.
6. **No exclusivity claims.** The project does not claim to represent any nation.

### 3.2 Process (Recommendation)
| Step | Action | Output |
|------|--------|--------|
| 1 | Publish a plain-language project charter, data policy, and corrections/removal policy before outreach | Public pages |
| 2 | Identify the right office for each nation (official tribal website; THPO or cultural department) `[from-memory]` for the office types | Contact log |
| 3 | Send a short, scoped invitation (template in section 3.4) | Sent invitations |
| 4 | Offer options: (a) review only what concerns the nation, (b) co-author nation page, (c) decline, (d) nominate a representative | Recorded response |
| 5 | Agree in writing on scope, credit, review timelines, data-use conditions, and removal rights (a short MOU or letter of agreement) | Signed record |
| 6 | Publish with a visible review status on the nation's pages | Status badge |
| 7 | Re-confirm at defined intervals and on major content changes | Review log |

### 3.3 Per-nation review status (shown to the public)
`Not yet contacted` / `Invited` / `Reviewed by [office], [date]` / `Co-authored with [office]` / `Edits requested, in progress` / `Declined to participate` / `Content withdrawn at nation's request`.
- A page with `Not yet contacted` or `Invited` ships only with Class P/D content, a banner saying so, and no narrative speaking for the nation.
- The same list applies to successor determinations: show `successor_review_status` (G2 s.8.1).

### 3.4 Advisor and reviewer sources (where to look; none contacted)
- **Nation-level offices** (official tribal government sites) as the primary route.
- **Indigenous-led institutions already in this space:** Museum of Indian Arts and Culture / Indigenous Digital Archive (DigiTreaties) `[verified]` as a project with Indigenous leadership; Native Land Digital (Indigenous-led) `[verified]`; Native Nations Institute and USIDSN for data-governance expertise `[verified]`; Firelight and the Indigenous Mapping Workshop community for Indigenous GIS practitioners `[verified]`.
- **Professional networks** `[from-memory]`: National Congress of American Indians, American Indian Higher Education Consortium, National Association of Tribal Historic Preservation Officers, American Indian Library Association. Verify each before approaching.
- **Legal reviewers:** a federal Indian law practitioner or legal historian for G2 section 7 panels (not a tribal-advisory role).

**Draft invitation (Recommendation; for the maintainers' voice)**
> Subject: Invitation to review how [Nation] appears in the Treaty Land Atlas (no obligation)
> We are building a free, public educational site about treaties between the United States and Native nations. We would like to ask whether [Nation]'s government would be willing to review the pages that concern [Nation], and to tell us how [Nation] wants to be named, described, and linked. We are not asking you to endorse the project. You may decline, ask for changes, or ask us to remove any content at any time. We would offer [compensation/in-kind support], credit as you choose, and a written agreement. Our data policy and removal policy are at [link]. Who is the best person or office to speak with?

### 3.5 Governance of the project itself (Recommendation)
- **Tribal Advisory Council** (paid, term-limited, diverse by region) with authority over: the evidence-flag categories (G2 s.4), terminology guidance, sensitive-data rules, and the corrections/removal policy. Council advice on policy is separate from any individual nation's consent over its own content.
- **Public decision log** of policy changes.
- **Conflict-of-interest and funding disclosures**, including any Land Back organizations the site promotes.
- **A named steward for data governance** who owns responses to removal requests.

---

## 4. Sacred sites and sensitive information

**Rule:** the Atlas does not publish the locations of sacred sites, burials, ceremonial or gathering places, or any location a nation has asked to keep private, and does not publish data that would let a user derive them.

Practical measures (Recommendation):
1. **Generalize geometry:** the base geometry (Royce-scale) is already coarse. Do not add point layers for sites. Where a treaty text names a culturally significant feature (e.g., a sacred mountain), include the text as it appears in the public record only after tribal review, and consider omitting the feature name from map labels.
2. **Photo and media review:** exclude images of ceremonies, human remains, and sacred objects; follow the Protocols for Native American Archival Materials for restricted materials `[verified]`.
3. **Metadata hygiene:** strip EXIF/GPS and coordinates from images; do not expose full-resolution vector downloads for any layer flagged sensitive.
4. **Withhold on request** without requiring justification, mirroring the logic of 54 U.S.C. 307103 (information about location of historic property can be withheld where disclosure may harm the property or impede use of a traditional religious site) `[verified]`.
5. **Treaties that name sacred places** (the Black Hills, Blue Lake) are publicly documented in the record, and the nations themselves speak of them publicly (PBS reports Sioux leaders calling the Black Hills "a spiritual place for tribal nations"; Taos Pueblo publishes the Blue Lake return) `[verified]`. Even so, the Atlas should discuss them at the level the nations themselves have chosen to use publicly, and avoid precise visitor-facing locations.
6. **Do not build "find sacred sites near you" or heritage tourism features.**

---

## 5. Not speaking for tribes

1. **Voice policy:** visually and textually distinguish (a) *the project's voice* (analysis, summaries), (b) *quoted primary sources*, (c) *tribal government statements* (quoted with link and date), and (d) *contributed narratives* (with named author and permission). Never paraphrase a nation's position as if it were the nation's own statement.
2. **No inferred positions:** do not say "the [Nation] wants [land back / return of X]" unless the nation's own statement is cited. Say what documents say and what the nation has published.
3. **Defer on contested identity and membership.** Nation membership and recognition are for nations to determine; Tuck and Yang note tribal membership is for Indigenous nations to decide `[verified]` (their discussion of "settler nativism"). Federal recognition status is a legal category and should be labeled as such; state-recognized and unrecognized nations are not "less real" (NLD takes an expansive approach `[verified]`).
4. **Maintainer positionality statement:** publish who maintains the site, their relationships and limits, funding, and how nations can reach a human. The cautionary example: Mapping Indigenous LA's status note about a PI's identity claim shows how undisclosed or unexamined identity claims damage community trust and can force a project to be archived `[verified]` (see G1 s.7). Do not make any individual's identity the source of the project's legitimacy.
5. **Oral history vs documentary record:** the brief (principle 4) asks to note where they differ. Add a field for "tribal account" and a policy that where an account differs, the site presents both and does not rank them.
6. **No stereotyped imagery** or generic "Indian" art; no feathered-headdress clip art; images credited to Native artists with permission (USDAC credits advisors and artists by name for its campaign `[verified]`).
7. **The Land Back voice:** NDN Collective's LANDBACK page is the organization's own framing and must be labeled as such `[verified]`.

---

## 6. Language and naming

**Principles (Recommendation unless cited)**
1. **Endonym first.** Use the nation's own name for itself as the primary label; show the historical name from the treaty/Royce as secondary ("named in the treaty as ..."). Many nations have multiple names because colonizers mispronounced or replaced original names; Ohkay Owingeh (renamed San Juan de los Caballeros in 1598; reverted officially in 2005) is the NMAI example. `[verified]` (NMAI/ASM "Impact of Words")
2. **Ask preferences.** "American Indian," "Indian," "Native American," and "Native" are commonly used in the U.S., but people may prefer different terms; use the collective terms a community uses for itself; "Native" works as a general descriptor ("Native lands"). `[verified]` (same)
3. **Regional usage varies** `[verified]` in part: outside the U.S. terms differ (Inuit, Yup'ik, and Aleut Peoples see themselves as distinct from Indians; Canada uses "First Nations," "First Peoples," "Aboriginal"; Latin America often uses *indigena*, *comunidad*, *pueblo*). `[verified]` (same). Alaska Native corporations and villages, and Native Hawaiians, have distinct legal and political relationships with the US `[from-memory]`; confirm scope with the legal reviewer before including them.
4. **Use "Indigenous" and "Native" as adjectives**, not nouns ("Native people," not "Natives"), per general style guidance `[from-memory]`; confirm against the style guide below.
5. **"Tribe" and "nation"** are used interchangeably but carry different meanings for many Native people `[verified]` (ASM); the site should use "nation" as its default and "tribe" where the nation or the law (e.g., "federally recognized tribe") uses it.
6. **Legal terms of art** (e.g., "Indian Country," "Indian Claims Commission," "Indian title") are retained in quotation marks or with a short gloss on first use because they are the names of laws and institutions.
7. **Tense:** present tense for living nations and cultures; if past tense is necessary, add dates or context, because past-tense-only writing reinforces the "Vanishing Indian" myth. `[verified]` (ASM/NMAI)
8. **Avoid generalizations** such as "all Native Americans"; use "most" or specific nations. `[verified]` (same)
9. **Avoid "discovered," "settled," "wilderness," "prehistoric," "tribe-as-noun" style problems** `[from-memory]`; the NMAI page I read does not address these (so verify via style guide).
10. **"Cession" and similar words:** use "cession" only as the record's term with a gloss: "land transferred by treaty (called a 'cession' in US records)." Prefer "transfer," "alteration," or "taking" depending on the evidence category (G2 s.4).
11. **Orthography and diacritics:** use the nation's preferred spelling, with Unicode support; audio pronunciations only with permission.
12. **Style guide:** adopt *Elements of Indigenous Style: A Guide for Writing by and about Indigenous Peoples* by Gregory Younging (Brush Education; second edition 2025 with updated principles and new chapters including Indigenous citation practices, sensitivity reading, and representing Indigenous languages and oral narratives) as the editorial reference. `[verified]` (Birchbark Books listing; I did not read the book.)

**Glossary requirement:** a plain-language glossary of legal and place-based terms, written with advisor input, linked from first use.

---

## 7. Corrections, feedback, edits, and removal

### 7.1 Channels (Recommendation)
- A public email and a web form on every page ("Report an error or concern"), plus a separate **tribal-government channel** with a named steward and direct contact option.
- Response targets: acknowledge within a few business days; for **sensitive-content or removal requests from a nation, hide the content first (within a day or so) and review afterward**. Proposed service levels are Recommendations; adjust to staffing.
- The U.S. Forest Service and High Country News both invite error reports to named contacts `[verified]`; Native Land Digital's delayed email response (Discord instead) is a cautionary example `[verified]`.

### 7.2 Policy (Recommendation)
1. **Tribal removal right:** a nation's authorized body may require the removal or editing of content that concerns it, without having to justify the request. For Class P records (public federal documents), the site may keep the primary-source *citation* but will remove interpretation, narrative, mapping, or successor attribution that the nation objects to.
2. **Public corrections log** with date, change, and source; withdrawn content leaves a tombstone ("Removed at the request of [Nation/office], [date]") unless the nation requests no tombstone.
3. **Archiving:** the project will request removal from web archives and search caches where possible, and tells users the limits of that promise.
4. **Version control and licensing:** releases are versioned; Class K/S material is never in open releases (section 2).
5. **Third-party data:** pass corrections upstream (USFS, NLD, HCN) and record that in the log.
6. **Escalation:** disputes between a nation and another party about content are not resolved by the site; the site displays both statements (G2 s.5) or withdraws the contested content.
7. **Project wind-down plan:** the Mapping Indigenous LA case shows the importance of a path to archive a project in consultation with community collaborators `[verified]`; publish a succession and wind-down statement.

---

## 8. Donation framing and Land Back calls to action

(Brief principle 6 governs; this section covers *framing*.)
1. **Learn, then act.** Place calls to action after substantive content, not as pop-ups in front of it.
2. **Only verified recipients:** tribal governments and verified, preferably Indigenous-led organizations; list fiscal sponsors; label self-described claims as self-described `[verified]` in the brief. Organization verification is other agents' work.
3. **No transactions on the Atlas.** The site links out to the recipient's own donation page; it does not collect or process donations, to avoid handling funds and to avoid concerns over monetizing Indigenous data (NLD FAQ: no monetary gain from NLD maps `[verified]`).
4. **Do not frame donations as atonement or as a substitute for treaty obligations.** USDAC says acknowledgment alone is "a small gesture" that becomes meaningful only with authentic relationships and informed action `[verified]`; the same logic applies to giving. Tuck and Yang argue decolonization requires "the repatriation of land," not symbolic gestures or metaphor `[verified]`.
5. **Prefer ongoing and direct support pathways** (direct nation-led programs, mutual aid, land-return funds) over one-click guilt-driven appeals; explain how funds are used, citing the recipient's own materials.
6. **Respect nation preferences:** if a nation does not want to be listed as a recipient, do not list it; if it prefers a specific channel, use that.
7. **Avoid "adopt-a-tribe" or competitive framing.**
8. **Disclose** any relationships between the Atlas maintainers and the recommended organizations.
9. **Do not use a nation's name, logo, or seal in promotion without permission.**

---

## 9. Impact on private landowners and non-Native neighbors

1. **No parcel-level or address-level products** (G2 s.6).
2. **Say what the project does not do:** it does not propose evictions or targeting of individuals (wording to be reviewed by counsel and advisors).
3. **Show how land has actually moved back:** willing-seller purchases and public-land returns (Yurok, Pe' Sla) and legislative returns (Blue Lake) `[verified]` (Grist, Taos Pueblo, Yahoo News on Pe' Sla: tribes raised $9 million to buy Pe' Sla; the year is not stated in the article).
4. **Offer constructive paths for neighbors:** learn the local nation's name and website, support nation-led efforts, support public-land co-stewardship, and engage with local land-acknowledgment practice beyond words (USDAC) `[verified]`.
5. **Moderate any user submissions** (comments, stories) to prevent harassment or doxxing.
6. **Plan for backlash:** a media/harassment response protocol, including support for any Indigenous contributors named on the site.

---

## 10. Content warnings and trauma-informed design

1. **Content warnings** before pages that describe massacres, forced marches, boarding schools, or other violence (examples likely to appear: Trail of Tears removal, Sand Creek, Bear River, the Long Walk `[from-memory]`; the federal Indian boarding school investigation `[from-memory]`). Warn in plain language, provide a skip option, and avoid graphic imagery.
2. **No gratuitous visuals:** avoid photographs of dead or of human remains.
3. **Pacing:** in guided tours (G4), alternate loss with resistance, survival, and return; offer breaks and resource links.
4. **Language:** describe violence factually and with sources; avoid sensational words.
5. **Support resources** for Native users who may find content distressing, with links to Native-led resources (to be vetted by organization researchers).
6. **Opt-in for sensitive tours** rather than auto-play.

---

## 11. Accessibility

- **Standard:** target **WCAG 2.2 Level AA** (W3C Recommendation, 12 December 2024). Relevant success criteria: 2.1.1 keyboard operability (Level A) and 2.1.2 no keyboard trap; 1.1.1 text alternatives for non-text content; 1.4.1 color not the only visual means; 2.2.2 pause/stop/hide for auto-moving content (applies to a play-button time-lapse). `[verified]` (W3C)
- **Maps need non-map equivalents:** every map state has a text/table view (data table of instruments with dates, parties, categories, uncertainty tier), a written summary, and a downloadable accessible PDF if needed.
- **Time-slider:** operable by keyboard with labeled steps; "play" requires pause control; honor reduced-motion preferences.
- **Uncertainty encoding:** edge style + text + legend; color-blind-safe palettes; patterns for overlap.
- **Plain-language mode** with defined terms, reading levels, and translation (Spanish first; Indigenous-language material only with community permission and review).
- **Low-bandwidth options:** static tile fallbacks; no auto-loading of large vector sets.
- **Screen-reader tests** on guided tours.

---

## 12. AI and automation policy (Recommendation)

The project is built with AI-augmented workflows. Indigenous data sovereignty is explicitly a live issue for AI: the 2026 Indigenous Mapping Workshop's central theme is "the role of mapping in Indigenous Data Sovereignty and what that means in the age of artificial intelligence." `[verified]` (Firelight)
1. **No nation-specific narrative text is published on LLM output alone**; all such text is human-reviewed and, where it concerns a nation, tribally reviewed.
2. **Do not feed Class K or S material into third-party AI services** or use it for model training; contractually require the same of vendors.
3. **Label AI assistance** in editorial notes where used on a page.
4. **Citations are checked by a human** (the brief already requires verification).
5. **Audio/translation synthesis of Indigenous languages is prohibited** unless the language community has authorized it.
6. **Record AI-related decisions** in the public decision log.

---

## 13. Risk register

| Risk | Likelihood / impact (judgment) | Mitigation |
|------|-------------------------------|------------|
| Publishing nation-specific content that a nation objects to | Medium / High | Review status gate; removal right; fast lane |
| Appearing to speak for tribes | High / High | Voice policy; positionality statement |
| Disclosure of sensitive locations | Low-Med / Very High | Class S never published; no point layers |
| Misattribution of successor nation | Medium / Med | Successor review fields; ask nations |
| Harassment of landowners or Native contributors | Medium / High | Coarse maps; moderation; response plan |
| Legal misstatement | Medium / High | Legal reviewer sign-off |
| License violation (NLD/HCN) | Medium / Med | Written confirmation; license register (G1 s.18) |
| Tokenistic consultation | Medium / High | Pay advisors; give real authority over policy; benefits flow back |
| Project abandonment leaving harmful or stale content | Medium / Med | Wind-down plan; tombstones |

---

## Sources

Fetched or returned by search this session (accessed 2026-10-16):

- Global Indigenous Data Alliance: https://www.gida-global.org/ ; CARE page: https://www.gida-global.org/care
- CARE one-pager (sub-principles): https://static1.squarespace.com/static/5d3799de845604000199cd24/t/5da9f4479ecab221ce848fb2/1571419335217/CARE+Principles_One+Pagers+FINAL_Oct_17_2019.pdf
- Carroll et al. 2020, *Data Science Journal* 19(1):43: https://datascience.codata.org/articles/10.5334/dsj-2020-043
- FNIGC OCAP(R): https://fnigc.ca/ocap-training/
- Native Nations Institute, Indigenous Data Sovereignty in the United States (policy brief): https://nnigovernance.arizona.edu/sites/default/files/resources/Policy%2520Brief%2520Indigenous%2520Data%2520Sovereignty%2520in%2520the%2520United%2520States.pdf
- US Indigenous Data Sovereignty Network: https://usindigenousdatanetwork.org/
- UN Declaration on the Rights of Indigenous Peoples (UN text): https://www.un.org/development/desa/indigenouspeoples/wp-content/uploads/sites/19/2018/11/UNDRIP_E_web.pdf
- Local Contexts TK Labels: https://localcontexts.org/labels/traditional-knowledge-labels/
- Protocols for Native American Archival Materials: https://www2.nau.edu/libnap-p/protocols.html
- Executive Order 13175 (Federal Register): https://www.federalregister.gov/documents/2000/11/09/00-29003/consultation-and-coordination-with-indian-tribal-governments
- 54 U.S.C. 307103: https://www.law.cornell.edu/uscode/text/54/307103
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- NMAI/ASM "Impact of Words": https://statemuseum.arizona.edu/sites/default/files/Impact-of-Words-Tips-for-Using-Appropriate-Terminology.pdf
- Younging, *Elements of Indigenous Style* (listing): https://birchbarkbooks.com/products/elements-of-indigenous-style
- Tuck and Yang, "Decolonization is not a metaphor": https://clas.osu.edu/sites/clas.osu.edu/files/Tuck%20and%20Yang%202012%20Decolonization%20is%20not%20a%20metaphor.pdf
- Native Land Digital FAQ and About: https://native-land.ca/about/faq ; https://native-land.ca/about/
- Mapping Indigenous LA status note: https://mila.ss.ucla.edu/636-2
- Firelight 2026 Indigenous Mapping Workshop: https://firelight.ca/news/2026-indigenous-mapping-workshop
- USDAC Honor Native Land: https://usdac.us/nativeland/ ; https://theavarnagroup.com/resources/a-guide-and-call-to-honor-native-land/
- NDN Collective LANDBACK: https://ndncollective.org/landback/
- PBS NewsHour on the Black Hills: https://www.pbs.org/newshour/updates/north_america-july-dec11-blackhills_08-23
- Taos Pueblo, Blue Lake: https://taospueblo.com/blue-lake/
- Grist, Yurok land return: https://grist.org/indigenous/in-californias-largest-landback-deal-the-yurok-tribe-reclaims-sacred-land-around-the-klamath-river/
- Yahoo News on Pe' Sla purchase: https://news.yahoo.com/sioux-tribes-raise-9m-required-purchase-sacred-land-213133904.html
- HCN Land-Grab Universities and data repo: https://www.hcn.org/issues/land-grab-universities/ ; https://github.com/HCNData/landgrabu-data

## Confidence & Gaps

**Overall: medium.** The frameworks themselves (CARE, OCAP, NNI/USIDSN, UNDRIP, Local Contexts, Protocols, EO 13175, NHPA 307103, WCAG 2.2) are verified from the pages above. The governance model, service levels, and policy wording are my Recommendations and have not been reviewed by any tribal government, lawyer, or Indigenous data governance practitioner.

**Not verified**
1. **US position on UNDRIP** over time (stated `[from-memory]` only).
2. **ARPA section 9** and **tribal research code / IRB** details; **number of federally recognized nations** (not stated in this file; do not use a figure without checking the current Federal Register list).
3. **Professional networks** (NCAI, AIHEC, NATHPO, AILA) named from memory.
4. **Whether Native Land Digital's Indigenous Data Sovereignty Treaty** imposes obligations on data users: the page could not be fetched.
5. **Younging's book** was not read (only a listing); the usage rules in section 6 (e.g., adjective use) are partly `[from-memory]`.
6. **USIDSN and GIDA principle texts** beyond what the pages stated (the USIDSN page links to principles it does not list).
7. **Content-warning examples** (Sand Creek, Bear River, the Long Walk, the federal boarding school investigation) are from memory and need sourcing when tours are written.
8. **Pe' Sla purchase year** not stated in the article read.
9. **Tribal perspectives on this specific project** have not been solicited. Everything here is a proposal for consultation, not the result of it.
10. **Legal review** of the "no evictions" statement and the removal-right policy (for example, how a removal right interacts with open licenses or public-record citations) has not occurred.
