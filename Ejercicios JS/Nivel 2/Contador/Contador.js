let contador = 0;
const botonContador = document.getElementById("btnContador");
const textoContador = document.getElementById("textoContador");

botonContador.addEventListener("click", function () {
  contador++;
  textoContador.textContent = "Clics: " + contador;
});
