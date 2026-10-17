---
title: Nation identity resolution
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# H2. Nation identity resolution

The hardest problem in the atlas data is not geometry. It is the word "nation". The seed files use free-text nation names in eight different places and no shared key. A treaty from 1851 names a party in the spelling of a Euro-American clerk. A 2023 court case names a present-day government. A campaign names a people. The graph must connect these without claiming an identity that only a nation can declare.

This document defines the Nation entity, the alias table, the party-to-present-day mapping and its review states, and the rules for the hard cases. The data lives in `crosswalks/nation-entities.csv`, `nation-aliases.csv`, `nation-successor-proposals.csv` and `nation-link-overrides.csv`. The rules come from `docs/research/G3` (tribal sovereignty, consent and review) and `A1` section 8.

**The rule that governs everything below:** the atlas may record that a seed file used a name, and may propose that two names refer to related entities. It may not state that a present-day government is the successor in interest to a treaty party, and it may not state a nation's endonym or recognition status, until that nation or a competent legal authority has said so. Every such link in the data is `proposed`.

## 1. What a Nation node is, and is not

A Nation node is a **name-bearing entity as the sources use it**. It is not a determination of who a people are. There are six kinds (`entity_kind`):

| Kind | Meaning | Count | Example IDs |
|---|---|---|---|
| `historical_party` | A treaty party as NARA/Kappler spell it. A period label, not an endonym, not a present-day name. | 117 | `nat-cherokee`, `nat-kaw`, `nat-sioux`, `nat-walpapi` |
| `present_day_government` | A government as a seed names it, with no claim about recognition. | 87 | `nat-pd-cherokee-nation`, `nat-pd-standing-rock`, `nat-pd-menominee-tribe` |
| `peoples_or_confederacy` | A people or alliance label used in the seeds. | 10 | `nat-haudenosaunee`, `nat-oceti-sakowin`, `nat-hawaiian`, `nat-alaska-native` |
| `community_or_band` | A band or village named as a unit. | 3 | |
| `foreign_state` | A state that is a treaty party, not a Native nation. | 3 | `nat-hawaiian-kingdom`, `nat-mexico`, `nat-russia` |
| `collective_scope` | A grouping label in a seed, not a polity. These never receive narrative or tribal-review claims; the schema fixes their review scope to `public_record_only`. | 6 | `nat-five-tribes`, `nat-stevens-treaty-tribes`, `nat-california-tribes`, `nat-pan-tribal-national`, `nat-pd-nana`, `nat-pd-nhlc-beneficiaries` |

Total 226 nodes (build of 2026-10-16). The `nat-` and `nat-pd-` prefixes distinguish historical from present-day *labels*. They are not statements of identity or continuity.

Distinct legal contexts are marked on the node (`legal_context`): three Hawaii entries (`distinct_hawaii`: the Native Hawaiian people, the Hawaiian Kingdom, which is a foreign-relations treaty partner and not a tribe, and the DHHL beneficiaries scope) and five Alaska entries (`distinct_alaska_ancsa`: Alaska Native peoples, Inupiat, Tlingit, the Native Village of Venetie, and the NANA shareholders scope). The organizations seed labels NANA Regional Corporation a "tribal government" although it is an ANCSA corporation; the build logs this as a data mismatch. The UI must not put these on a "tribe" template.

### 1.1 Fields

`names[]`: every known name with `name`, `kind` (preferred_label, source_label, historical_spelling, common_english, endonym_per_seed) and `review` (`unreviewed` for all, today). `endonym_status`: `per_seed_unreviewed` if a seed supplied an endonym, otherwise `none_recorded`. `federal_recognition`: `per_seed_tribal_government`, `per_seed_not_federally_recognized`, `unknown` or `not_applicable`. This records what the seeds say, not a determination. 30 present-day governments carry `per_seed_tribal_government` because their organization row says so; the others are `unknown`. Exactly one Nation (`nat-duwamish`) is marked `per_seed_not_federally_recognized`, because the organizations seed records that the tribe says so itself. The Chinook Indian Nation is `unknown`: its case row concerns a recognition claim but does not state a status.

**Endonym first (G3).** The display label is the seed's label today. Where a nation's own name for itself is known it must lead, with the exonym second. Only 17 alias rows are `endonym_per_seed`, and each is a name the seed gave, not one a nation has confirmed. The label shown on a page must therefore come from the nation after review, and until then the page must say "name as used in the source records".

## 2. Why the names do not match: the cases the model has to hold

1. **Historical names, endonyms and exonyms.** "Chippewa" and "Ojibwe" and "Anishinaabe"; "Sioux" and "Dakota" and "Lakota" and "Oceti Sakowin"; "Winnebago" and "Ho-Chunk"; "Kaw" and "Kansa" and "Kanza"; "Navaho" and "Navajo" and "Diné". Many period names are exonyms, and some are now regarded as offensive. Alias rows record the spelling, never an opinion about which is correct.
2. **Treaty party versus recognized entity.** A treaty party can be a band, a village, a confederacy, a group of signers, a faction, or "chiefs and headmen". A present-day government with a recognized status is a different kind of thing. The model keeps them as separate nodes (a `nat-` node and a `nat-pd-` node) and joins them only with a reviewed `successor_of` edge.
3. **One party, many successors.** The Cherokee party of the 1835 New Echota treaty is proposed against three present-day governments in the seeds. Ponca (Nebraska and Oklahoma), Seminole (Oklahoma and Florida), Ute (three governments), Klamath-Modoc-Yahooskin (one government) and the Chippewa/Ojibwe bands all have more than one counterpart.
4. **One government, many parties.** The Confederated Salish and Kootenai Tribes are proposed against three party labels (Flathead/Salish, Kootenai, Pend d'Oreille). Stockbridge-Munsee against three. Sisseton-Wahpeton against two.
5. **Umbrella labels.** "Sioux" in a treaty can mean any of the Seven Council Fires, a subset, or "multiple bands". The model has `nat-sioux` (as the treaty records name it), `nat-oceti-sakowin`, `nat-lakota`, `nat-dakota`, and `part_of` edges between them (52 `part_of` edges in total, all proposed). These edges say "this label is used under that label in the seeds". They are not membership claims.
6. **Overlapping territories.** The same land is claimed by more than one nation, and the treaties for it (the Fort Laramie 1851 territory, the Black Hills, Ohio Country, Southern Plains) name different parties for the same ground. The Nation node carries no territory. Territory belongs on `GeoFeature` nodes with their own lineage (G2), where overlap is represented as overlap, not resolved. The Nation graph must never be used to draw a boundary.
7. **Division names that look like nations.** The first read of the matched output found "Blackfeet" in a Lakota context (the Sihasapa division), "Menominee band" meaning a Potawatomi band, "Fox" and "Fox River", "Creek" inside "Swan Creek" and "Cow Creek". `nation-link-overrides.csv` and two `blocker` aliases hold these corrections.
8. **Disputed succession.** The Cherokee Nation Attorney General has objected to a public database attributing New Echota to the United Keetoowah Band (A1 section 8, item 5; A3, OSU New Echota record) [from-memory of the exact filing; read A1 before quoting]. The proposal exists in the data, with `disputed = true`, and the `successor_status` of that edge is `disputed`.
9. **Not federally recognized.** Many nations with treaty relationships, state recognition, or ancestral claims are not federally recognized. "Recognized" is a legal category. The atlas does not use it as a test for being a nation.
10. **Colonial and foreign parties.** RIT 1-7 name groups such as "Five Nations" and "Seven Nations of Canada" in a British colonial context. International treaties name Mexico, Russia and the Hawaiian Kingdom. These keep `context_row_not_a_treaty` and `foreign_state` kinds so they cannot be counted or presented as tribal treaty parties.

## 3. The alias table

`crosswalks/nation-aliases.csv`, 286 rows. Columns: `alias`, `nation_ids` (semicolon-separated), `alias_kind`, `only_in`, `notes`.

| Column | Meaning |
|---|---|
| `alias` | Lower-case text with accents removed, apostrophes straightened. The matcher normalizes source text the same way. |
| `nation_ids` | One or more Nation IDs. An alias can map to several nations on purpose ("sauk and fox" maps to both). `NONE` marks a blocker. |
| `alias_kind` | `source_label` (the spelling in the sources), `historical_spelling`, `common_english`, `endonym_per_seed` (a name the seed gave, unreviewed) or `blocker`. |
| `only_in` | Restrict the alias to one context: `treaty`, `violation`, `case`, `campaign`, `map`. For example "fox" matches only inside a treaty party list (so "Fox River" never matches), and "illinois" only in case rows (otherwise it is a state). |
| `notes` | Why, and any warning. |

How matching works (`AliasIndex` in `scripts/build_graph.py`):

1. Normalize the text: lower-case, strip accents, straighten quotes, drop `[bracketed tags]`.
2. For treaty party text, stop at " at " (the place begins there: "Choctaw at Dancing Rabbit Creek" becomes "Choctaw").
3. Try aliases longest first. When one matches, blank the matched stretch, so a shorter alias cannot match inside it ("Cheyenne River Sioux" is never also "Sioux" and "Cheyenne").
4. Blocker rows use up text without producing a link ("swan creek", "cow creek").
5. Each hit becomes one edge, `proposed`, with the matched alias recorded in the edge `qualifiers`.
6. Text that matches nothing is **reported** (`unresolved_nation_text`), not dropped. In the latest build there are 19: the 15 California treaties whose parties are band and village names in a clerk's spelling, `TLA-T-004` and `TLA-T-005` (no party named), the Elk v. Wilkins and Morton v. Mancari rows (an individual; BIA employees, not a nation), and `camp-buyback-2012-2022` ("50+ Tribes").

**Why the California band names are left unresolved.** Names like "Ko-ya-te", "Wo-la-si" and "Cha-doc-duc" are one clerk's spellings of village names in 1851. Matching them to present-day Californian nations is exactly the kind of identification that needs the nations and California Indian historians (Heizer 1972 is the base text for the treaty list, and A1 recommends consulting the nations). Guessing them would manufacture false certainty. They remain unlinked and visible as unlinked.

## 4. Party to present-day mapping, and its review states

`crosswalks/nation-successor-proposals.csv`, 56 rows, each producing one `successor_of` edge from the present-day government to the historical party.

| Column | Meaning |
|---|---|
| `party_nation_id` | A `nat-` ID. |
| `present_nation_id` | A `nat-pd-` ID. |
| `extent` | `full`, `partial` or `unknown`. This is a statement about the **seed names**: `full` means the seeds treat the two names as the same entity (for example Tuscarora Nation and the Tuscarora party). `partial` means other present-day governments could also trace to the party, or the party covers more than the government. `unknown` means no information. None of these values is a legal finding. |
| `status` | `proposed` for all 56. Allowed: `proposed`, `accepted`, `rejected`. |
| `basis_ref` | The seed row or research note that put the two names together. |
| `disputed` | `true` if a source records an objection. One row today (Cherokee to United Keetoowah). |
| `notes` | Cautions, such as "Other Oneida governments exist [from-memory]". |

Extent counts: 19 full, 34 partial, 3 unknown. The set is incomplete by design. It only contains links for which some seed row gave a basis. There are no rows for nations the seeds do not mention.

### 4.1 Review states for successor edges

The edge `review.successor_status` has its own vocabulary, separate from the tribal-review status used for other facts, because the question being asked is different:

| `successor_status` | Meaning | Who may set it |
|---|---|---|
| `unreviewed` | Proposed from a seed. Nobody has looked. | builder (default) |
| `disputed` | A source records an objection. | builder, from a cited source |
| `reviewed_by_nation` | The present-day government (and, where the party is a distinct people, the others) has reviewed the link and agrees. | the nation, recorded in the review ledger with date and reviewer role |
| `reviewed_by_legal` | A legal or ethnohistory reviewer has verified a documented basis (treaty text, a court decision, an act of Congress). | a named reviewer |
| `declined` | A nation does not accept the link, or the atlas withdraws it. | the nation |

The schema allows `accepted` on a `successor_of` edge only with a `reviewer_role` and a date, and forbids `asserted_by_seed` on `successor_of`. A `declined` or `withdrawn` outcome forces the related nodes to `record_only`. Silence is never treated as agreement: a nation that does not answer leaves the edge `unreviewed`, and the page keeps the "name as used in source records" wording.

### 4.2 What a reader sees

Until an edge is reviewed, a Nation page shows:

- the historical name "as written in the treaty record";
- a block "Possibly related present-day governments (proposed, not reviewed)" listing the `nat-pd-` names with the seed that suggested each;
- a statement that the atlas has not asked the nation, and an invitation to contact the maintainers;
- a line, never a link-out claim, on whether the nation has reviewed anything.

It never says "the Cherokee Nation is the successor to..." or shows the present-day government as the owner of the treaty.

## 5. Process for a real nation review

1. Pick one nation. Contact the government's own designated office (tribal historic preservation office, tribal attorney, or council). Do not contact individuals or organizations as a proxy for a nation.
2. Share the Nation page, its names, its proposed successor links and its violation and campaign edges, as the nation will see them. Ask for corrections, withdrawals, and endonym and language preferences.
3. Record the response in the review ledger: node or edge ID, status (the G3 vocabulary), date, reviewer role, reference to the correspondence (not the correspondence itself). Do not record the name of an individual.
4. Update the CSVs with the nation's corrections: aliases (including endonyms, now `reviewed`), successor rows, overrides.
5. Set `tribal_review.status` and only then allow `narrative_allowed` for what was reviewed.
6. If the nation declines or later withdraws, set the relevant nodes to `record_only` or `withheld` within the same release and keep the declination in the ledger. A reviewed nation can ask for removal at any time (G3).

## 6. What the matcher did well and badly (latest build)

- Party-to links: 631 `party_to` edges. 390 of 405 instruments have at least one. Zero are `accepted`.
- Wrong matches found by reading output: five removed through `nation-link-overrides.csv` ("Blackfeet" in V024, in TLA-T-345 and, after the 2026-10-16 NARA band list was added, in TLA-T-369; "Blackfeet" as Cobell's lead-plaintiff affiliation; "Menominee band" in V011) and one class fixed with two blocker aliases ("Creek" inside Swan Creek and Cow Creek, four treaty titles). There are certainly more in the 370 `involves_nation` edges. Review should prioritise short aliases (`oto`, `wea`, `crow`, `iowa`, `ute`, `miami`) and any alias that is also a place name.
- Over-linking risk: `involves_nation` for a violation lists every nation named in the violation's text, including nations that are only mentioned (V024 lists Arapaho, Lakota and Oceti Sakowin). It means "named in this record", not "affected" or "party".
- Under-linking risk: California treaties (above); campaigns whose `nation` cell is a description ("50+ Tribes").

## 7. Open questions for a human

1. Should `nat-sioux` ("as named in treaty records") stay a node? It is useful for the audit trail, but it invites readers to treat "Sioux" as an entity. Recommendation: keep it, never display it as a heading, and show the *party text* instead.
2. Should present-day `nat-pd-` nodes be created only on a reviewed request from the nation, and otherwise appear only as text? The current build creates them from seed names (87 nodes) so the organization and case graph connects. This is a product decision, and consistent with G3 only if these nodes stay `record_only`.
3. Who names the reviewers for the Cherokee, Ponca, Seminole, Ute and Chippewa/Ojibwe cases with several governments? This is where "who speaks" is not obvious.

## Sources

`docs/research/G3` (tribal review, consent and data classes), `A1` section 8, `A3`, `F1`, `F2`, the seed READMEs, and the crosswalk files named above.

## Confidence & Gaps

Confidence: medium on the structure, low on individual links. The 56 successor proposals and the 286 aliases were written by reading the seeds and the research notes, with no external check and no nation consulted. Counts are from the build of 2026-10-16. The Cherokee Attorney General reference is taken from A1 and A3 as cited there; verify the exact source before quoting it.
