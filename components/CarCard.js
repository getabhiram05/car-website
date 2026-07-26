import Link from "next/link";

export default function CarCard({ car }) {
  const formattedPrice = new Intl.NumberFormat("en-IN").format(car.price);
  const formattedMileage = new Intl.NumberFormat("en-IN").format(car.mileage);

  return (
    <Link
      href={`/cars/${car.id}`}
      className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {car.make} {car.model}
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          {car.year} • {formattedMileage} km • {car.fuel}
        </p>

        <p className="mt-3 text-2xl font-bold text-blue-600">
          ₹{formattedPrice}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {car.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {feature}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-gray-700">View details →</p>
      </div>
    </Link>
  );
}