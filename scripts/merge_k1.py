#!/usr/bin/env python3
"""
merge_k1.py  -  what the record says happened to each Royce area, with the evidence for it
Author: Benjamin Life (@omniharmonic)

K1 ("Beyond the Federal Record", docs/research/K1-beyond-the-federal-record.md) gives each Royce area
one primary land status and any number of defect flags (s.4), and lists massacres linked to land (s.6).
This script folds the research tables and every round of primary-source verification into the
crosswalks the build reads, so a research update needs no code change.

Inputs (docs/research/K1/data/):
  royce-status-proposals.csv         one row per Royce area (or proposed sub-area such as 426-N)
  beyond-federal-record-findings.csv every finding, with its evidence level
  massacre-sites.csv                 editorial list of massacre sites: names as nations use them,
                                     category, link kind (preceded / enforced / followed), death ranges,
                                     lat/lon only where a research row names several places, and
                                     show_quote=no where the verdict's quote is about something else
  verification/round<N>-<batch>.csv  verdicts per finding (finding_id, verification_status,
                                     verified_against, source_*, corrected_*); a later round
                                     overrides an earlier one, and a later batch file within a round
                                     overrides an earlier one
Area numbers are checked against data/derived/cession-events.json.

Outputs (crosswalks/):
  land-status.csv        royce_area, parent_area, land_status, evidence ..., one row per proposal
  land-status-flags.csv  royce_area, flag, evidence ..., one row per area and flag
  massacre-sites.csv     one row per site, coordinates generalized to 0.1 degree
  k1-findings.csv        every finding as shown (or why it is not shown)

Evidence shown to readers (decision log 2026-10-20):
  primary    "Primary source"       a verdict confirmed it (in whole or part) against a primary document
  scholarly  "Scholarly source"     a verdict confirmed it against scholarship or a secondary source
  reported   "Reported by <source>" not yet verified: single-source, book-only or unchecked
  oral_history "Oral history (published with permission)"  a nation's or community's published oral account
  disputed   "Disputed"             the research marks it contested and no verdict confirmed it
  unsupported (not shown as a flag) a verdict found it contradicted or not supported

Run:  python3 scripts/merge_k1.py [--k1-dir DIR] [--out-dir DIR] [--events FILE]
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

STATUSES = [
    "ceded_by_ratified_treaty",
    "ceded_by_agreement_with_consent_process",
    "taken_by_statute",
    "taken_by_executive_order",
    "taken_no_instrument",
    "unratified_treaty_area",
    "promised_reserved",
    "described_not_ceded",
    "contested",
]
# names used in the K1 research tables before the owner's decision of 2026-10-20
RENAMED = {
    "ceded_by_agreement_or_statute_with_consent_process": "ceded_by_agreement_with_consent_process",
    # Northwestern Bands of Shoshone v. United States, 324 U.S. 335 (1945): the 1863 treaties
    # described territory without recognizing title
    "recognized_not_ceded": "described_not_ceded",
}
FLAGS = [
    "duress_military", "duress_starvation", "hostages", "signatory_defect", "excluded_party",
    "intertribal_dispute", "bribery_fraud", "senate_amended_no_consent", "consent_threshold_not_met",
    "massacre_linked", "promise_broken", "icc_money_not_land", "judicially_found_taking",
    "trespass_before_cession", "rights_reserved", "payment_refused", "annuities_conditioned_on_assent",
]
# a finding's category (or secondary category) is evidence for this flag
CATEGORY_FLAG = {
    "DURESS_MILITARY": "duress_military",
    "DURESS_STARVATION": "duress_starvation",
    "HOSTAGE": "hostages",
    "SIGNATORY_ILLEGITIMATE": "signatory_defect",
    "EXCLUDED_PARTY": "excluded_party",
    "INTERTRIBAL_DISPUTE": "intertribal_dispute",
    "BRIBERY_FRAUD_FORGERY": "bribery_fraud",
    "SENATE_AMENDED_NO_CONSENT": "senate_amended_no_consent",
    "MASSACRE": "massacre_linked",
    "LAND_PROMISED_THEN_TAKEN": "promise_broken",
    "ICC_OUTCOME": "icc_money_not_land",
}
RANK = {"primary": 5, "scholarly": 4, "oral_history": 3, "reported": 2, "disputed": 1, "unsupported": 0}
DISPLAY = {"primary": "Primary source", "scholarly": "Scholarly source", "disputed": "Disputed",
           "oral_history": "Oral history (published with permission)"}
VERIFIED = {"confirmed", "partly"}
REJECTED = {"contradicted", "not_supported"}


def read(path):
    with open(path, newline="", encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))


def write(path, fields, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)


def clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def split_list(s):
    return [x.strip() for x in re.split(r"[;|]", s or "") if x.strip()]


def area_key(a):
    m = re.match(r"(\d+)(.*)", a)
    return (int(m.group(1)), m.group(2)) if m else (10**9, a)


def parse_areas(text, known):
    """Royce areas named in a research or verdict field ("426;477", "700-705", "312 (Table Rock
    cession); 407 only as the removal destination", "none ..."). Only known area numbers count; a
    token that says an area is wrong ("not 516", "444;447 are other nations") is dropped."""
    text = clean(text)
    if not text or re.match(r"^none\b", text, re.I):
        return []
    text = re.sub(r"\([^)]*\)", " ", text)
    out = []
    for tok in re.split(r"[;,+]", text):
        tok = tok.strip()
        if not tok or re.match(r"^none\b", tok, re.I):
            continue
        if re.search(r"\b(not|only as|other nations|is a|are)\b", tok, re.I):
            continue
        tok = re.sub(r"\b(Art|Arts|Stat|p|pp)\.\s*\d+", " ", tok)
        for m in re.finditer(r"\b(\d{1,3}[a-z]?)(?:\s*-\s*(\d{1,3}))?\b", tok):
            a, b = m.group(1), m.group(2)
            if b and a.isdigit():
                out += [str(n) for n in range(int(a), int(b) + 1)]
            else:
                out.append(a)
    seen = []
    for a in out:
        if a in known and a not in seen:
            seen.append(a)
    return seen


def short_source(doc):
    doc = clean(doc).split(" | ")[0]
    if doc.startswith("treaty-land-atlas repo"):
        return "this atlas's own data"
    if doc.lower().startswith("not verified"):
        return "an unverified research note"
    doc = re.split(r"\s\(|, |: | https?://|;", doc)[0].strip(" '\"")
    return doc or "the K1 research"


def load_verdicts(k1_dir):
    """Latest verdict per finding: rounds in number order, batch files in name order."""
    files = []
    for p in (k1_dir / "verification").glob("round*-*.csv"):
        m = re.match(r"round(\d+)-", p.name)
        if m:
            files.append((int(m.group(1)), p.name, p))
    verdicts = {}
    for rnd, _, p in sorted(files):
        for r in read(p):
            fid = clean(r.get("finding_id"))
            if fid:
                verdicts[fid] = {**{k: clean(v) for k, v in r.items()}, "round": str(rnd)}
    return verdicts


def evidence_of(f, v):
    """(evidence key, display text, reason when not supported) for a finding and its verdict."""
    status = v["verification_status"] if v else clean(f.get("verification_status")) or "not_checked"
    against = v.get("verified_against", "") if v else ""
    if status in REJECTED:
        why = (v or {}).get("corrected_summary") or (v or {}).get("notes") or f"Verification: {status}."
        return "unsupported", "Not supported", why
    if status in VERIFIED and not (f.get("evidence_level") == "CONTESTED" and status == "partly"):
        if against == "primary":
            return "primary", DISPLAY["primary"], ""
        if against in ("scholarly", "secondary"):
            return "scholarly", DISPLAY["scholarly"], ""
    if f.get("evidence_level") == "CONTESTED":
        return "disputed", DISPLAY["disputed"], ""
    src = "PSL TREC 2024" if against == "book_only" else short_source(f.get("source_doc"))
    if f.get("evidence_level") == "ORAL_HISTORY":
        return "oral_history", DISPLAY["oral_history"], ""
    return "reported", f"Reported by {src}", ""


def finding_view(f, v, known):
    fid = f["finding_id"]
    ev, display, why = evidence_of(f, v)
    verified = bool(v) and v["verification_status"] in VERIFIED | REJECTED
    corrected_areas = v.get("corrected_royce_areas", "") if v else ""
    areas = parse_areas(corrected_areas, known) if corrected_areas else parse_areas(f.get("royce_areas"), known)
    cats = [clean(f.get("category"))] + split_list(f.get("secondary_categories"))
    flags = sorted({CATEGORY_FLAG[c] for c in cats if c in CATEGORY_FLAG}, key=FLAGS.index)
    # a verdict checked the finding's main claim; its secondary categories were not checked
    main_flag = CATEGORY_FLAG.get(clean(f.get("category")), "")
    pages = clean(f.get("pdf_pages"))
    reported_cite = short_source(f.get("source_doc")) + (f", p. {pages}" if pages else "")
    cite_parts = [v.get("source_title", ""), v.get("source_cite", "")] if verified else []
    citation = "; ".join(x for x in cite_parts if x) or reported_cite
    instrument = (v.get("corrected_instrument_cite") if v else "") or clean(f.get("instrument_cite")) or clean(f.get("instrument"))
    quote = (v.get("source_quote") if verified and v.get("source_quote") else "") or clean(f.get("verbatim_quote"))
    return {
        "finding_id": fid,
        "shown": "no" if ev == "unsupported" else "yes",
        "evidence": ev,
        "evidence_display": display,
        "verification_status": v["verification_status"] if v else clean(f.get("verification_status")) or "not_checked",
        "verified_against": v.get("verified_against", "") if v else "",
        "round": v.get("round", "") if v else "",
        "category": clean(f.get("category")),
        "flags": ";".join(flags),
        "main_flag": main_flag,
        "source_doc": clean(f.get("source_doc")),
        "reported_citation": clean(reported_cite),
        "original_quote": clean(f.get("verbatim_quote")),
        "original_summary": clean(f.get("summary")),
        "royce_areas": ";".join(areas),
        "date": clean(f.get("date")),
        "nations": clean(f.get("nations")),
        "instrument": clean(instrument),
        "citation": clean(citation),
        "quote": clean(quote),
        "summary": clean((v.get("corrected_summary") if v else "") or f.get("summary")),
        "reason_not_supported": clean(why),
    }


def best(views):
    return sorted(views, key=lambda x: (-RANK[x["evidence"]], x["finding_id"]))


COORD = re.compile(r"(-?\d{1,2}\.\d+)\s*,\s*(-?\d{2,3}\.\d+)")
CORRECTED_COORD = re.compile(
    r"(?:site is|usually given site|site at|commonly given site)[^()]{0,80}\((?:about |approx\.? )?(-?\d{1,2}\.\d+)\s*,\s*(-?\d{2,3}\.\d+)",
    re.I)


def site_coordinates(site, fids, findings, verdicts):
    """A verdict's corrected site location wins; then the editorial table's (for a row that names
    several places); then the research row's own coordinates."""
    for fid in fids:
        v = verdicts.get(fid) or {}
        m = CORRECTED_COORD.search(" ".join([v.get("notes", ""), v.get("corrected_summary", "")]))
        if m:
            return float(m.group(1)), float(m.group(2)), "verification round " + v.get("round", "")
    try:
        return float(site["lat"]), float(site["lon"]), "editorial table"
    except (KeyError, TypeError, ValueError):
        pass
    for fid in fids:
        m = COORD.search(findings.get(fid, {}).get("place", ""))
        if m:
            return float(m.group(1)), float(m.group(2)), "research row"
    return None


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--k1-dir", default=str(ROOT / "docs" / "research" / "K1" / "data"))
    ap.add_argument("--out-dir", default=str(ROOT / "crosswalks"))
    ap.add_argument("--events", default=str(ROOT / "data" / "derived" / "cession-events.json"))
    a = ap.parse_args(argv)
    k1, out = Path(a.k1_dir), Path(a.out_dir)
    known = {e["cessnum"] for e in json.loads(Path(a.events).read_text(encoding="utf-8"))}
    problems = []

    findings = {clean(f["finding_id"]): f for f in read(k1 / "beyond-federal-record-findings.csv") if clean(f.get("finding_id"))}
    verdicts = load_verdicts(k1)
    for fid in sorted(set(verdicts) - set(findings)):
        problems.append(f"verdict for unknown finding {fid}")
    views = {fid: finding_view(f, verdicts.get(fid), known) for fid, f in findings.items()}

    # --- flags: (area, flag) -> supporting findings ------------------------------------------
    support = {}
    unsupported_flags = []

    def add(area, flag, view):
        # evidence for a secondary claim of a finding stays "reported": the verdict and its quote
        # are about the finding's main claim
        if view.get("main_flag") is not None and view.get("main_flag") != flag and view["evidence"] in ("primary", "scholarly"):
            view = {**view,
                    "evidence": "reported",
                    "evidence_display": f"Reported by {short_source(view.get('source_doc'))}",
                    "citation": view.get("reported_citation") or view["citation"],
                    "quote": view.get("original_quote", ""),
                    "summary": view.get("original_summary") or view["summary"]}
        lst = support.setdefault((area, flag), [])
        if view["finding_id"] not in [x["finding_id"] for x in lst]:
            lst.append(view)

    for v in views.values():
        if v["shown"] == "yes":
            for area in split_list(v["royce_areas"]):
                for flag in split_list(v["flags"]):
                    add(area, flag, v)

    # --- primary status per area ---------------------------------------------------------------
    status_rows = []
    for p in read(k1 / "royce-status-proposals.csv"):
        raw_area = clean(p.get("royce_area"))
        m = re.match(r"^(\d+[a-z]?)(?:-([A-Z]+))?\b\s*(?:\((.*)\))?", raw_area)
        if not m:
            problems.append(f"proposal with unreadable area {raw_area!r}")
            continue
        parent, sub, sub_label = m.group(1), m.group(2), clean(m.group(3))
        area = f"{parent}-{sub}" if sub else parent
        if parent not in known:
            problems.append(f"proposal for unknown Royce area {parent}")
            continue
        status = RENAMED.get(clean(p["proposed_primary_status"]), clean(p["proposed_primary_status"]))
        if status not in STATUSES:
            problems.append(f"area {area}: unknown status {status!r}")
            continue
        fids = split_list(p.get("finding_ids"))
        for fid in fids:
            if fid not in views:
                problems.append(f"area {area}: unknown finding {fid}")
        pv = [views[f] for f in fids if f in views]
        shown = [x for x in pv if x["shown"] == "yes"]
        top = best(shown)[0] if shown else None
        status_rows.append({
            "royce_area": area,
            "parent_area": parent if sub else "",
            "sub_area_label": sub_label,
            "land_status": status,
            "evidence": top["evidence"] if top else "reported",
            "evidence_display": top["evidence_display"] if top else "Reported by the K1 research",
            "instrument": clean(p.get("instrument")),
            "basis": clean(p.get("basis")),
            "finding_ids": ";".join(fids),
            "confidence": clean(p.get("confidence")),
            "research_verification": clean(p.get("verification_status")),
            # the year the map shows the land lost, where the research corrects Royce's dates
            # (a reserve superseded by a later treaty, such as 478 in 1867)
            "lost_year": clean(p.get("lost_year")) if re.match(r"^\d{4}$", clean(p.get("lost_year"))) else "",
            "revision_note": clean(p.get("revision_note")),
        })
        # a proposal's flags: supported by its findings of the matching category; failing that,
        # by the proposal itself, shown as reported until a finding of that kind is verified
        for flag in split_list(p.get("proposed_flags")):
            if flag not in FLAGS:
                problems.append(f"area {area}: unknown flag {flag!r}")
                continue
            matching = [x for x in pv if flag in split_list(x["flags"])]
            # every finding behind it was contradicted or not supported: never a flag
            if (matching and all(x["shown"] == "no" for x in matching)) or (
                not matching and pv and all(x["shown"] == "no" for x in pv)):
                unsupported_flags.append((area, flag, matching or pv))
                continue
            for x in matching:
                if x["shown"] == "yes":
                    add(area, flag, x)
            if not matching:
                add(area, flag, {
                    "finding_id": f"K1-PROPOSAL-{area}",
                    "evidence": "reported",
                    "evidence_display": "Reported by the K1 research",
                    "citation": clean(p.get("instrument")),
                    "quote": "",
                    "summary": clean(p.get("basis")),
                    "shown": "yes",
                })

    # flag reviews: a reader checked that the shown evidence supports this specific flag
    # (decision keep | reported | drop); a later review row wins
    reviews = {}
    review_path = k1 / "flag-reviews.csv"
    if review_path.exists():
        for r in read(review_path):
            reviews[(clean(r.get("royce_area")), clean(r.get("flag")))] = r

    flag_rows = []
    for (area, flag), lst in support.items():
        ordered = best(lst)
        top = ordered[0]
        rv = reviews.get((area, flag))
        decision = clean(rv.get("decision")) if rv else ""
        if decision == "drop":
            print(f"flag dropped by review: area {area} {flag} ({clean(rv.get('reason'))})")
            continue
        if decision == "reported":
            if top["evidence"] in ("primary", "scholarly"):
                top = {**top, "evidence": "reported",
                       "evidence_display": f"Reported by {short_source(top.get('source_doc'))}" if top.get("source_doc") else "Reported by the K1 research"}
            if clean(rv.get("corrected_summary")):
                top = {**top, "summary": clean(rv.get("corrected_summary"))}
        elif decision == "keep":
            # the reviewer may keep a flag on another verified finding than the top one: show that
            # finding's citation and quote, so the panel shows the evidence that meets the standard
            sup = views.get(clean(rv.get("supporting_finding_id")))
            if sup and sup["shown"] == "yes" and sup["evidence"] in ("primary", "scholarly"):
                top = {**top, "evidence": sup["evidence"], "evidence_display": sup["evidence_display"],
                       "citation": sup["citation"], "quote": sup["quote"]}
            if clean(rv.get("supporting_citation")):
                # a quote is only shown with the citation it came from
                top = {**top, "citation": clean(rv.get("supporting_citation")),
                       "quote": top["quote"] if sup and top["quote"] == sup["quote"] else ""}
            if clean(rv.get("supporting_quote")):
                top = {**top, "quote": clean(rv.get("supporting_quote"))}
                # the reviewer matched this exact quote to the primary source named in the citation
                if clean(rv.get("supporting_citation")) and top["evidence"] not in ("primary", "scholarly"):
                    top = {**top, "evidence": "primary", "evidence_display": DISPLAY["primary"]}
            if clean(rv.get("corrected_summary")):
                top = {**top, "summary": clean(rv.get("corrected_summary"))}
        flag_rows.append({
            "royce_area": area,
            "flag": flag,
            "evidence": top["evidence"],
            "evidence_display": top["evidence_display"],
            "hatch": "solid" if top["evidence"] in ("primary", "scholarly") else "dotted",
            "finding_ids": ";".join(x["finding_id"] for x in ordered),
            "citation": top["citation"],
            "quote": top["quote"],
            "summary": top["summary"],
        })
    flag_rows.sort(key=lambda r: (area_key(r["royce_area"]), FLAGS.index(r["flag"])))
    status_rows.sort(key=lambda r: area_key(r["royce_area"]))

    # --- massacre sites --------------------------------------------------------------------------
    site_rows = []
    for s in read(k1 / "massacre-sites.csv"):
        if clean(s.get("status")) == "exclude":
            continue
        fids = split_list(s.get("finding_ids"))
        sv = [views[f] for f in fids if f in views]
        for fid in fids:
            if fid not in views:
                problems.append(f"site {s['site_id']}: unknown finding {fid}")
        shown = best([x for x in sv if x["shown"] == "yes"])
        if not shown:
            problems.append(f"site {s['site_id']}: every finding is unsupported; not published")
            continue
        top = shown[0]
        coords = site_coordinates(s, fids, findings, verdicts) if clean(s.get("status")) == "map" else None
        areas = parse_areas(s.get("royce_areas"), known) if clean(s.get("royce_areas")) else split_list(top["royce_areas"])
        link = clean(s.get("link_kind")) or "none"
        if link not in ("preceded", "enforced", "followed", "none"):
            problems.append(f"site {s['site_id']}: link_kind {link!r} must be preceded, enforced, followed or none")
            link = "none"
        site_rows.append({
            "id": clean(s["site_id"]),
            "name": clean(s["name"]),
            "other_names": clean(s.get("other_names")),
            "category": clean(s.get("category")) or "massacre",
            "date": clean(s.get("date")),
            # general location only (K1 s.6 ethics note): never burial or sacred-site precision
            "lat_general": f"{coords[0]:.1f}" if coords else "",
            "lon_general": f"{coords[1]:.1f}" if coords else "",
            "location_basis": coords[2] if coords else clean(s.get("note")) or "no location in the sources",
            "nations": clean(s.get("nations")),
            "deaths_range": clean(s.get("deaths_range")),
            "deaths_source": clean(s.get("deaths_source")),
            "perpetrators": clean(s.get("perpetrators")),
            "royce_areas": ";".join(areas),
            "link_kind": link,
            "linked_instrument": clean(s.get("linked_instrument")),
            "link_note": clean(s.get("link_note")),
            "citation": top["citation"],
            # a verdict's quote can be about another part of the row (Bear River: the Royce 444 remark)
            "quote": "" if clean(s.get("show_quote")) == "no" else top["quote"],
            "summary": top["summary"],
            "evidence": top["evidence"],
            "evidence_display": top["evidence_display"],
            "finding_ids": ";".join(x["finding_id"] for x in shown),
        })

    finding_rows = sorted(views.values(), key=lambda r: r["finding_id"])
    write(out / "land-status.csv", list(status_rows[0].keys()) if status_rows else ["royce_area"], status_rows)
    write(out / "land-status-flags.csv",
          ["royce_area", "flag", "evidence", "evidence_display", "hatch", "finding_ids", "citation", "quote", "summary"],
          flag_rows)
    write(out / "massacre-sites.csv", list(site_rows[0].keys()) if site_rows else ["id"], site_rows)
    write(out / "k1-findings.csv", list(finding_rows[0].keys()) if finding_rows else ["finding_id"], finding_rows)

    shown = sum(1 for r in finding_rows if r["shown"] == "yes")
    print(f"crosswalks: {len(status_rows)} land statuses, {len(flag_rows)} area flags "
          f"({sum(r['hatch'] == 'solid' for r in flag_rows)} solid, {sum(r['hatch'] == 'dotted' for r in flag_rows)} dotted), "
          f"{len(site_rows)} massacre sites ({sum(1 for r in site_rows if r['lat_general'])} mapped), "
          f"{len(finding_rows)} findings ({shown} shown, {len(finding_rows) - shown} not supported); "
          f"verdicts from {len(verdicts)} findings")
    for area, flag, lst in unsupported_flags:
        print(f"flag dropped: area {area} {flag} (all evidence not supported: {', '.join(x['finding_id'] for x in lst)})")
    for p in problems:
        print("problem:", p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
