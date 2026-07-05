import type { ComponentType } from "react";
import type { HomeSectionKey } from "@/config/site.config";
import { Hero } from "@/components/home/Hero";
import { SystemIndex } from "@/components/home/SystemIndex";
import { SelectedArtifacts } from "@/components/home/SelectedArtifacts";
import { Doctrine } from "@/components/home/Doctrine";

/**
 * SECTION REGISTRY — core mechanism.
 * Composed pages (home, future extension pages) reference sections by
 * stable string key from site.config.ts. Adding a section: build the
 * component, register it here, then it becomes available to composition
 * config. Renaming a key is a breaking change to instance configs.
 */
export const HOME_SECTIONS: Record<HomeSectionKey, ComponentType> = {
  hero: Hero,
  systemIndex: SystemIndex,
  selectedArtifacts: SelectedArtifacts,
  doctrine: Doctrine,
};
