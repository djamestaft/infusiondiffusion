import "server-only";
import * as oidc from "openid-client";
import {
  sessionFromTokens,
  sessionSchema,
  type CustomerSession,
} from "./oauth";
import type { SessionStore } from "./store";

/** A distributed lease plus compare-and-set prevents stale refresh and logout resurrection. */
export async function currentSession(
  id: string,
  store: SessionStore,
  client: () => Promise<oidc.Configuration>,
): Promise<CustomerSession | null> {
  for (let attempt = 0; attempt < 30; attempt++) {
    const record = await store.read("session", id);
    if (!record) return null;
    const parsed = sessionSchema.safeParse(record.value);
    if (!parsed.success || parsed.data.expiresAt <= Date.now()) {
      await store.remove(id);
      return null;
    }
    if (parsed.data.tokenExpiresAt > Date.now() + 60000) return parsed.data;
    const configuredClient = await client();
    const owner = await store.acquire(id);
    if (!owner) {
      await new Promise((r) => setTimeout(r, 250));
      continue;
    }
    let refreshingRaw = record.raw;
    try {
      // Re-read after the lock; another instance may have refreshed since our first read.
      const latest = await store.read("session", id);
      if (!latest) return null;
      refreshingRaw = latest.raw;
      const session = sessionSchema.parse(latest.value);
      if (session.expiresAt <= Date.now()) {
        await store.remove(id);
        return null;
      }
      if (session.tokenExpiresAt > Date.now() + 60000) return session;
      const tokens = await oidc.refreshTokenGrant(
        configuredClient,
        session.refreshToken,
        { client_id: configuredClient.clientMetadata().client_id },
      );
      const updated = sessionFromTokens(tokens, session.expiresAt, session);
      if (
        await store.commit(
          id,
          owner,
          latest.raw,
          updated,
          Math.floor((session.expiresAt - Date.now()) / 1000),
        )
      )
        return updated;
      continue;
    } catch (error) {
      if (
        error instanceof oidc.ResponseBodyError &&
        error.error === "invalid_grant"
      ) {
        if (await store.invalidate(id, owner, refreshingRaw)) return null;
        continue;
      }
      throw new Error("Account service unavailable");
    } finally {
      await store.release(id, owner);
    }
  }
  throw new Error("Account service unavailable");
}
