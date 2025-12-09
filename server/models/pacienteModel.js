const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Profissional = require('./profissionalModel')

const Paciente = sequelize.define('Paciente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  data_nascimento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  convenio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero_convenio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Profissional,
      key: 'id',
    },
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Profissional,
    },
  },
    createdAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: sequelize.NOW
},
updatedAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: sequelize.NOW
}
})

module.exports = Paciente
