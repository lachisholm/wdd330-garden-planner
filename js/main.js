// API endpoint used to retrieve plant data
const API_URL = "https://perenual.com/api/species-list?key=sk-demo&page=1";


// Get plant container already in the HTML page
const plantContainer = document.getElementById("plant-container");


// LocalStorage key for saving the garden plan
const STORAGE_KEY = "gardenPlan";


// Get saved garden plan from localStorage
function getGardenPlan() {
  const storedPlan = localStorage.getItem(STORAGE_KEY);
  return storedPlan ? JSON.parse(storedPlan) : [];
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


// Create a plant card element
function createPlantCard(plant) {

  const card = document.createElement("div");
  card.classList.add("plant-card");

  const name = document.createElement("h3");
  name.textContent = plant.common_name || "Unknown Plant";

  const scientific = document.createElement("p");

  if (plant.scientific_name) {
    scientific.textContent = plant.scientific_name.join(", ");
  } else {
    scientific.textContent = "Scientific name unavailable";
  }

  const button = document.createElement("button");
  button.textContent = "Add to Garden";

  button.addEventListener("click", () => {
    addToGarden(plant);
  });

  card.appendChild(name);
  card.appendChild(scientific);
  card.appendChild(button);

  return card;

}


// Render plants to the page
function renderPlants(plants) {

  if (!plantContainer) return;

  plantContainer.innerHTML = "";

  plants.forEach(plant => {

    const card = createPlantCard(plant);

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
