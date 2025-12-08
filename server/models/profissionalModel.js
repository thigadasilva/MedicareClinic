const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Profissional = sequelize.define('Profissional', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
  },
  crm: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  especialidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  perfil: {
    type: DataTypes.ENUM('admin', 'medico', 'recepcionista'),
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
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
},
{
  tableName: 'Profissionals', // <-- força o nome certo
  timestamps: true
});

module.exports = Profissional
