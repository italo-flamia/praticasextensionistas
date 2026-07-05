const express = require('express');
const cors = require('cors');
require('dotenv').config();
const autenticarToken = require('./src/middlewares/authMiddleware.js')

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require ('./src/routes/authRoutes.js')
app.use('/api/auth', authRoutes)

// Rota de Viagens
const viagensRoutes = require ('./src/routes/viagensRoutes.js')
app.use('/api/viagens', viagensRoutes)

// Rota de teste
//app.get('/health', (req, res) => {
//  res.json({ status: 'ok', mensagem: 'Servidor rodando!' });
//});

//Teste do authMiddleware
app.get('/api/teste-auth', autenticarToken, (req, res) => {
  res.json({ mensagem: 'Autenticado com sucesso!', usuario: req.usuario});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
