const $t = {
  width: 120,
  depth: 70,
  safeMargin: 3.2
}, Es = [
  {
    id: "microscopeSlide",
    label: "Microscope slide staging area",
    shortLabel: "Slide",
    bounds: { x: -42, z: 22, width: 34, depth: 20 },
    color: 7200236,
    accent: 14089215,
    objectiveHint: "Practice movement, then push toward the pipette zone."
  },
  {
    id: "pipetteZone",
    label: "Research Plus pipette lane",
    shortLabel: "Pipette",
    bounds: { x: -39, z: -20, width: 42, depth: 20 },
    color: 7658726,
    accent: 2788004,
    objectiveHint: "Route through droplet pulses and collect sterile tips."
  },
  {
    id: "petriDish",
    label: "Petri dish plaque assay",
    shortLabel: "Petri dish",
    bounds: { x: 11, z: -22, width: 34, depth: 26 },
    color: 15975032,
    accent: 10249520,
    objectiveHint: "Clear plaques before the phage bloom overtakes the agar."
  },
  {
    id: "fernbachFlask",
    label: "Fernbach flask media current",
    shortLabel: "Fernbach",
    bounds: { x: -6, z: 6, width: 30, depth: 20 },
    color: 10216664,
    accent: 2783343,
    objectiveHint: "Use membrane repair to cross swirling spill currents."
  },
  {
    id: "centrifuge",
    label: "Centrifuge rotor hazard",
    shortLabel: "Centrifuge",
    bounds: { x: 42, z: 8, width: 36, depth: 28 },
    color: 9549823,
    accent: 3889038,
    objectiveHint: "Time motility bursts through the rotor sweep."
  },
  {
    id: "tubeRack",
    label: "Test tube rack maze",
    shortLabel: "Tube rack",
    bounds: { x: 15, z: 26, width: 38, depth: 20 },
    color: 15771845,
    accent: 8207704,
    objectiveHint: "Thread between tubes and seal rupture points."
  }
], ka = [
  {
    id: "slide-start",
    kind: "microscopeSlide",
    label: "Microscope slide",
    zoneId: "microscopeSlide",
    x: -44,
    z: 22,
    width: 26,
    depth: 13,
    height: 0.14
  },
  {
    id: "research-plus-pipette",
    kind: "pipette",
    label: "Oversized Research Plus pipette",
    zoneId: "pipetteZone",
    x: -42,
    z: -29,
    width: 38,
    depth: 4,
    height: 2.5,
    angle: -0.12,
    collision: [{ type: "box", x: -42, z: -29, width: 34, depth: 4.2 }]
  },
  {
    id: "sterile-tip-box",
    kind: "tipBox",
    label: "Sterile pipette tip box",
    zoneId: "pipetteZone",
    x: -22,
    z: -11,
    width: 11,
    depth: 8,
    height: 2.1,
    collision: [{ type: "box", x: -22, z: -11, width: 10.5, depth: 7.5 }]
  },
  {
    id: "plaque-assay-dish",
    kind: "petriDish",
    label: "Plaque assay petri dish",
    zoneId: "petriDish",
    x: 11,
    z: -22,
    width: 27,
    depth: 27,
    height: 0.6,
    radius: 13.5
  },
  {
    id: "fernbach-flask",
    kind: "fernbachFlask",
    label: "Fernbach flask",
    zoneId: "fernbachFlask",
    x: -7,
    z: 4,
    width: 16,
    depth: 16,
    height: 9,
    radius: 8,
    collision: [{ type: "circle", x: -7, z: 4, radius: 6.4 }]
  },
  {
    id: "media-spill",
    kind: "spill",
    label: "Media spill",
    zoneId: "fernbachFlask",
    x: 6,
    z: 10,
    width: 16,
    depth: 9,
    height: 0.08
  },
  {
    id: "bench-centrifuge",
    kind: "centrifuge",
    label: "Centrifuge rotor",
    zoneId: "centrifuge",
    x: 42,
    z: 8,
    width: 25,
    depth: 25,
    height: 4.2,
    radius: 12.5,
    collision: [{ type: "circle", x: 42, z: 8, radius: 4.2 }]
  },
  {
    id: "tube-rack",
    kind: "tubeRack",
    label: "Test tube rack",
    zoneId: "tubeRack",
    x: 15,
    z: 26,
    width: 28,
    depth: 13,
    height: 3.4,
    collision: [
      { type: "box", x: 7, z: 20, width: 4, depth: 8 },
      { type: "box", x: 15, z: 26, width: 4, depth: 8 },
      { type: "box", x: 23, z: 32, width: 4, depth: 8 }
    ]
  }
], Gh = [
  "ecoli",
  "paeruginosa",
  "saureus",
  "spneumoniae",
  "cglutamicum",
  "kpneumoniae",
  "abaumannii"
], kt = {
  ecoli: {
    id: "ecoli",
    label: "Escherichia coli",
    shortLabel: "E. coli",
    traitTitle: "Envelope homeostasis",
    traitCopy: "Balanced handling and faster command charging.",
    speed: 8.2,
    dashSpeed: 18,
    integrity: 100,
    repairGain: 1.08,
    commandGain: 1.12,
    damageTaken: 1,
    colorA: 8647149,
    colorB: 2917266,
    silhouette: "rod"
  },
  paeruginosa: {
    id: "paeruginosa",
    label: "Pseudomonas aeruginosa",
    shortLabel: "P. aeruginosa",
    traitTitle: "Fast swimmer",
    traitCopy: "Higher speed and longer dash recovery windows.",
    speed: 9.2,
    dashSpeed: 21,
    integrity: 96,
    repairGain: 1,
    commandGain: 1,
    damageTaken: 1,
    colorA: 8646856,
    colorB: 2387809,
    silhouette: "curved"
  },
  saureus: {
    id: "saureus",
    label: "Staphylococcus aureus",
    shortLabel: "S. aureus",
    traitTitle: "Thick wall",
    traitCopy: "Takes less damage but moves more deliberately.",
    speed: 7.2,
    dashSpeed: 15,
    integrity: 112,
    repairGain: 1.02,
    commandGain: 1,
    damageTaken: 0.84,
    colorA: 16766077,
    colorB: 9393954,
    silhouette: "coccus"
  },
  spneumoniae: {
    id: "spneumoniae",
    label: "Streptococcus pneumoniae",
    shortLabel: "S. pneumoniae",
    traitTitle: "Capsule buffering",
    traitCopy: "Command use briefly buffers follow-up damage.",
    speed: 7.5,
    dashSpeed: 16,
    integrity: 106,
    repairGain: 1.16,
    commandGain: 1,
    damageTaken: 0.94,
    colorA: 16758735,
    colorB: 8930143,
    silhouette: "diplococcus"
  },
  cglutamicum: {
    id: "cglutamicum",
    label: "Corynebacterium glutamicum",
    shortLabel: "C. glutamicum",
    traitTitle: "Layered envelope",
    traitCopy: "Autolysin and rupture damage is less punishing.",
    speed: 7.7,
    dashSpeed: 16,
    integrity: 104,
    repairGain: 1.08,
    commandGain: 1,
    damageTaken: 0.92,
    colorA: 12898815,
    colorB: 5200545,
    silhouette: "coryneform"
  },
  kpneumoniae: {
    id: "kpneumoniae",
    label: "Klebsiella pneumoniae",
    shortLabel: "K. pneumoniae",
    traitTitle: "Capsule retention",
    traitCopy: "Pickups drift toward the cell from farther away.",
    speed: 7.4,
    dashSpeed: 15.5,
    integrity: 108,
    repairGain: 1.06,
    commandGain: 1,
    damageTaken: 0.96,
    colorA: 9562843,
    colorB: 2653048,
    silhouette: "capsule"
  },
  abaumannii: {
    id: "abaumannii",
    label: "Acinetobacter baumannii",
    shortLabel: "A. baumannii",
    traitTitle: "Stress tolerant",
    traitCopy: "Near misses and survival charge commands faster.",
    speed: 8.4,
    dashSpeed: 18,
    integrity: 102,
    repairGain: 1,
    commandGain: 1.18,
    damageTaken: 0.98,
    colorA: 9559295,
    colorB: 2846616,
    silhouette: "shortRod"
  }
}, Th = {
  pg: {
    id: "pg",
    label: "PG synthesis",
    shortLabel: "PG",
    copy: "Builds wall material and scores for safe routing.",
    color: "#a8ffdf"
  },
  membrane: {
    id: "membrane",
    label: "Membrane repair",
    shortLabel: "Repair",
    copy: "Restores integrity and seals rupture pressure.",
    color: "#9ee9ff"
  },
  phage: {
    id: "phage",
    label: "Phage defense",
    shortLabel: "Defense",
    copy: "Clears attached phages and weakens swarms.",
    color: "#ffd68a"
  },
  motility: {
    id: "motility",
    label: "Motility",
    shortLabel: "Motility",
    copy: "Creates a fast evasive burst through stress fronts.",
    color: "#ffc0d2"
  }
}, pt = [
  {
    id: "slideTraining",
    title: "Slide calibration",
    objective: "Carry assay beads back to the slide checkpoint.",
    targetZone: "pipetteZone",
    startsAt: 0,
    target: 3,
    boss: "Microscope slide pressure pulse",
    tint: 734275,
    pressure: "Orientation"
  },
  {
    id: "pipettePulse",
    title: "Pipette pulse",
    objective: "Steal sterile tips and deposit them on the slide.",
    targetZone: "pipetteZone",
    startsAt: 30,
    target: 5,
    boss: "Timed reagent stream",
    tint: 1523032,
    pressure: "Droplet pressure"
  },
  {
    id: "petriBloom",
    title: "Plaque assay bloom",
    objective: "Tag plaques on the agar and purge clustered phage.",
    targetZone: "petriDish",
    startsAt: 78,
    target: 6,
    boss: "Expanding phage plaque",
    tint: 4011040,
    pressure: "Phage bloom"
  },
  {
    id: "fernbachCurrent",
    title: "Fernbach current",
    objective: "Carry reagent droplets through media currents and stabilize spills.",
    targetZone: "fernbachFlask",
    startsAt: 118,
    target: 5,
    boss: "Swirling media leak",
    tint: 1523513,
    pressure: "Media current"
  },
  {
    id: "centrifugeSweep",
    title: "Rotor crossing",
    objective: "Cross safe pockets, collect the sample, and escape spin-up.",
    targetZone: "centrifuge",
    startsAt: 130,
    target: 4,
    boss: "Rotor sweep",
    tint: 2569818,
    pressure: "Mechanical shear"
  },
  {
    id: "rackSeal",
    title: "Rack rupture route",
    objective: "Navigate the rack and seal three growing rupture sites.",
    targetZone: "tubeRack",
    startsAt: 190,
    target: 3,
    boss: "Tube-rack rupture cascade",
    tint: 5650007,
    pressure: "Wall rupture"
  },
  {
    id: "lysisStorm",
    title: "Final lysis storm",
    objective: "Chain deposits across the bench while surviving collapse.",
    targetZone: "microscopeSlide",
    startsAt: 260,
    target: 8,
    boss: "Whole-bench lysis storm",
    tint: 7220794,
    pressure: "Lytic collapse"
  }
], Na = {
  "ponA-overdrive": {
    id: "ponA-overdrive",
    title: "PBP1b overdrive",
    copy: "PG synthesis repairs more integrity and scores more during beta-lactam fronts.",
    command: "pg"
  },
  "lpoB-tether": {
    id: "lpoB-tether",
    title: "LpoB tethering",
    copy: "PG synthesis grants a brief shield after each wall cycle.",
    command: "pg"
  },
  "bactoprenol-flow": {
    id: "bactoprenol-flow",
    title: "Bactoprenol flow",
    copy: "Pickups add extra command charge and drift toward the cell.",
    command: "pg"
  },
  "omp-buffer": {
    id: "omp-buffer",
    title: "Outer-membrane buffer",
    copy: "Membrane repair reduces rupture-zone damage.",
    command: "membrane"
  },
  "restriction-burst": {
    id: "restriction-burst",
    title: "Restriction burst",
    copy: "Phage defense clears a wider area and scores for every cleared phage.",
    command: "phage"
  },
  chemoreflex: {
    id: "chemoreflex",
    title: "Chemoreflex",
    copy: "Motility command lasts longer and dash cooldowns recover faster.",
    command: "motility"
  },
  "autolysin-brake": {
    id: "autolysin-brake",
    title: "Autolysin brake",
    copy: "Crack damage and breach growth slow after every command.",
    command: "membrane"
  },
  "capsule-surge": {
    id: "capsule-surge",
    title: "Capsule surge",
    copy: "Damage taken is lower while command charge is above half.",
    command: "membrane"
  },
  "mreB-alignment": {
    id: "mreB-alignment",
    title: "MreB alignment",
    copy: "Movement is cleaner and near misses add score.",
    command: "motility"
  }
}, yd = "bernhardt-envelope-escape-v3-sound";
function Zh() {
  let i = null, e = Bh();
  function t(s) {
    e = s;
    try {
      window.localStorage.setItem(yd, e ? "on" : "off");
    } catch {
    }
  }
  function n(s) {
    if (!e) return;
    i = i || new AudioContext(), i.state === "suspended" && i.resume();
    const a = i.currentTime;
    ({
      pickup: [660, 880],
      damage: [220, 120],
      dash: [360, 620],
      command: [260, 520, 980],
      phase: [196, 294, 392],
      upgrade: [440, 660, 990],
      lysis: [180, 120, 80]
    })[s].forEach((o, l) => {
      if (!i) return;
      const c = i.createOscillator(), d = i.createGain(), u = a + l * 0.055;
      c.type = s === "damage" || s === "lysis" ? "sawtooth" : "sine", c.frequency.setValueAtTime(o, u), d.gain.setValueAtTime(1e-4, u), d.gain.exponentialRampToValueAtTime(s === "phase" ? 0.045 : 0.075, u + 0.012), d.gain.exponentialRampToValueAtTime(1e-4, u + 0.14), c.connect(d), d.connect(i.destination), c.start(u), c.stop(u + 0.16);
    });
  }
  return {
    get enabled() {
      return e;
    },
    setEnabled: t,
    play: n
  };
}
function Bh() {
  try {
    return window.localStorage.getItem(yd) === "on";
  } catch {
    return !1;
  }
}
function Or(i) {
  let e = 2166136261;
  for (let t = 0; t < i.length; t += 1)
    e ^= i.charCodeAt(t), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function Jr(i) {
  let e = i >>> 0;
  return () => {
    e += 1831565813;
    let t = e;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function ti(i, e, t) {
  return e + (t - e) * i();
}
function an(i, e) {
  return e[Math.max(0, Math.min(e.length - 1, Math.floor(i() * e.length)))];
}
const Nh = /^(classic|daily-\d{4}-\d{2}-\d{2})$/, Eh = Object.keys(Na), Fh = "America/New_York", Kr = pt.length - 1, Ys = Object.fromEntries(Es.map((i) => [i.id, i])), _a = {
  pipetteTip: "sterile tip",
  reagentDroplet: "reagent droplet",
  agarPlug: "agar plug",
  mediaBead: "media bead"
}, Wh = {
  microscopeSlide: ["mediaBead", "agarPlug"],
  pipetteZone: ["pipetteTip", "reagentDroplet"],
  petriDish: ["agarPlug", "mediaBead"],
  fernbachFlask: ["reagentDroplet", "mediaBead"],
  centrifuge: ["pipetteTip", "mediaBead"],
  tubeRack: ["pipetteTip", "reagentDroplet"]
};
let jr = 1;
function Vh() {
  return { moveX: 0, moveZ: 0, dash: !1, commandWheel: !1 };
}
function Lh(i) {
  return typeof i == "string" && Object.prototype.hasOwnProperty.call(kt, i) ? i : "ecoli";
}
function di(i) {
  const e = String(i || "").trim().toLowerCase();
  return Nh.test(e) ? e : "classic";
}
function Zl(i) {
  return String(i || "").replace(/[^\w .'-]/g, "").replace(/\s+/g, " ").trim().slice(0, 24) || "Anonymous";
}
class Uh {
  state;
  random;
  constructor() {
    this.random = Jr(1), this.state = Bl();
  }
  start(e = {}) {
    const t = e.mode === "daily" ? "daily" : "classic", n = Lh(e.speciesId || this.state.selectedSpeciesId), s = t === "daily" ? Oh() : "classic", a = Or(t === "daily" ? `envelope-v3-lab-bench-${s}-${n}` : `envelope-v3-lab-bench-${n}-${Date.now()}-${Math.random()}`);
    this.random = Jr(a);
    const r = kt[n];
    Object.assign(this.state, Bl(), {
      status: "briefing",
      previousStatus: "briefing",
      mode: t,
      board: s,
      selectedSpeciesId: n,
      speciesId: n,
      playerName: Zl(e.playerName),
      seed: a,
      integrity: r.integrity
    }), this.state.effects.push(Ft("phase", this.state.player.x, this.state.player.z, "Lab bench online"));
    for (let o = 0; o < 10; o += 1) this.spawnPickup(an(this.random, ["microscopeSlide", "pipetteZone", "fernbachFlask"]));
  }
  beginRun() {
    (this.state.status === "briefing" || this.state.status === "menu") && (this.state.status = "running", this.state.previousStatus = "running");
  }
  togglePause() {
    this.state.status === "running" || this.state.status === "command" ? (this.state.previousStatus = this.state.status, this.state.status = "paused") : this.state.status === "paused" && (this.state.status = this.state.previousStatus === "command" ? "command" : "running");
  }
  setCommandWheel(e) {
    if (e && this.state.status === "running") {
      this.state.status = "command";
      return;
    }
    !e && this.state.status === "command" && (this.state.status = "running");
  }
  chooseUpgrade(e) {
    if (!(this.state.status !== "upgrade" || !this.state.upgradeChoices.includes(e))) {
      this.state.upgrades.push(e), this.state.upgradeChoices = [], this.state.phaseProgress = 0, this.state.phaseTime = 0, this.state.assembly = 0, this.state.carriedPickup = "", this.state.combo = 0, this.state.jobStage = 0, this.state.jobStep = "", this.state.phaseIndex = Math.min(this.state.phaseIndex + 1, Kr), this.state.status = "running", this.state.previousStatus = "running", this.state.effects.push(Ft("upgrade", this.state.player.x, this.state.player.z, Na[e].title));
      for (let t = 0; t < 4; t += 1) this.spawnPickup(pt[this.state.phaseIndex].targetZone);
    }
  }
  triggerCommand(e) {
    if (this.state.status !== "running" && this.state.status !== "command" || this.state.commandCharge < 100) return !1;
    const t = this.state, n = kt[t.speciesId];
    t.commandCharge = 0, t.status = "running", t.previousStatus = "running";
    const s = (r) => t.upgrades.includes(r);
    let a = 0;
    if (e === "pg") {
      const r = s("ponA-overdrive") ? 1.45 : 1;
      t.assembly += s("lpoB-tether") ? 2 : 1, t.integrity = Wt(t.integrity + 15 * n.repairGain * r, 0, n.integrity + 18), a = nr(t, t.player, 9.5, ["shock"]), t.score += 260 + a * 115, pt[t.phaseIndex].id === "rackSeal" && this.sealNearbyBreaks(["rupture", "crack"], "PG patch"), pt[t.phaseIndex].id === "lysisStorm" && yn(t, 0.4 + a * 0.2);
    } else e === "membrane" ? (t.integrity = Wt(t.integrity + 30 * n.repairGain, 0, n.integrity + 20), a = nr(t, t.player, s("omp-buffer") ? 12 : 9.2, ["rupture", "crack", "spill"]), t.score += 240 + a * 100, (pt[t.phaseIndex].id === "fernbachCurrent" || pt[t.phaseIndex].id === "rackSeal") && this.sealNearbyBreaks(["rupture", "crack", "spill"], "membrane seal"), pt[t.phaseIndex].id === "lysisStorm" && yn(t, 0.5 + a * 0.25)) : e === "phage" ? (a = nr(t, t.player, s("restriction-burst") ? 14.5 : 10.8, ["phage", "plaque"]), t.score += 200 + a * 160, pt[t.phaseIndex].id === "petriBloom" && yn(t, Math.max(1, a) * 0.8), pt[t.phaseIndex].id === "lysisStorm" && yn(t, Math.max(0.4, a * 0.25))) : (t.player.dashTimer = s("chemoreflex") ? 1.45 : 0.95, t.player.dashCooldown = 0, t.score += 260 + (t.zoneId === "centrifuge" ? 160 : 0), pt[t.phaseIndex].id === "centrifugeSweep" && t.zoneId === "centrifuge" && yn(t, 0.75));
    return t.effects.push(Ft("command", t.player.x, t.player.z, Th[e].shortLabel)), !0;
  }
  update(e, t) {
    if (this.state.status !== "running" && this.state.status !== "command") return;
    const n = Math.min(0.05, Math.max(0, t)) * (this.state.status === "command" ? 0.22 : 1);
    this.state.elapsed += n, this.state.phaseTime += n, this.state.score += n * (36 + this.state.phaseIndex * 14), this.state.commandCharge = Wt(this.state.commandCharge + n * 6.8 * kt[this.state.speciesId].commandGain * Hh(this.state), 0, 100), this.updatePlayer(e, n), this.state.zoneId = zh(this.state.player) || this.state.zoneId, this.updateObjective(n), this.updateSpawns(n), this.updatePickups(n), this.updateHazards(n), this.updateEffects(n), this.state.integrity <= 0 && this.endRun("envelope lysis");
  }
  hud() {
    const e = pt[this.state.phaseIndex], t = Ys[this.state.zoneId];
    return {
      status: this.state.status,
      score: Math.max(0, Math.round(this.state.score)),
      timeLabel: El(this.state.elapsed),
      integrity: Math.max(0, Math.round(this.state.integrity)),
      commandCharge: Math.round(this.state.commandCharge),
      phaseTitle: e.title,
      phasePressure: `${e.pressure} | ${t.shortLabel}`,
      zoneLabel: t.label,
      objective: e.objective,
      objectiveProgress: Math.min(Math.floor(this.state.phaseProgress), e.target),
      objectiveTarget: e.target,
      board: this.state.board,
      speciesLabel: kt[this.state.speciesId].label,
      upgradeCount: this.state.upgrades.length,
      carriedLabel: this.state.carriedPickup ? _a[this.state.carriedPickup] : "empty",
      comboLabel: this.state.combo > 1 ? `x${this.state.combo}` : "ready",
      nextHazardLabel: this.state.nextHazardLabel || "watch telegraphs",
      jobStep: this.state.jobStep || Nl(this.state)
    };
  }
  report() {
    const e = pt[this.state.phaseIndex];
    return {
      score: Math.max(0, Math.round(this.state.score)),
      speciesId: this.state.speciesId,
      speciesLabel: kt[this.state.speciesId].label,
      board: this.state.board,
      survived: El(this.state.elapsed),
      phaseReached: e.title,
      lysisCause: this.state.lysisCause || "cumulative lab-bench stress",
      upgrades: this.state.upgrades.map((t) => Na[t].title),
      completedAt: Date.now()
    };
  }
  scoreEntry(e) {
    return {
      name: Zl(e || this.state.playerName),
      score: Math.max(0, Math.round(this.state.score)),
      species: this.state.speciesId,
      playedAt: Date.now(),
      board: di(this.state.board)
    };
  }
  updatePlayer(e, t) {
    const n = this.state, s = kt[n.speciesId], a = Math.hypot(e.moveX, e.moveZ) || 1, r = e.moveX / a, o = e.moveZ / a;
    n.player.dashCooldown = Math.max(0, n.player.dashCooldown - t * (n.upgrades.includes("chemoreflex") ? 1.45 : 1)), n.player.dashTimer = Math.max(0, n.player.dashTimer - t);
    const l = n.player.dashTimer > 0 ? s.dashSpeed : s.speed;
    e.dash && n.player.dashCooldown <= 0 && Math.abs(e.moveX) + Math.abs(e.moveZ) > 0.1 && (n.player.dashTimer = 0.24, n.player.dashCooldown = 1.15, n.effects.push(Ft("dash", n.player.x, n.player.z, "Dash"))), n.player.vx = Fl(n.player.vx, r * l, 1 - Math.pow(1e-3, t)), n.player.vz = Fl(n.player.vz, o * l, 1 - Math.pow(1e-3, t)), n.player.x = Wt(n.player.x + n.player.vx * t, -120 / 2 + $t.safeMargin, $t.width / 2 - $t.safeMargin), n.player.z = Wt(n.player.z + n.player.vz * t, -70 / 2 + $t.safeMargin, $t.depth / 2 - $t.safeMargin), Ph(n);
  }
  updateObjective(e) {
    const t = pt[this.state.phaseIndex];
    this.state.jobStep = Nl(this.state), this.tryDepositCarriedResource(), t.id === "petriBloom" && this.tagNearbyPlaques(), t.id === "centrifugeSweep" && this.updateRotorCrossing(), t.id === "lysisStorm" && (this.state.score += e * (8 + this.state.combo * 2)), this.state.phaseIndex === Kr && this.state.phaseProgress >= t.target && (this.state.score += 700, this.state.phaseProgress = t.target * 0.55, this.state.effects.push(Ft("phase", this.state.player.x, this.state.player.z, "Storm held")));
  }
  updateSpawns(e) {
    const t = pt[this.state.phaseIndex], n = 1 + this.state.phaseIndex * 0.22 + Math.min(0.45, this.state.phaseTime / 160);
    this.tickTimer("pickup", e, Math.max(0.65, 1.9 - this.state.phaseIndex * 0.1), () => this.spawnPickup(this.random() > 0.65 ? this.state.zoneId : t.targetZone)), t.id === "slideTraining" ? (this.state.nextHazardLabel = "light slide pulses", this.tickTimer("droplet", e, 3.1, () => this.spawnHazard("droplet", "microscopeSlide"))) : t.id === "pipettePulse" ? (this.state.nextHazardLabel = "droplet lane incoming", this.tickTimer("droplet", e, Math.max(0.74, 1.9 / n), () => this.spawnHazard(an(this.random, ["droplet", "shock"]), "pipetteZone"))) : t.id === "petriBloom" ? (this.state.nextHazardLabel = "plaque seam expanding", this.tickTimer("phage", e, Math.max(0.85, 2 / n), () => this.spawnHazard(an(this.random, ["phage", "plaque"]), "petriDish"))) : t.id === "fernbachCurrent" ? (this.state.nextHazardLabel = "media current swelling", this.tickTimer("spill", e, Math.max(1.15, 2.8 / n), () => this.spawnHazard(an(this.random, ["spill", "droplet", "rupture"]), "fernbachFlask"))) : t.id === "centrifugeSweep" ? (this.state.nextHazardLabel = "rotor sweep window", this.tickTimer("rotor", e, Math.max(0.9, 2.5 / n), () => this.spawnHazard("rotor", "centrifuge")), this.tickTimer("shock", e, Math.max(1.3, 3.4 / n), () => this.spawnHazard("shock", "centrifuge"))) : t.id === "rackSeal" ? (this.state.nextHazardLabel = "rupture site growing", this.tickTimer("crack", e, Math.max(0.92, 2.7 / n), () => this.spawnHazard(an(this.random, ["crack", "rupture", "spill"]), "tubeRack"))) : (this.state.nextHazardLabel = "full bench collapse", this.tickTimer("phage", e, Math.max(0.7, 2 / n), () => this.spawnHazard(an(this.random, ["phage", "plaque", "shock"]), an(this.random, Es).id)), this.tickTimer("rupture", e, Math.max(0.85, 2.5 / n), () => this.spawnHazard(an(this.random, ["rupture", "shock", "phage", "spill", "rotor"]), an(this.random, Es).id))), this.tickTimer("boss", e, Math.max(10, 22 - this.state.phaseIndex * 1.8), () => {
      this.state.effects.push(Ft("phase", this.state.player.x, this.state.player.z, t.boss));
      const s = this.phaseHazards();
      for (let a = 0; a < 2 + this.state.phaseIndex; a += 1) this.spawnHazard(an(this.random, s), t.targetZone);
    });
  }
  phaseHazards() {
    const e = pt[this.state.phaseIndex].id;
    return e === "slideTraining" ? ["phage", "droplet"] : e === "pipettePulse" ? ["droplet", "shock"] : e === "petriBloom" ? ["phage", "plaque"] : e === "fernbachCurrent" ? ["spill", "droplet", "rupture"] : e === "centrifugeSweep" ? ["rotor", "shock"] : e === "rackSeal" ? ["crack", "rupture", "spill"] : ["phage", "shock", "rupture", "plaque", "spill"];
  }
  tickTimer(e, t, n, s) {
    this.state.timers[e] -= t, this.state.timers[e] <= 0 && (this.state.timers[e] = n * ti(this.random, 0.72, 1.18), s());
  }
  spawnPickup(e = pt[this.state.phaseIndex].targetZone) {
    const t = Ys[e], n = Wh[e], s = this.randomOpenPoint(t);
    this.state.pickups.push({
      id: jr++,
      kind: an(this.random, n),
      x: s.x,
      z: s.z,
      radius: 0.72,
      age: 0
    });
  }
  randomOpenPoint(e) {
    for (let t = 0; t < 24; t += 1) {
      const n = {
        x: ti(this.random, e.bounds.x - e.bounds.width / 2 + 3, e.bounds.x + e.bounds.width / 2 - 3),
        z: ti(this.random, e.bounds.z - e.bounds.depth / 2 + 3, e.bounds.z + e.bounds.depth / 2 - 3)
      };
      if (!Yh(n, 1.4)) return n;
    }
    return { x: e.bounds.x, z: e.bounds.z };
  }
  spawnHazard(e, t = pt[this.state.phaseIndex].targetZone) {
    const n = Ys[t], s = this.randomOpenPoint(n);
    let a = s.x, r = s.z, o = 0, l = 0, c = 1.1, d = 1.2, u = ti(this.random, -Math.PI, Math.PI), h = 1, g = 6, m = 12, A;
    if (e === "phage" || e === "droplet") {
      const f = this.random() > 0.5, p = this.random() > 0.5 ? 1 : -1;
      a = f ? n.bounds.x + p * n.bounds.width * 0.58 : ti(this.random, n.bounds.x - n.bounds.width / 2, n.bounds.x + n.bounds.width / 2), r = f ? ti(this.random, n.bounds.z - n.bounds.depth / 2, n.bounds.z + n.bounds.depth / 2) : n.bounds.z + p * n.bounds.depth * 0.58;
      const b = this.state.player.x - a, v = this.state.player.z - r, S = Math.hypot(b, v) || 1, R = e === "phage" ? 6.1 : 4.8;
      o = b / S * R, l = v / S * R, c = e === "phage" ? 0.7 : 0.95, h = e === "phage" ? 0.62 : 0.95, g = 6.6, m = e === "phage" ? 12 : 15, u = Math.atan2(l, o);
    } else if (e === "shock") {
      d = 1.35, c = 14, h = 1.15, g = 6.3, m = 18;
      const f = u + Math.PI / 2;
      o = Math.cos(f) * 1.5, l = Math.sin(f) * 1.5;
    } else if (e === "rotor") {
      const f = ka.find((p) => p.id === "bench-centrifuge");
      a = f?.x ?? n.bounds.x, r = f?.z ?? n.bounds.z, c = 13.2, d = 1.4, h = 0.8, g = 5.4, m = 19, A = (this.random() > 0.5 ? 1 : -1) * ti(this.random, 1.8, 2.8);
    } else e === "crack" ? (d = ti(this.random, 9, 16), c = 8, h = 1.25, g = 7, m = 16) : (e === "rupture" || e === "plaque" || e === "spill") && (c = e === "plaque" ? 1.9 : e === "spill" ? 2.2 : 1.5, d = c * 2, h = e === "spill" ? 0.75 : 1.15, g = e === "spill" ? 9 : 8, m = e === "plaque" ? 14 : e === "spill" ? 13 : 21);
    this.state.hazards.push({ id: jr++, kind: e, zoneId: t, x: a, z: r, vx: o, vz: l, radius: c, width: d, angle: u, age: 0, telegraph: h, duration: g, damage: m, angularSpeed: A });
  }
  updatePickups(e) {
    const t = this.state.speciesId === "kpneumoniae" || this.state.upgrades.includes("bactoprenol-flow") ? 6.8 : 3.2;
    for (this.state.pickups = this.state.pickups.filter((n) => {
      n.age += e;
      const s = this.state.player.x - n.x, a = this.state.player.z - n.z, r = Math.hypot(s, a);
      return r < t && (n.x += s / Math.max(0.01, r) * e * 4.2, n.z += a / Math.max(0.01, r) * e * 4.2), r < n.radius + this.state.player.radius ? (this.collectPickup(n), !1) : n.age < 28;
    }); this.state.pickups.length < 9; ) this.spawnPickup(this.random() > 0.6 ? this.state.zoneId : pt[this.state.phaseIndex].targetZone);
  }
  collectPickup(e) {
    const t = this.state.upgrades.includes("bactoprenol-flow") ? 1.25 : 1, n = kt[this.state.speciesId], s = e.kind === "reagentDroplet" ? 2 : e.kind === "agarPlug" ? 1.6 : 1;
    this.state.assembly += s, this.state.commandCharge = Wt(this.state.commandCharge + (e.kind === "pipetteTip" ? 24 : 15) * n.commandGain * t, 0, 100), e.kind === "reagentDroplet" && (this.state.integrity = Wt(this.state.integrity + 5 * n.repairGain, 0, n.integrity + 18)), this.state.score += e.kind === "mediaBead" ? 135 : 105, this.state.carriedPickup || (this.state.carriedPickup = e.kind), this.state.effects.push(Ft("pickup", e.x, e.z, `carry ${_a[e.kind]}`)), this.state.assembly >= this.state.assemblyTarget && (this.state.assembly = 0, this.state.integrity = Wt(this.state.integrity + 13 * n.repairGain, 0, n.integrity + 16), this.state.score += 440, this.state.effects.push(Ft("command", this.state.player.x, this.state.player.z, "wall cycle")));
  }
  tryDepositCarriedResource() {
    const e = this.state;
    if (!e.carriedPickup) return;
    const t = Dh(e);
    if (Math.hypot(e.player.x - t.x, e.player.z - t.z) > 4.2) return;
    const s = pt[e.phaseIndex], a = _a[e.carriedPickup], r = Math.max(0, 18 - e.phaseTime) * 8;
    e.combo = Math.min(12, e.combo + 1), e.score += 340 + e.combo * 70 + r, e.commandCharge = Wt(e.commandCharge + 18, 0, 100), e.integrity = Wt(e.integrity + (e.carriedPickup === "reagentDroplet" ? 8 : 4), 0, kt[e.speciesId].integrity + 20), e.effects.push(Ft("pickup", t.x, t.z, `deposited ${a}`)), e.carriedPickup = "", (s.id === "slideTraining" || s.id === "pipettePulse" || s.id === "fernbachCurrent" || s.id === "lysisStorm") && yn(e, 1);
  }
  tagNearbyPlaques() {
    const e = this.state;
    e.hazards.forEach((t) => {
      t.kind !== "plaque" || t.tagged || Math.hypot(e.player.x - t.x, e.player.z - t.z) > t.radius + 2.2 || (t.tagged = !0, e.combo = Math.min(12, e.combo + 1), e.score += 240 + e.combo * 60, e.effects.push(Ft("command", t.x, t.z, "plaque tagged")), yn(e, 1));
    });
  }
  updateRotorCrossing() {
    const e = this.state;
    e.zoneId === "centrifuge" && (e.player.x < 32 && (e.jobStage < 1 || e.jobStage >= 3) ? (e.jobStage = 1, e.score += 90, e.effects.push(Ft("phase", e.player.x, e.player.z, "entry pocket"))) : e.player.x > 42 && e.jobStage === 1 ? (e.jobStage = 2, e.combo = Math.min(12, e.combo + 1), e.score += 420 + e.combo * 55, e.effects.push(Ft("phase", e.player.x, e.player.z, "sample crossed")), yn(e, 1)) : e.player.x > 52 && e.jobStage === 2 && (e.jobStage = 3, e.combo = Math.min(12, e.combo + 1), e.score += 520 + e.combo * 60, e.effects.push(Ft("phase", e.player.x, e.player.z, "escape lane")), yn(e, 1)));
  }
  sealNearbyBreaks(e, t) {
    const n = this.state;
    let s = 0;
    n.hazards = n.hazards.filter((a) => !e.includes(a.kind) || Math.hypot(n.player.x - a.x, n.player.z - a.z) > a.radius + 5.5 ? !0 : (s += 1, n.effects.push(Ft("command", a.x, a.z, t)), !1)), s && (n.combo = Math.min(12, n.combo + s), n.score += s * (360 + n.combo * 45), yn(n, s));
  }
  updateHazards(e) {
    this.state.hazards = this.state.hazards.filter((t) => (t.age += e, t.age > t.telegraph && (t.x += t.vx * e, t.z += t.vz * e, t.angularSpeed && (t.angle += t.angularSpeed * e)), t.kind === "rupture" && (t.radius += e * 0.72), t.kind === "plaque" && (t.radius += e * 0.48), t.kind === "spill" && (t.radius += e * 0.22), this.hazardHitsPlayer(t) ? (this.damage(t), !1) : t.age < t.duration && Math.abs(t.x) < $t.width * 0.66 && Math.abs(t.z) < $t.depth * 0.66));
  }
  hazardHitsPlayer(e) {
    if (e.age < e.telegraph) return !1;
    if (e.kind === "crack" || e.kind === "shock" || e.kind === "rotor") {
      const t = this.state.player.x - e.x, n = this.state.player.z - e.z, s = Math.abs(Math.sin(e.angle) * t - Math.cos(e.angle) * n), a = Math.abs(Math.cos(e.angle) * t + Math.sin(e.angle) * n), r = e.kind === "rotor" ? e.radius : e.kind === "shock" ? 15 : e.width;
      return s < (e.kind === "rotor" ? 0.8 : e.kind === "shock" ? 0.9 : 0.7) + this.state.player.radius * 0.45 && a < r;
    }
    return Math.hypot(this.state.player.x - e.x, this.state.player.z - e.z) < e.radius + this.state.player.radius;
  }
  damage(e) {
    const t = this.state, n = kt[t.speciesId];
    let s = e.damage * n.damageTaken;
    t.upgrades.includes("capsule-surge") && t.commandCharge >= 50 && (s *= 0.78), t.upgrades.includes("autolysin-brake") && (e.kind === "crack" || e.kind === "rupture" || e.kind === "spill") && (s *= 0.72), t.upgrades.includes("omp-buffer") && (e.kind === "rupture" || e.kind === "spill") && (s *= 0.68), t.integrity = Wt(t.integrity - s, 0, 140), t.lysisCause = `${e.kind} stress near ${Ys[e.zoneId].shortLabel}`, t.effects.push(Ft("damage", t.player.x, t.player.z, `-${Math.round(s)}`));
  }
  updateEffects(e) {
    this.state.effects = this.state.effects.filter((t) => (t.age += e, t.age < 1.8));
  }
  endRun(e) {
    this.state.status = "ended", this.state.previousStatus = "ended", this.state.lysisCause = e, this.state.effects.push(Ft("lysis", this.state.player.x, this.state.player.z, "Lysis"));
  }
}
function Bl() {
  return {
    status: "menu",
    previousStatus: "menu",
    mode: "classic",
    board: "classic",
    playerName: "Anonymous",
    selectedSpeciesId: "ecoli",
    speciesId: "ecoli",
    seed: 1,
    elapsed: 0,
    score: 0,
    integrity: 100,
    commandCharge: 0,
    assembly: 0,
    assemblyTarget: 5,
    carriedPickup: "",
    combo: 0,
    jobStage: 0,
    jobStep: "",
    nextHazardLabel: "watch telegraphs",
    phaseIndex: 0,
    phaseTime: 0,
    phaseProgress: 0,
    zoneId: "microscopeSlide",
    upgrades: [],
    upgradeChoices: [],
    lysisCause: "",
    player: { x: -46, z: 22, vx: 0, vz: 0, radius: 0.75, dashCooldown: 0, dashTimer: 0 },
    hazards: [],
    pickups: [],
    effects: [],
    timers: { pickup: 0.2, phage: 1.2, shock: 3.2, crack: 6, rupture: 8.5, droplet: 1.8, rotor: 4.5, plaque: 4.2, spill: 6.6, boss: 13 }
  };
}
function Dh(i) {
  const e = pt[i.phaseIndex];
  return e.id === "fernbachCurrent" ? { x: 6, z: 10 } : e.id === "centrifugeSweep" ? { x: 52, z: 8 } : e.id === "rackSeal" ? { x: 15, z: 26 } : { x: -44, z: 22 };
}
function Nl(i) {
  const e = pt[i.phaseIndex];
  return i.carriedPickup ? `Carry ${_a[i.carriedPickup]} to ${e.id === "fernbachCurrent" ? "the spill" : "the slide checkpoint"}.` : e.id === "slideTraining" ? "Pick up a bead or agar plug, then deposit it on the slide." : e.id === "pipettePulse" ? "Collect sterile pipette tips, dodge reagent lanes, and return tips to the slide." : e.id === "petriBloom" ? "Skim plaque edges to tag them; use Phage Defense for clustered clears." : e.id === "fernbachCurrent" ? "Collect reagent droplets and use Membrane Repair near media spills." : e.id === "centrifugeSweep" ? i.jobStage < 1 ? "Enter the left safe pocket before the rotor sweep." : i.jobStage < 2 ? "Cross through the center pocket during the opening." : i.jobStage < 3 ? "Escape to the far pocket before spin-up." : "Collect another sample or use Motility for a high-risk crossing." : e.id === "rackSeal" ? "Find rupture sites in the rack and seal them with PG or Membrane commands." : "Chain deposits and command clears while the full bench collapses.";
}
function yn(i, e) {
  if (i.status === "upgrade") return;
  const t = pt[i.phaseIndex];
  i.phaseProgress = Wt(i.phaseProgress + e, 0, t.target), i.phaseProgress >= t.target && i.phaseIndex < Kr && (i.score += 980 + i.phaseIndex * 300, i.upgradeChoices = Xh(i), i.status = "upgrade", i.previousStatus = "upgrade");
}
function Xh(i) {
  const e = Jr(Or(`${i.seed}-${i.phaseIndex}-${i.upgrades.join(",")}`)), t = Eh.filter((s) => !i.upgrades.includes(s)), n = [];
  for (; n.length < 3 && t.length > 0; ) {
    const s = an(e, t);
    n.push(s), t.splice(t.indexOf(s), 1);
  }
  return n;
}
function nr(i, e, t, n) {
  let s = 0;
  return i.hazards = i.hazards.filter((a) => !n.includes(a.kind) || Math.hypot(a.x - e.x, a.z - e.z) > t ? !0 : (s += 1, i.effects.push(Ft("command", a.x, a.z, "clear")), !1)), s;
}
function Hh(i) {
  let e = 1;
  return i.upgrades.includes("bactoprenol-flow") && (e += 0.08), i.upgrades.includes("mreB-alignment") && (e += 0.06), e;
}
function Ph(i) {
  ka.forEach((e) => {
    e.collision?.forEach((t) => kh(i.player, t));
  });
}
function kh(i, e) {
  if (e.type === "circle") {
    const c = i.x - e.x, d = i.z - e.z, u = Math.hypot(c, d) || 1e-3, h = e.radius + i.radius - u;
    h > 0 && (i.x += c / u * h, i.z += d / u * h);
    return;
  }
  const t = e.width / 2, n = e.depth / 2, s = Wt(i.x, e.x - t, e.x + t), a = Wt(i.z, e.z - n, e.z + n), r = i.x - s, o = i.z - a, l = Math.hypot(r, o);
  if (l > 0 && l < i.radius) {
    const c = i.radius - l;
    i.x += r / l * c, i.z += o / l * c;
  } else if (l === 0 && i.x > e.x - t && i.x < e.x + t && i.z > e.z - n && i.z < e.z + n) {
    const c = t - Math.abs(i.x - e.x), d = n - Math.abs(i.z - e.z);
    c < d ? i.x += i.x < e.x ? -c - i.radius : c + i.radius : i.z += i.z < e.z ? -d - i.radius : d + i.radius;
  }
}
function Yh(i, e) {
  return ka.some(
    (t) => t.collision?.some((n) => {
      if (n.type === "circle") return Math.hypot(i.x - n.x, i.z - n.z) < n.radius + e;
      const s = Wt(i.x, n.x - n.width / 2, n.x + n.width / 2), a = Wt(i.z, n.z - n.depth / 2, n.z + n.depth / 2);
      return Math.hypot(i.x - s, i.z - a) < e;
    })
  );
}
function zh(i) {
  return Es.find((t) => {
    const n = t.bounds;
    return i.x >= n.x - n.width / 2 && i.x <= n.x + n.width / 2 && i.z >= n.z - n.depth / 2 && i.z <= n.z + n.depth / 2;
  })?.id ?? null;
}
function Oh() {
  return `daily-${new Intl.DateTimeFormat("en-CA", { timeZone: Fh }).format(/* @__PURE__ */ new Date())}`;
}
function Ft(i, e, t, n) {
  return { id: jr++, type: i, x: e, z: t, label: n, age: 0 };
}
function El(i) {
  const e = Math.max(0, Math.floor(i)), t = Math.floor(e / 60), n = e % 60;
  return `${t}:${String(n).padStart(2, "0")}`;
}
function Wt(i, e, t) {
  return Math.max(e, Math.min(t, i));
}
function Fl(i, e, t) {
  return i + (e - i) * Wt(t, 0, 1);
}
const Sd = "bernhardt-envelope-escape-v3-board-", Jh = 9e3;
function Kh({ url: i = "" }) {
  const e = String(i || "").trim();
  async function t(s = "classic") {
    const a = di(s), r = ir(a);
    if (!e) return zs(r, a, "local");
    try {
      const o = await Wl(`${e}?board=${encodeURIComponent(a)}`), l = Ts(o?.entries, a);
      return Os(a, l), {
        entries: l,
        totalEntries: Math.max(l.length, Math.floor(Number(o?.totalEntries) || 0)),
        updatedAt: Math.floor(Number(o?.updatedAt) || Date.now()),
        board: di(o?.board || a),
        mode: "global"
      };
    } catch {
      return zs(r, a, "fallback");
    }
  }
  async function n(s) {
    const a = vd(s, di(s.board)), r = Ts([a, ...ir(a.board)], a.board);
    if (Os(a.board, r), !e) return { ...zs(r, a.board, "local"), rank: sr(r, a) };
    try {
      const o = await Wl(e, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a)
      }), l = Ts(o?.entries, a.board);
      return Os(a.board, l), {
        entries: l,
        totalEntries: Math.max(l.length, Math.floor(Number(o?.totalEntries) || 0)),
        updatedAt: Math.floor(Number(o?.updatedAt) || Date.now()),
        board: di(o?.board || a.board),
        mode: "global",
        rank: Math.max(1, Math.floor(Number(o?.rank) || sr(l, a)))
      };
    } catch {
      return { ...zs(r, a.board, "fallback"), rank: sr(r, a) };
    }
  }
  return { refresh: t, submit: n, readLocal: ir, writeLocal: Os };
}
function zs(i, e, t) {
  return { entries: i, totalEntries: i.length, updatedAt: Date.now(), board: e, mode: t };
}
async function Wl(i, e = {}) {
  const t = new AbortController(), n = window.setTimeout(() => t.abort(), Jh);
  try {
    const s = await window.fetch(i, { ...e, signal: t.signal });
    if (!s.ok) throw new Error(`Leaderboard request failed: ${s.status}`);
    return await s.json();
  } finally {
    window.clearTimeout(n);
  }
}
function ir(i) {
  try {
    return Ts(JSON.parse(window.localStorage.getItem(`${Sd}${di(i)}`) || "[]"), i);
  } catch {
    return [];
  }
}
function Os(i, e) {
  try {
    window.localStorage.setItem(`${Sd}${di(i)}`, JSON.stringify(Ts(e, i).slice(0, 25)));
  } catch {
  }
}
function Ts(i, e) {
  return (Array.isArray(i) ? i : []).map((n) => vd(n, e)).sort((n, s) => s.score - n.score || s.playedAt - n.playedAt).slice(0, 25);
}
function vd(i, e) {
  const t = i || {};
  return {
    name: String(t.name || "Anonymous").slice(0, 24),
    score: Math.max(0, Math.floor(Number(t.score) || 0)),
    species: t.species || "ecoli",
    playedAt: Math.max(0, Math.floor(Number(t.playedAt) || Date.now())),
    board: di(t.board || e)
  };
}
function sr(i, e) {
  const t = i.findIndex((n) => n.playedAt === e.playedAt && n.score === e.score && n.name === e.name);
  return t >= 0 ? t + 1 : Math.max(1, i.filter((n) => n.score > e.score).length + 1);
}
const Jo = "184", jh = 0, Vl = 1, Qh = 2, wa = 1, xd = 2, Rs = 3, zn = 0, Jt = 1, Rn = 2, kn = 0, Ki = 1, Ll = 2, Ul = 3, Dl = 4, qh = 5, Ai = 100, $h = 101, eu = 102, tu = 103, nu = 104, iu = 200, su = 201, au = 202, ru = 203, Qr = 204, qr = 205, ou = 206, lu = 207, cu = 208, du = 209, hu = 210, uu = 211, gu = 212, pu = 213, fu = 214, $r = 0, eo = 1, to = 2, qi = 3, no = 4, io = 5, so = 6, ao = 7, _d = 0, mu = 1, Iu = 2, Tn = 0, wd = 1, Rd = 2, Md = 3, Gd = 4, Td = 5, Zd = 6, Bd = 7, Xl = "attached", Cu = "detached", Nd = 300, vi = 301, $i = 302, ar = 303, rr = 304, Ya = 306, es = 1e3, Mn = 1001, Ea = 1002, Rt = 1003, Ed = 1004, Ms = 1005, Mt = 1006, Ra = 1007, Hn = 1008, en = 1009, Fd = 1010, Wd = 1011, Fs = 1012, Ko = 1013, Bn = 1014, cn = 1015, On = 1016, jo = 1017, Qo = 1018, Ws = 1020, Vd = 35902, Ld = 35899, Ud = 1021, Dd = 1022, dn = 1023, Jn = 1026, Si = 1027, qo = 1028, $o = 1029, xi = 1030, el = 1031, tl = 1033, Ma = 33776, Ga = 33777, Ta = 33778, Za = 33779, ro = 35840, oo = 35841, lo = 35842, co = 35843, ho = 36196, uo = 37492, go = 37496, po = 37488, fo = 37489, Fa = 37490, mo = 37491, Io = 37808, Co = 37809, bo = 37810, Ao = 37811, yo = 37812, So = 37813, vo = 37814, xo = 37815, _o = 37816, wo = 37817, Ro = 37818, Mo = 37819, Go = 37820, To = 37821, Zo = 36492, Bo = 36494, No = 36495, Eo = 36283, Fo = 36284, Wa = 36285, Wo = 36286, Vs = 2300, Ls = 2301, or = 2302, Hl = 2303, Pl = 2400, kl = 2401, Yl = 2402, bu = 2500, Au = 0, Xd = 1, Vo = 2, yu = 3200, Lo = 0, Su = 1, ci = "", wt = "srgb", tn = "srgb-linear", Va = "linear", Qe = "srgb", Mi = 7680, zl = 519, vu = 512, xu = 513, _u = 514, nl = 515, wu = 516, Ru = 517, il = 518, Mu = 519, Uo = 35044, Ol = "300 es", Gn = 2e3, Us = 2001;
function Gu(i) {
  for (let e = i.length - 1; e >= 0; --e)
    if (i[e] >= 65535) return !0;
  return !1;
}
function Tu(i) {
  return ArrayBuffer.isView(i) && !(i instanceof DataView);
}
function Ds(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function Zu() {
  const i = Ds("canvas");
  return i.style.display = "block", i;
}
const Jl = {};
function La(...i) {
  const e = "THREE." + i.shift();
  console.log(e, ...i);
}
function Hd(i) {
  const e = i[0];
  if (typeof e == "string" && e.startsWith("TSL:")) {
    const t = i[1];
    t && t.isStackTrace ? i[0] += " " + t.getLocation() : i[1] = 'Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.';
  }
  return i;
}
function Ae(...i) {
  i = Hd(i);
  const e = "THREE." + i.shift();
  {
    const t = i[0];
    t && t.isStackTrace ? console.warn(t.getError(e)) : console.warn(e, ...i);
  }
}
function we(...i) {
  i = Hd(i);
  const e = "THREE." + i.shift();
  {
    const t = i[0];
    t && t.isStackTrace ? console.error(t.getError(e)) : console.error(e, ...i);
  }
}
function Do(...i) {
  const e = i.join(" ");
  e in Jl || (Jl[e] = !0, Ae(...i));
}
function Bu(i, e, t) {
  return new Promise(function(n, s) {
    function a() {
      switch (i.clientWaitSync(e, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(a, t);
          break;
        default:
          n();
      }
    }
    setTimeout(a, t);
  });
}
const Nu = {
  [$r]: eo,
  [to]: so,
  [no]: ao,
  [qi]: io,
  [eo]: $r,
  [so]: to,
  [ao]: no,
  [io]: qi
};
class _i {

  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
  }

  hasEventListener(e, t) {
    const n = this._listeners;
    return n === void 0 ? !1 : n[e] !== void 0 && n[e].indexOf(t) !== -1;
  }

  removeEventListener(e, t) {
    const n = this._listeners;
    if (n === void 0) return;
    const s = n[e];
    if (s !== void 0) {
      const a = s.indexOf(t);
      a !== -1 && s.splice(a, 1);
    }
  }

  dispatchEvent(e) {
    const t = this._listeners;
    if (t === void 0) return;
    const n = t[e.type];
    if (n !== void 0) {
      e.target = this;
      const s = n.slice(0);
      for (let a = 0, r = s.length; a < r; a++)
        s[a].call(this, e);
      e.target = null;
    }
  }
}
const Lt = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let Kl = 1234567;
const Zs = Math.PI / 180, ts = 180 / Math.PI;
function mn() {
  const i = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (Lt[i & 255] + Lt[i >> 8 & 255] + Lt[i >> 16 & 255] + Lt[i >> 24 & 255] + "-" + Lt[e & 255] + Lt[e >> 8 & 255] + "-" + Lt[e >> 16 & 15 | 64] + Lt[e >> 24 & 255] + "-" + Lt[t & 63 | 128] + Lt[t >> 8 & 255] + "-" + Lt[t >> 16 & 255] + Lt[t >> 24 & 255] + Lt[n & 255] + Lt[n >> 8 & 255] + Lt[n >> 16 & 255] + Lt[n >> 24 & 255]).toLowerCase();
}
function ke(i, e, t) {
  return Math.max(e, Math.min(t, i));
}
function sl(i, e) {
  return (i % e + e) % e;
}
function Eu(i, e, t, n, s) {
  return n + (i - e) * (s - n) / (t - e);
}
function Fu(i, e, t) {
  return i !== e ? (t - i) / (e - i) : 0;
}
function Bs(i, e, t) {
  return (1 - t) * i + t * e;
}
function Wu(i, e, t, n) {
  return Bs(i, e, 1 - Math.exp(-t * n));
}
function Vu(i, e = 1) {
  return e - Math.abs(sl(i, e * 2) - e);
}
function Lu(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * (3 - 2 * i));
}
function Uu(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * i * (i * (i * 6 - 15) + 10));
}
function Du(i, e) {
  return i + Math.floor(Math.random() * (e - i + 1));
}
function Xu(i, e) {
  return i + Math.random() * (e - i);
}
function Hu(i) {
  return i * (0.5 - Math.random());
}
function Pu(i) {
  i !== void 0 && (Kl = i);
  let e = Kl += 1831565813;
  return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
}
function ku(i) {
  return i * Zs;
}
function Yu(i) {
  return i * ts;
}
function zu(i) {
  return (i & i - 1) === 0 && i !== 0;
}
function Ou(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function Ju(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function Ku(i, e, t, n, s) {
  const a = Math.cos, r = Math.sin, o = a(t / 2), l = r(t / 2), c = a((e + n) / 2), d = r((e + n) / 2), u = a((e - n) / 2), h = r((e - n) / 2), g = a((n - e) / 2), m = r((n - e) / 2);
  switch (s) {
    case "XYX":
      i.set(o * d, l * u, l * h, o * c);
      break;
    case "YZY":
      i.set(l * h, o * d, l * u, o * c);
      break;
    case "ZXZ":
      i.set(l * u, l * h, o * d, o * c);
      break;
    case "XZX":
      i.set(o * d, l * m, l * g, o * c);
      break;
    case "YXY":
      i.set(l * g, o * d, l * m, o * c);
      break;
    case "ZYZ":
      i.set(l * m, l * g, o * d, o * c);
      break;
    default:
      Ae("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + s);
  }
}
function fn(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function qe(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const ju = {
  DEG2RAD: Zs,
  RAD2DEG: ts,

  generateUUID: mn,

  clamp: ke,

  euclideanModulo: sl,

  mapLinear: Eu,

  inverseLerp: Fu,

  lerp: Bs,

  damp: Wu,

  pingpong: Vu,

  smoothstep: Lu,

  smootherstep: Uu,

  randInt: Du,

  randFloat: Xu,

  randFloatSpread: Hu,

  seededRandom: Pu,

  degToRad: ku,

  radToDeg: Yu,

  isPowerOfTwo: zu,

  ceilPowerOfTwo: Ou,

  floorPowerOfTwo: Ju,

  setQuaternionFromProperEuler: Ku,

  normalize: qe,

  denormalize: fn
}, Cl = class Cl {

  constructor(e = 0, t = 0) {
    this.x = e, this.y = t;
  }

  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }

  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }

  set(e, t) {
    return this.x = e, this.y = t, this;
  }

  setScalar(e) {
    return this.x = e, this.y = e, this;
  }

  setX(e) {
    return this.x = e, this;
  }

  setY(e) {
    return this.y = e, this;
  }

  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }

  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }

  clone() {
    return new this.constructor(this.x, this.y);
  }

  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }

  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }

  addScalar(e) {
    return this.x += e, this.y += e, this;
  }

  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }

  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }

  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }

  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }

  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }

  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }

  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }

  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }

  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }

  applyMatrix3(e) {
    const t = this.x, n = this.y, s = e.elements;
    return this.x = s[0] * t + s[3] * n + s[6], this.y = s[1] * t + s[4] * n + s[7], this;
  }

  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }

  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }

  clamp(e, t) {
    return this.x = ke(this.x, e.x, t.x), this.y = ke(this.y, e.y, t.y), this;
  }

  clampScalar(e, t) {
    return this.x = ke(this.x, e, t), this.y = ke(this.y, e, t), this;
  }

  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(ke(n, e, t));
  }

  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }

  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }

  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }

  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }

  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }

  dot(e) {
    return this.x * e.x + this.y * e.y;
  }

  cross(e) {
    return this.x * e.y - this.y * e.x;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }

  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(ke(n, -1, 1));
  }

  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }

  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y;
    return t * t + n * n;
  }

  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }

  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }

  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }

  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
  }

  equals(e) {
    return e.x === this.x && e.y === this.y;
  }

  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }

  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }

  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }

  rotateAround(e, t) {
    const n = Math.cos(t), s = Math.sin(t), a = this.x - e.x, r = this.y - e.y;
    return this.x = a * n - r * s + e.x, this.y = a * s + r * n + e.y, this;
  }

  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
};
Cl.prototype.isVector2 = !0;
let Te = Cl;
class jn {

  constructor(e = 0, t = 0, n = 0, s = 1) {
    this.isQuaternion = !0, this._x = e, this._y = t, this._z = n, this._w = s;
  }

  static slerpFlat(e, t, n, s, a, r, o) {
    let l = n[s + 0], c = n[s + 1], d = n[s + 2], u = n[s + 3], h = a[r + 0], g = a[r + 1], m = a[r + 2], A = a[r + 3];
    if (u !== A || l !== h || c !== g || d !== m) {
      let f = l * h + c * g + d * m + u * A;
      f < 0 && (h = -h, g = -g, m = -m, A = -A, f = -f);
      let p = 1 - o;
      if (f < 0.9995) {
        const b = Math.acos(f), v = Math.sin(b);
        p = Math.sin(p * b) / v, o = Math.sin(o * b) / v, l = l * p + h * o, c = c * p + g * o, d = d * p + m * o, u = u * p + A * o;
      } else {
        l = l * p + h * o, c = c * p + g * o, d = d * p + m * o, u = u * p + A * o;
        const b = 1 / Math.sqrt(l * l + c * c + d * d + u * u);
        l *= b, c *= b, d *= b, u *= b;
      }
    }
    e[t] = l, e[t + 1] = c, e[t + 2] = d, e[t + 3] = u;
  }

  static multiplyQuaternionsFlat(e, t, n, s, a, r) {
    const o = n[s], l = n[s + 1], c = n[s + 2], d = n[s + 3], u = a[r], h = a[r + 1], g = a[r + 2], m = a[r + 3];
    return e[t] = o * m + d * u + l * g - c * h, e[t + 1] = l * m + d * h + c * u - o * g, e[t + 2] = c * m + d * g + o * h - l * u, e[t + 3] = d * m - o * u - l * h - c * g, e;
  }

  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }

  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }

  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }

  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }

  set(e, t, n, s) {
    return this._x = e, this._y = t, this._z = n, this._w = s, this._onChangeCallback(), this;
  }

  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }

  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }

  setFromEuler(e, t = !0) {
    const n = e._x, s = e._y, a = e._z, r = e._order, o = Math.cos, l = Math.sin, c = o(n / 2), d = o(s / 2), u = o(a / 2), h = l(n / 2), g = l(s / 2), m = l(a / 2);
    switch (r) {
      case "XYZ":
        this._x = h * d * u + c * g * m, this._y = c * g * u - h * d * m, this._z = c * d * m + h * g * u, this._w = c * d * u - h * g * m;
        break;
      case "YXZ":
        this._x = h * d * u + c * g * m, this._y = c * g * u - h * d * m, this._z = c * d * m - h * g * u, this._w = c * d * u + h * g * m;
        break;
      case "ZXY":
        this._x = h * d * u - c * g * m, this._y = c * g * u + h * d * m, this._z = c * d * m + h * g * u, this._w = c * d * u - h * g * m;
        break;
      case "ZYX":
        this._x = h * d * u - c * g * m, this._y = c * g * u + h * d * m, this._z = c * d * m - h * g * u, this._w = c * d * u + h * g * m;
        break;
      case "YZX":
        this._x = h * d * u + c * g * m, this._y = c * g * u + h * d * m, this._z = c * d * m - h * g * u, this._w = c * d * u - h * g * m;
        break;
      case "XZY":
        this._x = h * d * u - c * g * m, this._y = c * g * u - h * d * m, this._z = c * d * m + h * g * u, this._w = c * d * u + h * g * m;
        break;
      default:
        Ae("Quaternion: .setFromEuler() encountered an unknown order: " + r);
    }
    return t === !0 && this._onChangeCallback(), this;
  }

  setFromAxisAngle(e, t) {
    const n = t / 2, s = Math.sin(n);
    return this._x = e.x * s, this._y = e.y * s, this._z = e.z * s, this._w = Math.cos(n), this._onChangeCallback(), this;
  }

  setFromRotationMatrix(e) {
    const t = e.elements, n = t[0], s = t[4], a = t[8], r = t[1], o = t[5], l = t[9], c = t[2], d = t[6], u = t[10], h = n + o + u;
    if (h > 0) {
      const g = 0.5 / Math.sqrt(h + 1);
      this._w = 0.25 / g, this._x = (d - l) * g, this._y = (a - c) * g, this._z = (r - s) * g;
    } else if (n > o && n > u) {
      const g = 2 * Math.sqrt(1 + n - o - u);
      this._w = (d - l) / g, this._x = 0.25 * g, this._y = (s + r) / g, this._z = (a + c) / g;
    } else if (o > u) {
      const g = 2 * Math.sqrt(1 + o - n - u);
      this._w = (a - c) / g, this._x = (s + r) / g, this._y = 0.25 * g, this._z = (l + d) / g;
    } else {
      const g = 2 * Math.sqrt(1 + u - n - o);
      this._w = (r - s) / g, this._x = (a + c) / g, this._y = (l + d) / g, this._z = 0.25 * g;
    }
    return this._onChangeCallback(), this;
  }

  setFromUnitVectors(e, t) {
    let n = e.dot(t) + 1;
    return n < 1e-8 ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
  }

  angleTo(e) {
    return 2 * Math.acos(Math.abs(ke(this.dot(e), -1, 1)));
  }

  rotateTowards(e, t) {
    const n = this.angleTo(e);
    if (n === 0) return this;
    const s = Math.min(1, t / n);
    return this.slerp(e, s), this;
  }

  identity() {
    return this.set(0, 0, 0, 1);
  }

  invert() {
    return this.conjugate();
  }

  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }

  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }

  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }

  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }

  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }

  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }

  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }

  multiplyQuaternions(e, t) {
    const n = e._x, s = e._y, a = e._z, r = e._w, o = t._x, l = t._y, c = t._z, d = t._w;
    return this._x = n * d + r * o + s * c - a * l, this._y = s * d + r * l + a * o - n * c, this._z = a * d + r * c + n * l - s * o, this._w = r * d - n * o - s * l - a * c, this._onChangeCallback(), this;
  }

  slerp(e, t) {
    let n = e._x, s = e._y, a = e._z, r = e._w, o = this.dot(e);
    o < 0 && (n = -n, s = -s, a = -a, r = -r, o = -o);
    let l = 1 - t;
    if (o < 0.9995) {
      const c = Math.acos(o), d = Math.sin(c);
      l = Math.sin(l * c) / d, t = Math.sin(t * c) / d, this._x = this._x * l + n * t, this._y = this._y * l + s * t, this._z = this._z * l + a * t, this._w = this._w * l + r * t, this._onChangeCallback();
    } else
      this._x = this._x * l + n * t, this._y = this._y * l + s * t, this._z = this._z * l + a * t, this._w = this._w * l + r * t, this.normalize();
    return this;
  }

  slerpQuaternions(e, t, n) {
    return this.copy(e).slerp(t, n);
  }

  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), s = Math.sqrt(1 - n), a = Math.sqrt(n);
    return this.set(
      s * Math.sin(e),
      s * Math.cos(e),
      a * Math.sin(t),
      a * Math.cos(t)
    );
  }

  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }

  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }

  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }

  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }

  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
const bl = class bl {

  constructor(e = 0, t = 0, n = 0) {
    this.x = e, this.y = t, this.z = n;
  }

  set(e, t, n) {
    return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
  }

  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }

  setX(e) {
    return this.x = e, this;
  }

  setY(e) {
    return this.y = e, this;
  }

  setZ(e) {
    return this.z = e, this;
  }

  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }

  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }

  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }

  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }

  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }

  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }

  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }

  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }

  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }

  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }

  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }

  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }

  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }

  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }

  applyEuler(e) {
    return this.applyQuaternion(jl.setFromEuler(e));
  }

  applyAxisAngle(e, t) {
    return this.applyQuaternion(jl.setFromAxisAngle(e, t));
  }

  applyMatrix3(e) {
    const t = this.x, n = this.y, s = this.z, a = e.elements;
    return this.x = a[0] * t + a[3] * n + a[6] * s, this.y = a[1] * t + a[4] * n + a[7] * s, this.z = a[2] * t + a[5] * n + a[8] * s, this;
  }

  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }

  applyMatrix4(e) {
    const t = this.x, n = this.y, s = this.z, a = e.elements, r = 1 / (a[3] * t + a[7] * n + a[11] * s + a[15]);
    return this.x = (a[0] * t + a[4] * n + a[8] * s + a[12]) * r, this.y = (a[1] * t + a[5] * n + a[9] * s + a[13]) * r, this.z = (a[2] * t + a[6] * n + a[10] * s + a[14]) * r, this;
  }

  applyQuaternion(e) {
    const t = this.x, n = this.y, s = this.z, a = e.x, r = e.y, o = e.z, l = e.w, c = 2 * (r * s - o * n), d = 2 * (o * t - a * s), u = 2 * (a * n - r * t);
    return this.x = t + l * c + r * u - o * d, this.y = n + l * d + o * c - a * u, this.z = s + l * u + a * d - r * c, this;
  }

  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }

  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }

  transformDirection(e) {
    const t = this.x, n = this.y, s = this.z, a = e.elements;
    return this.x = a[0] * t + a[4] * n + a[8] * s, this.y = a[1] * t + a[5] * n + a[9] * s, this.z = a[2] * t + a[6] * n + a[10] * s, this.normalize();
  }

  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }

  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }

  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }

  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }

  clamp(e, t) {
    return this.x = ke(this.x, e.x, t.x), this.y = ke(this.y, e.y, t.y), this.z = ke(this.z, e.z, t.z), this;
  }

  clampScalar(e, t) {
    return this.x = ke(this.x, e, t), this.y = ke(this.y, e, t), this.z = ke(this.z, e, t), this;
  }

  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(ke(n, e, t));
  }

  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }

  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }

  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }

  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }

  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }

  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }

  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }

  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
  }

  cross(e) {
    return this.crossVectors(this, e);
  }

  crossVectors(e, t) {
    const n = e.x, s = e.y, a = e.z, r = t.x, o = t.y, l = t.z;
    return this.x = s * l - a * o, this.y = a * r - n * l, this.z = n * o - s * r, this;
  }

  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const n = e.dot(this) / t;
    return this.copy(e).multiplyScalar(n);
  }

  projectOnPlane(e) {
    return lr.copy(this).projectOnVector(e), this.sub(lr);
  }

  reflect(e) {
    return this.sub(lr.copy(e).multiplyScalar(2 * this.dot(e)));
  }

  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(ke(n, -1, 1));
  }

  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }

  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y, s = this.z - e.z;
    return t * t + n * n + s * s;
  }

  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }

  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }

  setFromSphericalCoords(e, t, n) {
    const s = Math.sin(t) * e;
    return this.x = s * Math.sin(n), this.y = Math.cos(t) * e, this.z = s * Math.cos(n), this;
  }

  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }

  setFromCylindricalCoords(e, t, n) {
    return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
  }

  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }

  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), s = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = n, this.z = s, this;
  }

  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }

  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }

  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }

  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }

  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }

  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }

  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }

  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }

  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }

  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
    return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
};
bl.prototype.isVector3 = !0;
let N = bl;
const lr = /* @__PURE__ */ new N(), jl = /* @__PURE__ */ new jn(), Al = class Al {

  constructor(e, t, n, s, a, r, o, l, c) {
    this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, s, a, r, o, l, c);
  }

  set(e, t, n, s, a, r, o, l, c) {
    const d = this.elements;
    return d[0] = e, d[1] = s, d[2] = o, d[3] = t, d[4] = a, d[5] = l, d[6] = n, d[7] = r, d[8] = c, this;
  }

  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }

  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
  }

  extractBasis(e, t, n) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }

  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[4],
      t[8],
      t[1],
      t[5],
      t[9],
      t[2],
      t[6],
      t[10]
    ), this;
  }

  multiply(e) {
    return this.multiplyMatrices(this, e);
  }

  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }

  multiplyMatrices(e, t) {
    const n = e.elements, s = t.elements, a = this.elements, r = n[0], o = n[3], l = n[6], c = n[1], d = n[4], u = n[7], h = n[2], g = n[5], m = n[8], A = s[0], f = s[3], p = s[6], b = s[1], v = s[4], S = s[7], R = s[2], x = s[5], G = s[8];
    return a[0] = r * A + o * b + l * R, a[3] = r * f + o * v + l * x, a[6] = r * p + o * S + l * G, a[1] = c * A + d * b + u * R, a[4] = c * f + d * v + u * x, a[7] = c * p + d * S + u * G, a[2] = h * A + g * b + m * R, a[5] = h * f + g * v + m * x, a[8] = h * p + g * S + m * G, this;
  }

  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }

  determinant() {
    const e = this.elements, t = e[0], n = e[1], s = e[2], a = e[3], r = e[4], o = e[5], l = e[6], c = e[7], d = e[8];
    return t * r * d - t * o * c - n * a * d + n * o * l + s * a * c - s * r * l;
  }

  invert() {
    const e = this.elements, t = e[0], n = e[1], s = e[2], a = e[3], r = e[4], o = e[5], l = e[6], c = e[7], d = e[8], u = d * r - o * c, h = o * l - d * a, g = c * a - r * l, m = t * u + n * h + s * g;
    if (m === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const A = 1 / m;
    return e[0] = u * A, e[1] = (s * c - d * n) * A, e[2] = (o * n - s * r) * A, e[3] = h * A, e[4] = (d * t - s * l) * A, e[5] = (s * a - o * t) * A, e[6] = g * A, e[7] = (n * l - c * t) * A, e[8] = (r * t - n * a) * A, this;
  }

  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }

  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }

  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }

  setUvTransform(e, t, n, s, a, r, o) {
    const l = Math.cos(a), c = Math.sin(a);
    return this.set(
      n * l,
      n * c,
      -n * (l * r + c * o) + r + e,
      -s * c,
      s * l,
      -s * (-c * r + l * o) + o + t,
      0,
      0,
      1
    ), this;
  }

  scale(e, t) {
    return this.premultiply(cr.makeScale(e, t)), this;
  }

  rotate(e) {
    return this.premultiply(cr.makeRotation(-e)), this;
  }

  translate(e, t) {
    return this.premultiply(cr.makeTranslation(e, t)), this;
  }
  // for 2D Transforms

  makeTranslation(e, t) {
    return e.isVector2 ? this.set(
      1,
      0,
      e.x,
      0,
      1,
      e.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      e,
      0,
      1,
      t,
      0,
      0,
      1
    ), this;
  }

  makeRotation(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      -n,
      0,
      n,
      t,
      0,
      0,
      0,
      1
    ), this;
  }

  makeScale(e, t) {
    return this.set(
      e,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      1
    ), this;
  }

  equals(e) {
    const t = this.elements, n = e.elements;
    for (let s = 0; s < 9; s++)
      if (t[s] !== n[s]) return !1;
    return !0;
  }

  fromArray(e, t = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = e[n + t];
    return this;
  }

  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
  }

  clone() {
    return new this.constructor().fromArray(this.elements);
  }
};
Al.prototype.isMatrix3 = !0;
let Ne = Al;
const cr = /* @__PURE__ */ new Ne(), Ql = /* @__PURE__ */ new Ne().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), ql = /* @__PURE__ */ new Ne().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
function Qu() {
  const i = {
    enabled: !0,
    workingColorSpace: tn,

    spaces: {},
    convert: function(s, a, r) {
      return this.enabled === !1 || a === r || !a || !r || (this.spaces[a].transfer === Qe && (s.r = Yn(s.r), s.g = Yn(s.g), s.b = Yn(s.b)), this.spaces[a].primaries !== this.spaces[r].primaries && (s.applyMatrix3(this.spaces[a].toXYZ), s.applyMatrix3(this.spaces[r].fromXYZ)), this.spaces[r].transfer === Qe && (s.r = ji(s.r), s.g = ji(s.g), s.b = ji(s.b))), s;
    },
    workingToColorSpace: function(s, a) {
      return this.convert(s, this.workingColorSpace, a);
    },
    colorSpaceToWorking: function(s, a) {
      return this.convert(s, a, this.workingColorSpace);
    },
    getPrimaries: function(s) {
      return this.spaces[s].primaries;
    },
    getTransfer: function(s) {
      return s === ci ? Va : this.spaces[s].transfer;
    },
    getToneMappingMode: function(s) {
      return this.spaces[s].outputColorSpaceConfig.toneMappingMode || "standard";
    },
    getLuminanceCoefficients: function(s, a = this.workingColorSpace) {
      return s.fromArray(this.spaces[a].luminanceCoefficients);
    },
    define: function(s) {
      Object.assign(this.spaces, s);
    },
    // Internal APIs
    _getMatrix: function(s, a, r) {
      return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(s) {
      return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(s = this.workingColorSpace) {
      return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;
    },
    // Deprecated
    fromWorkingColorSpace: function(s, a) {
      return Do("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), i.workingToColorSpace(s, a);
    },
    toWorkingColorSpace: function(s, a) {
      return Do("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), i.colorSpaceToWorking(s, a);
    }
  }, e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], t = [0.2126, 0.7152, 0.0722], n = [0.3127, 0.329];
  return i.define({
    [tn]: {
      primaries: e,
      whitePoint: n,
      transfer: Va,
      toXYZ: Ql,
      fromXYZ: ql,
      luminanceCoefficients: t,
      workingColorSpaceConfig: { unpackColorSpace: wt },
      outputColorSpaceConfig: { drawingBufferColorSpace: wt }
    },
    [wt]: {
      primaries: e,
      whitePoint: n,
      transfer: Qe,
      toXYZ: Ql,
      fromXYZ: ql,
      luminanceCoefficients: t,
      outputColorSpaceConfig: { drawingBufferColorSpace: wt }
    }
  }), i;
}
const Pe = /* @__PURE__ */ Qu();
function Yn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function ji(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let Gi;
class qu {

  static getDataURL(e, t = "image/png") {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
      return e.src;
    let n;
    if (e instanceof HTMLCanvasElement)
      n = e;
    else {
      Gi === void 0 && (Gi = Ds("canvas")), Gi.width = e.width, Gi.height = e.height;
      const s = Gi.getContext("2d");
      e instanceof ImageData ? s.putImageData(e, 0, 0) : s.drawImage(e, 0, 0, e.width, e.height), n = Gi;
    }
    return n.toDataURL(t);
  }

  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = Ds("canvas");
      t.width = e.width, t.height = e.height;
      const n = t.getContext("2d");
      n.drawImage(e, 0, 0, e.width, e.height);
      const s = n.getImageData(0, 0, e.width, e.height), a = s.data;
      for (let r = 0; r < a.length; r++)
        a[r] = Yn(a[r] / 255) * 255;
      return n.putImageData(s, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let n = 0; n < t.length; n++)
        t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[n] = Math.floor(Yn(t[n] / 255) * 255) : t[n] = Yn(t[n]);
      return {
        data: t,
        width: e.width,
        height: e.height
      };
    } else
      return Ae("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let $u = 0;
class al {

  constructor(e = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: $u++ }), this.uuid = mn(), this.data = e, this.dataReady = !0, this.version = 0;
  }

  getSize(e) {
    const t = this.data;
    return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : typeof VideoFrame < "u" && t instanceof VideoFrame ? e.set(t.displayWidth, t.displayHeight, 0) : t !== null ? e.set(t.width, t.height, t.depth || 0) : e.set(0, 0, 0), e;
  }

  set needsUpdate(e) {
    e === !0 && this.version++;
  }

  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0)
      return e.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, s = this.data;
    if (s !== null) {
      let a;
      if (Array.isArray(s)) {
        a = [];
        for (let r = 0, o = s.length; r < o; r++)
          s[r].isDataTexture ? a.push(dr(s[r].image)) : a.push(dr(s[r]));
      } else
        a = dr(s);
      n.url = a;
    }
    return t || (e.images[this.uuid] = n), n;
  }
}
function dr(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? qu.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (Ae("Texture: Unable to serialize Texture."), {});
}
let eg = 0;
const hr = /* @__PURE__ */ new N();
class Gt extends _i {

  constructor(e = Gt.DEFAULT_IMAGE, t = Gt.DEFAULT_MAPPING, n = Mn, s = Mn, a = Mt, r = Hn, o = dn, l = en, c = Gt.DEFAULT_ANISOTROPY, d = ci) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: eg++ }), this.uuid = mn(), this.name = "", this.source = new al(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = n, this.wrapT = s, this.magFilter = a, this.minFilter = r, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new Te(0, 0), this.repeat = new Te(1, 1), this.center = new Te(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Ne(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = d, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isArrayTexture = !!(e && e.depth && e.depth > 1), this.pmremVersion = 0, this.normalized = !1;
  }

  get width() {
    return this.source.getSize(hr).x;
  }

  get height() {
    return this.source.getSize(hr).y;
  }

  get depth() {
    return this.source.getSize(hr).z;
  }

  get image() {
    return this.source.data;
  }
  set image(e) {
    this.source.data = e;
  }

  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }

  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }

  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.normalized = e.normalized, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
  }

  setValues(e) {
    for (const t in e) {
      const n = e[t];
      if (n === void 0) {
        Ae(`Texture.setValues(): parameter '${t}' has value of undefined.`);
        continue;
      }
      const s = this[t];
      if (s === void 0) {
        Ae(`Texture.setValues(): property '${t}' does not exist.`);
        continue;
      }
      s && n && s.isVector2 && n.isVector2 || s && n && s.isVector3 && n.isVector3 || s && n && s.isMatrix3 && n.isMatrix3 ? s.copy(n) : this[t] = n;
    }
  }

  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0)
      return e.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.7,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      normalized: this.normalized,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }

  transformUv(e) {
    if (this.mapping !== Nd) return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
      switch (this.wrapS) {
        case es:
          e.x = e.x - Math.floor(e.x);
          break;
        case Mn:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case Ea:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case es:
          e.y = e.y - Math.floor(e.y);
          break;
        case Mn:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case Ea:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
    return this.flipY && (e.y = 1 - e.y), e;
  }

  set needsUpdate(e) {
    e === !0 && (this.version++, this.source.needsUpdate = !0);
  }

  set needsPMREMUpdate(e) {
    e === !0 && this.pmremVersion++;
  }
}
Gt.DEFAULT_IMAGE = null;
Gt.DEFAULT_MAPPING = Nd;
Gt.DEFAULT_ANISOTROPY = 1;
const yl = class yl {

  constructor(e = 0, t = 0, n = 0, s = 1) {
    this.x = e, this.y = t, this.z = n, this.w = s;
  }

  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }

  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }

  set(e, t, n, s) {
    return this.x = e, this.y = t, this.z = n, this.w = s, this;
  }

  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }

  setX(e) {
    return this.x = e, this;
  }

  setY(e) {
    return this.y = e, this;
  }

  setZ(e) {
    return this.z = e, this;
  }

  setW(e) {
    return this.w = e, this;
  }

  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }

  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }

  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }

  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }

  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }

  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }

  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }

  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }

  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }

  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }

  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }

  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }

  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }

  applyMatrix4(e) {
    const t = this.x, n = this.y, s = this.z, a = this.w, r = e.elements;
    return this.x = r[0] * t + r[4] * n + r[8] * s + r[12] * a, this.y = r[1] * t + r[5] * n + r[9] * s + r[13] * a, this.z = r[2] * t + r[6] * n + r[10] * s + r[14] * a, this.w = r[3] * t + r[7] * n + r[11] * s + r[15] * a, this;
  }

  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
  }

  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }

  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }

  setAxisAngleFromRotationMatrix(e) {
    let t, n, s, a;
    const l = e.elements, c = l[0], d = l[4], u = l[8], h = l[1], g = l[5], m = l[9], A = l[2], f = l[6], p = l[10];
    if (Math.abs(d - h) < 0.01 && Math.abs(u - A) < 0.01 && Math.abs(m - f) < 0.01) {
      if (Math.abs(d + h) < 0.1 && Math.abs(u + A) < 0.1 && Math.abs(m + f) < 0.1 && Math.abs(c + g + p - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const v = (c + 1) / 2, S = (g + 1) / 2, R = (p + 1) / 2, x = (d + h) / 4, G = (u + A) / 4, C = (m + f) / 4;
      return v > S && v > R ? v < 0.01 ? (n = 0, s = 0.707106781, a = 0.707106781) : (n = Math.sqrt(v), s = x / n, a = G / n) : S > R ? S < 0.01 ? (n = 0.707106781, s = 0, a = 0.707106781) : (s = Math.sqrt(S), n = x / s, a = C / s) : R < 0.01 ? (n = 0.707106781, s = 0.707106781, a = 0) : (a = Math.sqrt(R), n = G / a, s = C / a), this.set(n, s, a, t), this;
    }
    let b = Math.sqrt((f - m) * (f - m) + (u - A) * (u - A) + (h - d) * (h - d));
    return Math.abs(b) < 1e-3 && (b = 1), this.x = (f - m) / b, this.y = (u - A) / b, this.z = (h - d) / b, this.w = Math.acos((c + g + p - 1) / 2), this;
  }

  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
  }

  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }

  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }

  clamp(e, t) {
    return this.x = ke(this.x, e.x, t.x), this.y = ke(this.y, e.y, t.y), this.z = ke(this.z, e.z, t.z), this.w = ke(this.w, e.w, t.w), this;
  }

  clampScalar(e, t) {
    return this.x = ke(this.x, e, t), this.y = ke(this.y, e, t), this.z = ke(this.z, e, t), this.w = ke(this.w, e, t), this;
  }

  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(ke(n, e, t));
  }

  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }

  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }

  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }

  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }

  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }

  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }

  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }

  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
  }

  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }

  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }

  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }

  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }

  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
};
yl.prototype.isVector4 = !0;
let rt = yl;
class tg extends _i {


  constructor(e = 1, t = 1, n = {}) {
    super(), n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Mt,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1,
      depth: 1,
      multiview: !1
    }, n), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = n.depth, this.scissor = new rt(0, 0, e, t), this.scissorTest = !1, this.viewport = new rt(0, 0, e, t), this.textures = [];
    const s = { width: e, height: t, depth: n.depth }, a = new Gt(s), r = n.count;
    for (let o = 0; o < r; o++)
      this.textures[o] = a.clone(), this.textures[o].isRenderTargetTexture = !0, this.textures[o].renderTarget = this;
    this._setTextureOptions(n), this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview;
  }
  _setTextureOptions(e = {}) {
    const t = {
      minFilter: Mt,
      generateMipmaps: !1,
      flipY: !1,
      internalFormat: null
    };
    e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
    for (let n = 0; n < this.textures.length; n++)
      this.textures[n].setValues(t);
  }

  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  set depthTexture(e) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), e !== null && (e.renderTarget = this), this._depthTexture = e;
  }

  get depthTexture() {
    return this._depthTexture;
  }

  setSize(e, t, n = 1) {
    if (this.width !== e || this.height !== t || this.depth !== n) {
      this.width = e, this.height = t, this.depth = n;
      for (let s = 0, a = this.textures.length; s < a; s++)
        this.textures[s].image.width = e, this.textures[s].image.height = t, this.textures[s].image.depth = n, this.textures[s].isData3DTexture !== !0 && (this.textures[s].isArrayTexture = this.textures[s].image.depth > 1);
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }

  clone() {
    return new this.constructor().copy(this);
  }

  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let t = 0, n = e.textures.length; t < n; t++) {
      this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = !0, this.textures[t].renderTarget = this;
      const s = Object.assign({}, e.textures[t].image);
      this.textures[t].source = new al(s);
    }
    return this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this.multiview = e.multiview, this;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Zn extends tg {

  constructor(e = 1, t = 1, n = {}) {
    super(e, t, n), this.isWebGLRenderTarget = !0;
  }
}
class Pd extends Gt {

  constructor(e = null, t = 1, n = 1, s = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: e, width: t, height: n, depth: s }, this.magFilter = Rt, this.minFilter = Rt, this.wrapR = Mn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }

  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }

  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class ng extends Gt {

  constructor(e = null, t = 1, n = 1, s = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: e, width: t, height: n, depth: s }, this.magFilter = Rt, this.minFilter = Rt, this.wrapR = Mn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
const Pa = class Pa {

  constructor(e, t, n, s, a, r, o, l, c, d, u, h, g, m, A, f) {
    this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, s, a, r, o, l, c, d, u, h, g, m, A, f);
  }

  set(e, t, n, s, a, r, o, l, c, d, u, h, g, m, A, f) {
    const p = this.elements;
    return p[0] = e, p[4] = t, p[8] = n, p[12] = s, p[1] = a, p[5] = r, p[9] = o, p[13] = l, p[2] = c, p[6] = d, p[10] = u, p[14] = h, p[3] = g, p[7] = m, p[11] = A, p[15] = f, this;
  }

  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  clone() {
    return new Pa().fromArray(this.elements);
  }

  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
  }

  copyPosition(e) {
    const t = this.elements, n = e.elements;
    return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
  }

  setFromMatrix3(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[3],
      t[6],
      0,
      t[1],
      t[4],
      t[7],
      0,
      t[2],
      t[5],
      t[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  extractBasis(e, t, n) {
    return this.determinant() === 0 ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this) : (e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this);
  }

  makeBasis(e, t, n) {
    return this.set(
      e.x,
      t.x,
      n.x,
      0,
      e.y,
      t.y,
      n.y,
      0,
      e.z,
      t.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  extractRotation(e) {
    if (e.determinant() === 0)
      return this.identity();
    const t = this.elements, n = e.elements, s = 1 / Ti.setFromMatrixColumn(e, 0).length(), a = 1 / Ti.setFromMatrixColumn(e, 1).length(), r = 1 / Ti.setFromMatrixColumn(e, 2).length();
    return t[0] = n[0] * s, t[1] = n[1] * s, t[2] = n[2] * s, t[3] = 0, t[4] = n[4] * a, t[5] = n[5] * a, t[6] = n[6] * a, t[7] = 0, t[8] = n[8] * r, t[9] = n[9] * r, t[10] = n[10] * r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }

  makeRotationFromEuler(e) {
    const t = this.elements, n = e.x, s = e.y, a = e.z, r = Math.cos(n), o = Math.sin(n), l = Math.cos(s), c = Math.sin(s), d = Math.cos(a), u = Math.sin(a);
    if (e.order === "XYZ") {
      const h = r * d, g = r * u, m = o * d, A = o * u;
      t[0] = l * d, t[4] = -l * u, t[8] = c, t[1] = g + m * c, t[5] = h - A * c, t[9] = -o * l, t[2] = A - h * c, t[6] = m + g * c, t[10] = r * l;
    } else if (e.order === "YXZ") {
      const h = l * d, g = l * u, m = c * d, A = c * u;
      t[0] = h + A * o, t[4] = m * o - g, t[8] = r * c, t[1] = r * u, t[5] = r * d, t[9] = -o, t[2] = g * o - m, t[6] = A + h * o, t[10] = r * l;
    } else if (e.order === "ZXY") {
      const h = l * d, g = l * u, m = c * d, A = c * u;
      t[0] = h - A * o, t[4] = -r * u, t[8] = m + g * o, t[1] = g + m * o, t[5] = r * d, t[9] = A - h * o, t[2] = -r * c, t[6] = o, t[10] = r * l;
    } else if (e.order === "ZYX") {
      const h = r * d, g = r * u, m = o * d, A = o * u;
      t[0] = l * d, t[4] = m * c - g, t[8] = h * c + A, t[1] = l * u, t[5] = A * c + h, t[9] = g * c - m, t[2] = -c, t[6] = o * l, t[10] = r * l;
    } else if (e.order === "YZX") {
      const h = r * l, g = r * c, m = o * l, A = o * c;
      t[0] = l * d, t[4] = A - h * u, t[8] = m * u + g, t[1] = u, t[5] = r * d, t[9] = -o * d, t[2] = -c * d, t[6] = g * u + m, t[10] = h - A * u;
    } else if (e.order === "XZY") {
      const h = r * l, g = r * c, m = o * l, A = o * c;
      t[0] = l * d, t[4] = -u, t[8] = c * d, t[1] = h * u + A, t[5] = r * d, t[9] = g * u - m, t[2] = m * u - g, t[6] = o * d, t[10] = A * u + h;
    }
    return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }

  makeRotationFromQuaternion(e) {
    return this.compose(ig, e, sg);
  }

  lookAt(e, t, n) {
    const s = this.elements;
    return Qt.subVectors(e, t), Qt.lengthSq() === 0 && (Qt.z = 1), Qt.normalize(), ni.crossVectors(n, Qt), ni.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Qt.x += 1e-4 : Qt.z += 1e-4, Qt.normalize(), ni.crossVectors(n, Qt)), ni.normalize(), Js.crossVectors(Qt, ni), s[0] = ni.x, s[4] = Js.x, s[8] = Qt.x, s[1] = ni.y, s[5] = Js.y, s[9] = Qt.y, s[2] = ni.z, s[6] = Js.z, s[10] = Qt.z, this;
  }

  multiply(e) {
    return this.multiplyMatrices(this, e);
  }

  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }

  multiplyMatrices(e, t) {
    const n = e.elements, s = t.elements, a = this.elements, r = n[0], o = n[4], l = n[8], c = n[12], d = n[1], u = n[5], h = n[9], g = n[13], m = n[2], A = n[6], f = n[10], p = n[14], b = n[3], v = n[7], S = n[11], R = n[15], x = s[0], G = s[4], C = s[8], w = s[12], T = s[1], M = s[5], Z = s[9], U = s[13], H = s[2], F = s[6], L = s[10], P = s[14], j = s[3], $ = s[7], ce = s[11], Ce = s[15];
    return a[0] = r * x + o * T + l * H + c * j, a[4] = r * G + o * M + l * F + c * $, a[8] = r * C + o * Z + l * L + c * ce, a[12] = r * w + o * U + l * P + c * Ce, a[1] = d * x + u * T + h * H + g * j, a[5] = d * G + u * M + h * F + g * $, a[9] = d * C + u * Z + h * L + g * ce, a[13] = d * w + u * U + h * P + g * Ce, a[2] = m * x + A * T + f * H + p * j, a[6] = m * G + A * M + f * F + p * $, a[10] = m * C + A * Z + f * L + p * ce, a[14] = m * w + A * U + f * P + p * Ce, a[3] = b * x + v * T + S * H + R * j, a[7] = b * G + v * M + S * F + R * $, a[11] = b * C + v * Z + S * L + R * ce, a[15] = b * w + v * U + S * P + R * Ce, this;
  }

  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }

  determinant() {
    const e = this.elements, t = e[0], n = e[4], s = e[8], a = e[12], r = e[1], o = e[5], l = e[9], c = e[13], d = e[2], u = e[6], h = e[10], g = e[14], m = e[3], A = e[7], f = e[11], p = e[15], b = l * g - c * h, v = o * g - c * u, S = o * h - l * u, R = r * g - c * d, x = r * h - l * d, G = r * u - o * d;
    return t * (A * b - f * v + p * S) - n * (m * b - f * R + p * x) + s * (m * v - A * R + p * G) - a * (m * S - A * x + f * G);
  }

  transpose() {
    const e = this.elements;
    let t;
    return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
  }

  setPosition(e, t, n) {
    const s = this.elements;
    return e.isVector3 ? (s[12] = e.x, s[13] = e.y, s[14] = e.z) : (s[12] = e, s[13] = t, s[14] = n), this;
  }

  invert() {
    const e = this.elements, t = e[0], n = e[1], s = e[2], a = e[3], r = e[4], o = e[5], l = e[6], c = e[7], d = e[8], u = e[9], h = e[10], g = e[11], m = e[12], A = e[13], f = e[14], p = e[15], b = t * o - n * r, v = t * l - s * r, S = t * c - a * r, R = n * l - s * o, x = n * c - a * o, G = s * c - a * l, C = d * A - u * m, w = d * f - h * m, T = d * p - g * m, M = u * f - h * A, Z = u * p - g * A, U = h * p - g * f, H = b * U - v * Z + S * M + R * T - x * w + G * C;
    if (H === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const F = 1 / H;
    return e[0] = (o * U - l * Z + c * M) * F, e[1] = (s * Z - n * U - a * M) * F, e[2] = (A * G - f * x + p * R) * F, e[3] = (h * x - u * G - g * R) * F, e[4] = (l * T - r * U - c * w) * F, e[5] = (t * U - s * T + a * w) * F, e[6] = (f * S - m * G - p * v) * F, e[7] = (d * G - h * S + g * v) * F, e[8] = (r * Z - o * T + c * C) * F, e[9] = (n * T - t * Z - a * C) * F, e[10] = (m * x - A * S + p * b) * F, e[11] = (u * S - d * x - g * b) * F, e[12] = (o * w - r * M - l * C) * F, e[13] = (t * M - n * w + s * C) * F, e[14] = (A * v - m * R - f * b) * F, e[15] = (d * R - u * v + h * b) * F, this;
  }

  scale(e) {
    const t = this.elements, n = e.x, s = e.y, a = e.z;
    return t[0] *= n, t[4] *= s, t[8] *= a, t[1] *= n, t[5] *= s, t[9] *= a, t[2] *= n, t[6] *= s, t[10] *= a, t[3] *= n, t[7] *= s, t[11] *= a, this;
  }

  getMaxScaleOnAxis() {
    const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], s = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, n, s));
  }

  makeTranslation(e, t, n) {
    return e.isVector3 ? this.set(
      1,
      0,
      0,
      e.x,
      0,
      1,
      0,
      e.y,
      0,
      0,
      1,
      e.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      e,
      0,
      1,
      0,
      t,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }

  makeRotationX(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      t,
      -n,
      0,
      0,
      n,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  makeRotationY(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  makeRotationZ(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      -n,
      0,
      0,
      n,
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  makeRotationAxis(e, t) {
    const n = Math.cos(t), s = Math.sin(t), a = 1 - n, r = e.x, o = e.y, l = e.z, c = a * r, d = a * o;
    return this.set(
      c * r + n,
      c * o - s * l,
      c * l + s * o,
      0,
      c * o + s * l,
      d * o + n,
      d * l - s * r,
      0,
      c * l - s * o,
      d * l + s * r,
      a * l * l + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  makeScale(e, t, n) {
    return this.set(
      e,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  makeShear(e, t, n, s, a, r) {
    return this.set(
      1,
      n,
      a,
      0,
      e,
      1,
      r,
      0,
      t,
      s,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }

  compose(e, t, n) {
    const s = this.elements, a = t._x, r = t._y, o = t._z, l = t._w, c = a + a, d = r + r, u = o + o, h = a * c, g = a * d, m = a * u, A = r * d, f = r * u, p = o * u, b = l * c, v = l * d, S = l * u, R = n.x, x = n.y, G = n.z;
    return s[0] = (1 - (A + p)) * R, s[1] = (g + S) * R, s[2] = (m - v) * R, s[3] = 0, s[4] = (g - S) * x, s[5] = (1 - (h + p)) * x, s[6] = (f + b) * x, s[7] = 0, s[8] = (m + v) * G, s[9] = (f - b) * G, s[10] = (1 - (h + A)) * G, s[11] = 0, s[12] = e.x, s[13] = e.y, s[14] = e.z, s[15] = 1, this;
  }

  decompose(e, t, n) {
    const s = this.elements;
    e.x = s[12], e.y = s[13], e.z = s[14];
    const a = this.determinant();
    if (a === 0)
      return n.set(1, 1, 1), t.identity(), this;
    let r = Ti.set(s[0], s[1], s[2]).length();
    const o = Ti.set(s[4], s[5], s[6]).length(), l = Ti.set(s[8], s[9], s[10]).length();
    a < 0 && (r = -r), un.copy(this);
    const c = 1 / r, d = 1 / o, u = 1 / l;
    return un.elements[0] *= c, un.elements[1] *= c, un.elements[2] *= c, un.elements[4] *= d, un.elements[5] *= d, un.elements[6] *= d, un.elements[8] *= u, un.elements[9] *= u, un.elements[10] *= u, t.setFromRotationMatrix(un), n.x = r, n.y = o, n.z = l, this;
  }

  makePerspective(e, t, n, s, a, r, o = Gn, l = !1) {
    const c = this.elements, d = 2 * a / (t - e), u = 2 * a / (n - s), h = (t + e) / (t - e), g = (n + s) / (n - s);
    let m, A;
    if (l)
      m = a / (r - a), A = r * a / (r - a);
    else if (o === Gn)
      m = -(r + a) / (r - a), A = -2 * r * a / (r - a);
    else if (o === Us)
      m = -r / (r - a), A = -r * a / (r - a);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return c[0] = d, c[4] = 0, c[8] = h, c[12] = 0, c[1] = 0, c[5] = u, c[9] = g, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = m, c[14] = A, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
  }

  makeOrthographic(e, t, n, s, a, r, o = Gn, l = !1) {
    const c = this.elements, d = 2 / (t - e), u = 2 / (n - s), h = -(t + e) / (t - e), g = -(n + s) / (n - s);
    let m, A;
    if (l)
      m = 1 / (r - a), A = r / (r - a);
    else if (o === Gn)
      m = -2 / (r - a), A = -(r + a) / (r - a);
    else if (o === Us)
      m = -1 / (r - a), A = -a / (r - a);
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return c[0] = d, c[4] = 0, c[8] = 0, c[12] = h, c[1] = 0, c[5] = u, c[9] = 0, c[13] = g, c[2] = 0, c[6] = 0, c[10] = m, c[14] = A, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
  }

  equals(e) {
    const t = this.elements, n = e.elements;
    for (let s = 0; s < 16; s++)
      if (t[s] !== n[s]) return !1;
    return !0;
  }

  fromArray(e, t = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = e[n + t];
    return this;
  }

  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
  }
};
Pa.prototype.isMatrix4 = !0;
let Ue = Pa;
const Ti = /* @__PURE__ */ new N(), un = /* @__PURE__ */ new Ue(), ig = /* @__PURE__ */ new N(0, 0, 0), sg = /* @__PURE__ */ new N(1, 1, 1), ni = /* @__PURE__ */ new N(), Js = /* @__PURE__ */ new N(), Qt = /* @__PURE__ */ new N(), $l = /* @__PURE__ */ new Ue(), ec = /* @__PURE__ */ new jn();
class ui {

  constructor(e = 0, t = 0, n = 0, s = ui.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = e, this._y = t, this._z = n, this._order = s;
  }

  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }

  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }

  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }

  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }

  set(e, t, n, s = this._order) {
    return this._x = e, this._y = t, this._z = n, this._order = s, this._onChangeCallback(), this;
  }

  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }

  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }

  setFromRotationMatrix(e, t = this._order, n = !0) {
    const s = e.elements, a = s[0], r = s[4], o = s[8], l = s[1], c = s[5], d = s[9], u = s[2], h = s[6], g = s[10];
    switch (t) {
      case "XYZ":
        this._y = Math.asin(ke(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-d, g), this._z = Math.atan2(-r, a)) : (this._x = Math.atan2(h, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-ke(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(o, g), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-u, a), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(ke(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(-u, g), this._z = Math.atan2(-r, c)) : (this._y = 0, this._z = Math.atan2(l, a));
        break;
      case "ZYX":
        this._y = Math.asin(-ke(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(h, g), this._z = Math.atan2(l, a)) : (this._x = 0, this._z = Math.atan2(-r, c));
        break;
      case "YZX":
        this._z = Math.asin(ke(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-d, c), this._y = Math.atan2(-u, a)) : (this._x = 0, this._y = Math.atan2(o, g));
        break;
      case "XZY":
        this._z = Math.asin(-ke(r, -1, 1)), Math.abs(r) < 0.9999999 ? (this._x = Math.atan2(h, c), this._y = Math.atan2(o, a)) : (this._x = Math.atan2(-d, g), this._y = 0);
        break;
      default:
        Ae("Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return this._order = t, n === !0 && this._onChangeCallback(), this;
  }

  setFromQuaternion(e, t, n) {
    return $l.makeRotationFromQuaternion(e), this.setFromRotationMatrix($l, t, n);
  }

  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }

  reorder(e) {
    return ec.setFromEuler(this), this.setFromQuaternion(ec, e);
  }

  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }

  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }

  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
ui.DEFAULT_ORDER = "XYZ";
class kd {

  constructor() {
    this.mask = 1;
  }

  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }

  enable(e) {
    this.mask |= 1 << e | 0;
  }

  enableAll() {
    this.mask = -1;
  }

  toggle(e) {
    this.mask ^= 1 << e | 0;
  }

  disable(e) {
    this.mask &= ~(1 << e | 0);
  }

  disableAll() {
    this.mask = 0;
  }

  test(e) {
    return (this.mask & e.mask) !== 0;
  }

  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let ag = 0;
const tc = /* @__PURE__ */ new N(), Zi = /* @__PURE__ */ new jn(), Wn = /* @__PURE__ */ new Ue(), Ks = /* @__PURE__ */ new N(), gs = /* @__PURE__ */ new N(), rg = /* @__PURE__ */ new N(), og = /* @__PURE__ */ new jn(), nc = /* @__PURE__ */ new N(1, 0, 0), ic = /* @__PURE__ */ new N(0, 1, 0), sc = /* @__PURE__ */ new N(0, 0, 1), ac = { type: "added" }, lg = { type: "removed" }, Bi = { type: "childadded", child: null }, ur = { type: "childremoved", child: null };
class dt extends _i {

  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: ag++ }), this.uuid = mn(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = dt.DEFAULT_UP.clone();
    const e = new N(), t = new ui(), n = new jn(), s = new N(1, 1, 1);
    function a() {
      n.setFromEuler(t, !1);
    }
    function r() {
      t.setFromQuaternion(n, void 0, !1);
    }
    t._onChange(a), n._onChange(r), Object.defineProperties(this, {

      position: {
        configurable: !0,
        enumerable: !0,
        value: e
      },

      rotation: {
        configurable: !0,
        enumerable: !0,
        value: t
      },

      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },

      scale: {
        configurable: !0,
        enumerable: !0,
        value: s
      },

      modelViewMatrix: {
        value: new Ue()
      },

      normalMatrix: {
        value: new Ne()
      }
    }), this.matrix = new Ue(), this.matrixWorld = new Ue(), this.matrixAutoUpdate = dt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new kd(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.static = !1, this.userData = {}, this.pivot = null;
  }

  onBeforeShadow() {
  }

  onAfterShadow() {
  }

  onBeforeRender() {
  }

  onAfterRender() {
  }

  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }

  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }

  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }

  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, !0);
  }

  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }

  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }

  rotateOnAxis(e, t) {
    return Zi.setFromAxisAngle(e, t), this.quaternion.multiply(Zi), this;
  }

  rotateOnWorldAxis(e, t) {
    return Zi.setFromAxisAngle(e, t), this.quaternion.premultiply(Zi), this;
  }

  rotateX(e) {
    return this.rotateOnAxis(nc, e);
  }

  rotateY(e) {
    return this.rotateOnAxis(ic, e);
  }

  rotateZ(e) {
    return this.rotateOnAxis(sc, e);
  }

  translateOnAxis(e, t) {
    return tc.copy(e).applyQuaternion(this.quaternion), this.position.add(tc.multiplyScalar(t)), this;
  }

  translateX(e) {
    return this.translateOnAxis(nc, e);
  }

  translateY(e) {
    return this.translateOnAxis(ic, e);
  }

  translateZ(e) {
    return this.translateOnAxis(sc, e);
  }

  localToWorld(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
  }

  worldToLocal(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(Wn.copy(this.matrixWorld).invert());
  }

  lookAt(e, t, n) {
    e.isVector3 ? Ks.copy(e) : Ks.set(e, t, n);
    const s = this.parent;
    this.updateWorldMatrix(!0, !1), gs.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Wn.lookAt(gs, Ks, this.up) : Wn.lookAt(Ks, gs, this.up), this.quaternion.setFromRotationMatrix(Wn), s && (Wn.extractRotation(s.matrixWorld), Zi.setFromRotationMatrix(Wn), this.quaternion.premultiply(Zi.invert()));
  }

  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++)
        this.add(arguments[t]);
      return this;
    }
    return e === this ? (we("Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(ac), Bi.child = e, this.dispatchEvent(Bi), Bi.child = null) : we("Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }

  remove(e) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const t = this.children.indexOf(e);
    return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(lg), ur.child = e, this.dispatchEvent(ur), ur.child = null), this;
  }

  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }

  clear() {
    return this.remove(...this.children);
  }

  attach(e) {
    return this.updateWorldMatrix(!0, !1), Wn.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), Wn.multiply(e.parent.matrixWorld)), e.applyMatrix4(Wn), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(ac), Bi.child = e, this.dispatchEvent(Bi), Bi.child = null, this;
  }

  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }

  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }

  getObjectByProperty(e, t) {
    if (this[e] === t) return this;
    for (let n = 0, s = this.children.length; n < s; n++) {
      const r = this.children[n].getObjectByProperty(e, t);
      if (r !== void 0)
        return r;
    }
  }

  getObjectsByProperty(e, t, n = []) {
    this[e] === t && n.push(this);
    const s = this.children;
    for (let a = 0, r = s.length; a < r; a++)
      s[a].getObjectsByProperty(e, t, n);
    return n;
  }

  getWorldPosition(e) {
    return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
  }

  getWorldQuaternion(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(gs, e, rg), e;
  }

  getWorldScale(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(gs, og, e), e;
  }

  getWorldDirection(e) {
    this.updateWorldMatrix(!0, !1);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }

  raycast() {
  }

  traverse(e) {
    e(this);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++)
      t[n].traverse(e);
  }

  traverseVisible(e) {
    if (this.visible === !1) return;
    e(this);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++)
      t[n].traverseVisible(e);
  }

  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }

  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    const e = this.pivot;
    if (e !== null) {
      const t = e.x, n = e.y, s = e.z, a = this.matrix.elements;
      a[12] += t - a[0] * t - a[4] * n - a[8] * s, a[13] += n - a[1] * t - a[5] * n - a[9] * s, a[14] += s - a[2] * t - a[6] * n - a[10] * s;
    }
    this.matrixWorldNeedsUpdate = !0;
  }

  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++)
      t[n].updateMatrixWorld(e);
  }

  updateWorldMatrix(e, t) {
    const n = this.parent;
    if (e === !0 && n !== null && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === !0) {
      const s = this.children;
      for (let a = 0, r = s.length; a < r; a++)
        s[a].updateWorldMatrix(!1, !0);
    }
  }

  toJSON(e) {
    const t = e === void 0 || typeof e == "string", n = {};
    t && (e = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.7,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const s = {};
    s.uuid = this.uuid, s.type = this.type, this.name !== "" && (s.name = this.name), this.castShadow === !0 && (s.castShadow = !0), this.receiveShadow === !0 && (s.receiveShadow = !0), this.visible === !1 && (s.visible = !1), this.frustumCulled === !1 && (s.frustumCulled = !1), this.renderOrder !== 0 && (s.renderOrder = this.renderOrder), this.static !== !1 && (s.static = this.static), Object.keys(this.userData).length > 0 && (s.userData = this.userData), s.layers = this.layers.mask, s.matrix = this.matrix.toArray(), s.up = this.up.toArray(), this.pivot !== null && (s.pivot = this.pivot.toArray()), this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1), this.morphTargetDictionary !== void 0 && (s.morphTargetDictionary = Object.assign({}, this.morphTargetDictionary)), this.morphTargetInfluences !== void 0 && (s.morphTargetInfluences = this.morphTargetInfluences.slice()), this.isInstancedMesh && (s.type = "InstancedMesh", s.count = this.count, s.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (s.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (s.type = "BatchedMesh", s.perObjectFrustumCulled = this.perObjectFrustumCulled, s.sortObjects = this.sortObjects, s.drawRanges = this._drawRanges, s.reservedRanges = this._reservedRanges, s.geometryInfo = this._geometryInfo.map((o) => ({
      ...o,
      boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0,
      boundingSphere: o.boundingSphere ? o.boundingSphere.toJSON() : void 0
    })), s.instanceInfo = this._instanceInfo.map((o) => ({ ...o })), s.availableInstanceIds = this._availableInstanceIds.slice(), s.availableGeometryIds = this._availableGeometryIds.slice(), s.nextIndexStart = this._nextIndexStart, s.nextVertexStart = this._nextVertexStart, s.geometryCount = this._geometryCount, s.maxInstanceCount = this._maxInstanceCount, s.maxVertexCount = this._maxVertexCount, s.maxIndexCount = this._maxIndexCount, s.geometryInitialized = this._geometryInitialized, s.matricesTexture = this._matricesTexture.toJSON(e), s.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (s.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (s.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (s.boundingBox = this.boundingBox.toJSON()));
    function a(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(e)), l.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? s.background = this.background.toJSON() : this.background.isTexture && (s.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (s.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      s.geometry = a(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l))
          for (let c = 0, d = l.length; c < d; c++) {
            const u = l[c];
            a(e.shapes, u);
          }
        else
          a(e.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (s.bindMode = this.bindMode, s.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (a(e.skeletons, this.skeleton), s.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let l = 0, c = this.material.length; l < c; l++)
          o.push(a(e.materials, this.material[l]));
        s.material = o;
      } else
        s.material = a(e.materials, this.material);
    if (this.children.length > 0) {
      s.children = [];
      for (let o = 0; o < this.children.length; o++)
        s.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      s.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        s.animations.push(a(e.animations, l));
      }
    }
    if (t) {
      const o = r(e.geometries), l = r(e.materials), c = r(e.textures), d = r(e.images), u = r(e.shapes), h = r(e.skeletons), g = r(e.animations), m = r(e.nodes);
      o.length > 0 && (n.geometries = o), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), d.length > 0 && (n.images = d), u.length > 0 && (n.shapes = u), h.length > 0 && (n.skeletons = h), g.length > 0 && (n.animations = g), m.length > 0 && (n.nodes = m);
    }
    return n.object = s, n;
    function r(o) {
      const l = [];
      for (const c in o) {
        const d = o[c];
        delete d.metadata, l.push(d);
      }
      return l;
    }
  }

  clone(e) {
    return new this.constructor().copy(this, e);
  }

  copy(e, t = !0) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.pivot = e.pivot !== null ? e.pivot.clone() : null, this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.static = e.static, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0)
      for (let n = 0; n < e.children.length; n++) {
        const s = e.children[n];
        this.add(s.clone());
      }
    return this;
  }
}
dt.DEFAULT_UP = /* @__PURE__ */ new N(0, 1, 0);
dt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
class ht extends dt {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const cg = { type: "move" };
class gr {

  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }

  getHandSpace() {
    return this._hand === null && (this._hand = new ht(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }

  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new ht(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new N(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new N()), this._targetRay;
  }

  getGripSpace() {
    return this._grip === null && (this._grip = new ht(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new N(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new N(), this._grip.eventsEnabled = !1), this._grip;
  }

  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }

  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t)
        for (const n of e.hand.values())
          this._getHandJoint(t, n);
    }
    return this.dispatchEvent({ type: "connected", data: e }), this;
  }

  disconnect(e) {
    return this.dispatchEvent({ type: "disconnected", data: e }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }

  update(e, t, n) {
    let s = null, a = null, r = null;
    const o = this._targetRay, l = this._grip, c = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (c && e.hand) {
        r = !0;
        for (const A of e.hand.values()) {
          const f = t.getJointPose(A, n), p = this._getHandJoint(c, A);
          f !== null && (p.matrix.fromArray(f.transform.matrix), p.matrix.decompose(p.position, p.rotation, p.scale), p.matrixWorldNeedsUpdate = !0, p.jointRadius = f.radius), p.visible = f !== null;
        }
        const d = c.joints["index-finger-tip"], u = c.joints["thumb-tip"], h = d.position.distanceTo(u.position), g = 0.02, m = 5e-3;
        c.inputState.pinching && h > g + m ? (c.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: e.handedness,
          target: this
        })) : !c.inputState.pinching && h <= g - m && (c.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: e.handedness,
          target: this
        }));
      } else
        l !== null && e.gripSpace && (a = t.getPose(e.gripSpace, n), a !== null && (l.matrix.fromArray(a.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, a.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(a.linearVelocity)) : l.hasLinearVelocity = !1, a.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(a.angularVelocity)) : l.hasAngularVelocity = !1, l.eventsEnabled && l.dispatchEvent({
          type: "gripUpdated",
          data: e,
          target: this
        })));
      o !== null && (s = t.getPose(e.targetRaySpace, n), s === null && a !== null && (s = a), s !== null && (o.matrix.fromArray(s.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(s.linearVelocity)) : o.hasLinearVelocity = !1, s.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(s.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(cg)));
    }
    return o !== null && (o.visible = s !== null), l !== null && (l.visible = a !== null), c !== null && (c.visible = r !== null), this;
  }

  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const n = new ht();
      n.matrixAutoUpdate = !1, n.visible = !1, e.joints[t.jointName] = n, e.add(n);
    }
    return e.joints[t.jointName];
  }
}
const Yd = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, ii = { h: 0, s: 0, l: 0 }, js = { h: 0, s: 0, l: 0 };
function pr(i, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? i + (e - i) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? i + (e - i) * 6 * (2 / 3 - t) : i;
}
class Me {

  constructor(e, t, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
  }

  set(e, t, n) {
    if (t === void 0 && n === void 0) {
      const s = e;
      s && s.isColor ? this.copy(s) : typeof s == "number" ? this.setHex(s) : typeof s == "string" && this.setStyle(s);
    } else
      this.setRGB(e, t, n);
    return this;
  }

  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }

  setHex(e, t = wt) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, Pe.colorSpaceToWorking(this, t), this;
  }

  setRGB(e, t, n, s = Pe.workingColorSpace) {
    return this.r = e, this.g = t, this.b = n, Pe.colorSpaceToWorking(this, s), this;
  }

  setHSL(e, t, n, s = Pe.workingColorSpace) {
    if (e = sl(e, 1), t = ke(t, 0, 1), n = ke(n, 0, 1), t === 0)
      this.r = this.g = this.b = n;
    else {
      const a = n <= 0.5 ? n * (1 + t) : n + t - n * t, r = 2 * n - a;
      this.r = pr(r, a, e + 1 / 3), this.g = pr(r, a, e), this.b = pr(r, a, e - 1 / 3);
    }
    return Pe.colorSpaceToWorking(this, s), this;
  }

  setStyle(e, t = wt) {
    function n(a) {
      a !== void 0 && parseFloat(a) < 1 && Ae("Color: Alpha component of " + e + " will be ignored.");
    }
    let s;
    if (s = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let a;
      const r = s[1], o = s[2];
      switch (r) {
        case "rgb":
        case "rgba":
          if (a = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(a[4]), this.setRGB(
              Math.min(255, parseInt(a[1], 10)) / 255,
              Math.min(255, parseInt(a[2], 10)) / 255,
              Math.min(255, parseInt(a[3], 10)) / 255,
              t
            );
          if (a = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(a[4]), this.setRGB(
              Math.min(100, parseInt(a[1], 10)) / 100,
              Math.min(100, parseInt(a[2], 10)) / 100,
              Math.min(100, parseInt(a[3], 10)) / 100,
              t
            );
          break;
        case "hsl":
        case "hsla":
          if (a = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(a[4]), this.setHSL(
              parseFloat(a[1]) / 360,
              parseFloat(a[2]) / 100,
              parseFloat(a[3]) / 100,
              t
            );
          break;
        default:
          Ae("Color: Unknown color model " + e);
      }
    } else if (s = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const a = s[1], r = a.length;
      if (r === 3)
        return this.setRGB(
          parseInt(a.charAt(0), 16) / 15,
          parseInt(a.charAt(1), 16) / 15,
          parseInt(a.charAt(2), 16) / 15,
          t
        );
      if (r === 6)
        return this.setHex(parseInt(a, 16), t);
      Ae("Color: Invalid hex color " + e);
    } else if (e && e.length > 0)
      return this.setColorName(e, t);
    return this;
  }

  setColorName(e, t = wt) {
    const n = Yd[e.toLowerCase()];
    return n !== void 0 ? this.setHex(n, t) : Ae("Color: Unknown color " + e), this;
  }

  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }

  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }

  copySRGBToLinear(e) {
    return this.r = Yn(e.r), this.g = Yn(e.g), this.b = Yn(e.b), this;
  }

  copyLinearToSRGB(e) {
    return this.r = ji(e.r), this.g = ji(e.g), this.b = ji(e.b), this;
  }

  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }

  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }

  getHex(e = wt) {
    return Pe.workingToColorSpace(Ut.copy(this), e), Math.round(ke(Ut.r * 255, 0, 255)) * 65536 + Math.round(ke(Ut.g * 255, 0, 255)) * 256 + Math.round(ke(Ut.b * 255, 0, 255));
  }

  getHexString(e = wt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }

  getHSL(e, t = Pe.workingColorSpace) {
    Pe.workingToColorSpace(Ut.copy(this), t);
    const n = Ut.r, s = Ut.g, a = Ut.b, r = Math.max(n, s, a), o = Math.min(n, s, a);
    let l, c;
    const d = (o + r) / 2;
    if (o === r)
      l = 0, c = 0;
    else {
      const u = r - o;
      switch (c = d <= 0.5 ? u / (r + o) : u / (2 - r - o), r) {
        case n:
          l = (s - a) / u + (s < a ? 6 : 0);
          break;
        case s:
          l = (a - n) / u + 2;
          break;
        case a:
          l = (n - s) / u + 4;
          break;
      }
      l /= 6;
    }
    return e.h = l, e.s = c, e.l = d, e;
  }

  getRGB(e, t = Pe.workingColorSpace) {
    return Pe.workingToColorSpace(Ut.copy(this), t), e.r = Ut.r, e.g = Ut.g, e.b = Ut.b, e;
  }

  getStyle(e = wt) {
    Pe.workingToColorSpace(Ut.copy(this), e);
    const t = Ut.r, n = Ut.g, s = Ut.b;
    return e !== wt ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }

  offsetHSL(e, t, n) {
    return this.getHSL(ii), this.setHSL(ii.h + e, ii.s + t, ii.l + n);
  }

  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }

  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }

  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }

  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }

  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }

  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }

  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }

  lerpColors(e, t, n) {
    return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
  }

  lerpHSL(e, t) {
    this.getHSL(ii), e.getHSL(js);
    const n = Bs(ii.h, js.h, t), s = Bs(ii.s, js.s, t), a = Bs(ii.l, js.l, t);
    return this.setHSL(n, s, a), this;
  }

  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }

  applyMatrix3(e) {
    const t = this.r, n = this.g, s = this.b, a = e.elements;
    return this.r = a[0] * t + a[3] * n + a[6] * s, this.g = a[1] * t + a[4] * n + a[7] * s, this.b = a[2] * t + a[5] * n + a[8] * s, this;
  }

  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }

  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }

  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }

  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }

  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Ut = /* @__PURE__ */ new Me();
Me.NAMES = Yd;
class rl {

  constructor(e, t = 25e-5) {
    this.isFogExp2 = !0, this.name = "", this.color = new Me(e), this.density = t;
  }

  clone() {
    return new rl(this.color, this.density);
  }

  toJSON() {
    return {
      type: "FogExp2",
      name: this.name,
      color: this.color.getHex(),
      density: this.density
    };
  }
}
class dg extends dt {

  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new ui(), this.environmentIntensity = 1, this.environmentRotation = new ui(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, t) {
    return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
  }
}
const gn = /* @__PURE__ */ new N(), Vn = /* @__PURE__ */ new N(), fr = /* @__PURE__ */ new N(), Ln = /* @__PURE__ */ new N(), Ni = /* @__PURE__ */ new N(), Ei = /* @__PURE__ */ new N(), rc = /* @__PURE__ */ new N(), mr = /* @__PURE__ */ new N(), Ir = /* @__PURE__ */ new N(), Cr = /* @__PURE__ */ new N(), br = /* @__PURE__ */ new rt(), Ar = /* @__PURE__ */ new rt(), yr = /* @__PURE__ */ new rt();
class ln {

  constructor(e = new N(), t = new N(), n = new N()) {
    this.a = e, this.b = t, this.c = n;
  }

  static getNormal(e, t, n, s) {
    s.subVectors(n, t), gn.subVectors(e, t), s.cross(gn);
    const a = s.lengthSq();
    return a > 0 ? s.multiplyScalar(1 / Math.sqrt(a)) : s.set(0, 0, 0);
  }

  static getBarycoord(e, t, n, s, a) {
    gn.subVectors(s, t), Vn.subVectors(n, t), fr.subVectors(e, t);
    const r = gn.dot(gn), o = gn.dot(Vn), l = gn.dot(fr), c = Vn.dot(Vn), d = Vn.dot(fr), u = r * c - o * o;
    if (u === 0)
      return a.set(0, 0, 0), null;
    const h = 1 / u, g = (c * l - o * d) * h, m = (r * d - o * l) * h;
    return a.set(1 - g - m, m, g);
  }

  static containsPoint(e, t, n, s) {
    return this.getBarycoord(e, t, n, s, Ln) === null ? !1 : Ln.x >= 0 && Ln.y >= 0 && Ln.x + Ln.y <= 1;
  }

  static getInterpolation(e, t, n, s, a, r, o, l) {
    return this.getBarycoord(e, t, n, s, Ln) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(a, Ln.x), l.addScaledVector(r, Ln.y), l.addScaledVector(o, Ln.z), l);
  }

  static getInterpolatedAttribute(e, t, n, s, a, r) {
    return br.setScalar(0), Ar.setScalar(0), yr.setScalar(0), br.fromBufferAttribute(e, t), Ar.fromBufferAttribute(e, n), yr.fromBufferAttribute(e, s), r.setScalar(0), r.addScaledVector(br, a.x), r.addScaledVector(Ar, a.y), r.addScaledVector(yr, a.z), r;
  }

  static isFrontFacing(e, t, n, s) {
    return gn.subVectors(n, t), Vn.subVectors(e, t), gn.cross(Vn).dot(s) < 0;
  }

  set(e, t, n) {
    return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
  }

  setFromPointsAndIndices(e, t, n, s) {
    return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[s]), this;
  }

  setFromAttributeAndIndices(e, t, n, s) {
    return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, s), this;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }

  getArea() {
    return gn.subVectors(this.c, this.b), Vn.subVectors(this.a, this.b), gn.cross(Vn).length() * 0.5;
  }

  getMidpoint(e) {
    return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }

  getNormal(e) {
    return ln.getNormal(this.a, this.b, this.c, e);
  }

  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }

  getBarycoord(e, t) {
    return ln.getBarycoord(e, this.a, this.b, this.c, t);
  }

  getInterpolation(e, t, n, s, a) {
    return ln.getInterpolation(e, this.a, this.b, this.c, t, n, s, a);
  }

  containsPoint(e) {
    return ln.containsPoint(e, this.a, this.b, this.c);
  }

  isFrontFacing(e) {
    return ln.isFrontFacing(this.a, this.b, this.c, e);
  }

  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }

  closestPointToPoint(e, t) {
    const n = this.a, s = this.b, a = this.c;
    let r, o;
    Ni.subVectors(s, n), Ei.subVectors(a, n), mr.subVectors(e, n);
    const l = Ni.dot(mr), c = Ei.dot(mr);
    if (l <= 0 && c <= 0)
      return t.copy(n);
    Ir.subVectors(e, s);
    const d = Ni.dot(Ir), u = Ei.dot(Ir);
    if (d >= 0 && u <= d)
      return t.copy(s);
    const h = l * u - d * c;
    if (h <= 0 && l >= 0 && d <= 0)
      return r = l / (l - d), t.copy(n).addScaledVector(Ni, r);
    Cr.subVectors(e, a);
    const g = Ni.dot(Cr), m = Ei.dot(Cr);
    if (m >= 0 && g <= m)
      return t.copy(a);
    const A = g * c - l * m;
    if (A <= 0 && c >= 0 && m <= 0)
      return o = c / (c - m), t.copy(n).addScaledVector(Ei, o);
    const f = d * m - g * u;
    if (f <= 0 && u - d >= 0 && g - m >= 0)
      return rc.subVectors(a, s), o = (u - d) / (u - d + (g - m)), t.copy(s).addScaledVector(rc, o);
    const p = 1 / (f + A + h);
    return r = A * p, o = h * p, t.copy(n).addScaledVector(Ni, r).addScaledVector(Ei, o);
  }

  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
class Qn {

  constructor(e = new N(1 / 0, 1 / 0, 1 / 0), t = new N(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = e, this.max = t;
  }

  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }

  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t += 3)
      this.expandByPoint(pn.fromArray(e, t));
    return this;
  }

  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, n = e.count; t < n; t++)
      this.expandByPoint(pn.fromBufferAttribute(e, t));
    return this;
  }

  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++)
      this.expandByPoint(e[t]);
    return this;
  }

  setFromCenterAndSize(e, t) {
    const n = pn.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }

  setFromObject(e, t = !1) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }

  clone() {
    return new this.constructor().copy(this);
  }

  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }

  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }

  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }

  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }

  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }

  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }

  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }

  expandByObject(e, t = !1) {
    e.updateWorldMatrix(!1, !1);
    const n = e.geometry;
    if (n !== void 0) {
      const a = n.getAttribute("position");
      if (t === !0 && a !== void 0 && e.isInstancedMesh !== !0)
        for (let r = 0, o = a.count; r < o; r++)
          e.isMesh === !0 ? e.getVertexPosition(r, pn) : pn.fromBufferAttribute(a, r), pn.applyMatrix4(e.matrixWorld), this.expandByPoint(pn);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), Qs.copy(e.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), Qs.copy(n.boundingBox)), Qs.applyMatrix4(e.matrixWorld), this.union(Qs);
    }
    const s = e.children;
    for (let a = 0, r = s.length; a < r; a++)
      this.expandByObject(s[a], t);
    return this;
  }

  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }

  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }

  getParameter(e, t) {
    return t.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z)
    );
  }

  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }

  intersectsSphere(e) {
    return this.clampPoint(e.center, pn), pn.distanceToSquared(e.center) <= e.radius * e.radius;
  }

  intersectsPlane(e) {
    let t, n;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
  }

  intersectsTriangle(e) {
    if (this.isEmpty())
      return !1;
    this.getCenter(ps), qs.subVectors(this.max, ps), Fi.subVectors(e.a, ps), Wi.subVectors(e.b, ps), Vi.subVectors(e.c, ps), si.subVectors(Wi, Fi), ai.subVectors(Vi, Wi), pi.subVectors(Fi, Vi);
    let t = [
      0,
      -si.z,
      si.y,
      0,
      -ai.z,
      ai.y,
      0,
      -pi.z,
      pi.y,
      si.z,
      0,
      -si.x,
      ai.z,
      0,
      -ai.x,
      pi.z,
      0,
      -pi.x,
      -si.y,
      si.x,
      0,
      -ai.y,
      ai.x,
      0,
      -pi.y,
      pi.x,
      0
    ];
    return !Sr(t, Fi, Wi, Vi, qs) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Sr(t, Fi, Wi, Vi, qs)) ? !1 : ($s.crossVectors(si, ai), t = [$s.x, $s.y, $s.z], Sr(t, Fi, Wi, Vi, qs));
  }

  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }

  distanceToPoint(e) {
    return this.clampPoint(e, pn).distanceTo(e);
  }

  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(pn).length() * 0.5), e;
  }

  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }

  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }

  applyMatrix4(e) {
    return this.isEmpty() ? this : (Un[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), Un[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), Un[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), Un[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), Un[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), Un[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), Un[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), Un[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(Un), this);
  }

  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }

  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }

  toJSON() {
    return {
      min: this.min.toArray(),
      max: this.max.toArray()
    };
  }

  fromJSON(e) {
    return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
  }
}
const Un = [
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N(),
  /* @__PURE__ */ new N()
], pn = /* @__PURE__ */ new N(), Qs = /* @__PURE__ */ new Qn(), Fi = /* @__PURE__ */ new N(), Wi = /* @__PURE__ */ new N(), Vi = /* @__PURE__ */ new N(), si = /* @__PURE__ */ new N(), ai = /* @__PURE__ */ new N(), pi = /* @__PURE__ */ new N(), ps = /* @__PURE__ */ new N(), qs = /* @__PURE__ */ new N(), $s = /* @__PURE__ */ new N(), fi = /* @__PURE__ */ new N();
function Sr(i, e, t, n, s) {
  for (let a = 0, r = i.length - 3; a <= r; a += 3) {
    fi.fromArray(i, a);
    const o = s.x * Math.abs(fi.x) + s.y * Math.abs(fi.y) + s.z * Math.abs(fi.z), l = e.dot(fi), c = t.dot(fi), d = n.dot(fi);
    if (Math.max(-Math.max(l, c, d), Math.min(l, c, d)) > o)
      return !1;
  }
  return !0;
}
const St = /* @__PURE__ */ new N(), ea = /* @__PURE__ */ new Te();
let hg = 0;
class zt extends _i {

  constructor(e, t, n = !1) {
    if (super(), Array.isArray(e))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: hg++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = n, this.usage = Uo, this.updateRanges = [], this.gpuType = cn, this.version = 0;
  }

  onUploadCallback() {
  }

  set needsUpdate(e) {
    e === !0 && this.version++;
  }

  setUsage(e) {
    return this.usage = e, this;
  }

  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }

  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }

  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }

  copyAt(e, t, n) {
    e *= this.itemSize, n *= t.itemSize;
    for (let s = 0, a = this.itemSize; s < a; s++)
      this.array[e + s] = t.array[n + s];
    return this;
  }

  copyArray(e) {
    return this.array.set(e), this;
  }

  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let t = 0, n = this.count; t < n; t++)
        ea.fromBufferAttribute(this, t), ea.applyMatrix3(e), this.setXY(t, ea.x, ea.y);
    else if (this.itemSize === 3)
      for (let t = 0, n = this.count; t < n; t++)
        St.fromBufferAttribute(this, t), St.applyMatrix3(e), this.setXYZ(t, St.x, St.y, St.z);
    return this;
  }

  applyMatrix4(e) {
    for (let t = 0, n = this.count; t < n; t++)
      St.fromBufferAttribute(this, t), St.applyMatrix4(e), this.setXYZ(t, St.x, St.y, St.z);
    return this;
  }

  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      St.fromBufferAttribute(this, t), St.applyNormalMatrix(e), this.setXYZ(t, St.x, St.y, St.z);
    return this;
  }

  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      St.fromBufferAttribute(this, t), St.transformDirection(e), this.setXYZ(t, St.x, St.y, St.z);
    return this;
  }

  set(e, t = 0) {
    return this.array.set(e, t), this;
  }

  getComponent(e, t) {
    let n = this.array[e * this.itemSize + t];
    return this.normalized && (n = fn(n, this.array)), n;
  }

  setComponent(e, t, n) {
    return this.normalized && (n = qe(n, this.array)), this.array[e * this.itemSize + t] = n, this;
  }

  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  setX(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.array[e * this.itemSize] = t, this;
  }

  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  setY(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }

  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  setZ(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }

  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  setW(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }

  setXY(e, t, n) {
    return e *= this.itemSize, this.normalized && (t = qe(t, this.array), n = qe(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
  }

  setXYZ(e, t, n, s) {
    return e *= this.itemSize, this.normalized && (t = qe(t, this.array), n = qe(n, this.array), s = qe(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = s, this;
  }

  setXYZW(e, t, n, s, a) {
    return e *= this.itemSize, this.normalized && (t = qe(t, this.array), n = qe(n, this.array), s = qe(s, this.array), a = qe(a, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = s, this.array[e + 3] = a, this;
  }

  onUpload(e) {
    return this.onUploadCallback = e, this;
  }

  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }

  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== Uo && (e.usage = this.usage), e;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class zd extends zt {

  constructor(e, t, n) {
    super(new Uint16Array(e), t, n);
  }
}
class Od extends zt {

  constructor(e, t, n) {
    super(new Uint32Array(e), t, n);
  }
}
class Oe extends zt {

  constructor(e, t, n) {
    super(new Float32Array(e), t, n);
  }
}
const ug = /* @__PURE__ */ new Qn(), fs = /* @__PURE__ */ new N(), vr = /* @__PURE__ */ new N();
class En {

  constructor(e = new N(), t = -1) {
    this.isSphere = !0, this.center = e, this.radius = t;
  }

  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }

  setFromPoints(e, t) {
    const n = this.center;
    t !== void 0 ? n.copy(t) : ug.setFromPoints(e).getCenter(n);
    let s = 0;
    for (let a = 0, r = e.length; a < r; a++)
      s = Math.max(s, n.distanceToSquared(e[a]));
    return this.radius = Math.sqrt(s), this;
  }

  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }

  isEmpty() {
    return this.radius < 0;
  }

  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }

  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }

  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }

  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }

  intersectsBox(e) {
    return e.intersectsSphere(this);
  }

  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }

  clampPoint(e, t) {
    const n = this.center.distanceToSquared(e);
    return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }

  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }

  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }

  translate(e) {
    return this.center.add(e), this;
  }

  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    fs.subVectors(e, this.center);
    const t = fs.lengthSq();
    if (t > this.radius * this.radius) {
      const n = Math.sqrt(t), s = (n - this.radius) * 0.5;
      this.center.addScaledVector(fs, s / n), this.radius += s;
    }
    return this;
  }

  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (vr.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(fs.copy(e.center).add(vr)), this.expandByPoint(fs.copy(e.center).sub(vr))), this);
  }

  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  toJSON() {
    return {
      radius: this.radius,
      center: this.center.toArray()
    };
  }

  fromJSON(e) {
    return this.radius = e.radius, this.center.fromArray(e.center), this;
  }
}
let gg = 0;
const sn = /* @__PURE__ */ new Ue(), xr = /* @__PURE__ */ new dt(), Li = /* @__PURE__ */ new N(), qt = /* @__PURE__ */ new Qn(), ms = /* @__PURE__ */ new Qn(), Et = /* @__PURE__ */ new N();
class yt extends _i {

  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: gg++ }), this.uuid = mn(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.indirectOffset = 0, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }

  getIndex() {
    return this.index;
  }

  setIndex(e) {
    return Array.isArray(e) ? this.index = new (Gu(e) ? Od : zd)(e, 1) : this.index = e, this;
  }

  setIndirect(e, t = 0) {
    return this.indirect = e, this.indirectOffset = t, this;
  }

  getIndirect() {
    return this.indirect;
  }

  getAttribute(e) {
    return this.attributes[e];
  }

  setAttribute(e, t) {
    return this.attributes[e] = t, this;
  }

  deleteAttribute(e) {
    return delete this.attributes[e], this;
  }

  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }

  addGroup(e, t, n = 0) {
    this.groups.push({
      start: e,
      count: t,
      materialIndex: n
    });
  }

  clearGroups() {
    this.groups = [];
  }

  setDrawRange(e, t) {
    this.drawRange.start = e, this.drawRange.count = t;
  }

  applyMatrix4(e) {
    const t = this.attributes.position;
    t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const a = new Ne().getNormalMatrix(e);
      n.applyNormalMatrix(a), n.needsUpdate = !0;
    }
    const s = this.attributes.tangent;
    return s !== void 0 && (s.transformDirection(e), s.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }

  applyQuaternion(e) {
    return sn.makeRotationFromQuaternion(e), this.applyMatrix4(sn), this;
  }

  rotateX(e) {
    return sn.makeRotationX(e), this.applyMatrix4(sn), this;
  }

  rotateY(e) {
    return sn.makeRotationY(e), this.applyMatrix4(sn), this;
  }

  rotateZ(e) {
    return sn.makeRotationZ(e), this.applyMatrix4(sn), this;
  }

  translate(e, t, n) {
    return sn.makeTranslation(e, t, n), this.applyMatrix4(sn), this;
  }

  scale(e, t, n) {
    return sn.makeScale(e, t, n), this.applyMatrix4(sn), this;
  }

  lookAt(e) {
    return xr.lookAt(e), xr.updateMatrix(), this.applyMatrix4(xr.matrix), this;
  }

  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(Li).negate(), this.translate(Li.x, Li.y, Li.z), this;
  }

  setFromPoints(e) {
    const t = this.getAttribute("position");
    if (t === void 0) {
      const n = [];
      for (let s = 0, a = e.length; s < a; s++) {
        const r = e[s];
        n.push(r.x, r.y, r.z || 0);
      }
      this.setAttribute("position", new Oe(n, 3));
    } else {
      const n = Math.min(e.length, t.count);
      for (let s = 0; s < n; s++) {
        const a = e[s];
        t.setXYZ(s, a.x, a.y, a.z || 0);
      }
      e.length > t.count && Ae("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = !0;
    }
    return this;
  }

  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Qn());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      we("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new N(-1 / 0, -1 / 0, -1 / 0),
        new N(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (e !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(e), t)
        for (let n = 0, s = t.length; n < s; n++) {
          const a = t[n];
          qt.setFromBufferAttribute(a), this.morphTargetsRelative ? (Et.addVectors(this.boundingBox.min, qt.min), this.boundingBox.expandByPoint(Et), Et.addVectors(this.boundingBox.max, qt.max), this.boundingBox.expandByPoint(Et)) : (this.boundingBox.expandByPoint(qt.min), this.boundingBox.expandByPoint(qt.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && we('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }

  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new En());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      we("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new N(), 1 / 0);
      return;
    }
    if (e) {
      const n = this.boundingSphere.center;
      if (qt.setFromBufferAttribute(e), t)
        for (let a = 0, r = t.length; a < r; a++) {
          const o = t[a];
          ms.setFromBufferAttribute(o), this.morphTargetsRelative ? (Et.addVectors(qt.min, ms.min), qt.expandByPoint(Et), Et.addVectors(qt.max, ms.max), qt.expandByPoint(Et)) : (qt.expandByPoint(ms.min), qt.expandByPoint(ms.max));
        }
      qt.getCenter(n);
      let s = 0;
      for (let a = 0, r = e.count; a < r; a++)
        Et.fromBufferAttribute(e, a), s = Math.max(s, n.distanceToSquared(Et));
      if (t)
        for (let a = 0, r = t.length; a < r; a++) {
          const o = t[a], l = this.morphTargetsRelative;
          for (let c = 0, d = o.count; c < d; c++)
            Et.fromBufferAttribute(o, c), l && (Li.fromBufferAttribute(e, c), Et.add(Li)), s = Math.max(s, n.distanceToSquared(Et));
        }
      this.boundingSphere.radius = Math.sqrt(s), isNaN(this.boundingSphere.radius) && we('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }

  computeTangents() {
    const e = this.index, t = this.attributes;
    if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
      we("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = t.position, s = t.normal, a = t.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new zt(new Float32Array(4 * n.count), 4));
    const r = this.getAttribute("tangent"), o = [], l = [];
    for (let C = 0; C < n.count; C++)
      o[C] = new N(), l[C] = new N();
    const c = new N(), d = new N(), u = new N(), h = new Te(), g = new Te(), m = new Te(), A = new N(), f = new N();
    function p(C, w, T) {
      c.fromBufferAttribute(n, C), d.fromBufferAttribute(n, w), u.fromBufferAttribute(n, T), h.fromBufferAttribute(a, C), g.fromBufferAttribute(a, w), m.fromBufferAttribute(a, T), d.sub(c), u.sub(c), g.sub(h), m.sub(h);
      const M = 1 / (g.x * m.y - m.x * g.y);
      isFinite(M) && (A.copy(d).multiplyScalar(m.y).addScaledVector(u, -g.y).multiplyScalar(M), f.copy(u).multiplyScalar(g.x).addScaledVector(d, -m.x).multiplyScalar(M), o[C].add(A), o[w].add(A), o[T].add(A), l[C].add(f), l[w].add(f), l[T].add(f));
    }
    let b = this.groups;
    b.length === 0 && (b = [{
      start: 0,
      count: e.count
    }]);
    for (let C = 0, w = b.length; C < w; ++C) {
      const T = b[C], M = T.start, Z = T.count;
      for (let U = M, H = M + Z; U < H; U += 3)
        p(
          e.getX(U + 0),
          e.getX(U + 1),
          e.getX(U + 2)
        );
    }
    const v = new N(), S = new N(), R = new N(), x = new N();
    function G(C) {
      R.fromBufferAttribute(s, C), x.copy(R);
      const w = o[C];
      v.copy(w), v.sub(R.multiplyScalar(R.dot(w))).normalize(), S.crossVectors(x, w);
      const M = S.dot(l[C]) < 0 ? -1 : 1;
      r.setXYZW(C, v.x, v.y, v.z, M);
    }
    for (let C = 0, w = b.length; C < w; ++C) {
      const T = b[C], M = T.start, Z = T.count;
      for (let U = M, H = M + Z; U < H; U += 3)
        G(e.getX(U + 0)), G(e.getX(U + 1)), G(e.getX(U + 2));
    }
  }

  computeVertexNormals() {
    const e = this.index, t = this.getAttribute("position");
    if (t !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new zt(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let h = 0, g = n.count; h < g; h++)
          n.setXYZ(h, 0, 0, 0);
      const s = new N(), a = new N(), r = new N(), o = new N(), l = new N(), c = new N(), d = new N(), u = new N();
      if (e)
        for (let h = 0, g = e.count; h < g; h += 3) {
          const m = e.getX(h + 0), A = e.getX(h + 1), f = e.getX(h + 2);
          s.fromBufferAttribute(t, m), a.fromBufferAttribute(t, A), r.fromBufferAttribute(t, f), d.subVectors(r, a), u.subVectors(s, a), d.cross(u), o.fromBufferAttribute(n, m), l.fromBufferAttribute(n, A), c.fromBufferAttribute(n, f), o.add(d), l.add(d), c.add(d), n.setXYZ(m, o.x, o.y, o.z), n.setXYZ(A, l.x, l.y, l.z), n.setXYZ(f, c.x, c.y, c.z);
        }
      else
        for (let h = 0, g = t.count; h < g; h += 3)
          s.fromBufferAttribute(t, h + 0), a.fromBufferAttribute(t, h + 1), r.fromBufferAttribute(t, h + 2), d.subVectors(r, a), u.subVectors(s, a), d.cross(u), n.setXYZ(h + 0, d.x, d.y, d.z), n.setXYZ(h + 1, d.x, d.y, d.z), n.setXYZ(h + 2, d.x, d.y, d.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }

  normalizeNormals() {
    const e = this.attributes.normal;
    for (let t = 0, n = e.count; t < n; t++)
      Et.fromBufferAttribute(e, t), Et.normalize(), e.setXYZ(t, Et.x, Et.y, Et.z);
  }

  toNonIndexed() {
    function e(o, l) {
      const c = o.array, d = o.itemSize, u = o.normalized, h = new c.constructor(l.length * d);
      let g = 0, m = 0;
      for (let A = 0, f = l.length; A < f; A++) {
        o.isInterleavedBufferAttribute ? g = l[A] * o.data.stride + o.offset : g = l[A] * d;
        for (let p = 0; p < d; p++)
          h[m++] = c[g++];
      }
      return new zt(h, d, u);
    }
    if (this.index === null)
      return Ae("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const t = new yt(), n = this.index.array, s = this.attributes;
    for (const o in s) {
      const l = s[o], c = e(l, n);
      t.setAttribute(o, c);
    }
    const a = this.morphAttributes;
    for (const o in a) {
      const l = [], c = a[o];
      for (let d = 0, u = c.length; d < u; d++) {
        const h = c[d], g = e(h, n);
        l.push(g);
      }
      t.morphAttributes[o] = l;
    }
    t.morphTargetsRelative = this.morphTargetsRelative;
    const r = this.groups;
    for (let o = 0, l = r.length; o < l; o++) {
      const c = r[o];
      t.addGroup(c.start, c.count, c.materialIndex);
    }
    return t;
  }

  toJSON() {
    const e = {
      metadata: {
        version: 4.7,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const c in l)
        l[c] !== void 0 && (e[c] = l[c]);
      return e;
    }
    e.data = { attributes: {} };
    const t = this.index;
    t !== null && (e.data.index = {
      type: t.array.constructor.name,
      array: Array.prototype.slice.call(t.array)
    });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      e.data.attributes[l] = c.toJSON(e.data);
    }
    const s = {};
    let a = !1;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l], d = [];
      for (let u = 0, h = c.length; u < h; u++) {
        const g = c[u];
        d.push(g.toJSON(e.data));
      }
      d.length > 0 && (s[l] = d, a = !0);
    }
    a && (e.data.morphAttributes = s, e.data.morphTargetsRelative = this.morphTargetsRelative);
    const r = this.groups;
    r.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(r)));
    const o = this.boundingSphere;
    return o !== null && (e.data.boundingSphere = o.toJSON()), e;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  copy(e) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const t = {};
    this.name = e.name;
    const n = e.index;
    n !== null && this.setIndex(n.clone());
    const s = e.attributes;
    for (const c in s) {
      const d = s[c];
      this.setAttribute(c, d.clone(t));
    }
    const a = e.morphAttributes;
    for (const c in a) {
      const d = [], u = a[c];
      for (let h = 0, g = u.length; h < g; h++)
        d.push(u[h].clone(t));
      this.morphAttributes[c] = d;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const r = e.groups;
    for (let c = 0, d = r.length; c < d; c++) {
      const u = r[c];
      this.addGroup(u.start, u.count, u.materialIndex);
    }
    const o = e.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const l = e.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Jd {

  constructor(e, t) {
    this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = Uo, this.updateRanges = [], this.version = 0, this.uuid = mn();
  }

  onUploadCallback() {
  }

  set needsUpdate(e) {
    e === !0 && this.version++;
  }

  setUsage(e) {
    return this.usage = e, this;
  }

  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }

  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }

  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }

  copyAt(e, t, n) {
    e *= this.stride, n *= t.stride;
    for (let s = 0, a = this.stride; s < a; s++)
      this.array[e + s] = t.array[n + s];
    return this;
  }

  set(e, t = 0) {
    return this.array.set(e, t), this;
  }

  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = mn()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
    return n.setUsage(this.usage), n;
  }

  onUpload(e) {
    return this.onUploadCallback = e, this;
  }

  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = mn()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}
const Ht = /* @__PURE__ */ new N();
class Xs {

  constructor(e, t, n, s = !1) {
    this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = s;
  }

  get count() {
    return this.data.count;
  }

  get array() {
    return this.data.array;
  }

  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }

  applyMatrix4(e) {
    for (let t = 0, n = this.data.count; t < n; t++)
      Ht.fromBufferAttribute(this, t), Ht.applyMatrix4(e), this.setXYZ(t, Ht.x, Ht.y, Ht.z);
    return this;
  }

  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      Ht.fromBufferAttribute(this, t), Ht.applyNormalMatrix(e), this.setXYZ(t, Ht.x, Ht.y, Ht.z);
    return this;
  }

  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      Ht.fromBufferAttribute(this, t), Ht.transformDirection(e), this.setXYZ(t, Ht.x, Ht.y, Ht.z);
    return this;
  }

  getComponent(e, t) {
    let n = this.array[e * this.data.stride + this.offset + t];
    return this.normalized && (n = fn(n, this.array)), n;
  }

  setComponent(e, t, n) {
    return this.normalized && (n = qe(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
  }

  setX(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
  }

  setY(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
  }

  setZ(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
  }

  setW(e, t) {
    return this.normalized && (t = qe(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
  }

  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return this.normalized && (t = fn(t, this.array)), t;
  }

  setXY(e, t, n) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = qe(t, this.array), n = qe(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
  }

  setXYZ(e, t, n, s) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = qe(t, this.array), n = qe(n, this.array), s = qe(s, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = s, this;
  }

  setXYZW(e, t, n, s, a) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = qe(t, this.array), n = qe(n, this.array), s = qe(s, this.array), a = qe(a, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = s, this.data.array[e + 3] = a, this;
  }

  clone(e) {
    if (e === void 0) {
      La("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const s = n * this.data.stride + this.offset;
        for (let a = 0; a < this.itemSize; a++)
          t.push(this.data.array[s + a]);
      }
      return new zt(new this.array.constructor(t), this.itemSize, this.normalized);
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new Xs(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }

  toJSON(e) {
    if (e === void 0) {
      La("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const s = n * this.data.stride + this.offset;
        for (let a = 0; a < this.itemSize; a++)
          t.push(this.data.array[s + a]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: t,
        normalized: this.normalized
      };
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
        isInterleavedBufferAttribute: !0,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}
let pg = 0;
class In extends _i {

  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: pg++ }), this.uuid = mn(), this.name = "", this.type = "Material", this.blending = Ki, this.side = zn, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = Qr, this.blendDst = qr, this.blendEquation = Ai, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Me(0, 0, 0), this.blendAlpha = 0, this.depthFunc = qi, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = zl, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Mi, this.stencilZFail = Mi, this.stencilZPass = Mi, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }

  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }

  onBeforeRender() {
  }

  onBeforeCompile() {
  }

  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }

  setValues(e) {
    if (e !== void 0)
      for (const t in e) {
        const n = e[t];
        if (n === void 0) {
          Ae(`Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const s = this[t];
        if (s === void 0) {
          Ae(`Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        s && s.isColor ? s.set(n) : s && s.isVector3 && n && n.isVector3 ? s.copy(n) : this[t] = n;
      }
  }

  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.7,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== Ki && (n.blending = this.blending), this.side !== zn && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== Qr && (n.blendSrc = this.blendSrc), this.blendDst !== qr && (n.blendDst = this.blendDst), this.blendEquation !== Ai && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== qi && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== zl && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Mi && (n.stencilFail = this.stencilFail), this.stencilZFail !== Mi && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Mi && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.allowOverride === !1 && (n.allowOverride = !1), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function s(a) {
      const r = [];
      for (const o in a) {
        const l = a[o];
        delete l.metadata, r.push(l);
      }
      return r;
    }
    if (t) {
      const a = s(e.textures), r = s(e.images);
      a.length > 0 && (n.textures = a), r.length > 0 && (n.images = r);
    }
    return n;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const t = e.clippingPlanes;
    let n = null;
    if (t !== null) {
      const s = t.length;
      n = new Array(s);
      for (let a = 0; a !== s; ++a)
        n[a] = t[a].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.allowOverride = e.allowOverride, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }

  set needsUpdate(e) {
    e === !0 && this.version++;
  }
}
class Kd extends In {

  constructor(e) {
    super(), this.isSpriteMaterial = !0, this.type = "SpriteMaterial", this.color = new Me(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = !0, this.transparent = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.rotation = e.rotation, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
let Ui;
const Is = /* @__PURE__ */ new N(), Di = /* @__PURE__ */ new N(), Xi = /* @__PURE__ */ new N(), Hi = /* @__PURE__ */ new Te(), Cs = /* @__PURE__ */ new Te(), jd = /* @__PURE__ */ new Ue(), ta = /* @__PURE__ */ new N(), bs = /* @__PURE__ */ new N(), na = /* @__PURE__ */ new N(), oc = /* @__PURE__ */ new Te(), _r = /* @__PURE__ */ new Te(), lc = /* @__PURE__ */ new Te();
class fg extends dt {

  constructor(e = new Kd()) {
    if (super(), this.isSprite = !0, this.type = "Sprite", Ui === void 0) {
      Ui = new yt();
      const t = new Float32Array([
        -0.5,
        -0.5,
        0,
        0,
        0,
        0.5,
        -0.5,
        0,
        1,
        0,
        0.5,
        0.5,
        0,
        1,
        1,
        -0.5,
        0.5,
        0,
        0,
        1
      ]), n = new Jd(t, 5);
      Ui.setIndex([0, 1, 2, 0, 2, 3]), Ui.setAttribute("position", new Xs(n, 3, 0, !1)), Ui.setAttribute("uv", new Xs(n, 2, 3, !1));
    }
    this.geometry = Ui, this.material = e, this.center = new Te(0.5, 0.5), this.count = 1;
  }

  raycast(e, t) {
    e.camera === null && we('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Di.setFromMatrixScale(this.matrixWorld), jd.copy(e.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse, this.matrixWorld), Xi.setFromMatrixPosition(this.modelViewMatrix), e.camera.isPerspectiveCamera && this.material.sizeAttenuation === !1 && Di.multiplyScalar(-Xi.z);
    const n = this.material.rotation;
    let s, a;
    n !== 0 && (a = Math.cos(n), s = Math.sin(n));
    const r = this.center;
    ia(ta.set(-0.5, -0.5, 0), Xi, r, Di, s, a), ia(bs.set(0.5, -0.5, 0), Xi, r, Di, s, a), ia(na.set(0.5, 0.5, 0), Xi, r, Di, s, a), oc.set(0, 0), _r.set(1, 0), lc.set(1, 1);
    let o = e.ray.intersectTriangle(ta, bs, na, !1, Is);
    if (o === null && (ia(bs.set(-0.5, 0.5, 0), Xi, r, Di, s, a), _r.set(0, 1), o = e.ray.intersectTriangle(ta, na, bs, !1, Is), o === null))
      return;
    const l = e.ray.origin.distanceTo(Is);
    l < e.near || l > e.far || t.push({
      distance: l,
      point: Is.clone(),
      uv: ln.getInterpolation(Is, ta, bs, na, oc, _r, lc, new Te()),
      face: null,
      object: this
    });
  }
  copy(e, t) {
    return super.copy(e, t), e.center !== void 0 && this.center.copy(e.center), this.material = e.material, this;
  }
}
function ia(i, e, t, n, s, a) {
  Hi.subVectors(i, t).addScalar(0.5).multiply(n), s !== void 0 ? (Cs.x = a * Hi.x - s * Hi.y, Cs.y = s * Hi.x + a * Hi.y) : Cs.copy(Hi), i.copy(e), i.x += Cs.x, i.y += Cs.y, i.applyMatrix4(jd);
}
const Dn = /* @__PURE__ */ new N(), wr = /* @__PURE__ */ new N(), sa = /* @__PURE__ */ new N(), ri = /* @__PURE__ */ new N(), Rr = /* @__PURE__ */ new N(), aa = /* @__PURE__ */ new N(), Mr = /* @__PURE__ */ new N();
class za {

  constructor(e = new N(), t = new N(0, 0, -1)) {
    this.origin = e, this.direction = t;
  }

  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }

  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }

  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }

  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }

  recast(e) {
    return this.origin.copy(this.at(e, Dn)), this;
  }

  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const n = t.dot(this.direction);
    return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
  }

  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }

  distanceSqToPoint(e) {
    const t = Dn.subVectors(e, this.origin).dot(this.direction);
    return t < 0 ? this.origin.distanceToSquared(e) : (Dn.copy(this.origin).addScaledVector(this.direction, t), Dn.distanceToSquared(e));
  }

  distanceSqToSegment(e, t, n, s) {
    wr.copy(e).add(t).multiplyScalar(0.5), sa.copy(t).sub(e).normalize(), ri.copy(this.origin).sub(wr);
    const a = e.distanceTo(t) * 0.5, r = -this.direction.dot(sa), o = ri.dot(this.direction), l = -ri.dot(sa), c = ri.lengthSq(), d = Math.abs(1 - r * r);
    let u, h, g, m;
    if (d > 0)
      if (u = r * l - o, h = r * o - l, m = a * d, u >= 0)
        if (h >= -m)
          if (h <= m) {
            const A = 1 / d;
            u *= A, h *= A, g = u * (u + r * h + 2 * o) + h * (r * u + h + 2 * l) + c;
          } else
            h = a, u = Math.max(0, -(r * h + o)), g = -u * u + h * (h + 2 * l) + c;
        else
          h = -a, u = Math.max(0, -(r * h + o)), g = -u * u + h * (h + 2 * l) + c;
      else
        h <= -m ? (u = Math.max(0, -(-r * a + o)), h = u > 0 ? -a : Math.min(Math.max(-a, -l), a), g = -u * u + h * (h + 2 * l) + c) : h <= m ? (u = 0, h = Math.min(Math.max(-a, -l), a), g = h * (h + 2 * l) + c) : (u = Math.max(0, -(r * a + o)), h = u > 0 ? a : Math.min(Math.max(-a, -l), a), g = -u * u + h * (h + 2 * l) + c);
    else
      h = r > 0 ? -a : a, u = Math.max(0, -(r * h + o)), g = -u * u + h * (h + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, u), s && s.copy(wr).addScaledVector(sa, h), g;
  }

  intersectSphere(e, t) {
    Dn.subVectors(e.center, this.origin);
    const n = Dn.dot(this.direction), s = Dn.dot(Dn) - n * n, a = e.radius * e.radius;
    if (s > a) return null;
    const r = Math.sqrt(a - s), o = n - r, l = n + r;
    return l < 0 ? null : o < 0 ? this.at(l, t) : this.at(o, t);
  }

  intersectsSphere(e) {
    return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }

  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0)
      return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(e.normal) + e.constant) / t;
    return n >= 0 ? n : null;
  }

  intersectPlane(e, t) {
    const n = this.distanceToPlane(e);
    return n === null ? null : this.at(n, t);
  }

  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }

  intersectBox(e, t) {
    let n, s, a, r, o, l;
    const c = 1 / this.direction.x, d = 1 / this.direction.y, u = 1 / this.direction.z, h = this.origin;
    return c >= 0 ? (n = (e.min.x - h.x) * c, s = (e.max.x - h.x) * c) : (n = (e.max.x - h.x) * c, s = (e.min.x - h.x) * c), d >= 0 ? (a = (e.min.y - h.y) * d, r = (e.max.y - h.y) * d) : (a = (e.max.y - h.y) * d, r = (e.min.y - h.y) * d), n > r || a > s || ((a > n || isNaN(n)) && (n = a), (r < s || isNaN(s)) && (s = r), u >= 0 ? (o = (e.min.z - h.z) * u, l = (e.max.z - h.z) * u) : (o = (e.max.z - h.z) * u, l = (e.min.z - h.z) * u), n > l || o > s) || ((o > n || n !== n) && (n = o), (l < s || s !== s) && (s = l), s < 0) ? null : this.at(n >= 0 ? n : s, t);
  }

  intersectsBox(e) {
    return this.intersectBox(e, Dn) !== null;
  }

  intersectTriangle(e, t, n, s, a) {
    Rr.subVectors(t, e), aa.subVectors(n, e), Mr.crossVectors(Rr, aa);
    let r = this.direction.dot(Mr), o;
    if (r > 0) {
      if (s) return null;
      o = 1;
    } else if (r < 0)
      o = -1, r = -r;
    else
      return null;
    ri.subVectors(this.origin, e);
    const l = o * this.direction.dot(aa.crossVectors(ri, aa));
    if (l < 0)
      return null;
    const c = o * this.direction.dot(Rr.cross(ri));
    if (c < 0 || l + c > r)
      return null;
    const d = -o * ri.dot(Mr);
    return d < 0 ? null : this.at(d / r, a);
  }

  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }

  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }

  clone() {
    return new this.constructor().copy(this);
  }
}
class Dt extends In {

  constructor(e) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Me(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new ui(), this.combine = _d, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}
const cc = /* @__PURE__ */ new Ue(), mi = /* @__PURE__ */ new za(), ra = /* @__PURE__ */ new En(), dc = /* @__PURE__ */ new N(), oa = /* @__PURE__ */ new N(), la = /* @__PURE__ */ new N(), ca = /* @__PURE__ */ new N(), Gr = /* @__PURE__ */ new N(), da = /* @__PURE__ */ new N(), hc = /* @__PURE__ */ new N(), ha = /* @__PURE__ */ new N();
class ve extends dt {

  constructor(e = new yt(), t = new Dt()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }

  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let a = 0, r = s.length; a < r; a++) {
          const o = s[a].name || String(a);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = a;
        }
      }
    }
  }

  getVertexPosition(e, t) {
    const n = this.geometry, s = n.attributes.position, a = n.morphAttributes.position, r = n.morphTargetsRelative;
    t.fromBufferAttribute(s, e);
    const o = this.morphTargetInfluences;
    if (a && o) {
      da.set(0, 0, 0);
      for (let l = 0, c = a.length; l < c; l++) {
        const d = o[l], u = a[l];
        d !== 0 && (Gr.fromBufferAttribute(u, e), r ? da.addScaledVector(Gr, d) : da.addScaledVector(Gr.sub(t), d));
      }
      t.add(da);
    }
    return t;
  }

  raycast(e, t) {
    const n = this.geometry, s = this.material, a = this.matrixWorld;
    s !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), ra.copy(n.boundingSphere), ra.applyMatrix4(a), mi.copy(e.ray).recast(e.near), !(ra.containsPoint(mi.origin) === !1 && (mi.intersectSphere(ra, dc) === null || mi.origin.distanceToSquared(dc) > (e.far - e.near) ** 2)) && (cc.copy(a).invert(), mi.copy(e.ray).applyMatrix4(cc), !(n.boundingBox !== null && mi.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(e, t, mi)));
  }
  _computeIntersections(e, t, n) {
    let s;
    const a = this.geometry, r = this.material, o = a.index, l = a.attributes.position, c = a.attributes.uv, d = a.attributes.uv1, u = a.attributes.normal, h = a.groups, g = a.drawRange;
    if (o !== null)
      if (Array.isArray(r))
        for (let m = 0, A = h.length; m < A; m++) {
          const f = h[m], p = r[f.materialIndex], b = Math.max(f.start, g.start), v = Math.min(o.count, Math.min(f.start + f.count, g.start + g.count));
          for (let S = b, R = v; S < R; S += 3) {
            const x = o.getX(S), G = o.getX(S + 1), C = o.getX(S + 2);
            s = ua(this, p, e, n, c, d, u, x, G, C), s && (s.faceIndex = Math.floor(S / 3), s.face.materialIndex = f.materialIndex, t.push(s));
          }
        }
      else {
        const m = Math.max(0, g.start), A = Math.min(o.count, g.start + g.count);
        for (let f = m, p = A; f < p; f += 3) {
          const b = o.getX(f), v = o.getX(f + 1), S = o.getX(f + 2);
          s = ua(this, r, e, n, c, d, u, b, v, S), s && (s.faceIndex = Math.floor(f / 3), t.push(s));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(r))
        for (let m = 0, A = h.length; m < A; m++) {
          const f = h[m], p = r[f.materialIndex], b = Math.max(f.start, g.start), v = Math.min(l.count, Math.min(f.start + f.count, g.start + g.count));
          for (let S = b, R = v; S < R; S += 3) {
            const x = S, G = S + 1, C = S + 2;
            s = ua(this, p, e, n, c, d, u, x, G, C), s && (s.faceIndex = Math.floor(S / 3), s.face.materialIndex = f.materialIndex, t.push(s));
          }
        }
      else {
        const m = Math.max(0, g.start), A = Math.min(l.count, g.start + g.count);
        for (let f = m, p = A; f < p; f += 3) {
          const b = f, v = f + 1, S = f + 2;
          s = ua(this, r, e, n, c, d, u, b, v, S), s && (s.faceIndex = Math.floor(f / 3), t.push(s));
        }
      }
  }
}
function mg(i, e, t, n, s, a, r, o) {
  let l;
  if (e.side === Jt ? l = n.intersectTriangle(r, a, s, !0, o) : l = n.intersectTriangle(s, a, r, e.side === zn, o), l === null) return null;
  ha.copy(o), ha.applyMatrix4(i.matrixWorld);
  const c = t.ray.origin.distanceTo(ha);
  return c < t.near || c > t.far ? null : {
    distance: c,
    point: ha.clone(),
    object: i
  };
}
function ua(i, e, t, n, s, a, r, o, l, c) {
  i.getVertexPosition(o, oa), i.getVertexPosition(l, la), i.getVertexPosition(c, ca);
  const d = mg(i, e, t, n, oa, la, ca, hc);
  if (d) {
    const u = new N();
    ln.getBarycoord(hc, oa, la, ca, u), s && (d.uv = ln.getInterpolatedAttribute(s, o, l, c, u, new Te())), a && (d.uv1 = ln.getInterpolatedAttribute(a, o, l, c, u, new Te())), r && (d.normal = ln.getInterpolatedAttribute(r, o, l, c, u, new N()), d.normal.dot(n.direction) > 0 && d.normal.multiplyScalar(-1));
    const h = {
      a: o,
      b: l,
      c,
      normal: new N(),
      materialIndex: 0
    };
    ln.getNormal(oa, la, ca, h.normal), d.face = h, d.barycoord = u;
  }
  return d;
}
const As = /* @__PURE__ */ new rt(), uc = /* @__PURE__ */ new rt(), gc = /* @__PURE__ */ new rt(), Ig = /* @__PURE__ */ new rt(), pc = /* @__PURE__ */ new Ue(), ga = /* @__PURE__ */ new N(), Tr = /* @__PURE__ */ new En(), fc = /* @__PURE__ */ new Ue(), Zr = /* @__PURE__ */ new za();
class Cg extends ve {

  constructor(e, t) {
    super(e, t), this.isSkinnedMesh = !0, this.type = "SkinnedMesh", this.bindMode = Xl, this.bindMatrix = new Ue(), this.bindMatrixInverse = new Ue(), this.boundingBox = null, this.boundingSphere = null;
  }

  computeBoundingBox() {
    const e = this.geometry;
    this.boundingBox === null && (this.boundingBox = new Qn()), this.boundingBox.makeEmpty();
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++)
      this.getVertexPosition(n, ga), this.boundingBox.expandByPoint(ga);
  }

  computeBoundingSphere() {
    const e = this.geometry;
    this.boundingSphere === null && (this.boundingSphere = new En()), this.boundingSphere.makeEmpty();
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++)
      this.getVertexPosition(n, ga), this.boundingSphere.expandByPoint(ga);
  }
  copy(e, t) {
    return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  raycast(e, t) {
    const n = this.material, s = this.matrixWorld;
    n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Tr.copy(this.boundingSphere), Tr.applyMatrix4(s), e.ray.intersectsSphere(Tr) !== !1 && (fc.copy(s).invert(), Zr.copy(e.ray).applyMatrix4(fc), !(this.boundingBox !== null && Zr.intersectsBox(this.boundingBox) === !1) && this._computeIntersections(e, t, Zr)));
  }
  getVertexPosition(e, t) {
    return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
  }

  bind(e, t) {
    this.skeleton = e, t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
  }

  pose() {
    this.skeleton.pose();
  }

  normalizeSkinWeights() {
    const e = new rt(), t = this.geometry.attributes.skinWeight;
    for (let n = 0, s = t.count; n < s; n++) {
      e.fromBufferAttribute(t, n);
      const a = 1 / e.manhattanLength();
      a !== 1 / 0 ? e.multiplyScalar(a) : e.set(1, 0, 0, 0), t.setXYZW(n, e.x, e.y, e.z, e.w);
    }
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.bindMode === Xl ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === Cu ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : Ae("SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
  }

  applyBoneTransform(e, t) {
    const n = this.skeleton, s = this.geometry;
    uc.fromBufferAttribute(s.attributes.skinIndex, e), gc.fromBufferAttribute(s.attributes.skinWeight, e), t.isVector4 ? (As.copy(t), t.set(0, 0, 0, 0)) : (As.set(...t, 1), t.set(0, 0, 0)), As.applyMatrix4(this.bindMatrix);
    for (let a = 0; a < 4; a++) {
      const r = gc.getComponent(a);
      if (r !== 0) {
        const o = uc.getComponent(a);
        pc.multiplyMatrices(n.bones[o].matrixWorld, n.boneInverses[o]), t.addScaledVector(Ig.copy(As).applyMatrix4(pc), r);
      }
    }
    return t.isVector4 && (t.w = As.w), t.applyMatrix4(this.bindMatrixInverse);
  }
}
class Qd extends dt {

  constructor() {
    super(), this.isBone = !0, this.type = "Bone";
  }
}
class ol extends Gt {

  constructor(e = null, t = 1, n = 1, s, a, r, o, l, c = Rt, d = Rt, u, h) {
    super(null, r, o, l, c, d, s, a, u, h), this.isDataTexture = !0, this.image = { data: e, width: t, height: n }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
const mc = /* @__PURE__ */ new Ue(), bg = /* @__PURE__ */ new Ue();
class ll {

  constructor(e = [], t = []) {
    this.uuid = mn(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.previousBoneMatrices = null, this.boneTexture = null, this.init();
  }

  init() {
    const e = this.bones, t = this.boneInverses;
    if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0)
      this.calculateInverses();
    else if (e.length !== t.length) {
      Ae("Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
      for (let n = 0, s = this.bones.length; n < s; n++)
        this.boneInverses.push(new Ue());
    }
  }

  calculateInverses() {
    this.boneInverses.length = 0;
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = new Ue();
      this.bones[e] && n.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(n);
    }
  }

  pose() {
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && n.matrixWorld.copy(this.boneInverses[e]).invert();
    }
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
    }
  }

  update() {
    const e = this.bones, t = this.boneInverses, n = this.boneMatrices, s = this.boneTexture;
    for (let a = 0, r = e.length; a < r; a++) {
      const o = e[a] ? e[a].matrixWorld : bg;
      mc.multiplyMatrices(o, t[a]), mc.toArray(n, a * 16);
    }
    s !== null && (s.needsUpdate = !0);
  }

  clone() {
    return new ll(this.bones, this.boneInverses);
  }

  computeBoneTexture() {
    let e = Math.sqrt(this.bones.length * 4);
    e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
    const t = new Float32Array(e * e * 4);
    t.set(this.boneMatrices);
    const n = new ol(t, e, e, dn, cn);
    return n.needsUpdate = !0, this.boneMatrices = t, this.boneTexture = n, this;
  }

  getBoneByName(e) {
    for (let t = 0, n = this.bones.length; t < n; t++) {
      const s = this.bones[t];
      if (s.name === e)
        return s;
    }
  }

  dispose() {
    this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
  }

  fromJSON(e, t) {
    this.uuid = e.uuid;
    for (let n = 0, s = e.bones.length; n < s; n++) {
      const a = e.bones[n];
      let r = t[a];
      r === void 0 && (Ae("Skeleton: No bone found with UUID:", a), r = new Qd()), this.bones.push(r), this.boneInverses.push(new Ue().fromArray(e.boneInverses[n]));
    }
    return this.init(), this;
  }

  toJSON() {
    const e = {
      metadata: {
        version: 4.7,
        type: "Skeleton",
        generator: "Skeleton.toJSON"
      },
      bones: [],
      boneInverses: []
    };
    e.uuid = this.uuid;
    const t = this.bones, n = this.boneInverses;
    for (let s = 0, a = t.length; s < a; s++) {
      const r = t[s];
      e.bones.push(r.uuid);
      const o = n[s];
      e.boneInverses.push(o.toArray());
    }
    return e;
  }
}
class Xo extends zt {

  constructor(e, t, n, s = 1) {
    super(e, t, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = s;
  }
  copy(e) {
    return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
  }
  toJSON() {
    const e = super.toJSON();
    return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
  }
}
const Pi = /* @__PURE__ */ new Ue(), Ic = /* @__PURE__ */ new Ue(), pa = [], Cc = /* @__PURE__ */ new Qn(), Ag = /* @__PURE__ */ new Ue(), ys = /* @__PURE__ */ new ve(), Ss = /* @__PURE__ */ new En();
class yg extends ve {

  constructor(e, t, n) {
    super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new Xo(new Float32Array(n * 16), 16), this.previousInstanceMatrix = null, this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
    for (let s = 0; s < n; s++)
      this.setMatrixAt(s, Ag);
  }

  computeBoundingBox() {
    const e = this.geometry, t = this.count;
    this.boundingBox === null && (this.boundingBox = new Qn()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let n = 0; n < t; n++)
      this.getMatrixAt(n, Pi), Cc.copy(e.boundingBox).applyMatrix4(Pi), this.boundingBox.union(Cc);
  }

  computeBoundingSphere() {
    const e = this.geometry, t = this.count;
    this.boundingSphere === null && (this.boundingSphere = new En()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let n = 0; n < t; n++)
      this.getMatrixAt(n, Pi), Ss.copy(e.boundingSphere).applyMatrix4(Pi), this.boundingSphere.union(Ss);
  }
  copy(e, t) {
    return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.previousInstanceMatrix !== null && (this.previousInstanceMatrix = e.previousInstanceMatrix.clone()), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }

  getColorAt(e, t) {
    return this.instanceColor === null ? t.setRGB(1, 1, 1) : t.fromArray(this.instanceColor.array, e * 3);
  }

  getMatrixAt(e, t) {
    return t.fromArray(this.instanceMatrix.array, e * 16);
  }

  getMorphAt(e, t) {
    const n = t.morphTargetInfluences, s = this.morphTexture.source.data.data, a = n.length + 1, r = e * a + 1;
    for (let o = 0; o < n.length; o++)
      n[o] = s[r + o];
  }
  raycast(e, t) {
    const n = this.matrixWorld, s = this.count;
    if (ys.geometry = this.geometry, ys.material = this.material, ys.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Ss.copy(this.boundingSphere), Ss.applyMatrix4(n), e.ray.intersectsSphere(Ss) !== !1))
      for (let a = 0; a < s; a++) {
        this.getMatrixAt(a, Pi), Ic.multiplyMatrices(n, Pi), ys.matrixWorld = Ic, ys.raycast(e, pa);
        for (let r = 0, o = pa.length; r < o; r++) {
          const l = pa[r];
          l.instanceId = a, l.object = this, t.push(l);
        }
        pa.length = 0;
      }
  }

  setColorAt(e, t) {
    return this.instanceColor === null && (this.instanceColor = new Xo(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3), this;
  }

  setMatrixAt(e, t) {
    return t.toArray(this.instanceMatrix.array, e * 16), this;
  }

  setMorphAt(e, t) {
    const n = t.morphTargetInfluences, s = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new ol(new Float32Array(s * this.count), s, this.count, qo, cn));
    const a = this.morphTexture.source.data.data;
    let r = 0;
    for (let c = 0; c < n.length; c++)
      r += n[c];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - r, l = s * e;
    return a[l] = o, a.set(n, l + 1), this;
  }
  updateMorphTargets() {
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
  }
}
const Br = /* @__PURE__ */ new N(), Sg = /* @__PURE__ */ new N(), vg = /* @__PURE__ */ new Ne();
class bi {

  constructor(e = new N(1, 0, 0), t = 0) {
    this.isPlane = !0, this.normal = e, this.constant = t;
  }

  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }

  setComponents(e, t, n, s) {
    return this.normal.set(e, t, n), this.constant = s, this;
  }

  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }

  setFromCoplanarPoints(e, t, n) {
    const s = Br.subVectors(n, t).cross(Sg.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(s, e), this;
  }

  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }

  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }

  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }

  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }

  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }

  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }

  intersectLine(e, t, n = !0) {
    const s = e.delta(Br), a = this.normal.dot(s);
    if (a === 0)
      return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const r = -(e.start.dot(this.normal) + this.constant) / a;
    return n === !0 && (r < 0 || r > 1) ? null : t.copy(e.start).addScaledVector(s, r);
  }

  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
    return t < 0 && n > 0 || n < 0 && t > 0;
  }

  intersectsBox(e) {
    return e.intersectsPlane(this);
  }

  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }

  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }

  applyMatrix4(e, t) {
    const n = t || vg.getNormalMatrix(e), s = this.coplanarPoint(Br).applyMatrix4(e), a = this.normal.applyMatrix3(n).normalize();
    return this.constant = -s.dot(a), this;
  }

  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }

  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }

  clone() {
    return new this.constructor().copy(this);
  }
}
const Ii = /* @__PURE__ */ new En(), xg = /* @__PURE__ */ new Te(0.5, 0.5), fa = /* @__PURE__ */ new N();
class cl {

  constructor(e = new bi(), t = new bi(), n = new bi(), s = new bi(), a = new bi(), r = new bi()) {
    this.planes = [e, t, n, s, a, r];
  }

  set(e, t, n, s, a, r) {
    const o = this.planes;
    return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(s), o[4].copy(a), o[5].copy(r), this;
  }

  copy(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++)
      t[n].copy(e.planes[n]);
    return this;
  }

  setFromProjectionMatrix(e, t = Gn, n = !1) {
    const s = this.planes, a = e.elements, r = a[0], o = a[1], l = a[2], c = a[3], d = a[4], u = a[5], h = a[6], g = a[7], m = a[8], A = a[9], f = a[10], p = a[11], b = a[12], v = a[13], S = a[14], R = a[15];
    if (s[0].setComponents(c - r, g - d, p - m, R - b).normalize(), s[1].setComponents(c + r, g + d, p + m, R + b).normalize(), s[2].setComponents(c + o, g + u, p + A, R + v).normalize(), s[3].setComponents(c - o, g - u, p - A, R - v).normalize(), n)
      s[4].setComponents(l, h, f, S).normalize(), s[5].setComponents(c - l, g - h, p - f, R - S).normalize();
    else if (s[4].setComponents(c - l, g - h, p - f, R - S).normalize(), t === Gn)
      s[5].setComponents(c + l, g + h, p + f, R + S).normalize();
    else if (t === Us)
      s[5].setComponents(l, h, f, S).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }

  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      e.boundingSphere === null && e.computeBoundingSphere(), Ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const t = e.geometry;
      t.boundingSphere === null && t.computeBoundingSphere(), Ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(Ii);
  }

  intersectsSprite(e) {
    Ii.center.set(0, 0, 0);
    const t = xg.distanceTo(e.center);
    return Ii.radius = 0.7071067811865476 + t, Ii.applyMatrix4(e.matrixWorld), this.intersectsSphere(Ii);
  }

  intersectsSphere(e) {
    const t = this.planes, n = e.center, s = -e.radius;
    for (let a = 0; a < 6; a++)
      if (t[a].distanceToPoint(n) < s)
        return !1;
    return !0;
  }

  intersectsBox(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) {
      const s = t[n];
      if (fa.x = s.normal.x > 0 ? e.max.x : e.min.x, fa.y = s.normal.y > 0 ? e.max.y : e.min.y, fa.z = s.normal.z > 0 ? e.max.z : e.min.z, s.distanceToPoint(fa) < 0)
        return !1;
    }
    return !0;
  }

  containsPoint(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++)
      if (t[n].distanceToPoint(e) < 0)
        return !1;
    return !0;
  }

  clone() {
    return new this.constructor().copy(this);
  }
}
class dl extends In {

  constructor(e) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Me(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
  }
}
const Ua = /* @__PURE__ */ new N(), Da = /* @__PURE__ */ new N(), bc = /* @__PURE__ */ new Ue(), vs = /* @__PURE__ */ new za(), ma = /* @__PURE__ */ new En(), Nr = /* @__PURE__ */ new N(), Ac = /* @__PURE__ */ new N();
class hl extends dt {

  constructor(e = new yt(), t = new dl()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }

  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [0];
      for (let s = 1, a = t.count; s < a; s++)
        Ua.fromBufferAttribute(t, s - 1), Da.fromBufferAttribute(t, s), n[s] = n[s - 1], n[s] += Ua.distanceTo(Da);
      e.setAttribute("lineDistance", new Oe(n, 1));
    } else
      Ae("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }

  raycast(e, t) {
    const n = this.geometry, s = this.matrixWorld, a = e.params.Line.threshold, r = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), ma.copy(n.boundingSphere), ma.applyMatrix4(s), ma.radius += a, e.ray.intersectsSphere(ma) === !1) return;
    bc.copy(s).invert(), vs.copy(e.ray).applyMatrix4(bc);
    const o = a / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = this.isLineSegments ? 2 : 1, d = n.index, h = n.attributes.position;
    if (d !== null) {
      const g = Math.max(0, r.start), m = Math.min(d.count, r.start + r.count);
      for (let A = g, f = m - 1; A < f; A += c) {
        const p = d.getX(A), b = d.getX(A + 1), v = Ia(this, e, vs, l, p, b, A);
        v && t.push(v);
      }
      if (this.isLineLoop) {
        const A = d.getX(m - 1), f = d.getX(g), p = Ia(this, e, vs, l, A, f, m - 1);
        p && t.push(p);
      }
    } else {
      const g = Math.max(0, r.start), m = Math.min(h.count, r.start + r.count);
      for (let A = g, f = m - 1; A < f; A += c) {
        const p = Ia(this, e, vs, l, A, A + 1, A);
        p && t.push(p);
      }
      if (this.isLineLoop) {
        const A = Ia(this, e, vs, l, m - 1, g, m - 1);
        A && t.push(A);
      }
    }
  }

  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let a = 0, r = s.length; a < r; a++) {
          const o = s[a].name || String(a);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = a;
        }
      }
    }
  }
}
function Ia(i, e, t, n, s, a, r) {
  const o = i.geometry.attributes.position;
  if (Ua.fromBufferAttribute(o, s), Da.fromBufferAttribute(o, a), t.distanceSqToSegment(Ua, Da, Nr, Ac) > n) return;
  Nr.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(Nr);
  if (!(c < e.near || c > e.far))
    return {
      distance: c,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: Ac.clone().applyMatrix4(i.matrixWorld),
      index: r,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i
    };
}
const yc = /* @__PURE__ */ new N(), Sc = /* @__PURE__ */ new N();
class qd extends hl {

  constructor(e, t) {
    super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [];
      for (let s = 0, a = t.count; s < a; s += 2)
        yc.fromBufferAttribute(t, s), Sc.fromBufferAttribute(t, s + 1), n[s] = s === 0 ? 0 : n[s - 1], n[s + 1] = n[s] + yc.distanceTo(Sc);
      e.setAttribute("lineDistance", new Oe(n, 1));
    } else
      Ae("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class _g extends hl {

  constructor(e, t) {
    super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
  }
}
class $d extends In {

  constructor(e) {
    super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new Me(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
const vc = /* @__PURE__ */ new Ue(), Ho = /* @__PURE__ */ new za(), Ca = /* @__PURE__ */ new En(), ba = /* @__PURE__ */ new N();
class wg extends dt {

  constructor(e = new yt(), t = new $d()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }

  raycast(e, t) {
    const n = this.geometry, s = this.matrixWorld, a = e.params.Points.threshold, r = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Ca.copy(n.boundingSphere), Ca.applyMatrix4(s), Ca.radius += a, e.ray.intersectsSphere(Ca) === !1) return;
    vc.copy(s).invert(), Ho.copy(e.ray).applyMatrix4(vc);
    const o = a / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = n.index, u = n.attributes.position;
    if (c !== null) {
      const h = Math.max(0, r.start), g = Math.min(c.count, r.start + r.count);
      for (let m = h, A = g; m < A; m++) {
        const f = c.getX(m);
        ba.fromBufferAttribute(u, f), xc(ba, f, l, s, e, t, this);
      }
    } else {
      const h = Math.max(0, r.start), g = Math.min(u.count, r.start + r.count);
      for (let m = h, A = g; m < A; m++)
        ba.fromBufferAttribute(u, m), xc(ba, m, l, s, e, t, this);
    }
  }

  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let a = 0, r = s.length; a < r; a++) {
          const o = s[a].name || String(a);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = a;
        }
      }
    }
  }
}
function xc(i, e, t, n, s, a, r) {
  const o = Ho.distanceSqToPoint(i);
  if (o < t) {
    const l = new N();
    Ho.closestPointToPoint(i, l), l.applyMatrix4(n);
    const c = s.ray.origin.distanceTo(l);
    if (c < s.near || c > s.far) return;
    a.push({
      distance: c,
      distanceToRay: Math.sqrt(o),
      point: l,
      index: e,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: r
    });
  }
}
class eh extends Gt {

  constructor(e = [], t = vi, n, s, a, r, o, l, c, d) {
    super(e, t, n, s, a, r, o, l, c, d), this.isCubeTexture = !0, this.flipY = !1;
  }

  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class Rg extends Gt {

  constructor(e, t, n, s, a, r, o, l, c) {
    super(e, t, n, s, a, r, o, l, c), this.isCanvasTexture = !0, this.needsUpdate = !0;
  }
}
class ns extends Gt {

  constructor(e, t, n = Bn, s, a, r, o = Rt, l = Rt, c, d = Jn, u = 1) {
    if (d !== Jn && d !== Si)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    const h = { width: e, height: t, depth: u };
    super(h, s, a, r, o, l, d, n, c), this.isDepthTexture = !0, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.source = new al(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}
class Mg extends ns {

  constructor(e, t = Bn, n = vi, s, a, r = Rt, o = Rt, l, c = Jn) {
    const d = { width: e, height: e, depth: 1 }, u = [d, d, d, d, d, d];
    super(e, e, t, n, s, a, r, o, l, c), this.image = u, this.isCubeDepthTexture = !0, this.isCubeTexture = !0;
  }

  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class th extends Gt {

  constructor(e = null) {
    super(), this.sourceTexture = e, this.isExternalTexture = !0;
  }
  copy(e) {
    return super.copy(e), this.sourceTexture = e.sourceTexture, this;
  }
}
class Tt extends yt {

  constructor(e = 1, t = 1, n = 1, s = 1, a = 1, r = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: e,
      height: t,
      depth: n,
      widthSegments: s,
      heightSegments: a,
      depthSegments: r
    };
    const o = this;
    s = Math.floor(s), a = Math.floor(a), r = Math.floor(r);
    const l = [], c = [], d = [], u = [];
    let h = 0, g = 0;
    m("z", "y", "x", -1, -1, n, t, e, r, a, 0), m("z", "y", "x", 1, -1, n, t, -e, r, a, 1), m("x", "z", "y", 1, 1, e, n, t, s, r, 2), m("x", "z", "y", 1, -1, e, n, -t, s, r, 3), m("x", "y", "z", 1, -1, e, t, n, s, a, 4), m("x", "y", "z", -1, -1, e, t, -n, s, a, 5), this.setIndex(l), this.setAttribute("position", new Oe(c, 3)), this.setAttribute("normal", new Oe(d, 3)), this.setAttribute("uv", new Oe(u, 2));
    function m(A, f, p, b, v, S, R, x, G, C, w) {
      const T = S / G, M = R / C, Z = S / 2, U = R / 2, H = x / 2, F = G + 1, L = C + 1;
      let P = 0, j = 0;
      const $ = new N();
      for (let ce = 0; ce < L; ce++) {
        const Ce = ce * M - U;
        for (let xe = 0; xe < F; xe++) {
          const Je = xe * T - Z;
          $[A] = Je * b, $[f] = Ce * v, $[p] = H, c.push($.x, $.y, $.z), $[A] = 0, $[f] = 0, $[p] = x > 0 ? 1 : -1, d.push($.x, $.y, $.z), u.push(xe / G), u.push(1 - ce / C), P += 1;
        }
      }
      for (let ce = 0; ce < C; ce++)
        for (let Ce = 0; Ce < G; Ce++) {
          const xe = h + Ce + F * ce, Je = h + Ce + F * (ce + 1), et = h + (Ce + 1) + F * (ce + 1), We = h + (Ce + 1) + F * ce;
          l.push(xe, Je, We), l.push(Je, et, We), j += 6;
        }
      o.addGroup(g, j, w), g += j, h += P;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Tt(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
class Xa extends yt {

  constructor(e = 1, t = 1, n = 4, s = 8, a = 1) {
    super(), this.type = "CapsuleGeometry", this.parameters = {
      radius: e,
      height: t,
      capSegments: n,
      radialSegments: s,
      heightSegments: a
    }, t = Math.max(0, t), n = Math.max(1, Math.floor(n)), s = Math.max(3, Math.floor(s)), a = Math.max(1, Math.floor(a));
    const r = [], o = [], l = [], c = [], d = t / 2, u = Math.PI / 2 * e, h = t, g = 2 * u + h, m = n * 2 + a, A = s + 1, f = new N(), p = new N();
    for (let b = 0; b <= m; b++) {
      let v = 0, S = 0, R = 0, x = 0;
      if (b <= n) {
        const w = b / n, T = w * Math.PI / 2;
        S = -d - e * Math.cos(T), R = e * Math.sin(T), x = -e * Math.cos(T), v = w * u;
      } else if (b <= n + a) {
        const w = (b - n) / a;
        S = -d + w * t, R = e, x = 0, v = u + w * h;
      } else {
        const w = (b - n - a) / n, T = w * Math.PI / 2;
        S = d + e * Math.sin(T), R = e * Math.cos(T), x = e * Math.sin(T), v = u + h + w * u;
      }
      const G = Math.max(0, Math.min(1, v / g));
      let C = 0;
      b === 0 ? C = 0.5 / s : b === m && (C = -0.5 / s);
      for (let w = 0; w <= s; w++) {
        const T = w / s, M = T * Math.PI * 2, Z = Math.sin(M), U = Math.cos(M);
        p.x = -R * U, p.y = S, p.z = R * Z, o.push(p.x, p.y, p.z), f.set(
          -R * U,
          x,
          R * Z
        ), f.normalize(), l.push(f.x, f.y, f.z), c.push(T + C, G);
      }
      if (b > 0) {
        const w = (b - 1) * A;
        for (let T = 0; T < s; T++) {
          const M = w + T, Z = w + T + 1, U = b * A + T, H = b * A + T + 1;
          r.push(M, Z, U), r.push(Z, H, U);
        }
      }
    }
    this.setIndex(r), this.setAttribute("position", new Oe(o, 3)), this.setAttribute("normal", new Oe(l, 3)), this.setAttribute("uv", new Oe(c, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Xa(e.radius, e.height, e.capSegments, e.radialSegments, e.heightSegments);
  }
}
class ul extends yt {

  constructor(e = 1, t = 32, n = 0, s = Math.PI * 2) {
    super(), this.type = "CircleGeometry", this.parameters = {
      radius: e,
      segments: t,
      thetaStart: n,
      thetaLength: s
    }, t = Math.max(3, t);
    const a = [], r = [], o = [], l = [], c = new N(), d = new Te();
    r.push(0, 0, 0), o.push(0, 0, 1), l.push(0.5, 0.5);
    for (let u = 0, h = 3; u <= t; u++, h += 3) {
      const g = n + u / t * s;
      c.x = e * Math.cos(g), c.y = e * Math.sin(g), r.push(c.x, c.y, c.z), o.push(0, 0, 1), d.x = (r[h] / e + 1) / 2, d.y = (r[h + 1] / e + 1) / 2, l.push(d.x, d.y);
    }
    for (let u = 1; u <= t; u++)
      a.push(u, u + 1, 0);
    this.setIndex(a), this.setAttribute("position", new Oe(r, 3)), this.setAttribute("normal", new Oe(o, 3)), this.setAttribute("uv", new Oe(l, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new ul(e.radius, e.segments, e.thetaStart, e.thetaLength);
  }
}
class hn extends yt {

  constructor(e = 1, t = 1, n = 1, s = 32, a = 1, r = !1, o = 0, l = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: e,
      radiusBottom: t,
      height: n,
      radialSegments: s,
      heightSegments: a,
      openEnded: r,
      thetaStart: o,
      thetaLength: l
    };
    const c = this;
    s = Math.floor(s), a = Math.floor(a);
    const d = [], u = [], h = [], g = [];
    let m = 0;
    const A = [], f = n / 2;
    let p = 0;
    b(), r === !1 && (e > 0 && v(!0), t > 0 && v(!1)), this.setIndex(d), this.setAttribute("position", new Oe(u, 3)), this.setAttribute("normal", new Oe(h, 3)), this.setAttribute("uv", new Oe(g, 2));
    function b() {
      const S = new N(), R = new N();
      let x = 0;
      const G = (t - e) / n;
      for (let C = 0; C <= a; C++) {
        const w = [], T = C / a, M = T * (t - e) + e;
        for (let Z = 0; Z <= s; Z++) {
          const U = Z / s, H = U * l + o, F = Math.sin(H), L = Math.cos(H);
          R.x = M * F, R.y = -T * n + f, R.z = M * L, u.push(R.x, R.y, R.z), S.set(F, G, L).normalize(), h.push(S.x, S.y, S.z), g.push(U, 1 - T), w.push(m++);
        }
        A.push(w);
      }
      for (let C = 0; C < s; C++)
        for (let w = 0; w < a; w++) {
          const T = A[w][C], M = A[w + 1][C], Z = A[w + 1][C + 1], U = A[w][C + 1];
          (e > 0 || w !== 0) && (d.push(T, M, U), x += 3), (t > 0 || w !== a - 1) && (d.push(M, Z, U), x += 3);
        }
      c.addGroup(p, x, 0), p += x;
    }
    function v(S) {
      const R = m, x = new Te(), G = new N();
      let C = 0;
      const w = S === !0 ? e : t, T = S === !0 ? 1 : -1;
      for (let Z = 1; Z <= s; Z++)
        u.push(0, f * T, 0), h.push(0, T, 0), g.push(0.5, 0.5), m++;
      const M = m;
      for (let Z = 0; Z <= s; Z++) {
        const H = Z / s * l + o, F = Math.cos(H), L = Math.sin(H);
        G.x = w * L, G.y = f * T, G.z = w * F, u.push(G.x, G.y, G.z), h.push(0, T, 0), x.x = F * 0.5 + 0.5, x.y = L * 0.5 * T + 0.5, g.push(x.x, x.y), m++;
      }
      for (let Z = 0; Z < s; Z++) {
        const U = R + Z, H = M + Z;
        S === !0 ? d.push(H, H + 1, U) : d.push(H + 1, H, U), C += 3;
      }
      c.addGroup(p, C, S === !0 ? 1 : 2), p += C;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new hn(e.radiusTop, e.radiusBottom, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
  }
}
class os extends hn {

  constructor(e = 1, t = 1, n = 32, s = 1, a = !1, r = 0, o = Math.PI * 2) {
    super(0, e, t, n, s, a, r, o), this.type = "ConeGeometry", this.parameters = {
      radius: e,
      height: t,
      radialSegments: n,
      heightSegments: s,
      openEnded: a,
      thetaStart: r,
      thetaLength: o
    };
  }

  static fromJSON(e) {
    return new os(e.radius, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
  }
}
class Oa extends yt {

  constructor(e = [], t = [], n = 1, s = 0) {
    super(), this.type = "PolyhedronGeometry", this.parameters = {
      vertices: e,
      indices: t,
      radius: n,
      detail: s
    };
    const a = [], r = [];
    o(s), c(n), d(), this.setAttribute("position", new Oe(a, 3)), this.setAttribute("normal", new Oe(a.slice(), 3)), this.setAttribute("uv", new Oe(r, 2)), s === 0 ? this.computeVertexNormals() : this.normalizeNormals();
    function o(b) {
      const v = new N(), S = new N(), R = new N();
      for (let x = 0; x < t.length; x += 3)
        g(t[x + 0], v), g(t[x + 1], S), g(t[x + 2], R), l(v, S, R, b);
    }
    function l(b, v, S, R) {
      const x = R + 1, G = [];
      for (let C = 0; C <= x; C++) {
        G[C] = [];
        const w = b.clone().lerp(S, C / x), T = v.clone().lerp(S, C / x), M = x - C;
        for (let Z = 0; Z <= M; Z++)
          Z === 0 && C === x ? G[C][Z] = w : G[C][Z] = w.clone().lerp(T, Z / M);
      }
      for (let C = 0; C < x; C++)
        for (let w = 0; w < 2 * (x - C) - 1; w++) {
          const T = Math.floor(w / 2);
          w % 2 === 0 ? (h(G[C][T + 1]), h(G[C + 1][T]), h(G[C][T])) : (h(G[C][T + 1]), h(G[C + 1][T + 1]), h(G[C + 1][T]));
        }
    }
    function c(b) {
      const v = new N();
      for (let S = 0; S < a.length; S += 3)
        v.x = a[S + 0], v.y = a[S + 1], v.z = a[S + 2], v.normalize().multiplyScalar(b), a[S + 0] = v.x, a[S + 1] = v.y, a[S + 2] = v.z;
    }
    function d() {
      const b = new N();
      for (let v = 0; v < a.length; v += 3) {
        b.x = a[v + 0], b.y = a[v + 1], b.z = a[v + 2];
        const S = f(b) / 2 / Math.PI + 0.5, R = p(b) / Math.PI + 0.5;
        r.push(S, 1 - R);
      }
      m(), u();
    }
    function u() {
      for (let b = 0; b < r.length; b += 6) {
        const v = r[b + 0], S = r[b + 2], R = r[b + 4], x = Math.max(v, S, R), G = Math.min(v, S, R);
        x > 0.9 && G < 0.1 && (v < 0.2 && (r[b + 0] += 1), S < 0.2 && (r[b + 2] += 1), R < 0.2 && (r[b + 4] += 1));
      }
    }
    function h(b) {
      a.push(b.x, b.y, b.z);
    }
    function g(b, v) {
      const S = b * 3;
      v.x = e[S + 0], v.y = e[S + 1], v.z = e[S + 2];
    }
    function m() {
      const b = new N(), v = new N(), S = new N(), R = new N(), x = new Te(), G = new Te(), C = new Te();
      for (let w = 0, T = 0; w < a.length; w += 9, T += 6) {
        b.set(a[w + 0], a[w + 1], a[w + 2]), v.set(a[w + 3], a[w + 4], a[w + 5]), S.set(a[w + 6], a[w + 7], a[w + 8]), x.set(r[T + 0], r[T + 1]), G.set(r[T + 2], r[T + 3]), C.set(r[T + 4], r[T + 5]), R.copy(b).add(v).add(S).divideScalar(3);
        const M = f(R);
        A(x, T + 0, b, M), A(G, T + 2, v, M), A(C, T + 4, S, M);
      }
    }
    function A(b, v, S, R) {
      R < 0 && b.x === 1 && (r[v] = b.x - 1), S.x === 0 && S.z === 0 && (r[v] = R / 2 / Math.PI + 0.5);
    }
    function f(b) {
      return Math.atan2(b.z, -b.x);
    }
    function p(b) {
      return Math.atan2(-b.y, Math.sqrt(b.x * b.x + b.z * b.z));
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Oa(e.vertices, e.indices, e.radius, e.detail);
  }
}
class gl extends Oa {

  constructor(e = 1, t = 0) {
    const n = (1 + Math.sqrt(5)) / 2, s = [
      -1,
      n,
      0,
      1,
      n,
      0,
      -1,
      -n,
      0,
      1,
      -n,
      0,
      0,
      -1,
      n,
      0,
      1,
      n,
      0,
      -1,
      -n,
      0,
      1,
      -n,
      n,
      0,
      -1,
      n,
      0,
      1,
      -n,
      0,
      -1,
      -n,
      0,
      1
    ], a = [
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1
    ];
    super(s, a, e, t), this.type = "IcosahedronGeometry", this.parameters = {
      radius: e,
      detail: t
    };
  }

  static fromJSON(e) {
    return new gl(e.radius, e.detail);
  }
}
class pl extends Oa {

  constructor(e = 1, t = 0) {
    const n = [
      1,
      0,
      0,
      -1,
      0,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      0,
      1,
      0,
      0,
      -1
    ], s = [
      0,
      2,
      4,
      0,
      4,
      3,
      0,
      3,
      5,
      0,
      5,
      2,
      1,
      2,
      5,
      1,
      5,
      3,
      1,
      3,
      4,
      1,
      4,
      2
    ];
    super(n, s, e, t), this.type = "OctahedronGeometry", this.parameters = {
      radius: e,
      detail: t
    };
  }

  static fromJSON(e) {
    return new pl(e.radius, e.detail);
  }
}
class Ja extends yt {

  constructor(e = 1, t = 1, n = 1, s = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: e,
      height: t,
      widthSegments: n,
      heightSegments: s
    };
    const a = e / 2, r = t / 2, o = Math.floor(n), l = Math.floor(s), c = o + 1, d = l + 1, u = e / o, h = t / l, g = [], m = [], A = [], f = [];
    for (let p = 0; p < d; p++) {
      const b = p * h - r;
      for (let v = 0; v < c; v++) {
        const S = v * u - a;
        m.push(S, -b, 0), A.push(0, 0, 1), f.push(v / o), f.push(1 - p / l);
      }
    }
    for (let p = 0; p < l; p++)
      for (let b = 0; b < o; b++) {
        const v = b + c * p, S = b + c * (p + 1), R = b + 1 + c * (p + 1), x = b + 1 + c * p;
        g.push(v, S, x), g.push(S, R, x);
      }
    this.setIndex(g), this.setAttribute("position", new Oe(m, 3)), this.setAttribute("normal", new Oe(A, 3)), this.setAttribute("uv", new Oe(f, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Ja(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
class Ka extends yt {

  constructor(e = 0.5, t = 1, n = 32, s = 1, a = 0, r = Math.PI * 2) {
    super(), this.type = "RingGeometry", this.parameters = {
      innerRadius: e,
      outerRadius: t,
      thetaSegments: n,
      phiSegments: s,
      thetaStart: a,
      thetaLength: r
    }, n = Math.max(3, n), s = Math.max(1, s);
    const o = [], l = [], c = [], d = [];
    let u = e;
    const h = (t - e) / s, g = new N(), m = new Te();
    for (let A = 0; A <= s; A++) {
      for (let f = 0; f <= n; f++) {
        const p = a + f / n * r;
        g.x = u * Math.cos(p), g.y = u * Math.sin(p), l.push(g.x, g.y, g.z), c.push(0, 0, 1), m.x = (g.x / t + 1) / 2, m.y = (g.y / t + 1) / 2, d.push(m.x, m.y);
      }
      u += h;
    }
    for (let A = 0; A < s; A++) {
      const f = A * (n + 1);
      for (let p = 0; p < n; p++) {
        const b = p + f, v = b, S = b + n + 1, R = b + n + 2, x = b + 1;
        o.push(v, S, x), o.push(S, R, x);
      }
    }
    this.setIndex(o), this.setAttribute("position", new Oe(l, 3)), this.setAttribute("normal", new Oe(c, 3)), this.setAttribute("uv", new Oe(d, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Ka(e.innerRadius, e.outerRadius, e.thetaSegments, e.phiSegments, e.thetaStart, e.thetaLength);
  }
}
class Kn extends yt {

  constructor(e = 1, t = 32, n = 16, s = 0, a = Math.PI * 2, r = 0, o = Math.PI) {
    super(), this.type = "SphereGeometry", this.parameters = {
      radius: e,
      widthSegments: t,
      heightSegments: n,
      phiStart: s,
      phiLength: a,
      thetaStart: r,
      thetaLength: o
    }, t = Math.max(3, Math.floor(t)), n = Math.max(2, Math.floor(n));
    const l = Math.min(r + o, Math.PI);
    let c = 0;
    const d = [], u = new N(), h = new N(), g = [], m = [], A = [], f = [];
    for (let p = 0; p <= n; p++) {
      const b = [], v = p / n;
      let S = 0;
      p === 0 && r === 0 ? S = 0.5 / t : p === n && l === Math.PI && (S = -0.5 / t);
      for (let R = 0; R <= t; R++) {
        const x = R / t;
        u.x = -e * Math.cos(s + x * a) * Math.sin(r + v * o), u.y = e * Math.cos(r + v * o), u.z = e * Math.sin(s + x * a) * Math.sin(r + v * o), m.push(u.x, u.y, u.z), h.copy(u).normalize(), A.push(h.x, h.y, h.z), f.push(x + S, 1 - v), b.push(c++);
      }
      d.push(b);
    }
    for (let p = 0; p < n; p++)
      for (let b = 0; b < t; b++) {
        const v = d[p][b + 1], S = d[p][b], R = d[p + 1][b], x = d[p + 1][b + 1];
        (p !== 0 || r > 0) && g.push(v, S, x), (p !== n - 1 || l < Math.PI) && g.push(S, R, x);
      }
    this.setIndex(g), this.setAttribute("position", new Oe(m, 3)), this.setAttribute("normal", new Oe(A, 3)), this.setAttribute("uv", new Oe(f, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Kn(e.radius, e.widthSegments, e.heightSegments, e.phiStart, e.phiLength, e.thetaStart, e.thetaLength);
  }
}
class Hs extends yt {

  constructor(e = 1, t = 0.4, n = 12, s = 48, a = Math.PI * 2, r = 0, o = Math.PI * 2) {
    super(), this.type = "TorusGeometry", this.parameters = {
      radius: e,
      tube: t,
      radialSegments: n,
      tubularSegments: s,
      arc: a,
      thetaStart: r,
      thetaLength: o
    }, n = Math.floor(n), s = Math.floor(s);
    const l = [], c = [], d = [], u = [], h = new N(), g = new N(), m = new N();
    for (let A = 0; A <= n; A++) {
      const f = r + A / n * o;
      for (let p = 0; p <= s; p++) {
        const b = p / s * a;
        g.x = (e + t * Math.cos(f)) * Math.cos(b), g.y = (e + t * Math.cos(f)) * Math.sin(b), g.z = t * Math.sin(f), c.push(g.x, g.y, g.z), h.x = e * Math.cos(b), h.y = e * Math.sin(b), m.subVectors(g, h).normalize(), d.push(m.x, m.y, m.z), u.push(p / s), u.push(A / n);
      }
    }
    for (let A = 1; A <= n; A++)
      for (let f = 1; f <= s; f++) {
        const p = (s + 1) * A + f - 1, b = (s + 1) * (A - 1) + f - 1, v = (s + 1) * (A - 1) + f, S = (s + 1) * A + f;
        l.push(p, b, S), l.push(b, v, S);
      }
    this.setIndex(l), this.setAttribute("position", new Oe(c, 3)), this.setAttribute("normal", new Oe(d, 3)), this.setAttribute("uv", new Oe(u, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }

  static fromJSON(e) {
    return new Hs(e.radius, e.tube, e.radialSegments, e.tubularSegments, e.arc);
  }
}
function is(i) {
  const e = {};
  for (const t in i) {
    e[t] = {};
    for (const n in i[t]) {
      const s = i[t][n];
      if (_c(s))
        s.isRenderTargetTexture ? (Ae("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][n] = null) : e[t][n] = s.clone();
      else if (Array.isArray(s))
        if (_c(s[0])) {
          const a = [];
          for (let r = 0, o = s.length; r < o; r++)
            a[r] = s[r].clone();
          e[t][n] = a;
        } else
          e[t][n] = s.slice();
      else
        e[t][n] = s;
    }
  }
  return e;
}
function Pt(i) {
  const e = {};
  for (let t = 0; t < i.length; t++) {
    const n = is(i[t]);
    for (const s in n)
      e[s] = n[s];
  }
  return e;
}
function _c(i) {
  return i && (i.isColor || i.isMatrix3 || i.isMatrix4 || i.isVector2 || i.isVector3 || i.isVector4 || i.isTexture || i.isQuaternion);
}
function Gg(i) {
  const e = [];
  for (let t = 0; t < i.length; t++)
    e.push(i[t].clone());
  return e;
}
function nh(i) {
  const e = i.getRenderTarget();
  return e === null ? i.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : Pe.workingColorSpace;
}
const Tg = { clone: is, merge: Pt };
var Zg = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Bg = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class Nn extends In {

  constructor(e) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Zg, this.fragmentShader = Bg, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = is(e.uniforms), this.uniformsGroups = Gg(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this.defaultAttributeValues = Object.assign({}, e.defaultAttributeValues), this.index0AttributeName = e.index0AttributeName, this.uniformsNeedUpdate = e.uniformsNeedUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    t.glslVersion = this.glslVersion, t.uniforms = {};
    for (const s in this.uniforms) {
      const r = this.uniforms[s].value;
      r && r.isTexture ? t.uniforms[s] = {
        type: "t",
        value: r.toJSON(e).uuid
      } : r && r.isColor ? t.uniforms[s] = {
        type: "c",
        value: r.getHex()
      } : r && r.isVector2 ? t.uniforms[s] = {
        type: "v2",
        value: r.toArray()
      } : r && r.isVector3 ? t.uniforms[s] = {
        type: "v3",
        value: r.toArray()
      } : r && r.isVector4 ? t.uniforms[s] = {
        type: "v4",
        value: r.toArray()
      } : r && r.isMatrix3 ? t.uniforms[s] = {
        type: "m3",
        value: r.toArray()
      } : r && r.isMatrix4 ? t.uniforms[s] = {
        type: "m4",
        value: r.toArray()
      } : t.uniforms[s] = {
        value: r
      };
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
    const n = {};
    for (const s in this.extensions)
      this.extensions[s] === !0 && (n[s] = !0);
    return Object.keys(n).length > 0 && (t.extensions = n), t;
  }
}
class Ng extends Nn {

  constructor(e) {
    super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
  }
}
class Zt extends In {

  constructor(e) {
    super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new Me(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Me(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Lo, this.normalScale = new Te(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new ui(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}
class Xt extends Zt {

  constructor(e) {
    super(), this.isMeshPhysicalMaterial = !0, this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new Te(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
      get: function() {
        return ke(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
      },
      set: function(t) {
        this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
      }
    }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new Me(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new Me(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new Me(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
  }

  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(e) {
    this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
  }

  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(e) {
    this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
  }

  get iridescence() {
    return this._iridescence;
  }
  set iridescence(e) {
    this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
  }

  get dispersion() {
    return this._dispersion;
  }
  set dispersion(e) {
    this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
  }

  get sheen() {
    return this._sheen;
  }
  set sheen(e) {
    this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
  }

  get transmission() {
    return this._transmission;
  }
  set transmission(e) {
    this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
  }
  copy(e) {
    return super.copy(e), this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
  }
}
class Eg extends In {

  constructor(e) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = yu, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}
class Fg extends In {

  constructor(e) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
}
function Aa(i, e) {
  return !i || i.constructor === e ? i : typeof e.BYTES_PER_ELEMENT == "number" ? new e(i) : Array.prototype.slice.call(i);
}
function Wg(i) {
  function e(s, a) {
    return i[s] - i[a];
  }
  const t = i.length, n = new Array(t);
  for (let s = 0; s !== t; ++s) n[s] = s;
  return n.sort(e), n;
}
function wc(i, e, t) {
  const n = i.length, s = new i.constructor(n);
  for (let a = 0, r = 0; r !== n; ++a) {
    const o = t[a] * e;
    for (let l = 0; l !== e; ++l)
      s[r++] = i[o + l];
  }
  return s;
}
function ih(i, e, t, n) {
  let s = 1, a = i[0];
  for (; a !== void 0 && a[n] === void 0; )
    a = i[s++];
  if (a === void 0) return;
  let r = a[n];
  if (r !== void 0)
    if (Array.isArray(r))
      do
        r = a[n], r !== void 0 && (e.push(a.time), t.push(...r)), a = i[s++];
      while (a !== void 0);
    else if (r.toArray !== void 0)
      do
        r = a[n], r !== void 0 && (e.push(a.time), r.toArray(t, t.length)), a = i[s++];
      while (a !== void 0);
    else
      do
        r = a[n], r !== void 0 && (e.push(a.time), t.push(r)), a = i[s++];
      while (a !== void 0);
}
class ls {

  constructor(e, t, n, s) {
    this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = s !== void 0 ? s : new t.constructor(n), this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
  }

  evaluate(e) {
    const t = this.parameterPositions;
    let n = this._cachedIndex, s = t[n], a = t[n - 1];
    n: {
      e: {
        let r;
        t: {
          i: if (!(e < s)) {
            for (let o = n + 2; ; ) {
              if (s === void 0) {
                if (e < a) break i;
                return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
              }
              if (n === o) break;
              if (a = s, s = t[++n], e < s)
                break e;
            }
            r = t.length;
            break t;
          }
          if (!(e >= a)) {
            const o = t[1];
            e < o && (n = 2, a = o);
            for (let l = n - 2; ; ) {
              if (a === void 0)
                return this._cachedIndex = 0, this.copySampleValue_(0);
              if (n === l) break;
              if (s = a, a = t[--n - 1], e >= a)
                break e;
            }
            r = n, n = 0;
            break t;
          }
          break n;
        }
        for (; n < r; ) {
          const o = n + r >>> 1;
          e < t[o] ? r = o : n = o + 1;
        }
        if (s = t[n], a = t[n - 1], a === void 0)
          return this._cachedIndex = 0, this.copySampleValue_(0);
        if (s === void 0)
          return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
      }
      this._cachedIndex = n, this.intervalChanged_(n, a, s);
    }
    return this.interpolate_(n, a, e, s);
  }

  getSettings_() {
    return this.settings || this.DefaultSettings_;
  }

  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, s = this.valueSize, a = e * s;
    for (let r = 0; r !== s; ++r)
      t[r] = n[a + r];
    return t;
  }

  interpolate_() {
    throw new Error("call to abstract method");
  }

  intervalChanged_() {
  }
}
class Vg extends ls {

  constructor(e, t, n, s) {
    super(e, t, n, s), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
      endingStart: Pl,
      endingEnd: Pl
    };
  }
  intervalChanged_(e, t, n) {
    const s = this.parameterPositions;
    let a = e - 2, r = e + 1, o = s[a], l = s[r];
    if (o === void 0)
      switch (this.getSettings_().endingStart) {
        case kl:
          a = e, o = 2 * t - n;
          break;
        case Yl:
          a = s.length - 2, o = t + s[a] - s[a + 1];
          break;
        default:
          a = e, o = n;
      }
    if (l === void 0)
      switch (this.getSettings_().endingEnd) {
        case kl:
          r = e, l = 2 * n - t;
          break;
        case Yl:
          r = 1, l = n + s[1] - s[0];
          break;
        default:
          r = e - 1, l = t;
      }
    const c = (n - t) * 0.5, d = this.valueSize;
    this._weightPrev = c / (t - o), this._weightNext = c / (l - n), this._offsetPrev = a * d, this._offsetNext = r * d;
  }
  interpolate_(e, t, n, s) {
    const a = this.resultBuffer, r = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, d = this._offsetPrev, u = this._offsetNext, h = this._weightPrev, g = this._weightNext, m = (n - t) / (s - t), A = m * m, f = A * m, p = -h * f + 2 * h * A - h * m, b = (1 + h) * f + (-1.5 - 2 * h) * A + (-0.5 + h) * m + 1, v = (-1 - g) * f + (1.5 + g) * A + 0.5 * m, S = g * f - g * A;
    for (let R = 0; R !== o; ++R)
      a[R] = p * r[d + R] + b * r[c + R] + v * r[l + R] + S * r[u + R];
    return a;
  }
}
class Lg extends ls {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e, t, n, s) {
    const a = this.resultBuffer, r = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, d = (n - t) / (s - t), u = 1 - d;
    for (let h = 0; h !== o; ++h)
      a[h] = r[c + h] * u + r[l + h] * d;
    return a;
  }
}
class Ug extends ls {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e) {
    return this.copySampleValue_(e - 1);
  }
}
class Dg extends ls {
  interpolate_(e, t, n, s) {
    const a = this.resultBuffer, r = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, d = this.settings || this.DefaultSettings_, u = d.inTangents, h = d.outTangents;
    if (!u || !h) {
      const A = (n - t) / (s - t), f = 1 - A;
      for (let p = 0; p !== o; ++p)
        a[p] = r[c + p] * f + r[l + p] * A;
      return a;
    }
    const g = o * 2, m = e - 1;
    for (let A = 0; A !== o; ++A) {
      const f = r[c + A], p = r[l + A], b = m * g + A * 2, v = h[b], S = h[b + 1], R = e * g + A * 2, x = u[R], G = u[R + 1];
      let C = (n - t) / (s - t), w, T, M, Z, U;
      for (let H = 0; H < 8; H++) {
        w = C * C, T = w * C, M = 1 - C, Z = M * M, U = Z * M;
        const L = U * t + 3 * Z * C * v + 3 * M * w * x + T * s - n;
        if (Math.abs(L) < 1e-10) break;
        const P = 3 * Z * (v - t) + 6 * M * C * (x - v) + 3 * w * (s - x);
        if (Math.abs(P) < 1e-10) break;
        C = C - L / P, C = Math.max(0, Math.min(1, C));
      }
      a[A] = U * f + 3 * Z * C * S + 3 * M * w * G + T * p;
    }
    return a;
  }
}
class Cn {

  constructor(e, t, n, s) {
    if (e === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
    if (t === void 0 || t.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
    this.name = e, this.times = Aa(t, this.TimeBufferType), this.values = Aa(n, this.ValueBufferType), this.setInterpolation(s || this.DefaultInterpolation);
  }

  static toJSON(e) {
    const t = e.constructor;
    let n;
    if (t.toJSON !== this.toJSON)
      n = t.toJSON(e);
    else {
      n = {
        name: e.name,
        times: Aa(e.times, Array),
        values: Aa(e.values, Array)
      };
      const s = e.getInterpolation();
      s !== e.DefaultInterpolation && (n.interpolation = s);
    }
    return n.type = e.ValueTypeName, n;
  }

  InterpolantFactoryMethodDiscrete(e) {
    return new Ug(this.times, this.values, this.getValueSize(), e);
  }

  InterpolantFactoryMethodLinear(e) {
    return new Lg(this.times, this.values, this.getValueSize(), e);
  }

  InterpolantFactoryMethodSmooth(e) {
    return new Vg(this.times, this.values, this.getValueSize(), e);
  }

  InterpolantFactoryMethodBezier(e) {
    const t = new Dg(this.times, this.values, this.getValueSize(), e);
    return this.settings && (t.settings = this.settings), t;
  }

  setInterpolation(e) {
    let t;
    switch (e) {
      case Vs:
        t = this.InterpolantFactoryMethodDiscrete;
        break;
      case Ls:
        t = this.InterpolantFactoryMethodLinear;
        break;
      case or:
        t = this.InterpolantFactoryMethodSmooth;
        break;
      case Hl:
        t = this.InterpolantFactoryMethodBezier;
        break;
    }
    if (t === void 0) {
      const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
      if (this.createInterpolant === void 0)
        if (e !== this.DefaultInterpolation)
          this.setInterpolation(this.DefaultInterpolation);
        else
          throw new Error(n);
      return Ae("KeyframeTrack:", n), this;
    }
    return this.createInterpolant = t, this;
  }

  getInterpolation() {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodDiscrete:
        return Vs;
      case this.InterpolantFactoryMethodLinear:
        return Ls;
      case this.InterpolantFactoryMethodSmooth:
        return or;
      case this.InterpolantFactoryMethodBezier:
        return Hl;
    }
  }

  getValueSize() {
    return this.values.length / this.times.length;
  }

  shift(e) {
    if (e !== 0) {
      const t = this.times;
      for (let n = 0, s = t.length; n !== s; ++n)
        t[n] += e;
    }
    return this;
  }

  scale(e) {
    if (e !== 1) {
      const t = this.times;
      for (let n = 0, s = t.length; n !== s; ++n)
        t[n] *= e;
    }
    return this;
  }

  trim(e, t) {
    const n = this.times, s = n.length;
    let a = 0, r = s - 1;
    for (; a !== s && n[a] < e; )
      ++a;
    for (; r !== -1 && n[r] > t; )
      --r;
    if (++r, a !== 0 || r !== s) {
      a >= r && (r = Math.max(r, 1), a = r - 1);
      const o = this.getValueSize();
      this.times = n.slice(a, r), this.values = this.values.slice(a * o, r * o);
    }
    return this;
  }

  validate() {
    let e = !0;
    const t = this.getValueSize();
    t - Math.floor(t) !== 0 && (we("KeyframeTrack: Invalid value size in track.", this), e = !1);
    const n = this.times, s = this.values, a = n.length;
    a === 0 && (we("KeyframeTrack: Track is empty.", this), e = !1);
    let r = null;
    for (let o = 0; o !== a; o++) {
      const l = n[o];
      if (typeof l == "number" && isNaN(l)) {
        we("KeyframeTrack: Time is not a valid number.", this, o, l), e = !1;
        break;
      }
      if (r !== null && r > l) {
        we("KeyframeTrack: Out of order keys.", this, o, l, r), e = !1;
        break;
      }
      r = l;
    }
    if (s !== void 0 && Tu(s))
      for (let o = 0, l = s.length; o !== l; ++o) {
        const c = s[o];
        if (isNaN(c)) {
          we("KeyframeTrack: Value is not a valid number.", this, o, c), e = !1;
          break;
        }
      }
    return e;
  }

  optimize() {
    const e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), s = this.getInterpolation() === or, a = e.length - 1;
    let r = 1;
    for (let o = 1; o < a; ++o) {
      let l = !1;
      const c = e[o], d = e[o + 1];
      if (c !== d && (o !== 1 || c !== e[0]))
        if (s)
          l = !0;
        else {
          const u = o * n, h = u - n, g = u + n;
          for (let m = 0; m !== n; ++m) {
            const A = t[u + m];
            if (A !== t[h + m] || A !== t[g + m]) {
              l = !0;
              break;
            }
          }
        }
      if (l) {
        if (o !== r) {
          e[r] = e[o];
          const u = o * n, h = r * n;
          for (let g = 0; g !== n; ++g)
            t[h + g] = t[u + g];
        }
        ++r;
      }
    }
    if (a > 0) {
      e[r] = e[a];
      for (let o = a * n, l = r * n, c = 0; c !== n; ++c)
        t[l + c] = t[o + c];
      ++r;
    }
    return r !== e.length ? (this.times = e.slice(0, r), this.values = t.slice(0, r * n)) : (this.times = e, this.values = t), this;
  }

  clone() {
    const e = this.times.slice(), t = this.values.slice(), n = this.constructor, s = new n(this.name, e, t);
    return s.createInterpolant = this.createInterpolant, s;
  }
}
Cn.prototype.ValueTypeName = "";
Cn.prototype.TimeBufferType = Float32Array;
Cn.prototype.ValueBufferType = Float32Array;
Cn.prototype.DefaultInterpolation = Ls;
class cs extends Cn {

  constructor(e, t, n) {
    super(e, t, n);
  }
}
cs.prototype.ValueTypeName = "bool";
cs.prototype.ValueBufferType = Array;
cs.prototype.DefaultInterpolation = Vs;
cs.prototype.InterpolantFactoryMethodLinear = void 0;
cs.prototype.InterpolantFactoryMethodSmooth = void 0;
class sh extends Cn {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
sh.prototype.ValueTypeName = "color";
class ss extends Cn {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
ss.prototype.ValueTypeName = "number";
class Xg extends ls {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e, t, n, s) {
    const a = this.resultBuffer, r = this.sampleValues, o = this.valueSize, l = (n - t) / (s - t);
    let c = e * o;
    for (let d = c + o; c !== d; c += 4)
      jn.slerpFlat(a, 0, r, c - o, r, c, l);
    return a;
  }
}
class as extends Cn {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }

  InterpolantFactoryMethodLinear(e) {
    return new Xg(this.times, this.values, this.getValueSize(), e);
  }
}
as.prototype.ValueTypeName = "quaternion";
as.prototype.InterpolantFactoryMethodSmooth = void 0;
class ds extends Cn {

  constructor(e, t, n) {
    super(e, t, n);
  }
}
ds.prototype.ValueTypeName = "string";
ds.prototype.ValueBufferType = Array;
ds.prototype.DefaultInterpolation = Vs;
ds.prototype.InterpolantFactoryMethodLinear = void 0;
ds.prototype.InterpolantFactoryMethodSmooth = void 0;
class rs extends Cn {

  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
rs.prototype.ValueTypeName = "vector";
class Hg {

  constructor(e = "", t = -1, n = [], s = bu) {
    this.name = e, this.tracks = n, this.duration = t, this.blendMode = s, this.uuid = mn(), this.userData = {}, this.duration < 0 && this.resetDuration();
  }

  static parse(e) {
    const t = [], n = e.tracks, s = 1 / (e.fps || 1);
    for (let r = 0, o = n.length; r !== o; ++r)
      t.push(kg(n[r]).scale(s));
    const a = new this(e.name, e.duration, t, e.blendMode);
    return a.uuid = e.uuid, a.userData = JSON.parse(e.userData || "{}"), a;
  }

  static toJSON(e) {
    const t = [], n = e.tracks, s = {
      name: e.name,
      duration: e.duration,
      tracks: t,
      uuid: e.uuid,
      blendMode: e.blendMode,
      userData: JSON.stringify(e.userData)
    };
    for (let a = 0, r = n.length; a !== r; ++a)
      t.push(Cn.toJSON(n[a]));
    return s;
  }

  static CreateFromMorphTargetSequence(e, t, n, s) {
    const a = t.length, r = [];
    for (let o = 0; o < a; o++) {
      let l = [], c = [];
      l.push(
        (o + a - 1) % a,
        o,
        (o + 1) % a
      ), c.push(0, 1, 0);
      const d = Wg(l);
      l = wc(l, 1, d), c = wc(c, 1, d), !s && l[0] === 0 && (l.push(a), c.push(c[0])), r.push(
        new ss(
          ".morphTargetInfluences[" + t[o].name + "]",
          l,
          c
        ).scale(1 / n)
      );
    }
    return new this(e, -1, r);
  }

  static findByName(e, t) {
    let n = e;
    if (!Array.isArray(e)) {
      const s = e;
      n = s.geometry && s.geometry.animations || s.animations;
    }
    for (let s = 0; s < n.length; s++)
      if (n[s].name === t)
        return n[s];
    return null;
  }

  static CreateClipsFromMorphTargetSequences(e, t, n) {
    const s = {}, a = /^([\w-]*?)([\d]+)$/;
    for (let o = 0, l = e.length; o < l; o++) {
      const c = e[o], d = c.name.match(a);
      if (d && d.length > 1) {
        const u = d[1];
        let h = s[u];
        h || (s[u] = h = []), h.push(c);
      }
    }
    const r = [];
    for (const o in s)
      r.push(this.CreateFromMorphTargetSequence(o, s[o], t, n));
    return r;
  }

  static parseAnimation(e, t) {
    if (Ae("AnimationClip: parseAnimation() is deprecated and will be removed with r185"), !e)
      return we("AnimationClip: No animation in JSONLoader data."), null;
    const n = function(u, h, g, m, A) {
      if (g.length !== 0) {
        const f = [], p = [];
        ih(g, f, p, m), f.length !== 0 && A.push(new u(h, f, p));
      }
    }, s = [], a = e.name || "default", r = e.fps || 30, o = e.blendMode;
    let l = e.length || -1;
    const c = e.hierarchy || [];
    for (let u = 0; u < c.length; u++) {
      const h = c[u].keys;
      if (!(!h || h.length === 0))
        if (h[0].morphTargets) {
          const g = {};
          let m;
          for (m = 0; m < h.length; m++)
            if (h[m].morphTargets)
              for (let A = 0; A < h[m].morphTargets.length; A++)
                g[h[m].morphTargets[A]] = -1;
          for (const A in g) {
            const f = [], p = [];
            for (let b = 0; b !== h[m].morphTargets.length; ++b) {
              const v = h[m];
              f.push(v.time), p.push(v.morphTarget === A ? 1 : 0);
            }
            s.push(new ss(".morphTargetInfluence[" + A + "]", f, p));
          }
          l = g.length * r;
        } else {
          const g = ".bones[" + t[u].name + "]";
          n(
            rs,
            g + ".position",
            h,
            "pos",
            s
          ), n(
            as,
            g + ".quaternion",
            h,
            "rot",
            s
          ), n(
            rs,
            g + ".scale",
            h,
            "scl",
            s
          );
        }
    }
    return s.length === 0 ? null : new this(a, l, s, o);
  }

  resetDuration() {
    const e = this.tracks;
    let t = 0;
    for (let n = 0, s = e.length; n !== s; ++n) {
      const a = this.tracks[n];
      t = Math.max(t, a.times[a.times.length - 1]);
    }
    return this.duration = t, this;
  }

  trim() {
    for (let e = 0; e < this.tracks.length; e++)
      this.tracks[e].trim(0, this.duration);
    return this;
  }

  validate() {
    let e = !0;
    for (let t = 0; t < this.tracks.length; t++)
      e = e && this.tracks[t].validate();
    return e;
  }

  optimize() {
    for (let e = 0; e < this.tracks.length; e++)
      this.tracks[e].optimize();
    return this;
  }

  clone() {
    const e = [];
    for (let n = 0; n < this.tracks.length; n++)
      e.push(this.tracks[n].clone());
    const t = new this.constructor(this.name, this.duration, e, this.blendMode);
    return t.userData = JSON.parse(JSON.stringify(this.userData)), t;
  }

  toJSON() {
    return this.constructor.toJSON(this);
  }
}
function Pg(i) {
  switch (i.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return ss;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return rs;
    case "color":
      return sh;
    case "quaternion":
      return as;
    case "bool":
    case "boolean":
      return cs;
    case "string":
      return ds;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + i);
}
function kg(i) {
  if (i.type === void 0)
    throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const e = Pg(i.type);
  if (i.times === void 0) {
    const t = [], n = [];
    ih(i.keys, t, n, "value"), i.times = t, i.values = n;
  }
  return e.parse !== void 0 ? e.parse(i) : new e(i.name, i.times, i.values, i.interpolation);
}
const Pn = {

  enabled: !1,

  files: {},

  add: function(i, e) {
    this.enabled !== !1 && (Rc(i) || (this.files[i] = e));
  },

  get: function(i) {
    if (this.enabled !== !1 && !Rc(i))
      return this.files[i];
  },

  remove: function(i) {
    delete this.files[i];
  },

  clear: function() {
    this.files = {};
  }
};
function Rc(i) {
  try {
    const e = i.slice(i.indexOf(":") + 1);
    return new URL(e).protocol === "blob:";
  } catch {
    return !1;
  }
}
class Yg {

  constructor(e, t, n) {
    const s = this;
    let a = !1, r = 0, o = 0, l;
    const c = [];
    this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this._abortController = null, this.itemStart = function(d) {
      o++, a === !1 && s.onStart !== void 0 && s.onStart(d, r, o), a = !0;
    }, this.itemEnd = function(d) {
      r++, s.onProgress !== void 0 && s.onProgress(d, r, o), r === o && (a = !1, s.onLoad !== void 0 && s.onLoad());
    }, this.itemError = function(d) {
      s.onError !== void 0 && s.onError(d);
    }, this.resolveURL = function(d) {
      return l ? l(d) : d;
    }, this.setURLModifier = function(d) {
      return l = d, this;
    }, this.addHandler = function(d, u) {
      return c.push(d, u), this;
    }, this.removeHandler = function(d) {
      const u = c.indexOf(d);
      return u !== -1 && c.splice(u, 2), this;
    }, this.getHandler = function(d) {
      for (let u = 0, h = c.length; u < h; u += 2) {
        const g = c[u], m = c[u + 1];
        if (g.global && (g.lastIndex = 0), g.test(d))
          return m;
      }
      return null;
    }, this.abort = function() {
      return this.abortController.abort(), this._abortController = null, this;
    };
  }
  // TODO: Revert this back to a single member variable once this issue has been fixed
  // https://github.com/cloudflare/workerd/issues/3657

  get abortController() {
    return this._abortController || (this._abortController = new AbortController()), this._abortController;
  }
}
const zg = /* @__PURE__ */ new Yg();
class hs {

  constructor(e) {
    this.manager = e !== void 0 ? e : zg, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }

  load() {
  }

  loadAsync(e, t) {
    const n = this;
    return new Promise(function(s, a) {
      n.load(e, s, t, a);
    });
  }

  parse() {
  }

  setCrossOrigin(e) {
    return this.crossOrigin = e, this;
  }

  setWithCredentials(e) {
    return this.withCredentials = e, this;
  }

  setPath(e) {
    return this.path = e, this;
  }

  setResourcePath(e) {
    return this.resourcePath = e, this;
  }

  setRequestHeader(e) {
    return this.requestHeader = e, this;
  }

  abort() {
    return this;
  }
}
hs.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const Xn = {};
class Og extends Error {
  constructor(e, t) {
    super(e), this.response = t;
  }
}
class ah extends hs {

  constructor(e) {
    super(e), this.mimeType = "", this.responseType = "", this._abortController = new AbortController();
  }

  load(e, t, n, s) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const a = Pn.get(`file:${e}`);
    if (a !== void 0) {
      this.manager.itemStart(e), setTimeout(() => {
        t && t(a), this.manager.itemEnd(e);
      }, 0);
      return;
    }
    if (Xn[e] !== void 0) {
      Xn[e].push({
        onLoad: t,
        onProgress: n,
        onError: s
      });
      return;
    }
    Xn[e] = [], Xn[e].push({
      onLoad: t,
      onProgress: n,
      onError: s
    });
    const r = new Request(e, {
      headers: new Headers(this.requestHeader),
      credentials: this.withCredentials ? "include" : "same-origin",
      signal: typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal
    }), o = this.mimeType, l = this.responseType;
    fetch(r).then((c) => {
      if (c.status === 200 || c.status === 0) {
        if (c.status === 0 && Ae("FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0)
          return c;
        const d = Xn[e], u = c.body.getReader(), h = c.headers.get("X-File-Size") || c.headers.get("Content-Length"), g = h ? parseInt(h) : 0, m = g !== 0;
        let A = 0;
        const f = new ReadableStream({
          start(p) {
            b();
            function b() {
              u.read().then(({ done: v, value: S }) => {
                if (v)
                  p.close();
                else {
                  A += S.byteLength;
                  const R = new ProgressEvent("progress", { lengthComputable: m, loaded: A, total: g });
                  for (let x = 0, G = d.length; x < G; x++) {
                    const C = d[x];
                    C.onProgress && C.onProgress(R);
                  }
                  p.enqueue(S), b();
                }
              }, (v) => {
                p.error(v);
              });
            }
          }
        });
        return new Response(f);
      } else
        throw new Og(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c);
    }).then((c) => {
      switch (l) {
        case "arraybuffer":
          return c.arrayBuffer();
        case "blob":
          return c.blob();
        case "document":
          return c.text().then((d) => new DOMParser().parseFromString(d, o));
        case "json":
          return c.json();
        default:
          if (o === "")
            return c.text();
          {
            const u = /charset="?([^;"\s]*)"?/i.exec(o), h = u && u[1] ? u[1].toLowerCase() : void 0, g = new TextDecoder(h);
            return c.arrayBuffer().then((m) => g.decode(m));
          }
      }
    }).then((c) => {
      Pn.add(`file:${e}`, c);
      const d = Xn[e];
      delete Xn[e];
      for (let u = 0, h = d.length; u < h; u++) {
        const g = d[u];
        g.onLoad && g.onLoad(c);
      }
    }).catch((c) => {
      const d = Xn[e];
      if (d === void 0)
        throw this.manager.itemError(e), c;
      delete Xn[e];
      for (let u = 0, h = d.length; u < h; u++) {
        const g = d[u];
        g.onError && g.onError(c);
      }
      this.manager.itemError(e);
    }).finally(() => {
      this.manager.itemEnd(e);
    }), this.manager.itemStart(e);
  }

  setResponseType(e) {
    return this.responseType = e, this;
  }

  setMimeType(e) {
    return this.mimeType = e, this;
  }

  abort() {
    return this._abortController.abort(), this._abortController = new AbortController(), this;
  }
}
const ki = /* @__PURE__ */ new WeakMap();
class Jg extends hs {

  constructor(e) {
    super(e);
  }

  load(e, t, n, s) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const a = this, r = Pn.get(`image:${e}`);
    if (r !== void 0) {
      if (r.complete === !0)
        a.manager.itemStart(e), setTimeout(function() {
          t && t(r), a.manager.itemEnd(e);
        }, 0);
      else {
        let u = ki.get(r);
        u === void 0 && (u = [], ki.set(r, u)), u.push({ onLoad: t, onError: s });
      }
      return r;
    }
    const o = Ds("img");
    function l() {
      d(), t && t(this);
      const u = ki.get(this) || [];
      for (let h = 0; h < u.length; h++) {
        const g = u[h];
        g.onLoad && g.onLoad(this);
      }
      ki.delete(this), a.manager.itemEnd(e);
    }
    function c(u) {
      d(), s && s(u), Pn.remove(`image:${e}`);
      const h = ki.get(this) || [];
      for (let g = 0; g < h.length; g++) {
        const m = h[g];
        m.onError && m.onError(u);
      }
      ki.delete(this), a.manager.itemError(e), a.manager.itemEnd(e);
    }
    function d() {
      o.removeEventListener("load", l, !1), o.removeEventListener("error", c, !1);
    }
    return o.addEventListener("load", l, !1), o.addEventListener("error", c, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), Pn.add(`image:${e}`, o), a.manager.itemStart(e), o.src = e, o;
  }
}
class Kg extends hs {

  constructor(e) {
    super(e);
  }

  load(e, t, n, s) {
    const a = new Gt(), r = new Jg(this.manager);
    return r.setCrossOrigin(this.crossOrigin), r.setPath(this.path), r.load(e, function(o) {
      a.image = o, a.needsUpdate = !0, t !== void 0 && t(a);
    }, n, s), a;
  }
}
class ja extends dt {

  constructor(e, t = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Me(e), this.intensity = t;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  copy(e, t) {
    return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, t;
  }
}
class jg extends ja {

  constructor(e, t, n) {
    super(e, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(dt.DEFAULT_UP), this.updateMatrix(), this.groundColor = new Me(t);
  }
  copy(e, t) {
    return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.groundColor = this.groundColor.getHex(), t;
  }
}
const Er = /* @__PURE__ */ new Ue(), Mc = /* @__PURE__ */ new N(), Gc = /* @__PURE__ */ new N();
class fl {

  constructor(e) {
    this.camera = e, this.intensity = 1, this.bias = 0, this.biasNode = null, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Te(512, 512), this.mapType = en, this.map = null, this.mapPass = null, this.matrix = new Ue(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new cl(), this._frameExtents = new Te(1, 1), this._viewportCount = 1, this._viewports = [
      new rt(0, 0, 1, 1)
    ];
  }

  getViewportCount() {
    return this._viewportCount;
  }

  getFrustum() {
    return this._frustum;
  }

  updateMatrices(e) {
    const t = this.camera, n = this.matrix;
    Mc.setFromMatrixPosition(e.matrixWorld), t.position.copy(Mc), Gc.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(Gc), t.updateMatrixWorld(), Er.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Er, t.coordinateSystem, t.reversedDepth), t.coordinateSystem === Us || t.reversedDepth ? n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      1,
      0,
      // Identity Z (preserving the correct [0, 1] range from the projection matrix)
      0,
      0,
      0,
      1
    ) : n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(Er);
  }

  getViewport(e) {
    return this._viewports[e];
  }

  getFrameExtents() {
    return this._frameExtents;
  }

  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }

  copy(e) {
    return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this.biasNode = e.biasNode, this;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  toJSON() {
    const e = {};
    return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
  }
}
const ya = /* @__PURE__ */ new N(), Sa = /* @__PURE__ */ new jn(), Sn = /* @__PURE__ */ new N();
class rh extends dt {

  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Ue(), this.projectionMatrix = new Ue(), this.projectionMatrixInverse = new Ue(), this.coordinateSystem = Gn, this._reversedDepth = !1;
  }

  get reversedDepth() {
    return this._reversedDepth;
  }
  copy(e, t) {
    return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }

  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorld.decompose(ya, Sa, Sn), Sn.x === 1 && Sn.y === 1 && Sn.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(ya, Sa, Sn.set(1, 1, 1)).invert();
  }
  updateWorldMatrix(e, t) {
    super.updateWorldMatrix(e, t), this.matrixWorld.decompose(ya, Sa, Sn), Sn.x === 1 && Sn.y === 1 && Sn.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(ya, Sa, Sn.set(1, 1, 1)).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const oi = /* @__PURE__ */ new N(), Tc = /* @__PURE__ */ new Te(), Zc = /* @__PURE__ */ new Te();
class Yt extends rh {

  constructor(e = 50, t = 1, n = 0.1, s = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = s, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }

  setFocalLength(e) {
    const t = 0.5 * this.getFilmHeight() / e;
    this.fov = ts * 2 * Math.atan(t), this.updateProjectionMatrix();
  }

  getFocalLength() {
    const e = Math.tan(Zs * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }

  getEffectiveFOV() {
    return ts * 2 * Math.atan(
      Math.tan(Zs * 0.5 * this.fov) / this.zoom
    );
  }

  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }

  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }

  getViewBounds(e, t, n) {
    oi.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(oi.x, oi.y).multiplyScalar(-e / oi.z), oi.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(oi.x, oi.y).multiplyScalar(-e / oi.z);
  }

  getViewSize(e, t) {
    return this.getViewBounds(e, Tc, Zc), t.subVectors(Zc, Tc);
  }

  setViewOffset(e, t, n, s, a, r) {
    this.aspect = e / t, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = s, this.view.width = a, this.view.height = r, this.updateProjectionMatrix();
  }

  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    const e = this.near;
    let t = e * Math.tan(Zs * 0.5 * this.fov) / this.zoom, n = 2 * t, s = this.aspect * n, a = -0.5 * s;
    const r = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = r.fullWidth, c = r.fullHeight;
      a += r.offsetX * s / l, t -= r.offsetY * n / c, s *= r.width / l, n *= r.height / c;
    }
    const o = this.filmOffset;
    o !== 0 && (a += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(a, a + s, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
  }
}
class Qg extends fl {

  constructor() {
    super(new Yt(50, 1, 0.5, 500)), this.isSpotLightShadow = !0, this.focus = 1, this.aspect = 1;
  }
  updateMatrices(e) {
    const t = this.camera, n = ts * 2 * e.angle * this.focus, s = this.mapSize.width / this.mapSize.height * this.aspect, a = e.distance || t.far;
    (n !== t.fov || s !== t.aspect || a !== t.far) && (t.fov = n, t.aspect = s, t.far = a, t.updateProjectionMatrix()), super.updateMatrices(e);
  }
  copy(e) {
    return super.copy(e), this.focus = e.focus, this;
  }
}
class qg extends ja {

  constructor(e, t, n = 0, s = Math.PI / 3, a = 0, r = 2) {
    super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(dt.DEFAULT_UP), this.updateMatrix(), this.target = new dt(), this.distance = n, this.angle = s, this.penumbra = a, this.decay = r, this.map = null, this.shadow = new Qg();
  }

  get power() {
    return this.intensity * Math.PI;
  }
  set power(e) {
    this.intensity = e / Math.PI;
  }
  dispose() {
    super.dispose(), this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.map = e.map, this.shadow = e.shadow.clone(), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.distance = this.distance, t.object.angle = this.angle, t.object.decay = this.decay, t.object.penumbra = this.penumbra, t.object.target = this.target.uuid, this.map && this.map.isTexture && (t.object.map = this.map.toJSON(e).uuid), t.object.shadow = this.shadow.toJSON(), t;
  }
}
class $g extends fl {

  constructor() {
    super(new Yt(90, 1, 0.5, 500)), this.isPointLightShadow = !0;
  }
}
class Po extends ja {

  constructor(e, t, n = 0, s = 2) {
    super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = s, this.shadow = new $g();
  }

  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(e) {
    this.intensity = e / (4 * Math.PI);
  }
  dispose() {
    super.dispose(), this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.distance = this.distance, t.object.decay = this.decay, t.object.shadow = this.shadow.toJSON(), t;
  }
}
class Qa extends rh {

  constructor(e = -1, t = 1, n = 1, s = -1, a = 0.1, r = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = s, this.near = a, this.far = r, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }

  setViewOffset(e, t, n, s, a, r) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = s, this.view.width = a, this.view.height = r, this.updateProjectionMatrix();
  }

  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, s = (this.top + this.bottom) / 2;
    let a = n - e, r = n + e, o = s + t, l = s - t;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, d = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      a += c * this.view.offsetX, r = a + c * this.view.width, o -= d * this.view.offsetY, l = o - d * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(a, r, o, l, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
  }
}
class ep extends fl {

  constructor() {
    super(new Qa(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class oh extends ja {

  constructor(e, t) {
    super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(dt.DEFAULT_UP), this.updateMatrix(), this.target = new dt(), this.shadow = new ep();
  }
  dispose() {
    super.dispose(), this.shadow.dispose();
  }
  copy(e) {
    return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.shadow = this.shadow.toJSON(), t.object.target = this.target.uuid, t;
  }
}
class Ns {

  static extractUrlBase(e) {
    const t = e.lastIndexOf("/");
    return t === -1 ? "./" : e.slice(0, t + 1);
  }

  static resolveURL(e, t) {
    return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
  }
}
const Fr = /* @__PURE__ */ new WeakMap();
class tp extends hs {

  constructor(e) {
    super(e), this.isImageBitmapLoader = !0, typeof createImageBitmap > "u" && Ae("ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && Ae("ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" }, this._abortController = new AbortController();
  }

  setOptions(e) {
    return this.options = e, this;
  }

  load(e, t, n, s) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const a = this, r = Pn.get(`image-bitmap:${e}`);
    if (r !== void 0) {
      if (a.manager.itemStart(e), r.then) {
        r.then((c) => {
          Fr.has(r) === !0 ? (s && s(Fr.get(r)), a.manager.itemError(e), a.manager.itemEnd(e)) : (t && t(c), a.manager.itemEnd(e));
        });
        return;
      }
      setTimeout(function() {
        t && t(r), a.manager.itemEnd(e);
      }, 0);
      return;
    }
    const o = {};
    o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader, o.signal = typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal;
    const l = fetch(e, o).then(function(c) {
      return c.blob();
    }).then(function(c) {
      return createImageBitmap(c, Object.assign(a.options, { colorSpaceConversion: "none" }));
    }).then(function(c) {
      Pn.add(`image-bitmap:${e}`, c), t && t(c), a.manager.itemEnd(e);
    }).catch(function(c) {
      s && s(c), Fr.set(l, c), Pn.remove(`image-bitmap:${e}`), a.manager.itemError(e), a.manager.itemEnd(e);
    });
    Pn.add(`image-bitmap:${e}`, l), a.manager.itemStart(e);
  }

  abort() {
    return this._abortController.abort(), this._abortController = new AbortController(), this;
  }
}
const Yi = -90, zi = 1;
class np extends dt {

  constructor(e, t, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const s = new Yt(Yi, zi, e, t);
    s.layers = this.layers, this.add(s);
    const a = new Yt(Yi, zi, e, t);
    a.layers = this.layers, this.add(a);
    const r = new Yt(Yi, zi, e, t);
    r.layers = this.layers, this.add(r);
    const o = new Yt(Yi, zi, e, t);
    o.layers = this.layers, this.add(o);
    const l = new Yt(Yi, zi, e, t);
    l.layers = this.layers, this.add(l);
    const c = new Yt(Yi, zi, e, t);
    c.layers = this.layers, this.add(c);
  }

  updateCoordinateSystem() {
    const e = this.coordinateSystem, t = this.children.concat(), [n, s, a, r, o, l] = t;
    for (const c of t) this.remove(c);
    if (e === Gn)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), s.up.set(0, 1, 0), s.lookAt(-1, 0, 0), a.up.set(0, 0, -1), a.lookAt(0, 1, 0), r.up.set(0, 0, 1), r.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (e === Us)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), s.up.set(0, -1, 0), s.lookAt(1, 0, 0), a.up.set(0, 0, 1), a.lookAt(0, 1, 0), r.up.set(0, 0, -1), r.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const c of t)
      this.add(c), c.updateMatrixWorld();
  }

  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: s } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [a, r, o, l, c, d] = this.children, u = e.getRenderTarget(), h = e.getActiveCubeFace(), g = e.getActiveMipmapLevel(), m = e.xr.enabled;
    e.xr.enabled = !1;
    const A = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1;
    let f = !1;
    e.isWebGLRenderer === !0 ? f = e.state.buffers.depth.getReversed() : f = e.reversedDepthBuffer, e.setRenderTarget(n, 0, s), f && e.autoClear === !1 && e.clearDepth(), e.render(t, a), e.setRenderTarget(n, 1, s), f && e.autoClear === !1 && e.clearDepth(), e.render(t, r), e.setRenderTarget(n, 2, s), f && e.autoClear === !1 && e.clearDepth(), e.render(t, o), e.setRenderTarget(n, 3, s), f && e.autoClear === !1 && e.clearDepth(), e.render(t, l), e.setRenderTarget(n, 4, s), f && e.autoClear === !1 && e.clearDepth(), e.render(t, c), n.texture.generateMipmaps = A, e.setRenderTarget(n, 5, s), f && e.autoClear === !1 && e.clearDepth(), e.render(t, d), e.setRenderTarget(u, h, g), e.xr.enabled = m, n.texture.needsPMREMUpdate = !0;
  }
}
class ip extends Yt {

  constructor(e = []) {
    super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = e;
  }
}
const ml = "\\[\\]\\.:\\/", sp = new RegExp("[" + ml + "]", "g"), Il = "[^" + ml + "]", ap = "[^" + ml.replace("\\.", "") + "]", rp = /* @__PURE__ */ /((?:WC+[\/:])*)/.source.replace("WC", Il), op = /* @__PURE__ */ /(WCOD+)?/.source.replace("WCOD", ap), lp = /* @__PURE__ */ /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", Il), cp = /* @__PURE__ */ /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", Il), dp = new RegExp(
  "^" + rp + op + lp + cp + "$"
), hp = ["material", "materials", "bones", "map"];
class up {
  constructor(e, t, n) {
    const s = n || $e.parseTrackName(t);
    this._targetGroup = e, this._bindings = e.subscribe_(t, s);
  }
  getValue(e, t) {
    this.bind();
    const n = this._targetGroup.nCachedObjects_, s = this._bindings[n];
    s !== void 0 && s.getValue(e, t);
  }
  setValue(e, t) {
    const n = this._bindings;
    for (let s = this._targetGroup.nCachedObjects_, a = n.length; s !== a; ++s)
      n[s].setValue(e, t);
  }
  bind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t)
      e[t].bind();
  }
  unbind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t)
      e[t].unbind();
  }
}
class $e {

  constructor(e, t, n) {
    this.path = t, this.parsedPath = n || $e.parseTrackName(t), this.node = $e.findNode(e, this.parsedPath.nodeName), this.rootNode = e, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }

  static create(e, t, n) {
    return e && e.isAnimationObjectGroup ? new $e.Composite(e, t, n) : new $e(e, t, n);
  }

  static sanitizeNodeName(e) {
    return e.replace(/\s/g, "_").replace(sp, "");
  }

  static parseTrackName(e) {
    const t = dp.exec(e);
    if (t === null)
      throw new Error("PropertyBinding: Cannot parse trackName: " + e);
    const n = {
      // directoryName: matches[ 1 ], // (tschw) currently unused
      nodeName: t[2],
      objectName: t[3],
      objectIndex: t[4],
      propertyName: t[5],
      // required
      propertyIndex: t[6]
    }, s = n.nodeName && n.nodeName.lastIndexOf(".");
    if (s !== void 0 && s !== -1) {
      const a = n.nodeName.substring(s + 1);
      hp.indexOf(a) !== -1 && (n.nodeName = n.nodeName.substring(0, s), n.objectName = a);
    }
    if (n.propertyName === null || n.propertyName.length === 0)
      throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
    return n;
  }

  static findNode(e, t) {
    if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid)
      return e;
    if (e.skeleton) {
      const n = e.skeleton.getBoneByName(t);
      if (n !== void 0)
        return n;
    }
    if (e.children) {
      const n = function(a) {
        for (let r = 0; r < a.length; r++) {
          const o = a[r];
          if (o.name === t || o.uuid === t)
            return o;
          const l = n(o.children);
          if (l) return l;
        }
        return null;
      }, s = n(e.children);
      if (s)
        return s;
    }
    return null;
  }
  // these are used to "bind" a nonexistent property
  _getValue_unavailable() {
  }
  _setValue_unavailable() {
  }
  // Getters
  _getValue_direct(e, t) {
    e[t] = this.targetObject[this.propertyName];
  }
  _getValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, a = n.length; s !== a; ++s)
      e[t++] = n[s];
  }
  _getValue_arrayElement(e, t) {
    e[t] = this.resolvedProperty[this.propertyIndex];
  }
  _getValue_toArray(e, t) {
    this.resolvedProperty.toArray(e, t);
  }
  // Direct
  _setValue_direct(e, t) {
    this.targetObject[this.propertyName] = e[t];
  }
  _setValue_direct_setNeedsUpdate(e, t) {
    this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = !0;
  }
  _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
    this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  // EntireArray
  _setValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, a = n.length; s !== a; ++s)
      n[s] = e[t++];
  }
  _setValue_array_setNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, a = n.length; s !== a; ++s)
      n[s] = e[t++];
    this.targetObject.needsUpdate = !0;
  }
  _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, a = n.length; s !== a; ++s)
      n[s] = e[t++];
    this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  // ArrayElement
  _setValue_arrayElement(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t];
  }
  _setValue_arrayElement_setNeedsUpdate(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = !0;
  }
  _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  // HasToFromArray
  _setValue_fromArray(e, t) {
    this.resolvedProperty.fromArray(e, t);
  }
  _setValue_fromArray_setNeedsUpdate(e, t) {
    this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = !0;
  }
  _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
    this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _getValue_unbound(e, t) {
    this.bind(), this.getValue(e, t);
  }
  _setValue_unbound(e, t) {
    this.bind(), this.setValue(e, t);
  }

  bind() {
    let e = this.node;
    const t = this.parsedPath, n = t.objectName, s = t.propertyName;
    let a = t.propertyIndex;
    if (e || (e = $e.findNode(this.rootNode, t.nodeName), this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !e) {
      Ae("PropertyBinding: No target node found for track: " + this.path + ".");
      return;
    }
    if (n) {
      let c = t.objectIndex;
      switch (n) {
        case "materials":
          if (!e.material) {
            we("PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.materials) {
            we("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
            return;
          }
          e = e.material.materials;
          break;
        case "bones":
          if (!e.skeleton) {
            we("PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            return;
          }
          e = e.skeleton.bones;
          for (let d = 0; d < e.length; d++)
            if (e[d].name === c) {
              c = d;
              break;
            }
          break;
        case "map":
          if ("map" in e) {
            e = e.map;
            break;
          }
          if (!e.material) {
            we("PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.map) {
            we("PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            return;
          }
          e = e.material.map;
          break;
        default:
          if (e[n] === void 0) {
            we("PropertyBinding: Can not bind to objectName of node undefined.", this);
            return;
          }
          e = e[n];
      }
      if (c !== void 0) {
        if (e[c] === void 0) {
          we("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
          return;
        }
        e = e[c];
      }
    }
    const r = e[s];
    if (r === void 0) {
      const c = t.nodeName;
      we("PropertyBinding: Trying to update property for track: " + c + "." + s + " but it wasn't found.", e);
      return;
    }
    let o = this.Versioning.None;
    this.targetObject = e, e.isMaterial === !0 ? o = this.Versioning.NeedsUpdate : e.isObject3D === !0 && (o = this.Versioning.MatrixWorldNeedsUpdate);
    let l = this.BindingType.Direct;
    if (a !== void 0) {
      if (s === "morphTargetInfluences") {
        if (!e.geometry) {
          we("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          return;
        }
        if (!e.geometry.morphAttributes) {
          we("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
          return;
        }
        e.morphTargetDictionary[a] !== void 0 && (a = e.morphTargetDictionary[a]);
      }
      l = this.BindingType.ArrayElement, this.resolvedProperty = r, this.propertyIndex = a;
    } else r.fromArray !== void 0 && r.toArray !== void 0 ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = r) : Array.isArray(r) ? (l = this.BindingType.EntireArray, this.resolvedProperty = r) : this.propertyName = s;
    this.getValue = this.GetterByBindingType[l], this.setValue = this.SetterByBindingTypeAndVersioning[l][o];
  }

  unbind() {
    this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
}
$e.Composite = up;
$e.prototype.BindingType = {
  Direct: 0,
  EntireArray: 1,
  ArrayElement: 2,
  HasFromToArray: 3
};
$e.prototype.Versioning = {
  None: 0,
  NeedsUpdate: 1,
  MatrixWorldNeedsUpdate: 2
};
$e.prototype.GetterByBindingType = [
  $e.prototype._getValue_direct,
  $e.prototype._getValue_array,
  $e.prototype._getValue_arrayElement,
  $e.prototype._getValue_toArray
];
$e.prototype.SetterByBindingTypeAndVersioning = [
  [
    // Direct
    $e.prototype._setValue_direct,
    $e.prototype._setValue_direct_setNeedsUpdate,
    $e.prototype._setValue_direct_setMatrixWorldNeedsUpdate
  ],
  [
    // EntireArray
    $e.prototype._setValue_array,
    $e.prototype._setValue_array_setNeedsUpdate,
    $e.prototype._setValue_array_setMatrixWorldNeedsUpdate
  ],
  [
    // ArrayElement
    $e.prototype._setValue_arrayElement,
    $e.prototype._setValue_arrayElement_setNeedsUpdate,
    $e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
  ],
  [
    // HasToFromArray
    $e.prototype._setValue_fromArray,
    $e.prototype._setValue_fromArray_setNeedsUpdate,
    $e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
  ]
];
class gp {

  constructor(e = !0) {
    this.autoStart = e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1, Ae("Clock: This module has been deprecated. Please use THREE.Timer instead.");
  }

  start() {
    this.startTime = performance.now(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0;
  }

  stop() {
    this.getElapsedTime(), this.running = !1, this.autoStart = !1;
  }

  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }

  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running)
      return this.start(), 0;
    if (this.running) {
      const t = performance.now();
      e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e;
    }
    return e;
  }
}
const Sl = class Sl {

  constructor(e, t, n, s) {
    this.elements = [
      1,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, s);
  }

  identity() {
    return this.set(
      1,
      0,
      0,
      1
    ), this;
  }

  fromArray(e, t = 0) {
    for (let n = 0; n < 4; n++)
      this.elements[n] = e[n + t];
    return this;
  }

  set(e, t, n, s) {
    const a = this.elements;
    return a[0] = e, a[2] = t, a[1] = n, a[3] = s, this;
  }
};
Sl.prototype.isMatrix2 = !0;
let Bc = Sl;
class pp extends qd {

  constructor(e = 10, t = 10, n = 4473924, s = 8947848) {
    n = new Me(n), s = new Me(s);
    const a = t / 2, r = e / t, o = e / 2, l = [], c = [];
    for (let h = 0, g = 0, m = -o; h <= t; h++, m += r) {
      l.push(-o, 0, m, o, 0, m), l.push(m, 0, -o, m, 0, o);
      const A = h === a ? n : s;
      A.toArray(c, g), g += 3, A.toArray(c, g), g += 3, A.toArray(c, g), g += 3, A.toArray(c, g), g += 3;
    }
    const d = new yt();
    d.setAttribute("position", new Oe(l, 3)), d.setAttribute("color", new Oe(c, 3));
    const u = new dl({ vertexColors: !0, toneMapped: !1 });
    super(d, u), this.type = "GridHelper";
  }

  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
function Nc(i, e, t, n) {
  const s = fp(n);
  switch (t) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case Ud:
      return i * e;
    case qo:
      return i * e / s.components * s.byteLength;
    case $o:
      return i * e / s.components * s.byteLength;
    case xi:
      return i * e * 2 / s.components * s.byteLength;
    case el:
      return i * e * 2 / s.components * s.byteLength;
    case Dd:
      return i * e * 3 / s.components * s.byteLength;
    case dn:
      return i * e * 4 / s.components * s.byteLength;
    case tl:
      return i * e * 4 / s.components * s.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case Ma:
    case Ga:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case Ta:
    case Za:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case oo:
    case co:
      return Math.max(i, 16) * Math.max(e, 8) / 4;
    case ro:
    case lo:
      return Math.max(i, 8) * Math.max(e, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case ho:
    case uo:
    case po:
    case fo:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case go:
    case Fa:
    case mo:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case Io:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case Co:
      return Math.floor((i + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case bo:
      return Math.floor((i + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case Ao:
      return Math.floor((i + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case yo:
      return Math.floor((i + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case So:
      return Math.floor((i + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case vo:
      return Math.floor((i + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case xo:
      return Math.floor((i + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case _o:
      return Math.floor((i + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case wo:
      return Math.floor((i + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case Ro:
      return Math.floor((i + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case Mo:
      return Math.floor((i + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case Go:
      return Math.floor((i + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case To:
      return Math.floor((i + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case Zo:
    case Bo:
    case No:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case Eo:
    case Fo:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 8;
    case Wa:
    case Wo:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${t} format.`
  );
}
function fp(i) {
  switch (i) {
    case en:
    case Fd:
      return { byteLength: 1, components: 1 };
    case Fs:
    case Wd:
    case On:
      return { byteLength: 2, components: 1 };
    case jo:
    case Qo:
      return { byteLength: 2, components: 4 };
    case Bn:
    case Ko:
    case cn:
      return { byteLength: 4, components: 1 };
    case Vd:
    case Ld:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: Jo
} }));
typeof window < "u" && (window.__THREE__ ? Ae("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Jo);
function lh() {
  let i = null, e = !1, t = null, n = null;
  function s(a, r) {
    t(a, r), n = i.requestAnimationFrame(s);
  }
  return {
    start: function() {
      e !== !0 && t !== null && i !== null && (n = i.requestAnimationFrame(s), e = !0);
    },
    stop: function() {
      i !== null && i.cancelAnimationFrame(n), e = !1;
    },
    setAnimationLoop: function(a) {
      t = a;
    },
    setContext: function(a) {
      i = a;
    }
  };
}
function mp(i) {
  const e = /* @__PURE__ */ new WeakMap();
  function t(o, l) {
    const c = o.array, d = o.usage, u = c.byteLength, h = i.createBuffer();
    i.bindBuffer(l, h), i.bufferData(l, c, d), o.onUploadCallback();
    let g;
    if (c instanceof Float32Array)
      g = i.FLOAT;
    else if (typeof Float16Array < "u" && c instanceof Float16Array)
      g = i.HALF_FLOAT;
    else if (c instanceof Uint16Array)
      o.isFloat16BufferAttribute ? g = i.HALF_FLOAT : g = i.UNSIGNED_SHORT;
    else if (c instanceof Int16Array)
      g = i.SHORT;
    else if (c instanceof Uint32Array)
      g = i.UNSIGNED_INT;
    else if (c instanceof Int32Array)
      g = i.INT;
    else if (c instanceof Int8Array)
      g = i.BYTE;
    else if (c instanceof Uint8Array)
      g = i.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray)
      g = i.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
    return {
      buffer: h,
      type: g,
      bytesPerElement: c.BYTES_PER_ELEMENT,
      version: o.version,
      size: u
    };
  }
  function n(o, l, c) {
    const d = l.array, u = l.updateRanges;
    if (i.bindBuffer(c, o), u.length === 0)
      i.bufferSubData(c, 0, d);
    else {
      u.sort((g, m) => g.start - m.start);
      let h = 0;
      for (let g = 1; g < u.length; g++) {
        const m = u[h], A = u[g];
        A.start <= m.start + m.count + 1 ? m.count = Math.max(
          m.count,
          A.start + A.count - m.start
        ) : (++h, u[h] = A);
      }
      u.length = h + 1;
      for (let g = 0, m = u.length; g < m; g++) {
        const A = u[g];
        i.bufferSubData(
          c,
          A.start * d.BYTES_PER_ELEMENT,
          d,
          A.start,
          A.count
        );
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function s(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), e.get(o);
  }
  function a(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = e.get(o);
    l && (i.deleteBuffer(l.buffer), e.delete(o));
  }
  function r(o, l) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const d = e.get(o);
      (!d || d.version < o.version) && e.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    const c = e.get(o);
    if (c === void 0)
      e.set(o, t(o, l));
    else if (c.version < o.version) {
      if (c.size !== o.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(c.buffer, o, l), c.version = o.version;
    }
  }
  return {
    get: s,
    remove: a,
    update: r
  };
}
var Ip = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Cp = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, bp = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Ap = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, yp = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Sp = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, vp = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, xp = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, _p = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`, wp = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, Rp = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Mp = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, Gp = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Tp = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Zp = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, Bp = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, Np = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, Ep = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, Fp = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Wp = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`, Vp = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`, Lp = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`, Up = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`, Dp = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, Xp = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, Hp = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, Pp = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, kp = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, Yp = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, zp = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Op = "gl_FragColor = linearToOutputTexel( gl_FragColor );", Jp = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, Kp = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`, jp = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`, Qp = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, qp = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, $p = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, ef = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, tf = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, nf = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, sf = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, af = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, rf = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, of = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, lf = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, cf = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`, df = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, hf = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, uf = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, gf = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, pf = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, ff = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, mf = `uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN

 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );

 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );

 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );

 		irradiance *= sheenEnergyComp;

 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, If = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Cf = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, bf = `#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Af = `#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`, yf = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Sf = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, vf = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, xf = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, _f = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, wf = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Rf = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Mf = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Gf = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Tf = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, Zf = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Bf = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Nf = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Ef = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, Ff = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Wf = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, Vf = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Lf = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Uf = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Df = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, Xf = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, Hf = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, Pf = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, kf = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, Yf = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, zf = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, Of = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER

		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {

	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`, Jf = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Kf = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, jf = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, Qf = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, qf = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, $f = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, em = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif

				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`, tm = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, nm = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, im = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, sm = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, am = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, rm = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, om = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, lm = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, cm = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, dm = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, hm = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, um = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, gm = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, pm = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, fm = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, mm = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Im = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const Cm = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, bm = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Am = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, ym = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Sm = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, vm = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, xm = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, _m = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, wm = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, Rm = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`, Mm = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, Gm = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Tm = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Zm = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Bm = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, Nm = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Em = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Fm = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Wm = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, Vm = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Lm = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, Um = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, Dm = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Xm = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Hm = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, Pm = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN

		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;

 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, km = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Ym = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, zm = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, Om = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Jm = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Km = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, jm = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Qm = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Le = {
  alphahash_fragment: Ip,
  alphahash_pars_fragment: Cp,
  alphamap_fragment: bp,
  alphamap_pars_fragment: Ap,
  alphatest_fragment: yp,
  alphatest_pars_fragment: Sp,
  aomap_fragment: vp,
  aomap_pars_fragment: xp,
  batching_pars_vertex: _p,
  batching_vertex: wp,
  begin_vertex: Rp,
  beginnormal_vertex: Mp,
  bsdfs: Gp,
  iridescence_fragment: Tp,
  bumpmap_pars_fragment: Zp,
  clipping_planes_fragment: Bp,
  clipping_planes_pars_fragment: Np,
  clipping_planes_pars_vertex: Ep,
  clipping_planes_vertex: Fp,
  color_fragment: Wp,
  color_pars_fragment: Vp,
  color_pars_vertex: Lp,
  color_vertex: Up,
  common: Dp,
  cube_uv_reflection_fragment: Xp,
  defaultnormal_vertex: Hp,
  displacementmap_pars_vertex: Pp,
  displacementmap_vertex: kp,
  emissivemap_fragment: Yp,
  emissivemap_pars_fragment: zp,
  colorspace_fragment: Op,
  colorspace_pars_fragment: Jp,
  envmap_fragment: Kp,
  envmap_common_pars_fragment: jp,
  envmap_pars_fragment: Qp,
  envmap_pars_vertex: qp,
  envmap_physical_pars_fragment: df,
  envmap_vertex: $p,
  fog_vertex: ef,
  fog_pars_vertex: tf,
  fog_fragment: nf,
  fog_pars_fragment: sf,
  gradientmap_pars_fragment: af,
  lightmap_pars_fragment: rf,
  lights_lambert_fragment: of,
  lights_lambert_pars_fragment: lf,
  lights_pars_begin: cf,
  lights_toon_fragment: hf,
  lights_toon_pars_fragment: uf,
  lights_phong_fragment: gf,
  lights_phong_pars_fragment: pf,
  lights_physical_fragment: ff,
  lights_physical_pars_fragment: mf,
  lights_fragment_begin: If,
  lights_fragment_maps: Cf,
  lights_fragment_end: bf,
  lightprobes_pars_fragment: Af,
  logdepthbuf_fragment: yf,
  logdepthbuf_pars_fragment: Sf,
  logdepthbuf_pars_vertex: vf,
  logdepthbuf_vertex: xf,
  map_fragment: _f,
  map_pars_fragment: wf,
  map_particle_fragment: Rf,
  map_particle_pars_fragment: Mf,
  metalnessmap_fragment: Gf,
  metalnessmap_pars_fragment: Tf,
  morphinstance_vertex: Zf,
  morphcolor_vertex: Bf,
  morphnormal_vertex: Nf,
  morphtarget_pars_vertex: Ef,
  morphtarget_vertex: Ff,
  normal_fragment_begin: Wf,
  normal_fragment_maps: Vf,
  normal_pars_fragment: Lf,
  normal_pars_vertex: Uf,
  normal_vertex: Df,
  normalmap_pars_fragment: Xf,
  clearcoat_normal_fragment_begin: Hf,
  clearcoat_normal_fragment_maps: Pf,
  clearcoat_pars_fragment: kf,
  iridescence_pars_fragment: Yf,
  opaque_fragment: zf,
  packing: Of,
  premultiplied_alpha_fragment: Jf,
  project_vertex: Kf,
  dithering_fragment: jf,
  dithering_pars_fragment: Qf,
  roughnessmap_fragment: qf,
  roughnessmap_pars_fragment: $f,
  shadowmap_pars_fragment: em,
  shadowmap_pars_vertex: tm,
  shadowmap_vertex: nm,
  shadowmask_pars_fragment: im,
  skinbase_vertex: sm,
  skinning_pars_vertex: am,
  skinning_vertex: rm,
  skinnormal_vertex: om,
  specularmap_fragment: lm,
  specularmap_pars_fragment: cm,
  tonemapping_fragment: dm,
  tonemapping_pars_fragment: hm,
  transmission_fragment: um,
  transmission_pars_fragment: gm,
  uv_pars_fragment: pm,
  uv_pars_vertex: fm,
  uv_vertex: mm,
  worldpos_vertex: Im,
  background_vert: Cm,
  background_frag: bm,
  backgroundCube_vert: Am,
  backgroundCube_frag: ym,
  cube_vert: Sm,
  cube_frag: vm,
  depth_vert: xm,
  depth_frag: _m,
  distance_vert: wm,
  distance_frag: Rm,
  equirect_vert: Mm,
  equirect_frag: Gm,
  linedashed_vert: Tm,
  linedashed_frag: Zm,
  meshbasic_vert: Bm,
  meshbasic_frag: Nm,
  meshlambert_vert: Em,
  meshlambert_frag: Fm,
  meshmatcap_vert: Wm,
  meshmatcap_frag: Vm,
  meshnormal_vert: Lm,
  meshnormal_frag: Um,
  meshphong_vert: Dm,
  meshphong_frag: Xm,
  meshphysical_vert: Hm,
  meshphysical_frag: Pm,
  meshtoon_vert: km,
  meshtoon_frag: Ym,
  points_vert: zm,
  points_frag: Om,
  shadow_vert: Jm,
  shadow_frag: Km,
  sprite_vert: jm,
  sprite_frag: Qm
}, le = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Me(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Ne() },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 },
    // basic, lambert, phong
    dfgLUT: { value: null }
    // DFG LUT for physically-based rendering
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Ne() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Ne() },
    normalScale: { value: /* @__PURE__ */ new Te(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Ne() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Me(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null },
    probesSH: { value: null },
    probesMin: { value: /* @__PURE__ */ new N() },
    probesMax: { value: /* @__PURE__ */ new N() },
    probesResolution: { value: /* @__PURE__ */ new N() }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Me(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Ne() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Me(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new Te(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaTest: { value: 0 }
  }
}, _n = {
  basic: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.specularmap,
      le.envmap,
      le.aomap,
      le.lightmap,
      le.fog
    ]),
    vertexShader: Le.meshbasic_vert,
    fragmentShader: Le.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.specularmap,
      le.envmap,
      le.aomap,
      le.lightmap,
      le.emissivemap,
      le.bumpmap,
      le.normalmap,
      le.displacementmap,
      le.fog,
      le.lights,
      {
        emissive: { value: /* @__PURE__ */ new Me(0) },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Le.meshlambert_vert,
    fragmentShader: Le.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.specularmap,
      le.envmap,
      le.aomap,
      le.lightmap,
      le.emissivemap,
      le.bumpmap,
      le.normalmap,
      le.displacementmap,
      le.fog,
      le.lights,
      {
        emissive: { value: /* @__PURE__ */ new Me(0) },
        specular: { value: /* @__PURE__ */ new Me(1118481) },
        shininess: { value: 30 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Le.meshphong_vert,
    fragmentShader: Le.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.envmap,
      le.aomap,
      le.lightmap,
      le.emissivemap,
      le.bumpmap,
      le.normalmap,
      le.displacementmap,
      le.roughnessmap,
      le.metalnessmap,
      le.fog,
      le.lights,
      {
        emissive: { value: /* @__PURE__ */ new Me(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Le.meshphysical_vert,
    fragmentShader: Le.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.aomap,
      le.lightmap,
      le.emissivemap,
      le.bumpmap,
      le.normalmap,
      le.displacementmap,
      le.gradientmap,
      le.fog,
      le.lights,
      {
        emissive: { value: /* @__PURE__ */ new Me(0) }
      }
    ]),
    vertexShader: Le.meshtoon_vert,
    fragmentShader: Le.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.bumpmap,
      le.normalmap,
      le.displacementmap,
      le.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Le.meshmatcap_vert,
    fragmentShader: Le.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ Pt([
      le.points,
      le.fog
    ]),
    vertexShader: Le.points_vert,
    fragmentShader: Le.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Le.linedashed_vert,
    fragmentShader: Le.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.displacementmap
    ]),
    vertexShader: Le.depth_vert,
    fragmentShader: Le.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.bumpmap,
      le.normalmap,
      le.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Le.meshnormal_vert,
    fragmentShader: Le.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ Pt([
      le.sprite,
      le.fog
    ]),
    vertexShader: Le.sprite_vert,
    fragmentShader: Le.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Ne() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Le.background_vert,
    fragmentShader: Le.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new Ne() }
    },
    vertexShader: Le.backgroundCube_vert,
    fragmentShader: Le.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Le.cube_vert,
    fragmentShader: Le.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Le.equirect_vert,
    fragmentShader: Le.equirect_frag
  },
  distance: {
    uniforms: /* @__PURE__ */ Pt([
      le.common,
      le.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new N() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Le.distance_vert,
    fragmentShader: Le.distance_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Pt([
      le.lights,
      le.fog,
      {
        color: { value: /* @__PURE__ */ new Me(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Le.shadow_vert,
    fragmentShader: Le.shadow_frag
  }
};
_n.physical = {
  uniforms: /* @__PURE__ */ Pt([
    _n.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Ne() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Ne() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new Te(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Ne() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Ne() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Ne() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Me(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Ne() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Ne() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Ne() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new Te() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Ne() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Me(0) },
      specularColor: { value: /* @__PURE__ */ new Me(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Ne() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Ne() },
      anisotropyVector: { value: /* @__PURE__ */ new Te() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Ne() }
    }
  ]),
  vertexShader: Le.meshphysical_vert,
  fragmentShader: Le.meshphysical_frag
};
const va = { r: 0, b: 0, g: 0 }, qm = /* @__PURE__ */ new Ue(), ch = /* @__PURE__ */ new Ne();
ch.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function $m(i, e, t, n, s, a) {
  const r = new Me(0);
  let o = s === !0 ? 0 : 1, l, c, d = null, u = 0, h = null;
  function g(b) {
    let v = b.isScene === !0 ? b.background : null;
    if (v && v.isTexture) {
      const S = b.backgroundBlurriness > 0;
      v = e.get(v, S);
    }
    return v;
  }
  function m(b) {
    let v = !1;
    const S = g(b);
    S === null ? f(r, o) : S && S.isColor && (f(S, 1), v = !0);
    const R = i.xr.getEnvironmentBlendMode();
    R === "additive" ? t.buffers.color.setClear(0, 0, 0, 1, a) : R === "alpha-blend" && t.buffers.color.setClear(0, 0, 0, 0, a), (i.autoClear || v) && (t.buffers.depth.setTest(!0), t.buffers.depth.setMask(!0), t.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function A(b, v) {
    const S = g(v);
    S && (S.isCubeTexture || S.mapping === Ya) ? (c === void 0 && (c = new ve(
      new Tt(1, 1, 1),
      new Nn({
        name: "BackgroundCubeMaterial",
        uniforms: is(_n.backgroundCube.uniforms),
        vertexShader: _n.backgroundCube.vertexShader,
        fragmentShader: _n.backgroundCube.fragmentShader,
        side: Jt,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        allowOverride: !1
      })
    ), c.geometry.deleteAttribute("normal"), c.geometry.deleteAttribute("uv"), c.onBeforeRender = function(R, x, G) {
      this.matrixWorld.copyPosition(G.matrixWorld);
    }, Object.defineProperty(c.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), n.update(c)), c.material.uniforms.envMap.value = S, c.material.uniforms.backgroundBlurriness.value = v.backgroundBlurriness, c.material.uniforms.backgroundIntensity.value = v.backgroundIntensity, c.material.uniforms.backgroundRotation.value.setFromMatrix4(qm.makeRotationFromEuler(v.backgroundRotation)).transpose(), S.isCubeTexture && S.isRenderTargetTexture === !1 && c.material.uniforms.backgroundRotation.value.premultiply(ch), c.material.toneMapped = Pe.getTransfer(S.colorSpace) !== Qe, (d !== S || u !== S.version || h !== i.toneMapping) && (c.material.needsUpdate = !0, d = S, u = S.version, h = i.toneMapping), c.layers.enableAll(), b.unshift(c, c.geometry, c.material, 0, 0, null)) : S && S.isTexture && (l === void 0 && (l = new ve(
      new Ja(2, 2),
      new Nn({
        name: "BackgroundMaterial",
        uniforms: is(_n.background.uniforms),
        vertexShader: _n.background.vertexShader,
        fragmentShader: _n.background.fragmentShader,
        side: zn,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        allowOverride: !1
      })
    ), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), n.update(l)), l.material.uniforms.t2D.value = S, l.material.uniforms.backgroundIntensity.value = v.backgroundIntensity, l.material.toneMapped = Pe.getTransfer(S.colorSpace) !== Qe, S.matrixAutoUpdate === !0 && S.updateMatrix(), l.material.uniforms.uvTransform.value.copy(S.matrix), (d !== S || u !== S.version || h !== i.toneMapping) && (l.material.needsUpdate = !0, d = S, u = S.version, h = i.toneMapping), l.layers.enableAll(), b.unshift(l, l.geometry, l.material, 0, 0, null));
  }
  function f(b, v) {
    b.getRGB(va, nh(i)), t.buffers.color.setClear(va.r, va.g, va.b, v, a);
  }
  function p() {
    c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0), l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0);
  }
  return {
    getClearColor: function() {
      return r;
    },
    setClearColor: function(b, v = 1) {
      r.set(b), o = v, f(r, o);
    },
    getClearAlpha: function() {
      return o;
    },
    setClearAlpha: function(b) {
      o = b, f(r, o);
    },
    render: m,
    addToRenderList: A,
    dispose: p
  };
}
function eI(i, e) {
  const t = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, s = h(null);
  let a = s, r = !1;
  function o(M, Z, U, H, F) {
    let L = !1;
    const P = u(M, H, U, Z);
    a !== P && (a = P, c(a.object)), L = g(M, H, U, F), L && m(M, H, U, F), F !== null && e.update(F, i.ELEMENT_ARRAY_BUFFER), (L || r) && (r = !1, S(M, Z, U, H), F !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(F).buffer));
  }
  function l() {
    return i.createVertexArray();
  }
  function c(M) {
    return i.bindVertexArray(M);
  }
  function d(M) {
    return i.deleteVertexArray(M);
  }
  function u(M, Z, U, H) {
    const F = H.wireframe === !0;
    let L = n[Z.id];
    L === void 0 && (L = {}, n[Z.id] = L);
    const P = M.isInstancedMesh === !0 ? M.id : 0;
    let j = L[P];
    j === void 0 && (j = {}, L[P] = j);
    let $ = j[U.id];
    $ === void 0 && ($ = {}, j[U.id] = $);
    let ce = $[F];
    return ce === void 0 && (ce = h(l()), $[F] = ce), ce;
  }
  function h(M) {
    const Z = [], U = [], H = [];
    for (let F = 0; F < t; F++)
      Z[F] = 0, U[F] = 0, H[F] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: Z,
      enabledAttributes: U,
      attributeDivisors: H,
      object: M,
      attributes: {},
      index: null
    };
  }
  function g(M, Z, U, H) {
    const F = a.attributes, L = Z.attributes;
    let P = 0;
    const j = U.getAttributes();
    for (const $ in j)
      if (j[$].location >= 0) {
        const Ce = F[$];
        let xe = L[$];
        if (xe === void 0 && ($ === "instanceMatrix" && M.instanceMatrix && (xe = M.instanceMatrix), $ === "instanceColor" && M.instanceColor && (xe = M.instanceColor)), Ce === void 0 || Ce.attribute !== xe || xe && Ce.data !== xe.data) return !0;
        P++;
      }
    return a.attributesNum !== P || a.index !== H;
  }
  function m(M, Z, U, H) {
    const F = {}, L = Z.attributes;
    let P = 0;
    const j = U.getAttributes();
    for (const $ in j)
      if (j[$].location >= 0) {
        let Ce = L[$];
        Ce === void 0 && ($ === "instanceMatrix" && M.instanceMatrix && (Ce = M.instanceMatrix), $ === "instanceColor" && M.instanceColor && (Ce = M.instanceColor));
        const xe = {};
        xe.attribute = Ce, Ce && Ce.data && (xe.data = Ce.data), F[$] = xe, P++;
      }
    a.attributes = F, a.attributesNum = P, a.index = H;
  }
  function A() {
    const M = a.newAttributes;
    for (let Z = 0, U = M.length; Z < U; Z++)
      M[Z] = 0;
  }
  function f(M) {
    p(M, 0);
  }
  function p(M, Z) {
    const U = a.newAttributes, H = a.enabledAttributes, F = a.attributeDivisors;
    U[M] = 1, H[M] === 0 && (i.enableVertexAttribArray(M), H[M] = 1), F[M] !== Z && (i.vertexAttribDivisor(M, Z), F[M] = Z);
  }
  function b() {
    const M = a.newAttributes, Z = a.enabledAttributes;
    for (let U = 0, H = Z.length; U < H; U++)
      Z[U] !== M[U] && (i.disableVertexAttribArray(U), Z[U] = 0);
  }
  function v(M, Z, U, H, F, L, P) {
    P === !0 ? i.vertexAttribIPointer(M, Z, U, F, L) : i.vertexAttribPointer(M, Z, U, H, F, L);
  }
  function S(M, Z, U, H) {
    A();
    const F = H.attributes, L = U.getAttributes(), P = Z.defaultAttributeValues;
    for (const j in L) {
      const $ = L[j];
      if ($.location >= 0) {
        let ce = F[j];
        if (ce === void 0 && (j === "instanceMatrix" && M.instanceMatrix && (ce = M.instanceMatrix), j === "instanceColor" && M.instanceColor && (ce = M.instanceColor)), ce !== void 0) {
          const Ce = ce.normalized, xe = ce.itemSize, Je = e.get(ce);
          if (Je === void 0) continue;
          const et = Je.buffer, We = Je.type, K = Je.bytesPerElement, ue = We === i.INT || We === i.UNSIGNED_INT || ce.gpuType === Ko;
          if (ce.isInterleavedBufferAttribute) {
            const ie = ce.data, Re = ie.stride, Be = ce.offset;
            if (ie.isInstancedInterleavedBuffer) {
              for (let Ge = 0; Ge < $.locationSize; Ge++)
                p($.location + Ge, ie.meshPerAttribute);
              M.isInstancedMesh !== !0 && H._maxInstanceCount === void 0 && (H._maxInstanceCount = ie.meshPerAttribute * ie.count);
            } else
              for (let Ge = 0; Ge < $.locationSize; Ge++)
                f($.location + Ge);
            i.bindBuffer(i.ARRAY_BUFFER, et);
            for (let Ge = 0; Ge < $.locationSize; Ge++)
              v(
                $.location + Ge,
                xe / $.locationSize,
                We,
                Ce,
                Re * K,
                (Be + xe / $.locationSize * Ge) * K,
                ue
              );
          } else {
            if (ce.isInstancedBufferAttribute) {
              for (let ie = 0; ie < $.locationSize; ie++)
                p($.location + ie, ce.meshPerAttribute);
              M.isInstancedMesh !== !0 && H._maxInstanceCount === void 0 && (H._maxInstanceCount = ce.meshPerAttribute * ce.count);
            } else
              for (let ie = 0; ie < $.locationSize; ie++)
                f($.location + ie);
            i.bindBuffer(i.ARRAY_BUFFER, et);
            for (let ie = 0; ie < $.locationSize; ie++)
              v(
                $.location + ie,
                xe / $.locationSize,
                We,
                Ce,
                xe * K,
                xe / $.locationSize * ie * K,
                ue
              );
          }
        } else if (P !== void 0) {
          const Ce = P[j];
          if (Ce !== void 0)
            switch (Ce.length) {
              case 2:
                i.vertexAttrib2fv($.location, Ce);
                break;
              case 3:
                i.vertexAttrib3fv($.location, Ce);
                break;
              case 4:
                i.vertexAttrib4fv($.location, Ce);
                break;
              default:
                i.vertexAttrib1fv($.location, Ce);
            }
        }
      }
    }
    b();
  }
  function R() {
    w();
    for (const M in n) {
      const Z = n[M];
      for (const U in Z) {
        const H = Z[U];
        for (const F in H) {
          const L = H[F];
          for (const P in L)
            d(L[P].object), delete L[P];
          delete H[F];
        }
      }
      delete n[M];
    }
  }
  function x(M) {
    if (n[M.id] === void 0) return;
    const Z = n[M.id];
    for (const U in Z) {
      const H = Z[U];
      for (const F in H) {
        const L = H[F];
        for (const P in L)
          d(L[P].object), delete L[P];
        delete H[F];
      }
    }
    delete n[M.id];
  }
  function G(M) {
    for (const Z in n) {
      const U = n[Z];
      for (const H in U) {
        const F = U[H];
        if (F[M.id] === void 0) continue;
        const L = F[M.id];
        for (const P in L)
          d(L[P].object), delete L[P];
        delete F[M.id];
      }
    }
  }
  function C(M) {
    for (const Z in n) {
      const U = n[Z], H = M.isInstancedMesh === !0 ? M.id : 0, F = U[H];
      if (F !== void 0) {
        for (const L in F) {
          const P = F[L];
          for (const j in P)
            d(P[j].object), delete P[j];
          delete F[L];
        }
        delete U[H], Object.keys(U).length === 0 && delete n[Z];
      }
    }
  }
  function w() {
    T(), r = !0, a !== s && (a = s, c(a.object));
  }
  function T() {
    s.geometry = null, s.program = null, s.wireframe = !1;
  }
  return {
    setup: o,
    reset: w,
    resetDefaultState: T,
    dispose: R,
    releaseStatesOfGeometry: x,
    releaseStatesOfObject: C,
    releaseStatesOfProgram: G,
    initAttributes: A,
    enableAttribute: f,
    disableUnusedAttributes: b
  };
}
function tI(i, e, t) {
  let n;
  function s(l) {
    n = l;
  }
  function a(l, c) {
    i.drawArrays(n, l, c), t.update(c, n, 1);
  }
  function r(l, c, d) {
    d !== 0 && (i.drawArraysInstanced(n, l, c, d), t.update(c, n, d));
  }
  function o(l, c, d) {
    if (d === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, l, 0, c, 0, d);
    let h = 0;
    for (let g = 0; g < d; g++)
      h += c[g];
    t.update(h, n, 1);
  }
  this.setMode = s, this.render = a, this.renderInstances = r, this.renderMultiDraw = o;
}
function nI(i, e, t, n) {
  let s;
  function a() {
    if (s !== void 0) return s;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      const G = e.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(G.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      s = 0;
    return s;
  }
  function r(G) {
    return !(G !== dn && n.convert(G) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(G) {
    const C = G === On && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(G !== en && n.convert(G) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    G !== cn && !C);
  }
  function l(G) {
    if (G === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
        return "highp";
      G = "mediump";
    }
    return G === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let c = t.precision !== void 0 ? t.precision : "highp";
  const d = l(c);
  d !== c && (Ae("WebGLRenderer:", c, "not supported, using", d, "instead."), c = d);
  const u = t.logarithmicDepthBuffer === !0, h = t.reversedDepthBuffer === !0 && e.has("EXT_clip_control");
  t.reversedDepthBuffer === !0 && h === !1 && Ae("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
  const g = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), m = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), A = i.getParameter(i.MAX_TEXTURE_SIZE), f = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), p = i.getParameter(i.MAX_VERTEX_ATTRIBS), b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), v = i.getParameter(i.MAX_VARYING_VECTORS), S = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), R = i.getParameter(i.MAX_SAMPLES), x = i.getParameter(i.SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: a,
    getMaxPrecision: l,
    textureFormatReadable: r,
    textureTypeReadable: o,
    precision: c,
    logarithmicDepthBuffer: u,
    reversedDepthBuffer: h,
    maxTextures: g,
    maxVertexTextures: m,
    maxTextureSize: A,
    maxCubemapSize: f,
    maxAttributes: p,
    maxVertexUniforms: b,
    maxVaryings: v,
    maxFragmentUniforms: S,
    maxSamples: R,
    samples: x
  };
}
function iI(i) {
  const e = this;
  let t = null, n = 0, s = !1, a = !1;
  const r = new bi(), o = new Ne(), l = { value: null, needsUpdate: !1 };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(u, h) {
    const g = u.length !== 0 || h || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || s;
    return s = h, n = u.length, g;
  }, this.beginShadows = function() {
    a = !0, d(null);
  }, this.endShadows = function() {
    a = !1;
  }, this.setGlobalState = function(u, h) {
    t = d(u, h, 0);
  }, this.setState = function(u, h, g) {
    const m = u.clippingPlanes, A = u.clipIntersection, f = u.clipShadows, p = i.get(u);
    if (!s || m === null || m.length === 0 || a && !f)
      a ? d(null) : c();
    else {
      const b = a ? 0 : n, v = b * 4;
      let S = p.clippingState || null;
      l.value = S, S = d(m, h, v, g);
      for (let R = 0; R !== v; ++R)
        S[R] = t[R];
      p.clippingState = S, this.numIntersection = A ? this.numPlanes : 0, this.numPlanes += b;
    }
  };
  function c() {
    l.value !== t && (l.value = t, l.needsUpdate = n > 0), e.numPlanes = n, e.numIntersection = 0;
  }
  function d(u, h, g, m) {
    const A = u !== null ? u.length : 0;
    let f = null;
    if (A !== 0) {
      if (f = l.value, m !== !0 || f === null) {
        const p = g + A * 4, b = h.matrixWorldInverse;
        o.getNormalMatrix(b), (f === null || f.length < p) && (f = new Float32Array(p));
        for (let v = 0, S = g; v !== A; ++v, S += 4)
          r.copy(u[v]).applyMatrix4(b, o), r.normal.toArray(f, S), f[S + 3] = r.constant;
      }
      l.value = f, l.needsUpdate = !0;
    }
    return e.numPlanes = A, e.numIntersection = 0, f;
  }
}
const hi = 4, Ec = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], yi = 20, sI = 256, xs = /* @__PURE__ */ new Qa(), Fc = /* @__PURE__ */ new Me();
let Wr = null, Vr = 0, Lr = 0, Ur = !1;
const aI = /* @__PURE__ */ new N();
class Wc {

  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._sigmas = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
  }

  fromScene(e, t = 0, n = 0.1, s = 100, a = {}) {
    const {
      size: r = 256,
      position: o = aI
    } = a;
    Wr = this._renderer.getRenderTarget(), Vr = this._renderer.getActiveCubeFace(), Lr = this._renderer.getActiveMipmapLevel(), Ur = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(r);
    const l = this._allocateTargets();
    return l.depthBuffer = !0, this._sceneToCubeUV(e, n, s, l, o), t > 0 && this._blur(l, 0, 0, t), this._applyPMREM(l), this._cleanup(l), l;
  }

  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }

  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }

  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Uc(), this._compileMaterial(this._cubemapMaterial));
  }

  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Lc(), this._compileMaterial(this._equirectMaterial));
  }

  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
  }
  // private interface
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodMeshes.length; e++)
      this._lodMeshes[e].geometry.dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(Wr, Vr, Lr), this._renderer.xr.enabled = Ur, e.scissorTest = !1, Oi(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, t) {
    e.mapping === vi || e.mapping === $i ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Wr = this._renderer.getRenderTarget(), Vr = this._renderer.getActiveCubeFace(), Lr = this._renderer.getActiveMipmapLevel(), Ur = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = t || this._allocateTargets();
    return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
      magFilter: Mt,
      minFilter: Mt,
      generateMipmaps: !1,
      type: On,
      format: dn,
      colorSpace: tn,
      depthBuffer: !1
    }, s = Vc(e, t, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Vc(e, t, n);
      const { _lodMax: a } = this;
      ({ lodMeshes: this._lodMeshes, sizeLods: this._sizeLods, sigmas: this._sigmas } = rI(a)), this._blurMaterial = lI(a, e, t), this._ggxMaterial = oI(a, e, t);
    }
    return s;
  }
  _compileMaterial(e) {
    const t = new ve(new yt(), e);
    this._renderer.compile(t, xs);
  }
  _sceneToCubeUV(e, t, n, s, a) {
    const l = new Yt(90, 1, t, n), c = [1, -1, 1, 1, 1, 1], d = [1, 1, 1, -1, -1, -1], u = this._renderer, h = u.autoClear, g = u.toneMapping;
    u.getClearColor(Fc), u.toneMapping = Tn, u.autoClear = !1, u.state.buffers.depth.getReversed() && (u.setRenderTarget(s), u.clearDepth(), u.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new ve(
      new Tt(),
      new Dt({
        name: "PMREM.Background",
        side: Jt,
        depthWrite: !1,
        depthTest: !1
      })
    ));
    const A = this._backgroundBox, f = A.material;
    let p = !1;
    const b = e.background;
    b ? b.isColor && (f.color.copy(b), e.background = null, p = !0) : (f.color.copy(Fc), p = !0);
    for (let v = 0; v < 6; v++) {
      const S = v % 3;
      S === 0 ? (l.up.set(0, c[v], 0), l.position.set(a.x, a.y, a.z), l.lookAt(a.x + d[v], a.y, a.z)) : S === 1 ? (l.up.set(0, 0, c[v]), l.position.set(a.x, a.y, a.z), l.lookAt(a.x, a.y + d[v], a.z)) : (l.up.set(0, c[v], 0), l.position.set(a.x, a.y, a.z), l.lookAt(a.x, a.y, a.z + d[v]));
      const R = this._cubeSize;
      Oi(s, S * R, v > 2 ? R : 0, R, R), u.setRenderTarget(s), p && u.render(A, l), u.render(e, l);
    }
    u.toneMapping = g, u.autoClear = h, e.background = b;
  }
  _textureToCubeUV(e, t) {
    const n = this._renderer, s = e.mapping === vi || e.mapping === $i;
    s ? (this._cubemapMaterial === null && (this._cubemapMaterial = Uc()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Lc());
    const a = s ? this._cubemapMaterial : this._equirectMaterial, r = this._lodMeshes[0];
    r.material = a;
    const o = a.uniforms;
    o.envMap.value = e;
    const l = this._cubeSize;
    Oi(t, 0, 0, 3 * l, 2 * l), n.setRenderTarget(t), n.render(r, xs);
  }
  _applyPMREM(e) {
    const t = this._renderer, n = t.autoClear;
    t.autoClear = !1;
    const s = this._lodMeshes.length;
    for (let a = 1; a < s; a++)
      this._applyGGXFilter(e, a - 1, a);
    t.autoClear = n;
  }

  _applyGGXFilter(e, t, n) {
    const s = this._renderer, a = this._pingPongRenderTarget, r = this._ggxMaterial, o = this._lodMeshes[n];
    o.material = r;
    const l = r.uniforms, c = n / (this._lodMeshes.length - 1), d = t / (this._lodMeshes.length - 1), u = Math.sqrt(c * c - d * d), h = 0 + c * 1.25, g = u * h, { _lodMax: m } = this, A = this._sizeLods[n], f = 3 * A * (n > m - hi ? n - m + hi : 0), p = 4 * (this._cubeSize - A);
    l.envMap.value = e.texture, l.roughness.value = g, l.mipInt.value = m - t, Oi(a, f, p, 3 * A, 2 * A), s.setRenderTarget(a), s.render(o, xs), l.envMap.value = a.texture, l.roughness.value = 0, l.mipInt.value = m - n, Oi(e, f, p, 3 * A, 2 * A), s.setRenderTarget(e), s.render(o, xs);
  }

  _blur(e, t, n, s, a) {
    const r = this._pingPongRenderTarget;
    this._halfBlur(
      e,
      r,
      t,
      n,
      s,
      "latitudinal",
      a
    ), this._halfBlur(
      r,
      e,
      n,
      n,
      s,
      "longitudinal",
      a
    );
  }
  _halfBlur(e, t, n, s, a, r, o) {
    const l = this._renderer, c = this._blurMaterial;
    r !== "latitudinal" && r !== "longitudinal" && we(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const d = 3, u = this._lodMeshes[s];
    u.material = c;
    const h = c.uniforms, g = this._sizeLods[n] - 1, m = isFinite(a) ? Math.PI / (2 * g) : 2 * Math.PI / (2 * yi - 1), A = a / m, f = isFinite(a) ? 1 + Math.floor(d * A) : yi;
    f > yi && Ae(`sigmaRadians, ${a}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${yi}`);
    const p = [];
    let b = 0;
    for (let G = 0; G < yi; ++G) {
      const C = G / A, w = Math.exp(-C * C / 2);
      p.push(w), G === 0 ? b += w : G < f && (b += 2 * w);
    }
    for (let G = 0; G < p.length; G++)
      p[G] = p[G] / b;
    h.envMap.value = e.texture, h.samples.value = f, h.weights.value = p, h.latitudinal.value = r === "latitudinal", o && (h.poleAxis.value = o);
    const { _lodMax: v } = this;
    h.dTheta.value = m, h.mipInt.value = v - n;
    const S = this._sizeLods[s], R = 3 * S * (s > v - hi ? s - v + hi : 0), x = 4 * (this._cubeSize - S);
    Oi(t, R, x, 3 * S, 2 * S), l.setRenderTarget(t), l.render(u, xs);
  }
}
function rI(i) {
  const e = [], t = [], n = [];
  let s = i;
  const a = i - hi + 1 + Ec.length;
  for (let r = 0; r < a; r++) {
    const o = Math.pow(2, s);
    e.push(o);
    let l = 1 / o;
    r > i - hi ? l = Ec[r - i + hi - 1] : r === 0 && (l = 0), t.push(l);
    const c = 1 / (o - 2), d = -c, u = 1 + c, h = [d, d, u, d, u, u, d, d, u, u, d, u], g = 6, m = 6, A = 3, f = 2, p = 1, b = new Float32Array(A * m * g), v = new Float32Array(f * m * g), S = new Float32Array(p * m * g);
    for (let x = 0; x < g; x++) {
      const G = x % 3 * 2 / 3 - 1, C = x > 2 ? 0 : -1, w = [
        G,
        C,
        0,
        G + 2 / 3,
        C,
        0,
        G + 2 / 3,
        C + 1,
        0,
        G,
        C,
        0,
        G + 2 / 3,
        C + 1,
        0,
        G,
        C + 1,
        0
      ];
      b.set(w, A * m * x), v.set(h, f * m * x);
      const T = [x, x, x, x, x, x];
      S.set(T, p * m * x);
    }
    const R = new yt();
    R.setAttribute("position", new zt(b, A)), R.setAttribute("uv", new zt(v, f)), R.setAttribute("faceIndex", new zt(S, p)), n.push(new ve(R, null)), s > hi && s--;
  }
  return { lodMeshes: n, sizeLods: e, sigmas: t };
}
function Vc(i, e, t) {
  const n = new Zn(i, e, t);
  return n.texture.mapping = Ya, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function Oi(i, e, t, n, s) {
  i.viewport.set(e, t, n, s), i.scissor.set(e, t, n, s);
}
function oI(i, e, t) {
  return new Nn({
    name: "PMREMGGXConvolution",
    defines: {
      GGX_SAMPLES: sI,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      roughness: { value: 0 },
      mipInt: { value: 0 }
    },
    vertexShader: qa(),
    fragmentShader: (
      /* glsl */
      `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`
    ),
    blending: kn,
    depthTest: !1,
    depthWrite: !1
  });
}
function lI(i, e, t) {
  const n = new Float32Array(yi), s = new N(0, 1, 0);
  return new Nn({
    name: "SphericalGaussianBlur",
    defines: {
      n: yi,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: s }
    },
    vertexShader: qa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: kn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Lc() {
  return new Nn({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: qa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: kn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Uc() {
  return new Nn({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: qa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: kn,
    depthTest: !1,
    depthWrite: !1
  });
}
function qa() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
class dh extends Zn {

  constructor(e = 1, t = {}) {
    super(e, e, t), this.isWebGLCubeRenderTarget = !0;
    const n = { width: e, height: e, depth: 1 }, s = [n, n, n, n, n, n];
    this.texture = new eh(s), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
  }

  fromEquirectangularTexture(e, t) {
    this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, s = new Tt(5, 5, 5), a = new Nn({
      name: "CubemapFromEquirect",
      uniforms: is(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: Jt,
      blending: kn
    });
    a.uniforms.tEquirect.value = t;
    const r = new ve(s, a), o = t.minFilter;
    return t.minFilter === Hn && (t.minFilter = Mt), new np(1, 10, this).update(e, r), t.minFilter = o, r.geometry.dispose(), r.material.dispose(), this;
  }

  clear(e, t = !0, n = !0, s = !0) {
    const a = e.getRenderTarget();
    for (let r = 0; r < 6; r++)
      e.setRenderTarget(this, r), e.clear(t, n, s);
    e.setRenderTarget(a);
  }
}
function cI(i) {
  let e = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap(), n = null;
  function s(h, g = !1) {
    return h == null ? null : g ? r(h) : a(h);
  }
  function a(h) {
    if (h && h.isTexture) {
      const g = h.mapping;
      if (g === ar || g === rr)
        if (e.has(h)) {
          const m = e.get(h).texture;
          return o(m, h.mapping);
        } else {
          const m = h.image;
          if (m && m.height > 0) {
            const A = new dh(m.height);
            return A.fromEquirectangularTexture(i, h), e.set(h, A), h.addEventListener("dispose", c), o(A.texture, h.mapping);
          } else
            return null;
        }
    }
    return h;
  }
  function r(h) {
    if (h && h.isTexture) {
      const g = h.mapping, m = g === ar || g === rr, A = g === vi || g === $i;
      if (m || A) {
        let f = t.get(h);
        const p = f !== void 0 ? f.texture.pmremVersion : 0;
        if (h.isRenderTargetTexture && h.pmremVersion !== p)
          return n === null && (n = new Wc(i)), f = m ? n.fromEquirectangular(h, f) : n.fromCubemap(h, f), f.texture.pmremVersion = h.pmremVersion, t.set(h, f), f.texture;
        if (f !== void 0)
          return f.texture;
        {
          const b = h.image;
          return m && b && b.height > 0 || A && b && l(b) ? (n === null && (n = new Wc(i)), f = m ? n.fromEquirectangular(h) : n.fromCubemap(h), f.texture.pmremVersion = h.pmremVersion, t.set(h, f), h.addEventListener("dispose", d), f.texture) : null;
        }
      }
    }
    return h;
  }
  function o(h, g) {
    return g === ar ? h.mapping = vi : g === rr && (h.mapping = $i), h;
  }
  function l(h) {
    let g = 0;
    const m = 6;
    for (let A = 0; A < m; A++)
      h[A] !== void 0 && g++;
    return g === m;
  }
  function c(h) {
    const g = h.target;
    g.removeEventListener("dispose", c);
    const m = e.get(g);
    m !== void 0 && (e.delete(g), m.dispose());
  }
  function d(h) {
    const g = h.target;
    g.removeEventListener("dispose", d);
    const m = t.get(g);
    m !== void 0 && (t.delete(g), m.dispose());
  }
  function u() {
    e = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap(), n !== null && (n.dispose(), n = null);
  }
  return {
    get: s,
    dispose: u
  };
}
function dI(i) {
  const e = {};
  function t(n) {
    if (e[n] !== void 0)
      return e[n];
    const s = i.getExtension(n);
    return e[n] = s, s;
  }
  return {
    has: function(n) {
      return t(n) !== null;
    },
    init: function() {
      t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance"), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture"), t("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const s = t(n);
      return s === null && Do("WebGLRenderer: " + n + " extension not supported."), s;
    }
  };
}
function hI(i, e, t, n) {
  const s = {}, a = /* @__PURE__ */ new WeakMap();
  function r(u) {
    const h = u.target;
    h.index !== null && e.remove(h.index);
    for (const m in h.attributes)
      e.remove(h.attributes[m]);
    h.removeEventListener("dispose", r), delete s[h.id];
    const g = a.get(h);
    g && (e.remove(g), a.delete(h)), n.releaseStatesOfGeometry(h), h.isInstancedBufferGeometry === !0 && delete h._maxInstanceCount, t.memory.geometries--;
  }
  function o(u, h) {
    return s[h.id] === !0 || (h.addEventListener("dispose", r), s[h.id] = !0, t.memory.geometries++), h;
  }
  function l(u) {
    const h = u.attributes;
    for (const g in h)
      e.update(h[g], i.ARRAY_BUFFER);
  }
  function c(u) {
    const h = [], g = u.index, m = u.attributes.position;
    let A = 0;
    if (m === void 0)
      return;
    if (g !== null) {
      const b = g.array;
      A = g.version;
      for (let v = 0, S = b.length; v < S; v += 3) {
        const R = b[v + 0], x = b[v + 1], G = b[v + 2];
        h.push(R, x, x, G, G, R);
      }
    } else {
      const b = m.array;
      A = m.version;
      for (let v = 0, S = b.length / 3 - 1; v < S; v += 3) {
        const R = v + 0, x = v + 1, G = v + 2;
        h.push(R, x, x, G, G, R);
      }
    }
    const f = new (m.count >= 65535 ? Od : zd)(h, 1);
    f.version = A;
    const p = a.get(u);
    p && e.remove(p), a.set(u, f);
  }
  function d(u) {
    const h = a.get(u);
    if (h) {
      const g = u.index;
      g !== null && h.version < g.version && c(u);
    } else
      c(u);
    return a.get(u);
  }
  return {
    get: o,
    update: l,
    getWireframeAttribute: d
  };
}
function uI(i, e, t) {
  let n;
  function s(u) {
    n = u;
  }
  let a, r;
  function o(u) {
    a = u.type, r = u.bytesPerElement;
  }
  function l(u, h) {
    i.drawElements(n, h, a, u * r), t.update(h, n, 1);
  }
  function c(u, h, g) {
    g !== 0 && (i.drawElementsInstanced(n, h, a, u * r, g), t.update(h, n, g));
  }
  function d(u, h, g) {
    if (g === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, h, 0, a, u, 0, g);
    let A = 0;
    for (let f = 0; f < g; f++)
      A += h[f];
    t.update(A, n, 1);
  }
  this.setMode = s, this.setIndex = o, this.render = l, this.renderInstances = c, this.renderMultiDraw = d;
}
function gI(i) {
  const e = {
    geometries: 0,
    textures: 0
  }, t = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(a, r, o) {
    switch (t.calls++, r) {
      case i.TRIANGLES:
        t.triangles += o * (a / 3);
        break;
      case i.LINES:
        t.lines += o * (a / 2);
        break;
      case i.LINE_STRIP:
        t.lines += o * (a - 1);
        break;
      case i.LINE_LOOP:
        t.lines += o * a;
        break;
      case i.POINTS:
        t.points += o * a;
        break;
      default:
        we("WebGLInfo: Unknown draw mode:", r);
        break;
    }
  }
  function s() {
    t.calls = 0, t.triangles = 0, t.points = 0, t.lines = 0;
  }
  return {
    memory: e,
    render: t,
    programs: null,
    autoReset: !0,
    reset: s,
    update: n
  };
}
function pI(i, e, t) {
  const n = /* @__PURE__ */ new WeakMap(), s = new rt();
  function a(r, o, l) {
    const c = r.morphTargetInfluences, d = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = d !== void 0 ? d.length : 0;
    let h = n.get(o);
    if (h === void 0 || h.count !== u) {
      let w = function() {
        G.dispose(), n.delete(o), o.removeEventListener("dispose", w);
      };
      h !== void 0 && h.texture.dispose();
      const g = o.morphAttributes.position !== void 0, m = o.morphAttributes.normal !== void 0, A = o.morphAttributes.color !== void 0, f = o.morphAttributes.position || [], p = o.morphAttributes.normal || [], b = o.morphAttributes.color || [];
      let v = 0;
      g === !0 && (v = 1), m === !0 && (v = 2), A === !0 && (v = 3);
      let S = o.attributes.position.count * v, R = 1;
      S > e.maxTextureSize && (R = Math.ceil(S / e.maxTextureSize), S = e.maxTextureSize);
      const x = new Float32Array(S * R * 4 * u), G = new Pd(x, S, R, u);
      G.type = cn, G.needsUpdate = !0;
      const C = v * 4;
      for (let T = 0; T < u; T++) {
        const M = f[T], Z = p[T], U = b[T], H = S * R * 4 * T;
        for (let F = 0; F < M.count; F++) {
          const L = F * C;
          g === !0 && (s.fromBufferAttribute(M, F), x[H + L + 0] = s.x, x[H + L + 1] = s.y, x[H + L + 2] = s.z, x[H + L + 3] = 0), m === !0 && (s.fromBufferAttribute(Z, F), x[H + L + 4] = s.x, x[H + L + 5] = s.y, x[H + L + 6] = s.z, x[H + L + 7] = 0), A === !0 && (s.fromBufferAttribute(U, F), x[H + L + 8] = s.x, x[H + L + 9] = s.y, x[H + L + 10] = s.z, x[H + L + 11] = U.itemSize === 4 ? s.w : 1);
        }
      }
      h = {
        count: u,
        texture: G,
        size: new Te(S, R)
      }, n.set(o, h), o.addEventListener("dispose", w);
    }
    if (r.isInstancedMesh === !0 && r.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", r.morphTexture, t);
    else {
      let g = 0;
      for (let A = 0; A < c.length; A++)
        g += c[A];
      const m = o.morphTargetsRelative ? 1 : 1 - g;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", m), l.getUniforms().setValue(i, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", h.texture, t), l.getUniforms().setValue(i, "morphTargetsTextureSize", h.size);
  }
  return {
    update: a
  };
}
function fI(i, e, t, n, s) {
  let a = /* @__PURE__ */ new WeakMap();
  function r(c) {
    const d = s.render.frame, u = c.geometry, h = e.get(c, u);
    if (a.get(h) !== d && (e.update(h), a.set(h, d)), c.isInstancedMesh && (c.hasEventListener("dispose", l) === !1 && c.addEventListener("dispose", l), a.get(c) !== d && (t.update(c.instanceMatrix, i.ARRAY_BUFFER), c.instanceColor !== null && t.update(c.instanceColor, i.ARRAY_BUFFER), a.set(c, d))), c.isSkinnedMesh) {
      const g = c.skeleton;
      a.get(g) !== d && (g.update(), a.set(g, d));
    }
    return h;
  }
  function o() {
    a = /* @__PURE__ */ new WeakMap();
  }
  function l(c) {
    const d = c.target;
    d.removeEventListener("dispose", l), n.releaseStatesOfObject(d), t.remove(d.instanceMatrix), d.instanceColor !== null && t.remove(d.instanceColor);
  }
  return {
    update: r,
    dispose: o
  };
}
const mI = {
  [wd]: "LINEAR_TONE_MAPPING",
  [Rd]: "REINHARD_TONE_MAPPING",
  [Md]: "CINEON_TONE_MAPPING",
  [Gd]: "ACES_FILMIC_TONE_MAPPING",
  [Zd]: "AGX_TONE_MAPPING",
  [Bd]: "NEUTRAL_TONE_MAPPING",
  [Td]: "CUSTOM_TONE_MAPPING"
};
function II(i, e, t, n, s) {
  const a = new Zn(e, t, {
    type: i,
    depthBuffer: n,
    stencilBuffer: s,
    depthTexture: n ? new ns(e, t) : void 0
  }), r = new Zn(e, t, {
    type: On,
    depthBuffer: !1,
    stencilBuffer: !1
  }), o = new yt();
  o.setAttribute("position", new Oe([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), o.setAttribute("uv", new Oe([0, 2, 0, 0, 2, 0], 2));
  const l = new Ng({
    uniforms: {
      tDiffuse: { value: null }
    },
    vertexShader: (
      /* glsl */
      `
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`
    ),
    fragmentShader: (
      /* glsl */
      `
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`
    ),
    depthTest: !1,
    depthWrite: !1
  }), c = new ve(o, l), d = new Qa(-1, 1, 1, -1, 0, 1);
  let u = null, h = null, g = !1, m, A = null, f = [], p = !1;
  this.setSize = function(b, v) {
    a.setSize(b, v), r.setSize(b, v);
    for (let S = 0; S < f.length; S++) {
      const R = f[S];
      R.setSize && R.setSize(b, v);
    }
  }, this.setEffects = function(b) {
    f = b, p = f.length > 0 && f[0].isRenderPass === !0;
    const v = a.width, S = a.height;
    for (let R = 0; R < f.length; R++) {
      const x = f[R];
      x.setSize && x.setSize(v, S);
    }
  }, this.begin = function(b, v) {
    if (g || b.toneMapping === Tn && f.length === 0) return !1;
    if (A = v, v !== null) {
      const S = v.width, R = v.height;
      (a.width !== S || a.height !== R) && this.setSize(S, R);
    }
    return p === !1 && b.setRenderTarget(a), m = b.toneMapping, b.toneMapping = Tn, !0;
  }, this.hasRenderPass = function() {
    return p;
  }, this.end = function(b, v) {
    b.toneMapping = m, g = !0;
    let S = a, R = r;
    for (let x = 0; x < f.length; x++) {
      const G = f[x];
      if (G.enabled !== !1 && (G.render(b, R, S, v), G.needsSwap !== !1)) {
        const C = S;
        S = R, R = C;
      }
    }
    if (u !== b.outputColorSpace || h !== b.toneMapping) {
      u = b.outputColorSpace, h = b.toneMapping, l.defines = {}, Pe.getTransfer(u) === Qe && (l.defines.SRGB_TRANSFER = "");
      const x = mI[h];
      x && (l.defines[x] = ""), l.needsUpdate = !0;
    }
    l.uniforms.tDiffuse.value = S.texture, b.setRenderTarget(A), b.render(c, d), A = null, g = !1;
  }, this.isCompositing = function() {
    return g;
  }, this.dispose = function() {
    a.depthTexture && a.depthTexture.dispose(), a.dispose(), r.dispose(), o.dispose(), l.dispose();
  };
}
const hh = /* @__PURE__ */ new Gt(), ko = /* @__PURE__ */ new ns(1, 1), uh = /* @__PURE__ */ new Pd(), gh = /* @__PURE__ */ new ng(), ph = /* @__PURE__ */ new eh(), Dc = [], Xc = [], Hc = new Float32Array(16), Pc = new Float32Array(9), kc = new Float32Array(4);
function us(i, e, t) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = e * t;
  let a = Dc[s];
  if (a === void 0 && (a = new Float32Array(s), Dc[s] = a), e !== 0) {
    n.toArray(a, 0);
    for (let r = 1, o = 0; r !== e; ++r)
      o += t, i[r].toArray(a, o);
  }
  return a;
}
function Bt(i, e) {
  if (i.length !== e.length) return !1;
  for (let t = 0, n = i.length; t < n; t++)
    if (i[t] !== e[t]) return !1;
  return !0;
}
function Nt(i, e) {
  for (let t = 0, n = e.length; t < n; t++)
    i[t] = e[t];
}
function $a(i, e) {
  let t = Xc[e];
  t === void 0 && (t = new Int32Array(e), Xc[e] = t);
  for (let n = 0; n !== e; ++n)
    t[n] = i.allocateTextureUnit();
  return t;
}
function CI(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1f(this.addr, e), t[0] = e);
}
function bI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (i.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (Bt(t, e)) return;
    i.uniform2fv(this.addr, e), Nt(t, e);
  }
}
function AI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else if (e.r !== void 0)
    (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (i.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
  else {
    if (Bt(t, e)) return;
    i.uniform3fv(this.addr, e), Nt(t, e);
  }
}
function yI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (Bt(t, e)) return;
    i.uniform4fv(this.addr, e), Nt(t, e);
  }
}
function SI(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (Bt(t, e)) return;
    i.uniformMatrix2fv(this.addr, !1, e), Nt(t, e);
  } else {
    if (Bt(t, n)) return;
    kc.set(n), i.uniformMatrix2fv(this.addr, !1, kc), Nt(t, n);
  }
}
function vI(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (Bt(t, e)) return;
    i.uniformMatrix3fv(this.addr, !1, e), Nt(t, e);
  } else {
    if (Bt(t, n)) return;
    Pc.set(n), i.uniformMatrix3fv(this.addr, !1, Pc), Nt(t, n);
  }
}
function xI(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (Bt(t, e)) return;
    i.uniformMatrix4fv(this.addr, !1, e), Nt(t, e);
  } else {
    if (Bt(t, n)) return;
    Hc.set(n), i.uniformMatrix4fv(this.addr, !1, Hc), Nt(t, n);
  }
}
function _I(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1i(this.addr, e), t[0] = e);
}
function wI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (i.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (Bt(t, e)) return;
    i.uniform2iv(this.addr, e), Nt(t, e);
  }
}
function RI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (Bt(t, e)) return;
    i.uniform3iv(this.addr, e), Nt(t, e);
  }
}
function MI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (Bt(t, e)) return;
    i.uniform4iv(this.addr, e), Nt(t, e);
  }
}
function GI(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1ui(this.addr, e), t[0] = e);
}
function TI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (i.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (Bt(t, e)) return;
    i.uniform2uiv(this.addr, e), Nt(t, e);
  }
}
function ZI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (Bt(t, e)) return;
    i.uniform3uiv(this.addr, e), Nt(t, e);
  }
}
function BI(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (Bt(t, e)) return;
    i.uniform4uiv(this.addr, e), Nt(t, e);
  }
}
function NI(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s);
  let a;
  this.type === i.SAMPLER_2D_SHADOW ? (ko.compareFunction = t.isReversedDepthBuffer() ? il : nl, a = ko) : a = hh, t.setTexture2D(e || a, s);
}
function EI(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), t.setTexture3D(e || gh, s);
}
function FI(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), t.setTextureCube(e || ph, s);
}
function WI(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), t.setTexture2DArray(e || uh, s);
}
function VI(i) {
  switch (i) {
    case 5126:
      return CI;
    // FLOAT
    case 35664:
      return bI;
    // _VEC2
    case 35665:
      return AI;
    // _VEC3
    case 35666:
      return yI;
    // _VEC4
    case 35674:
      return SI;
    // _MAT2
    case 35675:
      return vI;
    // _MAT3
    case 35676:
      return xI;
    // _MAT4
    case 5124:
    case 35670:
      return _I;
    // INT, BOOL
    case 35667:
    case 35671:
      return wI;
    // _VEC2
    case 35668:
    case 35672:
      return RI;
    // _VEC3
    case 35669:
    case 35673:
      return MI;
    // _VEC4
    case 5125:
      return GI;
    // UINT
    case 36294:
      return TI;
    // _VEC2
    case 36295:
      return ZI;
    // _VEC3
    case 36296:
      return BI;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return NI;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return EI;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return FI;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return WI;
  }
}
function LI(i, e) {
  i.uniform1fv(this.addr, e);
}
function UI(i, e) {
  const t = us(e, this.size, 2);
  i.uniform2fv(this.addr, t);
}
function DI(i, e) {
  const t = us(e, this.size, 3);
  i.uniform3fv(this.addr, t);
}
function XI(i, e) {
  const t = us(e, this.size, 4);
  i.uniform4fv(this.addr, t);
}
function HI(i, e) {
  const t = us(e, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, t);
}
function PI(i, e) {
  const t = us(e, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, t);
}
function kI(i, e) {
  const t = us(e, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, t);
}
function YI(i, e) {
  i.uniform1iv(this.addr, e);
}
function zI(i, e) {
  i.uniform2iv(this.addr, e);
}
function OI(i, e) {
  i.uniform3iv(this.addr, e);
}
function JI(i, e) {
  i.uniform4iv(this.addr, e);
}
function KI(i, e) {
  i.uniform1uiv(this.addr, e);
}
function jI(i, e) {
  i.uniform2uiv(this.addr, e);
}
function QI(i, e) {
  i.uniform3uiv(this.addr, e);
}
function qI(i, e) {
  i.uniform4uiv(this.addr, e);
}
function $I(i, e, t) {
  const n = this.cache, s = e.length, a = $a(t, s);
  Bt(n, a) || (i.uniform1iv(this.addr, a), Nt(n, a));
  let r;
  this.type === i.SAMPLER_2D_SHADOW ? r = ko : r = hh;
  for (let o = 0; o !== s; ++o)
    t.setTexture2D(e[o] || r, a[o]);
}
function e0(i, e, t) {
  const n = this.cache, s = e.length, a = $a(t, s);
  Bt(n, a) || (i.uniform1iv(this.addr, a), Nt(n, a));
  for (let r = 0; r !== s; ++r)
    t.setTexture3D(e[r] || gh, a[r]);
}
function t0(i, e, t) {
  const n = this.cache, s = e.length, a = $a(t, s);
  Bt(n, a) || (i.uniform1iv(this.addr, a), Nt(n, a));
  for (let r = 0; r !== s; ++r)
    t.setTextureCube(e[r] || ph, a[r]);
}
function n0(i, e, t) {
  const n = this.cache, s = e.length, a = $a(t, s);
  Bt(n, a) || (i.uniform1iv(this.addr, a), Nt(n, a));
  for (let r = 0; r !== s; ++r)
    t.setTexture2DArray(e[r] || uh, a[r]);
}
function i0(i) {
  switch (i) {
    case 5126:
      return LI;
    // FLOAT
    case 35664:
      return UI;
    // _VEC2
    case 35665:
      return DI;
    // _VEC3
    case 35666:
      return XI;
    // _VEC4
    case 35674:
      return HI;
    // _MAT2
    case 35675:
      return PI;
    // _MAT3
    case 35676:
      return kI;
    // _MAT4
    case 5124:
    case 35670:
      return YI;
    // INT, BOOL
    case 35667:
    case 35671:
      return zI;
    // _VEC2
    case 35668:
    case 35672:
      return OI;
    // _VEC3
    case 35669:
    case 35673:
      return JI;
    // _VEC4
    case 5125:
      return KI;
    // UINT
    case 36294:
      return jI;
    // _VEC2
    case 36295:
      return QI;
    // _VEC3
    case 36296:
      return qI;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return $I;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return e0;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return t0;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return n0;
  }
}
class s0 {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = VI(t.type);
  }
}
class a0 {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = i0(t.type);
  }
}
class r0 {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, t, n) {
    const s = this.seq;
    for (let a = 0, r = s.length; a !== r; ++a) {
      const o = s[a];
      o.setValue(e, t[o.id], n);
    }
  }
}
const Dr = /(\w+)(\])?(\[|\.)?/g;
function Yc(i, e) {
  i.seq.push(e), i.map[e.id] = e;
}
function o0(i, e, t) {
  const n = i.name, s = n.length;
  for (Dr.lastIndex = 0; ; ) {
    const a = Dr.exec(n), r = Dr.lastIndex;
    let o = a[1];
    const l = a[2] === "]", c = a[3];
    if (l && (o = o | 0), c === void 0 || c === "[" && r + 2 === s) {
      Yc(t, c === void 0 ? new s0(o, i, e) : new a0(o, i, e));
      break;
    } else {
      let u = t.map[o];
      u === void 0 && (u = new r0(o), Yc(t, u)), t = u;
    }
  }
}
class Ba {
  constructor(e, t) {
    this.seq = [], this.map = {};
    const n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let r = 0; r < n; ++r) {
      const o = e.getActiveUniform(t, r), l = e.getUniformLocation(t, o.name);
      o0(o, l, this);
    }
    const s = [], a = [];
    for (const r of this.seq)
      r.type === e.SAMPLER_2D_SHADOW || r.type === e.SAMPLER_CUBE_SHADOW || r.type === e.SAMPLER_2D_ARRAY_SHADOW ? s.push(r) : a.push(r);
    s.length > 0 && (this.seq = s.concat(a));
  }
  setValue(e, t, n, s) {
    const a = this.map[t];
    a !== void 0 && a.setValue(e, n, s);
  }
  setOptional(e, t, n) {
    const s = t[n];
    s !== void 0 && this.setValue(e, n, s);
  }
  static upload(e, t, n, s) {
    for (let a = 0, r = t.length; a !== r; ++a) {
      const o = t[a], l = n[o.id];
      l.needsUpdate !== !1 && o.setValue(e, l.value, s);
    }
  }
  static seqWithValue(e, t) {
    const n = [];
    for (let s = 0, a = e.length; s !== a; ++s) {
      const r = e[s];
      r.id in t && n.push(r);
    }
    return n;
  }
}
function zc(i, e, t) {
  const n = i.createShader(e);
  return i.shaderSource(n, t), i.compileShader(n), n;
}
const l0 = 37297;
let c0 = 0;
function d0(i, e) {
  const t = i.split(`
`), n = [], s = Math.max(e - 6, 0), a = Math.min(e + 6, t.length);
  for (let r = s; r < a; r++) {
    const o = r + 1;
    n.push(`${o === e ? ">" : " "} ${o}: ${t[r]}`);
  }
  return n.join(`
`);
}
const Oc = /* @__PURE__ */ new Ne();
function h0(i) {
  Pe._getMatrix(Oc, Pe.workingColorSpace, i);
  const e = `mat3( ${Oc.elements.map((t) => t.toFixed(4))} )`;
  switch (Pe.getTransfer(i)) {
    case Va:
      return [e, "LinearTransferOETF"];
    case Qe:
      return [e, "sRGBTransferOETF"];
    default:
      return Ae("WebGLProgram: Unsupported color space: ", i), [e, "LinearTransferOETF"];
  }
}
function Jc(i, e, t) {
  const n = i.getShaderParameter(e, i.COMPILE_STATUS), a = (i.getShaderInfoLog(e) || "").trim();
  if (n && a === "") return "";
  const r = /ERROR: 0:(\d+)/.exec(a);
  if (r) {
    const o = parseInt(r[1]);
    return t.toUpperCase() + `

` + a + `

` + d0(i.getShaderSource(e), o);
  } else
    return a;
}
function u0(i, e) {
  const t = h0(e);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
const g0 = {
  [wd]: "Linear",
  [Rd]: "Reinhard",
  [Md]: "Cineon",
  [Gd]: "ACESFilmic",
  [Zd]: "AgX",
  [Bd]: "Neutral",
  [Td]: "Custom"
};
function p0(i, e) {
  const t = g0[e];
  return t === void 0 ? (Ae("WebGLProgram: Unsupported toneMapping:", e), "vec3 " + i + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + i + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
const xa = /* @__PURE__ */ new N();
function f0() {
  Pe.getLuminanceCoefficients(xa);
  const i = xa.x.toFixed(4), e = xa.y.toFixed(4), t = xa.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function m0(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(Gs).join(`
`);
}
function I0(i) {
  const e = [];
  for (const t in i) {
    const n = i[t];
    n !== !1 && e.push("#define " + t + " " + n);
  }
  return e.join(`
`);
}
function C0(i, e) {
  const t = {}, n = i.getProgramParameter(e, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    const a = i.getActiveAttrib(e, s), r = a.name;
    let o = 1;
    a.type === i.FLOAT_MAT2 && (o = 2), a.type === i.FLOAT_MAT3 && (o = 3), a.type === i.FLOAT_MAT4 && (o = 4), t[r] = {
      type: a.type,
      location: i.getAttribLocation(e, r),
      locationSize: o
    };
  }
  return t;
}
function Gs(i) {
  return i !== "";
}
function Kc(i, e) {
  const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function jc(i, e) {
  return i.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const b0 = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Yo(i) {
  return i.replace(b0, y0);
}
const A0 = /* @__PURE__ */ new Map();
function y0(i, e) {
  let t = Le[e];
  if (t === void 0) {
    const n = A0.get(e);
    if (n !== void 0)
      t = Le[n], Ae('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, n);
    else
      throw new Error("Can not resolve #include <" + e + ">");
  }
  return Yo(t);
}
const S0 = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Qc(i) {
  return i.replace(S0, v0);
}
function v0(i, e, t, n) {
  let s = "";
  for (let a = parseInt(e); a < parseInt(t); a++)
    s += n.replace(/\[\s*i\s*\]/g, "[ " + a + " ]").replace(/UNROLLED_LOOP_INDEX/g, a);
  return s;
}
function qc(i) {
  let e = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return i.precision === "highp" ? e += `
#define HIGH_PRECISION` : i.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
}
const x0 = {
  [wa]: "SHADOWMAP_TYPE_PCF",
  [Rs]: "SHADOWMAP_TYPE_VSM"
};
function _0(i) {
  return x0[i.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
const w0 = {
  [vi]: "ENVMAP_TYPE_CUBE",
  [$i]: "ENVMAP_TYPE_CUBE",
  [Ya]: "ENVMAP_TYPE_CUBE_UV"
};
function R0(i) {
  return i.envMap === !1 ? "ENVMAP_TYPE_CUBE" : w0[i.envMapMode] || "ENVMAP_TYPE_CUBE";
}
const M0 = {
  [$i]: "ENVMAP_MODE_REFRACTION"
};
function G0(i) {
  return i.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : M0[i.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
const T0 = {
  [_d]: "ENVMAP_BLENDING_MULTIPLY",
  [mu]: "ENVMAP_BLENDING_MIX",
  [Iu]: "ENVMAP_BLENDING_ADD"
};
function Z0(i) {
  return i.envMap === !1 ? "ENVMAP_BLENDING_NONE" : T0[i.combine] || "ENVMAP_BLENDING_NONE";
}
function B0(i) {
  const e = i.envMapCubeUVHeight;
  if (e === null) return null;
  const t = Math.log2(e) - 2, n = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 112)), texelHeight: n, maxMip: t };
}
function N0(i, e, t, n) {
  const s = i.getContext(), a = t.defines;
  let r = t.vertexShader, o = t.fragmentShader;
  const l = _0(t), c = R0(t), d = G0(t), u = Z0(t), h = B0(t), g = m0(t), m = I0(a), A = s.createProgram();
  let f, p, b = t.glslVersion ? "#version " + t.glslVersion + `
` : "";
  t.isRawShaderMaterial ? (f = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    m
  ].filter(Gs).join(`
`), f.length > 0 && (f += `
`), p = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    m
  ].filter(Gs).join(`
`), p.length > 0 && (p += `
`)) : (f = [
    qc(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    m,
    t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    t.batching ? "#define USE_BATCHING" : "",
    t.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    t.instancing ? "#define USE_INSTANCING" : "",
    t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.map ? "#define USE_MAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + d : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    t.mapUv ? "#define MAP_UV " + t.mapUv : "",
    t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
    t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
    t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
    t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
    t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
    t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
    t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "",
    t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
    t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
    t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "",
    t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
    t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "",
    t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "",
    t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "",
    t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "",
    t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "",
    t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "",
    t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
    t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "",
    t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "",
    t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "",
    t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
    //
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexNormals ? "#define HAS_NORMAL" : "",
    t.vertexColors ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.skinning ? "#define USE_SKINNING" : "",
    t.morphTargets ? "#define USE_MORPHTARGETS" : "",
    t.morphNormals && t.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    t.morphColors ? "#define USE_MORPHCOLORS" : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + l : "",
    t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
    t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(Gs).join(`
`), p = [
    qc(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    m,
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    t.map ? "#define USE_MAP" : "",
    t.matcap ? "#define USE_MATCAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + c : "",
    t.envMap ? "#define " + d : "",
    t.envMap ? "#define " + u : "",
    h ? "#define CUBEUV_TEXEL_WIDTH " + h.texelWidth : "",
    h ? "#define CUBEUV_TEXEL_HEIGHT " + h.texelHeight : "",
    h ? "#define CUBEUV_MAX_MIP " + h.maxMip + ".0" : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoat ? "#define USE_CLEARCOAT" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.dispersion ? "#define USE_DISPERSION" : "",
    t.iridescence ? "#define USE_IRIDESCENCE" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaTest ? "#define USE_ALPHATEST" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.sheen ? "#define USE_SHEEN" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors || t.instancingColor ? "#define USE_COLOR" : "",
    t.vertexAlphas || t.batchingColor ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.gradientMap ? "#define USE_GRADIENTMAP" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + l : "",
    t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
    t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    t.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
    t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    t.toneMapping !== Tn ? "#define TONE_MAPPING" : "",
    t.toneMapping !== Tn ? Le.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    t.toneMapping !== Tn ? p0("toneMapping", t.toneMapping) : "",
    t.dithering ? "#define DITHERING" : "",
    t.opaque ? "#define OPAQUE" : "",
    Le.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    u0("linearToOutputTexel", t.outputColorSpace),
    f0(),
    t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
    `
`
  ].filter(Gs).join(`
`)), r = Yo(r), r = Kc(r, t), r = jc(r, t), o = Yo(o), o = Kc(o, t), o = jc(o, t), r = Qc(r), o = Qc(o), t.isRawShaderMaterial !== !0 && (b = `#version 300 es
`, f = [
    g,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + f, p = [
    "#define varying in",
    t.glslVersion === Ol ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    t.glslVersion === Ol ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + p);
  const v = b + f + r, S = b + p + o, R = zc(s, s.VERTEX_SHADER, v), x = zc(s, s.FRAGMENT_SHADER, S);
  s.attachShader(A, R), s.attachShader(A, x), t.index0AttributeName !== void 0 ? s.bindAttribLocation(A, 0, t.index0AttributeName) : t.morphTargets === !0 && s.bindAttribLocation(A, 0, "position"), s.linkProgram(A);
  function G(M) {
    if (i.debug.checkShaderErrors) {
      const Z = s.getProgramInfoLog(A) || "", U = s.getShaderInfoLog(R) || "", H = s.getShaderInfoLog(x) || "", F = Z.trim(), L = U.trim(), P = H.trim();
      let j = !0, $ = !0;
      if (s.getProgramParameter(A, s.LINK_STATUS) === !1)
        if (j = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(s, A, R, x);
        else {
          const ce = Jc(s, R, "vertex"), Ce = Jc(s, x, "fragment");
          we(
            "THREE.WebGLProgram: Shader Error " + s.getError() + " - VALIDATE_STATUS " + s.getProgramParameter(A, s.VALIDATE_STATUS) + `

Material Name: ` + M.name + `
Material Type: ` + M.type + `

Program Info Log: ` + F + `
` + ce + `
` + Ce
          );
        }
      else F !== "" ? Ae("WebGLProgram: Program Info Log:", F) : (L === "" || P === "") && ($ = !1);
      $ && (M.diagnostics = {
        runnable: j,
        programLog: F,
        vertexShader: {
          log: L,
          prefix: f
        },
        fragmentShader: {
          log: P,
          prefix: p
        }
      });
    }
    s.deleteShader(R), s.deleteShader(x), C = new Ba(s, A), w = C0(s, A);
  }
  let C;
  this.getUniforms = function() {
    return C === void 0 && G(this), C;
  };
  let w;
  this.getAttributes = function() {
    return w === void 0 && G(this), w;
  };
  let T = t.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return T === !1 && (T = s.getProgramParameter(A, l0)), T;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), s.deleteProgram(A), this.program = void 0;
  }, this.type = t.shaderType, this.name = t.shaderName, this.id = c0++, this.cacheKey = e, this.usedTimes = 1, this.program = A, this.vertexShader = R, this.fragmentShader = x, this;
}
let E0 = 0;
class F0 {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e) {
    const t = e.vertexShader, n = e.fragmentShader, s = this._getShaderStage(t), a = this._getShaderStage(n), r = this._getShaderCacheForMaterial(e);
    return r.has(s) === !1 && (r.add(s), s.usedTimes++), r.has(a) === !1 && (r.add(a), a.usedTimes++), this;
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const n of t)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let n = t.get(e);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let n = t.get(e);
    return n === void 0 && (n = new W0(e), t.set(e, n)), n;
  }
}
class W0 {
  constructor(e) {
    this.id = E0++, this.code = e, this.usedTimes = 0;
  }
}
function V0(i) {
  return i === xi || i === Fa || i === Wa;
}
function L0(i, e, t, n, s, a) {
  const r = new kd(), o = new F0(), l = /* @__PURE__ */ new Set(), c = [], d = /* @__PURE__ */ new Map(), u = n.logarithmicDepthBuffer;
  let h = n.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distance",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function m(C) {
    return l.add(C), C === 0 ? "uv" : `uv${C}`;
  }
  function A(C, w, T, M, Z, U) {
    const H = M.fog, F = Z.geometry, L = C.isMeshStandardMaterial || C.isMeshLambertMaterial || C.isMeshPhongMaterial ? M.environment : null, P = C.isMeshStandardMaterial || C.isMeshLambertMaterial && !C.envMap || C.isMeshPhongMaterial && !C.envMap, j = e.get(C.envMap || L, P), $ = j && j.mapping === Ya ? j.image.height : null, ce = g[C.type];
    C.precision !== null && (h = n.getMaxPrecision(C.precision), h !== C.precision && Ae("WebGLProgram.getParameters:", C.precision, "not supported, using", h, "instead."));
    const Ce = F.morphAttributes.position || F.morphAttributes.normal || F.morphAttributes.color, xe = Ce !== void 0 ? Ce.length : 0;
    let Je = 0;
    F.morphAttributes.position !== void 0 && (Je = 1), F.morphAttributes.normal !== void 0 && (Je = 2), F.morphAttributes.color !== void 0 && (Je = 3);
    let et, We, K, ue;
    if (ce) {
      const Ee = _n[ce];
      et = Ee.vertexShader, We = Ee.fragmentShader;
    } else
      et = C.vertexShader, We = C.fragmentShader, o.update(C), K = o.getVertexShaderID(C), ue = o.getFragmentShaderID(C);
    const ie = i.getRenderTarget(), Re = i.state.buffers.depth.getReversed(), Be = Z.isInstancedMesh === !0, Ge = Z.isBatchedMesh === !0, ut = !!C.map, Ye = !!C.matcap, tt = !!j, ct = !!C.aoMap, He = !!C.lightMap, xt = !!C.bumpMap, gt = !!C.normalMap, Kt = !!C.displacementMap, E = !!C.emissiveMap, _t = !!C.metalnessMap, ze = !!C.roughnessMap, ot = C.anisotropy > 0, oe = C.clearcoat > 0, ft = C.dispersion > 0, _ = C.iridescence > 0, I = C.sheen > 0, V = C.transmission > 0, O = ot && !!C.anisotropyMap, q = oe && !!C.clearcoatMap, ee = oe && !!C.clearcoatNormalMap, re = oe && !!C.clearcoatRoughnessMap, Y = _ && !!C.iridescenceMap, J = _ && !!C.iridescenceThicknessMap, ge = I && !!C.sheenColorMap, me = I && !!C.sheenRoughnessMap, se = !!C.specularMap, te = !!C.specularColorMap, Ze = !!C.specularIntensityMap, Ve = V && !!C.transmissionMap, je = V && !!C.thicknessMap, B = !!C.gradientMap, ne = !!C.alphaMap, z = C.alphaTest > 0, pe = !!C.alphaHash, ae = !!C.extensions;
    let Q = Tn;
    C.toneMapped && (ie === null || ie.isXRRenderTarget === !0) && (Q = i.toneMapping);
    const ye = {
      shaderID: ce,
      shaderType: C.type,
      shaderName: C.name,
      vertexShader: et,
      fragmentShader: We,
      defines: C.defines,
      customVertexShaderID: K,
      customFragmentShaderID: ue,
      isRawShaderMaterial: C.isRawShaderMaterial === !0,
      glslVersion: C.glslVersion,
      precision: h,
      batching: Ge,
      batchingColor: Ge && Z._colorsTexture !== null,
      instancing: Be,
      instancingColor: Be && Z.instanceColor !== null,
      instancingMorph: Be && Z.morphTexture !== null,
      outputColorSpace: ie === null ? i.outputColorSpace : ie.isXRRenderTarget === !0 ? ie.texture.colorSpace : Pe.workingColorSpace,
      alphaToCoverage: !!C.alphaToCoverage,
      map: ut,
      matcap: Ye,
      envMap: tt,
      envMapMode: tt && j.mapping,
      envMapCubeUVHeight: $,
      aoMap: ct,
      lightMap: He,
      bumpMap: xt,
      normalMap: gt,
      displacementMap: Kt,
      emissiveMap: E,
      normalMapObjectSpace: gt && C.normalMapType === Su,
      normalMapTangentSpace: gt && C.normalMapType === Lo,
      packedNormalMap: gt && C.normalMapType === Lo && V0(C.normalMap.format),
      metalnessMap: _t,
      roughnessMap: ze,
      anisotropy: ot,
      anisotropyMap: O,
      clearcoat: oe,
      clearcoatMap: q,
      clearcoatNormalMap: ee,
      clearcoatRoughnessMap: re,
      dispersion: ft,
      iridescence: _,
      iridescenceMap: Y,
      iridescenceThicknessMap: J,
      sheen: I,
      sheenColorMap: ge,
      sheenRoughnessMap: me,
      specularMap: se,
      specularColorMap: te,
      specularIntensityMap: Ze,
      transmission: V,
      transmissionMap: Ve,
      thicknessMap: je,
      gradientMap: B,
      opaque: C.transparent === !1 && C.blending === Ki && C.alphaToCoverage === !1,
      alphaMap: ne,
      alphaTest: z,
      alphaHash: pe,
      combine: C.combine,
      //
      mapUv: ut && m(C.map.channel),
      aoMapUv: ct && m(C.aoMap.channel),
      lightMapUv: He && m(C.lightMap.channel),
      bumpMapUv: xt && m(C.bumpMap.channel),
      normalMapUv: gt && m(C.normalMap.channel),
      displacementMapUv: Kt && m(C.displacementMap.channel),
      emissiveMapUv: E && m(C.emissiveMap.channel),
      metalnessMapUv: _t && m(C.metalnessMap.channel),
      roughnessMapUv: ze && m(C.roughnessMap.channel),
      anisotropyMapUv: O && m(C.anisotropyMap.channel),
      clearcoatMapUv: q && m(C.clearcoatMap.channel),
      clearcoatNormalMapUv: ee && m(C.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: re && m(C.clearcoatRoughnessMap.channel),
      iridescenceMapUv: Y && m(C.iridescenceMap.channel),
      iridescenceThicknessMapUv: J && m(C.iridescenceThicknessMap.channel),
      sheenColorMapUv: ge && m(C.sheenColorMap.channel),
      sheenRoughnessMapUv: me && m(C.sheenRoughnessMap.channel),
      specularMapUv: se && m(C.specularMap.channel),
      specularColorMapUv: te && m(C.specularColorMap.channel),
      specularIntensityMapUv: Ze && m(C.specularIntensityMap.channel),
      transmissionMapUv: Ve && m(C.transmissionMap.channel),
      thicknessMapUv: je && m(C.thicknessMap.channel),
      alphaMapUv: ne && m(C.alphaMap.channel),
      //
      vertexTangents: !!F.attributes.tangent && (gt || ot),
      vertexNormals: !!F.attributes.normal,
      vertexColors: C.vertexColors,
      vertexAlphas: C.vertexColors === !0 && !!F.attributes.color && F.attributes.color.itemSize === 4,
      pointsUvs: Z.isPoints === !0 && !!F.attributes.uv && (ut || ne),
      fog: !!H,
      useFog: C.fog === !0,
      fogExp2: !!H && H.isFogExp2,
      flatShading: C.wireframe === !1 && (C.flatShading === !0 || F.attributes.normal === void 0 && gt === !1 && (C.isMeshLambertMaterial || C.isMeshPhongMaterial || C.isMeshStandardMaterial || C.isMeshPhysicalMaterial)),
      sizeAttenuation: C.sizeAttenuation === !0,
      logarithmicDepthBuffer: u,
      reversedDepthBuffer: Re,
      skinning: Z.isSkinnedMesh === !0,
      morphTargets: F.morphAttributes.position !== void 0,
      morphNormals: F.morphAttributes.normal !== void 0,
      morphColors: F.morphAttributes.color !== void 0,
      morphTargetsCount: xe,
      morphTextureStride: Je,
      numDirLights: w.directional.length,
      numPointLights: w.point.length,
      numSpotLights: w.spot.length,
      numSpotLightMaps: w.spotLightMap.length,
      numRectAreaLights: w.rectArea.length,
      numHemiLights: w.hemi.length,
      numDirLightShadows: w.directionalShadowMap.length,
      numPointLightShadows: w.pointShadowMap.length,
      numSpotLightShadows: w.spotShadowMap.length,
      numSpotLightShadowsWithMaps: w.numSpotLightShadowsWithMaps,
      numLightProbes: w.numLightProbes,
      numLightProbeGrids: U.length,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: C.dithering,
      shadowMapEnabled: i.shadowMap.enabled && T.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: Q,
      decodeVideoTexture: ut && C.map.isVideoTexture === !0 && Pe.getTransfer(C.map.colorSpace) === Qe,
      decodeVideoTextureEmissive: E && C.emissiveMap.isVideoTexture === !0 && Pe.getTransfer(C.emissiveMap.colorSpace) === Qe,
      premultipliedAlpha: C.premultipliedAlpha,
      doubleSided: C.side === Rn,
      flipSided: C.side === Jt,
      useDepthPacking: C.depthPacking >= 0,
      depthPacking: C.depthPacking || 0,
      index0AttributeName: C.index0AttributeName,
      extensionClipCullDistance: ae && C.extensions.clipCullDistance === !0 && t.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (ae && C.extensions.multiDraw === !0 || Ge) && t.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: t.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: C.customProgramCacheKey()
    };
    return ye.vertexUv1s = l.has(1), ye.vertexUv2s = l.has(2), ye.vertexUv3s = l.has(3), l.clear(), ye;
  }
  function f(C) {
    const w = [];
    if (C.shaderID ? w.push(C.shaderID) : (w.push(C.customVertexShaderID), w.push(C.customFragmentShaderID)), C.defines !== void 0)
      for (const T in C.defines)
        w.push(T), w.push(C.defines[T]);
    return C.isRawShaderMaterial === !1 && (p(w, C), b(w, C), w.push(i.outputColorSpace)), w.push(C.customProgramCacheKey), w.join();
  }
  function p(C, w) {
    C.push(w.precision), C.push(w.outputColorSpace), C.push(w.envMapMode), C.push(w.envMapCubeUVHeight), C.push(w.mapUv), C.push(w.alphaMapUv), C.push(w.lightMapUv), C.push(w.aoMapUv), C.push(w.bumpMapUv), C.push(w.normalMapUv), C.push(w.displacementMapUv), C.push(w.emissiveMapUv), C.push(w.metalnessMapUv), C.push(w.roughnessMapUv), C.push(w.anisotropyMapUv), C.push(w.clearcoatMapUv), C.push(w.clearcoatNormalMapUv), C.push(w.clearcoatRoughnessMapUv), C.push(w.iridescenceMapUv), C.push(w.iridescenceThicknessMapUv), C.push(w.sheenColorMapUv), C.push(w.sheenRoughnessMapUv), C.push(w.specularMapUv), C.push(w.specularColorMapUv), C.push(w.specularIntensityMapUv), C.push(w.transmissionMapUv), C.push(w.thicknessMapUv), C.push(w.combine), C.push(w.fogExp2), C.push(w.sizeAttenuation), C.push(w.morphTargetsCount), C.push(w.morphAttributeCount), C.push(w.numDirLights), C.push(w.numPointLights), C.push(w.numSpotLights), C.push(w.numSpotLightMaps), C.push(w.numHemiLights), C.push(w.numRectAreaLights), C.push(w.numDirLightShadows), C.push(w.numPointLightShadows), C.push(w.numSpotLightShadows), C.push(w.numSpotLightShadowsWithMaps), C.push(w.numLightProbes), C.push(w.shadowMapType), C.push(w.toneMapping), C.push(w.numClippingPlanes), C.push(w.numClipIntersection), C.push(w.depthPacking);
  }
  function b(C, w) {
    r.disableAll(), w.instancing && r.enable(0), w.instancingColor && r.enable(1), w.instancingMorph && r.enable(2), w.matcap && r.enable(3), w.envMap && r.enable(4), w.normalMapObjectSpace && r.enable(5), w.normalMapTangentSpace && r.enable(6), w.clearcoat && r.enable(7), w.iridescence && r.enable(8), w.alphaTest && r.enable(9), w.vertexColors && r.enable(10), w.vertexAlphas && r.enable(11), w.vertexUv1s && r.enable(12), w.vertexUv2s && r.enable(13), w.vertexUv3s && r.enable(14), w.vertexTangents && r.enable(15), w.anisotropy && r.enable(16), w.alphaHash && r.enable(17), w.batching && r.enable(18), w.dispersion && r.enable(19), w.batchingColor && r.enable(20), w.gradientMap && r.enable(21), w.packedNormalMap && r.enable(22), w.vertexNormals && r.enable(23), C.push(r.mask), r.disableAll(), w.fog && r.enable(0), w.useFog && r.enable(1), w.flatShading && r.enable(2), w.logarithmicDepthBuffer && r.enable(3), w.reversedDepthBuffer && r.enable(4), w.skinning && r.enable(5), w.morphTargets && r.enable(6), w.morphNormals && r.enable(7), w.morphColors && r.enable(8), w.premultipliedAlpha && r.enable(9), w.shadowMapEnabled && r.enable(10), w.doubleSided && r.enable(11), w.flipSided && r.enable(12), w.useDepthPacking && r.enable(13), w.dithering && r.enable(14), w.transmission && r.enable(15), w.sheen && r.enable(16), w.opaque && r.enable(17), w.pointsUvs && r.enable(18), w.decodeVideoTexture && r.enable(19), w.decodeVideoTextureEmissive && r.enable(20), w.alphaToCoverage && r.enable(21), w.numLightProbeGrids > 0 && r.enable(22), C.push(r.mask);
  }
  function v(C) {
    const w = g[C.type];
    let T;
    if (w) {
      const M = _n[w];
      T = Tg.clone(M.uniforms);
    } else
      T = C.uniforms;
    return T;
  }
  function S(C, w) {
    let T = d.get(w);
    return T !== void 0 ? ++T.usedTimes : (T = new N0(i, w, C, s), c.push(T), d.set(w, T)), T;
  }
  function R(C) {
    if (--C.usedTimes === 0) {
      const w = c.indexOf(C);
      c[w] = c[c.length - 1], c.pop(), d.delete(C.cacheKey), C.destroy();
    }
  }
  function x(C) {
    o.remove(C);
  }
  function G() {
    o.dispose();
  }
  return {
    getParameters: A,
    getProgramCacheKey: f,
    getUniforms: v,
    acquireProgram: S,
    releaseProgram: R,
    releaseShaderCache: x,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: c,
    dispose: G
  };
}
function U0() {
  let i = /* @__PURE__ */ new WeakMap();
  function e(r) {
    return i.has(r);
  }
  function t(r) {
    let o = i.get(r);
    return o === void 0 && (o = {}, i.set(r, o)), o;
  }
  function n(r) {
    i.delete(r);
  }
  function s(r, o, l) {
    i.get(r)[o] = l;
  }
  function a() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: e,
    get: t,
    remove: n,
    update: s,
    dispose: a
  };
}
function D0(i, e) {
  return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.material.id !== e.material.id ? i.material.id - e.material.id : i.materialVariant !== e.materialVariant ? i.materialVariant - e.materialVariant : i.z !== e.z ? i.z - e.z : i.id - e.id;
}
function $c(i, e) {
  return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.z !== e.z ? e.z - i.z : i.id - e.id;
}
function ed() {
  const i = [];
  let e = 0;
  const t = [], n = [], s = [];
  function a() {
    e = 0, t.length = 0, n.length = 0, s.length = 0;
  }
  function r(h) {
    let g = 0;
    return h.isInstancedMesh && (g += 2), h.isSkinnedMesh && (g += 1), g;
  }
  function o(h, g, m, A, f, p) {
    let b = i[e];
    return b === void 0 ? (b = {
      id: h.id,
      object: h,
      geometry: g,
      material: m,
      materialVariant: r(h),
      groupOrder: A,
      renderOrder: h.renderOrder,
      z: f,
      group: p
    }, i[e] = b) : (b.id = h.id, b.object = h, b.geometry = g, b.material = m, b.materialVariant = r(h), b.groupOrder = A, b.renderOrder = h.renderOrder, b.z = f, b.group = p), e++, b;
  }
  function l(h, g, m, A, f, p) {
    const b = o(h, g, m, A, f, p);
    m.transmission > 0 ? n.push(b) : m.transparent === !0 ? s.push(b) : t.push(b);
  }
  function c(h, g, m, A, f, p) {
    const b = o(h, g, m, A, f, p);
    m.transmission > 0 ? n.unshift(b) : m.transparent === !0 ? s.unshift(b) : t.unshift(b);
  }
  function d(h, g) {
    t.length > 1 && t.sort(h || D0), n.length > 1 && n.sort(g || $c), s.length > 1 && s.sort(g || $c);
  }
  function u() {
    for (let h = e, g = i.length; h < g; h++) {
      const m = i[h];
      if (m.id === null) break;
      m.id = null, m.object = null, m.geometry = null, m.material = null, m.group = null;
    }
  }
  return {
    opaque: t,
    transmissive: n,
    transparent: s,
    init: a,
    push: l,
    unshift: c,
    finish: u,
    sort: d
  };
}
function X0() {
  let i = /* @__PURE__ */ new WeakMap();
  function e(n, s) {
    const a = i.get(n);
    let r;
    return a === void 0 ? (r = new ed(), i.set(n, [r])) : s >= a.length ? (r = new ed(), a.push(r)) : r = a[s], r;
  }
  function t() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: t
  };
}
function H0() {
  const i = {};
  return {
    get: function(e) {
      if (i[e.id] !== void 0)
        return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            direction: new N(),
            color: new Me()
          };
          break;
        case "SpotLight":
          t = {
            position: new N(),
            direction: new N(),
            color: new Me(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          t = {
            position: new N(),
            color: new Me(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          t = {
            direction: new N(),
            skyColor: new Me(),
            groundColor: new Me()
          };
          break;
        case "RectAreaLight":
          t = {
            color: new Me(),
            position: new N(),
            halfWidth: new N(),
            halfHeight: new N()
          };
          break;
      }
      return i[e.id] = t, t;
    }
  };
}
function P0() {
  const i = {};
  return {
    get: function(e) {
      if (i[e.id] !== void 0)
        return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Te()
          };
          break;
        case "SpotLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Te()
          };
          break;
        case "PointLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Te(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[e.id] = t, t;
    }
  };
}
let k0 = 0;
function Y0(i, e) {
  return (e.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (i.map ? 1 : 0);
}
function z0(i) {
  const e = new H0(), t = P0(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let c = 0; c < 9; c++) n.probe.push(new N());
  const s = new N(), a = new Ue(), r = new Ue();
  function o(c) {
    let d = 0, u = 0, h = 0;
    for (let w = 0; w < 9; w++) n.probe[w].set(0, 0, 0);
    let g = 0, m = 0, A = 0, f = 0, p = 0, b = 0, v = 0, S = 0, R = 0, x = 0, G = 0;
    c.sort(Y0);
    for (let w = 0, T = c.length; w < T; w++) {
      const M = c[w], Z = M.color, U = M.intensity, H = M.distance;
      let F = null;
      if (M.shadow && M.shadow.map && (M.shadow.map.texture.format === xi ? F = M.shadow.map.texture : F = M.shadow.map.depthTexture || M.shadow.map.texture), M.isAmbientLight)
        d += Z.r * U, u += Z.g * U, h += Z.b * U;
      else if (M.isLightProbe) {
        for (let L = 0; L < 9; L++)
          n.probe[L].addScaledVector(M.sh.coefficients[L], U);
        G++;
      } else if (M.isDirectionalLight) {
        const L = e.get(M);
        if (L.color.copy(M.color).multiplyScalar(M.intensity), M.castShadow) {
          const P = M.shadow, j = t.get(M);
          j.shadowIntensity = P.intensity, j.shadowBias = P.bias, j.shadowNormalBias = P.normalBias, j.shadowRadius = P.radius, j.shadowMapSize = P.mapSize, n.directionalShadow[g] = j, n.directionalShadowMap[g] = F, n.directionalShadowMatrix[g] = M.shadow.matrix, b++;
        }
        n.directional[g] = L, g++;
      } else if (M.isSpotLight) {
        const L = e.get(M);
        L.position.setFromMatrixPosition(M.matrixWorld), L.color.copy(Z).multiplyScalar(U), L.distance = H, L.coneCos = Math.cos(M.angle), L.penumbraCos = Math.cos(M.angle * (1 - M.penumbra)), L.decay = M.decay, n.spot[A] = L;
        const P = M.shadow;
        if (M.map && (n.spotLightMap[R] = M.map, R++, P.updateMatrices(M), M.castShadow && x++), n.spotLightMatrix[A] = P.matrix, M.castShadow) {
          const j = t.get(M);
          j.shadowIntensity = P.intensity, j.shadowBias = P.bias, j.shadowNormalBias = P.normalBias, j.shadowRadius = P.radius, j.shadowMapSize = P.mapSize, n.spotShadow[A] = j, n.spotShadowMap[A] = F, S++;
        }
        A++;
      } else if (M.isRectAreaLight) {
        const L = e.get(M);
        L.color.copy(Z).multiplyScalar(U), L.halfWidth.set(M.width * 0.5, 0, 0), L.halfHeight.set(0, M.height * 0.5, 0), n.rectArea[f] = L, f++;
      } else if (M.isPointLight) {
        const L = e.get(M);
        if (L.color.copy(M.color).multiplyScalar(M.intensity), L.distance = M.distance, L.decay = M.decay, M.castShadow) {
          const P = M.shadow, j = t.get(M);
          j.shadowIntensity = P.intensity, j.shadowBias = P.bias, j.shadowNormalBias = P.normalBias, j.shadowRadius = P.radius, j.shadowMapSize = P.mapSize, j.shadowCameraNear = P.camera.near, j.shadowCameraFar = P.camera.far, n.pointShadow[m] = j, n.pointShadowMap[m] = F, n.pointShadowMatrix[m] = M.shadow.matrix, v++;
        }
        n.point[m] = L, m++;
      } else if (M.isHemisphereLight) {
        const L = e.get(M);
        L.skyColor.copy(M.color).multiplyScalar(U), L.groundColor.copy(M.groundColor).multiplyScalar(U), n.hemi[p] = L, p++;
      }
    }
    f > 0 && (i.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = le.LTC_FLOAT_1, n.rectAreaLTC2 = le.LTC_FLOAT_2) : (n.rectAreaLTC1 = le.LTC_HALF_1, n.rectAreaLTC2 = le.LTC_HALF_2)), n.ambient[0] = d, n.ambient[1] = u, n.ambient[2] = h;
    const C = n.hash;
    (C.directionalLength !== g || C.pointLength !== m || C.spotLength !== A || C.rectAreaLength !== f || C.hemiLength !== p || C.numDirectionalShadows !== b || C.numPointShadows !== v || C.numSpotShadows !== S || C.numSpotMaps !== R || C.numLightProbes !== G) && (n.directional.length = g, n.spot.length = A, n.rectArea.length = f, n.point.length = m, n.hemi.length = p, n.directionalShadow.length = b, n.directionalShadowMap.length = b, n.pointShadow.length = v, n.pointShadowMap.length = v, n.spotShadow.length = S, n.spotShadowMap.length = S, n.directionalShadowMatrix.length = b, n.pointShadowMatrix.length = v, n.spotLightMatrix.length = S + R - x, n.spotLightMap.length = R, n.numSpotLightShadowsWithMaps = x, n.numLightProbes = G, C.directionalLength = g, C.pointLength = m, C.spotLength = A, C.rectAreaLength = f, C.hemiLength = p, C.numDirectionalShadows = b, C.numPointShadows = v, C.numSpotShadows = S, C.numSpotMaps = R, C.numLightProbes = G, n.version = k0++);
  }
  function l(c, d) {
    let u = 0, h = 0, g = 0, m = 0, A = 0;
    const f = d.matrixWorldInverse;
    for (let p = 0, b = c.length; p < b; p++) {
      const v = c[p];
      if (v.isDirectionalLight) {
        const S = n.directional[u];
        S.direction.setFromMatrixPosition(v.matrixWorld), s.setFromMatrixPosition(v.target.matrixWorld), S.direction.sub(s), S.direction.transformDirection(f), u++;
      } else if (v.isSpotLight) {
        const S = n.spot[g];
        S.position.setFromMatrixPosition(v.matrixWorld), S.position.applyMatrix4(f), S.direction.setFromMatrixPosition(v.matrixWorld), s.setFromMatrixPosition(v.target.matrixWorld), S.direction.sub(s), S.direction.transformDirection(f), g++;
      } else if (v.isRectAreaLight) {
        const S = n.rectArea[m];
        S.position.setFromMatrixPosition(v.matrixWorld), S.position.applyMatrix4(f), r.identity(), a.copy(v.matrixWorld), a.premultiply(f), r.extractRotation(a), S.halfWidth.set(v.width * 0.5, 0, 0), S.halfHeight.set(0, v.height * 0.5, 0), S.halfWidth.applyMatrix4(r), S.halfHeight.applyMatrix4(r), m++;
      } else if (v.isPointLight) {
        const S = n.point[h];
        S.position.setFromMatrixPosition(v.matrixWorld), S.position.applyMatrix4(f), h++;
      } else if (v.isHemisphereLight) {
        const S = n.hemi[A];
        S.direction.setFromMatrixPosition(v.matrixWorld), S.direction.transformDirection(f), A++;
      }
    }
  }
  return {
    setup: o,
    setupView: l,
    state: n
  };
}
function td(i) {
  const e = new z0(i), t = [], n = [], s = [];
  function a(h) {
    u.camera = h, t.length = 0, n.length = 0, s.length = 0;
  }
  function r(h) {
    t.push(h);
  }
  function o(h) {
    n.push(h);
  }
  function l(h) {
    s.push(h);
  }
  function c() {
    e.setup(t);
  }
  function d(h) {
    e.setupView(t, h);
  }
  const u = {
    lightsArray: t,
    shadowsArray: n,
    lightProbeGridArray: s,
    camera: null,
    lights: e,
    transmissionRenderTarget: {},
    textureUnits: 0
  };
  return {
    init: a,
    state: u,
    setupLights: c,
    setupLightsView: d,
    pushLight: r,
    pushShadow: o,
    pushLightProbeGrid: l
  };
}
function O0(i) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(s, a = 0) {
    const r = e.get(s);
    let o;
    return r === void 0 ? (o = new td(i), e.set(s, [o])) : a >= r.length ? (o = new td(i), r.push(o)) : o = r[a], o;
  }
  function n() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: n
  };
}
const J0 = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, K0 = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`, j0 = [
  /* @__PURE__ */ new N(1, 0, 0),
  /* @__PURE__ */ new N(-1, 0, 0),
  /* @__PURE__ */ new N(0, 1, 0),
  /* @__PURE__ */ new N(0, -1, 0),
  /* @__PURE__ */ new N(0, 0, 1),
  /* @__PURE__ */ new N(0, 0, -1)
], Q0 = [
  /* @__PURE__ */ new N(0, -1, 0),
  /* @__PURE__ */ new N(0, -1, 0),
  /* @__PURE__ */ new N(0, 0, 1),
  /* @__PURE__ */ new N(0, 0, -1),
  /* @__PURE__ */ new N(0, -1, 0),
  /* @__PURE__ */ new N(0, -1, 0)
], nd = /* @__PURE__ */ new Ue(), _s = /* @__PURE__ */ new N(), Xr = /* @__PURE__ */ new N();
function q0(i, e, t) {
  let n = new cl();
  const s = new Te(), a = new Te(), r = new rt(), o = new Eg(), l = new Fg(), c = {}, d = t.maxTextureSize, u = { [zn]: Jt, [Jt]: zn, [Rn]: Rn }, h = new Nn({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new Te() },
      radius: { value: 4 }
    },
    vertexShader: J0,
    fragmentShader: K0
  }), g = h.clone();
  g.defines.HORIZONTAL_PASS = 1;
  const m = new yt();
  m.setAttribute(
    "position",
    new zt(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const A = new ve(m, h), f = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = wa;
  let p = this.type;
  this.render = function(x, G, C) {
    if (f.enabled === !1 || f.autoUpdate === !1 && f.needsUpdate === !1 || x.length === 0) return;
    this.type === xd && (Ae("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."), this.type = wa);
    const w = i.getRenderTarget(), T = i.getActiveCubeFace(), M = i.getActiveMipmapLevel(), Z = i.state;
    Z.setBlending(kn), Z.buffers.depth.getReversed() === !0 ? Z.buffers.color.setClear(0, 0, 0, 0) : Z.buffers.color.setClear(1, 1, 1, 1), Z.buffers.depth.setTest(!0), Z.setScissorTest(!1);
    const U = p !== this.type;
    U && G.traverse(function(H) {
      H.material && (Array.isArray(H.material) ? H.material.forEach((F) => F.needsUpdate = !0) : H.material.needsUpdate = !0);
    });
    for (let H = 0, F = x.length; H < F; H++) {
      const L = x[H], P = L.shadow;
      if (P === void 0) {
        Ae("WebGLShadowMap:", L, "has no shadow.");
        continue;
      }
      if (P.autoUpdate === !1 && P.needsUpdate === !1) continue;
      s.copy(P.mapSize);
      const j = P.getFrameExtents();
      s.multiply(j), a.copy(P.mapSize), (s.x > d || s.y > d) && (s.x > d && (a.x = Math.floor(d / j.x), s.x = a.x * j.x, P.mapSize.x = a.x), s.y > d && (a.y = Math.floor(d / j.y), s.y = a.y * j.y, P.mapSize.y = a.y));
      const $ = i.state.buffers.depth.getReversed();
      if (P.camera._reversedDepth = $, P.map === null || U === !0) {
        if (P.map !== null && (P.map.depthTexture !== null && (P.map.depthTexture.dispose(), P.map.depthTexture = null), P.map.dispose()), this.type === Rs) {
          if (L.isPointLight) {
            Ae("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
            continue;
          }
          P.map = new Zn(s.x, s.y, {
            format: xi,
            type: On,
            minFilter: Mt,
            magFilter: Mt,
            generateMipmaps: !1
          }), P.map.texture.name = L.name + ".shadowMap", P.map.depthTexture = new ns(s.x, s.y, cn), P.map.depthTexture.name = L.name + ".shadowMapDepth", P.map.depthTexture.format = Jn, P.map.depthTexture.compareFunction = null, P.map.depthTexture.minFilter = Rt, P.map.depthTexture.magFilter = Rt;
        } else
          L.isPointLight ? (P.map = new dh(s.x), P.map.depthTexture = new Mg(s.x, Bn)) : (P.map = new Zn(s.x, s.y), P.map.depthTexture = new ns(s.x, s.y, Bn)), P.map.depthTexture.name = L.name + ".shadowMap", P.map.depthTexture.format = Jn, this.type === wa ? (P.map.depthTexture.compareFunction = $ ? il : nl, P.map.depthTexture.minFilter = Mt, P.map.depthTexture.magFilter = Mt) : (P.map.depthTexture.compareFunction = null, P.map.depthTexture.minFilter = Rt, P.map.depthTexture.magFilter = Rt);
        P.camera.updateProjectionMatrix();
      }
      const ce = P.map.isWebGLCubeRenderTarget ? 6 : 1;
      for (let Ce = 0; Ce < ce; Ce++) {
        if (P.map.isWebGLCubeRenderTarget)
          i.setRenderTarget(P.map, Ce), i.clear();
        else {
          Ce === 0 && (i.setRenderTarget(P.map), i.clear());
          const xe = P.getViewport(Ce);
          r.set(
            a.x * xe.x,
            a.y * xe.y,
            a.x * xe.z,
            a.y * xe.w
          ), Z.viewport(r);
        }
        if (L.isPointLight) {
          const xe = P.camera, Je = P.matrix, et = L.distance || xe.far;
          et !== xe.far && (xe.far = et, xe.updateProjectionMatrix()), _s.setFromMatrixPosition(L.matrixWorld), xe.position.copy(_s), Xr.copy(xe.position), Xr.add(j0[Ce]), xe.up.copy(Q0[Ce]), xe.lookAt(Xr), xe.updateMatrixWorld(), Je.makeTranslation(-_s.x, -_s.y, -_s.z), nd.multiplyMatrices(xe.projectionMatrix, xe.matrixWorldInverse), P._frustum.setFromProjectionMatrix(nd, xe.coordinateSystem, xe.reversedDepth);
        } else
          P.updateMatrices(L);
        n = P.getFrustum(), S(G, C, P.camera, L, this.type);
      }
      P.isPointLightShadow !== !0 && this.type === Rs && b(P, C), P.needsUpdate = !1;
    }
    p = this.type, f.needsUpdate = !1, i.setRenderTarget(w, T, M);
  };
  function b(x, G) {
    const C = e.update(A);
    h.defines.VSM_SAMPLES !== x.blurSamples && (h.defines.VSM_SAMPLES = x.blurSamples, g.defines.VSM_SAMPLES = x.blurSamples, h.needsUpdate = !0, g.needsUpdate = !0), x.mapPass === null && (x.mapPass = new Zn(s.x, s.y, {
      format: xi,
      type: On
    })), h.uniforms.shadow_pass.value = x.map.depthTexture, h.uniforms.resolution.value = x.mapSize, h.uniforms.radius.value = x.radius, i.setRenderTarget(x.mapPass), i.clear(), i.renderBufferDirect(G, null, C, h, A, null), g.uniforms.shadow_pass.value = x.mapPass.texture, g.uniforms.resolution.value = x.mapSize, g.uniforms.radius.value = x.radius, i.setRenderTarget(x.map), i.clear(), i.renderBufferDirect(G, null, C, g, A, null);
  }
  function v(x, G, C, w) {
    let T = null;
    const M = C.isPointLight === !0 ? x.customDistanceMaterial : x.customDepthMaterial;
    if (M !== void 0)
      T = M;
    else if (T = C.isPointLight === !0 ? l : o, i.localClippingEnabled && G.clipShadows === !0 && Array.isArray(G.clippingPlanes) && G.clippingPlanes.length !== 0 || G.displacementMap && G.displacementScale !== 0 || G.alphaMap && G.alphaTest > 0 || G.map && G.alphaTest > 0 || G.alphaToCoverage === !0) {
      const Z = T.uuid, U = G.uuid;
      let H = c[Z];
      H === void 0 && (H = {}, c[Z] = H);
      let F = H[U];
      F === void 0 && (F = T.clone(), H[U] = F, G.addEventListener("dispose", R)), T = F;
    }
    if (T.visible = G.visible, T.wireframe = G.wireframe, w === Rs ? T.side = G.shadowSide !== null ? G.shadowSide : G.side : T.side = G.shadowSide !== null ? G.shadowSide : u[G.side], T.alphaMap = G.alphaMap, T.alphaTest = G.alphaToCoverage === !0 ? 0.5 : G.alphaTest, T.map = G.map, T.clipShadows = G.clipShadows, T.clippingPlanes = G.clippingPlanes, T.clipIntersection = G.clipIntersection, T.displacementMap = G.displacementMap, T.displacementScale = G.displacementScale, T.displacementBias = G.displacementBias, T.wireframeLinewidth = G.wireframeLinewidth, T.linewidth = G.linewidth, C.isPointLight === !0 && T.isMeshDistanceMaterial === !0) {
      const Z = i.properties.get(T);
      Z.light = C;
    }
    return T;
  }
  function S(x, G, C, w, T) {
    if (x.visible === !1) return;
    if (x.layers.test(G.layers) && (x.isMesh || x.isLine || x.isPoints) && (x.castShadow || x.receiveShadow && T === Rs) && (!x.frustumCulled || n.intersectsObject(x))) {
      x.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse, x.matrixWorld);
      const U = e.update(x), H = x.material;
      if (Array.isArray(H)) {
        const F = U.groups;
        for (let L = 0, P = F.length; L < P; L++) {
          const j = F[L], $ = H[j.materialIndex];
          if ($ && $.visible) {
            const ce = v(x, $, w, T);
            x.onBeforeShadow(i, x, G, C, U, ce, j), i.renderBufferDirect(C, null, U, ce, x, j), x.onAfterShadow(i, x, G, C, U, ce, j);
          }
        }
      } else if (H.visible) {
        const F = v(x, H, w, T);
        x.onBeforeShadow(i, x, G, C, U, F, null), i.renderBufferDirect(C, null, U, F, x, null), x.onAfterShadow(i, x, G, C, U, F, null);
      }
    }
    const Z = x.children;
    for (let U = 0, H = Z.length; U < H; U++)
      S(Z[U], G, C, w, T);
  }
  function R(x) {
    x.target.removeEventListener("dispose", R);
    for (const C in c) {
      const w = c[C], T = x.target.uuid;
      T in w && (w[T].dispose(), delete w[T]);
    }
  }
}
function $0(i, e) {
  function t() {
    let B = !1;
    const ne = new rt();
    let z = null;
    const pe = new rt(0, 0, 0, 0);
    return {
      setMask: function(ae) {
        z !== ae && !B && (i.colorMask(ae, ae, ae, ae), z = ae);
      },
      setLocked: function(ae) {
        B = ae;
      },
      setClear: function(ae, Q, ye, Ee, It) {
        It === !0 && (ae *= Ee, Q *= Ee, ye *= Ee), ne.set(ae, Q, ye, Ee), pe.equals(ne) === !1 && (i.clearColor(ae, Q, ye, Ee), pe.copy(ne));
      },
      reset: function() {
        B = !1, z = null, pe.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let B = !1, ne = !1, z = null, pe = null, ae = null;
    return {
      setReversed: function(Q) {
        if (ne !== Q) {
          const ye = e.get("EXT_clip_control");
          Q ? ye.clipControlEXT(ye.LOWER_LEFT_EXT, ye.ZERO_TO_ONE_EXT) : ye.clipControlEXT(ye.LOWER_LEFT_EXT, ye.NEGATIVE_ONE_TO_ONE_EXT), ne = Q;
          const Ee = ae;
          ae = null, this.setClear(Ee);
        }
      },
      getReversed: function() {
        return ne;
      },
      setTest: function(Q) {
        Q ? ie(i.DEPTH_TEST) : Re(i.DEPTH_TEST);
      },
      setMask: function(Q) {
        z !== Q && !B && (i.depthMask(Q), z = Q);
      },
      setFunc: function(Q) {
        if (ne && (Q = Nu[Q]), pe !== Q) {
          switch (Q) {
            case $r:
              i.depthFunc(i.NEVER);
              break;
            case eo:
              i.depthFunc(i.ALWAYS);
              break;
            case to:
              i.depthFunc(i.LESS);
              break;
            case qi:
              i.depthFunc(i.LEQUAL);
              break;
            case no:
              i.depthFunc(i.EQUAL);
              break;
            case io:
              i.depthFunc(i.GEQUAL);
              break;
            case so:
              i.depthFunc(i.GREATER);
              break;
            case ao:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          pe = Q;
        }
      },
      setLocked: function(Q) {
        B = Q;
      },
      setClear: function(Q) {
        ae !== Q && (ae = Q, ne && (Q = 1 - Q), i.clearDepth(Q));
      },
      reset: function() {
        B = !1, z = null, pe = null, ae = null, ne = !1;
      }
    };
  }
  function s() {
    let B = !1, ne = null, z = null, pe = null, ae = null, Q = null, ye = null, Ee = null, It = null;
    return {
      setTest: function(nt) {
        B || (nt ? ie(i.STENCIL_TEST) : Re(i.STENCIL_TEST));
      },
      setMask: function(nt) {
        ne !== nt && !B && (i.stencilMask(nt), ne = nt);
      },
      setFunc: function(nt, Fn, bn) {
        (z !== nt || pe !== Fn || ae !== bn) && (i.stencilFunc(nt, Fn, bn), z = nt, pe = Fn, ae = bn);
      },
      setOp: function(nt, Fn, bn) {
        (Q !== nt || ye !== Fn || Ee !== bn) && (i.stencilOp(nt, Fn, bn), Q = nt, ye = Fn, Ee = bn);
      },
      setLocked: function(nt) {
        B = nt;
      },
      setClear: function(nt) {
        It !== nt && (i.clearStencil(nt), It = nt);
      },
      reset: function() {
        B = !1, ne = null, z = null, pe = null, ae = null, Q = null, ye = null, Ee = null, It = null;
      }
    };
  }
  const a = new t(), r = new n(), o = new s(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
  let d = {}, u = {}, h = {}, g = /* @__PURE__ */ new WeakMap(), m = [], A = null, f = !1, p = null, b = null, v = null, S = null, R = null, x = null, G = null, C = new Me(0, 0, 0), w = 0, T = !1, M = null, Z = null, U = null, H = null, F = null;
  const L = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let P = !1, j = 0;
  const $ = i.getParameter(i.VERSION);
  $.indexOf("WebGL") !== -1 ? (j = parseFloat(/^WebGL (\d)/.exec($)[1]), P = j >= 1) : $.indexOf("OpenGL ES") !== -1 && (j = parseFloat(/^OpenGL ES (\d)/.exec($)[1]), P = j >= 2);
  let ce = null, Ce = {};
  const xe = i.getParameter(i.SCISSOR_BOX), Je = i.getParameter(i.VIEWPORT), et = new rt().fromArray(xe), We = new rt().fromArray(Je);
  function K(B, ne, z, pe) {
    const ae = new Uint8Array(4), Q = i.createTexture();
    i.bindTexture(B, Q), i.texParameteri(B, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(B, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let ye = 0; ye < z; ye++)
      B === i.TEXTURE_3D || B === i.TEXTURE_2D_ARRAY ? i.texImage3D(ne, 0, i.RGBA, 1, 1, pe, 0, i.RGBA, i.UNSIGNED_BYTE, ae) : i.texImage2D(ne + ye, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, ae);
    return Q;
  }
  const ue = {};
  ue[i.TEXTURE_2D] = K(i.TEXTURE_2D, i.TEXTURE_2D, 1), ue[i.TEXTURE_CUBE_MAP] = K(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), ue[i.TEXTURE_2D_ARRAY] = K(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), ue[i.TEXTURE_3D] = K(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), a.setClear(0, 0, 0, 1), r.setClear(1), o.setClear(0), ie(i.DEPTH_TEST), r.setFunc(qi), xt(!1), gt(Vl), ie(i.CULL_FACE), ct(kn);
  function ie(B) {
    d[B] !== !0 && (i.enable(B), d[B] = !0);
  }
  function Re(B) {
    d[B] !== !1 && (i.disable(B), d[B] = !1);
  }
  function Be(B, ne) {
    return h[B] !== ne ? (i.bindFramebuffer(B, ne), h[B] = ne, B === i.DRAW_FRAMEBUFFER && (h[i.FRAMEBUFFER] = ne), B === i.FRAMEBUFFER && (h[i.DRAW_FRAMEBUFFER] = ne), !0) : !1;
  }
  function Ge(B, ne) {
    let z = m, pe = !1;
    if (B) {
      z = g.get(ne), z === void 0 && (z = [], g.set(ne, z));
      const ae = B.textures;
      if (z.length !== ae.length || z[0] !== i.COLOR_ATTACHMENT0) {
        for (let Q = 0, ye = ae.length; Q < ye; Q++)
          z[Q] = i.COLOR_ATTACHMENT0 + Q;
        z.length = ae.length, pe = !0;
      }
    } else
      z[0] !== i.BACK && (z[0] = i.BACK, pe = !0);
    pe && i.drawBuffers(z);
  }
  function ut(B) {
    return A !== B ? (i.useProgram(B), A = B, !0) : !1;
  }
  const Ye = {
    [Ai]: i.FUNC_ADD,
    [$h]: i.FUNC_SUBTRACT,
    [eu]: i.FUNC_REVERSE_SUBTRACT
  };
  Ye[tu] = i.MIN, Ye[nu] = i.MAX;
  const tt = {
    [iu]: i.ZERO,
    [su]: i.ONE,
    [au]: i.SRC_COLOR,
    [Qr]: i.SRC_ALPHA,
    [hu]: i.SRC_ALPHA_SATURATE,
    [cu]: i.DST_COLOR,
    [ou]: i.DST_ALPHA,
    [ru]: i.ONE_MINUS_SRC_COLOR,
    [qr]: i.ONE_MINUS_SRC_ALPHA,
    [du]: i.ONE_MINUS_DST_COLOR,
    [lu]: i.ONE_MINUS_DST_ALPHA,
    [uu]: i.CONSTANT_COLOR,
    [gu]: i.ONE_MINUS_CONSTANT_COLOR,
    [pu]: i.CONSTANT_ALPHA,
    [fu]: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function ct(B, ne, z, pe, ae, Q, ye, Ee, It, nt) {
    if (B === kn) {
      f === !0 && (Re(i.BLEND), f = !1);
      return;
    }
    if (f === !1 && (ie(i.BLEND), f = !0), B !== qh) {
      if (B !== p || nt !== T) {
        if ((b !== Ai || R !== Ai) && (i.blendEquation(i.FUNC_ADD), b = Ai, R = Ai), nt)
          switch (B) {
            case Ki:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case Ll:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case Ul:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Dl:
              i.blendFuncSeparate(i.DST_COLOR, i.ONE_MINUS_SRC_ALPHA, i.ZERO, i.ONE);
              break;
            default:
              we("WebGLState: Invalid blending: ", B);
              break;
          }
        else
          switch (B) {
            case Ki:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case Ll:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE);
              break;
            case Ul:
              we("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
              break;
            case Dl:
              we("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
              break;
            default:
              we("WebGLState: Invalid blending: ", B);
              break;
          }
        v = null, S = null, x = null, G = null, C.set(0, 0, 0), w = 0, p = B, T = nt;
      }
      return;
    }
    ae = ae || ne, Q = Q || z, ye = ye || pe, (ne !== b || ae !== R) && (i.blendEquationSeparate(Ye[ne], Ye[ae]), b = ne, R = ae), (z !== v || pe !== S || Q !== x || ye !== G) && (i.blendFuncSeparate(tt[z], tt[pe], tt[Q], tt[ye]), v = z, S = pe, x = Q, G = ye), (Ee.equals(C) === !1 || It !== w) && (i.blendColor(Ee.r, Ee.g, Ee.b, It), C.copy(Ee), w = It), p = B, T = !1;
  }
  function He(B, ne) {
    B.side === Rn ? Re(i.CULL_FACE) : ie(i.CULL_FACE);
    let z = B.side === Jt;
    ne && (z = !z), xt(z), B.blending === Ki && B.transparent === !1 ? ct(kn) : ct(B.blending, B.blendEquation, B.blendSrc, B.blendDst, B.blendEquationAlpha, B.blendSrcAlpha, B.blendDstAlpha, B.blendColor, B.blendAlpha, B.premultipliedAlpha), r.setFunc(B.depthFunc), r.setTest(B.depthTest), r.setMask(B.depthWrite), a.setMask(B.colorWrite);
    const pe = B.stencilWrite;
    o.setTest(pe), pe && (o.setMask(B.stencilWriteMask), o.setFunc(B.stencilFunc, B.stencilRef, B.stencilFuncMask), o.setOp(B.stencilFail, B.stencilZFail, B.stencilZPass)), E(B.polygonOffset, B.polygonOffsetFactor, B.polygonOffsetUnits), B.alphaToCoverage === !0 ? ie(i.SAMPLE_ALPHA_TO_COVERAGE) : Re(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function xt(B) {
    M !== B && (B ? i.frontFace(i.CW) : i.frontFace(i.CCW), M = B);
  }
  function gt(B) {
    B !== jh ? (ie(i.CULL_FACE), B !== Z && (B === Vl ? i.cullFace(i.BACK) : B === Qh ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Re(i.CULL_FACE), Z = B;
  }
  function Kt(B) {
    B !== U && (P && i.lineWidth(B), U = B);
  }
  function E(B, ne, z) {
    B ? (ie(i.POLYGON_OFFSET_FILL), (H !== ne || F !== z) && (H = ne, F = z, r.getReversed() && (ne = -ne), i.polygonOffset(ne, z))) : Re(i.POLYGON_OFFSET_FILL);
  }
  function _t(B) {
    B ? ie(i.SCISSOR_TEST) : Re(i.SCISSOR_TEST);
  }
  function ze(B) {
    B === void 0 && (B = i.TEXTURE0 + L - 1), ce !== B && (i.activeTexture(B), ce = B);
  }
  function ot(B, ne, z) {
    z === void 0 && (ce === null ? z = i.TEXTURE0 + L - 1 : z = ce);
    let pe = Ce[z];
    pe === void 0 && (pe = { type: void 0, texture: void 0 }, Ce[z] = pe), (pe.type !== B || pe.texture !== ne) && (ce !== z && (i.activeTexture(z), ce = z), i.bindTexture(B, ne || ue[B]), pe.type = B, pe.texture = ne);
  }
  function oe() {
    const B = Ce[ce];
    B !== void 0 && B.type !== void 0 && (i.bindTexture(B.type, null), B.type = void 0, B.texture = void 0);
  }
  function ft() {
    try {
      i.compressedTexImage2D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function _() {
    try {
      i.compressedTexImage3D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function I() {
    try {
      i.texSubImage2D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function V() {
    try {
      i.texSubImage3D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function O() {
    try {
      i.compressedTexSubImage2D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function q() {
    try {
      i.compressedTexSubImage3D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function ee() {
    try {
      i.texStorage2D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function re() {
    try {
      i.texStorage3D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function Y() {
    try {
      i.texImage2D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function J() {
    try {
      i.texImage3D(...arguments);
    } catch (B) {
      we("WebGLState:", B);
    }
  }
  function ge(B) {
    return u[B] !== void 0 ? u[B] : i.getParameter(B);
  }
  function me(B, ne) {
    u[B] !== ne && (i.pixelStorei(B, ne), u[B] = ne);
  }
  function se(B) {
    et.equals(B) === !1 && (i.scissor(B.x, B.y, B.z, B.w), et.copy(B));
  }
  function te(B) {
    We.equals(B) === !1 && (i.viewport(B.x, B.y, B.z, B.w), We.copy(B));
  }
  function Ze(B, ne) {
    let z = c.get(ne);
    z === void 0 && (z = /* @__PURE__ */ new WeakMap(), c.set(ne, z));
    let pe = z.get(B);
    pe === void 0 && (pe = i.getUniformBlockIndex(ne, B.name), z.set(B, pe));
  }
  function Ve(B, ne) {
    const pe = c.get(ne).get(B);
    l.get(ne) !== pe && (i.uniformBlockBinding(ne, pe, B.__bindingPointIndex), l.set(ne, pe));
  }
  function je() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), r.setReversed(!1), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), i.pixelStorei(i.PACK_ALIGNMENT, 4), i.pixelStorei(i.UNPACK_ALIGNMENT, 4), i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, i.BROWSER_DEFAULT_WEBGL), i.pixelStorei(i.PACK_ROW_LENGTH, 0), i.pixelStorei(i.PACK_SKIP_PIXELS, 0), i.pixelStorei(i.PACK_SKIP_ROWS, 0), i.pixelStorei(i.UNPACK_ROW_LENGTH, 0), i.pixelStorei(i.UNPACK_IMAGE_HEIGHT, 0), i.pixelStorei(i.UNPACK_SKIP_PIXELS, 0), i.pixelStorei(i.UNPACK_SKIP_ROWS, 0), i.pixelStorei(i.UNPACK_SKIP_IMAGES, 0), d = {}, u = {}, ce = null, Ce = {}, h = {}, g = /* @__PURE__ */ new WeakMap(), m = [], A = null, f = !1, p = null, b = null, v = null, S = null, R = null, x = null, G = null, C = new Me(0, 0, 0), w = 0, T = !1, M = null, Z = null, U = null, H = null, F = null, et.set(0, 0, i.canvas.width, i.canvas.height), We.set(0, 0, i.canvas.width, i.canvas.height), a.reset(), r.reset(), o.reset();
  }
  return {
    buffers: {
      color: a,
      depth: r,
      stencil: o
    },
    enable: ie,
    disable: Re,
    bindFramebuffer: Be,
    drawBuffers: Ge,
    useProgram: ut,
    setBlending: ct,
    setMaterial: He,
    setFlipSided: xt,
    setCullFace: gt,
    setLineWidth: Kt,
    setPolygonOffset: E,
    setScissorTest: _t,
    activeTexture: ze,
    bindTexture: ot,
    unbindTexture: oe,
    compressedTexImage2D: ft,
    compressedTexImage3D: _,
    texImage2D: Y,
    texImage3D: J,
    pixelStorei: me,
    getParameter: ge,
    updateUBOMapping: Ze,
    uniformBlockBinding: Ve,
    texStorage2D: ee,
    texStorage3D: re,
    texSubImage2D: I,
    texSubImage3D: V,
    compressedTexSubImage2D: O,
    compressedTexSubImage3D: q,
    scissor: se,
    viewport: te,
    reset: je
  };
}
function eC(i, e, t, n, s, a, r) {
  const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), c = new Te(), d = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new Set();
  let h;
  const g = /* @__PURE__ */ new WeakMap();
  let m = !1;
  try {
    m = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function A(_, I) {
    return m ? new OffscreenCanvas(_, I) : Ds("canvas");
  }
  function f(_, I, V) {
    let O = 1;
    const q = ft(_);
    if ((q.width > V || q.height > V) && (O = V / Math.max(q.width, q.height)), O < 1)
      if (typeof HTMLImageElement < "u" && _ instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && _ instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && _ instanceof ImageBitmap || typeof VideoFrame < "u" && _ instanceof VideoFrame) {
        const ee = Math.floor(O * q.width), re = Math.floor(O * q.height);
        h === void 0 && (h = A(ee, re));
        const Y = I ? A(ee, re) : h;
        return Y.width = ee, Y.height = re, Y.getContext("2d").drawImage(_, 0, 0, ee, re), Ae("WebGLRenderer: Texture has been resized from (" + q.width + "x" + q.height + ") to (" + ee + "x" + re + ")."), Y;
      } else
        return "data" in _ && Ae("WebGLRenderer: Image in DataTexture is too big (" + q.width + "x" + q.height + ")."), _;
    return _;
  }
  function p(_) {
    return _.generateMipmaps;
  }
  function b(_) {
    i.generateMipmap(_);
  }
  function v(_) {
    return _.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : _.isWebGL3DRenderTarget ? i.TEXTURE_3D : _.isWebGLArrayRenderTarget || _.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function S(_, I, V, O, q, ee = !1) {
    if (_ !== null) {
      if (i[_] !== void 0) return i[_];
      Ae("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + _ + "'");
    }
    let re;
    O && (re = e.get("EXT_texture_norm16"), re || Ae("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
    let Y = I;
    if (I === i.RED && (V === i.FLOAT && (Y = i.R32F), V === i.HALF_FLOAT && (Y = i.R16F), V === i.UNSIGNED_BYTE && (Y = i.R8), V === i.UNSIGNED_SHORT && re && (Y = re.R16_EXT), V === i.SHORT && re && (Y = re.R16_SNORM_EXT)), I === i.RED_INTEGER && (V === i.UNSIGNED_BYTE && (Y = i.R8UI), V === i.UNSIGNED_SHORT && (Y = i.R16UI), V === i.UNSIGNED_INT && (Y = i.R32UI), V === i.BYTE && (Y = i.R8I), V === i.SHORT && (Y = i.R16I), V === i.INT && (Y = i.R32I)), I === i.RG && (V === i.FLOAT && (Y = i.RG32F), V === i.HALF_FLOAT && (Y = i.RG16F), V === i.UNSIGNED_BYTE && (Y = i.RG8), V === i.UNSIGNED_SHORT && re && (Y = re.RG16_EXT), V === i.SHORT && re && (Y = re.RG16_SNORM_EXT)), I === i.RG_INTEGER && (V === i.UNSIGNED_BYTE && (Y = i.RG8UI), V === i.UNSIGNED_SHORT && (Y = i.RG16UI), V === i.UNSIGNED_INT && (Y = i.RG32UI), V === i.BYTE && (Y = i.RG8I), V === i.SHORT && (Y = i.RG16I), V === i.INT && (Y = i.RG32I)), I === i.RGB_INTEGER && (V === i.UNSIGNED_BYTE && (Y = i.RGB8UI), V === i.UNSIGNED_SHORT && (Y = i.RGB16UI), V === i.UNSIGNED_INT && (Y = i.RGB32UI), V === i.BYTE && (Y = i.RGB8I), V === i.SHORT && (Y = i.RGB16I), V === i.INT && (Y = i.RGB32I)), I === i.RGBA_INTEGER && (V === i.UNSIGNED_BYTE && (Y = i.RGBA8UI), V === i.UNSIGNED_SHORT && (Y = i.RGBA16UI), V === i.UNSIGNED_INT && (Y = i.RGBA32UI), V === i.BYTE && (Y = i.RGBA8I), V === i.SHORT && (Y = i.RGBA16I), V === i.INT && (Y = i.RGBA32I)), I === i.RGB && (V === i.UNSIGNED_SHORT && re && (Y = re.RGB16_EXT), V === i.SHORT && re && (Y = re.RGB16_SNORM_EXT), V === i.UNSIGNED_INT_5_9_9_9_REV && (Y = i.RGB9_E5), V === i.UNSIGNED_INT_10F_11F_11F_REV && (Y = i.R11F_G11F_B10F)), I === i.RGBA) {
      const J = ee ? Va : Pe.getTransfer(q);
      V === i.FLOAT && (Y = i.RGBA32F), V === i.HALF_FLOAT && (Y = i.RGBA16F), V === i.UNSIGNED_BYTE && (Y = J === Qe ? i.SRGB8_ALPHA8 : i.RGBA8), V === i.UNSIGNED_SHORT && re && (Y = re.RGBA16_EXT), V === i.SHORT && re && (Y = re.RGBA16_SNORM_EXT), V === i.UNSIGNED_SHORT_4_4_4_4 && (Y = i.RGBA4), V === i.UNSIGNED_SHORT_5_5_5_1 && (Y = i.RGB5_A1);
    }
    return (Y === i.R16F || Y === i.R32F || Y === i.RG16F || Y === i.RG32F || Y === i.RGBA16F || Y === i.RGBA32F) && e.get("EXT_color_buffer_float"), Y;
  }
  function R(_, I) {
    let V;
    return _ ? I === null || I === Bn || I === Ws ? V = i.DEPTH24_STENCIL8 : I === cn ? V = i.DEPTH32F_STENCIL8 : I === Fs && (V = i.DEPTH24_STENCIL8, Ae("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : I === null || I === Bn || I === Ws ? V = i.DEPTH_COMPONENT24 : I === cn ? V = i.DEPTH_COMPONENT32F : I === Fs && (V = i.DEPTH_COMPONENT16), V;
  }
  function x(_, I) {
    return p(_) === !0 || _.isFramebufferTexture && _.minFilter !== Rt && _.minFilter !== Mt ? Math.log2(Math.max(I.width, I.height)) + 1 : _.mipmaps !== void 0 && _.mipmaps.length > 0 ? _.mipmaps.length : _.isCompressedTexture && Array.isArray(_.image) ? I.mipmaps.length : 1;
  }
  function G(_) {
    const I = _.target;
    I.removeEventListener("dispose", G), w(I), I.isVideoTexture && d.delete(I), I.isHTMLTexture && u.delete(I);
  }
  function C(_) {
    const I = _.target;
    I.removeEventListener("dispose", C), M(I);
  }
  function w(_) {
    const I = n.get(_);
    if (I.__webglInit === void 0) return;
    const V = _.source, O = g.get(V);
    if (O) {
      const q = O[I.__cacheKey];
      q.usedTimes--, q.usedTimes === 0 && T(_), Object.keys(O).length === 0 && g.delete(V);
    }
    n.remove(_);
  }
  function T(_) {
    const I = n.get(_);
    i.deleteTexture(I.__webglTexture);
    const V = _.source, O = g.get(V);
    delete O[I.__cacheKey], r.memory.textures--;
  }
  function M(_) {
    const I = n.get(_);
    if (_.depthTexture && (_.depthTexture.dispose(), n.remove(_.depthTexture)), _.isWebGLCubeRenderTarget)
      for (let O = 0; O < 6; O++) {
        if (Array.isArray(I.__webglFramebuffer[O]))
          for (let q = 0; q < I.__webglFramebuffer[O].length; q++) i.deleteFramebuffer(I.__webglFramebuffer[O][q]);
        else
          i.deleteFramebuffer(I.__webglFramebuffer[O]);
        I.__webglDepthbuffer && i.deleteRenderbuffer(I.__webglDepthbuffer[O]);
      }
    else {
      if (Array.isArray(I.__webglFramebuffer))
        for (let O = 0; O < I.__webglFramebuffer.length; O++) i.deleteFramebuffer(I.__webglFramebuffer[O]);
      else
        i.deleteFramebuffer(I.__webglFramebuffer);
      if (I.__webglDepthbuffer && i.deleteRenderbuffer(I.__webglDepthbuffer), I.__webglMultisampledFramebuffer && i.deleteFramebuffer(I.__webglMultisampledFramebuffer), I.__webglColorRenderbuffer)
        for (let O = 0; O < I.__webglColorRenderbuffer.length; O++)
          I.__webglColorRenderbuffer[O] && i.deleteRenderbuffer(I.__webglColorRenderbuffer[O]);
      I.__webglDepthRenderbuffer && i.deleteRenderbuffer(I.__webglDepthRenderbuffer);
    }
    const V = _.textures;
    for (let O = 0, q = V.length; O < q; O++) {
      const ee = n.get(V[O]);
      ee.__webglTexture && (i.deleteTexture(ee.__webglTexture), r.memory.textures--), n.remove(V[O]);
    }
    n.remove(_);
  }
  let Z = 0;
  function U() {
    Z = 0;
  }
  function H() {
    return Z;
  }
  function F(_) {
    Z = _;
  }
  function L() {
    const _ = Z;
    return _ >= s.maxTextures && Ae("WebGLTextures: Trying to use " + _ + " texture units while this GPU supports only " + s.maxTextures), Z += 1, _;
  }
  function P(_) {
    const I = [];
    return I.push(_.wrapS), I.push(_.wrapT), I.push(_.wrapR || 0), I.push(_.magFilter), I.push(_.minFilter), I.push(_.anisotropy), I.push(_.internalFormat), I.push(_.format), I.push(_.type), I.push(_.generateMipmaps), I.push(_.premultiplyAlpha), I.push(_.flipY), I.push(_.unpackAlignment), I.push(_.colorSpace), I.join();
  }
  function j(_, I) {
    const V = n.get(_);
    if (_.isVideoTexture && ot(_), _.isRenderTargetTexture === !1 && _.isExternalTexture !== !0 && _.version > 0 && V.__version !== _.version) {
      const O = _.image;
      if (O === null)
        Ae("WebGLRenderer: Texture marked for update but no image data found.");
      else if (O.complete === !1)
        Ae("WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Re(V, _, I);
        return;
      }
    } else _.isExternalTexture && (V.__webglTexture = _.sourceTexture ? _.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D, V.__webglTexture, i.TEXTURE0 + I);
  }
  function $(_, I) {
    const V = n.get(_);
    if (_.isRenderTargetTexture === !1 && _.version > 0 && V.__version !== _.version) {
      Re(V, _, I);
      return;
    } else _.isExternalTexture && (V.__webglTexture = _.sourceTexture ? _.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D_ARRAY, V.__webglTexture, i.TEXTURE0 + I);
  }
  function ce(_, I) {
    const V = n.get(_);
    if (_.isRenderTargetTexture === !1 && _.version > 0 && V.__version !== _.version) {
      Re(V, _, I);
      return;
    }
    t.bindTexture(i.TEXTURE_3D, V.__webglTexture, i.TEXTURE0 + I);
  }
  function Ce(_, I) {
    const V = n.get(_);
    if (_.isCubeDepthTexture !== !0 && _.version > 0 && V.__version !== _.version) {
      Be(V, _, I);
      return;
    }
    t.bindTexture(i.TEXTURE_CUBE_MAP, V.__webglTexture, i.TEXTURE0 + I);
  }
  const xe = {
    [es]: i.REPEAT,
    [Mn]: i.CLAMP_TO_EDGE,
    [Ea]: i.MIRRORED_REPEAT
  }, Je = {
    [Rt]: i.NEAREST,
    [Ed]: i.NEAREST_MIPMAP_NEAREST,
    [Ms]: i.NEAREST_MIPMAP_LINEAR,
    [Mt]: i.LINEAR,
    [Ra]: i.LINEAR_MIPMAP_NEAREST,
    [Hn]: i.LINEAR_MIPMAP_LINEAR
  }, et = {
    [vu]: i.NEVER,
    [Mu]: i.ALWAYS,
    [xu]: i.LESS,
    [nl]: i.LEQUAL,
    [_u]: i.EQUAL,
    [il]: i.GEQUAL,
    [wu]: i.GREATER,
    [Ru]: i.NOTEQUAL
  };
  function We(_, I) {
    if (I.type === cn && e.has("OES_texture_float_linear") === !1 && (I.magFilter === Mt || I.magFilter === Ra || I.magFilter === Ms || I.magFilter === Hn || I.minFilter === Mt || I.minFilter === Ra || I.minFilter === Ms || I.minFilter === Hn) && Ae("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(_, i.TEXTURE_WRAP_S, xe[I.wrapS]), i.texParameteri(_, i.TEXTURE_WRAP_T, xe[I.wrapT]), (_ === i.TEXTURE_3D || _ === i.TEXTURE_2D_ARRAY) && i.texParameteri(_, i.TEXTURE_WRAP_R, xe[I.wrapR]), i.texParameteri(_, i.TEXTURE_MAG_FILTER, Je[I.magFilter]), i.texParameteri(_, i.TEXTURE_MIN_FILTER, Je[I.minFilter]), I.compareFunction && (i.texParameteri(_, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(_, i.TEXTURE_COMPARE_FUNC, et[I.compareFunction])), e.has("EXT_texture_filter_anisotropic") === !0) {
      if (I.magFilter === Rt || I.minFilter !== Ms && I.minFilter !== Hn || I.type === cn && e.has("OES_texture_float_linear") === !1) return;
      if (I.anisotropy > 1 || n.get(I).__currentAnisotropy) {
        const V = e.get("EXT_texture_filter_anisotropic");
        i.texParameterf(_, V.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(I.anisotropy, s.getMaxAnisotropy())), n.get(I).__currentAnisotropy = I.anisotropy;
      }
    }
  }
  function K(_, I) {
    let V = !1;
    _.__webglInit === void 0 && (_.__webglInit = !0, I.addEventListener("dispose", G));
    const O = I.source;
    let q = g.get(O);
    q === void 0 && (q = {}, g.set(O, q));
    const ee = P(I);
    if (ee !== _.__cacheKey) {
      q[ee] === void 0 && (q[ee] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, r.memory.textures++, V = !0), q[ee].usedTimes++;
      const re = q[_.__cacheKey];
      re !== void 0 && (q[_.__cacheKey].usedTimes--, re.usedTimes === 0 && T(I)), _.__cacheKey = ee, _.__webglTexture = q[ee].texture;
    }
    return V;
  }
  function ue(_, I, V) {
    return Math.floor(Math.floor(_ / V) / I);
  }
  function ie(_, I, V, O) {
    const ee = _.updateRanges;
    if (ee.length === 0)
      t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, I.width, I.height, V, O, I.data);
    else {
      ee.sort((me, se) => me.start - se.start);
      let re = 0;
      for (let me = 1; me < ee.length; me++) {
        const se = ee[re], te = ee[me], Ze = se.start + se.count, Ve = ue(te.start, I.width, 4), je = ue(se.start, I.width, 4);
        te.start <= Ze + 1 && Ve === je && ue(te.start + te.count - 1, I.width, 4) === Ve ? se.count = Math.max(
          se.count,
          te.start + te.count - se.start
        ) : (++re, ee[re] = te);
      }
      ee.length = re + 1;
      const Y = t.getParameter(i.UNPACK_ROW_LENGTH), J = t.getParameter(i.UNPACK_SKIP_PIXELS), ge = t.getParameter(i.UNPACK_SKIP_ROWS);
      t.pixelStorei(i.UNPACK_ROW_LENGTH, I.width);
      for (let me = 0, se = ee.length; me < se; me++) {
        const te = ee[me], Ze = Math.floor(te.start / 4), Ve = Math.ceil(te.count / 4), je = Ze % I.width, B = Math.floor(Ze / I.width), ne = Ve, z = 1;
        t.pixelStorei(i.UNPACK_SKIP_PIXELS, je), t.pixelStorei(i.UNPACK_SKIP_ROWS, B), t.texSubImage2D(i.TEXTURE_2D, 0, je, B, ne, z, V, O, I.data);
      }
      _.clearUpdateRanges(), t.pixelStorei(i.UNPACK_ROW_LENGTH, Y), t.pixelStorei(i.UNPACK_SKIP_PIXELS, J), t.pixelStorei(i.UNPACK_SKIP_ROWS, ge);
    }
  }
  function Re(_, I, V) {
    let O = i.TEXTURE_2D;
    (I.isDataArrayTexture || I.isCompressedArrayTexture) && (O = i.TEXTURE_2D_ARRAY), I.isData3DTexture && (O = i.TEXTURE_3D);
    const q = K(_, I), ee = I.source;
    t.bindTexture(O, _.__webglTexture, i.TEXTURE0 + V);
    const re = n.get(ee);
    if (ee.version !== re.__version || q === !0) {
      if (t.activeTexture(i.TEXTURE0 + V), (typeof ImageBitmap < "u" && I.image instanceof ImageBitmap) === !1) {
        const z = Pe.getPrimaries(Pe.workingColorSpace), pe = I.colorSpace === ci ? null : Pe.getPrimaries(I.colorSpace), ae = I.colorSpace === ci || z === pe ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
        t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, I.flipY), t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, I.premultiplyAlpha), t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ae);
      }
      t.pixelStorei(i.UNPACK_ALIGNMENT, I.unpackAlignment);
      let J = f(I.image, !1, s.maxTextureSize);
      J = oe(I, J);
      const ge = a.convert(I.format, I.colorSpace), me = a.convert(I.type);
      let se = S(I.internalFormat, ge, me, I.normalized, I.colorSpace, I.isVideoTexture);
      We(O, I);
      let te;
      const Ze = I.mipmaps, Ve = I.isVideoTexture !== !0, je = re.__version === void 0 || q === !0, B = ee.dataReady, ne = x(I, J);
      if (I.isDepthTexture)
        se = R(I.format === Si, I.type), je && (Ve ? t.texStorage2D(i.TEXTURE_2D, 1, se, J.width, J.height) : t.texImage2D(i.TEXTURE_2D, 0, se, J.width, J.height, 0, ge, me, null));
      else if (I.isDataTexture)
        if (Ze.length > 0) {
          Ve && je && t.texStorage2D(i.TEXTURE_2D, ne, se, Ze[0].width, Ze[0].height);
          for (let z = 0, pe = Ze.length; z < pe; z++)
            te = Ze[z], Ve ? B && t.texSubImage2D(i.TEXTURE_2D, z, 0, 0, te.width, te.height, ge, me, te.data) : t.texImage2D(i.TEXTURE_2D, z, se, te.width, te.height, 0, ge, me, te.data);
          I.generateMipmaps = !1;
        } else
          Ve ? (je && t.texStorage2D(i.TEXTURE_2D, ne, se, J.width, J.height), B && ie(I, J, ge, me)) : t.texImage2D(i.TEXTURE_2D, 0, se, J.width, J.height, 0, ge, me, J.data);
      else if (I.isCompressedTexture)
        if (I.isCompressedArrayTexture) {
          Ve && je && t.texStorage3D(i.TEXTURE_2D_ARRAY, ne, se, Ze[0].width, Ze[0].height, J.depth);
          for (let z = 0, pe = Ze.length; z < pe; z++)
            if (te = Ze[z], I.format !== dn)
              if (ge !== null)
                if (Ve) {
                  if (B)
                    if (I.layerUpdates.size > 0) {
                      const ae = Nc(te.width, te.height, I.format, I.type);
                      for (const Q of I.layerUpdates) {
                        const ye = te.data.subarray(
                          Q * ae / te.data.BYTES_PER_ELEMENT,
                          (Q + 1) * ae / te.data.BYTES_PER_ELEMENT
                        );
                        t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, z, 0, 0, Q, te.width, te.height, 1, ge, ye);
                      }
                      I.clearLayerUpdates();
                    } else
                      t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, z, 0, 0, 0, te.width, te.height, J.depth, ge, te.data);
                } else
                  t.compressedTexImage3D(i.TEXTURE_2D_ARRAY, z, se, te.width, te.height, J.depth, 0, te.data, 0, 0);
              else
                Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Ve ? B && t.texSubImage3D(i.TEXTURE_2D_ARRAY, z, 0, 0, 0, te.width, te.height, J.depth, ge, me, te.data) : t.texImage3D(i.TEXTURE_2D_ARRAY, z, se, te.width, te.height, J.depth, 0, ge, me, te.data);
        } else {
          Ve && je && t.texStorage2D(i.TEXTURE_2D, ne, se, Ze[0].width, Ze[0].height);
          for (let z = 0, pe = Ze.length; z < pe; z++)
            te = Ze[z], I.format !== dn ? ge !== null ? Ve ? B && t.compressedTexSubImage2D(i.TEXTURE_2D, z, 0, 0, te.width, te.height, ge, te.data) : t.compressedTexImage2D(i.TEXTURE_2D, z, se, te.width, te.height, 0, te.data) : Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Ve ? B && t.texSubImage2D(i.TEXTURE_2D, z, 0, 0, te.width, te.height, ge, me, te.data) : t.texImage2D(i.TEXTURE_2D, z, se, te.width, te.height, 0, ge, me, te.data);
        }
      else if (I.isDataArrayTexture)
        if (Ve) {
          if (je && t.texStorage3D(i.TEXTURE_2D_ARRAY, ne, se, J.width, J.height, J.depth), B)
            if (I.layerUpdates.size > 0) {
              const z = Nc(J.width, J.height, I.format, I.type);
              for (const pe of I.layerUpdates) {
                const ae = J.data.subarray(
                  pe * z / J.data.BYTES_PER_ELEMENT,
                  (pe + 1) * z / J.data.BYTES_PER_ELEMENT
                );
                t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, pe, J.width, J.height, 1, ge, me, ae);
              }
              I.clearLayerUpdates();
            } else
              t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, J.width, J.height, J.depth, ge, me, J.data);
        } else
          t.texImage3D(i.TEXTURE_2D_ARRAY, 0, se, J.width, J.height, J.depth, 0, ge, me, J.data);
      else if (I.isData3DTexture)
        Ve ? (je && t.texStorage3D(i.TEXTURE_3D, ne, se, J.width, J.height, J.depth), B && t.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, J.width, J.height, J.depth, ge, me, J.data)) : t.texImage3D(i.TEXTURE_3D, 0, se, J.width, J.height, J.depth, 0, ge, me, J.data);
      else if (I.isFramebufferTexture) {
        if (je)
          if (Ve)
            t.texStorage2D(i.TEXTURE_2D, ne, se, J.width, J.height);
          else {
            let z = J.width, pe = J.height;
            for (let ae = 0; ae < ne; ae++)
              t.texImage2D(i.TEXTURE_2D, ae, se, z, pe, 0, ge, me, null), z >>= 1, pe >>= 1;
          }
      } else if (I.isHTMLTexture) {
        if ("texElementImage2D" in i) {
          const z = i.canvas;
          if (z.hasAttribute("layoutsubtree") || z.setAttribute("layoutsubtree", "true"), J.parentNode !== z) {
            z.appendChild(J), u.add(I), z.onpaint = (Ee) => {
              const It = Ee.changedElements;
              for (const nt of u)
                It.includes(nt.image) && (nt.needsUpdate = !0);
            }, z.requestPaint();
            return;
          }
          const pe = 0, ae = i.RGBA, Q = i.RGBA, ye = i.UNSIGNED_BYTE;
          i.texElementImage2D(i.TEXTURE_2D, pe, ae, Q, ye, J), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE);
        }
      } else if (Ze.length > 0) {
        if (Ve && je) {
          const z = ft(Ze[0]);
          t.texStorage2D(i.TEXTURE_2D, ne, se, z.width, z.height);
        }
        for (let z = 0, pe = Ze.length; z < pe; z++)
          te = Ze[z], Ve ? B && t.texSubImage2D(i.TEXTURE_2D, z, 0, 0, ge, me, te) : t.texImage2D(i.TEXTURE_2D, z, se, ge, me, te);
        I.generateMipmaps = !1;
      } else if (Ve) {
        if (je) {
          const z = ft(J);
          t.texStorage2D(i.TEXTURE_2D, ne, se, z.width, z.height);
        }
        B && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ge, me, J);
      } else
        t.texImage2D(i.TEXTURE_2D, 0, se, ge, me, J);
      p(I) && b(O), re.__version = ee.version, I.onUpdate && I.onUpdate(I);
    }
    _.__version = I.version;
  }
  function Be(_, I, V) {
    if (I.image.length !== 6) return;
    const O = K(_, I), q = I.source;
    t.bindTexture(i.TEXTURE_CUBE_MAP, _.__webglTexture, i.TEXTURE0 + V);
    const ee = n.get(q);
    if (q.version !== ee.__version || O === !0) {
      t.activeTexture(i.TEXTURE0 + V);
      const re = Pe.getPrimaries(Pe.workingColorSpace), Y = I.colorSpace === ci ? null : Pe.getPrimaries(I.colorSpace), J = I.colorSpace === ci || re === Y ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, I.flipY), t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, I.premultiplyAlpha), t.pixelStorei(i.UNPACK_ALIGNMENT, I.unpackAlignment), t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, J);
      const ge = I.isCompressedTexture || I.image[0].isCompressedTexture, me = I.image[0] && I.image[0].isDataTexture, se = [];
      for (let Q = 0; Q < 6; Q++)
        !ge && !me ? se[Q] = f(I.image[Q], !0, s.maxCubemapSize) : se[Q] = me ? I.image[Q].image : I.image[Q], se[Q] = oe(I, se[Q]);
      const te = se[0], Ze = a.convert(I.format, I.colorSpace), Ve = a.convert(I.type), je = S(I.internalFormat, Ze, Ve, I.normalized, I.colorSpace), B = I.isVideoTexture !== !0, ne = ee.__version === void 0 || O === !0, z = q.dataReady;
      let pe = x(I, te);
      We(i.TEXTURE_CUBE_MAP, I);
      let ae;
      if (ge) {
        B && ne && t.texStorage2D(i.TEXTURE_CUBE_MAP, pe, je, te.width, te.height);
        for (let Q = 0; Q < 6; Q++) {
          ae = se[Q].mipmaps;
          for (let ye = 0; ye < ae.length; ye++) {
            const Ee = ae[ye];
            I.format !== dn ? Ze !== null ? B ? z && t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye, 0, 0, Ee.width, Ee.height, Ze, Ee.data) : t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye, je, Ee.width, Ee.height, 0, Ee.data) : Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : B ? z && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye, 0, 0, Ee.width, Ee.height, Ze, Ve, Ee.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye, je, Ee.width, Ee.height, 0, Ze, Ve, Ee.data);
          }
        }
      } else {
        if (ae = I.mipmaps, B && ne) {
          ae.length > 0 && pe++;
          const Q = ft(se[0]);
          t.texStorage2D(i.TEXTURE_CUBE_MAP, pe, je, Q.width, Q.height);
        }
        for (let Q = 0; Q < 6; Q++)
          if (me) {
            B ? z && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, 0, 0, se[Q].width, se[Q].height, Ze, Ve, se[Q].data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, je, se[Q].width, se[Q].height, 0, Ze, Ve, se[Q].data);
            for (let ye = 0; ye < ae.length; ye++) {
              const It = ae[ye].image[Q].image;
              B ? z && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye + 1, 0, 0, It.width, It.height, Ze, Ve, It.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye + 1, je, It.width, It.height, 0, Ze, Ve, It.data);
            }
          } else {
            B ? z && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, 0, 0, Ze, Ve, se[Q]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, je, Ze, Ve, se[Q]);
            for (let ye = 0; ye < ae.length; ye++) {
              const Ee = ae[ye];
              B ? z && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye + 1, 0, 0, Ze, Ve, Ee.image[Q]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Q, ye + 1, je, Ze, Ve, Ee.image[Q]);
            }
          }
      }
      p(I) && b(i.TEXTURE_CUBE_MAP), ee.__version = q.version, I.onUpdate && I.onUpdate(I);
    }
    _.__version = I.version;
  }
  function Ge(_, I, V, O, q, ee) {
    const re = a.convert(V.format, V.colorSpace), Y = a.convert(V.type), J = S(V.internalFormat, re, Y, V.normalized, V.colorSpace), ge = n.get(I), me = n.get(V);
    if (me.__renderTarget = I, !ge.__hasExternalTextures) {
      const se = Math.max(1, I.width >> ee), te = Math.max(1, I.height >> ee);
      q === i.TEXTURE_3D || q === i.TEXTURE_2D_ARRAY ? t.texImage3D(q, ee, J, se, te, I.depth, 0, re, Y, null) : t.texImage2D(q, ee, J, se, te, 0, re, Y, null);
    }
    t.bindFramebuffer(i.FRAMEBUFFER, _), ze(I) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, O, q, me.__webglTexture, 0, _t(I)) : (q === i.TEXTURE_2D || q >= i.TEXTURE_CUBE_MAP_POSITIVE_X && q <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, O, q, me.__webglTexture, ee), t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function ut(_, I, V) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, _), I.depthBuffer) {
      const O = I.depthTexture, q = O && O.isDepthTexture ? O.type : null, ee = R(I.stencilBuffer, q), re = I.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
      ze(I) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, _t(I), ee, I.width, I.height) : V ? i.renderbufferStorageMultisample(i.RENDERBUFFER, _t(I), ee, I.width, I.height) : i.renderbufferStorage(i.RENDERBUFFER, ee, I.width, I.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, re, i.RENDERBUFFER, _);
    } else {
      const O = I.textures;
      for (let q = 0; q < O.length; q++) {
        const ee = O[q], re = a.convert(ee.format, ee.colorSpace), Y = a.convert(ee.type), J = S(ee.internalFormat, re, Y, ee.normalized, ee.colorSpace);
        ze(I) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, _t(I), J, I.width, I.height) : V ? i.renderbufferStorageMultisample(i.RENDERBUFFER, _t(I), J, I.width, I.height) : i.renderbufferStorage(i.RENDERBUFFER, J, I.width, I.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Ye(_, I, V) {
    const O = I.isWebGLCubeRenderTarget === !0;
    if (t.bindFramebuffer(i.FRAMEBUFFER, _), !(I.depthTexture && I.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const q = n.get(I.depthTexture);
    if (q.__renderTarget = I, (!q.__webglTexture || I.depthTexture.image.width !== I.width || I.depthTexture.image.height !== I.height) && (I.depthTexture.image.width = I.width, I.depthTexture.image.height = I.height, I.depthTexture.needsUpdate = !0), O) {
      if (q.__webglInit === void 0 && (q.__webglInit = !0, I.depthTexture.addEventListener("dispose", G)), q.__webglTexture === void 0) {
        q.__webglTexture = i.createTexture(), t.bindTexture(i.TEXTURE_CUBE_MAP, q.__webglTexture), We(i.TEXTURE_CUBE_MAP, I.depthTexture);
        const ge = a.convert(I.depthTexture.format), me = a.convert(I.depthTexture.type);
        let se;
        I.depthTexture.format === Jn ? se = i.DEPTH_COMPONENT24 : I.depthTexture.format === Si && (se = i.DEPTH24_STENCIL8);
        for (let te = 0; te < 6; te++)
          i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + te, 0, se, I.width, I.height, 0, ge, me, null);
      }
    } else
      j(I.depthTexture, 0);
    const ee = q.__webglTexture, re = _t(I), Y = O ? i.TEXTURE_CUBE_MAP_POSITIVE_X + V : i.TEXTURE_2D, J = I.depthTexture.format === Si ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
    if (I.depthTexture.format === Jn)
      ze(I) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, J, Y, ee, 0, re) : i.framebufferTexture2D(i.FRAMEBUFFER, J, Y, ee, 0);
    else if (I.depthTexture.format === Si)
      ze(I) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, J, Y, ee, 0, re) : i.framebufferTexture2D(i.FRAMEBUFFER, J, Y, ee, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function tt(_) {
    const I = n.get(_), V = _.isWebGLCubeRenderTarget === !0;
    if (I.__boundDepthTexture !== _.depthTexture) {
      const O = _.depthTexture;
      if (I.__depthDisposeCallback && I.__depthDisposeCallback(), O) {
        const q = () => {
          delete I.__boundDepthTexture, delete I.__depthDisposeCallback, O.removeEventListener("dispose", q);
        };
        O.addEventListener("dispose", q), I.__depthDisposeCallback = q;
      }
      I.__boundDepthTexture = O;
    }
    if (_.depthTexture && !I.__autoAllocateDepthBuffer)
      if (V)
        for (let O = 0; O < 6; O++)
          Ye(I.__webglFramebuffer[O], _, O);
      else {
        const O = _.texture.mipmaps;
        O && O.length > 0 ? Ye(I.__webglFramebuffer[0], _, 0) : Ye(I.__webglFramebuffer, _, 0);
      }
    else if (V) {
      I.__webglDepthbuffer = [];
      for (let O = 0; O < 6; O++)
        if (t.bindFramebuffer(i.FRAMEBUFFER, I.__webglFramebuffer[O]), I.__webglDepthbuffer[O] === void 0)
          I.__webglDepthbuffer[O] = i.createRenderbuffer(), ut(I.__webglDepthbuffer[O], _, !1);
        else {
          const q = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, ee = I.__webglDepthbuffer[O];
          i.bindRenderbuffer(i.RENDERBUFFER, ee), i.framebufferRenderbuffer(i.FRAMEBUFFER, q, i.RENDERBUFFER, ee);
        }
    } else {
      const O = _.texture.mipmaps;
      if (O && O.length > 0 ? t.bindFramebuffer(i.FRAMEBUFFER, I.__webglFramebuffer[0]) : t.bindFramebuffer(i.FRAMEBUFFER, I.__webglFramebuffer), I.__webglDepthbuffer === void 0)
        I.__webglDepthbuffer = i.createRenderbuffer(), ut(I.__webglDepthbuffer, _, !1);
      else {
        const q = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, ee = I.__webglDepthbuffer;
        i.bindRenderbuffer(i.RENDERBUFFER, ee), i.framebufferRenderbuffer(i.FRAMEBUFFER, q, i.RENDERBUFFER, ee);
      }
    }
    t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function ct(_, I, V) {
    const O = n.get(_);
    I !== void 0 && Ge(O.__webglFramebuffer, _, _.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), V !== void 0 && tt(_);
  }
  function He(_) {
    const I = _.texture, V = n.get(_), O = n.get(I);
    _.addEventListener("dispose", C);
    const q = _.textures, ee = _.isWebGLCubeRenderTarget === !0, re = q.length > 1;
    if (re || (O.__webglTexture === void 0 && (O.__webglTexture = i.createTexture()), O.__version = I.version, r.memory.textures++), ee) {
      V.__webglFramebuffer = [];
      for (let Y = 0; Y < 6; Y++)
        if (I.mipmaps && I.mipmaps.length > 0) {
          V.__webglFramebuffer[Y] = [];
          for (let J = 0; J < I.mipmaps.length; J++)
            V.__webglFramebuffer[Y][J] = i.createFramebuffer();
        } else
          V.__webglFramebuffer[Y] = i.createFramebuffer();
    } else {
      if (I.mipmaps && I.mipmaps.length > 0) {
        V.__webglFramebuffer = [];
        for (let Y = 0; Y < I.mipmaps.length; Y++)
          V.__webglFramebuffer[Y] = i.createFramebuffer();
      } else
        V.__webglFramebuffer = i.createFramebuffer();
      if (re)
        for (let Y = 0, J = q.length; Y < J; Y++) {
          const ge = n.get(q[Y]);
          ge.__webglTexture === void 0 && (ge.__webglTexture = i.createTexture(), r.memory.textures++);
        }
      if (_.samples > 0 && ze(_) === !1) {
        V.__webglMultisampledFramebuffer = i.createFramebuffer(), V.__webglColorRenderbuffer = [], t.bindFramebuffer(i.FRAMEBUFFER, V.__webglMultisampledFramebuffer);
        for (let Y = 0; Y < q.length; Y++) {
          const J = q[Y];
          V.__webglColorRenderbuffer[Y] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, V.__webglColorRenderbuffer[Y]);
          const ge = a.convert(J.format, J.colorSpace), me = a.convert(J.type), se = S(J.internalFormat, ge, me, J.normalized, J.colorSpace, _.isXRRenderTarget === !0), te = _t(_);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, te, se, _.width, _.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Y, i.RENDERBUFFER, V.__webglColorRenderbuffer[Y]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), _.depthBuffer && (V.__webglDepthRenderbuffer = i.createRenderbuffer(), ut(V.__webglDepthRenderbuffer, _, !0)), t.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (ee) {
      t.bindTexture(i.TEXTURE_CUBE_MAP, O.__webglTexture), We(i.TEXTURE_CUBE_MAP, I);
      for (let Y = 0; Y < 6; Y++)
        if (I.mipmaps && I.mipmaps.length > 0)
          for (let J = 0; J < I.mipmaps.length; J++)
            Ge(V.__webglFramebuffer[Y][J], _, I, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, J);
        else
          Ge(V.__webglFramebuffer[Y], _, I, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0);
      p(I) && b(i.TEXTURE_CUBE_MAP), t.unbindTexture();
    } else if (re) {
      for (let Y = 0, J = q.length; Y < J; Y++) {
        const ge = q[Y], me = n.get(ge);
        let se = i.TEXTURE_2D;
        (_.isWebGL3DRenderTarget || _.isWebGLArrayRenderTarget) && (se = _.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture(se, me.__webglTexture), We(se, ge), Ge(V.__webglFramebuffer, _, ge, i.COLOR_ATTACHMENT0 + Y, se, 0), p(ge) && b(se);
      }
      t.unbindTexture();
    } else {
      let Y = i.TEXTURE_2D;
      if ((_.isWebGL3DRenderTarget || _.isWebGLArrayRenderTarget) && (Y = _.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture(Y, O.__webglTexture), We(Y, I), I.mipmaps && I.mipmaps.length > 0)
        for (let J = 0; J < I.mipmaps.length; J++)
          Ge(V.__webglFramebuffer[J], _, I, i.COLOR_ATTACHMENT0, Y, J);
      else
        Ge(V.__webglFramebuffer, _, I, i.COLOR_ATTACHMENT0, Y, 0);
      p(I) && b(Y), t.unbindTexture();
    }
    _.depthBuffer && tt(_);
  }
  function xt(_) {
    const I = _.textures;
    for (let V = 0, O = I.length; V < O; V++) {
      const q = I[V];
      if (p(q)) {
        const ee = v(_), re = n.get(q).__webglTexture;
        t.bindTexture(ee, re), b(ee), t.unbindTexture();
      }
    }
  }
  const gt = [], Kt = [];
  function E(_) {
    if (_.samples > 0) {
      if (ze(_) === !1) {
        const I = _.textures, V = _.width, O = _.height;
        let q = i.COLOR_BUFFER_BIT;
        const ee = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, re = n.get(_), Y = I.length > 1;
        if (Y)
          for (let ge = 0; ge < I.length; ge++)
            t.bindFramebuffer(i.FRAMEBUFFER, re.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ge, i.RENDERBUFFER, null), t.bindFramebuffer(i.FRAMEBUFFER, re.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ge, i.TEXTURE_2D, null, 0);
        t.bindFramebuffer(i.READ_FRAMEBUFFER, re.__webglMultisampledFramebuffer);
        const J = _.texture.mipmaps;
        J && J.length > 0 ? t.bindFramebuffer(i.DRAW_FRAMEBUFFER, re.__webglFramebuffer[0]) : t.bindFramebuffer(i.DRAW_FRAMEBUFFER, re.__webglFramebuffer);
        for (let ge = 0; ge < I.length; ge++) {
          if (_.resolveDepthBuffer && (_.depthBuffer && (q |= i.DEPTH_BUFFER_BIT), _.stencilBuffer && _.resolveStencilBuffer && (q |= i.STENCIL_BUFFER_BIT)), Y) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, re.__webglColorRenderbuffer[ge]);
            const me = n.get(I[ge]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, me, 0);
          }
          i.blitFramebuffer(0, 0, V, O, 0, 0, V, O, q, i.NEAREST), l === !0 && (gt.length = 0, Kt.length = 0, gt.push(i.COLOR_ATTACHMENT0 + ge), _.depthBuffer && _.resolveDepthBuffer === !1 && (gt.push(ee), Kt.push(ee), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, Kt)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, gt));
        }
        if (t.bindFramebuffer(i.READ_FRAMEBUFFER, null), t.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), Y)
          for (let ge = 0; ge < I.length; ge++) {
            t.bindFramebuffer(i.FRAMEBUFFER, re.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ge, i.RENDERBUFFER, re.__webglColorRenderbuffer[ge]);
            const me = n.get(I[ge]).__webglTexture;
            t.bindFramebuffer(i.FRAMEBUFFER, re.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ge, i.TEXTURE_2D, me, 0);
          }
        t.bindFramebuffer(i.DRAW_FRAMEBUFFER, re.__webglMultisampledFramebuffer);
      } else if (_.depthBuffer && _.resolveDepthBuffer === !1 && l) {
        const I = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [I]);
      }
    }
  }
  function _t(_) {
    return Math.min(s.maxSamples, _.samples);
  }
  function ze(_) {
    const I = n.get(_);
    return _.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && I.__useRenderToTexture !== !1;
  }
  function ot(_) {
    const I = r.render.frame;
    d.get(_) !== I && (d.set(_, I), _.update());
  }
  function oe(_, I) {
    const V = _.colorSpace, O = _.format, q = _.type;
    return _.isCompressedTexture === !0 || _.isVideoTexture === !0 || V !== tn && V !== ci && (Pe.getTransfer(V) === Qe ? (O !== dn || q !== en) && Ae("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : we("WebGLTextures: Unsupported texture color space:", V)), I;
  }
  function ft(_) {
    return typeof HTMLImageElement < "u" && _ instanceof HTMLImageElement ? (c.width = _.naturalWidth || _.width, c.height = _.naturalHeight || _.height) : typeof VideoFrame < "u" && _ instanceof VideoFrame ? (c.width = _.displayWidth, c.height = _.displayHeight) : (c.width = _.width, c.height = _.height), c;
  }
  this.allocateTextureUnit = L, this.resetTextureUnits = U, this.getTextureUnits = H, this.setTextureUnits = F, this.setTexture2D = j, this.setTexture2DArray = $, this.setTexture3D = ce, this.setTextureCube = Ce, this.rebindTextures = ct, this.setupRenderTarget = He, this.updateRenderTargetMipmap = xt, this.updateMultisampleRenderTarget = E, this.setupDepthRenderbuffer = tt, this.setupFrameBufferTexture = Ge, this.useMultisampledRTT = ze, this.isReversedDepthBuffer = function() {
    return t.buffers.depth.getReversed();
  };
}
function tC(i, e) {
  function t(n, s = ci) {
    let a;
    const r = Pe.getTransfer(s);
    if (n === en) return i.UNSIGNED_BYTE;
    if (n === jo) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Qo) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === Vd) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === Ld) return i.UNSIGNED_INT_10F_11F_11F_REV;
    if (n === Fd) return i.BYTE;
    if (n === Wd) return i.SHORT;
    if (n === Fs) return i.UNSIGNED_SHORT;
    if (n === Ko) return i.INT;
    if (n === Bn) return i.UNSIGNED_INT;
    if (n === cn) return i.FLOAT;
    if (n === On) return i.HALF_FLOAT;
    if (n === Ud) return i.ALPHA;
    if (n === Dd) return i.RGB;
    if (n === dn) return i.RGBA;
    if (n === Jn) return i.DEPTH_COMPONENT;
    if (n === Si) return i.DEPTH_STENCIL;
    if (n === qo) return i.RED;
    if (n === $o) return i.RED_INTEGER;
    if (n === xi) return i.RG;
    if (n === el) return i.RG_INTEGER;
    if (n === tl) return i.RGBA_INTEGER;
    if (n === Ma || n === Ga || n === Ta || n === Za)
      if (r === Qe)
        if (a = e.get("WEBGL_compressed_texture_s3tc_srgb"), a !== null) {
          if (n === Ma) return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === Ga) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === Ta) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Za) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (a = e.get("WEBGL_compressed_texture_s3tc"), a !== null) {
        if (n === Ma) return a.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === Ga) return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === Ta) return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Za) return a.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === ro || n === oo || n === lo || n === co)
      if (a = e.get("WEBGL_compressed_texture_pvrtc"), a !== null) {
        if (n === ro) return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === oo) return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === lo) return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === co) return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === ho || n === uo || n === go || n === po || n === fo || n === Fa || n === mo)
      if (a = e.get("WEBGL_compressed_texture_etc"), a !== null) {
        if (n === ho || n === uo) return r === Qe ? a.COMPRESSED_SRGB8_ETC2 : a.COMPRESSED_RGB8_ETC2;
        if (n === go) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : a.COMPRESSED_RGBA8_ETC2_EAC;
        if (n === po) return a.COMPRESSED_R11_EAC;
        if (n === fo) return a.COMPRESSED_SIGNED_R11_EAC;
        if (n === Fa) return a.COMPRESSED_RG11_EAC;
        if (n === mo) return a.COMPRESSED_SIGNED_RG11_EAC;
      } else
        return null;
    if (n === Io || n === Co || n === bo || n === Ao || n === yo || n === So || n === vo || n === xo || n === _o || n === wo || n === Ro || n === Mo || n === Go || n === To)
      if (a = e.get("WEBGL_compressed_texture_astc"), a !== null) {
        if (n === Io) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : a.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === Co) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : a.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === bo) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : a.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Ao) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : a.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === yo) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : a.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === So) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : a.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === vo) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : a.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === xo) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : a.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === _o) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : a.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === wo) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : a.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === Ro) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : a.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === Mo) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : a.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Go) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : a.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === To) return r === Qe ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : a.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === Zo || n === Bo || n === No)
      if (a = e.get("EXT_texture_compression_bptc"), a !== null) {
        if (n === Zo) return r === Qe ? a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : a.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === Bo) return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === No) return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === Eo || n === Fo || n === Wa || n === Wo)
      if (a = e.get("EXT_texture_compression_rgtc"), a !== null) {
        if (n === Eo) return a.COMPRESSED_RED_RGTC1_EXT;
        if (n === Fo) return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === Wa) return a.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Wo) return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === Ws ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: t };
}
const nC = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, iC = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class sC {

  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }

  init(e, t) {
    if (this.texture === null) {
      const n = new th(e.texture);
      (e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
    }
  }

  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const t = e.cameras[0].viewport, n = new Nn({
        vertexShader: nC,
        fragmentShader: iC,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: t.z },
          depthHeight: { value: t.w }
        }
      });
      this.mesh = new ve(new Ja(20, 20), n);
    }
    return this.mesh;
  }

  reset() {
    this.texture = null, this.mesh = null;
  }

  getDepthTexture() {
    return this.texture;
  }
}
class aC extends _i {

  constructor(e, t) {
    super();
    const n = this;
    let s = null, a = 1, r = null, o = "local-floor", l = 1, c = null, d = null, u = null, h = null, g = null, m = null;
    const A = typeof XRWebGLBinding < "u", f = new sC(), p = {}, b = t.getContextAttributes();
    let v = null, S = null;
    const R = [], x = [], G = new Te();
    let C = null;
    const w = new Yt();
    w.viewport = new rt();
    const T = new Yt();
    T.viewport = new rt();
    const M = [w, T], Z = new ip();
    let U = null, H = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(K) {
      let ue = R[K];
      return ue === void 0 && (ue = new gr(), R[K] = ue), ue.getTargetRaySpace();
    }, this.getControllerGrip = function(K) {
      let ue = R[K];
      return ue === void 0 && (ue = new gr(), R[K] = ue), ue.getGripSpace();
    }, this.getHand = function(K) {
      let ue = R[K];
      return ue === void 0 && (ue = new gr(), R[K] = ue), ue.getHandSpace();
    };
    function F(K) {
      const ue = x.indexOf(K.inputSource);
      if (ue === -1)
        return;
      const ie = R[ue];
      ie !== void 0 && (ie.update(K.inputSource, K.frame, c || r), ie.dispatchEvent({ type: K.type, data: K.inputSource }));
    }
    function L() {
      s.removeEventListener("select", F), s.removeEventListener("selectstart", F), s.removeEventListener("selectend", F), s.removeEventListener("squeeze", F), s.removeEventListener("squeezestart", F), s.removeEventListener("squeezeend", F), s.removeEventListener("end", L), s.removeEventListener("inputsourceschange", P);
      for (let K = 0; K < R.length; K++) {
        const ue = x[K];
        ue !== null && (x[K] = null, R[K].disconnect(ue));
      }
      U = null, H = null, f.reset();
      for (const K in p)
        delete p[K];
      e.setRenderTarget(v), g = null, h = null, u = null, s = null, S = null, We.stop(), n.isPresenting = !1, e.setPixelRatio(C), e.setSize(G.width, G.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(K) {
      a = K, n.isPresenting === !0 && Ae("WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(K) {
      o = K, n.isPresenting === !0 && Ae("WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || r;
    }, this.setReferenceSpace = function(K) {
      c = K;
    }, this.getBaseLayer = function() {
      return h !== null ? h : g;
    }, this.getBinding = function() {
      return u === null && A && (u = new XRWebGLBinding(s, t)), u;
    }, this.getFrame = function() {
      return m;
    }, this.getSession = function() {
      return s;
    }, this.setSession = async function(K) {
      if (s = K, s !== null) {
        if (v = e.getRenderTarget(), s.addEventListener("select", F), s.addEventListener("selectstart", F), s.addEventListener("selectend", F), s.addEventListener("squeeze", F), s.addEventListener("squeezestart", F), s.addEventListener("squeezeend", F), s.addEventListener("end", L), s.addEventListener("inputsourceschange", P), b.xrCompatible !== !0 && await t.makeXRCompatible(), C = e.getPixelRatio(), e.getSize(G), A && "createProjectionLayer" in XRWebGLBinding.prototype) {
          let ie = null, Re = null, Be = null;
          b.depth && (Be = b.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, ie = b.stencil ? Si : Jn, Re = b.stencil ? Ws : Bn);
          const Ge = {
            colorFormat: t.RGBA8,
            depthFormat: Be,
            scaleFactor: a
          };
          u = this.getBinding(), h = u.createProjectionLayer(Ge), s.updateRenderState({ layers: [h] }), e.setPixelRatio(1), e.setSize(h.textureWidth, h.textureHeight, !1), S = new Zn(
            h.textureWidth,
            h.textureHeight,
            {
              format: dn,
              type: en,
              depthTexture: new ns(h.textureWidth, h.textureHeight, Re, void 0, void 0, void 0, void 0, void 0, void 0, ie),
              stencilBuffer: b.stencil,
              colorSpace: e.outputColorSpace,
              samples: b.antialias ? 4 : 0,
              resolveDepthBuffer: h.ignoreDepthValues === !1,
              resolveStencilBuffer: h.ignoreDepthValues === !1
            }
          );
        } else {
          const ie = {
            antialias: b.antialias,
            alpha: !0,
            depth: b.depth,
            stencil: b.stencil,
            framebufferScaleFactor: a
          };
          g = new XRWebGLLayer(s, t, ie), s.updateRenderState({ baseLayer: g }), e.setPixelRatio(1), e.setSize(g.framebufferWidth, g.framebufferHeight, !1), S = new Zn(
            g.framebufferWidth,
            g.framebufferHeight,
            {
              format: dn,
              type: en,
              colorSpace: e.outputColorSpace,
              stencilBuffer: b.stencil,
              resolveDepthBuffer: g.ignoreDepthValues === !1,
              resolveStencilBuffer: g.ignoreDepthValues === !1
            }
          );
        }
        S.isXRRenderTarget = !0, this.setFoveation(l), c = null, r = await s.requestReferenceSpace(o), We.setContext(s), We.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (s !== null)
        return s.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return f.getDepthTexture();
    };
    function P(K) {
      for (let ue = 0; ue < K.removed.length; ue++) {
        const ie = K.removed[ue], Re = x.indexOf(ie);
        Re >= 0 && (x[Re] = null, R[Re].disconnect(ie));
      }
      for (let ue = 0; ue < K.added.length; ue++) {
        const ie = K.added[ue];
        let Re = x.indexOf(ie);
        if (Re === -1) {
          for (let Ge = 0; Ge < R.length; Ge++)
            if (Ge >= x.length) {
              x.push(ie), Re = Ge;
              break;
            } else if (x[Ge] === null) {
              x[Ge] = ie, Re = Ge;
              break;
            }
          if (Re === -1) break;
        }
        const Be = R[Re];
        Be && Be.connect(ie);
      }
    }
    const j = new N(), $ = new N();
    function ce(K, ue, ie) {
      j.setFromMatrixPosition(ue.matrixWorld), $.setFromMatrixPosition(ie.matrixWorld);
      const Re = j.distanceTo($), Be = ue.projectionMatrix.elements, Ge = ie.projectionMatrix.elements, ut = Be[14] / (Be[10] - 1), Ye = Be[14] / (Be[10] + 1), tt = (Be[9] + 1) / Be[5], ct = (Be[9] - 1) / Be[5], He = (Be[8] - 1) / Be[0], xt = (Ge[8] + 1) / Ge[0], gt = ut * He, Kt = ut * xt, E = Re / (-He + xt), _t = E * -He;
      if (ue.matrixWorld.decompose(K.position, K.quaternion, K.scale), K.translateX(_t), K.translateZ(E), K.matrixWorld.compose(K.position, K.quaternion, K.scale), K.matrixWorldInverse.copy(K.matrixWorld).invert(), Be[10] === -1)
        K.projectionMatrix.copy(ue.projectionMatrix), K.projectionMatrixInverse.copy(ue.projectionMatrixInverse);
      else {
        const ze = ut + E, ot = Ye + E, oe = gt - _t, ft = Kt + (Re - _t), _ = tt * Ye / ot * ze, I = ct * Ye / ot * ze;
        K.projectionMatrix.makePerspective(oe, ft, _, I, ze, ot), K.projectionMatrixInverse.copy(K.projectionMatrix).invert();
      }
    }
    function Ce(K, ue) {
      ue === null ? K.matrixWorld.copy(K.matrix) : K.matrixWorld.multiplyMatrices(ue.matrixWorld, K.matrix), K.matrixWorldInverse.copy(K.matrixWorld).invert();
    }
    this.updateCamera = function(K) {
      if (s === null) return;
      let ue = K.near, ie = K.far;
      f.texture !== null && (f.depthNear > 0 && (ue = f.depthNear), f.depthFar > 0 && (ie = f.depthFar)), Z.near = T.near = w.near = ue, Z.far = T.far = w.far = ie, (U !== Z.near || H !== Z.far) && (s.updateRenderState({
        depthNear: Z.near,
        depthFar: Z.far
      }), U = Z.near, H = Z.far), Z.layers.mask = K.layers.mask | 6, w.layers.mask = Z.layers.mask & -5, T.layers.mask = Z.layers.mask & -3;
      const Re = K.parent, Be = Z.cameras;
      Ce(Z, Re);
      for (let Ge = 0; Ge < Be.length; Ge++)
        Ce(Be[Ge], Re);
      Be.length === 2 ? ce(Z, w, T) : Z.projectionMatrix.copy(w.projectionMatrix), xe(K, Z, Re);
    };
    function xe(K, ue, ie) {
      ie === null ? K.matrix.copy(ue.matrixWorld) : (K.matrix.copy(ie.matrixWorld), K.matrix.invert(), K.matrix.multiply(ue.matrixWorld)), K.matrix.decompose(K.position, K.quaternion, K.scale), K.updateMatrixWorld(!0), K.projectionMatrix.copy(ue.projectionMatrix), K.projectionMatrixInverse.copy(ue.projectionMatrixInverse), K.isPerspectiveCamera && (K.fov = ts * 2 * Math.atan(1 / K.projectionMatrix.elements[5]), K.zoom = 1);
    }
    this.getCamera = function() {
      return Z;
    }, this.getFoveation = function() {
      if (!(h === null && g === null))
        return l;
    }, this.setFoveation = function(K) {
      l = K, h !== null && (h.fixedFoveation = K), g !== null && g.fixedFoveation !== void 0 && (g.fixedFoveation = K);
    }, this.hasDepthSensing = function() {
      return f.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return f.getMesh(Z);
    }, this.getCameraTexture = function(K) {
      return p[K];
    };
    let Je = null;
    function et(K, ue) {
      if (d = ue.getViewerPose(c || r), m = ue, d !== null) {
        const ie = d.views;
        g !== null && (e.setRenderTargetFramebuffer(S, g.framebuffer), e.setRenderTarget(S));
        let Re = !1;
        ie.length !== Z.cameras.length && (Z.cameras.length = 0, Re = !0);
        for (let Ye = 0; Ye < ie.length; Ye++) {
          const tt = ie[Ye];
          let ct = null;
          if (g !== null)
            ct = g.getViewport(tt);
          else {
            const xt = u.getViewSubImage(h, tt);
            ct = xt.viewport, Ye === 0 && (e.setRenderTargetTextures(
              S,
              xt.colorTexture,
              xt.depthStencilTexture
            ), e.setRenderTarget(S));
          }
          let He = M[Ye];
          He === void 0 && (He = new Yt(), He.layers.enable(Ye), He.viewport = new rt(), M[Ye] = He), He.matrix.fromArray(tt.transform.matrix), He.matrix.decompose(He.position, He.quaternion, He.scale), He.projectionMatrix.fromArray(tt.projectionMatrix), He.projectionMatrixInverse.copy(He.projectionMatrix).invert(), He.viewport.set(ct.x, ct.y, ct.width, ct.height), Ye === 0 && (Z.matrix.copy(He.matrix), Z.matrix.decompose(Z.position, Z.quaternion, Z.scale)), Re === !0 && Z.cameras.push(He);
        }
        const Be = s.enabledFeatures;
        if (Be && Be.includes("depth-sensing") && s.depthUsage == "gpu-optimized" && A) {
          u = n.getBinding();
          const Ye = u.getDepthInformation(ie[0]);
          Ye && Ye.isValid && Ye.texture && f.init(Ye, s.renderState);
        }
        if (Be && Be.includes("camera-access") && A) {
          e.state.unbindTexture(), u = n.getBinding();
          for (let Ye = 0; Ye < ie.length; Ye++) {
            const tt = ie[Ye].camera;
            if (tt) {
              let ct = p[tt];
              ct || (ct = new th(), p[tt] = ct);
              const He = u.getCameraImage(tt);
              ct.sourceTexture = He;
            }
          }
        }
      }
      for (let ie = 0; ie < R.length; ie++) {
        const Re = x[ie], Be = R[ie];
        Re !== null && Be !== void 0 && Be.update(Re, ue, c || r);
      }
      Je && Je(K, ue), ue.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: ue }), m = null;
    }
    const We = new lh();
    We.setAnimationLoop(et), this.setAnimationLoop = function(K) {
      Je = K;
    }, this.dispose = function() {
    };
  }
}
const rC = /* @__PURE__ */ new Ue(), fh = /* @__PURE__ */ new Ne();
fh.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function oC(i, e) {
  function t(f, p) {
    f.matrixAutoUpdate === !0 && f.updateMatrix(), p.value.copy(f.matrix);
  }
  function n(f, p) {
    p.color.getRGB(f.fogColor.value, nh(i)), p.isFog ? (f.fogNear.value = p.near, f.fogFar.value = p.far) : p.isFogExp2 && (f.fogDensity.value = p.density);
  }
  function s(f, p, b, v, S) {
    p.isNodeMaterial ? p.uniformsNeedUpdate = !1 : p.isMeshBasicMaterial ? a(f, p) : p.isMeshLambertMaterial ? (a(f, p), p.envMap && (f.envMapIntensity.value = p.envMapIntensity)) : p.isMeshToonMaterial ? (a(f, p), u(f, p)) : p.isMeshPhongMaterial ? (a(f, p), d(f, p), p.envMap && (f.envMapIntensity.value = p.envMapIntensity)) : p.isMeshStandardMaterial ? (a(f, p), h(f, p), p.isMeshPhysicalMaterial && g(f, p, S)) : p.isMeshMatcapMaterial ? (a(f, p), m(f, p)) : p.isMeshDepthMaterial ? a(f, p) : p.isMeshDistanceMaterial ? (a(f, p), A(f, p)) : p.isMeshNormalMaterial ? a(f, p) : p.isLineBasicMaterial ? (r(f, p), p.isLineDashedMaterial && o(f, p)) : p.isPointsMaterial ? l(f, p, b, v) : p.isSpriteMaterial ? c(f, p) : p.isShadowMaterial ? (f.color.value.copy(p.color), f.opacity.value = p.opacity) : p.isShaderMaterial && (p.uniformsNeedUpdate = !1);
  }
  function a(f, p) {
    f.opacity.value = p.opacity, p.color && f.diffuse.value.copy(p.color), p.emissive && f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity), p.map && (f.map.value = p.map, t(p.map, f.mapTransform)), p.alphaMap && (f.alphaMap.value = p.alphaMap, t(p.alphaMap, f.alphaMapTransform)), p.bumpMap && (f.bumpMap.value = p.bumpMap, t(p.bumpMap, f.bumpMapTransform), f.bumpScale.value = p.bumpScale, p.side === Jt && (f.bumpScale.value *= -1)), p.normalMap && (f.normalMap.value = p.normalMap, t(p.normalMap, f.normalMapTransform), f.normalScale.value.copy(p.normalScale), p.side === Jt && f.normalScale.value.negate()), p.displacementMap && (f.displacementMap.value = p.displacementMap, t(p.displacementMap, f.displacementMapTransform), f.displacementScale.value = p.displacementScale, f.displacementBias.value = p.displacementBias), p.emissiveMap && (f.emissiveMap.value = p.emissiveMap, t(p.emissiveMap, f.emissiveMapTransform)), p.specularMap && (f.specularMap.value = p.specularMap, t(p.specularMap, f.specularMapTransform)), p.alphaTest > 0 && (f.alphaTest.value = p.alphaTest);
    const b = e.get(p), v = b.envMap, S = b.envMapRotation;
    v && (f.envMap.value = v, f.envMapRotation.value.setFromMatrix4(rC.makeRotationFromEuler(S)).transpose(), v.isCubeTexture && v.isRenderTargetTexture === !1 && f.envMapRotation.value.premultiply(fh), f.reflectivity.value = p.reflectivity, f.ior.value = p.ior, f.refractionRatio.value = p.refractionRatio), p.lightMap && (f.lightMap.value = p.lightMap, f.lightMapIntensity.value = p.lightMapIntensity, t(p.lightMap, f.lightMapTransform)), p.aoMap && (f.aoMap.value = p.aoMap, f.aoMapIntensity.value = p.aoMapIntensity, t(p.aoMap, f.aoMapTransform));
  }
  function r(f, p) {
    f.diffuse.value.copy(p.color), f.opacity.value = p.opacity, p.map && (f.map.value = p.map, t(p.map, f.mapTransform));
  }
  function o(f, p) {
    f.dashSize.value = p.dashSize, f.totalSize.value = p.dashSize + p.gapSize, f.scale.value = p.scale;
  }
  function l(f, p, b, v) {
    f.diffuse.value.copy(p.color), f.opacity.value = p.opacity, f.size.value = p.size * b, f.scale.value = v * 0.5, p.map && (f.map.value = p.map, t(p.map, f.uvTransform)), p.alphaMap && (f.alphaMap.value = p.alphaMap, t(p.alphaMap, f.alphaMapTransform)), p.alphaTest > 0 && (f.alphaTest.value = p.alphaTest);
  }
  function c(f, p) {
    f.diffuse.value.copy(p.color), f.opacity.value = p.opacity, f.rotation.value = p.rotation, p.map && (f.map.value = p.map, t(p.map, f.mapTransform)), p.alphaMap && (f.alphaMap.value = p.alphaMap, t(p.alphaMap, f.alphaMapTransform)), p.alphaTest > 0 && (f.alphaTest.value = p.alphaTest);
  }
  function d(f, p) {
    f.specular.value.copy(p.specular), f.shininess.value = Math.max(p.shininess, 1e-4);
  }
  function u(f, p) {
    p.gradientMap && (f.gradientMap.value = p.gradientMap);
  }
  function h(f, p) {
    f.metalness.value = p.metalness, p.metalnessMap && (f.metalnessMap.value = p.metalnessMap, t(p.metalnessMap, f.metalnessMapTransform)), f.roughness.value = p.roughness, p.roughnessMap && (f.roughnessMap.value = p.roughnessMap, t(p.roughnessMap, f.roughnessMapTransform)), p.envMap && (f.envMapIntensity.value = p.envMapIntensity);
  }
  function g(f, p, b) {
    f.ior.value = p.ior, p.sheen > 0 && (f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen), f.sheenRoughness.value = p.sheenRoughness, p.sheenColorMap && (f.sheenColorMap.value = p.sheenColorMap, t(p.sheenColorMap, f.sheenColorMapTransform)), p.sheenRoughnessMap && (f.sheenRoughnessMap.value = p.sheenRoughnessMap, t(p.sheenRoughnessMap, f.sheenRoughnessMapTransform))), p.clearcoat > 0 && (f.clearcoat.value = p.clearcoat, f.clearcoatRoughness.value = p.clearcoatRoughness, p.clearcoatMap && (f.clearcoatMap.value = p.clearcoatMap, t(p.clearcoatMap, f.clearcoatMapTransform)), p.clearcoatRoughnessMap && (f.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap, t(p.clearcoatRoughnessMap, f.clearcoatRoughnessMapTransform)), p.clearcoatNormalMap && (f.clearcoatNormalMap.value = p.clearcoatNormalMap, t(p.clearcoatNormalMap, f.clearcoatNormalMapTransform), f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale), p.side === Jt && f.clearcoatNormalScale.value.negate())), p.dispersion > 0 && (f.dispersion.value = p.dispersion), p.iridescence > 0 && (f.iridescence.value = p.iridescence, f.iridescenceIOR.value = p.iridescenceIOR, f.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0], f.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1], p.iridescenceMap && (f.iridescenceMap.value = p.iridescenceMap, t(p.iridescenceMap, f.iridescenceMapTransform)), p.iridescenceThicknessMap && (f.iridescenceThicknessMap.value = p.iridescenceThicknessMap, t(p.iridescenceThicknessMap, f.iridescenceThicknessMapTransform))), p.transmission > 0 && (f.transmission.value = p.transmission, f.transmissionSamplerMap.value = b.texture, f.transmissionSamplerSize.value.set(b.width, b.height), p.transmissionMap && (f.transmissionMap.value = p.transmissionMap, t(p.transmissionMap, f.transmissionMapTransform)), f.thickness.value = p.thickness, p.thicknessMap && (f.thicknessMap.value = p.thicknessMap, t(p.thicknessMap, f.thicknessMapTransform)), f.attenuationDistance.value = p.attenuationDistance, f.attenuationColor.value.copy(p.attenuationColor)), p.anisotropy > 0 && (f.anisotropyVector.value.set(p.anisotropy * Math.cos(p.anisotropyRotation), p.anisotropy * Math.sin(p.anisotropyRotation)), p.anisotropyMap && (f.anisotropyMap.value = p.anisotropyMap, t(p.anisotropyMap, f.anisotropyMapTransform))), f.specularIntensity.value = p.specularIntensity, f.specularColor.value.copy(p.specularColor), p.specularColorMap && (f.specularColorMap.value = p.specularColorMap, t(p.specularColorMap, f.specularColorMapTransform)), p.specularIntensityMap && (f.specularIntensityMap.value = p.specularIntensityMap, t(p.specularIntensityMap, f.specularIntensityMapTransform));
  }
  function m(f, p) {
    p.matcap && (f.matcap.value = p.matcap);
  }
  function A(f, p) {
    const b = e.get(p).light;
    f.referencePosition.value.setFromMatrixPosition(b.matrixWorld), f.nearDistance.value = b.shadow.camera.near, f.farDistance.value = b.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: s
  };
}
function lC(i, e, t, n) {
  let s = {}, a = {}, r = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(b, v) {
    const S = v.program;
    n.uniformBlockBinding(b, S);
  }
  function c(b, v) {
    let S = s[b.id];
    S === void 0 && (m(b), S = d(b), s[b.id] = S, b.addEventListener("dispose", f));
    const R = v.program;
    n.updateUBOMapping(b, R);
    const x = e.render.frame;
    a[b.id] !== x && (h(b), a[b.id] = x);
  }
  function d(b) {
    const v = u();
    b.__bindingPointIndex = v;
    const S = i.createBuffer(), R = b.__size, x = b.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, S), i.bufferData(i.UNIFORM_BUFFER, R, x), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, v, S), S;
  }
  function u() {
    for (let b = 0; b < o; b++)
      if (r.indexOf(b) === -1)
        return r.push(b), b;
    return we("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function h(b) {
    const v = s[b.id], S = b.uniforms, R = b.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, v);
    for (let x = 0, G = S.length; x < G; x++) {
      const C = Array.isArray(S[x]) ? S[x] : [S[x]];
      for (let w = 0, T = C.length; w < T; w++) {
        const M = C[w];
        if (g(M, x, w, R) === !0) {
          const Z = M.__offset, U = Array.isArray(M.value) ? M.value : [M.value];
          let H = 0;
          for (let F = 0; F < U.length; F++) {
            const L = U[F], P = A(L);
            typeof L == "number" || typeof L == "boolean" ? (M.__data[0] = L, i.bufferSubData(i.UNIFORM_BUFFER, Z + H, M.__data)) : L.isMatrix3 ? (M.__data[0] = L.elements[0], M.__data[1] = L.elements[1], M.__data[2] = L.elements[2], M.__data[3] = 0, M.__data[4] = L.elements[3], M.__data[5] = L.elements[4], M.__data[6] = L.elements[5], M.__data[7] = 0, M.__data[8] = L.elements[6], M.__data[9] = L.elements[7], M.__data[10] = L.elements[8], M.__data[11] = 0) : ArrayBuffer.isView(L) ? M.__data.set(new L.constructor(L.buffer, L.byteOffset, M.__data.length)) : (L.toArray(M.__data, H), H += P.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, Z, M.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function g(b, v, S, R) {
    const x = b.value, G = v + "_" + S;
    if (R[G] === void 0)
      return typeof x == "number" || typeof x == "boolean" ? R[G] = x : ArrayBuffer.isView(x) ? R[G] = x.slice() : R[G] = x.clone(), !0;
    {
      const C = R[G];
      if (typeof x == "number" || typeof x == "boolean") {
        if (C !== x)
          return R[G] = x, !0;
      } else {
        if (ArrayBuffer.isView(x))
          return !0;
        if (C.equals(x) === !1)
          return C.copy(x), !0;
      }
    }
    return !1;
  }
  function m(b) {
    const v = b.uniforms;
    let S = 0;
    const R = 16;
    for (let G = 0, C = v.length; G < C; G++) {
      const w = Array.isArray(v[G]) ? v[G] : [v[G]];
      for (let T = 0, M = w.length; T < M; T++) {
        const Z = w[T], U = Array.isArray(Z.value) ? Z.value : [Z.value];
        for (let H = 0, F = U.length; H < F; H++) {
          const L = U[H], P = A(L), j = S % R, $ = j % P.boundary, ce = j + $;
          S += $, ce !== 0 && R - ce < P.storage && (S += R - ce), Z.__data = new Float32Array(P.storage / Float32Array.BYTES_PER_ELEMENT), Z.__offset = S, S += P.storage;
        }
      }
    }
    const x = S % R;
    return x > 0 && (S += R - x), b.__size = S, b.__cache = {}, this;
  }
  function A(b) {
    const v = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof b == "number" || typeof b == "boolean" ? (v.boundary = 4, v.storage = 4) : b.isVector2 ? (v.boundary = 8, v.storage = 8) : b.isVector3 || b.isColor ? (v.boundary = 16, v.storage = 12) : b.isVector4 ? (v.boundary = 16, v.storage = 16) : b.isMatrix3 ? (v.boundary = 48, v.storage = 48) : b.isMatrix4 ? (v.boundary = 64, v.storage = 64) : b.isTexture ? Ae("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(b) ? (v.boundary = 16, v.storage = b.byteLength) : Ae("WebGLRenderer: Unsupported uniform value type.", b), v;
  }
  function f(b) {
    const v = b.target;
    v.removeEventListener("dispose", f);
    const S = r.indexOf(v.__bindingPointIndex);
    r.splice(S, 1), i.deleteBuffer(s[v.id]), delete s[v.id], delete a[v.id];
  }
  function p() {
    for (const b in s)
      i.deleteBuffer(s[b]);
    r = [], s = {}, a = {};
  }
  return {
    bind: l,
    update: c,
    dispose: p
  };
}
const cC = new Uint16Array([
  12469,
  15057,
  12620,
  14925,
  13266,
  14620,
  13807,
  14376,
  14323,
  13990,
  14545,
  13625,
  14713,
  13328,
  14840,
  12882,
  14931,
  12528,
  14996,
  12233,
  15039,
  11829,
  15066,
  11525,
  15080,
  11295,
  15085,
  10976,
  15082,
  10705,
  15073,
  10495,
  13880,
  14564,
  13898,
  14542,
  13977,
  14430,
  14158,
  14124,
  14393,
  13732,
  14556,
  13410,
  14702,
  12996,
  14814,
  12596,
  14891,
  12291,
  14937,
  11834,
  14957,
  11489,
  14958,
  11194,
  14943,
  10803,
  14921,
  10506,
  14893,
  10278,
  14858,
  9960,
  14484,
  14039,
  14487,
  14025,
  14499,
  13941,
  14524,
  13740,
  14574,
  13468,
  14654,
  13106,
  14743,
  12678,
  14818,
  12344,
  14867,
  11893,
  14889,
  11509,
  14893,
  11180,
  14881,
  10751,
  14852,
  10428,
  14812,
  10128,
  14765,
  9754,
  14712,
  9466,
  14764,
  13480,
  14764,
  13475,
  14766,
  13440,
  14766,
  13347,
  14769,
  13070,
  14786,
  12713,
  14816,
  12387,
  14844,
  11957,
  14860,
  11549,
  14868,
  11215,
  14855,
  10751,
  14825,
  10403,
  14782,
  10044,
  14729,
  9651,
  14666,
  9352,
  14599,
  9029,
  14967,
  12835,
  14966,
  12831,
  14963,
  12804,
  14954,
  12723,
  14936,
  12564,
  14917,
  12347,
  14900,
  11958,
  14886,
  11569,
  14878,
  11247,
  14859,
  10765,
  14828,
  10401,
  14784,
  10011,
  14727,
  9600,
  14660,
  9289,
  14586,
  8893,
  14508,
  8533,
  15111,
  12234,
  15110,
  12234,
  15104,
  12216,
  15092,
  12156,
  15067,
  12010,
  15028,
  11776,
  14981,
  11500,
  14942,
  11205,
  14902,
  10752,
  14861,
  10393,
  14812,
  9991,
  14752,
  9570,
  14682,
  9252,
  14603,
  8808,
  14519,
  8445,
  14431,
  8145,
  15209,
  11449,
  15208,
  11451,
  15202,
  11451,
  15190,
  11438,
  15163,
  11384,
  15117,
  11274,
  15055,
  10979,
  14994,
  10648,
  14932,
  10343,
  14871,
  9936,
  14803,
  9532,
  14729,
  9218,
  14645,
  8742,
  14556,
  8381,
  14461,
  8020,
  14365,
  7603,
  15273,
  10603,
  15272,
  10607,
  15267,
  10619,
  15256,
  10631,
  15231,
  10614,
  15182,
  10535,
  15118,
  10389,
  15042,
  10167,
  14963,
  9787,
  14883,
  9447,
  14800,
  9115,
  14710,
  8665,
  14615,
  8318,
  14514,
  7911,
  14411,
  7507,
  14279,
  7198,
  15314,
  9675,
  15313,
  9683,
  15309,
  9712,
  15298,
  9759,
  15277,
  9797,
  15229,
  9773,
  15166,
  9668,
  15084,
  9487,
  14995,
  9274,
  14898,
  8910,
  14800,
  8539,
  14697,
  8234,
  14590,
  7790,
  14479,
  7409,
  14367,
  7067,
  14178,
  6621,
  15337,
  8619,
  15337,
  8631,
  15333,
  8677,
  15325,
  8769,
  15305,
  8871,
  15264,
  8940,
  15202,
  8909,
  15119,
  8775,
  15022,
  8565,
  14916,
  8328,
  14804,
  8009,
  14688,
  7614,
  14569,
  7287,
  14448,
  6888,
  14321,
  6483,
  14088,
  6171,
  15350,
  7402,
  15350,
  7419,
  15347,
  7480,
  15340,
  7613,
  15322,
  7804,
  15287,
  7973,
  15229,
  8057,
  15148,
  8012,
  15046,
  7846,
  14933,
  7611,
  14810,
  7357,
  14682,
  7069,
  14552,
  6656,
  14421,
  6316,
  14251,
  5948,
  14007,
  5528,
  15356,
  5942,
  15356,
  5977,
  15353,
  6119,
  15348,
  6294,
  15332,
  6551,
  15302,
  6824,
  15249,
  7044,
  15171,
  7122,
  15070,
  7050,
  14949,
  6861,
  14818,
  6611,
  14679,
  6349,
  14538,
  6067,
  14398,
  5651,
  14189,
  5311,
  13935,
  4958,
  15359,
  4123,
  15359,
  4153,
  15356,
  4296,
  15353,
  4646,
  15338,
  5160,
  15311,
  5508,
  15263,
  5829,
  15188,
  6042,
  15088,
  6094,
  14966,
  6001,
  14826,
  5796,
  14678,
  5543,
  14527,
  5287,
  14377,
  4985,
  14133,
  4586,
  13869,
  4257,
  15360,
  1563,
  15360,
  1642,
  15358,
  2076,
  15354,
  2636,
  15341,
  3350,
  15317,
  4019,
  15273,
  4429,
  15203,
  4732,
  15105,
  4911,
  14981,
  4932,
  14836,
  4818,
  14679,
  4621,
  14517,
  4386,
  14359,
  4156,
  14083,
  3795,
  13808,
  3437,
  15360,
  122,
  15360,
  137,
  15358,
  285,
  15355,
  636,
  15344,
  1274,
  15322,
  2177,
  15281,
  2765,
  15215,
  3223,
  15120,
  3451,
  14995,
  3569,
  14846,
  3567,
  14681,
  3466,
  14511,
  3305,
  14344,
  3121,
  14037,
  2800,
  13753,
  2467,
  15360,
  0,
  15360,
  1,
  15359,
  21,
  15355,
  89,
  15346,
  253,
  15325,
  479,
  15287,
  796,
  15225,
  1148,
  15133,
  1492,
  15008,
  1749,
  14856,
  1882,
  14685,
  1886,
  14506,
  1783,
  14324,
  1608,
  13996,
  1398,
  13702,
  1183
]);
let vn = null;
function dC() {
  return vn === null && (vn = new ol(cC, 16, 16, xi, On), vn.name = "DFG_LUT", vn.minFilter = Mt, vn.magFilter = Mt, vn.wrapS = Mn, vn.wrapT = Mn, vn.generateMipmaps = !1, vn.needsUpdate = !0), vn;
}
class hC {

  constructor(e = {}) {
    const {
      canvas: t = Zu(),
      context: n = null,
      depth: s = !0,
      stencil: a = !1,
      alpha: r = !1,
      antialias: o = !1,
      premultipliedAlpha: l = !0,
      preserveDrawingBuffer: c = !1,
      powerPreference: d = "default",
      failIfMajorPerformanceCaveat: u = !1,
      reversedDepthBuffer: h = !1,
      outputBufferType: g = en
    } = e;
    this.isWebGLRenderer = !0;
    let m;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      m = n.getContextAttributes().alpha;
    } else
      m = r;
    const A = g, f = /* @__PURE__ */ new Set([
      tl,
      el,
      $o
    ]), p = /* @__PURE__ */ new Set([
      en,
      Bn,
      Fs,
      Ws,
      jo,
      Qo
    ]), b = new Uint32Array(4), v = new Int32Array(4), S = new N();
    let R = null, x = null;
    const G = [], C = [];
    let w = null;
    this.domElement = t, this.debug = {

      checkShaderErrors: !0,

      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = Tn, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
    const T = this;
    let M = !1, Z = null;
    this._outputColorSpace = wt;
    let U = 0, H = 0, F = null, L = -1, P = null;
    const j = new rt(), $ = new rt();
    let ce = null;
    const Ce = new Me(0);
    let xe = 0, Je = t.width, et = t.height, We = 1, K = null, ue = null;
    const ie = new rt(0, 0, Je, et), Re = new rt(0, 0, Je, et);
    let Be = !1;
    const Ge = new cl();
    let ut = !1, Ye = !1;
    const tt = new Ue(), ct = new N(), He = new rt(), xt = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let gt = !1;
    function Kt() {
      return F === null ? We : 1;
    }
    let E = n;
    function _t(y, W) {
      return t.getContext(y, W);
    }
    try {
      const y = {
        alpha: !0,
        depth: s,
        stencil: a,
        antialias: o,
        premultipliedAlpha: l,
        preserveDrawingBuffer: c,
        powerPreference: d,
        failIfMajorPerformanceCaveat: u
      };
      if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Jo}`), t.addEventListener("webglcontextlost", Q, !1), t.addEventListener("webglcontextrestored", ye, !1), t.addEventListener("webglcontextcreationerror", Ee, !1), E === null) {
        const W = "webgl2";
        if (E = _t(W, y), E === null)
          throw _t(W) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (y) {
      throw we("WebGLRenderer: " + y.message), y;
    }
    let ze, ot, oe, ft, _, I, V, O, q, ee, re, Y, J, ge, me, se, te, Ze, Ve, je, B, ne, z;
    function pe() {
      ze = new dI(E), ze.init(), B = new tC(E, ze), ot = new nI(E, ze, e, B), oe = new $0(E, ze), ot.reversedDepthBuffer && h && oe.buffers.depth.setReversed(!0), ft = new gI(E), _ = new U0(), I = new eC(E, ze, oe, _, ot, B, ft), V = new cI(T), O = new mp(E), ne = new eI(E, O), q = new hI(E, O, ft, ne), ee = new fI(E, q, O, ne, ft), Ze = new pI(E, ot, I), me = new iI(_), re = new L0(T, V, ze, ot, ne, me), Y = new oC(T, _), J = new X0(), ge = new O0(ze), te = new $m(T, V, oe, ee, m, l), se = new q0(T, ee, ot), z = new lC(E, ft, ot, oe), Ve = new tI(E, ze, ft), je = new uI(E, ze, ft), ft.programs = re.programs, T.capabilities = ot, T.extensions = ze, T.properties = _, T.renderLists = J, T.shadowMap = se, T.state = oe, T.info = ft;
    }
    pe(), A !== en && (w = new II(A, t.width, t.height, s, a));
    const ae = new aC(T, E);
    this.xr = ae, this.getContext = function() {
      return E;
    }, this.getContextAttributes = function() {
      return E.getContextAttributes();
    }, this.forceContextLoss = function() {
      const y = ze.get("WEBGL_lose_context");
      y && y.loseContext();
    }, this.forceContextRestore = function() {
      const y = ze.get("WEBGL_lose_context");
      y && y.restoreContext();
    }, this.getPixelRatio = function() {
      return We;
    }, this.setPixelRatio = function(y) {
      y !== void 0 && (We = y, this.setSize(Je, et, !1));
    }, this.getSize = function(y) {
      return y.set(Je, et);
    }, this.setSize = function(y, W, k = !0) {
      if (ae.isPresenting) {
        Ae("WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      Je = y, et = W, t.width = Math.floor(y * We), t.height = Math.floor(W * We), k === !0 && (t.style.width = y + "px", t.style.height = W + "px"), w !== null && w.setSize(t.width, t.height), this.setViewport(0, 0, y, W);
    }, this.getDrawingBufferSize = function(y) {
      return y.set(Je * We, et * We).floor();
    }, this.setDrawingBufferSize = function(y, W, k) {
      Je = y, et = W, We = k, t.width = Math.floor(y * k), t.height = Math.floor(W * k), this.setViewport(0, 0, y, W);
    }, this.setEffects = function(y) {
      if (A === en) {
        we("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
        return;
      }
      if (y) {
        for (let W = 0; W < y.length; W++)
          if (y[W].isOutputPass === !0) {
            Ae("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
            break;
          }
      }
      w.setEffects(y || []);
    }, this.getCurrentViewport = function(y) {
      return y.copy(j);
    }, this.getViewport = function(y) {
      return y.copy(ie);
    }, this.setViewport = function(y, W, k, D) {
      y.isVector4 ? ie.set(y.x, y.y, y.z, y.w) : ie.set(y, W, k, D), oe.viewport(j.copy(ie).multiplyScalar(We).round());
    }, this.getScissor = function(y) {
      return y.copy(Re);
    }, this.setScissor = function(y, W, k, D) {
      y.isVector4 ? Re.set(y.x, y.y, y.z, y.w) : Re.set(y, W, k, D), oe.scissor($.copy(Re).multiplyScalar(We).round());
    }, this.getScissorTest = function() {
      return Be;
    }, this.setScissorTest = function(y) {
      oe.setScissorTest(Be = y);
    }, this.setOpaqueSort = function(y) {
      K = y;
    }, this.setTransparentSort = function(y) {
      ue = y;
    }, this.getClearColor = function(y) {
      return y.copy(te.getClearColor());
    }, this.setClearColor = function() {
      te.setClearColor(...arguments);
    }, this.getClearAlpha = function() {
      return te.getClearAlpha();
    }, this.setClearAlpha = function() {
      te.setClearAlpha(...arguments);
    }, this.clear = function(y = !0, W = !0, k = !0) {
      let D = 0;
      if (y) {
        let X = !1;
        if (F !== null) {
          const he = F.texture.format;
          X = f.has(he);
        }
        if (X) {
          const he = F.texture.type, Ie = p.has(he), de = te.getClearColor(), be = te.getClearAlpha(), Se = de.r, Fe = de.g, De = de.b;
          Ie ? (b[0] = Se, b[1] = Fe, b[2] = De, b[3] = be, E.clearBufferuiv(E.COLOR, 0, b)) : (v[0] = Se, v[1] = Fe, v[2] = De, v[3] = be, E.clearBufferiv(E.COLOR, 0, v));
        } else
          D |= E.COLOR_BUFFER_BIT;
      }
      W && (D |= E.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), k && (D |= E.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), D !== 0 && E.clear(D);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.setNodesHandler = function(y) {
      y.setRenderer(this), Z = y;
    }, this.dispose = function() {
      t.removeEventListener("webglcontextlost", Q, !1), t.removeEventListener("webglcontextrestored", ye, !1), t.removeEventListener("webglcontextcreationerror", Ee, !1), te.dispose(), J.dispose(), ge.dispose(), _.dispose(), V.dispose(), ee.dispose(), ne.dispose(), z.dispose(), re.dispose(), ae.dispose(), ae.removeEventListener("sessionstart", vl), ae.removeEventListener("sessionend", xl), gi.stop();
    };
    function Q(y) {
      y.preventDefault(), La("WebGLRenderer: Context Lost."), M = !0;
    }
    function ye() {
      La("WebGLRenderer: Context Restored."), M = !1;
      const y = ft.autoReset, W = se.enabled, k = se.autoUpdate, D = se.needsUpdate, X = se.type;
      pe(), ft.autoReset = y, se.enabled = W, se.autoUpdate = k, se.needsUpdate = D, se.type = X;
    }
    function Ee(y) {
      we("WebGLRenderer: A WebGL context could not be created. Reason: ", y.statusMessage);
    }
    function It(y) {
      const W = y.target;
      W.removeEventListener("dispose", It), nt(W);
    }
    function nt(y) {
      Fn(y), _.remove(y);
    }
    function Fn(y) {
      const W = _.get(y).programs;
      W !== void 0 && (W.forEach(function(k) {
        re.releaseProgram(k);
      }), y.isShaderMaterial && re.releaseShaderCache(y));
    }
    this.renderBufferDirect = function(y, W, k, D, X, he) {
      W === null && (W = xt);
      const Ie = X.isMesh && X.matrixWorld.determinant() < 0, de = vh(y, W, k, D, X);
      oe.setMaterial(D, Ie);
      let be = k.index, Se = 1;
      if (D.wireframe === !0) {
        if (be = q.getWireframeAttribute(k), be === void 0) return;
        Se = 2;
      }
      const Fe = k.drawRange, De = k.attributes.position;
      let _e = Fe.start * Se, it = (Fe.start + Fe.count) * Se;
      he !== null && (_e = Math.max(_e, he.start * Se), it = Math.min(it, (he.start + he.count) * Se)), be !== null ? (_e = Math.max(_e, 0), it = Math.min(it, be.count)) : De != null && (_e = Math.max(_e, 0), it = Math.min(it, De.count));
      const Ct = it - _e;
      if (Ct < 0 || Ct === 1 / 0) return;
      ne.setup(X, D, de, k, be);
      let mt, st = Ve;
      if (be !== null && (mt = O.get(be), st = je, st.setIndex(mt)), X.isMesh)
        D.wireframe === !0 ? (oe.setLineWidth(D.wireframeLinewidth * Kt()), st.setMode(E.LINES)) : st.setMode(E.TRIANGLES);
      else if (X.isLine) {
        let Vt = D.linewidth;
        Vt === void 0 && (Vt = 1), oe.setLineWidth(Vt * Kt()), X.isLineSegments ? st.setMode(E.LINES) : X.isLineLoop ? st.setMode(E.LINE_LOOP) : st.setMode(E.LINE_STRIP);
      } else X.isPoints ? st.setMode(E.POINTS) : X.isSprite && st.setMode(E.TRIANGLES);
      if (X.isBatchedMesh)
        if (ze.get("WEBGL_multi_draw"))
          st.renderMultiDraw(X._multiDrawStarts, X._multiDrawCounts, X._multiDrawCount);
        else {
          const Vt = X._multiDrawStarts, fe = X._multiDrawCounts, jt = X._multiDrawCount, Ke = be ? O.get(be).bytesPerElement : 1, nn = _.get(D).currentProgram.getUniforms();
          for (let An = 0; An < jt; An++)
            nn.setValue(E, "_gl_DrawID", An), st.render(Vt[An] / Ke, fe[An]);
        }
      else if (X.isInstancedMesh)
        st.renderInstances(_e, Ct, X.count);
      else if (k.isInstancedBufferGeometry) {
        const Vt = k._maxInstanceCount !== void 0 ? k._maxInstanceCount : 1 / 0, fe = Math.min(k.instanceCount, Vt);
        st.renderInstances(_e, Ct, fe);
      } else
        st.render(_e, Ct);
    };
    function bn(y, W, k) {
      y.transparent === !0 && y.side === Rn && y.forceSinglePass === !1 ? (y.side = Jt, y.needsUpdate = !0, ks(y, W, k), y.side = zn, y.needsUpdate = !0, ks(y, W, k), y.side = Rn) : ks(y, W, k);
    }
    this.compile = function(y, W, k = null) {
      k === null && (k = y), x = ge.get(k), x.init(W), C.push(x), k.traverseVisible(function(X) {
        X.isLight && X.layers.test(W.layers) && (x.pushLight(X), X.castShadow && x.pushShadow(X));
      }), y !== k && y.traverseVisible(function(X) {
        X.isLight && X.layers.test(W.layers) && (x.pushLight(X), X.castShadow && x.pushShadow(X));
      }), x.setupLights();
      const D = /* @__PURE__ */ new Set();
      return y.traverse(function(X) {
        if (!(X.isMesh || X.isPoints || X.isLine || X.isSprite))
          return;
        const he = X.material;
        if (he)
          if (Array.isArray(he))
            for (let Ie = 0; Ie < he.length; Ie++) {
              const de = he[Ie];
              bn(de, k, X), D.add(de);
            }
          else
            bn(he, k, X), D.add(he);
      }), x = C.pop(), D;
    }, this.compileAsync = function(y, W, k = null) {
      const D = this.compile(y, W, k);
      return new Promise((X) => {
        function he() {
          if (D.forEach(function(Ie) {
            _.get(Ie).currentProgram.isReady() && D.delete(Ie);
          }), D.size === 0) {
            X(y);
            return;
          }
          setTimeout(he, 10);
        }
        ze.get("KHR_parallel_shader_compile") !== null ? he() : setTimeout(he, 10);
      });
    };
    let er = null;
    function yh(y) {
      er && er(y);
    }
    function vl() {
      gi.stop();
    }
    function xl() {
      gi.start();
    }
    const gi = new lh();
    gi.setAnimationLoop(yh), typeof self < "u" && gi.setContext(self), this.setAnimationLoop = function(y) {
      er = y, ae.setAnimationLoop(y), y === null ? gi.stop() : gi.start();
    }, ae.addEventListener("sessionstart", vl), ae.addEventListener("sessionend", xl), this.render = function(y, W) {
      if (W !== void 0 && W.isCamera !== !0) {
        we("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (M === !0) return;
      Z !== null && Z.renderStart(y, W);
      const k = ae.enabled === !0 && ae.isPresenting === !0, D = w !== null && (F === null || k) && w.begin(T, F);
      if (y.matrixWorldAutoUpdate === !0 && y.updateMatrixWorld(), W.parent === null && W.matrixWorldAutoUpdate === !0 && W.updateMatrixWorld(), ae.enabled === !0 && ae.isPresenting === !0 && (w === null || w.isCompositing() === !1) && (ae.cameraAutoUpdate === !0 && ae.updateCamera(W), W = ae.getCamera()), y.isScene === !0 && y.onBeforeRender(T, y, W, F), x = ge.get(y, C.length), x.init(W), x.state.textureUnits = I.getTextureUnits(), C.push(x), tt.multiplyMatrices(W.projectionMatrix, W.matrixWorldInverse), Ge.setFromProjectionMatrix(tt, Gn, W.reversedDepth), Ye = this.localClippingEnabled, ut = me.init(this.clippingPlanes, Ye), R = J.get(y, G.length), R.init(), G.push(R), ae.enabled === !0 && ae.isPresenting === !0) {
        const Ie = T.xr.getDepthSensingMesh();
        Ie !== null && tr(Ie, W, -1 / 0, T.sortObjects);
      }
      tr(y, W, 0, T.sortObjects), R.finish(), T.sortObjects === !0 && R.sort(K, ue), gt = ae.enabled === !1 || ae.isPresenting === !1 || ae.hasDepthSensing() === !1, gt && te.addToRenderList(R, y), this.info.render.frame++, ut === !0 && me.beginShadows();
      const X = x.state.shadowsArray;
      if (se.render(X, y, W), ut === !0 && me.endShadows(), this.info.autoReset === !0 && this.info.reset(), (D && w.hasRenderPass()) === !1) {
        const Ie = R.opaque, de = R.transmissive;
        if (x.setupLights(), W.isArrayCamera) {
          const be = W.cameras;
          if (de.length > 0)
            for (let Se = 0, Fe = be.length; Se < Fe; Se++) {
              const De = be[Se];
              wl(Ie, de, y, De);
            }
          gt && te.render(y);
          for (let Se = 0, Fe = be.length; Se < Fe; Se++) {
            const De = be[Se];
            _l(R, y, De, De.viewport);
          }
        } else
          de.length > 0 && wl(Ie, de, y, W), gt && te.render(y), _l(R, y, W);
      }
      F !== null && H === 0 && (I.updateMultisampleRenderTarget(F), I.updateRenderTargetMipmap(F)), D && w.end(T), y.isScene === !0 && y.onAfterRender(T, y, W), ne.resetDefaultState(), L = -1, P = null, C.pop(), C.length > 0 ? (x = C[C.length - 1], I.setTextureUnits(x.state.textureUnits), ut === !0 && me.setGlobalState(T.clippingPlanes, x.state.camera)) : x = null, G.pop(), G.length > 0 ? R = G[G.length - 1] : R = null, Z !== null && Z.renderEnd();
    };
    function tr(y, W, k, D) {
      if (y.visible === !1) return;
      if (y.layers.test(W.layers)) {
        if (y.isGroup)
          k = y.renderOrder;
        else if (y.isLOD)
          y.autoUpdate === !0 && y.update(W);
        else if (y.isLightProbeGrid)
          x.pushLightProbeGrid(y);
        else if (y.isLight)
          x.pushLight(y), y.castShadow && x.pushShadow(y);
        else if (y.isSprite) {
          if (!y.frustumCulled || Ge.intersectsSprite(y)) {
            D && He.setFromMatrixPosition(y.matrixWorld).applyMatrix4(tt);
            const Ie = ee.update(y), de = y.material;
            de.visible && R.push(y, Ie, de, k, He.z, null);
          }
        } else if ((y.isMesh || y.isLine || y.isPoints) && (!y.frustumCulled || Ge.intersectsObject(y))) {
          const Ie = ee.update(y), de = y.material;
          if (D && (y.boundingSphere !== void 0 ? (y.boundingSphere === null && y.computeBoundingSphere(), He.copy(y.boundingSphere.center)) : (Ie.boundingSphere === null && Ie.computeBoundingSphere(), He.copy(Ie.boundingSphere.center)), He.applyMatrix4(y.matrixWorld).applyMatrix4(tt)), Array.isArray(de)) {
            const be = Ie.groups;
            for (let Se = 0, Fe = be.length; Se < Fe; Se++) {
              const De = be[Se], _e = de[De.materialIndex];
              _e && _e.visible && R.push(y, Ie, _e, k, He.z, De);
            }
          } else de.visible && R.push(y, Ie, de, k, He.z, null);
        }
      }
      const he = y.children;
      for (let Ie = 0, de = he.length; Ie < de; Ie++)
        tr(he[Ie], W, k, D);
    }
    function _l(y, W, k, D) {
      const { opaque: X, transmissive: he, transparent: Ie } = y;
      x.setupLightsView(k), ut === !0 && me.setGlobalState(T.clippingPlanes, k), D && oe.viewport(j.copy(D)), X.length > 0 && Ps(X, W, k), he.length > 0 && Ps(he, W, k), Ie.length > 0 && Ps(Ie, W, k), oe.buffers.depth.setTest(!0), oe.buffers.depth.setMask(!0), oe.buffers.color.setMask(!0), oe.setPolygonOffset(!1);
    }
    function wl(y, W, k, D) {
      if ((k.isScene === !0 ? k.overrideMaterial : null) !== null)
        return;
      if (x.state.transmissionRenderTarget[D.id] === void 0) {
        const _e = ze.has("EXT_color_buffer_half_float") || ze.has("EXT_color_buffer_float");
        x.state.transmissionRenderTarget[D.id] = new Zn(1, 1, {
          generateMipmaps: !0,
          type: _e ? On : en,
          minFilter: Hn,
          samples: Math.max(4, ot.samples),
          // to avoid feedback loops, the transmission render target requires a resolve, see #26177
          stencilBuffer: a,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: Pe.workingColorSpace
        });
      }
      const he = x.state.transmissionRenderTarget[D.id], Ie = D.viewport || j;
      he.setSize(Ie.z * T.transmissionResolutionScale, Ie.w * T.transmissionResolutionScale);
      const de = T.getRenderTarget(), be = T.getActiveCubeFace(), Se = T.getActiveMipmapLevel();
      T.setRenderTarget(he), T.getClearColor(Ce), xe = T.getClearAlpha(), xe < 1 && T.setClearColor(16777215, 0.5), T.clear(), gt && te.render(k);
      const Fe = T.toneMapping;
      T.toneMapping = Tn;
      const De = D.viewport;
      if (D.viewport !== void 0 && (D.viewport = void 0), x.setupLightsView(D), ut === !0 && me.setGlobalState(T.clippingPlanes, D), Ps(y, k, D), I.updateMultisampleRenderTarget(he), I.updateRenderTargetMipmap(he), ze.has("WEBGL_multisampled_render_to_texture") === !1) {
        let _e = !1;
        for (let it = 0, Ct = W.length; it < Ct; it++) {
          const mt = W[it], { object: st, geometry: Vt, material: fe, group: jt } = mt;
          if (fe.side === Rn && st.layers.test(D.layers)) {
            const Ke = fe.side;
            fe.side = Jt, fe.needsUpdate = !0, Rl(st, k, D, Vt, fe, jt), fe.side = Ke, fe.needsUpdate = !0, _e = !0;
          }
        }
        _e === !0 && (I.updateMultisampleRenderTarget(he), I.updateRenderTargetMipmap(he));
      }
      T.setRenderTarget(de, be, Se), T.setClearColor(Ce, xe), De !== void 0 && (D.viewport = De), T.toneMapping = Fe;
    }
    function Ps(y, W, k) {
      const D = W.isScene === !0 ? W.overrideMaterial : null;
      for (let X = 0, he = y.length; X < he; X++) {
        const Ie = y[X], { object: de, geometry: be, group: Se } = Ie;
        let Fe = Ie.material;
        Fe.allowOverride === !0 && D !== null && (Fe = D), de.layers.test(k.layers) && Rl(de, W, k, be, Fe, Se);
      }
    }
    function Rl(y, W, k, D, X, he) {
      y.onBeforeRender(T, W, k, D, X, he), y.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse, y.matrixWorld), y.normalMatrix.getNormalMatrix(y.modelViewMatrix), X.onBeforeRender(T, W, k, D, y, he), X.transparent === !0 && X.side === Rn && X.forceSinglePass === !1 ? (X.side = Jt, X.needsUpdate = !0, T.renderBufferDirect(k, W, D, X, y, he), X.side = zn, X.needsUpdate = !0, T.renderBufferDirect(k, W, D, X, y, he), X.side = Rn) : T.renderBufferDirect(k, W, D, X, y, he), y.onAfterRender(T, W, k, D, X, he);
    }
    function ks(y, W, k) {
      W.isScene !== !0 && (W = xt);
      const D = _.get(y), X = x.state.lights, he = x.state.shadowsArray, Ie = X.state.version, de = re.getParameters(y, X.state, he, W, k, x.state.lightProbeGridArray), be = re.getProgramCacheKey(de);
      let Se = D.programs;
      D.environment = y.isMeshStandardMaterial || y.isMeshLambertMaterial || y.isMeshPhongMaterial ? W.environment : null, D.fog = W.fog;
      const Fe = y.isMeshStandardMaterial || y.isMeshLambertMaterial && !y.envMap || y.isMeshPhongMaterial && !y.envMap;
      D.envMap = V.get(y.envMap || D.environment, Fe), D.envMapRotation = D.environment !== null && y.envMap === null ? W.environmentRotation : y.envMapRotation, Se === void 0 && (y.addEventListener("dispose", It), Se = /* @__PURE__ */ new Map(), D.programs = Se);
      let De = Se.get(be);
      if (De !== void 0) {
        if (D.currentProgram === De && D.lightsStateVersion === Ie)
          return Gl(y, de), De;
      } else
        de.uniforms = re.getUniforms(y), Z !== null && y.isNodeMaterial && Z.build(y, k, de), y.onBeforeCompile(de, T), De = re.acquireProgram(de, be), Se.set(be, De), D.uniforms = de.uniforms;
      const _e = D.uniforms;
      return (!y.isShaderMaterial && !y.isRawShaderMaterial || y.clipping === !0) && (_e.clippingPlanes = me.uniform), Gl(y, de), D.needsLights = _h(y), D.lightsStateVersion = Ie, D.needsLights && (_e.ambientLightColor.value = X.state.ambient, _e.lightProbe.value = X.state.probe, _e.directionalLights.value = X.state.directional, _e.directionalLightShadows.value = X.state.directionalShadow, _e.spotLights.value = X.state.spot, _e.spotLightShadows.value = X.state.spotShadow, _e.rectAreaLights.value = X.state.rectArea, _e.ltc_1.value = X.state.rectAreaLTC1, _e.ltc_2.value = X.state.rectAreaLTC2, _e.pointLights.value = X.state.point, _e.pointLightShadows.value = X.state.pointShadow, _e.hemisphereLights.value = X.state.hemi, _e.directionalShadowMatrix.value = X.state.directionalShadowMatrix, _e.spotLightMatrix.value = X.state.spotLightMatrix, _e.spotLightMap.value = X.state.spotLightMap, _e.pointShadowMatrix.value = X.state.pointShadowMatrix), D.lightProbeGrid = x.state.lightProbeGridArray.length > 0, D.currentProgram = De, D.uniformsList = null, De;
    }
    function Ml(y) {
      if (y.uniformsList === null) {
        const W = y.currentProgram.getUniforms();
        y.uniformsList = Ba.seqWithValue(W.seq, y.uniforms);
      }
      return y.uniformsList;
    }
    function Gl(y, W) {
      const k = _.get(y);
      k.outputColorSpace = W.outputColorSpace, k.batching = W.batching, k.batchingColor = W.batchingColor, k.instancing = W.instancing, k.instancingColor = W.instancingColor, k.instancingMorph = W.instancingMorph, k.skinning = W.skinning, k.morphTargets = W.morphTargets, k.morphNormals = W.morphNormals, k.morphColors = W.morphColors, k.morphTargetsCount = W.morphTargetsCount, k.numClippingPlanes = W.numClippingPlanes, k.numIntersection = W.numClipIntersection, k.vertexAlphas = W.vertexAlphas, k.vertexTangents = W.vertexTangents, k.toneMapping = W.toneMapping;
    }
    function Sh(y, W) {
      if (y.length === 0) return null;
      if (y.length === 1)
        return y[0].texture !== null ? y[0] : null;
      S.setFromMatrixPosition(W.matrixWorld);
      for (let k = 0, D = y.length; k < D; k++) {
        const X = y[k];
        if (X.texture !== null && X.boundingBox.containsPoint(S)) return X;
      }
      return null;
    }
    function vh(y, W, k, D, X) {
      W.isScene !== !0 && (W = xt), I.resetTextureUnits();
      const he = W.fog, Ie = D.isMeshStandardMaterial || D.isMeshLambertMaterial || D.isMeshPhongMaterial ? W.environment : null, de = F === null ? T.outputColorSpace : F.isXRRenderTarget === !0 ? F.texture.colorSpace : Pe.workingColorSpace, be = D.isMeshStandardMaterial || D.isMeshLambertMaterial && !D.envMap || D.isMeshPhongMaterial && !D.envMap, Se = V.get(D.envMap || Ie, be), Fe = D.vertexColors === !0 && !!k.attributes.color && k.attributes.color.itemSize === 4, De = !!k.attributes.tangent && (!!D.normalMap || D.anisotropy > 0), _e = !!k.morphAttributes.position, it = !!k.morphAttributes.normal, Ct = !!k.morphAttributes.color;
      let mt = Tn;
      D.toneMapped && (F === null || F.isXRRenderTarget === !0) && (mt = T.toneMapping);
      const st = k.morphAttributes.position || k.morphAttributes.normal || k.morphAttributes.color, Vt = st !== void 0 ? st.length : 0, fe = _.get(D), jt = x.state.lights;
      if (ut === !0 && (Ye === !0 || y !== P)) {
        const lt = y === P && D.id === L;
        me.setState(D, y, lt);
      }
      let Ke = !1;
      D.version === fe.__version ? (fe.needsLights && fe.lightsStateVersion !== jt.state.version || fe.outputColorSpace !== de || X.isBatchedMesh && fe.batching === !1 || !X.isBatchedMesh && fe.batching === !0 || X.isBatchedMesh && fe.batchingColor === !0 && X.colorTexture === null || X.isBatchedMesh && fe.batchingColor === !1 && X.colorTexture !== null || X.isInstancedMesh && fe.instancing === !1 || !X.isInstancedMesh && fe.instancing === !0 || X.isSkinnedMesh && fe.skinning === !1 || !X.isSkinnedMesh && fe.skinning === !0 || X.isInstancedMesh && fe.instancingColor === !0 && X.instanceColor === null || X.isInstancedMesh && fe.instancingColor === !1 && X.instanceColor !== null || X.isInstancedMesh && fe.instancingMorph === !0 && X.morphTexture === null || X.isInstancedMesh && fe.instancingMorph === !1 && X.morphTexture !== null || fe.envMap !== Se || D.fog === !0 && fe.fog !== he || fe.numClippingPlanes !== void 0 && (fe.numClippingPlanes !== me.numPlanes || fe.numIntersection !== me.numIntersection) || fe.vertexAlphas !== Fe || fe.vertexTangents !== De || fe.morphTargets !== _e || fe.morphNormals !== it || fe.morphColors !== Ct || fe.toneMapping !== mt || fe.morphTargetsCount !== Vt || !!fe.lightProbeGrid != x.state.lightProbeGridArray.length > 0) && (Ke = !0) : (Ke = !0, fe.__version = D.version);
      let nn = fe.currentProgram;
      Ke === !0 && (nn = ks(D, W, X), Z && D.isNodeMaterial && Z.onUpdateProgram(D, nn, fe));
      let An = !1, qn = !1, wi = !1;
      const at = nn.getUniforms(), bt = fe.uniforms;
      if (oe.useProgram(nn.program) && (An = !0, qn = !0, wi = !0), D.id !== L && (L = D.id, qn = !0), fe.needsLights) {
        const lt = Sh(x.state.lightProbeGridArray, X);
        fe.lightProbeGrid !== lt && (fe.lightProbeGrid = lt, qn = !0);
      }
      if (An || P !== y) {
        oe.buffers.depth.getReversed() && y.reversedDepth !== !0 && (y._reversedDepth = !0, y.updateProjectionMatrix()), at.setValue(E, "projectionMatrix", y.projectionMatrix), at.setValue(E, "viewMatrix", y.matrixWorldInverse);
        const ei = at.map.cameraPosition;
        ei !== void 0 && ei.setValue(E, ct.setFromMatrixPosition(y.matrixWorld)), ot.logarithmicDepthBuffer && at.setValue(
          E,
          "logDepthBufFC",
          2 / (Math.log(y.far + 1) / Math.LN2)
        ), (D.isMeshPhongMaterial || D.isMeshToonMaterial || D.isMeshLambertMaterial || D.isMeshBasicMaterial || D.isMeshStandardMaterial || D.isShaderMaterial) && at.setValue(E, "isOrthographic", y.isOrthographicCamera === !0), P !== y && (P = y, qn = !0, wi = !0);
      }
      if (fe.needsLights && (jt.state.directionalShadowMap.length > 0 && at.setValue(E, "directionalShadowMap", jt.state.directionalShadowMap, I), jt.state.spotShadowMap.length > 0 && at.setValue(E, "spotShadowMap", jt.state.spotShadowMap, I), jt.state.pointShadowMap.length > 0 && at.setValue(E, "pointShadowMap", jt.state.pointShadowMap, I)), X.isSkinnedMesh) {
        at.setOptional(E, X, "bindMatrix"), at.setOptional(E, X, "bindMatrixInverse");
        const lt = X.skeleton;
        lt && (lt.boneTexture === null && lt.computeBoneTexture(), at.setValue(E, "boneTexture", lt.boneTexture, I));
      }
      X.isBatchedMesh && (at.setOptional(E, X, "batchingTexture"), at.setValue(E, "batchingTexture", X._matricesTexture, I), at.setOptional(E, X, "batchingIdTexture"), at.setValue(E, "batchingIdTexture", X._indirectTexture, I), at.setOptional(E, X, "batchingColorTexture"), X._colorsTexture !== null && at.setValue(E, "batchingColorTexture", X._colorsTexture, I));
      const $n = k.morphAttributes;
      if (($n.position !== void 0 || $n.normal !== void 0 || $n.color !== void 0) && Ze.update(X, k, nn), (qn || fe.receiveShadow !== X.receiveShadow) && (fe.receiveShadow = X.receiveShadow, at.setValue(E, "receiveShadow", X.receiveShadow)), (D.isMeshStandardMaterial || D.isMeshLambertMaterial || D.isMeshPhongMaterial) && D.envMap === null && W.environment !== null && (bt.envMapIntensity.value = W.environmentIntensity), bt.dfgLUT !== void 0 && (bt.dfgLUT.value = dC()), qn) {
        if (at.setValue(E, "toneMappingExposure", T.toneMappingExposure), fe.needsLights && xh(bt, wi), he && D.fog === !0 && Y.refreshFogUniforms(bt, he), Y.refreshMaterialUniforms(bt, D, We, et, x.state.transmissionRenderTarget[y.id]), fe.needsLights && fe.lightProbeGrid) {
          const lt = fe.lightProbeGrid;
          bt.probesSH.value = lt.texture, bt.probesMin.value.copy(lt.boundingBox.min), bt.probesMax.value.copy(lt.boundingBox.max), bt.probesResolution.value.copy(lt.resolution);
        }
        Ba.upload(E, Ml(fe), bt, I);
      }
      if (D.isShaderMaterial && D.uniformsNeedUpdate === !0 && (Ba.upload(E, Ml(fe), bt, I), D.uniformsNeedUpdate = !1), D.isSpriteMaterial && at.setValue(E, "center", X.center), at.setValue(E, "modelViewMatrix", X.modelViewMatrix), at.setValue(E, "normalMatrix", X.normalMatrix), at.setValue(E, "modelMatrix", X.matrixWorld), D.uniformsGroups !== void 0) {
        const lt = D.uniformsGroups;
        for (let ei = 0, Ri = lt.length; ei < Ri; ei++) {
          const Tl = lt[ei];
          z.update(Tl, nn), z.bind(Tl, nn);
        }
      }
      return nn;
    }
    function xh(y, W) {
      y.ambientLightColor.needsUpdate = W, y.lightProbe.needsUpdate = W, y.directionalLights.needsUpdate = W, y.directionalLightShadows.needsUpdate = W, y.pointLights.needsUpdate = W, y.pointLightShadows.needsUpdate = W, y.spotLights.needsUpdate = W, y.spotLightShadows.needsUpdate = W, y.rectAreaLights.needsUpdate = W, y.hemisphereLights.needsUpdate = W;
    }
    function _h(y) {
      return y.isMeshLambertMaterial || y.isMeshToonMaterial || y.isMeshPhongMaterial || y.isMeshStandardMaterial || y.isShadowMaterial || y.isShaderMaterial && y.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return U;
    }, this.getActiveMipmapLevel = function() {
      return H;
    }, this.getRenderTarget = function() {
      return F;
    }, this.setRenderTargetTextures = function(y, W, k) {
      const D = _.get(y);
      D.__autoAllocateDepthBuffer = y.resolveDepthBuffer === !1, D.__autoAllocateDepthBuffer === !1 && (D.__useRenderToTexture = !1), _.get(y.texture).__webglTexture = W, _.get(y.depthTexture).__webglTexture = D.__autoAllocateDepthBuffer ? void 0 : k, D.__hasExternalTextures = !0;
    }, this.setRenderTargetFramebuffer = function(y, W) {
      const k = _.get(y);
      k.__webglFramebuffer = W, k.__useDefaultFramebuffer = W === void 0;
    };
    const wh = E.createFramebuffer();
    this.setRenderTarget = function(y, W = 0, k = 0) {
      F = y, U = W, H = k;
      let D = null, X = !1, he = !1;
      if (y) {
        const de = _.get(y);
        if (de.__useDefaultFramebuffer !== void 0) {
          oe.bindFramebuffer(E.FRAMEBUFFER, de.__webglFramebuffer), j.copy(y.viewport), $.copy(y.scissor), ce = y.scissorTest, oe.viewport(j), oe.scissor($), oe.setScissorTest(ce), L = -1;
          return;
        } else if (de.__webglFramebuffer === void 0)
          I.setupRenderTarget(y);
        else if (de.__hasExternalTextures)
          I.rebindTextures(y, _.get(y.texture).__webglTexture, _.get(y.depthTexture).__webglTexture);
        else if (y.depthBuffer) {
          const Fe = y.depthTexture;
          if (de.__boundDepthTexture !== Fe) {
            if (Fe !== null && _.has(Fe) && (y.width !== Fe.image.width || y.height !== Fe.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            I.setupDepthRenderbuffer(y);
          }
        }
        const be = y.texture;
        (be.isData3DTexture || be.isDataArrayTexture || be.isCompressedArrayTexture) && (he = !0);
        const Se = _.get(y).__webglFramebuffer;
        y.isWebGLCubeRenderTarget ? (Array.isArray(Se[W]) ? D = Se[W][k] : D = Se[W], X = !0) : y.samples > 0 && I.useMultisampledRTT(y) === !1 ? D = _.get(y).__webglMultisampledFramebuffer : Array.isArray(Se) ? D = Se[k] : D = Se, j.copy(y.viewport), $.copy(y.scissor), ce = y.scissorTest;
      } else
        j.copy(ie).multiplyScalar(We).floor(), $.copy(Re).multiplyScalar(We).floor(), ce = Be;
      if (k !== 0 && (D = wh), oe.bindFramebuffer(E.FRAMEBUFFER, D) && oe.drawBuffers(y, D), oe.viewport(j), oe.scissor($), oe.setScissorTest(ce), X) {
        const de = _.get(y.texture);
        E.framebufferTexture2D(E.FRAMEBUFFER, E.COLOR_ATTACHMENT0, E.TEXTURE_CUBE_MAP_POSITIVE_X + W, de.__webglTexture, k);
      } else if (he) {
        const de = W;
        for (let be = 0; be < y.textures.length; be++) {
          const Se = _.get(y.textures[be]);
          E.framebufferTextureLayer(E.FRAMEBUFFER, E.COLOR_ATTACHMENT0 + be, Se.__webglTexture, k, de);
        }
      } else if (y !== null && k !== 0) {
        const de = _.get(y.texture);
        E.framebufferTexture2D(E.FRAMEBUFFER, E.COLOR_ATTACHMENT0, E.TEXTURE_2D, de.__webglTexture, k);
      }
      L = -1;
    }, this.readRenderTargetPixels = function(y, W, k, D, X, he, Ie, de = 0) {
      if (!(y && y.isWebGLRenderTarget)) {
        we("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let be = _.get(y).__webglFramebuffer;
      if (y.isWebGLCubeRenderTarget && Ie !== void 0 && (be = be[Ie]), be) {
        oe.bindFramebuffer(E.FRAMEBUFFER, be);
        try {
          const Se = y.textures[de], Fe = Se.format, De = Se.type;
          if (y.textures.length > 1 && E.readBuffer(E.COLOR_ATTACHMENT0 + de), !ot.textureFormatReadable(Fe)) {
            we("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!ot.textureTypeReadable(De)) {
            we("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          W >= 0 && W <= y.width - D && k >= 0 && k <= y.height - X && E.readPixels(W, k, D, X, B.convert(Fe), B.convert(De), he);
        } finally {
          const Se = F !== null ? _.get(F).__webglFramebuffer : null;
          oe.bindFramebuffer(E.FRAMEBUFFER, Se);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(y, W, k, D, X, he, Ie, de = 0) {
      if (!(y && y.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let be = _.get(y).__webglFramebuffer;
      if (y.isWebGLCubeRenderTarget && Ie !== void 0 && (be = be[Ie]), be)
        if (W >= 0 && W <= y.width - D && k >= 0 && k <= y.height - X) {
          oe.bindFramebuffer(E.FRAMEBUFFER, be);
          const Se = y.textures[de], Fe = Se.format, De = Se.type;
          if (y.textures.length > 1 && E.readBuffer(E.COLOR_ATTACHMENT0 + de), !ot.textureFormatReadable(Fe))
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
          if (!ot.textureTypeReadable(De))
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
          const _e = E.createBuffer();
          E.bindBuffer(E.PIXEL_PACK_BUFFER, _e), E.bufferData(E.PIXEL_PACK_BUFFER, he.byteLength, E.STREAM_READ), E.readPixels(W, k, D, X, B.convert(Fe), B.convert(De), 0);
          const it = F !== null ? _.get(F).__webglFramebuffer : null;
          oe.bindFramebuffer(E.FRAMEBUFFER, it);
          const Ct = E.fenceSync(E.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return E.flush(), await Bu(E, Ct, 4), E.bindBuffer(E.PIXEL_PACK_BUFFER, _e), E.getBufferSubData(E.PIXEL_PACK_BUFFER, 0, he), E.deleteBuffer(_e), E.deleteSync(Ct), he;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
    }, this.copyFramebufferToTexture = function(y, W = null, k = 0) {
      const D = Math.pow(2, -k), X = Math.floor(y.image.width * D), he = Math.floor(y.image.height * D), Ie = W !== null ? W.x : 0, de = W !== null ? W.y : 0;
      I.setTexture2D(y, 0), E.copyTexSubImage2D(E.TEXTURE_2D, k, 0, 0, Ie, de, X, he), oe.unbindTexture();
    };
    const Rh = E.createFramebuffer(), Mh = E.createFramebuffer();
    this.copyTextureToTexture = function(y, W, k = null, D = null, X = 0, he = 0) {
      let Ie, de, be, Se, Fe, De, _e, it, Ct;
      const mt = y.isCompressedTexture ? y.mipmaps[he] : y.image;
      if (k !== null)
        Ie = k.max.x - k.min.x, de = k.max.y - k.min.y, be = k.isBox3 ? k.max.z - k.min.z : 1, Se = k.min.x, Fe = k.min.y, De = k.isBox3 ? k.min.z : 0;
      else {
        const bt = Math.pow(2, -X);
        Ie = Math.floor(mt.width * bt), de = Math.floor(mt.height * bt), y.isDataArrayTexture ? be = mt.depth : y.isData3DTexture ? be = Math.floor(mt.depth * bt) : be = 1, Se = 0, Fe = 0, De = 0;
      }
      D !== null ? (_e = D.x, it = D.y, Ct = D.z) : (_e = 0, it = 0, Ct = 0);
      const st = B.convert(W.format), Vt = B.convert(W.type);
      let fe;
      W.isData3DTexture ? (I.setTexture3D(W, 0), fe = E.TEXTURE_3D) : W.isDataArrayTexture || W.isCompressedArrayTexture ? (I.setTexture2DArray(W, 0), fe = E.TEXTURE_2D_ARRAY) : (I.setTexture2D(W, 0), fe = E.TEXTURE_2D), oe.activeTexture(E.TEXTURE0), oe.pixelStorei(E.UNPACK_FLIP_Y_WEBGL, W.flipY), oe.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL, W.premultiplyAlpha), oe.pixelStorei(E.UNPACK_ALIGNMENT, W.unpackAlignment);
      const jt = oe.getParameter(E.UNPACK_ROW_LENGTH), Ke = oe.getParameter(E.UNPACK_IMAGE_HEIGHT), nn = oe.getParameter(E.UNPACK_SKIP_PIXELS), An = oe.getParameter(E.UNPACK_SKIP_ROWS), qn = oe.getParameter(E.UNPACK_SKIP_IMAGES);
      oe.pixelStorei(E.UNPACK_ROW_LENGTH, mt.width), oe.pixelStorei(E.UNPACK_IMAGE_HEIGHT, mt.height), oe.pixelStorei(E.UNPACK_SKIP_PIXELS, Se), oe.pixelStorei(E.UNPACK_SKIP_ROWS, Fe), oe.pixelStorei(E.UNPACK_SKIP_IMAGES, De);
      const wi = y.isDataArrayTexture || y.isData3DTexture, at = W.isDataArrayTexture || W.isData3DTexture;
      if (y.isDepthTexture) {
        const bt = _.get(y), $n = _.get(W), lt = _.get(bt.__renderTarget), ei = _.get($n.__renderTarget);
        oe.bindFramebuffer(E.READ_FRAMEBUFFER, lt.__webglFramebuffer), oe.bindFramebuffer(E.DRAW_FRAMEBUFFER, ei.__webglFramebuffer);
        for (let Ri = 0; Ri < be; Ri++)
          wi && (E.framebufferTextureLayer(E.READ_FRAMEBUFFER, E.COLOR_ATTACHMENT0, _.get(y).__webglTexture, X, De + Ri), E.framebufferTextureLayer(E.DRAW_FRAMEBUFFER, E.COLOR_ATTACHMENT0, _.get(W).__webglTexture, he, Ct + Ri)), E.blitFramebuffer(Se, Fe, Ie, de, _e, it, Ie, de, E.DEPTH_BUFFER_BIT, E.NEAREST);
        oe.bindFramebuffer(E.READ_FRAMEBUFFER, null), oe.bindFramebuffer(E.DRAW_FRAMEBUFFER, null);
      } else if (X !== 0 || y.isRenderTargetTexture || _.has(y)) {
        const bt = _.get(y), $n = _.get(W);
        oe.bindFramebuffer(E.READ_FRAMEBUFFER, Rh), oe.bindFramebuffer(E.DRAW_FRAMEBUFFER, Mh);
        for (let lt = 0; lt < be; lt++)
          wi ? E.framebufferTextureLayer(E.READ_FRAMEBUFFER, E.COLOR_ATTACHMENT0, bt.__webglTexture, X, De + lt) : E.framebufferTexture2D(E.READ_FRAMEBUFFER, E.COLOR_ATTACHMENT0, E.TEXTURE_2D, bt.__webglTexture, X), at ? E.framebufferTextureLayer(E.DRAW_FRAMEBUFFER, E.COLOR_ATTACHMENT0, $n.__webglTexture, he, Ct + lt) : E.framebufferTexture2D(E.DRAW_FRAMEBUFFER, E.COLOR_ATTACHMENT0, E.TEXTURE_2D, $n.__webglTexture, he), X !== 0 ? E.blitFramebuffer(Se, Fe, Ie, de, _e, it, Ie, de, E.COLOR_BUFFER_BIT, E.NEAREST) : at ? E.copyTexSubImage3D(fe, he, _e, it, Ct + lt, Se, Fe, Ie, de) : E.copyTexSubImage2D(fe, he, _e, it, Se, Fe, Ie, de);
        oe.bindFramebuffer(E.READ_FRAMEBUFFER, null), oe.bindFramebuffer(E.DRAW_FRAMEBUFFER, null);
      } else
        at ? y.isDataTexture || y.isData3DTexture ? E.texSubImage3D(fe, he, _e, it, Ct, Ie, de, be, st, Vt, mt.data) : W.isCompressedArrayTexture ? E.compressedTexSubImage3D(fe, he, _e, it, Ct, Ie, de, be, st, mt.data) : E.texSubImage3D(fe, he, _e, it, Ct, Ie, de, be, st, Vt, mt) : y.isDataTexture ? E.texSubImage2D(E.TEXTURE_2D, he, _e, it, Ie, de, st, Vt, mt.data) : y.isCompressedTexture ? E.compressedTexSubImage2D(E.TEXTURE_2D, he, _e, it, mt.width, mt.height, st, mt.data) : E.texSubImage2D(E.TEXTURE_2D, he, _e, it, Ie, de, st, Vt, mt);
      oe.pixelStorei(E.UNPACK_ROW_LENGTH, jt), oe.pixelStorei(E.UNPACK_IMAGE_HEIGHT, Ke), oe.pixelStorei(E.UNPACK_SKIP_PIXELS, nn), oe.pixelStorei(E.UNPACK_SKIP_ROWS, An), oe.pixelStorei(E.UNPACK_SKIP_IMAGES, qn), he === 0 && W.generateMipmaps && E.generateMipmap(fe), oe.unbindTexture();
    }, this.initRenderTarget = function(y) {
      _.get(y).__webglFramebuffer === void 0 && I.setupRenderTarget(y);
    }, this.initTexture = function(y) {
      y.isCubeTexture ? I.setTextureCube(y, 0) : y.isData3DTexture ? I.setTexture3D(y, 0) : y.isDataArrayTexture || y.isCompressedArrayTexture ? I.setTexture2DArray(y, 0) : I.setTexture2D(y, 0), oe.unbindTexture();
    }, this.resetState = function() {
      U = 0, H = 0, F = null, oe.reset(), ne.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }

  get coordinateSystem() {
    return Gn;
  }

  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    t.drawingBufferColorSpace = Pe._getDrawingBufferColorSpace(e), t.unpackColorSpace = Pe._getUnpackColorSpace();
  }
}
const uC = {
  "research-plus-pipette": "lab-prop.research-plus-pipette",
  "plaque-assay-dish": "lab-prop.petri-dish-plaque-assay",
  "fernbach-flask": "lab-prop.fernbach-flask",
  "bench-centrifuge": "lab-prop.centrifuge-rotor",
  "tube-rack": "lab-prop.test-tube-rack",
  "slide-start": "lab-prop.microscope-slide",
  "sterile-tip-box": "lab-prop.tip-box"
}, gC = {
  "research-plus-pipette": 0.8,
  "plaque-assay-dish": 0.18,
  "fernbach-flask": 0.2,
  "bench-centrifuge": 0.22,
  "tube-rack": 0.3,
  "slide-start": 0.16,
  "sterile-tip-box": 0.34
}, id = {
  pipetteTip: "pickup.pipette-tip",
  reagentDroplet: "pickup.reagent-droplet",
  agarPlug: "pickup.agar-plug",
  mediaBead: "pickup.media-bead"
}, pC = {
  phage: "hazard.phage-particle",
  plaque: "hazard.phage-plaque",
  rupture: "hazard.membrane-rupture",
  crack: "hazard.membrane-rupture",
  spill: "hazard.media-spill",
  rotor: "hazard.rotor-sweep",
  droplet: "pickup.reagent-droplet"
};
function fC(i, e) {
  const t = new dg();
  t.background = new Me(462876), t.fog = new rl(1056820, 65e-4);
  const n = new Yt(38, 16 / 9, 0.1, 280);
  n.position.set(-46, 32, 48), n.lookAt(-44, 0, 22);
  const s = new hC({ antialias: !0, alpha: !1, powerPreference: "high-performance" });
  s.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)), s.outputColorSpace = wt, s.shadowMap.enabled = !0, s.shadowMap.type = xd, i.append(s.domElement);
  const a = new gp(), r = new ht();
  t.add(r);
  const o = new Zt({
    color: 1254195,
    roughness: 0.76,
    metalness: 0.02,
    emissive: 1056042,
    emissiveIntensity: 0.28
  }), l = new ve(new Tt($t.width + 12, 0.5, $t.depth + 10), o);
  l.receiveShadow = !0, l.position.y = -0.28, r.add(l);
  const c = new ve(
    new Tt($t.width - 6, 0.08, $t.depth - 5),
    new Zt({ color: 1455434, roughness: 0.7, metalness: 0.04, emissive: 927801, emissiveIntensity: 0.2 })
  );
  c.position.y = 0.03, c.receiveShadow = !0, r.add(c);
  const d = new ht();
  Es.forEach((Z) => d.add(mC(Z))), r.add(d);
  const u = new ht();
  ka.forEach((Z) => u.add(IC(Z, e))), r.add(u);
  const h = new pp($t.width, 36, 3046794, 1193798);
  h.position.y = 0.08;
  const g = h.material;
  g.opacity = 0.12, g.transparent = !0, r.add(h);
  const m = new ht();
  r.add(m);
  const A = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  t.add(new jg(16771793, 397341, 1.8));
  const b = new oh(16767406, 3.25);
  b.position.set(-32, 36, 30), b.castShadow = !0, b.shadow.mapSize.set(1536, 1536), b.shadow.camera.left = -75, b.shadow.camera.right = 75, b.shadow.camera.top = 55, b.shadow.camera.bottom = -55, t.add(b);
  const v = new Po(7794943, 30, 92);
  v.position.set(-46, 12, -30), t.add(v);
  const S = new Po(16748462, 24, 84);
  S.position.set(45, 12, 32), t.add(S);
  let R = "";
  const x = new N(-46, 0, 22), G = new N();
  function C(Z) {
    m.clear();
    const U = kt[Z.speciesId], H = new Xt({
      color: U.colorA,
      emissive: U.colorB,
      emissiveIntensity: 0.32,
      roughness: 0.36,
      metalness: 0.02,
      transmission: 0.16,
      thickness: 0.28
    }), F = new Zt({ color: U.colorB, emissive: U.colorB, emissiveIntensity: 0.72, roughness: 0.58 }), L = U.silhouette === "coccus" ? new ve(new Kn(0.9, 32, 16), H) : U.silhouette === "diplococcus" ? MC(H) : new ve(new Xa(0.5, U.silhouette === "coryneform" ? 1.65 : 2.2, 12, 28), H);
    if (L.castShadow = !0, L.rotation.z = Math.PI / 2, m.add(L), U.silhouette === "capsule") {
      const $ = new ve(new Xa(0.72, 2.55, 12, 28), new Dt({ color: 13172722, transparent: !0, opacity: 0.23 }));
      $.rotation.z = Math.PI / 2, m.add($);
    }
    const P = new ve(new Kn(0.22, 16, 8), F);
    P.position.set(0.16, 0.18, 0.06), m.add(P);
    const j = new ve(new Hs(1.18, 0.025, 6, 72), new Dt({ color: U.colorA, transparent: !0, opacity: 0.36 }));
    j.rotation.x = Math.PI / 2, j.position.y = -0.36, m.add(j);
  }
  function w(Z, U) {
    const H = U || a.getDelta();
    R !== Z.speciesId && (R = Z.speciesId, C(Z));
    const F = pt[Z.phaseIndex];
    o.emissive?.setHex(F.tint), o.emissiveIntensity = 0.25 + Z.phaseIndex * 0.07, m.position.set(Z.player.x, 0.86 + Math.sin(Z.elapsed * 5.2) * 0.045, Z.player.z), m.rotation.y = Math.atan2(Z.player.vx, Z.player.vz || 1e-3), m.scale.setScalar(1 + (Z.status === "command" ? 0.08 : 0)), u.children.forEach((L) => RC(L, Z, H)), Hr(r, A, Z.hazards, (L) => GC(L, e), ZC), Hr(r, f, Z.pickups, (L) => BC(L, e), NC), Hr(r, p, Z.effects, EC, FC), x.lerp(new N(Z.player.x, 0.1, Z.player.z), Math.min(1, H * 2.4)), G.set(x.x - 4, 34, x.z + 36), n.position.lerp(G, Math.min(1, H * 2.1)), n.lookAt(x.x + 2.2, 0.12, x.z - 3.6), s.render(t, n);
  }
  function T() {
    const Z = i.getBoundingClientRect(), U = Math.max(320, Math.floor(Z.width)), H = Math.max(260, Math.floor(Z.height));
    s.setSize(U, H, !1), n.aspect = U / H, n.updateProjectionMatrix();
  }
  function M() {
    s.dispose(), s.domElement.remove();
  }
  return T(), { update: w, resize: T, dispose: M };
}
function mC(i) {
  const e = new ht();
  e.position.set(i.bounds.x, 0.095, i.bounds.z);
  const t = new ve(
    new Tt(i.bounds.width, 0.04, i.bounds.depth),
    new Dt({ color: i.color, transparent: !0, opacity: 0.1 })
  );
  e.add(t);
  const n = new ve(
    new Ka(0.48, 0.52, 4),
    new Dt({ color: i.accent, transparent: !0, opacity: 0.26 })
  );
  n.scale.set(i.bounds.width, i.bounds.depth, 1), n.rotation.x = Math.PI / 2, n.rotation.z = Math.PI / 4, n.position.y = 0.03, e.add(n);
  const s = WC(i.shortLabel, i.accent);
  return s.position.set(-i.bounds.width / 2 + 3.2, 0.35, -i.bounds.depth / 2 + 2.2), e.add(s), e;
}
function IC(i, e) {
  const t = CC(i, e);
  return t || (i.kind === "pipette" ? bC(i) : i.kind === "petriDish" ? AC(i) : i.kind === "fernbachFlask" ? yC(i) : i.kind === "centrifuge" ? SC(i) : i.kind === "tubeRack" ? vC(i) : i.kind === "tipBox" ? xC(i) : i.kind === "spill" ? _C(i) : wC(i));
}
function CC(i, e) {
  const t = uC[i.id], n = t ? e?.instantiate(t) : null;
  if (!n) return null;
  const s = new ht();
  return s.userData.kind = i.kind, s.userData.assetKey = t, s.position.set(i.x, gC[i.id] ?? 0.2, i.z), s.rotation.y = i.angle ?? 0, s.add(n), s;
}
function bC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.5, i.z), e.rotation.y = i.angle ?? 0;
  const t = new Zt({ color: 15265522, roughness: 0.52, metalness: 0.06 }), n = new Zt({ color: 6080223, roughness: 0.42, metalness: 0.05, emissive: 676708, emissiveIntensity: 0.18 }), s = new Zt({ color: 2502970, roughness: 0.7 }), a = new ve(new Tt(i.width * 0.78, 1.15, i.depth), t);
  a.castShadow = !0, e.add(a);
  const r = new ve(new Tt(5.2, 1.45, i.depth * 1.08), n);
  r.position.x = -i.width * 0.44, r.castShadow = !0, e.add(r);
  const o = new ve(new Tt(6, 0.08, i.depth * 1.08), s);
  o.position.set(-2, 0.62, 0), e.add(o);
  const l = new ve(new os(0.72, 9.2, 18), n);
  return l.rotation.z = -Math.PI / 2, l.position.x = i.width * 0.47, l.castShadow = !0, e.add(l), e;
}
function AC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.18, i.z);
  const t = new ve(new hn(i.radius ?? 12, i.radius ?? 12, 0.32, 96), new Zt({ color: 16041852, roughness: 0.64, emissive: 4137994, emissiveIntensity: 0.22 }));
  t.receiveShadow = !0, e.add(t);
  const n = new ve(new Hs(i.radius ?? 12.5, 0.28, 12, 120), new Xt({ color: 14679039, transparent: !0, opacity: 0.34, roughness: 0.2, transmission: 0.42 }));
  n.rotation.x = Math.PI / 2, n.position.y = 0.32, e.add(n);
  for (let s = 0; s < 10; s += 1) {
    const a = new ve(new hn(0.6 + s % 3 * 0.32, 0.6 + s % 3 * 0.32, 0.04, 32), new Dt({ color: 9263916, transparent: !0, opacity: 0.26 })), r = s * 2.399, o = 2.6 + s % 5 * 1.8;
    a.position.set(Math.cos(r) * o, 0.52, Math.sin(r) * o), e.add(a);
  }
  return e;
}
function yC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.24, i.z);
  const t = new Xt({ color: 13171967, transparent: !0, opacity: 0.28, roughness: 0.12, transmission: 0.52, thickness: 0.5 }), n = new Zt({ color: 7328958, transparent: !0, opacity: 0.52, roughness: 0.45, emissive: 1334355, emissiveIntensity: 0.26 }), s = new ve(new Kn(i.radius ?? 7, 48, 24), t);
  s.scale.y = 0.52, s.position.y = 2.6, s.castShadow = !0, e.add(s);
  const a = new ve(new hn((i.radius ?? 7) * 0.76, (i.radius ?? 7) * 0.78, 0.45, 64), n);
  a.position.y = 1.85, e.add(a);
  const r = new ve(new hn(1.15, 1.5, 5.6, 32), t);
  return r.position.y = 6.2, r.castShadow = !0, e.add(r), e;
}
function SC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.2, i.z);
  const t = new ve(new hn(i.radius ?? 12, i.radius ?? 12, 1.2, 96), new Zt({ color: 13621215, roughness: 0.5, metalness: 0.08 }));
  t.castShadow = !0, e.add(t);
  const n = new ht();
  n.userData.rotor = !0, n.position.y = 0.84;
  const s = new Zt({ color: 6127527, roughness: 0.42, metalness: 0.18, emissive: 1453388, emissiveIntensity: 0.18 });
  for (let r = 0; r < 8; r += 1) {
    const o = new ve(new Tt(1.55, 0.28, 10), s);
    o.rotation.y = r / 8 * Math.PI * 2, o.position.set(Math.sin(o.rotation.y) * 2.4, 0, Math.cos(o.rotation.y) * 2.4), o.castShadow = !0, n.add(o);
  }
  const a = new ve(new hn(2.4, 2.9, 0.7, 48), s);
  return a.castShadow = !0, n.add(a), e.add(n), e;
}
function vC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.3, i.z);
  const t = new Zt({ color: 2110538, roughness: 0.62, metalness: 0.04, emissive: 728109, emissiveIntensity: 0.2 }), n = [7921394, 16099015, 15978607, 9695434].map((a) => new Xt({ color: a, transparent: !0, opacity: 0.62, roughness: 0.22, transmission: 0.26 })), s = new ve(new Tt(i.width, 1, i.depth), t);
  s.castShadow = !0, e.add(s);
  for (let a = 0; a < 3; a += 1)
    for (let r = 0; r < 6; r += 1) {
      const o = new ve(new hn(0.72, 0.58, 4.2, 24), n[(a + r) % n.length]);
      o.position.set(-i.width / 2 + 3.4 + r * 4.2, 2.5, -i.depth / 2 + 2.7 + a * 3.8), o.castShadow = !0, e.add(o);
    }
  return e;
}
function xC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.35, i.z);
  const t = new ve(new Tt(i.width, 1.2, i.depth), new Zt({ color: 1193547, roughness: 0.48, emissive: 532531, emissiveIntensity: 0.22 }));
  t.castShadow = !0, e.add(t);
  for (let n = 0; n < 4; n += 1)
    for (let s = 0; s < 5; s += 1) {
      const a = new ve(new os(0.22, 1.4, 12), new Zt({ color: 12121343, roughness: 0.38 }));
      a.position.set(-i.width / 2 + 1.8 + s * 1.8, 1.45, -i.depth / 2 + 1.3 + n * 1.6), a.castShadow = !0, e.add(a);
    }
  return e;
}
function _C(i) {
  const e = new ve(
    new ul(Math.max(i.width, i.depth) * 0.48, 64),
    new Dt({ color: 6874319, transparent: !0, opacity: 0.18 })
  );
  return e.userData.kind = i.kind, e.position.set(i.x, 0.16, i.z), e.scale.z = i.depth / i.width, e.rotation.x = -Math.PI / 2, e;
}
function wC(i) {
  const e = new ht();
  e.userData.kind = i.kind, e.position.set(i.x, 0.16, i.z);
  const t = new ve(new Tt(i.width, 0.12, i.depth), new Xt({ color: 14679039, transparent: !0, opacity: 0.24, roughness: 0.2, transmission: 0.46 }));
  e.add(t);
  const n = new ve(new Tt(i.width * 0.44, 0.06, i.depth * 0.55), new Dt({ color: 16777215, transparent: !0, opacity: 0.18 }));
  return n.position.y = 0.12, e.add(n), e;
}
function RC(i, e, t) {
  i.userData.kind === "spill" && (i.scale.x = 1 + Math.sin(e.elapsed * 1.3) * 0.035), i.traverse((n) => {
    n.userData.rotor && (n.rotation.y += t * (e.phaseIndex >= 3 ? 1.8 : 0.42));
  });
}
function MC(i) {
  const e = new ht(), t = new ve(new Kn(0.64, 32, 16), i), n = new ve(new Kn(0.64, 32, 16), i);
  return t.position.x = -0.46, n.position.x = 0.46, t.castShadow = !0, n.castShadow = !0, e.add(t, n), e;
}
function GC(i, e) {
  const t = pC[i.kind], n = t ? e?.instantiate(t) : null;
  if (n)
    return n.userData.assetKey = t, n.userData.kind = i.kind, n;
  if (i.kind === "phage") {
    const a = new ht(), r = new Zt({ color: 16766602, emissive: 7158796, emissiveIntensity: 0.72, transparent: !0, opacity: 0.9, roughness: 0.42 }), o = new ve(new gl(0.58, 1), r), l = new ve(new os(0.18, 1.05, 8), r);
    return l.position.z = -0.72, l.rotation.x = Math.PI / 2, a.add(o, l), a;
  }
  if (i.kind === "droplet")
    return new ve(new Kn(0.82, 24, 14), new Xt({ color: 7400191, transparent: !0, opacity: 0.68, roughness: 0.18, transmission: 0.34, emissive: 741990, emissiveIntensity: 0.28 }));
  if (i.kind === "plaque" || i.kind === "spill")
    return new ve(
      new hn(1, 1, 0.08, 64),
      new Dt({ color: i.kind === "plaque" ? 9325357 : 6283466, transparent: !0, opacity: i.kind === "plaque" ? 0.38 : 0.32 })
    );
  const s = new Zt({
    color: i.kind === "shock" ? 9433087 : i.kind === "crack" ? 16755065 : i.kind === "rotor" ? 10336255 : 16742549,
    emissive: i.kind === "rupture" ? 9380925 : 2313311,
    emissiveIntensity: 0.76,
    transparent: !0,
    opacity: i.age < i.telegraph ? 0.35 : 0.88,
    roughness: 0.46
  });
  return i.kind === "crack" ? TC(s, i.width) : i.kind === "shock" ? new ve(new Tt(1.35, 0.14, 28), s) : i.kind === "rotor" ? new ve(new Tt(1.4, 0.18, i.radius * 2), s) : new ve(new Hs(i.radius, 0.08, 8, 72), s);
}
function TC(i, e) {
  const t = new ht();
  for (let n = 0; n < 5; n += 1) {
    const s = new ve(new Tt(e / 5, 0.16, 0.26), i);
    s.position.x = -e / 2 + n * (e / 5) + e / 10, s.position.z = Math.sin(n * 1.7) * 0.34, s.rotation.y = Math.sin(n * 2.1) * 0.35, t.add(s);
  }
  return t;
}
function ZC(i, e) {
  i.position.set(e.x, e.kind === "plaque" || e.kind === "spill" || e.kind === "rupture" ? 0.26 : 0.86, e.z), i.rotation.y = -e.angle;
  const t = e.age < e.telegraph ? 1 + Math.sin(e.age * 18) * 0.08 : 1;
  e.kind === "plaque" || e.kind === "spill" ? i.scale.set(e.radius, 1, e.radius) : e.kind === "rupture" ? i.scale.setScalar(Math.max(0.6, e.radius)) : i.scale.setScalar(t), i.traverse((n) => {
    const a = n.material;
    a?.opacity !== void 0 && (a.opacity = e.age < e.telegraph ? 0.3 : e.kind === "plaque" || e.kind === "spill" ? 0.42 : 0.88);
  });
}
function BC(i, e) {
  const t = e?.instantiate(id[i.kind]);
  if (t)
    return t.userData.assetKey = id[i.kind], t.userData.kind = i.kind, t;
  const n = i.kind === "pipetteTip" ? 12121343 : i.kind === "reagentDroplet" ? 7659775 : i.kind === "agarPlug" ? 16173695 : 11075551, s = new Zt({ color: n, emissive: n, emissiveIntensity: 0.36, roughness: 0.36 });
  if (i.kind === "pipetteTip") {
    const a = new ve(new os(0.3, 1.35, 16), s);
    return a.rotation.z = Math.PI, a;
  }
  return i.kind === "reagentDroplet" ? new ve(new Kn(0.48, 20, 12), s) : i.kind === "agarPlug" ? new ve(new hn(0.48, 0.48, 0.42, 24), s) : new ve(new pl(0.48, 0), s);
}
function NC(i, e) {
  i.position.set(e.x, 0.78 + Math.sin(e.age * 4) * 0.16, e.z), i.rotation.y += 0.04, i.rotation.x += 0.018;
}
function EC(i) {
  const e = new Dt({
    color: i.type === "damage" || i.type === "lysis" ? 16742549 : i.type === "command" ? 14154751 : 11075551,
    transparent: !0,
    opacity: 0.78
  });
  return new ve(new Ka(0.28, 0.4, 40), e);
}
function FC(i, e) {
  i.position.set(e.x, 0.82 + e.age * 0.34, e.z), i.rotation.x = -Math.PI / 2, i.scale.setScalar(1 + e.age * 2.5), i.traverse((t) => {
    const s = t.material;
    s?.opacity !== void 0 && (s.opacity = Math.max(0, 0.78 - e.age * 0.5));
  });
}
function WC(i, e) {
  const t = document.createElement("canvas");
  t.width = 512, t.height = 128;
  const n = t.getContext("2d");
  n && (n.clearRect(0, 0, t.width, t.height), n.fillStyle = "rgba(3, 12, 22, 0.72)", VC(n, 12, 20, 488, 82, 24), n.fill(), n.strokeStyle = `#${e.toString(16).padStart(6, "0")}`, n.globalAlpha = 0.72, n.stroke(), n.globalAlpha = 1, n.fillStyle = "#ecfbff", n.font = "800 34px Georgia, serif", n.fillText(i, 38, 73));
  const s = new Rg(t);
  s.colorSpace = wt;
  const a = new fg(new Kd({ map: s, transparent: !0, depthWrite: !1 }));
  return a.scale.set(8, 2, 1), a;
}
function VC(i, e, t, n, s, a) {
  i.beginPath(), i.moveTo(e + a, t), i.lineTo(e + n - a, t), i.quadraticCurveTo(e + n, t, e + n, t + a), i.lineTo(e + n, t + s - a), i.quadraticCurveTo(e + n, t + s, e + n - a, t + s), i.lineTo(e + a, t + s), i.quadraticCurveTo(e, t + s, e, t + s - a), i.lineTo(e, t + a), i.quadraticCurveTo(e, t, e + a, t), i.closePath();
}
function Hr(i, e, t, n, s) {
  const a = new Set(t.map((r) => r.id));
  for (const [r, o] of e)
    a.has(r) || (o.removeFromParent(), e.delete(r));
  t.forEach((r) => {
    let o = e.get(r.id);
    o || (o = n(r), e.set(r.id, o), i.add(o)), o.parent || i.add(o), s(o, r);
  });
}
const LC = "data:video/mp2t;base64,ZXhwb3J0IHR5cGUgVjNTb3VuZCA9ICJwaWNrdXAiIHwgImRhbWFnZSIgfCAiZGFzaCIgfCAiY29tbWFuZCIgfCAicGhhc2UiIHwgInVwZ3JhZGUiIHwgImx5c2lzIjsKCmNvbnN0IFNUT1JBR0VfS0VZID0gImJlcm5oYXJkdC1lbnZlbG9wZS1lc2NhcGUtdjMtc291bmQiOwoKZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUF1ZGlvQ29udHJvbGxlcigpIHsKICBsZXQgY29udGV4dDogQXVkaW9Db250ZXh0IHwgbnVsbCA9IG51bGw7CiAgbGV0IGVuYWJsZWQgPSByZWFkRW5hYmxlZCgpOwoKICBmdW5jdGlvbiBzZXRFbmFibGVkKHZhbHVlOiBib29sZWFuKTogdm9pZCB7CiAgICBlbmFibGVkID0gdmFsdWU7CiAgICB0cnkgewogICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVksIGVuYWJsZWQgPyAib24iIDogIm9mZiIpOwogICAgfSBjYXRjaCB7CiAgICAgIC8qIG5vLW9wICovCiAgICB9CiAgfQoKICBmdW5jdGlvbiBwbGF5KHNvdW5kOiBWM1NvdW5kKTogdm9pZCB7CiAgICBpZiAoIWVuYWJsZWQpIHJldHVybjsKICAgIGNvbnRleHQgPSBjb250ZXh0IHx8IG5ldyBBdWRpb0NvbnRleHQoKTsKICAgIGlmIChjb250ZXh0LnN0YXRlID09PSAic3VzcGVuZGVkIikgdm9pZCBjb250ZXh0LnJlc3VtZSgpOwogICAgY29uc3Qgbm93ID0gY29udGV4dC5jdXJyZW50VGltZTsKICAgIGNvbnN0IHNlcXVlbmNlOiBSZWNvcmQ8VjNTb3VuZCwgbnVtYmVyW10+ID0gewogICAgICBwaWNrdXA6IFs2NjAsIDg4MF0sCiAgICAgIGRhbWFnZTogWzIyMCwgMTIwXSwKICAgICAgZGFzaDogWzM2MCwgNjIwXSwKICAgICAgY29tbWFuZDogWzI2MCwgNTIwLCA5ODBdLAogICAgICBwaGFzZTogWzE5NiwgMjk0LCAzOTJdLAogICAgICB1cGdyYWRlOiBbNDQwLCA2NjAsIDk5MF0sCiAgICAgIGx5c2lzOiBbMTgwLCAxMjAsIDgwXQogICAgfTsKICAgIHNlcXVlbmNlW3NvdW5kXS5mb3JFYWNoKChmcmVxdWVuY3ksIGluZGV4KSA9PiB7CiAgICAgIGlmICghY29udGV4dCkgcmV0dXJuOwogICAgICBjb25zdCBvc2NpbGxhdG9yID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7CiAgICAgIGNvbnN0IGdhaW4gPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTsKICAgICAgY29uc3Qgc3RhcnQgPSBub3cgKyBpbmRleCAqIDAuMDU1OwogICAgICBvc2NpbGxhdG9yLnR5cGUgPSBzb3VuZCA9PT0gImRhbWFnZSIgfHwgc291bmQgPT09ICJseXNpcyIgPyAic2F3dG9vdGgiIDogInNpbmUiOwogICAgICBvc2NpbGxhdG9yLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxdWVuY3ksIHN0YXJ0KTsKICAgICAgZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMDAwMSwgc3RhcnQpOwogICAgICBnYWluLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShzb3VuZCA9PT0gInBoYXNlIiA/IDAuMDQ1IDogMC4wNzUsIHN0YXJ0ICsgMC4wMTIpOwogICAgICBnYWluLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMDEsIHN0YXJ0ICsgMC4xNCk7CiAgICAgIG9zY2lsbGF0b3IuY29ubmVjdChnYWluKTsKICAgICAgZ2Fpbi5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pOwogICAgICBvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0KTsKICAgICAgb3NjaWxsYXRvci5zdG9wKHN0YXJ0ICsgMC4xNik7CiAgICB9KTsKICB9CgogIHJldHVybiB7CiAgICBnZXQgZW5hYmxlZCgpIHsKICAgICAgcmV0dXJuIGVuYWJsZWQ7CiAgICB9LAogICAgc2V0RW5hYmxlZCwKICAgIHBsYXkKICB9Owp9CgpmdW5jdGlvbiByZWFkRW5hYmxlZCgpOiBib29sZWFuIHsKICB0cnkgewogICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWSkgPT09ICJvbiI7CiAgfSBjYXRjaCB7CiAgICByZXR1cm4gZmFsc2U7CiAgfQp9Cg==", UC = "data:video/mp2t;base64,aW1wb3J0IHR5cGUgeyBDb21tYW5kRGVmaW5pdGlvbiwgTGFiUHJvcCwgUGhhc2VEZWZpbml0aW9uLCBTcGVjaWVzRGVmaW5pdGlvbiwgU3BlY2llc0lkLCBVcGdyYWRlRGVmaW5pdGlvbiwgV29ybGRab25lIH0gZnJvbSAiLi90eXBlcyI7CgpleHBvcnQgY29uc3QgQ0hBTUJFUiA9IHsKICB3aWR0aDogMTIwLAogIGRlcHRoOiA3MCwKICBzYWZlTWFyZ2luOiAzLjIKfSBhcyBjb25zdDsKCmV4cG9ydCBjb25zdCBXT1JMRF9aT05FUzogV29ybGRab25lW10gPSBbCiAgewogICAgaWQ6ICJtaWNyb3Njb3BlU2xpZGUiLAogICAgbGFiZWw6ICJNaWNyb3Njb3BlIHNsaWRlIHN0YWdpbmcgYXJlYSIsCiAgICBzaG9ydExhYmVsOiAiU2xpZGUiLAogICAgYm91bmRzOiB7IHg6IC00MiwgejogMjIsIHdpZHRoOiAzNCwgZGVwdGg6IDIwIH0sCiAgICBjb2xvcjogMHg2ZGRkZWMsCiAgICBhY2NlbnQ6IDB4ZDZmYmZmLAogICAgb2JqZWN0aXZlSGludDogIlByYWN0aWNlIG1vdmVtZW50LCB0aGVuIHB1c2ggdG93YXJkIHRoZSBwaXBldHRlIHpvbmUuIgogIH0sCiAgewogICAgaWQ6ICJwaXBldHRlWm9uZSIsCiAgICBsYWJlbDogIlJlc2VhcmNoIFBsdXMgcGlwZXR0ZSBsYW5lIiwKICAgIHNob3J0TGFiZWw6ICJQaXBldHRlIiwKICAgIGJvdW5kczogeyB4OiAtMzksIHo6IC0yMCwgd2lkdGg6IDQyLCBkZXB0aDogMjAgfSwKICAgIGNvbG9yOiAweDc0ZGNlNiwKICAgIGFjY2VudDogMHgyYThhYTQsCiAgICBvYmplY3RpdmVIaW50OiAiUm91dGUgdGhyb3VnaCBkcm9wbGV0IHB1bHNlcyBhbmQgY29sbGVjdCBzdGVyaWxlIHRpcHMuIgogIH0sCiAgewogICAgaWQ6ICJwZXRyaURpc2giLAogICAgbGFiZWw6ICJQZXRyaSBkaXNoIHBsYXF1ZSBhc3NheSIsCiAgICBzaG9ydExhYmVsOiAiUGV0cmkgZGlzaCIsCiAgICBib3VuZHM6IHsgeDogMTEsIHo6IC0yMiwgd2lkdGg6IDM0LCBkZXB0aDogMjYgfSwKICAgIGNvbG9yOiAweGYzYzI3OCwKICAgIGFjY2VudDogMHg5YzY1MzAsCiAgICBvYmplY3RpdmVIaW50OiAiQ2xlYXIgcGxhcXVlcyBiZWZvcmUgdGhlIHBoYWdlIGJsb29tIG92ZXJ0YWtlcyB0aGUgYWdhci4iCiAgfSwKICB7CiAgICBpZDogImZlcm5iYWNoRmxhc2siLAogICAgbGFiZWw6ICJGZXJuYmFjaCBmbGFzayBtZWRpYSBjdXJyZW50IiwKICAgIHNob3J0TGFiZWw6ICJGZXJuYmFjaCIsCiAgICBib3VuZHM6IHsgeDogLTYsIHo6IDYsIHdpZHRoOiAzMCwgZGVwdGg6IDIwIH0sCiAgICBjb2xvcjogMHg5YmU0ZDgsCiAgICBhY2NlbnQ6IDB4MmE3ODZmLAogICAgb2JqZWN0aXZlSGludDogIlVzZSBtZW1icmFuZSByZXBhaXIgdG8gY3Jvc3Mgc3dpcmxpbmcgc3BpbGwgY3VycmVudHMuIgogIH0sCiAgewogICAgaWQ6ICJjZW50cmlmdWdlIiwKICAgIGxhYmVsOiAiQ2VudHJpZnVnZSByb3RvciBoYXphcmQiLAogICAgc2hvcnRMYWJlbDogIkNlbnRyaWZ1Z2UiLAogICAgYm91bmRzOiB7IHg6IDQyLCB6OiA4LCB3aWR0aDogMzYsIGRlcHRoOiAyOCB9LAogICAgY29sb3I6IDB4OTFiN2ZmLAogICAgYWNjZW50OiAweDNiNTc4ZSwKICAgIG9iamVjdGl2ZUhpbnQ6ICJUaW1lIG1vdGlsaXR5IGJ1cnN0cyB0aHJvdWdoIHRoZSByb3RvciBzd2VlcC4iCiAgfSwKICB7CiAgICBpZDogInR1YmVSYWNrIiwKICAgIGxhYmVsOiAiVGVzdCB0dWJlIHJhY2sgbWF6ZSIsCiAgICBzaG9ydExhYmVsOiAiVHViZSByYWNrIiwKICAgIGJvdW5kczogeyB4OiAxNSwgejogMjYsIHdpZHRoOiAzOCwgZGVwdGg6IDIwIH0sCiAgICBjb2xvcjogMHhmMGE4YzUsCiAgICBhY2NlbnQ6IDB4N2QzZDU4LAogICAgb2JqZWN0aXZlSGludDogIlRocmVhZCBiZXR3ZWVuIHR1YmVzIGFuZCBzZWFsIHJ1cHR1cmUgcG9pbnRzLiIKICB9Cl07CgpleHBvcnQgY29uc3QgTEFCX1BST1BTOiBMYWJQcm9wW10gPSBbCiAgewogICAgaWQ6ICJzbGlkZS1zdGFydCIsCiAgICBraW5kOiAibWljcm9zY29wZVNsaWRlIiwKICAgIGxhYmVsOiAiTWljcm9zY29wZSBzbGlkZSIsCiAgICB6b25lSWQ6ICJtaWNyb3Njb3BlU2xpZGUiLAogICAgeDogLTQ0LAogICAgejogMjIsCiAgICB3aWR0aDogMjYsCiAgICBkZXB0aDogMTMsCiAgICBoZWlnaHQ6IDAuMTQKICB9LAogIHsKICAgIGlkOiAicmVzZWFyY2gtcGx1cy1waXBldHRlIiwKICAgIGtpbmQ6ICJwaXBldHRlIiwKICAgIGxhYmVsOiAiT3ZlcnNpemVkIFJlc2VhcmNoIFBsdXMgcGlwZXR0ZSIsCiAgICB6b25lSWQ6ICJwaXBldHRlWm9uZSIsCiAgICB4OiAtNDIsCiAgICB6OiAtMjksCiAgICB3aWR0aDogMzgsCiAgICBkZXB0aDogNCwKICAgIGhlaWdodDogMi41LAogICAgYW5nbGU6IC0wLjEyLAogICAgY29sbGlzaW9uOiBbeyB0eXBlOiAiYm94IiwgeDogLTQyLCB6OiAtMjksIHdpZHRoOiAzNCwgZGVwdGg6IDQuMiB9XQogIH0sCiAgewogICAgaWQ6ICJzdGVyaWxlLXRpcC1ib3giLAogICAga2luZDogInRpcEJveCIsCiAgICBsYWJlbDogIlN0ZXJpbGUgcGlwZXR0ZSB0aXAgYm94IiwKICAgIHpvbmVJZDogInBpcGV0dGVab25lIiwKICAgIHg6IC0yMiwKICAgIHo6IC0xMSwKICAgIHdpZHRoOiAxMSwKICAgIGRlcHRoOiA4LAogICAgaGVpZ2h0OiAyLjEsCiAgICBjb2xsaXNpb246IFt7IHR5cGU6ICJib3giLCB4OiAtMjIsIHo6IC0xMSwgd2lkdGg6IDEwLjUsIGRlcHRoOiA3LjUgfV0KICB9LAogIHsKICAgIGlkOiAicGxhcXVlLWFzc2F5LWRpc2giLAogICAga2luZDogInBldHJpRGlzaCIsCiAgICBsYWJlbDogIlBsYXF1ZSBhc3NheSBwZXRyaSBkaXNoIiwKICAgIHpvbmVJZDogInBldHJpRGlzaCIsCiAgICB4OiAxMSwKICAgIHo6IC0yMiwKICAgIHdpZHRoOiAyNywKICAgIGRlcHRoOiAyNywKICAgIGhlaWdodDogMC42LAogICAgcmFkaXVzOiAxMy41CiAgfSwKICB7CiAgICBpZDogImZlcm5iYWNoLWZsYXNrIiwKICAgIGtpbmQ6ICJmZXJuYmFjaEZsYXNrIiwKICAgIGxhYmVsOiAiRmVybmJhY2ggZmxhc2siLAogICAgem9uZUlkOiAiZmVybmJhY2hGbGFzayIsCiAgICB4OiAtNywKICAgIHo6IDQsCiAgICB3aWR0aDogMTYsCiAgICBkZXB0aDogMTYsCiAgICBoZWlnaHQ6IDksCiAgICByYWRpdXM6IDgsCiAgICBjb2xsaXNpb246IFt7IHR5cGU6ICJjaXJjbGUiLCB4OiAtNywgejogNCwgcmFkaXVzOiA2LjQgfV0KICB9LAogIHsKICAgIGlkOiAibWVkaWEtc3BpbGwiLAogICAga2luZDogInNwaWxsIiwKICAgIGxhYmVsOiAiTWVkaWEgc3BpbGwiLAogICAgem9uZUlkOiAiZmVybmJhY2hGbGFzayIsCiAgICB4OiA2LAogICAgejogMTAsCiAgICB3aWR0aDogMTYsCiAgICBkZXB0aDogOSwKICAgIGhlaWdodDogMC4wOAogIH0sCiAgewogICAgaWQ6ICJiZW5jaC1jZW50cmlmdWdlIiwKICAgIGtpbmQ6ICJjZW50cmlmdWdlIiwKICAgIGxhYmVsOiAiQ2VudHJpZnVnZSByb3RvciIsCiAgICB6b25lSWQ6ICJjZW50cmlmdWdlIiwKICAgIHg6IDQyLAogICAgejogOCwKICAgIHdpZHRoOiAyNSwKICAgIGRlcHRoOiAyNSwKICAgIGhlaWdodDogNC4yLAogICAgcmFkaXVzOiAxMi41LAogICAgY29sbGlzaW9uOiBbeyB0eXBlOiAiY2lyY2xlIiwgeDogNDIsIHo6IDgsIHJhZGl1czogNC4yIH1dCiAgfSwKICB7CiAgICBpZDogInR1YmUtcmFjayIsCiAgICBraW5kOiAidHViZVJhY2siLAogICAgbGFiZWw6ICJUZXN0IHR1YmUgcmFjayIsCiAgICB6b25lSWQ6ICJ0dWJlUmFjayIsCiAgICB4OiAxNSwKICAgIHo6IDI2LAogICAgd2lkdGg6IDI4LAogICAgZGVwdGg6IDEzLAogICAgaGVpZ2h0OiAzLjQsCiAgICBjb2xsaXNpb246IFsKICAgICAgeyB0eXBlOiAiYm94IiwgeDogNywgejogMjAsIHdpZHRoOiA0LCBkZXB0aDogOCB9LAogICAgICB7IHR5cGU6ICJib3giLCB4OiAxNSwgejogMjYsIHdpZHRoOiA0LCBkZXB0aDogOCB9LAogICAgICB7IHR5cGU6ICJib3giLCB4OiAyMywgejogMzIsIHdpZHRoOiA0LCBkZXB0aDogOCB9CiAgICBdCiAgfQpdOwoKZXhwb3J0IGNvbnN0IFNQRUNJRVNfT1JERVI6IFNwZWNpZXNJZFtdID0gWwogICJlY29saSIsCiAgInBhZXJ1Z2lub3NhIiwKICAic2F1cmV1cyIsCiAgInNwbmV1bW9uaWFlIiwKICAiY2dsdXRhbWljdW0iLAogICJrcG5ldW1vbmlhZSIsCiAgImFiYXVtYW5uaWkiCl07CgpleHBvcnQgY29uc3QgU1BFQ0lFUzogUmVjb3JkPFNwZWNpZXNJZCwgU3BlY2llc0RlZmluaXRpb24+ID0gewogIGVjb2xpOiB7CiAgICBpZDogImVjb2xpIiwKICAgIGxhYmVsOiAiRXNjaGVyaWNoaWEgY29saSIsCiAgICBzaG9ydExhYmVsOiAiRS4gY29saSIsCiAgICB0cmFpdFRpdGxlOiAiRW52ZWxvcGUgaG9tZW9zdGFzaXMiLAogICAgdHJhaXRDb3B5OiAiQmFsYW5jZWQgaGFuZGxpbmcgYW5kIGZhc3RlciBjb21tYW5kIGNoYXJnaW5nLiIsCiAgICBzcGVlZDogOC4yLAogICAgZGFzaFNwZWVkOiAxOCwKICAgIGludGVncml0eTogMTAwLAogICAgcmVwYWlyR2FpbjogMS4wOCwKICAgIGNvbW1hbmRHYWluOiAxLjEyLAogICAgZGFtYWdlVGFrZW46IDEsCiAgICBjb2xvckE6IDB4ODNmMWVkLAogICAgY29sb3JCOiAweDJjODM5MiwKICAgIHNpbGhvdWV0dGU6ICJyb2QiCiAgfSwKICBwYWVydWdpbm9zYTogewogICAgaWQ6ICJwYWVydWdpbm9zYSIsCiAgICBsYWJlbDogIlBzZXVkb21vbmFzIGFlcnVnaW5vc2EiLAogICAgc2hvcnRMYWJlbDogIlAuIGFlcnVnaW5vc2EiLAogICAgdHJhaXRUaXRsZTogIkZhc3Qgc3dpbW1lciIsCiAgICB0cmFpdENvcHk6ICJIaWdoZXIgc3BlZWQgYW5kIGxvbmdlciBkYXNoIHJlY292ZXJ5IHdpbmRvd3MuIiwKICAgIHNwZWVkOiA5LjIsCiAgICBkYXNoU3BlZWQ6IDIxLAogICAgaW50ZWdyaXR5OiA5NiwKICAgIHJlcGFpckdhaW46IDEsCiAgICBjb21tYW5kR2FpbjogMSwKICAgIGRhbWFnZVRha2VuOiAxLAogICAgY29sb3JBOiAweDgzZjBjOCwKICAgIGNvbG9yQjogMHgyNDZmNjEsCiAgICBzaWxob3VldHRlOiAiY3VydmVkIgogIH0sCiAgc2F1cmV1czogewogICAgaWQ6ICJzYXVyZXVzIiwKICAgIGxhYmVsOiAiU3RhcGh5bG9jb2NjdXMgYXVyZXVzIiwKICAgIHNob3J0TGFiZWw6ICJTLiBhdXJldXMiLAogICAgdHJhaXRUaXRsZTogIlRoaWNrIHdhbGwiLAogICAgdHJhaXRDb3B5OiAiVGFrZXMgbGVzcyBkYW1hZ2UgYnV0IG1vdmVzIG1vcmUgZGVsaWJlcmF0ZWx5LiIsCiAgICBzcGVlZDogNy4yLAogICAgZGFzaFNwZWVkOiAxNSwKICAgIGludGVncml0eTogMTEyLAogICAgcmVwYWlyR2FpbjogMS4wMiwKICAgIGNvbW1hbmRHYWluOiAxLAogICAgZGFtYWdlVGFrZW46IDAuODQsCiAgICBjb2xvckE6IDB4ZmZkNDdkLAogICAgY29sb3JCOiAweDhmNTcyMiwKICAgIHNpbGhvdWV0dGU6ICJjb2NjdXMiCiAgfSwKICBzcG5ldW1vbmlhZTogewogICAgaWQ6ICJzcG5ldW1vbmlhZSIsCiAgICBsYWJlbDogIlN0cmVwdG9jb2NjdXMgcG5ldW1vbmlhZSIsCiAgICBzaG9ydExhYmVsOiAiUy4gcG5ldW1vbmlhZSIsCiAgICB0cmFpdFRpdGxlOiAiQ2Fwc3VsZSBidWZmZXJpbmciLAogICAgdHJhaXRDb3B5OiAiQ29tbWFuZCB1c2UgYnJpZWZseSBidWZmZXJzIGZvbGxvdy11cCBkYW1hZ2UuIiwKICAgIHNwZWVkOiA3LjUsCiAgICBkYXNoU3BlZWQ6IDE2LAogICAgaW50ZWdyaXR5OiAxMDYsCiAgICByZXBhaXJHYWluOiAxLjE2LAogICAgY29tbWFuZEdhaW46IDEsCiAgICBkYW1hZ2VUYWtlbjogMC45NCwKICAgIGNvbG9yQTogMHhmZmI3Y2YsCiAgICBjb2xvckI6IDB4ODg0MzVmLAogICAgc2lsaG91ZXR0ZTogImRpcGxvY29jY3VzIgogIH0sCiAgY2dsdXRhbWljdW06IHsKICAgIGlkOiAiY2dsdXRhbWljdW0iLAogICAgbGFiZWw6ICJDb3J5bmViYWN0ZXJpdW0gZ2x1dGFtaWN1bSIsCiAgICBzaG9ydExhYmVsOiAiQy4gZ2x1dGFtaWN1bSIsCiAgICB0cmFpdFRpdGxlOiAiTGF5ZXJlZCBlbnZlbG9wZSIsCiAgICB0cmFpdENvcHk6ICJBdXRvbHlzaW4gYW5kIHJ1cHR1cmUgZGFtYWdlIGlzIGxlc3MgcHVuaXNoaW5nLiIsCiAgICBzcGVlZDogNy43LAogICAgZGFzaFNwZWVkOiAxNiwKICAgIGludGVncml0eTogMTA0LAogICAgcmVwYWlyR2FpbjogMS4wOCwKICAgIGNvbW1hbmRHYWluOiAxLAogICAgZGFtYWdlVGFrZW46IDAuOTIsCiAgICBjb2xvckE6IDB4YzRkMWZmLAogICAgY29sb3JCOiAweDRmNWFhMSwKICAgIHNpbGhvdWV0dGU6ICJjb3J5bmVmb3JtIgogIH0sCiAga3BuZXVtb25pYWU6IHsKICAgIGlkOiAia3BuZXVtb25pYWUiLAogICAgbGFiZWw6ICJLbGVic2llbGxhIHBuZXVtb25pYWUiLAogICAgc2hvcnRMYWJlbDogIksuIHBuZXVtb25pYWUiLAogICAgdHJhaXRUaXRsZTogIkNhcHN1bGUgcmV0ZW50aW9uIiwKICAgIHRyYWl0Q29weTogIlBpY2t1cHMgZHJpZnQgdG93YXJkIHRoZSBjZWxsIGZyb20gZmFydGhlciBhd2F5LiIsCiAgICBzcGVlZDogNy40LAogICAgZGFzaFNwZWVkOiAxNS41LAogICAgaW50ZWdyaXR5OiAxMDgsCiAgICByZXBhaXJHYWluOiAxLjA2LAogICAgY29tbWFuZEdhaW46IDEsCiAgICBkYW1hZ2VUYWtlbjogMC45NiwKICAgIGNvbG9yQTogMHg5MWVhZGIsCiAgICBjb2xvckI6IDB4Mjg3Yjc4LAogICAgc2lsaG91ZXR0ZTogImNhcHN1bGUiCiAgfSwKICBhYmF1bWFubmlpOiB7CiAgICBpZDogImFiYXVtYW5uaWkiLAogICAgbGFiZWw6ICJBY2luZXRvYmFjdGVyIGJhdW1hbm5paSIsCiAgICBzaG9ydExhYmVsOiAiQS4gYmF1bWFubmlpIiwKICAgIHRyYWl0VGl0bGU6ICJTdHJlc3MgdG9sZXJhbnQiLAogICAgdHJhaXRDb3B5OiAiTmVhciBtaXNzZXMgYW5kIHN1cnZpdmFsIGNoYXJnZSBjb21tYW5kcyBmYXN0ZXIuIiwKICAgIHNwZWVkOiA4LjQsCiAgICBkYXNoU3BlZWQ6IDE4LAogICAgaW50ZWdyaXR5OiAxMDIsCiAgICByZXBhaXJHYWluOiAxLAogICAgY29tbWFuZEdhaW46IDEuMTgsCiAgICBkYW1hZ2VUYWtlbjogMC45OCwKICAgIGNvbG9yQTogMHg5MWRjZmYsCiAgICBjb2xvckI6IDB4MmI2Zjk4LAogICAgc2lsaG91ZXR0ZTogInNob3J0Um9kIgogIH0KfTsKCmV4cG9ydCBjb25zdCBDT01NQU5EUzogUmVjb3JkPHN0cmluZywgQ29tbWFuZERlZmluaXRpb24+ID0gewogIHBnOiB7CiAgICBpZDogInBnIiwKICAgIGxhYmVsOiAiUEcgc3ludGhlc2lzIiwKICAgIHNob3J0TGFiZWw6ICJQRyIsCiAgICBjb3B5OiAiQnVpbGRzIHdhbGwgbWF0ZXJpYWwgYW5kIHNjb3JlcyBmb3Igc2FmZSByb3V0aW5nLiIsCiAgICBjb2xvcjogIiNhOGZmZGYiCiAgfSwKICBtZW1icmFuZTogewogICAgaWQ6ICJtZW1icmFuZSIsCiAgICBsYWJlbDogIk1lbWJyYW5lIHJlcGFpciIsCiAgICBzaG9ydExhYmVsOiAiUmVwYWlyIiwKICAgIGNvcHk6ICJSZXN0b3JlcyBpbnRlZ3JpdHkgYW5kIHNlYWxzIHJ1cHR1cmUgcHJlc3N1cmUuIiwKICAgIGNvbG9yOiAiIzllZTlmZiIKICB9LAogIHBoYWdlOiB7CiAgICBpZDogInBoYWdlIiwKICAgIGxhYmVsOiAiUGhhZ2UgZGVmZW5zZSIsCiAgICBzaG9ydExhYmVsOiAiRGVmZW5zZSIsCiAgICBjb3B5OiAiQ2xlYXJzIGF0dGFjaGVkIHBoYWdlcyBhbmQgd2Vha2VucyBzd2FybXMuIiwKICAgIGNvbG9yOiAiI2ZmZDY4YSIKICB9LAogIG1vdGlsaXR5OiB7CiAgICBpZDogIm1vdGlsaXR5IiwKICAgIGxhYmVsOiAiTW90aWxpdHkiLAogICAgc2hvcnRMYWJlbDogIk1vdGlsaXR5IiwKICAgIGNvcHk6ICJDcmVhdGVzIGEgZmFzdCBldmFzaXZlIGJ1cnN0IHRocm91Z2ggc3RyZXNzIGZyb250cy4iLAogICAgY29sb3I6ICIjZmZjMGQyIgogIH0KfTsKCmV4cG9ydCBjb25zdCBQSEFTRVM6IFBoYXNlRGVmaW5pdGlvbltdID0gWwogIHsKICAgIGlkOiAic2xpZGVUcmFpbmluZyIsCiAgICB0aXRsZTogIlNsaWRlIGNhbGlicmF0aW9uIiwKICAgIG9iamVjdGl2ZTogIkNhcnJ5IGFzc2F5IGJlYWRzIGJhY2sgdG8gdGhlIHNsaWRlIGNoZWNrcG9pbnQuIiwKICAgIHRhcmdldFpvbmU6ICJwaXBldHRlWm9uZSIsCiAgICBzdGFydHNBdDogMCwKICAgIHRhcmdldDogMywKICAgIGJvc3M6ICJNaWNyb3Njb3BlIHNsaWRlIHByZXNzdXJlIHB1bHNlIiwKICAgIHRpbnQ6IDB4MGIzNDQzLAogICAgcHJlc3N1cmU6ICJPcmllbnRhdGlvbiIKICB9LAogIHsKICAgIGlkOiAicGlwZXR0ZVB1bHNlIiwKICAgIHRpdGxlOiAiUGlwZXR0ZSBwdWxzZSIsCiAgICBvYmplY3RpdmU6ICJTdGVhbCBzdGVyaWxlIHRpcHMgYW5kIGRlcG9zaXQgdGhlbSBvbiB0aGUgc2xpZGUuIiwKICAgIHRhcmdldFpvbmU6ICJwaXBldHRlWm9uZSIsCiAgICBzdGFydHNBdDogMzAsCiAgICB0YXJnZXQ6IDUsCiAgICBib3NzOiAiVGltZWQgcmVhZ2VudCBzdHJlYW0iLAogICAgdGludDogMHgxNzNkNTgsCiAgICBwcmVzc3VyZTogIkRyb3BsZXQgcHJlc3N1cmUiCiAgfSwKICB7CiAgICBpZDogInBldHJpQmxvb20iLAogICAgdGl0bGU6ICJQbGFxdWUgYXNzYXkgYmxvb20iLAogICAgb2JqZWN0aXZlOiAiVGFnIHBsYXF1ZXMgb24gdGhlIGFnYXIgYW5kIHB1cmdlIGNsdXN0ZXJlZCBwaGFnZS4iLAogICAgdGFyZ2V0Wm9uZTogInBldHJpRGlzaCIsCiAgICBzdGFydHNBdDogNzgsCiAgICB0YXJnZXQ6IDYsCiAgICBib3NzOiAiRXhwYW5kaW5nIHBoYWdlIHBsYXF1ZSIsCiAgICB0aW50OiAweDNkMzQyMCwKICAgIHByZXNzdXJlOiAiUGhhZ2UgYmxvb20iCiAgfSwKICB7CiAgICBpZDogImZlcm5iYWNoQ3VycmVudCIsCiAgICB0aXRsZTogIkZlcm5iYWNoIGN1cnJlbnQiLAogICAgb2JqZWN0aXZlOiAiQ2FycnkgcmVhZ2VudCBkcm9wbGV0cyB0aHJvdWdoIG1lZGlhIGN1cnJlbnRzIGFuZCBzdGFiaWxpemUgc3BpbGxzLiIsCiAgICB0YXJnZXRab25lOiAiZmVybmJhY2hGbGFzayIsCiAgICBzdGFydHNBdDogMTE4LAogICAgdGFyZ2V0OiA1LAogICAgYm9zczogIlN3aXJsaW5nIG1lZGlhIGxlYWsiLAogICAgdGludDogMHgxNzNmMzksCiAgICBwcmVzc3VyZTogIk1lZGlhIGN1cnJlbnQiCiAgfSwKICB7CiAgICBpZDogImNlbnRyaWZ1Z2VTd2VlcCIsCiAgICB0aXRsZTogIlJvdG9yIGNyb3NzaW5nIiwKICAgIG9iamVjdGl2ZTogIkNyb3NzIHNhZmUgcG9ja2V0cywgY29sbGVjdCB0aGUgc2FtcGxlLCBhbmQgZXNjYXBlIHNwaW4tdXAuIiwKICAgIHRhcmdldFpvbmU6ICJjZW50cmlmdWdlIiwKICAgIHN0YXJ0c0F0OiAxMzAsCiAgICB0YXJnZXQ6IDQsCiAgICBib3NzOiAiUm90b3Igc3dlZXAiLAogICAgdGludDogMHgyNzM2NWEsCiAgICBwcmVzc3VyZTogIk1lY2hhbmljYWwgc2hlYXIiCiAgfSwKICB7CiAgICBpZDogInJhY2tTZWFsIiwKICAgIHRpdGxlOiAiUmFjayBydXB0dXJlIHJvdXRlIiwKICAgIG9iamVjdGl2ZTogIk5hdmlnYXRlIHRoZSByYWNrIGFuZCBzZWFsIHRocmVlIGdyb3dpbmcgcnVwdHVyZSBzaXRlcy4iLAogICAgdGFyZ2V0Wm9uZTogInR1YmVSYWNrIiwKICAgIHN0YXJ0c0F0OiAxOTAsCiAgICB0YXJnZXQ6IDMsCiAgICBib3NzOiAiVHViZS1yYWNrIHJ1cHR1cmUgY2FzY2FkZSIsCiAgICB0aW50OiAweDU2MzY1NywKICAgIHByZXNzdXJlOiAiV2FsbCBydXB0dXJlIgogIH0sCiAgewogICAgaWQ6ICJseXNpc1N0b3JtIiwKICAgIHRpdGxlOiAiRmluYWwgbHlzaXMgc3Rvcm0iLAogICAgb2JqZWN0aXZlOiAiQ2hhaW4gZGVwb3NpdHMgYWNyb3NzIHRoZSBiZW5jaCB3aGlsZSBzdXJ2aXZpbmcgY29sbGFwc2UuIiwKICAgIHRhcmdldFpvbmU6ICJtaWNyb3Njb3BlU2xpZGUiLAogICAgc3RhcnRzQXQ6IDI2MCwKICAgIHRhcmdldDogOCwKICAgIGJvc3M6ICJXaG9sZS1iZW5jaCBseXNpcyBzdG9ybSIsCiAgICB0aW50OiAweDZlMmUzYSwKICAgIHByZXNzdXJlOiAiTHl0aWMgY29sbGFwc2UiCiAgfQpdOwoKZXhwb3J0IGNvbnN0IFVQR1JBREVTOiBSZWNvcmQ8c3RyaW5nLCBVcGdyYWRlRGVmaW5pdGlvbj4gPSB7CiAgInBvbkEtb3ZlcmRyaXZlIjogewogICAgaWQ6ICJwb25BLW92ZXJkcml2ZSIsCiAgICB0aXRsZTogIlBCUDFiIG92ZXJkcml2ZSIsCiAgICBjb3B5OiAiUEcgc3ludGhlc2lzIHJlcGFpcnMgbW9yZSBpbnRlZ3JpdHkgYW5kIHNjb3JlcyBtb3JlIGR1cmluZyBiZXRhLWxhY3RhbSBmcm9udHMuIiwKICAgIGNvbW1hbmQ6ICJwZyIKICB9LAogICJscG9CLXRldGhlciI6IHsKICAgIGlkOiAibHBvQi10ZXRoZXIiLAogICAgdGl0bGU6ICJMcG9CIHRldGhlcmluZyIsCiAgICBjb3B5OiAiUEcgc3ludGhlc2lzIGdyYW50cyBhIGJyaWVmIHNoaWVsZCBhZnRlciBlYWNoIHdhbGwgY3ljbGUuIiwKICAgIGNvbW1hbmQ6ICJwZyIKICB9LAogICJiYWN0b3ByZW5vbC1mbG93IjogewogICAgaWQ6ICJiYWN0b3ByZW5vbC1mbG93IiwKICAgIHRpdGxlOiAiQmFjdG9wcmVub2wgZmxvdyIsCiAgICBjb3B5OiAiUGlja3VwcyBhZGQgZXh0cmEgY29tbWFuZCBjaGFyZ2UgYW5kIGRyaWZ0IHRvd2FyZCB0aGUgY2VsbC4iLAogICAgY29tbWFuZDogInBnIgogIH0sCiAgIm9tcC1idWZmZXIiOiB7CiAgICBpZDogIm9tcC1idWZmZXIiLAogICAgdGl0bGU6ICJPdXRlci1tZW1icmFuZSBidWZmZXIiLAogICAgY29weTogIk1lbWJyYW5lIHJlcGFpciByZWR1Y2VzIHJ1cHR1cmUtem9uZSBkYW1hZ2UuIiwKICAgIGNvbW1hbmQ6ICJtZW1icmFuZSIKICB9LAogICJyZXN0cmljdGlvbi1idXJzdCI6IHsKICAgIGlkOiAicmVzdHJpY3Rpb24tYnVyc3QiLAogICAgdGl0bGU6ICJSZXN0cmljdGlvbiBidXJzdCIsCiAgICBjb3B5OiAiUGhhZ2UgZGVmZW5zZSBjbGVhcnMgYSB3aWRlciBhcmVhIGFuZCBzY29yZXMgZm9yIGV2ZXJ5IGNsZWFyZWQgcGhhZ2UuIiwKICAgIGNvbW1hbmQ6ICJwaGFnZSIKICB9LAogICJjaGVtb3JlZmxleCI6IHsKICAgIGlkOiAiY2hlbW9yZWZsZXgiLAogICAgdGl0bGU6ICJDaGVtb3JlZmxleCIsCiAgICBjb3B5OiAiTW90aWxpdHkgY29tbWFuZCBsYXN0cyBsb25nZXIgYW5kIGRhc2ggY29vbGRvd25zIHJlY292ZXIgZmFzdGVyLiIsCiAgICBjb21tYW5kOiAibW90aWxpdHkiCiAgfSwKICAiYXV0b2x5c2luLWJyYWtlIjogewogICAgaWQ6ICJhdXRvbHlzaW4tYnJha2UiLAogICAgdGl0bGU6ICJBdXRvbHlzaW4gYnJha2UiLAogICAgY29weTogIkNyYWNrIGRhbWFnZSBhbmQgYnJlYWNoIGdyb3d0aCBzbG93IGFmdGVyIGV2ZXJ5IGNvbW1hbmQuIiwKICAgIGNvbW1hbmQ6ICJtZW1icmFuZSIKICB9LAogICJjYXBzdWxlLXN1cmdlIjogewogICAgaWQ6ICJjYXBzdWxlLXN1cmdlIiwKICAgIHRpdGxlOiAiQ2Fwc3VsZSBzdXJnZSIsCiAgICBjb3B5OiAiRGFtYWdlIHRha2VuIGlzIGxvd2VyIHdoaWxlIGNvbW1hbmQgY2hhcmdlIGlzIGFib3ZlIGhhbGYuIiwKICAgIGNvbW1hbmQ6ICJtZW1icmFuZSIKICB9LAogICJtcmVCLWFsaWdubWVudCI6IHsKICAgIGlkOiAibXJlQi1hbGlnbm1lbnQiLAogICAgdGl0bGU6ICJNcmVCIGFsaWdubWVudCIsCiAgICBjb3B5OiAiTW92ZW1lbnQgaXMgY2xlYW5lciBhbmQgbmVhciBtaXNzZXMgYWRkIHNjb3JlLiIsCiAgICBjb21tYW5kOiAibW90aWxpdHkiCiAgfQp9Owo=", DC = "data:video/mp2t;base64,ZXhwb3J0ICogZnJvbSAiLi9mb3VuZGF0aW9uIjsK", XC = "data:video/mp2t;base64,aW1wb3J0IHsgbm9ybWFsaXplQm9hcmQgfSBmcm9tICIuL3NpbXVsYXRpb24iOwppbXBvcnQgdHlwZSB7IExlYWRlcmJvYXJkUGF5bG9hZCwgU2NvcmVFbnRyeSB9IGZyb20gIi4vdHlwZXMiOwoKY29uc3QgU1RPUkFHRV9QUkVGSVggPSAiYmVybmhhcmR0LWVudmVsb3BlLWVzY2FwZS12My1ib2FyZC0iOwpjb25zdCBSRVFVRVNUX1RJTUVPVVRfTVMgPSA5MDAwOwoKZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxlYWRlcmJvYXJkQ2xpZW50KHsgdXJsID0gIiIgfTogeyB1cmw/OiBzdHJpbmcgfSkgewogIGNvbnN0IGVuZHBvaW50ID0gU3RyaW5nKHVybCB8fCAiIikudHJpbSgpOwoKICBhc3luYyBmdW5jdGlvbiByZWZyZXNoKGJvYXJkID0gImNsYXNzaWMiKTogUHJvbWlzZTxMZWFkZXJib2FyZFBheWxvYWQ+IHsKICAgIGNvbnN0IG5vcm1hbGl6ZWRCb2FyZCA9IG5vcm1hbGl6ZUJvYXJkKGJvYXJkKTsKICAgIGNvbnN0IGxvY2FsID0gcmVhZExvY2FsKG5vcm1hbGl6ZWRCb2FyZCk7CiAgICBpZiAoIWVuZHBvaW50KSByZXR1cm4gcGF5bG9hZChsb2NhbCwgbm9ybWFsaXplZEJvYXJkLCAibG9jYWwiKTsKICAgIHRyeSB7CiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdEpzb24oYCR7ZW5kcG9pbnR9P2JvYXJkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KG5vcm1hbGl6ZWRCb2FyZCl9YCk7CiAgICAgIGNvbnN0IGVudHJpZXMgPSBub3JtYWxpemVFbnRyaWVzKHJlc3BvbnNlPy5lbnRyaWVzLCBub3JtYWxpemVkQm9hcmQpOwogICAgICB3cml0ZUxvY2FsKG5vcm1hbGl6ZWRCb2FyZCwgZW50cmllcyk7CiAgICAgIHJldHVybiB7CiAgICAgICAgZW50cmllcywKICAgICAgICB0b3RhbEVudHJpZXM6IE1hdGgubWF4KGVudHJpZXMubGVuZ3RoLCBNYXRoLmZsb29yKE51bWJlcihyZXNwb25zZT8udG90YWxFbnRyaWVzKSB8fCAwKSksCiAgICAgICAgdXBkYXRlZEF0OiBNYXRoLmZsb29yKE51bWJlcihyZXNwb25zZT8udXBkYXRlZEF0KSB8fCBEYXRlLm5vdygpKSwKICAgICAgICBib2FyZDogbm9ybWFsaXplQm9hcmQocmVzcG9uc2U/LmJvYXJkIHx8IG5vcm1hbGl6ZWRCb2FyZCksCiAgICAgICAgbW9kZTogImdsb2JhbCIKICAgICAgfTsKICAgIH0gY2F0Y2ggewogICAgICByZXR1cm4gcGF5bG9hZChsb2NhbCwgbm9ybWFsaXplZEJvYXJkLCAiZmFsbGJhY2siKTsKICAgIH0KICB9CgogIGFzeW5jIGZ1bmN0aW9uIHN1Ym1pdChlbnRyeTogU2NvcmVFbnRyeSk6IFByb21pc2U8TGVhZGVyYm9hcmRQYXlsb2FkPiB7CiAgICBjb25zdCBub3JtYWxpemVkRW50cnkgPSBub3JtYWxpemVFbnRyeShlbnRyeSwgbm9ybWFsaXplQm9hcmQoZW50cnkuYm9hcmQpKTsKICAgIGNvbnN0IGxvY2FsRW50cmllcyA9IG5vcm1hbGl6ZUVudHJpZXMoW25vcm1hbGl6ZWRFbnRyeSwgLi4ucmVhZExvY2FsKG5vcm1hbGl6ZWRFbnRyeS5ib2FyZCldLCBub3JtYWxpemVkRW50cnkuYm9hcmQpOwogICAgd3JpdGVMb2NhbChub3JtYWxpemVkRW50cnkuYm9hcmQsIGxvY2FsRW50cmllcyk7CiAgICBpZiAoIWVuZHBvaW50KSByZXR1cm4geyAuLi5wYXlsb2FkKGxvY2FsRW50cmllcywgbm9ybWFsaXplZEVudHJ5LmJvYXJkLCAibG9jYWwiKSwgcmFuazogcmFuayhsb2NhbEVudHJpZXMsIG5vcm1hbGl6ZWRFbnRyeSkgfTsKICAgIHRyeSB7CiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdEpzb24oZW5kcG9pbnQsIHsKICAgICAgICBtZXRob2Q6ICJQT1NUIiwKICAgICAgICBoZWFkZXJzOiB7ICJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiIgfSwKICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShub3JtYWxpemVkRW50cnkpCiAgICAgIH0pOwogICAgICBjb25zdCBlbnRyaWVzID0gbm9ybWFsaXplRW50cmllcyhyZXNwb25zZT8uZW50cmllcywgbm9ybWFsaXplZEVudHJ5LmJvYXJkKTsKICAgICAgd3JpdGVMb2NhbChub3JtYWxpemVkRW50cnkuYm9hcmQsIGVudHJpZXMpOwogICAgICByZXR1cm4gewogICAgICAgIGVudHJpZXMsCiAgICAgICAgdG90YWxFbnRyaWVzOiBNYXRoLm1heChlbnRyaWVzLmxlbmd0aCwgTWF0aC5mbG9vcihOdW1iZXIocmVzcG9uc2U/LnRvdGFsRW50cmllcykgfHwgMCkpLAogICAgICAgIHVwZGF0ZWRBdDogTWF0aC5mbG9vcihOdW1iZXIocmVzcG9uc2U/LnVwZGF0ZWRBdCkgfHwgRGF0ZS5ub3coKSksCiAgICAgICAgYm9hcmQ6IG5vcm1hbGl6ZUJvYXJkKHJlc3BvbnNlPy5ib2FyZCB8fCBub3JtYWxpemVkRW50cnkuYm9hcmQpLAogICAgICAgIG1vZGU6ICJnbG9iYWwiLAogICAgICAgIHJhbms6IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoTnVtYmVyKHJlc3BvbnNlPy5yYW5rKSB8fCByYW5rKGVudHJpZXMsIG5vcm1hbGl6ZWRFbnRyeSkpKQogICAgICB9OwogICAgfSBjYXRjaCB7CiAgICAgIHJldHVybiB7IC4uLnBheWxvYWQobG9jYWxFbnRyaWVzLCBub3JtYWxpemVkRW50cnkuYm9hcmQsICJmYWxsYmFjayIpLCByYW5rOiByYW5rKGxvY2FsRW50cmllcywgbm9ybWFsaXplZEVudHJ5KSB9OwogICAgfQogIH0KCiAgcmV0dXJuIHsgcmVmcmVzaCwgc3VibWl0LCByZWFkTG9jYWwsIHdyaXRlTG9jYWwgfTsKfQoKZnVuY3Rpb24gcGF5bG9hZChlbnRyaWVzOiBTY29yZUVudHJ5W10sIGJvYXJkOiBzdHJpbmcsIG1vZGU6IExlYWRlcmJvYXJkUGF5bG9hZFsibW9kZSJdKTogTGVhZGVyYm9hcmRQYXlsb2FkIHsKICByZXR1cm4geyBlbnRyaWVzLCB0b3RhbEVudHJpZXM6IGVudHJpZXMubGVuZ3RoLCB1cGRhdGVkQXQ6IERhdGUubm93KCksIGJvYXJkLCBtb2RlIH07Cn0KCmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RKc29uKHVybDogc3RyaW5nLCBvcHRpb25zOiBSZXF1ZXN0SW5pdCA9IHt9KTogUHJvbWlzZTxhbnk+IHsKICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpOwogIGNvbnN0IHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIFJFUVVFU1RfVElNRU9VVF9NUyk7CiAgdHJ5IHsKICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgd2luZG93LmZldGNoKHVybCwgeyAuLi5vcHRpb25zLCBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsIH0pOwogICAgaWYgKCFyZXNwb25zZS5vaykgdGhyb3cgbmV3IEVycm9yKGBMZWFkZXJib2FyZCByZXF1ZXN0IGZhaWxlZDogJHtyZXNwb25zZS5zdGF0dXN9YCk7CiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpOwogIH0gZmluYWxseSB7CiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpOwogIH0KfQoKZnVuY3Rpb24gcmVhZExvY2FsKGJvYXJkOiBzdHJpbmcpOiBTY29yZUVudHJ5W10gewogIHRyeSB7CiAgICByZXR1cm4gbm9ybWFsaXplRW50cmllcyhKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHtTVE9SQUdFX1BSRUZJWH0ke25vcm1hbGl6ZUJvYXJkKGJvYXJkKX1gKSB8fCAiW10iKSwgYm9hcmQpOwogIH0gY2F0Y2ggewogICAgcmV0dXJuIFtdOwogIH0KfQoKZnVuY3Rpb24gd3JpdGVMb2NhbChib2FyZDogc3RyaW5nLCBlbnRyaWVzOiBTY29yZUVudHJ5W10pOiB2b2lkIHsKICB0cnkgewogICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke1NUT1JBR0VfUFJFRklYfSR7bm9ybWFsaXplQm9hcmQoYm9hcmQpfWAsIEpTT04uc3RyaW5naWZ5KG5vcm1hbGl6ZUVudHJpZXMoZW50cmllcywgYm9hcmQpLnNsaWNlKDAsIDI1KSkpOwogIH0gY2F0Y2ggewogICAgLyogbm8tb3AgKi8KICB9Cn0KCmZ1bmN0aW9uIG5vcm1hbGl6ZUVudHJpZXModmFsdWU6IHVua25vd24sIGJvYXJkOiBzdHJpbmcpOiBTY29yZUVudHJ5W10gewogIGNvbnN0IHJvd3MgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW107CiAgcmV0dXJuIHJvd3MubWFwKChpdGVtKSA9PiBub3JtYWxpemVFbnRyeShpdGVtLCBib2FyZCkpLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlIHx8IGIucGxheWVkQXQgLSBhLnBsYXllZEF0KS5zbGljZSgwLCAyNSk7Cn0KCmZ1bmN0aW9uIG5vcm1hbGl6ZUVudHJ5KHZhbHVlOiB1bmtub3duLCBmYWxsYmFja0JvYXJkOiBzdHJpbmcpOiBTY29yZUVudHJ5IHsKICBjb25zdCBpdGVtID0gKHZhbHVlIHx8IHt9KSBhcyBQYXJ0aWFsPFNjb3JlRW50cnk+OwogIHJldHVybiB7CiAgICBuYW1lOiBTdHJpbmcoaXRlbS5uYW1lIHx8ICJBbm9ueW1vdXMiKS5zbGljZSgwLCAyNCksCiAgICBzY29yZTogTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihOdW1iZXIoaXRlbS5zY29yZSkgfHwgMCkpLAogICAgc3BlY2llczogaXRlbS5zcGVjaWVzIHx8ICJlY29saSIsCiAgICBwbGF5ZWRBdDogTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihOdW1iZXIoaXRlbS5wbGF5ZWRBdCkgfHwgRGF0ZS5ub3coKSkpLAogICAgYm9hcmQ6IG5vcm1hbGl6ZUJvYXJkKGl0ZW0uYm9hcmQgfHwgZmFsbGJhY2tCb2FyZCkKICB9Owp9CgpmdW5jdGlvbiByYW5rKGVudHJpZXM6IFNjb3JlRW50cnlbXSwgZW50cnk6IFNjb3JlRW50cnkpOiBudW1iZXIgewogIGNvbnN0IGluZGV4ID0gZW50cmllcy5maW5kSW5kZXgoKGl0ZW0pID0+IGl0ZW0ucGxheWVkQXQgPT09IGVudHJ5LnBsYXllZEF0ICYmIGl0ZW0uc2NvcmUgPT09IGVudHJ5LnNjb3JlICYmIGl0ZW0ubmFtZSA9PT0gZW50cnkubmFtZSk7CiAgcmV0dXJuIGluZGV4ID49IDAgPyBpbmRleCArIDEgOiBNYXRoLm1heCgxLCBlbnRyaWVzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5zY29yZSA+IGVudHJ5LnNjb3JlKS5sZW5ndGggKyAxKTsKfQo=", HC = "data:video/mp2t;base64,aW1wb3J0IHsgQ09NTUFORFMsIFNQRUNJRVMsIFNQRUNJRVNfT1JERVIsIFVQR1JBREVTIH0gZnJvbSAiLi9jb250ZW50IjsKaW1wb3J0IHsgY3JlYXRlQXVkaW9Db250cm9sbGVyIH0gZnJvbSAiLi9hdWRpbyI7CmltcG9ydCB7IGNyZWF0ZUxlYWRlcmJvYXJkQ2xpZW50IH0gZnJvbSAiLi9sZWFkZXJib2FyZCI7CmltcG9ydCB7IGNyZWF0ZVYzUmVuZGVyZXIsIHR5cGUgVjNSZW5kZXJlciB9IGZyb20gIi4vcmVuZGVyIjsKaW1wb3J0IHsgbG9hZFYzQXNzZXRSZWdpc3RyeSwgdHlwZSBWM0Fzc2V0UmVnaXN0cnkgfSBmcm9tICIuL3JlbmRlci9hc3NldHMiOwppbXBvcnQgeyBkZXRlY3RFbnZlbG9wZVYzV2ViR0xTdXBwb3J0IH0gZnJvbSAiLi9yZW5kZXIvd2ViZ2wtc3VwcG9ydCI7CmltcG9ydCB7IFYzU2ltdWxhdGlvbiwgY3JlYXRlSW5wdXRTdGF0ZSB9IGZyb20gIi4vc2ltdWxhdGlvbiI7CmltcG9ydCB0eXBlIHsgQ29tbWFuZElkLCBIdWRTbmFwc2hvdCwgSW5wdXRTdGF0ZSwgTGVhZGVyYm9hcmRQYXlsb2FkLCBSdW5SZXBvcnQsIFJ1blN0YXR1cywgVXBncmFkZUlkIH0gZnJvbSAiLi90eXBlcyI7CmltcG9ydCB7IGVuc3VyZUVudmVsb3BlVjNTdHlsZXNoZWV0LCBvcGVuRW52ZWxvcGVWM0ZhbGxiYWNrIH0gZnJvbSAiLi91aS9mYWxsYmFja05vdGljZSI7CgpkZWNsYXJlIGdsb2JhbCB7CiAgaW50ZXJmYWNlIFdpbmRvdyB7CiAgICBFTlZFTE9QRV9MRUFERVJCT0FSRF9VUkw/OiBzdHJpbmc7CiAgfQp9Cgpjb25zdCBMQUJfVElNRVpPTkUgPSAiQW1lcmljYS9OZXdfWW9yayI7CmNvbnN0IE5BTUVfS0VZID0gImJlcm5oYXJkdC1lbnZlbG9wZS1lc2NhcGUtdjMtbmFtZSI7CmNvbnN0IE1PVElPTl9LRVkgPSAiYmVybmhhcmR0LWVudmVsb3BlLWVzY2FwZS12My1tb3Rpb24iOwoKbGV0IGFjdGl2ZTogRW52ZWxvcGVWM0NvbnRyb2xsZXIgfCBudWxsID0gbnVsbDsKCmludGVyZmFjZSBPcGVuT3B0aW9ucyB7CiAgZm9yY2U/OiBib29sZWFuOwogIG1vZGU/OiAiY2xhc3NpYyIgfCAiZGFpbHkiOwogIHNwZWNpZXNJZD86IHN0cmluZzsKfQoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5FbnZlbG9wZUVzY2FwZVYzKG9wdGlvbnM6IE9wZW5PcHRpb25zID0ge30pOiBQcm9taXNlPHsgb2s6IGJvb2xlYW47IHJlYXNvbj86IHN0cmluZzsgY29udHJvbGxlcj86IEVudmVsb3BlVjNDb250cm9sbGVyIH0+IHsKICBlbnN1cmVFbnZlbG9wZVYzU3R5bGVzaGVldCgpOwogIGNvbnN0IHN1cHBvcnQgPSBkZXRlY3RFbnZlbG9wZVYzV2ViR0xTdXBwb3J0KCk7CiAgaWYgKCFvcHRpb25zLmZvcmNlICYmICFzdXBwb3J0Lm9rKSB7CiAgICBvcGVuRW52ZWxvcGVWM0ZhbGxiYWNrKHN1cHBvcnQucmVhc29uKTsKICAgIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBzdXBwb3J0LnJlYXNvbiB9OwogIH0KICBpZiAoYWN0aXZlKSB7CiAgICBhY3RpdmUub3BlbigpOwogICAgcmV0dXJuIHsgb2s6IHRydWUsIGNvbnRyb2xsZXI6IGFjdGl2ZSB9OwogIH0KICBjb25zdCBhc3NldFJlZ2lzdHJ5ID0gYXdhaXQgbG9hZFYzQXNzZXRSZWdpc3RyeSgpOwogIGFjdGl2ZSA9IG5ldyBFbnZlbG9wZVYzQ29udHJvbGxlcihvcHRpb25zLCBhc3NldFJlZ2lzdHJ5KTsKICBhY3RpdmUub3BlbigpOwogIHJldHVybiB7IG9rOiB0cnVlLCBjb250cm9sbGVyOiBhY3RpdmUgfTsKfQoKZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lFbnZlbG9wZUVzY2FwZVYzKCk6IHZvaWQgewogIGFjdGl2ZT8uZGVzdHJveSgpOwogIGFjdGl2ZSA9IG51bGw7Cn0KCmNsYXNzIEVudmVsb3BlVjNDb250cm9sbGVyIHsKICBwcml2YXRlIHJlYWRvbmx5IGRpYWxvZzogSFRNTERpYWxvZ0VsZW1lbnQ7CiAgcHJpdmF0ZSByZWFkb25seSByZWZzOiBSZXR1cm5UeXBlPHR5cGVvZiBjb2xsZWN0UmVmcz47CiAgcHJpdmF0ZSByZWFkb25seSBzaW0gPSBuZXcgVjNTaW11bGF0aW9uKCk7CiAgcHJpdmF0ZSByZWFkb25seSBpbnB1dCA9IGNyZWF0ZUlucHV0U3RhdGUoKTsKICBwcml2YXRlIHJlYWRvbmx5IGF1ZGlvID0gY3JlYXRlQXVkaW9Db250cm9sbGVyKCk7CiAgcHJpdmF0ZSByZWFkb25seSBsZWFkZXJib2FyZCA9IGNyZWF0ZUxlYWRlcmJvYXJkQ2xpZW50KHsgdXJsOiBTdHJpbmcod2luZG93LkVOVkVMT1BFX0xFQURFUkJPQVJEX1VSTCB8fCAiIikgfSk7CiAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjogVjNSZW5kZXJlcjsKICBwcml2YXRlIHJlYWRvbmx5IHJlc2l6ZU9ic2VydmVyOiBSZXNpemVPYnNlcnZlcjsKICBwcml2YXRlIHJlYWRvbmx5IHNlZW5FZmZlY3RzID0gbmV3IFNldDxudW1iZXI+KCk7CiAgcHJpdmF0ZSBmcmFtZSA9IDA7CiAgcHJpdmF0ZSBsYXN0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpOwogIHByaXZhdGUgcmVwb3J0UmVuZGVyZWQgPSBmYWxzZTsKICBwcml2YXRlIHVwZ3JhZGVzUmVuZGVyZWRLZXkgPSAiIjsKCiAgY29uc3RydWN0b3Iob3B0aW9uczogT3Blbk9wdGlvbnMsIGFzc2V0UmVnaXN0cnk6IFYzQXNzZXRSZWdpc3RyeSkgewogICAgdGhpcy5kaWFsb2cgPSBjcmVhdGVEaWFsb2coKTsKICAgIHRoaXMucmVmcyA9IGNvbGxlY3RSZWZzKHRoaXMuZGlhbG9nKTsKICAgIHRoaXMucmVuZGVyZXIgPSBjcmVhdGVWM1JlbmRlcmVyKHRoaXMucmVmcy5nYW1lUm9vdCwgYXNzZXRSZWdpc3RyeSk7CiAgICB0aGlzLnJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHRoaXMucmVuZGVyZXIucmVzaXplKCkpOwogICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMucmVmcy5nYW1lUm9vdCk7CiAgICBwb3B1bGF0ZVNwZWNpZXModGhpcy5yZWZzLnNwZWNpZXMpOwogICAgdGhpcy5yZWZzLm5hbWUudmFsdWUgPSByZWFkVGV4dChOQU1FX0tFWSk7CiAgICB0aGlzLnJlZnMubW90aW9uLnZhbHVlID0gcmVhZFRleHQoTU9USU9OX0tFWSkgfHwgImZ1bGwiOwogICAgdGhpcy5iaW5kKCk7CiAgICB0aGlzLnJlbmRlck1lbnUoKTsKICAgIGlmIChvcHRpb25zLm1vZGUpIHRoaXMuc3RhcnRSdW4ob3B0aW9ucy5tb2RlLCBvcHRpb25zLnNwZWNpZXNJZCB8fCB0aGlzLnJlZnMuc3BlY2llcy52YWx1ZSk7CiAgfQoKICBvcGVuKCk6IHZvaWQgewogICAgaWYgKCF0aGlzLmRpYWxvZy5vcGVuKSB0aGlzLmRpYWxvZy5zaG93TW9kYWwoKTsKICAgIHRoaXMucmVuZGVyZXIucmVzaXplKCk7CiAgICB0aGlzLmxvb3AoKTsKICAgIHZvaWQgdGhpcy5yZWZyZXNoU2NvcmVzKCJjbGFzc2ljIik7CiAgfQoKICBkZXN0cm95KCk6IHZvaWQgewogICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5mcmFtZSk7CiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigia2V5ZG93biIsIHRoaXMub25LZXlEb3duKTsKICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCJrZXl1cCIsIHRoaXMub25LZXlVcCk7CiAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTsKICAgIHRoaXMucmVuZGVyZXIuZGlzcG9zZSgpOwogICAgdGhpcy5kaWFsb2cucmVtb3ZlKCk7CiAgICBpZiAoYWN0aXZlID09PSB0aGlzKSBhY3RpdmUgPSBudWxsOwogIH0KCiAgcHJpdmF0ZSBiaW5kKCk6IHZvaWQgewogICAgdGhpcy5yZWZzLmNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKCkgPT4gdGhpcy5kaWFsb2cuY2xvc2UoKSk7CiAgICB0aGlzLmRpYWxvZy5hZGRFdmVudExpc3RlbmVyKCJjbG9zZSIsICgpID0+IHRoaXMuZGVzdHJveSgpKTsKICAgIHRoaXMucmVmcy5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoImlucHV0IiwgKCkgPT4gd3JpdGVUZXh0KE5BTUVfS0VZLCB0aGlzLnJlZnMubmFtZS52YWx1ZSkpOwogICAgdGhpcy5yZWZzLm1vdGlvbi5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLCAoKSA9PiB7CiAgICAgIHdyaXRlVGV4dChNT1RJT05fS0VZLCB0aGlzLnJlZnMubW90aW9uLnZhbHVlKTsKICAgICAgdGhpcy5kaWFsb2cuY2xhc3NMaXN0LnRvZ2dsZSgiaXMtY2FsbS1tb3Rpb24iLCB0aGlzLnJlZnMubW90aW9uLnZhbHVlICE9PSAiZnVsbCIpOwogICAgfSk7CiAgICB0aGlzLnJlZnMuc291bmQuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB7CiAgICAgIHRoaXMuYXVkaW8uc2V0RW5hYmxlZCghdGhpcy5hdWRpby5lbmFibGVkKTsKICAgICAgdGhpcy5yZWZzLnNvdW5kLnRleHRDb250ZW50ID0gdGhpcy5hdWRpby5lbmFibGVkID8gIlNvdW5kIE9uIiA6ICJTb3VuZCBPZmYiOwogICAgICB0aGlzLnJlZnMuc291bmQuc2V0QXR0cmlidXRlKCJhcmlhLXByZXNzZWQiLCBTdHJpbmcodGhpcy5hdWRpby5lbmFibGVkKSk7CiAgICB9KTsKICAgIHRoaXMucmVmcy5jbGFzc2ljLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKCkgPT4gdGhpcy5zdGFydFJ1bigiY2xhc3NpYyIsIHRoaXMucmVmcy5zcGVjaWVzLnZhbHVlKSk7CiAgICB0aGlzLnJlZnMuZGFpbHkuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB0aGlzLnN0YXJ0UnVuKCJkYWlseSIsIHRoaXMucmVmcy5zcGVjaWVzLnZhbHVlKSk7CiAgICB0aGlzLnJlZnMucGF1c2UuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB7CiAgICAgIHRoaXMuc2ltLnRvZ2dsZVBhdXNlKCk7CiAgICAgIHRoaXMucmVuZGVyU3RhdGUoKTsKICAgIH0pOwogICAgdGhpcy5yZWZzLnJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB0aGlzLnN0YXJ0UnVuKHRoaXMuc2ltLnN0YXRlLm1vZGUsIHRoaXMuc2ltLnN0YXRlLnNlbGVjdGVkU3BlY2llc0lkKSk7CiAgICB0aGlzLnJlZnMucmVmcmVzaFNjb3Jlcy5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsICgpID0+IHZvaWQgdGhpcy5yZWZyZXNoU2NvcmVzKHRoaXMuc2ltLnN0YXRlLmJvYXJkKSk7CiAgICB0aGlzLnJlZnMuc3VibWl0U2NvcmUuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB2b2lkIHRoaXMuc3VibWl0U2NvcmUoKSk7CiAgICB0aGlzLnJlZnMuY29tbWFuZEJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7CiAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsICgpID0+IHRoaXMudHJpZ2dlckNvbW1hbmQoYnV0dG9uLmRhdGFzZXQuY29tbWFuZCBhcyBDb21tYW5kSWQpKTsKICAgIH0pOwogICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoImtleWRvd24iLCB0aGlzLm9uS2V5RG93bik7CiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigia2V5dXAiLCB0aGlzLm9uS2V5VXApOwogIH0KCiAgcHJpdmF0ZSByZWFkb25seSBvbktleURvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHsKICAgIGlmICghdGhpcy5kaWFsb2cub3BlbiB8fCBldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50IHx8IGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSByZXR1cm47CiAgICBpZiAodGhpcy5zaW0uc3RhdGUuc3RhdHVzID09PSAidXBncmFkZSIpIHsKICAgICAgY29uc3QgdXBncmFkZUluZGV4ID0gWyIxIiwgIjIiLCAiMyJdLmluZGV4T2YoZXZlbnQua2V5KTsKICAgICAgaWYgKHVwZ3JhZGVJbmRleCA+PSAwKSB7CiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsKICAgICAgICB0aGlzLmNob29zZVVwZ3JhZGVCeUluZGV4KHVwZ3JhZGVJbmRleCk7CiAgICAgIH0KICAgICAgcmV0dXJuOwogICAgfQogICAgaWYgKGFwcGx5S2V5KHRoaXMuaW5wdXQsIGV2ZW50LCB0cnVlKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTsKICAgIGlmIChldmVudC5rZXkgPT09ICIxIikgdGhpcy50cmlnZ2VyQ29tbWFuZCgicGciKTsKICAgIGlmIChldmVudC5rZXkgPT09ICIyIikgdGhpcy50cmlnZ2VyQ29tbWFuZCgibWVtYnJhbmUiKTsKICAgIGlmIChldmVudC5rZXkgPT09ICIzIikgdGhpcy50cmlnZ2VyQ29tbWFuZCgicGhhZ2UiKTsKICAgIGlmIChldmVudC5rZXkgPT09ICI0IikgdGhpcy50cmlnZ2VyQ29tbWFuZCgibW90aWxpdHkiKTsKICAgIGlmIChldmVudC5rZXkudG9Mb3dlckNhc2UoKSA9PT0gInAiIHx8IGV2ZW50LmtleSA9PT0gIkVzY2FwZSIpIHsKICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsKICAgICAgdGhpcy5zaW0udG9nZ2xlUGF1c2UoKTsKICAgICAgdGhpcy5yZW5kZXJTdGF0ZSgpOwogICAgfQogIH07CgogIHByaXZhdGUgcmVhZG9ubHkgb25LZXlVcCA9IChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4gewogICAgaWYgKGFwcGx5S2V5KHRoaXMuaW5wdXQsIGV2ZW50LCBmYWxzZSkpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7CiAgfTsKCiAgcHJpdmF0ZSBzdGFydFJ1bihtb2RlOiAiY2xhc3NpYyIgfCAiZGFpbHkiLCBzcGVjaWVzSWQ6IHN0cmluZyk6IHZvaWQgewogICAgdGhpcy5yZXBvcnRSZW5kZXJlZCA9IGZhbHNlOwogICAgdGhpcy51cGdyYWRlc1JlbmRlcmVkS2V5ID0gIiI7CiAgICB0aGlzLnNlZW5FZmZlY3RzLmNsZWFyKCk7CiAgICB0aGlzLnNpbS5zdGFydCh7IG1vZGUsIHNwZWNpZXNJZCwgcGxheWVyTmFtZTogdGhpcy5yZWZzLm5hbWUudmFsdWUgfSk7CiAgICB0aGlzLnNpbS5iZWdpblJ1bigpOwogICAgdGhpcy5kaWFsb2cuY2xhc3NMaXN0LmFkZCgiaXMtcGxheWluZyIpOwogICAgdGhpcy5kaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgiaXMtZW5kZWQiLCAiaXMtdXBncmFkZSIpOwogICAgaGlkZSh0aGlzLnJlZnMubWVudSk7CiAgICBoaWRlKHRoaXMucmVmcy5yZXBvcnQpOwogICAgaGlkZSh0aGlzLnJlZnMudXBncmFkZXMpOwogICAgdGhpcy5hdWRpby5wbGF5KCJwaGFzZSIpOwogICAgdm9pZCB0aGlzLnJlZnJlc2hTY29yZXModGhpcy5zaW0uc3RhdGUuYm9hcmQpOwogICAgdGhpcy5yZW5kZXJTdGF0ZSgpOwogIH0KCiAgcHJpdmF0ZSB0cmlnZ2VyQ29tbWFuZChjb21tYW5kOiBDb21tYW5kSWQpOiB2b2lkIHsKICAgIGlmICh0aGlzLnNpbS50cmlnZ2VyQ29tbWFuZChjb21tYW5kKSkgewogICAgICB0aGlzLmlucHV0LmNvbW1hbmRXaGVlbCA9IGZhbHNlOwogICAgICB0aGlzLmF1ZGlvLnBsYXkoImNvbW1hbmQiKTsKICAgICAgdGhpcy5yZW5kZXJTdGF0ZSgpOwogICAgfQogIH0KCiAgcHJpdmF0ZSBsb29wID0gKCk6IHZvaWQgPT4gewogICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7CiAgICBjb25zdCBkdCA9IE1hdGgubWluKDAuMDUsIE1hdGgubWF4KDAsIChub3cgLSB0aGlzLmxhc3RUaW1lKSAvIDEwMDApKTsKICAgIHRoaXMubGFzdFRpbWUgPSBub3c7CiAgICB0aGlzLnNpbS5zZXRDb21tYW5kV2hlZWwodGhpcy5pbnB1dC5jb21tYW5kV2hlZWwpOwogICAgdGhpcy5zaW0udXBkYXRlKHRoaXMuaW5wdXQsIGR0KTsKICAgIHRoaXMucmVuZGVyZXIudXBkYXRlKHRoaXMuc2ltLnN0YXRlLCBkdCk7CiAgICB0aGlzLnBsYXlOZXdFZmZlY3RzKCk7CiAgICB0aGlzLnJlbmRlclN0YXRlKCk7CiAgICB0aGlzLmZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcCk7CiAgfTsKCiAgcHJpdmF0ZSByZW5kZXJTdGF0ZSgpOiB2b2lkIHsKICAgIGNvbnN0IHNuYXBzaG90ID0gdGhpcy5zaW0uaHVkKCk7CiAgICByZW5kZXJIdWQodGhpcy5yZWZzLCBzbmFwc2hvdCk7CiAgICB0aGlzLmRpYWxvZy5jbGFzc0xpc3QudG9nZ2xlKCJpcy1jb21tYW5kaW5nIiwgdGhpcy5zaW0uc3RhdGUuc3RhdHVzID09PSAiY29tbWFuZCIpOwogICAgdGhpcy5kaWFsb2cuY2xhc3NMaXN0LnRvZ2dsZSgiaXMtdXBncmFkZSIsIHRoaXMuc2ltLnN0YXRlLnN0YXR1cyA9PT0gInVwZ3JhZGUiKTsKICAgIHRoaXMuZGlhbG9nLmNsYXNzTGlzdC50b2dnbGUoImlzLXBhdXNlZCIsIHRoaXMuc2ltLnN0YXRlLnN0YXR1cyA9PT0gInBhdXNlZCIpOwogICAgdGhpcy5yZWZzLnBhdXNlLnRleHRDb250ZW50ID0gdGhpcy5zaW0uc3RhdGUuc3RhdHVzID09PSAicGF1c2VkIiA/ICJSZXN1bWUiIDogIlBhdXNlIjsKICAgIHRoaXMucmVmcy5jb21tYW5kQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHsKICAgICAgY29uc3QgcmVhZHkgPSB0aGlzLnNpbS5zdGF0ZS5jb21tYW5kQ2hhcmdlID49IDEwMCAmJiAodGhpcy5zaW0uc3RhdGUuc3RhdHVzID09PSAicnVubmluZyIgfHwgdGhpcy5zaW0uc3RhdGUuc3RhdHVzID09PSAiY29tbWFuZCIpOwogICAgICBidXR0b24uZGlzYWJsZWQgPSAhcmVhZHk7CiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCJpcy1yZWFkeSIsIHJlYWR5KTsKICAgIH0pOwogICAgaWYgKHRoaXMuc2ltLnN0YXRlLnN0YXR1cyA9PT0gInVwZ3JhZGUiKSB0aGlzLnJlbmRlclVwZ3JhZGVzKCk7CiAgICBpZiAodGhpcy5zaW0uc3RhdGUuc3RhdHVzID09PSAiZW5kZWQiICYmICF0aGlzLnJlcG9ydFJlbmRlcmVkKSB0aGlzLnJlbmRlclJlcG9ydCh0aGlzLnNpbS5yZXBvcnQoKSk7CiAgfQoKICBwcml2YXRlIHJlbmRlck1lbnUoKTogdm9pZCB7CiAgICB0aGlzLmRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCJpcy1wbGF5aW5nIiwgImlzLWVuZGVkIiwgImlzLXVwZ3JhZGUiLCAiaXMtcGF1c2VkIik7CiAgICBzaG93KHRoaXMucmVmcy5tZW51KTsKICAgIGhpZGUodGhpcy5yZWZzLnVwZ3JhZGVzKTsKICAgIGhpZGUodGhpcy5yZWZzLnJlcG9ydCk7CiAgICByZW5kZXJTcGVjaWVzVHJhaXQodGhpcy5yZWZzLCB0aGlzLnJlZnMuc3BlY2llcy52YWx1ZSk7CiAgICB0aGlzLnJlZnMuc3BlY2llcy5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLCAoKSA9PiByZW5kZXJTcGVjaWVzVHJhaXQodGhpcy5yZWZzLCB0aGlzLnJlZnMuc3BlY2llcy52YWx1ZSkpOwogIH0KCiAgcHJpdmF0ZSByZW5kZXJVcGdyYWRlcygpOiB2b2lkIHsKICAgIHNob3codGhpcy5yZWZzLnVwZ3JhZGVzKTsKICAgIGNvbnN0IGtleSA9IHRoaXMuc2ltLnN0YXRlLnVwZ3JhZGVDaG9pY2VzLmpvaW4oInwiKTsKICAgIGlmIChrZXkgJiYga2V5ID09PSB0aGlzLnVwZ3JhZGVzUmVuZGVyZWRLZXkgJiYgdGhpcy5yZWZzLnVwZ3JhZGVzTGlzdC5jaGlsZHJlbi5sZW5ndGggPiAwKSByZXR1cm47CgogICAgdGhpcy51cGdyYWRlc1JlbmRlcmVkS2V5ID0ga2V5OwogICAgdGhpcy5yZWZzLnVwZ3JhZGVzTGlzdC5pbm5lckhUTUwgPSAiIjsKICAgIHRoaXMuc2ltLnN0YXRlLnVwZ3JhZGVDaG9pY2VzLmZvckVhY2goKGlkLCBpbmRleCkgPT4gewogICAgICBjb25zdCB1cGdyYWRlID0gVVBHUkFERVNbaWRdOwogICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJidXR0b24iKTsKICAgICAgYnV0dG9uLnR5cGUgPSAiYnV0dG9uIjsKICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICJlbnZlbG9wZS12My11cGdyYWRlLWNhcmQiOwogICAgICBidXR0b24uaW5uZXJIVE1MID0gYDxzcGFuPiR7aW5kZXggKyAxfSB8ICR7ZXNjYXBlSHRtbCh1cGdyYWRlLmNvbW1hbmQgfHwgInN5c3RlbSIpfTwvc3Bhbj48c3Ryb25nPiR7ZXNjYXBlSHRtbCh1cGdyYWRlLnRpdGxlKX08L3N0cm9uZz48cD4ke2VzY2FwZUh0bWwodXBncmFkZS5jb3B5KX08L3A+YDsKICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKCkgPT4gdGhpcy5jaG9vc2VVcGdyYWRlKGlkKSk7CiAgICAgIHRoaXMucmVmcy51cGdyYWRlc0xpc3QuYXBwZW5kKGJ1dHRvbik7CiAgICB9KTsKICB9CgogIHByaXZhdGUgY2hvb3NlVXBncmFkZUJ5SW5kZXgoaW5kZXg6IG51bWJlcik6IHZvaWQgewogICAgY29uc3QgaWQgPSB0aGlzLnNpbS5zdGF0ZS51cGdyYWRlQ2hvaWNlc1tpbmRleF07CiAgICBpZiAoaWQpIHRoaXMuY2hvb3NlVXBncmFkZShpZCk7CiAgfQoKICBwcml2YXRlIGNob29zZVVwZ3JhZGUoaWQ6IFVwZ3JhZGVJZCk6IHZvaWQgewogICAgaWYgKHRoaXMuc2ltLnN0YXRlLnN0YXR1cyAhPT0gInVwZ3JhZGUiIHx8ICF0aGlzLnNpbS5zdGF0ZS51cGdyYWRlQ2hvaWNlcy5pbmNsdWRlcyhpZCkpIHJldHVybjsKICAgIHRoaXMuc2ltLmNob29zZVVwZ3JhZGUoaWQpOwogICAgdGhpcy51cGdyYWRlc1JlbmRlcmVkS2V5ID0gIiI7CiAgICBoaWRlKHRoaXMucmVmcy51cGdyYWRlcyk7CiAgICB0aGlzLmF1ZGlvLnBsYXkoInVwZ3JhZGUiKTsKICAgIHRoaXMucmVuZGVyU3RhdGUoKTsKICB9CgogIHByaXZhdGUgcmVuZGVyUmVwb3J0KHJlcG9ydDogUnVuUmVwb3J0KTogdm9pZCB7CiAgICB0aGlzLnJlcG9ydFJlbmRlcmVkID0gdHJ1ZTsKICAgIHRoaXMuZGlhbG9nLmNsYXNzTGlzdC5hZGQoImlzLWVuZGVkIik7CiAgICBzaG93KHRoaXMucmVmcy5yZXBvcnQpOwogICAgdGhpcy5yZWZzLnJlcG9ydFN1bW1hcnkuaW5uZXJIVE1MID0gYAogICAgICA8c3Ryb25nPiR7TnVtYmVyKHJlcG9ydC5zY29yZSkudG9Mb2NhbGVTdHJpbmcoKX0gcG9pbnRzPC9zdHJvbmc+CiAgICAgIDxzcGFuPiR7ZXNjYXBlSHRtbChyZXBvcnQuc3BlY2llc0xhYmVsKX0gfCAke2VzY2FwZUh0bWwocmVwb3J0LnBoYXNlUmVhY2hlZCl9IHwgJHtlc2NhcGVIdG1sKHJlcG9ydC5zdXJ2aXZlZCl9PC9zcGFuPgogICAgICA8c3Bhbj4ke2VzY2FwZUh0bWwoZm9ybWF0VGltZXN0YW1wKHJlcG9ydC5jb21wbGV0ZWRBdCkpfTwvc3Bhbj4KICAgICAgPHNwYW4+THlzaXMgY2F1c2U6ICR7ZXNjYXBlSHRtbChyZXBvcnQubHlzaXNDYXVzZSl9PC9zcGFuPgogICAgICA8c3Bhbj5VcGdyYWRlczogJHtlc2NhcGVIdG1sKHJlcG9ydC51cGdyYWRlcy5qb2luKCIsICIpIHx8ICJub25lIil9PC9zcGFuPgogICAgYDsKICAgIHRoaXMucmVmcy5zdWJtaXROYW1lLnZhbHVlID0gdGhpcy5yZWZzLm5hbWUudmFsdWUgfHwgIkFub255bW91cyI7CiAgICB0aGlzLmF1ZGlvLnBsYXkoImx5c2lzIik7CiAgfQoKICBwcml2YXRlIGFzeW5jIHN1Ym1pdFNjb3JlKCk6IFByb21pc2U8dm9pZD4gewogICAgdGhpcy5yZWZzLnN1Ym1pdFN0YXR1cy50ZXh0Q29udGVudCA9ICJTdWJtaXR0aW5nIHNjb3JlLi4uIjsKICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCB0aGlzLmxlYWRlcmJvYXJkLnN1Ym1pdCh0aGlzLnNpbS5zY29yZUVudHJ5KHRoaXMucmVmcy5zdWJtaXROYW1lLnZhbHVlKSk7CiAgICB0aGlzLnJlZnMuc3VibWl0U3RhdHVzLnRleHRDb250ZW50ID0gcGF5bG9hZC5tb2RlID09PSAiZ2xvYmFsIiA/IGBTY29yZSBzYXZlZCB0byBzaGFyZWQgYm9hcmQke3BheWxvYWQucmFuayA/IGAgYXQgcmFuayAjJHtwYXlsb2FkLnJhbmt9YCA6ICIifS5gIDogIlNjb3JlIHNhdmVkIGxvY2FsbHkuIFNoYXJlZCBib2FyZCB3YXMgdW5hdmFpbGFibGUuIjsKICAgIHJlbmRlclNjb3Jlcyh0aGlzLnJlZnMsIHBheWxvYWQpOwogIH0KCiAgcHJpdmF0ZSBhc3luYyByZWZyZXNoU2NvcmVzKGJvYXJkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHsKICAgIHJlbmRlclNjb3Jlcyh0aGlzLnJlZnMsIGF3YWl0IHRoaXMubGVhZGVyYm9hcmQucmVmcmVzaChib2FyZCkpOwogIH0KCiAgcHJpdmF0ZSBwbGF5TmV3RWZmZWN0cygpOiB2b2lkIHsKICAgIHRoaXMuc2ltLnN0YXRlLmVmZmVjdHMuZm9yRWFjaCgoZWZmZWN0KSA9PiB7CiAgICAgIGlmICh0aGlzLnNlZW5FZmZlY3RzLmhhcyhlZmZlY3QuaWQpKSByZXR1cm47CiAgICAgIHRoaXMuc2VlbkVmZmVjdHMuYWRkKGVmZmVjdC5pZCk7CiAgICAgIGlmIChlZmZlY3QudHlwZSA9PT0gInBpY2t1cCIpIHRoaXMuYXVkaW8ucGxheSgicGlja3VwIik7CiAgICAgIGVsc2UgaWYgKGVmZmVjdC50eXBlID09PSAiZGFtYWdlIikgdGhpcy5hdWRpby5wbGF5KCJkYW1hZ2UiKTsKICAgICAgZWxzZSBpZiAoZWZmZWN0LnR5cGUgPT09ICJkYXNoIikgdGhpcy5hdWRpby5wbGF5KCJkYXNoIik7CiAgICAgIGVsc2UgaWYgKGVmZmVjdC50eXBlID09PSAicGhhc2UiKSB0aGlzLmF1ZGlvLnBsYXkoInBoYXNlIik7CiAgICB9KTsKICB9Cn0KCmZ1bmN0aW9uIGNyZWF0ZURpYWxvZygpOiBIVE1MRGlhbG9nRWxlbWVudCB7CiAgY29uc3QgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiZGlhbG9nIik7CiAgZGlhbG9nLmNsYXNzTmFtZSA9ICJlbnZlbG9wZS12My1tb2RhbCI7CiAgZGlhbG9nLnNldEF0dHJpYnV0ZSgiYXJpYS1sYWJlbGxlZGJ5IiwgImVudmVsb3BlLXYzLXRpdGxlIik7CiAgZGlhbG9nLmlubmVySFRNTCA9IGAKICAgIDxkaXYgY2xhc3M9ImVudmVsb3BlLXYzLXNoZWxsIj4KICAgICAgPGhlYWRlciBjbGFzcz0iZW52ZWxvcGUtdjMtdG9wYmFyIj4KICAgICAgICA8ZGl2PgogICAgICAgICAgPHAgY2xhc3M9ImVudmVsb3BlLXYzLWV5ZWJyb3ciPkhpZGRlbiBMYWIgQXJjYWRlPC9wPgogICAgICAgICAgPGgyIGlkPSJlbnZlbG9wZS12My10aXRsZSI+RW52ZWxvcGUgRXNjYXBlIFYzOiBMYWItQmVuY2ggU3RyZXNzIFJ1bjwvaDI+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iZW52ZWxvcGUtdjMtYWN0aW9ucyI+CiAgICAgICAgICA8YnV0dG9uIGRhdGEtdjM9InNvdW5kIiB0eXBlPSJidXR0b24iIGFyaWEtcHJlc3NlZD0iZmFsc2UiPlNvdW5kIE9mZjwvYnV0dG9uPgogICAgICAgICAgPGxhYmVsPk1vdGlvbiA8c2VsZWN0IGRhdGEtdjM9Im1vdGlvbiI+PG9wdGlvbiB2YWx1ZT0iZnVsbCI+RnVsbDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9ImNhbG0iPkNhbG08L29wdGlvbj48b3B0aW9uIHZhbHVlPSJvZmYiPk9mZjwvb3B0aW9uPjwvc2VsZWN0PjwvbGFiZWw+CiAgICAgICAgICA8YnV0dG9uIGRhdGEtdjM9ImNsb3NlIiB0eXBlPSJidXR0b24iIGFyaWEtbGFiZWw9IkNsb3NlIGdhbWUiPkNsb3NlPC9idXR0b24+CiAgICAgICAgPC9kaXY+CiAgICAgIDwvaGVhZGVyPgogICAgICA8bWFpbiBjbGFzcz0iZW52ZWxvcGUtdjMtbGF5b3V0Ij4KICAgICAgICA8c2VjdGlvbiBjbGFzcz0iZW52ZWxvcGUtdjMtc3RhZ2UiPgogICAgICAgICAgPGRpdiBjbGFzcz0iZW52ZWxvcGUtdjMtZ2FtZS1yb290Ij48L2Rpdj4KICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPSJlbnZlbG9wZS12My1odWQiIGFyaWEtbGFiZWw9IlJ1biBzdGF0dXMiPgogICAgICAgICAgICA8ZGl2PjxzcGFuPlNjb3JlPC9zcGFuPjxzdHJvbmcgZGF0YS12My1odWQ9InNjb3JlIj4wPC9zdHJvbmc+PC9kaXY+CiAgICAgICAgICAgIDxkaXY+PHNwYW4+VGltZTwvc3Bhbj48c3Ryb25nIGRhdGEtdjMtaHVkPSJ0aW1lIj4wOjAwPC9zdHJvbmc+PC9kaXY+CiAgICAgICAgICAgIDxkaXY+PHNwYW4+SW50ZWdyaXR5PC9zcGFuPjxzdHJvbmcgZGF0YS12My1odWQ9ImludGVncml0eSI+MTAwJTwvc3Ryb25nPjwvZGl2PgogICAgICAgICAgICA8ZGl2PjxzcGFuPkNvbW1hbmQ8L3NwYW4+PHN0cm9uZyBkYXRhLXYzLWh1ZD0iY2hhcmdlIj4wJTwvc3Ryb25nPjwvZGl2PgogICAgICAgICAgICA8ZGl2PjxzcGFuPkNhcnJ5PC9zcGFuPjxzdHJvbmcgZGF0YS12My1odWQ9ImNhcnJ5Ij5lbXB0eTwvc3Ryb25nPjwvZGl2PgogICAgICAgICAgICA8ZGl2PjxzcGFuPkNvbWJvPC9zcGFuPjxzdHJvbmcgZGF0YS12My1odWQ9ImNvbWJvIj5yZWFkeTwvc3Ryb25nPjwvZGl2PgogICAgICAgICAgICA8ZGl2PjxzcGFuPlpvbmU8L3NwYW4+PHN0cm9uZyBkYXRhLXYzLWh1ZD0iem9uZSI+U2xpZGU8L3N0cm9uZz48L2Rpdj4KICAgICAgICAgIDwvc2VjdGlvbj4KICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPSJlbnZlbG9wZS12My1vYmplY3RpdmUiPgogICAgICAgICAgICA8c3BhbiBkYXRhLXYzLWh1ZD0icGhhc2UiPkhvbWVvc3Rhc2lzPC9zcGFuPgogICAgICAgICAgICA8c3Ryb25nIGRhdGEtdjMtaHVkPSJvYmplY3RpdmUiPkNvbGxlY3QgZW52ZWxvcGUgbW9kdWxlcy48L3N0cm9uZz4KICAgICAgICAgICAgPGVtIGRhdGEtdjMtaHVkPSJwcmVzc3VyZSI+QmFsYW5jZWQgbG9hZDwvZW0+CiAgICAgICAgICA8L3NlY3Rpb24+CiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz0iZW52ZWxvcGUtdjMtcmFkaWFsIiBhcmlhLWxhYmVsPSJDb21tYW5kIHdoZWVsIj4KICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWNvbW1hbmQ9InBnIiB0eXBlPSJidXR0b24iPjEgPHN0cm9uZz5QRyBzeW50aGVzaXM8L3N0cm9uZz48c3Bhbj5CdWlsZCB3YWxsPC9zcGFuPjwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uIGRhdGEtY29tbWFuZD0ibWVtYnJhbmUiIHR5cGU9ImJ1dHRvbiI+MiA8c3Ryb25nPk1lbWJyYW5lIHJlcGFpcjwvc3Ryb25nPjxzcGFuPlNlYWwgZmFpbHVyZTwvc3Bhbj48L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWNvbW1hbmQ9InBoYWdlIiB0eXBlPSJidXR0b24iPjMgPHN0cm9uZz5QaGFnZSBkZWZlbnNlPC9zdHJvbmc+PHNwYW4+UHVyZ2UgYmxvb208L3NwYW4+PC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24gZGF0YS1jb21tYW5kPSJtb3RpbGl0eSIgdHlwZT0iYnV0dG9uIj40IDxzdHJvbmc+TW90aWxpdHk8L3N0cm9uZz48c3Bhbj5FdmFkZTwvc3Bhbj48L2J1dHRvbj4KICAgICAgICAgIDwvc2VjdGlvbj4KICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPSJlbnZlbG9wZS12My1tZW51Ij4KICAgICAgICAgICAgPHAgY2xhc3M9ImVudmVsb3BlLXYzLWtpY2tlciI+M0QgbGFiLWJlbmNoIHN1cnZpdmFsPC9wPgogICAgICAgICAgICA8aDM+TmF2aWdhdGUgdGhlIGJlbmNoIGJlZm9yZSB0aGUgZW52ZWxvcGUgZmFpbHMuPC9oMz4KICAgICAgICAgICAgPHA+TW92ZSB0aHJvdWdoIG92ZXJzaXplZCBsYWIgbGFuZG1hcmtzLCByb3V0ZSBhcm91bmQgcGlwZXR0ZSBwdWxzZXMsIHBsYXF1ZSBibG9vbXMsIHJvdG9yIHN3ZWVwcywgYW5kIHR1YmUtcmFjayBydXB0dXJlcywgdGhlbiB1c2Ugc2xvdy10aW1lIGVudmVsb3BlIGNvbW1hbmRzIHRvIHNvbHZlIGVhY2ggc3RyZXNzIGV2ZW50LjwvcD4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iZW52ZWxvcGUtdjMtZmllbGRzIj4KICAgICAgICAgICAgICA8bGFiZWw+TW9kZWwgYmFjdGVyaXVtIDxzZWxlY3QgZGF0YS12Mz0ic3BlY2llcyI+PC9zZWxlY3Q+PC9sYWJlbD4KICAgICAgICAgICAgICA8bGFiZWw+TGVhZGVyYm9hcmQgbmFtZSA8aW5wdXQgZGF0YS12Mz0ibmFtZSIgbWF4bGVuZ3RoPSIyNCIgYXV0b2NvbXBsZXRlPSJuaWNrbmFtZSIgcGxhY2Vob2xkZXI9IkFub255bW91cyIgLz48L2xhYmVsPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGFydGljbGUgY2xhc3M9ImVudmVsb3BlLXYzLXRyYWl0Ij4KICAgICAgICAgICAgICA8c3Bhbj5TcGVjaWVzIHRyYWl0PC9zcGFuPgogICAgICAgICAgICAgIDxzdHJvbmcgZGF0YS12My1odWQ9InRyYWl0LXRpdGxlIj5FbnZlbG9wZSBob21lb3N0YXNpczwvc3Ryb25nPgogICAgICAgICAgICAgIDxwIGRhdGEtdjMtaHVkPSJ0cmFpdC1jb3B5Ij5CYWxhbmNlZCBoYW5kbGluZyBhbmQgZmFzdGVyIGNvbW1hbmQgY2hhcmdpbmcuPC9wPgogICAgICAgICAgICA8L2FydGljbGU+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImVudmVsb3BlLXYzLXN0YXJ0cyI+CiAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXYzPSJjbGFzc2ljIiB0eXBlPSJidXR0b24iPlN0YXJ0IENsYXNzaWMgUnVuPC9idXR0b24+CiAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXYzPSJkYWlseSIgdHlwZT0iYnV0dG9uIj5EYWlseSBDaGFsbGVuZ2U8L2J1dHRvbj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8L3NlY3Rpb24+CiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz0iZW52ZWxvcGUtdjMtdXBncmFkZXMiIGhpZGRlbj4KICAgICAgICAgICAgPHAgY2xhc3M9ImVudmVsb3BlLXYzLWtpY2tlciI+VXBncmFkZSBkcmFmdDwvcD4KICAgICAgICAgICAgPGgzPkNob29zZSBvbmUgZW52ZWxvcGUgc3lzdGVtLjwvaDM+CiAgICAgICAgICAgIDxkaXYgZGF0YS12Mz0idXBncmFkZXMiPjwvZGl2PgogICAgICAgICAgPC9zZWN0aW9uPgogICAgICAgICAgPHNlY3Rpb24gY2xhc3M9ImVudmVsb3BlLXYzLXJlcG9ydCIgaGlkZGVuPgogICAgICAgICAgICA8cCBjbGFzcz0iZW52ZWxvcGUtdjMta2lja2VyIj5SdW4gcmVwb3J0PC9wPgogICAgICAgICAgICA8aDM+Q2VsbCBseXNpczwvaDM+CiAgICAgICAgICAgIDxwIGRhdGEtdjM9InJlcG9ydC1zdW1tYXJ5Ij48L3A+CiAgICAgICAgICAgIDxsYWJlbD5Mb2cgdGhpcyBzY29yZSBhcyA8aW5wdXQgZGF0YS12Mz0ic3VibWl0LW5hbWUiIG1heGxlbmd0aD0iMjQiIGF1dG9jb21wbGV0ZT0ibmlja25hbWUiIHBsYWNlaG9sZGVyPSJBbm9ueW1vdXMiIC8+PC9sYWJlbD4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iZW52ZWxvcGUtdjMtc3RhcnRzIj4KICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdjM9InN1Ym1pdC1zY29yZSIgdHlwZT0iYnV0dG9uIj5TdWJtaXQgU2NvcmU8L2J1dHRvbj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDxwIGRhdGEtdjM9InN1Ym1pdC1zdGF0dXMiIGFyaWEtbGl2ZT0icG9saXRlIj48L3A+CiAgICAgICAgICA8L3NlY3Rpb24+CiAgICAgICAgPC9zZWN0aW9uPgogICAgICAgIDxhc2lkZSBjbGFzcz0iZW52ZWxvcGUtdjMtc2NvcmVzIj4KICAgICAgICAgIDxkaXY+CiAgICAgICAgICAgIDxzcGFuPkxlYWRlcmJvYXJkPC9zcGFuPgogICAgICAgICAgICA8c3Ryb25nIGRhdGEtdjMtaHVkPSJzY29yZS1tb2RlIj5DbGFzc2ljIGJvYXJkPC9zdHJvbmc+CiAgICAgICAgICAgIDxwIGRhdGEtdjMtaHVkPSJzY29yZS1tZXRhIj5GaW5pc2ggYSBydW4gdG8gcmVjb3JkIGEgc2NvcmUuPC9wPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8b2wgZGF0YS12My1odWQ9InNjb3JlcyI+PC9vbD4KICAgICAgICA8L2FzaWRlPgogICAgICA8L21haW4+CiAgICAgIDxmb290ZXIgY2xhc3M9ImVudmVsb3BlLXYzLWNvbnRyb2xzIj4KICAgICAgICA8c3Bhbj5XQVNEL2Fycm93cyBtb3ZlIHwgU2hpZnQgZGFzaCB8IEhvbGQgU3BhY2UgY29tbWFuZCB3aGVlbCB8IDEtNCBjb21tYW5kIHwgTmF2aWdhdGUgcGlwZXR0ZSwgcGV0cmksIHJvdG9yLCBmbGFzaywgYW5kIHR1YmUtcmFjayB6b25lczwvc3Bhbj4KICAgICAgICA8YnV0dG9uIGRhdGEtdjM9InBhdXNlIiB0eXBlPSJidXR0b24iPlBhdXNlPC9idXR0b24+CiAgICAgICAgPGJ1dHRvbiBkYXRhLXYzPSJyZXN0YXJ0IiB0eXBlPSJidXR0b24iPlJlc3RhcnQ8L2J1dHRvbj4KICAgICAgICA8YnV0dG9uIGRhdGEtdjM9InJlZnJlc2gtc2NvcmVzIiB0eXBlPSJidXR0b24iPlJlZnJlc2ggU2NvcmVzPC9idXR0b24+CiAgICAgIDwvZm9vdGVyPgogICAgPC9kaXY+CiAgYDsKICBkb2N1bWVudC5ib2R5LmFwcGVuZChkaWFsb2cpOwogIHJldHVybiBkaWFsb2c7Cn0KCmZ1bmN0aW9uIGNvbGxlY3RSZWZzKGRpYWxvZzogSFRNTERpYWxvZ0VsZW1lbnQpIHsKICByZXR1cm4gewogICAgY2xvc2U6IHJlcXVpcmVkPEhUTUxCdXR0b25FbGVtZW50PihkaWFsb2csICdbZGF0YS12Mz0iY2xvc2UiXScpLAogICAgc291bmQ6IHJlcXVpcmVkPEhUTUxCdXR0b25FbGVtZW50PihkaWFsb2csICdbZGF0YS12Mz0ic291bmQiXScpLAogICAgbW90aW9uOiByZXF1aXJlZDxIVE1MU2VsZWN0RWxlbWVudD4oZGlhbG9nLCAnW2RhdGEtdjM9Im1vdGlvbiJdJyksCiAgICBnYW1lUm9vdDogcmVxdWlyZWQ8SFRNTEVsZW1lbnQ+KGRpYWxvZywgIi5lbnZlbG9wZS12My1nYW1lLXJvb3QiKSwKICAgIG1lbnU6IHJlcXVpcmVkPEhUTUxFbGVtZW50PihkaWFsb2csICIuZW52ZWxvcGUtdjMtbWVudSIpLAogICAgdXBncmFkZXM6IHJlcXVpcmVkPEhUTUxFbGVtZW50PihkaWFsb2csICIuZW52ZWxvcGUtdjMtdXBncmFkZXMiKSwKICAgIHVwZ3JhZGVzTGlzdDogcmVxdWlyZWQ8SFRNTEVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJ1cGdyYWRlcyJdJyksCiAgICByZXBvcnQ6IHJlcXVpcmVkPEhUTUxFbGVtZW50PihkaWFsb2csICIuZW52ZWxvcGUtdjMtcmVwb3J0IiksCiAgICByZXBvcnRTdW1tYXJ5OiByZXF1aXJlZDxIVE1MRWxlbWVudD4oZGlhbG9nLCAnW2RhdGEtdjM9InJlcG9ydC1zdW1tYXJ5Il0nKSwKICAgIHN1Ym1pdE5hbWU6IHJlcXVpcmVkPEhUTUxJbnB1dEVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJzdWJtaXQtbmFtZSJdJyksCiAgICBzdWJtaXRTY29yZTogcmVxdWlyZWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJzdWJtaXQtc2NvcmUiXScpLAogICAgc3VibWl0U3RhdHVzOiByZXF1aXJlZDxIVE1MRWxlbWVudD4oZGlhbG9nLCAnW2RhdGEtdjM9InN1Ym1pdC1zdGF0dXMiXScpLAogICAgc3BlY2llczogcmVxdWlyZWQ8SFRNTFNlbGVjdEVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJzcGVjaWVzIl0nKSwKICAgIG5hbWU6IHJlcXVpcmVkPEhUTUxJbnB1dEVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJuYW1lIl0nKSwKICAgIGNsYXNzaWM6IHJlcXVpcmVkPEhUTUxCdXR0b25FbGVtZW50PihkaWFsb2csICdbZGF0YS12Mz0iY2xhc3NpYyJdJyksCiAgICBkYWlseTogcmVxdWlyZWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJkYWlseSJdJyksCiAgICBwYXVzZTogcmVxdWlyZWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJwYXVzZSJdJyksCiAgICByZXN0YXJ0OiByZXF1aXJlZDxIVE1MQnV0dG9uRWxlbWVudD4oZGlhbG9nLCAnW2RhdGEtdjM9InJlc3RhcnQiXScpLAogICAgcmVmcmVzaFNjb3JlczogcmVxdWlyZWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KGRpYWxvZywgJ1tkYXRhLXYzPSJyZWZyZXNoLXNjb3JlcyJdJyksCiAgICBjb21tYW5kQnV0dG9uczogQXJyYXkuZnJvbShkaWFsb2cucXVlcnlTZWxlY3RvckFsbDxIVE1MQnV0dG9uRWxlbWVudD4oIltkYXRhLWNvbW1hbmRdIikpLAogICAgaHVkOiAobmFtZTogc3RyaW5nKSA9PiByZXF1aXJlZDxIVE1MRWxlbWVudD4oZGlhbG9nLCBgW2RhdGEtdjMtaHVkPSIke25hbWV9Il1gKQogIH07Cn0KCmZ1bmN0aW9uIHBvcHVsYXRlU3BlY2llcyhzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50KTogdm9pZCB7CiAgU1BFQ0lFU19PUkRFUi5mb3JFYWNoKChpZCkgPT4gewogICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgib3B0aW9uIik7CiAgICBvcHRpb24udmFsdWUgPSBpZDsKICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IFNQRUNJRVNbaWRdLmxhYmVsOwogICAgc2VsZWN0LmFwcGVuZChvcHRpb24pOwogIH0pOwp9CgpmdW5jdGlvbiByZW5kZXJIdWQocmVmczogUmV0dXJuVHlwZTx0eXBlb2YgY29sbGVjdFJlZnM+LCBzbmFwc2hvdDogSHVkU25hcHNob3QpOiB2b2lkIHsKICByZWZzLmh1ZCgic2NvcmUiKS50ZXh0Q29udGVudCA9IE51bWJlcihzbmFwc2hvdC5zY29yZSkudG9Mb2NhbGVTdHJpbmcoKTsKICByZWZzLmh1ZCgidGltZSIpLnRleHRDb250ZW50ID0gc25hcHNob3QudGltZUxhYmVsOwogIHJlZnMuaHVkKCJpbnRlZ3JpdHkiKS50ZXh0Q29udGVudCA9IGAke3NuYXBzaG90LmludGVncml0eX0lYDsKICByZWZzLmh1ZCgiY2hhcmdlIikudGV4dENvbnRlbnQgPSBgJHtzbmFwc2hvdC5jb21tYW5kQ2hhcmdlfSVgOwogIHJlZnMuaHVkKCJjYXJyeSIpLnRleHRDb250ZW50ID0gc25hcHNob3QuY2FycmllZExhYmVsOwogIHJlZnMuaHVkKCJjb21ibyIpLnRleHRDb250ZW50ID0gc25hcHNob3QuY29tYm9MYWJlbDsKICByZWZzLmh1ZCgiem9uZSIpLnRleHRDb250ZW50ID0gc25hcHNob3Quem9uZUxhYmVsOwogIHJlZnMuaHVkKCJwaGFzZSIpLnRleHRDb250ZW50ID0gc25hcHNob3QucGhhc2VUaXRsZTsKICByZWZzLmh1ZCgib2JqZWN0aXZlIikudGV4dENvbnRlbnQgPSBgJHtzbmFwc2hvdC5vYmplY3RpdmV9ICgke3NuYXBzaG90Lm9iamVjdGl2ZVByb2dyZXNzfS8ke3NuYXBzaG90Lm9iamVjdGl2ZVRhcmdldH0pYDsKICByZWZzLmh1ZCgicHJlc3N1cmUiKS50ZXh0Q29udGVudCA9IGAke3NuYXBzaG90LmpvYlN0ZXB9IHwgTmV4dDogJHtzbmFwc2hvdC5uZXh0SGF6YXJkTGFiZWx9IHwgJHtzbmFwc2hvdC5waGFzZVByZXNzdXJlfWA7Cn0KCmZ1bmN0aW9uIHJlbmRlclNjb3JlcyhyZWZzOiBSZXR1cm5UeXBlPHR5cGVvZiBjb2xsZWN0UmVmcz4sIHBheWxvYWQ6IExlYWRlcmJvYXJkUGF5bG9hZCk6IHZvaWQgewogIHJlZnMuaHVkKCJzY29yZS1tb2RlIikudGV4dENvbnRlbnQgPSBwYXlsb2FkLm1vZGUgPT09ICJnbG9iYWwiID8gIlNoYXJlZCBib2FyZCIgOiBwYXlsb2FkLm1vZGUgPT09ICJmYWxsYmFjayIgPyAiTG9jYWwgZmFsbGJhY2siIDogIkxvY2FsIGJvYXJkIjsKICByZWZzLmh1ZCgic2NvcmUtbWV0YSIpLnRleHRDb250ZW50ID0gYCR7cGF5bG9hZC50b3RhbEVudHJpZXN9IHJlY29yZGVkICR7cGF5bG9hZC50b3RhbEVudHJpZXMgPT09IDEgPyAicnVuIiA6ICJydW5zIn0gb24gJHtwYXlsb2FkLmJvYXJkfWA7CiAgY29uc3QgbGlzdCA9IHJlZnMuaHVkKCJzY29yZXMiKSBhcyBIVE1MT0xpc3RFbGVtZW50OwogIGxpc3QuaW5uZXJIVE1MID0gIiI7CiAgaWYgKCFwYXlsb2FkLmVudHJpZXMubGVuZ3RoKSB7CiAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImxpIik7CiAgICBlbXB0eS50ZXh0Q29udGVudCA9ICJObyBzY29yZXMgcmVjb3JkZWQgeWV0LiI7CiAgICBsaXN0LmFwcGVuZChlbXB0eSk7CiAgICByZXR1cm47CiAgfQogIHBheWxvYWQuZW50cmllcy5mb3JFYWNoKChlbnRyeSwgaW5kZXgpID0+IHsKICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgibGkiKTsKICAgIGxpLmlubmVySFRNTCA9IGA8c3Bhbj4jJHtpbmRleCArIDF9PC9zcGFuPjxzdHJvbmc+JHtlc2NhcGVIdG1sKGVudHJ5Lm5hbWUpfTwvc3Ryb25nPjxlbT4ke051bWJlcihlbnRyeS5zY29yZSkudG9Mb2NhbGVTdHJpbmcoKX0gcHRzIHwgJHtlc2NhcGVIdG1sKFNQRUNJRVNbZW50cnkuc3BlY2llc10/LnNob3J0TGFiZWwgfHwgZW50cnkuc3BlY2llcyl9PC9lbT48c21hbGw+JHtlc2NhcGVIdG1sKGZvcm1hdFRpbWVzdGFtcChlbnRyeS5wbGF5ZWRBdCkpfTwvc21hbGw+YDsKICAgIGxpc3QuYXBwZW5kKGxpKTsKICB9KTsKfQoKZnVuY3Rpb24gcmVuZGVyU3BlY2llc1RyYWl0KHJlZnM6IFJldHVyblR5cGU8dHlwZW9mIGNvbGxlY3RSZWZzPiwgc3BlY2llc0lkOiBzdHJpbmcpOiB2b2lkIHsKICBjb25zdCBzcGVjaWVzID0gU1BFQ0lFU1tzcGVjaWVzSWQgYXMga2V5b2YgdHlwZW9mIFNQRUNJRVNdIHx8IFNQRUNJRVMuZWNvbGk7CiAgcmVmcy5odWQoInRyYWl0LXRpdGxlIikudGV4dENvbnRlbnQgPSBzcGVjaWVzLnRyYWl0VGl0bGU7CiAgcmVmcy5odWQoInRyYWl0LWNvcHkiKS50ZXh0Q29udGVudCA9IHNwZWNpZXMudHJhaXRDb3B5Owp9CgpmdW5jdGlvbiBhcHBseUtleShpbnB1dDogSW5wdXRTdGF0ZSwgZXZlbnQ6IEtleWJvYXJkRXZlbnQsIHByZXNzZWQ6IGJvb2xlYW4pOiBib29sZWFuIHsKICBjb25zdCBrZXkgPSBldmVudC5rZXkudG9Mb3dlckNhc2UoKTsKICBpZiAoa2V5ID09PSAidyIgfHwga2V5ID09PSAiYXJyb3d1cCIpIGlucHV0Lm1vdmVaID0gcHJlc3NlZCA/IC0xIDogaW5wdXQubW92ZVogPT09IC0xID8gMCA6IGlucHV0Lm1vdmVaOwogIGVsc2UgaWYgKGtleSA9PT0gInMiIHx8IGtleSA9PT0gImFycm93ZG93biIpIGlucHV0Lm1vdmVaID0gcHJlc3NlZCA/IDEgOiBpbnB1dC5tb3ZlWiA9PT0gMSA/IDAgOiBpbnB1dC5tb3ZlWjsKICBlbHNlIGlmIChrZXkgPT09ICJhIiB8fCBrZXkgPT09ICJhcnJvd2xlZnQiKSBpbnB1dC5tb3ZlWCA9IHByZXNzZWQgPyAtMSA6IGlucHV0Lm1vdmVYID09PSAtMSA/IDAgOiBpbnB1dC5tb3ZlWDsKICBlbHNlIGlmIChrZXkgPT09ICJkIiB8fCBrZXkgPT09ICJhcnJvd3JpZ2h0IikgaW5wdXQubW92ZVggPSBwcmVzc2VkID8gMSA6IGlucHV0Lm1vdmVYID09PSAxID8gMCA6IGlucHV0Lm1vdmVYOwogIGVsc2UgaWYgKGtleSA9PT0gInNoaWZ0IikgaW5wdXQuZGFzaCA9IHByZXNzZWQ7CiAgZWxzZSBpZiAoa2V5ID09PSAiICIpIGlucHV0LmNvbW1hbmRXaGVlbCA9IHByZXNzZWQ7CiAgZWxzZSByZXR1cm4gZmFsc2U7CiAgcmV0dXJuIHRydWU7Cn0KCmZ1bmN0aW9uIGNhblJ1blYzKCk6IGJvb2xlYW4gewogIGNvbnN0IGNvYXJzZSA9IHdpbmRvdy5tYXRjaE1lZGlhPy4oIihwb2ludGVyOiBjb2Fyc2UpIik/Lm1hdGNoZXMgfHwgd2luZG93LmlubmVyV2lkdGggPCA5MDA7CiAgaWYgKGNvYXJzZSkgcmV0dXJuIGZhbHNlOwogIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImNhbnZhcyIpOwogIHJldHVybiBCb29sZWFuKGNhbnZhcy5nZXRDb250ZXh0KCJ3ZWJnbDIiKSB8fCBjYW52YXMuZ2V0Q29udGV4dCgid2ViZ2wiKSk7Cn0KCmZ1bmN0aW9uIHNob3coZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHsKICBlbGVtZW50LmhpZGRlbiA9IGZhbHNlOwp9CgpmdW5jdGlvbiBoaWRlKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7CiAgZWxlbWVudC5oaWRkZW4gPSB0cnVlOwp9CgpmdW5jdGlvbiByZXF1aXJlZDxUIGV4dGVuZHMgRWxlbWVudD4ocm9vdDogUGFyZW50Tm9kZSwgc2VsZWN0b3I6IHN0cmluZyk6IFQgewogIGNvbnN0IGVsZW1lbnQgPSByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOwogIGlmICghZWxlbWVudCkgdGhyb3cgbmV3IEVycm9yKGBFbnZlbG9wZSBFc2NhcGUgVjMgbWlzc2luZyAke3NlbGVjdG9yfWApOwogIHJldHVybiBlbGVtZW50IGFzIFQ7Cn0KCmZ1bmN0aW9uIHJlYWRUZXh0KGtleTogc3RyaW5nKTogc3RyaW5nIHsKICB0cnkgewogICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpIHx8ICIiOwogIH0gY2F0Y2ggewogICAgcmV0dXJuICIiOwogIH0KfQoKZnVuY3Rpb24gd3JpdGVUZXh0KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7CiAgdHJ5IHsKICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTsKICB9IGNhdGNoIHsKICAgIC8qIG5vLW9wICovCiAgfQp9CgpmdW5jdGlvbiBmb3JtYXRUaW1lc3RhbXAodmFsdWU6IG51bWJlcik6IHN0cmluZyB7CiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTsKICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICJDb21wbGV0aW9uIHRpbWUgdW5hdmFpbGFibGUiOwogIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgiZW4tVVMiLCB7CiAgICB0aW1lWm9uZTogTEFCX1RJTUVaT05FLAogICAgbW9udGg6ICJzaG9ydCIsCiAgICBkYXk6ICJudW1lcmljIiwKICAgIHllYXI6ICJudW1lcmljIiwKICAgIGhvdXI6ICJudW1lcmljIiwKICAgIG1pbnV0ZTogIjItZGlnaXQiLAogICAgdGltZVpvbmVOYW1lOiAic2hvcnQiCiAgfSkKICAgIC5mb3JtYXQoZGF0ZSkKICAgIC5yZXBsYWNlKC9cYkVbRFNdVFxiLywgIkVUIik7Cn0KCmZ1bmN0aW9uIGVzY2FwZUh0bWwodmFsdWU6IHVua25vd24pOiBzdHJpbmcgewogIHJldHVybiBTdHJpbmcodmFsdWUgPz8gIiIpLnJlcGxhY2UoL1smPD4iJ10vZywgKGNoYXJhY3RlcikgPT4gewogICAgY29uc3QgbWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyAiJiI6ICImYW1wOyIsICI8IjogIiZsdDsiLCAiPiI6ICImZ3Q7IiwgJyInOiAiJnF1b3Q7IiwgIiciOiAiJiMzOTsiIH07CiAgICByZXR1cm4gbWFwW2NoYXJhY3Rlcl07CiAgfSk7Cn0K", PC = "data:video/mp2t;base64,aW1wb3J0ICogYXMgVEhSRUUgZnJvbSAidGhyZWUiOwppbXBvcnQgeyBDSEFNQkVSLCBMQUJfUFJPUFMsIFBIQVNFUywgU1BFQ0lFUywgV09STERfWk9ORVMgfSBmcm9tICIuL2NvbnRlbnQiOwppbXBvcnQgdHlwZSB7IFYzQXNzZXRSZWdpc3RyeSB9IGZyb20gIi4vcmVuZGVyL2Fzc2V0cyI7CmltcG9ydCB0eXBlIHsgRWZmZWN0RXZlbnQsIEdhbWVTdGF0ZSwgSGF6YXJkRW50aXR5LCBMYWJQcm9wLCBQaWNrdXBFbnRpdHksIFdvcmxkWm9uZSB9IGZyb20gIi4vdHlwZXMiOwoKZXhwb3J0IGludGVyZmFjZSBWM1JlbmRlcmVyIHsKICB1cGRhdGUoc3RhdGU6IEdhbWVTdGF0ZSwgZHQ6IG51bWJlcik6IHZvaWQ7CiAgcmVzaXplKCk6IHZvaWQ7CiAgZGlzcG9zZSgpOiB2b2lkOwp9Cgpjb25zdCBQUk9QX0FTU0VUX0tFWVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7CiAgInJlc2VhcmNoLXBsdXMtcGlwZXR0ZSI6ICJsYWItcHJvcC5yZXNlYXJjaC1wbHVzLXBpcGV0dGUiLAogICJwbGFxdWUtYXNzYXktZGlzaCI6ICJsYWItcHJvcC5wZXRyaS1kaXNoLXBsYXF1ZS1hc3NheSIsCiAgImZlcm5iYWNoLWZsYXNrIjogImxhYi1wcm9wLmZlcm5iYWNoLWZsYXNrIiwKICAiYmVuY2gtY2VudHJpZnVnZSI6ICJsYWItcHJvcC5jZW50cmlmdWdlLXJvdG9yIiwKICAidHViZS1yYWNrIjogImxhYi1wcm9wLnRlc3QtdHViZS1yYWNrIiwKICAic2xpZGUtc3RhcnQiOiAibGFiLXByb3AubWljcm9zY29wZS1zbGlkZSIsCiAgInN0ZXJpbGUtdGlwLWJveCI6ICJsYWItcHJvcC50aXAtYm94Igp9OwoKY29uc3QgUFJPUF9BU1NFVF9ZOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0gewogICJyZXNlYXJjaC1wbHVzLXBpcGV0dGUiOiAwLjgsCiAgInBsYXF1ZS1hc3NheS1kaXNoIjogMC4xOCwKICAiZmVybmJhY2gtZmxhc2siOiAwLjIsCiAgImJlbmNoLWNlbnRyaWZ1Z2UiOiAwLjIyLAogICJ0dWJlLXJhY2siOiAwLjMsCiAgInNsaWRlLXN0YXJ0IjogMC4xNiwKICAic3RlcmlsZS10aXAtYm94IjogMC4zNAp9OwoKY29uc3QgUElDS1VQX0FTU0VUX0tFWVM6IFJlY29yZDxQaWNrdXBFbnRpdHlbImtpbmQiXSwgc3RyaW5nPiA9IHsKICBwaXBldHRlVGlwOiAicGlja3VwLnBpcGV0dGUtdGlwIiwKICByZWFnZW50RHJvcGxldDogInBpY2t1cC5yZWFnZW50LWRyb3BsZXQiLAogIGFnYXJQbHVnOiAicGlja3VwLmFnYXItcGx1ZyIsCiAgbWVkaWFCZWFkOiAicGlja3VwLm1lZGlhLWJlYWQiCn07Cgpjb25zdCBIQVpBUkRfQVNTRVRfS0VZUzogUGFydGlhbDxSZWNvcmQ8SGF6YXJkRW50aXR5WyJraW5kIl0sIHN0cmluZz4+ID0gewogIHBoYWdlOiAiaGF6YXJkLnBoYWdlLXBhcnRpY2xlIiwKICBwbGFxdWU6ICJoYXphcmQucGhhZ2UtcGxhcXVlIiwKICBydXB0dXJlOiAiaGF6YXJkLm1lbWJyYW5lLXJ1cHR1cmUiLAogIGNyYWNrOiAiaGF6YXJkLm1lbWJyYW5lLXJ1cHR1cmUiLAogIHNwaWxsOiAiaGF6YXJkLm1lZGlhLXNwaWxsIiwKICByb3RvcjogImhhemFyZC5yb3Rvci1zd2VlcCIsCiAgZHJvcGxldDogInBpY2t1cC5yZWFnZW50LWRyb3BsZXQiCn07CgpleHBvcnQgZnVuY3Rpb24gY3JlYXRlVjNSZW5kZXJlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBhc3NldHM/OiBWM0Fzc2V0UmVnaXN0cnkpOiBWM1JlbmRlcmVyIHsKICBjb25zdCBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpOwogIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHgwNzEwMWMpOwogIHNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2dFeHAyKDB4MTAyMDM0LCAwLjAwNjUpOwoKICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoMzgsIDE2IC8gOSwgMC4xLCAyODApOwogIGNhbWVyYS5wb3NpdGlvbi5zZXQoLTQ2LCAzMiwgNDgpOwogIGNhbWVyYS5sb29rQXQoLTQ0LCAwLCAyMik7CgogIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUsIGFscGhhOiBmYWxzZSwgcG93ZXJQcmVmZXJlbmNlOiAiaGlnaC1wZXJmb3JtYW5jZSIgfSk7CiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbigyLCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSk7CiAgcmVuZGVyZXIub3V0cHV0Q29sb3JTcGFjZSA9IFRIUkVFLlNSR0JDb2xvclNwYWNlOwogIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsKICByZW5kZXJlci5zaGFkb3dNYXAudHlwZSA9IFRIUkVFLlBDRlNvZnRTaGFkb3dNYXA7CiAgcGFyZW50LmFwcGVuZChyZW5kZXJlci5kb21FbGVtZW50KTsKCiAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTsKICBjb25zdCByb290ID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgc2NlbmUuYWRkKHJvb3QpOwoKICBjb25zdCBiZW5jaE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsKICAgIGNvbG9yOiAweDEzMjMzMywKICAgIHJvdWdobmVzczogMC43NiwKICAgIG1ldGFsbmVzczogMC4wMiwKICAgIGVtaXNzaXZlOiAweDEwMWQyYSwKICAgIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjI4CiAgfSk7CiAgY29uc3QgYmVuY2ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkoQ0hBTUJFUi53aWR0aCArIDEyLCAwLjUsIENIQU1CRVIuZGVwdGggKyAxMCksIGJlbmNoTWF0ZXJpYWwpOwogIGJlbmNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlOwogIGJlbmNoLnBvc2l0aW9uLnkgPSAtMC4yODsKICByb290LmFkZChiZW5jaCk7CgogIGNvbnN0IG1hdCA9IG5ldyBUSFJFRS5NZXNoKAogICAgbmV3IFRIUkVFLkJveEdlb21ldHJ5KENIQU1CRVIud2lkdGggLSA2LCAwLjA4LCBDSEFNQkVSLmRlcHRoIC0gNSksCiAgICBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgxNjM1NGEsIHJvdWdobmVzczogMC43LCBtZXRhbG5lc3M6IDAuMDQsIGVtaXNzaXZlOiAweDBlMjgzOSwgZW1pc3NpdmVJbnRlbnNpdHk6IDAuMiB9KQogICk7CiAgbWF0LnBvc2l0aW9uLnkgPSAwLjAzOwogIG1hdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTsKICByb290LmFkZChtYXQpOwoKICBjb25zdCB6b25lR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTsKICBXT1JMRF9aT05FUy5mb3JFYWNoKCh6b25lKSA9PiB6b25lR3JvdXAuYWRkKGNyZWF0ZVpvbmVTdXJmYWNlKHpvbmUpKSk7CiAgcm9vdC5hZGQoem9uZUdyb3VwKTsKCiAgY29uc3QgcHJvcEdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgTEFCX1BST1BTLmZvckVhY2goKHByb3ApID0+IHByb3BHcm91cC5hZGQoY3JlYXRlTGFiUHJvcChwcm9wLCBhc3NldHMpKSk7CiAgcm9vdC5hZGQocHJvcEdyb3VwKTsKCiAgY29uc3QgZ3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKENIQU1CRVIud2lkdGgsIDM2LCAweDJlN2Q4YSwgMHgxMjM3NDYpOwogIGdyaWQucG9zaXRpb24ueSA9IDAuMDg7CiAgY29uc3QgZ3JpZE1hdGVyaWFsID0gZ3JpZC5tYXRlcmlhbCBhcyBUSFJFRS5NYXRlcmlhbCAmIHsgb3BhY2l0eT86IG51bWJlcjsgdHJhbnNwYXJlbnQ/OiBib29sZWFuIH07CiAgZ3JpZE1hdGVyaWFsLm9wYWNpdHkgPSAwLjEyOwogIGdyaWRNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7CiAgcm9vdC5hZGQoZ3JpZCk7CgogIGNvbnN0IHBsYXllciA9IG5ldyBUSFJFRS5Hcm91cCgpOwogIHJvb3QuYWRkKHBsYXllcik7CgogIGNvbnN0IGhhemFyZHMgPSBuZXcgTWFwPG51bWJlciwgVEhSRUUuT2JqZWN0M0Q+KCk7CiAgY29uc3QgcGlja3VwcyA9IG5ldyBNYXA8bnVtYmVyLCBUSFJFRS5PYmplY3QzRD4oKTsKICBjb25zdCBlZmZlY3RzID0gbmV3IE1hcDxudW1iZXIsIFRIUkVFLk9iamVjdDNEPigpOwoKICBzY2VuZS5hZGQobmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCgweGZmZWFkMSwgMHgwNjEwMWQsIDEuOCkpOwogIGNvbnN0IGtleSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZkOWFlLCAzLjI1KTsKICBrZXkucG9zaXRpb24uc2V0KC0zMiwgMzYsIDMwKTsKICBrZXkuY2FzdFNoYWRvdyA9IHRydWU7CiAga2V5LnNoYWRvdy5tYXBTaXplLnNldCgxNTM2LCAxNTM2KTsKICBrZXkuc2hhZG93LmNhbWVyYS5sZWZ0ID0gLTc1OwogIGtleS5zaGFkb3cuY2FtZXJhLnJpZ2h0ID0gNzU7CiAga2V5LnNoYWRvdy5jYW1lcmEudG9wID0gNTU7CiAga2V5LnNoYWRvdy5jYW1lcmEuYm90dG9tID0gLTU1OwogIHNjZW5lLmFkZChrZXkpOwogIGNvbnN0IGN5YW5SaW0gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDc2ZjBmZiwgMzAsIDkyKTsKICBjeWFuUmltLnBvc2l0aW9uLnNldCgtNDYsIDEyLCAtMzApOwogIHNjZW5lLmFkZChjeWFuUmltKTsKICBjb25zdCByb3NlUmltID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjhmYWUsIDI0LCA4NCk7CiAgcm9zZVJpbS5wb3NpdGlvbi5zZXQoNDUsIDEyLCAzMik7CiAgc2NlbmUuYWRkKHJvc2VSaW0pOwoKICBsZXQgY3VycmVudFNwZWNpZXMgPSAiIjsKICBjb25zdCBjYW1lcmFUYXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygtNDYsIDAsIDIyKTsKICBjb25zdCBkZXNpcmVkQ2FtZXJhID0gbmV3IFRIUkVFLlZlY3RvcjMoKTsKCiAgZnVuY3Rpb24gYnVpbGRQbGF5ZXIoc3RhdGU6IEdhbWVTdGF0ZSk6IHZvaWQgewogICAgcGxheWVyLmNsZWFyKCk7CiAgICBjb25zdCBzcGVjaWVzID0gU1BFQ0lFU1tzdGF0ZS5zcGVjaWVzSWRdOwogICAgY29uc3QgYm9keU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaHlzaWNhbE1hdGVyaWFsKHsKICAgICAgY29sb3I6IHNwZWNpZXMuY29sb3JBLAogICAgICBlbWlzc2l2ZTogc3BlY2llcy5jb2xvckIsCiAgICAgIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjMyLAogICAgICByb3VnaG5lc3M6IDAuMzYsCiAgICAgIG1ldGFsbmVzczogMC4wMiwKICAgICAgdHJhbnNtaXNzaW9uOiAwLjE2LAogICAgICB0aGlja25lc3M6IDAuMjgKICAgIH0pOwogICAgY29uc3QgY29yZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IHNwZWNpZXMuY29sb3JCLCBlbWlzc2l2ZTogc3BlY2llcy5jb2xvckIsIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjcyLCByb3VnaG5lc3M6IDAuNTggfSk7CiAgICBjb25zdCBib2R5ID0KICAgICAgc3BlY2llcy5zaWxob3VldHRlID09PSAiY29jY3VzIgogICAgICAgID8gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuOSwgMzIsIDE2KSwgYm9keU1hdGVyaWFsKQogICAgICAgIDogc3BlY2llcy5zaWxob3VldHRlID09PSAiZGlwbG9jb2NjdXMiCiAgICAgICAgICA/IGRpcGxvY29jY3VzKGJvZHlNYXRlcmlhbCkKICAgICAgICAgIDogbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkNhcHN1bGVHZW9tZXRyeSgwLjUsIHNwZWNpZXMuc2lsaG91ZXR0ZSA9PT0gImNvcnluZWZvcm0iID8gMS42NSA6IDIuMiwgMTIsIDI4KSwgYm9keU1hdGVyaWFsKTsKICAgIGJvZHkuY2FzdFNoYWRvdyA9IHRydWU7CiAgICBib2R5LnJvdGF0aW9uLnogPSBNYXRoLlBJIC8gMjsKICAgIHBsYXllci5hZGQoYm9keSk7CiAgICBpZiAoc3BlY2llcy5zaWxob3VldHRlID09PSAiY2Fwc3VsZSIpIHsKICAgICAgY29uc3QgY2Fwc3VsZSA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DYXBzdWxlR2VvbWV0cnkoMC43MiwgMi41NSwgMTIsIDI4KSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4YzhmZmYyLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yMyB9KSk7CiAgICAgIGNhcHN1bGUucm90YXRpb24ueiA9IE1hdGguUEkgLyAyOwogICAgICBwbGF5ZXIuYWRkKGNhcHN1bGUpOwogICAgfQogICAgY29uc3QgbnVjbGVvaWQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4yMiwgMTYsIDgpLCBjb3JlTWF0ZXJpYWwpOwogICAgbnVjbGVvaWQucG9zaXRpb24uc2V0KDAuMTYsIDAuMTgsIDAuMDYpOwogICAgcGxheWVyLmFkZChudWNsZW9pZCk7CiAgICBjb25zdCBoYWxvID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMS4xOCwgMC4wMjUsIDYsIDcyKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IHNwZWNpZXMuY29sb3JBLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4zNiB9KSk7CiAgICBoYWxvLnJvdGF0aW9uLnggPSBNYXRoLlBJIC8gMjsKICAgIGhhbG8ucG9zaXRpb24ueSA9IC0wLjM2OwogICAgcGxheWVyLmFkZChoYWxvKTsKICB9CgogIGZ1bmN0aW9uIHVwZGF0ZShzdGF0ZTogR2FtZVN0YXRlLCBkdDogbnVtYmVyKTogdm9pZCB7CiAgICBjb25zdCBkZWx0YSA9IGR0IHx8IGNsb2NrLmdldERlbHRhKCk7CiAgICBpZiAoY3VycmVudFNwZWNpZXMgIT09IHN0YXRlLnNwZWNpZXNJZCkgewogICAgICBjdXJyZW50U3BlY2llcyA9IHN0YXRlLnNwZWNpZXNJZDsKICAgICAgYnVpbGRQbGF5ZXIoc3RhdGUpOwogICAgfQogICAgY29uc3QgcGhhc2UgPSBQSEFTRVNbc3RhdGUucGhhc2VJbmRleF07CiAgICBiZW5jaE1hdGVyaWFsLmVtaXNzaXZlPy5zZXRIZXgocGhhc2UudGludCk7CiAgICBiZW5jaE1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4yNSArIHN0YXRlLnBoYXNlSW5kZXggKiAwLjA3OwogICAgcGxheWVyLnBvc2l0aW9uLnNldChzdGF0ZS5wbGF5ZXIueCwgMC44NiArIE1hdGguc2luKHN0YXRlLmVsYXBzZWQgKiA1LjIpICogMC4wNDUsIHN0YXRlLnBsYXllci56KTsKICAgIHBsYXllci5yb3RhdGlvbi55ID0gTWF0aC5hdGFuMihzdGF0ZS5wbGF5ZXIudngsIHN0YXRlLnBsYXllci52eiB8fCAwLjAwMSk7CiAgICBwbGF5ZXIuc2NhbGUuc2V0U2NhbGFyKDEgKyAoc3RhdGUuc3RhdHVzID09PSAiY29tbWFuZCIgPyAwLjA4IDogMCkpOwogICAgcHJvcEdyb3VwLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiBhbmltYXRlTGFiUHJvcChjaGlsZCwgc3RhdGUsIGRlbHRhKSk7CiAgICBzeW5jQ29sbGVjdGlvbihyb290LCBoYXphcmRzLCBzdGF0ZS5oYXphcmRzLCAoaGF6YXJkKSA9PiBjcmVhdGVIYXphcmRPYmplY3QoaGF6YXJkLCBhc3NldHMpLCB1cGRhdGVIYXphcmRPYmplY3QpOwogICAgc3luY0NvbGxlY3Rpb24ocm9vdCwgcGlja3Vwcywgc3RhdGUucGlja3VwcywgKHBpY2t1cCkgPT4gY3JlYXRlUGlja3VwT2JqZWN0KHBpY2t1cCwgYXNzZXRzKSwgdXBkYXRlUGlja3VwT2JqZWN0KTsKICAgIHN5bmNDb2xsZWN0aW9uKHJvb3QsIGVmZmVjdHMsIHN0YXRlLmVmZmVjdHMsIGNyZWF0ZUVmZmVjdE9iamVjdCwgdXBkYXRlRWZmZWN0T2JqZWN0KTsKCiAgICBjYW1lcmFUYXJnZXQubGVycChuZXcgVEhSRUUuVmVjdG9yMyhzdGF0ZS5wbGF5ZXIueCwgMC4xLCBzdGF0ZS5wbGF5ZXIueiksIE1hdGgubWluKDEsIGRlbHRhICogMi40KSk7CiAgICBkZXNpcmVkQ2FtZXJhLnNldChjYW1lcmFUYXJnZXQueCAtIDQsIDM0LCBjYW1lcmFUYXJnZXQueiArIDM2KTsKICAgIGNhbWVyYS5wb3NpdGlvbi5sZXJwKGRlc2lyZWRDYW1lcmEsIE1hdGgubWluKDEsIGRlbHRhICogMi4xKSk7CiAgICBjYW1lcmEubG9va0F0KGNhbWVyYVRhcmdldC54ICsgMi4yLCAwLjEyLCBjYW1lcmFUYXJnZXQueiAtIDMuNik7CiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7CiAgfQoKICBmdW5jdGlvbiByZXNpemUoKTogdm9pZCB7CiAgICBjb25zdCByZWN0ID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOwogICAgY29uc3Qgd2lkdGggPSBNYXRoLm1heCgzMjAsIE1hdGguZmxvb3IocmVjdC53aWR0aCkpOwogICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoMjYwLCBNYXRoLmZsb29yKHJlY3QuaGVpZ2h0KSk7CiAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQsIGZhbHNlKTsKICAgIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDsKICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7CiAgfQoKICBmdW5jdGlvbiBkaXNwb3NlKCk6IHZvaWQgewogICAgcmVuZGVyZXIuZGlzcG9zZSgpOwogICAgcmVuZGVyZXIuZG9tRWxlbWVudC5yZW1vdmUoKTsKICB9CgogIHJlc2l6ZSgpOwogIHJldHVybiB7IHVwZGF0ZSwgcmVzaXplLCBkaXNwb3NlIH07Cn0KCmZ1bmN0aW9uIGNyZWF0ZVpvbmVTdXJmYWNlKHpvbmU6IFdvcmxkWm9uZSk6IFRIUkVFLk9iamVjdDNEIHsKICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpOwogIGdyb3VwLnBvc2l0aW9uLnNldCh6b25lLmJvdW5kcy54LCAwLjA5NSwgem9uZS5ib3VuZHMueik7CiAgY29uc3Qgc3VyZmFjZSA9IG5ldyBUSFJFRS5NZXNoKAogICAgbmV3IFRIUkVFLkJveEdlb21ldHJ5KHpvbmUuYm91bmRzLndpZHRoLCAwLjA0LCB6b25lLmJvdW5kcy5kZXB0aCksCiAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogem9uZS5jb2xvciwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuMSB9KQogICk7CiAgZ3JvdXAuYWRkKHN1cmZhY2UpOwogIGNvbnN0IGJvcmRlciA9IG5ldyBUSFJFRS5NZXNoKAogICAgbmV3IFRIUkVFLlJpbmdHZW9tZXRyeSgwLjQ4LCAwLjUyLCA0KSwKICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB6b25lLmFjY2VudCwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuMjYgfSkKICApOwogIGJvcmRlci5zY2FsZS5zZXQoem9uZS5ib3VuZHMud2lkdGgsIHpvbmUuYm91bmRzLmRlcHRoLCAxKTsKICBib3JkZXIucm90YXRpb24ueCA9IE1hdGguUEkgLyAyOwogIGJvcmRlci5yb3RhdGlvbi56ID0gTWF0aC5QSSAvIDQ7CiAgYm9yZGVyLnBvc2l0aW9uLnkgPSAwLjAzOwogIGdyb3VwLmFkZChib3JkZXIpOwogIGNvbnN0IGxhYmVsID0gbWFrZUxhYmVsKHpvbmUuc2hvcnRMYWJlbCwgem9uZS5hY2NlbnQpOwogIGxhYmVsLnBvc2l0aW9uLnNldCgtem9uZS5ib3VuZHMud2lkdGggLyAyICsgMy4yLCAwLjM1LCAtem9uZS5ib3VuZHMuZGVwdGggLyAyICsgMi4yKTsKICBncm91cC5hZGQobGFiZWwpOwogIHJldHVybiBncm91cDsKfQoKZnVuY3Rpb24gY3JlYXRlTGFiUHJvcChwcm9wOiBMYWJQcm9wLCBhc3NldHM/OiBWM0Fzc2V0UmVnaXN0cnkpOiBUSFJFRS5PYmplY3QzRCB7CiAgY29uc3QgYXNzZXQgPSBpbnN0YW50aWF0ZUxhYlByb3AocHJvcCwgYXNzZXRzKTsKICBpZiAoYXNzZXQpIHJldHVybiBhc3NldDsKICBpZiAocHJvcC5raW5kID09PSAicGlwZXR0ZSIpIHJldHVybiBjcmVhdGVQaXBldHRlKHByb3ApOwogIGlmIChwcm9wLmtpbmQgPT09ICJwZXRyaURpc2giKSByZXR1cm4gY3JlYXRlUGV0cmlEaXNoKHByb3ApOwogIGlmIChwcm9wLmtpbmQgPT09ICJmZXJuYmFjaEZsYXNrIikgcmV0dXJuIGNyZWF0ZUZlcm5iYWNoRmxhc2socHJvcCk7CiAgaWYgKHByb3Aua2luZCA9PT0gImNlbnRyaWZ1Z2UiKSByZXR1cm4gY3JlYXRlQ2VudHJpZnVnZShwcm9wKTsKICBpZiAocHJvcC5raW5kID09PSAidHViZVJhY2siKSByZXR1cm4gY3JlYXRlVHViZVJhY2socHJvcCk7CiAgaWYgKHByb3Aua2luZCA9PT0gInRpcEJveCIpIHJldHVybiBjcmVhdGVUaXBCb3gocHJvcCk7CiAgaWYgKHByb3Aua2luZCA9PT0gInNwaWxsIikgcmV0dXJuIGNyZWF0ZVNwaWxsKHByb3ApOwogIHJldHVybiBjcmVhdGVNaWNyb3Njb3BlU2xpZGUocHJvcCk7Cn0KCmZ1bmN0aW9uIGluc3RhbnRpYXRlTGFiUHJvcChwcm9wOiBMYWJQcm9wLCBhc3NldHM/OiBWM0Fzc2V0UmVnaXN0cnkpOiBUSFJFRS5PYmplY3QzRCB8IG51bGwgewogIGNvbnN0IGtleSA9IFBST1BfQVNTRVRfS0VZU1twcm9wLmlkXTsKICBjb25zdCBpbnN0YW5jZSA9IGtleSA/IGFzc2V0cz8uaW5zdGFudGlhdGUoa2V5KSA6IG51bGw7CiAgaWYgKCFpbnN0YW5jZSkgcmV0dXJuIG51bGw7CiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTsKICBncm91cC51c2VyRGF0YS5raW5kID0gcHJvcC5raW5kOwogIGdyb3VwLnVzZXJEYXRhLmFzc2V0S2V5ID0ga2V5OwogIGdyb3VwLnBvc2l0aW9uLnNldChwcm9wLngsIFBST1BfQVNTRVRfWVtwcm9wLmlkXSA/PyAwLjIsIHByb3Aueik7CiAgZ3JvdXAucm90YXRpb24ueSA9IHByb3AuYW5nbGUgPz8gMDsKICBncm91cC5hZGQoaW5zdGFuY2UpOwogIHJldHVybiBncm91cDsKfQoKZnVuY3Rpb24gY3JlYXRlUGlwZXR0ZShwcm9wOiBMYWJQcm9wKTogVEhSRUUuT2JqZWN0M0QgewogIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgZ3JvdXAudXNlckRhdGEua2luZCA9IHByb3Aua2luZDsKICBncm91cC5wb3NpdGlvbi5zZXQocHJvcC54LCAwLjUsIHByb3Aueik7CiAgZ3JvdXAucm90YXRpb24ueSA9IHByb3AuYW5nbGUgPz8gMDsKICBjb25zdCBib2R5TWF0ID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4ZThlZWYyLCByb3VnaG5lc3M6IDAuNTIsIG1ldGFsbmVzczogMC4wNiB9KTsKICBjb25zdCBibHVlTWF0ID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4NWNjNmRmLCByb3VnaG5lc3M6IDAuNDIsIG1ldGFsbmVzczogMC4wNSwgZW1pc3NpdmU6IDB4MGE1MzY0LCBlbWlzc2l2ZUludGVuc2l0eTogMC4xOCB9KTsKICBjb25zdCBzaGFkb3dNYXQgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgyNjMxM2EsIHJvdWdobmVzczogMC43IH0pOwogIGNvbnN0IGhhbmRsZSA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShwcm9wLndpZHRoICogMC43OCwgMS4xNSwgcHJvcC5kZXB0aCksIGJvZHlNYXQpOwogIGhhbmRsZS5jYXN0U2hhZG93ID0gdHJ1ZTsKICBncm91cC5hZGQoaGFuZGxlKTsKICBjb25zdCBwbHVuZ2VyID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDUuMiwgMS40NSwgcHJvcC5kZXB0aCAqIDEuMDgpLCBibHVlTWF0KTsKICBwbHVuZ2VyLnBvc2l0aW9uLnggPSAtcHJvcC53aWR0aCAqIDAuNDQ7CiAgcGx1bmdlci5jYXN0U2hhZG93ID0gdHJ1ZTsKICBncm91cC5hZGQocGx1bmdlcik7CiAgY29uc3Qgd2luZG93ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDYsIDAuMDgsIHByb3AuZGVwdGggKiAxLjA4KSwgc2hhZG93TWF0KTsKICB3aW5kb3cucG9zaXRpb24uc2V0KC0yLCAwLjYyLCAwKTsKICBncm91cC5hZGQod2luZG93KTsKICBjb25zdCBjb25lID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkNvbmVHZW9tZXRyeSgwLjcyLCA5LjIsIDE4KSwgYmx1ZU1hdCk7CiAgY29uZS5yb3RhdGlvbi56ID0gLU1hdGguUEkgLyAyOwogIGNvbmUucG9zaXRpb24ueCA9IHByb3Aud2lkdGggKiAwLjQ3OwogIGNvbmUuY2FzdFNoYWRvdyA9IHRydWU7CiAgZ3JvdXAuYWRkKGNvbmUpOwogIHJldHVybiBncm91cDsKfQoKZnVuY3Rpb24gY3JlYXRlUGV0cmlEaXNoKHByb3A6IExhYlByb3ApOiBUSFJFRS5PYmplY3QzRCB7CiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTsKICBncm91cC51c2VyRGF0YS5raW5kID0gcHJvcC5raW5kOwogIGdyb3VwLnBvc2l0aW9uLnNldChwcm9wLngsIDAuMTgsIHByb3Aueik7CiAgY29uc3QgYWdhciA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KHByb3AucmFkaXVzID8/IDEyLCBwcm9wLnJhZGl1cyA/PyAxMiwgMC4zMiwgOTYpLCBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmNGM3N2MsIHJvdWdobmVzczogMC42NCwgZW1pc3NpdmU6IDB4M2YyNDBhLCBlbWlzc2l2ZUludGVuc2l0eTogMC4yMiB9KSk7CiAgYWdhci5yZWNlaXZlU2hhZG93ID0gdHJ1ZTsKICBncm91cC5hZGQoYWdhcik7CiAgY29uc3QgcmltID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkocHJvcC5yYWRpdXMgPz8gMTIuNSwgMC4yOCwgMTIsIDEyMCksIG5ldyBUSFJFRS5NZXNoUGh5c2ljYWxNYXRlcmlhbCh7IGNvbG9yOiAweGRmZmJmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuMzQsIHJvdWdobmVzczogMC4yLCB0cmFuc21pc3Npb246IDAuNDIgfSkpOwogIHJpbS5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7CiAgcmltLnBvc2l0aW9uLnkgPSAwLjMyOwogIGdyb3VwLmFkZChyaW0pOwogIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAxMDsgaW5kZXggKz0gMSkgewogICAgY29uc3QgcGxhcXVlID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC42ICsgKGluZGV4ICUgMykgKiAwLjMyLCAwLjYgKyAoaW5kZXggJSAzKSAqIDAuMzIsIDAuMDQsIDMyKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4OGQ1YjJjLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yNiB9KSk7CiAgICBjb25zdCBhbmdsZSA9IGluZGV4ICogMi4zOTk7CiAgICBjb25zdCByYWRpdXMgPSAyLjYgKyAoaW5kZXggJSA1KSAqIDEuODsKICAgIHBsYXF1ZS5wb3NpdGlvbi5zZXQoTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLCAwLjUyLCBNYXRoLnNpbihhbmdsZSkgKiByYWRpdXMpOwogICAgZ3JvdXAuYWRkKHBsYXF1ZSk7CiAgfQogIHJldHVybiBncm91cDsKfQoKZnVuY3Rpb24gY3JlYXRlRmVybmJhY2hGbGFzayhwcm9wOiBMYWJQcm9wKTogVEhSRUUuT2JqZWN0M0QgewogIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgZ3JvdXAudXNlckRhdGEua2luZCA9IHByb3Aua2luZDsKICBncm91cC5wb3NpdGlvbi5zZXQocHJvcC54LCAwLjI0LCBwcm9wLnopOwogIGNvbnN0IGdsYXNzID0gbmV3IFRIUkVFLk1lc2hQaHlzaWNhbE1hdGVyaWFsKHsgY29sb3I6IDB4YzhmY2ZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yOCwgcm91Z2huZXNzOiAwLjEyLCB0cmFuc21pc3Npb246IDAuNTIsIHRoaWNrbmVzczogMC41IH0pOwogIGNvbnN0IG1lZGlhID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4NmZkNGJlLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC41Miwgcm91Z2huZXNzOiAwLjQ1LCBlbWlzc2l2ZTogMHgxNDVjNTMsIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjI2IH0pOwogIGNvbnN0IGJ1bGIgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkocHJvcC5yYWRpdXMgPz8gNywgNDgsIDI0KSwgZ2xhc3MpOwogIGJ1bGIuc2NhbGUueSA9IDAuNTI7CiAgYnVsYi5wb3NpdGlvbi55ID0gMi42OwogIGJ1bGIuY2FzdFNoYWRvdyA9IHRydWU7CiAgZ3JvdXAuYWRkKGJ1bGIpOwogIGNvbnN0IGxpcXVpZCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KChwcm9wLnJhZGl1cyA/PyA3KSAqIDAuNzYsIChwcm9wLnJhZGl1cyA/PyA3KSAqIDAuNzgsIDAuNDUsIDY0KSwgbWVkaWEpOwogIGxpcXVpZC5wb3NpdGlvbi55ID0gMS44NTsKICBncm91cC5hZGQobGlxdWlkKTsKICBjb25zdCBuZWNrID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMS4xNSwgMS41LCA1LjYsIDMyKSwgZ2xhc3MpOwogIG5lY2sucG9zaXRpb24ueSA9IDYuMjsKICBuZWNrLmNhc3RTaGFkb3cgPSB0cnVlOwogIGdyb3VwLmFkZChuZWNrKTsKICByZXR1cm4gZ3JvdXA7Cn0KCmZ1bmN0aW9uIGNyZWF0ZUNlbnRyaWZ1Z2UocHJvcDogTGFiUHJvcCk6IFRIUkVFLk9iamVjdDNEIHsKICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpOwogIGdyb3VwLnVzZXJEYXRhLmtpbmQgPSBwcm9wLmtpbmQ7CiAgZ3JvdXAucG9zaXRpb24uc2V0KHByb3AueCwgMC4yLCBwcm9wLnopOwogIGNvbnN0IGJhc2UgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeShwcm9wLnJhZGl1cyA/PyAxMiwgcHJvcC5yYWRpdXMgPz8gMTIsIDEuMiwgOTYpLCBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhjZmQ3ZGYsIHJvdWdobmVzczogMC41LCBtZXRhbG5lc3M6IDAuMDggfSkpOwogIGJhc2UuY2FzdFNoYWRvdyA9IHRydWU7CiAgZ3JvdXAuYWRkKGJhc2UpOwogIGNvbnN0IHJvdG9yID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgcm90b3IudXNlckRhdGEucm90b3IgPSB0cnVlOwogIHJvdG9yLnBvc2l0aW9uLnkgPSAwLjg0OwogIGNvbnN0IHJvdG9yTWF0ID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4NWQ3ZmE3LCByb3VnaG5lc3M6IDAuNDIsIG1ldGFsbmVzczogMC4xOCwgZW1pc3NpdmU6IDB4MTYyZDRjLCBlbWlzc2l2ZUludGVuc2l0eTogMC4xOCB9KTsKICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgODsgaW5kZXggKz0gMSkgewogICAgY29uc3QgYXJtID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDEuNTUsIDAuMjgsIDEwKSwgcm90b3JNYXQpOwogICAgYXJtLnJvdGF0aW9uLnkgPSAoaW5kZXggLyA4KSAqIE1hdGguUEkgKiAyOwogICAgYXJtLnBvc2l0aW9uLnNldChNYXRoLnNpbihhcm0ucm90YXRpb24ueSkgKiAyLjQsIDAsIE1hdGguY29zKGFybS5yb3RhdGlvbi55KSAqIDIuNCk7CiAgICBhcm0uY2FzdFNoYWRvdyA9IHRydWU7CiAgICByb3Rvci5hZGQoYXJtKTsKICB9CiAgY29uc3QgaHViID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMi40LCAyLjksIDAuNywgNDgpLCByb3Rvck1hdCk7CiAgaHViLmNhc3RTaGFkb3cgPSB0cnVlOwogIHJvdG9yLmFkZChodWIpOwogIGdyb3VwLmFkZChyb3Rvcik7CiAgcmV0dXJuIGdyb3VwOwp9CgpmdW5jdGlvbiBjcmVhdGVUdWJlUmFjayhwcm9wOiBMYWJQcm9wKTogVEhSRUUuT2JqZWN0M0QgewogIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgZ3JvdXAudXNlckRhdGEua2luZCA9IHByb3Aua2luZDsKICBncm91cC5wb3NpdGlvbi5zZXQocHJvcC54LCAwLjMsIHByb3Aueik7CiAgY29uc3QgcmFja01hdCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDIwMzQ0YSwgcm91Z2huZXNzOiAwLjYyLCBtZXRhbG5lc3M6IDAuMDQsIGVtaXNzaXZlOiAweDBiMWMyZCwgZW1pc3NpdmVJbnRlbnNpdHk6IDAuMiB9KTsKICBjb25zdCB0dWJlTWF0cyA9IFsweDc4ZGVmMiwgMHhmNWE2YzcsIDB4ZjNkMDZmLCAweDkzZjBjYV0ubWFwKChjb2xvcikgPT4gbmV3IFRIUkVFLk1lc2hQaHlzaWNhbE1hdGVyaWFsKHsgY29sb3IsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjYyLCByb3VnaG5lc3M6IDAuMjIsIHRyYW5zbWlzc2lvbjogMC4yNiB9KSk7CiAgY29uc3QgYmFzZSA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShwcm9wLndpZHRoLCAxLCBwcm9wLmRlcHRoKSwgcmFja01hdCk7CiAgYmFzZS5jYXN0U2hhZG93ID0gdHJ1ZTsKICBncm91cC5hZGQoYmFzZSk7CiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMzsgcm93ICs9IDEpIHsKICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDY7IGNvbCArPSAxKSB7CiAgICAgIGNvbnN0IHR1YmUgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjcyLCAwLjU4LCA0LjIsIDI0KSwgdHViZU1hdHNbKHJvdyArIGNvbCkgJSB0dWJlTWF0cy5sZW5ndGhdKTsKICAgICAgdHViZS5wb3NpdGlvbi5zZXQoLXByb3Aud2lkdGggLyAyICsgMy40ICsgY29sICogNC4yLCAyLjUsIC1wcm9wLmRlcHRoIC8gMiArIDIuNyArIHJvdyAqIDMuOCk7CiAgICAgIHR1YmUuY2FzdFNoYWRvdyA9IHRydWU7CiAgICAgIGdyb3VwLmFkZCh0dWJlKTsKICAgIH0KICB9CiAgcmV0dXJuIGdyb3VwOwp9CgpmdW5jdGlvbiBjcmVhdGVUaXBCb3gocHJvcDogTGFiUHJvcCk6IFRIUkVFLk9iamVjdDNEIHsKICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpOwogIGdyb3VwLnVzZXJEYXRhLmtpbmQgPSBwcm9wLmtpbmQ7CiAgZ3JvdXAucG9zaXRpb24uc2V0KHByb3AueCwgMC4zNSwgcHJvcC56KTsKICBjb25zdCBiYXNlID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KHByb3Aud2lkdGgsIDEuMiwgcHJvcC5kZXB0aCksIG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDEyMzY0Yiwgcm91Z2huZXNzOiAwLjQ4LCBlbWlzc2l2ZTogMHgwODIwMzMsIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjIyIH0pKTsKICBiYXNlLmNhc3RTaGFkb3cgPSB0cnVlOwogIGdyb3VwLmFkZChiYXNlKTsKICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA0OyByb3cgKz0gMSkgewogICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNTsgY29sICs9IDEpIHsKICAgICAgY29uc3QgdGlwID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkNvbmVHZW9tZXRyeSgwLjIyLCAxLjQsIDEyKSwgbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4YjhmNGZmLCByb3VnaG5lc3M6IDAuMzggfSkpOwogICAgICB0aXAucG9zaXRpb24uc2V0KC1wcm9wLndpZHRoIC8gMiArIDEuOCArIGNvbCAqIDEuOCwgMS40NSwgLXByb3AuZGVwdGggLyAyICsgMS4zICsgcm93ICogMS42KTsKICAgICAgdGlwLmNhc3RTaGFkb3cgPSB0cnVlOwogICAgICBncm91cC5hZGQodGlwKTsKICAgIH0KICB9CiAgcmV0dXJuIGdyb3VwOwp9CgpmdW5jdGlvbiBjcmVhdGVTcGlsbChwcm9wOiBMYWJQcm9wKTogVEhSRUUuT2JqZWN0M0QgewogIGNvbnN0IHNwaWxsID0gbmV3IFRIUkVFLk1lc2goCiAgICBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoTWF0aC5tYXgocHJvcC53aWR0aCwgcHJvcC5kZXB0aCkgKiAwLjQ4LCA2NCksCiAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHg2OGU0Y2YsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjE4IH0pCiAgKTsKICBzcGlsbC51c2VyRGF0YS5raW5kID0gcHJvcC5raW5kOwogIHNwaWxsLnBvc2l0aW9uLnNldChwcm9wLngsIDAuMTYsIHByb3Aueik7CiAgc3BpbGwuc2NhbGUueiA9IHByb3AuZGVwdGggLyBwcm9wLndpZHRoOwogIHNwaWxsLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7CiAgcmV0dXJuIHNwaWxsOwp9CgpmdW5jdGlvbiBjcmVhdGVNaWNyb3Njb3BlU2xpZGUocHJvcDogTGFiUHJvcCk6IFRIUkVFLk9iamVjdDNEIHsKICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpOwogIGdyb3VwLnVzZXJEYXRhLmtpbmQgPSBwcm9wLmtpbmQ7CiAgZ3JvdXAucG9zaXRpb24uc2V0KHByb3AueCwgMC4xNiwgcHJvcC56KTsKICBjb25zdCBnbGFzcyA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShwcm9wLndpZHRoLCAwLjEyLCBwcm9wLmRlcHRoKSwgbmV3IFRIUkVFLk1lc2hQaHlzaWNhbE1hdGVyaWFsKHsgY29sb3I6IDB4ZGZmYmZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yNCwgcm91Z2huZXNzOiAwLjIsIHRyYW5zbWlzc2lvbjogMC40NiB9KSk7CiAgZ3JvdXAuYWRkKGdsYXNzKTsKICBjb25zdCBjb3ZlcnNsaXAgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkocHJvcC53aWR0aCAqIDAuNDQsIDAuMDYsIHByb3AuZGVwdGggKiAwLjU1KSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4ZmZmZmZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4xOCB9KSk7CiAgY292ZXJzbGlwLnBvc2l0aW9uLnkgPSAwLjEyOwogIGdyb3VwLmFkZChjb3ZlcnNsaXApOwogIHJldHVybiBncm91cDsKfQoKZnVuY3Rpb24gYW5pbWF0ZUxhYlByb3Aob2JqZWN0OiBUSFJFRS5PYmplY3QzRCwgc3RhdGU6IEdhbWVTdGF0ZSwgZGVsdGE6IG51bWJlcik6IHZvaWQgewogIGlmIChvYmplY3QudXNlckRhdGEua2luZCA9PT0gInNwaWxsIikgb2JqZWN0LnNjYWxlLnggPSAxICsgTWF0aC5zaW4oc3RhdGUuZWxhcHNlZCAqIDEuMykgKiAwLjAzNTsKICBvYmplY3QudHJhdmVyc2UoKGNoaWxkKSA9PiB7CiAgICBpZiAoY2hpbGQudXNlckRhdGEucm90b3IpIGNoaWxkLnJvdGF0aW9uLnkgKz0gZGVsdGEgKiAoc3RhdGUucGhhc2VJbmRleCA+PSAzID8gMS44IDogMC40Mik7CiAgfSk7Cn0KCmZ1bmN0aW9uIGRpcGxvY29jY3VzKG1hdGVyaWFsOiBUSFJFRS5NYXRlcmlhbCk6IFRIUkVFLkdyb3VwIHsKICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpOwogIGNvbnN0IGxlZnQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC42NCwgMzIsIDE2KSwgbWF0ZXJpYWwpOwogIGNvbnN0IHJpZ2h0ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuNjQsIDMyLCAxNiksIG1hdGVyaWFsKTsKICBsZWZ0LnBvc2l0aW9uLnggPSAtMC40NjsKICByaWdodC5wb3NpdGlvbi54ID0gMC40NjsKICBsZWZ0LmNhc3RTaGFkb3cgPSB0cnVlOwogIHJpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlOwogIGdyb3VwLmFkZChsZWZ0LCByaWdodCk7CiAgcmV0dXJuIGdyb3VwOwp9CgpmdW5jdGlvbiBjcmVhdGVIYXphcmRPYmplY3QoaGF6YXJkOiBIYXphcmRFbnRpdHksIGFzc2V0cz86IFYzQXNzZXRSZWdpc3RyeSk6IFRIUkVFLk9iamVjdDNEIHsKICBjb25zdCBhc3NldEtleSA9IEhBWkFSRF9BU1NFVF9LRVlTW2hhemFyZC5raW5kXTsKICBjb25zdCBhc3NldCA9IGFzc2V0S2V5ID8gYXNzZXRzPy5pbnN0YW50aWF0ZShhc3NldEtleSkgOiBudWxsOwogIGlmIChhc3NldCkgewogICAgYXNzZXQudXNlckRhdGEuYXNzZXRLZXkgPSBhc3NldEtleTsKICAgIGFzc2V0LnVzZXJEYXRhLmtpbmQgPSBoYXphcmQua2luZDsKICAgIHJldHVybiBhc3NldDsKICB9CiAgaWYgKGhhemFyZC5raW5kID09PSAicGhhZ2UiKSB7CiAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpOwogICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZmQ2OGEsIGVtaXNzaXZlOiAweDZkM2MwYywgZW1pc3NpdmVJbnRlbnNpdHk6IDAuNzIsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjksIHJvdWdobmVzczogMC40MiB9KTsKICAgIGNvbnN0IGhlYWQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuSWNvc2FoZWRyb25HZW9tZXRyeSgwLjU4LCAxKSwgbWF0ZXJpYWwpOwogICAgY29uc3QgdGFpbCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoMC4xOCwgMS4wNSwgOCksIG1hdGVyaWFsKTsKICAgIHRhaWwucG9zaXRpb24ueiA9IC0wLjcyOwogICAgdGFpbC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7CiAgICBncm91cC5hZGQoaGVhZCwgdGFpbCk7CiAgICByZXR1cm4gZ3JvdXA7CiAgfQogIGlmIChoYXphcmQua2luZCA9PT0gImRyb3BsZXQiKSB7CiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuODIsIDI0LCAxNCksIG5ldyBUSFJFRS5NZXNoUGh5c2ljYWxNYXRlcmlhbCh7IGNvbG9yOiAweDcwZWFmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuNjgsIHJvdWdobmVzczogMC4xOCwgdHJhbnNtaXNzaW9uOiAwLjM0LCBlbWlzc2l2ZTogMHgwYjUyNjYsIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjI4IH0pKTsKICB9CiAgaWYgKGhhemFyZC5raW5kID09PSAicGxhcXVlIiB8fCBoYXphcmQua2luZCA9PT0gInNwaWxsIikgewogICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKAogICAgICBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgxLCAxLCAwLjA4LCA2NCksCiAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBoYXphcmQua2luZCA9PT0gInBsYXF1ZSIgPyAweDhlNGIyZCA6IDB4NWZlMGNhLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogaGF6YXJkLmtpbmQgPT09ICJwbGFxdWUiID8gMC4zOCA6IDAuMzIgfSkKICAgICk7CiAgfQogIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsKICAgIGNvbG9yOiBoYXphcmQua2luZCA9PT0gInNob2NrIiA/IDB4OGZlZmZmIDogaGF6YXJkLmtpbmQgPT09ICJjcmFjayIgPyAweGZmYTk3OSA6IGhhemFyZC5raW5kID09PSAicm90b3IiID8gMHg5ZGI3ZmYgOiAweGZmNzg5NSwKICAgIGVtaXNzaXZlOiBoYXphcmQua2luZCA9PT0gInJ1cHR1cmUiID8gMHg4ZjI0M2QgOiAweDIzNGM1ZiwKICAgIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjc2LAogICAgdHJhbnNwYXJlbnQ6IHRydWUsCiAgICBvcGFjaXR5OiBoYXphcmQuYWdlIDwgaGF6YXJkLnRlbGVncmFwaCA/IDAuMzUgOiAwLjg4LAogICAgcm91Z2huZXNzOiAwLjQ2CiAgfSk7CiAgaWYgKGhhemFyZC5raW5kID09PSAiY3JhY2siKSByZXR1cm4gY3JlYXRlQ3JhY2sobWF0ZXJpYWwsIGhhemFyZC53aWR0aCk7CiAgaWYgKGhhemFyZC5raW5kID09PSAic2hvY2siKSByZXR1cm4gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDEuMzUsIDAuMTQsIDI4KSwgbWF0ZXJpYWwpOwogIGlmIChoYXphcmQua2luZCA9PT0gInJvdG9yIikgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxLjQsIDAuMTgsIGhhemFyZC5yYWRpdXMgKiAyKSwgbWF0ZXJpYWwpOwogIHJldHVybiBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeShoYXphcmQucmFkaXVzLCAwLjA4LCA4LCA3MiksIG1hdGVyaWFsKTsKfQoKZnVuY3Rpb24gY3JlYXRlQ3JhY2sobWF0ZXJpYWw6IFRIUkVFLk1hdGVyaWFsLCB3aWR0aDogbnVtYmVyKTogVEhSRUUuT2JqZWN0M0QgewogIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7CiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDU7IGluZGV4ICs9IDEpIHsKICAgIGNvbnN0IHNlZ21lbnQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGggLyA1LCAwLjE2LCAwLjI2KSwgbWF0ZXJpYWwpOwogICAgc2VnbWVudC5wb3NpdGlvbi54ID0gLXdpZHRoIC8gMiArIGluZGV4ICogKHdpZHRoIC8gNSkgKyB3aWR0aCAvIDEwOwogICAgc2VnbWVudC5wb3NpdGlvbi56ID0gTWF0aC5zaW4oaW5kZXggKiAxLjcpICogMC4zNDsKICAgIHNlZ21lbnQucm90YXRpb24ueSA9IE1hdGguc2luKGluZGV4ICogMi4xKSAqIDAuMzU7CiAgICBncm91cC5hZGQoc2VnbWVudCk7CiAgfQogIHJldHVybiBncm91cDsKfQoKZnVuY3Rpb24gdXBkYXRlSGF6YXJkT2JqZWN0KG9iamVjdDogVEhSRUUuT2JqZWN0M0QsIGhhemFyZDogSGF6YXJkRW50aXR5KTogdm9pZCB7CiAgb2JqZWN0LnBvc2l0aW9uLnNldChoYXphcmQueCwgaGF6YXJkLmtpbmQgPT09ICJwbGFxdWUiIHx8IGhhemFyZC5raW5kID09PSAic3BpbGwiIHx8IGhhemFyZC5raW5kID09PSAicnVwdHVyZSIgPyAwLjI2IDogMC44NiwgaGF6YXJkLnopOwogIG9iamVjdC5yb3RhdGlvbi55ID0gLWhhemFyZC5hbmdsZTsKICBjb25zdCB0ZWxlZ3JhcGhQdWxzZSA9IGhhemFyZC5hZ2UgPCBoYXphcmQudGVsZWdyYXBoID8gMSArIE1hdGguc2luKGhhemFyZC5hZ2UgKiAxOCkgKiAwLjA4IDogMTsKICBpZiAoaGF6YXJkLmtpbmQgPT09ICJwbGFxdWUiIHx8IGhhemFyZC5raW5kID09PSAic3BpbGwiKSBvYmplY3Quc2NhbGUuc2V0KGhhemFyZC5yYWRpdXMsIDEsIGhhemFyZC5yYWRpdXMpOwogIGVsc2UgaWYgKGhhemFyZC5raW5kID09PSAicnVwdHVyZSIpIG9iamVjdC5zY2FsZS5zZXRTY2FsYXIoTWF0aC5tYXgoMC42LCBoYXphcmQucmFkaXVzKSk7CiAgZWxzZSBvYmplY3Quc2NhbGUuc2V0U2NhbGFyKHRlbGVncmFwaFB1bHNlKTsKICBvYmplY3QudHJhdmVyc2UoKGNoaWxkKSA9PiB7CiAgICBjb25zdCBtZXNoID0gY2hpbGQgYXMgVEhSRUUuTWVzaDsKICAgIGNvbnN0IG1hdGVyaWFsID0gbWVzaC5tYXRlcmlhbCBhcyBUSFJFRS5NYXRlcmlhbCAmIHsgb3BhY2l0eT86IG51bWJlciB9OwogICAgaWYgKG1hdGVyaWFsPy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIG1hdGVyaWFsLm9wYWNpdHkgPSBoYXphcmQuYWdlIDwgaGF6YXJkLnRlbGVncmFwaCA/IDAuMyA6IGhhemFyZC5raW5kID09PSAicGxhcXVlIiB8fCBoYXphcmQua2luZCA9PT0gInNwaWxsIiA/IDAuNDIgOiAwLjg4OwogIH0pOwp9CgpmdW5jdGlvbiBjcmVhdGVQaWNrdXBPYmplY3QocGlja3VwOiBQaWNrdXBFbnRpdHksIGFzc2V0cz86IFYzQXNzZXRSZWdpc3RyeSk6IFRIUkVFLk9iamVjdDNEIHsKICBjb25zdCBhc3NldCA9IGFzc2V0cz8uaW5zdGFudGlhdGUoUElDS1VQX0FTU0VUX0tFWVNbcGlja3VwLmtpbmRdKTsKICBpZiAoYXNzZXQpIHsKICAgIGFzc2V0LnVzZXJEYXRhLmFzc2V0S2V5ID0gUElDS1VQX0FTU0VUX0tFWVNbcGlja3VwLmtpbmRdOwogICAgYXNzZXQudXNlckRhdGEua2luZCA9IHBpY2t1cC5raW5kOwogICAgcmV0dXJuIGFzc2V0OwogIH0KICBjb25zdCBjb2xvciA9IHBpY2t1cC5raW5kID09PSAicGlwZXR0ZVRpcCIgPyAweGI4ZjRmZiA6IHBpY2t1cC5raW5kID09PSAicmVhZ2VudERyb3BsZXQiID8gMHg3NGUwZmYgOiBwaWNrdXAua2luZCA9PT0gImFnYXJQbHVnIiA/IDB4ZjZjYTdmIDogMHhhOGZmZGY7CiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvciwgZW1pc3NpdmU6IGNvbG9yLCBlbWlzc2l2ZUludGVuc2l0eTogMC4zNiwgcm91Z2huZXNzOiAwLjM2IH0pOwogIGlmIChwaWNrdXAua2luZCA9PT0gInBpcGV0dGVUaXAiKSB7CiAgICBjb25zdCB0aXAgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQ29uZUdlb21ldHJ5KDAuMywgMS4zNSwgMTYpLCBtYXRlcmlhbCk7CiAgICB0aXAucm90YXRpb24ueiA9IE1hdGguUEk7CiAgICByZXR1cm4gdGlwOwogIH0KICBpZiAocGlja3VwLmtpbmQgPT09ICJyZWFnZW50RHJvcGxldCIpIHJldHVybiBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC40OCwgMjAsIDEyKSwgbWF0ZXJpYWwpOwogIGlmIChwaWNrdXAua2luZCA9PT0gImFnYXJQbHVnIikgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuNDgsIDAuNDgsIDAuNDIsIDI0KSwgbWF0ZXJpYWwpOwogIHJldHVybiBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuT2N0YWhlZHJvbkdlb21ldHJ5KDAuNDgsIDApLCBtYXRlcmlhbCk7Cn0KCmZ1bmN0aW9uIHVwZGF0ZVBpY2t1cE9iamVjdChvYmplY3Q6IFRIUkVFLk9iamVjdDNELCBwaWNrdXA6IFBpY2t1cEVudGl0eSk6IHZvaWQgewogIG9iamVjdC5wb3NpdGlvbi5zZXQocGlja3VwLngsIDAuNzggKyBNYXRoLnNpbihwaWNrdXAuYWdlICogNCkgKiAwLjE2LCBwaWNrdXAueik7CiAgb2JqZWN0LnJvdGF0aW9uLnkgKz0gMC4wNDsKICBvYmplY3Qucm90YXRpb24ueCArPSAwLjAxODsKfQoKZnVuY3Rpb24gY3JlYXRlRWZmZWN0T2JqZWN0KGVmZmVjdDogRWZmZWN0RXZlbnQpOiBUSFJFRS5PYmplY3QzRCB7CiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoewogICAgY29sb3I6IGVmZmVjdC50eXBlID09PSAiZGFtYWdlIiB8fCBlZmZlY3QudHlwZSA9PT0gImx5c2lzIiA/IDB4ZmY3ODk1IDogZWZmZWN0LnR5cGUgPT09ICJjb21tYW5kIiA/IDB4ZDdmYmZmIDogMHhhOGZmZGYsCiAgICB0cmFuc3BhcmVudDogdHJ1ZSwKICAgIG9wYWNpdHk6IDAuNzgKICB9KTsKICByZXR1cm4gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlJpbmdHZW9tZXRyeSgwLjI4LCAwLjQsIDQwKSwgbWF0ZXJpYWwpOwp9CgpmdW5jdGlvbiB1cGRhdGVFZmZlY3RPYmplY3Qob2JqZWN0OiBUSFJFRS5PYmplY3QzRCwgZWZmZWN0OiBFZmZlY3RFdmVudCk6IHZvaWQgewogIG9iamVjdC5wb3NpdGlvbi5zZXQoZWZmZWN0LngsIDAuODIgKyBlZmZlY3QuYWdlICogMC4zNCwgZWZmZWN0LnopOwogIG9iamVjdC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyOwogIG9iamVjdC5zY2FsZS5zZXRTY2FsYXIoMSArIGVmZmVjdC5hZ2UgKiAyLjUpOwogIG9iamVjdC50cmF2ZXJzZSgoY2hpbGQpID0+IHsKICAgIGNvbnN0IG1lc2ggPSBjaGlsZCBhcyBUSFJFRS5NZXNoOwogICAgY29uc3QgbWF0ZXJpYWwgPSBtZXNoLm1hdGVyaWFsIGFzIFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIHwgdW5kZWZpbmVkOwogICAgaWYgKG1hdGVyaWFsPy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIG1hdGVyaWFsLm9wYWNpdHkgPSBNYXRoLm1heCgwLCAwLjc4IC0gZWZmZWN0LmFnZSAqIDAuNSk7CiAgfSk7Cn0KCmZ1bmN0aW9uIG1ha2VMYWJlbCh0ZXh0OiBzdHJpbmcsIGNvbG9yOiBudW1iZXIpOiBUSFJFRS5TcHJpdGUgewogIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImNhbnZhcyIpOwogIGNhbnZhcy53aWR0aCA9IDUxMjsKICBjYW52YXMuaGVpZ2h0ID0gMTI4OwogIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgiMmQiKTsKICBpZiAoY29udGV4dCkgewogICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTsKICAgIGNvbnRleHQuZmlsbFN0eWxlID0gInJnYmEoMywgMTIsIDIyLCAwLjcyKSI7CiAgICByb3VuZFJlY3QoY29udGV4dCwgMTIsIDIwLCA0ODgsIDgyLCAyNCk7CiAgICBjb250ZXh0LmZpbGwoKTsKICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBgIyR7Y29sb3IudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDYsICIwIil9YDsKICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwLjcyOwogICAgY29udGV4dC5zdHJva2UoKTsKICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxOwogICAgY29udGV4dC5maWxsU3R5bGUgPSAiI2VjZmJmZiI7CiAgICBjb250ZXh0LmZvbnQgPSAiODAwIDM0cHggR2VvcmdpYSwgc2VyaWYiOwogICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCAzOCwgNzMpOwogIH0KICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLkNhbnZhc1RleHR1cmUoY2FudmFzKTsKICB0ZXh0dXJlLmNvbG9yU3BhY2UgPSBUSFJFRS5TUkdCQ29sb3JTcGFjZTsKICBjb25zdCBzcHJpdGUgPSBuZXcgVEhSRUUuU3ByaXRlKG5ldyBUSFJFRS5TcHJpdGVNYXRlcmlhbCh7IG1hcDogdGV4dHVyZSwgdHJhbnNwYXJlbnQ6IHRydWUsIGRlcHRoV3JpdGU6IGZhbHNlIH0pKTsKICBzcHJpdGUuc2NhbGUuc2V0KDgsIDIsIDEpOwogIHJldHVybiBzcHJpdGU7Cn0KCmZ1bmN0aW9uIHJvdW5kUmVjdChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgcmFkaXVzOiBudW1iZXIpOiB2b2lkIHsKICBjb250ZXh0LmJlZ2luUGF0aCgpOwogIGNvbnRleHQubW92ZVRvKHggKyByYWRpdXMsIHkpOwogIGNvbnRleHQubGluZVRvKHggKyB3aWR0aCAtIHJhZGl1cywgeSk7CiAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTsKICBjb250ZXh0LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpOwogIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7CiAgY29udGV4dC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7CiAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpOwogIGNvbnRleHQubGluZVRvKHgsIHkgKyByYWRpdXMpOwogIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTsKICBjb250ZXh0LmNsb3NlUGF0aCgpOwp9CgpmdW5jdGlvbiBzeW5jQ29sbGVjdGlvbjxUIGV4dGVuZHMgeyBpZDogbnVtYmVyIH0+KAogIHBhcmVudDogVEhSRUUuR3JvdXAsCiAgbWFwOiBNYXA8bnVtYmVyLCBUSFJFRS5PYmplY3QzRD4sCiAgaXRlbXM6IFRbXSwKICBjcmVhdGU6IChpdGVtOiBUKSA9PiBUSFJFRS5PYmplY3QzRCwKICB1cGRhdGU6IChvYmplY3Q6IFRIUkVFLk9iamVjdDNELCBpdGVtOiBUKSA9PiB2b2lkCik6IHZvaWQgewogIGNvbnN0IGxpdmUgPSBuZXcgU2V0KGl0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5pZCkpOwogIGZvciAoY29uc3QgW2lkLCBvYmplY3RdIG9mIG1hcCkgewogICAgaWYgKCFsaXZlLmhhcyhpZCkpIHsKICAgICAgb2JqZWN0LnJlbW92ZUZyb21QYXJlbnQoKTsKICAgICAgbWFwLmRlbGV0ZShpZCk7CiAgICB9CiAgfQogIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHsKICAgIGxldCBvYmplY3QgPSBtYXAuZ2V0KGl0ZW0uaWQpOwogICAgaWYgKCFvYmplY3QpIHsKICAgICAgb2JqZWN0ID0gY3JlYXRlKGl0ZW0pOwogICAgICBtYXAuc2V0KGl0ZW0uaWQsIG9iamVjdCk7CiAgICAgIHBhcmVudC5hZGQob2JqZWN0KTsKICAgIH0KICAgIGlmICghb2JqZWN0LnBhcmVudCkgcGFyZW50LmFkZChvYmplY3QpOwogICAgdXBkYXRlKG9iamVjdCwgaXRlbSk7CiAgfSk7Cn0K", kC = "data:video/mp2t;base64,ZXhwb3J0IHR5cGUgUmFuZG9tRm4gPSAoKSA9PiBudW1iZXI7CgpleHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyh2YWx1ZTogc3RyaW5nKTogbnVtYmVyIHsKICBsZXQgaGFzaCA9IDIxNjYxMzYyNjE7CiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXggKz0gMSkgewogICAgaGFzaCBePSB2YWx1ZS5jaGFyQ29kZUF0KGluZGV4KTsKICAgIGhhc2ggPSBNYXRoLmltdWwoaGFzaCwgMTY3Nzc2MTkpOwogIH0KICByZXR1cm4gaGFzaCA+Pj4gMDsKfQoKZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlZWRlZFJhbmRvbShzZWVkOiBudW1iZXIpOiBSYW5kb21GbiB7CiAgbGV0IHN0YXRlID0gc2VlZCA+Pj4gMDsKICByZXR1cm4gKCkgPT4gewogICAgc3RhdGUgKz0gMHg2ZDJiNzlmNTsKICAgIGxldCBuZXh0ID0gc3RhdGU7CiAgICBuZXh0ID0gTWF0aC5pbXVsKG5leHQgXiAobmV4dCA+Pj4gMTUpLCBuZXh0IHwgMSk7CiAgICBuZXh0IF49IG5leHQgKyBNYXRoLmltdWwobmV4dCBeIChuZXh0ID4+PiA3KSwgbmV4dCB8IDYxKTsKICAgIHJldHVybiAoKG5leHQgXiAobmV4dCA+Pj4gMTQpKSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2OwogIH07Cn0KCmV4cG9ydCBmdW5jdGlvbiByYW5kb21SYW5nZShyYW5kb206IFJhbmRvbUZuLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIgewogIHJldHVybiBtaW4gKyAobWF4IC0gbWluKSAqIHJhbmRvbSgpOwp9CgpleHBvcnQgZnVuY3Rpb24gcGljazxUPihyYW5kb206IFJhbmRvbUZuLCBpdGVtczogVFtdKTogVCB7CiAgcmV0dXJuIGl0ZW1zW01hdGgubWF4KDAsIE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIE1hdGguZmxvb3IocmFuZG9tKCkgKiBpdGVtcy5sZW5ndGgpKSldOwp9Cg==", YC = "data:video/mp2t;base64,aW1wb3J0IHsgQ0hBTUJFUiwgQ09NTUFORFMsIExBQl9QUk9QUywgUEhBU0VTLCBTUEVDSUVTLCBVUEdSQURFUywgV09STERfWk9ORVMgfSBmcm9tICIuL2NvbnRlbnQiOwppbXBvcnQgeyBjcmVhdGVTZWVkZWRSYW5kb20sIGhhc2hTdHJpbmcsIHBpY2ssIHJhbmRvbVJhbmdlLCB0eXBlIFJhbmRvbUZuIH0gZnJvbSAiLi9ybmciOwppbXBvcnQgdHlwZSB7CiAgQ29sbGlzaW9uUHJveHksCiAgQ29tbWFuZElkLAogIEVmZmVjdEV2ZW50LAogIEdhbWVTdGF0ZSwKICBIYXphcmRFbnRpdHksCiAgSGF6YXJkS2luZCwKICBIdWRTbmFwc2hvdCwKICBJbnB1dFN0YXRlLAogIFBpY2t1cEVudGl0eSwKICBSdW5Nb2RlLAogIFJ1blJlcG9ydCwKICBTY29yZUVudHJ5LAogIFNwZWNpZXNJZCwKICBVcGdyYWRlSWQsCiAgV29ybGRab25lLAogIFdvcmxkWm9uZUlkCn0gZnJvbSAiLi90eXBlcyI7Cgpjb25zdCBCT0FSRF9QQVRURVJOID0gL14oY2xhc3NpY3xkYWlseS1cZHs0fS1cZHsyfS1cZHsyfSkkLzsKY29uc3QgVVBHUkFERV9JRFMgPSBPYmplY3Qua2V5cyhVUEdSQURFUykgYXMgVXBncmFkZUlkW107CmNvbnN0IExBQl9USU1FWk9ORSA9ICJBbWVyaWNhL05ld19Zb3JrIjsKY29uc3QgRklOQUxfUEhBU0VfSU5ERVggPSBQSEFTRVMubGVuZ3RoIC0gMTsKCmNvbnN0IFpPTkVTX0JZX0lEID0gT2JqZWN0LmZyb21FbnRyaWVzKFdPUkxEX1pPTkVTLm1hcCgoem9uZSkgPT4gW3pvbmUuaWQsIHpvbmVdKSkgYXMgUmVjb3JkPFdvcmxkWm9uZUlkLCBXb3JsZFpvbmU+Owpjb25zdCBQSUNLVVBfTEFCRUxTOiBSZWNvcmQ8UGlja3VwRW50aXR5WyJraW5kIl0sIHN0cmluZz4gPSB7CiAgcGlwZXR0ZVRpcDogInN0ZXJpbGUgdGlwIiwKICByZWFnZW50RHJvcGxldDogInJlYWdlbnQgZHJvcGxldCIsCiAgYWdhclBsdWc6ICJhZ2FyIHBsdWciLAogIG1lZGlhQmVhZDogIm1lZGlhIGJlYWQiCn07CmNvbnN0IFBJQ0tVUFNfQllfWk9ORTogUmVjb3JkPFdvcmxkWm9uZUlkLCBQaWNrdXBFbnRpdHlbImtpbmQiXVtdPiA9IHsKICBtaWNyb3Njb3BlU2xpZGU6IFsibWVkaWFCZWFkIiwgImFnYXJQbHVnIl0sCiAgcGlwZXR0ZVpvbmU6IFsicGlwZXR0ZVRpcCIsICJyZWFnZW50RHJvcGxldCJdLAogIHBldHJpRGlzaDogWyJhZ2FyUGx1ZyIsICJtZWRpYUJlYWQiXSwKICBmZXJuYmFjaEZsYXNrOiBbInJlYWdlbnREcm9wbGV0IiwgIm1lZGlhQmVhZCJdLAogIGNlbnRyaWZ1Z2U6IFsicGlwZXR0ZVRpcCIsICJtZWRpYUJlYWQiXSwKICB0dWJlUmFjazogWyJwaXBldHRlVGlwIiwgInJlYWdlbnREcm9wbGV0Il0KfTsKCmxldCBuZXh0SWQgPSAxOwoKZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlucHV0U3RhdGUoKTogSW5wdXRTdGF0ZSB7CiAgcmV0dXJuIHsgbW92ZVg6IDAsIG1vdmVaOiAwLCBkYXNoOiBmYWxzZSwgY29tbWFuZFdoZWVsOiBmYWxzZSB9Owp9CgpleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplU3BlY2llc0lkKHZhbHVlOiB1bmtub3duKTogU3BlY2llc0lkIHsKICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAic3RyaW5nIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoU1BFQ0lFUywgdmFsdWUpID8gKHZhbHVlIGFzIFNwZWNpZXNJZCkgOiAiZWNvbGkiOwp9CgpleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQm9hcmQodmFsdWU6IHVua25vd24pOiBzdHJpbmcgewogIGNvbnN0IGJvYXJkID0gU3RyaW5nKHZhbHVlIHx8ICIiKS50cmltKCkudG9Mb3dlckNhc2UoKTsKICByZXR1cm4gQk9BUkRfUEFUVEVSTi50ZXN0KGJvYXJkKSA/IGJvYXJkIDogImNsYXNzaWMiOwp9CgpleHBvcnQgZnVuY3Rpb24gY2xlYW5QbGF5ZXJOYW1lKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHsKICBjb25zdCBjbGVhbiA9IFN0cmluZyh2YWx1ZSB8fCAiIikKICAgIC5yZXBsYWNlKC9bXlx3IC4nLV0vZywgIiIpCiAgICAucmVwbGFjZSgvXHMrL2csICIgIikKICAgIC50cmltKCkKICAgIC5zbGljZSgwLCAyNCk7CiAgcmV0dXJuIGNsZWFuIHx8ICJBbm9ueW1vdXMiOwp9CgpleHBvcnQgY2xhc3MgVjNTaW11bGF0aW9uIHsKICByZWFkb25seSBzdGF0ZTogR2FtZVN0YXRlOwogIHByaXZhdGUgcmFuZG9tOiBSYW5kb21GbjsKCiAgY29uc3RydWN0b3IoKSB7CiAgICB0aGlzLnJhbmRvbSA9IGNyZWF0ZVNlZWRlZFJhbmRvbSgxKTsKICAgIHRoaXMuc3RhdGUgPSBjcmVhdGVJbml0aWFsU3RhdGUoKTsKICB9CgogIHN0YXJ0KG9wdGlvbnM6IHsgbW9kZT86IFJ1bk1vZGUgfCBzdHJpbmc7IHNwZWNpZXNJZD86IHN0cmluZzsgcGxheWVyTmFtZT86IHN0cmluZyB9ID0ge30pOiB2b2lkIHsKICAgIGNvbnN0IG1vZGU6IFJ1bk1vZGUgPSBvcHRpb25zLm1vZGUgPT09ICJkYWlseSIgPyAiZGFpbHkiIDogImNsYXNzaWMiOwogICAgY29uc3Qgc3BlY2llc0lkID0gbm9ybWFsaXplU3BlY2llc0lkKG9wdGlvbnMuc3BlY2llc0lkIHx8IHRoaXMuc3RhdGUuc2VsZWN0ZWRTcGVjaWVzSWQpOwogICAgY29uc3QgYm9hcmQgPSBtb2RlID09PSAiZGFpbHkiID8gZGFpbHlCb2FyZCgpIDogImNsYXNzaWMiOwogICAgY29uc3Qgc2VlZCA9IG1vZGUgPT09ICJkYWlseSIgPyBoYXNoU3RyaW5nKGBlbnZlbG9wZS12My1sYWItYmVuY2gtJHtib2FyZH0tJHtzcGVjaWVzSWR9YCkgOiBoYXNoU3RyaW5nKGBlbnZlbG9wZS12My1sYWItYmVuY2gtJHtzcGVjaWVzSWR9LSR7RGF0ZS5ub3coKX0tJHtNYXRoLnJhbmRvbSgpfWApOwogICAgdGhpcy5yYW5kb20gPSBjcmVhdGVTZWVkZWRSYW5kb20oc2VlZCk7CiAgICBjb25zdCBzcGVjaWVzID0gU1BFQ0lFU1tzcGVjaWVzSWRdOwogICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0YXRlLCBjcmVhdGVJbml0aWFsU3RhdGUoKSwgewogICAgICBzdGF0dXM6ICJicmllZmluZyIsCiAgICAgIHByZXZpb3VzU3RhdHVzOiAiYnJpZWZpbmciLAogICAgICBtb2RlLAogICAgICBib2FyZCwKICAgICAgc2VsZWN0ZWRTcGVjaWVzSWQ6IHNwZWNpZXNJZCwKICAgICAgc3BlY2llc0lkLAogICAgICBwbGF5ZXJOYW1lOiBjbGVhblBsYXllck5hbWUob3B0aW9ucy5wbGF5ZXJOYW1lKSwKICAgICAgc2VlZCwKICAgICAgaW50ZWdyaXR5OiBzcGVjaWVzLmludGVncml0eQogICAgfSk7CiAgICB0aGlzLnN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoInBoYXNlIiwgdGhpcy5zdGF0ZS5wbGF5ZXIueCwgdGhpcy5zdGF0ZS5wbGF5ZXIueiwgIkxhYiBiZW5jaCBvbmxpbmUiKSk7CiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMTA7IGluZGV4ICs9IDEpIHRoaXMuc3Bhd25QaWNrdXAocGljayh0aGlzLnJhbmRvbSwgWyJtaWNyb3Njb3BlU2xpZGUiLCAicGlwZXR0ZVpvbmUiLCAiZmVybmJhY2hGbGFzayJdIGFzIFdvcmxkWm9uZUlkW10pKTsKICB9CgogIGJlZ2luUnVuKCk6IHZvaWQgewogICAgaWYgKHRoaXMuc3RhdGUuc3RhdHVzID09PSAiYnJpZWZpbmciIHx8IHRoaXMuc3RhdGUuc3RhdHVzID09PSAibWVudSIpIHsKICAgICAgdGhpcy5zdGF0ZS5zdGF0dXMgPSAicnVubmluZyI7CiAgICAgIHRoaXMuc3RhdGUucHJldmlvdXNTdGF0dXMgPSAicnVubmluZyI7CiAgICB9CiAgfQoKICB0b2dnbGVQYXVzZSgpOiB2b2lkIHsKICAgIGlmICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gInJ1bm5pbmciIHx8IHRoaXMuc3RhdGUuc3RhdHVzID09PSAiY29tbWFuZCIpIHsKICAgICAgdGhpcy5zdGF0ZS5wcmV2aW91c1N0YXR1cyA9IHRoaXMuc3RhdGUuc3RhdHVzOwogICAgICB0aGlzLnN0YXRlLnN0YXR1cyA9ICJwYXVzZWQiOwogICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gInBhdXNlZCIpIHsKICAgICAgdGhpcy5zdGF0ZS5zdGF0dXMgPSB0aGlzLnN0YXRlLnByZXZpb3VzU3RhdHVzID09PSAiY29tbWFuZCIgPyAiY29tbWFuZCIgOiAicnVubmluZyI7CiAgICB9CiAgfQoKICBzZXRDb21tYW5kV2hlZWwob3BlbjogYm9vbGVhbik6IHZvaWQgewogICAgaWYgKG9wZW4gJiYgdGhpcy5zdGF0ZS5zdGF0dXMgPT09ICJydW5uaW5nIikgewogICAgICB0aGlzLnN0YXRlLnN0YXR1cyA9ICJjb21tYW5kIjsKICAgICAgcmV0dXJuOwogICAgfQogICAgaWYgKCFvcGVuICYmIHRoaXMuc3RhdGUuc3RhdHVzID09PSAiY29tbWFuZCIpIHsKICAgICAgdGhpcy5zdGF0ZS5zdGF0dXMgPSAicnVubmluZyI7CiAgICB9CiAgfQoKICBjaG9vc2VVcGdyYWRlKHVwZ3JhZGVJZDogVXBncmFkZUlkKTogdm9pZCB7CiAgICBpZiAodGhpcy5zdGF0ZS5zdGF0dXMgIT09ICJ1cGdyYWRlIiB8fCAhdGhpcy5zdGF0ZS51cGdyYWRlQ2hvaWNlcy5pbmNsdWRlcyh1cGdyYWRlSWQpKSByZXR1cm47CiAgICB0aGlzLnN0YXRlLnVwZ3JhZGVzLnB1c2godXBncmFkZUlkKTsKICAgIHRoaXMuc3RhdGUudXBncmFkZUNob2ljZXMgPSBbXTsKICAgIHRoaXMuc3RhdGUucGhhc2VQcm9ncmVzcyA9IDA7CiAgICB0aGlzLnN0YXRlLnBoYXNlVGltZSA9IDA7CiAgICB0aGlzLnN0YXRlLmFzc2VtYmx5ID0gMDsKICAgIHRoaXMuc3RhdGUuY2FycmllZFBpY2t1cCA9ICIiOwogICAgdGhpcy5zdGF0ZS5jb21ibyA9IDA7CiAgICB0aGlzLnN0YXRlLmpvYlN0YWdlID0gMDsKICAgIHRoaXMuc3RhdGUuam9iU3RlcCA9ICIiOwogICAgdGhpcy5zdGF0ZS5waGFzZUluZGV4ID0gTWF0aC5taW4odGhpcy5zdGF0ZS5waGFzZUluZGV4ICsgMSwgRklOQUxfUEhBU0VfSU5ERVgpOwogICAgdGhpcy5zdGF0ZS5zdGF0dXMgPSAicnVubmluZyI7CiAgICB0aGlzLnN0YXRlLnByZXZpb3VzU3RhdHVzID0gInJ1bm5pbmciOwogICAgdGhpcy5zdGF0ZS5lZmZlY3RzLnB1c2goZWZmZWN0KCJ1cGdyYWRlIiwgdGhpcy5zdGF0ZS5wbGF5ZXIueCwgdGhpcy5zdGF0ZS5wbGF5ZXIueiwgVVBHUkFERVNbdXBncmFkZUlkXS50aXRsZSkpOwogICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDQ7IGluZGV4ICs9IDEpIHRoaXMuc3Bhd25QaWNrdXAoUEhBU0VTW3RoaXMuc3RhdGUucGhhc2VJbmRleF0udGFyZ2V0Wm9uZSk7CiAgfQoKICB0cmlnZ2VyQ29tbWFuZChjb21tYW5kSWQ6IENvbW1hbmRJZCk6IGJvb2xlYW4gewogICAgaWYgKCh0aGlzLnN0YXRlLnN0YXR1cyAhPT0gInJ1bm5pbmciICYmIHRoaXMuc3RhdGUuc3RhdHVzICE9PSAiY29tbWFuZCIpIHx8IHRoaXMuc3RhdGUuY29tbWFuZENoYXJnZSA8IDEwMCkgcmV0dXJuIGZhbHNlOwogICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlOwogICAgY29uc3Qgc3BlY2llcyA9IFNQRUNJRVNbc3RhdGUuc3BlY2llc0lkXTsKICAgIHN0YXRlLmNvbW1hbmRDaGFyZ2UgPSAwOwogICAgc3RhdGUuc3RhdHVzID0gInJ1bm5pbmciOwogICAgc3RhdGUucHJldmlvdXNTdGF0dXMgPSAicnVubmluZyI7CiAgICBjb25zdCB1cGdyYWRlZCA9IChpZDogVXBncmFkZUlkKSA9PiBzdGF0ZS51cGdyYWRlcy5pbmNsdWRlcyhpZCk7CiAgICBsZXQgY2xlYXJlZCA9IDA7CiAgICBpZiAoY29tbWFuZElkID09PSAicGciKSB7CiAgICAgIGNvbnN0IGJvbnVzID0gdXBncmFkZWQoInBvbkEtb3ZlcmRyaXZlIikgPyAxLjQ1IDogMTsKICAgICAgc3RhdGUuYXNzZW1ibHkgKz0gdXBncmFkZWQoImxwb0ItdGV0aGVyIikgPyAyIDogMTsKICAgICAgc3RhdGUuaW50ZWdyaXR5ID0gY2xhbXAoc3RhdGUuaW50ZWdyaXR5ICsgMTUgKiBzcGVjaWVzLnJlcGFpckdhaW4gKiBib251cywgMCwgc3BlY2llcy5pbnRlZ3JpdHkgKyAxOCk7CiAgICAgIGNsZWFyZWQgPSBjbGVhckhhemFyZHMoc3RhdGUsIHN0YXRlLnBsYXllciwgOS41LCBbInNob2NrIl0pOwogICAgICBzdGF0ZS5zY29yZSArPSAyNjAgKyBjbGVhcmVkICogMTE1OwogICAgICBpZiAoUEhBU0VTW3N0YXRlLnBoYXNlSW5kZXhdLmlkID09PSAicmFja1NlYWwiKSB0aGlzLnNlYWxOZWFyYnlCcmVha3MoWyJydXB0dXJlIiwgImNyYWNrIl0sICJQRyBwYXRjaCIpOwogICAgICBpZiAoUEhBU0VTW3N0YXRlLnBoYXNlSW5kZXhdLmlkID09PSAibHlzaXNTdG9ybSIpIGFkdmFuY2VPYmplY3RpdmUoc3RhdGUsIDAuNCArIGNsZWFyZWQgKiAwLjIpOwogICAgfSBlbHNlIGlmIChjb21tYW5kSWQgPT09ICJtZW1icmFuZSIpIHsKICAgICAgc3RhdGUuaW50ZWdyaXR5ID0gY2xhbXAoc3RhdGUuaW50ZWdyaXR5ICsgMzAgKiBzcGVjaWVzLnJlcGFpckdhaW4sIDAsIHNwZWNpZXMuaW50ZWdyaXR5ICsgMjApOwogICAgICBjbGVhcmVkID0gY2xlYXJIYXphcmRzKHN0YXRlLCBzdGF0ZS5wbGF5ZXIsIHVwZ3JhZGVkKCJvbXAtYnVmZmVyIikgPyAxMiA6IDkuMiwgWyJydXB0dXJlIiwgImNyYWNrIiwgInNwaWxsIl0pOwogICAgICBzdGF0ZS5zY29yZSArPSAyNDAgKyBjbGVhcmVkICogMTAwOwogICAgICBpZiAoUEhBU0VTW3N0YXRlLnBoYXNlSW5kZXhdLmlkID09PSAiZmVybmJhY2hDdXJyZW50IiB8fCBQSEFTRVNbc3RhdGUucGhhc2VJbmRleF0uaWQgPT09ICJyYWNrU2VhbCIpIHRoaXMuc2VhbE5lYXJieUJyZWFrcyhbInJ1cHR1cmUiLCAiY3JhY2siLCAic3BpbGwiXSwgIm1lbWJyYW5lIHNlYWwiKTsKICAgICAgaWYgKFBIQVNFU1tzdGF0ZS5waGFzZUluZGV4XS5pZCA9PT0gImx5c2lzU3Rvcm0iKSBhZHZhbmNlT2JqZWN0aXZlKHN0YXRlLCAwLjUgKyBjbGVhcmVkICogMC4yNSk7CiAgICB9IGVsc2UgaWYgKGNvbW1hbmRJZCA9PT0gInBoYWdlIikgewogICAgICBjbGVhcmVkID0gY2xlYXJIYXphcmRzKHN0YXRlLCBzdGF0ZS5wbGF5ZXIsIHVwZ3JhZGVkKCJyZXN0cmljdGlvbi1idXJzdCIpID8gMTQuNSA6IDEwLjgsIFsicGhhZ2UiLCAicGxhcXVlIl0pOwogICAgICBzdGF0ZS5zY29yZSArPSAyMDAgKyBjbGVhcmVkICogMTYwOwogICAgICBpZiAoUEhBU0VTW3N0YXRlLnBoYXNlSW5kZXhdLmlkID09PSAicGV0cmlCbG9vbSIpIGFkdmFuY2VPYmplY3RpdmUoc3RhdGUsIE1hdGgubWF4KDEsIGNsZWFyZWQpICogMC44KTsKICAgICAgaWYgKFBIQVNFU1tzdGF0ZS5waGFzZUluZGV4XS5pZCA9PT0gImx5c2lzU3Rvcm0iKSBhZHZhbmNlT2JqZWN0aXZlKHN0YXRlLCBNYXRoLm1heCgwLjQsIGNsZWFyZWQgKiAwLjI1KSk7CiAgICB9IGVsc2UgewogICAgICBzdGF0ZS5wbGF5ZXIuZGFzaFRpbWVyID0gdXBncmFkZWQoImNoZW1vcmVmbGV4IikgPyAxLjQ1IDogMC45NTsKICAgICAgc3RhdGUucGxheWVyLmRhc2hDb29sZG93biA9IDA7CiAgICAgIHN0YXRlLnNjb3JlICs9IDI2MCArIChzdGF0ZS56b25lSWQgPT09ICJjZW50cmlmdWdlIiA/IDE2MCA6IDApOwogICAgICBpZiAoUEhBU0VTW3N0YXRlLnBoYXNlSW5kZXhdLmlkID09PSAiY2VudHJpZnVnZVN3ZWVwIiAmJiBzdGF0ZS56b25lSWQgPT09ICJjZW50cmlmdWdlIikgYWR2YW5jZU9iamVjdGl2ZShzdGF0ZSwgMC43NSk7CiAgICB9CiAgICBzdGF0ZS5lZmZlY3RzLnB1c2goZWZmZWN0KCJjb21tYW5kIiwgc3RhdGUucGxheWVyLngsIHN0YXRlLnBsYXllci56LCBDT01NQU5EU1tjb21tYW5kSWRdLnNob3J0TGFiZWwpKTsKICAgIHJldHVybiB0cnVlOwogIH0KCiAgdXBkYXRlKGlucHV0OiBJbnB1dFN0YXRlLCBkdDogbnVtYmVyKTogdm9pZCB7CiAgICBpZiAodGhpcy5zdGF0ZS5zdGF0dXMgIT09ICJydW5uaW5nIiAmJiB0aGlzLnN0YXRlLnN0YXR1cyAhPT0gImNvbW1hbmQiKSByZXR1cm47CiAgICBjb25zdCBzdGVwID0gTWF0aC5taW4oMC4wNSwgTWF0aC5tYXgoMCwgZHQpKSAqICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gImNvbW1hbmQiID8gMC4yMiA6IDEpOwogICAgdGhpcy5zdGF0ZS5lbGFwc2VkICs9IHN0ZXA7CiAgICB0aGlzLnN0YXRlLnBoYXNlVGltZSArPSBzdGVwOwogICAgdGhpcy5zdGF0ZS5zY29yZSArPSBzdGVwICogKDM2ICsgdGhpcy5zdGF0ZS5waGFzZUluZGV4ICogMTQpOwogICAgdGhpcy5zdGF0ZS5jb21tYW5kQ2hhcmdlID0gY2xhbXAodGhpcy5zdGF0ZS5jb21tYW5kQ2hhcmdlICsgc3RlcCAqIDYuOCAqIFNQRUNJRVNbdGhpcy5zdGF0ZS5zcGVjaWVzSWRdLmNvbW1hbmRHYWluICogdXBncmFkZUNvbW1hbmRHYWluKHRoaXMuc3RhdGUpLCAwLCAxMDApOwogICAgdGhpcy51cGRhdGVQbGF5ZXIoaW5wdXQsIHN0ZXApOwogICAgdGhpcy5zdGF0ZS56b25lSWQgPSB6b25lQXQodGhpcy5zdGF0ZS5wbGF5ZXIpIHx8IHRoaXMuc3RhdGUuem9uZUlkOwogICAgdGhpcy51cGRhdGVPYmplY3RpdmUoc3RlcCk7CiAgICB0aGlzLnVwZGF0ZVNwYXducyhzdGVwKTsKICAgIHRoaXMudXBkYXRlUGlja3VwcyhzdGVwKTsKICAgIHRoaXMudXBkYXRlSGF6YXJkcyhzdGVwKTsKICAgIHRoaXMudXBkYXRlRWZmZWN0cyhzdGVwKTsKICAgIGlmICh0aGlzLnN0YXRlLmludGVncml0eSA8PSAwKSB0aGlzLmVuZFJ1bigiZW52ZWxvcGUgbHlzaXMiKTsKICB9CgogIGh1ZCgpOiBIdWRTbmFwc2hvdCB7CiAgICBjb25zdCBwaGFzZSA9IFBIQVNFU1t0aGlzLnN0YXRlLnBoYXNlSW5kZXhdOwogICAgY29uc3Qgem9uZSA9IFpPTkVTX0JZX0lEW3RoaXMuc3RhdGUuem9uZUlkXTsKICAgIHJldHVybiB7CiAgICAgIHN0YXR1czogdGhpcy5zdGF0ZS5zdGF0dXMsCiAgICAgIHNjb3JlOiBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuc2NvcmUpKSwKICAgICAgdGltZUxhYmVsOiBmb3JtYXREdXJhdGlvbih0aGlzLnN0YXRlLmVsYXBzZWQpLAogICAgICBpbnRlZ3JpdHk6IE1hdGgubWF4KDAsIE1hdGgucm91bmQodGhpcy5zdGF0ZS5pbnRlZ3JpdHkpKSwKICAgICAgY29tbWFuZENoYXJnZTogTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmNvbW1hbmRDaGFyZ2UpLAogICAgICBwaGFzZVRpdGxlOiBwaGFzZS50aXRsZSwKICAgICAgcGhhc2VQcmVzc3VyZTogYCR7cGhhc2UucHJlc3N1cmV9IHwgJHt6b25lLnNob3J0TGFiZWx9YCwKICAgICAgem9uZUxhYmVsOiB6b25lLmxhYmVsLAogICAgICBvYmplY3RpdmU6IHBoYXNlLm9iamVjdGl2ZSwKICAgICAgb2JqZWN0aXZlUHJvZ3Jlc3M6IE1hdGgubWluKE1hdGguZmxvb3IodGhpcy5zdGF0ZS5waGFzZVByb2dyZXNzKSwgcGhhc2UudGFyZ2V0KSwKICAgICAgb2JqZWN0aXZlVGFyZ2V0OiBwaGFzZS50YXJnZXQsCiAgICAgIGJvYXJkOiB0aGlzLnN0YXRlLmJvYXJkLAogICAgICBzcGVjaWVzTGFiZWw6IFNQRUNJRVNbdGhpcy5zdGF0ZS5zcGVjaWVzSWRdLmxhYmVsLAogICAgICB1cGdyYWRlQ291bnQ6IHRoaXMuc3RhdGUudXBncmFkZXMubGVuZ3RoLAogICAgICBjYXJyaWVkTGFiZWw6IHRoaXMuc3RhdGUuY2FycmllZFBpY2t1cCA/IFBJQ0tVUF9MQUJFTFNbdGhpcy5zdGF0ZS5jYXJyaWVkUGlja3VwXSA6ICJlbXB0eSIsCiAgICAgIGNvbWJvTGFiZWw6IHRoaXMuc3RhdGUuY29tYm8gPiAxID8gYHgke3RoaXMuc3RhdGUuY29tYm99YCA6ICJyZWFkeSIsCiAgICAgIG5leHRIYXphcmRMYWJlbDogdGhpcy5zdGF0ZS5uZXh0SGF6YXJkTGFiZWwgfHwgIndhdGNoIHRlbGVncmFwaHMiLAogICAgICBqb2JTdGVwOiB0aGlzLnN0YXRlLmpvYlN0ZXAgfHwgc3RhdGlvblN0ZXAodGhpcy5zdGF0ZSkKICAgIH07CiAgfQoKICByZXBvcnQoKTogUnVuUmVwb3J0IHsKICAgIGNvbnN0IHBoYXNlID0gUEhBU0VTW3RoaXMuc3RhdGUucGhhc2VJbmRleF07CiAgICByZXR1cm4gewogICAgICBzY29yZTogTWF0aC5tYXgoMCwgTWF0aC5yb3VuZCh0aGlzLnN0YXRlLnNjb3JlKSksCiAgICAgIHNwZWNpZXNJZDogdGhpcy5zdGF0ZS5zcGVjaWVzSWQsCiAgICAgIHNwZWNpZXNMYWJlbDogU1BFQ0lFU1t0aGlzLnN0YXRlLnNwZWNpZXNJZF0ubGFiZWwsCiAgICAgIGJvYXJkOiB0aGlzLnN0YXRlLmJvYXJkLAogICAgICBzdXJ2aXZlZDogZm9ybWF0RHVyYXRpb24odGhpcy5zdGF0ZS5lbGFwc2VkKSwKICAgICAgcGhhc2VSZWFjaGVkOiBwaGFzZS50aXRsZSwKICAgICAgbHlzaXNDYXVzZTogdGhpcy5zdGF0ZS5seXNpc0NhdXNlIHx8ICJjdW11bGF0aXZlIGxhYi1iZW5jaCBzdHJlc3MiLAogICAgICB1cGdyYWRlczogdGhpcy5zdGF0ZS51cGdyYWRlcy5tYXAoKGlkKSA9PiBVUEdSQURFU1tpZF0udGl0bGUpLAogICAgICBjb21wbGV0ZWRBdDogRGF0ZS5ub3coKQogICAgfTsKICB9CgogIHNjb3JlRW50cnkobmFtZU92ZXJyaWRlPzogc3RyaW5nKTogU2NvcmVFbnRyeSB7CiAgICByZXR1cm4gewogICAgICBuYW1lOiBjbGVhblBsYXllck5hbWUobmFtZU92ZXJyaWRlIHx8IHRoaXMuc3RhdGUucGxheWVyTmFtZSksCiAgICAgIHNjb3JlOiBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuc2NvcmUpKSwKICAgICAgc3BlY2llczogdGhpcy5zdGF0ZS5zcGVjaWVzSWQsCiAgICAgIHBsYXllZEF0OiBEYXRlLm5vdygpLAogICAgICBib2FyZDogbm9ybWFsaXplQm9hcmQodGhpcy5zdGF0ZS5ib2FyZCkKICAgIH07CiAgfQoKICBwcml2YXRlIHVwZGF0ZVBsYXllcihpbnB1dDogSW5wdXRTdGF0ZSwgZHQ6IG51bWJlcik6IHZvaWQgewogICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlOwogICAgY29uc3Qgc3BlY2llcyA9IFNQRUNJRVNbc3RhdGUuc3BlY2llc0lkXTsKICAgIGNvbnN0IGxlbiA9IE1hdGguaHlwb3QoaW5wdXQubW92ZVgsIGlucHV0Lm1vdmVaKSB8fCAxOwogICAgY29uc3QgbW92ZVggPSBpbnB1dC5tb3ZlWCAvIGxlbjsKICAgIGNvbnN0IG1vdmVaID0gaW5wdXQubW92ZVogLyBsZW47CiAgICBzdGF0ZS5wbGF5ZXIuZGFzaENvb2xkb3duID0gTWF0aC5tYXgoMCwgc3RhdGUucGxheWVyLmRhc2hDb29sZG93biAtIGR0ICogKHN0YXRlLnVwZ3JhZGVzLmluY2x1ZGVzKCJjaGVtb3JlZmxleCIpID8gMS40NSA6IDEpKTsKICAgIHN0YXRlLnBsYXllci5kYXNoVGltZXIgPSBNYXRoLm1heCgwLCBzdGF0ZS5wbGF5ZXIuZGFzaFRpbWVyIC0gZHQpOwogICAgY29uc3Qgc3BlZWQgPSBzdGF0ZS5wbGF5ZXIuZGFzaFRpbWVyID4gMCA/IHNwZWNpZXMuZGFzaFNwZWVkIDogc3BlY2llcy5zcGVlZDsKICAgIGlmIChpbnB1dC5kYXNoICYmIHN0YXRlLnBsYXllci5kYXNoQ29vbGRvd24gPD0gMCAmJiAoTWF0aC5hYnMoaW5wdXQubW92ZVgpICsgTWF0aC5hYnMoaW5wdXQubW92ZVopID4gMC4xKSkgewogICAgICBzdGF0ZS5wbGF5ZXIuZGFzaFRpbWVyID0gMC4yNDsKICAgICAgc3RhdGUucGxheWVyLmRhc2hDb29sZG93biA9IDEuMTU7CiAgICAgIHN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoImRhc2giLCBzdGF0ZS5wbGF5ZXIueCwgc3RhdGUucGxheWVyLnosICJEYXNoIikpOwogICAgfQogICAgc3RhdGUucGxheWVyLnZ4ID0gbGVycChzdGF0ZS5wbGF5ZXIudngsIG1vdmVYICogc3BlZWQsIDEgLSBNYXRoLnBvdygwLjAwMSwgZHQpKTsKICAgIHN0YXRlLnBsYXllci52eiA9IGxlcnAoc3RhdGUucGxheWVyLnZ6LCBtb3ZlWiAqIHNwZWVkLCAxIC0gTWF0aC5wb3coMC4wMDEsIGR0KSk7CiAgICBzdGF0ZS5wbGF5ZXIueCA9IGNsYW1wKHN0YXRlLnBsYXllci54ICsgc3RhdGUucGxheWVyLnZ4ICogZHQsIC1DSEFNQkVSLndpZHRoIC8gMiArIENIQU1CRVIuc2FmZU1hcmdpbiwgQ0hBTUJFUi53aWR0aCAvIDIgLSBDSEFNQkVSLnNhZmVNYXJnaW4pOwogICAgc3RhdGUucGxheWVyLnogPSBjbGFtcChzdGF0ZS5wbGF5ZXIueiArIHN0YXRlLnBsYXllci52eiAqIGR0LCAtQ0hBTUJFUi5kZXB0aCAvIDIgKyBDSEFNQkVSLnNhZmVNYXJnaW4sIENIQU1CRVIuZGVwdGggLyAyIC0gQ0hBTUJFUi5zYWZlTWFyZ2luKTsKICAgIHJlc29sdmVTdGF0aWNDb2xsaXNpb25zKHN0YXRlKTsKICB9CgogIHByaXZhdGUgdXBkYXRlT2JqZWN0aXZlKGR0OiBudW1iZXIpOiB2b2lkIHsKICAgIGNvbnN0IHBoYXNlID0gUEhBU0VTW3RoaXMuc3RhdGUucGhhc2VJbmRleF07CiAgICB0aGlzLnN0YXRlLmpvYlN0ZXAgPSBzdGF0aW9uU3RlcCh0aGlzLnN0YXRlKTsKICAgIHRoaXMudHJ5RGVwb3NpdENhcnJpZWRSZXNvdXJjZSgpOwogICAgaWYgKHBoYXNlLmlkID09PSAicGV0cmlCbG9vbSIpIHRoaXMudGFnTmVhcmJ5UGxhcXVlcygpOwogICAgaWYgKHBoYXNlLmlkID09PSAiY2VudHJpZnVnZVN3ZWVwIikgdGhpcy51cGRhdGVSb3RvckNyb3NzaW5nKCk7CiAgICBpZiAocGhhc2UuaWQgPT09ICJseXNpc1N0b3JtIikgdGhpcy5zdGF0ZS5zY29yZSArPSBkdCAqICg4ICsgdGhpcy5zdGF0ZS5jb21ibyAqIDIpOwogICAgaWYgKHRoaXMuc3RhdGUucGhhc2VJbmRleCA9PT0gRklOQUxfUEhBU0VfSU5ERVggJiYgdGhpcy5zdGF0ZS5waGFzZVByb2dyZXNzID49IHBoYXNlLnRhcmdldCkgewogICAgICB0aGlzLnN0YXRlLnNjb3JlICs9IDcwMDsKICAgICAgdGhpcy5zdGF0ZS5waGFzZVByb2dyZXNzID0gcGhhc2UudGFyZ2V0ICogMC41NTsKICAgICAgdGhpcy5zdGF0ZS5lZmZlY3RzLnB1c2goZWZmZWN0KCJwaGFzZSIsIHRoaXMuc3RhdGUucGxheWVyLngsIHRoaXMuc3RhdGUucGxheWVyLnosICJTdG9ybSBoZWxkIikpOwogICAgfQogIH0KCiAgcHJpdmF0ZSB1cGRhdGVTcGF3bnMoZHQ6IG51bWJlcik6IHZvaWQgewogICAgY29uc3QgcGhhc2UgPSBQSEFTRVNbdGhpcy5zdGF0ZS5waGFzZUluZGV4XTsKICAgIGNvbnN0IHByZXNzdXJlID0gMSArIHRoaXMuc3RhdGUucGhhc2VJbmRleCAqIDAuMjIgKyBNYXRoLm1pbigwLjQ1LCB0aGlzLnN0YXRlLnBoYXNlVGltZSAvIDE2MCk7CiAgICB0aGlzLnRpY2tUaW1lcigicGlja3VwIiwgZHQsIE1hdGgubWF4KDAuNjUsIDEuOSAtIHRoaXMuc3RhdGUucGhhc2VJbmRleCAqIDAuMSksICgpID0+IHRoaXMuc3Bhd25QaWNrdXAodGhpcy5yYW5kb20oKSA+IDAuNjUgPyB0aGlzLnN0YXRlLnpvbmVJZCA6IHBoYXNlLnRhcmdldFpvbmUpKTsKICAgIGlmIChwaGFzZS5pZCA9PT0gInNsaWRlVHJhaW5pbmciKSB7CiAgICAgIHRoaXMuc3RhdGUubmV4dEhhemFyZExhYmVsID0gImxpZ2h0IHNsaWRlIHB1bHNlcyI7CiAgICAgIHRoaXMudGlja1RpbWVyKCJkcm9wbGV0IiwgZHQsIDMuMSwgKCkgPT4gdGhpcy5zcGF3bkhhemFyZCgiZHJvcGxldCIsICJtaWNyb3Njb3BlU2xpZGUiKSk7CiAgICB9IGVsc2UgaWYgKHBoYXNlLmlkID09PSAicGlwZXR0ZVB1bHNlIikgewogICAgICB0aGlzLnN0YXRlLm5leHRIYXphcmRMYWJlbCA9ICJkcm9wbGV0IGxhbmUgaW5jb21pbmciOwogICAgICB0aGlzLnRpY2tUaW1lcigiZHJvcGxldCIsIGR0LCBNYXRoLm1heCgwLjc0LCAxLjkgLyBwcmVzc3VyZSksICgpID0+IHRoaXMuc3Bhd25IYXphcmQocGljayh0aGlzLnJhbmRvbSwgWyJkcm9wbGV0IiwgInNob2NrIl0gYXMgSGF6YXJkS2luZFtdKSwgInBpcGV0dGVab25lIikpOwogICAgfSBlbHNlIGlmIChwaGFzZS5pZCA9PT0gInBldHJpQmxvb20iKSB7CiAgICAgIHRoaXMuc3RhdGUubmV4dEhhemFyZExhYmVsID0gInBsYXF1ZSBzZWFtIGV4cGFuZGluZyI7CiAgICAgIHRoaXMudGlja1RpbWVyKCJwaGFnZSIsIGR0LCBNYXRoLm1heCgwLjg1LCAyLjAgLyBwcmVzc3VyZSksICgpID0+IHRoaXMuc3Bhd25IYXphcmQocGljayh0aGlzLnJhbmRvbSwgWyJwaGFnZSIsICJwbGFxdWUiXSBhcyBIYXphcmRLaW5kW10pLCAicGV0cmlEaXNoIikpOwogICAgfSBlbHNlIGlmIChwaGFzZS5pZCA9PT0gImZlcm5iYWNoQ3VycmVudCIpIHsKICAgICAgdGhpcy5zdGF0ZS5uZXh0SGF6YXJkTGFiZWwgPSAibWVkaWEgY3VycmVudCBzd2VsbGluZyI7CiAgICAgIHRoaXMudGlja1RpbWVyKCJzcGlsbCIsIGR0LCBNYXRoLm1heCgxLjE1LCAyLjggLyBwcmVzc3VyZSksICgpID0+IHRoaXMuc3Bhd25IYXphcmQocGljayh0aGlzLnJhbmRvbSwgWyJzcGlsbCIsICJkcm9wbGV0IiwgInJ1cHR1cmUiXSBhcyBIYXphcmRLaW5kW10pLCAiZmVybmJhY2hGbGFzayIpKTsKICAgIH0gZWxzZSBpZiAocGhhc2UuaWQgPT09ICJjZW50cmlmdWdlU3dlZXAiKSB7CiAgICAgIHRoaXMuc3RhdGUubmV4dEhhemFyZExhYmVsID0gInJvdG9yIHN3ZWVwIHdpbmRvdyI7CiAgICAgIHRoaXMudGlja1RpbWVyKCJyb3RvciIsIGR0LCBNYXRoLm1heCgwLjksIDIuNSAvIHByZXNzdXJlKSwgKCkgPT4gdGhpcy5zcGF3bkhhemFyZCgicm90b3IiLCAiY2VudHJpZnVnZSIpKTsKICAgICAgdGhpcy50aWNrVGltZXIoInNob2NrIiwgZHQsIE1hdGgubWF4KDEuMywgMy40IC8gcHJlc3N1cmUpLCAoKSA9PiB0aGlzLnNwYXduSGF6YXJkKCJzaG9jayIsICJjZW50cmlmdWdlIikpOwogICAgfSBlbHNlIGlmIChwaGFzZS5pZCA9PT0gInJhY2tTZWFsIikgewogICAgICB0aGlzLnN0YXRlLm5leHRIYXphcmRMYWJlbCA9ICJydXB0dXJlIHNpdGUgZ3Jvd2luZyI7CiAgICAgIHRoaXMudGlja1RpbWVyKCJjcmFjayIsIGR0LCBNYXRoLm1heCgwLjkyLCAyLjcgLyBwcmVzc3VyZSksICgpID0+IHRoaXMuc3Bhd25IYXphcmQocGljayh0aGlzLnJhbmRvbSwgWyJjcmFjayIsICJydXB0dXJlIiwgInNwaWxsIl0gYXMgSGF6YXJkS2luZFtdKSwgInR1YmVSYWNrIikpOwogICAgfSBlbHNlIHsKICAgICAgdGhpcy5zdGF0ZS5uZXh0SGF6YXJkTGFiZWwgPSAiZnVsbCBiZW5jaCBjb2xsYXBzZSI7CiAgICAgIHRoaXMudGlja1RpbWVyKCJwaGFnZSIsIGR0LCBNYXRoLm1heCgwLjcsIDIuMCAvIHByZXNzdXJlKSwgKCkgPT4gdGhpcy5zcGF3bkhhemFyZChwaWNrKHRoaXMucmFuZG9tLCBbInBoYWdlIiwgInBsYXF1ZSIsICJzaG9jayJdIGFzIEhhemFyZEtpbmRbXSksIHBpY2sodGhpcy5yYW5kb20sIFdPUkxEX1pPTkVTKS5pZCkpOwogICAgICB0aGlzLnRpY2tUaW1lcigicnVwdHVyZSIsIGR0LCBNYXRoLm1heCgwLjg1LCAyLjUgLyBwcmVzc3VyZSksICgpID0+IHRoaXMuc3Bhd25IYXphcmQocGljayh0aGlzLnJhbmRvbSwgWyJydXB0dXJlIiwgInNob2NrIiwgInBoYWdlIiwgInNwaWxsIiwgInJvdG9yIl0gYXMgSGF6YXJkS2luZFtdKSwgcGljayh0aGlzLnJhbmRvbSwgV09STERfWk9ORVMpLmlkKSk7CiAgICB9CiAgICB0aGlzLnRpY2tUaW1lcigiYm9zcyIsIGR0LCBNYXRoLm1heCgxMCwgMjIgLSB0aGlzLnN0YXRlLnBoYXNlSW5kZXggKiAxLjgpLCAoKSA9PiB7CiAgICAgIHRoaXMuc3RhdGUuZWZmZWN0cy5wdXNoKGVmZmVjdCgicGhhc2UiLCB0aGlzLnN0YXRlLnBsYXllci54LCB0aGlzLnN0YXRlLnBsYXllci56LCBwaGFzZS5ib3NzKSk7CiAgICAgIGNvbnN0IGJvc3NIYXphcmRzID0gdGhpcy5waGFzZUhhemFyZHMoKTsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyICsgdGhpcy5zdGF0ZS5waGFzZUluZGV4OyBpICs9IDEpIHRoaXMuc3Bhd25IYXphcmQocGljayh0aGlzLnJhbmRvbSwgYm9zc0hhemFyZHMpLCBwaGFzZS50YXJnZXRab25lKTsKICAgIH0pOwogIH0KCiAgcHJpdmF0ZSBwaGFzZUhhemFyZHMoKTogSGF6YXJkS2luZFtdIHsKICAgIGNvbnN0IHBoYXNlSWQgPSBQSEFTRVNbdGhpcy5zdGF0ZS5waGFzZUluZGV4XS5pZDsKICAgIGlmIChwaGFzZUlkID09PSAic2xpZGVUcmFpbmluZyIpIHJldHVybiBbInBoYWdlIiwgImRyb3BsZXQiXTsKICAgIGlmIChwaGFzZUlkID09PSAicGlwZXR0ZVB1bHNlIikgcmV0dXJuIFsiZHJvcGxldCIsICJzaG9jayJdOwogICAgaWYgKHBoYXNlSWQgPT09ICJwZXRyaUJsb29tIikgcmV0dXJuIFsicGhhZ2UiLCAicGxhcXVlIl07CiAgICBpZiAocGhhc2VJZCA9PT0gImZlcm5iYWNoQ3VycmVudCIpIHJldHVybiBbInNwaWxsIiwgImRyb3BsZXQiLCAicnVwdHVyZSJdOwogICAgaWYgKHBoYXNlSWQgPT09ICJjZW50cmlmdWdlU3dlZXAiKSByZXR1cm4gWyJyb3RvciIsICJzaG9jayJdOwogICAgaWYgKHBoYXNlSWQgPT09ICJyYWNrU2VhbCIpIHJldHVybiBbImNyYWNrIiwgInJ1cHR1cmUiLCAic3BpbGwiXTsKICAgIHJldHVybiBbInBoYWdlIiwgInNob2NrIiwgInJ1cHR1cmUiLCAicGxhcXVlIiwgInNwaWxsIl07CiAgfQoKICBwcml2YXRlIHRpY2tUaW1lcihrZXk6IGtleW9mIEdhbWVTdGF0ZVsidGltZXJzIl0sIGR0OiBudW1iZXIsIHJlc2V0OiBudW1iZXIsIGFjdGlvbjogKCkgPT4gdm9pZCk6IHZvaWQgewogICAgdGhpcy5zdGF0ZS50aW1lcnNba2V5XSAtPSBkdDsKICAgIGlmICh0aGlzLnN0YXRlLnRpbWVyc1trZXldIDw9IDApIHsKICAgICAgdGhpcy5zdGF0ZS50aW1lcnNba2V5XSA9IHJlc2V0ICogcmFuZG9tUmFuZ2UodGhpcy5yYW5kb20sIDAuNzIsIDEuMTgpOwogICAgICBhY3Rpb24oKTsKICAgIH0KICB9CgogIHByaXZhdGUgc3Bhd25QaWNrdXAoem9uZUlkOiBXb3JsZFpvbmVJZCA9IFBIQVNFU1t0aGlzLnN0YXRlLnBoYXNlSW5kZXhdLnRhcmdldFpvbmUpOiB2b2lkIHsKICAgIGNvbnN0IHpvbmUgPSBaT05FU19CWV9JRFt6b25lSWRdOwogICAgY29uc3Qga2luZHMgPSBQSUNLVVBTX0JZX1pPTkVbem9uZUlkXTsKICAgIGNvbnN0IHNwYXduID0gdGhpcy5yYW5kb21PcGVuUG9pbnQoem9uZSk7CiAgICB0aGlzLnN0YXRlLnBpY2t1cHMucHVzaCh7CiAgICAgIGlkOiBuZXh0SWQrKywKICAgICAga2luZDogcGljayh0aGlzLnJhbmRvbSwga2luZHMpLAogICAgICB4OiBzcGF3bi54LAogICAgICB6OiBzcGF3bi56LAogICAgICByYWRpdXM6IDAuNzIsCiAgICAgIGFnZTogMAogICAgfSk7CiAgfQoKICBwcml2YXRlIHJhbmRvbU9wZW5Qb2ludCh6b25lOiBXb3JsZFpvbmUpOiB7IHg6IG51bWJlcjsgejogbnVtYmVyIH0gewogICAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCAyNDsgYXR0ZW1wdCArPSAxKSB7CiAgICAgIGNvbnN0IHBvaW50ID0gewogICAgICAgIHg6IHJhbmRvbVJhbmdlKHRoaXMucmFuZG9tLCB6b25lLmJvdW5kcy54IC0gem9uZS5ib3VuZHMud2lkdGggLyAyICsgMywgem9uZS5ib3VuZHMueCArIHpvbmUuYm91bmRzLndpZHRoIC8gMiAtIDMpLAogICAgICAgIHo6IHJhbmRvbVJhbmdlKHRoaXMucmFuZG9tLCB6b25lLmJvdW5kcy56IC0gem9uZS5ib3VuZHMuZGVwdGggLyAyICsgMywgem9uZS5ib3VuZHMueiArIHpvbmUuYm91bmRzLmRlcHRoIC8gMiAtIDMpCiAgICAgIH07CiAgICAgIGlmICghaGl0c1N0YXRpY1Byb3h5KHBvaW50LCAxLjQpKSByZXR1cm4gcG9pbnQ7CiAgICB9CiAgICByZXR1cm4geyB4OiB6b25lLmJvdW5kcy54LCB6OiB6b25lLmJvdW5kcy56IH07CiAgfQoKICBwcml2YXRlIHNwYXduSGF6YXJkKGtpbmQ6IEhhemFyZEtpbmQsIHpvbmVJZDogV29ybGRab25lSWQgPSBQSEFTRVNbdGhpcy5zdGF0ZS5waGFzZUluZGV4XS50YXJnZXRab25lKTogdm9pZCB7CiAgICBjb25zdCB6b25lID0gWk9ORVNfQllfSURbem9uZUlkXTsKICAgIGNvbnN0IHBvaW50ID0gdGhpcy5yYW5kb21PcGVuUG9pbnQoem9uZSk7CiAgICBsZXQgeCA9IHBvaW50Lng7CiAgICBsZXQgeiA9IHBvaW50Lno7CiAgICBsZXQgdnggPSAwOwogICAgbGV0IHZ6ID0gMDsKICAgIGxldCByYWRpdXMgPSAxLjE7CiAgICBsZXQgd2lkdGggPSAxLjI7CiAgICBsZXQgYW5nbGUgPSByYW5kb21SYW5nZSh0aGlzLnJhbmRvbSwgLU1hdGguUEksIE1hdGguUEkpOwogICAgbGV0IHRlbGVncmFwaCA9IDE7CiAgICBsZXQgZHVyYXRpb24gPSA2OwogICAgbGV0IGRhbWFnZSA9IDEyOwogICAgbGV0IGFuZ3VsYXJTcGVlZDogbnVtYmVyIHwgdW5kZWZpbmVkOwoKICAgIGlmIChraW5kID09PSAicGhhZ2UiIHx8IGtpbmQgPT09ICJkcm9wbGV0IikgewogICAgICBjb25zdCBmcm9tSG9yaXpvbnRhbEVkZ2UgPSB0aGlzLnJhbmRvbSgpID4gMC41OwogICAgICBjb25zdCBzaWRlID0gdGhpcy5yYW5kb20oKSA+IDAuNSA/IDEgOiAtMTsKICAgICAgeCA9IGZyb21Ib3Jpem9udGFsRWRnZSA/IHpvbmUuYm91bmRzLnggKyBzaWRlICogem9uZS5ib3VuZHMud2lkdGggKiAwLjU4IDogcmFuZG9tUmFuZ2UodGhpcy5yYW5kb20sIHpvbmUuYm91bmRzLnggLSB6b25lLmJvdW5kcy53aWR0aCAvIDIsIHpvbmUuYm91bmRzLnggKyB6b25lLmJvdW5kcy53aWR0aCAvIDIpOwogICAgICB6ID0gZnJvbUhvcml6b250YWxFZGdlID8gcmFuZG9tUmFuZ2UodGhpcy5yYW5kb20sIHpvbmUuYm91bmRzLnogLSB6b25lLmJvdW5kcy5kZXB0aCAvIDIsIHpvbmUuYm91bmRzLnogKyB6b25lLmJvdW5kcy5kZXB0aCAvIDIpIDogem9uZS5ib3VuZHMueiArIHNpZGUgKiB6b25lLmJvdW5kcy5kZXB0aCAqIDAuNTg7CiAgICAgIGNvbnN0IHRvUGxheWVyWCA9IHRoaXMuc3RhdGUucGxheWVyLnggLSB4OwogICAgICBjb25zdCB0b1BsYXllclogPSB0aGlzLnN0YXRlLnBsYXllci56IC0gejsKICAgICAgY29uc3QgbGVuID0gTWF0aC5oeXBvdCh0b1BsYXllclgsIHRvUGxheWVyWikgfHwgMTsKICAgICAgY29uc3QgYmFzZSA9IGtpbmQgPT09ICJwaGFnZSIgPyA2LjEgOiA0Ljg7CiAgICAgIHZ4ID0gKHRvUGxheWVyWCAvIGxlbikgKiBiYXNlOwogICAgICB2eiA9ICh0b1BsYXllclogLyBsZW4pICogYmFzZTsKICAgICAgcmFkaXVzID0ga2luZCA9PT0gInBoYWdlIiA/IDAuNyA6IDAuOTU7CiAgICAgIHRlbGVncmFwaCA9IGtpbmQgPT09ICJwaGFnZSIgPyAwLjYyIDogMC45NTsKICAgICAgZHVyYXRpb24gPSA2LjY7CiAgICAgIGRhbWFnZSA9IGtpbmQgPT09ICJwaGFnZSIgPyAxMiA6IDE1OwogICAgICBhbmdsZSA9IE1hdGguYXRhbjIodnosIHZ4KTsKICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gInNob2NrIikgewogICAgICB3aWR0aCA9IDEuMzU7CiAgICAgIHJhZGl1cyA9IDE0OwogICAgICB0ZWxlZ3JhcGggPSAxLjE1OwogICAgICBkdXJhdGlvbiA9IDYuMzsKICAgICAgZGFtYWdlID0gMTg7CiAgICAgIGNvbnN0IG1vdmVBbmdsZSA9IGFuZ2xlICsgTWF0aC5QSSAvIDI7CiAgICAgIHZ4ID0gTWF0aC5jb3MobW92ZUFuZ2xlKSAqIDEuNTsKICAgICAgdnogPSBNYXRoLnNpbihtb3ZlQW5nbGUpICogMS41OwogICAgfSBlbHNlIGlmIChraW5kID09PSAicm90b3IiKSB7CiAgICAgIGNvbnN0IHJvdG9yID0gTEFCX1BST1BTLmZpbmQoKHByb3ApID0+IHByb3AuaWQgPT09ICJiZW5jaC1jZW50cmlmdWdlIik7CiAgICAgIHggPSByb3Rvcj8ueCA/PyB6b25lLmJvdW5kcy54OwogICAgICB6ID0gcm90b3I/LnogPz8gem9uZS5ib3VuZHMuejsKICAgICAgcmFkaXVzID0gMTMuMjsKICAgICAgd2lkdGggPSAxLjQ7CiAgICAgIHRlbGVncmFwaCA9IDAuODsKICAgICAgZHVyYXRpb24gPSA1LjQ7CiAgICAgIGRhbWFnZSA9IDE5OwogICAgICBhbmd1bGFyU3BlZWQgPSAodGhpcy5yYW5kb20oKSA+IDAuNSA/IDEgOiAtMSkgKiByYW5kb21SYW5nZSh0aGlzLnJhbmRvbSwgMS44LCAyLjgpOwogICAgfSBlbHNlIGlmIChraW5kID09PSAiY3JhY2siKSB7CiAgICAgIHdpZHRoID0gcmFuZG9tUmFuZ2UodGhpcy5yYW5kb20sIDksIDE2KTsKICAgICAgcmFkaXVzID0gODsKICAgICAgdGVsZWdyYXBoID0gMS4yNTsKICAgICAgZHVyYXRpb24gPSA3OwogICAgICBkYW1hZ2UgPSAxNjsKICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gInJ1cHR1cmUiIHx8IGtpbmQgPT09ICJwbGFxdWUiIHx8IGtpbmQgPT09ICJzcGlsbCIpIHsKICAgICAgcmFkaXVzID0ga2luZCA9PT0gInBsYXF1ZSIgPyAxLjkgOiBraW5kID09PSAic3BpbGwiID8gMi4yIDogMS41OwogICAgICB3aWR0aCA9IHJhZGl1cyAqIDI7CiAgICAgIHRlbGVncmFwaCA9IGtpbmQgPT09ICJzcGlsbCIgPyAwLjc1IDogMS4xNTsKICAgICAgZHVyYXRpb24gPSBraW5kID09PSAic3BpbGwiID8gOSA6IDg7CiAgICAgIGRhbWFnZSA9IGtpbmQgPT09ICJwbGFxdWUiID8gMTQgOiBraW5kID09PSAic3BpbGwiID8gMTMgOiAyMTsKICAgIH0KCiAgICB0aGlzLnN0YXRlLmhhemFyZHMucHVzaCh7IGlkOiBuZXh0SWQrKywga2luZCwgem9uZUlkLCB4LCB6LCB2eCwgdnosIHJhZGl1cywgd2lkdGgsIGFuZ2xlLCBhZ2U6IDAsIHRlbGVncmFwaCwgZHVyYXRpb24sIGRhbWFnZSwgYW5ndWxhclNwZWVkIH0pOwogIH0KCiAgcHJpdmF0ZSB1cGRhdGVQaWNrdXBzKGR0OiBudW1iZXIpOiB2b2lkIHsKICAgIGNvbnN0IG1hZ25ldCA9IHRoaXMuc3RhdGUuc3BlY2llc0lkID09PSAia3BuZXVtb25pYWUiIHx8IHRoaXMuc3RhdGUudXBncmFkZXMuaW5jbHVkZXMoImJhY3RvcHJlbm9sLWZsb3ciKSA/IDYuOCA6IDMuMjsKICAgIHRoaXMuc3RhdGUucGlja3VwcyA9IHRoaXMuc3RhdGUucGlja3Vwcy5maWx0ZXIoKHBpY2t1cCkgPT4gewogICAgICBwaWNrdXAuYWdlICs9IGR0OwogICAgICBjb25zdCBkeCA9IHRoaXMuc3RhdGUucGxheWVyLnggLSBwaWNrdXAueDsKICAgICAgY29uc3QgZHogPSB0aGlzLnN0YXRlLnBsYXllci56IC0gcGlja3VwLno7CiAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5oeXBvdChkeCwgZHopOwogICAgICBpZiAoZGlzdGFuY2UgPCBtYWduZXQpIHsKICAgICAgICBwaWNrdXAueCArPSAoZHggLyBNYXRoLm1heCgwLjAxLCBkaXN0YW5jZSkpICogZHQgKiA0LjI7CiAgICAgICAgcGlja3VwLnogKz0gKGR6IC8gTWF0aC5tYXgoMC4wMSwgZGlzdGFuY2UpKSAqIGR0ICogNC4yOwogICAgICB9CiAgICAgIGlmIChkaXN0YW5jZSA8IHBpY2t1cC5yYWRpdXMgKyB0aGlzLnN0YXRlLnBsYXllci5yYWRpdXMpIHsKICAgICAgICB0aGlzLmNvbGxlY3RQaWNrdXAocGlja3VwKTsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KICAgICAgcmV0dXJuIHBpY2t1cC5hZ2UgPCAyODsKICAgIH0pOwogICAgd2hpbGUgKHRoaXMuc3RhdGUucGlja3Vwcy5sZW5ndGggPCA5KSB0aGlzLnNwYXduUGlja3VwKHRoaXMucmFuZG9tKCkgPiAwLjYgPyB0aGlzLnN0YXRlLnpvbmVJZCA6IFBIQVNFU1t0aGlzLnN0YXRlLnBoYXNlSW5kZXhdLnRhcmdldFpvbmUpOwogIH0KCiAgcHJpdmF0ZSBjb2xsZWN0UGlja3VwKHBpY2t1cDogUGlja3VwRW50aXR5KTogdm9pZCB7CiAgICBjb25zdCBjb21tYW5kQm9udXMgPSB0aGlzLnN0YXRlLnVwZ3JhZGVzLmluY2x1ZGVzKCJiYWN0b3ByZW5vbC1mbG93IikgPyAxLjI1IDogMTsKICAgIGNvbnN0IHNwZWNpZXMgPSBTUEVDSUVTW3RoaXMuc3RhdGUuc3BlY2llc0lkXTsKICAgIGNvbnN0IHJlcGFpciA9IHBpY2t1cC5raW5kID09PSAicmVhZ2VudERyb3BsZXQiID8gMiA6IHBpY2t1cC5raW5kID09PSAiYWdhclBsdWciID8gMS42IDogMTsKICAgIHRoaXMuc3RhdGUuYXNzZW1ibHkgKz0gcmVwYWlyOwogICAgdGhpcy5zdGF0ZS5jb21tYW5kQ2hhcmdlID0gY2xhbXAodGhpcy5zdGF0ZS5jb21tYW5kQ2hhcmdlICsgKHBpY2t1cC5raW5kID09PSAicGlwZXR0ZVRpcCIgPyAyNCA6IDE1KSAqIHNwZWNpZXMuY29tbWFuZEdhaW4gKiBjb21tYW5kQm9udXMsIDAsIDEwMCk7CiAgICBpZiAocGlja3VwLmtpbmQgPT09ICJyZWFnZW50RHJvcGxldCIpIHRoaXMuc3RhdGUuaW50ZWdyaXR5ID0gY2xhbXAodGhpcy5zdGF0ZS5pbnRlZ3JpdHkgKyA1ICogc3BlY2llcy5yZXBhaXJHYWluLCAwLCBzcGVjaWVzLmludGVncml0eSArIDE4KTsKICAgIHRoaXMuc3RhdGUuc2NvcmUgKz0gcGlja3VwLmtpbmQgPT09ICJtZWRpYUJlYWQiID8gMTM1IDogMTA1OwogICAgaWYgKCF0aGlzLnN0YXRlLmNhcnJpZWRQaWNrdXApIHRoaXMuc3RhdGUuY2FycmllZFBpY2t1cCA9IHBpY2t1cC5raW5kOwogICAgdGhpcy5zdGF0ZS5lZmZlY3RzLnB1c2goZWZmZWN0KCJwaWNrdXAiLCBwaWNrdXAueCwgcGlja3VwLnosIGBjYXJyeSAke1BJQ0tVUF9MQUJFTFNbcGlja3VwLmtpbmRdfWApKTsKICAgIGlmICh0aGlzLnN0YXRlLmFzc2VtYmx5ID49IHRoaXMuc3RhdGUuYXNzZW1ibHlUYXJnZXQpIHsKICAgICAgdGhpcy5zdGF0ZS5hc3NlbWJseSA9IDA7CiAgICAgIHRoaXMuc3RhdGUuaW50ZWdyaXR5ID0gY2xhbXAodGhpcy5zdGF0ZS5pbnRlZ3JpdHkgKyAxMyAqIHNwZWNpZXMucmVwYWlyR2FpbiwgMCwgc3BlY2llcy5pbnRlZ3JpdHkgKyAxNik7CiAgICAgIHRoaXMuc3RhdGUuc2NvcmUgKz0gNDQwOwogICAgICB0aGlzLnN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoImNvbW1hbmQiLCB0aGlzLnN0YXRlLnBsYXllci54LCB0aGlzLnN0YXRlLnBsYXllci56LCAid2FsbCBjeWNsZSIpKTsKICAgIH0KICB9CgogIHByaXZhdGUgdHJ5RGVwb3NpdENhcnJpZWRSZXNvdXJjZSgpOiB2b2lkIHsKICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTsKICAgIGlmICghc3RhdGUuY2FycmllZFBpY2t1cCkgcmV0dXJuOwogICAgY29uc3QgcG9pbnQgPSBkZXBvc2l0UG9pbnRGb3JQaGFzZShzdGF0ZSk7CiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguaHlwb3Qoc3RhdGUucGxheWVyLnggLSBwb2ludC54LCBzdGF0ZS5wbGF5ZXIueiAtIHBvaW50LnopOwogICAgaWYgKGRpc3RhbmNlID4gNC4yKSByZXR1cm47CiAgICBjb25zdCBwaGFzZSA9IFBIQVNFU1tzdGF0ZS5waGFzZUluZGV4XTsKICAgIGNvbnN0IGxhYmVsID0gUElDS1VQX0xBQkVMU1tzdGF0ZS5jYXJyaWVkUGlja3VwXTsKICAgIGNvbnN0IGZhc3RCb251cyA9IE1hdGgubWF4KDAsIDE4IC0gc3RhdGUucGhhc2VUaW1lKSAqIDg7CiAgICBzdGF0ZS5jb21ibyA9IE1hdGgubWluKDEyLCBzdGF0ZS5jb21ibyArIDEpOwogICAgc3RhdGUuc2NvcmUgKz0gMzQwICsgc3RhdGUuY29tYm8gKiA3MCArIGZhc3RCb251czsKICAgIHN0YXRlLmNvbW1hbmRDaGFyZ2UgPSBjbGFtcChzdGF0ZS5jb21tYW5kQ2hhcmdlICsgMTgsIDAsIDEwMCk7CiAgICBzdGF0ZS5pbnRlZ3JpdHkgPSBjbGFtcChzdGF0ZS5pbnRlZ3JpdHkgKyAoc3RhdGUuY2FycmllZFBpY2t1cCA9PT0gInJlYWdlbnREcm9wbGV0IiA/IDggOiA0KSwgMCwgU1BFQ0lFU1tzdGF0ZS5zcGVjaWVzSWRdLmludGVncml0eSArIDIwKTsKICAgIHN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoInBpY2t1cCIsIHBvaW50LngsIHBvaW50LnosIGBkZXBvc2l0ZWQgJHtsYWJlbH1gKSk7CiAgICBzdGF0ZS5jYXJyaWVkUGlja3VwID0gIiI7CiAgICBpZiAocGhhc2UuaWQgPT09ICJzbGlkZVRyYWluaW5nIiB8fCBwaGFzZS5pZCA9PT0gInBpcGV0dGVQdWxzZSIgfHwgcGhhc2UuaWQgPT09ICJmZXJuYmFjaEN1cnJlbnQiIHx8IHBoYXNlLmlkID09PSAibHlzaXNTdG9ybSIpIGFkdmFuY2VPYmplY3RpdmUoc3RhdGUsIDEpOwogIH0KCiAgcHJpdmF0ZSB0YWdOZWFyYnlQbGFxdWVzKCk6IHZvaWQgewogICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlOwogICAgc3RhdGUuaGF6YXJkcy5mb3JFYWNoKChoYXphcmQpID0+IHsKICAgICAgaWYgKGhhemFyZC5raW5kICE9PSAicGxhcXVlIiB8fCBoYXphcmQudGFnZ2VkKSByZXR1cm47CiAgICAgIGlmIChNYXRoLmh5cG90KHN0YXRlLnBsYXllci54IC0gaGF6YXJkLngsIHN0YXRlLnBsYXllci56IC0gaGF6YXJkLnopID4gaGF6YXJkLnJhZGl1cyArIDIuMikgcmV0dXJuOwogICAgICBoYXphcmQudGFnZ2VkID0gdHJ1ZTsKICAgICAgc3RhdGUuY29tYm8gPSBNYXRoLm1pbigxMiwgc3RhdGUuY29tYm8gKyAxKTsKICAgICAgc3RhdGUuc2NvcmUgKz0gMjQwICsgc3RhdGUuY29tYm8gKiA2MDsKICAgICAgc3RhdGUuZWZmZWN0cy5wdXNoKGVmZmVjdCgiY29tbWFuZCIsIGhhemFyZC54LCBoYXphcmQueiwgInBsYXF1ZSB0YWdnZWQiKSk7CiAgICAgIGFkdmFuY2VPYmplY3RpdmUoc3RhdGUsIDEpOwogICAgfSk7CiAgfQoKICBwcml2YXRlIHVwZGF0ZVJvdG9yQ3Jvc3NpbmcoKTogdm9pZCB7CiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7CiAgICBpZiAoc3RhdGUuem9uZUlkICE9PSAiY2VudHJpZnVnZSIpIHJldHVybjsKICAgIGlmIChzdGF0ZS5wbGF5ZXIueCA8IDMyICYmIChzdGF0ZS5qb2JTdGFnZSA8IDEgfHwgc3RhdGUuam9iU3RhZ2UgPj0gMykpIHsKICAgICAgc3RhdGUuam9iU3RhZ2UgPSAxOwogICAgICBzdGF0ZS5zY29yZSArPSA5MDsKICAgICAgc3RhdGUuZWZmZWN0cy5wdXNoKGVmZmVjdCgicGhhc2UiLCBzdGF0ZS5wbGF5ZXIueCwgc3RhdGUucGxheWVyLnosICJlbnRyeSBwb2NrZXQiKSk7CiAgICB9IGVsc2UgaWYgKHN0YXRlLnBsYXllci54ID4gNDIgJiYgc3RhdGUuam9iU3RhZ2UgPT09IDEpIHsKICAgICAgc3RhdGUuam9iU3RhZ2UgPSAyOwogICAgICBzdGF0ZS5jb21ibyA9IE1hdGgubWluKDEyLCBzdGF0ZS5jb21ibyArIDEpOwogICAgICBzdGF0ZS5zY29yZSArPSA0MjAgKyBzdGF0ZS5jb21ibyAqIDU1OwogICAgICBzdGF0ZS5lZmZlY3RzLnB1c2goZWZmZWN0KCJwaGFzZSIsIHN0YXRlLnBsYXllci54LCBzdGF0ZS5wbGF5ZXIueiwgInNhbXBsZSBjcm9zc2VkIikpOwogICAgICBhZHZhbmNlT2JqZWN0aXZlKHN0YXRlLCAxKTsKICAgIH0gZWxzZSBpZiAoc3RhdGUucGxheWVyLnggPiA1MiAmJiBzdGF0ZS5qb2JTdGFnZSA9PT0gMikgewogICAgICBzdGF0ZS5qb2JTdGFnZSA9IDM7CiAgICAgIHN0YXRlLmNvbWJvID0gTWF0aC5taW4oMTIsIHN0YXRlLmNvbWJvICsgMSk7CiAgICAgIHN0YXRlLnNjb3JlICs9IDUyMCArIHN0YXRlLmNvbWJvICogNjA7CiAgICAgIHN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoInBoYXNlIiwgc3RhdGUucGxheWVyLngsIHN0YXRlLnBsYXllci56LCAiZXNjYXBlIGxhbmUiKSk7CiAgICAgIGFkdmFuY2VPYmplY3RpdmUoc3RhdGUsIDEpOwogICAgfQogIH0KCiAgcHJpdmF0ZSBzZWFsTmVhcmJ5QnJlYWtzKGtpbmRzOiBIYXphcmRLaW5kW10sIGxhYmVsOiBzdHJpbmcpOiB2b2lkIHsKICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTsKICAgIGxldCBzZWFsZWQgPSAwOwogICAgc3RhdGUuaGF6YXJkcyA9IHN0YXRlLmhhemFyZHMuZmlsdGVyKChoYXphcmQpID0+IHsKICAgICAgaWYgKCFraW5kcy5pbmNsdWRlcyhoYXphcmQua2luZCkgfHwgTWF0aC5oeXBvdChzdGF0ZS5wbGF5ZXIueCAtIGhhemFyZC54LCBzdGF0ZS5wbGF5ZXIueiAtIGhhemFyZC56KSA+IGhhemFyZC5yYWRpdXMgKyA1LjUpIHJldHVybiB0cnVlOwogICAgICBzZWFsZWQgKz0gMTsKICAgICAgc3RhdGUuZWZmZWN0cy5wdXNoKGVmZmVjdCgiY29tbWFuZCIsIGhhemFyZC54LCBoYXphcmQueiwgbGFiZWwpKTsKICAgICAgcmV0dXJuIGZhbHNlOwogICAgfSk7CiAgICBpZiAoIXNlYWxlZCkgcmV0dXJuOwogICAgc3RhdGUuY29tYm8gPSBNYXRoLm1pbigxMiwgc3RhdGUuY29tYm8gKyBzZWFsZWQpOwogICAgc3RhdGUuc2NvcmUgKz0gc2VhbGVkICogKDM2MCArIHN0YXRlLmNvbWJvICogNDUpOwogICAgYWR2YW5jZU9iamVjdGl2ZShzdGF0ZSwgc2VhbGVkKTsKICB9CgogIHByaXZhdGUgdXBkYXRlSGF6YXJkcyhkdDogbnVtYmVyKTogdm9pZCB7CiAgICB0aGlzLnN0YXRlLmhhemFyZHMgPSB0aGlzLnN0YXRlLmhhemFyZHMuZmlsdGVyKChoYXphcmQpID0+IHsKICAgICAgaGF6YXJkLmFnZSArPSBkdDsKICAgICAgaWYgKGhhemFyZC5hZ2UgPiBoYXphcmQudGVsZWdyYXBoKSB7CiAgICAgICAgaGF6YXJkLnggKz0gaGF6YXJkLnZ4ICogZHQ7CiAgICAgICAgaGF6YXJkLnogKz0gaGF6YXJkLnZ6ICogZHQ7CiAgICAgICAgaWYgKGhhemFyZC5hbmd1bGFyU3BlZWQpIGhhemFyZC5hbmdsZSArPSBoYXphcmQuYW5ndWxhclNwZWVkICogZHQ7CiAgICAgIH0KICAgICAgaWYgKGhhemFyZC5raW5kID09PSAicnVwdHVyZSIpIGhhemFyZC5yYWRpdXMgKz0gZHQgKiAwLjcyOwogICAgICBpZiAoaGF6YXJkLmtpbmQgPT09ICJwbGFxdWUiKSBoYXphcmQucmFkaXVzICs9IGR0ICogMC40ODsKICAgICAgaWYgKGhhemFyZC5raW5kID09PSAic3BpbGwiKSBoYXphcmQucmFkaXVzICs9IGR0ICogMC4yMjsKICAgICAgaWYgKHRoaXMuaGF6YXJkSGl0c1BsYXllcihoYXphcmQpKSB7CiAgICAgICAgdGhpcy5kYW1hZ2UoaGF6YXJkKTsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KICAgICAgcmV0dXJuIGhhemFyZC5hZ2UgPCBoYXphcmQuZHVyYXRpb24gJiYgTWF0aC5hYnMoaGF6YXJkLngpIDwgQ0hBTUJFUi53aWR0aCAqIDAuNjYgJiYgTWF0aC5hYnMoaGF6YXJkLnopIDwgQ0hBTUJFUi5kZXB0aCAqIDAuNjY7CiAgICB9KTsKICB9CgogIHByaXZhdGUgaGF6YXJkSGl0c1BsYXllcihoYXphcmQ6IEhhemFyZEVudGl0eSk6IGJvb2xlYW4gewogICAgaWYgKGhhemFyZC5hZ2UgPCBoYXphcmQudGVsZWdyYXBoKSByZXR1cm4gZmFsc2U7CiAgICBpZiAoaGF6YXJkLmtpbmQgPT09ICJjcmFjayIgfHwgaGF6YXJkLmtpbmQgPT09ICJzaG9jayIgfHwgaGF6YXJkLmtpbmQgPT09ICJyb3RvciIpIHsKICAgICAgY29uc3QgZHggPSB0aGlzLnN0YXRlLnBsYXllci54IC0gaGF6YXJkLng7CiAgICAgIGNvbnN0IGR6ID0gdGhpcy5zdGF0ZS5wbGF5ZXIueiAtIGhhemFyZC56OwogICAgICBjb25zdCBub3JtYWwgPSBNYXRoLmFicyhNYXRoLnNpbihoYXphcmQuYW5nbGUpICogZHggLSBNYXRoLmNvcyhoYXphcmQuYW5nbGUpICogZHopOwogICAgICBjb25zdCBhbG9uZyA9IE1hdGguYWJzKE1hdGguY29zKGhhemFyZC5hbmdsZSkgKiBkeCArIE1hdGguc2luKGhhemFyZC5hbmdsZSkgKiBkeik7CiAgICAgIGNvbnN0IGxlbmd0aCA9IGhhemFyZC5raW5kID09PSAicm90b3IiID8gaGF6YXJkLnJhZGl1cyA6IGhhemFyZC5raW5kID09PSAic2hvY2siID8gMTUgOiBoYXphcmQud2lkdGg7CiAgICAgIHJldHVybiBub3JtYWwgPCAoaGF6YXJkLmtpbmQgPT09ICJyb3RvciIgPyAwLjggOiBoYXphcmQua2luZCA9PT0gInNob2NrIiA/IDAuOSA6IDAuNykgKyB0aGlzLnN0YXRlLnBsYXllci5yYWRpdXMgKiAwLjQ1ICYmIGFsb25nIDwgbGVuZ3RoOwogICAgfQogICAgcmV0dXJuIE1hdGguaHlwb3QodGhpcy5zdGF0ZS5wbGF5ZXIueCAtIGhhemFyZC54LCB0aGlzLnN0YXRlLnBsYXllci56IC0gaGF6YXJkLnopIDwgaGF6YXJkLnJhZGl1cyArIHRoaXMuc3RhdGUucGxheWVyLnJhZGl1czsKICB9CgogIHByaXZhdGUgZGFtYWdlKGhhemFyZDogSGF6YXJkRW50aXR5KTogdm9pZCB7CiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7CiAgICBjb25zdCBzcGVjaWVzID0gU1BFQ0lFU1tzdGF0ZS5zcGVjaWVzSWRdOwogICAgbGV0IGFtb3VudCA9IGhhemFyZC5kYW1hZ2UgKiBzcGVjaWVzLmRhbWFnZVRha2VuOwogICAgaWYgKHN0YXRlLnVwZ3JhZGVzLmluY2x1ZGVzKCJjYXBzdWxlLXN1cmdlIikgJiYgc3RhdGUuY29tbWFuZENoYXJnZSA+PSA1MCkgYW1vdW50ICo9IDAuNzg7CiAgICBpZiAoc3RhdGUudXBncmFkZXMuaW5jbHVkZXMoImF1dG9seXNpbi1icmFrZSIpICYmIChoYXphcmQua2luZCA9PT0gImNyYWNrIiB8fCBoYXphcmQua2luZCA9PT0gInJ1cHR1cmUiIHx8IGhhemFyZC5raW5kID09PSAic3BpbGwiKSkgYW1vdW50ICo9IDAuNzI7CiAgICBpZiAoc3RhdGUudXBncmFkZXMuaW5jbHVkZXMoIm9tcC1idWZmZXIiKSAmJiAoaGF6YXJkLmtpbmQgPT09ICJydXB0dXJlIiB8fCBoYXphcmQua2luZCA9PT0gInNwaWxsIikpIGFtb3VudCAqPSAwLjY4OwogICAgc3RhdGUuaW50ZWdyaXR5ID0gY2xhbXAoc3RhdGUuaW50ZWdyaXR5IC0gYW1vdW50LCAwLCAxNDApOwogICAgc3RhdGUubHlzaXNDYXVzZSA9IGAke2hhemFyZC5raW5kfSBzdHJlc3MgbmVhciAke1pPTkVTX0JZX0lEW2hhemFyZC56b25lSWRdLnNob3J0TGFiZWx9YDsKICAgIHN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoImRhbWFnZSIsIHN0YXRlLnBsYXllci54LCBzdGF0ZS5wbGF5ZXIueiwgYC0ke01hdGgucm91bmQoYW1vdW50KX1gKSk7CiAgfQoKICBwcml2YXRlIHVwZGF0ZUVmZmVjdHMoZHQ6IG51bWJlcik6IHZvaWQgewogICAgdGhpcy5zdGF0ZS5lZmZlY3RzID0gdGhpcy5zdGF0ZS5lZmZlY3RzLmZpbHRlcigoaXRlbSkgPT4gewogICAgICBpdGVtLmFnZSArPSBkdDsKICAgICAgcmV0dXJuIGl0ZW0uYWdlIDwgMS44OwogICAgfSk7CiAgfQoKICBwcml2YXRlIGVuZFJ1bihjYXVzZTogc3RyaW5nKTogdm9pZCB7CiAgICB0aGlzLnN0YXRlLnN0YXR1cyA9ICJlbmRlZCI7CiAgICB0aGlzLnN0YXRlLnByZXZpb3VzU3RhdHVzID0gImVuZGVkIjsKICAgIHRoaXMuc3RhdGUubHlzaXNDYXVzZSA9IGNhdXNlOwogICAgdGhpcy5zdGF0ZS5lZmZlY3RzLnB1c2goZWZmZWN0KCJseXNpcyIsIHRoaXMuc3RhdGUucGxheWVyLngsIHRoaXMuc3RhdGUucGxheWVyLnosICJMeXNpcyIpKTsKICB9Cn0KCmZ1bmN0aW9uIGNyZWF0ZUluaXRpYWxTdGF0ZSgpOiBHYW1lU3RhdGUgewogIHJldHVybiB7CiAgICBzdGF0dXM6ICJtZW51IiwKICAgIHByZXZpb3VzU3RhdHVzOiAibWVudSIsCiAgICBtb2RlOiAiY2xhc3NpYyIsCiAgICBib2FyZDogImNsYXNzaWMiLAogICAgcGxheWVyTmFtZTogIkFub255bW91cyIsCiAgICBzZWxlY3RlZFNwZWNpZXNJZDogImVjb2xpIiwKICAgIHNwZWNpZXNJZDogImVjb2xpIiwKICAgIHNlZWQ6IDEsCiAgICBlbGFwc2VkOiAwLAogICAgc2NvcmU6IDAsCiAgICBpbnRlZ3JpdHk6IDEwMCwKICAgIGNvbW1hbmRDaGFyZ2U6IDAsCiAgICBhc3NlbWJseTogMCwKICAgIGFzc2VtYmx5VGFyZ2V0OiA1LAogICAgY2FycmllZFBpY2t1cDogIiIsCiAgICBjb21ibzogMCwKICAgIGpvYlN0YWdlOiAwLAogICAgam9iU3RlcDogIiIsCiAgICBuZXh0SGF6YXJkTGFiZWw6ICJ3YXRjaCB0ZWxlZ3JhcGhzIiwKICAgIHBoYXNlSW5kZXg6IDAsCiAgICBwaGFzZVRpbWU6IDAsCiAgICBwaGFzZVByb2dyZXNzOiAwLAogICAgem9uZUlkOiAibWljcm9zY29wZVNsaWRlIiwKICAgIHVwZ3JhZGVzOiBbXSwKICAgIHVwZ3JhZGVDaG9pY2VzOiBbXSwKICAgIGx5c2lzQ2F1c2U6ICIiLAogICAgcGxheWVyOiB7IHg6IC00NiwgejogMjIsIHZ4OiAwLCB2ejogMCwgcmFkaXVzOiAwLjc1LCBkYXNoQ29vbGRvd246IDAsIGRhc2hUaW1lcjogMCB9LAogICAgaGF6YXJkczogW10sCiAgICBwaWNrdXBzOiBbXSwKICAgIGVmZmVjdHM6IFtdLAogICAgdGltZXJzOiB7IHBpY2t1cDogMC4yLCBwaGFnZTogMS4yLCBzaG9jazogMy4yLCBjcmFjazogNiwgcnVwdHVyZTogOC41LCBkcm9wbGV0OiAxLjgsIHJvdG9yOiA0LjUsIHBsYXF1ZTogNC4yLCBzcGlsbDogNi42LCBib3NzOiAxMyB9CiAgfTsKfQoKZnVuY3Rpb24gZGVwb3NpdFBvaW50Rm9yUGhhc2Uoc3RhdGU6IEdhbWVTdGF0ZSk6IHsgeDogbnVtYmVyOyB6OiBudW1iZXIgfSB7CiAgY29uc3QgcGhhc2UgPSBQSEFTRVNbc3RhdGUucGhhc2VJbmRleF07CiAgaWYgKHBoYXNlLmlkID09PSAiZmVybmJhY2hDdXJyZW50IikgcmV0dXJuIHsgeDogNiwgejogMTAgfTsKICBpZiAocGhhc2UuaWQgPT09ICJjZW50cmlmdWdlU3dlZXAiKSByZXR1cm4geyB4OiA1MiwgejogOCB9OwogIGlmIChwaGFzZS5pZCA9PT0gInJhY2tTZWFsIikgcmV0dXJuIHsgeDogMTUsIHo6IDI2IH07CiAgcmV0dXJuIHsgeDogLTQ0LCB6OiAyMiB9Owp9CgpmdW5jdGlvbiBzdGF0aW9uU3RlcChzdGF0ZTogR2FtZVN0YXRlKTogc3RyaW5nIHsKICBjb25zdCBwaGFzZSA9IFBIQVNFU1tzdGF0ZS5waGFzZUluZGV4XTsKICBpZiAoc3RhdGUuY2FycmllZFBpY2t1cCkgcmV0dXJuIGBDYXJyeSAke1BJQ0tVUF9MQUJFTFNbc3RhdGUuY2FycmllZFBpY2t1cF19IHRvICR7cGhhc2UuaWQgPT09ICJmZXJuYmFjaEN1cnJlbnQiID8gInRoZSBzcGlsbCIgOiAidGhlIHNsaWRlIGNoZWNrcG9pbnQifS5gOwogIGlmIChwaGFzZS5pZCA9PT0gInNsaWRlVHJhaW5pbmciKSByZXR1cm4gIlBpY2sgdXAgYSBiZWFkIG9yIGFnYXIgcGx1ZywgdGhlbiBkZXBvc2l0IGl0IG9uIHRoZSBzbGlkZS4iOwogIGlmIChwaGFzZS5pZCA9PT0gInBpcGV0dGVQdWxzZSIpIHJldHVybiAiQ29sbGVjdCBzdGVyaWxlIHBpcGV0dGUgdGlwcywgZG9kZ2UgcmVhZ2VudCBsYW5lcywgYW5kIHJldHVybiB0aXBzIHRvIHRoZSBzbGlkZS4iOwogIGlmIChwaGFzZS5pZCA9PT0gInBldHJpQmxvb20iKSByZXR1cm4gIlNraW0gcGxhcXVlIGVkZ2VzIHRvIHRhZyB0aGVtOyB1c2UgUGhhZ2UgRGVmZW5zZSBmb3IgY2x1c3RlcmVkIGNsZWFycy4iOwogIGlmIChwaGFzZS5pZCA9PT0gImZlcm5iYWNoQ3VycmVudCIpIHJldHVybiAiQ29sbGVjdCByZWFnZW50IGRyb3BsZXRzIGFuZCB1c2UgTWVtYnJhbmUgUmVwYWlyIG5lYXIgbWVkaWEgc3BpbGxzLiI7CiAgaWYgKHBoYXNlLmlkID09PSAiY2VudHJpZnVnZVN3ZWVwIikgewogICAgaWYgKHN0YXRlLmpvYlN0YWdlIDwgMSkgcmV0dXJuICJFbnRlciB0aGUgbGVmdCBzYWZlIHBvY2tldCBiZWZvcmUgdGhlIHJvdG9yIHN3ZWVwLiI7CiAgICBpZiAoc3RhdGUuam9iU3RhZ2UgPCAyKSByZXR1cm4gIkNyb3NzIHRocm91Z2ggdGhlIGNlbnRlciBwb2NrZXQgZHVyaW5nIHRoZSBvcGVuaW5nLiI7CiAgICBpZiAoc3RhdGUuam9iU3RhZ2UgPCAzKSByZXR1cm4gIkVzY2FwZSB0byB0aGUgZmFyIHBvY2tldCBiZWZvcmUgc3Bpbi11cC4iOwogICAgcmV0dXJuICJDb2xsZWN0IGFub3RoZXIgc2FtcGxlIG9yIHVzZSBNb3RpbGl0eSBmb3IgYSBoaWdoLXJpc2sgY3Jvc3NpbmcuIjsKICB9CiAgaWYgKHBoYXNlLmlkID09PSAicmFja1NlYWwiKSByZXR1cm4gIkZpbmQgcnVwdHVyZSBzaXRlcyBpbiB0aGUgcmFjayBhbmQgc2VhbCB0aGVtIHdpdGggUEcgb3IgTWVtYnJhbmUgY29tbWFuZHMuIjsKICByZXR1cm4gIkNoYWluIGRlcG9zaXRzIGFuZCBjb21tYW5kIGNsZWFycyB3aGlsZSB0aGUgZnVsbCBiZW5jaCBjb2xsYXBzZXMuIjsKfQoKZnVuY3Rpb24gYWR2YW5jZU9iamVjdGl2ZShzdGF0ZTogR2FtZVN0YXRlLCBhbW91bnQ6IG51bWJlcik6IHZvaWQgewogIGlmIChzdGF0ZS5zdGF0dXMgPT09ICJ1cGdyYWRlIikgcmV0dXJuOwogIGNvbnN0IHBoYXNlID0gUEhBU0VTW3N0YXRlLnBoYXNlSW5kZXhdOwogIHN0YXRlLnBoYXNlUHJvZ3Jlc3MgPSBjbGFtcChzdGF0ZS5waGFzZVByb2dyZXNzICsgYW1vdW50LCAwLCBwaGFzZS50YXJnZXQpOwogIGlmIChzdGF0ZS5waGFzZVByb2dyZXNzID49IHBoYXNlLnRhcmdldCAmJiBzdGF0ZS5waGFzZUluZGV4IDwgRklOQUxfUEhBU0VfSU5ERVgpIHsKICAgIHN0YXRlLnNjb3JlICs9IDk4MCArIHN0YXRlLnBoYXNlSW5kZXggKiAzMDA7CiAgICBzdGF0ZS51cGdyYWRlQ2hvaWNlcyA9IGNob29zZVVwZ3JhZGVEcmFmdChzdGF0ZSk7CiAgICBzdGF0ZS5zdGF0dXMgPSAidXBncmFkZSI7CiAgICBzdGF0ZS5wcmV2aW91c1N0YXR1cyA9ICJ1cGdyYWRlIjsKICB9Cn0KCmZ1bmN0aW9uIGNob29zZVVwZ3JhZGVEcmFmdChzdGF0ZTogR2FtZVN0YXRlKTogVXBncmFkZUlkW10gewogIGNvbnN0IHJhbmRvbSA9IGNyZWF0ZVNlZWRlZFJhbmRvbShoYXNoU3RyaW5nKGAke3N0YXRlLnNlZWR9LSR7c3RhdGUucGhhc2VJbmRleH0tJHtzdGF0ZS51cGdyYWRlcy5qb2luKCIsIil9YCkpOwogIGNvbnN0IGF2YWlsYWJsZSA9IFVQR1JBREVfSURTLmZpbHRlcigoaWQpID0+ICFzdGF0ZS51cGdyYWRlcy5pbmNsdWRlcyhpZCkpOwogIGNvbnN0IGRyYWZ0OiBVcGdyYWRlSWRbXSA9IFtdOwogIHdoaWxlIChkcmFmdC5sZW5ndGggPCAzICYmIGF2YWlsYWJsZS5sZW5ndGggPiAwKSB7CiAgICBjb25zdCBjaG9zZW4gPSBwaWNrKHJhbmRvbSwgYXZhaWxhYmxlKTsKICAgIGRyYWZ0LnB1c2goY2hvc2VuKTsKICAgIGF2YWlsYWJsZS5zcGxpY2UoYXZhaWxhYmxlLmluZGV4T2YoY2hvc2VuKSwgMSk7CiAgfQogIHJldHVybiBkcmFmdDsKfQoKZnVuY3Rpb24gY2xlYXJIYXphcmRzKHN0YXRlOiBHYW1lU3RhdGUsIGNlbnRlcjogeyB4OiBudW1iZXI7IHo6IG51bWJlciB9LCByYWRpdXM6IG51bWJlciwga2luZHM6IEhhemFyZEtpbmRbXSk6IG51bWJlciB7CiAgbGV0IGNsZWFyZWQgPSAwOwogIHN0YXRlLmhhemFyZHMgPSBzdGF0ZS5oYXphcmRzLmZpbHRlcigoaGF6YXJkKSA9PiB7CiAgICBpZiAoIWtpbmRzLmluY2x1ZGVzKGhhemFyZC5raW5kKSB8fCBNYXRoLmh5cG90KGhhemFyZC54IC0gY2VudGVyLngsIGhhemFyZC56IC0gY2VudGVyLnopID4gcmFkaXVzKSByZXR1cm4gdHJ1ZTsKICAgIGNsZWFyZWQgKz0gMTsKICAgIHN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QoImNvbW1hbmQiLCBoYXphcmQueCwgaGF6YXJkLnosICJjbGVhciIpKTsKICAgIHJldHVybiBmYWxzZTsKICB9KTsKICByZXR1cm4gY2xlYXJlZDsKfQoKZnVuY3Rpb24gdXBncmFkZUNvbW1hbmRHYWluKHN0YXRlOiBHYW1lU3RhdGUpOiBudW1iZXIgewogIGxldCB2YWx1ZSA9IDE7CiAgaWYgKHN0YXRlLnVwZ3JhZGVzLmluY2x1ZGVzKCJiYWN0b3ByZW5vbC1mbG93IikpIHZhbHVlICs9IDAuMDg7CiAgaWYgKHN0YXRlLnVwZ3JhZGVzLmluY2x1ZGVzKCJtcmVCLWFsaWdubWVudCIpKSB2YWx1ZSArPSAwLjA2OwogIHJldHVybiB2YWx1ZTsKfQoKZnVuY3Rpb24gcmVzb2x2ZVN0YXRpY0NvbGxpc2lvbnMoc3RhdGU6IEdhbWVTdGF0ZSk6IHZvaWQgewogIExBQl9QUk9QUy5mb3JFYWNoKChwcm9wKSA9PiB7CiAgICBwcm9wLmNvbGxpc2lvbj8uZm9yRWFjaCgocHJveHkpID0+IHJlc29sdmVQcm94eUNvbGxpc2lvbihzdGF0ZS5wbGF5ZXIsIHByb3h5KSk7CiAgfSk7Cn0KCmZ1bmN0aW9uIHJlc29sdmVQcm94eUNvbGxpc2lvbihwbGF5ZXI6IEdhbWVTdGF0ZVsicGxheWVyIl0sIHByb3h5OiBDb2xsaXNpb25Qcm94eSk6IHZvaWQgewogIGlmIChwcm94eS50eXBlID09PSAiY2lyY2xlIikgewogICAgY29uc3QgZHggPSBwbGF5ZXIueCAtIHByb3h5Lng7CiAgICBjb25zdCBkeiA9IHBsYXllci56IC0gcHJveHkuejsKICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5oeXBvdChkeCwgZHopIHx8IDAuMDAxOwogICAgY29uc3Qgb3ZlcmxhcCA9IHByb3h5LnJhZGl1cyArIHBsYXllci5yYWRpdXMgLSBkaXN0YW5jZTsKICAgIGlmIChvdmVybGFwID4gMCkgewogICAgICBwbGF5ZXIueCArPSAoZHggLyBkaXN0YW5jZSkgKiBvdmVybGFwOwogICAgICBwbGF5ZXIueiArPSAoZHogLyBkaXN0YW5jZSkgKiBvdmVybGFwOwogICAgfQogICAgcmV0dXJuOwogIH0KCiAgY29uc3QgaGFsZldpZHRoID0gcHJveHkud2lkdGggLyAyOwogIGNvbnN0IGhhbGZEZXB0aCA9IHByb3h5LmRlcHRoIC8gMjsKICBjb25zdCBjbG9zZXN0WCA9IGNsYW1wKHBsYXllci54LCBwcm94eS54IC0gaGFsZldpZHRoLCBwcm94eS54ICsgaGFsZldpZHRoKTsKICBjb25zdCBjbG9zZXN0WiA9IGNsYW1wKHBsYXllci56LCBwcm94eS56IC0gaGFsZkRlcHRoLCBwcm94eS56ICsgaGFsZkRlcHRoKTsKICBjb25zdCBkeCA9IHBsYXllci54IC0gY2xvc2VzdFg7CiAgY29uc3QgZHogPSBwbGF5ZXIueiAtIGNsb3Nlc3RaOwogIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5oeXBvdChkeCwgZHopOwogIGlmIChkaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCBwbGF5ZXIucmFkaXVzKSB7CiAgICBjb25zdCBvdmVybGFwID0gcGxheWVyLnJhZGl1cyAtIGRpc3RhbmNlOwogICAgcGxheWVyLnggKz0gKGR4IC8gZGlzdGFuY2UpICogb3ZlcmxhcDsKICAgIHBsYXllci56ICs9IChkeiAvIGRpc3RhbmNlKSAqIG92ZXJsYXA7CiAgfSBlbHNlIGlmIChkaXN0YW5jZSA9PT0gMCAmJiBwbGF5ZXIueCA+IHByb3h5LnggLSBoYWxmV2lkdGggJiYgcGxheWVyLnggPCBwcm94eS54ICsgaGFsZldpZHRoICYmIHBsYXllci56ID4gcHJveHkueiAtIGhhbGZEZXB0aCAmJiBwbGF5ZXIueiA8IHByb3h5LnogKyBoYWxmRGVwdGgpIHsKICAgIGNvbnN0IHB1c2hYID0gaGFsZldpZHRoIC0gTWF0aC5hYnMocGxheWVyLnggLSBwcm94eS54KTsKICAgIGNvbnN0IHB1c2haID0gaGFsZkRlcHRoIC0gTWF0aC5hYnMocGxheWVyLnogLSBwcm94eS56KTsKICAgIGlmIChwdXNoWCA8IHB1c2haKSBwbGF5ZXIueCArPSBwbGF5ZXIueCA8IHByb3h5LnggPyAtcHVzaFggLSBwbGF5ZXIucmFkaXVzIDogcHVzaFggKyBwbGF5ZXIucmFkaXVzOwogICAgZWxzZSBwbGF5ZXIueiArPSBwbGF5ZXIueiA8IHByb3h5LnogPyAtcHVzaFogLSBwbGF5ZXIucmFkaXVzIDogcHVzaFogKyBwbGF5ZXIucmFkaXVzOwogIH0KfQoKZnVuY3Rpb24gaGl0c1N0YXRpY1Byb3h5KHBvaW50OiB7IHg6IG51bWJlcjsgejogbnVtYmVyIH0sIHJhZGl1czogbnVtYmVyKTogYm9vbGVhbiB7CiAgcmV0dXJuIExBQl9QUk9QUy5zb21lKChwcm9wKSA9PgogICAgcHJvcC5jb2xsaXNpb24/LnNvbWUoKHByb3h5KSA9PiB7CiAgICAgIGlmIChwcm94eS50eXBlID09PSAiY2lyY2xlIikgcmV0dXJuIE1hdGguaHlwb3QocG9pbnQueCAtIHByb3h5LngsIHBvaW50LnogLSBwcm94eS56KSA8IHByb3h5LnJhZGl1cyArIHJhZGl1czsKICAgICAgY29uc3QgY2xvc2VzdFggPSBjbGFtcChwb2ludC54LCBwcm94eS54IC0gcHJveHkud2lkdGggLyAyLCBwcm94eS54ICsgcHJveHkud2lkdGggLyAyKTsKICAgICAgY29uc3QgY2xvc2VzdFogPSBjbGFtcChwb2ludC56LCBwcm94eS56IC0gcHJveHkuZGVwdGggLyAyLCBwcm94eS56ICsgcHJveHkuZGVwdGggLyAyKTsKICAgICAgcmV0dXJuIE1hdGguaHlwb3QocG9pbnQueCAtIGNsb3Nlc3RYLCBwb2ludC56IC0gY2xvc2VzdFopIDwgcmFkaXVzOwogICAgfSkKICApOwp9CgpmdW5jdGlvbiB6b25lQXQocG9pbnQ6IHsgeDogbnVtYmVyOyB6OiBudW1iZXIgfSk6IFdvcmxkWm9uZUlkIHwgbnVsbCB7CiAgY29uc3Qgem9uZSA9IFdPUkxEX1pPTkVTLmZpbmQoKGl0ZW0pID0+IHsKICAgIGNvbnN0IGJvdW5kcyA9IGl0ZW0uYm91bmRzOwogICAgcmV0dXJuIHBvaW50LnggPj0gYm91bmRzLnggLSBib3VuZHMud2lkdGggLyAyICYmIHBvaW50LnggPD0gYm91bmRzLnggKyBib3VuZHMud2lkdGggLyAyICYmIHBvaW50LnogPj0gYm91bmRzLnogLSBib3VuZHMuZGVwdGggLyAyICYmIHBvaW50LnogPD0gYm91bmRzLnogKyBib3VuZHMuZGVwdGggLyAyOwogIH0pOwogIHJldHVybiB6b25lPy5pZCA/PyBudWxsOwp9CgpmdW5jdGlvbiBkYWlseUJvYXJkKCk6IHN0cmluZyB7CiAgcmV0dXJuIGBkYWlseS0ke25ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCJlbi1DQSIsIHsgdGltZVpvbmU6IExBQl9USU1FWk9ORSB9KS5mb3JtYXQobmV3IERhdGUoKSl9YDsKfQoKZnVuY3Rpb24gZWZmZWN0KHR5cGU6IEVmZmVjdEV2ZW50WyJ0eXBlIl0sIHg6IG51bWJlciwgejogbnVtYmVyLCBsYWJlbDogc3RyaW5nKTogRWZmZWN0RXZlbnQgewogIHJldHVybiB7IGlkOiBuZXh0SWQrKywgdHlwZSwgeCwgeiwgbGFiZWwsIGFnZTogMCB9Owp9CgpmdW5jdGlvbiBmb3JtYXREdXJhdGlvbihzZWNvbmRzOiBudW1iZXIpOiBzdHJpbmcgewogIGNvbnN0IHNhZmUgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKHNlY29uZHMpKTsKICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzYWZlIC8gNjApOwogIGNvbnN0IHNlY3MgPSBzYWZlICUgNjA7CiAgcmV0dXJuIGAke21pbnN9OiR7U3RyaW5nKHNlY3MpLnBhZFN0YXJ0KDIsICIwIil9YDsKfQoKZnVuY3Rpb24gY2xhbXAodmFsdWU6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHsKICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHZhbHVlKSk7Cn0KCmZ1bmN0aW9uIGxlcnAoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGFscGhhOiBudW1iZXIpOiBudW1iZXIgewogIHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiBjbGFtcChhbHBoYSwgMCwgMSk7Cn0K", zC = "data:video/mp2t;base64,ZXhwb3J0IHR5cGUgU3BlY2llc0lkID0KICB8ICJlY29saSIKICB8ICJwYWVydWdpbm9zYSIKICB8ICJzYXVyZXVzIgogIHwgInNwbmV1bW9uaWFlIgogIHwgImNnbHV0YW1pY3VtIgogIHwgImtwbmV1bW9uaWFlIgogIHwgImFiYXVtYW5uaWkiOwoKZXhwb3J0IHR5cGUgUnVuTW9kZSA9ICJjbGFzc2ljIiB8ICJkYWlseSI7CmV4cG9ydCB0eXBlIFJ1blN0YXR1cyA9ICJtZW51IiB8ICJicmllZmluZyIgfCAicnVubmluZyIgfCAiY29tbWFuZCIgfCAidXBncmFkZSIgfCAicGF1c2VkIiB8ICJlbmRlZCI7CmV4cG9ydCB0eXBlIENvbW1hbmRJZCA9ICJwZyIgfCAibWVtYnJhbmUiIHwgInBoYWdlIiB8ICJtb3RpbGl0eSI7CmV4cG9ydCB0eXBlIFN0cmVzc0lkID0gInNsaWRlVHJhaW5pbmciIHwgInBpcGV0dGVQdWxzZSIgfCAicGV0cmlCbG9vbSIgfCAiZmVybmJhY2hDdXJyZW50IiB8ICJjZW50cmlmdWdlU3dlZXAiIHwgInJhY2tTZWFsIiB8ICJseXNpc1N0b3JtIjsKZXhwb3J0IHR5cGUgV29ybGRab25lSWQgPSAibWljcm9zY29wZVNsaWRlIiB8ICJwaXBldHRlWm9uZSIgfCAicGV0cmlEaXNoIiB8ICJmZXJuYmFjaEZsYXNrIiB8ICJjZW50cmlmdWdlIiB8ICJ0dWJlUmFjayI7CmV4cG9ydCB0eXBlIExhYlByb3BLaW5kID0gInBpcGV0dGUiIHwgInBldHJpRGlzaCIgfCAiZmVybmJhY2hGbGFzayIgfCAiY2VudHJpZnVnZSIgfCAidHViZVJhY2siIHwgIm1pY3Jvc2NvcGVTbGlkZSIgfCAic3BpbGwiIHwgInRpcEJveCI7CmV4cG9ydCB0eXBlIEhhemFyZEtpbmQgPSAicGhhZ2UiIHwgInNob2NrIiB8ICJjcmFjayIgfCAicnVwdHVyZSIgfCAiZHJvcGxldCIgfCAicm90b3IiIHwgInBsYXF1ZSIgfCAic3BpbGwiOwpleHBvcnQgdHlwZSBQaWNrdXBLaW5kID0gInBpcGV0dGVUaXAiIHwgInJlYWdlbnREcm9wbGV0IiB8ICJhZ2FyUGx1ZyIgfCAibWVkaWFCZWFkIjsKZXhwb3J0IHR5cGUgVXBncmFkZUlkID0KICB8ICJwb25BLW92ZXJkcml2ZSIKICB8ICJscG9CLXRldGhlciIKICB8ICJiYWN0b3ByZW5vbC1mbG93IgogIHwgIm9tcC1idWZmZXIiCiAgfCAicmVzdHJpY3Rpb24tYnVyc3QiCiAgfCAiY2hlbW9yZWZsZXgiCiAgfCAiYXV0b2x5c2luLWJyYWtlIgogIHwgImNhcHN1bGUtc3VyZ2UiCiAgfCAibXJlQi1hbGlnbm1lbnQiOwoKZXhwb3J0IGludGVyZmFjZSBWZWMyIHsKICB4OiBudW1iZXI7CiAgejogbnVtYmVyOwp9CgpleHBvcnQgaW50ZXJmYWNlIEJvdW5kcyB7CiAgeDogbnVtYmVyOwogIHo6IG51bWJlcjsKICB3aWR0aDogbnVtYmVyOwogIGRlcHRoOiBudW1iZXI7Cn0KCmV4cG9ydCB0eXBlIENvbGxpc2lvblByb3h5ID0KICB8IHsgdHlwZTogImNpcmNsZSI7IHg6IG51bWJlcjsgejogbnVtYmVyOyByYWRpdXM6IG51bWJlciB9CiAgfCB7IHR5cGU6ICJib3giOyB4OiBudW1iZXI7IHo6IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgZGVwdGg6IG51bWJlciB9OwoKZXhwb3J0IGludGVyZmFjZSBXb3JsZFpvbmUgewogIGlkOiBXb3JsZFpvbmVJZDsKICBsYWJlbDogc3RyaW5nOwogIHNob3J0TGFiZWw6IHN0cmluZzsKICBib3VuZHM6IEJvdW5kczsKICBjb2xvcjogbnVtYmVyOwogIGFjY2VudDogbnVtYmVyOwogIG9iamVjdGl2ZUhpbnQ6IHN0cmluZzsKfQoKZXhwb3J0IGludGVyZmFjZSBMYWJQcm9wIHsKICBpZDogc3RyaW5nOwogIGtpbmQ6IExhYlByb3BLaW5kOwogIGxhYmVsOiBzdHJpbmc7CiAgem9uZUlkOiBXb3JsZFpvbmVJZDsKICB4OiBudW1iZXI7CiAgejogbnVtYmVyOwogIHdpZHRoOiBudW1iZXI7CiAgZGVwdGg6IG51bWJlcjsKICBoZWlnaHQ/OiBudW1iZXI7CiAgcmFkaXVzPzogbnVtYmVyOwogIGFuZ2xlPzogbnVtYmVyOwogIGNvbGxpc2lvbj86IENvbGxpc2lvblByb3h5W107Cn0KCmV4cG9ydCBpbnRlcmZhY2UgSW5wdXRTdGF0ZSB7CiAgbW92ZVg6IG51bWJlcjsKICBtb3ZlWjogbnVtYmVyOwogIGRhc2g6IGJvb2xlYW47CiAgY29tbWFuZFdoZWVsOiBib29sZWFuOwp9CgpleHBvcnQgaW50ZXJmYWNlIFNwZWNpZXNEZWZpbml0aW9uIHsKICBpZDogU3BlY2llc0lkOwogIGxhYmVsOiBzdHJpbmc7CiAgc2hvcnRMYWJlbDogc3RyaW5nOwogIHRyYWl0VGl0bGU6IHN0cmluZzsKICB0cmFpdENvcHk6IHN0cmluZzsKICBzcGVlZDogbnVtYmVyOwogIGRhc2hTcGVlZDogbnVtYmVyOwogIGludGVncml0eTogbnVtYmVyOwogIHJlcGFpckdhaW46IG51bWJlcjsKICBjb21tYW5kR2FpbjogbnVtYmVyOwogIGRhbWFnZVRha2VuOiBudW1iZXI7CiAgY29sb3JBOiBudW1iZXI7CiAgY29sb3JCOiBudW1iZXI7CiAgc2lsaG91ZXR0ZTogInJvZCIgfCAiY3VydmVkIiB8ICJjb2NjdXMiIHwgImRpcGxvY29jY3VzIiB8ICJjb3J5bmVmb3JtIiB8ICJjYXBzdWxlIiB8ICJzaG9ydFJvZCI7Cn0KCmV4cG9ydCBpbnRlcmZhY2UgUGhhc2VEZWZpbml0aW9uIHsKICBpZDogU3RyZXNzSWQ7CiAgdGl0bGU6IHN0cmluZzsKICBvYmplY3RpdmU6IHN0cmluZzsKICB0YXJnZXRab25lOiBXb3JsZFpvbmVJZDsKICBzdGFydHNBdDogbnVtYmVyOwogIHRhcmdldDogbnVtYmVyOwogIGJvc3M6IHN0cmluZzsKICB0aW50OiBudW1iZXI7CiAgcHJlc3N1cmU6IHN0cmluZzsKfQoKZXhwb3J0IGludGVyZmFjZSBDb21tYW5kRGVmaW5pdGlvbiB7CiAgaWQ6IENvbW1hbmRJZDsKICBsYWJlbDogc3RyaW5nOwogIHNob3J0TGFiZWw6IHN0cmluZzsKICBjb3B5OiBzdHJpbmc7CiAgY29sb3I6IHN0cmluZzsKfQoKZXhwb3J0IGludGVyZmFjZSBVcGdyYWRlRGVmaW5pdGlvbiB7CiAgaWQ6IFVwZ3JhZGVJZDsKICB0aXRsZTogc3RyaW5nOwogIGNvcHk6IHN0cmluZzsKICBjb21tYW5kPzogQ29tbWFuZElkOwp9CgpleHBvcnQgaW50ZXJmYWNlIEhhemFyZEVudGl0eSB7CiAgaWQ6IG51bWJlcjsKICBraW5kOiBIYXphcmRLaW5kOwogIHpvbmVJZDogV29ybGRab25lSWQ7CiAgeDogbnVtYmVyOwogIHo6IG51bWJlcjsKICB2eDogbnVtYmVyOwogIHZ6OiBudW1iZXI7CiAgcmFkaXVzOiBudW1iZXI7CiAgd2lkdGg6IG51bWJlcjsKICBhbmdsZTogbnVtYmVyOwogIGFnZTogbnVtYmVyOwogIHRlbGVncmFwaDogbnVtYmVyOwogIGR1cmF0aW9uOiBudW1iZXI7CiAgZGFtYWdlOiBudW1iZXI7CiAgYW5ndWxhclNwZWVkPzogbnVtYmVyOwogIHRhZ2dlZD86IGJvb2xlYW47Cn0KCmV4cG9ydCBpbnRlcmZhY2UgUGlja3VwRW50aXR5IHsKICBpZDogbnVtYmVyOwogIGtpbmQ6IFBpY2t1cEtpbmQ7CiAgeDogbnVtYmVyOwogIHo6IG51bWJlcjsKICByYWRpdXM6IG51bWJlcjsKICBhZ2U6IG51bWJlcjsKfQoKZXhwb3J0IGludGVyZmFjZSBFZmZlY3RFdmVudCB7CiAgaWQ6IG51bWJlcjsKICB0eXBlOiAiZGFzaCIgfCAiZGFtYWdlIiB8ICJwaWNrdXAiIHwgImNvbW1hbmQiIHwgInBoYXNlIiB8ICJ1cGdyYWRlIiB8ICJseXNpcyI7CiAgeDogbnVtYmVyOwogIHo6IG51bWJlcjsKICBsYWJlbDogc3RyaW5nOwogIGFnZTogbnVtYmVyOwp9CgpleHBvcnQgaW50ZXJmYWNlIEdhbWVTdGF0ZSB7CiAgc3RhdHVzOiBSdW5TdGF0dXM7CiAgcHJldmlvdXNTdGF0dXM6IFJ1blN0YXR1czsKICBtb2RlOiBSdW5Nb2RlOwogIGJvYXJkOiBzdHJpbmc7CiAgcGxheWVyTmFtZTogc3RyaW5nOwogIHNlbGVjdGVkU3BlY2llc0lkOiBTcGVjaWVzSWQ7CiAgc3BlY2llc0lkOiBTcGVjaWVzSWQ7CiAgc2VlZDogbnVtYmVyOwogIGVsYXBzZWQ6IG51bWJlcjsKICBzY29yZTogbnVtYmVyOwogIGludGVncml0eTogbnVtYmVyOwogIGNvbW1hbmRDaGFyZ2U6IG51bWJlcjsKICBhc3NlbWJseTogbnVtYmVyOwogIGFzc2VtYmx5VGFyZ2V0OiBudW1iZXI7CiAgY2FycmllZFBpY2t1cDogUGlja3VwS2luZCB8ICIiOwogIGNvbWJvOiBudW1iZXI7CiAgam9iU3RhZ2U6IG51bWJlcjsKICBqb2JTdGVwOiBzdHJpbmc7CiAgbmV4dEhhemFyZExhYmVsOiBzdHJpbmc7CiAgcGhhc2VJbmRleDogbnVtYmVyOwogIHBoYXNlVGltZTogbnVtYmVyOwogIHBoYXNlUHJvZ3Jlc3M6IG51bWJlcjsKICB6b25lSWQ6IFdvcmxkWm9uZUlkOwogIHVwZ3JhZGVzOiBVcGdyYWRlSWRbXTsKICB1cGdyYWRlQ2hvaWNlczogVXBncmFkZUlkW107CiAgbHlzaXNDYXVzZTogc3RyaW5nOwogIHBsYXllcjogVmVjMiAmIHsgdng6IG51bWJlcjsgdno6IG51bWJlcjsgcmFkaXVzOiBudW1iZXI7IGRhc2hDb29sZG93bjogbnVtYmVyOyBkYXNoVGltZXI6IG51bWJlciB9OwogIGhhemFyZHM6IEhhemFyZEVudGl0eVtdOwogIHBpY2t1cHM6IFBpY2t1cEVudGl0eVtdOwogIGVmZmVjdHM6IEVmZmVjdEV2ZW50W107CiAgdGltZXJzOiBSZWNvcmQ8SGF6YXJkS2luZCB8ICJwaWNrdXAiIHwgImJvc3MiLCBudW1iZXI+Owp9CgpleHBvcnQgaW50ZXJmYWNlIEh1ZFNuYXBzaG90IHsKICBzdGF0dXM6IFJ1blN0YXR1czsKICBzY29yZTogbnVtYmVyOwogIHRpbWVMYWJlbDogc3RyaW5nOwogIGludGVncml0eTogbnVtYmVyOwogIGNvbW1hbmRDaGFyZ2U6IG51bWJlcjsKICBwaGFzZVRpdGxlOiBzdHJpbmc7CiAgcGhhc2VQcmVzc3VyZTogc3RyaW5nOwogIHpvbmVMYWJlbDogc3RyaW5nOwogIG9iamVjdGl2ZTogc3RyaW5nOwogIG9iamVjdGl2ZVByb2dyZXNzOiBudW1iZXI7CiAgb2JqZWN0aXZlVGFyZ2V0OiBudW1iZXI7CiAgYm9hcmQ6IHN0cmluZzsKICBzcGVjaWVzTGFiZWw6IHN0cmluZzsKICB1cGdyYWRlQ291bnQ6IG51bWJlcjsKICBjYXJyaWVkTGFiZWw6IHN0cmluZzsKICBjb21ib0xhYmVsOiBzdHJpbmc7CiAgbmV4dEhhemFyZExhYmVsOiBzdHJpbmc7CiAgam9iU3RlcDogc3RyaW5nOwp9CgpleHBvcnQgaW50ZXJmYWNlIFJ1blJlcG9ydCB7CiAgc2NvcmU6IG51bWJlcjsKICBzcGVjaWVzSWQ6IFNwZWNpZXNJZDsKICBzcGVjaWVzTGFiZWw6IHN0cmluZzsKICBib2FyZDogc3RyaW5nOwogIHN1cnZpdmVkOiBzdHJpbmc7CiAgcGhhc2VSZWFjaGVkOiBzdHJpbmc7CiAgbHlzaXNDYXVzZTogc3RyaW5nOwogIHVwZ3JhZGVzOiBzdHJpbmdbXTsKICBjb21wbGV0ZWRBdDogbnVtYmVyOwp9CgpleHBvcnQgaW50ZXJmYWNlIFNjb3JlRW50cnkgewogIG5hbWU6IHN0cmluZzsKICBzY29yZTogbnVtYmVyOwogIHNwZWNpZXM6IFNwZWNpZXNJZDsKICBwbGF5ZWRBdDogbnVtYmVyOwogIGJvYXJkOiBzdHJpbmc7Cn0KCmV4cG9ydCBpbnRlcmZhY2UgTGVhZGVyYm9hcmRQYXlsb2FkIHsKICBlbnRyaWVzOiBTY29yZUVudHJ5W107CiAgdG90YWxFbnRyaWVzOiBudW1iZXI7CiAgdXBkYXRlZEF0OiBudW1iZXI7CiAgYm9hcmQ6IHN0cmluZzsKICBtb2RlOiAiZ2xvYmFsIiB8ICJmYWxsYmFjayIgfCAibG9jYWwiOwogIHJhbms/OiBudW1iZXI7Cn0K";
function sd(i, e) {
  if (e === Au)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), i;
  if (e === Vo || e === Xd) {
    let t = i.getIndex();
    if (t === null) {
      const r = [], o = i.getAttribute("position");
      if (o !== void 0) {
        for (let l = 0; l < o.count; l++)
          r.push(l);
        i.setIndex(r), t = i.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), i;
    }
    const n = t.count - 2, s = [];
    if (e === Vo)
      for (let r = 1; r <= n; r++)
        s.push(t.getX(0)), s.push(t.getX(r)), s.push(t.getX(r + 1));
    else
      for (let r = 0; r < n; r++)
        r % 2 === 0 ? (s.push(t.getX(r)), s.push(t.getX(r + 1)), s.push(t.getX(r + 2))) : (s.push(t.getX(r + 2)), s.push(t.getX(r + 1)), s.push(t.getX(r)));
    s.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const a = i.clone();
    return a.setIndex(s), a.clearGroups(), a;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), i;
}
function OC(i) {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = i.clone();
  return mh(i, n, function(s, a) {
    e.set(a, s), t.set(s, a);
  }), n.traverse(function(s) {
    if (!s.isSkinnedMesh) return;
    const a = s, r = e.get(s), o = r.skeleton.bones;
    a.skeleton = r.skeleton.clone(), a.bindMatrix.copy(r.bindMatrix), a.skeleton.bones = o.map(function(l) {
      return t.get(l);
    }), a.bind(a.skeleton, a.bindMatrix);
  }), n;
}
function mh(i, e, t) {
  t(i, e);
  for (let n = 0; n < i.children.length; n++)
    mh(i.children[n], e.children[n], t);
}
class JC extends hs {

  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new $C(t);
    }), this.register(function(t) {
      return new eb(t);
    }), this.register(function(t) {
      return new cb(t);
    }), this.register(function(t) {
      return new db(t);
    }), this.register(function(t) {
      return new hb(t);
    }), this.register(function(t) {
      return new nb(t);
    }), this.register(function(t) {
      return new ib(t);
    }), this.register(function(t) {
      return new sb(t);
    }), this.register(function(t) {
      return new ab(t);
    }), this.register(function(t) {
      return new qC(t);
    }), this.register(function(t) {
      return new rb(t);
    }), this.register(function(t) {
      return new tb(t);
    }), this.register(function(t) {
      return new lb(t);
    }), this.register(function(t) {
      return new ob(t);
    }), this.register(function(t) {
      return new jC(t);
    }), this.register(function(t) {
      return new ad(t, Xe.EXT_MESHOPT_COMPRESSION);
    }), this.register(function(t) {
      return new ad(t, Xe.KHR_MESHOPT_COMPRESSION);
    }), this.register(function(t) {
      return new ub(t);
    });
  }

  load(e, t, n, s) {
    const a = this;
    let r;
    if (this.resourcePath !== "")
      r = this.resourcePath;
    else if (this.path !== "") {
      const c = Ns.extractUrlBase(e);
      r = Ns.resolveURL(c, this.path);
    } else
      r = Ns.extractUrlBase(e);
    this.manager.itemStart(e);
    const o = function(c) {
      s ? s(c) : console.error(c), a.manager.itemError(e), a.manager.itemEnd(e);
    }, l = new ah(this.manager);
    l.setPath(this.path), l.setResponseType("arraybuffer"), l.setRequestHeader(this.requestHeader), l.setWithCredentials(this.withCredentials), l.load(e, function(c) {
      try {
        a.parse(c, r, function(d) {
          t(d), a.manager.itemEnd(e);
        }, o);
      } catch (d) {
        o(d);
      }
    }, n, o);
  }

  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }

  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }

  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }

  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }

  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }

  parse(e, t, n, s) {
    let a;
    const r = {}, o = {}, l = new TextDecoder();
    if (typeof e == "string")
      a = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (l.decode(new Uint8Array(e, 0, 4)) === Ih) {
        try {
          r[Xe.KHR_BINARY_GLTF] = new gb(e);
        } catch (u) {
          s && s(u);
          return;
        }
        a = JSON.parse(r[Xe.KHR_BINARY_GLTF].content);
      } else
        a = JSON.parse(l.decode(e));
    else
      a = e;
    if (a.asset === void 0 || a.asset.version[0] < 2) {
      s && s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const c = new wb(a, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    c.fileLoader.setRequestHeader(this.requestHeader);
    for (let d = 0; d < this.pluginCallbacks.length; d++) {
      const u = this.pluginCallbacks[d](c);
      u.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[u.name] = u, r[u.name] = !0;
    }
    if (a.extensionsUsed)
      for (let d = 0; d < a.extensionsUsed.length; ++d) {
        const u = a.extensionsUsed[d], h = a.extensionsRequired || [];
        switch (u) {
          case Xe.KHR_MATERIALS_UNLIT:
            r[u] = new QC();
            break;
          case Xe.KHR_DRACO_MESH_COMPRESSION:
            r[u] = new pb(a, this.dracoLoader);
            break;
          case Xe.KHR_TEXTURE_TRANSFORM:
            r[u] = new fb();
            break;
          case Xe.KHR_MESH_QUANTIZATION:
            r[u] = new mb();
            break;
          default:
            h.indexOf(u) >= 0 && o[u] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + u + '".');
        }
      }
    c.setExtensions(r), c.setPlugins(o), c.parse(n, s);
  }

  parseAsync(e, t) {
    const n = this;
    return new Promise(function(s, a) {
      n.parse(e, t, s, a);
    });
  }
}
function KC() {
  let i = {};
  return {
    get: function(e) {
      return i[e];
    },
    add: function(e, t) {
      i[e] = t;
    },
    remove: function(e) {
      delete i[e];
    },
    removeAll: function() {
      i = {};
    }
  };
}
function At(i, e, t) {
  const n = i.json.materials[e];
  return n.extensions && n.extensions[t] ? n.extensions[t] : null;
}
const Xe = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class jC {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let n = 0, s = t.length; n < s; n++) {
      const a = t[n];
      a.extensions && a.extensions[this.name] && a.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, a.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, n = "light:" + e;
    let s = t.cache.get(n);
    if (s) return s;
    const a = t.json, l = ((a.extensions && a.extensions[this.name] || {}).lights || [])[e];
    let c;
    const d = new Me(16777215);
    l.color !== void 0 && d.setRGB(l.color[0], l.color[1], l.color[2], tn);
    const u = l.range !== void 0 ? l.range : 0;
    switch (l.type) {
      case "directional":
        c = new oh(d), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new Po(d), c.distance = u;
        break;
      case "spot":
        c = new qg(d), c.distance = u, l.spot = l.spot || {}, l.spot.innerConeAngle = l.spot.innerConeAngle !== void 0 ? l.spot.innerConeAngle : 0, l.spot.outerConeAngle = l.spot.outerConeAngle !== void 0 ? l.spot.outerConeAngle : Math.PI / 4, c.angle = l.spot.outerConeAngle, c.penumbra = 1 - l.spot.innerConeAngle / l.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + l.type);
    }
    return c.position.set(0, 0, 0), xn(c, l), l.intensity !== void 0 && (c.intensity = l.intensity), c.name = t.createUniqueName(l.name || "light_" + e), s = Promise.resolve(c), t.cache.add(n, s), s;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, n = this.parser, a = n.json.nodes[e], o = (a.extensions && a.extensions[this.name] || {}).light;
    return o === void 0 ? null : this._loadLight(o).then(function(l) {
      return n._getNodeRef(t.cache, o, l);
    });
  }
}
class QC {
  constructor() {
    this.name = Xe.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Dt;
  }
  extendParams(e, t, n) {
    const s = [];
    e.color = new Me(1, 1, 1), e.opacity = 1;
    const a = t.pbrMetallicRoughness;
    if (a) {
      if (Array.isArray(a.baseColorFactor)) {
        const r = a.baseColorFactor;
        e.color.setRGB(r[0], r[1], r[2], tn), e.opacity = r[3];
      }
      a.baseColorTexture !== void 0 && s.push(n.assignTexture(e, "map", a.baseColorTexture, wt));
    }
    return Promise.all(s);
  }
}
class qC {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
  }
}
class $C {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && s.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && s.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (s.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
      const a = n.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new Te(a, a);
    }
    return Promise.all(s);
  }
}
class eb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    return n === null || (t.dispersion = n.dispersion !== void 0 ? n.dispersion : 0), Promise.resolve();
  }
}
class tb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && s.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && s.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(s);
  }
}
class nb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    if (t.sheenColor = new Me(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
      const a = n.sheenColorFactor;
      t.sheenColor.setRGB(a[0], a[1], a[2], tn);
    }
    return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && s.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, wt)), n.sheenRoughnessTexture !== void 0 && s.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(s);
  }
}
class ib {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && s.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(s);
  }
}
class sb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    t.thickness = n.thicknessFactor !== void 0 ? n.thicknessFactor : 0, n.thicknessTexture !== void 0 && s.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || 1 / 0;
    const a = n.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new Me().setRGB(a[0], a[1], a[2], tn), Promise.all(s);
  }
}
class ab {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    return n === null || (t.ior = n.ior !== void 0 ? n.ior : 1.5, t.ior === 0 && (t.ior = 1e3)), Promise.resolve();
  }
}
class rb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    t.specularIntensity = n.specularFactor !== void 0 ? n.specularFactor : 1, n.specularTexture !== void 0 && s.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
    const a = n.specularColorFactor || [1, 1, 1];
    return t.specularColor = new Me().setRGB(a[0], a[1], a[2], tn), n.specularColorTexture !== void 0 && s.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, wt)), Promise.all(s);
  }
}
class ob {
  constructor(e) {
    this.parser = e, this.name = Xe.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return t.bumpScale = n.bumpFactor !== void 0 ? n.bumpFactor : 1, n.bumpTexture !== void 0 && s.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(s);
  }
}
class lb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    return At(this.parser, e, this.name) !== null ? Xt : null;
  }
  extendMaterialParams(e, t) {
    const n = At(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && s.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(s);
  }
}
class cb {
  constructor(e) {
    this.parser = e, this.name = Xe.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, n = t.json, s = n.textures[e];
    if (!s.extensions || !s.extensions[this.name])
      return null;
    const a = s.extensions[this.name], r = t.options.ktx2Loader;
    if (!r) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, a.source, r);
  }
}
class db {
  constructor(e) {
    this.parser = e, this.name = Xe.EXT_TEXTURE_WEBP;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, s = n.json, a = s.textures[e];
    if (!a.extensions || !a.extensions[t])
      return null;
    const r = a.extensions[t], o = s.images[r.source];
    let l = n.textureLoader;
    if (o.uri) {
      const c = n.options.manager.getHandler(o.uri);
      c !== null && (l = c);
    }
    return n.loadTextureImage(e, r.source, l);
  }
}
class hb {
  constructor(e) {
    this.parser = e, this.name = Xe.EXT_TEXTURE_AVIF;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, s = n.json, a = s.textures[e];
    if (!a.extensions || !a.extensions[t])
      return null;
    const r = a.extensions[t], o = s.images[r.source];
    let l = n.textureLoader;
    if (o.uri) {
      const c = n.options.manager.getHandler(o.uri);
      c !== null && (l = c);
    }
    return n.loadTextureImage(e, r.source, l);
  }
}
class ad {
  constructor(e, t) {
    this.name = t, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const s = n.extensions[this.name], a = this.parser.getDependency("buffer", s.buffer), r = this.parser.options.meshoptDecoder;
      if (!r || !r.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return a.then(function(o) {
        const l = s.byteOffset || 0, c = s.byteLength || 0, d = s.count, u = s.byteStride, h = new Uint8Array(o, l, c);
        return r.decodeGltfBufferAsync ? r.decodeGltfBufferAsync(d, u, h, s.mode, s.filter).then(function(g) {
          return g.buffer;
        }) : r.ready.then(function() {
          const g = new ArrayBuffer(d * u);
          return r.decodeGltfBuffer(new Uint8Array(g), d, u, h, s.mode, s.filter), g;
        });
      });
    } else
      return null;
  }
}
class ub {
  constructor(e) {
    this.name = Xe.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0)
      return null;
    const s = t.meshes[n.mesh];
    for (const c of s.primitives)
      if (c.mode !== rn.TRIANGLES && c.mode !== rn.TRIANGLE_STRIP && c.mode !== rn.TRIANGLE_FAN && c.mode !== void 0)
        return null;
    const r = n.extensions[this.name].attributes, o = [], l = {};
    for (const c in r)
      o.push(this.parser.getDependency("accessor", r[c]).then((d) => (l[c] = d, l[c])));
    return o.length < 1 ? null : (o.push(this.parser.createNodeMesh(e)), Promise.all(o).then((c) => {
      const d = c.pop(), u = d.isGroup ? d.children : [d], h = c[0].count, g = [];
      for (const m of u) {
        const A = new Ue(), f = new N(), p = new jn(), b = new N(1, 1, 1), v = new yg(m.geometry, m.material, h);
        for (let S = 0; S < h; S++)
          l.TRANSLATION && f.fromBufferAttribute(l.TRANSLATION, S), l.ROTATION && p.fromBufferAttribute(l.ROTATION, S), l.SCALE && b.fromBufferAttribute(l.SCALE, S), v.setMatrixAt(S, A.compose(f, p, b));
        for (const S in l)
          if (S === "_COLOR_0") {
            const R = l[S];
            v.instanceColor = new Xo(R.array, R.itemSize, R.normalized);
          } else S !== "TRANSLATION" && S !== "ROTATION" && S !== "SCALE" && m.geometry.setAttribute(S, l[S]);
        dt.prototype.copy.call(v, m), this.parser.assignFinalMaterial(v), g.push(v);
      }
      return d.isGroup ? (d.clear(), d.add(...g), d) : g[0];
    }));
  }
}
const Ih = "glTF", ws = 12, rd = { JSON: 1313821514, BIN: 5130562 };
class gb {
  constructor(e) {
    this.name = Xe.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, ws), n = new TextDecoder();
    if (this.header = {
      magic: n.decode(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== Ih)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - ws, a = new DataView(e, ws);
    let r = 0;
    for (; r < s; ) {
      const o = a.getUint32(r, !0);
      r += 4;
      const l = a.getUint32(r, !0);
      if (r += 4, l === rd.JSON) {
        const c = new Uint8Array(e, ws + r, o);
        this.content = n.decode(c);
      } else if (l === rd.BIN) {
        const c = ws + r;
        this.body = e.slice(c, c + o);
      }
      r += o;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class pb {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = Xe.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const n = this.json, s = this.dracoLoader, a = e.extensions[this.name].bufferView, r = e.extensions[this.name].attributes, o = {}, l = {}, c = {};
    for (const d in r) {
      const u = zo[d] || d.toLowerCase();
      o[u] = r[d];
    }
    for (const d in e.attributes) {
      const u = zo[d] || d.toLowerCase();
      if (r[d] !== void 0) {
        const h = n.accessors[e.attributes[d]], g = Qi[h.componentType];
        c[u] = g.name, l[u] = h.normalized === !0;
      }
    }
    return t.getDependency("bufferView", a).then(function(d) {
      return new Promise(function(u, h) {
        s.decodeDracoFile(d, function(g) {
          for (const m in g.attributes) {
            const A = g.attributes[m], f = l[m];
            f !== void 0 && (A.normalized = f);
          }
          u(g);
        }, o, c, tn, h);
      });
    });
  }
}
class fb {
  constructor() {
    this.name = Xe.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class mb {
  constructor() {
    this.name = Xe.KHR_MESH_QUANTIZATION;
  }
}
class Ch extends ls {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, s = this.valueSize, a = e * s * 3 + s;
    for (let r = 0; r !== s; r++)
      t[r] = n[a + r];
    return t;
  }
  interpolate_(e, t, n, s) {
    const a = this.resultBuffer, r = this.sampleValues, o = this.valueSize, l = o * 2, c = o * 3, d = s - t, u = (n - t) / d, h = u * u, g = h * u, m = e * c, A = m - c, f = -2 * g + 3 * h, p = g - h, b = 1 - f, v = p - h + u;
    for (let S = 0; S !== o; S++) {
      const R = r[A + S + o], x = r[A + S + l] * d, G = r[m + S + o], C = r[m + S] * d;
      a[S] = b * R + v * x + f * G + p * C;
    }
    return a;
  }
}
const Ib = new jn();
class Cb extends Ch {
  interpolate_(e, t, n, s) {
    const a = super.interpolate_(e, t, n, s);
    return Ib.fromArray(a).normalize().toArray(a), a;
  }
}
const rn = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}, Qi = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, od = {
  9728: Rt,
  9729: Mt,
  9984: Ed,
  9985: Ra,
  9986: Ms,
  9987: Hn
}, ld = {
  33071: Mn,
  33648: Ea,
  10497: es
}, Pr = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, zo = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, li = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, bb = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: Ls,
  STEP: Vs
}, kr = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function Ab(i) {
  return i.DefaultMaterial === void 0 && (i.DefaultMaterial = new Zt({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: zn
  })), i.DefaultMaterial;
}
function Ci(i, e, t) {
  for (const n in t.extensions)
    i[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
}
function xn(i, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(i.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function yb(i, e, t) {
  let n = !1, s = !1, a = !1;
  for (let c = 0, d = e.length; c < d; c++) {
    const u = e[c];
    if (u.POSITION !== void 0 && (n = !0), u.NORMAL !== void 0 && (s = !0), u.COLOR_0 !== void 0 && (a = !0), n && s && a) break;
  }
  if (!n && !s && !a) return Promise.resolve(i);
  const r = [], o = [], l = [];
  for (let c = 0, d = e.length; c < d; c++) {
    const u = e[c];
    if (n) {
      const h = u.POSITION !== void 0 ? t.getDependency("accessor", u.POSITION) : i.attributes.position;
      r.push(h);
    }
    if (s) {
      const h = u.NORMAL !== void 0 ? t.getDependency("accessor", u.NORMAL) : i.attributes.normal;
      o.push(h);
    }
    if (a) {
      const h = u.COLOR_0 !== void 0 ? t.getDependency("accessor", u.COLOR_0) : i.attributes.color;
      l.push(h);
    }
  }
  return Promise.all([
    Promise.all(r),
    Promise.all(o),
    Promise.all(l)
  ]).then(function(c) {
    const d = c[0], u = c[1], h = c[2];
    return n && (i.morphAttributes.position = d), s && (i.morphAttributes.normal = u), a && (i.morphAttributes.color = h), i.morphTargetsRelative = !0, i;
  });
}
function Sb(i, e) {
  if (i.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, n = e.weights.length; t < n; t++)
      i.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (i.morphTargetInfluences.length === t.length) {
      i.morphTargetDictionary = {};
      for (let n = 0, s = t.length; n < s; n++)
        i.morphTargetDictionary[t[n]] = n;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function vb(i) {
  let e;
  const t = i.extensions && i.extensions[Xe.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + Yr(t.attributes) : e = i.indices + ":" + Yr(i.attributes) + ":" + i.mode, i.targets !== void 0)
    for (let n = 0, s = i.targets.length; n < s; n++)
      e += ":" + Yr(i.targets[n]);
  return e;
}
function Yr(i) {
  let e = "";
  const t = Object.keys(i).sort();
  for (let n = 0, s = t.length; n < s; n++)
    e += t[n] + ":" + i[t[n]] + ";";
  return e;
}
function Oo(i) {
  switch (i) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function xb(i) {
  return i.search(/\.jpe?g($|\?)/i) > 0 || i.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : i.search(/\.webp($|\?)/i) > 0 || i.search(/^data\:image\/webp/) === 0 ? "image/webp" : i.search(/\.ktx2($|\?)/i) > 0 || i.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
const _b = new Ue();
class wb {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new KC(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let n = !1, s = -1, a = !1, r = -1;
    if (typeof navigator < "u" && typeof navigator.userAgent < "u") {
      const o = navigator.userAgent;
      n = /^((?!chrome|android).)*safari/i.test(o) === !0;
      const l = o.match(/Version\/(\d+)/);
      s = n && l ? parseInt(l[1], 10) : -1, a = o.indexOf("Firefox") > -1, r = a ? o.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || n && s < 17 || a && r < 98 ? this.textureLoader = new Kg(this.options.manager) : this.textureLoader = new tp(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new ah(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this, s = this.json, a = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(r) {
      return r._markDefs && r._markDefs();
    }), Promise.all(this._invokeAll(function(r) {
      return r.beforeRoot && r.beforeRoot();
    })).then(function() {
      return Promise.all([
        n.getDependencies("scene"),
        n.getDependencies("animation"),
        n.getDependencies("camera")
      ]);
    }).then(function(r) {
      const o = {
        scene: r[0][s.scene || 0],
        scenes: r[0],
        animations: r[1],
        cameras: r[2],
        asset: s.asset,
        parser: n,
        userData: {}
      };
      return Ci(a, o, s), xn(o, s), Promise.all(n._invokeAll(function(l) {
        return l.afterRoot && l.afterRoot(o);
      })).then(function() {
        for (const l of o.scenes)
          l.updateMatrixWorld();
        e(o);
      });
    }).catch(t);
  }

  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
    for (let s = 0, a = t.length; s < a; s++) {
      const r = t[s].joints;
      for (let o = 0, l = r.length; o < l; o++)
        e[r[o]].isBone = !0;
    }
    for (let s = 0, a = e.length; s < a; s++) {
      const r = e[s];
      r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
    }
  }

  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }

  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1) return n;
    const s = n.clone(), a = (r, o) => {
      const l = this.associations.get(r);
      l != null && this.associations.set(o, l);
      for (const [c, d] of r.children.entries())
        a(d, o.children[c]);
    };
    return a(n, s), s.name += "_instance_" + e.uses[t]++, s;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const s = e(t[n]);
      if (s) return s;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let s = 0; s < t.length; s++) {
      const a = e(t[s]);
      a && n.push(a);
    }
    return n;
  }

  getDependency(e, t) {
    const n = e + ":" + t;
    let s = this.cache.get(n);
    if (!s) {
      switch (e) {
        case "scene":
          s = this.loadScene(t);
          break;
        case "node":
          s = this._invokeOne(function(a) {
            return a.loadNode && a.loadNode(t);
          });
          break;
        case "mesh":
          s = this._invokeOne(function(a) {
            return a.loadMesh && a.loadMesh(t);
          });
          break;
        case "accessor":
          s = this.loadAccessor(t);
          break;
        case "bufferView":
          s = this._invokeOne(function(a) {
            return a.loadBufferView && a.loadBufferView(t);
          });
          break;
        case "buffer":
          s = this.loadBuffer(t);
          break;
        case "material":
          s = this._invokeOne(function(a) {
            return a.loadMaterial && a.loadMaterial(t);
          });
          break;
        case "texture":
          s = this._invokeOne(function(a) {
            return a.loadTexture && a.loadTexture(t);
          });
          break;
        case "skin":
          s = this.loadSkin(t);
          break;
        case "animation":
          s = this._invokeOne(function(a) {
            return a.loadAnimation && a.loadAnimation(t);
          });
          break;
        case "camera":
          s = this.loadCamera(t);
          break;
        default:
          if (s = this._invokeOne(function(a) {
            return a != this && a.getDependency && a.getDependency(e, t);
          }), !s)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(n, s);
    }
    return s;
  }

  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const n = this, s = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(s.map(function(a, r) {
        return n.getDependency(e, r);
      })), this.cache.add(e, t);
    }
    return t;
  }

  loadBuffer(e) {
    const t = this.json.buffers[e], n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[Xe.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function(a, r) {
      n.load(Ns.resolveURL(t.uri, s.path), a, void 0, function() {
        r(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }

  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(n) {
      const s = t.byteLength || 0, a = t.byteOffset || 0;
      return n.slice(a, a + s);
    });
  }

  loadAccessor(e) {
    const t = this, n = this.json, s = this.json.accessors[e];
    if (s.bufferView === void 0 && s.sparse === void 0) {
      const r = Pr[s.type], o = Qi[s.componentType], l = s.normalized === !0, c = new o(s.count * r);
      return Promise.resolve(new zt(c, r, l));
    }
    const a = [];
    return s.bufferView !== void 0 ? a.push(this.getDependency("bufferView", s.bufferView)) : a.push(null), s.sparse !== void 0 && (a.push(this.getDependency("bufferView", s.sparse.indices.bufferView)), a.push(this.getDependency("bufferView", s.sparse.values.bufferView))), Promise.all(a).then(function(r) {
      const o = r[0], l = Pr[s.type], c = Qi[s.componentType], d = c.BYTES_PER_ELEMENT, u = d * l, h = s.byteOffset || 0, g = s.bufferView !== void 0 ? n.bufferViews[s.bufferView].byteStride : void 0, m = s.normalized === !0;
      let A, f;
      if (g && g !== u) {
        const p = Math.floor(h / g), b = "InterleavedBuffer:" + s.bufferView + ":" + s.componentType + ":" + p + ":" + s.count;
        let v = t.cache.get(b);
        v || (A = new c(o, p * g, s.count * g / d), v = new Jd(A, g / d), t.cache.add(b, v)), f = new Xs(v, l, h % g / d, m);
      } else
        o === null ? A = new c(s.count * l) : A = new c(o, h, s.count * l), f = new zt(A, l, m);
      if (s.sparse !== void 0) {
        const p = Pr.SCALAR, b = Qi[s.sparse.indices.componentType], v = s.sparse.indices.byteOffset || 0, S = s.sparse.values.byteOffset || 0, R = new b(r[1], v, s.sparse.count * p), x = new c(r[2], S, s.sparse.count * l);
        o !== null && (f = new zt(f.array.slice(), f.itemSize, f.normalized)), f.normalized = !1;
        for (let G = 0, C = R.length; G < C; G++) {
          const w = R[G];
          if (f.setX(w, x[G * l]), l >= 2 && f.setY(w, x[G * l + 1]), l >= 3 && f.setZ(w, x[G * l + 2]), l >= 4 && f.setW(w, x[G * l + 3]), l >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        f.normalized = m;
      }
      return f;
    });
  }

  loadTexture(e) {
    const t = this.json, n = this.options, a = t.textures[e].source, r = t.images[a];
    let o = this.textureLoader;
    if (r.uri) {
      const l = n.manager.getHandler(r.uri);
      l !== null && (o = l);
    }
    return this.loadTextureImage(e, a, o);
  }
  loadTextureImage(e, t, n) {
    const s = this, a = this.json, r = a.textures[e], o = a.images[t], l = (o.uri || o.bufferView) + ":" + r.sampler;
    if (this.textureCache[l])
      return this.textureCache[l];
    const c = this.loadImageSource(t, n).then(function(d) {
      d.flipY = !1, d.name = r.name || o.name || "", d.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (d.name = o.uri);
      const h = (a.samplers || {})[r.sampler] || {};
      return d.magFilter = od[h.magFilter] || Mt, d.minFilter = od[h.minFilter] || Hn, d.wrapS = ld[h.wrapS] || es, d.wrapT = ld[h.wrapT] || es, d.generateMipmaps = !d.isCompressedTexture && d.minFilter !== Rt && d.minFilter !== Mt, s.associations.set(d, { textures: e }), d;
    }).catch(function() {
      return null;
    });
    return this.textureCache[l] = c, c;
  }
  loadImageSource(e, t) {
    const n = this, s = this.json, a = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((u) => u.clone());
    const r = s.images[e], o = self.URL || self.webkitURL;
    let l = r.uri || "", c = !1;
    if (r.bufferView !== void 0)
      l = n.getDependency("bufferView", r.bufferView).then(function(u) {
        c = !0;
        const h = new Blob([u], { type: r.mimeType });
        return l = o.createObjectURL(h), l;
      });
    else if (r.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const d = Promise.resolve(l).then(function(u) {
      return new Promise(function(h, g) {
        let m = h;
        t.isImageBitmapLoader === !0 && (m = function(A) {
          const f = new Gt(A);
          f.needsUpdate = !0, h(f);
        }), t.load(Ns.resolveURL(u, a.path), m, void 0, g);
      });
    }).then(function(u) {
      return c === !0 && o.revokeObjectURL(l), xn(u, r), u.userData.mimeType = r.mimeType || xb(r.uri), u;
    }).catch(function(u) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", l), u;
    });
    return this.sourceCache[e] = d, d;
  }

  assignTexture(e, t, n, s) {
    const a = this;
    return this.getDependency("texture", n.index).then(function(r) {
      if (!r) return null;
      if (n.texCoord !== void 0 && n.texCoord > 0 && (r = r.clone(), r.channel = n.texCoord), a.extensions[Xe.KHR_TEXTURE_TRANSFORM]) {
        const o = n.extensions !== void 0 ? n.extensions[Xe.KHR_TEXTURE_TRANSFORM] : void 0;
        if (o) {
          const l = a.associations.get(r);
          r = a.extensions[Xe.KHR_TEXTURE_TRANSFORM].extendTexture(r, o), a.associations.set(r, l);
        }
      }
      return s !== void 0 && (r.colorSpace = s), e[t] = r, r;
    });
  }

  assignFinalMaterial(e) {
    const t = e.geometry;
    let n = e.material;
    const s = t.attributes.tangent === void 0, a = t.attributes.color !== void 0, r = t.attributes.normal === void 0;
    if (e.isPoints) {
      const o = "PointsMaterial:" + n.uuid;
      let l = this.cache.get(o);
      l || (l = new $d(), In.prototype.copy.call(l, n), l.color.copy(n.color), l.map = n.map, l.sizeAttenuation = !1, this.cache.add(o, l)), n = l;
    } else if (e.isLine) {
      const o = "LineBasicMaterial:" + n.uuid;
      let l = this.cache.get(o);
      l || (l = new dl(), In.prototype.copy.call(l, n), l.color.copy(n.color), l.map = n.map, this.cache.add(o, l)), n = l;
    }
    if (s || a || r) {
      let o = "ClonedMaterial:" + n.uuid + ":";
      s && (o += "derivative-tangents:"), a && (o += "vertex-colors:"), r && (o += "flat-shading:");
      let l = this.cache.get(o);
      l || (l = n.clone(), a && (l.vertexColors = !0), r && (l.flatShading = !0), s && (l.normalScale && (l.normalScale.y *= -1), l.clearcoatNormalScale && (l.clearcoatNormalScale.y *= -1)), this.cache.add(o, l), this.associations.set(l, this.associations.get(n))), n = l;
    }
    e.material = n;
  }
  getMaterialType() {
    return Zt;
  }

  loadMaterial(e) {
    const t = this, n = this.json, s = this.extensions, a = n.materials[e];
    let r;
    const o = {}, l = a.extensions || {}, c = [];
    if (l[Xe.KHR_MATERIALS_UNLIT]) {
      const u = s[Xe.KHR_MATERIALS_UNLIT];
      r = u.getMaterialType(), c.push(u.extendParams(o, a, t));
    } else {
      const u = a.pbrMetallicRoughness || {};
      if (o.color = new Me(1, 1, 1), o.opacity = 1, Array.isArray(u.baseColorFactor)) {
        const h = u.baseColorFactor;
        o.color.setRGB(h[0], h[1], h[2], tn), o.opacity = h[3];
      }
      u.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", u.baseColorTexture, wt)), o.metalness = u.metallicFactor !== void 0 ? u.metallicFactor : 1, o.roughness = u.roughnessFactor !== void 0 ? u.roughnessFactor : 1, u.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", u.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", u.metallicRoughnessTexture))), r = this._invokeOne(function(h) {
        return h.getMaterialType && h.getMaterialType(e);
      }), c.push(Promise.all(this._invokeAll(function(h) {
        return h.extendMaterialParams && h.extendMaterialParams(e, o);
      })));
    }
    a.doubleSided === !0 && (o.side = Rn);
    const d = a.alphaMode || kr.OPAQUE;
    if (d === kr.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, d === kr.MASK && (o.alphaTest = a.alphaCutoff !== void 0 ? a.alphaCutoff : 0.5)), a.normalTexture !== void 0 && r !== Dt && (c.push(t.assignTexture(o, "normalMap", a.normalTexture)), o.normalScale = new Te(1, 1), a.normalTexture.scale !== void 0)) {
      const u = a.normalTexture.scale;
      o.normalScale.set(u, u);
    }
    if (a.occlusionTexture !== void 0 && r !== Dt && (c.push(t.assignTexture(o, "aoMap", a.occlusionTexture)), a.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = a.occlusionTexture.strength)), a.emissiveFactor !== void 0 && r !== Dt) {
      const u = a.emissiveFactor;
      o.emissive = new Me().setRGB(u[0], u[1], u[2], tn);
    }
    return a.emissiveTexture !== void 0 && r !== Dt && c.push(t.assignTexture(o, "emissiveMap", a.emissiveTexture, wt)), Promise.all(c).then(function() {
      const u = new r(o);
      return a.name && (u.name = a.name), xn(u, a), t.associations.set(u, { materials: e }), a.extensions && Ci(s, u, a), u;
    });
  }

  createUniqueName(e) {
    const t = $e.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }

  loadGeometries(e) {
    const t = this, n = this.extensions, s = this.primitiveCache;
    function a(o) {
      return n[Xe.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o, t).then(function(l) {
        return cd(l, o, t);
      });
    }
    const r = [];
    for (let o = 0, l = e.length; o < l; o++) {
      const c = e[o], d = vb(c), u = s[d];
      if (u)
        r.push(u.promise);
      else {
        let h;
        c.extensions && c.extensions[Xe.KHR_DRACO_MESH_COMPRESSION] ? h = a(c) : h = cd(new yt(), c, t), s[d] = { primitive: c, promise: h }, r.push(h);
      }
    }
    return Promise.all(r);
  }

  loadMesh(e) {
    const t = this, n = this.json, s = this.extensions, a = n.meshes[e], r = a.primitives, o = [];
    for (let l = 0, c = r.length; l < c; l++) {
      const d = r[l].material === void 0 ? Ab(this.cache) : this.getDependency("material", r[l].material);
      o.push(d);
    }
    return o.push(t.loadGeometries(r)), Promise.all(o).then(function(l) {
      const c = l.slice(0, l.length - 1), d = l[l.length - 1], u = [];
      for (let g = 0, m = d.length; g < m; g++) {
        const A = d[g], f = r[g];
        let p;
        const b = c[g];
        if (f.mode === rn.TRIANGLES || f.mode === rn.TRIANGLE_STRIP || f.mode === rn.TRIANGLE_FAN || f.mode === void 0)
          p = a.isSkinnedMesh === !0 ? new Cg(A, b) : new ve(A, b), p.isSkinnedMesh === !0 && p.normalizeSkinWeights(), f.mode === rn.TRIANGLE_STRIP ? p.geometry = sd(p.geometry, Xd) : f.mode === rn.TRIANGLE_FAN && (p.geometry = sd(p.geometry, Vo));
        else if (f.mode === rn.LINES)
          p = new qd(A, b);
        else if (f.mode === rn.LINE_STRIP)
          p = new hl(A, b);
        else if (f.mode === rn.LINE_LOOP)
          p = new _g(A, b);
        else if (f.mode === rn.POINTS)
          p = new wg(A, b);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + f.mode);
        Object.keys(p.geometry.morphAttributes).length > 0 && Sb(p, a), p.name = t.createUniqueName(a.name || "mesh_" + e), xn(p, a), f.extensions && Ci(s, p, f), t.assignFinalMaterial(p), u.push(p);
      }
      for (let g = 0, m = u.length; g < m; g++)
        t.associations.set(u[g], {
          meshes: e,
          primitives: g
        });
      if (u.length === 1)
        return a.extensions && Ci(s, u[0], a), u[0];
      const h = new ht();
      a.extensions && Ci(s, h, a), t.associations.set(h, { meshes: e });
      for (let g = 0, m = u.length; g < m; g++)
        h.add(u[g]);
      return h;
    });
  }

  loadCamera(e) {
    let t;
    const n = this.json.cameras[e], s = n[n.type];
    if (!s) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return n.type === "perspective" ? t = new Yt(ju.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6) : n.type === "orthographic" && (t = new Qa(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)), n.name && (t.name = this.createUniqueName(n.name)), xn(t, n), Promise.resolve(t);
  }

  loadSkin(e) {
    const t = this.json.skins[e], n = [];
    for (let s = 0, a = t.joints.length; s < a; s++)
      n.push(this._loadNodeShallow(t.joints[s]));
    return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(s) {
      const a = s.pop(), r = s, o = [], l = [];
      for (let c = 0, d = r.length; c < d; c++) {
        const u = r[c];
        if (u) {
          o.push(u);
          const h = new Ue();
          a !== null && h.fromArray(a.array, c * 16), l.push(h);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new ll(o, l);
    });
  }

  loadAnimation(e) {
    const t = this.json, n = this, s = t.animations[e], a = s.name ? s.name : "animation_" + e, r = [], o = [], l = [], c = [], d = [];
    for (let u = 0, h = s.channels.length; u < h; u++) {
      const g = s.channels[u], m = s.samplers[g.sampler], A = g.target, f = A.node, p = s.parameters !== void 0 ? s.parameters[m.input] : m.input, b = s.parameters !== void 0 ? s.parameters[m.output] : m.output;
      A.node !== void 0 && (r.push(this.getDependency("node", f)), o.push(this.getDependency("accessor", p)), l.push(this.getDependency("accessor", b)), c.push(m), d.push(A));
    }
    return Promise.all([
      Promise.all(r),
      Promise.all(o),
      Promise.all(l),
      Promise.all(c),
      Promise.all(d)
    ]).then(function(u) {
      const h = u[0], g = u[1], m = u[2], A = u[3], f = u[4], p = [];
      for (let v = 0, S = h.length; v < S; v++) {
        const R = h[v], x = g[v], G = m[v], C = A[v], w = f[v];
        if (R === void 0) continue;
        R.updateMatrix && R.updateMatrix();
        const T = n._createAnimationTracks(R, x, G, C, w);
        if (T)
          for (let M = 0; M < T.length; M++)
            p.push(T[M]);
      }
      const b = new Hg(a, void 0, p);
      return xn(b, s), b;
    });
  }
  createNodeMesh(e) {
    const t = this.json, n = this, s = t.nodes[e];
    return s.mesh === void 0 ? null : n.getDependency("mesh", s.mesh).then(function(a) {
      const r = n._getNodeRef(n.meshCache, s.mesh, a);
      return s.weights !== void 0 && r.traverse(function(o) {
        if (o.isMesh)
          for (let l = 0, c = s.weights.length; l < c; l++)
            o.morphTargetInfluences[l] = s.weights[l];
      }), r;
    });
  }

  loadNode(e) {
    const t = this.json, n = this, s = t.nodes[e], a = n._loadNodeShallow(e), r = [], o = s.children || [];
    for (let c = 0, d = o.length; c < d; c++)
      r.push(n.getDependency("node", o[c]));
    const l = s.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", s.skin);
    return Promise.all([
      a,
      Promise.all(r),
      l
    ]).then(function(c) {
      const d = c[0], u = c[1], h = c[2];
      h !== null && d.traverse(function(g) {
        g.isSkinnedMesh && g.bind(h, _b);
      });
      for (let g = 0, m = u.length; g < m; g++)
        d.add(u[g]);
      if (d.userData.pivot !== void 0 && u.length > 0) {
        const g = d.userData.pivot, m = u[0];
        d.pivot = new N().fromArray(g), d.position.x -= g[0], d.position.y -= g[1], d.position.z -= g[2], m.position.set(0, 0, 0), delete d.userData.pivot;
      }
      return d;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, n = this.extensions, s = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const a = t.nodes[e], r = a.name ? s.createUniqueName(a.name) : "", o = [], l = s._invokeOne(function(c) {
      return c.createNodeMesh && c.createNodeMesh(e);
    });
    return l && o.push(l), a.camera !== void 0 && o.push(s.getDependency("camera", a.camera).then(function(c) {
      return s._getNodeRef(s.cameraCache, a.camera, c);
    })), s._invokeAll(function(c) {
      return c.createNodeAttachment && c.createNodeAttachment(e);
    }).forEach(function(c) {
      o.push(c);
    }), this.nodeCache[e] = Promise.all(o).then(function(c) {
      let d;
      if (a.isBone === !0 ? d = new Qd() : c.length > 1 ? d = new ht() : c.length === 1 ? d = c[0] : d = new dt(), d !== c[0])
        for (let u = 0, h = c.length; u < h; u++)
          d.add(c[u]);
      if (a.name && (d.userData.name = a.name, d.name = r), xn(d, a), a.extensions && Ci(n, d, a), a.matrix !== void 0) {
        const u = new Ue();
        u.fromArray(a.matrix), d.applyMatrix4(u);
      } else
        a.translation !== void 0 && d.position.fromArray(a.translation), a.rotation !== void 0 && d.quaternion.fromArray(a.rotation), a.scale !== void 0 && d.scale.fromArray(a.scale);
      if (!s.associations.has(d))
        s.associations.set(d, {});
      else if (a.mesh !== void 0 && s.meshCache.refs[a.mesh] > 1) {
        const u = s.associations.get(d);
        s.associations.set(d, { ...u });
      }
      return s.associations.get(d).nodes = e, d;
    }), this.nodeCache[e];
  }

  loadScene(e) {
    const t = this.extensions, n = this.json.scenes[e], s = this, a = new ht();
    n.name && (a.name = s.createUniqueName(n.name)), xn(a, n), n.extensions && Ci(t, a, n);
    const r = n.nodes || [], o = [];
    for (let l = 0, c = r.length; l < c; l++)
      o.push(s.getDependency("node", r[l]));
    return Promise.all(o).then(function(l) {
      for (let d = 0, u = l.length; d < u; d++) {
        const h = l[d];
        h.parent !== null ? a.add(OC(h)) : a.add(h);
      }
      const c = (d) => {
        const u = /* @__PURE__ */ new Map();
        for (const [h, g] of s.associations)
          (h instanceof In || h instanceof Gt) && u.set(h, g);
        return d.traverse((h) => {
          const g = s.associations.get(h);
          g != null && u.set(h, g);
        }), u;
      };
      return s.associations = c(a), a;
    });
  }
  _createAnimationTracks(e, t, n, s, a) {
    const r = [], o = e.name ? e.name : e.uuid, l = [];
    function c(g) {
      g.morphTargetInfluences && l.push(g.name ? g.name : g.uuid);
    }
    li[a.path] === li.weights ? (c(e), e.isGroup && e.children.forEach(c)) : l.push(o);
    let d;
    switch (li[a.path]) {
      case li.weights:
        d = ss;
        break;
      case li.rotation:
        d = as;
        break;
      case li.translation:
      case li.scale:
        d = rs;
        break;
      default:
        n.itemSize === 1 ? d = ss : d = rs;
        break;
    }
    const u = s.interpolation !== void 0 ? bb[s.interpolation] : Ls, h = this._getArrayFromAccessor(n);
    for (let g = 0, m = l.length; g < m; g++) {
      const A = new d(
        l[g] + "." + li[a.path],
        t.array,
        h,
        u
      );
      s.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(A), r.push(A);
    }
    return r;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = Oo(t.constructor), s = new Float32Array(t.length);
      for (let a = 0, r = t.length; a < r; a++)
        s[a] = t[a] * n;
      t = s;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(n) {
      const s = this instanceof as ? Cb : Ch;
      return new s(this.times, this.values, this.getValueSize() / 3, n);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function Rb(i, e, t) {
  const n = e.attributes, s = new Qn();
  if (n.POSITION !== void 0) {
    const o = t.json.accessors[n.POSITION], l = o.min, c = o.max;
    if (l !== void 0 && c !== void 0) {
      if (s.set(
        new N(l[0], l[1], l[2]),
        new N(c[0], c[1], c[2])
      ), o.normalized) {
        const d = Oo(Qi[o.componentType]);
        s.min.multiplyScalar(d), s.max.multiplyScalar(d);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const a = e.targets;
  if (a !== void 0) {
    const o = new N(), l = new N();
    for (let c = 0, d = a.length; c < d; c++) {
      const u = a[c];
      if (u.POSITION !== void 0) {
        const h = t.json.accessors[u.POSITION], g = h.min, m = h.max;
        if (g !== void 0 && m !== void 0) {
          if (l.setX(Math.max(Math.abs(g[0]), Math.abs(m[0]))), l.setY(Math.max(Math.abs(g[1]), Math.abs(m[1]))), l.setZ(Math.max(Math.abs(g[2]), Math.abs(m[2]))), h.normalized) {
            const A = Oo(Qi[h.componentType]);
            l.multiplyScalar(A);
          }
          o.max(l);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    s.expandByVector(o);
  }
  i.boundingBox = s;
  const r = new En();
  s.getCenter(r.center), r.radius = s.min.distanceTo(s.max) / 2, i.boundingSphere = r;
}
function cd(i, e, t) {
  const n = e.attributes, s = [];
  function a(r, o) {
    return t.getDependency("accessor", r).then(function(l) {
      i.setAttribute(o, l);
    });
  }
  for (const r in n) {
    const o = zo[r] || r.toLowerCase();
    o in i.attributes || s.push(a(n[r], o));
  }
  if (e.indices !== void 0 && !i.index) {
    const r = t.getDependency("accessor", e.indices).then(function(o) {
      i.setIndex(o);
    });
    s.push(r);
  }
  return Pe.workingColorSpace !== tn && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Pe.workingColorSpace}" not supported.`), xn(i, e), Rb(i, e, t), Promise.all(s).then(function() {
    return e.targets !== void 0 ? yb(i, e.targets, t) : i;
  });
}
const Mb = new URL(
  /* @vite-ignore */
  "../asset-manifest.json",
  import.meta.url
);
async function Gb() {
  const i = [];
  let e = null;
  const t = /* @__PURE__ */ new Map();
  try {
    const s = await fetch(Mb, { cache: "force-cache" });
    if (!s.ok) throw new Error(`V3 asset manifest failed with ${s.status}`);
    e = await s.json();
  } catch (s) {
    return console.warn("[Envelope V3] Using procedural art fallbacks; manifest failed to load.", s), dd(null, t, ["asset-manifest"]);
  }
  const n = new JC();
  return await Promise.all(
    e.assets.map(async (s) => {
      try {
        const a = new URL((/* @__PURE__ */ Object.assign({ "../audio.ts": LC, "../content.ts": UC, "../index.ts": DC, "../leaderboard.ts": XC, "../main.ts": HC, "../render.ts": PC, "../rng.ts": kC, "../simulation.ts": YC, "../types.ts": zC }))[`../${s.path}`], import.meta.url).href, r = await n.loadAsync(a);
        Tb(r.scene), t.set(s.key, r.scene);
      } catch (a) {
        i.push(s.key), console.warn(`[Envelope V3] Using procedural fallback for ${s.key}.`, a);
      }
    })
  ), dd(e, t, i);
}
function dd(i, e, t) {
  return {
    manifest: i,
    missingKeys: t,
    instantiate(n) {
      const s = e.get(n);
      if (!s) return null;
      const a = s.clone(!0);
      return a.traverse((r) => {
        const o = r;
        if (!o.isMesh) return;
        o.castShadow = !0, o.receiveShadow = !0;
        const l = o.material;
        Array.isArray(l) ? l.forEach((c) => Ha(c)) : Ha(l);
      }), a;
    }
  };
}
function Tb(i) {
  i.traverse((e) => {
    const t = e;
    if (!t.isMesh) return;
    t.castShadow = !0, t.receiveShadow = !0;
    const n = t.material;
    Array.isArray(n) ? n.forEach((s) => Ha(s)) : Ha(n);
  });
}
function Ha(i) {
  if (!i) return;
  const e = i;
  e.color && e.color.convertSRGBToLinear(), e.needsUpdate = !0;
}
function Zb(i = {}) {
  if (typeof document > "u")
    return { ok: !1, reason: "Envelope Escape V3 needs a browser document to create the WebGL chamber." };
  const e = Math.max(0, Math.floor(i.minWidth ?? 900)), t = window.matchMedia?.("(pointer: coarse)")?.matches || !1;
  if (!i.allowCoarsePointer && (t || window.innerWidth < e))
    return { ok: !1, reason: "Envelope Escape V3 is currently gated to desktop-class pointer and viewport settings." };
  const n = document.createElement("canvas");
  try {
    if (n.getContext("webgl2", hd())) return { ok: !0, context: "webgl2" };
    if (n.getContext("webgl", hd())) return { ok: !0, context: "webgl" };
  } catch (s) {
    return { ok: !1, reason: s instanceof Error ? s.message : "WebGL detection failed." };
  }
  return { ok: !1, reason: "WebGL is disabled, unavailable, or blocked by this browser's graphics policy." };
}
function hd() {
  return {
    alpha: !1,
    antialias: !0,
    depth: !0,
    powerPreference: "high-performance"
  };
}
const ud = "envelope-game-v3-css", Bb = "assets/css/envelope-game-v3.css", Nb = {
  mode: "procedural-three-primitives"
};
let Ot = null;
function bh(i = Bb) {
  if (document.getElementById(ud)) return;
  const e = document.createElement("link");
  e.id = ud, e.rel = "stylesheet", e.href = i, document.head.append(e);
}
function Eb(i = "WebGL did not initialize.") {
  bh(), Ot?.remove(), Ot = document.createElement("dialog"), Ot.className = "envelope-v3-modal envelope-v3-fallback-modal", Ot.setAttribute("aria-labelledby", "envelope-v3-fallback-title"), Ot.innerHTML = `
    <div class="envelope-v3-shell">
      <header class="envelope-v3-topbar">
        <div>
          <p class="envelope-v3-eyebrow">Hidden Lab Arcade</p>
          <h2 id="envelope-v3-fallback-title">Envelope Escape V3: WebGL Fallback</h2>
        </div>
        <div class="envelope-v3-actions">
          <button data-v3-fallback-close type="button" aria-label="Close fallback notice">Close</button>
        </div>
      </header>
      <main class="envelope-v3-layout is-fallback-only">
        <section class="envelope-v3-stage">
          <section class="envelope-v3-fallback">
            <p class="envelope-v3-kicker">3D chamber unavailable</p>
            <h3>V3 is mounted, but the renderer is gated on this device.</h3>
            <p>${gd(i)}</p>
            <p>The shipped fallback path keeps integration visible while the production bundle uses the ${gd(Nb.mode)} renderer or future GLB assets.</p>
          </section>
        </section>
      </main>
    </div>
  `, document.body.append(Ot), Ot.querySelector("[data-v3-fallback-close]")?.addEventListener("click", () => {
    Ot?.close();
  }), Ot.addEventListener("close", () => {
    Ot?.remove(), Ot = null;
  }), typeof Ot.showModal == "function" ? Ot.showModal() : Ot.setAttribute("open", "");
}
function gd(i) {
  return String(i ?? "").replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
const Fb = "America/New_York", pd = "bernhardt-envelope-escape-v3-name", fd = "bernhardt-envelope-escape-v3-motion";
let wn = null;
async function Xb(i = {}) {
  bh();
  const e = Zb();
  if (!i.force && !e.ok)
    return Eb(e.reason), { ok: !1, reason: e.reason };
  if (wn)
    return wn.open(), { ok: !0, controller: wn };
  const t = await Gb();
  return wn = new Wb(i, t), wn.open(), { ok: !0, controller: wn };
}
function Hb() {
  wn?.destroy(), wn = null;
}
class Wb {
  dialog;
  refs;
  sim = new Uh();
  input = Vh();
  audio = Zh();
  leaderboard = Kh({ url: String(window.ENVELOPE_LEADERBOARD_URL || "") });
  renderer;
  resizeObserver;
  seenEffects = /* @__PURE__ */ new Set();
  frame = 0;
  lastTime = performance.now();
  reportRendered = !1;
  upgradesRenderedKey = "";
  constructor(e, t) {
    this.dialog = Vb(), this.refs = Lb(this.dialog), this.renderer = fC(this.refs.gameRoot, t), this.resizeObserver = new ResizeObserver(() => this.renderer.resize()), this.resizeObserver.observe(this.refs.gameRoot), Ub(this.refs.species), this.refs.name.value = bd(pd), this.refs.motion.value = bd(fd) || "full", this.bind(), this.renderMenu(), e.mode && this.startRun(e.mode, e.speciesId || this.refs.species.value);
  }
  open() {
    this.dialog.open || this.dialog.showModal(), this.renderer.resize(), this.loop(), this.refreshScores("classic");
  }
  destroy() {
    cancelAnimationFrame(this.frame), window.removeEventListener("keydown", this.onKeyDown), window.removeEventListener("keyup", this.onKeyUp), this.resizeObserver.disconnect(), this.renderer.dispose(), this.dialog.remove(), wn === this && (wn = null);
  }
  bind() {
    this.refs.close.addEventListener("click", () => this.dialog.close()), this.dialog.addEventListener("close", () => this.destroy()), this.refs.name.addEventListener("input", () => Ad(pd, this.refs.name.value)), this.refs.motion.addEventListener("change", () => {
      Ad(fd, this.refs.motion.value), this.dialog.classList.toggle("is-calm-motion", this.refs.motion.value !== "full");
    }), this.refs.sound.addEventListener("click", () => {
      this.audio.setEnabled(!this.audio.enabled), this.refs.sound.textContent = this.audio.enabled ? "Sound On" : "Sound Off", this.refs.sound.setAttribute("aria-pressed", String(this.audio.enabled));
    }), this.refs.classic.addEventListener("click", () => this.startRun("classic", this.refs.species.value)), this.refs.daily.addEventListener("click", () => this.startRun("daily", this.refs.species.value)), this.refs.pause.addEventListener("click", () => {
      this.sim.togglePause(), this.renderState();
    }), this.refs.restart.addEventListener("click", () => this.startRun(this.sim.state.mode, this.sim.state.selectedSpeciesId)), this.refs.refreshScores.addEventListener("click", () => {
      this.refreshScores(this.sim.state.board);
    }), this.refs.submitScore.addEventListener("click", () => {
      this.submitScore();
    }), this.refs.commandButtons.forEach((e) => {
      e.addEventListener("click", () => this.triggerCommand(e.dataset.command));
    }), window.addEventListener("keydown", this.onKeyDown), window.addEventListener("keyup", this.onKeyUp);
  }
  onKeyDown = (e) => {
    if (!(!this.dialog.open || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)) {
      if (this.sim.state.status === "upgrade") {
        const t = ["1", "2", "3"].indexOf(e.key);
        t >= 0 && (e.preventDefault(), this.chooseUpgradeByIndex(t));
        return;
      }
      Cd(this.input, e, !0) && e.preventDefault(), e.key === "1" && this.triggerCommand("pg"), e.key === "2" && this.triggerCommand("membrane"), e.key === "3" && this.triggerCommand("phage"), e.key === "4" && this.triggerCommand("motility"), (e.key.toLowerCase() === "p" || e.key === "Escape") && (e.preventDefault(), this.sim.togglePause(), this.renderState());
    }
  };
  onKeyUp = (e) => {
    Cd(this.input, e, !1) && e.preventDefault();
  };
  startRun(e, t) {
    this.reportRendered = !1, this.upgradesRenderedKey = "", this.seenEffects.clear(), this.sim.start({ mode: e, speciesId: t, playerName: this.refs.name.value }), this.sim.beginRun(), this.dialog.classList.add("is-playing"), this.dialog.classList.remove("is-ended", "is-upgrade"), Ji(this.refs.menu), Ji(this.refs.report), Ji(this.refs.upgrades), this.audio.play("phase"), this.refreshScores(this.sim.state.board), this.renderState();
  }
  triggerCommand(e) {
    this.sim.triggerCommand(e) && (this.input.commandWheel = !1, this.audio.play("command"), this.renderState());
  }
  loop = () => {
    const e = performance.now(), t = Math.min(0.05, Math.max(0, (e - this.lastTime) / 1e3));
    this.lastTime = e, this.sim.setCommandWheel(this.input.commandWheel), this.sim.update(this.input, t), this.renderer.update(this.sim.state, t), this.playNewEffects(), this.renderState(), this.frame = requestAnimationFrame(this.loop);
  };
  renderState() {
    const e = this.sim.hud();
    Db(this.refs, e), this.dialog.classList.toggle("is-commanding", this.sim.state.status === "command"), this.dialog.classList.toggle("is-upgrade", this.sim.state.status === "upgrade"), this.dialog.classList.toggle("is-paused", this.sim.state.status === "paused"), this.refs.pause.textContent = this.sim.state.status === "paused" ? "Resume" : "Pause", this.refs.commandButtons.forEach((t) => {
      const n = this.sim.state.commandCharge >= 100 && (this.sim.state.status === "running" || this.sim.state.status === "command");
      t.disabled = !n, t.classList.toggle("is-ready", n);
    }), this.sim.state.status === "upgrade" && this.renderUpgrades(), this.sim.state.status === "ended" && !this.reportRendered && this.renderReport(this.sim.report());
  }
  renderMenu() {
    this.dialog.classList.remove("is-playing", "is-ended", "is-upgrade", "is-paused"), zr(this.refs.menu), Ji(this.refs.upgrades), Ji(this.refs.report), Id(this.refs, this.refs.species.value), this.refs.species.addEventListener("change", () => Id(this.refs, this.refs.species.value));
  }
  renderUpgrades() {
    zr(this.refs.upgrades);
    const e = this.sim.state.upgradeChoices.join("|");
    e && e === this.upgradesRenderedKey && this.refs.upgradesList.children.length > 0 || (this.upgradesRenderedKey = e, this.refs.upgradesList.innerHTML = "", this.sim.state.upgradeChoices.forEach((t, n) => {
      const s = Na[t], a = document.createElement("button");
      a.type = "button", a.className = "envelope-v3-upgrade-card", a.innerHTML = `<span>${n + 1} | ${on(s.command || "system")}</span><strong>${on(s.title)}</strong><p>${on(s.copy)}</p>`, a.addEventListener("click", () => this.chooseUpgrade(t)), this.refs.upgradesList.append(a);
    }));
  }
  chooseUpgradeByIndex(e) {
    const t = this.sim.state.upgradeChoices[e];
    t && this.chooseUpgrade(t);
  }
  chooseUpgrade(e) {
    this.sim.state.status !== "upgrade" || !this.sim.state.upgradeChoices.includes(e) || (this.sim.chooseUpgrade(e), this.upgradesRenderedKey = "", Ji(this.refs.upgrades), this.audio.play("upgrade"), this.renderState());
  }
  renderReport(e) {
    this.reportRendered = !0, this.dialog.classList.add("is-ended"), zr(this.refs.report), this.refs.reportSummary.innerHTML = `
      <strong>${Number(e.score).toLocaleString()} points</strong>
      <span>${on(e.speciesLabel)} | ${on(e.phaseReached)} | ${on(e.survived)}</span>
      <span>${on(Ah(e.completedAt))}</span>
      <span>Lysis cause: ${on(e.lysisCause)}</span>
      <span>Upgrades: ${on(e.upgrades.join(", ") || "none")}</span>
    `, this.refs.submitName.value = this.refs.name.value || "Anonymous", this.audio.play("lysis");
  }
  async submitScore() {
    this.refs.submitStatus.textContent = "Submitting score...";
    const e = await this.leaderboard.submit(this.sim.scoreEntry(this.refs.submitName.value));
    this.refs.submitStatus.textContent = e.mode === "global" ? `Score saved to shared board${e.rank ? ` at rank #${e.rank}` : ""}.` : "Score saved locally. Shared board was unavailable.", md(this.refs, e);
  }
  async refreshScores(e) {
    md(this.refs, await this.leaderboard.refresh(e));
  }
  playNewEffects() {
    this.sim.state.effects.forEach((e) => {
      this.seenEffects.has(e.id) || (this.seenEffects.add(e.id), e.type === "pickup" ? this.audio.play("pickup") : e.type === "damage" ? this.audio.play("damage") : e.type === "dash" ? this.audio.play("dash") : e.type === "phase" && this.audio.play("phase"));
    });
  }
}
function Vb() {
  const i = document.createElement("dialog");
  return i.className = "envelope-v3-modal", i.setAttribute("aria-labelledby", "envelope-v3-title"), i.innerHTML = `
    <div class="envelope-v3-shell">
      <header class="envelope-v3-topbar">
        <div>
          <p class="envelope-v3-eyebrow">Hidden Lab Arcade</p>
          <h2 id="envelope-v3-title">Envelope Escape V3: Lab-Bench Stress Run</h2>
        </div>
        <div class="envelope-v3-actions">
          <button data-v3="sound" type="button" aria-pressed="false">Sound Off</button>
          <label>Motion <select data-v3="motion"><option value="full">Full</option><option value="calm">Calm</option><option value="off">Off</option></select></label>
          <button data-v3="close" type="button" aria-label="Close game">Close</button>
        </div>
      </header>
      <main class="envelope-v3-layout">
        <section class="envelope-v3-stage">
          <div class="envelope-v3-game-root"></div>
          <section class="envelope-v3-hud" aria-label="Run status">
            <div><span>Score</span><strong data-v3-hud="score">0</strong></div>
            <div><span>Time</span><strong data-v3-hud="time">0:00</strong></div>
            <div><span>Integrity</span><strong data-v3-hud="integrity">100%</strong></div>
            <div><span>Command</span><strong data-v3-hud="charge">0%</strong></div>
            <div><span>Carry</span><strong data-v3-hud="carry">empty</strong></div>
            <div><span>Combo</span><strong data-v3-hud="combo">ready</strong></div>
            <div><span>Zone</span><strong data-v3-hud="zone">Slide</strong></div>
          </section>
          <section class="envelope-v3-objective">
            <span data-v3-hud="phase">Homeostasis</span>
            <strong data-v3-hud="objective">Collect envelope modules.</strong>
            <em data-v3-hud="pressure">Balanced load</em>
          </section>
          <section class="envelope-v3-radial" aria-label="Command wheel">
            <button data-command="pg" type="button">1 <strong>PG synthesis</strong><span>Build wall</span></button>
            <button data-command="membrane" type="button">2 <strong>Membrane repair</strong><span>Seal failure</span></button>
            <button data-command="phage" type="button">3 <strong>Phage defense</strong><span>Purge bloom</span></button>
            <button data-command="motility" type="button">4 <strong>Motility</strong><span>Evade</span></button>
          </section>
          <section class="envelope-v3-menu">
            <p class="envelope-v3-kicker">3D lab-bench survival</p>
            <h3>Navigate the bench before the envelope fails.</h3>
            <p>Move through oversized lab landmarks, route around pipette pulses, plaque blooms, rotor sweeps, and tube-rack ruptures, then use slow-time envelope commands to solve each stress event.</p>
            <div class="envelope-v3-fields">
              <label>Model bacterium <select data-v3="species"></select></label>
              <label>Leaderboard name <input data-v3="name" maxlength="24" autocomplete="nickname" placeholder="Anonymous" /></label>
            </div>
            <article class="envelope-v3-trait">
              <span>Species trait</span>
              <strong data-v3-hud="trait-title">Envelope homeostasis</strong>
              <p data-v3-hud="trait-copy">Balanced handling and faster command charging.</p>
            </article>
            <div class="envelope-v3-starts">
              <button data-v3="classic" type="button">Start Classic Run</button>
              <button data-v3="daily" type="button">Daily Challenge</button>
            </div>
          </section>
          <section class="envelope-v3-upgrades" hidden>
            <p class="envelope-v3-kicker">Upgrade draft</p>
            <h3>Choose one envelope system.</h3>
            <div data-v3="upgrades"></div>
          </section>
          <section class="envelope-v3-report" hidden>
            <p class="envelope-v3-kicker">Run report</p>
            <h3>Cell lysis</h3>
            <p data-v3="report-summary"></p>
            <label>Log this score as <input data-v3="submit-name" maxlength="24" autocomplete="nickname" placeholder="Anonymous" /></label>
            <div class="envelope-v3-starts">
              <button data-v3="submit-score" type="button">Submit Score</button>
            </div>
            <p data-v3="submit-status" aria-live="polite"></p>
          </section>
        </section>
        <aside class="envelope-v3-scores">
          <div>
            <span>Leaderboard</span>
            <strong data-v3-hud="score-mode">Classic board</strong>
            <p data-v3-hud="score-meta">Finish a run to record a score.</p>
          </div>
          <ol data-v3-hud="scores"></ol>
        </aside>
      </main>
      <footer class="envelope-v3-controls">
        <span>WASD/arrows move | Shift dash | Hold Space command wheel | 1-4 command | Navigate pipette, petri, rotor, flask, and tube-rack zones</span>
        <button data-v3="pause" type="button">Pause</button>
        <button data-v3="restart" type="button">Restart</button>
        <button data-v3="refresh-scores" type="button">Refresh Scores</button>
      </footer>
    </div>
  `, document.body.append(i), i;
}
function Lb(i) {
  return {
    close: vt(i, '[data-v3="close"]'),
    sound: vt(i, '[data-v3="sound"]'),
    motion: vt(i, '[data-v3="motion"]'),
    gameRoot: vt(i, ".envelope-v3-game-root"),
    menu: vt(i, ".envelope-v3-menu"),
    upgrades: vt(i, ".envelope-v3-upgrades"),
    upgradesList: vt(i, '[data-v3="upgrades"]'),
    report: vt(i, ".envelope-v3-report"),
    reportSummary: vt(i, '[data-v3="report-summary"]'),
    submitName: vt(i, '[data-v3="submit-name"]'),
    submitScore: vt(i, '[data-v3="submit-score"]'),
    submitStatus: vt(i, '[data-v3="submit-status"]'),
    species: vt(i, '[data-v3="species"]'),
    name: vt(i, '[data-v3="name"]'),
    classic: vt(i, '[data-v3="classic"]'),
    daily: vt(i, '[data-v3="daily"]'),
    pause: vt(i, '[data-v3="pause"]'),
    restart: vt(i, '[data-v3="restart"]'),
    refreshScores: vt(i, '[data-v3="refresh-scores"]'),
    commandButtons: Array.from(i.querySelectorAll("[data-command]")),
    hud: (e) => vt(i, `[data-v3-hud="${e}"]`)
  };
}
function Ub(i) {
  Gh.forEach((e) => {
    const t = document.createElement("option");
    t.value = e, t.textContent = kt[e].label, i.append(t);
  });
}
function Db(i, e) {
  i.hud("score").textContent = Number(e.score).toLocaleString(), i.hud("time").textContent = e.timeLabel, i.hud("integrity").textContent = `${e.integrity}%`, i.hud("charge").textContent = `${e.commandCharge}%`, i.hud("carry").textContent = e.carriedLabel, i.hud("combo").textContent = e.comboLabel, i.hud("zone").textContent = e.zoneLabel, i.hud("phase").textContent = e.phaseTitle, i.hud("objective").textContent = `${e.objective} (${e.objectiveProgress}/${e.objectiveTarget})`, i.hud("pressure").textContent = `${e.jobStep} | Next: ${e.nextHazardLabel} | ${e.phasePressure}`;
}
function md(i, e) {
  i.hud("score-mode").textContent = e.mode === "global" ? "Shared board" : e.mode === "fallback" ? "Local fallback" : "Local board", i.hud("score-meta").textContent = `${e.totalEntries} recorded ${e.totalEntries === 1 ? "run" : "runs"} on ${e.board}`;
  const t = i.hud("scores");
  if (t.innerHTML = "", !e.entries.length) {
    const n = document.createElement("li");
    n.textContent = "No scores recorded yet.", t.append(n);
    return;
  }
  e.entries.forEach((n, s) => {
    const a = document.createElement("li");
    a.innerHTML = `<span>#${s + 1}</span><strong>${on(n.name)}</strong><em>${Number(n.score).toLocaleString()} pts | ${on(kt[n.species]?.shortLabel || n.species)}</em><small>${on(Ah(n.playedAt))}</small>`, t.append(a);
  });
}
function Id(i, e) {
  const t = kt[e] || kt.ecoli;
  i.hud("trait-title").textContent = t.traitTitle, i.hud("trait-copy").textContent = t.traitCopy;
}
function Cd(i, e, t) {
  const n = e.key.toLowerCase();
  if (n === "w" || n === "arrowup") i.moveZ = t ? -1 : i.moveZ === -1 ? 0 : i.moveZ;
  else if (n === "s" || n === "arrowdown") i.moveZ = t ? 1 : i.moveZ === 1 ? 0 : i.moveZ;
  else if (n === "a" || n === "arrowleft") i.moveX = t ? -1 : i.moveX === -1 ? 0 : i.moveX;
  else if (n === "d" || n === "arrowright") i.moveX = t ? 1 : i.moveX === 1 ? 0 : i.moveX;
  else if (n === "shift") i.dash = t;
  else if (n === " ") i.commandWheel = t;
  else return !1;
  return !0;
}
function zr(i) {
  i.hidden = !1;
}
function Ji(i) {
  i.hidden = !0;
}
function vt(i, e) {
  const t = i.querySelector(e);
  if (!t) throw new Error(`Envelope Escape V3 missing ${e}`);
  return t;
}
function bd(i) {
  try {
    return window.localStorage.getItem(i) || "";
  } catch {
    return "";
  }
}
function Ad(i, e) {
  try {
    window.localStorage.setItem(i, e);
  } catch {
  }
}
function Ah(i) {
  const e = new Date(i);
  return Number.isNaN(e.getTime()) ? "Completion time unavailable" : new Intl.DateTimeFormat("en-US", {
    timeZone: Fb,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(e).replace(/\bE[DS]T\b/, "ET");
}
function on(i) {
  return String(i ?? "").replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]);
}
export {
  Hb as destroyEnvelopeEscapeV3,
  Xb as openEnvelopeEscapeV3
};
