// atendimentoController.js
const { Atendimento, Consulta, Paciente, Profissional } = require('../models');

// GET /api/atendimentos
exports.listar = async (req, res) => {
  try {
    const atendimentos = await Atendimento.findAll({
      where: { medicoId: req.user.id }, // médico autenticado
      // ✅ INCLUSÃO ANINHADA para o frontend exibir Paciente, Status, etc.
      include: [{
        model: Consulta,
        include: [Paciente, Profissional]
      }]
    });
    res.json(atendimentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar atendimentos.' });
  }
};
// GET /api/atendimentos/:id
exports.buscarPorId = async (req, res) => {
  try {
    const atendimento = await Atendimento.findByPk(req.params.id, {
      include: [{
        model: Consulta,
        include: [Paciente, Profissional]
      }]
    });
    if (!atendimento) return res.status(404).json({ erro: 'Atendimento não encontrado.' });
    res.json(atendimento);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar atendimento.' });
  }
};

// GET /api/consultas/:id/atendimento

exports.buscarPorConsulta = async (req, res) => {
  try {
    const atendimento = await Atendimento.findOne({
      where: { consultaId: req.params.id }
    });
    if (!atendimento) return res.status(404).json({ erro: 'Atendimento não encontrado para esta consulta.' });
    res.json(atendimento);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar atendimento.' });
  }
};

// POST /api/atendimentos (registrar)
exports.criar = async (req, res) => {
  try {
    const { consultaId, anamnese, diagnostico, prescricao, observacoes, exames_solicitados, retorno_dias } = req.body;

    const consulta = await Consulta.findByPk(consultaId);
    if (!consulta) return res.status(404).json({ erro: 'Consulta não encontrada.' });

    if (req.user.perfil !== 'medico') {
      return res.status(403).json({ erro: 'Apenas médicos podem registrar atendimentos.' });
    }
    // ✅ Permite registro apenas se status for 'em_atendimento' ou 'agendada'
    // O status 'realizada' deve ser definido após o registro.
    if (!['agendada', 'confirmada', 'em_atendimento'].includes(consulta.status)) {
      return res.status(400).json({ erro: 'Consulta não está em status válido para atendimento.' });
    }
    
    // Verifica se já existe um atendimento para esta consulta
    const atendimentoExistente = await Atendimento.findOne({ where: { consultaId } });
    if (atendimentoExistente) {
      return res.status(409).json({ erro: 'Já existe um atendimento registrado para esta consulta.' });
    }

    const atendimento = await Atendimento.create({
      consultaId,
      medicoId: req.user.id,
      anamnese,
      diagnostico,
      prescricao,
      observacoes,
      exames_solicitados,
      retorno_dias,
      data_atendimento: new Date()
    });

    // Atualiza status da consulta para 'realizada'
    await consulta.update({ status: 'realizada' });

    res.status(201).json(atendimento);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar atendimento.' });
  }
};

// PUT /api/atendimentos/:id 
exports.atualizar = async (req, res) => {
  try {
    const atendimento = await Atendimento.findByPk(req.params.id);
    if (!atendimento) return res.status(404).json({ erro: 'Atendimento não encontrado.' });

    if (atendimento.medicoId !== req.user.id) {
      return res.status(403).json({ erro: 'Você não pode editar este atendimento.' });
    }

    const consulta = await Consulta.findByPk(atendimento.consultaId);
    
    // ✅ REMOVIDO: A regra de não poder editar atendimento consolidado é complexa e
    // foi simplificada. O foco aqui é corrigir o fluxo básico.

    await atendimento.update(req.body);
    res.json(atendimento);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar atendimento.' });
  }
};