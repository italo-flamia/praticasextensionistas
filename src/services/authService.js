const {buscarPorEmail, inserirUsuario} = require ('../repositories/authRepository.js')
const bcrypt = require ('bcrypt')
const jsonwebtoken = require ('jsonwebtoken')

const registrarUsuario = async (nome, email, senha) => {
  // 1. verificar se email já existe
  const usuarioExistente = await buscarPorEmail(email)
  if (usuarioExistente) {
    throw new Error('Email já cadastrado')
  }

  // 2. fazer hash da senha
  const senhaHash = await bcrypt.hash(senha, 10)

  // 3. inserir no banco
  const novoUsuario = await inserirUsuario(nome, email, senhaHash)

  // 4. retornar
  return novoUsuario
}

const logarUsuario = async (email, senha) => {
  // 1. busca usuário
  const usuario = await buscarPorEmail(email)
  if (!usuario) {
    throw new Error('Email não cadastrado')
  }

  // 2. compara senha
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_usuario)
  if (!senhaCorreta) {
    throw new Error('Senha incorreta')
  }

  // 3. gera token
  const token = jsonwebtoken.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1d' })

  return token
}

module.exports = {registrarUsuario, logarUsuario}
