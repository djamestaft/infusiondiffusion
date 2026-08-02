import { defineLive } from "next-sanity/live";

import { client } from "@/sanity/lib/client";

const token = process.env.SANITY_API_READ_TOKEN || false;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
