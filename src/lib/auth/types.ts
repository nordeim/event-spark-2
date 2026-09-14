export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface SignUpInput extends AuthCredentials {
  readonly fullName: string;
}

export interface AuthResult {
  readonly ok: boolean;
  readonly email: string;
}

export type AuthError =
  | "invalid-credentials"
  | "email-already-registered"
  | "weak-password"
  | "network";

/**
 * Typed failure carrier for the auth boundary. Adapters throw this instead
 * of bare `Error`s so UI code can branch on `error.code` (the `AuthError`
 * union) rather than string-matching messages.
 */
export class AuthServiceError extends Error {
  readonly code: AuthError;

  constructor(code: AuthError, message?: string) {
    super(message ?? code);
    this.name = "AuthServiceError";
    this.code = code;
  }
}

/**
 * Boundary for the authentication backend. The landing template ships with
 * the demo implementation; swap `createAuthService` in
 * `src/lib/auth/demo-auth-service.ts` for a Supabase/Auth.js adapter
 * without touching any UI code.
 */
export interface AuthService {
  signIn(input: AuthCredentials): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  signInWithProvider(provider: "google"): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<AuthResult>;
}
