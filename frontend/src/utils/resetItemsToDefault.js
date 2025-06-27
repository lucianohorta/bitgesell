// RESET ITEMS TO DEFAULT JSON
// run with:  node src/utils/resetItemsToDefault.js (inside frontend folder)

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/items.json');

const originalItems = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
    { id: 2, name: 'Noise Cancelling Headphones', category: 'Electronics', price: 399 },
    { id: 3, name: 'Ultra-Wide Monitor', category: 'Electronics', price: 999 },
    { id: 4, name: 'Ergonomic Chair', category: 'Furniture', price: 799 },
    { id: 5, name: 'Standing Desk', category: 'Furniture', price: 1199 }
];

fs.writeFileSync(filePath, JSON.stringify(originalItems, null, 2));
console.log('Original items restored!');
