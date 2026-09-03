import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CollectionTemplate,
  EditorialTemplate,
  HomeTemplate,
  ProductDetailTemplate,
  AboutTemplate,
  ContactErrorTemplate,
  ContactLoadingTemplate,
  ContactTemplate,
  GalleryLoadingTemplate,
  GalleryTemplate,
} from "@/components/templates/storefront-templates";
import { productCardFixtures } from "@/components/ui/product-card.fixtures";

afterEach(cleanup);

const galleryItem = (id: string, title: string) => ({
  id,
  title,
  caption: `${title} caption.`,
  image: {
    src: "data:image/svg+xml,test",
    alt: `${title} factual image`,
    dimensions: { width: 1280, height: 960, aspectRatio: 4 / 3 },
  },
});

describe("storefront templates", () => {
  it("renders the Gallery with one H1, current navigation, and an honest empty state", () => {
    render(
      <GalleryTemplate
        title="Rooms, composed in scent"
        introduction="A study in fragrance, vessel and atmosphere."
        closingLine="Every room carries its own atmosphere."
        campaignItems={[]}
        marketItems={[]}
        cartCount={2}
      />,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Gallery", current: "page" }),
    ).toBeVisible();
    expect(screen.getByText("The gallery is being composed")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Explore the collection" }),
    ).toHaveAttribute("href", "/shop");
    expect(screen.getAllByRole("link", { name: "Cart, 2 items" })).toHaveLength(
      2,
    );
  });

  it("renders separate campaign and market grids with coherent headings and local viewers", async () => {
    const user = userEvent.setup();
    render(
      <GalleryTemplate
        title="Rooms, composed in scent"
        introduction="A study in fragrance, vessel and atmosphere."
        closingLine="Every room carries its own atmosphere."
        campaignItems={[
          galleryItem("campaign-one", "Campaign one"),
          galleryItem("campaign-two", "Campaign two"),
        ]}
        marketItems={[
          galleryItem("market-one", "Market one"),
          galleryItem("market-two", "Market two"),
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Campaign one" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "In the Market" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: "Market one" }),
    ).toBeVisible();
    expect(screen.getAllByTestId("gallery-grid")).toHaveLength(2);
    expect(screen.getByTestId("market-gallery-section")).toHaveClass(
      "max-w-[1440px]",
      "px-4",
      "min-[390px]:px-6",
      "lg:px-16",
    );
    expect(
      screen.getByText("Every room carries its own atmosphere."),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "View Market one" }));
    expect(screen.getByText("Image 1 of 2")).toBeVisible();
  });

  it("renders either Gallery group independently", () => {
    const { rerender } = render(
      <GalleryTemplate
        title="Rooms, composed in scent"
        introduction="A study in fragrance, vessel and atmosphere."
        closingLine="Every room carries its own atmosphere."
        campaignItems={[galleryItem("campaign", "Campaign only")]}
        marketItems={[]}
      />,
    );
    expect(screen.queryByRole("heading", { name: "In the Market" })).toBeNull();

    rerender(
      <GalleryTemplate
        title="Rooms, composed in scent"
        introduction="A study in fragrance, vessel and atmosphere."
        closingLine="Every room carries its own atmosphere."
        campaignItems={[]}
        marketItems={[galleryItem("market", "Market only")]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "In the Market" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: "Market only" }),
    ).toBeVisible();
  });

  it("labels Gallery loading without motion-dependent content", () => {
    render(<GalleryLoadingTemplate />);
    expect(screen.getByLabelText("Loading gallery")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "Gallery", current: "page" }),
    ).toBeVisible();
  });

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
    expect(screen.getByTestId("home-hero-section")).toHaveClass(
      "dark",
      "bg-content-surface",
      "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.093fr)]",
    );
    expect(
      screen.getAllByRole("link", { name: "Shop the collection" })[0],
    ).toHaveClass("rounded-full", "w-[236px]");
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(4);
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
      screen.getByRole("heading", { name: "Artistry in Fragrance" }),
    ).toBeVisible();
    expect(screen.getByText(/Designed for themed elegance/)).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Discover our story" }),
    ).toHaveAttribute("href", "/about");
    const guidance = screen.getByRole("heading", {
      name: "Choose by the room, then by the feeling",
    });
    const bespoke = screen.getByRole("region", { name: "Bespoke diffusers" });
    const longevity = screen.getByRole("heading", { name: "Made to linger" });
    const artistry = screen.getByRole("heading", {
      name: "Artistry in Fragrance",
    });
    expect(
      guidance.compareDocumentPosition(bespoke) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      bespoke.compareDocumentPosition(longevity) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      longevity.compareDocumentPosition(artistry) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByText(/8–12 months/)).toBeVisible();
  });

  it("renders Contact as a direct-email-only route with the current navigation and cart", () => {
    render(
      <ContactTemplate
        title="Let’s talk fragrance."
        introduction="A direct email introduction."
        email="hello@infusiondiffusion.co.za"
        cartCount={3}
        sections={[
          { heading: "Before you write", body: "Use the product name." },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Let’s talk fragrance.",
    );
    expect(
      screen.getByRole("link", { name: "Contact", current: "page" }),
    ).toBeVisible();
    expect(
      screen.getAllByRole("link", { name: "Email Infusion Diffusion" }),
    ).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Email Infusion Diffusion" }),
    ).toHaveAttribute("href", "mailto:hello@infusiondiffusion.co.za");
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("Contact us by email")).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Cart, 3 items" })).toHaveLength(
      2,
    );
  });

  it("keeps Contact loading and error recovery honest", async () => {
    const reset = vi.fn();
    const { unmount } = render(<ContactLoadingTemplate />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeVisible();
    expect(screen.getByLabelText("Loading contact page")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    unmount();
    render(<ContactErrorTemplate reset={reset} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Unexpected error");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("link", { name: "hello@infusiondiffusion.co.za" }),
    ).toHaveAttribute("href", "mailto:hello@infusiondiffusion.co.za");
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

  it("marks Shop current on Home but not on Product detail", () => {
    const { unmount } = render(
      <HomeTemplate products={[]} heroImage={undefined} />,
    );
    expect(
      screen.getByRole("link", { name: "Shop", current: "page" }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: "A reed diffuser arranged in a serene living space",
      }),
    ).toBeVisible();
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

  it("renders the approved About hierarchy, surfaces, CTA and current navigation", () => {
    render(
      <AboutTemplate
        title="The story behind the atmosphere."
        introduction="A considered collection."
        cartCount={2}
        chapters={[
          {
            role: "origin",
            heading: "Born from fragrance",
            body: "A factual origin.",
          },
          {
            role: "development",
            heading: "From more than 130 oils to six fragrances",
            body: "A factual development.",
          },
          {
            role: "collaborator",
            heading: "Guidance and encouragement",
            body: "A factual credit.",
          },
          {
            role: "principles",
            heading: "Composed for lived-in rooms",
            body: "A factual principle.",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "The story behind",
    );
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(5);
    expect(
      screen.getByRole("link", { name: "About", current: "page" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Explore the Fragrance Guide/i }),
    ).toHaveAttribute("href", "/fragrance-guide");
    expect(screen.getByTestId("about-chapter-origin")).toHaveClass(
      "bg-bone-50",
    );
    expect(screen.getByTestId("about-chapter-development")).toHaveClass(
      "bg-content-surface",
    );
    expect(screen.getByTestId("about-chapter-collaborator")).toHaveClass(
      "bg-bone-50",
    );
    expect(screen.getByTestId("about-chapter-principles")).toHaveClass(
      "bg-content-surface",
    );
    expect(screen.getByRole("link", { name: "Shop" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getAllByRole("link", { name: "Cart, 2 items" })).toHaveLength(
      2,
    );
  });

  it("keeps portrait FIT media inside independent 4:3 slots", () => {
    render(
      <AboutTemplate
        title="About"
        introduction="Lead"
        chapters={[
          {
            role: "origin",
            heading: "Origin",
            body: "Body",
            image: { src: "data:image/svg+xml,test", alt: "Test portrait" },
          },
          { role: "development", heading: "Development", body: "Body" },
          { role: "collaborator", heading: "Collaborator", body: "Body" },
          { role: "principles", heading: "Principles", body: "Body" },
        ]}
      />,
    );
    expect(screen.getByTestId("about-media-slot-origin")).toHaveClass(
      "aspect-4/3",
    );
    expect(screen.getByTestId("about-media-artwork-origin")).toHaveClass(
      "aspect-3/4",
      "mx-auto",
      "h-full",
    );
    expect(screen.getByRole("img", { name: "Test portrait" })).toHaveClass(
      "object-contain",
    );
    expect(
      screen.queryByTestId("about-media-slot-development"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("about-chapter-development").firstElementChild,
    ).toHaveClass("text-center");
    const origin = screen.getByTestId("about-chapter-origin");
    const heading = origin.querySelector("h2")!;
    const image = screen.getByRole("img", { name: "Test portrait" });
    expect(heading.compareDocumentPosition(image)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
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
