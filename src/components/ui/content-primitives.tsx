import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

const headingVariants = cva(
  "text-balance font-display font-normal text-content-primary",
  {
    variants: {
      treatment: {
        display:
          "text-[clamp(3rem,6vw,4.5rem)] leading-[1.111] tracking-[-0.02em]",
        headline:
          "text-[clamp(2.25rem,4vw,3rem)] leading-[1.167] tracking-[-0.01em]",
        title: "text-[1.75rem] leading-9",
      },
    },
    defaultVariants: { treatment: "headline" },
  },
);

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends
    Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  level: HeadingLevel;
}

export function Heading({
  level,
  treatment,
  className,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as const;

  return (
    <Component
      data-slot="heading"
      data-treatment={treatment ?? "headline"}
      className={cn(headingVariants({ treatment }), className)}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "text-content-accent font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="lead"
      className={cn(
        "text-content-secondary max-w-[70ch] font-sans text-lg leading-[1.667]",
        className,
      )}
      {...props}
    />
  );
}

type ContentHeaderContext =
  | { type: "badge"; label: string; variant?: BadgeProps["variant"] }
  | { type: "eyebrow"; label: string };

type ContentHeaderAction =
  | {
      type: "button";
      label: string;
      href: string;
      variant?: "primary" | "secondary" | "quiet";
    }
  | { type: "link"; label: string; href: string };

export type ContentHeaderProps = Omit<
  React.ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML" | "title"
> & {
  context?: ContentHeaderContext;
  title: string;
  headingLevel: HeadingLevel;
  headingTreatment?: HeadingProps["treatment"];
  lead?: string;
  action?: ContentHeaderAction;
  align?: "start" | "center";
};

export function ContentHeader({
  context,
  title,
  headingLevel,
  headingTreatment = "headline",
  lead,
  action,
  align = "start",
  className,
  ...props
}: ContentHeaderProps) {
  return (
    <div
      data-slot="content-header"
      data-align={align}
      className={cn(
        "flex max-w-5xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
      {...props}
    >
      {context ? (
        <div data-slot="content-header-context">
          {context.type === "badge" ? (
            <Badge variant={context.variant}>{context.label}</Badge>
          ) : (
            <Eyebrow>{context.label}</Eyebrow>
          )}
        </div>
      ) : null}
      <Heading level={headingLevel} treatment={headingTreatment}>
        {title}
      </Heading>
      {lead ? <Lead className="whitespace-pre-line">{lead}</Lead> : null}
      {action ? (
        <div data-slot="content-header-action" className="mt-2 w-fit">
          {action.type === "button" ? (
            <Button asChild variant={action.variant}>
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <TextLink href={action.href} variant="standalone">
              {action.label}
            </TextLink>
          )}
        </div>
      ) : null}
    </div>
  );
}

export { headingVariants };
