document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("[data-people-main]");
  if (!main) return;
  const i18n = window.labI18n;

  const esc = (v) =>
    String(v)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const getLang = () => i18n?.getLanguage?.() || "en";
  const t = (key) => i18n?.t?.(key) || key;
  const publications = window.__PEOPLE_PUBLICATIONS__?.papers || [];
  const papersForMember = (id) => publications
    .filter((paper) => ["first", "co-first"].includes(paper.authorship[id]))
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  const renderPublications = (member) => {
    if (member.team === "faculty") return "";
    const zh = getLang() === "zh";
    const papers = papersForMember(member.id);
    if (!papers.length) return `<div class="person-publications-empty"><span>${zh ? "一作 / 共一论文" : "Selected publications"}</span><p>${zh ? "论文信息待补充" : "Publication details to be added"}</p></div>`;
    const first = papers.filter((paper) => paper.authorship[member.id] === "first").length;
    const coFirst = papers.length - first;
    const preprints = papers.filter((paper) => paper.status === "preprint").length;
    return `<details class="person-publications">
      <summary>
        <span class="publication-summary-title">${zh ? "一作 / 共一论文" : "Selected publications"}<span class="publication-count">${papers.length}</span></span>
        <span class="publication-counts">${zh ? `一作 ${first} · 共一 ${coFirst}` : `${first} first · ${coFirst} co-first`}${preprints ? (zh ? ` · 含 ${preprints} 篇预印本` : ` · ${preprints} preprint${preprints > 1 ? "s" : ""}`) : ""}</span>
        <span class="publication-disclosure" aria-hidden="true">+</span>
      </summary>
      <p class="publication-scope">${zh ? "已核实记录；共一不重复计入一作。" : "Verified records. Co-first papers are counted separately."}</p>
      <ol class="publication-list">${papers.map((paper) => `<li data-paper-id="${esc(paper.id)}">
        <div class="publication-meta"><span>${esc(paper.venue)} · ${paper.year}</span><span class="authorship-badge">${paper.authorship[member.id] === "co-first" ? (zh ? "共一" : "Co-first") : (zh ? "一作" : "First")}</span>${paper.status === "preprint" ? `<span class="preprint-badge">${zh ? "预印本" : "Preprint"}</span>` : ""}</div>
        <a href="${esc(paper.url)}" target="_blank" rel="noopener noreferrer">${esc(paper.title)}<span aria-hidden="true"> ↗</span></a>
      </li>`).join("")}</ol>
    </details>`;
  };

  const renderCard = (m) => {
    const lang = getLang();
    const isAlumni = m.team === "alumni";
    const name = lang === "zh" ? m.name_zh || m.name_en : m.name_en || m.name_zh;
    const role = lang === "zh" ? m.role_zh || m.role_en : m.role_en || m.role_zh;
    const research = lang === "zh" ? m.research_zh || m.research_en : m.research_en || m.research_zh;
    const note = lang === "zh" ? m.note_zh || m.note_en : m.note_en || m.note_zh;
    const enrollment = m.enrollment_year
      ? (lang === "zh" ? `${m.enrollment_year} 级` : `Entered ${m.enrollment_year}`)
      : "";
    const initials = (m.name_en || m.name_zh).split(/\s+/).map((part) => part[0]).slice(0, 2).join("");

    const avatar = m.photo
      ? `<img class="person-avatar" src="./${esc(m.photo)}" alt="${esc(name)}" loading="lazy" width="100" height="124">`
      : `<div class="person-avatar-placeholder" aria-hidden="true">${esc(initials)}</div>`;

    const scholarLink = m.scholar
      ? `<a href="${esc(m.scholar)}" target="_blank" rel="noopener noreferrer" class="person-link" aria-label="${esc(t("dynamic.people.title.scholar"))}" title="${esc(t("dynamic.people.title.scholar"))}"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i></a>`
      : "";

    const githubLink = m.github
      ? `<a href="${esc(m.github)}" target="_blank" rel="noopener noreferrer" class="person-link" aria-label="${esc(t("dynamic.people.title.github"))}" title="${esc(t("dynamic.people.title.github"))}"><i class="fa-brands fa-github" aria-hidden="true"></i></a>`
      : "";

    const emailBtn = m.email
      ? `<button type="button" class="person-link email-btn" data-email="${esc(m.email)}" aria-label="${esc(t("dynamic.people.title.copyEmail"))}" title="${esc(t("dynamic.people.title.copyEmail"))}"><i class="fa-solid fa-envelope" aria-hidden="true"></i></button>`
      : "";

    const homepageLink = m.homepage
      ? `<a href="${esc(m.homepage)}" target="_blank" rel="noopener noreferrer" class="person-link" aria-label="${esc(t("dynamic.people.title.homepage"))}" title="${esc(t("dynamic.people.title.homepage"))}"><i class="fa-solid fa-house" aria-hidden="true"></i></a>`
      : "";

    const researchLine = research
      ? `<div class="person-research"><span class="person-detail-label">${lang === "zh" ? "研究方向" : "Research"}</span><p>${esc(research)}</p></div>`
      : "";

    const noteLine = note
      ? `<ul class="person-notes">${note.split("\n").filter(Boolean).map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`
      : "";

    return `
      <article id="${esc(m.id)}" class="person-card${isAlumni ? " person-card-alumni" : ""}${m.team === "faculty" ? " person-card-faculty" : ""}">
        <div class="person-heading">
          ${avatar}
          <div class="person-identity">
            <h3>${esc(name)}</h3>
            <p class="person-role">${esc(role)}</p>
            ${enrollment ? `<p class="person-enrollment">${esc(enrollment)}</p>` : ""}
            ${scholarLink || githubLink || emailBtn || homepageLink ? `<div class="person-links">${scholarLink}${githubLink}${emailBtn}${homepageLink}</div>` : ""}
          </div>
        </div>
        <div class="person-body">${researchLine}${noteLine}</div>
        ${renderPublications(m)}
      </article>`;
  };

  const SECTION_LABELS = {
    faculty: "dynamic.people.faculty",
    phd: "dynamic.people.phd",
    master: "dynamic.people.master",
    alumni: "dynamic.people.alumni",
  };

  const getSectionKey = (m) => {
    if (m.team === "faculty" || m.team === "alumni") return m.team;

    const role = `${m.role_en || ""} ${m.role_zh || ""}`.toLowerCase();
    if (/ph\.?\s*d/.test(role) || role.includes("博士")) return "phd";
    if (role.includes("master") || role.includes("硕士")) return "master";

    return "master";
  };

  const renderSection = (team, members) => {
    const label = t(SECTION_LABELS[team] || team);
    const cards = members.map(renderCard).join("\n");
    return `
      <section class="people-section people-section-${team}" aria-labelledby="people-${team}">
        <h2 id="people-${team}" class="people-section-title">${esc(label)}<span class="people-section-count">${members.length.toString().padStart(2, "0")}</span></h2>
        <div class="team">${cards}</div>
      </section>`;
  };

  let data = window.__LAB_PEOPLE__;
  try {
    if (!data?.members) {
      const res = await fetch("./data/members.json");
      if (!res.ok) throw new Error("Members unavailable");
      data = await res.json();
    }
  } catch {
    if (!data?.members) {
      main.innerHTML = `<p style="text-align:center;color:#9a9a9a;padding:80px 0">${esc(t("dynamic.people.error"))}</p>`;
      return;
    }
  }

  const grouped = new Map();
  for (const m of data.members) {
    const sectionKey = getSectionKey(m);
    if (!grouped.has(sectionKey)) grouped.set(sectionKey, []);
    grouped.get(sectionKey).push(m);
  }

  const order = ["faculty", "phd", "master", "alumni"];
  const renderAll = () => {
    const expanded = [...main.querySelectorAll(".person-publications[open]")].map((details) => details.closest("article").id);
    main.innerHTML = `<p class="people-publication-policy">${getLang() === "zh" ? "学生及校友论文按第一作者、共同第一作者统计，预印本单独标注。" : "Student and alumni publications include first and co-first authorship; preprints are labeled separately."}</p>` + order
      .filter((team) => grouped.has(team))
      .map((team) => renderSection(team, grouped.get(team)))
      .join("\n");
    expanded.forEach((id) => {
      const details = document.getElementById(id)?.querySelector("details");
      if (details) details.open = true;
    });
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
