// Remove plant from garden plan
function removeFromGarden(id) {
  let plan = JSON.parse(localStorage.getItem("gardenPlan") || "[]");
  plan = plan.filter(plant => (plant.id || plant.species_id || plant.name || plant.common_name) !== id);
  localStorage.setItem("gardenPlan", JSON.stringify(plan));
  renderGardenPlanList();
}

// Display garden plan list
function renderGardenPlanList() {
  const container = document.getElementById("garden-plan-list");
  if (!container) return;
  const plan = JSON.parse(localStorage.getItem("gardenPlan") || "[]");
  container.innerHTML = "";
  if (plan.length === 0) {
    container.innerHTML = "<p>No plants added yet.</p>";
    return;
  }
  plan.forEach(plant => {
    const item = document.createElement("div");
    item.className = "plant-card";
    const name = document.createElement("span");
    name.textContent = plant.common_name || plant.name || plant.species || "Plant";
    item.appendChild(name);
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    removeButton.addEventListener("click", () => {
      removeFromGarden(plantId);
    });
    item.appendChild(removeButton);
    container.appendChild(item);
  });
}

// Handle garden measurements and display map
function handleMeasurements(e) {
  e.preventDefault();
  const width = parseInt(document.getElementById("width").value, 10);
  const length = parseInt(document.getElementById("length").value, 10);
  const map = document.getElementById("garden-map");
  if (!width || !length) {
    map.innerHTML = "<p>Please enter valid measurements.</p>";
    return;
  }
  // Simple visual representation
  map.innerHTML = `<div style="width:${width*10}px;height:${length*10}px;background:#e0f7fa;border:2px solid #2c3e50;display:flex;align-items:center;justify-content:center;">${width}ft x ${length}ft</div>`;
}

// Setup event listeners
function setup() {
  renderGardenPlanList();
  const form = document.getElementById("garden-measurements");
  if (form) form.addEventListener("submit", handleMeasurements);
}

document.addEventListener("DOMContentLoaded", setup);
