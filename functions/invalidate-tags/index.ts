import { syncTagInvalidateEventHandler } from "@sanity/functions";

export const handler = syncTagInvalidateEventHandler(
  async ({ event, done }) => {
    const endpoint = process.env.SANITY_REVALIDATE_TAGS_ENDPOINT;
    const secret = process.env.SANITY_REVALIDATE_TAGS_SECRET;

    if (!endpoint || !secret) {
      throw new Error("Missing Sanity cache revalidation configuration");
    }

    const revalidationResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ tags: event.data.syncTags }),
    });

    if (!revalidationResponse.ok) {
      throw new Error(
        `Storefront cache revalidation failed with HTTP ${revalidationResponse.status}`,
      );
    }

    const response = await done(event.data.syncTags);

    if (!response.ok) {
      throw new Error(
        `Sanity sync-tag invalidation failed with HTTP ${response.status}`,
      );
    }

    console.log(
      `Revalidated ${event.data.syncTags.length} storefront cache tag(s).`,
    );
  },
);
