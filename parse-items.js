const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'click-here (1).txt');
const outputPath = path.join(__dirname, 'items.json');

try {
  console.log('Reading click-here (1).txt...');
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at: ${inputPath}`);
    process.exit(1);
  }
  
  const data = fs.readFileSync(inputPath, 'utf8');
  const lines = data.split(/\r?\n/);
  const items = {};
  
  console.log(`Processing ${lines.length} lines...`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      console.warn(`Line ${i + 1} does not contain a colon: "${line}"`);
      continue;
    }
    
    const idStr = line.substring(0, colonIndex).trim();
    const name = line.substring(colonIndex + 1).trim();
    
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      console.warn(`Line ${i + 1} has an invalid ID: "${idStr}"`);
      continue;
    }
    
    items[idStr] = {
      name: name,
      image: `https://cdn.example.com/items/${idStr}.png`
    };
  }
  
  console.log(`Successfully parsed ${Object.keys(items).length} items.`);
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf8');
  console.log('Saved items.json.');
} catch (error) {
  console.error('Error parsing items:', error);
  process.exit(1);
}
