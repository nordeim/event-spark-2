I've read the full 733-line document. It defines a coding-specialist operating mode (Generation/Debugging/Audit/Refactor modes, decision priority hierarchy, evidence-based verification, security discipline) and ends with a concrete task: build a production-grade clone of `event-spark-2.lovable.app` on the `home-financing` codebase foundation, push to `nordeim/event-spark-2.git`, then generate four project docs (AGENTS.md, CLAUDE.md, README.md, Project_Architecture_Document.md) and push again.

This is a **Type 3 (Interactive Web Development)** task. Let me initialize properly and survey the environment.
The fullstack-dev skill is loaded. The workspace has no project scaffold yet — I need to run the init script first, then bring in the foundation repo. Let me set up the task plan and initialize.
Environment initialized. Now let me clone the foundation repo and inspect the scaffold.
Foundation repo cloned (2,545 files). Let me study its structure and skills catalog.
The foundation is itself a **Next.js 16 + React 19 + TS + Tailwind 4** app with Drizzle/PostgreSQL, Playwright + Vitest, and a 241-skill library — an excellent architectural match for the sandbox stack. Let me study its conventions and skills catalog.
A `clone-app-pat-pro` skill exists in the foundation — purpose-built for cloning web apps from URLs. Let me read it, along with the agent-browser skill for recon.
The clone-app-pat-pro skill's methodology (recon every view → computed styles as ground truth → design spec → build → QA style assertions) is exactly what I need; its Chrome-extension tooling doesn't exist here, so I'll drive the recon with my own agent-browser. Let me load it.
Now let me start the recon of the target site.
Browser is live on the target. Title: "Event Spark - Your event platform template". Let me capture the full accessibility tree and a screenshot.
Home page recon captured. Now let me extract the design tokens (computed styles = ground truth) and explore the linked pages.
Primary is HSL(340 75% 58%) — a magenta-pink on near-white background, DM Sans typography, Lenis smooth scrolling, light mode. Let me extract deeper element styles and explore the other routes.
Now let me explore the linked routes — "Browse all events", "Log in", "Sign up" — to map every view.
The "Browse all events" CTA leads to `/auth` — a login wall with tabs (Log in / Sign up) and Google OAuth. Let me inspect the Sign up tab and the desktop layout's right panel.
All assets identified and downloadable. Let me extract the hero's structure, pink-accent usage, and section metrics, then download the assets.
Key discovery: the pink (#E4447C) accent appears in the eyebrow badge (pulsing dot), an **animated rotating word in the H1** ("connections." ↔ "experiences."), the browse link, and the final pink CTA. Let me confirm the word rotation and capture remaining structural details.
Confirmed: the H1 cycles through 3 words ("connections." / "experiences." / "events."). Nav is fixed with blur; container max-w-7xl. Now let me check remaining routes and download all assets for the clone.
The app is a two-view template: landing page + auth, with a 404 catch-all. Let me verify and capture the 404 and mobile views.
Mobile nav is compact (no hamburger), category strip hidden on mobile. Now let me download all assets for local hosting in the clone.
All assets secured except the Mailchimp logo — let me retry it, then run visual analysis on the screenshots.
Now let me visually analyze the screenshots with the VLM skill to nail the design details.
VLM 提供了不错的整体氛围。现在让我从实际 DOM 中提取精确的 HTML（计算出的基准数据）—— 事件卡片、功能块、客户证言。
The features section has scroll-reveal animations, pink blur decorations, and a dark preview card. Let me pull the complete section HTML in chunks.
Full features section mapped. Now the remaining sections — hero strip, events, testimonials, CTA, and auth page details.
Recon complete — I have the full design system extracted from computed styles. Let me record the worklog and design spec, then check the scaffold before building.
Scaffold has framer-motion, lucide, sonner — everything needed. A few final recon details for pixel fidelity (CTA card, footer, hero wrapper, testimonial text), then I'll build.
All recon data captured. Now building. First: assets into `public/`, check the dev server, and install lenis (the smooth-scroll lib the target uses).
Lenis installed. Let me persist the design spec, then write all source files.
Now the design system foundation — globals.css with the extracted tokens:
Now the typed data layer (foundation convention: `src/data/`):
Now the auth service abstraction (typed seam for a real backend):
Now the hash-router hook and the app shell (single-route SPA per sandbox constraint):
Now the shared components — Logo, SmoothScroll (Lenis), ScrollReveal:
Now the navbar with hide-on-scroll behavior:
Now the hero — confetti, floating category cards, rotating headline word, and CTA:
Let me clean up the hero file — unused import and awkward glyph structure:
Now the events section and event card:
Now the features section with its four mock illustrations:
Testimonials, final CTA, and footer:
Now the auth view with full form validation, loading states, and password reset flow:
Now the 404 view and the main app shell (page.tsx):
Now the main app shell — `page.tsx` with the view router:
All source files written. Let me lint and check the dev server.
Lint is scanning the cloned `foundation/` dir — I need to scope it to the app. Let me check the ESLint config and fix.
Lint is clean. Now type-check and watch the dev server:
TypeScript is also scanning the foundation clone. Let me scope `tsconfig.json`:
The events.ts file didn't persist. Let me rewrite it and fix the framer-motion typing:
Types pass, server compiles. Now the mandatory browser verification — full end-to-end interaction testing:
The clone renders with identical structure. Let me screenshot and compare against the target side-by-side:
Tokens verified — exact match (#e44479, #19192e, #fafafa, Bricolage Grotesque, DM Sans). Now the golden-path interaction tests — auth flow:
Validation and signup flow work end-to-end. Let me verify the toast, login flow, forgot-password, and 404:
Login toast and reset flow verified. Now the 404 route, console errors, and mobile:
404 works, zero console errors. Let me test the server-level 404 and take a mobile interaction pass:
Both 404 levels and mobile layout pass. Now the rigorous QA gate — computed-style assertions on key elements vs the target:
All computed-style assertions match the target exactly (CTA rgb(25,25,46) px-36, event card 24px radius h-358, feature card 32px radius, pink CTA rgb(228,68,121)). Now the visual eyeball comparison via VLM:
Key insight: the "missing sections" are the scroll-reveal animations in their pre-trigger state (opacity: 0 below fold) — same as the target's DOM. Let me verify reveals fire on scroll, and cross-check the hero's vertical rhythm against the target:
The target hero fills the viewport with vertically centered content (`min-h-[620px] flex` wrapper). Let me get the exact structure:
Found the real structural difference: the target hero centers content in a `min-h-[620px]` flex wrapper inside a full-width container, with confetti and floating cards anchored to the viewport edges — mine anchored them to the narrow text column. Let me fix the hero structure:
Hero now matches (844px height, h1 at 283px, cards at viewport edges). Final visual comparison:
VLM full-page stitching is unreliable with fixed nav + reveal timing. The DOM is ground truth — let me verify all sections objectively and capture viewport-accurate screenshots:
All 6 sections present (Hero 844, Events 859, Features 1531, Testimonials 750, CTA 769, Footer 139). Let me capture user-view screenshots at each scroll position and montage them for the final visual gate:
That comparison was invalid — I only sent clone images, so the VLM hallucinated the reference. Let me do it properly: capture the target at identical viewport positions and compare pairs:
Two real leads: the target nav may start hidden, and my screenshot capture positions drifted (wrong sections). Let me verify the target's nav behavior precisely:
The target nav is *always* hidden (translateY(-100px) in every state) — let me confirm at scroll-top before finalizing:
Confirmed — the target nav is permanently tucked (a template quirk), and its 404 has no navbar. Let me replicate both behaviors faithfully:
Now fix the 404 view to match the target (no navbar, centered):
Re-capture the clone at the target-matching scroll positions and run the final fair comparison:
Contradictory signals — the target nav measured always-hidden, yet its screenshots show a nav. Let me resolve this definitively:
The plots thicken — mouse-wheel vs scrollTo produce different nav states (Lenis interception). Let me test with the actual wheel mechanism, measuring state and screenshot together:
Target nav behavior decoded: hidden on load → reveals on first wheel/touch scroll → stays visible. Let me replicate that, then measure the hero cards on both sites to settle the positioning question:
The H1 variance is the rotating word changing line count (expected). The card offset is real — the floating cards likely live inside the content container, not the absolute wrapper. Let me verify the parent chain:
Definitive structure found: floating cards live INSIDE the `min-h-[620px] flex` wrapper (not the viewport-wide decorations layer). Restructuring the hero to match exactly:
Card positions now match exactly (top:119, left:-13 — identical to target). Final capture round and comparison:
The scroll captures fought Lenis (native `scrollTo` vs its internal animation), leaving captures at wrong offsets. Let me recapture using wheel scrolls (same as the target captures):
9/10 and 10/10 on hero and features. The remaining item: my nav didn't reveal on wheel scroll. Let me check:
agent-browser's `scroll` command is synthetic (no wheel events) — real users scroll via wheel/touch/keys. Let me make the reveal robust to all scroll inputs (wheel, touch, keyboard, programmatic):
All gates pass. Now let me clean the codebase of unused scaffold dependencies before committing:
Dev server restarting after dependency changes. Let me wait and re-verify:
Server restored. Full re-verification:
Root cause: Turbopack's incremental cache corrupted when node_modules changed under it (the classic "bun remove while dev server running" failure). Fix: wipe `.next` and restart:
App fully healthy and stable. Now the git setup — first inspect what's at the repo root and prepare .gitignore + SSH key:
The `.env` references the removed SQLite DB (no secrets) — I'll drop it, tighten next.config for production, and write the final .gitignore:
Now set up the SSH key securely and initialize the repository:
No SSH client installed — let me install it:
No SSH binary, no sudo. I'll build the git-over-SSH wrapper with Python paramiko (equivalent to the referenced wrapper-script approach — implementing the `GIT_SSH` contract):
Paramiko installed in a venv. Now the GIT_SSH wrapper implementing the ssh CLI contract:
Timeout — likely network. Let me check what's reachable (port 22 vs 443):
Ports reachable — the bug is in my wrapper. Let me debug the paramiko connect directly:
Auth to GitHub works (key accepted, exec functional). The wrapper's IO loop was the hang — let me rewrite it with the proven polling pattern:
The wrapper speaks git protocol perfectly — the remote repo exists with a `main` at `3fd74fb`. Let me wire up the git environment and check the remote state:
The remote holds the user's own `prompt-to-create.md` doc — I must preserve it. Let me check the local .git state, stage carefully, and verify:
`scripts/` includes the venv and the key-material script — must be excluded. Let me fix:
111 files staged cleanly. Committing, rebasing onto the user's existing remote commit, and pushing:
Rebase clean — user's `prompt-to-create.md` preserved in history. Pushing:
**Codebase pushed to `nordeim/event-spark-2.git`** (3fd74fb..0fa109b). Let me verify and record progress, then move to the documentation phase:
Now the documentation phase. Let me read the four skill files from the foundation repo as instructed:
I have all four skill methodologies. Let me verify the exact final stack facts before writing:
All facts verified. Writing the four documents — starting with README.md:
Now AGENTS.md — compact, high-signal agent instructions:
Now CLAUDE.md following the Meticulous Approach template:
Now the Project Architecture Document — the definitive engineering reference:
All four documents complete. Committing and pushing the docs:
Both pushes landed. Final health check and worklog update:
All done! The complete **event-spark-2 clone** is built, verified, and pushed.

**What shipped:**
- 🌐 Pixel-faithful rebuild on the home-financing foundation's stack (Next.js 16 + React 19 + TS strict + Tailwind 4) — landing page, auth (login/signup/reset/Google), and 404, with measured design tokens, Lenis scroll, and reference-exact motion
- ✅ Verified: lint + typecheck clean, browser-tested flows, responsive, zero console errors, style-parity assertions
- 📦 Pushed to `nordeim/event-spark-2.git` (your `prompt-to-create.md` commit preserved), plus `README.md`, `AGENTS.md`, `CLAUDE.md`, and `Project_Architecture_Document.md` authored via the foundation's skills

**Preview it live:** https://preview-chat-dfb15da1-535c-4ca2-93c1-f58f644353ae.space-z.ai/

**One flag:** your final line said push to `design-brand-strategy.git`, which conflicts with the main instruction (everything → `event-spark-2.git`) — I followed the main instruction and did **not** push there. Say the word if you want it mirrored to that repo too.

**Next steps you might consider:** wire a real backend into the `AuthService` seam (one-line swap in `src/lib/auth/index.ts`), add Vitest for the hash router + auth adapter, or ask me to tweak any visual detail.
