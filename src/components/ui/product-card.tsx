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
        "group bg-product-card-surface text-product-card-text focus-visible:ring-product-card-focus relative grid w-full max-w-72 grid-rows-[auto_1fr] overflow-hidden rounded-md no-underline transition-[transform,box-shadow] duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_18px_48px_-32px_var(--content-primary)] focus-visible:ring-2 focus-visible:ring-inset motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
    >
      <div className="bg-product-card-media-fallback relative aspect-3/4 w-full overflow-hidden">
        {showImage ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={imagePriority}
            loading={imagePriority ? "eager" : "lazy"}
            sizes="(max-width: 767px) calc((100vw - 56px) / 2), 284px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
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

      <div className="bg-product-card-content-surface flex min-h-52 flex-col gap-2 px-4 py-5 sm:min-h-56 sm:px-5 sm:py-6">
        <p className="text-product-card-meta line-clamp-2 font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
          {format}
        </p>
        <h3 className="font-display text-product-card-text group-hover:text-product-card-accent line-clamp-2 text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.2] font-normal transition-colors duration-300 motion-reduce:transition-none">
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
