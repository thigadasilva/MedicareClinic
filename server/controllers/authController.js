const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Profissional } = require('../models')

const SALT_ROUNDS = 10; 

// POST /api/auth/login
exports.login = async (req, res) => {
   console.log('Dados recebidos do Front-end:', req.body);
  try {
    const { email, senha } = req.body;

    const profissional = await Profissional.findOne({ where: { email } });
    if (!profissional) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    if (!profissional.status) {
      return res.status(403).json({ erro: 'Usuário inativo.' });
    }

      console.log('Senha recebida do Postman:', senha);
    console.log('Hash do banco de dados:', profissional.senha);

    const senhaValida = await bcrypt.compare(senha, profissional.senha);

      console.log('Resultado da comparação (senhaValida):', senhaValida);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    console.log('JWT Secret value:', process.env.JWT_SECRET);

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

exports.cadastrar = async (req,res) =>{
    // Pega os campos necessários do corpo da requisição POST
    const { nome, email, crm, especialidade, perfil, status, senha } = req.body

    // Validação básica se os campos obrigatórios estão presentes
    if(!email || !senha || !nome){
        return res.status(400).json({ erro: "Nome, Email e senha são obrigatórios."})
    }

    try {
        // Verifica se já existe um profissional com esse e-mail
        const existente = await Profissional.findOne({ where:{ email }})

        if(existente) {
            return res.status(400).json({ erro:"Email já está em uso."});
        }

        // Gera o hash da senha de forma segura antes de salvar
        const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);

        // Cria o novo profissional no banco de dados
        const novo = await Profissional.create({
            nome,
            email,
            crm,
            especialidade,
            perfil: perfil || 'medico', // Define 'medico' como padrão se não for especificado
            status: status !== undefined ? status : true, // Status ativo por padrão
            senha: senhaCriptografada // Salva o hash na coluna 'senha'
        });

        res.status(201).json({
            mensagem: "Profissional criado com sucesso.",
            profissional:{ id:novo.id, nome: novo.nome, email: novo.email}
        });

    } catch (error) {
        console.error(error); // Loga o erro completo para debug
        res.status(500).json({ erro:"Erro ao criar usuário."});
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