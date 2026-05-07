import * as THREE from "three";
import { CHAMBER, PHASES, SPECIES } from "./content";
import type { EffectEvent, GameState, HazardEntity, PickupEntity } from "./types";

export interface V3Renderer {
  update(state: GameState, dt: number): void;
  resize(): void;
  dispose(): void;
}

export function createV3Renderer(parent: HTMLElement): V3Renderer {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030912);
  scene.fog = new THREE.FogExp2(0x071322, 0.024);

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 180);
  camera.position.set(0, 21, 18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  parent.append(renderer.domElement);

  const clock = new THREE.Clock();
  const root = new THREE.Group();
  root.rotation.x = -0.08;
  scene.add(root);

  const chamberMaterial = new THREE.MeshStandardMaterial({
    color: 0x071827,
    roughness: 0.74,
    metalness: 0.05,
    emissive: 0x061b26,
    emissiveIntensity: 0.8
  });
  const chamber = new THREE.Mesh(new THREE.BoxGeometry(CHAMBER.width, 0.28, CHAMBER.depth), chamberMaterial);
  chamber.receiveShadow = true;
  chamber.position.y = -0.1;
  root.add(chamber);

  const borderMaterial = new THREE.MeshStandardMaterial({ color: 0x123447, emissive: 0x0a5b66, emissiveIntensity: 0.3, roughness: 0.42 });
  const borderGeometries = [
    [CHAMBER.width + 0.4, 0.5, 0.24, 0, -CHAMBER.depth / 2],
    [CHAMBER.width + 0.4, 0.5, 0.24, 0, CHAMBER.depth / 2],
    [0.24, 0.5, CHAMBER.depth + 0.4, -CHAMBER.width / 2, 0],
    [0.24, 0.5, CHAMBER.depth + 0.4, CHAMBER.width / 2, 0]
  ];
  borderGeometries.forEach(([width, height, depth, x, z]) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), borderMaterial);
    wall.position.set(x, 0.18, z);
    wall.castShadow = true;
    root.add(wall);
  });

  const grid = new THREE.GridHelper(CHAMBER.width, 24, 0x3a9dab, 0x154354);
  grid.position.y = 0.06;
  grid.material.opacity = 0.28;
  grid.material.transparent = true;
  root.add(grid);

  const membraneBands = new THREE.Group();
  for (let index = 0; index < 9; index += 1) {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 8 }, (_, point) => {
        const x = -CHAMBER.width / 2 + (point / 7) * CHAMBER.width;
        const z = -CHAMBER.depth / 2 + index * (CHAMBER.depth / 8) + Math.sin(point * 1.7 + index) * 0.45;
        return new THREE.Vector3(x, 0.12, z);
      })
    );
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 40, 0.018, 5, false),
      new THREE.MeshBasicMaterial({ color: 0x79eff0, transparent: true, opacity: 0.16 })
    );
    membraneBands.add(tube);
  }
  root.add(membraneBands);

  const player = new THREE.Group();
  root.add(player);

  const hazards = new Map<number, THREE.Object3D>();
  const pickups = new Map<number, THREE.Object3D>();
  const effects = new Map<number, THREE.Object3D>();

  scene.add(new THREE.HemisphereLight(0xcffcff, 0x07101e, 2.1));
  const key = new THREE.DirectionalLight(0xd7fbff, 3.2);
  key.position.set(-7, 15, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.PointLight(0xff9bad, 30, 40);
  rim.position.set(8, 7, -9);
  scene.add(rim);

  function buildPlayer(state: GameState): void {
    player.clear();
    const species = SPECIES[state.speciesId];
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: species.colorA,
      emissive: species.colorB,
      emissiveIntensity: 0.28,
      roughness: 0.38,
      metalness: 0.02,
      transmission: 0.18,
      thickness: 0.24
    });
    const coreMaterial = new THREE.MeshStandardMaterial({ color: species.colorB, emissive: species.colorB, emissiveIntensity: 0.6, roughness: 0.58 });
    const body =
      species.silhouette === "coccus"
        ? new THREE.Mesh(new THREE.SphereGeometry(0.86, 32, 16), bodyMaterial)
        : species.silhouette === "diplococcus"
          ? diplococcus(bodyMaterial)
          : new THREE.Mesh(new THREE.CapsuleGeometry(0.48, species.silhouette === "coryneform" ? 1.55 : 2.1, 12, 24), bodyMaterial);
    body.castShadow = true;
    body.rotation.z = Math.PI / 2;
    player.add(body);
    if (species.silhouette === "capsule") {
      const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.68, 2.42, 12, 24), new THREE.MeshBasicMaterial({ color: 0xc8fff2, transparent: true, opacity: 0.22 }));
      capsule.rotation.z = Math.PI / 2;
      player.add(capsule);
    }
    const nucleoid = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 8), coreMaterial);
    nucleoid.position.set(0.16, 0.16, 0.06);
    player.add(nucleoid);
  }

  let currentSpecies = "";

  function update(state: GameState, dt: number): void {
    const delta = dt || clock.getDelta();
    if (currentSpecies !== state.speciesId) {
      currentSpecies = state.speciesId;
      buildPlayer(state);
    }
    const phase = PHASES[state.phaseIndex];
    chamberMaterial.emissive?.setHex(phase.tint);
    chamberMaterial.emissiveIntensity = 0.4 + state.phaseIndex * 0.08;
    membraneBands.children.forEach((child, index) => {
      child.position.y = 0.04 + Math.sin(state.elapsed * 1.4 + index) * 0.018;
    });
    player.position.set(state.player.x, 0.72 + Math.sin(state.elapsed * 5) * 0.04, state.player.z);
    player.rotation.y = Math.atan2(state.player.vx, state.player.vz || 0.001);
    player.scale.setScalar(1 + (state.status === "command" ? 0.08 : 0));
    syncCollection(root, hazards, state.hazards, createHazardObject, updateHazardObject);
    syncCollection(root, pickups, state.pickups, createPickupObject, updatePickupObject);
    syncCollection(root, effects, state.effects, createEffectObject, updateEffectObject);
    const cameraTarget = new THREE.Vector3(state.player.x * 0.18, 0, state.player.z * 0.12);
    camera.position.x += (cameraTarget.x - camera.position.x) * Math.min(1, delta * 2.2);
    camera.position.z += (18 + cameraTarget.z - camera.position.z) * Math.min(1, delta * 1.4);
    camera.lookAt(state.player.x * 0.24, 0.2, state.player.z * 0.24);
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

function createHazardObject(hazard: HazardEntity): THREE.Object3D {
  const material = new THREE.MeshStandardMaterial({
    color: hazard.kind === "phage" ? 0xffd68a : hazard.kind === "shock" ? 0x8fefff : hazard.kind === "crack" ? 0xffa979 : 0xff7895,
    emissive: hazard.kind === "rupture" ? 0x8f243d : 0x234c5f,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: hazard.age < hazard.telegraph ? 0.42 : 0.9,
    roughness: 0.48
  });
  if (hazard.kind === "phage") {
    const group = new THREE.Group();
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), material);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.82, 8), material);
    tail.position.z = -0.58;
    tail.rotation.x = Math.PI / 2;
    group.add(head, tail);
    return group;
  }
  if (hazard.kind === "crack") return new THREE.Mesh(new THREE.BoxGeometry(hazard.width, 0.18, 0.22), material);
  if (hazard.kind === "shock") return new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 12), material);
  return new THREE.Mesh(new THREE.TorusGeometry(hazard.radius, 0.06, 8, 64), material);
}

function updateHazardObject(object: THREE.Object3D, hazard: HazardEntity): void {
  object.position.set(hazard.x, hazard.kind === "rupture" ? 0.18 : 0.58, hazard.z);
  object.rotation.y = -hazard.angle;
  object.scale.setScalar(hazard.age < hazard.telegraph ? 1 + Math.sin(hazard.age * 18) * 0.08 : 1);
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial | undefined;
    if (material?.opacity !== undefined) material.opacity = hazard.age < hazard.telegraph ? 0.32 : 0.9;
  });
}

function createPickupObject(pickup: PickupEntity): THREE.Object3D {
  const color = pickup.kind === "pg" ? 0xa8ffdf : pickup.kind === "lipid" ? 0x9ee9ff : pickup.kind === "restraint" ? 0xffd68a : 0xffc0d2;
  const mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.42, 0),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.42, roughness: 0.36 })
  );
  return mesh;
}

function updatePickupObject(object: THREE.Object3D, pickup: PickupEntity): void {
  object.position.set(pickup.x, 0.62 + Math.sin(pickup.age * 4) * 0.12, pickup.z);
  object.rotation.y += 0.04;
  object.rotation.x += 0.02;
}

function createEffectObject(effect: EffectEvent): THREE.Object3D {
  const material = new THREE.MeshBasicMaterial({
    color: effect.type === "damage" || effect.type === "lysis" ? 0xff7895 : effect.type === "command" ? 0xd7fbff : 0xa8ffdf,
    transparent: true,
    opacity: 0.75
  });
  return new THREE.Mesh(new THREE.RingGeometry(0.25, 0.35, 32), material);
}

function updateEffectObject(object: THREE.Object3D, effect: EffectEvent): void {
  object.position.set(effect.x, 0.72 + effect.age * 0.25, effect.z);
  object.rotation.x = -Math.PI / 2;
  object.scale.setScalar(1 + effect.age * 2.2);
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.material as THREE.MeshBasicMaterial | undefined;
    if (material?.opacity !== undefined) material.opacity = Math.max(0, 0.75 - effect.age * 0.45);
  });
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
