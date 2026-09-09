import type { Metadata } from "next";
import { manrope, marcellus } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Infusion Diffusion",
    template: "%s | Infusion Diffusion",
  },
  description:
    "Discover reed diffusers designed to bring considered fragrance into lived-in rooms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${marcellus.variable}`}>
      <body>{children}</body>
    </html>
  );
}
