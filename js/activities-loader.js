document.addEventListener("DOMContentLoaded", async () => {
  const galleries = Array.from(
    document.querySelectorAll("[data-masonry-gallery][data-dynamic]")
  );
  if (!galleries.length) return;

  const i18n = window.labI18n;

  const esc = (v) =>
    String(v)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key) => i18n?.t?.(key) || key;

  let data;
  try {
    const res = await fetch("./team-building.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch {
    data = window.__LAB_ACTIVITIES__;
    if (!data?.photos) {
      galleries.forEach((g) => {
        g.innerHTML = `<p style="text-align:center;color:#9a9a9a;padding:60px">${esc(t("dynamic.activities.error"))}</p>`;
      });
      return;
    }
  }

  const renderCard = (p) => {
    const lang = getLang();
    const title = lang === "zh" ? p.title_zh || p.title_en : p.title_en || p.title_zh;
    const location = lang === "zh" ? p.location_zh || p.location_en : p.location_en || p.location_zh;
    const caption = [title, location].filter(Boolean).join(" · ");
    return `
      <div class="item-wrapper" data-key="${esc(p.id)}" data-height="${p.height}" data-img="./${esc(p.image)}">
        <div class="item-img" role="img" aria-label="${esc(title || t("dynamic.activities.photoAria"))}"></div>
        <div class="item-caption">
          <p class="item-caption-date">${esc(p.date)}${p.photographer ? " · " + esc(p.photographer) : ""}</p>
          ${caption ? `<p class="item-caption-title">${esc(caption)}</p>` : ""}
        </div>
      </div>`;
  };

  const render = () => {
    galleries.forEach((gallery) => {
      const category = gallery.dataset.category || null;
      const photos = category
        ? data.photos.filter((p) => p.category === category)
        : data.photos;

      gallery.innerHTML = photos.map(renderCard).join("\n");
      document.dispatchEvent(new CustomEvent("gallery:ready", { detail: { el: gallery } }));
    });
  };

  render();
  document.addEventListener("languagechange", render);
});
