const $ = (id) => document.getElementById(id);

class Vehiculo {
  constructor(placa, tipo) {
    this.placa = placa.toUpperCase();
    this.tipo = tipo;
    this.velocidad = 0;
  }
  acelerar(valor = 10) {
    this.velocidad += valor;
  }
  frenar(valor = 10) {
    this.velocidad = Math.max(0, this.velocidad - valor);
  }
  obtenerEstado() {
    if (this.velocidad === 0) return 'Detenido';
    if (this.velocidad <= 40) return 'Velocidad moderada';
    if (this.velocidad <= 80) return 'En ruta';
    return 'Velocidad alta';
  }
}

class ControlVehiculosApp {
  constructor() {
    this.vehiculos = [];
    this.bindEvents();
    this.render();
  }
  bindEvents() {
    $('btnAgregarVehiculo').addEventListener('click', () => this.agregarVehiculo());
    $('btnDemoVehiculos').addEventListener('click', () => this.cargarEjemplo());
  }
  toast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  agregarVehiculo() {
    const placa = $('placaVehiculo').value.trim();
    const tipo = $('tipoVehiculo').value.trim();
    if (!placa || !tipo) return this.toast('Completa la placa y el tipo de vehículo.');
    if (this.vehiculos.some(vehiculo => vehiculo.placa === placa.toUpperCase())) return this.toast('La placa ya fue registrada.');
    this.vehiculos.push(new Vehiculo(placa, tipo));
    $('placaVehiculo').value = '';
    $('tipoVehiculo').value = '';
    this.render();
    this.toast('Vehículo agregado a la flota.');
  }
  cargarEjemplo() {
    if (this.vehiculos.length) return this.toast('El ejemplo ya fue cargado.');
    this.vehiculos.push(new Vehiculo('ABC123', 'Camión'), new Vehiculo('TRK456', 'Bus'), new Vehiculo('XYZ789', 'Furgón'));
    this.vehiculos[0].acelerar(30);
    this.vehiculos[1].acelerar(50);
    this.render();
    this.toast('Ejemplo cargado.');
  }
  acelerar(index) {
    this.vehiculos[index].acelerar();
    this.render();
  }
  frenar(index) {
    this.vehiculos[index].frenar();
    this.render();
  }
  renderStats() {
    $('totalVehiculos').textContent = this.vehiculos.length;
    const promedio = this.vehiculos.length ? this.vehiculos.reduce((sum, vehiculo) => sum + vehiculo.velocidad, 0) / this.vehiculos.length : 0;
    const maxima = this.vehiculos.length ? Math.max(...this.vehiculos.map(vehiculo => vehiculo.velocidad)) : 0;
    $('promedioVelocidad').textContent = `${promedio.toFixed(0)} km/h`;
    $('maxVelocidad').textContent = `${maxima} km/h`;
  }
  renderPanel() {
    const panel = $('panelVehiculos');
    if (!this.vehiculos.length) {
      panel.innerHTML = '<div class="empty">No hay vehículos registrados todavía.</div>';
      return;
    }
    panel.innerHTML = this.vehiculos.map((vehiculo, index) => `
      <article class="vehicle-card">
        <div class="vehicle-head">
          <div>
            <h3>${vehiculo.placa}</h3>
            <p>${vehiculo.tipo}</p>
          </div>
          <span class="tag">${vehiculo.obtenerEstado()}</span>
        </div>
        <div class="speed-value">${vehiculo.velocidad} km/h</div>
        <div class="actions">
          <button class="primary action-acc" data-index="${index}">Acelerar +10</button>
          <button class="secondary action-brake" data-index="${index}">Frenar -10</button>
        </div>
      </article>`).join('');
    panel.querySelectorAll('.action-acc').forEach(button => button.addEventListener('click', () => this.acelerar(Number(button.dataset.index))));
    panel.querySelectorAll('.action-brake').forEach(button => button.addEventListener('click', () => this.frenar(Number(button.dataset.index))));
  }
  render() {
    this.renderStats();
    this.renderPanel();
  }
}

new ControlVehiculosApp();
