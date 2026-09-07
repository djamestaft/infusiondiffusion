"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  CommerceStatus,
  type CommerceStatusValue,
} from "@/components/ui/commerce-status";
import {
  formatCommerceMoney,
  type CommerceMoney,
  PriceDisplay,
  type PriceDisplayType,
} from "@/components/ui/price-display";
import { MediaFallback } from "@/components/ui/media-fallback";
import { cn } from "@/lib/utils";

export type ProductCardMoney = CommerceMoney;

export interface ProductCardImage {
  src: string;
  alt: string;
}

export interface ProductCardProps {
  href: string;
  name: string;
  format: string;
  notes: string;
  price: ProductCardMoney;
  compareAtPrice?: ProductCardMoney;
  priceType?: PriceDisplayType;
  image?: ProductCardImage;
  availability?: CommerceStatusValue;
  lowStockCount?: number;
  className?: string;
  imagePriority?: boolean;
  loading?: boolean;
}

export const formatProductCardPrice = formatCommerceMoney;

export function ProductCard({
  href,
  name,
  format,
  price,
  compareAtPrice,
  priceType = compareAtPrice ? "sale" : "regular",
  image,
  availability = "in-stock",
  lowStockCount,
  className,
  imagePriority = false,
  loading = false,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <Link
      href={href}
      aria-label={`View ${name}`}
      aria-disabled={loading || undefined}
      tabIndex={loading ? -1 : undefined}
      onClick={loading ? (event) => event.preventDefault() : undefined}
      className={cn(
        "group bg-product-card-surface text-product-card-text hover:bg-product-card-hover focus-visible:ring-product-card-focus relative grid w-full max-w-96 grid-rows-[auto_1fr] no-underline transition-colors outline-none focus-visible:ring-3 focus-visible:ring-offset-2 motion-reduce:transition-none",
        className,
      )}
      aria-busy={loading || undefined}
    >
      <div className="bg-product-card-media-fallback relative aspect-square w-full overflow-hidden">
        {loading ? (
          <MediaFallback
            label="Loading product image"
            className="animate-pulse motion-reduce:animate-none"
          />
        ) : showImage ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={imagePriority}
            loading={imagePriority ? "eager" : "lazy"}
            sizes="(max-width: 767px) calc((100vw - 56px) / 2), 284px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <MediaFallback />
        )}
      </div>

      <div className="flex min-h-40 flex-col gap-2 px-4 pt-3 pb-4">
        <h3
          className={cn(
            "font-display text-product-card-text group-hover:text-product-card-accent text-xl leading-7 font-normal decoration-1 underline-offset-4 group-hover:underline",
            loading &&
              "bg-product-card-media-fallback h-7 w-3/4 animate-pulse text-transparent motion-reduce:animate-none",
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "text-product-card-meta font-sans text-xs leading-4",
            loading &&
              "bg-product-card-media-fallback h-4 w-28 animate-pulse text-transparent motion-reduce:animate-none",
          )}
        >
          {format}
        </p>
        {loading ? (
          <span
            aria-hidden="true"
            className="bg-product-card-media-fallback h-5 w-24 animate-pulse rounded-sm motion-reduce:animate-none"
          />
        ) : (
          <PriceDisplay
            price={price}
            compareAtPrice={compareAtPrice}
            type={priceType}
            size="compact"
            className=""
          />
        )}
        {loading ? (
          <span
            aria-hidden="true"
            className="bg-product-card-media-fallback h-5 w-20 animate-pulse rounded-sm motion-reduce:animate-none"
          />
        ) : (
          <CommerceStatus
            status={availability}
            lowStockCount={lowStockCount}
            className="py-0 text-xs font-normal"
          />
        )}
      </div>
    </Link>
  );
}
