import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailTemplate } from "@/components/templates/storefront-templates";
import { getCachedProduct } from "@/lib/shopify/cached-catalog";
import { toProductDetails } from "@/lib/shopify/presentation";

type Props = { params: Promise<{ handle: string }> };

async function findProduct(handle: string) {
  const product = await getCachedProduct(handle);
  if (!product) notFound();
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await findProduct((await params).handle);
  return {
    title: product.seo.title || `${product.title} | Infusion Diffusion`,
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
  const product = await findProduct((await params).handle);
  const presentation = toProductDetails(product);
  return (
    <ProductDetailTemplate
      product={presentation.card}
      description={presentation.description}
      details={presentation.details}
      showPurchaseAction={false}
    />
  );
}
