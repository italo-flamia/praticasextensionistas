const express = require('express')
const router = express.Router({ mergeParams: true })
const autenticarToken = require('../middlewares/authMiddleware')
const {
  listarParticipantesController,
  adicionarParticipanteController,
} = require('../controllers/participantesController')

router.get('/', autenticarToken, listarParticipantesController)
router.post('/', autenticarToken, adicionarParticipanteController)

module.exports = router
