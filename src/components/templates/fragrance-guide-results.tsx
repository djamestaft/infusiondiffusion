"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GuideMatch } from "@/lib/fragrance-guide/matching";
import {
  guideQuestions,
  guideStages,
  type GuideAnswers,
} from "./fragrance-guide-questions";

function GuideResultLink({ item }: { item: GuideMatch }) {
  const [failed, setFailed] = useState(false);
  const showImage = item.image && !failed;
  return (
    <a
      href={`/products/${encodeURIComponent(item.handle)}`}
      className={cn(
        "focus-visible:outline-action-focus border-content-primary/30 group grid min-w-0 gap-5 border-b pb-7 focus-visible:outline-3 focus-visible:outline-offset-4 sm:gap-6",
        showImage && "sm:grid-cols-[168px_minmax(0,1fr)]",
      )}
    >
      {showImage ? (
        <div
          data-guide-reveal
          className="relative aspect-square w-28 sm:w-[168px]"
        >
          <Image
            src={item.image!.src}
            alt={item.image!.alt}
            fill
            sizes="(max-width: 639px) 112px, 168px"
            className="object-contain"
            onError={() => setFailed(true)}
          />
        </div>
      ) : null}
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[28px] leading-9 [overflow-wrap:anywhere] group-hover:underline sm:text-[32px] sm:leading-10">
            {item.title}
          </h2>
          <ArrowUpRight aria-hidden="true" className="mt-2 size-5 shrink-0" />
        </div>
        <p className="mt-3 text-[15px] leading-6">{item.reasons.join(" ")}</p>
        {item.tied ? (
          <p className="mt-3 text-[13px] leading-5">
            Shares its ranking with other fragrances under these preferences.
          </p>
        ) : null}
        {!item.availableForSale ? (
          <p className="mt-3 text-sm font-semibold">Currently unavailable</p>
        ) : null}
      </div>
    </a>
  );
}

export function GuideResults({
  matches,
  answers,
  unavailable,
  onEdit,
  onReset,
}: {
  matches: GuideMatch[];
  answers: GuideAnswers;
  unavailable: boolean;
  onEdit: (index: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="px-5 py-10 min-[375px]:px-6 sm:px-10 lg:px-16 lg:py-16">
      {matches.length > 0 ? (
        <header className="mb-8">
          <h1
            id="guide-shortlist-heading"
            data-guide-focus
            data-guide-reveal
            tabIndex={-1}
            className="font-display scroll-mt-40 text-[38px] leading-[46px] outline-none lg:text-[56px] lg:leading-[64px]"
          >
            Suggested fragrances
          </h1>
          <p className="mt-6 max-w-[900px] text-base leading-7">
            Based on your selected notes and character. Each suggestion explains
            the connection. Room, feeling, presence and time do not affect this
            list yet.
          </p>
        </header>
      ) : null}
      <div
        className={cn(
          "grid items-start gap-10 lg:gap-16",
          matches.length > 0 &&
            "lg:grid-cols-[minmax(0,864fr)_minmax(0,384fr)]",
        )}
      >
        {matches.length > 0 ? (
          <section
            aria-labelledby="guide-shortlist-heading"
            className="space-y-6"
          >
            {matches.map((item) => (
              <GuideResultLink key={item.id} item={item} />
            ))}
          </section>
        ) : null}
        <section
          aria-labelledby="guide-preferences-heading"
          className="bg-content-surface-quiet min-w-0 p-6"
        >
          {matches.length ? (
            <h2
              id="guide-preferences-heading"
              className="font-display text-[30px] leading-[38px]"
            >
              Your fragrance preferences
            </h2>
          ) : (
            <h1
              id="guide-preferences-heading"
              data-guide-focus
              data-guide-reveal
              tabIndex={-1}
              className="font-display scroll-mt-40 text-[38px] leading-[46px] outline-none"
            >
              Your fragrance preferences
            </h1>
          )}
          {!matches.length ? (
            <p className="mt-5 max-w-2xl text-base leading-7">
              {unavailable
                ? "Fragrance suggestions are temporarily unavailable. Your preferences are still here; explore the collection or try again later."
                : "No fragrances with an approved connection to your selected notes or character are available to show. Explore the collection to discover more."}
            </p>
          ) : null}
          <dl className="mt-5">
            {guideQuestions.map((question, index) => (
              <div key={question.title} className="mb-4">
                <dt className="text-xs leading-5">{guideStages[index]}</dt>
                <dd className="flex items-start justify-between gap-3 text-[15px] leading-6">
                  <span className="pt-2">{answers[index].join(", ")}</span>
                  <Button
                    variant="quiet"
                    className="shrink-0 px-3 text-xs tracking-normal"
                    aria-label={`Edit ${guideStages[index].toLowerCase()}`}
                    onClick={() => onEdit(index)}
                  >
                    Edit
                  </Button>
                </dd>
              </div>
            ))}
          </dl>
          <Button
            variant="quiet"
            asChild
            className="mt-2 flex w-fit px-0 text-sm tracking-normal"
          >
            <a href="/shop">
              EXPLORE THE COLLECTION{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
          <Button
            variant="quiet"
            className="mt-4 flex w-fit px-0 text-sm tracking-normal"
            onClick={onReset}
          >
            Reset guide
          </Button>
        </section>
      </div>
    </div>
  );
}
