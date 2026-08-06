import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";

import {
  CollectionTemplate,
  EditorialTemplate,
  HomeTemplate,
  ProductDetailTemplate,
} from "@/components/templates/storefront-templates";
import { productCardFixtures } from "@/components/ui/product-card.fixtures";

const featured = productCardFixtures[5];
const productDetails = [
  { label: "Fragrance", value: "Cardamom, rose and sandalwood" },
  { label: "Format", value: "200ml reed diffuser" },
  { label: "Best for", value: "Living rooms, studies and quiet evenings" },
  { label: "Longevity", value: "Approximately three to four months" },
  { label: "Care", value: "Turn reeds weekly and protect finished surfaces" },
  { label: "Safety", value: "Keep away from children, pets and open flames" },
  {
    label: "Delivery",
    value: "Calculated at checkout for South African addresses",
  },
];
const variants = [
  { id: "200ml", label: "200ml diffuser", available: true },
  { id: "refill", label: "200ml refill", available: false },
];

const meta = {
  title: "Templates/Storefront",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

async function verifyHomeCabinetBand(
  canvasElement: HTMLElement,
  expectedGap: number,
) {
  const canvas = within(canvasElement);
  const band = canvas.getByTestId("home-cabinet-band");
  const inner = canvas.getByTestId("home-cabinet-inner");
  const controls = canvas.getByTestId("hero-carousel-controls");
  const heading = canvas.getByRole("heading", {
    name: "A cabinet of atmosphere",
  });
  const firstCard = canvas.getAllByRole("link", { name: /^View / })[0];
  const bandBounds = band.getBoundingClientRect();
  const innerBounds = inner.getBoundingClientRect();
  const controlsBounds = controls.getBoundingClientRect();
  const headingBounds = heading.getBoundingClientRect();

  await expect(getComputedStyle(band).backgroundColor).toBe(
    "rgb(227, 231, 218)",
  );
  await expect(getComputedStyle(firstCard).backgroundColor).toBe(
    "rgb(238, 240, 231)",
  );
  await expect(getComputedStyle(firstCard).borderTopWidth).toBe("0px");
  await expect(getComputedStyle(firstCard).boxShadow).toBe("none");
  await expect(headingBounds.top - controlsBounds.bottom).toBe(expectedGap);
  await expect(innerBounds.width).toBeLessThanOrEqual(1280);
  await expect(bandBounds.width).toBe(document.documentElement.clientWidth);
}

async function verifyCollectionSurface(
  canvasElement: HTMLElement,
  expectCards = true,
) {
  const canvas = within(canvasElement);
  const surface = canvas.getByTestId("collection-browsing-surface");
  await expect(getComputedStyle(surface).backgroundColor).toBe(
    "rgb(227, 231, 218)",
  );
  await expect(getComputedStyle(surface).borderTopWidth).toBe("0px");
  await expect(getComputedStyle(surface).boxShadow).toBe("none");
  if (expectCards) {
    const firstCard = canvas.getAllByRole("link", { name: /^View / })[0];
    await expect(getComputedStyle(firstCard).backgroundColor).toBe(
      "rgb(238, 240, 231)",
    );
    await expect(getComputedStyle(firstCard).borderTopWidth).toBe("0px");
    await expect(getComputedStyle(firstCard).boxShadow).toBe("none");
  }
}

export const HomeIvory: Story = {
  render: () => (
    <HomeTemplate
      products={productCardFixtures}
      heroSlides={[
        { id: "first", ...featured.image },
        { id: "second", ...productCardFixtures[4].image },
      ]}
      heroImage={featured.image}
    />
  ),
  play: async ({ canvasElement }) => verifyHomeCabinetBand(canvasElement, 72),
};
export const HomeMidnightNavigation: Story = {
  render: () => (
    <HomeTemplate
      products={productCardFixtures}
      heroImage={featured.image}
      navigationTheme="midnight"
    />
  ),
};
export const HomeMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <HomeTemplate
      products={productCardFixtures}
      heroSlides={[
        { id: "first", ...featured.image },
        { id: "second", ...productCardFixtures[4].image },
      ]}
      heroImage={featured.image}
    />
  ),
  play: async ({ canvasElement }) => verifyHomeCabinetBand(canvasElement, 52),
};
export const HomeEmptyCatalogue: Story = {
  render: () => <HomeTemplate products={[]} heroImage={undefined} />,
};
export const HomeLongContent: Story = {
  render: () => (
    <HomeTemplate
      products={productCardFixtures}
      heroImage={featured.image}
      content={{
        heroTitle:
          "Fragrance composed with clarity for every room you return to",
        heroIntroduction:
          "Discover considered diffusers, room sprays and candles with plainly described notes, useful format guidance and details designed for everyday South African homes.",
        collectionTitle:
          "A considered cabinet of atmosphere for rooms of every rhythm",
        guidanceTitle:
          "Choose first by the way a room is lived in, then by the feeling you want it to hold",
        founderTitle:
          "Born from an enduring fascination with the way fragrance changes a room",
        founderStory:
          "Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling. More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances.\n\nCreated with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts, each fragrance is composed with passion, elegance and soul for rooms that are actively lived in.",
        longevityConditions:
          "Room temperature, airflow, vessel placement and how often the reeds are turned will shape the pace of diffusion. Warmer, airier rooms may diffuse more quickly, while quieter conditions support a slower release over time.",
      }}
    />
  ),
};

export const HomeEditorialSectionsHidden: Story = {
  render: () => (
    <HomeTemplate
      products={productCardFixtures}
      heroImage={featured.image}
      content={{
        showServiceReassurance: false,
        showFounderStory: false,
        showLongevity: false,
        showCollectionInvitation: false,
      }}
    />
  ),
};

export const Collection: Story = {
  render: () => <CollectionTemplate products={productCardFixtures} />,
  play: async ({ canvasElement }) => verifyCollectionSurface(canvasElement),
};
export const CollectionEmpty: Story = {
  render: () => <CollectionTemplate products={[]} />,
  play: async ({ canvasElement }) =>
    verifyCollectionSurface(canvasElement, false),
};
export const CollectionMidnightNavigation: Story = {
  render: () => (
    <CollectionTemplate
      products={productCardFixtures}
      navigationTheme="midnight"
    />
  ),
};
export const CollectionMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => <CollectionTemplate products={productCardFixtures} />,
  play: async ({ canvasElement }) => verifyCollectionSurface(canvasElement),
};

export const ProductDetail: Story = {
  render: () => (
    <ProductDetailTemplate
      product={featured}
      description="A warm, composed scent with a dry sandalwood base and a soft floral centre. Made for spaces that invite lingering."
      details={productDetails}
      variants={variants}
      selectedVariantId="200ml"
      onAddToCart={fn()}
    />
  ),
};
export const ProductDetailSoldOut: Story = {
  render: () => (
    <ProductDetailTemplate
      product={{ ...featured, availability: "sold-out" }}
      description="A warm, composed scent with a dry sandalwood base and a soft floral centre."
      details={productDetails}
      variants={variants}
      selectedVariantId="200ml"
      navigationTheme="midnight"
    />
  ),
};
export const ProductDetailSale: Story = {
  render: () => (
    <ProductDetailTemplate
      product={{
        ...featured,
        compareAtPrice: { amount: "520", currencyCode: "ZAR" },
        priceType: "sale",
        availability: "low-stock",
        lowStockCount: 3,
      }}
      description="A warm, composed scent with a dry sandalwood base and a soft floral centre."
      details={productDetails}
      variants={variants}
      selectedVariantId="200ml"
      onAddToCart={fn()}
    />
  ),
};
export const ProductDetailMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <ProductDetailTemplate
      product={featured}
      description="A warm, composed scent with a dry sandalwood base and a soft floral centre."
      details={productDetails}
      variants={variants}
      selectedVariantId="200ml"
      onAddToCart={fn()}
    />
  ),
};
export const ProductDetailBrowseOnly: Story = {
  render: () => (
    <ProductDetailTemplate
      product={featured}
      description="A warm, composed scent with a dry sandalwood base and a soft floral centre."
      details={productDetails}
      showPurchaseAction={false}
    />
  ),
};

export const Editorial: Story = {
  render: () => (
    <EditorialTemplate
      eyebrow="Fragrance guide"
      title="A practical guide to choosing home fragrance"
      introduction="Choose a scent by paying attention to the room, the time of day and the atmosphere you want to return to."
      image={featured.image}
      sections={[
        {
          heading: "Begin with the room",
          body: "Busy rooms benefit from clarity. Citrus, green herbs and dry woods can keep kitchens and living spaces feeling open without becoming sharp.",
        },
        {
          heading: "Then choose the mood",
          body: "Amber and sandalwood bring warmth to slower spaces. White florals soften a room, while smoke and spice give it more presence.",
        },
        {
          heading: "Let format set the rhythm",
          body: "A diffuser gives a steady background. A candle creates a shorter ritual, and a room spray offers an immediate reset.",
        },
      ]}
      currentHref="/fragrance-guide"
      cartCount={2}
    />
  ),
};
export const EditorialMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: Editorial.render,
};
export const EditorialLongContentMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <EditorialTemplate
      eyebrow="Fragrance guide"
      title="A considered guide to choosing fragrance for active rooms, quiet rooms and every ritual between them"
      introduction="A deliberately extended introduction proves that editor-managed copy can wrap naturally on a narrow screen without losing its reading order or pushing content outside the viewport."
      image={undefined}
      sections={[
        {
          heading: "Begin with the way the room is used throughout the day",
          body: "Long-form editorial content remains readable at a useful measure.\n\nA second paragraph also preserves the editor's intended separation without requiring a custom page layout.",
        },
        {
          heading: "Then choose the atmosphere you want to return to",
          body: "The composition accepts multiple ordered sections and remains meaningful when no optional hero image has been published.",
        },
      ]}
      currentHref="/fragrance-guide"
      cartCount={12}
    />
  ),
};
export const EditorialMidnightNavigation: Story = {
  render: () => (
    <EditorialTemplate
      title="A practical guide to choosing home fragrance"
      introduction="Choose a scent by paying attention to the room, the time of day and the atmosphere you want to return to."
      image={featured.image}
      sections={[
        {
          heading: "Begin with the room",
          body: "Busy rooms benefit from clarity; quieter rooms welcome warmth.",
        },
      ]}
      currentHref="/fragrance-guide"
      navigationTheme="midnight"
    />
  ),
};
export const EditorialMobileMidnightNavigation: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <EditorialTemplate
      title="A practical guide to choosing home fragrance"
      introduction="Choose a scent by paying attention to the room, the time of day and the atmosphere you want to return to."
      image={featured.image}
      sections={[
        {
          heading: "Begin with the room",
          body: "Busy rooms benefit from clarity; quieter rooms welcome warmth.",
        },
      ]}
      currentHref="/fragrance-guide"
      navigationTheme="midnight"
    />
  ),
};
export const LongContentAtMobileWidth: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <ProductDetailTemplate
      product={{
        ...featured,
        name: "Bois de Santal — an exceptionally long fragrance name for compact screens",
        notes:
          "Cardamom · rose absolute · sustainably sourced sandalwood · warm resin · soft spice",
      }}
      description="A deliberately extended description verifies that descriptive product content wraps without pushing the purchase journey beyond the viewport."
      details={[
        {
          label: "Delivery and fulfilment",
          value:
            "Calculated at checkout for South African addresses, including longer regional destination names.",
        },
        ...productDetails,
      ]}
      variants={variants}
      selectedVariantId="200ml"
      onAddToCart={fn()}
    />
  ),
};
export const HomeMobileMidnightNavigation: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <HomeTemplate
      products={productCardFixtures}
      heroImage={featured.image}
      navigationTheme="midnight"
    />
  ),
};
export const CollectionMobileMidnightNavigation: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <CollectionTemplate
      products={productCardFixtures}
      navigationTheme="midnight"
    />
  ),
};
export const ProductDetailMobileMidnightNavigation: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <ProductDetailTemplate
      product={featured}
      description="A warm, composed scent."
      details={productDetails}
      variants={variants}
      selectedVariantId="200ml"
      onAddToCart={fn()}
      navigationTheme="midnight"
    />
  ),
};
