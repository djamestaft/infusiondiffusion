import sys
from pathlib import Path
from unittest import TestCase

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import adw_figma_capture
from adw_modules.data_types import FigmaTarget, PlanOutput


class FigmaCaptureArgumentsTest(TestCase):
    file_key = "GYiQd7QSAwCSaGtt0alKG2"

    def test_repeated_node_ids_create_one_stable_grouped_target(self) -> None:
        args = adw_figma_capture._parse_args([
            "--file-key", self.file_key, "--node-id", "93:6", "--node-id", "93:7",
        ])
        target = adw_figma_capture._target(args.file_key, args.node_id)
        planned_target = FigmaTarget(
            file_key=self.file_key, node_ids=["93:6", "93:7"],
            evidence_categories=target.evidence_categories,
        )
        plan = PlanOutput(status="success", figma_targets=[planned_target],
                          advisory_specialists=["product_designer"])

        self.assertEqual(target.node_ids, ["93:6", "93:7"])
        self.assertEqual(len(plan.figma_targets), 1)
        self.assertEqual(adw_figma_capture._target_hash(target),
                         adw_figma_capture._target_hash(plan.figma_targets[0]))

    def test_single_node_target_remains_compatible(self) -> None:
        args = adw_figma_capture._parse_args(["--file-key", self.file_key, "--node-id", "93:6"])

        self.assertEqual(args.node_id, ["93:6"])
        self.assertEqual(adw_figma_capture._target(self.file_key, "93:6"),
                         adw_figma_capture._target(args.file_key, args.node_id))
