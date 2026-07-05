const despesasRepository = require('../repositories/despesasRepository');
const participantesRepository = require('../repositories/participantesRepository');
const pool = require('../config/db');

async function criarDespesa(id_usuario, id_viagem, dadosDespesa) {
  const participante = await participantesRepository.buscarParticipante(pool, id_usuario, id_viagem);

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem');
  }

  const novaDespesa = await despesasRepository.inserirDespesa(pool, {
    id_viagem,
    descricao_despesa: dadosDespesa.descricao_despesa,
    categoria_despesa: dadosDespesa.categoria_despesa,
    valor_despesa: dadosDespesa.valor_despesa,
    id_registrado_por: participante.id_participante,
    id_pagador: dadosDespesa.id_pagador || participante.id_participante
  });

  return novaDespesa;
}

async function listarDespesas(id_usuario, id_viagem) {
  const participante = await participantesRepository.buscarParticipante(pool, id_usuario, id_viagem);

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem');
  }

  return despesasRepository.listarDespesasPorViagem(pool, id_viagem);
}

async function gerarResumoFinanceiro(id_usuario, id_viagem) {
  const participante = await participantesRepository.buscarParticipante(pool, id_usuario, id_viagem);

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem');
  }

  const participantes = await despesasRepository.buscarResumoFinanceiro(pool, id_viagem);
  const totalGeral = participantes.reduce((soma, p) => {
    return soma + Number(p.total_pago);
  }, 0);

  const media = totalGeral / participantes.length;


  const resumo = participantes.map((p) => {
  return {
  nome_usuario: p.nome_usuario,
  total_pago: p.total_pago,
  diferenca: Number(p.total_pago) - Number(media)
  };
  });

  return resumo;

}

module.exports = { criarDespesa, listarDespesas, gerarResumoFinanceiro };
