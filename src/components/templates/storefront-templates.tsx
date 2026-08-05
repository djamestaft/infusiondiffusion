import Image from "next/image";

import { Navigation, type NavigationProps } from "@/components/navigation";
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

function TemplateShell({
  navigationTheme = "ivory",
  cartCount,
  currentHref,
  children,
}: TemplateNavigationProps & {
  currentHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-content-surface text-content-primary min-h-dvh">
      <Navigation
        theme={navigationTheme}
        currentHref={currentHref}
        cartCount={cartCount}
      />
      <main>{children}</main>
    </div>
  );
}

function ProductGrid({ products }: { products: ProductCardProps[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
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
  founderImage,
  navigationTheme,
  cartCount,
  content: suppliedContent,
}: HomeTemplateProps) {
  const content = { ...fallbackHomeTemplateContent, ...suppliedContent };
  const storyImage = founderImage ?? heroImage;
  return (
    <TemplateShell navigationTheme={navigationTheme} cartCount={cartCount}>
      <ScrollRevealController />
      <section
        className={cn(
          sectionClass,
          "grid gap-10",
          heroImage && "lg:grid-cols-2 lg:items-center",
        )}
      >
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
        />
        {heroImage ? (
          <div className="bg-product-card-media-fallback relative aspect-4/5 overflow-hidden rounded-lg lg:mx-auto lg:w-4/5">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1023px) calc(100vw - 40px), 40vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </section>

      <ScrollReveal direction="left">
        <section
          className={sectionClass}
          aria-labelledby="home-collection-title"
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
            <ProductGrid products={products.slice(0, 3)} />
          ) : (
            <p className="text-content-secondary max-w-prose font-sans">
              The collection is being prepared. Please return soon to explore
              the first fragrances.
            </p>
          )}
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
    >
      <section className={sectionClass}>
        <ContentHeader
          context={{ type: "eyebrow", label: "Shop" }}
          title={title}
          headingLevel={1}
          headingTreatment="display"
          lead={description}
        />
        <div className="border-navigation-border mt-12 flex items-center justify-between border-y py-4 font-sans text-sm">
          <p aria-live="polite">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          <p className="text-content-secondary">Curated collection</p>
        </div>
        {products.length ? (
          <div className="mt-10">
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
      <article
        className={cn(sectionClass, "grid gap-10 lg:grid-cols-2 lg:gap-20")}
      >
        <div className="bg-product-card-media-fallback relative aspect-3/4 overflow-hidden rounded-lg">
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
        <div className="flex flex-col justify-center gap-6">
          <Eyebrow>{product.format}</Eyebrow>
          <Heading level={1} treatment="display">
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
          <dl className="border-navigation-border mt-4 divide-y border-y font-sans">
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

export type { CommerceStatusValue, CommerceMoney };
