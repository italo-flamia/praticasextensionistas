export function formatCurrency(value) {
  const n = Number(Number(value || 0).toFixed(2));
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
