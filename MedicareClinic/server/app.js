require('dotenv').config();

const express = require('express')
const app = express()
const sequelize = require('./config/database')
const PORT = process.env.PORT || 3000
const rotasPaciente = require('./routes/pacienteRoutes')

app.use(express.json())

app.use('/pacientes', rotasPaciente)

sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado.')
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http:127.0.0.1:${PORT}`)
  })
})
