# Contributing

Thank you for helping. This is a plain-language guide; a fuller version comes at the end of Phase 1.

- **Report an error:** open an issue and say which page or record, what is wrong, and a source that shows it.
- **Tribal nations and their offices:** if a page concerns your nation and you want it changed or removed, say so in an issue or by email to the maintainer. A removal request is honored first and discussed second.
- **Data edits:** the tables in `seed-data/` and `crosswalks/` are the source. Change the row, add a line to `data/CHANGELOG-DATA.md`, and run `npm run data:build && npm run data:validate`.
- **Code:** run `npm run lint && npm run typecheck && npm run test:unit` before opening a pull request.

Every claim needs a source. Do not add facts from memory.
