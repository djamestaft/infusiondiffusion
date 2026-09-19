import published from "./published-imagery.fixture.json";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FragranceJourney } from "./fragrance-journey";
import { MotionBoundary, MotionControl } from "./motion-boundary";
import { HeroAtmosphere } from "./hero-atmosphere";
import { HeroCarousel } from "@/components/hero-carousel";
import { productCardFixtures } from "@/components/ui/product-card.fixtures";

const meta = {
  title: "Motion/Fragrance Journey",
  component: FragranceJourney,
  args: { title: "A fragrance for every room", products: productCardFixtures },
  decorators: [
    (Story) => (
      <MotionBoundary>
        <div className="h-24" />
        <Story />
        <h2
          id="home-guidance-title"
          tabIndex={-1}
          className="bg-content-surface-quiet font-display min-h-screen p-16 text-4xl"
        >
          Find your fragrance
        </h2>
      </MotionBoundary>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FragranceJourney>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Cinematic: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("link", { name: /^View / })).toHaveLength(
      6,
    );
    await expect(
      canvas.getByRole("link", { name: "Skip fragrance collection" }),
    ).toBeVisible();
  },
};
export const Restrained: Story = { args: { cinematic: false } };
export const Mobile: Story = { globals: { viewport: { value: "contact390" } } };
export const Small: Story = { globals: { viewport: { value: "contact320" } } };
export const Empty: Story = { args: { products: [] } };
export const Single: Story = {
  args: { products: productCardFixtures.slice(0, 1) },
};
export const LongNames: Story = {
  args: {
    products: productCardFixtures.map((product) => ({
      ...product,
      name: `${product.name} — an exceptionally long fragrance name for a considered home and every room within it`,
      format:
        "A beautifully considered reed diffuser with an exceptionally detailed description · 200ml",
    })),
  },
};
export const MissingImages: Story = {
  args: {
    products: productCardFixtures.map((product) => ({
      ...product,
      image: undefined,
    })),
  },
};
export const HeroStudy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Eligible desktop starts at its stable overscan crop. Move across the hero boundary repeatedly: the pose freezes on leave and resumes smoothly on re-entry. The control restores the unenhanced crop; keyboard focus centers without changing scale.",
      },
    },
  },
  render: () => (
    <>
      <div className="bg-content-surface flex justify-end p-4">
        <MotionControl />
      </div>
      <HeroAtmosphere>
        <HeroCarousel presentation="editorial" slides={published.slides} />
      </HeroAtmosphere>
    </>
  ),
  play: async ({ canvasElement }) => {
    const backdrop = canvasElement.querySelector<HTMLElement>(
      "[data-motion-backdrop]",
    )!;
    await expect(backdrop).toBeVisible();
    if (
      matchMedia(
        "(min-width: 1024px) and (min-height: 680px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    ) {
      const matrix = new DOMMatrix(getComputedStyle(backdrop).transform);
      await expect(matrix.m11).toBeCloseTo(1.04, 4);
    }
  },
};
