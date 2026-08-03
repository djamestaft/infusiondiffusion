import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  formatCommerceMoney,
  PriceDisplay,
} from "@/components/ui/price-display";

const zar = { amount: "420", currencyCode: "ZAR" };

afterEach(cleanup);

describe("PriceDisplay", () => {
  it("formats ZAR money for en-ZA without non-breaking spaces", () => {
    expect(formatCommerceMoney(zar)).toBe("R 420");
    expect(
      formatCommerceMoney({ amount: "1249.95", currencyCode: "ZAR" }),
    ).toBe("R 1 249,95");
  });

  it("returns the supplied amount when it cannot format the money", () => {
    expect(
      formatCommerceMoney({ amount: "Price unavailable", currencyCode: "ZAR" }),
    ).toBe("Price unavailable");
    expect(formatCommerceMoney({ amount: "420", currencyCode: "???" })).toBe(
      "420",
    );
  });

  it("identifies sale and original prices for assistive technology", () => {
    render(
      <PriceDisplay
        price={zar}
        compareAtPrice={{ amount: "520", currencyCode: "ZAR" }}
        type="sale"
      />,
    );

    expect(screen.getByText("Sale price:")).toHaveClass("sr-only");
    expect(screen.getByText("Original price:")).toHaveClass("sr-only");
    expect(screen.getByText("R 520").closest("s")).toBeInTheDocument();
  });

  it("degrades a sale without compare-at money to the current price", () => {
    render(<PriceDisplay price={zar} type="sale" />);
    expect(screen.getByText("R 420")).toBeVisible();
    expect(screen.queryByText("Sale price:")).not.toBeInTheDocument();
  });

  it("renders explicit starting-price language", () => {
    render(<PriceDisplay price={zar} type="from" />);
    expect(screen.getByText("From")).toBeVisible();
  });
});
