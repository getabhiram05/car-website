import Link from "next/link";
import { Calendar, Fuel, Gauge, MapPin } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";

export default function CarCard({ car }) {
  const formattedPrice = new Intl.NumberFormat("en-IN").format(car.price);
  const formattedMileage = new Intl.NumberFormat("en-IN").format(car.mileage);

  return (
<MagicCard
  className="overflow-hidden rounded-2xl border border-slate-800 p-0 [--color-background:#0f172a]"
  gradientColor="#0e7490"
  gradientOpacity={0.4}
>
      <Link href={`/cars/${car.id}`} className="group block">

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-4 left-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {car.year}
          </div>

          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-bold text-white">
              {car.make}
            </h2>

            <p className="text-lg text-white/90">
              {car.model}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 p-6">

          <div className="text-3xl font-black text-blue-500">
            ₹{formattedPrice}
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Gauge size={16} />
                <span className="text-xs">Odometer</span>
              </div>

              <p className="mt-1 font-semibold text-white">
                {formattedMileage} km
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Fuel size={16} />
                <span className="text-xs">Fuel</span>
              </div>

              <p className="mt-1 font-semibold text-white">
                {car.fuel}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={16} />
                <span className="text-xs">Year</span>
              </div>

              <p className="mt-1 font-semibold text-white">
                {car.year}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={16} />
                <span className="text-xs">Location</span>
              </div>

              <p className="mt-1 truncate font-semibold text-white">
                {car.location}
              </p>
            </div>

          </div>

          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-blue-600/15 px-3 py-1 text-xs font-medium text-blue-400"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-center font-semibold text-white transition group-hover:shadow-lg group-hover:shadow-blue-500/40">
            View Details →
          </div>

        </div>

      </Link>
    </MagicCard>
  );
}