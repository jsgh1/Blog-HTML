import { RESOURCE_CONFIG } from './config.js';
import { getItems, createItem, updateItem, deleteItem } from './api.js';
import { qs, createElement, escapeHtml, formatValue, showToast, textEllipsis } from './ui.js';

const state = {
  currentResource: 'products',
  items: [],
  filteredItems: [],
  editingItem: null
};

const dom = {
  resourceMenu: qs('#resourceMenu'),
  sectionTitle: qs('#sectionTitle'),
  searchInput: qs('#searchInput'),
  filterSelect: qs('#filterSelect'),
  filterValue: qs('#filterValue'),
  tableHead: qs('#tableHead'),
  tableBody: qs('#tableBody'),
  statsGrid: qs('#statsGrid'),
  resultsCount: qs('#resultsCount'),
  refreshBtn: qs('#refreshBtn'),
  newBtn: qs('#newBtn'),
  formModal: qs('#formModal'),
  detailModal: qs('#detailModal'),
  entityForm: qs('#entityForm'),
  modalTitle: qs('#modalTitle'),
  detailTitle: qs('#detailTitle'),
  detailContent: qs('#detailContent'),
  closeFormModal: qs('#closeFormModal'),
  closeDetailModal: qs('#closeDetailModal')
};

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {};
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
}

function buildMenu() {
  dom.resourceMenu.innerHTML = '';
  Object.entries(RESOURCE_CONFIG).forEach(([key, config]) => {
    const btn = createElement('button', {
      className: `menu-btn ${state.currentResource === key ? 'active' : ''}`,
      html: `<strong>${config.label}</strong><br><span class="muted">Administrar ${config.label.toLowerCase()}</span>`
    });
    btn.addEventListener('click', () => switchResource(key));
    dom.resourceMenu.appendChild(btn);
  });
}

function buildFilters() {
  const config = RESOURCE_CONFIG[state.currentResource];
  dom.filterSelect.innerHTML = '<option value="">Sin filtro</option>';
  config.filterFields.forEach(field => {
    const option = createElement('option');
    option.value = field.key;
    option.textContent = field.label;
    dom.filterSelect.appendChild(option);
  });
  dom.filterValue.innerHTML = '<option value="">Todos</option>';
}

function updateFilterValues() {
  const selectedField = dom.filterSelect.value;
  dom.filterValue.innerHTML = '<option value="">Todos</option>';
  if (!selectedField) return;

  const uniqueValues = [...new Set(state.items.flatMap(item => {
    const value = getNestedValue(item, selectedField);
    return Array.isArray(value) ? value : [value];
  }).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));

  uniqueValues.forEach(value => {
    const option = createElement('option');
    option.value = String(value);
    option.textContent = value;
    dom.filterValue.appendChild(option);
  });
}

function applyFilters() {
  const config = RESOURCE_CONFIG[state.currentResource];
  const searchTerm = dom.searchInput.value.trim().toLowerCase();
  const filterField = dom.filterSelect.value;
  const filterValue = dom.filterValue.value;

  state.filteredItems = state.items.filter(item => {
    const matchesSearch = !searchTerm || config.searchFields.some(field => {
      const value = getNestedValue(item, field);
      if (Array.isArray(value)) return value.join(' ').toLowerCase().includes(searchTerm);
      return String(value ?? '').toLowerCase().includes(searchTerm);
    });

    const itemFilterValue = getNestedValue(item, filterField);
    const matchesFilter = !filterField || !filterValue || (Array.isArray(itemFilterValue)
      ? itemFilterValue.map(String).includes(filterValue)
      : String(itemFilterValue ?? '') === filterValue);

    return matchesSearch && matchesFilter;
  });

  renderStats();
  renderTable();
}

function renderStats() {
  const cards = buildStatsForResource(state.currentResource, state.filteredItems);
  dom.statsGrid.innerHTML = '';
  cards.forEach(card => {
    const div = createElement('article', { className: 'stat-card' });
    div.innerHTML = `<p>${card.label}</p><strong>${card.value}</strong>`;
    dom.statsGrid.appendChild(div);
  });
}

function buildStatsForResource(resource, items) {
  const count = items.length;
  if (!count) {
    return [
      { label: 'Registros', value: 0 },
      { label: 'Resumen', value: '—' },
      { label: 'Estado', value: 'Sin datos' },
      { label: 'Vista', value: 'Vacía' }
    ];
  }

  if (resource === 'products') {
    const stock = items.reduce((sum, item) => sum + Number(item.stock || 0), 0);
    const avgPrice = items.reduce((sum, item) => sum + Number(item.price || 0), 0) / count;
    const uniqueCategories = new Set(items.map(item => item.category)).size;
    return [
      { label: 'Registros', value: count },
      { label: 'Stock total', value: stock },
      { label: 'Precio promedio', value: formatValue(avgPrice, 'currency') },
      { label: 'Categorías', value: uniqueCategories }
    ];
  }

  if (resource === 'users') {
    const avgAge = Math.round(items.reduce((sum, item) => sum + Number(item.age || 0), 0) / count);
    const uniqueCompanies = new Set(items.map(item => item.company?.name).filter(Boolean)).size;
    const women = items.filter(item => item.gender === 'female').length;
    return [
      { label: 'Registros', value: count },
      { label: 'Edad promedio', value: avgAge || '—' },
      { label: 'Empresas', value: uniqueCompanies },
      { label: 'Mujeres', value: women }
    ];
  }

  if (resource === 'posts') {
    const totalViews = items.reduce((sum, item) => sum + Number(item.views || 0), 0);
    const totalLikes = items.reduce((sum, item) => sum + Number(item.reactions?.likes || 0), 0);
    const tags = new Set(items.flatMap(item => item.tags || [])).size;
    return [
      { label: 'Registros', value: count },
      { label: 'Vistas', value: totalViews },
      { label: 'Likes', value: totalLikes },
      { label: 'Tags', value: tags }
    ];
  }

  const total = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.totalQuantity || 0), 0);
  const avgTicket = total / count;
  return [
    { label: 'Registros', value: count },
    { label: 'Cantidad total', value: totalQuantity },
    { label: 'Venta total', value: formatValue(total, 'currency') },
    { label: 'Ticket promedio', value: formatValue(avgTicket, 'currency') }
  ];
}

function renderTable() {
  const config = RESOURCE_CONFIG[state.currentResource];
  dom.sectionTitle.textContent = config.label;
  dom.resultsCount.textContent = `${state.filteredItems.length} registros`;

  dom.tableHead.innerHTML = `<tr>${config.columns.map(col => `<th>${col.label}</th>`).join('')}<th>Acciones</th></tr>`;

  if (!state.filteredItems.length) {
    dom.tableBody.innerHTML = `<tr><td class="empty" colspan="${config.columns.length + 1}">No hay resultados para mostrar.</td></tr>`;
    return;
  }

  dom.tableBody.innerHTML = '';
  state.filteredItems.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = config.columns.map(col => {
      const value = getNestedValue(item, col.key);
      return `<td>${formatCell(value, col.format, col.key)}</td>`;
    }).join('') + `
      <td>
        <div class="actions">
          <button class="mini-btn" data-action="detail" data-id="${item.id}">Ver</button>
          <button class="mini-btn" data-action="edit" data-id="${item.id}">Editar</button>
          <button class="mini-btn danger-btn" data-action="delete" data-id="${item.id}">Eliminar</button>
        </div>
      </td>
    `;
    dom.tableBody.appendChild(row);
  });
}

function formatCell(value, format, key) {
  if (key === 'company.name') return wrapText(formatValue(value));
  if (Array.isArray(value)) return `<span class="pill soft">${value.length} items</span>`;
  if (typeof value === 'object' && value) return `<span class="pill soft">Información</span>`;
  return wrapText(formatValue(value, format));
}

function wrapText(value) {
  return `<span class="text-ellipsis" title="${escapeHtml(String(value))}">${escapeHtml(textEllipsis(value, 46))}</span>`;
}

function openFormModal(item = null) {
  state.editingItem = item;
  dom.modalTitle.textContent = item ? 'Editar registro' : 'Nuevo registro';
  const config = RESOURCE_CONFIG[state.currentResource];
  dom.entityForm.innerHTML = '';

  config.formFields.forEach(field => {
    const wrap = createElement('div', { className: `field ${field.full ? 'full' : ''}` });
    const label = createElement('label', { text: field.label });
    label.htmlFor = field.key;

    let input;
    if (field.type === 'textarea') {
      input = createElement('textarea');
    } else {
      input = createElement('input');
      input.type = field.type || 'text';
      if (field.step) input.step = field.step;
    }

    input.id = field.key;
    input.name = field.key;
    if (field.required) input.required = true;

    let value = '';
    if (item) {
      if (field.key === 'tagsText') value = (item.tags || []).join(', ');
      else if (field.key === 'productsText') value = formatProductsForForm(item.products || []);
      else value = getNestedValue(item, field.key) ?? '';
    }
    input.value = value;

    wrap.append(label, input);
    dom.entityForm.appendChild(wrap);
  });

  const actions = createElement('div', { className: 'form-actions' });
  actions.innerHTML = `
    <button type="button" class="ghost-btn" id="cancelFormBtn">Cancelar</button>
    <button type="submit" class="primary-btn">${item ? 'Guardar cambios' : 'Crear registro'}</button>
  `;
  dom.entityForm.appendChild(actions);
  qs('#cancelFormBtn').addEventListener('click', closeFormModal);
  dom.formModal.classList.remove('hidden');
}

function closeFormModal() {
  dom.formModal.classList.add('hidden');
  state.editingItem = null;
}

function openDetailModal(item) {
  dom.detailTitle.textContent = buildItemTitle(item);
  dom.detailContent.innerHTML = buildDetailHtml(item);
  dom.detailModal.classList.remove('hidden');
}

function closeDetailModal() {
  dom.detailModal.classList.add('hidden');
}

function buildItemTitle(item) {
  const resource = state.currentResource;
  if (resource === 'products') return item.title || `Producto #${item.id}`;
  if (resource === 'users') return `${item.firstName || ''} ${item.lastName || ''}`.trim() || `Usuario #${item.id}`;
  if (resource === 'posts') return item.title || `Post #${item.id}`;
  return `Carrito #${item.id}`;
}

function buildDetailHtml(item) {
  if (state.currentResource === 'products') return buildProductDetail(item);
  if (state.currentResource === 'users') return buildUserDetail(item);
  if (state.currentResource === 'posts') return buildPostDetail(item);
  return buildCartDetail(item);
}


function renderSafeImageBlock(url, alt, heading) {
  if (!url) return '';
  const safeUrl = escapeHtml(String(url));
  const safeAlt = escapeHtml(String(alt || 'Imagen'));
  const safeHeading = escapeHtml(String(heading || 'Imagen'));
  return `
    <section class="image-preview">
      <h4>${safeHeading}</h4>
      <img
        src="${safeUrl}"
        alt="${safeAlt}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
      >
      <p class="image-status" style="display:none;">Imagen no disponible</p>
    </section>
  `;
}

function buildDetailCards(fields, item) {
  return fields.map(field => `
    <article class="detail-card">
      <span class="detail-label">${field.label}</span>
      <div class="detail-value">${escapeHtml(formatValue(getNestedValue(item, field.key), field.format))}</div>
    </article>
  `).join('');
}

function buildProductDetail(item) {
  const fields = [
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descripción' },
    { key: 'category', label: 'Categoría' },
    { key: 'brand', label: 'Marca' },
    { key: 'price', label: 'Precio', format: 'currency' },
    { key: 'stock', label: 'Stock' },
    { key: 'rating', label: 'Calificación' },
    { key: 'availabilityStatus', label: 'Disponibilidad' },
    { key: 'id', label: 'Código' }
  ];

  const imageBlock = renderSafeImageBlock(item.thumbnail, item.title || 'Producto', 'Imagen');

  return `
    <section class="detail-grid">${buildDetailCards(fields, item)}</section>
    ${imageBlock}
  `;
}

function buildUserDetail(item) {
  const mainFields = [
    { key: 'firstName', label: 'Nombre' },
    { key: 'lastName', label: 'Apellido' },
    { key: 'username', label: 'Usuario' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'age', label: 'Edad' },
    { key: 'gender', label: 'Género' },
    { key: 'bloodGroup', label: 'Grupo sanguíneo' }
  ];

  const companyFields = [
    { key: 'company.name', label: 'Empresa' },
    { key: 'address.city', label: 'Ciudad' },
    { key: 'address.country', label: 'País' },
    { key: 'id', label: 'Código' }
  ];

  const imageBlock = renderSafeImageBlock(item.image, item.firstName || 'Usuario', 'Foto');

  return `
    <section class="detail-grid">${buildDetailCards(mainFields, item)}</section>
    <section class="detail-section">
      <h4>Información adicional</h4>
      <div class="detail-grid">${buildDetailCards(companyFields, item)}</div>
    </section>
    ${imageBlock}
  `;
}

function buildPostDetail(item) {
  const fields = [
    { key: 'title', label: 'Título' },
    { key: 'body', label: 'Contenido' },
    { key: 'userId', label: 'Usuario' },
    { key: 'views', label: 'Vistas' },
    { key: 'reactions.likes', label: 'Me gusta' },
    { key: 'reactions.dislikes', label: 'No me gusta' },
    { key: 'id', label: 'Código' }
  ];

  const tags = (item.tags || []).map(tag => `<span class="pill">${escapeHtml(tag)}</span>`).join('');

  return `
    <section class="detail-grid">${buildDetailCards(fields, item)}</section>
    <section class="detail-section">
      <h4>Tags</h4>
      <div class="chips">${tags || '<span class="muted">Sin tags</span>'}</div>
    </section>
  `;
}

function buildCartDetail(item) {
  const fields = [
    { key: 'id', label: 'Código' },
    { key: 'userId', label: 'Usuario' },
    { key: 'totalProducts', label: 'Productos' },
    { key: 'totalQuantity', label: 'Cantidad total' },
    { key: 'total', label: 'Total', format: 'currency' },
    { key: 'discountedTotal', label: 'Con descuento', format: 'currency' }
  ];

  const products = (item.products || []).map(product => `
    <article class="product-mini-card">
      <div class="top-line">
        <strong>${escapeHtml(product.title || `Producto ${product.id || ''}`)}</strong>
        <span class="pill soft">ID ${escapeHtml(product.id ?? '—')}</span>
      </div>
      <div class="detail-grid">
        <div class="detail-card"><span class="detail-label">Cantidad</span><div class="detail-value">${escapeHtml(product.quantity ?? '—')}</div></div>
        <div class="detail-card"><span class="detail-label">Precio</span><div class="detail-value">${escapeHtml(formatValue(product.price, 'currency'))}</div></div>
        <div class="detail-card"><span class="detail-label">Total</span><div class="detail-value">${escapeHtml(formatValue(product.total, 'currency'))}</div></div>
        <div class="detail-card"><span class="detail-label">Descuento</span><div class="detail-value">${escapeHtml(formatValue(product.discountedTotal, 'currency'))}</div></div>
      </div>
    </article>
  `).join('');

  return `
    <section class="detail-grid">${buildDetailCards(fields, item)}</section>
    <section class="detail-section">
      <h4>Productos del carrito</h4>
      <div class="product-list">${products || '<p class="muted">No hay productos agregados.</p>'}</div>
    </section>
  `;
}

function beautifyKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());
}

function getNextAvailableId(items) {
  const ids = items
    .map(item => Number(item.id))
    .filter(Number.isInteger)
    .sort((a, b) => a - b);

  let expected = 1;
  for (const id of ids) {
    if (id > expected) return expected;
    if (id === expected) expected += 1;
  }
  return expected;
}

function getNextCartProductId(products = []) {
  const ids = products
    .map(product => Number(product.id))
    .filter(Number.isInteger)
    .sort((a, b) => a - b);

  let expected = 1;
  for (const id of ids) {
    if (id > expected) return expected;
    if (id === expected) expected += 1;
  }
  return expected;
}

function formatProductsForForm(products) {
  return products.map(product => product.title || `Producto ${product.id}`).join(', ');
}

function getPayloadFromForm() {
  const config = RESOURCE_CONFIG[state.currentResource];
  const payload = state.editingItem ? structuredClone(state.editingItem) : {};

  config.formFields.forEach(field => {
    const rawValue = qs(`#${CSS.escape(field.key)}`).value.trim();

    if (field.key === 'tagsText') {
      payload.tags = rawValue ? rawValue.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      return;
    }

    if (field.key === 'productsText') {
      if (!rawValue) {
        payload.products = [];
        return;
      }

      try {
        const parsed = JSON.parse(rawValue);
        payload.products = Array.isArray(parsed) ? parsed : [];
      } catch {
        let nextId = getNextCartProductId(payload.products || []);
        payload.products = rawValue
          .split(',')
          .map(title => title.trim())
          .filter(Boolean)
          .map(title => ({
            id: nextId++,
            title,
            price: 0,
            quantity: 1,
            total: 0,
            discountedTotal: 0
          }));
      }
      return;
    }

    const finalValue = normalizeValue(rawValue, field.type);
    setNestedValue(payload, field.key, finalValue);
  });

  if (state.currentResource === 'posts' && !payload.reactions) payload.reactions = { likes: 0, dislikes: 0 };
  if (state.currentResource === 'users' && !payload.company) payload.company = { name: '' };
  if (state.currentResource === 'users' && !payload.address) payload.address = { city: '', country: '' };

  return payload;
}

function normalizeValue(value, type) {
  if (type === 'number') return value === '' ? 0 : Number(value);
  return value;
}

async function loadResource() {
  try {
    const data = await getItems(state.currentResource);
    state.items = Array.isArray(data) ? data : [];
    updateFilterValues();
    applyFilters();
  } catch (error) {
    showToast(`Error cargando datos: ${error.message}`);
  }
}

async function switchResource(resource) {
  state.currentResource = resource;
  dom.searchInput.value = '';
  dom.filterSelect.value = '';
  dom.filterValue.value = '';
  buildMenu();
  buildFilters();
  await loadResource();
}

async function handleFormSubmit(event) {
  event.preventDefault();
  try {
    const payload = getPayloadFromForm();
    if (state.editingItem) {
      await updateItem(state.currentResource, state.editingItem.id, payload);
      showToast('Registro actualizado');
    } else {
      const created = await createItem(state.currentResource, payload);
      showToast(`Registro creado con ID ${created.id}`);
    }
    closeFormModal();
    await loadResource();
  } catch (error) {
    showToast(`No se pudo guardar: ${error.message}`);
  }
}

async function handleTableClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = state.items.find(entry => String(entry.id) === button.dataset.id);
  if (!item) return;

  const action = button.dataset.action;
  if (action === 'detail') return openDetailModal(item);
  if (action === 'edit') return openFormModal(item);
  if (action === 'delete') {
    const ok = window.confirm('¿Seguro que quieres eliminar este registro?');
    if (!ok) return;
    try {
      await deleteItem(state.currentResource, item.id);
      showToast('Registro eliminado');
      await loadResource();
    } catch (error) {
      showToast(`No se pudo eliminar: ${error.message}`);
    }
  }
}

function bindEvents() {
  dom.searchInput.addEventListener('input', applyFilters);
  dom.filterSelect.addEventListener('change', () => {
    updateFilterValues();
    applyFilters();
  });
  dom.filterValue.addEventListener('change', applyFilters);
  dom.refreshBtn.addEventListener('click', loadResource);
  dom.newBtn.addEventListener('click', () => openFormModal());
  dom.closeFormModal.addEventListener('click', closeFormModal);
  dom.closeDetailModal.addEventListener('click', closeDetailModal);
  dom.entityForm.addEventListener('submit', handleFormSubmit);
  dom.tableBody.addEventListener('click', handleTableClick);
  dom.formModal.addEventListener('click', event => {
    if (event.target === dom.formModal) closeFormModal();
  });
  dom.detailModal.addEventListener('click', event => {
    if (event.target === dom.detailModal) closeDetailModal();
  });
}

async function init() {
  buildMenu();
  buildFilters();
  bindEvents();
  await loadResource();
}

init();
