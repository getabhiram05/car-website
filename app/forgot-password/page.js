"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg border border-cyan-800 bg-cyan-950/40 p-4 text-sm text-cyan-300">
              Check your email for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-cyan-400">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}