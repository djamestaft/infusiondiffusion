import Link from "next/link";

import { LogoTextLockup } from "@/components/logo-text-lockup";

const explore = [
  ["Shop", "/shop"],
  ["Gallery", "/gallery"],
  ["Fragrance guide", "/fragrance-guide"],
];

const company = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Your bag", "/cart"],
];

export function StorefrontFooter() {
  return (
    <footer className="dark bg-content-surface text-content-primary border-navigation-border border-t">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_0.6fr_0.6fr] lg:gap-20 lg:px-12 lg:py-20 xl:px-0">
        <div>
          <Link
            href="/"
            aria-label="Infusion Diffusion home"
            className="focus-visible:outline-navigation-focus inline-flex focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <LogoTextLockup className="w-55" />
          </Link>
          <p className="text-content-secondary mt-8 max-w-md font-sans text-base leading-7">
            Considered home fragrance for rooms that are lived in. Composed in
            South Africa, chosen with clarity.
          </p>
          <a
            href="mailto:hello@infusiondiffusion.co.za"
            aria-label="Support email address"
            className="text-link-inverse hover:text-link-inverse-hover focus-visible:outline-action-focus mt-7 inline-flex min-h-11 items-center font-sans text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            hello@infusiondiffusion.co.za
          </a>
        </div>
        <FooterLinks title="Explore" links={explore} />
        <FooterLinks title="Infusion Diffusion" links={company} />
      </div>
      <div className="border-navigation-border border-t">
        <div className="text-content-secondary mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 font-sans text-xs sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 xl:px-0">
          <p>© Infusion Diffusion.</p>
          <p>South Africa · Prices shown in ZAR</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return (
    <nav aria-label={`${title} footer links`}>
      <p className="font-display text-xl">{title}</p>
      <ul className="mt-5 space-y-1">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-content-secondary hover:text-content-primary focus-visible:outline-navigation-focus inline-flex min-h-11 items-center font-sans text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
