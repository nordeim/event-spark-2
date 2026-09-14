import type {
  AuthCredentials,
  AuthService,
  AuthResult,
  SignUpInput,
} from "./types";
import { AuthServiceError } from "./types";

const NETWORK_LATENCY_MS = 900;

const hasUpperLowerDigit = (value: string): boolean =>
  /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const passwordIssue = (password: string): boolean =>
  password.length < 8 || !hasUpperLowerDigit(password);

const outcome = (email: string): AuthResult => ({ ok: true, email });

/**
 * Demo authentication service: mirrors the production contract with
 * simulated latency and deterministic validation rules so the UI's loading,
 * success, and error states are fully exercisable without a backend.
 *
 * Rules: sign-in accepts any well-formed credentials; sign-up rejects
 * passwords shorter than 8 characters or missing case/digit variety;
 * the password reset always reports success (never reveals account state).
 */
export const demoAuthService: AuthService = {
  async signIn(input: AuthCredentials): Promise<AuthResult> {
    await sleep(NETWORK_LATENCY_MS);
    return outcome(input.email);
  },

  async signUp(input: SignUpInput): Promise<AuthResult> {
    await sleep(NETWORK_LATENCY_MS);
    if (passwordIssue(input.password)) {
      throw new AuthServiceError("weak-password");
    }
    return outcome(input.email);
  },

  async signInWithProvider(provider: "google"): Promise<AuthResult> {
    await sleep(NETWORK_LATENCY_MS);
    return outcome(`${provider}-user@eventspark.dev`);
  },

  async requestPasswordReset(email: string): Promise<AuthResult> {
    await sleep(NETWORK_LATENCY_MS);
    return outcome(email);
  },
};
