import json
import re
from pathlib import Path
from unittest import TestCase


ROOT = Path(__file__).resolve().parents[2]
SECRET_KEY_FRAGMENTS = (
    "auth",
    "oauth",
    "header",
    "clientid",
    "client_id",
    "client-id",
    "secret",
    "bearer",
    "token",
    "password",
    "credential",
)
SECRET_VALUE_PATTERN = re.compile(
    r"(?:bearer\s+\S+|(?:api[_-]?key|access[_-]?token|refresh[_-]?token)\s*[:=])",
    re.IGNORECASE,
)
EXACT_SEMVER_PATTERN = re.compile(r"\d+\.\d+\.\d+\Z")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def contains_tracked_secret_configuration(value: object) -> bool:
    if isinstance(value, dict):
        return any(
            any(fragment in key.lower() for fragment in SECRET_KEY_FRAGMENTS)
            or contains_tracked_secret_configuration(nested)
            for key, nested in value.items()
        )
    if isinstance(value, list):
        return any(contains_tracked_secret_configuration(item) for item in value)
    return isinstance(value, str) and bool(SECRET_VALUE_PATTERN.search(value))


class PiMcpStaticConfigTest(TestCase):
    def setUp(self) -> None:
        self.pi_settings = load_json(ROOT / ".pi/settings.json")
        self.mcp_config = load_json(ROOT / ".pi/mcp.json")
        self.package = load_json(ROOT / "package.json")

    def test_static_adapter_activation_matches_the_exact_package_pin(self) -> None:
        adapter_version = self.package["devDependencies"]["pi-mcp-adapter"]
        self.assertRegex(adapter_version, EXACT_SEMVER_PATTERN)

        packages = self.pi_settings["packages"]
        adapter_entries = [
            entry
            for entry in packages
            if entry.get("source", "").startswith("npm:pi-mcp-adapter@")
        ]
        self.assertEqual(len(adapter_entries), 1)
        self.assertEqual(len(packages), 1)

        adapter = adapter_entries[0]
        self.assertEqual(adapter["source"], f"npm:pi-mcp-adapter@{adapter_version}")
        self.assertEqual(adapter["skills"], [])
        self.assertIsNot(adapter.get("enabled"), False)

    def test_static_mcp_configuration_has_only_the_expected_hosted_server(self) -> None:
        self.assertEqual(
            self.mcp_config,
            {
                "settings": {"hostConfigDiscovery": "off"},
                "mcpServers": {
                    "figma": {
                        "url": "https://mcp.figma.com/mcp",
                        "lifecycle": "lazy",
                    }
                },
            },
        )

    def test_tracked_pi_configuration_has_no_auth_or_secret_configuration(self) -> None:
        self.assertFalse(contains_tracked_secret_configuration(self.pi_settings))
        self.assertFalse(contains_tracked_secret_configuration(self.mcp_config))
