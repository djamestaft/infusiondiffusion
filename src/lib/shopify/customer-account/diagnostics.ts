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

// Match only fixed field/rule names; never return a provider/library message.
function failureReason(error: unknown): string | undefined {
  let current = error;
  for (let depth = 0; depth < 3; depth++) {
    if (!current || typeof current !== "object") return;
    const message =
      "message" in current && typeof current.message === "string"
        ? current.message
        : "";
    if (message === 'JWT "sub" (subject) claim missing')
      return "jwt.sub.missing";
    if (message === 'unexpected JWT "sub" (subject) claim type') {
      const cause = "cause" in current ? current.cause : undefined;
      const claims =
        cause && typeof cause === "object" && "claims" in cause
          ? cause.claims
          : undefined;
      if (claims && typeof claims === "object" && "sub" in claims) {
        // Only the primitive type reaches logs, never a claim value or payload.
        const value = claims.sub;
        const type =
          value === null
            ? "null"
            : Array.isArray(value)
              ? "array"
              : typeof value;
        return `jwt.sub.type.${type}`;
      }
      return "jwt.sub.type.unknown";
    }
    for (const field of [
      "access_token",
      "token_type",
      "expires_in",
      "refresh_token",
      "id_token",
      "scope",
      "keys",
    ]) {
      if (message.startsWith(`"response" body "${field}"`))
        return `response.${field}`;
    }
    for (const claim of [
      "iss",
      "sub",
      "aud",
      "exp",
      "iat",
      "nonce",
      "auth_time",
      "azp",
      "nbf",
      "at_hash",
      "c_hash",
    ]) {
      if (
        message.includes(`JWT "${claim}"`) ||
        message.includes(`ID Token "${claim}"`)
      )
        return `jwt.${claim}`;
    }
    if (message === "JWT signature verification failed") return "jwt.signature";
    if (message === "Invalid JWT") return "jwt.format";
    if (message === 'unexpected JWT "alg" header parameter')
      return "jwt.algorithm";
    if (message === 'unexpected JWT "typ" header parameter value')
      return "jwt.type";
    if (message === 'response parameter "iss" (issuer) missing')
      return "callback.issuer-missing";
    if (message === 'no authorization code in "callbackParameters"')
      return "callback.code-missing";
    current = "cause" in current ? current.cause : undefined;
  }
}

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
  const reason = failureReason(error);
  console.error(
    "[customer-account] " +
      JSON.stringify({
        stage,
        code,
        ...(provider ? { provider } : {}),
        ...(reason ? { reason } : {}),
      }),
  );
}
