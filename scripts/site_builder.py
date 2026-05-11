#!/usr/bin/env python3

from __future__ import annotations

import html
import json
import re
import shutil
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import unquote

from validate_tom_compliance import validate_tom_compliance


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
ASSETS_DIR = ROOT / "assets"
FLAT_DIR = ROOT / "github-flat"
CANONICAL_SITE_URL = "https://bernhardtlab.com"
TEAM_ROUTE = "team"
LEGACY_TEAM_ROUTE = "people"
ALUMNI_ROUTE = "alumni"
LEGACY_ALUMNI_PROFILE_ROUTE = "alumni-profiles"
RESEARCH_ROUTE = "research"
LEGACY_RESEARCH_ROUTE = "research-library"
FAVICON_VERSION = "20260504b"
CSS_SOURCE_ORDER = [
    "base.css",
    "layout.css",
    "home.css",
    "directory.css",
]
TEAM_GROUP_SORT_ORDER = {
    "Faculty": 0,
    "Research Staff": 1,
    "Postdoctoral Fellows": 2,
    "Graduate Students": 3,
    "Undergraduate Researchers": 4,
}
PRESERVED_FLAT_ROOT_FILES = {".nojekyll", "CNAME", "robots.txt", "sitemap.xml", "favicon.ico"}
TRANSIENT_NAMES = {".DS_Store", "Thumbs.db", ".pycache", "__pycache__", ".venv"}
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

SPECIES_PATTERNS = [
    re.compile(r"\bEscherichia\s+coli\b", re.I),
    re.compile(r"\bPseudomonas\s+aeruginosa\b", re.I),
    re.compile(r"\bStaphylococcus\s+aureus\b", re.I),
    re.compile(r"\bStreptococcus\s+pneumoniae\b", re.I),
    re.compile(r"\bCorynebacterium\s+glutamicum\b", re.I),
    re.compile(r"\bKlebsiella\s+pneumoniae\b", re.I),
    re.compile(r"\bAcinetobacter\s+baumannii\b", re.I),
    re.compile(r"\bE\.\s*coli\b", re.I),
    re.compile(r"\bP\.\s*aeruginosa\b", re.I),
    re.compile(r"\bS\.\s*aureus\b", re.I),
    re.compile(r"\bS\.\s*pneumoniae\b", re.I),
    re.compile(r"\bC\.\s*glutamicum\b", re.I),
    re.compile(r"\bK\.\s*pneumoniae\b", re.I),
    re.compile(r"\bA\.\s*baumannii\b", re.I),
]

HTML_TAG_PATTERN = re.compile(r"</?[A-Za-z][A-Za-z0-9:-]*(?:\s+[^<>]*)?>")
FAVICON_LINK_PATTERN = re.compile(
    r"\n\s*<link\s+rel=\"(?:icon|shortcut icon|apple-touch-icon)\"[^>]*>",
    re.I,
)
CANONICAL_LINK_PATTERN = re.compile(r"\n\s*<link\s+rel=\"canonical\"[^>]*>", re.I)
PEOPLE_PLAIN_TEXT_FIELDS = [
    "name",
    "labRole",
    "group",
    "bio",
    "labDates",
    "currentRole",
    "profileType",
    "email",
    "profileSummary",
]
SCHEDULED_PEOPLE_TEXT_FIELDS = {
    "name",
    "labRole",
    "group",
    "bio",
    "labDates",
    "currentRole",
    "profileType",
    "email",
    "profileSummary",
}

MONTH_INDEX = {
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "may": 5,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "sept": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12,
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    cleaned = "\n".join(line.rstrip() for line in value.splitlines())
    if value.endswith("\n"):
        cleaned += "\n"
    path.write_text(cleaned, encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def numbered_duplicate_original(name: str) -> str | None:
    match = re.match(r"^(?P<stem>.+?)(?P<suffix> \d+)(?P<extension>\.[^.]+)?$", name)
    if not match:
        return None
    return f"{match.group('stem')}{match.group('extension') or ''}"


def is_numbered_duplicate(name: str, sibling_names: set[str] | None = None) -> bool:
    if sibling_names is None:
        return False
    original_name = numbered_duplicate_original(name)
    if not original_name:
        return False
    return original_name in sibling_names


def is_transient_name(name: str, sibling_names: set[str] | None = None) -> bool:
    return name in TRANSIENT_NAMES or name.startswith("._") or is_numbered_duplicate(name, sibling_names)


def remove_path(path: Path) -> None:
    if path.is_dir():
        shutil.rmtree(path)
    elif path.exists():
        path.unlink()


def ignore_generated_copy_names(_: str, names: list[str]) -> set[str]:
    sibling_names = set(names)
    return {name for name in names if is_transient_name(name, sibling_names)}


def clean_text(value: object = "") -> str:
    return str(value or "").replace("\u00a0", " ").replace("\u2019", "'").strip()


def escape(value: object = "") -> str:
    return html.escape(clean_text(value), quote=True)


def favicon_links(root_prefix: str) -> str:
    prefix = clean_text(root_prefix)
    return "\n".join(
        [
            f'    <link rel="icon" type="image/svg+xml" href="{escape(prefix)}assets/images/brands/favicon.svg?v={FAVICON_VERSION}" />',
            f'    <link rel="icon" type="image/png" sizes="32x32" href="{escape(prefix)}assets/images/brands/favicon-32.png?v={FAVICON_VERSION}" />',
            f'    <link rel="apple-touch-icon" sizes="180x180" href="{escape(prefix)}assets/images/brands/apple-touch-icon.png?v={FAVICON_VERSION}" />',
            f'    <link rel="shortcut icon" href="{escape(prefix)}favicon.ico?v={FAVICON_VERSION}" />',
        ]
    )


def canonical_url(path: str = "") -> str:
    normalized = clean_text(path).strip("/")
    if not normalized:
        return f"{CANONICAL_SITE_URL}/"
    return f"{CANONICAL_SITE_URL}/{normalized}/"


def ensure_canonical_link(text: str, url: str) -> str:
    cleaned = CANONICAL_LINK_PATTERN.sub("", text)
    link = f'\n    <link rel="canonical" href="{escape(url)}" />'
    head_close = cleaned.find("\n  </head>")
    if head_close == -1:
        raise RuntimeError("Could not locate </head> while adding canonical link")
    return f"{cleaned[:head_close]}{link}{cleaned[head_close:]}"


def ensure_favicon_links(text: str, root_prefix: str) -> str:
    cleaned = FAVICON_LINK_PATTERN.sub("", text)
    links = f"\n{favicon_links(root_prefix)}"
    stylesheet_match = re.search(r"\n\s*<link\s+rel=\"stylesheet\"", cleaned)
    if stylesheet_match:
        return f"{cleaned[:stylesheet_match.start()]}{links}{cleaned[stylesheet_match.start():]}"
    head_close = cleaned.find("\n  </head>")
    if head_close == -1:
        raise RuntimeError("Could not locate </head> while adding favicon links")
    return f"{cleaned[:head_close]}{links}{cleaned[head_close:]}"


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", clean_text(value).lower()).strip("-")


def title_case(value: str) -> str:
    words = clean_text(value).lower().split()
    if not words:
        return ""
    keep_lower = {"and", "of", "at", "in", "on", "to", "for"}
    result = []
    for word in words:
        if word in keep_lower:
            result.append(word)
        else:
            result.append(word[:1].upper() + word[1:])
    return " ".join(result).replace("Md", "MD").replace("Phd", "PhD")


def normalize_role_bucket(role: str) -> str:
    label = clean_text(role).lower()
    if not label:
        return "Unspecified"
    if re.search(r"post[\s-]?bacc|post[\s-]?baccalaureate", label):
        return "Post-baccalaureate Alumni"
    if "postdoctoral" in label or "postdoc" in label:
        return "Postdoctoral Alumni"
    if "undergrad" in label or "undergraduate" in label:
        return "Undergraduate Alumni"
    if "graduate" in label:
        return "Graduate Alumni"
    if "technician" in label or "associate" in label or "staff" in label:
        return "Research Staff Alumni"
    return "Other Alumni"


def parse_lab_end_sort_key(lab_dates: str) -> int:
    text = clean_text(lab_dates).lower()
    if not text or re.search(r"\bpresent\b|\bcurrent\b|\bstill here\b|\bongoing\b", text):
        return -1
    month_matches = list(
        re.finditer(r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+((?:19|20)\d{2})\b", text)
    )
    if month_matches:
        month_token, year = month_matches[-1].groups()
        return int(year) * 100 + MONTH_INDEX[month_token]
    years = [int(match.group(1)) for match in re.finditer(r"\b((?:19|20)\d{2})\b", text)]
    return years[-1] * 100 + 12 if years else -1


def last_name_key(name: str) -> str:
    suffixes = {"jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "v"}
    parts = [part for part in clean_text(name).lower().split() if part]
    while parts and parts[-1] in suffixes:
        parts.pop()
    return parts[-1] if parts else clean_text(name).lower()


def format_species_text(value: str) -> str:
    escaped = html.escape(clean_text(value), quote=True)
    for pattern in SPECIES_PATTERNS:
        escaped = pattern.sub(lambda match: f'<em class="species-name">{match.group(0)}</em>', escaped)
    return escaped


def landing_tile_role(person: dict[str, Any]) -> str:
    name = clean_text(person.get("name"))
    group = clean_text(person.get("group"))
    role = clean_text(person.get("labRole"))
    if name == "Thomas Bernhardt":
        return "Professor in the Department of Microbiology at Harvard Medical School and Investigator of the Howard Hughes Medical Institute."
    if name == "James Spencer":
        return "Laboratory Manager, Thomas Bernhardt Lab"
    if group == "Postdoctoral Fellows":
        return "Postdoctoral Fellow"
    if group == "Graduate Students":
        return clean_text(str(role).split("|")[0] or "Graduate Student")
    if group == "Undergraduate Researchers":
        return "Undergraduate Researcher"
    if group == "Research Staff":
        return "Research Staff"
    return role


def resolve_asset_path(path: str, root_prefix: str) -> str:
    return f"{root_prefix}{clean_text(path).lstrip('./')}"


def current_profile_href(person: dict[str, Any], root_prefix: str, flat: bool) -> str:
    slug = clean_text(person.get("slug"))
    return f"team-{slug}.html" if flat else f"{root_prefix}{TEAM_ROUTE}/{slug}/"


def alumni_profile_href(person: dict[str, Any], root_prefix: str, flat: bool) -> str:
    slug = clean_text(person.get("slug"))
    return f"alumni-{slug}.html" if flat else f"{root_prefix}{ALUMNI_ROUTE}/{slug}/"


def home_href(root_prefix: str, flat: bool) -> str:
    if flat:
        return "index.html"
    return f"{root_prefix}" if root_prefix else "./"


def home_section_href(section_id: str, root_prefix: str, flat: bool) -> str:
    fragment = clean_text(section_id).lstrip("#")
    if flat:
        return f"index.html#{fragment}"
    return f"{root_prefix}#{fragment}" if root_prefix else f"#{fragment}"


def site_link(path: str, root_prefix: str, flat: bool) -> str:
    normalized = clean_text(path).strip("/")
    if normalized == LEGACY_TEAM_ROUTE:
        normalized = TEAM_ROUTE
    if normalized == LEGACY_RESEARCH_ROUTE:
        normalized = RESEARCH_ROUTE
    if not normalized:
        return home_href(root_prefix, flat)
    if flat:
        if normalized == TEAM_ROUTE:
            return "team.html"
        if normalized == ALUMNI_ROUTE:
            return "alumni.html"
        if normalized == "accessibility":
            return "accessibility.html"
        if normalized == RESEARCH_ROUTE:
            return "research.html"
        return f"{normalized}.html"
    return f"{root_prefix}{normalized}/"


def replace_marker_block(text: str, start_marker: str, end_marker: str, content: str) -> str:
    pattern = re.compile(rf"({re.escape(start_marker)})(.*)({re.escape(end_marker)})", re.S)
    if not pattern.search(text):
        raise RuntimeError(f"Could not locate marker block {start_marker} / {end_marker}")
    return pattern.sub(rf"\1\n{content}\n\3", text)


def validate_people(people: list[dict[str, Any]]) -> None:
    seen_slugs: set[str] = set()
    for person in people:
        slug = clean_text(person.get("slug"))
        name = clean_text(person.get("name"))
        status = clean_text(person.get("status"))
        if not slug or not name or status not in {"current", "alumni"}:
            raise RuntimeError(f"Invalid person record: {person}")
        if slug in seen_slugs:
            raise RuntimeError(f"Duplicate slug detected: {slug}")
        seen_slugs.add(slug)
        validate_people_plain_text(person)


def validate_no_html_tags(value: object, context: str) -> None:
    text = clean_text(value)
    if text and HTML_TAG_PATTERN.search(text):
        raise RuntimeError(f"{context} must be plain text, not pasted HTML: {text}")


def validate_people_plain_text(person: dict[str, Any]) -> None:
    slug = clean_text(person.get("slug")) or "<missing slug>"
    for field in PEOPLE_PLAIN_TEXT_FIELDS:
        validate_no_html_tags(person.get(field), f"Person {slug} field {field}")

    for index, link in enumerate(person.get("links") or []):
        validate_no_html_tags((link or {}).get("label"), f"Person {slug} links[{index}].label")

    verification = person.get("verification") or {}
    validate_no_html_tags(verification.get("sourceLabel"), f"Person {slug} verification.sourceLabel")
    validate_no_html_tags(verification.get("verifiedSource"), f"Person {slug} verification.verifiedSource")


def validate_scheduled_updates(people: list[dict[str, Any]]) -> None:
    path = DATA_DIR / "scheduled-updates.json"
    if not path.exists():
        return

    payload = read_json(path)
    transitions = payload.get("peopleTransitions", [])
    applied = payload.get("appliedPeopleTransitions", [])
    if not isinstance(transitions, list) or not isinstance(applied, list):
        raise RuntimeError("data/scheduled-updates.json must contain peopleTransitions and appliedPeopleTransitions lists")

    applied_ids = {clean_text(item.get("id")) for item in applied if isinstance(item, dict)}
    pending_ids: set[str] = set()
    people_slugs = {clean_text(person.get("slug")) for person in people}
    for entry in transitions:
        if not isinstance(entry, dict):
            raise RuntimeError(f"Scheduled people transition must be an object: {entry}")
        entry_id = clean_text(entry.get("id"))
        if not entry_id:
            raise RuntimeError(f"Scheduled people transition is missing id: {entry}")
        if entry_id in pending_ids:
            raise RuntimeError(f"Duplicate scheduled people transition id: {entry_id}")
        pending_ids.add(entry_id)
        if entry_id in applied_ids:
            continue

        slug = clean_text(entry.get("slug"))
        if not slug or slug not in people_slugs:
            raise RuntimeError(f"Scheduled people transition {entry_id} has missing or unknown slug: {slug or '<missing>'}")
        try:
            date.fromisoformat(clean_text(entry.get("effectiveDate")))
        except ValueError as exc:
            raise RuntimeError(f"Scheduled people transition {entry_id} has invalid effectiveDate") from exc
        if clean_text(entry.get("status")) != "alumni" or clean_text(entry.get("profileType")) != "alumni":
            raise RuntimeError(f"Scheduled people transition {entry_id} uses unsupported transition target")
        for field in SCHEDULED_PEOPLE_TEXT_FIELDS:
            if field in entry:
                validate_no_html_tags(entry.get(field), f"Scheduled people transition {entry_id} field {field}")


def load_people() -> list[dict[str, Any]]:
    payload = read_json(DATA_DIR / "people.json")
    rows = payload.get("people", [])
    validate_people(rows)
    validate_scheduled_updates(rows)
    return rows


def load_gallery_items() -> list[dict[str, Any]]:
    return read_json(DATA_DIR / "gallery.json").get("items", [])


def load_featured_alumni_items() -> list[dict[str, Any]]:
    return read_json(DATA_DIR / "featured-alumni.json").get("items", [])


def load_curated_publications() -> list[dict[str, Any]]:
    return read_json(DATA_DIR / "curated-publications.json").get("items", [])


def validate_scientific_media_items(items: list[dict[str, Any]]) -> None:
    seen_ids: set[str] = set()
    for item in items:
        item_id = clean_text(item.get("id"))
        item_type = clean_text(item.get("type"))
        src = clean_text(item.get("src"))
        poster = clean_text(item.get("poster"))
        required_text = [
            item_id,
            clean_text(item.get("title")),
            clean_text(item.get("caption")),
            clean_text(item.get("alt")),
            src,
            clean_text(item.get("sourceLabel")),
            clean_text(item.get("archiveSource")),
        ]
        if not all(required_text):
            raise RuntimeError(f"Scientific media item missing required fields: {item}")
        if item_id in seen_ids:
            raise RuntimeError(f"Duplicate scientific media id detected: {item_id}")
        if item_type not in {"image", "video"}:
            raise RuntimeError(f"Scientific media item has invalid type: {item}")
        if not isinstance(item.get("featured"), bool):
            raise RuntimeError(f"Scientific media item featured flag must be boolean: {item}")
        if item_type == "video" and not poster:
            raise RuntimeError(f"Scientific media video requires poster asset: {item}")
        if item_type == "image" and poster:
            raise RuntimeError(f"Scientific media image must not declare poster asset: {item}")
        for asset_path in [src, poster]:
            if not asset_path:
                continue
            if not asset_path.startswith("assets/"):
                raise RuntimeError(f"Scientific media asset must live under assets/: {asset_path}")
            if not (ROOT / asset_path).exists():
                raise RuntimeError(f"Scientific media asset path does not exist: {asset_path}")
        seen_ids.add(item_id)


def load_scientific_media_items() -> list[dict[str, Any]]:
    items = read_json(DATA_DIR / "scientific-media.json").get("items", [])
    validate_scientific_media_items(items)
    return items


def load_site_copy() -> dict[str, Any]:
    payload = read_json(DATA_DIR / "site-copy.json")
    hero_slides = payload.get("heroSlides", [])
    if not isinstance(hero_slides, list) or not hero_slides:
        raise RuntimeError("data/site-copy.json must define a non-empty heroSlides list")
    seen_images: set[str] = set()
    for index, slide in enumerate(hero_slides, start=1):
        image = clean_text((slide or {}).get("image"))
        if not image.startswith("assets/"):
            raise RuntimeError(f"Hero slide {index} must reference an assets/ image path: {image or '<missing>'}")
        if image in seen_images:
            raise RuntimeError(f"Duplicate hero slide image detected: {image}")
        if not (ROOT / image).exists():
            raise RuntimeError(f"Hero slide image does not exist: {image}")
        seen_images.add(image)
    return payload


def load_runtime_config() -> dict[str, Any]:
    return read_json(DATA_DIR / "runtime-config.json")


def current_people(people: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [person for person in people if clean_text(person.get("status")) == "current"]


def alumni_people(people: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = [person for person in people if clean_text(person.get("status")) == "alumni"]
    rows.sort(key=lambda item: (-parse_lab_end_sort_key(clean_text(item.get("labDates"))), last_name_key(clean_text(item.get("name")))))
    return rows


def render_people_cards(people: list[dict[str, Any]], root_prefix: str, flat: bool, view: str) -> str:
    cards = []
    for index, person in enumerate(people):
        name = clean_text(person.get("name"))
        group = clean_text(person.get("group"))
        role_label = clean_text(person.get("labRole"))
        if view == "landing":
            role_label = landing_tile_role(person)
        position_rank = TEAM_GROUP_SORT_ORDER.get(group, len(TEAM_GROUP_SORT_ORDER))
        search_blob = clean_text(
            " ".join(
                [
                    name,
                    clean_text(person.get("labRole")),
                    clean_text(person.get("bio")),
                    group,
                ]
            )
        )
        profile_href = current_profile_href(person, root_prefix, flat)
        bio_html = ""
        bio = clean_text(person.get("bio"))
        if bio:
            bio_class = "person-bio person-bio--directory" if view == "directory" else "person-bio person-bio--compact"
            bio_html = f'<p class="{bio_class}">{format_species_text(bio)}</p>'
        cards.append(
            f'''          <article class="person-card person-card--{view}" style="--index:{index};" data-name="{escape(name)}" data-role="{escape(person.get("labRole"))}" data-group="{escape(group)}" data-bio="{escape(person.get("bio"))}" data-sort-position="{escape(str(position_rank))}" data-sort-last-name="{escape(last_name_key(name))}" data-sort-name="{escape(name.lower())}" data-sort-original="{escape(str(index))}" data-search="{escape(search_blob)}">
            <div class="person-photo-wrap">
              <img class="person-photo" src="{escape(resolve_asset_path(clean_text(person.get("image")), root_prefix))}" alt="{escape(name)}" style="--focus-x:{escape(f"{float(person.get('focus', {}).get('x', 0.5)) * 100:.1f}%")};--focus-y:{escape(f"{float(person.get('focus', {}).get('y', 0.46)) * 100:.1f}%")};" loading="lazy" />
            </div>
            <div class="person-body">
              <p class="person-role">{escape(role_label)}</p>
              <h3>{escape(name)}</h3>
              {bio_html}
              <div class="person-links">
                <a class="person-link" href="{escape(profile_href)}">{'View full profile' if view == 'directory' else 'View profile'}</a>
              </div>
            </div>
          </article>'''
        )
    return "\n".join(cards)


def render_alumni_cards(people: list[dict[str, Any]], root_prefix: str, flat: bool) -> str:
    cards = []
    for person in people:
        verification = person.get("verification") or {}
        verified_url = clean_text(verification.get("url"))
        verified_source = clean_text(verification.get("verifiedSource"))
        source_label = clean_text(verification.get("sourceLabel")) or "Bernhardt lab records"
        current_role = clean_text(person.get("currentRole"))
        lab_dates = clean_text(person.get("labDates"))
        lab_dates_html = (
            f'\n            <p class="alumni-role"><strong>Lab dates:</strong> {escape(lab_dates)}</p>'
            if lab_dates
            else ""
        )
        current_role_html = (
            f'\n            <p class="alumni-current"><strong>Current / latest role:</strong> {escape(current_role)}</p>'
            if current_role
            else ""
        )
        verified_html = (
            f'\n            <p class="alumni-source"><strong>Verified by:</strong> <a class="alumni-inline-link" href="{escape(verified_url)}" target="_blank" rel="noreferrer">{escape(verified_source or "Institutional profile")}</a></p>'
            if verified_url
            else ""
        )
        verified_link_html = (
            f'<a class="alumni-link" href="{escape(verified_url)}" target="_blank" rel="noreferrer">View current institutional profile</a>'
            if verified_url
            else ""
        )
        bucket = normalize_role_bucket(clean_text(person.get("labRole")))
        search_blob = clean_text(
            " ".join(
                [
                    clean_text(person.get("name")),
                    clean_text(person.get("labRole")),
                    clean_text(person.get("labDates")),
                    current_role,
                    bucket,
                ]
            )
        )
        cards.append(
            f'''          <article class="alumni-card" data-name="{escape(person.get("name"))}" data-role-in-lab="{escape(person.get("labRole"))}" data-lab-dates="{escape(person.get("labDates"))}" data-current-role="{escape(person.get("currentRole"))}" data-bucket="{escape(bucket)}" data-sort-recent="{escape(parse_lab_end_sort_key(clean_text(person.get("labDates"))))}" data-sort-last-name="{escape(last_name_key(clean_text(person.get("name"))))}" data-search="{escape(search_blob)}">
            <div class="alumni-top">{'<span class="alumni-verified">Verified profile</span>' if verified_url else ''}</div>
            <h3>{escape(person.get("name"))}</h3>
            <p class="alumni-role"><strong>Role in lab:</strong> {escape(person.get("labRole") or "Former lab member")}</p>{lab_dates_html}{current_role_html}
            <p class="alumni-source"><strong>Source:</strong> {escape(source_label)}</p>{verified_html}
            <div class="alumni-links">
              <a class="alumni-link" href="{escape(alumni_profile_href(person, root_prefix, flat))}">Open alumni profile</a>
              {verified_link_html}
            </div>
          </article>'''
        )
    return "\n".join(cards)


def render_profile_nav(root_prefix: str, flat: bool, current_section: str) -> str:
    team_href = site_link(TEAM_ROUTE, root_prefix, flat)
    alumni_href = site_link(ALUMNI_ROUTE, root_prefix, flat)
    team_current = ' aria-current="page"' if current_section == "team" else ""
    alumni_current = ' aria-current="page"' if current_section == "alumni" else ""
    return f'''          <nav class="top-links" aria-label="Profile navigation">
            <a href="{escape(home_section_href("about", root_prefix, flat))}">About</a>
            <a href="{escape(team_href)}"{team_current}>Team</a>
            <a href="{escape(home_section_href("publications", root_prefix, flat))}">Publications</a>
            <a href="{escape(home_section_href("gallery", root_prefix, flat))}">Gallery</a>
            <a href="{escape(alumni_href)}"{alumni_current}>Alumni</a>
            <a href="{escape(home_section_href("contact", root_prefix, flat))}">Contact</a>
          </nav>'''


def render_current_profile(person: dict[str, Any], flat: bool) -> str:
    root_prefix = "" if flat else "../../"
    role = clean_text(person.get("labRole"))
    name = clean_text(person.get("name"))
    lab_dates = clean_text(person.get("labDates"))
    email = clean_text(person.get("email"))
    links = person.get("links") or []
    action_links = []
    action_links.append(
        f'<a class="button button-primary" href="{escape(site_link(TEAM_ROUTE, root_prefix, flat))}">Back to team directory</a>'
    )
    if email:
        first_name = clean_text(name.split()[0] if name else "the lab")
        action_links.append(
            f'<a class="button button-secondary profile-email-button" href="mailto:{escape(email)}">Contact {escape(first_name)}</a>'
        )
    for link in links:
        href = clean_text(link.get("href"))
        label = clean_text(link.get("label"))
        if not href or not label:
            continue
        action_links.append(
            f'<a class="button button-secondary" href="{escape(href)}" target="_blank" rel="noreferrer">{escape(label)}</a>'
        )
    canonical = canonical_url(f"{TEAM_ROUTE}/{clean_text(person.get('slug'))}")
    return f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="bernhardt-build-mode" content="{'flat' if flat else 'canonical'}" />
    <title>{escape(name)} | Thomas Bernhardt Lab</title>
    <meta name="description" content="Profile for {escape(name)} in the Thomas Bernhardt Lab at Harvard Medical School and the Howard Hughes Medical Institute." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
{favicon_links(root_prefix)}
    <link rel="stylesheet" href="{escape(root_prefix)}assets/profile.css?v=20260407m" />
    <link rel="canonical" href="{escape(canonical)}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="page">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="{escape(home_href(root_prefix, flat))}" aria-label="Thomas Bernhardt Lab home">
            <span class="brand-text">
              <strong>Thomas Bernhardt Lab</strong>
              <small>Howard Hughes Medical Institute + Harvard Medical School</small>
            </span>
          </a>
{render_profile_nav(root_prefix, flat, "team")}
        </div>
      </header>

      <main id="main-content" class="main">
        <section class="profile-shell">
          <article class="profile-hero">
            <div class="profile-copy">
              <p class="eyebrow">Team Profile</p>
              <h1>{escape(name)}</h1>
              <p class="role">{escape(role)}</p>
              {f'<p class="profile-lab-dates"><strong>Lab dates:</strong> {escape(lab_dates)}</p>' if lab_dates else ''}
              <div class="actions">
                {' '.join(action_links)}
              </div>
            </div>
            <figure class="profile-photo-wrap">
              <img class="profile-photo" src="{escape(resolve_asset_path(clean_text(person.get("image")), root_prefix))}" alt="{escape(name)}" loading="lazy" />
            </figure>
          </article>

          <div class="profile-grid">
            <article class="profile-panel">
              <h2>Research Interest</h2>
              <p>{format_species_text(clean_text(person.get("profileSummary") or person.get("bio")))}</p>
            </article>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <p>Thomas Bernhardt Lab | Harvard Medical School Department of Microbiology | Howard Hughes Medical Institute | <a href="{escape(site_link("accessibility", root_prefix, flat))}">Accessibility</a></p>
      </footer>
    </div>
  </body>
</html>
'''


def render_alumni_profile(person: dict[str, Any], flat: bool) -> str:
    root_prefix = "" if flat else "../../"
    verification = person.get("verification") or {}
    verified_url = clean_text(verification.get("url"))
    verified_source = clean_text(verification.get("verifiedSource"))
    source_label = clean_text(verification.get("sourceLabel")) or "Bernhardt lab records"
    name = clean_text(person.get("name"))
    current_role = clean_text(person.get("currentRole"))
    lab_dates = clean_text(person.get("labDates"))
    lab_dates_html = (
        f'\n              <p class="profile-lab-dates"><strong>Lab dates:</strong> {escape(lab_dates)}</p>'
        if lab_dates
        else ""
    )
    profile_summary = clean_text(person.get("profileSummary"))
    if not profile_summary:
        profile_summary = (
            f"Former member of the Bernhardt Lab. {current_role}"
            if current_role
            else "Former member of the Bernhardt Lab."
        )
    current_role_panel = (
        f'''\n            <article class="profile-panel">
              <h2>Current / Latest Role</h2>
              <p>{escape(current_role)}</p>
            </article>'''
        if current_role
        else ""
    )
    verified_source_html = (
        f'\n              <p><strong>Verified by:</strong> <a class="profile-link" href="{escape(verified_url)}" target="_blank" rel="noreferrer">{escape(verified_source or "Institutional profile")}</a></p>'
        if verified_url
        else ""
    )
    canonical = canonical_url(f"{ALUMNI_ROUTE}/{clean_text(person.get('slug'))}")
    return f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="bernhardt-build-mode" content="{'flat' if flat else 'canonical'}" />
    <title>{escape(name)} | Alumni | Bernhardt Lab</title>
    <meta name="description" content="Alumni profile for {escape(name)} from the Thomas Bernhardt Lab at Harvard Medical School." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
{favicon_links(root_prefix)}
    <link rel="stylesheet" href="{escape(root_prefix)}assets/profile.css?v=20260407m" />
    <link rel="canonical" href="{escape(canonical)}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="page">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="{escape(home_href(root_prefix, flat))}" aria-label="Thomas Bernhardt Lab home">
            <span class="brand-text">
              <strong>Thomas Bernhardt Lab</strong>
              <small>Howard Hughes Medical Institute + Harvard Medical School</small>
            </span>
          </a>
{render_profile_nav(root_prefix, flat, "alumni")}
        </div>
      </header>

      <main id="main-content" class="main">
        <section class="profile-shell">
          <article class="profile-hero">
            <div class="profile-copy">
              <p class="eyebrow">Alumni Profile</p>
              <h1>{escape(name)}</h1>
              <p class="role">{escape(person.get("labRole") or "Former lab member")}</p>{lab_dates_html}
              <p class="bio">{format_species_text(profile_summary)}</p>
              <div class="actions">
                <a class="button button-primary" href="{escape(site_link("alumni", root_prefix, flat))}">Back to alumni directory</a>
                {f'<a class="button button-secondary" href="{escape(verified_url)}" target="_blank" rel="noreferrer">Current Institutional Profile</a>' if verified_url else ''}
              </div>
            </div>
            <figure class="profile-photo-wrap">
              <img class="profile-photo" src="{escape(resolve_asset_path(clean_text(person.get("image")), root_prefix))}" alt="{escape(name)} portrait" loading="lazy" />
            </figure>
          </article>

          <div class="profile-grid">
            <article class="profile-panel">
              <h2>Role In The Lab</h2>
              <p>{escape(person.get("labRole") or "Former lab member")}</p>
            </article>{current_role_panel}
            <article class="profile-panel">
              <h2>Sources</h2>
              <p><strong>Source:</strong> {escape(source_label)}</p>{verified_source_html}
            </article>
          </div>
          <p class="profile-update-link">
            <a href="mailto:James_Spencer@hms.harvard.edu?subject=Bernhardt%20Lab%20website%20update%2Fremoval%20request&amp;body=Page%20URL%3A%20%0D%0AName%20(or%20entry)%3A%20%0D%0ARequested%20change%20(removal%2Fupdate)%3A%20%0D%0AProposed%20replacement%20text%20(if%20any)%3A%20%0D%0ASupporting%20link%20(if%20any)%3A%20%0D%0A">Request an update or removal</a>
          </p>
        </section>
      </main>

      <footer class="site-footer">
        <p>Thomas Bernhardt Lab | Harvard Medical School Department of Microbiology | Howard Hughes Medical Institute | <a href="{escape(site_link("accessibility", root_prefix, flat))}">Accessibility</a></p>
      </footer>
    </div>
  </body>
</html>
'''


def replace_template_with_people(text: str, people: list[dict[str, Any]], root_prefix: str, flat: bool, view: str) -> str:
    content = render_people_cards(people, root_prefix=root_prefix, flat=flat, view=view)
    if view == "landing":
        return replace_marker_block(
            text,
            "<!-- generated-home-people-grid:start -->",
            "<!-- generated-home-people-grid:end -->",
            content,
        )
    text = replace_marker_block(text, "<!-- generated-people-grid:start -->", "<!-- generated-people-grid:end -->", content)
    count_label = f"Showing {len(people)} current lab {'member' if len(people) == 1 else 'members'}"
    text = replace_marker_block(
        text,
        "<!-- generated-people-count:start -->",
        "<!-- generated-people-count:end -->",
        count_label,
    )
    return text


def replace_template_with_alumni(text: str, people: list[dict[str, Any]], root_prefix: str, flat: bool) -> str:
    content = render_alumni_cards(people, root_prefix=root_prefix, flat=flat)
    text = replace_marker_block(text, "<!-- generated-alumni-grid:start -->", "<!-- generated-alumni-grid:end -->", content)
    count_label = f"Showing {len(people)} alumni {'entry' if len(people) == 1 else 'entries'}"
    text = replace_marker_block(
        text,
        "<!-- generated-alumni-count:start -->",
        "<!-- generated-alumni-count:end -->",
        count_label,
    )
    return text


def normalize_canonical_route_links(text: str) -> str:
    replacements = [
        ('href="../../index.html#', 'href="../../#'),
        ('href="../index.html#', 'href="../#'),
        ('href="index.html#', 'href="#'),
        ('href="../../index.html"', 'href="../../"'),
        ('href="../index.html"', 'href="../"'),
        ('href="index.html"', 'href="./"'),
        ('href="people/"', f'href="{TEAM_ROUTE}/"'),
        ('href="../people/"', f'href="../{TEAM_ROUTE}/"'),
        ('href="../../people/"', f'href="../../{TEAM_ROUTE}/"'),
        ('href="research-library/"', f'href="{RESEARCH_ROUTE}/"'),
        ('href="../research-library/"', f'href="../{RESEARCH_ROUTE}/"'),
        ('href="../../research-library/"', f'href="../../{RESEARCH_ROUTE}/"'),
        ('href="alumni-profiles/', f'href="{ALUMNI_ROUTE}/'),
        ('href="../alumni-profiles/', f'href="../{ALUMNI_ROUTE}/'),
        ('href="../../alumni-profiles/', f'href="../../{ALUMNI_ROUTE}/'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def render_redirect_page(target_href: str, canonical: str, root_prefix: str, title: str = "Redirecting") -> str:
    target = clean_text(target_href)
    page_title = clean_text(title) or "Redirecting"
    full_title = page_title if "Thomas Bernhardt Lab" in page_title else f"{page_title} | Thomas Bernhardt Lab"
    return f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url={escape(target)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{escape(full_title)}</title>
    <link rel="canonical" href="{escape(canonical)}" />
    <script>window.location.replace({json.dumps(target)});</script>
{favicon_links(root_prefix)}
  </head>
  <body>
    <main>
      <p>Redirecting to the current Bernhardt Lab page.</p>
      <p><a href="{escape(target)}">Continue to the current page</a></p>
    </main>
  </body>
</html>
'''


def root_page_to_flat(text: str) -> str:
    replacements = [
        ('content="canonical"', 'content="flat"'),
        ('href="people/"', 'href="team.html"'),
        ('href="team/"', 'href="team.html"'),
        ('href="alumni/"', 'href="alumni.html"'),
        ('href="accessibility/"', 'href="accessibility.html"'),
        ('href="research-library/"', 'href="research.html"'),
        ('href="research/"', 'href="research.html"'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def nested_page_to_flat(text: str) -> str:
    replacements = [
        ('content="canonical"', 'content="flat"'),
        ('href="../#', 'href="index.html#'),
        ('href="../"', 'href="index.html"'),
        ('href="../index.html"', 'href="index.html"'),
        ('href="../index.html#', 'href="index.html#'),
        ('href="../people/"', 'href="team.html"'),
        ('href="../team/"', 'href="team.html"'),
        ('href="../alumni/"', 'href="alumni.html"'),
        ('href="../accessibility/"', 'href="accessibility.html"'),
        ('href="../research-library/"', 'href="research.html"'),
        ('href="../research/"', 'href="research.html"'),
        ('href="../', 'href="'),
        ('src="../', 'src="'),
        ('data-freshness-path="../assets/data/', 'data-freshness-path="assets/data/'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def sync_runtime_config_js() -> None:
    config = load_runtime_config()
    leaderboard_url = clean_text(config.get("leaderboardUrl"))
    output = f'''// Generated from data/runtime-config.json.\n(function configureEnvelopeLeaderboard() {{\n  const hardcodedEndpoint = {json.dumps(leaderboard_url)};\n  const META_NAME = "bernhardt-leaderboard-url";\n\n  const cleanUrl = (value) => {{\n    const raw = String(value || "").trim();\n    if (!raw) return "";\n    try {{\n      const parsed = new URL(raw, window.location.origin);\n      if (!/^https?:$/i.test(parsed.protocol)) return "";\n      if (!/\\/(api\\/)?leaderboard$/i.test(parsed.pathname)) return "";\n      return parsed.toString();\n    }} catch {{\n      return "";\n    }}\n  }};\n\n  const metaCandidate = (() => {{\n    const meta = document.querySelector(`meta[name="${{META_NAME}}"]`);\n    return cleanUrl(meta ? meta.getAttribute("content") : "");\n  }})();\n\n  window.ENVELOPE_LEADERBOARD_URL = cleanUrl(hardcodedEndpoint) || metaCandidate || "";\n}})();\n'''
    write_text(ASSETS_DIR / "envelope-escape-config.js", output)


def compile_styles() -> None:
    css_dir = ASSETS_DIR / "css"
    chunks = []
    for name in CSS_SOURCE_ORDER:
        path = css_dir / name
        chunks.append(f"/* Source: css/{name} */\n{read_text(path).rstrip()}\n")
    write_text(ASSETS_DIR / "styles.css", "\n\n".join(chunks))


def sync_canonical_redirect_favicons() -> None:
    for path in sorted(ROOT.glob("*.html")):
        if path.name == "index.html":
            continue
        text = read_text(path)
        if '<meta http-equiv="refresh"' in text:
            write_text(path, ensure_favicon_links(text, ""))

    for child in ROOT.iterdir():
        if not child.is_dir() or child.name in PUBLIC_HTML_EXCLUDED_DIRS:
            continue
        index_path = child / "index.html"
        if not index_path.exists():
            continue
        text = read_text(index_path)
        if '<meta http-equiv="refresh"' in text:
            write_text(index_path, ensure_favicon_links(text, "../"))


def page_template(primary: Path, fallback: Path) -> str:
    if primary.exists():
        return read_text(primary)
    return read_text(fallback)


def classify_legacy_target(target: str, current_slugs: set[str], alumni_slugs: set[str]) -> tuple[str, str] | None:
    normalized = clean_text(target)
    if normalized.startswith("../"):
        normalized = normalized[3:]
    normalized = normalized.strip("/")
    normalized = normalized.removesuffix("/index.html")
    normalized = normalized.removesuffix(".html")

    if normalized.startswith(f"{TEAM_ROUTE}/"):
        slug = normalized.split("/", 1)[1].strip("/")
        return ("team", slug) if slug in current_slugs else None
    if normalized.startswith(f"{ALUMNI_ROUTE}/"):
        slug = normalized.split("/", 1)[1].strip("/")
        return ("alumni", slug) if slug in alumni_slugs else None
    if normalized.startswith(f"{LEGACY_ALUMNI_PROFILE_ROUTE}/"):
        slug = normalized.split("/", 1)[1].strip("/")
        return ("alumni", slug) if slug in alumni_slugs else None
    if normalized in current_slugs:
        return ("team", normalized)
    if normalized in alumni_slugs:
        return ("alumni", normalized)
    return None


def collect_legacy_profile_redirects(current_slugs: set[str], alumni_slugs: set[str]) -> dict[str, tuple[str, str]]:
    redirects: dict[str, tuple[str, str]] = {slug: ("team", slug) for slug in current_slugs}
    excluded = PUBLIC_HTML_EXCLUDED_DIRS | {
        TEAM_ROUTE,
        ALUMNI_ROUTE,
        LEGACY_TEAM_ROUTE,
        RESEARCH_ROUTE,
        LEGACY_RESEARCH_ROUTE,
    }
    for child in ROOT.iterdir():
        if not child.is_dir() or child.name in excluded:
            continue
        index_path = child / "index.html"
        if not index_path.exists():
            continue
        text = read_text(index_path)
        refresh_match = re.search(r'<meta http-equiv="refresh" content="0; url=([^"]+)"', text)
        if not refresh_match:
            continue
        target = classify_legacy_target(refresh_match.group(1), current_slugs, alumni_slugs)
        if target:
            redirects[child.name] = target
    return redirects


def sync_legacy_redirects(
    people: list[dict[str, Any]],
    alumni: list[dict[str, Any]],
    profile_redirects: dict[str, tuple[str, str]],
) -> None:
    write_text(
        ROOT / "people.html",
        render_redirect_page("team/", canonical_url(TEAM_ROUTE), "", "Team Redirect"),
    )
    write_text(
        ROOT / LEGACY_TEAM_ROUTE / "index.html",
        render_redirect_page(f"../{TEAM_ROUTE}/", canonical_url(TEAM_ROUTE), "../", "Team Redirect"),
    )
    write_text(
        ROOT / "alumni.html",
        render_redirect_page("alumni/", canonical_url(ALUMNI_ROUTE), "", "Alumni Redirect"),
    )
    write_text(
        ROOT / "research-library.html",
        render_redirect_page("research/", canonical_url(RESEARCH_ROUTE), "", "Research Redirect"),
    )
    write_text(
        ROOT / LEGACY_RESEARCH_ROUTE / "index.html",
        render_redirect_page(f"../{RESEARCH_ROUTE}/", canonical_url(RESEARCH_ROUTE), "../", "Research Redirect"),
    )

    for alias, (section, slug) in sorted(profile_redirects.items()):
        if section == "team":
            target_href = f"../{TEAM_ROUTE}/{slug}/"
            target_url = canonical_url(f"{TEAM_ROUTE}/{slug}")
        else:
            target_href = f"../{ALUMNI_ROUTE}/{slug}/"
            target_url = canonical_url(f"{ALUMNI_ROUTE}/{slug}")
        write_text(ROOT / alias / "index.html", render_redirect_page(target_href, target_url, "../", f"{slug} Redirect"))

    for person in alumni:
        slug = clean_text(person.get("slug"))
        write_text(
            ROOT / LEGACY_ALUMNI_PROFILE_ROUTE / f"{slug}.html",
            render_redirect_page(f"../{ALUMNI_ROUTE}/{slug}/", canonical_url(f"{ALUMNI_ROUTE}/{slug}"), "../", f"{clean_text(person.get('name'))} Redirect"),
        )


def build_canonical_pages() -> None:
    people = current_people(load_people())
    alumni = alumni_people(load_people())
    current_slugs = {clean_text(person.get("slug")) for person in people}
    alumni_slugs = {clean_text(person.get("slug")) for person in alumni}
    profile_redirects = collect_legacy_profile_redirects(current_slugs, alumni_slugs)

    index_text = read_text(ROOT / "index.html")
    index_text = normalize_canonical_route_links(index_text)
    index_text = ensure_canonical_link(index_text, canonical_url())
    write_text(
        ROOT / "index.html",
        replace_template_with_people(ensure_favicon_links(index_text, ""), people, root_prefix="", flat=False, view="landing"),
    )

    team_text = page_template(ROOT / TEAM_ROUTE / "index.html", ROOT / LEGACY_TEAM_ROUTE / "index.html")
    team_text = normalize_canonical_route_links(team_text)
    team_text = ensure_canonical_link(team_text, canonical_url(TEAM_ROUTE))
    write_text(
        ROOT / TEAM_ROUTE / "index.html",
        replace_template_with_people(ensure_favicon_links(team_text, "../"), people, root_prefix="../", flat=False, view="directory"),
    )

    alumni_text = read_text(ROOT / "alumni" / "index.html")
    alumni_text = normalize_canonical_route_links(alumni_text)
    alumni_text = ensure_canonical_link(alumni_text, canonical_url(ALUMNI_ROUTE))
    write_text(
        ROOT / ALUMNI_ROUTE / "index.html",
        replace_template_with_alumni(ensure_favicon_links(alumni_text, "../"), alumni, root_prefix="../", flat=False),
    )

    research_text = page_template(ROOT / RESEARCH_ROUTE / "index.html", ROOT / LEGACY_RESEARCH_ROUTE / "index.html")
    research_text = normalize_canonical_route_links(research_text)
    research_text = ensure_canonical_link(research_text, canonical_url(RESEARCH_ROUTE))
    write_text(ROOT / RESEARCH_ROUTE / "index.html", ensure_favicon_links(research_text, "../"))

    accessibility_text = read_text(ROOT / "accessibility" / "index.html")
    accessibility_text = normalize_canonical_route_links(accessibility_text)
    accessibility_text = ensure_canonical_link(accessibility_text, canonical_url("accessibility"))
    write_text(ROOT / "accessibility" / "index.html", ensure_favicon_links(accessibility_text, "../"))

    for person in people:
        write_text(ROOT / TEAM_ROUTE / clean_text(person.get("slug")) / "index.html", render_current_profile(person, flat=False))

    for person in alumni:
        write_text(ROOT / ALUMNI_ROUTE / clean_text(person.get("slug")) / "index.html", render_alumni_profile(person, flat=False))

    sync_legacy_redirects(people, alumni, profile_redirects)
    sync_canonical_redirect_favicons()


def sync_flat_assets() -> None:
    FLAT_DIR.mkdir(parents=True, exist_ok=True)
    shutil.rmtree(FLAT_DIR / "assets", ignore_errors=True)
    shutil.rmtree(FLAT_DIR / "data", ignore_errors=True)
    shutil.copytree(ASSETS_DIR, FLAT_DIR / "assets", ignore=ignore_generated_copy_names)
    shutil.copytree(DATA_DIR, FLAT_DIR / "data", ignore=ignore_generated_copy_names)
    shutil.copy2(ROOT / "favicon.ico", FLAT_DIR / "favicon.ico")


def cleanup_flat_generated_noise() -> None:
    if not FLAT_DIR.exists():
        return

    for path in sorted(FLAT_DIR.rglob("*"), key=lambda entry: len(entry.parts), reverse=True):
        if path == FLAT_DIR:
            continue
        sibling_names = {sibling.name for sibling in path.parent.iterdir()}
        if is_transient_name(path.name, sibling_names):
            remove_path(path)

    for child in FLAT_DIR.iterdir():
        if child.is_dir():
            continue
        if child.suffix == ".html" or child.name in PRESERVED_FLAT_ROOT_FILES:
            continue
        child.unlink()


def build_flat_pages() -> None:
    people = current_people(load_people())
    alumni = alumni_people(load_people())

    index_text = root_page_to_flat(read_text(ROOT / "index.html"))
    index_text = replace_template_with_people(index_text, people, root_prefix="", flat=True, view="landing")
    write_text(FLAT_DIR / "index.html", index_text)

    team_text = nested_page_to_flat(read_text(ROOT / TEAM_ROUTE / "index.html"))
    team_text = replace_template_with_people(team_text, people, root_prefix="", flat=True, view="directory")
    write_text(FLAT_DIR / "team.html", team_text)
    write_text(FLAT_DIR / "people.html", render_redirect_page("team.html", canonical_url(TEAM_ROUTE), "", "Team Redirect"))

    alumni_text = nested_page_to_flat(read_text(ROOT / ALUMNI_ROUTE / "index.html"))
    alumni_text = replace_template_with_alumni(alumni_text, alumni, root_prefix="", flat=True)
    write_text(FLAT_DIR / "alumni.html", alumni_text)

    write_text(FLAT_DIR / "accessibility.html", nested_page_to_flat(read_text(ROOT / "accessibility" / "index.html")))
    write_text(FLAT_DIR / "research.html", nested_page_to_flat(read_text(ROOT / RESEARCH_ROUTE / "index.html")))
    write_text(FLAT_DIR / "research-library.html", render_redirect_page("research.html", canonical_url(RESEARCH_ROUTE), "", "Research Redirect"))

    for person in people:
        write_text(FLAT_DIR / f"team-{clean_text(person.get('slug'))}.html", render_current_profile(person, flat=True))

    for person in alumni:
        write_text(FLAT_DIR / f"alumni-{clean_text(person.get('slug'))}.html", render_alumni_profile(person, flat=True))

    sync_flat_redirects()


def convert_redirect_target(value: str) -> str:
    target = clean_text(value)
    if not target:
        return target
    if target.startswith("../"):
        target = target[3:]
    target = target.strip("/")
    target = target.removesuffix("/index.html").removesuffix(".html")
    if target in {LEGACY_TEAM_ROUTE, TEAM_ROUTE}:
        return "team.html"
    if target == ALUMNI_ROUTE:
        return "alumni.html"
    if target == "accessibility":
        return "accessibility.html"
    if target in {LEGACY_RESEARCH_ROUTE, RESEARCH_ROUTE}:
        return "research.html"
    if target.startswith(f"{TEAM_ROUTE}/"):
        slug = target.split("/", 1)[1].strip("/")
        return f"team-{slug}.html"
    if target.startswith(f"{ALUMNI_ROUTE}/"):
        slug = target.split("/", 1)[1].strip("/")
        return f"alumni-{slug}.html" if slug else "alumni.html"
    if target.startswith(f"{LEGACY_ALUMNI_PROFILE_ROUTE}/"):
        slug = target.split("/")[-1].replace(".html", "")
        return f"alumni-{slug}.html"
    return f"{target}.html"


def sync_flat_redirects() -> None:
    excluded = {
        LEGACY_TEAM_ROUTE,
        TEAM_ROUTE,
        ALUMNI_ROUTE,
        "accessibility",
        LEGACY_RESEARCH_ROUTE,
        RESEARCH_ROUTE,
        "assets",
        "data",
        "github-flat",
        ".git",
        ".github",
        "scripts",
        "docs",
    }
    for child in ROOT.iterdir():
        if not child.is_dir() or child.name in excluded:
            continue
        index_path = child / "index.html"
        if not index_path.exists():
            continue
        text = read_text(index_path)
        refresh_match = re.search(r'<meta http-equiv="refresh" content="0; url=([^"]+)"', text)
        if not refresh_match:
            continue
        flat_target = convert_redirect_target(refresh_match.group(1))
        canonical_match = re.search(r'<link rel="canonical" href="([^"]+)"', text)
        title_match = re.search(r"<title>(.*?)</title>", text, re.S)
        title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else f"{child.name} Redirect"
        canonical = canonical_match.group(1) if canonical_match else canonical_url()
        write_text(FLAT_DIR / f"{child.name}.html", render_redirect_page(flat_target, canonical, "", title))


def canonical_route_paths(people: list[dict[str, Any]]) -> list[str]:
    current = current_people(people)
    alumni = alumni_people(people)
    routes = [
        "",
        TEAM_ROUTE,
        *[f"{TEAM_ROUTE}/{clean_text(person.get('slug'))}" for person in current],
        ALUMNI_ROUTE,
        *[f"{ALUMNI_ROUTE}/{clean_text(person.get('slug'))}" for person in alumni],
        RESEARCH_ROUTE,
        "accessibility",
    ]
    return routes


def render_sitemap(routes: list[str]) -> str:
    locs = "\n".join(f"  <url><loc>{escape(canonical_url(route))}</loc></url>" for route in routes)
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{locs}
</urlset>
'''


def write_sitemaps(people: list[dict[str, Any]]) -> None:
    sitemap = render_sitemap(canonical_route_paths(people))
    write_text(ROOT / "sitemap.xml", sitemap)
    write_text(FLAT_DIR / "sitemap.xml", sitemap)
    robots = f"User-agent: *\nAllow: /\n\nSitemap: {CANONICAL_SITE_URL}/sitemap.xml\n"
    write_text(ROOT / "robots.txt", robots)
    write_text(FLAT_DIR / "robots.txt", robots)


def validate_homepage_team_grid(path: Path, expected_cards: int) -> None:
    text = read_text(path)
    if text.count('id="people-grid"') != 1:
        raise RuntimeError(f"{path}: expected exactly one people-grid container")
    if 'id="people-sort"' in text:
        raise RuntimeError(f"{path}: homepage team preview must not include the full-directory sort control")
    start_marker = "<!-- generated-home-people-grid:start -->"
    end_marker = "<!-- generated-home-people-grid:end -->"
    if text.count(start_marker) != 1 or text.count(end_marker) != 1:
        raise RuntimeError(f"{path}: expected exactly one homepage people-grid marker pair")
    start_index = text.index(start_marker)
    end_index = text.index(end_marker)
    inner = text[start_index:end_index]
    card_count = inner.count("person-card--landing")
    if card_count != expected_cards:
        raise RuntimeError(f"{path}: expected {expected_cards} landing cards inside generated block, found {card_count}")
    outside = text[:start_index] + text[end_index + len(end_marker):]
    if "person-card--landing" in outside:
        raise RuntimeError(f"{path}: found landing cards outside generated homepage block")


def validate_team_directory_controls(path: Path, expected_cards: int) -> None:
    text = read_text(path)
    required_tokens = [
        'id="people-search"',
        'id="people-sort"',
        'value="position"',
        'value="name"',
        'value="display"',
        'id="role-filters"',
        'id="people-count"',
        'id="people-grid"',
    ]
    missing = [token for token in required_tokens if token not in text]
    if missing:
        raise RuntimeError(f"{path}: missing team directory controls: {', '.join(missing)}")
    card_count = text.count("person-card--directory")
    if card_count != expected_cards:
        raise RuntimeError(f"{path}: expected {expected_cards} directory cards, found {card_count}")
    for token in [
        "data-search=",
        "data-sort-position=",
        "data-sort-last-name=",
        "data-sort-name=",
        "data-sort-original=",
    ]:
        if text.count(token) != expected_cards:
            raise RuntimeError(f"{path}: expected {expected_cards} instances of {token}, found {text.count(token)}")
    for token in ['data-sort-position=""', 'data-sort-original=""']:
        if token in text:
            raise RuntimeError(f"{path}: contains empty generated sort metadata {token}")


def iter_public_html_paths() -> list[Path]:
    paths: set[Path] = set()
    for path in ROOT.rglob("*.html"):
        relative_parts = path.relative_to(ROOT).parts
        if any(part in PUBLIC_HTML_EXCLUDED_DIRS for part in relative_parts):
            continue
        paths.add(path)

    if FLAT_DIR.exists():
        paths.update(FLAT_DIR.glob("*.html"))

    return sorted(paths)


def validate_favicon_assets() -> None:
    required_assets = [
        ROOT / "favicon.ico",
        ASSETS_DIR / "images" / "brands" / "favicon.svg",
        ASSETS_DIR / "images" / "brands" / "favicon-32.png",
        ASSETS_DIR / "images" / "brands" / "apple-touch-icon.png",
        FLAT_DIR / "favicon.ico",
        FLAT_DIR / "assets" / "images" / "brands" / "favicon.svg",
        FLAT_DIR / "assets" / "images" / "brands" / "favicon-32.png",
        FLAT_DIR / "assets" / "images" / "brands" / "apple-touch-icon.png",
    ]
    missing = [str(path.relative_to(ROOT)) for path in required_assets if not path.exists()]
    if missing:
        raise RuntimeError(f"Missing favicon assets: {', '.join(missing)}")


def validate_favicon_links() -> None:
    validate_favicon_assets()
    required_tokens = [
        'rel="icon" type="image/svg+xml"',
        f"favicon.svg?v={FAVICON_VERSION}",
        'rel="icon" type="image/png" sizes="32x32"',
        f"favicon-32.png?v={FAVICON_VERSION}",
        'rel="apple-touch-icon" sizes="180x180"',
        f"apple-touch-icon.png?v={FAVICON_VERSION}",
        'rel="shortcut icon"',
        f"favicon.ico?v={FAVICON_VERSION}",
    ]
    missing_pages: list[str] = []
    for path in iter_public_html_paths():
        text = read_text(path)
        head = text.split("</head>", 1)[0]
        hrefs = re.findall(
            r'<link\s+rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*href="([^"]+)"',
            head,
            re.I,
        )
        flat_path_has_parent_reference = path.is_relative_to(FLAT_DIR) and any(href.startswith("../") for href in hrefs)
        if any(token not in head for token in required_tokens) or flat_path_has_parent_reference:
            missing_pages.append(str(path.relative_to(ROOT)))
    if missing_pages:
        raise RuntimeError(f"Missing favicon metadata on public pages: {', '.join(missing_pages)}")


def local_reference_target(reference: str, page_path: Path) -> Path | None:
    raw = clean_text(reference)
    if (
        not raw
        or raw.startswith("#")
        or raw.startswith(("http://", "https://", "mailto:", "tel:", "data:", "blob:", "javascript:"))
    ):
        return None
    raw = raw.split("#", 1)[0].split("?", 1)[0]
    if not raw:
        return None
    raw = unquote(raw)
    if raw.startswith("/"):
        return ROOT / raw.lstrip("/")
    return (page_path.parent / raw).resolve()


def validate_local_asset_references() -> None:
    missing: list[str] = []
    asset_tag_pattern = re.compile(r"<(?P<tag>link|script|img|source|video|iframe)\b(?P<attrs>[^>]*)>", re.I)
    attr_pattern = re.compile(r'\b(?P<name>href|src|poster)=["\'](?P<value>[^"\']+)["\']', re.I)
    rel_pattern = re.compile(r'\brel=["\']([^"\']+)["\']', re.I)

    for path in iter_public_html_paths():
        text = read_text(path)
        for match in asset_tag_pattern.finditer(text):
            tag = match.group("tag").lower()
            attrs = match.group("attrs")
            rel_match = rel_pattern.search(attrs)
            rel_value = rel_match.group(1).lower() if rel_match else ""
            for attr_match in attr_pattern.finditer(attrs):
                attr = attr_match.group("name").lower()
                value = attr_match.group("value")
                if tag == "link" and attr == "href" and not any(
                    token in rel_value for token in ["stylesheet", "icon", "apple-touch-icon", "preload", "modulepreload"]
                ):
                    continue
                if tag != "link" and attr == "href":
                    continue
                target = local_reference_target(value, path)
                if target is None:
                    continue
                try:
                    target.relative_to(ROOT)
                except ValueError:
                    missing.append(f"{path.relative_to(ROOT)} references outside repo: {value}")
                    continue
                if not target.exists():
                    missing.append(f"{path.relative_to(ROOT)} references missing local asset: {value}")
    if missing:
        raise RuntimeError("Missing local asset references:\n- " + "\n- ".join(sorted(set(missing))))


def extract_canonical_href(path: Path) -> str:
    match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', read_text(path), re.I)
    return match.group(1) if match else ""


def assert_page_canonical(path: Path, expected_url: str, errors: list[str]) -> None:
    if not path.exists():
        errors.append(f"Missing canonical route page: {path.relative_to(ROOT)}")
        return
    actual = extract_canonical_href(path)
    if actual != expected_url:
        errors.append(f"{path.relative_to(ROOT)} canonical must be {expected_url}, found {actual or '<missing>'}")


def assert_redirect_target(path: Path, expected_target: str, expected_canonical: str, errors: list[str]) -> None:
    if not path.exists():
        errors.append(f"Missing legacy redirect page: {path.relative_to(ROOT)}")
        return
    text = read_text(path)
    refresh = re.search(r'<meta http-equiv="refresh" content="0; url=([^"]+)"', text)
    if not refresh or refresh.group(1) != expected_target:
        errors.append(
            f"{path.relative_to(ROOT)} redirect target must be {expected_target}, "
            f"found {refresh.group(1) if refresh else '<missing>'}"
        )
    actual_canonical = extract_canonical_href(path)
    if actual_canonical != expected_canonical:
        errors.append(
            f"{path.relative_to(ROOT)} redirect canonical must be {expected_canonical}, "
            f"found {actual_canonical or '<missing>'}"
        )


def validate_premium_url_scheme(people: list[dict[str, Any]]) -> None:
    current = current_people(people)
    alumni = alumni_people(people)
    current_slugs = {clean_text(person.get("slug")) for person in current}
    alumni_slugs = {clean_text(person.get("slug")) for person in alumni}
    errors: list[str] = []

    for route in ("", TEAM_ROUTE, ALUMNI_ROUTE, RESEARCH_ROUTE, "accessibility"):
        page_path = ROOT / "index.html" if not route else ROOT / route / "index.html"
        assert_page_canonical(page_path, canonical_url(route), errors)

    for slug in sorted(current_slugs):
        assert_page_canonical(ROOT / TEAM_ROUTE / slug / "index.html", canonical_url(f"{TEAM_ROUTE}/{slug}"), errors)
        assert_redirect_target(
            ROOT / slug / "index.html",
            f"../{TEAM_ROUTE}/{slug}/",
            canonical_url(f"{TEAM_ROUTE}/{slug}"),
            errors,
        )

    for slug in sorted(alumni_slugs):
        assert_page_canonical(ROOT / ALUMNI_ROUTE / slug / "index.html", canonical_url(f"{ALUMNI_ROUTE}/{slug}"), errors)
        assert_redirect_target(
            ROOT / LEGACY_ALUMNI_PROFILE_ROUTE / f"{slug}.html",
            f"../{ALUMNI_ROUTE}/{slug}/",
            canonical_url(f"{ALUMNI_ROUTE}/{slug}"),
            errors,
        )

    assert_redirect_target(ROOT / "people.html", f"{TEAM_ROUTE}/", canonical_url(TEAM_ROUTE), errors)
    assert_redirect_target(ROOT / LEGACY_TEAM_ROUTE / "index.html", f"../{TEAM_ROUTE}/", canonical_url(TEAM_ROUTE), errors)
    assert_redirect_target(ROOT / "research-library.html", f"{RESEARCH_ROUTE}/", canonical_url(RESEARCH_ROUTE), errors)
    assert_redirect_target(ROOT / LEGACY_RESEARCH_ROUTE / "index.html", f"../{RESEARCH_ROUTE}/", canonical_url(RESEARCH_ROUTE), errors)

    legacy_route_tokens = [
        f"{CANONICAL_SITE_URL}/{LEGACY_TEAM_ROUTE}/",
        f"{CANONICAL_SITE_URL}/{LEGACY_ALUMNI_PROFILE_ROUTE}/",
        f"{CANONICAL_SITE_URL}/{LEGACY_RESEARCH_ROUTE}/",
    ]
    legacy_link_tokens = [
        'href="index.html',
        'href="../index.html',
        'href="../../index.html',
        'href="people/',
        'href="../people/',
        'href="../../people/',
        'href="alumni-profiles/',
        'href="../alumni-profiles/',
        'href="../../alumni-profiles/',
        'href="research-library/',
        'href="../research-library/',
        'href="../../research-library/',
    ]
    legacy_target_tokens = [
        "people/",
        "../people/",
        "../../people/",
        "alumni-profiles/",
        "../alumni-profiles/",
        "../../alumni-profiles/",
        "research-library/",
        "../research-library/",
        "../../research-library/",
    ]

    for path in iter_public_html_paths():
        text = read_text(path)
        canonical_href = extract_canonical_href(path)
        if any(token in canonical_href for token in legacy_route_tokens):
            errors.append(f"{path.relative_to(ROOT)} uses legacy canonical URL {canonical_href}")
        refresh_match = re.search(r'<meta http-equiv="refresh" content="0; url=([^"]+)"', text)
        if refresh_match:
            refresh_target = refresh_match.group(1)
            if any(token in refresh_target for token in legacy_target_tokens):
                errors.append(f"{path.relative_to(ROOT)} redirects to legacy route {refresh_target}")
            script_match = re.search(r"window\.location\.replace\((['\"])(.*?)\1\)", text)
            if path.is_relative_to(FLAT_DIR) and script_match and script_match.group(2) != refresh_target:
                errors.append(
                    f"{path.relative_to(ROOT)} flat redirect script target {script_match.group(2)} "
                    f"does not match meta refresh {refresh_target}"
                )
        if path.is_relative_to(FLAT_DIR):
            continue
        if '<meta http-equiv="refresh"' in text:
            continue
        for token in legacy_link_tokens:
            if token in text:
                errors.append(f"{path.relative_to(ROOT)} links to legacy route token {token}")
                break

    sitemap_text = read_text(ROOT / "sitemap.xml") if (ROOT / "sitemap.xml").exists() else ""
    for route in canonical_route_paths(people):
        expected = canonical_url(route)
        if expected not in sitemap_text:
            errors.append(f"sitemap.xml is missing {expected}")
    for token in legacy_route_tokens:
        if token in sitemap_text:
            errors.append(f"sitemap.xml includes legacy route {token}")

    if errors:
        raise RuntimeError("Premium URL scheme validation failed:\n- " + "\n- ".join(errors))


def build_site() -> None:
    load_gallery_items()
    load_featured_alumni_items()
    load_curated_publications()
    load_scientific_media_items()
    load_site_copy()
    people = load_people()
    sync_runtime_config_js()
    compile_styles()
    build_canonical_pages()
    sync_flat_assets()
    build_flat_pages()
    write_sitemaps(people)
    cleanup_flat_generated_noise()
    expected_cards = len(current_people(people))
    validate_homepage_team_grid(ROOT / "index.html", expected_cards)
    validate_homepage_team_grid(FLAT_DIR / "index.html", expected_cards)
    validate_team_directory_controls(ROOT / TEAM_ROUTE / "index.html", expected_cards)
    validate_team_directory_controls(FLAT_DIR / "team.html", expected_cards)
    validate_favicon_links()
    validate_local_asset_references()
    validate_premium_url_scheme(people)
    validate_tom_compliance(ROOT)


if __name__ == "__main__":
    build_site()
