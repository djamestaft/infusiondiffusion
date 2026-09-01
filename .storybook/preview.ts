import type { Preview } from "@storybook/nextjs-vite";

import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    nextjs: { appDirectory: true },
    layout: "fullscreen",
    controls: { expanded: true },
    a11y: { test: "error" },
    viewport: {
      options: {
        homepageTablet: {
          name: "Homepage tablet",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        contact390: {
          name: "Contact 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        contact320: {
          name: "Contact 320",
          styles: { width: "320px", height: "844px" },
          type: "mobile",
        },
      },
    },
  },
};

export default preview;
