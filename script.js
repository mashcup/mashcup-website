document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll spy: highlight the nav link matching the section currently in view
const navLinkMap = new Map();
navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
  navLinkMap.set(link.getAttribute('href').slice(1), link);
});

function setActiveNavLink(id) {
  navLinkMap.forEach((link, key) => link.classList.toggle('active', key === id));
}

const spySections = [...navLinkMap.keys()]
  .map(id => document.getElementById(id))
  .filter(Boolean);

if (spySections.length) {
  const headerHeight = document.querySelector('.site-header').offsetHeight;

  const spyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length) {
      setActiveNavLink(visible[0].target.id);
    }
  }, {
    root: null,
    rootMargin: `-${headerHeight}px 0px -55% 0px`,
    threshold: 0
  });

  spySections.forEach(section => spyObserver.observe(section));

  navLinkMap.forEach((link, id) => {
    link.addEventListener('click', () => setActiveNavLink(id));
  });

  setActiveNavLink('home');
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Hero image carousel
const heroCarousel = document.getElementById('heroCarousel');

if (heroCarousel) {
  const slides = heroCarousel.querySelectorAll('.hero-slide');
  const dots = heroCarousel.querySelectorAll('.hero-dot');
  const prevBtn = heroCarousel.querySelector('.hero-nav.prev');
  const nextBtn = heroCarousel.querySelector('.hero-nav.next');
  let current = 0;
  let autoplayTimer = null;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(current + 1), 4500);
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    restartAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      restartAutoplay();
    });
  });

  startAutoplay();
}

// Steps connector line
const stepsSection = document.getElementById('stepsSection');
const stepsLine = document.getElementById('stepsLine');

if (stepsSection && stepsLine) {
  function positionStepsLine() {
    const nums = [...stepsSection.querySelectorAll('.step-num')];
    if (nums.length < 2) return;

    const containerRect = stepsSection.getBoundingClientRect();
    const firstRect = nums[0].getBoundingClientRect();
    const lastRect = nums[nums.length - 1].getBoundingClientRect();
    const sameRow = Math.abs(firstRect.top - lastRect.top) < 4;
    const sameColumn = Math.abs(firstRect.left - lastRect.left) < 4;

    if (sameRow) {
      const y = firstRect.top + firstRect.height / 2 - containerRect.top;
      const x1 = Math.min(firstRect.left, lastRect.left) + firstRect.width / 2 - containerRect.left;
      const x2 = Math.max(firstRect.left, lastRect.left) + firstRect.width / 2 - containerRect.left;
      Object.assign(stepsLine.style, {
        display: 'block',
        top: `${y}px`,
        left: `${x1}px`,
        width: `${x2 - x1}px`,
        height: '2px',
        bottom: 'auto',
        transform: 'none',
        background: 'linear-gradient(to left, var(--aqua), var(--petrol))'
      });
    } else if (sameColumn) {
      const x = firstRect.left + firstRect.width / 2 - containerRect.left;
      const y1 = firstRect.top + firstRect.height / 2 - containerRect.top;
      const y2 = lastRect.top + lastRect.height / 2 - containerRect.top;
      Object.assign(stepsLine.style, {
        display: 'block',
        left: `${x}px`,
        top: `${y1}px`,
        height: `${y2 - y1}px`,
        width: '2px',
        bottom: 'auto',
        transform: 'none',
        background: 'linear-gradient(to bottom, var(--aqua), var(--petrol))'
      });
    } else {
      stepsLine.style.display = 'none';
    }
  }

  let stepsResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(stepsResizeTimer);
    stepsResizeTimer = setTimeout(positionStepsLine, 150);
  });

  window.addEventListener('load', positionStepsLine);
  positionStepsLine();
}

// Testimonials carousel - true infinite loop via cloned edge cards
const testiTrack = document.getElementById('testimonialsTrack');

if (testiTrack) {
  const testiViewport = testiTrack.parentElement;
  const testiCarousel = testiViewport.parentElement;
  const testiPrev = testiCarousel.querySelector('.testi-nav.prev');
  const testiNext = testiCarousel.querySelector('.testi-nav.next');
  const testiDotsWrap = document.getElementById('testimonialsDots');
  const TESTI_GAP = 26;
  const TESTI_TRANSITION_MS = 500;

  const realCards = [...testiTrack.children];
  const realCount = realCards.length;
  const CLONE = 3;

  // Prepend clones of the last CLONE cards (in order), append clones of the first CLONE cards
  const firstRealCard = testiTrack.firstChild;
  realCards.slice(realCount - CLONE).forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    testiTrack.insertBefore(clone, firstRealCard);
  });
  realCards.slice(0, CLONE).forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    testiTrack.appendChild(clone);
  });

  const extendedCards = [...testiTrack.children];
  let extIndex = CLONE;
  let cardsPerView = 3;
  let isAnimating = false;

  function getCardsPerView() {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function buildDots() {
    testiDotsWrap.innerHTML = '';
    for (let i = 0; i < realCount; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testi-dot';
      dot.setAttribute('aria-label', `עבור להמלצה ${i + 1}`);
      dot.addEventListener('click', () => jumpTo(CLONE + i));
      testiDotsWrap.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const logical = ((extIndex - CLONE) % realCount + realCount) % realCount;
    testiDotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === logical);
    });
  }

  function applyWidths() {
    const viewportWidth = testiViewport.offsetWidth;
    const cardWidth = (viewportWidth - TESTI_GAP * (cardsPerView - 1)) / cardsPerView;
    extendedCards.forEach(card => {
      card.style.flex = `0 0 ${cardWidth}px`;
    });
  }

  function moveTo(index, animate) {
    extIndex = index;
    testiTrack.style.transition = animate ? `transform ${TESTI_TRANSITION_MS}ms ease` : 'none';

    const targetCard = extendedCards[extIndex];
    const viewportRect = testiViewport.getBoundingClientRect();
    const targetRect = targetCard.getBoundingClientRect();
    const currentTransform = new DOMMatrix(getComputedStyle(testiTrack).transform);
    const currentX = currentTransform.m41;
    const delta = targetRect.right - viewportRect.right;
    testiTrack.style.transform = `translateX(${currentX - delta}px)`;

    updateDots();
  }

  function step(direction) {
    if (isAnimating) return;
    isAnimating = true;
    moveTo(extIndex + direction, true);

    setTimeout(() => {
      if (extIndex >= CLONE + realCount) {
        moveTo(extIndex - realCount, false);
      } else if (extIndex < CLONE) {
        moveTo(extIndex + realCount, false);
      }
      isAnimating = false;
    }, TESTI_TRANSITION_MS + 30);
  }

  function jumpTo(targetExtIndex) {
    if (isAnimating || targetExtIndex === extIndex) return;
    isAnimating = true;
    moveTo(targetExtIndex, true);
    setTimeout(() => {
      isAnimating = false;
    }, TESTI_TRANSITION_MS + 30);
  }

  function layoutTestimonials() {
    cardsPerView = getCardsPerView();
    applyWidths();
    moveTo(extIndex, false);
  }

  testiPrev.addEventListener('click', () => step(-1));
  testiNext.addEventListener('click', () => step(1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutTestimonials, 150);
  });

  buildDots();
  layoutTestimonials();
}

// Gallery: rotating pool of real photos + lightbox
const galleryGrid = document.getElementById('galleryGrid');

if (galleryGrid) {
  const GALLERY_POOL = [
    { src: 'assets/hero-machine.jpg', alt: 'מכונת שתייה קרה של משקפ' },
    { src: 'assets/hero-machine-2.jpg', alt: 'מכונת חטיפים של משקפ' },
    { src: 'assets/hero-machine-3.jpg', alt: 'מכונת משקפ בשטח, מבט מלא' },
    { src: 'assets/hero-machine-4.jpg', alt: 'מכונות משקפ מותקנות אצל לקוח' },
    { src: 'assets/gallery-5.jpg', alt: 'מכונת חטיפים ומאפים של משקפ' },
    { src: 'assets/gallery-6.jpg', alt: 'מכונת שתייה של משקפ, מבט מלא' },
    { src: 'assets/gallery-7.jpg', alt: 'מכונת משקפ, מבט מלא' },
    { src: 'assets/gallery-8.jpg', alt: 'מכונת חטיפים של משקפ' },
    { src: 'assets/gallery-9.jpg', alt: 'מכונת משקפ, מבט מלא' }
  ];

  const galleryTiles = [...galleryGrid.querySelectorAll('.gallery-item')];
  const tilePoolIndex = galleryTiles.map((_, i) => i % GALLERY_POOL.length);

  function getLiveImages() {
    return galleryTiles.map(tile => {
      const img = tile.querySelector('img');
      return { src: img.src, alt: img.alt };
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    const images = getLiveImages();
    lightboxImg.src = images[lbIndex].src;
    lightboxImg.alt = images[lbIndex].alt;
    lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }

  function showLightbox(delta) {
    const images = getLiveImages();
    lbIndex = (lbIndex + delta + images.length) % images.length;
    lightboxImg.src = images[lbIndex].src;
    lightboxImg.alt = images[lbIndex].alt;
  }

  galleryTiles.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showLightbox(-1));
  lightboxNext.addEventListener('click', () => showLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showLightbox(1);
    if (e.key === 'ArrowLeft') showLightbox(-1);
  });

  // Gentle automatic rotation: swap one tile at a time to an unused pool image
  setInterval(() => {
    if (document.hidden) return;

    const tileIndex = Math.floor(Math.random() * galleryTiles.length);
    const usedIndexes = new Set(tilePoolIndex);
    usedIndexes.delete(tilePoolIndex[tileIndex]);
    const available = GALLERY_POOL.map((_, i) => i).filter(i => !usedIndexes.has(i) && i !== tilePoolIndex[tileIndex]);

    if (available.length === 0) return;

    const nextPoolIndex = available[Math.floor(Math.random() * available.length)];
    const tile = galleryTiles[tileIndex];
    const img = tile.querySelector('img');

    img.style.opacity = '0';
    setTimeout(() => {
      tilePoolIndex[tileIndex] = nextPoolIndex;
      img.src = GALLERY_POOL[nextPoolIndex].src;
      img.alt = GALLERY_POOL[nextPoolIndex].alt;
      img.style.opacity = '1';
    }, 500);
  }, 3800);
}

// Contact form -> live submission (phone required + validated, email optional)
const FORM_ENDPOINT = 'https://formspree.io/f/xnpajbwv';

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formErrorGeneral = document.getElementById('formErrorGeneral');
const formValidationError = document.getElementById('formValidationError');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const submitBtn = document.getElementById('formSubmit');

function isValidIsraeliPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  return /^0(5\d{8}|[23489]\d{7}|7\d{8})$/.test(digits);
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  formSuccess.classList.remove('visible');
  formErrorGeneral.classList.remove('visible');
  formValidationError.classList.remove('visible');
  nameInput.classList.remove('is-invalid');
  phoneInput.classList.remove('is-invalid');

  const nameFilled = nameInput.value.trim().length > 0;
  const phoneFilled = phoneInput.value.trim().length > 0;
  const phoneValid = phoneFilled && isValidIsraeliPhone(phoneInput.value.trim());

  if (!nameFilled || !phoneFilled) {
    if (!nameFilled) nameInput.classList.add('is-invalid');
    if (!phoneFilled) phoneInput.classList.add('is-invalid');
    formValidationError.textContent = 'שם ונייד הם שדות חובה';
    formValidationError.classList.add('visible');
    (!nameFilled ? nameInput : phoneInput).focus();
    return;
  }

  if (!phoneValid) {
    phoneInput.classList.add('is-invalid');
    formValidationError.textContent = 'יש להזין מספר נייד תקין';
    formValidationError.classList.add('visible');
    phoneInput.focus();
    return;
  }

  if (!FORM_ENDPOINT) {
    console.warn('Contact form: set FORM_ENDPOINT in script.js to enable real submissions.');
    formErrorGeneral.classList.add('visible');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'שולח...';

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm)
    });

    if (response.ok) {
      formSuccess.classList.add('visible');
      contactForm.reset();
    } else {
      formErrorGeneral.classList.add('visible');
    }
  } catch (err) {
    formErrorGeneral.classList.add('visible');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'שליחת פנייה';
  }
});
