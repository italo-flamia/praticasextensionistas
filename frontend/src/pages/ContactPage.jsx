import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Send, Copy, CheckCircle2 } from "lucide-react";
import MobileOnlyLayout from "@/components/MobileOnlyLayout";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import { getCurrentUser } from "@/services/authService";
import { createContactMessage } from "@/services/contactService";

const STORAGE_KEY = "collab_travel_contact_reports_v1";

export default function ContactPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [form, setForm] = useState({
    nome: user?.nome_usuario || "",
    email: user?.email_usuario || "",
    mensagem: "",
  });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (event) => {
    setSent(false);
    setCopied(false);
    setError("");
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const reportText = buildReport(form);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createContactMessage(form);
      saveLocalReport(form);
      setSent(true);
      setForm((current) => ({ ...current, mensagem: "" }));
    } catch (err) {
      setError(err.message || "Erro ao enviar mensagem.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
  };

  return (
    <MobileOnlyLayout>
      <Header
        title="Contato"
        subtitle="Fale com o desenvolvedor"
        left={<BackButton onClick={() => navigate({ to: "/viagens" })} />}
      />

      <main style={{ padding: "16px" }}>
        <Card
          style={{
            borderRadius: 18,
            marginBottom: 14,
            background:
              "linear-gradient(180deg, rgba(15,118,110,0.08) 0%, rgba(255,255,255,1) 52%)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Reportar ou sugerir</h2>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 13, lineHeight: 1.45 }}>
                Descreva o que aconteceu ou qual melhoria voce gostaria de ver.
              </p>
            </div>
          </div>
        </Card>

        <Card style={{ borderRadius: 18 }}>
          <form onSubmit={submit}>
            <Input label="Seu nome" value={form.nome} onChange={set("nome")} required />
            <Input label="Seu e-mail" type="email" value={form.email} onChange={set("email")} required />
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Mensagem
              </span>
              <textarea
                value={form.mensagem}
                onChange={set("mensagem")}
                required
                minLength={10}
                rows={6}
                placeholder="Ex: tentei criar uma despesa e apareceu uma mensagem de erro..."
                style={{
                  width: "100%",
                  resize: "vertical",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px",
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "var(--text)",
                  background: "var(--surface)",
                  outline: "none",
                }}
              />
            </label>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#991b1b",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                {error}
              </div>
            )}

            {sent && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  background: "#ecfdf5",
                  color: "#166534",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                <CheckCircle2 size={17} />
                Mensagem enviada e salva neste aparelho.
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <Button type="submit" fullWidth disabled={form.mensagem.trim().length < 10 || submitting}>
                Enviar para o desenvolvedor
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={copyReport}>
                <Copy size={16} />
                {copied ? "Mensagem copiada" : "Copiar mensagem"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </MobileOnlyLayout>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Voltar"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)",
        fontSize: 16,
      }}
    >
      ←
    </button>
  );
}

function buildReport(form) {
  return [
    `Nome: ${form.nome}`,
    `Email: ${form.email}`,
    "",
    "Mensagem:",
    form.mensagem,
  ].join("\n");
}

function saveLocalReport(form) {
  try {
    const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    current.unshift({
      ...form,
      criadoEm: new Date().toISOString(),
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 20)));
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...form, criadoEm: new Date().toISOString() }]),
    );
  }
}
