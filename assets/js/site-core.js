import { assetDataUrl, cleanText, prefersReducedMotion, requestJson, siteAssetUrl, rootDataUrl } from "./shared.js";

const YOUTUBE_VIEW_REFRESH_MS = 10 * 60 * 1000;

function getScrollTargetY(target) {
  const header = document.querySelector(".site-header");
  const stickyOffset =
    header && target.id !== "home" && target.id !== "top" ? header.getBoundingClientRect().height + 10 : 0;
  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - stickyOffset);
}

function scrollToTarget(target, options = {}) {
  if (!target) return;
  const behavior = options.behavior || (prefersReducedMotion ? "auto" : "smooth");
  window.scrollTo({ top: getScrollTargetY(target), behavior });
  if (options.updateHash && target.id) {
    window.history.replaceState(null, "", `#${target.id}`);
  }
}

function applyInitialScrollPosition() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  const hash = decodeURIComponent((window.location.hash || "").replace(/^#/, "")).trim();
  if (!hash || hash.toLowerCase() === "home") {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    return;
  }
  const target = document.getElementById(hash);
  if (!target) return;
  window.requestAnimationFrame(() => scrollToTarget(target, { behavior: "auto", updateHash: false }));
}

function setupAnchorNavigation() {
  const inPageLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter((link) => {
    const href = link.getAttribute("href");
    return Boolean(href && href.length > 1);
  });

  inPageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      event.preventDefault();
      const isSkipLink = link.classList.contains("skip-link");
      scrollToTarget(target, { updateHash: !isSkipLink });
      if (isSkipLink) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  });
}

function setupNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!navToggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;
    if (event.target === navToggle || navToggle.contains(event.target) || nav.contains(event.target)) return;
    closeNav();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeNav();
  });
}

function setupSectionNavigationHighlight() {
  const sectionLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]')).filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.length > 1;
  });
  if (!sectionLinks.length) return;

  const linkById = new Map();
  const sections = sectionLinks
    .map((link) => {
      const id = decodeURIComponent((link.getAttribute("href") || "").slice(1));
      const section = document.getElementById(id);
      if (section) linkById.set(id, link);
      return section;
    })
    .filter(Boolean);
  if (!sections.length) return;

  const setActiveLink = (id) => {
    sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
    const activeLink = linkById.get(id);
    if (activeLink) activeLink.setAttribute("aria-current", "location");
  };

  const updateActiveLink = () => {
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const checkpoint = headerHeight + Math.min(window.innerHeight * 0.28, 220);
    let activeId = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= checkpoint) activeId = section.id;
    });
    setActiveLink(activeId);
  };

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = decodeURIComponent((link.getAttribute("href") || "").slice(1));
      if (id) setActiveLink(id);
    });
  });

  if (typeof IntersectionObserver === "function") {
    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) updateActiveLink();
      },
      { rootMargin: `-${headerHeight + 12}px 0px -55% 0px`, threshold: [0.16, 0.4, 0.72] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();
}

let revealObserver = null;
export function observeRevealTargets(root = document) {
  if (!revealObserver) return;
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => revealObserver.observe(element));
}

function setupRevealObserver() {
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  observeRevealTargets();
}

function setupScrollDynamics() {
  const root = document.documentElement;
  const getScrollTop = () => window.scrollY || window.pageYOffset || 0;
  const getMaxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const applyValues = (scrollValue) => {
    const maxScroll = getMaxScroll();
    const progress = Math.min(100, Math.max(0, (scrollValue / maxScroll) * 100));
    root.style.setProperty("--scroll-progress", `${progress}%`);
    root.style.setProperty("--hero-shift", `${Math.min(44, scrollValue * 0.07).toFixed(1)}px`);
    document.body.classList.toggle("is-scrolled", scrollValue > 16);
  };

  let latestScroll = getScrollTop();
  let rafId = null;
  const renderFrame = () => {
    rafId = null;
    applyValues(prefersReducedMotion ? 0 : latestScroll);
  };
  const requestFrame = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(renderFrame);
  };
  applyValues(prefersReducedMotion ? 0 : latestScroll);
  window.addEventListener("scroll", () => {
    latestScroll = getScrollTop();
    requestFrame();
  }, { passive: true });
  window.addEventListener("resize", () => {
    latestScroll = getScrollTop();
    requestFrame();
  });
}

function setupCollaboratorCarousel() {
  const carousel = document.querySelector("[data-collab-carousel]");
  if (!carousel || prefersReducedMotion) return;
  const scroller = carousel.querySelector(".collab-showcase");
  const baseCards = scroller ? Array.from(scroller.querySelectorAll(".collab-card")) : [];
  if (!scroller || baseCards.length < 2) return;

  const clones = baseCards.map((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    scroller.appendChild(clone);
    return clone;
  });

  let loopWidth = 0;
  let trackPosition = 0;
  let rafId = null;
  let isPaused = false;
  let lastTimestamp = 0;
  const speedPxPerSecond = 36;

  const normalizeTrackPosition = () => {
    if (!loopWidth) {
      trackPosition = 0;
      return;
    }
    while (trackPosition >= loopWidth) trackPosition -= loopWidth;
    while (trackPosition < 0) trackPosition += loopWidth;
  };

  const applyTrackPosition = () => {
    scroller.style.transform = `translate3d(${-trackPosition}px, 0, 0)`;
  };

  const computeMetrics = () => {
    const first = baseCards[0];
    const firstClone = clones[0];
    if (!first || !firstClone) return;
    loopWidth = Math.max(firstClone.offsetLeft - first.offsetLeft, 1);
    normalizeTrackPosition();
    applyTrackPosition();
  };

  const stop = () => {
    isPaused = true;
    lastTimestamp = 0;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = (timestamp) => {
    if (isPaused || document.hidden) {
      rafId = null;
      return;
    }
    if (!loopWidth) computeMetrics();
    if (!loopWidth) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = Math.min((timestamp - lastTimestamp) / 1000, 0.06);
    lastTimestamp = timestamp;
    trackPosition += speedPxPerSecond * elapsed;
    normalizeTrackPosition();
    applyTrackPosition();
    rafId = window.requestAnimationFrame(tick);
  };

  const start = () => {
    isPaused = false;
    if (rafId === null) {
      lastTimestamp = 0;
      rafId = window.requestAnimationFrame(tick);
    }
  };

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", (event) => {
    if (carousel.contains(event.relatedTarget)) return;
    start();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
  window.addEventListener("resize", computeMetrics);
  computeMetrics();
  start();
}

async function setupHeroSlideshow() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const copy = await requestJson(rootDataUrl("site-copy.json"));
  const heroSlides = Array.isArray(copy?.heroSlides) ? copy.heroSlides : [];
  const layers = hero.querySelectorAll(".hero-slide");
  if (layers.length < 2 || heroSlides.length === 0) return;

  const prevButton = document.getElementById("hero-prev");
  const nextButton = document.getElementById("hero-next");
  const toggleButton = document.getElementById("hero-toggle");
  const toggleIcon = toggleButton ? toggleButton.querySelector(".hero-control-icon") : null;
  const toggleLabel = document.getElementById("hero-toggle-label");
  let activeLayer = 0;
  let activeIndex = 0;
  let autoplayEnabled = !prefersReducedMotion;
  let timer = null;

  const applySlide = (layer, slideIndex) => {
    const total = heroSlides.length;
    const normalized = ((slideIndex % total) + total) % total;
    const slide = heroSlides[normalized];
    layer.style.backgroundImage = `url("${siteAssetUrl(slide.image)}")`;
    layer.style.backgroundPosition = slide.position || "center center";
  };

  const setSlide = (slideIndex) => {
    const total = heroSlides.length;
    const normalized = ((slideIndex % total) + total) % total;
    if (normalized === activeIndex) return;
    const nextLayer = (activeLayer + 1) % layers.length;
    applySlide(layers[nextLayer], normalized);
    layers[nextLayer].classList.add("is-active");
    layers[activeLayer].classList.remove("is-active");
    activeLayer = nextLayer;
    activeIndex = normalized;
  };

  const stopAuto = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  const startAuto = () => {
    stopAuto();
    if (!autoplayEnabled || prefersReducedMotion || heroSlides.length < 2) return;
    timer = setInterval(() => setSlide(activeIndex + 1), 9000);
  };

  const updateToggle = () => {
    if (!toggleButton) return;
    if (prefersReducedMotion) {
      toggleButton.disabled = true;
      toggleButton.setAttribute("aria-pressed", "true");
      if (toggleIcon) toggleIcon.textContent = "•";
      if (toggleLabel) toggleLabel.textContent = "Motion off";
      return;
    }
    const paused = !autoplayEnabled;
    toggleButton.setAttribute("aria-pressed", String(paused));
    if (toggleIcon) toggleIcon.textContent = paused ? "▶" : "⏸";
    if (toggleLabel) toggleLabel.textContent = paused ? "Resume motion" : "Pause motion";
  };

  applySlide(layers[0], activeIndex);
  layers[0].classList.add("is-active");
  applySlide(layers[1], activeIndex + 1);
  layers[1].classList.remove("is-active");

  prevButton?.addEventListener("click", () => {
    setSlide(activeIndex - 1);
    if (autoplayEnabled) startAuto();
  });
  nextButton?.addEventListener("click", () => {
    setSlide(activeIndex + 1);
    if (autoplayEnabled) startAuto();
  });
  toggleButton?.addEventListener("click", () => {
    if (prefersReducedMotion) return;
    autoplayEnabled = !autoplayEnabled;
    updateToggle();
    if (autoplayEnabled) startAuto();
    else stopAuto();
  });

  hero.addEventListener("mouseenter", stopAuto);
  hero.addEventListener("mouseleave", startAuto);
  hero.addEventListener("focusin", stopAuto);
  hero.addEventListener("focusout", (event) => {
    if (hero.contains(event.relatedTarget)) return;
    startAuto();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  updateToggle();
  startAuto();
}

function parseViewCount(rawCount) {
  if (rawCount === null || rawCount === undefined) return null;
  const normalized = Number(String(rawCount).replace(/,/g, ""));
  if (!Number.isFinite(normalized) || normalized < 0) return null;
  return Math.floor(normalized);
}

async function fetchYouTubeViewMetrics(videoId) {
  if (!videoId) return null;
  const statsPayload = await requestJson(`${assetDataUrl("youtube-video-stats.json")}?t=${Date.now()}`);
  const statsCount = parseViewCount(statsPayload?.viewCount);
  if (statsCount !== null && (!statsPayload?.videoId || cleanText(statsPayload.videoId) === cleanText(videoId))) {
    return { views: statsCount, updatedAt: statsPayload?.generatedAt || statsPayload?.updatedAt || null };
  }
  return null;
}

async function setupYouTubeViewCounter() {
  const counter = document.getElementById("lab-video-view-count");
  if (!counter) return;
  const siteCopy = await requestJson(rootDataUrl("site-copy.json"));
  const videoId = cleanText(siteCopy?.featuredVideoId);
  if (!videoId) return;

  const updateCounter = async () => {
    const metrics = await fetchYouTubeViewMetrics(videoId);
    if (!metrics || !Number.isFinite(metrics.views)) {
      counter.hidden = true;
      return;
    }
    const viewsText = new Intl.NumberFormat("en-US").format(metrics.views);
    const updatedDate = metrics.updatedAt ? new Date(metrics.updatedAt) : new Date();
    const validUpdatedDate =
      Number.isNaN(updatedDate.getTime()) || !Number.isFinite(updatedDate.getTime()) ? new Date() : updatedDate;
    const updatedText = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(validUpdatedDate);
    counter.textContent = `${viewsText} views · updated ${updatedText}`;
    counter.hidden = false;
  };

  updateCounter();
  window.setInterval(updateCounter, YOUTUBE_VIEW_REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateCounter();
  });
}

export async function initSiteCore() {
  applyInitialScrollPosition();
  setupNavigation();
  setupAnchorNavigation();
  setupSectionNavigationHighlight();
  setupRevealObserver();
  setupScrollDynamics();
  setupCollaboratorCarousel();
  await Promise.all([setupHeroSlideshow(), setupYouTubeViewCounter()]);
}
