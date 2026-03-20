#!/usr/bin/env python3
"""Refresh the featured YouTube video view count feed for the website."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

from site_builder import build_site


YOUTUBE_API_ENDPOINT = "https://www.googleapis.com/youtube/v3/videos"
YOUTUBE_FALLBACK_ENDPOINT = "https://returnyoutubedislikeapi.com/votes"
DEFAULT_VIDEO_ID = "RxHTaTmPlwQ"


def fetch_url(url: str, timeout: int = 20) -> str:
    """Fetch URL via urllib with curl fallback for CI environments."""
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
    payload = fetch_url(url, timeout=timeout)
    return json.loads(payload)


def parse_view_count(raw_value: Any) -> Optional[int]:
    if raw_value is None:
        return None
    text = str(raw_value).replace(",", "").strip()
    if not text:
        return None
    try:
        value = int(float(text))
    except (TypeError, ValueError):
        return None
    if value < 0:
        return None
    return value


def fetch_with_data_api(video_id: str, api_key: str) -> Optional[Tuple[int, str]]:
    if not api_key:
        return None
    query = urllib.parse.urlencode(
        {
            "part": "statistics",
            "id": video_id,
            "key": api_key,
        }
    )
    payload = fetch_json(f"{YOUTUBE_API_ENDPOINT}?{query}")
    count = parse_view_count(payload.get("items", [{}])[0].get("statistics", {}).get("viewCount"))
    if count is None:
        return None
    return count, "youtube-data-api"


def fetch_with_fallback_api(video_id: str) -> Optional[Tuple[int, str]]:
    query = urllib.parse.urlencode({"videoId": video_id})
    payload = fetch_json(f"{YOUTUBE_FALLBACK_ENDPOINT}?{query}")
    count = parse_view_count(payload.get("viewCount"))
    if count is None:
        return None
    return count, "returnyoutubedislikeapi"


def resolve_view_count(video_id: str, api_key: str) -> Tuple[int, str]:
    for loader in (
        lambda: fetch_with_data_api(video_id, api_key),
        lambda: fetch_with_fallback_api(video_id),
    ):
        try:
            result = loader()
        except Exception:
            result = None
        if result:
            return result
    raise RuntimeError("Unable to resolve YouTube view count from configured sources.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video-id", default=DEFAULT_VIDEO_ID, help="YouTube video ID")
    parser.add_argument(
        "--api-key",
        default=os.getenv("YOUTUBE_DATA_API_KEY", ""),
        help="YouTube Data API key (optional; env: YOUTUBE_DATA_API_KEY)",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    structured_path = root / "assets" / "data" / "youtube-video-stats.json"
    try:
        view_count, source = resolve_view_count(args.video_id, str(args.api_key or "").strip())
    except Exception as exc:
        if structured_path.exists():
            print(f"WARNING: {exc}")
            print("Keeping existing video stats files unchanged.")
            return 0
        raise
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    payload = {
        "generatedAt": generated_at,
        "videoId": args.video_id,
        "viewCount": view_count,
        "source": source,
    }

    structured_path.parent.mkdir(parents=True, exist_ok=True)
    structured_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    build_site()
    print(f"Updated YouTube views: {view_count:,} ({source})")
    print(f"  - {structured_path}")
    print("Regenerated canonical and github-flat outputs.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # pragma: no cover
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
