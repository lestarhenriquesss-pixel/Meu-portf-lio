const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setupReveal() {
  const items = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const target = Number(node.dataset.count || 0);
        const duration = 900;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(node);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupFilters() {
  const buttons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".case-card")];
  const loadMoreButton = document.getElementById("loadMoreProjects");
  const countNode = document.getElementById("projectCount");
  const pageSize = 5;
  let activeFilter = "todos";
  let visibleLimit = pageSize;

  function cardMatches(card) {
    const tags = card.dataset.tags || "";
    return activeFilter === "todos" || tags.includes(activeFilter);
  }

  function renderCards() {
    const matchedCards = cards.filter(cardMatches);

    cards.forEach((card) => {
      const matches = cardMatches(card);
      card.classList.toggle("is-hidden", !matches);
      if (!matches) {
        card.classList.remove("is-paged-hidden");
        return;
      }

      const index = matchedCards.indexOf(card);
      card.classList.toggle("is-paged-hidden", index >= visibleLimit);
    });

    const shown = Math.min(visibleLimit, matchedCards.length);
    const remaining = Math.max(matchedCards.length - shown, 0);

    if (countNode) {
      countNode.textContent = matchedCards.length
        ? `${shown} de ${matchedCards.length} projetos exibidos`
        : "Nenhum projeto nesta categoria";
    }

    if (loadMoreButton) {
      loadMoreButton.hidden = remaining === 0;
      loadMoreButton.textContent = remaining > pageSize
        ? "Ver mais 5 projetos"
        : `Ver mais ${remaining} ${remaining === 1 ? "projeto" : "projetos"}`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "todos";
      visibleLimit = pageSize;

      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      renderCards();
    });
  });

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      visibleLimit += pageSize;
      renderCards();
    });
  }

  renderCards();
}

function setupProjectRotator() {
  const rotator = document.querySelector(".project-rotator");
  if (!rotator || rotator.dataset.rotatorReady === "true") return;

  const slides = Array.from(rotator.querySelectorAll(".rotator-slide"));
  const kicker = document.getElementById("rotatorKicker");
  const title = document.getElementById("rotatorTitle");
  const dotsContainer = rotator.querySelector(".rotator-dots");
  const progressBar = rotator.querySelector(".rotator-progress span");

  if (slides.length <= 1) return;

  rotator.dataset.rotatorReady = "true";

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;

  let intervalId = null;
  let userPaused = false;
  const intervalTime = 3200;

  if (dotsContainer) dotsContainer.innerHTML = "";

  const dots = dotsContainer
    ? slides.map((slide, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", `Ver projeto ${index + 1}: ${slide.dataset.title || slide.alt || "Projeto"}`);
        button.addEventListener("click", () => {
          showSlide(index);
          restartAutoPlay();
        });
        dotsContainer.appendChild(button);
        return button;
      })
    : [];

  function normalizeIndex(index) {
    return (index + slides.length) % slides.length;
  }

  function updateCaption(slide) {
    if (kicker) kicker.textContent = slide.dataset.kicker || "Portfólio analítico";
    if (title) title.textContent = slide.dataset.title || slide.alt || "Dashboards · Apps · Automação";
  }

  function showSlide(index) {
    activeIndex = normalizeIndex(index);

    slides.forEach((slide, currentIndex) => {
      const isActive = currentIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, currentIndex) => {
      const isActive = currentIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    updateCaption(slides[activeIndex]);

    if (progressBar && !prefersReducedMotion) {
      progressBar.style.animation = "none";
      progressBar.offsetHeight;
      progressBar.style.animation = `rotatorProgress ${intervalTime}ms linear forwards`;
    }
  }

  function nextSlide() {
    showSlide(activeIndex + 1);
  }

  function stopAutoPlay() {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    intervalId = null;
  }

  function startAutoPlay() {
    if (userPaused || document.hidden) return;
    stopAutoPlay();
    intervalId = window.setInterval(nextSlide, intervalTime);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  rotator.setAttribute("tabindex", "0");

  rotator.addEventListener("mouseenter", () => {
    userPaused = true;
    stopAutoPlay();
  });

  rotator.addEventListener("mouseleave", () => {
    userPaused = false;
    startAutoPlay();
  });

  rotator.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
      restartAutoPlay();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
      restartAutoPlay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  });

  showSlide(activeIndex);
  startAutoPlay();
}

function setupGalleryModal() {
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("galleryModalImage");
  const modalTitle = document.getElementById("galleryModalTitle");
  const modalText = document.getElementById("galleryModalText");
  const closeButtons = [...document.querySelectorAll("[data-gallery-close]")];
  const items = [...document.querySelectorAll("[data-gallery-item]")];
  let lastFocusedElement = null;

  if (!modal || !modalImage || !modalTitle || !modalText || items.length === 0) return;

  function openModal(item) {
    const image = item.querySelector("img");
    if (!image) return;

    lastFocusedElement = document.activeElement;
    modalImage.src = image.getAttribute("src") || "";
    modalImage.alt = image.getAttribute("alt") || item.dataset.title || "Projeto do portfólio";
    modalTitle.textContent = item.dataset.title || image.getAttribute("alt") || "Projeto do portfólio";
    modalText.textContent = item.dataset.summary || "Resumo do projeto selecionado no portfólio.";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".gallery-modal__close");
    closeButton?.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.removeAttribute("src");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  items.forEach((item) => {
    item.addEventListener("click", () => openModal(item));
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openModal(item);
    });
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function setupNavState() {
  const links = [...document.querySelectorAll(".top-nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupCanvas() {
  const canvas = document.getElementById("dataCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let time = 0;
  let points = [];

  const colors = ["#41d9c7", "#7aa2ff", "#f2b84b", "#ff6d7a", "#9be564"];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    points = Array.from({ length: 46 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.18 + Math.random() * 0.42,
      size: 1 + Math.random() * 2.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 88) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += 88) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function drawWave(index, color, base, amplitude, speed) {
    ctx.beginPath();
    for (let x = -20; x <= width + 20; x += 20) {
      const y =
        base +
        Math.sin(x * 0.006 + time * speed + index) * amplitude +
        Math.cos(x * 0.013 + time * speed * 0.7) * (amplitude * 0.35);
      if (x === -20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawBars() {
    const barCount = 22;
    const barWidth = Math.max(8, width / 120);
    const gap = barWidth * 1.2;
    const totalWidth = barCount * (barWidth + gap);
    const start = width - totalWidth - 40;
    const base = height - 70;

    for (let i = 0; i < barCount; i += 1) {
      const h = 24 + Math.abs(Math.sin(time * 0.018 + i * 0.7)) * 86;
      ctx.fillStyle = colors[i % colors.length] + "55";
      ctx.fillRect(start + i * (barWidth + gap), base - h, barWidth, h);
    }
  }

  function drawNodes() {
    points.forEach((point, index) => {
      point.y -= point.speed;
      point.x += Math.sin(time * 0.012 + index) * 0.16;
      if (point.y < -10) {
        point.y = height + 10;
        point.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.fillStyle = point.color + "88";
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function frame() {
    time += 1;
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawWave(0, "rgba(65, 217, 199, 0.24)", height * 0.34, 34, 0.025);
    drawWave(2, "rgba(122, 162, 255, 0.18)", height * 0.48, 48, 0.02);
    drawWave(4, "rgba(242, 184, 75, 0.14)", height * 0.63, 58, 0.018);
    drawBars();
    drawNodes();

    if (!prefersReducedMotion) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  frame();
}

function safeInit(name, callback) {
  try {
    callback();
  } catch (error) {
    console.warn(`Falha ao iniciar ${name}:`, error);
  }
}

function initPortfolio() {
  // O carrossel fica primeiro para não depender das outras animações da página.
  safeInit("carrossel de projetos", setupProjectRotator);
  safeInit("animações de entrada", setupReveal);
  safeInit("contadores", setupCounters);
  safeInit("filtros", setupFilters);
  safeInit("estado da navegação", setupNavState);
  safeInit("canvas de fundo", setupCanvas);
  safeInit("modal da galeria", setupGalleryModal);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}
