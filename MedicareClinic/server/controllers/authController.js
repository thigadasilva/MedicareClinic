const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Profissional } = require('../models')

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const profissional = await Profissional.findOne({ where: { email } });
    if (!profissional) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    if (!profissional.status) {
      return res.status(403).json({ erro: 'Usuário inativo.' });
    }

    const senhaValida = await bcrypt.compare(senha, profissional.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        id: profissional.id,
        perfil: profissional.perfil,
        nome: profissional.nome,
        email: profissional.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no login.' });
  }
};

// POST /api/auth/logout 
exports.logout = async (req, res) => {
  res.json({ mensagem: 'Logout realizado com sucesso.' });
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.user.id, {
      attributes: { exclude: ['senha_hash'] }
    });
    if (!profissional) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json(profissional);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
};