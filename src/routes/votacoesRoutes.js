const express = require('express')
const router = express.Router({ mergeParams: true })
const autenticarToken = require('../middlewares/authMiddleware')
const {
  listarVotacoesController,
  criarVotacaoController,
} = require('../controllers/votacoesController')

router.get('/', autenticarToken, listarVotacoesController)
router.post('/', autenticarToken, criarVotacaoController)

module.exports = router
