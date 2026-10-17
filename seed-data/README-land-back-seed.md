---
title: "README: Land Back seed datasets (Research Agent F)"
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Land Back seed datasets

Files (all UTF-8 CSV, header row, standard quoting):

- `organizations-seed.csv`: 67 rows. Organizations, tribal governments and programs.
- `campaigns-seed.csv`: 42 rows. Land returns, campaigns, programs and headline-only leads.
- `tribe-org-map.csv`: 86 rows. Edges for the knowledge graph. `org_id = NONE_VERIFIED` marks nations with no verified organization.

Narrative and evidence: `docs/research/F1` to `F4`. As-of date: 2026-10-16.

## organizations-seed.csv

| Field | Meaning |
|---|---|
| `id` | Stable key, `org-...` |
| `name` | Official or most-used name |
| `org_type` | 501(c)(3), tribal government, state agency, federal program, fiscally sponsored project, and so on |
| `indigenous_led` | `yes-verified` (named Native leadership or tribal control in a source read), `yes-self-described`, `tribal-government`, `state-agency`, `federal-program`, `mixed`, `no`, `unverified` |
| `nations_served` | Nations or peoples served; Hawaii and Alaska rows say "DISTINCT LEGAL CONTEXT" |
| `region` | Headquarters and territory |
| `focus` | What the organization does that matters to Land Back |
| `donation_url` | Public giving page as linked from the organization's own site. **Blank means no verified channel**; do not substitute one |
| `ein_or_registry` | EIN and sources (ProPublica, Charity Navigator, org's own statement) or "Government" |
| `vetting_notes` | Evidence, caveats and red flags. Read before publishing |
| `website` | Home page, or a note that the domain is unreliable |
| `confidence` | `high`, `medium`, `low` (see below) |

**Confidence.** `high`: identity and EIN confirmed in two places and key facts read. `medium`: real and active, but a donation page, leadership, or an identity match was not confirmed. `low`: existence only, or a blocking problem. The site should display only `high` and `medium` rows, and only with the caveats in `vetting_notes`.

## campaigns-seed.csv

| Field | Meaning |
|---|---|
| `id` | Stable key, `camp-...` |
| `name` | Campaign, return or program name (use tribal names where known; pending tribal review) |
| `org_id` | Primary actor or recipient; blank for headline-only items |
| `nation` | Recipient nation(s) |
| `location` | Place, state |
| `acres` | Number as reported by the primary cited source; sources that disagree are listed in F3 section 8. Blank means not stated |
| `start_year` | Year of taking, claim, campaign or first step; blank when not given |
| `status` | `completed`, `completed-pending-deed`, `pending`, `in-progress`, `blocked`, `contested`, `ongoing-claim`, `program-ongoing`, `program-concluded`, `headline-only` |
| `summary` | Facts, mechanism, parties, discrepancies |
| `source_url` | One or more URLs separated by " ; " |
| `confidence` | `high`, `medium`, `low` |

## tribe-org-map.csv

| Field | Meaning |
|---|---|
| `nation` | Nation as named in sources; labels such as "[HAWAII: distinct legal context]" are intentional |
| `org_id` | Key into `organizations-seed.csv`, or `NONE_VERIFIED` |
| `relationship` | Free text starting with one or more of: `governing_body`, `tribal_nonprofit`, `return_recipient`, `led_by_members`, `campaign_partner`, `fundraising_partner`, `legal_counsel`, `funder_partner`, `donation_channel`, `allied_non_native_org`, `pan_tribal_service`, `advocacy_adjacent`, `program_context`, `no_verified_org` |
| `region` | Territory or area |

## Known limits

- Built from pages read through a summarizing fetch tool; the verification agent should spot-check EINs against IRS TEOS and re-open every donation URL.
- Not researched (search budget ran out): Tulalip, Muckleshoot, Karuk land efforts, Coastal Band of the Chumash Nation, Navajo/Diné and other Pueblo land-return groups, Pawnee organizations.
- Rows with `confidence=low` are for tracking, not publication.
- Tribal consultation is required before any nation, place or campaign name is published.
