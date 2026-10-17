# Overlays

One Markdown file per graph node, at `data/overlays/<kind>/<node-id>.md`, for text that does not belong in a CSV cell: narrative, content warnings, a nation's own account, legal sign-off.

```markdown
---
id: TLA-T-369
ai_assisted: false
content_warnings: [violence]
legal_review:              # only after a legal reviewer signs off
  signed_off_on: 2026-11-01
  reviewer_role: federal_indian_law_reviewer
sources: [https://...]
---
Plain-language narrative here.
```

Narrative is published only when the node's review state allows it. A nation's own account is only ever text the nation supplied.
