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
    data_despesa: dadosDespesa.data_despesa,
    id_registrado_por: participante.id_participante,
    id_pagador: dadosDespesa.id_pagador || participante.id_participante,
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

async function editarDespesa(id_usuario, id_viagem, id_despesa, dadosDespesa) {
  const participante = await participantesRepository.buscarParticipante(pool, id_usuario, id_viagem);

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem');
  }

  return despesasRepository.atualizarDespesa(pool, id_viagem, id_despesa, {
    descricao_despesa: dadosDespesa.descricao_despesa,
    categoria_despesa: dadosDespesa.categoria_despesa,
    valor_despesa: dadosDespesa.valor_despesa,
    data_despesa: dadosDespesa.data_despesa,
    id_pagador: dadosDespesa.id_pagador || participante.id_participante,
  });
}

async function gerarResumoFinanceiro(id_usuario, id_viagem) {
  const participante = await participantesRepository.buscarParticipante(pool, id_usuario, id_viagem);

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem');
  }

  const participantes = await despesasRepository.buscarResumoFinanceiro(pool, id_viagem);
  const totalEmCentavos = participantes.reduce((soma, participanteAtual) => {
    return soma + Math.round(Number(participanteAtual.total_pago) * 100);
  }, 0);
  const mediaEmCentavos = participantes.length > 0 ? totalEmCentavos / participantes.length : 0;

  return participantes.map((participanteAtual) => ({
    nome_usuario: participanteAtual.nome_usuario,
    total_pago: Number(participanteAtual.total_pago),
    diferenca: Number(((Math.round(Number(participanteAtual.total_pago) * 100) - mediaEmCentavos) / 100).toFixed(2)),
  }));
}

module.exports = { criarDespesa, listarDespesas, editarDespesa, gerarResumoFinanceiro };
