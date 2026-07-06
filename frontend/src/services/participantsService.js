import { apiRequest } from "./api";

export async function getParticipants(tripId) {
  return apiRequest(`/api/viagens/${tripId}/participantes`);
}

export async function addParticipant(tripId, payload) {
  return apiRequest(`/api/viagens/${tripId}/participantes`, {
    method: "POST",
    body: {
      email_usuario: payload.email_usuario,
      funcao_participante: payload.funcao_participante || "Participante",
    },
  });
}
