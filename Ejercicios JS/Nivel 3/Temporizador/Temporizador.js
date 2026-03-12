let segundos = 0;
let intervalo = null;

const tiempo = document.getElementById("tiempo");
const btnIniciar = document.getElementById("btnIniciar");
const btnDetener = document.getElementById("btnDetener");
const btnReiniciar = document.getElementById("btnReiniciar");

btnIniciar.addEventListener("click", function () {
  if (intervalo === null) {
    intervalo = setInterval(function () {
      segundos++;
      tiempo.textContent = segundos;
    }, 1000);
  }
});

btnDetener.addEventListener("click", function () {
  clearInterval(intervalo);
  intervalo = null;
});

btnReiniciar.addEventListener("click", function () {
  clearInterval(intervalo);
  intervalo = null;
  segundos = 0;
  tiempo.textContent = segundos;
});
