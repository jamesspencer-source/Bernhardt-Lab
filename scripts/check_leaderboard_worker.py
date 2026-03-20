#!/usr/bin/env python3
"""Smoke-test the live Envelope Escape leaderboard worker."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict


REQUIRED_KEYS = ("entries", "totalEntries", "updatedAt", "board")


def fetch_url(url: str, timeout: int = 20) -> str:
    try:
        request = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.read().decode("utf-8", "ignore")
    except Exception:
        proc = subprocess.run(
            ["curl", "-L", "-sS", "--fail", url],
            check=True,
            capture_output=True,
            text=True,
        )
        return proc.stdout


def fetch_json(url: str, timeout: int = 20) -> Dict[str, Any]:
    return json.loads(fetch_url(url, timeout=timeout))


def normalize_endpoint(value: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    parsed = urllib.parse.urlparse(raw)
    if parsed.scheme not in {"http", "https"}:
        return ""
    if not parsed.netloc:
        return ""
    if not parsed.path.endswith("/leaderboard"):
        return ""
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))


def load_endpoint(root: Path, override: str) -> str:
    if override:
        endpoint = normalize_endpoint(override)
    else:
        runtime_config = json.loads((root / "data" / "runtime-config.json").read_text(encoding="utf-8"))
        endpoint = normalize_endpoint(runtime_config.get("leaderboardUrl", ""))
    if not endpoint:
        raise RuntimeError("No valid leaderboard endpoint configured.")
    return endpoint


def daily_board_name() -> str:
    return f"daily-{datetime.now(timezone.utc).date().isoformat()}"


def validate_payload(board: str, payload: Dict[str, Any]) -> None:
    if not isinstance(payload, dict):
        raise RuntimeError(f"{board}: response is not a JSON object")
    missing = [key for key in REQUIRED_KEYS if key not in payload]
    if missing:
        raise RuntimeError(f"{board}: missing response keys: {', '.join(missing)}")
    if not isinstance(payload.get("entries"), list):
        raise RuntimeError(f"{board}: `entries` is not a list")
    if not isinstance(payload.get("totalEntries"), int):
        raise RuntimeError(f"{board}: `totalEntries` is not an integer")
    if not isinstance(payload.get("updatedAt"), int):
        raise RuntimeError(f"{board}: `updatedAt` is not an integer")
    if str(payload.get("board", "")).strip() != board:
        raise RuntimeError(f"{board}: response board `{payload.get('board')}` did not match request")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="", help="Optional leaderboard endpoint override")
    parser.add_argument("--timeout", type=int, default=20, help="Request timeout in seconds")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    endpoint = load_endpoint(root, args.url)
    boards = ("classic", daily_board_name())

    print(f"Checking leaderboard worker: {endpoint}")
    for board in boards:
        query = urllib.parse.urlencode({"board": board})
        payload = fetch_json(f"{endpoint}?{query}", timeout=args.timeout)
        validate_payload(board, payload)
        print(f"  OK {board}: {len(payload['entries'])} entries, totalEntries={payload['totalEntries']}")

    print("Leaderboard worker smoke check passed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
