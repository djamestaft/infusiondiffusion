"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { GalleryGroup, GalleryItem } from "@/sanity/lib/editorial-pages";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GalleryViewerProps = {
  items: GalleryItem[];
  layout?: GalleryGroup;
  headingLevel?: 2 | 3;
  prioritizeFirst?: boolean;
};

export function galleryMarketAspectRatio(item: GalleryItem, index: number) {
  const dimensions = item.image.dimensions;
  if (dimensions) {
    const crop = item.image.crop;
    const retainedWidth = crop ? 1 - crop.left - crop.right : 1;
    const retainedHeight = crop ? 1 - crop.top - crop.bottom : 1;
    const ratio = dimensions.aspectRatio * (retainedWidth / retainedHeight);
    if (Number.isFinite(ratio) && ratio > 0) return ratio;
  }
  return index === 0 ? 16 / 9 : index === 1 ? 3 / 4 : 4 / 3;
}

export function galleryThumbnailStyle(item: GalleryItem) {
  const crop = item.image.crop;
  const position = item.image.hotspot
    ? `${item.image.hotspot.x * 100}% ${item.image.hotspot.y * 100}%`
    : crop
      ? `${((crop.left + 1 - crop.right) / 2) * 100}% ${((crop.top + 1 - crop.bottom) / 2) * 100}%`
      : "center";
  if (!crop) return { objectPosition: position };

  // Sanity stores four normalized source-image crop edges. Independent X/Y
  // scaling retains exactly the authored rectangle before object-cover applies
  // the responsive slot; the hotspot remains the visual anchor.
  const retainedWidth = 1 - crop.left - crop.right;
  const retainedHeight = 1 - crop.top - crop.bottom;
  const origin = `${((crop.left + 1 - crop.right) / 2) * 100}% ${((crop.top + 1 - crop.bottom) / 2) * 100}%`;
  return {
    objectPosition: position,
    transform: `scale(${1 / retainedWidth}, ${1 / retainedHeight})`,
    transformOrigin: origin,
  };
}

export function galleryMarketImageStyle(item: GalleryItem) {
  return { objectPosition: galleryThumbnailStyle(item).objectPosition };
}

function ImageFailure({ alt }: { alt: string }) {
  return (
    <span className="text-content-secondary absolute inset-0 flex items-center justify-center p-5 text-center font-sans text-sm leading-6 [overflow-wrap:anywhere]">
      {alt}
    </span>
  );
}

export function GalleryViewer({
  items,
  layout = "campaign",
  headingLevel = 2,
  prioritizeFirst = layout === "campaign",
}: GalleryViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const openerIndex = useRef<number | null>(null);
  const selected = selectedIndex === null ? null : items[selectedIndex];
  const hasFailed = (id: string) => failedImages.has(id);
  const markFailed = (id: string) =>
    setFailedImages((current) => new Set(current).add(id));
  const close = () => setSelectedIndex(null);
  const ItemHeading = headingLevel === 3 ? "h3" : "h2";

  return (
    <>
      <div
        className={cn(
          "grid",
          layout === "campaign"
            ? "gap-x-20 gap-y-16 lg:grid-cols-2 lg:gap-y-16"
            : "gap-x-8 gap-y-4 min-[1408px]:!grid-cols-[repeat(3,minmax(0,400px))] lg:grid-cols-3 lg:items-start lg:gap-y-8",
        )}
        data-testid="gallery-grid"
        data-layout={layout}
      >
        {items.map((item, index) => (
          <figure
            key={item.id}
            className={cn(
              "min-w-0",
              layout === "campaign" &&
                index % 4 === 0 &&
                "lg:col-start-1 lg:row-start-1",
              layout === "campaign" &&
                index % 4 === 1 &&
                "lg:col-start-2 lg:row-start-1",
              layout === "campaign" &&
                index % 4 === 2 &&
                "lg:col-start-2 lg:row-start-2 lg:-mt-[332px]",
              layout === "campaign" &&
                index % 4 === 3 &&
                "lg:col-start-1 lg:row-start-2",
              layout === "market" && index === 0 && "lg:col-span-2",
              layout === "market" && index === 1 && "min-[1408px]:w-[416px]",
            )}
          >
            <button
              ref={(node) => {
                triggers.current[index] = node;
              }}
              type="button"
              aria-label={`View ${item.title}`}
              onClick={() => {
                openerIndex.current = index;
                setSelectedIndex(index);
              }}
              style={
                layout === "market"
                  ? { aspectRatio: galleryMarketAspectRatio(item, index) }
                  : undefined
              }
              className={cn(
                "focus-visible:outline-navigation-focus bg-content-surface-elevated relative block w-full overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-4",
                layout === "campaign" &&
                  (index % 4 === 0 || index % 4 === 2
                    ? "aspect-[350/438] lg:aspect-[600/760]"
                    : "aspect-[350/270] lg:aspect-[600/460]"),
                layout === "market" && index === 0 && "aspect-video",
                layout === "market" && index === 1 && "aspect-3/4",
                layout === "market" && index > 1 && "aspect-4/3",
              )}
            >
              {hasFailed(item.id) ? (
                <ImageFailure alt={item.image.alt} />
              ) : null}
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                priority={prioritizeFirst && index === 0}
                loading={prioritizeFirst && index === 0 ? "eager" : "lazy"}
                sizes={
                  layout === "campaign"
                    ? "(max-width: 1023px) calc(100vw - 40px), 600px"
                    : index === 0
                      ? "(max-width: 389px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1407px) calc(66.667vw - 96px), 832px"
                      : index === 1
                        ? "(max-width: 389px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1407px) calc(33.333vw - 64px), 416px"
                        : "(max-width: 389px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1407px) calc(33.333vw - 64px), 400px"
                }
                className={cn("object-cover", hasFailed(item.id) && "hidden")}
                style={
                  layout === "market"
                    ? galleryMarketImageStyle(item)
                    : galleryThumbnailStyle(item)
                }
                onError={() => markFailed(item.id)}
              />
            </button>
            <figcaption className="mt-4 min-w-0 [overflow-wrap:anywhere]">
              <ItemHeading className="font-display text-content-primary text-[28px] leading-9">
                {item.title}
              </ItemHeading>
              <p className="text-content-secondary mt-2 font-sans text-base leading-[1.625] [overflow-wrap:anywhere]">
                {item.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && close()}
      >
        {selected ? (
          <DialogContent
            showClose={false}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (openerIndex.current !== null) {
                triggers.current[openerIndex.current]?.focus();
              }
            }}
            className="dark bg-content-surface text-content-primary fixed inset-0 h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none p-5 shadow-none lg:p-20 [&>span]:hidden"
          >
            <DialogClose
              autoFocus
              aria-label="Close gallery viewer"
              className="border-overlay-muted text-overlay-text hover:bg-action-quiet-hover focus-visible:outline-overlay-focus fixed top-5 right-5 z-10 inline-flex min-h-11 items-center justify-center rounded-md border px-5 font-sans text-sm font-semibold tracking-[0.04em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 lg:top-8 lg:right-8"
            >
              Close
            </DialogClose>
            <div className="flex w-full max-w-[920px] flex-col pt-19 pb-5 lg:h-full lg:pt-0">
              <div className="bg-content-surface-elevated relative aspect-[35/47] w-full lg:aspect-auto lg:h-[720px] lg:w-[920px]">
                {hasFailed(selected.id) ? (
                  <ImageFailure alt={selected.image.alt} />
                ) : null}
                <Image
                  src={selected.image.src}
                  alt={selected.image.alt}
                  fill
                  sizes="(max-width: 1023px) calc(100vw - 40px), 920px"
                  className={cn(
                    "object-contain",
                    hasFailed(selected.id) && "hidden",
                  )}
                  onError={() => markFailed(selected.id)}
                />
              </div>
              <DialogTitle className="mt-6 [overflow-wrap:anywhere]">
                {selected.title}
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-[70ch] [overflow-wrap:anywhere]">
                {selected.caption}
              </DialogDescription>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="font-sans text-xs font-semibold tracking-[0.08em] uppercase">
                  Image {selectedIndex! + 1} of {items.length}
                </p>
                {items.length > 1 ? (
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      aria-label="Previous image"
                      disabled={selectedIndex === 0}
                      onClick={() =>
                        setSelectedIndex((index) => (index ?? 0) - 1)
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label="Next image"
                      disabled={selectedIndex === items.length - 1}
                      onClick={() =>
                        setSelectedIndex((index) => (index ?? 0) + 1)
                      }
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
