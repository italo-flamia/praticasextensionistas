export default function Card({ children, onClick, style, interactive }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
        cursor: interactive || onClick ? "pointer" : "default",
        transition: "border-color .15s ease, transform .05s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
