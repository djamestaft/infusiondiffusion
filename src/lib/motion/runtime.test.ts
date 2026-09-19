import { describe, expect, it, vi } from "vitest";
import { mountDeferredMotion } from "./runtime";

describe("deferred motion ownership", () => {
  it("never mounts an import that finishes after cleanup", async () => {
    let resolve!: (value: string) => void;
    const promise = new Promise<string>((done) => {
      resolve = done;
    });
    const mount = vi.fn();
    const stop = mountDeferredMotion(() => promise, mount);
    stop();
    resolve("ready");
    await promise;
    await Promise.resolve();
    expect(mount).not.toHaveBeenCalled();
  });
  it("reverts only its owned effects exactly once", async () => {
    const revert = vi.fn();
    const stop = mountDeferredMotion(
      () => Promise.resolve("ready"),
      () => revert,
    );
    await Promise.resolve();
    await Promise.resolve();
    stop();
    stop();
    expect(revert).toHaveBeenCalledTimes(1);
  });
  it("keeps static content on import failure", async () => {
    const mount = vi.fn();
    const stop = mountDeferredMotion(
      () => Promise.reject(new Error("offline")),
      mount,
    );
    await Promise.resolve();
    await Promise.resolve();
    stop();
    expect(mount).not.toHaveBeenCalled();
  });
});
