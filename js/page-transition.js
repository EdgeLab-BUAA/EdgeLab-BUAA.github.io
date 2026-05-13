document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url;
      try {
        url = new URL(link.href, location.href);
      } catch {
        return;
      }

      // Skip external links
      if (url.origin !== location.origin) return;

      // Skip same-page anchor scrolls (e.g. index.html#about while on index.html)
      if (url.pathname === location.pathname && url.hash) return;

      e.preventDefault();
      const target = link.href;

      document.body.style.transition = "opacity 0.28s ease, transform 0.28s ease";
      document.body.style.opacity = "0";
      document.body.style.transform = "translateY(-8px)";

      setTimeout(() => {
        location.href = target;
      }, 290);
    });
  });
});
