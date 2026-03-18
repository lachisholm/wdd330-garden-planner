// Import plant card builder from the plants module
import { buildPlantCard } from "./plants.js";


// API endpoint used to retrieve plant data
// Updated API endpoints
const PERENUAL_KEY = "sk-2cHp69b9f5142655c15545";
const FLORA_KEY = "pk_CxAKhiCEpQzYTx8U30fpILD45A4XaRZc";
const API_URLS = [
  `https://www.perenual.com/api/v2/species-list?key=${PERENUAL_KEY}`,
  `https://floraapi.com/api/v1/plants?key=${FLORA_KEY}`
];
const PERENUAL_EDIBLE_URL = `https://www.perenual.com/api/v2/species-list?key=${PERENUAL_KEY}&edible=1`;
const PERENUAL_FLOWER_URL = `https://www.perenual.com/api/v2/species-list?key=${PERENUAL_KEY}&q=flower`;
const PERENUAL_LANDSCAPE_URL = `https://www.perenual.com/api/v2/species-list?key=${PERENUAL_KEY}&sunlight=full_sun`;


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
  let url = API_URLS[0];
  if (page.includes("vegetables.html")) {
    url = PERENUAL_EDIBLE_URL;
  } else if (page.includes("flowers.html")) {
    url = PERENUAL_FLOWER_URL;
  } else if (page.includes("landscaping.html")) {
    url = PERENUAL_LANDSCAPE_URL;
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    // perenual: { data: [...] }
    if (data && Array.isArray(data.data)) return data.data;
    // floraapi: { plants: [...] }
    if (data && Array.isArray(data.plants)) return data.plants;
    // generic: { results: [...] }
    if (data && Array.isArray(data.results)) return data.results;
    // direct array
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error("Plant API error:", error);
    return [];
  }
}


// Render plant cards to the page
function renderPlants(plants) {
  if (!plantContainer) return;
  plantContainer.innerHTML = "";
  plants.forEach(plant => {
    const card = buildPlantCard(plant);
    card.classList.add("plant-card");
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

// Hamburger menu toggle
const hamburger = document.getElementById("hamburger-menu");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}