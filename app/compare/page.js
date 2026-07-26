import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default async function ComparePage({ searchParams }) {
  const params = await searchParams;
  const idsParam = params?.ids || "";

  const selectedIds = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  let compareCars = [];

  if (selectedIds.length > 0) {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .in("id", selectedIds);

    if (error) {
      console.error("Supabase Error:", error.message);
    } else if (data) {
      compareCars = data.map((car) => ({
        ...car,
        images: car.images ? JSON.parse(car.images) : [],
        features: car.features ? JSON.parse(car.features) : [],
      }));
    }
  }

  if (compareCars.length < 2) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/cars"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Cars
          </Link>

          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              Compare Cars
            </h1>
            <p className="mt-4 text-gray-600">
              Please select at least 2 cars to view the comparison.
            </p>
            <Link
              href="/cars"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Cars Page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const lowestPrice = Math.min(...compareCars.map((car) => car.price || Infinity));
  const newestYear = Math.max(...compareCars.map((car) => car.year || 0));
  const highestMileage = Math.max(...compareCars.map((car) => car.mileage || 0));

  function getHighlightClass(isBest) {
    return isBest
      ? "bg-green-50 text-green-700 font-semibold"
      : "text-gray-900";
  }

  function getValue(value) {
    if (value === undefined || value === null || value === "") {
      return "N/A";
    }
    return value;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/cars"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Cars
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Compare Cars
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Compare key details side by side to choose the best car for you.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-200 px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Compare
                </th>

                {compareCars.map((car) => (
                  <th
                    key={car.id}
                    className="border-b border-gray-200 px-4 py-4 text-left align-top"
                  >
                    <div className="space-y-3">
                      <img
                        src={
                          Array.isArray(car.images) && car.images.length > 0
                            ? car.images[0]
                            : "/placeholder.jpg"
                        }
                        alt={`${car.make || ""} ${car.model || ""}`}
                        className="h-40 w-full rounded-xl object-cover bg-gray-200"
                      />

                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {car.year} {car.make} {car.model}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {getValue(car.location)}
                        </p>
                      </div>

                      <Link
                        href={`/cars/${car.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border-b border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                  Price
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-price`}
                    className={`border-b border-gray-200 px-4 py-4 text-sm ${getHighlightClass(
                      car.price === lowestPrice
                    )}`}
                  >
                    ₹{car.price ? car.price.toLocaleString("en-IN") : "N/A"}
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td className="border-b border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                  Year
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-year`}
                    className={`border-b border-gray-200 px-4 py-4 text-sm ${getHighlightClass(
                      car.year === newestYear
                    )}`}
                  >
                    {getValue(car.year)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                  Mileage
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-mileage`}
                    className={`border-b border-gray-200 px-4 py-4 text-sm ${getHighlightClass(
                      car.mileage === highestMileage
                    )}`}
                  >
                    {car.mileage ? car.mileage.toLocaleString("en-IN") : "N/A"} km
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td className="border-b border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                  Fuel Type
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-fuel`}
                    className="border-b border-gray-200 px-4 py-4 text-sm text-gray-900"
                  >
                    {getValue(car.fuel)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                  Transmission
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-transmission`}
                    className="border-b border-gray-200 px-4 py-4 text-sm text-gray-900"
                  >
                    {getValue(car.transmission)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}