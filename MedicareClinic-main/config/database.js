const {Sequelize} = require('sequelize');

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage:'./medicare.db'
})

module.exports = sequelize;