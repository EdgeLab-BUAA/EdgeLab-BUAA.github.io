document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-card-swap]");
  const container = root?.querySelector(".card-swap-container");
  if (!root || !container) return;
  const i18n = window.labI18n;

  const coverDir = root.dataset.coverDir || "./images/cover/";
  const fallbackImages = ["00002.jpg", "00013.jpg", "00014.JPEG"].map((name) => `${coverDir}${name}`);
  const config = {
    cardDistance: 60,
    verticalDistance: 70,
    delay: 5000,
    skewAmount: 6
  };

  const readDirectoryImages = async () => {
    try {
      const response = await fetch(coverDir);
      if (!response.ok) return [];
      const html = await response.text();
      return Array.from(html.matchAll(/href="([^"]+\.(?:jpe?g|png|webp|gif|heic))"/gi))
        .map((match) => new URL(match[1], new URL(coverDir, window.location.href)).href)
        .sort();
    } catch {
      return [];
    }
  };

  const createCards = (images) => {
    container.innerHTML = "";
    images.forEach((src, index) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.backgroundImage = `url("${src}")`;
      card.setAttribute("aria-label", i18n?.t?.("dynamic.cards.coverPhoto", { index: index + 1 }) || `Lab cover photo ${index + 1}`);
      container.appendChild(card);
    });
    return Array.from(container.querySelectorAll(".card"));
  };

  const makeSlot = (i, total) => ({
    x: i * config.cardDistance,
    y: -i * config.verticalDistance,
    z: -i * config.cardDistance * 1.5,
    zIndex: total - i
  });

  const placeCard = (card, slot) => {
    card.style.zIndex = slot.zIndex;
    card.style.transform = `translate(-50%, -50%) translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) skewY(${config.skewAmount}deg)`;
  };

  const imagesReady = (images) =>
    Promise.all(
      images.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((items) => items.filter(Boolean));

  const setup = async () => {
    const directoryImages = await readDirectoryImages();
    const imageSources = directoryImages.length ? directoryImages : fallbackImages;
    const validImages = await imagesReady(imageSources);
    const cards = createCards(validImages.length ? validImages : fallbackImages);
    const order = cards.map((_, index) => index);

    cards.forEach((card, index) => {
      placeCard(card, makeSlot(index, cards.length));
    });

    const swap = () => {
      if (order.length < 2) return;

      const front = order.shift();
      const frontCard = cards[front];
      frontCard.classList.add("is-dropping");
      frontCard.style.transform = `translate(-50%, -50%) translate3d(0px, 500px, 0px) skewY(${config.skewAmount}deg)`;

      order.forEach((cardIndex, slotIndex) => {
        const card = cards[cardIndex];
        const slot = makeSlot(slotIndex, cards.length);
        card.style.zIndex = slot.zIndex;
        window.setTimeout(() => placeCard(card, slot), slotIndex * 150);
      });

      window.setTimeout(() => {
        const backSlot = makeSlot(cards.length - 1, cards.length);
        frontCard.classList.remove("is-dropping");
        placeCard(frontCard, backSlot);
        order.push(front);
      }, 1200);
    };

    window.setTimeout(swap, 250);
    window.setInterval(swap, config.delay);
  };

  setup();
});
