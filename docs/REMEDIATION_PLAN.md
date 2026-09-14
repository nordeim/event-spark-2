# Event Spark 2 — Remediation Plan (Round 1)

**Date:** 2026-09-14
**Trigger:** Session 2 E2E + visual-parity audit of the live deployment
**Inputs:** `scripts/e2e_live_tests.sh` (23 checks), `scripts/parity_check.sh` (computed-style assertions vs `event-spark-2.lovable.app`), full codebase review
**Baseline before remediation:** `bun run lint` clean · `tsc --noEmit` clean · E2E golden path 21/23 direct pass (2 were test-methodology artifacts, behavior verified manually)

---

## 1. Findings Inventory

Severity: **P1** = visual-contract violation (documented fidelity promise broken) · **P2** = correctness/semantics/a11y gap · **P3** = hygiene/debt.

| ID | Sev | Area | Finding | Evidence |
|----|-----|------|---------|----------|
| F-01 | P1 | Typography | Hero `H1` renders weight **400**; reference measures **700**. `font-bold` missing in `hero.tsx` line 188. Contradicts PAD §5.1 ("700 all headings"). | computed-style: REF w=700 vs CLONE w=400 |
| F-02 | P1 | Typography | All four landing `H2`s (Popular events, Features, Loved by organizers, Ready to spark…) render weight **400**; reference is **700**. Missing `font-bold` in `popular-events.tsx`, `features.tsx`, `testimonials.tsx`, `final-cta.tsx`. | computed-style per-heading |
| F-03 | P1 | Typography | Event-card titles `H3` render **600** (`font-semibold`); reference is **700**. `event-card.tsx` line 30. | computed-style: REF w=700, 18px |
| F-04 | P1 | Hero CTA | Hero "Get started" CTA is `h-12` (48px) + no resting shadow; reference is `h-14` (56px) with `shadow-xl shadow-foreground/10`. Final CTA ("Get started for free") is correctly 48px — the two CTAs intentionally differ in the reference. | bounding box: REF 56 vs CLONE 48; REF class list captured |
| F-05 | P1 | 404 view | Clone 404 is a bespoke design (96px Bricolage "404", dark pill button, `bg-background`). Reference 404 is: `bg-muted` full-height wrapper, `text-4xl font-bold` (DM Sans, not display face) "404", `text-xl` message, and a **pink underlined text link** "Return to Home". Reference also carries `data-testid="page-not-found"` / `"not-found-home-link"`. | DOM extraction from both sites |
| F-06 | P2 | Semantics/a11y | All 6 user-facing CTAs are `<button onClick>`; reference uses `<a href>` anchors (Log in, Sign up, Get started, Browse all events, Get started for free, Return to Home). Result: no middle-click/copy-link/crawler-follow on the clone (landing has 0–1 `<a>` vs reference 6 product links). Violates "Content is data / reference parity" spirit and the a11y floor in CLAUDE.md. | `document.querySelectorAll("a")` counts + REF outerHTML |
| F-07 | P2 | Auth test hooks | Reference auth carries `data-testid`s (`login-form`, `login-email`, `login-password`, `login-submit`); clone only has `page-auth`. Blocks stable E2E selectors. | DOM extraction |
| F-08 | P2 | Testing | No unit-test runner wired (PAD §10 open task). CLAUDE.md names the exact plan: Vitest on `demo-auth-service` + `parseHash`. | package.json (no vitest), no `src/**/*.test.ts` |
| F-09 | P2 | Auth seam typing | `AuthError` union exists in `types.ts` but is **never used** (dead type); `demoAuthService.signUp` throws a bare `new Error("weak-password")` and `auth-view.tsx` string-matches `error.message` — a stringly-typed contract the types file explicitly exists to prevent. | types.ts vs demo-auth-service.ts vs auth-view.tsx |
| F-10 | P2 | Motion a11y | Reference CTAs carry `motion-reduce:*` guards; clone's framer-motion choreography (hero entrances, word rotation, ScrollReveal) has no reduced-motion gate. Lenis and `drift` are gated; the framer layer is not. | REF class list; clone code review |
| F-11 | P3 | Dead code | 46 of 49 `src/components/ui/*` scaffold components unused (only `tabs`, `toast`, `toaster` used); ~37 unused dependencies in `package.json` (dnd-kit, mdxeditor, react-query, recharts, zustand, next-intl, …). CLAUDE.md forbids dead code; PAD §6.4 already claims surface pruning. | import-graph scan (`rg -l` per dep / per component) |
| F-12 | P3 | Dev infra | Next.js 16 dev-server warning: "Cross origin request detected from preview-…space-z.ai to /_next/* — configure `allowedDevOrigins`". Future major will break the preview proxy without it. | dev.log warning line |
| F-13 | Info | Reference | User-cited source site `editorial-portfolio-9d8e325b.lovable.app` is a different product ("Elena Vance — Designer & Brand Strategist"). The documented reference for this codebase is `event-spark-2.lovable.app`; parity audit used the documented reference. Flagged for the owner. | page titles of both sites |
| F-14 | Info | Docs | PAD §7.3/§8.5 verification ledger claims "exact match on all sampled values" — falsified by F-01..F-05 (the earlier ledger sampled colors/radii but not weights/CTA height). Docs must be re-baselined after remediation. | this audit |

**Not defects (validated, leave alone):** auth input metrics (44px pill ✓), tab semantics ✓, toast copy ✓, hero card positions ✓, nav 72px + hide-until-scroll-intent ✓, mobile 390px (no overflow, H1 48px) ✓, final CTA 48px ✓, word rotation cadence ✓, zero console errors ✓, sign-in/sign-up/reset/404 flows ✓.

---

## 2. Remediation ToDo (execution order)

### Phase A — Test infrastructure first (TDD enabler) — fixes F-08

- [ ] A1. Add `vitest` devDependency; add `vitest.config.ts` (foundation convention: `@` alias, `environment: "node"`, `include: ["src/**/*.test.ts"]`); add `"test": "vitest run"` script.
- [ ] A2. Export `parseHash` from `use-hash-route.ts` (testability refactor; behavior unchanged — the hook keeps using it internally).
- [ ] A3. **RED**: write `src/hooks/use-hash-route.test.ts` covering: `""`/`"#"`/`"#/"` → home; `#/auth` → login; `#/auth?mode=signup` → signup; `#/auth/anything` → login (prefix rule); `#/auth?mode=login` → login; `#/nope` → not-found; hashless `"/auth?mode=signup"` (raw, no `#`) → auth/signup.
- [ ] A4. **RED**: write `src/lib/auth/demo-auth-service.test.ts` covering: signIn resolves `{ok:true,email}`; signUp throws `weak-password` for short / all-lower / no-digit passwords; signUp resolves for valid password; signInWithProvider resolves google email; requestPasswordReset resolves; simulated latency ≈ 900ms (tolerance-bounded).
- [ ] A5. **GREEN**: run suite — must pass against current code before refactors (guards behavior during the fixes below).

### Phase B — Auth seam typed error contract — fixes F-09 (strict TDD)

- [ ] B1. **RED**: extend A4 with a failing assertion: `signUp` rejects with a typed `AuthError` value (`"weak-password"`), not an opaque `Error` string-match.
- [ ] B2. **GREEN**: introduce `AuthServiceError` class (carries `code: AuthError`) in `src/lib/auth/types.ts` (type-only addition + one small runtime class; no adapter rewrites needed — `auth-view.tsx` switches from `error.message === "weak-password"` to `error instanceof AuthServiceError && error.code === "weak-password"`, mapping other codes to their documented copy per the `AuthError` union).
- [ ] B3. All A4/A5 + B1 tests green; lint/typecheck green.

### Phase C — Visual fidelity fixes (P1s) — each re-measured after fix

- [ ] C1. `hero.tsx`: H1 add `font-bold` (F-01); CTA `h-12`→`h-14` and add `shadow-xl shadow-foreground/10` (F-04).
- [ ] C2. `popular-events.tsx` / `features.tsx` / `testimonials.tsx` / `final-cta.tsx`: H2s add `font-bold` (F-02).
- [ ] C3. `event-card.tsx`: title `font-semibold`→`font-bold` (F-03).
- [ ] C4. `not-found-view.tsx`: rebuild to reference spec — `bg-muted` wrapper, `text-4xl font-bold` "404" (body font), `text-xl` message, pink underlined **anchor** "Return to Home", `data-testid="page-not-found"` + `not-found-home-link` (F-05). Server `not-found.tsx` shares the component automatically.
- [ ] C5. Verify via computed-style assertions vs reference: H1/H2/H3 weights 700, CTA 56px, 404 typography/metrics match.

### Phase D — Anchor-based navigation + a11y — fixes F-06, F-07, F-10

- [ ] D1. Convert user-facing CTAs to `<a href="#/…">` anchors with identical classes/behavior (hash router syncs via `hashchange`): navbar Log in + Sign up, hero Get started, events Browse all events, final CTA Get started for free, 404 Return to Home (from C4). Programmatic navigation (post-auth redirect) stays on `onNavigate`.
- [ ] D2. `auth-view.tsx`: add reference `data-testid`s (`login-form`, `login-email`, `login-password`, `login-submit`; signup equivalents) (F-07).
- [ ] D3. Wrap app motion in `MotionConfig reducedMotion="user"` (one provider in `page.tsx` around views) so framer choreography honors `prefers-reduced-motion` (F-10).
- [ ] D4. E2E re-run: anchor counts (≥6 `<a>` on landing), `#/auth?mode=signup` deep link still works, back/forward still works, flows still pass.

### Phase E — Dead-code & dependency pruning — fixes F-11

- [ ] E1. Delete the 46 unused `src/components/ui/*` files (keep `tabs.tsx`, `toast.tsx`, `toaster.tsx`) and `src/hooks/use-mobile.ts` (only consumer was the removed sidebar).
- [ ] E2. Remove unused deps from `package.json` (scan-verified list): `@dnd-kit/*`×3, `@mdxeditor/editor`, 24 unused `@radix-ui/*` packages (keep `react-tabs`, `react-toast`), `@reactuses/core`, `@tanstack/react-query`, `@tanstack/react-table`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-intl`, `next-themes`, `react-day-picker`, `react-markdown`, `react-resizable-panels`, `react-syntax-highlighter`, `recharts`, `sharp`, `sonner`, `uuid`, `vaul`, `zustand`.
- [ ] E3. Reinstall + rebuild following the AGENTS.md Turbopack gotcha sequence: stop dev server → `rm -rf .next` → install → restart. `src/app/api/route.ts` stays (documented in PAD §6.2).
- [ ] E4. `next.config.ts`: add `allowedDevOrigins` for the sandbox preview host pattern (F-12).

### Phase F — Full re-verification gate

- [ ] F1. `bun run lint` 0 problems; `tsc --noEmit` 0 errors; `vitest run` all green.
- [ ] F2. Production build succeeds; dev server healthy; live preview 200.
- [ ] F3. E2E suite re-run on live preview — all checks green including new assertions (anchor counts, CTA height, 404 structure).
- [ ] F4. Computed-style parity re-run vs `event-spark-2.lovable.app` — headings/CTA/404 now MATCH.
- [ ] F5. VLM pairwise screenshot review (hero/events/features/404/auth) for final visual confirmation.

### Phase G — Documentation re-baseline — fixes F-14

- [ ] G1. README: dependencies table pruned; "Test" added to quality gates; features table wording for nav semantics.
- [ ] G2. AGENTS.md: commands table + navigation contract section updated (anchors for user CTAs; `onNavigate` retained for programmatic navigation).
- [ ] G3. CLAUDE.md: testing strategy updated (Vitest wired; suites listed); conventions updated.
- [ ] G4. PAD: §1.2 stack, §3.2 directory tree, §5.3 primitives, §5.4 motion table, §6.4 dependency risk, §7 testing strategy + NEW verification ledger entry (this session's re-measurements), §10 known issues, §11 key files — all re-baselined to post-fix reality.

---

## 3. Risks & Safety

| Risk | Mitigation |
|------|------------|
| Dependency removal corrupts Turbopack cache (known incident class) | Follow AGENTS.md sequence: stop server → `rm -rf .next` → install → restart |
| Anchor conversion breaks history semantics | `parseHash` unit tests + E2E back/forward assertions (D4) |
| 404 rebuild regresses server-path 404 | Shared `NotFoundView` used by both routes; E2E checks both hash and server paths |
| Motion changes break reveal choreography | Visual E2E re-verification (F3/F5) |

## 4. Out of scope (deferred)

- Real auth backend (ADR-004 seam stays; explicitly documented)
- CI pipeline (PAD §8.4 recommendation stands)
- Playwright browser-automation in-repo (agent-browser scripts remain workspace tooling under gitignored `scripts/`)
