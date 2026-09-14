"use client";

import { NotFoundView } from "@/components/shared/not-found-view";
import { useHashRoute } from "@/hooks/use-hash-route";

/**
 * Server-level catch-all for real (non-hash) unknown paths, rendering the
 * same 404 experience as the in-app router.
 */
export default function NotFound() {
  const { navigate } = useHashRoute();
  return <NotFoundView onNavigate={navigate} />;
}
