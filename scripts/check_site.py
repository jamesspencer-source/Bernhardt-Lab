#!/usr/bin/env python3
"""Build and verify the site; optionally run the desktop/mobile browser regressions."""

from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import shutil
import subprocess
import sys
import threading

from publish_site import tree_state

ROOT = Path(__file__).resolve().parents[1]


def run(command: list[str]) -> None:
    subprocess.run(command, cwd=ROOT, check=True, timeout=600)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args: object) -> None:
        pass


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", action="store_true", help="Require Playwright and run browser regressions")
    parser.add_argument("--skip-build", action="store_true", help="Validate output already built by the publisher")
    parser.add_argument("--evidence", type=Path, help="Optional local-only browser evidence directory")
    args = parser.parse_args()
    node = os.environ.get("NODE_BINARY") or shutil.which("node")
    if args.browser and not node:
        raise RuntimeError("Browser checks require Node.js 20+ and Playwright. See docs/site-maintenance.md; no publish was performed.")
    if not args.skip_build:
        run([sys.executable, "-B", "scripts/build_site.py"])
    before = tree_state(ROOT)
    run([sys.executable, "-B", "scripts/build_site.py"])
    if before != tree_state(ROOT):
        raise RuntimeError("A second build changed generated output. Fix build reproducibility before publishing.")
    run([sys.executable, "-B", "-m", "unittest", "discover", "-s", "scripts", "-p", "test_*.py", "-v"])
    if args.browser:
        server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            command = [node, "scripts/check_site_browser.cjs", f"http://127.0.0.1:{server.server_port}"]
            if args.evidence:
                command.append(str(args.evidence.resolve()))
            run(command)
        finally:
            server.shutdown()
            server.server_close()
            thread.join()
    print("Site checks passed: build, Tom compliance, reproducibility, regression tests" + (", and browser QA." if args.browser else "."))


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, subprocess.SubprocessError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
