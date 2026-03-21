const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;
const DB_PATH = path.join(__dirname, '..', 'json', 'db.json');
const ALLOWED = new Set(['products', 'users', 'posts', 'carts']);

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function sendNoContent(res, status = 204) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end();
}

function sendText(res, status, text) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(text);
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

function normalizePayload(resource, payload, existingItem) {
  const next = existingItem ? { ...existingItem, ...payload } : { ...payload };

  if (resource === 'products') {
    next.price = Number(next.price || 0);
    next.stock = Number(next.stock || 0);
    next.rating = Number(next.rating || 0);
  }

  if (resource === 'users') {
    next.age = Number(next.age || 0);
    next.company = next.company || { name: '' };
    next.address = next.address || { city: '', country: '' };
  }

  if (resource === 'posts') {
    next.userId = Number(next.userId || 0);
    next.views = Number(next.views || 0);
    next.reactions = next.reactions || { likes: 0, dislikes: 0 };
    next.reactions.likes = Number(next.reactions.likes || 0);
    next.reactions.dislikes = Number(next.reactions.dislikes || 0);
    next.tags = Array.isArray(next.tags) ? next.tags : [];
  }

  if (resource === 'carts') {
    next.userId = Number(next.userId || 0);
    next.totalProducts = Number(next.totalProducts || 0);
    next.totalQuantity = Number(next.totalQuantity || 0);
    next.total = Number(next.total || 0);
    next.discountedTotal = Number(next.discountedTotal || 0);
    next.products = Array.isArray(next.products) ? next.products.map(product => ({
      ...product,
      id: Number(product.id || 0),
      price: Number(product.price || 0),
      quantity: Number(product.quantity || 0),
      total: Number(product.total || 0),
      discountedTotal: Number(product.discountedTotal || 0)
    })) : [];
  }

  return next;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.socket.destroy();
        reject(new Error('Solicitud demasiado grande'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendNoContent(res);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const segments = url.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return sendText(res, 200, 'API local activa en /products, /users, /posts y /carts');
  }

  const [resource, rawId] = segments;
  if (!ALLOWED.has(resource)) {
    return sendJson(res, 404, { message: 'Recurso no encontrado' });
  }

  const db = readDb();
  const collection = Array.isArray(db[resource]) ? db[resource] : [];

  try {
    if (req.method === 'GET' && !rawId) {
      return sendJson(res, 200, collection);
    }

    if (req.method === 'GET' && rawId) {
      const item = collection.find(entry => String(entry.id) === rawId);
      if (!item) return sendJson(res, 404, { message: 'Registro no encontrado' });
      return sendJson(res, 200, item);
    }

    if (req.method === 'POST' && !rawId) {
      const body = await parseBody(req);
      const item = normalizePayload(resource, body);
      item.id = getNextAvailableId(collection);
      collection.push(item);
      db[resource] = collection;
      writeDb(db);
      return sendJson(res, 201, item);
    }

    if (req.method === 'PUT' && rawId) {
      const index = collection.findIndex(entry => String(entry.id) === rawId);
      if (index === -1) return sendJson(res, 404, { message: 'Registro no encontrado' });
      const body = await parseBody(req);
      const current = collection[index];
      const nextItem = normalizePayload(resource, body, current);
      nextItem.id = current.id;
      collection[index] = nextItem;
      db[resource] = collection;
      writeDb(db);
      return sendJson(res, 200, nextItem);
    }

    if (req.method === 'DELETE' && rawId) {
      const index = collection.findIndex(entry => String(entry.id) === rawId);
      if (index === -1) return sendJson(res, 404, { message: 'Registro no encontrado' });
      const [removed] = collection.splice(index, 1);
      db[resource] = collection;
      writeDb(db);
      return sendJson(res, 200, removed);
    }

    return sendJson(res, 405, { message: 'Método no permitido' });
  } catch (error) {
    return sendJson(res, 400, { message: error.message || 'No se pudo procesar la solicitud' });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
