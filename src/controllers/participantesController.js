const participantesService = require('../services/participantesService')

async function listarParticipantesController(req, res) {
  try {
    const { id_viagem } = req.params
    const participantes = await participantesService.listarParticipantes(req.usuario.id, id_viagem)
    res.status(200).json(participantes)
  } catch (erro) {
    if (erro.message.includes('participante')) {
      return res.status(403).json({ erro: erro.message })
    }
    res.status(400).json({ erro: erro.message })
  }
}

async function adicionarParticipanteController(req, res) {
  try {
    const { id_viagem } = req.params
    const participante = await participantesService.adicionarParticipante(req.usuario.id, id_viagem, req.body)
    res.status(201).json(participante)
  } catch (erro) {
    if (erro.message.includes('participante') || erro.message.includes('organizador')) {
      return res.status(403).json({ erro: erro.message })
    }
    res.status(400).json({ erro: erro.message })
  }
}

module.exports = { listarParticipantesController, adicionarParticipanteController }
