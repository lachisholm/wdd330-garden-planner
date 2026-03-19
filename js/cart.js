// Shopping Cart functionality for cart.html
// Handles displaying cart items, removing items, and checkout navigation

// LocalStorage key for cart
const CART_KEY = "gardenPlan";

// Retrieve cart items from localStorage
function getCartItems() {
  // Get cart items as JSON string
  const stored = localStorage.getItem(CART_KEY);
  // Parse JSON or return empty array
  return stored ? JSON.parse(stored) : [];
}

// Store cart items in localStorage
function saveCartItems(items) {
  // Save cart items as JSON string
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Remove item from cart by unique id
function removeFromCart(id) {
  // Get current cart items
  let items = getCartItems();
  // Filter out item by id
  items = items.filter(plant => (plant.id || plant.species_id || plant.name || plant.common_name) !== id);
  // Save updated cart
  saveCartItems(items);
  // Re-render cart
  renderCart();
}

// Render cart items to the page
function renderCart() {
  // Get cart grid container
  const container = document.querySelector(".cart-grid");
  // Exit if container not found
  if (!container) return;
  // Get cart items
  const items = getCartItems();
  // Clear container
  container.innerHTML = "";
  // Show empty cart message if no items
  if (items.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  // Render each plant item in cart
  items.forEach(plant => {
    // Create item div
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
    // Remove plant from cart on click
    removeButton.addEventListener("click", () => {
      removeFromCart(plantId);
    });
    // Add remove button to item
    item.appendChild(removeButton);
    // Add item to cart grid
    container.appendChild(item);
  });
  // Create checkout button
  const checkoutBtn = document.createElement("button");
  // Set button text
  checkoutBtn.textContent = "Proceed to Payment";
  // Add styling class
  checkoutBtn.className = "checkout-btn";
  // Redirect to payment page on click
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "payment.html";
  });
  // Add checkout button to cart grid
  container.appendChild(checkoutBtn);
}

// Initialize cart page
function setupCart() {
  // Render cart on page load
  renderCart();
}

// Setup cart when DOM is ready
document.addEventListener("DOMContentLoaded", setupCart);
