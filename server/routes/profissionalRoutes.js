const express = require('express')
const router = express.Router()
const profissionalController = require('../controllers/profissionalController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/profissionais', profissionalController.listar)
router.get('/medicos', profissionalController.listarMedicos)
router.post('/profissionais', profissionalController.criar)
router.delete('/profissionais/:id', profissionalController.deletar)

module.exports = router
