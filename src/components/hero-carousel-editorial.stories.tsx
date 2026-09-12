import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { HeroCarousel, type HeroCarouselSlide } from "./hero-carousel";
import { Navigation } from "./navigation";

const slides: HeroCarouselSlide[] = [
  {
    id: "rooms",
    src: "/images/products/fixtures/bois-de-santal.png",
    alt: "Reed diffuser in a softly lit interior",
    title: "Fragrance, composed\nfor the rooms\nyou live in",
    subtitle:
      "Reed diffusers shaped by considered materials and everyday ritual.",
    cta: { label: "Shop the collection", href: "/shop" },
  },
  {
    id: "ritual",
    src: "/images/homepage-artistry-in-fragrance.png",
    alt: "Dark glass reed diffuser on stone and linen",
    title: "A quiet moment,\nbeautifully scented",
    subtitle: "Discover a reed diffuser for your everyday ritual.",
    cta: { label: "Explore the fragrances", href: "/fragrance-guide" },
  },
  {
    id: "home",
    src: "/images/homepage-bespoke-diffuser-blurb.png",
    alt: "Diffuser arranged in a considered interior",
    title: "Find the fragrance\nthat feels like home",
    subtitle:
      "Explore the collection and choose a scent for the rooms you live in.",
    cta: { label: "Shop the collection", href: "/shop" },
  },
];
const meta = {
  title: "Components/HeroCarousel/Editorial",
  component: HeroCarousel,
  args: { slides, presentation: "editorial" },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Approved carousel composition with horizontal 600ms slide transitions, outer-gutter desktop controls and a gold rule on the scrolled navigation. Header spacing is 86px on desktop and 78px on mobile/tablet, with a matching hero offset. Sample editorial slides and generated background options are review fixtures; they do not publish content to Sanity.",
      },
    },
  },
} satisfies Meta<typeof HeroCarousel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Carousel: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Next slide" }));
    await expect(c.getByRole("heading", { level: 1 })).toHaveTextContent(
      "A quiet moment,",
    );
    await expect(
      c.getByRole("link", { name: "Explore the fragrances" }),
    ).toHaveAttribute("href", "/fragrance-guide");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(c.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Fragrance, composed",
    );
  },
};
export const WarmLimestone: Story = {
  args: { backgroundSrc: "/images/carousel/warm-limestone.webp" },
};
export const BotanicalShadows: Story = {
  args: { backgroundSrc: "/images/carousel/botanical-shadows.webp" },
};
export const Mobile: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const NarrowMobile: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
};
export const Tablet: Story = {
  globals: { viewport: { value: "homepageTablet", isRotated: false } },
};
export const SingleSlide: Story = { args: { slides: slides.slice(0, 1) } };
export const MissingImage: Story = {
  args: { slides: [{ ...slides[0], src: "" }] },
};
export const Empty: Story = {
  args: {
    slides: [],
    fallbackCopy: {
      title: "Fragrance for your home",
      subtitle: "Explore the collection.",
      cta: { label: "Shop the collection", href: "/shop" },
    },
  },
};
export const Loading: Story = { args: { loading: true } };
export const LongContent: Story = {
  args: {
    slides: [
      {
        ...slides[0],
        title:
          "Make room for the everyday rituals that turn a house into your home",
        subtitle:
          "A longer editorial introduction tests how the carousel accommodates additional words while keeping its image, action and navigation clear at every screen size.",
      },
      slides[1],
    ],
  },
};

function WithNavigation({
  font = "sans",
  backgroundSrc,
}: {
  font?: "sans" | "display";
  backgroundSrc?: string;
}) {
  return (
    <>
      <Navigation
        floating
        theme="midnight"
        currentHref="/shop"
        accountHref="/account"
        cartCount={2}
        linkFont={font}
      />
      <main>
        <HeroCarousel
          slides={slides}
          presentation="editorial"
          withNavigation
          backgroundSrc={backgroundSrc}
        />
        <section className="bg-content-surface text-content-primary min-h-screen px-6 py-20">
          <h2 className="font-display text-4xl">
            Find your signature fragrance
          </h2>
          <p className="mt-6 max-w-xl font-sans">
            Scroll to test the solid navigation. Return to the top to see it
            float over the carousel background.
          </p>
        </section>
      </main>
    </>
  );
}
export const CarouselWithNavigation: Story = {
  render: () => <WithNavigation />,
};
export const NavigationMarcellus: Story = {
  render: () => <WithNavigation font="display" />,
};
export const NavigationWarmLimestone: Story = {
  render: () => (
    <WithNavigation backgroundSrc="/images/carousel/warm-limestone.webp" />
  ),
};
export const NavigationBotanicalShadows: Story = {
  render: () => (
    <WithNavigation backgroundSrc="/images/carousel/botanical-shadows.webp" />
  ),
};
export const NavigationMobile: Story = {
  ...CarouselWithNavigation,
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const NavigationNarrowMobile: Story = {
  ...CarouselWithNavigation,
  globals: { viewport: { value: "contact320", isRotated: false } },
};
export const NavigationMobileOpen: Story = {
  ...NavigationMobile,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Open menu" }));
    await expect(c.getByRole("dialog")).toBeVisible();
  },
};

export const Paused: Story = { args: { initialPaused: true } };
export const ReducedMotion: Story = { args: { forceReducedMotion: true } };
export const SaveData: Story = { args: { forceSaveData: true } };
export const Laptop: Story = {
  ...CarouselWithNavigation,
  globals: { viewport: { value: "laptop1280", isRotated: false } },
  parameters: {
    viewport: {
      options: {
        laptop1280: {
          name: "Laptop 1280",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
};

export const ShortLaptop: Story = {
  ...Laptop,
  parameters: {
    viewport: {
      options: {
        laptop1280: {
          name: "Short laptop 1280 × 650",
          styles: { width: "1280px", height: "650px" },
          type: "desktop",
        },
      },
    },
  },
};
export const ShortPhone: Story = {
  ...CarouselWithNavigation,
  globals: { viewport: { value: "shortPhone", isRotated: false } },
  parameters: {
    viewport: {
      options: {
        shortPhone: {
          name: "Short phone 375 × 667",
          styles: { width: "375px", height: "667px" },
          type: "mobile",
        },
      },
    },
  },
};
