"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { TemplateShell } from "@/components/templates/storefront-templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { homeInvitationCopy } from "@/components/templates/home-copy";
import {
  matchFragrances,
  noteChoices,
  type GuideProduct,
} from "@/lib/fragrance-guide/matching";

export const guideQuestions = [
  {
    title: "Which room are you choosing for?",
    hint: "Choose one room.",
    choices: ["Living room", "Bedroom", "Entrance", "Workspace", "Dining room"],
  },
  {
    title: "How should the room feel?",
    hint: "Choose the feeling you want to return to.",
    choices: [
      "Bright & clear",
      "Soft & restful",
      "Warm & enveloping",
      "Deep & dramatic",
      "Polished & welcoming",
    ],
  },
  {
    title: "Which notes are you drawn to?",
    hint: "Choose up to two note families.",
    choices: [
      "Citrus & fresh",
      "Soft florals",
      "Amber & vanilla",
      "Spice & woods",
      "Incense & musk",
      "Spa-like calm",
    ],
    multiple: true,
  },
  {
    title: "How present should it feel?",
    hint: "Choose one level of presence.",
    choices: ["Quiet background", "Noticeable balance", "Rich presence"],
  },
  {
    title: "When will you enjoy it most?",
    hint: "Choose the time that best represents the room.",
    choices: ["Morning", "Throughout the day", "Evening", "Any time"],
  },
] as const;

export type GuideAnswers = string[][];
export type FragranceGuideProps = {
  initialAnswers?: GuideAnswers;
  initialQuestion?: number;
  products?: GuideProduct[] | null;
  initialReviewed?: boolean;
  onContinue?: (answers: GuideAnswers) => void;
  cartCount?: number;
};

const gutters = "px-5 min-[375px]:px-6 sm:px-10 lg:px-16";
export function FragranceGuideTemplate({
  initialAnswers,
  initialQuestion = 0,
  products = null,
  initialReviewed = false,
  onContinue,
  cartCount,
}: FragranceGuideProps) {
  const [answers, setAnswers] = useState<GuideAnswers>(() =>
    guideQuestions.map((q, i) =>
      (initialAnswers?.[i] ?? [])
        .filter((v) => (q.choices as readonly string[]).includes(v))
        .slice(0, i === 2 ? 2 : 1),
    ),
  );
  const [error, setError] = useState("");
  const [active, setActive] = useState(
    Math.min(4, Math.max(0, initialQuestion)),
  );
  const [reviewed, setReviewed] = useState(initialReviewed);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false);
  const selectedNotes = noteChoices
    .filter((note) => answers[2].includes(note.label))
    .map((note) => note.id);
  const matches =
    reviewed && products ? matchFragrances(selectedNotes, products) : [];
  useEffect(() => {
    if (reviewed && submitted.current) reviewHeading.current?.focus();
  }, [reviewed]);
  const groups = useRef<Array<HTMLFieldSetElement | null>>([]);
  const update = (index: number, value: string) => {
    setReviewed(false);
    setActive(index);
    if (
      index === 2 &&
      !answers[index].includes(value) &&
      answers[index].length === 2
    ) {
      setError(
        "Choose up to two note families. Deselect one to choose another.",
      );
      return;
    }
    setError("");
    setAnswers((current) =>
      current.map((selected, i) =>
        i !== index
          ? selected
          : index === 2
            ? selected.includes(value)
              ? selected.filter((v) => v !== value)
              : [...selected, value]
            : [value],
      ),
    );
  };
  const focusQuestion = (index: number) => {
    setActive(index);
    groups.current[index]?.querySelector<HTMLInputElement>("input")?.focus();
  };
  const continueGuide = () => {
    const missing = answers.findIndex((selected) => selected.length === 0);
    if (missing !== -1) {
      setError("Choose an answer for each question before continuing.");
      focusQuestion(missing);
      return;
    }
    setError("");
    submitted.current = true;
    setReviewed(true);
    onContinue?.(answers.map((selected) => [...selected]));
  };

  return (
    <TemplateShell
      navigationTheme="midnight"
      currentHref="/fragrance-guide"
      cartCount={cartCount}
    >
      <header
        className={cn(
          gutters,
          "dark bg-content-surface text-content-primary grid items-center gap-6 py-16 lg:grid-cols-[minmax(0,600fr)_minmax(0,656fr)] lg:gap-14",
        )}
      >
        <div className="space-y-[30px]">
          <h1 className="font-display text-[54px] leading-[1.12] font-normal [overflow-wrap:anywhere]">
            Find the atmosphere that belongs in your room
          </h1>
          <p className="max-w-[520px] text-[17px] leading-[1.5] opacity-85">
            Find suggestions based on your selected notes and fragrance
            character. Your other answers are kept in your preference summary.
          </p>
        </div>
        <div className="border-navigation-accent/55 relative aspect-2/1 w-full border">
          <Image
            src="/images/homepage-bespoke-diffuser-blurb.png"
            alt="Reed diffuser in a softly lit room"
            fill
            sizes="(max-width: 1023px) calc(100vw - 48px), calc(50vw - 64px)"
            className="object-cover"
            priority
          />
        </div>
      </header>
      <form
        className={gutters}
        onSubmit={(event) => {
          event.preventDefault();
          continueGuide();
        }}
      >
        {guideQuestions.map((question, index) => (
          <fieldset
            key={question.title}
            ref={(node) => {
              groups.current[index] = node;
            }}
            className="border-content-primary/20 min-w-0 border-b py-10"
            aria-describedby={`guide-hint-${index}`}
          >
            <legend className="font-display float-left mb-1.5 flex w-full gap-3 text-[28px] leading-[1.45] font-normal">
              <span className="text-guide-question-number" aria-hidden="true">
                {index + 1}.
              </span>
              <span>{question.title}</span>
            </legend>
            <p
              id={`guide-hint-${index}`}
              className="clear-both mb-6 pl-8 text-[15px] leading-[1.45]"
            >
              {question.hint}
            </p>
            <div className="flex flex-wrap gap-3">
              {question.choices.map((choice) => {
                const selected = answers[index].includes(choice);
                return (
                  <label
                    key={choice}
                    className={cn(
                      "has-focus-visible:outline-action-focus relative isolate flex min-h-12 cursor-pointer items-center rounded-full border px-5 py-3 text-[15px] leading-[1.45] font-medium has-focus-visible:outline-3 has-focus-visible:outline-offset-2",
                      selected
                        ? "action-primary-material bg-action-primary text-action-primary-foreground border-transparent"
                        : "border-guide-answer-border bg-guide-answer-surface text-content-primary hover:bg-action-quiet-hover",
                    )}
                  >
                    <input
                      className="sr-only"
                      type={index === 2 ? "checkbox" : "radio"}
                      name={`question-${index}`}
                      value={choice}
                      checked={selected}
                      onChange={() => update(index, choice)}
                      onFocus={() => setActive(index)}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      {selected ? (
                        <Check aria-hidden="true" className="size-4 shrink-0" />
                      ) : null}
                      {choice}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        {error ? (
          <p role="alert" className="text-feedback-error-foreground mt-6">
            {error}
          </p>
        ) : null}
        <div className="grid grid-cols-2 justify-items-center gap-4 py-8 sm:grid-cols-[160px_minmax(0,1fr)_160px] sm:items-center lg:grid-cols-[238px_minmax(0,1fr)_238px] lg:py-12">
          <div className="col-span-2 flex items-center justify-center gap-3.5 sm:col-span-1 sm:col-start-2 sm:row-start-1">
            <span className="text-[11px] font-semibold whitespace-nowrap lg:text-[13px]">
              QUESTION {active + 1} OF 5
            </span>
            <div
              role="progressbar"
              aria-label="Current question"
              aria-valuenow={active + 1}
              aria-valuemin={1}
              aria-valuemax={5}
              className="bg-content-primary/20 h-[3px] w-20 lg:w-[220px]"
            >
              <div
                className="bg-action-primary h-full"
                style={{ width: `${(active + 1) * 20}%` }}
              />
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-28 justify-self-end min-[375px]:w-[120px] sm:col-start-1 sm:row-start-1 sm:min-h-12 sm:w-40 lg:w-[238px]"
            disabled={active === 0}
            onClick={() => focusQuestion(Math.max(0, active - 1))}
          >
            BACK
          </Button>
          <Button
            type="submit"
            className="w-28 justify-self-start min-[375px]:w-[120px] sm:col-start-3 sm:row-start-1 sm:min-h-12 sm:w-40 lg:w-[238px]"
          >
            CONTINUE
          </Button>
        </div>
        <p role="status" className="sr-only">
          {reviewed ? "Your preferences are ready to review." : ""}
        </p>
        {reviewed ? (
          <section
            className="space-y-6 pb-12"
            aria-labelledby="guide-preferences-heading"
          >
            <h2
              id="guide-preferences-heading"
              ref={reviewHeading}
              tabIndex={-1}
              className="font-display focus-visible:outline-action-focus scroll-mt-28 text-3xl font-normal focus-visible:outline-3 focus-visible:outline-offset-4"
            >
              Your fragrance preferences
            </h2>
            <dl className="grid gap-6 sm:grid-cols-2">
              {guideQuestions.map((question, index) => (
                <div key={question.title}>
                  <dt className="font-semibold">{question.title}</dt>
                  <dd className="mt-2">{answers[index].join(", ")}</dd>
                </div>
              ))}
            </dl>
            {!matches.length ? (
              <p>
                {products === null
                  ? "Fragrance suggestions are temporarily unavailable. Your preferences are still here; explore the collection or try again later."
                  : "No fragrances with an approved connection to your selected notes or character are available to show. Explore the collection to discover more."}
              </p>
            ) : null}
            <Button asChild>
              <a href="/shop">EXPLORE THE COLLECTION</a>
            </Button>
          </section>
        ) : null}
      </form>
      {reviewed && matches.length > 0 ? (
        <section
          className={cn(
            gutters,
            "dark bg-content-surface text-content-primary grid gap-6 py-16 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16",
          )}
          aria-labelledby="guide-shortlist-heading"
        >
          <div className="space-y-[18px]">
            <h2
              id="guide-shortlist-heading"
              className="font-display text-5xl leading-[1.12] font-normal"
            >
              Suggested fragrances
            </h2>
            <p className="text-base leading-6">
              Based on your selected notes and character. Each suggestion
              explains the connection. Room, feeling, presence and time do not
              affect this list yet.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-7">
            {matches.map((item) => (
              <a
                key={item.id}
                href={`/products/${encodeURIComponent(item.handle)}`}
                className="border-action-primary focus-visible:outline-action-focus flex flex-col gap-4 border p-6 focus-visible:outline-3 focus-visible:outline-offset-4 lg:min-h-[220px]"
              >
                <h3 className="font-display text-[25px] leading-[1.45] font-normal">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.45]">
                  {item.reasons.join(" ")}
                </p>
                {item.tied ? (
                  <p className="text-[15px] leading-[1.45]">
                    Shares its ranking with other fragrances under these
                    preferences.
                  </p>
                ) : null}
                {!item.availableForSale ? (
                  <p className="text-[15px] leading-[1.45] font-semibold">
                    Currently unavailable
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}
      <section
        className={cn(
          gutters,
          "bg-collection-invitation-surface flex flex-col items-center gap-[26px] py-[62px] text-center sm:gap-7 sm:py-[76px] lg:gap-8 lg:py-[92px]",
        )}
      >
        <h2 className="font-display text-4xl leading-[44px] font-normal sm:text-[38px] sm:leading-[46px] lg:text-[52px] lg:leading-[62px]">
          Six fragrances. A roomful of possibility.
        </h2>
        <p className="max-w-[1000px] text-lg leading-[30px] sm:text-[19px] sm:leading-[31px] lg:text-xl lg:leading-8">
          <span className="sm:hidden">{homeInvitationCopy.mobile}</span>
          <span className="hidden sm:block lg:hidden">
            {homeInvitationCopy.tablet}
          </span>
          <span className="hidden lg:block">{homeInvitationCopy.desktop}</span>
        </p>
        <Button asChild className="min-h-12 w-[232px] max-w-full lg:w-[238px]">
          <a href="/shop">SHOP THE COLLECTION</a>
        </Button>
      </section>
    </TemplateShell>
  );
}
