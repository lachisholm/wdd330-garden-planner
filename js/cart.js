// Shopping Cart functionality for cart.html
// Handles displaying cart items, removing items, updating quantity, and checkout navigation

// LocalStorage key for cart
const CART_KEY = "gardenPlan";

// Placeholder price for demo
const PLACEHOLDER_PRICE = 12.99;
// Placeholder image for demo
const PLACEHOLDER_IMAGE = "images/plant1.jpg";

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

// Update quantity for a cart item
function updateQuantity(id, newQty) {
  // Get current cart items
  let items = getCartItems();
  // Update quantity for matching item
  items = items.map(plant => {
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    if (plantId === id) {
      return { ...plant, quantity: newQty };
    }
    return plant;
  });
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

  // Create cart table
  const table = document.createElement("table");
  table.className = "cart-table";

  // Create table header row
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Image", "Product", "Price", "Quantity", "Subtotal", "Remove"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  let cartSubtotal = 0;

  items.forEach(plant => {
    // Unique plant id
    const plantId = plant.id || plant.species_id || plant.name || plant.common_name;
    // Product name
    const name = plant.common_name || plant.name || plant.species || "Plant";
    // Product image
    const image = plant.image_url || plant.image || PLACEHOLDER_IMAGE; // Use API image if available, fallback otherwise
    // Product price (placeholder)
    const price = PLACEHOLDER_PRICE;
    // Product quantity
    const quantity = plant.quantity || 1;
    // Subtotal for item
    const subtotal = price * quantity;
    cartSubtotal += subtotal;

    // Create table row
    const row = document.createElement("tr");

    // Image cell
    const imgTd = document.createElement("td");
    const img = document.createElement("img");
    img.src = image;
    img.alt = name;
    img.className = "cart-img";
    imgTd.appendChild(img);
    row.appendChild(imgTd);

    // Name cell
    const nameTd = document.createElement("td");
    nameTd.textContent = name;
    row.appendChild(nameTd);

    // Price cell
    const priceTd = document.createElement("td");
    priceTd.textContent = `$${price.toFixed(2)}`;
    row.appendChild(priceTd);

    // Quantity cell
    const qtyTd = document.createElement("td");
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = quantity;
    qtyInput.className = "cart-qty";
    qtyInput.addEventListener("change", () => {
      updateQuantity(plantId, parseInt(qtyInput.value));
    });
    qtyTd.appendChild(qtyInput);
    row.appendChild(qtyTd);

    // Subtotal cell
    const subtotalTd = document.createElement("td");
    subtotalTd.textContent = `$${subtotal.toFixed(2)}`;
    row.appendChild(subtotalTd);

    // Remove button cell
    const removeTd = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";
    removeButton.addEventListener("click", () => {
      removeFromCart(plantId);
    });
    removeTd.appendChild(removeButton);
    row.appendChild(removeTd);

    // Add row to table body
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  // Cart summary section
  const summaryDiv = document.createElement("div");
  summaryDiv.className = "cart-summary";

  // Calculate tax and shipping (placeholder)
  const tax = cartSubtotal * 0.07;
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = cartSubtotal + tax + shipping;

  summaryDiv.innerHTML = `
    <div class="cart-summary-row"><span>Subtotal:</span><span>$${cartSubtotal.toFixed(2)}</span></div>
    <div class="cart-summary-row"><span>Tax (7%):</span><span>$${tax.toFixed(2)}</span></div>
    <div class="cart-summary-row"><span>Shipping:</span><span>$${shipping.toFixed(2)}</span></div>
    <div class="cart-summary-row cart-summary-total"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
  `;

  container.appendChild(summaryDiv);

  // Create checkout button
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
  // Render cart on page load
  renderCart();
}

// Setup cart when DOM is ready
document.addEventListener("DOMContentLoaded", setupCart);
