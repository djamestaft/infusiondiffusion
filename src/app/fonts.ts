import localFont from "next/font/local";

// The approved Google Fonts are bundled so builds and Storybook work offline.
export const manrope = localFont({
  src: "./font-assets/manrope.ttf",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap",
});
export const marcellus = localFont({
  src: "./font-assets/marcellus.ttf",
  variable: "--font-display",
  weight: "400",
  display: "swap",
});
