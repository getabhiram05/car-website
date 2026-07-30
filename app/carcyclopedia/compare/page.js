"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80";

// rows where a HIGHER number is considered "better"
const SPEC_ROWS = [
  // Basic Info
  { label: "Category", key: "category" },
  { label: "Body Type", key: "body_type" },
  { label: "Segment", key: "segment" },
  { label: "Manufacturer", key: "manufacturer" },
  { label: "Country", key: "country" },
  { label: "Launch Year", key: "launch_year" },
  { label: "Current Gen Since", key: "current_gen_since" },
  { label: "Production Status", key: "production_status" },

  // Engine
  { label: "Engine", key: "engine" },
  { label: "Engine Type", key: "engine_type" },
  { label: "Displacement", key: "displacement_cc", higherIsBetter: true },
  { label: "Cylinders", key: "cylinders" },
  { label: "Fuel Types", key: "fuel_types" },
  { label: "Power", key: "power", higherIsBetter: true },
  { label: "Torque", key: "torque", higherIsBetter: true },
  { label: "Transmission", key: "transmission" },
  { label: "Drivetrain", key: "drivetrain" },

  // Performance
  { label: "Top Speed", key: "top_speed", higherIsBetter: true },
  { label: "0-100 km/h", key: "acceleration_0_100" },
  { label: "Odometer / Range", key: "mileage", higherIsBetter: true },
  { label: "City Mileage", key: "city_mileage", higherIsBetter: true },
  { label: "Highway Mileage", key: "highway_mileage", higherIsBetter: true },
  { label: "Fuel Tank Capacity", key: "fuel_tank_capacity", higherIsBetter: true },

  // Dimensions
  { label: "Length", key: "length" },
  { label: "Width", key: "width" },
  { label: "Height", key: "height" },
  { label: "Wheelbase", key: "wheelbase" },
  { label: "Ground Clearance", key: "ground_clearance", higherIsBetter: true },
  { label: "Boot Space", key: "boot_space", higherIsBetter: true },
  { label: "Kerb Weight", key: "kerb_weight" },

  // Suspension & Brakes
  { label: "Front Suspension", key: "front_suspension" },
  { label: "Rear Suspension", key: "rear_suspension" },
  { label: "Steering Type", key: "steering_type" },
  { label: "Turning Radius", key: "turning_radius" },
  { label: "Front Brake", key: "front_brake" },
  { label: "Rear Brake", key: "rear_brake" },
  { label: "Tyre Size", key: "tyre_size" },
  { label: "Wheel Size", key: "wheel_size" },

  // Safety
  { label: "Airbags", key: "airbags", higherIsBetter: true },
  { label: "ABS", key: "abs" },
  { label: "EBD", key: "ebd" },
  { label: "ESP", key: "esp" },
  { label: "Traction Control", key: "traction_control" },
  { label: "Hill Hold", key: "hill_hold" },
  { label: "Hill Descent Control", key: "hill_descent_control" },
  { label: "ADAS", key: "adas" },
  { label: "Lane Keep Assist", key: "lane_keep_assist" },
  { label: "Adaptive Cruise Control", key: "adaptive_cruise_control" },
  { label: "Blind Spot Monitor", key: "blind_spot_monitor" },
  { label: "Rear Camera", key: "rear_camera" },
  { label: "Parking Sensors", key: "parking_sensors" },

  // Interior
  { label: "Seating Capacity", key: "seating_capacity", higherIsBetter: true },
  { label: "Seat Material", key: "seat_material" },
  { label: "Ventilated Seats", key: "ventilated_seats" },
  { label: "Powered Seats", key: "powered_seats" },
  { label: "Climate Control", key: "climate_control" },
  { label: "Cruise Control", key: "cruise_control" },
  { label: "Sunroof", key: "sunroof" },
  { label: "Panoramic Sunroof", key: "panoramic_sunroof" },
  { label: "Ambient Lighting", key: "ambient_lighting" },
  { label: "Touchscreen", key: "touchscreen" },
  { label: "Android Auto", key: "android_auto" },
  { label: "Apple CarPlay", key: "apple_carplay" },
  { label: "Wireless Charging", key: "wireless_charging" },
  { label: "Speakers", key: "speakers" },

  // Price
  { label: "New Price", key: "price_range_new" },
  { label: "Used Price", key: "price_range_used" },

  // Verdict
  { label: "Rivals", key: "rivals" },
  { label: "Pros", key: "pros" },
  { label: "Cons", key: "cons" }
];

// pulls the first number out of a string like "830 PS" or "18 km/l" or "7"
function extractNumber(value) {
  if (value === null || value === undefined) return null;
  const match = String(value).match(/[\d.]+/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  return isNaN(num) ? null : num;
}


function CompareContent() {

  const searchParams = useSearchParams();
  const slugsParam = searchParams.get("slugs") || "";
  const slugs = slugsParam.split(",").filter(Boolean);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadCars() {

      if (slugs.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("carcyclopedia")
        .select("*")
        .in("slug", slugs);

      if (error) {
        console.error("Error loading compare cars:", error);
        setLoading(false);
        return;
      }

      const ordered = slugs
        .map((slug) => data.find((car) => car.slug === slug))
        .filter(Boolean)
        .map((car) => ({
          ...car,
          image: car.image_url || FALLBACK_IMAGE
        }));

      setCars(ordered);
      setLoading(false);

      ordered.forEach(async (car) => {

        if (car.image_url || !car.wiki_title) return;

        try {

          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              car.wiki_title
            )}`
          );

          if (!response.ok) return;

          const wikiData = await response.json();
          const wikiImage = wikiData.thumbnail?.source;

          if (wikiImage) {
            setCars((current) =>
              current.map((item) =>
                item.slug === car.slug
                  ? { ...item, image: wikiImage }
                  : item
              )
            );
          }

        } catch (err) {
          console.log("Wikipedia image failed:", car.slug);
        }

      });

    }

    loadCars();

  }, [slugsParam]);


  // for each spec row that has higherIsBetter, find the best numeric value
  function getBestValue(row) {

    if (!row.higherIsBetter) return null;

    let best = null;

    cars.forEach((car) => {
      const num = extractNumber(car[row.key]);
      if (num !== null && (best === null || num > best)) {
        best = num;
      }
    });

    return best;

  }


  return (

    <main className="min-h-screen bg-[#05070d] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <SmoothCursor
  color="#22d3ee"
  size={18}
  smoothness={0.15}
/>

      <div className="mx-auto max-w-7xl">

        <a
          href="/carcyclopedia"
          className="mb-5 inline-block font-semibold text-cyan-400 no-underline hover:text-cyan-300"
        >
          ← Back to Carcyclopedia
        </a>

        <h1 className="mb-2 text-3xl font-extrabold text-white">
          Compare Cars
        </h1>

        <p className="mb-8 text-slate-400">
          Highlighted values show the best figure across the cars you picked.
        </p>

        {loading ? (

          <p className="text-slate-400">Loading...</p>

        ) : cars.length === 0 ? (

          <p className="text-slate-400">No cars selected. Go back and pick some cars to compare.</p>

        ) : (

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">

            <table className="w-full border-collapse">

              <thead>
                <tr>
                  <th className="min-w-[160px] bg-slate-900/80 p-4 text-left text-slate-300">
                    Spec
                  </th>

                  {cars.map((car) => (

                    <th
                      key={car.slug}
                      className="min-w-[220px] bg-slate-900/80 p-4"
                    >

                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="mb-2.5 h-36 w-full rounded-lg object-cover"
                      />

                      <div className="text-base font-bold text-white">
                        {car.make} {car.model}
                      </div>

                    </th>

                  ))}

                </tr>
              </thead>

              <tbody>

                {SPEC_ROWS.map((row, i) => {

                  const bestValue = getBestValue(row);

                  return (

                    <tr
                      key={row.key}
                      className={i % 2 === 0 ? "bg-transparent" : "bg-slate-900/40"}
                    >

                      <td className="border-t border-slate-800 p-4 font-semibold text-slate-300">
                        {row.label}
                      </td>

                      {cars.map((car) => {

                        const rawValue = car[row.key];
                        const isBest =
                          row.higherIsBetter &&
                          bestValue !== null &&
                          extractNumber(rawValue) === bestValue;

                        return (

                          <td
                            key={car.slug}
                            className={`border-t border-slate-800 p-4 ${
                              isBest
                                ? "bg-cyan-500/10 font-bold text-cyan-300"
                                : "text-slate-200"
                            }`}
                          >
                            {rawValue ?? "—"}
                            {isBest ? " ✓" : ""}
                          </td>

                        );

                      })}

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>

  );

}


export default function ComparePage() {

  return (
    <Suspense fallback={<p className="min-h-screen bg-[#05070d] p-10 text-slate-400">Loading...</p>}>
      <CompareContent />
    </Suspense>
  );

}