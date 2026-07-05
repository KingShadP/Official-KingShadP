import { SITE_MEDIA } from "@/lib/site-media";

/**
 * SITE CONFIG — instance layer.
 *
 * Structure of this instance: which modules are on, what the nav shows,
 * how the home page is composed, and site-wide metadata. Core components
 * read structure from here; they never define it themselves.
 */

export type ModuleKey = "visuals" | "music" | "world" | "shop" | "admin";

export type HomeSectionKey =
  | "hero"
  | "systemIndex"
  | "selectedArtifacts"
  | "doctrine";

export const SITE = {
  url: "https://divine-archive.vercel.app",
  metadata: {
    title: "KingShadP — Official",
    description:
      "The official creative house of KingShadP — sound, image, story, and archive.",
  },

  /** Feature modules. Disabling one removes it from nav and chrome. */
  modules: {
    visuals: true,
    music: true,
    world: true,
    shop: true,
    admin: true,
  } satisfies Record<ModuleKey, boolean>,

  /** Top/footer navigation, ordered. Filtered by module flags below. */
  nav: [
    { href: "/visuals", label: "Visuals", index: "01", module: "visuals" },
    { href: "/music", label: "Music", index: "02", module: "music" },
    { href: "/world", label: "World", index: "03", module: "world" },
    { href: "/shop", label: "Shop", index: "04", module: "shop" },
  ] as ReadonlyArray<{
    href: string;
    label: string;
    index: string;
    module: ModuleKey;
  }>,

  /** Site chrome toggles. /visuals hides all chrome (route-level rule). */
  chrome: {
    nav: true,
    footer: true,
    cursor: true,
    grain: true,
    hideOnRoutes: ["/visuals"],
  },

  /** Home page = ordered composition of registered sections. */
  home: {
    sections: [
      "hero",
      "systemIndex",
      "selectedArtifacts",
      "doctrine",
    ] as ReadonlyArray<HomeSectionKey>,

    hero: {
      kicker: "Identity / Luxury / Worldbuilding / Sound",
      intro:
        "KingShadP is a luxury world in progress: a creative house where image, sound, symbols, fashion, and prophecy are treated as one unified system.",
      backdrop: SITE_MEDIA.heroBackdrop,
      plate: SITE_MEDIA.heroPlate,
      ctas: [
        { href: "/visuals", label: "Enter Visuals", variant: "primary" },
        { href: "/world", label: "Read the World", variant: "ghost" },
      ] as ReadonlyArray<{ href: string; label: string; variant: "primary" | "ghost" }>,
    },
  },
} as const;

/** Nav entries whose module is enabled — the only nav list components use. */
export const NAV_LINKS = SITE.nav.filter((l) => SITE.modules[l.module]);

export type SiteConfig = typeof SITE;
