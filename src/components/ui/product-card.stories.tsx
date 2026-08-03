import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { productCardFixtures } from "@/components/ui/product-card.fixtures";
import { ProductCard } from "@/components/ui/product-card";

const product = productCardFixtures[5];

function FixtureLabel() {
  return (
    <p className="text-product-card-meta mb-4 font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
      Provisional brochure fixtures
    </p>
  );
}

const meta = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: { layout: "centered" },
  args: { ...product, imagePriority: true },
  render: (args) => (
    <div className="w-72">
      <ProductCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole("link"));
  },
};
export const SoldOut: Story = { args: { availability: "sold-out" } };
export const MissingImage: Story = { args: { image: undefined } };
export const LongContent: Story = {
  args: {
    name: "A Very Long Fragrance Name for an Intimate Evening Room",
    notes:
      "Cardamom · Damask rose · Australian sandalwood · amber · white musk",
  },
};
export const Midnight: Story = {
  render: (args) => (
    <div className="dark w-80 bg-[#11110f] p-4">
      <ProductCard {...args} />
    </div>
  ),
};
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole("link", {
      name: "View Bois de Santal",
    });
    await userEvent.tab();
    await expect(card).toHaveFocus();
  },
};
export const MidnightKeyboardFocus: Story = {
  render: (args) => (
    <div className="dark w-80 bg-[#11110f] p-4">
      <ProductCard {...args} />
    </div>
  ),
  play: KeyboardFocus.play,
};
export const TwoCardMobile: Story = {
  decorators: [],
  render: () => (
    <div>
      <FixtureLabel />
      <div className="grid w-[320px] grid-cols-2 gap-4">
        {productCardFixtures.slice(0, 2).map((item, index) => (
          <ProductCard key={item.href} {...item} imagePriority={index === 0} />
        ))}
      </div>
    </div>
  ),
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    const cards = within(canvasElement).getAllByRole("link");
    await expect(cards).toHaveLength(2);
    for (const card of cards) {
      await expect(card.getBoundingClientRect().width).toBeLessThanOrEqual(152);
    }
  },
};
export const DesktopCollection: Story = {
  decorators: [],
  render: () => (
    <div className="p-8">
      <FixtureLabel />
      <div className="grid max-w-[1224px] grid-cols-4 gap-6">
        {productCardFixtures.map((item, index) => (
          <ProductCard
            key={item.href}
            {...item}
            imagePriority={index === 0}
            availability={index === 1 ? "sold-out" : "available"}
          />
        ))}
      </div>
    </div>
  ),
};
