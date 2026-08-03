import { syncTagInvalidateEventHandler } from "@sanity/functions";

export const handler = syncTagInvalidateEventHandler(
  async ({ event, done }) => {
    const response = await done(event.data.syncTags);

    if (!response.ok) {
      throw new Error(
        `Sanity sync-tag invalidation failed with HTTP ${response.status}`,
      );
    }

    console.log(
      `Invalidated ${event.data.syncTags.length} Sanity sync tag(s).`,
    );
  },
);
