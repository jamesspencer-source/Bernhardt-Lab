import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

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
  pipetteWhite: standard(0xf4f1ea, { roughness: 0.45, metalness: 0.04 }),
  pipetteBlue: standard(0x33a8c7, { roughness: 0.34, metalness: 0.06, emissive: 0x06384a, emissiveIntensity: 0.1 }),
  darkDisplay: standard(0x111821, { roughness: 0.22, metalness: 0.1, emissive: 0x02070b, emissiveIntensity: 0.3 }),
  glass: physical(0xdffbff, { roughness: 0.08, transmission: 0.55, opacity: 0.34, thickness: 0.45 }),
  agar: standard(0xf4c37c, { roughness: 0.62, emissive: 0x3f2108, emissiveIntensity: 0.12 }),
  plaque: basic(0x7e4f2a, 0.42),
  media: physical(0x65d5bd, { roughness: 0.28, transmission: 0.18, opacity: 0.58, emissive: 0x06453c, emissiveIntensity: 0.16 }),
  centrifugeShell: standard(0xd7dde4, { roughness: 0.48, metalness: 0.08 }),
  centrifugeBlue: standard(0x5b7fa9, { roughness: 0.38, metalness: 0.16, emissive: 0x0d2743, emissiveIntensity: 0.12 }),
  rack: standard(0x20344a, { roughness: 0.58, metalness: 0.05, emissive: 0x071827, emissiveIntensity: 0.18 }),
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
    bounds: { width: 38, depth: 7, height: 6 },
    collision: [{ type: "box", x: -42, z: -29, width: 34, depth: 4.2 }],
    build: buildPipette
  },
  {
    key: "lab-prop.petri-dish-plaque-assay",
    path: "models/petri-dish-plaque-assay.glb",
    fallback: "procedural-petri-dish",
    budget: 36000,
    bounds: { width: 28, depth: 28, height: 2.8 },
    collision: [],
    build: buildPetriDish
  },
  {
    key: "lab-prop.fernbach-flask",
    path: "models/fernbach-flask.glb",
    fallback: "procedural-fernbach-flask",
    budget: 42000,
    bounds: { width: 17, depth: 17, height: 12 },
    collision: [{ type: "circle", x: -7, z: 4, radius: 6.4 }],
    build: buildFernbachFlask
  },
  {
    key: "lab-prop.centrifuge-rotor",
    path: "models/centrifuge-rotor.glb",
    fallback: "procedural-centrifuge",
    budget: 48000,
    bounds: { width: 27, depth: 27, height: 7 },
    collision: [{ type: "circle", x: 42, z: 8, radius: 4.2 }],
    build: buildCentrifuge
  },
  {
    key: "lab-prop.test-tube-rack",
    path: "models/test-tube-rack.glb",
    fallback: "procedural-tube-rack",
    budget: 52000,
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
    bounds: { width: 26, depth: 13, height: 0.5 },
    collision: [],
    build: buildMicroscopeSlide
  },
  {
    key: "lab-prop.tip-box",
    path: "models/tip-box.glb",
    fallback: "procedural-tip-box",
    budget: 22000,
    bounds: { width: 11, depth: 8, height: 3 },
    collision: [{ type: "box", x: -22, z: -11, width: 10.5, depth: 7.5 }],
    build: buildTipBox
  },
  {
    key: "pickup.pipette-tip",
    path: "models/pipette-tip.glb",
    fallback: "procedural-pipette-tip",
    budget: 4000,
    bounds: { width: 1, depth: 1, height: 1.6 },
    collision: [],
    build: buildPipetteTip
  },
  {
    key: "pickup.reagent-droplet",
    path: "models/reagent-droplet.glb",
    fallback: "procedural-reagent-droplet",
    budget: 4500,
    bounds: { width: 1.2, depth: 1.2, height: 1.2 },
    collision: [],
    build: buildReagentDroplet
  },
  {
    key: "pickup.agar-plug",
    path: "models/agar-plug.glb",
    fallback: "procedural-agar-plug",
    budget: 4200,
    bounds: { width: 1.2, depth: 1.2, height: 0.7 },
    collision: [],
    build: buildAgarPlug
  },
  {
    key: "pickup.media-bead",
    path: "models/media-bead.glb",
    fallback: "procedural-media-bead",
    budget: 3800,
    bounds: { width: 1.1, depth: 1.1, height: 1.1 },
    collision: [],
    build: buildMediaBead
  },
  {
    key: "hazard.phage-particle",
    path: "models/phage-particle.glb",
    fallback: "procedural-phage-particle",
    budget: 7000,
    bounds: { width: 1.6, depth: 1.6, height: 2.2 },
    collision: [],
    build: buildPhage
  },
  {
    key: "hazard.phage-plaque",
    path: "models/phage-plaque.glb",
    fallback: "procedural-phage-plaque",
    budget: 6000,
    bounds: { width: 2.2, depth: 2.2, height: 0.1 },
    collision: [],
    build: buildPlaque
  },
  {
    key: "hazard.membrane-rupture",
    path: "models/membrane-rupture.glb",
    fallback: "procedural-membrane-rupture",
    budget: 6500,
    bounds: { width: 7, depth: 1.4, height: 0.2 },
    collision: [],
    build: buildRupture
  },
  {
    key: "hazard.media-spill",
    path: "models/media-spill.glb",
    fallback: "procedural-media-spill",
    budget: 4000,
    bounds: { width: 3.5, depth: 2.4, height: 0.1 },
    collision: [],
    build: buildSpill
  },
  {
    key: "hazard.rotor-sweep",
    path: "models/rotor-sweep.glb",
    fallback: "procedural-rotor-sweep",
    budget: 3500,
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
    triangleBudget: asset.budget
  });
}

const manifest = {
  version: "v3-premium-assets-20260507",
  runtimePath: "runtime/envelope-escape-v3.js",
  artDirection: "Premium stylized science lab-bench miniatures with GLB assets and procedural fallbacks.",
  generatedBy: "scripts/build_envelope_v3_assets.mjs",
  assets: manifestEntries
};

writeFileSync(resolve(assetRoot, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${manifestEntries.length} Envelope Escape V3 GLB assets.`);

function buildPipette() {
  const group = new THREE.Group();
  const body = mesh(new THREE.CapsuleGeometry(1.45, 15.5, 16, 36), materials.pipetteWhite, "rounded_white_body");
  body.rotation.z = Math.PI / 2;
  body.scale.y = 0.78;
  body.position.y = 1.25;
  group.add(body);

  const grip = mesh(new THREE.CapsuleGeometry(0.9, 5.8, 12, 24), materials.pipetteBlue, "blue_finger_grip");
  grip.rotation.z = Math.PI / 2;
  grip.scale.y = 0.58;
  grip.position.set(-2.8, 1.7, 0);
  group.add(grip);

  const plunger = mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.15, 32), materials.pipetteBlue, "round_thumb_plunger");
  plunger.rotation.z = Math.PI / 2;
  plunger.position.set(-9.2, 1.45, 0);
  group.add(plunger);

  const ejector = mesh(new THREE.CylinderGeometry(0.58, 0.58, 2.1, 24), materials.pipetteBlue, "side_tip_ejector_button");
  ejector.rotation.x = Math.PI / 2;
  ejector.position.set(-6.4, 2.55, -1.05);
  group.add(ejector);

  const display = mesh(new THREE.BoxGeometry(3.7, 0.18, 1.35), materials.darkDisplay, "dark_volume_display_window");
  display.position.set(-1.45, 2.72, -0.08);
  group.add(display);
  addDisplayTicks(group, -1.45, 2.84, -0.78);

  const hook = mesh(new THREE.TorusGeometry(1.38, 0.16, 12, 36, Math.PI * 1.35), materials.pipetteBlue, "curved_finger_hook");
  hook.rotation.set(Math.PI / 2, 0, -0.4);
  hook.position.set(-4.9, 0.58, 0);
  group.add(hook);

  const cone = mesh(new THREE.ConeGeometry(0.88, 6.4, 32), materials.pipetteBlue, "tapered_nose_cone");
  cone.rotation.z = -Math.PI / 2;
  cone.position.set(8.15, 1.1, 0);
  group.add(cone);

  const tip = mesh(new THREE.ConeGeometry(0.42, 6.8, 24), physical(0xb8f4ff, { opacity: 0.45, transmission: 0.35, roughness: 0.16 }), "translucent_attached_tip");
  tip.rotation.z = -Math.PI / 2;
  tip.position.set(13.85, 1.08, 0);
  group.add(tip);
  return group;
}

function buildPetriDish() {
  const group = new THREE.Group();
  group.add(mesh(new THREE.CylinderGeometry(7.8, 8.1, 0.42, 96), materials.agar, "amber_agar_surface"));
  const lid = mesh(new THREE.CylinderGeometry(8.8, 8.8, 0.55, 96, 1, true), materials.glass, "transparent_lid_wall");
  lid.position.y = 0.6;
  group.add(lid);
  const rimTop = mesh(new THREE.TorusGeometry(8.85, 0.16, 12, 128), materials.glass, "raised_clear_lid_rim");
  rimTop.rotation.x = Math.PI / 2;
  rimTop.position.y = 0.9;
  group.add(rimTop);
  const agarRim = mesh(new THREE.TorusGeometry(7.85, 0.08, 8, 96), standard(0xdb9f55, { roughness: 0.62 }), "agar_meniscus_rim");
  agarRim.rotation.x = Math.PI / 2;
  agarRim.position.y = 0.27;
  group.add(agarRim);
  for (let index = 0; index < 20; index += 1) {
    const angle = index * 2.399;
    const radius = 1.2 + (index % 7) * 0.78;
    const colony = mesh(new THREE.CylinderGeometry(0.12 + (index % 3) * 0.05, 0.12 + (index % 3) * 0.05, 0.035, 16), standard(0xf7e6b6, { roughness: 0.7 }), `small_colony_${index}`);
    colony.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
    group.add(colony);
  }
  for (let index = 0; index < 7; index += 1) {
    const angle = index * 1.17 + 0.5;
    const radius = 2.8 + (index % 3) * 1.25;
    const plaque = mesh(new THREE.CylinderGeometry(0.5 + (index % 2) * 0.22, 0.5 + (index % 2) * 0.22, 0.04, 32), materials.plaque, `cloudy_phage_plaque_${index}`);
    plaque.position.set(Math.cos(angle) * radius, 0.54, Math.sin(angle) * radius);
    group.add(plaque);
  }
  for (let index = 0; index < 24; index += 1) {
    const tick = mesh(new THREE.BoxGeometry(0.04, 0.05, index % 4 === 0 ? 0.8 : 0.42), materials.darkDisplay, `rim_measurement_tick_${index}`);
    const angle = (index / 24) * Math.PI * 2;
    tick.position.set(Math.cos(angle) * 8.35, 1.02, Math.sin(angle) * 8.35);
    tick.rotation.y = -angle;
    group.add(tick);
  }
  return group;
}

function buildFernbachFlask() {
  const group = new THREE.Group();
  const points = [
    new THREE.Vector2(0.8, 0),
    new THREE.Vector2(5.2, 0.35),
    new THREE.Vector2(7.2, 1.8),
    new THREE.Vector2(6.1, 3.3),
    new THREE.Vector2(2.3, 5.5),
    new THREE.Vector2(1.05, 9.2),
    new THREE.Vector2(1.15, 11.2)
  ];
  const flask = mesh(new THREE.LatheGeometry(points, 96), materials.glass, "broad_thick_fernbach_glass");
  group.add(flask);
  const media = mesh(new THREE.CylinderGeometry(5.75, 6.1, 0.72, 96), materials.media, "green_media_fill_with_meniscus");
  media.position.y = 2.0;
  group.add(media);
  const fillLine = mesh(new THREE.TorusGeometry(5.85, 0.035, 8, 96), standard(0xffffff, { roughness: 0.24, emissive: 0x88ffff, emissiveIntensity: 0.18 }), "bright_fill_line");
  fillLine.rotation.x = Math.PI / 2;
  fillLine.position.y = 2.42;
  group.add(fillLine);
  const cap = mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.65, 32), standard(0xb8c5cc, { roughness: 0.42, metalness: 0.12 }), "silver_foil_cap");
  cap.position.y = 11.45;
  group.add(cap);
  return group;
}

function buildCentrifuge() {
  const group = new THREE.Group();
  const base = mesh(new THREE.CylinderGeometry(8.8, 9.8, 2.2, 96), materials.centrifugeShell, "rounded_benchtop_centrifuge_body");
  base.position.y = 0.9;
  group.add(base);
  const lid = mesh(new THREE.CylinderGeometry(7.8, 8.3, 0.65, 96), physical(0xd8f5ff, { opacity: 0.32, transmission: 0.42, roughness: 0.12 }), "translucent_hinged_lid");
  lid.position.y = 2.35;
  group.add(lid);
  const hinge = mesh(new THREE.BoxGeometry(4.5, 0.6, 0.8), materials.darkDisplay, "rear_hinge");
  hinge.position.set(0, 2.55, -8.4);
  group.add(hinge);
  const panel = mesh(new THREE.BoxGeometry(5, 0.12, 1.4), materials.darkDisplay, "front_control_panel");
  panel.position.set(0, 1.86, 8.95);
  group.add(panel);
  const warning = mesh(new THREE.ConeGeometry(0.72, 0.12, 3), materials.warning, "yellow_warning_triangle");
  warning.rotation.set(Math.PI / 2, 0, Math.PI / 3);
  warning.position.set(-3.2, 1.98, 9.05);
  group.add(warning);
  const rotor = new THREE.Group();
  rotor.name = "animated_rotor_with_tube_buckets";
  rotor.position.y = 2.82;
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const arm = mesh(new THREE.BoxGeometry(1.15, 0.26, 6.2), materials.centrifugeBlue, `rotor_arm_${index}`);
    arm.rotation.y = angle;
    arm.position.set(Math.sin(angle) * 2.6, 0, Math.cos(angle) * 2.6);
    rotor.add(arm);
    const bucket = mesh(new THREE.CylinderGeometry(0.45, 0.52, 1.8, 18), physical(0x8be8ff, { opacity: 0.55, transmission: 0.22, roughness: 0.22 }), `angled_tube_bucket_${index}`);
    bucket.rotation.z = 0.42;
    bucket.position.set(Math.sin(angle) * 6.0, 0.25, Math.cos(angle) * 6.0);
    rotor.add(bucket);
  }
  rotor.add(mesh(new THREE.CylinderGeometry(1.65, 1.95, 0.72, 48), materials.centrifugeBlue, "central_rotor_hub"));
  group.add(rotor);
  return group;
}

function buildTubeRack() {
  const group = new THREE.Group();
  const top = mesh(new THREE.BoxGeometry(14.5, 0.5, 6.8), materials.rack, "perforated_top_plate");
  top.position.y = 2.5;
  group.add(top);
  const bottom = mesh(new THREE.BoxGeometry(14.5, 0.45, 6.8), materials.rack, "bottom_plate");
  bottom.position.y = 0.2;
  group.add(bottom);
  for (const x of [-6.5, 6.5]) {
    for (const z of [-2.9, 2.9]) {
      const foot = mesh(new THREE.BoxGeometry(1, 0.7, 1), materials.rack, "rack_foot");
      foot.position.set(x, -0.35, z);
      group.add(foot);
    }
  }
  const tubeMaterials = [0x78def2, 0xf4a6c8, 0xf3d06f, 0x93f0ca].map((color) => physical(color, { opacity: 0.62, transmission: 0.22, roughness: 0.18 }));
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const x = -5.4 + col * 2.15;
      const z = -2.2 + row * 2.2;
      const hole = mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.06, 24), materials.darkDisplay, `dark_tube_hole_${row}_${col}`);
      hole.position.set(x, 2.82, z);
      group.add(hole);
      const tube = mesh(new THREE.CylinderGeometry(0.48, 0.42, 3.8, 24), tubeMaterials[(row + col) % tubeMaterials.length], `colored_capped_tube_${row}_${col}`);
      tube.position.set(x, 3.45, z);
      group.add(tube);
      const meniscus = mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.035, 24), materials.media, `tube_meniscus_${row}_${col}`);
      meniscus.position.set(x, 3.05, z);
      group.add(meniscus);
    }
  }
  return group;
}

function buildMicroscopeSlide() {
  const group = new THREE.Group();
  const slide = mesh(new THREE.BoxGeometry(14, 0.12, 7), materials.glass, "transparent_microscope_slide");
  group.add(slide);
  const coverslip = mesh(new THREE.BoxGeometry(5.6, 0.08, 4.2), physical(0xffffff, { opacity: 0.26, transmission: 0.48, roughness: 0.1 }), "raised_coverslip");
  coverslip.position.y = 0.14;
  group.add(coverslip);
  const sample = mesh(new THREE.CircleGeometry(1.3, 40), materials.cyanGlow, "glowing_sample_spot");
  sample.rotation.x = -Math.PI / 2;
  sample.position.y = 0.21;
  group.add(sample);
  return group;
}

function buildTipBox() {
  const group = new THREE.Group();
  group.add(mesh(new THREE.BoxGeometry(6.5, 1.1, 4.6), standard(0x12364b, { roughness: 0.48, emissive: 0x082033, emissiveIntensity: 0.22 }), "blue_sterile_tip_box"));
  const lid = mesh(new THREE.BoxGeometry(6.8, 0.18, 4.9), physical(0xdffbff, { opacity: 0.22, transmission: 0.36, roughness: 0.12 }), "transparent_tip_box_lid");
  lid.position.y = 1.05;
  group.add(lid);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const tip = buildPipetteTip();
      tip.scale.setScalar(0.42);
      tip.position.set(-2.6 + col * 1.3, 1.75, -1.75 + row * 1.15);
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
