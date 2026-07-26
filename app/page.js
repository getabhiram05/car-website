"use client";

import { useState } from "react";

const featuredCars = [
  {
    id: "maruti-swift-dzire-2021",
    title: "Maruti Suzuki Swift Dzire",
    year: 2021,
    price: "₹6.75 Lakh",
    mileage: "32,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    location: "Delhi",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "hyundai-creta-2020",
    title: "Hyundai Creta",
    year: 2020,
    price: "₹9.80 Lakh",
    mileage: "41,000 km",
    fuel: "Diesel",
    transmission: "Manual",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "honda-city-2019",
    title: "Honda City",
    year: 2019,
    price: "₹8.90 Lakh",
    mileage: "38,500 km",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Bengaluru",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "tata-nexon-2022",
    title: "Tata Nexon",
    year: 2022,
    price: "₹11.25 Lakh",
    mileage: "18,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    location: "Pune",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mahindra-scorpio-2018",
    title: "Mahindra Scorpio",
    year: 2018,
    price: "₹9.50 Lakh",
    mileage: "57,000 km",
    fuel: "Diesel",
    transmission: "Manual",
    location: "Jaipur",
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "toyota-innova-crysta-2021",
    title: "Toyota Innova Crysta",
    year: 2021,
    price: "₹17.90 Lakh",
    mileage: "29,000 km",
    fuel: "Diesel",
    transmission: "Automatic",
    location: "Chennai",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  const [homeSearch, setHomeSearch] = useState("");

  function handleSearch() {
    const trimmedSearch = homeSearch.trim();

    if (trimmedSearch) {
      window.location.href = `/cars?search=${encodeURIComponent(trimmedSearch)}`;
    } else {
      window.location.href = "/cars";
    }
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleFeaturedCompare(carId) {
    window.location.href = `/cars?compare=${encodeURIComponent(carId)}`;
  }

  return (
    <main
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#1d4ed8",
                padding: "8px 14px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "18px",
              }}
            >
              India&apos;s Modern Car Marketplace
            </div>

            <h1
              style={{
                fontSize: "clamp(32px, 6vw, 56px)",
                lineHeight: "1.1",
                margin: "0 0 16px 0",
                fontWeight: "800",
              }}
            >
              Buy and sell used cars with confidence
            </h1>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7",
                color: "#cbd5e1",
                marginBottom: "24px",
                maxWidth: "600px",
              }}
            >
              Browse popular cars in India, compare prices, view details, and
              connect buyers with sellers on one simple platform.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <a
                href="/cars"
                style={{
                  display: "inline-block",
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                  padding: "14px 22px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Browse Cars
              </a>

              <a
                href="#seller-section"
                style={{
                  display: "inline-block",
                  backgroundColor: "white",
                  color: "#0f172a",
                  textDecoration: "none",
                  padding: "14px 22px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Sell Your Car
              </a>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
              alt="Car"
              style={{
                width: "100%",
                height: "280px",
                objectFit: "cover",
                borderRadius: "18px",
                display: "block",
              }}
            />

            <div style={{ paddingTop: "16px", color: "#0f172a" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>
                Find the right car faster
              </h3>
              <p style={{ margin: 0, color: "#475569", lineHeight: "1.6" }}>
                Search by budget, make, year, fuel type, and location with a
                clean mobile-friendly experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 20px", marginTop: "-30px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            <input
              placeholder="Search make or model"
              style={inputStyle}
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />

            <select style={inputStyle} defaultValue="">
              <option value="" disabled>
                Select budget
              </option>
              <option>Under ₹5 Lakh</option>
              <option>₹5 - ₹10 Lakh</option>
              <option>₹10 - ₹15 Lakh</option>
              <option>₹15 Lakh+</option>
            </select>

            <select style={inputStyle} defaultValue="">
              <option value="" disabled>
                Select year
              </option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
            </select>

            <select style={inputStyle} defaultValue="">
              <option value="" disabled>
                Fuel type
              </option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>

            <button
              type="button"
              onClick={handleSearch}
              style={{
                display: "inline-block",
                backgroundColor: "#0f172a",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "14px 16px",
                fontSize: "16px",
                fontWeight: "700",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Search Cars
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "50px 20px 20px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "32px" }}>
                Featured Cars
              </h2>
              <p style={{ margin: 0, color: "#475569" }}>
                Popular used cars from trusted sellers
              </p>
            </div>

            <a
              href="/cars"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "#0f172a",
                textDecoration: "none",
                border: "1px solid #cbd5e1",
                padding: "12px 16px",
                borderRadius: "12px",
                fontWeight: "700",
              }}
            >
              View All Listings
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {featuredCars.map((car) => (
              <div
                key={car.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <img
                  src={car.image}
                  alt={car.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div style={{ padding: "18px" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "22px" }}>
                    {car.title}
                  </h3>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#475569",
                      marginBottom: "10px",
                    }}
                  >
                    {car.year} • {car.fuel} • {car.transmission}
                  </div>

                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: "800",
                      marginBottom: "10px",
                    }}
                  >
                    {car.price}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "16px",
                      color: "#334155",
                      fontSize: "14px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "10px",
                        borderRadius: "12px",
                      }}
                    >
                      <strong>Mileage</strong>
                      <br />
                      {car.mileage}
                    </div>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "10px",
                        borderRadius: "12px",
                      }}
                    >
                      <strong>Location</strong>
                      <br />
                      {car.location}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={`/cars/${car.id}`}
                      style={{
                        flex: 1,
                        display: "inline-block",
                        backgroundColor: "#2563eb",
                        color: "white",
                        textDecoration: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        fontWeight: "700",
                        textAlign: "center",
                      }}
                    >
                      View Details
                    </a>

                    <button
                      type="button"
                      onClick={() => handleFeaturedCompare(car.id)}
                      style={{
                        flex: 1,
                        backgroundColor: "#eff6ff",
                        color: "#1d4ed8",
                        border: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 20px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={infoCardStyle}>
            <h3 style={infoTitleStyle}>Easy Search</h3>
            <p style={infoTextStyle}>
              Buyers can quickly browse by make, model, year, budget, and fuel
              type.
            </p>
          </div>

          <div style={infoCardStyle}>
            <h3 style={infoTitleStyle}>Compare Cars</h3>
            <p style={infoTextStyle}>
              Shortlist 2 or 3 cars and compare their price, mileage, and key
              features side by side.
            </p>
          </div>

          <div style={infoCardStyle}>
            <h3 style={infoTitleStyle}>List Your Car</h3>
            <p style={infoTextStyle}>
              Sellers can create an account, upload photos, and post their car
              for buyers to discover.
            </p>
          </div>
        </div>
      </section>

      <section id="seller-section" style={{ padding: "20px 20px 70px 20px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            borderRadius: "24px",
            padding: "32px",
            color: "white",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "32px" }}>
              Ready to sell your car?
            </h2>
            <p style={{ margin: 0, lineHeight: "1.7", color: "#dbeafe" }}>
              Create your seller account, upload multiple photos, and reach car
              buyers across India.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              style={{
                backgroundColor: "white",
                color: "#1d4ed8",
                border: "none",
                padding: "14px 22px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Start Selling
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  outline: "none",
  backgroundColor: "white",
};

const infoCardStyle = {
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
  border: "1px solid #e2e8f0",
};

const infoTitleStyle = {
  margin: "0 0 10px 0",
  fontSize: "22px",
  color: "#0f172a",
};

const infoTextStyle = {
  margin: 0,
  color: "#475569",
  lineHeight: "1.7",
};