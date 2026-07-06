export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled,
  style,
  fullWidth,
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: size === "sm" ? 13 : 15,
    padding: size === "sm" ? "8px 12px" : "12px 16px",
    minHeight: size === "sm" ? 36 : 46,
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "transform .05s ease, background .15s ease, border-color .15s ease",
    width: fullWidth ? "100%" : undefined,
    letterSpacing: "-0.005em",
  };
  const variants = {
    primary: { background: "var(--primary)", color: "var(--primary-foreground)" },
    secondary: {
      background: "var(--surface)",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    ghost: { background: "transparent", color: "var(--text)" },
    danger: { background: "#fee2e2", color: "#991b1b" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}
