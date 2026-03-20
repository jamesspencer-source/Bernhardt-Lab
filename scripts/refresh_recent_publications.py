#!/usr/bin/env python3
"""Refresh top recent Bernhardt-last-author publications from PubMed."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List

from site_builder import build_site


SEARCH_TERM = "Bernhardt TG[Author]"
EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"


def fetch_url(url: str, timeout: int = 25) -> str:
    """Fetch URL using urllib; fallback to curl for environments with DNS quirks."""
    try:
        with urllib.request.urlopen(url, timeout=timeout) as response:
            return response.read().decode("utf-8", "ignore")
    except Exception:
        proc = subprocess.run(
            ["curl", "-L", "-sS", "--fail", url],
            check=True,
            capture_output=True,
            text=True,
        )
        return proc.stdout


def fetch_json(url: str, timeout: int = 25) -> Dict[str, Any]:
    payload = fetch_url(url, timeout=timeout)
    return json.loads(payload)


def normalize_last_author(value: str) -> str:
    text = re.sub(r"[^a-z\s]", " ", (value or "").lower())
    return " ".join(text.split())


def is_bernhardt_last_author(last_author: str) -> bool:
    normalized = normalize_last_author(last_author)
    if "bernhardt" not in normalized:
        return False
    if "thomas" in normalized:
        return True
    if "tg" in normalized:
        return True
    tokens = normalized.split()
    return any(token.startswith("t") for token in tokens if token != "bernhardt")


def extract_doi(article_ids: Iterable[Dict[str, Any]]) -> str:
    for article_id in article_ids:
        if str(article_id.get("idtype", "")).lower() == "doi":
            return str(article_id.get("value", "")).strip()
    return ""


def parse_year(pubdate: str) -> str:
    match = re.search(r"(19|20)\d{2}", pubdate or "")
    return match.group(0) if match else ""


def is_preprint_record(item: Dict[str, Any]) -> bool:
    source = str(item.get("source", "")).lower()
    journal = str(item.get("fulljournalname", "")).lower()
    title = str(item.get("title", "")).lower()
    pub_types = [str(entry).lower() for entry in item.get("pubtype", []) if str(entry).strip()]
    preprint_tokens = ("preprint", "biorxiv", "medrxiv")
    if any(token in source for token in preprint_tokens):
        return True
    if any(token in journal for token in preprint_tokens):
        return True
    if any(token in title for token in preprint_tokens):
        return True
    if any("preprint" in value for value in pub_types):
        return True
    return False


def compact_authors(authors: Iterable[Dict[str, Any]], limit: int = 4) -> str:
    names = [str(author.get("name", "")).strip() for author in authors if str(author.get("name", "")).strip()]
    if not names:
        return ""
    if len(names) <= limit:
        return ", ".join(names)
    return ", ".join(names[:3]) + ", et al."


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=int, default=5, help="Number of publications to emit (default: 5)")
    parser.add_argument("--retmax", type=int, default=100, help="PubMed candidate fetch size (default: 100)")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    structured_path = root / "assets" / "data" / "recent-publications.json"

    term_encoded = urllib.parse.quote(SEARCH_TERM)
    esearch_url = (
        f"{EUTILS_BASE}/esearch.fcgi?db=pubmed&retmode=json&retmax={args.retmax}"
        f"&sort=pub+date&term={term_encoded}"
    )
    search_payload = fetch_json(esearch_url)
    id_list = search_payload.get("esearchresult", {}).get("idlist", [])
    if not id_list:
        raise RuntimeError("No PubMed IDs returned for Bernhardt query.")

    joined_ids = ",".join(id_list)
    esummary_url = f"{EUTILS_BASE}/esummary.fcgi?db=pubmed&retmode=json&id={joined_ids}"
    summary_payload = fetch_json(esummary_url)

    result = summary_payload.get("result", {})
    uids = result.get("uids", [])
    publications: List[Dict[str, Any]] = []
    seen_ids = set()

    for pmid in uids:
        item = result.get(str(pmid), {})
        if not isinstance(item, dict):
            continue
        last_author = str(item.get("lastauthor", "")).strip()
        if not is_bernhardt_last_author(last_author):
            continue
        if is_preprint_record(item):
            continue

        title = " ".join(str(item.get("title", "")).split()).strip().rstrip(".")
        if not title:
            continue

        doi = extract_doi(item.get("articleids", []))
        journal = str(item.get("fulljournalname") or item.get("source") or "").strip()
        pubdate = str(item.get("pubdate", "")).strip()
        sort_pub_date = str(item.get("sortpubdate", "")).strip()
        year = parse_year(pubdate)
        authors_short = compact_authors(item.get("authors", []))
        article_url = f"https://doi.org/{doi}" if doi else f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
        identifier = f"pmid:{pmid}"
        if identifier in seen_ids:
            continue
        seen_ids.add(identifier)

        publications.append(
            {
                "pmid": str(pmid),
                "doi": doi,
                "title": title,
                "journal": journal,
                "year": year,
                "pubDate": pubdate,
                "sortPubDate": sort_pub_date,
                "authorsShort": authors_short,
                "articleUrl": article_url,
                "sourceLabel": "PubMed (Bernhardt TG last author)",
                "lastAuthor": last_author,
            }
        )

    if not publications:
        raise RuntimeError("No Bernhardt-last-author publications found in PubMed summary response.")

    publications.sort(
        key=lambda item: (
            item.get("sortPubDate", ""),
            item.get("pubDate", ""),
            item.get("pmid", ""),
        ),
        reverse=True,
    )
    publications = publications[: max(1, args.target)]
    for item in publications:
        item.pop("sortPubDate", None)
        item.pop("lastAuthor", None)

    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    payload = {
        "generatedAt": generated_at,
        "source": "pubmed-esummary-last-author-filter",
        "query": SEARCH_TERM,
        "count": len(publications),
        "items": publications,
    }

    structured_path.parent.mkdir(parents=True, exist_ok=True)
    structured_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    build_site()
    print(f"Wrote {len(publications)} publications to:")
    print(f"  - {structured_path}")
    print("Regenerated canonical and github-flat outputs.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
