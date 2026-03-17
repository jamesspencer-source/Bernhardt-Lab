Refine and harden the Bernhardt Lab website with equal emphasis on visual clarity, maintainability, and trust.

Goals:
- Reduce content drift by removing manually duplicated roster and alumni content wherever possible.
- Make visible freshness labels come from a shared source instead of scattered hardcoded dates.
- Fix portrait focal-point rendering so curated subject framing actually appears on team cards.
- Reduce information density on the homepage and team surfaces so the site scans faster and feels more intentional.
- Simplify the CSS layer so the visual system is easier to reason about and less dependent on late-file overrides.

Implementation requirements:
- Treat the current-team dataset as a single source of truth for homepage and team-directory rendering.
- Treat the alumni dataset as a single source of truth for the alumni directory rendering.
- Keep canonical pages and the `github-flat` publish copy aligned.
- Preserve profile-page URLs and redirects.
- Do not regress accessibility, reduced-motion behavior, or mobile layout.

Specific changes:
1. Team architecture
- Replace hardcoded team directory markup with a shared data-driven render path.
- Remove homepage roster duplication or reduce it to a minimal non-authoritative fallback.
- Remove plaintext email display from card-level team UI.
- Support a compact homepage card variant and a richer directory variant.

2. Alumni architecture
- Remove the large hand-maintained alumni card list from the alumni page and render from shared data.
- Keep search, filters, sort, and profile links working.
- Use a non-authoritative noscript fallback rather than a second full alumni source of truth.

3. Freshness system
- Create a shared freshness data source for labels such as transcript reviewed, alumni updated, roles updated, and accessibility reviewed.
- Render those labels from the shared source on both canonical and flattened pages.
- Keep video view counts and publications tied to their data feeds.

4. Visual cleanup
- Tighten the hero copy and add clear primary navigation actions.
- Make the homepage team section feel lighter and more scannable.
- Improve hierarchy and spacing in team and alumni surfaces.
- Ensure portrait crops respect configured focal points.

5. CSS cleanup
- Remove or consolidate duplicate rules that redefine the same components later in the file.
- Preserve the current overall visual language while making the stylesheet easier to maintain.

Verification:
- Homepage, team directory, and alumni directory should all render correctly from shared data.
- Laurent Dubois and Tanner DeHart should appear only in alumni surfaces.
- Freshness labels should populate from the shared source, not hardcoded inline text.
- Team cards should no longer show raw email addresses.
- Portrait framing should visibly honor per-person focus coordinates.
- `git diff --check` should be clean.
