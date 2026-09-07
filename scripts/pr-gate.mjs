import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function repositoryFromRemote(remote) {
  const match = remote
    .trim()
    .match(
      /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/,
    );
  if (!match)
    throw new Error("The Git remote must identify a GitHub repository.");
  return match[1];
}

export function evaluateQuality(checks, sha) {
  const quality = checks
    .filter(
      (check) =>
        check.name === "quality" && check.app?.slug === "github-actions",
    )
    .sort((a, b) => b.id - a.id)[0];
  if (!quality)
    throw new Error("Required GitHub Actions quality check is missing.");
  if (
    quality.head_sha !== sha ||
    quality.status !== "completed" ||
    quality.conclusion !== "success"
  ) {
    throw new Error(
      `Required quality check is not green for this commit (${quality.status}/${quality.conclusion ?? "pending"}).`,
    );
  }
  return {
    id: quality.id,
    url: quality.html_url,
    status: quality.status,
    conclusion: quality.conclusion,
  };
}

export async function inspectPullRequest({ request, repository, number, sha }) {
  const base = `/repos/${repository}`;
  const pr = await request(`${base}/pulls/${number}`);
  if (pr.head?.repo?.full_name !== repository || pr.head?.sha !== sha) {
    throw new Error(
      "Local HEAD must match the pull request head in this repository.",
    );
  }
  const checks = [];
  for (let page = 1; ; page++) {
    const batch = await request(
      `${base}/commits/${sha}/check-runs?filter=latest&per_page=100&page=${page}`,
    );
    if (!Array.isArray(batch.check_runs))
      throw new Error("Malformed GitHub check response.");
    checks.push(...batch.check_runs);
    if (batch.check_runs.length < 100) break;
    if (page >= 100)
      throw new Error("Too many check pages; gate remains closed.");
  }
  const quality = evaluateQuality(checks, sha);
  const current = await request(`${base}/pulls/${number}`);
  if (
    current.head?.sha !== sha ||
    current.head?.repo?.full_name !== repository
  ) {
    throw new Error("Pull request changed while checking; run the gate again.");
  }
  return { repository, pullRequest: number, sha, quality };
}

function git(...args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 15000,
  }).trim();
}

function githubToken() {
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN)
    return process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  try {
    const credential = execFileSync(
      "git",
      ["-c", "credential.interactive=false", "credential", "fill"],
      {
        input: "protocol=https\nhost=github.com\n\n",
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 15000,
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: "0",
          GCM_INTERACTIVE: "Never",
        },
      },
    );
    return credential
      .split(/\r?\n/)
      .find((line) => line.startsWith("password="))
      ?.slice(9);
  } catch {
    return undefined;
  }
}

export async function run(numberText) {
  if (
    !/^[1-9]\d*$/.test(numberText ?? "") ||
    !Number.isSafeInteger(Number(numberText))
  ) {
    throw new Error("Usage: pnpm pr:gate <positive pull-request number>");
  }
  const number = Number(numberText);
  const recordPath = resolve(
    git("rev-parse", "--git-path", `pr-gates/${number}.json`),
  );
  mkdirSync(dirname(recordPath), { recursive: true });
  const record = (value) =>
    writeFileSync(
      recordPath,
      JSON.stringify(
        { checkedAt: new Date().toISOString(), ...value },
        null,
        2,
      ) + "\n",
    );
  // Invalidate older success before authentication, network calls or evaluation.
  record({
    passed: false,
    pullRequest: number,
    reason: "Check started; no current success recorded.",
  });
  try {
    const sha = git("rev-parse", "HEAD");
    const remotes = git("remote").split(/\r?\n/).filter(Boolean);
    const remote = remotes.includes("origin")
      ? "origin"
      : remotes.length === 1
        ? remotes[0]
        : undefined;
    if (!remote)
      throw new Error(
        "Cannot select a Git remote; configure origin or one unambiguous remote.",
      );
    const repository = repositoryFromRemote(git("remote", "get-url", remote));
    const token = githubToken();
    if (!token)
      throw new Error(
        "GitHub authentication unavailable. Use GH_TOKEN, GITHUB_TOKEN or the Git credential manager.",
      );
    const request = async (path) => {
      const response = await fetch(`https://api.github.com${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        signal: AbortSignal.timeout(30000),
        redirect: "error",
      });
      if (!response.ok)
        throw new Error(
          `GitHub request failed (HTTP ${response.status}); gate remains closed.`,
        );
      return response.json();
    };
    const result = await inspectPullRequest({
      request,
      repository,
      number,
      sha,
    });
    if (git("rev-parse", "HEAD") !== sha)
      throw new Error("Local HEAD changed while checking; run the gate again.");
    record({ passed: true, ...result });
    console.log(
      `PR #${number}: quality passed for ${sha}.\nRecord: ${recordPath}`,
    );
  } catch (error) {
    record({ passed: false, pullRequest: number, reason: error.message });
    throw error;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  run(process.argv[2] ?? process.env.PR_GATE_NUMBER).catch((error) => {
    // Never echo subprocess output: credential-manager diagnostics may be sensitive.
    console.error(
      error instanceof Error && !("stderr" in error)
        ? error.message
        : "PR gate command failed; check Git configuration and authentication.",
    );
    process.exitCode = 1;
  });
}
