import json
from pathlib import Path
from unittest import TestCase


ROOT = Path(__file__).resolve().parents[2]
SECRET_KEY_FRAGMENTS = ("auth", "token", "secret", "password", "credential")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def contains_secret_key(value: object) -> bool:
    if isinstance(value, dict):
        return any(
            any(fragment in key.lower() for fragment in SECRET_KEY_FRAGMENTS)
            or contains_secret_key(nested)
            for key, nested in value.items()
        )
    if isinstance(value, list):
        return any(contains_secret_key(item) for item in value)
    return False


class PiMcpConfigTest(TestCase):
    def setUp(self) -> None:
        self.pi_settings = load_json(ROOT / ".pi/settings.json")
        self.mcp_config = load_json(ROOT / ".pi/mcp.json")
        self.package = load_json(ROOT / "package.json")

    def test_adapter_is_project_activated_at_the_pinned_version(self) -> None:
        adapter_version = self.package["devDependencies"]["pi-mcp-adapter"]
        adapter = next(
            entry
            for entry in self.pi_settings["packages"]
            if entry["source"].startswith("npm:pi-mcp-adapter@")
        )

        self.assertEqual(adapter["source"], f"npm:pi-mcp-adapter@{adapter_version}")
        self.assertEqual(adapter["skills"], [])
        self.assertIsNot(adapter.get("enabled"), False)

    def test_figma_server_is_hosted_lazy_and_does_not_discover_host_config(self) -> None:
        self.assertEqual(self.mcp_config["settings"]["hostConfigDiscovery"], "off")
        self.assertEqual(
            self.mcp_config["mcpServers"]["figma"],
            {"url": "https://mcp.figma.com/mcp", "lifecycle": "lazy"},
        )

    def test_tracked_pi_configuration_has_no_inline_auth_or_secrets(self) -> None:
        self.assertFalse(contains_secret_key(self.pi_settings))
        self.assertFalse(contains_secret_key(self.mcp_config))
