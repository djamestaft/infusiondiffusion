import "server-only";

export type CallbackStage =
  | "callback.configuration"
  | "callback.origin"
  | "callback.cookie"
  | "callback.claim-login"
  | "callback.transaction"
  | "callback.state"
  | "callback.discovery"
  | "callback.exchange"
  | "callback.session"
  | "callback.rotate"
  | "callback.commit";

const codes = new Set([
  "OAUTH_INVALID_RESPONSE",
  "OAUTH_RESPONSE_IS_NOT_JSON",
  "OAUTH_RESPONSE_IS_NOT_CONFORM",
  "OAUTH_RESPONSE_BODY_ERROR",
  "OAUTH_AUTHORIZATION_RESPONSE_ERROR",
  "OAUTH_JWT_CLAIM_COMPARISON_FAILED",
  "OAUTH_JWT_TIMESTAMP_CHECK_FAILED",
  "OAUTH_KEY_SELECTION_FAILED",
  "OAUTH_SIGNATURE_VERIFICATION_FAILED",
  "OAUTH_UNSUPPORTED_OPERATION",
  "OAUTH_INVALID_REQUEST",
  "OAUTH_INVALID_SERVER_METADATA",
  "OAUTH_TIMEOUT",
  "OAUTH_ABORT",
]);
const providerErrors = new Set([
  "invalid_client",
  "invalid_grant",
  "invalid_request",
  "invalid_scope",
  "unauthorized_client",
  "unsupported_grant_type",
  "access_denied",
  "server_error",
  "temporarily_unavailable",
  "login_required",
  "consent_required",
]);

/** Only fixed classifications reach logs. Never serialize errors or OAuth data. */
export function reportCallbackFailure(stage: CallbackStage, error: unknown) {
  const details = error && typeof error === "object" ? error : {};
  const code =
    "code" in details &&
    typeof details.code === "string" &&
    codes.has(details.code)
      ? details.code
      : "unknown";
  const provider =
    "error" in details &&
    typeof details.error === "string" &&
    providerErrors.has(details.error)
      ? details.error
      : undefined;
  console.error(
    "[customer-account] " +
      JSON.stringify({ stage, code, ...(provider ? { provider } : {}) }),
  );
}
