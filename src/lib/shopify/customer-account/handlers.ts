import "server-only";
import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import {
  readCustomerConfig,
  SESSION_COOKIE,
  TRANSACTION_COOKIE,
  SESSION_SECONDS,
  cookieOptions,
  safeReturnPath,
} from "./config";
import { newIdentifier } from "./crypto";
import {
  discoverCustomerClient,
  sessionFromTokens,
  transactionSchema,
  sessionSchema,
} from "./oauth";
import { SessionStore } from "./store";
import { currentSession } from "./session";
import { normalizeProfile, customerResponseSchema } from "./profile";

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};
const go = (url: URL | string) =>
  NextResponse.redirect(url, { status: 303, headers: privateHeaders });
const local = (request: NextRequest, path: string) =>
  go(new URL(path, request.url));
const clear = (response: NextResponse, name: string) =>
  response.cookies.set(name, "", { ...cookieOptions, maxAge: 0 });
export async function accountLogin(request: NextRequest) {
  try {
    const settings = readCustomerConfig();
    if (!settings) return local(request, "/account");
    if (request.nextUrl.origin !== settings.origin)
      return local(request, "/account?notice=error");
    const store = new SessionStore(settings);
    const { client } = await discoverCustomerClient(settings);
    const id = newIdentifier();
    const transaction = {
      state: oidc.randomState(),
      nonce: oidc.randomNonce(),
      verifier: oidc.randomPKCECodeVerifier(),
      returnTo: safeReturnPath(request.nextUrl.searchParams.get("returnTo")),
      expiresAt: Date.now() + 600000,
    };
    const url = oidc.buildAuthorizationUrl(client, {
      redirect_uri: settings.callback,
      scope: "openid email customer-account-api:full",
      response_type: "code",
      state: transaction.state,
      nonce: transaction.nonce,
      code_challenge: await oidc.calculatePKCECodeChallenge(
        transaction.verifier,
      ),
      code_challenge_method: "S256",
    });
    await store.put("login", id, transaction, 600);
    const response = go(url);
    response.cookies.set(TRANSACTION_COOKIE, id, {
      ...cookieOptions,
      maxAge: 600,
    });
    return response;
  } catch {
    return local(request, "/account?notice=error");
  }
}
export async function accountCallback(request: NextRequest) {
  let response: NextResponse;
  try {
    const settings = readCustomerConfig();
    if (!settings || request.nextUrl.origin !== settings.origin)
      throw new Error();
    const store = new SessionStore(settings);
    // Claim once, while retaining an atomic revocation marker for concurrent logout.
    const loginId = request.cookies.get(TRANSACTION_COOKIE)?.value;
    const record = await store.claimLogin(loginId);
    const transaction = transactionSchema.parse(record?.value);
    if (
      transaction.expiresAt <= Date.now() ||
      request.nextUrl.searchParams.get("state") !== transaction.state
    )
      throw new Error();
    const { client } = await discoverCustomerClient(settings);
    const tokens = await oidc.authorizationCodeGrant(
      client,
      new URL(request.url),
      {
        expectedState: transaction.state,
        expectedNonce: transaction.nonce,
        pkceCodeVerifier: transaction.verifier,
        idTokenExpected: true,
      },
      { client_id: settings.clientId },
    );
    const session = sessionFromTokens(
      tokens,
      Date.now() + SESSION_SECONDS * 1000,
    );
    const id = newIdentifier();
    await store.remove(request.cookies.get(SESSION_COOKIE)?.value);
    if (
      !(await store.commitLogin(
        loginId!,
        record!.raw,
        id,
        session,
        SESSION_SECONDS,
      ))
    )
      throw new Error();
    response = go(
      new URL(safeReturnPath(transaction.returnTo), settings.origin),
    );
    response.cookies.set(SESSION_COOKIE, id, {
      ...cookieOptions,
      maxAge: SESSION_SECONDS,
    });
  } catch {
    response = local(request, "/account?notice=error");
  }
  clear(response, TRANSACTION_COOKIE);
  return response;
}
export async function accountProfile(request: NextRequest) {
  try {
    const settings = readCustomerConfig();
    const id = request.cookies.get(SESSION_COOKIE)?.value;
    if (!settings || !id)
      return NextResponse.json(
        { status: "signed-out" },
        { headers: privateHeaders },
      );
    if (request.nextUrl.origin !== settings.origin) throw new Error();
    const store = new SessionStore(settings);
    let discovery:
      Awaited<ReturnType<typeof discoverCustomerClient>> | undefined;
    const discover = async () =>
      (discovery ??= await discoverCustomerClient(settings));
    const session = await currentSession(
      id,
      store,
      async () => (await discover()).client,
    );
    if (!session) {
      const response = NextResponse.json(
        { status: "expired" },
        { headers: privateHeaders },
      );
      clear(response, SESSION_COOKIE);
      return response;
    }
    const r = await fetch((await discover()).graphql, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session.accessToken,
      },
      body: JSON.stringify({
        query:
          "query CustomerProfile { customer { id firstName lastName emailAddress { emailAddress } } }",
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (r.status === 401) {
      await store.remove(id);
      const response = NextResponse.json(
        { status: "expired" },
        { headers: privateHeaders },
      );
      clear(response, SESSION_COOKIE);
      return response;
    }
    if (!r.ok) throw new Error();
    const body = customerResponseSchema.parse(await r.json());
    if (body.errors?.length) throw new Error();
    // A concurrent logout must not leave a successful profile response behind.
    if (!(await store.read("session", id)))
      return NextResponse.json(
        { status: "signed-out" },
        { headers: privateHeaders },
      );
    return NextResponse.json(
      { status: "signed-in", profile: normalizeProfile(body.data.customer) },
      { headers: privateHeaders },
    );
  } catch {
    return NextResponse.json(
      { status: "error" },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function accountLogout(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return new NextResponse(null, { status: 403, headers: privateHeaders });
  try {
    const settings = readCustomerConfig();
    if (!settings || request.nextUrl.origin !== settings.origin)
      throw new Error();
    const store = new SessionStore(settings);
    const id = request.cookies.get(SESSION_COOKIE)?.value;
    const record = await store.read("session", id);
    const session = sessionSchema.safeParse(record?.value);
    await store.remove(id);
    // Also invalidate a pending login so an old callback cannot sign back in.
    await store.revokeLogin(request.cookies.get(TRANSACTION_COOKIE)?.value);
    let destination: URL | string = new URL(
      "/account?notice=signed-out",
      settings.origin,
    );
    if (session.success) {
      try {
        const { client } = await discoverCustomerClient(settings);
        destination = oidc.buildEndSessionUrl(client, {
          id_token_hint: session.data.idToken,
          post_logout_redirect_uri: settings.logout,
        });
      } catch {
        // Local logout succeeded; be explicit if the hosted logout could not start.
        destination = new URL("/account?notice=local-signout", settings.origin);
      }
    }
    const response = go(destination);
    clear(response, SESSION_COOKIE);
    clear(response, TRANSACTION_COOKIE);
    return response;
  } catch {
    return local(request, "/account?notice=error");
  }
}
