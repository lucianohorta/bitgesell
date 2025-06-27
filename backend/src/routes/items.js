const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit = 10, q = '', page = 1 } = req.query;

    const filtered = q
      ? data.filter(item =>
          item.name.toLowerCase().includes(q.toLowerCase())
        )
      : data;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    res.json({
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      items: filtered.slice(start, end),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id, 10));
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = await readData();
    const newItem = { ...req.body, id: Date.now() };
    data.push(newItem);
    await writeData(data);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
