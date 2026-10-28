require('dotenv').config();
const path = require('path');
const express = require('express');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pratoRoutes = require('./routes/pratoRoutes');
const tratadorDeErros = require('./middlewares/tratadorDeErros');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/categorias', categoriaRoutes);
app.use('/api/pratos', pratoRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use(tratadorDeErros);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});