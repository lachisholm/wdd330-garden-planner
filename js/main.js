// Import plant card builder from the plants module
import { buildPlantCard } from "./plants.js";


// API endpoint used to retrieve plant data
const API_URL = "https://perenual.com/api/species-list?key=sk-demo&page=1";


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
async function fetchPlants() {

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    return data.data || [];

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

  const exists = plan.find(item => item.id === plant.id);

  if (!exists) {

    plan.push(plant);

    saveGardenPlan(plan);

    renderGardenPlan();

  }

}


// Remove plant from garden plan
function removeFromGarden(id) {

  let plan = getGardenPlan();

  plan = plan.filter(plant => plant.id !== id);

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
    name.textContent = plant.common_name || "Plant";

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      removeFromGarden(plant.id);
    });

    item.appendChild(name);
    item.appendChild(removeButton);

    container.appendChild(item);

  });

}


// Initialize the application
async function init() {

  const plants = await fetchPlants();

  renderPlants(plants);

  renderGardenPlan();

}


// Start the application
init();