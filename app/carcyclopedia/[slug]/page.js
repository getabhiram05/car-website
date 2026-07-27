"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function CarcyclopediaDetail() {
  const params = useParams();
  const [car, setCar] = useState(null);
  const [history, setHistory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadCar() {
      const { data, error } = await supabase
        .from("carcyclopedia")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCar(data);

      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            data.wiki_title
          )}`
        );

        if (response.ok) {
          const wikiData = await response.json();
          setHistory(wikiData.extract || "No history available for this car.");
          setImage(
            wikiData.thumbnail?.source ||
              "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
          );
        } else {
          setHistory("No history available for this car.");
          setImage(
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
          );
        }
      } catch (err) {
        setHistory("Could not load history right now.");
        setImage(
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
        );
      }

      setLoading(false);
    }

    loadCar();
  }, [params.slug]);

  if (notFound) {
    return (
      <main
        style={{
          padding: "60px 20px",
          textAlign: "center",
          color: "#0f172a",
        }}
      >
        <h1>Car not found</h1>
        <a href="/carcyclopedia" style={{ color: "#2563eb" }}>
          Back to Carcyclopedia
        </a>
      </main>
    );
  }

  if (loading) {
    return (
      <main
        style={{
          padding: "60px 20px",
          textAlign: "center",
          color: "#475569",
        }}
      >
        Loading...
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a
          href="/carcyclopedia"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Carcyclopedia
        </a>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <img
            src={image}
            alt={`${car.make} ${car.model}`}
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
              display: "block",
            }}
          />

          <div style={{ padding: "30px" }}>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#eff6ff",
                color: "#1d4ed8",
                fontSize: "13px",
                fontWeight: "700",
                padding: "6px 14px",
                borderRadius: "999px",
                marginBottom: "14px",
              }}
            >
              {car.category}
            </div>

            <h1 style={{ margin: "0 0 20px 0", fontSize: "36px" }}>
              {car.make} {car.model}
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "30px",
              }}
            >
              <SpecBox label="Launched" value={car.launch_year} />
              <SpecBox label="Current Gen Since" value={car.current_gen_since} />
              <SpecBox label="Engine" value={car.engine} />
              <SpecBox label="Power" value={car.power} />
              <SpecBox label="Mileage" value={car.mileage} />
              <SpecBox label="Transmission" value={car.transmission} />
              <SpecBox label="Fuel Types" value={car.fuel_types} />
              <SpecBox label="Price (New)" value={car.price_range_new} />
            </div>

            <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>
              History
            </h2>

            <p
              style={{
                color: "#334155",
                lineHeight: "1.7",
                fontSize: "15px",
              }}
            >
              {history}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function SpecBox({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        borderRadius: "14px",
        padding: "14px 16px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          fontWeight: "700",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "15px", fontWeight: "600" }}>{value}</div>
    </div>
  );
}