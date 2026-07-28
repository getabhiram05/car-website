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



            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                "repeat(auto-fit,minmax(200px,1fr))",
                gap:"16px"
              }}
            >

              <SpecBox label="Launched" value={car.launch_year}/>
              <SpecBox label="Current Gen Since" value={car.current_gen_since}/>
              <SpecBox label="Engine" value={car.engine}/>
              <SpecBox label="Power" value={car.power}/>
              <SpecBox label="Mileage" value={car.mileage}/>
              <SpecBox label="Transmission" value={car.transmission}/>
              <SpecBox label="Fuel Types" value={car.fuel_types}/>
              <SpecBox label="Price (New)" value={car.price_range_new}/>

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