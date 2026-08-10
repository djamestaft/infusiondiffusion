"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type StorefrontImage = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
};

export function StorefrontMedia({
  image,
  className,
  sizes,
  priority = false,
  fit = "cover",
}: {
  image: StorefrontImage;
  className?: string;
  sizes: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  const [source, setSource] = useState(image.src);
  const [usedFallback, setUsedFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <Image
      src={source}
      alt={usedFallback ? (image.fallbackAlt ?? image.alt) : image.alt}
      fill
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      className={cn(
        fit === "contain" ? "object-contain" : "object-cover",
        className,
      )}
      onError={() => {
        if (
          !usedFallback &&
          image.fallbackSrc &&
          image.fallbackSrc !== source
        ) {
          setUsedFallback(true);
          setSource(image.fallbackSrc);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
