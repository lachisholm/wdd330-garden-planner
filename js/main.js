// Configuration for the plant API endpoint
const API_URL = "https://perenual.com/api/species-list?key=sk-demo&page=1";


// Create a container where plant cards will be displayed
const plantContainer = document.createElement("div");
plantContainer.id = "plant-container";


// Add the plant container to the main section of the page
document.querySelector("main").appendChild(plantContainer);


// Local storage key used to save the user's garden plan
const STORAGE_KEY = "gardenPlan";


// Retrieve the saved garden plan from localStorage
function getGardenPlan() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}


// Save the garden plan to localStorage
function saveGardenPlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}


// Fetch plant data from the external plant API
async function fetchPlants() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching plant data:", error);
    return [];
  }
}


// Create an individual plant card element
function createPlantCard(plant) {

  const card = document.createElement("div");
  card.classList.add("plant-card");

  const name = document.createElement("h3");
  name.textContent = plant.common_name || "Unknown Plant";

  const scientific = document.createElement("p");
  scientific.textContent = plant.scientific_name
    ? plant.scientific_name.join(", ")
    : "No scientific name available";

  const button = document.createElement("button");
  button.textContent = "Add to Garden";

  button.addEventListener("click", () => addToGarden(plant));

  card.appendChild(name);
  card.appendChild(scientific);
  card.appendChild(button);

  return card;
}


// Render plant cards to the page
function renderPlants(plants) {
  plantContainer.innerHTML = "";

  plants.forEach(plant => {
    const card = createPlantCard(plant);
    plantContainer.appendChild(card);
  });
}


// Add a plant to the user's garden plan
function addToGarden(plant) {

  const plan = getGardenPlan();

  const exists = plan.find(p => p.id === plant.id);

  if (!exists) {
    plan.push(plant);
    saveGardenPlan(plan);
    renderGardenPlan();
  }
}


// Remove a plant from the garden plan
function removeFromGarden(id) {

  let plan = getGardenPlan();

  plan = plan.filter(p => p.id !== id);

  saveGardenPlan(plan);
  renderGardenPlan();
}


// Render the saved garden plan to the page
function renderGardenPlan() {

  const container = document.getElementById("garden-plan");
  container.innerHTML = "";

  const plan = getGardenPlan();

  if (plan.length === 0) {
    container.innerHTML = "<p>No plants added yet.</p>";
    return;
  }

  plan.forEach(plant => {

    const item = document.createElement("div");

    const name = document.createElement("span");
    name.textContent = plant.common_name || "Plant";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", () => {
      removeFromGarden(plant.id);
    });

    item.appendChild(name);
    item.appendChild(removeBtn);

    container.appendChild(item);
  });
}


// Initialize the application and load plant data
async function init() {

  const plants = await fetchPlants();

  renderPlants(plants);

  renderGardenPlan();
}


// Start the application
init();