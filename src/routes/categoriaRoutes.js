const express = require('express');
const categoriaService = require('../services/categoriaService');
const pratoService = require('../services/pratoService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await categoriaService.listar());
  } catch (erro) { next(erro); }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await categoriaService.buscar(req.params.id));
  } catch (erro) { next(erro); }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await categoriaService.criar(req.body));
  } catch (erro) { next(erro); }
});

router.put('/:id', async (req, res, next) => {
  try {
    res.json(await categoriaService.atualizar(req.params.id, req.body));
  } catch (erro) { next(erro); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await categoriaService.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) { next(erro); }
});

router.get('/:id/pratos', async (req, res, next) => {
  try {
    res.json(await pratoService.listarPorCategoria(req.params.id));
  } catch (erro) { next(erro); }
});

router.post('/:id/pratos', async (req, res, next) => {
  try {
    res.status(201).json(await pratoService.criar(req.params.id, req.body));
  } catch (erro) { next(erro); }
});

module.exports = router;