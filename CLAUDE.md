---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# Event Spark 2

## Core Identity & Purpose

Event Spark 2 is a pixel-faithful, production-grade rebuild of the `event-spark-2.lovable.app` event-platform template: a Next.js 16 single-route application presenting the product's marketing landing page, authentication experience, and 404 flow. It exists to give the template's owner a maintainable, typed, fully verified codebase (design tokens, layout metrics, and motion behavior measured from the live reference) in place of a no-code prototype. Maintained by nordeim; built on the conventions of the `home-financing` repository foundation.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** — Mine requirements deeply; separate explicit needs (clone parity), implicit needs (production quality, verifiability), and ambiguities (view scope). Check multiple implementation approaches before choosing.
2. **PLAN** — Sequence work into phases (tokens → shell → sections → auth → gates → docs) and confirm the plan satisfies acceptance criteria before implementing.
3. **VALIDATE** — Confirm the approach against the reference (computed styles, DOM structure) before writing visual code.
4. **IMPLEMENT** — Build in logical, testable components: one component per section, typed data modules, a single navigation contract.
5. **VERIFY** — Run the full gate chain (lint, typecheck, browser interaction checks) and compare measured output against the reference, not against memory.
6. **DELIVER** — Hand off with documentation (README, PAD) that records decisions and remaining seams.

### Project-Specific Principles

- **Measured over remembered.** Visual changes are validated against extracted computed styles, never eyeballed.
- **Single route, many views.** The product ships one App Router route; navigation is hash-based.
- **Content is data.** Copy and media live in `src/data/`, typed and readonly.
- **Boundaries stay clean.** UI never imports an auth adapter directly; it consumes the `AuthService` interface.

## Implementation Standards

### General Coding Practices

- Early returns over nested conditionals; composition over inheritance.
- Self-documenting names; comments explain *why*, not *what*.
- No speculative abstractions, no dead code, no placeholder values.
- Errors are surfaced (toasts, field errors, logs), never swallowed.

### Language & Framework Guidelines

**TypeScript (strict)**
- `tsconfig.json` strict mode; no `any`.
- `interface` for object shapes, `type` for unions.
- Content modules export `readonly` typed arrays; all IDs are stable strings.

**React 19 / Next.js 16**
- App Router; the only page route is `src/app/page.tsx` (`'use client'` SPA shell).
- `not-found.tsx` handles real unknown server paths; the hash router renders the same view for unknown hash routes.
- Server components only in `layout.tsx` / `not-found.tsx`; product views are client components.
- All user input flows through controlled handlers (`react-hook-form`), never raw form submission.
- Handle every async state: loading (spinner + disabled button), error (field alert or toast), success (toast + navigation).
- User-facing CTAs are `<a href="#/…">` anchors, not `onClick` buttons — preserves middle-click/copy-link/crawler semantics (the reference does the same).

**Styling (Tailwind v4, CSS-first)**
- Tokens live in `src/app/globals.css` (`@theme inline`, `:root` HSL variables): primary pink `hsl(340 75% 58%)`, foreground `hsl(240 30% 14%)`, background `hsl(0 0% 98%)`.
- Use semantic utilities (`bg-foreground`, `text-primary`, `bg-muted/40`); no hardcoded colors.
- Radius scale: pills `rounded-full`, cards `rounded-3xl` / `rounded-[2rem]` / `rounded-[2.5rem]`.
- Fonts: `font-display` (Bricolage Grotesque) for headings, `font-sans` (DM Sans) for body — both wired via `next/font` variables in `layout.tsx`.
- Motion via `framer-motion` (`ScrollReveal`, `AnimatePresence` word rotation) and Lenis (`SmoothScroll`, disabled for reduced motion).

**Accessibility floor**
- Semantic landmarks (`nav`, `main`, `section`, `footer`), `aria-label`s on icon-only controls.
- Visible focus rings (`focus-visible:ring-2`), ≥ 44px touch targets, decorative media marked `aria-hidden`.

## Development Workflow

### Environment Setup

```bash
bun install
bun run dev
```

### Build Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Dev server on port 3000 (logs tee'd to `dev.log`) |
| `bun run build` | Standalone production build |
| `bun run start` | Serve the standalone build |
| `bun run lint` | ESLint (must exit clean) |
| `bun run typecheck` | `tsc --noEmit` (must exit clean) |
| `bun run test` | Vitest unit suites (must exit clean) |

## Testing Strategy

Vitest is wired (`vitest.config.ts`, node environment, `@` alias, `src/**/*.test.ts`). Two unit suites run via `bun run test`:

- **`src/hooks/use-hash-route.test.ts`** (11 tests) — the `parseHash` contract: empty/`#`/`#/` → home; `#/auth` and `?mode=` handling; auth subpaths → 404 (reference parity); unknown hashes → 404; raw strings without `#`.
- **`src/lib/auth/demo-auth-service.test.ts`** (10 tests) — the demo adapter contract: sign-in resolves; password policy (length, case mix, digit) enforced via typed `AuthServiceError`; provider and reset flows resolve; ~900ms latency simulated.

Full verification contract beyond the unit suites:

- **Gates**: `bun run lint` + `bun run typecheck` + `bun run test` before every commit.
- **Golden-path browser pass** (38-check live E2E, workspace script): fresh load renders title `Event Spark - Your event platform template`; hero word rotates; anchor CTA → `#/auth?mode=signup`; empty signup submit shows per-field errors; valid signup (password ≥ 8 with mixed case + digit) fires a toast and returns home; forgot-password flow completes; unknown hash and unknown server path show the reference-spec 404 (muted band, 36px bold, pink underlined home link, testids).
- **Computed-style parity pass**: H1/H2/H3 weights 700, hero CTA 56px, nav 72px, ≥ 5 `#/` anchors on landing, tokens identical to the reference.
- **Responsive pass**: 390px viewport — no horizontal overflow, nav 72px, H1 48px.
- **Zero console errors** after a full scroll + interaction sweep.

When adding behavior to `parseHash` or the auth seam, extend the matching suite first (TDD), then implement.

## Code Quality Standards

- Lint and typecheck failures are fixed at the root cause; suppressing rules or weakening types to pass is forbidden.
- New sections/components follow the existing shape: one file per section under `src/components/<area>/`, `ScrollReveal` wrappers for below-fold content, `className` strings composed with `cn()`.

## Git & Version Control

- Trunk-based: short-lived branches off `main`, Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- One logical change per commit; commits explain why in the body.
- Never commit workspace-only directories (`foundation/`, `recon/`, `scripts/`, `.ssh/` are gitignored) or secrets of any kind.

## Error Handling & Debugging

- Auth failures map to typed outcomes: adapters throw `AuthServiceError` with a `code: AuthError` union value (`weak-password` → field message; `network` → retryable toast copy) — never string-match error messages.
- `window.scrollTo({ behavior: "instant" })` is used on view switches to avoid fighting Lenis.
- Dev-server panic "Failed to restore task data" = corrupted Turbopack cache → stop, `rm -rf .next`, restart (see AGENTS.md Gotchas).

## Communication & Documentation

- Docs record decisions with rationale: README (product), PAD (engineering reference), AGENTS.md (agent shortcuts).
- When a visual is changed, note the measured reference value it diverges from.

## Project-Specific Standards

### Architecture

Single-route SPA shell (`page.tsx`) + hash router (`useHashRoute`) + view components. User-facing CTAs are real `#/…` anchors (crawlable, middle-clickable); `onNavigate` handles programmatic navigation only (post-auth redirect). All framer motion is wrapped in `MotionConfig reducedMotion="user"`. Layout metrics that define the design: hero `min-h-[620px]` centered content inside `py-20 lg:py-28` (total 844px at desktop), floating category cards positioned inside the min-height flex wrapper, confetti pinned to the viewport-wide decorations layer.

### API Design

No HTTP APIs. The only service boundary is `AuthService` (see `src/lib/auth/types.ts`): `signIn`, `signUp`, `signInWithProvider`, `requestPasswordReset`.

### Database / Data Layer

None. Static content modules in `src/data/` (`events.ts`, `testimonials.ts`, `integrations.ts`). If persistence lands, prefer the foundation's Drizzle/Postgres conventions and add a PAD section.

### Environment Variables

| Variable | Purpose | Example |
| --- | --- | --- |
| *(none)* | Current build is self-contained | — |

Real-backend auth would introduce provider credentials (e.g. Supabase URL + key) — document them here when added.

## Anti-Patterns to Avoid

- Adding App Router page routes for views (breaks the single-route hosting contract).
- Inlining marketing copy or asset paths in components instead of `src/data/`.
- Bypassing the `AuthService` seam from UI code.
- Eyeballing design changes instead of re-measuring the reference.
- Building dark-mode support — the brand is light-only.
