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
    expect(
      screen.getByRole("navigation", { name: "Primary" }).closest("header"),
    ).toHaveClass("border-navigation-divider", "border-b");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Fragrance, composed",
    );
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(3);
    expect(screen.getByTestId("home-cabinet-band")).toHaveClass(
      "bg-content-surface-elevated",
    );
    expect(screen.getByTestId("home-cabinet-band")).not.toHaveClass(
      "border",
      "shadow",
    );
    expect(screen.getByTestId("home-cabinet-inner")).toHaveClass(
      "max-w-7xl",
      "pt-[52px]",
      "lg:pt-[72px]",
    );
    expect(
      screen.getByRole("heading", { name: "A cabinet of atmosphere" }),
    ).toHaveClass("mb-8");
    expect(
      screen.getAllByRole("link", { name: "Shop the collection" }),
    ).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Born from fragrance" }),
    ).toBeVisible();
    expect(screen.getByText(/Jacqui Kirchmann/)).toBeVisible();
    expect(screen.getByText(/8–12 months/)).toBeVisible();
  });

  it("gives an empty collection a useful route back", () => {
    render(<CollectionTemplate products={[]} />);
    expect(screen.getByTestId("collection-browsing-surface")).toHaveClass(
      "bg-content-surface-elevated",
    );
    expect(screen.getByText("0 products")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "No fragrances found" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View all products" }),
    ).toHaveAttribute("href", "/shop");
  });

  it("keeps collection cards on the base surface without borders or shadows", () => {
    render(<CollectionTemplate products={productCardFixtures} />);
    const card = screen.getAllByRole("link", { name: /^View / })[0];
    expect(card).toHaveClass("bg-product-card-surface");
    expect(card).not.toHaveClass("border", "shadow");
    expect(screen.getByText("6 products").parentElement).not.toHaveClass(
      "border-y",
    );
  });

  it("keeps the home journey meaningful without catalogue data", () => {
    render(<HomeTemplate products={[]} heroImage={undefined} />);
    expect(
      screen.getByText("The collection is being prepared.", { exact: false }),
    ).toBeVisible();
    expect(
      screen.getAllByRole("link", { name: "Shop the collection" }),
    ).toHaveLength(2);
  });

  it("renders Sanity-owned homepage copy through the template contract", () => {
    render(
      <HomeTemplate
        products={[]}
        heroImage={undefined}
        content={{
          heroTitle: "A home title from Sanity",
          collectionTitle: "A collection title from Sanity",
        }}
      />,
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A home title from Sanity",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "A collection title from Sanity",
      }),
    ).toBeVisible();
  });

  it("lets editors hide optional homepage storytelling sections", () => {
    render(
      <HomeTemplate
        products={[]}
        heroImage={undefined}
        content={{
          showServiceReassurance: false,
          showFounderStory: false,
          showLongevity: false,
          showCollectionInvitation: false,
        }}
      />,
    );

    expect(screen.queryByText("Born from fragrance")).not.toBeInTheDocument();
    expect(screen.queryByText(/8–12 months/)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Six fragrances. A roomful of possibility."),
    ).not.toBeInTheDocument();
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

  it("renders editor-owned context and the live cart state", () => {
    render(
      <EditorialTemplate
        eyebrow="A guide from Sanity"
        title="Choosing home fragrance"
        introduction="A practical introduction."
        image={undefined}
        sections={[]}
        currentHref="/fragrance-guide"
        cartCount={2}
      />,
    );

    expect(screen.getByText("A guide from Sanity")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Fragrance Guide", current: "page" }),
    ).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Cart, 2 items" })).toHaveLength(
      2,
    );
  });
});
