// inject-header-footer.js
// Injects shared header and footer into every page

// Function to inject header and footer
function injectHeaderFooter() {
  // Fetch header-footer.html file
  fetch('header-footer.html')
    .then(response => response.text())
    .then(html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Only inject carousel on home page, and ensure it is the very first element
      let insertBeforeNode = document.body.firstChild;
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        const carousel = temp.querySelector('#home-carousel-container');
        if (carousel) {
          carousel.style.display = '';
          document.body.insertBefore(carousel, insertBeforeNode);
          insertBeforeNode = carousel.nextSibling;
        }
      }
      // Insert header at top of body (after carousel if present)
      const header = temp.querySelector('.site-header');
      if (header) {
        document.body.insertBefore(header, insertBeforeNode);
      }
      // Insert footer at bottom of body if found
      const footer = temp.querySelector('.footer');
      if (footer) {
        document.body.appendChild(footer);
      }
      // Hamburger menu logic
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });
      }
    });
}

// Run injectHeaderFooter when DOM is ready
document.addEventListener('DOMContentLoaded', injectHeaderFooter);
