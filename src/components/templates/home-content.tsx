import Image from "next/image";
import { Children } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ScrollRevealController } from "@/components/ui/scroll-reveal-controller";
import {
  HeroCarousel,
  type HeroCarouselSlide,
} from "@/components/hero-carousel";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/content-primitives";
import {
  ProductCard,
  type ProductCardProps,
} from "@/components/ui/product-card";
import type { HomeTemplateContent } from "@/components/templates/storefront-templates";
import {
  homeLongevityCopy,
  homeInvitationCopy,
} from "@/components/templates/home-copy";

function ResponsiveCopy({
  text,
  variants,
}: {
  text: string;
  variants: { desktop: string; tablet: string; mobile: string };
}) {
  if (text !== variants.desktop) return text;
  return (
    <>
      <span className="sm:hidden">{variants.mobile}</span>
      <span className="hidden sm:inline lg:hidden">{variants.tablet}</span>
      <span className="hidden lg:inline">{text}</span>
    </>
  );
}

const gutters = "px-5 min-[375px]:px-6 sm:px-10 lg:px-16";
const guidanceRows = [
  ["Living room", "Grounded · resin · warm wood"],
  ["Bedroom", "Soft · still · powdery warmth"],
  ["Entrance", "Bright · citrus · green notes"],
];

function HomeRevealFlow({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollRevealController />
      {Children.map(children, (child, index) =>
        index === 0 || index === 3 || !child ? (
          child
        ) : (
          <ScrollReveal direction={index % 2 ? "left" : "right"}>
            {child}
          </ScrollReveal>
        ),
      )}
    </>
  );
}

export function HomeContent({
  content,
  products,
  slides,
}: {
  content: HomeTemplateContent;
  products: ProductCardProps[];
  slides: HeroCarouselSlide[];
}) {
  return (
    <HomeRevealFlow>
      <HeroCarousel
        slides={slides}
        presentation="editorial"
        withNavigation
        fallbackCopy={{
          title: content.heroTitle,
          subtitle: content.heroIntroduction,
          cta: { label: content.heroActionLabel, href: "/shop" },
        }}
      />

      <section
        aria-labelledby="home-collection-title"
        data-testid="home-cabinet-band"
        className="bg-content-surface"
      >
        <div
          data-testid="home-cabinet-inner"
          className={`mx-auto w-full max-w-[1440px] py-10 lg:py-16 ${gutters}`}
        >
          <div className="flex flex-col items-start gap-[26px] sm:gap-[34px] lg:flex-row lg:items-center lg:justify-between">
            <Heading
              id="home-collection-title"
              level={2}
              className="text-[33px] leading-[41px] tracking-normal min-[375px]:text-4xl min-[375px]:leading-[44px] sm:text-[42px] sm:leading-[52px] lg:text-[46px] lg:leading-[56px]"
            >
              {content.collectionTitle}
            </Heading>
            <a
              href="/shop"
              className="focus-visible:outline-action-focus inline-flex min-h-11 items-center font-sans text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 sm:text-base"
            >
              Shop all fragrances{" "}
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </a>
          </div>
          <div className="border-navigation-border mt-[26px] sm:mt-[34px] lg:mt-11 lg:border-t lg:pt-11">
            {products.length ? (
              <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 lg:gap-6">
                {products.slice(0, 4).map((product, index) => (
                  <ProductCard
                    key={product.href}
                    {...product}
                    className={`max-w-none ${index === 3 ? "hidden sm:grid lg:hidden" : ""}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-content-secondary font-sans">
                The collection is being prepared. Please return soon to explore
                the first fragrances.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className={`bg-content-surface-quiet py-16 sm:py-[76px] lg:py-[94px] ${gutters}`}
        aria-labelledby="home-guidance-title"
      >
        <div className="mx-auto grid max-w-[1312px] gap-6 sm:gap-7 lg:grid-cols-[minmax(0,640fr)_minmax(0,592fr)] lg:gap-x-20">
          <div className="text-center lg:text-left">
            <Heading
              id="home-guidance-title"
              level={2}
              className="text-[28.8px] leading-9 tracking-normal min-[375px]:text-[35.1px] min-[375px]:leading-[43px] sm:text-[44px] sm:leading-[54px] lg:text-5xl lg:leading-[58px]"
            >
              {content.guidanceTitle}
            </Heading>
            <p className="text-content-secondary mt-6 font-sans text-base leading-[27px] lg:text-lg lg:leading-[30px]">
              {content.guidanceIntroduction}
            </p>
          </div>
          <dl className="border-navigation-border divide-navigation-border divide-y border-y">
            {guidanceRows.map(([room, notes]) => (
              <div
                key={room}
                className="grid min-h-[88px] grid-cols-[0.9fr_1.1fr] items-center gap-3 py-4 min-[375px]:min-h-[82px] sm:min-h-[72px] lg:min-h-[68px]"
              >
                <dt className="font-sans text-xs font-semibold uppercase sm:text-sm">
                  {room}
                </dt>
                <dd className="text-content-secondary font-sans text-[13px] leading-5 sm:text-sm">
                  {notes}
                </dd>
              </div>
            ))}
          </dl>
          <Button
            asChild
            className="min-h-12 max-w-full justify-self-center uppercase lg:col-start-1 lg:row-start-2 lg:justify-self-start"
          >
            <a href="/fragrance-guide">{content.guidanceActionLabel}</a>
          </Button>
        </div>
      </section>

      <section
        className="bg-content-primary relative isolate flex min-h-[500px] items-center justify-center overflow-hidden px-5 py-16 min-[375px]:min-h-[480px] sm:min-h-[460px] lg:min-h-[520px]"
        aria-label="Bespoke diffusers"
      >
        <Image
          src="/images/homepage-bespoke-diffuser-blurb.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="bg-collection-hero-scrim absolute inset-0 -z-10" />
        <p className="font-display text-bone-50 max-w-[980px] text-center text-[25px] leading-[37px] min-[375px]:text-[27px] min-[375px]:leading-[39px] sm:max-w-[620px] sm:text-[31px] sm:leading-[44px] lg:max-w-[980px] lg:text-4xl lg:leading-[50px]">
          {content.bespokeBlurb}
        </p>
      </section>

      {content.showLongevity ? (
        <section
          className={`bg-content-surface py-[62px] sm:py-[72px] lg:py-[84px] ${gutters}`}
        >
          <div className="mx-auto grid max-w-[1312px] gap-[22px] text-center sm:grid-cols-[240px_1fr] sm:gap-12 sm:text-left lg:grid-cols-[380px_1fr] lg:gap-[100px]">
            <div>
              <p className="font-display text-[50px] leading-[63px] sm:text-[52px] sm:leading-[62px] lg:text-[68px] lg:leading-[85px]">
                200 ml
              </p>
              <p className="mt-[22px] font-sans text-base leading-[22px] font-semibold sm:mt-2.5 sm:text-[15px] sm:leading-[23px] lg:mt-3 lg:text-[17px]">
                approximately 8–12 months
              </p>
            </div>
            <div>
              <Heading
                level={2}
                className="text-[31px] leading-[39px] tracking-normal sm:text-[34px] sm:leading-[43px] lg:text-[38px] lg:leading-[48px]"
              >
                {content.longevityTitle}
              </Heading>
              <p className="text-content-secondary mt-[22px] max-w-[780px] font-sans text-[15px] leading-[26px] sm:mt-4 sm:text-base sm:leading-[27px] lg:mt-6 lg:text-[17px] lg:leading-[29px]">
                <ResponsiveCopy
                  text={content.longevityConditions}
                  variants={homeLongevityCopy}
                />
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="dark bg-content-surface text-content-primary grid sm:grid-cols-2">
        <div className="flex min-h-[410px] flex-col items-start justify-center px-5 py-10 min-[375px]:min-h-[390px] min-[375px]:px-6 sm:min-h-[540px] sm:px-10 lg:min-h-[620px] lg:px-16">
          <Heading
            level={2}
            className="text-[31px] leading-[41px] tracking-normal min-[375px]:text-[34px] min-[375px]:leading-[44px] sm:text-[35px] sm:leading-[46px] lg:text-[46px] lg:leading-[58px]"
          >
            {content.artistryTitle}
          </Heading>
          <p className="mt-6 font-sans text-base leading-[27px] sm:text-[17px] sm:leading-[29px] lg:text-lg lg:leading-[30px]">
            {content.artistryIntroduction}
          </p>
          <Button
            asChild
            className="mt-8 min-h-12 w-[232px] max-w-full uppercase lg:w-[238px]"
          >
            <a href="/about">{content.artistryActionLabel}</a>
          </Button>
        </div>
        <div className="relative h-[370px] sm:h-auto">
          <Image
            src="/images/homepage-artistry-in-fragrance.png"
            alt="A dark glass reed diffuser styled on stone and linen"
            fill
            sizes="(max-width: 639px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {content.showServiceReassurance ? (
        <section
          aria-labelledby="home-service-title"
          className={`bg-content-surface py-[58px] sm:py-[70px] ${gutters}`}
        >
          <Heading
            id="home-service-title"
            level={2}
            className="text-center text-[32px] leading-10 tracking-normal sm:text-[38px] sm:leading-[48px] lg:text-left lg:leading-[46px]"
          >
            {content.serviceTitle}
          </Heading>
          <div className="divide-navigation-border mt-6 grid divide-y text-center sm:mt-7 lg:mt-[42px] lg:grid-cols-3 lg:gap-5 lg:divide-y-0 lg:text-left">
            {[
              ["Care guidance", "Clear use and placement advice"],
              ["Delivery", "Transparent expectations"],
              ["Stock", "Dependable live availability"],
            ].map(([title, body]) => (
              <div key={title} className="py-5 lg:py-0">
                <h3 className="font-sans text-[11px] leading-[21px] font-semibold uppercase min-[375px]:text-xs min-[375px]:leading-[22px] sm:text-sm sm:leading-[23px]">
                  {title}
                </h3>
                <p className="text-content-secondary mt-2 font-sans text-xs leading-[21px] min-[375px]:text-[13px] min-[375px]:leading-[22px] sm:text-sm sm:leading-[23px]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {content.showCollectionInvitation ? (
        <section
          aria-labelledby="home-collection-invitation-title"
          className={`bg-collection-invitation-surface text-content-primary flex flex-col items-center gap-[26px] py-[62px] text-center sm:gap-7 sm:py-[76px] lg:gap-8 lg:py-[92px] ${gutters}`}
        >
          <Heading
            id="home-collection-invitation-title"
            level={2}
            className="text-4xl leading-[44px] tracking-normal sm:text-[38px] sm:leading-[46px] lg:text-[52px] lg:leading-[62px]"
          >
            {content.collectionInvitationTitle}
          </Heading>
          <p className="max-w-[1000px] font-sans text-lg leading-[30px] sm:text-[19px] sm:leading-[31px] lg:text-xl lg:leading-8">
            <ResponsiveCopy
              text={content.collectionInvitationIntroduction}
              variants={homeInvitationCopy}
            />
          </p>
          <Button
            asChild
            className="min-h-12 w-[232px] max-w-full uppercase lg:w-[238px]"
          >
            <a href="/shop">{content.collectionInvitationActionLabel}</a>
          </Button>
        </section>
      ) : null}
    </HomeRevealFlow>
  );
}
