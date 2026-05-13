document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("[data-magic-bento]");
  if (!grid) return;
  const i18n = window.labI18n;

  const spotlightRadius = 400;
  const glowColor = "132, 0, 255";
  const isMobile = window.innerWidth <= 768;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key) => i18n?.t?.(key) || key;

  const initials = (title) =>
    title
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");

  const summarizeAuthors = (authors) => {
    const clean = authors.replaceAll("✉", "").replaceAll("*", "");
    const firstThree = clean.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 3);
    return firstThree.join(", ");
  };

  let projects = [];
  try {
    const response = await fetch("./highlighted-research/data/projects.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    projects = Array.isArray(data.projects) ? data.projects.slice(0, 6) : [];
  } catch {
    const fallback = window.__LAB_HIGHLIGHTED_PROJECTS__;
    projects = Array.isArray(fallback?.projects) ? fallback.projects.slice(0, 6) : [];
    if (!projects.length) return;
  }

  const renderCards = () => {
    const lang = getLang();
    grid.innerHTML = projects
      .map((project) => {
        const title = lang === "zh" ? project.title_zh || project.title : project.title;
        const authors = lang === "zh" ? project.authors_zh || project.authors : project.authors;
        const venue = lang === "zh" ? project.venue_zh || project.venue : project.venue;
        const award = lang === "zh" ? project.award_zh || project.award : project.award;
        const image = project.cover_image
          ? `<div class="magic-bento-card__image"><img src="./${escapeHtml(project.cover_image)}" alt="${escapeHtml(title)} cover"></div>`
          : "";
        return `
          <article class="magic-bento-card magic-bento-card--border-glow" style="--glow-color-rgb: ${glowColor}">
            ${image}
            <div class="magic-bento-card__header">
              <div class="magic-bento-card__label">${escapeHtml(project.group || t("common.project"))}</div>
            </div>
            <div class="magic-bento-card__content">
              <h3 class="magic-bento-card__title">${escapeHtml(title || initials(project.id || "AI"))}</h3>
              <p class="magic-bento-card__description">${escapeHtml(summarizeAuthors(authors || ""))}</p>
              <div class="magic-bento-card__meta">
                <p class="magic-bento-card__venue">${escapeHtml(venue || "")}${award ? ` (${escapeHtml(award)})` : ""}</p>
                <span class="magic-bento-card__year">${escapeHtml(project.year || "")}</span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  renderCards();
  document.addEventListener("languagechange", renderCards);

  let cards = Array.from(grid.querySelectorAll(".magic-bento-card"));
  if (!cards.length || isMobile) return;

  const updateCardGlowProperties = (card, mouseX, mouseY, glow) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glow-x", `${relativeX}%`);
    card.style.setProperty("--glow-y", `${relativeY}%`);
    card.style.setProperty("--glow-intensity", String(glow));
    card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
  };

  const spotlight = document.createElement("div");
  spotlight.className = "global-spotlight";
  spotlight.style.cssText = `
    position: fixed;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(${glowColor}, 0.15) 0%,
      rgba(${glowColor}, 0.08) 15%,
      rgba(${glowColor}, 0.04) 25%,
      rgba(${glowColor}, 0.02) 40%,
      rgba(${glowColor}, 0.01) 65%,
      transparent 70%);
    opacity: 0;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(spotlight);

  const proximity = spotlightRadius * 0.5;
  const fadeDistance = spotlightRadius * 0.75;

  document.addEventListener("languagechange", () => {
    cards = Array.from(grid.querySelectorAll(".magic-bento-card"));
  });

  document.addEventListener("mousemove", (event) => {
    const section = grid.closest(".bento-section");
    const rect = section?.getBoundingClientRect();
    const inside =
      rect &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      spotlight.style.opacity = "0";
      cards.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
      return;
    }

    spotlight.style.left = `${event.clientX}px`;
    spotlight.style.top = `${event.clientY}px`;

    let minDistance = Infinity;
    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const centerX = cardRect.left + cardRect.width / 2;
      const centerY = cardRect.top + cardRect.height / 2;
      const distance =
        Math.hypot(event.clientX - centerX, event.clientY - centerY) -
        Math.max(cardRect.width, cardRect.height) / 2;
      const effectiveDistance = Math.max(0, distance);
      minDistance = Math.min(minDistance, effectiveDistance);

      let glowIntensity = 0;
      if (effectiveDistance <= proximity) glowIntensity = 1;
      else if (effectiveDistance <= fadeDistance) {
        glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
      }

      updateCardGlowProperties(card, event.clientX, event.clientY, glowIntensity);
    });

    const targetOpacity =
      minDistance <= proximity
        ? 0.8
        : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0;

    spotlight.style.opacity = String(targetOpacity);
  });
});
