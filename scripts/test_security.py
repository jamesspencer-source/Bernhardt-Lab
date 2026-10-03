"""Offline regression tests for importer network boundaries and release safeguards."""

from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import re
import socket
import struct
import tempfile
import threading
import time
import unittest
from unittest.mock import MagicMock, patch

import public_http
import refresh_research_in_motion as importer
from image_metadata import metadata_issues, rights_only_xmp


def answers(*addresses):
    return [(socket.AF_INET6 if ":" in ip else socket.AF_INET, socket.SOCK_STREAM, 6, "", (ip, 443)) for ip in addresses]


def response(status=200, body=b"image", location=None, length=None):
    result = MagicMock(status=status)
    result.getheader.side_effect = lambda key: {"Location": location, "Content-Length": length}.get(key)
    result.read.return_value = body
    return result


class PublicFetchTests(unittest.TestCase):
    def test_private_and_alternate_addresses_never_connect(self):
        for ip in ["127.0.0.1", "10.1.2.3", "169.254.169.254", "192.168.1.1", "::1", "fc00::1", "fe80::1", "::ffff:127.0.0.1", "0.0.0.0"]:
            with self.subTest(ip=ip), patch.object(socket, "getaddrinfo", return_value=answers(ip)), patch.object(public_http, "PublicHTTPSConnection") as conn:
                with self.assertRaises(ValueError):
                    public_http.fetch_public("https://publisher.example/image")
                conn.assert_not_called()
        for host in ["2130706433", "0177.0.0.1", "0x7f000001"]:
            with self.subTest(host=host), patch.object(socket, "getaddrinfo", return_value=answers("127.0.0.1")):
                with self.assertRaises(ValueError):
                    public_http.public_destination("https://" + host)

    def test_mixed_dns_and_unsafe_url_forms(self):
        with patch.object(socket, "getaddrinfo", return_value=answers("8.8.8.8", "127.0.0.1")):
            with self.assertRaises(ValueError):
                public_http.public_destination("https://publisher.example")
        for url in ["http://example.com", "file:///etc/hosts", "https://user:pass@example.com", "https://example.com:8443", "https://example.com\\@127.0.0.1", "https://example.com/\n"]:
            with self.subTest(url=url), patch.object(socket, "getaddrinfo") as dns:
                with self.assertRaises(ValueError):
                    public_http.public_destination(url)
                dns.assert_not_called()

    def test_every_redirect_is_checked_before_connecting(self):
        with patch.object(socket, "getaddrinfo", side_effect=[answers("8.8.8.8"), answers("127.0.0.1")]), patch.object(public_http, "PublicHTTPSConnection") as factory:
            factory.return_value.getresponse.return_value = response(302, location="https://internal.example/private")
            with self.assertRaises(ValueError):
                public_http.fetch_public("https://publisher.example")
            self.assertEqual(factory.call_count, 1)

    def test_public_relative_redirect_and_body_control(self):
        with patch.object(socket, "getaddrinfo", return_value=answers("8.8.8.8")), patch.object(public_http, "PublicHTTPSConnection") as factory:
            factory.return_value.getresponse.side_effect = [response(302, location="/figure.jpg"), response()]
            self.assertEqual(public_http.fetch_public("https://publisher.example/paper"), b"image")
            self.assertEqual(factory.call_args.args[:2], ("publisher.example", "8.8.8.8"))
            self.assertEqual(factory.return_value.request.call_args.args[:2], ("GET", "/figure.jpg"))
            self.assertGreaterEqual(factory.return_value.abort.call_count, 2)

    def test_redirect_and_response_limits(self):
        with patch.object(socket, "getaddrinfo", return_value=answers("8.8.8.8")), patch.object(public_http, "PublicHTTPSConnection") as factory:
            factory.return_value.getresponse.return_value = response(302, location="/loop")
            with self.assertRaisesRegex(ValueError, "redirect limit"):
                public_http.fetch_public("https://publisher.example")
            for reply in [response(body=b"12345"), response(length="5000")]:
                factory.return_value.getresponse.return_value = reply
                with self.assertRaisesRegex(ValueError, "size limit"):
                    public_http.fetch_public("https://publisher.example", max_bytes=4)

    def test_connection_is_pinned_but_tls_uses_original_hostname(self):
        with patch.object(socket, "create_connection") as connect, patch.object(public_http.ssl, "create_default_context") as context:
            client = public_http.PublicHTTPSConnection("publisher.example", "8.8.8.8", 5)
            client.connect()
            connect.assert_called_once_with(("8.8.8.8", 443), 5)
            context.return_value.wrap_socket.assert_called_once_with(connect.return_value, server_hostname="publisher.example", do_handshake_on_connect=False)
            context.return_value.wrap_socket.return_value.do_handshake.assert_called_once()

    def test_failing_public_ipv6_falls_back_to_vetted_ipv4(self):
        first, second = MagicMock(), MagicMock()
        first.request.side_effect = OSError("Network unreachable")
        second.getresponse.return_value = response()
        with patch.object(socket, "getaddrinfo", return_value=answers("2001:4860:4860::8888", "8.8.8.8")), patch.object(public_http, "PublicHTTPSConnection", side_effect=[first, second]) as factory:
            self.assertEqual(public_http.fetch_public("https://publisher.example"), b"image")
            self.assertEqual([call.args[1] for call in factory.call_args_list], ["2001:4860:4860::8888", "8.8.8.8"])

    def test_slow_dns_cannot_outlive_the_fetch_deadline(self):
        release = threading.Event()
        def delayed_dns(*_args, **_kwargs):
            release.wait(1)
            return answers("8.8.8.8")
        with patch.object(socket, "getaddrinfo", side_effect=delayed_dns), patch.object(public_http, "PublicHTTPSConnection") as connection:
            try:
                started = time.monotonic()
                with self.assertRaises(TimeoutError):
                    public_http.fetch_public("https://publisher.example", timeout=0.05)
                self.assertLess(time.monotonic() - started, 0.5)
                connection.assert_not_called()
            finally:
                release.set()

    def test_slow_drip_body_is_stopped_by_total_deadline(self):
        class SlowHandler(BaseHTTPRequestHandler):
            def log_message(self, *_args):
                pass
            def do_GET(self):
                self.send_response(200)
                self.send_header("Content-Length", "5")
                self.end_headers()
                try:
                    for byte in b"image":
                        time.sleep(0.07)
                        self.wfile.write(bytes([byte]))
                        self.wfile.flush()
                except OSError:
                    pass
        server = ThreadingHTTPServer(("127.0.0.1", 0), SlowHandler)
        thread = threading.Thread(target=lambda: server.serve_forever(poll_interval=0.01), daemon=True)
        thread.start()
        class TestConnection(public_http.PublicHTTPSConnection):
            def connect(self):
                self.sock = socket.socket()
                self.sock.settimeout(self.timeout)
                self.sock.connect(server.server_address)
                self.transport = self.sock
        try:
            with patch.object(socket, "getaddrinfo", return_value=answers("8.8.8.8")), patch.object(public_http, "PublicHTTPSConnection", TestConnection):
                started = time.monotonic()
                with self.assertRaises(TimeoutError):
                    public_http.fetch_public("https://publisher.example", timeout=0.15)
                self.assertLess(time.monotonic() - started, 0.3)
        finally:
            server.shutdown()
            server.server_close()
            thread.join()

    def test_importer_uses_shared_boundary_and_link_selection_is_offline(self):
        with patch.object(importer, "fetch_public", return_value=b"figure") as fetch:
            self.assertEqual(importer.curl_fetch("https://example.com/figure", 5, 1), b"figure")
            fetch.assert_called_once_with("https://example.com/figure", 5, user_agent=importer.USER_AGENT)
        with patch.object(importer, "fetch_public", side_effect=ValueError("private address")):
            with self.assertRaises(RuntimeError):
                importer.curl_fetch("https://example.com/figure", 5, 1)
            self.assertEqual(importer.choose_article_url({"doi": "10.1234/paper"}, {}, 5, 1), "https://doi.org/10.1234/paper")


class ImageMetadataTests(unittest.TestCase):
    RIGHTS = b'<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:rights>Artist, CC BY 4.0</dc:rights></rdf:Description></rdf:RDF></x:xmpmeta>'

    def issues(self, data):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "image"
            path.write_bytes(data)
            return metadata_issues(path)

    def test_rights_are_preserved_but_edit_history_is_rejected(self):
        self.assertTrue(rights_only_xmp(self.RIGHTS))
        self.assertFalse(rights_only_xmp(self.RIGHTS.replace(b"dc:rights", b"dc:description")))
        self.assertFalse(rights_only_xmp(b"not XML"))

    def test_jpeg_exif_and_comment_detection(self):
        def jpeg(marker, payload):
            return b"\xff\xd8\xff" + bytes([marker]) + struct.pack(">H", len(payload) + 2) + payload + b"\xff\xd9"
        self.assertTrue(self.issues(jpeg(0xE1, b"Exif\x00\x00private")))
        self.assertTrue(self.issues(jpeg(0xFE, b"comment")))
        self.assertEqual(self.issues(jpeg(0xE2, b"ICC_PROFILE\x00color")), [])
        self.assertEqual(self.issues(jpeg(0xE1, b"http://ns.adobe.com/xap/1.0/\x00" + self.RIGHTS)), [])

    def test_png_and_webp_metadata_detection(self):
        def png(kind, payload):
            return b"\x89PNG\r\n\x1a\n" + struct.pack(">I", len(payload)) + kind + payload + b"\x00" * 4
        self.assertTrue(self.issues(png(b"eXIf", b"private")))
        self.assertTrue(self.issues(png(b"tEXt", b"Creation Time\x00private")))
        self.assertEqual(self.issues(png(b"iCCP", b"profile")), [])
        self.assertEqual(self.issues(png(b"iTXt", b"XML:com.adobe.xmp\x00\x00\x00\x00\x00" + self.RIGHTS)), [])
        body = b"WEBP" + b"EXIF" + struct.pack("<I", 6) + b"secret"
        self.assertTrue(self.issues(b"RIFF" + struct.pack("<I", len(body)) + body))


class WorkflowSecurityTests(unittest.TestCase):
    def test_tracked_actions_are_immutable_and_unprivileged_by_default(self):
        root = Path(__file__).resolve().parents[1]
        names = ["check-site", "check-leaderboard", "apply-scheduled-updates", "update-latest-publications", "refresh-video-stats"]
        for name in names:
            content = (root / ".github/workflows" / (name + ".yml")).read_text()
            with self.subTest(workflow=name):
                self.assertIn("permissions:\n  contents: read", content)
                self.assertNotIn("pull_request_target", content)
                for action in re.findall(r"uses:\s*([^\s#]+)", content):
                    self.assertRegex(action, r"^[\w.-]+/[\w./-]+@[0-9a-f]{40}$")
                if "contents: write" in content:
                    self.assertIn("github.ref == 'refs/heads/main'", content)


if __name__ == "__main__":
    unittest.main()
