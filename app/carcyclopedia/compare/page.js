"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80";

// rows where a HIGHER number is considered "better"
const SPEC_ROWS = [
  { label: "Category", key: "category" },
  { label: "Launch Year", key: "launch_year" },
  { label: "Current Gen Since", key: "current_gen_since" },
  { label: "Engine", key: "engine" },
  { label: "Power", key: "power", higherIsBetter: true },
  { label: "Mileage", key: "mileage", higherIsBetter: true },
  { label: "Transmission", key: "transmission" },
  { label: "Fuel Types", key: "fuel_types" },
  { label: "Price Range", key: "price_range_new" },
  { label: "Ground Clearance", key: "ground_clearance", higherIsBetter: true },
  { label: "Boot Space", key: "boot_space", higherIsBetter: true },
  { label: "Seating Capacity", key: "seating_capacity", higherIsBetter: true },
  { label: "Safety Rating", key: "safety_rating" }
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

    <main
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a",
        padding: "40px 20px"
      }}
    >

      <div
        style={{
          maxWidth: "1200px",
          margin: "auto"
        }}
      >

        <a
          href="/carcyclopedia"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
            display: "inline-block",
            marginBottom: "20px"
          }}
        >
          ← Back to Carcyclopedia
        </a>

        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px"
          }}
        >
          Compare Cars
        </h1>

        <p
          style={{
            color: "#475569",
            marginBottom: "30px"
          }}
        >
          Highlighted values show the best figure across the cars you picked.
        </p>

        {loading ? (

          <p>Loading...</p>

        ) : cars.length === 0 ? (

          <p>No cars selected. Go back and pick some cars to compare.</p>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(15,23,42,.08)"
              }}
            >

              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      background: "#f1f5f9",
                      minWidth: "160px"
                    }}
                  >
                    Spec
                  </th>

                  {cars.map((car) => (

                    <th
                      key={car.slug}
                      style={{
                        padding: "16px",
                        background: "#f1f5f9",
                        minWidth: "220px"
                      }}
                    >

                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          marginBottom: "10px"
                        }}
                      />

                      <div style={{ fontSize: "16px", fontWeight: "700" }}>
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
                      style={{
                        background: i % 2 === 0 ? "white" : "#f8fafc"
                      }}
                    >

                      <td
                        style={{
                          padding: "14px 16px",
                          fontWeight: "600",
                          color: "#475569",
                          borderTop: "1px solid #e2e8f0"
                        }}
                      >
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
                            style={{
                              padding: "14px 16px",
                              borderTop: "1px solid #e2e8f0",
                              background: isBest ? "#dcfce7" : "transparent",
                              fontWeight: isBest ? "700" : "400",
                              color: isBest ? "#166534" : "#0f172a"
                            }}
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
    <Suspense fallback={<p style={{ padding: "40px" }}>Loading...</p>}>
      <CompareContent />
    </Suspense>
  );

}