const CAPTION_HEIGHT = 62; // px reserved for caption below each photo

function initMasonryGallery(list) {
  if (!list) return;
  if (list._masonryStart) return list._masonryStart;

  const getWrappers = () => Array.from(list.querySelectorAll(".item-wrapper"));

  // Column breakpoints (fewer cols since cards are 2x taller)
  const mediaQueries = [
    { query: "(min-width: 1400px)", columns: 4 },
    { query: "(min-width: 900px)",  columns: 3 },
    { query: "(min-width: 500px)",  columns: 2 },
  ];

  const getColumns = () => {
    const match = mediaQueries.find((item) => window.matchMedia(item.query).matches);
    return match ? match.columns : 1;
  };

  const preloadImages = (wrappers) =>
    Promise.all(
      wrappers.map(
        (wrapper) =>
          new Promise((resolve) => {
            const imgEl = wrapper.querySelector(".item-img");
            const src = wrapper.dataset.img;
            if (!imgEl || !src) { wrapper.classList.add("is-missing-image"); resolve(); return; }
            const img = new Image();
            img.onload = () => {
              imgEl.style.backgroundImage = `url("${src}")`;
              wrapper.classList.remove("is-missing-image");
              resolve();
            };
            img.onerror = () => {
              imgEl.style.backgroundImage = "";
              wrapper.classList.add("is-missing-image");
              resolve();
            };
            img.src = src;
          })
      )
    );

  const layout = (animate = false) => {
    const wrappers = getWrappers();
    const width = list.clientWidth;
    if (!width || !wrappers.length) return;

    const columns = getColumns();
    const columnWidth = width / columns;
    const columnHeights = new Array(columns).fill(0);

    // 2x image height relative to column width
    const minImgH = columns === 1 ? 360 : 280;
    const maxImgH = columns === 1 ? 560 : 480;

    wrappers.forEach((wrapper, index) => {
      const col = columnHeights.indexOf(Math.min(...columnHeights));
      const x = columnWidth * col;
      const y = columnHeights[col];

      const originalHeight = Number(wrapper.dataset.height || 360);
      const variation = Math.min(1.14, Math.max(0.88, originalHeight / 380));
      const imgH = Math.round(
        Math.min(maxImgH, Math.max(minImgH, columnWidth * 1.1 * variation))
      );
      const totalH = imgH + CAPTION_HEIGHT;

      columnHeights[col] += totalH;

      wrapper.style.width = `${columnWidth}px`;
      wrapper.style.height = `${totalH}px`;
      wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (animate && !wrapper.dataset.masonryAnimated) {
        wrapper.dataset.masonryAnimated = "true";
        wrapper.style.filter = "blur(10px)";
        wrapper.style.opacity = "0";
        wrapper.style.transform = `translate3d(${x}px, ${window.innerHeight + 200}px, 0)`;
        requestAnimationFrame(() => {
          wrapper.style.transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s cubic-bezier(0.16,1,0.3,1)";
          wrapper.style.transitionDelay = `${index * 50}ms`;
          wrapper.style.opacity = "1";
          wrapper.style.filter = "blur(0px)";
          wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      } else {
        wrapper.style.opacity = "1";
        wrapper.style.filter = "blur(0px)";
        wrapper.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1), width 0.6s cubic-bezier(0.16,1,0.3,1), height 0.6s cubic-bezier(0.16,1,0.3,1)";
      }
    });

    list.style.height = `${Math.max(...columnHeights)}px`;
  };

  const start = (animate) => preloadImages(getWrappers()).then(() => layout(animate));
  list._masonryStart = start;
  list._masonryLayout = layout;

  const resizeObserver = new ResizeObserver(() => layout(false));
  resizeObserver.observe(list);
  mediaQueries.forEach((item) => {
    window.matchMedia(item.query).addEventListener("change", () => layout(false));
  });

  return start;
}

// Auto-init static galleries on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("[data-masonry-gallery]:not([data-dynamic])");
  if (!list) return;
  const start = initMasonryGallery(list);
  if (start) start(true);
});

// Init dynamic galleries when activities-loader signals ready
document.addEventListener("gallery:ready", (e) => {
  const list = e.detail?.el;
  if (!list) return;
  const start = initMasonryGallery(list);
  if (start) start(true);
});
