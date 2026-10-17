#!/usr/bin/env python3
"""
merge_narratives.py  -  sourced summaries of federal records, written by research agents
Author: Benjamin Life (@omniharmonic)

Input: JSONL files from the narrative research wave (one object per record: id, headline,
narrative, sources [{url, title, quote}], confidence, cautions, and for treaties how, how_basis,
acres_text), plus out-story.json (map chapters and moments).

Output: data/overlays/<kind>/<id>.md (ai_assisted: true) and data/story.json. Only records of
federal-record types are written (treaties, cases, violations); a nation's own story is never
written here. A record needs a narrative and at least one source URL, or it is skipped.
Re-running replaces files this script wrote earlier (written_by: narrative-wave-2026-10) and
never touches hand-written overlays.

Run:  python3 scripts/merge_narratives.py <dir with out-*.jsonl and out-story.json>
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OVERLAYS = ROOT / "data" / "overlays"
TAG = "narrative-wave-2026-10"
KEPT = {"kept", "broken", "partly", "unknown"}
KIND = {"Instrument": "instruments", "Case": "cases", "Violation": "violations", "Statute": "statutes",
        "Doctrine": "doctrine", "PolicyEra": "eras", "Campaign": "returns", "Organization": "organizations"}
HOW = {"treaty", "pressure", "removal", "congress", "executive", "unknown"}


def front(d):
    # JSON is valid YAML; it keeps quotes, colons and newlines safe.
    return "\n".join(f"{k}: {json.dumps(v, ensure_ascii=False)}" for k, v in d.items() if v not in (None, "", []))


def ours(path):
    return path.exists() and f'written_by: "{TAG}"' in path.read_text(encoding="utf-8")


def main(src):
    src = Path(src)
    types = {n["id"]: n["type"] for n in json.load(open(ROOT / "build" / "nodes.json"))["nodes"]}
    written, skipped = {}, []
    for f in sorted(p for p in src.glob("out-*.jsonl") if not p.name.startswith("out-royce")):
        for line in f.read_text(encoding="utf-8").splitlines():
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue  # a file still being written
            rid = o.get("id", "")
            kind = KIND.get(types.get(rid, ""))
            sources = [s for s in o.get("sources") or [] if isinstance(s, dict) and str(s.get("url", "")).startswith("http")]
            if not kind or not str(o.get("narrative", "")).strip() or not sources:
                skipped.append((f.name, rid or "?", "unknown id" if not kind else "no narrative or sources"))
                continue
            path = OVERLAYS / kind / f"{rid}.md"
            if path.exists() and not ours(path):
                skipped.append((f.name, rid, "hand-written overlay kept"))
                continue
            cautions = " ".join(x for x in [o.get("cautions") or "", o.get("acres_text") and f"Acreage: {o['acres_text']}"] if x)
            meta = {
                "id": rid,
                "ai_assisted": True,
                "written_by": TAG,
                "headline": (o.get("headline") or "").strip(),
                "how": o.get("how") or None,
                "how_basis": o.get("how_basis") or None,
                "confidence": o.get("confidence") if o.get("confidence") in ("high", "medium", "low") else None,
                "cautions": cautions.strip() or None,
                "sources": [{k: s[k] for k in ("url", "title", "quote") if s.get(k)} for s in sources],
                "verdict": o.get("verdict") or None,
                "promises": [
                    {k: p[k] for k in ("article", "promise", "kept", "evidence_url", "evidence_quote") if p.get(k)}
                    for p in (o.get("promises") or [])
                    if isinstance(p, dict) and p.get("promise") and p.get("kept") in KEPT
                ] if kind == "instruments" else None,
            }
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f"---\n{front(meta)}\n---\n{o['narrative'].strip()}\n", encoding="utf-8")
            written[kind] = written.get(kind, 0) + 1
    story = src / "out-story.json"
    if story.exists():
        s = json.loads(story.read_text(encoding="utf-8"))
        for item in s.get("chapters", []) + s.get("moments", []):
            for k in ("verdict", "problems_found"):
                item.pop(k, None)
        for m in s.get("moments", []):
            if m.get("how") not in HOW:
                m["how"] = None
        (ROOT / "data" / "story.json").write_text(json.dumps(s, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"data/story.json: {len(s.get('chapters', []))} chapters, {len(s.get('moments', []))} moments")
    issues = []
    for f in sorted(src.glob("out-*.jsonl")):
        for line in f.read_text(encoding="utf-8").splitlines():
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            for i in o.get("page_fact_issues") or []:
                if isinstance(i, dict) and i.get("url"):
                    issues.append({"id": o.get("id"), **i})
    if issues:
        out = ROOT / "docs" / "review" / "page-fact-issues.json"
        out.write_text(json.dumps(issues, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"{len(issues)} page-fact issues -> {out.relative_to(ROOT)}")
    print("overlays written:", written)
    for x in skipped:
        print("skipped:", *x)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
