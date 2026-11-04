document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("[data-people-main]");
  if (!main) return;
  const statsHost = document.querySelector("[data-people-stats]");
  const i18n = window.labI18n;

  const esc = (v) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key, vars) => i18n?.t?.(key, vars) || key;
  const pick = (m, field, lang) =>
    lang === "zh" ? m[`${field}_zh`] || m[`${field}_en`] || "" : m[`${field}_en`] || m[`${field}_zh`] || "";

  const ORDER = ["faculty", "phd", "master", "alumni"];
  const SECTION_LABELS = {
    faculty: "dynamic.people.faculty",
    phd: "dynamic.people.phd",
    master: "dynamic.people.master",
    alumni: "dynamic.people.alumni",
  };

  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #5227ff 0%, #c084fc 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #7c3aed 0%, #f472b6 100%)",
    "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    "linear-gradient(135deg, #4338ca 0%, #38bdf8 100%)",
  ];

  const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

  const initials = (m, lang) => {
    const zh = (m.name_zh || "").trim();
    if (lang === "zh" && zh) return zh.length > 2 ? zh.slice(-2) : zh;
    const parts = (m.name_en || zh).trim().split(/\s+/).filter(Boolean);
    return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  };

  const splitList = (text) =>
    String(text || "")
      .split(/\s*[,，、;；]\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

  const getSectionKey = (m) => {
    if (m.team === "faculty" || m.team === "alumni") return m.team;
    const role = `${m.role_en || ""} ${m.role_zh || ""}`.toLowerCase();
    if (/ph\.?\s*d/.test(role) || role.includes("博士")) return "phd";
    return "master";
  };

  const renderPhoto = (m, name, lang) => {
    if (m.photo) {
      return `<div class="member-photo"><img src="./${esc(m.photo)}" alt="${esc(name)}" loading="lazy" decoding="async"></div>`;
    }
    const bg = AVATAR_GRADIENTS[hash(m.id || m.name_en) % AVATAR_GRADIENTS.length];
    return `<div class="member-photo"><div class="member-initials" style="--avatar-bg:${bg}" aria-hidden="true"><span>${esc(initials(m, lang))}</span></div></div>`;
  };

  const renderLinks = (m, { labelled = false } = {}) => {
    const items = [];
    const link = (href, icon, titleKey) => {
      const title = t(titleKey);
      const label = labelled ? `<b>${esc(title)}</b>` : "";
      items.push(
        `<a class="member-link" href="${esc(href)}" target="_blank" rel="noopener" title="${esc(title)}" aria-label="${esc(title)}"><i class="${icon}"></i>${label}</a>`
      );
    };
    if (m.homepage) link(m.homepage, "fa-solid fa-house", "dynamic.people.title.homepage");
    if (m.scholar) link(m.scholar, "fa-solid fa-graduation-cap", "dynamic.people.title.scholar");
    if (m.github) link(m.github, "fa-brands fa-github", "dynamic.people.title.github");
    if (m.dblp) link(m.dblp, "fa-solid fa-book-open", "dynamic.people.title.dblp");
    if (m.email) {
      const title = t("dynamic.people.title.copyEmail");
      const label = labelled ? `<b>${esc(t("dynamic.people.label.email"))}</b>` : "";
      items.push(
        `<button type="button" class="member-link email-btn" data-email="${esc(m.email)}" title="${esc(title)}" aria-label="${esc(title)}"><i class="fa-solid fa-envelope"></i>${label}</button>`
      );
    }
    return items.length ? `<div class="member-links">${items.join("")}</div>` : "";
  };

  const renderTags = (list) =>
    list.length ? `<ul class="member-tags">${list.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : "";

  // Short fact rows (papers, honors, experience, co-supervision) taken from the member record.
  const renderFacts = (m, lang, { separate = false } = {}) => {
    const rows = [];
    const add = (icon, labelKey, items, cls = "") => {
      if (!items.length) return;
      const label = esc(t(labelKey));
      const groups = separate ? items.map((x) => [x]) : [items];
      for (const g of groups) {
        rows.push(
          `<li class="${cls}"><i class="${icon}" title="${label}" aria-hidden="true"></i><span><span class="sr-only">${label}: </span>${g.map(esc).join(" · ")}</span></li>`
        );
      }
    };
    const list = (text) => String(text || "").split(/\s*[;；]\s*/).map((x) => x.trim()).filter(Boolean);
    add("fa-solid fa-file-lines", "dynamic.people.facts.papers", list(m.papers));
    add("fa-solid fa-award", "dynamic.people.facts.honors", list(pick(m, "honors", lang)));
    add("fa-solid fa-people-group", "dynamic.people.facts.service", list(pick(m, "service", lang)));
    add("fa-solid fa-briefcase", "dynamic.people.facts.experience", list(pick(m, "exp", lang)));
    add("fa-solid fa-user-group", "dynamic.people.facts.cosup", list(pick(m, "cosup", lang)), "is-muted");
    return rows.length ? `<ul class="member-facts">${rows.join("")}</ul>` : "";
  };

  const roleLine = (m, lang) => {
    const role = esc(pick(m, "role", lang));
    const cohort = m.year ? ` <span class="member-cohort">${esc(t("dynamic.people.cohort", { year: m.year }))}</span>` : "";
    return `<p class="member-role">${role}${cohort}</p>`;
  };

  const renderNameBlock = (m, lang) => {
    const name = pick(m, "name", lang);
    const other = lang === "zh" ? m.name_en : m.name_zh;
    const secondary = other && other !== name ? `<small>${esc(other)}</small>` : "";
    return { name, html: `<h3 class="member-name"><strong>${esc(name)}</strong>${secondary}</h3>` };
  };

  const cardShell = (cls, inner) => `
      <article class="border-glow-card member-card ${cls}">
        <span class="edge-light"></span>
        <div class="border-glow-inner">${inner}</div>
      </article>`;

  const renderFaculty = (m, lang) => {
    const { name, html } = renderNameBlock(m, lang);
    return cardShell(
      "faculty-card",
      `${renderPhoto(m, name, lang)}
        <div class="member-body">
          ${html}
          <p class="member-role">${esc(pick(m, "role", lang))}</p>
          ${pick(m, "bio", lang) ? `<p class="member-bio">${esc(pick(m, "bio", lang))}</p>` : ""}
          ${renderTags(splitList(pick(m, "research", lang)))}
          ${renderFacts(m, lang, { separate: true })}
          ${renderLinks(m, { labelled: true })}
        </div>`
    );
  };

  const renderStudent = (m, lang) => {
    const { name, html } = renderNameBlock(m, lang);
    return cardShell(
      "student-card",
      `${renderPhoto(m, name, lang)}
        <div class="member-body">
          ${html}
          ${roleLine(m, lang)}
          ${renderTags(splitList(pick(m, "research", lang)).slice(0, 3))}
          ${renderFacts(m, lang)}
          ${renderLinks(m)}
        </div>`
    );
  };

  const NEXT_SPLIT = /\s*·\s*(?:Next\s*:|下一站\s*[:：])\s*/i;

  const renderAlumni = (m, lang) => {
    const { name, html } = renderNameBlock(m, lang);
    const role = pick(m, "role", lang).replace(/^.*?·\s*/, "");
    const [highlights, next] = pick(m, "note", lang).split(NEXT_SPLIT);
    const research = splitList(pick(m, "research", lang));
    const nextLine = next
      ? `<p class="alumni-next"><i class="fa-solid fa-arrow-right"></i><span><em>${esc(t("dynamic.people.next"))}</em> ${esc(next)}</span></p>`
      : "";
    return cardShell(
      "alumni-card",
      `${renderPhoto(m, name, lang)}
        <div class="member-body">
          ${html}
          <p class="member-role">${esc(role)}</p>
          ${research.length ? `<p class="alumni-research">${research.map(esc).join(" · ")}</p>` : ""}
          ${renderTags(splitList(highlights))}
          ${nextLine}
          ${renderFacts({ cosup_en: m.cosup_en, cosup_zh: m.cosup_zh }, lang)}
          ${renderLinks(m)}
        </div>`
    );
  };

  const RENDERERS = { faculty: renderFaculty, phd: renderStudent, master: renderStudent, alumni: renderAlumni };
  const GRID_CLASS = { faculty: "faculty-grid", phd: "student-grid", master: "student-grid", alumni: "alumni-grid" };

  let data = window.__LAB_PEOPLE__;
  if (!data?.members) {
    try {
      const res = await fetch("./data/members.json");
      data = await res.json();
    } catch {
      data = null;
    }
  }
  if (!data?.members) {
    main.innerHTML = `<p class="people-status">${esc(t("dynamic.people.error"))}</p>`;
    return;
  }

  const grouped = new Map(ORDER.map((k) => [k, []]));
  for (const m of data.members) grouped.get(getSectionKey(m)).push(m);
  const sections = ORDER.filter((k) => grouped.get(k).length);

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const canReveal = "IntersectionObserver" in window && !reduceMotion;
  let revealObserver;
  let sectionObserver;

  const setupObservers = () => {
    revealObserver?.disconnect();
    sectionObserver?.disconnect();

    if (canReveal) {
      main.classList.add("people-reveal");
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      main.querySelectorAll(".member-card").forEach((card) => revealObserver.observe(card));
    }

    updateActive();
  };

  // Highlight the group whose heading has most recently scrolled past the sticky bar.
  let activeTicking = false;
  const updateActive = () => {
    activeTicking = false;
    const groups = [...main.querySelectorAll(".people-group")];
    const links = [...main.querySelectorAll(".people-jump a")];
    if (!groups.length || !links.length) return;
    const line = window.innerHeight * 0.3;
    let current = groups[0].id;
    for (const g of groups) if (g.getBoundingClientRect().top <= line) current = g.id;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = groups[groups.length - 1].id;
    let activeLink;
    links.forEach((a) => {
      const on = a.getAttribute("href") === `#${current}`;
      a.classList.toggle("is-active", on);
      if (on) activeLink = a;
    });
    // On narrow screens the bar scrolls sideways; keep the active tab in view.
    const bar = activeLink?.parentElement;
    if (bar && bar.scrollWidth > bar.clientWidth) {
      const left = activeLink.offsetLeft - (bar.clientWidth - activeLink.offsetWidth) / 2;
      bar.scrollLeft = Math.max(0, left);
    }
  };
  window.addEventListener(
    "scroll",
    () => {
      if (activeTicking) return;
      activeTicking = true;
      requestAnimationFrame(updateActive);
    },
    { passive: true }
  );

  const renderAll = () => {
    const lang = getLang();

    if (statsHost) {
      statsHost.innerHTML = sections
        .map((k) => `<span class="people-hero-stat"><strong>${grouped.get(k).length}</strong>${esc(t(SECTION_LABELS[k]))}</span>`)
        .join("");
    }

    const jump = `
      <nav class="people-jump" aria-label="${esc(t("dynamic.people.jumpAria"))}">
        <div class="people-jump-inner">
          ${sections
            .map((k, i) => `<a href="#people-${k}"${i === 0 ? ' class="is-active"' : ""}>${esc(t(SECTION_LABELS[k]))}<span>${grouped.get(k).length}</span></a>`)
            .join("")}
        </div>
      </nav>`;

    const body = sections
      .map((k, i) => {
        const members = grouped.get(k);
        const cards = members
          .map((m, j) => RENDERERS[k](m, lang).replace('class="border-glow-card', `style="--reveal-delay:${(j % 4) * 70}ms" class="border-glow-card`))
          .join("");
        return `
      <section class="people-group" id="people-${k}" aria-labelledby="people-${k}-title">
        <header class="people-group-head">
          <span class="people-group-index">${String(i + 1).padStart(2, "0")}</span>
          <h2 class="people-group-title" id="people-${k}-title">${esc(t(SECTION_LABELS[k]))}</h2>
          <span class="people-group-count">${members.length}</span>
        </header>
        <div class="${GRID_CLASS[k]}">${cards}</div>
      </section>`;
      })
      .join("");

    const joinEmail = "jinyangguo@buaa.edu.cn";
    const joinBody = esc(t("dynamic.people.join.body", { email: "__EMAIL__" })).replace("__EMAIL__", `<strong>${joinEmail}</strong>`);
    const join = `
      <aside class="people-join" aria-labelledby="people-join-title">
        <div class="people-join-copy">
          <h2 id="people-join-title">${esc(t("dynamic.people.join.title"))}</h2>
          <p>${joinBody}</p>
        </div>
        <div class="people-join-actions">
          <a class="people-join-btn is-primary" href="../opening.html">${esc(t("dynamic.people.join.cta"))}<i class="fa-solid fa-arrow-right"></i></a>
          <button type="button" class="people-join-btn email-btn" data-email="${joinEmail}"><i class="fa-solid fa-envelope"></i>${esc(t("dynamic.people.title.copyEmail"))}</button>
        </div>
      </aside>`;

    main.innerHTML = jump + body + join;
    setupObservers();
  };

  renderAll();
  document.addEventListener("languagechange", renderAll);

  // Email copy (delegated)
  main.addEventListener("click", (e) => {
    const btn = e.target.closest(".email-btn");
    if (!btn || !btn.dataset.email) return;
    const email = btn.dataset.email;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => showPeopleToast(t("dynamic.people.emailCopied")));
    } else {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showPeopleToast(t("dynamic.people.emailCopied"));
    }
  });
});

function showPeopleToast(message) {
  const existing = document.querySelector(".email-toast");
  if (existing) {
    clearTimeout(existing._hideTimer);
    existing.remove();
  }
  const toast = document.createElement("div");
  toast.className = "email-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("visible")));
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 280);
  }, 2500);
}
