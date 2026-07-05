const { criarContato } = require('../services/contatoService');

async function criarContatoController(req, res) {
    try {
        const novoContato = await criarContato(req.body);
        res.status(201).json(novoContato);
    } catch (erro) {
        if (erro.message.includes('Campos obrigatórios não preenchidos')) {
            return res.status(400).json({ erro: erro.message });
        }
        res.status(500).json({ erro: 'Erro ao contatar' });
    }
}

module.exports = { criarContatoController };
