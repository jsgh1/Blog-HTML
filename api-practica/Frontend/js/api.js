import { API_URL, RESOURCE_CONFIG } from './config.js';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    let message = 'Ocurrió un error';
    try {
      const errorData = await response.json();
      message = errorData.message || JSON.stringify(errorData);
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getItems(resource) {
  const endpoint = RESOURCE_CONFIG[resource].endpoint;
  return request(`${API_URL}/${endpoint}`);
}

export async function createItem(resource, payload) {
  const endpoint = RESOURCE_CONFIG[resource].endpoint;
  return request(`${API_URL}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateItem(resource, id, payload) {
  const endpoint = RESOURCE_CONFIG[resource].endpoint;
  return request(`${API_URL}/${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deleteItem(resource, id) {
  const endpoint = RESOURCE_CONFIG[resource].endpoint;
  return request(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
}
