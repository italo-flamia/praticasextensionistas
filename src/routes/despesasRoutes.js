const express = require('express');
const router = express.Router({ mergeParams: true }); // necessário pra herdar :id_viagem da rota pai
const autenticarToken = require('../middlewares/authMiddleware');
const { criarDespesaController, listarDespesasController, resumoFinanceiroController } = require('../controllers/despesasController');

router.post('/', autenticarToken, criarDespesaController);
router.get('/', autenticarToken, listarDespesasController);
router.get('/resumo', autenticarToken, resumoFinanceiroController);

module.exports = router;
