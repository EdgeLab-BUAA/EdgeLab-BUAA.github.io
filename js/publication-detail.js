document.addEventListener("DOMContentLoaded", async () => {
  const root = document.querySelector("[data-publication-detail]");
  if (!root) return;

  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getPaperId = () => new URLSearchParams(window.location.search).get("id") || "";

  const initials = (title) =>
    String(title || "")
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((part) => part[0].toUpperCase())
      .join("") || "AI";

  const detailText = (paper) => {
    if (paper.abstract) return paper.abstract;
    if (paper.summary) return paper.summary;
    return `${paper.title} is part of the lab's work on efficient, deployable, and scientific AI. More detailed abstract information will be added soon.`;
  };

  const linkButton = (href, label, tone = "") => {
    if (!href) return "";
    return `<a class="publication-detail-link ${tone}" href="${esc(href)}" target="_blank" rel="noreferrer">${esc(label)}</a>`;
  };

  const renderPreview = (paper, title) => {
    if (paper.cover_image) {
      return `<img src="./${esc(paper.cover_image)}" alt="${esc(title)} cover">`;
    }
    return `<div class="publication-detail-preview-fallback"><span>${esc(initials(title))}</span></div>`;
  };

  let papers = [];
  try {
    const response = await fetch("./data/papers.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    papers = Array.isArray(data.papers) ? data.papers : [];
  } catch {
    const fallback = window.__LAB_PAPERS__;
    papers = Array.isArray(fallback?.papers) ? fallback.papers : [];
  }

  const paper = papers.find((item) => item.id === getPaperId());
  if (!paper) {
    root.innerHTML = `
      <section class="publication-detail-card">
        <a class="publication-detail-back" href="./publications.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Back to publications</a>
        <h1>Publication not found</h1>
        <p class="publication-detail-empty">The requested publication could not be loaded.</p>
      </section>
    `;
    return;
  }

  const title = paper.title || paper.id;
  const authors = paper.authors || "";
  const venue = paper.venue || "";
  const links = [
    linkButton(paper.paper_link, "PDF", "is-blue"),
    linkButton(paper.code_link, "Code"),
    linkButton(paper.book_link, "Book", "is-blue"),
    linkButton(paper.scholar_link, "Bibtex", "is-red")
  ].join("");

  document.title = `${title} | Publication`;

  root.innerHTML = `
    <section class="publication-detail-card">
      <a class="publication-detail-back" href="./publications.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Back to publications</a>
      <div class="publication-detail-tags">
        <span>${esc(paper.group || paper.year || "Publication")}</span>
        <span><i class="fa-regular fa-calendar" aria-hidden="true"></i>${esc(paper.year || "")}</span>
        ${paper.award ? `<span class="is-award">${esc(paper.award)}</span>` : ""}
      </div>
      <h1>${esc(title)}</h1>
      <p class="publication-detail-authors">${esc(authors).replaceAll(",", " ·")}</p>
      ${links ? `<div class="publication-detail-links">${links}</div>` : ""}
      <hr>
      <section class="publication-detail-section">
        <h2><i class="fa-solid fa-file-lines" aria-hidden="true"></i>Abstract</h2>
        <p>${esc(detailText(paper))}</p>
      </section>
      <section class="publication-detail-section">
        <h2><i class="fa-solid fa-location-dot" aria-hidden="true"></i>Venue</h2>
        <p>${esc(venue)}</p>
      </section>
    </section>
    <section class="publication-detail-card publication-detail-media-card">
      <h2><i class="fa-solid fa-image" aria-hidden="true"></i>Preview</h2>
      <div class="publication-detail-preview">
        ${renderPreview(paper, title)}
      </div>
    </section>
  `;
});
