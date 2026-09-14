import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { demoAuthService } from "./demo-auth-service";

const LATENCY_TOLERANCE_MS = 350;
const EXPECTED_LATENCY_MS = 900;

describe("demoAuthService.signIn", () => {
  it("resolves ok with the submitted email for well-formed credentials", async () => {
    const result = await demoAuthService.signIn({
      email: "user@example.com",
      password: "Password1",
    });
    expect(result).toEqual({ ok: true, email: "user@example.com" });
  });

  it("simulates ~900ms network latency", async () => {
    const start = performance.now();
    await demoAuthService.signIn({
      email: "user@example.com",
      password: "Password1",
    });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeGreaterThan(EXPECTED_LATENCY_MS - LATENCY_TOLERANCE_MS);
  });
});

describe("demoAuthService.signUp password policy", () => {
  const cases: readonly { name: string; password: string }[] = [
    { name: "shorter than 8 characters", password: "Ab1xyz" },
    { name: "missing an uppercase letter", password: "lowercase1password" },
    { name: "missing a lowercase letter", password: "UPPERCASE1PASSWORD" },
    { name: "missing a digit", password: "NoDigitsHere" },
  ];

  it.each(cases)("rejects a password that is $name", async ({ password }) => {
    await expect(
      demoAuthService.signUp({
        email: "new@example.com",
        fullName: "New User",
        password,
      }),
    ).rejects.toThrow();
  });

  it("resolves ok for a password with length, case mix, and a digit", async () => {
    const result = await demoAuthService.signUp({
      email: "new@example.com",
      fullName: "New User",
      password: "ValidPass123",
    });
    expect(result).toEqual({ ok: true, email: "new@example.com" });
  });
});

describe("demoAuthService.signInWithProvider", () => {
  it("resolves ok with the provider demo identity", async () => {
    const result = await demoAuthService.signInWithProvider("google");
    expect(result.ok).toBe(true);
    expect(result.email).toContain("google-user@eventspark.dev");
  });
});

describe("demoAuthService.requestPasswordReset", () => {
  it("always resolves ok without revealing account existence", async () => {
    const result = await demoAuthService.requestPasswordReset(
      "unknown@nowhere.dev",
    );
    expect(result).toEqual({ ok: true, email: "unknown@nowhere.dev" });
  });
});

describe("typed error contract (AuthError)", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects with an AuthServiceError carrying code 'weak-password'", async () => {
    const rejection = demoAuthService.signUp({
      email: "new@example.com",
      fullName: "New User",
      password: "bad",
    });
    await expect(rejection).rejects.toMatchObject({
      code: "weak-password",
    });
  });
});
