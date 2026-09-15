# Event Spark 2 — Layered Code Review & Security Audit

**Date:** 2026-09-14
**Methodology:** Foundation skills catalog — `code-review-and-audit` (5-phase tiered pipeline), `security-and-hardening` (three-tier boundary system, OWASP Top 10), `code-review-checklist` (12-category scan), `verification-and-review-protocol` (evidence before claims).
**Scope:** Full `src/` + `public/` + build config + dependency graph + tracked files. `skills/`, `foundation/`, `scripts/`, `recon/` (workspace-only, gitignored) excluded per task constraints.
**Target release claim under test:** *"the codebase conforms to its documented contracts (AGENTS/CLAUDE/README/PAD) and is safe to release."*

---

## 1. Verdict

**Contract conformance: PASS.** Every behavioral claim in AGENTS.md, CLAUDE.md, README.md, and PAD v1.1.0 was verified against the code (evidence in §3). The layer model holds, the typed seams hold, no dead code, no hygiene violations.

**Safe to release: FAIL as-is → PASS after Round 2 remediation.** One critical supply-chain finding (SEC-01: 34 advisories on `next@16.1.3`, including two unauthenticated RCEs) blocks the release claim. All remediation items are dependency/config-level (no application-logic defects were found); they were executed in Round 2 (§5) and re-verified through the full gate chain.

---

## 2. Findings Inventory

Severity: **S1 Critical** (release blocker) · **S2 High** · **S3 Moderate** · **S4 Low/informational**.

| ID | Sev | Category | Finding | Evidence |
|----|-----|----------|---------|----------|
| SEC-01 | S1 | Supply chain | `next@16.1.3` carries 34 published advisories. Two are **unauthenticated RCE** fixed only in 16.3.3: GHSA-p293-qw3h-jr36 (Windows-hosted servers) and GHSA-2xp9-vwfh-vxw4 (Image Optimization API + AVIF). The tail includes DoS (Server Components/Actions, Image API), SSRF (rewrites, Server Actions, WebSocket upgrades), cache poisoning, middleware/proxy bypasses, and CSRF bypass (fixed through 16.2.11). | `npm audit --json` against the dependency set; `bun.lock` line: `"next": ["next@16.1.3", …]`; advisory URLs in the audit output (github.com/advisories/GHSA-…) |
| SEC-02 | S2 | Supply chain | `sharp@0.34.5` (transitive optionalDependency of next) — inherited libvips CVE-2026-33327/-33328/-35590/-35591 and libheif GHSA-g89c-p67h-r497, GHSA-2jg2-4ch7-h545; fixed in 0.35.4. **Context:** the app renders plain `<img>` (no `next/image`, no image optimizer invocation, no AVIF assets) — practical exploitability negligible, but the package is installed, so it fails the hygiene bar. | `bun.lock` (`"sharp": ["sharp@0.34.5", …]` under next's optionalDependencies); `npm audit` |
| SEC-03 | S3 | Supply chain | `postcss` ≤8.5.22 (build-time, via next pin 8.4.31 + `@tailwindcss/postcss`) — 4 advisories (XSS via unescaped `</style>` in stringify output; arbitrary file read / path traversal via attacker-controlled `sourceMappingURL`). **Context:** the app's CSS is developer-authored at build time — no attacker-controlled CSS input exists — so practical exploitability is negligible. Fixed in 8.5.23+. | `npm audit` (GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-fxqj-rqcc-2cmp, GHSA-r28c-9q8g-f849) |
| SEC-04 | S4 | Supply chain (dev-only) | Build/lint-chain transitive advisories: `browserslist`, `minimatch`, `brace-expansion`, `nanoid`, `js-yaml`, `picomatch`, `flatted`, `ajv`, `@humanfs/node`, `baseline-browser-mapping`. All live in the ESLint/PostCSS toolchain; none ship in the standalone production artifact. | `npm audit --json` (all `isDirect: false`, reachable via eslint-config-next / tailwind tooling) |
| SEC-05 | S4 | Hardening | No baseline security headers at the app level (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). PAD §6.4 currently defers all header policy to the edge. A conservative static set is cheap and safe for a pure content site. CSP deliberately **not** added (framer-motion/Tailwind inline styles would require `unsafe-inline`; documented as an edge-level task). | `next.config.ts` — no `headers()` key |
| QLY-01 | — | Quality | **No application-logic defects found.** Static gates clean; layer model holds (no `@/app/` imports outside `app/`, no sideways view imports); zero `any`/`@ts-ignore`/`eslint-disable`; zero `console.log`/TODO/FIXME; no `window.location` usage in sections (navigation contract honored); all remaining `ui/` primitives are consumed. | `rg` scans in §3; `bun run lint`; `bun run typecheck` |
| TST-01 | S4 | Coverage | Unit coverage exists for the two seams with logic (`parseHash`, demo auth adapter — 21 tests). Component-level tests absent (static marketing components; motion/choreography verified via the 38-check live E2E instead). Accepted: component tests would assert Tailwind classes, not behavior. | `vitest run`; `scripts/e2e_live_tests.sh` |

**Clean scans (no findings):** secrets in tracked files (only test fixtures like `password: "Password1"` — not credentials) · `dangerouslySetInnerHTML` / `eval` / `new Function` / `javascript:` URIs · `target="_blank"` without rel · external `href`s in `src/` · SQL (no DB) · env vars (none) · gitignored workspace dirs not tracked (verified `git ls-files`).

---

## 3. Contract Conformance Evidence (docs ↔ code)

| Documented claim | Source | Verification |
|---|---|---|
| Single App Router route; hash router switches home/auth/404 | AGENTS.md #1 | `src/app/page.tsx` is the only page route; `rg 'page.tsx' src/app/` → 1 |
| Server 404 and hash 404 share one component | AGENTS.md #2 | `not-found.tsx` renders `NotFoundView`; E2E T17/T18 pass on both paths |
| User CTAs are `#/…` anchors; `onNavigate` only for programmatic nav | AGENTS.md #3 | `navbar.tsx` L44–75, `hero.tsx`, `popular-events.tsx`, `final-cta.tsx`, `not-found-view.tsx` L22–28 — all `<a href>`; live DOM: 7 `#/` anchors = reference's 7 |
| Content is typed data | AGENTS.md #4 | `src/data/*.ts` readonly arrays; no inline content found |
| Auth seam + `AuthServiceError` typed carrier | AGENTS.md #5 | `types.ts` L22–32 (class + `AuthError` union); `auth-view.tsx` branches on `error.code`; 10 adapter tests green |
| Tokens are measured (H1/H2/H3 700, CTA 56px, 404 spec) | PAD §5 | Live computed-style assertions (E2E T16/T17) + parity script re-run — all match reference |
| Tests: lint → typecheck → test gates | CLAUDE.md | All three exit clean; 21/21 unit tests |
| No dead code / no unused deps | CLAUDE.md, PAD §6.4 | 14 runtime deps all referenced; 3 `ui/` components all consumed (import scan §L3.6) |
| Reduced-motion: Lenis + MotionConfig + once-only reveals | PAD §5.4 | `smooth-scroll.tsx` gate; `page.tsx` L50 `MotionConfig reducedMotion="user"`; `scroll-reveal.tsx` `once: true` |
| Zero console errors | CLAUDE.md | E2E T12: 0 errors after full scroll + interaction sweep |
| Standalone build, no env vars, robots + metadata | README, PAD §8 | `next build` succeeds (Round 2 re-verified); `layout.tsx` metadata; `public/robots.txt` |

---

## 4. Round 2 Remediation Plan (fix backlog)

| ID | Fixes | Action | Verification |
|----|-------|--------|--------------|
| R2-1 | SEC-01 | Bump `next` 16.1.3 → 16.3.5 (latest stable, ≥16.3.3) and `eslint-config-next` to match | Full gate chain: lint, tsc, vitest, production build, dev-server health, 38-check live E2E, computed-style parity spot-check |
| R2-2 | SEC-02 | Add package `overrides` pinning `sharp` to `^0.35.4` | `bun.lock` re-resolves sharp ≥0.35.4; re-audit shows the advisory cleared |
| R2-3 | SEC-03 | Add package `overrides` pinning `postcss` to `^8.5.23` | Build succeeds (developer CSS pipeline intact); re-audit cleared |
| R2-4 | SEC-04 | `bun update` within existing ranges to pull patched transitive toolchain versions | Re-audit; dev-only advisories cleared or reduced |
| R2-5 | SEC-05 | Add conservative static security headers via `next.config.ts` `headers()` (nosniff, frame deny, referrer policy, permissions policy — no CSP, documented) | Build + E2E green; headers observed in HTTP response |
| R2-6 | — | Re-baseline PAD §1.2 (next version), §6.4 (threat model), new §7.3c verification ledger; README stack table | Doc-contract spot re-check |

No application-code changes are required — consistent with QLY-01 (zero application-logic defects). TDD note: dependency/config changes have no unit-test seam; their test is the full verification gate (§5 records the executed evidence).

---

## 5. Round 2 Execution Record

*(Statuses updated after execution — see the PAD §7.3c ledger for the closing gate evidence.)*

| ID | Status | Result |
|----|--------|--------|
| R2-1 | Executed | `next` + `eslint-config-next` bumped to 16.3.5; full gate chain green (see PAD §7.3c) |
| R2-2 | Executed | `sharp` overridden to 0.35.4; advisory cleared |
| R2-3 | Executed | `postcss` overridden to 8.5.28; advisory cleared |
| R2-4 | Executed | Transitive toolchain updated within ranges; re-audit clean of high/critical |
| R2-5 | Executed | Security headers active; E2E 38/38 |
| R2-6 | Executed | PAD v1.1.1 re-baseline committed with the Round 2 ledger |

---

## 6. Residual Risk Register (post-Round 2)

| Risk | Severity | Disposition |
|------|----------|-------------|
| Dev-only toolchain advisories that remain within semver-unreachable ranges | Low | Monitor; upgrade devDependencies on the next maintenance pass |
| No CSP at the app level | Low (edge concern) | Documented (PAD §6.4): add CSP/frame-ancestors at the edge when deployed; app has no user-generated content or injection sinks |
| Demo auth accepts any well-formed credentials | By design | Disclosed in UI toast; ADR-004 swap point for a real backend |
| No CI pipeline | Low | Manual gate chain documented in PAD §7.4; §8.4 recommendation stands |

---

## 7. Session-3 Re-Audit Addendum (2026-09-14, PAD v1.1.2)

The dependency tree was re-verified after the `bun.lock` re-sync (root ranges
realigned with the committed `package.json`; see PAD v1.1.2 revision block).

| Check | Result |
| --- | --- |
| `next` resolved version (lockfile) | 16.3.5 — above the 16.3.3 unauth-RCE floor (SEC-01 stays cleared) |
| `sharp` resolved version (lockfile) | 0.35.4 via `overrides` (SEC-02 stays cleared) |
| `postcss` resolved version (lockfile) | 8.5.28 via `overrides` (SEC-03 stays cleared) |
| `npm audit` at fresh range resolution | **0 critical / 0 high / 0 total** (the previously registered 8 dev-only advisories clear at current resolution) |
| Exact-lockfile dev-chain pins (picomatch 2.x, minimatch 3.x, brace-expansion 1.x, …) | Unchanged dev/lint-time-only residual — not present in the standalone production artifact; accepted per §6 |
| Security headers on the deployed preview | All four observed live (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) |
| Live E2E after the lockfile refresh | 38/38 (harness tooling repaired — see PAD v1.1.2; zero application-code changes) |

**Verdict: release claim holds on the refreshed dependency tree.** No new findings;
all S1/S2 findings remain remediated; the residual register above is unchanged in
substance (first row improved at fresh resolution).

---

## 8. Session-4 Deep Re-Audit Addendum (2026-09-15, PAD v1.1.3)

**Methodology:** `my-pi-agent` skills catalog — `code-review-and-audit` (deep mode:
5-phase tiered pipeline with native CLI fallback where the runner's scripts are
absent), `code-review-checklist` (12-category tactical scan), `security-and-hardening`
(OWASP + npm-audit triage), `verification-and-review-protocol` (Iron Law).
**Target release claim under test:** *"the codebase matches its documented contracts
(AGENTS/CLAUDE/README/PAD) and is safe to ship."*

### 8.1 Tiered Pipeline Execution Record

| Phase | Tool | Result |
|-------|------|--------|
| 1 — Static analysis | `audit_runner.py` scripts absent → native fallback: `bun run lint` + `bun run typecheck` | 0 problems / 0 errors |
| 2 — Security scan | native fallback: fresh-resolution `npm audit` (temporary lockfile), secret-pattern grep over tracked files, dangerous-pattern scan (`eval`, `innerHTML`, `dangerouslySetInnerHTML`, `javascript:` URIs, `child_process`), navigation-contract scan, live header probe, key-material audit | **0 vulnerabilities total** (0 critical/high/moderate/low) · no secrets (test-fixture passwords only) · no dangerous patterns · no `window.location` in sections · all 4 baseline headers live · no key material tracked (the SSH-push doc carries a redacted placeholder only) |
| 3 — Code quality (12-category) | `checklist_runner.py` | 80 raw findings → **all false positives or trivial**: 6 "hardcoded credential" criticals are deterministic test fixtures (documented §2); 60 "PascalCase const" mediums are camelCase misreads (`const result`, `const start`); 1 "unclear CAPS comment" is Next.js-generated `next-env.d.ts`; 1 "null return" is the idiomatic `FieldError` early return |
| 4 — Test coverage | native fallback: `bun run test` | 21/21 (parseHash 11 + demo adapter 10) |
| 5 — Performance | Lighthouse unavailable in sandbox; navigation-timing snapshot on the dev server instead | DCL 142ms · load 451ms · 50 resources (dev-mode; production profiling stays a deploy-time task — consistent with prior rounds) |
| 6 — Expert review | Manual tiered review + docs-contract conformance matrix | Findings below |

### 8.2 Findings (severity-ranked)

| ID | Sev | Category | Finding | Evidence | Confidence |
|----|-----|----------|---------|----------|------------|
| AUD-05 | S3 | Error handling / contract | `auth-view.tsx` `onReset` and `onGoogle` have **no failure path**: an adapter rejection (e.g. a real backend throwing `AuthServiceError("network")`) becomes an unhandled promise rejection — no toast, no field error, no user feedback. Violates the documented contracts (CLAUDE.md: "Handle every async state: loading, error, success" and "network → retryable toast copy"; the `AuthError` union includes `network` precisely for this). Dormant with the demo adapter (reset/provider always resolve) — becomes user-facing at the ADR-004 swap point. | `auth-view.tsx` L203–222 vs onLogin/onSignUp (both catch + map typed codes) | Verified (code inspection; both paths) |
| AUD-01 | S4 | Docs contract | PAD §7.1 test-distribution table still lists the retired 38-check E2E suite and the old workspace script name; README "Verified quality" row still says "38-check" | PAD L461, README L28 vs the v1.1.3 51-check suite (§7.3d) | Verified |
| AUD-02 | S4 | Docs contract | Stale stack versions vs the lockfile: README + PAD §1.2 say framer-motion 12.23/12.23.2 (resolved **12.43.0**), react-hook-form 7.60 (**7.88.0**), zod 4.0 (**4.6.5**), @hookform/resolvers 5.1 (**5.9.1**) | `bun.lock` resolutions | Verified |
| AUD-03 | S4 | Docs contract | PAD §3.3 Pattern 2 (shell snippet) omits the v1.1.3 `key={route.mode}` on `AuthView` — repo convention is snippets mirror shipped code | PAD L293–313 vs `page.tsx` L53–59 | Verified |
| AUD-04 | S4 | Tooling | The skill's checklist scanner heuristics (PascalCase const, credential regex) produce false positives on this codebase — documented so future runs don't re-trip | §8.1 Phase 3 | Verified |

**Clean scans (no findings):** supply chain (0 vulnerabilities at fresh resolution;
`next@16.3.5`, `sharp@0.35.4`, `postcss@8.5.28` overrides re-verified in the lockfile) ·
secrets · injection surfaces · layer model (`@/app/` imports only inside `app/`; no
sideways view imports) · TS strictness (zero `any`/`@ts-ignore`/`eslint-disable`) ·
navigation contract (anchors + `onNavigate`) · dead code (all 14 runtime deps
referenced; all 3 `ui/` primitives consumed) · unit gates 21/21 · live E2E 51/51 ·
production build zero warnings · `/api` responds as documented.

### 8.3 Contract Conformance Verdict (docs ↔ code)

**PASS.** Every behavioral claim in AGENTS.md, CLAUDE.md, README.md, and PAD v1.1.3
was re-verified against the code after the Round-3 remediation: the six architecture
facts, the navigation contract, the auth seam and typed-error carrier, the light-only
brand, the measured tokens (incl. the corrected `#E44479` and the 404 display face),
the layer model, the Tailwind v4 CSS-first setup (`tailwind.config.ts` now genuinely
content-paths-only), the reduced-motion gates (Lenis + `MotionConfig`), the 21-test
unit suites, and the 51-check E2E invariants. The remaining deltas are documentation
drift (AUD-01..03) and one latent error-handling gap (AUD-05) — remediated in Round 4
below. Safe-to-ship claim **holds** after Round 4.

### 8.4 Round 4 Remediation Record (executed 2026-09-15)

| ID | Status | Result |
|----|--------|--------|
| AUD-05 | Executed | `onReset` + `onGoogle` now carry typed failure handling (`network` → retryable toast; other → flow-specific failure toast); gates green; E2E 51/51 (happy paths unchanged). Coverage limitation registered: failure paths are unreachable with the deterministic demo adapter, so the guard is contract-verified and regression-verified — not failure-path-executed (component-test infra deliberately absent per TST-01). |
| AUD-01 | Executed | PAD §7.1 + README updated to the 51-check suite |
| AUD-02 | Executed | README + PAD §1.2 stack versions re-aligned to lockfile resolutions |
| AUD-03 | Executed | PAD §3.3 Pattern 2 snippet mirrors the shipped shell (incl. `key={route.mode}`) |
| AUD-04 | Documented | Scanner false-positive heuristics on this codebase (no action) |

Closing evidence: PAD v1.1.4 §7.3e (lint 0 · tsc 0 · Vitest 21/21 · E2E 51/51 ·
build zero warnings · supply chain 0 vulnerabilities · headers live).
**Verdict: safe-to-ship claim holds.**
