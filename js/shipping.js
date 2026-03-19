// Shipping page functionality for shipping.html
// Handles shipping form submission and validation

document.addEventListener("DOMContentLoaded", () => {
  // Get shipping form element
  const form = document.getElementById("shipping-form");
  // Get shipping message display element
  const shippingMessage = document.getElementById("shipping-message");

  // Handle shipping form submission
  form.addEventListener("submit", (e) => {
    // Prevent default form submission
    e.preventDefault();
    // Get address, city, zip values
    const address = form.address.value.trim();
    const city = form.city.value.trim();
    const zip = form.zip.value.trim();
    // Validate shipping fields
    if (!address || !city || !zip) {
      // Show error message if fields are missing
      shippingMessage.textContent = "Please fill in all shipping fields.";
      shippingMessage.style.color = "#c0392b";
      return;
    }
    // Show success message for shipping
    shippingMessage.textContent = "Shipping details saved! Your order is on its way.";
    shippingMessage.style.color = "#27ae60";
  });
});
