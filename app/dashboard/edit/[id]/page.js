"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [owner, setOwner] = useState("1st Owner");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    async function loadCar() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push("/login");
        return;
      }

      const { data: car, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

      if (error || !car) {
        setErrorMessage("Listing not found.");
        setIsLoading(false);
        return;
      }

      if (car.seller_id !== userData.user.id) {
        router.push("/dashboard");
        return;
      }

      setMake(car.make || "");
      setModel(car.model || "");
      setYear(car.year || "");
      setPrice(car.price || "");
      setMileage(car.mileage || "");
      setFuel(car.fuel || "Petrol");
      setTransmission(car.transmission || "Manual");
      setOwner(car.owner || "1st Owner");
      setLocation(car.location || "");
      setColor(car.color || "");
      setDescription(car.description || "");

      const images = car.images ? JSON.parse(car.images) : [];
      setExistingImages(images);

      setIsLoading(false);
    }

    loadCar();
  }, [carId, router]);

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }

  function removeExistingImage(urlToRemove) {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
  }

  async function uploadImages(userId) {
    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return uploadedUrls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      router.push("/login");
      return;
    }

    let newImageUrls = [];

    try {
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        newImageUrls = await uploadImages(userData.user.id);
        setIsUploading(false);
      }
    } catch (uploadErr) {
      setIsUploading(false);
      setIsSaving(false);
      setErrorMessage(`Image upload failed: ${uploadErr.message}`);
      return;
    }

    const finalImages = [...existingImages, ...newImageUrls];

    const updatedCar = {
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuel,
      transmission,
      owner,
      location,
      color,
      description,
      images: JSON.stringify(finalImages),
    };

    const { error } = await supabase
      .from("cars")
      .update(updatedCar)
      .eq("id", carId);

    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("cars").delete().eq("id", carId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-slate-400">Loading listing...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Edit Listing
            </h1>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Delete Listing
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Make
                </label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Model
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Year
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Odometer (km)
                </label>
                <input
                  type="number"
                  required
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Fuel Type
                </label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>Electric</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                >
                  <option>Manual</option>
                  <option>Automatic</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Owner
                </label>
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                >
                  <option>1st Owner</option>
                  <option>2nd Owner</option>
                  <option>3rd Owner</option>
                  <option>4th Owner or more</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Current Photos
              </label>
              {existingImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {existingImages.map((url) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt="Car"
                        className="h-24 w-full rounded-lg border border-slate-700 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No photos on this listing yet.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Add More Photos (up to 5MB each)
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
              {selectedFiles.length > 0 ? (
                <p className="mt-1 text-xs text-slate-500">
                  {selectedFiles.length} new photo
                  {selectedFiles.length > 1 ? "s" : ""} selected
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-400">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading
                ? "Uploading photos..."
                : isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}