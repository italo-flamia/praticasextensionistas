async function inserirContato(conexao, dados) {
  const { nome_contato, email_contato, mensagem_contato } = dados;

  const resultado = await conexao.query(
    `INSERT INTO contato
      (nome_contato, email_contato, mensagem_contato)
      VALUES ($1, $2, $3)
      RETURNING *`,
    [nome_contato, email_contato, mensagem_contato],
  );

  return resultado.rows[0];
}

module.exports = { inserirContato };
