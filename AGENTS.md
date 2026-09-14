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

Run order for changes: **lint → typecheck → manual browser check**. There is no test suite wired yet; browser-verification steps are described in `Project_Architecture_Document.md` §8.

## Architecture facts you will get wrong without this file

1. **Single App Router route.** The entire product is `src/app/page.tsx` — a client component SPA shell using a hash router (`src/hooks/use-hash-route.ts`). Views: `#/` (landing), `#/auth` (login/signup; `?mode=signup` preselects signup), anything else → in-app 404. **Never add another `page.tsx` route** — the hosting sandbox only exposes `/`. Deep links and history must keep working through the hash, not the URL path.
2. **Server 404 vs hash 404.** `src/app/not-found.tsx` renders the same `NotFoundView` component for real (non-hash) unknown paths. Both paths must stay in sync.
3. **Navigation contract.** Sections never call `window.location` directly; they receive an `onNavigate(to)` callback from the shell that resolves hash routes. New views must be added to `parseHash()` in the hash router first.
4. **Content is typed data, not JSX.** Events, testimonials, hero cards, and integration logos live in `src/data/*.ts` as `readonly` arrays with explicit interfaces. Adding an event = adding an object there, nowhere else.
5. **Auth is a seam, not a feature.** `src/lib/auth/index.ts` binds `authService` to `demoAuthService` (simulated latency, deterministic validation: signup requires ≥ 8 chars with upper/lower/digit). To attach a real backend, implement `AuthService` in `src/lib/auth/` and change that one binding. UI code must not know which adapter is live.
6. **Design tokens are measured, not styled.** Colors, radii, paddings, and section heights in this repo were extracted from the live reference via computed styles (see `Project_Architecture_Document.md` §5). When changing visuals, treat the reference measurements as the source of truth; re-measure rather than eyeball.

## Conventions that differ from framework defaults

- **Tailwind v4 CSS-first**: tokens live in `src/app/globals.css` under `@theme inline` / `:root` HSL variables. There is no `tailwind.config.js` theme block (the root `tailwind.config.ts` only carries content paths for tooling) — do not add one for token changes.
- **`font-display` ≠ `font-sans`.** Headings use the `font-display` utility (Bricolage Grotesque via `next/font` variable `--font-bricolage`); body uses `font-sans` (DM Sans, `--font-body`).
- **Light-only brand.** The product ships light theme only; the `.dark` block in `globals.css` exists for shadcn compatibility and is unreachable — do not build dark-mode features.
- **Buttons are pills.** All CTAs use `rounded-full` with the shared hover/active choreography (`hover:-translate-y-[1px]`, `active:scale-[0.97]`, `hover:shadow-float`). Reuse the class strings in `navbar.tsx` / `auth-view.tsx` rather than reinventing.
- **Images are plain `<img>`.** Marketing assets are fixed-crop local files under `public/`; `next/image` optimization was deliberately skipped (same rendering as the reference). Follow the existing pattern for new assets.
- **Lenis is conditional.** `src/components/shared/smooth-scroll.tsx` disables Lenis for `prefers-reduced-motion: reduce` — keep that guard if touching scroll behavior. The navbar reveals on first user scroll intent (wheel/touch/scroll events), initially tucked via `-translate-y-[100px]`, mirroring the reference.

## Repository hygiene

- Workspace-only directories (`foundation/`, `recon/`, `scripts/`, `.ssh/`, `tool-results/`, etc.) are gitignored — they hold reference material and deployment tooling, never ship. Do not "clean them up" into the repo.
- No environment variables are required in the current build. If a real auth backend lands, add vars to `.env.example` and document them in the PAD §9.2.
- Conventional Commits, one logical change per commit. History is linear on `main`.

## Gotchas

- **Turbopack cache corruption**: if `next dev` panics with "Failed to restore task data", stop the server, `rm -rf .next`, restart. Do not chase phantom code errors first.
- **Hot reload of `globals.css`** can drop `@theme` tokens until a full page reload; verify computed styles after token edits.
- **The dev-tools button** rendered bottom-left in development is a Next.js overlay, not product UI — it is absent in production builds and must never be styled around.
