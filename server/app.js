require('dotenv').config();
const cors = require('cors')
const express = require('express')
const rotasPaciente = require('./routes/pacienteRoutes')
const rotasAuth = require('./routes/authRoutes')
const rotasConsultas = require('./routes/consultaRoutes')
const rotasProfissionais = require('./routes/profissionalRoutes')

const app = express()
const sequelize = require('./config/database')
const PORT = process.env.PORT || 3000

console.log('Caminho do DB sendo usado:', process.env.DB_PATH); 

app.use(express.json())
app.use(cors({
  origin:  'http://localhost:5173'
}))


app.use((req, res, next) => {
  console.log(`Recebendo requisição: ${req.method} para URL: ${req.url}`);
  next();
});

app.use('/pacientes', rotasPaciente)
app.use('/api/auth', rotasAuth)
app.use('/profissionais', rotasProfissionais)
app.use('/consultas', rotasConsultas)


sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado.')
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}`)
  })
})
