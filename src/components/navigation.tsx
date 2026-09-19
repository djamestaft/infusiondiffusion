"use client";

import { LoaderCircle, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { CustomerProfile } from "@/lib/shopify/customer-account/contract";
import {
  useAccountNavigationHref,
  useCustomerAccount,
} from "@/components/account/account-navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import {
  useAnnouncement,
  type StorefrontAnnouncement,
} from "@/components/announcement-provider";
import { LogoTextLockup } from "@/components/logo-text-lockup";
import { storefrontDestinations } from "@/components/storefront-destinations";
import { cn } from "@/lib/utils";

export type NavigationDestination = {
  label?: string | null;
  href?: string | null;
};

export type NavigationProps = {
  destinations?: NavigationDestination[] | null;
  announcement?: StorefrontAnnouncement | null;
  currentHref?: string;
  accountProfile?: CustomerProfile | null;
  accountLoading?: boolean;
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
  current = false,
  busy = false,
  onClick,
}: {
  href: string;
  label: string;
  current?: boolean;
  busy?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-busy={busy || undefined}
      prefetch={false}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={cn(
        "hover:text-navigation-accent focus-visible:outline-navigation-focus inline-flex size-11 shrink-0 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </Link>
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
    <Link
      href={destination.href}
      prefetch={false}
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "group text-navigation-muted focus-visible:outline-navigation-focus relative inline-flex min-h-11 items-center justify-center px-2 text-[13px] leading-[18px] font-semibold tracking-normal normal-case antialiased focus-visible:outline-[3px] focus-visible:outline-offset-2",
        !mobile && font === "display" && "font-display text-sm font-normal",
        mobile && "min-h-12 w-full justify-start px-0 text-base leading-6",
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
    </Link>
  );
}

export function Navigation({
  destinations = defaultDestinations,
  announcement: suppliedAnnouncement,
  currentHref,
  accountHref,
  accountProfile,
  accountLoading,
  cartHref = "/cart",
  cartCount = 0,
  theme = "ivory",
  floating = false,
  linkFont = "sans",
  className,
}: NavigationProps) {
  const sharedAnnouncement = useAnnouncement();
  const announcement =
    suppliedAnnouncement === undefined
      ? sharedAnnouncement
      : suppliedAnnouncement;
  const showAnnouncement = Boolean(
    announcement?.enabled && announcement.message?.trim(),
  );
  const notice = showAnnouncement ? (
    <AnnouncementBar
      message={announcement?.message}
      link={{ label: announcement?.linkLabel, href: announcement?.linkUrl }}
    />
  ) : null;
  const sharedAccountHref = useAccountNavigationHref();
  const customer = useCustomerAccount();
  const profile =
    accountProfile === undefined
      ? customer.state.status === "signed-in"
        ? customer.state.profile
        : null
      : accountProfile;
  const loading =
    accountLoading ??
    (accountProfile === undefined && customer.state.status === "loading");
  const resolvedAccountHref =
    accountHref === undefined ? sharedAccountHref : accountHref;
  const links = validDestinations(destinations ?? []);
  const [open, setOpen] = useState(false);
  const [pointerFocus, setPointerFocus] = useState(false);
  // Script focus on drawer entry/exit can inherit a stale focus-visible heuristic.
  // Only the logo/menu controls suppress that ring after pointer interaction.
  const controlFocus = pointerFocus
    ? "outline-none"
    : "focus-visible:outline-navigation-focus focus-visible:outline-[3px] focus-visible:outline-offset-2";
  useEffect(() => {
    const onKeyboardInput = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        setPointerFocus(false);
      }
    };
    // Listen outside the header too: Tab can enter from another part of the page.
    document.addEventListener("keydown", onKeyboardInput, true);
    return () => document.removeEventListener("keydown", onKeyboardInput, true);
  }, []);
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
      {resolvedAccountHref ? (
        <UtilityLink
          href={resolvedAccountHref}
          current={currentHref === "/account"}
          busy={loading}
          onClick={() => setOpen(false)}
          className="account-avatar-link transition-none"
          label={
            loading
              ? "Account, checking sign-in status"
              : profile
                ? profile.name
                  ? `Account, signed in as ${profile.name}`
                  : "Account, signed in"
                : "Account"
          }
        >
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full font-sans text-xs leading-none font-semibold",
              !loading && profile && "account-avatar",
            )}
          >
            {loading ? (
              <LoaderCircle className="text-navigation-muted size-5 motion-safe:animate-spin" />
            ) : profile?.initials ? (
              <bdi>{profile.initials}</bdi>
            ) : (
              <UserRound className="size-[1.125rem] stroke-[1.5]" />
            )}
          </span>
        </UtilityLink>
      ) : null}
      <UtilityLink
        href={cartHref}
        onClick={() => setOpen(false)}
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
            className={cn(
              "bg-action-primary text-action-primary-foreground absolute top-0 right-0 inline-flex size-5 items-center justify-center rounded-full text-[10px] leading-none font-semibold tabular-nums",
              cartCount !== null && cartCount > 99 && "size-6",
            )}
          >
            {cartCount === null ? "—" : cartCount > 99 ? "99+" : cartCount}
          </span>
        ) : null}
      </UtilityLink>
    </>
  );

  return (
    <header
      onPointerDownCapture={() => setPointerFocus(true)}
      className={cn(
        "text-navigation-text top-0 z-40 w-full transition-colors duration-[180ms] motion-reduce:transition-none",
        // The notice stays in flow; only the preserved nav row overlaps Home's hero.
        // Natural notice height handles wrapping without measurements or layout shifts.
        floating
          ? showAnnouncement
            ? "sticky -mb-[var(--navigation-height)]"
            : "fixed"
          : "border-navigation-divider sticky border-b",
        floating && !scrolled && !open
          ? "bg-transparent"
          : "bg-navigation-surface",
        floating &&
          scrolled &&
          "after:bg-navigation-divider after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px",
        linkFont === "display" ? "font-display" : "font-sans",
        (theme === "midnight" || floating) && "dark",
        className,
      )}
    >
      <div
        className={cn(
          open && "invisible",
          floating && !scrolled && !open && "[&>aside]:border-transparent",
        )}
        aria-hidden={open || undefined}
      >
        {notice}
      </div>
      <nav
        aria-label="Primary"
        className={cn(
          "relative mx-auto grid h-[var(--navigation-height)] w-full max-w-[1440px] grid-cols-[1fr_auto] items-center px-5 min-[375px]:px-6 sm:px-10 lg:grid-cols-[165px_minmax(0,1fr)_96px] lg:px-16",
          !floating && "h-[calc(var(--navigation-height)-1px)]",
        )}
      >
        <Link
          ref={homeRef}
          href="/"
          aria-label="Infusion Diffusion home"
          className={cn(
            "inline-flex min-h-11 items-center justify-self-start",
            controlFocus,
          )}
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
              className={cn(
                "inline-flex size-11 items-center justify-center font-sans text-[11px] font-semibold",
                controlFocus,
              )}
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
          <div className="shrink-0">{notice}</div>
          <div className="flex h-[var(--navigation-height)] shrink-0 items-center justify-between px-5 min-[375px]:px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Infusion Diffusion home"
              className={cn("inline-flex min-h-11 items-center", controlFocus)}
            >
              <LogoTextLockup className="w-[112px] min-[375px]:w-[132px]" />
            </Link>
            <div className="flex items-center">
              {utilities}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex size-11 items-center justify-center",
                  controlFocus,
                )}
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
