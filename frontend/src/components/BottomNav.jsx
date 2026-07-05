import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageSquare } from "lucide-react";

const items = [
  { to: "/viagens", label: "Viagens", icon: Home },
  { to: "/contato", label: "Contato", icon: MessageSquare },
];

export default function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav
      aria-label="Menu principal"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        padding: "8px 14px calc(8px + env(safe-area-inset-bottom))",
        background: "rgba(246,247,249,0.92)",
        borderTop: "1px solid var(--border)",
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          display: "grid",
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: 8,
        }}
      >
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                minHeight: 46,
                borderRadius: 14,
                textDecoration: "none",
                color: active ? "var(--primary)" : "var(--muted)",
                background: active ? "var(--accent-soft)" : "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              <Icon size={18} strokeWidth={2.3} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
