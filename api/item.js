const fs = require('fs');
const path = require('path');

// Load and parse items.json only ONCE during cold start (in-memory caching)
const filePath = path.join(process.cwd(), 'items.json');
let items = {};

try {
  console.log('Loading Growtopia items database into memory...');
  items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Database loaded. Total items: ${Object.keys(items).length}`);
} catch (error) {
  console.error('Error loading items database:', error);
}

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  const item = items[id];

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Response JSON format:
  // {
  //   "id": 18,
  //   "name": "Fist",
  //   "image": "https://cdn.example.com/items/18.png"
  // }
  return res.status(200).json({
    id: parseInt(id, 10) || id,
    name: item.name,
    image: item.image
  });
};
