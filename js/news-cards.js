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
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parseNewsTags = (raw) =>
    String(raw || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const randomMarkerPalette = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 62 + Math.floor(Math.random() * 14);
    const lightness = 42 + Math.floor(Math.random() * 10);
    return {
      fg: `hsl(${hue} ${saturation}% ${lightness}%)`,
      bg: `hsl(${hue} ${Math.max(24, saturation - 34)}% 96%)`,
      border: `hsl(${hue} ${Math.max(26, saturation - 28)}% 84%)`
    };
  };

  const initials = (title) =>
    String(title || "")
      .split(/[^A-Za-z0-9\u4e00-\u9fa5]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "NW";

  // Detect page depth so root-relative paths resolve correctly from any subfolder
  const scriptEl = document.querySelector('script[src*="news-cards.js"]');
  const scriptSrc = scriptEl ? scriptEl.getAttribute('src') : './js/news-cards.js';
  const depth = (scriptSrc.match(/\.\.\//g) || []).length;
  const rootPrefix = depth > 0 ? '../'.repeat(depth) : './';

  const items = Array.isArray(window.__LAB_NEWS__?.items) ? window.__LAB_NEWS__.items : [];
  if (!items.length) {
    sections.forEach((section) => {
      section.innerHTML = `<p class="news-cards-empty">${esc(t("dynamic.news.error"))}</p>`;
    });
    return;
  }

  const buildHref = (rawHref) => {
    const fallback = "./news/news.html";
    const value = rawHref || fallback;
    const external = /^https?:\/\//i.test(value);
    return {
      external,
      href: external ? value : value.replace(/^\.\//, rootPrefix)
    };
  };

  const formatTimelineDate = (rawDate, lang) => {
    const value = String(rawDate || "").trim();
    if (!value) return "";
    if (/^\d{4}$/.test(value)) return lang === "zh" ? `${value}年` : value;

    const match = value.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
    if (!match) return value;

    const [, year, month, day] = match;
    const monthIndex = Number(month) - 1;
    if (monthIndex < 0 || monthIndex > 11) return value;
    if (!day) return lang === "zh" ? `${year}年${Number(month)}月` : `${monthNames[monthIndex]} ${year}`;
    return lang === "zh"
      ? `${year}年${Number(month)}月${Number(day)}日`
      : `${monthNames[monthIndex]} ${Number(day)}, ${year}`;
  };

  const getTypeMeta = (rawType, lang) => {
    const normalized = String(rawType || "news").trim().toLowerCase();
    const labelMap = {
      publication: { en: "Publication", zh: "论文" },
      paper: { en: "Publication", zh: "论文" },
      activity: { en: "Activity", zh: "活动" },
      award: { en: "Award", zh: "奖项" },
      grant: { en: "Grant", zh: "项目资助" },
      education: { en: "Education", zh: "教育" },
      service: { en: "Service", zh: "服务" },
      talk: { en: "Talk", zh: "报告" },
      workshop: { en: "Workshop", zh: "学术活动" },
      media: { en: "Media", zh: "媒体" },
      news: { en: "News", zh: "动态" }
    };
    const typeMap = {
      publication: { icon: "fa-book-open", badgeClass: "publication" },
      paper: { icon: "fa-book-open", badgeClass: "publication" },
      activity: { icon: "fa-umbrella-beach", badgeClass: "activity" },
      award: { icon: "fa-award", badgeClass: "award" },
      grant: { icon: "fa-hand-holding-dollar", badgeClass: "grant" },
      education: { icon: "fa-graduation-cap", badgeClass: "education" },
      service: { icon: "fa-handshake-angle", badgeClass: "service" },
      talk: { icon: "fa-person-chalkboard", badgeClass: "talk" },
      workshop: { icon: "fa-calendar-days", badgeClass: "workshop" },
      media: { icon: "fa-newspaper", badgeClass: "media" },
      news: { icon: "fa-star", badgeClass: "news" }
    };
    const fallback = typeMap.news;
    const fallbackLabel = labelMap[normalized] || labelMap.news;
    return {
      label: rawType || fallbackLabel[lang] || fallbackLabel.en,
      ...(typeMap[normalized] || fallback)
    };
  };

  const renderCard = (item) => {
    const lang = getLang();
    const title = lang === "zh"
      ? item.title_zh || item.title_en || item.title || item.id
      : item.title_en || item.title || item.title_zh || item.id;
    const excerpt = lang === "zh"
      ? item.excerpt_zh || item.excerpt || ""
      : item.excerpt_en || item.excerpt || "";
    const tags = parseNewsTags(lang === "zh" ? item.type_zh || item.type || "" : item.type_en || item.type || "");
    const meta = item.date ? formatTimelineDate(item.date, lang) : "";
    const media = item.image
      ? `<div class="news-card__media"><img src="${rootPrefix}${esc(item.image)}" alt="${esc(title)}"></div>`
      : `<div class="news-card__media news-card__media--fallback" aria-hidden="true"><span>${esc(initials(title))}</span></div>`;
    const { external, href } = buildHref(item.link);

    return `
      <article class="news-card">
        ${media}
        <div class="news-card__body">
          ${meta ? `<p class="news-card__meta">${esc(meta)}</p>` : ""}
          <h3 class="news-card__title">${esc(title)}</h3>
          ${excerpt ? `<p class="news-card__excerpt">${esc(excerpt)}</p>` : ""}
          ${tags.length ? `<div class="news-timeline-item__meta">
            ${tags.map((tag) => {
              const { badgeClass, label } = getTypeMeta(tag, lang);
              return `<span class="news-timeline-item__badge news-timeline-item__badge--${esc(badgeClass)}">${esc(label)}</span>`;
            }).join("")}
          </div>` : ""}
          <div class="news-card__footer">
            <a class="news-card__link" href="${esc(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${esc(t("dynamic.news.readMore"))} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>
    `;
  };

  const renderTimelineItem = (item) => {
    const lang = getLang();
    const title = lang === "zh"
      ? item.title_zh || item.title_en || item.title || item.id
      : item.title_en || item.title || item.title_zh || item.id;
    const excerpt = lang === "zh"
      ? item.excerpt_zh || item.excerpt || ""
      : item.excerpt_en || item.excerpt || "";
    const tags = parseNewsTags(lang === "zh" ? item.type_zh || item.type || "" : item.type_en || item.type || "");
    const { icon } = getTypeMeta(tags[0] || "news", lang);
    const dateText = formatTimelineDate(item.date, lang);
    const { external, href } = buildHref(item.link);
    const markerColors = randomMarkerPalette();
    const imageHtml = item.image
      ? `
        <div class="news-timeline-item__media">
          <img src="${rootPrefix}${esc(item.image)}" alt="${esc(title)}">
        </div>
      `
      : "";
    const titleHtml = href
      ? `<h3 class="news-timeline-item__title"><a href="${esc(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${esc(title)}</a></h3>`
      : `<h3 class="news-timeline-item__title">${esc(title)}</h3>`;

    return `
      <article class="news-timeline-item">
        <div class="news-timeline-item__rail" aria-hidden="true">
          <span class="news-timeline-item__marker" style="color:${esc(markerColors.fg)};background:${esc(markerColors.bg)};border-color:${esc(markerColors.border)};"><i class="fa-solid ${esc(icon)}"></i></span>
        </div>
        <div class="news-timeline-item__content">
          <div class="news-timeline-item__copy">
            ${titleHtml}
            ${excerpt ? `<p class="news-timeline-item__excerpt">${esc(excerpt)}</p>` : ""}
            ${imageHtml}
            ${tags.length ? `<div class="news-timeline-item__meta">
              ${tags.map((tag) => {
                const { badgeClass, label } = getTypeMeta(tag, lang);
                return `<span class="news-timeline-item__badge news-timeline-item__badge--${esc(badgeClass)}">${esc(label)}</span>`;
              }).join("")}
            </div>` : ""}
          </div>
          ${dateText ? `<div class="news-timeline-item__date">${esc(dateText)}</div>` : ""}
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

  const bindLoadMore = (section, limit, step) => {
    const button = section.querySelector("[data-news-load-more]");
    if (!button) return;
    button.addEventListener("click", () => {
      const current = Number(section.dataset.newsVisibleCount || limit || items.length);
      section.dataset.newsVisibleCount = String(Math.min(items.length, current + step));
      render();
    });
  };

  const render = () => {
    sections.forEach((section) => {
      const variant = section.dataset.newsVariant || "cards";
      const limit = Number(section.dataset.newsLimit || 0);
      const step = Number(section.dataset.newsStep || 3) || 3;
      const visibleCount = limit > 0
        ? Math.min(
            items.length,
            Number(section.dataset.newsVisibleCount || limit)
          )
        : items.length;
      const subset = limit > 0 ? items.slice(0, visibleCount) : items;
      const showLoadMore = limit > 0 && items.length > limit && visibleCount < items.length;
      const renderItem = variant === "timeline" ? renderTimelineItem : renderCard;

      section.innerHTML = subset.length
        ? `
          ${subset.map(renderItem).join("\n")}
          ${showLoadMore ? `
            <div class="news-load-more-shell">
              <button class="news-load-more" type="button" data-news-load-more>${esc(t("dynamic.news.loadMore"))}</button>
            </div>
          ` : ""}
        `
        : `<p class="news-cards-empty">${esc(t("dynamic.news.empty"))}</p>`;
      if (variant !== "timeline") bindHoverEffects(section);
      bindLoadMore(section, limit, step);
    });
  };

  render();
  document.addEventListener("languagechange", render);
});
