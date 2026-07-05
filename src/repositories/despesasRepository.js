async function inserirDespesa(conexao, dadosDespesa) {
  const {
    id_viagem,
    descricao_despesa,
    categoria_despesa,
    valor_despesa,
    id_registrado_por,
    id_pagador
  } = dadosDespesa;

  const resultado = await conexao.query(
    `INSERT INTO despesas
      (id_viagem, descricao_despesa, categoria_despesa, valor_despesa, id_registrado_por, id_pagador)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id_viagem, descricao_despesa, categoria_despesa, valor_despesa, id_registrado_por, id_pagador]
  );

  return resultado.rows[0];
}

async function listarDespesasPorViagem(conexao, id_viagem) {
  const resultado = await conexao.query(
    `SELECT id_despesa, descricao_despesa, categoria_despesa, valor_despesa,
            data_despesa, id_registrado_por, id_pagador
     FROM despesas
     WHERE id_viagem = $1
     ORDER BY data_despesa DESC`,
    [id_viagem]
  );

  return resultado.rows;
}

async function buscarResumoFinanceiro(conexao, id_viagem) {
  const resultado = await conexao.query(
    `SELECT p.id_participante, u.nome_usuario,
       COALESCE(SUM(d.valor_despesa), 0) AS total_pago
     FROM participantes p
     JOIN usuarios u ON u.id_usuario = p.id_usuario
     LEFT JOIN despesas d ON d.id_pagador = p.id_participante AND d.id_viagem = p.id_viagem
     WHERE p.id_viagem = $1
     GROUP BY p.id_participante, u.nome_usuario`,
    [id_viagem]
  );

  return resultado.rows;
}

module.exports = { inserirDespesa, listarDespesasPorViagem, buscarResumoFinanceiro };
