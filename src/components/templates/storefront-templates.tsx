import Image from "next/image";

import {
  HeroCarousel,
  type HeroCarouselSlide,
} from "@/components/hero-carousel";
import { Navigation, type NavigationProps } from "@/components/navigation";
import { StorefrontFooter } from "@/components/storefront-footer";
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
};

const sectionClass =
  "mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24";
const homeHeroSectionClass =
  "mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:min-h-[calc(100dvh-104px)] lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-0 lg:px-0 lg:py-0";
const homeCollectionInnerClass =
  "mx-auto w-full max-w-7xl px-5 pt-[52px] pb-16 sm:px-8 lg:px-12 lg:pt-[72px] lg:pb-24";

function TemplateShell({
  navigationTheme = "ivory",
  cartCount,
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
      />
      <ScrollRevealController />
      <main className="storefront-page">{children}</main>
      <StorefrontFooter />
    </div>
  );
}

function ProductGrid({ products }: { products: ProductCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
      {products.map((product, index) => (
        <ProductCard
          key={product.href}
          {...product}
          imagePriority={index === 0}
          className="max-w-none"
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
  guidanceEyebrow: string;
  guidanceTitle: string;
  guidanceIntroduction: string;
  guidanceActionLabel: string;
  guidanceSupportingText: string;
  showServiceReassurance: boolean;
  serviceTitle: string;
  serviceIntroduction: string;
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
  founderImage,
  navigationTheme,
  cartCount,
  content: suppliedContent,
}: HomeTemplateProps) {
  const content = { ...fallbackHomeTemplateContent, ...suppliedContent };
  const storyImage = founderImage ?? heroImage;
  const carouselSlides =
    heroSlides.length >= 2
      ? heroSlides.slice(0, 3)
      : heroImage
        ? [{ id: "catalogue-fallback", ...heroImage }]
        : heroSlides.slice(0, 1);
  return (
    <TemplateShell navigationTheme={navigationTheme} cartCount={cartCount}>
      <section
        data-testid="home-hero-section"
        className={cn(
          homeHeroSectionClass,
          carouselSlides.length && "lg:grid-cols-2 lg:items-center",
        )}
      >
        <div className="relative z-10 flex min-h-[500px] items-center lg:min-h-full lg:px-16 xl:px-24">
          <ContentHeader
            title={content.heroTitle}
            headingLevel={1}
            headingTreatment="display"
            lead={content.heroIntroduction}
            action={{
              type: "button",
              label: content.heroActionLabel,
              href: "/shop",
            }}
            className="max-w-xl [&_[data-slot=heading]]:text-[clamp(3.25rem,6vw,5.75rem)] [&_[data-slot=heading]]:leading-[0.98]"
          />
        </div>
        {carouselSlides.length ? (
          <HeroCarousel
            slides={carouselSlides}
            className="lg:w-full [&_[data-testid=hero-carousel-media]]:lg:aspect-[1/1.08]"
          />
        ) : (
          <div
            className="dark bg-content-surface text-content-primary relative min-h-[360px] overflow-hidden lg:min-h-full"
            aria-hidden="true"
          >
            <div className="border-navigation-border absolute inset-8 border lg:inset-12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-content-accent text-[clamp(7rem,18vw,15rem)] leading-none tracking-[-0.08em] opacity-30">
                I·D
              </span>
            </div>
            <div className="border-navigation-border absolute right-10 bottom-10 left-10 flex items-end justify-between border-t pt-5 font-sans text-xs tracking-[0.18em] uppercase lg:right-16 lg:bottom-16 lg:left-16">
              <span>Room · Ritual · Atmosphere</span>
              <span>South Africa</span>
            </div>
          </div>
        )}
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
              className="mb-10 max-w-2xl lg:mb-14 lg:text-5xl"
            >
              {content.collectionTitle}
            </Heading>
            {products.length ? (
              <ProductGrid products={products.slice(0, 3)} />
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

      {content.showServiceReassurance ? (
        <ScrollReveal direction="left">
          <section
            className={sectionClass}
            aria-labelledby="home-service-title"
          >
            <Heading id="home-service-title" level={2} treatment="title">
              {content.serviceTitle}
            </Heading>
            <p className="text-content-secondary mt-4 max-w-2xl font-sans text-base leading-7">
              {content.serviceIntroduction}
            </p>
          </section>
        </ScrollReveal>
      ) : null}

      {content.showFounderStory ? (
        <ScrollReveal variant="unveil">
          <section className="dark bg-content-surface text-content-primary">
            <div
              className={cn(
                sectionClass,
                "grid gap-12",
                storyImage && "lg:grid-cols-2 lg:items-center",
              )}
            >
              <div>
                <Heading level={2} treatment="headline">
                  {content.founderTitle}
                </Heading>
                <div className="text-content-secondary mt-8 max-w-xl space-y-6 font-sans text-base leading-7 lg:text-lg">
                  {content.founderStory.split(/\n\s*\n/).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              {storyImage ? (
                <div className="bg-product-card-media-fallback relative aspect-7/6 overflow-hidden rounded-lg">
                  <Image
                    src={storyImage.src}
                    alt={storyImage.alt}
                    fill
                    sizes="(max-width: 1023px) calc(100vw - 40px), 40vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {content.showLongevity ? (
        <ScrollReveal direction="right">
          <section className="bg-action-quiet-hover">
            <div
              className={cn(
                sectionClass,
                "grid gap-8 lg:grid-cols-2 lg:gap-24",
              )}
            >
              <div>
                <Heading level={2} treatment="headline">
                  {content.longevityTitle}
                </Heading>
                <Lead className="mt-6">{content.longevityIntroduction}</Lead>
              </div>
              <p className="text-content-secondary max-w-xl font-sans text-base leading-7 lg:pt-4 lg:text-lg">
                {content.longevityConditions}
              </p>
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
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24 lg:px-12 lg:py-28 xl:px-0">
            <div>
              {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
              <h1 className="font-display text-content-primary max-w-[820px] text-[clamp(3.5rem,8vw,6rem)] leading-[0.98] tracking-[-0.02em] [overflow-wrap:anywhere]">
                {title}
              </h1>
            </div>
            <p className="text-content-secondary max-w-[60ch] font-sans text-[17px] leading-[1.6] [overflow-wrap:anywhere] lg:pb-2 lg:text-xl">
              {introduction}
            </p>
          </div>
        </header>
        <section className="bg-bone-50" aria-labelledby="contact-email-heading">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-y-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-x-8 lg:px-12 lg:py-28 xl:px-0">
            <h2
              id="contact-email-heading"
              className="font-display text-content-primary text-[32px] leading-[1.1] lg:col-span-5 lg:text-[48px]"
            >
              Email us
            </h2>
            <address className="text-content-secondary max-w-prose font-sans text-base leading-7 [overflow-wrap:anywhere] not-italic lg:col-span-7 lg:col-start-6">
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
              className="max-w-full whitespace-normal lg:col-span-4 lg:col-start-6 lg:justify-self-start"
            >
              <a href={mailto}>Email Infusion Diffusion</a>
            </Button>
            <FeedbackAlert
              title="Online form unavailable"
              tone="info"
              announcement="none"
              className="self-start lg:col-span-7 lg:col-start-6"
            >
              Online submission is not available at launch. Your email opens in
              your own mail application; this website does not collect or store
              your message.
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
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-24 xl:px-0">
        <header className="border-navigation-divider grid gap-8 border-b pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-24 lg:pb-16">
          <Heading
            level={1}
            treatment="display"
            className="max-w-3xl text-[clamp(3.5rem,8vw,6rem)] leading-[0.96]"
          >
            {title}
          </Heading>
          <Lead className="max-w-xl lg:pb-2">{description}</Lead>
        </header>
        <div className="mt-8 flex items-center justify-between font-sans text-sm lg:mt-10">
          <p aria-live="polite">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          <p className="text-content-secondary">Composed for lived-in rooms</p>
        </div>
        {products.length ? (
          <div className="mt-8 lg:mt-12">
            <Heading level={2} treatment="title" className="sr-only">
              Products
            </Heading>
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="py-20 text-center">
            <Heading level={2} treatment="title">
              No fragrances found
            </Heading>
            <Lead className="mx-auto mt-4">
              Try another collection or return to the complete range.
            </Lead>
            <Button asChild variant="secondary" className="mt-8">
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
      <article className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="aspect-3/4 lg:sticky lg:top-26 lg:aspect-auto lg:h-[calc(100dvh-104px)]">
          <div className="bg-product-card-media-fallback relative size-full overflow-hidden">
            {product.image ? (
              <Image
                src={product.image.src}
                alt={product.image.alt}
                fill
                priority
                loading="eager"
                sizes="(max-width: 1023px) 100vw, 54vw"
                className="object-cover"
              />
            ) : (
              <span className="text-content-secondary flex size-full items-center justify-center font-sans text-sm">
                Image coming soon
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 px-5 py-14 sm:px-8 lg:min-h-[calc(100dvh-104px)] lg:px-16 lg:py-20 xl:px-20">
          <Eyebrow>{product.format}</Eyebrow>
          <Heading
            level={1}
            treatment="display"
            className="text-[clamp(3rem,5vw,5rem)] leading-[1]"
          >
            {product.name}
          </Heading>
          <p className="text-content-secondary font-sans text-lg leading-8">
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
          <p className="text-content-secondary max-w-xl font-sans text-base leading-7">
            {description}
          </p>
          {variants.length ? (
            <fieldset className="flex flex-wrap gap-3">
              <legend className="mb-3 w-full font-sans text-sm font-semibold">
                Choose a format
              </legend>
              {variants.map((variant) => (
                <Button
                  key={variant.id}
                  type="button"
                  variant={
                    selectedVariantId === variant.id ? "primary" : "secondary"
                  }
                  aria-pressed={selectedVariantId === variant.id}
                  disabled={!variant.available}
                  onClick={() => onVariantChange?.(variant.id)}
                >
                  {variant.label}
                  {!variant.available ? " — unavailable" : ""}
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
                className="w-full sm:w-fit"
              >
                {soldOut
                  ? "Sold out"
                  : selectionUnavailable
                    ? "Choose a format"
                    : "Add to bag"}
              </Button>
            ) : null)}
          <dl className="border-navigation-border mt-6 divide-y border-y font-sans">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="grid gap-1 py-5 text-sm leading-6 sm:grid-cols-[8rem_1fr] sm:gap-6"
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
        <header className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:px-12 lg:py-24 xl:px-0">
          <div>
            <p className="text-content-accent mb-6 font-sans text-xs font-semibold tracking-[0.08em] uppercase">
              {eyebrow}
            </p>
            <Heading
              level={1}
              treatment="display"
              className="text-[clamp(3.5rem,7vw,6rem)] leading-[0.98]"
            >
              {title}
            </Heading>
          </div>
          <Lead className="max-w-xl lg:justify-self-end lg:pb-2">
            {introduction}
          </Lead>
        </header>
        {image ? (
          <div className="bg-product-card-media-fallback relative mx-auto aspect-[16/9] w-full max-w-[1440px] overflow-hidden">
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
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-28 xl:px-0">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className={cn(
                "border-navigation-divider grid gap-6 border-t py-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:py-16",
                index === 0 && "border-t-0 pt-0",
              )}
            >
              <Heading level={2} treatment="title" className="lg:text-4xl">
                {section.heading}
              </Heading>
              <p className="text-content-secondary max-w-[70ch] font-sans text-lg leading-8 whitespace-pre-line">
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
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end xl:gap-24 xl:px-0 xl:py-28">
            <h1 className="font-display text-content-primary max-w-[820px] text-[clamp(3.5rem,8vw,6rem)] leading-[0.98] tracking-[-0.02em]">
              {title}
            </h1>
            <p className="text-content-secondary max-w-[640px] font-sans text-[17px] leading-[1.6] xl:pb-2 xl:text-xl">
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
                "py-16 xl:py-[120px]",
                chapter.image && "min-h-[740px] xl:min-h-0",
              )}
            >
              <div
                className={cn(
                  "mx-auto w-full max-w-7xl px-5 sm:px-8 xl:px-0",
                  chapter.image
                    ? "grid gap-12 xl:grid-cols-[560px_560px] xl:items-center xl:justify-between xl:gap-20"
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
    <StorefrontLoadingTemplate
      kind="gallery"
      currentHref="/gallery"
      accessibleLabel="Loading gallery"
    />
  );
}

export function StorefrontLoadingTemplate({
  kind = "editorial",
  currentHref,
  accessibleLabel,
}: {
  kind?: "home" | "collection" | "product" | "gallery" | "editorial" | "cart";
  currentHref?: string;
  accessibleLabel?: string;
}) {
  const product = kind === "product";
  const cards = kind === "collection" || kind === "gallery" || kind === "home";
  return (
    <TemplateShell
      currentHref={currentHref}
      surface={kind === "collection" ? "elevated" : "base"}
    >
      <section
        aria-busy="true"
        aria-label={accessibleLabel ?? `Loading ${kind} page`}
        className="mx-auto w-full max-w-7xl px-5 py-13 sm:px-8 lg:px-12 lg:py-20 xl:px-0"
      >
        <span className="sr-only">Loading</span>
        <div
          className={cn("grid gap-10", product && "lg:grid-cols-2 lg:gap-20")}
        >
          {product ? <SkeletonBlock className="aspect-3/4 w-full" /> : null}
          <div className={cn("space-y-5", !product && "max-w-3xl")}>
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="h-14 w-full sm:h-20" />
            <SkeletonBlock className="h-6 w-5/6" />
            <SkeletonBlock className="h-6 w-2/3" />
            {product ? <SkeletonBlock className="mt-8 h-12 w-44" /> : null}
          </div>
        </div>
        {cards ? (
          <div className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className={cn("space-y-4", index > 3 && "hidden lg:block")}
              >
                <SkeletonBlock className="aspect-3/4 w-full" />
                <SkeletonBlock className="h-4 w-1/3" />
                <SkeletonBlock className="h-7 w-4/5" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : !product ? (
          <div className="mt-16 max-w-3xl space-y-12">
            <div className="space-y-4">
              <SkeletonBlock className="h-9 w-1/2" />
              <SkeletonBlock className="h-28 w-full" />
            </div>
            <div className="space-y-4">
              <SkeletonBlock className="h-9 w-2/5" />
              <SkeletonBlock className="h-24 w-full" />
            </div>
          </div>
        ) : null}
      </section>
    </TemplateShell>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-content-surface-elevated animate-pulse rounded-sm motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export type { CommerceStatusValue, CommerceMoney };
