const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = $("[data-nav-toggle]");
  const panel = $("[data-nav-panel]");
  if (!toggle || !panel) return;

  const close = () => {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  panel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });

  document.addEventListener("click", (e) => {
    if (e.target === toggle || toggle.contains(e.target)) return;
    if (panel.contains(e.target)) return;
    close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setupActiveNav() {
  const links = $$(".nav-link");
  const map = new Map();
  for (const a of links) {
    const id = (a.getAttribute("href") || "").trim();
    if (!id.startsWith("#")) continue;
    const section = document.querySelector(id);
    if (section) map.set(section, a);
  }
  if (map.size === 0) return;

  const activate = (section) => {
    for (const a of links) a.classList.remove("is-active");
    const a = map.get(section);
    if (a) a.classList.add("is-active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target) activate(visible.target);
    },
    { root: null, threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -60% 0px" }
  );

  for (const section of map.keys()) observer.observe(section);
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const hint = document.querySelector("[data-form-hint]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const to = "blessingoluwakemi33@gmail.com";
    const subject = `Portfolio inquiry from ${name || "Someone"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
      "",
      "--",
      "Sent from your portfolio site",
    ].join("\n");

    if (hint) {
      hint.textContent = "Opening your email client…";
      hint.classList.remove("is-error");
    }

    const mailto =
      `mailto:${encodeURIComponent(to)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}

setYear();
setupMobileNav();
setupActiveNav();
setupContactForm();

