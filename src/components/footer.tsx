import Link from "next/link";

import { LogoTextLockup } from "@/components/logo-text-lockup";
import { storefrontDestinations } from "@/components/storefront-destinations";

export function Footer() {
  return (
    <footer className="dark bg-navigation-surface text-navigation-text min-h-[282px] w-full sm:min-h-[210px] lg:min-h-[274px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-16">
        <div className="flex flex-col items-center gap-6 sm:min-h-[104px] sm:flex-row sm:gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
          <Link
            href="/"
            aria-label="Infusion Diffusion home"
            className="focus-visible:outline-navigation-focus inline-flex shrink-0 justify-self-start focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <LogoTextLockup className="w-55 sm:w-39 lg:w-55" />
          </Link>
          <nav
            aria-label="Footer"
            className="grid w-full grid-cols-2 gap-4 font-sans text-[13px] sm:flex sm:flex-1 sm:items-center sm:justify-between sm:gap-0 sm:text-sm lg:w-[min(516px,calc(100vw-632px))] lg:text-[15px]"
          >
            {storefrontDestinations.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-navigation-accent focus-visible:outline-navigation-focus inline-flex min-h-11 items-center justify-start font-medium focus-visible:outline-2 focus-visible:outline-offset-2 sm:justify-center sm:px-2"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-right font-sans text-[13px] leading-[18px]">
          © 2026 Infusion Diffusion
        </p>
      </div>
    </footer>
  );
}
