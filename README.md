# Thomas Bernhardt Lab Website Refresh

This folder contains a polished static website draft for the Thomas Bernhardt Lab (Howard Hughes Medical Institute + Harvard Medical School).

## What is included

- Hero and overview sections with accurate lab mission
- Research focus section in plain-language scientific framing
- Microscopy and movie highlights section
- Selected publication highlights (with PubMed links)
- Searchable people directory with real photos and profile links from public lab records
- Rotating lab-life gallery with real images/captions from public lab records
- Rotating alumni panel with updated public institutional role links
- Full alumni directory page with searchable/filterable records and verified profile badges
- Contact/openings section with HMS Department of Microbiology wording, map widget, and HMS quadrangle visual
- Generated local profile pages for each current team member (for 1:1 replacement readiness)
- HHMI template design assets integrated for background/editorial polish

## How to view it

No installation is needed.

1. Open `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website`
2. Double-click `index.html`
3. Review in your browser


## Shared leaderboard (global, persistent)

The game supports a global leaderboard that persists across all visitors and future site updates.

1. Deploy the Cloudflare Worker in `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/leaderboard-worker` (see that folder's `README.md`).
2. Set the deployed endpoint in:
   - `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/assets/envelope-escape-config.js`
   - `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/github-flat/envelope-escape-config.js`
3. Use the public route format:
   - `https://<your-worker-domain>/leaderboard`

If this endpoint is empty, the game falls back to browser-local leaderboard mode.
When the endpoint is live, players also receive their overall placement after each ranked run.

## Where to edit content

Most editable content is in `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/assets/main.js`:

- `researchThemes`
- `publications`
- `rawPeople` (source people data)
- `galleryItems`
- `featuredAlumni`

Profile page styling is in:

- `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/assets/profile.css`

## Design and layout files

- Page structure: `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/index.html`
- Styling: `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/assets/styles.css`
- Content + interactivity: `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/assets/main.js`
- Generated profile pages: `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/<person-slug>/index.html`
- Team listing page: `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/people/index.html`
- Alumni directory page: `/Users/james/Documents/HMS Lab Ops/TB Lab/TB lab website/alumni/index.html`

## Source note

Content for people, contact, research framing, and gallery was pulled from publicly available lab pages and records. Additional design assets were pulled from the provided HHMI presentation template.
