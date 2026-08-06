import { notFound } from "next/navigation";

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

export default function CarouselE2EPage() {
  if (process.env.SHOPIFY_E2E_FIXTURES !== "1") notFound();

  return (
    <main className="bg-content-surface text-content-primary min-h-dvh p-5">
      <h1 className="sr-only">Hero carousel test fixture</h1>
      <HeroCarousel slides={fixtureSlides} className="mx-auto max-w-md" />
    </main>
  );
}
