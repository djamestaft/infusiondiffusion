import type { CartContract } from "@/lib/shopify/cart-contract";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";

export function CartSummary({
  cart,
  checkoutEnabled,
  checkoutAction,
}: {
  cart: CartContract;
  checkoutEnabled: boolean;
  checkoutAction?: () => void | Promise<void>;
}) {
  return (
    <aside className="w-full self-start lg:sticky lg:top-28 lg:w-90">
      <h2 className="font-display mb-4 text-[28px] leading-[1.5]">
        Order summary
      </h2>
      <div
        className="bg-content-surface-quiet flex flex-col gap-5 p-6"
        data-testid="cart-summary-panel"
      >
        <div className="flex items-center justify-between gap-3 font-sans">
          <span>Subtotal</span>
          <PriceDisplay
            price={cart.subtotal}
            className="[&>span]:text-base [&>span]:leading-[1.5]"
          />
        </div>
        {cart.discounts?.map((discount) => (
          <div
            key={discount.label}
            className="flex items-center justify-between font-sans text-sm"
          >
            <span>{discount.label}</span>
            <span className="inline-flex items-center">
              −<PriceDisplay price={discount.amount} />
            </span>
          </div>
        ))}
        <p className="text-content-secondary font-sans text-sm leading-[1.5]">
          Shipping and final taxes are confirmed at checkout.
        </p>
        {!checkoutEnabled ? (
          <p className="text-content-secondary font-sans text-sm leading-[1.5]">
            Checkout is being prepared. Your cart is saved.
          </p>
        ) : null}
        <form action={checkoutAction}>
          <Button
            type="submit"
            size="large"
            className="disabled:bg-cart-checkout-disabled-surface w-full text-[13px] leading-[18px]"
            disabled={!checkoutEnabled}
          >
            {checkoutEnabled ? "Continue to checkout" : "Checkout unavailable"}
          </Button>
        </form>
      </div>
    </aside>
  );
}
