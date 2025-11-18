const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Consulta = sequelize.define('Consulta', {
  protocolo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => {
      return `PROTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
  },
  pacienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pacientes',
      key: 'id',
    },
  },
  medicoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Profissionais',
      key: 'id',
    },
  },
  data_consulta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_consulta: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('primeira_consulta', 'retorno', 'emergencia'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'agendada',
      'confirmada',
      'em_atendimento',
      'realizada',
      'cancelada',
      'faltou',
    ),
    defaultValue: 'agendada',
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  data_confirmacao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  data_cancelamento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  motivo_cancelamento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  agendadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Profissionais',
      key: 'id',
    },
  },
})

module.exports = Consulta
