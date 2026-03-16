const $ = (id) => document.getElementById(id);
const money = (value) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}

class ItemCarrito {
  constructor(producto, cantidad = 1) {
    this.producto = producto;
    this.cantidad = cantidad;
  }
  aumentar() { this.cantidad += 1; }
  calcularSubtotal() { return this.producto.precio * this.cantidad; }
}

class CarritoCompras {
  constructor() { this.items = []; }
  agregarProducto(producto) {
    const itemExistente = this.items.find(item => item.producto.nombre.toLowerCase() === producto.nombre.toLowerCase());
    if (itemExistente) itemExistente.aumentar();
    else this.items.push(new ItemCarrito(producto));
  }
  eliminarProducto(nombre) {
    this.items = this.items.filter(item => item.producto.nombre !== nombre);
  }
  calcularTotal() {
    return this.items.reduce((sum, item) => sum + item.calcularSubtotal(), 0);
  }
  cantidadTotal() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }
}

class CarritoApp {
  constructor() {
    this.catalogo = [
      new Producto('Mouse inalámbrico', 95000),
      new Producto('Audífonos gamer', 210000),
      new Producto('Portátil 14 pulgadas', 2850000),
      new Producto('Silla ergonómica', 780000)
    ];
    this.carrito = new CarritoCompras();
    this.bindEvents();
    this.render();
  }
  bindEvents() {
    $('btnAgregarManual').addEventListener('click', () => this.agregarManual());
  }
  toast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  agregarDesdeCatalogo(index) {
    this.carrito.agregarProducto(this.catalogo[index]);
    this.render();
    this.toast('Producto agregado al carrito.');
  }
  agregarManual() {
    const nombre = $('nombreManual').value.trim();
    const precio = Number($('precioManual').value);
    if (!nombre || Number.isNaN(precio) || precio <= 0) return this.toast('Ingresa un producto válido.');
    this.carrito.agregarProducto(new Producto(nombre, precio));
    $('nombreManual').value = '';
    $('precioManual').value = '';
    this.render();
    this.toast('Producto manual agregado al carrito.');
  }
  eliminar(nombre) {
    this.carrito.eliminarProducto(nombre);
    this.render();
    this.toast('Producto eliminado del carrito.');
  }
  renderCatalogo() {
    $('catalogo').innerHTML = this.catalogo.map((producto, index) => `
      <article class="product-card">
        <h3>${producto.nombre}</h3>
        <p>${money(producto.precio)}</p>
        <button class="primary" data-index="${index}">Agregar</button>
      </article>`).join('');
    $('catalogo').querySelectorAll('button[data-index]').forEach(button => {
      button.addEventListener('click', () => this.agregarDesdeCatalogo(Number(button.dataset.index)));
    });
  }
  renderTabla() {
    const tbody = $('tablaCarrito');
    if (!this.carrito.items.length) {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty">Aún no hay productos en el carrito.</div></td></tr>';
      return;
    }
    tbody.innerHTML = this.carrito.items.map(item => `
      <tr>
        <td>${item.producto.nombre}</td>
        <td>${money(item.producto.precio)}</td>
        <td>${item.cantidad}</td>
        <td>${money(item.calcularSubtotal())}</td>
        <td><button class="danger remove-item" data-name="${item.producto.nombre}">Eliminar</button></td>
      </tr>`).join('');
    tbody.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => this.eliminar(button.dataset.name));
    });
  }
  renderStats() {
    $('cantidadCarrito').textContent = this.carrito.cantidadTotal();
    $('totalCarrito').textContent = money(this.carrito.calcularTotal());
    $('distintosCarrito').textContent = this.carrito.items.length;
  }
  render() {
    this.renderCatalogo();
    this.renderTabla();
    this.renderStats();
  }
}

new CarritoApp();
