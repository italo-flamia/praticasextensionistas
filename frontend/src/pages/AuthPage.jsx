import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import MobileOnlyLayout from "@/components/MobileOnlyLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { login, register } from "@/services/authService";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, senha: form.senha });
      } else {
        await register({ nome: form.nome, email: form.email, senha: form.senha });
      }
      navigate({ to: "/viagens" });
    } catch (err) {
      setError(err.message || "Erro ao continuar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileOnlyLayout>
      <div style={{ padding: "48px 20px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            CT
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Collab Travel
          </h1>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
            Organize viagens em grupo de forma simples.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#eef1f5",
            borderRadius: 10,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {[
            { v: "login", l: "Entrar" },
            { v: "register", l: "Criar conta" },
          ].map((t) => {
            const active = mode === t.v;
            return (
              <button
                key={t.v}
                onClick={() => {
                  setMode(t.v);
                  setError("");
                }}
                style={{
                  border: "none",
                  background: active ? "var(--surface)" : "transparent",
                  color: active ? "var(--text)" : "var(--muted)",
                  fontWeight: 600,
                  fontSize: 13,
                  padding: "9px",
                  borderRadius: 7,
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 2px rgba(17,24,39,0.06)" : "none",
                }}
              >
                {t.l}
              </button>
            );
          })}
        </div>

        <form onSubmit={submit}>
          {mode === "register" && (
            <Input
              label="Nome"
              placeholder="Seu nome"
              value={form.nome}
              onChange={set("nome")}
              required
            />
          )}
          <Input
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            value={form.email}
            onChange={set("email")}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••"
            value={form.senha}
            onChange={set("senha")}
            required
          />

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              {error}
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
      </div>
    </MobileOnlyLayout>
  );
}
