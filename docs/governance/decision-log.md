---
title: Decision Log
author: Benjamin Life (@omniharmonic)
status: living
---

# Decision Log

Every owner decision, with its date. Numbers refer to `docs/03-DECISIONS-AND-OPEN-QUESTIONS.md`. Where a decision here differs from that file's recommended default, this log wins.

| Date | Item | Decision | Notes |
|---|---|---|---|
| 2026-10-17 | D-01 | Domain is **landback.land** (owner has bought it). Repo name stays `treaty-land-atlas`. Public product name still open. | Schema `$id` already uses `omniharmonic.github.io/treaty-land-atlas` (K-20), which stays valid. |
| 2026-10-17 | D-02 | Repo on the owner's personal GitHub account `omniharmonic`. The coding agent commits as that identity. | |
| 2026-10-17 | D-03 | Code: MIT. Project's own text and data: CC BY 4.0, "Benjamin Life (@omniharmonic)". Nation-contributed text: whatever each nation agrees in writing. | `LICENSE`, `LICENSE-DATA.md` |
| 2026-10-17 | D-04 | Accept J1 ADR-001 to 014. Versions re-checked; see `docs/design/ADR-versions.md`. | |
| 2026-10-17 | D-05 | **Public repository from the start** (overrides the private-until-launch default). | Preview builds keep the "work in progress, not for citation" banner and `noindex`. |
| 2026-10-17 | D-06 | No analytics. | |
| 2026-10-17 | D-07 | Legal reviewer to be engaged **after** the build, not before. | Legal-status panels still carry "not legal advice" language. |
| 2026-10-17 | D-09 / D-73 | Native Land Digital: data is **loaded live in the browser at view time and never stored, cached in the repo, or redistributed**. This is the owner's prior practice. | Static sites expose any API key to readers; see `docs/design/ADR-versions.md` note. Written permission from NLD is still worth requesting. |
| 2026-10-17 | D-60 | Forest Service Royce layer: treat as open US government data and **build with it now**. Revisit if the agency says otherwise. | Gate G-01 marked `cleared_by_owner_decision` in the registry, with this row as evidence. |
| 2026-10-17 | D-15 | Every claim must carry a citation. Verification agents may be dispatched to check claims. `[from-memory]` items show a visible badge. | |
| 2026-10-17 | D-64 | Treaty-count tooltip as proposed in A1 s.8. | |
| 2026-10-17 | D-51 | **The coding agent may edit seed data**, logging every change in `data/CHANGELOG-DATA.md`. | Overrides "Phase 1 never edits seeds". |
| 2026-10-17 | D-53 | Keep the Python graph builder. | |
| 2026-10-17 | D-25 / D-77 | **Show all edges**, including `proposed` ones, labeled by status. Goal: a richly connected database. | Overrides "proposed edges in preview only". |
| 2026-10-17 | names | Where a record uses a colonial or outside name, link it to related names, self-names (endonyms) and present-day nations wherever a source supports it. | Endonyms still need a source; none are invented. |
| 2026-10-17 | D-54 | Parachute vault not used for now. | |
| 2026-10-17 | D-36 | Test Charis SIL + Atkinson Hyperlegible for coverage; fall back to Noto. | Phase 2 |
| 2026-10-17 | backups | `verification/originals/` (pre-correction seed backups) is **lost**. `verification/CORRECTIONS-APPLIED.md` is the only record of the 2026-10-16 corrections (old and new values per field). | |
| 2026-10-17 | scope | Build Phase 1 (data pipeline), then Phase 2 (map and slider), pausing for owner review between them. | |
