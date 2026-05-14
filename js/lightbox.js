(() => {
  let overlay, imgEl, captionEl, closeBtn, prevBtn, nextBtn;
  let items = [];
  let current = 0;

  const build = () => {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#8592;</button>
      <button class="lightbox-next" aria-label="Next">&#8594;</button>
      <div class="lightbox-body">
        <img class="lightbox-img" src="" alt="">
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.documentElement.appendChild(overlay);

    imgEl     = overlay.querySelector(".lightbox-img");
    captionEl = overlay.querySelector(".lightbox-caption");
    closeBtn  = overlay.querySelector(".lightbox-close");
    prevBtn   = overlay.querySelector(".lightbox-prev");
    nextBtn   = overlay.querySelector(".lightbox-next");

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(current - 1); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); go(current + 1); });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);
  };

  const getSrc = (wrapper) => {
    const rel = wrapper.dataset.img || "";
    if (!rel) return "";
    try { return new URL(rel, document.baseURI).href; } catch { return rel; }
  };

  const go = (idx) => {
    if (!items.length) return;
    current = (idx + items.length) % items.length;
    const item = items[current];
    imgEl.src = item.src;
    imgEl.alt = item.caption;
    captionEl.textContent = item.caption;
    prevBtn.style.display = items.length < 2 ? "none" : "";
    nextBtn.style.display = items.length < 2 ? "none" : "";
  };

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const open = (galleryEl, clickedWrapper) => {
    const wrappers = Array.from(galleryEl.querySelectorAll(".item-wrapper"));
    items = wrappers.map((w) => {
      const src = getSrc(w);
      const date  = w.querySelector(".item-caption-date")?.textContent?.trim() || "";
      const title = w.querySelector(".item-caption-title")?.textContent?.trim() || "";
      const caption = [date, title].filter(Boolean).join("  ·  ");
      return { src, caption };
    });
    current = wrappers.indexOf(clickedWrapper);
    if (current < 0) current = 0;

    if (!items[current]?.src) return;

    lockScroll();
    go(current);
    overlay.classList.add("is-open");
  };

  const close = () => {
    overlay.classList.remove("is-open");
    unlockScroll();
    imgEl.src = "";
  };

  const onKey = (e) => {
    if (!overlay.classList.contains("is-open")) return;
    if (e.key === "Escape")      close();
    if (e.key === "ArrowLeft")   go(current - 1);
    if (e.key === "ArrowRight")  go(current + 1);
  };

  const attach = (galleryEl) => {
    galleryEl.addEventListener("click", (e) => {
      const wrapper = e.target.closest(".item-wrapper");
      if (!wrapper) return;
      open(galleryEl, wrapper);
    });
  };

  document.addEventListener("DOMContentLoaded", build);
  document.addEventListener("gallery:ready", (e) => {
    const el = e.detail?.el;
    if (el) attach(el);
  });
})();
