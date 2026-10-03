"""Bounded public HTTPS fetches for optional media importers; no proxy inheritance."""

from __future__ import annotations

import http.client
import ipaddress
import math
import socket
import ssl
import threading
import time
from concurrent.futures import Future, TimeoutError as FutureTimeout
from urllib.parse import urljoin, urlsplit

MAX_BYTES = 32 * 1024 * 1024
MAX_REDIRECTS = 5


def public_destination(url: str) -> tuple[str, str, list[str]]:
    if not isinstance(url, str) or any(ord(char) <= 32 or ord(char) == 127 for char in url):
        raise ValueError("Invalid public URL")
    parsed = urlsplit(url)
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username is not None
            or parsed.password is not None or parsed.port not in (None, 443) or "\\" in url):
        raise ValueError("Only credential-free public HTTPS on port 443 is allowed")
    host = parsed.hostname.encode("idna").decode("ascii")
    answers = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    addresses = list(dict.fromkeys(answer[4][0] for answer in answers))
    def allowed(address: str) -> bool:
        ip = ipaddress.ip_address(address)
        return ip.is_global and not (ip.version == 6 and (ip.ipv4_mapped or ip.sixtofour or ip.teredo))
    if not addresses or not all(allowed(address) for address in addresses):
        raise ValueError("Non-public network destination rejected")
    path = parsed.path or "/"
    if parsed.query:
        path += "?" + parsed.query
    return host, path, addresses


class PublicHTTPSConnection(http.client.HTTPSConnection):
    def __init__(self, host: str, address: str, timeout: float):
        super().__init__(host, timeout=timeout, context=ssl.create_default_context())
        self.address = address
        self.transport = None

    def connect(self) -> None:
        # Connect to the vetted numeric address, not a second DNS lookup.
        sock = socket.create_connection((self.address, 443), self.timeout)
        self.transport = sock
        try:
            self.sock = self._context.wrap_socket(sock, server_hostname=self.host, do_handshake_on_connect=False)
            self.transport = self.sock
            self.sock.do_handshake()
        except Exception:
            self.abort()
            raise

    def abort(self) -> None:
        if self.transport is not None:
            try:
                self.transport.shutdown(socket.SHUT_RDWR)
            except OSError:
                pass
            self.transport.close()
        self.close()


def fetch_public(url: str, timeout: float = 30, *, user_agent: str = "BernhardtLab",
                 max_bytes: int = MAX_BYTES) -> bytes:
    if not math.isfinite(timeout) or timeout <= 0:
        raise ValueError("Fetch timeout must be finite and positive")
    deadline = time.monotonic() + timeout
    stopped = threading.Event()
    lock = threading.Lock()
    connections = []

    def remaining():
        seconds = deadline - time.monotonic()
        if stopped.is_set() or seconds <= 0:
            raise TimeoutError("Public fetch exceeded total timeout")
        return seconds

    def perform():
        current_url = url
        for hop in range(MAX_REDIRECTS + 1):
            remaining()
            host, path, addresses = public_destination(current_url)
            for index, address in enumerate(addresses):
                # Reserve time for other vetted addresses if an IPv6/IPv4 route fails.
                connection = PublicHTTPSConnection(host, address, remaining() / (len(addresses) - index))
                with lock:
                    remaining()
                    connections.append(connection)
                response = None
                try:
                    connection.request("GET", path, headers={"User-Agent": user_agent, "Accept-Encoding": "identity"})
                    response = connection.getresponse()
                    remaining()
                    if response.status in (301, 302, 303, 307, 308):
                        location = response.getheader("Location")
                        if not location or hop == MAX_REDIRECTS:
                            raise ValueError("Missing redirect destination or redirect limit exceeded")
                        current_url = urljoin(current_url, location)
                        break
                    if not 200 <= response.status < 300:
                        raise ValueError(f"Public fetch returned HTTP {response.status}")
                    length = response.getheader("Content-Length")
                    if length is not None and (not length.isdigit() or int(length) > max_bytes):
                        raise ValueError("Public response exceeds size limit")
                    body = response.read(max_bytes + 1)
                    remaining()
                    if len(body) > max_bytes:
                        raise ValueError("Public response exceeds size limit")
                    return body
                except (OSError, http.client.HTTPException):
                    remaining()
                    if index == len(addresses) - 1:
                        raise
                finally:
                    if response is not None:
                        response.close()
                    connection.abort()
        raise ValueError("Redirect limit exceeded")

    # Bound DNS and slow-drip headers/bodies too, not just socket inactivity.
    result = Future()
    def run():
        try:
            result.set_result(perform())
        except Exception as error:
            result.set_exception(error)
    threading.Thread(target=run, daemon=True).start()
    try:
        return result.result(timeout=remaining())
    except FutureTimeout as error:
        raise TimeoutError("Public fetch exceeded total timeout") from error
    finally:
        stopped.set()
        with lock:
            for connection in connections:
                connection.abort()
