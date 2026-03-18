// Import plant card builder from the plants module
import { buildPlantCard } from "./plants.js";


// API endpoint used to retrieve plant data
// Updated API endpoints
const API_URLS = [
  "https://www.perenual.com/api/v2/species-list?key=sk-2cHp69b9f5142655c15545",
  // FloraAPI endpoint with provided key
  "https://floraapi.com/api/v1/plants?key=pk_CxAKhiCEpQzYTx8U30fpILD45A4XaRZc"
];
// AgFarmAPI for vegetables page only
const AGFARM_API_URL = "https://agfarmapi.com/api/v1/plants/search?q=vegetable";


// Get plant container from the HTML page
const plantContainer = document.getElementById("plant-container");


// LocalStorage key for saving the garden plan
const STORAGE_KEY = "gardenPlan";


// Retrieve garden plan from localStorage
function getGardenPlan() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}


// Save garden plan to localStorage
function saveGardenPlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}


// Fetch plant data from the API
// Try each API in order until one returns valid data
async function fetchPlants() {
  const page = window.location.pathname;
  // Use AgFarmAPI for vegetables page
  if (page.includes("vegetables.html")) {
    try {
      const response = await fetch(AGFARM_API_URL);
      const data = await response.json();
      // agfarmapi: { plants: [...] }
      if (data && Array.isArray(data.plants)) return data.plants;
      // fallback: direct array
      if (Array.isArray(data)) return data;
    } catch (error) {
      console.error("AgFarmAPI error:", error);
    }
  }
  // Otherwise, try other APIs
  for (const url of API_URLS) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      // Try common response formats
      if (data) {
        // perenual: { data: [...] }
        if (Array.isArray(data.data)) return data.data;
        // floraapi: { plants: [...] }
        if (Array.isArray(data.plants)) return data.plants;
        // generic: { results: [...] }
        if (Array.isArray(data.results)) return data.results;
        // direct array
        if (Array.isArray(data)) return data;
      }
    } catch (error) {
      console.error("Plant API error:", error);
    }
  }
  return [];
}


// Render plant cards to the page
function renderPlants(plants) {

  if (!plantContainer) return;

  plantContainer.innerHTML = "";

  plants.forEach(plant => {

    const card = buildPlantCard(plant);

    const button = document.createElement("button");
    button.textContent = "Add to Garden";

    button.addEventListener("click", () => {
      addToGarden(plant);
    });

    card.appendChild(button);

    plantContainer.appendChild(card);

  });

}


// Add plant to garden plan
function addToGarden(plant) {

  const plan = getGardenPlan();

  // Use id, species_id, or fallback to name as unique key
  const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
  const exists = plan.find(item => (item.id || item.species_id || item.name || item.common_name) === plantId);
  if (!exists) {
    plan.push(plant);
    saveGardenPlan(plan);
    renderGardenPlan();
  }

}


// Remove plant from garden plan
function removeFromGarden(id) {

  let plan = getGardenPlan();

  plan = plan.filter(plant => (plant.id || plant.species_id || plant.name || plant.common_name) !== id);

  saveGardenPlan(plan);

  renderGardenPlan();

}


// Render saved garden plan
function renderGardenPlan() {

  const container = document.getElementById("garden-plan");

  if (!container) return;

  const plan = getGardenPlan();

  container.innerHTML = "";

  if (plan.length === 0) {

    container.innerHTML = "<p>No plants added yet.</p>";

    return;

  }

  plan.forEach(plant => {
    const item = document.createElement("div");
    const name = document.createElement("span");
    name.textContent = plant.common_name || plant.name || plant.species || "Plant";
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    // Use id, species_id, or fallback to name as unique key
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    removeButton.addEventListener("click", () => {
      removeFromGarden(plantId);
    });
    item.appendChild(name);
    item.appendChild(removeButton);
    container.appendChild(item);
  });

}


// Initialize the application
async function init() {

  const plants = await fetchPlants();

  // Filter plants only for flowers page
  let filteredPlants = plants;
  const page = window.location.pathname;
  if (page.includes("flowers.html")) {
    filteredPlants = plants.filter(plant => {
      const name = (plant.common_name || plant.name || "").toLowerCase();
      const category = (plant.category || plant.type || "").toLowerCase();
      return name.includes("flower") || category.includes("flower") || name.includes("rose") || name.includes("daisy") || name.includes("lily") || name.includes("tulip") || name.includes("marigold") || name.includes("sunflower") || name.includes("iris") || name.includes("poppy") || name.includes("zinnia") || name.includes("petunia") || name.includes("peony");
    });
    // If no matches, show all
    if (filteredPlants.length === 0) filteredPlants = plants;
  }

  // Show message if no plants found
  if (!filteredPlants || filteredPlants.length === 0) {
    const container = document.getElementById("plant-container");
    if (container) container.innerHTML = "<p>No plants found.</p>";
    renderGardenPlan();
    return;
  }

  renderPlants(filteredPlants);
  renderGardenPlan();

}


// Start the application
init();