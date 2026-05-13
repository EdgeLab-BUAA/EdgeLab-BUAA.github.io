document.addEventListener("DOMContentLoaded", async () => {
  const input = document.querySelector("#paper-search");
  const count = document.querySelector("[data-publication-count]");
  const empty = document.querySelector("[data-publication-empty]");
  const list = document.querySelector("[data-publication-list]");
  const i18n = window.labI18n;

  if (!input || !count || !empty || !list) return;

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key, vars) => i18n?.t?.(key, vars) || key;

  const initials = (title) =>
    title
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((part) => part[0].toUpperCase())
      .join("");

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const renderPaper = (paper) => {
    const lang = getLang();
    const title = lang === "zh" ? paper.title_zh || paper.title : paper.title;
    const authors = lang === "zh" ? paper.authors_zh || paper.authors : paper.authors;
    const venue = lang === "zh" ? paper.venue_zh || paper.venue : paper.venue;
    const award = lang === "zh" ? paper.award_zh || paper.award : paper.award;
    const thumbContent = paper.cover_image
      ? `<img src="./${escapeHtml(paper.cover_image)}" alt="${escapeHtml(title)} cover">`
      : `<span>${escapeHtml(initials(title) || "AI")}</span>`;

    const links = [
      paper.paper_link ? `<a class="publication-action" href="${escapeHtml(paper.paper_link)}" target="_blank" rel="noreferrer">${escapeHtml(t("dynamic.publications.link.paper"))}</a>` : "",
      paper.code_link ? `<a class="publication-action" href="${escapeHtml(paper.code_link)}" target="_blank" rel="noreferrer">${escapeHtml(t("dynamic.publications.link.code"))}</a>` : "",
      paper.book_link ? `<a class="publication-action" href="${escapeHtml(paper.book_link)}" target="_blank" rel="noreferrer">${escapeHtml(t("dynamic.publications.link.books"))}</a>` : "",
      paper.scholar_link ? `<a class="publication-action" href="${escapeHtml(paper.scholar_link)}" target="_blank" rel="noreferrer">${escapeHtml(t("dynamic.publications.link.scholar"))}</a>` : ""
    ]
      .filter(Boolean)
      .join(" ");

    const venueLine = `${escapeHtml(venue)}${award ? ` <span class="publication-award">(${escapeHtml(award)})</span>` : ""}`;

    return `
      <article class="publication-item" data-paper>
        <div class="publication-thumb${paper.cover_image ? " has-image" : ""}">${thumbContent}</div>
        <div class="publication-info">
          <h3>${escapeHtml(title)}</h3>
          <p class="publication-authors">${escapeHtml(authors)}</p>
          <p class="publication-venue">${venueLine}</p>
          ${links ? `<div class="publication-actions">${links}</div>` : ""}
        </div>
      </article>
    `;
  };

  const groupOrder = (group) => {
    if (group === "Books") return 100000;
    if (/^\d{4}$/.test(group)) return Number(group);
    if (/^\d{4}-\d{4}$/.test(group)) return Number(group.slice(0, 4)) - 0.5;
    return -1;
  };

  const groupByYear = (papers) => {
    const map = new Map();
    papers.forEach((paper) => {
      const key = paper.group || String(paper.year || "");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(paper);
    });
    return Array.from(map.entries()).sort((a, b) => groupOrder(b[0]) - groupOrder(a[0]));
  };

  let papers = [];

  try {
    const response = await fetch("./publications/data/papers.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    papers = Array.isArray(data.papers) ? data.papers : [];
  } catch (error) {
    const fallback = window.__LAB_PAPERS__;
    papers = Array.isArray(fallback?.papers) ? fallback.papers : [];
    if (!papers.length) {
      count.textContent = t("dynamic.publications.errorTitle");
      empty.hidden = false;
      empty.textContent = t("dynamic.publications.errorBody");
      return;
    }
  }

  const render = (filteredPapers, query) => {
    const sections = groupByYear(filteredPapers)
      .map(
        ([year, items]) => `
          <section class="publication-year-group" data-year-group="${escapeHtml(year)}">
            <h2>${escapeHtml(year)}</h2>
            ${items.map(renderPaper).join("")}
          </section>
        `
      )
      .join("");

    list.innerHTML = sections;
    count.textContent = query
      ? t("dynamic.publications.countMatching", { count: filteredPapers.length })
      : t("dynamic.publications.countAll", { count: papers.length });
    empty.hidden = filteredPapers.length !== 0;
    empty.textContent = t("dynamic.publications.empty");
  };

  const update = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = papers.filter((paper) => {
      if (!query) return true;
      return [paper.title, paper.title_zh, paper.authors, paper.authors_zh, paper.venue, paper.venue_zh, paper.group, paper.year]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
    render(filtered, query);
  };

  input.addEventListener("input", update);
  document.addEventListener("languagechange", update);
  update();
});
