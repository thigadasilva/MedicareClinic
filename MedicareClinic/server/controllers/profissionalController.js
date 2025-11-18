const Profissional = require('../models/profissionalModel')

// GET /pacientes
exports.listar = async (req, res) => {
  const profissionais = await Profissional.findAll()
  res.json(pacientes)
}
// GET /pacientes/:id
exports.buscarPorId = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id)
  if (paciente) res.json(paciente)
  else res.status(404).json({ erro: 'Paciente não encontrado.' })
}
// POST /pacientes
exports.criar = async (req, res) => {
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    endereco,
    cidade,
    estado,
    cep,
    convenio,
    numero_convenio,
  } = req.body
  const novo = await Paciente.create({
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    endereco,
    cidade,
    estado,
    cep,
    convenio,
    numero_convenio,
  })
  res.status(201).json(novo)
}
// PUT /pacientes/:id
exports.atualizar = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id)
  if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado!' })
  await paciente.update(req.body)
  res.json(paciente)
}

//DELETE /pacientes/:id
exports.deletar = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id)
  if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado!' })
  await paciente.destroy()
  res.sendStatus(200)
}
