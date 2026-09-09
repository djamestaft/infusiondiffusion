"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { GalleryViewer } from "@/components/gallery-viewer";
import { TemplateShell } from "@/components/templates/storefront-templates";
import { Button } from "@/components/ui/button";
import type { AboutPage, GalleryPage } from "@/sanity/lib/editorial-pages";
import { fallbackSiteSettings } from "@/sanity/types";
import { cn } from "@/lib/utils";

export type CombinedAboutProps = {
  page: AboutPage;
  gallery?: GalleryPage;
  heroImage?: { src: string; alt: string };
  bornStory?: string;
  cartCount?: number;
};

const gutters = "px-5 min-[375px]:px-6 sm:px-10 lg:px-16";
const confidence = {
  heading: "Find your fragrance with confidence.",
  body: "Choosing a fragrance is personal. Our focused collection of six scents gives you space to explore what you love and the atmosphere you want to create. Discover the character of each fragrance, and choose the one that feels right for your home.",
};

export function CombinedAboutTemplate({
  page,
  gallery,
  heroImage,
  bornStory = fallbackSiteSettings.homepage.founderStory,
  cartCount,
}: CombinedAboutProps) {
  const [heroFailed, setHeroFailed] = useState(false);
  const campaignRoles = [
    "campaign-blanc-travertine",
    "campaign-bois-emerald",
    "campaign-serein-botanical",
    "campaign-serein-library",
  ];
  const campaignItems = campaignRoles.flatMap((id) => {
    const item = gallery?.campaignItems.find((image) => image.id === id);
    return item ? [item] : [];
  });
  const chapter = (role: "development" | "principles") =>
    page.chapters.find((item) => item.role === role);
  const chapters = [
    {
      role: "origin",
      heading:
        page.chapters.find((item) => item.role === "origin")?.heading ??
        "Born from fragrance",
      body: bornStory,
    },
    { role: "development", ...chapter("development") },
    { role: "principles", ...chapter("principles") },
    { role: "confidence", ...confidence },
  ];
  const renderChapters = (figures: ReactNode[]) =>
    chapters.map((item, index) => {
      const figure =
        figures[
          campaignItems.findIndex((image) => image.id === campaignRoles[index])
        ];
      return (
        <section
          key={item.role}
          data-testid={`about-chapter-${item.role}`}
          className={cn(
            gutters,
            "grid gap-6 py-5 sm:py-8 lg:grid-cols-2 lg:items-center lg:gap-12",
            !figure && "lg:block",
            index === 0 &&
              "dark bg-content-surface lg:grid-cols-[minmax(0,560fr)_minmax(0,704fr)]",
          )}
        >
          {index === 0 ? figure : null}
          <div
            className={cn(
              "text-content-secondary min-w-0 space-y-6",
              index === 0 && "text-content-primary",
              index === 2 && "lg:order-2",
            )}
          >
            <h2 className="font-display text-[30px] leading-[1.45] font-normal [overflow-wrap:anywhere] sm:text-[36px] lg:text-[44px]">
              {item.heading}
            </h2>
            <div className="space-y-[26px] text-lg leading-[26px] [overflow-wrap:anywhere]">
              {item.body?.split(/\n\s*\n/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {index !== 0 ? figure : null}
        </section>
      );
    });

  return (
    <TemplateShell
      currentHref="/about"
      navigationTheme="midnight"
      cartCount={cartCount}
    >
      <article data-testid="about-page">
        <header
          className={cn(
            gutters,
            "dark bg-content-surface text-content-primary relative isolate flex flex-col items-center justify-center gap-6 py-10 text-center sm:py-16 lg:gap-12",
          )}
        >
          {heroImage && !heroFailed ? (
            <Image
              src={heroImage.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-20 object-cover"
              onError={() => setHeroFailed(true)}
            />
          ) : null}
          <div className="bg-content-surface absolute inset-0 -z-10 opacity-65" />
          <h1 className="font-display w-full text-[38px] leading-[1.45] font-normal [overflow-wrap:anywhere] sm:text-5xl lg:text-[64px]">
            {page.title}
          </h1>
          <p className="max-w-[760px] text-lg leading-[26px]">
            {page.introduction}
          </p>
        </header>
        <GalleryViewer
          items={campaignItems}
          presentation="about"
          renderGallery={renderChapters}
          prioritizeFirst
        />
        {gallery?.marketItems.length ? (
          <section
            className={cn(
              gutters,
              "bg-product-card-surface pt-5 pb-10 sm:pt-8 sm:pb-16",
            )}
            aria-labelledby="about-market-heading"
          >
            <h2
              id="about-market-heading"
              className="font-display text-content-secondary mb-6 text-[30px] leading-[1.45] font-normal sm:mb-12 sm:text-4xl lg:text-[44px]"
            >
              In the Market
            </h2>
            <GalleryViewer
              items={gallery.marketItems}
              layout="market"
              presentation="about"
              headingLevel={3}
              prioritizeFirst={false}
            />
          </section>
        ) : (
          <section
            className={cn(gutters, "py-10")}
            aria-label="Market photographs"
          >
            <p className="text-content-secondary">
              {gallery?.unavailable
                ? "The photographs are temporarily unavailable. Please try again later."
                : "Market photographs will appear here when available."}
            </p>
          </section>
        )}
        <section
          className={cn(
            gutters,
            "flex flex-col items-start gap-6 py-10 sm:gap-12 sm:py-16",
          )}
          aria-labelledby="about-cta-heading"
        >
          <h2
            id="about-cta-heading"
            className="font-display text-content-secondary text-[30px] leading-[1.45] font-normal sm:text-4xl lg:text-[44px]"
          >
            Find the fragrance for your room.
          </h2>
          <p className="text-content-secondary max-w-[760px] text-lg leading-[26px]">
            Explore the Fragrance Guide for scent notes, room context and a
            clear path through the collection.
          </p>
          <Button asChild className="min-h-12 w-[320px] max-w-full">
            <a href="/fragrance-guide">Explore the Fragrance Guide</a>
          </Button>
        </section>
      </article>
    </TemplateShell>
  );
}
