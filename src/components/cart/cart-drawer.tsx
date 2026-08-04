"use client";

import type { CartContract } from "@/lib/shopify/cart-contract";
import { CartLine } from "@/components/cart/cart-line";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function CartDrawer({
  open,
  onOpenChange,
  cart,
  merchandiseId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartContract;
  merchandiseId: string;
}) {
  const latest = cart.lines.find(
    (line) => line.merchandiseId === merchandiseId,
  );
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Added to your bag</DrawerTitle>
          <DrawerDescription>
            {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}{" "}
            in your bag.
          </DrawerDescription>
        </DrawerHeader>
        {latest ? (
          <div className="mt-6">
            <CartLine line={latest} compact />
          </div>
        ) : null}
        <DrawerFooter>
          <Button asChild size="large">
            <a href="/cart">Review your bag</a>
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Continue shopping
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
