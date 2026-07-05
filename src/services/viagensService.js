const pool = require('../config/db.js')
const {
	inserirViagem,
	listarViagensPorUsuario,
	atualizarViagem,
	deletarViagemPorId,
} = require('../repositories/viagensRepository.js')
const { inserirParticipante, buscarParticipante } = require('../repositories/participantesRepository.js')

const criarViagem = async (titulo_viagem, id_usuario) => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		const novaViagem = await inserirViagem(client, titulo_viagem)
		await inserirParticipante(client, id_usuario, novaViagem.id_viagem, 'Organizador')
		await client.query('COMMIT')
		return novaViagem
	}
	catch (erro) {
		await client.query('ROLLBACK')
		throw erro
	}
	finally {
		client.release()
	}
}

const listarViagens = async (id_usuario) => {
	const viagens = await listarViagensPorUsuario(pool, id_usuario)
	return viagens
}

const editarViagem = async (id_viagem, titulo_viagem, status, id_usuario) => {
	const participante = await buscarParticipante(pool, id_usuario, id_viagem)

	if (!participante) {
		throw new Error('Você não participa dessa viagem')
	}
	if (participante.funcao_participante !== 'Organizador') {
		throw new Error('Só o organizador pode editar a viagem')
	}

	const viagemAtualizada = await atualizarViagem(pool, id_viagem, titulo_viagem, status)
	return viagemAtualizada
}

const deletarViagem = async (id_viagem, id_usuario) => {
	const participante = await buscarParticipante(pool, id_usuario, id_viagem)

	if (!participante) {
		throw new Error('Você não participa dessa viagem')
	}
	if (participante.funcao_participante !== 'Organizador') {
		throw new Error('Só o organizador pode deletar a viagem')
	}

	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		const viagemDeletada = await deletarViagemPorId(client, id_viagem)
		await client.query('COMMIT')
		return viagemDeletada
	}
	catch (erro) {
		await client.query('ROLLBACK')
		throw erro
	}
	finally {
		client.release()
	}
}

module.exports = { criarViagem, listarViagens, editarViagem, deletarViagem }
