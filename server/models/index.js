const { Sequelize } = require('sequelize')
const sequelize = require('../config/database')
const Paciente = require('./pacienteModel')
const Profissional = require('./profissionalModel')
const Consulta = require('./consultaModel')
const Atendimento = require('./atendimentoModel')

Paciente.hasMany(Consulta, { foreignKey: 'pacienteId' })
Consulta.belongsTo(Paciente, { as: 'paciente', foreignKey: 'pacienteId' })

Profissional.hasMany(Consulta, { foreignKey: 'medicoId' })
Consulta.belongsTo(Profissional, { as: 'medico', foreignKey: 'medicoId' })

Consulta.hasOne(Atendimento, { foreignKey: 'consultaId' })
Atendimento.belongsTo(Consulta, { foreignKey: 'consultaId' })

Profissional.hasMany(Atendimento, { foreignKey: 'medicoId' })
Atendimento.belongsTo(Profissional, { as: 'medico', foreignKey: 'medicoId' })

Profissional.hasMany(Consulta, { foreignKey: 'agendadoPor' })
Consulta.belongsTo(Profissional, { as: 'recepcionista', foreignKey: 'agendadoPor' })


module.exports = {
  sequelize,
  Paciente,
  Profissional,
  Consulta,
  Atendimento,
}
