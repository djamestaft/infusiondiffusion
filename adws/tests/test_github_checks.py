import json
from unittest import TestCase

from adw_modules.github_checks import evaluate


class GitHubChecksGateTest(TestCase):
    def test_accepts_only_a_passing_required_check(self) -> None:
        result = evaluate(json.dumps([
            {"name": "quality", "state": "SUCCESS", "bucket": "pass"},
            {"name": "Vercel", "state": "SUCCESS", "bucket": "pass"},
        ]), {"quality"})
        self.assertTrue(result.passed)

    def test_rejects_cancelled_required_check(self) -> None:
        result = evaluate(json.dumps([
            {"name": "quality", "state": "CANCELLED", "bucket": "cancel"},
        ]), {"quality"})
        self.assertFalse(result.passed)

    def test_rejects_missing_required_check(self) -> None:
        result = evaluate("[]", {"quality"})
        self.assertFalse(result.passed)
