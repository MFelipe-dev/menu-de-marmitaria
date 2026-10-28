const express = require('express');
const pratoService = require('../services/pratoService');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await pratoService.buscar(req.params.id));
  } catch (erro) { next(erro); }
});

router.put('/:id', async (req, res, next) => {
  try {
    res.json(await pratoService.atualizar(req.params.id, req.body));
  } catch (erro) { next(erro); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await pratoService.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) { next(erro); }
});

module.exports = router;