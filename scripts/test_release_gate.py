"""Release publication must fail closed unless the exact commit passes GitHub checks."""

from pathlib import Path
import unittest
from unittest.mock import patch

import release_gate as gate

SHA = "a" * 40
ROOT = Path("/repo")


def checks(conclusion="success", **overrides):
    run = {"id": 10, "name": gate.CHECK_NAME, "head_sha": SHA, "status": "completed", "conclusion": conclusion, "app": {"id": gate.GITHUB_ACTIONS_APP_ID}}
    run.update(overrides)
    return {"check_runs": [run]}


class ReleaseGateTests(unittest.TestCase):
    def test_only_exact_commit_and_actions_check_can_pass(self):
        self.assertEqual(gate.check_result(checks(), SHA), "success")
        for values in [{"head_sha": "b" * 40}, {"name": "unrelated"}, {"app": {"id": 99}}, {"status": "in_progress"}]:
            with self.subTest(values=values):
                self.assertEqual(gate.check_result(checks(**values), SHA), "pending")
        for result in ["failure", "cancelled", "skipped", "neutral", None]:
            self.assertEqual(gate.check_result(checks(result), SHA), "failed")

    def test_latest_rerun_overrides_old_success(self):
        payload = checks()
        payload["check_runs"].append(checks("failure", id=11)["check_runs"][0])
        self.assertEqual(gate.check_result(payload, SHA), "failed")

    @patch.dict("os.environ", {}, clear=True)
    def test_human_release_tests_branch_before_main(self):
        with patch.object(gate.subprocess, "check_output", return_value=f"git@github.com:{gate.REPOSITORY}.git\n"), patch.object(gate.subprocess, "run") as run, patch.object(gate, "github_api", return_value=checks()) as api:
            gate.release_checked_commit(ROOT, SHA)
            self.assertEqual(run.call_args_list[0].args[0][-1], SHA + ":refs/heads/release/site-" + SHA[:16])
            self.assertEqual(run.call_args_list[1].args[0][-1], SHA + ":refs/heads/main")
            api.assert_called_once_with(f"commits/{SHA}/check-runs?per_page=100")
            self.assertNotIn("--force", str(run.call_args_list))

    @patch.dict("os.environ", {"GITHUB_ACTIONS": "true", "GH_TOKEN": "test-token"}, clear=True)
    def test_automation_dispatches_checks_and_requests_pages_build(self):
        with patch.object(gate.subprocess, "check_output", return_value=f"https://github.com/{gate.REPOSITORY}"), patch.object(gate.subprocess, "run"), patch.object(gate, "github_api", side_effect=[None, checks(), None]) as api:
            gate.release_checked_commit(ROOT, SHA)
            self.assertEqual(api.call_args_list[0].args, (f"actions/workflows/{gate.WORKFLOW}/dispatches", {"ref": "release/site-" + SHA[:16]}))
            self.assertEqual(api.call_args_list[-1].args, ("pages/builds", {}))

    @patch.dict("os.environ", {}, clear=True)
    def test_failure_and_timeout_never_push_main(self):
        for result, timeout in [(checks("failure"), 1200), (checks(), 0)]:
            with self.subTest(timeout=timeout), patch.object(gate.subprocess, "check_output", return_value=f"git@github.com:{gate.REPOSITORY}.git"), patch.object(gate.subprocess, "run") as run, patch.object(gate, "github_api", return_value=result):
                with self.assertRaises(RuntimeError):
                    gate.release_checked_commit(ROOT, SHA, timeout=timeout)
                self.assertEqual(run.call_count, 1)

    def test_unexpected_origin_and_commit_are_rejected(self):
        with self.assertRaises(ValueError):
            gate.release_checked_commit(ROOT, "main")
        with patch.object(gate.subprocess, "check_output", return_value="https://other.invalid/repo.git"), patch.object(gate.subprocess, "run") as run, self.assertRaises(RuntimeError):
            gate.release_checked_commit(ROOT, SHA)
        run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
