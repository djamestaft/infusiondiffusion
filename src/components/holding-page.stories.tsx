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

export const LongContent: Story = {
  args: {
    settings: {
      ...fallbackSiteSettings,
      headline:
        "A considered collection for long mornings and slower evenings.",
      introduction:
        "Botanical blends made with patience, curiosity, and an eye for the small rituals that make an ordinary day feel a little more intentional.",
    },
  },
};
