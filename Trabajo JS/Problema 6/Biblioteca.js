const $ = (id) => document.getElementById(id);

class Libro {
  constructor(titulo, autor) {
    this.titulo = titulo;
    this.autor = autor;
    this.disponible = true;
    this.usuario = 'Ninguno';
  }
  prestar(usuario) {
    if (!this.disponible) throw new Error('El libro ya se encuentra prestado.');
    this.disponible = false;
    this.usuario = usuario;
  }
  devolver() {
    this.disponible = true;
    this.usuario = 'Ninguno';
  }
  obtenerEstado() {
    return this.disponible ? 'Disponible' : 'Prestado';
  }
}

class BibliotecaApp {
  constructor() {
    this.libros = [];
    this.bindEvents();
    this.render();
  }
  bindEvents() {
    $('btnAgregarLibro').addEventListener('click', () => this.agregarLibro());
    $('btnPrestarLibro').addEventListener('click', () => this.prestarLibro());
    $('btnDevolverLibro').addEventListener('click', () => this.devolverLibro());
    $('btnConsultarLibro').addEventListener('click', () => this.consultarLibro());
    $('selectLibro').addEventListener('change', () => this.consultarLibro());
    $('btnDemoBiblioteca').addEventListener('click', () => this.cargarEjemplo());
  }
  toast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  get libroActual() {
    return this.libros[Number($('selectLibro').value)];
  }
  agregarLibro() {
    const titulo = $('tituloLibro').value.trim();
    const autor = $('autorLibro').value.trim();
    if (!titulo || !autor) return this.toast('Completa el título y el autor del libro.');
    this.libros.push(new Libro(titulo, autor));
    $('tituloLibro').value = '';
    $('autorLibro').value = '';
    this.render();
    this.toast('Libro agregado correctamente.');
  }
  prestarLibro() {
    const libro = this.libroActual;
    const usuario = $('usuarioPrestamo').value.trim();
    if (!libro) return this.toast('Selecciona un libro.');
    if (!usuario) return this.toast('Ingresa el nombre del usuario.');
    try {
      libro.prestar(usuario);
      this.render();
      this.toast('Libro prestado correctamente.');
    } catch (error) {
      this.toast(error.message);
    }
  }
  devolverLibro() {
    const libro = this.libroActual;
    if (!libro) return this.toast('Selecciona un libro.');
    libro.devolver();
    this.render();
    this.toast('Libro devuelto correctamente.');
  }
  cargarEjemplo() {
    if (this.libros.length) return this.toast('El ejemplo ya fue cargado.');
    this.libros.push(new Libro('Cien años de soledad', 'Gabriel García Márquez'), new Libro('El principito', 'Antoine de Saint-Exupéry'), new Libro('Clean Code', 'Robert C. Martin'));
    this.libros[1].prestar('Valentina Díaz');
    this.render();
    this.toast('Ejemplo cargado.');
  }
  renderSelect() {
    $('selectLibro').innerHTML = this.libros.length
      ? this.libros.map((libro, index) => `<option value="${index}">${libro.titulo}</option>`).join('')
      : '<option value="">No hay libros registrados</option>';
  }
  renderTable() {
    const tbody = $('tablaLibros');
    if (!this.libros.length) {
      tbody.innerHTML = '<tr><td colspan="4"><div class="empty">No hay libros registrados todavía.</div></td></tr>';
      return;
    }
    tbody.innerHTML = this.libros.map(libro => `
      <tr>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td><span class="tag ${libro.disponible ? 'success' : 'warning'}">${libro.obtenerEstado()}</span></td>
        <td>${libro.usuario}</td>
      </tr>`).join('');
  }
  renderStats() {
    $('totalLibros').textContent = this.libros.length;
    $('librosDisponibles').textContent = this.libros.filter(libro => libro.disponible).length;
    $('librosPrestados').textContent = this.libros.filter(libro => !libro.disponible).length;
  }
  consultarLibro() {
    const libro = this.libroActual;
    $('detalleLibro').innerHTML = libro
      ? `<p><strong>Título:</strong> ${libro.titulo}</p><p><strong>Autor:</strong> ${libro.autor}</p><p><strong>Estado:</strong> ${libro.obtenerEstado()}</p><p><strong>Usuario actual:</strong> ${libro.usuario}</p>`
      : 'Selecciona un libro para ver su información.';
  }
  render() {
    this.renderSelect();
    this.renderTable();
    this.renderStats();
    this.consultarLibro();
  }
}

new BibliotecaApp();
