"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface ProductCardMoney {
  amount: string;
  currencyCode: "ZAR";
}

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
  image?: ProductCardImage;
  availability?: "available" | "sold-out";
  className?: string;
  imagePriority?: boolean;
}

const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatProductCardPrice({
  amount,
  currencyCode,
}: ProductCardMoney) {
  const value = Number(amount);

  if (currencyCode !== "ZAR" || !Number.isFinite(value)) {
    return amount;
  }

  return zarFormatter.format(value).replace(/\u00a0/g, " ");
}

export function ProductCard({
  href,
  name,
  format,
  notes,
  price,
  image,
  availability = "available",
  className,
  imagePriority = false,
}: ProductCardProps) {
  const soldOut = availability === "sold-out";
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <Link
      href={href}
      aria-label={`View ${name}`}
      className={cn(
        "group bg-product-card-surface text-product-card-text hover:bg-product-card-hover focus-visible:ring-product-card-focus relative grid w-full max-w-72 grid-rows-[auto_1fr] rounded-sm p-0.5 no-underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset motion-reduce:transition-none",
        className,
      )}
    >
      <div className="bg-product-card-media-fallback relative aspect-3/4 w-full overflow-hidden rounded-t-sm rounded-b-none">
        {showImage ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={imagePriority}
            sizes="(max-width: 767px) calc((100vw - 56px) / 2), 284px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="text-product-card-meta flex size-full items-center justify-center px-4 text-center font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
            Image coming soon
          </span>
        )}
        {soldOut ? (
          <span className="bg-product-card-status text-product-card-status-foreground absolute top-2 right-2 px-2 py-1 font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
            Sold out
          </span>
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
        <p className="text-product-card-price mt-auto font-sans text-sm leading-5 font-semibold">
          {formatProductCardPrice(price)}
        </p>
      </div>
    </Link>
  );
}
