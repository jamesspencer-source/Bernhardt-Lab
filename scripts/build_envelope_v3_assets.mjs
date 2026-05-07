import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(
      (buffer) => {
        this.result = buffer;
        this.onloadend?.({ target: this });
      },
      (error) => this.onerror?.(error)
    );
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then(
      (buffer) => {
        this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(buffer).toString("base64")}`;
        this.onloadend?.({ target: this });
      },
      (error) => this.onerror?.(error)
    );
  }
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const assetRoot = resolve(repoRoot, "assets/game/envelope-escape-v3");
const modelDir = resolve(assetRoot, "models");
mkdirSync(modelDir, { recursive: true });

const exporter = new GLTFExporter();

const materials = {
  pipetteWhite: standard(0xf7f3ea, { roughness: 0.36, metalness: 0.04 }),
  pipetteIvoryShadow: standard(0xd8d2c7, { roughness: 0.5, metalness: 0.04 }),
  pipetteBlue: standard(0x2a9fc4, { roughness: 0.28, metalness: 0.06, emissive: 0x06384a, emissiveIntensity: 0.1 }),
  pipetteDeepBlue: standard(0x187599, { roughness: 0.33, metalness: 0.08, emissive: 0x042a3c, emissiveIntensity: 0.12 }),
  darkDisplay: standard(0x111821, { roughness: 0.22, metalness: 0.1, emissive: 0x02070b, emissiveIntensity: 0.3 }),
  glass: physical(0xdffbff, { roughness: 0.08, transmission: 0.55, opacity: 0.34, thickness: 0.45 }),
  glassEdge: physical(0xbfefff, { roughness: 0.1, transmission: 0.38, opacity: 0.5, thickness: 0.34 }),
  agar: standard(0xf4c37c, { roughness: 0.62, emissive: 0x3f2108, emissiveIntensity: 0.12 }),
  agarDark: standard(0xc98644, { roughness: 0.7, emissive: 0x2a1305, emissiveIntensity: 0.08 }),
  plaque: basic(0x7e4f2a, 0.42),
  media: physical(0x65d5bd, { roughness: 0.28, transmission: 0.18, opacity: 0.58, emissive: 0x06453c, emissiveIntensity: 0.16 }),
  centrifugeShell: standard(0xdde3e8, { roughness: 0.42, metalness: 0.08 }),
  centrifugeShadow: standard(0xb8c3cc, { roughness: 0.58, metalness: 0.08 }),
  centrifugeBlue: standard(0x5b7fa9, { roughness: 0.38, metalness: 0.16, emissive: 0x0d2743, emissiveIntensity: 0.12 }),
  centrifugeTrim: standard(0x32445a, { roughness: 0.42, metalness: 0.1 }),
  rack: standard(0x20344a, { roughness: 0.58, metalness: 0.05, emissive: 0x071827, emissiveIntensity: 0.18 }),
  rackEdge: standard(0x38546f, { roughness: 0.44, metalness: 0.06, emissive: 0x08192a, emissiveIntensity: 0.12 }),
  warning: standard(0xf3ca5d, { roughness: 0.42, emissive: 0x573a04, emissiveIntensity: 0.16 }),
  rupture: standard(0xff8a8f, { roughness: 0.52, emissive: 0x5e1422, emissiveIntensity: 0.62 }),
  phage: standard(0xffd17f, { roughness: 0.42, emissive: 0x6d3c0c, emissiveIntensity: 0.44 }),
  cyanGlow: standard(0x9bf5ff, { roughness: 0.3, emissive: 0x1b6d78, emissiveIntensity: 0.5 })
};

const ASSETS = [
  {
    key: "lab-prop.research-plus-pipette",
    path: "models/research-plus-pipette.glb",
    fallback: "procedural-pipette",
    budget: 42000,
    byteBudget: 2100000,
    bounds: { width: 38, depth: 7, height: 6 },
    collision: [{ type: "box", x: -42, z: -29, width: 34, depth: 4.2 }],
    build: buildPipette
  },
  {
    key: "lab-prop.petri-dish-plaque-assay",
    path: "models/petri-dish-plaque-assay.glb",
    fallback: "procedural-petri-dish",
    budget: 36000,
    byteBudget: 1250000,
    bounds: { width: 28, depth: 28, height: 2.8 },
    collision: [],
    build: buildPetriDish
  },
  {
    key: "lab-prop.fernbach-flask",
    path: "models/fernbach-flask.glb",
    fallback: "procedural-fernbach-flask",
    budget: 42000,
    byteBudget: 700000,
    bounds: { width: 17, depth: 17, height: 12 },
    collision: [{ type: "circle", x: -7, z: 4, radius: 6.4 }],
    build: buildFernbachFlask
  },
  {
    key: "lab-prop.centrifuge-rotor",
    path: "models/centrifuge-rotor.glb",
    fallback: "procedural-centrifuge",
    budget: 48000,
    byteBudget: 3600000,
    bounds: { width: 27, depth: 27, height: 7 },
    collision: [{ type: "circle", x: 42, z: 8, radius: 4.2 }],
    build: buildCentrifuge
  },
  {
    key: "lab-prop.test-tube-rack",
    path: "models/test-tube-rack.glb",
    fallback: "procedural-tube-rack",
    budget: 52000,
    byteBudget: 2700000,
    bounds: { width: 29, depth: 14, height: 6 },
    collision: [
      { type: "box", x: 7, z: 20, width: 4, depth: 8 },
      { type: "box", x: 15, z: 26, width: 4, depth: 8 },
      { type: "box", x: 23, z: 32, width: 4, depth: 8 }
    ],
    build: buildTubeRack
  },
  {
    key: "lab-prop.microscope-slide",
    path: "models/microscope-slide.glb",
    fallback: "procedural-microscope-slide",
    budget: 12000,
    byteBudget: 550000,
    bounds: { width: 26, depth: 13, height: 0.5 },
    collision: [],
    build: buildMicroscopeSlide
  },
  {
    key: "lab-prop.tip-box",
    path: "models/tip-box.glb",
    fallback: "procedural-tip-box",
    budget: 22000,
    byteBudget: 1300000,
    bounds: { width: 11, depth: 8, height: 3 },
    collision: [{ type: "box", x: -22, z: -11, width: 10.5, depth: 7.5 }],
    build: buildTipBox
  },
  {
    key: "pickup.pipette-tip",
    path: "models/pipette-tip.glb",
    fallback: "procedural-pipette-tip",
    budget: 4000,
    byteBudget: 60000,
    bounds: { width: 1, depth: 1, height: 1.6 },
    collision: [],
    build: buildPipetteTip
  },
  {
    key: "pickup.reagent-droplet",
    path: "models/reagent-droplet.glb",
    fallback: "procedural-reagent-droplet",
    budget: 4500,
    byteBudget: 80000,
    bounds: { width: 1.2, depth: 1.2, height: 1.2 },
    collision: [],
    build: buildReagentDroplet
  },
  {
    key: "pickup.agar-plug",
    path: "models/agar-plug.glb",
    fallback: "procedural-agar-plug",
    budget: 4200,
    byteBudget: 80000,
    bounds: { width: 1.2, depth: 1.2, height: 0.7 },
    collision: [],
    build: buildAgarPlug
  },
  {
    key: "pickup.media-bead",
    path: "models/media-bead.glb",
    fallback: "procedural-media-bead",
    budget: 3800,
    byteBudget: 50000,
    bounds: { width: 1.1, depth: 1.1, height: 1.1 },
    collision: [],
    build: buildMediaBead
  },
  {
    key: "hazard.phage-particle",
    path: "models/phage-particle.glb",
    fallback: "procedural-phage-particle",
    budget: 7000,
    byteBudget: 90000,
    bounds: { width: 1.6, depth: 1.6, height: 2.2 },
    collision: [],
    build: buildPhage
  },
  {
    key: "hazard.phage-plaque",
    path: "models/phage-plaque.glb",
    fallback: "procedural-phage-plaque",
    budget: 6000,
    byteBudget: 90000,
    bounds: { width: 2.2, depth: 2.2, height: 0.1 },
    collision: [],
    build: buildPlaque
  },
  {
    key: "hazard.membrane-rupture",
    path: "models/membrane-rupture.glb",
    fallback: "procedural-membrane-rupture",
    budget: 6500,
    byteBudget: 60000,
    bounds: { width: 7, depth: 1.4, height: 0.2 },
    collision: [],
    build: buildRupture
  },
  {
    key: "hazard.media-spill",
    path: "models/media-spill.glb",
    fallback: "procedural-media-spill",
    budget: 4000,
    byteBudget: 50000,
    bounds: { width: 3.5, depth: 2.4, height: 0.1 },
    collision: [],
    build: buildSpill
  },
  {
    key: "hazard.rotor-sweep",
    path: "models/rotor-sweep.glb",
    fallback: "procedural-rotor-sweep",
    budget: 3500,
    byteBudget: 50000,
    bounds: { width: 2, depth: 26, height: 0.2 },
    collision: [],
    build: buildRotorSweep
  }
];

const manifestEntries = [];
for (const asset of ASSETS) {
  const scene = new THREE.Scene();
  const root = asset.build();
  root.name = asset.key.replace(/[^a-z0-9]+/gi, "_");
  scene.add(root);
  scene.updateMatrixWorld(true);
  const triangles = countTriangles(scene);
  const arrayBuffer = await exporter.parseAsync(scene, { binary: true, includeCustomExtensions: false });
  const bytes = Buffer.from(arrayBuffer);
  const outPath = resolve(assetRoot, asset.path);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, bytes);
  manifestEntries.push({
    key: asset.key,
    path: asset.path,
    fallback: asset.fallback,
    bounds: asset.bounds,
    collision: asset.collision,
    byteLength: bytes.byteLength,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    triangles,
    triangleBudget: asset.budget,
    byteBudget: asset.byteBudget
  });
}

const manifest = {
  version: "v3-premium-assets-20260507b",
  runtimePath: "runtime/envelope-escape-v3.js",
  artDirection: "Premium stylized science lab-bench miniatures with bevelled instrument bodies, identifiable controls, glass depth, and procedural fallbacks.",
  generatedBy: "scripts/build_envelope_v3_assets.mjs",
  assets: manifestEntries
};

writeFileSync(resolve(assetRoot, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${manifestEntries.length} Envelope Escape V3 GLB assets.`);

function buildPipette() {
  const group = new THREE.Group();

  const body = roundedBox(15.4, 2.7, 2.55, 0.95, 8, materials.pipetteWhite, "ergonomic_rounded_white_body");
  body.position.set(-1.0, 1.42, 0);
  group.add(body);

  const palmBulge = mesh(new THREE.CapsuleGeometry(1.16, 4.2, 14, 32), materials.pipetteWhite, "raised_palm_bulge");
  palmBulge.rotation.z = Math.PI / 2;
  palmBulge.scale.set(1, 0.62, 0.9);
  palmBulge.position.set(-4.25, 1.68, 0);
  group.add(palmBulge);

  const lowerShadow = roundedBox(11.4, 0.42, 2.6, 0.26, 5, materials.pipetteIvoryShadow, "subtle_lower_body_shadow");
  lowerShadow.position.set(0.8, 0.28, 0);
  group.add(lowerShadow);

  const grip = roundedBox(5.6, 1.85, 2.72, 0.62, 8, materials.pipetteBlue, "sculpted_blue_finger_grip");
  grip.position.set(-3.3, 2.1, 0);
  group.add(grip);

  const plungerStem = mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.25, 28), materials.pipetteDeepBlue, "vertical_plunger_stem");
  plungerStem.position.set(-9.35, 2.78, 0);
  group.add(plungerStem);

  const plunger = mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.6, 40), materials.pipetteBlue, "wide_round_thumb_plunger");
  plunger.position.set(-9.35, 4.05, 0);
  group.add(plunger);

  const ejector = roundedBox(1.1, 2.3, 0.54, 0.24, 5, materials.pipetteDeepBlue, "side_tip_ejector_button");
  ejector.position.set(-6.65, 2.82, -1.42);
  group.add(ejector);

  const ejectorRail = roundedBox(7.4, 0.34, 0.34, 0.14, 4, materials.pipetteDeepBlue, "blue_tip_ejector_sleeve_rail");
  ejectorRail.position.set(5.6, 1.72, -1.3);
  group.add(ejectorRail);

  const display = roundedBox(3.85, 0.2, 1.46, 0.18, 4, materials.darkDisplay, "dark_volume_display_window");
  display.position.set(-1.1, 2.96, -0.08);
  group.add(display);
  const displayBezel = roundedBox(4.24, 0.14, 1.8, 0.2, 4, materials.pipetteIvoryShadow, "raised_display_bezel");
  displayBezel.position.set(-1.1, 2.86, -0.08);
  group.add(displayBezel);
  addDisplayTicks(group, -1.1, 3.11, -0.78);

  const hook = mesh(new THREE.TorusGeometry(1.72, 0.18, 14, 56, Math.PI * 1.42), materials.pipetteDeepBlue, "curved_finger_hook");
  hook.rotation.set(Math.PI / 2, 0, -0.32);
  hook.position.set(-5.4, 0.42, 0);
  group.add(hook);

  const collar = mesh(new THREE.CylinderGeometry(1.04, 1.04, 0.85, 36), materials.pipetteDeepBlue, "blue_nose_collar");
  collar.rotation.z = Math.PI / 2;
  collar.position.set(6.78, 1.12, 0);
  group.add(collar);

  const cone = mesh(new THREE.ConeGeometry(0.94, 6.35, 40), materials.pipetteBlue, "long_tapered_nose_cone");
  cone.rotation.z = -Math.PI / 2;
  cone.position.set(9.35, 1.1, 0);
  group.add(cone);

  const tip = mesh(new THREE.ConeGeometry(0.42, 7.25, 30), physical(0xb8f4ff, { opacity: 0.45, transmission: 0.35, roughness: 0.16 }), "long_translucent_attached_tip");
  tip.rotation.z = -Math.PI / 2;
  tip.position.set(15.1, 1.08, 0);
  group.add(tip);

  for (let index = 0; index < 4; index += 1) {
    const seam = roundedBox(0.08, 0.08, 2.62, 0.04, 2, materials.pipetteIvoryShadow, `body_mold_seam_${index}`);
    seam.position.set(-7.4 + index * 3.4, 2.78, 0);
    group.add(seam);
  }
  return group;
}

function buildPetriDish() {
  const group = new THREE.Group();
  const bottomGlass = mesh(new THREE.CylinderGeometry(8.45, 8.65, 0.5, 128, 1, true), materials.glassEdge, "clear_bottom_dish_wall");
  bottomGlass.position.y = 0.22;
  group.add(bottomGlass);
  group.add(mesh(new THREE.CylinderGeometry(7.75, 8.05, 0.38, 128), materials.agar, "amber_agar_surface"));

  const agarLow = mesh(new THREE.CylinderGeometry(8.05, 8.15, 0.16, 128), materials.agarDark, "darker_agar_sidewall");
  agarLow.position.y = -0.2;
  group.add(agarLow);

  const lid = mesh(new THREE.CylinderGeometry(8.95, 8.95, 0.82, 128, 1, true), materials.glass, "transparent_lid_wall_with_depth");
  lid.position.y = 0.72;
  group.add(lid);
  const rimTop = mesh(new THREE.TorusGeometry(8.92, 0.22, 16, 160), materials.glassEdge, "raised_clear_lid_rim");
  rimTop.rotation.x = Math.PI / 2;
  rimTop.position.y = 1.18;
  group.add(rimTop);
  const rimBottom = mesh(new THREE.TorusGeometry(8.48, 0.18, 12, 128), materials.glassEdge, "thick_clear_bottom_rim");
  rimBottom.rotation.x = Math.PI / 2;
  rimBottom.position.y = 0.02;
  group.add(rimBottom);
  const agarRim = mesh(new THREE.TorusGeometry(7.85, 0.08, 8, 128), standard(0xdb9f55, { roughness: 0.62 }), "agar_meniscus_rim");
  agarRim.rotation.x = Math.PI / 2;
  agarRim.position.y = 0.27;
  group.add(agarRim);

  for (let index = 0; index < 34; index += 1) {
    const angle = index * 2.399;
    const radius = 0.8 + (index % 9) * 0.72;
    const colony = mesh(new THREE.CylinderGeometry(0.1 + (index % 4) * 0.045, 0.1 + (index % 4) * 0.045, 0.04, 18), standard(0xf7e6b6, { roughness: 0.7 }), `raised_bacterial_colony_${index}`);
    colony.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
    group.add(colony);
  }

  for (let index = 0; index < 8; index += 1) {
    const angle = index * 1.17 + 0.5;
    const radius = 2.8 + (index % 3) * 1.25;
    const plaqueRadius = 0.56 + (index % 3) * 0.2;
    const plaque = mesh(new THREE.CylinderGeometry(plaqueRadius, plaqueRadius * 1.08, 0.045, 40), materials.plaque, `cloudy_phage_plaque_${index}`);
    plaque.position.set(Math.cos(angle) * radius, 0.55, Math.sin(angle) * radius);
    plaque.scale.x = 1 + (index % 2) * 0.35;
    group.add(plaque);
    const plaqueEdge = mesh(new THREE.TorusGeometry(plaqueRadius * 0.95, 0.028, 6, 40), basic(0xf4d194, 0.3), `faint_plaque_edge_${index}`);
    plaqueEdge.rotation.x = Math.PI / 2;
    plaqueEdge.position.copy(plaque.position);
    plaqueEdge.position.y += 0.03;
    plaqueEdge.scale.x = plaque.scale.x;
    group.add(plaqueEdge);
  }

  const labelStrip = roundedBox(4.8, 0.05, 1.12, 0.1, 3, standard(0xf2f0df, { roughness: 0.68 }), "cream_side_label_tape");
  labelStrip.position.set(-2.3, 1.25, 8.65);
  group.add(labelStrip);
  for (let index = 0; index < 4; index += 1) {
    const line = mesh(new THREE.BoxGeometry(0.72 + index * 0.2, 0.04, 0.045), materials.darkDisplay, `tiny_label_line_${index}`);
    line.position.set(-3.85 + index * 0.86, 1.31, 9.23);
    group.add(line);
  }

  for (let index = 0; index < 36; index += 1) {
    const tick = mesh(new THREE.BoxGeometry(0.045, 0.055, index % 6 === 0 ? 0.92 : 0.46), materials.darkDisplay, `rim_measurement_tick_${index}`);
    const angle = (index / 36) * Math.PI * 2;
    tick.position.set(Math.cos(angle) * 8.36, 1.28, Math.sin(angle) * 8.36);
    tick.rotation.y = -angle;
    group.add(tick);
  }
  return group;
}

function buildFernbachFlask() {
  const group = new THREE.Group();
  const points = [
    new THREE.Vector2(0.7, 0),
    new THREE.Vector2(4.8, 0.22),
    new THREE.Vector2(7.6, 1.3),
    new THREE.Vector2(7.25, 2.7),
    new THREE.Vector2(5.25, 3.8),
    new THREE.Vector2(2.35, 5.5),
    new THREE.Vector2(1.05, 8.8),
    new THREE.Vector2(1.08, 11.3)
  ];
  const flask = mesh(new THREE.LatheGeometry(points, 96), materials.glass, "broad_thick_fernbach_glass");
  group.add(flask);

  const baseRing = mesh(new THREE.TorusGeometry(5.65, 0.15, 12, 96), materials.glassEdge, "thick_rounded_glass_base");
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.42;
  group.add(baseRing);

  const shoulderRing = mesh(new THREE.TorusGeometry(2.25, 0.08, 10, 72), materials.glassEdge, "neck_shoulder_glass_ring");
  shoulderRing.rotation.x = Math.PI / 2;
  shoulderRing.position.y = 5.7;
  group.add(shoulderRing);

  const media = mesh(new THREE.CylinderGeometry(5.95, 6.35, 0.72, 96), materials.media, "green_media_fill_with_meniscus");
  media.position.y = 1.82;
  group.add(media);
  const meniscus = mesh(new THREE.TorusGeometry(5.92, 0.055, 8, 96), physical(0xb9fff3, { opacity: 0.48, transmission: 0.2, roughness: 0.16, emissive: 0x0d5a50, emissiveIntensity: 0.16 }), "elliptical_media_meniscus");
  meniscus.rotation.x = Math.PI / 2;
  meniscus.position.y = 2.22;
  group.add(meniscus);
  const fillLine = mesh(new THREE.TorusGeometry(5.85, 0.035, 8, 96), standard(0xffffff, { roughness: 0.24, emissive: 0x88ffff, emissiveIntensity: 0.18 }), "bright_fill_line");
  fillLine.rotation.x = Math.PI / 2;
  fillLine.position.y = 2.42;
  group.add(fillLine);

  for (let index = 0; index < 6; index += 1) {
    const mark = mesh(new THREE.BoxGeometry(index % 2 === 0 ? 1.1 : 0.65, 0.035, 0.045), standard(0xffffff, { roughness: 0.32, emissive: 0x8ef9ff, emissiveIntensity: 0.18 }), `white_graduation_mark_${index}`);
    mark.position.set(4.7, 2.9 + index * 0.62, 0.12);
    mark.rotation.z = -0.18;
    group.add(mark);
  }

  for (let index = 0; index < 3; index += 1) {
    const highlight = mesh(new THREE.BoxGeometry(0.08, 2.6 - index * 0.4, 0.04), basic(0xffffff, 0.28 - index * 0.05), `vertical_glass_highlight_${index}`);
    highlight.position.set(-4.2 + index * 0.6, 3.0 + index * 0.5, -4.1);
    highlight.rotation.z = -0.32;
    group.add(highlight);
  }

  const neck = mesh(new THREE.CylinderGeometry(1.05, 1.25, 4.0, 48), materials.glassEdge, "clear_narrow_neck_wall");
  neck.position.y = 8.8;
  group.add(neck);

  const cap = mesh(new THREE.CylinderGeometry(1.44, 1.32, 0.78, 40), standard(0xb8c5cc, { roughness: 0.42, metalness: 0.12 }), "crimped_silver_foil_cap");
  cap.position.y = 11.45;
  group.add(cap);
  for (let index = 0; index < 8; index += 1) {
    const crease = mesh(new THREE.BoxGeometry(0.06, 0.5, 0.04), standard(0xe3edf2, { roughness: 0.5, metalness: 0.16 }), `foil_crimp_${index}`);
    const angle = (index / 8) * Math.PI * 2;
    crease.position.set(Math.cos(angle) * 1.34, 11.46, Math.sin(angle) * 1.34);
    crease.rotation.y = -angle;
    group.add(crease);
  }
  return group;
}

function buildCentrifuge() {
  const group = new THREE.Group();

  const base = roundedBox(17.8, 3.8, 14.8, 1.45, 10, materials.centrifugeShell, "rounded_rectangular_centrifuge_body");
  base.position.y = 1.25;
  group.add(base);

  const lowerTrim = roundedBox(18.2, 0.52, 15.2, 0.8, 8, materials.centrifugeShadow, "gray_lower_shadow_base");
  lowerTrim.position.y = -0.78;
  group.add(lowerTrim);

  const lidDeck = roundedBox(15.9, 0.82, 12.7, 1.05, 10, materials.centrifugeShell, "raised_lid_deck");
  lidDeck.position.y = 3.42;
  group.add(lidDeck);

  const lid = mesh(new THREE.CylinderGeometry(6.55, 6.95, 0.62, 96), physical(0xd8f5ff, { opacity: 0.34, transmission: 0.42, roughness: 0.12 }), "round_translucent_hinged_lid_window");
  lid.position.y = 3.92;
  group.add(lid);
  const lidRim = mesh(new THREE.TorusGeometry(6.72, 0.18, 12, 120), materials.glassEdge, "thick_round_lid_rim");
  lidRim.rotation.x = Math.PI / 2;
  lidRim.position.y = 4.27;
  group.add(lidRim);

  const hinge = roundedBox(5.6, 0.62, 0.82, 0.22, 4, materials.centrifugeTrim, "rear_hinge_bar");
  hinge.position.set(0, 3.7, -7.35);
  group.add(hinge);
  const latch = roundedBox(2.4, 0.42, 0.7, 0.18, 4, materials.centrifugeTrim, "front_lid_latch");
  latch.position.set(0, 3.45, 7.05);
  group.add(latch);

  const panel = roundedBox(6.1, 0.2, 1.55, 0.22, 4, materials.darkDisplay, "front_control_panel");
  panel.position.set(0, 1.95, 7.72);
  group.add(panel);
  const display = roundedBox(2.0, 0.08, 0.62, 0.12, 3, standard(0x0c1520, { roughness: 0.2, emissive: 0x12364b, emissiveIntensity: 0.42 }), "glowing_speed_display");
  display.position.set(-1.65, 2.08, 7.93);
  group.add(display);
  for (let index = 0; index < 4; index += 1) {
    const button = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24), index === 0 ? materials.warning : materials.centrifugeBlue, `round_control_button_${index}`);
    button.rotation.x = Math.PI / 2;
    button.position.set(0.48 + index * 0.68, 2.1, 7.96);
    group.add(button);
  }
  const warning = mesh(new THREE.ConeGeometry(0.62, 0.1, 3), materials.warning, "yellow_warning_triangle");
  warning.rotation.set(Math.PI / 2, 0, Math.PI / 3);
  warning.position.set(-4.9, 2.0, 7.9);
  group.add(warning);
  const rotor = new THREE.Group();
  rotor.name = "animated_rotor_with_tube_buckets";
  rotor.userData.rotor = true;
  rotor.position.y = 4.34;
  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2;
    const arm = roundedBox(0.86, 0.28, 5.8, 0.16, 4, materials.centrifugeBlue, `rotor_arm_${index}`);
    arm.rotation.y = angle;
    arm.position.set(Math.sin(angle) * 2.9, 0, Math.cos(angle) * 2.9);
    rotor.add(arm);
    const bucket = mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.95, 20), physical(0x8be8ff, { opacity: 0.55, transmission: 0.22, roughness: 0.22 }), `angled_tube_bucket_${index}`);
    bucket.rotation.z = 0.42;
    bucket.rotation.y = angle;
    bucket.position.set(Math.sin(angle) * 5.95, 0.25, Math.cos(angle) * 5.95);
    rotor.add(bucket);
    const cap = mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.12, 20), materials.centrifugeTrim, `tube_bucket_cap_${index}`);
    cap.rotation.y = angle;
    cap.position.set(Math.sin(angle) * 5.95, 1.25, Math.cos(angle) * 5.95);
    rotor.add(cap);
  }
  rotor.add(mesh(new THREE.CylinderGeometry(1.65, 1.95, 0.72, 48), materials.centrifugeBlue, "central_rotor_hub"));
  group.add(rotor);

  for (const x of [-7.3, 7.3]) {
    for (const z of [-5.9, 5.9]) {
      const foot = mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.32, 28), materials.darkDisplay, "black_rubber_foot");
      foot.position.set(x, -1.25, z);
      group.add(foot);
    }
  }
  return group;
}

function buildTubeRack() {
  const group = new THREE.Group();
  const top = roundedBox(15.2, 0.55, 7.25, 0.35, 6, materials.rack, "beveled_perforated_top_plate");
  top.position.y = 2.62;
  group.add(top);
  const bottom = roundedBox(15.2, 0.5, 7.25, 0.35, 6, materials.rackEdge, "beveled_bottom_plate");
  bottom.position.y = 0.24;
  group.add(bottom);
  for (const x of [-6.5, 6.5]) {
    for (const z of [-2.9, 2.9]) {
      const post = roundedBox(0.58, 2.45, 0.58, 0.16, 4, materials.rackEdge, "vertical_corner_post");
      post.position.set(x, 1.3, z);
      group.add(post);
      const foot = roundedBox(1.15, 0.36, 1.15, 0.2, 4, materials.darkDisplay, "rubber_rack_foot");
      foot.position.set(x, -0.35, z);
      group.add(foot);
    }
  }
  const tubeMaterials = [0x78def2, 0xf4a6c8, 0xf3d06f, 0x93f0ca].map((color) => physical(color, { opacity: 0.62, transmission: 0.22, roughness: 0.18 }));
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const x = -5.4 + col * 2.15;
      const z = -2.2 + row * 2.2;
      const hole = mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.07, 32), materials.darkDisplay, `dark_recessed_tube_hole_${row}_${col}`);
      hole.position.set(x, 2.95, z);
      group.add(hole);
      const holeRim = mesh(new THREE.TorusGeometry(0.65, 0.045, 8, 32), materials.rackEdge, `raised_hole_rim_${row}_${col}`);
      holeRim.rotation.x = Math.PI / 2;
      holeRim.position.set(x, 3.0, z);
      group.add(holeRim);
      const tube = mesh(new THREE.CylinderGeometry(0.46, 0.38, 4.1, 30), tubeMaterials[(row + col) % tubeMaterials.length], `translucent_tapered_tube_${row}_${col}`);
      tube.position.set(x, 3.45, z);
      group.add(tube);
      const cap = mesh(new THREE.CylinderGeometry(0.5, 0.54, 0.24, 28), standard([0x3fa7d6, 0xdb496d, 0xe0b532, 0x54bc82][(row + col) % 4], { roughness: 0.36, metalness: 0.04 }), `colored_snap_cap_${row}_${col}`);
      cap.position.set(x, 5.6, z);
      group.add(cap);
      const meniscus = mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.035, 24), materials.media, `tube_meniscus_${row}_${col}`);
      meniscus.position.set(x, 3.32, z);
      group.add(meniscus);
      const highlight = mesh(new THREE.BoxGeometry(0.045, 1.45, 0.035), basic(0xffffff, 0.3), `tube_vertical_highlight_${row}_${col}`);
      highlight.position.set(x - 0.18, 4.1, z - 0.36);
      group.add(highlight);
    }
  }
  for (let index = 0; index < 5; index += 1) {
    const label = roundedBox(1.1, 0.035, 0.32, 0.05, 2, standard(0xeef4ef, { roughness: 0.65 }), `rack_position_label_${index}`);
    label.position.set(-5.7 + index * 2.35, 2.98, 3.75);
    group.add(label);
  }
  return group;
}

function buildMicroscopeSlide() {
  const group = new THREE.Group();
  const slide = roundedBox(14, 0.12, 7, 0.22, 5, materials.glass, "transparent_microscope_slide_with_ground_edges");
  group.add(slide);
  const frosted = roundedBox(3.1, 0.045, 5.9, 0.14, 4, physical(0xffffff, { opacity: 0.2, transmission: 0.28, roughness: 0.45 }), "frosted_label_end");
  frosted.position.x = -4.9;
  frosted.position.y = 0.12;
  group.add(frosted);
  const coverslip = roundedBox(5.6, 0.08, 4.2, 0.12, 4, physical(0xffffff, { opacity: 0.26, transmission: 0.48, roughness: 0.1 }), "raised_coverslip");
  coverslip.position.y = 0.14;
  group.add(coverslip);
  const sample = mesh(new THREE.CircleGeometry(1.3, 40), materials.cyanGlow, "glowing_sample_spot");
  sample.rotation.x = -Math.PI / 2;
  sample.position.y = 0.21;
  group.add(sample);
  for (let index = 0; index < 3; index += 1) {
    const streak = mesh(new THREE.BoxGeometry(0.72 + index * 0.24, 0.025, 0.04), materials.darkDisplay, `frosted_label_pencil_mark_${index}`);
    streak.position.set(-5.55 + index * 0.55, 0.18, -1.7 + index * 0.45);
    group.add(streak);
  }
  return group;
}

function buildTipBox() {
  const group = new THREE.Group();
  group.add(roundedBox(6.7, 1.15, 4.75, 0.32, 6, standard(0x12364b, { roughness: 0.48, emissive: 0x082033, emissiveIntensity: 0.22 }), "blue_sterile_tip_box_base"));
  const tray = roundedBox(6.25, 0.22, 4.28, 0.18, 5, materials.darkDisplay, "dark_tip_grid_tray");
  tray.position.y = 0.78;
  group.add(tray);
  const lid = roundedBox(6.95, 0.2, 5.05, 0.26, 5, physical(0xdffbff, { opacity: 0.22, transmission: 0.36, roughness: 0.12 }), "transparent_hinged_tip_box_lid");
  lid.position.set(0.25, 1.18, -0.1);
  lid.rotation.z = -0.08;
  group.add(lid);
  const hinge = roundedBox(5.8, 0.22, 0.34, 0.1, 3, materials.darkDisplay, "tip_box_back_hinge");
  hinge.position.set(0, 1.08, -2.42);
  group.add(hinge);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const socket = mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.05, 18), standard(0x071827, { roughness: 0.55 }), `tip_socket_${row}_${col}`);
      socket.position.set(-2.6 + col * 1.3, 1.1, -1.75 + row * 1.15);
      group.add(socket);
      const tip = buildPipetteTip();
      tip.scale.setScalar(0.42);
      tip.position.set(-2.6 + col * 1.3, 1.86, -1.75 + row * 1.15);
      group.add(tip);
    }
  }
  return group;
}

function buildPipetteTip() {
  const group = new THREE.Group();
  const cone = mesh(new THREE.ConeGeometry(0.34, 1.45, 24), physical(0xb8f4ff, { opacity: 0.5, transmission: 0.35, roughness: 0.16 }), "sterile_translucent_pipette_tip");
  cone.rotation.z = Math.PI;
  group.add(cone);
  const collar = mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.18, 24), materials.cyanGlow, "tip_collar");
  collar.position.y = 0.62;
  group.add(collar);
  return group;
}

function buildReagentDroplet() {
  const droplet = mesh(new THREE.SphereGeometry(0.58, 32, 18), physical(0x72e8ff, { opacity: 0.68, transmission: 0.3, roughness: 0.12, emissive: 0x084d60, emissiveIntensity: 0.22 }), "glossy_reagent_droplet");
  droplet.scale.y = 1.16;
  return droplet;
}

function buildAgarPlug() {
  const group = new THREE.Group();
  group.add(mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.36, 32), materials.agar, "round_agar_plug"));
  const rim = mesh(new THREE.TorusGeometry(0.55, 0.035, 8, 32), standard(0xd99855, { roughness: 0.6 }), "agar_cut_rim");
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.2;
  group.add(rim);
  return group;
}

function buildMediaBead() {
  const bead = mesh(new THREE.OctahedronGeometry(0.58, 1), materials.media, "glowing_media_bead");
  return bead;
}

function buildPhage() {
  const group = new THREE.Group();
  const head = mesh(new THREE.IcosahedronGeometry(0.55, 1), materials.phage, "icosahedral_phage_head");
  head.position.y = 0.72;
  group.add(head);
  const tail = mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.25, 12), materials.phage, "contractile_tail");
  tail.position.y = -0.08;
  group.add(tail);
  for (let index = 0; index < 6; index += 1) {
    const leg = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), materials.phage, `phage_tail_fiber_${index}`);
    leg.rotation.z = Math.PI / 2.8;
    leg.rotation.y = (index / 6) * Math.PI * 2;
    leg.position.y = -0.72;
    group.add(leg);
  }
  return group;
}

function buildPlaque() {
  const group = new THREE.Group();
  group.add(mesh(new THREE.CylinderGeometry(1, 1, 0.05, 48), basic(0x815431, 0.36), "cloudy_expanding_plaque"));
  const ring = mesh(new THREE.TorusGeometry(0.9, 0.045, 8, 48), basic(0xf4c37c, 0.34), "soft_plaque_edge");
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  return group;
}

function buildRupture() {
  const group = new THREE.Group();
  for (let index = 0; index < 7; index += 1) {
    const segment = mesh(new THREE.BoxGeometry(0.9, 0.1, 0.18), materials.rupture, `jagged_membrane_tear_${index}`);
    segment.position.set(-2.7 + index * 0.9, 0, Math.sin(index * 1.7) * 0.28);
    segment.rotation.y = Math.sin(index * 2.1) * 0.55;
    group.add(segment);
  }
  return group;
}

function buildSpill() {
  const spill = mesh(new THREE.CircleGeometry(1.45, 64), basic(0x5fe0ca, 0.34), "glossy_media_spill_puddle");
  spill.scale.z = 0.68;
  spill.rotation.x = -Math.PI / 2;
  return spill;
}

function buildRotorSweep() {
  const sweep = mesh(new THREE.BoxGeometry(0.65, 0.06, 13), basic(0x9db7ff, 0.42), "transparent_rotor_sweep_arc");
  return sweep;
}

function addDisplayTicks(group, x, y, z) {
  for (let index = 0; index < 3; index += 1) {
    const tick = mesh(new THREE.BoxGeometry(0.42, 0.035, 0.08), standard(0xe9fbff, { emissive: 0x6defff, emissiveIntensity: 0.35 }), `display_digit_tick_${index}`);
    tick.position.set(x - 0.76 + index * 0.76, y, z);
    group.add(tick);
  }
}

function standard(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.5,
    metalness: options.metalness ?? 0,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0
  });
}

function physical(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? 0.25,
    metalness: options.metalness ?? 0,
    transmission: options.transmission ?? 0,
    thickness: options.thickness ?? 0.24,
    transparent: true,
    opacity: options.opacity ?? 0.55,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0
  });
}

function basic(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
}

function roundedBox(width, height, depth, radius, segments, material, name) {
  return mesh(new RoundedBoxGeometry(width, height, depth, segments, radius), material, name);
}

function mesh(geometry, material, name) {
  const item = new THREE.Mesh(geometry, material);
  item.name = name;
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

function countTriangles(object) {
  let triangles = 0;
  object.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    const geometry = child.geometry;
    if (geometry.index) triangles += geometry.index.count / 3;
    else if (geometry.attributes.position) triangles += geometry.attributes.position.count / 3;
  });
  return Math.round(triangles);
}
