import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CommerceStatus } from "@/components/ui/commerce-status";

const meta = {
  title: "Components/CommerceStatus",
  component: CommerceStatus,
  parameters: { layout: "centered" },
  args: { status: "in-stock", treatment: "inline" },
} satisfies Meta<typeof CommerceStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InStock: Story = {};
export const LowStock: Story = {
  args: { status: "low-stock", lowStockCount: 3 },
};
export const SoldOut: Story = { args: { status: "sold-out" } };
export const PreOrder: Story = { args: { status: "pre-order" } };
export const Overlay: Story = {
  args: { status: "low-stock", treatment: "overlay", lowStockCount: 3 },
};
export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <CommerceStatus status="in-stock" />
      <CommerceStatus status="low-stock" lowStockCount={3} />
      <CommerceStatus status="sold-out" />
      <CommerceStatus status="pre-order" />
    </div>
  ),
};
export const AllOverlays: Story = {
  render: () => (
    <div className="flex max-w-64 flex-wrap gap-2">
      <CommerceStatus status="in-stock" treatment="overlay" />
      <CommerceStatus
        status="low-stock"
        treatment="overlay"
        lowStockCount={3}
      />
      <CommerceStatus status="sold-out" treatment="overlay" />
      <CommerceStatus status="pre-order" treatment="overlay" />
    </div>
  ),
};
export const Midnight: Story = {
  render: () => (
    <div className="dark flex flex-col gap-3 bg-[#11110f] p-8">
      <CommerceStatus status="in-stock" />
      <CommerceStatus status="low-stock" lowStockCount={3} />
      <CommerceStatus status="sold-out" />
      <CommerceStatus status="pre-order" />
    </div>
  ),
};
