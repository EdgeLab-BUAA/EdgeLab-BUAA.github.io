document.addEventListener("DOMContentLoaded", async () => {
  const sections = Array.from(document.querySelectorAll("[data-news-cards]"));
  if (!sections.length) return;
  const i18n = window.labI18n;

  const esc = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key) => i18n?.t?.(key) || key;

  const initials = (title) =>
    String(title || "")
      .split(/[^A-Za-z0-9\u4e00-\u9fa5]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "NW";

  let items = [];
  try {
    const response = await fetch("./news/data/news.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    items = Array.isArray(data.items) ? data.items : [];
  } catch {
    const fallback = window.__LAB_NEWS__;
    items = Array.isArray(fallback?.items) ? fallback.items : [];
    if (!items.length) {
      sections.forEach((section) => {
        section.innerHTML = `<p class="news-cards-empty">${esc(t("dynamic.news.error"))}</p>`;
      });
      return;
    }
  }

  const renderCard = (item) => {
    const lang = getLang();
    const title = lang === "zh"
      ? item.title_zh || item.title_en || item.title || item.id
      : item.title_en || item.title || item.title_zh || item.id;
    const excerpt = lang === "zh"
      ? item.excerpt_zh || item.excerpt || ""
      : item.excerpt_en || item.excerpt || "";
    const type = lang === "zh"
      ? item.type_zh || item.type || ""
      : item.type_en || item.type || "";
    const meta = [type, item.date].filter(Boolean).join(" · ");
    const media = item.image
      ? `<div class="news-card__media"><img src="./${esc(item.image)}" alt="${esc(title)}"></div>`
      : `<div class="news-card__media news-card__media--fallback" aria-hidden="true"><span>${esc(initials(title))}</span></div>`;
    const href = item.link || "./news.html";
    const external = /^https?:\/\//i.test(href);

    return `
      <article class="news-card">
        ${media}
        <div class="news-card__body">
          ${meta ? `<p class="news-card__meta">${esc(meta)}</p>` : ""}
          <h3 class="news-card__title">${esc(title)}</h3>
          ${excerpt ? `<p class="news-card__excerpt">${esc(excerpt)}</p>` : ""}
          <div class="news-card__footer">
            <a class="news-card__link" href="${esc(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${esc(t("dynamic.news.readMore"))} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>
    `;
  };

  const bindHoverEffects = (section) => {
    if (section.dataset.newsHoverBound === "true") return;
    section.dataset.newsHoverBound = "true";

    const updateCardGlow = (card, mouseX, mouseY, glow) => {
      const rect = card.getBoundingClientRect();
      const relativeX = ((mouseX - rect.left) / rect.width) * 100;
      const relativeY = ((mouseY - rect.top) / rect.height) * 100;
      card.style.setProperty("--glow-x", `${relativeX}%`);
      card.style.setProperty("--glow-y", `${relativeY}%`);
      card.style.setProperty("--glow-intensity", String(glow));
    };

    section.addEventListener("mousemove", (event) => {
      const cards = Array.from(section.querySelectorAll(".news-card"));
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        updateCardGlow(card, event.clientX, event.clientY, inside ? 1 : 0);
      });
    });

    section.addEventListener("mouseleave", () => {
      section.querySelectorAll(".news-card").forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
    });
  };

  const render = () => {
    sections.forEach((section) => {
      const limit = Number(section.dataset.newsLimit || 0);
      const subset = limit > 0 ? items.slice(0, limit) : items;
      section.innerHTML = subset.length
        ? subset.map(renderCard).join("\n")
        : `<p class="news-cards-empty">${esc(t("dynamic.news.empty"))}</p>`;
      bindHoverEffects(section);
    });
  };

  render();
  document.addEventListener("languagechange", render);
});
