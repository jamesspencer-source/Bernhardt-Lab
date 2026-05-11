#!/usr/bin/env python3

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "game" / "envelope-escape"
WORLD_W = 3200
WORLD_H = 1800

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


def rounded_rect(canvas, x, y, w, h, r, color):
    rect(canvas, x + r, y, w - 2 * r, h, color)
    rect(canvas, x, y + r, w, h - 2 * r, color)
    circle(canvas, x + r, y + r, r, color)
    circle(canvas, x + w - r, y + r, r, color)
    circle(canvas, x + r, y + h - r, r, color)
    circle(canvas, x + w - r, y + h - r, r, color)


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
        "repair": (144, 233, 255),
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
            elif slug == "restraint":
                rect(sheet, cx - 12, cy - 9, 24, 18, rgba(base, 235))
                line(sheet, cx - 7, cy, cx + 7, cy, 2, rgba(darken(base, 0.45), 240))
                line(sheet, cx, cy - 6, cx, cy + 6, 2, rgba(darken(base, 0.45), 240))
            else:
                ellipse(sheet, cx, cy + 1, 10, 15, rgba(base, 230), 0.15)
                circle(sheet, cx - 3, cy - 9, 5, rgba(lighten(base, 0.42), 230))
                line(sheet, cx - 7, cy + 8, cx + 8, cy - 6, 2, rgba((255, 255, 255), 160))
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

    for slug, color in [("patch", (184, 255, 223)), ("repair", (144, 233, 255)), ("purge", (187, 236, 255)), ("boost", (255, 225, 163))]:
        sheet = Canvas(64 * 4, 64)
        for frame in range(4):
            ox = frame * 64
            circle(sheet, ox + 32, 32, 22, rgba(color, 70 + frame * 16))
            if slug == "patch":
                rect(sheet, ox + 20, 28, 24, 8, rgba(color, 235))
                line(sheet, ox + 24, 22, ox + 40, 42, 3, rgba(lighten(color, 0.3), 230))
            elif slug == "repair":
                ellipse(sheet, ox + 32, 34, 11, 17, rgba(color, 235), 0.1)
                circle(sheet, ox + 28, 22, 5, rgba(lighten(color, 0.35), 230))
                line(sheet, ox + 22, 42, ox + 44, 24, 3, rgba((255, 255, 255), 170))
            elif slug == "purge":
                for i in range(6):
                    a = i * math.tau / 6 + frame * 0.22
                    line(sheet, ox + 32, 32, ox + 32 + math.cos(a) * 23, 32 + math.sin(a) * 23, 3, rgba(color, 220))
            else:
                line(sheet, ox + 18, 40, ox + 46, 24, 5, rgba(color, 230))
                line(sheet, ox + 34, 18, ox + 48, 24, 4, rgba(lighten(color, 0.28), 230))
        sheet.save(OUT / "ui" / f"response-{slug}.png")


def generate_background():
    canvas = Canvas(WORLD_W, WORLD_H, (6, 17, 28, 255))
    for y in range(WORLD_H):
        for x in range(WORLD_W):
            glow = int(34 * math.exp(-((x - 2460) ** 2 + (y - 280) ** 2) / 820000))
            warm = int(18 * math.exp(-((x - 760) ** 2 + (y - 1360) ** 2) / 980000))
            i = (y * WORLD_W + x) * 4
            canvas.data[i] = min(255, canvas.data[i] + glow // 5 + warm)
            canvas.data[i + 1] = min(255, canvas.data[i + 1] + glow + warm // 2)
            canvas.data[i + 2] = min(255, canvas.data[i + 2] + glow + 10)

    # Benchtop grain and playable zone seams.
    for y in range(0, WORLD_H, 58):
        line(canvas, 0, y, WORLD_W, y + math.sin(y * 0.03) * 18, 1, rgba((73, 132, 143), 18))
    for x in range(80, WORLD_W, 160):
        line(canvas, x, 40, x + math.sin(x) * 42, WORLD_H - 60, 1, rgba((106, 203, 218), 18))

    # Microscope slide safe zone.
    rounded_rect(canvas, 170, 1035, 710, 560, 46, rgba((46, 78, 94), 190))
    rounded_rect(canvas, 230, 1110, 590, 410, 36, rgba((154, 233, 238), 54))
    line(canvas, 255, 1180, 795, 1180, 3, rgba((214, 255, 255), 86))
    line(canvas, 255, 1460, 795, 1460, 3, rgba((214, 255, 255), 76))
    circle(canvas, 520, 1325, 118, rgba((125, 238, 224), 38))
    circle(canvas, 520, 1325, 62, rgba((125, 238, 224), 44))

    # Research Plus-style pipette zone.
    line(canvas, 230, 360, 1200, 260, 38, rgba((238, 244, 242), 232))
    line(canvas, 245, 348, 1188, 250, 12, rgba((255, 255, 255), 180))
    rounded_rect(canvas, 280, 270, 210, 118, 30, rgba((238, 244, 242), 238))
    rounded_rect(canvas, 305, 302, 80, 36, 10, rgba((30, 62, 78), 220))
    rect(canvas, 397, 294, 58, 55, rgba((80, 177, 220), 230))
    line(canvas, 200, 360, 86, 372, 22, rgba((86, 173, 218), 235))
    line(canvas, 1202, 258, 1460, 230, 12, rgba((174, 232, 245), 150))
    line(canvas, 1420, 232, 1570, 214, 6, rgba((214, 250, 255), 118))
    for x in [550, 725, 900, 1075]:
        ellipse(canvas, x, 535, 30, 48, rgba((112, 220, 245), 80), 0.05)
        line(canvas, x - 18, 590, x + 18, 590, 5, rgba((188, 247, 255), 95))

    # Petri dish with agar, plaques, and antibiotic disks.
    circle(canvas, 1755, 470, 325, rgba((201, 231, 225), 64))
    circle(canvas, 1755, 470, 284, rgba((222, 171, 94), 112))
    circle(canvas, 1755, 470, 323, rgba((240, 255, 255), 26))
    for i, (dx, dy, r) in enumerate([(-120, -45, 48), (84, -92, 38), (72, 84, 62), (-16, 12, 30), (160, 46, 26)]):
        circle(canvas, 1755 + dx, 470 + dy, r, rgba((121, 65, 92), 82 + i * 12))
        circle(canvas, 1755 + dx, 470 + dy, max(8, r // 3), rgba((255, 214, 161), 100))
    for i in range(16):
        a = i * math.tau / 16
        line(canvas, 1755 + math.cos(a) * 286, 470 + math.sin(a) * 286, 1755 + math.cos(a) * 305, 470 + math.sin(a) * 305, 2, rgba((242, 255, 255), 82))

    # Fernbach flask.
    ellipse(canvas, 2600, 560, 290, 250, rgba((197, 239, 239), 58), 0)
    ellipse(canvas, 2600, 625, 250, 145, rgba((58, 190, 144), 86), 0)
    rounded_rect(canvas, 2515, 230, 170, 315, 48, rgba((200, 243, 246), 54))
    line(canvas, 2460, 500, 2740, 500, 4, rgba((232, 255, 255), 90))
    line(canvas, 2390, 720, 2810, 720, 6, rgba((126, 235, 206), 90))
    for i in range(8):
        a = -0.9 + i * 0.28
        line(canvas, 2470 + math.cos(a) * 72, 628 + math.sin(a) * 54, 2710 + math.cos(a + 0.8) * 64, 626 + math.sin(a + 0.8) * 50, 3, rgba((142, 249, 220), 52))

    # Test-tube rack and tubes.
    rounded_rect(canvas, 1050, 1090, 790, 420, 34, rgba((42, 73, 90), 215))
    rounded_rect(canvas, 1110, 1138, 670, 310, 24, rgba((18, 39, 56), 190))
    tube_colors = [(111, 219, 244), (249, 211, 125), (150, 236, 198), (218, 154, 205)]
    for row in range(3):
        for col in range(6):
            cx = 1190 + col * 105
            cy = 1215 + row * 82
            color = tube_colors[(row + col) % len(tube_colors)]
            rounded_rect(canvas, cx - 28, cy - 42, 56, 92, 18, rgba((222, 246, 250), 66))
            rounded_rect(canvas, cx - 25, cy - 30, 50, 78, 14, rgba(color, 118))
            rect(canvas, cx - 26, cy - 42, 52, 14, rgba(lighten(color, 0.25), 206))
            line(canvas, cx - 20, cy + 16, cx + 20, cy + 16, 3, rgba((255, 255, 255), 92))

    # Centrifuge with rotor sweep arena.
    rounded_rect(canvas, 2060, 1030, 820, 525, 64, rgba((32, 47, 64), 235))
    rounded_rect(canvas, 2128, 1085, 270, 110, 24, rgba((9, 22, 36), 220))
    rect(canvas, 2184, 1123, 120, 28, rgba((87, 218, 226), 160))
    circle(canvas, 2490, 1288, 220, rgba((72, 86, 99), 220))
    circle(canvas, 2490, 1288, 104, rgba((19, 29, 42), 230))
    for i in range(6):
        a = i * math.tau / 6
        line(canvas, 2490, 1288, 2490 + math.cos(a) * 195, 1288 + math.sin(a) * 195, 23, rgba((164, 181, 194), 135))
        ellipse(canvas, 2490 + math.cos(a) * 164, 1288 + math.sin(a) * 164, 34, 18, rgba((110, 217, 244), 120), a)
    circle(canvas, 2490, 1288, 38, rgba((226, 241, 245), 170))
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
