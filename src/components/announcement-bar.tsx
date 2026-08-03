import { TextLink } from "@/components/ui/text-link";

export type AnnouncementBarProps = {
  message?: string | null;
  link?: {
    label?: string | null;
    href?: string | null;
  } | null;
};

function isSafeHref(href: string): boolean {
  return (
    (href.startsWith("/") && !href.startsWith("//") && !href.includes("\\")) ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function AnnouncementBar({ message, link }: AnnouncementBarProps) {
  const content = message?.trim();
  if (!content) return null;

  const linkLabel = link?.label?.trim();
  const linkHref = link?.href?.trim();
  const safeLink =
    linkLabel && linkHref && isSafeHref(linkHref)
      ? { label: linkLabel, href: linkHref }
      : null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-announcement text-announcement-foreground border-announcement-border flex min-h-11 w-full items-center justify-center border-b px-5 text-center"
    >
      <div className="flex min-w-0 flex-col items-center justify-center gap-1 py-2 sm:flex-row sm:gap-3 sm:py-0">
        <p className="text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
          {content}
        </p>
        {safeLink ? (
          <TextLink
            variant="inverse"
            className="text-announcement-accent focus-visible:outline-announcement-accent inline-flex min-h-11 items-center px-2 text-xs leading-4 font-semibold tracking-[0.08em] uppercase"
            href={safeLink.href}
          >
            {safeLink.label}
          </TextLink>
        ) : null}
      </div>
    </aside>
  );
}
