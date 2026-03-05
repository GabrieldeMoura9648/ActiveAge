const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path'); // ADICIONADO → permite trabalhar com caminhos de arquivos

const { testConnection } = require('./config/db');

const authRoutes = require('./routes/auth');
const medicoRoutes = require('./routes/medico');
const pacienteRoutes = require('./routes/paciente');
const agendamentoRoutes = require('./routes/agendamento');

const app = express();

const PORT = process.env.PORT || 3000; // MODIFICADO → agora usa variável do .env 

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', medicoRoutes);
app.use('/api', pacienteRoutes);
app.use('/api', agendamentoRoutes);


/* ---------------------------------------------------
   BLOCO ADICIONADO → SERVIR FRONTEND PELO NODE
--------------------------------------------------- */

app.use(express.static(path.join(__dirname, '../frontend')));
// ADICIONADO → permite acessar arquivos HTML/CSS/JS da pasta frontend

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
// MODIFICADO → agora "/" retorna o index.html

/* --------------------------------------------------- */


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  testConnection();
});