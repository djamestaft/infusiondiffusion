from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import TestCase

from adw_modules.data_types import SpecialistOutput
from adw_modules.gates import figma_handoff_complete


class FigmaHandoffGateTest(TestCase):
    def test_accepts_non_empty_evidence_inside_session_handoff(self) -> None:
        with TemporaryDirectory() as data_dir:
            handoff = (Path(data_dir) / "sessions" / "smoke" /
                       "context_handoff" / "figma_handoff.md")
            handoff.parent.mkdir(parents=True)
            handoff.write_text("Approved Figma node 316:99")

            report = figma_handoff_complete(
                SpecialistOutput(status="success", figma_evidence=[str(handoff)]),
                self._run(data_dir),
            )

            self.assertTrue(report.passed)

    def test_rejects_missing_evidence(self) -> None:
        with TemporaryDirectory() as data_dir:
            report = figma_handoff_complete(
                SpecialistOutput(status="success"), self._run(data_dir)
            )

            self.assertFalse(report.passed)

    def test_rejects_evidence_outside_session_handoff(self) -> None:
        with TemporaryDirectory() as data_dir:
            outside = Path(data_dir) / "figma_handoff.md"
            outside.write_text("Not session-scoped")

            report = figma_handoff_complete(
                SpecialistOutput(status="success", figma_evidence=[str(outside)]),
                self._run(data_dir),
            )

            self.assertFalse(report.passed)

    @staticmethod
    def _run(data_dir: str):
        defaults = SimpleNamespace(data_dir=data_dir)
        return SimpleNamespace(
            adw_id="smoke", cfg=SimpleNamespace(defaults=defaults)
        )
