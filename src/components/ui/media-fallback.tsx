import { cn } from "@/lib/utils";

export type MediaFallbackProps = React.ComponentProps<"div"> & {
  label?: string;
};

export function MediaFallback({
  label = "Image coming soon",
  className,
  ...props
}: MediaFallbackProps) {
  return (
    <div
      data-slot="media-fallback"
      className={cn(
        "bg-product-card-media-fallback text-product-card-meta flex size-full items-center justify-center rounded-sm px-4 text-center font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase",
        className,
      )}
      {...props}
    >
      {label}
    </div>
  );
}
