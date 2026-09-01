import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MediaFallback } from "@/components/ui/media-fallback";

afterEach(cleanup);

describe("MediaFallback", () => {
  it("provides useful visible fallback copy", () => {
    render(<MediaFallback />);
    expect(screen.getByText("Image coming soon")).toBeVisible();
  });

  it("accepts context-specific fallback copy", () => {
    render(<MediaFallback label="Product photography unavailable" />);
    expect(screen.getByText("Product photography unavailable")).toBeVisible();
  });
});
