const TONES = {
  neutral: { bg: "#f3f4f6", fg: "#374151" },
  primary: { bg: "var(--accent-soft)", fg: "var(--primary)" },
  warning: { bg: "#fef3c7", fg: "#92400e" },
  success: { bg: "#dcfce7", fg: "#166534" },
  muted: { bg: "#eef2f7", fg: "#4b5563" },
};

const STATUS_TONE = {
  Planejamento: "muted",
  "Em votação": "warning",
  "Em andamento": "primary",
  Finalizada: "success",
};

export default function Badge({ children, tone = "neutral", status }) {
  const t = TONES[status ? STATUS_TONE[status] || "neutral" : tone] || TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: "0.01em",
        background: t.bg,
        color: t.fg,
        whiteSpace: "nowrap",
      }}
    >
      {children ?? status}
    </span>
  );
}
