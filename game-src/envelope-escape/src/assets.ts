import { PICKUPS, RESPONSES, SPECIES, SPECIES_ORDER } from "./content";

export const ASSET_ROOT = "assets/game/envelope-escape";

export const ASSETS = {
  background: `${ASSET_ROOT}/fx/chamber-background.png`,
  phageFlight: `${ASSET_ROOT}/phages/phage-flight.png`,
  phageAttach: `${ASSET_ROOT}/phages/phage-attach.png`,
  shock: `${ASSET_ROOT}/hazards/beta-lactam-shock.png`,
  crack: `${ASSET_ROOT}/hazards/autolysin-crack.png`,
  rupture: `${ASSET_ROOT}/hazards/osmotic-rupture.png`,
  storm: `${ASSET_ROOT}/hazards/lysis-storm.png`,
  particle: `${ASSET_ROOT}/fx/fluorescent-particle.png`,
  flare: `${ASSET_ROOT}/fx/response-flare.png`,
  badges: `${ASSET_ROOT}/ui/run-badges.png`,
  cells: Object.fromEntries(SPECIES_ORDER.map((id) => [id, `${ASSET_ROOT}/cells/${id}.png`])),
  pickups: Object.fromEntries(Object.keys(PICKUPS).map((id) => [id, `${ASSET_ROOT}/pickups/${id}.png`])),
  responses: Object.fromEntries(Object.keys(RESPONSES).map((id) => [id, `${ASSET_ROOT}/ui/response-${id}.png`]))
} as const;

export function loadEnvelopeAssets(scene: Phaser.Scene): void {
  scene.load.image("env-background", ASSETS.background);
  scene.load.spritesheet("phage-flight", ASSETS.phageFlight, { frameWidth: 64, frameHeight: 64 });
  scene.load.spritesheet("phage-attach", ASSETS.phageAttach, { frameWidth: 64, frameHeight: 64 });
  scene.load.spritesheet("hazard-shock", ASSETS.shock, { frameWidth: 96, frameHeight: 96 });
  scene.load.spritesheet("hazard-crack", ASSETS.crack, { frameWidth: 128, frameHeight: 64 });
  scene.load.spritesheet("hazard-rupture", ASSETS.rupture, { frameWidth: 128, frameHeight: 128 });
  scene.load.spritesheet("hazard-storm", ASSETS.storm, { frameWidth: 128, frameHeight: 128 });
  scene.load.spritesheet("fx-particle", ASSETS.particle, { frameWidth: 32, frameHeight: 32 });
  scene.load.spritesheet("fx-flare", ASSETS.flare, { frameWidth: 128, frameHeight: 128 });
  scene.load.spritesheet("ui-badges", ASSETS.badges, { frameWidth: 64, frameHeight: 64 });
  SPECIES_ORDER.forEach((id) => scene.load.spritesheet(SPECIES[id].sheet, ASSETS.cells[id], { frameWidth: 64, frameHeight: 64 }));
  Object.values(PICKUPS).forEach((pickup) => scene.load.spritesheet(pickup.sheet, ASSETS.pickups[pickup.id], { frameWidth: 48, frameHeight: 48 }));
  Object.values(RESPONSES).forEach((response) => scene.load.spritesheet(response.icon, ASSETS.responses[response.id], { frameWidth: 64, frameHeight: 64 }));
}

export function createEnvelopeAnimations(scene: Phaser.Scene): void {
  Object.values(SPECIES).forEach((species) => {
    createAnimation(scene, `${species.sheet}-idle`, species.sheet, [0, 1, 2, 3], 8, -1);
    createAnimation(scene, `${species.sheet}-hurt`, species.sheet, [4, 5], 12, 0);
    createAnimation(scene, `${species.sheet}-lysis`, species.sheet, [6, 7, 8, 9], 12, 0);
  });
  createAnimation(scene, "phage-flight", "phage-flight", [0, 1, 2, 3, 4, 5], 12, -1);
  createAnimation(scene, "phage-attach", "phage-attach", [0, 1, 2, 3], 10, 0);
  createAnimation(scene, "pickup-pg-spin", PICKUPS.pg.sheet, [0, 1, 2, 3], 9, -1);
  createAnimation(scene, "pickup-lipid-spin", PICKUPS.lipid.sheet, [0, 1, 2, 3], 9, -1);
  createAnimation(scene, "pickup-restraint-spin", PICKUPS.restraint.sheet, [0, 1, 2, 3], 9, -1);
  createAnimation(scene, "hazard-shock-pulse", "hazard-shock", [0, 1, 2, 3], 10, -1);
  createAnimation(scene, "hazard-crack-live", "hazard-crack", [0, 1, 2, 3], 10, -1);
  createAnimation(scene, "hazard-rupture-live", "hazard-rupture", [0, 1, 2, 3], 9, -1);
  createAnimation(scene, "hazard-storm-live", "hazard-storm", [0, 1, 2, 3], 11, -1);
  createAnimation(scene, "fx-flare-burst", "fx-flare", [0, 1, 2, 3, 4, 5], 14, 0);
}

function createAnimation(scene: Phaser.Scene, key: string, texture: string, frames: number[], frameRate: number, repeat: number): void {
  if (scene.anims.exists(key)) return;
  scene.anims.create({
    key,
    frames: frames.map((frame) => ({ key: texture, frame })),
    frameRate,
    repeat
  });
}
