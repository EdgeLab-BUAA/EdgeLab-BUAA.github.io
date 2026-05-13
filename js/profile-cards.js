document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".pc-card-wrapper"));
  if (!cards.length) return;

  const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
  const round = (value, precision = 3) => Number(value.toFixed(precision));
  const adjust = (value, fromMin, fromMax, toMin, toMax) =>
    round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

  const setVars = (wrapper, shell, x, y) => {
    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;
    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    wrapper.style.setProperty("--pointer-x", `${percentX}%`);
    wrapper.style.setProperty("--pointer-y", `${percentY}%`);
    wrapper.style.setProperty("--background-x", `${adjust(percentX, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty("--background-y", `${adjust(percentY, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty("--pointer-from-center", `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`);
    wrapper.style.setProperty("--pointer-from-top", `${percentY / 100}`);
    wrapper.style.setProperty("--pointer-from-left", `${percentX / 100}`);
    wrapper.style.setProperty("--rotate-x", `${round(-(centerX / 5))}deg`);
    wrapper.style.setProperty("--rotate-y", `${round(centerY / 4)}deg`);
  };

  cards.forEach((wrapper) => {
    const shell = wrapper.querySelector(".pc-card-shell");
    if (!shell) return;

    setVars(wrapper, shell, shell.clientWidth / 2, shell.clientHeight / 2);

    shell.addEventListener("pointerenter", (event) => {
      wrapper.classList.add("active");
      shell.classList.add("entering");
      window.setTimeout(() => shell.classList.remove("entering"), 180);

      const rect = shell.getBoundingClientRect();
      setVars(wrapper, shell, event.clientX - rect.left, event.clientY - rect.top);
    });

    shell.addEventListener("pointermove", (event) => {
      const rect = shell.getBoundingClientRect();
      setVars(wrapper, shell, event.clientX - rect.left, event.clientY - rect.top);
    });

    shell.addEventListener("pointerleave", () => {
      setVars(wrapper, shell, shell.clientWidth / 2, shell.clientHeight / 2);
      wrapper.classList.remove("active");
    });
  });
});
