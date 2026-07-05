export function formatDate(value) {
  if (!value) return "—";
  try {
    const d = typeof value === "string" && value.length === 10 ? new Date(value + "T12:00:00") : new Date(value);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(value);
  }
}

export function formatDateTime(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return String(value);
  }
}
