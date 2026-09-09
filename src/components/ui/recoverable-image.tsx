"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { MediaFallback } from "@/components/ui/media-fallback";

type RecoverableImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackClassName?: string;
};

export function RecoverableImage(props: RecoverableImageProps) {
  return <ImageAttempt key={props.src} {...props} />;
}

function ImageAttempt({
  src,
  alt,
  fallbackClassName,
  ...props
}: RecoverableImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <MediaFallback label="Image unavailable" className={fallbackClassName} />
    );
  }
  return (
    <Image {...props} src={src} alt={alt} onError={() => setFailed(true)} />
  );
}
