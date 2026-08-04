import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  CollectionTemplate,
  EditorialTemplate,
  HomeTemplate,
  ProductDetailTemplate,
} from "@/components/templates/storefront-templates";
import { productCardFixtures } from "@/components/ui/product-card.fixtures";

afterEach(cleanup);

describe("storefront templates", () => {
  it("composes the home journey from accessible landmarks and product cards", () => {
    render(
      <HomeTemplate
        products={productCardFixtures}
        heroImage={productCardFixtures[5].image}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Fragrance, composed",
    );
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: "Shop the collection" }),
    ).toHaveAttribute("href", "/shop");
  });

  it("gives an empty collection a useful route back", () => {
    render(<CollectionTemplate products={[]} />);
    expect(screen.getByText("0 products")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "No fragrances found" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View all products" }),
    ).toHaveAttribute("href", "/shop");
  });

  it("disables the purchase primitive when a product is sold out", () => {
    render(
      <ProductDetailTemplate
        product={{ ...productCardFixtures[5], availability: "sold-out" }}
        description="A warm, composed scent."
        details={[]}
      />,
    );
    expect(
      screen.getByText("Sold out", {
        selector: "span[data-slot='commerce-status']",
      }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Sold out" })).toBeDisabled();
  });

  it("requires an available variant before the purchase action", () => {
    render(
      <ProductDetailTemplate
        product={productCardFixtures[5]}
        description="A warm, composed scent."
        details={[]}
        variants={[
          { id: "diffuser", label: "Diffuser", available: true },
          { id: "refill", label: "Refill", available: false },
        ]}
        selectedVariantId="refill"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Refill — unavailable" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Choose a format" }),
    ).toBeDisabled();
    expect(
      screen.getByText("Select an available format to continue."),
    ).toBeVisible();
  });

  it("does not claim Shop is the current page on Home or Product detail", () => {
    const { unmount } = render(
      <HomeTemplate products={[]} heroImage={undefined} />,
    );
    expect(
      screen.queryByRole("link", { current: "page" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1 }).closest("section"),
    ).not.toHaveClass("lg:grid-cols-2");
    unmount();
    render(
      <ProductDetailTemplate
        product={{ ...productCardFixtures[5], image: undefined }}
        description="A warm, composed scent."
        details={[]}
      />,
    );
    expect(
      screen.queryByRole("link", { current: "page" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Image coming soon")).toBeVisible();
  });

  it("keeps an editorial article meaningful without optional imagery or sections", () => {
    render(
      <EditorialTemplate
        title="Choosing home fragrance"
        introduction="A practical introduction."
        image={undefined}
        sections={[]}
      />,
    );
    expect(screen.getByRole("article")).toBeVisible();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Choosing home fragrance",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
