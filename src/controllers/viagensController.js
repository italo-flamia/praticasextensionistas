const {criarViagem, listarViagens, editarViagem, deletarViagem} = require ('../services/viagensService.js')

const criarViagemController = async (req, res) => {
	try {
	const {titulo_viagem} = req.body
	const novaViagem = await criarViagem (titulo_viagem, req.usuario.id)
	res.status(201).json({ viagem: novaViagem})
	}
	catch (erro){
		res.status(400).json({ mensagem: erro.message})
	}
}

const listarViagensController = async (req, res) => {
	try {
	const minhasViagens = await listarViagens (req.usuario.id)
	res.status(200).json({ viagens: minhasViagens })
	}
	catch (erro){
		res.status(500).json({ mensagem: erro.message})
	}
}

const editarViagemController = async (req, res) => {
	try {
		const { id_viagem } = req.params
		const { titulo_viagem, status } = req.body
		const viagemAtualizada = await editarViagem(id_viagem, titulo_viagem, status, req.usuario.id)
		res.status(200).json({ viagem: viagemAtualizada })
	} catch (erro) {
		if (erro.message.includes('organizador') || erro.message.includes('participa')) {
			return res.status(403).json({ mensagem: erro.message })
		}
		res.status(500).json({ mensagem: erro.message })
	}
}

const deletarViagemController = async (req, res) => {
	try {
		const { id_viagem } = req.params
		const viagemDeletada = await deletarViagem(id_viagem, req.usuario.id)
		res.status(200).json({ viagem: viagemDeletada })
	} catch (erro) {
		if (erro.message.includes('organizador') || erro.message.includes('participa')) {
			return res.status(403).json({ mensagem: erro.message })
		}
		res.status(500).json({ mensagem: erro.message })
	}
}

module.exports = { criarViagemController, listarViagensController, editarViagemController, deletarViagemController }
