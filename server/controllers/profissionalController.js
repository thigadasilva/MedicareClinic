const Profissional = require('../models/profissionalModel')
const bcrypt = require('bcrypt')

// GET /profissionais
exports.listar = async (req, res) => {
  try {
    const profissionais = await Profissional.findAll({
      attributes: { exclude: ['senha'] } // não expõe senha
    })
    res.json(profissionais)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar profissionais.' })
  }
}

// GET /profissionais/:id
exports.buscarPorId = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    })
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado.' })
    res.json(profissional)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar profissional.' })
  }
}

exports.listarMedicos = async (req, res) => {
  try {
 const todos = await Profissional.findAll()
    console.log('Todos profissionais:', todos.map(p => ({
      id: p.id,
      nome: p.nome,
      perfil: p.perfil
    })))

    console.log('Buscando médicos...')
    const medicos = await Profissional.findAll({
      where: { perfil: 'medico'},
      attributes: ['id', 'nome', 'especialidade', 'crm']
    })
      console.log('Medicos encontrados:', medicos)
    res.json(medicos)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar médicos.' })
  }
}

// POST /profissionais
// POST /profissionais
exports.criar = async (req, res) => {
  try {
    const novo = await Profissional.create(req.body)
    res.status(201).json(novo)
  } catch (error) {
    console.error('Erro ao criar profissional:', error)
    res.status(500).json({ erro: 'Erro ao criar profissional.' })
  }
}


// PUT /profissionais/:id
exports.atualizar = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.params.id)
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado!' })

    await profissional.update(req.body)
    res.json(profissional)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar profissional.' })
  }
}

// DELETE /profissionais/:id
exports.deletar = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.params.id)
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado!' })

    await profissional.destroy()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir profissional.' })
  }
}
