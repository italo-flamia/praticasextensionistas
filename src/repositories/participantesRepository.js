const inserirParticipante = async (conexao, id_usuario, id_viagem, funcao_participante) => {
	const resultado = await conexao.query('INSERT INTO participantes (id_usuario, id_viagem, funcao_participante) VALUES ($1, $2, $3) RETURNING *', [id_usuario, id_viagem, funcao_participante])
	return resultado.rows[0]
}

const buscarParticipante = async (conexao, id_usuario, id_viagem) => {
	const resultado = await conexao.query(
		'SELECT * FROM participantes WHERE id_usuario = $1 AND id_viagem = $2',
		[id_usuario, id_viagem]
	)
	return resultado.rows[0]
}

module.exports = { inserirParticipante, buscarParticipante }
