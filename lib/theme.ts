import { BRAND } from "@/config/brand.config";

/**
 * Turns brand hex colors into space-separated RGB triplets and emits the
 * CSS variables that Tailwind color classes resolve against
 * (see tailwind.config.ts). Injected once in app/layout.tsx.
 */

function hexToRgbTriplet(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function brandCssVariables(): string {
  const c = BRAND.colors;
  return [
    ":root{",
    `--brand-background:${hexToRgbTriplet(c.background)};`,
    `--brand-surface:${hexToRgbTriplet(c.surface)};`,
    `--brand-foreground:${hexToRgbTriplet(c.foreground)};`,
    `--brand-accent:${hexToRgbTriplet(c.accent)};`,
    `--brand-accent-alt:${hexToRgbTriplet(c.accentAlt)};`,
    "}",
  ].join("");
}
