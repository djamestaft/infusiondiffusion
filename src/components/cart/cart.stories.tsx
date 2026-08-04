import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import type { CartContract } from "@/lib/shopify/cart-contract";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartLine } from "@/components/cart/cart-line";
import { CartPage } from "@/components/cart/cart-page";
import { CartShell } from "@/components/cart/cart-shell";

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
export const PageOptimisticQuantity: Story = {
  render: () => (
    <CartShell
      initialCart={{
        ...cart,
        lines: [cart.lines[0]],
        totalQuantity: 1,
        subtotal: { amount: "430", currencyCode: "ZAR" },
      }}
      checkoutEnabled={false}
      updateLine={async (_lineId, quantity) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
          ...cart,
          totalQuantity: quantity,
          subtotal: { amount: String(430 * quantity), currencyCode: "ZAR" },
          lines: [
            {
              ...cart.lines[0],
              quantity,
              total: {
                amount: String(430 * quantity),
                currencyCode: "ZAR",
              },
            },
          ],
        };
      }}
      removeLine={async () => ({ ...cart, lines: [], totalQuantity: 0 })}
      checkoutAction={async () => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Increase Bois De Santal/ }),
    );
    await expect(canvas.getByLabelText("Quantity 2")).toBeVisible();
    await expect(
      canvas.getAllByRole("link", { name: "Cart, 2 items" })[0],
    ).toBeVisible();
    await expect(
      canvas.getByText("2 items held for this visit.", { exact: false }),
    ).toBeVisible();
  },
};
export const PageFailedQuantity: Story = {
  render: () => (
    <CartShell
      initialCart={{
        ...cart,
        lines: [cart.lines[0]],
        totalQuantity: 1,
        subtotal: { amount: "430", currencyCode: "ZAR" },
      }}
      checkoutEnabled={false}
      updateLine={async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        throw new Error("Shopify unavailable");
      }}
      removeLine={async () => ({ ...cart, lines: [], totalQuantity: 0 })}
      checkoutAction={async () => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Increase Bois De Santal/ }),
    );
    await expect(canvas.getByLabelText("Quantity 2")).toBeVisible();
    await expect(
      canvas.findByRole("alert", {}, { timeout: 1_000 }),
    ).resolves.toHaveTextContent("last confirmed selection");
    await expect(canvas.getByLabelText("Quantity 1")).toBeVisible();
  },
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
