// Shipping page functionality for shipping.html
// Handles shipping form submission and validation

document.addEventListener("DOMContentLoaded", () => {
      // Add clear (X) button functionality for each text input
      document.querySelectorAll('.clear-input-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const targetId = btn.getAttribute('data-target');
          const input = document.getElementById(targetId);
          if (input) input.value = '';
        });
      });
    // Add event listener for Clear Form button
    const clearBtn = document.getElementById("clear-shipping-form");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        form.reset();
        shippingMessage.textContent = "";
      });
    }
  // Get shipping form element
  const form = document.getElementById("shipping-form");
  // Get shipping message display element
  const shippingMessage = document.getElementById("shipping-message");
  // Function to save shipping info to localStorage with error handling, using FormData
  function saveShippingInfo() {
    const formData = new FormData(form);
    // Build shippingInfo object from FormData
    const shippingInfo = {
      name: (formData.get("buyer-name") || "").trim(),
      address: (formData.get("address") || "").trim(),
      city: (formData.get("city") || "").trim(),
      state: formData.get("state") || "",
      zip: (formData.get("zip") || "").trim(),
      country: formData.get("country") || ""
    };
    try {
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
      return true;
    } catch (error) {
      // Show user-friendly error message
      shippingMessage.textContent = "Sorry, we couldn't save your shipping info. Please check your browser settings.";
      shippingMessage.style.color = "#c0392b";
      console.error("Shipping info save error:", error);
      return false;
    }
  }

  // Handle shipping form submission
  form.addEventListener("submit", (e) => {
    // Prevent default form submission
    e.preventDefault();
    // Use FormData for validation
    const formData = new FormData(form);
    const address = (formData.get("address") || "").trim();
    const city = (formData.get("city") || "").trim();
    const zip = (formData.get("zip") || "").trim();
    // Validate shipping fields
    if (!address || !city || !zip) {
      // Show error message if fields are missing
      shippingMessage.textContent = "Please fill in all shipping fields.";
      shippingMessage.style.color = "#c0392b";
      return;
    }
    // Save shipping info to localStorage
    const saved = saveShippingInfo();
    if (saved) {
      // Show success message for shipping
      shippingMessage.textContent = "Shipping details saved! Your order is on its way.";
      shippingMessage.style.color = "#27ae60";
      // Reset the form fields after successful submission
      form.reset();
      // Auto-hide the message after 10 seconds
      setTimeout(() => {
        shippingMessage.textContent = "";
      }, 10000);
    }
  });
});
