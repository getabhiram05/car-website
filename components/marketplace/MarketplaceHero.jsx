export default function MarketplaceHero({ totalCars }) {
  return (
    <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-8 py-16 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb33,transparent_45%)]" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative z-10 max-w-3xl">
        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
          Premium Marketplace
        </span>

        <h1 className="mt-6 text-5xl font-black leading-tight text-white lg:text-7xl">
          Browse India's
          <span className="block text-blue-400">
            Finest Cars
          </span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Discover verified listings, compare vehicles, and find your perfect
          car from thousands of trusted sellers.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-white backdrop-blur-md">
            🚗 {totalCars} Listings
          </div>

          <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-white backdrop-blur-md">
            ⚡ Instant Compare
          </div>

          <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-white backdrop-blur-md">
            ✓ Verified Sellers
          </div>
        </div>
      </div>
    </section>
  );
}