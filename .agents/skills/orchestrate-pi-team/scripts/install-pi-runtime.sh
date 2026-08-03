#!/bin/sh
set -eu

repo_root=$(git rev-parse --show-toplevel)
expected_node=$(tr -d '[:space:]' < "$repo_root/.nvmrc")
actual_node=$(node --version | sed 's/^v//')

if [ "$actual_node" != "$expected_node" ]; then
  echo "Expected Node $expected_node, found $actual_node. Run 'nvm use' first." >&2
  exit 1
fi

npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.83.0

# Pi 0.83.0 pins brace-expansion 5.0.7 through its shrinkwrap. Replace it with
# the compatible patched release until Pi publishes an audited upstream pin.
pi_package_dir="$(npm root -g)/@earendil-works/pi-coding-agent"
if [ ! -d "$pi_package_dir" ]; then
  echo "Pi package directory was not created at the expected npm global root." >&2
  exit 1
fi

(
  cd "$pi_package_dir"
  npm install --ignore-scripts --save-exact brace-expansion@5.0.9
  npm audit --omit=dev
  npm ls brace-expansion --depth=2
)

if [ "$(pi --version)" != "0.83.0" ]; then
  echo "Pi version verification failed." >&2
  exit 1
fi

# A first Pi command creates the user agent directory needed by HerdR.
mkdir -p "${HOME:?}/.pi/agent/extensions"
if command -v herdr >/dev/null 2>&1; then
  herdr integration install pi
  herdr integration status
else
  echo "HerdR is not installed; skipping its optional Pi lifecycle integration." >&2
fi
