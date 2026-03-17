# Generated Profile Pages Proposal

## Plain-English Summary

Right now the website has a lot of separate profile pages and directory entries that have to be updated by hand. That means one change, like moving someone from the current team to alumni, can require edits in several places.

The long-term fix is to treat each person like a single record in one central data file. The website would then build the team directory, alumni directory, and each individual profile page from that shared information automatically.

## What This Would Feel Like Day To Day

Instead of opening multiple HTML files for one person, we would update one profile record with fields like:

- name
- role in the lab
- current role
- lab dates
- bio
- profile image
- links

After that, a small build script would regenerate:

- the homepage team section
- the team directory
- the alumni directory
- the individual profile page
- the flat publish copy

## Why This Helps

- Fewer mistakes: one update flows everywhere.
- Faster routine maintenance: moving someone to alumni becomes a one-record change.
- Better consistency: directory cards and profile pages always match.
- Easier automation: future routine updates can safely regenerate pages instead of editing many files by hand.

## What Implementation Would Look Like

1. Create one shared people data source for current members and alumni.
2. Create one reusable HTML template for current-member profile pages.
3. Create one reusable HTML template for alumni profile pages.
4. Add a small generator script that turns the shared data into the site pages.
5. Keep the finished output as normal static HTML so GitHub Pages still works exactly the same way.

## Scope and Risk

This is a medium-sized cleanup, not a risky redesign. The public site would still be a static website. The main work is reorganizing how content is stored and generated so future updates are much easier.

## Recommendation

I would treat this as a dedicated maintenance upgrade project after the current content and design changes settle. It is the best way to make the site easier to keep accurate over time.
