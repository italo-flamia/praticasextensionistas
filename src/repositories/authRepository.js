//buscar a função que comunica com o banco dentro do db.js
const pool = require ('../config/db.js')

//busca se o email já foi cadastrado
const buscarPorEmail = async (email_usuario) => { 
	const resultado = await pool.query('SELECT * FROM usuarios WHERE email_usuario = $1', [email_usuario])
	return resultado.rows[0]
}

//insere um novo cadastro de usuário
const inserirUsuario = async (nome_usuario, email_usuario, senha_usuario) => {
	const resultado = await pool.query('INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario) VALUES ($1, $2, $3) RETURNING *', [nome_usuario, email_usuario, senha_usuario])
	return resultado.rows[0]
}

//exporta as funções definidas
module.exports = {buscarPorEmail, inserirUsuario}
