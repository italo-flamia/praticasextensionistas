const pool = require('../config/db')
const { buscarParticipante } = require('../repositories/participantesRepository')
const {
  inserirVotacao,
  inserirOpcao,
  listarVotacoesPorViagem,
} = require('../repositories/votacoesRepository')

function agruparVotacoes(linhas) {
  const mapa = new Map()

  for (const linha of linhas) {
    if (!mapa.has(linha.id_votacao)) {
      mapa.set(linha.id_votacao, {
        id_votacao: linha.id_votacao,
        id_viagem: linha.id_viagem,
        tipo_votacao: linha.tipo_votacao,
        permite_multipla: linha.permite_multipla,
        prazo_votacao: linha.prazo_votacao,
        votacao_encerrada_em: linha.votacao_encerrada_em,
        opcoes: [],
      })
    }

    if (linha.id_opcao) {
      mapa.get(linha.id_votacao).opcoes.push({
        id_opcao: linha.id_opcao,
        descricao_opcao: linha.descricao_opcao,
        opcao_vencedora: linha.opcao_vencedora,
      })
    }
  }

  return Array.from(mapa.values())
}

async function listarVotacoes(id_usuario, id_viagem) {
  const participante = await buscarParticipante(pool, id_usuario, id_viagem)

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem')
  }

  return agruparVotacoes(await listarVotacoesPorViagem(pool, id_viagem))
}

async function criarVotacao(id_usuario, id_viagem, dados) {
  const participante = await buscarParticipante(pool, id_usuario, id_viagem)

  if (!participante) {
    throw new Error('Usuário não é participante desta viagem')
  }

  const opcoes = Array.isArray(dados.opcoes)
    ? dados.opcoes.map((item) => String(item).trim()).filter(Boolean)
    : []

  if (!dados.tipo_votacao || !dados.prazo_votacao || opcoes.length < 2) {
    throw new Error('Informe tipo, prazo e pelo menos duas opções')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const votacao = await inserirVotacao(client, {
      id_viagem,
      tipo_votacao: dados.tipo_votacao,
      permite_multipla: Boolean(dados.permite_multipla),
      prazo_votacao: dados.prazo_votacao,
    })

    const opcoesCriadas = []
    for (const descricao_opcao of opcoes) {
      opcoesCriadas.push(await inserirOpcao(client, { id_votacao: votacao.id_votacao, descricao_opcao }))
    }

    await client.query('COMMIT')
    return { ...votacao, opcoes: opcoesCriadas }
  } catch (erro) {
    await client.query('ROLLBACK')
    throw erro
  } finally {
    client.release()
  }
}

module.exports = { listarVotacoes, criarVotacao }
