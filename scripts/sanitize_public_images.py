"""Losslessly remove private photo metadata, preserving color and attribution.

Requires Pillow for pixel verification and an explicit ExifTool executable.
Originals must be backed up outside this public repository.
"""

import argparse
import hashlib
import io
from pathlib import Path
import subprocess
import tempfile
import zipfile

from image_metadata import metadata_issues

ROOT = Path(__file__).resolve().parents[1]


def appearance(data):
    from PIL import Image
    with Image.open(io.BytesIO(data)) as image:
        if image.getexif().get(274, 1) != 1:
            raise RuntimeError("Normalize orientation before removing metadata")
        return (image.size, image.mode, hashlib.sha256(image.tobytes()).hexdigest(),
                tuple((key, image.info.get(key)) for key in ("icc_profile", "gamma", "srgb", "chromaticity")))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--exiftool", required=True, type=Path)
    parser.add_argument("--backup", required=True, type=Path)
    args = parser.parse_args()
    backup = args.backup.resolve()
    if backup == ROOT or ROOT in backup.parents or backup.exists():
        raise RuntimeError("Use a new backup ZIP path outside the public repository")
    paths = [path for path in sorted((ROOT / "assets").rglob("*"))
             if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"} and metadata_issues(path)]
    backup.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(backup, "x", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("PRIVATE-ARCHIVE.txt", "Private archive: original public-image metadata before security cleanup. Do not publish.\n")
        for path in paths:
            archive.write(path, path.relative_to(ROOT))
    changed = []
    with zipfile.ZipFile(backup) as archive:
        try:
            for path in paths:
                from PIL import Image
                original = path.read_bytes()
                expected = appearance(original)
                with Image.open(io.BytesIO(original)) as image:
                    suffix = image.format.lower()
                # Imported historical files can have the wrong extension. Preserve their URLs,
                # but give ExifTool the actual container type while processing a private copy.
                with tempfile.TemporaryDirectory() as directory:
                    staged = Path(directory) / ("image." + suffix)
                    staged.write_bytes(original)
                    result = subprocess.run([str(args.exiftool.resolve()), "-m", "-overwrite_original", "-all=", "-tagsFromFile", "@",
                        "-ICC_Profile", "-PNG:Gamma", "-PNG:SRGBRendering", "-PNG:Chromaticities",
                        "-XMP-dc:Rights", "-XMP-dc:Creator", "-XMP-cc:License",
                        "-XMP-xmpRights:UsageTerms", "-XMP-xmpRights:WebStatement", "-XMP-xmpRights:Marked", str(staged)],
                        capture_output=True, text=True)
                    if result.returncode:
                        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
                    if appearance(staged.read_bytes()) != expected or metadata_issues(staged):
                        raise RuntimeError(f"Image verification failed: {path}")
                    changed.append(path)
                    path.write_bytes(staged.read_bytes())
        except Exception:
            for path in changed:
                path.write_bytes(archive.read(str(path.relative_to(ROOT))))
            raise
    print(f"Sanitized and pixel/color-verified {len(paths)} images. Private originals: {backup}")


if __name__ == "__main__":
    main()
