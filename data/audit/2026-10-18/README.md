# Source audit, 2026-10-18

Six research agents re-checked every overlay (treaties, cases, statutes, violations, doctrine, eras, land returns, organizations), the map story (`data/story.json`) and the return locations against their cited sources, and looked for duplicates and misidentified nations across the dataset. They opened every cited URL (about 1,700 distinct) and checked every quoted passage; none were dead.

Each `.jsonl` file holds one proposal per line: the file and field, the exact old text, the new text, the reason, and the evidence (URL and verbatim quote). Proposals were applied by script and reviewed by hand; 1,016 were applied. Not applied:

- `TLA-T-230`: the proposed source (a 2017 New York State Senate resolution) could only be partly read, and its date framing could not be confirmed.
- The proposal to re-key `TLA-T-044` / `TLA-T-045` (Fort Industry, 1805): the National Archives catalog records do not say which of the two documents is the U.S. treaty. Both pages now say only what is confirmed: the U.S. treaty refers to a second treaty with the Connecticut land companies signed the same day.
- `flag` lines, which ask for an owner decision. They are listed in the change log entry for this date.

Never fetched: native-land.ca.
