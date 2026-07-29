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
      <main className="min-h-screen bg-[#05070d] p-16 text-center text-slate-300">
        Loading...
      </main>
    );

  }



  if (notFound) {

    return (

      <main className="min-h-screen bg-[#05070d] p-16 text-center text-slate-300">

        <h1 className="text-2xl font-bold text-white">
          Car not found
        </h1>

        <a href="/carcyclopedia" className="mt-3 inline-block font-semibold text-cyan-400">
          Back to Carcyclopedia
        </a>

      </main>
    );

  }



  return (

    <main className="min-h-screen bg-[#05070d] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-4xl">


        <a
          href="/carcyclopedia"
          className="font-semibold text-cyan-400 no-underline hover:text-cyan-300"
        >
          ← Back to Carcyclopedia
        </a>



        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur">


          <img
            src={image}
            alt={`${car.make} ${car.model}`}
            className="h-80 w-full object-cover"
          />



          <div className="p-6 sm:p-8">


            <div className="inline-block rounded-full bg-cyan-500/10 px-3.5 py-1.5 text-sm font-bold text-cyan-300">
              {car.category}
            </div>



            <h1 className="my-4 text-3xl font-extrabold text-white sm:text-4xl">
              {car.make} {car.model}
            </h1>



            <h2 className="mb-4 mt-2 text-2xl font-bold text-white">
              Overview
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="Launch Year" value={car.launch_year}/>
              <SpecBox label="Current Generation" value={car.current_gen_since}/>
              <SpecBox label="Category" value={car.category}/>
              <SpecBox label="Body Type" value={car.body_type}/>
              <SpecBox label="Segment" value={car.segment}/>
              <SpecBox label="Manufacturer" value={car.manufacturer}/>
              <SpecBox label="Country" value={car.country}/>
              <SpecBox label="Production Status" value={car.production_status}/>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white">
              Engine & Transmission
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="Engine" value={car.engine}/>
              <SpecBox label="Displacement" value={car.displacement_cc ? `${car.displacement_cc} cc` : null}/>
              <SpecBox label="Cylinders" value={car.cylinders}/>
              <SpecBox label="Power" value={car.power}/>
              <SpecBox label="Torque" value={car.torque}/>
              <SpecBox label="Fuel Type" value={car.fuel_types}/>
              <SpecBox label="Transmission" value={car.transmission}/>
              <SpecBox label="Drivetrain" value={car.drivetrain}/>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white">
              Performance
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="Odometer" value={car.mileage}/>
              <SpecBox label="City Mileage" value={car.city_mileage}/>
              <SpecBox label="Highway Mileage" value={car.highway_mileage}/>
              <SpecBox label="Top Speed" value={car.top_speed}/>
              <SpecBox label="0-100 km/h" value={car.acceleration_0_100}/>
              <SpecBox label="Fuel Tank" value={car.fuel_tank_capacity}/>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white">
              Dimensions
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="Length" value={car.length}/>
              <SpecBox label="Width" value={car.width}/>
              <SpecBox label="Height" value={car.height}/>
              <SpecBox label="Wheelbase" value={car.wheelbase}/>
              <SpecBox label="Ground Clearance" value={car.ground_clearance}/>
              <SpecBox label="Boot Space" value={car.boot_space}/>
              <SpecBox label="Kerb Weight" value={car.kerb_weight}/>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white">
              Safety
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="Airbags" value={car.airbags}/>
              <SpecBox label="ABS" value={car.abs}/>
              <SpecBox label="EBD" value={car.ebd}/>
              <SpecBox label="ESP" value={car.esp}/>
              <SpecBox label="Rear Camera" value={car.rear_camera}/>
              <SpecBox label="Parking Sensors" value={car.parking_sensors}/>
            </div>


            <h2 className="mb-4 text-2xl font-bold text-white">
              Features
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="Climate Control" value={car.climate_control}/>
              <SpecBox label="Cruise Control" value={car.cruise_control}/>
              <SpecBox label="Sunroof" value={car.sunroof}/>
              <SpecBox label="Android Auto" value={car.android_auto}/>
              <SpecBox label="Apple CarPlay" value={car.apple_carplay}/>
              <SpecBox label="Seating Capacity" value={car.seating_capacity}/>
            </div>


            <h2 className="mb-4 text-2xl font-bold text-white">
              Pricing & Rivals
            </h2>

            <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecBox label="New Price" value={car.price_range_new}/>
              <SpecBox label="Used Price" value={car.price_range_used}/>
              <SpecBox label="Rivals" value={car.rivals}/>
            </div>


            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                <h2 className="mt-0 text-xl font-bold text-green-400">
                  Pros
                </h2>

                <p className="m-0 leading-relaxed text-slate-200">
                  {car.pros || "N/A"}
                </p>

              </div>


              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <h2 className="mt-0 text-xl font-bold text-red-400">
                  Cons
                </h2>

                <p className="m-0 leading-relaxed text-slate-200">
                  {car.cons || "N/A"}
                </p>

              </div>

            </div>



            <h2 className="mt-9 text-2xl font-bold text-white">
              History
            </h2>


            <p className="leading-relaxed text-slate-400">
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

    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5">

      <div className="text-xs font-bold uppercase text-slate-500">
        {label}
      </div>


      <div className="mt-1 font-semibold text-slate-100">
        {value || "N/A"}
      </div>


    </div>

  );

}