import { apiRequest } from "./api";

export async function getPolls(tripId) {
  return apiRequest(`/api/viagens/${tripId}/votacoes`);
}

export async function createPoll(tripId, payload) {
  return apiRequest(`/api/viagens/${tripId}/votacoes`, {
    method: "POST",
    body: {
      tipo_votacao: payload.tipo_votacao,
      permite_multipla: payload.permite_multipla,
      prazo_votacao: payload.prazo_votacao,
      opcoes: payload.opcoes,
    },
  });
}

export async function votePoll() {
  throw new Error("Votação individual ainda não foi implementada neste backend.");
}
