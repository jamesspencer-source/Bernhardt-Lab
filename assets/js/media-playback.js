export function initMediaPlayback() {
  const image = document.getElementById("microscopy-animation");
  const toggle = document.getElementById("microscopy-toggle");
  if (!image || !toggle) return;
  const poster = image.getAttribute("src");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playing = false;
  const pause = () => {
    playing = false;
    image.src = poster;
    toggle.textContent = "Play animation";
    toggle.setAttribute("aria-pressed", "false");
  };

  toggle.hidden = false;
  document.getElementById("microscopy-fallback")?.setAttribute("hidden", "");
  toggle.addEventListener("click", () => {
    if (playing) return pause();
    playing = true;
    image.src = image.dataset.animationSrc;
    toggle.textContent = "Pause animation";
    toggle.setAttribute("aria-pressed", "true");
  });
  motion.addEventListener("change", pause);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && playing) pause();
    }).observe(image);
  }
}
