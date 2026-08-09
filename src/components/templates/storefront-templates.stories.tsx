import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  AboutTemplate,
  ContactErrorTemplate,
  ContactLoadingTemplate,
  ContactTemplate,
  CollectionTemplate,
  EditorialTemplate,
  GalleryLoadingTemplate,
  GalleryTemplate,
  HomeTemplate,
  ProductDetailTemplate,
  StorefrontLoadingTemplate,
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
const portraitFixture = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640"><rect width="480" height="640" fill="#DDE2D4"/><path d="M120 120h240v400H120z" fill="#EEF0E7"/></svg>')}`;
const aboutChapters = [
  {
    role: "origin" as const,
    heading: "Born from fragrance",
    body: "A factual origin.",
    image: { src: portraitFixture, alt: "Test-only portrait fixture" },
  },
  {
    role: "development" as const,
    heading: "From more than 130 oils to six fragrances",
    body: "A factual development.",
    image: { src: portraitFixture, alt: "Test-only portrait fixture" },
  },
  {
    role: "collaborator" as const,
    heading: "Guidance and encouragement",
    body: "A factual credit.",
    image: { src: portraitFixture, alt: "Test-only portrait fixture" },
  },
  {
    role: "principles" as const,
    heading: "Composed for lived-in rooms",
    body: "A factual principle.",
    image: { src: portraitFixture, alt: "Test-only portrait fixture" },
  },
];

const maximumAboutTitle =
  "The story behind the atmosphere, the rooms we return to, and the rituals that make them feel like home";
const maximumAboutLead =
  "A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in and the changing rituals that give each interior its character, from early mornings in active kitchens to the slower evenings when a familiar room becomes a place to settle, reflect and welcome the people we love.";
const maximumAboutBody = Array.from(
  { length: 5 },
  (_, index) =>
    `This complete editorial paragraph ${index + 1} keeps the long-content fixture grounded in a believable reading experience, describing how fragrance can become part of a lived-in room without changing the fixed narrative order, hiding information, or relying on a fixed-height container.`,
).join("\n\n");

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

const galleryFixture = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760"><rect width="600" height="760" fill="#DDE2D4"/><rect x="160" y="120" width="280" height="520" fill="#45483A"/></svg>')}`;
const galleryItems = [
  "Quiet ritual",
  "Material study",
  "Evening atmosphere",
  "A considered corner",
].map((title, index) => ({
  id: `gallery-${index}`,
  title,
  caption: "Test-only authored gallery caption.",
  image: {
    src: galleryFixture,
    alt: `Test-only factual gallery fixture ${index + 1}`,
    dimensions: { width: 600, height: 760, aspectRatio: 600 / 760 },
  },
}));
const marketItems = [
  { title: "At the indoor market", width: 1280, height: 720 },
  { title: "The market table", width: 720, height: 1280 },
  { title: "Fragrance story", width: 1280, height: 960 },
  { title: "The collection on display", width: 1280, height: 960 },
  { title: "A table of fragrance", width: 1280, height: 960 },
].map(({ title, width, height }, index) => ({
  id: `market-${index}`,
  title,
  caption: "Test-only documentary gallery caption.",
  image: {
    src: galleryFixture,
    alt: `Test-only factual market fixture ${index + 1}`,
    dimensions: { width, height, aspectRatio: width / height },
    ...(index === 1
      ? { crop: { left: 0, right: 0, top: 0.125, bottom: 0.125 } }
      : {}),
  },
}));
const galleryTemplateProps = {
  title: "Rooms, composed in scent",
  introduction:
    "A study in fragrance, vessel and atmosphere — moments gathered from lived-in rooms.",
  closingLine: "Every room carries its own atmosphere.",
  campaignItems: galleryItems,
  marketItems,
};
export const Gallery: Story = {
  render: () => <GalleryTemplate {...galleryTemplateProps} cartCount={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "View Quiet ritual" }),
    );
    await expect(page.getByText("Image 1 of 4")).toBeVisible();
    await userEvent.click(
      page.getByRole("button", { name: "Close gallery viewer" }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "View At the indoor market" }),
    );
    await expect(page.getByText("Image 1 of 5")).toBeVisible();
    await userEvent.keyboard("{Escape}");
  },
};
export const Gallery390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  render: Gallery.render,
};
export const Gallery320: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
  render: Gallery.render,
};
export const GalleryCampaignOnly: Story = {
  render: () => <GalleryTemplate {...galleryTemplateProps} marketItems={[]} />,
};
export const GalleryMarketOnly: Story = {
  render: () => (
    <GalleryTemplate {...galleryTemplateProps} campaignItems={[]} />
  ),
};
export const GalleryEmpty: Story = {
  render: () => (
    <GalleryTemplate
      {...galleryTemplateProps}
      campaignItems={[]}
      marketItems={[]}
    />
  ),
};
export const GalleryUnavailable: Story = {
  render: () => (
    <GalleryTemplate
      {...galleryTemplateProps}
      campaignItems={[]}
      marketItems={[]}
      unavailable
    />
  ),
};
export const GalleryLongContent390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  render: () => (
    <GalleryTemplate
      {...galleryTemplateProps}
      title={"Rooms, composed in scent ".repeat(4)}
      introduction={"An extended introduction for a narrow gallery. ".repeat(
        12,
      )}
      closingLine={"Every room carries its own atmosphere. ".repeat(8)}
      campaignItems={galleryItems.map((item) => ({
        ...item,
        title: `${item.title} ${"unbroken-".repeat(8)}`,
        caption: "caption-".repeat(100),
      }))}
      marketItems={marketItems.map((item) => ({
        ...item,
        title: `${item.title} ${"unbroken-".repeat(8)}`,
        caption: "caption-".repeat(100),
      }))}
    />
  ),
};
export const GalleryMaximum: Story = {
  render: () => (
    <GalleryTemplate
      {...galleryTemplateProps}
      campaignItems={galleryItems}
      marketItems={Array.from({ length: 6 }, (_, index) => ({
        ...marketItems[index % marketItems.length],
        id: `maximum-${index}`,
      }))}
    />
  ),
};
export const GalleryLoading: Story = {
  render: () => <GalleryLoadingTemplate />,
};

export const CollectionLoading: Story = {
  render: () => (
    <StorefrontLoadingTemplate kind="collection" currentHref="/shop" />
  ),
};
export const ProductLoading: Story = {
  render: () => <StorefrontLoadingTemplate kind="product" />,
};
export const EditorialLoading390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  render: () => (
    <StorefrontLoadingTemplate kind="editorial" currentHref="/about" />
  ),
};

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

const contactProps = {
  title: "Let’s talk fragrance.",
  introduction:
    "Questions about scent, care, delivery, or choosing a room fragrance? Email us directly and we’ll help you find the clearest next step.",
  sections: [
    {
      heading: "Before you write",
      body: "Include the product or fragrance name when it helps explain your question. Do not send payment details or other sensitive information by email.",
    },
  ],
  email: "hello@infusiondiffusion.co.za",
};

export const Contact: Story = {
  render: () => <ContactTemplate {...contactProps} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Contact", current: "page" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: "Email Infusion Diffusion" }),
    ).toHaveAttribute("href", "mailto:hello@infusiondiffusion.co.za");
    await expect(canvas.queryByRole("form")).toBeNull();
    await expect(canvas.getByText("Online form unavailable")).toBeVisible();
  },
};
export const ContactDefault390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  render: Contact.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Email Infusion Diffusion" }),
    ).toHaveAttribute("href", "mailto:hello@infusiondiffusion.co.za");
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));
    await expect(
      canvas.getByRole("link", { name: "Contact", current: "page" }),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(
      canvas.getByRole("link", { name: "Email Infusion Diffusion" }),
    ).toBeVisible();
  },
};
export const ContactSmall320: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
  render: Contact.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "Email Infusion Diffusion" }),
    ).toBeVisible();
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  },
};
export const ContactCartThree: Story = {
  render: () => <ContactTemplate {...contactProps} cartCount={3} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("link", { name: "Cart, 3 items" }),
    ).toBeVisible();
  },
};
export const ContactPartialFallback: Story = {
  render: () => (
    <ContactTemplate
      {...contactProps}
      title="A title from Sanity"
      sections={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "A title from Sanity",
    );
    await expect(
      canvas.queryByRole("heading", { level: 2, name: "Before you write" }),
    ).toBeNull();
  },
};
export const ContactMaximumContent: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
  render: () => (
    <ContactTemplate
      {...contactProps}
      title={"unbroken-contact-title-".repeat(5)}
      introduction={"unbroken-introduction-".repeat(16)}
      email="a-very-long-contact-address-for-an-infinitely-considered-fragrance-studio@infusiondiffusion.co.za"
      sections={Array.from({ length: 10 }, (_, index) => ({
        heading: `section-${index + 1}-${"unbroken-heading-".repeat(5)}`,
        body: "unbroken-editorial-content-".repeat(48),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
    await expect(
      within(canvasElement).getByRole("heading", { level: 1 }),
    ).toBeVisible();
  },
};
export const ContactLoading: Story = {
  render: () => <ContactLoadingTemplate />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Loading contact page")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(
      canvas.getByRole("link", { name: "Contact", current: "page" }),
    ).toBeVisible();
  },
};
const contactRetry = fn();

export const ContactUnexpectedError: Story = {
  render: () => <ContactErrorTemplate reset={contactRetry} />,
  play: async ({ canvasElement }) => {
    contactRetry.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Unexpected error",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(contactRetry).toHaveBeenCalledOnce();
    await expect(
      canvas.getByRole("link", { name: "hello@infusiondiffusion.co.za" }),
    ).toHaveAttribute("href", "mailto:hello@infusiondiffusion.co.za");
  },
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

export const About: Story = {
  render: () => (
    <AboutTemplate
      title="The story behind the atmosphere."
      introduction="A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in."
      chapters={[
        {
          role: "origin",
          heading: "Born from fragrance",
          body: "Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling.",
        },
        {
          role: "development",
          heading: "From more than 130 oils to six fragrances",
          body: "More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances.",
        },
        {
          role: "collaborator",
          heading: "Guidance and encouragement",
          body: "The collection was created with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts.",
        },
        {
          role: "principles",
          heading: "Composed for lived-in rooms",
          body: "Infusion Diffusion treats scent as a considered part of an interior.",
        },
      ]}
      cartCount={2}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "About", current: "page" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: /Explore the Fragrance Guide/i }),
    ).toHaveAttribute("href", "/fragrance-guide");
    await expect(
      getComputedStyle(canvas.getByTestId("about-chapter-origin"))
        .backgroundColor,
    ).toBe("rgb(245, 241, 232)");
  },
};
export const AboutWithPortraits: Story = {
  render: () => (
    <AboutTemplate
      title="The story behind the atmosphere."
      introduction="A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in."
      chapters={aboutChapters}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slot = canvas.getByTestId("about-media-slot-origin");
    const artwork = canvas.getByTestId("about-media-artwork-origin");
    await expect(slot).toHaveClass("aspect-4/3");
    await expect(artwork).toHaveClass("aspect-3/4", "mx-auto", "h-full");
    const slotBounds = slot.getBoundingClientRect();
    const artworkBounds = artwork.getBoundingClientRect();
    await expect(slotBounds.width / slotBounds.height).toBeCloseTo(4 / 3, 2);
    await expect(artworkBounds.width / artworkBounds.height).toBeCloseTo(
      3 / 4,
      2,
    );
    await expect(artworkBounds.left - slotBounds.left).toBeCloseTo(
      slotBounds.right - artworkBounds.right,
      1,
    );
    const portraits = canvas.getAllByRole("img", {
      name: "Test-only portrait fixture",
    });
    await expect(portraits).toHaveLength(4);
    for (const portrait of portraits) {
      await expect(portrait).toHaveClass("object-contain");
    }
    await expect(getComputedStyle(slot).backgroundColor).toBe(
      "rgba(0, 0, 0, 0)",
    );
    await expect(getComputedStyle(slot).boxShadow).toBe("none");
    await expect(
      getComputedStyle(canvas.getByTestId("about-chapter-origin"))
        .backgroundColor,
    ).toBe("rgb(245, 241, 232)");
    await expect(
      getComputedStyle(canvas.getByTestId("about-chapter-development"))
        .backgroundColor,
    ).toBe("rgb(238, 240, 231)");
    await expect(canvasElement.querySelector("main .dark")).toBeNull();
    await expect(canvas.queryByText(/ROLE [A-D]/)).toBeNull();
  },
};
export const AboutPortraitsMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: AboutWithPortraits.render,
  play: AboutWithPortraits.play,
};
export const AboutOnePortrait: Story = {
  render: () => (
    <AboutTemplate
      title="The story behind the atmosphere."
      introduction="A considered collection."
      chapters={aboutChapters.map((chapter, index) =>
        index ? { ...chapter, image: undefined } : chapter,
      )}
    />
  ),
};
export const AboutAlternatingPortraits: Story = {
  render: () => (
    <AboutTemplate
      title="The story behind the atmosphere."
      introduction="A considered collection."
      chapters={aboutChapters.map((chapter, index) =>
        index % 2 ? { ...chapter, image: undefined } : chapter,
      )}
    />
  ),
};
export const AboutPartialUnavailable: Story = {
  render: () => (
    <AboutTemplate
      title="The story behind the atmosphere."
      introduction="A partial Sanity response retains valid chapters and safe text-first fallbacks."
      chapters={aboutChapters.map((chapter, index) =>
        index === 1
          ? { ...chapter, image: undefined, body: "A partial chapter body." }
          : { ...chapter, image: undefined },
      )}
    />
  ),
};
export const AboutUnavailable: Story = { render: About.render };

export const AboutMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: About.render,
};
export const AboutMaximumContent: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <AboutTemplate
      title={maximumAboutTitle}
      introduction={maximumAboutLead}
      chapters={aboutChapters.map((chapter) => ({
        ...chapter,
        image: undefined,
        heading: `${chapter.heading} for rooms with a considered and exceptionally long editorial context`,
        body: maximumAboutBody,
      }))}
    />
  ),
};
export const AboutLongContent: Story = {
  render: () => (
    <AboutTemplate
      title="The story behind the atmosphere."
      introduction="A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in."
      chapters={[
        {
          role: "origin",
          heading: "Born from fragrance",
          body: "Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling.\n\nThis paragraph verifies natural expansion.",
        },
        {
          role: "development",
          heading: "From more than 130 oils to six fragrances",
          body: "More than 130 fragrance oils were explored before refinement.",
        },
        {
          role: "collaborator",
          heading: "Guidance and encouragement",
          body: "The collection was created with guidance and encouragement.",
        },
        {
          role: "principles",
          heading: "Composed for lived-in rooms",
          body: "Scent is a considered part of an interior.",
        },
      ]}
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
