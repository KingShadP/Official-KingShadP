# Enterprise Website Template System — Design Plan

## 1. Project Positioning

**What it is.** A reusable website template system: one fixed structural skeleton (routing, layout, component library, config loader, backend services) plus a configuration layer that swaps brand, content, pages, and feature modules per client. Each new company site is a new configuration package, not a new codebase.

**What problem it solves.** Corporate websites repeat the same 80%: header/footer, hero, feature grids, contact forms, CMS-fed content, SEO plumbing. Rebuilding this per client wastes effort and produces divergent codebases that each need separate maintenance. The template system centralizes the 80% and isolates the 20% that actually differs.

**Who it fits.** Companies whose site is primarily presentation plus light interaction: tech companies, retail brand sites, service businesses, Web3 projects, SaaS marketing sites, corporate showcases.

**Who it does not fit.** Products where the website *is* the application: e-commerce with full checkout/inventory, social platforms, dashboards, marketplaces, heavily interactive tools. These need product-specific architecture; forcing them into a template creates a worse product and a polluted template.

**Core value.** One maintained skeleton, N deployed brands. A fix or upgrade in the core propagates to every site; a new site launches by writing configuration and content, not code.

**Why it beats building from scratch each time.** From scratch, every site re-pays setup cost (routing, responsive layout, forms, SEO, CMS wiring, deployment) and every site drifts into a unique maintenance burden. With the template, setup cost is paid once; per-site cost collapses to brand tokens + content + module selection, and maintenance is one upgrade path instead of N.

---

## 2. Known Information and Assumptions

### Known Information

- The goal is a reusable enterprise website template system, not a single site.
- Target company types: technology, retail, services, Web3/blockchain, SaaS, brand showcase.
- Both frontend and backend must be covered, with configuration, extension, and maintenance mechanisms.
- No values were provided for: `company_name`, `company_type`, `visual_style`, `brand_keywords`, `target_users`, `frontend_requirements`, `backend_requirements`, `additional_features`, `project_stage`, `technical_preference`.

### Assumptions

- **Assumption:** Sites are content/marketing sites with light dynamic features (forms, blog, listings), not transactional applications.
- **Assumption:** A small team (frontend + backend + designer scale, not a platform org) builds and maintains the system; design choices favor low operational overhead.
- **Assumption:** Each client gets an isolated deployment (one build per brand), not a single multi-tenant runtime serving all brands. Multi-tenancy is treated as a later option, not the MVP.
- **Assumption:** No technology preference was given, so selection optimizes for ecosystem maturity, hiring availability, and frontend-backend language sharing.
- **Assumption:** English-first with multilingual as an optional module.
- **Assumption:** Hosting on managed platforms (Vercel/Netlify-class for frontend, managed Postgres or hosted CMS for data) rather than self-managed infrastructure.

---

## 3. Template System Design Principles

- **Unified structure principle.** Every site uses the same routing scheme, layout shell, section registry, and data contracts. Why: reuse only works if structure is invariant; the moment each site restructures pages ad hoc, you own N codebases again.
- **Configurability principle.** Anything expected to differ per brand (tokens, copy, images, module flags, section order) must be expressible in configuration/content, never by editing core components. Why: it draws a hard line between "skeleton" (versioned, upgradable) and "instance" (per-client, disposable).
- **Extensibility principle.** New capabilities enter through defined extension points (section registry, module plugins, API namespaces), not by forking. Why: forks cannot receive core upgrades; extension points can.
- **Brand decoupling principle.** Components consume design tokens and content props only; no brand name, color, or copy is hard-coded in components. Why: rebranding must be a data change with zero component edits.
- **Frontend-backend separation principle.** The frontend consumes a stable API/content contract; backend implementation (CMS choice, database) can change without touching components. Why: clients differ most on the data side; a stable contract protects the largest reusable asset (the component library).
- **Maintenance cost control principle.** The template core is a versioned package with a changelog; instances pin a version and upgrade deliberately. Prefer fewer, well-tested options over many half-supported ones. Why: uncontrolled per-site patches are the primary failure mode of template systems.
- **Consistent user experience principle.** Interaction patterns (navigation, form validation, loading/empty/error states, motion timing) are fixed in the skeleton and identical across brands. Why: consistency is what makes QA, documentation, and support scale across N sites.

---

## 4. Frontend Architecture Design

### 4.1 Page Hierarchy

Fixed route skeleton, each route toggleable per instance:

- `/` Home (composed from an ordered list of sections)
- `/about` About / company
- `/products` or `/services` (listing + detail pages from one template pair)
- `/contact` Contact (form + info blocks)
- `/blog` Blog/News (listing + article template)
- `/faq` FAQ
- `/careers` or `/team` (listing + optional detail)
- `/legal/*` Privacy, terms (markdown-driven)
- Custom extension pages: any config-defined slug rendered by the same section-composition engine as Home. This single mechanism covers most "we need one extra page" requests without code.

Rule: pages are compositions of sections; only listing/detail pairs (blog, products) get dedicated templates.

### 4.2 Component Modules

Three layers, strictly separated:

1. **Primitives** (no business meaning): Button, Input, Select, Card, Modal, Drawer, Tabs, Accordion, Toast/Notification, Icon, Image (with loading behavior), Skeleton.
2. **Sections** (composable page blocks, each accepting `content` + `variant` props): Header/Nav, Footer, Hero/Banner, Feature grid, CTA band, Testimonials, Logo wall, Stats, Pricing table, Team grid, FAQ list, Contact form, Content/rich-text block, Gallery/media block, Newsletter signup.
3. **Modules** (feature bundles = sections + routes + API needs): Blog, Product showcase, Booking, Multilingual, Search.

Every section registers in a **section registry** (name → component + content schema). Page composition references sections by name, which is what makes page structure data-driven.

### 4.3 Configurable Items

Per-instance configuration covers:

- Logo (variants: light/dark, mark-only), favicon, social/OG images
- Color tokens (semantic: `primary`, `surface`, `text`, `accent`, states — not raw palette names)
- Font pairs (display/body/mono) with self-hosted fallbacks
- Radius/spacing/shadow scale and button shape (token-level, not per-component CSS)
- Motion intensity preset (none / subtle / expressive)
- All copy and media (from content source, never in components)
- Page list, per-page section order, per-section variant choice
- Module toggles (blog on/off, booking on/off, etc.)
- Locale list + translated content (optional module)
- Analytics/SEO settings (IDs, meta defaults, sitemap options)

Everything else is skeleton and intentionally **not** configurable.

### 4.4 Responsive Design and Interaction

- **Mobile-first:** sections are designed at 360px first; desktop is progressive enhancement. Breakpoints fixed system-wide (e.g., 640/1024/1440) — instances cannot redefine them, which keeps QA finite.
- **Tablet/desktop:** each section defines its own column behavior against the shared grid; no page-level custom layout code.
- **States are part of every section's contract:** loading (skeletons), empty (configurable message + CTA), error (retry pattern), and form states (inline validation, submit pending, success, failure). These are implemented once in primitives and inherited.
- **Consistency/maintainability:** one motion token set (durations/easings), one z-index scale, one focus-visible style. Accessibility (keyboard nav, contrast against token pairs, reduced-motion support) is enforced in the skeleton so instances inherit it for free.

### 4.5 Recommended Frontend Technology Approach

- **Plain HTML/CSS/JS:** rejected. No component model means the section registry and config-driven composition would be hand-rolled; reuse collapses.
- **Vue/Nuxt:** viable; component model and DX are comparable. Rejected only on ecosystem-size and hiring grounds relative to React — a practical, not technical, judgment.
- **React alone (SPA):** rejected for this use case. Marketing sites need SEO and fast first paint; a client-only SPA fights both.
- **Next.js (React) — recommended.** Reasons: static generation + server rendering per page fits content sites (fast, SEO-correct, cheap to host); file-based routing maps cleanly to the fixed page skeleton; the React ecosystem supplies the widest pool of maintained UI/form/i18n libraries; per-brand builds from one codebase are a solved deployment pattern; TypeScript end-to-end lets frontend and backend share config/content type definitions — which is precisely the contract this system depends on.
- **Styling:** Tailwind CSS with tokens defined as CSS variables. Brand switching = swapping a variable set; components never reference raw colors.

---

## 5. Backend Architecture Design

### 5.1 Backend Responsibilities

- Serve/validate site configuration (tokens, modules, page composition) per instance
- Content delivery (pages, blog posts, products, FAQ) from the content store
- Form intake: validation, spam control, persistence, notification (email/webhook)
- Admin APIs: content CRUD, config editing, media upload
- AuthN/AuthZ for admins (role-based: owner, editor)
- Third-party integrations behind adapters (email provider, analytics, CRM, payment link, Web3 RPC where enabled)
- Logging, error reporting, uptime/health endpoints

Explicitly out of scope for the core: end-user accounts, checkout, complex workflows. These are per-project extensions.

### 5.2 Technology Selection Recommendations

- **Node.js (TypeScript) — recommended.** Development efficiency: same language as the frontend; shared types for config/content schemas eliminate an entire class of contract bugs. Maintainability: one language, one toolchain, one CI setup across the whole template. Ecosystem: mature for exactly this workload (API servers, headless CMS, form/email tooling). Reusability: the shared `schemas` package works only if both sides speak TypeScript. Collaboration: frontend developers can maintain backend endpoints, which matters for small teams.
- **Python (FastAPI/Django):** strong ecosystem and fine on its own merits, but it splits the codebase into two languages and breaks type sharing. Justified only if the roadmap includes heavy data/ML features — not indicated here (Assumption).
- **Go/Java:** performance and rigor exceed the need; slower iteration for content-site workloads; rejected for this scope.
- **Concrete shape:** a modular monolith — NestJS or Fastify with a module-per-feature layout — plus a **headless CMS for content** (Payload CMS is a good fit: TypeScript-native, self-hostable, gives admin UI + content API without building either from scratch). Custom backend code then shrinks to forms, integrations, and config validation.

### 5.3 API Design Approach

- **Common core API (versioned, stable):** `/api/v1/config`, `/api/v1/content/*`, `/api/v1/forms/:formId`, `/api/v1/media`, `/api/v1/admin/*`. Every instance ships these unchanged.
- **Extension APIs:** business-specific endpoints live under `/api/ext/*` in a per-project extensions module. They may depend on the core; the core never depends on them. This one-way dependency rule is the anti-coupling mechanism.
- **Reuse across projects:** the core API is defined by shared TypeScript schemas (zod or similar) published in the `shared` package; frontend data hooks are generated against those schemas once and reused by every instance.
- **Avoiding coupling over time:** version the core API; never add client-specific fields to core endpoints (client-specific data goes through extensions); breaking changes require a `v2` and a migration note. Extensions that prove useful in 3+ projects get promoted into the core deliberately, not by copy-paste drift.

### 5.4 Data and Permission Design

Core data objects:

- **SiteConfig:** brand tokens, module flags, page compositions, locale list, integration settings. Versioned; schema-validated on write and on build.
- **Page / Section content:** structured entries matching each section's content schema; draft/published states.
- **Collection content:** posts, products/services, FAQ items, team members — each a typed collection with listing + detail rendering.
- **FormSubmission:** form ID, payload, timestamp, source page, handling status.
- **AdminUser:** email, role (owner/editor), audit fields. Editors touch content; owners touch config and users.
- **ModuleState:** which modules are enabled and their per-module settings.
- **Multi-brand isolation:** one database *per instance* by default (Assumption: isolated deployments). This makes data isolation trivial and lets any single client migrate/leave cleanly. If a shared control plane is added later, every table gains a `site_id` and all queries are scoped by it — but do not pay multi-tenant complexity in the MVP.

---

## 6. Template Customization Mechanism

### 6.1 Brand-Level Customization

One `brand.config` per instance defines: company name (used in metadata, header, footer, legal), logo set, semantic color tokens, font pair, imagery treatment preset (e.g., photographic/illustrative/duotone — implemented as CSS filter + layout presets), and tone-of-voice note (a content-writing guideline stored with the config; it guides copy, it is not runtime logic). Changing every item in this file fully rebrands the site with zero component edits — that is the acceptance test for brand decoupling.

### 6.2 Page-Level Customization

- Page list: enable/disable routes from the fixed skeleton; add extension pages by slug.
- Page order: navigation order is config data.
- Template reuse: listing/detail template pairs are reused by pointing them at a different collection (products vs. services vs. case studies).
- Homepage composition: an ordered array of `{section, variant, contentRef}` entries; reordering or swapping variants is a config edit.
- Add/remove content blocks: any registered section can be inserted into any composed page. Sections not in the registry require code — that is the intended boundary.

### 6.3 Function-Level Customization

Each feature is a module with a flag and a settings block: contact forms (field sets per form, recipient, spam policy), product showcase (collection + card variant + detail layout), service booking (slots/calendar integration — off by default; heaviest module), blog (categories, authors, RSS), FAQ, admin panel (always on, but menu reflects enabled modules), multilingual (locale list, per-entry translations, URL strategy), SEO (meta defaults, structured data per collection, sitemap/robots), third-party integrations (adapter per provider, keys in environment, not in config files).

Disabled modules must not ship code to the client bundle (route-level code splitting per module).

### 6.4 Configuration Method Recommendations

- **Config files (TS/JSON in repo):** structural decisions — module flags, page compositions, token sets. Right place because these changes should be code-reviewed and versioned with the instance.
- **JSON/YAML:** fine as the file format above; avoid YAML for anything deeply nested that needs schema validation — TS/JSON with zod validation gives errors at build time.
- **CMS:** all copy, media, collections — anything a non-developer edits weekly. Wrong place for structure (letting editors reorder page architecture in the CMS invites breakage).
- **Database:** form submissions, admin users, module runtime state — anything written by the running system.
- **Admin panel:** the human interface over CMS + selected safe config (e.g., toggling a banner, editing nav labels). Token/structure edits stay in files; a "theme editor" UI is a Phase-3 luxury, not MVP.

Rule of thumb: *developers change structure in files; editors change content in the CMS; the system writes only to the database.*

---

## 7. Multi-Industry Adaptation Recommendations

**Technology companies.**
Unchanged: full skeleton — hero, features, pricing, blog, careers.
Visual: cooler token sets, product-screenshot imagery preset, denser feature grids.
Functional: enable blog + careers; pricing table section; docs link-outs.
Lowest-cost path: this is the template's native shape; adaptation ≈ tokens + copy only.

**Retail companies.**
Unchanged: layout shell, nav/footer, contact, FAQ.
Visual: photography-first presets (larger media sections, gallery variants), warmer tokens.
Functional: product showcase module with lookbook/grid variants; "buy" as outbound links to an existing commerce platform. Full checkout is out of scope (see §1) — integrate, don't rebuild.
Lowest-cost path: product collection + gallery variants; no new sections needed.

**Service businesses.**
Unchanged: skeleton; services use the products listing/detail pair renamed via config.
Visual: trust-oriented presets — testimonials, team, credentials sections prominent.
Functional: booking module (or a form-based inquiry fallback, which is cheaper and usually sufficient); FAQ on; blog optional.
Lowest-cost path: form-based inquiries first; only enable calendar booking when a client actually needs it.

**Web3 / blockchain projects.**
Unchanged: skeleton, composition engine, forms, blog.
Visual: expressive motion preset, dark-first token sets — both already supported paths, not new code.
Functional: extension sections behind the module system: token/stats ticker (read-only RPC/API), roadmap section, community links, docs integration. Wallet-connect only as a per-project extension — it drags in heavy dependencies and shouldn't enter the core until 3+ projects need it.
Lowest-cost path: roadmap + stats sections in the core registry (they're generic), everything chain-specific in `/api/ext`.

Pattern across all four: structure and interaction never change; tokens, imagery presets, section variants, and module flags absorb the differences. Where an industry needs a genuinely new section, it is added to the registry once and becomes available to every future instance.

---

## 8. Engineering Standards and Best Practices

- **Directory conventions:** feature/module-first folders (all files of a module live together); shared primitives in one place; no cross-imports between modules — only module → shared/core.
- **Naming:** components PascalCase; hooks `useX`; config keys camelCase; API routes kebab-case; section names in the registry are stable string IDs (renaming one is a breaking change and must be versioned).
- **Style management:** Tailwind + CSS variables for tokens only; no inline hex values in components (lint rule); component-specific CSS only for cases utilities can't express; z-index and motion values only from the token scale.
- **API conventions:** REST, versioned prefix, JSON errors in one envelope shape (`code`, `message`, `details`); all payloads validated with shared zod schemas at the boundary; core vs. `/api/ext` separation as defined in §5.3.
- **Configuration management:** every config file schema-validated in CI; an instance that fails config validation fails the build — misconfiguration must never reach production silently.
- **Environment variables:** secrets and per-environment values only (API keys, DB URLs); never brand/content values; a checked-in `.env.example` enumerates every variable with a comment; startup fails fast on missing required vars.
- **Comments/documentation:** each section documents its content schema and variants next to the code; the template core keeps a CHANGELOG and upgrade notes per release; each instance repo has a one-page README: pinned core version, enabled modules, owner contacts.
- **Frontend-backend collaboration:** the shared schema package is the contract; changes to it require review from both sides; frontend never types API responses locally.
- **Maintainability:** template core released as versioned packages; instances pin versions and upgrade via documented steps; CI per instance runs build + config validation + a smoke test of composed pages; visual regression snapshots on core section variants catch cross-brand breakage before release.

---

## 9. Recommended Directory Structure

```
template-system/
├── frontend/            # Next.js app: routes, layout shell, page composition engine
│   ├── app/             # fixed route skeleton
│   ├── components/
│   │   ├── primitives/  # buttons, inputs, cards, modal...
│   │   └── sections/    # registered page sections + registry
│   ├── modules/         # feature bundles (blog, products, booking, i18n)
│   └── lib/             # config loader, data hooks, motion/tokens utilities
├── backend/             # Node/TS API + CMS
│   ├── core/            # config, content, forms, media, admin, auth
│   ├── extensions/      # per-project APIs (/api/ext), empty in the core repo
│   └── integrations/    # adapters: email, analytics, CRM, RPC
├── config/              # per-instance configuration
│   ├── brand.config.ts  # tokens, logo refs, fonts, presets
│   ├── site.config.ts   # pages, section compositions, module flags
│   └── locales/         # optional translations
├── assets/              # brand media (logos, fonts, imagery) per instance
├── shared/              # single source of truth for contracts
│   ├── schemas/         # zod schemas: config, content, API payloads
│   └── types/           # generated/shared TS types
├── docs/                # core changelog, upgrade guides, section catalog,
│                        # per-instance setup runbook
└── scripts/             # create-instance scaffolder, config validator, deploy helpers
```

Responsibilities: `frontend` renders, and may only read data shaped by `shared`; `backend` owns persistence and integrations behind the core API; `config` + `assets` are the *only* directories that differ between brand instances; `shared` is the contract both sides compile against; `docs` is what makes the system operable by people who didn't build it; `scripts` turns "new client" into a scaffold command instead of a checklist.

---

## 10. MVP Development Priorities

### Phase 1: Minimum viable skeleton

Build: fixed route skeleton; primitives + the 8 highest-frequency sections (header, footer, hero, features, CTA, testimonials, FAQ, contact form); token system + two proof brand configs; page composition engine; forms API with email notification; CMS wired for copy/collections; config schema validation; instance scaffolder script.
Why first: this is the smallest set that proves the core claim — *two visibly different brands from one codebase with zero component edits*. If that test fails, nothing later matters.
Value to reuse: the composition engine + registry + token system are 90% of the reuse mechanism.

### Phase 2: Enhanced experience and extensibility

Build: blog and product showcase modules; module-level code splitting; loading/empty/error state hardening; SEO module (structured data, sitemaps, OG generation); admin roles; motion presets; multilingual module; visual regression testing on sections; documented core versioning + first real upgrade of a live instance.
Why second: these convert a working skeleton into something sellable across the target industries, and the first *real upgrade* validates the maintenance model before many instances exist.
Value to reuse: modules and the upgrade path are what make instance #5 cheaper than instance #2.

### Phase 3: Advanced capabilities and long-term evolution

Build: booking module; Web3 extension pack (stats/roadmap sections, RPC adapter); safe-subset theme editor in admin; multi-instance control plane (shared dashboard of versions/uptime across client sites); promotion process for extensions → core; optional multi-tenant runtime evaluation.
Why last: each item is expensive and only pays off at fleet scale; building them earlier would burden the MVP with speculative complexity.
Value to reuse: fleet-level operations — the difference between "we have a template" and "we run a platform."

---

## 11. Risks and Boundaries

- **Over-generalization → weak brand identity.** All sites look like the same theme reskinned. Control: section *variants* (not just colors) per section, imagery/motion presets, and a per-instance budget for 1–2 bespoke sections added through the registry. The registry makes bespoke work additive, not fork-inducing.
- **Excessive configurability → complexity explosion.** Every new config option multiplies QA surface. Control: config options require a demonstrated need from 2+ real instances; otherwise it stays code. Track the config schema size as a health metric; prune unused options at each major version.
- **Overweight backend → expensive MVP.** Building a custom admin, auth, and content API from scratch delays launch by months. Control: adopt a headless CMS for content/admin in Phase 1; write custom backend code only for forms, config, and integrations. Defer multi-tenancy entirely (isolated instances).
- **Industry spread → low adaptation efficiency.** Web3 and retail pull in opposite directions; chasing both fully bloats the core. Control: hard core/extension boundary (§5.3) with the "promote after 3 uses" rule; industry-specific weight lives in extension packs, and an industry that repeatedly fights the skeleton is declared out of scope rather than absorbed.
- **Instance drift.** Developers patch a live instance directly under deadline pressure and it can never upgrade again. Control: core is a pinned dependency, not copied source; CI blocks edits to core paths inside instance repos; every hotfix must land in core or extensions.

---

## 12. Final Conclusion

- **Overall approach:** one versioned template core (component library + section registry + page composition engine + core API) consumed by per-client instance repos that contain only `config/`, `assets/`, content, and optional `/api/ext` extensions. Isolated deployment per brand; strict core/extension dependency direction.
- **Technology stack:** Next.js + TypeScript + Tailwind with CSS-variable tokens on the frontend; Node.js/TypeScript backend (modular monolith) with Payload CMS (or equivalent TS-native headless CMS) for content and admin; Postgres per instance; zod schemas in a shared package as the frontend-backend contract; managed hosting.
- **Build first:** Phase 1 exactly as scoped — skeleton, 8 sections, tokens, composition engine, forms, CMS wiring, validation, scaffolder — proven by launching **two** differently-branded demo instances from the same core. Two, not one: one instance cannot prove reusability.
- **Expansion path:** Phase 2 modules (blog, products, SEO, i18n) → first live core upgrade → Phase 3 booking/Web3 packs and fleet tooling. Promote extensions into core only after repeated real use.
- **Biggest advantage:** marginal cost per new site collapses to configuration + content, while every core improvement compounds across all deployed instances through one upgrade path.
- **Watch most carefully:** instance drift and configuration sprawl — both are gradual, invisible until upgrade time, and fatal to reuse. Enforce the core-as-dependency rule and the "2+ instances before a new config option" rule from day one.
