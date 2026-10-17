#!/usr/bin/env python3
"""
merge_california_bands.py  -  bands named in the 18 unratified California treaties (1851-52)
Author: Benjamin Life (@omniharmonic)

Input: a research CSV (out-ca-bands.csv) listing each band as printed in the treaty texts
(Kappler vol. 4, read at treaties.okstate.edu), the people it belongs to where a source says so,
and present-day communities that carry its history. Every row has a source URL and a quote.

Output: crosswalks/california-treaty-bands.csv. Only high and medium confidence rows; treaty-level
summary rows are skipped (the band rows carry the detail). Band ids are nat-ca-<treaty letter>-<band>.

Run:  python3 scripts/merge_california_bands.py <out-ca-bands.csv>
"""

import csv
import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_graph as bg  # noqa: E402

# People or language group named in the research -> (node id, label). Existing ids are reused.
GROUPS = [
    (r"^(probably )?(southern sierra )?miwok", "nat-miwok", "Miwok"),
    (r"^western mono", "nat-western-mono", "Western Mono (Monache)"),
    (r"^yokuts", "nat-yokuts", "Yokuts"),
    (r"^patwin", "nat-patwin", "Patwin"),
    (r"^pomo", "nat-pomo", "Pomo"),
    (r"^yurok", "nat-yurok", "Yurok"),
    (r"^karuk", "nat-karuk", "Karuk"),
    (r"^maidu", "nat-maidu", "Maidu"),
    (r"^shasta", "nat-shasta", "Shasta"),
    (r"^chumash", "nat-chumash", "Chumash"),
    (r"^kitanemuk", "nat-kitanemuk", "Kitanemuk"),
    (r"^luise", "nat-luiseno", "Luiseno"),
    (r"^cahuilla", "nat-cahuilla", "Cahuilla"),
    (r"^serrano", "nat-serrano", "Serrano"),
    (r"^kumeyaay", "nat-kumeyaay", "Kumeyaay (Diegueno)"),
]
FIELDS = ["band_id", "instrument_id", "band_name_as_printed", "people_group_text", "group_id", "group_label",
          "present_day_ids", "source_url", "evidence_quote", "confidence", "notes"]


def slug(text):
    t = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:50].strip("-")


def main(src):
    nodes_ok = {r["nation_id"] for r in bg.read_csv(bg.XWALK / "nation-entities.csv")}
    nodes_ok |= {r["nation_id"] for r in bg.read_csv(bg.XWALK / "federally-recognized-tribes.csv")}
    nodes_ok |= {r["nation_id"] for r in bg.read_csv(bg.XWALK / "nations-beyond-federal-list.csv")}
    out, seen = [], set()
    for r in csv.DictReader(open(src, encoding="utf-8")):
        band = r["band_name_as_printed"].strip()
        if r["confidence"] not in ("high", "medium") or not band or band.startswith("["):
            continue
        letter = r["instrument_id"].rsplit("-", 1)[-1].lower()
        band_id = f"nat-ca-{letter}-{slug(band)}"
        if band_id in seen:
            continue
        seen.add(band_id)
        group_text = r["people_or_language_group"].strip()
        group_id, group_label = "", ""
        for pat, gid, glabel in GROUPS:
            if re.search(pat, group_text.lower()):
                group_id, group_label = gid, glabel
                break
        present = ";".join(p.strip() for p in r["present_day_ids"].split(";") if p.strip() in nodes_ok)
        out.append({"band_id": band_id, "instrument_id": r["instrument_id"].strip(), "band_name_as_printed": band,
                    "people_group_text": group_text, "group_id": group_id, "group_label": group_label,
                    "present_day_ids": present, "source_url": r["source_url"].strip(),
                    "evidence_quote": r["evidence_quote"].strip(), "confidence": r["confidence"].strip(),
                    "notes": r["notes"].strip()})
    out.sort(key=lambda x: (x["instrument_id"], x["band_id"]))
    with (bg.XWALK / "california-treaty-bands.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(out)
    print(f"california-treaty-bands.csv: {len(out)} bands; {sum(1 for x in out if x['group_id'])} with a people; "
          f"{sum(1 for x in out if x['present_day_ids'])} with a present-day link")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
