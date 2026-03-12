const inputTarea = document.getElementById("tarea");
const botonAgregar = document.getElementById("btnAgregar");
const lista = document.getElementById("lista");

botonAgregar.addEventListener("click", function () {
  const texto = inputTarea.value.trim();

  if (texto !== "") {
    const elemento = document.createElement("li");
    elemento.textContent = texto;
    lista.appendChild(elemento);
    inputTarea.value = "";
  }
});
