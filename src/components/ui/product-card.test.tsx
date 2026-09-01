import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import {
  formatProductCardPrice,
  ProductCard,
  type ProductCardProps,
} from "@/components/ui/product-card";

const product = {
  href: "/products/bois-de-santal",
  name: "Bois de Santal",
  format: "Reed diffuser · 200ml",
  notes: "Cardamom · rose · sandalwood",
  price: { amount: "420", currencyCode: "ZAR" },
  image: {
    src: "/images/products/fixtures/bois-de-santal.png",
    alt: "Bois de Santal reed diffuser in an interior setting",
  },
} satisfies ProductCardProps;

afterEach(cleanup);

describe("ProductCard", () => {
  it("uses one named product-detail link", () => {
    render(<ProductCard {...product} />);

    const link = screen.getByRole("link", { name: "View Bois de Santal" });
    expect(link).toHaveAttribute("href", product.href);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders a useful product image alternative", () => {
    render(<ProductCard {...product} />);
    expect(screen.getByRole("img", { name: product.image.alt })).toBeVisible();
  });

  it("keeps the destination and details when the image is absent", () => {
    render(<ProductCard {...product} image={undefined} />);
    expect(screen.getByText("Image coming soon")).toBeVisible();
    expect(screen.getByText("Bois de Santal")).toBeVisible();
    expect(screen.getByText("R 420")).toBeVisible();
  });

  it("falls back without losing details when the image fails", () => {
    render(<ProductCard {...product} />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("Image coming soon")).toBeVisible();
    expect(screen.getByText("Bois de Santal")).toBeVisible();
  });

  it("keeps sold-out products linked and exposes status as text", () => {
    render(<ProductCard {...product} availability="sold-out" />);
    expect(screen.getByText("Sold out")).toBeVisible();
    expect(screen.getByRole("link")).toHaveAttribute("href", product.href);
  });

  it("keeps the ordinary in-stock state quiet", () => {
    render(<ProductCard {...product} availability="in-stock" />);
    expect(screen.queryByText("In stock")).not.toBeInTheDocument();
  });

  it("composes low-stock status with a truthful quantity", () => {
    render(
      <ProductCard {...product} availability="low-stock" lowStockCount={3} />,
    );
    expect(screen.getByText("Only 3 left")).toBeVisible();
  });

  it("composes a sale price with its compare-at value", () => {
    render(
      <ProductCard
        {...product}
        compareAtPrice={{ amount: "520", currencyCode: "ZAR" }}
      />,
    );
    expect(screen.getByText("Sale price:")).toBeInTheDocument();
    expect(screen.getByText("Original price:")).toBeInTheDocument();
    expect(screen.getByText("R 520").closest("s")).toBeInTheDocument();
  });

  it("receives keyboard focus as a whole card", async () => {
    const user = userEvent.setup();
    render(<ProductCard {...product} />);
    await user.tab();
    expect(screen.getByRole("link")).toHaveFocus();
  });

  it("formats Shopify-style money strings for South Africa", () => {
    expect(formatProductCardPrice({ amount: "420", currencyCode: "ZAR" })).toBe(
      "R 420",
    );
  });

  it("preserves full long content without line clamping", () => {
    const { container } = render(
      <ProductCard
        {...product}
        name="Cedar Veil — Limited Presentation Edition for Considered Living Rooms"
        notes="Resin · citrus · warm wood · a complete note description that remains visible"
      />,
    );
    expect(container.querySelector("h3")).not.toHaveClass("line-clamp-2");
    expect(screen.getByText(/Limited Presentation Edition/)).toBeVisible();
  });

  it("announces loading while preserving a non-animated reduced-motion fallback", () => {
    render(<ProductCard {...product} loading />);
    const card = screen.getByRole("link", { name: "View Bois de Santal" });
    expect(card).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading product image")).toHaveClass(
      "motion-reduce:animate-none",
    );
  });
});
