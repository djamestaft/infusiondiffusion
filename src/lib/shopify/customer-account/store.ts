import "server-only";
import { newIdentifier, seal, unseal, validIdentifier } from "./crypto";
import type { CustomerConfig } from "./config";

export const ACQUIRE_REFRESH = `
if not redis.call('GET',KEYS[1]) then return 0 end
if redis.call('SET',KEYS[2],ARGV[1],'PX',45000,'NX') then return 1 end
return 0`;
export const COMMIT_REFRESH = `
if redis.call('GET',KEYS[2]) ~= ARGV[1] then return 0 end
if redis.call('GET',KEYS[1]) ~= ARGV[2] then return 0 end
redis.call('SET',KEYS[1],ARGV[3],'EX',ARGV[4])
redis.call('DEL',KEYS[2])
return 1`;
export const RELEASE_REFRESH = `
if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) end
return 0`;

export const INVALIDATE_REFRESH = `
if redis.call('GET',KEYS[2]) ~= ARGV[1] then return 0 end
if redis.call('GET',KEYS[1]) ~= ARGV[2] then return 0 end
redis.call('DEL',KEYS[1],KEYS[2])
return 1`;
export const CLAIM_LOGIN = `
local value=redis.call('GETDEL',KEYS[1])
if not value then return nil end
redis.call('SET',KEYS[2],value,'EX',600)
return value`;
export const COMMIT_LOGIN = `
if redis.call('GET',KEYS[1]) ~= ARGV[1] then return 0 end
if not redis.call('SET',KEYS[2],ARGV[2],'EX',ARGV[3],'NX') then return 0 end
redis.call('SET',KEYS[3],KEYS[2],'EX',600)
redis.call('DEL',KEYS[1])
return 1`;
export const REVOKE_LOGIN = `
local session=redis.call('GET',KEYS[3])
if session then redis.call('DEL',session) end
redis.call('DEL',KEYS[1],KEYS[2],KEYS[3])
return 1`;

/** Upstash REST transport. Tokens live only in authenticated encrypted payloads. */
export class SessionStore {
  constructor(private readonly config: CustomerConfig) {}
  private key(kind: string, id: string) {
    return `${this.config.prefix}:${kind}:${id}`;
  }
  private async command(args: (string | number)[]): Promise<unknown> {
    try {
      const r = await fetch(this.config.redisUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      if (data.error || !Object.hasOwn(data, "result")) throw new Error();
      return data.result;
    } catch {
      throw new Error("Account service unavailable");
    }
  }
  async put(kind: string, id: string, value: unknown, seconds: number) {
    const key = this.key(kind, id);
    const result = await this.command([
      "SET",
      key,
      seal(value, this.config.key, key),
      "EX",
      seconds,
      "NX",
    ]);
    if (result !== "OK") throw new Error("Account service unavailable");
  }
  async read(
    kind: string,
    id?: string,
    consume = false,
  ): Promise<{ value: unknown; raw: string } | null> {
    if (!validIdentifier(id)) return null;
    const key = this.key(kind, id!);
    const raw = await this.command([consume ? "GETDEL" : "GET", key]);
    if (raw === null) return null;
    if (typeof raw !== "string") throw new Error("Account service unavailable");
    try {
      return { value: unseal(raw, this.config.key, key), raw };
    } catch {
      await this.command(["DEL", key]);
      return null;
    }
  }
  async remove(id?: string) {
    if (validIdentifier(id))
      await this.command([
        "DEL",
        this.key("session", id!),
        this.key("lock", id!),
      ]);
  }
  async acquire(id: string) {
    const owner = newIdentifier();
    return (await this.command([
      "EVAL",
      ACQUIRE_REFRESH,
      2,
      this.key("session", id),
      this.key("lock", id),
      owner,
    ])) === 1
      ? owner
      : null;
  }
  async commit(
    id: string,
    owner: string,
    old: string,
    value: unknown,
    seconds: number,
  ) {
    if (seconds < 1) return false;
    const key = this.key("session", id);
    return (
      (await this.command([
        "EVAL",
        COMMIT_REFRESH,
        2,
        key,
        this.key("lock", id),
        owner,
        old,
        seal(value, this.config.key, key),
        seconds,
      ])) === 1
    );
  }
  async invalidate(id: string, owner: string, old: string) {
    return (
      (await this.command([
        "EVAL",
        INVALIDATE_REFRESH,
        2,
        this.key("session", id),
        this.key("lock", id),
        owner,
        old,
      ])) === 1
    );
  }
  async claimLogin(id?: string) {
    if (!validIdentifier(id)) return null;
    const key = this.key("login", id!);
    const raw = await this.command([
      "EVAL",
      CLAIM_LOGIN,
      2,
      key,
      this.key("pending", id!),
    ]);
    if (typeof raw !== "string") return null;
    return { raw, value: unseal(raw, this.config.key, key) };
  }
  async commitLogin(
    loginId: string,
    raw: string,
    sessionId: string,
    value: unknown,
    seconds: number,
  ) {
    const key = this.key("session", sessionId);
    return (
      (await this.command([
        "EVAL",
        COMMIT_LOGIN,
        3,
        this.key("pending", loginId),
        key,
        this.key("login-result", loginId),
        raw,
        seal(value, this.config.key, key),
        seconds,
      ])) === 1
    );
  }
  async revokeLogin(id?: string) {
    if (validIdentifier(id))
      await this.command([
        "EVAL",
        REVOKE_LOGIN,
        3,
        this.key("login", id!),
        this.key("pending", id!),
        this.key("login-result", id!),
      ]);
  }
  async release(id: string, owner: string) {
    await this.command([
      "EVAL",
      RELEASE_REFRESH,
      1,
      this.key("lock", id),
      owner,
    ]);
  }
}
