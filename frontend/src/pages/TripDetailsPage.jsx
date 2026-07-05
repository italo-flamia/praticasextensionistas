import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import MobileOnlyLayout from "@/components/MobileOnlyLayout";
import Header from "@/components/Header";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import EmptyState from "@/components/EmptyState";
import ExpenseCard from "@/components/ExpenseCard";
import Card from "@/components/Card";
import { getCurrentUser } from "@/services/authService";
import { getTripById, updateTripStatus } from "@/services/tripsService";
import { getExpenses, addExpense, updateExpense, getFinancialSummary } from "@/services/expensesService";
import { getParticipants, addParticipant } from "@/services/participantsService";
import { getPolls, createPoll } from "@/services/pollsService";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const CATEGORIES = ["Hospedagem", "Transporte", "Alimentação", "Passeios", "Outros"];
const STATUSES = ["Planejamento", "Em votação", "Em andamento", "Finalizada"];

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

export default function TripDetailsPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [tab, setTab] = useState("despesas");
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [polls, setPolls] = useState([]);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [financialSummary, setFinancialSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!getCurrentUser()) {
        navigate({ to: "/auth" });
        return;
      }

      try {
        await refresh(active);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  const refresh = async (active = true) => {
    try {
      const [tripData, expensesData, participantsData, pollsData] = await Promise.all([
        getTripById(id),
        getExpenses(id),
        getParticipants(id),
        getPolls(id),
      ]);

      if (!active) return;
      setTrip(tripData);
      setExpenses(expensesData);
      setParticipants(participantsData);
      setPolls(pollsData);
      setError("");
    } catch (err) {
      if (!active) return;
      setError(err.message || "Erro ao carregar detalhes da viagem.");
    }
  };

  const total = useMemo(() => {
    const totalEmCentavos = expenses.reduce((acc, expense) => acc + Math.round(Number(expense.valor_despesa || 0) * 100), 0);
    return toMoney(totalEmCentavos / 100);
  }, [expenses]);

  const openSummaryModal = async () => {
    setSummaryLoading(true);
    setError("");
    try {
      const summary = await getFinancialSummary(id);
      setFinancialSummary(summary);
      setSummaryModalOpen(true);
    } catch (err) {
      setError(err.message || "Erro ao carregar resumo financeiro.");
    } finally {
      setSummaryLoading(false);
    }
  };

  if (!trip) {
    return (
      <MobileOnlyLayout>
        <Header title="Viagem" left={<BackButton onClick={() => navigate({ to: "/viagens" })} />} />
        <div style={{ padding: 20 }}>
          <EmptyState
            title={loading ? "Carregando viagem" : "Viagem não encontrada"}
            description={loading ? "Aguarde enquanto buscamos os dados." : "Ela pode ter sido removida."}
          />
        </div>
      </MobileOnlyLayout>
    );
  }

  return (
    <MobileOnlyLayout>
      <Header
        title={trip.titulo_viagem}
        left={<BackButton onClick={() => navigate({ to: "/viagens" })} />}
        right={<Badge status={trip.status} />}
      />

      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
          <Button size="sm" variant="secondary" onClick={() => setTripModalOpen(true)}>
            Editar viagem
          </Button>
          <Button size="sm" onClick={openSummaryModal} disabled={summaryLoading}>
            {trip.status === "Finalizada" ? "Ver resumo" : "Encerrar viagem"}
          </Button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Summary label="Participantes" value={participants.length} />
          <Summary label="Votações" value={polls.length} />
          <Summary label="Despesas" value={formatCurrency(total)} strong />
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "participantes", label: "Participantes" },
          { value: "votacoes", label: "Votações" },
          { value: "despesas", label: "Despesas" },
        ]}
      />

      <div style={{ padding: "16px" }}>
        {tab === "participantes" && (
          <Section
            actionLabel="+ Adicionar"
            onAction={() => setParticipantModalOpen(true)}
            empty={
              participants.length === 0 && (
                <EmptyState
                  title="Sem participantes adicionais"
                  description="Adicione pessoas pelo e-mail já cadastrado no sistema."
                  action={<Button onClick={() => setParticipantModalOpen(true)}>Adicionar participante</Button>}
                />
              )
            }
          >
            {participants.map((participant) => (
              <Card key={participant.id_participante} style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{participant.nome_usuario}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{participant.email_usuario}</div>
                  </div>
                  <Badge>{participant.funcao_participante}</Badge>
                </div>
              </Card>
            ))}
          </Section>
        )}

        {tab === "votacoes" && (
          <Section
            actionLabel="+ Adicionar"
            onAction={() => setPollModalOpen(true)}
            empty={
              polls.length === 0 && (
                <EmptyState
                  title="Sem votações"
                  description="Crie uma votação com pelo menos duas opções."
                  action={<Button onClick={() => setPollModalOpen(true)}>Criar votação</Button>}
                />
              )
            }
          >
            {polls.map((poll) => (
              <Card key={poll.id_votacao} style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{poll.tipo_votacao}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(poll.prazo_votacao)}</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                  {poll.permite_multipla ? "Permite múltiplas escolhas" : "Uma escolha por participante"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {poll.opcoes.map((option) => (
                    <div key={option.id_opcao} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid var(--border)" }}>
                      {option.descricao_opcao}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </Section>
        )}

        {tab === "despesas" && (
          <Section
            actionLabel="+ Adicionar"
            onAction={() => {
              setEditingExpense(null);
              setExpenseModalOpen(true);
            }}
            empty={
              expenses.length === 0 && (
                <EmptyState
                  title="Sem despesas"
                  description="Registre a primeira despesa da viagem."
                  action={<Button onClick={() => setExpenseModalOpen(true)}>Adicionar despesa</Button>}
                />
              )
            }
          >
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id_despesa}
                expense={expense}
                onEdit={(selectedExpense) => {
                  setEditingExpense(selectedExpense);
                  setExpenseModalOpen(true);
                }}
              />
            ))}
          </Section>
        )}
      </div>

      <TripModal
        open={tripModalOpen}
        trip={trip}
        onClose={() => setTripModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            await updateTripStatus(id, payload.status, payload.titulo_viagem);
            await refresh();
            setTripModalOpen(false);
          } catch (err) {
            setError(err.message || "Erro ao atualizar viagem.");
          }
        }}
      />

      <ParticipantModal
        open={participantModalOpen}
        onClose={() => setParticipantModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            await addParticipant(id, payload);
            await refresh();
            setParticipantModalOpen(false);
          } catch (err) {
            setError(err.message || "Erro ao adicionar participante.");
          }
        }}
      />

      <PollModal
        open={pollModalOpen}
        onClose={() => setPollModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            await createPoll(id, payload);
            await refresh();
            setPollModalOpen(false);
          } catch (err) {
            setError(err.message || "Erro ao criar votação.");
          }
        }}
      />

      <SummaryModal
        open={summaryModalOpen}
        trip={trip}
        summary={financialSummary}
        onClose={() => setSummaryModalOpen(false)}
        onFinalize={
          trip.status === "Finalizada"
            ? null
            : async () => {
                try {
                  await updateTripStatus(id, "Finalizada", trip.titulo_viagem);
                  await refresh();
                  setSummaryModalOpen(false);
                } catch (err) {
                  setError(err.message || "Erro ao encerrar viagem.");
                }
              }
        }
      />

      <ExpenseModal
        open={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        categories={CATEGORIES}
        initialValues={editingExpense}
        onSubmit={async (payload) => {
          try {
            if (editingExpense) {
              await updateExpense(id, editingExpense.id_despesa, payload);
            } else {
              await addExpense(id, payload);
            }
            await refresh();
            setExpenseModalOpen(false);
            setEditingExpense(null);
          } catch (err) {
            setError(err.message || "Erro ao salvar despesa.");
          }
        }}
      />
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

function Summary({ label, value, strong }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "10px 12px",
        textAlign: "left",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: strong ? 15 : 17,
          fontWeight: 700,
          marginTop: 4,
          letterSpacing: "-0.01em",
          color: "var(--text)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Section({ children, empty, actionLabel, onAction }) {
  return empty ? (
    empty
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </>
  );
}

function TripModal({ open, onClose, onSubmit, trip }) {
  const [form, setForm] = useState({ titulo_viagem: "", status: STATUSES[0] });

  useEffect(() => {
    if (open && trip) {
      setForm({
        titulo_viagem: trip.titulo_viagem,
        status: trip.status,
      });
    }
  }, [open, trip]);

  return (
    <Modal open={open} onClose={onClose} title="Editar viagem">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <Input
          label="Título da viagem"
          value={form.titulo_viagem}
          onChange={(event) => setForm((current) => ({ ...current, titulo_viagem: event.target.value }))}
          required
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Actions onCancel={onClose} />
      </form>
    </Modal>
  );
}

function ParticipantModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ email_usuario: "", funcao_participante: "Participante" });

  useEffect(() => {
    if (open) setForm({ email_usuario: "", funcao_participante: "Participante" });
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Adicionar participante">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <Input
          label="E-mail do participante"
          type="email"
          value={form.email_usuario}
          onChange={(event) => setForm((current) => ({ ...current, email_usuario: event.target.value }))}
          required
        />
        <Select
          label="Função"
          value={form.funcao_participante}
          onChange={(event) => setForm((current) => ({ ...current, funcao_participante: event.target.value }))}
        >
          <option value="Participante">Participante</option>
          <option value="Organizador">Organizador</option>
        </Select>
        <Actions onCancel={onClose} />
      </form>
    </Modal>
  );
}

function PollModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    tipo_votacao: "",
    permite_multipla: false,
    prazo_votacao: new Date().toISOString().slice(0, 16),
    opcoes: ["", ""],
  });

  useEffect(() => {
    if (open) {
      setForm({
        tipo_votacao: "",
        permite_multipla: false,
        prazo_votacao: new Date().toISOString().slice(0, 16),
        opcoes: ["", ""],
      });
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Criar votação">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ ...form, opcoes: form.opcoes.filter((item) => item.trim()) });
        }}
      >
        <Input
          label="Tipo da votação"
          value={form.tipo_votacao}
          onChange={(event) => setForm((current) => ({ ...current, tipo_votacao: event.target.value }))}
          required
        />
        <Input
          label="Prazo"
          type="datetime-local"
          value={form.prazo_votacao}
          onChange={(event) => setForm((current) => ({ ...current, prazo_votacao: event.target.value }))}
          required
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={form.permite_multipla}
            onChange={(event) => setForm((current) => ({ ...current, permite_multipla: event.target.checked }))}
          />
          Permitir múltiplas escolhas
        </label>
        {form.opcoes.map((opcao, index) => (
          <Input
            key={index}
            label={`Opção ${index + 1}`}
            value={opcao}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                opcoes: current.opcoes.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
              }))
            }
            required={index < 2}
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={() => setForm((current) => ({ ...current, opcoes: [...current.opcoes, ""] }))}
        >
          + Adicionar opção
        </Button>
        <Actions onCancel={onClose} />
      </form>
    </Modal>
  );
}

function SummaryModal({ open, onClose, onFinalize, summary, trip }) {
  return (
    <Modal open={open} onClose={onClose} title={trip?.status === "Finalizada" ? "Resumo final" : "Encerrar viagem"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          {trip?.status === "Finalizada"
            ? "Esta viagem já está finalizada. Abaixo está o resumo financeiro final."
            : "Confira o saldo por participante antes de marcar a viagem como finalizada."}
        </div>

        {summary.length === 0 ? (
          <EmptyState title="Sem resumo disponível" description="Cadastre despesas para gerar o fechamento financeiro." />
        ) : (
          summary.map((item) => (
            <Card key={item.nome_usuario} style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                <strong>{item.nome_usuario}</strong>
                <span>{formatCurrency(item.total_pago)}</span>
              </div>
              <div style={{ fontSize: 12, color: item.diferenca >= 0 ? "#166534" : "#991b1b" }}>
                {item.diferenca >= 0 ? "Recebe" : "Paga"} {formatCurrency(Math.abs(item.diferenca))}
              </div>
            </Card>
          ))
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Fechar
          </Button>
          {onFinalize ? (
            <Button fullWidth onClick={onFinalize}>
              Confirmar encerramento
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

function ExpenseModal({ open, onClose, onSubmit, categories, initialValues }) {
  const [form, setForm] = useState({
    descricao_despesa: "",
    categoria_despesa: categories[0],
    valor_despesa: "",
    data_despesa: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setForm({
        descricao_despesa: initialValues.descricao_despesa || "",
        categoria_despesa: initialValues.categoria_despesa || categories[0],
        valor_despesa: String(initialValues.valor_despesa ?? ""),
        data_despesa: String(initialValues.data_despesa || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
      });
      return;
    }

    setForm({
      descricao_despesa: "",
      categoria_despesa: categories[0],
      valor_despesa: "",
      data_despesa: new Date().toISOString().slice(0, 10),
    });
  }, [open, initialValues, categories]);

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? "Editar despesa" : "Adicionar despesa"}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <Input
          label="Descrição"
          value={form.descricao_despesa}
          onChange={(event) => setForm((current) => ({ ...current, descricao_despesa: event.target.value }))}
          required
        />
        <Select
          label="Categoria"
          value={form.categoria_despesa}
          onChange={(event) => setForm((current) => ({ ...current, categoria_despesa: event.target.value }))}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0"
          value={form.valor_despesa}
          onChange={(event) => setForm((current) => ({ ...current, valor_despesa: event.target.value }))}
          required
        />
        <Input
          label="Data"
          type="date"
          value={form.data_despesa}
          onChange={(event) => setForm((current) => ({ ...current, data_despesa: event.target.value }))}
          required
        />
        <Actions onCancel={onClose} />
      </form>
    </Modal>
  );
}

function Actions({ onCancel }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <Button variant="secondary" fullWidth onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" fullWidth>
        Salvar
      </Button>
    </div>
  );
}
