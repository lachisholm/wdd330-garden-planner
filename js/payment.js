// Payment page functionality for payment.html
// Handles payment method selection and form validation

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("payment-form");
  const creditDetails = document.getElementById("credit-details");
  const paymentMessage = document.getElementById("payment-message");

  // Show/hide credit card fields based on method
  form.addEventListener("change", (e) => {
    const method = form.method.value;
    creditDetails.style.display = method === "credit" ? "block" : "none";
  });

  // Handle payment submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const method = form.method.value;
    if (method === "credit") {
      // Simple validation
      const cardNumber = form.cardNumber.value.trim();
      const expiry = form.expiry.value.trim();
      const cvv = form.cvv.value.trim();
      if (!cardNumber || !expiry || !cvv) {
        paymentMessage.textContent = "Please fill in all credit card fields.";
        paymentMessage.style.color = "#c0392b";
        return;
      }
      paymentMessage.textContent = "Payment successful! Thank you for your order.";
      paymentMessage.style.color = "#27ae60";
    } else {
      paymentMessage.textContent = `Redirecting to ${method.charAt(0).toUpperCase() + method.slice(1)}...`;
      paymentMessage.style.color = "#2980b9";
      setTimeout(() => {
        paymentMessage.textContent = "Payment successful! Thank you for your order.";
        paymentMessage.style.color = "#27ae60";
      }, 1500);
    }
  });
});
