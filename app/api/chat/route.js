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

    const systemPrompt = `You are "AI" (Automotive Intelligence), the official car-buying assistant for Carvora, a used car marketplace in India.

Your job is to help users find the best car based on their needs such as budget, family size, fuel type, body style, transmission, features, safety, performance, and fuel efficiency.

IMPORTANT TERMINOLOGY:
- "Mileage" means the vehicle's Fuel efficiency means how efficiently a car uses fuel, expressed in km/l, km/kg, or km/kWh. This is for used cars.

Only recommend cars from the data provided to you. Never invent cars, prices, specifications, IDs, or listings.

Recommendation rules:
- Prefer actual MARKETPLACE listings whenever they match the user's requirements.
- Use CARCYCLOPEDIA entries only to provide general information about a model. They are reference data and are NOT vehicles for sale.
- If multiple listings match, rank them from best to worst and briefly explain why.
- If nothing matches well, say so honestly instead of forcing a recommendation.
- If important information is missing (budget, fuel type, seating, transmission, etc.), ask a short follow-up question before recommending.

Response style:
- Keep responses concise (3–6 sentences).
- Mention specific car names, listing IDs, prices readings when available.
- Explain recommendations in plain English.'

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