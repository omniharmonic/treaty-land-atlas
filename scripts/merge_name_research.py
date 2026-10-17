#!/usr/bin/env python3
"""
merge_name_research.py  -  fold sourced name and successor research into the crosswalks
Author: Benjamin Life (@omniharmonic)

Input: a folder of research CSVs (out-*-names.csv, out-*-successors.csv) written by research
agents on 2026-10-17. Every row carries a source URL and a short evidence quote that the agent
checked against the page it fetched.

Output (overwritten, so reruns are safe):
    crosswalks/nation-names.csv              one sourced name per row
    crosswalks/nation-successor-research.csv sourced successor proposals (all status=proposed)

Ids are normalized to the canonical present-day ids in crosswalks/federally-recognized-tribes.csv:
an agent's proposed id is replaced by the canonical id of the Federal Register entry it names.

Run:  python3 scripts/merge_name_research.py <research-folder>
"""

import csv
import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_graph as bg  # noqa: E402

NAME_FIELDS = ["nation_id", "name", "name_kind", "language_or_script", "source_url", "source_title",
               "evidence_quote", "confidence", "notes", "research_batch"]
SUCC_FIELDS = ["party_nation_id", "present_nation_id", "extent", "status", "basis_ref", "disputed",
               "evidence_quote", "confidence", "notes", "research_batch"]
NAME_KINDS = {"endonym", "official_name", "exonym", "historical_spelling", "common_english", "related_people"}


def norm(s):
    s = re.sub(r"[—–]|--", " ", s or "")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower().replace("&", "and")
    s = re.sub(r"\(previously listed as[^)]*\)", "", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def main(folder):
    folder = Path(folder)
    fr = bg.read_csv(bg.XWALK / "federally-recognized-tribes.csv")
    entities = {r["nation_id"] for r in bg.read_csv(bg.XWALK / "nation-entities.csv")}
    canonical = {r["nation_id"] for r in fr} | entities
    by_name = {}
    for r in fr:
        by_name[norm(r["official_name"])] = r["nation_id"]
        if r["previously_listed_as"]:
            by_name[norm(r["previously_listed_as"])] = r["nation_id"]

    def lookup(name):
        n = norm(name)
        if n in by_name:
            return by_name[n]
        hits = {v for k, v in by_name.items() if k.startswith(n + " ") or n.startswith(k + " ")}
        return hits.pop() if len(hits) == 1 else None

    # agent id -> canonical id, learned from rows that pair an id with an official name
    remap = {}
    names_in, succ_in = [], []
    for f in sorted(folder.glob("out-*-names.csv")):
        batch = f.name.split("-")[1]
        for r in csv.DictReader(f.open(encoding="utf-8")):
            r["research_batch"] = batch
            names_in.append(r)
            if r["name_kind"] == "official_name" and r["nation_id"].startswith("nat-pd-"):
                hit = lookup(r["name"])
                if hit:
                    remap.setdefault(r["nation_id"], hit)
    for f in sorted(folder.glob("out-*-successors.csv")):
        batch = f.name.split("-")[1]
        for r in csv.DictReader(f.open(encoding="utf-8")):
            r["research_batch"] = batch
            succ_in.append(r)
            pid = r["present_nation_id"].strip()
            hit = lookup(r["present_official_name"]) if r["present_official_name"].strip() else None
            if pid and hit:
                remap.setdefault(pid, hit)

    def canon(nid):
        nid = (nid or "").strip()
        if nid in remap:
            return remap[nid]
        return nid if nid in canonical else None

    names, dropped = [], []
    seen = set()
    for r in names_in:
        nid = canon(r["nation_id"])
        if not nid or r["name_kind"] not in NAME_KINDS or not r["source_url"].startswith("http") or not r["name"].strip():
            dropped.append((r["research_batch"], r["nation_id"], r["name"], "unknown id, kind or source"))
            continue
        name = unicodedata.normalize("NFC", r["name"].strip())
        key = (nid, name, r["name_kind"])
        if key in seen:
            continue
        seen.add(key)
        names.append({**{k: unicodedata.normalize("NFC", (r.get(k) or "").strip()) for k in NAME_FIELDS},
                      "nation_id": nid, "name": name})
    names.sort(key=lambda r: (r["nation_id"], r["name_kind"], r["name"]))

    # Rows written from a present-day government's own history page name the historical party in
    # notes ("Historical party as written in source: \"Mouache\" band"). Resolve that text with the
    # alias index, keeping only historical treaty-party identities.
    kinds = {r["nation_id"]: r["entity_kind"] for r in bg.read_csv(bg.XWALK / "nation-entities.csv")}
    # Uses the names already merged (run twice after new research: the first pass writes the
    # names, the second resolves predecessor text against them).
    _, cross = bg.load_all()
    alias = bg.AliasIndex(cross["nation-aliases.csv"] + bg.research_alias_rows(cross))
    expanded = []
    for r in succ_in:
        if r["party_nation_id"].strip():
            expanded.append(r)
            continue
        m = re.search(r"Historical part(?:y|ies)[^:]*:\s*(.*)", r["notes"])
        text = m.group(1) if m else ""
        quoted = re.findall(r'"([^"]+)"', text)
        text = " ; ".join(quoted) if quoted else re.split(r"[.(]", text)[0]
        hits = {nid for nid, _, _ in alias.find(text)
                if kinds.get(nid) in ("historical_party", "peoples_or_confederacy", "community_or_band")}
        for nid in sorted(hits):
            expanded.append({**r, "party_nation_id": nid,
                             "notes": (r["notes"] + " [party resolved from this text by alias match]").strip()})
        if not hits:
            dropped.append((r["research_batch"], r["present_nation_id"], text[:60], "predecessor text matched no historical party"))
    succ_in = expanded

    succ, seen = [], set()
    for r in succ_in:
        party = canon(r["party_nation_id"])
        present = canon(r["present_nation_id"]) or (lookup(r["present_official_name"]) if r["present_official_name"].strip() else None)
        if not party or not present or not present.startswith("nat-pd-") or party == present:
            if r["party_nation_id"].strip():
                dropped.append((r["research_batch"], r["party_nation_id"], r["present_nation_id"] or r["present_official_name"],
                                "successor row: unknown id or not a present-day government"))
            continue
        if (party, present) in seen:
            continue
        seen.add((party, present))
        notes = r["notes"].strip()
        disputed = "true" if re.search(r"disput|object", notes, re.I) else "false"
        succ.append({"party_nation_id": party, "present_nation_id": present,
                     "extent": r["extent"] if r["extent"] in ("full", "partial", "unknown") else "unknown",
                     "status": "proposed", "basis_ref": r["source_url"].strip(), "disputed": disputed,
                     "evidence_quote": r["evidence_quote"].strip(), "confidence": r["confidence"].strip(),
                     "notes": notes, "research_batch": r["research_batch"]})
    succ.sort(key=lambda r: (r["party_nation_id"], r["present_nation_id"]))

    with (bg.XWALK / "nation-names.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=NAME_FIELDS)
        w.writeheader()
        w.writerows(names)
    with (bg.XWALK / "nation-successor-research.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=SUCC_FIELDS)
        w.writeheader()
        w.writerows(succ)
    print(f"nation-names.csv: {len(names)} rows; nation-successor-research.csv: {len(succ)} rows; "
          f"{len(remap)} agent ids mapped to canonical ids; {len(dropped)} rows dropped")
    for d in dropped:
        print("  dropped:", " | ".join(d))
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
