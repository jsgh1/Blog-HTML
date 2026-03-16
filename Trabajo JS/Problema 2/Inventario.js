const $ = (id) => document.getElementById(id);
const money = (value) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

class Producto {
  constructor(nombre, precio, cantidad) {
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }
  calcularValorStock() {
    return this.precio * this.cantidad;
  }
}

class InventarioApp {
  constructor() {
    this.productos = [];
    this.bindEvents();
    this.render();
  }
  bindEvents() {
    $('btnAgregarProducto').addEventListener('click', () => this.agregarProducto());
    $('btnConsultarProducto').addEventListener('click', () => this.consultarProducto());
    $('buscarProducto').addEventListener('change', () => this.consultarProducto());
    $('btnDemoInventario').addEventListener('click', () => this.cargarEjemplo());
  }
  toast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  get productoActual() {
    return this.productos[Number($('buscarProducto').value)];
  }
  agregarProducto() {
    const nombre = $('nombreProducto').value.trim();
    const precio = Number($('precioProducto').value);
    const cantidad = Number($('cantidadProducto').value);
    if (!nombre || Number.isNaN(precio) || precio < 0 || Number.isNaN(cantidad) || cantidad < 0) {
      return this.toast('Completa correctamente todos los campos del producto.');
    }
    this.productos.push(new Producto(nombre, precio, cantidad));
    ['nombreProducto', 'precioProducto', 'cantidadProducto'].forEach(id => $(id).value = '');
    this.render();
    this.toast('Producto agregado al inventario.');
  }
  cargarEjemplo() {
    if (this.productos.length) return this.toast('El ejemplo ya fue agregado.');
    this.productos.push(
      new Producto('Teclado mecánico', 185000, 8),
      new Producto('Monitor 24 pulgadas', 670000, 5),
      new Producto('SSD 1TB', 320000, 12)
    );
    this.render();
    this.toast('Ejemplo cargado en el inventario.');
  }
  renderSelect() {
    $('buscarProducto').innerHTML = this.productos.length
      ? this.productos.map((producto, index) => `<option value="${index}">${producto.nombre}</option>`).join('')
      : '<option value="">No hay productos registrados</option>';
  }
  renderTable() {
    const tbody = $('tablaInventario');
    if (!this.productos.length) {
      tbody.innerHTML = '<tr><td colspan="4"><div class="empty">No hay productos registrados todavía.</div></td></tr>';
      return;
    }
    tbody.innerHTML = this.productos.map(producto => `
      <tr>
        <td>${producto.nombre}</td>
        <td>${money(producto.precio)}</td>
        <td>${producto.cantidad}</td>
        <td>${money(producto.calcularValorStock())}</td>
      </tr>`).join('');
  }
  renderStats() {
    $('totalProductos').textContent = this.productos.length;
    $('totalUnidades').textContent = this.productos.reduce((sum, producto) => sum + producto.cantidad, 0);
    $('valorInventario').textContent = money(this.productos.reduce((sum, producto) => sum + producto.calcularValorStock(), 0));
  }
  consultarProducto() {
    const producto = this.productoActual;
    $('detalleProducto').innerHTML = producto
      ? `<p><strong>Producto:</strong> ${producto.nombre}</p><p><strong>Precio unitario:</strong> ${money(producto.precio)}</p><p><strong>Disponibles:</strong> ${producto.cantidad}</p><p><strong>Valor en stock:</strong> ${money(producto.calcularValorStock())}</p>`
      : 'Selecciona un producto para consultar su información.';
  }
  render() {
    this.renderSelect();
    this.renderTable();
    this.renderStats();
    this.consultarProducto();
  }
}

new InventarioApp();
