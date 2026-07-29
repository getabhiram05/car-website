"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setIsLoading(false);
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Carvora
          <span className="ml-2 text-xs font-normal text-gray-500">
            Search. Research. Drive.
          </span>
        </Link>

        {/* Desktop nav - hidden on small screens */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="/cars"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Marketplace
          </Link>

          <Link
            href="/carcyclopedia"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Carcyclopedia
          </Link>

          {isLoading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <span className="hidden text-sm text-gray-600 sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger - hidden on md and up */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 bg-white opacity-100 shadow-xl"
            >
              <nav className="mt-10 flex flex-col gap-4 bg-white p-4">
                <Link
                  href="/cars"
                  onClick={closeMobile}
                  className="text-base font-medium text-gray-800"
                >
                  Marketplace
                </Link>

                <Link
                  href="/carcyclopedia"
                  onClick={closeMobile}
                  className="text-base font-medium text-gray-800"
                >
                  Carcyclopedia
                </Link>

                {isLoading ? null : user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobile}
                      className="text-base font-medium text-gray-800"
                    >
                      Dashboard
                    </Link>
                    <span className="text-sm text-gray-500">
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMobile}
                      className="text-base font-medium text-gray-800"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMobile}
                      className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}