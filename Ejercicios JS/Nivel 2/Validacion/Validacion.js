const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const edad = document.getElementById("edad").value.trim();

  if (nombre === "" || correo === "" || edad === "") {
    mensaje.textContent = "Por favor, completar todos los campos.";
    mensaje.className = "error";
  } else {
    mensaje.textContent = "Formulario enviado correctamente.";
    mensaje.className = "exito";
  }
});
