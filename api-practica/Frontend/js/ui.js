export function qs(selector) {
  return document.querySelector(selector);
}

export function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text) el.textContent = options.text;
  if (options.html) el.innerHTML = options.html;
  return el;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatValue(value, format) {
  if (value === undefined || value === null || value === '') return '—';
  if (format === 'currency') {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
  }
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return 'Información disponible';
  return String(value);
}

export function textEllipsis(value, max = 48) {
  const text = String(value ?? '').trim();
  if (!text) return '—';
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

export function showToast(message) {
  const toast = createElement('div', { className: 'toast', text: message });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
