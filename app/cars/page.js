"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CarCard from "../../components/CarCard";
import { supabase } from "../../lib/supabaseClient";

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-slate-400">Loading cars...</p>
          </div>
        </main>
      }
    >
      <CarsPageContent />
    </Suspense>
  );
}

function CarsPageContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedMake, setSelectedMake] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("year-desc");
  const [selectedCompareCars, setSelectedCompareCars] = useState([]);

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    async function fetchCars() {
      const { data, error } = await supabase.from("cars").select("*");

      if (!error && data) {
        const parsedCars = data.map((car) => ({
          ...car,
          images: car.images ? JSON.parse(car.images) : [],
          features: car.features ? JSON.parse(car.features) : [],
        }));
        setCars(parsedCars);
      }

      setIsLoading(false);
    }

    fetchCars();
  }, []);

  const uniqueMakes = [...new Set(cars.map((car) => car.make))].sort((a, b) =>
    a.localeCompare(b)
  );

  const filteredCars = useMemo(() => {
    const cleanSearchTerm = searchTerm.toLowerCase().trim();
    const cleanCityTerm = cityTerm.toLowerCase().trim();

    const filtered = cars.filter((car) => {
      const fullSearchText = `${car.make} ${car.model}`.toLowerCase();

      const matchesSearch = cleanSearchTerm
        ? fullSearchText.includes(cleanSearchTerm)
        : true;

      const matchesCity = cleanCityTerm
        ? (car.location || "").toLowerCase().includes(cleanCityTerm)
        : true;

      const matchesMake = selectedMake ? car.make === selectedMake : true;
      const matchesYear = minYear ? car.year >= Number(minYear) : true;
      const matchesPrice = maxPrice ? car.price <= Number(maxPrice) : true;

      return matchesSearch && matchesCity && matchesMake && matchesYear && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }

      if (sortBy === "price-desc") {
        return b.price - a.price;
      }

      if (sortBy === "mileage-asc") {
        return a.mileage - b.mileage;
      }

      return b.year - a.year;
    });

    return sorted;
  }, [cars, searchTerm, cityTerm, selectedMake, minYear, maxPrice, sortBy]);

  const compareUrl =
    selectedCompareCars.length >= 2
      ? `/compare?ids=${selectedCompareCars.map((car) => car.id).join(",")}`
      : "#";

  function handleResetFilters() {
    setSearchTerm("");
    setCityTerm("");
    setSelectedMake("");
    setMinYear("");
    setMaxPrice("");
    setSortBy("year-desc");
    window.history.replaceState({}, "", "/cars");
  }

  function handleToggleCompare(car) {
    const alreadySelected = selectedCompareCars.some(
      (selectedCar) => selectedCar.id === car.id
    );

    if (alreadySelected) {
      setSelectedCompareCars((prev) =>
        prev.filter((selectedCar) => selectedCar.id !== car.id)
      );
      return;
    }

    if (selectedCompareCars.length >= 3) {
      alert("You can compare up to 3 cars only.");
      return;
    }

    setSelectedCompareCars((prev) => [...prev, car]);
  }

  function handleRemoveCompareCar(carId) {
    setSelectedCompareCars((prev) =>
      prev.filter((selectedCar) => selectedCar.id !== carId)
    );
  }

  function handleClearCompare() {
    setSelectedCompareCars([]);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-400">Loading cars...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Browse Cars
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Explore popular used cars across India.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              Search, Filter and Sort
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Search by make or model, then narrow results using filters and
              sorting.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Search make or model
              </label>
              <input
                id="search"
                type="text"
                placeholder="Example: Maruti or Swift"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="Example: Ahmedabad"
                value={cityTerm}
                onChange={(e) => setCityTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="make"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Make
              </label>
              <select
                id="make"
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
              >
                <option value="">All makes</option>
                {uniqueMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="minYear"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Minimum year
              </label>
              <input
                id="minYear"
                type="number"
                placeholder="Example: 2019"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="maxPrice"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Maximum price (₹)
              </label>
              <input
                id="maxPrice"
                type="number"
                placeholder="Example: 800000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="sortBy"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Sort by
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
              >
                <option value="year-desc">Year: newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="mileage-asc">Odometer: low to high</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredCars.length}
              </span>{" "}
              {filteredCars.length === 1 ? "car" : "cars"}
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/60"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Compare Cars
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Select 2 or 3 cars to compare side by side.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleClearCompare}
                disabled={selectedCompareCars.length === 0}
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear Compare
              </button>

              <Link
                href={compareUrl}
                className={`inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  selectedCompareCars.length >= 2
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    : "cursor-not-allowed bg-cyan-500/30 text-slate-900"
                }`}
              >
                Compare Selected ({selectedCompareCars.length})
              </Link>
            </div>
          </div>

          {selectedCompareCars.length > 0 ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {selectedCompareCars.map((car) => (
                <div
                  key={car.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {car.year} {car.make} {car.model}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        ₹{car.price.toLocaleString("en-IN")} ·{" "}
                        {car.mileage.toLocaleString("en-IN")} km
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCompareCar(car.id)}
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-400">
              No cars selected yet. Use the compare buttons below to add cars.
            </p>
          )}
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCars.map((car) => {
              const isSelectedForCompare = selectedCompareCars.some(
                (selectedCar) => selectedCar.id === car.id
              );

              return (
                <div key={car.id} className="space-y-3">
                  <CarCard car={car} />

                  <button
                    type="button"
                    onClick={() => handleToggleCompare(car)}
                    className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      isSelectedForCompare
                        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        : "border border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    {isSelectedForCompare
                      ? "Added to Compare"
                      : "Add to Compare"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur">
            <h3 className="text-xl font-semibold text-white">
              No cars found
            </h3>
            <p className="mt-2 text-slate-400">
              Try changing your search or filters to see more results.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Clear Search and Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}