import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  HeroCarousel,
  type HeroCarouselSlide,
} from "@/components/hero-carousel";

const slides: HeroCarouselSlide[] = [
  {
    id: "cabinet-1",
    src: "/images/products/fixtures/bois-de-santal.png",
    alt: "Labelled fixture: diffuser arranged in a quiet interior",
    caption: "Fixture — campaign photography pending",
  },
  {
    id: "cabinet-2",
    src: "/images/products/fixtures/ambre-egyptian.png",
    alt: "Labelled fixture: amber diffuser in warm light",
    caption: "Fixture — campaign photography pending",
  },
  {
    id: "cabinet-3",
    src: "/images/products/fixtures/noir-de-la-nuit.png",
    alt: "Labelled fixture: dark glass diffuser composition",
    caption: "Fixture — campaign photography pending",
  },
];

async function verifyBracketLayout(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const stage = canvas.getByTestId("hero-carousel-stage");
  const media = canvas.getByTestId("hero-carousel-media");
  const controls = canvas.getByTestId("hero-carousel-controls");
  const topLeft = canvas.getByTestId("hero-carousel-bracket-top-left");
  const stageBounds = stage.getBoundingClientRect();
  const mediaBounds = media.getBoundingClientRect();
  const controlsBounds = controls.getBoundingClientRect();
  const bracketBounds = topLeft.getBoundingClientRect();

  await expect(mediaBounds.left).toBeGreaterThan(stageBounds.left);
  await expect(mediaBounds.right).toBeLessThan(stageBounds.right);
  await expect(bracketBounds.top).toBeLessThan(mediaBounds.top);
  await expect(bracketBounds.left).toBeLessThan(mediaBounds.left);
  await expect(controlsBounds.top).toBeGreaterThan(stageBounds.bottom);
  await expect(
    Math.abs(
      controlsBounds.left +
        controlsBounds.width / 2 -
        (stageBounds.left + stageBounds.width / 2),
    ),
  ).toBeLessThan(1);
  await expect(
    canvas.getByRole("button", { name: "Pause carousel" }),
  ).toBeVisible();
}

const meta = {
  title: "Components/HeroCarousel",
  component: HeroCarousel,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[min(32rem,calc(100vw-2.5rem))]">
        <Story />
      </div>
    ),
  ],
  args: { slides },
} satisfies Meta<typeof HeroCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    await verifyBracketLayout(canvasElement);
  },
};
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    await verifyBracketLayout(canvasElement);
  },
};
export const OneSlide: Story = { args: { slides: slides.slice(0, 1) } };
export const TwoSlides: Story = { args: { slides: slides.slice(0, 2) } };
export const ThreeSlides: Story = {};
export const Progress: Story = {
  play: async ({ canvasElement }) => {
    const progress = canvasElement.querySelector(".hero-carousel-progress");
    await expect(progress).toBeVisible();
    await expect(progress).toHaveStyle({ animationDuration: "3s" });
  },
};
export const Paused: Story = {
  args: { initialPaused: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Play carousel" }),
    );
    const progress = canvasElement.querySelector(".hero-carousel-progress");
    await expect(progress).toBeVisible();
    await expect(progress).toHaveStyle({ animationDuration: "3s" });
  },
};
export const ReducedMotion: Story = { args: { forceReducedMotion: true } };
export const SaveData: Story = { args: { forceSaveData: true } };
export const Loading: Story = { args: { loading: true } };
export const LongContent: Story = {
  args: {
    slides: [
      {
        ...slides[0],
        caption:
          "Labelled fixture with deliberately long editorial caption content that wraps without changing the stable four-by-five media proportions or causing horizontal overflow.",
      },
      ...slides.slice(1),
    ],
  },
};
export const Empty: Story = { args: { slides: [] } };
export const ImageFailure: Story = {
  args: {
    slides: [
      {
        id: "broken",
        src: "/images/missing-hero.jpg",
        alt: "Unavailable fixture",
      },
    ],
  },
};
export const PartialImageFailure: Story = {
  args: {
    slides: [
      {
        id: "broken",
        src: "/images/missing-hero.jpg",
        alt: "Unavailable fixture",
      },
      ...slides.slice(1),
    ],
  },
};
