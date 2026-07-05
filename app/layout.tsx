import type { Metadata, Viewport } from "next";
import "./globals.css";
import { displayFont, bodyFont } from "@/lib/fonts";
import { brandCssVariables } from "@/lib/theme";
import { BRAND } from "@/config/brand.config";
import { SITE } from "@/config/site.config";
import { TransitionProvider } from "@/components/system/TransitionProvider";
import { SmoothScroller } from "@/components/system/SmoothScroller";
import { Preloader } from "@/components/system/Preloader";
import { SiteChrome, SiteFooterChrome } from "@/components/system/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.metadata.title,
  description: SITE.metadata.description,
  openGraph: {
    title: SITE.metadata.title,
    description: SITE.metadata.description,
    type: "website",
    images: [BRAND.assets.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.colors.background,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        {/* Brand tokens — generated from config/brand.config.ts */}
        <style id="brand-tokens">{brandCssVariables()}</style>
      </head>
      <body className="font-mono antialiased bg-void text-ivory">
        <TransitionProvider>
          <SmoothScroller />
          <Preloader />
          <SiteChrome />
          <main className="relative">{children}</main>
          <SiteFooterChrome />
        </TransitionProvider>
      </body>
    </html>
  );
}
