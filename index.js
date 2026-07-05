const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require ('./src/routes/authRoutes.js')
app.use('/api/auth', authRoutes)

// Rota de Viagens
const viagensRoutes = require ('./src/routes/viagensRoutes');
// Rota de Despesas
const despesasRoutes = require('./src/routes/despesasRoutes');
// Rota de Contato
const contatoRoutes = require('./src/routes/contatoRoutes');

app.use('/api/viagens', viagensRoutes);
app.use('/api/viagens/:id_viagem/despesas', despesasRoutes);
app.use('/api/contato', contatoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
