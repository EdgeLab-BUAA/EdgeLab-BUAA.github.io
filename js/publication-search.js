document.addEventListener("DOMContentLoaded", async () => {
  const input = document.querySelector("#paper-search");
  const count = document.querySelector("[data-publication-count]");
  const empty = document.querySelector("[data-publication-empty]");
  const list = document.querySelector("[data-publication-list]");

  if (!input || !count || !empty || !list) return;

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
    const thumbContent = paper.cover_image
      ? `<img src="./${escapeHtml(paper.cover_image)}" alt="${escapeHtml(paper.title)} cover">`
      : `<span>${escapeHtml(initials(paper.title) || "AI")}</span>`;

    const venueLine = paper.scholar_link
      ? `${escapeHtml(paper.venue)}. <a href="${escapeHtml(paper.scholar_link)}" target="_blank" rel="noreferrer">[Scholar]</a>`
      : escapeHtml(paper.venue);

    return `
      <article class="publication-item" data-paper>
        <div class="publication-thumb${paper.cover_image ? " has-image" : ""}">${thumbContent}</div>
        <div class="publication-info">
          <h3>${escapeHtml(paper.title)}</h3>
          <p>${escapeHtml(paper.authors)}</p>
          <p class="publication-venue">${venueLine}</p>
        </div>
      </article>
    `;
  };

  const groupByYear = (papers) => {
    const map = new Map();
    papers.forEach((paper) => {
      if (!map.has(paper.year)) map.set(paper.year, []);
      map.get(paper.year).push(paper);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  };

  let papers = [];

  try {
    const response = await fetch("./publications/data/papers.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    papers = Array.isArray(data.papers) ? data.papers : [];
  } catch (error) {
    count.textContent = "Unable to load papers";
    empty.hidden = false;
    empty.textContent = "Publication data is missing. Run the generator first.";
    return;
  }

  const render = (filteredPapers, query) => {
    const sections = groupByYear(filteredPapers)
      .map(
        ([year, items]) => `
          <section class="publication-year-group" data-year-group="${year}">
            <h2>${year}</h2>
            ${items.map(renderPaper).join("")}
          </section>
        `
      )
      .join("");

    list.innerHTML = sections;
    count.textContent = query
      ? `Showing ${filteredPapers.length} matching papers`
      : `Showing all ${papers.length} papers`;
    empty.hidden = filteredPapers.length !== 0;
  };

  const update = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = papers.filter((paper) => {
      if (!query) return true;
      return [paper.title, paper.authors]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
    render(filtered, query);
  };

  input.addEventListener("input", update);
  update();
});
