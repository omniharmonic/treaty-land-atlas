# Living Law, Living Land Implementation Plan

> **For agentic workers:** Execute task-by-task in this session using executing-plans; finish with one independent review.

**Goal:** Warm the identity and make the existing treaty research discoverable and explorable.

**Architecture:** Astro continues to build static routes from the existing graph. A build-time treaty adapter reads the published overlays and graph relationships; server-rendered Svelte islands add search and timeline selection without a new API or dependency.

**Tech Stack:** Existing Astro 7, Svelte 5, TypeScript, Vitest, Playwright.

**Spec:** docs/superpowers/specs/2026-10-17-living-law-living-land.md

## Global Constraints

- Exact name: Living Law, Living Land. Existing routes and research remain intact.
- Read published overlays, never raw unpublished narratives. Preserve suggested edges, caution flags, context and unknown dates.
- Use actual recorded geometry; no inferred territorial reconstruction or new external services.
- Respect reduced motion, keyboard navigation, 320px screens and WCAG AA contrast.

## Review Focus

- Sparse instruments and unratified documents must remain usable without invented promises or dates.
- Context, successful defenses, and multi-year violation records must not become an invented date of breach.
- Timeline geometry must come from explicit graph relations, with a clear fallback to treaty-associated shapes.
- Deep links and browser back must preserve timeline selection and directory filters.
- Organization links and publication gating must remain sourced and retain caveats.

### Task 1: Warm identity
- [x] Create shared BrandMark.astro; update public brand name, metadata, favicon and UI palette.
- [x] Keep data category colors and research identifiers unchanged; verify contrast in browser.

### Task 2: Treaty data adapter
- [x] Test graph-to-event conversion in src/lib/treaty.test.ts with context, rejected edges, unknown/multi-year dates and event geometry fixtures.
- [x] Implement pure treatyExperience(n, nodes, edges) in src/lib/treaty.ts; resolve published overlays separately at build time.
- [x] Run unit tests; inspect Fort Laramie and an unratified instrument.

### Task 3: Treaty discovery and reading
- [x] Implement src/islands/TreatyDirectory.svelte for search, region/status filters and URL persistence, rendered statically with client:load.
- [x] Implement src/islands/TreatyJourney.svelte for selectable events, hash history, evidence links, and honest map state.
- [x] Implement src/components/TreatyRecord.astro and integrate existing narrative, sources, support and record metadata.
- [x] Replace treaty index/detail layouts while preserving URLs and add clear map-to-treaty links.

### Task 4: Verification and review
- [x] Add meaningful Playwright regression coverage for discovery, chronology, related records, keyboard, mobile, reduced motion and missing-data states.
- [x] Run build, unit tests, lint, typecheck and browser suite. Inspect desktop/mobile screenshots.
- [x] Independent review of the resulting implementation; fix material findings and rerun affected checks.

## Execution ledger

Authorization: user explicitly said “Go ahead and build out the treaty experience.” Proceeding in the shared checkout preserves the prior authorized frontend work already present here. No extra approval checkpoint or deployment.


Completed: warm identity, searchable directory, static treaty records, interactive chronology and maps, evidence/corrections, and direct organizational support. Build, lint, typecheck, attribution, 97 unit tests, and 42 browser tests passed. Independent review found four material issues; all fixed with browser regressions: entry confidence, correction evidence, in-timeline connection navigation, and preservation of selection when opening section anchors.

Release registry retains pending statuses. Existing owner launch decision in docs/governance/decision-log.md explicitly permits an early release with notices before legal and tribal review. These statuses were not elevated or cleared by this implementation.

Final verification: complete production browser suite passed 42/42, including mobile selection reveal, multi-term search, low-confidence entries, and preserved correction evidence. Production build, lint, typecheck, 97 unit tests, attribution check, and whitespace checks passed. No deployment was performed.
