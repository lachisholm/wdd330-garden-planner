// Utility function to format plant names safely
export function formatPlantName(plant) {
  return plant.common_name ? plant.common_name : "Unknown Plant";
}


// Utility function to format scientific names
export function formatScientificName(plant) {
  if (!plant.scientific_name) {
    return "Scientific name unavailable";
  }

  if (Array.isArray(plant.scientific_name)) {
    return plant.scientific_name.join(", ");
  }

  return plant.scientific_name;
}


// Utility function to safely read plant images
export function getPlantImage(plant) {
  if (plant.default_image && plant.default_image.medium_url) {
    return plant.default_image.medium_url;
  }

  return "";
}


// Create a reusable plant card element
export function buildPlantCard(plant) {

  const card = document.createElement("div");
  card.classList.add("plant-card");

  const title = document.createElement("h3");
  title.textContent = formatPlantName(plant);

  const scientific = document.createElement("p");
  scientific.textContent = formatScientificName(plant);

  const imageUrl = getPlantImage(plant);

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = formatPlantName(plant);
    img.classList.add("plant-image");
    card.appendChild(img);
  }

  card.appendChild(title);
  card.appendChild(scientific);

  return card;
}