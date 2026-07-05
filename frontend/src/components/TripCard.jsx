import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { Trash2 } from "lucide-react";

export default function TripCard({ trip, onClick, onDelete, deleting }) {
  return (
    <Card onClick={onClick} interactive>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--text)",
          }}
        >
          {trip.titulo_viagem}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge status={trip.status} />
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={deleting}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(trip);
              }}
              style={{
                minHeight: 32,
                width: 32,
                padding: 0,
                borderRadius: 10,
                color: "#b91c1c",
              }}
            >
              <Trash2 size={16} />
            </Button>
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 14,
          fontSize: 12.5,
          color: "var(--muted)",
        }}
      >
        <Stat label="Participantes" value={trip._participantesCount} />
        <Stat label="Votações" value={trip._votacoesCount} />
      </div>
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px dashed var(--border)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--muted)" }}>Total de despesas</span>
        <strong style={{ fontSize: 16, color: "var(--text)", letterSpacing: "-0.01em" }}>
          {formatCurrency(trip._despesasTotal)}
        </strong>
      </div>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{value ?? "—"}</div>
      <div>{label}</div>
    </div>
  );
}
