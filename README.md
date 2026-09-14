# Event Spark 2

> The event platform where ideas become experiences.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/runtime-bun-f472b6?logo=bun)](https://bun.sh)

A production-grade, pixel-faithful rebuild of the [event-spark-2.lovable.app](https://event-spark-2.lovable.app/) event-platform template, engineered as a Next.js 16 application on the conventions of the [home-financing](https://github.com/nordeim/home-financing) codebase foundation. It ships the complete product surface of the reference: the marketing landing page, the authentication experience, and the 404 catch-all — with the reference's exact design tokens, layout metrics, and motion behavior, extracted from the live site via computed-style measurement and verified end-to-end in a real browser.

## Overview

Event Spark is an "events for organizers" product template: organizers publish branded registration pages, track attendees, and manage their community. This repository reconstructs that product's public surface as a maintainable, typed, single-page App Router application. The visual design (pink `#E4447C` accent on warm near-white, Bricolage Grotesque display type over DM Sans body, floating category cards, scroll-reveal choreography) was measured from the live reference rather than eyeballed, so the rebuild holds up at any viewport. Content lives in typed data modules; the auth surface is a clean service boundary ready for a real backend.

## Key Features

| Feature | Description |
| --- | --- |
| 🎯 Pixel-faithful landing page | Hero with rotating headline word, confetti + floating category cards, popular events grid, four feature cards with live product mocks, testimonials, dark CTA panel with ticket illustration |
| 🔐 Auth experience | Login / signup tabs, password reset flow, Google provider button — react-hook-form + zod validation, loading states, and toasts |
| 🧭 Single-route hash navigation | SPA view switching (`#/`, `#/auth`, unknown → 404) with working history and deep links, no extra server routes |
| 🎬 Reference motion behavior | Lenis inertial scrolling, scroll-reveal fade-ups, hide-on-load navbar, H1 word rotation, pulsing badge, drifting auth shapes |
| 🎨 Exact design tokens | Computed-style-verified color, type, radius, and shadow system via Tailwind v4 CSS-first `@theme` |
| 🧩 Typed content layer | Events, testimonials, and integrations as readonly typed modules in `src/data/` |
| 🔌 Swappable auth boundary | `AuthService` interface with a deterministic demo adapter; swap one binding for Supabase/Auth.js without touching UI code |
| ✅ Verified quality | ESLint + `tsc --noEmit` gates green; agent-browser end-to-end interaction and responsive checks documented in the PAD |

## Tech Stack

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) | 16.1 | Server rendering, single-route SPA shell |
| UI runtime | React | 19 | Component model |
| Language | TypeScript (strict) | 5 | Type safety end to end |
| Styling | Tailwind CSS | 4 | CSS-first `@theme` token system |
| UI primitives | shadcn/ui (Radix) | — | Accessible tabs, toaster, and form primitives |
| Motion | framer-motion | 12.23 | Scroll reveals, word rotation, entrance choreography |
| Smooth scroll | lenis | 1.3.26 | Inertial scrolling matching the reference feel |
| Forms | react-hook-form + zod | 7.60 / 4.0 | Validated, accessible auth forms |
| Icons | lucide-react | 0.525 | Icon set |
| Runtime | Bun | ≥1.1 | Package manager and dev server |

## File Hierarchy

```text
📂 src/
├── 📂 app/                    # App Router entry
│   ├── 📄 layout.tsx          # Fonts (Bricolage Grotesque, DM Sans), metadata, toaster
│   ├── 📄 page.tsx            # SPA shell — hash router switches home / auth / 404
│   ├── 📄 not-found.tsx       # Server-level 404 for real (non-hash) paths
│   └── 📄 globals.css         # Tailwind v4 @theme design tokens + keyframes
├── 📂 components/
│   ├── 📂 landing/            # Navbar, hero, events, features, testimonials, CTA, footer, scroll-reveal
│   ├── 📂 auth/               # Auth view (tabs, forms, reset flow, Google button)
│   └── 📂 shared/             # Logo lockup, smooth-scroll provider, 404 view
├── 📂 data/                   # Typed content: events, testimonials, integrations
├── 📂 hooks/                  # useHashRoute (hash router), toast hooks
└── 📂 lib/                    # utils + auth service boundary (types, demo adapter, composition root)
📂 public/                     # Self-hosted brand assets: logo glyph, event photos, avatars, integration marks
```

## Quick Start

Requires Bun ≥ 1.1 (or Node ≥ 20 with npm — adjust commands accordingly).

```bash
git clone git@github.com:nordeim/event-spark-2.git
cd event-spark-2
bun install
bun run dev
```

Open <http://localhost:3000>.

**Verify setup**

- Page title is `Event Spark - Your event platform template`.
- The hero headline's pink italic word cycles every 2.6s (`connections.` → `experiences.` → `events.`).
- Clicking **Get started** opens the auth view at `#/auth?mode=signup`; submitting the signup form with a valid email and a password of ≥ 8 characters (mixed case + a digit) fires a toast and returns to the landing page.
- Navigating to `#/anything-else` shows the 404 view; an unknown server path (e.g. `/nope`) shows the same 404 design.

**Quality gates**

```bash
bun run lint        # ESLint — 0 errors
bun run typecheck   # tsc --noEmit — 0 errors
```

## Design System

| Token | Value | Usage |
| --- | --- | --- |
| `--primary` | `hsl(340 75% 58%)` — `#E4447C` | Brand pink: headline accent word, badges, links, CTA button, audience card |
| `--foreground` | `hsl(240 30% 14%)` — `#19192E` | Ink / dark surfaces (hero CTA, dark feature card, CTA panel) |
| `--background` | `hsl(0 0% 98%)` — `#FAFAFA` | Page background |
| `--muted` | `hsl(240 10% 96%)` | Tinted sections, form field chrome |
| `--border` | `hsl(240 5% 91%)` | Hairlines on cards and inputs |
| `--radius` | `0.5rem` | Base scale; cards use `rounded-3xl` / `rounded-[2rem]` / `rounded-[2.5rem]`, buttons pill |

Typography: **Bricolage Grotesque** (display, `font-display`, weights 400–800, tracking −0.02…−0.035em) + **DM Sans** (body). Motion: `drift` keyframes (auth shapes), scroll-reveal fade-up (`ScrollReveal`), Lenis lerp `0.1`, reduced-motion respected.

## Architecture & Contributing

The full engineering reference — layer model, ADRs, security posture, testing strategy, and the measured-clone methodology — lives in [`Project_Architecture_Document.md`](./Project_Architecture_Document.md). Agent-working conventions are in [`AGENTS.md`](./AGENTS.md) and [`CLAUDE.md`](./CLAUDE.md).

Conventions that matter when contributing:

- **Single route only.** All views hang off `src/app/page.tsx` via the hash router — do not add App Router page routes.
- **Content is data.** New events/testimonials go in `src/data/`, not inline JSX.
- **Tailwind v4 CSS-first.** Tokens are defined in `globals.css` `@theme`; no `tailwind.config.js` theme extension.
- **Strict gates.** `bun run lint` and `bun run typecheck` must pass before every commit; fix root causes, never suppress.

## Source & Credit

Reconstructed from the public `event-spark-2.lovable.app` template (Lovable) and built on the architectural conventions of the [`nordeim/home-financing`](https://github.com/nordeim/home-financing) repository. Platform-specific chrome from the reference (Lovable badge, dev-tools button) is intentionally excluded.
