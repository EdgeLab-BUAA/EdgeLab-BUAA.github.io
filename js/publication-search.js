document.addEventListener("DOMContentLoaded", async () => {
  const input = document.querySelector("#paper-search");
  const count = document.querySelector("[data-publication-count]");
  const empty = document.querySelector("[data-publication-empty]");
  const list = document.querySelector("[data-publication-list]");
  const filterBar = document.querySelector("[data-publication-filter-bar]");
  const i18n = window.labI18n;

  if (!input || !count || !empty || !list || !filterBar) return;

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key, vars) => i18n?.t?.(key, vars) || key;
  const parseTags = (raw) =>
    String(raw || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const unique = (values) => Array.from(new Set(values.filter(Boolean)));

  let activeTags = [];
  let visibleTagLines = 1;
  let visibleTagCap = 8;

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

  const inferTags = (paper) => {
    const source = [paper.title, paper.title_zh, paper.venue, paper.venue_zh]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const tags = [];
    const rules = [
      { test: /(benchmark|bench|评测|基准)/, tags: ["Benchmark"] },
      { test: /(quantization|quant|量化)/, tags: ["Quantization"] },
      { test: /(compression|compressing|compressed|压缩)/, tags: ["Compression"] },
      { test: /(distillation|distilling|distill|蒸馏)/, tags: ["Distillation"] },
      { test: /(sparsity|sparsification|pruning|稀疏|剪枝)/, tags: ["Sparsity", "Pruning"] },
      { test: /(diffusion|扩散)/, tags: ["Diffusion"] },
      { test: /(large language model|llm|language model|大语言模型)/, tags: ["LLM"] },
      { test: /(medical|biomedical|医学|医疗)/, tags: ["Medical"] },
      { test: /(video|视频)/, tags: ["Video"] },
      { test: /(3d|indoor|point cloud|object detection|三维|点云)/, tags: ["3D Vision"] },
      { test: /(object detection|检测)/, tags: ["Detection"] },
      { test: /(segmentation|segment anything|分割)/, tags: ["Segmentation"] },
      { test: /(reasoning|推理)/, tags: ["Reasoning"] },
      { test: /(multimodal|多模态)/, tags: ["Multimodal"] },
      { test: /(graph|molecular|biology|biomedical literature|分子|图)/, tags: ["Molecular", "Graph Learning"] },
      { test: /(embedding|text embedding|嵌入)/, tags: ["Text Embedding"] },
      { test: /(rag|retrieval)/, tags: ["RAG"] },
      { test: /(deployment|deployable|部署)/, tags: ["Deployment"] },
      { test: /(safety|hazardous|安全)/, tags: ["Safety"] },
      { test: /(agent|agents|智能体)/, tags: ["Agent"] },
      { test: /(survey|综述)/, tags: ["Survey"] },
      { test: /(book|springer|专著)/, tags: ["Book"] }
    ];

    rules.forEach(({ test, tags: matchedTags }) => {
      if (test.test(source)) tags.push(...matchedTags);
    });

    if (/small language model|slm/.test(source)) tags.push("SLM");
    if (/diffusion model/.test(source)) tags.push("Diffusion Model");
    if (/knowledge/.test(source) && /distill/.test(source)) tags.push("Knowledge Distillation");
    if (/post-training|post training|训练后/.test(source)) tags.push("Post-Training");
    if (/efficient|efficiency|高效/.test(source)) tags.push("Efficient AI");
    if (/foundation model/.test(source)) tags.push("Foundation Model");

    if (!tags.length) tags.push("Efficient AI");
    return unique(tags).slice(0, 6);
  };

  const inferVenueTag = (paper) => {
    const source = [paper.venue, paper.venue_zh].filter(Boolean).join(" ");
    if (!source) return "";

    const venueRules = [
      { test: /AAAI/i, tag: "AAAI" },
      { test: /ICML/i, tag: "ICML" },
      { test: /ICLR/i, tag: "ICLR" },
      { test: /NeurIPS/i, tag: "NeurIPS" },
      { test: /TPAMI/i, tag: "TPAMI" },
      { test: /ACM\s*MM|ACM MULTIMEDIA/i, tag: "ACM MM" },
      { test: /CVPR/i, tag: "CVPR" },
      { test: /ECCV/i, tag: "ECCV" },
      { test: /ICCV/i, tag: "ICCV" },
      { test: /EMNLP/i, tag: "EMNLP" },
      { test: /ACL/i, tag: "ACL" },
      { test: /Workshop/i, tag: "Workshop" },
      { test: /Tech Report/i, tag: "Tech Report" }
    ];

    const match = venueRules.find(({ test }) => test.test(source));
    if (!match) return "";
    const year = paper.year ? ` ${paper.year}` : "";
    return `${match.tag}${year}`;
  };

  const resolveTags = (paper) => {
    const lang = getLang();
    const explicit = parseTags(lang === "zh" ? paper.tags_zh || paper.tags : paper.tags);
    const venueTag = inferVenueTag(paper);
    return unique([venueTag, ...(explicit.length ? explicit : inferTags(paper))].filter(Boolean));
  };

  const actionLink = (href, label, icon) => {
    if (!href) return "";
    return `<a class="publication-action" href="${escapeHtml(href)}" target="_blank" rel="noreferrer"><i class="fa-solid ${icon}" aria-hidden="true"></i><span>${escapeHtml(label)}</span></a>`;
  };

  const groupOrder = (group) => {
    if (/^\d{4}$/.test(group)) return Number(group);
    if (/^\d{4}-\d{4}$/.test(group)) return Number(group.slice(0, 4)) - 0.5;
    return -1;
  };

  const groupByYear = (papers) => {
    const map = new Map();
    papers.forEach((paper) => {
      const key = paper.year ? String(paper.year) : paper.group || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(paper);
    });
    return Array.from(map.entries()).sort((a, b) => groupOrder(b[0]) - groupOrder(a[0]));
  };

  const getTagStats = (papers) => {
    const counts = new Map();
    papers.forEach((paper) => {
      resolveTags(paper).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  };

  const renderPaper = (paper) => {
    const lang = getLang();
    const title = lang === "zh" ? paper.title_zh || paper.title : paper.title;
    const authors = lang === "zh" ? paper.authors_zh || paper.authors : paper.authors;
    const venue = lang === "zh" ? paper.venue_zh || paper.venue : paper.venue;
    const award = lang === "zh" ? paper.award_zh || paper.award : paper.award;
    const tags = resolveTags(paper);
    const thumbContent = paper.cover_image
      ? `<img src="./${escapeHtml(paper.cover_image)}" alt="${escapeHtml(title)} cover">`
      : `<span>${escapeHtml(initials(title) || "AI")}</span>`;
    const detailHref = `./publication-detail.html?id=${encodeURIComponent(paper.id)}`;

    const links = [
      `<a class="publication-action" href="${escapeHtml(detailHref)}"><i class="fa-solid fa-link" aria-hidden="true"></i><span>Details</span></a>`,
      actionLink(paper.paper_link, t("dynamic.publications.link.paper"), "fa-arrow-up-right-from-square"),
      actionLink(paper.code_link, t("dynamic.publications.link.code"), "fa-code-branch"),
      actionLink(paper.book_link, t("dynamic.publications.link.books"), "fa-book-open"),
      actionLink(paper.scholar_link, t("dynamic.publications.link.scholar"), "fa-database")
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <article class="publication-item" data-paper data-paper-link="${escapeHtml(detailHref)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(title)}">
        <div class="publication-thumb${paper.cover_image ? " has-image" : ""}">${thumbContent}</div>
        <div class="publication-info">
          <h3>${escapeHtml(title)}</h3>
          <p class="publication-authors">${escapeHtml(authors)}</p>
          <p class="publication-venue">${escapeHtml(venue)}</p>
          ${(tags.length || award) ? `<div class="publication-meta-badges">
            ${tags.map((tag) => `<span class="news-timeline-item__badge news-timeline-item__badge--publication">${escapeHtml(tag)}</span>`).join("")}
            ${award ? `<span class="news-timeline-item__badge news-timeline-item__badge--award">${escapeHtml(award)}</span>` : ""}
          </div>` : ""}
          ${links ? `<div class="publication-actions">${links}</div>` : ""}
        </div>
      </article>
    `;
  };

  let papers = [];

  try {
    const response = await fetch("./data/papers.json");
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

  const applyFilterLineClamp = () => {
    const chips = Array.from(filterBar.querySelectorAll("[data-publication-tag]")).slice(1);
    if (!chips.length) return;

    chips.forEach((chip) => {
      chip.hidden = false;
    });

    const lineTops = [];
    chips.forEach((chip) => {
      const top = chip.offsetTop;
      if (!lineTops.includes(top)) lineTops.push(top);
    });

    const allowedTops = new Set(lineTops.slice(0, visibleTagLines));
    const allowedChips = chips.filter((chip) => allowedTops.has(chip.offsetTop)).slice(0, visibleTagCap);
    const trimCount = visibleTagLines === 1 ? Math.min(1, Math.max(0, allowedChips.length - 7)) : 0;
    const trimmedChips = trimCount > 0 ? new Set(allowedChips.slice(-trimCount)) : new Set();
    chips.forEach((chip) => {
      if (activeTags.includes(chip.dataset.publicationTag || "")) {
        chip.hidden = false;
        return;
      }
      chip.hidden = !allowedTops.has(chip.offsetTop) || !allowedChips.includes(chip) || trimmedChips.has(chip);
    });

    const moreButton = filterBar.querySelector("[data-publication-tag-more]");
    if (moreButton) {
      moreButton.hidden = chips.every((chip) => !chip.hidden);
    }
  };

  const renderFilterBar = () => {
    const stats = getTagStats(papers);
    filterBar.innerHTML = `
      <div class="publication-filter-tags">
        <button class="publication-filter-chip${!activeTags.length ? " is-active" : ""}" type="button" data-publication-tag="">
          <span>All</span>
          <strong>${papers.length}</strong>
        </button>
        ${stats.map(([tag, tagCount]) => `
          <button class="publication-filter-chip${activeTags.includes(tag) ? " is-active" : ""}" type="button" data-publication-tag="${escapeHtml(tag)}">
            <span>${escapeHtml(tag)}</span>
            <strong>${tagCount}</strong>
          </button>
        `).join("")}
      </div>
      ${stats.length ? `<button class="publication-filter-more" type="button" data-publication-tag-more>Load More</button>` : ""}
    `;
    applyFilterLineClamp();
  };

  const render = (filteredPapers, query) => {
    if (activeTags.length) {
      list.innerHTML = `
        <section class="publication-year-group publication-year-group--flat">
          <div class="publication-year-grid">
            ${filteredPapers.map(renderPaper).join("")}
          </div>
        </section>
      `;
      count.textContent = query || activeTags.length
        ? t("dynamic.publications.countMatching", { count: filteredPapers.length })
        : t("dynamic.publications.countAll", { count: papers.length });
      empty.hidden = filteredPapers.length !== 0;
      empty.textContent = t("dynamic.publications.empty");
      return;
    }

    const sections = groupByYear(filteredPapers)
      .map(
        ([year, items]) => `
          <section class="publication-year-group" data-year-group="${escapeHtml(year)}">
            <h2>${escapeHtml(year)}</h2>
            <div class="publication-year-grid">
              ${items.map(renderPaper).join("")}
            </div>
          </section>
        `
      )
      .join("");

    list.innerHTML = sections;
    count.textContent = query || activeTags.length
      ? t("dynamic.publications.countMatching", { count: filteredPapers.length })
      : t("dynamic.publications.countAll", { count: papers.length });
    empty.hidden = filteredPapers.length !== 0;
    empty.textContent = t("dynamic.publications.empty");
  };

  const update = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = papers.filter((paper) => {
      const paperTags = resolveTags(paper);
      const matchesTag = !activeTags.length || activeTags.some((tag) => paperTags.includes(tag));
      if (!matchesTag) return false;
      if (!query) return true;
      return [paper.title, paper.title_zh, paper.authors, paper.authors_zh, paper.venue, paper.venue_zh, paper.group, paper.year, paperTags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
    renderFilterBar();
    render(filtered, query);
  };

  input.addEventListener("input", update);
  document.addEventListener("languagechange", () => {
    visibleTagLines = 1;
    visibleTagCap = 8;
    activeTags = [];
    update();
  });
  filterBar.addEventListener("click", (event) => {
    const moreButton = event.target.closest("[data-publication-tag-more]");
    if (moreButton) {
      visibleTagLines += 1;
      visibleTagCap += 8;
      renderFilterBar();
      return;
    }

    const tagButton = event.target.closest("[data-publication-tag]");
    if (!tagButton) return;
    const tag = tagButton.dataset.publicationTag || "";
    if (!tag) {
      activeTags = [];
      update();
      return;
    }
    activeTags = activeTags.includes(tag)
      ? activeTags.filter((item) => item !== tag)
      : [...activeTags, tag];
    update();
  });
  window.addEventListener("resize", renderFilterBar);
  list.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    const item = event.target.closest("[data-paper-link]");
    if (item?.dataset.paperLink) window.location.href = item.dataset.paperLink;
  });
  list.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest("[data-paper-link]");
    if (!item?.dataset.paperLink) return;
    event.preventDefault();
    window.location.href = item.dataset.paperLink;
  });

  update();
});
