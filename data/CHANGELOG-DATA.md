# Data changelog

Every edit to `seed-data/` or `crosswalks/`, newest first. Columns: date, file, row id, field, old, new, source, who.

The 2026-10-16 verification corrections are recorded in `verification/CORRECTIONS-APPLIED.md` (the backups that file mentions in `verification/originals/` are lost).

| Date | File | Row | Field | Old | New | Source | Who |
|---|---|---|---|---|---|---|---|
| 2026-10-17 | seed-data/organizations-seed.csv | org-wsdp | website, vetting_notes | website: `(wsdp.org does not currently serve the organization's content)` | website blank; note appended to vetting_notes as "Website: ..." | no source change (moved, not altered) | coding agent |
| 2026-10-17 | seed-data/organizations-seed.csv | org-kai-poma | website, vetting_notes | website: `(kaipoma.org is a "coming soon" placeholder as of 2026-10-16; no official site found; do not render as a link)` | website blank; note appended to vetting_notes as "Website: ..." | no source change (moved, not altered) | coding agent |
| 2026-10-17 | seed-data/organizations-seed.csv | org-indian-canyon | website, vetting_notes | website: `(indiancanyon.org did not serve the band's content)` | website blank; note appended to vetting_notes as "Website: ..." | no source change (moved, not altered) | coding agent |
| 2026-10-17 | seed-data/geodata-sources.csv | GEO-022 | url, notes | url: `(none verified; ask each nation)` | url blank; text appended to notes | no source change (moved) | coding agent |
| 2026-10-17 | crosswalks/nation-entities.csv | nat-pd-southern-sierra-miwuk | federal_recognition | per_seed_tribal_government | per_seed_not_federally_recognized | https://www.southernsierramiwuknation.org/ ("have petitioned for federal acknowledgment"); not in 91 FR 4102 | coding agent (from research batch C) |
