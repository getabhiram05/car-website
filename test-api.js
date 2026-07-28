const API_KEY = "geyIMVDpUqYF79AlhkX5RIeBlTApCrRTqCgUlAIg";

const testCars = ["Swift", "Nexon", "Creta", "XUV700", "Civic"];

async function testCar(model) {
  const response = await fetch(
    `https://api.api-ninjas.com/v1/cars?model=${encodeURIComponent(model)}`,
    { headers: { "X-Api-Key": API_KEY } }
  );
  const data = await response.json();
  console.log(`\n=== Results for "${model}" ===`);
  console.log(JSON.stringify(data, null, 2));
}

async function runAll() {
  for (const car of testCars) {
    await testCar(car);
  }
}

runAll();