document.getElementById("year").textContent = new Date().getFullYear();

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");

function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (themeToggle) themeToggle.checked = theme === "dark";
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Oscuro" : "Claro";
  localStorage.setItem("theme", theme);
}

const saved = localStorage.getItem("theme");
if (saved) {
  setTheme(saved);
} else {
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    setTheme(themeToggle.checked ? "dark" : "light");
  });
}

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const topic = (data.get("topic") || "").toString();
    const msg = (data.get("msg") || "").toString().trim();

    if (!name || !msg) {
      statusEl.textContent = "⚠️ Completa nombre y mensaje.";
      return;
    }

    const fakeEmail = "juan@gmail.com";

    statusEl.textContent = `✅ Enviado (demo): ${name} | ${fakeEmail} | tema=${topic}`;
    form.reset();
  });
}