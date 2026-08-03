import { ArrowUpRight } from "lucide-react";

import { AnnouncementBar } from "@/components/announcement-bar";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/sanity/types";

export function HoldingPage({ settings }: { settings: SiteSettings }) {
  const showAnnouncement = Boolean(
    settings.announcement.enabled && settings.announcement.message?.trim(),
  );

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-5 py-6 sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="bg-accent/20 absolute top-20 -right-44 -z-10 size-[34rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute -bottom-56 -left-44 -z-10 size-[38rem] rounded-full blur-3xl"
      />

      {showAnnouncement ? (
        <div className="mx-auto max-w-7xl">
          <AnnouncementBar
            message={settings.announcement.message}
            link={{
              label: settings.announcement.linkLabel,
              href: settings.announcement.linkUrl,
            }}
          />
        </div>
      ) : null}

      <nav
        className={cn(
          "border-foreground/15 mx-auto flex max-w-7xl items-center justify-between border-b pb-5",
          showAnnouncement && "mt-4",
        )}
      >
        <BrandMark />
        <span className="text-muted-foreground hidden text-xs font-semibold tracking-[0.16em] uppercase sm:block">
          Johannesburg · South Africa
        </span>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-14 py-16 lg:grid-cols-[1.35fr_0.65fr] lg:py-24">
        <div>
          <h1 className="font-display max-w-4xl text-[clamp(3.4rem,8vw,6rem)] leading-[0.88] font-medium tracking-[-0.035em] text-balance">
            {settings.headline}
          </h1>
          <p className="text-muted-foreground mt-9 max-w-xl text-lg leading-8 sm:text-xl">
            {settings.introduction}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.callToActionLabel}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </Button>
            <p className="text-muted-foreground text-sm">
              The first collection is taking shape.
            </p>
          </div>
        </div>

        <aside className="border-foreground/20 bg-card/55 relative mx-auto aspect-[4/5] w-full max-w-sm border p-5 backdrop-blur-sm lg:mx-0 lg:justify-self-end">
          <div className="border-foreground/15 flex h-full flex-col justify-between border p-6">
            <span className="font-display text-primary/80 text-7xl leading-none">
              I·D
            </span>
            <div>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.16em] uppercase">
                Room sprays · Diffusers · Candles
              </p>
              <p className="font-display text-3xl leading-tight">
                The finishing layer of a considered interior.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
