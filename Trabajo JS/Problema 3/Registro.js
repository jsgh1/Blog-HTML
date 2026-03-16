const $ = (id) => document.getElementById(id);

class Estudiante {
  constructor(nombre, programa, edad, nota) {
    this.nombre = nombre;
    this.programa = programa;
    this.edad = edad;
    this.nota = nota;
  }
  obtenerEstado() {
    return this.nota >= 3 ? 'Aprobó' : 'No aprobó';
  }
}

class RegistroEstudiantesApp {
  constructor() {
    this.estudiantes = [];
    this.bindEvents();
    this.render();
  }
  bindEvents() {
    $('btnRegistrarEstudiante').addEventListener('click', () => this.registrarEstudiante());
    $('btnVerEstudiante').addEventListener('click', () => this.verDetalle());
    $('selectEstudiante').addEventListener('change', () => this.verDetalle());
    $('btnDemoRegistro').addEventListener('click', () => this.cargarEjemplo());
  }
  toast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  get estudianteActual() {
    return this.estudiantes[Number($('selectEstudiante').value)];
  }
  registrarEstudiante() {
    const nombre = $('nombreEstudiante').value.trim();
    const programa = $('programaEstudiante').value.trim();
    const edad = Number($('edadEstudiante').value);
    const nota = Number($('notaEstudiante').value);
    if (!nombre || !programa || Number.isNaN(edad) || edad <= 0 || Number.isNaN(nota) || nota < 0 || nota > 5) {
      return this.toast('Completa correctamente todos los campos del estudiante.');
    }
    this.estudiantes.push(new Estudiante(nombre, programa, edad, nota));
    ['nombreEstudiante', 'programaEstudiante', 'edadEstudiante', 'notaEstudiante'].forEach(id => $(id).value = '');
    this.render();
    this.toast('Estudiante registrado correctamente.');
  }
  cargarEjemplo() {
    if (this.estudiantes.length) return this.toast('El ejemplo ya fue cargado.');
    this.estudiantes.push(
      new Estudiante('Laura Gómez', 'Análisis y desarrollo de software', 20, 4.2),
      new Estudiante('Mateo Pérez', 'Diseño multimedia', 23, 2.8),
      new Estudiante('Sofía Torres', 'Gestión administrativa', 19, 3.7)
    );
    this.render();
    this.toast('Ejemplo cargado.');
  }
  renderSelect() {
    $('selectEstudiante').innerHTML = this.estudiantes.length
      ? this.estudiantes.map((estudiante, index) => `<option value="${index}">${estudiante.nombre}</option>`).join('')
      : '<option value="">No hay estudiantes registrados</option>';
  }
  renderTable() {
    const tbody = $('tablaEstudiantes');
    if (!this.estudiantes.length) {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty">No hay estudiantes registrados todavía.</div></td></tr>';
      return;
    }
    tbody.innerHTML = this.estudiantes.map(estudiante => `
      <tr>
        <td>${estudiante.nombre}</td>
        <td>${estudiante.programa}</td>
        <td>${estudiante.edad}</td>
        <td>${estudiante.nota.toFixed(1)}</td>
        <td><span class="tag ${estudiante.nota >= 3 ? 'success' : 'danger'}">${estudiante.obtenerEstado()}</span></td>
      </tr>`).join('');
  }
  renderStats() {
    $('totalEstudiantes').textContent = this.estudiantes.length;
    $('totalAprobados').textContent = this.estudiantes.filter(estudiante => estudiante.nota >= 3).length;
    const promedio = this.estudiantes.length ? this.estudiantes.reduce((sum, estudiante) => sum + estudiante.nota, 0) / this.estudiantes.length : 0;
    $('promedioGrupo').textContent = promedio.toFixed(1);
  }
  verDetalle() {
    const estudiante = this.estudianteActual;
    $('detalleEstudiante').innerHTML = estudiante
      ? `<p><strong>Nombre:</strong> ${estudiante.nombre}</p><p><strong>Programa:</strong> ${estudiante.programa}</p><p><strong>Edad:</strong> ${estudiante.edad} años</p><p><strong>Nota final:</strong> ${estudiante.nota.toFixed(1)}</p><p><strong>Estado:</strong> <span class="tag ${estudiante.nota >= 3 ? 'success' : 'danger'}">${estudiante.obtenerEstado()}</span></p>`
      : 'Aquí verás la información del estudiante seleccionado.';
  }
  render() {
    this.renderSelect();
    this.renderTable();
    this.renderStats();
    this.verDetalle();
  }
}

new RegistroEstudiantesApp();
