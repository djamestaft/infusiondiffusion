import "server-only";

import type {
  CartContract,
  CartLineContract,
} from "@/lib/shopify/cart-contract";
import { storefrontRequest } from "@/lib/shopify/client";

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) { nodes {
    id quantity cost { totalAmount { amount currencyCode } }
    discountAllocations { discountedAmount { amount currencyCode } ... on CartCodeDiscountAllocation { code } ... on CartAutomaticDiscountAllocation { title } }
    merchandise { ... on ProductVariant {
      id title availableForSale
      image { url altText }
      product { title productType featuredImage { url altText } }
    }}
  }}
`;
const CART_QUERY = `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
const CART_CREATE = `mutation CartCreate($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } warnings { message } } }`;
const CART_LINES_ADD = `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } warnings { message } } }`;
const CART_LINES_UPDATE = `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } warnings { message } } }`;
const CART_LINES_REMOVE = `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } warnings { message } } }`;

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      cost: { totalAmount: { amount: string; currencyCode: string } };
      discountAllocations?: Array<{
        discountedAmount: { amount: string; currencyCode: string };
        code?: string;
        title?: string;
      }>;
      merchandise: {
        id: string;
        title: string;
        availableForSale: boolean;
        image?: { url: string; altText?: string };
        product: {
          title: string;
          productType?: string;
          featuredImage?: { url: string; altText?: string };
        };
      };
    }>;
  };
};
type MutationPayload = {
  cart: RawCart | null;
  userErrors: Array<{ message: string }>;
  warnings: Array<{ message: string }>;
};

const fixtureEnabled = process.env.SHOPIFY_E2E_FIXTURES === "1";
const fixtureState = globalThis as typeof globalThis & {
  __shopifyCartFixtures?: Map<string, RawCart>;
};
const fixtureCarts = (fixtureState.__shopifyCartFixtures ??= new Map<
  string,
  RawCart
>());
function fixtureCart(id: string, quantity = 1): RawCart {
  const amount = String(430 * quantity);
  return {
    id,
    checkoutUrl: "https://infusiondiffusion.myshopify.com/checkouts/e2e",
    totalQuantity: quantity,
    cost: { subtotalAmount: { amount, currencyCode: "ZAR" } },
    lines: {
      nodes: quantity
        ? [
            {
              id: "gid://shopify/CartLine/e2e",
              quantity,
              cost: { totalAmount: { amount, currencyCode: "ZAR" } },
              merchandise: {
                id: "gid://shopify/ProductVariant/e2e-bois-de-santal",
                title: "Default Title",
                availableForSale: true,
                product: {
                  title: "Bois De Santal - 200ml",
                  productType: "Reed diffuser",
                },
              },
            },
          ]
        : [],
    },
  };
}

export type ShopifyCart = CartContract & { id: string; checkoutUrl: string };

export function toPublicCart(cart: ShopifyCart): CartContract {
  return {
    totalQuantity: cart.totalQuantity,
    lines: cart.lines,
    subtotal: cart.subtotal,
    discounts: cart.discounts,
    message: cart.message,
  };
}

function normalizeCart(
  cart: RawCart | null,
  messages: Array<{ message: string }> = [],
): ShopifyCart | null {
  if (!cart) return null;
  const lines: CartLineContract[] = cart.lines.nodes.map(
    ({ merchandise, ...line }) => ({
      id: line.id,
      merchandiseId: merchandise.id,
      title: merchandise.product.title,
      variantTitle:
        merchandise.title === "Default Title" ? undefined : merchandise.title,
      format: merchandise.product.productType || "Home fragrance",
      quantity: line.quantity,
      available: merchandise.availableForSale,
      total: line.cost.totalAmount,
      image:
        (merchandise.image ?? merchandise.product.featuredImage)
          ? {
              src: (merchandise.image ?? merchandise.product.featuredImage)!
                .url,
              alt:
                (merchandise.image ?? merchandise.product.featuredImage)!
                  .altText || `${merchandise.product.title} product image`,
            }
          : undefined,
    }),
  );
  const discounts = cart.lines.nodes.flatMap((line) =>
    (line.discountAllocations ?? []).map((allocation) => ({
      label: allocation.code
        ? `Code ${allocation.code}`
        : allocation.title || "Discount",
      amount: allocation.discountedAmount,
    })),
  );
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    lines,
    discounts,
    message: messages[0]?.message,
  };
}

function unwrap(payload: MutationPayload): ShopifyCart {
  if (payload.userErrors.length)
    throw new Error("Shopify rejected the cart change.");
  const cart = normalizeCart(payload.cart, payload.warnings);
  if (!cart) throw new Error("Shopify did not return a cart.");
  return cart;
}

export async function getCart(id: string): Promise<ShopifyCart | null> {
  if (fixtureEnabled) return normalizeCart(fixtureCarts.get(id) ?? null);
  const data = await storefrontRequest<{ cart: RawCart | null }>(CART_QUERY, {
    variables: { id },
  });
  return normalizeCart(data.cart);
}
export async function createCart(merchandiseId: string, quantity = 1) {
  if (fixtureEnabled) {
    const id = `gid://shopify/Cart/${crypto.randomUUID()}?key=fixture`;
    const cart = fixtureCart(id, quantity);
    fixtureCarts.set(id, cart);
    return normalizeCart(cart)!;
  }
  const data = await storefrontRequest<{ cartCreate: MutationPayload }>(
    CART_CREATE,
    { variables: { lines: [{ merchandiseId, quantity }] } },
  );
  return unwrap(data.cartCreate);
}
export async function addCartLines(
  cartId: string,
  merchandiseId: string,
  quantity = 1,
) {
  if (fixtureEnabled) {
    const nextQuantity =
      (fixtureCarts.get(cartId)?.totalQuantity ?? 0) + quantity;
    const cart = fixtureCart(cartId, nextQuantity);
    fixtureCarts.set(cartId, cart);
    return normalizeCart(cart)!;
  }
  const data = await storefrontRequest<{ cartLinesAdd: MutationPayload }>(
    CART_LINES_ADD,
    { variables: { cartId, lines: [{ merchandiseId, quantity }] } },
  );
  return unwrap(data.cartLinesAdd);
}
export async function updateCartLine(
  cartId: string,
  id: string,
  quantity: number,
) {
  if (fixtureEnabled) {
    const cart = fixtureCart(cartId, quantity);
    fixtureCarts.set(cartId, cart);
    return normalizeCart(cart)!;
  }
  const data = await storefrontRequest<{ cartLinesUpdate: MutationPayload }>(
    CART_LINES_UPDATE,
    { variables: { cartId, lines: [{ id, quantity }] } },
  );
  return unwrap(data.cartLinesUpdate);
}
export async function removeCartLine(cartId: string, id: string) {
  if (fixtureEnabled) {
    const cart = fixtureCart(cartId, 0);
    fixtureCarts.set(cartId, cart);
    return normalizeCart(cart)!;
  }
  const data = await storefrontRequest<{ cartLinesRemove: MutationPayload }>(
    CART_LINES_REMOVE,
    { variables: { cartId, lineIds: [id] } },
  );
  return unwrap(data.cartLinesRemove);
}
