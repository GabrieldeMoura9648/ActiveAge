const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/auth');
const medicoRoutes = require('./routes/medico');
const pacienteRoutes = require('./routes/paciente');
const agendamentoRoutes = require('./routes/agendamento');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', medicoRoutes);
app.use('/api', pacienteRoutes);
app.use('/api', agendamentoRoutes);

app.get('/', (req, res) => {
  res.send('API do Active Age está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  testConnection();
});