import { NotFoundView } from "@/components/shared/not-found-view";

/**
 * Server-level catch-all for real (non-hash) unknown paths, rendering the
 * same 404 experience as the in-app router.
 */
export default function NotFound() {
  return <NotFoundView />;
}
