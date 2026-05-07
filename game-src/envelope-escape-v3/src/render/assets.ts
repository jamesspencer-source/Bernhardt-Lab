import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface V3AssetManifestEntry {
  key: string;
  path: string;
  fallback: string;
  bounds: { width: number; depth: number; height: number };
  collision: unknown[];
  byteLength: number;
  sha256: string;
  triangles: number;
  triangleBudget: number;
}

export interface V3AssetManifest {
  version: string;
  runtimePath: string;
  artDirection: string;
  generatedBy: string;
  assets: V3AssetManifestEntry[];
}

export interface V3AssetRegistry {
  readonly manifest: V3AssetManifest | null;
  readonly missingKeys: readonly string[];
  instantiate(key: string): THREE.Object3D | null;
}

const MANIFEST_URL = new URL(/* @vite-ignore */ "../asset-manifest.json", import.meta.url);

export async function loadV3AssetRegistry(): Promise<V3AssetRegistry> {
  const missingKeys: string[] = [];
  let manifest: V3AssetManifest | null = null;
  const loaded = new Map<string, THREE.Object3D>();

  try {
    const response = await fetch(MANIFEST_URL, { cache: "force-cache" });
    if (!response.ok) throw new Error(`V3 asset manifest failed with ${response.status}`);
    manifest = (await response.json()) as V3AssetManifest;
  } catch (error) {
    console.warn("[Envelope V3] Using procedural art fallbacks; manifest failed to load.", error);
    return createRegistry(null, loaded, ["asset-manifest"]);
  }

  const loader = new GLTFLoader();
  await Promise.all(
    manifest.assets.map(async (asset) => {
      try {
        const url = new URL(`../${asset.path}`, import.meta.url).href;
        const gltf = await loader.loadAsync(url);
        prepareAssetScene(gltf.scene);
        loaded.set(asset.key, gltf.scene);
      } catch (error) {
        missingKeys.push(asset.key);
        console.warn(`[Envelope V3] Using procedural fallback for ${asset.key}.`, error);
      }
    })
  );

  return createRegistry(manifest, loaded, missingKeys);
}

function createRegistry(manifest: V3AssetManifest | null, loaded: Map<string, THREE.Object3D>, missingKeys: string[]): V3AssetRegistry {
  return {
    manifest,
    missingKeys,
    instantiate(key: string): THREE.Object3D | null {
      const source = loaded.get(key);
      if (!source) return null;
      const clone = source.clone(true);
      clone.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => tuneMaterial(item));
        else tuneMaterial(material);
      });
      return clone;
    }
  };
}

function prepareAssetScene(scene: THREE.Object3D): void {
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((item) => tuneMaterial(item));
    else tuneMaterial(material);
  });
}

function tuneMaterial(material: THREE.Material | undefined): void {
  if (!material) return;
  const standard = material as THREE.MeshStandardMaterial;
  if (standard.color) standard.color.convertSRGBToLinear();
  standard.needsUpdate = true;
}
