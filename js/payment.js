// Payment page functionality for payment.html
// Handles payment method selection and form validation

document.addEventListener("DOMContentLoaded", () => {
  // Get payment form element
  const form = document.getElementById("payment-form");
  // Get credit card details section
  const creditDetails = document.getElementById("credit-details");
  // Get payment message display element
  const paymentMessage = document.getElementById("payment-message");

  // Show/hide credit card fields based on selected payment method
  form.addEventListener("change", (e) => {
    // Get selected payment method
    const method = form.method.value;
    // Show credit card fields if method is credit
    creditDetails.style.display = method === "credit" ? "block" : "none";
  });

  // Handle payment form submission
  form.addEventListener("submit", (e) => {
    // Prevent default form submission
    e.preventDefault();
    // Get selected payment method
    const method = form.method.value;
    // If credit card method selected
    if (method === "credit") {
      // Get card number, expiry, and cvv values
      const cardNumber = form.cardNumber.value.trim();
      const expiry = form.expiry.value.trim();
      const cvv = form.cvv.value.trim();
      // Validate credit card fields
      if (!cardNumber || !expiry || !cvv) {
        // Show error message if fields are missing
        paymentMessage.textContent = "Please fill in all credit card fields.";
        paymentMessage.style.color = "#c0392b";
        return;
      }
      // Show success message for payment
      paymentMessage.textContent = "Payment successful! Thank you for your order.";
      paymentMessage.style.color = "#27ae60";
    } else {
      // Show redirecting message for other payment methods
      paymentMessage.textContent = `Redirecting to ${method.charAt(0).toUpperCase() + method.slice(1)}...`;
      paymentMessage.style.color = "#2980b9";
      // Simulate redirect and show success after delay
      setTimeout(() => {
        paymentMessage.textContent = "Payment successful! Thank you for your order.";
        paymentMessage.style.color = "#27ae60";
      }, 1500);
    }
  });
});
