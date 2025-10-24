// Mobile menu
const menu = document.querySelector('.fa-bars');
const navbar = document.querySelector('.navbar');
menu.addEventListener('click', () => {
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('nav-toggle');
});
window.addEventListener('scroll', () => {
  menu.classList.remove('fa-times');
  navbar.classList.remove('nav-toggle');
});

// Header shrink on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 5) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Lightbox
const lightBox = document.querySelector('.lightbox');
const itemBox = document.querySelectorAll('.thumbnail');
const totalItemBox = itemBox.length;
const lightBoxImage = lightBox.querySelector('.lightbox-img');
const closeLightBox = document.querySelector('.lightbox-close');
let itemIndex = 0;

function changeImage() {
  const imgSrc = itemBox[itemIndex].querySelector('img').getAttribute('src');
  lightBoxImage.src = imgSrc;
}
function toggleLightBox() {
  lightBox.classList.toggle('open');
}
function nextSlide() {
  itemIndex = (itemIndex === totalItemBox - 1) ? 0 : itemIndex + 1;
  changeImage();
}
function prevSlide() {
  itemIndex = (itemIndex === 0) ? totalItemBox - 1 : itemIndex - 1; // fixed bug
  changeImage();
}
window.nextSlide = nextSlide; // expose for inline onclick
window.prevSlide = prevSlide;

for (let i = 0; i < totalItemBox; i++) {
  itemBox[i].addEventListener('click', () => {
    itemIndex = i;
    changeImage();
    toggleLightBox();
  });
}
lightBox.addEventListener('click', (e) => {
  if (e.target === closeLightBox) toggleLightBox();
});

// Counters
const counters = document.querySelectorAll('.count');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = parseInt(el.dataset.count, 10) || 0;
    const start = 0, dur = 1000;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const val = Math.floor(start + (end - start) * p);
      el.textContent = end >= 1000 ? val.toLocaleString() + '+' : val + '+';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    io.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(c => io.observe(c));
