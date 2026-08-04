import type {
  CartContract,
  CartLineContract,
} from "@/lib/shopify/cart-contract";

function scaledAmount(line: CartLineContract, quantity: number) {
  const total = Number(line.total.amount);
  if (!Number.isFinite(total) || line.quantity < 1) return undefined;
  return (total / line.quantity) * quantity;
}

export function withOptimisticQuantity(
  cart: CartContract,
  lineId: string,
  quantity: number,
): CartContract {
  const currentLine = cart.lines.find((line) => line.id === lineId);
  if (!currentLine) return cart;

  const nextLineAmount = scaledAmount(currentLine, quantity);
  const currentLineAmount = Number(currentLine.total.amount);
  const currentSubtotal = Number(cart.subtotal.amount);
  const canUpdateSubtotal =
    nextLineAmount !== undefined &&
    Number.isFinite(currentLineAmount) &&
    Number.isFinite(currentSubtotal);

  return {
    ...cart,
    totalQuantity: cart.totalQuantity - currentLine.quantity + quantity,
    subtotal: canUpdateSubtotal
      ? {
          ...cart.subtotal,
          amount: String(currentSubtotal - currentLineAmount + nextLineAmount),
        }
      : cart.subtotal,
    lines:
      quantity < 1
        ? cart.lines.filter((line) => line.id !== lineId)
        : cart.lines.map((line) =>
            line.id === lineId
              ? {
                  ...line,
                  quantity,
                  total: {
                    ...line.total,
                    amount:
                      nextLineAmount === undefined
                        ? line.total.amount
                        : String(nextLineAmount),
                  },
                }
              : line,
          ),
  };
}
