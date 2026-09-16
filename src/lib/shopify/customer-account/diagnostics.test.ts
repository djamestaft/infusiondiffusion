// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { reportCallbackFailure } from "./diagnostics";
afterEach(() => vi.restoreAllMocks());
it("logs only allowlisted classifications from provider failures", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  reportCallbackFailure("callback.exchange", {
    code: "OAUTH_RESPONSE_BODY_ERROR",
    error: "invalid_client",
    error_description: "private-client-secret",
    cause: {
      code: "private-authorization-code",
      email: "private@example.test",
    },
  });
  expect(log).toHaveBeenCalledWith(
    '[customer-account] {"stage":"callback.exchange","code":"OAUTH_RESPONSE_BODY_ERROR","provider":"invalid_client"}',
  );
});
it("does not reflect unrecognised provider-controlled codes or error objects", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  reportCallbackFailure("callback.exchange", {
    code: "private-token",
    error: "private-client-secret",
    message: "private-profile",
  });
  expect(log).toHaveBeenCalledWith(
    '[customer-account] {"stage":"callback.exchange","code":"unknown"}',
  );
});
