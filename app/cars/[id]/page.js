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
      <main className="min-h-screen bg-[#05070d] p-10 text-slate-100">
        <h1 className="text-2xl font-bold text-white">Car not found</h1>
        <p className="mt-2 text-slate-400">Route ID: {resolvedParams.id}</p>
        <p className="mt-1 text-slate-400">Please go back and try another car.</p>
        <Link href="/cars" className="mt-4 inline-block font-semibold text-cyan-400">
          Back to listings
        </Link>
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

  const detailItems = [
    { label: "Year", value: selectedCar.year },
    {
      label: "Odometer",
      value: selectedCar.mileage
        ? `${selectedCar.mileage.toLocaleString("en-IN")} km`
        : "N/A",
    },
    { label: "Fuel", value: selectedCar.fuel },
    { label: "Transmission", value: selectedCar.transmission },
    { label: "Owner", value: selectedCar.owner || "N/A" },
    { label: "Color", value: selectedCar.color || "N/A" },
    { label: "Registration State", value: selectedCar.registration_state || "N/A" },
    { label: "Insurance Valid Till", value: formattedInsurance },
    { label: "Location", value: selectedCar.location },
    { label: "Seller", value: selectedCar.seller },
    { label: "Contact Number", value: selectedCar.seller_phone || "N/A" },
  ];

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur">
        <CarGallery images={selectedCar.images} alt={`${selectedCar.make} ${selectedCar.model}`} />

        <div className="p-6 sm:p-8">
          <Link
            href="/cars"
            className="mb-4 inline-block font-bold text-cyan-400 hover:text-cyan-300"
          >
            ← Back to listings
          </Link>

          <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
            {selectedCar.make} {selectedCar.model}
          </h1>

          <p className="mb-6 text-3xl font-extrabold text-cyan-400">
            ₹{new Intl.NumberFormat("en-IN").format(selectedCar.price)}
          </p>

          <div className="mb-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {detailItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5 leading-relaxed text-slate-300"
              >
                <strong className="text-slate-100">{item.label}</strong>
                <br />
                {item.value}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-2xl font-bold text-white">Description</h2>
            <p className="m-0 leading-relaxed text-slate-400">
              {selectedCar.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {selectedCar.features &&
              selectedCar.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-cyan-500/10 px-3.5 py-2.5 text-sm font-semibold text-cyan-300"
                >
                  {feature}
                </span>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}