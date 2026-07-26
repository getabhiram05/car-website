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
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              My Listings
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Logged in as {user?.email}
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add New Listing
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {car.year} {car.make} {car.model}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  ₹{car.price.toLocaleString("en-IN")} ·{" "}
                  {car.mileage.toLocaleString("en-IN")} km
                </p>

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/dashboard/edit/${car.id}`}
                    className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex-1 rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 ring-1 ring-gray-300 transition hover:bg-gray-100"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              No listings yet
            </h3>
            <p className="mt-2 text-gray-600">
              Click &quot;Add New Listing&quot; to create your first car
              listing.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}