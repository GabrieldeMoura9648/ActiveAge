const express = require('express');
const { pool } = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware'); // Importa o "guarda"

const router = express.Router();

router.put('/medico/perfil', verificarToken, async (req, res) => {
  const { id, tipoPerfil } = req.usuario;

  if (tipoPerfil !== 'MEDICO') {
    return res.status(403).json({ mensagem: 'Acesso negado. Apenas médicos podem preencher o perfil.' });
  }

  const { crm, biografia, especializacoes } = req.body;

  if (!crm) {
    return res.status(400).json({ mensagem: 'O campo CRM é obrigatório.' });
  }

  try {
    await pool.query(
      `INSERT INTO medico_detalhes (idUsuario, crm, biografia, especializacoes) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       crm = ?, biografia = ?, especializacoes = ?`,
      [id, crm, biografia, especializacoes, crm, biografia, especializacoes]
    );

    await pool.query(
      `UPDATE usuarios SET statusVerificacao = 'APROVADO' 
       WHERE idUsuario = ?`,
      [id]
    );

    res.status(200).json({ mensagem: 'Perfil salvo com sucesso! Agora você está visível para pacientes.' });

  } catch (error) {
    console.error('Erro no endpoint /medico/perfil:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});


router.post('/medico/horarios', verificarToken, async (req, res) => {

  const { id, tipoPerfil } = req.usuario;

  if (tipoPerfil !== 'MEDICO') {
    return res.status(403).json({ mensagem: 'Acesso negado. Apenas médicos.' });
  }

  const { dataHoraInicio, dataHoraFim } = req.body;

  if (!dataHoraInicio || !dataHoraFim) {
    return res.status(400).json({ mensagem: 'Data de início e data de fim são obrigatórias.' });
  }

  try {
    await pool.query(
      'INSERT INTO horarios_disponiveis (idMedico, dataHoraInicio, dataHoraFim, status) VALUES (?, ?, ?, ?)',
      [id, dataHoraInicio, dataHoraFim, 'DISPONIVEL']
    );

    res.status(201).json({ mensagem: 'Horário cadastrado com sucesso!' });

  } catch (error) {
    console.error('Erro no endpoint /medico/horarios POST:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

router.get('/medico/horarios', verificarToken, async (req, res) => {

  const { id, tipoPerfil } = req.usuario;

  if (tipoPerfil !== 'MEDICO') {
    return res.status(403).json({ mensagem: 'Acesso negado. Apenas médicos.' });
  }

  try {
    const [horarios] = await pool.query(
      `SELECT idHorario, dataHoraInicio, dataHoraFim, status 
       FROM horarios_disponiveis 
       WHERE idMedico = ? AND dataHoraInicio > NOW()
       ORDER BY dataHoraInicio ASC`,
      [id]
    );

    res.status(200).json(horarios);

  } catch (error) {
    console.error('Erro no endpoint /medico/horarios GET:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

router.get('/medico/agendamentos', verificarToken, async (req, res) => {

  const { id: idMedico, tipoPerfil } = req.usuario;

  if (tipoPerfil !== 'MEDICO') {
    return res.status(403).json({ mensagem: 'Acesso negado.' });
  }

  try {
    const [agendamentos] = await pool.query(
      `SELECT 
         a.idAgendamento, a.dataHoraInicio, a.dataHoraFim, 
         u.nome AS nomePaciente 
       FROM agendamentos a
       JOIN usuarios u ON a.idPaciente = u.idUsuario
       WHERE a.idMedico = ? 
       AND a.statusAgendamento = 'CONFIRMADO'
       AND a.dataHoraInicio > NOW()
       ORDER BY a.dataHoraInicio ASC`,
      [idMedico]
    );

    res.status(200).json(agendamentos);

  } catch (error) {
    console.error('Erro no endpoint /api/medico/agendamentos:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

module.exports = router;