document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".gooey-nav-container");
  const nav = container?.querySelector("nav ul");
  const filter = container?.querySelector(".effect.filter");
  const text = container?.querySelector(".effect.text");
  if (!container || !nav || !filter || !text) return;

  // Particles are rendered in nav-shell (outside overflow:hidden container)
  // so they aren't clipped by the container's pill shape.
  const shell = container.closest(".gooey-nav-shell") ?? container;

  const items = Array.from(nav.querySelectorAll("li"));
  const colors = [1, 2, 3, 1, 2, 3, 1, 4];
  const particleCount = 15;
  const animationTime = 600;
  const timeVariance = 300;
  const particleDistances = [90, 10];
  const particleR = 100;
  let activeIndex = Math.max(0, items.findIndex((item) => item.classList.contains("active")));

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const updateEffectPosition = (element) => {
    const containerRect = container.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const styles = {
      left: `${rect.x - containerRect.x}px`,
      top: `${rect.y - containerRect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    };
    Object.assign(filter.style, styles);
    Object.assign(text.style, styles);
    text.textContent = element.textContent.trim();
  };

  const makeParticles = () => {
    const bubbleTime = animationTime * 2 + timeVariance;
    filter.style.setProperty("--time", `${bubbleTime}ms`);
    // Clear previous particles from both container and shell
    shell.querySelectorAll(".nav-particle").forEach((p) => p.remove());
    filter.classList.remove("active");
    void filter.offsetWidth;
    filter.classList.add("active");

    // Calculate filter center relative to shell for particle positioning
    const filterRect = filter.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    const cx = filterRect.x - shellRect.x + filterRect.width / 2 - 8;
    const cy = filterRect.y - shellRect.y + filterRect.height / 2 - 8;

    for (let i = 0; i < particleCount; i += 1) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const start = getXY(particleDistances[0], particleCount - i, particleCount);
      const end = getXY(particleDistances[1] + noise(7), particleCount - i, particleCount);
      const rotateBase = noise(particleR / 10);
      const rotate = rotateBase > 0 ? (rotateBase + particleR / 20) * 10 : (rotateBase - particleR / 20) * 10;

      window.setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        // nav-particle class identifies these for cleanup
        particle.className = "particle nav-particle";
        point.className = "point";
        particle.style.left = `${cx}px`;
        particle.style.top = `${cy}px`;
        particle.style.setProperty("--start-x", `${start[0]}px`);
        particle.style.setProperty("--start-y", `${start[1]}px`);
        particle.style.setProperty("--end-x", `${end[0]}px`);
        particle.style.setProperty("--end-y", `${end[1]}px`);
        particle.style.setProperty("--time", `${t}ms`);
        particle.style.setProperty("--scale", `${1 + noise(0.2)}`);
        particle.style.setProperty("--color", `var(--color-${colors[Math.floor(Math.random() * colors.length)]}, white)`);
        particle.style.setProperty("--rotate", `${rotate}deg`);
        particle.appendChild(point);
        // Append to shell so overflow:hidden on container doesn't clip them
        shell.appendChild(particle);
        window.setTimeout(() => particle.remove(), t);
      }, 30);
    }
  };

  const activate = (item, index) => {
    if (activeIndex === index) return;
    activeIndex = index;
    items.forEach((navItem) => navItem.classList.remove("active"));
    item.classList.add("active");
    updateEffectPosition(item);
    text.classList.remove("active");
    void text.offsetWidth;
    text.classList.add("active");
    makeParticles();
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => activate(item, index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.querySelector("a")?.click();
      }
    });
  });

  updateEffectPosition(items[activeIndex]);
  text.classList.add("active");

  const resizeObserver = new ResizeObserver(() => updateEffectPosition(items[activeIndex]));
  resizeObserver.observe(container);
});
