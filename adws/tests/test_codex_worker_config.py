from unittest import TestCase
from pydantic import ValidationError
from adw_modules import agents
from adw_modules.data_types import CodexArtifact, CodexFigmaRequest, FigmaCodexWorkerConfig, FigmaTarget

class CodexWorkerConfigTest(TestCase):
 def test_worker_is_disabled_and_execution_is_immutable(self):
  cfg=agents.load_config("adws/adw_sssf_config/sssf.config.yaml").workers.figma_codex
  self.assertFalse(cfg.enabled); self.assertEqual(cfg.executable,"codex")
  self.assertNotIn("executable",FigmaCodexWorkerConfig.model_fields); self.assertNotIn("official_endpoint",FigmaCodexWorkerConfig.model_fields)
 def test_target_rejects_noncanonical_and_unsafe_values(self):
  for kwargs in ({"file_key":"file","node_ids":["1:2"]},{"file_key":"GYiQd7QSAwCSaGtt0alKG2","node_ids":["instructions"]},{"file_key":"GYiQd7QSAwCSaGtt0alKG2","node_ids":["1:2"],"evidence_categories":["unknown"]}):
   with self.assertRaises(ValidationError): FigmaTarget(evidence_categories=kwargs.get("evidence_categories",["dimensions_layout"]),**{k:v for k,v in kwargs.items() if k!="evidence_categories"})
 def test_request_and_artifact_paths_cannot_escape(self):
  with self.assertRaises(ValidationError): CodexFigmaRequest(request_id="../x",supervisor_session_id="pi",reason="pi_connector_unavailable",operations=["node_metadata"],target=FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2",node_ids=["1:2"],evidence_categories=["dimensions_layout"]))
  with self.assertRaises(ValidationError): CodexArtifact(path="../x",media_type="text/plain",byte_count=1,sha256="0"*64)
