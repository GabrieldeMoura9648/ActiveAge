const express = require("express");
const { pool } = require("../config/db");
const { verificarToken } = require("../middleware/authMiddleware"); // Importa o "guarda"

const router = express.Router();

router.get("/medicos", verificarToken, async (req, res) => {
  try {
    const [medicos] = await pool.query(
      `SELECT 
         u.idUsuario, 
         u.nome, 
         md.crm, 
         md.biografia, 
         md.especializacoes 
       FROM usuarios u
       JOIN medico_detalhes md ON u.idUsuario = md.idUsuario
       WHERE u.tipoPerfil = 'MEDICO' 
       AND u.statusVerificacao = 'APROVADO'`
    );

    res.status(200).json(medicos);
  } catch (error) {
    console.error("Erro no endpoint /api/medicos:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
});

router.get("/medicos/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [medicos] = await pool.query(
      `SELECT u.idUsuario, u.nome, md.crm, md.biografia, md.especializacoes 
       FROM usuarios u
       JOIN medico_detalhes md ON u.idUsuario = md.idUsuario
       WHERE u.idUsuario = ? AND u.tipoPerfil = 'MEDICO' AND u.statusVerificacao = 'APROVADO'`,
      [id]
    );

    if (medicos.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Médico não encontrado ou não aprovado." });
    }

    res.status(200).json(medicos[0]);
  } catch (error) {
    console.error("Erro no endpoint /api/medicos/:id:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
});

router.get("/medicos/:id/horarios", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [horarios] = await pool.query(
      `SELECT idHorario, dataHoraInicio, dataHoraFim 
       FROM horarios_disponiveis 
       WHERE idMedico = ? 
       AND status = 'DISPONIVEL' 
       AND dataHoraInicio > NOW()
       ORDER BY dataHoraInicio ASC`,
      [id]
    );

    res.status(200).json(horarios);
  } catch (error) {
    console.error("Erro no endpoint /api/medicos/:id/horarios:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
});

router.post("/agendamentos", verificarToken, async (req, res) => {
  const { id: idPaciente, tipoPerfil } = req.usuario;

  if (tipoPerfil !== "PACIENTE_CUIDADOR") {
    return res
      .status(403)
      .json({ mensagem: "Acesso negado. Apenas pacientes podem agendar." });
  }

  const { idHorario } = req.body;
  if (!idHorario) {
    return res.status(400).json({ mensagem: "O ID do horário é obrigatório." });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [horarios] = await connection.query(
      "SELECT * FROM horarios_disponiveis WHERE idHorario = ? AND status = ? FOR UPDATE",
      [idHorario, "DISPONIVEL"]
    );

    if (horarios.length === 0) {
      await connection.rollback();
      return res
        .status(409)
        .json({
          mensagem:
            "Este horário não está mais disponível. Por favor, escolha outro.",
        });
    }

    const horario = horarios[0];

    await connection.query(
      "UPDATE horarios_disponiveis SET status = ? WHERE idHorario = ?",
      ["AGENDADO", idHorario]
    );

    await connection.query(
      `INSERT INTO agendamentos 
         (idPaciente, idMedico, idHorario, dataHoraInicio, dataHoraFim, statusAgendamento) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idPaciente,
        horario.idMedico,
        idHorario,
        horario.dataHoraInicio,
        horario.dataHoraFim,
        "CONFIRMADO",
      ]
    );

    await connection.commit();

    res.status(201).json({ mensagem: "Consulta agendada com sucesso!" });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Erro no endpoint /api/agendamentos POST:", error);
    res
      .status(500)
      .json({ mensagem: "Erro interno no servidor ao tentar agendar." });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/paciente/agendamentos', verificarToken, async (req, res) => {

  const { id: idPaciente, tipoPerfil } = req.usuario;

  if (tipoPerfil !== 'PACIENTE_CUIDADOR') {
    return res.status(403).json({ mensagem: 'Acesso negado.' });
  }

  try {
    const [agendamentos] = await pool.query(
      `SELECT 
         a.idAgendamento, a.dataHoraInicio, a.dataHoraFim, 
         u.nome AS nomeMedico 
       FROM agendamentos a
       JOIN usuarios u ON a.idMedico = u.idUsuario
       WHERE a.idPaciente = ? 
       AND a.statusAgendamento = 'CONFIRMADO'
       AND a.dataHoraInicio > NOW()
       ORDER BY a.dataHoraInicio ASC`,
      [idPaciente]
    );

    res.status(200).json(agendamentos);

  } catch (error) {
    console.error('Erro no endpoint /api/paciente/agendamentos:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

module.exports = router;
