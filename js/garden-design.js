// Remove plant from garden plan
function removeFromGarden(id) {
  // Get garden plan from localStorage and parse as array
  let plan = JSON.parse(localStorage.getItem("gardenPlan") || "[]");
  // Filter out plant by unique id
  plan = plan.filter(plant => (plant.id || plant.species_id || plant.name || plant.common_name) !== id);
  // Save updated plan to localStorage
  localStorage.setItem("gardenPlan", JSON.stringify(plan));
  // Re-render garden plan list
  renderGardenPlanList();
}

// Display garden plan list
function renderGardenPlanList() {
  // Get container for garden plan list
  const container = document.getElementById("garden-plan-list");
  // Exit if container not found
  if (!container) return;
  // Get garden plan from localStorage and parse as array
  const plan = JSON.parse(localStorage.getItem("gardenPlan") || "[]");
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
    // Add plant-card class
    item.className = "plant-card";
    // Create span for plant name
    const name = document.createElement("span");
    // Set plant name
    name.textContent = plant.common_name || plant.name || plant.species || "Plant";
    // Add name to item
    item.appendChild(name);
    // Create remove button
    const removeButton = document.createElement("button");
    // Set button text
    removeButton.textContent = "Remove";
    // Unique plant id
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    // Remove plant from plan on click
    removeButton.addEventListener("click", () => {
      removeFromGarden(plantId);
    });
    // Add remove button to item
    item.appendChild(removeButton);
    // Add item to container
    container.appendChild(item);
  });
}

// Handle garden measurements and display map
function handleMeasurements(e) {
  // Prevent default form submission
  e.preventDefault();
  // Get width value from input
  const width = parseInt(document.getElementById("width").value, 10);
  // Get length value from input
  const length = parseInt(document.getElementById("length").value, 10);
  // Get garden map container
  const map = document.getElementById("garden-map");
  // Show error if measurements are invalid
  if (!width || !length) {
    map.innerHTML = "<p>Please enter valid measurements.</p>";
    return;
  }
  // Display simple visual representation of garden area
  map.innerHTML = `<div style="width:${width*10}px;height:${length*10}px;background:#e0f7fa;border:2px solid #2c3e50;display:flex;align-items:center;justify-content:center;">${width}ft x ${length}ft</div>`;
}

// Setup event listeners
function setup() {
  // Render garden plan list on page load
  renderGardenPlanList();
  // Get garden measurements form
  const form = document.getElementById("garden-measurements");
  // Add submit event listener to form
  if (form) form.addEventListener("submit", handleMeasurements);
}

// Run setup when DOM is ready
document.addEventListener("DOMContentLoaded", setup);
