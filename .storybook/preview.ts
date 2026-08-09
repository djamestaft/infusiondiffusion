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
        mobile390: {
          name: "Mobile 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        mobile320: {
          name: "Mobile 320",
          styles: { width: "320px", height: "844px" },
          type: "mobile",
        },
        // Compatibility aliases for existing page-contract stories.
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
        tablet768: {
          name: "Tablet 768",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop1440: {
          name: "Desktop 1440",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
        wideDesktop: {
          name: "Wide desktop 1728",
          styles: { width: "1728px", height: "1117px" },
          type: "desktop",
        },
      },
    },
  },
};

export default preview;
