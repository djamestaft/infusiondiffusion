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
          "Devon's approved transition: outgoing letters drift left with a 220ms head start, incoming letters spread apart and settle from the right, then a longer image pulse follows 120ms later. The 1.25-second sequence restores normal tracking without changing line breaks. First render stays immediately visible. Desktop only; reduced motion, save-data and touch retain their existing accessible behavior. The backdrop is owned separately.",
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
      { timeout: 2000 },
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
      { timeout: 2000 },
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
};
export const NarrowMobile: Story = {
  globals: { viewport: { value: "contact320" } },
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
