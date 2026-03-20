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
  // Get garden plan as JSON string
  const stored = localStorage.getItem(STORAGE_KEY);
  // Parse JSON or return empty array
  return stored ? JSON.parse(stored) : [];
}

// Save garden plan to localStorage
function saveGardenPlan(plan) {
  // Store garden plan as JSON string
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

// Fetch plant data from the API
// Try each API in order until one returns valid data
async function fetchPlants() {
  // Get current page path
  const page = window.location.pathname;
  // Default API URL
  let url = API_URLS[0];
  // Choose API URL based on page
  if (page.includes("vegetables.html")) {
    url = PERENUAL_EDIBLE_URL;
  } else if (page.includes("flowers.html")) {
    url = PERENUAL_FLOWER_URL;
  } else if (page.includes("landscaping.html")) {
    url = PERENUAL_LANDSCAPE_URL;
  }
  try {
    // Fetch plant data from API
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
    // Return empty array if no valid data
    return [];
  } catch (error) {
    // Log API error
    console.error("Plant API error:", error);
    // Show user-friendly error message in plant container
    const container = document.getElementById("plant-container");
    if (container) {
      container.innerHTML = `<div style='color:#b71c1c; background:#fff3f3; border:1px solid #b71c1c; padding:16px; border-radius:8px; margin:24px auto; max-width:500px;'>
        <strong>Sorry, we couldn't load the plant data at this time.</strong><br>
        Please check your internet connection or try again later.
      </div>`;
    }
    // Return empty array on error
    return [];
  }
}

// Render plant cards to the page
function renderPlants(plants) {
  // Exit if plant container not found
  if (!plantContainer) return;
  // Clear plant container
  plantContainer.innerHTML = "";
  // Get current page path
  const page = window.location.pathname;
  // Render each plant
  plants.forEach(plant => {
    // Build plant card element
    const card = buildPlantCard(plant);
    // Add plant-card class
    card.classList.add("plant-card");
    // Add to Garden button
    const gardenBtn = document.createElement("button");
    gardenBtn.textContent = "Add to Garden";
    gardenBtn.addEventListener("click", () => {
      try {
        addToGarden(plant);
      } catch (error) {
        alert("Could not add to garden. Please try again.");
        console.error("Add to garden error:", error);
      }
    });
    card.appendChild(gardenBtn);
    // Add to Cart button (for flowers, vegetables, and landscaping pages)
    if (page.includes("flowers.html") || page.includes("vegetables.html") || page.includes("landscaping.html")) {
      const cartBtn = document.createElement("button");
      cartBtn.textContent = "Add to Cart";
      cartBtn.addEventListener("click", () => {
        try {
          // Save to cart (gardenPlan localStorage)
          let cart = getGardenPlan();
          const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
          const exists = cart.find(item => (item.id || item.species_id || item.name || item.common_name) === plantId);
          if (!exists) {
            cart.push(plant);
            saveGardenPlan(cart);
          }
          // Redirect to cart page
          window.location.href = "cart.html";
        } catch (error) {
          alert("Could not add to cart. Please check your browser settings.");
          console.error("Add to cart error:", error);
        }
      });
      card.appendChild(cartBtn);
    }
    // Add card to plant container
    plantContainer.appendChild(card);
  });
}

// Add plant to garden plan
function addToGarden(plant) {
  try {
    // Get current garden plan
    const plan = getGardenPlan();
    // Use id, species_id, or fallback to name as unique key
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    // Check if plant already exists in plan
    const exists = plan.find(item => (item.id || item.species_id || item.name || item.common_name) === plantId);
    // Add plant if not already in plan
    if (!exists) {
      plan.push(plant);
      saveGardenPlan(plan);
      renderGardenPlan();
    }
  } catch (error) {
    // Show user-friendly error message
    alert("Sorry, we couldn't save your garden plan. Please check your browser settings.");
    console.error("Garden plan save error:", error);
  }
}

// Remove plant from garden plan
function removeFromGarden(id) {
  try {
    // Get current garden plan
    let plan = getGardenPlan();
    // Filter out plant by unique id
    plan = plan.filter(plant => (plant.id || plant.species_id || plant.name || plant.common_name) !== id);
    // Save updated plan
    saveGardenPlan(plan);
    // Re-render garden plan
    renderGardenPlan();
  } catch (error) {
    alert("Sorry, we couldn't update your garden plan. Please check your browser settings.");
    console.error("Garden plan remove error:", error);
  }
}

// Render saved garden plan
function renderGardenPlan() {
  // Get garden plan container
  const container = document.getElementById("garden-plan");
  // Exit if container not found
  if (!container) return;
  // Get current garden plan
  const plan = getGardenPlan();
  // Clear container
  container.innerHTML = "";
  // Show message if no plants in plan
  if (plan.length === 0) {
    container.innerHTML = "<p>No plants added yet.</p>";
    return;
  }
  // Render each plant in garden plan
  plan.forEach(plant => {
    // Create item div for plant
    const item = document.createElement("div");
    // Create span for plant name
    const name = document.createElement("span");
    name.textContent = plant.common_name || plant.name || plant.species || "Plant";
    // Create remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    // Use id, species_id, or fallback to name as unique key
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    removeButton.addEventListener("click", () => {
      removeFromGarden(plantId);
    });
    // Add name and remove button to item
    item.appendChild(name);
    item.appendChild(removeButton);
    // Add item to container
    container.appendChild(item);
  });
}

// Initialize the application
async function init() {
  // Fetch plant data
  const plants = await fetchPlants();
  // Filter plants only for flowers page
  let filteredPlants = plants;
  const page = window.location.pathname;
  if (page.includes("flowers.html")) {
    filteredPlants = plants.filter(plant => {
      // Get plant name and category
      const name = (plant.common_name || plant.name || "").toLowerCase();
      const category = (plant.category || plant.type || "").toLowerCase();
      // Filter for flower-related names and categories
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
  // Render filtered plants and garden plan
  renderPlants(filteredPlants);
  renderGardenPlan();
}

// Start the application
init();

// Hamburger menu toggle
const hamburger = document.getElementById("hamburger-menu");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}