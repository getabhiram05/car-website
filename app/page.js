"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";

const BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Honda",
  "Toyota",
  "Kia",
  "Skoda",
  "Volkswagen",
  "Renault",
  "Nissan",
  "BMW",
];

export default function Home() {
  const [homeSearch, setHomeSearch] = useState("");
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCars, setTotalCars] = useState(0);

  useEffect(() => {
    async function loadFeaturedCars() {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error loading featured cars:", error);
      } else {
        setFeaturedCars(data || []);
      }
      setLoading(false);
    }

    async function loadTotalCars() {
      const { count, error } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true });

      if (!error && typeof count === "number") {
        setTotalCars(count);
      }
    }

    loadFeaturedCars();
    loadTotalCars();
  }, []);

  function getFirstImage(car) {
    try {
      const images = JSON.parse(car.images);
      return images && images.length > 0
        ? images[0]
        : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
    } catch {
      return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
    }
  }

  function handleSearch() {
    const trimmedSearch = homeSearch.trim();

    if (trimmedSearch) {
      window.location.href = `/cars?search=${encodeURIComponent(trimmedSearch)}`;
    } else {
      window.location.href = "/cars";
    }
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleFeaturedCompare(carId) {
    window.location.href = `/cars?compare=${encodeURIComponent(carId)}`;
  }

  function handleStartSelling() {
    window.location.href = "/signup";
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1220] to-[#05070d] px-5 py-16 sm:py-20">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-semibold text-cyan-300">
              India&apos;s modern car marketplace
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Buy and sell{" "}
              <AnimatedGradientText className="text-inherit">
                used cars
              </AnimatedGradientText>{" "}
              with confidence
            </h1>

            <p className="mb-6 max-w-xl text-lg leading-relaxed text-slate-400">
              Browse popular cars in India, compare prices, view details, and
              connect buyers with sellers on one simple platform.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="/cars">
                <ShimmerButton
                  shimmerColor="#67e8f9"
                  background="#0891b2"
                  className="px-6 py-3 text-base font-bold"
                >
                  Browse Cars
                </ShimmerButton>
              </a>

              <a
                href="#seller-section"
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-base font-bold text-slate-100 backdrop-blur transition hover:bg-slate-800/60"
              >
                Sell Your Car
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 shadow-2xl shadow-black/40 backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
              alt="Car"
              className="block h-64 w-full rounded-2xl object-cover sm:h-72"
            />

            <div className="pt-4">
              <h3 className="mb-2 text-2xl font-bold text-white">
                Find the right car faster
              </h3>
              <p className="m-0 leading-relaxed text-slate-400">
                Search by budget, make, year, fuel type, and location with a
                clean mobile-friendly experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="px-5 pt-6">
        <div className="mx-auto -mt-10 max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/30 backdrop-blur">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_auto]">
            <input
              placeholder="Search make or model"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3.5 text-base text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-xl bg-cyan-500 px-6 py-3.5 text-base font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Search Cars
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-center backdrop-blur">
            <div className="mb-1 text-3xl font-extrabold text-cyan-400">
              <NumberTicker value={totalCars} />+
            </div>
            <div className="text-sm font-semibold text-slate-400">
              Cars Listed
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-center backdrop-blur">
            <div className="mb-1 text-3xl font-extrabold text-cyan-400">
              <NumberTicker value={40} />+
            </div>
            <div className="text-sm font-semibold text-slate-400">
              Brands
            </div>
          </div>
        </div>
      </section>

      {/* Brand marquee */}
      <section className="px-5 pb-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/40 py-4 backdrop-blur">
          <Marquee pauseOnHover className="[--duration:25s]">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="whitespace-nowrap px-7 text-base font-bold text-slate-400"
              >
                {brand}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Featured cars */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="mb-2 text-3xl font-extrabold text-white">
                Featured Cars
              </h2>
              <p className="m-0 text-slate-400">
                Popular used cars from trusted sellers
              </p>
            </div>

            <a
              href="/cars"
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 font-bold text-slate-100 backdrop-blur transition hover:bg-slate-800/60"
            >
              View All Listings
            </a>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading cars...</p>
          ) : featuredCars.length === 0 ? (
            <p className="text-slate-400">No cars found yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car, index) => (
                <BlurFade key={car.id} delay={0.1 + index * 0.08} inView>
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl shadow-black/30 backdrop-blur">
                    <img
                      src={getFirstImage(car)}
                      alt={`${car.make} ${car.model}`}
                      className="block h-48 w-full object-cover"
                    />

                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-bold text-white">
                        {car.make} {car.model}
                      </h3>

                      <div className="mb-3 text-sm text-slate-400">
                        {car.year} • {car.fuel} • {car.transmission}
                      </div>

                      <div className="mb-3 text-2xl font-extrabold text-white">
                        ₹{Number(car.price).toLocaleString("en-IN")}
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-2.5 text-sm text-slate-300">
                        <div className="rounded-xl bg-slate-800/70 p-2.5">
                          <strong className="text-slate-200">Odometer</strong>
                          <br />
                          {Number(car.mileage).toLocaleString("en-IN")} km
                        </div>

                        <div className="rounded-xl bg-slate-800/70 p-2.5">
                          <strong className="text-slate-200">Location</strong>
                          <br />
                          {car.location}
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <a
                          href={`/cars/${car.id}`}
                          className="flex-1 rounded-xl bg-cyan-500 py-3 text-center font-bold text-slate-950 transition hover:bg-cyan-400"
                        >
                          View Details
                        </a>

                        <button
                          type="button"
                          onClick={() => handleFeaturedCompare(car.id)}
                          className="flex-1 rounded-xl bg-cyan-500/10 py-3 font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                          Compare
                        </button>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info cards */}
      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
            <h3 className="mb-2 text-xl font-bold text-white">Easy Search</h3>
            <p className="m-0 leading-relaxed text-slate-400">
              Buyers can quickly browse by make, model, year, budget, and fuel
              type.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
            <h3 className="mb-2 text-xl font-bold text-white">
              Compare Cars
            </h3>
            <p className="m-0 leading-relaxed text-slate-400">
              Shortlist 2 or 3 cars and compare their price, odometer, and key
              features side by side.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
            <h3 className="mb-2 text-xl font-bold text-white">
              List Your Car
            </h3>
            <p className="m-0 leading-relaxed text-slate-400">
              Sellers can create an account, upload photos, and post their car
              for buyers to discover.
            </p>
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section id="seller-section" className="px-5 pb-16 pt-4">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-600/20 via-slate-900/60 to-slate-900/60 p-8 backdrop-blur sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-3xl font-extrabold text-white">
              Ready to sell your car?
            </h2>
            <p className="m-0 leading-relaxed text-slate-300">
              Create your seller account, upload multiple photos, and reach
              car buyers across India.
            </p>
          </div>

          <div className="flex justify-start sm:justify-end">
            <button
              type="button"
              onClick={handleStartSelling}
              className="rounded-xl bg-cyan-500 px-6 py-3.5 text-base font-extrabold text-slate-950 transition hover:bg-cyan-400"
            >
              Start Selling
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}