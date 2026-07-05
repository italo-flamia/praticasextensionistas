const pool = require('../config/db')
const { buscarPorEmail } = require('../repositories/authRepository')
const {
  buscarParticipante,
  inserirParticipante,
  listarParticipantesPorViagem,
} = require('../repositories/participantesRepository')

async function listarParticipantes(id_usuario, id_viagem) {
  const participante = await buscarParticipante(pool, id_usuario, id_viagem)

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem')
  }

  return listarParticipantesPorViagem(pool, id_viagem)
}

async function adicionarParticipante(id_usuario, id_viagem, { email_usuario, funcao_participante }) {
  const participanteSolicitante = await buscarParticipante(pool, id_usuario, id_viagem)

  if (!participanteSolicitante) {
    throw new Error('Usuário não é participante desta viagem')
  }
  if (participanteSolicitante.funcao_participante !== 'Organizador') {
    throw new Error('Só o organizador pode adicionar participantes')
  }

  if (!email_usuario) {
    throw new Error('Informe o email do participante')
  }

  const usuario = await buscarPorEmail(email_usuario)
  if (!usuario) {
    throw new Error('Usuário com esse email não foi encontrado')
  }

  const participanteExistente = await buscarParticipante(pool, usuario.id_usuario, id_viagem)
  if (participanteExistente) {
    throw new Error('Esse usuário já participa da viagem')
  }

  return inserirParticipante(pool, usuario.id_usuario, id_viagem, funcao_participante || 'Participante')
}

module.exports = { listarParticipantes, adicionarParticipante }
