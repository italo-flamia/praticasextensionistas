export default function Input({ label, hint, style, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      {label && (
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text)",
            marginBottom: 6,
          }}
        >
          {label}
        </span>
      )}
      <input
        {...rest}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "12px 14px",
          fontSize: 15,
          color: "var(--text)",
          outline: "none",
          ...style,
        }}
      />
      {hint && (
        <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          {hint}
        </span>
      )}
    </label>
  );
}
