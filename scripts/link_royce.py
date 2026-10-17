#!/usr/bin/env python3
"""
link_royce.py  -  Royce cession <-> instrument crosswalk (J5 P1-10)
Author: Benjamin Life (@omniharmonic)

Reads data/derived/cession-events.json (from `npm run data:geometry`) and the treaty seeds,
and writes crosswalks/instrument-royce.csv: one row per (cession, Royce Schedule date) that
matches an instrument.

    status = proposed   two independent keys agree: the Royce Schedule date equals the
                        instrument's date signed, AND at least one nation named in the Royce
                        Schedule matches a nation named in the instrument's party text
    status = candidate  only the date agrees (one key)

Nothing is ever written as accepted: only a human reviewer accepts a link (npm run links:review).
Rows a human has already decided (status accepted or rejected) are kept as they are on reruns.

Run:  python3 scripts/link_royce.py
"""

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_graph as bg  # noqa: E402  (reuses the alias index and helpers)

ROOT = bg.ROOT
EVENTS = ROOT / "data" / "derived" / "cession-events.json"
OUT = bg.XWALK / "instrument-royce.csv"
FIELDS = ["cessnum", "date_n", "cession_date", "instrument_id", "status", "match_keys",
          "nations_overlap", "basis", "reviewer_role", "review_date", "notes"]


def instruments(data):
    """Every instrument with a date signed and a party text: treaty seeds first, then NARA rows."""
    out = {}
    for r in data["treaties-seed.csv"]:
        if r["date_signed"].strip():
            out[r["id"]] = {"id": r["id"], "date": r["date_signed"].strip(), "parties": r["nations"]}
    for r in data["nara-ratified-treaties-index.csv"]:
        iid = bg.rit_to_id(r["nara_rit_no"])
        if iid not in out and r["date_signed"].strip():
            out[iid] = {"id": iid, "date": r["date_signed"].strip(),
                        "parties": bg.party_text(r["nations_and_place_per_nara"])}
    return out


def main():
    if not EVENTS.exists():
        print("data/derived/cession-events.json is missing. Run `npm run data:geometry` first.")
        return 1
    data, cross = bg.load_all()
    alias = bg.AliasIndex(cross["nation-aliases.csv"] + bg.research_alias_rows(cross))
    insts = instruments(data)
    by_date = defaultdict(list)
    for i in insts.values():
        by_date[i["date"]].append(i)

    kept = {}
    if OUT.exists():
        for r in bg.read_csv(OUT):
            if r["status"] in ("accepted", "rejected"):
                kept[(r["cessnum"], r["date_n"], r["instrument_id"])] = r

    rows = []
    unmatched = 0
    for ev in json.loads(EVENTS.read_text(encoding="utf-8")):
        sched = {nid for name in ev["tribes_as_named_in_schedule"] for nid, _, _ in alias.find(name)}
        for d in ev["dates"]:
            cands = by_date.get(d["date"], [])
            if not cands:
                unmatched += 1
                continue
            for inst in cands:
                parties = {nid for nid, _, _ in alias.find(inst["parties"])}
                overlap = sorted(sched & parties)
                if len(cands) > 1 and not overlap:
                    continue  # several instruments that day and no shared nation: no basis to pick
                key = (ev["cessnum"], str(d["n"]), inst["id"])
                if key in kept:
                    rows.append(kept.pop(key))
                    continue
                status = "proposed" if overlap else "candidate"
                rows.append({
                    "cessnum": ev["cessnum"], "date_n": str(d["n"]), "cession_date": d["date"],
                    "instrument_id": inst["id"], "status": status,
                    "match_keys": "date+nation" if overlap else "date",
                    "nations_overlap": ";".join(overlap),
                    "basis": f"Royce Schedule date {d['date']} equals date signed" + (
                        f"; shared nation(s) {', '.join(overlap)}" if overlap else "; only instrument signed that day"),
                    "reviewer_role": "", "review_date": "", "notes": "",
                })
    rows.extend(kept.values())  # human decisions on rows that no longer match automatically
    rows.sort(key=lambda r: (int("".join(c for c in r["cessnum"] if c.isdigit()) or 0), r["cessnum"], r["date_n"], r["instrument_id"]))
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    counts = defaultdict(int)
    for r in rows:
        counts[r["status"]] += 1
    cessions = {r["cessnum"] for r in rows}
    instruments_linked = {r["instrument_id"] for r in rows}
    print(f"wrote {OUT.relative_to(ROOT)}: {len(rows)} rows ({dict(counts)}); "
          f"{len(cessions)} cessions and {len(instruments_linked)} instruments linked; "
          f"{unmatched} cession dates with no instrument signed that day")
    return 0


if __name__ == "__main__":
    sys.exit(main())
