import type { QueryParams } from "next-sanity";
import { defineLive } from "next-sanity/live";
import {
  resolvePerspectiveFromCookies,
  type LivePerspective,
} from "next-sanity/live";
import { cookies, draftMode } from "next/headers";

import { client } from "@/sanity/lib/client";

const token = process.env.SANITY_API_READ_TOKEN || false;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
});

export type DynamicFetchOptions = {
  perspective: LivePerspective;
  stega: boolean;
};

export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return { perspective: "published", stega: false };
  }

  const perspective = await resolvePerspectiveFromCookies({
    cookies: await cookies(),
  });

  return { perspective: perspective ?? "drafts", stega: true };
}

export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString;
  params?: QueryParams;
  perspective: LivePerspective;
}) {
  "use cache";

  return sanityFetch({
    query,
    params,
    perspective,
    stega: false,
  });
}
