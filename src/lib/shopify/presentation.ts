import type { ProductCardProps } from "@/components/ui/product-card";
import type {
  ShopifyProduct,
  ShopifyProductSummary,
} from "@/lib/shopify/types";

function splitProductTitle(title: string) {
  const match = title.match(/^(.*?)\s*-\s*(\d+\s*ml)$/i);
  return match
    ? { name: match[1].trim(), size: match[2].toLowerCase() }
    : { name: title, size: undefined };
}

function summaryText(description: string) {
  const normalized = description
    .replace(/([a-z.!?])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "Fragrance details coming soon";
  const sentence = normalized.match(/^(.{1,140}?[.!?])(?:\s|$)/)?.[1];
  return (
    sentence ??
    `${normalized.slice(0, 137).trimEnd()}${normalized.length > 137 ? "…" : ""}`
  );
}

export function toProductCard(
  product: ShopifyProductSummary,
): ProductCardProps {
  const { name, size } = splitProductTitle(product.title);
  const representativeVariant = product.variants.find(
    (variant) =>
      variant.price.amount === product.priceRange.min.amount &&
      variant.price.currencyCode === product.priceRange.min.currencyCode,
  );
  const format = [product.productType, size].filter(Boolean).join(" · ");
  return {
    href: `/products/${product.handle}`,
    name,
    format: format || "Format details coming soon",
    notes: summaryText(product.description),
    price: product.priceRange.min,
    compareAtPrice: representativeVariant?.compareAtPrice,
    priceType: representativeVariant?.compareAtPrice ? "sale" : undefined,
    image: product.featuredImage
      ? {
          src: product.featuredImage.url,
          alt: product.featuredImage.altText || `${name} product image`,
        }
      : undefined,
    availability: product.availableForSale ? "in-stock" : "sold-out",
  };
}

export function toProductDetails(product: ShopifyProduct) {
  const card = toProductCard(product);
  const { size } = splitProductTitle(product.title);
  const details = [
    size ? { label: "Size", value: size } : undefined,
    product.productType
      ? { label: "Format", value: product.productType }
      : undefined,
    product.vendor ? { label: "Made by", value: product.vendor } : undefined,
  ].filter((value): value is { label: string; value: string } =>
    Boolean(value),
  );

  const meaningfulVariants =
    product.variants.length > 1 ||
    product.variants.some((variant) => variant.title !== "Default Title");
  if (meaningfulVariants) {
    const available = product.variants
      .filter((variant) => variant.availableForSale)
      .map((variant) => variant.title);
    const unavailable = product.variants
      .filter((variant) => !variant.availableForSale)
      .map((variant) => variant.title);
    if (available.length)
      details.push({ label: "Available formats", value: available.join(", ") });
    if (unavailable.length)
      details.push({ label: "Unavailable", value: unavailable.join(", ") });
  }
  return {
    card,
    description:
      product.description
        .replace(/([a-z.!?])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim() || "Full fragrance details are coming soon.",
    details,
    variants: meaningfulVariants
      ? product.variants.map((variant) => ({
          id: variant.id,
          label: variant.title,
          available: variant.availableForSale,
        }))
      : [],
  };
}
