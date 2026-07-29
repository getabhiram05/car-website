"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80";


export default function Carcyclopedia() {

  const [search, setSearch] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);


  useEffect(() => {

    async function loadCars() {

      const { data, error } = await supabase
        .from("carcyclopedia")
        .select("*")
        .order("make", { ascending: true });


      if (error) {

        console.error(
          "Error loading cars:",
          error
        );

        setLoading(false);
        return;

      }


      // Show cards instantly
      const instantCars = data.map((car) => ({
        ...car,
        image: car.image_url || FALLBACK_IMAGE
      }));


      setCars(instantCars);
      setLoading(false);



      // Fetch Wikipedia images in background
      data.forEach(async (car) => {

        if (car.image_url || !car.wiki_title) {
          return;
        }


        try {

          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              car.wiki_title
            )}`
          );


          if (!response.ok) return;


          const wikiData = await response.json();


          const wikiImage =
            wikiData.thumbnail?.source;


          if (wikiImage) {

            setCars((currentCars) =>

              currentCars.map((item) =>

                item.slug === car.slug
                  ? {
                      ...item,
                      image: wikiImage
                    }
                  : item

              )

            );

          }


        } catch (err) {

          console.log(
            "Wikipedia image failed:",
            car.slug
          );

        }


      });


    }


    loadCars();


  }, []);



  const filteredCars = cars.filter((car) => {

    const text = search.toLowerCase();


    const matchesSearch =
      car.make?.toLowerCase().includes(text) ||
      car.model?.toLowerCase().includes(text);


    return matchesSearch;

  });


  function toggleSelect(slug) {

    setSelected((current) => {

      if (current.includes(slug)) {
        return current.filter((s) => s !== slug);
      }

      if (current.length >= 4) {
        alert("You can compare up to 4 cars at a time.");
        return current;
      }

      return [...current, slug];

    });

  }


  return (

    <main
      style={{
        background:"#f8fafc",
        minHeight:"100vh",
        color:"#0f172a",
        padding:"40px 20px",
        paddingBottom: selected.length > 0 ? "110px" : "40px"
      }}
    >

      <div
        style={{
          maxWidth:"1200px",
          margin:"auto"
        }}
      >

        <h1
          style={{
            fontSize:"36px",
            marginBottom:"10px"
          }}
        >
          Carcyclopedia
        </h1>


        <p
          style={{
            color:"#475569",
            marginBottom:"30px"
          }}
        >
          An enthusiast's guide to popular cars in India —
          specs, history, and everything in between.
        </p>



        <input
          placeholder="Search make or model"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={{
            width:"100%",
            padding:"14px 16px",
            borderRadius:"12px",
            border:"1px solid #cbd5e1",
            marginBottom:"25px"
          }}
        />




        {loading ? (

          <p>
            Loading cars...
          </p>


        ) : filteredCars.length === 0 ? (

          <p>
            No cars found.
          </p>


        ) : (

          <div
            style={{
              display:"grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap:"20px"
            }}
          >

            {filteredCars.map((car)=>{

              const isSelected = selected.includes(car.slug);

              return (

                <div
                  key={car.slug}
                  style={{
                    position:"relative",
                    background:"white",
                    borderRadius:"20px",
                    overflow:"hidden",
                    border: isSelected
                      ? "2px solid #2563eb"
                      : "1px solid #e2e8f0",
                    boxShadow:
                      "0 10px 30px rgba(15,23,42,.08)"
                  }}
                >

                  <label
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position:"absolute",
                      top:"12px",
                      left:"12px",
                      zIndex:2,
                      background:"white",
                      borderRadius:"8px",
                      padding:"6px 10px",
                      display:"flex",
                      alignItems:"center",
                      gap:"6px",
                      fontSize:"13px",
                      fontWeight:"600",
                      boxShadow:"0 2px 8px rgba(15,23,42,.15)",
                      cursor:"pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(car.slug)}
                    />
                    Compare
                  </label>


                  <a
                    href={`/carcyclopedia/${car.slug}`}
                    style={{
                      textDecoration:"none",
                      color:"inherit",
                      display:"block"
                    }}
                  >

                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      loading="lazy"
                      style={{
                        width:"100%",
                        height:"180px",
                        objectFit:"cover"
                      }}
                    />


                    <div
                      style={{
                        padding:"16px"
                      }}
                    >

                      <span
                        style={{
                          background:"#eff6ff",
                          color:"#1d4ed8",
                          padding:"4px 10px",
                          borderRadius:"999px",
                          fontSize:"12px",
                          fontWeight:"700"
                        }}
                      >
                        {car.category}
                      </span>


                      <h3
                        style={{
                          fontSize:"20px",
                          margin:"12px 0 6px"
                        }}
                      >
                        {car.make} {car.model}
                      </h3>


                      <p
                        style={{
                          color:"#475569",
                          margin:0
                        }}
                      >
                        Since {car.launch_year} • {car.mileage}
                      </p>

                    </div>


                  </a>


                </div>

              );

            })}

          </div>

        )}


      </div>


      {selected.length > 0 && (

        <div
          style={{
            position:"fixed",
            bottom:0,
            left:0,
            right:0,
            background:"#0f172a",
            color:"white",
            padding:"16px 20px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            flexWrap:"wrap",
            gap:"12px",
            zIndex:10
          }}
        >

          <span>
            {selected.length} car{selected.length > 1 ? "s" : ""} selected
            {selected.length < 2 ? " — pick at least 2 to compare" : ""}
          </span>


          <div style={{ display:"flex", gap:"10px" }}>

            <button
              onClick={() => setSelected([])}
              style={{
                padding:"10px 16px",
                borderRadius:"10px",
                border:"1px solid #475569",
                background:"transparent",
                color:"white",
                cursor:"pointer"
              }}
            >
              Clear
            </button>


            <a
              href={
                selected.length >= 2
                  ? `/carcyclopedia/compare?slugs=${selected.join(",")}`
                  : undefined
              }
              style={{
                padding:"10px 16px",
                borderRadius:"10px",
                background: selected.length >= 2 ? "#2563eb" : "#334155",
                color:"white",
                textDecoration:"none",
                pointerEvents: selected.length >= 2 ? "auto" : "none",
                cursor: selected.length >= 2 ? "pointer" : "not-allowed"
              }}
            >
              Compare Now
            </a>

          </div>

        </div>

      )}


    </main>

  );

}