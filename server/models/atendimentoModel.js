const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Atendimento = sequelize.define('Atendimento', {
  consultaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Consultas',
      key: 'id',
    },
  },
  anamnese: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  prescricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  exames_solicitados: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  retorno_dias: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  medicoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Profissionals',
      key: 'id',
    },
  },
  data_atendimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
})

module.exports = Atendimento
