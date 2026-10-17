#!/usr/bin/env python3
"""
merge_nations_beyond.py  -  nations beyond the federal list (research wave 3, 2026-10-17)
Author: Benjamin Life (@omniharmonic)

The federal list is contested by many communities it leaves out. This merges two sourced research
files into crosswalks/nations-beyond-federal-list.csv (one row per sourced fact):

    out-state.csv          state-recognized tribes, confirmed on each state's own source
    out-unrecognized.csv   communities with a documented treaty, claims, court or termination
                           record, or a documented federal acknowledgment petition

Rules:
- Only high and medium confidence rows are imported. Low rows (a community's own site or news only)
  are written to crosswalks/nations-beyond-federal-list-held.csv for a person to review.
- Present-day communities get nat-pd- ids. If research used the id of a historical treaty party,
  a nat-pd- id is made and the historical party becomes a predecessor link.
- Disputed pairs (two organizations claiming one people) are kept as separate rows; nothing is
  merged or ranked.

Run:  python3 scripts/merge_nations_beyond.py <research-folder>
"""

import csv
import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_graph as bg  # noqa: E402

FIELDS = ["nation_id", "name", "recognition_status", "recognition_detail", "state_or_region", "recognition_year",
          "criteria", "website", "source_url", "evidence_quote", "second_source_url", "second_evidence_quote",
          "related_ids", "disputed_with", "confidence", "notes", "research_batch"]


def slug(text):
    t = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:60].strip("-")


def main(folder):
    folder = Path(folder)
    entities = {r["nation_id"]: r for r in bg.read_csv(bg.XWALK / "nation-entities.csv")}
    federal = {r["nation_id"] for r in bg.read_csv(bg.XWALK / "federally-recognized-tribes.csv")}
    rows, held = [], []

    def fix_id(nid, name, related):
        nid = nid.strip()
        if nid in federal or (nid in entities and entities[nid]["entity_kind"] == "present_day_government"):
            return nid, related
        if nid.startswith("nat-pd-"):
            return nid, related
        # a historical or umbrella id used for a present-day community: make a nat-pd- id
        if nid in entities:
            related = ";".join(x for x in [related, nid] if x)
        return f"nat-pd-{slug(name)}", related

    state_path = folder / "out-state.csv"
    if state_path.exists():
        for r in csv.DictReader(state_path.open(encoding="utf-8")):
            nid, related = fix_id(r["nation_id"], r["name"], "")
            row = {
                "nation_id": nid, "name": r["name"].strip(), "recognition_status": r["recognition_status"].strip(),
                "recognition_detail": r["recognition_basis"].strip(), "state_or_region": r["state"].strip(),
                "recognition_year": r["recognition_year"].strip(), "criteria": "state", "website": r["tribe_website"].strip(),
                "source_url": r["source_url"].strip(), "evidence_quote": r["evidence_quote"].strip(),
                "second_source_url": "", "second_evidence_quote": "", "related_ids": related, "disputed_with": "",
                "confidence": r["confidence"].strip(), "notes": r["notes"].strip(), "research_batch": "state",
            }
            (rows if row["confidence"] in ("high", "medium") else held).append(row)

    un_path = folder / "out-unrecognized.csv"
    if un_path.exists():
        for r in csv.DictReader(un_path.open(encoding="utf-8")):
            nid, related = fix_id(r["nation_id"], r["name"], r["predecessor_or_related_ids"].strip())
            disputed = ";".join(re.findall(r"disputed:\s*(nat-[a-z0-9-]+)", r["notes"]))
            row = {
                "nation_id": nid, "name": r["name"].strip(), "recognition_status": r["recognition_status"].strip(),
                "recognition_detail": r["criterion_detail"].strip(), "state_or_region": r["state_or_region"].strip(),
                "recognition_year": "", "criteria": r["criterion"].strip(), "website": r["community_website"].strip(),
                "source_url": r["source_url"].strip(), "evidence_quote": r["evidence_quote"].strip(),
                "second_source_url": r["second_source_url"].strip(), "second_evidence_quote": r["second_evidence_quote"].strip(),
                "related_ids": related, "disputed_with": disputed, "confidence": r["confidence"].strip(),
                "notes": r["notes"].strip(), "research_batch": "unrecognized",
            }
            (rows if row["confidence"] in ("high", "medium") else held).append(row)

    # one id per name: rows for the same community from both files share the first id seen
    by_name = {}
    for row in rows:
        key = slug(row["name"])
        by_name.setdefault(key, row["nation_id"])
        if row["nation_id"].startswith("nat-pd-") and row["nation_id"] not in federal and row["nation_id"] not in entities:
            row["nation_id"] = by_name[key]
    rows.sort(key=lambda r: (r["nation_id"], r["research_batch"], r["source_url"]))
    held.sort(key=lambda r: (r["nation_id"], r["research_batch"]))
    for path, data in ((bg.XWALK / "nations-beyond-federal-list.csv", rows),
                       (bg.XWALK / "nations-beyond-federal-list-held.csv", held)):
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=FIELDS)
            w.writeheader()
            w.writerows(data)
    print(f"nations-beyond-federal-list.csv: {len(rows)} rows, {len({r['nation_id'] for r in rows})} nations; "
          f"held for review: {len(held)}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
