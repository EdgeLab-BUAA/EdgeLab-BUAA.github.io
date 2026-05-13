document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".card-nav");
  const toggle = document.querySelector(".hamburger-menu");
  const content = document.querySelector(".card-nav-content");
  const cards = document.querySelectorAll(".nav-card");

  if (!nav || !toggle || !content) return;

  const getExpandedHeight = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return 260;

    const previous = {
      visibility: content.style.visibility,
      pointerEvents: content.style.pointerEvents,
      position: content.style.position,
      height: content.style.height
    };

    content.style.visibility = "visible";
    content.style.pointerEvents = "auto";
    content.style.position = "static";
    content.style.height = "auto";

    const height = 60 + content.scrollHeight + 16;

    content.style.visibility = previous.visibility;
    content.style.pointerEvents = previous.pointerEvents;
    content.style.position = previous.position;
    content.style.height = previous.height;

    return height;
  };

  const setOpen = (isOpen) => {
    nav.classList.toggle("open", isOpen);
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    content.setAttribute("aria-hidden", String(!isOpen));
    nav.style.height = isOpen ? `${getExpandedHeight()}px` : "60px";
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("open"));
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle.click();
    }
  });

  window.addEventListener("resize", () => {
    if (nav.classList.contains("open")) {
      nav.style.height = `${getExpandedHeight()}px`;
    }
  });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
  });
});
