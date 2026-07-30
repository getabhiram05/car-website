"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MagicCard } from "@/components/ui/magic-card";
import { PixelImage } from "@/components/ui/pixel-image";

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
      className="min-h-screen bg-[#05070d] px-4 py-10 text-slate-100 sm:px-6 lg:px-8"
      style={{
        paddingBottom: selected.length > 0 ? "110px" : undefined
      }}
    >

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
          Carcyclopedia
        </h1>


        <p className="mb-8 text-lg text-slate-400">
          An enthusiast&apos;s guide to popular cars in India —
          specs, history, and everything in between.
        </p>



        <input
          placeholder="Search make or model"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3.5 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
        />




        {loading ? (

          <p className="text-slate-400">
            Loading cars...
          </p>


        ) : filteredCars.length === 0 ? (

          <p className="text-slate-400">
            No cars found.
          </p>


        ) : (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredCars.map((car)=>{

              const isSelected = selected.includes(car.slug);

              return (

                <MagicCard
                  key={car.slug}
                  className={`relative overflow-hidden rounded-2xl p-0 [--color-background:#0f172a] ${
                    isSelected
                      ? "border-2 border-cyan-500"
                      : "border border-slate-800"
                  }`}
                  gradientColor="#0e7490"
                  gradientOpacity={0.4}
                >

                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-3 top-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-950/90 px-2.5 py-1.5 text-sm font-semibold text-slate-100 shadow-lg"
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
                    className="block text-inherit no-underline"
                  >

                    <div className="h-[180px] w-full overflow-hidden">
  <PixelImage
    src={car.image}
    alt={`${car.make} ${car.model}`}
    className="h-full w-full"
  />
</div>


                    <div className="p-4">

                      <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
                        {car.category}
                      </span>


                      <h3 className="my-3 text-xl font-bold text-white">
                        {car.make} {car.model}
                      </h3>


                      <p className="m-0 text-slate-400">
                        Since {car.launch_year} • {car.mileage}
                      </p>

                    </div>


                  </a>


                </MagicCard>

              );

            })}

          </div>

        )}


      </div>


      {selected.length > 0 && (

        <div className="fixed inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#05070d]/95 px-5 py-4 backdrop-blur">

          <span className="text-slate-200">
            {selected.length} car{selected.length > 1 ? "s" : ""} selected
            {selected.length < 2 ? " — pick at least 2 to compare" : ""}
          </span>


          <div className="flex gap-2.5">

            <button
              onClick={() => setSelected([])}
              className="rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-slate-100"
            >
              Clear
            </button>


            <a
              href={
                selected.length >= 2
                  ? `/carcyclopedia/compare?slugs=${selected.join(",")}`
                  : undefined
              }
              className={`rounded-lg px-4 py-2.5 text-white no-underline ${
                selected.length >= 2
                  ? "cursor-pointer bg-cyan-500 text-slate-950"
                  : "pointer-events-none cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
            >
              Compare Now
            </a>

          </div>

        </div>

      )}


    </main>

  );

}