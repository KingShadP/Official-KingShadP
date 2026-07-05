"use client";

import { usePathname } from "next/navigation";
import { Cursor } from "@/components/system/Cursor";
import { Grain } from "@/components/system/Grain";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE } from "@/config/site.config";

/**
 * CORE chrome switchboard. Which chrome renders is config
 * (site.config.chrome), including routes that suppress all chrome
 * (e.g. the full-screen /visuals museum).
 */
function useChromeHidden() {
  const pathname = usePathname();
  return SITE.chrome.hideOnRoutes.some((r) => pathname?.startsWith(r));
}

/** Overlay/fixed chrome — rendered before <main>. */
export function SiteChrome() {
  const hidden = useChromeHidden();
  if (hidden) return null;

  return (
    <>
      {SITE.chrome.cursor && <Cursor />}
      {SITE.chrome.grain && <Grain />}
      {SITE.chrome.nav && <Nav />}
    </>
  );
}

/** Flow chrome — rendered after <main> so the footer follows content. */
export function SiteFooterChrome() {
  const hidden = useChromeHidden();
  if (hidden || !SITE.chrome.footer) return null;
  return <Footer />;
}
