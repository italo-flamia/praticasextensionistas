import { createFileRoute } from "@tanstack/react-router";
import TripDetailsPage from "@/pages/TripDetailsPage";

export const Route = createFileRoute("/viagens/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes da viagem — Collab Travel" },
      { name: "description", content: "Participantes, votações e despesas da viagem." },
    ],
  }),
  component: TripDetailsPage,
});
