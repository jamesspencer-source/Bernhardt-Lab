"""Focused regressions for the reviewed personnel, presentation, and publish fixes."""

import contextlib
import io
import json
import copy
import html
import re
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

import publish_site as publish
import site_builder as site
import validate_tom_compliance as tom


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
        items = {item["profileSlug"]: item for item in site.resolve_featured_alumni(self.people)}
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

    def test_featured_identity_source_and_default_role_follow_people(self):
        people = copy.deepcopy(self.people)
        neil = next(person for person in people if person["slug"] == "neil-greene")
        neil.update(name="Updated display name", currentRole="Updated role")
        neil["verification"]["url"] = "https://example.org/new-profile"
        item = next(item for item in site.resolve_featured_alumni(people) if item["profileSlug"] == "neil-greene")
        self.assertEqual(item["name"], neil["name"])
        self.assertEqual(item["currentRole"], neil["currentRole"])
        self.assertEqual(item["source"], neil["verification"]["url"])

    def test_featured_duplicate_fields_and_slugs_are_rejected(self):
        items = site.load_featured_alumni_items()
        with patch.object(site, "load_featured_alumni_items", return_value=[{**items[0], "name": "Stale name"}]), self.assertRaisesRegex(RuntimeError, "duplicated or unknown"):
            site.resolve_featured_alumni(self.people)
        with patch.object(site, "load_featured_alumni_items", return_value=[items[0], items[0]]), self.assertRaisesRegex(RuntimeError, "Duplicate featured"):
            site.resolve_featured_alumni(self.people)

    def test_featured_missing_person_is_rejected(self):
        people = [person for person in self.people if person["slug"] != "neil-greene"]
        with self.assertRaisesRegex(RuntimeError, "must reference an alumni record"):
            site.resolve_featured_alumni(people)

    def test_julia_approved_details(self):
        julia = self.by_slug["julia-silberman"]
        self.assertEqual(julia["labRole"], "BBS Graduate Student")
        self.assertEqual(julia["email"], "juliasilberman@g.harvard.edu")
        self.assertEqual(julia["labDates"], "Jul 2026 \u2013 Present")
        self.assertEqual(julia["education"], ["B.S. Biochemistry, Tufts University, Medford, MA"])
        for flat in (True, False):
            profile = site.render_current_profile(julia, flat)
            self.assertIn('href="mailto:juliasilberman@g.harvard.edu"', profile)
            self.assertIn("BBS Graduate Student", profile)

    def test_contact_routing_and_direct_profile_email(self):
        for path in (site.ROOT / "index.html", site.FLAT_DIR / "index.html"):
            for route in ("general", "training"):
                match = re.search(rf'data-contact-route="{route}"[^>]*href="([^"]+)"', path.read_text())
                self.assertIsNotNone(match)
                self.assertEqual(html.unescape(match[1]), site.contact_mailto(route))
        general = parse_qs(urlparse(site.contact_mailto("general")).query)
        self.assertEqual(general["cc"], ["james_spencer@hms.harvard.edu"])
        self.assertEqual(general["subject"], ["[Bernhardt Lab website] General inquiry"])
        training = parse_qs(urlparse(site.contact_mailto("training")).query)
        self.assertNotIn("cc", training)
        self.assertIn("[Bernhardt Lab website]", training["subject"][0])
        self.assertIn("Proposed start date and availability:\r\n", training["body"][0])
        for flat in (True, False):
            profile = site.render_current_profile(self.by_slug["thomas-bernhardt"], flat)
            self.assertIn('href="mailto:thomas_bernhardt@hms.harvard.edu"', profile)
            self.assertNotIn("cc=", profile)

    def test_publications_are_generated_from_one_source(self):
        for path in (site.ROOT / "index.html", site.FLAT_DIR / "index.html"):
            self.assertIn(site.render_curated_publications(), path.read_text())
            positions, missing = tom.expected_publication_positions(path.read_text())
            self.assertEqual(missing, [])
            self.assertEqual(positions, list(range(6)))
        changed = site.render_curated_publications().replace(tom.EXPECTED_PUBLICATIONS[0]["articleUrl"], "https://example.org/wrong-paper")
        self.assertEqual(tom.expected_publication_positions(changed)[1], [tom.EXPECTED_PUBLICATIONS[0]["title"]])
        self.assertNotIn("publications.js", (site.ASSETS_DIR / "main.js").read_text())
        self.assertFalse((site.ROOT / ".github/workflows/refresh-publications.yml").exists())

    def test_shared_module_changes_invalidate_only_the_changed_url(self):
        with tempfile.TemporaryDirectory() as directory:
            assets = Path(directory)
            (assets / "js").mkdir()
            (assets / "js/shared.js").write_text("first revision")
            (assets / "js/other.js").write_text("unchanged")
            with patch.object(site, "ASSETS_DIR", assets):
                first = site.module_imports("../../")
                (assets / "js/shared.js").write_text("second revision")
                second = site.module_imports("../../")
            self.assertNotEqual(first["../../assets/js/shared.js"], second["../../assets/js/shared.js"])
            self.assertEqual(first["../../assets/js/other.js"], second["../../assets/js/other.js"])

    def test_asset_references_are_current(self):
        site.validate_site_quality_metadata()
        for path in (site.ROOT / "index.html", site.ROOT / "team/julia-silberman/index.html", site.FLAT_DIR / "index.html"):
            text = path.read_text()
            self.assertEqual(text.count('id="site-module-map"'), 1)
            self.assertLess(text.index('type="importmap"'), text.index('type="module"'))

    def test_stale_module_map_blocks_validation(self):
        with patch.object(site, "module_imports", return_value={"./changed.js": "./changed.js?v=new"}), self.assertRaisesRegex(RuntimeError, "stale module map"):
            site.validate_site_quality_metadata()

    def test_entrypoint_version_tracks_content(self):
        with tempfile.TemporaryDirectory() as directory:
            assets = Path(directory)
            script = assets / "main.js"
            script.write_text("first revision")
            with patch.object(site, "ASSETS_DIR", assets):
                version = site.asset_version("main.js")
                self.assertEqual(version, site.asset_version("main.js"))
                script.write_text("second revision")
                self.assertNotEqual(version, site.asset_version("main.js"))

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
        (self.root / "scripts/check_site.py").write_text('print("Fixture quality checks passed")\n')
        self.git("init", "-q")
        self.git("add", "index.html", "github-flat/index.html", "assets/game.js", "scripts/build_site.py", "scripts/check_site.py")
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

    def test_failed_quality_checks_block_plan_without_changing_index(self):
        checks = self.root / "scripts/check_site.py"
        checks.write_text('raise SystemExit("Fixture browser regression")\n')
        self.git("add", "scripts/check_site.py")
        self.git("-c", "user.name=Publish test", "-c", "user.email=test@example.invalid", "commit", "-qm", "failing checks fixture")
        before = publish.tree_state(self.root), self.git("diff", "--cached", "--binary")
        with self.assertRaises(subprocess.CalledProcessError), self.plan():
            pass
        self.assertEqual(before, (publish.tree_state(self.root), self.git("diff", "--cached", "--binary")))

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
