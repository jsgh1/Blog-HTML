document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const topic = (data.get("topic") || "").toString();
    const msg = (data.get("msg") || "").toString().trim();

    if (!name || !email || !msg) {
      statusEl.textContent = "⚠️ Completa nombre, email y mensaje.";
      return;
    }

    statusEl.textContent = `✅ Enviado (demo): ${name} | ${email} | tema=${topic}`;
    form.reset();
  });
}