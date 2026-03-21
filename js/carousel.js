// Carousel initialization function
function initHomeCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

  let current = 0;
  let intervalId;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
      if (dotsContainer.children[i]) {
        dotsContainer.children[i].classList.toggle('active', i === idx);
      }
    });
    current = idx;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }
  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  // Dots
  if (dotsContainer.children.length === 0) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.addEventListener('click', () => {
        showSlide(i);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 3500);
  }

  showSlide(0);
  intervalId = setInterval(nextSlide, 3500);
}
