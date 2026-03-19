// Utility function to format plant names safely
export function formatPlantName(plant) {
  // Try common_name, name, or fallback
  return plant.common_name || plant.name || plant.species || "Unknown Plant";
}

// Utility function to format scientific names
export function formatScientificName(plant) {
  // Try scientific_name, latin, or fallback
  const sci = plant.scientific_name || plant.latin || plant.scientific || plant.species_scientific;
  // Return message if scientific name is unavailable
  if (!sci) {
    return "Scientific name unavailable";
  }
  // Join array of scientific names if present
  if (Array.isArray(sci)) {
    return sci.join(", ");
  }
  // Return scientific name as string
  return sci;
}

// Utility function to safely read plant images
export function getPlantImage(plant) {
  // Try perenual, floraapi, or fallback
  if (plant.default_image && (plant.default_image.medium_url || plant.default_image.url)) {
    return plant.default_image.medium_url || plant.default_image.url;
  }
  // Check for image_url property
  if (plant.image_url) {
    return plant.image_url;
  }
  // Check for images array and return first image
  if (plant.images && Array.isArray(plant.images) && plant.images.length > 0) {
    return plant.images[0].url || plant.images[0];
  }
  // Check for picture property
  if (plant.picture) {
    return plant.picture;
  }
  // Return empty string if no image found
  return "";
}

// Create a reusable plant card element
export function buildPlantCard(plant) {
  // Create card div element
  const card = document.createElement("div");
  // Add plant-card class
  card.classList.add("plant-card");
  // Create title element for plant name
  const title = document.createElement("h3");
  // Set plant name as title
  title.textContent = formatPlantName(plant);
  // Create scientific name element
  const scientific = document.createElement("p");
  // Set scientific name text
  scientific.textContent = formatScientificName(plant);
  // Get plant image URL
  const imageUrl = getPlantImage(plant);
  // Create image element
  const img = document.createElement("img");
  // Set image source or placeholder
  img.src = imageUrl || "images/placeholder.jpg";
  // Set alt text for image
  img.alt = formatPlantName(plant);
  // Add plant-image class
  img.classList.add("plant-image");
  // Add image to card
  card.appendChild(img);
  // Add title to card
  card.appendChild(title);
  // Add scientific name to card
  card.appendChild(scientific);
  // Return completed card element
  return card;
}