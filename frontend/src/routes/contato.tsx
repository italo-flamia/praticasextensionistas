import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/pages/ContactPage";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato - Collab Travel" },
      { name: "description", content: "Envie problemas, duvidas e sugestoes para o desenvolvedor." },
    ],
  }),
  component: ContactPage,
});
