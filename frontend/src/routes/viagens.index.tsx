import { createFileRoute } from "@tanstack/react-router";
import TripsPage from "@/pages/TripsPage";

export const Route = createFileRoute("/viagens/")({
  head: () => ({
    meta: [
      { title: "Suas viagens — Collab Travel" },
      { name: "description", content: "Lista de viagens em grupo organizadas no Collab Travel." },
    ],
  }),
  component: TripsPage,
});
