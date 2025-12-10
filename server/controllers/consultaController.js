const { Consulta, Paciente, Profissional } = require('../models')
const { Op } = require('sequelize');


//GET /consultas
exports.listar = async (req, res) => {
    try{
        const { data, medicoId, pacienteId, status } = req.query;
        const where = {}

        //Aplica filtros se existirem na requisição
        if (data) where.data_consulta = data;
        if (medicoId) where.medicoId = medicoId;
        if (pacienteId) where.pacienteId = pacienteId;
        if (status) where.status = status;

        const consultas = await Consulta.findAll({
            where,
            include:[
                { model: Paciente, as: 'paciente', attributes: ['id', 'nome', 'cpf'] },
                { model: Profissional, as: 'medico', attributes: ['id', 'nome', 'especialidade'] }
            ],
            order: [['data_consulta', 'ASC'], ['hora_consulta', 'ASC']]
        });
        res.json(consultas);
    } catch (error){
        res.status(500).json({erro: 'Erro ao listar consultar.', detalhe: error.message})
    }
}

exports.totalAgendadas = async (req, res) => {
  try {
    const total = await Consulta.count({
      where: { status: 'agendada' }
    })
    res.json({ totalAgendadas: total })
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao contar consultas agendadas.' })
  }
}

//GET /consultas/:id
exports.buscarPorId = async (req, res) =>{
    try{
        const consulta = await Consulta.findByPk(req.params.id, {
            include:[
                { model: Paciente, as: 'paciente' },
                { model: Profissional, as: 'medico' }
            ]
        });
        if(!consulta) return res.status(404).json({erro: 'Consulta não encontrada.'});
        res.json(consulta);
    } catch (error) {
        res.status(500).json({erro: 'Erro ao buscar consulta'})
    }
}

//POST /consultas
exports.criar = async (req, res) => {
  try {
    const { pacienteId, medicoId, data_consulta, hora_consulta, tipo, motivo } = req.body;

    const conflito = await Consulta.findOne({
      where: {
        medicoId,
        data_consulta,
        hora_consulta,
        status: { [Op.notIn]: ['cancelada', 'faltou'] }
      }
    });
    if (conflito) {
      return res.status(400).json({ erro: 'Horário indisponível para este médico.' });
    }

    const protocolo = `${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`;

    const novaConsulta = await Consulta.create({
  protocolo,
  pacienteId,
  medicoId,
  data_consulta,
  hora_consulta,
  tipo,
  motivo,
  status: 'agendada',
  agendadoPor: req.user.id   // ✅ quem agendou
})
    res.status(201).json(novaConsulta);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao agendar consulta.', detalhe: error.message });
  }
};

//PATCH /consultas/:id/status (Atualizar o status)
exports.atualizarStatus = async (req, res) => {
    try{
        const { status } = req.body;
        const consulta = await Consulta.findByPk(req.params.id);

        if(!consulta) return res.status(404).json({erro: 'Consulta não encontrada.'});

        await consulta.update({ status });
        res.json(consulta);
    } catch (error) {
        res.status(500).json({erro: 'Erro ao atualizar status.'})
    }
}

//PATCH /consultas/:id/cancelar
exports.cancelar = async (req, res) => {
  try {
    const { motivo_cancelamento } = req.body;
    const consulta = await Consulta.findByPk(req.params.id);

    if (!consulta) return res.status(404).json({ erro: 'Consulta não encontrada.' });

    await consulta.update({
      status: 'cancelada',
      motivo_cancelamento,
      data_cancelamento: new Date()
    });
    res.json({ mensagem: 'Consulta cancelada com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cancelar consulta.', detalhe: error.message });
  }
}

// DELETE /consultas/:id
exports.excluir = async (req, res) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);

    if (!consulta) {
      return res.status(404).json({ erro: 'Consulta não encontrada.' });
    }

    await consulta.destroy();   // remove do banco
    res.json({ mensagem: 'Consulta excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir consulta.', detalhe: error.message });
  }
};
