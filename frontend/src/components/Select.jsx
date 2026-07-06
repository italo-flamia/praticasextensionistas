export default function Select({ label, children, ...rest }) {
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
      <select
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
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%236B7280' stroke-width='2' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 36,
        }}
      >
        {children}
      </select>
    </label>
  );
}
