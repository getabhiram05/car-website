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
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/cars"
            className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Cars
          </Link>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur">
            <h1 className="text-3xl font-extrabold text-white">
              Compare Cars
            </h1>
            <p className="mt-4 text-slate-400">
              Please select at least 2 cars to view the comparison.
            </p>
            <Link
              href="/cars"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
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
      ? "bg-cyan-500/10 text-cyan-300 font-semibold"
      : "text-slate-200";
  }

  function getValue(value) {
    if (value === undefined || value === null || value === "") {
      return "N/A";
    }
    return value;
  }

  function formatDate(value) {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/cars"
            className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Cars
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Compare Cars
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Compare key details side by side to choose the best car for you.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="bg-slate-900/80">
                <th className="border-b border-slate-800 px-4 py-4 text-left text-sm font-semibold text-slate-300">
                  Compare
                </th>

                {compareCars.map((car) => (
                  <th
                    key={car.id}
                    className="border-b border-slate-800 px-4 py-4 text-left align-top"
                  >
                    <div className="space-y-3">
                      <img
                        src={
                          Array.isArray(car.images) && car.images.length > 0
                            ? car.images[0]
                            : "/placeholder.jpg"
                        }
                        alt={`${car.make || ""} ${car.model || ""}`}
                        className="h-40 w-full rounded-xl bg-slate-800 object-cover"
                      />

                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {car.year} {car.make} {car.model}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                          {getValue(car.location)}
                        </p>
                      </div>

                      <Link
                        href={`/cars/${car.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
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
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Price
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-price`}
                    className={`border-b border-slate-800 px-4 py-4 text-sm ${getHighlightClass(
                      car.price === lowestPrice
                    )}`}
                  >
                    ₹{car.price ? car.price.toLocaleString("en-IN") : "N/A"}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Year
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-year`}
                    className={`border-b border-slate-800 px-4 py-4 text-sm ${getHighlightClass(
                      car.year === newestYear
                    )}`}
                  >
                    {getValue(car.year)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Odometer
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-mileage`}
                    className={`border-b border-slate-800 px-4 py-4 text-sm ${getHighlightClass(
                      car.mileage === highestMileage
                    )}`}
                  >
                    {car.mileage ? car.mileage.toLocaleString("en-IN") : "N/A"} km
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Fuel Type
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-fuel`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {getValue(car.fuel)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Transmission
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-transmission`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {getValue(car.transmission)}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Owner
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-owner`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {getValue(car.owner)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Color
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-color`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {getValue(car.color)}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Registration State
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-regstate`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {getValue(car.registration_state)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Insurance Valid Till
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-insurance`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {formatDate(car.insurance_valid_till)}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-300">
                  Contact Number
                </td>
                {compareCars.map((car) => (
                  <td
                    key={`${car.id}-phone`}
                    className="border-b border-slate-800 px-4 py-4 text-sm text-slate-200"
                  >
                    {getValue(car.seller_phone)}
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