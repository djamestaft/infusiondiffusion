"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { guideStages, type GuideAnswers } from "./fragrance-guide-questions";

export function GuideChoice({
  label,
  name,
  multiple = false,
  selected,
  onChange,
}: {
  label: string;
  name: string;
  multiple?: boolean;
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "has-focus-visible:outline-action-focus border-content-primary/30 relative flex min-h-14 cursor-pointer items-center justify-between gap-4 border-b px-4 py-3 transition-colors duration-200 has-focus-visible:z-10 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 motion-reduce:transition-none lg:min-h-[58px]",
        selected
          ? "bg-action-primary text-action-primary-foreground"
          : "text-content-primary hover:bg-action-quiet-hover",
      )}
    >
      <input
        className="sr-only"
        type={multiple ? "checkbox" : "radio"}
        name={name}
        value={label}
        checked={selected}
        onChange={onChange}
      />
      <span
        data-guide-answer-text
        className="font-display text-[22px] leading-[30px] lg:text-2xl lg:leading-8"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border border-current",
          multiple ? "rounded-sm" : "rounded-full",
          selected && "bg-action-primary-foreground text-action-primary",
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
    </label>
  );
}

export function GuideProgress({
  active,
  answers,
  onSelect,
}: {
  active: number;
  answers: GuideAnswers;
  onSelect: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Guide questions"
      className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8"
    >
      <p className="shrink-0 text-xs leading-5">QUESTION {active + 1} OF 5</p>
      <ol className="flex flex-1 gap-2 sm:gap-3">
        {guideStages.map((label, index) => (
          <li key={label} className="min-w-0 flex-1">
            <button
              type="button"
              aria-label={`Question ${index + 1}: ${label}`}
              aria-current={active === index ? "step" : undefined}
              disabled={index !== active && !answers[index].length}
              onClick={() => onSelect(index)}
              className="focus-visible:outline-action-focus group flex min-h-11 w-full items-center focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-default"
            >
              <span className="bg-content-primary/15 relative h-0.5 w-full">
                <span
                  className={cn(
                    "bg-action-primary absolute inset-0 origin-left transition-transform duration-[240ms] motion-reduce:transition-none",
                    active === index || answers[index].length
                      ? "scale-x-100"
                      : "scale-x-0",
                  )}
                />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
