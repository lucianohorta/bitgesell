const express = require('express');
const cors = require('cors');
const itemsRoutes = require('./routes/items');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/items', itemsRoutes);

module.exports = app;
