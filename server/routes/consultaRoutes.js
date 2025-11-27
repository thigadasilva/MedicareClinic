const express = require('express')
const router = express.useRouter()
const consultaController = require('../controllers/consultaController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/consultas', consultaController.listar)
router.get('/consultas/:id', consultaController.buscarPorId)
router.post('/consultas', consultaController.criar)
router.patch('/consultas/:id/status', consultaController.atualizarStatus)
router.patch('/consultas/:id/cancelar', consultaController.cancelar)

module.exports = router