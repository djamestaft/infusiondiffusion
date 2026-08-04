"use client";

import { Menu, ShoppingCart, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { LogoTextLockup } from "@/components/logo-text-lockup";
import { cn } from "@/lib/utils";

export type NavigationDestination = {
  label?: string | null;
  href?: string | null;
};

export type NavigationProps = {
  destinations?: NavigationDestination[] | null;
  currentHref?: string;
  accountHref?: string;
  cartHref?: string;
  cartCount?: number;
  theme?: "ivory" | "midnight";
  className?: string;
};

const defaultDestinations: NavigationDestination[] = [
  { label: "Shop", href: "/shop" },
  { label: "Fragrance Guide", href: "/fragrance-guide" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="hover:text-navigation-accent focus-visible:outline-navigation-focus inline-flex size-11 shrink-0 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
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
        "group focus-visible:outline-navigation-focus relative inline-flex min-h-11 items-center justify-center px-3 text-xs leading-4 font-semibold tracking-[0.08em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2",
        mobile && "min-h-13 w-full px-5",
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
  accountHref = "/account",
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
      <UtilityLink href={accountHref} label="Account">
        <UserRound
          aria-hidden="true"
          className="size-[1.125rem] stroke-[1.5]"
        />
      </UtilityLink>
      <UtilityLink
        href={cartHref}
        label={
          cartCount
            ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
            : "Cart"
        }
      >
        <span className="relative">
          <ShoppingCart
            aria-hidden="true"
            className="size-[1.375rem] stroke-[1.5]"
          />
          {cartCount ? (
            <span
              aria-hidden="true"
              className="bg-navigation-accent text-navigation-surface absolute -top-2.5 -right-2.5 inline-flex min-w-5 items-center justify-center rounded-full px-1 font-sans text-xs leading-5 font-semibold"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </span>
      </UtilityLink>
    </>
  );

  return (
    <header
      className={cn(
        "border-navigation-border bg-navigation-surface text-navigation-text relative z-40 w-full border-b",
        theme === "midnight" && "dark",
        className,
      )}
    >
      <nav
        aria-label="Primary"
        className="flex h-20 items-center justify-between px-5 lg:h-26 lg:px-8"
      >
        <Link
          href="/"
          aria-label="Infusion Diffusion home"
          className="focus-visible:outline-navigation-focus inline-flex focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <LogoTextLockup className="w-31 lg:w-55" />
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {links.length ? (
            <div
              className="flex items-center"
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
          ) : null}
          <div className="flex items-center gap-1" aria-label="Commerce">
            {utilities}
          </div>
        </div>

        <div className="flex items-center lg:hidden">
          {utilities}
          {links.length ? (
            <button
              ref={openerRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen(true)}
              className="focus-visible:outline-navigation-focus inline-flex size-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Menu aria-hidden="true" className="size-5 stroke-[1.5]" />
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
          className="bg-navigation-surface fixed inset-0 z-50 flex min-h-dvh flex-col lg:hidden"
        >
          <div className="border-navigation-border flex h-20 shrink-0 items-center justify-between border-b px-5">
            <Link
              href="/"
              aria-label="Infusion Diffusion home"
              className="focus-visible:outline-navigation-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <LogoTextLockup className="w-31" />
            </Link>
            <div className="flex items-center">
              {utilities}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="focus-visible:outline-navigation-focus inline-flex size-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X aria-hidden="true" className="size-5 stroke-[1.5]" />
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-5 px-5 py-10">
            {links.map((destination) => (
              <DestinationLink
                key={`${destination.href}-${destination.label}`}
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
