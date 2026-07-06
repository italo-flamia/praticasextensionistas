async function inserirVotacao(conexao, { id_viagem, tipo_votacao, permite_multipla, prazo_votacao }) {
  const resultado = await conexao.query(
    `INSERT INTO votacoes (id_viagem, tipo_votacao, permite_multipla, prazo_votacao)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id_viagem, tipo_votacao, permite_multipla, prazo_votacao],
  )

  return resultado.rows[0]
}

async function inserirOpcao(conexao, { id_votacao, descricao_opcao }) {
  const resultado = await conexao.query(
    `INSERT INTO opcoes (id_votacao, descricao_opcao)
     VALUES ($1, $2)
     RETURNING *`,
    [id_votacao, descricao_opcao],
  )

  return resultado.rows[0]
}

async function listarVotacoesPorViagem(conexao, id_viagem) {
  const resultado = await conexao.query(
    `SELECT v.id_votacao, v.id_viagem, v.tipo_votacao, v.permite_multipla, v.prazo_votacao,
            v.votacao_encerrada_em, o.id_opcao, o.descricao_opcao, o.opcao_vencedora
       FROM votacoes v
       LEFT JOIN opcoes o ON o.id_votacao = v.id_votacao
      WHERE v.id_viagem = $1
      ORDER BY v.prazo_votacao ASC, o.id_opcao ASC`,
    [id_viagem],
  )

  return resultado.rows
}

module.exports = { inserirVotacao, inserirOpcao, listarVotacoesPorViagem }
