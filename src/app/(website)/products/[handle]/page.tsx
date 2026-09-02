import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailTemplate } from "@/components/templates/storefront-templates";
import { AddToCart } from "@/components/cart/add-to-cart";
import { addToCartAction } from "@/app/(website)/cart/actions";
import { readCart } from "@/lib/shopify/cart-session";
import { getCachedProduct } from "@/lib/shopify/cached-catalog";
import { toProductDetails } from "@/lib/shopify/presentation";
import { absoluteStorefrontTitle } from "@/lib/metadata-title";

type Props = { params: Promise<{ handle: string }> };

async function findProduct(handle: string) {
  const product = await getCachedProduct(handle);
  if (!product) notFound();
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await findProduct((await params).handle);
  return {
    title: absoluteStorefrontTitle(product.seo.title || product.title),
    description: product.seo.description || product.description.slice(0, 160),
    openGraph: {
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              alt: product.featuredImage.altText || product.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const [product, cart] = await Promise.all([
    findProduct((await params).handle),
    readCart(),
  ]);
  const presentation = toProductDetails(product);
  const variant =
    product.variants.find((item) => item.availableForSale) ??
    product.variants[0];
  return (
    <ProductDetailTemplate
      product={presentation.card}
      description={presentation.description}
      details={presentation.details}
      cartCount={cart.totalQuantity}
      showPurchaseAction={false}
      purchaseAction={
        variant ? (
          <AddToCart
            merchandiseId={variant.id}
            disabled={!variant.availableForSale}
            action={addToCartAction}
          />
        ) : null
      }
    />
  );
}
