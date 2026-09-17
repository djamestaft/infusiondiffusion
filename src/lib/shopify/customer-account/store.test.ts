// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { SessionStore } from "./store";
import type { CustomerConfig } from "./config";
import { newIdentifier } from "./crypto";
const config = {
  prefix: "test",
  key: "ab".repeat(32),
  redisUrl: "https://example.upstash.io",
  redisToken: "secret",
} as CustomerConfig;
afterEach(() => vi.unstubAllGlobals());
it("stores only encrypted, expiring session data and never sends secrets in URLs", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify({ result: "OK" })));
  vi.stubGlobal("fetch", fetcher);
  await new SessionStore(config).put(
    "session",
    newIdentifier(),
    { accessToken: "sensitive" },
    60,
  );
  const [url, init] = fetcher.mock.calls[0];
  expect(url).toBe(config.redisUrl);
  expect(init.cache).toBe("no-store");
  expect(init.body).not.toContain("sensitive");
  expect(JSON.parse(init.body).slice(-3)).toEqual(["EX", 60, "NX"]);
});
it("does not contact Redis for malformed browser identifiers", async () => {
  const f = vi.fn();
  vi.stubGlobal("fetch", f);
  expect(await new SessionStore(config).read("session", "../other")).toBeNull();
  expect(f).not.toHaveBeenCalled();
});
it("fails closed on a Redis error without leaking its response", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ error: "private details" })),
      ),
  );
  await expect(
    new SessionStore(config).read("session", newIdentifier()),
  ).rejects.toThrow("Account service unavailable");
});
