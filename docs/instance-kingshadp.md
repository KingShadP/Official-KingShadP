# KingShadP — Template Instance #1

This repo now follows the template-system design (`docs/template-system-design.md`)
in "monorepo-lite" form: core and instance live in one repo, separated by a
strict boundary. When instance #2 is needed, the core layer is extracted into a
package and this repo keeps only the instance layer.

## The boundary

### Instance layer (edit freely per brand)

| Path | Role |
|---|---|
| `config/brand.config.ts` | Identity: name, wordmark, tagline, color tokens, boot mark, OG image, motion preset |
| `config/site.config.ts` | Structure: module flags, nav, chrome toggles, home section order, hero content |
| `lib/site-media.ts` | Asset map (all media references) |
| `lib/visual-media.ts` | Visuals-museum media |
| `lib/content.ts` | Collections: artifacts, tracks, world sections |
| `lib/fonts.ts` | Font swap point (next/font requires static imports) |
| `public/media/*` | Brand media files |
| Module content components | `visuals/`, `shop/`, `world/`, `music/` content specifics |

### Core layer (identical across future instances — no brand values allowed)

| Path | Role |
|---|---|
| `components/system/*` | Preloader, TransitionProvider, Cursor, Grain, SmoothScroller, SiteChrome, Reveal, PagePrelude |
| `components/sections/registry.tsx` | Section registry (name → component) |
| `components/Nav.tsx`, `components/Footer.tsx` | Chrome, fully config-fed |
| `components/home/*` | Registered home sections (content via config/props) |
| `lib/motion.ts`, `lib/theme.ts`, `lib/useBootReveal.ts` | Motion tokens, token injection, boot gate |
| `app/layout.tsx`, `app/page.tsx` | Shell + composition engine |
| `tailwind.config.ts`, `app/globals.css` | Token plumbing (CSS variables), zero brand hex values |

## How theming works

`config/brand.config.ts` (hex) → `lib/theme.ts` (RGB triplets) → `<style id="brand-tokens">`
in `app/layout.tsx` → Tailwind classes (`bg-void`, `text-ivory/60`, `border-bronze/40`)
resolve via `rgb(var(--brand-*) / alpha)`.

Semantic mapping: `void`=background, `panel`=surface, `ivory`=foreground,
`bronze`=accent, `oxblood`=accentAlt, `gold`=legacy alias of accent.

**Rebrand test:** edit only `brand.config.ts`, `site.config.ts`, `lib/fonts.ts`,
and `lib/site-media.ts` — the whole site must follow. If a rebrand requires
touching any core file, that file has a boundary violation; fix the file, not
the config.

## How composition works

`app/page.tsx` renders `SITE.home.sections` in order through
`components/sections/registry.tsx`. Reordering/removing home sections is a
config edit. New section = build component → register → reference in config.

Module flags in `site.config.ts` drive nav and chrome. Disabling `shop`
removes it from navigation (route files remain; route-level gating is a
listed next step).

## Spawning instance #2 (until core is extracted)

1. Fork the repo; delete `public/media`, replace `config/*`, `lib/site-media.ts`, `lib/content.ts`, `lib/fonts.ts`.
2. Replace module content components (visuals/shop content) or disable those modules.
3. Run the rebrand test above.

## Known debt (accepted, tracked)

- `SonicVault` canvas colors are hard-coded rgba values (canvas can't use CSS
  classes; read `getComputedStyle` tokens when touched next).
- `PagePrelude` uses `bg-black` rather than `bg-void` (intentional full-black
  cinematic framing; revisit if a light-theme instance ever exists).
- Admin (`app/admin`, `app/api/admin`), try-on and `lib/shopify.ts` are
  instance-specific extensions — the `/api/ext` promotion rule from the design
  doc applies before reusing them in another instance.
- Font choice requires editing `lib/fonts.ts` (next/font static constraint) —
  documented as the single swap point.
