"use client";

import Image from "next/image";
import { useState } from "react";

export function ContactHeroMedia({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
