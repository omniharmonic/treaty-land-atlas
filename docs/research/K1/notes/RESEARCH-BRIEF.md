# Shared research brief: "Beyond the federal record" pass

Project: Living Law, Living Land (landback.land), an interactive map + knowledge graph of US treaty law with Native nations, by Benjamin Life (@omniharmonic). Repo at /home/user/treaty-land-atlas (read-only for research agents).

## Why this pass exists

The atlas was built mostly from canonical US government sources: the NARA ratified-treaty series, Kappler, Statutes at Large, and Royce's 1899 "Indian Land Cessions" schedule and maps (USFS polygon layer). Its "violations" catalog therefore captures only the most egregious, documented breaches. The owner is concerned the map may unintentionally LEGITIMIZE dispossession: coloring every polygon as "ceded" makes it look as if every acre passed by lawful, consensual treaty. That is false. We need to surface, with verifiable sourcing:

1. LAND NEVER CEDED: areas with no treaty or other legal transfer (taken by executive order, statute, ICC payment-as-extinguishment, or nothing at all).
2. UNRATIFIED treaties, and treaties the Senate AMENDED without the nation's consent.
3. LAND PROMISED / RESERVED / GUARANTEED to nations by treaties (not only what was ceded), and what happened to it.
4. DURESS: hostage-taking (incl. children), starvation ("sign or starve"), military threat, imprisonment of leaders, signings during or after massacres.
5. SIGNATORY LEGITIMACY: unauthorized signers, minority factions, bribery, liquor, forgery, fraudulent signature counts, nations NOT INVITED or excluded, intertribal disputes over who held rights to the land.
6. MASSACRES and mass violence that coincided with or enabled land takings.
7. FRAUD and THEFT: annuity non-payment, agent embezzlement, state actions, land-office fraud.
8. ICC / court outcomes: money instead of land, 19th-century valuations, offsets, "extinguishment by payment".
9. Indigenous accounts that differ from the federal record (oral history, tribal histories, Native scholars).

Rigor matters equally: we must stay specific (named instruments, dates, Stat./Kappler cites, Royce area numbers, case names) and never be generic. Every claim needs a source. Distinguish clearly between (a) what a primary document says, (b) what a Native-authored or scholarly source asserts, (c) contested or single-source claims. Do not invent citations. If unsure, say so.

## Structured output: findings CSV

Write a CSV (UTF-8, header row, RFC-4180 quoting) with these columns:

finding_id,source_doc,pdf_pages,nations,date,place,category,secondary_categories,instrument,instrument_cite,royce_areas,summary,verbatim_quote,sources_cited_by_source,federal_account_contrast,map_implication,evidence_level,confidence,notes

- finding_id: prefix given in your task + running number (e.g. PSL-KCA-001).
- source_doc: the work you read (e.g. "PSL TREC 2024", or author/title/URL for web).
- pdf_pages: page(s) for the PSL book; blank for web.
- nations: semicolon-separated, as named by the source.
- date: ISO date or year or range.
- place: specific place names; include lat/long if the source gives or it is unambiguous (for massacres/treaty grounds).
- category (one of): NEVER_CEDED | TAKEN_WITHOUT_CONSENT | UNRATIFIED | SENATE_AMENDED_NO_CONSENT | LAND_PROMISED_RESERVED | LAND_PROMISED_THEN_TAKEN | DURESS_MILITARY | DURESS_STARVATION | HOSTAGE | SIGNATORY_ILLEGITIMATE | EXCLUDED_PARTY | INTERTRIBAL_DISPUTE | BRIBERY_FRAUD_FORGERY | MASSACRE | REMOVAL | ANNUITY_THEFT | STATE_OR_LOCAL_ACTION | ICC_OUTCOME | COURT_OUTCOME | INDIGENOUS_ACCOUNT_DIVERGES | RESOURCE_TAKING | CULTURAL_GENOCIDE | OTHER
- instrument: treaty/act/agreement/EO name and date as precise as possible.
- instrument_cite: Stat., Kappler vol/page, RIT number, docket number etc. if given.
- royce_areas: Royce area numbers if stated or clearly determinable.
- summary: 1-3 plain sentences.
- verbatim_quote: a short exact quote (<= 40 words) supporting the finding.
- sources_cited_by_source: what the source itself cites (endnote, archive, ICC docket).
- federal_account_contrast: how this differs from / adds to the official federal account (Kappler/Royce/NARA framing).
- map_implication: concrete suggestion for the map/data (e.g. "flag Royce 477 as signed under duress", "draw 1851 Fort Laramie Cheyenne-Arapaho territory as promised land").
- evidence_level: PRIMARY_QUOTED (source quotes a primary document) | SCHOLARLY_CITED (cites sources) | ASSERTED (no citation) | ORAL_HISTORY | CONTESTED
- confidence: high | medium | low
- notes: anything else, including disagreements with other sources.

## Narrative output

Also write a markdown report (attributed "Benjamin Life (@omniharmonic)", research-assistant draft) with: (1) a 10-line summary of the most important findings; (2) things the atlas most likely gets wrong or flattens; (3) land promised/reserved with boundary descriptions precise enough to map, where given; (4) quotes worth preserving with page cites; (5) open questions and claims needing verification.

Plain language. No em dashes. Do not overstate.
