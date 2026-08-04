import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

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

export const HomeIvory: Story = {
  render: () => (
    <HomeTemplate products={productCardFixtures} heroImage={featured.image} />
  ),
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
    <HomeTemplate products={productCardFixtures} heroImage={featured.image} />
  ),
};

export const Collection: Story = {
  render: () => <CollectionTemplate products={productCardFixtures} />,
};
export const CollectionEmpty: Story = {
  render: () => <CollectionTemplate products={[]} />,
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
    />
  ),
};
export const EditorialMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: Editorial.render,
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
