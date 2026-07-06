import { apiRequest, readSession, writeSession } from "./api";

function inferNameFromEmail(email) {
  return String(email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();
}

export async function login({ email, senha }) {
  const loginResponse = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, senha },
  });

  const authCheck = await apiRequest("/api/teste-auth", {
    token: loginResponse.token,
  });

  const session = {
    token: loginResponse.token,
    usuario: {
      id_usuario: authCheck?.usuario?.id ?? null,
      nome_usuario: inferNameFromEmail(email) || email,
      email_usuario: email,
    },
  };

  writeSession(session);
  return session.usuario;
}

export async function register({ nome, email, senha }) {
  const response = await apiRequest("/api/auth/registro", {
    method: "POST",
    body: { nome, email, senha },
  });

  const loginResponse = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, senha },
  });

  const session = {
    token: loginResponse.token,
    usuario: response.usuario,
  };

  writeSession(session);
  return session.usuario;
}

export function logout() {
  writeSession(null);
}

export function getCurrentUser() {
  const session = readSession();
  if (!session?.token) return null;
  return session.usuario ?? null;
}

export function getCurrentSession() {
  return readSession();
}
