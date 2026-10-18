# Data changelog

Every edit to `seed-data/` or `crosswalks/`, newest first. Columns: date, file, row id, field, old, new, source, who.

The 2026-10-16 verification corrections are recorded in `verification/CORRECTIONS-APPLIED.md` (the backups that file mentions in `verification/originals/` are lost).

| Date | File | Row | Field | Old | New | Source | Who |
|---|---|---|---|---|---|---|---|
| 2026-10-18 | crosswalks/royce-area-plain.csv (new) | 675 areas | plain | (none) | plain-language rewrite of each area's Royce summary, no new facts | crosswalks/royce-entry-roles.csv summary and quotes | coding agent |
| 2026-10-18 | crosswalks/return-locations.csv (new) | 42 land returns | lat, lng, precision, place, basis_url | (none) | approximate point per return; sacred sites at county-seat precision only; 11 not placed | basis_url per row | coding agent |
| 2026-10-18 | data/overlays/* | 524 overlays | note (new) | (none) | short reader-facing note drawn only from each overlay's own cautions, narrative and sources | the overlay's own sources | coding agent |
| 2026-10-18 | data/overlays/* | 200+ overlays | narrative, how_basis | research-process sentences ("this record did not read...", "sources opened") | reader-voice wording or removed; no facts added | unchanged | coding agent |
| 2026-10-18 | data/overlays/instruments/TLA-T-109.md | TLA-T-109 | headline | "ceded some six million acres" | "ceded a large part of central Michigan's Saginaw region" | treaty text states no total; 6M is what Cass proposed (MSU) | coding agent |
| 2026-10-18 | data/overlays/doctrine/doctrine-plenary-power.md | narrative | sentence | "such as VAWA, which Lara's reasoning allows" | "in United States v. Lara the Court relied on it to uphold a law that restored tribal powers" | Lara (2004) per the overlay's sources | coding agent |
| 2026-10-18 | data/overlays/doctrine/doctrine-preemption.md | narrative | sentence | "and it sometimes favors states" | removed | no cited case supports it | coding agent |
| 2026-10-18 | data/overlays/organizations/org-siletz-ctsi.md | headline | | "bought ... in 2026" | "was on its way to being returned" | the only source (OPB) | coding agent |
| 2026-10-18 | data/overlays/violations/V056.md | headline | | "fishing and gathering rights" | "fishing rights" | only fishing is supported by the treaty summary cited | coding agent |
| 2026-10-18 | data/overlays/organizations/org-santa-ynez-chumash.md | headline, narrative | | "Interior placed about 1,427 acres in trust on January 20, 2017" | 2017 decision voided by a court; 2019 NDAA directed trust, per the Band | camp-santa-ynez-camp4 sources (Noozhawk; Band release) | coding agent |
| 2026-10-18 | data/overlays/organizations/org-esselen-tribe.md | note | | "neither transfer confirmed" | Adler Ranch transfer completed July 2020 per Western Rivers Conservancy | camp-esselen-adler-2020 source | coding agent |
| 2026-10-17 | seed-data/organizations-seed.csv | org-wsdp | website, vetting_notes | website: `(wsdp.org does not currently serve the organization's content)` | website blank; note appended to vetting_notes as "Website: ..." | no source change (moved, not altered) | coding agent |
| 2026-10-17 | seed-data/organizations-seed.csv | org-kai-poma | website, vetting_notes | website: `(kaipoma.org is a "coming soon" placeholder as of 2026-10-16; no official site found; do not render as a link)` | website blank; note appended to vetting_notes as "Website: ..." | no source change (moved, not altered) | coding agent |
| 2026-10-17 | seed-data/organizations-seed.csv | org-indian-canyon | website, vetting_notes | website: `(indiancanyon.org did not serve the band's content)` | website blank; note appended to vetting_notes as "Website: ..." | no source change (moved, not altered) | coding agent |
| 2026-10-17 | seed-data/geodata-sources.csv | GEO-022 | url, notes | url: `(none verified; ask each nation)` | url blank; text appended to notes | no source change (moved) | coding agent |
| 2026-10-17 | crosswalks/nation-entities.csv | nat-pd-southern-sierra-miwuk | federal_recognition | per_seed_tribal_government | per_seed_not_federally_recognized | https://www.southernsierramiwuknation.org/ ("have petitioned for federal acknowledgment"); not in 91 FR 4102 | coding agent (from research batch C) |
| 2026-10-17 | seed-data/organizations-seed.csv | org-six-nations-iroquois-cultural-center | confidence, vetting_notes | medium | low; link-check note appended | scripts/check-links.mjs: www.sixnationsmuseum.org ENOTFOUND | coding agent |
| 2026-10-17 | (graph build) | 21 records | see crosswalks/record-corrections.csv | as listed (kept as <field>_as_listed) | corrected value | source URL and verbatim quote per row (wave-2 source verification) | coding agent |
| 2026-10-17 | crosswalks/nation-link-overrides.csv | TLA-T-068, TLA-T-142, TLA-T-023 | party_to | Makah (from title) / Miami missing | Omaha (text names Mahas) / Miami added | OSU treaty text (wave-2 verification) | coding agent |
