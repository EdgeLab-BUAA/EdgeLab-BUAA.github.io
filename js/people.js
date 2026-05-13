document.addEventListener("DOMContentLoaded", () => {
  function showToast(message) {
    const existing = document.querySelector(".email-toast");
    if (existing) {
      clearTimeout(existing._hideTimer);
      existing.remove();
    }
    const toast = document.createElement("div");
    toast.className = "email-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("visible"));
    });
    toast._hideTimer = setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 280);
    }, 2500);
  }

  document.querySelectorAll(".email-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = btn.dataset.email;
      if (!email) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => showToast("Email Copied!"));
      } else {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("Email Copied!");
      }
    });
  });
});
