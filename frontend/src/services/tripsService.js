import { apiRequest } from "./api";
import { getParticipants } from "./participantsService";
import { getPolls } from "./pollsService";

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

async function getTripExpensesTotal(idViagem) {
  try {
    const expenses = await apiRequest(`/api/viagens/${idViagem}/despesas`);
    const totalEmCentavos = expenses.reduce((acc, item) => acc + Math.round(Number(item.valor_despesa || 0) * 100), 0);
    return toMoney(totalEmCentavos / 100);
  } catch {
    return 0;
  }
}

async function getTripParticipantsCount(idViagem) {
  try {
    const participants = await getParticipants(idViagem);
    return Array.isArray(participants) ? participants.length : 0;
  } catch {
    return 0;
  }
}

async function getTripPollsCount(idViagem) {
  try {
    const polls = await getPolls(idViagem);
    return Array.isArray(polls) ? polls.length : 0;
  } catch {
    return 0;
  }
}

function normalizeTrip(trip, metadata) {
  return {
    id_viagem: trip.id_viagem,
    titulo_viagem: trip.titulo_viagem,
    status: trip.status,
    _participantesCount: metadata._participantesCount,
    _votacoesCount: metadata._votacoesCount,
    _despesasTotal: metadata._despesasTotal,
  };
}

export async function getTrips() {
  const response = await apiRequest("/api/viagens");
  const trips = Array.isArray(response?.viagens) ? response.viagens : [];

  const metadata = await Promise.all(
    trips.map(async (trip) => ({
      _participantesCount: await getTripParticipantsCount(trip.id_viagem),
      _votacoesCount: await getTripPollsCount(trip.id_viagem),
      _despesasTotal: await getTripExpensesTotal(trip.id_viagem),
    })),
  );

  return trips.map((trip, index) => normalizeTrip(trip, metadata[index]));
}

export async function getTripById(id) {
  const trips = await getTrips();
  return trips.find((trip) => String(trip.id_viagem) === String(id)) ?? null;
}

export async function createTrip({ titulo_viagem }) {
  const response = await apiRequest("/api/viagens", {
    method: "POST",
    body: { titulo_viagem },
  });

  return normalizeTrip(response.viagem, {
    _participantesCount: 1,
    _votacoesCount: 0,
    _despesasTotal: 0,
  });
}

export async function updateTripStatus(id, status, titulo_viagem) {
  const response = await apiRequest(`/api/viagens/${id}`, {
    method: "PUT",
    body: { titulo_viagem, status },
  });

  return normalizeTrip(response.viagem, {
    _participantesCount: 0,
    _votacoesCount: 0,
    _despesasTotal: 0,
  });
}

export async function deleteTrip(id) {
  await apiRequest(`/api/viagens/${id}`, {
    method: "DELETE",
  });
}
