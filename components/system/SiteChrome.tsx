"use client";

import { usePathname } from "next/navigation";
import { Cursor } from "@/components/system/Cursor";
import { Grain } from "@/components/system/Grain";
import { Footer } from "@/components/Footer";

export function SiteChrome() {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/visuals") ?? false;

  if (hideChrome) {
    return null;
  }

  return (
    <>
      <Cursor />
      <Grain />
      <Footer />
    </>
  );
}
