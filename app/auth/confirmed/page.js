"use client";

import Link from "next/link";

export default function EmailConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Email Verified 🎉
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Your email has been confirmed. You can now log in to your Car
          Becho account.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}