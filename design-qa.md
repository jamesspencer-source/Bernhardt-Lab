# Envelope Escape Design QA

## Comparison Target

- Source visual truth: `docs/game-design/selected-cellular-cutout-runner.png`
- Primary implementation capture: `docs/game-design/implementation-cellular-cutout-runner-pbp-route.png`
- Opening implementation capture: `docs/game-design/implementation-cellular-cutout-runner.png`
- Mobile implementation capture: `docs/game-design/implementation-cellular-cutout-runner-mobile.png`
- Side-by-side evidence: `docs/game-design/qa-cellular-cutout-comparison.png`
- Route: `http://127.0.0.1:5179/game-preview/`
- State: active Level 1 gameplay. The primary comparison uses the raised PBP route because it most closely matches the source mock's mid-run state.

## Capture Details

- Source pixels: 1487 x 1058.
- Desktop implementation pixels and CSS viewport: 1440 x 900 at device scale factor 1.
- Mobile implementation pixels and CSS viewport: 390 x 844 at device scale factor 1.
- Side-by-side evidence pixels: 1440 x 560.
- Density normalization: source and implementation were contained at equal column widths in the side-by-side image. The source is a concept composition rather than an exact browser viewport, so full-view proportions were compared by shared playfield, HUD, and route regions rather than raw pixel coordinates.

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: Fraunces and Manrope preserve the source's editorial title and compact technical UI hierarchy. Labels remain readable without negative letter spacing or cramped wrapping.
- Spacing and layout rhythm: the HUD, progress strip, membrane playfield, floor route, PBP fork, and lower membrane now use the same visual order and density as the selected direction. The play lane remains unobscured on desktop and mobile.
- Colors and visual tokens: cyan identifies the player, lime identifies collectible PG precursors, coral identifies every damage source, gold identifies PBP bonuses, and mint/cyan communicates successful status. These meanings remain consistent in the start legend, course assets, HUD, and feedback.
- Image quality and asset fidelity: the background, player, peptidoglycan track, precursor, antibiotic, autolysin, and PBP assets are raster images built for this direction. They remain sharp at rendered sizes, use appropriate transparency, and do not show checkerboard or masking artifacts in the browser.
- Copy and content: the opening screen explains the full loop in three short statements. In-world coaching names each unfamiliar scientific object and pairs it with the required action without covering the player lane.
- Responsiveness and accessibility: the 390 x 844 layout has no horizontal overflow. Touch controls stay visible and clear of the player. Keyboard controls, focus indicators, semantic labels, live status messages, and reduced-motion handling remain present.

Focused inspection covered the objective legend, HUD integrity and combo states, player silhouette, track texture, hazard labels, PBP route, score feedback, and mobile touch controls at native capture size. Separate cropped images were not needed because those regions remained legible in the native screenshots.

## Comparison History

### Pass 1

- [P1] Keyboard jump and duck events could be lost while focus remained on the start control. A window-level gameplay input layer now captures controls outside text fields while preserving every character in the name input. Post-fix evidence: desktop jump and duck both cleared the tutorial sequence with 5/5 integrity.
- [P1] A quick duck press ended before the autolysin collision window. Duck input is now latched long enough for a novice tap to clear one hanging hazard, while held input continues to work. Post-fix evidence: desktop and mobile opening sequences both cleared with 5/5 integrity.
- [P2] Releasing jump immediately applied the height cut every frame, producing an unnecessarily stiff and narrow jump window. The cut is now applied once after a minimum jump interval, preserving variable height while making a normal tap useful. Post-fix evidence: the first capsule and first wall gap both cleared without damage.
- [P2] Pause duration was included in run time. Pause time is now excluded from scoring and displayed elapsed time. Post-fix evidence: resume testing advanced only by active play time.

### Pass 2

- [P2] The peptidoglycan track repeated vertically and appeared as two stacked floor rows. Its source-scaled tile height now renders one continuous row. Post-fix evidence: `docs/game-design/implementation-cellular-cutout-runner.png`.
- [P2] The desktop and mobile coach cards obscured part of the hazard lane. Coaching now occupies the open upper playfield, with point callouts stacked separately. Post-fix evidence: desktop and mobile active-game captures.
- [P2] The floor sat too low relative to the selected composition, creating excess unused space above the player. Camera framing now raises the route while retaining the lower membrane as a visible depth cue. Post-fix evidence: `docs/game-design/qa-cellular-cutout-comparison.png`.
- [P2] Rapid score bursts could overlap on the PBP route. Burst labels and particles now clear faster and use a lighter visual weight. Post-fix evidence: the revised opening capture and browser state inspection.

## Interaction Evidence

- Entered `James A`, confirmed the letter `a` remained accepted, and started a run.
- Cleared the opening jump, duck, follow-up capsule, and first wall gap at 5/5 integrity.
- Completed a full 24,200-unit desktop run through all five zones in 54.8 seconds, reaching the PBP gate with 3/5 integrity and a score of 63,351.
- Reached and collected the raised gold PBP route, including score, speed, combo, and integrity effects.
- Tested damage, combo reset, gap recovery, pause/resume, run failure, run completion, finish bonus, and timestamped local leaderboard storage.
- Tested mobile jump and duck controls at 390 x 844; both tutorial hazards cleared at 5/5 integrity.
- Confirmed no horizontal overflow at 390 x 844.

## Open Questions

- The selected source is a single cinematic gameplay frame rather than a full interaction specification. The implementation intentionally adds start, pause, result, coaching, mobile-control, and local-score states around that direction.
- Final score weights can be tuned after several human playtests; that is balancing work rather than a current visual or functional blocker.

## Implementation Checklist

- [x] Match the selected Cellular Cutout art direction with real raster assets.
- [x] Make green, coral, and gold meanings understandable within seconds.
- [x] Replace free movement with smooth automatic running plus jump and duck.
- [x] Provide escalating zones, gaps, mixed hazard patterns, and an optional PBP route.
- [x] Make integrity, combo, speed, progress, score, and feedback legible.
- [x] Verify name entry, desktop controls, mobile controls, pause, failure, completion, and local score storage.
- [x] Verify desktop and mobile composition against the selected source.

## Follow-up Polish

- [P3] Rebalance exact score weights and zone speeds after observing several first-time human runs.

final result: passed
