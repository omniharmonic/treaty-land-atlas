# Treaty Land Atlas — Shared Research Brief

**Working title:** Treaty Land Atlas (placeholder; naming is an open question for the design wave)
**Author / attribution:** Benjamin Life (@omniharmonic). All work is attributed to Benjamin Life, never to OpenCivics or OpenCivics Labs.
**Date of brief:** 2026-10-16
**Status:** Research and documentation phase. Nothing is built yet.

---

## 1. Mission

Build an interactive, time-aware map and knowledge graph of United States treaty law with Native nations of Turtle Island, showing:

1. Treaties, agreements, cessions, and executive-order reservations over time.
2. Where and when the United States broke, abrogated, or ignored them, tied to specific legal and historical evidence.
3. The case law and statutes that shaped Indigenous land rights, from Johnson v. M'Intosh to the present.
4. Counterfactual maps: what the territory would look like if treaties from a given period had been honored.
5. Land Back organizations and initiatives tied to the specific tribes and territories in question, with ways to support them (donate, volunteer, learn).
6. Native territories and languages via the Native Land Digital API (subject to licensing and feasibility research).

The purpose of the site is to drive attention and resources toward Land Back. It is an educational and advocacy project, not a neutral reference work, but its factual claims must be rigorous and verifiable.

## 2. Principles (non-negotiable)

1. **Accuracy over drama.** Every factual claim needs a source. If a claim cannot be verified, label it unverified or omit it. Do not invent case names, citations, dates, treaty details, organization names, or URLs. Citations must be real.
2. **Distinguish legal categories.** Treaty vs. agreement vs. executive order vs. statute. Ratified vs. unratified. "Broken" vs. "abrogated" vs. "diminished" vs. "disestablished" are legally distinct; use the correct term and explain it.
3. **Source hierarchy.** Primary sources (treaty texts, statutes, court opinions, agency records) first. Then authoritative secondary sources (Kappler's *Indian Affairs: Laws and Treaties*, Cohen's *Handbook of Federal Indian Law*, Library of Congress, National Archives, Smithsonian NMAI, university presses, tribal government sources). Advocacy sources are acceptable for organization descriptions but must be labeled as self-described.
4. **Tribal voice and sovereignty.** Defer to tribes' own sources, own names (endonyms), and own accounts where available. Note when Indigenous oral history differs from or supplements the documentary record. Flag where the site would need tribal consultation or consent before publishing.
5. **Respect for sensitive content.** Avoid sacred-site locations. Avoid anything that would endanger people or places. Flag any data with cultural-protocol concerns.
6. **Donation integrity.** Only recommend organizations that are verifiable (EIN/charity status where applicable, tribal government, or clearly legitimate Indigenous-led groups). Prefer Indigenous-led. Note fiscal sponsors. Flag uncertainty. Never present a recommendation as certain if it could not be checked.
7. **Honest about uncertainty and scholarly dispute.** Counts of treaties, acreage figures, and boundary geometry vary by source. Record the range and the source of each figure rather than picking one silently.
8. **Plain-language access.** The audience is the general public, educators, and allies, not only lawyers. Documentation should still be precise enough for a legal-history reviewer.

## 3. Citation standard

- Cases: full Bluebook-style citation where possible (e.g., *Johnson v. M'Intosh*, 21 U.S. (8 Wheat.) 543 (1823)), plus a stable link (Justia, Oyez, Cornell LII, or Library of Congress) when you actually found one.
- Statutes: Statutes at Large citation and U.S. Code section where applicable.
- Treaties: Kappler citation and Statutes at Large citation (e.g., 7 Stat. 18) where available, plus date signed, date ratified, and parties.
- Every research file ends with a **Sources** section listing URLs actually consulted, and a **Confidence & Gaps** section listing what was not verified.
- Use the confidence tags: `[verified]` (confirmed in a source you read this session), `[from-memory]` (believed correct but not checked this session), `[disputed]`, `[unverified]`.
- Do not present `[from-memory]` items as verified. The verification agent will spot-check these later.

## 4. Output conventions

- All outputs are **Markdown** (`.md`), not Word documents.
- Structured data (treaty lists, case lists, organizations) is delivered as **CSV or JSON** in `seed-data/` alongside a Markdown README describing the fields.
- Each agent writes its own files to the paths given in its task. Do not overwrite other agents' files.
- File header on every document:

```
---
title: <title>
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: <overall: high | medium | low>
---
```

## 5. Workspace layout

```
treaty-land-atlas/
  docs/
    00-RESEARCH-BRIEF.md        (this file)
    research/                   (Wave 1 and 2 research outputs)
    design/                     (graph schema, UX, architecture)
    data/                       (data source and API notes)
  seed-data/                    (CSV/JSON seed datasets)
  verification/                 (verification reports)
```

## 6. Open questions the research should help answer

- What is a defensible, documented count of ratified treaties vs. unratified treaties vs. agreements, and how do sources differ?
- Which datasets give usable geometry for cession areas over time (e.g., the Smithsonian/Royce cession maps, Native Land Digital, Census/TIGER tribal boundaries, USGS/BLM data), and under what licenses?
- Is the Native Land Digital API available for this use, on what terms, and what attribution or permission is required?
- Which "counterfactual honored-treaty" map approaches are defensible, and what are the ethical risks of drawing them?
- Which Land Back organizations are verifiable and tied to specific tribes or territories?
- Static (GitHub Pages) vs. dynamic architecture: what is feasible for map tiles, geometry size, and the graph?
