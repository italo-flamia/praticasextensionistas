const inserirViagem = async (conexao, titulo_viagem) => {
	const resultado = await conexao.query(
		'INSERT INTO viagens (titulo_viagem) VALUES ($1) RETURNING *',
		[titulo_viagem],
	)
	return resultado.rows[0]
}

const listarViagensPorUsuario = async (conexao, id_usuario) => {
	const resultado = await conexao.query(
		'SELECT v.id_viagem, v.titulo_viagem, v.status, p.id_participante, p.funcao_participante, p.id_usuario FROM viagens v JOIN participantes p ON p.id_viagem = v.id_viagem WHERE p.id_usuario = $1;',
		[id_usuario],
	)
	return resultado.rows
}

const atualizarViagem = async (conexao, id_viagem, titulo_viagem, status) => {
	const resultado = await conexao.query(
		'UPDATE viagens SET titulo_viagem = COALESCE($1, titulo_viagem), status = COALESCE($2, status) WHERE id_viagem = $3 RETURNING *',
		[titulo_viagem || null, status || null, id_viagem],
	)
	return resultado.rows[0]
}

const deletarViagemPorId = async (conexao, id_viagem) => {
	await conexao.query(
		`DELETE FROM votos
		 WHERE id_opcao IN (
			SELECT o.id_opcao
			FROM opcoes o
			INNER JOIN votacoes vt ON vt.id_votacao = o.id_votacao
			WHERE vt.id_viagem = $1
		 )`,
		[id_viagem],
	)
	await conexao.query(
		`DELETE FROM opcoes
		 WHERE id_votacao IN (
			SELECT id_votacao
			FROM votacoes
			WHERE id_viagem = $1
		 )`,
		[id_viagem],
	)
	await conexao.query('DELETE FROM votacoes WHERE id_viagem = $1', [id_viagem])
	await conexao.query('DELETE FROM despesas WHERE id_viagem = $1', [id_viagem])
	await conexao.query('DELETE FROM participantes WHERE id_viagem = $1', [id_viagem])

	const resultado = await conexao.query(
		'DELETE FROM viagens WHERE id_viagem = $1 RETURNING *',
		[id_viagem],
	)
	return resultado.rows[0]
}

module.exports = { inserirViagem, listarViagensPorUsuario, atualizarViagem, deletarViagemPorId }
