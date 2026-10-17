---
title: Repository Layout, Branching, CI/CD, Data Validation, Contribution Workflow, and Hosting
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# J3. Repository, CI/CD, Contribution Workflow, and Hosting

*Numbers corrected by the Synthesis Agent on 2026-10-16 and updated after the verification correction pass to match `build/graph-build-report.md` (current build: 1,563 nodes, 3,543 edges, Nation 226, proposed 2,345, 29 orphans, 0 schema errors, 106 logged issues). The earlier scratch-run figures (1,529 / 3,476 / 194 / 31 / 12 / 164 / 2,280) are superseded.*

Design Agent J, file 3 of 6. Companions: J1 (architecture), J2 (NLD), J4 (licensing gates), J5 (roadmap), J6 (kickoff prompts).

Tags: `[verified]` = checked in GitHub/Cloudflare docs fetched 2026-10-16; `[from-memory]`; `[proposal]`.

---

## 1. Repository layout

One repository (a monorepo) holding docs, data, pipeline, site, and the (disabled) relay. Directory names are instructions for the coding agent. The existing `docs/` and `seed-data/` trees stay where they are.

```
treaty-land-atlas/                      # name is a placeholder (decision D-01)
  README.md                             # what it is, attribution: Benjamin Life (@omniharmonic), status, how to run
  LICENSE                               # code license (decision D-03)
  LICENSE-DATA.md                       # license for the project's own data/text + third-party notices pointer
  NOTICE.md                             # third-party attributions (generated from data/licenses/registry.yaml)
  CITATION.cff
  SECURITY.md                           # how to report a vulnerability
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md                       # plain-language contribution guide (links to templates)
  package.json  package-lock.json  .nvmrc  .editorconfig  .gitignore
  astro.config.ts  tsconfig.json  eslint.config.js  prettier.config.js
  vitest.config.ts  playwright.config.ts  lychee.toml  .gitleaks.toml

  .github/
    workflows/
      ci.yml                            # PR + push: lint, types, unit, data validate, build, size, e2e, a11y
      deploy.yml                        # main: build + deploy to Pages (gated by repo variable)
      links.yml                         # weekly + manual: link check on all source/donation URLs
      data-refresh.yml                  # manual: fetch upstream, rebuild, open PR with diff
      security.yml                      # gitleaks, npm audit, license audit (weekly + PR)
    ISSUE_TEMPLATE/
      config.yml                        # disables blank issues; links to private tribal channel + email
      correction.yml                    # reader reports an error
      tribal-review-note.yml            # maintainers log a nation's review outcome (no private correspondence)
      new-organization.yml
      new-record.yml                    # treaty / violation / case / statute suggestion
      removal-request.yml               # content concern or removal request (non-tribal route)
    PULL_REQUEST_TEMPLATE/
      correction.md  tribal-review-note.md  new-organization.md  new-record.md  code-change.md
    pull_request_template.md            # default: asks which template applies
    CODEOWNERS
    dependabot.yml

  docs/
    00-RESEARCH-BRIEF.md                # existing
    research/  data/  design/           # existing / this wave (design/ also holds schema/, tokens.css, tokens.json, prototype/)
    adr/                                # accepted ADRs (copy of J1 sections as individual files once approved)
    governance/                         # charter, data policy, removal policy, AI policy, donation policy (Phase 0)
    release/                            # permission replies, gate evidence, audit reports, CORS test results
      gates.md                          # human-readable gate checklist (mirrors J4)

  seed-data/                            # existing; CANONICAL tables (see ADR-007). Add CANONICAL.md
  crosswalks/                           # existing (design wave): nation-entities.csv, nation-aliases.csv, nation-link-overrides.csv,
                                        # nation-successor-proposals.csv, case-instrument-links.csv, violation-instrument-links.csv,
                                        # violation-statute-links.csv, campaign-violation-links.csv, case-doctrine-statute-edges.csv,
                                        # statute-merge.csv. Added by this project: instrument-royce.csv, tribal-review-ledger.csv
  scripts/build_graph.py                # existing (design wave): graph stage, Python 3 standard library
  build/                                # GENERATED, git-ignored: nodes.json, edges.json, unresolved.json, reports
  data/
    overlays/                           # Markdown + YAML front matter per node id: narrative, content warnings, tribal-account text
      nations/  instruments/  violations/  cases/  organizations/  campaigns/  eras/
    licenses/registry.yaml              # every external dataset/library layer: license, status, attribution
    tours/*.yaml                        # guided tour definitions (G4 s.5 data model)
    sources/manifest.json               # checksums of pinned raw upstream files (raw files are Release assets)
    suppress.yaml                       # entities hidden/tombstoned at build (removal fast lane)
    KNOWN-ISSUES.md  PROVENANCE.md  CHANGELOG-DATA.md

  pipeline/                             # TypeScript data pipeline (run with tsx)
    src/{cli.ts, schema/, fetch/, ingest/, normalize/, link/, geometry/, derive/, emit/, validate/}
    test/

  src/
    pages/                              # index, map, treaties/[id], nations/[id], cases/[id], statutes/[id],
                                        # violations/[id], organizations/[id], eras/, tours/[id], search, about/*, glossary
    layouts/  components/  styles/
    islands/                            # Svelte: MapApp, TimeSlider, LayerPanel, EventTable, TourPlayer, SearchBox
    lib/{map/, a11y/, graph/, format/, data/, i18n/}
    integrations/territory/             # J2 provider abstraction
    i18n/en.json

  public/
    fonts/  map/style-atlas.json  robots.txt (generated by SITE_STAGE)  favicon...
    data/                               # GENERATED by pipeline; git-ignored

  workers/nld-relay/                    # J2 Tier 1; present, not deployed, no deploy workflow until permission exists
  scripts/                              # size-budget.mjs, check-attribution.mjs, check-no-nld.mjs, build-notice.mjs
  tests/{e2e/, a11y/, fixtures/}        # fixtures/unicode-names.txt
```

**What is committed vs generated**

| Committed | Generated, not committed |
|---|---|
| `seed-data/*.csv`, `crosswalks/*.csv`, `scripts/build_graph.py`, `docs/design/schema/*.json`, `data/overlays`, `data/tours`, `data/licenses`, code, docs | `build/**`, `public/data/**`, `dist/`, `data/sources/**` raw files |

Raw upstream downloads (USFS GeoJSON, unsimplified; Census file) are published as assets on a GitHub Release tagged `data-sources-YYYYMMDD`; `data/sources/manifest.json` (committed) lists URLs and SHA-256 sums; `npm run data:restore` downloads and verifies them. This keeps git small (GitHub recommends keeping Pages source repos under 1 GB [verified]) and builds independent of upstream uptime.

---

## 2. Branch strategy

Trunk-based, small pull requests, protected `main`.

| Branch | Purpose | Rules |
|---|---|---|
| `main` | Always buildable; the source of production deploys | Protected: PR required, required checks (section 3), linear history, no force-push, conversation resolution, CODEOWNERS review for `data/`, `seed-data/`, `src/integrations/`, `docs/governance/` |
| `feat/<topic>` | Code features (map, slider, graph) | Short-lived; squash-merge |
| `data/<topic>` | Table, crosswalk, overlay changes | Squash-merge; CI posts a data-diff summary |
| `fix/<topic>` | Bug fixes | Same |
| `hotfix/removal-<id>` | Removal/suppression requests from a nation or concerned party | Fast lane: single reviewer; touches only `data/suppress.yaml`; deploy within hours (section 7.4) |
| `docs/<topic>` | Docs and governance text | Same |

Tags and releases:
- `site-vX.Y.Z` for site releases; `data-vX.Y.Z` for data releases (semantic version of the dataset: major = schema break, minor = rows or layers added, patch = corrections). GitHub Releases carry the release notes and, for `data-v*`, the unsimplified geometry as an asset (G2 s.9.3 versioning and corrections log).
- Commit messages: Conventional Commits (`feat:`, `fix:`, `data:`, `docs:`, `chore:`); data commits cite the source in the body.
- Optional archival DOI via a repository-archiving service for data releases `[from-memory; decide later, D-17]`.

---

## 3. GitHub Actions: build, validate, deploy

Pages deployment with a custom workflow needs `pages: write` and `id-token: write` (plus `contents: read`), the `github-pages` environment, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`, and the deploy job must declare `needs:` on the build job [verified, GitHub docs]. A custom workflow also avoids the soft limit of 10 Pages builds per hour [verified]. Deployment times out after 10 minutes [verified]. Private repositories need a paid plan to use Pages [verified]. Pin third-party actions to full commit SHAs and let Dependabot update them `[proposal]`; the version tags below are the ones named in GitHub's docs or recalled, to be re-checked.

### 3.1 `ci.yml` (pull requests and pushes)

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@v4        # pin SHA
      - uses: actions/setup-node@v4      # pin SHA; node-version-file: .nvmrc; cache: npm
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck           # astro check + tsc for pipeline
      - run: npm run test:unit           # vitest (pipeline + lib)
      - uses: actions/setup-python@v5    # pin SHA; Python 3 for scripts/build_graph.py (standard library only)
        with: { python-version: '3.x' }
      - run: npm run data:restore        # downloads pinned raw files from our own Release, verifies SHA-256
      - run: npm run graph:build         # python3 scripts/build_graph.py -> build/nodes.json, edges.json, unresolved.json
      - run: npm run data:validate       # tables (Zod), graph (Ajv vs docs/design/schema), refs, citations, license gate (section 4)
      - run: npm run build               # pipeline emit + astro build + pagefind
      - run: node scripts/size-budget.mjs dist
      - run: node scripts/check-attribution.mjs   # no "OpenCivics" in site-facing files; Benjamin Life credit present
      - run: node scripts/check-no-nld.mjs dist   # J2 section 9
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e            # keyboard slider, no-WebGL fallback, disabled-NLD, search
      - run: npm run test:a11y           # axe on key pages
      - if: always()
        run: cat build/report.md >> "$GITHUB_STEP_SUMMARY"
```

Required status checks on `main`: `check`, `security`. Keep one job at first (simple for a non-developer to read); split only when runtime exceeds about 15 minutes.

### 3.2 `deploy.yml` (production)

```yaml
name: deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      SITE_STAGE: ${{ vars.SITE_STAGE || 'preview' }}      # 'preview' => noindex + banner; 'production' => release gates enforced
      RELEASE_MODE: ${{ vars.SITE_STAGE == 'production' && 'production' || 'preview' }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run data:restore
      - run: npm run data:validate -- --mode=$RELEASE_MODE   # production mode fails on any uncleared license gate
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with: { path: dist }
  deploy:
    if: ${{ vars.PAGES_DEPLOY_ENABLED == 'true' }}
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

How the gates work (non-developer view): the site builds on every push to `main`, but the **deploy job is skipped** until the owner sets the repository variable `PAGES_DEPLOY_ENABLED` to `true`. Until the owner also sets `SITE_STAGE=production`, the site is built in preview mode (adds `noindex`, a "work in progress" banner, and skips nothing else). In `production` mode, `data:validate` runs the license gate from J4 and the build **fails** if any gate in `data/licenses/registry.yaml` used by a shipped layer is not `cleared`. The owner flips the two variables in the GitHub web UI (Settings -> Secrets and variables -> Actions -> Variables). A mistake cannot publish uncleared content by accident, because the production build refuses to produce a site.

Important repository-visibility point: the project owner must choose repository visibility (D-05). A **private** repository keeps unresolved-license material private but cannot use GitHub Pages on a free plan [verified]. Options: (a) keep the repo private through Phases 0-6, preview locally and via the downloadable workflow artifact (the `check` job can upload `dist/` as a 7-day artifact), then make it public/enable Pages at launch; (b) public repo from the start with `SITE_STAGE=preview` and `noindex` (simpler, but all seed data and unreviewed nation content become public immediately - conflicts with G3 s.3.3, which says unreviewed nation pages ship only with limited content). **Recommendation: (a).**

### 3.3 `links.yml` (scheduled)

- Weekly cron and manual dispatch. Run lychee (`lycheeverse/lychee-action`) over `seed-data/*.csv` URL columns (extracted to `build/urls.txt` by `npm run data:urls`) and over `dist/` internal links.
- `lychee.toml`: accept `200..=299`, treat `403`, `429`, and timeouts as warnings for known bot-hostile hosts (`archives.gov`, `loc.gov`, `oklahoma state` domains), retry 3 times, `max_concurrency` low, user agent that identifies the project with a contact URL.
- Donation URLs (organizations table) are checked by a stricter job (F4 s.6.4): fail on HTTP error, cross-domain redirect, or missing organization name in page text; the job opens/updates a GitHub issue labeled `donation-link` listing failures. Failing URLs are **auto-delisted at next build** via `listing_status: delisted` in the overlay when a maintainer merges the generated PR; do not auto-merge.
- Output: GitHub issue (`peter-evans/create-issue-from-file` or the `gh` CLI) labeled `link-rot`.

### 3.4 `data-refresh.yml` (manual)

Steps: `data:fetch` (USFS REST pagination; Census file) -> new Release `data-sources-<date>` -> update `data/sources/manifest.json` -> `data:build` -> open a PR whose body is the data-diff report (feature counts: expect 718 or 752 [disputed]; new/removed `cessnum`; size per layer; geometry validity; unresolved links). A human reviews the diff. Never run on a schedule: USFS says no updates are planned [verified, E2], so refresh is event-driven.

### 3.5 `security.yml`

gitleaks on PRs; `npm audit --omit=dev` (warning on moderate, failure on high/critical in production deps); license audit with an allowlist (MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, MPL-2.0 build-time only, OFL-1.1 for fonts, CC0-1.0, BlueOak-1.0.0) using a license-checker package; failure on unknown or copyleft-in-runtime licenses.

### 3.6 `dependabot.yml`

Weekly updates for `npm` and `github-actions`, grouped by ecosystem, `cooldown` of 14 days so only releases at least two weeks old are proposed `[from-memory: Dependabot supports a cooldown option; verify]`. Major version updates for Astro, MapLibre, and Svelte always arrive as separate PRs with the e2e suite as the gate.

---

## 4. Data validation in CI

`npm run data:validate [--mode=preview|production]` writes `build/report.md` (shown in the job summary) and exits non-zero on any error-level finding. Findings have levels `error`, `warn`, `info`. In `preview` mode license-gate findings are `warn`; in `production` they are `error`.

| # | Check | Level | Rule (implemented as code in `pipeline/src/validate/`) |
|---|---|---|---|
| V1 | Schema | error | Every CSV row parses against its Zod schema: required columns, enums (`ratified`, `confidence`, `land_rights_effect`, `status`, `org_type`, `indigenous_led`), ISO dates (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`), integers, URLs |
| V2 | ID integrity | error | IDs unique across the whole graph; match the patterns in `entities.schema.json` (`TLA-*` instruments, `nat-*`, `geo-*`, `case-*`, `stat-*`, `V###`, `org-*`, `camp-*`, `era-##`); IDs never removed once released (compare to previous release manifest: removal requires `data/suppress.yaml` or a tombstone) |
| V3 | Referential integrity and graph schema | error | `build/nodes.json` and `build/edges.json` validate against `docs/design/schema/*.schema.json` (including the ethics rules in `NodeCommonRules`); every crosswalk and edge endpoint resolves; remaining issues in `build/unresolved.json` (errors and warnings) must be listed in `data/KNOWN-ISSUES.md` to pass. Starting point observed in the current build (`build/graph-build-report.md`): 0 schema errors, 29 orphans, 106 logged issues (69 info, 37 warn) |
| V4 | Encoding | error | All text is valid UTF-8 and NFC (Unicode normalization form C); no control characters; no U+FFFD |
| V5 | Citation completeness | error/warn | Rules below |
| V6 | Confidence tags | warn | Inline `[from-memory]`, `[unverified]`, `[disputed]` in displayed fields are parsed into flags; the site shows a visible badge for each (a build test checks the badge renders). Count is reported per table; `production` threshold is decision D-15 |
| V7 | Link syntax and policy | error/warn | URLs are https where available; no URL shorteners; host allowlist of known-good domains, others are `warn` for review; no query strings with tokens |
| V8 | Publishability | info | Counts of records excluded by rule (low-confidence organizations; nations at `not_yet_contacted`/`invited` restricted to Class P/D; suppressed items) |
| V9 | License gate | warn/error | See section 4.2 |
| V10 | Geometry | error | Valid polygons (no self-intersection after repair), coordinates within contiguous US + AK + HI bounding boxes, feature count equals the pinned source count, known-missing IDs (47, 65, 128, 129, 130, 543, 690 [verified, E2]) have `geometry_quality: missing` and an events-only record |
| V11 | Size budgets | error | ADR-011 numbers |
| V12 | Determinism | error | Two consecutive pipeline runs produce byte-identical hashed outputs |
| V13 | Sensitivity | warn | Displayed text flagged by a small term list (e.g., "burial", "sacred site", "ceremonial", "petroglyph", "cave") for human review; any **point** feature with more than 2 decimal places in public data is an error unless its overlay says `sensitivity: public_landmark_from_treaty_text` |
| V14 | Review-status integrity | error | Any node with `tribal_review.status` of `reviewed` or `co_authored` must have an entry in `crosswalks/tribal-review-ledger.csv` with `date`, `reviewer_role`, and `record_id`; `declined`/`withdrawn` force `publication.state` to `record_only` or `withheld`; the status is never inferred from silence; `tribal-review-ledger.csv` rows for ids that do not exist fail |
| V15 | Attribution | error | Site-facing files (`src/`, `public/`, `data/overlays`) contain no occurrence of "OpenCivics"; the footer/about include "Benjamin Life (@omniharmonic)" (script `check-attribution.mjs`) |
| V16 | AI-assistance label | warn | Overlay narrative changed in a PR without `ai_assisted: true|false` front matter (G3 s.12) |

### 4.1 Citation completeness rules (V5)

| Entity | Rule |
|---|---|
| Treaty/instrument | Has `source_url` or `nara_naid`; if `ratified=yes` then `stat_cite` present or `stat_cite_status: unverified` set; `date_signed` present; acreage has a source or is blank |
| Case | `full_citation` present; `confidence=verified` requires `source_url`; sub-claims tagged `[from-memory]` carry a badge |
| Statute | `citation` present; `source_url` or `confidence != verified` |
| Violation | At least one URL in `source_urls`; `confidence` present; `related_cases` strings resolve to case IDs or are listed as unresolved; `violation_type` values belong to the controlled vocabulary |
| Organization (published) | `confidence` in {high, medium}; `website` present; `ein_or_registry` non-empty or `org_type` = tribal government; `vetting_notes` non-empty; `last_verified` within 12 months (F4 s.6.4); if `donation_url` present it is on the organization's own domain or a recognized fiscal sponsor listed in the overlay |
| Campaign | `status` in the allowed set; `source_url` present; `acres` has a source or is blank |
| Geometry layer | Entry in `licenses/registry.yaml`, `PROVENANCE.md` row (tool, version, tolerance, date, source checksum) |
| Tour beat | Every `claim` has at least one `evidence` item resolving to an entity or URL |

### 4.2 License checks (V9)

`data/licenses/registry.yaml` schema (one entry per external dataset, font, library group, or basemap):

```yaml
- id: usfs-royce
  name: "Tribal Lands Ceded to the United States (USDA Forest Service)"
  used_in: ["layers/cessions"]
  license_stated: "CC BY 4.0 (Data.gov); agency metadata says access constraints None, no explicit license"
  conflict: true
  status: pending              # pending | cleared | blocked | not_used
  evidence: null               # path under docs/release/ to written confirmation
  attribution_text: "..."      # exact text rendered in footer and layer panel
  required_notices: ["modified", "not legal documents"]
  gate: G-01
```

Check: every `used_in` layer in `public/data/manifest.json` has a registry entry; production fails if `status != cleared`; `attribution_text` must appear in the rendered map page (Playwright) and in `NOTICE.md`.

---

## 5. Publishability and review gates implemented in the build (summary)

- Organizations: `confidence=low` never published; `listing_status` in {`listed`, `info-only`, `delisted`}; `delisted` shows no donation link (F4 s.6.4).
- Nations (and any node whose `tribal_review.scope` is `nation_specific`): `tribal_review.status` and `publication` govern content class (G3 s.3.3; the schema rules enforce it). `not_yet_contacted`/`invited`: only Class P/D facts (federal public documents and derived geometry), with a banner "This page has not been reviewed by [nation]"; no narrative speaking for the nation, no counterfactual narrative.
- Counterfactual views and legal-status panels: published only if the overlay has `legal_review.signed_off_on` and reviewer role (G2 s.7 item 5).
- `data/suppress.yaml` overrides all of the above (section 7.4).

---

## 6. GitHub account note (owner decision, do not assume)

The owner's convention, per the instruction for this work, is to use the **clawmniharmonic** account for git operations when acting as the agent. This is recorded here as an **owner-decision item (D-02)**, not an assumption. Questions to settle before the first push:

1. Which account **owns** the repository (personal `omniharmonic`, an organization, or `clawmniharmonic`)? This sets the default Pages URL (`<owner>.github.io/<repo>/` unless a custom domain is used) and who administers branch protection, environments, and variables.
2. Which identity is the **commit author** for agent-made commits, and should agent commits carry a `Co-Authored-By` trailer? (The session's attribution rules for commits and PRs apply.)
3. How does the agent authenticate? Prefer a fine-grained personal access token or a GitHub App scoped to this single repository (contents, pull requests, actions/workflows, pages, variables as needed `[from-memory]`), stored in the owner's credential store and never in the repo or in prompts. Do not grant organization-wide scopes.
4. Is two-factor authentication on for every account with write access?
5. Public attribution on the site remains **Benjamin Life (@omniharmonic)** regardless of which account performs git operations (brief s.1/s.4). A bot-like account name should not appear as the public author of the site.
6. Should the agent be allowed to merge to `main`, or only open PRs for the owner to merge? **Recommendation:** agent opens PRs; the owner (or a second maintainer) merges; direct pushes to `main` disabled for everyone.

The Phase 1 and Phase 2 prompts (J6) tell the coding agent to ask which account to use and not to push until told.

---

## 7. Content-contribution workflow

### 7.1 Who contributes and through what

| Contributor | Route | Result |
|---|---|---|
| Reader / educator spots an error | `correction.yml` issue form (no GitHub skill needed beyond an account) or the site's "Report an error" link, which opens the form prefilled with the page URL and entity ID | Triage -> PR |
| Researcher / legal historian | Pull request editing a CSV row or an overlay, using `new-record.md` or `correction.md` template | CI + review |
| Tribal government or authorized office | **Not GitHub.** A named steward and a direct channel (email and web form; G3 s.7.1) | Steward records outcome (without private correspondence) via the `tribal-review-note` PR template; review status updated in the nation's overlay |
| Land Back organization or suggester | `new-organization.yml` issue form | Vetting per F4 checklist; maintainer PR |
| Anyone with a concern about content | `removal-request.yml` or the steward email | Fast lane for nations (section 7.4) |

### 7.2 Rules for all PRs

- Cite a source for every changed fact. Primary sources first (brief s.3).
- Use the project vocabulary (treaty vs agreement vs executive order; "diminished", "disestablished", "abrogated"; G2 s.1). Do not use "broken" without an evidence flag.
- Do not publish sacred-site locations or anything a nation asked to withhold (G3 s.4).
- Do not write text that speaks for a nation unless it came from the nation's own words or review.
- Mark AI assistance honestly (`ai_assisted` in overlay front matter and a checkbox in the template).
- CI must pass; data PRs show the data-diff summary.

### 7.3 Templates (content to implement)

**`.github/ISSUE_TEMPLATE/correction.yml`** (issue form fields)
- Page URL (required) and entity ID (optional)
- What is wrong? (dropdown: date, citation, legal term, name/spelling, map geometry, link, description of a nation, other)
- What should it say? (textarea)
- Source for the correction (textarea, required: URL or full citation)
- Are you writing on behalf of a Native nation or its office? (yes/no; if yes, the form says "Please use the direct tribal channel at [steward contact]; this public form is not the right place for sensitive material")
- Checkbox: I did not include private or sensitive location information.

**`.github/PULL_REQUEST_TEMPLATE/correction.md`**

```markdown
## What changed
- Entity ID(s):
- Field(s):
- Old value -> New value:

## Source (required)
- URL or full citation:
- Source type: primary / authoritative secondary / tribal government / advocacy (self-described) / other
- Confidence after this change: verified / from-memory / disputed / unverified

## Checklist
- [ ] Citation is real and I opened it (not recalled from memory)
- [ ] Legal terms follow the project vocabulary
- [ ] No sacred-site or withheld locations
- [ ] CI is green and I read the data-diff summary
- [ ] AI assistance used: yes / no (if yes, a human checked each citation)
```

**`.github/PULL_REQUEST_TEMPLATE/tribal-review-note.md`**

```markdown
> Do not paste private correspondence here. Keep it in the private records store and reference it by id.

## Nation and office
- Nation (node id, `nat-...`, from crosswalks/nation-entities.csv):
- Office/body that responded (e.g., cultural resources office, council, attorney general):
- Date of response:
- Private record id (not the content):

## Outcome (select one)
- [ ] Reviewed - pages OK as published
- [ ] Reviewed - edits requested (list below; link a follow-up PR)
- [ ] Co-authored text provided (attach via a separate PR; text credited as the nation chooses)
- [ ] Declined to participate (narrative content suppressed per policy)
- [ ] Content withdrawn at nation's request (suppression PR linked)

## Naming
- Preferred name/spelling (endonym) as provided:
- Source of the endonym (nation-provided, date):
- Public credit line the nation prefers:

## Scope
- Pages/records covered:
- Review expires / re-confirm on:

## Checklist
- [ ] Silence was not treated as consent
- [ ] Row added or updated in `crosswalks/tribal-review-ledger.csv` (`node_id`, `status`, `scope`, `date`, `reviewer_role`, `record_id`); status uses the schema values
- [ ] Any removal or suppression was applied first, reviewed after
```

**`.github/PULL_REQUEST_TEMPLATE/new-organization.md`** (checklist from F4 s.2)

```markdown
## Organization
- Name / website:
- Type: 501(c)(3) / tribal government / fiscally sponsored project / state agency / other
- Nations or territories served (use nation ids):
- Indigenous-led evidence (named Native leadership or tribal control; link):
- EIN and where verified (IRS TEOS link, or "Government"):
- Donation URL as linked from the organization's own site:
- Fiscal sponsor (if any; sponsor EIN):
- Red flags checked (domain age/lookalike, charity watchdog reports, leadership changes, news):
- last_verified date and verifier:

## Checklist
- [ ] Donation URL is on the organization's own domain or a named fiscal sponsor
- [ ] I opened the donation page and confirmed the organization name appears
- [ ] No evidence of IRS revocation or credible fraud reports
- [ ] The organization is described in its own words and labeled "self-described"
- [ ] If the nation has not been contacted, the listing does not imply endorsement by the nation
```

`new-record.md` asks for instrument type (treaty, unratified treaty, agreement, statute, executive order), dates (signed/ratified/proclaimed), Kappler and Stat. citations, parties as named in the source, and a source URL; `code-change.md` is a standard code checklist (tests, a11y check, screenshots).

### 7.4 Removal fast lane

`data/suppress.yaml`:

```yaml
- id: nat-example
  scope: narrative          # narrative | map | entity | all
  reason: nation_request    # nation_request | safety | legal | error_pending_review
  requested_on: 2026-11-01
  tombstone: true           # show "Removed at the request of the nation" unless the nation asks for none
```

Policy (G3 s.7.2): hide first, review afterward. A PR touching only this file may be merged by a single maintainer and auto-deploys; target hours, not days. The build refuses to render suppressed scopes anywhere, including search, the graph, tours, and static SVG maps.

### 7.5 Review roles (proposal)

CODEOWNERS: owner for `data/`, `seed-data/`, `src/integrations/`, `docs/governance/`, `.github/`. Add when named: a data steward (responsible for removal requests - G3 s.3.5), a legal reviewer (G2 s.7), and tribal-advisory seats (policy advice only; individual nations consent for their own content). Two-person rule for changes to evidence-flag assignments, legal-status panels, and nation narratives.

---

## 8. Hosting, limits, cost, and what to do if data outgrows Pages

### 8.1 GitHub Pages limits [verified 2026-10-16 from docs.github.com]

| Item | Limit |
|---|---|
| Published site size | 1 GB maximum |
| Source repository | 1 GB recommended (not enforced) |
| Bandwidth | Soft limit 100 GB per month |
| Builds | Soft limit 10 per hour, not applied to custom GitHub Actions workflows |
| Deployment | Times out after 10 minutes |
| Rate limiting | HTTP 429 may be returned; no numeric threshold documented |
| Prohibited | Sites for running a business, e-commerce, or commercial SaaS; sensitive transactions (passwords, credit cards) |
| Private repos | Pages requires a paid plan |
| Per-file size | Not stated by GitHub; third-party guidance treats 100 MB as a practical ceiling [unverified] |

Project fit: free for public repos; the site is non-commercial educational and never processes payments (donation links go to third parties; also required by NLD terms, J2). Keep the project from drifting toward "commercial" use (no sales, no paid tiers, no sponsored placements).

### 8.2 Bandwidth arithmetic [estimate]

If a full map-page visit transfers about 3 MB gzip (ADR-011) and a content page about 150 KB with fonts and images, then 100 GB per month is roughly 33,000 map visits, or about 650,000 content-page visits, or a mixed profile of about 10,000 visitors who each load one map page and ten content pages (about 4.5 MB each = 45 GB). Browsers cache hashed assets, which lowers real usage. A viral spike is the risk, not steady traffic.

### 8.3 Custom domain options

| Option | Notes |
|---|---|
| Default `<owner>.github.io/<repo>/` | Free; requires `base` path handling (ADR-001); account name becomes public (see section 6) |
| Subdomain of a domain the owner already holds (e.g., `atlas.<owner-domain>`) | CNAME record; simplest DNS [verified: subdomains use CNAME] |
| New dedicated domain | About a typical registrar annual fee `[from-memory; check price]`; apex requires A/ALIAS/ANAME records and GitHub recommends also setting up `www` [verified]; GitHub recommends verifying the domain to prevent takeover [verified] |
| HTTPS | Enable "Enforce HTTPS" in Pages settings `[from-memory; GitHub doc page not fetched]` |

Choose the domain after the name decision (D-01). The domain/branding must not use or imply OpenCivics; public attribution is Benjamin Life (@omniharmonic). With an Actions-based deployment the domain is set in Pages settings; a `CNAME` file in the artifact is not the mechanism `[from-memory]`.

### 8.4 If data outgrows Pages or traffic spikes

| Trigger | Action |
|---|---|
| Site approaches 500 MB, or one file > 25 MB | Move heavy layers (PMTiles for parcels, fallback basemap) to **Cloudflare R2** and reference them by URL; keep HTML on Pages. R2 free tier: 10 GB-month storage, 1M Class A and 10M Class B operations per month; no charge for egress through Workers, S3 API, or r2.dev [verified, Cloudflare R2 pricing page]. PMTiles on R2: set CORS to allow the site origin, methods GET and HEAD, request headers `range` and `if-match`, expose `etag`; each range request counts as a GET operation [verified, Protomaps docs] |
| Bandwidth nears 100 GB per month | Put **Cloudflare (free plan) in front** of the custom domain so its CDN absorbs repeat requests `[from-memory; confirm free-plan terms for proxied static traffic]`; or migrate the whole site to **Cloudflare Pages**: free plan allows 20,000 files per site, 25 MiB maximum per asset, 500 builds per month, 1 concurrent build [verified]. The 1,000-page site is well under 20,000 files; keep single files under 25 MiB (ADR-011) so migration is a hosting change, not a rework |
| Need server code (NLD relay) | Cloudflare Worker (Free: 100,000 requests/day, 10 ms CPU per request [verified, E3]), only after NLD permission |
| Pages policy question | Move to Cloudflare Pages, Netlify, or similar static host `[from-memory; not researched]`; the static architecture is host-neutral |

### 8.5 Cost summary [owner to price the non-technical items]

| Item | Cost at launch |
|---|---|
| GitHub Pages hosting (public repo) | $0 |
| Domain | Annual registrar fee (small) |
| Basemap (OpenFreeMap public instance) | $0; consider a voluntary donation to the project since it runs on donations (E3) |
| Cloudflare (R2/Worker/Pages) | $0 within free tiers; only if needed |
| Analytics | $0 (none) |
| CI minutes | $0 for public repos `[from-memory]`; private repos use plan minutes |
| **Real costs** | Paid tribal advisory time (G3 s.3.1 item 4: advisory time is compensated), legal review (federal Indian law reviewer; charitable-solicitation question, F4), accessibility audit with disabled testers, any outside translation. Scope and budget are owner decisions (D-07, D-08) |

## Sources

Fetched 2026-10-16: GitHub Pages limits; GitHub custom workflow doc; GitHub custom domains doc; Cloudflare R2 pricing; Cloudflare Pages limits; Protomaps PMTiles cloud-storage doc (see J1 Sources for URLs). Project inputs: E2, E3, F4 s.6.4, G2, G3 s.3, s.7, s.12.

## Confidence & Gaps

Confidence: medium. Workflow YAML is a sketch for the coding agent to adapt to current action versions and Astro scripts; it has not been run. Not verified: Dependabot cooldown syntax, Cloudflare free-plan terms for proxying static traffic, HTTPS enforcement steps, whether Pages compresses `.json` and serves range requests, per-file limits on Pages, CI-minute policy for public repos.
