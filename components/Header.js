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
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#05070d]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-white">
          Carvora
          <span className="ml-2 text-xs font-normal text-slate-500">
            Search. Research. Drive.
          </span>
        </Link>

        {/* Desktop nav - hidden on small screens */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="/cars"
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            Marketplace
          </Link>

          <Link
            href="/carcyclopedia"
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            Carcyclopedia
          </Link>

          {isLoading ? null : user ? (
            <>
              <Link
                href="/messages"
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                Messages
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                Dashboard
              </Link>
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/60"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
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
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200"
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
              className="w-72 border-slate-800 bg-[#05070d] opacity-100 shadow-xl"
            >
              <nav className="mt-10 flex flex-col gap-4 bg-[#05070d] p-4">
                <Link
                  href="/cars"
                  onClick={closeMobile}
                  className="text-base font-medium text-slate-200"
                >
                  Marketplace
                </Link>

                <Link
                  href="/carcyclopedia"
                  onClick={closeMobile}
                  className="text-base font-medium text-slate-200"
                >
                  Carcyclopedia
                </Link>

                {isLoading ? null : user ? (
                  <>
                    <Link
                      href="/messages"
                      onClick={closeMobile}
                      className="text-base font-medium text-slate-200"
                    >
                      Messages
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={closeMobile}
                      className="text-base font-medium text-slate-200"
                    >
                      Dashboard
                    </Link>
                    <span className="text-sm text-slate-500">
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMobile}
                      className="text-base font-medium text-slate-200"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMobile}
                      className="mt-2 w-full rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950"
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