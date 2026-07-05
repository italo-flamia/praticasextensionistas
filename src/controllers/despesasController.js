const despesasService = require('../services/despesasService');

async function criarDespesaController(req, res) {
  try {
    const { id_viagem } = req.params;
    const novaDespesa = await despesasService.criarDespesa(req.usuario.id, id_viagem, req.body);
    res.status(201).json(novaDespesa);
  } catch (erro) {
    if (erro.message.includes('não é participante')) {
      return res.status(403).json({ erro: erro.message });
    }
    res.status(500).json({ erro: 'Erro ao criar despesa' });
  }
}

async function listarDespesasController(req, res) {
  try {
    const { id_viagem } = req.params;
    const despesas = await despesasService.listarDespesas(req.usuario.id, id_viagem);
    res.status(200).json(despesas);
  } catch (erro) {
    if (erro.message.includes('não é participante')) {
      return res.status(403).json({ erro: erro.message });
    }
    res.status(500).json({ erro: 'Erro ao listar despesas' });
  }
}

async function editarDespesaController(req, res) {
  try {
    const { id_viagem, id_despesa } = req.params;
    const despesa = await despesasService.editarDespesa(req.usuario.id, id_viagem, id_despesa, req.body);
    res.status(200).json(despesa);
  } catch (erro) {
    if (erro.message.includes('não é participante')) {
      return res.status(403).json({ erro: erro.message });
    }
    res.status(400).json({ erro: erro.message });
  }
}

async function resumoFinanceiroController(req, res) {
  try {
    const { id_viagem } = req.params;
    const resumo = await despesasService.gerarResumoFinanceiro(req.usuario.id, id_viagem);
    res.status(200).json(resumo);
  } catch (erro) {
    if (erro.message.includes('não é participante')) {
      return res.status(403).json({ erro: erro.message });
    }
    res.status(500).json({ erro: 'Erro ao gerar resumo financeiro' });
  }
}

module.exports = { criarDespesaController, listarDespesasController, editarDespesaController, resumoFinanceiroController };
