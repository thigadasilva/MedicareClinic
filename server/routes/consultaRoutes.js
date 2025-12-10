const express = require('express')
const router = express.Router()
const consultaController = require('../controllers/consultaController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', consultaController.listar)
router.get('/total-agendadas', consultaController.totalAgendadas)
router.get('/:id', consultaController.buscarPorId)
router.post('/', consultaController.criar)
router.patch('/:id/status', consultaController.atualizarStatus)
router.patch('/:id/cancelar', consultaController.cancelar)
router.delete('/:id', consultaController.excluir)   
module.exports = router
