// Shopping Cart functionality for cart.html
// Handles displaying cart items, removing items, and checkout navigation

// Key for cart storage
const CART_KEY = "gardenPlan";

// Get cart items from localStorage
function getCartItems() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save cart items to localStorage
function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Remove item from cart
function removeFromCart(id) {
  let items = getCartItems();
  items = items.filter(plant => (plant.id || plant.species_id || plant.name || plant.common_name) !== id);
  saveCartItems(items);
  renderCart();
}

// Render cart items
function renderCart() {
  const container = document.querySelector(".cart-grid");
  if (!container) return;
  const items = getCartItems();
  container.innerHTML = "";
  if (items.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  items.forEach(plant => {
    const item = document.createElement("div");
    item.className = "plant-card";
    const name = document.createElement("span");
    name.textContent = plant.common_name || plant.name || plant.species || "Plant";
    item.appendChild(name);
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    removeButton.addEventListener("click", () => {
      removeFromCart(plantId);
    });
    item.appendChild(removeButton);
    container.appendChild(item);
  });
  // Checkout button
  const checkoutBtn = document.createElement("button");
  checkoutBtn.textContent = "Proceed to Payment";
  checkoutBtn.className = "checkout-btn";
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "payment.html";
  });
  container.appendChild(checkoutBtn);
}

// Initialize cart page
function setupCart() {
  renderCart();
}

document.addEventListener("DOMContentLoaded", setupCart);
