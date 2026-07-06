import { useState } from "react";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { formatDateTime } from "@/utils/formatDate";

export default function PollCard({ poll, participants, onVote }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState([]);
  const [participanteId, setParticipanteId] = useState(participants[0]?.id_participante || "");
  const [feedback, setFeedback] = useState("");

  const isMultiple = poll.permite_multipla;
  const isOpen = !poll.votacao_encerrada_em;
  const totalVotes = poll.opcoes.reduce((acc, o) => acc + o._votos, 0);

  const toggleOption = (id) => {
    if (isMultiple) {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setSelected([id]);
    }
  };

  const confirm = () => {
    if (!participanteId || selected.length === 0) return;
    onVote(poll.id_votacao, participanteId, selected);
    setFeedback("Voto registrado");
    setTimeout(() => setFeedback(""), 1800);
  };

  return (
    <Card style={{ padding: 14 }}>
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{ cursor: "pointer" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <strong style={{ fontSize: 14.5, textTransform: "capitalize" }}>{poll.tipo_votacao}</strong>
              <Badge tone={isOpen ? "primary" : "muted"}>{isOpen ? "aberta" : "encerrada"}</Badge>
              {isMultiple && <Badge tone="neutral">múltipla</Badge>}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              Prazo: {formatDateTime(poll.prazo_votacao)} · {poll.opcoes.length} opções
            </div>
          </div>
          <span style={{ color: "var(--muted)", fontSize: 18 }}>{expanded ? "▴" : "▾"}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          {participants.length > 1 && (
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                Votar como
              </label>
              <select
                value={participanteId}
                onChange={(e) => setParticipanteId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  fontSize: 13,
                }}
              >
                {participants.map((p) => (
                  <option key={p.id_participante} value={p.id_participante}>
                    {p.nome_usuario}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {poll.opcoes.map((o) => {
              const active = selected.includes(o.id_opcao);
              const pct = totalVotes ? Math.round((o._votos / totalVotes) * 100) : 0;
              return (
                <button
                  key={o.id_opcao}
                  onClick={() => toggleOption(o.id_opcao)}
                  style={{
                    position: "relative",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    background: active ? "var(--accent-soft)" : "var(--surface)",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${pct}%`,
                      background: "rgba(15,118,110,0.06)",
                    }}
                  />
                  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>{o.descricao_opcao}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {o._votos} voto{o._votos === 1 ? "" : "s"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Button onClick={confirm} disabled={!selected.length} size="sm">
              Confirmar voto
            </Button>
            {feedback && (
              <span style={{ color: "var(--primary)", fontSize: 13, fontWeight: 600 }}>{feedback}</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
