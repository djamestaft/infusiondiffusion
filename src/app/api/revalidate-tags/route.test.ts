import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { revalidateTagMock } = vi.hoisted(() => ({
  revalidateTagMock: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidateTag: revalidateTagMock }));

import { POST } from "@/app/api/revalidate-tags/route";

const secret = "test-revalidation-secret";

function request(body: unknown, authorization = `Bearer ${secret}`) {
  return new Request("https://example.com/api/revalidate-tags", {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("Sanity tag revalidation route", () => {
  beforeEach(() => {
    vi.stubEnv("SANITY_REVALIDATE_TAGS_SECRET", secret);
    revalidateTagMock.mockReset();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("expires each prefixed Sanity cache tag immediately", async () => {
    const response = await POST(request({ tags: ["s1:first", "s1:second"] }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ revalidated: 2 });
    expect(revalidateTagMock).toHaveBeenNthCalledWith(1, "sanity:s1:first", {
      expire: 0,
    });
    expect(revalidateTagMock).toHaveBeenNthCalledWith(2, "sanity:s1:second", {
      expire: 0,
    });
  });

  it("rejects an invalid bearer secret without revalidating", async () => {
    const response = await POST(
      request({ tags: ["s1:first"] }, "Bearer wrong"),
    );

    expect(response.status).toBe(401);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it("rejects malformed tag payloads", async () => {
    const response = await POST(request({ tags: [] }));

    expect(response.status).toBe(400);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });
});
