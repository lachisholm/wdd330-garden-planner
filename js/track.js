// Track order page functionality for track.html
// Handles order tracking form submission and status display

document.addEventListener("DOMContentLoaded", () => {
  // Get track form element
  const form = document.getElementById("track-form");
  // Get track message display element
  const trackMessage = document.getElementById("track-message");

  // Handle track form submission
  form.addEventListener("submit", (e) => {
    // Prevent default form submission
    e.preventDefault();
    // Get order number value
    const orderNumber = form.orderNumber.value.trim();
    // Validate order number field
    if (!orderNumber) {
      // Show error message if field is missing
      trackMessage.textContent = "Please enter your order number.";
      trackMessage.style.color = "#c0392b";
      return;
    }
    // Simulate order tracking status
    trackMessage.textContent = `Order #${orderNumber} is in transit. Expected delivery: 3-5 days.`;
    trackMessage.style.color = "#2980b9";
  });
});
