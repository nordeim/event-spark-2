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
