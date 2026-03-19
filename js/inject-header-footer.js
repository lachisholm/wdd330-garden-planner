// inject-header-footer.js
// Injects shared header and footer into every page

function injectHeaderFooter() {
  fetch('header-footer.html')
    .then(response => response.text())
    .then(html => {
      // Create a temporary container
      const temp = document.createElement('div');
      temp.innerHTML = html;
      // Insert header at top of body
      const header = temp.querySelector('.site-header');
      if (header) {
        document.body.insertBefore(header, document.body.firstChild);
      }
      // Insert footer at bottom of body
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

document.addEventListener('DOMContentLoaded', injectHeaderFooter);
