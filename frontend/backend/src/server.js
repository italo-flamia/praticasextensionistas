// Backend entry point — Node.js + Express.
// This is a scaffold only. No database connection is wired up yet.
// When ready, uncomment the PostgreSQL pool in ./db/connection.js
// and mount the routes below.

import express from "express";
import cors from "cors";
import "dotenv/config";

// import usuariosRoutes from "./routes/usuarios.routes.js";
// import viagensRoutes from "./routes/viagens.routes.js";
// import participantesRoutes from "./routes/participantes.routes.js";
// import votacoesRoutes from "./routes/votacoes.routes.js";
// import opcoesRoutes from "./routes/opcoes.routes.js";
// import votosRoutes from "./routes/votos.routes.js";
// import despesasRoutes from "./routes/despesas.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "collab-travel-api" }));

// app.use("/usuarios", usuariosRoutes);
// app.use("/viagens", viagensRoutes);
// app.use("/participantes", participantesRoutes);
// app.use("/votacoes", votacoesRoutes);
// app.use("/opcoes", opcoesRoutes);
// app.use("/votos", votosRoutes);
// app.use("/despesas", despesasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Collab Travel API listening on http://localhost:${PORT}`);
});
