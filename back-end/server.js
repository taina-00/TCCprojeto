
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();

// Configuração básica
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../front-end')); // Serve arquivos estáticos

// Rotas básicas de exemplo
app.get('/api/itens', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM itens');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});