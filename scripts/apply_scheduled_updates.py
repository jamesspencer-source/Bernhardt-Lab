#!/usr/bin/env python3
"""Apply due future-dated website updates."""

from __future__ import annotations

import argparse
import json
from copy import deepcopy
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from site_builder import clean_text, validate_scheduled_updates


ROOT = Path(__file__).resolve().parents[1]
PEOPLE_PATH = ROOT / "data" / "people.json"
SCHEDULE_PATH = ROOT / "data" / "scheduled-updates.json"
NY_TZ = ZoneInfo("America/New_York")
CONTROL_FIELDS = {"id", "effectiveDate", "slug", "removeEmail", "keepEmail"}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def today_new_york() -> date:
    return datetime.now(NY_TZ).date()


def parse_date(value: object) -> date:
    return date.fromisoformat(clean_text(value))


def apply_transition(person: dict, transition: dict) -> None:
    for key, value in transition.items():
        if key in CONTROL_FIELDS:
            continue
        person[key] = value

    person["status"] = "alumni"
    person["profileType"] = "alumni"
    person["group"] = clean_text(transition.get("group"))

    keep_email = bool(transition.get("keepEmail", False))
    remove_email = bool(transition.get("removeEmail", not keep_email))
    if remove_email and not keep_email:
        person["email"] = ""


def apply_scheduled_updates(effective_today: date, dry_run: bool = False) -> list[str]:
    if not SCHEDULE_PATH.exists():
        return []

    people_payload = read_json(PEOPLE_PATH)
    schedule_payload = read_json(SCHEDULE_PATH)
    people = people_payload.get("people", [])
    validate_scheduled_updates(people)

    people_by_slug = {clean_text(person.get("slug")): person for person in people}
    applied_entries = schedule_payload.setdefault("appliedPeopleTransitions", [])
    applied_ids = {clean_text(entry.get("id")) for entry in applied_entries if isinstance(entry, dict)}
    remaining = []
    applied_now: list[str] = []

    for transition in schedule_payload.get("peopleTransitions", []):
        transition_id = clean_text(transition.get("id"))
        if transition_id in applied_ids:
            remaining.append(transition)
            continue
        if parse_date(transition.get("effectiveDate")) > effective_today:
            remaining.append(transition)
            continue

        slug = clean_text(transition.get("slug"))
        person = people_by_slug[slug]
        applied_now.append(transition_id)
        if dry_run:
            remaining.append(transition)
            continue

        apply_transition(person, transition)
        archived = deepcopy(transition)
        archived["appliedAt"] = datetime.now(NY_TZ).isoformat(timespec="seconds")
        applied_entries.append(archived)

    if not dry_run:
        schedule_payload["peopleTransitions"] = remaining
        write_json(PEOPLE_PATH, people_payload)
        write_json(SCHEDULE_PATH, schedule_payload)

    return applied_now


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--today", help="Override today's date for local testing, in YYYY-MM-DD format")
    parser.add_argument("--dry-run", action="store_true", help="Print due updates without writing files")
    args = parser.parse_args()

    effective_today = parse_date(args.today) if args.today else today_new_york()
    applied = apply_scheduled_updates(effective_today, dry_run=args.dry_run)
    if not applied:
        print(f"No scheduled website updates due on {effective_today.isoformat()}.")
        return 0
    action = "Would apply" if args.dry_run else "Applied"
    print(f"{action} scheduled website updates: {', '.join(applied)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
