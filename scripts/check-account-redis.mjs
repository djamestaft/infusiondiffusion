import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const source = readFileSync(
  "src/lib/shopify/customer-account/store.ts",
  "utf8",
);
const script = (name) => {
  const match = source.match(
    new RegExp(`export const ${name} = \\x60([\\s\\S]*?)\\x60`),
  );
  assert.ok(match, `${name} exists`);
  return match[1];
};
const command = (...args) =>
  execFileSync(
    "docker",
    ["exec", "inf39-session-test", "redis-cli", "--raw", ...args.map(String)],
    { encoding: "utf8" },
  ).trim();
const evalScript = (name, keys, args = []) =>
  command("EVAL", script(name), keys.length, ...keys, ...args);
const suffix = Date.now();
const s = `session:${suffix}`,
  lock = `lock:${suffix}`,
  login = `login:${suffix}`,
  pending = `pending:${suffix}`,
  result = `result:${suffix}`;
try {
  command("SET", s, "old", "EX", 120);
  assert.equal(evalScript("ACQUIRE_REFRESH", [s, lock], ["a"]), "1");
  assert.equal(evalScript("ACQUIRE_REFRESH", [s, lock], ["b"]), "0");
  assert.equal(
    evalScript("COMMIT_REFRESH", [s, lock], ["b", "old", "bad", 90]),
    "0",
  );
  assert.equal(evalScript("INVALIDATE_REFRESH", [s, lock], ["b", "old"]), "0");
  assert.equal(command("GET", s), "old");
  assert.equal(
    evalScript("COMMIT_REFRESH", [s, lock], ["a", "old", "new", 90]),
    "1",
  );
  assert.ok(Number(command("TTL", s)) <= 90);
  assert.equal(evalScript("INVALIDATE_REFRESH", [s, lock], ["a", "old"]), "0");
  assert.equal(command("GET", s), "new");
  assert.equal(evalScript("ACQUIRE_REFRESH", [s, lock], ["c"]), "1");
  command("DEL", s, lock);
  assert.equal(
    evalScript("COMMIT_REFRESH", [s, lock], ["c", "new", "resurrected", 90]),
    "0",
  );
  assert.equal(command("GET", s), "");
  // One-use login, including logout while the token exchange is in flight.
  command("SET", login, "transaction", "EX", 600);
  assert.equal(evalScript("CLAIM_LOGIN", [login, pending]), "transaction");
  assert.equal(evalScript("CLAIM_LOGIN", [login, pending]), "");
  evalScript("REVOKE_LOGIN", [login, pending, result]);
  assert.equal(
    evalScript(
      "COMMIT_LOGIN",
      [pending, s, result],
      ["transaction", "new-login", 90],
    ),
    "0",
  );
  assert.equal(command("GET", s), "");
  // Logout after commit but before the callback's cookie response is delivered.
  command("SET", login, "transaction2", "EX", 600);
  evalScript("CLAIM_LOGIN", [login, pending]);
  assert.equal(
    evalScript(
      "COMMIT_LOGIN",
      [pending, s, result],
      ["transaction2", "new-login", 90],
    ),
    "1",
  );
  evalScript("REVOKE_LOGIN", [login, pending, result]);
  assert.equal(command("GET", s), "");
  console.log(
    "Redis integration: lease ownership, stale refresh, TTL, one-use login and both callback/logout races passed.",
  );
} finally {
  command("DEL", s, lock, login, pending, result);
}
