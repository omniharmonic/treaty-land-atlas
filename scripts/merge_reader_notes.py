#!/usr/bin/env python3
"""
merge_reader_notes.py  -  short reader-facing notes for overlays
Author: Benjamin Life (@omniharmonic)

An overlay's `cautions` are research notes written for maintainers ("this record did not read the
audit"). Pages show them only in a collapsed "How this was checked" section. A reader-facing `note`
(at most two sentences, drawn only from that overlay's own cautions, narrative and sources) is shown
beside the story when there is something a reader needs: sources disagree, a figure is an
organization's own claim, a name is easy to confuse.

Input: JSONL files of {id, note[, problem]}. Problems are printed for review, not applied.
Run:  python3 scripts/merge_reader_notes.py <dir with out-*.jsonl>
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OVERLAYS = ROOT / "data" / "overlays"


def main(src):
    by_id = {}
    for f in sorted(Path(src).glob("out-[0-9]*.jsonl")):
        for line in f.read_text(encoding="utf-8").splitlines():
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            by_id[o["id"]] = o
    files = {}
    for p in OVERLAYS.glob("*/*.md"):
        m = re.search(r'^id: "?([^"\n]+)"?$', p.read_text(encoding="utf-8"), re.M)
        if m:
            files[m.group(1)] = p
    written = 0
    for rid, o in by_id.items():
        p = files.get(rid)
        if not p:
            print("no overlay:", rid)
            continue
        text = p.read_text(encoding="utf-8")
        head, sep, body = text[4:].partition("\n---\n")
        lines = [l for l in head.splitlines() if not l.startswith("note: ")]
        note = re.sub(r"\s+", " ", o.get("note") or "").strip()
        if note:
            at = next((i + 1 for i, l in enumerate(lines) if l.startswith(("cautions: ", "headline: "))), len(lines))
            lines.insert(at, f"note: {json.dumps(note, ensure_ascii=False)}")
            written += 1
        p.write_text("---\n" + "\n".join(lines) + "\n---\n" + body, encoding="utf-8")
        if o.get("problem"):
            print("problem:", rid, "-", o["problem"])
    print(f"{written} notes written for {len(by_id)} records")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
