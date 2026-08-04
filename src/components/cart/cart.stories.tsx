import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import type { CartContract } from "@/lib/shopify/cart-contract";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartLine } from "@/components/cart/cart-line";
import { CartPage } from "@/components/cart/cart-page";

const cart: CartContract = {
  totalQuantity: 2,
  subtotal: { amount: "860", currencyCode: "ZAR" },
  lines: [
    {
      id: "line-1",
      merchandiseId: "variant-1",
      title: "Bois De Santal",
      variantTitle: "Default format",
      format: "Reed diffuser · 200ml",
      quantity: 1,
      available: true,
      total: { amount: "430", currencyCode: "ZAR" },
    },
    {
      id: "line-2",
      merchandiseId: "variant-2",
      title: "Ambre Egyptian",
      variantTitle: "Default format",
      format: "Reed diffuser · 200ml",
      quantity: 1,
      available: true,
      total: { amount: "430", currencyCode: "ZAR" },
    },
  ],
};

export default {
  title: "Commerce/Cart",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
type Story = StoryObj;
const quantityChanged = fn();
const removed = fn();
export const Line: Story = {
  render: () => (
    <div className="mx-auto max-w-3xl p-8">
      <CartLine
        line={cart.lines[0]}
        onQuantityChange={quantityChanged}
        onRemove={removed}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Increase Bois De Santal/ }),
    );
    await expect(quantityChanged).toHaveBeenCalledWith(2);
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    await expect(removed).toHaveBeenCalled();
  },
};
export const LineUpdating: Story = {
  render: () => (
    <div className="mx-auto max-w-3xl p-8">
      <CartLine line={cart.lines[0]} pending />
    </div>
  ),
};
export const LineUnavailable: Story = {
  render: () => (
    <div className="mx-auto max-w-3xl p-8">
      <CartLine line={{ ...cart.lines[0], available: false }} />
    </div>
  ),
};
export const PageCheckoutGated: Story = {
  render: () => (
    <CartPage
      initialCart={cart}
      checkoutEnabled={false}
      updateLine={async () => cart}
      removeLine={async () => cart}
      checkoutAction={async () => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: "Checkout unavailable",
      }),
    ).toBeDisabled();
  },
};
export const PageMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: PageCheckoutGated.render,
};
export const Empty: Story = {
  render: () => (
    <CartPage
      initialCart={{ ...cart, lines: [], totalQuantity: 0 }}
      checkoutEnabled={false}
      updateLine={async () => cart}
      removeLine={async () => cart}
      checkoutAction={async () => undefined}
    />
  ),
};
export const AddedDrawer: Story = {
  render: () => (
    <CartDrawer
      open
      onOpenChange={fn()}
      cart={cart}
      merchandiseId="variant-2"
    />
  ),
};
