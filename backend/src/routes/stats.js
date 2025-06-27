const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { mean } = require('../utils/stats');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;

// Load and calculate stats
function calculateStats() {
  fs.promises.readFile(DATA_PATH, 'utf-8')
    .then(raw => {
      const items = JSON.parse(raw);
      cachedStats = {
        total: items.length,
        averagePrice: mean(items.map(item => item.price)),
        lastUpdated: new Date().toISOString()
      };
    })
    .catch(err => {
      console.error('Failed to load or parse items.json:', err.message);
    });
}

// Watch for file changes and recalculate when needed
fs.watchFile(DATA_PATH, { interval: 1000 }, calculateStats);

// Initial load
calculateStats();

// GET /api/stats
router.get('/', (req, res, next) => {
  if (!cachedStats) return res.status(503).json({ error: 'Stats not ready' });
  res.json(cachedStats);
});

module.exports = router;
