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

  const renderCard = (m) => {
    const lang = getLang();
    const isAlumni = m.team === "alumni";
    const name = lang === "zh" ? m.name_zh || m.name_en : m.name_en || m.name_zh;
    const role = lang === "zh" ? m.role_zh || m.role_en : m.role_en || m.role_zh;
    const research = lang === "zh" ? m.research_zh || m.research_en : m.research_en || m.research_zh;
    const note = lang === "zh" ? m.note_zh || m.note_en : m.note_en || m.note_zh;

    const avatar = m.photo
      ? `<img class="person-avatar" src="./${esc(m.photo)}" alt="${esc(name)}">`
      : `<div class="person-avatar-placeholder"><i class="fa-solid fa-user"></i></div>`;

    const scholarLink = m.scholar
      ? `<a href="${esc(m.scholar)}" target="_blank" class="person-link" title="${esc(t("dynamic.people.title.scholar"))}"><i class="fa-solid fa-graduation-cap"></i></a>`
      : "";

    const githubLink = m.github
      ? `<a href="${esc(m.github)}" target="_blank" class="person-link" title="${esc(t("dynamic.people.title.github"))}"><i class="fa-brands fa-github"></i></a>`
      : "";

    const emailBtn = m.email
      ? `<button class="person-link email-btn" data-email="${esc(m.email)}" title="${esc(t("dynamic.people.title.copyEmail"))}"><i class="fa-solid fa-envelope"></i></button>`
      : "";

    const homepageLink = m.homepage
      ? `<a href="${esc(m.homepage)}" target="_blank" class="person-link" title="${esc(t("dynamic.people.title.homepage"))}"><i class="fa-solid fa-house"></i></a>`
      : "";

    const researchLine = research
      ? `<p class="person-research">${esc(research)}</p>`
      : "";

    const noteLine = note
      ? `<p class="person-note">${esc(note)}</p>`
      : "";

    return `
      <article class="border-glow-card person-card${isAlumni ? " person-card-alumni" : ""}">
        <span class="edge-light"></span>
        <div class="border-glow-inner">
          ${avatar}
          <div class="person-info">
            <h3>${esc(name)}</h3>
            <p class="person-role">${esc(role)}</p>
            ${researchLine}
            ${noteLine}
            <div class="person-links">
              ${scholarLink}
              ${githubLink}
              ${emailBtn}
              ${homepageLink}
            </div>
          </div>
        </div>
      </article>`;
  };

  const SECTION_LABELS = {
    faculty: "dynamic.people.faculty",
    team1: "dynamic.people.team1",
    team2: "dynamic.people.team2",
    team3: "dynamic.people.team3",
    alumni: "dynamic.people.alumni",
  };

  const renderSection = (team, members) => {
    const label = t(SECTION_LABELS[team] || team);
    const cards = members.map(renderCard).join("\n");
    return `
      <div class="people-section">
        <h2 class="people-section-title">${esc(label)}</h2>
        <div class="team">${cards}</div>
      </div>`;
  };

  let data;
  try {
    const res = await fetch("./data/members.json");
    data = await res.json();
  } catch {
    data = window.__LAB_PEOPLE__;
    if (!data?.members) {
      main.innerHTML = `<p style="text-align:center;color:#9a9a9a;padding:80px 0">${esc(t("dynamic.people.error"))}</p>`;
      return;
    }
  }

  const grouped = new Map();
  for (const m of data.members) {
    if (!grouped.has(m.team)) grouped.set(m.team, []);
    grouped.get(m.team).push(m);
  }

  const order = ["faculty", "team1", "team2", "team3", "alumni"];
  const renderAll = () => {
    main.innerHTML = order
      .filter((team) => grouped.has(team))
      .map((team) => renderSection(team, grouped.get(team)))
      .join("\n");
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
