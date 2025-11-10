const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const router = express.Router();

router.post('/cadastrar', async (req, res) => {
  const { nome, email, senha, tipoUsuario, termos } = req.body;

  if (!nome || !email || !senha || !tipoUsuario || !termos) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios, incluindo os termos.' });
  }

  try {
    const [emailExistente] = await pool.query(
      'SELECT idUsuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (emailExistente.length > 0) {
      return res.status(400).json({ mensagem: 'Este e-mail já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const statusVerificacao = (tipoUsuario === 'MEDICO') ? 'PENDENTE' : 'APROVADO';

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipoPerfil, statusVerificacao) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senhaHash, tipoUsuario, statusVerificacao]
    );

    res.status(201).json({ 
      mensagem: 'Usuário criado com sucesso!', 
      idUsuario: resultado.insertId 
    });

  } catch (error) {
    console.error('Erro no endpoint /cadastrar:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor. Tente novamente.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const payload = {
      id: usuario.idUsuario,
      nome: usuario.nome,
      tipoPerfil: usuario.tipoPerfil,
      statusVerificacao: usuario.statusVerificacao
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    res.status(200).json({
      mensagem: 'Login bem-sucedido!',
      token: token,
      usuario: payload
    });

  } catch (error) {
    console.error('Erro no endpoint /login:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor. Tente novamente.' });
  }
});

module.exports = router;