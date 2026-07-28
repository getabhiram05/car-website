"use client";

import { useState } from "react";

export default function AdminCarcyclopedia() {
  const [jsonText, setJsonText] = useState("");
  const [car, setCar] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  function previewCar() {
    try {
      const parsed = JSON.parse(jsonText);

      setCar(parsed);
      setError("");
    } catch {
      setCar(null);
      setError("Invalid JSON");
    }
  }

  function handleImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          Carcyclopedia Admin
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Paste JSON, upload an image, preview the car, then add it.
        </p>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2>Paste JSON</h2>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`{
  "slug":"mahindra-scorpio-n",
  "make":"Mahindra",
  "model":"Scorpio N"
}`}
            style={{
              width: "100%",
              height: "280px",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontFamily: "monospace",
              fontSize: "14px",
              marginTop: "10px",
              resize: "vertical",
            }}
          />

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <h2>Choose Image</h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {image && (
              <p
                style={{
                  marginTop: "10px",
                  color: "#16a34a",
                }}
              >
                Selected: {image.name}
              </p>
            )}
          </div>

          <button
            onClick={previewCar}
            style={{
              marginTop: "25px",
              padding: "12px 24px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Preview
          </button>

          {error && (
            <p
              style={{
                color: "red",
                marginTop: "20px",
              }}
            >
              {error}
            </p>
          )}
        </div>

        {car && (
          <div
            style={{
              marginTop: "35px",
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            {imagePreview && (
              <img
                src={imagePreview}
                alt=""
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                }}
              />
            )}

            <div
              style={{
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontWeight: "600",
                }}
              >
                {car.category}
              </div>

              <h2
                style={{
                  marginTop: "18px",
                  marginBottom: "8px",
                }}
              >
                {car.make} {car.model}
              </h2>

              <p>
                <strong>Launch:</strong> {car.launch_year}
              </p>

              <p>
                <strong>Engine:</strong> {car.engine}
              </p>

              <p>
                <strong>Power:</strong> {car.power}
              </p>

              <p>
                <strong>Mileage:</strong> {car.mileage}
              </p>

              <p>
                <strong>Transmission:</strong> {car.transmission}
              </p>

              <p>
                <strong>Fuel:</strong> {car.fuel_types}
              </p>

              <p>
                <strong>Price:</strong> {car.price_range_new}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}