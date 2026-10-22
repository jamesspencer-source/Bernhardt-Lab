"""Regression coverage for build-time browser safeguards."""

import base64
import hashlib
from html import unescape
from pathlib import Path
import unittest

from browser_policy import PageSecurity, apply_browser_policy


URL = "https://board.example/leaderboard"


class BrowserPolicyTests(unittest.TestCase):
    def test_hashes_exact_script_style_and_importmap_bytes(self):
        script = "\n  window.example = 1;\n"
        style = "body {color:red}"
        source = '<html><head><meta charset="UTF-8"><script>' + script + '</script><script type="importmap">{"imports":{}}</script><style>' + style + '</style></head></html>'
        output = unescape(apply_browser_policy(source, URL))
        for value in [script, style, '{"imports":{}}']:
            digest = base64.b64encode(hashlib.sha256(value.encode()).digest()).decode()
            self.assertIn("'sha256-" + digest + "'", output)
        self.assertIn("script-src-attr 'none'", output)
        self.assertNotIn("unsafe-eval", output)
        self.assertNotIn("script-src 'self' 'unsafe-inline'", output)
        self.assertLess(output.index("Content-Security-Policy"), output.index("<script>"))
        self.assertIn("connect-src 'self' https://board.example", output)

    def test_rebuild_replaces_stale_policies_without_churn(self):
        source = '<head>\n    <meta charset="UTF-8" />\n    <script>void 0;</script></head>'
        once = apply_browser_policy(source, URL)
        self.assertEqual(apply_browser_policy(once, URL), once)
        self.assertEqual(once.count('http-equiv="Content-Security-Policy"'), 1)
        changed = apply_browser_policy(once.replace("void 0;", "void 1;"), URL)
        self.assertNotEqual(PageSecurity(once).hashes, PageSecurity(changed).hashes)

    def test_inline_handlers_and_script_urls_fail_build(self):
        for unsafe in ['<img onerror="alert(1)">', '<a href="javascript:alert(1)">link</a>']:
            with self.subTest(unsafe=unsafe), self.assertRaises(ValueError):
                apply_browser_policy('<head><meta charset="UTF-8"></head>' + unsafe, URL)

    def test_invalid_endpoint_cannot_expand_policy(self):
        for url in ["http://board.example", "https://user:pass@board.example", "https://board.example:444", ""]:
            with self.subTest(url=url), self.assertRaises(ValueError):
                apply_browser_policy('<head><meta charset="UTF-8"></head>', url)

    def test_all_published_html_has_current_policy(self):
        import site_builder as site
        import json
        url = json.loads((site.DATA_DIR / "runtime-config.json").read_text())["leaderboardUrl"]
        for path in site.iter_public_html_paths():
            with self.subTest(page=path.relative_to(site.ROOT)):
                text = path.read_text()
                self.assertEqual(text, apply_browser_policy(text, url))
                self.assertIn('name="referrer" content="strict-origin-when-cross-origin"', text)


if __name__ == "__main__":
    unittest.main()
