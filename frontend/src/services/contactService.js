import { apiRequest } from "./api";

export async function createContactMessage({ nome, email, mensagem }) {
  return apiRequest("/api/contato", {
    method: "POST",
    token: null,
    body: {
      nome_contato: nome,
      email_contato: email,
      mensagem_contato: mensagem,
    },
  });
}
