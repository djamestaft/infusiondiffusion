import "server-only";
import { getCachedProducts } from "@/lib/shopify/cached-catalog";
import { fragranceProfiles, type GuideProduct } from "./matching";

export async function getGuideProducts(): Promise<GuideProduct[] | null> {
  try {
    const products = await getCachedProducts();
    return products
      .filter((product) =>
        fragranceProfiles.some((profile) => profile.id === product.id),
      )
      .map(({ id, title, handle, availableForSale }) => ({
        id,
        title,
        handle,
        availableForSale,
      }));
  } catch {
    console.error("Unable to load fragrance guide products.");
    return null;
  }
}
