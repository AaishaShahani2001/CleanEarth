// =================== Mobile menu ===================
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

// =================== Header shrink on scroll ===================
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 5) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// =================== Lightbox for Projects ===================
const lightBox = document.querySelector('.lightbox');
const itemBox = document.querySelectorAll('.thumbnail');
const lightBoxImage = lightBox.querySelector('.lightbox-img');
const closeLightBox = document.querySelector('.lightbox-close');
let itemIndex = 0;

function changeProjectImage() {
  const imgSrc = itemBox[itemIndex].querySelector('img').getAttribute('src');
  lightBoxImage.src = imgSrc;
}
function toggleLightBox() {
  lightBox.classList.toggle('open');
}
function nextProjectSlide() {
  itemIndex = (itemIndex + 1) % itemBox.length;
  changeProjectImage();
}
function prevProjectSlide() {
  itemIndex = (itemIndex - 1 + itemBox.length) % itemBox.length;
  changeProjectImage();
}
// Hook up to inline HTML lightbox controls:
window.nextSlide = nextProjectSlide;
window.prevSlide = prevProjectSlide;

itemBox.forEach((box, i) =>
  box.addEventListener('click', () => {
    itemIndex = i;
    changeProjectImage();
    toggleLightBox();
  })
);
lightBox.addEventListener('click', e => {
  if (e.target === closeLightBox) toggleLightBox();
});

// =================== Animated Counters ===================
const counters = document.querySelectorAll('.count');
const io = new IntersectionObserver(
  entries => {
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
  },
  { threshold: 0.4 }
);
counters.forEach(c => io.observe(c));

// =================== Info Modal (Services & Posts) ===================
const infoModal = document.getElementById('infoModal');
const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');
const sliderTrack = document.getElementById('sliderTrack');
const closeModal = document.querySelector('.close-modal');
const sliderControls = document.querySelector('.slider-controls');
const nextBtn = document.querySelector('.next-slide');
const prevBtn = document.querySelector('.prev-slide');
const progressWrap = document.querySelector('.slider-progress');
const progressBar = document.getElementById('progressBar');

let currentSlide = 0;
let autoSlideInterval = null;

// --- Data-------
const infoData = {
  // --- Services (single image) ---
  "Waste Sorting": {
    img: "images/project2.jpg",
    title: "Waste Sorting",
    text: "Waste sorting is the process of separating waste into different categories like recyclables, organic matter, and general trash. This can be done manually at home or mechanically at recycling facilities, and is important for reducing landfill waste, conserving natural resources, and preventing pollution. Proper sorting ensures that materials can be processed, recycled, or disposed of safely."
  },
  "Plastic Reduction": {
    img: "images/service2.jpg",
    title: "Plastic Reduction",
    text: "To reduce plastic, prioritize eliminating single-use items, such as carrying reusable water bottles, coffee cups, and shopping bags. When shopping, buy in bulk and choose products in glass or metal containers to avoid excessive packaging. For food storage, use reusable containers and beeswax wraps instead of plastic wrap."
  },
  "Composting": {
    img: "images/post2.webp",
    title: "Composting",
    text: "Composting is the natural process of decomposing organic waste like food scraps and yard trimmings into a nutrient-rich material called compost, which can be used to improve soil. It is an environmentally friendly way to recycle that reduces landfill waste, enhances soil health, and promotes plant growth without releasing harmful greenhouse gases. To get started, you can create a pile or bin with a balance of green materials (like fruit and vegetable scraps) and brown materials (like dried leaves and wood)."
  },
  "E-Waste Disposal": {
    img: "images/post3.jpg",
    title: "E-Waste Disposal",
    text: "E-waste disposal is the process of managing and processing discarded electronic devices, which includes everything from old cell phones and computers to appliances like refrigerators and televisions. This process is crucial because e-waste often contains both hazardous materials that can pollute the environment if not handled properly, and valuable materials that can be recovered and recycled. Proper disposal ensures environmental protection, resource conservation, and public health."
  },
  "Clean Living": {
    img: "images/logo2.jpg",
    title: "Clean Living",
    text: "Adopt small habits like conserving energy and using eco-friendly products. Together, we can build a cleaner tomorrow."
  },
  "Community Drives": {
    img: "images/project1.jpg",
    title: "Community Drives",
    text: "Community drives are organized efforts to collect goods or funds for people in need, fostered by a sense of shared purpose and mutual support. These can include food drives, clothing drives, school supply drives, and toy drives, which provide essential items to the community and strengthen social bonds. They are an effective way for schools, workplaces, and community groups to give back and make a tangible positive impact."
  },

  // --- Posts (multi-image) ---
  "Turning Trash into Treasure: The Power of Recycling": {
    images: ["images/post-image1.webp", "images/post-image2.jpg", "images/post-image3.jpg"],
    title: "Turning Trash into Treasure: The Power of Recycling",
    text: "Recycling isn’t just about waste — it’s about transformation. Every bottle, can, and piece of paper you recycle reduces pollution, saves energy, and supports local recycling industries. Learn how communities are turning everyday trash into valuable new products — and how you can start making a difference right from your home today."
  },
  "Composting Made Simple for Every Home": {
    images: ["images/post-image4.jpg", "images/post-image5.jpg", "images/post2.webp"],
    title: "Composting Made Simple for Every Home",
    text: "Nature never wastes — and neither should we. By composting your kitchen scraps, you return nutrients back to the soil, reduce landfill waste, and help plants grow healthier. Discover how to start a simple compost bin at home and turn your food waste into rich, organic fertilizer for your garden."
  },
  "E-Waste Awareness: Where Do Your Gadgets Go?": {
    images: ["images/post3.jpg", "images/post-image7.jpg", "images/post-image6.png"],
    title: "E-Waste Awareness: Where Do Your Gadgets Go?",
    text: "Old phones, laptops, and gadgets don’t belong in the trash. E-waste recycling helps recover precious materials like gold and copper while preventing toxic chemicals from polluting the environment. Find your nearest certified e-waste collection center and give your electronics a responsible second life."
  },
  "From Waste to Energy: The Future of Green Power": {
    images: ["images/post-image9.webp", "images/post-image8.png", "images/post4.webp"],
    title: "From Waste to Energy: The Future of Green Power",
    text: "Waste-to-energy technology transforms non-recyclable waste into electricity and heat. By incinerating waste at high temperatures, it reduces volume while capturing usable energy. This innovation minimizes landfill dependency and cuts greenhouse emissions, turning garbage into a valuable energy source."
  },
  "The 5Rs: Rethink, Refuse, Reduce, Reuse, Recycle": {
    images: ["images/5R1.jpg", "images/5R2.jpg", "images/post-image12.jpeg"],
    title: "The 5Rs: Rethink, Refuse, Reduce, Reuse, Recycle",
    text: "The 5Rs represent a sustainable mindset: Rethink your consumption, Refuse single-use plastics, Reduce waste, Reuse what’s possible, and Recycle responsibly. Adopting these steps daily creates a ripple effect that transforms communities toward sustainability."
  },
  "Ocean Cleanup Initiatives: Fighting Plastic Pollution": {
    images: ["images/post-image14.jpg", "images/post-image13.webp", "images/post-image15.jpeg"],
    title: "Ocean Cleanup Initiatives: Fighting Plastic Pollution",
    text: "Every year, millions of tons of plastic end up in our oceans, endangering marine life. Ocean cleanup initiatives use floating barriers, robotic boats, and volunteer efforts to collect plastic debris. Supporting these efforts helps preserve marine ecosystems and coastal beauty."
  }
};

// ---------- Helpers ----------
function restartProgress() {
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  setTimeout(() => {
    progressBar.style.transition = 'width 5s linear';
    progressBar.style.width = '100%';
  }, 50);
}

function updateSliderHeight() {
  const sliderContainer = document.querySelector('.slider-container');
  if (!sliderContainer) return;
  const currentImage = sliderTrack.children[currentSlide];
  if (currentImage) {
    sliderContainer.style.height = currentImage.clientHeight + 'px';
  }
}

function goToSlide(index, total) {
  currentSlide = (index + total) % total;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateSliderHeight();
}

// ---------- Auto-slide (only for multi-image posts) ----------
function startAutoSlide(totalSlides) {
  clearInterval(autoSlideInterval);
  restartProgress();
  autoSlideInterval = setInterval(() => {
    goToSlide(currentSlide + 1, totalSlides);
  }, 5000);
}

// =================== Modal Open ===================
document.querySelectorAll('.box a').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    const key = btn.closest('.box, .detail')?.querySelector('h3')?.textContent.trim();
    const data = infoData[key];
    if (!data) return;

    // reset UI
    clearInterval(autoSlideInterval);
    infoTitle.textContent = data.title || '';
    infoText.textContent = data.text || '';
    sliderTrack.innerHTML = '';
    progressBar.style.width = '0%';
    sliderControls.style.display = 'none';
    progressWrap.style.display = 'none';
    currentSlide = 0;

    // posts (multi-image)
    if (data.images && data.images.length > 0) {
      sliderTrack.innerHTML = data.images.map(src => `<img src="${src}" alt="">`).join('');
      sliderControls.style.display = 'flex';
      progressWrap.style.display = 'block';
      sliderTrack.style.transform = 'translateX(0)';
      infoModal.style.display = 'flex';

      // wait for images to layout then size container
      setTimeout(updateSliderHeight, 350);
      startAutoSlide(data.images.length);
    }
    // services (single image)
    else if (data.img) {
      sliderTrack.innerHTML = `<img src="${data.img}" alt="">`;
      sliderTrack.style.transform = 'translateX(0)';
      infoModal.style.display = 'flex';
      setTimeout(updateSliderHeight, 350);
    }
  });
});

// =================== Manual Controls (Modal) ===================
nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  const total = sliderTrack.children.length;
  if (total > 1) {
    clearInterval(autoSlideInterval);
    goToSlide(currentSlide + 1, total);
    startAutoSlide(total);
  }
});
prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  const total = sliderTrack.children.length;
  if (total > 1) {
    clearInterval(autoSlideInterval);
    goToSlide(currentSlide - 1, total);
    startAutoSlide(total);
  }
});

// Optional: keyboard arrows for modal
window.addEventListener('keydown', e => {
  if (infoModal.style.display !== 'flex') return;
  const total = sliderTrack.children.length;
  if (total <= 1) return;
  if (e.key === 'ArrowRight') {
    clearInterval(autoSlideInterval);
    goToSlide(currentSlide + 1, total);
    startAutoSlide(total);
  } else if (e.key === 'ArrowLeft') {
    clearInterval(autoSlideInterval);
    goToSlide(currentSlide - 1, total);
    startAutoSlide(total);
  }
});

// =================== Close Modal ===================
closeModal.onclick = () => {
  infoModal.style.display = 'none';
  clearInterval(autoSlideInterval);
};
window.onclick = e => {
  if (e.target === infoModal) {
    infoModal.style.display = 'none';
    clearInterval(autoSlideInterval);
  }
};