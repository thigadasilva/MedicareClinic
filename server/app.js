require('dotenv').config();
const cors = require('cors')
const express = require('express')
const app = express()
const sequelize = require('./config/database')
const PORT = process.env.PORT || 3000
const rotasPaciente = require('./routes/pacienteRoutes')

app.use(express.json())
app.use(cors({
  origin:  'http://localhost:5173'
}))

app.use('/pacientes', rotasPaciente)
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado.')
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http:127.0.0.1:${PORT}`)
  })
})
