"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/shared/logo";
import { authService } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .refine(
      (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value),
      "Mix upper and lower case letters with a number",
    ),
});

const resetSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;
type ResetValues = z.infer<typeof resetSchema>;

interface AuthViewProps {
  initialMode: "login" | "signup";
  onNavigate: (to: string) => void;
}

const floatingShapes = [
  { className: "top-[10%] left-[8%] w-16 h-16 rounded-full bg-primary/10 blur-sm" },
  { className: "top-[20%] right-[12%] w-12 h-12 rounded-lg bg-primary/10 rotate-12 blur-sm" },
  { className: "bottom-[15%] left-[15%] w-10 h-10 rounded-full bg-primary/10 blur-sm" },
  { className: "bottom-[25%] right-[8%] w-14 h-14 rounded-lg bg-primary/10 -rotate-12 blur-sm" },
  { className: "top-[50%] left-[5%] w-8 h-8 rounded-full bg-muted-foreground/10 blur-sm" },
  { className: "top-[40%] right-[5%] w-20 h-20 rounded-full bg-primary/5 blur-md" },
] as const;

const inputClasses = cn(
  "flex w-full rounded-full border border-border bg-background",
  "px-4 py-2.5 h-11 text-sm text-foreground placeholder:text-muted-foreground",
  "transition-[color,box-shadow] outline-none",
  "focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:border-ring",
  "disabled:opacity-50",
);

const submitClasses = cn(
  "inline-flex items-center justify-center gap-2 rounded-full w-full h-11",
  "text-sm font-semibold text-background bg-foreground hover:bg-foreground/90",
  "transition-[transform,colors,box-shadow] duration-200 ease-out",
  "hover:-translate-y-[1px] hover:shadow-float active:scale-[0.97]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-60",
);

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive mt-1.5 ml-4">
      {message}
    </p>
  );
}

function GoogleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 1.8 14.96.72 12 .72 7.44.72 3.56 3.36 1.72 7.08l3.66 2.84C6.26 7.14 8.88 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.28 12.26c0-.8-.07-1.56-.2-2.3H12v4.51h6.34c-.27 1.42-1.08 2.63-2.31 3.44l3.62 2.81c2.12-1.96 3.63-4.85 3.63-8.46z"
      />
      <path
        fill="#FBBC05"
        d="M5.38 14.09a7.1 7.1 0 0 1 0-4.18L1.72 7.07a11.28 11.28 0 0 0 0 10.13l3.66-2.84z"
      />
      <path
        fill="#34A853"
        d="M12 23.28c3.04 0 5.6-1 7.46-2.72l-3.62-2.81c-1 .67-2.29 1.07-3.84 1.07-3.12 0-5.74-2.1-6.62-4.88l-3.66 2.84c1.84 3.72 5.72 6.5 10.28 6.5z"
      />
    </svg>
  );
}

function Divider() {
  return (
    <div className="relative my-5" aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-widest">
          or
        </span>
      </div>
    </div>
  );
}

export function AuthView({ initialMode, onNavigate }: AuthViewProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [resetting, setResetting] = useState(false);
  const [providerPending, setProviderPending] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  const reportSuccess = (email: string, action: string) => {
    toast({
      title: action,
      description: `Signed in as ${email} (demo mode — no backend is attached yet).`,
    });
    onNavigate("/");
  };

  const onLogin = loginForm.handleSubmit(async (values) => {
    try {
      const result = await authService.signIn(values);
      reportSuccess(result.email, "Welcome back");
    } catch {
      loginForm.setError("password", {
        message: "We couldn't sign you in with those credentials.",
      });
    }
  });

  const onSignUp = signUpForm.handleSubmit(async (values) => {
    try {
      const result = await authService.signUp(values);
      reportSuccess(result.email, "Account created");
    } catch (error) {
      signUpForm.setError("password", {
        message:
          error instanceof Error && error.message === "weak-password"
            ? "Use at least 8 characters with upper, lower case, and a number."
            : "We couldn't create your account. Try again in a moment.",
      });
    }
  });

  const onReset = resetForm.handleSubmit(async (values) => {
    await authService.requestPasswordReset(values.email);
    setResetting(false);
    resetForm.reset();
    toast({
      title: "Check your inbox",
      description:
        "If an account exists for that email, a reset link is on its way.",
    });
  });

  const onGoogle = async () => {
    setProviderPending(true);
    try {
      const result = await authService.signInWithProvider("google");
      reportSuccess(result.email, "Signed in with Google");
    } finally {
      setProviderPending(false);
    }
  };

  return (
    <main
      data-testid="page-auth"
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 sm:py-12 relative overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingShapes.map((shape, index) => (
          <div
            key={index}
            className={cn("absolute animate-drift", shape.className)}
            style={
              {
                "--drift-x": `${(index % 3) - 1}px`,
                "--drift-y": `${(index % 2) - 1}px`,
                "--drift-duration": `${6 + index}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="inline-block transition-transform duration-300 hover:scale-[1.03]"
            aria-label="eventspark — back to home"
          >
            <Logo glyphClassName="w-12 h-12" wordmarkClassName="text-2xl" />
          </button>
          <p className="text-muted-foreground mt-2 text-sm">
            Create events people actually want to attend
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-7"
        >
          {resetting ? (
            <form onSubmit={onReset} noValidate>
              <h1 className="font-display font-bold text-xl text-foreground mb-1">
                Reset your password
              </h1>
              <p className="text-sm text-muted-foreground mb-5">
                Enter your email and we&apos;ll send a reset link.
              </p>
              <div className="space-y-1.5 mb-5">
                <label
                  htmlFor="reset-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  className={inputClasses}
                  {...resetForm.register("email")}
                />
                <FieldError message={resetForm.formState.errors.email?.message} />
              </div>
              <button
                type="submit"
                disabled={resetForm.formState.isSubmitting}
                className={submitClasses}
              >
                {resetForm.formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  "Send reset link"
                )}
              </button>
              <button
                type="button"
                onClick={() => setResetting(false)}
                className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as "login" | "signup")}
            >
              <TabsList className="h-10 items-center justify-center text-muted-foreground grid w-full grid-cols-2 rounded-full bg-muted p-1 mb-6">
                <TabsTrigger
                  value="login"
                  className="rounded-full px-3 py-1.5 h-8 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Log in
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-full px-3 py-1.5 h-8 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={onLogin} noValidate>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="login-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        className={inputClasses}
                        {...loginForm.register("email")}
                      />
                      <FieldError message={loginForm.formState.errors.email?.message} />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="login-password"
                        className="text-sm font-medium text-foreground"
                      >
                        Password
                      </label>
                      <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        className={inputClasses}
                        {...loginForm.register("password")}
                      />
                      <FieldError
                        message={loginForm.formState.errors.password?.message}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loginForm.formState.isSubmitting}
                      className={submitClasses}
                    >
                      {loginForm.formState.isSubmitting ? (
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        "Sign in"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setResetting(true)}
                      className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={onSignUp} noValidate>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="signup-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Full name
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        className={inputClasses}
                        {...signUpForm.register("fullName")}
                      />
                      <FieldError
                        message={signUpForm.formState.errors.fullName?.message}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="signup-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        className={inputClasses}
                        {...signUpForm.register("email")}
                      />
                      <FieldError
                        message={signUpForm.formState.errors.email?.message}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="signup-password"
                        className="text-sm font-medium text-foreground"
                      >
                        Password
                      </label>
                      <input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        className={inputClasses}
                        {...signUpForm.register("password")}
                      />
                      <FieldError
                        message={signUpForm.formState.errors.password?.message}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={signUpForm.formState.isSubmitting}
                      className={submitClasses}
                    >
                      {signUpForm.formState.isSubmitting ? (
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {!resetting && (
            <>
              <Divider />
              <button
                type="button"
                onClick={onGoogle}
                disabled={providerPending}
                className={cn(
                  "inline-flex items-center justify-center gap-2.5 rounded-full w-full h-11",
                  "text-sm font-medium text-foreground bg-card border border-border",
                  "hover:bg-muted transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-60",
                )}
              >
                {providerPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <GoogleGlyph />
                )}
                Continue with Google
              </button>
              <p className="text-center text-xs text-muted-foreground mt-5 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
