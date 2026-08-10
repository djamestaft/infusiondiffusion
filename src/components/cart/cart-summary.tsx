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
    <aside className="dark bg-content-surface text-content-primary min-h-[480px] w-full self-start p-7 sm:p-9 lg:sticky lg:top-32 lg:w-[360px]">
      <h2 className="font-display text-[2rem] leading-9">Order summary</h2>
      <div className="mt-6 flex items-center justify-between font-sans">
        <span>Subtotal</span>
        <PriceDisplay price={cart.subtotal} size="standard" />
      </div>
      {cart.discounts?.map((discount) => (
        <div
          key={discount.label}
          className="mt-3 flex items-center justify-between font-sans text-sm"
        >
          <span>{discount.label}</span>
          <span className="inline-flex items-center">
            −<PriceDisplay price={discount.amount} />
          </span>
        </div>
      ))}
      <p className="text-content-secondary mt-5 font-sans text-sm leading-6">
        Shipping and final taxes are confirmed in Shopify checkout.
      </p>
      {!checkoutEnabled ? (
        <div className="bg-content-surface mt-6 p-4">
          <p className="font-sans text-sm font-semibold">
            Checkout is being prepared
          </p>
          <p className="text-content-secondary mt-2 font-sans text-xs leading-5">
            Your bag is saved. Payment will open after our launch checks are
            complete.
          </p>
        </div>
      ) : null}
      <form action={checkoutAction} className="mt-6">
        <Button
          type="submit"
          size="large"
          className="w-full"
          disabled={!checkoutEnabled}
        >
          {checkoutEnabled ? "Continue to checkout" : "Checkout unavailable"}
        </Button>
      </form>
    </aside>
  );
}
