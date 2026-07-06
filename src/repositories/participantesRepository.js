const inserirParticipante = async (conexao, id_usuario, id_viagem, funcao_participante) => {
	const resultado = await conexao.query(
		'INSERT INTO participantes (id_usuario, id_viagem, funcao_participante) VALUES ($1, $2, $3) RETURNING *',
		[id_usuario, id_viagem, funcao_participante],
	)
	return resultado.rows[0]
}

const buscarParticipante = async (conexao, id_usuario, id_viagem) => {
	const resultado = await conexao.query(
		'SELECT * FROM participantes WHERE id_usuario = $1 AND id_viagem = $2',
		[id_usuario, id_viagem],
	)
	return resultado.rows[0]
}

const listarParticipantesPorViagem = async (conexao, id_viagem) => {
	const resultado = await conexao.query(
		`SELECT p.id_participante, p.id_usuario, p.id_viagem, p.funcao_participante,
		        u.nome_usuario, u.email_usuario
		   FROM participantes p
		   INNER JOIN usuarios u ON u.id_usuario = p.id_usuario
		  WHERE p.id_viagem = $1
		  ORDER BY u.nome_usuario ASC`,
		[id_viagem],
	)
	return resultado.rows
}

module.exports = { inserirParticipante, buscarParticipante, listarParticipantesPorViagem }
