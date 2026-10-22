"""Require GitHub's quality workflow on the exact release commit before updating main."""

from __future__ import annotations

import json
import os
import re
import subprocess
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import HTTPRedirectHandler, Request, build_opener

REPOSITORY = "jamesspencer-source/Bernhardt-Lab"
WORKFLOW = "check-site.yml"
CHECK_NAME = "site-quality"
GITHUB_ACTIONS_APP_ID = 15368


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *_args, **_kwargs):
        raise RuntimeError("Unexpected redirect from the GitHub API")


def github_api(path: str, payload: dict | None = None):
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "Bernhardt-Lab-release"}
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = "Bearer " + token
    data = None
    if payload is not None:
        data = json.dumps(payload).encode()
        headers["Content-Type"] = "application/json"
    request = Request(f"https://api.github.com/repos/{REPOSITORY}/{path}", data=data, headers=headers)
    try:
        with build_opener(NoRedirect).open(request, timeout=30) as response:
            body = response.read(2_000_001)
            if len(body) > 2_000_000:
                raise RuntimeError("GitHub returned an unexpectedly large release response")
            return json.loads(body) if body else None
    except HTTPError as exc:
        # Never echo token-bearing request headers or response bodies.
        raise RuntimeError(f"GitHub release request failed (HTTP {exc.code}); main was not bypassed") from None


def check_result(payload: dict, sha: str) -> str:
    runs = [
        run for run in payload.get("check_runs", [])
        if run.get("head_sha") == sha and run.get("name") == CHECK_NAME
        and (run.get("app") or {}).get("id") == GITHUB_ACTIONS_APP_ID
    ]
    if not runs:
        return "pending"
    latest = max(runs, key=lambda run: run["id"])
    if latest.get("status") != "completed":
        return "pending"
    return "success" if latest.get("conclusion") == "success" else "failed"


def release_checked_commit(root: Path, sha: str, *, timeout: float = 1200) -> None:
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Release needs an exact Git commit")
    remote = subprocess.check_output(["git", "remote", "get-url", "--push", "origin"], cwd=root, text=True).strip()
    allowed = {f"git@github.com:{REPOSITORY}.git", f"https://github.com/{REPOSITORY}", f"https://github.com/{REPOSITORY}.git"}
    if remote not in allowed:
        raise RuntimeError("Release origin does not match the Bernhardt Lab repository")
    branch = "release/site-" + sha[:16]
    subprocess.run(["git", "push", "origin", f"{sha}:refs/heads/{branch}"], cwd=root, check=True)
    if os.environ.get("GITHUB_ACTIONS") == "true":
        if not (os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")):
            raise RuntimeError("Automated release needs its short-lived GitHub token to dispatch quality checks")
        github_api(f"actions/workflows/{WORKFLOW}/dispatches", {"ref": branch})
    print(f"[publish] Waiting for GitHub quality checks on {branch}", flush=True)
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        result = check_result(github_api(f"commits/{sha}/check-runs?per_page=100"), sha)
        if result == "success":
            break
        if result == "failed":
            raise RuntimeError(f"GitHub quality checks failed. Main is unchanged; inspect {branch}.")
        time.sleep(20)
    else:
        raise RuntimeError(f"GitHub quality checks did not finish. Main is unchanged; release retained at {branch}.")
    # No force push: if main changed during testing, Git refuses the stale release.
    subprocess.run(["git", "push", "origin", f"{sha}:refs/heads/main"], cwd=root, check=True)
    if os.environ.get("GITHUB_ACTIONS") == "true":
        github_api("pages/builds", {})
    print("[publish] Published the exact commit that passed GitHub quality checks.", flush=True)
