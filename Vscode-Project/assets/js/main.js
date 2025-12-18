const carousel = document.querySelector('.carousel');

carousel.innerHTML += carousel.innerHTML;

let x = 0;
const speed = 0.5;

function scrollCarousel() {
x -= speed;
if (x <= -carousel.scrollWidth / 2) {
x = 0;
}
carousel.style.transform = `translateX(${x}px)`;
requestAnimationFrame(scrollCarousel);
}

scrollCarousel();

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const homeText = document.querySelector(".home__container");
  if (homeText) {
    homeText.style.transform = `translateY(${scrollY * 0.1}px)`; 
    // Headline bewegt sich leicht beim Scroll → Tiefe
  }
});
