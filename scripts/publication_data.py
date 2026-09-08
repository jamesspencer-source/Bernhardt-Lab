"""Shared rules for the saved, build-time homepage publication feed."""

from datetime import date
import json
from pathlib import Path
import re


PUBLICATION_COUNT = 6
SEARCH_TERM = "Bernhardt TG[Author]"
FEED_PATH = Path("assets/data/recent-publications.json")
MONTHS = ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")


def is_bernhardt_author(name: str) -> bool:
    normalized = re.sub(r"[^a-z]", "", name.lower())
    return normalized in {"bernhardttg", "thomasgbernhardt", "thomasgordonbernhardt"}


def publication_date(value: str) -> str:
    """Normalize PubMed dates without inventing a day for partial dates."""
    parts = value.strip().split()
    if not parts or not re.fullmatch(r"\d{4}", parts[0]) or len(parts) > 3:
        raise ValueError(f"Unsupported publication date: {value!r}")
    normalized = parts[0]
    if len(parts) > 1:
        month = MONTHS.index(parts[1][:3].title()) + 1
        normalized += f"-{month:02d}"
    if len(parts) > 2:
        normalized += f"-{int(parts[2]):02d}"
    date_sort_key(normalized)
    return normalized


def date_sort_key(value: str) -> date:
    if not re.fullmatch(r"\d{4}(?:-\d{2}){0,2}", value):
        raise ValueError(f"Invalid publication date: {value!r}")
    parts = [int(part) for part in value.split("-")]
    return date(*(parts + [1] * (3 - len(parts))))


def date_label(value: str) -> str:
    parsed = date_sort_key(value)
    if len(value) == 4:
        return value
    month = MONTHS[parsed.month - 1]
    return f"{month} {parsed.day}, {parsed.year}" if len(value) == 10 else f"{month} {parsed.year}"


def publication_sort_key(item: dict) -> tuple:
    return date_sort_key(item["publishedAt"]), int(item["pmid"])


def plain_text(value: object) -> bool:
    return isinstance(value, str) and bool(value.strip()) and value == value.strip() and not re.search(r"[<>]|&(?:lt|gt);", value)


def validate_feed(payload: dict) -> list[dict]:
    if not isinstance(payload, dict) or payload.get("selection") != "journal-published" or payload.get("query") != SEARCH_TERM:
        raise ValueError("Recent publications must use the journal-published Bernhardt author policy")
    items = payload.get("items")
    if not isinstance(items, list) or len(items) != PUBLICATION_COUNT or payload.get("count") != PUBLICATION_COUNT:
        raise ValueError(f"Recent publications must contain exactly {PUBLICATION_COUNT} papers")
    pmids, dois = set(), set()
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Publication must be an object")
        for field in ("title", "journal", "authorsShort", "publishedAt", "pmid"):
            if not plain_text(item.get(field)):
                raise ValueError(f"Publication {field} must be non-empty plain text")
        pmid = item["pmid"]
        if not pmid.isdigit() or pmid in pmids:
            raise ValueError("Duplicate or invalid publication PMID")
        pmids.add(pmid)
        doi = item.get("doi", "")
        if not isinstance(doi, str) or (doi and (not re.fullmatch(r"10\.\d{4,9}/[^\s<>]+", doi) or doi.lower() in dois)):
            raise ValueError("Duplicate or invalid publication DOI")
        if doi:
            dois.add(doi.lower())
        expected_url = f"https://doi.org/{doi}" if doi else f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
        if item.get("articleUrl") != expected_url:
            raise ValueError("Publication URL does not match its DOI or PMID")
        authors = item.get("authors")
        if not isinstance(authors, list) or not all(plain_text(name) for name in authors) or not any(is_bernhardt_author(name) for name in authors):
            raise ValueError("Publication must list Thomas G. Bernhardt as an author")
        if any(token in item["journal"].lower() for token in ("biorxiv", "medrxiv", "preprint")):
            raise ValueError("Preprints are excluded from recent journal publications")
        if date_sort_key(item["publishedAt"]) > date.today():
            raise ValueError("Publication date is in the future")
    if items != sorted(items, key=publication_sort_key, reverse=True):
        raise ValueError("Recent publications must be ordered newest first")
    return items


def load_feed(root: Path) -> list[dict]:
    return validate_feed(json.loads((root / FEED_PATH).read_text(encoding="utf-8")))
