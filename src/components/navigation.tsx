"use client";

import { ShoppingCart, UserRound, X } from "lucide-react";
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
  cartCount?: number;
  theme?: "ivory" | "midnight";
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
  onClick,
}: {
  destination: { label: string; href: string };
  current: boolean;
  mobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={destination.href}
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "group focus-visible:outline-navigation-focus relative inline-flex min-h-11 w-30 items-center justify-center px-2 text-[13px] leading-[1.45] font-medium focus-visible:outline-[3px] focus-visible:outline-offset-2",
        mobile &&
          "border-navigation-border font-display min-h-16 w-full justify-start border-b px-0 text-[1.75rem] leading-10 font-normal tracking-normal normal-case",
      )}
    >
      <span className="relative">
        {destination.label}
        <span
          aria-hidden="true"
          className={cn(
            "bg-navigation-accent absolute -bottom-2 left-0 h-0.5 transition-[width] duration-150 motion-reduce:transition-none",
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
  className,
}: NavigationProps) {
  const links = validDestinations(destinations ?? []);
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const openerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      );
    focusable()[0]?.focus();
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
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
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
          cartCount
            ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
            : "Cart"
        }
        className="w-[54px] gap-1 text-[13px] font-semibold lg:w-auto lg:justify-start"
      >
        <span className="relative">
          <ShoppingCart
            aria-hidden="true"
            className="size-[1.375rem] stroke-[1.5] lg:hidden"
          />
        </span>
        <span aria-hidden="true" className="text-xs lg:hidden">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
        <span className="hidden lg:inline">Cart ({cartCount})</span>
      </UtilityLink>
    </>
  );

  return (
    <header
      className={cn(
        "border-navigation-divider bg-navigation-surface text-navigation-text sticky top-0 z-40 w-full border-b",
        theme === "midnight" && "dark",
        className,
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid h-[63px] w-full max-w-[1440px] grid-cols-[1fr_auto] items-center pr-3 pl-5 min-[375px]:pl-6 sm:pl-10 lg:h-[85px] lg:grid-cols-[220px_minmax(0,1fr)_127px] lg:px-8 xl:px-[88px]"
      >
        <Link
          href="/"
          aria-label="Infusion Diffusion home"
          className="focus-visible:outline-navigation-focus inline-flex justify-self-start focus-visible:outline-[3px] focus-visible:outline-offset-2"
        >
          <LogoTextLockup className="w-31 lg:w-55" />
        </Link>

        {links.length ? (
          <div
            className="hidden items-center gap-3 justify-self-center lg:flex"
            aria-label="Primary destinations"
          >
            {links.map((destination) => (
              <DestinationLink
                key={`${destination.href}-${destination.label}`}
                destination={destination}
                current={currentHref === destination.href}
              />
            ))}
          </div>
        ) : (
          <span className="hidden lg:block" />
        )}
        <div
          className="hidden items-center justify-self-start lg:flex"
          aria-label="Commerce"
        >
          {utilities}
        </div>

        <div className="flex items-center justify-self-end lg:hidden">
          {links.length ? (
            <button
              ref={openerRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen(true)}
              className="focus-visible:outline-navigation-focus inline-flex h-11 w-[50px] items-center justify-center font-sans text-[11px] font-semibold focus-visible:outline-[3px] focus-visible:outline-offset-2"
            >
              MENU
            </button>
          ) : null}
          {utilities}
        </div>
      </nav>

      {open ? (
        <div
          ref={drawerRef}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="bg-navigation-surface fixed inset-0 z-50 flex min-h-dvh flex-col lg:hidden"
        >
          <div className="border-navigation-border flex h-20 shrink-0 items-center justify-between border-b px-5">
            <Link
              href="/"
              aria-label="Infusion Diffusion home"
              className="focus-visible:outline-navigation-focus focus-visible:outline-[3px] focus-visible:outline-offset-2"
            >
              <LogoTextLockup className="w-31" />
            </Link>
            <div className="flex items-center">
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
          <div className="flex flex-1 flex-col items-start px-6 py-10">
            {links.map((destination) => (
              <DestinationLink
                key={`${destination.href}-${destination.label}`}
                destination={destination}
                current={currentHref === destination.href}
                mobile
                onClick={() => setOpen(false)}
              />
            ))}
            <a
              href={cartHref}
              className="text-navigation-accent focus-visible:outline-navigation-focus mt-8 inline-flex min-h-11 items-center font-sans text-sm font-semibold focus-visible:outline-[3px] focus-visible:outline-offset-2"
            >
              Cart{cartCount ? ` (${cartCount > 99 ? "99+" : cartCount})` : ""}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
