document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("[data-masonry-gallery]");
  if (!list) return;

  const wrappers = Array.from(list.querySelectorAll(".item-wrapper"));
  const mediaQueries = [
    { query: "(min-width: 1500px)", columns: 5 },
    { query: "(min-width: 1000px)", columns: 4 },
    { query: "(min-width: 600px)", columns: 3 },
    { query: "(min-width: 400px)", columns: 2 }
  ];

  const getColumns = () => {
    const match = mediaQueries.find((item) => window.matchMedia(item.query).matches);
    return match ? match.columns : 1;
  };

  const preloadImages = () =>
    Promise.all(
      wrappers.map(
        (wrapper) =>
          new Promise((resolve) => {
            const imgEl = wrapper.querySelector(".item-img");
            const src = wrapper.dataset.img;
            if (!imgEl || !src) {
              wrapper.classList.add("is-missing-image");
              resolve();
              return;
            }

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
    const width = list.clientWidth;
    if (!width) return;

    const columns = getColumns();
    const columnWidth = width / columns;
    const columnHeights = new Array(columns).fill(0);
    const minHeight = columns === 1 ? 190 : 150;
    const maxHeight = columns === 1 ? 280 : 245;

    wrappers.forEach((wrapper, index) => {
      const col = columnHeights.indexOf(Math.min(...columnHeights));
      const x = columnWidth * col;
      const y = columnHeights[col];
      const originalHeight = Number(wrapper.dataset.height || 360);
      const variation = Math.min(1.14, Math.max(0.88, originalHeight / 380));
      const height = Math.round(
        Math.min(maxHeight, Math.max(minHeight, columnWidth * 0.64 * variation))
      );

      columnHeights[col] += height;

      wrapper.style.width = `${columnWidth}px`;
      wrapper.style.height = `${height}px`;
      wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (animate && !wrapper.dataset.masonryAnimated) {
        wrapper.dataset.masonryAnimated = "true";
        wrapper.style.filter = "blur(10px)";
        wrapper.style.opacity = "0";
        wrapper.style.transform = `translate3d(${x}px, ${window.innerHeight + 200}px, 0)`;

        requestAnimationFrame(() => {
          wrapper.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
          wrapper.style.transitionDelay = `${index * 50}ms`;
          wrapper.style.opacity = "1";
          wrapper.style.filter = "blur(0px)";
          wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      } else {
        wrapper.style.opacity = "1";
        wrapper.style.filter = "blur(0px)";
        wrapper.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      }
    });

    list.style.height = `${Math.max(...columnHeights)}px`;
  };

  preloadImages().then(() => layout(true));

  const resizeObserver = new ResizeObserver(() => layout(false));
  resizeObserver.observe(list);

  mediaQueries.forEach((item) => {
    window.matchMedia(item.query).addEventListener("change", () => layout(false));
  });
});
