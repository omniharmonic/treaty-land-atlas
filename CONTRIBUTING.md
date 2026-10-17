# Contributing

Thank you for helping. This project maps what the United States promised Native nations, what happened, and what is being returned. Accuracy matters more than speed, and every claim needs a source.

## If you are a Native nation, or work for one

If a page or record concerns your nation and you want it changed, corrected, or removed, open an issue or email the maintainer. **A removal request is honored first and discussed second**: the record is hidden at the next build while we talk (`data/suppress.yaml`). Nothing on this site speaks for your nation, and nothing has been reviewed by any nation yet. If your nation reviews its records, that review is recorded in `crosswalks/tribal-review-ledger.csv` with the office or role you choose; silence is never treated as consent.

## Report an error

Open an issue. Say which page or record (its id, such as `TLA-T-369`), what is wrong, and a source that shows it. Primary sources (the treaty text, Statutes at Large, a court opinion, a nation's own website) are best.

## Fix data yourself

1. The editable tables are in `seed-data/` and `crosswalks/`. Edit the row; keep its id.
2. Every fact needs a source URL. Mark anything uncertain with `[unverified]` or `[from-memory]` in the text; the site shows a badge.
3. Add a line to `data/CHANGELOG-DATA.md` (date, file, row id, field, old, new, source).
4. Run `npm run data:build && npm run data:validate` and fix any errors.
5. Open a pull request. Say what changed and why, with the source.

Rules for names: use a nation's own name and spelling exactly as the nation writes it, with every diacritic and special letter. Do not "correct" a nation's spelling. Colonial or treaty names are kept as historical names and linked, never used as the main label when the nation's own name is known.

Legal vocabulary matters: breach, abrogation, diminishment, disestablishment and termination mean different things. See `docs/research/B1-violation-typology.md` and `docs/research/D4-glossary.md`.

## Review links

Many links between records were inferred and are marked "proposed". If you have the knowledge to check them, see "Reviewing links" in `pipeline/README.md`. Record your role (an office or role, not your name unless you want it) and the date.

## Code

```sh
npm ci
npm run lint && npm run typecheck && npm run test:unit
npm run data:build && npm run data:validate
npm run build
```

- TypeScript strict. Read the current documentation for Astro, Svelte, MapLibre and the other libraries before using an API; pinned versions are in `docs/design/ADR-versions.md`.
- Keep outputs deterministic: no timestamps in generated files except through `SOURCE_DATE_EPOCH`.
- Never store Native Land Digital data, API keys, or secrets in the repository.
- Credit is "Benjamin Life (@omniharmonic)". CI checks attribution.
- Commit messages use Conventional Commits (`feat:`, `fix:`, `data:`, `docs:`, `chore:`).

## Licenses

By contributing you agree that code is MIT (`LICENSE`) and text and data are CC BY 4.0 (`LICENSE-DATA.md`). Text contributed by a Native nation is licensed only on the terms that nation agrees to in writing.
