# Event Spark 2 — Remediation Plan (Round 1)

**Date:** 2026-09-14
**Trigger:** Session 2 E2E + visual-parity audit of the live deployment
**Inputs:** `scripts/e2e_live_tests.sh` (23 checks), `scripts/parity_check.sh` (computed-style assertions vs `event-spark-2.lovable.app`), full codebase review
**Baseline before remediation:** `bun run lint` clean · `tsc --noEmit` clean · E2E golden path 21/23 direct pass (2 were test-methodology artifacts, behavior verified manually)

**STATUS: COMPLETE (2026-09-14).** All phases A–G executed. Closing evidence: lint 0 problems · tsc 0 errors · Vitest 21/21 · live E2E 38/38 (suite extended with T16–T19 remediation assertions, selector artifacts fixed) · parity re-measured (H1/H2/H3 700, CTA 56px, 404 spec, 7 anchors = reference) · docs re-baselined to PAD v1.1.0. Residual findings deferred to the security-audit round: see `docs/SECURITY_AUDIT.md`.

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

- [x] A1. Add `vitest` devDependency; add `vitest.config.ts` (foundation convention: `@` alias, `environment: "node"`, `include: ["src/**/*.test.ts"]`); add `"test": "vitest run"` script.
- [x] A2. Export `parseHash` from `use-hash-route.ts` (testability refactor; behavior unchanged — the hook keeps using it internally).
- [x] A3. **RED**: write `src/hooks/use-hash-route.test.ts` covering: `""`/`"#"`/`"#/"` → home; `#/auth` → login; `#/auth?mode=signup` → signup; `#/auth/anything` → login (prefix rule); `#/auth?mode=login` → login; `#/nope` → not-found; hashless `"/auth?mode=signup"` (raw, no `#`) → auth/signup. *(Note: during implementation the subpath case was re-measured against the reference — `#/auth/anything` 404s on the reference too — so the test pins subpaths → not-found. The plan's "prefix rule" premise was wrong; reference parity won.)*
- [x] A4. **RED**: write `src/lib/auth/demo-auth-service.test.ts` covering: signIn resolves `{ok:true,email}`; signUp throws `weak-password` for short / all-lower / no-digit passwords; signUp resolves for valid password; signInWithProvider resolves google email; requestPasswordReset resolves; simulated latency ≈ 900ms (tolerance-bounded).
- [x] A5. **GREEN**: run suite — must pass against current code before refactors (guards behavior during the fixes below).

### Phase B — Auth seam typed error contract — fixes F-09 (strict TDD)

- [x] B1. **RED**: extend A4 with a failing assertion: `signUp` rejects with a typed `AuthError` value (`"weak-password"`), not an opaque `Error` string-match.
- [x] B2. **GREEN**: introduce `AuthServiceError` class (carries `code: AuthError`) in `src/lib/auth/types.ts` (type-only addition + one small runtime class; no adapter rewrites needed — `auth-view.tsx` switches from `error.message === "weak-password"` to `error instanceof AuthServiceError && error.code === "weak-password"`, mapping other codes to their documented copy per the `AuthError` union).
- [x] B3. All A4/A5 + B1 tests green; lint/typecheck green.

### Phase C — Visual fidelity fixes (P1s) — each re-measured after fix

- [x] C1. `hero.tsx`: H1 add `font-bold` (F-01); CTA `h-12`→`h-14` and add `shadow-xl shadow-foreground/10` (F-04).
- [x] C2. `popular-events.tsx` / `features.tsx` / `testimonials.tsx` / `final-cta.tsx`: H2s add `font-bold` (F-02).
- [x] C3. `event-card.tsx`: title `font-semibold`→`font-bold` (F-03).
- [x] C4. `not-found-view.tsx`: rebuild to reference spec — `bg-muted` wrapper, `text-4xl font-bold` "404" (body font), `text-xl` message, pink underlined **anchor** "Return to Home", `data-testid="page-not-found"` + `not-found-home-link` (F-05). Server `not-found.tsx` shares the component automatically.
- [x] C5. Verify via computed-style assertions vs reference: H1/H2/H3 weights 700, CTA 56px, 404 typography/metrics match. *(E2E T16.1–T16.5, T17.1–T17.5 all pass; parity script re-run confirms.)*

### Phase D — Anchor-based navigation + a11y — fixes F-06, F-07, F-10

- [x] D1. Convert user-facing CTAs to `<a href="#/…">` anchors with identical classes/behavior (hash router syncs via `hashchange`): navbar Log in + Sign up, hero Get started, events Browse all events, final CTA Get started for free, 404 Return to Home (from C4). Programmatic navigation (post-auth redirect) stays on `onNavigate`. *(Landing now carries 7 `#/` anchors = reference's 7.)*
- [x] D2. `auth-view.tsx`: add reference `data-testid`s (`login-form`, `login-email`, `login-password`, `login-submit`; signup equivalents) (F-07).
- [x] D3. Wrap app motion in `MotionConfig reducedMotion="user"` (one provider in `page.tsx` around views) so framer choreography honors `prefers-reduced-motion` (F-10).
- [x] D4. E2E re-run: anchor counts (≥6 `<a>` on landing), `#/auth?mode=signup` deep link still works, back/forward still works, flows still pass. *(E2E script updated: CTAs must be clicked as anchors — role=button finders silently miss them.)*

### Phase E — Dead-code & dependency pruning — fixes F-11

- [x] E1. Delete the 46 unused `src/components/ui/*` files (keep `tabs.tsx`, `toast.tsx`, `toaster.tsx`) and `src/hooks/use-mobile.ts` (only consumer was the removed sidebar).
- [x] E2. Remove unused deps from `package.json` (scan-verified list): `@dnd-kit/*`×3, `@mdxeditor/editor`, 24 unused `@radix-ui/*` packages (keep `react-tabs`, `react-toast`), `@reactuses/core`, `@tanstack/react-query`, `@tanstack/react-table`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-intl`, `next-themes`, `react-day-picker`, `react-markdown`, `react-resizable-panels`, `react-syntax-highlighter`, `recharts`, `sharp`, `sonner`, `uuid`, `vaul`, `zustand`.
- [x] E3. Reinstall + rebuild following the AGENTS.md Turbopack gotcha sequence: stop dev server → `rm -rf .next` → install → restart. `src/app/api/route.ts` stays (documented in PAD §6.2).
- [x] E4. `next.config.ts`: add `allowedDevOrigins` for the sandbox preview host pattern (F-12).

### Phase F — Full re-verification gate

- [x] F1. `bun run lint` 0 problems; `tsc --noEmit` 0 errors; `vitest run` all green. *(21/21.)*
- [x] F2. Production build succeeds; dev server healthy; live preview 200.
- [x] F3. E2E suite re-run on live preview — all checks green including new assertions (anchor counts, CTA height, 404 structure). *(38/38 after fixing two script-side artifacts: role=button selectors for anchor CTAs, and JSON-escaped eval results in T17 expectations.)*
- [x] F4. Computed-style parity re-run vs `event-spark-2.lovable.app` — headings/CTA/404 now MATCH. *(Remaining serializations differ only as oklab-vs-rgb / calc(infinity)-vs-9999px equivalents — documented in PAD §7.3b.)*
- [x] F5. VLM pairwise screenshot review (hero/events/features/404/auth) for final visual confirmation. *(Computed-style + E2E structural assertions used as the binding evidence; repo carries clone-vs-ref screenshot pairs at root.)*

### Phase G — Documentation re-baseline — fixes F-14

- [x] G1. README: dependencies table pruned; "Test" added to quality gates; features table wording for nav semantics.
- [x] G2. AGENTS.md: commands table + navigation contract section updated (anchors for user CTAs; `onNavigate` retained for programmatic navigation).
- [x] G3. CLAUDE.md: testing strategy updated (Vitest wired; suites listed); conventions updated.
- [x] G4. PAD: §1.2 stack, §3.2 directory tree, §5.3 primitives, §5.4 motion table, §6.4 dependency risk, §7 testing strategy + NEW verification ledger entry (this session's re-measurements), §10 known issues, §11 key files — all re-baselined to post-fix reality. *(PAD bumped to v1.1.0; ADR-007/ADR-008 added; §3.3 Pattern 1 snippet corrected to shipped code; §7.3b ledger added.)*

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

---

# Remediation Plan — Round 3 (Session 4 E2E + Parity Re-Audit)

**Date:** 2026-09-15
**Trigger:** Fresh browser E2E + computed-style parity audit of the local build against the live reference
**Inputs:** 51-check E2E suite (`scripts/e2e_local_tests.sh`, workspace tooling), computed-style parity script (`scripts/parity_check.sh`), full gate chain re-run
**Baseline before remediation:** `bun run lint` 0 problems · `tsc --noEmit` 0 errors · Vitest 21/21 · production build succeeds (with 1 warning) · E2E 49/51 (the 2 failures are the real findings below)
**Methodology:** my-pi-agent skills — `plan-writing` (plan structure), `tdd` (red → green at pre-agreed seams), `webapp-testing`/`e2e-testing-lessons` (browser E2E), `clone-app-pat-pro` (computed styles as ground truth), `verification-and-review-protocol` (Iron Law: evidence before claims)
**Test-infrastructure note (v1→v2):** the session-4 E2E suite fixed four test-methodology artifacts from the prior harness (documented so future sessions don't re-trip): evals are IIFE-wrapped (a shared eval lexical scope previously made `const` re-declarations throw and silently skip fills), redirect assertions use exact-URL matching (substring matching false-passed `#/auth?mode=signup` as "home"), the hero-CTA selector is scoped to the hero section (`querySelector('a[href=…]')` previously matched the 44px navbar Sign up first), and section-presence checks assert heading text rather than `aria-label` (the reference has no section labels; the clone's are an a11y enhancement).

## 5. Round 3 Findings Inventory

Severity: **P1** = visual-contract violation · **P2** = correctness/state bug · **P3** = hygiene/debt · **Info** = documentation drift.

| ID | Sev | Area | Finding | Evidence |
|----|-----|------|---------|----------|
| R3-01 | P1 | 404 typography | The 404 `h1` renders in **DM Sans** on the clone but in **Bricolage Grotesque** on the reference (the reference's global heading style applies the display face to bare `h1`s; the clone requires an explicit `font-display` class, which `not-found-view.tsx` omits). Size/weight (36px/700), muted band, pink underlined anchor, and testids all match. The session-2 record (F-05) mis-transcribed the reference face as "DM Sans, not display face" — the live reference computed style is the ground truth. | E2E T14.1 RED; `getComputedStyle` on both sites: REF h1 font-family `"Bricolage Grotesque"` vs CLONE `"DM Sans"`; REF body `DM Sans` (p element matches) |
| R3-02 | P2 | Router state sync | `AuthView` initializes its tab state from `initialMode` on mount only. A `hashchange` **within** the auth view (`#/auth?mode=signup` ↔ `#/auth` — back/forward, URL edit, or an external link) updates the route object but not the mounted component's tab: the URL says login while the Sign up tab stays displayed (and vice versa). History navigation within auth desyncs URL and UI. | E2E T13.2 RED (T13.1/T13.3 confirm the initial deep-link and return paths work); manual repro: `#/auth?mode=signup` → `location.hash='#/auth'` → tab stays SIGNUP |
| R3-03 | P3 | Build hygiene | `tailwind.config.ts` still imports the pruned `tailwindcss-animate` package → every production build emits `Warning: Module not found: Can't resolve 'tailwindcss-animate'`. The file also carries a stale Tailwind v3-style theme block + `darkMode`/`plugins` that contradict the v4 CSS-first architecture and AGENTS.md's description ("only carries content paths for tooling"). Not part of the CSS pipeline (`postcss.config.mjs` uses `@tailwindcss/postcss` only) — no rendered-style impact; it is dead config plus a warning. | `bun run build` output; `grep tailwindcss-animate` → only `tailwind.config.ts:2`; `postcss.config.mjs` |
| R3-04 | Info | Docs | `--primary` is documented as hex `#E4447C` (README ×2, PAD §5.2) but `hsl(340 75% 58%)` renders as `rgb(228 68 121)` = **`#E44479`** on both the reference and the clone (parity invariant holds — both sites paint the identical color; the docs transcription is off by 3 in the blue channel). | computed styles on both sites; manual HSL→RGB conversion |

**Not defects (validated, leave alone):** section `aria-label`s absent on features/final-cta — the reference has **no** section labels at all; the clone's labels on hero/events/testimonials are a documented a11y enhancement · landing hash-anchor count 7 vs reference 0 — the single-route contract requires hash anchors (documented deviation) · post-auth redirect lands on `$BASE/#/` (not bare `/`) — correct home route via the hash router · auth input radius `calc(infinity*1px)` vs `9999px` — documented known-equivalent serialization · the reference ignores `?mode=signup` entirely (Log in always default) — the clone's signup preselection is the documented deliberate enhancement (session-2 finding).

## 6. Round 3 Remediation ToDo (execution order)

### Phase A — RED baseline (TDD) — done
- [x] A1. E2E regression checks written and confirmed RED against the current code: T13.2 (auth mode sync), T14.1 (404 display face). Suite is 49/51 with exactly the two real findings failing.
- [x] A2. Gate chain baseline recorded: lint 0 · tsc 0 · 21/21 unit · build OK + 1 warning (R3-03).
- *TDD seam note:* per the repo's accepted testing strategy (SECURITY_AUDIT TST-01 — component-level tests are deliberately absent; browser E2E verifies UI behavior), the red → green loop for these two UI-behavior fixes runs at the E2E seam. The `parseHash` unit suite stays green throughout, guarding the routing contract (the R3-02 fix intentionally touches no routing logic).

### Phase B — Fix R3-02 (auth mode sync) — `src/app/page.tsx`
- [x] B1. Keyed the `AuthView` by the route-driven mode: `<AuthView key={route.mode} initialMode={route.mode} onNavigate={navigate} />` (plus an explanatory shell doc-comment). A mode change via `hashchange` now remounts the view with the correct tab; tab clicks inside the view still change only local state.
- [x] B2. GREEN: E2E T13.1–T13.3 all pass; history assertions (T9.x) unchanged.
- [x] B3. Unit suite still 21/21 (no router-contract change).

### Phase C — Fix R3-01 (404 display face) — `src/components/shared/not-found-view.tsx`
- [x] C1. Added `font-display` to the 404 `h1` (doc-comment updated to the display-face fact).
- [x] C2. GREEN: E2E T14.1 passes; T14.2 (36px/700) unchanged; parity re-run — 404 h1 font family now Bricolage on both sites.
- [x] C3. Visual regression sweep clean: muted band, message, home link computed styles unchanged.

### Phase D — Fix R3-03 (stale Tailwind config) — `tailwind.config.ts`
- [x] D1. Reduced the file to content-paths-only (dropped the `tailwindcss-animate` import, `darkMode`, the v3 theme block, `plugins`); content globs corrected to the real `src/**` locations; doc-comment states the file is tooling-only.
- [x] D2. Clean rebuild after `rm -rf .next`: **zero warnings**; routes unchanged (`/`, `/_not-found`, `/api`).
- [x] D3. Computed-style spot-checks unchanged (E2E T10.x + parity script re-run on the restarted dev server).

### Phase E — Documentation re-baseline (fixes R3-04 + the R3-01/R3-02 doc claims)
- [x] E1. README: `#E4447C` → `#E44479` (both occurrences).
- [x] E2. PAD bumped to **v1.1.3**: revision block; §5.2 hex correction; ADR-002 consequence now documents the mode-keyed remount; §3.2 404 description; §7.3d verification ledger; §11 line counts.
- [x] E3. CLAUDE.md: golden-path E2E description updated to the 51-check suite with the two new regression invariants.
- [x] E4. AGENTS.md: architecture fact #1 notes the `AuthView` key; the Tailwind convention entry now states the config is tooling-only; the font convention entry documents the bare-heading parity gotcha.
- [x] E5. This Round 3 section closed with evidence (this update).

### Phase F — Full re-verification gate
- [x] F1. `bun run lint` 0 problems; `tsc --noEmit` 0 errors; `vitest run` 21/21.
- [x] F2. Production build: succeeds with **zero warnings**; dev server healthy (200 on :3000).
- [x] F3. E2E suite: **51/51 PASS, twice consecutively** (deterministic).
- [x] F4. Parity script: all audited invariants match the reference, including the 404 display face.

**STATUS: COMPLETE (2026-09-15).** Closing evidence in PAD §7.3d.

## 7. Round 3 Risks & Safety

| Risk | Mitigation |
|------|------------|
| AuthView remount resets in-progress form state on mode-keyed hashchange | Acceptable and correct: it is a navigation event; the post-auth redirect and tab clicks are unaffected (tab clicks change local state only, no remount) |
| `font-display` on 404 h1 changes layout metrics | Weight/size pinned by E2E T14.2; the display face is same-size (36px) — verified by parity re-run |
| Trimming tailwind.config.ts breaks IDE tooling or the build | The config is tooling-only (not in the PostCSS pipeline); build + computed-style checks are the guard; content paths preserved |

## 8. Round 3 Out of scope (deferred)

- Two-way URL sync for tab clicks (updating the hash when the user clicks tabs) — enhancement, not a defect; the reference's tabs never touch the URL either.
- CI pipeline (PAD §8.4 recommendation stands).

---

# Remediation Plan — Round 4 (Session 4 Deep Re-Audit)

**Date:** 2026-09-15
**Trigger:** Tiered code review + security audit (Session-4 deep re-audit — `docs/SECURITY_AUDIT.md` §8)
**Baseline:** lint 0 · tsc 0 · Vitest 21/21 · build zero warnings · E2E 51/51 · supply chain 0 vulnerabilities
**Methodology:** my-pi-agent skills — `code-review-and-audit` (deep mode + native CLI fallback), `tdd` (red → green; seams discipline), `verification-and-review-protocol` (Iron Law), `plan-writing`.

## 9. Round 4 Findings (from SECURITY_AUDIT §8.2)

| ID | Sev | Area | Finding |
|----|-----|------|---------|
| AUD-05 | S3 | Error handling | `onReset` / `onGoogle` in `auth-view.tsx` lack failure handling — an adapter rejection becomes an unhandled promise rejection (no toast). Violates the documented async-state + AuthError-mapping contracts; dormant with the demo adapter, user-facing at the ADR-004 real-backend swap point |
| AUD-01 | S4 | Docs | PAD §7.1 + README still reference the retired 38-check E2E suite |
| AUD-02 | S4 | Docs | Stale stack versions in README + PAD §1.2 vs the lockfile (framer-motion, react-hook-form, zod, @hookform/resolvers) |
| AUD-03 | S4 | Docs | PAD §3.3 Pattern 2 snippet omits the v1.1.3 `key={route.mode}` |

## 10. Round 4 ToDo (execution order)

### Phase A — TDD seam analysis (done, documented)
- [x] A1. **Seam decision for AUD-05:** the failure paths are unreachable in the shipped product — the demo adapter's `requestPasswordReset`/`signInWithProvider` always resolve (anti-enumeration/demo determinism), and zod pre-validates the signup policy client-side. Component-test infrastructure is deliberately absent (SECURITY_AUDIT TST-01, accepted). Therefore the red → green loop for AUD-05 runs against the documented contract (CLAUDE.md "network → retryable toast"; the `AuthError` union), implemented as the same inline pattern `onLogin`/`onSignUp` already establish, with regression verification via the full gate chain + E2E 51/51 (happy paths must not change). The coverage limitation (failure paths untestable without either a rejected demo contract or component-test infra) is registered as an explicit residual in the audit doc — not silently claimed as covered.

### Phase B — Fix AUD-05 — `src/components/auth/auth-view.tsx`
- [x] B1. `onReset`: adapter call wrapped in try/catch — `network` → retryable "Connection problem" toast; other failures → reset-failure toast; success path unchanged.
- [x] B2. `onGoogle`: catch block added before the existing finally — same typed mapping; success path unchanged.
- [x] B3. Gates green: lint 0 · tsc 0 · 21/21; E2E 51/51 (reset T5b.1–3 + Google T5c.1–2 all pass).

### Phase C — Docs alignment (AUD-01/02/03)
- [x] C1. PAD §7.1 → 51 checks + current script name; §1.2 versions re-aligned to lockfile resolutions (marked "(resolved)"); §3.3 Pattern 2 snippet includes `key={route.mode}`; §11 auth-view line count updated; companion-docs line references rounds 1–4.
- [x] C2. README: "51-check"; stack table versions corrected (framer-motion 12.43, RHF 7.88, zod 4.6).
- [x] C3. PAD bumped to **v1.1.4** (revision block + §7.3e ledger).

### Phase D — Verification gate
- [x] D1. lint 0 · tsc 0 · Vitest 21/21 · production build zero warnings (re-verified post-fix).
- [x] D2. E2E 51/51; reset + Google flows green.
- [x] D3. SECURITY_AUDIT §8 closed with the Round 4 execution note.

**STATUS: COMPLETE (2026-09-15).** Closing evidence in PAD §7.3e.

## 11. Round 4 Risks & Safety

| Risk | Mitigation |
|------|------------|
| New catch blocks swallow errors silently | Both catches surface user-facing toasts; no empty catch; typed branch mirrors the documented AuthError contract |
| Toast copy drift vs reference | Failure copy is clone-side UX (the reference has no reachable failure states); wording mirrors the existing onLogin/onSignUp copy family |
| Docs version edits go stale again | §1.2 now says "resolved at lockfile" to signal they track `bun.lock` |

## 12. Round 4 Out of scope (deferred)

- Component-test infrastructure (jsdom + @testing-library) for behavioral view tests — would revisit the accepted TST-01 decision; flagged as a future option if the auth seam grows.
- Real backend adapter (ADR-004 swap point stands).
