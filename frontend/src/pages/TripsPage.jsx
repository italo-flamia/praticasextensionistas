import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import MobileOnlyLayout from "@/components/MobileOnlyLayout";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import TripCard from "@/components/TripCard";
import EmptyState from "@/components/EmptyState";
import { getCurrentUser, logout } from "@/services/authService";
import { getTrips, createTrip, deleteTrip } from "@/services/tripsService";

const STATUSES = ["Planejamento", "Em votacao", "Em andamento", "Finalizada"];

export default function TripsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo_viagem: "", status: "Planejamento" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingTripId, setDeletingTripId] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate({ to: "/auth" });
        return;
      }

      setUser(currentUser);

      try {
        const data = await getTrips();
        if (active) setTrips(data);
      } catch (err) {
        if (active) setError(err.message || "Erro ao carregar viagens.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo_viagem.trim()) return;

    setError("");

    try {
      await createTrip(form);
      setTrips(await getTrips());
      setForm({ titulo_viagem: "", status: "Planejamento" });
      setOpen(false);
    } catch (err) {
      setError(err.message || "Erro ao criar viagem.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth" });
  };

  const handleDeleteTrip = async (trip) => {
    const confirmed = window.confirm(`Excluir a viagem "${trip.titulo_viagem}"?`);
    if (!confirmed) return;

    setError("");
    setDeletingTripId(trip.id_viagem);

    try {
      await deleteTrip(trip.id_viagem);
      setTrips((current) => current.filter((item) => item.id_viagem !== trip.id_viagem));
    } catch (err) {
      setError(err.message || "Erro ao excluir viagem.");
    } finally {
      setDeletingTripId(null);
    }
  };

  if (!user) return null;

  return (
    <MobileOnlyLayout>
      <Header
        title="Collab Travel"
        subtitle={`Ola, ${String(user.nome_usuario || "usuario").split(" ")[0]}`}
        right={
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              fontSize: 12,
              cursor: "pointer",
              padding: 6,
            }}
          >
            Sair
          </button>
        }
      />

      <div style={{ padding: "16px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Suas viagens</h2>
          <Button size="sm" onClick={() => setOpen(true)}>
            + Nova
          </Button>
        </div>

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

        {loading ? (
          <EmptyState title="Carregando viagens" description="Aguarde enquanto buscamos os dados do backend." />
        ) : trips.length === 0 ? (
          <EmptyState
            title="Nenhuma viagem ainda"
            description="Crie sua primeira viagem para comecar a organizar o grupo."
            action={<Button onClick={() => setOpen(true)}>Nova viagem</Button>}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id_viagem}
                trip={trip}
                onClick={() => navigate({ to: "/viagens/$id", params: { id: String(trip.id_viagem) } })}
                onDelete={handleDeleteTrip}
                deleting={deletingTripId === trip.id_viagem}
              />
            ))}
          </div>
        )}

      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova viagem">
        <form onSubmit={submit}>
          <Input
            label="Titulo da viagem"
            placeholder="Ex: Fim de ano em Floripa"
            value={form.titulo_viagem}
            onChange={(e) => setForm((current) => ({ ...current, titulo_viagem: e.target.value }))}
            required
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              Criar
            </Button>
          </div>
        </form>
      </Modal>
    </MobileOnlyLayout>
  );
}
