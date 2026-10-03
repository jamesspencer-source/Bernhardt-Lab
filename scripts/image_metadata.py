"""Check public image containers for nonessential embedded metadata (stdlib only)."""

from pathlib import Path
import struct
import xml.etree.ElementTree as ET

XMP_PREFIX = b"http://ns.adobe.com/xap/1.0/\x00"
ALLOWED_XMP = {
    "{adobe:ns:meta/}xmpmeta",
    "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF",
    "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description",
    "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Alt",
    "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Bag",
    "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Seq",
    "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}li",
    "{http://purl.org/dc/elements/1.1/}rights",
    "{http://purl.org/dc/elements/1.1/}creator",
    "{http://creativecommons.org/ns#}license",
    "{http://ns.adobe.com/xap/1.0/rights/}UsageTerms",
    "{http://ns.adobe.com/xap/1.0/rights/}WebStatement",
    "{http://ns.adobe.com/xap/1.0/rights/}Marked",
}
ALLOWED_XMP_ATTRIBUTES = {
    "{adobe:ns:meta/}xmptk", "{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about",
    "{http://www.w3.org/XML/1998/namespace}lang",
} | ALLOWED_XMP


def rights_only_xmp(payload: bytes) -> bool:
    try:
        root = ET.fromstring(payload)
        return all(node.tag in ALLOWED_XMP and set(node.attrib) <= ALLOWED_XMP_ATTRIBUTES for node in root.iter())
    except ET.ParseError:
        return False


def metadata_issues(path: Path) -> list[str]:
    data = path.read_bytes()
    issues = []
    if data.startswith(b"\xff\xd8"):
        offset = 2
        while offset + 4 <= len(data):
            if data[offset] != 255:
                raise ValueError(f"Invalid JPEG header: {path}")
            marker = data[offset + 1]
            if marker in (0xDA, 0xD9):
                break
            length = int.from_bytes(data[offset + 2:offset + 4], "big")
            if length < 2 or offset + length + 2 > len(data):
                raise ValueError(f"Invalid JPEG segment: {path}")
            payload = data[offset + 4:offset + length + 2]
            if marker == 0xE1:
                if not payload.startswith(XMP_PREFIX) or not rights_only_xmp(payload[len(XMP_PREFIX):]):
                    issues.append("EXIF or non-attribution XMP")
            elif marker in (0xED, 0xFE):
                issues.append("Photoshop/IPTC or comment")
            offset += length + 2
    elif data.startswith(b"\x89PNG\r\n\x1a\n"):
        offset = 8
        while offset + 12 <= len(data):
            length = int.from_bytes(data[offset:offset + 4], "big")
            kind = data[offset + 4:offset + 8]
            payload = data[offset + 8:offset + 8 + length]
            if offset + length + 12 > len(data):
                raise ValueError(f"Invalid PNG chunk: {path}")
            if kind in (b"eXIf", b"tEXt", b"zTXt", b"tIME"):
                issues.append(kind.decode("ascii"))
            elif kind == b"iTXt":
                parts = payload.split(b"\0", 5)
                if len(parts) != 6 or parts[0] != b"XML:com.adobe.xmp" or parts[1:5] != [b"", b"", b"", b""] or not rights_only_xmp(parts[5]):
                    issues.append("non-attribution PNG text")
            offset += length + 12
    elif data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        offset = 12
        while offset + 8 <= len(data):
            kind, length = struct.unpack_from("<4sI", data, offset)
            payload = data[offset + 8:offset + 8 + length]
            if kind == b"EXIF" or (kind == b"XMP " and not rights_only_xmp(payload)):
                issues.append("EXIF or non-attribution XMP")
            offset += 8 + length + length % 2
    return sorted(set(issues))


def validate_images(root: Path) -> None:
    errors = []
    for path in sorted(root.rglob("*")):
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            issues = metadata_issues(path)
            if issues:
                errors.append(f"{path}: {', '.join(issues)}")
    if errors:
        raise RuntimeError("Public image metadata must be sanitized:\n" + "\n".join(errors))
