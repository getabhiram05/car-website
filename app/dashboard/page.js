"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push("/login");
        return;
      }

      setUser(userData.user);

      const { data: carsData, error } = await supabase
        .from("cars")
        .select("*")
        .eq("seller_id", userData.user.id);

      if (!error && carsData) {
        setCars(carsData);
      }

      setIsLoading(false);
    }

    loadDashboard();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              My Listings
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Logged in as {user?.email}
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Add New Listing
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur"
              >
                <h3 className="text-lg font-semibold text-white">
                  {car.year} {car.make} {car.model}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  ₹{car.price.toLocaleString("en-IN")} ·{" "}
                  {car.mileage.toLocaleString("en-IN")} km
                </p>

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/dashboard/edit/${car.id}`}
                    className="flex-1 rounded-lg bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800/60"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur">
            <h3 className="text-xl font-semibold text-white">
              No listings yet
            </h3>
            <p className="mt-2 text-slate-400">
              Click &quot;Add New Listing&quot; to create your first car
              listing.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}