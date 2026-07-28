import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Pull real listings from the marketplace (cars table)
    const { data: marketplaceCars } = await supabaseAdmin
      .from("cars")
      .select("id, make, model, year, price, mileage, fuel, transmission, owner, location")
      .limit(30);

    // Pull a sample from carcyclopedia for general model info
    const { data: encyclopediaCars } = await supabaseAdmin
      .from("carcyclopedia")
      .select("slug, make, model, category, price_range_new, mileage, fuel_types, seating_capacity")
      .limit(60);

    const marketplaceList = (marketplaceCars || [])
      .map(
        (c) =>
          `- [Marketplace] ${c.make} ${c.model} (${c.year}), ₹${c.price}, ${c.mileage} km, ${c.fuel}, ${c.transmission}, ${c.owner}, in ${c.location} (id: ${c.id})`
      )
      .join("\n");

    const encyclopediaList = (encyclopediaCars || [])
      .map(
        (c) =>
          `- [Carcyclopedia] ${c.make} ${c.model} - ${c.category}, price ${c.price_range_new}, mileage ${c.mileage}, fuel ${c.fuel_types}, seats ${c.seating_capacity} (slug: ${c.slug})`
      )
      .join("\n");

    const systemPrompt = `You are "AI" (Automotive Intelligence), a helpful car-buying assistant for Car Becho, a used car marketplace in India.

A customer will describe what they need (budget, family size, fuel preference, usage, etc). Your job is to recommend the best matching cars ONLY from the lists below - never invent cars that aren't listed.

Prefer recommending real MARKETPLACE listings (actual cars for sale right now) when they fit. Use CARCYCLOPEDIA entries only to give general model advice/context (these are not for sale, just reference info).

Keep your answer short and friendly - 3-5 sentences, mention specific car names and prices/ids when relevant. If nothing matches well, say so honestly instead of forcing a recommendation.

MARKETPLACE LISTINGS (actual cars for sale):
${marketplaceList || "No marketplace listings currently available."}

CARCYCLOPEDIA REFERENCE (for general model context only, not for sale):
${encyclopediaList || "No reference data available."}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(
      `${systemPrompt}\n\nCustomer message: ${userMessage}`
    );

    const reply = result.response.text();

    return Response.json({ reply });

  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}