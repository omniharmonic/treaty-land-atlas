#!/usr/bin/env python3
"""
build_graph.py  -  Treaty Land Atlas knowledge-graph builder (draft v0.1)
Author: Benjamin Life (@omniharmonic)

WHAT THIS DOES
    Reads the seed CSVs in seed-data/ and the hand-made crosswalk CSVs in crosswalks/,
    and writes a draft graph to build/:
        build/nodes.json              every entity (treaty, nation, case, ...)
        build/edges.json              every relationship between entities
        build/unresolved.json         machine-readable list of everything that could not be linked
        build/graph-build-report.md   the same story in plain language

HOW TO RUN
        python3 scripts/build_graph.py

    Needs only the Python 3 standard library. If the "jsonschema" package happens to be
    installed, the output is also validated against docs/design/schema/*.schema.json.

HOW TO READ THIS FILE
    The file is a top-to-bottom recipe. Each numbered section does one job:
        1. helpers            small tools used everywhere
        2. load               read the CSVs
        3. nodes              one function per kind of entity
        4. edges              one function per kind of relationship
        5. checks             orphans, broken references, schema validation
        6. write              JSON files and the Markdown report
    Nothing is guessed silently: anything inferred is written with status "proposed",
    and anything that could not be linked is listed in the report.
"""

import csv
import hashlib
import os
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

# --------------------------------------------------------------------------------------
# 0. Paths and constants
# --------------------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
SEED = ROOT / "seed-data"
XWALK = ROOT / "crosswalks"
BUILD = ROOT / "build"
SCHEMA_DIR = ROOT / "docs" / "design" / "schema"
C3_DOC = ROOT / "docs" / "research" / "C3-doctrine-map.md"

SCHEMA_VERSION = "0.2.0"


def build_date():
    """Date stamped into outputs. SOURCE_DATE_EPOCH (seconds) pins it so two runs are byte-identical."""
    epoch = os.environ.get("SOURCE_DATE_EPOCH")
    if epoch:
        return datetime.fromtimestamp(int(epoch), tz=timezone.utc).date().isoformat()
    return date.today().isoformat()


BUILT_BY = "scripts/build_graph.py"

# Which research agent wrote which seed file (from the seed READMEs).
SOURCE_AGENT = {
    "treaties-seed.csv": "A", "nara-ratified-treaties-index.csv": "A",
    "violations-seed.csv": "B", "violations-seed-notes.csv": "B",
    "cases-seed.csv": "C", "statutes-seed.csv": "C",
    "policy-eras-seed.csv": "D",  # no README for this file; D2 is the matching research note
    "organizations-seed.csv": "F", "campaigns-seed.csv": "F", "tribe-org-map.csv": "F",
    "geodata-sources.csv": "E",
}
RESEARCH_DOC = {
    "treaties-seed.csv": ["docs/research/A1-treaty-framework-and-counts.md", "docs/research/A2-treaty-eras-and-clusters.md"],
    "nara-ratified-treaties-index.csv": ["docs/research/A1-treaty-framework-and-counts.md"],
    "violations-seed.csv": ["docs/research/B1-violation-typology.md", "docs/research/B2-violation-catalog.md"],
    "violations-seed-notes.csv": ["docs/research/B2-violation-catalog.md"],
    "cases-seed.csv": ["docs/research/C1-case-law-survey.md"],
    "statutes-seed.csv": ["docs/research/C2-statutes-and-policy-eras.md"],
    "policy-eras-seed.csv": ["docs/research/D2-policy-eras-timeline.md"],
    "organizations-seed.csv": ["docs/research/F2-organization-directory.md"],
    "campaigns-seed.csv": ["docs/research/F3-land-returns-and-campaigns.md"],
    "tribe-org-map.csv": ["docs/research/F1-land-back-landscape.md"],
    "geodata-sources.csv": ["docs/data/E2-geodata-source-inventory.md"],
}

# Node-type defaults that implement the G3 data classes and the "no narrative before review" rule.
#   scope: does the content speak about a specific nation (needs that nation's review before narrative)?
TYPE_DEFAULTS = {
    "Instrument":   {"scope": "public_record_only", "data_class": "P"},
    "Nation":       {"scope": "nation_specific",    "data_class": "N"},
    "Place":        {"scope": "public_record_only", "data_class": "P"},
    "Violation":    {"scope": "nation_specific",    "data_class": "D"},
    "Case":         {"scope": "public_record_only", "data_class": "P"},
    "Statute":      {"scope": "public_record_only", "data_class": "P"},
    "PolicyEra":    {"scope": "public_record_only", "data_class": "D"},
    "Organization": {"scope": "public_record_only", "data_class": "P"},
    "Campaign":     {"scope": "nation_specific",    "data_class": "D"},
    "Source":       {"scope": "public_record_only", "data_class": "P"},
    "Doctrine":     {"scope": "public_record_only", "data_class": "D"},
    "GeoFeature":   {"scope": "public_record_only", "data_class": "P"},
}
TYPE_ORDER = ["Instrument", "Statute", "Case", "Doctrine", "PolicyEra", "Violation", "Nation", "Organization",
              "Campaign", "Place", "Source", "Person", "GeoFeature"]

# Edges touching these node types need a real tribal-review status (see edges.schema.json).
TRIBAL_REVIEW_TYPES = {"Nation", "Violation", "Campaign", "Organization"}

US_STATES = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA", "colorado": "CO",
    "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
    "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS", "kentucky": "KY", "louisiana": "LA",
    "maine": "ME", "maryland": "MD", "massachusetts": "MA", "michigan": "MI", "minnesota": "MN",
    "mississippi": "MS", "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
    "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY", "north carolina": "NC",
    "north dakota": "ND", "ohio": "OH", "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA",
    "rhode island": "RI", "south carolina": "SC", "south dakota": "SD", "tennessee": "TN", "texas": "TX",
    "utah": "UT", "vermont": "VT", "virginia": "VA", "washington": "WA", "west virginia": "WV",
    "wisconsin": "WI", "wyoming": "WY",
}
STATE_NAME_BY_CODE = {v: k.title() for k, v in US_STATES.items()}

# B1 section 4: the allowed violation codes. The seed file uses one shorter spelling; we normalize it.
VIOLATION_CODE_ALIASES = {"ANNUITY_NONPAYMENT": "ANNUITY_NONPAYMENT_OR_DIVERSION"}

# Words F uses to describe how an organization relates to a nation (tribe-org-map.csv "relationship").
F_RELATIONSHIP_WORDS = {
    "governing_body", "tribal_nonprofit", "return_recipient", "led_by_members", "campaign_partner",
    "fundraising_partner", "legal_counsel", "funder_partner", "donation_channel", "allied_non_native_org",
    "pan_tribal_service", "advocacy_adjacent", "program_context", "no_verified_org", "advocacy",
    "reacquisition", "campaign", "unverified",
}

# Source-tier guess from the web domain (brief principle 3). A human should confirm.
PRIMARY_DOMAINS = ("govinfo.gov", "loc.gov", "archives.gov", "supremecourt.gov", "congress.gov", "house.gov",
                   "senate.gov", "federalregister.gov", "ecfr.gov")
LEGAL_MIRROR_DOMAINS = ("justia.com", "law.cornell.edu", "courtlistener.com", "casetext.com", "law.resource.org", "oyez.org")
SECONDARY_DOMAINS = ("digitreaties.org", "okstate.edu", "si.edu", "britannica.com", "ndstudies.gov", "bia.gov")
POINTER_DOMAINS = ("wikipedia.org",)
NEWS_DOMAINS = ("npr.org", "pbs.org", "kpbs.org", "hcn.org", "apnews.com", "nytimes.com", "washingtonpost.com",
                "scotusblog.com", "cronkitenews", "theguardian.com", "reuters.com", "indiancountrytoday.com")

ISSUES = []  # every problem found while building; written to unresolved.json and the report


# --------------------------------------------------------------------------------------
# 1. Helpers
# --------------------------------------------------------------------------------------
def issue(level, kind, where, ref, message):
    """Record a problem. level: error | warn | info."""
    ISSUES.append({"level": level, "kind": kind, "where": where, "ref": ref, "message": message})


def read_csv(path):
    """Read a CSV into a list of dicts. Also notices rows with the wrong number of cells."""
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):  # line 1 is the header
            if None in row or any(v is None for v in row.values()):
                issue("error", "malformed_row", str(path.relative_to(ROOT)), f"line {i}",
                      "Row has the wrong number of columns (extra or missing cells).")
                row = {k: (v if v is not None else "") for k, v in row.items() if k is not None}
            rows.append(row)
    return rows


def blank_to_none(value):
    value = (value or "").strip()
    return value if value else None


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def norm_text(text):
    """Lower-case, strip accents, straighten quotes, drop [bracketed tags], squeeze spaces."""
    text = unicodedata.normalize("NFKD", text or "")
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.replace("’", "'").replace("‘", "'").replace("ʻ", "'").replace("–", "-").replace("—", "-")
    text = re.sub(r"\[[^\]]*\]", " ", text)
    return re.sub(r"\s+", " ", text.lower()).strip()


def text_flags(*texts):
    """Find the brief's [from-memory] / [disputed] / [unverified] tags inside free text."""
    blob = " ".join(t for t in texts if t).lower()
    flags = []
    if "[from-memory" in blob or "from-memory]" in blob or "from memory" in blob:
        flags.append("text_has_from_memory_tag")
    if "[disputed" in blob:
        flags.append("text_has_disputed_tag")
    if "[unverified" in blob or "unverified]" in blob:
        flags.append("text_has_unverified_tag")
    return flags


def parse_int(value):
    value = (value or "").strip().replace(",", "")
    return int(value) if re.fullmatch(r"\d+", value) else None


def parse_float(value):
    value = (value or "").strip().replace(",", "")
    try:
        return float(value) if value else None
    except ValueError:
        return None


DATE_OK = re.compile(r"^\d{4}(-\d{2}(-\d{2})?)?$")


def clean_date(value, where, ref):
    value = blank_to_none(value)
    if value and not DATE_OK.match(value):
        issue("warn", "bad_date_format", where, ref, f"Date '{value}' is not YYYY, YYYY-MM or YYYY-MM-DD; stored as null.")
        return None
    return value


def year_of(date_string):
    return int(date_string[:4]) if date_string else None


def stable_hash(*parts, n=12):
    return hashlib.sha1("|".join(str(p) for p in parts).encode("utf-8")).hexdigest()[:n]


def normalize_confidence(raw, mapping_kind):
    """
    Seeds use two confidence scales. We keep both ideas apart:
        confidence           high | medium | low      (how reliable is the record overall)
        verification_status  verified | from_memory | disputed | unverified | mixed | not_assessed
    mapping_kind "tags"   : verified / from-memory / disputed / unverified   (cases, statutes)
    mapping_kind "levels" : high / medium / low                              (everything else)
    mapping_kind "treaty" : levels, but the A README defines them in terms of verification
    """
    raw = (raw or "").strip().lower()
    if mapping_kind == "tags":
        table = {"verified": ("high", "verified"), "from-memory": ("low", "from_memory"),
                 "disputed": ("low", "disputed"), "unverified": ("low", "unverified")}
    elif mapping_kind == "treaty":
        table = {"high": ("high", "verified"), "medium": ("medium", "mixed"), "low": ("low", "mixed")}
    else:
        table = {"high": ("high", "not_assessed"), "medium": ("medium", "not_assessed"),
                 "low": ("low", "not_assessed"), "medium-low": ("low", "not_assessed")}
    if raw in table:
        return table[raw]
    issue("warn", "unknown_confidence_value", "normalize_confidence", raw, "Unrecognized confidence value; set to low/unverified.")
    return ("low", "unverified")


# --------------------------------------------------------------------------------------
# The graph container
# --------------------------------------------------------------------------------------
class Graph:
    def __init__(self):
        self.nodes = {}
        self.edges = {}

    def add_node(self, node_type, node_id, label, source_file, source_row_id, confidence_raw, conf_kind,
                 fields, flags=(), scope=None, data_class=None, state="record_only", origin="seed_csv",
                 summary=None, notes=None, aliases=None, external_ids=None):
        if node_id in self.nodes:
            issue("error", "duplicate_node_id", source_file, node_id, "Node id already exists; second record ignored.")
            return self.nodes[node_id]
        confidence, verification = normalize_confidence(confidence_raw, conf_kind)
        defaults = TYPE_DEFAULTS.get(node_type, {"scope": "public_record_only", "data_class": "P"})
        node = {
            "id": node_id, "type": node_type, "label": label, "summary": summary,
            "aliases": sorted(set(aliases or [])), "external_ids": external_ids or {},
            "confidence": confidence, "verification_status": verification,
            "flags": sorted(set(flags)),
            "provenance": {
                "origin": origin, "source_file": source_file, "source_row_id": source_row_id,
                "source_agent": SOURCE_AGENT.get(Path(source_file).name), "source_confidence_raw": blank_to_none(confidence_raw),
                "research_docs": RESEARCH_DOC.get(Path(source_file).name, []), "built_by": BUILT_BY,
            },
            # G3: silence is not consent. Everything starts unreviewed, with no narrative allowed.
            "tribal_review": {"status": "not_yet_contacted", "scope": scope or defaults["scope"],
                              "date": None, "reviewer_role": None, "notes": None},
            "publication": {"state": state, "narrative_allowed": False},
            "data_class": data_class or defaults["data_class"],
            "sensitivity": {"tier": "public", "notes": None},
            "notes": notes,
        }
        node.update(fields)
        self.nodes[node_id] = node
        return node

    def add_edge(self, edge_type, source, target, status, confidence, method, rule, source_file,
                 source_row_id=None, basis=None, qualifiers=None, origin="seed_csv", crosswalk_file=None,
                 evidence=None, successor_status=None):
        """Add one edge. Returns None (and records an issue) if either end does not exist."""
        for end, label in ((source, "source"), (target, "target")):
            if end not in self.nodes:
                issue("error", "unresolved_reference", source_file, f"{edge_type}: {source} -> {target}",
                      f"Edge {label} id '{end}' is not a node in the graph; edge not created.")
                return None
        s_type, t_type = self.nodes[source]["type"], self.nodes[target]["type"]
        quals = qualifiers or {}
        edge_id = "e-" + stable_hash(edge_type, source, target, quals.get("role", ""))
        if edge_id in self.edges:
            return self.edges[edge_id]
        needs_review = s_type in TRIBAL_REVIEW_TYPES or t_type in TRIBAL_REVIEW_TYPES
        review = {"tribal_review_status": "not_yet_contacted" if needs_review else "not_applicable"}
        if successor_status:
            review["successor_status"] = successor_status
        edge = {
            "id": edge_id, "type": edge_type, "source": source, "target": target,
            "source_type": s_type, "target_type": t_type,
            "status": status, "confidence": confidence, "basis": basis,
            "derivation": {"method": method, "rule": rule, "crosswalk_file": crosswalk_file, "source_file": source_file},
            "provenance": {"origin": origin, "source_file": source_file, "source_row_id": source_row_id, "built_by": BUILT_BY},
            "evidence": evidence or [], "qualifiers": quals, "review": review,
        }
        self.edges[edge_id] = edge
        return edge


G = Graph()


# --------------------------------------------------------------------------------------
# 2. Load everything
# --------------------------------------------------------------------------------------
def load_all():
    files = ["treaties-seed.csv", "nara-ratified-treaties-index.csv", "violations-seed.csv", "violations-seed-notes.csv",
             "cases-seed.csv", "statutes-seed.csv", "policy-eras-seed.csv", "organizations-seed.csv",
             "campaigns-seed.csv", "tribe-org-map.csv", "geodata-sources.csv"]
    data = {name: read_csv(SEED / name) for name in files}
    cross = {p.name: read_csv(p) for p in sorted(XWALK.glob("*.csv"))}
    return data, cross


# --------------------------------------------------------------------------------------
# 3. Nodes
# --------------------------------------------------------------------------------------
REVIEW_PUBLICATION = {
    # status -> (publication.state, narrative_allowed). Only a nation's review opens narrative.
    "not_yet_contacted": ("record_only", False),
    "invited": ("record_only", False),
    "edits_requested": ("record_only", False),
    "reviewed": ("published", True),
    "co_authored": ("published", True),
    "declined": ("record_only", False),
    "withdrawn": ("withheld", False),
}


def apply_review_ledger(cross):
    """Set tribal_review and publication from crosswalks/tribal-review-ledger.csv.

    Nodes without a ledger row keep not_yet_contacted / narrative_allowed=false:
    silence is never consent (G3 s.3.3). The latest row per node wins (rows are read in order).
    """
    for r in cross.get("tribal-review-ledger.csv", []):
        node = G.nodes.get(r["node_id"])
        status = r["status"]
        if node is None:
            issue("error", "review_ledger_unknown_node", "tribal-review-ledger.csv", r["node_id"], "Ledger row names a node that does not exist.")
            continue
        if status not in REVIEW_PUBLICATION:
            issue("error", "review_ledger_bad_status", "tribal-review-ledger.csv", r["node_id"], f"Unknown review status {status!r}.")
            continue
        if status in ("reviewed", "co_authored") and not (r["date"] and r["reviewer_role"] and r["record_id"]):
            issue("error", "review_ledger_incomplete", "tribal-review-ledger.csv", r["node_id"], "reviewed/co_authored needs date, reviewer_role and record_id; row ignored.")
            continue
        state, narrative = REVIEW_PUBLICATION[status]
        node["tribal_review"] = {
            "status": status, "scope": r["scope"] or node["tribal_review"]["scope"],
            "date": blank_to_none(r["date"]), "reviewer_role": blank_to_none(r["reviewer_role"]),
            "notes": blank_to_none(r["notes"]),
        }
        node["publication"] = {"state": state, "narrative_allowed": narrative}


def rit_to_id(rit):
    """NARA RIT number -> atlas id.  '7' -> TLA-T-007, '19A' -> TLA-T-019A."""
    m = re.fullmatch(r"(\d+)([A-Z]?)", rit.strip())
    return f"TLA-T-{int(m.group(1)):03d}{m.group(2)}"


def normalize_stat_cite(raw):
    raw = (raw or "").strip()
    if not raw or raw.lower().startswith(("none", "n/a")):
        return None
    m = re.search(r"(\d+)\s+Stat\.\s+(\d+)", raw)
    return f"{m.group(1)} Stat. {m.group(2)}" if m else None


INSTRUMENT_TYPE_MAP = {
    "treaty": "ratified_treaty", "treaty (unratified)": "unratified_treaty",
    "treaty (international)": "international_treaty", "agreement (statutory)": "agreement_statutory",
    "executive order": "executive_order",
}
RATIFICATION_MAP = {"yes": "ratified", "no": "unratified", "partial": "ratified_with_amendments", "n/a": "not_applicable"}


def build_instruments(data, cross):
    treaties = {r["id"]: r for r in data["treaties-seed.csv"]}
    nara_rows = data["nara-ratified-treaties-index.csv"]
    statute_merge = {r["tla_id"]: r["stat_id"] for r in cross["statute-merge.csv"]}
    seeded_ids = set()

    # --- (a) The NARA spine: one node per row of the NARA table (376 rows).
    for row in nara_rows:
        rit = row["nara_rit_no"]
        tid = rit_to_id(rit)
        seed = treaties.get(tid)
        naids = [n.strip() for n in row["nara_naid"].split(";") if n.strip()]
        if not naids:
            issue("warn", "missing_naid", "nara-ratified-treaties-index.csv", f"RIT {rit}",
                  "NARA row has no NAID (marked 'Treaty unavailable'); no source link can be built for it.")
        rit_num = int(re.match(r"\d+", rit).group())
        if rit.endswith("A") and rit_num == 143:
            inst_type = "document_set"          # A1 s.4.2: 143A is a document set, not a treaty
        elif rit_num <= 7:
            inst_type = "colonial_instrument"   # A1 s.4.2: RIT 1-7 are British-era items
        else:
            inst_type = "ratified_treaty"
        fields = {
            "instrument_type": inst_type,
            "ratification_status": "not_applicable" if inst_type != "ratified_treaty" else "ratified",
            "completeness": "skeleton", "date_signed": clean_date(row["date_signed"], "nara index", rit),
            "date_ratified": None, "date_proclaimed": None, "date_ratified_basis": None,
            "parties_text": row["nations_and_place_per_nara"], "region": None, "land_description": None,
            "land_desc_basis": None, "acreage_ceded": None, "acreage_basis": None, "stat_cite": None,
            "stat_cite_raw": None, "kappler_cite": None, "treaty_era_label": None,
            "nara": {"rit": rit, "naid": naids[0] if naids else None, "naid_alt": naids[1:], "nara_title": row["nara_title"] if "nara_title" in row else row["nations_and_place_per_nara"]},
            "signatory_authority_disputed": None, "royce_cession_numbers": [], "date_signed_basis": "NARA catalog-links table",
        }
        label = f"{row['nations_and_place_per_nara']} ({row['date_signed'][:4]})"
        flags = ["skeleton_record"] + (["context_row_not_a_treaty"] if inst_type in ("colonial_instrument", "document_set") else [])
        ext = {"nara_rit": rit}
        if naids:
            ext["nara_naid"] = naids
        conf_raw = "medium"
        notes = None
        if seed:
            seeded_ids.add(tid)
            # NARA vs seed cross-checks (data-quality findings, not fixes)
            if seed["nara_naid"].strip() != row["nara_naid"].strip():
                issue("warn", "data_mismatch", "treaties-seed vs nara index", tid, f"NAID differs: seed '{seed['nara_naid']}' vs NARA '{row['nara_naid']}'.")
            if seed["date_signed"] != row["date_signed"]:
                issue("warn", "data_mismatch", "treaties-seed vs nara index", tid, f"date_signed differs: seed '{seed['date_signed']}' vs NARA '{row['date_signed']}'.")
            if seed["instrument_type"] == "treaty" and inst_type != "ratified_treaty" and seed["ratified"] != "n/a":
                issue("warn", "data_mismatch", "treaties-seed", tid, "Seed says ratified treaty but NARA position says otherwise.")
            fields.update({
                "ratification_status": RATIFICATION_MAP.get(seed["ratified"], "not_applicable"),
                "completeness": "seeded", "date_signed": clean_date(seed["date_signed"], "treaties-seed", tid),
                "date_ratified": clean_date(seed["date_ratified"], "treaties-seed", tid),
                "date_ratified_basis": blank_to_none(seed["date_ratified_basis"]), "parties_text": seed["nations"],
                "region": blank_to_none(seed["region"]), "land_description": blank_to_none(seed["land_description"]),
                "land_desc_basis": blank_to_none(seed["land_desc_basis"]), "acreage_ceded": parse_int(seed["acreage_ceded_if_known"]),
                "acreage_basis": blank_to_none(seed["land_desc_basis"]) if parse_int(seed["acreage_ceded_if_known"]) else None,
                "stat_cite": normalize_stat_cite(seed["stat_cite"]), "stat_cite_raw": blank_to_none(seed["stat_cite"]),
                "kappler_cite": blank_to_none(seed["kappler_cite"]), "treaty_era_label": blank_to_none(seed["era"]),
                "date_signed_basis": blank_to_none(seed["date_signed_basis"]),
            })
            label = seed["name"]
            flags = [f for f in flags if f != "skeleton_record"]
            if inst_type in ("colonial_instrument", "document_set"):
                flags.append("context_row_not_a_treaty")
            flags += text_flags(seed["notes"], seed["stat_cite"], seed["kappler_cite"], seed["land_desc_basis"])
            conf_raw, notes = seed["confidence"], blank_to_none(seed["notes"])
        G.add_node("Instrument", tid, label, "seed-data/nara-ratified-treaties-index.csv" if not seed else "seed-data/treaties-seed.csv",
                   tid, conf_raw, "treaty" if seed else "levels", fields, flags=flags, notes=notes, external_ids=ext,
                   origin="nara_index" if not seed else "seed_csv")

    # --- (b) Seed rows that are not on the NARA spine.
    for tid, seed in treaties.items():
        if tid in seeded_ids:
            continue
        itype = seed["instrument_type"]
        if itype == "statute":
            continue  # handled in build_statutes (merged with statutes-seed.csv)
        mapped = INSTRUMENT_TYPE_MAP.get(itype)
        if not mapped:
            issue("error", "unknown_instrument_type", "treaties-seed.csv", tid, f"Unrecognized instrument_type '{itype}'.")
            continue
        fields = {
            "instrument_type": mapped, "ratification_status": RATIFICATION_MAP.get(seed["ratified"], "not_applicable"),
            "completeness": "seeded", "date_signed": clean_date(seed["date_signed"], "treaties-seed", tid),
            "date_ratified": clean_date(seed["date_ratified"], "treaties-seed", tid), "date_proclaimed": None,
            "date_ratified_basis": blank_to_none(seed["date_ratified_basis"]), "parties_text": seed["nations"],
            "region": blank_to_none(seed["region"]), "land_description": blank_to_none(seed["land_description"]),
            "land_desc_basis": blank_to_none(seed["land_desc_basis"]), "acreage_ceded": parse_int(seed["acreage_ceded_if_known"]),
            "acreage_basis": blank_to_none(seed["land_desc_basis"]) if parse_int(seed["acreage_ceded_if_known"]) else None,
            "stat_cite": normalize_stat_cite(seed["stat_cite"]), "stat_cite_raw": blank_to_none(seed["stat_cite"]),
            "kappler_cite": blank_to_none(seed["kappler_cite"]), "treaty_era_label": blank_to_none(seed["era"]),
            "nara": None, "signatory_authority_disputed": None, "royce_cession_numbers": [],
            "date_signed_basis": blank_to_none(seed["date_signed_basis"]),
        }
        flags = text_flags(seed["notes"], seed["stat_cite"], seed["kappler_cite"])
        if mapped == "international_treaty":
            flags.append("context_row_not_a_treaty")
        if "Hawaii" in seed["region"] or "Alaska" in seed["region"]:
            flags.append("distinct_legal_context")
        G.add_node("Instrument", tid, seed["name"], "seed-data/treaties-seed.csv", tid, seed["confidence"], "treaty",
                   fields, flags=flags, notes=blank_to_none(seed["notes"]))
        seeded_ids.add(tid)
    return statute_merge


def build_statutes(data, cross):
    treaties = {r["id"]: r for r in data["treaties-seed.csv"]}
    merge = {r["tla_id"]: r["stat_id"] for r in cross["statute-merge.csv"]}
    stat_to_tla = defaultdict(list)
    for tla, stat in merge.items():
        stat_to_tla[stat].append(tla)

    for r in data["statutes-seed.csv"]:
        tla_ids = stat_to_tla.get(r["id"], [])
        ext = {}
        if tla_ids:
            ext["legacy_treaties_seed_ids"] = tla_ids
        G.add_node("Statute", r["id"], r["name"], "seed-data/statutes-seed.csv", r["id"], r["confidence"], "tags",
                   {"name": r["name"], "year": parse_int(r["year"]), "citation": blank_to_none(r["citation"]),
                    "summary": blank_to_none(r["summary"]), "effect_on_land_rights": r["effect_on_land_rights"] or "mixed",
                    "doctrine_tags": [t.strip() for t in r["doctrines"].split(";") if t.strip()]},
                   flags=text_flags(r["citation"], r["summary"]), summary=blank_to_none(r["summary"]),
                   aliases=tla_ids, external_ids=ext)
    # Context rows in treaties-seed that are statutes but have no match in statutes-seed.csv
    for tid, seed in treaties.items():
        if seed["instrument_type"] != "statute":
            continue
        if tid in merge:
            if merge[tid] not in G.nodes:
                issue("error", "unresolved_reference", "crosswalks/statute-merge.csv", tid, f"stat id '{merge[tid]}' not found in statutes-seed.csv.")
            continue
        new_id = "stat-" + slugify(seed["name"].split("(")[0])[:60].strip("-") + "-" + (seed["date_signed"][:4])
        issue("warn", "statute_only_in_treaties_seed", "treaties-seed.csv", tid,
              f"'{seed['name']}' is a statute row in treaties-seed.csv with no matching row in statutes-seed.csv; created as {new_id}. Add it to statutes-seed.csv.")
        G.add_node("Statute", new_id, seed["name"], "seed-data/treaties-seed.csv", tid, seed["confidence"], "treaty",
                   {"name": seed["name"], "year": year_of(seed["date_signed"]), "citation": blank_to_none(seed["stat_cite"]),
                    "summary": blank_to_none(seed["land_description"]), "effect_on_land_rights": "mixed", "doctrine_tags": []},
                   flags=text_flags(seed["notes"]) + ["unresolved_reference"], aliases=[tid], notes=blank_to_none(seed["notes"]))
        merge[tid] = new_id
    return merge


def build_doctrines(data):
    """Doctrine nodes come from the controlled-vocabulary table in C3 Part 4."""
    text = C3_DOC.read_text(encoding="utf-8")
    section = text.split("### Doctrine tags", 1)[1].split("\n---", 1)[0]
    defs = {}
    for line in section.splitlines():
        m = re.match(r"\|\s*([a-z0-9-]+)\s*\|\s*(.+?)\s*\|\s*(\d+)\s*\|\s*$", line)
        if m and m.group(1) != "tag":
            defs[m.group(1)] = (m.group(2), int(m.group(3)))
    used = Counter()
    for fname, col in (("cases-seed.csv", "doctrines"), ("statutes-seed.csv", "doctrines")):
        for r in data[fname]:
            for tag in [t.strip() for t in r[col].split(";") if t.strip()]:
                used[tag] += 1
    for tag, (definition, documented) in sorted(defs.items()):
        if used[tag] != documented:
            issue("info", "doctrine_count_mismatch", "C3 Part 4 vs seeds", tag, f"C3 says {documented} rows use '{tag}'; the CSVs have {used[tag]}.")
        G.add_node("Doctrine", f"doctrine-{tag}", tag.replace("-", " "), "docs/research/C3-doctrine-map.md", tag, "medium", "levels",
                   {"tag": tag, "definition": definition, "documented_row_count": documented}, summary=definition)
    for tag in used:
        if tag not in defs:
            issue("error", "unknown_doctrine_tag", "cases/statutes seeds", tag, "Tag is used in a seed but is not in the C3 controlled vocabulary.")


def build_cases(data):
    for r in data["cases-seed.csv"]:
        G.add_node("Case", r["id"], r["short_name"], "seed-data/cases-seed.csv", r["id"], r["confidence"], "tags",
                   {"short_name": r["short_name"], "full_citation": r["full_citation"], "court": r["court"], "year": parse_int(r["year"]),
                    "holding_summary": blank_to_none(r["holding_summary"]), "land_rights_effect": r["land_rights_effect"] or "mixed",
                    "doctrine_tags": [t.strip() for t in r["doctrines"].split(";") if t.strip()],
                    "nations_text": blank_to_none(r["nations"]), "treaty_at_issue_text": blank_to_none(r["treaty_at_issue"])},
                   flags=text_flags(r["full_citation"], r["nations"], r["treaty_at_issue"], r["holding_summary"]),
                   summary=blank_to_none(r["holding_summary"]))


def parse_violation_years(text, ref):
    """'1970s-1989' -> (1970, 1989, 'decade').  Returns (start, end, precision)."""
    tokens = re.findall(r"(\d{4})(s?)", text or "")
    if not tokens:
        issue("warn", "unparsed_year", "violations-seed.csv", ref, f"Could not read a year from '{text}'.")
        return None, None, "unknown"
    decade = any(t[1] for t in tokens)
    start = int(tokens[0][0])
    end = int(tokens[-1][0]) + (9 if tokens[-1][1] else 0)
    return start, end, "decade" if decade else "year"


def build_violations(data):
    notes = {r["id"]: r for r in data["violations-seed-notes.csv"]}
    context_codes = {"CONTEXT_INFRASTRUCTURE_SITING", "CONTEXT_FEDERAL_LAND_DISPOSAL", "CONTEXT_PROTECTIVE_DESIGNATION_ROLLBACK", "ANNEXATION_CONTEXT"}
    for r in data["violations-seed.csv"]:
        vid = r["id"]
        n = notes.get(vid)
        if not n:
            issue("warn", "missing_notes_row", "violations-seed-notes.csv", vid, "No row in violations-seed-notes.csv; title falls back to treaty_name.")
        codes = []
        for code in [c.strip() for c in r["violation_type"].split(";") if c.strip()]:
            fixed = VIOLATION_CODE_ALIASES.get(code, code)
            if fixed != code:
                issue("info", "normalized_value", "violations-seed.csv", vid, f"violation_type '{code}' normalized to '{fixed}'.")
            codes.append(fixed)
        y0, y1, prec = parse_violation_years(r["violation_year"], vid)
        flags = text_flags(r["related_cases"], r["mechanism_summary"], n["verification_notes"] if n else "")
        if any(c in context_codes for c in codes):
            flags.append("context_row_not_a_treaty")
        title = n["title"] if n else r["treaty_name"]
        G.add_node("Violation", vid, title, "seed-data/violations-seed.csv", vid, r["confidence"], "levels",
                   {"title": title, "violation_types": codes, "adjudicated_breach_label_allowed": not any(c in context_codes for c in codes),
                    "year_text": blank_to_none(r["violation_year"]), "year_start": y0, "year_end": y1, "year_precision": prec,
                    "mechanism_summary": blank_to_none(r["mechanism_summary"]), "land_lost_description": blank_to_none(r["land_lost_description"]),
                    "acreage_text": blank_to_none(r["acreage_if_known"]), "legal_aftermath": blank_to_none(r["legal_aftermath"]),
                    "region_text": n["region"] if n else None, "treaty_name_text": r["treaty_name"], "treaty_year_text": r["treaty_year"],
                    "nations_text": r["nations"], "related_cases_text": blank_to_none(r["related_cases"]),
                    "verification_notes": n["verification_notes"] if n else None, "acknowledgment": None, "consent_status": None,
                    "evidence_flags": []},
                   flags=flags, summary=blank_to_none(r["mechanism_summary"])[:400] if r["mechanism_summary"] else None)


def build_policy_eras(data):
    for r in data["policy-eras-seed.csv"]:
        G.add_node("PolicyEra", r["id"], r["era_name"], "seed-data/policy-eras-seed.csv", r["id"], r["confidence"], "levels",
                   {"era_name": r["era_name"], "start_year": parse_int(r["start_year"]), "end_year": parse_int(r["end_year"]),
                    "key_acts_text": blank_to_none(r["key_acts"]), "land_effect_text": blank_to_none(r["land_effect"]),
                    "sources_text": blank_to_none(r["sources"])},
                   flags=text_flags(r["summary"], r["key_acts"]), summary=blank_to_none(r["summary"]))


def build_organizations(data, rows=None, source_file="seed-data/organizations-seed.csv"):
    for r in (data["organizations-seed.csv"] if rows is None else rows):
        conf = r["confidence"].strip().lower()
        eligible = conf in ("high", "medium")
        if r["indigenous_led"] == "tribal-government" and re.search(r"corporation", r["name"], re.I):
            issue("warn", "data_mismatch", "organizations-seed.csv", r["id"],
                  f"'{r['name']}' is typed 'tribal-government' but the name says Corporation (ANCSA corporations are not tribal governments). Check indigenous_led.")
        scope = "nation_specific" if r["indigenous_led"] in ("tribal-government", "yes-verified", "yes-self-described") else "public_record_only"
        flags = text_flags(r["vetting_notes"], r["nations_served"])
        if "DISTINCT LEGAL CONTEXT" in (r["nations_served"] + r["region"]).upper():
            flags.append("distinct_legal_context")
        G.add_node("Organization", r["id"], r["name"], source_file, r["id"], conf, "levels",
                   {"name": r["name"], "org_type": blank_to_none(r["org_type"]), "indigenous_led": r["indigenous_led"],
                    "nations_served_text": blank_to_none(r["nations_served"]), "region_text": blank_to_none(r["region"]),
                    "focus": blank_to_none(r["focus"]), "donation_url": blank_to_none(r["donation_url"]),
                    "ein_or_registry": blank_to_none(r["ein_or_registry"]), "vetting_notes": blank_to_none(r["vetting_notes"]),
                    "website": blank_to_none(r["website"]), "display_eligible": eligible},
                   flags=flags, scope=scope, state="record_only" if eligible else "draft", summary=blank_to_none(r["focus"]),
                   origin="seed_csv" if rows is None else "crosswalk")


def build_research_orgs(data, cross):
    """Organizations vetted in the 2026-10 research wave (F4 policy), kept apart from the seed with
    their source URL and evidence quote. Their states are added to the region text so the usual
    state matching applies."""
    rows = []
    for r in cross.get("organizations-research.csv", []):
        states = [x.strip() for x in r["states"].split(";") if x.strip()]
        region = "; ".join(filter(None, [r["region"], ", ".join(states)]))
        notes = f"{r['vetting_notes']} Source: {r['source_url']} (\"{r['evidence_quote']}\")"
        rows.append({**r, "region": region, "vetting_notes": notes})
    build_organizations(data, rows, "crosswalks/organizations-research.csv")


def add_research_org_edges(cross):
    for i, r in enumerate(cross.get("organizations-research.csv", []), start=2):
        if r["id"] not in G.nodes:
            continue
        etype = "governing_body_of" if r["indigenous_led"] == "tribal-government" else "serves_nation"
        for nid in filter(None, (x.strip() for x in r["nation_ids"].split(";"))):
            if nid not in G.nodes:
                issue("warn", "unresolved_reference", "organizations-research.csv", f"line {i}: {r['id']}", f"nation id {nid} is not in the graph.")
                continue
            G.add_edge(etype, r["id"], nid, "proposed", r["confidence"] or "medium", "crosswalk_manual",
                       "research: the organization's own site names this nation", "crosswalks/organizations-research.csv",
                       f"line {i}", basis=r["evidence_quote"] or None, origin="crosswalk",
                       qualifiers={"basis_ref": r["source_url"]}, crosswalk_file="crosswalks/organizations-research.csv")


def build_campaigns(data):
    for r in data["campaigns-seed.csv"]:
        status = r["status"]
        flags = text_flags(r["summary"])
        if "DISTINCT LEGAL CONTEXT" in (r["name"] + r["nation"] + r["summary"]).upper() or "Hawaii" in r["name"] or "ANCSA" in r["name"]:
            flags.append("distinct_legal_context")
        G.add_node("Campaign", r["id"], r["name"], "seed-data/campaigns-seed.csv", r["id"], r["confidence"], "levels",
                   {"name": r["name"], "campaign_status": status, "acres": parse_float(r["acres"]),
                    "acres_basis": "as reported by the primary cited source (campaigns-seed README); see F3 section 8 for disagreements" if parse_float(r["acres"]) is not None else None,
                    "start_year": parse_int(r["start_year"]), "location_text": blank_to_none(r["location"]),
                    "nation_text": blank_to_none(r["nation"]), "summary_text": blank_to_none(r["summary"])},
                   flags=flags, state="draft" if status == "headline-only" else "record_only", summary=blank_to_none(r["summary"])[:400] if r["summary"] else None)


def build_geodata_sources(data):
    for r in data["geodata-sources.csv"]:
        G.add_node("Source", r["id"], r["source"], "seed-data/geodata-sources.csv", r["id"], r["confidence"], "levels",
                   {"source_kind": "dataset", "url": blank_to_none(r["url"]), "domain": urlparse(r["url"]).netloc.lower() or None,
                    "source_tier": "unclassified", "tier_basis": "dataset_inventory", "publisher": blank_to_none(r["publisher"]),
                    "content": blank_to_none(r["content"]), "format": blank_to_none(r["format"]),
                    "license_or_terms": blank_to_none(r["license_or_terms"]), "update_status": blank_to_none(r["update_status"]),
                    "fit_for_timeslider": blank_to_none(r["fit_for_timeslider"])},
                   flags=text_flags(r["notes"], r["license_or_terms"]), data_class="R", notes=blank_to_none(r["notes"]))


def build_nations(cross):
    """Nation nodes come from crosswalks/nation-entities.csv; their names from nation-aliases.csv."""
    alias_names = defaultdict(list)
    for a in cross["nation-aliases.csv"]:
        for nid in a["nation_ids"].split(";"):
            alias_names[nid].append({"name": a["alias"], "kind": a["alias_kind"] if a["alias_kind"] != "endonym_per_seed" else "endonym_per_seed",
                                     "review": "unreviewed"})
    for r in cross["nation-entities.csv"]:
        nid = r["nation_id"]
        names = [{"name": r["label"], "kind": "preferred_label", "review": "unreviewed"}] + alias_names.get(nid, [])
        has_endonym = any(n["kind"] == "endonym_per_seed" for n in names)
        flags = []
        if r["legal_context"] != "standard":
            flags.append("distinct_legal_context")
        if r["entity_kind"] == "collective_scope":
            flags.append("context_row_not_a_treaty")
        G.add_node("Nation", nid, r["label"], "crosswalks/nation-entities.csv", nid, "medium", "levels",
                   {"entity_kind": r["entity_kind"], "federal_recognition": r["federal_recognition"], "legal_context": r["legal_context"],
                    "region": blank_to_none(r["region"]), "names": names,
                    "endonym_status": "per_seed_unreviewed" if has_endonym else "none_recorded"},
                   flags=flags, scope="public_record_only" if r["entity_kind"] == "collective_scope" else "nation_specific",
                   origin="crosswalk", notes=blank_to_none(r["notes"]))


def build_places(data):
    """Atlas regions from the treaty seeds; states are created on demand by get_state_place()."""
    regions = sorted({r["region"].strip() for r in data["treaties-seed.csv"] if r["region"].strip()})
    for reg in regions:
        G.add_node("Place", f"plc-region-{slugify(reg)}", reg, "seed-data/treaties-seed.csv", reg, "medium", "levels",
                   {"place_kind": "atlas_region", "code": None, "geometry_ref": None}, data_class="P")


def get_state_place(code):
    pid = f"plc-state-{code.lower()}"
    if pid not in G.nodes:
        G.add_node("Place", pid, STATE_NAME_BY_CODE[code], "build_graph.py (US_STATES table)", code, "high", "levels",
                   {"place_kind": "us_state", "code": code, "geometry_ref": None}, origin="computed")
        G.nodes[pid]["sensitivity"]["tier"] = "public"
    return pid


# --- Present-day nations, sourced names, successors (research wave 2, 2026-10-17) -------
FR_SOURCE_URL = "https://www.federalregister.gov/documents/2026/01/30/2026-01899/indian-entities-recognized-by-and-eligible-to-receive-services-from-the-united-states-bureau-of"
FR_CITATION = "91 FR 4102 (Jan. 30, 2026)"
RESEARCH_ALIAS_KINDS = {"endonym", "exonym", "historical_spelling", "common_english", "official_name"}
# Research names that are also ordinary English words or other peoples' parts are never used as text aliases.
ALIAS_STOPLIST = {"nation", "people", "the people", "band", "tribe", "indians", "snake", "creek", "black"}


def fr_key(name):
    """Normalized Federal Register name for lookups (drops "previously listed as" notes)."""
    name = re.sub(r"\(previously listed as[^)]*\)", " ", name or "")
    return re.sub(r"[^a-z0-9]+", " ", norm_text(name).replace("&", "and")).strip()


def fr_index(cross):
    index = {}
    for r in cross.get("federally-recognized-tribes.csv", []):
        index[fr_key(r["official_name"])] = r["nation_id"]
        if r["previously_listed_as"]:
            index.setdefault(fr_key(r["previously_listed_as"]), r["nation_id"])
    return index


def research_alias_rows(cross):
    """Extra alias rows from sourced research names and Federal Register official names.
    Curated rows in nation-aliases.csv always win: a text already listed there is never re-mapped."""
    taken = {norm_text(a["alias"]) for a in cross["nation-aliases.csv"]}
    extra = {}

    def add(text, nid, kind):
        t = norm_text(text)
        if len(t) < 5 or t in taken or t in ALIAS_STOPLIST:
            return
        extra.setdefault(t, set()).add(nid)
        kinds[t] = kind

    kinds = {}
    for r in cross.get("federally-recognized-tribes.csv", []):
        add(re.sub(r"\s*\(.*$", "", r["official_name"]), r["nation_id"], "source_label")
        if r["previously_listed_as"]:
            add(r["previously_listed_as"], r["nation_id"], "source_label")
    for r in cross.get("nation-names.csv", []):
        if r["name_kind"] in RESEARCH_ALIAS_KINDS and r["confidence"] in ("high", "medium"):
            add(r["name"], r["nation_id"], "historical_spelling" if r["name_kind"] != "endonym" else "endonym_per_seed")
    # A text claimed by several nations stays ambiguous: link to all, the review decides.
    return [{"alias": t, "nation_ids": ";".join(sorted(ids)), "alias_kind": kinds[t], "only_in": "", "notes": "research_wave_2"}
            for t, ids in sorted(extra.items())]


def build_present_day_nations(cross):
    """Every entity in the 2026 Federal Register list becomes (or updates) a present-day Nation node."""
    rows = cross.get("federally-recognized-tribes.csv", [])
    if not rows:
        return
    fr_src = get_source_node(FR_SOURCE_URL, set())
    G.nodes[fr_src].update({"label": f"Indian Entities Recognized by and Eligible To Receive Services From the BIA, {FR_CITATION}",
                            "publisher": "Bureau of Indian Affairs (Federal Register)", "source_tier": "primary_record",
                            "tier_basis": "manual"})
    for r in rows:
        nid, official = r["nation_id"], r["official_name"]
        if nid not in G.nodes:
            label = re.sub(r"\s*\(previously listed as[^)]*\)\s*$", "", official)
            G.add_node("Nation", nid, label, "crosswalks/federally-recognized-tribes.csv", nid, "high", "levels",
                       {"entity_kind": "present_day_government", "federal_recognition": "listed_federal_register_2026",
                        "legal_context": "distinct_alaska_ancsa" if r["section"] == "alaska" else "standard",
                        "region": "Alaska" if r["section"] == "alaska" else None,
                        "names": [{"name": label, "kind": "preferred_label", "review": "unreviewed"}],
                        "endonym_status": "none_recorded"},
                       flags=["distinct_legal_context"] if r["section"] == "alaska" else [],
                       scope="nation_specific", origin="crosswalk", notes=blank_to_none(r["notes"]))
        node = G.nodes[nid]
        node["federal_recognition"] = "listed_federal_register_2026"
        node["official_name"] = official
        node["external_ids"]["federal_register_2026"] = official
        if not any(n["name"] == official for n in node["names"]):
            node["names"].append({"name": official, "kind": "official_name", "review": "unreviewed",
                                  "source_url": FR_SOURCE_URL, "confidence": "high"})
        if r["previously_listed_as"]:
            node["names"].append({"name": r["previously_listed_as"], "kind": "historical_spelling", "review": "unreviewed",
                                  "source_url": FR_SOURCE_URL, "confidence": "high", "notes": "previously listed as"})
        G.add_edge("evidenced_by", nid, fr_src, "asserted_by_seed", "high", "crosswalk_manual",
                   "listed in the 2026 Federal Register notice", "crosswalks/federally-recognized-tribes.csv", nid,
                   basis=f"Listed in {FR_CITATION}.", origin="crosswalk", qualifiers={"role": "primary_record", "tier": "primary_record"})
    # Component bands named inside a Federal Register entry (e.g. the six Minnesota Chippewa Tribe reservations).
    for r in rows:
        m = re.search(r"component reservations:\s*(.*)\)", r["official_name"])
        if not m:
            continue
        for part in re.split(r";\s*", m.group(1)):
            band = norm_text(re.sub(r"\s*\(.*?\)", "", part))
            for nid, node in G.nodes.items():
                if node["type"] == "Nation" and nid != r["nation_id"] and any(
                        norm_text(n["name"]).startswith(band) for n in node["names"]):
                    node["component_of"] = re.sub(r"\s*\(.*$", "", r["official_name"])
                    G.add_edge("part_of", nid, r["nation_id"], "asserted_by_seed", "high", "crosswalk_manual",
                               "component reservation named in the Federal Register entry",
                               "crosswalks/federally-recognized-tribes.csv", r["nation_id"],
                               basis=f"{FR_CITATION} lists {part.strip()} as a component reservation.", origin="crosswalk")


def apply_name_research(cross, alias_index):
    """Sourced names (nation-names.csv) go onto Nation nodes; each source becomes a Source node."""
    for r in cross.get("nation-names.csv", []):
        node = G.nodes.get(r["nation_id"])
        if node is None:
            issue("warn", "name_row_unknown_nation", "nation-names.csv", r["nation_id"], f"No Nation node for name '{r['name']}'.")
            continue
        entry = {"name": r["name"], "kind": r["name_kind"], "review": "unreviewed", "source_url": r["source_url"],
                 "language_or_script": blank_to_none(r["language_or_script"]),
                 "confidence": r["confidence"] if r["confidence"] in ("high", "medium", "low") else "low",
                 "notes": blank_to_none(r["notes"])}
        if not any(n["name"] == entry["name"] and n["kind"] == entry["kind"] for n in node["names"]):
            node["names"].append(entry)
        if r["name_kind"] == "endonym" and node.get("endonym_status") != "tribal_confirmed":
            node["endonym_status"] = "sourced_unreviewed"
        sid = get_source_node(r["source_url"], set())
        G.add_edge("evidenced_by", node["id"], sid, "asserted_by_seed", r["confidence"] or "medium", "crosswalk_manual",
                   f"source for the name '{r['name']}'", "crosswalks/nation-names.csv", r["nation_id"],
                   basis=(r["evidence_quote"] or None), origin="crosswalk",
                   qualifiers={"role": "name_source", "tier": G.nodes[sid]["source_tier"]})
        if r["name_kind"] == "related_people":
            # The named people is part of this umbrella label, where the name resolves to a nation node.
            for pid, _, _ in alias_index.find(r["name"]):
                if pid != node["id"] and G.nodes.get(pid, {}).get("type") == "Nation":
                    G.add_edge("part_of", pid, node["id"], "proposed", "medium", "alias_text_match",
                               f"related_people row: {r['name']}", "crosswalks/nation-names.csv", r["nation_id"],
                               basis=r["evidence_quote"] or None, origin="crosswalk", evidence=[sid])


def add_successor_research_edges(cross):
    for i, r in enumerate(cross.get("nation-successor-research.csv", []), start=2):
        sid = get_source_node(r["basis_ref"], set()) if r["basis_ref"].startswith("http") else None
        if sid and r["present_nation_id"] in G.nodes:
            G.add_edge("evidenced_by", r["present_nation_id"], sid, "asserted_by_seed", "medium", "crosswalk_manual",
                       "source for a successor proposal", "crosswalks/nation-successor-research.csv", f"line {i}",
                       basis=r["evidence_quote"] or None, origin="crosswalk",
                       qualifiers={"role": "successor_basis", "tier": G.nodes[sid]["source_tier"]})
        G.add_edge("successor_of", r["present_nation_id"], r["party_nation_id"], "proposed",
                   r["confidence"] if r["confidence"] in ("high", "medium", "low") else "low",
                   "crosswalk_manual", f"basis_ref: {r['basis_ref']}", "crosswalks/nation-successor-research.csv", f"line {i}",
                   basis=r["evidence_quote"] or r["notes"] or None,
                   qualifiers={"extent": r["extent"], "disputed": r["disputed"] == "true", "basis_ref": r["basis_ref"],
                               "notes": r["notes"]},
                   origin="crosswalk", crosswalk_file="crosswalks/nation-successor-research.csv",
                   evidence=[sid] if sid else None,
                   successor_status="disputed" if r["disputed"] == "true" else "unreviewed")


# --- Royce cessions as GeoFeatures (J5 P1-09, P1-10) ----------------------------------
CESSION_EVENTS = ROOT / "data" / "derived" / "cession-events.json"


def build_geofeatures(cross, alias_index):
    if not CESSION_EVENTS.exists():
        issue("info", "no_cession_events", "data/derived/cession-events.json", "", "Run npm run data:geometry to add Royce cessions.")
        return
    events = json.loads(CESSION_EVENTS.read_text(encoding="utf-8"))
    frx = fr_index(cross)
    for o in cross.get("usfs-tribe-name-overrides.csv", []):
        if o["nation_id"] in G.nodes:
            frx[fr_key(o["name_in_usfs"])] = o["nation_id"]
        else:
            issue("error", "override_unknown_nation", "usfs-tribe-name-overrides.csv", o["nation_id"], "Override names a nation that does not exist.")
    links = defaultdict(list)
    for r in cross.get("instrument-royce.csv", []):
        links[r["cessnum"]].append(r)
    for ev in events:
        gid = ev["id"]
        missing = ev["geometry_quality"] == "missing"
        first = ev["dates"][0]["date"] if ev["dates"] else None
        G.add_node("GeoFeature", gid, f"Royce cession {ev['cessnum']}" + (f" ({first})" if first else ""),
                   "data/derived/cession-events.json", ev["cessnum"], "medium", "levels",
                   {"geometry_role": "cession", "boundary_type": "map_generalization",
                    "date_semantic_note": "Dates are Royce Schedule dates (USFS cessdate1-5): the instrument dates Royce gave, not necessarily the date the land changed hands.",
                    "geometry_file": "none" if missing else "layers/cessions.json",
                    "geometry_source": {"dataset": "USDA Forest Service, Tribal Lands Ceded to the United States (EDW_TribalCessionLands_01)",
                                        "license": "CC BY 4.0 per Data.gov (owner decision 2026-10-17; see data/licenses/registry.yaml)",
                                        "original_source": "C. C. Royce, Indian Land Cessions in the United States (1899)",
                                        "georeferencing": "USFS georeferencing of Royce's 1899 maps", "digitization_notes": None,
                                        "reviewed_against_treaty_text": "no", "reviewer": None},
                    "uncertainty": {"tier": "T4" if missing else "T3",
                                    "reason": "No geometry in the USFS layer." if missing else "Boundaries from Royce's c. 1:2,000,000 maps; positional accuracy not stated; not a legal description.",
                                    "min_display_scale": None, "render": "schematic" if missing else "dashed"},
                    "version": {"semver": "1.0.0", "changed": "2026-10-17", "change_note": "First import from the USFS layer.", "change_id": None},
                    "royce_cession_number": ev["cessnum"], "dates": ev["dates"], "t_first": ev["t_first"], "t_last": ev["t_last"],
                    "legal_type": ev["legal_type"], "legal_type_basis": ev["legal_type_basis"],
                    "statute_url": ev["statute_url"], "executive_order_url": ev["executive_order_url"], "maps": ev["maps"],
                    "tribes_as_named_in_schedule": ev["tribes_as_named_in_schedule"],
                    "present_day_tribes_per_usfs": ev["present_day_tribes_per_usfs"],
                    "states": ev["states"], "counties": ev["counties"], "citations": ev["citations"],
                    "geometry_quality": ev["geometry_quality"]},
                   flags=["geometry_missing"] if missing else [], data_class="P", origin="external_dataset",
                   notes="geometry_role is 'cession' for every USFS feature: no field in the source distinguishes cessions from reservations.")
        G.add_edge("derived_from", gid, "GEO-001", "asserted_by_seed", "high", "seed_fk", "USFS layer feature",
                   "data/derived/cession-events.json", ev["cessnum"], basis="Feature of the USFS Tribal Lands Ceded layer.",
                   origin="external_dataset")
        for code in ev["states"]:
            if code in STATE_NAME_BY_CODE:
                G.add_edge("located_in", gid, get_state_place(code), "asserted_by_seed", "high", "seed_list_field", "USFS state field",
                           "data/derived/cession-events.json", ev["cessnum"], basis="State listed in the USFS table.", origin="external_dataset")
        for lk in links.get(ev["cessnum"], []):
            if lk["instrument_id"] not in G.nodes or lk["status"] == "rejected":
                continue
            status = "accepted" if lk["status"] == "accepted" else "proposed"
            conf = "high" if status == "accepted" else ("medium" if lk["status"] == "proposed" else "low")
            G.add_edge("depicts", gid, lk["instrument_id"], status, conf, "crosswalk_manual", lk["match_keys"],
                       "crosswalks/instrument-royce.csv", f"{lk['cessnum']}#{lk['date_n']}", basis=lk["basis"],
                       qualifiers={"role": f"date{lk['date_n']}", "match_keys": lk["match_keys"], "crosswalk_status": lk["status"]},
                       origin="crosswalk", crosswalk_file="crosswalks/instrument-royce.csv")
            inst = G.nodes[lk["instrument_id"]]
            if ev["cessnum"] not in inst.setdefault("royce_cession_numbers", []):
                inst["royce_cession_numbers"].append(ev["cessnum"])
        for name in ev["present_day_tribes_per_usfs"]:
            nid = frx.get(fr_key(name))
            hits = [nid] if nid else [h for h, _, _ in alias_index.find(name)]
            if not hits:
                issue("info", "usfs_present_day_name_unmatched", "data/derived/cession-events.json", ev["cessnum"],
                      f"USFS present-day tribe '{name}' matches no Nation node.")
            for h in dict.fromkeys(hits):
                G.add_edge("attributed_to_nation", gid, h, "proposed", "medium", "seed_list_field" if nid else "alias_text_match",
                           "USFS presdaytrb field", "data/derived/cession-events.json", ev["cessnum"],
                           basis=f"USFS lists '{name}' as a present-day tribe for this cession (attribution under review).",
                           qualifiers={"role": "present_day_per_usfs", "name_in_source": name}, origin="external_dataset")
        for name in ev["tribes_as_named_in_schedule"]:
            for h in dict.fromkeys(nid for nid, _, _ in alias_index.find(name)):
                G.add_edge("attributed_to_nation", gid, h, "proposed", "medium", "alias_text_match",
                           "Royce Schedule tribe name", "data/derived/cession-events.json", ev["cessnum"],
                           basis=f"Royce's Schedule names '{name}' for this cession.",
                           qualifiers={"role": "named_in_royce_schedule", "name_in_source": name}, origin="external_dataset")
    for n in G.nodes.values():
        if n["type"] == "Instrument" and n.get("royce_cession_numbers"):
            n["royce_cession_numbers"] = sorted(n["royce_cession_numbers"], key=lambda c: (len(c), c))


# --- Sources from URLs ------------------------------------------------------------------
URL_RE = re.compile(r"https?://[^\s;|<>\"']+")


def extract_urls(text):
    urls = []
    for u in URL_RE.findall(text or ""):
        u = u.rstrip(".,;]")
        # strip a closing parenthesis only when it is not part of the URL ("..._(1868)" keeps it)
        while u.endswith(")") and u.count(")") > u.count("("):
            u = u[:-1].rstrip(".,;]")
        if u not in urls:
            urls.append(u)
    return urls


def classify_domain(domain, org_domains):
    d = domain.lower().removeprefix("www.")
    if any(d.endswith(x) for x in PRIMARY_DOMAINS):
        return "primary_record"
    if any(d.endswith(x) for x in LEGAL_MIRROR_DOMAINS):
        return "legal_text_mirror"
    if any(d.endswith(x) for x in POINTER_DOMAINS):
        return "pointer_only"
    if d in org_domains:
        return "self_described"
    if any(x in d for x in NEWS_DOMAINS):
        return "news"
    if any(d.endswith(x) for x in SECONDARY_DOMAINS) or d.endswith(".edu") or d.endswith(".gov"):
        return "authoritative_secondary"
    return "unclassified"


def get_source_node(url, org_domains):
    parsed = urlparse(url)
    key = f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{parsed.path.rstrip('/')}" + (f"?{parsed.query}" if parsed.query else "")
    sid = "src-" + stable_hash(key, n=10)
    if sid not in G.nodes:
        tier = classify_domain(parsed.netloc, org_domains)
        label = (parsed.netloc.lower().removeprefix("www.") + parsed.path)[:90]
        G.add_node("Source", sid, label, "build_graph.py (URL columns of the seeds)", url, "low", "levels",
                   {"source_kind": "url", "url": url, "domain": parsed.netloc.lower(), "source_tier": tier, "tier_basis": "domain_heuristic",
                    "publisher": None, "content": None, "format": None, "license_or_terms": None, "update_status": None, "fit_for_timeslider": None},
                   data_class="R" if tier in ("pointer_only", "news") else "P", origin="computed")
    return sid


# --------------------------------------------------------------------------------------
# 4. Edges
# --------------------------------------------------------------------------------------
# --- Nation alias matching --------------------------------------------------------------
class AliasIndex:
    """Finds nation names inside free text. Longest alias first, and a matched stretch is blanked out so
    shorter aliases cannot match inside it (so 'Cheyenne River Sioux' is never also 'Sioux')."""

    def __init__(self, alias_rows):
        items = []
        for a in alias_rows:
            text = norm_text(a["alias"])
            # nation_ids "NONE" marks a blocker: it uses up the text so a shorter alias cannot match inside it.
            ids = [] if a["nation_ids"].strip() == "NONE" else a["nation_ids"].split(";")
            items.append({"text": text, "ids": ids, "kind": a["alias_kind"], "only_in": a.get("only_in", "").strip(),
                          "regex": re.compile(r"(?<![a-z0-9])" + re.escape(text) + r"(?![a-z0-9])")})
        self.items = sorted(items, key=lambda i: -len(i["text"]))

    def find(self, text, context=""):
        t = norm_text(text)
        hits = []
        for it in self.items:
            if it["only_in"] and it["only_in"] != context:
                continue
            blanked, n = it["regex"].subn(lambda m: " " * len(m.group(0)), t)
            if n:
                t = blanked
                for nid in it["ids"]:
                    hits.append((nid, it["text"], it["kind"]))
        return hits


def party_text(text):
    """Treaty party lists end where the place begins ('Choctaw at Dancing Rabbit Creek' -> 'Choctaw')."""
    return re.split(r"\sat\s", text, maxsplit=1)[0]


def add_nation_edges(alias_index, overrides):
    unresolved_strings = defaultdict(list)
    remove = {(o["source_table"], o["source_id"], o["nation_id"]) for o in overrides if o["action"] == "remove"}

    def link(edge_type, src_id, text, context, table, source_file, id_for_override, rule_prefix):
        hits = alias_index.find(text, context)
        seen = set()
        made = 0
        for nid, alias, kind in hits:
            if (table, id_for_override, nid) in remove or nid in seen:
                continue
            seen.add(nid)
            if edge_type == "party_to":
                G.add_edge("party_to", nid, src_id, "proposed", "medium", "alias_text_match", f"{rule_prefix}: alias '{alias}' ({kind})",
                           source_file, src_id, basis="Party name matched an alias in crosswalks/nation-aliases.csv; not reviewed by the nation.",
                           qualifiers={"role": "named_party", "matched_alias": alias}, origin="computed", crosswalk_file="crosswalks/nation-aliases.csv")
            else:
                G.add_edge("involves_nation", src_id, nid, "proposed", "medium", "alias_text_match", f"{rule_prefix}: alias '{alias}' ({kind})",
                           source_file, src_id, basis="Nation name matched an alias in crosswalks/nation-aliases.csv; not reviewed by the nation.",
                           qualifiers={"match": alias}, origin="computed", crosswalk_file="crosswalks/nation-aliases.csv")
            made += 1
        if made == 0 and text.strip():
            unresolved_strings[table].append((src_id, text))

    for nid, n in list(G.nodes.items()):
        if n["type"] == "Instrument":
            link("party_to", nid, party_text(n["parties_text"] or ""), "treaty", "instrument", n["provenance"]["source_file"], nid, "treaty party text")
        elif n["type"] == "Violation":
            link("involves_nation", nid, n["nations_text"] or "", "violation", "violation", "seed-data/violations-seed.csv", nid, "violation nations text")
        elif n["type"] == "Case":
            link("involves_nation", nid, n["nations_text"] or "", "case", "case", "seed-data/cases-seed.csv", nid, "case nations text")
        elif n["type"] == "Campaign":
            link("involves_nation", nid, n["nation_text"] or "", "campaign", "campaign", "seed-data/campaigns-seed.csv", nid, "campaign nation text")
    for table, items in unresolved_strings.items():
        for src_id, text in items:
            issue("info", "unresolved_nation_text", table, src_id, f"No alias matched: '{text[:140]}'")


def add_tribe_org_edges(data, alias_index):
    for i, r in enumerate(data["tribe-org-map.csv"], start=2):
        org, nation_text = r["org_id"].strip(), r["nation"]
        hits = alias_index.find(nation_text, "map")
        nation_ids = list(dict.fromkeys(h[0] for h in hits))
        if org == "NONE_VERIFIED":
            issue("info", "nation_without_verified_org", "tribe-org-map.csv", nation_text,
                  f"F found no verified organization for '{nation_text}'. Resolved to: {', '.join(nation_ids) or 'no Nation node'}.")
            continue
        if org not in G.nodes:
            issue("error", "unresolved_reference", "tribe-org-map.csv", f"line {i}: {org}", "org_id is not in organizations-seed.csv.")
            continue
        if not nation_ids:
            issue("warn", "unresolved_nation_text", "tribe-org-map.csv", org, f"No alias matched nation string '{nation_text}'.")
            continue
        words = [w for w in re.findall(r"[a-z_]+", r["relationship"].split("(")[0].lower()) if w in F_RELATIONSHIP_WORDS]
        etype = "governing_body_of" if "governing_body" in words else "serves_nation"
        for nid in nation_ids:
            G.add_edge(etype, org, nid, "asserted_by_seed", "medium", "seed_fk", "tribe-org-map row", "seed-data/tribe-org-map.csv", f"line {i}",
                       basis=f"tribe-org-map.csv relationship: {r['relationship'][:160]}",
                       qualifiers={"role": ",".join(words) or "unspecified", "roles": words, "relationship_text": r["relationship"], "nation_label_in_seed": nation_text},
                       crosswalk_file="crosswalks/nation-aliases.csv" if True else None)
            # the nation side of the match was inferred from an alias, so mark it proposed
            G.edges["e-" + stable_hash(etype, org, nid, ",".join(words) or "unspecified")]["status"] = "proposed"
            G.edges["e-" + stable_hash(etype, org, nid, ",".join(words) or "unspecified")]["derivation"]["method"] = "alias_text_match"


def add_nation_structure_edges(cross):
    for r in cross["nation-entities.csv"]:
        if r["part_of"].strip():
            G.add_edge("part_of", r["nation_id"], r["part_of"].strip(), "proposed", "low", "crosswalk_manual", "part_of column of nation-entities.csv",
                       "crosswalks/nation-entities.csv", r["nation_id"], basis="Umbrella label as used in the seeds; not a membership claim.",
                       origin="crosswalk", crosswalk_file="crosswalks/nation-entities.csv")
    for i, r in enumerate(cross["nation-successor-proposals.csv"], start=2):
        G.add_edge("successor_of", r["present_nation_id"], r["party_nation_id"], "proposed", "low", "crosswalk_manual", f"basis_ref: {r['basis_ref']}",
                   "crosswalks/nation-successor-proposals.csv", f"line {i}", basis=r["notes"] or f"Proposed from {r['basis_ref']}",
                   qualifiers={"extent": r["extent"], "disputed": r["disputed"] == "true", "basis_ref": r["basis_ref"]},
                   origin="crosswalk", crosswalk_file="crosswalks/nation-successor-proposals.csv",
                   successor_status="disputed" if r["disputed"] == "true" else "unreviewed")


def add_org_campaign_edges(data):
    for r in data["campaigns-seed.csv"]:
        if r["org_id"].strip():
            G.add_edge("supports_return_of", r["org_id"], r["id"], "asserted_by_seed", "medium", "seed_fk", "campaigns-seed.csv org_id",
                       "seed-data/campaigns-seed.csv", r["id"], basis="org_id is the primary actor or recipient per the campaigns-seed README.",
                       qualifiers={"role": "primary_actor_or_recipient"})
        else:
            issue("info", "campaign_without_org", "campaigns-seed.csv", r["id"], "Headline-only item with no org_id.")


def find_states(text):
    """Find US states in free text: full names, or two-letter codes after a comma / slash / 'and'."""
    found = []
    t = re.sub(r"Washington,?\s*D\.?C\.?", " ", text or "")
    low = t.lower()
    for name, code in US_STATES.items():
        if re.search(r"(?<![a-z])" + re.escape(name) + r"(?![a-z])", low):
            # 'Indian Territory (Oklahoma)' is fine; 'Mississippi' inside 'Mississippi band' is still the state: acceptable for coarse place
            found.append(code)
    for m in re.finditer(r"(?:,|/|\band\b|;)\s*([A-Z]{2})\b", t):
        if m.group(1) in STATE_NAME_BY_CODE:
            found.append(m.group(1))
    return list(dict.fromkeys(found))


def add_place_edges(data):
    for n in list(G.nodes.values()):
        if n["type"] == "Instrument" and n.get("region"):
            pid = f"plc-region-{slugify(n['region'])}"
            if pid in G.nodes:
                G.add_edge("located_in", n["id"], pid, "asserted_by_seed", "medium", "seed_fk", "treaties-seed region", "seed-data/treaties-seed.csv", n["id"],
                           basis="Atlas region column of treaties-seed.csv.")
        elif n["type"] == "Campaign":
            for code in find_states(n.get("location_text")):
                G.add_edge("located_in", n["id"], get_state_place(code), "proposed", "medium", "region_text_match", "state name or code in location",
                           "seed-data/campaigns-seed.csv", n["id"], basis=f"location text: {n.get('location_text')}", origin="computed")
        elif n["type"] == "Violation":
            for code in find_states(n.get("region_text")):
                G.add_edge("located_in", n["id"], get_state_place(code), "proposed", "medium", "region_text_match", "state name in region text",
                           "seed-data/violations-seed-notes.csv", n["id"], basis=f"region text: {n.get('region_text')}", origin="computed")
        elif n["type"] == "Organization":
            for code in find_states(n.get("region_text")):
                G.add_edge("operates_in", n["id"], get_state_place(code), "proposed", "medium", "region_text_match", "state name or code in region",
                           "seed-data/organizations-seed.csv", n["id"], basis=f"region text: {n.get('region_text')}", origin="computed")


def add_era_edges():
    eras = sorted((n for n in G.nodes.values() if n["type"] == "PolicyEra"), key=lambda n: n["start_year"])
    first = eras[0]["start_year"]

    def era_for(year):
        chosen = None
        for e in eras:
            if e["start_year"] <= year:
                chosen = e
        return chosen

    for n in list(G.nodes.values()):
        year, etype = None, None
        if n["type"] == "Instrument":
            year, etype = year_of(n.get("date_signed")), "enacted_during"
        elif n["type"] in ("Statute", "Case"):
            year, etype = n.get("year"), "enacted_during"
        elif n["type"] == "Violation":
            year, etype = n.get("year_start"), "occurred_during"
        elif n["type"] == "Campaign":
            year, etype = n.get("start_year"), "occurred_during"
        if not etype:
            continue
        if year is None:
            if n["type"] in ("Violation", "Campaign"):
                issue("info", "no_era", n["provenance"]["source_file"], n["id"], "No start year, so no policy era edge.")
            continue
        era = era_for(year)
        if era is None:
            issue("info", "no_era", n["provenance"]["source_file"], n["id"], f"Year {year} is before the first policy era ({first}); no era edge (colonial context).")
            continue
        gap = year > era["end_year"]
        G.add_edge(etype, n["id"], era["id"], "proposed", "medium", "year_rule", "latest era whose start_year <= year (era-start rule)",
                   "build_graph.py", n["id"], basis=f"year {year} -> {era['id']} ({era['start_year']}-{era['end_year']})" + ("; falls in a gap between eras" if gap else ""),
                   qualifiers={"year": year, "gap_year": gap}, origin="computed")


def add_doctrine_edges():
    for n in list(G.nodes.values()):
        if n["type"] in ("Case", "Statute"):
            for tag in n.get("doctrine_tags", []):
                G.add_edge("applies_doctrine", n["id"], f"doctrine-{tag}", "asserted_by_seed", "medium", "seed_list_field", "doctrines column",
                           n["provenance"]["source_file"], n["id"], basis="Tag in the doctrines column (C3 controlled vocabulary).")


def resolve_statute(sid, merge):
    return merge.get(sid, sid)


def add_crosswalk_edges(cross, merge):
    # violation -> instrument / statute
    stat_cite_ok, stat_cite_bad = 0, []
    linked_viol = defaultdict(set)
    for i, r in enumerate(cross["violation-instrument-links.csv"], start=2):
        vid, iid = r["violation_id"], resolve_statute(r["instrument_id"], merge)
        target_type = G.nodes.get(iid, {}).get("type")
        etype = r["edge_type"]
        if etype == "violated_by":
            G.add_edge("violated_by", iid, vid, "proposed", "medium" if r["role"] in ("primary", "secondary") else "low", "crosswalk_manual",
                       f"role={r['role']}", "crosswalks/violation-instrument-links.csv", f"line {i}", basis=r["basis"],
                       qualifiers={"role": r["role"]}, origin="crosswalk", crosswalk_file="crosswalks/violation-instrument-links.csv")
        else:
            G.add_edge("enabled_by", vid, iid, "proposed", "medium", "crosswalk_manual", f"role={r['role']}",
                       "crosswalks/violation-instrument-links.csv", f"line {i}", basis=r["basis"], qualifiers={"role": r["role"]},
                       origin="crosswalk", crosswalk_file="crosswalks/violation-instrument-links.csv")
        linked_viol[vid].add(iid)
    for i, r in enumerate(cross["violation-statute-links.csv"], start=2):
        G.add_edge("enabled_by", r["violation_id"], resolve_statute(r["statute_id"], merge), "proposed", "medium" if r["role"] != "context" else "low",
                   "crosswalk_manual", f"role={r['role']}", "crosswalks/violation-statute-links.csv", f"line {i}", basis=r["basis"],
                   qualifiers={"role": r["role"]}, origin="crosswalk", crosswalk_file="crosswalks/violation-statute-links.csv")
        linked_viol[r["violation_id"]].add(r["statute_id"])
    # cross-check: every "N Stat. P" printed in a violation's treaty_name should appear on a linked instrument
    for v in [n for n in G.nodes.values() if n["type"] == "Violation"]:
        cites = re.findall(r"(\d+)\s+Stat\.\s+(\d+)", v["treaty_name_text"] or "")
        have = {G.nodes[i].get("stat_cite") for i in linked_viol[v["id"]] if i in G.nodes}
        for a, b in cites:
            if f"{a} Stat. {b}" in have:
                stat_cite_ok += 1
            else:
                stat_cite_bad.append((v["id"], f"{a} Stat. {b}"))
    for vid, cite in stat_cite_bad:
        issue("warn", "stat_cite_crosscheck", "violation-instrument-links.csv", vid, f"{cite} is printed in treaty_name but no linked instrument has that stat_cite.")
    for v in [n for n in G.nodes.values() if n["type"] == "Violation"]:
        if not any(G.nodes[i]["type"] in ("Instrument",) for i in linked_viol[v["id"]] if i in G.nodes):
            issue("info", "violation_without_instrument", "violations-seed.csv", v["id"],
                  f"No instrument in the seeds matches: '{(v['treaty_name_text'] or '')[:110]}'")
    # case -> instrument
    for i, r in enumerate(cross["case-instrument-links.csv"], start=2):
        G.add_edge("concerns_instrument", r["case_id"], r["instrument_id"], "proposed", "medium" if r["role"] == "primary" else "low",
                   "crosswalk_manual", f"role={r['role']}", "crosswalks/case-instrument-links.csv", f"line {i}", basis=r["basis"],
                   qualifiers={"role": r["role"]}, origin="crosswalk", crosswalk_file="crosswalks/case-instrument-links.csv")
    linked_cases = {r["case_id"] for r in cross["case-instrument-links.csv"]}
    for c in [n for n in G.nodes.values() if n["type"] == "Case"]:
        t = (c.get("treaty_at_issue_text") or "")
        if t and not t.lower().startswith("none") and c["id"] not in linked_cases:
            issue("info", "case_treaty_not_linked", "cases-seed.csv", c["id"], f"treaty_at_issue names an instrument that is not in the treaty seeds: '{t[:110]}'")
    # case/statute/doctrine edges from C3
    for i, r in enumerate(cross["case-doctrine-statute-edges.csv"], start=2):
        src, tgt = r["source_id"], r["target_id"]
        # C3 wrote some responds_to edges case -> statute. The schema says responds_to goes statute -> case, so swap them.
        # (A flipped "limits" row was already written in the right direction and is not swapped.)
        if r["edge_type"] == "responds_to" and r["flipped_from_c3"] == "yes":
            src, tgt = tgt, src
        G.add_edge(r["edge_type"], src, tgt, "proposed", "medium", "c3_seed_edge", "C3 Part 4 seed edge",
                   "crosswalks/case-doctrine-statute-edges.csv", f"line {i}", basis=r["basis"],
                   qualifiers={"direction_flipped_from_c3": r["flipped_from_c3"] == "yes"}, origin="crosswalk",
                   crosswalk_file="crosswalks/case-doctrine-statute-edges.csv")
    # campaign -> violation
    for i, r in enumerate(cross["campaign-violation-links.csv"], start=2):
        G.add_edge("remedies", r["campaign_id"], r["violation_id"], "proposed", "low", "crosswalk_manual", f"role={r['role']}",
                   "crosswalks/campaign-violation-links.csv", f"line {i}", basis=r["basis"], qualifiers={"role": r["role"]},
                   origin="crosswalk", crosswalk_file="crosswalks/campaign-violation-links.csv")
    return stat_cite_ok, len(stat_cite_bad)


# --- violation -> case by parsing the free-text related_cases column ----------------------
REPORTER_RE = re.compile(r"(\d+)\s+(U\.S\.|F\.2d|F\.3d|F\.4th|F\. Supp\. 2d|F\. Supp\.|F\. Cas\.|Ct\. Cl\.)\s+(\d+)")


def name_tokens(text):
    t = norm_text(text)
    t = re.sub(r"\bunited states ex rel\.?", " ", t)
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    stop = {"v", "the", "of", "inc", "co", "corp", "et", "al", "and", "indian", "indians", "tribe", "nation", "united", "states", "state", "district", "county", "court"}
    return {w for w in t.split() if w not in stop and len(w) > 1}


def split_outside_brackets(text, sep=";"):
    """Split on ';' but not inside (...) or [...], so '[docket not confirmed; see note]' stays in one piece."""
    parts, depth, cur = [], 0, []
    for ch in text:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth = max(0, depth - 1)
        if ch == sep and depth == 0:
            parts.append("".join(cur))
            cur = []
        else:
            cur.append(ch)
    parts.append("".join(cur))
    return parts


def add_violation_case_edges():
    cases = [n for n in G.nodes.values() if n["type"] == "Case"]
    by_cite = defaultdict(list)
    for c in cases:
        for m in REPORTER_RE.finditer(c["full_citation"]):
            by_cite[m.groups()].append(c)
    for v in [n for n in G.nodes.values() if n["type"] == "Violation"]:
        text = v.get("related_cases_text")
        if not text:
            continue
        for seg in [s.strip() for s in split_outside_brackets(text) if s.strip()]:
            seg_clean = re.sub(r"\[[^\]]*\]", "", seg).strip()
            matched, how, conf = [], None, "medium"
            cites = REPORTER_RE.findall(seg_clean)
            for c in cites:
                matched += by_cite.get(c, [])
            if matched:
                how, conf = "reporter citation " + " ".join(cites[0]), "high"
            else:
                year_m = re.findall(r"\((?:[^()]*?)(\d{4})\)", seg_clean)
                party_part = re.split(r",\s*\d|\s\(", seg_clean)[0]
                toks = name_tokens(party_part)
                if year_m and toks:
                    y = int(year_m[-1])
                    for c in cases:
                        ctoks = name_tokens(re.split(r",\s*\d", c["full_citation"])[0] + " " + c["short_name"])
                        if c["year"] == y and len(toks & ctoks) >= max(1, min(len(toks), 2)) and toks <= ctoks | {"v"}:
                            matched.append(c)
                    if matched:
                        how = f"party names + year {y}"
            matched = list({c["id"]: c for c in matched}.values())
            if not matched:
                issue("info", "related_case_not_matched", "violations-seed.csv", v["id"], f"No case node for: '{seg[:120]}'")
                continue
            for c in matched:
                G.add_edge("adjudicated_in", v["id"], c["id"], "proposed", conf, "citation_text_match", how,
                           "seed-data/violations-seed.csv", v["id"], basis=f"related_cases text segment: {seg[:140]}",
                           qualifiers={"match": how}, origin="computed")


def add_evidence_edges(data):
    """Every URL in a seed row becomes a Source node and an evidenced_by edge."""
    org_domains = set()
    for r in data["organizations-seed.csv"]:
        for u in extract_urls(r["website"]):
            org_domains.add(urlparse(u).netloc.lower().removeprefix("www."))
    url_cols = {  # node type -> function that returns the URLs for that node
        "Instrument": lambda n, rows: extract_urls(rows["treaties"].get(n["id"], {}).get("source_url", "")),
        "Case": lambda n, rows: extract_urls(rows["cases"].get(n["id"], {}).get("source_url", "")),
        "Statute": lambda n, rows: extract_urls(rows["statutes"].get(n["id"], {}).get("source_url", "")),
        "Violation": lambda n, rows: extract_urls(rows["violations"].get(n["id"], {}).get("source_urls", "")),
        "Campaign": lambda n, rows: extract_urls(rows["campaigns"].get(n["id"], {}).get("source_url", "")),
        "PolicyEra": lambda n, rows: extract_urls(rows["eras"].get(n["id"], {}).get("sources", "")),
        "Organization": lambda n, rows: extract_urls(rows["orgs"].get(n["id"], {}).get("website", "")),
    }
    rows = {
        "treaties": {r["id"]: r for r in data["treaties-seed.csv"]}, "cases": {r["id"]: r for r in data["cases-seed.csv"]},
        "statutes": {r["id"]: r for r in data["statutes-seed.csv"]}, "violations": {r["id"]: r for r in data["violations-seed.csv"]},
        "campaigns": {r["id"]: r for r in data["campaigns-seed.csv"]}, "eras": {r["id"]: r for r in data["policy-eras-seed.csv"]},
        "orgs": {r["id"]: r for r in data["organizations-seed.csv"]},
    }
    # statutes that were merged from treaties-seed rows also keep that row's url
    for n in list(G.nodes.values()):
        fn = url_cols.get(n["type"])
        if not fn:
            continue
        urls = fn(n, rows)
        if n["type"] == "Statute":
            for alias in n["aliases"]:
                urls += [u for u in extract_urls(rows["treaties"].get(alias, {}).get("source_url", "")) if u not in urls]
        for u in urls:
            sid = get_source_node(u, org_domains)
            tier = G.nodes[sid]["source_tier"]
            G.add_edge("evidenced_by", n["id"], sid, "asserted_by_seed", "medium", "seed_list_field", "URL column of the seed row",
                       n["provenance"]["source_file"], n["id"], basis="URL listed in the seed row.",
                       qualifiers={"role": "self_description" if tier == "self_described" else tier, "tier": tier})
    # Organizations with a donation url but no website are not given a Source: donation_url is an attribute, never evidence.


def build_beyond_federal(cross):
    """Nations beyond the federal list: state-recognized, terminated, petitioning and other documented
    communities (crosswalks/nations-beyond-federal-list.csv, one sourced fact per row)."""
    rows = cross.get("nations-beyond-federal-list.csv", [])
    by_id = defaultdict(list)
    for r in rows:
        by_id[r["nation_id"]].append(r)
    # status shown when a nation has several facts: the federal list wins, then the most specific
    rank = ["listed_federal_register_2026", "state_recognized", "terminated_not_restored",
            "petitioning_federal_acknowledgment", "state_recognition_withdrawn", "not_federally_recognized"]
    for nid, facts in sorted(by_id.items()):
        first = facts[0]
        if nid not in G.nodes:
            G.add_node("Nation", nid, first["name"], "crosswalks/nations-beyond-federal-list.csv", nid,
                       "medium" if any(f["confidence"] == "high" for f in facts) else "low", "levels",
                       {"entity_kind": "present_day_government", "federal_recognition": "not_federally_recognized",
                        "legal_context": "standard", "region": blank_to_none(first["state_or_region"]),
                        "names": [{"name": first["name"], "kind": "preferred_label", "review": "unreviewed"}],
                        "endonym_status": "none_recorded"},
                       scope="nation_specific", origin="crosswalk")
        node = G.nodes[nid]
        records = node.setdefault("recognition_records", [])
        for f in facts:
            records.append({"status": f["recognition_status"], "detail": blank_to_none(f["recognition_detail"]),
                            "where": blank_to_none(f["state_or_region"]), "year": blank_to_none(f["recognition_year"]),
                            "source_url": f["source_url"], "evidence_quote": blank_to_none(f["evidence_quote"]),
                            "confidence": f["confidence"] if f["confidence"] in ("high", "medium", "low") else "low"})
            if f["name"] != node["label"] and not any(n["name"] == f["name"] for n in node["names"]):
                node["names"].append({"name": f["name"], "kind": "official_name", "review": "unreviewed",
                                      "source_url": f["source_url"], "confidence": f["confidence"] or "medium"})
            for url in (f["source_url"], f["second_source_url"]):
                if url.startswith("http"):
                    sid = get_source_node(url, set())
                    G.add_edge("evidenced_by", nid, sid, "asserted_by_seed", f["confidence"] or "medium", "crosswalk_manual",
                               f"recognition status: {f['recognition_status']}", "crosswalks/nations-beyond-federal-list.csv", nid,
                               basis=(f["evidence_quote"] if url == f["source_url"] else f["second_evidence_quote"]) or None,
                               origin="crosswalk", qualifiers={"role": "recognition_source", "tier": G.nodes[sid]["source_tier"]})
            if f["website"].startswith("http") and not node.get("website"):
                node["website"] = f["website"]
            for other in filter(None, f["disputed_with"].split(";")):
                node.setdefault("disputed_with", [])
                if other not in node["disputed_with"]:
                    node["disputed_with"].append(other)
        statuses = {f["recognition_status"] for f in facts}
        if node.get("federal_recognition") != "listed_federal_register_2026":
            node["federal_recognition"] = next((s for s in rank if s in statuses), "not_federally_recognized")


def add_beyond_federal_edges(cross):
    for i, r in enumerate(cross.get("nations-beyond-federal-list.csv", []), start=2):
        for rel in filter(None, r["related_ids"].split(";")):
            if rel in G.nodes and rel != r["nation_id"]:
                G.add_edge("successor_of", r["nation_id"], rel, "proposed", r["confidence"] or "medium", "crosswalk_manual",
                           "research: community carries this treaty party's history", "crosswalks/nations-beyond-federal-list.csv",
                           f"line {i}", basis=r["recognition_detail"] or None, origin="crosswalk",
                           qualifiers={"extent": "unknown", "disputed": bool(r["disputed_with"]), "basis_ref": r["source_url"]},
                           crosswalk_file="crosswalks/nations-beyond-federal-list.csv",
                           successor_status="disputed" if r["disputed_with"] else "unreviewed")


def build_california_bands(cross):
    """Bands as printed in the 18 unratified California treaties (crosswalks/california-treaty-bands.csv)."""
    for r in cross.get("california-treaty-bands.csv", []):
        gid = r["group_id"]
        if gid and gid not in G.nodes:
            G.add_node("Nation", gid, r["group_label"], "crosswalks/california-treaty-bands.csv", gid, "medium", "levels",
                       {"entity_kind": "peoples_or_confederacy", "federal_recognition": "not_applicable",
                        "legal_context": "standard", "region": "California",
                        "names": [{"name": r["group_label"], "kind": "preferred_label", "review": "unreviewed"}],
                        "endonym_status": "none_recorded"},
                       scope="nation_specific", origin="crosswalk",
                       notes="People or language group named in research on the 1851-52 California treaties.")
        bid = r["band_id"]
        if bid not in G.nodes:
            G.add_node("Nation", bid, r["band_name_as_printed"], "crosswalks/california-treaty-bands.csv", bid,
                       r["confidence"] or "medium", "levels",
                       {"entity_kind": "historical_party", "federal_recognition": "not_applicable",
                        "legal_context": "standard", "region": "California",
                        "names": [{"name": r["band_name_as_printed"], "kind": "preferred_label", "review": "unreviewed"},
                                  {"name": r["band_name_as_printed"], "kind": "source_label", "review": "unreviewed",
                                   "source_url": r["source_url"], "notes": "as printed in the treaty"}],
                        "endonym_status": "none_recorded"},
                       scope="nation_specific", origin="crosswalk",
                       notes=f"Named in an unratified California treaty of 1851-52. People: {r['people_group_text'] or 'not identified'}. {r['notes']}".strip())


def add_california_band_edges(cross):
    for i, r in enumerate(cross.get("california-treaty-bands.csv", []), start=2):
        bid, sid = r["band_id"], (get_source_node(r["source_url"], set()) if r["source_url"].startswith("http") else None)
        conf = r["confidence"] if r["confidence"] in ("high", "medium", "low") else "medium"
        G.add_edge("party_to", bid, r["instrument_id"], "asserted_by_seed", "high", "crosswalk_manual",
                   "band named in the treaty text (Kappler vol. 4)", "crosswalks/california-treaty-bands.csv", f"line {i}",
                   basis=f"Named in the treaty as printed: {r['band_name_as_printed']}.", origin="crosswalk",
                   qualifiers={"role": "named_party"})
        if sid:
            G.add_edge("evidenced_by", bid, sid, "asserted_by_seed", conf, "crosswalk_manual", "identification source",
                       "crosswalks/california-treaty-bands.csv", f"line {i}", basis=r["evidence_quote"] or None,
                       origin="crosswalk", qualifiers={"role": "identification_source", "tier": G.nodes[sid]["source_tier"]})
        if r["group_id"]:
            G.add_edge("part_of", bid, r["group_id"], "proposed", conf, "crosswalk_manual", r["people_group_text"],
                       "crosswalks/california-treaty-bands.csv", f"line {i}", basis=r["evidence_quote"] or None,
                       origin="crosswalk", evidence=[sid] if sid else None)
        for pid in filter(None, r["present_day_ids"].split(";")):
            if pid in G.nodes:
                G.add_edge("successor_of", pid, bid, "proposed", "low" if conf == "medium" else "medium", "crosswalk_manual",
                           "research: present-day community carrying this band's history", "crosswalks/california-treaty-bands.csv",
                           f"line {i}", basis=r["notes"] or None, origin="crosswalk",
                           qualifiers={"extent": "unknown", "disputed": False, "basis_ref": r["source_url"]},
                           crosswalk_file="crosswalks/california-treaty-bands.csv", evidence=[sid] if sid else None,
                           successor_status="unreviewed")


def corrections(cross, action):
    return [r for r in cross.get("nation-corrections.csv", []) if r["action"] == action]


def apply_nation_corrections(cross):
    """Hand corrections from crosswalks/nation-corrections.csv (each row has a source and a reason)."""
    for r in corrections(cross, "set_label"):
        node = G.nodes.get(r["target"])
        if node is None:
            issue("error", "correction_unknown_node", "crosswalks/nation-corrections.csv", r["target"], "No such node.")
            continue
        old = node["label"]
        node["label"] = r["value"]
        node["names"] = [n for n in node["names"] if n["kind"] != "preferred_label"]
        node["names"].insert(0, {"name": r["value"], "kind": "preferred_label", "review": "unreviewed",
                                 "source_url": blank_to_none(r["source_url"]), "notes": r["reason"]})
        if old != r["value"] and not any(n["name"] == old for n in node["names"]):
            node["names"].append({"name": old, "kind": "source_label", "review": "unreviewed",
                                  "notes": "earlier label in this project"})


def mark_disputed_successors(cross):
    for r in corrections(cross, "mark_successor_disputed"):
        present, party = r["target"].split(">")
        hits = [e for e in G.edges.values() if e["type"] == "successor_of" and e["source"] == present and e["target"] == party]
        if not hits:
            issue("warn", "correction_no_edge", "crosswalks/nation-corrections.csv", r["target"], "No successor edge to mark disputed.")
        for e in hits:
            e["qualifiers"]["disputed"] = True
            e["qualifiers"]["dispute_note"] = r["reason"]
            e["review"]["successor_status"] = "disputed"


def apply_instrument_citations(cross):
    """Sourced Statutes at Large and Kappler citations for instruments the seeds left blank
    (crosswalks/instrument-citations.csv, research wave 2026-10-17). Seed values are never overwritten;
    a disagreement is reported."""
    for i, r in enumerate(cross.get("instrument-citations.csv", []), start=2):
        node = G.nodes.get(r["instrument_id"])
        if node is None or node["type"] != "Instrument":
            issue("warn", "citation_row_unknown_instrument", "crosswalks/instrument-citations.csv", f"line {i}",
                  f"No instrument {r['instrument_id']}.")
            continue
        stat = normalize_stat_cite(r["stat_cite"])
        for field, value in (("stat_cite", stat), ("kappler_cite", r["kappler_cite"].strip() or None)):
            if not value:
                continue
            if node.get(field) and node[field] != value:
                issue("warn", "citation_disagrees_with_seed", "crosswalks/instrument-citations.csv", r["instrument_id"],
                      f"{field}: seed has {node[field]!r}, research found {value!r} ({r['source_url']}). Seed kept.")
                continue
            node[field] = value
            if field == "stat_cite":
                node["stat_cite_raw"] = r["stat_cite"].strip()
        if r["source_url"].startswith("http"):
            sid = get_source_node(r["source_url"], set())
            G.add_edge("evidenced_by", node["id"], sid, "asserted_by_seed",
                       r["confidence"] if r["confidence"] in ("high", "medium", "low") else "medium",
                       "crosswalk_manual", "source for the Stat. and Kappler citations", "crosswalks/instrument-citations.csv",
                       f"line {i}", basis=r["evidence_quote"] or None, origin="crosswalk",
                       qualifiers={"role": "citation_source", "tier": G.nodes[sid]["source_tier"]})


def apply_edge_reviews(cross):
    """Human decisions from crosswalks/edge-reviews.csv (written by `npm run links:review`).

    Edge ids are deterministic, so a decision keeps applying on every rebuild. Only a row here can
    make an edge `accepted`; a review for an edge that no longer exists is reported, not dropped silently.
    """
    for i, r in enumerate(cross.get("edge-reviews.csv", []), start=2):
        edge = G.edges.get(r["edge_id"])
        if edge is None:
            issue("warn", "review_for_missing_edge", "crosswalks/edge-reviews.csv", f"line {i}",
                  f"Edge {r['edge_id']} is not in the graph any more; its review ({r['decision']}) is not applied.")
            continue
        if r["decision"] not in ("accepted", "rejected") or not r["reviewer_role"].strip() or not r["date"].strip():
            issue("error", "review_row_incomplete", "crosswalks/edge-reviews.csv", f"line {i}",
                  "decision must be accepted or rejected, with reviewer_role and date.")
            continue
        edge["status"] = r["decision"]
        edge["review"]["reviewer_role"] = r["reviewer_role"].strip()
        edge["review"]["date"] = r["date"].strip()
        if r["notes"].strip():
            edge["qualifiers"]["review_notes"] = r["notes"].strip()


# --------------------------------------------------------------------------------------
# 5. Checks
# --------------------------------------------------------------------------------------
def load_edge_rules():
    schema = json.loads((SCHEMA_DIR / "edges.schema.json").read_text(encoding="utf-8"))
    return schema["x-edge-types"], schema


def check_edge_rules(edge_types):
    """Every edge type must be known and joins the right kinds of nodes. (The JSON Schema repeats this check.)"""
    bad = 0
    for e in G.edges.values():
        rule = edge_types.get(e["type"])
        if not rule:
            issue("error", "unknown_edge_type", "edges", e["id"], f"Edge type '{e['type']}' is not in edges.schema.json.")
            bad += 1
        elif e["source_type"] not in rule["source_types"] or e["target_type"] not in rule["target_types"]:
            issue("error", "edge_endpoint_type", "edges", e["id"], f"{e['type']}: {e['source']} ({e['source_type']}) -> {e['target']} ({e['target_type']}) is not allowed.")
            bad += 1
    return bad


def find_orphans():
    linked = set()
    for e in G.edges.values():
        linked.add(e["source"])
        linked.add(e["target"])
    return sorted(i for i in G.nodes if i not in linked)


def validate_with_jsonschema(nodes_doc, edges_doc):
    try:
        import jsonschema  # noqa: F401
    except ImportError:
        return None, ["jsonschema is not installed: schema validation was SKIPPED (built-in checks still ran)."]
    from jsonschema import Draft202012Validator
    out = []
    for name, doc in (("entities.schema.json", nodes_doc), ("edges.schema.json", edges_doc)):
        schema = json.loads((SCHEMA_DIR / name).read_text(encoding="utf-8"))
        validator = Draft202012Validator(schema)
        errors = sorted(validator.iter_errors(doc), key=lambda e: list(e.absolute_path))
        for err in errors:
            path = "/".join(str(p) for p in list(err.absolute_path)[:3])
            # for oneOf failures the useful message is deeper in the context
            detail = err.message
            if err.context:
                best = sorted(err.context, key=lambda c: len(list(c.absolute_path)), reverse=True)[0]
                detail = f"{best.message} (at {'/'.join(str(p) for p in best.absolute_path)})"
            out.append((name, path, detail[:300]))
    return out, []


# --------------------------------------------------------------------------------------
# 6. Write outputs
# --------------------------------------------------------------------------------------
def validate_crosswalk_rows(cross):
    """Check nation-aliases.csv and nation-successor-proposals.csv rows against the row schemas."""
    from jsonschema import Draft202012Validator
    schema = json.loads((SCHEMA_DIR / "entities.schema.json").read_text(encoding="utf-8"))
    out = []
    for file_name, def_name in (("nation-aliases.csv", "NationAliasRow"), ("nation-successor-proposals.csv", "SuccessorProposalRow")):
        validator = Draft202012Validator({"$ref": f"#/$defs/{def_name}", "$defs": schema["$defs"]})
        for i, row in enumerate(cross[file_name], start=2):
            for err in validator.iter_errors(row):
                out.append((f"crosswalks/{file_name}", f"line {i}", err.message[:300]))
    entity_ids = {r["nation_id"] for r in cross["nation-entities.csv"]}
    for i, row in enumerate(cross["nation-aliases.csv"], start=2):
        for nid in row["nation_ids"].split(";"):
            if nid != "NONE" and nid not in entity_ids:
                out.append(("crosswalks/nation-aliases.csv", f"line {i}", f"nation id '{nid}' is not in nation-entities.csv"))
    for i, row in enumerate(cross["nation-successor-proposals.csv"], start=2):
        for nid in (row["party_nation_id"], row["present_nation_id"]):
            if nid not in entity_ids:
                out.append(("crosswalks/nation-successor-proposals.csv", f"line {i}", f"nation id '{nid}' is not in nation-entities.csv"))
    return out


def write_outputs(validation_errors, validation_notes, orphans, stat_ok, stat_bad):
    BUILD.mkdir(exist_ok=True)
    node_list = sorted(G.nodes.values(), key=lambda n: (TYPE_ORDER.index(n["type"]), n["id"]))
    edge_list = sorted(G.edges.values(), key=lambda e: (e["type"], e["source"], e["target"], e["id"]))
    today = build_date()
    node_counts = Counter(n["type"] for n in node_list)
    edge_counts = Counter(e["type"] for e in edge_list)
    nodes_doc = {"schema_version": SCHEMA_VERSION, "generated": today, "counts": dict(node_counts), "nodes": node_list}
    edges_doc = {"schema_version": SCHEMA_VERSION, "generated": today, "counts": dict(edge_counts), "edges": edge_list}
    return nodes_doc, edges_doc, node_list, edge_list, node_counts, edge_counts


def main():
    data, cross = load_all()

    # nodes
    merge = None
    build_instruments(data, cross)
    merge = build_statutes(data, cross)
    build_doctrines(data)
    build_cases(data)
    build_violations(data)
    build_policy_eras(data)
    build_organizations(data)
    build_research_orgs(data, cross)
    build_campaigns(data)
    build_geodata_sources(data)
    build_nations(cross)
    build_places(data)
    build_present_day_nations(cross)
    build_beyond_federal(cross)
    build_california_bands(cross)
    apply_nation_corrections(cross)
    apply_instrument_citations(cross)  # before the stat-cite cross-check in add_crosswalk_edges

    # edges
    removed_aliases = {norm_text(r["target"]) for r in corrections(cross, "remove_alias")}
    cross["nation-aliases.csv"] = [a for a in cross["nation-aliases.csv"] if norm_text(a["alias"]) not in removed_aliases]
    alias_index = AliasIndex(cross["nation-aliases.csv"] + research_alias_rows(cross))
    apply_name_research(cross, alias_index)
    build_geofeatures(cross, alias_index)
    apply_review_ledger(cross)
    add_nation_edges(alias_index, cross["nation-link-overrides.csv"])
    add_tribe_org_edges(data, alias_index)
    add_research_org_edges(cross)
    add_nation_structure_edges(cross)
    add_org_campaign_edges(data)
    add_place_edges(data)
    add_era_edges()
    add_doctrine_edges()
    stat_ok, stat_bad = add_crosswalk_edges(cross, merge)
    add_successor_research_edges(cross)
    add_beyond_federal_edges(cross)
    add_california_band_edges(cross)
    add_violation_case_edges()
    add_evidence_edges(data)
    mark_disputed_successors(cross)
    apply_edge_reviews(cross)  # last, so every edge exists before a human decision is applied

    # checks
    edge_types, _ = load_edge_rules()
    check_edge_rules(edge_types)
    orphans = find_orphans()
    for oid in orphans:
        issue("warn", "orphan_node", "graph", oid, f"{G.nodes[oid]['type']} node has no edges.")

    nodes_doc, edges_doc, node_list, edge_list, node_counts, edge_counts = write_outputs(None, None, orphans, stat_ok, stat_bad)
    schema_errors, schema_notes = validate_with_jsonschema(nodes_doc, edges_doc)
    # also check the hand-made nation crosswalk rows against the row schemas that ship with entities.schema.json
    if schema_errors is not None:
        schema_errors += validate_crosswalk_rows(cross)

    (BUILD / "nodes.json").write_text(json.dumps(nodes_doc, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    (BUILD / "edges.json").write_text(json.dumps(edges_doc, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    (BUILD / "unresolved.json").write_text(json.dumps({"issues": ISSUES, "orphans": orphans,
                                                       "schema_errors": [{"file": f, "path": p, "message": m} for f, p, m in (schema_errors or [])]},
                                                      indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    write_report(node_list, edge_list, node_counts, edge_counts, orphans, schema_errors, schema_notes, stat_ok, stat_bad)

    print(f"nodes: {len(node_list)}   edges: {len(edge_list)}   orphans: {len(orphans)}   "
          f"schema errors: {'skipped' if schema_errors is None else len(schema_errors)}   issues logged: {len(ISSUES)}")
    print(f"wrote {BUILD}/nodes.json, edges.json, unresolved.json, graph-build-report.md")


def write_report(node_list, edge_list, node_counts, edge_counts, orphans, schema_errors, schema_notes, stat_ok, stat_bad):
    L = []
    add = L.append
    kinds = Counter((i["level"], i["kind"]) for i in ISSUES)
    add("---\ntitle: Graph build report\nauthor: Benjamin Life (@omniharmonic)\ndate: 2026-10-16\nstatus: draft\nconfidence: medium\n---\n")
    add("# Graph build report (draft v0.1)\n")
    add(f"Generated by `scripts/build_graph.py` on {build_date()}. Read with `docs/design/H1-graph-data-model.md`. This report is regenerated on every run; do not edit it by hand.\n")
    add("## 1. Counts\n")
    add("| Node type | Count |\n|---|---|")
    for t in TYPE_ORDER:
        if node_counts.get(t):
            add(f"| {t} | {node_counts[t]} |")
    add(f"| **Total** | **{len(node_list)}** |\n")
    add("| Edge type | Count |\n|---|---|")
    for t, c in sorted(edge_counts.items()):
        add(f"| {t} | {c} |")
    add(f"| **Total** | **{len(edge_list)}** |\n")
    status = Counter(e["status"] for e in edge_list)
    add("Edge status: " + ", ".join(f"{k} {v}" for k, v in sorted(status.items())) + ".\n")
    add("`asserted_by_seed` means a seed field states the link directly. `proposed` means a crosswalk or text match inferred it. **No edge is `accepted`: nothing has been reviewed by a human reviewer, a legal reviewer or a tribal government.**\n")
    inst = [n for n in node_list if n["type"] == "Instrument"]
    add("Instrument breakdown: " + ", ".join(f"{k} {v}" for k, v in sorted(Counter(n['instrument_type'] for n in inst).items())) +
        f". Skeleton (NARA fields only): {sum(1 for n in inst if n['completeness']=='skeleton')}; seeded: {sum(1 for n in inst if n['completeness']=='seeded')}.\n")

    add("## 2. Schema validation\n")
    if schema_errors is None:
        add("**Skipped.** " + " ".join(schema_notes) + "\n")
    elif not schema_errors:
        add("**Passed.** `nodes.json` validates against `entities.schema.json` and `edges.json` validates against `edges.schema.json` (JSON Schema draft 2020-12), including the review/publication rules. The nation alias and successor crosswalk rows also validate against their row schemas, and every nation id they use exists.\n")
    else:
        by_msg = Counter((f, m) for f, p, m in schema_errors)
        add(f"**{len(schema_errors)} validation failures.** Grouped:\n")
        add("| File | Count | Message |\n|---|---|---|")
        for (f, m), c in by_msg.most_common(25):
            add(f"| {f} | {c} | {m[:200].replace('|', '/')} |")
        add("\nFirst 15 with paths:\n")
        for f, p, m in schema_errors[:15]:
            add(f"- `{f}` at `{p}`: {m[:220]}")
        add("")
    add(f"Built-in checks: edge types are all in the schema vocabulary and every edge joins allowed node types (errors logged below if not). Stat-cite cross-check: {stat_ok} citations printed in violation `treaty_name` fields were found on a linked instrument; {stat_bad} were not (listed in section 5).\n")

    add("## 3. Orphan nodes (no edges at all)\n")
    if orphans:
        by_type = defaultdict(list)
        for o in orphans:
            by_type[G.nodes[o]["type"]].append(o)
        add(f"{len(orphans)} orphan nodes.\n")
        for t, ids in by_type.items():
            add(f"- **{t}** ({len(ids)}): " + ", ".join(f"`{i}`" for i in ids[:40]) + (" ..." if len(ids) > 40 else ""))
        add("")
    else:
        add("None.\n")

    add("## 4. Unresolved references and unlinked records\n")
    add("Counts by kind (level / kind / count). The full list with row references is in `build/unresolved.json`.\n")
    add("| Level | Kind | Count |\n|---|---|---|")
    for (lvl, kind), c in sorted(kinds.items()):
        add(f"| {lvl} | {kind} | {c} |")
    add("")

    def section(kind, title, limit=60):
        items = [i for i in ISSUES if i["kind"] == kind]
        if not items:
            return
        add(f"### {title} ({len(items)})\n")
        for i in items[:limit]:
            add(f"- `{i['ref']}` ({i['where']}): {i['message']}")
        if len(items) > limit:
            add(f"- ... {len(items)-limit} more in unresolved.json")
        add("")

    section("unresolved_reference", "Broken references (a crosswalk or seed names an id that does not exist)")
    section("malformed_row", "Malformed CSV rows")
    section("duplicate_node_id", "Duplicate ids")
    section("violation_without_instrument", "Violations with no matching instrument in the treaty seeds", 70)
    section("case_treaty_not_linked", "Cases whose treaty is not in the treaty seeds", 70)
    section("related_case_not_matched", "Violation related_cases text with no matching case node", 70)
    section("stat_cite_crosscheck", "Stat. cite cross-check failures")
    section("nation_without_verified_org", "Nations F marked NONE_VERIFIED", 40)
    section("unresolved_nation_text", "Nation strings with no alias match (alias table needs these or they are out of scope)", 80)
    section("missing_naid", "NARA rows without a NAID")
    section("statute_only_in_treaties_seed", "Statute rows that exist only in treaties-seed.csv")

    add("## 5. Data mismatches and normalizations found in the seeds\n")
    section("data_mismatch", "Mismatches between files")
    section("normalized_value", "Values normalized", 20)
    section("doctrine_count_mismatch", "Doctrine row counts in C3 versus the CSVs", 70)
    section("unknown_doctrine_tag", "Doctrine tags not in the C3 vocabulary")
    section("unparsed_year", "Violation years that could not be parsed")
    section("bad_date_format", "Bad dates")
    section("no_era", "Records with no policy-era edge", 40)

    add("## 6. Coverage numbers\n")
    viol = [n for n in node_list if n["type"] == "Violation"]
    v_with_inst = {e["source"] for e in edge_list if e["type"] == "violated_by"} | {e["target"] for e in edge_list if e["type"] == "violated_by"}
    v_linked = {e["target"] for e in edge_list if e["type"] == "violated_by" and e["source_type"] == "Instrument"}
    v_case = {e["source"] for e in edge_list if e["type"] == "adjudicated_in"}
    v_nation = {e["source"] for e in edge_list if e["type"] == "involves_nation" and e["source_type"] == "Violation"}
    add(f"- Violations linked to at least one instrument: {len(v_linked)} of {len(viol)}.")
    v_with_cases_text = [n for n in viol if n.get("related_cases_text")]
    add(f"- Violations whose seed lists related cases: {len(v_with_cases_text)}; of those, linked to at least one case node: {len([n for n in v_with_cases_text if n['id'] in v_case])}.")
    add(f"- Violations linked to at least one Nation node: {len(v_nation)} of {len(viol)}.")
    cases = [n for n in node_list if n["type"] == "Case"]
    c_inst = {e["source"] for e in edge_list if e["type"] == "concerns_instrument"}
    c_nat = {e["source"] for e in edge_list if e["type"] == "involves_nation" and e["source_type"] == "Case"}
    add(f"- Cases linked to an instrument: {len(c_inst)} of {len(cases)}. Cases linked to a Nation: {len(c_nat)} of {len(cases)}.")
    seeded = [n for n in node_list if n["type"] == "Instrument" and n["completeness"] == "seeded"]
    party = {e["target"] for e in edge_list if e["type"] == "party_to"}
    add(f"- Seeded instruments with at least one party_to edge: {len([n for n in seeded if n['id'] in party])} of {len(seeded)}.")
    all_inst = [n for n in node_list if n["type"] == "Instrument"]
    add(f"- All instruments (including NARA skeleton rows) with at least one party_to edge: {len([n for n in all_inst if n['id'] in party])} of {len(all_inst)}.")
    camps = [n for n in node_list if n["type"] == "Campaign"]
    c_org = {e["target"] for e in edge_list if e["type"] == "supports_return_of"}
    c_nat2 = {e["source"] for e in edge_list if e["type"] == "involves_nation" and e["source_type"] == "Campaign"}
    add(f"- Campaigns with an organization: {len(c_org)} of {len(camps)}; with a Nation: {len(c_nat2)} of {len(camps)}.")
    orgs = [n for n in node_list if n["type"] == "Organization"]
    o_nat = {e["source"] for e in edge_list if e["type"] in ("serves_nation", "governing_body_of")}
    add(f"- Organizations linked to a Nation through tribe-org-map: {len(o_nat)} of {len(orgs)}. Not display-eligible (low confidence, kept as draft): {len([o for o in orgs if not o['display_eligible']])}.")
    succ = [e for e in edge_list if e["type"] == "successor_of"]
    add(f"- Successor edges: {len(succ)}, all `proposed`, all `successor_status` unreviewed or disputed.")
    flags = Counter(f for n in node_list for f in n["flags"])
    add("- Node flags: " + ", ".join(f"{k} {v}" for k, v in sorted(flags.items())) + ".")
    tiers = Counter(n["source_tier"] for n in node_list if n["type"] == "Source")
    add("- Source tiers (domain heuristic, unconfirmed): " + ", ".join(f"{k} {v}" for k, v in sorted(tiers.items())) + ".\n")

    add("## 7. Known limits of this draft\n")
    add("- All links except the seeds' own foreign keys are `proposed`. The crosswalk CSVs were written by the design agent from reading the seed text and have not been checked by a legal reviewer.")
    add("- No GeoFeature or Person nodes exist yet (no geometry has been joined; people are deliberately not modelled).")
    add("- Nation alias matching is text-based and will produce wrong or missing links. Wrong ones are corrected in `crosswalks/nation-link-overrides.csv`; missing ones by adding aliases.")
    add("- Policy-era membership uses the era-start rule. Years in the gaps between eras (1945-1952, 1969) are attached to the earlier era with `gap_year: true`; pre-1763 items get no era.")
    add("- Source tiers come from a short domain list in this script.")
    add("- Every node has `tribal_review.status = not_yet_contacted` and `narrative_allowed = false`. This is true: no nation has been contacted.")
    (BUILD / "graph-build-report.md").write_text("\n".join(L) + "\n", encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
