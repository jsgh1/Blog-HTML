const botonSumar = document.getElementById("btnSumar");
const resultadoSuma = document.getElementById("resultado");

botonSumar.addEventListener("click", function () {
  const numero1 = Number(document.getElementById("num1").value);
  const numero2 = Number(document.getElementById("num2").value);
  const suma = numero1 + numero2;

  resultadoSuma.textContent = "Resultado: " + suma;
});
