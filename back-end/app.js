const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api', apiRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API de Controle de Estoque');
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


module.exports = app;