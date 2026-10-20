---
title: Site Display Rules for Nation Review
author: Benjamin Life (@omniharmonic)
date: 2026-10-20
status: draft
companions: governance-review-protocol.md, review-packet-template.md
implements_in: scripts/build_graph.py (REVIEW_PUBLICATION, apply_review_ledger), src/components/ClaimBox.astro, nation and record pages
---

# Site display rules: before and after a nation's review

Exact rules for what landback.land shows, depending on a nation's review status in `crosswalks/tribal-review-ledger.csv`. Text in quotation marks or code blocks is the exact wording to use. `[Nation]` is the nation's page label (its own name once it has told us); `[office]` and `[date]` come from the ledger.

## 1. Ground rules

1. **Default is unreviewed.** A node with no ledger row is `not_yet_contacted`, `publication.state = record_only`, `narrative_allowed = false` (current `build_graph.py` behavior). Silence is never consent.
2. **Nation-sourced drafts never render unless reviewed.** K2 research content (any text built from a nation's own sources, testimony or citizen scholarship) renders only when the nation's status is `reviewed` or `co_authored` **and** the specific text is marked approved in the nation's approval record. There is no preview build, hidden URL, search index entry, open-data export, alt text or page metadata containing unreviewed K2 text.
3. **Federal-record content always renders** (unless suppressed or restricted by the nation), with its unreviewed label.
4. **Removal and restriction beat everything.** Ids in `data/suppress.yaml` vanish from all outputs. Ids in the proposed `data/restrict.yaml` follow their restriction codes (s.7).
5. **Wording never implies endorsement.** No "approved by," "endorsed by," "in partnership with," "official," or the nation's seal or logo, unless the nation writes that wording itself.
6. **No em dashes** in any of this text.

## 2. Status to display (badge, banner, section)

The badge appears near the page title on nation pages, and on any record page that names the nation (one badge per named nation, max three shown, then "and [n] more").

| Ledger status | Badge text | Badge style | Nation page banner |
|---|---|---|---|
| none / `not_yet_contacted` | `Not reviewed by [Nation]` | neutral outline | "This page was built from federal records and research. [Nation] has not reviewed it. It does not speak for [Nation]." |
| `invited` | `Not reviewed by [Nation]` | neutral outline | Same as above. (Being invited is not shown publicly, so no nation appears to be "pending" on the project's schedule.) |
| `no_response` (proposed) | `Not reviewed by [Nation]` | neutral outline | Same as above. Never "did not respond." |
| `edits_requested` | `Changes requested by [Nation]` | amber outline | "[Nation] has asked for changes to this page. They are in progress. Until they are done, some content may be hidden." |
| `reviewed` | `Reviewed by [office], [Month YYYY]` | filled moss | "[office] of [Nation] reviewed this page in [Month YYYY]. Review means [Nation] checked it; it does not mean [Nation] endorses this site." |
| `co_authored` | `Written with [office]` | filled moss | "Parts of this page were written by [credit line chosen by the nation]. Those parts are in [Nation]'s own words and are marked." |
| `restricted` (proposed) | `Shown as [Nation] asked` (only if the nation agrees to a visible note; otherwise the badge for the underlying review status) | neutral outline | "[Nation] has asked that some of this content be limited. What remains is shown as [Nation] asked." (only if agreed) |
| `declined` | Default: `Not reviewed by [Nation]`. If the nation asks for it: `[Nation] chose not to take part` | neutral outline | Default: same as unreviewed. If the nation asks: "[Nation] chose not to take part in this project. Only the public federal record is shown." |
| `withdrawn` | (no page) | n/a | Tombstone only if the nation wants one (s.8). |

If the ledger row says `display_review_status = no`, show the unreviewed badge and banner regardless of the actual status, and still apply all the nation's corrections and restrictions.

A `reviewed` or `co_authored` page that the project has changed substantially since the review date shows, beside the badge: "Changed since [Nation]'s review in [Month YYYY]. The changes have not been reviewed." The changed items carry the unreviewed record label.

## 3. The "What the nation says" section

Placement: on each nation page, directly after "What happened here" and before the record lists. Heading is always the same so readers learn to look for it:

```
## What [Nation] says
```

### 3.1 Before review (every status except `reviewed` and `co_authored`)

Show exactly:

```
No nation has reviewed this yet.

This section is kept for [Nation]'s own account, in its own words. It stays empty until
[Nation] writes or approves it. Nothing here is written for [Nation].

[If the nation's official website is known:] [Nation]'s own website: [link, labeled with the
site's own title]
```

Then the ClaimBox ("Is this your nation? ...", current text).

Rules:
- The link to the nation's official website is a plain outbound link only: no excerpt, summary, quote, image, logo, or preview card. Show it only if the URL is the nation's own government site and has been checked (s.9).
- The heading still renders, so the absence is visible.
- On record pages (treaties, areas, cases) that name the nation, the equivalent line is: "No nation has reviewed this yet." followed by "[Nation] has not reviewed how this record describes it." when only one nation is named, or "None of the nations named here has reviewed this record." when several are.
- On pages that name several nations where some have reviewed and some have not: "Reviewed by [office of Nation A], [Month YYYY]. Not reviewed by [Nation B] or [Nation C]."

### 3.2 After review (`reviewed`)

- Renders only the text the nation approved, exactly as approved, with no project edits.
- Each statement keeps its source link.
- Under the heading: "Approved by [office], [Month YYYY]. Built from [Nation]'s own sources and reviewed by [Nation]."
- Framing stays the nation's: statements begin "[Nation] states that..." unless the nation asked for different wording.
- Any part the nation did not approve is not shown, with no placeholder unless the nation wants one.

### 3.3 After review (`co_authored`)

- Renders the nation's own text, typographically distinct from the project's voice (left rule in the nation's chosen accent or the default moss; no AI-assisted label; no project summary above or below it).
- Credit line: exactly the nation's `credit_as` value.
- License line: the nation's license, e.g. "Text by [credit]. Shared under [Nation]'s terms: [link or short terms]. Not covered by this site's CC BY license." (D-03)
- If the nation supplied a map, image or recording, show it only as the nation specified, never re-styled or re-projected without asking.

## 4. Federal-record content labels

Every block of federal-record content about a nation (record lists, "In the record" text, AI-assisted summaries, Royce area cards, K1 status and flags, successor links) carries a small label under its heading:

- Unreviewed: `From the federal record. Not reviewed by [Nation].`
- AI-assisted and unreviewed: `AI-assisted summary of federal records. Not reviewed by [Nation].` (keep the existing AI-assisted note and quotes beneath)
- Reviewed: `From the federal record. Reviewed by [office], [Month YYYY].`
- Corrected at the nation's request: `Corrected at [Nation]'s request, [Month YYYY].` plus the existing record-corrections display (listed value and corrected value)
- Successor links that are `proposed`: keep "Suggested connection, not yet reviewed" and add "by [Nation]".

The federal record's own names stay in quotation marks with the gloss "as named in the treaty record."

## 5. Intertribal disagreement display

When two or more nations with `reviewed` or `co_authored` status give differing accounts of the same record or area:

```
## Nations differ on this

[Nation A] states that ... [source]   |   [Nation B] states that ... [source]

The federal record: ... [source]

This site does not decide between these accounts.
```

Rules:
- Columns (stacked on phones) in alphabetical order by each nation's own name.
- Each column has the nation's own badge (reviewed or written with).
- The one-line description of what differs is neutral and is itself reviewed by the nations.
- A nation that has not reviewed gets no column. Instead: "[Nation C] has not reviewed this. Its own account is not shown here."
- The record gets the existing K1 `intertribal dispute` flag only if a nation's reviewed account or a sourced federal record states the dispute; the flag never changes the land status.
- Map: overlapping areas are drawn overlapping, with no boundary resolved and no ranking color.

## 6. TK and BC Labels and Local Contexts Notices

- **Site-wide**: footer and `/about/` show the Local Contexts **Open to Collaborate** Engagement Notice icon and its standard text, linked to the site's Hub Project, once the owner has registered it.
- **Nation pages without Labels**: show the **Attribution Incomplete** Notice where names, attributions or successor links may be wrong, and the **TK Notice** where the page carries Indigenous knowledge recorded in federal sources. Text: the Notice's standard text from the Hub download, plus "This Notice is the project's. Only [Nation] can apply Labels."
- **Nation pages with Labels**: the nation's Labels replace the Notices. Show the unaltered icon, the Label title with code (e.g. "TK Attribution (TK A)"), the nation's own Label text (and its translation, if provided), and a link to the live Hub Project. Placement: directly under the "What [Nation] says" heading and beside any content the Label covers.
- Labels are fetched from the Hub at build time (download or API) and are never edited, inferred, or copied from another nation.
- **Labels with behavior** (enforced in the build, not just shown):
  - TK Secret / Sacred, TK Culturally Sensitive, TK Men Restricted, TK Women Restricted, TK Community Use Only: content covered by the Label is not published at all.
  - TK Seasonal: covered content is hidden outside the seasons the nation states.
  - TK Non-Commercial, BC Non-Commercial: covered content is excluded from the CC BY open-data release and marked non-commercial wherever it appears.
  - TK Verified / TK Non-Verified, BC Consent Verified / Non-Verified: shown as the nation states, next to the content.
- If the Hub is offline at build time, keep the last fetched Labels; never fall back to showing Notices where a nation applied Labels.

## 7. Restrictions (proposed `data/restrict.yaml`)

| Code | Effect |
|---|---|
| `no_map` | Geometry removed, or generalized to the scale the nation names; area cards show text only |
| `no_quote` | Quotations removed; citation and link kept |
| `no_place_names` | Named places replaced by "a place [Nation] has asked not to name" or removed, as the nation chooses |
| `no_open_data` | Excluded from downloads, the open dataset, the MCP and relay endpoints |
| `page_only` | Excluded from search, tours, timeline and share images |
| `no_ai_summary` | AI-assisted summary removed; primary-source list kept |
| `labels_required` | Shown only with the nation's Labels attached |

A visible note ("Shown as [Nation] asked.") appears only if the nation agreed to one.

## 8. Removal

- Ids in `data/suppress.yaml` are removed from every output on the next build (existing fast lane).
- Tombstone, only if the nation wants one: "Removed at the request of [Nation], [Month YYYY]." No reason, no link, no archive link.
- No tombstone if the nation prefers: the address returns the normal 404 page.
- Bare federal-record citations, if kept after a full removal request, follow the owner's and legal reviewer's decision (D-65) and carry no link to the nation, no map and no interpretation.

## 9. Links to a nation's own site

- Only to the government's own official domain, confirmed by the owner (some lookalike domains exist; see the protocol s.2.1).
- Plain text link, labeled with the site's own title, opening in the same tab, with no tracking parameters.
- Never framed, embedded, scraped or previewed.

## 10. What never displays

- Unreviewed K2 text, quotes or summaries, anywhere, including metadata, alt text, search snippets and share cards.
- The nation's seal, logo or flag, unless the nation provides it for this use.
- Any personal name, email or phone from review correspondence. Only office names and roles.
- "Invited," "awaiting response," "did not respond" or any countdown.
- "Declined," unless the nation asks for it to be shown.
- Sacred sites, burials, ceremonial or gathering places at any scale.

## 11. Build checks to add (for the coding agent, after owner approval)

1. Fail the build if any K2-sourced field renders for a node whose status is not `reviewed` or `co_authored`.
2. Fail the build if a `reviewed` or `co_authored` row lacks `date`, `reviewer_role` or `record_id` (exists today), or lacks `credit_as` for `co_authored` (new).
3. Fail if a page shows a Label not present in the nation's Hub Project.
4. Warn if a nation page's official-site link is not on the owner-confirmed list.
5. Fail if any personal-contact pattern (email address, phone number) appears in `tribal-review-ledger.csv`.
6. Test: the phrase "No nation has reviewed this yet." renders on every nation page whose status is not `reviewed` or `co_authored`.
