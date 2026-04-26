import type PhaserTypes from "phaser";
import * as PhaserRuntime from "phaser/dist/phaser.esm.min.js";
import { createEnvelopeAnimations, loadEnvelopeAssets } from "./assets";
import { PHASES, PICKUPS, RESPONSES, SPECIES, WORLD } from "./content";
import { createLeaderboardClient } from "./leaderboard";
import {
  createGameState,
  createInputState,
  getHudSnapshot,
  getRunReport,
  serializeScoreEntry,
  setPaused,
  startRun,
  triggerResponse,
  updateSimulation
} from "./simulation";
import type { GameEvent, GameState, HudSnapshot, LeaderboardPayload, RunReport } from "./types";
import type { createAudioController } from "./audio";

type AudioController = ReturnType<typeof createAudioController>;
const Phaser = PhaserRuntime as unknown as typeof PhaserTypes;

interface GameUi {
  showMenu(state: GameState): void;
  showPlaying(state: GameState): void;
  showPaused(snapshot: HudSnapshot): void;
  showGameOver(report: RunReport): void;
  updateHud(snapshot: HudSnapshot): void;
  renderScores(payload: LeaderboardPayload): void;
  showToast(title: string, copy?: string): void;
}

export interface EnvelopeGameController {
  game: Phaser.Game;
  state: GameState;
  startRun(mode: string, speciesId: string, playerName: string): void;
  restart(): void;
  togglePause(): void;
  triggerResponse(choiceId: string): boolean;
  refreshScores(board?: string): Promise<LeaderboardPayload>;
  destroy(): void;
}

export function createEnvelopeGame({
  parent,
  ui,
  leaderboardUrl = "",
  reducedMotion = false,
  audio
}: {
  parent: HTMLElement;
  ui: GameUi;
  leaderboardUrl?: string;
  reducedMotion?: boolean;
  audio: AudioController;
}): EnvelopeGameController {
  const state = createGameState();
  const inputState = createInputState();
  const leaderboard = createLeaderboardClient({ url: leaderboardUrl });
  let activePlayScene: PlayScene | null = null;
  let controller: EnvelopeGameController;

  class BootScene extends Phaser.Scene {
    constructor() {
      super("BootScene");
    }

    preload(): void {
      loadEnvelopeAssets(this);
    }

    create(): void {
      createEnvelopeAnimations(this);
      this.scene.start("MenuScene");
    }
  }

  class MenuScene extends Phaser.Scene {
    constructor() {
      super("MenuScene");
    }

    create(): void {
      this.add.image(WORLD.width / 2, WORLD.height / 2, "env-background").setDisplaySize(WORLD.width, WORLD.height);
      const haze = this.add.graphics();
      haze.fillStyle(0x8ef4ff, 0.08);
      haze.fillCircle(WORLD.width * 0.65, WORLD.height * 0.48, 260);
      haze.lineStyle(2, 0xa8f7ef, 0.12);
      for (let index = 0; index < 9; index += 1) {
        haze.strokeEllipse(WORLD.width * 0.65, WORLD.height * 0.48, 280 + index * 34, 160 + index * 26);
      }
      const sprite = this.add.sprite(WORLD.width * 0.67, WORLD.height * 0.5, SPECIES.ecoli.sheet).setScale(3.3).setDepth(3);
      sprite.play(`${SPECIES.ecoli.sheet}-idle`);
      this.tweens.add({ targets: sprite, angle: 360, duration: 18000, repeat: -1 });
      this.add.text(WORLD.width * 0.07, WORLD.height * 0.2, "Envelope Escape", {
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "78px",
        color: "#f2fbff"
      });
      this.add.text(WORLD.width * 0.07, WORLD.height * 0.31, "Stress Test Chamber", {
        fontFamily: "Manrope, sans-serif",
        fontSize: "26px",
        color: "#aeeaf0"
      });
      this.add.text(WORLD.width * 0.07, WORLD.height * 0.39, "A hidden top-down arcade assay for bacterial envelope survival.", {
        fontFamily: "Manrope, sans-serif",
        fontSize: "24px",
        color: "#d7f6fa",
        wordWrap: { width: 560 }
      });
      ui.showMenu(state);
      void refreshScores("classic");
    }
  }

  class PlayScene extends Phaser.Scene {
    private maps: Record<string, Map<string, Phaser.GameObjects.Sprite>> = {};
    private player!: Phaser.GameObjects.Sprite;
    private fieldGraphics!: Phaser.GameObjects.Graphics;
    private warningGraphics!: Phaser.GameObjects.Graphics;
    private keys!: Record<string, Phaser.Input.Keyboard.Key>;
    private hasEnded = false;

    constructor() {
      super("PlayScene");
    }

    create(data: { mode?: string; speciesId?: string; playerName?: string }): void {
      activePlayScene = this;
      this.hasEnded = false;
      startRun(state, data);
      this.maps = {
        pickups: new Map(),
        phages: new Map(),
        shocks: new Map(),
        cracks: new Map(),
        ruptures: new Map(),
        storms: new Map()
      };
      this.add.image(WORLD.width / 2, WORLD.height / 2, "env-background").setDisplaySize(WORLD.width, WORLD.height);
      this.fieldGraphics = this.add.graphics().setDepth(2);
      this.warningGraphics = this.add.graphics().setDepth(18);
      this.player = this.add.sprite(state.player.x, state.player.y, SPECIES[state.speciesId].sheet).setScale(1.22).setDepth(40);
      this.player.play(`${SPECIES[state.speciesId].sheet}-idle`);
      this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
      this.keys = this.input.keyboard?.addKeys({
        up: "W",
        down: "S",
        left: "A",
        right: "D",
        up2: "UP",
        down2: "DOWN",
        left2: "LEFT",
        right2: "RIGHT",
        dash: "SHIFT",
        patch: "ONE",
        purge: "TWO",
        boost: "THREE",
        pause: "P",
        escape: "ESC"
      }) as Record<string, Phaser.Input.Keyboard.Key>;
      this.input.on("pointerdown", () => {
        inputState.pointerActive = true;
      });
      this.input.on("pointerup", () => {
        inputState.pointerActive = false;
      });
      this.input.on("pointerout", () => {
        inputState.pointerActive = false;
      });
      ui.showPlaying(state);
      void refreshScores(state.board);
      audio.play("phase");
    }

    update(_: number, deltaMs: number): void {
      this.syncInput();
      const events = updateSimulation(state, inputState, deltaMs / 1000);
      this.renderField();
      this.renderTelegraphs();
      this.syncPlayer();
      this.syncEntities();
      this.handleEvents(events);
      ui.updateHud(getHudSnapshot(state));
      if (state.status === "ended" && !this.hasEnded) {
        this.hasEnded = true;
        void this.finishRun();
      }
    }

    syncInput(): void {
      inputState.up = Boolean(this.keys.up?.isDown || this.keys.up2?.isDown);
      inputState.down = Boolean(this.keys.down?.isDown || this.keys.down2?.isDown);
      inputState.left = Boolean(this.keys.left?.isDown || this.keys.left2?.isDown);
      inputState.right = Boolean(this.keys.right?.isDown || this.keys.right2?.isDown);
      inputState.dash = Boolean(this.keys.dash && Phaser.Input.Keyboard.JustDown(this.keys.dash));
      if (this.keys.patch && Phaser.Input.Keyboard.JustDown(this.keys.patch)) controller.triggerResponse("patch");
      if (this.keys.purge && Phaser.Input.Keyboard.JustDown(this.keys.purge)) controller.triggerResponse("purge");
      if (this.keys.boost && Phaser.Input.Keyboard.JustDown(this.keys.boost)) controller.triggerResponse("boost");
      if ((this.keys.pause && Phaser.Input.Keyboard.JustDown(this.keys.pause)) || (this.keys.escape && Phaser.Input.Keyboard.JustDown(this.keys.escape))) controller.togglePause();
      const pointer = this.input.activePointer;
      if (pointer.isDown) {
        inputState.pointerActive = true;
        inputState.pointerX = pointer.worldX;
        inputState.pointerY = pointer.worldY;
      }
    }

    renderField(): void {
      const phase = PHASES[state.phaseIndex] || PHASES[0];
      this.fieldGraphics.clear();
      this.fieldGraphics.fillStyle(phase.tint, 0.16);
      this.fieldGraphics.fillRect(0, 0, WORLD.width, WORLD.height);
      this.fieldGraphics.lineStyle(2, 0xaaf6ef, 0.075);
      for (let y = 118; y < WORLD.height; y += 82) {
        this.fieldGraphics.beginPath();
        for (let x = -40; x <= WORLD.width + 40; x += 80) {
          const offset = Math.sin(x * 0.014 + state.elapsed * 0.72 + y * 0.01) * 14;
          if (x <= -40) this.fieldGraphics.moveTo(x, y + offset);
          else this.fieldGraphics.lineTo(x, y + offset);
        }
        this.fieldGraphics.strokePath();
      }
      this.fieldGraphics.lineStyle(1, 0x74d7e8, 0.06);
      for (let x = 80; x < WORLD.width; x += 120) {
        this.fieldGraphics.lineBetween(x, 90, x + Math.sin(state.elapsed + x) * 32, WORLD.height - 90);
      }
    }

    renderTelegraphs(): void {
      this.warningGraphics.clear();
      this.warningGraphics.lineStyle(3, 0xffe1a3, 0.42);
      state.entities.phages.forEach((phage) => {
        if (phage.warning > 0) this.warningGraphics.strokeCircle(phage.x, phage.y, 42 + Math.sin(state.elapsed * 12) * 6);
      });
      state.entities.shocks.forEach((shock) => {
        if (shock.warning <= 0) return;
        this.warningGraphics.fillStyle(0x8fefff, 0.08 + shock.warning * 0.08);
        if (shock.axis === "x") this.warningGraphics.fillRect(shock.position - shock.thickness / 2, 0, shock.thickness, WORLD.height);
        else this.warningGraphics.fillRect(0, shock.position - shock.thickness / 2, WORLD.width, shock.thickness);
      });
      state.entities.cracks.forEach((crack) => {
        if (crack.warning <= 0) return;
        this.warningGraphics.lineStyle(Math.max(5, crack.width), 0xffcf8d, 0.26 + crack.warning * 0.18);
        this.warningGraphics.lineBetween(crack.x1, crack.y1, crack.x2, crack.y2);
      });
      [...state.entities.ruptures, ...state.entities.storms].forEach((zone) => {
        if (zone.warning <= 0) return;
        this.warningGraphics.lineStyle(4, zone.kind === "storm" ? 0xff7895 : 0xffc694, 0.42);
        this.warningGraphics.strokeCircle(zone.x, zone.y, zone.maxRadius);
      });
    }

    syncPlayer(): void {
      const species = SPECIES[state.speciesId];
      this.player.setTexture(species.sheet);
      if (!this.player.anims.isPlaying || !this.player.anims.currentAnim?.key.startsWith(species.sheet)) this.player.play(`${species.sheet}-idle`);
      this.player.setPosition(state.player.x, state.player.y);
      this.player.setRotation(state.player.angle);
      this.player.setAlpha(state.invulnerableTimer > 0 ? 0.78 + Math.sin(state.elapsed * 24) * 0.12 : 1);
      this.player.setScale(state.boostTimer > 0 ? 1.34 : 1.22);
    }

    syncEntities(): void {
      syncSpriteList(this, this.maps.pickups, state.entities.pickups, (entity) => {
        const sprite = this.add.sprite(entity.x, entity.y, PICKUPS[entity.type].sheet).setDepth(14);
        sprite.play(`pickup-${entity.type}-spin`);
        return sprite;
      }, (sprite, entity) => {
        sprite.setPosition(entity.x, entity.y);
        sprite.setScale(1 + Math.sin(entity.age * 4) * 0.05);
      });
      syncSpriteList(this, this.maps.phages, state.entities.phages, (entity) => this.add.sprite(entity.x, entity.y, "phage-flight").setDepth(24).play("phage-flight"), (sprite, entity) => {
        sprite.setPosition(entity.x, entity.y);
        sprite.setAlpha(entity.warning > 0 ? 0.38 : 1);
        sprite.setRotation(Math.atan2(entity.vy || 1, entity.vx || 1) + Math.PI / 2);
      });
      syncSpriteList(this, this.maps.shocks, state.entities.shocks, () => this.add.sprite(0, 0, "hazard-shock").setDepth(10).play("hazard-shock-pulse"), (sprite, entity) => {
        sprite.setAlpha(entity.warning > 0 ? 0.28 : 0.76);
        if (entity.axis === "x") {
          sprite.setPosition(entity.position, WORLD.height / 2);
          sprite.setDisplaySize(entity.thickness, WORLD.height);
        } else {
          sprite.setPosition(WORLD.width / 2, entity.position);
          sprite.setDisplaySize(WORLD.width, entity.thickness);
        }
      });
      syncSpriteList(this, this.maps.cracks, state.entities.cracks, () => this.add.sprite(0, 0, "hazard-crack").setDepth(12).play("hazard-crack-live"), (sprite, entity) => {
        const cx = (entity.x1 + entity.x2) / 2;
        const cy = (entity.y1 + entity.y2) / 2;
        const length = Phaser.Math.Distance.Between(entity.x1, entity.y1, entity.x2, entity.y2);
        sprite.setPosition(cx, cy);
        sprite.setRotation(Phaser.Math.Angle.Between(entity.x1, entity.y1, entity.x2, entity.y2));
        sprite.setDisplaySize(length, Math.max(24, entity.width * 2.5));
        sprite.setAlpha(entity.warning > 0 ? 0.36 : 0.92);
      });
      syncSpriteList(this, this.maps.ruptures, state.entities.ruptures, (entity) => this.add.sprite(entity.x, entity.y, "hazard-rupture").setDepth(11).play("hazard-rupture-live"), (sprite, entity) => {
        sprite.setPosition(entity.x, entity.y).setDisplaySize(entity.radius * 2, entity.radius * 2).setAlpha(entity.warning > 0 ? 0.28 : 0.68);
      });
      syncSpriteList(this, this.maps.storms, state.entities.storms, (entity) => this.add.sprite(entity.x, entity.y, "hazard-storm").setDepth(9).play("hazard-storm-live"), (sprite, entity) => {
        sprite.setPosition(entity.x, entity.y).setDisplaySize(entity.radius * 2, entity.radius * 2).setAlpha(entity.warning > 0 ? 0.22 : 0.52);
      });
    }

    handleEvents(events: GameEvent[]): void {
      events.forEach((event) => {
        if (event.type === "damage") {
          this.flashAt(event.x || state.player.x, event.y || state.player.y, 0xff7895);
          if (!reducedMotion) this.cameras.main.shake(130, 0.006);
          this.player.play(`${SPECIES[state.speciesId].sheet}-hurt`, true);
          void audio.play("damage");
        } else if (event.type === "pickup") {
          this.floatText(event.x || state.player.x, event.y || state.player.y, event.label || "Module", "#d7fff3");
          this.flashAt(event.x || state.player.x, event.y || state.player.y, 0xb8ffdf, 0.7);
          void audio.play("pickup");
        } else if (event.type === "assembly") {
          this.floatText(event.x || state.player.x, (event.y || state.player.y) - 42, "Assembly complete", "#b8ffdf");
          this.flashAt(event.x || state.player.x, event.y || state.player.y, 0xb8ffdf, 1.6);
          if (!reducedMotion) this.cameras.main.shake(100, 0.004);
        } else if (event.type === "response") {
          this.floatText(event.x || state.player.x, (event.y || state.player.y) - 50, event.label || "Response", "#fff0bd");
          this.flashAt(event.x || state.player.x, event.y || state.player.y, 0xffe1a3, 2.2);
          if (!reducedMotion) this.cameras.main.shake(170, 0.007);
          void audio.play("response");
        } else if (event.type === "phase") {
          ui.showToast(event.title || "Phase shift", event.copy || "");
          if (!reducedMotion) this.cameras.main.flash(160, 80, 190, 210);
          void audio.play("phase");
        } else if (event.type === "objective" || event.type === "objective-complete") {
          ui.showToast(event.title || "Objective", event.copy || "");
          void audio.play(event.type === "objective-complete" ? "objective" : "phase");
        } else if (event.type === "dash") {
          this.flashAt(event.x || state.player.x, event.y || state.player.y, 0xffdc9a, 0.42);
          void audio.play("dash");
        }
      });
    }

    flashAt(x: number, y: number, color: number, scale = 1): void {
      const flare = this.add.sprite(x, y, "fx-flare").setDepth(48).setTint(color).setScale(scale);
      flare.play("fx-flare-burst");
      this.tweens.add({ targets: flare, alpha: 0, scale: scale * 1.8, duration: reducedMotion ? 140 : 380, onComplete: () => flare.destroy() });
    }

    floatText(x: number, y: number, text: string, color: string): void {
      const label = this.add.text(x, y, text, { fontFamily: "Manrope, sans-serif", fontSize: "24px", fontStyle: "700", color }).setOrigin(0.5).setDepth(55);
      this.tweens.add({ targets: label, y: y - 46, alpha: 0, duration: reducedMotion ? 240 : 760, onComplete: () => label.destroy() });
    }

    async finishRun(): Promise<void> {
      this.player.play(`${SPECIES[state.speciesId].sheet}-lysis`, true);
      void audio.play("lysis");
      ui.showGameOver(getRunReport(state));
      const payload = await leaderboard.submit(serializeScoreEntry(state));
      const report = getRunReport(state, { rank: payload.rank, mode: payload.mode, totalEntries: payload.totalEntries });
      ui.showGameOver(report);
      ui.renderScores(payload);
      this.scene.start("GameOverScene", { report });
    }
  }

  class GameOverScene extends Phaser.Scene {
    constructor() {
      super("GameOverScene");
    }

    create(data: { report?: RunReport }): void {
      this.add.image(WORLD.width / 2, WORLD.height / 2, "env-background").setDisplaySize(WORLD.width, WORLD.height);
      this.add.rectangle(WORLD.width / 2, WORLD.height / 2, WORLD.width, WORLD.height, 0x050d18, 0.54);
      this.add.text(WORLD.width * 0.08, WORLD.height * 0.22, "Cell lysis", { fontFamily: "Fraunces, Georgia, serif", fontSize: "76px", color: "#f2fbff" });
      this.add.text(WORLD.width * 0.08, WORLD.height * 0.34, `${data.report?.score.toLocaleString() || 0} points - ${data.report?.phaseReached || "Run complete"}`, { fontFamily: "Manrope, sans-serif", fontSize: "28px", color: "#b8eff5" });
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: WORLD.width,
    height: WORLD.height,
    backgroundColor: "#06101b",
    scene: [BootScene, MenuScene, PlayScene, GameOverScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true, transparent: false }
  });

  async function refreshScores(board = state.board): Promise<LeaderboardPayload> {
    const payload = await leaderboard.refresh(board);
    ui.renderScores(payload);
    return payload;
  }

  controller = {
    game,
    state,
    startRun(mode: string, speciesId: string, playerName: string): void {
      game.scene.stop("MenuScene");
      game.scene.stop("GameOverScene");
      game.scene.start("PlayScene", { mode, speciesId, playerName });
    },
    restart(): void {
      this.startRun(state.mode, state.selectedSpeciesId, state.playerName);
    },
    togglePause(): void {
      if (state.status === "running") {
        setPaused(state, true);
        game.scene.pause("PlayScene");
        ui.showPaused(getHudSnapshot(state));
      } else if (state.status === "paused") {
        setPaused(state, false);
        game.scene.resume("PlayScene");
        ui.showPlaying(state);
      }
    },
    triggerResponse(choiceId: string): boolean {
      const ok = triggerResponse(state, choiceId);
      if (ok && activePlayScene) {
        activePlayScene.handleEvents(state.lastEvents);
        ui.updateHud(getHudSnapshot(state));
      }
      return ok;
    },
    refreshScores,
    destroy(): void {
      game.destroy(true);
    }
  };

  return controller;
}

function syncSpriteList<T extends { id: string }>(
  scene: Phaser.Scene,
  spriteMap: Map<string, Phaser.GameObjects.Sprite>,
  entities: T[],
  createSprite: (entity: T) => Phaser.GameObjects.Sprite,
  updateSprite: (sprite: Phaser.GameObjects.Sprite, entity: T) => void
): void {
  const activeIds = new Set<string>();
  entities.forEach((entity) => {
    activeIds.add(entity.id);
    let sprite = spriteMap.get(entity.id);
    if (!sprite) {
      sprite = createSprite(entity);
      spriteMap.set(entity.id, sprite);
    }
    updateSprite(sprite, entity);
  });
  spriteMap.forEach((sprite, id) => {
    if (!activeIds.has(id)) {
      sprite.destroy();
      spriteMap.delete(id);
    }
  });
}
