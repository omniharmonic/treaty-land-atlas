# These CSVs are the editable source

The tables in this folder are the source of truth for the graph. Everything in `build/` and `public/data/` is generated from them (plus `crosswalks/`).

- Edit them directly. Log every change in `data/CHANGELOG-DATA.md` (file, row id, field, old value, new value, source, date).
- Keep files UTF-8, Unicode NFC. Never strip diacritics or the ʻokina-style modifier letters in names.
- Do not rename this folder; the graph builder and the pipeline read it by name.
- Nothing here has been reviewed by a Native nation or a lawyer.
