const campoTarea = document.getElementById("tarea");
const botonAgregarTarea = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("lista");

botonAgregarTarea.addEventListener("click", function () {
  const texto = campoTarea.value.trim();

  if (texto !== "") {
    const li = document.createElement("li");
    li.textContent = texto;

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", function () {
      li.remove();
    });

    li.appendChild(botonEliminar);
    listaTareas.appendChild(li);
    campoTarea.value = "";
  }
});
