export const API_URL = 'http://localhost:3000';

export const RESOURCE_CONFIG = {
  products: {
    label: 'Productos',
    endpoint: 'products',
    searchFields: ['title', 'description', 'brand', 'category'],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Título' },
      { key: 'category', label: 'Categoría' },
      { key: 'brand', label: 'Marca' },
      { key: 'price', label: 'Precio', format: 'currency' },
      { key: 'stock', label: 'Stock' }
    ],
    filterFields: [
      { key: 'category', label: 'Categoría' },
      { key: 'brand', label: 'Marca' },
      { key: 'availabilityStatus', label: 'Disponibilidad' }
    ],
    formFields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea', required: true, full: true },
      { key: 'category', label: 'Categoría', type: 'text', required: true },
      { key: 'brand', label: 'Marca', type: 'text', required: true },
      { key: 'price', label: 'Precio', type: 'number', required: true, step: '0.01' },
      { key: 'stock', label: 'Stock', type: 'number', required: true },
      { key: 'rating', label: 'Rating', type: 'number', step: '0.1' },
      { key: 'availabilityStatus', label: 'Disponibilidad', type: 'text' },
      { key: 'thumbnail', label: 'URL imagen', type: 'text', full: true }
    ]
  },
  users: {
    label: 'Usuarios',
    endpoint: 'users',
    searchFields: ['firstName', 'lastName', 'email', 'username', 'company.name'],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'firstName', label: 'Nombre' },
      { key: 'lastName', label: 'Apellido' },
      { key: 'email', label: 'Correo' },
      { key: 'phone', label: 'Teléfono' },
      { key: 'company.name', label: 'Empresa' }
    ],
    filterFields: [
      { key: 'gender', label: 'Género' },
      { key: 'bloodGroup', label: 'Grupo sanguíneo' },
      { key: 'company.name', label: 'Empresa' }
    ],
    formFields: [
      { key: 'firstName', label: 'Nombre', type: 'text', required: true },
      { key: 'lastName', label: 'Apellido', type: 'text', required: true },
      { key: 'age', label: 'Edad', type: 'number' },
      { key: 'gender', label: 'Género', type: 'text' },
      { key: 'email', label: 'Correo', type: 'email', required: true },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'username', label: 'Usuario', type: 'text', required: true },
      { key: 'bloodGroup', label: 'Grupo sanguíneo', type: 'text' },
      { key: 'company.name', label: 'Empresa', type: 'text' },
      { key: 'address.city', label: 'Ciudad', type: 'text' },
      { key: 'address.country', label: 'País', type: 'text' },
      { key: 'image', label: 'Foto URL', type: 'text', full: true }
    ]
  },
  posts: {
    label: 'Posts',
    endpoint: 'posts',
    searchFields: ['title', 'body'],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Título' },
      { key: 'userId', label: 'Usuario ID' },
      { key: 'views', label: 'Vistas' },
      { key: 'reactions.likes', label: 'Likes' },
      { key: 'reactions.dislikes', label: 'Dislikes' }
    ],
    filterFields: [
      { key: 'userId', label: 'Usuario ID' },
      { key: 'tags', label: 'Tag' }
    ],
    formFields: [
      { key: 'title', label: 'Título', type: 'text', required: true, full: true },
      { key: 'body', label: 'Contenido', type: 'textarea', required: true, full: true },
      { key: 'userId', label: 'Usuario ID', type: 'number', required: true },
      { key: 'views', label: 'Vistas', type: 'number' },
      { key: 'reactions.likes', label: 'Likes', type: 'number' },
      { key: 'reactions.dislikes', label: 'Dislikes', type: 'number' },
      { key: 'tagsText', label: 'Tags (separados por coma)', type: 'text', full: true }
    ]
  },
  carts: {
    label: 'Carritos',
    endpoint: 'carts',
    searchFields: ['userId', 'id'],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'userId', label: 'Usuario ID' },
      { key: 'totalProducts', label: 'Productos' },
      { key: 'totalQuantity', label: 'Cantidad' },
      { key: 'total', label: 'Total', format: 'currency' },
      { key: 'discountedTotal', label: 'Con descuento', format: 'currency' }
    ],
    filterFields: [
      { key: 'userId', label: 'Usuario ID' },
      { key: 'totalProducts', label: 'Total productos' }
    ],
    formFields: [
      { key: 'userId', label: 'Usuario ID', type: 'number', required: true },
      { key: 'totalProducts', label: 'Total productos', type: 'number', required: true },
      { key: 'totalQuantity', label: 'Cantidad total', type: 'number', required: true },
      { key: 'total', label: 'Total', type: 'number', required: true, step: '0.01' },
      { key: 'discountedTotal', label: 'Total con descuento', type: 'number', step: '0.01' },
      { key: 'productsText', label: 'Productos (JSON o títulos separados por coma)', type: 'textarea', full: true }
    ]
  }
};
