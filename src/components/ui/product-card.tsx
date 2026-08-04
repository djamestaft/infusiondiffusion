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
}

export const formatProductCardPrice = formatCommerceMoney;

export function ProductCard({
  href,
  name,
  format,
  notes,
  price,
  compareAtPrice,
  priceType = compareAtPrice ? "sale" : "regular",
  image,
  availability = "in-stock",
  lowStockCount,
  className,
  imagePriority = false,
}: ProductCardProps) {
  const showStatus = availability !== "in-stock";
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <Link
      href={href}
      aria-label={`View ${name}`}
      className={cn(
        "group bg-product-card-surface text-product-card-text hover:bg-product-card-hover focus-visible:ring-product-card-focus relative grid w-full max-w-72 grid-rows-[auto_1fr] rounded-lg p-0.5 no-underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset motion-reduce:transition-none",
        className,
      )}
    >
      <div className="bg-product-card-media-fallback relative aspect-3/4 w-full overflow-hidden rounded-t-lg rounded-b-none">
        {showImage ? (
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
          <span className="text-product-card-meta flex size-full items-center justify-center px-4 text-center font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
            Image coming soon
          </span>
        )}
        {showStatus ? (
          <CommerceStatus
            status={availability}
            treatment="overlay"
            lowStockCount={lowStockCount}
            className="absolute top-2 right-2"
          />
        ) : null}
      </div>

      <div className="flex min-h-52 flex-col gap-2 px-2 py-3 sm:min-h-54 sm:px-3 sm:py-4">
        <p className="text-product-card-meta line-clamp-2 font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
          {format}
        </p>
        <h3 className="font-display text-product-card-text group-hover:text-product-card-accent line-clamp-2 text-2xl leading-8 font-normal decoration-1 underline-offset-4 group-hover:underline">
          {name}
        </h3>
        <p className="text-product-card-meta line-clamp-2 font-sans text-sm leading-5">
          {notes}
        </p>
        <PriceDisplay
          price={price}
          compareAtPrice={compareAtPrice}
          type={priceType}
          size="compact"
          className="mt-auto"
        />
      </div>
    </Link>
  );
}
