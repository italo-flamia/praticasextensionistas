import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/pages/AuthPage";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Collab Travel" },
      { name: "description", content: "Acesse sua conta ou cadastre-se no Collab Travel." },
    ],
  }),
  component: AuthPage,
});
