const tooltipTimeouts = new WeakMap();
const germanyTimeZone = "Europe/Berlin";

const footerGreetingEl = document.querySelector("[data-footer-greeting]");
const timeDifferenceEl = document.querySelector("[data-time-difference]");

const getTimeZoneOffsetMinutes = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const valueByType = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  const timeAsUtc = Date.UTC(
    valueByType.year,
    valueByType.month - 1,
    valueByType.day,
    valueByType.hour,
    valueByType.minute,
    valueByType.second,
  );

  return Math.round((timeAsUtc - date.getTime()) / 60000);
};

const formatUtcDifference = (differenceMinutes) => {
  if (differenceMinutes === 0) {
    return "UTC+0";
  }

  const absoluteMinutes = Math.abs(differenceMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  const sign = differenceMinutes > 0 ? "+" : "-";
  const minuteText = minutes > 0 ? `:${String(minutes).padStart(2, "0")}` : "";

  return `UTC${sign}${hours}${minuteText}`;
};

const updateFooterGreeting = (date) => {
  if (!footerGreetingEl) {
    return;
  }

  const hour = date.getHours();
  footerGreetingEl.textContent =
    hour >= 22 || hour < 6 ? "Good night!" : "Have a great day!";
};

const updateTimeComparison = () => {
  const now = new Date();

  updateFooterGreeting(now);

  if (!timeDifferenceEl) {
    return;
  }

  const localTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Local timezone";
  const germanyOffset = getTimeZoneOffsetMinutes(now, germanyTimeZone);
  const localOffset = getTimeZoneOffsetMinutes(now, localTimeZone);

  timeDifferenceEl.textContent = formatUtcDifference(localOffset - germanyOffset);
};

updateTimeComparison();
setInterval(updateTimeComparison, 60 * 1000);

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
