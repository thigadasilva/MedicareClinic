const express = require('express')
const router = express.Router()
const pacienteController = require('../controllers/pacienteController')
const authMiddleware = require('../middlewares/authMiddleware')



router.use(authMiddleware)

router.get('/pacientes', pacienteController.listar)
router.get('/pacientes/:id', pacienteController.buscarPorId)
router.get('/pacientes/:id/historico', pacienteController.buscarHistorico)
router.post('/pacientes', pacienteController.criar)
router.put('/pacientes/:id', pacienteController.atualizar)
router.delete('/pacientes/:id', pacienteController.deletar)

module.exports = router
