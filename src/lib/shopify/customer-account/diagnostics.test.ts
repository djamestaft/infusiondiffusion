// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { reportCallbackFailure } from "./diagnostics";
afterEach(() => vi.restoreAllMocks());
it.each([
  [undefined, "missing"],
  [null, "type.null"],
  [123456, "type.number"],
  [false, "type.boolean"],
  [["private-subject"], "type.array"],
  [{ private: "private-subject" }, "type.object"],
])(
  "classifies subject validation without disclosing its value (%s)",
  (sub, reason) => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    reportCallbackFailure("callback.exchange", {
      code: "OAUTH_INVALID_RESPONSE",
      cause: {
        message:
          sub === undefined
            ? 'JWT "sub" (subject) claim missing'
            : 'unexpected JWT "sub" (subject) claim type',
        cause: {
          claims: {
            sub,
            email: "private@example.test",
            nonce: "private-nonce",
          },
        },
      },
    });
    expect(log).toHaveBeenCalledWith(
      "[customer-account] " +
        JSON.stringify({
          stage: "callback.exchange",
          code: "OAUTH_INVALID_RESPONSE",
          reason: `jwt.sub.${reason}`,
        }),
    );
  },
);
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
it("classifies nested token response failures without logging response values", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  reportCallbackFailure("callback.exchange", {
    code: "OAUTH_INVALID_RESPONSE",
    cause: {
      message: '\"response\" body \"token_type\" property must be a string',
      cause: {
        body: { access_token: "private-access", email: "private@example.test" },
      },
    },
  });
  expect(log).toHaveBeenCalledWith(
    '[customer-account] {"stage":"callback.exchange","code":"OAUTH_INVALID_RESPONSE","reason":"response.token_type"}',
  );
});
it("never forwards arbitrary nested error messages", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  reportCallbackFailure("callback.exchange", {
    code: "OAUTH_INVALID_RESPONSE",
    cause: { message: "private-code-or-token" },
  });
  expect(log).toHaveBeenCalledWith(
    '[customer-account] {"stage":"callback.exchange","code":"OAUTH_INVALID_RESPONSE"}',
  );
});
