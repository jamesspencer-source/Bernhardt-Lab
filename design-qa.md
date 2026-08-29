# Envelope Escape Design QA

## Comparison Target

- Source visual truth: `docs/game-design/approved-envelope-platformer-concept.png`
- Primary implementation capture: `docs/game-design/implementation-selected-state.png`
- Additional implementation states: `docs/game-design/implementation-pressure-desktop.png`, `docs/game-design/implementation-gameplay-mobile.png`, and `docs/game-design/implementation-late-course.png`
- Side-by-side evidence: `docs/game-design/qa-comparison.png`
- Route: `http://127.0.0.1:5177/game-preview/`
- State: active Level 1 gameplay after collecting two of three PG precursors; later pressure, mobile gameplay, and completed-run states were also reviewed.

## Capture Details

- Source pixels: 1487 x 1058.
- Primary implementation pixels: 1280 x 800.
- Implementation CSS viewport: 1280 x 800 at device scale factor 1.
- Mobile implementation pixels/CSS viewport: 600 x 900 at device scale factor 1.
- Side-by-side evidence pixels: 1600 x 740.
- Density normalization: both source and implementation were displayed as contained full-frame images at equal column widths. The source is a concept composition, while the implementation intentionally includes the Bernhardt Lab website shell and a wider playable viewport; no device-density resampling was required.

## Findings

No actionable P0, P1, or P2 design differences remain.

- Fonts and typography: Fraunces and Manrope preserve the lab site's editorial display/body hierarchy. HUD labels remain compact and readable without cramped wrapping at desktop and mobile sizes.
- Spacing and layout rhythm: the game retains the concept's open central play lane, framed membrane layers, top status bar, and clear object separation. The website header and in-game HUD are intentionally distinct layers.
- Colors and visual tokens: cyan consistently identifies the player and safe PBP route, green identifies build items, red identifies damage and pressure, and gold identifies the exit. The navy/cyan palette is intentionally closer to the Bernhardt Lab site than the concept's purple cast.
- Image quality and asset fidelity: the background, bacterium, precursor, PBP platform, PBP gate, and phage are raster assets in the approved dimensional cell-envelope style. They remain sharp at their rendered sizes and show no transparency halos or placeholder treatment.
- Copy and content: the opening screen, in-world labels, contextual coaching, and HUD explain the complete loop in short language: collect three green precursors, avoid red hazards, preserve integrity, and reach the gold gate.
- Responsiveness and accessibility: no horizontal overflow was present at 600 x 900. Touch controls remained fully visible; keyboard controls, labels, reduced-motion handling, and live status messaging remain implemented.

The full-view comparison is sufficient for composition and art-direction parity. Native-resolution source and implementation captures were also inspected for the HUD, player silhouette, precursor readability, membrane texture, object labels, and transparency edges, so separate cropped detail images were not needed.

## Comparison History

### Pass 1

- [P2] The foreground wall lattice was too dense and competed with the player and pickups. It was reduced in density and opacity, and collectible sizing was normalized. Post-fix evidence: `docs/game-design/implementation-selected-state.png`.
- [P2] The first required pickups were missable and the first red hazard appeared before the core rule was established. The first three precursors were moved onto the opening route and the first antibiotic was delayed until after the first bridge. Post-fix evidence: `docs/game-design/implementation-gameplay-opening.png`.
- [P2] The background plate accumulated vertical drift during play. Its motion now uses a fixed base position plus a bounded two-pixel offset. Post-fix evidence: `docs/game-design/implementation-selected-state.png`.
- [P1] Landing animation repeatedly multiplied the player scale until the bacterium became unreadable. The tween now always returns to a stored base scale, and the player was replaced with a stronger solid-cyan raster asset. Post-fix evidence: `docs/game-design/implementation-selected-state.png`.

### Pass 2

- [P1] The stated steady lower route did not supply enough reachable required precursors, so a beginner could be stranded before a bridge. Required precursors now appear along the lower route, elevated PBP pickups serve as optional bonuses, bridge assembly restores one integrity segment, and checkpoint activation is progression-safe. Post-fix evidence: a complete browser run reached the PBP gate in 30.0 seconds with 4/5 integrity and no console errors; result state is shown in `docs/game-design/implementation-late-course.png`.

## Interaction Evidence

- Entered a normal player name including the letter `a` and started a run.
- Tested desktop arrow/A-D movement, W/Up/Space jumping, damage, bridge assembly, checkpoint restoration, pressure chase, completion, result scoring, and local timestamped score storage.
- Completed all four bridges and reached the PBP gate in an automated browser playthrough.
- Tested mobile touch movement and jumping at 600 x 900; the player moved, jumped, and collected a precursor with no overflow.
- Checked browser console warnings and errors in opening, active gameplay, pressure, completion, and mobile states; none were present.

## Open Questions

- The source is a single cinematic concept frame rather than a complete interaction specification. The implementation intentionally adds the website shell, start/pause/result states, contextual coaching, and a longer scrolling course.

## Follow-up Polish

- [P3] A future human playtest can tune exact score weights and pressure speed after several real player runs. This is balancing work, not a current visual or functional blocker.

## Implementation Checklist

- [x] Match the approved envelope-biochemistry art direction.
- [x] Make the core collect/avoid/exit rules readable within seconds.
- [x] Keep required items reachable on the beginner route.
- [x] Preserve a faster optional PBP route and escalating pressure phase.
- [x] Verify desktop, mobile, completion, and error-free browser states.

final result: passed
