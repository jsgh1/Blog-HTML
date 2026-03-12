const botonCalcular = document.getElementById("btnCalcular");
const resultadoCalculadora = document.getElementById("resultado");

botonCalcular.addEventListener("click", function () {
  const num1 = Number(document.getElementById("num1").value);
  const num2 = Number(document.getElementById("num2").value);
  const operacion = document.getElementById("operacion").value;
  let resultado;

  if (operacion === "+") {
    resultado = num1 + num2;
  } else if (operacion === "-") {
    resultado = num1 - num2;
  } else if (operacion === "*") {
    resultado = num1 * num2;
  } else if (operacion === "/") {
    if (num2 === 0) {
      resultado = "Error: No se puede dividir por cero";
    } else {
      resultado = num1 / num2;
    }
  }

  resultadoCalculadora.textContent = "Resultado: " + resultado;
});
