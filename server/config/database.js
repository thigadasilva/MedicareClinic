const {Sequelize} = require('sequelize');

console.log('Caminho do DB sendo usado:', process.env.DB_PATH); // <-- ADICIONE ESTA LINHA

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: process.env.DB_PATH
})

module.exports = sequelize;