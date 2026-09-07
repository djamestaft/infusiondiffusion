import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateQuality,
  inspectPullRequest,
  repositoryFromRemote,
} from "./pr-gate.mjs";

const sha = "a".repeat(40);
const green = {
  id: 1,
  name: "quality",
  head_sha: sha,
  app: { slug: "github-actions" },
  status: "completed",
  conclusion: "success",
  html_url: "https://github.com/owner/repo/actions/runs/1",
};
const pr = { head: { sha, repo: { full_name: "owner/repo" } } };

test("resolves HTTPS and SSH remotes without accepting another host", () => {
  for (const remote of [
    "https://github.com/owner/repo.git",
    "git@github.com:owner/repo.git",
    "ssh://git@github.com/owner/repo",
  ])
    assert.equal(repositoryFromRemote(remote), "owner/repo");
  assert.throws(() =>
    repositoryFromRemote("https://github.com.evil/owner/repo"),
  );
});
test("requires completed success from GitHub Actions on the named commit", () => {
  assert.equal(evaluateQuality([green], sha).id, 1);
  for (const conclusion of [
    null,
    "failure",
    "cancelled",
    "skipped",
    "neutral",
    "timed_out",
    "action_required",
  ])
    assert.throws(() => evaluateQuality([{ ...green, conclusion }], sha));
  for (const status of ["queued", "in_progress"])
    assert.throws(() => evaluateQuality([{ ...green, status }], sha));
  assert.throws(() => evaluateQuality([], sha));
  assert.throws(() => evaluateQuality([{ ...green, head_sha: "other" }], sha));
  assert.throws(() =>
    evaluateQuality([{ ...green, app: { slug: "other" } }], sha),
  );
});
test("a newer failed or pending rerun overrides old success", () => {
  for (const conclusion of [null, "failure"])
    assert.throws(() =>
      evaluateQuality([green, { ...green, id: 2, conclusion }], sha),
    );
});
test("paginates check results and verifies PR head again", async () => {
  const calls = [];
  const result = await inspectPullRequest({
    repository: "owner/repo",
    number: 68,
    sha,
    request: async (path) => {
      calls.push(path);
      if (path.includes("/pulls/")) return pr;
      return {
        check_runs: path.endsWith("page=1")
          ? Array.from({ length: 100 }, (_, id) => ({
              ...green,
              id,
              name: "unrelated",
            }))
          : [green],
      };
    },
  });
  assert.equal(result.sha, sha);
  assert.equal(calls.filter((path) => path.includes("/pulls/")).length, 2);
  assert.equal(calls.length, 4);
});
test("rejects another local commit, fork repository and a moving PR head", async () => {
  for (const head of [
    { ...pr.head, sha: "other" },
    { ...pr.head, repo: { full_name: "fork/repo" } },
  ]) {
    await assert.rejects(
      inspectPullRequest({
        repository: "owner/repo",
        number: 68,
        sha,
        request: async () => ({ head }),
      }),
    );
  }
  let reads = 0;
  await assert.rejects(
    inspectPullRequest({
      repository: "owner/repo",
      number: 68,
      sha,
      request: async (path) =>
        path.includes("/pulls/")
          ? ++reads === 1
            ? pr
            : { head: { ...pr.head, sha: "changed" } }
          : { check_runs: [green] },
    }),
  );
});
test("network failures fail closed", async () => {
  await assert.rejects(
    inspectPullRequest({
      repository: "owner/repo",
      number: 68,
      sha,
      request: async () => {
        throw new Error("network unavailable");
      },
    }),
  );
});

test("a failed CLI attempt replaces an older green local record", () => {
  const folder = mkdtempSync(join(tmpdir(), "inf-pr-gate-"));
  try {
    execFileSync("git", ["init", "--quiet", folder]);
    const records = join(folder, ".git", "pr-gates");
    mkdirSync(records);
    const record = join(records, "68.json");
    writeFileSync(record, JSON.stringify({ passed: true, sha }));
    assert.throws(() =>
      execFileSync(
        process.execPath,
        [fileURLToPath(new URL("./pr-gate.mjs", import.meta.url)), "68"],
        { cwd: folder, stdio: "pipe" },
      ),
    );
    const result = JSON.parse(readFileSync(record, "utf8"));
    assert.equal(result.passed, false);
    assert.equal(result.sha, undefined);
  } finally {
    if (
      dirname(resolve(folder)) !== resolve(tmpdir()) ||
      !folder.includes("inf-pr-gate-")
    ) {
      throw new Error(
        "Refusing cleanup outside the allocated temporary test directory.",
      );
    }
    rmSync(folder, { recursive: true, force: true });
  }
});
