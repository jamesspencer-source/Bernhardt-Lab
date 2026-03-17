#!/usr/bin/env python3

from __future__ import annotations

import ast
import html
import os
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MAIN_JS = ROOT / "assets" / "main.js"
ALUMNI_DATA_JS = ROOT / "assets" / "alumni-data.js"

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
    return path.read_text()


def extract_literal(text: str, variable_name: str) -> object:
    pattern = re.compile(rf"const {re.escape(variable_name)}\s*=\s*(\[.*?\]|\{{.*?\}})\s*;", re.S)
    match = pattern.search(text)
    if not match:
        raise RuntimeError(f"Could not find {variable_name}")
    literal = re.sub(r"([{\[,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)", r'\1"\2"\3', match.group(1))
    return ast.literal_eval(literal)


def extract_verified_profiles(text: str) -> dict[str, dict[str, str]]:
    pattern = re.compile(r"const verifiedAlumniProfiles\s*=\s*(\{.*?\})\s*;", re.S)
    match = pattern.search(text)
    if not match:
        raise RuntimeError("Could not find verifiedAlumniProfiles")
    return extract_literal(text, "verifiedAlumniProfiles")


def clean_text(value: object = "") -> str:
    return str(value or "").replace("\u00a0", " ").replace("\u2019", "'").strip()


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", clean_text(value).lower()).strip("-")


def prettify_role(role: str, name: str) -> str:
    if name == "Thomas Bernhardt":
        return "Professor in the Department of Microbiology at Harvard Medical School and Investigator of the Howard Hughes Medical Institute."
    if name == "James Spencer":
        return "Laboratory Manager, Thomas Bernhardt Lab"
    return role


def classify_group(role: str, name: str) -> str:
    label = f"{role} {name}".lower()
    if "professor" in label or "investigator" in label or "principal investigator" in label:
        return "Faculty"
    if "postdoctoral" in label:
        return "Postdoctoral Fellows"
    if "undergrad" in label or "undergraduate" in label:
        return "Undergraduate Researchers"
    if "graduate" in label or "bbs" in label or "bph" in label or "mco" in label:
        return "Graduate Students"
    return "Research Staff"


def normalize_bio(name: str, bio: str) -> str:
    if name == "Thomas Bernhardt":
        return ""
    text = clean_text(bio)
    return (
        text.replace("gram negative bacteria pseudomonas aeruginosa", "Gram-negative bacterium Pseudomonas aeruginosa")
        .replace("special protein localization", "spatial protein localization")
        .replace("Eschericia", "Escherichia")
        .replace("that drives", "that drive")
    )


def escape(value: object = "") -> str:
    return html.escape(clean_text(value), quote=True)


def format_species_text(value: str) -> str:
    escaped = html.escape(clean_text(value), quote=True)
    for pattern in SPECIES_PATTERNS:
        escaped = pattern.sub(lambda match: f'<em class="species-name">{match.group(0)}</em>', escaped)
    return escaped


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


def role_bucket(role: str) -> str:
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
    month_matches = list(re.finditer(r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+((?:19|20)\d{2})\b", text))
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


def resolve_directory_image(path: str, directory_parent: Path, flat: bool) -> str:
    normalized = clean_text(path)
    if flat:
        return Path(normalized).name
    return os.path.relpath(ROOT / normalized, directory_parent).replace(os.sep, "/")


def build_people() -> list[dict[str, str]]:
    text = read_text(MAIN_JS)
    raw_people = extract_literal(text, "rawPeople")
    focus_by_name = extract_literal(text, "focusByName")
    people: list[dict[str, str]] = []
    for person in raw_people:
        name = clean_text(person.get("name", ""))
        role = clean_text(prettify_role(person.get("role", ""), name))
        group = classify_group(role, name)
        focus = focus_by_name.get(name, {"x": 0.5, "y": 0.46})
        profile_slug = slugify(name)
        people.append(
            {
                "name": name,
                "role": role,
                "group": group,
                "bio": normalize_bio(name, person.get("bio", "")),
                "profile_slug": profile_slug,
                "image": clean_text(person.get("image", "")),
                "focus_x": f"{focus.get('x', 0.5) * 100:.1f}%",
                "focus_y": f"{focus.get('y', 0.46) * 100:.1f}%",
            }
        )
    return people


def build_alumni() -> list[dict[str, str]]:
    text = read_text(ALUMNI_DATA_JS)
    raw_alumni = extract_literal(text, "rawAlumni")
    verified_profiles = extract_verified_profiles(text)
    deduped: dict[str, dict[str, str]] = {}

    for entry in raw_alumni:
        name = clean_text(entry.get("name", ""))
        if not name:
            continue
        existing = deduped.get(name, {})
        role_in_lab = title_case(entry.get("role_in_lab", ""))
        current_role = clean_text(entry.get("current_role", ""))
        lab_dates = clean_text(entry.get("lab_dates", ""))

        if not current_role and " at " in role_in_lab.lower():
            current_role = role_in_lab
            role_in_lab = ""

        if "john hopkins" in current_role.lower():
            current_role = re.sub("john hopkins", "Johns Hopkins", current_role, flags=re.I)

        normalized = {
            "name": name,
            "role_in_lab": role_in_lab or existing.get("role_in_lab", ""),
            "current_role": current_role or existing.get("current_role", ""),
            "lab_dates": lab_dates or existing.get("lab_dates", ""),
            "source_label": "Bernhardt lab records"
            if clean_text(entry.get("source", "Bernhardt lab records")).lower() == "bernhardt lab records"
            else clean_text(entry.get("source", "Bernhardt lab records")),
        }
        deduped[name] = normalized

    rows = []
    for entry in deduped.values():
        verified = verified_profiles.get(entry["name"], {})
        rows.append(
            {
                **entry,
                "slug": slugify(entry["name"]),
                "bucket": role_bucket(entry["role_in_lab"]),
                "verified": bool(verified),
                "profile_url": clean_text(verified.get("url", "")),
                "verified_source": clean_text(verified.get("source", "")),
                "left_sort_key": parse_lab_end_sort_key(entry["lab_dates"]),
                "last_name_key": last_name_key(entry["name"]),
            }
        )

    rows.sort(key=lambda item: (-item["left_sort_key"], item["name"]))
    return rows


def replace_marker_block(text: str, start_marker: str, end_marker: str, content: str) -> str:
    pattern = re.compile(
        rf"({re.escape(start_marker)}\n)(.*?)(\n\s*{re.escape(end_marker)})",
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise RuntimeError(f"Could not find marker block: {start_marker}")
    return text[: match.start()] + match.group(1) + content.rstrip() + match.group(3) + text[match.end() :]


def render_people_cards(flat: bool) -> str:
    cards = []
    directory_parent = ROOT / "github-flat" if flat else ROOT / "people"
    for index, person in enumerate(build_people()):
        image = escape(resolve_directory_image(person["image"], directory_parent, flat))
        profile = f"./{person['profile_slug']}.html" if flat else f"../{person['profile_slug']}/"
        bio_markup = (
            f'              <p class="person-bio person-bio--directory">{format_species_text(person["bio"])}</p>\n'
            if person["bio"]
            else ""
        )
        cards.append(
            f"""          <article class="person-card person-card--directory" style="--index:{index};">
            <div class="person-photo-wrap">
              <img class="person-photo" src="{image}" alt="{escape(person['name'])}" style="--focus-x:{escape(person['focus_x'])};--focus-y:{escape(person['focus_y'])};" loading="lazy" />
            </div>
            <div class="person-body">
              <p class="person-role">{escape(person['role'])}</p>
              <h3>{escape(person['name'])}</h3>
{bio_markup.rstrip()}
              <div class="person-links">
                <a class="person-link" href="{escape(profile)}">View full profile</a>
              </div>
            </div>
          </article>"""
        )
    return "\n".join(cards)


def render_alumni_cards(flat: bool) -> str:
    cards = []
    for entry in build_alumni():
        profile = f"alumni-{entry['slug']}.html" if flat else f"../alumni-profiles/{entry['slug']}.html"
        verified_badge = '<span class="alumni-verified">Verified profile</span>' if entry["verified"] else ""
        verified_link = (
            f'<p class="alumni-source"><strong>Verified by:</strong> <a class="alumni-inline-link" href="{escape(entry["profile_url"])}" target="_blank" rel="noreferrer">{escape(entry["verified_source"] or "Institutional profile")}</a></p>'
            if entry["profile_url"]
            else '<p class="alumni-source"><strong>External verification:</strong> not available</p>'
        )
        secondary_link = (
            f'              <a class="alumni-link" href="{escape(entry["profile_url"])}" target="_blank" rel="noreferrer">View current institutional profile</a>\n'
            if entry["profile_url"]
            else ""
        )
        dates_markup = (
            f'            <p class="alumni-role"><strong>Lab dates:</strong> {escape(entry["lab_dates"])}</p>\n'
            if entry["lab_dates"]
            else ""
        )
        cards.append(
            f"""          <article class="alumni-card">
            <div class="alumni-top">{verified_badge}</div>
            <h3>{escape(entry['name'])}</h3>
            <p class="alumni-role"><strong>Role in lab:</strong> {escape(entry['role_in_lab'] or 'Former lab member')}</p>
{dates_markup.rstrip()}
            <p class="alumni-current"><strong>Current / latest role:</strong> {escape(entry['current_role'] or 'Role update pending')}</p>
            <p class="alumni-source"><strong>Source:</strong> {escape(entry['source_label'] or 'Bernhardt lab records')}</p>
            {verified_link}
            <div class="alumni-links">
              <a class="alumni-link" href="{escape(profile)}">Open alumni profile</a>
{secondary_link.rstrip()}
            </div>
          </article>"""
        )
    return "\n".join(cards)


def update_people_page(path: Path, flat: bool) -> None:
    text = path.read_text()
    people = build_people()
    text = replace_marker_block(text, "<!-- generated-people-count:start -->", "<!-- generated-people-count:end -->", f"Showing {len(people)} current lab members")
    text = replace_marker_block(text, "<!-- generated-people-grid:start -->", "<!-- generated-people-grid:end -->", render_people_cards(flat))
    path.write_text(text)


def update_alumni_page(path: Path, flat: bool) -> None:
    text = path.read_text()
    alumni = build_alumni()
    label = "entry" if len(alumni) == 1 else "entries"
    text = replace_marker_block(text, "<!-- generated-alumni-count:start -->", "<!-- generated-alumni-count:end -->", f"Showing {len(alumni)} alumni {label}")
    text = replace_marker_block(text, "<!-- generated-alumni-grid:start -->", "<!-- generated-alumni-grid:end -->", render_alumni_cards(flat))
    path.write_text(text)


def main() -> None:
    update_people_page(ROOT / "people" / "index.html", flat=False)
    update_people_page(ROOT / "github-flat" / "people.html", flat=True)
    update_alumni_page(ROOT / "alumni" / "index.html", flat=False)
    update_alumni_page(ROOT / "github-flat" / "alumni.html", flat=True)
    print("Updated static team and alumni directory markup.")


if __name__ == "__main__":
    main()
