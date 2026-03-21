const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, '..', 'json');

function readJson(fileName) {
  const filePath = path.join(jsonDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const products = readJson('products.json');
const users = readJson('users.json');
const posts = readJson('posts.json');
const carts = readJson('carts.json');

const db = {
  products: products.products || products,
  users: users.users || users,
  posts: posts.posts || posts,
  carts: carts.carts || carts
};

fs.writeFileSync(
  path.join(jsonDir, 'db.json'),
  JSON.stringify(db, null, 2),
  'utf8'
);

console.log('db.json creado correctamente en Backend/json');
