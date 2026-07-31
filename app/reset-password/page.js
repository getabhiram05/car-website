"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setSessionReady(true);
          setCheckingSession(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      setCheckingSession(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter a new password for your account.
          </p>

          {checkingSession ? (
            <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
              Verifying your reset link...
            </div>
          ) : !sessionReady ? (
            <div className="mt-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-400">
              This reset link is invalid or has expired. Please request a new
              one from the{" "}
              <a href="/forgot-password" className="font-semibold underline">
                forgot password
              </a>{" "}
              page.
            </div>
          ) : success ? (
            <div className="mt-6 rounded-lg border border-cyan-800 bg-cyan-950/40 p-4 text-sm text-cyan-300">
              Password updated! Redirecting you to log in...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
                />
              </div>

              {errorMessage ? (
                <p className="text-sm text-red-400">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}