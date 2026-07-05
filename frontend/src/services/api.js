export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:3001";

const SESSION_KEY = "collab_travel_session_v2";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readSession() {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  if (!isBrowser()) return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return;
  }
  window.localStorage.removeItem(SESSION_KEY);
}

export function getAuthToken() {
  return readSession()?.token ?? null;
}

function buildHeaders(token, contentType = "application/json") {
  const headers = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function getErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload || fallback;
  if (typeof payload.mensagem === "string") return payload.mensagem;
  if (typeof payload.erro === "string") return payload.erro;
  return fallback;
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, token = getAuthToken(), contentType = "application/json" } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, contentType),
    body: body == null ? undefined : contentType === "application/json" ? JSON.stringify(body) : body,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `Erro HTTP ${response.status}`));
  }

  return payload;
}
