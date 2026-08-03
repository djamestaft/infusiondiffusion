import type { Metadata } from "next";
import { Manrope, Marcellus } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Infusion Diffusion",
    template: "%s | Infusion Diffusion",
  },
  description:
    "Discover room sprays, reed diffusers, and candles designed to bring considered fragrance into lived-in rooms.",
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
