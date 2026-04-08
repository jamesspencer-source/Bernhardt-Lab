# Editorial Style Guide

This site should feel like `editorial science`: premium, restrained, and cohesive rather than flashy or heavily modular.

## Visual direction

- Base identity: deep navy / dark luxe surfaces.
- Tinting: subtle cool or warm lifts only when they help hierarchy.
- Typography: serif headlines + clean sans-serif body, with calm spacing and strong contrast.
- Controls: one shared family for buttons, pills, nav items, carousel controls, and utility inputs.
- Homepage feature modules should feel like part of the same authored system, not standalone special-color callouts.

## Surface system

Shared surface styling should live in the CSS source-of-truth layers:

- `assets/css/base.css`
- `assets/css/layout.css`

Homepage-only CSS in `assets/css/home.css` should primarily adjust layout, spacing, and responsive composition.

Do not hand-repaint a single module in a later CSS layer unless:

1. the visual exception is intentional,
2. it is documented here, and
3. the shared system cannot reasonably express it.

## Preferred card behavior

- Use the shared dark card family first.
- Keep borders, shadows, and hover states restrained.
- Use cool/warm/slate tinting as a quiet accent, not as a separate visual identity.
- Feature cards may get slightly stronger emphasis, but they should still read as part of the same system.

## Pre-publish visual QA

For any visual or homepage-style update, check at minimum:

1. Homepage first screen
2. Featured Video / Research block
3. Team page
4. Alumni page
5. One profile page

Confirm:

- changed cards still match the shared editorial system
- no module looks like an isolated repaint
- text contrast remains strong
- hover and control states still feel like the same design family
- desktop and at least one narrower viewport still read cleanly
