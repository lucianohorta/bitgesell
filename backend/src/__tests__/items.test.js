const request = require('supertest');
const express = require('express');
const itemsRoutes = require('../routes/items');
const fs = require('fs').promises;
const path = require('path');
const DATA_PATH = path.resolve(__dirname, '../../../data/items.json');

const app = express();
app.use(express.json());
app.use('/items', itemsRoutes);

describe('Items API', () => {
let originalData;

beforeAll(async () => {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    originalData = raw;
});

afterAll(async () => {
    await fs.writeFile(DATA_PATH, originalData); // restore
});

test('GET /items returns paginated items', async () => {
    const res = await request(app).get('/items?page=1&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('items');
});

test('GET /items supports search', async () => {
    const res = await request(app).get('/items?q=laptop');
    expect(res.statusCode).toBe(200);
    expect(res.body.items[0].name.toLowerCase()).toContain('laptop');
});

test('GET /items/:id returns a single item', async () => {
    const res = await request(app).get('/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
});

test('GET /items/:id returns 404 for invalid id', async () => {
    const res = await request(app).get('/items/999999');
    expect(res.statusCode).toBe(404);
});

test('POST /items creates new item', async () => {
    const newItem = {
    name: 'Test Item',
    category: 'Test',
    price: 123
    };

    const res = await request(app).post('/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Item');
});
});
