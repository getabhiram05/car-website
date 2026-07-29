import Link from "next/link";
import CarGallery from "../../../components/CarGallery";
import { supabase } from "../../../lib/supabaseClient";

export default async function CarDetailPage({ params }) {
  const resolvedParams = await params;

  const { data: selectedCarRaw, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !selectedCarRaw) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <h1>Car not found</h1>
        <p>Route ID: {resolvedParams.id}</p>
        <p>Please go back and try another car.</p>
        <Link href="/cars">Back to listings</Link>
      </main>
    );
  }

  const selectedCar = {
    ...selectedCarRaw,
    images: selectedCarRaw.images ? JSON.parse(selectedCarRaw.images) : [],
    features: selectedCarRaw.features ? JSON.parse(selectedCarRaw.features) : [],
  };

  const formattedInsurance = selectedCar.insurance_valid_till
    ? new Date(selectedCar.insurance_valid_till).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <CarGallery images={selectedCar.images} alt={`${selectedCar.make} ${selectedCar.model}`} />

        <div style={{ padding: "24px" }}>
          <Link
            href="/cars"
            style={{
              display: "inline-block",
              marginBottom: "18px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            ← Back to listings
          </Link>

          <h1 style={{ margin: "0 0 10px 0", fontSize: "36px", color: "#0f172a" }}>
            {selectedCar.make} {selectedCar.model}
          </h1>

          <p style={{ margin: "0 0 20px 0", fontSize: "30px", fontWeight: "800", color: "#2563eb" }}>
            ₹{new Intl.NumberFormat("en-IN").format(selectedCar.price)}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <div style={detailBoxStyle}>
              <strong>Year</strong>
              <br />
              {selectedCar.year}
            </div>

            <div style={detailBoxStyle}>
              <strong>Mileage</strong>
              <br />
              {selectedCar.mileage ? selectedCar.mileage.toLocaleString("en-IN") : "N/A"} km
            </div>

            <div style={detailBoxStyle}>
              <strong>Fuel</strong>
              <br />
              {selectedCar.fuel}
            </div>

            <div style={detailBoxStyle}>
              <strong>Transmission</strong>
              <br />
              {selectedCar.transmission}
            </div>

            <div style={detailBoxStyle}>
              <strong>Owner</strong>
              <br />
              {selectedCar.owner || "N/A"}
            </div>

            <div style={detailBoxStyle}>
              <strong>Color</strong>
              <br />
              {selectedCar.color || "N/A"}
            </div>

            <div style={detailBoxStyle}>
              <strong>Registration State</strong>
              <br />
              {selectedCar.registration_state || "N/A"}
            </div>

            <div style={detailBoxStyle}>
              <strong>Insurance Valid Till</strong>
              <br />
              {formattedInsurance}
            </div>

            <div style={detailBoxStyle}>
              <strong>Location</strong>
              <br />
              {selectedCar.location}
            </div>

            <div style={detailBoxStyle}>
              <strong>Seller</strong>
              <br />
              {selectedCar.seller}
            </div>

            <div style={detailBoxStyle}>
              <strong>Contact Number</strong>
              <br />
              {selectedCar.seller_phone || "N/A"}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#0f172a" }}>
              Description
            </h2>
            <p style={{ color: "#475569", lineHeight: "1.8", margin: 0 }}>
              {selectedCar.description}
            </p>
          </div>

          <div>
            

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {selectedCar.features && selectedCar.features.map((feature) => (
                <span
                  key={feature}
                  style={{
                    backgroundColor: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "10px 14px",
                    borderRadius: "999px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const detailBoxStyle = {
  backgroundColor: "#f8fafc",
  padding: "14px",
  borderRadius: "14px",
  color: "#334155",
  lineHeight: "1.7",
};