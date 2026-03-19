// inject-header-footer.js
// Injects shared header and footer into every page

// Function to inject header and footer
function injectHeaderFooter() {
  // Fetch header-footer.html file
  fetch('header-footer.html')
    // Convert response to text
    .then(response => response.text())
    // Process HTML content
    .then(html => {
      // Create a temporary container div
      const temp = document.createElement('div');
      // Set innerHTML to fetched HTML
      temp.innerHTML = html;
      // Find header element in temp
      const header = temp.querySelector('.site-header');
      // Insert header at top of body if found
      if (header) {
        document.body.insertBefore(header, document.body.firstChild);
      }
      // Find footer element in temp
      const footer = temp.querySelector('.footer');
      // Insert footer at bottom of body if found
      if (footer) {
        document.body.appendChild(footer);
      }
      // Find hamburger menu and nav links
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      
      // Add click event to hamburger menu for mobile nav toggle
      if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });
      }
    });
}

// Run injectHeaderFooter when DOM is ready
document.addEventListener('DOMContentLoaded', injectHeaderFooter);
