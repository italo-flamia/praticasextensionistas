import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,24,39,0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
        animation: "ct-fade .15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 20,
          boxShadow: "0 -8px 30px rgba(17,24,39,0.15)",
          animation: "ct-slide .2s ease",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: "#e5e7eb",
            borderRadius: 999,
            margin: "0 auto 14px",
          }}
        />
        {title && (
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
      <style>{`
        @keyframes ct-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ct-slide { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
