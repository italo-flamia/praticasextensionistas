const pool = require('../config/db');
const { inserirContato } = require('../repositories/contatoRepository');

async function criarContato(dados) {
  const { nome_contato, email_contato, mensagem_contato } = dados;

  if (!nome_contato || !email_contato || !mensagem_contato) {
    throw new Error('Campos obrigatórios não preenchidos');
  }

  const novoContato = await inserirContato(pool, {
    nome_contato,
    email_contato,
    mensagem_contato,
  });

  return novoContato;
}

module.exports = { criarContato };
