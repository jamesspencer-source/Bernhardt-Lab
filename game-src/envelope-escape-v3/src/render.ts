import * as THREE from "three";
import { CHAMBER, LAB_PROPS, PHASES, SPECIES, WORLD_ZONES } from "./content";
import type { V3AssetRegistry } from "./render/assets";
import type { EffectEvent, GameState, HazardEntity, LabProp, PickupEntity, WorldZone } from "./types";

export interface V3Renderer {
  update(state: GameState, dt: number): void;
  resize(): void;
  dispose(): void;
}

const PROP_ASSET_KEYS: Record<string, string> = {
  "research-plus-pipette": "lab-prop.research-plus-pipette",
  "plaque-assay-dish": "lab-prop.petri-dish-plaque-assay",
  "fernbach-flask": "lab-prop.fernbach-flask",
  "bench-centrifuge": "lab-prop.centrifuge-rotor",
  "tube-rack": "lab-prop.test-tube-rack",
  "slide-start": "lab-prop.microscope-slide",
  "sterile-tip-box": "lab-prop.tip-box"
};

const PROP_ASSET_Y: Record<string, number> = {
  "research-plus-pipette": 0.8,
  "plaque-assay-dish": 0.18,
  "fernbach-flask": 0.2,
  "bench-centrifuge": 0.22,
  "tube-rack": 0.3,
  "slide-start": 0.16,
  "sterile-tip-box": 0.34
};

const PICKUP_ASSET_KEYS: Record<PickupEntity["kind"], string> = {
  pipetteTip: "pickup.pipette-tip",
  reagentDroplet: "pickup.reagent-droplet",
  agarPlug: "pickup.agar-plug",
  mediaBead: "pickup.media-bead"
};

const HAZARD_ASSET_KEYS: Partial<Record<HazardEntity["kind"], string>> = {
  phage: "hazard.phage-particle",
  plaque: "hazard.phage-plaque",
  rupture: "hazard.membrane-rupture",
  crack: "hazard.membrane-rupture",
  spill: "hazard.media-spill",
  rotor: "hazard.rotor-sweep",
  droplet: "pickup.reagent-droplet"
};

export function createV3Renderer(parent: HTMLElement, assets?: V3AssetRegistry): V3Renderer {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07101c);
  scene.fog = new THREE.FogExp2(0x102034, 0.0065);

  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 280);
  camera.position.set(-46, 32, 48);
  camera.lookAt(-44, 0, 22);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  parent.append(renderer.domElement);

  const clock = new THREE.Clock();
  const root = new THREE.Group();
  scene.add(root);

  const benchMaterial = new THREE.MeshStandardMaterial({
    color: 0x132333,
    roughness: 0.76,
    metalness: 0.02,
    emissive: 0x101d2a,
    emissiveIntensity: 0.28
  });
  const bench = new THREE.Mesh(new THREE.BoxGeometry(CHAMBER.width + 12, 0.5, CHAMBER.depth + 10), benchMaterial);
  bench.receiveShadow = true;
  bench.position.y = -0.28;
  root.add(bench);

  const mat = new THREE.Mesh(
    new THREE.BoxGeometry(CHAMBER.width - 6, 0.08, CHAMBER.depth - 5),
    new THREE.MeshStandardMaterial({ color: 0x16354a, roughness: 0.7, metalness: 0.04, emissive: 0x0e2839, emissiveIntensity: 0.2 })
  );
  mat.position.y = 0.03;
  mat.receiveShadow = true;
  root.add(mat);

  const zoneGroup = new THREE.Group();
  WORLD_ZONES.forEach((zone) => zoneGroup.add(createZoneSurface(zone)));
  root.add(zoneGroup);

  const propGroup = new THREE.Group();
  LAB_PROPS.forEach((prop) => propGroup.add(createLabProp(prop, assets)));
  root.add(propGroup);

  const grid = new THREE.GridHelper(CHAMBER.width, 36, 0x2e7d8a, 0x123746);
  grid.position.y = 0.08;
  const gridMaterial = grid.material as THREE.Material & { opacity?: number; transparent?: boolean };
  gridMaterial.opacity = 0.12;
  gridMaterial.transparent = true;
  root.add(grid);

  const player = new THREE.Group();
  root.add(player);

  const hazards = new Map<number, THREE.Object3D>();
  const pickups = new Map<number, THREE.Object3D>();
  const effects = new Map<number, THREE.Object3D>();

  scene.add(new THREE.HemisphereLight(0xffead1, 0x06101d, 1.8));
  const key = new THREE.DirectionalLight(0xffd9ae, 3.25);
  key.position.set(-32, 36, 30);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  key.shadow.camera.left = -75;
  key.shadow.camera.right = 75;
  key.shadow.camera.top = 55;
  key.shadow.camera.bottom = -55;
  scene.add(key);
  const cyanRim = new THREE.PointLight(0x76f0ff, 30, 92);
  cyanRim.position.set(-46, 12, -30);
  scene.add(cyanRim);
  const roseRim = new THREE.PointLight(0xff8fae, 24, 84);
  roseRim.position.set(45, 12, 32);
  scene.add(roseRim);

  let currentSpecies = "";
  const cameraTarget = new THREE.Vector3(-46, 0, 22);
  const desiredCamera = new THREE.Vector3();

  function buildPlayer(state: GameState): void {
    player.clear();
    const species = SPECIES[state.speciesId];
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: species.colorA,
      emissive: species.colorB,
      emissiveIntensity: 0.32,
      roughness: 0.36,
      metalness: 0.02,
      transmission: 0.16,
      thickness: 0.28
    });
    const coreMaterial = new THREE.MeshStandardMaterial({ color: species.colorB, emissive: species.colorB, emissiveIntensity: 0.72, roughness: 0.58 });
    const body =
      species.silhouette === "coccus"
        ? new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 16), bodyMaterial)
        : species.silhouette === "diplococcus"
          ? diplococcus(bodyMaterial)
          : new THREE.Mesh(new THREE.CapsuleGeometry(0.5, species.silhouette === "coryneform" ? 1.65 : 2.2, 12, 28), bodyMaterial);
    body.castShadow = true;
    body.rotation.z = Math.PI / 2;
    player.add(body);
    if (species.silhouette === "capsule") {
      const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 2.55, 12, 28), new THREE.MeshBasicMaterial({ color: 0xc8fff2, transparent: true, opacity: 0.23 }));
      capsule.rotation.z = Math.PI / 2;
      player.add(capsule);
    }
    const nucleoid = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 8), coreMaterial);
    nucleoid.position.set(0.16, 0.18, 0.06);
    player.add(nucleoid);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.025, 6, 72), new THREE.MeshBasicMaterial({ color: species.colorA, transparent: true, opacity: 0.36 }));
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.36;
    player.add(halo);
  }

  function update(state: GameState, dt: number): void {
    const delta = dt || clock.getDelta();
    if (currentSpecies !== state.speciesId) {
      currentSpecies = state.speciesId;
      buildPlayer(state);
    }
    const phase = PHASES[state.phaseIndex];
    benchMaterial.emissive?.setHex(phase.tint);
    benchMaterial.emissiveIntensity = 0.25 + state.phaseIndex * 0.07;
    player.position.set(state.player.x, 0.86 + Math.sin(state.elapsed * 5.2) * 0.045, state.player.z);
    player.rotation.y = Math.atan2(state.player.vx, state.player.vz || 0.001);
    player.scale.setScalar(1 + (state.status === "command" ? 0.08 : 0));
    propGroup.children.forEach((child) => animateLabProp(child, state, delta));
    syncCollection(root, hazards, state.hazards, (hazard) => createHazardObject(hazard, assets), updateHazardObject);
    syncCollection(root, pickups, state.pickups, (pickup) => createPickupObject(pickup, assets), updatePickupObject);
    syncCollection(root, effects, state.effects, createEffectObject, updateEffectObject);

    cameraTarget.lerp(new THREE.Vector3(state.player.x, 0.1, state.player.z), Math.min(1, delta * 2.4));
    desiredCamera.set(cameraTarget.x - 4, 34, cameraTarget.z + 36);
    camera.position.lerp(desiredCamera, Math.min(1, delta * 2.1));
    camera.lookAt(cameraTarget.x + 2.2, 0.12, cameraTarget.z - 3.6);
    renderer.render(scene, camera);
  }

  function resize(): void {
    const rect = parent.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(260, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function dispose(): void {
    renderer.dispose();
    renderer.domElement.remove();
  }

  resize();
  return { update, resize, dispose };
}

function createZoneSurface(zone: WorldZone): THREE.Object3D {
  const group = new THREE.Group();
  group.position.set(zone.bounds.x, 0.095, zone.bounds.z);
  const surface = new THREE.Mesh(
    new THREE.BoxGeometry(zone.bounds.width, 0.04, zone.bounds.depth),
    new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.1 })
  );
  group.add(surface);
  const border = new THREE.Mesh(
    new THREE.RingGeometry(0.48, 0.52, 4),
    new THREE.MeshBasicMaterial({ color: zone.accent, transparent: true, opacity: 0.26 })
  );
  border.scale.set(zone.bounds.width, zone.bounds.depth, 1);
  border.rotation.x = Math.PI / 2;
  border.rotation.z = Math.PI / 4;
  border.position.y = 0.03;
  group.add(border);
  const label = makeLabel(zone.shortLabel, zone.accent);
  label.position.set(-zone.bounds.width / 2 + 3.2, 0.35, -zone.bounds.depth / 2 + 2.2);
  group.add(label);
  return group;
}

function createLabProp(prop: LabProp, assets?: V3AssetRegistry): THREE.Object3D {
  const asset = instantiateLabProp(prop, assets);
  if (asset) return asset;
  if (prop.kind === "pipette") return createPipette(prop);
  if (prop.kind === "petriDish") return createPetriDish(prop);
  if (prop.kind === "fernbachFlask") return createFernbachFlask(prop);
  if (prop.kind === "centrifuge") return createCentrifuge(prop);
  if (prop.kind === "tubeRack") return createTubeRack(prop);
  if (prop.kind === "tipBox") return createTipBox(prop);
  if (prop.kind === "spill") return createSpill(prop);
  return createMicroscopeSlide(prop);
}

function instantiateLabProp(prop: LabProp, assets?: V3AssetRegistry): THREE.Object3D | null {
  const key = PROP_ASSET_KEYS[prop.id];
  const instance = key ? assets?.instantiate(key) : null;
  if (!instance) return null;
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.userData.assetKey = key;
  group.position.set(prop.x, PROP_ASSET_Y[prop.id] ?? 0.2, prop.z);
  group.rotation.y = prop.angle ?? 0;
  group.add(instance);
  return group;
}

function createPipette(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.5, prop.z);
  group.rotation.y = prop.angle ?? 0;
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe8eef2, roughness: 0.52, metalness: 0.06 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x5cc6df, roughness: 0.42, metalness: 0.05, emissive: 0x0a5364, emissiveIntensity: 0.18 });
  const shadowMat = new THREE.MeshStandardMaterial({ color: 0x26313a, roughness: 0.7 });
  const handle = new THREE.Mesh(new THREE.BoxGeometry(prop.width * 0.78, 1.15, prop.depth), bodyMat);
  handle.castShadow = true;
  group.add(handle);
  const plunger = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.45, prop.depth * 1.08), blueMat);
  plunger.position.x = -prop.width * 0.44;
  plunger.castShadow = true;
  group.add(plunger);
  const window = new THREE.Mesh(new THREE.BoxGeometry(6, 0.08, prop.depth * 1.08), shadowMat);
  window.position.set(-2, 0.62, 0);
  group.add(window);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.72, 9.2, 18), blueMat);
  cone.rotation.z = -Math.PI / 2;
  cone.position.x = prop.width * 0.47;
  cone.castShadow = true;
  group.add(cone);
  return group;
}

function createPetriDish(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.18, prop.z);
  const agar = new THREE.Mesh(new THREE.CylinderGeometry(prop.radius ?? 12, prop.radius ?? 12, 0.32, 96), new THREE.MeshStandardMaterial({ color: 0xf4c77c, roughness: 0.64, emissive: 0x3f240a, emissiveIntensity: 0.22 }));
  agar.receiveShadow = true;
  group.add(agar);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(prop.radius ?? 12.5, 0.28, 12, 120), new THREE.MeshPhysicalMaterial({ color: 0xdffbff, transparent: true, opacity: 0.34, roughness: 0.2, transmission: 0.42 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.32;
  group.add(rim);
  for (let index = 0; index < 10; index += 1) {
    const plaque = new THREE.Mesh(new THREE.CylinderGeometry(0.6 + (index % 3) * 0.32, 0.6 + (index % 3) * 0.32, 0.04, 32), new THREE.MeshBasicMaterial({ color: 0x8d5b2c, transparent: true, opacity: 0.26 }));
    const angle = index * 2.399;
    const radius = 2.6 + (index % 5) * 1.8;
    plaque.position.set(Math.cos(angle) * radius, 0.52, Math.sin(angle) * radius);
    group.add(plaque);
  }
  return group;
}

function createFernbachFlask(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.24, prop.z);
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xc8fcff, transparent: true, opacity: 0.28, roughness: 0.12, transmission: 0.52, thickness: 0.5 });
  const media = new THREE.MeshStandardMaterial({ color: 0x6fd4be, transparent: true, opacity: 0.52, roughness: 0.45, emissive: 0x145c53, emissiveIntensity: 0.26 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(prop.radius ?? 7, 48, 24), glass);
  bulb.scale.y = 0.52;
  bulb.position.y = 2.6;
  bulb.castShadow = true;
  group.add(bulb);
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry((prop.radius ?? 7) * 0.76, (prop.radius ?? 7) * 0.78, 0.45, 64), media);
  liquid.position.y = 1.85;
  group.add(liquid);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.5, 5.6, 32), glass);
  neck.position.y = 6.2;
  neck.castShadow = true;
  group.add(neck);
  return group;
}

function createCentrifuge(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.2, prop.z);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(prop.radius ?? 12, prop.radius ?? 12, 1.2, 96), new THREE.MeshStandardMaterial({ color: 0xcfd7df, roughness: 0.5, metalness: 0.08 }));
  base.castShadow = true;
  group.add(base);
  const rotor = new THREE.Group();
  rotor.userData.rotor = true;
  rotor.position.y = 0.84;
  const rotorMat = new THREE.MeshStandardMaterial({ color: 0x5d7fa7, roughness: 0.42, metalness: 0.18, emissive: 0x162d4c, emissiveIntensity: 0.18 });
  for (let index = 0; index < 8; index += 1) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.28, 10), rotorMat);
    arm.rotation.y = (index / 8) * Math.PI * 2;
    arm.position.set(Math.sin(arm.rotation.y) * 2.4, 0, Math.cos(arm.rotation.y) * 2.4);
    arm.castShadow = true;
    rotor.add(arm);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.9, 0.7, 48), rotorMat);
  hub.castShadow = true;
  rotor.add(hub);
  group.add(rotor);
  return group;
}

function createTubeRack(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.3, prop.z);
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x20344a, roughness: 0.62, metalness: 0.04, emissive: 0x0b1c2d, emissiveIntensity: 0.2 });
  const tubeMats = [0x78def2, 0xf5a6c7, 0xf3d06f, 0x93f0ca].map((color) => new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.62, roughness: 0.22, transmission: 0.26 }));
  const base = new THREE.Mesh(new THREE.BoxGeometry(prop.width, 1, prop.depth), rackMat);
  base.castShadow = true;
  group.add(base);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.58, 4.2, 24), tubeMats[(row + col) % tubeMats.length]);
      tube.position.set(-prop.width / 2 + 3.4 + col * 4.2, 2.5, -prop.depth / 2 + 2.7 + row * 3.8);
      tube.castShadow = true;
      group.add(tube);
    }
  }
  return group;
}

function createTipBox(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.35, prop.z);
  const base = new THREE.Mesh(new THREE.BoxGeometry(prop.width, 1.2, prop.depth), new THREE.MeshStandardMaterial({ color: 0x12364b, roughness: 0.48, emissive: 0x082033, emissiveIntensity: 0.22 }));
  base.castShadow = true;
  group.add(base);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.4, 12), new THREE.MeshStandardMaterial({ color: 0xb8f4ff, roughness: 0.38 }));
      tip.position.set(-prop.width / 2 + 1.8 + col * 1.8, 1.45, -prop.depth / 2 + 1.3 + row * 1.6);
      tip.castShadow = true;
      group.add(tip);
    }
  }
  return group;
}

function createSpill(prop: LabProp): THREE.Object3D {
  const spill = new THREE.Mesh(
    new THREE.CircleGeometry(Math.max(prop.width, prop.depth) * 0.48, 64),
    new THREE.MeshBasicMaterial({ color: 0x68e4cf, transparent: true, opacity: 0.18 })
  );
  spill.userData.kind = prop.kind;
  spill.position.set(prop.x, 0.16, prop.z);
  spill.scale.z = prop.depth / prop.width;
  spill.rotation.x = -Math.PI / 2;
  return spill;
}

function createMicroscopeSlide(prop: LabProp): THREE.Object3D {
  const group = new THREE.Group();
  group.userData.kind = prop.kind;
  group.position.set(prop.x, 0.16, prop.z);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(prop.width, 0.12, prop.depth), new THREE.MeshPhysicalMaterial({ color: 0xdffbff, transparent: true, opacity: 0.24, roughness: 0.2, transmission: 0.46 }));
  group.add(glass);
  const coverslip = new THREE.Mesh(new THREE.BoxGeometry(prop.width * 0.44, 0.06, prop.depth * 0.55), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 }));
  coverslip.position.y = 0.12;
  group.add(coverslip);
  return group;
}

function animateLabProp(object: THREE.Object3D, state: GameState, delta: number): void {
  if (object.userData.kind === "spill") object.scale.x = 1 + Math.sin(state.elapsed * 1.3) * 0.035;
  object.traverse((child) => {
    if (child.userData.rotor) child.rotation.y += delta * (state.phaseIndex >= 3 ? 1.8 : 0.42);
  });
}

function diplococcus(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  const left = new THREE.Mesh(new THREE.SphereGeometry(0.64, 32, 16), material);
  const right = new THREE.Mesh(new THREE.SphereGeometry(0.64, 32, 16), material);
  left.position.x = -0.46;
  right.position.x = 0.46;
  left.castShadow = true;
  right.castShadow = true;
  group.add(left, right);
  return group;
}

function createHazardObject(hazard: HazardEntity, assets?: V3AssetRegistry): THREE.Object3D {
  const assetKey = HAZARD_ASSET_KEYS[hazard.kind];
  const asset = assetKey ? assets?.instantiate(assetKey) : null;
  if (asset) {
    asset.userData.assetKey = assetKey;
    asset.userData.kind = hazard.kind;
    return asset;
  }
  if (hazard.kind === "phage") {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0xffd68a, emissive: 0x6d3c0c, emissiveIntensity: 0.72, transparent: true, opacity: 0.9, roughness: 0.42 });
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.58, 1), material);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.05, 8), material);
    tail.position.z = -0.72;
    tail.rotation.x = Math.PI / 2;
    group.add(head, tail);
    return group;
  }
  if (hazard.kind === "droplet") {
    return new THREE.Mesh(new THREE.SphereGeometry(0.82, 24, 14), new THREE.MeshPhysicalMaterial({ color: 0x70eaff, transparent: true, opacity: 0.68, roughness: 0.18, transmission: 0.34, emissive: 0x0b5266, emissiveIntensity: 0.28 }));
  }
  if (hazard.kind === "plaque" || hazard.kind === "spill") {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 0.08, 64),
      new THREE.MeshBasicMaterial({ color: hazard.kind === "plaque" ? 0x8e4b2d : 0x5fe0ca, transparent: true, opacity: hazard.kind === "plaque" ? 0.38 : 0.32 })
    );
  }
  const material = new THREE.MeshStandardMaterial({
    color: hazard.kind === "shock" ? 0x8fefff : hazard.kind === "crack" ? 0xffa979 : hazard.kind === "rotor" ? 0x9db7ff : 0xff7895,
    emissive: hazard.kind === "rupture" ? 0x8f243d : 0x234c5f,
    emissiveIntensity: 0.76,
    transparent: true,
    opacity: hazard.age < hazard.telegraph ? 0.35 : 0.88,
    roughness: 0.46
  });
  if (hazard.kind === "crack") return createCrack(material, hazard.width);
  if (hazard.kind === "shock") return new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.14, 28), material);
  if (hazard.kind === "rotor") return new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.18, hazard.radius * 2), material);
  return new THREE.Mesh(new THREE.TorusGeometry(hazard.radius, 0.08, 8, 72), material);
}

function createCrack(material: THREE.Material, width: number): THREE.Object3D {
  const group = new THREE.Group();
  for (let index = 0; index < 5; index += 1) {
    const segment = new THREE.Mesh(new THREE.BoxGeometry(width / 5, 0.16, 0.26), material);
    segment.position.x = -width / 2 + index * (width / 5) + width / 10;
    segment.position.z = Math.sin(index * 1.7) * 0.34;
    segment.rotation.y = Math.sin(index * 2.1) * 0.35;
    group.add(segment);
  }
  return group;
}

function updateHazardObject(object: THREE.Object3D, hazard: HazardEntity): void {
  object.position.set(hazard.x, hazard.kind === "plaque" || hazard.kind === "spill" || hazard.kind === "rupture" ? 0.26 : 0.86, hazard.z);
  object.rotation.y = -hazard.angle;
  const telegraphPulse = hazard.age < hazard.telegraph ? 1 + Math.sin(hazard.age * 18) * 0.08 : 1;
  if (hazard.kind === "plaque" || hazard.kind === "spill") object.scale.set(hazard.radius, 1, hazard.radius);
  else if (hazard.kind === "rupture") object.scale.setScalar(Math.max(0.6, hazard.radius));
  else object.scale.setScalar(telegraphPulse);
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.material as THREE.Material & { opacity?: number };
    if (material?.opacity !== undefined) material.opacity = hazard.age < hazard.telegraph ? 0.3 : hazard.kind === "plaque" || hazard.kind === "spill" ? 0.42 : 0.88;
  });
}

function createPickupObject(pickup: PickupEntity, assets?: V3AssetRegistry): THREE.Object3D {
  const asset = assets?.instantiate(PICKUP_ASSET_KEYS[pickup.kind]);
  if (asset) {
    asset.userData.assetKey = PICKUP_ASSET_KEYS[pickup.kind];
    asset.userData.kind = pickup.kind;
    return asset;
  }
  const color = pickup.kind === "pipetteTip" ? 0xb8f4ff : pickup.kind === "reagentDroplet" ? 0x74e0ff : pickup.kind === "agarPlug" ? 0xf6ca7f : 0xa8ffdf;
  const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.36, roughness: 0.36 });
  if (pickup.kind === "pipetteTip") {
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.35, 16), material);
    tip.rotation.z = Math.PI;
    return tip;
  }
  if (pickup.kind === "reagentDroplet") return new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 12), material);
  if (pickup.kind === "agarPlug") return new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.42, 24), material);
  return new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), material);
}

function updatePickupObject(object: THREE.Object3D, pickup: PickupEntity): void {
  object.position.set(pickup.x, 0.78 + Math.sin(pickup.age * 4) * 0.16, pickup.z);
  object.rotation.y += 0.04;
  object.rotation.x += 0.018;
}

function createEffectObject(effect: EffectEvent): THREE.Object3D {
  const material = new THREE.MeshBasicMaterial({
    color: effect.type === "damage" || effect.type === "lysis" ? 0xff7895 : effect.type === "command" ? 0xd7fbff : 0xa8ffdf,
    transparent: true,
    opacity: 0.78
  });
  return new THREE.Mesh(new THREE.RingGeometry(0.28, 0.4, 40), material);
}

function updateEffectObject(object: THREE.Object3D, effect: EffectEvent): void {
  object.position.set(effect.x, 0.82 + effect.age * 0.34, effect.z);
  object.rotation.x = -Math.PI / 2;
  object.scale.setScalar(1 + effect.age * 2.5);
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.material as THREE.MeshBasicMaterial | undefined;
    if (material?.opacity !== undefined) material.opacity = Math.max(0, 0.78 - effect.age * 0.5);
  });
}

function makeLabel(text: string, color: number): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(3, 12, 22, 0.72)";
    roundRect(context, 12, 20, 488, 82, 24);
    context.fill();
    context.strokeStyle = `#${color.toString(16).padStart(6, "0")}`;
    context.globalAlpha = 0.72;
    context.stroke();
    context.globalAlpha = 1;
    context.fillStyle = "#ecfbff";
    context.font = "800 34px Georgia, serif";
    context.fillText(text, 38, 73);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(8, 2, 1);
  return sprite;
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function syncCollection<T extends { id: number }>(
  parent: THREE.Group,
  map: Map<number, THREE.Object3D>,
  items: T[],
  create: (item: T) => THREE.Object3D,
  update: (object: THREE.Object3D, item: T) => void
): void {
  const live = new Set(items.map((item) => item.id));
  for (const [id, object] of map) {
    if (!live.has(id)) {
      object.removeFromParent();
      map.delete(id);
    }
  }
  items.forEach((item) => {
    let object = map.get(item.id);
    if (!object) {
      object = create(item);
      map.set(item.id, object);
      parent.add(object);
    }
    if (!object.parent) parent.add(object);
    update(object, item);
  });
}
