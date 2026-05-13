// Uses event delegation so it works for both static and dynamically rendered cards.
const getCenter = (el) => {
  const { width, height } = el.getBoundingClientRect();
  return [width / 2, height / 2];
};

const getEdgeProximity = (el, x, y) => {
  const [cx, cy] = getCenter(el);
  const dx = x - cx;
  const dy = y - cy;
  const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
  const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
};

const getCursorAngle = (el, x, y) => {
  const [cx, cy] = getCenter(el);
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
};

document.addEventListener("pointermove", (event) => {
  const card = event.target.closest(".border-glow-card");
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  card.style.setProperty("--edge-proximity", `${(getEdgeProximity(card, x, y) * 100).toFixed(3)}`);
  card.style.setProperty("--cursor-angle", `${getCursorAngle(card, x, y).toFixed(3)}deg`);
});

document.addEventListener("pointerleave", (event) => {
  const card = event.target.closest(".border-glow-card");
  if (card) card.style.setProperty("--edge-proximity", "0");
}, true);
