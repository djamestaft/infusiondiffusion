import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Navigation } from "@/components/navigation";

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: { layout: "fullscreen" },
  args: { currentHref: "/shop" },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ivory: Story = {};

export const Midnight: Story = {
  args: { theme: "midnight" },
};

export const MobileClosed: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

export const LongLabels: Story = {
  args: {
    destinations: [
      { label: "Shop the complete collection", href: "/shop" },
      { label: "A considered guide to fragrance", href: "/fragrance-guide" },
      { label: "About Infusion Diffusion", href: "/about" },
      { label: "Contact our fragrance studio", href: "/contact" },
    ],
  },
};

export const EmptyDestinations: Story = {
  args: { destinations: [] },
};
