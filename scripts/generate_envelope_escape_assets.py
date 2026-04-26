#!/usr/bin/env python3

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "game" / "envelope-escape"

SPECIES = {
    "ecoli": ("rod", (143, 244, 241), (17, 68, 86)),
    "paeruginosa": ("curved", (142, 244, 206), (18, 82, 67)),
    "saureus": ("coccus", (255, 214, 138), (92, 54, 22)),
    "spneumoniae": ("diplo", (255, 186, 210), (116, 49, 78)),
    "cglutamicum": ("coryne", (199, 214, 255), (42, 51, 109)),
    "kpneumoniae": ("capsule", (147, 234, 219), (20, 79, 82)),
    "abaumannii": ("coccobacillus", (146, 220, 255), (21, 67, 110)),
}


class Canvas:
    def __init__(self, width: int, height: int, color=(0, 0, 0, 0)) -> None:
        self.width = width
        self.height = height
        self.data = bytearray(color * width * height)

    def blend(self, x: int, y: int, color) -> None:
        if x < 0 or y < 0 or x >= self.width or y >= self.height:
            return
        r, g, b, a = color
        i = (y * self.width + x) * 4
        if a >= 255:
            self.data[i : i + 4] = bytes((r, g, b, a))
            return
        src_a = a / 255
        dst_a = self.data[i + 3] / 255
        out_a = src_a + dst_a * (1 - src_a)
        if out_a <= 0:
            return
        for c, src in enumerate((r, g, b)):
            dst = self.data[i + c]
            self.data[i + c] = int((src * src_a + dst * dst_a * (1 - src_a)) / out_a)
        self.data[i + 3] = int(out_a * 255)

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        raw = bytearray()
        stride = self.width * 4
        for y in range(self.height):
            raw.append(0)
            raw.extend(self.data[y * stride : (y + 1) * stride])
        png = bytearray(b"\x89PNG\r\n\x1a\n")
        png.extend(chunk(b"IHDR", struct.pack(">IIBBBBB", self.width, self.height, 8, 6, 0, 0, 0)))
        png.extend(chunk(b"IDAT", zlib.compress(bytes(raw), 9)))
        png.extend(chunk(b"IEND", b""))
        path.write_bytes(png)


def chunk(kind: bytes, payload: bytes) -> bytes:
    return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", zlib.crc32(kind + payload) & 0xFFFFFFFF)


def rgba(color, alpha=255):
    return (int(color[0]), int(color[1]), int(color[2]), int(alpha))


def lighten(color, amount):
    return tuple(min(255, int(c + (255 - c) * amount)) for c in color)


def darken(color, amount):
    return tuple(max(0, int(c * (1 - amount))) for c in color)


def ellipse(canvas, cx, cy, rx, ry, color, angle=0):
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    for y in range(int(cy - ry - 2), int(cy + ry + 3)):
        for x in range(int(cx - rx - 2), int(cx + rx + 3)):
            dx = x - cx
            dy = y - cy
            px = dx * cos_a + dy * sin_a
            py = -dx * sin_a + dy * cos_a
            value = (px * px) / (rx * rx) + (py * py) / (ry * ry)
            if value <= 1:
                canvas.blend(x, y, color)


def circle(canvas, cx, cy, radius, color):
    ellipse(canvas, cx, cy, radius, radius, color)


def line(canvas, x1, y1, x2, y2, width, color):
    min_x = int(min(x1, x2) - width - 2)
    max_x = int(max(x1, x2) + width + 2)
    min_y = int(min(y1, y2) - width - 2)
    max_y = int(max(y1, y2) + width + 2)
    length_sq = (x2 - x1) ** 2 + (y2 - y1) ** 2 or 1
    for y in range(min_y, max_y + 1):
        for x in range(min_x, max_x + 1):
            t = max(0, min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / length_sq))
            px = x1 + (x2 - x1) * t
            py = y1 + (y2 - y1) * t
            if math.hypot(x - px, y - py) <= width:
                canvas.blend(x, y, color)


def rect(canvas, x, y, w, h, color):
    for py in range(int(y), int(y + h)):
        for px in range(int(x), int(x + w)):
            canvas.blend(px, py, color)


def draw_cell_frame(sheet, frame, shape, base, core, state="idle"):
    ox = frame * 64
    wobble = math.sin(frame * 0.9) * 2
    cx, cy = ox + 32, 32
    alpha = 255 if state != "lysis" else max(80, 220 - frame * 18)
    body = rgba(base, alpha)
    outline = rgba(lighten(base, 0.45), alpha)
    capsule = rgba(lighten(base, 0.65), 80)
    if shape == "rod":
        ellipse(sheet, cx - 10, cy + wobble, 13, 17, body, 0)
        ellipse(sheet, cx + 10, cy - wobble, 13, 17, body, 0)
        rect(sheet, cx - 10, cy - 17 + wobble * 0.2, 20, 34, body)
    elif shape == "curved":
        ellipse(sheet, cx - 8, cy + 2, 12, 18, body, -0.35)
        ellipse(sheet, cx + 9, cy - 2, 12, 18, body, -0.35)
        line(sheet, cx - 11, cy + 8, cx + 13, cy - 8, 12, body)
    elif shape == "coccus":
        circle(sheet, cx, cy, 18 + wobble * 0.4, body)
    elif shape == "diplo":
        circle(sheet, cx - 10, cy, 15, body)
        circle(sheet, cx + 10, cy, 15, body)
        ellipse(sheet, cx - 10, cy, 22, 19, capsule)
        ellipse(sheet, cx + 10, cy, 22, 19, capsule)
    elif shape == "coryne":
        ellipse(sheet, cx - 8, cy - 3, 12, 20, body, -0.55)
        ellipse(sheet, cx + 9, cy + 5, 12, 18, body, -0.55)
        line(sheet, cx - 6, cy - 8, cx + 7, cy + 12, 3, outline)
    elif shape == "capsule":
        ellipse(sheet, cx, cy, 34, 22, capsule)
        ellipse(sheet, cx - 11, cy, 13, 16, body)
        ellipse(sheet, cx + 11, cy, 13, 16, body)
        rect(sheet, cx - 11, cy - 16, 22, 32, body)
    else:
        ellipse(sheet, cx, cy, 24, 17, body)
    line(sheet, cx - 22, cy - 16, cx + 22, cy - 16, 2, outline)
    line(sheet, cx - 22, cy + 16, cx + 22, cy + 16, 2, rgba(darken(base, 0.24), alpha))
    ellipse(sheet, cx, cy, 10, 6, rgba(core, alpha))
    line(sheet, cx - 7, cy, cx + 7, cy, 1, rgba(lighten(core, 0.45), alpha))
    if state == "hurt":
        line(sheet, cx - 15, cy - 13, cx - 2, cy + 1, 2, rgba((255, 238, 218), 235))
        line(sheet, cx + 6, cy - 10, cx + 14, cy + 13, 2, rgba((255, 238, 218), 235))
    if state == "lysis":
        for i in range(6):
            angle = i * math.pi / 3 + frame * 0.4
            line(sheet, cx, cy, cx + math.cos(angle) * (16 + frame * 3), cy + math.sin(angle) * (16 + frame * 3), 2, rgba(lighten(base, 0.35), 190))


def generate_cells():
    for slug, (shape, base, core) in SPECIES.items():
        sheet = Canvas(64 * 10, 64)
        for frame in range(4):
            draw_cell_frame(sheet, frame, shape, base, core, "idle")
        for frame in range(4, 6):
            draw_cell_frame(sheet, frame, shape, base, core, "hurt")
        for frame in range(6, 10):
            draw_cell_frame(sheet, frame, shape, base, core, "lysis")
        sheet.save(OUT / "cells" / f"{slug}.png")


def generate_phages():
    flight = Canvas(64 * 6, 64)
    for frame in range(6):
        ox = frame * 64
        cx, cy = ox + 32, 24 + math.sin(frame) * 2
        circle(flight, cx, cy, 12, rgba((154, 227, 249), 245))
        for i in range(6):
            a = i * math.pi / 3 + frame * 0.22
            line(flight, cx + math.cos(a) * 10, cy + math.sin(a) * 10, cx + math.cos(a) * 18, cy + math.sin(a) * 18, 1.5, rgba((218, 249, 255), 220))
        line(flight, cx, cy + 12, cx, cy + 32, 2, rgba((218, 249, 255), 220))
        line(flight, cx - 10, cy + 39, cx, cy + 31, 2, rgba((218, 249, 255), 220))
        line(flight, cx + 10, cy + 39, cx, cy + 31, 2, rgba((218, 249, 255), 220))
    flight.save(OUT / "phages" / "phage-flight.png")

    attach = Canvas(64 * 4, 64)
    for frame in range(4):
        ox = frame * 64
        cx, cy = ox + 32, 28
        circle(attach, cx, cy, 13 + frame, rgba((255, 222, 160), 235))
        line(attach, cx, cy + 12, cx, cy + 34, 2 + frame * 0.4, rgba((255, 245, 218), 220))
        circle(attach, cx, cy + 40, 6 + frame * 2, rgba((255, 150, 122), 120))
    attach.save(OUT / "phages" / "phage-attach.png")


def generate_pickups():
    colors = {
        "pg": (173, 255, 216),
        "lipid": (159, 231, 255),
        "restraint": (255, 220, 160),
    }
    for slug, base in colors.items():
        sheet = Canvas(48 * 4, 48)
        for frame in range(4):
            ox = frame * 48
            cx, cy = ox + 24, 24
            circle(sheet, cx, cy, 16, rgba(base, 95))
            if slug == "pg":
                for i in range(6):
                    a = i * math.pi / 3 + frame * 0.2
                    circle(sheet, cx + math.cos(a) * 11, cy + math.sin(a) * 11, 4, rgba(base, 235))
                circle(sheet, cx, cy, 7, rgba(darken(base, 0.35), 240))
            elif slug == "lipid":
                ellipse(sheet, cx, cy, 9, 15, rgba(base, 245), frame * 0.25)
                line(sheet, cx + 5, cy - 3, cx + 16, cy - 12, 2, rgba(lighten(base, 0.35), 230))
                line(sheet, cx + 5, cy + 3, cx + 17, cy + 7, 2, rgba(lighten(base, 0.35), 230))
            else:
                rect(sheet, cx - 12, cy - 9, 24, 18, rgba(base, 235))
                line(sheet, cx - 7, cy, cx + 7, cy, 2, rgba(darken(base, 0.45), 240))
                line(sheet, cx, cy - 6, cx, cy + 6, 2, rgba(darken(base, 0.45), 240))
        sheet.save(OUT / "pickups" / f"{slug}.png")


def generate_hazards():
    shock = Canvas(96 * 4, 96)
    for frame in range(4):
        ox = frame * 96
        for x in range(ox + 20 + frame * 4, ox + 76, 10):
            line(shock, x, 4, x - 20, 92, 4, rgba((119, 223, 255), 80 + frame * 25))
        rect(shock, ox + 42, 0, 12, 96, rgba((221, 255, 255), 110))
    shock.save(OUT / "hazards" / "beta-lactam-shock.png")

    crack = Canvas(128 * 4, 64)
    for frame in range(4):
        ox = frame * 128
        points = [(ox + 4, 34), (ox + 28, 25), (ox + 50, 38), (ox + 76, 20), (ox + 104, 35), (ox + 124, 24)]
        for a, b in zip(points, points[1:]):
            line(crack, a[0], a[1], b[0], b[1], 5 + frame, rgba((255, 183, 124), 170))
            line(crack, a[0], a[1], b[0], b[1], 1.5, rgba((255, 245, 225), 230))
    crack.save(OUT / "hazards" / "autolysin-crack.png")

    for slug, color in [("osmotic-rupture", (255, 198, 148)), ("lysis-storm", (255, 119, 146))]:
        sheet = Canvas(128 * 4, 128)
        for frame in range(4):
            ox = frame * 128
            radius = 34 + frame * 10
            circle(sheet, ox + 64, 64, radius, rgba(color, 35 + frame * 18))
            line(sheet, ox + 64 - radius, 64, ox + 64 + radius, 64, 2, rgba(lighten(color, 0.45), 130))
            line(sheet, ox + 64, 64 - radius, ox + 64, 64 + radius, 2, rgba(lighten(color, 0.45), 100))
        sheet.save(OUT / "hazards" / f"{slug}.png")


def generate_fx_and_ui():
    particle = Canvas(32 * 4, 32)
    for frame in range(4):
        ox = frame * 32
        circle(particle, ox + 16, 16, 5 + frame, rgba((184, 255, 224), 210 - frame * 28))
    particle.save(OUT / "fx" / "fluorescent-particle.png")

    flare = Canvas(128 * 6, 128)
    for frame in range(6):
        ox = frame * 128
        radius = 12 + frame * 15
        circle(flare, ox + 64, 64, radius, rgba((190, 255, 226), max(28, 140 - frame * 18)))
        for i in range(10):
            a = i * math.tau / 10
            line(flare, ox + 64, 64, ox + 64 + math.cos(a) * radius, 64 + math.sin(a) * radius, 2, rgba((232, 255, 248), 150))
    flare.save(OUT / "fx" / "response-flare.png")

    badges = Canvas(64 * 4, 64)
    for frame, color in enumerate([(184, 255, 223), (187, 236, 255), (255, 225, 163), (255, 140, 160)]):
        ox = frame * 64
        circle(badges, ox + 32, 32, 23, rgba(color, 210))
        circle(badges, ox + 32, 32, 12, rgba(darken(color, 0.42), 230))
    badges.save(OUT / "ui" / "run-badges.png")

    for slug, color in [("patch", (184, 255, 223)), ("purge", (187, 236, 255)), ("boost", (255, 225, 163))]:
        sheet = Canvas(64 * 4, 64)
        for frame in range(4):
            ox = frame * 64
            circle(sheet, ox + 32, 32, 22, rgba(color, 70 + frame * 16))
            if slug == "patch":
                rect(sheet, ox + 20, 28, 24, 8, rgba(color, 235))
                line(sheet, ox + 24, 22, ox + 40, 42, 3, rgba(lighten(color, 0.3), 230))
            elif slug == "purge":
                for i in range(6):
                    a = i * math.tau / 6 + frame * 0.22
                    line(sheet, ox + 32, 32, ox + 32 + math.cos(a) * 23, 32 + math.sin(a) * 23, 3, rgba(color, 220))
            else:
                line(sheet, ox + 18, 40, ox + 46, 24, 5, rgba(color, 230))
                line(sheet, ox + 34, 18, ox + 48, 24, 4, rgba(lighten(color, 0.28), 230))
        sheet.save(OUT / "ui" / f"response-{slug}.png")


def generate_background():
    canvas = Canvas(1600, 900, (5, 16, 27, 255))
    for y in range(900):
        for x in range(1600):
            glow = int(26 * math.exp(-((x - 1180) ** 2 + (y - 180) ** 2) / 260000))
            i = (y * 1600 + x) * 4
            canvas.data[i] = min(255, canvas.data[i] + glow // 4)
            canvas.data[i + 1] = min(255, canvas.data[i + 1] + glow)
            canvas.data[i + 2] = min(255, canvas.data[i + 2] + glow + 8)
    for y in [150, 460, 750]:
        for offset in range(-18, 19):
            alpha = max(0, 34 - abs(offset) * 2)
            line(canvas, -20, y + offset, 1620, y + math.sin(offset) * 8, 2, rgba((139, 238, 232), alpha))
    for x in range(80, 1600, 120):
        line(canvas, x, 80, x + math.sin(x) * 35, 820, 1, rgba((106, 203, 218), 28))
    canvas.save(OUT / "fx" / "chamber-background.png")


def write_audio_readme():
    audio_dir = OUT / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)
    (audio_dir / "README.md").write_text(
        "Envelope Escape V2 currently uses lightweight generated Web Audio tones. "
        "Future sound effects should be placed here as small web-safe files with license notes.\n",
        encoding="utf-8",
    )


def generate_preview_sheet():
    preview = Canvas(960, 540, (5, 16, 27, 255))
    for x in range(0, 960, 40):
        line(preview, x, 0, x + 60, 540, 1, rgba((90, 180, 195), 18))
    for index, (slug, (shape, base, core)) in enumerate(SPECIES.items()):
        slot_x = 58 + index * 122
        slot_y = 86
        sprite = Canvas(64, 64)
        draw_cell_frame(sprite, 0, shape, base, core, "idle")
        paste(preview, sprite, slot_x, slot_y)
        circle(preview, slot_x + 32, slot_y + 86, 14, rgba(base, 160))
        rect(preview, slot_x + 12, slot_y + 106, 40, 4, rgba(lighten(base, 0.35), 180))

    # Preview the main gameplay grammar: phage, pickups, and hazards.
    for offset, color in enumerate([(154, 227, 249), (173, 255, 216), (159, 231, 255), (255, 220, 160)]):
        cx = 170 + offset * 150
        cy = 285
        circle(preview, cx, cy, 28, rgba(color, 72))
        circle(preview, cx, cy, 13, rgba(color, 225))
        line(preview, cx - 22, cy + 34, cx + 22, cy + 34, 4, rgba(lighten(color, 0.35), 180))

    line(preview, 108, 410, 350, 390, 8, rgba((255, 183, 124), 160))
    line(preview, 108, 410, 350, 390, 2, rgba((255, 245, 225), 230))
    rect(preview, 432, 348, 34, 136, rgba((221, 255, 255), 105))
    for x in range(390, 520, 18):
        line(preview, x, 352, x - 36, 484, 3, rgba((119, 223, 255), 88))
    circle(preview, 650, 420, 58, rgba((255, 198, 148), 70))
    circle(preview, 810, 420, 72, rgba((255, 119, 146), 64))
    for i in range(10):
        a = i * math.tau / 10
        line(preview, 810, 420, 810 + math.cos(a) * 72, 420 + math.sin(a) * 72, 2, rgba((255, 190, 205), 120))
    preview.save(OUT / "previews" / "asset-preview.png")


def paste(target: Canvas, source: Canvas, dx: int, dy: int) -> None:
    for y in range(source.height):
        for x in range(source.width):
            i = (y * source.width + x) * 4
            target.blend(dx + x, dy + y, tuple(source.data[i : i + 4]))


def main():
    for folder in ["cells", "phages", "hazards", "pickups", "fx", "ui", "audio", "previews"]:
        (OUT / folder).mkdir(parents=True, exist_ok=True)
    generate_background()
    generate_cells()
    generate_phages()
    generate_pickups()
    generate_hazards()
    generate_fx_and_ui()
    write_audio_readme()
    generate_preview_sheet()
    print(f"Generated Envelope Escape assets in {OUT}")


if __name__ == "__main__":
    main()
