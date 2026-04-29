const tooltipTimeouts = new WeakMap();

document.querySelectorAll(".deactivated").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    link.classList.remove("show-tooltip");

    requestAnimationFrame(() => {
      link.classList.add("show-tooltip");
    });

    const existingTimeout = tooltipTimeouts.get(link);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      link.classList.remove("show-tooltip");
      tooltipTimeouts.delete(link);
    }, 1200);

    tooltipTimeouts.set(link, timeout);
  });
});

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("close");

if (
  modal instanceof HTMLElement &&
  modalImg instanceof HTMLImageElement &&
  closeBtn instanceof HTMLElement
) {
  document.querySelectorAll(".project-click").forEach((el) => {
    el.addEventListener("click", () => {
      if (!(el instanceof HTMLElement)) return;

      const src = el.dataset.src;
      if (!src) return;

      modalImg.src = src;
      modal.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });
}
