#!/usr/bin/env python3
"""
Refresh the "Research in Motion" manifest and images.

Strict rules:
- Bernhardt lab papers only (Bernhardt TG as last author).
- Bernhardt TG must be verifiably corresponding/co-corresponding from PMC JATS XML.
- Open-access manuscript required (PMCID).
- One paper = one tile (dedupe by DOI/PMID).
- Prefer visually compelling microscopy-style figures.
- Never include PubMed/bioRxiv/medRxiv links.
"""

from __future__ import annotations

import argparse
import io
import json
import re
import shutil
import subprocess
import sys
import tempfile
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import urlencode, urljoin

try:
    from PIL import Image, ImageOps, ImageStat  # type: ignore

    PIL_AVAILABLE = True
except Exception:  # pragma: no cover
    Image = ImageOps = ImageStat = None  # type: ignore
    PIL_AVAILABLE = False


ROOT = Path(__file__).resolve().parents[1]
ASSETS_IMAGE_DIR = ROOT / "assets" / "images" / "research-motion"
ASSETS_MANIFEST = ROOT / "assets" / "data" / "research-in-motion.json"
FLAT_DIR = ROOT / "github-flat"
FLAT_MANIFEST = FLAT_DIR / "research-in-motion.json"
OVERRIDES_PATH = ROOT / "scripts" / "research_motion_overrides.json"

USER_AGENT = (
    "BernhardtLabResearchInMotionBot/2.0 "
    "(https://github.com/jamesspencer-source/Bernhardt-Lab)"
)

BLOCKED_ARTICLE_HOST_MARKERS = (
    "pubmed.ncbi.nlm.nih.gov",
    "biorxiv.org",
    "medrxiv.org",
)

PREPRINT_JOURNAL_MARKERS = (
    "biorxiv",
    "medrxiv",
    "research square",
    "preprint",
)

META_IMAGE_KEYS = (
    "og:image",
    "og:image:url",
    "twitter:image",
    "twitter:image:src",
    "citation_graphical_abstract",
    "citation_figure",
)

IMAGE_URL_RE = re.compile(
    r"https?://[^\"'<>\s]+(?:\.png|\.jpe?g|\.gif|\.webp|\.tiff?)(?:\?[^\"'<>\s]*)?",
    re.IGNORECASE,
)
META_TAG_RE = re.compile(r"<meta\s+[^>]*>", re.IGNORECASE)
LINK_TAG_RE = re.compile(r"<link\s+[^>]*>", re.IGNORECASE)
ATTR_RE = re.compile(r"([:\w-]+)\s*=\s*([\"'])(.*?)\2", re.IGNORECASE)
YEAR_RE = re.compile(r"(19|20)\d{2}")

POSITIVE_KEYWORDS = {
    "microscopy": 5,
    "micrograph": 5,
    "fluorescence": 5,
    "fluorescent": 5,
    "live-cell": 4,
    "live cell": 4,
    "cryo": 4,
    "tomography": 4,
    "tomogram": 4,
    "envelope": 3,
    "sept": 3,
    "division": 3,
    "cell wall": 3,
    "membrane": 3,
    "localization": 2,
}

NEGATIVE_KEYWORDS = {
    "western": -8,
    "blot": -8,
    "gel": -7,
    "plot": -7,
    "graph": -7,
    "scatter": -6,
    "violin": -6,
    "line chart": -7,
    "bar chart": -7,
    "table": -8,
    "schematic": -6,
    "workflow": -6,
    "cartoon": -6,
    "phylogeny": -7,
    "screen": -4,
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Refresh Bernhardt Lab Research in Motion assets.")
    parser.add_argument("--target", type=int, default=12, help="Maximum number of paper tiles to publish.")
    parser.add_argument(
        "--retmax",
        type=int,
        default=320,
        help="How many PubMed records to scan for backfill.",
    )
    parser.add_argument("--years", type=int, default=5, help="Recency window in years (publication date).")
    parser.add_argument("--timeout", type=int, default=35, help="Per-request timeout (seconds).")
    parser.add_argument("--retries", type=int, default=3, help="Network retry attempts.")
    parser.add_argument("--verbose", action="store_true", help="Print progress details.")
    return parser.parse_args()


def log(message: str, verbose: bool = True) -> None:
    if verbose:
        print(message)


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def normalize_doi(value: str) -> str:
    return clean_text(value).strip().lower()


def has_blocked_article_host(url: str) -> bool:
    value = clean_text(url).lower()
    return any(marker in value for marker in BLOCKED_ARTICLE_HOST_MARKERS)


def curl_fetch(url: str, timeout: int, retries: int) -> bytes:
    last_error: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            cmd = [
                "curl",
                "-L",
                "--fail",
                "--silent",
                "--show-error",
                "--max-time",
                str(timeout),
                "--user-agent",
                USER_AGENT,
                url,
            ]
            return subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as error:
            last_error = RuntimeError(error.output.decode("utf-8", errors="ignore").strip() or str(error))
            if attempt < retries:
                time.sleep(1.2 * attempt)
    raise RuntimeError(f"Request failed for {url}: {last_error}") from last_error


def fetch_json(url: str, timeout: int, retries: int) -> Dict:
    return json.loads(curl_fetch(url, timeout, retries).decode("utf-8"))


def fetch_text(url: str, timeout: int, retries: int) -> str:
    return curl_fetch(url, timeout, retries).decode("utf-8", errors="ignore")


def resolve_effective_url(url: str, timeout: int, retries: int) -> str:
    candidate = clean_text(url)
    if not candidate:
        return ""

    last_error: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            cmd = [
                "curl",
                "-L",
                "--silent",
                "--show-error",
                "--max-time",
                str(timeout),
                "--output",
                "/dev/null",
                "--write-out",
                "%{url_effective}",
                "--user-agent",
                USER_AGENT,
                candidate,
            ]
            resolved = subprocess.check_output(cmd, stderr=subprocess.STDOUT).decode("utf-8", errors="ignore").strip()
            return resolved or candidate
        except subprocess.CalledProcessError as error:
            last_error = RuntimeError(error.output.decode("utf-8", errors="ignore").strip() or str(error))
            if attempt < retries:
                time.sleep(0.7 * attempt)

    if last_error:
        raise RuntimeError(f"Unable to resolve URL {candidate}: {last_error}") from last_error
    return candidate


def probe_http_status(url: str, timeout: int, retries: int) -> int:
    if not clean_text(url):
        return 0

    for _ in range(retries):
        try:
            cmd = [
                "curl",
                "-L",
                "--silent",
                "--show-error",
                "--max-time",
                str(timeout),
                "--output",
                "/dev/null",
                "--write-out",
                "%{http_code}",
                "--user-agent",
                USER_AGENT,
                url,
            ]
            code = subprocess.check_output(cmd, stderr=subprocess.STDOUT).decode("utf-8", errors="ignore").strip()
            if code.isdigit():
                return int(code)
        except subprocess.CalledProcessError:
            time.sleep(0.5)
    return 0


def parse_meta_attrs(tag: str) -> Dict[str, str]:
    attrs: Dict[str, str] = {}
    for key, _, value in ATTR_RE.findall(tag):
        attrs[key.lower()] = value.strip()
    return attrs


def extract_meta_image_candidates(html: str, base_url: str) -> List[str]:
    candidates: List[str] = []
    seen = set()

    for tag in META_TAG_RE.findall(html):
        attrs = parse_meta_attrs(tag)
        key = clean_text(attrs.get("property") or attrs.get("name")).lower()
        content = clean_text(attrs.get("content"))
        if key in META_IMAGE_KEYS and content:
            absolute = urljoin(base_url, content)
            if absolute not in seen:
                candidates.append(absolute)
                seen.add(absolute)

    for tag in LINK_TAG_RE.findall(html):
        attrs = parse_meta_attrs(tag)
        rel = clean_text(attrs.get("rel")).lower()
        href = clean_text(attrs.get("href"))
        if rel == "image_src" and href:
            absolute = urljoin(base_url, href)
            if absolute not in seen:
                candidates.append(absolute)
                seen.add(absolute)

    return candidates


def extract_pmc_blob_candidates(html: str) -> List[str]:
    candidates: List[str] = []
    seen = set()
    for match in IMAGE_URL_RE.findall(html):
        url = clean_text(match)
        lower = url.lower()
        if "cdn.ncbi.nlm.nih.gov/pmc/blobs/" not in lower:
            continue
        if any(token in lower for token in ("icon", "favicon", "share", "logo", "sprite")):
            continue
        if url not in seen:
            candidates.append(url)
            seen.add(url)
    return candidates


def strip_namespaces(root: ET.Element) -> ET.Element:
    for element in root.iter():
        if isinstance(element.tag, str) and "}" in element.tag:
            element.tag = element.tag.split("}", 1)[1]
        cleaned_attrs: Dict[str, str] = {}
        for key, value in element.attrib.items():
            clean_key = key.split("}", 1)[1] if "}" in key else key
            cleaned_attrs[clean_key] = value
        element.attrib.clear()
        element.attrib.update(cleaned_attrs)
    return root


def parse_year(article_node: ET.Element) -> str:
    explicit = clean_text(article_node.findtext("./ArticleDate/Year"))
    if explicit:
        return explicit
    explicit = clean_text(article_node.findtext("./Journal/JournalIssue/PubDate/Year"))
    if explicit:
        return explicit
    medline_date = clean_text(article_node.findtext("./Journal/JournalIssue/PubDate/MedlineDate"))
    match = YEAR_RE.search(medline_date)
    return match.group(0) if match else ""


def parse_articles(xml_payload: bytes) -> List[Dict]:
    root = ET.fromstring(xml_payload)
    records: List[Dict] = []

    for pubmed_article in root.findall(".//PubmedArticle"):
        article_node = pubmed_article.find("./MedlineCitation/Article")
        if article_node is None:
            continue

        pmid = clean_text(pubmed_article.findtext("./MedlineCitation/PMID"))
        if not pmid:
            continue

        journal = clean_text(
            article_node.findtext("./Journal/Title") or article_node.findtext("./Journal/ISOAbbreviation")
        )

        title_node = article_node.find("ArticleTitle")
        title = clean_text("".join(title_node.itertext())) if title_node is not None else ""

        authors = article_node.findall("./AuthorList/Author")
        author_list = []
        for author in authors:
            author_list.append(
                {
                    "last": clean_text(author.findtext("LastName")),
                    "fore": clean_text(author.findtext("ForeName")),
                    "initials": clean_text(author.findtext("Initials")),
                }
            )

        publication_types = [
            clean_text(node.text or "").lower()
            for node in article_node.findall("./PublicationTypeList/PublicationType")
            if clean_text(node.text or "")
        ]

        doi = ""
        pmcid = ""
        article_id_nodes = pubmed_article.findall("./PubmedData/ArticleIdList/ArticleId")
        for aid in article_id_nodes:
            id_type = clean_text(aid.get("IdType", "")).lower()
            value = clean_text(aid.text or "")
            if id_type == "doi" and value and not doi:
                doi = value
            if id_type == "pmc" and value and not pmcid:
                pmcid = value

        if not doi:
            for eloc in article_node.findall("ELocationID"):
                if clean_text(eloc.get("EIdType", "")).lower() == "doi":
                    doi = clean_text(eloc.text or "")
                    if doi:
                        break

        records.append(
            {
                "pmid": pmid,
                "title": title.rstrip("."),
                "journal": journal,
                "year": parse_year(article_node),
                "authors": author_list,
                "publicationTypes": publication_types,
                "doi": doi,
                "pmcid": pmcid,
            }
        )

    return records


def is_bernhardt_last_author(authors: List[Dict]) -> bool:
    if not authors:
        return False
    last = authors[-1]
    surname = clean_text(last.get("last", "")).lower()
    fore = clean_text(last.get("fore", "")).lower()
    initials = clean_text(last.get("initials", "")).upper()
    if surname != "bernhardt":
        return False
    return initials.startswith("TG") or "thomas" in fore


def is_preprint(article: Dict) -> bool:
    journal = clean_text(article.get("journal", "")).lower()
    doi = normalize_doi(article.get("doi", ""))
    pub_types = " ".join(article.get("publicationTypes", []))
    if any(marker in journal for marker in PREPRINT_JOURNAL_MARKERS):
        return True
    if "preprint" in pub_types:
        return True
    if doi.startswith("10.1101/"):
        return True
    return False


def build_pubmed_term(years: int) -> str:
    current_year = datetime.now(timezone.utc).year
    start_year = max(1990, current_year - max(1, years) + 1)
    return f'Bernhardt TG[Last Author] AND ("{start_year}/01/01"[Date - Publication] : "3000"[Date - Publication])'


def fetch_pubmed_candidates(term: str, retmax: int, timeout: int, retries: int, verbose: bool) -> List[Dict]:
    search_url = (
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?"
        + urlencode(
            {
                "db": "pubmed",
                "retmode": "json",
                "retmax": str(retmax),
                "sort": "pub+date",
                "term": term,
            }
        )
    )

    search_json = fetch_json(search_url, timeout=timeout, retries=retries)
    ids = [clean_text(i) for i in search_json.get("esearchresult", {}).get("idlist", []) if clean_text(i)]
    if not ids:
        return []

    records: List[Dict] = []
    batch_size = 100
    for i in range(0, len(ids), batch_size):
        batch_ids = ids[i : i + batch_size]
        efetch_url = (
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?"
            + urlencode({"db": "pubmed", "retmode": "xml", "id": ",".join(batch_ids)})
        )
        xml_payload = curl_fetch(efetch_url, timeout=timeout, retries=retries)
        records.extend(parse_articles(xml_payload))
        log(f"Fetched PubMed details for {min(i + batch_size, len(ids))}/{len(ids)} records", verbose)
        time.sleep(0.2)

    filtered: List[Dict] = []
    seen = set()
    for article in records:
        pmid = article["pmid"]
        if pmid in seen:
            continue
        seen.add(pmid)
        if is_preprint(article):
            continue
        if not is_bernhardt_last_author(article.get("authors", [])):
            continue
        if not clean_text(article.get("pmcid", "")):
            continue
        filtered.append(article)

    return filtered


def load_overrides(path: Path) -> Dict[str, Dict]:
    if not path.exists():
        return {"byPmid": {}, "byDoi": {}}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {"byPmid": {}, "byDoi": {}}

    by_pmid = payload.get("byPmid", {}) if isinstance(payload, dict) else {}
    by_doi = payload.get("byDoi", {}) if isinstance(payload, dict) else {}
    normalized_by_doi = {normalize_doi(k): v for k, v in by_doi.items()}
    return {"byPmid": dict(by_pmid), "byDoi": normalized_by_doi}


def resolve_override(article: Dict, overrides: Dict[str, Dict]) -> Dict:
    pmid = article.get("pmid", "")
    doi = normalize_doi(article.get("doi", ""))
    if pmid and pmid in overrides.get("byPmid", {}):
        return overrides["byPmid"][pmid] or {}
    if doi and doi in overrides.get("byDoi", {}):
        return overrides["byDoi"][doi] or {}
    return {}


def fetch_pmc_article_root(pmcid: str, timeout: int, retries: int) -> ET.Element:
    url = (
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?"
        + urlencode({"db": "pmc", "id": pmcid, "retmode": "xml"})
    )
    xml_payload = curl_fetch(url, timeout=timeout, retries=retries)
    root = ET.fromstring(xml_payload)
    strip_namespaces(root)

    article = root.find(".//article")
    if article is None:
        if root.tag == "article":
            article = root
        else:
            raise RuntimeError(f"Unable to parse JATS article for {pmcid}")
    return article


def is_bernhardt_name(surname: str, given_names: str, initials: str) -> bool:
    if clean_text(surname).lower() != "bernhardt":
        return False
    given = clean_text(given_names).lower()
    init = clean_text(initials).upper().replace(".", "")
    if "thomas" in given:
        return True
    if init.startswith("TG"):
        return True
    return bool(re.search(r"\bt\s*g\b", given.replace(".", " ")))


def verify_bernhardt_corresponding(article_root: ET.Element) -> Tuple[bool, str]:
    for contrib in article_root.findall(".//contrib"):
        if clean_text(contrib.get("contrib-type", "")).lower() not in ("", "author"):
            continue

        surname = clean_text(contrib.findtext("./name/surname"))
        given = clean_text(contrib.findtext("./name/given-names"))
        initials = clean_text((contrib.find("./name/given-names") or ET.Element("x")).get("initials", ""))
        if not is_bernhardt_name(surname, given, initials):
            continue

        corresp_attr = clean_text(contrib.get("corresp", "")).lower()
        if corresp_attr in {"yes", "y", "true", "1"}:
            return True, "pmc-jats-corresp-attr"

        for xref in contrib.findall("./xref"):
            ref_type = clean_text(xref.get("ref-type", "")).lower()
            rid = clean_text(xref.get("rid", ""))
            if ref_type == "corresp" and rid:
                return True, "pmc-jats-corresp-xref"

    for corresp in article_root.findall(".//author-notes/corresp"):
        text = clean_text(" ".join(corresp.itertext())).lower()
        if "bernhardt" in text:
            return True, "pmc-jats-corresp-note"

    return False, ""


def extract_figure_refs(article_root: ET.Element, limit: int = 16) -> List[Dict[str, str]]:
    refs: List[Dict[str, str]] = []
    seen = set()
    for fig in article_root.findall(".//fig"):
        fig_id = clean_text(fig.get("id", ""))
        if not fig_id or fig_id in seen:
            continue
        caption = clean_text(" ".join(fig.find("caption").itertext())) if fig.find("caption") is not None else ""
        label = clean_text(fig.findtext("label"))
        if label and label.lower() not in caption.lower():
            caption = clean_text(f"{label}. {caption}")
        refs.append({"id": fig_id, "caption": caption})
        seen.add(fig_id)
        if len(refs) >= limit:
            break
    return refs


def collect_image_candidates(
    pmcid: str,
    article_root: ET.Element,
    timeout: int,
    retries: int,
    verbose: bool,
) -> List[Dict[str, str]]:
    candidates: List[Dict[str, str]] = []
    seen = set()

    figure_refs = extract_figure_refs(article_root)
    for ref in figure_refs:
        fig_id = ref["id"]
        fig_page_url = f"https://pmc.ncbi.nlm.nih.gov/articles/{pmcid}/figure/{fig_id}/"
        try:
            html = fetch_text(fig_page_url, timeout=timeout, retries=retries)
        except Exception:
            continue

        urls = extract_pmc_blob_candidates(html) + extract_meta_image_candidates(html, fig_page_url)
        for url in urls[:3]:
            if url in seen:
                continue
            seen.add(url)
            candidates.append(
                {
                    "url": url,
                    "caption": ref["caption"],
                    "figureSource": f"pmc-fig:{fig_id}",
                }
            )

    article_url = f"https://pmc.ncbi.nlm.nih.gov/articles/{pmcid}/"
    try:
        article_html = fetch_text(article_url, timeout=timeout, retries=retries)
        urls = extract_pmc_blob_candidates(article_html) + extract_meta_image_candidates(article_html, article_url)
        for url in urls[:10]:
            if url in seen:
                continue
            seen.add(url)
            candidates.append({"url": url, "caption": "", "figureSource": "pmc-article"})
    except Exception as exc:
        log(f"Warning: unable to fetch article HTML for {pmcid}: {exc}", verbose)

    return candidates


def keyword_score(text: str) -> float:
    content = clean_text(text).lower()
    score = 0.0
    for token, weight in POSITIVE_KEYWORDS.items():
        if token in content:
            score += weight
    for token, weight in NEGATIVE_KEYWORDS.items():
        if token in content:
            score += weight
    return score


def read_sips_dimension(path: Path, key: str) -> int:
    try:
        output = subprocess.check_output(["sips", "-g", key, str(path)], stderr=subprocess.STDOUT).decode(
            "utf-8", errors="ignore"
        )
        match = re.search(rf"{key}:\\s*(\\d+)", output)
        if match:
            return int(match.group(1))
    except Exception:
        return 0
    return 0


def prepare_image_with_sips(data: bytes, max_width: int = 2200) -> Optional[Dict[str, object]]:
    # Local fallback when Pillow is unavailable (desktop sandbox).
    temp_dir = Path(tempfile.mkdtemp(prefix="rim-sips-"))
    src = temp_dir / "source.img"
    out = temp_dir / "out.jpg"

    try:
        src.write_bytes(data)
        subprocess.check_output(["sips", "-s", "format", "jpeg", str(src), "--out", str(out)], stderr=subprocess.STDOUT)
        width = read_sips_dimension(out, "pixelWidth")
        height = read_sips_dimension(out, "pixelHeight")
        if width <= 0 or height <= 0:
            width = read_sips_dimension(src, "pixelWidth")
            height = read_sips_dimension(src, "pixelHeight")
        if width < 560 or height < 360:
            return None

        if width > max_width:
            subprocess.check_output(
                ["sips", "--resampleWidth", str(max_width), str(out), "--out", str(out)], stderr=subprocess.STDOUT
            )
            width = read_sips_dimension(out, "pixelWidth")
            height = read_sips_dimension(out, "pixelHeight")

        output = out.read_bytes()
        return {
            "bytes": output,
            "width": width,
            "height": height,
            "contrast": 30.0,
            "entropy": 5.0,
            "colorfulness": 22.0,
        }
    except Exception:
        return None
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def prepare_image(data: bytes, max_width: int = 2200) -> Optional[Dict[str, object]]:
    if not PIL_AVAILABLE:
        return prepare_image_with_sips(data, max_width=max_width)

    try:
        image = Image.open(io.BytesIO(data))
    except Exception:
        return None

    with image:
        img = ImageOps.exif_transpose(image)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        if img.mode == "L":
            working = img.convert("RGB")
        else:
            working = img

        width, height = working.size
        if width < 560 or height < 360:
            return None

        sample = working.copy()
        sample.thumbnail((320, 320), Image.Resampling.BILINEAR)
        pixels = list(sample.getdata())
        total = max(1, len(pixels))

        rg_values = []
        yb_values = []
        for r, g, b in pixels:
            rg = float(r) - float(g)
            yb = (float(r) + float(g)) * 0.5 - float(b)
            rg_values.append(rg)
            yb_values.append(yb)

        mean_rg = sum(rg_values) / total
        mean_yb = sum(yb_values) / total
        var_rg = sum((v - mean_rg) ** 2 for v in rg_values) / total
        var_yb = sum((v - mean_yb) ** 2 for v in yb_values) / total

        colorfulness = (var_rg + var_yb) ** 0.5 + 0.3 * ((mean_rg**2 + mean_yb**2) ** 0.5)

        gray = sample.convert("L")
        gray_stats = ImageStat.Stat(gray)
        contrast = float(gray_stats.stddev[0]) if gray_stats.stddev else 0.0
        entropy = float(gray.entropy())

        output_image = working
        if output_image.width > max_width:
            scale = max_width / float(output_image.width)
            output_image = output_image.resize(
                (max_width, max(1, int(output_image.height * scale))),
                Image.Resampling.LANCZOS,
            )

        buffer = io.BytesIO()
        output_image.save(buffer, format="JPEG", quality=85, optimize=True, progressive=True)

        return {
            "bytes": buffer.getvalue(),
            "width": output_image.width,
            "height": output_image.height,
            "contrast": contrast,
            "entropy": entropy,
            "colorfulness": colorfulness,
        }


def score_candidate(candidate: Dict[str, str], title: str, prepared: Dict[str, object]) -> float:
    caption = clean_text(candidate.get("caption", ""))
    source = clean_text(candidate.get("figureSource", "")).lower()

    score = keyword_score(f"{title} {caption}") * 2.6

    width = float(prepared.get("width", 0))
    height = float(prepared.get("height", 1))
    contrast = float(prepared.get("contrast", 0))
    entropy = float(prepared.get("entropy", 0))
    colorfulness = float(prepared.get("colorfulness", 0))

    megapixels = (width * height) / 1_000_000
    score += min(megapixels * 6.0, 16.0)
    score += min(contrast / 8.0, 7.0)
    score += min(entropy, 8.0) * 0.65
    score += min(colorfulness / 18.0, 6.5)

    aspect = width / max(1.0, height)
    if aspect > 3.2 or aspect < 0.45:
        score -= 3.8

    if source.endswith(":f1") or source.endswith(":fig1"):
        score += 0.4

    return score


def make_caption(title: str, limit: int = 96) -> str:
    clean = clean_text(title).rstrip(".")
    if len(clean) <= limit:
        return clean
    clipped = clean[: limit - 1]
    if " " in clipped:
        clipped = clipped.rsplit(" ", 1)[0]
    return clipped + "…"


def choose_article_url(article: Dict, override: Dict, timeout: int, retries: int) -> str:
    override_url = clean_text(override.get("articleUrl", ""))
    candidates: List[str] = []
    if override_url:
        candidates.append(override_url)

    doi = clean_text(article.get("doi", ""))
    if doi and not normalize_doi(doi).startswith("10.1101/"):
        doi_url = f"https://doi.org/{doi}"
        try:
            resolved = resolve_effective_url(doi_url, timeout=timeout, retries=retries)
            if resolved:
                candidates.append(resolved)
        except Exception:
            candidates.append(doi_url)

    pmcid = clean_text(article.get("pmcid", ""))
    if pmcid:
        candidates.append(f"https://pmc.ncbi.nlm.nih.gov/articles/{pmcid}/")

    seen = set()
    for candidate in candidates:
        url = clean_text(candidate)
        if not url or url in seen:
            continue
        seen.add(url)
        if has_blocked_article_host(url):
            continue

        status = probe_http_status(url, timeout=timeout, retries=max(1, retries - 1))
        if status in {404, 410}:
            continue
        if status >= 500:
            continue

        return url

    return ""


def choose_image_from_override(
    override: Dict,
    timeout: int,
    retries: int,
) -> Optional[Dict[str, object]]:
    local_image = clean_text(override.get("localImage", ""))
    image_url = clean_text(override.get("imageUrl", ""))

    if local_image:
        path = (ROOT / local_image).resolve()
        if path.exists():
            prepared = prepare_image(path.read_bytes())
            if prepared:
                return {
                    "prepared": prepared,
                    "figureSource": clean_text(override.get("figureSource", "override-local")) or "override-local",
                    "caption": clean_text(override.get("figureCaption", "")),
                }

    if image_url:
        try:
            raw = curl_fetch(image_url, timeout=timeout, retries=retries)
            prepared = prepare_image(raw)
            if prepared:
                return {
                    "prepared": prepared,
                    "figureSource": clean_text(override.get("figureSource", "override-url")) or "override-url",
                    "caption": clean_text(override.get("figureCaption", "")),
                }
        except Exception:
            return None

    return None


def choose_representative_figure(
    article: Dict,
    override: Dict,
    pmcid: str,
    article_root: ET.Element,
    timeout: int,
    retries: int,
    verbose: bool,
) -> Optional[Dict[str, object]]:
    overridden = choose_image_from_override(override, timeout=timeout, retries=retries)
    if overridden:
        return overridden

    candidates = collect_image_candidates(pmcid, article_root, timeout=timeout, retries=retries, verbose=verbose)
    if not candidates:
        return None

    best: Optional[Dict[str, object]] = None
    seen_urls = set()

    for candidate in candidates[:24]:
        url = clean_text(candidate.get("url", ""))
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        try:
            raw = curl_fetch(url, timeout=timeout, retries=retries)
        except Exception:
            continue

        prepared = prepare_image(raw)
        if not prepared:
            continue

        quality_score = score_candidate(candidate, clean_text(article.get("title", "")), prepared)
        if best is None or quality_score > float(best["score"]):
            best = {
                "prepared": prepared,
                "figureSource": clean_text(candidate.get("figureSource", "pmc-auto")) or "pmc-auto",
                "caption": clean_text(candidate.get("caption", "")),
                "score": quality_score,
            }

    return best


def write_manifest(path: Path, payload: Dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def cleanup_old_images(directory: Path, keep_names: Iterable[str]) -> None:
    keep = set(keep_names)
    if not directory.exists():
        return
    for file in directory.glob("rim-*.jpg"):
        if file.name not in keep:
            file.unlink(missing_ok=True)


def build_items(
    candidates: List[Dict],
    overrides: Dict[str, Dict],
    target: int,
    timeout: int,
    retries: int,
    verbose: bool,
) -> Tuple[List[Dict], Path]:
    selected: List[Dict] = []
    seen_ids = set()
    temp_dir = Path(tempfile.mkdtemp(prefix="rim-refresh-"))

    for article in candidates:
        if len(selected) >= target:
            break

        pmid = clean_text(article.get("pmid", ""))
        doi = normalize_doi(article.get("doi", ""))
        dedupe_key = f"doi:{doi}" if doi else f"pmid:{pmid}"
        if not dedupe_key or dedupe_key in seen_ids:
            continue

        pmcid = clean_text(article.get("pmcid", ""))
        if not pmcid:
            continue

        try:
            article_root = fetch_pmc_article_root(pmcid, timeout=timeout, retries=retries)
        except Exception as exc:
            log(f"Skipping PMID {pmid}: failed to fetch PMCID XML ({exc})", verbose)
            continue

        corresponding_verified, corresponding_evidence = verify_bernhardt_corresponding(article_root)
        if not corresponding_verified:
            log(f"Skipping PMID {pmid}: Bernhardt corresponding/co-corresponding could not be verified", verbose)
            continue

        override = resolve_override(article, overrides)
        article_url = choose_article_url(article, override, timeout=timeout, retries=retries)
        if not article_url:
            log(f"Skipping PMID {pmid}: no valid OA manuscript URL", verbose)
            continue

        figure = choose_representative_figure(
            article=article,
            override=override,
            pmcid=pmcid,
            article_root=article_root,
            timeout=timeout,
            retries=retries,
            verbose=verbose,
        )
        if not figure:
            log(f"Skipping PMID {pmid}: no suitable representative figure found", verbose)
            continue

        prepared = figure.get("prepared")
        if not isinstance(prepared, dict):
            continue

        image_name = f"rim-{pmid}.jpg"
        temp_image = temp_dir / image_name
        jpeg_bytes = prepared.get("bytes")
        if not isinstance(jpeg_bytes, (bytes, bytearray)):
            continue
        temp_image.write_bytes(bytes(jpeg_bytes))

        if temp_image.stat().st_size < 10_000:
            temp_image.unlink(missing_ok=True)
            log(f"Skipping PMID {pmid}: representative image too small", verbose)
            continue

        title = clean_text(override.get("title") or article.get("title", "")).rstrip(".")
        caption = clean_text(override.get("caption") or figure.get("caption") or make_caption(title))
        journal = clean_text(article.get("journal", ""))
        year = clean_text(article.get("year", ""))

        selected.append(
            {
                "pmid": pmid,
                "doi": clean_text(article.get("doi", "")),
                "title": title,
                "journal": journal,
                "year": year,
                "articleUrl": article_url,
                "caption": caption,
                "imageName": image_name,
                "sourceLabel": clean_text(f"{journal} · {year}".strip(" ·")),
                "correspondingVerified": True,
                "correspondingEvidence": corresponding_evidence,
                "figureSource": clean_text(figure.get("figureSource", "pmc-auto")) or "pmc-auto",
            }
        )

        seen_ids.add(dedupe_key)
        log(f"Selected PMID {pmid}: {title[:96]}", verbose)

    return selected, temp_dir


def persist_outputs(selected: List[Dict], temp_dir: Path, underfilled_reason: str) -> None:
    ASSETS_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    FLAT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_MANIFEST.parent.mkdir(parents=True, exist_ok=True)

    keep_names = [item["imageName"] for item in selected]
    cleanup_old_images(ASSETS_IMAGE_DIR, keep_names)
    cleanup_old_images(FLAT_DIR, keep_names)

    assets_items = []
    flat_items = []
    for item in selected:
        image_name = item["imageName"]
        temp_file = temp_dir / image_name
        shutil.copy2(temp_file, ASSETS_IMAGE_DIR / image_name)
        shutil.copy2(temp_file, FLAT_DIR / image_name)

        common = {
            "pmid": item["pmid"],
            "doi": item["doi"],
            "title": item["title"],
            "journal": item["journal"],
            "year": item["year"],
            "articleUrl": item["articleUrl"],
            "sourceLabel": item["sourceLabel"],
            "caption": item["caption"],
            "correspondingVerified": item["correspondingVerified"],
            "correspondingEvidence": item["correspondingEvidence"],
            "figureSource": item["figureSource"],
        }
        assets_items.append({**common, "image": f"assets/images/research-motion/{image_name}"})
        flat_items.append({**common, "image": image_name})

    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    base_manifest = {
        "generatedAt": now,
        "source": "scripts/refresh_research_in_motion.py",
        "underfilledReason": underfilled_reason,
    }
    assets_manifest = {**base_manifest, "items": assets_items}
    flat_manifest = {**base_manifest, "items": flat_items}

    write_manifest(ASSETS_MANIFEST, assets_manifest)
    write_manifest(FLAT_MANIFEST, flat_manifest)


def main() -> int:
    args = parse_args()
    verbose = args.verbose
    log("Refreshing Research in Motion with strict Bernhardt-corresponding verification...", verbose)

    overrides = load_overrides(OVERRIDES_PATH)
    candidates = fetch_pubmed_candidates(
        term=build_pubmed_term(args.years),
        retmax=args.retmax,
        timeout=args.timeout,
        retries=args.retries,
        verbose=verbose,
    )
    if not candidates:
        raise RuntimeError("No candidate Bernhardt last-author OA papers found from PubMed.")

    selected, temp_dir = build_items(
        candidates=candidates,
        overrides=overrides,
        target=args.target,
        timeout=args.timeout,
        retries=args.retries,
        verbose=verbose,
    )

    if not selected:
        raise RuntimeError("No strictly verified Bernhardt corresponding-author papers were assembled.")

    underfilled_reason = ""
    if len(selected) < 9:
        underfilled_reason = "insufficient-verified-oa-papers-in-window"
        log(
            f"Warning: only {len(selected)} strictly verified tiles available in current refresh window.",
            verbose,
        )

    persist_outputs(selected, temp_dir, underfilled_reason=underfilled_reason)
    shutil.rmtree(temp_dir, ignore_errors=True)

    log(f"Done. Wrote {len(selected)} strictly verified Research in Motion entries.", verbose)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
