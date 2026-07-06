import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import BottomNav from "./BottomNav";

export default function MobileOnlyLayout({ children }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [wide, setWide] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 500 : false,
  );
  const showBottomNav = pathname !== "/auth";

  useEffect(() => {
    const handler = () => setWide(window.innerWidth > 500);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (wide) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          color: "#111827",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
        }}
      >
        <p style={{ maxWidth: 480, fontSize: 16, lineHeight: 1.5 }}>
          O Collab Travel está disponível apenas para dispositivos com largura menor que 500px.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        paddingBottom: showBottomNav ? 92 : 32,
      }}
    >
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
