#!/usr/bin/env python3

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


EXPECTED_PUBLICATIONS = [
    {
        "title": "The aPBP-type cell wall synthase PBP1b plays a specialized role in fortifying the Escherichia coli division site against osmotic rupture",
        "articleUrl": "https://doi.org/10.1101/2025.04.02.646830",
        "journal": "bioRxiv",
    },
    {
        "title": "The mycomembrane proteins PorH and ProtX are inserted at polar growth zones and linked to the cell wall",
        "articleUrl": "https://doi.org/10.1101/2025.10.14.682376",
        "journal": "bioRxiv",
    },
    {
        "title": "Using fluorescently labeled wheat germ agglutinin to track lipopolysaccharide transport to the outer membrane in Escherichia coli",
        "articleUrl": "https://doi.org/10.1128/mbio.03950-24",
        "journal": "mBio",
    },
    {
        "title": "Synthesis of lipid-linked precursors of the bacterial cell wall is governed by a feedback control mechanism in Pseudomonas aeruginosa",
        "articleUrl": "https://www.nature.com/articles/s41564-024-01603-2",
        "journal": "Nature Microbiology",
    },
    {
        "title": "A role for the Gram-negative outer membrane in bacterial shape determination",
        "articleUrl": "https://doi.org/10.1073/pnas.2301987120",
        "journal": "PNAS",
    },
    {
        "title": "Phage resistance profiling identifies new genes required for biogenesis and modification of the corynebacterial cell envelope",
        "articleUrl": "https://doi.org/10.7554/eLife.79981",
        "journal": "eLife",
    },
]

BANNED_ALUMNI = {
    "catherine-paradis-bleau",
    "derek-lau",
    "kevin-scott-bonham",
}
BANNED_ALUMNI_NAMES = {
    "catherine paradis bleau",
    "derek lau",
    "kevin scott bonham",
}
REQUIRED_FEATURED_ALUMNI = {
    "Jackson Buss",
    "Hoong Chuin Lim",
    "Thao Truong",
    "Chris (Lok-To) Sham",
}
EXPECTED_CHRIS_SHAM = "Chris (Lok-To) Sham"

BANNED_GALLERY_TOKENS = {
    "axe throwing",
    "axe-throwing",
    "lab+axe+throwing+outing",
    "lab group photo, october 2019",
}
REQUIRED_GALLERY_TITLE = "Tom's tenure gift from the lab"
FORBIDDEN_GALLERY_TEXT = "Tom's tenured gift from the lab"

FORBIDDEN_PUBLIC_TEXT = {
    "External verification: not available",
    "Role update pending",
    "&lt;em",
    "&lt;/em",
    "class=&quot;species-name&quot;",
    "class=&#x27;species-name&#x27;",
}
REMOVED_TRAINING_SENTENCE_PREFIX = "We seek a diverse research community"

SOCIAL_ONLY_HOSTS = {
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "threads.net",
    "twitter.com",
    "x.com",
}

PUBLIC_HTML_EXCLUDED_DIRS = {
    ".git",
    ".github",
    "assets",
    "data",
    "docs",
    "game-src",
    "github-flat",
    "leaderboard-worker",
    "node_modules",
    "output",
    "scripts",
    "tmp",
}


def clean_text(value: object = "") -> str:
    return str(value or "").replace("\u00a0", " ").replace("\u2019", "'").strip()


def normalize_name(value: object = "") -> str:
    return re.sub(r"[^a-z0-9]+", " ", clean_text(value).lower()).strip()


def normalize_slug(value: object = "") -> str:
    return re.sub(r"[^a-z0-9]+", "-", clean_text(value).lower()).strip("-")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def is_social_only_url(url: str) -> bool:
    host = (urlparse(clean_text(url)).hostname or "").lower()
    host = host.removeprefix("www.")
    return any(host == bad_host or host.endswith(f".{bad_host}") for bad_host in SOCIAL_ONLY_HOSTS)


def iter_public_html_paths(root: Path) -> list[Path]:
    paths: set[Path] = set()
    for path in root.glob("*.html"):
        paths.add(path)

    for child in root.iterdir():
        if not child.is_dir() or child.name in PUBLIC_HTML_EXCLUDED_DIRS:
            continue
        if child.name == "alumni-profiles":
            paths.update(child.glob("*.html"))
            continue
        index_path = child / "index.html"
        if index_path.exists():
            paths.add(index_path)

    flat_dir = root / "github-flat"
    if flat_dir.exists():
        paths.update(flat_dir.glob("*.html"))

    return sorted(paths)


def relative_label(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def validate_curated_publications(root: Path, errors: list[str]) -> None:
    path = root / "data" / "curated-publications.json"
    items = read_json(path).get("items", [])
    if len(items) != len(EXPECTED_PUBLICATIONS):
        errors.append(f"{relative_label(path, root)} must contain exactly {len(EXPECTED_PUBLICATIONS)} Tom-approved papers.")
        return

    for index, expected in enumerate(EXPECTED_PUBLICATIONS):
        item = items[index]
        for field, expected_value in expected.items():
            actual = clean_text(item.get(field))
            if actual != expected_value:
                errors.append(
                    f"{relative_label(path, root)} item {index + 1} has wrong {field}: expected {expected_value!r}, found {actual!r}."
                )


def validate_people(root: Path, errors: list[str]) -> None:
    path = root / "data" / "people.json"
    people = read_json(path).get("people", [])
    for person in people:
        name = clean_text(person.get("name"))
        normalized_name = normalize_name(name)
        slug = normalize_slug(person.get("slug"))
        if normalized_name in BANNED_ALUMNI_NAMES or slug in BANNED_ALUMNI:
            errors.append(f"{relative_label(path, root)} still contains Tom-removed alumni record: {name or slug}.")
        if "chris" in normalized_name and "sham" in normalized_name and name != EXPECTED_CHRIS_SHAM:
            errors.append(f"{relative_label(path, root)} must use {EXPECTED_CHRIS_SHAM!r}, not {name!r}.")

        verification = person.get("verification") or {}
        verified_url = clean_text(verification.get("url"))
        if verified_url and is_social_only_url(verified_url):
            errors.append(f"{relative_label(path, root)} uses social-only verification for {name}: {verified_url}.")


def validate_featured_alumni(root: Path, errors: list[str]) -> None:
    path = root / "data" / "featured-alumni.json"
    items = read_json(path).get("items", [])
    names = {clean_text(item.get("name")) for item in items}
    slugs = {normalize_slug(item.get("profileSlug")) for item in items}

    missing = sorted(REQUIRED_FEATURED_ALUMNI - names)
    if missing:
        errors.append(f"{relative_label(path, root)} is missing required Tom-approved featured alumni: {', '.join(missing)}.")

    for item in items:
        name = clean_text(item.get("name"))
        normalized_name = normalize_name(name)
        if normalized_name in BANNED_ALUMNI_NAMES or normalize_slug(item.get("profileSlug")) in BANNED_ALUMNI:
            errors.append(f"{relative_label(path, root)} still features Tom-removed alumnus: {name}.")
        if "chris" in normalized_name and "sham" in normalized_name and name != EXPECTED_CHRIS_SHAM:
            errors.append(f"{relative_label(path, root)} must feature {EXPECTED_CHRIS_SHAM!r}, not {name!r}.")

        source = clean_text(item.get("source"))
        if source and is_social_only_url(source):
            errors.append(f"{relative_label(path, root)} uses social-only featured alumni source for {name}: {source}.")

    for banned_slug in BANNED_ALUMNI:
        if banned_slug in slugs:
            errors.append(f"{relative_label(path, root)} still references removed slug {banned_slug}.")


def validate_gallery(root: Path, errors: list[str]) -> None:
    path = root / "data" / "gallery.json"
    items = read_json(path).get("items", [])
    titles = {clean_text(item.get("title")) for item in items}
    if REQUIRED_GALLERY_TITLE not in titles:
        errors.append(f"{relative_label(path, root)} must contain gallery title {REQUIRED_GALLERY_TITLE!r}.")

    for item in items:
        haystack = " ".join(
            [
                clean_text(item.get("title")).lower(),
                clean_text(item.get("image")).lower(),
                clean_text(item.get("alt")).lower(),
                clean_text(item.get("caption")).lower(),
            ]
        )
        for token in BANNED_GALLERY_TOKENS:
            if token in haystack:
                errors.append(f"{relative_label(path, root)} still contains removed gallery item token {token!r}.")
        if FORBIDDEN_GALLERY_TEXT.lower() in haystack:
            errors.append(f"{relative_label(path, root)} must say {REQUIRED_GALLERY_TITLE!r}, not {FORBIDDEN_GALLERY_TEXT!r}.")


def expected_publication_positions(text: str) -> tuple[list[int], list[str]]:
    positions: list[int] = []
    missing: list[str] = []
    for expected in EXPECTED_PUBLICATIONS:
        url = html.escape(expected["articleUrl"], quote=True)
        title = html.escape(expected["title"], quote=True)
        url_index = text.find(url)
        title_index = text.find(title)
        if url_index == -1 or title_index == -1:
            missing.append(expected["title"])
            continue
        positions.append(min(url_index, title_index))
    return positions, missing


def validate_homepage_publications(root: Path, path: Path, text: str, errors: list[str]) -> None:
    label = relative_label(path, root)
    item_count = text.count('class="publication-archive-item"')
    if item_count != len(EXPECTED_PUBLICATIONS):
        errors.append(f"{label} must render exactly {len(EXPECTED_PUBLICATIONS)} homepage publication items, found {item_count}.")

    positions, missing = expected_publication_positions(text)
    if missing:
        errors.append(f"{label} is missing Tom-approved homepage publications: {', '.join(missing)}.")
    elif positions != sorted(positions):
        errors.append(f"{label} renders Tom-approved homepage publications in the wrong order.")

    if REMOVED_TRAINING_SENTENCE_PREFIX in text:
        errors.append(f"{label} still contains the removed Training opportunities sentence beginning {REMOVED_TRAINING_SENTENCE_PREFIX!r}.")


def validate_public_output(root: Path, errors: list[str]) -> None:
    for path in iter_public_html_paths(root):
        text = path.read_text(encoding="utf-8")
        label = relative_label(path, root)
        for forbidden in FORBIDDEN_PUBLIC_TEXT:
            if forbidden in text:
                errors.append(f"{label} contains forbidden public placeholder or escaped markup: {forbidden!r}.")
        if path == root / "index.html" or path == root / "github-flat" / "index.html":
            validate_homepage_publications(root, path, text, errors)


def validate_tom_compliance(root: Path | str | None = None) -> list[str]:
    root_path = Path(root) if root is not None else Path(__file__).resolve().parents[1]
    root_path = root_path.resolve()
    errors: list[str] = []

    validate_curated_publications(root_path, errors)
    validate_people(root_path, errors)
    validate_featured_alumni(root_path, errors)
    validate_gallery(root_path, errors)
    validate_public_output(root_path, errors)

    if errors:
        raise RuntimeError("Tom feedback compliance check failed:\n- " + "\n- ".join(errors))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Tom-requested Bernhardt Lab website content rules.")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="Repository root to validate.")
    args = parser.parse_args()

    try:
        validate_tom_compliance(args.root)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    print("Tom feedback compliance check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
