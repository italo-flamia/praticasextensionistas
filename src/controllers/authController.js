const {registrarUsuario, logarUsuario} = require ('../services/authService.js')

const registro = async (req,res) => {
	try {
	const { nome, email, senha } = req.body
	const novoUsuario = await registrarUsuario(nome, email, senha)
        delete novoUsuario.senha_usuario
	res.status(201).json({ usuario: novoUsuario })
	}
	catch (erro) {
		res.status(400).json({ mensagem: erro.message }) }
}

const login = async (req, res) => {
	try {
	const {email, senha} = req.body
	const logindoUsuario = await logarUsuario(email, senha)
	res.status(200).json({ token: logindoUsuario })
	}
	catch (erro) {
		res.status(400).json({ mensagem: erro.message})}
}

module.exports = {registro, login}
