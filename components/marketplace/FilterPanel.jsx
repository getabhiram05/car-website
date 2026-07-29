export default function FilterPanel({
  searchTerm,
  setSearchTerm,
  selectedMake,
  setSelectedMake,
  minYear,
  setMinYear,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  uniqueMakes,
  filteredCars,
  onReset,
}) {
  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <section className="-mt-14 relative z-20">
      <div className="rounded-[30px] border border-white/10 bg-[#121822]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">
            Find Your Perfect Car
          </h2>

          <p className="text-slate-400">
            Search, filter and sort through all available listings.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Search
            </label>

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Maruti, Swift..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Make
            </label>

            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className={inputClass}
            >
              <option value="">All Makes</option>

              {uniqueMakes.map((make) => (
                <option
                  key={make}
                  value={make}
                  className="bg-slate-900"
                >
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Min Year
            </label>

            <input
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="2020"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Max Price
            </label>

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="800000"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={inputClass}
            >
              <option value="year-desc" className="bg-slate-900">
                Newest
              </option>

              <option value="price-asc" className="bg-slate-900">
                Price ↑
              </option>

              <option value="price-desc" className="bg-slate-900">
                Price ↓
              </option>

              <option value="mileage-asc" className="bg-slate-900">
                Lowest Mileage
              </option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />

            <span className="text-slate-300">
              Showing{" "}
              <span className="font-bold text-white">
                {filteredCars.length}
              </span>{" "}
              cars
            </span>
          </div>

          <button
            onClick={onReset}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02]"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
}