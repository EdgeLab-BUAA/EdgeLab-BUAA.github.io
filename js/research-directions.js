document.addEventListener("DOMContentLoaded", async () => {
  const grids = Array.from(document.querySelectorAll("[data-research-directions-grid]"));
  if (!grids.length) return;

  const i18n = window.labI18n;
  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key) => i18n?.t?.(key) || key;

  const scriptEl = document.querySelector('script[src*="research-directions.js"]');
  const scriptSrc = scriptEl ? scriptEl.getAttribute("src") : "./js/research-directions.js";
  const depth = (scriptSrc.match(/\.\.\//g) || []).length;
  const rootPrefix = depth > 0 ? "../".repeat(depth) : "./";

  let directions = [];
  try {
    const response = await fetch(`${rootPrefix}mainpage/directions/directions.json`);
    if (response.ok) {
      const data = await response.json();
      directions = Array.isArray(data.directions) ? data.directions : [];
    }
  } catch {
    // file:// or network: fetch often fails; use embedded data below.
  }
  if (!directions.length && window.__LAB_DIRECTIONS__) {
    const fallback = window.__LAB_DIRECTIONS__;
    directions = Array.isArray(fallback.directions) ? fallback.directions : [];
  }

  const pick = (item, enKey, zhKey, plainKey) => {
    const lang = getLang();
    if (lang === "zh") return item[zhKey] || item[plainKey] || item[enKey] || "";
    return item[enKey] || item[plainKey] || item[zhKey] || "";
  };

  const renderCard = (item) => {
    const title = pick(item, "title_en", "title_zh", "title");
    const intro = pick(item, "intro_en", "intro_zh", "intro");
    const rawHref = item.href || "./projects.html";
    const external = /^https?:\/\//i.test(rawHref);
    const href = external ? rawHref : rawHref.replace(/^\.\//, rootPrefix);
    const readMore = t("dynamic.news.readMore");

    return `
      <a class="research-direction-card" href="${esc(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>
        <h3>${esc(title)}</h3>
        <p>${esc(intro)}</p>
        <div class="research-direction-card__footer">
          <span class="research-direction-card__link">${esc(readMore)} <span aria-hidden="true">→</span></span>
        </div>
      </a>
    `;
  };

  const render = () => {
    grids.forEach((grid) => {
      grid.innerHTML = directions.length
        ? directions.map(renderCard).join("\n")
        : `<p class="research-directions-empty" style="text-align:center;color:#9a9a9a;grid-column:1/-1;padding:24px 0">${esc(t("dynamic.directions.error"))}</p>`;
    });
  };

  render();
  document.addEventListener("languagechange", render);
});
