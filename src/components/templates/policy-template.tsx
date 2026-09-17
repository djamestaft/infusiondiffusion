import { TemplateShell } from "@/components/templates/storefront-templates";
import { Heading } from "@/components/ui/content-primitives";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { defaultContactEmail } from "@/lib/contact-content";

const readerClass =
  "mx-auto w-full max-w-[1440px] px-5 py-10 min-[375px]:px-6 md:px-10 lg:px-16 lg:py-16";

/** html must already be sanitized by the server commerce boundary. */
export function PolicyTemplate({
  title,
  html,
  cartCount,
}: {
  title: string;
  html: string;
  cartCount?: number | null;
}) {
  return (
    <TemplateShell navigationTheme="midnight" cartCount={cartCount}>
      <article className={readerClass}>
        <div className="mx-auto max-w-[70ch]">
          <Heading level={1} treatment="headline" className="mb-8">
            {title}
          </Heading>
          <div
            className="policy-prose font-sans text-base leading-[1.65] [overflow-wrap:anywhere]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </TemplateShell>
  );
}

export function PolicyLoadingTemplate() {
  return (
    <TemplateShell navigationTheme="midnight">
      <div className={readerClass}>
        <p role="status" className="mx-auto max-w-[70ch] font-sans">
          Loading policy…
        </p>
      </div>
    </TemplateShell>
  );
}

export function PolicyErrorTemplate({ reset }: { reset: () => void }) {
  return (
    <TemplateShell navigationTheme="midnight">
      <div className={readerClass}>
        <div className="mx-auto flex max-w-[70ch] flex-col items-start gap-6">
          <Heading level={1} treatment="headline">
            Policy temporarily unavailable
          </Heading>
          <p className="font-sans text-base leading-relaxed">
            Please try again, or contact us for a copy before placing your
            order.
          </p>
          <Button onClick={reset}>Try again</Button>
          <TextLink href={`mailto:${defaultContactEmail}`} variant="standalone">
            Contact Dione Smith
          </TextLink>
        </div>
      </div>
    </TemplateShell>
  );
}
