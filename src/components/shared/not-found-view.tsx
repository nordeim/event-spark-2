"use client";

/**
 * Mirrors the reference app's 404 screen: centered content on the muted
 * band, a small bold "404" in the display face (the reference styles bare
 * h1s with Bricolage Grotesque globally; the clone encodes it via
 * `font-display`), and a pink underlined text link home. No navbar.
 * Shared by the hash router (in-app 404) and the server-level not-found
 * route — so the home link targets the real path `/`, which works from
 * both contexts (a hash link would strand users on a server-rendered
 * 404 path).
 */
export function NotFoundView() {
  return (
    <main
      data-testid="page-not-found"
      className="min-h-screen bg-muted flex items-center justify-center px-6"
    >
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold font-display text-foreground">
          404
        </h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <a
          href="/"
          data-testid="not-found-home-link"
          className="text-primary underline hover:text-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}
