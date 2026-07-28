"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80";

export default function CarcyclopediaDetail() {
  const params = useParams();

  const [car, setCar] = useState(null);
  const [history, setHistory] = useState("");
  const [image, setImage] = useState(FALLBACK_IMAGE);
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


      // Supabase image first
      if (data.image_url) {
        setImage(data.image_url);
      }


      // Wikipedia fallback
      try {

        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            data.wiki_title
          )}`
        );


        if (response.ok) {

          const wikiData = await response.json();


          setHistory(
            wikiData.extract ||
            "No history available for this car."
          );


          if (!data.image_url) {

            setImage(
              wikiData.thumbnail?.source ||
              FALLBACK_IMAGE
            );

          }


        } else {

          setHistory(
            "No history available for this car."
          );

        }


      } catch (err) {

        console.error(
          "Wikipedia fetch failed:",
          err
        );

        setHistory(
          "Could not load history right now."
        );

      }


      setLoading(false);

    }


    if (params.slug) {
      loadCar();
    }


  }, [params.slug]);



  if (loading) {

    return (
      <main
        style={{
          padding:"60px",
          textAlign:"center"
        }}
      >
        Loading...
      </main>
    );

  }



  if (notFound) {

    return (
      <main
        style={{
          padding:"60px",
          textAlign:"center"
        }}
      >

        <h1>
          Car not found
        </h1>

        <a href="/carcyclopedia">
          Back to Carcyclopedia
        </a>

      </main>
    );

  }



  return (

    <main
      style={{
        background:"#f8fafc",
        minHeight:"100vh",
        padding:"40px 20px",
        color:"#0f172a"
      }}
    >

      <div
        style={{
          maxWidth:"900px",
          margin:"auto"
        }}
      >


        <a
          href="/carcyclopedia"
          style={{
            color:"#2563eb",
            textDecoration:"none",
            fontWeight:"600"
          }}
        >
          ← Back to Carcyclopedia
        </a>



        <div
          style={{
            marginTop:"20px",
            background:"white",
            borderRadius:"24px",
            overflow:"hidden",
            border:"1px solid #e2e8f0",
            boxShadow:
              "0 10px 30px rgba(15,23,42,0.08)"
          }}
        >


          <img
            src={image}
            alt={`${car.make} ${car.model}`}
            style={{
              width:"100%",
              height:"320px",
              objectFit:"cover"
            }}
          />



          <div
            style={{
              padding:"30px"
            }}
          >


            <div
              style={{
                display:"inline-block",
                background:"#eff6ff",
                color:"#1d4ed8",
                padding:"6px 14px",
                borderRadius:"999px",
                fontWeight:"700",
                fontSize:"13px"
              }}
            >
              {car.category}
            </div>



            <h1
              style={{
                fontSize:"36px",
                margin:"18px 0"
              }}
            >
              {car.make} {car.model}
            </h1>



            <h2 style={{ marginTop: "10px", marginBottom: "18px" }}>
  Overview
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "35px"
  }}
>
  <SpecBox label="Launch Year" value={car.launch_year}/>
  <SpecBox label="Current Generation" value={car.current_gen_since}/>
  <SpecBox label="Category" value={car.category}/>
  <SpecBox label="Body Type" value={car.body_type}/>
  <SpecBox label="Segment" value={car.segment}/>
  <SpecBox label="Manufacturer" value={car.manufacturer}/>
  <SpecBox label="Country" value={car.country}/>
  <SpecBox label="Production Status" value={car.production_status}/>
</div>

<h2 style={{ marginBottom: "18px" }}>
  Engine & Transmission
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "35px"
  }}
>
  <SpecBox label="Engine" value={car.engine}/>
  <SpecBox label="Displacement" value={car.displacement_cc ? `${car.displacement_cc} cc` : null}/>
  <SpecBox label="Cylinders" value={car.cylinders}/>
  <SpecBox label="Power" value={car.power}/>
  <SpecBox label="Torque" value={car.torque}/>
  <SpecBox label="Fuel Type" value={car.fuel_types}/>
  <SpecBox label="Transmission" value={car.transmission}/>
  <SpecBox label="Drivetrain" value={car.drivetrain}/>
</div>

<h2 style={{ marginBottom: "18px" }}>
  Performance
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "35px"
  }}
>
  <SpecBox label="Mileage" value={car.mileage}/>
  <SpecBox label="City Mileage" value={car.city_mileage}/>
  <SpecBox label="Highway Mileage" value={car.highway_mileage}/>
  <SpecBox label="Top Speed" value={car.top_speed}/>
  <SpecBox label="0-100 km/h" value={car.acceleration_0_100}/>
  <SpecBox label="Fuel Tank" value={car.fuel_tank_capacity}/>
</div>

<h2 style={{ marginBottom: "18px" }}>
  Dimensions
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "35px"
  }}
>
  <SpecBox label="Length" value={car.length}/>
  <SpecBox label="Width" value={car.width}/>
  <SpecBox label="Height" value={car.height}/>
  <SpecBox label="Wheelbase" value={car.wheelbase}/>
  <SpecBox label="Ground Clearance" value={car.ground_clearance}/>
  <SpecBox label="Boot Space" value={car.boot_space}/>
  <SpecBox label="Kerb Weight" value={car.kerb_weight}/>
</div>
<h2
  style={{
    marginBottom:"18px"
  }}
>
  Safety
</h2>

<div
  style={{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
    gap:"16px",
    marginBottom:"35px"
  }}
>
  <SpecBox label="Airbags" value={car.airbags}/>
  <SpecBox label="ABS" value={car.abs}/>
  <SpecBox label="EBD" value={car.ebd}/>
  <SpecBox label="ESP" value={car.esp}/>
  <SpecBox label="Rear Camera" value={car.rear_camera}/>
  <SpecBox label="Parking Sensors" value={car.parking_sensors}/>
</div>


<h2
  style={{
    marginBottom:"18px"
  }}
>
  Features
</h2>

<div
  style={{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
    gap:"16px",
    marginBottom:"35px"
  }}
>
  <SpecBox label="Climate Control" value={car.climate_control}/>
  <SpecBox label="Cruise Control" value={car.cruise_control}/>
  <SpecBox label="Sunroof" value={car.sunroof}/>
  <SpecBox label="Android Auto" value={car.android_auto}/>
  <SpecBox label="Apple CarPlay" value={car.apple_carplay}/>
  <SpecBox label="Seating Capacity" value={car.seating_capacity}/>
</div>


<h2
  style={{
    marginBottom:"18px"
  }}
>
  Pricing & Rivals
</h2>

<div
  style={{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
    gap:"16px",
    marginBottom:"35px"
  }}
>
  <SpecBox label="New Price" value={car.price_range_new}/>
  <SpecBox label="Used Price" value={car.price_range_used}/>
  <SpecBox label="Rivals" value={car.rivals}/>
</div>


<div
  style={{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
    gap:"20px",
    marginBottom:"40px"
  }}
>

  <div
    style={{
      background:"#ecfdf5",
      border:"1px solid #10b981",
      borderRadius:"16px",
      padding:"20px"
    }}
  >
    <h2
      style={{
        marginTop:0,
        color:"#047857"
      }}
    >
      👍 Pros
    </h2>

    <p
      style={{
        margin:0,
        lineHeight:"1.7"
      }}
    >
      {car.pros || "N/A"}
    </p>

  </div>


  <div
    style={{
      background:"#fef2f2",
      border:"1px solid #ef4444",
      borderRadius:"16px",
      padding:"20px"
    }}
  >
    <h2
      style={{
        marginTop:0,
        color:"#b91c1c"
      }}
    >
      👎 Cons
    </h2>

    <p
      style={{
        margin:0,
        lineHeight:"1.7"
      }}
    >
      {car.cons || "N/A"}
    </p>

  </div>

</div>



            <h2
              style={{
                marginTop:"35px"
              }}
            >
              History
            </h2>


            <p
              style={{
                color:"#475569",
                lineHeight:"1.7"
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



function SpecBox({label,value}) {

  return (

    <div
      style={{
        background:"#f8fafc",
        border:"1px solid #e2e8f0",
        borderRadius:"14px",
        padding:"14px"
      }}
    >

      <div
        style={{
          fontSize:"12px",
          color:"#64748b",
          fontWeight:"700",
          textTransform:"uppercase"
        }}
      >
        {label}
      </div>


      <div
        style={{
          marginTop:"5px",
          fontWeight:"600"
        }}
      >
        {value || "N/A"}
      </div>


    </div>

  );

}