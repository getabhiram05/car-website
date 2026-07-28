const SUPABASE_URL = "https://uhdzqjkogggxpnuehcma.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZHpxamtvZ2dneHBudWVoY21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNDY1MzIsImV4cCI6MjEwMDYyMjUzMn0.ca16_A3LG7nbcsRPxslhaCJ2QNXR9DCnYit7RVFdTV8";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/carcyclopedia?select=slug,make,model,wiki_title`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const cars = await res.json();

  console.log(`Checking ${cars.length} cars...\n`);

  for (const car of cars) {
    try {
      const wikiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          car.wiki_title
        )}`,
        {
          headers: {
            "User-Agent": "CarcyclopediaBot/1.0 (contact: youremail@example.com)",
          },
        }
      );

      if (!wikiRes.ok) {
        console.log(`❌ MISSING PAGE (status ${wikiRes.status}) | ${car.make} ${car.model} | wiki_title: "${car.wiki_title}"`);
        await wait(300);
        continue;
      }

      const data = await wikiRes.json();

      if (!data.thumbnail?.source) {
        console.log(`⚠️  NO IMAGE     | ${car.make} ${car.model} | wiki_title: "${car.wiki_title}" | page: "${data.title}"`);
      } else if (data.type === "disambiguation") {
        console.log(`❓ DISAMBIGUATION| ${car.make} ${car.model} | wiki_title: "${car.wiki_title}"`);
      } else {
        console.log(`✅ OK            | ${car.make} ${car.model} | page: "${data.title}"`);
      }
    } catch (err) {
      console.log(`❌ ERROR         | ${car.make} ${car.model} | ${err.message}`);
    }

    await wait(300);
  }
}

run();