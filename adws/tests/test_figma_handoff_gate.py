import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from types import ModuleType, SimpleNamespace
from unittest import TestCase

try:
    import pydantic  # noqa: F401
except ModuleNotFoundError:
    # This focused standard-library test must remain runnable from the documented
    # root command even when the optional ADW runtime environment is not active.
    fallback = ModuleType("pydantic")

    class BaseModel:
        def __init__(self, **values):
            annotations = {}
            for base in reversed(type(self).mro()):
                annotations.update(getattr(base, "__annotations__", {}))
            for name in annotations:
                value = values.get(name, getattr(type(self), name, None))
                setattr(self, name, value)

    def Field(*, default_factory):
        return default_factory()

    def field_validator(*_args, **_kwargs):
        return lambda function: function

    fallback.BaseModel = BaseModel
    fallback.Field = Field
    fallback.ValidationInfo = object
    fallback.field_validator = field_validator
    sys.modules["pydantic"] = fallback

from adws.adw_modules.data_types import SpecialistOutput
from adws.adw_modules.gates import figma_handoff_complete


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
