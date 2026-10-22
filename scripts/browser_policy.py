"""Generate a GitHub Pages-compatible policy without allowing arbitrary inline scripts."""

from __future__ import annotations

import base64
import hashlib
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit


class PageSecurity(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=False)
        self.hashes = {"script": set(), "style": set()}
        self.remove = []
        self.charset = None
        self.active = None
        self.parts = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "meta":
            if "charset" in values:
                self.charset = self.get_starttag_text()
            if (values.get("http-equiv") or "").lower() == "content-security-policy" or (values.get("name") or "").lower() == "referrer":
                self.remove.append(self.get_starttag_text())
        if tag in self.hashes and not values.get("src"):
            self.active, self.parts = tag, []
        if any(name.lower().startswith("on") for name, _ in attrs):
            raise ValueError("Inline event handlers are not permitted in public HTML")
        if any((value or "").strip().lower().startswith("javascript:") for name, value in attrs if name in {"href", "src", "action"}):
            raise ValueError("JavaScript URLs are not permitted in public HTML")

    def handle_data(self, data):
        if self.active:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag == self.active:
            digest = base64.b64encode(hashlib.sha256("".join(self.parts).encode()).digest()).decode()
            self.hashes[tag].add("'sha256-" + digest + "'")
            self.active = None


def apply_browser_policy(text: str, leaderboard_url: str) -> str:
    page = PageSecurity(text)
    if not page.charset:
        raise ValueError("Public HTML needs an explicit charset before its security policy")
    endpoint = urlsplit(leaderboard_url)
    if endpoint.scheme != "https" or endpoint.username or endpoint.password or endpoint.port not in (None, 443) or not re.fullmatch(r"[a-z0-9]+(?:[.-][a-z0-9]+)*", endpoint.hostname or ""):
        raise ValueError("Leaderboard connection policy requires a public HTTPS origin")
    origin = "https://" + endpoint.netloc
    directives = [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'none'",
        "script-src 'self' " + " ".join(sorted(page.hashes["script"])),
        "script-src-attr 'none'",
        "style-src 'self'",
        "style-src-elem 'self' " + " ".join(sorted(page.hashes["style"])),
        # Existing layout and game animation set element styles, but never style elements.
        "style-src-attr 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self' " + origin,
        "frame-src https://www.youtube-nocookie.com https://www.google.com",
        "worker-src 'none'",
    ]
    for tag in page.remove:
        text = text.replace("\n    " + tag, "").replace(tag, "")
    policy = "; ".join(part.strip() for part in directives)
    tags = (
        '\n    <meta http-equiv="Content-Security-Policy" content="' + escape(policy, quote=True) + '" />'
        '\n    <meta name="referrer" content="strict-origin-when-cross-origin" />'
    )
    return text.replace(page.charset, page.charset + tags, 1)
