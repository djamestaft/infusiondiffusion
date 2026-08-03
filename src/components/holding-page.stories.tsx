import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HoldingPage } from "@/components/holding-page";
import { fallbackSiteSettings } from "@/sanity/types";

const meta = {
  title: "Pages/Holding page",
  component: HoldingPage,
  parameters: { layout: "fullscreen" },
  args: { settings: fallbackSiteSettings },
} satisfies Meta<typeof HoldingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAnnouncement: Story = {
  args: {
    settings: {
      ...fallbackSiteSettings,
      announcement: {
        enabled: true,
        message: "The first collection is taking shape.",
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    settings: {
      ...fallbackSiteSettings,
      headline: "Fragrance for rooms that hold a life of their own.",
      introduction:
        "A considered collection of room sprays, reed diffusers, and candles, with clear guidance on scent notes, room placement, care, and longevity.",
    },
  },
};
