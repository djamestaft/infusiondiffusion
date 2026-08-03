import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";

export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: "invalidate-tags",
      event: {
        resource: {
          type: "dataset",
          id: "j222nd1i.production",
        },
      },
    }),
  ],
});
