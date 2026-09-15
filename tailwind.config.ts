import type { Config } from "tailwindcss";

/**
 * Tailwind v4 CSS-first: tokens live in `src/app/globals.css` under
 * `@theme inline` / `:root` HSL variables. This file intentionally carries
 * ONLY content paths — it exists for tooling (IDE class detection) and is
 * NOT part of the PostCSS pipeline (`postcss.config.mjs` →
 * `@tailwindcss/postcss`). Do not add a theme block or plugins here.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
