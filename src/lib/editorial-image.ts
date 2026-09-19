export type EditorialImageSource = {
  src: string;
  alt: string;
  mobileSrc?: string;
};

export function normalizeEditorialImage(
  image?: {
    src?: string | null;
    alt?: string | null;
    mobileSrc?: string | null;
  } | null,
): EditorialImageSource | undefined {
  if (!image?.src?.trim() || !image.alt?.trim()) return undefined;
  return {
    src: image.src.trim(),
    alt: image.alt.trim(),
    ...(image.mobileSrc?.trim() ? { mobileSrc: image.mobileSrc.trim() } : {}),
  };
}
