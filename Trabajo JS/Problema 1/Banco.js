const $ = (id) => document.getElementById(id);
const money = (value) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

class CuentaBancaria {
  constructor(nombre, saldoInicial = 0) {
    this.nombre = nombre;
    this.saldo = saldoInicial;
    this.movimientos = [];
    this.registrarMovimiento('Cuenta creada', 'Saldo inicial registrado');
  }
  registrarMovimiento(tipo, descripcion) {
    this.movimientos.push({ tipo, descripcion, saldo: this.saldo, fecha: new Date().toLocaleString('es-CO') });
  }
  depositar(monto) {
    if (monto <= 0) throw new Error('El monto a depositar debe ser mayor a cero.');
    this.saldo += monto;
    this.registrarMovimiento('Depósito', `Se depositaron ${money(monto)}.`);
  }
  retirar(monto) {
    if (monto <= 0) throw new Error('El monto a retirar debe ser mayor a cero.');
    if (monto > this.saldo) throw new Error('No puedes retirar más dinero del saldo disponible.');
    this.saldo -= monto;
    this.registrarMovimiento('Retiro', `Se retiraron ${money(monto)}.`);
  }
}

class BancoApp {
  constructor() {
    this.cuentas = [];
    this.bindEvents();
    this.render();
  }
  bindEvents() {
    $('btnCrearCuenta').addEventListener('click', () => this.crearCuenta());
    $('btnDepositar').addEventListener('click', () => this.operar('depositar'));
    $('btnRetirar').addEventListener('click', () => this.operar('retirar'));
    $('btnConsultar').addEventListener('click', () => this.consultarCuenta());
    $('btnDemo').addEventListener('click', () => this.cargarEjemplo());
    $('clienteOperacion').addEventListener('change', () => this.renderDetalle());
  }
  toast(message, type = 'info') {
    const toast = $('toast');
    const colors = { success: '#22c55e', warning: '#f59e0b', danger: '#ef4444', info: '#38bdf8' };
    toast.textContent = message;
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  get cuentaActual() {
    const index = Number($('clienteOperacion').value);
    return Number.isInteger(index) ? this.cuentas[index] : undefined;
  }
  crearCuenta() {
    const nombre = $('nombreCliente').value.trim();
    const saldoInicial = Number($('saldoInicial').value);
    if (!nombre) return this.toast('Debes ingresar el nombre del cliente.', 'danger');
    if (Number.isNaN(saldoInicial) || saldoInicial < 0) return this.toast('El saldo inicial debe ser válido.', 'danger');
    this.cuentas.push(new CuentaBancaria(nombre, saldoInicial));
    $('nombreCliente').value = '';
    $('saldoInicial').value = '';
    $('clienteOperacion').value = String(this.cuentas.length - 1);
    this.render();
    $('clienteOperacion').value = String(this.cuentas.length - 1);
    this.renderDetalle();
    this.toast('Cuenta creada correctamente.', 'success');
  }
  operar(tipo) {
    const cuenta = this.cuentaActual;
    const monto = Number($('montoOperacion').value);
    if (!cuenta) return this.toast('Primero selecciona un cliente.', 'danger');
    if (Number.isNaN(monto) || monto <= 0) return this.toast('Ingresa un monto válido.', 'danger');
    try {
      cuenta[tipo](monto);
      $('montoOperacion').value = '';
      this.render();
      this.toast(tipo === 'depositar' ? 'Depósito realizado con éxito.' : 'Retiro realizado correctamente.', tipo === 'depositar' ? 'success' : 'warning');
    } catch (error) {
      this.toast(error.message, 'danger');
    }
  }
  consultarCuenta() {
    const cuenta = this.cuentaActual;
    if (!cuenta) return this.toast('No hay una cuenta seleccionada.', 'danger');
    this.renderDetalle();
    this.toast(`Saldo actual de ${cuenta.nombre}: ${money(cuenta.saldo)}`);
  }
  cargarEjemplo() {
    if (this.cuentas.length) return this.toast('El ejemplo ya fue cargado.', 'warning');
    this.cuentas.push(new CuentaBancaria('Ana Martínez', 350000), new CuentaBancaria('Carlos Ruiz', 120000));
    $('clienteOperacion').value = '0';
    this.render();
    $('clienteOperacion').value = '0';
    this.renderDetalle();
    this.toast('Ejemplo cargado.', 'success');
  }
  renderSelect() {
    const select = $('clienteOperacion');
    if (!this.cuentas.length) {
      select.innerHTML = '<option value="">No hay clientes registrados</option>';
      return;
    }
    select.innerHTML = this.cuentas.map((cuenta, index) => `<option value="${index}">${cuenta.nombre}</option>`).join('');
  }
  renderStats() {
    $('totalClientes').textContent = this.cuentas.length;
    $('saldoBanco').textContent = money(this.cuentas.reduce((sum, cuenta) => sum + cuenta.saldo, 0));
  }
  renderHistorial() {
    const cuenta = this.cuentaActual;
    const historial = $('historial');
    if (!cuenta || !cuenta.movimientos.length) {
      historial.innerHTML = '<div class="empty">Aún no hay movimientos registrados.</div>';
      return;
    }
    historial.innerHTML = [...cuenta.movimientos].reverse().map(item => `
      <div class="log-item">
        <strong>${item.tipo}</strong>
        <div class="small">${item.descripcion}</div>
        <div class="small">${item.fecha}</div>
        <div class="small">Saldo resultante: ${money(item.saldo)}</div>
      </div>`).join('');
  }
  renderDetalle() {
    const cuenta = this.cuentaActual;
    if (!cuenta) {
      $('detalleCuenta').textContent = 'Selecciona o crea un cliente para ver su información.';
      $('saldoActual').textContent = money(0);
      this.renderHistorial();
      return;
    }
    $('detalleCuenta').innerHTML = `
      <p><strong>Cliente:</strong> ${cuenta.nombre}</p>
      <p><strong>Saldo disponible:</strong> ${money(cuenta.saldo)}</p>
      <p><strong>Movimientos registrados:</strong> ${cuenta.movimientos.length}</p>`;
    $('saldoActual').textContent = money(cuenta.saldo);
    this.renderHistorial();
  }
  render() {
    this.renderSelect();
    this.renderStats();
    this.renderDetalle();
  }
}

new BancoApp();
