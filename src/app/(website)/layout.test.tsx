import { describe, expect, it, vi } from "vitest";

const { sanityLiveMock } = vi.hoisted(() => ({
  sanityLiveMock: vi.fn(() => null),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn().mockResolvedValue({ isEnabled: false }),
}));
vi.mock("next-sanity/visual-editing", () => ({
  VisualEditing: vi.fn(() => null),
}));
vi.mock("@/env", () => ({ isSanityConfigured: true }));
vi.mock("@/sanity/lib/live", () => ({ SanityLive: sanityLiveMock }));

import WebsiteLayout from "@/app/(website)/layout";

describe("website layout", () => {
  it("waits for the Sanity invalidation function before refreshing published content", async () => {
    const layout = await WebsiteLayout({ children: <main>Storefront</main> });

    // Invoke the returned server-component child to inspect its contract without
    // coupling this test to next-sanity's client implementation.
    const liveElement = layout.props.children[1];
    liveElement.type(liveElement.props);

    expect(sanityLiveMock).toHaveBeenCalledWith({
      includeDrafts: false,
      waitFor: "function",
    });
  });
});
