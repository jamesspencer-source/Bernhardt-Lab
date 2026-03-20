#!/usr/bin/env python3

from __future__ import annotations

import html
import json
import re
import shutil
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
ASSETS_DIR = ROOT / "assets"
FLAT_DIR = ROOT / "github-flat"
CANONICAL_SITE_URL = "https://jamesspencer-source.github.io/Bernhardt-Lab"
CSS_SOURCE_ORDER = [
    "base.css",
    "layout.css",
    "home.css",
    "directory.css",
]
LEGACY_FLAT_FILES = [
    "alumni-data.js",
    "alumni.css",
    "alumni.js",
    "envelope-escape-config.example.js",
    "envelope-escape-config.js",
    "envelope-escape.css",
    "envelope-escape.js",
    "main.js",
    "profile.css",
    "recent-publications.json",
    "research-in-motion.json",
    "site-freshness.js",
    "site-freshness.json",
    "styles.css",
    "youtube-video-stats.json",
]

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
    path.write_text(value, encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def clean_text(value: object = "") -> str:
    return str(value or "").replace("\u00a0", " ").replace("\u2019", "'").strip()


def escape(value: object = "") -> str:
    return html.escape(clean_text(value), quote=True)


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
    return f"{slug}.html" if flat else f"{root_prefix}{slug}/"


def alumni_profile_href(person: dict[str, Any], root_prefix: str, flat: bool) -> str:
    slug = clean_text(person.get("slug"))
    return f"alumni-{slug}.html" if flat else f"{root_prefix}alumni-profiles/{slug}.html"


def site_link(path: str, root_prefix: str, flat: bool) -> str:
    normalized = clean_text(path).strip("/")
    if not normalized:
        return "index.html" if flat else f"{root_prefix}index.html"
    if flat:
        if normalized == "people":
            return "people.html"
        if normalized == "alumni":
            return "alumni.html"
        if normalized == "accessibility":
            return "accessibility.html"
        if normalized == "research-library":
            return "research-library.html"
        return f"{normalized}.html"
    return f"{root_prefix}{normalized}/"


def replace_marker_block(text: str, start_marker: str, end_marker: str, content: str) -> str:
    pattern = re.compile(rf"({re.escape(start_marker)})(.*)({re.escape(end_marker)})", re.S)
    if not pattern.search(text):
        raise RuntimeError(f"Could not locate marker block {start_marker} / {end_marker}")
    return pattern.sub(rf"\1\n{content}\n\3", text)


def replace_people_grid_inner(text: str, content: str) -> str:
    pattern = re.compile(
        r'(<div id="people-grid" class="people-grid" data-people-view="landing" aria-live="polite">)(.*?)(</div>)',
        re.S,
    )
    if pattern.search(text):
        return pattern.sub(rf"\1\n{content}\n\3", text)
    legacy_pattern = re.compile(
        r'(<div id="people-grid" class="people-grid" data-people-view="landing" aria-live="polite"></div>)',
        re.S,
    )
    if legacy_pattern.search(text):
        return legacy_pattern.sub(
            '<div id="people-grid" class="people-grid" data-people-view="landing" aria-live="polite">\n'
            f"{content}\n"
            "</div>",
            text,
        )
    raise RuntimeError("Could not locate homepage people grid container")


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


def load_people() -> list[dict[str, Any]]:
    payload = read_json(DATA_DIR / "people.json")
    rows = payload.get("people", [])
    validate_people(rows)
    return rows


def load_gallery_items() -> list[dict[str, Any]]:
    return read_json(DATA_DIR / "gallery.json").get("items", [])


def load_featured_alumni_items() -> list[dict[str, Any]]:
    return read_json(DATA_DIR / "featured-alumni.json").get("items", [])


def load_curated_publications() -> list[dict[str, Any]]:
    return read_json(DATA_DIR / "curated-publications.json").get("items", [])


def load_site_copy() -> dict[str, Any]:
    return read_json(DATA_DIR / "site-copy.json")


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
        role_label = clean_text(person.get("labRole"))
        if view == "landing":
            role_label = landing_tile_role(person)
        search_blob = clean_text(
            " ".join(
                [
                    clean_text(person.get("name")),
                    clean_text(person.get("labRole")),
                    clean_text(person.get("bio")),
                    clean_text(person.get("group")),
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
            f'''          <article class="person-card person-card--{view}" style="--index:{index};" data-name="{escape(person.get("name"))}" data-role="{escape(person.get("labRole"))}" data-group="{escape(person.get("group"))}" data-bio="{escape(person.get("bio"))}" data-search="{escape(search_blob)}">
            <div class="person-photo-wrap">
              <img class="person-photo" src="{escape(resolve_asset_path(clean_text(person.get("image")), root_prefix))}" alt="{escape(person.get("name"))}" style="--focus-x:{escape(f"{float(person.get('focus', {}).get('x', 0.5)) * 100:.1f}%")};--focus-y:{escape(f"{float(person.get('focus', {}).get('y', 0.46)) * 100:.1f}%")};" loading="lazy" />
            </div>
            <div class="person-body">
              <p class="person-role">{escape(role_label)}</p>
              <h3>{escape(person.get("name"))}</h3>
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
        bucket = normalize_role_bucket(clean_text(person.get("labRole")))
        search_blob = clean_text(
            " ".join(
                [
                    clean_text(person.get("name")),
                    clean_text(person.get("labRole")),
                    clean_text(person.get("labDates")),
                    clean_text(person.get("currentRole")),
                    bucket,
                ]
            )
        )
        cards.append(
            f'''          <article class="alumni-card" data-name="{escape(person.get("name"))}" data-role-in-lab="{escape(person.get("labRole"))}" data-lab-dates="{escape(person.get("labDates"))}" data-current-role="{escape(person.get("currentRole"))}" data-bucket="{escape(bucket)}" data-sort-recent="{escape(parse_lab_end_sort_key(clean_text(person.get("labDates"))))}" data-sort-last-name="{escape(last_name_key(clean_text(person.get("name"))))}" data-search="{escape(search_blob)}">
            <div class="alumni-top">{'<span class="alumni-verified">Verified profile</span>' if verified_url else ''}</div>
            <h3>{escape(person.get("name"))}</h3>
            <p class="alumni-role"><strong>Role in lab:</strong> {escape(person.get("labRole") or "Former lab member")}</p>
            {f'<p class="alumni-role"><strong>Lab dates:</strong> {escape(person.get("labDates"))}</p>' if clean_text(person.get("labDates")) else ''}
            <p class="alumni-current"><strong>Current / latest role:</strong> {escape(person.get("currentRole") or "Role update pending")}</p>
            <p class="alumni-source"><strong>Source:</strong> {escape(source_label)}</p>
            {f'<p class="alumni-source"><strong>Verified by:</strong> <a class="alumni-inline-link" href="{escape(verified_url)}" target="_blank" rel="noreferrer">{escape(verified_source or "Institutional profile")}</a></p>' if verified_url else '<p class="alumni-source"><strong>External verification:</strong> not available</p>'}
            <div class="alumni-links">
              <a class="alumni-link" href="{escape(alumni_profile_href(person, root_prefix, flat))}">Open alumni profile</a>
              {f'<a class="alumni-link" href="{escape(verified_url)}" target="_blank" rel="noreferrer">View current institutional profile</a>' if verified_url else ''}
            </div>
          </article>'''
        )
    return "\n".join(cards)


def render_profile_nav(root_prefix: str, flat: bool, current_section: str) -> str:
    team_href = site_link("people", root_prefix, flat)
    alumni_href = site_link("alumni", root_prefix, flat)
    team_current = ' aria-current="page"' if current_section == "team" else ""
    alumni_current = ' aria-current="page"' if current_section == "alumni" else ""
    return f'''          <nav class="top-links" aria-label="Profile navigation">
            <a href="{escape(root_prefix)}index.html#about">About</a>
            <a href="{escape(team_href)}"{team_current}>Team</a>
            <a href="{escape(root_prefix)}index.html#publications">Publications</a>
            <a href="{escape(root_prefix)}index.html#gallery">Gallery</a>
            <a href="{escape(alumni_href)}"{alumni_current}>Alumni</a>
            <a href="{escape(root_prefix)}index.html#contact">Contact</a>
          </nav>'''


def render_current_profile(person: dict[str, Any], flat: bool) -> str:
    root_prefix = "" if flat else "../"
    role = clean_text(person.get("labRole"))
    name = clean_text(person.get("name"))
    lab_dates = clean_text(person.get("labDates"))
    email = clean_text(person.get("email"))
    links = person.get("links") or []
    action_links = []
    action_links.append(
        f'<a class="button button-primary" href="{escape(root_prefix)}index.html#team">Back to team directory</a>'
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
    canonical = f"{CANONICAL_SITE_URL}/{clean_text(person.get('slug'))}/"
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
    <link rel="stylesheet" href="{escape(root_prefix)}assets/profile.css?v=20260320a" />
    <link rel="canonical" href="{escape(canonical)}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="page">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="{escape(root_prefix)}index.html" aria-label="Thomas Bernhardt Lab home">
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
    root_prefix = "" if flat else "../"
    verification = person.get("verification") or {}
    verified_url = clean_text(verification.get("url"))
    verified_source = clean_text(verification.get("verifiedSource"))
    source_label = clean_text(verification.get("sourceLabel")) or "Bernhardt lab records"
    name = clean_text(person.get("name"))
    canonical = f"{CANONICAL_SITE_URL}/alumni-profiles/{clean_text(person.get('slug'))}.html"
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
    <link rel="stylesheet" href="{escape(root_prefix)}assets/profile.css?v=20260320a" />
    <link rel="canonical" href="{escape(canonical)}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="page">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="{escape(root_prefix)}index.html" aria-label="Thomas Bernhardt Lab home">
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
              <p class="role">{escape(person.get("labRole") or "Former lab member")}</p>
              {f'<p class="profile-lab-dates"><strong>Lab dates:</strong> {escape(person.get("labDates"))}</p>' if clean_text(person.get("labDates")) else ''}
              <p class="bio">{escape(person.get("profileSummary") or f"Former member of the Bernhardt Lab. {clean_text(person.get('currentRole'))}")}</p>
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
            </article>
            <article class="profile-panel">
              <h2>Current / Latest Role</h2>
              <p>{escape(person.get("currentRole") or "Role update pending")}</p>
            </article>
            <article class="profile-panel">
              <h2>Sources</h2>
              <p><strong>Source:</strong> {escape(source_label)}</p>
              {f'<p><strong>Verified by:</strong> <a class="profile-link" href="{escape(verified_url)}" target="_blank" rel="noreferrer">{escape(verified_source or "Institutional profile")}</a></p>' if verified_url else '<p><strong>External verification:</strong> not available</p>'}
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
        return replace_people_grid_inner(text, content)
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


def root_page_to_flat(text: str) -> str:
    replacements = [
        ('content="canonical"', 'content="flat"'),
        ('href="people/"', 'href="people.html"'),
        ('href="alumni/"', 'href="alumni.html"'),
        ('href="accessibility/"', 'href="accessibility.html"'),
        ('href="research-library/"', 'href="research-library.html"'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def nested_page_to_flat(text: str) -> str:
    replacements = [
        ('content="canonical"', 'content="flat"'),
        ('href="../index.html"', 'href="index.html"'),
        ('href="../index.html#', 'href="index.html#'),
        ('href="../people/"', 'href="people.html"'),
        ('href="../alumni/"', 'href="alumni.html"'),
        ('href="../accessibility/"', 'href="accessibility.html"'),
        ('href="../research-library/"', 'href="research-library.html"'),
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


def build_canonical_pages() -> None:
    people = current_people(load_people())
    alumni = alumni_people(load_people())

    index_text = read_text(ROOT / "index.html")
    write_text(ROOT / "index.html", replace_template_with_people(index_text, people, root_prefix="", flat=False, view="landing"))

    people_text = read_text(ROOT / "people" / "index.html")
    write_text(
        ROOT / "people" / "index.html",
        replace_template_with_people(people_text, people, root_prefix="../", flat=False, view="directory"),
    )

    alumni_text = read_text(ROOT / "alumni" / "index.html")
    write_text(
        ROOT / "alumni" / "index.html",
        replace_template_with_alumni(alumni_text, alumni, root_prefix="../", flat=False),
    )

    for person in people:
        write_text(ROOT / clean_text(person.get("slug")) / "index.html", render_current_profile(person, flat=False))

    for person in alumni:
        write_text(ROOT / "alumni-profiles" / f"{clean_text(person.get('slug'))}.html", render_alumni_profile(person, flat=False))


def sync_flat_assets() -> None:
    shutil.rmtree(FLAT_DIR / "assets", ignore_errors=True)
    shutil.rmtree(FLAT_DIR / "data", ignore_errors=True)
    shutil.copytree(ASSETS_DIR, FLAT_DIR / "assets")
    shutil.copytree(DATA_DIR, FLAT_DIR / "data")


def cleanup_flat_legacy_files() -> None:
    for filename in LEGACY_FLAT_FILES:
        path = FLAT_DIR / filename
        if path.exists():
            path.unlink()


def build_flat_pages() -> None:
    people = current_people(load_people())
    alumni = alumni_people(load_people())

    index_text = root_page_to_flat(read_text(ROOT / "index.html"))
    index_text = replace_template_with_people(index_text, people, root_prefix="", flat=True, view="landing")
    write_text(FLAT_DIR / "index.html", index_text)

    people_text = nested_page_to_flat(read_text(ROOT / "people" / "index.html"))
    people_text = replace_template_with_people(people_text, people, root_prefix="", flat=True, view="directory")
    write_text(FLAT_DIR / "people.html", people_text)

    alumni_text = nested_page_to_flat(read_text(ROOT / "alumni" / "index.html"))
    alumni_text = replace_template_with_alumni(alumni_text, alumni, root_prefix="", flat=True)
    write_text(FLAT_DIR / "alumni.html", alumni_text)

    write_text(FLAT_DIR / "accessibility.html", nested_page_to_flat(read_text(ROOT / "accessibility" / "index.html")))
    write_text(FLAT_DIR / "research-library.html", nested_page_to_flat(read_text(ROOT / "research-library" / "index.html")))

    for person in people:
        write_text(FLAT_DIR / f"{clean_text(person.get('slug'))}.html", render_current_profile(person, flat=True))

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
    if target == "people":
        return "people.html"
    if target == "alumni":
        return "alumni.html"
    if target == "accessibility":
        return "accessibility.html"
    if target == "research-library":
        return "research-library.html"
    if target.startswith("alumni-profiles/"):
        slug = target.split("/")[-1].replace(".html", "")
        return f"alumni-{slug}.html"
    return f"{target}.html"


def sync_flat_redirects() -> None:
    excluded = {"people", "alumni", "accessibility", "research-library", "assets", "data", "github-flat", ".git", ".github", "scripts", "docs"}
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
        flat_text = re.sub(
            r'(<meta http-equiv="refresh" content="0; url=)([^"]+)(" />)',
            rf'\1{flat_target}\3',
            text,
        )
        canonical_match = re.search(r'<link rel="canonical" href="([^"]+)"', flat_text)
        if canonical_match:
            flat_text = flat_text.replace(canonical_match.group(1), canonical_match.group(1))
        write_text(FLAT_DIR / f"{child.name}.html", flat_text)


def build_site() -> None:
    load_gallery_items()
    load_featured_alumni_items()
    load_curated_publications()
    load_site_copy()
    sync_runtime_config_js()
    compile_styles()
    build_canonical_pages()
    sync_flat_assets()
    build_flat_pages()
    cleanup_flat_legacy_files()


if __name__ == "__main__":
    build_site()
