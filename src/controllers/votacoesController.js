const votacoesService = require('../services/votacoesService')

async function listarVotacoesController(req, res) {
  try {
    const { id_viagem } = req.params
    const votacoes = await votacoesService.listarVotacoes(req.usuario.id, id_viagem)
    res.status(200).json(votacoes)
  } catch (erro) {
    if (erro.message.includes('participante')) {
      return res.status(403).json({ erro: erro.message })
    }
    res.status(400).json({ erro: erro.message })
  }
}

async function criarVotacaoController(req, res) {
  try {
    const { id_viagem } = req.params
    const votacao = await votacoesService.criarVotacao(req.usuario.id, id_viagem, req.body)
    res.status(201).json(votacao)
  } catch (erro) {
    if (erro.message.includes('participante')) {
      return res.status(403).json({ erro: erro.message })
    }
    res.status(400).json({ erro: erro.message })
  }
}

module.exports = { listarVotacoesController, criarVotacaoController }
