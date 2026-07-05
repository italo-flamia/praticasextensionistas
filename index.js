const express = require('express');
const cors = require('cors');
require('dotenv').config();
const autenticarToken = require('./src/middlewares/authMiddleware.js');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require ('./src/routes/authRoutes.js')
app.use('/api/auth', authRoutes)

// Rota de Viagens
const viagensRoutes = require ('./src/routes/viagensRoutes.js');
// Rota de Participantes
const participantesRoutes = require('./src/routes/participantesRoutes');
// Rota de Votações
const votacoesRoutes = require('./src/routes/votacoesRoutes');
// Rota de Despesas
const despesasRoutes = require('./src/routes/despesasRoutes');
// Rota de Contato
const contatoRoutes = require('./src/routes/contatoRoutes');

app.use('/api/viagens', viagensRoutes);
app.use('/api/viagens/:id_viagem/participantes', participantesRoutes);
app.use('/api/viagens/:id_viagem/votacoes', votacoesRoutes);
app.use('/api/viagens/:id_viagem/despesas', despesasRoutes);
app.use('/api/contato', contatoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor rodando!' });
});

app.get('/api/teste-auth', autenticarToken, (req, res) => {
  res.json({ mensagem: 'Autenticado com sucesso!', usuario: req.usuario });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
