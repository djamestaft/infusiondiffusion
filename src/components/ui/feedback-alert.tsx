import { Check, CircleX, Info, TriangleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const feedbackAlertVariants = cva(
  "border-overlay-border bg-overlay-surface text-overlay-text relative grid grid-cols-[1.5rem_1fr] gap-x-3 rounded-md border p-5 pl-6 before:absolute before:inset-y-0 before:left-0 before:w-px",
  {
    variants: {
      tone: {
        info: "bg-feedback-info-surface before:bg-feedback-info [&_[data-icon]]:text-feedback-info",
        success:
          "bg-feedback-success-surface before:bg-feedback-success [&_[data-icon]]:text-feedback-success",
        warning:
          "bg-feedback-warning-surface before:bg-feedback-warning [&_[data-icon]]:text-feedback-warning",
        error:
          "bg-feedback-error-surface before:bg-feedback-error [&_[data-icon]]:text-feedback-error",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

const icons = {
  info: Info,
  success: Check,
  warning: TriangleAlert,
  error: CircleX,
};

export interface FeedbackAlertProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof feedbackAlertVariants> {
  title?: string;
  announcement?: "none" | "status" | "alert";
}

export function FeedbackAlert({
  className,
  tone = "info",
  title,
  announcement = "none",
  children,
  ...props
}: FeedbackAlertProps) {
  const Icon = icons[tone ?? "info"];
  const role = announcement === "none" ? undefined : announcement;
  return (
    <div
      role={role}
      className={cn(feedbackAlertVariants({ tone }), className)}
      {...props}
    >
      <Icon
        data-icon
        aria-hidden="true"
        className="mt-0.5 size-5 stroke-[1.5]"
      />
      <div className="min-w-0 space-y-1">
        {title ? (
          <p className="text-sm leading-5 font-semibold">{title}</p>
        ) : null}
        <div className="text-overlay-muted text-sm leading-[1.375rem]">
          {children}
        </div>
      </div>
    </div>
  );
}

export { feedbackAlertVariants };
