const express = require('express');
const { pool } = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/agendamentos/:id/cancelar', verificarToken, async (req, res) => {

  const { id: idUsuarioLogado, tipoPerfil } = req.usuario;
  const { id: idAgendamento } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [agendamentos] = await connection.query(
      'SELECT * FROM agendamentos WHERE idAgendamento = ? FOR UPDATE',
      [idAgendamento]
    );

    if (agendamentos.length === 0) {
      await connection.rollback();
      return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }

    const agendamento = agendamentos[0];

    if (agendamento.idPaciente !== idUsuarioLogado && agendamento.idMedico !== idUsuarioLogado) {
      await connection.rollback();
      return res.status(403).json({ mensagem: 'Acesso negado. Você não faz parte desta consulta.' });
    }

    if (agendamento.statusAgendamento === 'CANCELADO') {
        await connection.rollback();
        return res.status(400).json({ mensagem: 'Esta consulta já foi cancelada.' });
    }

    await connection.query(
      'UPDATE agendamentos SET statusAgendamento = ? WHERE idAgendamento = ?',
      ['CANCELADO', idAgendamento]
    );

    if (agendamento.idHorario) {
      await connection.query(
        'UPDATE horarios_disponiveis SET status = ? WHERE idHorario = ?',
        ['DISPONIVEL', agendamento.idHorario]
      );
    }

    await connection.commit();

    res.status(200).json({ mensagem: 'Consulta cancelada com sucesso! O horário foi liberado.' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;