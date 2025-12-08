const express = require('express')
const router = express.Router()
const pacienteController = require('../controllers/pacienteController')
const authMiddleware = require('../middlewares/authMiddleware')



router.use(authMiddleware)

router.get('/', pacienteController.listar)
router.get('/:id', pacienteController.buscarPorId)
router.get('/:id/historico', pacienteController.buscarHistorico)
router.post('/', pacienteController.criar)
router.patch('/:id', pacienteController.atualizar)
router.delete('/:id', pacienteController.deletar)

console.log('Rotas de pacientes carregadas');

module.exports = router
