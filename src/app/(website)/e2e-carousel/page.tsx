import { notFound } from "next/navigation";

import { Navigation } from "@/components/navigation";

import { HeroCarousel } from "@/components/hero-carousel";

const fixtureSlides = [
  {
    id: "e2e-one",
    src: "/images/products/fixtures/bois-de-santal.png",
    alt: "E2E hero fixture one",
  },
  {
    id: "e2e-two",
    src: "/images/products/fixtures/ambre-egyptian.png",
    alt: "E2E hero fixture two",
  },
  {
    id: "e2e-three",
    src: "/images/products/fixtures/noir-de-la-nuit.png",
    alt: "E2E hero fixture three",
  },
];

export default async function CarouselE2EPage({
  searchParams,
}: {
  searchParams: Promise<{ editorial?: string }>;
}) {
  if (process.env.SHOPIFY_E2E_FIXTURES !== "1") notFound();

  if ((await searchParams).editorial === "1")
    return (
      <>
        <Navigation floating accountHref="/account" cartCount={2} />
        <main>
          <HeroCarousel
            presentation="editorial"
            withNavigation
            slides={fixtureSlides.map((slide, index) => ({
              ...slide,
              title: `Campaign ${index + 1}`,
              subtitle: `Introduction for campaign ${index + 1}.`,
              cta: {
                label:
                  index === 1 ? "Find your fragrance" : "Shop the collection",
                href: index === 1 ? "/fragrance-guide" : "/shop",
              },
            }))}
          />
          <section className="bg-content-surface min-h-screen p-10">
            <h2>Explore the collection</h2>
          </section>
        </main>
      </>
    );
  return (
    <main className="bg-content-surface text-content-primary min-h-dvh p-5">
      <h1 className="sr-only">Hero carousel test fixture</h1>
      <HeroCarousel slides={fixtureSlides} className="mx-auto max-w-md" />
    </main>
  );
}
