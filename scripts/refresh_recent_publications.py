#!/usr/bin/env python3
"""Refresh the six latest PubMed-indexed journal papers coauthored by Bernhardt TG."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request

from publication_data import (
    FEED_PATH, PUBLICATION_COUNT, SEARCH_TERM, is_bernhardt_author,
    publication_date, publication_sort_key, validate_feed,
)


EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
EXCLUDED_TYPES = {"preprint", "published erratum", "retracted publication", "retraction of publication", "expression of concern"}
JOURNAL_NAMES = {
    "nature microbiology": "Nature Microbiology",
    "nature communications": "Nature Communications",
    "proceedings of the national academy of sciences of the united states of america": "PNAS",
    "journal of the american chemical society": "Journal of the American Chemical Society",
    "mbio": "mBio",
    "current biology : cb": "Current Biology",
}


def fetch_json(endpoint: str, **params) -> dict:
    url = f"{EUTILS_BASE}/{endpoint}.fcgi?" + urllib.parse.urlencode({"db": "pubmed", "retmode": "json", "tool": "bernhardt_lab_website", **params})
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            body = response.read().decode("utf-8")
    except OSError:
        body = subprocess.run(
            ["curl", "-L", "-sS", "--fail", "--connect-timeout", "10", "--max-time", "45", url],
            check=True, capture_output=True, text=True, timeout=50,
        ).stdout
    return json.loads(body)


class CitationText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def citation_text(value: str) -> str:
    parser = CitationText()
    parser.feed(html.unescape(value))
    return " ".join("".join(parser.parts).split())


def select_publications(result: dict, requested_ids: list[str]) -> list[dict]:
    uids = result.get("uids", [])
    if not requested_ids or len(set(requested_ids)) != len(requested_ids) or set(uids) != set(requested_ids):
        raise ValueError("Incomplete or invalid PubMed summary response; keeping the saved feed")
    candidates = []
    for pmid in requested_ids:
        item = result.get(pmid)
        if not isinstance(item, dict) or item.get("error") or str(item.get("uid")) != pmid:
            raise ValueError(f"Missing PubMed record {pmid}; keeping the saved feed")
        authors = [citation_text(author.get("name", "")) for author in item.get("authors", [])]
        if not any(is_bernhardt_author(name) for name in authors):
            continue
        types = {entry.lower() for entry in item.get("pubtype", [])}
        journal = citation_text(item.get("fulljournalname") or item.get("source") or "")
        if types & EXCLUDED_TYPES or any(token in journal.lower() for token in ("preprint", "biorxiv", "medrxiv")):
            continue
        title = citation_text(item.get("title", "")).rstrip(".")
        if title.lower().startswith(("correction:", "author correction:", "retraction:", "erratum:")):
            continue
        doi = next((str(entry["value"]).strip() for entry in item.get("articleids", []) if entry.get("idtype") == "doi"), "")
        candidates.append({
            "pmid": pmid,
            "doi": doi,
            "title": title,
            "journal": JOURNAL_NAMES.get(journal.lower(), journal),
            "publishedAt": publication_date(item.get("epubdate") or item.get("pubdate") or ""),
            "authors": authors,
            "authorsShort": ", ".join(authors) if len(authors) <= 4 else ", ".join(authors[:3]) + ", et al.",
            "articleUrl": f"https://doi.org/{doi}" if doi else f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
        })
    selected, seen_dois = [], set()
    for item in sorted(candidates, key=publication_sort_key, reverse=True):
        doi = item["doi"].lower()
        if doi and doi in seen_dois:
            continue
        if doi:
            seen_dois.add(doi)
        selected.append(item)
    return selected[:PUBLICATION_COUNT]


def refresh(root: Path, retmax: int = 120) -> bool:
    search = fetch_json("esearch", term=SEARCH_TERM, retmax=retmax, sort="pub_date").get("esearchresult", {})
    ids = search.get("idlist", [])
    expected_count = min(int(search.get("count", 0)), retmax)
    if not ids or len(ids) != expected_count or search.get("errorlist"):
        raise ValueError("PubMed search failed or returned incomplete results; keeping the saved feed")
    time.sleep(0.4)  # Stay below NCBI's unauthenticated request-rate limit.
    result = fetch_json("esummary", id=",".join(ids)).get("result", {})
    payload = {
        "source": "PubMed ESummary",
        "query": SEARCH_TERM,
        "selection": "journal-published",
        "count": PUBLICATION_COUNT,
        "items": select_publications(result, ids),
    }
    validate_feed(payload)
    path = root / FEED_PATH
    if path.exists():
        previous = json.loads(path.read_text(encoding="utf-8"))
        previous.pop("generatedAt", None)
        if previous == payload:
            return False
    payload["generatedAt"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, delete=False) as temporary:
        temporary.write(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        temporary_path = Path(temporary.name)
    try:
        temporary_path.replace(path)
    finally:
        temporary_path.unlink(missing_ok=True)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--no-build", action="store_true", help="Update only the saved feed before a separately validated build")
    parser.add_argument("--retmax", type=int, default=120, help="Recent PubMed candidates to inspect (default: 120)")
    args = parser.parse_args()
    if not 6 <= args.retmax <= 1000:
        parser.error("--retmax must be between 6 and 1000")
    changed = refresh(Path(__file__).resolve().parents[1], args.retmax)
    if not args.no_build:
        from site_builder import build_site
        build_site()
    print("Updated the six recent publications." if changed else "No publication changes; saved feed preserved.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
