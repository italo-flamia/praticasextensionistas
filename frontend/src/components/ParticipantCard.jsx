import Card from "./Card";
import Badge from "./Badge";

export default function ParticipantCard({ participant }) {
  const initials = (participant.nome_usuario || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "var(--accent-soft)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {participant.nome_usuario}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {participant.email_usuario}
          </div>
        </div>
        <Badge tone={participant.funcao_participante === "organizador" ? "primary" : "neutral"}>
          {participant.funcao_participante}
        </Badge>
      </div>
    </Card>
  );
}
