import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo href="#/" />
        <p className="text-sm text-muted-foreground">
          © 2026 eventspark. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
