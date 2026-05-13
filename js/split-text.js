function initSplitTextTitle() {
  const title = document.querySelector(".hero-main-copy h1[data-split-text]");
  if (!title || title.dataset.splitReady === "true") return;

  const initSplitText = () => {
    // Collect child nodes before clearing (preserves <br> elements)
    const sourceNodes = Array.from(title.childNodes).map(n => ({
      type: n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR" ? "br" : "text",
      text: n.textContent,
    }));

    const fullText = sourceNodes.map(n => n.text).join("").trim();
    let index = 0;

    title.dataset.splitReady = "true";
    title.setAttribute("aria-label", fullText);
    title.textContent = "";

    sourceNodes.forEach(({ type, text }) => {
      if (type === "br") {
        title.appendChild(document.createElement("br"));
        return;
      }

      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;

        if (/^\s+$/.test(part)) {
          title.appendChild(document.createTextNode(part));
          return;
        }

        const word = document.createElement("span");
        word.className = "split-word";
        word.setAttribute("aria-hidden", "true");

        Array.from(part).forEach((char) => {
          const letter = document.createElement("span");
          letter.className = "split-char";
          letter.textContent = char;
          letter.style.transitionDelay = `${index * 50}ms`;
          word.appendChild(letter);
          index += 1;
        });

        title.appendChild(word);
      });
    });

    title.classList.add("split-parent", "split-ready");

    const reveal = () => title.classList.add("split-visible");

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal();
          observer.unobserve(title);
        });
      },
      { threshold: 0.1, rootMargin: "-100px" }
    );

    observer.observe(title);
  };

  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(initSplitText);
  } else {
    initSplitText();
  }
}

document.addEventListener("DOMContentLoaded", initSplitTextTitle);
document.addEventListener("languagechange", () => {
  const title = document.querySelector(".hero-main-copy h1[data-split-text]");
  if (!title) return;
  const nextText = title.dataset.i18n ? window.labI18n?.t?.(title.dataset.i18n) || title.textContent.trim() : title.textContent.trim();
  title.classList.remove("split-parent", "split-ready", "split-visible");
  title.dataset.splitReady = "false";
  title.textContent = nextText;
  requestAnimationFrame(() => initSplitTextTitle());
});
