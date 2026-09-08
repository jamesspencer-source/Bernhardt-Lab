"""Focused regressions for the reviewed personnel, presentation, and publish fixes."""

import contextlib
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import publish_site as publish
import site_builder as site


class SiteQualityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.people = site.load_people()
        cls.by_slug = {person["slug"]: person for person in cls.people}

    def test_approved_personnel_corrections(self):
        self.assertEqual(self.by_slug["thomas-bernhardt"]["education"], [])
        wilaysha = self.by_slug["wilaysha-evans"]
        self.assertEqual(wilaysha["status"], "alumni")
        self.assertEqual(wilaysha["labDates"], "Sep 2022 - Aug 2026")
        self.assertFalse(wilaysha["email"])
        self.assertEqual(self.by_slug["jessica-borhunter"]["name"], "Jessica Bohrhunter")

    def test_corrected_featured_roles_agree(self):
        items = {item["profileSlug"]: item for item in site.read_json(site.DATA_DIR / "featured-alumni.json")["items"]}
        for slug in ("thao-truong", "neil-greene"):
            person = self.by_slug[slug]
            self.assertEqual(items[slug]["currentRole"], person["currentRole"])
            self.assertEqual(items[slug]["source"], person["verification"]["url"])
        self.assertNotIn("Director", self.by_slug["thao-truong"]["currentRole"])
        self.assertIn("Clinical Associate Professor", self.by_slug["neil-greene"]["currentRole"])

    def test_privacy_and_preview(self):
        current = site.current_people(self.people)
        self.assertEqual(current[0]["slug"], "thomas-bernhardt")
        for person in current:
            self.assertFalse(person["bio"])
            self.assertFalse(person["profileSummary"])
            self.assertNotIn("Research Interest", site.render_current_profile(person, False))
        for path in (site.ROOT / "index.html", site.FLAT_DIR / "index.html"):
            site.validate_homepage_team_grid(path, len(current))
            self.assertEqual(path.read_text().count("person-card--landing"), min(8, len(current)))
        for path in (site.ROOT / "team/index.html", site.FLAT_DIR / "team.html"):
            site.validate_team_directory_controls(path, len(current))

    def test_source_labels_match_destinations(self):
        items = {item["profileSlug"]: item for item in site.resolve_featured_alumni(self.people)}
        for slug in ("thomas-bartlett", "amelia-mckitterick"):
            self.assertEqual(items[slug]["sourceLinkLabel"], "View institutional directory")
        monica = site.render_alumni_profile(self.by_slug["monica-markovski"], False)
        self.assertIn("Third-party directory", monica)
        self.assertNotIn("Institutional directory", monica)
        mary = site.render_alumni_profile(self.by_slug["mary-jane-tsang"], False)
        self.assertIn("Publication evidence", mary)
        self.assertNotIn("View external profile", mary)
        payload = site.read_json(site.ASSETS_DIR / "data/featured-alumni.json")
        self.assertEqual(payload["items"], list(items.values()))

    def test_conflicting_featured_role_blocks_build(self):
        people = [dict(person) for person in self.people]
        next(person for person in people if person["slug"] == "neil-greene")["currentRole"] = "Different role"
        with self.assertRaisesRegex(RuntimeError, "Featured role disagrees"):
            site.resolve_featured_alumni(people)

    def test_shared_profile_header(self):
        self.assertIn("header.css", site.PROFILE_CSS_SOURCE_ORDER)
        for renderer in (site.render_current_profile, site.render_alumni_profile):
            text = renderer(self.by_slug["thomas-bernhardt"], False)
            self.assertIn('class="site-header"', text)
            self.assertNotIn('class="topbar"', text)

    def test_hidden_primitive_in_every_bundle(self):
        for bundle in ("styles.css", "alumni.css", "profile.css"):
            text = (site.ASSETS_DIR / bundle).read_text()
            self.assertIn("[hidden] {\n  display: none !important;\n}", text)

    def test_update_link_at_bottom(self):
        for path in (site.ROOT / "alumni/index.html", site.FLAT_DIR / "alumni.html"):
            text = path.read_text()
            self.assertGreater(text.index("alumni-update-section"), text.index("<!-- generated-alumni-grid:end -->"))

    def test_research_animation_starts_still(self):
        text = (site.ROOT / "research/index.html").read_text()
        self.assertIn('src="../assets/images/research/mreb-trackmate-poster.png"', text)
        self.assertNotIn('src="../assets/images/research/mreb-trackmate.gif"', text.replace('data-animation-src=', 'data-source='))
        self.assertIn('id="microscopy-toggle"', text)


class PublishSafetyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="bernhardt-publish-test-")
        self.root = Path(self.temp.name)
        self.patch = patch.object(publish, "ROOT", self.root)
        self.patch.start()
        (self.root / "scripts").mkdir()
        (self.root / "assets").mkdir()
        (self.root / "github-flat").mkdir()
        (self.root / "index.html").write_text("original")
        (self.root / "github-flat/index.html").write_text("original")
        (self.root / "assets/game.js").write_text("original game")
        (self.root / "scripts/build_site.py").write_text(
            'from pathlib import Path\n'
            'Path("github-flat/index.html").write_bytes(Path("index.html").read_bytes())\n'
        )
        self.git("init", "-q")
        self.git("add", "index.html", "github-flat/index.html", "assets/game.js", "scripts/build_site.py")
        self.git("-c", "user.name=Publish test", "-c", "user.email=test@example.invalid", "commit", "-qm", "fixture")
        (self.root / "index.html").write_text("approved update")

    def tearDown(self):
        self.patch.stop()
        self.temp.cleanup()

    def git(self, *args):
        return subprocess.check_output(["git", *args], cwd=self.root)

    @contextlib.contextmanager
    def plan(self):
        with tempfile.TemporaryDirectory() as directory:
            yield publish.prepare_plan(Path(directory), ["index.html"])

    def test_plan_only_includes_source_and_derived_output(self):
        with self.plan() as plan:
            self.assertEqual(set(plan), {"index.html", "github-flat/index.html"})
            publish.assert_scope(plan, ["index.html"])
        self.assertEqual((self.root / "github-flat/index.html").read_text(), "original")

    def test_unrelated_game_is_rejected_and_preserved(self):
        (self.root / "assets/game.js").write_text("unrelated game changes")
        with self.plan() as plan, self.assertRaisesRegex(RuntimeError, "assets/game.js"):
            publish.assert_scope(plan, ["index.html"])
        self.assertEqual((self.root / "assets/game.js").read_text(), "unrelated game changes")

    def test_numbered_siblings_are_never_removed(self):
        duplicate = self.root / "assets/game 2.js"
        duplicate.write_text("distinct user work")
        with self.plan() as plan, self.assertRaisesRegex(RuntimeError, "game 2.js"):
            publish.assert_scope(plan, ["index.html"])
        self.assertEqual(duplicate.read_text(), "distinct user work")

    def test_dry_run_leaves_worktree_and_index_unchanged(self):
        self.git("add", "index.html")
        before = publish.tree_state(self.root), self.git("status", "--porcelain"), self.git("rev-parse", "HEAD"), self.git("diff", "--cached", "--binary")
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(publish.main(["--dry-run", "--include", "index.html"]), 0)
        after = publish.tree_state(self.root), self.git("status", "--porcelain"), self.git("rev-parse", "HEAD"), self.git("diff", "--cached", "--binary")
        self.assertEqual(before, after)

    def test_unrelated_staged_file_blocks_publish(self):
        (self.root / "assets/game.js").write_text("unrelated staged changes")
        self.git("add", "assets/game.js")
        with self.plan() as plan, self.assertRaisesRegex(RuntimeError, "assets/game.js"):
            publish.assert_scope(plan, ["index.html"])

    def test_builder_cannot_silently_delete_tracked_numbered_files(self):
        numbered = self.root / "github-flat/page 2.html"
        numbered.write_text("distinct tracked work")
        builder = self.root / "scripts/build_site.py"
        builder.write_text(builder.read_text() + 'Path("github-flat/page 2.html").unlink()\n')
        self.git("add", "github-flat/page 2.html", "scripts/build_site.py")
        self.git("-c", "user.name=Publish test", "-c", "user.email=test@example.invalid", "commit", "-qm", "numbered fixture")
        with self.assertRaisesRegex(RuntimeError, "unselected numbered file"), self.plan():
            pass
        self.assertEqual(numbered.read_text(), "distinct tracked work")

    def test_arbitrary_generated_edits_are_rejected(self):
        (self.root / "github-flat/index.html").write_text("unreviewed generated edit")
        with self.plan() as plan, self.assertRaisesRegex(RuntimeError, "non-reproducible"):
            publish.assert_scope(plan, ["index.html"])

    def test_selection_requires_exact_source_files(self):
        for name in ("assets", "../private.json", "github-flat/index.html", "assets/styles.css"):
            with self.assertRaises(RuntimeError):
                publish.validate_selection([name])


if __name__ == "__main__":
    unittest.main()
