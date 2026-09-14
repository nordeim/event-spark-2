# AGENTS.md

Compact instructions for AI coding agents working in this repository.
Every line answers: "would an agent likely miss this without help?"

## Commands

| Task | Command |
| --- | --- |
| Install | `bun install` |
| Dev server | `bun run dev` (port 3000; logs tee'd to `dev.log`) |
| Production build | `bun run build` (standalone output; then `bun run start`) |
| Lint | `bun run lint` |
| Typecheck | `bun run typecheck` |
| Unit tests | `bun run test` (Vitest — 21 tests across 2 suites) |

Run order for changes: **lint → typecheck → test → manual browser check**. Unit suites: `src/hooks/use-hash-route.test.ts` (the `parseHash` routing contract) and `src/lib/auth/demo-auth-service.test.ts` (the demo adapter contract, incl. the typed `AuthServiceError` failure path). Live-site E2E and computed-style parity scripts are workspace tooling under gitignored `scripts/` — see `Project_Architecture_Document.md` §7.

## Architecture facts you will get wrong without this file

1. **Single App Router route.** The entire product is `src/app/page.tsx` — a client component SPA shell using a hash router (`src/hooks/use-hash-route.ts`). Views: `#/` (landing), `#/auth` (login/signup; `?mode=signup` preselects signup), anything else → in-app 404. **Never add another `page.tsx` route** — the hosting sandbox only exposes `/`. Deep links and history must keep working through the hash, not the URL path.
2. **Server 404 vs hash 404.** `src/app/not-found.tsx` renders the same `NotFoundView` component for real (non-hash) unknown paths. Both paths must stay in sync.
3. **Navigation contract.** User-facing CTAs are real anchors (`<a href="#/…">`) — navbar Log in/Sign up, hero Get started, Browse all events, final CTA, 404 Return to Home. The hash router syncs via `hashchange`. `onNavigate(to)` is reserved for programmatic navigation only (e.g. the post-auth redirect in `auth-view.tsx`). Never call `window.location` from a section. New views must be added to `parseHash()` in the hash router first (and to its unit tests).
4. **Content is typed data, not JSX.** Events, testimonials, hero cards, and integration logos live in `src/data/*.ts` as `readonly` arrays with explicit interfaces. Adding an event = adding an object there, nowhere else.
5. **Auth is a seam, not a feature.** `src/lib/auth/index.ts` binds `authService` to `demoAuthService` (simulated latency, deterministic validation: signup requires ≥ 8 chars with upper/lower/digit). Adapters fail by throwing `AuthServiceError` (from `types.ts`), which carries a `code: AuthError` union value — UI code branches on `error.code`, never on message strings. To attach a real backend, implement `AuthService` in `src/lib/auth/` and change that one binding. UI code must not know which adapter is live.
6. **Design tokens are measured, not styled.** Colors, radii, paddings, and section heights in this repo were extracted from the live reference via computed styles (see `Project_Architecture_Document.md` §5). When changing visuals, treat the reference measurements as the source of truth; re-measure rather than eyeball.

## Conventions that differ from framework defaults

- **Tailwind v4 CSS-first**: tokens live in `src/app/globals.css` under `@theme inline` / `:root` HSL variables. There is no `tailwind.config.js` theme block (the root `tailwind.config.ts` only carries content paths for tooling) — do not add one for token changes.
- **`font-display` ≠ `font-sans`.** Headings use the `font-display` utility (Bricolage Grotesque via `next/font` variable `--font-bricolage`); body uses `font-sans` (DM Sans, `--font-body`).
- **Light-only brand.** The product ships light theme only; the `.dark` block in `globals.css` exists for shadcn compatibility and is unreachable — do not build dark-mode features.
- **Buttons are pills.** All CTAs use `rounded-full` with the shared hover/active choreography (`hover:-translate-y-[1px]`, `active:scale-[0.97]`, `hover:shadow-float`). Reuse the class strings in `navbar.tsx` / `auth-view.tsx` rather than reinventing.
- **Images are plain `<img>`.** Marketing assets are fixed-crop local files under `public/`; `next/image` optimization was deliberately skipped (same rendering as the reference). Follow the existing pattern for new assets.
- **Headings are bold.** H1/H2/H3 all render at weight 700 (`font-bold`) — a measured reference invariant (PAD §5.1). The hero CTA is `h-14` (56px) with `shadow-xl shadow-foreground/10`; the final-CTA button is intentionally `h-12` (48px). Don't "normalize" them to match each other.
- **Lenis is conditional.** `src/components/shared/smooth-scroll.tsx` disables Lenis for `prefers-reduced-motion: reduce` — keep that guard if touching scroll behavior. The navbar reveals on first user scroll intent (wheel/touch/scroll events), initially tucked via `-translate-y-[100px]`, mirroring the reference.
- **Framer motion is reduced-motion-gated.** The shell wraps all views in `MotionConfig reducedMotion="user"` (`page.tsx`) — keep the wrapper when adding choreography; per-element `motion-reduce:*` guards are then unnecessary.

## Repository hygiene

- Workspace-only directories (`foundation/`, `recon/`, `scripts/`, `.ssh/`, `tool-results/`, etc.) are gitignored — they hold reference material and deployment tooling, never ship. Do not "clean them up" into the repo.
- **Dependency overrides are load-bearing.** `package.json` `overrides` pins `sharp` (^0.35.4) and `postcss` (^8.5.23) to clear published advisories in next's transitive tree — removing them re-opens high-severity findings. `next` is pinned ≥ 16.3.3 (unauth-RCE security floor). Audit trail: `docs/SECURITY_AUDIT.md`.
- No environment variables are required in the current build. If a real auth backend lands, add vars to `.env.example` and document them in the PAD §9.2.
- Conventional Commits, one logical change per commit. History is linear on `main`.

## Gotchas

- **Turbopack cache corruption**: if `next dev` panics with "Failed to restore task data", stop the server, `rm -rf .next`, restart. Do not chase phantom code errors first.
- **Hot reload of `globals.css`** can drop `@theme` tokens until a full page reload; verify computed styles after token edits.
- **The dev-tools button** rendered bottom-left in development is a Next.js overlay, not product UI — it is absent in production builds and must never be styled around.
- **Browser tooling reads CTAs as anchors.** E2E selectors must target `a[href^="#/"]` (or click via `document.querySelector`) — a `role=button` finder will silently miss the anchor CTAs and cascade false failures. `agent-browser eval` returns JSON-stringified results (escaped quotes) — sanitize before substring assertions.
