import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  glyphClassName?: string;
  wordmarkClassName?: string;
  href?: string;
}

/**
 * Brand lockup: ticket glyph + lowercase "eventspark" wordmark in the
 * display face, pink. Used in the navbar, hero, auth card, and footer.
 */
export function Logo({
  className,
  glyphClassName,
  wordmarkClassName,
  href,
}: LogoProps) {
  const lockup = (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <img
        src="/logo-glyph.png"
        alt=""
        className={cn("h-9 w-9 object-contain", glyphClassName)}
      />
      <span
        className={cn(
          "font-display font-bold tracking-tight text-primary text-[22px]",
          wordmarkClassName,
        )}
      >
        eventspark
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} aria-label="eventspark home">
        {lockup}
      </a>
    );
  }

  return lockup;
}
