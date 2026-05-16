const initPublicationDetail = async () => {
  const root = document.querySelector("[data-publication-detail]");
  if (!root) return;

  const i18n = window.labI18n;

  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getPaperId = () => new URLSearchParams(window.location.search).get("id") || "";
  const getLang = () => i18n?.getLanguage?.() || "en";
  const parseTags = (raw) =>
    String(raw || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const unique = (values) => Array.from(new Set(values.filter(Boolean)));

  const detailText = (paper, lang) => {
    if (lang === "zh" && paper.abstract_zh) return paper.abstract_zh;
    if (paper.abstract) return paper.abstract;
    if (lang === "zh" && paper.summary_zh) return paper.summary_zh;
    if (paper.summary) return paper.summary;
    return lang === "zh"
      ? `${paper.title || paper.id} 是课题组在高效、可部署与科学智能方向上的一项研究成果。更详细的介绍将稍后补充。`
      : `${paper.title || paper.id} is part of the lab's work on efficient, deployable, and scientific AI. More detailed abstract information will be added soon.`;
  };

  const linkButton = (href, label, icon) => {
    if (!href) return "";
    return `<a class="publication-detail-link" href="${esc(href)}" target="_blank" rel="noreferrer"><i class="fa-solid ${icon}" aria-hidden="true"></i><span>${esc(label)}</span></a>`;
  };

  const normalizeLocalPath = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("./") || raw.startsWith("../")) return raw;
    if (raw.startsWith("publications/")) return `./${raw.slice("publications/".length)}`;
    return `./${raw.replace(/^\//, "")}`;
  };

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

  const renderInlineMarkdown = (source) =>
    esc(source)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
        `<img src="${esc(normalizeLocalPath(src))}" alt="${esc(alt)}">`
      )
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
        `<a href="${esc(normalizeLocalPath(href))}" target="_blank" rel="noreferrer">${esc(label)}</a>`
      )
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

  const renderMarkdown = (source) => {
    const lines = String(source || "").replace(/\r/g, "").split("\n");
    const html = [];
    let paragraph = [];
    let listItems = [];
    let tableRows = [];
    let codeBlock = [];
    let codeLang = "";
    let inCodeBlock = false;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      html.push(`<p>${renderInlineMarkdown(paragraph.join("<br>"))}</p>`);
      paragraph = [];
    };

    const flushList = () => {
      if (!listItems.length) return;
      html.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    };

    const flushTable = () => {
      if (!tableRows.length) return;
      const [header, ...body] = tableRows;
      html.push(`
        <div class="publication-detail-markdown-table">
          <table>
            <thead><tr>${header.map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`).join("")}</tr></thead>
            <tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      `);
      tableRows = [];
    };

    const flushCode = () => {
      html.push(`<pre><code${codeLang ? ` class="language-${esc(codeLang)}"` : ""}>${esc(codeBlock.join("\n"))}</code></pre>`);
      codeBlock = [];
      codeLang = "";
    };

    lines.forEach((line) => {
      if (line.startsWith("```")) {
        flushParagraph();
        flushList();
        flushTable();
        if (inCodeBlock) {
          flushCode();
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        return;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph();
        flushList();
        flushTable();
        return;
      }

      if (/^\|.*\|$/.test(trimmed)) {
        flushParagraph();
        flushList();
        const cells = trimmed
          .slice(1, -1)
          .split("|")
          .map((cell) => cell.trim());
        if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) return;
        tableRows.push(cells);
        return;
      }

      flushTable();

      const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        flushParagraph();
        flushList();
        html.push(`<h${heading[1].length}>${renderInlineMarkdown(heading[2])}</h${heading[1].length}>`);
        return;
      }

      const listItem = trimmed.match(/^[-*]\s+(.*)$/);
      if (listItem) {
        flushParagraph();
        listItems.push(listItem[1]);
        return;
      }

      if (trimmed === "---") {
        flushParagraph();
        flushList();
        html.push("<hr>");
        return;
      }

      paragraph.push(trimmed);
    });

    flushParagraph();
    flushList();
    flushTable();
    if (inCodeBlock) flushCode();
    return html.join("\n");
  };

  const fetchMarkdown = async (paper) => {
    const lang = getLang();
    const rawPath = lang === "zh" ? paper.intro_md_cn || paper.intro_md_en : paper.intro_md_en || paper.intro_md_cn;
    if (!rawPath) return "";
    const candidates = unique([
      normalizeLocalPath(rawPath),
      rawPath.startsWith("publications/") ? `../${rawPath}` : "",
      rawPath.startsWith("./") ? rawPath.replace(/^\.\//, "../") : "",
      rawPath
    ].filter(Boolean));

    const manifest = window.__LAB_MARKDOWN__ || {};
    for (const candidate of candidates) {
      if (manifest[candidate]) return manifest[candidate];
      if (candidate.startsWith("./") && manifest[candidate.slice(2)]) return manifest[candidate.slice(2)];
      if (candidate.startsWith("../publications/") && manifest[candidate.slice(3)]) return manifest[candidate.slice(3)];
      if (candidate.startsWith("publications/") && manifest[candidate.replace(/^publications\//, "")]) {
        return manifest[candidate.replace(/^publications\//, "")];
      }
    }

    for (const mdPath of candidates) {
      try {
        const response = await fetch(mdPath, { cache: "no-store" });
        if (response.ok) return await response.text();
      } catch {
        // Fall through to XHR below.
      }

      const content = await new Promise((resolve) => {
        try {
          const request = new XMLHttpRequest();
          request.open("GET", mdPath, true);
          request.onreadystatechange = () => {
            if (request.readyState !== 4) return;
            if ((request.status >= 200 && request.status < 300) || request.status === 0) {
              resolve(request.responseText || "");
              return;
            }
            resolve("");
          };
          request.onerror = () => resolve("");
          request.send();
        } catch {
          resolve("");
        }
      });
      if (content) return content;
    }

    return "";
  };

  const fetchMarkdownViaIframe = (paper) => {
    const lang = getLang();
    const mdPath = normalizeLocalPath(lang === "zh" ? paper.intro_md_cn || paper.intro_md_en : paper.intro_md_en || paper.intro_md_cn);
    if (!mdPath) return Promise.resolve("");
    return new Promise((resolve) => {
      try {
        const frame = document.createElement("iframe");
        frame.style.display = "none";
        frame.src = mdPath;
        frame.onload = () => {
          const doc = frame.contentDocument || frame.contentWindow?.document;
          const text = doc?.body?.innerText || doc?.documentElement?.innerText || "";
          frame.remove();
          resolve(text.trim());
        };
        frame.onerror = () => {
          frame.remove();
          resolve("");
        };
        document.body.appendChild(frame);
      } catch {
        resolve("");
      }
    });
  };

  let papers = Array.isArray(window.__LAB_PAPERS__?.papers) ? window.__LAB_PAPERS__.papers : [];
  if (!papers.length) {
    try {
      const response = await fetch("./data/papers.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      papers = Array.isArray(data.papers) ? data.papers : [];
    } catch {
      papers = [];
    }
  }

  const render = async () => {
    const lang = getLang();
    const paper = papers.find((item) => item.id === getPaperId());
    if (!paper) {
      root.innerHTML = `
        <section class="publication-detail-card">
          <a class="publication-detail-back" href="./publications.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>${lang === "zh" ? "返回论文列表" : "Back to publications"}</a>
          <h1>${lang === "zh" ? "未找到论文" : "Publication not found"}</h1>
          <p class="publication-detail-empty">${lang === "zh" ? "请求的论文内容无法加载。" : "The requested publication could not be loaded."}</p>
        </section>
      `;
      return;
    }

    const title = lang === "zh" ? paper.title_zh || paper.title || paper.id : paper.title || paper.title_zh || paper.id;
    const authors = lang === "zh" ? paper.authors_zh || paper.authors || "" : paper.authors || paper.authors_zh || "";
    const venue = lang === "zh" ? paper.venue_zh || paper.venue || "" : paper.venue || paper.venue_zh || "";
    const award = lang === "zh" ? paper.award_zh || paper.award || "" : paper.award || paper.award_zh || "";
    const tags = resolveTags(paper);
    const links = [
      linkButton(paper.paper_link, "Paper", "fa-arrow-up-right-from-square"),
      linkButton(paper.code_link, "Code", "fa-code-branch"),
      linkButton(paper.book_link, "Book", "fa-book-open"),  
      linkButton(paper.scholar_link, "Dataset", "fa-database")
    ].join("");

    document.title = `${title} | Publication`;

    root.innerHTML = `
      <section class="publication-detail-card">
        <a class="publication-detail-back" href="./publications.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>${lang === "zh" ? "返回论文列表" : "Back to publications"}</a>
        <div class="publication-detail-tags">
          ${tags.map((tag) => `<span class="news-timeline-item__badge news-timeline-item__badge--publication">${esc(tag)}</span>`).join("")}
          ${award ? `<span class="news-timeline-item__badge news-timeline-item__badge--award">${esc(award)}</span>` : ""}
        </div>
        <h1>${esc(title)}</h1>
        <p class="publication-detail-authors">${esc(authors).replaceAll(",", " ·")}</p>
        ${links ? `<div class="publication-detail-links">${links}</div>` : ""}
        <hr>
        <section class="publication-detail-section">
          <h2><i class="fa-solid fa-file-lines" aria-hidden="true"></i>${lang === "zh" ? "摘要" : "Abstract"}</h2>
          <p>${esc(detailText(paper, lang))}</p>
        </section>
        <section class="publication-detail-section">
          <h2><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${lang === "zh" ? "发表信息" : "Venue"}</h2>
          <p>${esc(venue)}</p>
        </section>
      </section>
    `;

    let markdown = await fetchMarkdown(paper);
    if (!markdown && window.location.protocol === "file:") {
      markdown = await fetchMarkdownViaIframe(paper);
    }

    if (markdown) {
      root.insertAdjacentHTML(
        "beforeend",
        `
          <section class="publication-detail-card publication-detail-media-card">
            <h2><i class="fa-solid fa-scroll" aria-hidden="true"></i>${lang === "zh" ? "论文介绍" : "Introduction"}</h2>
            <div class="publication-detail-markdown">
              ${renderMarkdown(markdown)}
            </div>
          </section>
        `
      );
    }
  };

  try {
    await render();
  } catch (error) {
    console.error("Failed to render publication detail:", error);
    const lang = getLang();
    root.innerHTML = `
      <section class="publication-detail-card">
        <a class="publication-detail-back" href="./publications.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>${lang === "zh" ? "返回论文列表" : "Back to publications"}</a>
        <h1>${lang === "zh" ? "加载失败" : "Unable to load publication"}</h1>
        <p class="publication-detail-empty">${lang === "zh" ? "页面加载时出现错误，请稍后重试。" : "An error occurred while loading this publication."}</p>
      </section>
    `;
  }

  document.addEventListener("languagechange", render);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPublicationDetail, { once: true });
} else {
  initPublicationDetail();
}
