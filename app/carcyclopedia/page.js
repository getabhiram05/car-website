"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Carcyclopedia() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      const { data, error } = await supabase
        .from("carcyclopedia")
        .select("*")
        .order("make", { ascending: true });

      if (error) {
        console.error("Error loading carcyclopedia:", error);
        setLoading(false);
        return;
      }

      const carsWithImages = await Promise.all(
        data.map(async (car) => {
          try {
            const response = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                car.wiki_title
              )}`
            );
            if (response.ok) {
              const wikiData = await response.json();
              return {
                ...car,
                image:
                  wikiData.thumbnail?.source ||
                  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
              };
            }
          } catch (err) {
            console.error("Wiki image fetch failed for", car.slug);
          }
          return {
            ...car,
            image:
              "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
          };
        })
      );

      setCars(carsWithImages);
      setLoading(false);
    }

    loadCars();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(cars.map((car) => car.category))),
  ];

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || car.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", margin: "0 0 10px 0" }}>
            Carcyclopedia
          </h1>
          <p style={{ margin: 0, color: "#475569", fontSize: "16px" }}>
            An enthusiast&apos;s guide to popular cars in India — specs,
            history, and everything in between.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <input
            placeholder="Search make or model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 250px",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        {!loading && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border:
                    category === cat
                      ? "1px solid #2563eb"
                      : "1px solid #cbd5e1",
                  backgroundColor: category === cat ? "#2563eb" : "white",
                  color: category === cat ? "white" : "#0f172a",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ color: "#475569" }}>Loading cars...</p>
        ) : filteredCars.length === 0 ? (
          <p style={{ color: "#475569" }}>No cars match your search.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredCars.map((car) => (
              <a
                key={car.slug}
                href={`/carcyclopedia/${car.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  border: "1px solid #e2e8f0",
                  display: "block",
                }}
              >
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: "#eff6ff",
                      color: "#1d4ed8",
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      marginBottom: "10px",
                    }}
                  >
                    {car.category}
                  </div>

                  <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>
                    {car.make} {car.model}
                  </h3>

                  <p style={{ margin: 0, color: "#475569", fontSize: "14px" }}>
                    Since {car.launch_year} • {car.mileage}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}