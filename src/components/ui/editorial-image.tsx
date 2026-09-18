"use client";

import { getImageProps } from "next/image";
import { useState } from "react";
import type { EditorialImageSource } from "@/lib/editorial-image";
import { cn } from "@/lib/utils";
import { MediaFallback } from "./media-fallback";

type Props = {
  image: EditorialImageSource;
  decorative?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  mobileBreakpoint?: number;
};

export function EditorialImage(props: Props) {
  return (
    <ImageAttempt
      key={`${props.image.src}|${props.image.mobileSrc ?? ""}`}
      {...props}
    />
  );
}

function ImageAttempt({
  image,
  decorative = false,
  priority = false,
  sizes = "100vw",
  className,
  mobileBreakpoint = 640,
}: Props) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return decorative ? null : <MediaFallback label="Image unavailable" />;
  const common = {
    alt: decorative ? "" : image.alt,
    fill: true,
    sizes,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
  };
  const { props } = getImageProps({ ...common, src: image.src });
  const mobile = image.mobileSrc
    ? getImageProps({ ...common, src: image.mobileSrc }).props
    : undefined;
  return (
    <picture className="contents">
      {mobile ? (
        <source
          media={`(max-width: ${mobileBreakpoint - 1}px)`}
          srcSet={mobile.srcSet}
          sizes={sizes}
        />
      ) : null}
      {/* getImageProps supplies Next-optimized sources for native art direction. */}
      <img
        {...props}
        src={props.src}
        alt={props.alt}
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
