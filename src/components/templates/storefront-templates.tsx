import Image from "next/image";
import { ChevronDown } from "lucide-react";

import {
  HeroCarousel,
  type HeroCarouselSlide,
} from "@/components/hero-carousel";
import { Navigation, type NavigationProps } from "@/components/navigation";
import { GalleryViewer } from "@/components/gallery-viewer";
import type { GalleryItem } from "@/sanity/lib/editorial-pages";
import { Button } from "@/components/ui/button";
import {
  CommerceStatus,
  type CommerceStatusValue,
} from "@/components/ui/commerce-status";
import {
  ContentHeader,
  Eyebrow,
  Heading,
  Lead,
} from "@/components/ui/content-primitives";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import {
  PriceDisplay,
  type CommerceMoney,
} from "@/components/ui/price-display";
import {
  ProductCard,
  type ProductCardProps,
} from "@/components/ui/product-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ScrollRevealController } from "@/components/ui/scroll-reveal-controller";
import { cn } from "@/lib/utils";

type TemplateNavigationProps = {
  navigationTheme?: NavigationProps["theme"];
  cartCount?: number;
  accountHref?: string | null;
};

const sectionClass =
  "mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24";
const shopSectionClass = "w-full px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16";
const homeHeroSectionClass =
  "dark grid w-full gap-10 bg-content-surface px-5 py-16 text-content-primary sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.093fr)] lg:justify-center lg:gap-14 lg:px-16 lg:py-16";
const homeCollectionInnerClass =
  "mx-auto w-full max-w-7xl px-5 pt-[52px] pb-16 sm:px-8 lg:px-12 lg:pt-[72px] lg:pb-24";

function TemplateShell({
  navigationTheme = "ivory",
  cartCount,
  accountHref,
  currentHref,
  surface = "base",
  children,
}: TemplateNavigationProps & {
  currentHref?: string;
  surface?: "base" | "elevated";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-content-primary min-h-dvh",
        surface === "elevated"
          ? "bg-content-surface-elevated"
          : "bg-content-surface",
      )}
      data-testid={
        surface === "elevated" ? "collection-browsing-surface" : undefined
      }
    >
      <Navigation
        theme={navigationTheme}
        currentHref={currentHref}
        cartCount={cartCount}
        accountHref={accountHref}
      />
      <main>{children}</main>
    </div>
  );
}

function ProductGrid({ products }: { products: ProductCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.href}
          {...product}
          imagePriority={index === 0}
          className={cn("max-w-none", index === 3 && "lg:hidden")}
        />
      ))}
    </div>
  );
}

export interface HomeTemplateProps extends TemplateNavigationProps {
  products: ProductCardProps[];
  heroImage: ProductCardProps["image"];
  heroSlides?: HeroCarouselSlide[];
  founderImage?: ProductCardProps["image"];
  content?: Partial<HomeTemplateContent>;
}

export type HomeTemplateContent = {
  heroTitle: string;
  heroIntroduction: string;
  heroActionLabel: string;
  collectionTitle: string;
  bespokeBlurb: string;
  guidanceEyebrow: string;
  guidanceTitle: string;
  guidanceIntroduction: string;
  guidanceActionLabel: string;
  guidanceSupportingText: string;
  showServiceReassurance: boolean;
  serviceTitle: string;
  serviceIntroduction: string;
  artistryTitle: string;
  artistryIntroduction: string;
  artistryActionLabel: string;
  showFounderStory: boolean;
  founderTitle: string;
  founderStory: string;
  showLongevity: boolean;
  longevityTitle: string;
  longevityIntroduction: string;
  longevityConditions: string;
  showCollectionInvitation: boolean;
  collectionInvitationTitle: string;
  collectionInvitationIntroduction: string;
  collectionInvitationActionLabel: string;
};

export const fallbackHomeTemplateContent: HomeTemplateContent = {
  heroTitle: "Fragrance, composed for the rooms you live in",
  heroIntroduction:
    "Diffusers, room sprays and candles shaped by clear scent notes, considered materials and everyday ritual.",
  heroActionLabel: "Shop the collection",
  collectionTitle: "A cabinet of atmosphere",
  bespokeBlurb:
    "We craft bespoke diffusers that transform living spaces into serene sanctuaries. Our mission is to enhance your environment with elegance and intention.",
  guidanceEyebrow: "Fragrance guidance",
  guidanceTitle: "Choose by the room, then by the feeling",
  guidanceIntroduction:
    "Begin with how the space is used. Bright citrus and herbs lift active rooms; woods, amber and soft florals settle quieter ones.",
  guidanceActionLabel: "Read the fragrance guide",
  guidanceSupportingText:
    "Every fragrance lists its notes plainly, so you can compare character and intensity before choosing a format.",
  showServiceReassurance: true,
  serviceTitle: "Made meaningful by the details",
  serviceIntroduction:
    "Clear care guidance, transparent delivery expectations and dependable stock information accompany every product.",
  artistryTitle: "Artistry in Fragrance",
  artistryIntroduction:
    "Designed for themed elegance, our diffusers blend aesthetics and aroma to enrich your living experience.",
  artistryActionLabel: "Discover our story",
  showFounderStory: true,
  founderTitle: "Born from fragrance",
  founderStory:
    "Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling. More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances.\n\nCreated with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts, each fragrance is composed with passion, elegance and soul.",
  showLongevity: true,
  longevityTitle: "Made to linger",
  longevityIntroduction:
    "Our 200ml reed diffusers are designed to fragrance a room for approximately 8–12 months under normal use.",
  longevityConditions:
    "Room temperature, airflow and how often the reeds are turned will shape the pace of diffusion. A slower ritual lets the fragrance become part of the room rather than simply passing through it.",
  showCollectionInvitation: true,
  collectionInvitationTitle: "Six fragrances. A roomful of possibility.",
  collectionInvitationIntroduction:
    "Each fragrance was chosen for the atmosphere it creates—warmth, brightness, stillness, memory. Find the one that feels at home in yours.",
  collectionInvitationActionLabel: "Shop the collection",
};

export function HomeTemplate({
  products,
  heroImage,
  heroSlides = [],
  navigationTheme,
  cartCount,
  accountHref,
  content: suppliedContent,
}: HomeTemplateProps) {
  const content = { ...fallbackHomeTemplateContent, ...suppliedContent };
  const carouselSlides =
    heroSlides.length >= 2
      ? heroSlides.slice(0, 3)
      : heroImage
        ? [{ id: "catalogue-fallback", ...heroImage }]
        : heroSlides.slice(0, 1);
  return (
    <TemplateShell
      navigationTheme={navigationTheme ?? "midnight"}
      currentHref="/shop"
      cartCount={cartCount}
      accountHref={accountHref}
    >
      <ScrollRevealController />
      <section
        data-testid="home-hero-section"
        className={cn(
          homeHeroSectionClass,
          carouselSlides.length && "lg:items-center",
        )}
      >
        <div className="flex max-w-[600px] flex-col gap-7 lg:py-[34px]">
          <Heading
            level={1}
            treatment="display"
            className="text-[clamp(3.25rem,5vw,4.5rem)] leading-[1.097]"
          >
            {content.heroTitle}
          </Heading>
          <Lead className="max-w-[520px] text-[1.1875rem] leading-[1.632]">
            {content.heroIntroduction}
          </Lead>
          <Button
            asChild
            variant="primary"
            className="min-h-12 w-[236px] rounded-full px-5 text-xs tracking-[0.08em]"
          >
            <a href="/shop">{content.heroActionLabel}</a>
          </Button>
        </div>
        {carouselSlides.length ? (
          <HeroCarousel
            slides={carouselSlides}
            presentation="plain"
            className="w-full lg:h-[692px] lg:max-w-[656px]"
          />
        ) : null}
      </section>

      <ScrollReveal direction="left">
        <section
          className="bg-content-surface-elevated"
          aria-labelledby="home-collection-title"
          data-testid="home-cabinet-band"
        >
          <div
            className={homeCollectionInnerClass}
            data-testid="home-cabinet-inner"
          >
            <Heading
              id="home-collection-title"
              level={2}
              treatment="title"
              className="mb-8"
            >
              {content.collectionTitle}
            </Heading>
            {products.length ? (
              <ProductGrid products={products.slice(0, 4)} />
            ) : (
              <p className="text-content-secondary max-w-prose font-sans">
                The collection is being prepared. Please return soon to explore
                the first fragrances.
              </p>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="right">
        <section className="bg-action-quiet-hover">
          <div
            className={cn(
              sectionClass,
              "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end",
            )}
          >
            <ContentHeader
              context={{ type: "eyebrow", label: content.guidanceEyebrow }}
              title={content.guidanceTitle}
              headingLevel={2}
              lead={content.guidanceIntroduction}
              action={{
                type: "link",
                label: content.guidanceActionLabel,
                href: "/fragrance-guide",
              }}
            />
            <p className="text-content-secondary max-w-xl font-sans text-base leading-7">
              {content.guidanceSupportingText}
            </p>
          </div>
        </section>
      </ScrollReveal>

      <section
        className="bg-content-primary relative isolate min-h-[30rem] overflow-hidden"
        aria-label="Bespoke diffusers"
      >
        <Image
          src="/images/homepage-bespoke-diffuser-blurb.png"
          alt="A reed diffuser arranged in a serene living space"
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="bg-overlay-scrim absolute inset-0 -z-10" />
        <div className="flex min-h-[30rem] items-center justify-center px-5 py-16 sm:px-10">
          <p className="font-display text-bone-50 max-w-4xl text-center text-[1.7rem] leading-[1.45] sm:text-[2rem] lg:text-[2.25rem]">
            {content.bespokeBlurb}
          </p>
        </div>
      </section>

      {content.showLongevity ? (
        <ScrollReveal direction="right">
          <section className="bg-action-quiet-hover">
            <div
              className={cn(
                sectionClass,
                "grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:gap-24",
              )}
            >
              <div>
                <p className="font-display text-5xl leading-none lg:text-7xl">
                  200 ml
                </p>
                <p className="mt-3 font-sans text-sm font-semibold">
                  approximately 8–12 months
                </p>
              </div>
              <div>
                <Heading level={2} treatment="headline">
                  {content.longevityTitle}
                </Heading>
                <p className="text-content-secondary mt-5 font-sans text-base leading-7">
                  {content.longevityConditions}
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      <ScrollReveal variant="unveil">
        <section className="dark bg-content-surface text-content-primary grid md:grid-cols-2">
          <div className="flex flex-col items-start justify-center px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
            <Heading level={2} treatment="headline">
              {content.artistryTitle}
            </Heading>
            <p className="text-content-secondary mt-6 max-w-xl font-sans text-base leading-7 lg:text-lg">
              {content.artistryIntroduction}
            </p>
            <Button asChild variant="primary" className="mx-auto mt-8 md:mx-0">
              <a href="/about">{content.artistryActionLabel}</a>
            </Button>
          </div>
          <div className="relative min-h-[23rem] md:min-h-[34rem]">
            <Image
              src="/images/homepage-artistry-in-fragrance.png"
              alt="A dark glass reed diffuser styled on stone and linen"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>
      </ScrollReveal>

      {content.showServiceReassurance ? (
        <ScrollReveal variant="unveil">
          <section
            className={sectionClass}
            aria-labelledby="home-service-title"
          >
            <Heading
              id="home-service-title"
              level={2}
              treatment="title"
              className="text-center"
            >
              {content.serviceTitle}
            </Heading>
            <div className="mt-10 grid gap-8 text-center sm:grid-cols-3">
              {[
                ["Care guidance", "Clear use and placement advice"],
                ["Delivery", "Transparent delivery expectations"],
                ["Stock", "Dependable availability information"],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 className="font-sans text-sm font-semibold tracking-[0.08em] uppercase">
                    {title}
                  </h3>
                  <p className="text-content-secondary mt-2 font-sans text-base leading-7">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {content.showCollectionInvitation ? (
        <ScrollReveal direction="left">
          <section
            className={sectionClass}
            aria-labelledby="home-collection-invitation-title"
          >
            <Heading
              id="home-collection-invitation-title"
              level={2}
              treatment="headline"
            >
              {content.collectionInvitationTitle}
            </Heading>
            <p className="text-content-secondary mt-6 max-w-2xl font-sans text-base leading-7 lg:text-lg">
              {content.collectionInvitationIntroduction}
            </p>
            <Button asChild variant="primary" className="mt-8">
              <a href="/shop">{content.collectionInvitationActionLabel}</a>
            </Button>
          </section>
        </ScrollReveal>
      ) : null}
    </TemplateShell>
  );
}

export type ContactTemplateProps = TemplateNavigationProps & {
  eyebrow?: string;
  title: string;
  introduction: string;
  sections: Array<{ heading: string; body: string }>;
  email: string;
};

export function ContactTemplate({
  eyebrow,
  title,
  introduction,
  sections,
  email,
  cartCount,
}: ContactTemplateProps) {
  const mailto = `mailto:${email}`;
  return (
    <TemplateShell currentHref="/contact" cartCount={cartCount}>
      <article data-testid="contact-page">
        <header className="bg-content-surface">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-0">
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            <h1 className="font-display text-content-primary max-w-[760px] text-[40px] leading-[1.15] [overflow-wrap:anywhere] lg:text-[56px]">
              {title}
            </h1>
            <p className="text-content-secondary mt-8 max-w-[70ch] font-sans text-[17px] leading-[1.5] [overflow-wrap:anywhere] lg:text-xl">
              {introduction}
            </p>
          </div>
        </header>
        <section className="bg-bone-50" aria-labelledby="contact-email-heading">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-y-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:py-24 xl:px-0">
            <h2
              id="contact-email-heading"
              className="font-display text-content-primary text-[26px] leading-[1.2] lg:col-span-12 lg:text-[34px]"
            >
              Email us
            </h2>
            <address className="text-content-secondary max-w-prose font-sans text-base leading-7 [overflow-wrap:anywhere] not-italic lg:col-span-6">
              <a
                className="focus-visible:outline-action-focus inline-flex min-h-11 items-center [overflow-wrap:anywhere] underline decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                href={mailto}
              >
                {email}
              </a>
            </address>
            <Button
              asChild
              variant="primary"
              className="max-w-full whitespace-normal lg:col-span-4 lg:col-start-7 lg:ml-16 lg:justify-self-start"
            >
              <a href={mailto}>Email Infusion Diffusion</a>
            </Button>
            <FeedbackAlert
              title="Contact us by email"
              tone="info"
              announcement="none"
              className="self-start lg:col-span-6"
            >
              Email is the intended contact route. The link opens your own mail
              application; this website does not collect or store your message.
            </FeedbackAlert>
          </div>
        </section>
        {sections.length ? (
          <div className="bg-content-surface">
            <div className="mx-auto w-full max-w-[840px] space-y-16 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-0">
              {sections.map((section) => (
                <section
                  key={`${section.heading}-${section.body}`}
                  className="max-w-[70ch]"
                >
                  <h2 className="font-display text-content-primary text-[26px] leading-[1.2] [overflow-wrap:anywhere] lg:text-[34px]">
                    {section.heading}
                  </h2>
                  <p className="text-content-secondary mt-6 font-sans text-base leading-[1.625] [overflow-wrap:anywhere] whitespace-pre-line">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </TemplateShell>
  );
}

export function ContactLoadingTemplate() {
  return (
    <TemplateShell currentHref="/contact">
      <section aria-busy="true" aria-label="Loading contact page">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="bg-content-surface-elevated h-16 w-full max-w-[760px] animate-pulse motion-reduce:animate-none" />
          <div className="bg-content-surface-elevated mt-8 h-24 max-w-[70ch] animate-pulse motion-reduce:animate-none" />
        </div>
        <div className="bg-bone-50 h-80 sm:h-96" />
      </section>
    </TemplateShell>
  );
}

export function ContactErrorTemplate({ reset }: { reset: () => void }) {
  const email = "hello@infusiondiffusion.co.za";
  return (
    <TemplateShell currentHref="/contact">
      <section className="min-h-dvh px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-content-primary text-[40px] leading-[1.15] [overflow-wrap:anywhere] lg:text-[56px]">
            We couldn’t load this page.
          </h1>
          <p className="text-content-secondary mt-8 max-w-[70ch] font-sans text-[17px] leading-[1.5] lg:text-xl">
            Nothing was submitted. Try again, or email us directly.
          </p>
          <FeedbackAlert
            title="Unexpected error"
            tone="error"
            announcement="alert"
            className="mt-8"
          >
            Please retry. If the problem continues, use the direct email option
            below.
          </FeedbackAlert>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button onClick={reset}>Try again</Button>
            <a
              className="focus-visible:outline-action-focus inline-flex min-h-11 items-center [overflow-wrap:anywhere] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </div>
        </div>
      </section>
    </TemplateShell>
  );
}

export interface CollectionTemplateProps extends TemplateNavigationProps {
  products: ProductCardProps[];
  title?: string;
  description?: string;
}

export function CollectionTemplate({
  products,
  title = "The collection",
  description = "Layered home fragrance, described through the notes you will actually live with.",
  navigationTheme,
  cartCount,
}: CollectionTemplateProps) {
  return (
    <TemplateShell
      navigationTheme={navigationTheme}
      currentHref="/shop"
      cartCount={cartCount}
      surface="elevated"
    >
      <header className="relative flex min-h-[260px] items-center justify-center overflow-hidden px-5 py-12 text-center sm:min-h-[300px] lg:min-h-[330px] lg:px-16">
        <Image
          src="/images/homepage-bespoke-diffuser-blurb.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(25_25_22/54%)]" />
        <div className="relative z-10 max-w-4xl text-[#f8f4e9]">
          <Heading
            level={1}
            treatment="display"
            className="text-[clamp(3rem,6vw,4rem)]"
          >
            {title}
          </Heading>
          <Lead className="mt-4 max-w-none text-inherit">{description}</Lead>
        </div>
      </header>
      <section className={shopSectionClass}>
        <div className="bg-content-surface mb-10 flex min-h-[92px] items-center justify-between gap-6 px-4 font-sans text-xs font-semibold sm:px-8 lg:px-0">
          <p aria-live="polite">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          <p className="text-content-secondary">
            Sort and filter when supported
          </p>
        </div>
        {products.length ? (
          <div>
            <Heading level={2} treatment="title" className="sr-only">
              Products
            </Heading>
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center py-16 text-center">
            <Heading level={2} treatment="title">
              No fragrances found
            </Heading>
            <Lead className="mx-auto mt-4">
              Try another collection or return to the complete range.
            </Lead>
            <Button asChild className="mt-8 min-w-59">
              <a href="/shop">View all products</a>
            </Button>
          </div>
        )}
      </section>
    </TemplateShell>
  );
}

export interface ProductDetailTemplateProps extends TemplateNavigationProps {
  product: ProductCardProps;
  description: string;
  details: Array<{ label: string; value: string }>;
  variants?: Array<{ id: string; label: string; available: boolean }>;
  selectedVariantId?: string;
  onVariantChange?: (id: string) => void;
  onAddToCart?: () => void;
  showPurchaseAction?: boolean;
  purchaseAction?: React.ReactNode;
}

export function ProductDetailTemplate({
  product,
  description,
  details,
  variants = [],
  selectedVariantId,
  onVariantChange,
  onAddToCart,
  showPurchaseAction = true,
  purchaseAction,
  cartCount,
  navigationTheme,
}: ProductDetailTemplateProps) {
  const soldOut = product.availability === "sold-out";
  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  );
  const selectionUnavailable = Boolean(
    variants.length && (!selectedVariant || !selectedVariant.available),
  );
  const purchaseDisabled = soldOut || selectionUnavailable;
  return (
    <TemplateShell navigationTheme={navigationTheme} cartCount={cartCount}>
      <article className="grid gap-0 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-16">
        <div className="bg-product-card-media-fallback relative aspect-[31/36] w-full overflow-hidden">
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1023px) calc(100vw - 40px), 45vw"
              className="object-cover"
            />
          ) : (
            <span className="text-content-secondary flex size-full items-center justify-center font-sans text-sm">
              Image coming soon
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-[18px] pt-8 lg:min-h-full lg:justify-start lg:pt-0">
          <Eyebrow>{product.format}</Eyebrow>
          <Heading
            level={1}
            treatment="display"
            className="text-[2.5rem] leading-[1.25] sm:text-[2.75rem] lg:text-5xl"
          >
            {product.name}
          </Heading>
          <p className="text-content-secondary font-sans text-base leading-7">
            {product.notes}
          </p>
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            type={product.priceType}
            size="standard"
          />
          <CommerceStatus
            status={product.availability ?? "in-stock"}
            lowStockCount={product.lowStockCount}
          />
          <p className="text-content-secondary w-full font-sans text-base leading-7">
            {description}
          </p>
          {variants.length ? (
            <fieldset className="flex w-full max-w-[520px] flex-col items-center gap-2.5 pt-2 sm:items-start">
              <legend className="mb-1 w-full text-center font-sans text-sm font-semibold sm:text-left">
                Choose an available Shopify variant
              </legend>
              {variants.map((variant) => (
                <Button
                  key={variant.id}
                  type="button"
                  variant="quiet"
                  aria-pressed={selectedVariantId === variant.id}
                  disabled={!variant.available}
                  onClick={() => onVariantChange?.(variant.id)}
                  className="bg-content-surface-elevated w-full justify-between rounded-none px-3.5 text-left normal-case sm:w-[236px] [&>span:nth-last-child(2)]:hidden"
                >
                  <span>
                    {variant.label}
                    {!variant.available ? " — unavailable" : ""}
                  </span>
                  <span aria-hidden="true">⌄</span>
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
                </Button>
              ))}
            </fieldset>
          ) : null}
          {selectionUnavailable && !soldOut ? (
            <p className="text-commerce-status-sold-out font-sans text-sm font-semibold">
              Select an available format to continue.
            </p>
          ) : null}
          {purchaseAction ??
            (showPurchaseAction ? (
              <Button
                type="button"
                size="large"
                disabled={purchaseDisabled}
                onClick={onAddToCart}
                className="w-full sm:w-[236px]"
              >
                {soldOut
                  ? "Sold out"
                  : selectionUnavailable
                    ? "Choose a format"
                    : "Add to bag"}
              </Button>
            ) : null)}
          <dl className="border-navigation-border mt-4 w-full divide-y border-y font-sans">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="grid gap-1 py-4 text-sm leading-5 sm:grid-cols-[8rem_1fr] sm:gap-4"
              >
                <dt className="font-semibold">{detail.label}</dt>
                <dd className="text-content-secondary">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </TemplateShell>
  );
}

export interface EditorialTemplateProps extends TemplateNavigationProps {
  eyebrow?: string;
  title: string;
  introduction: string;
  image: ProductCardProps["image"];
  sections: Array<{ heading: string; body: string }>;
  currentHref?: string;
}

export function EditorialTemplate({
  eyebrow = "Fragrance journal",
  title,
  introduction,
  image,
  sections,
  currentHref,
  navigationTheme,
  cartCount,
}: EditorialTemplateProps) {
  return (
    <TemplateShell
      navigationTheme={navigationTheme}
      currentHref={currentHref}
      cartCount={cartCount}
    >
      <article>
        <header className={sectionClass}>
          <ContentHeader
            context={{ type: "eyebrow", label: eyebrow }}
            title={title}
            headingLevel={1}
            headingTreatment="display"
            lead={introduction}
          />
        </header>
        {image ? (
          <div className="bg-product-card-media-fallback relative mx-auto aspect-[16/9] w-full max-w-7xl overflow-hidden sm:rounded-lg">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className={cn(sectionClass, "max-w-3xl space-y-14")}>
          {sections.map((section) => (
            <section key={section.heading}>
              <Heading level={2} treatment="title">
                {section.heading}
              </Heading>
              <p className="text-content-secondary mt-5 font-sans text-lg leading-8 whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </TemplateShell>
  );
}

export interface AboutTemplateProps extends TemplateNavigationProps {
  title: string;
  introduction: string;
  chapters: Array<{
    role: "origin" | "development" | "collaborator" | "principles";
    heading: string;
    body: string;
    image?: { src: string; alt: string };
  }>;
}

export function AboutTemplate({
  title,
  introduction,
  chapters,
  cartCount,
}: AboutTemplateProps) {
  return (
    <TemplateShell currentHref="/about" cartCount={cartCount}>
      <article data-testid="about-page">
        <header className="bg-content-surface">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 xl:px-0 xl:py-20">
            <h1 className="font-display text-content-primary max-w-[760px] text-[40px] leading-[1.15] xl:text-[56px]">
              {title}
            </h1>
            <p className="text-content-secondary mt-10 max-w-[720px] font-sans text-[17px] leading-[1.5] xl:text-xl">
              {introduction}
            </p>
          </div>
        </header>
        {chapters.map((chapter, index) => {
          const isBone = index % 2 === 0;
          const imageFirst = index % 2 === 1;
          return (
            <section
              key={chapter.role}
              data-testid={`about-chapter-${chapter.role}`}
              className={cn(
                isBone ? "bg-bone-50" : "bg-content-surface",
                "py-11 xl:py-[110px]",
                chapter.image && "min-h-[740px] xl:min-h-0",
              )}
            >
              <div
                className={cn(
                  "mx-auto w-full max-w-7xl px-5 sm:px-8 xl:px-0",
                  chapter.image
                    ? "grid gap-24 xl:grid-cols-[560px_560px] xl:items-center xl:justify-between xl:gap-10"
                    : "text-center",
                )}
              >
                <div
                  className={cn(
                    !chapter.image && "mx-auto max-w-[760px]",
                    imageFirst && "xl:order-2",
                  )}
                >
                  <h2 className="font-display text-content-primary text-[26px] leading-[1.2] xl:text-[34px]">
                    {chapter.heading}
                  </h2>
                  <div className="text-content-primary mt-8 space-y-6 text-[16px] leading-[1.65] xl:text-[18px]">
                    {chapter.body.split(/\n\s*\n/).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                {chapter.image ? (
                  <div
                    data-testid={`about-media-slot-${chapter.role}`}
                    className={cn(
                      "relative aspect-4/3 w-full",
                      imageFirst && "xl:order-1",
                    )}
                  >
                    <div
                      data-testid={`about-media-artwork-${chapter.role}`}
                      className="relative mx-auto aspect-3/4 h-full"
                    >
                      <Image
                        src={chapter.image.src}
                        alt={chapter.image.alt}
                        fill
                        sizes="(max-width: 1023px) calc(100vw - 40px), 560px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
        <section
          className="bg-bone-50 py-7 xl:py-[91px]"
          aria-labelledby="about-cta-heading"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 xl:flex-row xl:items-center xl:justify-between xl:px-0">
            <div>
              <h2
                id="about-cta-heading"
                className="font-display text-content-primary text-[30px] leading-[1.2] xl:text-[40px]"
              >
                Find the fragrance for your room.
              </h2>
              <p className="text-content-secondary mt-5 max-w-[680px] font-sans text-[17px] leading-[1.5] xl:text-xl">
                Explore the Fragrance Guide for scent notes, room context and a
                clear path through the collection.
              </p>
            </div>
            <Button asChild variant="primary" size="large">
              <a href="/fragrance-guide">Explore the Fragrance Guide</a>
            </Button>
          </div>
        </section>
      </article>
    </TemplateShell>
  );
}

export type GalleryTemplateProps = TemplateNavigationProps & {
  title: string;
  introduction: string;
  closingLine: string;
  campaignItems: GalleryItem[];
  marketItems: GalleryItem[];
  unavailable?: boolean;
};

export function GalleryTemplate({
  title,
  introduction,
  closingLine,
  campaignItems,
  marketItems,
  unavailable = false,
  cartCount,
}: GalleryTemplateProps) {
  const hasGalleryItems = campaignItems.length > 0 || marketItems.length > 0;

  return (
    <TemplateShell currentHref="/gallery" cartCount={cartCount}>
      <article data-testid="gallery-page">
        <header className="mx-auto w-full max-w-7xl px-5 pt-13 sm:px-8 lg:px-12 lg:pt-20 xl:px-0">
          <h1 className="font-display text-content-primary max-w-[900px] text-[40px] leading-[1.15] tracking-[-0.02em] [overflow-wrap:anywhere] lg:text-7xl lg:leading-20">
            {title}
          </h1>
          <p className="text-content-secondary mt-8 max-w-[720px] font-sans text-[17px] leading-[1.5] [overflow-wrap:anywhere] lg:text-xl">
            {introduction}
          </p>
          <div className="border-navigation-divider mt-12 border-t lg:mt-16" />
        </header>
        {hasGalleryItems ? (
          <div>
            {campaignItems.length ? (
              <section
                className="mx-auto w-full max-w-7xl px-5 pt-12 sm:px-8 lg:px-12 lg:pt-16 xl:px-0"
                aria-label="Campaign gallery images"
              >
                <GalleryViewer items={campaignItems} layout="campaign" />
              </section>
            ) : null}
            {marketItems.length ? (
              <section
                data-testid="market-gallery-section"
                className={cn(
                  "mx-auto w-full max-w-[1440px] px-4 min-[390px]:px-6 lg:px-16",
                  campaignItems.length ? "mt-20 lg:mt-28" : "pt-12 lg:pt-16",
                )}
                aria-labelledby="market-gallery-heading"
              >
                <h2
                  id="market-gallery-heading"
                  className="font-display text-content-primary mb-8 text-[28px] leading-9 lg:mb-12"
                >
                  In the Market
                </h2>
                <GalleryViewer
                  items={marketItems}
                  layout="market"
                  headingLevel={3}
                  prioritizeFirst={false}
                />
              </section>
            ) : null}
            <p className="font-display text-content-primary mx-auto mt-16 w-full max-w-7xl px-5 pb-12 text-center text-[30px] leading-[1.2] [overflow-wrap:anywhere] sm:px-8 lg:mt-24 lg:px-12 lg:pb-16 xl:px-0">
              {closingLine}
            </p>
          </div>
        ) : (
          <section
            className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-0"
            aria-labelledby="gallery-empty-title"
          >
            <h2
              id="gallery-empty-title"
              className="font-display text-content-primary text-[40px] leading-[1.15] [overflow-wrap:anywhere] lg:text-[56px]"
            >
              {unavailable
                ? "The gallery is temporarily unavailable"
                : "The gallery is being composed"}
            </h2>
            <p className="text-content-secondary mt-8 max-w-[70ch] font-sans text-[17px] leading-[1.5] [overflow-wrap:anywhere] lg:text-xl">
              {unavailable
                ? "We couldn’t load the gallery just now. Please try again later, or explore the fragrance collection."
                : "Our next collection of rooms and rituals will appear here soon. In the meantime, explore the fragrance collection."}
            </p>
            <Button asChild variant="primary" className="mt-8">
              <a href="/shop">Explore the collection</a>
            </Button>
          </section>
        )}
      </article>
    </TemplateShell>
  );
}

export function GalleryLoadingTemplate() {
  return (
    <TemplateShell currentHref="/gallery">
      <section
        aria-busy="true"
        aria-label="Loading gallery"
        className="mx-auto w-full max-w-7xl px-5 py-13 sm:px-8 lg:px-12 lg:py-20 xl:px-0"
      >
        <h1 className="font-display text-content-primary text-[40px] leading-[1.15] lg:text-[56px]">
          Gathering the gallery
        </h1>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className={cn("space-y-3", index > 2 && "hidden sm:block")}
            >
              <div className="bg-content-surface-elevated aspect-3/4 motion-reduce:animate-none" />
              <div className="bg-content-surface-elevated h-4 w-2/3 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </section>
    </TemplateShell>
  );
}

export type { CommerceStatusValue, CommerceMoney };
