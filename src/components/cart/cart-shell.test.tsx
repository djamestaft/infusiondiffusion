import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CartShell } from "@/components/cart/cart-shell";
import { emptyCart, type CartContract } from "@/lib/shopify/cart-contract";

vi.mock("@/components/cart/cart-page", () => ({
  CartPage: ({
    onCartChange,
  }: {
    onCartChange: (cart: CartContract) => void;
  }) => (
    <>
      <button onClick={() => onCartChange(emptyCart)}>Confirm empty</button>
      <button onClick={() => onCartChange({ ...emptyCart, totalQuantity: 2 })}>
        Confirm two
      </button>
      <button onClick={() => onCartChange({ ...emptyCart, unavailable: true })}>
        Unavailable
      </button>
    </>
  ),
}));
vi.mock("@/components/footer", () => ({ Footer: () => null }));
afterEach(cleanup);

it("preserves unknown initial and updated counts and accepts confirmed recovery", () => {
  render(
    <CartShell
      initialCart={{ ...emptyCart, unavailable: true }}
      checkoutEnabled={false}
      updateLine={vi.fn()}
      removeLine={vi.fn()}
      checkoutAction={vi.fn()}
    />,
  );
  expect(
    screen.getAllByRole("link", { name: "Cart, item count unavailable" }),
  ).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Confirm empty" }));
  expect(screen.getAllByRole("link", { name: "Cart" })).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Confirm two" }));
  expect(screen.getAllByRole("link", { name: "Cart, 2 items" })).toHaveLength(
    2,
  );
  fireEvent.click(screen.getByRole("button", { name: "Unavailable" }));
  expect(
    screen.getAllByRole("link", { name: "Cart, item count unavailable" }),
  ).toHaveLength(2);
});
