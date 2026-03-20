import { cleanText, prefersReducedMotion, requestJson, rootDataUrl, siteAssetUrl } from "./shared.js";

export async function initGallery() {
  const galleryRoot = document.getElementById("gallery-grid");
  if (!galleryRoot) return;

  const payload = await requestJson(rootDataUrl("gallery.json"));
  const galleryItems = Array.isArray(payload?.items) ? payload.items : [];
  if (!galleryItems.length) return;

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let galleryTimer = null;
  let galleryIndex = 0;
  let autoplayEnabled = !prefersReducedMotion;

  const openLightbox = (imageUrl, title, displayFilter = "none") => {
    if (!lightbox || typeof lightbox.showModal !== "function") {
      window.open(imageUrl, "_blank", "noreferrer");
      return;
    }
    lightboxImage.src = imageUrl;
    lightboxImage.alt = title;
    lightboxImage.style.filter = displayFilter || "none";
    lightboxCaption.textContent = title;
    lightbox.showModal();
  };

  galleryRoot.innerHTML = `
    <div class="gallery-stage">
      <img
        id="gallery-active-image"
        src=""
        alt=""
        loading="lazy"
        tabindex="0"
        role="button"
        aria-label="Open gallery image in full view"
      />
      <div class="gallery-caption"><p id="gallery-active-caption"></p></div>
    </div>
    <div class="gallery-controls">
      <div class="gallery-dots" id="gallery-dots"></div>
      <div class="gallery-nav-wrap">
        <button class="gallery-nav" type="button" id="gallery-prev">Previous</button>
        <button class="gallery-nav" type="button" id="gallery-next">Next</button>
        <button class="gallery-nav" type="button" id="gallery-toggle" aria-pressed="false">Pause</button>
      </div>
    </div>
  `;

  const activeImage = document.getElementById("gallery-active-image");
  const activeCaption = document.getElementById("gallery-active-caption");
  const dots = document.getElementById("gallery-dots");
  const prev = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  const toggle = document.getElementById("gallery-toggle");

  dots.innerHTML = galleryItems
    .map(
      (_, index) =>
        `<button class="gallery-dot" type="button" data-index="${index}" aria-label="Go to slide ${index + 1}" aria-current="false"></button>`
    )
    .join("");

  const setSlide = (nextIndex) => {
    const total = galleryItems.length;
    galleryIndex = (nextIndex + total) % total;
    const item = galleryItems[galleryIndex];
    const resolvedImage = siteAssetUrl(item.image);
    activeImage.src = resolvedImage;
    activeImage.alt = cleanText(item.title);
    activeImage.style.filter = item.displayFilter || "none";
    activeCaption.textContent = cleanText(item.title);
    activeImage.dataset.image = resolvedImage;
    activeImage.dataset.title = cleanText(item.title);
    activeImage.dataset.displayFilter = item.displayFilter || "none";
    activeImage.setAttribute("aria-label", `Open ${cleanText(item.title)} in full view`);

    dots.querySelectorAll(".gallery-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === galleryIndex);
      dot.setAttribute("aria-current", index === galleryIndex ? "true" : "false");
    });
  };

  const stopAutoRotate = () => {
    if (galleryTimer) {
      clearInterval(galleryTimer);
      galleryTimer = null;
    }
  };

  const updateToggle = () => {
    if (!toggle) return;
    if (prefersReducedMotion) {
      toggle.disabled = true;
      toggle.textContent = "Motion off";
      toggle.setAttribute("aria-pressed", "true");
      return;
    }
    const paused = !autoplayEnabled;
    toggle.textContent = paused ? "Resume" : "Pause";
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute("aria-label", paused ? "Resume gallery rotation" : "Pause gallery rotation");
  };

  const startAutoRotate = () => {
    if (prefersReducedMotion || !autoplayEnabled) return;
    stopAutoRotate();
    galleryTimer = setInterval(() => setSlide(galleryIndex + 1), 6000);
  };

  prev?.addEventListener("click", () => {
    setSlide(galleryIndex - 1);
    startAutoRotate();
  });
  next?.addEventListener("click", () => {
    setSlide(galleryIndex + 1);
    startAutoRotate();
  });

  dots.querySelectorAll(".gallery-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      setSlide(Number(dot.dataset.index));
      if (autoplayEnabled) startAutoRotate();
    });
  });

  toggle?.addEventListener("click", () => {
    if (prefersReducedMotion) return;
    autoplayEnabled = !autoplayEnabled;
    updateToggle();
    if (autoplayEnabled) startAutoRotate();
    else stopAutoRotate();
  });

  activeImage.addEventListener("click", () => {
    openLightbox(activeImage.dataset.image, activeImage.dataset.title, activeImage.dataset.displayFilter || "none");
  });
  activeImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(activeImage.dataset.image, activeImage.dataset.title, activeImage.dataset.displayFilter || "none");
    }
  });

  galleryRoot.addEventListener("mouseenter", stopAutoRotate);
  galleryRoot.addEventListener("mouseleave", startAutoRotate);
  galleryRoot.addEventListener("focusin", stopAutoRotate);
  galleryRoot.addEventListener("focusout", (event) => {
    if (galleryRoot.contains(event.relatedTarget)) return;
    startAutoRotate();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoRotate();
    else startAutoRotate();
  });

  setSlide(0);
  updateToggle();
  startAutoRotate();
}
