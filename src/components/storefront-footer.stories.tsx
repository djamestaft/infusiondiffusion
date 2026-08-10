import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StorefrontFooter } from "@/components/storefront-footer";

const meta = {
  title: "Components/StorefrontFooter",
  component: StorefrontFooter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StorefrontFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Mobile390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
};
