import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { PriceDisplay } from "@/components/ui/price-display";

const meta = {
  title: "Components/PriceDisplay",
  component: PriceDisplay,
  parameters: { layout: "centered" },
  args: {
    price: { amount: "420", currencyCode: "ZAR" },
    type: "regular",
    size: "compact",
  },
} satisfies Meta<typeof PriceDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {};
export const Sale: Story = {
  args: {
    type: "sale",
    price: { amount: "1249.95", currencyCode: "ZAR" },
    compareAtPrice: { amount: "1499.95", currencyCode: "ZAR" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Sale price:")).toBeInTheDocument();
    await expect(canvas.getByText("Original price:")).toBeInTheDocument();
  },
};
export const From: Story = {
  args: {
    type: "from",
    price: { amount: "3850", currencyCode: "ZAR" },
  },
};
export const Standard: Story = {
  args: { size: "standard" },
};
export const LongPrice: Story = {
  args: {
    size: "standard",
    price: { amount: "12999.95", currencyCode: "ZAR" },
  },
};
export const Midnight: Story = {
  args: {
    type: "sale",
    size: "standard",
    price: { amount: "1249.95", currencyCode: "ZAR" },
    compareAtPrice: { amount: "1499.95", currencyCode: "ZAR" },
  },
  render: (args) => (
    <div className="dark bg-[#11110f] p-8">
      <PriceDisplay {...args} />
    </div>
  ),
};
