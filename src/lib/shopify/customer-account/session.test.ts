// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const grant = vi.hoisted(() => vi.fn());
vi.mock("openid-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("openid-client")>()),
  refreshTokenGrant: grant,
}));
import { currentSession } from "./session";
import type { SessionStore } from "./store";
import type { Configuration } from "openid-client";
const fresh = () => ({
  accessToken: "access",
  refreshToken: "refresh",
  idToken: "id",
  subject: "one",
  tokenExpiresAt: Date.now() + 3600000,
  expiresAt: Date.now() + 86400000,
});
const record = (value = fresh()) => ({ value, raw: "encrypted" });
afterEach(() => vi.resetAllMocks());
it("returns an unexpired session without refreshing", async () => {
  const store = {
    read: vi.fn().mockResolvedValue(record()),
  } as unknown as SessionStore;
  expect(
    (
      await currentSession(
        "id",
        store,
        async () =>
          ({ clientMetadata: () => ({ client_id: "test" }) }) as Configuration,
      )
    )?.subject,
  ).toBe("one");
  expect(grant).not.toHaveBeenCalled();
});
it("deletes absolute-expired sessions", async () => {
  const remove = vi.fn();
  const store = {
    read: vi.fn().mockResolvedValue(record({ ...fresh(), expiresAt: 0 })),
    remove,
  } as unknown as SessionStore;
  expect(
    await currentSession(
      "id",
      store,
      async () =>
        ({ clientMetadata: () => ({ client_id: "test" }) }) as Configuration,
    ),
  ).toBeNull();
  expect(remove).toHaveBeenCalled();
});
it("does not restore a session deleted during refresh", async () => {
  const old = record({ ...fresh(), tokenExpiresAt: 0 });
  const store = {
    read: vi
      .fn()
      .mockResolvedValueOnce(old)
      .mockResolvedValueOnce(old)
      .mockResolvedValue(null),
    acquire: vi.fn().mockResolvedValue("owner"),
    commit: vi.fn().mockResolvedValue(false),
    release: vi.fn(),
  } as unknown as SessionStore;
  grant.mockResolvedValue({
    access_token: "new",
    refresh_token: "new-refresh",
    expires_in: 3600,
    claims: () => undefined,
  });
  expect(
    await currentSession(
      "id",
      store,
      async () =>
        ({ clientMetadata: () => ({ client_id: "test" }) }) as Configuration,
    ),
  ).toBeNull();
});
it("does not turn a temporary provider outage into signed-out state", async () => {
  const store = {
    read: vi.fn().mockResolvedValue(record({ ...fresh(), tokenExpiresAt: 0 })),
    acquire: vi.fn().mockResolvedValue("owner"),
    release: vi.fn(),
  } as unknown as SessionStore;
  grant.mockRejectedValue(new Error("network failure"));
  await expect(
    currentSession(
      "id",
      store,
      async () =>
        ({ clientMetadata: () => ({ client_id: "test" }) }) as Configuration,
    ),
  ).rejects.toThrow();
});
