#!/usr/bin/env python3
"""
merge_royce.py  -  what each of Royce's Schedule entries did to each mapped area
Author: Benjamin Life (@omniharmonic)

The Forest Service layer gives every Royce area the dates Royce lists, but not what each entry did:
an early treaty often only described a nation's territory, a later one ceded it, and some areas are
reservations the nation kept. Research agents read Royce's Schedule (BAE 18th Annual Report, part 2,
1899; full text on archive.org) for each area and quoted the entry.

Input: out-royce-*.jsonl (one object per area: id, entries[{date, role, instrument_id, quote, page}],
ceded_by, summary, confidence, note).
Output: crosswalks/royce-entry-roles.csv, one row per entry, with the area's status:
  ceded   - an entry ceded the land (ceded_by = its date)
  taken   - no cession, but the United States restored reservation land to the public domain
            (role "retroceded"); taken_by = that date
  kept    - Royce records the area as a reservation the nation kept (as of 1894)
  unclear - none of the above is certain (e.g. claimed land taken without a treaty); dated as unchecked
Low-confidence areas are written but ignored by the emit stage.

Run:  python3 scripts/merge_royce.py <dir with out-royce-*.jsonl>
"""

import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "crosswalks" / "royce-entry-roles.csv"
ROLES = {"ceded", "ceded_part", "described_or_recognized", "reserved", "confirmed", "retroceded", "us_reserved", "other"}
FIELDS = ["id", "date", "role", "instrument_id", "quote", "page", "status", "ceded_by", "taken_by",
          "summary", "confidence", "note"]
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def main(src):
    nodes = {n["id"]: n for n in json.load(open(ROOT / "build" / "nodes.json"))["nodes"]}
    rows, areas, skipped = [], set(), []
    for f in sorted(Path(src).glob("out-royce-*.jsonl")):
        for line in f.read_text(encoding="utf-8").splitlines():
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            gid = o.get("id", "")
            if gid not in nodes or gid in areas:
                skipped.append((f.name, gid or "?", "unknown or duplicate id"))
                continue
            entries = [e for e in o.get("entries") or [] if DATE.match(str(e.get("date", ""))) and e.get("role") in ROLES]
            if not entries:
                skipped.append((f.name, gid, "no usable entries"))
                continue
            areas.add(gid)
            ceded_by = o.get("ceded_by") if DATE.match(str(o.get("ceded_by") or "")) else ""
            taken = sorted(e["date"] for e in entries if e["role"] == "retroceded")
            # "kept" only when every entry reserves, confirms or describes the land; an "other" entry
            # (e.g. claimed land taken without a treaty) is left unchecked rather than guessed
            keeps = all(e["role"] in ("reserved", "confirmed", "described_or_recognized") for e in entries)
            status = "ceded" if ceded_by else ("taken" if taken else ("kept" if keeps else "unclear"))
            for e in sorted(entries, key=lambda e: e["date"]):
                inst = e.get("instrument_id") or ""
                rows.append({
                    "id": gid, "date": e["date"], "role": e["role"],
                    "instrument_id": inst if inst in nodes else "",
                    "quote": re.sub(r"\s+", " ", str(e.get("quote") or "")).strip(),
                    "page": str(e.get("page") or ""), "status": status, "ceded_by": ceded_by,
                    "taken_by": taken[0] if status == "taken" else "",
                    "summary": re.sub(r"\s+", " ", str(o.get("summary") or "")).strip(),
                    "confidence": o.get("confidence") if o.get("confidence") in ("high", "medium", "low") else "low",
                    "note": re.sub(r"\s+", " ", str(o.get("note") or "")).strip(),
                })
    rows.sort(key=lambda r: (int(re.sub(r"\D", "", r["id"]) or 0), r["id"], r["date"]))
    with OUT.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    by = {}
    for r in {r["id"]: r for r in rows}.values():
        by[(r["status"], r["confidence"])] = by.get((r["status"], r["confidence"]), 0) + 1
    print(f"{OUT.relative_to(ROOT)}: {len(areas)} areas, {len(rows)} entries;", dict(sorted(by.items())))
    for s in skipped:
        print("skipped:", *s)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
