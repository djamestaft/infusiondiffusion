import { cleanup, render, screen } from "@testing-library/react";
import { Navigation } from "@/components/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";

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
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it.each(["true", "false", "TRUE", ""])(
    "shares the exact account enablement flag (%s) with every page navigation",
    async (value) => {
      vi.stubEnv("SHOPIFY_ACCOUNT_HANDOFF_ENABLED", value);
      render(await WebsiteLayout({ children: <Navigation /> }));
      if (value === "true") {
        expect(
          screen.getAllByRole("link", { name: "Account" })[0],
        ).toHaveAttribute("href", "/account");
      } else {
        expect(screen.queryByRole("link", { name: "Account" })).toBeNull();
      }
    },
  );

  it("waits for the Sanity invalidation function before refreshing published content", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
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

  it("does not wait for the production function outside production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const layout = await WebsiteLayout({ children: <main>Storefront</main> });
    const liveElement = layout.props.children[1];
    liveElement.type(liveElement.props);

    expect(sanityLiveMock).toHaveBeenLastCalledWith({
      includeDrafts: false,
      waitFor: undefined,
    });
  });
});
