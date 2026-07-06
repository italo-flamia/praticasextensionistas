export default function EmptyState({ title, description, action }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 20px",
        color: "var(--muted)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: "var(--accent-soft)",
          color: "var(--primary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
          fontSize: 22,
        }}
      >
        ✦
      </div>
      <h3
        style={{
          margin: 0,
          color: "var(--text)",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ margin: "6px 0 14px", fontSize: 13, color: "var(--muted)" }}>{description}</p>
      )}
      {action}
    </div>
  );
}
