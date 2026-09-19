import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { HeroCarousel } from "@/components/hero-carousel";
import published from "./published-imagery.fixture.json";

const meta = {
  title: "Motion/Hero carousel",
  component: HeroCarousel,
  args: {
    slides: published.slides,
    presentation: "editorial",
    animateContent: true,
    initialPaused: true,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Devon's approved transition: outgoing letters drift left with a 60ms head start, incoming letters spread apart and settle from the right, then an image pulse follows 40ms later. The title settles at 580ms; the CTA appears immediately and the entire description fades smoothly from 0 to 1 over 320ms with sine.out easing, no extra pause, splitting, stagger or movement. The full sequence lasts 900ms and restores normal tracking without changing line breaks. First render stays immediately visible. Enabled on desktop, tablet and touch/mobile; reduced motion and save-data remain static. The backdrop is owned separately.",
      },
    },
  },
} satisfies Meta<typeof HeroCarousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LetterArrival: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await waitFor(() =>
      expect(c.getByTestId("home-hero-section")).toHaveAttribute(
        "data-carousel-choreography",
        "ready",
      ),
    );
    await userEvent.click(c.getByRole("button", { name: "Next slide" }));
    await expect(c.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      published.slides[1].title,
    );
    await waitFor(
      () =>
        expect(canvasElement.querySelector('[data-phase="enter"]')).toBeNull(),
      { timeout: 3000 },
    );
    await expect(c.getByRole("heading", { level: 1 })).toBeVisible();
  },
};
export const RapidNavigation: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await waitFor(() =>
      expect(c.getByTestId("home-hero-section")).toHaveAttribute(
        "data-carousel-choreography",
        "ready",
      ),
    );
    await userEvent.click(c.getByRole("button", { name: "Next slide" }));
    await userEvent.click(c.getByRole("button", { name: "Next slide" }));
    await userEvent.click(c.getByRole("button", { name: "Previous slide" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelector('[data-phase="enter"]')).toBeNull(),
      { timeout: 3000 },
    );
    await expect(c.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      published.slides[1].title,
    );
    await expect(canvasElement.querySelectorAll("h1[aria-label]")).toHaveLength(
      0,
    );
  },
};
export const ReducedMotion: Story = {
  args: { forceReducedMotion: true },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Next slide" }));
    await expect(c.getByTestId("home-hero-section")).toHaveAttribute(
      "data-carousel-choreography",
      "static",
    );
    await expect(
      canvasElement.querySelector('[data-phase="enter"]'),
    ).toBeNull();
    await expect(c.getByRole("heading", { level: 1 })).toBeVisible();
  },
};
export const SaveData: Story = { args: { forceSaveData: true } };
export const Mobile: Story = {
  globals: { viewport: { value: "contact390" } },
  play: LetterArrival.play,
};
export const NarrowMobile: Story = {
  globals: { viewport: { value: "contact320" } },
  play: LetterArrival.play,
};
export const LongHeadline: Story = {
  args: {
    slides: [
      published.slides[0],
      {
        ...published.slides[1],
        title:
          "A considered fragrance for the everyday rituals that make every room feel like home",
      },
    ],
  },
};
export const MissingImage: Story = {
  args: { slides: published.slides.map((slide) => ({ ...slide, src: "" })) },
};

export const DescriptionReveal: Story = {
  args: {
    slides: [
      published.slides[0],
      {
        ...published.slides[1],
        subtitle:
          "Six distinctive fragrances. Explore the scents that bring character to the spaces you love, and find a favourite for the everyday rituals that make your home feel like yours.",
      },
    ],
  },
  play: async (context) => {
    await LetterArrival.play!(context);
    await expect(
      context.canvasElement.querySelectorAll(
        ".hero-carousel-description-letter",
      ),
    ).toHaveLength(0);
    const description = context.canvasElement.querySelector(
      '[aria-hidden="false"] p[data-carousel-support]',
    );
    await expect(description).toBeVisible();
    await expect(description).not.toHaveAttribute("aria-label");
  },
};
