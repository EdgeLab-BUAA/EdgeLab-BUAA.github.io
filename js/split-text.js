document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero-main-copy h1[data-split-text]");
  if (!title || title.dataset.splitReady === "true") return;

  const initSplitText = () => {
    const text = title.textContent.trim();
    let index = 0;

    title.dataset.splitReady = "true";
    title.setAttribute("aria-label", text);
    title.textContent = "";

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
      {
        threshold: 0.1,
        rootMargin: "-100px"
      }
    );

    observer.observe(title);
  };

  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(initSplitText);
  } else {
    initSplitText();
  }
});
