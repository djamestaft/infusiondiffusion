"use client";

import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { LogoTextLockup } from "@/components/logo-text-lockup";
import { storefrontDestinations } from "@/components/storefront-destinations";
import { cn } from "@/lib/utils";

export type NavigationDestination = {
  label?: string | null;
  href?: string | null;
};

export type NavigationProps = {
  destinations?: NavigationDestination[] | null;
  currentHref?: string;
  accountHref?: string | null;
  cartHref?: string;
  cartCount?: number | null;
  theme?: "ivory" | "midnight";
  floating?: boolean;
  linkFont?: "sans" | "display";
  className?: string;
};

const defaultDestinations: NavigationDestination[] = storefrontDestinations;

function isSafeInternalHref(value: string): boolean {
  return (
    value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
  );
}

function validDestinations(destinations: NavigationDestination[]) {
  return destinations.flatMap((destination) => {
    const label = destination.label?.trim();
    const href = destination.href?.trim();
    return label && href && isSafeInternalHref(href) ? [{ label, href }] : [];
  });
}

function UtilityLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "hover:text-navigation-accent focus-visible:outline-navigation-focus inline-flex size-11 shrink-0 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </a>
  );
}

function DestinationLink({
  destination,
  current,
  mobile,
  font = "sans",
  onClick,
}: {
  destination: { label: string; href: string };
  current: boolean;
  mobile?: boolean;
  font?: "sans" | "display";
  onClick?: () => void;
}) {
  return (
    <a
      href={destination.href}
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "group focus-visible:outline-navigation-focus relative inline-flex min-h-11 items-center justify-center px-2 text-[13px] leading-[18px] font-medium tracking-[0.7px] uppercase focus-visible:outline-[3px] focus-visible:outline-offset-2",
        !mobile && font === "display" && "font-display text-sm font-normal",
        mobile &&
          "min-h-12 w-full justify-start px-0 text-base leading-6 font-medium tracking-[1px]",
      )}
    >
      <span className="relative">
        {destination.label}
        <span
          aria-hidden="true"
          className={cn(
            "bg-navigation-accent absolute -bottom-[5px] left-0 h-0.5 transition-[width] duration-150 motion-reduce:transition-none",
            current ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </span>
    </a>
  );
}

export function Navigation({
  destinations = defaultDestinations,
  currentHref,
  accountHref,
  cartHref = "/cart",
  cartCount = 0,
  theme = "ivory",
  floating = false,
  linkFont = "sans",
  className,
}: NavigationProps) {
  const links = validDestinations(destinations ?? []);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!floating) return;
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [floating]);
  const drawerId = useId();
  const homeRef = useRef<HTMLAnchorElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    const home = homeRef.current;
    let lastFocused = document.activeElement;
    const onFocusIn = () => {
      lastFocused = document.activeElement;
    };
    let desktopClose = false;
    let restoreHome = false;
    const onResize = () => {
      if (window.innerWidth < 1024) return;
      desktopClose = true;
      // Hiding the mobile panel can blur its link before resize is dispatched.
      const focused =
        document.activeElement === document.body
          ? lastFocused
          : document.activeElement;
      restoreHome =
        focused === opener || Boolean(drawerRef.current?.contains(focused));
      setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      );
    focusable()[0]?.focus();
    lastFocused = document.activeElement;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = previousOverflow;
      if (desktopClose) {
        if (restoreHome) home?.focus();
      } else {
        opener?.focus();
      }
    };
  }, [open]);

  const utilities = (
    <>
      {accountHref ? (
        <UtilityLink href={accountHref} label="Account">
          <UserRound
            aria-hidden="true"
            className="size-[1.125rem] stroke-[1.5]"
          />
        </UtilityLink>
      ) : null}
      <UtilityLink
        href={cartHref}
        label={
          cartCount === null
            ? "Cart, item count unavailable"
            : cartCount
              ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
              : "Cart"
        }
        className="relative"
      >
        <ShoppingBag aria-hidden="true" className="size-[22px] stroke-[1.5]" />
        {cartCount !== 0 ? (
          <span
            aria-hidden="true"
            className="bg-navigation-surface absolute top-0 right-0 rounded-full px-1 text-[10px] leading-4"
          >
            {cartCount === null ? "—" : cartCount > 99 ? "99+" : cartCount}
          </span>
        ) : null}
      </UtilityLink>
    </>
  );

  return (
    <header
      className={cn(
        "text-navigation-text top-0 z-40 w-full transition-colors duration-[180ms] motion-reduce:transition-none",
        floating ? "fixed" : "sticky",
        floating && !scrolled && !open
          ? "bg-transparent"
          : "bg-navigation-surface",
        linkFont === "display" ? "font-display" : "font-sans",
        (theme === "midnight" || floating) && "dark",
        className,
      )}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto grid h-16 w-full max-w-[1232px] grid-cols-[1fr_auto] items-center px-5 min-[375px]:px-6 lg:grid-cols-[165px_minmax(0,1fr)_96px]"
      >
        <Link
          ref={homeRef}
          href="/"
          aria-label="Infusion Diffusion home"
          className="focus-visible:outline-navigation-focus inline-flex min-h-11 items-center justify-self-start focus-visible:outline-[3px] focus-visible:outline-offset-2"
        >
          <LogoTextLockup className="w-[112px] min-[375px]:w-[132px] lg:w-[165px]" />
        </Link>

        {links.length ? (
          <div
            className="hidden items-center gap-4 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2"
            aria-label="Primary destinations"
          >
            {links.map((destination) => (
              <DestinationLink
                key={`${destination.href}-${destination.label}`}
                font={linkFont}
                destination={destination}
                current={currentHref === destination.href}
              />
            ))}
          </div>
        ) : (
          <span className="hidden lg:block" />
        )}
        <div
          className="hidden items-center justify-self-end lg:col-start-3 lg:flex"
          aria-label="Commerce"
        >
          {utilities}
        </div>

        <div className="flex items-center justify-self-end lg:hidden">
          {utilities}
          {links.length ? (
            <button
              ref={openerRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen(true)}
              className="focus-visible:outline-navigation-focus inline-flex size-11 items-center justify-center font-sans text-[11px] font-semibold focus-visible:outline-[3px] focus-visible:outline-offset-2"
            >
              <Menu aria-hidden="true" className="size-6 stroke-[1.5]" />
            </button>
          ) : null}
        </div>
      </nav>

      {open ? (
        <div
          ref={drawerRef}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="bg-navigation-surface fixed inset-0 z-50 flex min-h-dvh flex-col overflow-y-auto lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5 min-[375px]:px-6">
            <Link
              href="/"
              aria-label="Infusion Diffusion home"
              className="focus-visible:outline-navigation-focus inline-flex min-h-11 items-center focus-visible:outline-[3px] focus-visible:outline-offset-2"
            >
              <LogoTextLockup className="w-[112px] min-[375px]:w-[132px]" />
            </Link>
            <div className="flex items-center">
              {utilities}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="focus-visible:outline-navigation-focus inline-flex size-11 items-center justify-center focus-visible:outline-[3px] focus-visible:outline-offset-2"
              >
                <X aria-hidden="true" className="size-5 stroke-[1.5]" />
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-start gap-4 px-6 py-10">
            {links.map((destination) => (
              <DestinationLink
                key={`${destination.href}-${destination.label}`}
                font={linkFont}
                destination={destination}
                current={currentHref === destination.href}
                mobile
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
