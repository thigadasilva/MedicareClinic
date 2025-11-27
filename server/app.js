require('dotenv').config({ path: 'C:/Users/aluno.lauro/Documents/vueprojeto/MedicareClinic/.env' });



const cors = require('cors')
const express = require('express')
const app = express()
const sequelize = require('./config/database')
const PORT = process.env.PORT || 3000
const rotasPaciente = require('./routes/pacienteRoutes')
const rotasAuth = require('./routes/authRoutes')

app.use(express.json())
app.use(cors({
  origin:  'http://localhost:5173'
}))


app.use((req, res, next) => {
  console.log(`Recebendo requisição: ${req.method} para URL: ${req.url}`);
  next();
});

app.use('/pacientes', rotasPaciente)
app.use('/api/auth', rotasAuth);

sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado.')
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http:127.0.0.1:${PORT}`)
  })
})
