---
title: Parachute note templates for the atlas graph
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: low
---

# H4. Parachute note templates

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

This document gives a note template for each node type in the atlas graph (H1), for use in a Parachute vault as a **working surface** for research and drafting. It also maps each template to the exported JSON in H3. H3 explains why the vault is not the source of truth. These templates exist so that, if the maintainer writes in a vault, what they write can be turned into overlay files and ledger rows without guessing.

**Confidence is low on every Parachute-specific statement here.** I read the tool descriptions in this session and listed two existing tags in the maintainer's vault (read-only). I did not create notes, create tags, or test any export. Nothing below has been run against a vault.

## 1. What I know and do not know about Parachute

From the Parachute tool descriptions and the vault orientation text in this session:

| Capability | Basis | Status |
|---|---|---|
| Notes have a path, content, tags, and metadata fields | `query-notes`, `create-note` descriptions | Described, not tested here |
| A tag can carry a schema: `description`, `fields` (each with `type`, optional `enum`, `description`), `parent_names`, `relationships` | `list-tags` output for tags `organization` and `research` | Seen (read-only). Field types I saw: `string`, `array`; `enum` on a string. |
| Wikilinks `[[...]]` and links with a relationship label | tool descriptions | Described, not tested |
| Typed reference fields that also write links | tool descriptions | Described; I did not see one in a schema, so the exact syntax is unknown to me |
| Metadata queries on indexed fields; `near` graph neighbourhood with `depth`; full-text `search`; `has_broken_links` | `query-notes` description | Described, not tested |
| Attachments | tool descriptions | Not relevant here |
| The tag `relationships` setting | both tags I read show `relationships: null` | **Unknown** whether it is enforced or merely stored. Do not rely on it to reject a wrong edge type. |
| Export of a vault to plain files for a CI job | none found | **Unknown.** The vault is reachable over a REST API and MCP endpoint (per the vault orientation text), so a script could read notes. Whether a ready-made file export exists, I could not tell. |
| Whether YAML front matter in a note body is parsed into metadata | none found | **Unknown.** I therefore specify the metadata fields as a table and show the front matter only as a convention for the export script to read. |

**Name collision to avoid.** The maintainer's vault already has tags `organization`, `person`, `research`, `project`, `meeting`, `task` and others with schemas for other uses. Reusing them for atlas records would mix two meanings. All templates below use a `tla/` prefix (for example `tla/organization`). I did not verify that Parachute accepts a slash in a tag name; the tool descriptions mention nested agent tags (for example `agent/job` in another vault) so I expect it does. If it does not, use `tla-organization`.

**Recommendation.** Use a **separate vault** for this project (or a clearly separated path prefix and a scoped token). Some atlas data classes must never leave the project, and a personal vault with about 16,000 notes is the wrong place to mix them. A reader with `vault:read` scope on a project vault can then be given access without exposing anything else.

## 2. Conventions common to every template

### 2.1 Path

`treaty-land-atlas/<type-folder>/<id>`, for example `treaty-land-atlas/instruments/TLA-T-369`, `treaty-land-atlas/nations/nat-oceti-sakowin`. The note path ends with the graph ID, exactly. The ID is the join key to the export, so it must not be edited by hand.

### 2.2 Tags

Every note has `tla` plus exactly one type tag: `tla/instrument`, `tla/nation`, `tla/violation`, `tla/case`, `tla/statute`, `tla/doctrine`, `tla/policy-era`, `tla/organization`, `tla/campaign`, `tla/place`, `tla/source`. Optional status tags: `tla/needs-review`, `tla/needs-legal-review`, `tla/needs-tribal-review`, `tla/has-conflict`. Tags carry workflow, not facts. A fact is a field.

### 2.3 Common fields (all types)

| Field | Type | Values | Graph field it maps to |
|---|---|---|---|
| `tla_id` | string | the node ID | `id` |
| `tla_type` | string, enum | Instrument, Nation, Violation, Case, Statute, Doctrine, PolicyEra, Organization, Campaign, Place, Source | `type` |
| `confidence` | string, enum | high, medium, low | `confidence` |
| `verification_status` | string, enum | verified, from_memory, disputed, unverified, mixed, not_assessed | `verification_status` |
| `seed_file` | string | e.g. `seed-data/treaties-seed.csv` | `provenance.source_file` |
| `seed_row_id` | string | the row ID | `provenance.source_row_id` |
| `aliases` | array | alternative names, including historical spellings | `aliases` |
| `flags` | array | `context_row_not_a_treaty`, `distinct_legal_context`, `skeleton_record`, ... | `flags` |
| `sources` | array | wikilinks to `tla/source` notes, or URLs | `evidenced_by` edges |
| `review_note` | string | free text for the maintainer; never exported | none (private) |

**Review state is not a vault field.** `tribal_review`, `publication` and `narrative_allowed` are set only by `crosswalks/tribal-review-ledger.csv`, from a record kept outside the vault. A note must not be able to mark itself reviewed. The template has a read-only reminder section (below) that says so.

### 2.4 Body sections (all types)

```
# <label>

> Name as used in the source records. Not reviewed by the nation. (Delete this line only when the review ledger says so.)

## What the record says
<one to three plain sentences; cite the seed row or source>

## Sources
- [[src-xxxxxxxxxx]] <tier> <short note>

## Connections
<one line per edge, written as: edge_type -> [[target-id]] (status, basis)>

## Open questions
- ...

## Sensitivity and consent
<anything that affects publication: possible sacred or sensitive content, content warnings, who has been contacted (role only, never a name)>

## Tribal account
<empty until a nation supplies it. Never write this section for them.>
```

**Rules for the text.** Plain language. Use the brief's tags `[verified]`, `[from-memory]`, `[disputed]`, `[unverified]` on any claim that is not read from a source in front of you. Attribution is Benjamin Life (@omniharmonic) only.

### 2.5 Links

Use wikilinks to node IDs: `[[V024]]`, `[[nat-oceti-sakowin]]`. Each wikilink in the Connections section corresponds to one edge. Where Parachute supports a relationship label on a link, use the graph edge type as the label (`violated_by`, `party_to`, ...) so the export can read it. If a relationship label cannot be set, keep the `edge_type ->` text at the start of each Connections line; the export script parses that.

## 3. Templates by type

Only fields beyond section 2.3 are listed. The right-hand column is the node field in `nodes.json`.

### 3.1 `tla/instrument`

| Field | Type | Maps to |
|---|---|---|
| `instrument_type` | enum: ratified_treaty, unratified_treaty, international_treaty, agreement_statutory, executive_order, colonial_instrument, document_set | `instrument_type` |
| `ratification_status` | enum: ratified, unratified, ratified_with_amendments, not_applicable | `ratification_status` |
| `date_signed`, `date_ratified` | string, ISO date, `YYYY`, `YYYY-MM` or `YYYY-MM-DD` | same |
| `date_ratified_basis` | string | same |
| `nara_rit`, `nara_naid` | string; NAIDs separated by `;` | `external_ids`, `nara` |
| `stat_cite`, `kappler_cite` | string | same |
| `parties_text` | string, verbatim as NARA or Kappler print it | `parties_text` |
| `region` | string | `region` |
| `signatory_authority_disputed` | string, a sentence with sources, or empty | same |

Extra body section: **Land, as the record describes it** (not a legal description; no acreage unless a source states it; ceded acres only), and **Ratification and variants** (Senate amendments, proclamation).
Tags: also `tla/context-row` for international or colonial items, which must never be counted as treaties.

### 3.2 `tla/nation`

| Field | Type | Maps to |
|---|---|---|
| `entity_kind` | enum: historical_party, peoples_or_confederacy, present_day_government, community_or_band, foreign_state, collective_scope | same |
| `legal_context` | enum: standard, distinct_hawaii, distinct_alaska_ancsa | same |
| `federal_recognition` | enum: unknown, per_seed_tribal_government, per_seed_not_federally_recognized, not_applicable | same |
| `endonym` | string, only when supplied by the nation | `names[]` with kind `endonym_reviewed` (not yet in the schema; propose when the first review happens) |
| `part_of`, `possible_successors` | array of wikilinks | `part_of` and `successor_of` edges, `proposed` |

Body sections: replace "What the record says" with **How the sources name this entity**. Add **Successor links (proposed, unreviewed)**: each as `successor_of -> [[nat-pd-...]] (extent, status, basis)`. Never write that a present-day government "is" the successor.

### 3.3 `tla/violation`

| Field | Type | Maps to |
|---|---|---|
| `violation_types` | array of B1 codes | same |
| `year_text` | string | `year_text` |
| `treaty_name_text`, `nations_text`, `related_cases_text` | string | same |
| `adjudicated_breach_label_allowed` | string enum: yes, no | same (false for `CONTEXT_*`) |
| `acknowledgment`, `consent_status` | string, empty | reserved (B1) |

Body sections: **Mechanism** (what happened, in plain words), **Legal aftermath**, **What courts have said** (only from linked `tla/case` notes; do not paraphrase a holding), **Land lost** (as the source states it). Add **Content warnings** where violence is described.

### 3.4 `tla/case` and 3.5 `tla/statute`

Fields: `citation`, `court` (cases), `year`, `effect` (enum: advanced, eroded, mixed, procedural), `doctrine_tags` (array of doctrine IDs without the prefix). Body: **Holding in one sentence**, **Why it matters for land**, **Connections** (`concerns_instrument ->`, `applies_doctrine ->`, `limits ->`, `responds_to ->`). Cite the reporter citation; mark any page number not read from a source `[from-memory]`.

### 3.6 `tla/doctrine`

Fields: `tag`, `definition`. Body: **Plain-language definition**, **Key cases** (links), **Common misunderstandings**. Doctrine definitions carry confidence medium at most until a lawyer has reviewed them.

### 3.7 `tla/policy-era`

Fields: `start_year`, `end_year`. Body: **What federal policy was**, **Effect on land**, **Instruments and statutes in this era** (links, generated by the export, not hand-maintained).

### 3.8 `tla/organization`

Fields: `org_type`, `indigenous_led` (enum with the seed's eight values), `website`, `donation_url`, `ein_or_registry`, `display_eligible` (enum: yes, no). A note with `confidence: low` has `display_eligible: no`. Body: **What it does**, **Vetting notes** (what was verified, where, on what date). A donation link is never evidence for a claim. Tags: `tla/needs-legal-review` when donation integrity is unclear.

### 3.9 `tla/campaign`

Fields: `campaign_status` (the seed's values, including `headline-only`), `acres`, `acres_basis`, `start_year`, `location_text`. Body: **What was returned or sought, by whom**, **Status as of the source date** (give the date), **Connections** (`supports_return_of`, `remedies` proposed). A headline-only campaign stays `draft`.

### 3.10 `tla/place`, 3.11 `tla/source`

Place: `place_kind` (atlas_region, us_state), `code`. Source: `url`, `domain`, `source_tier` (primary_record, legal_text_mirror, authoritative_secondary, news, self_described, pointer_only, unclassified), `tier_basis`. A source note records how reliable the tier is for what it is cited for; Wikipedia stays `pointer_only`.

## 4. A filled example (not stored anywhere)

Path: `treaty-land-atlas/instruments/TLA-T-369`
Tags: `tla`, `tla/instrument`, `tla/has-conflict`

```
tla_id: TLA-T-369
tla_type: Instrument
instrument_type: ratified_treaty
ratification_status: ratified
date_signed: 1868-04-29
date_ratified: 1869-02-16
date_ratified_basis: senate-consent
nara_rit: 369
nara_naid: 183517089
stat_cite: 15 Stat. 635
kappler_cite: Vol. II, p. 998
parties_text: Sioux (Brule, Oglala, Miniconjou, Yanktonai, Hunkpapa, Blackfeet, Cuthead, Two Kettle, Sans Arcs, and Santee) and Arapaho at Fort Laramie, Dakota Territory
confidence: medium
verification_status: mixed
flags: [text_has_disputed_tag, text_has_from_memory_tag]
seed_file: seed-data/treaties-seed.csv
seed_row_id: TLA-T-369
```

```
# Treaty of Fort Laramie (1868) - Lakota (Sioux) and Arapaho

> Name as used in the source records. Not reviewed by the nation.

## What the record says
Signed 1868-04-29; Senate consent 1869-02-16. The seed row records that the Stat. page is [from-memory] and that the NAID given by archives.gov differs from the NARA catalog-links table (conflict kept in the seed notes).

## Connections
violated_by -> [[V024]] (proposed, primary, abrogation by the Act of 1877)
violated_by -> [[V025]] (proposed)
party_to <- [[nat-sioux]] (proposed, alias match)
concerns_instrument <- [[case-us-v-sioux-nation-1980]] (proposed)
```

The numbers above are those in `build/nodes.json` for this ID on 2026-10-16.

## 5. Mapping to the export

1. A script reads the project vault's notes by tag `tla/*`, using its REST API or MCP (read scope only).
2. For each note it reads the path's last segment as `tla_id`. It checks that the ID exists in `build/nodes.json`. An unknown ID is reported, not created.
3. **Fields that flow back into the repository**: new aliases (to `crosswalks/nation-aliases.csv`, as proposed rows), new proposed links in the Connections section (to the matching crosswalk CSV, with the note path as the basis), and the body text of "What the record says", "Mechanism" and similar sections (to `data/overlays/<type>/<id>.md`, as a draft; J1 ADR-007 item 6).
4. **Fields that never flow back:** `confidence`, `verification_status` and `flags` (they come from the seed and the builder), `tribal_review`, `publication` and `narrative_allowed` (they come from the ledger), and `review_note`.
5. The script writes a diff for a human to review as a pull request. It never commits to `main`, and it never overwrites a seed CSV.
6. **Graph to vault.** The reverse direction (to create or refresh vault notes from `nodes.json`) is useful for the first load. It writes only the machine fields and the Connections section, and it never overwrites body sections the maintainer has edited. Notes created this way are tagged `tla/imported`.

The script is not written. It depends on the unknowns in section 1, so it should be built after a one-hour test against a scratch project vault: create three notes of different types, read them back by REST, and check how metadata, tags, wikilinks and relationship labels come back.

## 6. Rules the vault must not break

- No living individuals as nodes. No names of tribal-government staff in notes; use role titles (G3).
- No locations of sacred sites or other sensitive places, anywhere in a note, including drafts.
- No correspondence with nations pasted into notes. Keep a reference to a private record only.
- Do not mark any note as reviewed on a nation's behalf.
- Attribution is Benjamin Life (@omniharmonic). Never OpenCivics.

## Sources

`list-tags` output for `organization` and `research` in the maintainer's vault, read on 2026-10-16; the Parachute tool descriptions and vault orientation text in this session; `docs/design/H1-graph-data-model.md`; `H3-storage-and-build-pipeline.md`; `docs/design/J1-architecture-decision-records.md` ADR-007.

## Confidence & Gaps

Confidence: low for everything Parachute-specific. The field list and the mapping to the graph are certain, because they follow the schema. What I could not check: how front matter is parsed, whether tag names with slashes are accepted, how typed reference fields and relationship labels are declared, whether `relationships` on a tag is enforced, and how to export. The template field types use only `string`, `array` and enum-on-string, the types I saw in existing schemas.
