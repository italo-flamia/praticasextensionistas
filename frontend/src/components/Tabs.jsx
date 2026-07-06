export default function Tabs({ tabs, value, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        gap: 4,
        background: "#eef1f5",
        padding: 4,
        borderRadius: 12,
        margin: "0 16px",
      }}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              border: "none",
              background: active ? "var(--surface)" : "transparent",
              color: active ? "var(--text)" : "var(--muted)",
              fontWeight: 600,
              fontSize: 13,
              padding: "9px 8px",
              borderRadius: 9,
              cursor: "pointer",
              boxShadow: active ? "0 1px 2px rgba(17,24,39,0.06)" : "none",
              transition: "all .15s ease",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
