import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MediaFallback } from "@/components/ui/media-fallback";

const meta = {
  title: "Components/MediaFallback",
  component: MediaFallback,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="aspect-3/2 w-[min(390px,calc(100vw-40px))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ProductUnavailable: Story = {
  args: { label: "Product photography unavailable" },
};
export const Mobile390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const Mobile320: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
};
