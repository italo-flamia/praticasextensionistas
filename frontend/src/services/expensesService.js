import { apiRequest } from "./api";

function normalizeExpense(expense) {
  return {
    ...expense,
    valor_despesa: Number(Number(expense.valor_despesa || 0).toFixed(2)),
    _pagador_nome: expense._pagador_nome ?? `Participante #${expense.id_pagador}`,
    _registrado_nome: expense._registrado_nome ?? `Participante #${expense.id_registrado_por}`,
  };
}

export async function getExpenses(tripId) {
  const expenses = await apiRequest(`/api/viagens/${tripId}/despesas`);
  return expenses.map(normalizeExpense);
}

export async function addExpense(tripId, payload) {
  const created = await apiRequest(`/api/viagens/${tripId}/despesas`, {
    method: "POST",
    body: {
      descricao_despesa: payload.descricao_despesa,
      categoria_despesa: payload.categoria_despesa,
      valor_despesa: Number(Number(payload.valor_despesa).toFixed(2)),
      data_despesa: payload.data_despesa,
    },
  });

  return normalizeExpense(created);
}

export async function updateExpense(tripId, expenseId, payload) {
  const updated = await apiRequest(`/api/viagens/${tripId}/despesas/${expenseId}`, {
    method: "PUT",
    body: {
      descricao_despesa: payload.descricao_despesa,
      categoria_despesa: payload.categoria_despesa,
      valor_despesa: Number(Number(payload.valor_despesa).toFixed(2)),
      data_despesa: payload.data_despesa,
    },
  });

  return normalizeExpense(updated);
}

export async function getFinancialSummary(tripId) {
  const summary = await apiRequest(`/api/viagens/${tripId}/despesas/resumo`);
  return summary.map((item) => ({
    ...item,
    total_pago: Number(Number(item.total_pago || 0).toFixed(2)),
    diferenca: Number(Number(item.diferenca || 0).toFixed(2)),
  }));
}
