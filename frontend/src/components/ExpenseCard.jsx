import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export default function ExpenseCard({ expense, onEdit }) {
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
            <Badge tone="primary">{expense.categoria_despesa}</Badge>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(expense.data_despesa)}</span>
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {expense.descricao_despesa}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Pago por <strong style={{ color: "var(--text)" }}>{expense._pagador_nome}</strong> · reg. {expense._registrado_nome}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            {formatCurrency(expense.valor_despesa)}
          </div>
          {onEdit ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(expense)}>
              <Pencil size={14} />
              Editar
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
