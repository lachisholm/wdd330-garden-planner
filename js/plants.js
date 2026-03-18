// Utility function to format plant names safely
export function formatPlantName(plant) {
  // Try common_name, name, or fallback
  return plant.common_name || plant.name || plant.species || "Unknown Plant";
}


// Utility function to format scientific names
export function formatScientificName(plant) {
  // Try scientific_name, latin, or fallback
  const sci = plant.scientific_name || plant.latin || plant.scientific || plant.species_scientific;
  if (!sci) {
    return "Scientific name unavailable";
  }
  if (Array.isArray(sci)) {
    return sci.join(", ");
  }
  return sci;
}


// Utility function to safely read plant images
export function getPlantImage(plant) {
  // Try perenual, floraapi, or fallback
  if (plant.default_image && (plant.default_image.medium_url || plant.default_image.url)) {
    return plant.default_image.medium_url || plant.default_image.url;
  }
  if (plant.image_url) {
    return plant.image_url;
  }
  if (plant.images && Array.isArray(plant.images) && plant.images.length > 0) {
    return plant.images[0].url || plant.images[0];
  }
  if (plant.picture) {
    return plant.picture;
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

  const img = document.createElement("img");
  img.src = imageUrl || "images/placeholder.jpg";
  img.alt = formatPlantName(plant);
  img.classList.add("plant-image");
  card.appendChild(img);

  card.appendChild(title);
  card.appendChild(scientific);

  return card;
}