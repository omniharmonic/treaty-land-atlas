---
title: Graph exploration paths and queries
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# H5. Exploring the graph: UX sketch, queries and example paths

The graph is useful only if a person can follow a thread: from a nation to its treaties, from a treaty to what happened to it, from that to the court decisions, and from there to people working on a return of land today. This document sketches how that feels, lists the questions the graph can answer with the edges it has, and traces eight real paths using IDs from the 2026-10-16 build. Every path was read from `build/edges.json`, not written from memory.

**Read this first.** Of the edges these paths use, most are `proposed`: inferred by a crosswalk or a text match, not stated by a seed and not reviewed by anyone. Each path below says which links are which. A reader-facing version must show that difference on screen (section 1.4). The paths show what the data *connects*, not what is *true*.

This is consistent with J1 ADR-009 (per-page neighbourhood graph as inline SVG with a list that carries the same information; a case-law lineage view; no whole-graph force layout in version 1) and ADR-007 item 9 (proposed edges are labelled, and hidden in production when they touch a Nation or a successor relationship). The queries below run on the lite graph (about 41 KB gzipped, H3 section 4.3), in the browser, with no server.

## 1. UX sketch, in words

### 1.1 Four ways in

1. **By nation.** A search box and an A-to-Z list of names as the sources use them. The page for a nation (H2) opens with its name "as used in the source records" and the line that the nation has not reviewed the page. Beneath that: its treaties, ordered by date; what the records say happened to each (violations); court decisions that concern them; organizations connected to it. Present-day governments appear as "possibly related (proposed, not reviewed)".
2. **By treaty.** The page for an instrument gives its legal category first (ratified, unratified, agreement, executive order, context item), then the date, the parties as the record prints them, the citations, then "What happened next".
3. **By place.** A map (outside this document's scope) and a list of regions and states, each leading to treaties, violations and campaigns that mention it. Places are coarse (atlas regions, states); the graph has no boundaries.
4. **By theme.** The 56 doctrines in plain words ("discovery", "plenary power", "diminishment"), the nine policy eras, and the 15 violation types. A theme page lists the cases, statutes and violations that carry it.

### 1.2 The page everyone lands on: "connections"

Every entity page has a **Connections** list before any diagram, grouped by relationship in plain language, not by edge-type name:

| Edge | Plain phrase on the page |
|---|---|
| `party_to` | "Named in the record as a party to" |
| `violated_by` | "What the records describe happening to this treaty" |
| `enabled_by` | "Made legally possible by" |
| `adjudicated_in` | "Discussed in court decisions" |
| `concerns_instrument` | "Treaties this decision concerns" |
| `remedies` | "Efforts to repair this" |
| `supports_return_of` | "Organizations working on this" |
| `successor_of` | "Present-day governments possibly related (not reviewed)" |
| `applies_doctrine` | "Legal ideas used in this decision" |

Under the list, the neighbourhood graph (H1, J1 ADR-009): the entity and its one-hop neighbours, up to 25, as a static diagram whose nodes are links, with line style (not colour alone) for relationship type. "Show all N" opens the full list.

### 1.3 "Follow the thread": a path view

A button on any connection: **Follow this thread**. It does not draw a hairball. It shows a vertical sequence of cards, one per node on the path, joined by a labelled link ("then, per the records:"). Example: treaty, then a violation record, then a court decision, then an organization. Each card shows the node's type, confidence and review status, and each link shows whether it is stated by a source or proposed. The reader can step to the next hop or back. On a phone this is a single column. The same path is a numbered list for a screen reader, and has a plain URL that can be shared (`/thread/?from=TLA-T-369&via=V024,case-us-v-sioux-nation-1980`).

### 1.4 Showing certainty and consent honestly

- Each edge on screen has one of three marks, with text, not only colour or an icon: **Stated in a source row**, **Suggested connection, not yet reviewed**, **Reviewed** (none yet).
- Each node has a review chip: "Not reviewed by the nation" is the default and, today, the only value.
- A `context` violation link (for example the 1851 Fort Laramie treaty and the Dakota Access Pipeline record V030) is worded "invoked in connection with", never "violated by". The schema blocks the breach label there (`adjudicated_breach_label_allowed = false`).
- Violation pages carry content warnings where violence is described, and no photos of people, no sacred-site locations.
- A nation can be taken out of every path at once by suppression or a `declined` ledger entry (H3).

### 1.5 Filters that make paths short

Time (policy era, or a year range), region, node type, confidence, and "show only links stated in source rows". The last filter is how a cautious reader gets a smaller, safer graph.

### 1.6 What the UI must not do

- No "tribe of the day" cards, no maps of "where Native people live today", no counts of "treaties violated" on a front page. The graph supports a count of *records* (for example, "62 violation records in this draft dataset") and not a count of *wrongs*.
- No ranking of nations or of treaties.
- No generated summaries presented as the atlas's voice. A nation's own account goes in its own labelled section, written by the nation.

## 2. Questions the graph can answer today

Each question is a traversal over named edges. "Hops" counts edges. Results come from the current build; every figure is from `build/edges.json`.

| # | Question | Traversal | Result today |
|---|---|---|---|
| Q1 | Show every treaty with the Sioux Nation and its violations. | Nation labels `nat-sioux`, `nat-lakota`, `nat-dakota`, `nat-oceti-sakowin` -> `party_to` -> Instrument -> `violated_by` -> Violation | 34 instruments (33 of them through `nat-sioux`); 10 violation records: V020, V024, V025, V026, V028, V029, V030, V031, V033, V045. All links `proposed`. |
| Q2 | What court decisions concern the Treaty of Fort Laramie (1868)? | `TLA-T-369` <- `concerns_instrument` - Case; and `TLA-T-369` -> `violated_by` -> Violation -> `adjudicated_in` -> Case | Direct: Ex parte Crow Dog, Rosebud Sioux v. Kneip, Standing Bear v. Crook, United States v. Sioux Nation. Through its violation records, also Lone Wolf v. Hitchcock, Solem v. Bartlett, McGirt v. Oklahoma, Nebraska v. Parker and Rosebud Sioux v. Kneip (the last is also direct). Some of these come from broad V-records and should be checked before a page says they "concern" this treaty. |
| Q3 | What federal acts made a violation possible? | Violation -> `enabled_by` -> Statute or Instrument | 22 `enabled_by` edges. For example V006 -> `stat-indian-removal-act-1830`; V024 -> `TLA-A-1877`; V016 -> `stat-menominee-termination-act-1954`. |
| Q4 | Which organizations work on a given nation's land return? | Nation <- `serves_nation` or `governing_body_of` - Organization -> `supports_return_of` -> Campaign | e.g. `nat-oceti-sakowin` <- `org-ndn-collective` -> `camp-black-hills-claim`. |
| Q5 | What happened during the Termination era? | `era-06` <- `enacted_during` or `occurred_during` | 21 records: 7 statutes (including `stat-house-concurrent-resolution-108-1953`, `stat-menominee-termination-act-1954`, `stat-klamath-termination-act-1954`), 9 cases and 5 violation records (including V016 and V046). |
| Q6 | Which cases applied the doctrine of discovery? | `doctrine-discovery` <- `applies_doctrine` - Case or Statute | `case-fletcher-v-peck-1810`, `case-johnson-v-mintosh-1823`, `case-tee-hit-ton-v-us-1955`. |
| Q7 | Which court decisions led Congress to act? | Statute -> `responds_to` -> Case | 6: Major Crimes Act 1885 responds to Ex parte Crow Dog 1883; IGRA 1988 to Cabazon; ANCSA 1971 to Tee-Hit-Ton; Maine Settlement Act 1980 to Passamaquoddy v. Morton; VAWA 2013 to Oliphant; Claims Resolution Act 2010 to Cobell. C3 marks several of these interpretive. |
| Q8 | Which treaties were never ratified, and what became of them? | Instrument where `instrument_type = unratified_treaty` -> `violated_by` | 21 unratified; the 18 California treaties all link to V054. |
| Q9 | Which present-day governments are *possibly* related to the Cherokee party of 1835? | `nat-cherokee` <- `successor_of` - Nation | 2 proposed: `nat-pd-cherokee-nation` (extent partial) and `nat-pd-united-keetoowah-band` (disputed). This is a proposal list, not a finding; other Cherokee governments exist and are not in the seeds. |
| Q10 | Where do the records disagree? | Nodes with flag `text_has_disputed_tag` (43) or an Instrument whose notes say `[disputed]` | 43 nodes. The disagreement is shown, not resolved (brief, principle on uncertainty). |

Queries the graph **cannot** answer yet, and the UI must not pretend to: "how many acres were ceded to the United States" (acreage is blank for most rows and must come from Royce's schedule or Indian Claims Commission findings); "who owns this land now" (no parcel or title data); "which treaties are still in force" (no legal-status layer; that is G2's S1-S9 field and is empty); "who is the successor to X" (unreviewed).

## 3. Eight example paths, with real IDs

Notation: `A -[edge, status]-> B`. Status: **seed** = `asserted_by_seed`, **prop** = `proposed`.

### P1. The Black Hills

`nat-sioux` -[party_to, prop]-> **`TLA-T-369`** Treaty of Fort Laramie (1868) -[violated_by, prop, primary]-> **`V024`** "Fort Laramie 1868 and the Black Hills: abrogation by the Act..." -[enabled_by, prop]-> **`TLA-A-1877`** Black Hills Agreement (Act of February 28, 1877).
`V024` -[adjudicated_in, prop]-> **`case-us-v-sioux-nation-1980`** -[limits, prop]-> `case-lone-wolf-v-hitchcock-1903`.
`camp-black-hills-claim` -[remedies, prop]-> `V024`; `org-ndn-collective` -[supports_return_of, seed]-> `camp-black-hills-claim`; `org-ndn-collective` -[serves_nation, prop]-> `nat-oceti-sakowin`.

*What it shows.* From a treaty to a record of its abrogation, the Act that did it, the Supreme Court decision about it, and a present-day effort. *Cautions.* `V024` is an editorial record with a `[disputed]` text tag (the seed's flag) and high source confidence. The 1980 decision found a taking and compensation; the Sioux nations have not accepted the money. That context belongs in the narrative written with the nations, and is not in the graph. `nat-sioux` is a label "as named in treaty records", not a nation. Also note: `V024` first listed "Blackfeet" (a Lakota division) as the Blackfeet Nation; the link was removed by override. Shows why alias links need review.

### P2. Removal: New Echota

`nat-cherokee` -[party_to, prop]-> **`TLA-T-199`** Treaty of New Echota with the Cherokee, 1835 -[violated_by, prop]-> **`V006`** "Treaty of New Echota (1835) and the Trail of Tears (1838-39)" -[enabled_by, prop]-> **`stat-indian-removal-act-1830`**.
`V006` -[adjudicated_in, prop]-> `case-worcester-v-georgia-1832` and `case-cherokee-nation-v-georgia-1831`. `V007` (Georgia ignores Worcester) is also tied to Worcester.
`nat-pd-cherokee-nation` -[successor_of, prop, unreviewed]-> `nat-cherokee`; `nat-pd-united-keetoowah-band` -[successor_of, prop, **disputed**]-> `nat-cherokee`.

*What it shows.* The era-02 (Removal) story: a treaty whose legitimacy was contested, the act that framed removal, and the court decisions on either side of it. *Cautions.* "Violated by" for New Echota is the atlas's editorial category; it has to be explained on the page. The treaty's signing authority was disputed, which is the empty field `signatory_authority_disputed`. The successor links are the most sensitive in the dataset and must not be shown in production before the governments concerned have been asked.

### P3. Medicine Lodge and Lone Wolf

`case-lone-wolf-v-hitchcock-1903` -[concerns_instrument, prop, primary]-> **`TLA-T-364`** Medicine Lodge (Kiowa and Comanche), 1867 **and** `TLA-T-365` (Kiowa, Comanche and Apache). `TLA-T-364` -[violated_by, prop]-> **`V022`**. `V022` -[adjudicated_in]-> Lone Wolf and the Sioux Nation case. `case-lone-wolf-v-hitchcock-1903` -[applies_doctrine]-> `doctrine-plenary-power`. Other cases using plenary power: `case-kagama-1886`, `case-johnson-v-mintosh-1823`, `case-us-v-lara-2004`.

*What it shows.* A doctrine page as a hub: the same idea (plenary power) carried through four centuries of cases, linked back to treaties. *Cautions.* The Lone Wolf row is mapped to both RIT 364 and 365 because the seed does not say which version is meant; this is an open question. The 1980 decision "limits" Lone Wolf in the C3 seed, which is a legal interpretation to be checked with a lawyer.

### P4. Termination and restoration: the Menominee

`stat-menominee-termination-act-1954` <-[enabled_by, prop, effecting_act]- **`V016`** "Menominee termination (1954-1973)" -[adjudicated_in, prop]-> `case-menominee-tribe-v-us-1968`; `V016` -[occurred_during, prop]-> `era-06` Termination. `camp-menominee-restoration-1975` -[remedies, prop]-> `V016`; `org-menominee-tribe` -[supports_return_of, seed]-> `camp-menominee-restoration-1975`; `org-menominee-tribe` -[governing_body_of, prop]-> `nat-menominee`.

*What it shows.* A full arc inside the graph: policy, act, harm, court, and restoration. *Cautions.* The link from `V016` to the 1854 Wolf River treaty (`TLA-T-269`, a NARA skeleton node) was missed in the first pass and added only after the unmatched list was re-checked against the NARA spine; it is `proposed`. A prior false match ("Menominee" in V011 means a Potawatomi band) shows how easily names collide.

### P5. The 18 unratified California treaties

`TLA-U-CA-A` ... `TLA-U-CA-R` (18 nodes, all `unratified_treaty`) -[violated_by, prop, primary]-> **`V054`** "California: 18 unratified treaties (1851-52)..." -[involves_nation, prop]-> `nat-california-tribes`, `nat-pd-yurok`, `nat-pomo`. Three campaigns `remedies` V054 with role `context`: `camp-ca-7pct-pledge-2026`, `camp-ca-tnbs-statewide`, `camp-mechoopda-2026`.

*What it shows.* How a set of instruments is represented without false precision. *Cautions.* The 18 party lists are band names in 1851 spellings that the atlas does not map to present-day nations (H2 section 3); the nation links on V054 are broad. "Violated" here is a stretch for treaties the Senate never ratified; the honest label is "not ratified, then withheld from the public record and the land taken" and it needs a historian's wording. The campaign links have role `context`, meaning "related", not "remedy".

### P6. Congress answers the courts

`case-ex-parte-crow-dog-1883` <-[responds_to, prop]- **`stat-major-crimes-act-1885`** <-[applies_statute, prop]- `case-kagama-1886`. Both cases carry `doctrine-criminal-jurisdiction`; Kagama also carries `doctrine-plenary-power` and `doctrine-guardianship`. `case-ex-parte-crow-dog-1883` -[concerns_instrument, prop]-> `TLA-T-369` and `TLA-A-1877`.

*What it shows.* A lineage view: a decision, the statute that answered it, and the decision that upheld the statute. The case-law swimlane (J1 ADR-009) is made from this. *Cautions.* C3 wrote these edges in the opposite direction; the builder swaps six of them (H1 section 4).

### P7. Discovery to ANCSA (a distinct legal context)

`doctrine-discovery` <-[applies_doctrine]- `case-fletcher-v-peck-1810`, `case-johnson-v-mintosh-1823`, `case-tee-hit-ton-v-us-1955`. `case-tee-hit-ton-v-us-1955` -[applies_doctrine]-> `doctrine-aboriginal-title`, `doctrine-plenary-power`, `doctrine-takings`; `stat-alaska-native-claims-settlement-act-1971` -[responds_to, prop]-> `case-tee-hit-ton-v-us-1955`; Tee-Hit-Ton is also tied to V036 and V060 by `adjudicated_in`.

*What it shows.* The doctrine page as an entry point, and a thread that crosses into Alaska. *Cautions.* Alaska is a distinct legal context. ANCSA corporations are not tribal governments and Alaska Native peoples did not make ratified treaties with the United States. Every node on this thread touching Alaska carries `distinct_legal_context`, and the UI must not present it as a "treaty" story. The `responds_to` link from ANCSA to Tee-Hit-Ton is a C3 interpretive edge ("responds to" is not "caused by").

### P8. An era as a slice

`era-06` Termination <-[enacted_during or occurred_during]- 21 records: `stat-house-concurrent-resolution-108-1953`, `stat-klamath-termination-act-1954`, `stat-menominee-termination-act-1954`, `stat-indian-relocation-act-1956`, `stat-indian-civil-rights-act-1968`, `stat-national-historic-preservation-act-1966`, 7 statutes, 9 cases (Tee-Hit-Ton 1955, Menominee 1968, Puyallup 1968, and others) and 5 violation records (including `V016` and `V046`, through `occurred_during`).

*What it shows.* A time-based entry point that gathers statutes, cases and violations that sit in one period, and is how the time slider's side list can work. *Cautions.* Era membership comes from a year rule (the latest era that began on or before the year); some records fall in gaps between eras (1945-1952 and 1969), and the dating of the era boundaries is D2's interpretive choice. The edge type is called `enacted_during` even for a court decision, which is the wrong word. Recommendation: rename it `dated_in` in the next schema version.

## 4. Implementation notes

1. **Everything above is computed in the browser from `graph-lite.json`.** A breadth-first search up to 4 hops over about 3,000 edges is instantaneous. No server. No query logging.
2. **Path ranking.** Shortest path is not meaningful; prefer paths that use stated edges, then edges with higher confidence, then fewer hops. Show at most 5 paths between two nodes.
3. **Hub nodes.** `nat-oceti-sakowin` has 25 inbound `part_of` edges and doctrine nodes have dozens of cases. Cap the neighbourhood at 25 nodes (J1) and offer filtered lists.
4. **Stable URLs.** `/thread/?from=<id>&via=<id>,<id>` uses node IDs only. Removing a node from the dataset makes that URL return an explanatory page, not a broken one.
5. **Tests.** The eight paths above are the acceptance tests for the graph. A test loads `edges.json` and asserts that each edge in each path exists with the stated status. If a rebuild changes one, the test fails, and a human reads the diff.

## Sources

`build/nodes.json` and `build/edges.json` (2026-10-16 build); `docs/design/J1-architecture-decision-records.md` ADR-007 and ADR-009; `docs/research/B1`, `C3`, `D2`; H1, H2, H3.

## Confidence & Gaps

Confidence: medium. Every ID, edge type and status in section 3 was read from the build output. The meaning and legal framing in the "Cautions" notes are my reading of the seed text and the research notes, and need a legal reviewer; the statement about the 1980 Sioux Nation decision (a taking, with compensation not accepted) is from general knowledge [from-memory] and should be checked against the case and the C1 note before use. The UX sketch has not been tested with any user, and none with a tribal reviewer.
