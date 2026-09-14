import type { AuthService } from "./types";
import { demoAuthService } from "./demo-auth-service";

/**
 * Composition root for the auth boundary. The demo adapter ships with the
 * template; reassign to a real implementation (e.g. Supabase) here once a
 * backend exists and the whole UI switches over.
 */
export const authService: AuthService = demoAuthService;
