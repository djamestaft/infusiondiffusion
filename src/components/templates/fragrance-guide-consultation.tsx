"use client";

import { useEffect, useRef, useState } from "react";
import { TemplateShell } from "./storefront-templates";
import { homeInvitationCopy } from "./home-copy";
import { Button } from "@/components/ui/button";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { EditorialImageSource } from "@/lib/editorial-image";
import {
  MotionBoundary,
  MotionControl,
} from "@/components/motion/motion-boundary";
import {
  matchFragrances,
  noteChoices,
  type GuideProduct,
} from "@/lib/fragrance-guide/matching";
import { guideQuestions, type GuideAnswers } from "./fragrance-guide-questions";
import { GuideChoice, GuideProgress } from "./fragrance-guide-controls";
import { GuideResults } from "./fragrance-guide-results";
import {
  GuideAtmosphere,
  GuideTransition,
  defaultGuideImage,
} from "./fragrance-guide-motion";

export type FragranceGuideProps = {
  initialAnswers?: GuideAnswers;
  initialQuestion?: number;
  initialReviewed?: boolean;
  initialStarted?: boolean;
  products?: GuideProduct[] | null;
  onContinue?: (answers: GuideAnswers) => void;
  cartCount?: number | null;
  heroImage?: EditorialImageSource;
};

export function FragranceGuideConsultation({
  initialAnswers,
  initialQuestion = 0,
  initialReviewed = false,
  initialStarted = Boolean(initialAnswers),
  products = null,
  onContinue,
  cartCount,
  heroImage = defaultGuideImage,
}: FragranceGuideProps) {
  const [answers, setAnswers] = useState<GuideAnswers>(() =>
    guideQuestions.map((q, i) =>
      [...new Set(initialAnswers?.[i] ?? [])]
        .filter((value) => (q.choices as readonly string[]).includes(value))
        .slice(0, i === 2 ? 2 : 1),
    ),
  );
  const [active, setActive] = useState(
    Math.min(4, Math.max(0, initialQuestion)),
  );
  const [started, setStarted] = useState(initialStarted || initialReviewed);
  const [reviewed, setReviewed] = useState(initialReviewed);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState("");
  const scope = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const question = guideQuestions[active];
  const selectedNotes = noteChoices
    .filter((note) => answers[2].includes(note.label))
    .map((note) => note.id);
  const matches =
    reviewed && products ? matchFragrances(selectedNotes, products) : [];
  useEffect(() => {
    if (moved.current)
      scope.current?.querySelector<HTMLElement>("[data-guide-focus]")?.focus();
  }, [active, started, reviewed]);

  const go = (index: number) => {
    moved.current = true;
    setDirection(index >= active ? 1 : -1);
    setError("");
    setReviewed(false);
    setStarted(true);
    setActive(index);
  };
  const update = (value: string) => {
    if (
      active === 2 &&
      !answers[active].includes(value) &&
      answers[active].length === 2
    ) {
      setError(
        "Choose up to two note families. Deselect one to choose another.",
      );
      return;
    }
    setError("");
    setAnswers((current) =>
      current.map((selected, index) =>
        index !== active
          ? selected
          : active === 2
            ? selected.includes(value)
              ? selected.filter((v) => v !== value)
              : [...selected, value]
            : [value],
      ),
    );
  };
  const advance = () => {
    if (!answers[active].length) {
      setError("Choose an answer for this question before continuing.");
      scope.current?.querySelector<HTMLInputElement>("fieldset input")?.focus();
      return;
    }
    if (active < 4) {
      go(active + 1);
      return;
    }
    const missing = answers.findIndex((selected) => !selected.length);
    if (missing !== -1) {
      go(missing);
      setError("Choose an answer for each question before continuing.");
      return;
    }
    moved.current = true;
    setError("");
    setReviewed(true);
    onContinue?.(answers.map((selected) => [...selected]));
  };
  const reset = () => {
    moved.current = true;
    setAnswers(guideQuestions.map(() => []));
    setError("");
    setReviewed(false);
    setStarted(false);
    setActive(0);
    setDirection(1);
  };

  return (
    <TemplateShell
      navigationTheme="midnight"
      currentHref="/fragrance-guide"
      cartCount={cartCount}
    >
      <MotionBoundary>
        <div ref={scope} className="guide-consultation overflow-x-clip">
          {!started ? (
            <GuideTransition>
              <section className="dark bg-content-surface text-content-primary">
                <div className="guide-introduction mx-auto grid max-w-[1600px] items-center gap-8 px-5 pt-8 pb-10 min-[375px]:px-6 sm:px-10 lg:min-h-[calc(100svh-var(--navigation-height)-124px)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-16 lg:py-16">
                  <div className="contents lg:block">
                    <h1
                      data-guide-focus
                      data-guide-reveal
                      tabIndex={-1}
                      className="font-display order-1 text-[38px] leading-[46px] outline-none sm:text-[48px] sm:leading-[1.14] lg:text-[56px]"
                    >
                      Find the atmosphere that belongs in your room
                    </h1>
                    <p
                      data-guide-reveal
                      className="order-2 max-w-[520px] text-[15px] leading-6 lg:mt-7 lg:text-[17px] lg:leading-[27px]"
                    >
                      Find suggestions based on your selected notes and
                      fragrance character. Your other answers are kept in your
                      preference summary.
                    </p>
                    <Button
                      className="order-4 min-h-[52px] w-full text-sm tracking-normal sm:w-60 lg:mt-7"
                      onClick={() => go(active)}
                    >
                      Begin the guide
                    </Button>
                    <p className="text-content-secondary order-5 text-[13px] leading-5 lg:mt-6">
                      Five questions. A little space to discover what you love.
                    </p>
                  </div>
                  <div className="relative order-3 aspect-2/1 w-full lg:order-none">
                    <EditorialImage
                      image={heroImage}
                      mobileBreakpoint={1024}
                      priority
                      sizes="(max-width: 1023px) calc(100vw - 48px), 50vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="border-navigation-accent/50 mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 border-t px-5 py-5 min-[375px]:px-6 sm:px-10 lg:px-16">
                  <p className="text-content-secondary hidden text-sm sm:block">
                    Room / Feeling / Notes / Presence / Time
                  </p>
                  <Button variant="quiet" asChild>
                    <a href="/shop">Explore the collection</a>
                  </Button>
                  <MotionControl />
                  {answers.some((selected) => selected.length) ? (
                    <Button variant="quiet" onClick={reset}>
                      Reset guide
                    </Button>
                  ) : null}
                </div>
              </section>
            </GuideTransition>
          ) : reviewed ? (
            <GuideTransition result>
              <GuideResults
                matches={matches}
                answers={answers}
                unavailable={products === null}
                onEdit={go}
                onReset={reset}
              />
            </GuideTransition>
          ) : (
            <div className="guide-stage grid lg:min-h-[calc(100svh-var(--navigation-height)-44px)] lg:grid-cols-[minmax(0,552fr)_minmax(0,888fr)]">
              <GuideAtmosphere
                active={active}
                image={heroImage}
                direction={direction}
                focusScope={scope}
              />
              <div className="guide-question-panel px-5 py-6 min-[375px]:px-6 sm:px-10 sm:py-10 lg:px-16 lg:py-8">
                <GuideProgress
                  active={active}
                  answers={answers}
                  onSelect={go}
                />
                <GuideTransition key={active} direction={direction}>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      advance();
                    }}
                  >
                    <fieldset
                      aria-describedby={`guide-hint-${active}${error ? " guide-error" : ""}`}
                      className="min-w-0"
                    >
                      <legend className="mb-5 w-full">
                        <h1
                          data-guide-focus
                          data-guide-reveal
                          tabIndex={-1}
                          className="guide-question-title font-display scroll-mt-40 text-[32px] leading-10 outline-none lg:text-[44px] lg:leading-[52px]"
                        >
                          {question.title}
                        </h1>
                      </legend>
                      <p
                        id={`guide-hint-${active}`}
                        className="mb-5 text-[15px] leading-[22px]"
                      >
                        {question.hint}
                      </p>
                      <div className="guide-choices">
                        {question.choices.map((choice) => (
                          <GuideChoice
                            key={choice}
                            label={choice}
                            name={`question-${active}`}
                            multiple={active === 2}
                            selected={answers[active].includes(choice)}
                            onChange={() => update(choice)}
                          />
                        ))}
                      </div>
                    </fieldset>
                    {error ? (
                      <p
                        id="guide-error"
                        role="alert"
                        className="text-feedback-error-foreground mt-4 text-sm leading-6"
                      >
                        {error}
                      </p>
                    ) : null}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <Button
                        variant="quiet"
                        className="px-0 text-sm tracking-normal"
                        onClick={() => {
                          if (active) go(active - 1);
                          else {
                            moved.current = true;
                            setStarted(false);
                            setError("");
                          }
                        }}
                      >
                        {active ? "Back" : "Back to introduction"}
                      </Button>
                      <Button
                        type="submit"
                        className="min-h-[52px] min-w-28 text-sm tracking-normal sm:min-w-44"
                      >
                        {active === 4 ? "See my suggestions" : "Continue"}
                      </Button>
                    </div>
                  </form>
                </GuideTransition>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                  <MotionControl />
                  <Button
                    variant="quiet"
                    onClick={reset}
                    className="text-sm tracking-normal"
                  >
                    Reset guide
                  </Button>
                </div>
              </div>
            </div>
          )}
          <p role="status" className="sr-only">
            {reviewed
              ? matches.length
                ? "Your fragrance suggestions are ready to review."
                : "Your preferences are ready to review."
              : ""}
          </p>
        </div>
      </MotionBoundary>
      <section className="bg-collection-invitation-surface flex flex-col items-center gap-7 px-5 py-16 text-center min-[375px]:px-6 sm:px-10 lg:gap-8 lg:px-16 lg:py-[92px]">
        <h2 className="font-display text-4xl leading-[44px] font-normal lg:text-[52px] lg:leading-[62px]">
          Six fragrances. A roomful of possibility.
        </h2>
        <p className="max-w-[1000px] text-lg leading-[30px] lg:text-xl lg:leading-8">
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
