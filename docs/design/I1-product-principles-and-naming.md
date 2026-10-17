---
title: Product Principles, Audiences, and Naming
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# I1. Product Principles, Audiences, and Naming

**Design Agent I, Treaty Land Atlas.** Companions: I2 (information architecture), I3 (interaction design), I4 (visual identity), I5 (content design and voice). Built on G2 (counterfactual map methodology), G3 (ethics and Indigenous data governance), G4 (pedagogy), F4 (donation integrity), B1 (violation typology), C3 (doctrine map), J1 (architecture decisions).

**Tags.** `[verified]` means the claim is stated and sourced in the named research file (and was tagged that way there); `[from-memory]`, `[disputed]` and `[unverified]` carry their usual meaning. **Recommendation** marks a design choice made here. This file makes few factual claims; it mostly makes decisions.

**Standing constraints.** Attribution is Benjamin Life (@omniharmonic) only. The site is an advocacy project that must also be a careful record. Those two aims conflict at the edges, and the principles below say which one wins when they do: accuracy and the sovereignty of nations win over persuasion.

---

## 1. What the product is

The Atlas is a map and a ledger. It shows what the United States and colonial powers promised to Native nations in treaties and statutes, what followed, what the law says today, and what is being returned and rebuilt. It is a way into the record, not a replacement for it and not a substitute for any nation's own account.

It is not legal advice, not an official boundary, and not a statement about any current legal claim (see the disclaimers in I5). It does not speak for any nation. G2 puts the model in one line: a ledger, not a verdict `[verified]`.

---

## 2. Product principles

Twelve principles. Each is written as a test that a design decision can pass or fail, and each names its source so a reviewer can trace it.

| # | Principle | The test | Source |
|---|---|---|---|
| 1 | **Present first.** Every historical view carries the nation as it is today. | Is there a way to see any historical frame without "Nation today" and the Legal status today control within one tap? If yes, fail. | G2 L6, G4 s.2 |
| 2 | **Ledger, not verdict.** Show what an instrument said, what happened, and what a court or Congress did. Do not tally "land lost." | Does any label or number add up polygon areas or imply a total? If yes, fail. | G2 s.8, E3 4.3 |
| 3 | **Four strands, always.** Instruments; loss and violation with evidence; resistance and law; returns and continuity. | Does any story or tour have only the loss strand? If yes, it is not publishable. | G4 s.2 |
| 4 | **Say what we know and how well.** Uncertainty is visible: tiers T1 to T4, evidence flags E0 to E7, "as of" dates. | Can a reader tell a surveyed line from a generalized one without opening a manual? | G2 s.8, B1 |
| 5 | **Never adjudicate between nations.** Overlapping claims stay overlapping. | Is any shape the result of dissolving, clipping or choosing between claims? If yes, fail. | G2 s.5 |
| 6 | **Nations speak in their own voice, or not at all.** Four voices are visibly distinct: project, quoted primary source, tribal statement, contributed narrative. | Could a reader mistake the project's summary for a nation's statement? If yes, fail. | G3 voice policy |
| 7 | **Silence is not consent.** Pages for nations that have not been contacted or have not replied show only public-record content and say so. | Does any page that speaks about a nation's meaning, culture or priorities lack a review status badge? If yes, fail. | G3 review statuses |
| 8 | **The right to correct and to withdraw.** Corrections are a front-door feature. Tombstones, not silent deletion. | Is the correction path reachable from every detail view in two taps? | G3 removal right |
| 9 | **No harm by precision.** No parcel or address-level output. No sacred sites. A notice, not a sharper map, on deep zoom. | Does any view let a reader draw a line to a specific lot or location of a protected site? If yes, fail. | G2, G3 |
| 10 | **Honest verbs.** Use the narrowest accurate word: "abrogated", "diminished", "terminated", "unratified", "failed to honor" each mean one thing. | Does a label use a stronger word than its evidence flag allows? | B1 label rules |
| 11 | **Help goes where the nation points.** The site collects no money. It links to organizations' own pages, with a label that says who receives a gift. | Does any control on the site take or imply a payment, or promise an outcome? | F4 |
| 12 | **Usable by anyone, on a phone, on a bad connection.** WCAG 2.2 AA; every map state has a text or table equivalent; core content works without JavaScript. | Can the whole site be used without a pointer, without color perception and without script for reading? | G3 s.11, J1 ADR-012 |

### 2.1 Where principles collide

Advocacy wants a strong picture; the record often supports a more cautious one. The rule, **Recommendation**:

1. **Evidence flag decides the word.** E3 to E7 may be called "violation." E0 to E2 are "alteration." The interface cannot upgrade the word.
2. **The default lens is the Federal-record lens.** It shows what the U.S. instruments and statutes say. Evidence-flag and Tribal-account lenses are one tap away. Tribal accounts are displayed as tribal accounts, never as the project's finding.
3. **A weak spot is shown, not hidden.** If a case is disputed or the geometry is T3, the page says so in the first screen, in plain words. Persuasion that depends on hiding uncertainty is out of scope.
4. **When a nation and the project disagree, the nation's account is published beside the project's** and the page says they differ. G3 gives nations the right to withdraw; it does not give the project the right to overwrite.

---

## 3. Audiences

The site has many readers. The design picks one default reader and builds the rest as paths, not as separate sites.

### 3.1 Primary audience: the general reader who does not know the history

Taught by school curricula that treat treaties as finished events and Native nations as past `[verified]` (G4 s.1.1). They arrive from a share card, a news story, a classroom link or a search for "treaty" plus their county. They have two minutes on a phone.

**Needs.** A first screen that is a map with a question, not a lecture. One concrete place or nation. Plain words. A path that ends in the present and in something to do.

**Design response.** Entry point "Start where you are" (county, no address; G4 Tour I). Plain-language mode (G3 s.11). Share cards that carry the date, source and disclaimer.

### 3.2 Educators and students

**Needs.** Reusable tours, classroom-safe content warnings, a way to project the map, discussion questions, honest handling of difficult material for mixed classrooms (including Native students).

**Design response.** Tours A to I with teacher mode (I2 s.6). Printable text version of each tour. A "Before you teach this" note on pages that deal with massacres, boarding schools or removal. Misconception probes (G4 s.6). No student accounts, no tracking.

### 3.3 Allies, donors and organizers

**Needs.** To move from understanding to a specific, trustworthy action without feeling manipulated, and without being sent to an organization that does not serve the nation they just read about.

**Design response.** A Support panel tied to the selected nation or region, built on F4's tiers and its per-listing label (who receives the gift, who leads the organization, when it was last verified). "Ask first" guidance because most tribal governments do not run public donation programs `[unverified]` (F4's own generalization). Other ways to help: voluntary rent, land tax programs, advocacy, learning. Guilt is not a call to action (G4 s.2, principle 3).

### 3.4 Journalists and researchers

**Needs.** Citable sources, dates, a way to verify a claim in under a minute, stable URLs, downloadable data with its lineage and licence, and a place to report an error.

**Design response.** Every claim has a source line and an as-of date. Methods and sources page. Per-polygon lineage JSON (G2). Exports embed the disclaimer and lineage. Permalinks per treaty, violation and case. A visible corrections log.

### 3.5 Tribal members, tribal staff and tribal governments (reviewers, not the audience to be educated)

This group is not the primary audience for being taught anything. They know their history. The site must not perform a tutorial at them, and it must not be built so that their only role is to be informed about what outsiders decided to publish.

**Needs.** To find their nation quickly, see exactly what the site says about it, see where it is sourced, correct it, annotate it, add their own account in their own voice, and ask for removal. To do so without creating an account, without unpaid labor beyond what they choose, and with clear terms about what is done with their words.

**Design response.** A tribal-review layer designed in from the start **Recommendation**:

- Every nation page shows a tribal-review status badge (G3 statuses) at the top, with a plain explanation of what each status does and does not mean. "Reviewed" never means "endorsed."
- A "For tribal reviewers" page and a review mode: a single-page view of everything the site says about one nation, with each claim's source, a flag-this button and a text field. In v1 the mechanism is email or a form that opens an issue privately; no public thread is created for a nation's correction.
- Review comments are delivered to the maintainers privately and answered with a stated turnaround (set once the maintainers can commit to one; see Open Questions).
- Annotation: a nation can supply a statement of any length, shown in the tribal-statement voice, in the nation's chosen name and spelling, with the nation's chosen date.
- Withdrawal: one email, no justification. Tombstone unless the nation asks for none (G3).
- Content that speaks for a nation is blocked from publication until a review status other than Not yet contacted or Invited applies. Class P and D content (public records; derived geometry and models; G3 s.2) can publish without review but carries the "not yet reviewed" notice.

Because tribal members are also the people most affected by any error, review is a quality system, not a courtesy.

### 3.6 Audience summary

| Audience | First screen | Typical path | Success looks like |
|---|---|---|---|
| General reader | Map plus "Start where you are" | County, then nation page, then one tour, then Support | Leaves with one accurate idea they did not have and one action |
| Educator | Tours list | A tour in teacher mode, printable | Runs a class without misrepresenting a nation |
| Ally or donor | Support, or a nation page | Selected nation, then Support panel | Gives to a vetted destination or asks the nation first |
| Journalist, researcher | Treaty page or Methods | Permalink, source, data export | Cites correctly, reports errors |
| Tribal reviewer | Nation page, review mode | Read, correct, annotate | Finds nothing that surprises them |

---

## 4. Naming

### 4.1 Criteria

A name for this project must:

1. Not claim to speak for, or be endorsed by, a nation or an organization.
2. Not use a savior frame ("rescue", "restore", "give back", "awakening") or a pity frame.
3. Not use Native-coded words, language, symbols or imagery as decoration. No words borrowed from any Indigenous language for branding, which would require community authorization (G3).
4. Not treat Native nations as past. No "lost", "vanished", "last".
5. Not decide the legal question by its wording. Many treaties are in force, many were abrogated, some were never ratified. "Broken treaties" is a common phrase and a poor name: it makes a legal claim about every treaty and it centers the breach.
6. Be short enough to say and to spell from a phone.
7. Work in Spanish translation without collision (G3 s.11, ADR-013).

### 4.2 Candidates

| # | Name | For | Against |
|---|---|---|---|
| 1 | **Treaty Land Atlas** (the brief's working title) | Describes the product literally. Neutral. Already in use in the repo | Reads as a reference book only. "Land" without "promise" has no argument. Also a risk of reading as the nation-less "atlas of land" |
| 2 | **What Was Promised** | Names the instrument (a promise) and implies a promisor and a promisee without naming blame. Works for treaties that were kept, broken, never ratified or still in force. Invites "and what followed?" | Past tense, passive. Passive hides the actor and the past tense can suggest the matter is over, so it needs a present-tense tagline. Could be read as presumptuous about what counts as a promise |
| 3 | **The Treaty Ledger** | Echoes the ledger model (G2), neutral, accounting metaphor suits "what was owed, what happened" | "Ledger" is also the language of trust-fund accounting disputes (the Cobell litigation) `[from-memory]`, which could land awkwardly; transactional tone |
| 4 | **Promises on Record** | Present tense, emphasizes documentary basis, resists the "broken" frame | Dry. "On record" can suggest the record is complete and authoritative, which the Atlas denies |
| 5 | **Still Bound** | Present tense; signals that obligations may continue | Overclaims. Some obligations were ended by statute or court. Also reads as a statement about Native people being bound |
| 6 | **Kept and Broken** | Memorable, balanced-sounding | Binary. Breaches the "unratified is not broken" rule (B1). Hides the much larger middle (diminished, reinterpreted, never performed) |
| 7 | **Treaty Time** | Short, pairs with the slider | Trivializing; sounds like a children's product |
| 8 | **Honored Through** | Taken from the counterfactual explorer "honored through year X" | Unclear out of context. Better as a feature name than a product name |

### 4.3 Recommendation: **What Was Promised**

**Recommended name: What Was Promised.**
**Recommended descriptor line (English):** "A map and record of U.S. treaty promises to Native nations, what followed, and where each nation stands today."
**Short tagline for share cards:** "Treaties are law. Here is the record."  (to be tested; "are law" is accurate for the Supremacy Clause treatment of ratified treaties `[from-memory]`, but must be checked with the legal reviewer because some treaties were abrogated, so the tagline may need to read "Treaties are the supreme law of the land, until Congress or a court says otherwise" or be dropped.)

**Why this name.**

- **It names the thing, not the people.** The subject is the promise, which is a U.S. act. The name does not label Native people and does not use their words or symbols. It leaves the "who promised" question to the page (the United States, and earlier, colonial governments) and puts the burden of the record on the promisor.
- **It is not a verdict.** A promise can be kept, broken, qualified, never ratified, or be in force today. The name allows all of those, which is the ledger model. Compare "Broken Treaties", which asserts one outcome.
- **It opens the four strands.** "And what followed?" is the second question the product answers; "where each nation stands today" is the third; "what is being returned" is the fourth.
- **It does not centre settlers or rescuers.** It has no "we", no "give back", no "restore" as a verb the project performs.
- **It is short and speakable and translates.** Spanish: "Lo que se prometió" (draft; needs a native-speaker and community-input check; G3 requires Spanish first).

**Known weaknesses and mitigations.**

1. *Past tense and passive voice.* Mitigation: always pair the name with a present-tense line; the footer and the share card say "and where each nation stands today". In the interface, the product name never appears without the Today control in view. Design test: the home screen must show a present-day element above the fold.
2. *Passive hides the actor.* Mitigation: the first sentence of the home page names the actor: "The United States made treaties with Native nations. This is the record of what they said and what happened next." (voice rules in I5).
3. *"Promise" may sound soft for coercive or fraudulent instruments.* Mitigation: individual treaty pages use B1 vocabulary (fraud, coercion, unilateral abrogation) where the evidence flag supports it. The product name is a frame, not a finding.
4. *Untested with the people most affected.* Mitigation: this is a recommendation. The name is not final until it has been put to the first tribal advisory conversations (J5 open decision D-01). The prototype uses "What Was Promised" as a working title only.

### 4.4 Collision, trademark and domain checks: not performed

The web-search budget for this task was exhausted before checks could be run. **No search was made** for existing projects, books, films, organizations, trademarks or domain availability using "What Was Promised", "The Treaty Ledger" or any other candidate. The phrase is common in ordinary English and in titles `[unverified]`. Before adoption:

1. Search trademark registries (USPTO) and the major app stores and search engines for the phrase in the education, mapping and non-profit classes.
2. Check domain availability for at least a .org and a .info variant, and the matching social handles.
3. Check that no Native nation, organization or campaign uses the phrase as its own name or slogan.
4. Check the Spanish title.
5. Record results in J5 D-01.

Until then, the repo and documents continue to use "Treaty Land Atlas" as the placeholder, as J5 D-01 already says.

---

## 5. Non-goals

- Not a land-claims tool: it will not tell a person whether land they stand on is "Indian country" for legal purposes.
- Not a genealogy or enrollment tool. It will not list individuals.
- Not a fundraising platform. It will not process money, take commissions, or run campaigns.
- Not a social network. No public comments, no accounts, no leaderboards.
- Not a replacement for tribal sources. Where a nation publishes its own history, the Atlas links to it.
- Not a map of sacred or sensitive sites (G3). Nothing about their location is collected.
- Not an AI chatbot. No nation-specific narrative is published on model output alone, and any AI assistance in drafting is labeled (G3 AI/automation policy).

---

## 6. How the other design files use this

| File | Uses |
|---|---|
| I2 | Audiences become entry points; principle 7 becomes publication gating by review status |
| I3 | Principles 1, 4, 5 and 9 become map and slider behavior; principle 11 becomes the Support panel |
| I4 | Principle 4 becomes tiers and hatching; principle 6 becomes voice-coded blocks; principle 12 sets contrast and motion rules |
| I5 | Principles 6, 7, 10 and 11 become the voice guide, review badge copy and donation copy |

---

## Open questions (for the project owner and, where noted, tribal advisors)

1. Final name; run the section 4.4 checks; put the name to a tribal advisory conversation before announcing it.
2. Whether the "Treaties are law" tagline survives legal review.
3. What turnaround on review comments the maintainers can commit to.
4. Who the named legal reviewer is, and what role and sign-off they will hold (G2 "Legal status today").
5. Whether a tribal advisory council exists before the first nation page is published, and what its authority is over the site as a whole (as opposed to over a single nation's page).
6. Positionality statement: who the maintainers are and what they bring; G3 requires one. The author of this file does not supply it.

---

## Sources

All sources are the project's own research files, read in this working session; their external citations are carried in those files and are not re-verified here.

- `/home/claude/treaty-land-atlas/docs/00-RESEARCH-BRIEF.md`
- `/home/claude/treaty-land-atlas/docs/research/G2-counterfactual-map-methodology.md`
- `/home/claude/treaty-land-atlas/docs/research/G3-ethics-and-indigenous-data-governance.md`
- `/home/claude/treaty-land-atlas/docs/research/G4-pedagogy-and-narrative-arcs.md`
- `/home/claude/treaty-land-atlas/docs/research/F4-donation-integrity-policy.md`
- `/home/claude/treaty-land-atlas/docs/research/B1-violation-typology.md`
- `/home/claude/treaty-land-atlas/docs/design/J1-architecture-decision-records.md`
- `/home/claude/treaty-land-atlas/docs/design/J5-build-roadmap.md` (decision D-01)

## Confidence & Gaps

**Confidence: medium.** The principles are a direct synthesis of the research files and should hold. The name is a recommendation, not a finding.

**Gaps.**
- No external verification of any kind (web search budget exhausted): no trademark, collision, domain or translation checks.
- No contact with any tribal reviewer, educator or donor. Audience needs are inferred from G3, G4 and F4, not tested. Treat section 3 as hypotheses for user research.
- The Cobell reference in the candidate table is `[from-memory]`.
- The "treaties are law" claim is `[from-memory]` and needs legal review before use.
