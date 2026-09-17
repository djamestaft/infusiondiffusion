import Link from "next/link";
import { policyLinks } from "@/lib/policy-links";

import { LogoTextLockup } from "@/components/logo-text-lockup";
import { storefrontDestinations } from "@/components/storefront-destinations";
import { TextLink, textLinkVariants } from "@/components/ui/text-link";
import { defaultContactEmail } from "@/lib/contact-content";
import { cn } from "@/lib/utils";

export function Footer() {
  const [emailName, emailDomain] = defaultContactEmail.split("@");

  return (
    <footer className="dark bg-navigation-surface text-navigation-muted w-full font-sans text-[15px] leading-6 font-normal antialiased">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-12 pb-6 sm:px-8 lg:px-16 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,488fr)_minmax(0,760fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/"
              aria-label="Infusion Diffusion home"
              className="focus-visible:outline-navigation-focus block focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {/* Crop only the logo asset's horizontal whitespace. */}
              <span className="block w-[calc(200px*179/220)] overflow-hidden sm:w-[179px]">
                <LogoTextLockup className="bg-link-inverse relative -left-[calc(200px*20.5/220)] w-50 sm:-left-[20.5px] sm:w-55" />
              </span>
            </Link>
            <p>Artistry in fragrance.</p>
          </div>
          <div className="grid min-w-0 gap-8 sm:grid-cols-[minmax(0,17fr)_minmax(0,25fr)] lg:grid-cols-[minmax(0,35fr)_minmax(0,52fr)] lg:gap-16">
            <nav aria-label="Footer">
              <h2 className="text-navigation-text font-display mb-4 text-lg leading-[26px]">
                Explore
              </h2>
              <div className="grid grid-flow-col grid-cols-2 grid-rows-2 gap-x-4 sm:flex sm:flex-col">
                {storefrontDestinations.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      textLinkVariants({ variant: "standalone" }),
                      "text-navigation-muted hover:text-navigation-accent focus-visible:outline-navigation-focus font-normal no-underline hover:underline",
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="min-w-0">
              <h2 className="text-navigation-text font-display mb-4 text-lg leading-[26px]">
                Contact
              </h2>
              <p>For orders and enquiries</p>
              <TextLink
                href={`mailto:${defaultContactEmail}`}
                aria-label={defaultContactEmail}
                className="text-navigation-text hover:text-navigation-accent focus-visible:outline-navigation-focus flex min-h-11 items-center font-normal underline-offset-2"
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {emailName}@<br className="min-[360px]:hidden" />
                  <wbr />
                  {emailDomain}
                </span>
              </TextLink>
            </div>
          </div>
        </div>
        <div className="border-navigation-border mt-8 border-t pt-6 lg:mt-12">
          <nav aria-label="Policies" className="mb-4 flex flex-wrap gap-x-6">
            {policyLinks.map(({ slug, label }) => (
              <TextLink
                key={slug}
                href={`/policies/${slug}`}
                variant="inverse"
                className="inline-flex min-h-11 items-center font-normal"
              >
                {label}
              </TextLink>
            ))}
          </nav>
          <p className="text-[13px] leading-5">© 2026 Infusion Diffusion</p>
        </div>
      </div>
    </footer>
  );
}
