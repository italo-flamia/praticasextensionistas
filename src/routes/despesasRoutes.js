const express = require('express');
const router = express.Router({ mergeParams: true });
const autenticarToken = require('../middlewares/authMiddleware');
const {
  criarDespesaController,
  listarDespesasController,
  editarDespesaController,
  resumoFinanceiroController,
} = require('../controllers/despesasController');

router.post('/', autenticarToken, criarDespesaController);
router.get('/', autenticarToken, listarDespesasController);
router.put('/:id_despesa', autenticarToken, editarDespesaController);
router.get('/resumo', autenticarToken, resumoFinanceiroController);

module.exports = router;
